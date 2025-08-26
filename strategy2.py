# tradinggear_strategy_backend_optimized.py

from fastapi import FastAPI
from typing import List, Dict
import requests
import datetime
import numpy as np

from fastapi import APIRouter
router = APIRouter()

from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# ✅ CORS 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://tradinggear.co.kr"],  # 허용할 도메인
    allow_credentials=True,
    allow_methods=["*"],   # GET, POST 등 모든 메서드 허용
    allow_headers=["*"],   # 모든 헤더 허용
)

# === CONFIG ===
SYMBOL = "SOLUSDT"
INTERVAL = "30m"
KLINE_LIMIT = 280
AGGTRADE_LIMIT = 1000

# === 1. Fetch recent candles ===
def get_recent_candles(symbol=SYMBOL, interval=INTERVAL, limit=KLINE_LIMIT) -> List[Dict]:
    url = "https://fapi.binance.com/fapi/v1/klines"
    res = requests.get(url, params={"symbol": symbol, "interval": interval, "limit": limit})
    data = res.json()
    return [{
        "time": int(c[0]),
        "open": float(c[1]),
        "high": float(c[2]),
        "low": float(c[3]),
        "close": float(c[4]),
        "volume": float(c[5])
    } for c in data]

# === 2. OB Box detection ===
def extract_order_blocks(candles: List[Dict], length=3) -> List[Dict]:
    bullish_blocks, bearish_blocks = [], []
    for i in range(len(candles) - length - 1):
        group = candles[i:i+length]
        prev = candles[i + length]
        up_ok = all(g['close'] > g['open'] for g in group)
        down_ok = all(g['close'] < g['open'] for g in group)
        if up_ok:
            top = max(prev['open'], prev['close'])
            bottom = min(prev['open'], prev['close'])
            bullish_blocks.append({"type": "bullish", "top": top, "bottom": bottom})
        elif down_ok:
            top = max(prev['open'], prev['close'])
            bottom = min(prev['open'], prev['close'])
            bearish_blocks.append({"type": "bearish", "top": top, "bottom": bottom})
    return bullish_blocks + bearish_blocks

# === 3. VWAP Calculation ===
def calculate_vwap(candles: List[Dict]) -> float:
    cum_pv = sum(((c['high'] + c['low'] + c['close']) / 3) * c['volume'] for c in candles)
    cum_vol = sum(c['volume'] for c in candles)
    return cum_pv / cum_vol if cum_vol > 0 else 0

# === 4. CVD Calculation ===
def get_cvd(symbol=SYMBOL, limit=AGGTRADE_LIMIT) -> float:
    res = requests.get("https://fapi.binance.com/fapi/v1/aggTrades", params={"symbol": symbol, "limit": limit})
    trades = res.json()
    cvd = sum(float(t['q']) if not t['m'] else -float(t['q']) for t in trades)
    return round(cvd, 2)

# === 5. RSI Calculation ===
def calculate_rsi(closes: List[float], period=14) -> float:
    deltas = np.diff(closes)
    seed = deltas[:period]
    up = seed[seed > 0].sum() / period
    down = -seed[seed < 0].sum() / period
    rs = up / down if down != 0 else 0
    return 100 - (100 / (1 + rs))

# === 6. Stochastic Oscillator ===
def calculate_stochastic(candles: List[Dict], period=14) -> float:
    recent = candles[-period:]
    high_max = max(c['high'] for c in recent)
    low_min = min(c['low'] for c in recent)
    last_close = candles[-1]['close']
    return ((last_close - low_min) / (high_max - low_min)) * 100 if high_max != low_min else 50

# === 7. Volume Spike Detection ===
def detect_volume_spike(candles: List[Dict]) -> bool:
    vols = [c['volume'] for c in candles[:-1]]
    avg_vol = sum(vols) / len(vols)
    return candles[-1]['volume'] > 1.5 * avg_vol

# === 8. MA Slope (Direction) ===
def calculate_ma_slope(closes: List[float], period=20) -> float:
    if len(closes) < period:
        return 0
    ma = np.convolve(closes, np.ones(period)/period, mode='valid')
    return ma[-1] - ma[-2] if len(ma) > 1 else 0

# === 9. Entry signal logic ===
def evaluate_signals(blocks: List[Dict], cvd: float, price: float, vwap: float,
                     rsi: float, stoch: float, vol_spike: bool, ma_slope: float) -> List[Dict]:
    signals = []
    for ob in blocks:
        if ob["bottom"] <= price <= ob["top"]:
            if ob["type"] == "bullish" and cvd > 0 and price > vwap and rsi > 50 and stoch > 50 and vol_spike and ma_slope > 0:
                signals.append({"type": "LONG", "cvd": cvd, "price": price, "ob": ob})
            elif ob["type"] == "bearish" and cvd < 0 and price < vwap and rsi < 50 and stoch < 50 and vol_spike and ma_slope < 0:
                signals.append({"type": "SHORT", "cvd": cvd, "price": price, "ob": ob})
    return signals

# === 10. Real-time price ===
def get_current_price(symbol=SYMBOL) -> float:
    res = requests.get("https://fapi.binance.com/fapi/v1/ticker/price", params={"symbol": symbol})
    #return res.json()
    return float(res.json().get("price"))

# === 11. API: Full Strategy View ===
@router.get("/api/visual_signals_full_v2")
def full_strategy():
    candles = get_recent_candles()
    closes = [c['close'] for c in candles]
    current_price = get_current_price()
    cvd = get_cvd()
    vwap = calculate_vwap(candles)
    rsi = calculate_rsi(closes)
    stoch = calculate_stochastic(candles)
    vol_spike = detect_volume_spike(candles)
    ma_slope = calculate_ma_slope(closes)

    blocks = extract_order_blocks(candles)
    signals = evaluate_signals(blocks, cvd, current_price, vwap, rsi, stoch, vol_spike, ma_slope)

    return {
        "symbol": SYMBOL,
        "current_price": current_price,
        "cvd": cvd,
        "vwap": round(vwap, 3),
        "rsi": round(rsi, 2),
        "stochastic": round(stoch, 2),
        "volume_spike": vol_spike,
        "ma_slope": round(ma_slope, 4),
        "order_blocks": blocks,
        "signals": signals,
        "timestamp": datetime.datetime.utcnow().isoformat()
    }
