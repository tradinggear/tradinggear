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
import logging
import httpx
import asyncio
from collections import defaultdict, deque
import math


KST = timezone(timedelta(hours=9))  # UTC+9


#  ----------------------- 텔레그램 봇 설정-----------------------------------------------------
# 런타임 캐시: 이전 OI 저장 (symbol -> last_oi)
oi_cache: Dict[str, float] = {}
# (옵션) 과거 klines의 수를 제한해서 메모리 사용 관리
klines_cache: Dict[str, deque] = defaultdict(lambda: deque(maxlen=500))

TELEGRAM_BOT_TOKEN = "8304334096:AAFPjAwdssmxpFauuGcEE5O088U-3vw7AM4"
TELEGRAM_CHAT_ID = "7998353039" # 테스트 개발자용 chat_id
# TELEGRAM_CHAT_ID = "6699396349" # 대표님 chat_id 
SEND_INTERVAL_SECONDS = 1800  # 30분 = 1800
TELEGRAM_API_URL = "https://api.telegram.org"

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger(__name__)
_background_task = None
_shutdown_event = asyncio.Event()

# SYMBOL = os.getenv("SYMBOL", "BTCUSDT")  # 분석 대상 심볼 (예: BTCUSDT)
SYMBOL = "SOLUSDT"
# --------------------------------------------------------------------------------------------


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

def get_funding_rate_history(symbol: str = None, startTime: int = None, endTime: int = None, limit: int = 100):
    """
    Binance Futures - Get Funding Rate History
    
    :param symbol: 거래 심볼 (예: 'BTCUSDT'), None이면 전체
    :param startTime: 시작 시간 (ms)
    :param endTime: 종료 시간 (ms)
    :param limit: 반환 건수 (기본 100, 최대 1000)
    :return: list of dict
    """
    url = f"{BINANCE_REST}/fapi/v1/fundingRate"
    params = {"limit": limit}
    
    if symbol:
        params["symbol"] = symbol.upper()
    if startTime:
        params["startTime"] = startTime
    if endTime:
        params["endTime"] = endTime

    response = requests.get(url, params=params)
    response.raise_for_status()
    return response.json()

def get_open_interest_hist(symbol: str, period: str = "1m", limit: int = 500, startTime: int = None, endTime: int = None):
    """
    Binance Futures - Open Interest History
    :param symbol: 거래 심볼
    :param period: "5m","15m","30m","1h","2h","4h","6h","12h","1d"
    :param limit: 최대 500
    :param startTime: 시작 시간 (ms)
    :param endTime: 종료 시간 (ms)
    :return: list of dict
    """
    url = f"{BINANCE_REST}/futures/data/openInterestHist"
    params = {"symbol": symbol.upper(), "period": period, "limit": limit}
    if startTime:
        params["startTime"] = startTime
    if endTime:
        params["endTime"] = endTime

    resp = requests.get(url, params=params)
    resp.raise_for_status()
    return resp.json()

def get_order_book(symbol: str, limit: int = 100):
    """
    Option Trading - Get Order Book Depth
    
    :param symbol: 거래 심볼 (예: 'BTC-200730-9000-C')
    :param limit: 반환할 주문 수량 (기본 100, 선택값: 10,20,50,100,500,1000)
    :return: dict, { "T": timestamp, "u": update_id, "bids": [...], "asks": [...] }
    """
    url = f"{BINANCE_REST}/fapi/v1/depth"
    
    # 요청 파라미터
    params = {"symbol": symbol.upper(), "limit": limit}
    
    response = requests.get(url, params=params)
    response.raise_for_status()  # 오류 발생 시 예외 발생
    return response.json()

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


# ----------------------- 텔레그램 -----------------------
BINANCE_BASE = "https://fapi.binance.com"

def get_strongest_ob_level(order_book: dict, side: str = "long", depth: int = 50):
    """
    가장 강한 오더블록 가격대 추정
    - side='long'  : 매집 구간 (bid 중 가장 큰 수량)
    - side='short' : 매도 구간 (ask 중 가장 큰 수량)
    return: (price, qty) or (None, None)
    """
    levels = order_book.get("bids" if side == "long" else "asks", [])
    if not levels:
        return None, None

    # depth 범위 내에서 가장 큰 수량 찾기
    max_level = max(
        levels[:depth],
        key=lambda x: float(x[1]),
        default=None
    )

    if not max_level:
        return None, None

    price = float(max_level[0])
    qty = float(max_level[1])
    return price, qty


