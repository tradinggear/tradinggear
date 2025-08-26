# main.py
# FastAPI 단일 파일: Pine 스타일 전략 서버 + 내장 UI(경량 차트, OB 박스, HUD, 시그널)
# - /              : 단일 HTML 페이지(내장 JS) — 캔들, VWAP/TEMA, 시그널, OB 존 + HUD
# - /health        : 헬스체크
# - /api/klines    : 바이낸스 선물 캔들 프락시
# - /api/hud       : HUD 스냅샷(CVD/VWAP/ATR/TEMA/Trend)
# - /api/zones/ob  : 주문블럭(OB) 존 계산
# - /api/strategy/run : 서버측 전략 계산(TEMA×VWAP×ATR 예시) → DB 저장
# - /api/signals   : 저장된 시그널 조회
# - /tv/webhook    : TV 알림 수신(비밀키)
#
# 실행:
#   pip install fastapi uvicorn[standard] sqlalchemy pydantic requests python-dotenv
#   export TG_WEBHOOK_SECRET=changeme
#   export DB_URL=sqlite:///./tradinggear.db
#   uvicorn main:app --host 0.0.0.0 --port 8000 --reload
# 또는 gunicorn: gunicorn -k uvicorn.workers.UvicornWorker main:app -b 0.0.0.0:8000 --timeout 120

from fastapi import FastAPI, HTTPException, Query
from fastapi.responses import HTMLResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict, Any, Literal
from datetime import datetime, timezone
import requests, time, os

from sqlalchemy import (
    create_engine, Column, Integer, String, Float, DateTime, select, desc, Index
)
from sqlalchemy.orm import sessionmaker, declarative_base
from dotenv import load_dotenv

load_dotenv()

BINANCE_REST   = os.getenv("BINANCE_REST", "https://fapi.binance.com")
DB_URL         = os.getenv("DB_URL", "sqlite:///./tradinggear.db")
WEBHOOK_SECRET = os.getenv("TG_WEBHOOK_SECRET", "changeme")
REQUEST_TIMEOUT = int(os.getenv("REQUEST_TIMEOUT", "10"))

# =====================[ DB ]=====================
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

# =====================[ APP ]=====================
app = FastAPI(title="TradingGear Pine Strategy — Single File (Python Only)")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # 운영시 제한 권장
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# =====================[ HTTP Utils ]=====================
def _get(url: str, params: Dict[str, Any]) -> Any:
    r = requests.get(url, params=params, timeout=REQUEST_TIMEOUT)
    if r.status_code != 200:
        raise HTTPException(status_code=r.status_code, detail=r.text)
    return r.json()

# =====================[ Data / Indicators ]=====================
def fetch_klines(symbol: str, interval: str, limit: int = 500):
    url = f"{BINANCE_REST}/fapi/v1/klines"
    data = _get(url, {"symbol": symbol.upper(), "interval": interval, "limit": min(limit, 1500)})
    out = []
    for x in data:
        out.append({
            "t": int(x[0]) // 1000,
            "o": float(x[1]),
            "h": float(x[2]),
            "l": float(x[3]),
            "c": float(x[4]),
            "v": float(x[5]),
        })
    return out

def ema(series: List[float], length: int) -> List[float]:
    k = 2 / (length + 1)
    out = []
    prev = None
    for x in series:
        if prev is None:
            prev = x
        else:
            prev = x * k + prev * (1 - k)
        out.append(prev)
    return out

def tema(series: List[float], length: int) -> List[float]:
    e1 = ema(series, length)
    e2 = ema(e1, length)
    e3 = ema(e2, length)
    return [3*e1[i] - 3*e2[i] + e3[i] for i in range(len(series))]

def atr(klines: List[Dict[str, float]], length: int = 14):
    trs = []
    prev_close = None
    for k in klines:
        if prev_close is None:
            tr = k["h"] - k["l"]
        else:
            tr = max(k["h"] - k["l"], abs(k["h"] - prev_close), abs(k["l"] - prev_close))
        trs.append(tr)
        prev_close = k["c"]
    out = []
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
    cum_pv = 0.0
    cum_v  = 0.0
    out = []
    for k in klines:
        tp = (k["h"] + k["l"] + k["c"]) / 3.0
        cum_pv += tp * k["v"]
        cum_v  += k["v"]
        out.append(cum_pv / cum_v if cum_v > 0 else tp)
    return out

