# roe_series_anti1003.py
# -*- coding: utf-8 -*-
import time, hmac, hashlib, asyncio, random
from typing import Any, Dict, List, Optional, Tuple

import aiohttp
from fastapi import APIRouter, Body, HTTPException, FastAPI
from fastapi.middleware.cors import CORSMiddleware

BINANCE_REST = "https://api.binance.com"  # SAPI는 api.binance.com
router = APIRouter()

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://tradinggear.co.kr",
        "http://localhost:3000", "http://127.0.0.1:3000"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------- 서명 ----------
def sign(query: str, secret: str) -> str:
    return hmac.new(secret.encode(), query.encode(), hashlib.sha256).hexdigest()

# ---------- 글로벌 동시성/스로틀 ----------
_sem = asyncio.Semaphore(3)          # 동시 요청 3개 제한 (원하면 조정)
_throttle_lock = asyncio.Lock()
_last_call = 0.0
_MIN_INTERVAL = 0.25                 # 각 요청 사이 최소 간격(초) — 250ms

async def _throttle():
    global _last_call
    async with _throttle_lock:
        now = time.monotonic()
        gap = now - _last_call
        if gap < _MIN_INTERVAL:
            await asyncio.sleep(_MIN_INTERVAL - gap)
        _last_call = time.monotonic()

# ---------- 간단 TTL 캐시 (리렌더 스파밍 방지) ----------
_cache: Dict[Tuple[str, str, int], Tuple[float, Any]] = {}  # (email,basis,limit) -> (expire_ts, data)
_CACHE_TTL = 5.0  # 초

def cache_get(key):
    item = _cache.get(key)
    if not item:
        return None
    expire, data = item
    if time.monotonic() > expire:
        _cache.pop(key, None)
        return None
    return data

def cache_set(key, data):
    _cache[key] = (time.monotonic() + _CACHE_TTL, data)

# ---------- -1003/429/418 방어용 공통 요청 함수 ----------
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
    - -1003/429/418 에서 지수 백오프 + 지터
    - Retry-After 헤더 있으면 우선 존중
    - Used-Weight 헤더 감지 시 추가 대기(보수적으로)
    - 동시성 제한 + 스로틀 적용
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
                    if r.status < 200 or r.status >= 300:
                        # 바이낸스 에러 파싱
                        try:
                            js = await r.json()
                        except Exception:
                            js = None
                        code = js.get("code") if isinstance(js, dict) else None
                        msg  = js.get("msg")  if isinstance(js, dict) else text

                        # 재시도 대상
                        is_retryable = (r.status in (418, 429)) or (code in (-1003,))
                        if is_retryable and attempt < max_tries:
                            # Retry-After 헤더 사용
                            ra = r.headers.get("Retry-After")
                            if ra:
                                try:
                                    wait = float(ra)
                                except Exception:
                                    wait = 0.0
                            else:
                                # Used Weight가 높으면 약간 더 쉼
                                used = r.headers.get("X-MBX-USED-WEIGHT-1M")
                                extra = 0.0
                                if used:
                                    try:
                                        used_i = int(used)
                                        # 1100 이상이면 3초 추가대기 (보수적으로)
                                        if used_i >= 1100:
                                            extra = 3.0
                                        elif used_i >= 900:
                                            extra = 1.0
                                    except Exception:
                                        pass
                                # 지수 백오프 + 풀 지터
                                wait = min(2 ** attempt, 60) + random.random() * 0.5 + extra
                            await asyncio.sleep(wait)
                            continue
                        # 그 외 에러 그대로 반환
                        raise HTTPException(status_code=r.status, detail=msg or "Binance error")

                    # 정상 응답
                    try:
                        return await r.json()
                    except Exception:
                        return text

            except HTTPException:
                raise
            except Exception as e:
                # 네트워크/타임아웃 등
                if attempt < max_tries:
                    wait = min(2 ** attempt, 60) + random.random() * 0.5
                    await asyncio.sleep(wait)
                    continue
                raise HTTPException(status_code=502, detail=str(e))

