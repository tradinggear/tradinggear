import { json, LoaderFunction, ActionFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import crypto from "crypto";

//const API_KEY = process.env.BINANCE_API_KEY!;
//const API_SECRET = process.env.BINANCE_API_SECRET!;
//const API_KEY = "LIkFuzX0IKLuaMSQ5dEpYj0eW1GuFoYXrzP1VT1hIrFmySBelp7W117FBzT9eDjj";
//const API_SECRET = "TlHQfa02MXtonmq4npFeDKkYOjxwLhJc7ZDzr8Q770iwRKNoKyXNk4o3evYRoWW0";

export const action: ActionFunction = async ({ request }) => {
  const { email } = await request.json();
//export const loader: LoaderFunction = async () => {

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

  // 1️⃣ 선물 포지션 정보 가져오기
  const url = `https://fapi.binance.com/fapi/v2/positionRisk?${query}&signature=${signature}`;
  const res = await fetch(url, { headers: { "X-MBX-APIKEY": API_KEY } });
  const positions = await res.json();

  if (!Array.isArray(positions)) {
    throw new Response("Binance API 호출 실패", { status: 500 });
  }

  // 2️⃣ 포지션이 있는 코인만 필터링
  const activePositions = positions.filter(
    (p: any) => parseFloat(p.positionAmt) !== 0
  );

  // 3️⃣ 총 미실현 손익 & 총 초기 증거금 계산
  let totalUnrealizedProfit = 0;
  let totalInitialMargin = 0;

  for (const p of activePositions) {
    totalUnrealizedProfit += parseFloat(p.unRealizedProfit);
    totalInitialMargin += parseFloat(p.positionInitialMargin);
  }

  const totalROE =
    totalInitialMargin > 0
      ? (totalUnrealizedProfit / totalInitialMargin) * 100
      : 0;

  return json({
    totalUnrealizedProfit: totalUnrealizedProfit.toFixed(2),
    totalInitialMargin: totalInitialMargin.toFixed(2),
    totalROE: totalROE.toFixed(2),
  });
};
/*
export default function FuturesTotalROE() {
  const { totalUnrealizedProfit, totalInitialMargin, totalROE } =
    useLoaderData<typeof loader>();

  return (
    <div style={{ padding: 20 }}>
      <h2>📊 Binance Futures 총 ROE</h2>
      <p>총 미실현 손익 (USDT): <strong>{totalUnrealizedProfit}</strong></p>
      <p>총 초기 증거금 (USDT): <strong>{totalInitialMargin}</strong></p>
      <p>
        총 ROE:{" "}
        <strong style={{ color: parseFloat(totalROE) >= 0 ? "green" : "red" }}>
          {totalROE}%
        </strong>
      </p>
    </div>
  );

  return json({
    totalUnrealizedProfit: totalUnrealizedProfit.toFixed(2),
    totalROE: totalROE.toFixed(2),
  });
}*/
