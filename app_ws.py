# -*- coding: utf-8 -*-
import asyncio, json, threading, time
from datetime import datetime, timedelta, timezone

import requests, websockets
import numpy as np
import pandas as pd

import dash
from dash import dcc, html
from dash.dependencies import Input, Output
import plotly.graph_objs as go

# =====================[ 설정 ]=====================
SYMBOL = "SOLUSDT"
SYMBOL_L = SYMBOL.lower()
INTERVAL = "30m"
HTF_INTERVAL = "1h"
KLINE_LIMIT = 500
#REFRESH_MS = 3000
REFRESH_MS = 30000

# 전략 파라미터
ATR_MULT = 1.2
OB_LOOKBACK = 6
VWAP_TOL_PCT = 0.20
RR1, RR2 = 1.0, 1.5
ATR_BUF = 0.20
COOL_MIN = 30

# 세션(KST)
SESSIONS_KST = [("Seoul AM", 9, 0, 11, 30, "#8E44AD"),
                ("US",       22, 0, 1, 0,  "#2980B9")]

BINANCE_REST = "https://fapi.binance.com"
BINANCE_WS   = f"wss://fstream.binance.com/stream?streams={SYMBOL_L}@kline_30m/{SYMBOL_L}@aggTrade"

# =====================[ 전역 상태(스레드 안전) ]=====================
_state_lock = threading.Lock()
df_30 = pd.DataFrame()
df_1h = pd.DataFrame()
cvd_cum = 0.0          # 현재 세션 누적 CVD
cvd_series = pd.Series(dtype=float)  # 시간별 CVD 시계열(표시용)

# app = dash.Dash(__name__)  # 기존
app = dash.Dash(
    __name__,
    routes_pathname_prefix="/app/app_ws/",     # ← 라우트 프리픽스
    requests_pathname_prefix="/app/app_ws/",   # ← 요청/에셋 프리픽스
)
server = app.server  # ✅ gunicorn 진입점

# ✅ 첫 요청 시 1회 초기화 (Flask 3.x 호환)
_bootstrap_done = False
_bootstrap_lock = threading.Lock()

#import plotly.graph_objs as go
import plotly.io as pio

# (선택) 앱 전체 기본값: 템플릿으로 공통 레이아웃을 묶어두기
base_tpl = go.layout.Template(
    layout=dict(
        hovermode="x unified",
        dragmode="zoom",
        font=dict(family="Inter, Pretendard, Apple SD Gothic Neo, sans-serif", size=13),
        paper_bgcolor="#ffffff",
        plot_bgcolor="#ffffff",
        margin=dict(l=60, r=20, t=48, b=40),
        legend=dict(orientation="h", y=1.02, yanchor="bottom"),
        xaxis=dict(
            type="date",
            showgrid=True, gridcolor="rgba(0,0,0,.1)",
            showspikes=True, spikemode="across", spikesnap="cursor", spikethickness=1,
            showline=True, linewidth=1, linecolor="rgba(0,0,0,.2)",
            rangeslider=dict(visible=False),
        ),
        yaxis=dict(
            fixedrange=False,
            showgrid=True, gridcolor="rgba(0,0,0,.1)",
            showspikes=True, spikemode="across",
            zeroline=False, showline=True, linewidth=1, linecolor="rgba(0,0,0,.2)",
        ),
        hoverlabel=dict(bgcolor="rgba(0,0,0,.8)", font_size=12),
        # uirevision을 고정하면 실시간 업데이트 중에도 사용자의 줌/팬 상태가 유지됨
        uirevision="keep",
    )
)
pio.templates["tg_base"] = base_tpl
pio.templates.default = "plotly_white+tg_base"  # 전역 기본 템플릿

def make_fig(df):
    fig = go.Figure(
        data=[
            go.Candlestick(
                x=df["open_time"], open=df["open"], high=df["high"],
                low=df["low"], close=df["close"], name="Candle",
                increasing_line_color="#26a69a", decreasing_line_color="#ef5350"
            )
        ]
    )

    # 개별 차트 레이아웃(템플릿 + 추가 옵션)
    fig.update_layout(
        title=dict(text="차트 타이틀", x=0.02, xanchor="left"),
        # 필요 시 개별 축/범례/주석/도형 등 추가
        # shapes=[...],
        # annotations=[...],
    )

    # 트레이스 공통 속성 적용
    fig.update_traces(
        hovertemplate=(
            "<b>%{x|%Y-%m-%d %H:%M}</b><br>"  # 시간 포맷
            "O:%{open:.3f}  H:%{high:.3f}  L:%{low:.3f}  C:%{close:.3f}<extra>%{fullData.name}</extra>"
        ),
        selector=dict(type="candlestick")
    )

    return fig

