"""
TradingGear — SuperChart-like (KST)
=================================================

- 핵심 포인트
  1) 모든 시간은 KST(UTC+9)에 맞춰 노출합니다. (내부 계산은 epoch sec + 9*3600 보정)
  2) Binance 선물(→ 실패 시 현물) + Yahoo Finance(429 대비 캐시/백오프) 통합 쿼트 제공
  3) 간단한 전략(TEMA 교차 + VWAP 필터 + ATR 거리 필터 + 쿨다운)
  4) OB(수요/공급) 존 탐지 로직
  5) 신호 저장(SQLAlchemy) 및 REST API 엔드포인트 제공(FastAPI)

- 주석 컨벤션
  # [SECTION] 섹션 타이틀
  # - 상세 설명
  def foo(...):
      # 짧은 요약 + 파라미터/리턴 설명
      # 구현 핵심 단계별 설명

- 주의
  * 파일 내에 동일 이름의 함수가 "패치" 과정에서 재정의되기도 합니다.
    파이썬은 마지막에 정의된 심볼을 최종 값으로 사용하므로, 동작상 문제는 없지만,
    혼동을 막기 위해 각 블록에 왜 다시 정의하는지 주석을 추가했습니다.
"""

# =========================
# [SECTION] Imports & 기본 설정
# =========================
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

# KST 타임존(UTC+9) 객체 — datetime 변환에 사용
KST = timezone(timedelta(hours=9))  # UTC+9

# (중복 import 정리 참고) 아래 라인은 원본 코드에 존재하던 재-import입니다.
# 중복되어도 파이썬에서 에러는 아니지만 의미상 중복이므로 남겨두되 주석으로 명시합니다.
from typing import Optional, Dict, Any  # 중복 선언(원본 유지)

# =========================
# [SECTION] 전역 캐시 (watchlist 등 마지막 정상값 백업)
# - 외부 API 실패 시 마지막 성공 값을 즉시 제공하기 위한 초간단 캐시
# =========================
Q_CACHE: Dict[str, Dict[str, Any]] = {}

def _cache_put(sym: str, last: float, chg: Optional[float]):
    """심볼별 마지막 시세/등락률을 캐시에 저장.
    Args:
        sym: 심볼 문자열
        last: 최종 가격
        chg: 등락률(%) 또는 None
    """
    if last is None:
        return
    Q_CACHE[sym.upper()] = {
        "symbol": sym.upper(),
        "last": float(last),
        "chg": (None if chg is None else float(chg)),
        # 캐시 timestamp 역시 KST 기준 epoch(sec)
        "ts": int(time.time()) + 9*3600,
    }

def _cache_get(sym: str):
    """캐시 조회. 없으면 None 반환."""
    return Q_CACHE.get(sym.upper())

# =========================
# [SECTION] .env 로드 & 환경 변수
# =========================
load_dotenv()

BINANCE_REST    = os.getenv("BINANCE_REST", "https://fapi.binance.com")  # 기본: 선물 REST
DB_URL          = os.getenv("DB_URL", "sqlite:///./tradinggear.db")
WEBHOOK_SECRET  = os.getenv("TG_WEBHOOK_SECRET", "changeme")
REQUEST_TIMEOUT = int(os.getenv("REQUEST_TIMEOUT", "10"))

# =========================
# [SECTION] SQLAlchemy 모델/세션
# =========================
Base = declarative_base()

class Signal(Base):
    """전략/웹훅 등으로 생성된 트레이딩 신호 기록 테이블.
    Columns:
      - symbol: 심볼(예: BTCUSDT)
      - interval: 캔들 주기(예: 1m)
      - side: LONG/SHORT/EXIT
      - reason: 생성 사유 문자열
      - price: 시그널 생성 시점 가격
      - ts: 신호 시각 (주의: DB에는 KST datetime 저장)
    """
    __tablename__ = "signals"
    id       = Column(Integer, primary_key=True, autoincrement=True)
    symbol   = Column(String(40), index=True)
    interval = Column(String(12), index=True)
    side     = Column(String(10))   # LONG/SHORT/EXIT
    reason   = Column(String(300))
    price    = Column(Float)
    ts       = Column(DateTime, index=True)  # KST 저장(원본 주석은 UTC였으나 실제 코드는 KST 저장)

# 조회 최적화를 위한 복합 인덱스
Index("ix_signals_symbol_interval_ts", Signal.symbol, Signal.interval, Signal.ts)

# 엔진/세션 초기화 및 테이블 생성
engine = create_engine(DB_URL, echo=False, future=True)
SessionLocal = sessionmaker(bind=engine, expire_on_commit=False, autoflush=False)
Base.metadata.create_all(bind=engine)