def vwap_from_klines(klines: List[list]) -> float:
    """단순 VWAP 계산 (klines 리스트 전체 기준). klines: [open_time, open, high, low, close, volume, ...]"""
    pv_sum = 0.0
    vol_sum = 0.0
    for k in klines:
        high = float(k[2])
        low = float(k[3])
        close = float(k[4])
        typical = (high + low + close) / 3.0
        vol = float(k[5])
        pv_sum += typical * vol
        vol_sum += vol
    return pv_sum / vol_sum if vol_sum > 0 else 0.0

async def fetch_klines_for_interval(symbol: str, interval: str = "4h", limit: int = 100) -> List[list]:
    url = f"{BINANCE_BASE}/fapi/v1/klines"
    params = {"symbol": symbol, "interval": interval, "limit": limit}
    async with httpx.AsyncClient(timeout=15.0) as client:
        r = await client.get(url, params=params)
        r.raise_for_status()
        kl = r.json()
        # 캐시 관리 (optional)
        klines_cache[symbol].extend(kl)
        return kl

def check_ob_touch(order_book: dict, mark_price: float, side: str = "long", proximity_pct: float = 0.005) -> bool:
    """
    OB 터치/근접 체크.
    - side == 'long' : Demand OB (매수존) -> 체크: 큰 bid 벽이 현재 가격보다 아래에 근접하게 위치
    - side == 'short': Supply OB (매도존) -> 체크: 큰 ask 벽이 현재 가격보다 위에 근접하게 위치
    proximity_pct: 가격 대비 몇 % 이내면 '근접'으로 판단 (ex: 0.005 -> 0.5%)
    """
    bids = order_book.get("bids", [])
    asks = order_book.get("asks", [])
    if not bids or not asks:
        return False
    # 큰 벽을 정하는 기준: 상위 N 레벨에서 양이 평균보다 큰 수준
    def find_wall(levels):
        # levels: list[(price_str, qty_str)]
        prices = [float(p) for p, q in levels]
        qtys = [float(q) for p, q in levels]
        avg = sum(qtys) / max(1, len(qtys))
        # 가장 큰 레벨(양이 평균의 2배 이상) 찾기
        for p, q in levels:
            if float(q) >= avg * 2.0:
                return float(p), float(q)
        # fallback: best price
        return float(levels[0][0]), float(levels[0][1])

    best_bid_price, _ = find_wall(bids[:40])
    best_ask_price, _ = find_wall(asks[:40])

    if side == "long":
        # Demand OB -> bid wall below or very near current price
        if best_bid_price <= mark_price and (mark_price - best_bid_price) / mark_price <= proximity_pct:
            return True
    else:
        # Supply OB -> ask wall above or very near
        if best_ask_price >= mark_price and (best_ask_price - mark_price) / mark_price <= proximity_pct:
            return True
    return False

def check_volume_spike_4h(klines_4h: List[list], lookback: int = 20, multiplier: float = 1.8, require_bullish: bool = True) -> bool:
    """
    4H 볼륨 스파이크: 최근 1캔들(가장 최신)의 volume >= lookback 평균 * multiplier
    require_bullish: 양봉(종가>시가)인지 확인
    """
    if not klines_4h or len(klines_4h) < 2:
        return False
    volumes = [float(k[5]) for k in klines_4h]
    lookback = min(len(volumes) - 1, lookback)  # 최신 캔들 제외하고 평균 계산
    if lookback <= 0:
        return False
    long_avg = sum(volumes[-1 - lookback:-1]) / lookback
    recent_vol = volumes[-1]
    if long_avg == 0:
        return False
    ratio = recent_vol / long_avg
    if ratio < multiplier:
        return False
    # 캔들 방향 체크
    open_p = float(klines_4h[-1][1])
    close_p = float(klines_4h[-1][4])
    if require_bullish:
        return close_p > open_p
    else:
        return close_p < open_p
    
    