TZ = "Asia/Seoul"

def to_kst_naive(s: pd.Series) -> pd.Series:
    # UTC 인식 → KST로 변환 → tz 정보 제거(브라우저가 또 변환하지 않게)
    s = pd.to_datetime(s, utc=True)
    return s.dt.tz_convert(TZ).dt.tz_localize(None)

# Dash dcc.Graph 사용 시: 마우스 휠 줌/모드바 등 'config'로 전역 인터랙션 제어
graph_config = dict(
    scrollZoom=True,          # 마우스 스크롤 줌
    doubleClick="reset",      # 더블클릭 리셋
    displayModeBar=True,      # 모드바 표시
    responsive=True,
    modeBarButtonsToAdd=["drawline", "eraseshape", "togglespikelines"],
    toImageButtonOptions=dict(format="png", filename="chart", scale=2, width=1920, height=1080),
)


@server.before_request
def _bootstrap_once():
    global _bootstrap_done
    if not _bootstrap_done:
        with _bootstrap_lock:
            if not _bootstrap_done:
                try:
                    start_data_and_ws_once()  # 초기 REST 로딩 + WS 스레드 시작
                except Exception as e:
                    print("[WARN] start_data_and_ws_once failed:", e)
                _bootstrap_done = True

# =====================[ 지표/전략 유틸 ]=====================
def get_klines(symbol: str, interval: str, limit: int) -> pd.DataFrame:
    url = f"{BINANCE_REST}/fapi/v1/klines"
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
    return (100 - (100 / (1 + rs))).fillna(50)

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
    return (tp * df["volume"]).cumsum() / df["volume"].cumsum().replace(0, np.nan)

def displacement_mask(df: pd.DataFrame, atr_len=14, k=ATR_MULT):
    _atr = atr(df, atr_len)
    body = (df["close"] - df["open"]).abs()
    hi3  = df["high"].shift(1).rolling(3).max()
    lo3  = df["low"].shift(1).rolling(3).min()
    bull = (df["close"] > df["open"]) & (body >= k*_atr) & (df["close"] > hi3)
    bear = (df["close"] < df["open"]) & (body >= k*_atr) & (df["close"] < lo3)
    return bull.fillna(False), bear.fillna(False)

def find_last_opp_candle(df: pd.DataFrame, i: int, look=OB_LOOKBACK, want="bear"):
    rng = range(max(0, i-look), i)
    sub = df.iloc[list(rng)]
    idx = sub[(sub["close"] < sub["open"])].index if want=="bear" else sub[(sub["close"] > sub["open"])].index
    return idx[-1] if len(idx) else None

def build_order_blocks(df: pd.DataFrame):
    bull_disp, bear_disp = displacement_mask(df)
    recs = []
    for i in range(len(df)):
        if bull_disp.iat[i]:
            j = find_last_opp_candle(df, i, want="bear")
            if j is not None:
                row = df.loc[j]
                recs.append({"i": i, "kind": "demand", "top": max(row["open"],row["close"]), "bot": min(row["open"],row["close"])})
        if bear_disp.iat[i]:
            j = find_last_opp_candle(df, i, want="bull")
            if j is not None:
                row = df.loc[j]
                recs.append({"i": i, "kind": "supply", "top": max(row["open"],row["close"]), "bot": min(row["open"],row["close"])})
    return recs

def htf_trend_ok(htf_df: pd.DataFrame):
    t = tema(htf_df["close"], 30)
    return (t > t.shift()).iloc[-1], (t < t.shift()).iloc[-1]