# =========================
# [SECTION] FastAPI 앱 & CORS & 템플릿
# =========================
app = FastAPI(title="TradingGear — SuperChart-like (KST)")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], allow_credentials=True,
    allow_methods=["*"], allow_headers=["*"],
)
# 템플릿 경로. index()에서 index_test4.html 사용
templates = Jinja2Templates(directory="templates")

# =========================
# [SECTION] HTTP 유틸
# =========================

def _get(url: str, params: Dict[str, Any]) -> Any:
    """requests.get 래퍼 — 상태코드 검사 후 JSON 반환."""
    r = requests.get(url, params=params, timeout=REQUEST_TIMEOUT)
    if r.status_code != 200:
        # FastAPI의 HTTPException으로 외부 에러를 그대로 전달
        raise HTTPException(status_code=r.status_code, detail=r.text)
    return r.json()

# =========================
# [SECTION] 시세/지표 계산 유틸
# =========================

def fetch_klines(symbol: str, interval: str, limit: int = 500):
    """Binance 선물 캔들 조회 → lightweight-charts용 포맷으로 변환.
    - 모든 시간은 epoch(sec, KST 보정)으로 반환(t: 초)
    - 값: o/h/l/c/v
    """
    data = _get(f"{BINANCE_REST}/fapi/v1/klines",
                {"symbol": symbol.upper(), "interval": interval, "limit": min(limit, 1500)})
    out = []
    for x in data:
        # Binance는 ms 단위 → 초단위로 변환, KST 보정을 위해 +9h
        out.append({
            "t": (int(x[0]) // 1000) + 9*3600,
            "o": float(x[1]), "h": float(x[2]),
            "l": float(x[3]), "c": float(x[4]), "v": float(x[5])
        })
    return out

def ema(series: List[float], length: int) -> List[float]:
    """지수이동평균(EMA). length가 클수록 완만."""
    k = 2 / (length + 1)
    out: List[float] = []
    prev: Optional[float] = None
    for x in series:
        prev = x if prev is None else (x*k + prev*(1-k))
        out.append(prev)
    return out

def tema(series: List[float], length: int) -> List[float]:
    """Triple EMA(TEMA) 구현: 3*EMA1 - 3*EMA2 + EMA3"""
    e1 = ema(series, length)
    e2 = ema(e1, length)
    e3 = ema(e2, length)
    return [3*e1[i] - 3*e2[i] + e3[i] for i in range(len(series))]

def atr(klines: List[Dict[str, float]], length: int = 14):
    """평균진폭(ATR) — 단순이동평균 방식.
    - 초기 length 구간은 seed 계산 후부터 유효 값 반환
    """
    trs = []
    prev_close = None
    # True Range(TR) 누적
    for k in klines:
        tr = (k["h"] - k["l"]) if prev_close is None else max(
            k["h"] - k["l"], abs(k["h"] - prev_close), abs(k["l"] - prev_close)
        )
        trs.append(tr)
        prev_close = k["c"]
    # SMA 방식의 ATR 시퀀스 생성
    out: List[Optional[float]] = []
    prev = None
    for i, tr in enumerate(trs):
        if i < length:
            out.append(None)
            if i == length - 1:
                prev = sum(trs[:length]) / length
                out[-1] = prev
        else:
            prev = (prev * (length - 1) + tr) / length
            out.append(prev)
    return out

def vwap(klines: List[Dict[str, float]]):
    """VWAP(거래량가중평균가) — 캔들 누적 기반."""
    cpv = 0.0  # 누적 (typical price * volume)
    cv = 0.0   # 누적 거래량
    out = []
    for k in klines:
        tp = (k["h"] + k["l"] + k["c"]) / 3.0
        cpv += tp * k["v"]
        cv  += k["v"]
        out.append(cpv/cv if cv > 0 else tp)
    return out

def cvd_approx(klines: List[Dict[str, float]]):
    """CVD 근사(양봉이면 +v, 음봉이면 -v 누적). 매수/매도 우위 추세 감지용.
    - 틱데이터가 없으므로 단순 근사.
    """
    s = 0.0
    out = []
    for k in klines:
        if k["c"] > k["o"]:
            s += k["v"]
        elif k["c"] < k["o"]:
            s -= k["v"]
        out.append(s)
    return out

# =========================
# [SECTION] OB(수요/공급) 존 탐지
# =========================

def detect_ob(klines: List[Dict[str, float]], lookback: int = 300, extend: int = 60):
    """최근 캔들에서 OB(수요/공급) 존 근사 탐지.
    - 기준 캔들(i) 이후 extend 구간에서 고가/저가 돌파 여부로 매수/매도 블록 후보를 만들고,
      최소 높이(ATR 기반/비율 기반)를 강제하여 지나치게 얇은 박스를 보정.
    - 중복/유사 박스는 병합하여 마지막 20개만 반환.
    Returns: [{type,start,end,top,bottom}, ...]
    """
    n = len(klines)
    if n < 5:
        return []
    last_t = klines[-1]["t"]
    start_i = max(1, n - (lookback + extend + 50))  # 과도한 전체 순회 방지
    zones: List[Dict[str, Any]] = []

    atrs = atr(klines, 14)

    def min_height(price: float, atr_val: Optional[float]) -> float:
        """박스 최소 높이(가격 비율 0.02% vs ATR의 10% 중 큰 값)."""
        base = price * 0.0002
        return max(base, (atr_val or 0) * 0.1)

    for i in range(start_i, n - 1):
        b = klines[i]
        top = max(b["o"], b["c"], b["h"])
        bottom = min(b["o"], b["c"], b["l"])
        fut = klines[i + 1:min(i + 1 + extend, n)]
        if not fut:
            continue

        # [Bullish] 하락 캔들 이후 고가 돌파 → 수요블록 후보
        if b["c"] < b["o"] and max(x["h"] for x in fut) >= b["h"]:
            h = top - bottom
            m = min_height(b["c"], atrs[i] if i < len(atrs) else None)
            if h < m:
                pad = (m - h) / 2
                top += pad; bottom -= pad
            zones.append({"type": "bullish", "start": b["t"], "end": last_t, "top": top, "bottom": bottom})

        # [Bearish] 상승 캔들 이후 저가 돌파 → 공급블록 후보
        if b["c"] > b["o"] and min(x["l"] for x in fut) <= b["l"]:
            h = top - bottom
            m = min_height(b["c"], atrs[i] if i < len(atrs) else None)
            if h < m:
                pad = (m - h) / 2
                top += pad; bottom -= pad
            zones.append({"type": "bearish", "start": b["t"], "end": last_t, "top": top, "bottom": bottom})

    # 거의 같은 상/하단의 박스는 하나로 병합(유사도 판정)
    merged: List[Dict[str, Any]] = []

    def almost_equal(a, b, tol=1e-4):
        m = (abs(a) + abs(b)) / 2 or 1.0
        return abs(a - b) / m < tol

    for z in zones:
        if any(z["type"] == m["type"] and almost_equal(z["top"], m["top"]) and almost_equal(z["bottom"], m["bottom"]) for m in merged):
            continue
        merged.append(z)

    # 가장 최근 기준 20개만 반환(렌더 과부하 방지)
    return merged[-20:]

# =========================
# [SECTION] 크로스 헬퍼(전략용)
# =========================

def crosses_over(prev_a, prev_b, a, b) -> bool:
    """a가 b 위로 상향 돌파했는지."""
    return prev_a is not None and prev_b is not None and prev_a <= prev_b and a > b

def crosses_under(prev_a, prev_b, a, b) -> bool:
    """a가 b 아래로 하향 돌파했는지."""
    return prev_a is not None and prev_b is not None and prev_a >= prev_b and a < b

# =========================
# [SECTION] 간단 전략(TEMA 교차 + VWAP 필터 + ATR 거리 + 쿨다운)
# =========================

def run_strategy(
    klines: List[Dict[str, float]],
    tema_len: int = 30,
    atr_len: int = 14,
    vwap_filter: bool = True,
    atr_distance_mult: float = 0.0,
    cooldown_bars: int = 5,
):
    """클로즈 vs TEMA 교차를 기본 시그널로 생성.
    - vwap_filter=True: 롱은 가격>=VWAP, 숏은 가격<=VWAP일 때만 허용
    - atr_distance_mult>0: |close - TEMA| >= mult * ATR 조건으로 가까운 노이즈 배제
    - cooldown_bars: 연속 신호 과다 방지
    Returns: [{ts, side, price, reason}, ...]
    """
    if len(klines) < max(tema_len, atr_len) + 5:
        return []

    closes = [k["c"] for k in klines]
    temas  = tema(closes, tema_len)
    atrs   = atr(klines, atr_len)
    vwaps  = vwap(klines)

    sigs = []
    last_sig_idx = None

    for i in range(1, len(klines)):
        c_prev, c_now = closes[i-1], closes[i]
        t_prev, t_now = temas[i-1], temas[i]
        v_now         = vwaps[i]
        a_now         = atrs[i] if i < len(atrs) else None

        if t_prev is None or t_now is None or a_now is None:
            continue  # seed 구간 미충족 등

        # ATR 거리 필터: TEMA와 너무 가까운 구간은 잡음으로 간주(옵션)
        if atr_distance_mult > 0 and abs(c_now - t_now) < atr_distance_mult * a_now:
            continue

        allow_long  = c_now >= v_now if vwap_filter else True
        allow_short = c_now <= v_now if vwap_filter else True

        make_long  = crosses_over(c_prev, t_prev, c_now, t_now) and allow_long
        make_short = crosses_under(c_prev, t_prev, c_now, t_now) and allow_short

        if make_long or make_short:
            # 쿨다운: 최근 신호로부터 N 캔들 이내면 스킵
            if last_sig_idx is not None and (i - last_sig_idx) < cooldown_bars:
                continue
            side = "LONG" if make_long else "SHORT"
            reason = [f"close×TEMA({tema_len}) cross {'over' if make_long else 'under'}"]
            if vwap_filter:
                reason.append("VWAP filter")
            if atr_distance_mult > 0:
                reason.append(f"|close−TEMA|≥{atr_distance_mult}×ATR({atr_len})")
            sigs.append({
                "ts": klines[i]["t"],
                "side": side,
                "price": c_now,
                "reason": "; ".join(reason),
            })
            last_sig_idx = i

    return sigs

# =========================
# [SECTION] 요청 바디 모델(웹훅)
# =========================
class WebhookIn(BaseModel):
    symbol: str
    side: Literal["LONG", "SHORT", "EXIT"]
    reason: Optional[str] = None
    price: Optional[float] = None
    interval: Optional[str] = "1m"
    ts: Optional[int] = None  # epoch(sec, KST 보정 전/후 무관; 아래에서 강제 보정)
    secret: Optional[str] = None

# =========================
# [SECTION] 라우팅 — Health & 기본 데이터 API
# =========================

@app.get("/health")
def health():
    """간단한 헬스체크.
    Returns: {ok: true, ts: epoch(sec, KST)}
    """
    return {"ok": True, "ts": int(time.time()) + 9*3600}

@app.get("/api/klines")
def api_klines(symbol: str = Query(...), interval: str = Query("1m"), limit: int = Query(500)):
    """Binance 캔들 원본을 그대로 전달(내부 fetch_klines 사용)."""
    return fetch_klines(symbol, interval, limit)

@app.get("/api/hud")
def api_hud(symbol: str = Query(...), interval: str = Query("1m"), limit: int = Query(500)):
    """HUD(요약 정보) — 마지막 캔들의 주요 지표를 한 번에 제공.
    - last_price, vwap, tema30, atr14, atrp(ATR/가격), cvd 누적, trend(up/down), ts
    """
    ks = fetch_klines(symbol, interval, limit)
    if len(ks) < 30:
        raise HTTPException(400, "insufficient klines")

    closes = [k["c"] for k in ks]
    vwaps  = vwap(ks)
    atrs   = atr(ks, 14)
    temas  = tema(closes, 30)
    cvds   = cvd_approx(ks)

    last = ks[-1]
    a    = next((x for x in reversed(atrs) if x is not None), None)
    t    = temas[-1]
    v    = vwaps[-1]

    trend = "up" if (t is not None and last["c"] >= t) else "down"
    atrp  = (a / last["c"]) if (a and last["c"] != 0) else None

    return {
        "symbol": symbol.upper(),
        "interval": interval,
        "last_price": last["c"],
        "vwap": v, "tema30": t, "atr14": a, "atrp": atrp,
        "cvd": cvds[-1], "trend": trend, "ts": last["t"]
    }

@app.get("/api/zones/ob")
def api_zones_ob(
    symbol: str = Query(...), interval: str = Query("1m"),
    lookback: int = Query(300, ge=50, le=3000),
    extend: int = Query(60, ge=10, le=600),
    debug: bool = Query(False),
):
    """OB 존(수요/공급) 후보 리스트 반환.
    - debug=True 시 탐지 메타 정보 포함
    """
    ks = fetch_klines(symbol, interval, lookback + extend + 120)
    zones = detect_ob(ks, lookback=lookback, extend=extend)
    payload = {"symbol": symbol.upper(), "interval": interval, "zones": zones}
    if debug:
        payload["debug"] = {
            "klines": len(ks), "lookback": lookback, "extend": extend,
            "found": len(zones), "last_time": ks[-1]["t"] if ks else None,
        }
    return payload

@app.post("/api/strategy/run")
def api_strategy_run(
    symbol: str = Query(...), interval: str = Query("1m"),
    limit: int = Query(500, ge=50, le=1500),
    tema_len: int = Query(30, ge=2, le=200),
    atr_len: int = Query(14, ge=2, le=200),
    vwap_filter: bool = Query(True),
    atr_distance_mult: float = Query(0.0, ge=0.0, le=5.0),
    cooldown_bars: int = Query(5, ge=0, le=100),
):
    """전략 실행 후 신호를 DB에 upsert(정확히는 중복 방지 insert).
    - DB 저장 시 ts는 KST datetime으로 변환되어 들어갑니다(조회 응답에서는 epoch로 변환).
    Returns: {generated, inserted, symbol, interval}
    """
    ks   = fetch_klines(symbol, interval, limit)
    sigs = run_strategy(
        ks,
        tema_len=tema_len, atr_len=atr_len,
        vwap_filter=vwap_filter,
        atr_distance_mult=atr_distance_mult,
        cooldown_bars=cooldown_bars,
    )

    written = 0
    with SessionLocal() as db:
        for s in sigs:
            # epoch(sec, KST 보정된 ts)를 KST timezone의 datetime으로 변환해 저장
            ts_dt = datetime.fromtimestamp(s["ts"], tz=timezone.utc).astimezone(KST)
            exists = db.execute(
                select(Signal)
                .where(
                    Signal.symbol == symbol.upper(),
                    Signal.interval == interval,
                    Signal.ts == ts_dt,
                    Signal.side == s["side"],
                )
                .limit(1)
            ).scalar_one_or_none()
            if exists:
                continue
            db.add(
                Signal(
                    symbol=symbol.upper(), interval=interval, side=s["side"],
                    reason=s["reason"], price=float(s["price"]), ts=ts_dt,
                )
            )
            written += 1
        db.commit()

    return {"generated": len(sigs), "inserted": written, "symbol": symbol.upper(), "interval": interval}

@app.get("/api/signals")
def api_signals(
    symbol: Optional[str] = Query(None),
    interval: Optional[str] = Query(None),
    limit: int = Query(100, ge=1, le=1000),
):
    """최근 신호를 최신순으로 반환.
    - DB에는 KST datetime으로 저장되어 있으므로 응답에서는 epoch(sec)로 다시 변환.
    """
    with SessionLocal() as db:
        q = select(Signal).order_by(desc(Signal.ts)).limit(limit)
        if symbol:
            q = q.where(Signal.symbol == symbol.upper())
        if interval:
            q = q.where(Signal.interval == interval)
        rows = db.execute(q).scalars().all()

    return [
        {
            "id": r.id,
            "symbol": r.symbol,
            "interval": r.interval,
            "side": r.side,
            "reason": r.reason,
            "price": r.price,
            # KST datetime → epoch(sec) (UTC 기준으로 치환 후 timestamp)
            "ts": int(r.ts.astimezone(KST).timestamp()) if r.ts else None,
        }
        for r in rows
    ]

@app.post("/tv/webhook")
def tv_webhook(inp: WebhookIn):
    """TradingView(Webhook) → Signal 저장.
    - 보안: WEBHOOK_SECRET 비교(일치하지 않으면 401)
    - ts 미지정 시 서버 현재 시각 KST epoch 사용
    """
    if WEBHOOK_SECRET and inp.secret != WEBHOOK_SECRET:
        raise HTTPException(401, "invalid secret")

    ts = inp.ts or int(time.time()) + 9*3600
    ts_dt = datetime.fromtimestamp(ts, tz=timezone.utc).astimezone(KST)

    with SessionLocal() as db:
        exists = db.execute(
            select(Signal)
            .where(
                Signal.symbol == inp.symbol.upper(),
                Signal.interval == inp.interval,
                Signal.ts == ts_dt,
                Signal.side == inp.side,
            )
            .limit(1)
        ).scalar_one_or_none()
        if not exists:
            db.add(
                Signal(
                    symbol=inp.symbol.upper(), interval=inp.interval, side=inp.side,
                    reason=inp.reason or "TV alert", price=float(inp.price) if inp.price else None,
                    ts=ts_dt,
                )
            )
            db.commit()

    return {"ok": True, "saved": True}

# =========================
# [SECTION] 템플릿 라우트 (샘플 UI)
# =========================
@app.get("/")
def index(request: Request):
    """템플릿 렌더: index_test4.html (원본 index7.html은 주석 처리된 상태).
    - templates/ 디렉터리에 파일이 있어야 정상 렌더됩니다.
    """
    # return templates.TemplateResponse("index7.html", {"request": request})
    return templates.TemplateResponse("index_test5.html", {"request": request})

# ----- [APPEND-ONLY] Superchart helpers ----- #
from fastapi import Query  # (원본 유지용 재-import)

# =========================
# [SECTION] Watchlist quotes (Binance 전용 간이 버전)
#  - 혼동 주의: 아래에 보다 견고한 통합 엔드포인트가 추가로 등장합니다.
# =========================
@app.get("/api/quotes")
def api_quotes(symbols: str = Query(..., description="Comma-separated symbols"),
               interval: str = Query("1m"), limit: int = Query(2)):
    """
    /api/quotes?symbols=BTCUSDT,ETHUSDT,SOLUSDT
    - Binance 캔들 2개로 마지막 값과 1-스텝 등락률(%) 계산
    - Binance 외 심볼은 error 반환
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

# ---------- [APPEND-ONLY] Yahoo Finance proxy (간이) ----------
from fastapi import Query  # (원본 유지용 재-import)
import time as _time

# 친숙명 → 야후 티커 매핑 테이블(간이)
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
    """친숙명 리스트를 야후 심볼로 변환(매핑 없으면 원본 유지)."""
    out = []
    for s in friendly_list:
        k = s.upper().strip()
        out.append(YF_MAP.get(k, k))
    return out

# (원본 주석 처리된 간이 /api/quotes/yf 버전은 유지 — 필요 시 복구 가능)
# [RESTORED] Yahoo Finance 전용 엔드포인트 — 주석 처리되어 있던 구간 복구
@app.get("/api/quotes/yf")
def api_quotes_yf(symbols: str = Query(..., description="Comma-separated friendly symbols e.g. VIX,AAPL,EURUSD,TSLA")):
    """
    Yahoo Finance 전용 심볼들을 조회합니다.
    - 친숙명(VIX,DXY,EURUSD,GBPUSD,USDJPY,AAPL,TSLA,NFLX 등) → YF_MAP으로 변환(없으면 원본 심볼 사용)
    - 내부적으로 `_yf_fetch()`를 사용하여 일괄 조회합니다.
    - 반환: {quotes: [{symbol,last,chg,ts}|{symbol,error}]}
    """
    syms = [s.strip().upper() for s in symbols.split(",") if s.strip()]
    if not syms:
        return {"quotes": []}

    # _yf_fetch는 친숙명 리스트를 받아 야후에서 일괄 조회하여
    # [{symbol,last,chg,ts}|{symbol,error}] 형태의 배열을 반환합니다.
    out = _yf_fetch(syms)
    return {"quotes": out}


# ---------- [APPEND-ONLY] 간이 통합 엔드포인트 (/api/quotes/any) ----------
"""
이 블록은 이후 보다 견고한 any2/all 구현으로 대체되도록 설계되었습니다.
호환성 유지를 위해 /api/quotes/any는 내부적으로 any2를 호출합니다.
"""
@app.get("/api/quotes/any")
def api_quotes_any(symbols: str = Query(..., description="Comma-separated symbols, mixes Binance & YF")):
    """구형 호환 엔드포인트 — 최종적으로는 any2 사용."""
    try:
        syms = [s.strip().upper() for s in symbols.split(",") if s.strip()]
        # 구형 로직은 그대로 두되, 최종 리턴은 any2 위임
        bn_syms = [s for s in syms if _is_binance_symbol(s)]  # 아래에서 재정의됨(최종 버전 사용)
        yf_syms = [s for s in syms if not _is_binance_symbol(s)]

        out = []
        for s in bn_syms:
            out.append(_binance_24h(s))  # 아래에서 재정의됨(최종 버전 사용)
        if yf_syms:
            yf = api_quotes_yf(",".join(yf_syms))
            out.extend(yf.get("quotes", []))

        by_sym = {q.get("symbol", "").upper(): q for q in out}
        ordered = [by_sym.get(s, {"symbol": s, "error": "not found"}) for s in syms]
        # return {"quotes": ordered}
        # 호출 호환성: any2로 위임
        return api_quotes_any2(symbols=symbols)
    except Exception as e:
        return {"quotes": [{"symbol": s, "error": str(e)} for s in symbols.split(",")]}

# ===== [PATCH] Robust unified quotes endpoint (Binance + Yahoo) =====
from fastapi import Query  # (원본 유지용 재-import)
import time as _time

# 보다 확장된 매핑(주식/FX/지수)
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
    """바이낸스 심볼 판정(간단 패턴: USDT/USDC/BTC/ETH 포함)."""
    s = (sym or "").upper()
    return any(x in s for x in ("USDT", "USDC", "BTC", "ETH"))


def _binance_24h(symbol: str):
    """선물 24h → 실패 시 현물 24h 폴백.
    Returns: {symbol,last,chg,ts} or {symbol,error}
    """
    try:
        url = f"{BINANCE_REST}/fapi/v1/ticker/24hr"
        r = requests.get(url, params={"symbol": symbol.upper()}, timeout=REQUEST_TIMEOUT)
        if r.status_code == 200:
            j = r.json()
            last = float(j["lastPrice"])  # KeyError 발생 시 예외로 처리
            chg  = float(j["priceChangePercent"])
            return {"symbol": symbol.upper(), "last": last, "chg": chg, "ts": int(_time.time()) + 9*3600}
        # 선물 실패 시 Spot으로 재시도
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
    """야후에서 여러 종목을 일괄 조회.
    - 200이 아닌 경우: 각 심볼에 HTTP 상태를 부여
    - 결과 누락: "YF no quote" 처리
    - regularMarketPrice 없으면: "YF no price"
    """
    try:
        if not friendly_syms:
            return []
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
            now = int(_time.time()) + 9*3600
            return [{"symbol": s, "error": f"YF HTTP {r.status_code}", "ts": now} for s in friendly_syms]

        data = r.json().get("quoteResponse", {}).get("result", [])
        by_y = {(row.get("symbol") or "").upper(): row for row in data}
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
                    "ts": now,
                })
        return out
    except Exception as e:
        now = int(_time.time()) + 9*3600
        return [{"symbol": s, "error": f"YF {e}", "ts": now} for s in friendly_syms]


@app.get("/api/quotes/any2")
def api_quotes_any2(symbols: str = Query(..., description="Comma-separated symbols (Binance + Yahoo)")):
    """견고한 통합 쿼트 엔드포인트(v2).
    - Binance 심볼은 개별 24h 호출(선물→현물 폴백)
    - 그 외는 야후 일괄 조회
    - 입력 순서 보존
    """
    # 1) 입력 파싱
    syms = [s.strip().upper() for s in symbols.split(",") if s.strip()]
    if not syms:
        return {"quotes": []}

    # 2) 타입 분리
    bn_syms = [s for s in syms if _is_binance_symbol(s)]
    yf_syms = [s for s in syms if not _is_binance_symbol(s)]

    # 3) 조회 실행
    out = []
    for s in bn_syms:
        out.append(_binance_24h(s))
    out.extend(_yf_fetch(yf_syms))

    # 4) 요청 순서 보존
    by = {(q.get("symbol") or "").upper(): q for q in out}
    ordered = [by.get(s, {"symbol": s, "error": "no quote source"}) for s in syms]
    return {"quotes": ordered}

# ===== [SECTION] Yahoo 429 Guard(캐시/레이트리미트/백오프) =====
import time as _time, random as _rand

# 야후 쪽 보호 파라미터(.env로 조절 가능)
YF_TTL_SEC       = int(os.getenv("YF_TTL_SEC", "30"))        # 캐시 TTL(sec)
YF_MIN_INTERVAL  = float(os.getenv("YF_MIN_INTERVAL", "1.2")) # 최소 호출 간격(sec)
YF_MAX_RETRY     = int(os.getenv("YF_MAX_RETRY", "2"))        # 429 재시도 횟수
YF_BACKOFF_BASE  = float(os.getenv("YF_BACKOFF_BASE", "0.8")) # 지수 백오프 베이스
YF_BACKOFF_JIT   = float(os.getenv("YF_BACKOFF_JIT", "0.25")) # 지터(무작위 추가 대기)

# 간단 캐시 구조: { friendly: {ts,last,chg} }
_YF_CACHE: Dict[str, Dict[str, Any]] = {}
_YF_LAST_CALL_TS = 0.0


def _yf_headers():
    """야후가 종종 User-Agent가 빈 요청을 거부하므로 기본 헤더 부여."""
    return {"User-Agent": "Mozilla/5.0"}


def _yf_cache_put(sym: str, last: float, chg: Optional[float]):
    _YF_CACHE[sym] = {"ts": int(_time.time()) + 9*3600, "last": last, "chg": chg}


def _yf_cache_get(sym: str):
    v = _YF_CACHE.get(sym)
    if not v:
        return None
    if int(_time.time()) + 9*3600 - v["ts"] > YF_TTL_SEC:
        return None
    return v


def _yf_sleep_to_rate_limit():
    """최소 호출 간격을 보장하기 위해 필요 시 sleep."""
    global _YF_LAST_CALL_TS
    now = _time.time()
    wait = (_YF_LAST_CALL_TS + YF_MIN_INTERVAL) - now
    if wait > 0:
        _time.sleep(wait)
    _YF_LAST_CALL_TS = _time.time()


def _yf_fetch_batch(y_syms: list[str]) -> dict:
    """야후 배치 조회(429 안전).
    Returns: { friendly_or_y_symbol: {last, chg, ts, [cached]} | {error} }
    """
    out: Dict[str, Dict[str, Any]] = {}
    if not y_syms:
        return out

    url = "https://query1.finance.yahoo.com/v7/finance/quote"

    _yf_sleep_to_rate_limit()
    retry = 0
    while True:
        try:
            r = requests.get(
                url,
                params={"symbols": ",".join(y_syms)},
                headers=_yf_headers(),
                timeout=REQUEST_TIMEOUT,
            )
            if r.status_code == 200:
                data = r.json().get("quoteResponse", {}).get("result", [])
                by_y = {(row.get("symbol") or "").upper(): row for row in data}
                now_ts = int(_time.time()) + 9*3600

                for friendly, y in zip(y_syms, y_syms):
                    row = by_y.get((y or "").upper())
                    if not row:
                        # 캐시 폴백
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
                # Retry-After 헤더 존중 + 지수 백오프 + 지터
                ra = r.headers.get("Retry-After")
                if ra:
                    try:
                        _time.sleep(float(ra))
                    except Exception:
                        pass
                delay = (YF_BACKOFF_BASE ** (retry + 1)) + (_rand.random() * YF_BACKOFF_JIT)
                _time.sleep(delay)
                retry += 1
                continue

            else:
                # 기타 HTTP 오류 — 캐시 폴백 또는 에러 표기
                now_ts = int(_time.time()) + 9*3600
                for friendly in y_syms:
                    c = _yf_cache_get(friendly)
                    if c:
                        out[friendly] = {"last": c["last"], "chg": c["chg"], "ts": now_ts, "cached": True}
                    else:
                        out[friendly] = {"error": f"YF HTTP {r.status_code}"}
                return out

        except Exception as e:
            # 네트워크 예외 — 캐시 폴백 또는 에러 표기
            now_ts = int(_time.time()) + 9*3600
            for friendly in y_syms:
                c = _yf_cache_get(friendly)
                if c:
                    out[friendly] = {"last": c["last"], "chg": c["chg"], "ts": now_ts, "cached": True}
                else:
                    out[friendly] = {"error": f"YF {e}"}
            return out

# ===== [REPLACE/ADD] 통합 엔드포인트(all) — YF guard 사용 =====
from fastapi import Query as _Q  # 별칭 import (원본 유지)
import time as _time  # 재-import (원본 유지)

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
    """(재정의) — 파일 말미의 최종 판정 함수를 사용."""
    s = (sym or "").upper()
    return any(x in s for x in ("USDT", "USDC", "BTC", "ETH"))


def _yf_map_list(friendly_list):
    """(재정의) — all 엔드포인트에서 사용하는 변환."""
    out = []
    for s in friendly_list:
        k = s.upper().strip()
        out.append(_YF_MAP.get(k, k))
    return out


def _binance_24h(symbol: str):
    """(재정의) — all 엔드포인트 용 간략 버전."""
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
    """최종 통합 엔드포인트(all) — Binance + Yahoo(429-safe).
    - 입력된 순서 그대로 결과를 배열에 담아 반환합니다.
    """
    syms = [s.strip().upper() for s in symbols.split(",") if s.strip()]
    out = []

    binance_syms = [s for s in syms if _is_binance_symbol(s)]
    yf_syms      = [s for s in syms if not _is_binance_symbol(s)]

    # Binance 개별 조회
    for sym in binance_syms:
        out.append(_binance_24h(sym))

    # Yahoo 일괄 조회(429-safe)
    if yf_syms:
        y_syms = _yf_map_list(yf_syms)
        results = _yf_fetch_batch(y_syms)
        now_ts = int(_time.time()) + 9*3600
        for friendly, y in zip(yf_syms, y_syms):
            row = results.get(friendly) or results.get(y) or {}
            if "last" in row:
                out.append({
                    "symbol": friendly,
                    "last": row["last"],
                    "chg": row.get("chg"),
                    "ts": row.get("ts", now_ts),
                })
            else:
                out.append({"symbol": friendly, "error": row.get("error", "no quote")})

    return {"quotes": out}