def estimate_heatmap_proximity(order_book: dict, mark_price: float, side: str = "long", proximity_pct: float = 0.02) -> bool:
    """
    호가벽을 이용한 '청산 밀집 레벨 근접' 휴리스틱
    - side == long: 하단(현재가 대비 아래)에 대형 매수벽이 집중되어 있으면 '숏청산 밀집'으로 간주(=롱 유리)
    - side == short: 상단에 대형 매도벽이 집중되어 있으면 '롱청산 밀집'으로 간주(=숏 유리)
    proximity_pct: 가격 대비 범위 (ex 0.02 -> 2%)
    """
    bids = order_book.get("bids", [])
    asks = order_book.get("asks", [])
    if side == "long":
        # 하단에 큰 bid 벽 존재하는지 확인 (price < mark_price, within proximity_pct)
        threshold_price = mark_price * (1 - proximity_pct)
        large_qty = 0.0
        total_qty = 0.0
        for p_str, q_str in bids[:200]:
            p = float(p_str)
            q = float(q_str)
            if p >= threshold_price:
                total_qty += q
                if q >= 0.5:  # 절대적 큰량 기준 (튜닝 가능)
                    large_qty += q
        # 비율 기반 판단
        if total_qty == 0:
            return False
        return (large_qty / total_qty) >= 0.4  # 40% 이상이 큰벽이면 근접 판단
    else:
        # 상단에 큰 ask 벽 존재
        threshold_price = mark_price * (1 + proximity_pct)
        large_qty = 0.0
        total_qty = 0.0
        for p_str, q_str in asks[:200]:
            p = float(p_str)
            q = float(q_str)
            if p <= threshold_price:
                total_qty += q
                if q >= 0.5:
                    large_qty += q
        if total_qty == 0:
            return False
        return (large_qty / total_qty) >= 0.4

def compute_cvd_recent(trades: List[dict], lookback: int = 1000) -> float:
    """최근 trades를 이용한 CVD 비율 (정규화된 -1..1)"""
    if not trades:
        return 0.0
    qtys = trades[-lookback:]
    buy = 0.0
    sell = 0.0
    for t in qtys:
        q = float(t.get("qty", t.get("quantity", 0)))
        if t.get("isBuyerMaker", False):
            sell += q
        else:
            buy += q
    total = buy + sell or 1.0
    return (buy - sell) / total  # -1..1


