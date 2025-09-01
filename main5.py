from fastapi import FastAPI, HTTPException, Query, Request
from fastapi.middleware.cors import CORSMiddleware
from starlette.templating import Jinja2Templates
from sqlalchemy import create_engine, Column, Integer, String, Float, DateTime, select, desc, Index
from sqlalchemy.orm import sessionmaker, declarative_base
from pydantic import BaseModel
from typing import List, Optional, Dict, Any, Literal
from datetime import datetime, timezone
from dotenv import load_dotenv
import requests, time, os

# 맨 위 import 근처에 추가
from typing import Optional, Dict, Any

# 전역 캐시: 마지막 정상값 저장
Q_CACHE: Dict[str, Dict[str, Any]] = {}
def _cache_put(sym: str, last: float, chg: Optional[float]):
    if last is None: 
        return
    Q_CACHE[sym.upper()] = {
        "symbol": sym.upper(),
        "last": float(last),
        "chg": (None if chg is None else float(chg)),
        "ts": int(time.time()),
    }
def _cache_get(sym: str):
    return Q_CACHE.get(sym.upper())


load_dotenv()

BINANCE_REST    = os.getenv("BINANCE_REST", "https://fapi.binance.com")
DB_URL          = os.getenv("DB_URL", "sqlite:///./tradinggear.db")
WEBHOOK_SECRET  = os.getenv("TG_WEBHOOK_SECRET", "changeme")
REQUEST_TIMEOUT = int(os.getenv("REQUEST_TIMEOUT", "10"))

Base = declarative_base()

class Signal(Base):
    __tablename__ = "signals"
    id       = Column(Integer, primary_key=True, autoincrement=True)
    symbol   = Column(String(40), index=True)
    interval = Column(String(12), index=True)
    side     = Column(String(10))   # LONG/SHORT/EXIT
    reason   = Column(String(300))
    price    = Column(Float)
    ts       = Column(DateTime, index=True)  # UTC

Index("ix_signals_symbol_interval_ts", Signal.symbol, Signal.interval, Signal.ts)

engine = create_engine(DB_URL, echo=False, future=True)
SessionLocal = sessionmaker(bind=engine, expire_on_commit=False, autoflush=False)
Base.metadata.create_all(bind=engine)

app = FastAPI(title="TradingGear — SuperChart-like")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], allow_credentials=True,
    allow_methods=["*"], allow_headers=["*"],
)
templates = Jinja2Templates(directory="templates")

def _get(url: str, params: Dict[str, Any]) -> Any:
    r = requests.get(url, params=params, timeout=REQUEST_TIMEOUT)
    if r.status_code != 200:
        raise HTTPException(status_code=r.status_code, detail=r.text)
    return r.json()

def fetch_klines(symbol: str, interval: str, limit: int = 500):
    data = _get(f"{BINANCE_REST}/fapi/v1/klines",
                {"symbol": symbol.upper(), "interval": interval, "limit": min(limit, 1500)})
    out = []
    for x in data:
        out.append({"t": int(x[0]) // 1000, "o": float(x[1]), "h": float(x[2]),
                    "l": float(x[3]), "c": float(x[4]), "v": float(x[5])})
    return out

def ema(series: List[float], length: int) -> List[float]:
    k = 2 / (length + 1); out=[]; prev=None
    for x in series: prev = x if prev is None else (x*k + prev*(1-k)); out.append(prev)
    return out
def tema(series: List[float], length: int) -> List[float]:
    e1=ema(series,length); e2=ema(e1,length); e3=ema(e2,length)
    return [3*e1[i]-3*e2[i]+e3[i] for i in range(len(series))]
def atr(klines: List[Dict[str, float]], length: int = 14):
    trs=[]; prev_close=None
    for k in klines:
        tr = (k["h"]-k["l"]) if prev_close is None else max(k["h"]-k["l"], abs(k["h"]-prev_close), abs(k["l"]-prev_close))
        trs.append(tr); prev_close=k["c"]
    out=[]; prev=None
    for i,tr in enumerate(trs):
        if i < length:
            out.append(None)
            if i == length-1:
                prev = sum(trs[:length]) / length; out[-1]=prev
        else:
            prev = (prev*(length-1)+tr)/length; out.append(prev)
    return out
def vwap(klines: List[Dict[str, float]]):
    cpv=0.0; cv=0.0; out=[]
    for k in klines:
        tp=(k["h"]+k["l"]+k["c"])/3.0; cpv+=tp*k["v"]; cv+=k["v"]; out.append(cpv/cv if cv>0 else tp)
    return out
