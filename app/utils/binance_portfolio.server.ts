import * as WebSocket from "ws";
import fetch from "node-fetch";

let ws: WebSocket | null = null;
let cache: any[] = [];
let wsStarted = false;

export async function startBinanceWebSocket(apiKey: string) {
  if (wsStarted) return;
  wsStarted = true;

  const listenKeyRes = await fetch("https://fapi.binance.com/fapi/v1/listenKey", {
    method: "POST",
    headers: { "X-MBX-APIKEY": apiKey },
  });
  const listenKeyData: any = await listenKeyRes.json();
  const listenKey = listenKeyData.listenKey;
  console.log("✅ Binance ListenKey:", listenKey);

  ws = new WebSocket(`wss://fstream.binance.com/ws/${listenKey}`);

  ws.on("open", () => console.log("✅ Binance WebSocket 연결됨"));
  ws.on("close", () => {
    console.log("❌ Binance WebSocket 종료");
    wsStarted = false;
  });

  ws.on("message", (data) => {
    const json = JSON.parse(data.toString());

    if (json.e === "ACCOUNT_UPDATE") {
      const positions = json.a?.P || [];

      cache = positions
        .filter((p: any) => parseFloat(p.pa) !== 0)
        .map((p: any, idx: number) => {
          const qty = Math.abs(parseFloat(p.pa));
          const markPrice = parseFloat(p.mp);
          const entryPrice = parseFloat(p.ep);
          const evaluationAmount = markPrice * qty;
          const profit = (markPrice - entryPrice) * qty * (parseFloat(p.pa) > 0 ? 1 : -1);
          const profitRate = entryPrice > 0 ? (profit / (entryPrice * qty)) * 100 : 0;

          return {
            id: idx + 1,
            symbol: p.s,
            currentPrice: markPrice,
            averagePrice: entryPrice,
            quantity: qty,
            evaluationAmount,
            profit,
            profitRate,
            state: profit > 0 ? "profit" : profit < 0 ? "loss" : "neutral",
          };
        });

      console.log("📡 포지션 갱신:", cache);
    }
  });
}

export function getPositionsCache() {
  return cache;
}