# ---------- API 키 조회 (기존 PHP 연동) ----------
async def fetch_keys_from_php(session: aiohttp.ClientSession, email: str):
    url = "https://tradinggear.co.kr:8081/tradinggear/member_inform_get.php"
    headers = {"Content-Type": "application/x-www-form-urlencoded"}
    data = {"email": email}
    js = await request_with_retry(session, "POST", url, headers=headers, data=data)
    try:
        api_key = js[0]["decrypted_api_key"]
        api_secret = js[0]["decrypted_api_secret"]
    except Exception:
        raise HTTPException(status_code=502, detail="Failed to fetch API keys")
    return api_key, api_secret

# ---------- 스냅샷 가져오기 ----------
async def fetch_futures_snapshots(
    session: aiohttp.ClientSession,
    api_key: str,
    api_secret: str,
    limit: int = 30,
) -> List[Tuple[int, float]]:
    """
    /sapi/v1/accountSnapshot?type=FUTURES
    assets[].marginBalance(USDT)을 사용
    """
    ts = int(time.time() * 1000)
    query = f"type=FUTURES&limit={limit}&timestamp={ts}"
    sig = sign(query, api_secret)
    url = f"{BINANCE_REST}/sapi/v1/accountSnapshot?{query}&signature={sig}"
    headers = {"X-MBX-APIKEY": api_key}
    js = await request_with_retry(session, "GET", url, headers=headers)

    if not isinstance(js, dict) or "snapshotVos" not in js:
        raise HTTPException(status_code=502, detail="Invalid snapshot response")

    out: List[Tuple[int, float]] = []
    for snap in js.get("snapshotVos", []):
        utime = snap.get("updateTime")  # ms
        data = snap.get("data", {})
        mb = None
        for a in data.get("assets", []):
            if a.get("asset") == "USDT":
                try:
                    mb = float(a.get("marginBalance"))
                except Exception:
                    mb = None
                break
        if utime and mb is not None:
            out.append((int(utime), mb))

    out.sort(key=lambda x: x[0])  # 오래된 -> 최신
    return out

from datetime import datetime, timezone, timedelta

KST = timezone(timedelta(hours=9))

# ---------- 손익률 시리즈 변환 ----------
def to_return_series(series: List[Tuple[int, float]], basis: str = "prev"):
    """
    [{time, value}] 로 변환. value = % 변화율
    basis:
      - "prev": 직전 대비
      - "start": 첫 스냅샷 대비
    """
    if not series:
        return []

    result: List[Dict[str, float]] = []
    if basis == "start":
        base = series[0][1]
        for t, bal in series:
            pct = ((bal - base) / base * 100.0) if base else 0.0
            date_str = datetime.fromtimestamp(t/1000, tz=timezone.utc).astimezone(KST).strftime("%Y-%m-%d  %H:%M")
            #result.append({"time": t, "value": date_str})
            result.append({"time": date_str, "value": pct})
    else:
        prev = None
        for t, bal in series:
            if prev is None:
                result.append({"time": t, "value": 0.0})
            else:
                pct = ((bal - prev) / prev * 100.0) if prev else 0.0
                date_str = datetime.fromtimestamp(t/1000, tz=timezone.utc).astimezone(KST).strftime("%Y-%m-%d  %H:%M")
                result.append({"time": date_str, "value": pct})
            prev = bal
    return result

# ---------- 라우트 ----------
@router.post("/roe/series")
async def roe_series(
    payload: Dict[str, Any] = Body(..., example={"email": "user@example.com", "basis": "prev", "limit": 30})
):
    """
    요청: { "email": "...", "basis": "prev"|"start", "limit": 30 }
    응답: {
      "asset": "USDT",
      "basis": "prev",
      "data": [ { "time": 1710000000000, "value": 1.23 }, ... ]
    }
    """
    email = str(payload.get("email", "") or "").strip()
    basis = str(payload.get("basis", "prev"))
    limit = int(payload.get("limit", 30) or 30)
    if not email:
        raise HTTPException(status_code=400, detail="email is required")

    cache_key = (email, basis, limit)
    cached = cache_get(cache_key)
    if cached is not None:
        return cached

    try:
        async with aiohttp.ClientSession() as session:
            api_key, api_secret = await fetch_keys_from_php(session, email)
            snaps = await fetch_futures_snapshots(session, api_key, api_secret, limit=limit)
            data = to_return_series(snaps, basis=basis)
            resp = {"asset": "USDT", "basis": basis, "data": data}
            cache_set(cache_key, resp)
            return resp
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=502, detail=str(e))