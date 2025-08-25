import { json, LoaderFunction, ActionFunction } from "@remix-run/node";
import crypto from "crypto";

//const API_KEY = process.env.BINANCE_API_KEY!;
//const API_SECRET = process.env.BINANCE_API_SECRET!;

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


  // Spot 계정 잔고
  const timestamp = Date.now();
  const query = `timestamp=${timestamp}`;
  const signature = crypto.createHmac("sha256", API_SECRET).update(query).digest("hex");

  // 1️⃣ Spot balances
  const spotRes = await fetch(
    `https://api.binance.com/api/v3/account?${query}&signature=${signature}`,
    { headers: { "X-MBX-APIKEY": API_KEY } }
  );
  const spotData = await spotRes.json();

  const ownedSpotSymbols = spotData.balances
    .filter((b: any) => parseFloat(b.free) + parseFloat(b.locked) > 0)
    .map((b: any) => b.asset);

  // 2️⃣ Futures positions
  const futureRes = await fetch(
    `https://fapi.binance.com/fapi/v2/positionRisk?${query}&signature=${signature}`,
    { headers: { "X-MBX-APIKEY": API_KEY } }
  );
  const futuresData = await futureRes.json();

  const ownedFutureSymbols = futuresData
    .filter((p: any) => parseFloat(p.positionAmt) !== 0)
    .map((p: any) => p.symbol);

  // 3️⃣ 종목 수 계산
  const spotCount = ownedSpotSymbols.length;
  const futuresCount = ownedFutureSymbols.length;
  const totalCount = spotCount + futuresCount;

  return json({
    spotCount,
    futuresCount,
    totalCount,
    ownedSpotSymbols,
    ownedFutureSymbols,
  });
};