def cvd_approx(klines: List[Dict[str, float]]):
    s=0.0; out=[]
    for k in klines:
        if k["c"]>k["o"]: s+=k["v"]
        elif k["c"]<k["o"]: s-=k["v"]
        out.append(s)
    return out

def detect_ob(klines: List[Dict[str, float]], lookback: int = 300, extend: int = 60):
    n=len(klines)
    if n<5: return []
    last_t=klines[-1]["t"]
    start_i=max(1, n-(lookback+extend+50))
    zones: List[Dict[str, Any]]=[]
    atrs=atr(klines,14)
    def min_height(price: float, atr_val: Optional[float]) -> float:
        base = price*0.0002
        return max(base, (atr_val or 0)*0.1)
    for i in range(start_i, n-1):
        b=klines[i]
        top=max(b["o"],b["c"],b["h"]); bottom=min(b["o"],b["c"],b["l"])
        fut=klines[i+1:min(i+1+extend,n)]
        if not fut: continue
        if b["c"]<b["o"] and max(x["h"] for x in fut) >= b["h"]:
            h=top-bottom; m=min_height(b["c"], atrs[i] if i<len(atrs) else None)
            if h<m: pad=(m-h)/2; top+=pad; bottom-=pad
            zones.append({"type":"bullish","start":b["t"],"end":last_t,"top":top,"bottom":bottom})
        if b["c"]>b["o"] and min(x["l"] for x in fut) <= b["l"]:
            h=top-bottom; m=min_height(b["c"], atrs[i] if i<len(atrs) else None)
            if h<m: pad=(m-h)/2; top+=pad; bottom-=pad
            zones.append({"type":"bearish","start":b["t"],"end":last_t,"top":top,"bottom":bottom})
    merged=[]
    def almost_equal(a,b,tol=1e-4):
        m=(abs(a)+abs(b))/2 or 1.0
        return abs(a-b)/m < tol
    for z in zones:
        if any(z["type"]==m["type"] and almost_equal(z["top"],m["top"]) and almost_equal(z["bottom"],m["bottom"]) for m in merged):
            continue
        merged.append(z)
    return merged[-20:]

def crosses_over(prev_a, prev_b, a, b) -> bool:
    return prev_a is not None and prev_b is not None and prev_a <= prev_b and a > b
def crosses_under(prev_a, prev_b, a, b) -> bool:
    return prev_a is not None and prev_b is not None and prev_a >= prev_b and a < b

def run_strategy(klines: List[Dict[str, float]], tema_len: int = 30, atr_len: int = 14, vwap_filter: bool = True, atr_distance_mult: float = 0.0, cooldown_bars: int = 5):
    if len(klines) < max(tema_len, atr_len)+5: return []
    closes=[k["c"] for k in klines]; temas=tema(closes,tema_len); atrs=atr(klines,atr_len); vwaps=vwap(klines)
    sigs=[]; last_sig_idx=None
    for i in range(1,len(klines)):
        c_prev,c_now=closes[i-1],closes[i]; t_prev,t_now=temas[i-1],temas[i]
        v_now=vwaps[i]; a_now=atrs[i] if i<len(atrs) else None
        if t_prev is None or t_now is None or a_now is None: continue
        if atr_distance_mult>0 and abs(c_now-t_now) < atr_distance_mult*a_now: continue
        allow_long  = c_now>=v_now if vwap_filter else True
        allow_short = c_now<=v_now if vwap_filter else True
        make_long  = crosses_over(c_prev,t_prev,c_now,t_now) and allow_long
        make_short = crosses_under(c_prev,t_prev,c_now,t_now) and allow_short
        if make_long or make_short:
            if last_sig_idx is not None and (i-last_sig_idx)<cooldown_bars: continue
            side="LONG" if make_long else "SHORT"
            reason=[f"close×TEMA({tema_len}) cross {'over' if make_long else 'under'}"]
            if vwap_filter: reason.append("VWAP filter")
            if atr_distance_mult>0: reason.append(f"|close−TEMA|≥{atr_distance_mult}×ATR({atr_len})")
            sigs.append({"ts": klines[i]["t"], "side": side, "price": c_now, "reason": "; ".join(reason)})
            last_sig_idx=i
    return sigs

class WebhookIn(BaseModel):
    symbol: str
    side: Literal["LONG","SHORT","EXIT"]
    reason: Optional[str]=None
    price: Optional[float]=None
    interval: Optional[str]="1m"
    ts: Optional[int]=None
    secret: Optional[str]=None