def cvd_approx(klines: List[Dict[str, float]]):
    s = 0.0
    out = []
    for k in klines:
        if k["c"] > k["o"]:
            s += k["v"]
        elif k["c"] < k["o"]:
            s -= k["v"]
        out.append(s)
    return out

# =====================[ OB / Zones ]=====================
def detect_ob(klines: List[Dict[str, float]], lookback: int = 300, extend: int = 40):
    n = len(klines)
    if n < 5:
        return []
    start_i = max(1, n - lookback)
    zones = []
    for i in range(start_i + 1, n - 2):
        a = klines[i - 1]
        b = klines[i]
        c = klines[i + 1]
        broke_up = (c["h"] > max(a["h"], b["h"])) and (c["c"] > c["o"])
        last_red = b["c"] < b["o"]
        if last_red and broke_up:
            top    = max(b["o"], b["c"])
            bottom = min(b["o"], b["c"])
            zones.append({"type": "bullish", "start": b["t"], "end": klines[min(i + extend, n - 1)]["t"], "top": top, "bottom": bottom})
        broke_dn   = (c["l"] < min(a["l"], b["l"])) and (c["c"] < c["o"])
        last_green = b["c"] > b["o"]
        if last_green and broke_dn:
            top    = max(b["o"], b["c"])
            bottom = min(b["o"], b["c"])
            zones.append({"type": "bearish", "start": b["t"], "end": klines[min(i + extend, n - 1)]["t"], "top": top, "bottom": bottom})
    return zones

# =====================[ Strategy ]=====================
def crosses_over(prev_a, prev_b, a, b) -> bool:
    return prev_a is not None and prev_b is not None and prev_a <= prev_b and a > b

def crosses_under(prev_a, prev_b, a, b) -> bool:
    return prev_a is not None and prev_b is not None and prev_a >= prev_b and a < b

def run_strategy(klines: List[Dict[str, float]], tema_len: int = 30, atr_len: int = 14, vwap_filter: bool = True, atr_distance_mult: float = 0.0, cooldown_bars: int = 5):
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
            continue
        if atr_distance_mult > 0 and abs(c_now - t_now) < atr_distance_mult * a_now:
            continue
        allow_long  = True
        allow_short = True
        if vwap_filter:
            allow_long  = c_now >= v_now
            allow_short = c_now <= v_now
        make_long  = crosses_over(c_prev, t_prev, c_now, t_now) and allow_long
        make_short = crosses_under(c_prev, t_prev, c_now, t_now) and allow_short
        if make_long or make_short:
            if last_sig_idx is not None and (i - last_sig_idx) < cooldown_bars:
                continue
            side = "LONG" if make_long else "SHORT"
            reason = [f"close×TEMA({tema_len}) cross {'over' if make_long else 'under'}"]
            if vwap_filter:
                reason.append("VWAP filter")
            if atr_distance_mult > 0:
                reason.append(f"|close−TEMA|≥{atr_distance_mult}×ATR({atr_len})")
            sigs.append({"ts": klines[i]["t"], "side": side, "price": c_now, "reason": "; ".join(reason)})
            last_sig_idx = i
    return sigs

# =====================[ Schemas ]=====================
class WebhookIn(BaseModel):
    symbol: str
    side: Literal["LONG", "SHORT", "EXIT"]
    reason: Optional[str] = None
    price: Optional[float] = None
    interval: Optional[str] = "1m"
    ts: Optional[int] = None
    secret: Optional[str] = None

# =====================[ Routes — API ]=====================
@app.get("/health")
def health():
    return {"ok": True, "ts": int(time.time())}

@app.get("/api/klines")
def api_klines(symbol: str = Query(...), interval: str = Query("1m"), limit: int = Query(500)):
    return fetch_klines(symbol, interval, limit)

