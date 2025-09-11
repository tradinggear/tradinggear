from fastapi import FastAPI, HTTPException, Query, Request
from fastapi.middleware.cors import CORSMiddleware
from starlette.templating import Jinja2Templates
from sqlalchemy import create_engine, Column, Integer, String, Float, DateTime, select, desc, Index
from sqlalchemy.orm import sessionmaker, declarative_base
from pydantic import BaseModel
from typing import List, Optional, Dict, Any, Literal
from datetime import datetime, timezone, timedelta
from dotenv import load_dotenv
import requests, time, os

KST = timezone(timedelta(hours=9))  # UTC+9

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
        "ts": int(time.time()) + 9*3600,
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

app = FastAPI(title="TradingGear — SuperChart-like (KST)")
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
        out.append({"t": (int(x[0]) // 1000) + 9*3600, "o": float(x[1]), "h": float(x[2]),
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
def health(): return {"ok":True, "ts": int(time.time()) + 9*3600}

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
            ts_dt=datetime.fromtimestamp(s["ts"], tz=timezone.utc).astimezone(KST)
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
    ts=inp.ts or int(time.time()) + 9*3600; ts_dt=datetime.fromtimestamp(ts, tz=timezone.utc).astimezone(KST)
    with SessionLocal() as db:
        exists=db.execute(select(Signal).where(Signal.symbol==inp.symbol.upper(),Signal.interval==inp.interval,Signal.ts==ts_dt,Signal.side==inp.side).limit(1)).scalar_one_or_none()
        if not exists:
            db.add(Signal(symbol=inp.symbol.upper(), interval=inp.interval, side=inp.side, reason=inp.reason or "TV alert", price=float(inp.price) if inp.price else None, ts=ts_dt)); db.commit()
    return {"ok":True,"saved":True}



@app.get("/")
def index(request: Request):
    return templates.TemplateResponse("index7.html", {"request": request})

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
        now_ts = int(_time.time()) + 9*3600
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
        return {"symbol": symbol.upper(), "last": last, "chg": chg, "ts": int(_time.time()) + 9*3600}
    except Exception as e:
        return {"symbol": symbol.upper(), "error": f"binance {e}"}
"""
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
        now_ts = int(_time.time()) + 9*3600
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









# ===== [PATCH] Robust unified quotes endpoint (Binance + Yahoo) =====
from fastapi import Query
import time as _time

# 친숙명 -> 야후 티커 매핑
YF_MAP = {
    "VIX": "^VIX",          # CBOE Volatility Index
    "DXY": "DX-Y.NYB",      # ICE Dollar Index
    "EURUSD": "EURUSD=X",
    "GBPUSD": "GBPUSD=X",
    "USDJPY": "USDJPY=X",
    "AAPL": "AAPL",
    "TSLA": "TSLA",
    "NFLX": "NFLX",
}

def _is_binance_symbol(sym: str) -> bool:
    s = (sym or "").upper()
    # 흔한 바이낸스 심볼 패턴
    return any(x in s for x in ("USDT", "USDC", "BTC", "ETH"))

def _binance_24h(symbol: str):
    """선물 24h → 실패 시 Spot 24h 폴백"""
    try:
        url = f"{BINANCE_REST}/fapi/v1/ticker/24hr"
        r = requests.get(url, params={"symbol": symbol.upper()}, timeout=REQUEST_TIMEOUT)
        if r.status_code == 200:
            j = r.json()
            last = float(j["lastPrice"])
            chg  = float(j["priceChangePercent"])
            return {"symbol": symbol.upper(), "last": last, "chg": chg, "ts": int(_time.time()) + 9*3600}
        # 선물에 없으면 Spot으로 폴백
        spot_url = "https://api.binance.com/api/v3/ticker/24hr"
        rs = requests.get(spot_url, params={"symbol": symbol.upper()}, timeout=REQUEST_TIMEOUT)
        if rs.status_code == 200:
            j = rs.json()
            last = float(j["lastPrice"])
            chg  = float(j["priceChangePercent"])
            return {"symbol": symbol.upper(), "last": last, "chg": chg, "ts": int(_time.time()) + 9*3600}
        return {"symbol": symbol.upper(), "error": f"binance HTTP {r.status_code}/{rs.status_code}"}
    except Exception as e:
        return {"symbol": symbol.upper(), "error": f"binance {e}"}

def _yf_fetch(friendly_syms):
    """야후에서 여러 종목 한 번에 가져오기. 실패/누락은 심볼별로 원인 명시."""
    try:
        if not friendly_syms:
            return []
        # 친숙명 → 야후 티커
        mapped = [YF_MAP.get(s, s) for s in friendly_syms]
        url = "https://query1.finance.yahoo.com/v7/finance/quote"
        r = requests.get(
            url,
            params={"symbols": ",".join(mapped)},
            timeout=REQUEST_TIMEOUT,
            headers={
                "User-Agent": "Mozilla/5.0",
                "Accept": "application/json,text/plain,*/*",
                "Accept-Language": "en-US,en;q=0.9",
                "Connection": "close",
            },
        )
        if r.status_code != 200:
            # 전체 실패는 각 심볼에 상태를 심어서 반환
            now = int(_time.time()) + 9*3600
            return [{"symbol": s, "error": f"YF HTTP {r.status_code}", "ts": now} for s in friendly_syms]

        data = r.json().get("quoteResponse", {}).get("result", [])
        by_y = { (row.get("symbol") or "").upper(): row for row in data }
        now = int(_time.time()) + 9*3600
        out = []
        for friendly, y in zip(friendly_syms, mapped):
            row = by_y.get((y or "").upper())
            if not row:
                out.append({"symbol": friendly, "error": "YF no quote", "ts": now})
                continue
            last = row.get("regularMarketPrice")
            chg  = row.get("regularMarketChangePercent")
            if last is None:
                out.append({"symbol": friendly, "error": "YF no price", "ts": now})
            else:
                out.append({
                    "symbol": friendly,
                    "last": float(last),
                    "chg": float(chg) if chg is not None else None,
                    "ts": now
                })
        return out
    except Exception as e:
        now = int(_time.time()) + 9*3600
        return [{"symbol": s, "error": f"YF {e}", "ts": now} for s in friendly_syms]

@app.get("/api/quotes/any2")
def api_quotes_any2(
    symbols: str = Query(..., description="Comma-separated symbols (Binance + Yahoo)")
):
    # 1) 입력 파싱
    syms = [s.strip().upper() for s in symbols.split(",") if s.strip()]
    if not syms:
        return {"quotes": []}

    # 2) 분리
    bn_syms = [s for s in syms if _is_binance_symbol(s)]
    yf_syms = [s for s in syms if not _is_binance_symbol(s)]

    # 3) 조회
    out = []
    for s in bn_syms:
        out.append(_binance_24h(s))
    out.extend(_yf_fetch(yf_syms))

    # 4) 요청 순서 보존해서 리턴
    by = { (q.get("symbol") or "").upper(): q for q in out }
    ordered = [ by.get(s, {"symbol": s, "error": "no quote source"}) for s in syms ]
    return {"quotes": ordered}



# ===== [APPEND-ONLY] YF 429 Guard: cache + rate-limit + backoff =====
import time as _time, random as _rand

YF_TTL_SEC       = int(os.getenv("YF_TTL_SEC", "30"))      # cache TTL seconds
YF_MIN_INTERVAL  = float(os.getenv("YF_MIN_INTERVAL", "1.2"))  # min interval between YF calls
YF_MAX_RETRY     = int(os.getenv("YF_MAX_RETRY", "2"))
YF_BACKOFF_BASE  = float(os.getenv("YF_BACKOFF_BASE", "0.8"))
YF_BACKOFF_JIT   = float(os.getenv("YF_BACKOFF_JIT", "0.25"))

_YF_CACHE: Dict[str, Dict[str, Any]] = {}
_YF_LAST_CALL_TS = 0.0

def _yf_headers():
    return {"User-Agent": "Mozilla/5.0"}

def _yf_cache_put(sym: str, last: float, chg: Optional[float]):
    _YF_CACHE[sym] = {"ts": int(_time.time()) + 9*3600, "last": last, "chg": chg}

def _yf_cache_get(sym: str):
    v = _YF_CACHE.get(sym)
    if not v: return None
    if int(_time.time()) + 9*3600 - v["ts"] > YF_TTL_SEC:
        return None
    return v

def _yf_sleep_to_rate_limit():
    global _YF_LAST_CALL_TS
    now = _time.time()
    wait = (_YF_LAST_CALL_TS + YF_MIN_INTERVAL) - now
    if wait > 0:
        _time.sleep(wait)
    _YF_LAST_CALL_TS = _time.time()

def _yf_fetch_batch(y_syms: list[str]) -> dict:
    out: Dict[str, Dict[str, Any]] = {}
    if not y_syms:
        return out
    url = "https://query1.finance.yahoo.com/v7/finance/quote"
    _yf_sleep_to_rate_limit()
    retry = 0
    while True:
        try:
            r = requests.get(url, params={"symbols": ",".join(y_syms)},
                             headers=_yf_headers(), timeout=REQUEST_TIMEOUT)
            if r.status_code == 200:
                data = r.json().get("quoteResponse", {}).get("result", [])
                by_y = { (row.get("symbol") or "").upper(): row for row in data }
                now_ts = int(_time.time()) + 9*3600
                for friendly, y in zip(y_syms, y_syms):
                    row = by_y.get((y or "").upper())
                    if not row:
                        c = _yf_cache_get(friendly)
                        if c:
                            out[friendly] = {"last": c["last"], "chg": c["chg"], "ts": now_ts, "cached": True}
                        else:
                            out[friendly] = {"error": "no quote"}
                        continue
                    last = row.get("regularMarketPrice")
                    chg  = row.get("regularMarketChangePercent")
                    if last is None:
                        c = _yf_cache_get(friendly)
                        if c:
                            out[friendly] = {"last": c["last"], "chg": c["chg"], "ts": now_ts, "cached": True}
                        else:
                            out[friendly] = {"error": "no price"}
                    else:
                        _yf_cache_put(friendly, float(last), float(chg) if chg is not None else None)
                        out[friendly] = {"last": float(last), "chg": float(chg) if chg is not None else None, "ts": now_ts}
                return out
            elif r.status_code == 429 and retry < YF_MAX_RETRY:
                ra = r.headers.get("Retry-After")
                if ra:
                    try:
                        _time.sleep(float(ra))
                    except:
                        pass
                delay = (YF_BACKOFF_BASE ** (retry+1)) + (_rand.random() * YF_BACKOFF_JIT)
                _time.sleep(delay)
                retry += 1
                continue
            else:
                now_ts = int(_time.time()) + 9*3600
                for friendly in y_syms:
                    c = _yf_cache_get(friendly)
                    if c:
                        out[friendly] = {"last": c["last"], "chg": c["chg"], "ts": now_ts, "cached": True}
                    else:
                        out[friendly] = {"error": f"YF HTTP {r.status_code}"}
                return out
        except Exception as e:
            now_ts = int(_time.time()) + 9*3600
            for friendly in y_syms:
                c = _yf_cache_get(friendly)
                if c:
                    out[friendly] = {"last": c["last"], "chg": c["chg"], "ts": now_ts, "cached": True}
                else:
                    out[friendly] = {"error": f"YF {e}"}
            return out

# ===== [REPLACE/ADD] Unified quotes endpoint (uses YF guard) =====
from fastapi import Query as _Q
import time as _time

_YF_MAP = {
    "VIX": "^VIX",
    "DXY": "DX-Y.NYB",
    "EURUSD": "EURUSD=X",
    "GBPUSD": "GBPUSD=X",
    "USDJPY": "USDJPY=X",
    "AAPL": "AAPL",
    "TSLA": "TSLA",
    "NFLX": "NFLX",
}

def _is_binance_symbol(sym: str) -> bool:
    s = (sym or "").upper()
    return any(x in s for x in ("USDT", "USDC", "BTC", "ETH"))

def _yf_map_list(friendly_list):
    out = []
    for s in friendly_list:
        k = s.upper().strip()
        out.append(_YF_MAP.get(k, k))
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
        return {"symbol": symbol.upper(), "last": last, "chg": chg, "ts": int(_time.time()) + 9*3600}
    except Exception as e:
        return {"symbol": symbol.upper(), "error": f"binance {e}"}

@app.get("/api/quotes/all")
def api_quotes_all(symbols: str = _Q(..., description="Comma-separated symbols e.g. VIX,AAPL,EURUSD,BTCUSDT")):
    syms = [s.strip().upper() for s in symbols.split(",") if s.strip()]
    out = []
    binance_syms = [s for s in syms if _is_binance_symbol(s)]
    yf_syms      = [s for s in syms if not _is_binance_symbol(s)]
    # Binance
    for sym in binance_syms:
        out.append(_binance_24h(sym))
    # Yahoo
    if yf_syms:
        y_syms = _yf_map_list(yf_syms)
        results = _yf_fetch_batch(y_syms)   # 429-safe
        now_ts = int(_time.time()) + 9*3600
        for friendly, y in zip(yf_syms, y_syms):
            row = results.get(friendly) or results.get(y) or {}
            if "last" in row:
                out.append({"symbol": friendly, "last": row["last"], "chg": row.get("chg"), "ts": row.get("ts", now_ts)})
            else:
                out.append({"symbol": friendly, "error": row.get("error", "no quote")})
    return {"quotes": out}