@app.get("/health")
def health(): return {"ok":True, "ts": int(time.time())}

@app.get("/api/klines")
def api_klines(symbol: str = Query(...), interval: str = Query("1m"), limit: int = Query(500)):
    return fetch_klines(symbol, interval, limit)

@app.get("/api/hud")
def api_hud(symbol: str = Query(...), interval: str = Query("1m"), limit: int = Query(500)):
    ks=fetch_klines(symbol,interval,limit)
    if len(ks)<30: raise HTTPException(400,"insufficient klines")
    closes=[k["c"] for k in ks]; vwaps=vwap(ks); atrs=atr(ks,14); temas=tema(closes,30); cvds=cvd_approx(ks)
    last=ks[-1]; a=next((x for x in reversed(atrs) if x is not None), None); t=temas[-1]; v=vwaps[-1]
    trend="up" if (t is not None and last["c"]>=t) else "down"; atrp=(a/last["c"]) if (a and last["c"]!=0) else None
    return {"symbol":symbol.upper(),"interval":interval,"last_price":last["c"],"vwap":v,"tema30":t,"atr14":a,"atrp":atrp,"cvd":cvds[-1],"trend":trend,"ts":last["t"]}

@app.get("/api/zones/ob")
def api_zones_ob(symbol: str = Query(...), interval: str = Query("1m"),
                 lookback: int = Query(300, ge=50, le=3000),
                 extend: int = Query(60, ge=10, le=600),
                 debug: bool = Query(False)):
    ks=fetch_klines(symbol,interval,lookback+extend+120)
    zones=detect_ob(ks,lookback=lookback,extend=extend)
    payload={"symbol":symbol.upper(),"interval":interval,"zones":zones}
    if debug:
        payload["debug"]={"klines":len(ks),"lookback":lookback,"extend":extend,"found":len(zones),"last_time":ks[-1]["t"] if ks else None}
    return payload

@app.post("/api/strategy/run")
def api_strategy_run(symbol: str = Query(...), interval: str = Query("1m"),
                     limit: int = Query(500, ge=50, le=1500),
                     tema_len: int = Query(30, ge=2, le=200),
                     atr_len: int = Query(14, ge=2, le=200),
                     vwap_filter: bool = Query(True),
                     atr_distance_mult: float = Query(0.0, ge=0.0, le=5.0),
                     cooldown_bars: int = Query(5, ge=0, le=100)):
    ks=fetch_klines(symbol,interval,limit)
    sigs=run_strategy(ks,tema_len=tema_len,atr_len=atr_len,vwap_filter=vwap_filter,atr_distance_mult=atr_distance_mult,cooldown_bars=cooldown_bars)
    written=0
    with SessionLocal() as db:
        for s in sigs:
            ts_dt=datetime.fromtimestamp(s["ts"], tz=timezone.utc)
            exists=db.execute(select(Signal).where(Signal.symbol==symbol.upper(),Signal.interval==interval,Signal.ts==ts_dt,Signal.side==s["side"]).limit(1)).scalar_one_or_none()
            if exists: continue
            db.add(Signal(symbol=symbol.upper(), interval=interval, side=s["side"], reason=s["reason"], price=float(s["price"]), ts=ts_dt)); written+=1
        db.commit()
    return {"generated":len(sigs),"inserted":written,"symbol":symbol.upper(),"interval":interval}

@app.get("/api/signals")
def api_signals(symbol: Optional[str]=Query(None), interval: Optional[str]=Query(None), limit: int = Query(100, ge=1, le=1000)):
    with SessionLocal() as db:
        q=select(Signal).order_by(desc(Signal.ts)).limit(limit)
        if symbol: q=q.where(Signal.symbol==symbol.upper())
        if interval: q=q.where(Signal.interval==interval)
        rows=db.execute(q).scalars().all()
    return [{"id":r.id,"symbol":r.symbol,"interval":r.interval,"side":r.side,"reason":r.reason,"price":r.price,"ts":int(r.ts.replace(tzinfo=timezone.utc).timestamp()) if r.ts else None} for r in rows]

