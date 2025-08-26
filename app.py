import time
import requests
import numpy as np
import pandas as pd
from datetime import datetime, timedelta, timezone

import dash
from dash import dcc, html
from dash.dependencies import Input, Output
import plotly.graph_objs as go

# =====================[ 설정 ]=====================
SYMBOL = "SOLUSDT"         # 바이낸스 선물 심볼
INTERVAL = "30m"           # 기본 차트 주기
HTF_INTERVAL = "1h"        # HTF(상위) 추세 확인 주기
KLINE_LIMIT = 500          # 최근 봉 개수
REFRESH_MS = 5000          # 갱신 주기(ms)

# 시그널/리스크 파라미터
ATR_MULT = 1.2             # 디스플레이스먼트 강화(몸통 > ATR*k)
OB_LOOKBACK = 6            # 마지막 반대색 캔들 탐색 범위
VWAP_TOL_PCT = 0.20        # VWAP 근접 허용 오차(%)
RR1 = 1.0                  # TP1 R/R
RR2 = 1.5                  # TP2 R/R
ATR_BUF = 0.20             # 손절 ATR 버퍼(시각화 참고용)
COOL_MIN = 30              # 신호 쿨다운(분)

# 서울/미국 세션 (KST, UTC+9)
SESSIONS_KST = [("Seoul AM", 9, 0, 11, 30, "#8E44AD"),  # 09:00-11:30
                ("US",       22, 0, 1, 0,  "#2980B9")]  # 22:00-01:00(+1)

# =====================[ 유틸 ]=====================
BINANCE_FAPI = "https://fapi.binance.com"

def get_klines(symbol: str, interval: str, limit: int) -> pd.DataFrame:
    """바이낸스 선물 캔들 (UTC ms)"""
    url = f"{BINANCE_FAPI}/fapi/v1/klines"
    r = requests.get(url, params={"symbol": symbol, "interval": interval, "limit": limit}, timeout=10)
    r.raise_for_status()
    arr = r.json()
    cols = ["open_time","open","high","low","close","volume",
            "close_time","qav","trades","taker_base","taker_quote","ignore"]
    df = pd.DataFrame(arr, columns=cols)
    df["open_time"] = pd.to_datetime(df["open_time"], unit="ms", utc=True)
    for c in ["open","high","low","close","volume"]:
        df[c] = df[c].astype(float)
    return df[["open_time","open","high","low","close","volume"]]

def rsi(series: pd.Series, length=14):
    delta = series.diff()
    up = delta.clip(lower=0)
    down = -delta.clip(upper=0)
    ma_up = up.ewm(alpha=1/length, adjust=False).mean()
    ma_down = down.ewm(alpha=1/length, adjust=False).mean()
    rs = ma_up / (ma_down.replace(0, np.nan))
    out = 100 - (100 / (1 + rs))
    return out.fillna(50)

def stoch_k(df: pd.DataFrame, length=14):
    low_min = df["low"].rolling(length).min()
    high_max = df["high"].rolling(length).max()
    k = (df["close"] - low_min) / (high_max - low_min)
    return (k * 100).clip(0, 100).fillna(50)

def tema(series: pd.Series, length=30):
    ema1 = series.ewm(span=length, adjust=False).mean()
    ema2 = ema1.ewm(span=length, adjust=False).mean()
    ema3 = ema2.ewm(span=length, adjust=False).mean()
    return 3*(ema1 - ema2) + ema3

def atr(df: pd.DataFrame, length=14):
    h_l = df["high"] - df["low"]
    h_c = (df["high"] - df["close"].shift()).abs()
    l_c = (df["low"] - df["close"].shift()).abs()
    tr = pd.concat([h_l, h_c, l_c], axis=1).max(axis=1)
    return tr.ewm(alpha=1/length, adjust=False).mean()

def vwap(df: pd.DataFrame):
    tp = (df["high"] + df["low"] + df["close"]) / 3
    cum_pv = (tp * df["volume"]).cumsum()
    cum_v = df["volume"].cumsum().replace(0, np.nan)
    out = cum_pv / cum_v
    return out

