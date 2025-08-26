# fapi_portfolio_anti1003.py
# -*- coding: utf-8 -*-
import time, hmac, hashlib, asyncio, random
from typing import Any, Dict, List, Optional

import aiohttp
from fastapi import APIRouter, Request, HTTPException, FastAPI
from fastapi.middleware.cors import CORSMiddleware

router = APIRouter()

BINANCE_REST_FAPI = "https://fapi.binance.com"
PHP_KEYS_URL = "https://tradinggear.co.kr:8081/tradinggear/member_inform_get.php"

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://tradinggear.co.kr",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------- 서명 ----------
def sign(query: str, secret: str) -> str:
    return hmac.new(secret.encode(), query.encode(), hashlib.sha256).hexdigest()

# ---------- 글로벌 동시성/스로틀 ----------
_sem = asyncio.Semaphore(3)     # 동시 요청 제한
_throttle_lock = asyncio.Lock()
_last_call = 0.0
_MIN_INTERVAL = 0.25            # 연속 호출 최소 간격(초) — 250ms

async def _throttle():
    global _last_call
    async with _throttle_lock:
        now = time.monotonic()
        gap = now - _last_call
        if gap < _MIN_INTERVAL:
            await asyncio.sleep(_MIN_INTERVAL - gap)
        _last_call = time.monotonic()

# ---------- -1003/429/418 방어 공통 요청 ----------
async def request_with_retry(
    session: aiohttp.ClientSession,
    method: str,
    url: str,
    *,
    headers: Optional[Dict[str, str]] = None,
    params: Optional[Dict[str, Any]] = None,
    data: Any = None,
    max_tries: int = 6,
):
    """
    - -1003 / 429 / 418: 지수 백오프 + 지터, Retry-After 헤더 존중
    - X-MBX-USED-WEIGHT-1M 높으면 추가 대기
    - 동시성 제한 + 스로틀
    """
    attempt = 0
    async with _sem:
        while True:
            attempt += 1
            await _throttle()
            try:
                async with session.request(method, url, headers=headers, params=params, data=data, timeout=20) as r:
                    text = await r.text()

                    # 2xx만 정상
                    if not (200 <= r.status < 300):
                        try:
                            js = await r.json()
                        except Exception:
                            js = None
                        code = js.get("code") if isinstance(js, dict) else None
                        msg  = js.get("msg")  if isinstance(js, dict) else text

                        is_retryable = (r.status in (418, 429)) or (code in (-1003,))
                        if is_retryable and attempt < max_tries:
                            # Retry-After 우선
                            ra = r.headers.get("Retry-After")
                            if ra:
                                try:
                                    wait = float(ra)
                                except Exception:
                                    wait = 0.0
                            else:
                                # Used-Weight 기반 추가 대기
                                used = r.headers.get("X-MBX-USED-WEIGHT-1M")
                                extra = 0.0
                                if used:
                                    try:
                                        u = int(used)
                                        if u >= 1100:
                                            extra = 3.0
                                        elif u >= 900:
                                            extra = 1.0
                                    except Exception:
                                        pass
                                # 지수 백오프 + 지터
                                wait = min(2 ** attempt, 60) + random.random() * 0.5 + extra
                            await asyncio.sleep(wait)
                            continue

                        raise HTTPException(status_code=r.status, detail=msg or "Binance error")

                    # 정상
                    try:
                        return await r.json()
                    except Exception:
                        return text

            except HTTPException:
                raise
            except Exception as e:
                if attempt < max_tries:
                    wait = min(2 ** attempt, 60) + random.random() * 0.5
                    await asyncio.sleep(wait)
                    continue
                raise HTTPException(status_code=502, detail=str(e))

# ---------- API 키 조회 (PHP) ----------
async def fetch_keys_from_php(session: aiohttp.ClientSession, email: str):
    headers = {"Content-Type": "application/x-www-form-urlencoded"}
    data = {"email": email}
    js = await request_with_retry(session, "POST", PHP_KEYS_URL, headers=headers, data=data)
    try:
        api_key = js[0]["decrypted_api_key"]
        api_secret = js[0]["decrypted_api_secret"]
    except Exception:
        raise HTTPException(status_code=502, detail="Failed to fetch API keys")
    return api_key, api_secret

# ---------- 포지션 조회 ----------
async def fetch_position_risk(session: aiohttp.ClientSession, api_key: str, api_secret: str):
    ts = int(time.time() * 1000)
    query = f"timestamp={ts}"
    sig = sign(query, api_secret)
    url = f"{BINANCE_REST_FAPI}/fapi/v2/positionRisk?{query}&signature={sig}"
    headers = {"X-MBX-APIKEY": api_key}
    return await request_with_retry(session, "GET", url, headers=headers)

# ---------- 포트폴리오 변환 ----------
def to_portfolio(positions: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """
    entryPrice, markPrice, positionAmt 기준으로
    - 평가금액(evaluationAmount) = |positionAmt| * markPrice
    - 손익(profit) = (markPrice - entryPrice) * positionAmt  (롱/숏 방향 포함)
    - 손익률(profitRate) = profit / (entryPrice * |positionAmt|) * 100
    """
    # 보유 중(포지션 수량 ≠ 0)만
    active = [p for p in positions if abs(float(p.get("positionAmt", "0") or 0)) > 0]

    result = []
    for idx, p in enumerate(active, start=1):
        position_amt = float(p.get("positionAmt", "0") or 0.0)    # +롱 / -숏
        qty = abs(position_amt)
        mark = float(p.get("markPrice", "0") or 0.0)
        entry = float(p.get("entryPrice", "0") or 0.0)

        evaluation_amount = mark * qty
        profit = (mark - entry) * position_amt
        profit_rate = (profit / (entry * qty) * 100.0) if (entry > 0 and qty > 0) else 0.0

        state = "neutral"
        if profit > 0:
            state = "profit"
        elif profit < 0:
            state = "loss"

        result.append({
            "id": idx,
            "symbol": p.get("symbol"),
            "currentPrice": mark,
            "averagePrice": entry,
            "quantity": qty,
            "evaluationAmount": evaluation_amount,
            "profit": profit,
            "profitRate": profit_rate,
            "state": state
        })
    return result

# ---------- 라우트 (email만 입력) ----------
@router.post("/fapi/portfolio")
async def fapi_portfolio(request: Request):
    """
    입력(택1):
      - JSON: {"email":"user@domain.com"}
      - x-www-form-urlencoded: email=user@domain.com
      - 쿼리스트링: /fapi/portfolio?email=user@domain.com
    응답: [ { id, symbol, currentPrice, averagePrice, quantity, evaluationAmount, profit, profitRate, state }, ... ]
    """
    ct = (request.headers.get("content-type") or "").lower()
    if "application/json" in ct:
        body = await request.json()
        email = str(body.get("email", "")).strip()
    elif "application/x-www-form-urlencoded" in ct or "multipart/form-data" in ct:
        form = await request.form()
        email = str(form.get("email", "")).strip()
    else:
        email = str(request.query_params.get("email", "")).strip()

    if not email:
        raise HTTPException(status_code=400, detail="email is required")

    try:
        async with aiohttp.ClientSession() as session:
            api_key, api_secret = await fetch_keys_from_php(session, email)
            positions = await fetch_position_risk(session, api_key, api_secret)

            if not isinstance(positions, list):
                # 바이낸스가 {code,msg}로 줄 때 대비
                raise HTTPException(status_code=502, detail=f"Binance response: {positions}")

            portfolio = to_portfolio(positions)
            return portfolio  # ← JSON 배열로 반환 (Remix 코드와 동일한 형태)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=502, detail=str(e))