@app.post("/tv/webhook")
def tv_webhook(inp: WebhookIn):
    if WEBHOOK_SECRET and inp.secret != WEBHOOK_SECRET: raise HTTPException(401,"invalid secret")
    ts=inp.ts or int(time.time()); ts_dt=datetime.fromtimestamp(ts, tz=timezone.utc)
    with SessionLocal() as db:
        exists=db.execute(select(Signal).where(Signal.symbol==inp.symbol.upper(),Signal.interval==inp.interval,Signal.ts==ts_dt,Signal.side==inp.side).limit(1)).scalar_one_or_none()
        if not exists:
            db.add(Signal(symbol=inp.symbol.upper(), interval=inp.interval, side=inp.side, reason=inp.reason or "TV alert", price=float(inp.price) if inp.price else None, ts=ts_dt)); db.commit()
    return {"ok":True,"saved":True}


@app.get("/")
def index(request: Request):
    return templates.TemplateResponse("index5.html", {"request": request})

# ----- [APPEND-ONLY] Superchart helpers ----- #
from fastapi import Query

# ----- [APPEND-ONLY] Watchlist quotes API ----- #
@app.get("/api/quotes")
def api_quotes(symbols: str = Query(..., description="Comma-separated symbols"),
               interval: str = Query("1m"), limit: int = Query(2)):
    """
    /api/quotes?symbols=BTCUSDT,ETHUSDT,SOLUSDT
    Binance 심볼만 실시간(가까운) 호가/등락률 제공, 그 외는 error 필드 반환
    """
    syms = [s.strip().upper() for s in symbols.split(",") if s.strip()]
    out = []
    for sym in syms:
        try:
            ks = fetch_klines(sym, interval, limit)
            if not ks:
                out.append({"symbol": sym, "error": "no data"})
                continue
            k = ks[-1]
            prev = ks[-2] if len(ks) >= 2 else None
            chg = (k["c"] - prev["c"]) / prev["c"] * 100 if prev and prev["c"] else None
            out.append({"symbol": sym, "last": k["c"], "chg": chg, "ts": k["t"]})
        except Exception as e:
            out.append({"symbol": sym, "error": str(e)})
    return {"quotes": out}

# ---------- [APPEND-ONLY] Yahoo Finance proxy for non-Binance symbols ----------
from fastapi import Query
import time as _time

YF_MAP = {
    # Indices / FX on Yahoo
    "VIX": "^VIX",          # CBOE Volatility Index
    "DXY": "DX-Y.NYB",      # ICE US Dollar Index
    "EURUSD": "EURUSD=X",
    "GBPUSD": "GBPUSD=X",
    "USDJPY": "USDJPY=X",
    # US Stocks
    "AAPL": "AAPL",
    "NFLX": "NFLX",
}

def _yf_map_list(friendly_list):
    out = []
    for s in friendly_list:
        k = s.upper().strip()
        out.append(YF_MAP.get(k, k))
    return out
