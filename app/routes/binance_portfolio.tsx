import { json, LoaderFunction, ActionFunction } from "@remix-run/node";
import crypto from "crypto";

//const API_KEY = process.env.BINANCE_API_KEY!;
//const API_SECRET = process.env.BINANCE_API_SECRET!;
//const API_KEY = "LIkFuzX0IKLuaMSQ5dEpYj0eW1GuFoYXrzP1VT1hIrFmySBelp7W117FBzT9eDjj";
//const API_SECRET = "TlHQfa02MXtonmq4npFeDKkYOjxwLhJc7ZDzr8Q770iwRKNoKyXNk4o3evYRoWW0";

export const action: ActionFunction = async ({ request }) => {
  const { email } = await request.json();
//export const loader: LoaderFunction = async () => {

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


  const timestamp = Date.now();
  const query = `timestamp=${timestamp}`;
  const signature = crypto.createHmac("sha256", API_SECRET).update(query).digest("hex");

  // 1️⃣ USDT-M Futures 포지션 조회
  const url = `https://fapi.binance.com/fapi/v2/positionRisk?${query}&signature=${signature}`;
  const res = await fetch(url, { headers: { "X-MBX-APIKEY": API_KEY } });
  const positions = await res.json();

  //return (positions);

  if (!Array.isArray(positions)) {
    throw new Response("Binance API 호출 실패", { status: 500 });
  }

  // 2️⃣ 보유중인 포지션만 필터링
  const activePositions = positions.filter(
    (p: any) => parseFloat(p.positionAmt) !== 0
  );

  // 3️⃣ 포트폴리오 데이터 변환
  const portfolio = activePositions.map((p: any, idx: number) => {
    const qty = Math.abs(parseFloat(p.positionAmt));
    const markPrice = parseFloat(p.markPrice);
    const entryPrice = parseFloat(p.entryPrice);
    const evaluationAmount = markPrice * qty;
    const profit = (markPrice - entryPrice) * qty * (parseFloat(p.positionAmt) > 0 ? 1 : -1);
    const profitRate = entryPrice > 0 ? (profit / (entryPrice * qty)) * 100 : 0;

    return {
      id: idx + 1,
      symbol: p.symbol,
      currentPrice: markPrice,
      averagePrice: entryPrice,
      quantity: qty,
      evaluationAmount,
      profit,
      profitRate,
      state:
        profit > 0 ? "profit" : profit < 0 ? "loss" : "neutral",
    };
  });

  return json(portfolio);
};
