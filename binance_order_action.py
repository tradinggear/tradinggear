import time
import hmac
import hashlib
import requests

# ✏️ 사용자 본인의 API 키 입력
API_KEY = "YOUR_API_KEY"
API_SECRET = "YOUR_API_SECRET"

BASE_URL = "https://fapi.binance.com"

def create_signature(secret, query_string):
    return hmac.new(secret.encode(), query_string.encode(), hashlib.sha256).hexdigest()

def place_futures_order(symbol: str, side: str, quantity: float, order_type="MARKET"):
    """
    Binance 선물 시장가 주문 실행
    :param symbol: 거래쌍 (예: BTCUSDT)
    :param side: BUY or SELL
    :param quantity: 주문 수량
    :param order_type: 주문 유형 (기본 MARKET)
    """
    url = f"{BASE_URL}/fapi/v1/order"
    timestamp = int(time.time() * 1000)

    params = {
        "symbol": symbol,
        "side": side,  # "BUY" or "SELL"
        "type": order_type,
        "quantity": quantity,
        "timestamp": timestamp,
    }

    query_string = '&'.join([f"{k}={v}" for k, v in params.items()])
    signature = create_signature(API_SECRET, query_string)
    params["signature"] = signature

    headers = {
        "X-MBX-APIKEY": API_KEY
    }

    res = requests.post(url, headers=headers, params=params)
    return res.json()

# ✅ 예제: BTCUSDT 0.001개 시장가 매수
response = place_futures_order("BTCUSDT", "BUY", 0.001)
print(response)
