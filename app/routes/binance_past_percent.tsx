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

  // 1️⃣ Futures Account 호출
  const accountRes = await fetch(
    `https://fapi.binance.com/fapi/v2/account?${query}&signature=${signature}`,
    { headers: { "X-MBX-APIKEY": API_KEY } }
  );
  const accountData = await accountRes.json();

  if (!accountData.assets) {
    throw new Response("Binance Futures API 호출 실패", { status: 500 });
  }

  // 2️⃣ 보유 잔고 필터링
  const balances = accountData.assets.filter(
    (a: any) => parseFloat(a.walletBalance) > 0 || parseFloat(a.unrealizedProfit) !== 0
  );

  let currentValue = 0;
  let previousValue = 0;
  const detailedBalances: any[] = [];

  for (const bal of balances) {
    const qty = parseFloat(bal.walletBalance); // 선물 지갑 잔고
    const unrealized = parseFloat(bal.unrealizedProfit);
    const asset = bal.asset;

    // 선물 자산은 대부분 USDT 기준으로 평가
    if (asset === "USDT") {
      const current = qty + unrealized;
      currentValue += current;
      previousValue += qty; // 전일은 미실현 손익 제외 가정
      detailedBalances.push({ asset, qty, current, previous: qty });
    } else {
      // BTC, ETH 등 COIN 마진 자산 처리
      const symbol = `${asset}USDT`;

      try {
        // 현재가
        const priceRes = await fetch(
          `https://api.binance.com/api/v3/ticker/price?symbol=${symbol}`
        );
        const priceData = await priceRes.json();

        // 전일 종가
        const prevRes = await fetch(
          `https://api.binance.com/api/v3/ticker/24hr?symbol=${symbol}`
        );
        const prevData = await prevRes.json();

        if (!priceData.price || !prevData.prevClosePrice) continue;

        const currentPrice = parseFloat(priceData.price);
        //const prevPrice = parseFloat(prevData.prevClosePrice);
        const prevPrice = parseFloat(prevData.openPrice);

        const current = qty * currentPrice + unrealized;
        const previous = qty * prevPrice;

        currentValue += current;
        previousValue += previous;

        detailedBalances.push({ asset, qty, current, previous });
      } catch (e) {
        console.error(`시세 조회 실패: ${asset}`);
      }
    }
  }

  const changePercent =
    previousValue > 0 ? ((currentValue - previousValue) / previousValue) * 100 : 0;

  return json({
    totalCurrent: currentValue.toFixed(2),
    totalPrevious: previousValue.toFixed(2),
    changePercent: changePercent.toFixed(2),
    balances: detailedBalances,
  });
};
