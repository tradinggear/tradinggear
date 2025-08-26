# main.py
# FastAPI 단일 파일: 경량 차트 + OB 박스(테두리만) + 확대/축소 컨트롤
# 색상 규칙:
#   - 매수벽(= bullish 수요존)  : 초록 테두리
#   - 매도벽(= bearish 공급존) : 빨강 테두리  ← 변경

from fastapi import FastAPI, HTTPException, Query
from fastapi.responses import HTMLResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict, Any, Literal
from datetime import datetime, timezone
import requests, time, os

from sqlalchemy import create_engine, Column, Integer, String, Float, DateTime, select, desc, Index
from sqlalchemy.orm import sessionmaker, declarative_base
from dotenv import load_dotenv

load_dotenv()

BINANCE_REST   = os.getenv("BINANCE_REST", "https://fapi.binance.com")
DB_URL         = os.getenv("DB_URL", "sqlite:///./tradinggear.db")
WEBHOOK_SECRET = os.getenv("TG_WEBHOOK_SECRET", "changeme")
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

app = FastAPI(title="TradingGear — Single File")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], allow_credentials=True,
    allow_methods=["*"], allow_headers=["*"],
)

# ---------- HTTP util ----------
def _get(url: str, params: Dict[str, Any]) -> Any:
    r = requests.get(url, params=params, timeout=REQUEST_TIMEOUT)
    if r.status_code != 200:
        raise HTTPException(status_code=r.status_code, detail=r.text)
    return r.json()

# ---------- Data / Indicators ----------
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
    for x in series:
        prev = x if prev is None else (x*k + prev*(1-k)); out.append(prev)
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
        tp=(k["h"]+k["l"]+k["c"])/3.0; cpv+=tp*k["v"]; cv+=k["v"]
        out.append(cpv/cv if cv>0 else tp)
    return out

def cvd_approx(klines: List[Dict[str, float]]):
    s=0.0; out=[]
    for k in klines:
        if k["c"]>k["o"]: s+=k["v"]
        elif k["c"]<k["o"]: s-=k["v"]
        out.append(s)
    return out

# ---------- OB / Zones ----------
def detect_ob(klines: List[Dict[str, float]], lookback: int = 300, extend: int = 60):
    """
    Bullish(매수벽/수요존): 하락 바 b 이후 extend 내 high >= b.high
    Bearish(매도벽/공급존): 상승 바 b 이후 extend 내 low <= b.low
    end는 최신 바 ts로 확장, 최소 높이 보정, 중복 제거
    """
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
        # bullish = 매수벽(초록)
        if b["c"]<b["o"] and max(x["h"] for x in fut) >= b["h"]:
            h=top-bottom; m=min_height(b["c"], atrs[i] if i<len(atrs) else None)
            if h<m: pad=(m-h)/2; top+=pad; bottom-=pad
            zones.append({"type":"bullish","start":b["t"],"end":last_t,"top":top,"bottom":bottom})
        # bearish = 매도벽(빨강)
        if b["c"]>b["o"] and min(x["l"] for x in fut) <= b["l"]:
            h=top-bottom; m=min_height(b["c"], atrs[i] if i<len(atrs) else None)
            if h<m: pad=(m-h)/2; top+=pad; bottom-=pad
            zones.append({"type":"bearish","start":b["t"],"end":last_t,"top":top,"bottom":bottom})

    # dedup
    merged=[]
    def almost_equal(a,b,tol=1e-4):
        m=(abs(a)+abs(b))/2 or 1.0
        return abs(a-b)/m < tol
    for z in zones:
        if any(z["type"]==m["type"] and almost_equal(z["top"],m["top"]) and almost_equal(z["bottom"],m["bottom"]) for m in merged):
            continue
        merged.append(z)
    return merged[-20:]

# ---------- Strategy ----------
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

# ---------- Schemas ----------
class WebhookIn(BaseModel):
    symbol: str
    side: Literal["LONG","SHORT","EXIT"]
    reason: Optional[str]=None
    price: Optional[float]=None
    interval: Optional[str]="1m"
    ts: Optional[int]=None
    secret: Optional[str]=None

# ---------- Routes ----------
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