@app.get("/api/hud")
def api_hud(symbol: str = Query(...), interval: str = Query("1m"), limit: int = Query(500)):
    ks = fetch_klines(symbol, interval, limit)
    if len(ks) < 30:
        raise HTTPException(400, "insufficient klines")
    closes = [k["c"] for k in ks]
    vwaps  = vwap(ks)
    atrs   = atr(ks, 14)
    temas  = tema(closes, 30)
    cvds   = cvd_approx(ks)

    last = ks[-1]
    a = next((x for x in reversed(atrs) if x is not None), None)
    t = temas[-1]
    v = vwaps[-1]
    trend = "up" if (t is not None and last["c"] >= t) else "down"
    atrp = (a / last["c"]) if (a and last["c"] != 0) else None

    return {"symbol": symbol.upper(), "interval": interval, "last_price": last["c"], "vwap": v, "tema30": t, "atr14": a, "atrp": atrp, "cvd": cvds[-1], "trend": trend, "ts": last["t"]}

@app.get("/api/zones/ob")
def api_zones_ob(symbol: str = Query(...), interval: str = Query("1m"), lookback: int = Query(300, ge=50, le=2000), extend: int = Query(40, ge=1, le=500)):
    ks = fetch_klines(symbol, interval, lookback + extend + 10)
    zones = detect_ob(ks, lookback=lookback, extend=extend)
    return {"symbol": symbol.upper(), "interval": interval, "zones": zones}

@app.post("/api/strategy/run")
def api_strategy_run(symbol: str = Query(...), interval: str = Query("1m"), limit: int = Query(500, ge=50, le=1500), tema_len: int = Query(30, ge=2, le=200), atr_len: int = Query(14, ge=2, le=200), vwap_filter: bool = Query(True), atr_distance_mult: float = Query(0.0, ge=0.0, le=5.0), cooldown_bars: int = Query(5, ge=0, le=100)):
    ks = fetch_klines(symbol, interval, limit)
    sigs = run_strategy(ks, tema_len=tema_len, atr_len=atr_len, vwap_filter=vwap_filter, atr_distance_mult=atr_distance_mult, cooldown_bars=cooldown_bars)

    written = 0
    with SessionLocal() as db:
        for s in sigs:
            ts_dt = datetime.fromtimestamp(s["ts"], tz=timezone.utc)
            exists = db.execute(select(Signal).where(Signal.symbol==symbol.upper(), Signal.interval==interval, Signal.ts==ts_dt, Signal.side==s["side"]).limit(1)).scalar_one_or_none()
            if exists:
                continue
            row = Signal(symbol=symbol.upper(), interval=interval, side=s["side"], reason=s["reason"], price=float(s["price"]), ts=ts_dt)
            db.add(row)
            written += 1
        db.commit()
    return {"generated": len(sigs), "inserted": written, "symbol": symbol.upper(), "interval": interval}

@app.get("/api/signals")
def api_signals(symbol: Optional[str] = Query(None), interval: Optional[str] = Query(None), limit: int = Query(100, ge=1, le=1000)):
    with SessionLocal() as db:
        q = select(Signal).order_by(desc(Signal.ts)).limit(limit)
        if symbol:
            q = q.where(Signal.symbol == symbol.upper())
        if interval:
            q = q.where(Signal.interval == interval)
        rows = db.execute(q).scalars().all()

    def row_to_dict(r: Signal):
        return {"id": r.id, "symbol": r.symbol, "interval": r.interval, "side": r.side, "reason": r.reason, "price": r.price, "ts": int(r.ts.replace(tzinfo=timezone.utc).timestamp()) if r.ts else None}
    return [row_to_dict(r) for r in rows]

@app.post("/tv/webhook")
def tv_webhook(inp: WebhookIn):
    if WEBHOOK_SECRET and inp.secret != WEBHOOK_SECRET:
        raise HTTPException(401, "invalid secret")
    ts = inp.ts or int(time.time())
    ts_dt = datetime.fromtimestamp(ts, tz=timezone.utc)
    with SessionLocal() as db:
        exists = db.execute(select(Signal).where(Signal.symbol==inp.symbol.upper(), Signal.interval==inp.interval, Signal.ts==ts_dt, Signal.side==inp.side).limit(1)).scalar_one_or_none()
        if not exists:
            row = Signal(symbol=inp.symbol.upper(), interval=inp.interval, side=inp.side, reason=inp.reason or "TV alert", price=float(inp.price) if inp.price else None, ts=ts_dt)
            db.add(row)
            db.commit()
    return {"ok": True, "saved": True}

