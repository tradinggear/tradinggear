# fapi_recent_trades_api.py
import asyncio, time, json, random, hmac, hashlib
from typing import Dict, Any, Optional, Tuple, List
from itertools import chain
from urllib.parse import urlencode

import aiohttp
from fastapi import FastAPI, APIRouter, Request, Query, HTTPException, Body
from fastapi.middleware.cors import CORSMiddleware

FAPI = "https://fapi.binance.com"

# -------------------------------
# 서명 / 서버시간 오프셋 / 리미터
# -------------------------------
def _sign(params: Dict[str, Any], secret: str) -> str:
    qs = urlencode(params, doseq=True)
    return hmac.new(secret.encode(), qs.encode(), hashlib.sha256).hexdigest()

async def get_time_offset_ms(session: aiohttp.ClientSession) -> int:
    # futures 서버 시간 기준
    async with session.get(f"{FAPI}/fapi/v1/time", timeout=10) as r:
        r.raise_for_status()
        js = await r.json()
    server_time = int(js["serverTime"])
    local_now = int(time.time() * 1000)
    return server_time - local_now

class RestLimiter:
    """ 간단 토큰버킷 (1분 한도). 공용으로 넉넉히 2000 권장 """
    def __init__(self, capacity: int = 2000):
        self.capacity = capacity
        self.tokens = capacity
        self.last = time.monotonic()
    def _refill(self):
        now = time.monotonic()
        dt = now - self.last
        self.last = now
        self.tokens = min(self.capacity, self.tokens + (self.capacity / 60.0) * dt)
    async def acquire(self, weight: int = 1):
        while True:
            self._refill()
            if self.tokens >= weight:
                self.tokens -= weight
                return
            need = weight - self.tokens
            wait = need / (self.capacity / 60.0)
            await asyncio.sleep(min(max(wait, 0.05), 2.0))

async def rest_call(
    session: aiohttp.ClientSession,
    method: str,
    url: str,
    *,
    headers: Optional[Dict[str, str]] = None,
    params: Optional[Dict[str, Any]] = None,
    data: Optional[Any] = None,
    weight: int = 1,
    limiter: Optional[RestLimiter] = None,
    max_retries: int = 6,
    timeout: int = 12,
):
    if params:
        url = f"{url}?{urlencode(params)}"

    attempt, backoff = 0, 1.0
    while True:
        attempt += 1
        if limiter:
            await limiter.acquire(weight)
        try:
            async with session.request(method, url, headers=headers, data=data, timeout=timeout) as r:
                text = await r.text()
                ctype = r.headers.get("Content-Type") or ""
                # 성공
                if r.status < 400:
                    return await r.json() if "application/json" in ctype else text
                # 418/429 또는 body code:-1003 → 레이트 제한 취급
                retry_after = r.headers.get("Retry-After")
                delay = float(retry_after) if retry_after else backoff
                try:
                    body = json.loads(text)
                except Exception:
                    body = {}
                if r.status in (418, 429) or (isinstance(body, dict) and body.get("code") == -1003):
                    await asyncio.sleep(min(max(delay, 1.0), 60.0) + random.uniform(0, 0.5))
                    backoff = min(backoff * 2, 60.0)
                    if attempt >= max_retries:
                        raise RuntimeError(f"Rate limited ({r.status}): {text[:300]}")
                    continue
                # 5xx → 재시도
                if 500 <= r.status < 600 and attempt < max_retries:
                    await asyncio.sleep(backoff + random.uniform(0, 0.3))
                    backoff = min(backoff * 2, 30.0)
                    continue
                # 기타 에러
                raise RuntimeError(f"HTTP {r.status}: {text[:500]}")
        except (aiohttp.ClientError, asyncio.TimeoutError):
            if attempt >= max_retries:
                raise
            await asyncio.sleep(backoff + random.uniform(0, 0.3))
            backoff = min(backoff * 2, 30.0)

# -------------------------------
# 키 조회 (당신의 기존 PHP 엔드포인트 사용)
# -------------------------------
async def fetch_keys_from_php(session: aiohttp.ClientSession, email: str) -> Tuple[str, str]:
    url = "https://tradinggear.co.kr:8081/tradinggear/member_inform_get.php"
    headers = {"Content-Type": "application/x-www-form-urlencoded"}
    data = {"email": email}
    js = await rest_call(session, "POST", url, headers=headers, data=data, weight=1)
    if not isinstance(js, list) or not js or "decrypted_api_key" not in js[0]:
        raise RuntimeError(f"Key endpoint returned invalid JSON: {str(js)[:200]}")
    return js[0]["decrypted_api_key"], js[0]["decrypted_api_secret"]