def session_rects(times_utc: pd.Series):
    rects = []
    if times_utc.empty: return rects
    start = times_utc.iloc[0]; end = times_utc.iloc[-1]
    cur = (start + pd.Timedelta(hours=9)).normalize()  # 자정(KST)
    while cur <= end + pd.Timedelta(hours=9):
        for name, sh, sm, eh, em, color in SESSIONS_KST:
            s_kst = cur + pd.Timedelta(hours=sh, minutes=sm)
            e_kst = cur + pd.Timedelta(hours=eh, minutes=em)
            if e_kst <= s_kst: e_kst += pd.Timedelta(days=1)
            s = s_kst - pd.Timedelta(hours=9); e = e_kst - pd.Timedelta(hours=9)
            xs = max(s, start); xe = min(e, end + (end-start)/20)
            if xe > xs:
                rects.append(dict(type="rect", xref="x", yref="paper", x0=xs, x1=xe, y0=0, y1=1,
                                  fillcolor=color, opacity=0.06, line=dict(width=0)))
        cur += pd.Timedelta(days=1)
    return rects

def session_rects_kst(x_kst: pd.Series):
    rects = []
    if x_kst.empty: return rects
    start = x_kst.iloc[0].normalize()
    end   = x_kst.iloc[-1].normalize() + pd.Timedelta(days=1)
    cur = start
    while cur <= end:
        for name, sh, sm, eh, em, color in SESSIONS_KST:
            s = cur + pd.Timedelta(hours=sh, minutes=sm)
            e = cur + pd.Timedelta(hours=eh, minutes=em)
            if e <= s: e += pd.Timedelta(days=1)
            xs = max(s, x_kst.iloc[0])
            xe = min(e, x_kst.iloc[-1])
            if xe > xs:
                rects.append(dict(type="rect", xref="x", yref="paper",
                                  x0=xs, x1=xe, y0=0, y1=1,
                                  fillcolor=color, opacity=0.06, line=dict(width=0)))
        cur += pd.Timedelta(days=1)
    return rects

def build_signals(df: pd.DataFrame, htf_df: pd.DataFrame, cvd_now: float):
    _rsi = rsi(df["close"], 14)
    _st  = stoch_k(df, 14).rolling(3).mean()
    _atr = atr(df, 14)
    _vwap = vwap(df)
    htf_up, htf_dn = htf_trend_ok(htf_df)
    obs = build_order_blocks(df)

    cooldown_bars = max(1, int(COOL_MIN * 60 / (pd.Timedelta(INTERVAL).total_seconds())))
    last_long_i = last_short_i = -10**9
    signals = []

    for ob in obs[-50:]:
        i = ob["i"]
        if i <= 0 or i >= len(df): continue
        close = df["close"].iat[i]
        top, bot = ob["top"], ob["bot"]
        mid = (top + bot)/2
        vw = _vwap.iat[i]
        r, k = _rsi.iat[i], _st.iat[i]
        vw_ok = abs((close - vw) / vw) * 100 <= VWAP_TOL_PCT

        if ob["kind"]=="demand":
            long_base = (close > mid or close > top) and htf_up and vw_ok and (k>50) and (r<70) and (cvd_now>0)
            if long_base and (i - last_long_i) > cooldown_bars:
                risk = max(close - bot, 1e-6)
                signals.append(dict(
                    i=i, time=df["open_time"].iat[i], type="LONG", price=float(close),
                    ob=dict(top=float(top), bottom=float(bot)),
                    sl=float(bot - ATR_BUF * _atr.iat[i]),
                    tp1=float(close + RR1 * risk),
                    tp2=float(close + RR2 * risk)
                ))
                last_long_i = i

        if ob["kind"]=="supply":
            short_base = (close < mid or close < bot) and htf_dn and vw_ok and (k<50) and (r>30) and (cvd_now<0)
            if short_base and (i - last_short_i) > cooldown_bars:
                risk = max(top - close, 1e-6)
                signals.append(dict(
                    i=i, time=df["open_time"].iat[i], type="SHORT", price=float(close),
                    ob=dict(top=float(top), bottom=float(bot)),
                    sl=float(top + ATR_BUF * _atr.iat[i]),
                    tp1=float(close - RR1 * risk),
                    tp2=float(close - RR2 * risk)
                ))
                last_short_i = i
    return signals, _vwap