# ---------- UI ----------
@app.get("/", response_class=HTMLResponse)
def ui():
    return HTMLResponse("""
<!doctype html>
<html lang="ko">
<head>
<meta charset="utf-8" />
<title>TradingGear — Python Only UI</title>
<meta name="viewport" content="width=device-width, initial-scale=1" />
<script src="https://unpkg.com/lightweight-charts@4.2.0/dist/lightweight-charts.standalone.production.js" crossorigin="anonymous"></script>
<style>
  body { margin:0; font-family: ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, 'Noto Sans KR', 'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif; background:#0b1020; color:#e7eaf3; }
  .wrap { display:flex; flex-direction:column; height:100vh; }
  header { padding:12px 16px; display:flex; gap:12px; align-items:center; background:#101633; border-bottom:1px solid #1c254b; flex-wrap:wrap; }
  header input, header select, header button { background:#0f1533; color:#e7eaf3; border:1px solid #26305a; border-radius:10px; padding:8px 10px; }
  header button { cursor:pointer; }
  .hud { display:flex; gap:10px; flex-wrap:wrap; padding:8px 16px; background:#0e1430; border-bottom:1px dashed #26305a; }
  .hud .card { background:#0f1638; border:1px solid #26305a; border-radius:12px; padding:8px 12px; min-width:120px; }
  .chart-wrap { position:relative; flex:1; }
  #chart { position:absolute; inset:0; }
  #overlay { position:absolute; inset:0; pointer-events:none; z-index:9999; }
  .footer { padding:6px 16px; font-size:12px; color:#90a0c5; background:#0e1430; border-top:1px solid #1c254b; }
  .tag { padding:2px 6px; border-radius:8px; background:#1a234a; border:1px solid #2b3a78; font-size:12px; }
  .sep { flex:1; }
  .zoom-group { display:flex; gap:6px; align-items:center; }
  .zoom-btn { padding:6px 10px; border-radius:8px; }
</style>
</head>
<body>
<div class="wrap">
  <header>
    <label>심볼 <input id="symbol" value="SOLUSDT" style="width:120px"/></label>
    <label>인터벌 
      <select id="interval">
        <option value="1m">1m</option><option value="3m">3m</option><option value="5m">5m</option>
        <option value="15m" selected>15m</option><option value="1h">1h</option><option value="4h">4h</option>
        <option value="1d">1d</option>
      </select>
    </label>
    <label><input type="checkbox" id="showVWAP" checked> VWAP</label>
    <label><input type="checkbox" id="showTEMA" checked> TEMA(30)</label>
    <label><input type="checkbox" id="showOB" checked> OB 존(테두리: 매수=초록, 매도=빨강)</label>
    <button id="loadBtn">불러오기</button>
    <button id="runStratBtn">전략계산</button>
    <span class="sep"></span>
    <div class="zoom-group">
      <span>Zoom</span>
      <button class="zoom-btn" id="zoomInBtn">+</button>
      <button class="zoom-btn" id="zoomOutBtn">−</button>
      <button class="zoom-btn" id="zoomResetBtn">Reset</button>
    </div>
    <span class="tag">Python Only UI</span>
  </header>

  <div class="hud" id="hud">
    <div class="card"><div>가격</div><div id="hud_price">-</div></div>
    <div class="card"><div>VWAP</div><div id="hud_vwap">-</div></div>
    <div class="card"><div>TEMA(30)</div><div id="hud_tema">-</div></div>
    <div class="card"><div>ATR(14)</div><div id="hud_atr">-</div></div>
    <div class="card"><div>ATR%</div><div id="hud_atrp">-</div></div>
    <div class="card"><div>CVD</div><div id="hud_cvd">-</div></div>
    <div class="card"><div>Trend</div><div id="hud_trend">-</div></div>
  </div>

  <div class="chart-wrap">
    <div id="chart"></div>
    <canvas id="overlay"></canvas>
  </div>

  <div class="footer">
    OB 박스: <span style="color:#34d399">초록=매수벽(수요존)</span>, <span style="color:#f87171">빨강=매도벽(공급존)</span>. 배경 없이 테두리만 표시됩니다.
  </div>
</div>

<script>
const api = (p) => p;
const $   = (id) => document.getElementById(id);

let chartApi, candleSeries, vwapSeries, temaSeries;
let zones = [];
let lastKs = [];

function fmt(n, d=2){ if(n===null||n===undefined||isNaN(n)) return '-'; return Number(n).toFixed(d); }

function buildChart(){
  const chartContainer = $("chart");
  const overlay        = $("overlay");

  chartApi = LightweightCharts.createChart(chartContainer, {
    width: chartContainer.clientWidth, height: chartContainer.clientHeight,
    layout: { background: { type: 'solid', color: '#0b1020' }, textColor: '#e7eaf3' },
    grid: { vertLines: { color: '#1a234a' }, horzLines: { color: '#1a234a' } },
    timeScale: { borderColor: '#2b3a78' }, rightPriceScale: { borderColor: '#2b3a78' },
    crosshair: { mode: LightweightCharts.CrosshairMode.Normal },
  });

  candleSeries = chartApi.addCandlestickSeries({
    upColor:'#2dd4bf', downColor:'#f87171',
    borderUpColor:'#2dd4bf', borderDownColor:'#f87171',
    wickUpColor:'#2dd4bf', wickDownColor:'#f87171'
  });
  vwapSeries = chartApi.addLineSeries({ color:'#8ab4ff', lineWidth:1, visible: $('showVWAP').checked });
  temaSeries = chartApi.addLineSeries({ color:'#ffd166', lineWidth:1, visible: $('showTEMA').checked });

  function resize(){
    const rect = chartContainer.getBoundingClientRect();
    overlay.width  = Math.max(1, Math.floor(rect.width * devicePixelRatio));
    overlay.height = Math.max(1, Math.floor(rect.height * devicePixelRatio));
    overlay.style.width = rect.width + 'px'; overlay.style.height = rect.height + 'px';
    drawZones();
  }
  const ro = new ResizeObserver(resize); ro.observe(chartContainer);
  chartApi.timeScale().subscribeVisibleTimeRangeChange(drawZones);
  chartApi.subscribeCrosshairMove(drawZones);
  resize();
}

function timeToX(t){ const x = chartApi.timeScale().timeToCoordinate(t); return (x == null) ? null : x * devicePixelRatio; }
function priceToY(p){ const y = candleSeries.priceToCoordinate(p); return (y == null) ? null : y * devicePixelRatio; }

// ---- 로컬 OB 계산 (서버 실패 시) ----
function localDetectOb(ks, extend = 150) {
  const out = []; const start = Math.max(1, ks.length - 800);
  for (let i = start; i < ks.length - 1; i++) {
    const b = ks[i]; const fut = ks.slice(i + 1, Math.min(i + 1 + extend, ks.length)); if (!fut.length) continue;
    const top = Math.max(b.o, b.c, b.h), bottom = Math.min(b.o, b.c, b.l);
    if (b.c < b.o && fut.some(x => x.h >= b.h)) { out.push({ type:"bullish", start:b.t, end:ks.at(-1).t, top:top, bottom:bottom }); }
    if (b.c > b.o && fut.some(x => x.l <= b.l)) { out.push({ type:"bearish", start:b.t, end:ks.at(-1).t, top:top, bottom:bottom }); }
  }
  return out.slice(-20);
}

// ---- OB 그리기: 테두리만(배경 없음) / 매수=초록, 매도=빨강 ← 변경
function drawZones(){
  const canvas = $('overlay'); const ctx = canvas.getContext('2d');
  ctx.clearRect(0,0,canvas.width,canvas.height);
  if (!$('showOB').checked) return;

  zones.forEach(z=>{
    let x1 = timeToX(z.start), x2 = timeToX(z.end), y1 = priceToY(z.top), y2 = priceToY(z.bottom);
    if (x1 == null) x1 = 0; if (x2 == null) x2 = canvas.width; if (y1 == null) y1 = 0; if (y2 == null) y2 = canvas.height;
    const left = Math.min(x1,x2), right = Math.max(x1,x2), top = Math.min(y1,y2), bottom = Math.max(y1,y2);
    const w = Math.max(1, right-left), h = Math.max(1, bottom-top);

    ctx.save();
    ctx.beginPath();
    ctx.rect(left, top, w, h);
    const green = 'rgba(52, 211, 153, 0.95)';   // #34d399 (매수)
    const red   = 'rgba(248, 113, 113, 0.95)';  // #f87171 (매도) ← 파랑→빨강
    ctx.strokeStyle = (z.type === 'bullish') ? green : red;
    ctx.lineWidth = 2 * devicePixelRatio;
    ctx.setLineDash([6 * devicePixelRatio, 4 * devicePixelRatio]); // 점선(원하면 제거)
    ctx.stroke();
    ctx.restore();
  });
}

// ---- 존 새로고침(서버 → 로컬 → 디버그) ----
async function refreshZones({ forceServer=false } = {}){
  const symbol = $('symbol').value.trim().toUpperCase();
  const interval = $('interval').value;

  if (!$('showOB').checked) { zones = []; drawZones(); return; }

  let srvZones = [];
  if (forceServer) {
    try {
      const z = await fetch(api(`/api/zones/ob?symbol=${symbol}&interval=${interval}&lookback=500&extend=150&debug=true`)).then(r=>r.json());
      console.log('OB server debug:', z.debug || {});
      srvZones = Array.isArray(z.zones) ? z.zones : [];
    } catch(e) { console.warn('server zones error', e); }
  }
  zones = srvZones;

  if (!zones || zones.length === 0) {
    if (!lastKs.length) {
      try { lastKs = await fetch(api(`/api/klines?symbol=${symbol}&interval=${interval}&limit=500`)).then(r=>r.json()); }
      catch(e){ console.warn('klines fetch fail for local OB', e); }
    }
    if (lastKs.length) {
      zones = localDetectOb(lastKs, 150);
      console.warn('fallback local OB zones:', zones.length);
    }
  }
  if (!zones || zones.length === 0) {
    const last = lastKs.at(-1);
    if (last) {
      zones = [{ type:'bullish', start:last.t-3600, end:last.t, top:last.c*1.003, bottom:last.c*0.997 }]; // 디버그 테두리(매수색)
      console.warn('Painted a debug OB box since none detected.');
    }
  }
  drawZones();
}

// ---- 확대/축소 컨트롤 ----
function zoomBy(factor){
  const ts = chartApi.timeScale();
  const lr = ts.getVisibleLogicalRange();
  const totalBars = Math.max(1, lastKs.length);
  if (!lr) { ts.fitContent(); requestAnimationFrame(drawZones); return; }

  let from = lr.from, to = lr.to;
  let width = Math.max(1, to - from);
  const minBars = 10;
  const maxBars = Math.max(20, totalBars);
  let newWidth = Math.max(minBars, Math.min(width * factor, maxBars));
  const center = (from + to) / 2;
  let newFrom = center - newWidth / 2;
  let newTo   = center + newWidth / 2;

  // 범위 클램핑
  if (newFrom < 0) { newTo -= newFrom; newFrom = 0; }
  if (newTo > totalBars - 1) { newFrom -= (newTo - (totalBars - 1)); newTo = totalBars - 1; }

  ts.setVisibleLogicalRange({ from: newFrom, to: newTo });
  requestAnimationFrame(drawZones);
}

function zoomReset(){
  chartApi.timeScale().fitContent();
  requestAnimationFrame(drawZones);
}

async function loadAll(){
  const symbol = $('symbol').value.trim().toUpperCase();
  const interval = $('interval').value;

  lastKs = await fetch(api(`/api/klines?symbol=${symbol}&interval=${interval}&limit=500`)).then(r=>r.json());
  const candles = lastKs.map(k=>({ time:k.t, open:k.o, high:k.h, low:k.l, close:k.c }));
  candleSeries.setData(candles);
  chartApi.timeScale().fitContent();

  const vwapArr = (()=>{ let cpv=0, cv=0; return lastKs.map(k=>{ const tp=(k.h+k.l+k.c)/3; cpv+=tp*k.v; cv+=k.v; return cv>0?cpv/cv:tp; }); })();
  const temaArr = (function temaCalc(L){ 
    const ema=(s,l)=>{ const k=2/(l+1); let p=null; return s.map(x=>{ p=(p===null?x:(x*k+p*(1-k))); return p; }); };
    const closes = lastKs.map(k=>k.c); const e1=ema(closes, L), e2=ema(e1,L), e3=ema(e2,L);
    return e1.map((_,i)=>3*e1[i]-3*e2[i]+e3[i]);
  })(30);

  vwapSeries.setData(lastKs.map((k,i)=>({ time:k.t, value:vwapArr[i] })));
  temaSeries.setData(lastKs.map((k,i)=>({ time:k.t, value:temaArr[i] })));
  vwapSeries.applyOptions({ visible: $('showVWAP').checked });
  temaSeries.applyOptions({ visible: $('showTEMA').checked });

  await refreshZones({ forceServer:true });

  const sigs = await fetch(api(`/api/signals?symbol=${symbol}&interval=${interval}&limit=200`)).then(r=>r.json()).catch(()=>[]);
  const markers = (sigs || []).map(s=>({ time: s.ts, position: s.side==='LONG' ? 'belowBar' : 'aboveBar', color: s.side==='LONG' ? '#2dd4bf' : '#f87171', shape: s.side==='LONG' ? 'arrowUp' : 'arrowDown', text: s.side }));
  candleSeries.setMarkers(markers);

  requestAnimationFrame(drawZones);
  await refreshHUD();
}

async function refreshHUD(){
  const symbol = $('symbol').value.trim().toUpperCase();
  const interval = $('interval').value;
  const h = await fetch(api(`/api/hud?symbol=${symbol}&interval=${interval}&limit=500`)).then(r=>r.json()).catch(()=>null);
  if(!h) return;
  $("hud_price").textContent = fmt(h.last_price);
  $("hud_vwap").textContent  = fmt(h.vwap);
  $("hud_tema").textContent  = fmt(h.tema30);
  $("hud_atr").textContent   = fmt(h.atr14);
  $("hud_atrp").textContent  = h.atrp ? fmt(h.atrp*100,2)+'%' : '-';
  $("hud_cvd").textContent   = fmt(h.cvd,0);
  $("hud_trend").textContent = h.trend==='up' ? '상승' : '하락';
}

async function runStrategy(){
  const symbol = $('symbol').value.trim().toUpperCase();
  const interval = $('interval').value;
  await fetch(api(`/api/strategy/run?symbol=${symbol}&interval=${interval}&limit=500&tema_len=30&atr_len=14&vwap_filter=true&atr_distance_mult=0.0&cooldown_bars=5`), { method:'POST' });
  const sigs = await fetch(api(`/api/signals?symbol=${symbol}&interval=${interval}&limit=200`)).then(r=>r.json()).catch(()=>[]);
  const markers = (sigs || []).map(s=>({ time: s.ts, position: s.side==='LONG' ? 'belowBar' : 'aboveBar', color: s.side==='LONG' ? '#2dd4bf' : '#f87171', shape: s.side==='LONG' ? 'arrowUp' : 'arrowDown', text: s.side }));
  candleSeries.setMarkers(markers);
}

window.addEventListener('DOMContentLoaded', ()=>{
  buildChart();
  $('loadBtn').addEventListener('click', loadAll);
  $('runStratBtn').addEventListener('click', runStrategy);
  $('showVWAP').addEventListener('change', e=> vwapSeries.applyOptions({ visible: e.target.checked }));
  $('showTEMA').addEventListener('change', e=> temaSeries.applyOptions({ visible: e.target.checked }));
  $('showOB').addEventListener('change', async (e)=>{
    if (e.target.checked) { await refreshZones({ forceServer:true }); }
    else { zones = []; drawZones(); }
  });

  // Zoom buttons
  $('zoomInBtn').addEventListener('click', ()=> zoomBy(0.7));   // 확대(범위 축소)
  $('zoomOutBtn').addEventListener('click', ()=> zoomBy(1.3));  // 축소(범위 확대)
  $('zoomResetBtn').addEventListener('click', zoomReset);

  loadAll();
  setInterval(refreshHUD, 5000);
});
</script>
</body>
</html>
    """.strip())
