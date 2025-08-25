import type { LoaderFunction } from "@remix-run/node";
import { PassThrough } from "stream";
import fetch from "node-fetch";
import WebSocket from "ws";

//const API_KEY = process.env.BINANCE_API_KEY!;
//const API_SECRET = process.env.BINANCE_API_SECRET!;
const API_KEY = "LIkFuzX0IKLuaMSQ5dEpYj0eW1GuFoYXrzP1VT1hIrFmySBelp7W117FBzT9eDjj";
const API_SECRET = "TlHQfa02MXtonmq4npFeDKkYOjxwLhJc7ZDzr8Q770iwRKNoKyXNk4o3evYRoWW0";

let ws: WebSocket | null = null;

export const loader: LoaderFunction = async () => {
  const stream = new PassThrough();

  // SSE 헤더
  const headers = new Headers({
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
  });

  // 1️⃣ ListenKey 발급
  const res = await fetch("https://api.binance.com/api/v3/userDataStream", {
    method: "POST",
    headers: { "X-MBX-APIKEY": API_KEY },
  });
  const { listenKey } = await res.json();

  // 2️⃣ WebSocket 연결
  ws = new WebSocket(`wss://stream.binance.com:9443/ws/${listenKey}`);
  console.log("WebSocket 연결됨:", listenKey);

  ws.on("message", (msg) => {
    const data = JSON.parse(msg.toString());

    if (data.e === "outboundAccountPosition" || data.e === "balanceUpdate") {
      // SSE로 클라이언트에 전달
      stream.write(`data: ${JSON.stringify(data)}\n\n`);
    }
  });

  // 3️⃣ 정기적 ListenKey 갱신 (60분 유지)
  setInterval(() => {
    fetch(`https://api.binance.com/api/v3/userDataStream?listenKey=${listenKey}`, {
      method: "PUT",
      headers: { "X-MBX-APIKEY": API_KEY },
    });
  }, 30 * 60 * 1000);

  return new Response(stream, { headers });
};
