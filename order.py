# binance_trade.py
# Binance Spot & Futures(USDT-M) 매수/매도 단일 파일
# - 기본은 테스트넷(testnet=True)
# - 환경변수: BINANCE_API_KEY, BINANCE_API_SECRET

import os, time, hmac, hashlib, requests
from urllib.parse import urlencode
from typing import Optional, Dict, Any

class BinanceClient:
    def __init__(self, api_key: str, api_secret: str, market: str = "spot", testnet: bool = True):
        self.api_key = api_key
        self.api_secret = api_secret.encode()
        market = market.lower()
        assert market in ("spot", "futures")
        self.market = market
        if self.market == "spot":
            self.base = "https://testnet.binance.vision" if testnet else "https://api.binance.com"
            self.time_path = "/api/v3/time"
            self.exchange_info_path = "/api/v3/exchangeInfo"
        else:
            self.base = "https://testnet.binancefuture.com" if testnet else "https://fapi.binance.com"
            self.time_path = "/fapi/v1/time"
            self.exchange_info_path = "/fapi/v1/exchangeInfo"

        self.session = requests.Session()
        self.session.headers.update({"X-MBX-APIKEY": api_key})
        self._time_offset_ms = 0

    # ---------- 시간/서명/요청 ----------
    def _now_ms(self) -> int: return int(time.time() * 1000)

    def sync_time(self):
        r = self.session.get(self.base + self.time_path, timeout=10)
        r.raise_for_status()
        self._time_offset_ms = int(r.json()["serverTime"]) - self._now_ms()

    def _ts(self) -> int: return self._now_ms() + self._time_offset_ms

    def _sign(self, params: Dict[str, Any]) -> str:
        qs = urlencode(params, True)
        return hmac.new(self.api_secret, qs.encode(), hashlib.sha256).hexdigest()

    def _request(self, method: str, path: str, params: Optional[Dict[str, Any]] = None, signed: bool = False):
        url = self.base + path
        params = params or {}
        if signed:
            params["timestamp"] = self._ts()
            params.setdefault("recvWindow", 5000)
            params["signature"] = self._sign(params)
        if method == "GET":
            r = self.session.get(url, params=params, timeout=15)
        elif method == "POST":
            r = self.session.post(url, params=params, timeout=15)
        elif method == "DELETE":
            r = self.session.delete(url, params=params, timeout=15)
        else:
            raise ValueError("bad method")
        try:
            r.raise_for_status()
        except requests.HTTPError as e:
            raise RuntimeError(f"HTTP {r.status_code}: {r.text}") from e
        return r.json()

    # ---------- 마켓 데이터 ----------
    def exchange_info(self, symbol: Optional[str] = None) -> Dict[str, Any]:
        params = {"symbol": symbol.upper()} if symbol else {}
        return self._request("GET", self.exchange_info_path, params)

    def price(self, symbol: str) -> float:
        path = "/api/v3/ticker/price" if self.market == "spot" else "/fapi/v1/ticker/price"
        j = self._request("GET", path, {"symbol": symbol.upper()})
        return float(j["price"])

    # ---------- 수량/가격 보정 ----------
    def _quantize(self, symbol: str, price: Optional[float], qty: Optional[float], is_market: bool):
        info = self.exchange_info(symbol)
        sym = info["symbols"][0]
        filters = {f["filterType"]: f for f in sym["filters"]}

        if price is not None and "PRICE_FILTER" in filters:
            tick = float(filters["PRICE_FILTER"]["tickSize"])
            price = round(round(price / tick) * tick, 8)

        if qty is not None:
            lot_key = "MARKET_LOT_SIZE" if (is_market and "MARKET_LOT_SIZE" in filters) else "LOT_SIZE"
            step = float(filters[lot_key]["stepSize"])
            min_q = float(filters[lot_key]["minQty"])
            max_q = float(filters[lot_key]["maxQty"])
            qty = max(min_q, min(max_q, round(round(qty / step) * step, 8)))

        return price, qty

    # ======================= 스팟(현물) =======================
    # NOTE: 스팟 SELL은 base 수량을 지정해야 안전합니다(quoteOrderQty는 BUY 위주 사용).
    def spot_market_buy(self, symbol: str, *, base_qty: float = None, quote_qty: float = None):
        assert self.market == "spot"
        assert (base_qty is not None) ^ (quote_qty is not None), "base_qty 또는 quote_qty 중 하나만"
        params = {"symbol": symbol.upper(), "side": "BUY", "type": "MARKET"}
        if base_qty is not None:
            _, q = self._quantize(symbol, None, base_qty, is_market=True)
            params["quantity"] = q
        else:
            params["quoteOrderQty"] = float(quote_qty)
        return self._request("POST", "/api/v3/order", params, signed=True)

    def spot_market_sell(self, symbol: str, *, quantity: float):
        assert self.market == "spot"
        _, q = self._quantize(symbol, None, quantity, is_market=True)
        params = {"symbol": symbol.upper(), "side": "SELL", "type": "MARKET", "quantity": f"{q:.8f}"}
        return self._request("POST", "/api/v3/order", params, signed=True)

    def spot_limit_buy(self, symbol: str, *, price: float, quantity: float, tif: str = "GTC"):
        assert self.market == "spot"
        p, q = self._quantize(symbol, price, quantity, is_market=False)
        params = {"symbol": symbol.upper(), "side": "BUY", "type": "LIMIT", "timeInForce": tif,
                  "price": f"{p:.8f}", "quantity": f"{q:.8f}"}
        return self._request("POST", "/api/v3/order", params, signed=True)

    def spot_limit_sell(self, symbol: str, *, price: float, quantity: float, tif: str = "GTC"):
        assert self.market == "spot"
        p, q = self._quantize(symbol, price, quantity, is_market=False)
        params = {"symbol": symbol.upper(), "side": "SELL", "type": "LIMIT", "timeInForce": tif,
                  "price": f"{p:.8f}", "quantity": f"{q:.8f}"}
        return self._request("POST", "/api/v3/order", params, signed=True)

    # ======================= 선물(USDⓈ-M) =======================
    # side 의미: BUY=롱 진입/숏 청산, SELL=숏 진입/롱 청산
    def futures_market_buy(self, symbol: str, *, quantity: float,
                           reduce_only: bool = False, position_side: Optional[str] = None):
        assert self.market == "futures"
        _, q = self._quantize(symbol, None, quantity, is_market=True)
        params = {"symbol": symbol.upper(), "side": "BUY", "type": "MARKET", "quantity": f"{q:.8f}"}
        if reduce_only: params["reduceOnly"] = "true"
        if position_side: params["positionSide"] = position_side.upper()
        return self._request("POST", "/fapi/v1/order", params, signed=True)

    def futures_market_sell(self, symbol: str, *, quantity: float,
                            reduce_only: bool = False, position_side: Optional[str] = None):
        assert self.market == "futures"
        _, q = self._quantize(symbol, None, quantity, is_market=True)
        params = {"symbol": symbol.upper(), "side": "SELL", "type": "MARKET", "quantity": f"{q:.8f}"}
        if reduce_only: params["reduceOnly"] = "true"
        if position_side: params["positionSide"] = position_side.upper()
        return self._request("POST", "/fapi/v1/order", params, signed=True)

    def futures_limit_buy(self, symbol: str, *, price: float, quantity: float,
                          tif: str = "GTC", reduce_only: bool = False, position_side: Optional[str] = None):
        assert self.market == "futures"
        p, q = self._quantize(symbol, price, quantity, is_market=False)
        params = {"symbol": symbol.upper(), "side": "BUY", "type": "LIMIT", "timeInForce": tif,
                  "price": f"{p:.8f}", "quantity": f"{q:.8f}"}
        if reduce_only: params["reduceOnly"] = "true"
        if position_side: params["positionSide"] = position_side.upper()
        return self._request("POST", "/fapi/v1/order", params, signed=True)

    def futures_limit_sell(self, symbol: str, *, price: float, quantity: float,
                           tif: str = "GTC", reduce_only: bool = False, position_side: Optional[str] = None):
        assert self.market == "futures"
        p, q = self._quantize(symbol, price, quantity, is_market=False)
        params = {"symbol": symbol.upper(), "side": "SELL", "type": "LIMIT", "timeInForce": tif,
                  "price": f"{p:.8f}", "quantity": f"{q:.8f}"}
        if reduce_only: params["reduceOnly"] = "true"
        if position_side: params["positionSide"] = position_side.upper()
        return self._request("POST", "/fapi/v1/order", params, signed=True)

    # 옵션: 레버리지/포지션모드
    def futures_set_leverage(self, symbol: str, leverage: int):
        assert self.market == "futures"
        return self._request("POST", "/fapi/v1/leverage",
                             {"symbol": symbol.upper(), "leverage": int(leverage)}, signed=True)

    def futures_set_position_mode(self, hedge_mode: bool):
        assert self.market == "futures"
        return self._request("POST", "/fapi/v1/positionSide/dual",
                             {"dualSidePosition": "true" if hedge_mode else "false"}, signed=True)