# ---------- 메인: 4H 기반 scoring 함수 ----------
async def compute_4h_signal_for_symbol(symbol: str) -> Dict:
    """
    4H 캔들마다 실행하여 LONG / SHORT 각각 0..6 점수 산출.
    score >= 5 인 경우 신호 생성.
    """
    # 데이터 수집
    order_book, trades_1m, klines_1m, klines_4h, oi_val, funding = await asyncio.gather(
        fetch_order_book(symbol, limit=500),
        fetch_recent_trades(symbol, limit=1000),
        fetch_kline_volume(symbol, interval="1m", limit=240),
        fetch_klines_for_interval(symbol, interval="4h", limit=100),
        fetch_open_interest(symbol),
        fetch_funding_rate(symbol),
    )

    # 현재 마크/최근 가격 (1분 klines 마지막 close)
    mark_price = None
    if klines_1m:
        mark_price = float(klines_1m[-1][4])
    else:
        # fallback: best bid/ask mid
        bids = order_book.get("bids", [])
        asks = order_book.get("asks", [])
        if bids and asks:
            mark_price = (float(bids[0][0]) + float(asks[0][0])) / 2
        else:
            mark_price = 0.0

    # 1) OB 터치/근접
    ob_long = check_ob_touch(order_book, mark_price, side="long", proximity_pct=0.005)
    ob_short = check_ob_touch(order_book, mark_price, side="short", proximity_pct=0.005)

    # OB 주요 가격대 (가장 두꺼운 벽)
    demand_price, demand_qty = get_strongest_ob_level(order_book, side="long")
    supply_price, supply_qty = get_strongest_ob_level(order_book, side="short")


    # 2) CVD 매수/매도 우위 (정규화)
    cvd_ratio = compute_cvd_recent(trades_1m, lookback=1000)
    cvd_long = cvd_ratio > 0.08  # 임계값(튜닝). 0.08 => 매도/매수 차이가 8% 이상
    cvd_short = cvd_ratio < -0.08

    # 3) OI 증가(이전 캔들 대비) - 메모리 기반 비교
    oi_increase_long = False
    oi_increase_short = False
    prev_oi = oi_cache.get(symbol)
    try:
        oi_now = float(oi_val)
    except Exception:
        oi_now = 0.0
    if prev_oi is not None and prev_oi > 0:
        # 증가 비율을 보고 long/short 판단은 불명확하므로 'OI 증가' 자체로 양방 체크 가능.
        oi_delta = (oi_now - prev_oi) / prev_oi
        # 양수면 포지션 유입( 방향성은 분리 판단 어려움 ) -> 둘다 +1 후보로 삼지 않고
        # 특정 방향으로 추정하려면 CVD/price action과 결합하여 판단
        if oi_delta > 0.02:  # 2% 이상 증가
            # 방향성 추정: 만약 CVD가 매수 우위면 롱 유입으로 판단, 그렇지 않으면 숏 유입으로는 반대
            if cvd_ratio > 0:
                oi_increase_long = True
            elif cvd_ratio < 0:
                oi_increase_short = True
            else:
                # 중립일 때는 OI만으로는 판단 안함 (둘 다 False)
                pass
    # 업데이트 캐시
    oi_cache[symbol] = oi_now

    # 4) VWAP 재진입 + TEMA30 방향
    # TEMA30 on 4H closes
    closes_4h = [float(k[4]) for k in klines_4h]
    tema30 = tema(closes_4h, 30) if len(closes_4h) >= 30 else None
    tema_up = False
    tema_down = False
    if tema30 and len(tema30) >= 2:
        if tema30[-1] > tema30[-2]:
            tema_up = True
        elif tema30[-1] < tema30[-2]:
            tema_down = True

    # VWAP (4h series) 재진입: 현재(=최근 캔들 종가)가 VWAP을 다시 돌파(롱) 또는 하향 이탈(숏)
    vwap_4h = vwap_from_klines(klines_4h[-50:]) if klines_4h else 0.0
    last_close = closes_4h[-1] if closes_4h else mark_price
    # 기초 조건: 이전 캔들에서 가격이 VWAP 반대편에 있고, 현재는 재진입
    vwap_reentry_long = False
    vwap_reentry_short = False
    if len(closes_4h) >= 2:
        prev_close = closes_4h[-2]
        # reentry long: prev_close < vwap and last_close > vwap
        if prev_close < vwap_4h and last_close > vwap_4h and tema_up:
            vwap_reentry_long = True
        # reentry short: prev_close > vwap and last_close < vwap and tema_down
        if prev_close > vwap_4h and last_close < vwap_4h and tema_down:
            vwap_reentry_short = True

    # 5) Volume spike
    vol_spike_long = check_volume_spike_4h(klines_4h, lookback=20, multiplier=1.8, require_bullish=True)
    vol_spike_short = check_volume_spike_4h(klines_4h, lookback=20, multiplier=1.8, require_bullish=False)

    # 6) Heatmap 근접(휴리스틱)
    heatmap_long = estimate_heatmap_proximity(order_book, mark_price, side="long", proximity_pct=0.02)
    heatmap_short = estimate_heatmap_proximity(order_book, mark_price, side="short", proximity_pct=0.02)

    # Funding filter: 펀딩이 과열이면 반대편 유리 -> 여기서는 단순히 magnitude 판단
    funding_rate = float(funding.get("fundingRate", 0.0)) if funding else 0.0
    # funding positive: longs pay shorts -> longs 부담 -> penalize long signals by requiring stronger evidence
    funding_penalty_long = funding_rate > 0.0005  # 임계값 튜닝 가능
    funding_penalty_short = funding_rate < -0.0005

    # 점수 산정 (각 항목 True -> +1)
    long_score = 0
    long_score += 1 if ob_long else 0
    long_score += 1 if cvd_long else 0
    long_score += 1 if oi_increase_long else 0
    long_score += 1 if vwap_reentry_long else 0
    long_score += 1 if vol_spike_long else 0
    long_score += 1 if heatmap_long else 0

    short_score = 0
    short_score += 1 if ob_short else 0
    short_score += 1 if cvd_short else 0
    short_score += 1 if oi_increase_short else 0
    short_score += 1 if vwap_reentry_short else 0
    short_score += 1 if vol_spike_short else 0
    short_score += 1 if heatmap_short else 0

    # Funding filter 적용: 펀딩이 과열인 쪽은 score 낮추기 (선택적 정책)
    if funding_penalty_long:
        # 롱에 불리하면 1점 차감(최저 0)
        long_score = max(0, long_score - 1)
    if funding_penalty_short:
        short_score = max(0, short_score - 1)

    # 신호 판단
    long_signal = None
    short_signal = None
    if long_score >= 5:
        long_signal = "LONG"
        long_strength = "High Conviction" if long_score == 6 else "Strong"
    if short_score >= 5:
        short_signal = "SHORT"
        short_strength = "High Conviction" if short_score == 6 else "Strong"

    # 상세 리포트 구조화
    report = {
        "time": now_kst_str(),
        "symbol": symbol,
        "mark_price": mark_price,
        "funding_rate": funding_rate,
        "order_blocks": {
            "demand": {
                "price": demand_price,
                "qty": demand_qty,
            },
            "supply": {
                "price": supply_price,
                "qty": supply_qty,
            },
        },
        "long": {
            "score": long_score,
            "signal": long_signal,
            "strength": long_strength if long_signal else None,
            "components": {
                "ob_touch": ob_long,
                "cvd_bull": cvd_long,
                "oi_increase": oi_increase_long,
                "vwap_reentry_tema_up": vwap_reentry_long,
                "volume_spike": vol_spike_long,
                "heatmap_proximity": heatmap_long,
            },
        },
        "short": {
            "score": short_score,
            "signal": short_signal,
            "strength": short_strength if short_signal else None,
            "components": {
                "ob_touch": ob_short,
                "cvd_bear": cvd_short,
                "oi_increase": oi_increase_short,
                "vwap_reentry_tema_down": vwap_reentry_short,
                "volume_spike": vol_spike_short,
                "heatmap_proximity": heatmap_short,
            },
        },
        "raw": {
            "cvd_ratio": cvd_ratio,
            "oi_now": oi_now,
            "oi_prev": prev_oi,
            "tema30_last": tema30[-1] if tema30 else None,
            "vwap_4h": vwap_4h,
        },
    }
    return report


