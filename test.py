# tradinggear_strategy_backend_optimized.py

from fastapi import FastAPI
from typing import List, Dict
import requests
import datetime
import numpy as np

from fastapi import APIRouter
router = APIRouter()

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

# === 11. API: Full Strategy View ===
@router.get("/api/test")
def full_strategy():
    url = "https://fapi.binance.com/fapi/v1/klines"
    res = requests.get(url, params={"symbol": "SOLUSDT", "interval": "30m", "limit": 280})
    data = res.json()
    
    #res = requests.get("https://fapi.binance.com/fapi/v1/aggTrades", params={"symbol": "SOLUSDT", "limit": 280})
    #trades = res.json()

    #res = requests.get("https://fapi.binance.com/fapi/v1/ticker/price", params={"symbol": "SOLUSDT"})
    #return res.json()

    return data
