import { json, LoaderFunction } from "@remix-run/node";
import crypto from "crypto";

//const API_KEY = process.env.BINANCE_API_KEY!;
//const API_SECRET = process.env.BINANCE_API_SECRET!;
const API_KEY = "LIkFuzX0IKLuaMSQ5dEpYj0eW1GuFoYXrzP1VT1hIrFmySBelp7W117FBzT9eDjj";
const API_SECRET = "TlHQfa02MXtonmq4npFeDKkYOjxwLhJc7ZDzr8Q770iwRKNoKyXNk4o3evYRoWW0";

export const loader: LoaderFunction = async () => {
  const timestamp = Date.now();
  const queryString = `timestamp=${timestamp}`;

  const signature = crypto
    .createHmac("sha256", API_SECRET)
    .update(queryString)
    .digest("hex");

  const url = `https://api.binance.com/api/v3/account?${queryString}&signature=${signature}`;

  const res = await fetch(url, {
    headers: { "X-MBX-APIKEY": API_KEY },
  });
  const data = await res.json();

  // 잔고 0 이상만 필터링
  const balances = data.balances.filter(
    (b: any) => parseFloat(b.free) + parseFloat(b.locked) > 0
  );

  return json({ balances });
};
