import hmac
import hashlib
import time
import requests
import json
import websocket
import threading

# 1️⃣ 사용자 이메일로 API Key, Secret 가져오기
def get_user_api_keys(email: str):
    url = "https://tradinggear.co.kr:8081/tradinggear/member_inform_get.php"
    data = {'email': email}
    response = requests.post(url, data=data)
    result = response.json()
    return result[0]['decrypted_api_key'], result[0]['decrypted_api_secret']

# 2️⃣ 포지션 정보 REST API로 조회
def get_futures_positions(api_key, api_secret):
    timestamp = int(time.time() * 1000)
    query_string = f"timestamp={timestamp}"
    signature = hmac.new(
        api_secret.encode('utf-8'),
        query_string.encode('utf-8'),
        hashlib.sha256
    ).hexdigest()

    url = f"https://fapi.binance.com/fapi/v2/positionRisk?{query_string}&signature={signature}"
    headers = {
        'X-MBX-APIKEY': api_key
    }
    response = requests.get(url, headers=headers)
    return response.json()

# 3️⃣ 포지션 데이터 분석
def analyze_positions(positions):
    active_positions = [p for p in positions if float(p['positionAmt']) != 0]

    portfolio = []
    for idx, p in enumerate(active_positions):
        qty = abs(float(p['positionAmt']))
        mark_price = float(p['markPrice'])
        entry_price = float(p['entryPrice'])
        evaluation_amount = mark_price * qty
        profit = (mark_price - entry_price) * qty * (1 if float(p['positionAmt']) > 0 else -1)
        profit_rate = (profit / (entry_price * qty)) * 100 if entry_price > 0 else 0

        portfolio.append({
            'id': idx + 1,
            'symbol': p['symbol'],
            'currentPrice': mark_price,
            'averagePrice': entry_price,
            'quantity': qty,
            'evaluationAmount': evaluation_amount,
            'profit': profit,
            'profitRate': profit_rate,
            'state': "profit" if profit > 0 else "loss" if profit < 0 else "neutral"
        })
    return portfolio

# 4️⃣ WebSocket으로 실시간 가격 수신 (보조 용도)
def subscribe_websocket(symbols):
    def on_message(ws, message):
        data = json.loads(message)
        print("📈 실시간 가격:", data['s'], "=", data['p'])

    def on_error(ws, error):
        print("❌ 에러:", error)

    def on_close(ws, close_status_code, close_msg):
        print("🔒 WebSocket 종료")

    def on_open(ws):
        params = [f"{symbol.lower()}@markPrice" for symbol in symbols]
        ws.send(json.dumps({
            "method": "SUBSCRIBE",
            "params": params,
            "id": 1
        }))

    ws = websocket.WebSocketApp("wss://fstream.binance.com/ws",
                                on_open=on_open,
                                on_message=on_message,
                                on_error=on_error,
                                on_close=on_close)

    thread = threading.Thread(target=ws.run_forever)
    thread.start()


# 🧪 실행 예시
if __name__ == "__main__":
    email = "lovedisket@gmail.com"
    api_key, api_secret = get_user_api_keys(email)
    positions = get_futures_positions(api_key, api_secret)

    if not isinstance(positions, list):
        print("🚨 Binance API 오류 발생")
        exit(1)

    portfolio = analyze_positions(positions)
    print("📊 포트폴리오:")
    for item in portfolio:
        print(json.dumps(item, indent=2))

    # 실시간 가격 추적 시작 (선택 사항)
    symbols = [item['symbol'] for item in portfolio]
    if symbols:
        subscribe_websocket(symbols)