# -------------------------------
# 현재 심볼 레버리지 (positionRisk에서 가져와 사용)
# -------------------------------
async def fetch_symbol_leverage(
    session: aiohttp.ClientSession, api_key: str, api_secret: str, limiter: RestLimiter, time_offset_ms: int, symbol: str
) -> Optional[float]:
    params = {"recvWindow": 60000, "timestamp": int(time.time()*1000) + time_offset_ms}
    params["signature"] = _sign(params, api_secret)
    headers = {"X-MBX-APIKEY": api_key}
    url = f"{FAPI}/fapi/v2/positionRisk"
    lst = await rest_call(session, "GET", url, headers=headers, params=params, limiter=limiter, weight=10)
    if isinstance(lst, list):
        for row in lst:
            if row.get("symbol") == symbol:
                try:
                    return float(row.get("leverage", 0)) or None
                except Exception:
                    return None
    return None

# -------------------------------
# 유저 최근 체결(트레이드) 조회
# -------------------------------
async def fetch_user_trades(
    session: aiohttp.ClientSession,
    api_key: str, api_secret: str,
    limiter: RestLimiter,
    time_offset_ms: int,
    symbol: str,
    limit: int = 50,
    start_time: Optional[int] = None,
    end_time: Optional[int] = None,
) -> List[Dict[str, Any]]:
    params: Dict[str, Any] = {
        "symbol": symbol,
        "limit": max(1, min(limit, 1000)),  # Binance limit 범위
        "recvWindow": 60000,
        "timestamp": int(time.time() * 1000) + time_offset_ms,
    }
    if start_time: params["startTime"] = int(start_time)
    if end_time:   params["endTime"] = int(end_time)
    params["signature"] = _sign(params, api_secret)
    headers = {"X-MBX-APIKEY": api_key}
    url = f"{FAPI}/fapi/v1/userTrades"
    js = await rest_call(session, "GET", url, headers=headers, params=params, limiter=limiter, weight=10)
    if not isinstance(js, list):
        raise RuntimeError(f"/fapi/v1/userTrades non-list: {str(js)[:200]}")
    return js

def map_to_recent_trades_array(
    trades: List[Dict[str, Any]], symbol: str, leverage: Optional[float]
) -> List[Dict[str, Any]]:
    out: List[Dict[str, Any]] = []
    for t in trades:
        price = float(t.get("price", 0.0))
        qty   = float(t.get("qty",   0.0))
        pnl   = float(t.get("realizedPnl", 0.0)) if t.get("realizedPnl") is not None else 0.0
        lev   = leverage or 0.0
        init_margin_est = (abs(price * qty) / lev) if (lev and price and qty) else None
        roe = (pnl / init_margin_est * 100.0) if (init_margin_est and init_margin_est != 0) else None

        out.append({
            "id": t.get("orderId"),
            "symbol": t.get("symbol", symbol),
            "type": t.get("side"),              # BUY / SELL
            "price": price,
            "time":  int(t.get("time", 0)),
            "amount": qty,
            "profitRate": roe,                  # 없으면 null
            # 참고로 실현손익 자체도 함께 전달해두면 좋음
            "realizedPnl": pnl,
            "positionSide": t.get("positionSide"),  # BOTH/LONG/SHORT (헤지모드)
            "maker": t.get("maker"),
        })
    return out

# -------------------------------
# FastAPI
# -------------------------------
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://tradinggear.co.kr"],  # 필요 시 조정
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
router = APIRouter()
limiter = RestLimiter(capacity=2000)

