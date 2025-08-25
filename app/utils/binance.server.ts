import crypto from "crypto";

//const API_KEY = process.env.BINANCE_API_KEY!;
//const API_SECRET = process.env.BINANCE_API_SECRET!;

const API_KEY = "LIkFuzX0IKLuaMSQ5dEpYj0eW1GuFoYXrzP1VT1hIrFmySBelp7W117FBzT9eDjj";
const API_SECRET = "TlHQfa02MXtonmq4npFeDKkYOjxwLhJc7ZDzr8Q770iwRKNoKyXNk4o3evYRoWW0";

const BASE_URL = "https://api.binance.com";

function sign(query: string) {
  return crypto.createHmac("sha256", API_SECRET).update(query).digest("hex");
}

// 전체 심볼 목록 가져오기
async function getAllSymbols() {
  const res = await fetch(`${BASE_URL}/api/v3/exchangeInfo`);
  const data = await res.json();
  return data.symbols.map((s: any) => s.symbol);
}

export async function getTodayTradeCountAllSymbols() {
  // 오늘 0시(UTC)
  const now = new Date();
  const utc0 = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 0, 0, 0));
  const startTime = utc0.getTime();

  const symbols = await getAllSymbols();
  let totalTrades = 0;

  // 심볼별 조회 (Rate Limit 고려 → 순차)
  for (const symbol of symbols) {
    const query = `symbol=${symbol}&startTime=${startTime}&timestamp=${Date.now()}`;
    const signature = sign(query);

    const res = await fetch(`${BASE_URL}/api/v3/myTrades?${query}&signature=${signature}`, {
      headers: { "X-MBX-APIKEY": API_KEY },
    });

    // 거래 없으면 200 + []
    if (res.status === 200) {
      const trades = await res.json();
      if (Array.isArray(trades) && trades.length > 0) {
        totalTrades += trades.length;
      }
    } else {
      // 에러 로그 남기고 계속 진행
      const err = await res.text();
      console.warn(`${symbol} 조회 실패: ${err}`);
    }

    // ⏳ Binance Rate Limit 회피 (초당 10회)
    await new Promise((resolve) => setTimeout(resolve, 120)); 
  }

  return totalTrades;
}