# =====================[ 웹소켓 수신기 ]=====================
async def ws_consumer():
    """
    - kline_30m: 진행중 봉을 실시간 갱신, 종가/고가/저가/거래량 업데이트. 봉 완료 시 새 행 append.
    - aggTrade: isBuyerMaker(m) → 매도 주도면 -, 아니면 + 로 CVD 누적.
    """
    global df_30, cvd_cum, cvd_series
    # 초기 REST 로딩
    with _state_lock:
        df_30 = get_klines(SYMBOL, INTERVAL, KLINE_LIMIT)
    ws_url = BINANCE_WS
    while True:
        try:
            async with websockets.connect(ws_url, ping_interval=20, ping_timeout=20) as ws:
                # print("WS connected:", ws_url)
                async for msg in ws:
                    data = json.loads(msg)
                    stream = data.get("stream", "")
                    payload = data.get("data", {})

                    if stream.endswith("@kline_30m"):
                        k = payload.get("k", {})
                        ts_open = pd.to_datetime(k["t"], unit="ms", utc=True)
                        o = float(k["o"]); h=float(k["h"]); l=float(k["l"]); c=float(k["c"]); v=float(k["v"])
                        is_closed = bool(k["x"])

                        with _state_lock:
                            if not df_30.empty and ts_open == df_30["open_time"].iloc[-1]:
                                # 진행중 봉 업데이트
                                df_30.loc[df_30.index[-1], ["open","high","low","close","volume"]] = [o,h,l,c,v]
                            else:
                                # 새 봉 시작
                                new_row = pd.DataFrame([[ts_open,o,h,l,c,v]],
                                    columns=["open_time","open","high","low","close","volume"])
                                df_30 = pd.concat([df_30, new_row], ignore_index=True)
                                if len(df_30) > KLINE_LIMIT:
                                    df_30 = df_30.iloc[-KLINE_LIMIT:]
                    elif stream.endswith("@aggTrade"):
                        # aggTrade: q=수량, m=주도(매도면 True)
                        qty = float(payload.get("q", 0))
                        is_seller_maker = bool(payload.get("m"))
                        signed = -qty if is_seller_maker else qty
                        with _state_lock:
                            cvd_cum += signed
                            # 30분 바 기준 시각으로 누적 시계열 업데이트
                            if df_30.empty:
                                continue
                            cur_bar_time = df_30["open_time"].iloc[-1]
                            cvd_series.at[cur_bar_time] = cvd_cum
        except Exception as e:
            # 재연결
            # print("WS error:", e)
            await asyncio.sleep(3)

def start_ws_thread():
    loop = asyncio.new_event_loop()
    t = threading.Thread(target=lambda: (asyncio.set_event_loop(loop), loop.run_until_complete(ws_consumer())), daemon=True)
    t.start()
    return t

# =====================[ Dash 앱 ]=====================

# 1) 테마 팔레트
THEMES = {
    "light": dict(
        template="plotly_white",
        paper="#ffffff", plot="#ffffff",
        font="#111111", grid="rgba(0,0,0,.12)", spike="rgba(0,0,0,.6)"
    ),
    "dark": dict(
        template="plotly_dark",
        paper="#111418", plot="#111418",
        font="#e8eaed", grid="rgba(255,255,255,.12)", spike="rgba(255,255,255,.7)"
    ),
}

def apply_theme(fig: go.Figure, theme: str) -> go.Figure:
    t = THEMES.get(theme, THEMES["dark"])
    fig.update_layout(
        template=t["template"],
        paper_bgcolor=t["paper"],
        plot_bgcolor=t["plot"],
        font=dict(color=t["font"]),
        hovermode="x unified",
        margin=dict(l=60, r=20, t=48, b=40),
        uirevision="keep",   # 리프레시 때 사용자 줌/팬 유지
    )
    #fig.update_xaxes(showgrid=True, gridcolor=t["grid"],
    #                 showspikes=True, spikemode="across", spikesnap="cursor",
    #                 spikedash="solid", spikethickness=1)
    #fig.update_yaxes(showgrid=True, gridcolor=t["grid"],
    #                 showspikes=True, spikemode="across", spikesnap="cursor",
    #                 spikedash="solid", spikethickness=1)
    return fig

#app = dash.Dash(__name__)
app.title = f"{SYMBOL} {INTERVAL} 전략 시각화 (WebSocket)"

