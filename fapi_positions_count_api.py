# fapi_positions_count_api.py
import asyncio, time, json, random, hmac, hashlib
from typing import Dict, Any, Optional, Tuple, List, Set
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
    # 서버시간 - 로컬시간
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
                if r.status < 400:
                    return await r.json() if "application/json" in ctype else text

                # 418/429, body code:-1003 → 레이트 제한 취급
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

                raise RuntimeError(f"HTTP {r.status}: {text[:500]}")
        except (aiohttp.ClientError, asyncio.TimeoutError):
            if attempt >= max_retries:
                raise
            await asyncio.sleep(backoff + random.uniform(0, 0.3))
            backoff = min(backoff * 2, 30.0)

# -------------------------------
# 키 조회 (기존 PHP 엔드포인트 사용)
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
# 포지션 리스크 → 보유종목 카운트
# -------------------------------
async def fetch_position_risk(
    session: aiohttp.ClientSession,
    api_key: str, api_secret: str,
    limiter: RestLimiter,
    time_offset_ms: int = 0,
) -> List[Dict[str, Any]]:
    # 문서 기준 weight 여유 있게 10 사용
    params = {
        "recvWindow": 60000,
        "timestamp": int(time.time() * 1000) + time_offset_ms,
    }
    params["signature"] = _sign(params, api_secret)
    headers = {"X-MBX-APIKEY": api_key}
    url = f"{FAPI}/fapi/v2/positionRisk"
    js = await rest_call(session, "GET", url, headers=headers, params=params, limiter=limiter, weight=10)
    if not isinstance(js, list):
        raise RuntimeError(f"/positionRisk non-list: {str(js)[:200]}")
    return js

def count_holdings(position_list: List[Dict[str, Any]]) -> Dict[str, Any]:
    # 보유 기준: abs(positionAmt) > 0
    open_rows: List[Dict[str, Any]] = []
    for p in position_list:
        qty = float(p.get("positionAmt", 0.0))
        if abs(qty) > 1e-12:
            # side/positionSide 보조 정보
            side = "LONG" if qty > 0 else "SHORT"
            open_rows.append({
                "symbol": p.get("symbol", ""),
                "positionAmt": qty,
                "positionSide": p.get("positionSide"),  # BOTH/LONG/SHORT (헤지 모드 참고)
                "leverage": float(p.get("leverage", 0.0)) if p.get("leverage") is not None else None,
                "entryPrice": float(p.get("entryPrice", 0.0)) if p.get("entryPrice") is not None else None,
                "unRealizedProfit": float(p.get("unRealizedProfit", 0.0)) if p.get("unRealizedProfit") is not None else None,
                "side": side,
            })

    positions_count = len(open_rows)  # 라인 수 (헤지 모드면 심볼당 2줄일 수 있음)
    unique_symbols: Set[str] = {r["symbol"] for r in open_rows}
    unique_symbols_count = len(unique_symbols)

    longs_count  = sum(1 for r in open_rows if r["side"] == "LONG")
    shorts_count = sum(1 for r in open_rows if r["side"] == "SHORT")

    # 심볼별 요약(원하시면 제거 가능)
    per_symbol = {}
    for r in open_rows:
        sym = r["symbol"]
        per_symbol.setdefault(sym, {"long": 0, "short": 0})
        if r["side"] == "LONG":
            per_symbol[sym]["long"] += 1
        else:
            per_symbol[sym]["short"] += 1

    return {
        "positions_count": positions_count,
        "unique_symbols_count": unique_symbols_count,
        "longs_count": longs_count,
        "shorts_count": shorts_count,
        "symbols": sorted(list(unique_symbols)),
        "rows": open_rows,          # 상세 라인(필요 없으면 주석 처리)
        "per_symbol": per_symbol,   # 심볼별(필요 없으면 주석 처리)
    }

# -------------------------------
# FastAPI
# -------------------------------
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://tradinggear.co.kr"],  # 필요 시 도메인 조정
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
router = APIRouter()
limiter = RestLimiter(capacity=2000)

@router.api_route("/api/fapi/holdings/count", methods=["GET", "POST"])
async def holdings_count_api(request: Request, email: Optional[str] = Query(None)):
    # email 추출 (쿼리/JSON/폼 모두 허용)
    if request.method == "POST" and not email:
        ctype = request.headers.get("content-type", "")
        if "application/json" in ctype:
            try:
                body = await request.json()
            except Exception:
                body = {}
            email = (body or {}).get("email")
        elif "application/x-www-form-urlencoded" in ctype or "multipart/form-data" in ctype:
            form = await request.form()
            email = form.get("email")

    if not email:
        raise HTTPException(status_code=422, detail="Missing 'email' in query, JSON body, or form data.")

    try:
        async with aiohttp.ClientSession() as session:
            api_key, api_secret = await fetch_keys_from_php(session, email)
            offset = await get_time_offset_ms(session)  # 타임스탬프 오차 보정
            pos_list = await fetch_position_risk(session, api_key, api_secret, limiter, time_offset_ms=offset)
        summary = count_holdings(pos_list)
        return {
            "ok": True,
            "email": email,
            "ts": int(time.time() * 1000),
            **summary,
            "basis": {
                "source": "/fapi/v2/positionRisk",
                "holding_rule": "abs(positionAmt) > 0",
                "hedge_mode_note": "Hedge Mode에서는 한 심볼에 LONG/SHORT 라인이 분리되어 positions_count가 2가 될 수 있음. unique_symbols_count는 심볼 고유 개수."
            }
        }
    except Exception as e:
        # 디버깅 편의상 상세 오류 반환(운영에선 502로 감싸도 OK)
        return {"ok": False, "error": str(e)}

#app.include_router(router)

# 실행:
# uvicorn fapi_positions_count_api:app --host 0.0.0.0 --port 777
