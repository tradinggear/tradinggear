import { json, LoaderFunction, ActionFunction } from "@remix-run/node";
import crypto from "crypto";

// 서버 메모리 캐시 (심볼 목록)
let cachedSymbols: string[] | null = null;
let lastSymbolFetch = 0;

export const action: ActionFunction = async ({ request }) => {
  const { email } = await request.json();
//export const loader: LoaderFunction = async () => {

  // 1️⃣ TradingGear 서버에서 API 키 가져오기
  const form = new URLSearchParams();
  form.append("email", email);

  const res0 = await fetch("https://tradinggear.co.kr:8081/tradinggear/member_inform_get.php", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: form.toString(),
  });

  const data1 = await res0.json();
  const API_KEY = data1[0]?.decrypted_api_key;
  const API_SECRET = data1[0]?.decrypted_api_secret;

  if (!API_KEY || !API_SECRET) {
    throw new Response("API 키를 가져오지 못했습니다.", { status: 500 });
  }

  // 2️⃣ 오늘 0시(UTC) timestamp
  const now = new Date();
  const utc0 = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 0, 0, 0));
  const startTime = utc0.getTime();

  // 3️⃣ 심볼 목록 캐시 (1시간마다 갱신)
  if (!cachedSymbols || Date.now() - lastSymbolFetch > 60 * 60 * 1000) {
    const res = await fetch("https://fapi.binance.com/fapi/v1/exchangeInfo");
    if (res.ok) {
      const jsonData = await res.json();
      cachedSymbols = jsonData.symbols
        .map((s: any) => s.symbol)
        .filter((s: string) => s.endsWith("USDT")); // USDT 마켓만
      lastSymbolFetch = Date.now();
      console.log("✅ 심볼 목록 캐시 갱신:", cachedSymbols.length, "개");
    } else {
      // fallback: 최소 심볼 2개
      cachedSymbols = ["BTCUSDT", "ETHUSDT"];
      console.warn("⚠️ exchangeInfo 실패 → 기본 심볼 사용");
    }
  }

  const allTrades: any[] = [];
  let totalCount = 0;

  // 4️⃣ 심볼 순회 → 오늘 거래내역 수집
  for (const symbol of cachedSymbols!) {
    const timestamp = Date.now();
    const query = `symbol=${symbol}&startTime=${startTime}&timestamp=${timestamp}`;
    const signature = crypto.createHmac("sha256", API_SECRET).update(query).digest("hex");

    const url = `https://fapi.binance.com/fapi/v1/userTrades?${query}&signature=${signature}`;
    const res = await fetch(url, { headers: { "X-MBX-APIKEY": API_KEY } });

    if (res.status === 200) {
      const trades = await res.json();

      if (Array.isArray(trades) && trades.length > 0) {
        const todayTrades = trades
          .filter((t: any) => t.time >= startTime)
          .map((t: any) => ({
            id: t.id,
            orderId: t.orderId,
            symbol: t.symbol,
            qty: parseFloat(t.qty),
            price: parseFloat(t.price),
            quoteQty: parseFloat(t.quoteQty),
            realizedPnl: parseFloat(t.realizedPnl),
            side: t.side || (t.buyer ? "BUY" : "SELL"),
            time: new Date(t.time).toLocaleString(),
          }));

        if (todayTrades.length > 0) {
          allTrades.push(...todayTrades);
          totalCount += todayTrades.length;
        }
      }
    }

    // Binance Rate Limit 보호
    await new Promise((r) => setTimeout(r, 100));
  }

  return json({
    count: totalCount,
    trades: allTrades,
  });
};