# 포지션에서 "보유중" 심볼 및 레버리지 맵 얻기
async def fetch_open_symbols_and_leverage(
    session: aiohttp.ClientSession,
    api_key: str, api_secret: str,
    time_offset_ms: int
) -> Tuple[List[Dict[str, Any]], List[str], Dict[str, float]]:
    params = {"recvWindow": 60000, "timestamp": int(time.time()*1000) + time_offset_ms}
    params["signature"] = _sign(params, api_secret)
    headers = {"X-MBX-APIKEY": api_key}
    url = f"{FAPI}/fapi/v2/positionRisk"

    pos_list = await rest_call(session, "GET", url, headers=headers, params=params, limiter=limiter, weight=10)
    if not isinstance(pos_list, list):
        raise RuntimeError(f"/positionRisk non-list: {str(pos_list)[:200]}")

    # 보유중: abs(positionAmt) > 0
    open_rows = [p for p in pos_list if abs(float(p.get("positionAmt", 0) or 0)) > 1e-12]
    symbols: List[str] = sorted({row.get("symbol") for row in open_rows if row.get("symbol")})

    # 심볼 → 레버리지 매핑 (헤지모드여도 동일 레버리지 가정)
    lev_map: Dict[str, float] = {}
    for row in open_rows:
        sym = row.get("symbol")
        try:
            lev = float(row.get("leverage", 0) or 0)
        except Exception:
            lev = 0.0
        if sym and sym not in lev_map and lev > 0:
            lev_map[sym] = lev

    return open_rows, symbols, lev_map

@router.api_route("/recent-trades/all/flat", methods=["POST"])
async def recent_trades_all_flat(
    request: Request,
    email: Optional[str] = Body(None, description="키 조회용 이메일"),
    limitPerSymbol: int = Body(20, ge=1, le=1000),
    startTime: Optional[int] = Body(None),
    endTime: Optional[int] = Body(None),
    maxSymbols: int = Body(20, ge=1, le=100),   # 과도 호출 방지
    sortDesc: bool = Body(True, description="시간 내림차순 정렬"),
):
    if not email:
        raise HTTPException(status_code=422, detail="Missing 'email'.")

    try:
        async with aiohttp.ClientSession() as session:
            # 1) 키 + 시간오프셋 동기화
            api_key, api_secret = await fetch_keys_from_php(session, email)
            offset = await get_time_offset_ms(session)

            # 2) 보유중 심볼 & 레버리지 맵 (abs(positionAmt) > 0)
            _, symbols, lev_map = await fetch_open_symbols_and_leverage(session, api_key, api_secret, offset)
            if not symbols:
                return {"ok": True, "email": email, "count": 0, "recentTradesArray": []}

            symbols = symbols[:maxSymbols]

            # 3) 심볼별 최근 체결 동시 조회(동시성 제한으로 -1003 방어)
            sem = asyncio.Semaphore(4)

            async def fetch_one(sym: str):
                async with sem:
                    trades = await fetch_user_trades(
                        session, api_key, api_secret, limiter, offset,
                        symbol=sym, limit=limitPerSymbol, start_time=startTime, end_time=endTime
                    )
                    lev = lev_map.get(sym)
                    # 👉 여기서 바로 필요한 형태로 매핑: { id, symbol, type, price, time, amount, profitRate }
                    return map_to_recent_trades_array(trades, sym, lev)

            tasks = [fetch_one(sym) for sym in symbols]
            results = await asyncio.gather(*tasks, return_exceptions=True)

        # 4) 평탄화(flatten) + 시간 정렬
        arrays: List[List[Dict[str, Any]]] = []
        errors: Dict[str, str] = {}
        for i, res in enumerate(results):
            if isinstance(res, Exception):
                errors[symbols[i]] = str(res)
            else:
                arrays.append(res)

        recentTradesArray: List[Dict[str, Any]] = list(chain.from_iterable(arrays))
        if sortDesc:
            recentTradesArray.sort(key=lambda x: x.get("time", 0), reverse=True)

        # ✅ 최종 리턴 형태 (요청하신 구조)
        return {
            "ok": True if not errors else "partial",
            "email": email,
            "count": len(recentTradesArray),
            "recentTradesArray": [
                {
                    "id": item.get("id"),               # = orderId
                    "symbol": item.get("symbol"),
                    "type": item.get("type"),           # BUY / SELL
                    "price": item.get("price"),
                    "time": item.get("time"),
                    "amount": item.get("amount"),
                    "profitRate": item.get("profitRate")  # 추정 ROE% (없으면 null)
                }
                for item in recentTradesArray
            ],
            "errors": errors or None,
        }

    except Exception as e:
        return {"ok": False, "error": str(e)}

#app.include_router(router)

# 실행:
# uvicorn fapi_recent_trades_api:app --host 0.0.0.0 --port 777