# ---------- 주기적 전송(기존 periodic_time_sender를 대체하거나 통합) ----------
async def periodic_time_sender():
    if not TELEGRAM_BOT_TOKEN or not TELEGRAM_CHAT_ID:
        logger.error("TELEGRAM_BOT_TOKEN 또는 TELEGRAM_CHAT_ID가 설정되어 있지 않습니다. 백그라운드 작업을 중단합니다.")
        return

    logger.info("주기적 신호 전송 작업 시작 (간격: %s초)", SEND_INTERVAL_SECONDS)
    try:
        while not _shutdown_event.is_set():
            try:
                report = await compute_4h_signal_for_symbol(SYMBOL)

                # 신호 메시지: LONG / SHORT 둘 다 나올 수 있음(희귀)
                # txt_lines = [
                #     f"심볼: {report['symbol']}",
                #     f"시간: {report['time']}",
                #     f"가격: {report['mark_price']}",
                #     f"펀딩: {report['funding_rate']}",
                #     "",
                #     f"▶ LONG 점수: {report['long']['score']} ",
                #     f"  구성: OB={report['long']['components']['ob_touch']}, CVD={report['long']['components']['cvd_bull']}, OI_increase={report['long']['components']['oi_increase']}, VWAP+TEMA={report['long']['components']['vwap_reentry_tema_up']}, VolSpike={report['long']['components']['volume_spike']}, Heatmap={report['long']['components']['heatmap_proximity']}",
                #     "",
                #     f"▶ SHORT 점수: {report['short']['score']} ",
                #     f"  구성: OB={report['short']['components']['ob_touch']}, CVD={report['short']['components']['cvd_bear']}, OI_increase={report['short']['components']['oi_increase']}, VWAP+TEMA={report['short']['components']['vwap_reentry_tema_down']}, VolSpike={report['short']['components']['volume_spike']}, Heatmap={report['short']['components']['heatmap_proximity']}",
                #     "",
                #     "※ 조건: score >= 5 => 진입 후보 (6: High Conviction, 5: Strong).",
                # ]

                ob_info = report.get("order_blocks", {})

                demand = ob_info.get("demand", {})
                supply = ob_info.get("supply", {})

                txt_lines = [
                    f"심볼: {report['symbol']}",
                    f"시간: {report['time']}",
                    f"가격: {report['mark_price']}",
                    # f"펀딩: {report['funding_rate']}",
                    "",
                    f"📊 오더블록",
                    f"  🟢 매집(Demand) 세력 가격대: {demand.get('price')} (qty {demand.get('qty'):.2f})" if demand.get("price") else "  🟢 매집(Demand): -",
                    f"  🔴 매도(Supply) 세력 가격대: {supply.get('price')} (qty {supply.get('qty'):.2f})" if supply.get("price") else "  🔴 매도(Supply): -",
                    "",
                    # f"▶ LONG 점수: {report['long']['score']}",
                    # f"▶ SHORT 점수: {report['short']['score']}",
                ]
                txt = "\n".join(txt_lines)
                await send_telegram_message(TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID, txt)
                logger.info("텔레그램 전송 완료: LONG %s / SHORT %s", report['long']['score'], report['short']['score'])
            except Exception as e:
                logger.exception("신호 생성/전송 중 예외 발생: %s", e)

            await asyncio.wait([_shutdown_event.wait()], timeout=SEND_INTERVAL_SECONDS)
    finally:
        logger.info("주기적 신호 전송 작업 종료")



# ---------- 유틸 ----------
def now_kst_str() -> str:
    return datetime.now(KST).strftime("%Y-%m-%d %H:%M:%S %Z")