"""
@app.get("/api/quotes/yf")
def api_quotes_yf(symbols: str = Query(..., description="Comma-separated friendly symbols e.g. VIX,AAPL,EURUSD")):

    try:
        syms = [s.strip().upper() for s in symbols.split(",") if s.strip()]
        yf_syms = _yf_map_list(syms)
        url = "https://query1.finance.yahoo.com/v7/finance/quote"
        r = requests.get(url, params={"symbols": ",".join(yf_syms)}, timeout=REQUEST_TIMEOUT)
        if r.status_code != 200:
            return {"quotes": [{"symbol": s, "error": f"HTTP {r.status_code}"} for s in syms]}
        data = r.json().get("quoteResponse", {}).get("result", [])
        # build inverse map to restore friendly symbols
        inv = {}
        for k,v in YF_MAP.items():
            inv[v.upper()] = k
        # index by Yahoo symbol
        by_y = { (row.get("symbol") or "").upper(): row for row in data }
        out = []
        now_ts = int(_time.time())
        for friendly, y in zip(syms, yf_syms):
            row = by_y.get(y.upper())
            if not row:
                out.append({"symbol": friendly, "error": "no quote"})
                continue
            last = row.get("regularMarketPrice")
            chg  = row.get("regularMarketChangePercent")  # %
            if last is None:
                out.append({"symbol": friendly, "error": "no price"})
                continue
            out.append({"symbol": friendly, "last": float(last), "chg": float(chg) if chg is not None else None, "ts": now_ts})
        return {"quotes": out}
    except Exception as e:
        return {"quotes": [{"symbol": s, "error": str(e)} for s in symbols.split(",")]}
"""
# ---------- [APPEND-ONLY] Unified quotes endpoint (Binance + Yahoo Finance) ----------
"""
import time as _time

YF_MAP = {
    "VIX": "^VIX",          # CBOE Volatility Index
    "DXY": "DX-Y.NYB",      # ICE US Dollar Index
    "EURUSD": "EURUSD=X",
    "GBPUSD": "GBPUSD=X",
    "USDJPY": "USDJPY=X",
    "AAPL": "AAPL",
    "NFLX": "NFLX",
}

def _is_binance_symbol(sym: str) -> bool:
    s = (sym or "").upper()
    # 흔한 선물/현물 표기들
    return any(x in s for x in ("USDT", "USDC", "BTC", "ETH"))

def _yf_map_list(friendly_list):
    out = []
    for s in friendly_list:
        k = s.upper().strip()
        out.append(YF_MAP.get(k, k))
    return out

def _binance_24h(symbol: str):
    try:
        url = f"{BINANCE_REST}/fapi/v1/ticker/24hr"
        r = requests.get(url, params={"symbol": symbol.upper()}, timeout=REQUEST_TIMEOUT)
        if r.status_code != 200:
            return {"symbol": symbol.upper(), "error": f"binance {r.status_code}"}
        j = r.json()
        last = float(j.get("lastPrice")) if j.get("lastPrice") is not None else None
        chg  = float(j.get("priceChangePercent")) if j.get("priceChangePercent") is not None else None
        return {"symbol": symbol.upper(), "last": last, "chg": chg, "ts": int(_time.time())}
    except Exception as e:
        return {"symbol": symbol.upper(), "error": f"binance {e}"}

@app.get("/api/quotes/yf")
def api_quotes_yf(symbols: str = Query(..., description="Comma-separated symbols e.g. VIX,AAPL,EURUSD")):
    try:
        syms = [s.strip().upper() for s in symbols.split(",") if s.strip()]
        yf_syms = _yf_map_list(syms)
        url = "https://query1.finance.yahoo.com/v7/finance/quote"
        r = requests.get(url, params={"symbols": ",".join(yf_syms)}, timeout=REQUEST_TIMEOUT)
        if r.status_code != 200:
            return {"quotes": [{"symbol": s, "error": f"YF HTTP {r.status_code}"} for s in syms]}
        data = r.json().get("quoteResponse", {}).get("result", [])
        by_y = { (row.get("symbol") or "").upper(): row for row in data }
        out = []
        now_ts = int(_time.time())
        for friendly, y in zip(syms, yf_syms):
            row = by_y.get((y or "").upper())
            if not row:
                out.append({"symbol": friendly, "error": "no quote"})
                continue
            last = row.get("regularMarketPrice")
            chg  = row.get("regularMarketChangePercent")
            if last is None:
                out.append({"symbol": friendly, "error": "no price"})
                continue
            out.append({"symbol": friendly, "last": float(last), "chg": float(chg) if chg is not None else None, "ts": now_ts})
        return {"quotes": out}
    except Exception as e:
        return {"quotes": [{"symbol": s, "error": str(e)} for s in symbols.split(",")]}
"""
@app.get("/api/quotes/any")
def api_quotes_any(symbols: str = Query(..., description="Comma-separated symbols, mixes Binance & YF")):
    """
    통합 쿼트:
      - 바이낸스 심볼(USDT/USDC/BTC/ETH 포함)은 Binance 24h에서
      - 나머지는 야후 파이낸스에서
    응답 예: {"quotes":[{"symbol":"BTCUSDT","last":...,"chg":...}, {"symbol":"VIX","last":...,"chg":...}]}
    """
    try:
        syms = [s.strip().upper() for s in symbols.split(",") if s.strip()]
        bn_syms = [s for s in syms if _is_binance_symbol(s)]
        yf_syms = [s for s in syms if not _is_binance_symbol(s)]

        out = []

        # Binance 개별 조회
        for s in bn_syms:
            out.append(_binance_24h(s))

        # Yahoo 일괄 조회
        if yf_syms:
            yf = api_quotes_yf(",".join(yf_syms))
            out.extend(yf.get("quotes", []))

        # 요청 순서에 맞추어 정렬
        by_sym = { q.get("symbol","").upper(): q for q in out }
        ordered = [ by_sym.get(s, {"symbol": s, "error":"not found"}) for s in syms ]
        #return {"quotes": ordered}
        # 호출 호환성 유지용: any2 로 위임
        return api_quotes_any2(symbols=symbols)
    except Exception as e:
        return {"quotes": [{"symbol": s, "error": str(e)} for s in symbols.split(",")]}