app.layout = html.Div([
    # ✅ 상단 링크 버튼
    html.A(
        html.Button(
            "관리자 메인 이동",
            id="btn-admin",
            style={
                "padding": "8px 14px",
                "border": "none",
                "borderRadius": "8px",
                "backgroundColor": "#2563eb",  # 파란 버튼
                "color": "white",
                "cursor": "pointer",
                "margin": "8px 12px"
            }
        ),
        href="https://tradinggear.co.kr/admin/member"
        # 필요하면 새 탭: target="_blank"
    ),
    html.Div([
        html.Span("테마: ", style={"margin":"0 8px"}),
        dcc.RadioItems(
            id="theme-picker",
            options=[{"label":"라이트","value":"light"}, {"label":"다크","value":"dark"}],
            value="dark", inline=True, style={"margin":"8px 12px"}
        )
    ]),    
    html.H3("TradingGear – SOL 30분 실시간(WS) 전략 시각화", style={"margin":"6px 12px"}),
    html.Div(id="stats", style={"margin":"0 12px", "fontFamily":"monospace"}),
    #dcc.Graph(id="chart", figure=go.Figure(), style={"height":"85vh"}, config={"scrollZoom": True, "doubleClick": "reset", "displayModeBar": True, "responsive": True}),
    dcc.Graph(id="chart", figure=go.Figure(), style={"height":"85vh"}, config={"scrollZoom": True, "doubleClick": "reset", "displayModeBar": True, "responsive": True}),
    
    dcc.Interval(id="timer", interval=REFRESH_MS, n_intervals=0)
])

#THEMES = {
#  "light": dict(template="plotly_white", paper="#fff", plot="#fff", font="#111", grid="rgba(0,0,0,.12)"),
#  "dark":  dict(template="plotly_dark",  paper="#111418", plot="#111418", font="#e8eaed", grid="rgba(255,255,255,.12)")
#}
#def apply_theme(fig, name):
#    t = THEMES.get(name, THEMES["dark"])
#    fig.update_layout(template=t["template"], paper_bgcolor=t["paper"], plot_bgcolor=t["plot"],
#                      font=dict(color=t["font"]), hovermode="x unified", uirevision="keep")
#    fig.update_xaxes(showgrid=True, gridcolor=t["grid"], showspikes=True, spikemode="across", spikesnap="cursor")
#    fig.update_yaxes(showgrid=True, gridcolor=t["grid"], showspikes=True, spikemode="across", spikesnap="cursor")
#    return fig

def vwap_safe(df: pd.DataFrame) -> pd.Series:
    tp  = (df["high"] + df["low"] + df["close"]) / 3.0
    vol = df["volume"].astype(float)
    num = (tp * vol).cumsum()
    den = vol.cumsum().replace(0, np.nan)
    v = num / den
    return v.replace([np.inf, -np.inf], np.nan).ffill()

#def fetch_all():
    """현재 스냅샷 반환(락으로 보호) + HTF는 REST로 주기적 리프레시"""
#    global df_1h
#    with _state_lock:
#        df = df_30.copy()
#        cvd_val = float(cvd_series.iloc[-1]) if not cvd_series.empty else 0.0
#        last_price = float(df["close"].iloc[-1]) if not df.empty else np.nan
    # HTF는 1분마다 갱신 (간단)
#    if (df_1h.empty) or (datetime.utcnow().minute % 1 == 0):
#        try:
#            df_1h = get_klines(SYMBOL, HTF_INTERVAL, 300)
#        except Exception:
#            pass
#    return df, df_1h.copy(), cvd_val, last_price

def fetch_all():
    global df_1h
    with _state_lock:
        df = df_30.copy()
        cvd_ser = cvd_series.copy()  # 👈 추가
        cvd_val = float(cvd_ser.iloc[-1]) if not cvd_ser.empty else 0.0
        last_price = float(df["close"].iloc[-1]) if not df.empty else np.nan
    if (df_1h.empty) or (datetime.utcnow().minute % 1 == 0):
        try:
            df_1h = get_klines(SYMBOL, HTF_INTERVAL, 300)
        except Exception:
            pass
    return df, df_1h.copy(), cvd_ser, cvd_val, last_price  # 👈 변경

