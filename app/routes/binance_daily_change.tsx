import type { LoaderFunction } from "@remix-run/node";
import crypto from "crypto";
import fetch from "node-fetch";

//const API_KEY = process.env.BINANCE_API_KEY!;
//const API_SECRET = process.env.BINANCE_API_SECRET!;
const API_KEY = "LIkFuzX0IKLuaMSQ5dEpYj0eW1GuFoYXrzP1VT1hIrFmySBelp7W117FBzT9eDjj";
const API_SECRET = "TlHQfa02MXtonmq4npFeDKkYOjxwLhJc7ZDzr8Q770iwRKNoKyXNk4o3evYRoWW0";

export const loader: LoaderFunction = async () => {
  const baseUrl = "https://fapi.binance.com";
  const endpoint = "/fapi/v2/account";
  const timestamp = Date.now();
  const query = `timestamp=${timestamp}`;
  const signature = crypto.createHmac("sha256", API_SECRET).update(query).digest("hex");
  const url = `${baseUrl}${endpoint}?${query}&signature=${signature}`;

  const res = await fetch(url, {
    headers: { "X-MBX-APIKEY": API_KEY },
  });

  const data = await res.json();

  // 현재 총 마진 잔고
  const currentBalance = parseFloat(data.totalMarginBalance);

  // DB 또는 파일에서 전일 값 가져오기 (여기서는 예시로 1200)
  const yesterdayBalance = 1200; 

  // 전일 대비 상승률 계산
  const changePercent = ((currentBalance - yesterdayBalance) / yesterdayBalance) * 100;

  return new Response(
    JSON.stringify({
      currentBalance,
      yesterdayBalance,
      changePercent: parseFloat(changePercent.toFixed(2)),
    }),
    { headers: { "Content-Type": "application/json" } }
  );
};