# ---------- [PATCH] Robust unified quotes endpoint (Binance + Yahoo + Stooq + computed DXY) ----------
import csv, io, math, time as _time

# 야후 심볼 맵 (친숙명 -> 야후 심볼)
_YF_MAP = {
    "VIX": "^VIX",
    "DXY": "DX-Y.NYB",
    "EURUSD": "EURUSD=X",
    "GBPUSD": "GBPUSD=X",
    "USDJPY": "USDJPY=X",
    "AAPL": "AAPL",
    "NFLX": "NFLX",
}
_YF_HEADERS = {
    "User-Agent": "Mozilla/5.0",
    "Accept": "application/json,text/plain,*/*",
    "Accept-Language": "en-US,en;q=0.9",
    "Connection": "close",
}

def _is_binance_symbol(sym: str) -> bool:
    s = (sym or "").upper()
    return any(x in s for x in ("USDT", "USDC", "BTC", "ETH"))

def _binance_24h(symbol: str):
    try:
        url = f"{BINANCE_REST}/fapi/v1/ticker/24hr"
        r = requests.get(url, params={"symbol": symbol.upper()}, timeout=REQUEST_TIMEOUT)
        if r.status_code != 200:
            return {"symbol": symbol.upper(), "error": f"binance {r.status_code}"}
        j = r.json()
        last = float(j.get("lastPrice")) if j.get("lastPrice") is not None else None
        chg  = float(j.get("priceChangePercent")) if j.get("priceChangePercent") is not None else None
        return {"symbol": symbol.upper(), "last": last, "chg": chg, "ts": int(_time.time())}
    except Exception as e:
        return {"symbol": symbol.upper(), "error": f"binance {e}"}

def _yf_candidates(friendly: str):
    """친숙심볼의 야후 질의 후보 (DXY는 DX=F도 같이 본다)"""
    f = friendly.upper()
    cands = [_YF_MAP.get(f, f)]
    if f == "DXY":
        cands.append("DX=F")  # 폴백(달러인덱스 선물)
    return cands

def _yf_fetch(friendly_syms):
    """
    야후에서 시세 조회 (DXY는 DX-Y.NYB, DX=F 순서로 시도)
    -> dict[friendly] = {"last": float, "chg": float|None}
    """
    if not friendly_syms: return {}
    # 후보 심볼을 모두 합쳐 한 번에 질의
    all_candidates = []
    for s in friendly_syms:
        all_candidates.extend(_yf_candidates(s))
    uniq = sorted(set(all_candidates))
    try:
        url = "https://query1.finance.yahoo.com/v7/finance/quote"
        r = requests.get(url, params={"symbols": ",".join(uniq)}, headers=_YF_HEADERS, timeout=REQUEST_TIMEOUT)
        if r.status_code != 200:
            return {}
        data = r.json().get("quoteResponse", {}).get("result", [])
        by_y = { (row.get("symbol") or "").upper(): row for row in data }

        out = {}
        for friendly in friendly_syms:
            row = None
            for y in _yf_candidates(friendly):
                row = by_y.get((y or "").upper())
                if row: break
            if not row:
                continue

            last = row.get("regularMarketPrice") or row.get("previousClose") or row.get("ask") or row.get("bid")
            chg  = row.get("regularMarketChangePercent")
            if chg is None and row.get("regularMarketChange") is not None and row.get("regularMarketPreviousClose"):
                try:
                    chg = (float(row["regularMarketChange"]) / float(row["regularMarketPreviousClose"])) * 100.0
                except Exception:
                    chg = None
            if last is None:
                continue
            out[friendly.upper()] = {"last": float(last), "chg": (None if chg is None else float(chg))}
        return out
    except Exception:
        return {}

# Stooq 심볼 맵 (친숙명 -> stooq 심볼)
_STQ_MAP = {
    "VIX": "vix.us",
    "AAPL": "aapl.us",
    "NFLX": "nflx.us",
    "EURUSD": "eurusd",
    "GBPUSD": "gbpusd",
    "USDJPY": "usdjpy",
    # DXY 직접 심볼은 불명확 -> 아래 계산식으로 대체
    "USDCAD": "usdcad",
    "USDSEK": "usdsek",
    "USDCHF": "usdchf",
}