async def send_telegram_message(token: str, chat_id: str, text: str) -> dict:
    url = f"{TELEGRAM_API_URL}/bot{token}/sendMessage"
    payload = {"chat_id": chat_id, "text": text, "parse_mode": "HTML"}
    async with httpx.AsyncClient(timeout=20.0) as client:
        resp = await client.post(url, json=payload)
        resp.raise_for_status()
        return resp.json()


# ---------- 바이낸스 데이터 수집 함수 (공용 엔드포인트 사용) ----------
async def fetch_order_book(symbol: str, limit: int = 50) -> dict:
    url = f"{BINANCE_BASE}/fapi/v1/depth"
    params = {"symbol": symbol, "limit": limit}
    async with httpx.AsyncClient(timeout=10.0) as client:
        r = await client.get(url, params=params)
        r.raise_for_status()
        return r.json()


async def fetch_recent_trades(symbol: str, limit: int = 1000) -> List[dict]:
    # 최근 거래(회)는 public으로 가져옴
    url = f"{BINANCE_BASE}/fapi/v1/trades"
    params = {"symbol": symbol, "limit": limit}
    async with httpx.AsyncClient(timeout=10.0) as client:
        r = await client.get(url, params=params)
        r.raise_for_status()
        return r.json()


async def fetch_kline_volume(symbol: str, interval: str = "1m", limit: int = 120) -> List[dict]:
    url = f"{BINANCE_BASE}/fapi/v1/klines"
    params = {"symbol": symbol, "interval": interval, "limit": limit}
    async with httpx.AsyncClient(timeout=10.0) as client:
        r = await client.get(url, params=params)
        r.raise_for_status()
        return r.json()


async def fetch_open_interest(symbol: str) -> float:
    url = f"{BINANCE_BASE}/fapi/v1/openInterest"
    params = {"symbol": symbol}
    async with httpx.AsyncClient(timeout=10.0) as client:
        r = await client.get(url, params=params)
        r.raise_for_status()
        data = r.json()
        return float(data.get("openInterest", 0))


async def fetch_funding_rate(symbol: str) -> dict:
    # 최근 funding rate (최근 한 건)
    url = f"{BINANCE_BASE}/fapi/v1/fundingRate"
    params = {"symbol": symbol, "limit": 1}
    async with httpx.AsyncClient(timeout=10.0) as client:
        r = await client.get(url, params=params)
        r.raise_for_status()
        arr = r.json()
        return arr[0] if arr else {}


# ---------- 지표 계산기 (단순화한 구현) ----------
def compute_order_book_imbalance(order_book: dict, depth_levels: int = 20) -> float:
    """
    OB: (ask_liquidity - bid_liquidity) / total_liquidity
    양수면 매도 우위(숏 압력), 음수면 매수 우위(롱 유리)
    """
    bids = order_book.get("bids", [])[:depth_levels]
    asks = order_book.get("asks", [])[:depth_levels]
    bid_vol = sum(float(q) for p, q in bids)
    ask_vol = sum(float(q) for p, q in asks)
    total = bid_vol + ask_vol
    if total == 0:
        return 0.0
    imbalance = (bid_vol - ask_vol) / total  # 양수 -> bid 우위
    return imbalance


def compute_cvd_from_trades(trades: List[dict]) -> float:
    """
    CVD: 누적 매수량 - 매도량 (직접적인 차이)
    바이낸스 trade 구조: isBuyerMaker == True 의미 '매도자가 taker(시장에서 먹음)', 즉 매도 체결로 해석
    convention: buyer-initiated trades => isBuyerMaker == False
    """
    buy_vol = 0.0
    sell_vol = 0.0
    for t in trades:
        qty = float(t.get("qty", t.get("quantity", 0)))
        is_buyer_maker = t.get("isBuyerMaker", False)
        if is_buyer_maker:
            # taker is seller => sell initiated
            sell_vol += qty
        else:
            buy_vol += qty
    return buy_vol - sell_vol  # 양수 -> 매수 우위


def compute_volume_spike(kline_list: List[list], lookback: int = 60, recent_window: int = 5) -> float:
    """
    볼륨 스파이크: 최근 recent_window 분의 합을 lookback 평균과 비교
    반환: (recent_avg / long_avg) 비율 (1.0 이상이면 스파이크)
    """
    # kline format: [open_time, open, high, low, close, volume, ...]
    volumes = [float(k[5]) for k in kline_list]
    if len(volumes) < lookback:
        # fallback: 전체 평균
        long_avg = sum(volumes) / max(1, len(volumes))
    else:
        long_avg = sum(volumes[-lookback:]) / lookback
    recent_avg = sum(volumes[-recent_window:]) / max(1, recent_window)
    if long_avg == 0:
        return 1.0
    return recent_avg / long_avg