def cvd_tick(df: pd.DataFrame, length=40):
    """업틱/다운틱 누적 볼륨(파인에서 delta=sum(sign*vol))"""
    sign = np.where(df["close"] > df["close"].shift(), 1, np.where(df["close"] < df["close"].shift(), -1, 0))
    delta = sign * df["volume"].values
    # 누적합의 '최근 length 합'을 보기 쉽게 SMA*len 방식으로 근사
    s = pd.Series(delta, index=df.index)
    sma = s.rolling(length).mean()
    return (sma * length).fillna(0)

def displacement_mask(df: pd.DataFrame, atr_len=14, k=ATR_MULT):
    _atr = atr(df, atr_len)
    body = (df["close"] - df["open"]).abs()
    hi3  = df["high"].shift(1).rolling(3).max()
    lo3  = df["low"].shift(1).rolling(3).min()
    bull = (df["close"] > df["open"]) & (body >= k*_atr) & (df["close"] > hi3)
    bear = (df["close"] < df["open"]) & (body >= k*_atr) & (df["close"] < lo3)
    return bull.fillna(False), bear.fillna(False)

def find_last_opp_candle(df: pd.DataFrame, i: int, look=OB_LOOKBACK, want="bear"):
    """i 이전에서 마지막 '원하는 색' 캔들의 인덱스 반환 (bear=하락, bull=상승)"""
    rng = range(max(0, i-look), i)
    subset = df.iloc[list(rng)]
    if want == "bear":
        idx = subset[(subset["close"] < subset["open"])].index
    else:
        idx = subset[(subset["close"] > subset["open"])].index
    return idx[-1] if len(idx) else None

def build_order_blocks(df: pd.DataFrame):
    """디스플레이스먼트 발생 시점의 마지막 반대색 캔들을 OB로 지정"""
    bull_disp, bear_disp = displacement_mask(df)
    records = []
    for i in range(len(df)):
        if bull_disp.iat[i]:
            j = find_last_opp_candle(df, i, want="bear")
            if j is not None:
                row = df.loc[j]
                top = max(row["open"], row["close"])
                bot = min(row["open"], row["close"])
                records.append({"i": i, "kind": "demand", "top": top, "bot": bot})
        if bear_disp.iat[i]:
            j = find_last_opp_candle(df, i, want="bull")
            if j is not None:
                row = df.loc[j]
                top = max(row["open"], row["close"])
                bot = min(row["open"], row["close"])
                records.append({"i": i, "kind": "supply", "top": top, "bot": bot})
    return records

def htf_trend_ok(htf_df: pd.DataFrame):
    t = tema(htf_df["close"], 30)
    slope_up = t > t.shift()
    slope_dn = t < t.shift()
    return slope_up.iloc[-1], slope_dn.iloc[-1]

def session_rects(times_utc: pd.Series):
    """세션 배경(UTC 타임스탬프 기준으로 KST 변환하여 생성)"""
    rects = []
    if times_utc.empty: return rects
    start = times_utc.iloc[0]
    end = times_utc.iloc[-1]
    cur = (start + pd.Timedelta(hours=9)).normalize()  # KST 자정
    while cur <= end + pd.Timedelta(hours=9):
        for name, sh, sm, eh, em, color in SESSIONS_KST:
            s_kst = cur + pd.Timedelta(hours=sh, minutes=sm)
            e_kst = cur + pd.Timedelta(hours=eh, minutes=em)
            if e_kst <= s_kst:  # 익일
                e_kst += pd.Timedelta(days=1)
            s = s_kst - pd.Timedelta(hours=9)
            e = e_kst - pd.Timedelta(hours=9)
            # 차트 범위와 교집합만
            xs = max(s, start); xe = min(e, end + (end-start)/20)
            if xe > xs:
                rects.append(dict(
                    type="rect", xref="x", yref="paper",
                    x0=xs, x1=xe, y0=0, y1=1,
                    fillcolor=color, opacity=0.06, line=dict(width=0)
                ))
        cur += pd.Timedelta(days=1)
    return rects

