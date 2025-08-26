# file: run_pnl_single_url.py

import time
import json
import threading
import requests
import websocket
from datetime import datetime
from fastapi import FastAPI, Query
from fastapi.responses import JSONResponse

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

BASE_URL = "https://fapi.binance.com"
WS_BASE = "wss://fstream.binance.com/ws"

# 전역 상태 저장
chart_data = {}
cumulative_pnl = {}
initial_capital = 1000

# ✅ tradinggear 서버에서 API 키/시크릿 조회
def fetch_api_keys_by_email(email: str):
    form = {"email": email}
    response = requests.post(
        "https://tradinggear.co.kr:8081/tradinggear/member_inform_get.php",
        data=form,
        headers={"Content-Type": "application/x-www-form-urlencoded"}
    )
    response.raise_for_status()
    data = response.json()
    if not data or "decrypted_api_key" not in data[0]:
        raise ValueError("API Key 정보가 올바르지 않습니다.")
    return data[0]["decrypted_api_key"], data[0]["decrypted_api_secret"]

# ✅ listenKey 요청 및 갱신
def get_listen_key(api_key: str):
    res = requests.post(
        f"{BASE_URL}/fapi/v1/listenKey",
        headers={"X-MBX-APIKEY": api_key}
    )
    res.raise_for_status()
    return res.json()["listenKey"]

def keep_alive_listen_key(api_key: str):
    while True:
        time.sleep(30 * 60)
        requests.put(f"{BASE_URL}/fapi/v1/listenKey", headers={"X-MBX-APIKEY": api_key})

# ✅ WebSocket 이벤트 핸들러
def create_on_message(email: str):
    def on_message(ws, message):
        global cumulative_pnl, chart_data
        data = json.loads(message)

        if data.get("e") == "ORDER_TRADE_UPDATE":
            order = data["o"]
            realized_pnl = float(order.get("rp", 0))
            event_time = int(data.get("E", time.time() * 1000))

            if realized_pnl != 0:
                cumulative_pnl[email] += realized_pnl
                pl_percent = (cumulative_pnl[email] / initial_capital) * 100
                time_str = datetime.fromtimestamp(event_time / 1000).strftime("%y-%m-%d %H:%M")

                chart_data[email].append({
                    "time": time_str,
                    "value": round(pl_percent, 2)
                })

                print(f"[{email}] 📈 {time_str} | 손익률: {pl_percent:.2f}% (실현: {realized_pnl:.2f})")
    return on_message

# ✅ WebSocket 실행 (백그라운드)
def run_ws_background(email: str, api_key: str, listen_key: str):
    threading.Thread(target=keep_alive_listen_key, args=(api_key,), daemon=True).start()

    ws = websocket.WebSocketApp(
        f"{WS_BASE}/{listen_key}",
        on_message=create_on_message(email),
        on_error=lambda ws, err: print(f"[{email}] ❌ WebSocket 오류: {err}"),
        on_close=lambda ws, *_: print(f"[{email}] 🔌 WebSocket 종료"),
        on_open=lambda ws: print(f"[{email}] ✅ WebSocket 연결됨")
    )
    threading.Thread(target=ws.run_forever, daemon=True).start()

# ✅ 하나의 URL로 실행 및 chart 반환
@router.get("/run_pnl_stream")
def run_pnl_stream(email: str = Query(..., description="사용자 이메일")):
    try:
        api_key, api_secret = fetch_api_keys_by_email(email)
        listen_key = get_listen_key(api_key)

        # 초기화
        cumulative_pnl[email] = 0
        chart_data[email] = []

        # 백그라운드로 WebSocket 실행
        run_ws_background(email, api_key, listen_key)

        return {
            "message": f"{email} 스트림 시작됨",
            "chart": chart_data[email]
        }
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})
