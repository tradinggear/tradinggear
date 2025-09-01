# screener_api.py
# FastAPI: Binance 심볼 스크리너 (Spot / Futures USDT-M)
#   uvicorn screener_api:app --host 0.0.0.0 --port 8001 --reload
#
# 사용 예:
#   /api/screener?market=futures&quote=USDT&min_quote_vol=100000000&min_change_pct=2&sort_by=changePct&limit=15
#   /api/screener?market=spot&quote=USDT&min_quote_vol=20000000&min_volatility_pct=3&limit=10

from fastapi import FastAPI, Query, HTTPException
from typing import Literal, Optional, List, Dict, Any
import requests, math

app = FastAPI(title="Binance Screener API")

SPOT_BASE    = "https://api.binance.com"
FUTURES_BASE = "https://fapi.binance.com"

session = requests.Session()
session.headers.update({"User-Agent": "tg-screener/1.0"})

def _get_json(url: str, params: Dict[str, Any] = None, timeout: int = 12):
    r = session.get(url, params=params or {}, timeout=timeout)
    if r.status_code != 200:
        raise HTTPException(r.status_code, r.text)
    return r.json()

def load_universe(market: Literal["spot", "futures"], quote: Optional[str] = None) -> Dict[str, Dict[str, Any]]:
    """exchangeInfo에서 거래가능 심볼 목록/메타데이터 수집"""
    if market == "spot":
        j = _get_json(f"{SPOT_BASE}/api/v3/exchangeInfo")
        syms = {}
        for s in j["symbols"]:
            if s.get("status") != "TRADING":
                continue
            if quote and s.get("quoteAsset") != quote.upper():
                continue
            # 스팟: isSpotTradingAllowed
            if not s.get("isSpotTradingAllowed", True):
                continue
            syms[s["symbol"]] = {
                "symbol": s["symbol"],
                "base": s["baseAsset"],
                "quote": s["quoteAsset"],
                "filters": {f["filterType"]: f for f in s.get("filters", [])},
            }
        return syms
    else:
        j = _get_json(f"{FUTURES_BASE}/fapi/v1/exchangeInfo")
        syms = {}
        for s in j["symbols"]:
            # 선물: 상태/퍼페추얼/쿼트 필터
            if s.get("status") != "TRADING":
                continue
            if s.get("contractType") != "PERPETUAL":
                continue
            if quote and s.get("quoteAsset") != quote.upper():
                continue
            syms[s["symbol"]] = {
                "symbol": s["symbol"],
                "base": s["baseAsset"],
                "quote": s["quoteAsset"],
                "filters": {f["filterType"]: f for f in s.get("filters", [])},
            }
        return syms

def load_24h_tickers(market: Literal["spot","futures"]) -> Dict[str, Dict[str, Any]]:
    """24시간 통계(가격/등락/볼륨)를 전심볼로 수집"""
    if market == "spot":
        arr = _get_json(f"{SPOT_BASE}/api/v3/ticker/24hr")
    else:
        arr = _get_json(f"{FUTURES_BASE}/fapi/v1/ticker/24hr")
    out = {}
    for x in arr:
        try:
            out[x["symbol"]] = {
                "symbol": x["symbol"],
                "lastPrice": float(x["lastPrice"]),
                "priceChangePercent": float(x.get("priceChangePercent", 0.0)),
                "quoteVolume": float(x.get("quoteVolume", 0.0)),  # USDT 거래대금에 해당
                "highPrice": float(x.get("highPrice", 0.0)),
                "lowPrice": float(x.get("lowPrice", 0.0)),
                "volume": float(x.get("volume", 0.0)),
                "count": int(x.get("count", 0)),
            }
        except Exception:
            continue
    return out

def compute_row(meta: Dict[str, Any], tkr: Dict[str, Any]) -> Dict[str, Any]:
    high, low = tkr["highPrice"], tkr["lowPrice"]
    # 변동성(%): (고가/저가 - 1) * 100  (저가=0 보호)
    vol_pct = 0.0
    if low > 0 and high > 0:
        vol_pct = (high / low - 1.0) * 100.0
    return {
        "symbol": tkr["symbol"],
        "base": meta["base"],
        "quote": meta["quote"],
        "price": tkr["lastPrice"],
        "changePct": tkr["priceChangePercent"],
        "quoteVolume": tkr["quoteVolume"],
        "volatilityPct": vol_pct,
        "trades": tkr["count"],
    }

#좋아! 바이낸스에서 특정 조건을 만족하는 심볼을 n개 고르는 REST API 예제를 준비했어.
#하나의 FastAPI 엔드포인트(/api/screener)로 Spot/Futures를 모두 지원하고, 거래대금(quoteVolume), 가격대, 변동성, 등락률 등으로 필터한 뒤 정렬해서 상위 n개만 반환해.
@app.get("/api/screener")
def screener(
    market: Literal["spot", "futures"] = Query("futures"),
    quote: Optional[str] = Query("USDT", description="원하는 견적자산(예: USDT)"),
    # ---- 필터 ----
    min_quote_vol: float = Query(0.0, description="24h 거래대금(quoteVolume) 하한 (예: 5e7 = 50,000,000)"),
    min_price: Optional[float] = Query(None),
    max_price: Optional[float] = Query(None),
    min_change_pct: Optional[float] = Query(None, description="24h 등락률 하한(%)"),
    max_change_pct: Optional[float] = Query(None, description="24h 등락률 상한(%)"),
    min_volatility_pct: Optional[float] = Query(None, description="(고가/저가 - 1)*100"),
    name_contains: Optional[str] = Query(None, description="심볼 문자열 포함 필터, 예: BTC / ETH"),
    # ---- 정렬/개수 ----
    sort_by: Literal["quoteVolume","changePct","volatilityPct","price"] = Query("quoteVolume"),
    sort_dir: Literal["desc","asc"] = Query("desc"),
    limit: int = Query(20, ge=1, le=200),
):
    # 1) 유니버스
    universe = load_universe(market, quote=quote)
    if not universe:
        return {"items": [], "count": 0, "note": "empty universe"}

    # 2) 24h 데이터
    t24 = load_24h_tickers(market)

    # 3) 조인 + 파생지표
    rows: List[Dict[str, Any]] = []
    for sym, meta in universe.items():
        tkr = t24.get(sym)
        if not tkr:
            continue
        row = compute_row(meta, tkr)

        # 4) 필터
        if row["quoteVolume"] < min_quote_vol:
            continue
        if min_price is not None and row["price"] < min_price:
            continue
        if max_price is not None and row["price"] > max_price:
            continue
        if min_change_pct is not None and row["changePct"] < min_change_pct:
            continue
        if max_change_pct is not None and row["changePct"] > max_change_pct:
            continue
        if min_volatility_pct is not None and row["volatilityPct"] < min_volatility_pct:
            continue
        if name_contains and (name_contains.upper() not in row["symbol"].upper()):
            continue

        rows.append(row)

    # 5) 정렬
    reverse = (sort_dir == "desc")
    rows.sort(key=lambda x: x.get(sort_by, 0.0), reverse=reverse)

    # 6) 상위 n개
    items = rows[:limit]
    return {
        "market": market,
        "quote": quote,
        "filters": {
            "min_quote_vol": min_quote_vol,
            "min_price": min_price,
            "max_price": max_price,
            "min_change_pct": min_change_pct,
            "max_change_pct": max_change_pct,
            "min_volatility_pct": min_volatility_pct,
            "name_contains": name_contains,
        },
        "sort": {"by": sort_by, "dir": sort_dir},
        "count": len(items),
        "items": items,
    }