def _stooq_fetch(friendly_syms):
    """Stooq CSV -> dict[friendly] = {last, chg=None}"""
    need = []
    for s in friendly_syms:
        ms = _STQ_MAP.get(s.upper())
        if ms: need.append(ms)
    if not need: return {}
    try:
        url = "https://stooq.com/q/l/"
        params = {"s": ",".join(need), "f": "sd2t2ohlcv", "h": "", "e": "csv"}
        r = requests.get(url, params=params, timeout=REQUEST_TIMEOUT)
        if r.status_code != 200 or not r.text:
            return {}
        out = {}
        buf = io.StringIO(r.text)
        reader = csv.DictReader(buf)
        inv = {v: k for k, v in _STQ_MAP.items()}
        for row in reader:
            sym = (row.get("Symbol") or "").lower()
            fr  = inv.get(sym)
            last = row.get("Close")
            if not fr or not last:
                continue
            try:
                v = float(last)
                if math.isfinite(v):
                    out[fr.upper()] = {"last": v, "chg": None}
            except:
                pass
        return out
    except Exception:
        return {}

def _fx_fill_from_erh(pairs: dict):
    """
    부족한 FX 쌍을 exchangerate.host 로 보충 (서버사이드라 CORS 무관)
    pairs 예: {"EURUSD": None, "USDJPY": 150.1, ...} -> 채워서 반환
    """
    def _get(base, quote):
        try:
            u = f"https://api.exchangerate.host/latest?base={base}&symbols={quote}"
            j = requests.get(u, timeout=REQUEST_TIMEOUT).json()
            v = j.get("rates", {}).get(quote)
            return float(v) if v is not None else None
        except Exception:
            return None

    need = {}
    for k,v in pairs.items():
        if v is None:
            if k.endswith("USD") and len(k)==6:   # EURUSD/GBPUSD
                need[k] = _get(k[:3], "USD")
            elif k.startswith("USD") and len(k)==6:  # USDJPY/USDCAD/USDSEK/USDCHF
                need[k] = _get("USD", k[3:])
    for k,v in need.items():
        if v is not None:
            pairs[k] = v
    return pairs

def _compute_dxy_from_fx(fx):
    """
    DXY ≈ 50.14348112 * EURUSD^-0.576 * USDJPY^0.136 * GBPUSD^-0.119 * USDCAD^0.091 * USDSEK^0.042 * USDCHF^0.036
    """
    req = ["EURUSD","USDJPY","GBPUSD","USDCAD","USDSEK","USDCHF"]
    if any(k not in fx for k in req):
        return None
    if any(fx[k] is None for k in req):
        return None
    try:
        w = {"EURUSD":-0.576,"USDJPY":0.136,"GBPUSD":-0.119,"USDCAD":0.091,"USDSEK":0.042,"USDCHF":0.036}
        val = 50.14348112
        for k,exp in w.items():
            val *= math.pow(float(fx[k]), exp)
        return float(val)
    except Exception:
        return None

@app.get("/api/quotes/yf")
def api_quotes_yf(symbols: str = Query(..., description="Comma-separated symbols e.g. VIX,DXY,AAPL,EURUSD")):
    """친숙심볼 → 야후 파이낸스(필요 시 DXY는 DX=F 폴백)"""
    try:
        syms = [s.strip().upper() for s in symbols.split(",") if s.strip()]
        got = _yf_fetch(syms)
        now_ts = int(_time.time())
        out=[]
        for s in syms:
            v = got.get(s)
            if v and v.get("last") is not None:
                out.append({"symbol": s, "last": v["last"], "chg": v.get("chg"), "ts": now_ts})
            else:
                out.append({"symbol": s, "error": "no quote"})
        return {"quotes": out}
    except Exception as e:
        return {"quotes": [{"symbol": s, "error": str(e)} for s in symbols.split(",")]}

