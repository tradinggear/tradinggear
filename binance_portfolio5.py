import hmac
import hashlib
import time
import requests
import json
import websocket
import threading

from fastapi import FastAPI
from fastapi import APIRouter
from fastapi.middleware.cors import CORSMiddleware

router = APIRouter()

app = FastAPI()

# ✅ CORS 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://tradinggear.co.kr"],  # 허용할 도메인
    allow_credentials=True,
    allow_methods=["*"],   # GET, POST 등 모든 메서드 허용
    allow_headers=["*"],   # 모든 헤더 허용
)


# ✅ 1. 이메일 기반 API 키/시크릿 가져오기
def get_user_api_keys(email: str):
    url = "https://tradinggear.co.kr:8081/tradinggear/member_inform_get.php"
    data = {'email': email}
    response = requests.post(url, data=data)
    result = response.json()
    return result[0]['decrypted_api_key'], result[0]['decrypted_api_secret']

# ✅ 2. 현재 마크가격 가져오기 (REST 사용)
def get_current_price(symbol: str) -> float:
    res = requests.get("https://fapi.binance.com/fapi/v1/premiumIndex", params={"symbol": symbol})
    return float(res.json().get("markPrice", 0.0))

# ✅ 3. 포트폴리오 항목 구성
def build_portfolio_item(symbol, position_amt, entry_price, unrealized_pnl):
    mark_price = get_current_price(symbol)
    qty = abs(position_amt)
    evaluation_amount = mark_price * qty
    profit = unrealized_pnl
    profit_rate = (profit / (entry_price * qty)) * 100 if entry_price > 0 else 0
    state = "profit" if profit > 0 else "loss" if profit < 0 else "neutral"

    return {
        'symbol': symbol,
        'currentPrice': mark_price,
        'averagePrice': entry_price,
        'quantity': qty,
        'evaluationAmount': evaluation_amount,
        'profit': profit,
        'profitRate': profit_rate,
        'state': state
    }

# ✅ 4. WebSocket 메시지 핸들러
def on_message(ws, message):
    data = json.loads(message)
    if data.get("e") == "ACCOUNT_UPDATE":
        portfolio = []
        for p in data['a']['P']:
            symbol = p['s']
            position_amt = float(p['pa'])
            entry_price = float(p['ep'])
            unrealized_pnl = float(p['up'])

            if position_amt != 0:
                item = build_portfolio_item(symbol, position_amt, entry_price, unrealized_pnl)
                portfolio.append(item)

        print("📊 실시간 포지션 업데이트:")
        for item in portfolio:
            print(json.dumps(item, indent=2))

def on_open(ws):
    print("✅ WebSocket 연결됨")

def on_error(ws, error):
    print("❌ WebSocket 오류:", error)

def on_close(ws, *args):
    print("🔒 WebSocket 종료됨")

# ✅ 5. Listen Key 발급 (유저별)
def get_listen_key(api_key):
    url = "https://fapi.binance.com/fapi/v1/listenKey"
    headers = {"X-MBX-APIKEY": api_key}
    response = requests.post(url, headers=headers)
    
    return response.json()['listenKey']

# ✅ 6. Listen Key 연장
def keepalive_listen_key(api_key):
    while True:
        url = "https://fapi.binance.com/fapi/v1/listenKey"
        headers = {"X-MBX-APIKEY": api_key}
        requests.put(url, headers=headers)
        time.sleep(60 * 30)

# ✅ 7. WebSocket 시작
def start_user_stream(api_key):
    listen_key = get_listen_key(api_key)
    ws_url = f"wss://fstream.binance.com/ws/{listen_key}"
    ws = websocket.WebSocketApp(
        ws_url,
        on_open=on_open,
        on_message=on_message,
        on_error=on_error,
        on_close=on_close
    )
    thread = threading.Thread(target=ws.run_forever)
    thread.start()
    return thread

# ✅ 8. 실행
#if __name__ == "__main__":
@router.get("/binance_portfolio5")
def binance_portfolio5_main(email: str):
    #email = input("📧 이메일 입력: ").strip()
    try:
        api_key, api_secret = get_user_api_keys(email)
        print("🔑 API KEY 로드 성공")
    except Exception as e:
        print("❌ API 키 가져오기 실패:", e)
        exit(1)

    # 실시간 포지션 추적 시작
    start_user_stream(api_key)
    threading.Thread(target=keepalive_listen_key, args=(api_key,), daemon=True).start()

    # 무한 대기
    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        print("🛑 종료")