"""def build_figure():
    df, htf_df, cvd_val, last_price = fetch_all()
    if df.empty or htf_df.empty:
        fig = go.Figure(); fig.update_layout(title="로드 중…")
        return fig, "데이터 대기"

    # 전략 신호 생성
    #signals, vwap_series = build_signals(df, htf_df, cvd_val)

    # 차트 기본
    #fig = go.Figure(data=[go.Candlestick(
    #    x=df["open_time"], open=df["open"], high=df["high"],
    #    low=df["low"], close=df["close"], name=f"{SYMBOL} {INTERVAL}"
    #)])


    # KST로 변환된 시각(naive) 준비
    x_kst = to_kst_naive(df["open_time"])

    signals, vwap_series = build_signals(df, htf_df, cvd_val)

    fig = go.Figure(data=[go.Candlestick(
        x=x_kst, open=df["open"], high=df["high"], low=df["low"], close=df["close"],
        name=f"{SYMBOL} {INTERVAL}"
    )])


    # fig = go.Figure( ... ) 만든 뒤에
    fig.update_layout(hovermode="x unified")  # 수직 기준선 + 통합 툴팁

    # 수직/수평 스파이크 라인 켜기 (커서를 따라 움직임)
    # 스파이크(가이드 라인) 색/두께 변경
    fig.update_xaxes(
        showspikes=True,
        spikemode="across",
        spikesnap="cursor",
        spikethickness=3,                 # ← 두께 굵게
        spikedash="solid",
        spikecolor="rgba(0, 102, 255, 0.9)"  # ← 파란색(진한 블루)
    )
    fig.update_yaxes(
        showspikes=True,
        spikemode="across",
        spikesnap="cursor",
        spikethickness=3,                 # ← 두께 굵게
        spikedash="solid",
        spikecolor="rgba(0, 102, 255, 0.7)"  # ← 파란색(약간 투명)
    )

    # 실시간 업데이트에서도 사용자 줌/스파이크 상태 유지하고 싶으면
    fig.update_layout(uirevision="keep")






    # 세션 배경
    fig.update_layout(shapes=session_rects_kst(df["open_time"]))

    # 현재가 / VWAP
    fig.add_hline(y=last_price, line_color="#E74C3C", line_dash="dot",
                  annotation_text=f"현재가 {last_price:.3f}", annotation_position="top right")
    fig.add_hline(y=float(vwap_series.iloc[-1]), line_color="#008FFB", line_dash="dot",
                  annotation_text=f"VWAP {float(vwap_series.iloc[-1]):.3f}", annotation_position="bottom right")

    # OB 박스(최근 10개)
    obs = build_order_blocks(df)
    for ob in obs[-10:]:
        #x0 = df["open_time"].iat[max(ob["i"]-1, 0)]
        #x1 = df["open_time"].iat[min(ob["i"]+20, len(df)-1)]
        x0 = x_kst.iat[max(ob["i"]-1, 0)]                      # 👈 KST
        x1 = x_kst.iat[min(ob["i"]+20, len(df)-1)]             # 👈 KST        
        color = "#16A085" if ob["kind"]=="demand" else "#E67E22"
        fig.add_shape(type="rect", xref="x", yref="y",
            x0=x0, x1=x1, y0=ob["bot"], y1=ob["top"],
            fillcolor=color, opacity=0.18, line=dict(color=color, width=1))

    # 신호(최근 6개만)
    for sig in signals[-6:]:
        #xi = df["open_time"].iat[sig["i"]]
        xi_kst = x_kst.iat[sig["i"]]
        color = "#00E396" if sig["type"]=="LONG" else "#FF4560"
        #fig.add_annotation(x=xi, y=sig["price"],
        fig.add_annotation(x=xi_kst, y=sig["price"],
            text=("롱 진입" if sig["type"]=="LONG" else "숏 진입"),
            showarrow=True, arrowhead=3, arrowsize=1, arrowcolor=color,
            ax=0, ay=40 if sig["type"]=="LONG" else -40,
            bgcolor=color, opacity=0.9, font=dict(color="white"))
        fig.add_hline(y=sig["sl"],  line_color="#E74C3C", annotation_text="손절",  annotation_position="left")
        fig.add_hline(y=sig["tp1"], line_color="#2ECC71", line_dash="dash", annotation_text="익절1", annotation_position="left")
        fig.add_hline(y=sig["tp2"], line_color="#27AE60", line_dash="dot",  annotation_text="익절2", annotation_position="left")

        # 예상 구간
        y0, y1 = (sig["price"], sig["tp2"]) if sig["type"]=="LONG" else (sig["tp2"], sig["price"])
        x1_pred = xi_kst + pd.Timedelta(minutes=30*20)  # 10시간
        #fig.add_shape(type="rect", xref="x", yref="y",
        #              x0=xi, x1=xi + pd.Timedelta(minutes=30*20),
        #              y0=y0, y1=y1, fillcolor=color, opacity=0.10, line=dict(width=0))
        # 아래 “축 고정”을 사용할 거라 따로 clamp 안 해도 됨
        fig.add_shape(type="rect", xref="x", yref="y",
              x0=xi_kst, x1=xi_kst + pd.Timedelta(minutes=30*20), y0=y0, y1=y1, fillcolor=color, opacity=0.10, line=dict(width=0))
        fig.add_annotation(x=x1_pred, y=(y0+y1)/2,
                           text="상승 예상 구간" if sig["type"]=="LONG" else "하락 예상 구간",
                           showarrow=False, bgcolor=color, opacity=0.6, font=dict(color="white"))        
        #fig.add_annotation(x=xi + pd.Timedelta(minutes=30*5), y=(y0+y1)/2,
        #                   text="상승 예상 구간" if sig["type"]=="LONG" else "하락 예상 구간",
        #                   showarrow=False, bgcolor=color, opacity=0.6, font=dict(color="white"))

    fig.update_layout(
        title=f"{SYMBOL} {INTERVAL} – 실시간(WebSocket) 직관 시각화",
        xaxis=dict(type="date", rangeslider=dict(visible=False)),
        yaxis=dict(fixedrange=False),
        template="plotly_white",
        legend=dict(orientation="h")
    )

    fig.update_layout(shapes=session_rects_kst(x_kst))

    stat = f"CVD(aggTrade 실시간): {cvd_val:.0f} | 최근 신호: {signals[-1]['type']} @ {signals[-1]['price']:.2f}" if signals else f"CVD(aggTrade 실시간): {cvd_val:.0f} | 신호 없음"
    return fig, stat"""