def estimate_liquidation_pressure(trades: List[dict], large_trade_threshold_multiplier: float = 5.0) -> float:
    """
    청산맵(추정): 공개 트레이드에서 대형 테이커 물량의 비중으로 간단 추정
    - 평균 거래량의 N배 이상인 거래를 '큰거'로 간주
    - 큰 거래가 매도측이면 숏청산(매도 물량) / 매수측이면 롱청산 가능성
    반환: (large_buy_vol - large_sell_vol) / total_large_vol  (-1..1)
    """
    qtys = [float(t.get("qty", t.get("quantity", 0))) for t in trades]
    if not qtys:
        return 0.0
    avg = sum(qtys) / len(qtys)
    threshold = avg * large_trade_threshold_multiplier
    large_buy = 0.0
    large_sell = 0.0
    for t in trades:
        qty = float(t.get("qty", t.get("quantity", 0)))
        if qty < threshold:
            continue
        if t.get("isBuyerMaker", False):
            # seller taker -> sell initiated
            large_sell += qty
        else:
            large_buy += qty
    total_large = large_buy + large_sell
    if total_large == 0:
        return 0.0
    return (large_buy - large_sell) / total_large  # 양수 -> 대형 매수 우위


# ---------- 메인 신호 집계기 ----------
async def compute_signal_for_symbol(symbol: str) -> Dict:
    # 1) 데이터 수집 (공용 엔드포인트만 사용 — 서명 필요시 추후 확장)
    order_book, trades, klines, oi, funding = await asyncio.gather(
        fetch_order_book(symbol, limit=100),
        fetch_recent_trades(symbol, limit=1000),
        fetch_kline_volume(symbol, interval="1m", limit=240),  # 4시간 = 240분
        fetch_open_interest(symbol),
        fetch_funding_rate(symbol),
    )

    # 2) 지표 계산
    ob = compute_order_book_imbalance(order_book, depth_levels=40)  # -1..1 (음수: ask 우위)
    cvd = compute_cvd_from_trades(trades)  # 절대값 -> 거래량 스케일에 따라 커짐
    # 정규화: 최근 trades 합으로 나누어 -1..1 범위로 치환
    total_trade_vol = sum(float(t.get("qty", 0)) for t in trades) or 1.0
    cvd_norm = cvd / total_trade_vol  # -1..1 대략

    oi_val = oi  # 숫자 (open interest)
    # OI 변화(간단): we could fetch historical OI to compute change; 여기서는 OI 자체 크기로 평가(로그스케일)
    try:
        oi_score = (oi_val ** 0.5) if oi_val > 0 else 0.0
    except Exception:
        oi_score = 0.0

    funding_rate = float(funding.get("fundingRate", 0.0)) if funding else 0.0

    vol_spike_ratio = compute_volume_spike(klines, lookback=120, recent_window=5)  # 1이면 동일, >1 스파이크

    liq_pressure = estimate_liquidation_pressure(trades)

    # 3) 단순 점수 조합 (가중치)
    # 가중치는 필요에 따라 튜닝하세요.
    weights = {
        "ob": 0.25,
        "cvd": 0.20,
        "oi": 0.10,
        "funding": 0.15,
        "vol_spike": 0.15,
        "liq": 0.15,
    }

    # 각 지표를 -1..1 범위로 정규화해서 합산
    # ob: 이미 -1..1 (bid 우위 양수)
    ob_score = ob

    # cvd_norm: -1..1
    cvd_score = max(-1.0, min(1.0, cvd_norm))

    # funding: funding >0 => long pay short (longs pay shorts) => 일반적으로 롱 부담 -> 숏이 유리
    # 따라서 funding_score = -sign(funding) * magnitude (작게 스케일)
    funding_score = -float(funding_rate) * 10  # scale 조정 (보통 funding은 작음)

    # oi_score: 단일 값을 -1..1로 스케일 (여기선 로그 스케일 + 단순화)
    oi_score_norm = 0.0
    if oi_score > 0:
        oi_score_norm = min(1.0, (oi_score / (oi_score + 1000)))  # 경험적 스케일링
    # 중립을 0으로 하기 위해 0~1을 양수로 두고 0으로 유지 (높을수록 포지션 쏠림 -> 변동성/리스크)
    # oi는 방향성 정보가 없으므로 절대값 항으로 처리 (약간의 혼합)
    oi_score_norm = (oi_score_norm - 0.5) * 2  # -> -1..1 대략

    # volume spike: ratio>1 -> 매수/매도 유입 가속 / 방향은 CVD와 같이 해석
    vol_score = min(3.0, vol_spike_ratio) - 1.0  # ratio=1 -> 0, ratio=2 -> 1
    vol_score = max(-1.0, min(1.0, vol_score))

    # liq_pressure: -1..1 (양수 -> 대형 매수 우위 -> 롱 압력)
    liq_score = liq_pressure

    # 합산
    combined = (
        weights["ob"] * ob_score
        + weights["cvd"] * cvd_score
        + weights["oi"] * oi_score_norm
        + weights["funding"] * funding_score
        + weights["vol_spike"] * vol_score
        + weights["liq"] * liq_score
    )

    # threshold: combined > +0.12 => '롱', < -0.12 => '숏', else '중립'
    if combined > 0.12:
        signal_text = "롱입니다."
    elif combined < -0.12:
        signal_text = "숏입니다."
    else:
        signal_text = "중립(관망)입니다."

    # 상세 리포트
    report = {
        "time": now_kst_str(),
        "symbol": symbol,
        "signal": signal_text,
        "score": combined,
        "details": {
            "order_book_imbalance": ob_score,
            "cvd_norm": cvd_score,
            "open_interest_norm": oi_score_norm,
            "funding_rate": funding_rate,
            "funding_score": funding_score,
            "volume_spike_ratio": vol_spike_ratio,
            "vol_score": vol_score,
            "liquidation_pressure": liq_score,
            "total_trade_vol_last_trades": total_trade_vol,
        },
    }
    return report


