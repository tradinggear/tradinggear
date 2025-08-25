import { json, ActionFunction } from "@remix-run/node";
import crypto from "crypto";

// 날짜 계산 유틸 (오늘 00:00 UTC)
function getTodayStartTimestamp() {
  const now = new Date();
  now.setUTCHours(0, 0, 0, 0);
  return now.getTime();
}

export const action: ActionFunction = async ({ request }) => {
  const { apiKey, apiSecret, isFutures = true } = await request.json();

  const timestamp = Date.now();
  const query = `timestamp=${timestamp}`;
  const signature = crypto.createHmac("sha256", apiSecret).update(query).digest("hex");

  // 1️⃣ 심볼별 거래 조회 (예시로 BTCUSDT만 조회, 전체 심볼 합산하려면 반복 필요)
  const symbol = "BTCUSDT";
  const endpoint = isFutures
    ? `https://fapi.binance.com/fapi/v1/userTrades?symbol=${symbol}&${query}&signature=${signature}`
    : `https://api.binance.com/api/v3/myTrades?symbol=${symbol}&${query}&signature=${signature}`;

  const res = await fetch(endpoint, {
    headers: { "X-MBX-APIKEY": apiKey },
  });
  const trades = await res.json();

  if (!Array.isArray(trades)) {
    return json({ error: "거래 내역 조회 실패", trades }, { status: 500 });
  }

  // 2️⃣ 오늘 00:00 UTC 이후 거래만 필터링
  const todayStart = getTodayStartTimestamp();
  const todayTrades = trades.filter((t) => t.time >= todayStart);

  return json({
    symbol,
    todayCount: todayTrades.length,
    todayTrades,
  });
};
