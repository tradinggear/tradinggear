# fapi_pnl_api.py
import asyncio, time, json, random, hmac, hashlib
from typing import Dict, Any, Optional, Tuple, List
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
    """ 간단 토큰버킷 (1분 한도 기준). futures 공용은 넉넉히 2000 권장 """
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
        except (aiohttp.ClientError, asyncio.TimeoutError) as e:
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
# 포지션 리스크 조회 & PnL/ROI 계산
# -------------------------------
async def fetch_position_risk(
    session: aiohttp.ClientSession,
    api_key: str, api_secret: str,
    limiter: RestLimiter,
    time_offset_ms: int = 0,
) -> List[Dict[str, Any]]:
    # 문서 기준 weight 보수적으로 10 사용
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

def compute_pnl_roi(position_list: List[Dict[str, Any]]) -> Dict[str, Any]:
    rows = []
    total_pnl = 0.0
    total_im  = 0.0

    for p in position_list:
        # 수량 0(미보유) 필터
        qty = float(p.get("positionAmt", 0.0))
        if abs(qty) < 1e-12:
            continue

        entry = float(p.get("entryPrice", 0.0)) or 0.0
        mark  = float(p.get("markPrice", 0.0)) or 0.0
        lev   = float(p.get("leverage", 0.0)) or 0.0
        u_pnl = float(p.get("unRealizedProfit", 0.0))  # 바이낸스 제공 평가손익
        symbol = p.get("symbol", "")
        side = "LONG" if qty > 0 else "SHORT"

        # 초기증거금(이론치): abs(entryPrice * qty)/leverage
        init_margin = (abs(entry * qty) / lev) if (lev > 0 and entry > 0 and abs(qty) > 0) else None

        # ROI% = PnL / 초기증거금 * 100 (초기증거금이 0이면 계산 생략)
        roi_pct = (u_pnl / init_margin * 100.0) if (init_margin and init_margin != 0) else None

        rows.append({
            "symbol": symbol,
            "side": side,
            "qty": qty,
            "entryPrice": entry,
            "markPrice": mark,
            "leverage": lev,
            "unRealizedProfit": u_pnl,
            "initialMargin_est": init_margin,
            "roi_pct": roi_pct,
            "marginType": p.get("marginType"),
            "isolatedMargin": float(p.get("isolatedMargin", 0.0)) if p.get("isolatedMargin") is not None else None,
            "updateTime": int(p.get("updateTime", 0)) if p.get("updateTime") is not None else None,
        })

        total_pnl += u_pnl
        if init_margin:
            total_im += init_margin

    total_roi = (total_pnl / total_im * 100.0) if total_im > 0 else None
    return {
        "positions": rows,
        "totals": {
            "unRealizedProfit": total_pnl,
            "initialMargin_est": total_im,
            "roi_pct": total_roi
        }
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

@router.api_route("/api/fapi/pnl", methods=["GET", "POST"])
async def pnl_api(request: Request, email: Optional[str] = Query(None)):
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
            # 서버 시간 오프셋 동기화
            offset = await get_time_offset_ms(session)
            # 포지션 리스크 조회
            pos_list = await fetch_position_risk(session, api_key, api_secret, limiter, time_offset_ms=offset)
        # 평가손익/ROI 계산
        out = compute_pnl_roi(pos_list)

        return {
            "ok": True,
            "email": email,
            "ts": int(time.time() * 1000),
            "pnl": out["positions"],
            "totals": out["totals"],
            "basis": {
                "source": "/fapi/v2/positionRisk",
                "pnl_field": "unRealizedProfit",
                "roi_formula": "ROI% = PnL * leverage / (abs(entryPrice * qty)) * 100",
                "note": "isolated/cross 공통, 초기증거금은 이론치(엔트리 기준)"
            }
        }
    except Exception as e:
        # 디버그용 상세 에러를 그대로 반환(운영에선 502로 감싸도 됨)
        return {"ok": False, "error": str(e)}