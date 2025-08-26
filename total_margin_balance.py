# futures_user_balance_ws.py
from fastapi import FastAPI
import asyncio, json, time, random, hmac, hashlib

from typing import Dict, Any, Tuple, Optional, List
from urllib.parse import urlencode

import aiohttp
#import websockets

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

FAPI = "https://fapi.binance.com"   # USDⓈ-M Futures REST
SAPI = "https://api.binance.com"    # Spot/SAPI (accountSnapshot)

# ------------------------------
# 서명/레이트리미터/안전 REST 호출
# ------------------------------
def _sign(params: Dict[str, Any], secret: str) -> str:
    qs = urlencode(params, doseq=True)
    return hmac.new(secret.encode(), qs.encode(), hashlib.sha256).hexdigest()

class RestLimiter:
    def __init__(self, weight_capacity: int = 2000):
        self.capacity = weight_capacity
        self.tokens = weight_capacity
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
    timeout: int = 10,
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
                retry_after = r.headers.get("Retry-After")

                if r.status < 400:
                    if "application/json" in (r.headers.get("Content-Type") or ""):
                        return await r.json()
                    return text

                if r.status in (418, 429):
                    delay = float(retry_after) if retry_after else backoff
                    await asyncio.sleep(min(max(delay, 1.0), 60.0) + random.uniform(0, 0.5))
                    backoff = min(backoff * 2, 60.0)
                    if attempt >= max_retries:
                        raise RuntimeError(f"Rate limited (HTTP {r.status}) after {attempt} tries: {text}")
                    continue

                # body code:-1003
                try:
                    js = json.loads(text)
                except Exception:
                    js = {}
                if isinstance(js, dict) and js.get("code") == -1003:
                    delay = float(retry_after) if retry_after else backoff
                    await asyncio.sleep(min(max(delay, 1.0), 60.0) + random.uniform(0, 0.5))
                    backoff = min(backoff * 2, 60.0)
                    if attempt >= max_retries:
                        raise RuntimeError(f"Binance -1003 after {attempt} tries: {js.get('msg')}")
                    continue

                if 500 <= r.status < 600 and attempt < max_retries:
                    await asyncio.sleep(backoff + random.uniform(0, 0.3))
                    backoff = min(backoff * 2, 30.0)
                    continue

                r.raise_for_status()

        except (aiohttp.ClientError, asyncio.TimeoutError):
            if attempt >= max_retries:
                raise
            await asyncio.sleep(backoff + random.uniform(0, 0.3))
            backoff = min(backoff * 2, 30.0)

# ------------------------------
# 키 조회 (기존 PHP 호출 사용)
# ------------------------------
async def fetch_keys_from_php(session: aiohttp.ClientSession, email: str) -> Tuple[str, str]:
    url = "https://tradinggear.co.kr:8081/tradinggear/member_inform_get.php"
    headers = {"Content-Type": "application/x-www-form-urlencoded"}
    data = {"email": email}
    js = await rest_call(session, "POST", url, headers=headers, data=data, weight=1)
    api_key = js[0]["decrypted_api_key"]
    api_secret = js[0]["decrypted_api_secret"]
    return api_key, api_secret

# ------------------------------
# 현재 totalMarginBalance
# ------------------------------
async def fetch_current_total_margin_balance(
    session: aiohttp.ClientSession, api_key: str, api_secret: str, limiter: RestLimiter
) -> float:
    params = {"timestamp": int(time.time() * 1000), "omitZeroBalances": "true"}
    params["signature"] = _sign(params, api_secret)
    headers = {"X-MBX-APIKEY": api_key}
    url = f"{FAPI}/fapi/v2/account"
    js = await rest_call(session, "GET", url, headers=headers, params=params, limiter=limiter, weight=10)
    return float(js.get("totalMarginBalance", 0.0))

# ------------------------------
# 전일(UTC 00:00) 스냅샷 total margin
# ------------------------------
async def fetch_yesterday_snapshot_total(
    session: aiohttp.ClientSession, api_key: str, api_secret: str, limiter: RestLimiter
) -> float:
    params = {
        "type": "FUTURES",
        "limit": 7,
        "timestamp": int(time.time() * 1000),
    }
    params["signature"] = _sign(params, api_secret)
    headers = {"X-MBX-APIKEY": api_key}
    url = f"{SAPI}/sapi/v1/accountSnapshot"

    js = await rest_call(session, "GET", url, headers=headers, params=params, limiter=limiter, weight=5)
    snaps: List[Dict[str, Any]] = js.get("snapshotVos", []) or []
    if not snaps:
        raise RuntimeError("No snapshot data returned.")

    snaps_sorted = sorted(snaps, key=lambda s: int(s.get("updateTime", 0)))
    now_ms = int(time.time() * 1000)
    day_ms = 24 * 60 * 60 * 1000
    today_mid = (now_ms // day_ms) * day_ms
    yday_mid = today_mid - day_ms

    cand = None
    for s in snaps_sorted:
        ut = int(s.get("updateTime", 0))
        if ut >= yday_mid:
            cand = s
            break
    if cand is None:
        cand = snaps_sorted[-1]

    data = cand.get("data", {}) or {}
    assets = data.get("assets", []) or []
    total_mb = 0.0
    for a in assets:
        if a.get("marginBalance") is not None:
            total_mb += float(a["marginBalance"])

    if total_mb == 0.0 and assets:
        for a in assets:
            if a.get("walletBalance") is not None:
                total_mb += float(a["walletBalance"])

    if total_mb <= 0:
        raise RuntimeError("Snapshot margin balance not found or zero.")
    return total_mb



from fastapi import FastAPI, APIRouter, Query, HTTPException, Body
router = APIRouter()
limiter = RestLimiter(weight_capacity=2000)




@router.api_route("/api/fapi/daily_change", methods=["POST"])
async def get_daily_change(email: str = Body(..., embed=True)):
    #try:
        async with aiohttp.ClientSession() as session:
            api_key, api_secret = await fetch_keys_from_php(session, email)
            current_total = await fetch_current_total_margin_balance(session, api_key, api_secret, limiter)
            yesterday_total = await fetch_yesterday_snapshot_total(session, api_key, api_secret, limiter)

        change_abs = current_total - yesterday_total
        change_pct = (change_abs / yesterday_total * 100.0) if yesterday_total != 0 else None

        return {
            "email": email,
            "current_total": current_total,
            "yesterday_total": yesterday_total,
            "change_abs": change_abs,
            "change_pct": change_pct,  # %
            "basis": {
                "current_source": "/fapi/v2/account.totalMarginBalance",
                "yesterday_source": "/sapi/v1/accountSnapshot(FUTURES).assets[].marginBalance",
                "yesterday_basis": "UTC 00:00 snapshot"
            }
        }
    #except Exception as e:
    #    raise HTTPException(status_code=502, detail=str(e))
    