def build_signals(df: pd.DataFrame, htf_df: pd.DataFrame):
    """전략 조건 → LONG/SHORT 신호 리스트"""
    # 보조지표
    _rsi = rsi(df["close"], 14)
    _st  = stoch_k(df, 14).rolling(3).mean()
    _atr = atr(df, 14)
    _vwap = vwap(df)
    _cvd = cvd_tick(df, 40)

    htf_up, htf_dn = htf_trend_ok(htf_df)

    obs = build_order_blocks(df)
    signals = []

    # 쿨다운(최근 COOL_MIN 분 이내 같은 방향 한 번만)
    cooldown_bars = max(1, int(COOL_MIN * 60 / (pd.Timedelta(INTERVAL).total_seconds())))

    last_long_i = -10**9
    last_short_i = -10**9

    for ob in obs[-50:]:
        i = ob["i"]
        # 필수 값
        if i <= 0 or i >= len(df): 
            continue

        close = df["close"].iat[i]
        top, bot = ob["top"], ob["bot"]
        mid = (top + bot)/2
        vw = _vwap.iat[i]
        r, k = _rsi.iat[i], _st.iat[i]
        cv = _cvd.iat[i]

        vw_ok = abs((close - vw) / vw) * 100 <= VWAP_TOL_PCT

        if ob["kind"] == "demand":
            long_base = (close > mid or close > top) and htf_up and vw_ok and (k > 50) and (r < 70) and (cv > 0)
            if long_base and (i - last_long_i) > cooldown_bars:
                risk = max(close - bot, 1e-6)
                sig = {
                    "i": i, "time": df["open_time"].iat[i], "type": "LONG",
                    "price": float(close), "ob": {"top": float(top), "bottom": float(bot)},
                    "sl": float(bot - ATR_BUF * _atr.iat[i]),
                    "tp1": float(close + RR1 * risk),
                    "tp2": float(close + RR2 * risk)
                }
                signals.append(sig)
                last_long_i = i

        if ob["kind"] == "supply":
            short_base = (close < mid or close < bot) and htf_dn and vw_ok and (k < 50) and (r > 30) and (cv < 0)
            if short_base and (i - last_short_i) > cooldown_bars:
                risk = max(top - close, 1e-6)
                sig = {
                    "i": i, "time": df["open_time"].iat[i], "type": "SHORT",
                    "price": float(close), "ob": {"top": float(top), "bottom": float(bot)},
                    "sl": float(top + ATR_BUF * _atr.iat[i]),
                    "tp1": float(close - RR1 * risk),
                    "tp2": float(close - RR2 * risk)
                }
                signals.append(sig)
                last_short_i = i

    return signals, _vwap

def fetch_all():
    df = get_klines(SYMBOL, INTERVAL, KLINE_LIMIT)
    htf_df = get_klines(SYMBOL, HTF_INTERVAL, 200)
    signals, vwap_series = build_signals(df, htf_df)
    last_price = df["close"].iloc[-1]
    return df, htf_df, signals, vwap_series.iloc[-1], last_price

# =====================[ Dash 앱 ]=====================
app = dash.Dash(__name__)
app.title = f"{SYMBOL} {INTERVAL} 전략 시각화"

app.layout = html.Div([
    html.H3("TradingGear – SOL 30분/1시간 전략 시각화", style={"margin":"6px 12px"}),
    html.Div(id="stats", style={"margin":"0 12px", "fontFamily":"monospace"}),
    dcc.Graph(id="chart", figure=go.Figure(), style={"height":"85vh"}),
    dcc.Interval(id="timer", interval=REFRESH_MS, n_intervals=0)
])