@app.get("/api/quotes/any2")
def api_quotes_any2(symbols: str = Query(..., description="Comma-separated symbols (Binance + Yahoo + Stooq)")):
    """
    견고 통합 시세:
      1) Binance 심볼(USDT/USDC/BTC/ETH 포함) → Binance 24h
      2) 나머지: Yahoo 우선 (정상 UA 헤더, DXY는 DX=F 폴백)
      3) Yahoo 실패 시: Stooq 폴백 (last만, chg=None)
      4) DXY는 YF 실패 시 6종 FX로 계산 (모자라면 exchangerate.host 로 보충)
    """
    try:
        syms = [s.strip().upper() for s in symbols.split(",") if s.strip()]
        bn_syms = [s for s in syms if _is_binance_symbol(s)]
        other   = [s for s in syms if s not in bn_syms]

        out = []
        # --- Binance ---
        for s in bn_syms:
            out.append(_binance_24h(s))

        # --- Yahoo ---
        yf_res = _yf_fetch([s for s in other if s != "DXY"])
        # DXY는 별도로 시도 (DX-Y.NYB, DX=F)
        yf_dxy = _yf_fetch(["DXY"]).get("DXY")

        # --- Stooq fallback ---
        need_stq = [s for s in other if s != "DXY" and s not in yf_res]
        stq_res  = _stooq_fetch(need_stq) if need_stq else {}

        # --- DXY 계산 (YF 실패 시) ---
        dxy_val=None; dxy_chg=None
        if yf_dxy and yf_dxy.get("last") is not None:
            dxy_val = yf_dxy.get("last"); dxy_chg = yf_dxy.get("chg")
        elif "DXY" in other:
            fx_need = ["EURUSD","USDJPY","GBPUSD","USDCAD","USDSEK","USDCHF"]
            fx = {}
            # 이미 확보한 값(YF/Stooq) 우선
            for k in fx_need:
                if k in yf_res and yf_res[k].get("last") is not None:
                    fx[k] = yf_res[k]["last"]
                elif k in stq_res and stq_res[k].get("last") is not None:
                    fx[k] = stq_res[k]["last"]
                else:
                    fx[k] = None
            # 부족한 쌍은 exchangerate.host 로 보충
            fx = _fx_fill_from_erh(fx)
            dxy_val = _compute_dxy_from_fx(fx)

        # --- 결과 합치기 ---
        """
        now_ts = int(_time.time())
        tmp={}
        for k, v in yf_res.items():
            tmp[k] = {"symbol": k, "last": v.get("last"), "chg": v.get("chg"), "ts": now_ts}
        for k, v in stq_res.items():
            if k not in tmp:
                tmp[k] = {"symbol": k, "last": v.get("last"), "chg": v.get("chg"), "ts": now_ts}
        if "DXY" in other:
            if dxy_val is not None:
                tmp["DXY"] = {"symbol":"DXY","last":dxy_val,"chg":dxy_chg,"ts":now_ts}
            else:
                tmp["DXY"] = {"symbol":"DXY","error":"no source","ts":now_ts}

        for s in other:
            out.append(tmp.get(s, {"symbol": s, "error": "not found", "ts": now_ts}))

        by_sym = { (q.get("symbol") or "").upper(): q for q in out }
        ordered = [ by_sym.get(s, {"symbol": s, "error": "not found", "ts": now_ts}) for s in syms ]
        return {"quotes": ordered}
        """
        # --- 결과 합치기 ---
        now_ts = int(_time.time())
        tmp={}
        for k, v in yf_res.items():
            tmp[k] = {"symbol": k, "last": v.get("last"), "chg": v.get("chg"), "ts": now_ts}
        for k, v in stq_res.items():
            if k not in tmp:
                tmp[k] = {"symbol": k, "last": v.get("last"), "chg": v.get("chg"), "ts": now_ts}
        if "DXY" in other:
            if dxy_val is not None:
                tmp["DXY"] = {"symbol":"DXY","last":dxy_val,"chg":dxy_chg,"ts":now_ts}
            else:
                tmp["DXY"] = {"symbol":"DXY","error":"no source","ts":now_ts}

        # Binance 쪽(이미 out에 들어있음) + other(tmp)을 모두 out에 싣기
        for s in other:
            out.append(tmp.get(s, {"symbol": s, "error": "not found", "ts": now_ts}))

        # --- [NEW] 캐시 업데이트 (성공값만 저장) ---
        for q in out:
            if q.get("last") is not None and not q.get("error"):
                _cache_put(q["symbol"], q["last"], q.get("chg"))

        # 요청 순서 정렬
        by_sym = { (q.get("symbol") or "").upper(): q for q in out }
        ordered = [ by_sym.get(s, {"symbol": s, "error": "not found", "ts": now_ts}) for s in syms ]

        # --- [NEW] 캐시로 최종 보정: 실패/누락은 캐시값이라도 준다(에러 키 제거) ---
        for i, s in enumerate(syms):
            q = ordered[i]
            if q.get("last") is None or q.get("error"):
                cached = _cache_get(s)
                if cached:
                    ordered[i] = {**cached, "stale": True}  # stale 표시는 덧붙이되 error는 제거

        return {"quotes": ordered}

    except Exception as e:
        return {"quotes": [{"symbol": s, "error": str(e)} for s in symbols.split(",")]}
# ---------- [/PATCH] ----------