def build_figure():
    df, htf_df, cvd_ser, cvd_val, last_price = fetch_all()  # 👈 변경
    if df.empty or htf_df.empty:
        fig = go.Figure(); fig.update_layout(title="로드 중…")
        return fig, "데이터 대기"

    # KST x축(naive) 일관 적용
    x_kst = to_kst_naive(df["open_time"])

    # 전략 신호
    signals, _ = build_signals(df, htf_df, cvd_val)

    # 캔들
    fig = go.Figure(data=[go.Candlestick(
        x=x_kst, open=df["open"], high=df["high"], low=df["low"], close=df["close"],
        name=f"{SYMBOL} {INTERVAL}"
    )])

    # === VWAP: 안전 계산 + 라인 + 마지막 값 수평선 ===
    vwap_series = vwap_safe(df)
    vwap_last = float(vwap_series.iloc[-1]) if np.isfinite(vwap_series.iloc[-1]) else None

    fig.add_trace(go.Scatter(
        x=x_kst, y=vwap_series, mode="lines", name="VWAP",
        line=dict(width=1.8, color="#008FFB")
    ))
    if vwap_last is not None:
        fig.add_hline(
            y=vwap_last, line_color="#008FFB", line_dash="dot",
            annotation_text=f"VWAP {vwap_last:.3f}", annotation_position="bottom right"
        )

    # 스파이크/줌 유지
    fig.update_layout(hovermode="x unified", uirevision="keep")
    fig.update_xaxes(showspikes=True, spikemode="across", spikesnap="cursor",
                     spikethickness=3, spikedash="solid", spikecolor="rgba(0,102,255,0.9)")
    fig.update_yaxes(showspikes=True, spikemode="across", spikesnap="cursor",
                     spikethickness=3, spikedash="solid", spikecolor="rgba(0,102,255,0.7)")

    # === 세션 배경: KST x 사용 ===
    fig.update_layout(shapes=session_rects_kst(x_kst))

    # 현재가
    if np.isfinite(last_price):
        fig.add_hline(y=last_price, line_color="#E74C3C", line_dash="dot",
                      annotation_text=f"현재가 {last_price:.3f}", annotation_position="top right")

    # OB 박스: KST x 사용 (UTC 혼용 금지)
    obs = build_order_blocks(df)
    for ob in obs[-10:]:
        x0 = x_kst.iat[max(ob["i"]-1, 0)]                      # 👈 KST
        x1 = x_kst.iat[min(ob["i"]+20, len(df)-1)]             # 👈 KST
        color = "#16A085" if ob["kind"]=="demand" else "#E67E22"
        fig.add_shape(type="rect", xref="x", yref="y",
                      x0=x0, x1=x1, y0=ob["bot"], y1=ob["top"],
                      fillcolor=color, opacity=0.18, line=dict(color=color, width=1))

    # 신호: KST x 사용
    for sig in signals[-6:]:
        xi_kst = x_kst.iat[sig["i"]]
        color = "#00E396" if sig["type"]=="LONG" else "#FF4560"
        fig.add_annotation(x=xi_kst, y=sig["price"],
                           text=("롱 진입" if sig["type"]=="LONG" else "숏 진입"),
                           showarrow=True, arrowhead=3, arrowsize=1, arrowcolor=color,
                           ax=0, ay=40 if sig["type"]=="LONG" else -40,
                           bgcolor=color, opacity=0.9, font=dict(color="white"))
        fig.add_hline(y=sig["sl"],  line_color="#E74C3C", annotation_text="손절",  annotation_position="left")
        fig.add_hline(y=sig["tp1"], line_color="#2ECC71", line_dash="dash", annotation_text="익절1", annotation_position="left")
        fig.add_hline(y=sig["tp2"], line_color="#27AE60", line_dash="dot",  annotation_text="익절2", annotation_position="left")

        # 예상 구간 (KST)
        y0, y1 = (sig["price"], sig["tp2"]) if sig["type"]=="LONG" else (sig["tp2"], sig["price"])
        fig.add_shape(type="rect", xref="x", yref="y",
                      x0=xi_kst, x1=xi_kst + pd.Timedelta(minutes=30*20),
                      y0=y0, y1=y1, fillcolor=color, opacity=0.10, line=dict(width=0))

    # === CVD 라인(y2) 추가 ===
    if not cvd_ser.empty:
        idx_kst = pd.to_datetime(cvd_ser.index, utc=True).tz_convert(TZ).tz_localize(None)
        fig.update_layout(yaxis2=dict(title="CVD", overlaying="y", side="right", showgrid=False))
        fig.add_trace(go.Scatter(
            x=idx_kst, y=cvd_ser.values, name="CVD", mode="lines",
            line=dict(width=1.3, color="#9B59B6"), yaxis="y2"
        ))

    fig.update_layout(
        title=f"{SYMBOL} {INTERVAL} – 실시간(WebSocket) 직관 시각화",
        xaxis=dict(type="date", rangeslider=dict(visible=False)),
        yaxis=dict(fixedrange=False),
        template="plotly_white",
        legend=dict(orientation="h"),
    )

    stat = (
        f"CVD(aggTrade 실시간): {cvd_val:.0f} | 최근 신호: {signals[-1]['type']} @ {signals[-1]['price']:.2f}"
        if signals else f"CVD(aggTrade 실시간): {cvd_val:.0f} | 신호 없음"
    )
    return fig, stat

