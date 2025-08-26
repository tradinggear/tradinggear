from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from binance_analyzer import get_user_api_keys, get_futures_positions, analyze_positions
from strategy2 import router as strategy_router
from binance_portfolio5 import router as binance_portfolio_router
from run_pnl_single_url import router as binance_run_pnl_single_url_router
from fapi_pnl_api import router as binance_fapi_pnl_api_router
from fapi_positions_count_api import router as binance_fapi_positions_count_api_router
from fapi_recent_trades_api import router as binance_fapi_recent_trades_api_router
from roe_series import router as binance_roe_series_router
from fapi_portfolio import router as binance_fapi_portfolio_router

from total_margin_balance import router as binance_total_margin_balance_router

from test import router as test

app = FastAPI()

# ✅ CORS 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://tradinggear.co.kr"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ 포지션 분석 API
@app.get("/run")
def run_analysis2(email: str):
    try:
        api_key, api_secret = get_user_api_keys(email)
        positions = get_futures_positions(api_key, api_secret)

        if not isinstance(positions, list):
            return {"error": "Binance API 오류", "raw": positions}

        portfolio = analyze_positions(positions)
        return {
            "email": email,
            "portfolio": portfolio
        }

    except Exception as e:
        return {"error": str(e)}

# ✅ 전략 분석 라우터 추가 (/api/visual_signals_full_v2 포함)
app.include_router(strategy_router)
app.include_router(binance_portfolio_router)

app.include_router(binance_run_pnl_single_url_router)
app.include_router(binance_total_margin_balance_router)
app.include_router(binance_fapi_pnl_api_router)
app.include_router(binance_fapi_positions_count_api_router)
app.include_router(binance_fapi_recent_trades_api_router)
app.include_router(binance_roe_series_router)
app.include_router(binance_fapi_portfolio_router)



app.include_router(test)


