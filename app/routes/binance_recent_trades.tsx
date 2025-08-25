import { json, LoaderFunction, ActionFunction } from "@remix-run/node";
import crypto from "crypto";

//const API_KEY = process.env.BINANCE_API_KEY!;
//const API_SECRET = process.env.BINANCE_API_SECRET!;
//const API_KEY = "LIkFuzX0IKLuaMSQ5dEpYj0eW1GuFoYXrzP1VT1hIrFmySBelp7W117FBzT9eDjj";
//const API_SECRET = "TlHQfa02MXtonmq4npFeDKkYOjxwLhJc7ZDzr8Q770iwRKNoKyXNk4o3evYRoWW0";

export const action: ActionFunction = async ({ request }) => {
  const { email } = await request.json();
//export const loader: LoaderFunction = async ({ request }) => {

//  const email = "lovedisket@gmail.com";

  const value = String(email);

  const form = new URLSearchParams();
  form.append("email", value ?? "");  

  const res0 = await fetch('https://tradinggear.co.kr:8081/tradinggear/member_inform_get.php', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/x-www-form-urlencoded', // ✅ JSON 형식 명시
      },
      body: form.toString(),
  });    

  const data1 = await res0.json(); 

  const API_KEY = data1[0]["decrypted_api_key"];
  const API_SECRET = data1[0]["decrypted_api_secret"];


  const url = new URL(request.url);
  const limit = url.searchParams.get("limit") || "20"; // 최근 20건

  const timestamp = Date.now();
  const query = `limit=${limit}&timestamp=${timestamp}`;
  const signature = crypto.createHmac("sha256", API_SECRET).update(query).digest("hex");

  // 1️⃣ USDT-M Futures 최근 체결 내역 (symbol 생략 → 전체 심볼)
  const apiUrl = `https://fapi.binance.com/fapi/v1/userTrades?${query}&signature=${signature}`;
  const res = await fetch(apiUrl, { headers: { "X-MBX-APIKEY": API_KEY } });
  const data = await res.json();

  //return data;

  if (!Array.isArray(data)) {
    throw new Response("Binance API 호출 실패", { status: 500 });
  }

  // 2️⃣ 수익률(ROE) 계산
  const trades = data.map((t: any) => {
    const qty = parseFloat(t.qty);
    const price = parseFloat(t.price);
    const quoteQty = parseFloat(t.quoteQty);
    const realizedPnl = parseFloat(t.realizedPnl);

    // 체결금액 대비 실현손익 비율로 근사 ROE 계산
    const roe = quoteQty > 0 ? (realizedPnl / quoteQty) * 100 : 0;

    return {
      id: t.id,
      orderId: t.orderId,
      symbol: t.symbol,
      qty,
      price,
      quoteQty,
      realizedPnl,
      roe: roe.toFixed(2),
      side: t.side || (t.buyer ? "BUY" : "SELL"),
      time: new Date(t.time).toLocaleString(),
    };
  });

  return json(trades);
};