#@app.callback(
#    [Output("chart","figure"), Output("stats","children")],
#    [Input("timer","n_intervals")]
#)
#def tick(_):
#    fig, stat = build_figure()
#    return fig, stat

@app.callback(
  [Output("chart","figure"), Output("stats","children")],
  [Input("timer","n_intervals"), Input("theme-picker","value")]
)
def tick(_, theme):
    fig, stat = build_figure()
    fig = apply_theme(fig, theme)  # ← 테마 반영 함수
    return fig, stat

#if __name__ == "__main__":
    # 초기 로딩(REST) 후 WS 스레드 시작
#    with _state_lock:
#        df_30 = get_klines(SYMBOL, INTERVAL, KLINE_LIMIT)
#    df_1h = get_klines(SYMBOL, HTF_INTERVAL, 300)
#    start_ws_thread()
#    print("WebSocket streaming from:", BINANCE_WS)
#    dash.Dash.__init__
    #app.run_server(debug=True)
    # ✅ Dash 2.16+ : run_server → run
#    app.run(
#        debug=True,       # 개발 중이면 True, 배포 시 False 권장
#        host="0.0.0.0",   # 외부 접속 허용
#        port=8050         # 필요 시 변경
#    )

# ✅ 초기 로딩 + WS 스레드 1회만 시작
_init_done = False
def start_data_and_ws_once():
    global _init_done, df_30, df_1h
    if _init_done:
        return
    with _state_lock:
        df_30 = get_klines(SYMBOL, INTERVAL, KLINE_LIMIT)
    df_1h = get_klines(SYMBOL, HTF_INTERVAL, 300)
    start_ws_thread()
    print("WebSocket streaming from:", BINANCE_WS)
    _init_done = True

# import 시 실행 (gunicorn 워커마다 실행되므로 workers=1 권장)
#start_data_and_ws_once()

#if __name__ == "__main__":
#    app.run(host="0.0.0.0", port=8050, debug=True)