# ---------- 백그라운드: 주기적 전송 ----------

class SymbolUpdate(BaseModel):
    symbol: str

@app.post("/update_symbol")
async def update_symbol(data: SymbolUpdate):
    global SYMBOL, _background_task, _shutdown_event

    SYMBOL = data.symbol.upper()
    print(f"[심볼 변경] 새로운 SYMBOL: {SYMBOL}")
    logger.info(f"[심볼 변경] 새로운 SYMBOL: {SYMBOL}")

    # 기존 작업 종료 후 새로 시작
    if _background_task:
        _shutdown_event.set()           # 기존 루프 종료 신호
        try:
            await _background_task     # 기존 task 기다리기
        except asyncio.CancelledError:
            pass
        # 새 shutdown 이벤트 생성
        _shutdown_event = asyncio.Event()
        _background_task = asyncio.create_task(periodic_time_sender())

    return {"status": "ok", "symbol": SYMBOL}


# FastAPI 이벤트: 스타트업에서 백그라운드 작업 시작
@app.on_event("startup")
async def on_startup():
    global _background_task
    _background_task = asyncio.create_task(periodic_time_sender())

# FastAPI 이벤트: 셧다운 시 정리
@app.on_event("shutdown")
async def on_shutdown():
    if _background_task:
        await _background_task

# 간단한 헬스 체크 엔드포인트
@app.get("/health")
async def health():
    return {"status": "ok", "time": now_kst_str()}



# --------------------------------
@app.get("/api/open_interest_hist")
def open_interest_hist_api(symbol: str = Query(...), period: str = Query("1m"), limit: int = Query(500)):
    try:
        data = get_open_interest_hist(symbol, period, limit)
        return {"success": True, "data": data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    

@app.get("/api/funding-rate")
def funding_rate(
    symbol: str | None = Query(None, description="거래 심볼, 예: BTCUSDT"),
    startTime: int | None = Query(None, description="시작 시간 (ms)"),
    endTime: int | None = Query(None, description="종료 시간 (ms)"),
    limit: int = Query(100, ge=1, le=1000, description="반환 건수 (1~1000)")
):
    try:
        data = get_funding_rate_history(symbol, startTime, endTime, limit)
        return {"success": True, "data": data}
    except requests.HTTPError as e:
        raise HTTPException(status_code=e.response.status_code, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@app.get("/api/order_book")
def order_book_api(symbol: str, limit: int = 100):
    """
    FastAPI endpoint to get order book for a given symbol
    Example: /api/order_book?symbol=BTC-200730-9000-C&limit=50
    """
    try:
        data = get_order_book(symbol, limit)
        return {"success": True, "data": data}
    except requests.HTTPError as e:
        raise HTTPException(status_code=e.response.status_code, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
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
#    return templates.TemplateResponse("index7.html", {"request": request})
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