# ========================== 사용 예시 ==========================
if __name__ == "__main__":
    KEY = os.getenv("BINANCE_API_KEY", "")
    SEC = os.getenv("BINANCE_API_SECRET", "")
    if not KEY or not SEC:
        raise SystemExit("환경변수 BINANCE_API_KEY / BINANCE_API_SECRET 설정 필요")

    # ---------- 스팟: 테스트넷 ----------
    spot = BinanceClient(KEY, SEC, market="spot", testnet=True)
    spot.sync_time()

    # 1) 스팟 시장가 매수 (USDT 사용 금액 지정) — BUY
    print("SPOT BUY MARKET (quote 10 USDT):",
          spot.spot_market_buy("BTCUSDT", quote_qty=10))

    # 2) 스팟 시장가 매도 (보유 BTC 수량 지정) — SELL
    #    * 테스트넷 계정에 BTC가 있어야 실행됨
    print("SPOT SELL MARKET (qty 0.0002):",
          spot.spot_market_sell("BTCUSDT", quantity=0.0002))

    # 3) 스팟 지정가 매수/매도
    px = spot.price("BTCUSDT")
    print("SPOT BUY LIMIT:",
          spot.spot_limit_buy("BTCUSDT", price=px*0.98, quantity=0.0002))
    print("SPOT SELL LIMIT:",
          spot.spot_limit_sell("BTCUSDT", price=px*1.02, quantity=0.0002))

    pct = 0.7  # 예: 0.7%로 조절
    px = spot.price("BTCUSDT")
    buy_price  = px * (1 - pct/100)
    sell_price = px * (1 + pct/100)

    spot.spot_limit_buy("BTCUSDT",  price=buy_price,  quantity=0.001)  # GTC
    spot.spot_limit_sell("BTCUSDT", price=sell_price, quantity=0.001)  # GTC


    # ---------- 선물: 테스트넷 ----------
    fut = BinanceClient(KEY, SEC, market="futures", testnet=True)
    fut.sync_time()
    fut.futures_set_leverage("BTCUSDT", 5)

    # 4) 선물 시장가 롱 진입(BUY) & 청산(SELL reduce-only)
    print("FUT LONG OPEN:",
          fut.futures_market_buy("BTCUSDT", quantity=0.001))
    print("FUT LONG CLOSE (reduce-only):",
          fut.futures_market_sell("BTCUSDT", quantity=0.001, reduce_only=True))

    # 5) 선물 시장가 숏 진입(SELL) & 청산(BUY reduce-only)
    print("FUT SHORT OPEN:",
          fut.futures_market_sell("BTCUSDT", quantity=0.001))
    print("FUT SHORT CLOSE (reduce-only):",
          fut.futures_market_buy("BTCUSDT", quantity=0.001, reduce_only=True))