# =====================[ Route — Single Page UI ]=====================
@app.get("/", response_class=HTMLResponse)
def ui():
    return HTMLResponse("""
<!doctype html>
<html lang=\"ko\">
<head>
  <meta charset=\"utf-8\" />
  <title>TradingGear — Python Only UI</title>
  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1\" />
  <!-- Lightweight Charts (standalone, version-pinned) -->
  <script src=\"https://unpkg.com/lightweight-charts@4.2.0/dist/lightweight-charts.standalone.production.js\" crossorigin=\"anonymous\"></script>
  <style>
    body { margin:0; font-family: ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, 'Noto Sans KR', 'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif; background:#0b1020; color:#e7eaf3; }
    .wrap { display:flex; flex-direction:column; height:100vh; }
    header { padding:12px 16px; display:flex; gap:12px; align-items:center; background:#101633; border-bottom:1px solid #1c254b; }
    header input, header select, header button { background:#0f1533; color:#e7eaf3; border:1px solid #26305a; border-radius:10px; padding:8px 10px; }
    header button { cursor:pointer; }
    .hud { display:flex; gap:10px; flex-wrap:wrap; padding:8px 16px; background:#0e1430; border-bottom:1px dashed #26305a; }
    .hud .card { background:#0f1638; border:1px solid #26305a; border-radius:12px; padding:8px 12px; min-width:120px; }
    .chart-wrap { position:relative; flex:1; }
    #chart { position:absolute; inset:0; }
    #overlay { position:absolute; inset:0; pointer-events:none; }
    .footer { padding:6px 16px; font-size:12px; color:#90a0c5; background:#0e1430; border-top:1px solid #1c254b; }
    .tag { padding:2px 6px; border-radius:8px; background:#1a234a; border:1px solid #2b3a78; font-size:12px; }
    .sep { flex:1; }
  </style>
</head>
<body>
<div class=\"wrap\">
  <header>
    <label>심볼 <input id=\"symbol\" value=\"SOLUSDT\" style=\"width:120px\"/></label>
    <label>인터벌 
      <select id=\"interval\">
        <option value=\"1m\">1m</option><option value=\"3m\">3m</option><option value=\"5m\">5m</option>
        <option value=\"15m\" selected>15m</option><option value=\"1h\">1h</option><option value=\"4h\">4h</option>
      </select>
    </label>
    <label><input type=\"checkbox\" id=\"showVWAP\" checked> VWAP</label>
    <label><input type=\"checkbox\" id=\"showTEMA\" checked> TEMA(30)</label>
    <label><input type=\"checkbox\" id=\"showOB\" checked> OB 존</label>
    <button id=\"loadBtn\">불러오기</button>
    <button id=\"runStratBtn\">전략계산</button>
    <span class=\"sep\"></span>
    <span class=\"tag\">Python Only UI</span>
  </header>

  <div class=\"hud\" id=\"hud\">
    <div class=\"card\"><div>가격</div><div id=\"hud_price\">-</div></div>
    <div class=\"card\"><div>VWAP</div><div id=\"hud_vwap\">-</div></div>
    <div class=\"card\"><div>TEMA(30)</div><div id=\"hud_tema\">-</div></div>
    <div class=\"card\"><div>ATR(14)</div><div id=\"hud_atr\">-</div></div>
    <div class=\"card\"><div>ATR%</div><div id=\"hud_atrp\">-</div></div>
    <div class=\"card\"><div>CVD</div><div id=\"hud_cvd\">-</div></div>
    <div class=\"card\"><div>Trend</div><div id=\"hud_trend\">-</div></div>
  </div>

  <div class=\"chart-wrap\">
    <div id=\"chart\"></div>
    <canvas id=\"overlay\"></canvas>
  </div>

  <div class=\"footer\">
    시그널: 캔들 위/아래 화살표 — <span style=\"color:#6be675\">LONG</span> / <span style=\"color:#f26d6d\">SHORT</span> · OB 박스: 보라(상승), 붉은(하락)
  </div>
</div>

<script>
const api = (p) => p; // same-origin
const $   = (id) => document.getElementById(id);

let chartApi, candleSeries, vwapSeries, temaSeries;
let zones = [];

function fmt(n, d=2){ if(n===null||n===undefined||isNaN(n)) return '-'; return Number(n).toFixed(d); }

function buildChart(){
  const chartContainer = document.getElementById("chart");
  const overlay        = document.getElementById("overlay");

  if (!window.LightweightCharts || typeof LightweightCharts.createChart !== 'function') {
    console.error('LightweightCharts not loaded');
    alert('차트 라이브러리를 로드하지 못했습니다. 네트워크/CSP를 확인하세요.');
    return;
  }

  chartApi = LightweightCharts.createChart(chartContainer, {
    width:  chartContainer.clientWidth,
    height: chartContainer.clientHeight,
    layout: { background: { type: 'solid', color: '#0b1020' }, textColor: '#e7eaf3' },
    grid:   { vertLines: { color: '#1a234a' }, horzLines: { color: '#1a234a' } },
    timeScale:       { borderColor: '#2b3a78' },
    rightPriceScale: { borderColor: '#2b3a78' },
    crosshair: { mode: LightweightCharts.CrosshairMode.Normal },
  });

  if (!chartApi || typeof chartApi.addCandlestickSeries !== 'function') {
    console.error('Invalid chartApi:', chartApi);
    alert('차트 인스턴스가 올바르지 않습니다. 스크립트 충돌/캐시를 확인하세요.');
    return;
  }

  candleSeries = chartApi.addCandlestickSeries({
    upColor: '#2dd4bf', downColor: '#f87171',
    borderUpColor: '#2dd4bf', borderDownColor:'#f87171',
    wickUpColor:'#2dd4bf', wickDownColor:'#f87171'
  });
  vwapSeries = chartApi.addLineSeries({ color:'#8ab4ff', lineWidth:1, visible: document.getElementById('showVWAP').checked });
  temaSeries = chartApi.addLineSeries({ color:'#ffd166', lineWidth:1, visible: document.getElementById('showTEMA').checked });

  function resize(){
    const rect = chartContainer.getBoundingClientRect();
    overlay.width  = rect.width * devicePixelRatio;
    overlay.height = rect.height * devicePixelRatio;
    overlay.style.width  = rect.width + 'px';
    overlay.style.height = rect.height + 'px';
    drawZones();
  }
  new ResizeObserver(resize).observe(chartContainer);
  chartApi.timeScale().subscribeVisibleTimeRangeChange(drawZones);
  resize();
}

function timeToX(t){ const x = chartApi.timeScale().timeToCoordinate(t); return x ? x * devicePixelRatio : null; }
function priceToY(p){ const y = candleSeries.priceToCoordinate(p); return y ? y * devicePixelRatio : null; }

function drawZones(){
  const canvas = document.getElementById('overlay');
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0,0,canvas.width,canvas.height);
  zones.forEach(z=>{
    const x1 = timeToX(z.start), x2 = timeToX(z.end);
    const y1 = priceToY(z.top),  y2 = priceToY(z.bottom);
    if([x1,x2,y1,y2].some(v=>v===null)) return;
    const left = Math.min(x1,x2), right = Math.max(x1,x2);
    const top = Math.min(y1,y2), bottom = Math.max(y1,y2);
    ctx.save();
    ctx.beginPath();
    ctx.rect(left, top, right-left, bottom-top);
    if(z.type==='bullish'){ ctx.fillStyle='rgba(165, 105, 255, 0.18)'; ctx.strokeStyle='rgba(165,105,255, 0.7)'; }
    else { ctx.fillStyle='rgba(255, 105, 105, 0.18)'; ctx.strokeStyle='rgba(255,105,105, 0.7)'; }
    ctx.fill();
    ctx.lineWidth = 2 * devicePixelRatio;
    ctx.stroke();
    ctx.restore();
  });
}

async function loadAll(){
  const symbol = document.getElementById('symbol').value.trim().toUpperCase();
  const interval = document.getElementById('interval').value;

  const ks = await fetch(api(`/api/klines?symbol=${symbol}&interval=${interval}&limit=500`)).then(r=>r.json());
  const candles = ks.map(k=>({ time: k.t, open:k.o, high:k.h, low:k.l, close:k.c }));
  candleSeries.setData(candles);

  const vwap = (()=>{ let cpv=0, cv=0; return ks.map(k=>{ const tp=(k.h+k.l+k.c)/3; cpv+=tp*k.v; cv+=k.v; return cv>0?cpv/cv:tp; }); })();
  const tema = (function temaCalc(L){ 
    const ema=(s,l)=>{ const k=2/(l+1); let p=null; return s.map(x=>{ p=(p===null?x:(x*k+p*(1-k))); return p; }); };
    const closes = ks.map(k=>k.c);
    const e1=ema(closes, L), e2=ema(e1,L), e3=ema(e2,L);
    return e1.map((_,i)=>3*e1[i]-3*e2[i]+e3[i]);
  })(30);

  vwapSeries.setData(ks.map((k,i)=>({ time:k.t, value:vwap[i] })));
  temaSeries.setData(ks.map((k,i)=>({ time:k.t, value:tema[i] })));
  vwapSeries.applyOptions({ visible: document.getElementById('showVWAP').checked });
  temaSeries.applyOptions({ visible: document.getElementById('showTEMA').checked });

  zones = [];
  if(document.getElementById('showOB').checked){
    const z = await fetch(api(`/api/zones/ob?symbol=${symbol}&interval=${interval}&lookback=300&extend=40`)).then(r=>r.json());
    zones = z.zones || [];
  }
  drawZones();

  const sigs = await fetch(api(`/api/signals?symbol=${symbol}&interval=${interval}&limit=200`)).then(r=>r.json());
  const markers = (sigs || []).map(s=>({ time: s.ts, position: s.side==='LONG' ? 'belowBar' : 'aboveBar', color: s.side==='LONG' ? '#2dd4bf' : '#f87171', shape: s.side==='LONG' ? 'arrowUp' : 'arrowDown', text: s.side }));
  candleSeries.setMarkers(markers);

  chartApi.timeScale().fitContent();
  await refreshHUD();
}

async function refreshHUD(){
  const symbol = document.getElementById('symbol').value.trim().toUpperCase();
  const interval = document.getElementById('interval').value;
  const h = await fetch(api(`/api/hud?symbol=${symbol}&interval=${interval}&limit=500`)).then(r=>r.json()).catch(()=>null);
  if(!h) return;
  document.getElementById('hud_price').textContent = fmt(h.last_price);
  document.getElementById('hud_vwap').textContent  = fmt(h.vwap);
  document.getElementById('hud_tema').textContent  = fmt(h.tema30);
  document.getElementById('hud_atr').textContent   = fmt(h.atr14);
  document.getElementById('hud_atrp').textContent  = h.atrp ? fmt(h.atrp*100,2)+'%' : '-';
  document.getElementById('hud_cvd').textContent   = fmt(h.cvd,0);
  document.getElementById('hud_trend').textContent = h.trend==='up' ? '상승' : '하락';
}

async function runStrategy(){
  const symbol = document.getElementById('symbol').value.trim().toUpperCase();
  const interval = document.getElementById('interval').value;
  await fetch(api(`/api/strategy/run?symbol=${symbol}&interval=${interval}&limit=500&tema_len=30&atr_len=14&vwap_filter=true&atr_distance_mult=0.0&cooldown_bars=5`), { method:'POST' });
  const sigs = await fetch(api(`/api/signals?symbol=${symbol}&interval=${interval}&limit=200`)).then(r=>r.json());
  const markers = (sigs || []).map(s=>({ time: s.ts, position: s.side==='LONG' ? 'belowBar' : 'aboveBar', color: s.side==='LONG' ? '#2dd4bf' : '#f87171', shape: s.side==='LONG' ? 'arrowUp' : 'arrowDown', text: s.side }));
  candleSeries.setMarkers(markers);
}

window.addEventListener('DOMContentLoaded', ()=>{
  buildChart();
  document.getElementById('loadBtn').addEventListener('click', loadAll);
  document.getElementById('runStratBtn').addEventListener('click', runStrategy);
  document.getElementById('showVWAP').addEventListener('change', e=> vwapSeries.applyOptions({ visible: e.target.checked }));
  document.getElementById('showTEMA').addEventListener('change', e=> temaSeries.applyOptions({ visible: e.target.checked }));
  document.getElementById('showOB').addEventListener('change', drawZones);
  loadAll();
  setInterval(refreshHUD, 5000);
});
</script>
</body>
</html>
    """.strip())