@app.callback(
    [Output("chart","figure"), Output("stats","children")],
    [Input("timer","n_intervals")]
)
def update(_):
    try:
        df, htf_df, signals, vwap_val, last_price = fetch_all()
    except Exception as e:
        fig = go.Figure()
        fig.update_layout(title=f"데이터 로딩 실패: {e}")
        return fig, f"에러: {e}"

    # 캔들
    fig = go.Figure(data=[go.Candlestick(
        x=df["open_time"], open=df["open"], high=df["high"],
        low=df["low"], close=df["close"], name=f"{SYMBOL} {INTERVAL}"
    )])

    # 세션 배경
    fig.update_layout(shapes=session_rects(df["open_time"]))

    # 현재가 / VWAP
    fig.add_hline(y=last_price, line_color="#E74C3C", line_dash="dot",
                  annotation_text=f"현재가 {last_price:.3f}", annotation_position="top right")
    fig.add_hline(y=float(vwap_val), line_color="#008FFB", line_dash="dot",
                  annotation_text=f"VWAP {float(vwap_val):.3f}", annotation_position="bottom right")

    # OB 박스(최근 10개만)
    obs = build_order_blocks(df)
    for ob in obs[-10:]:
        x0 = df["open_time"].iat[ob["i"]-1]
        x1 = df["open_time"].iat[min(ob["i"]+20, len(df)-1)]
        color = "#16A085" if ob["kind"]=="demand" else "#E67E22"
        fig.add_shape(
            type="rect", xref="x", yref="y",
            x0=x0, x1=x1, y0=ob["bot"], y1=ob["top"],
            fillcolor=color, opacity=0.18, line=dict(color=color, width=1)
        )

    # 진입/SL/TP/예상구간 + 라벨
    for sig in signals[-6:]:
        xi = df["open_time"].iat[sig["i"]]
        color = "#00E396" if sig["type"]=="LONG" else "#FF4560"
        # 진입 라벨 (캔들 위/아래)
        fig.add_annotation(x=xi, y=sig["price"],
            text=("롱 진입" if sig["type"]=="LONG" else "숏 진입"),
            showarrow=True, arrowhead=3, arrowsize=1, arrowcolor=color,
            ax=0, ay=40 if sig["type"]=="LONG" else -40,
            bgcolor=color, opacity=0.9, font=dict(color="white"))

        # SL/TP 라인
        fig.add_hline(y=sig["sl"], line_color="#E74C3C",
                      annotation_text="손절", annotation=dict(font=dict(color="white")),
                      annotation_position="left", fillcolor="#E74C3C")
        fig.add_hline(y=sig["tp1"], line_color="#2ECC71", line_dash="dash",
                      annotation_text="익절1", annotation_position="left")
        fig.add_hline(y=sig["tp2"], line_color="#27AE60", line_dash="dot",
                      annotation_text="익절2", annotation_position="left")

        # 예상 구간 박스 (롱: entry~TP2 / 숏: TP2~entry)
        if sig["type"]=="LONG":
            y0, y1 = sig["price"], sig["tp2"]
        else:
            y0, y1 = sig["tp2"], sig["price"]
        fig.add_shape(type="rect", xref="x", yref="y",
                      x0=xi, x1=xi + pd.Timedelta(minutes=30*20),
                      y0=y0, y1=y1, fillcolor=color, opacity=0.10, line=dict(width=0))
        fig.add_annotation(x=xi + pd.Timedelta(minutes=30*5), y=(y0+y1)/2,
                           text="상승 예상 구간" if sig["type"]=="LONG" else "하락 예상 구간",
                           showarrow=False, bgcolor=color, opacity=0.6, font=dict(color="white"))

    fig.update_layout(
        title=f"{SYMBOL} {INTERVAL} – 직관 시각화 (OB/VWAP/CVD/오실레이터/HTF)",
        xaxis=dict(type="date", rangeslider=dict(visible=False)),
        yaxis=dict(fixedrange=False),
        template="plotly_white",
        legend=dict(orientation="h")
    )

    # 상단 요약
    stat = []
    stat.append(f"캔들: {INTERVAL} | HTF: {HTF_INTERVAL}")
    stat.append(f"신호 수(최근): {len(signals)}")
    if signals:
        last = signals[-1]
        stat.append(f"최근 신호: {last['type']} @ {pd.to_datetime(last['time']).strftime('%Y-%m-%d %H:%M UTC')} "
                    f" | SL {last['sl']:.2f} TP1 {last['tp1']:.2f} TP2 {last['tp2']:.2f}")
    return fig, " | ".join(stat)

if __name__ == "__main__":
    print(f"Running Dash on http://127.0.0.1:8050  (symbol={SYMBOL}, interval={INTERVAL})")
    #app.run_server(debug=True)

    app.run(
        debug=True,       # 개발 중이면 True, 배포 시 False 권장
        host="0.0.0.0",   # 외부 접속 허용
        port=8050         # 필요 시 변경
    )    