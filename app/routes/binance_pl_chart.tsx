import { json, LoaderFunction, ActionFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import crypto from "crypto";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";

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
  const query = `limit=30&timestamp=${timestamp}`; // 최근 10건
  const signature = crypto.createHmac("sha256", API_SECRET).update(query).digest("hex");

  // 1️⃣ 최근 체결 내역 조회 (전체 심볼)
  const apiUrl = `https://fapi.binance.com/fapi/v1/userTrades?${query}&signature=${signature}`;
  const res = await fetch(apiUrl, { headers: { "X-MBX-APIKEY": API_KEY } });
  const trades = await res.json();

  if (!Array.isArray(trades)) {
    throw new Response("Binance API 호출 실패", { status: 500 });
  }

  // 2️⃣ 누적 손익률(%) 계산
  let cumulativePnl = 0;
  let initialCapital = 1000; // 가정 시작자본 (또는 계좌 자본 fetch 가능)
  const chartData: { time: string; value: number }[] = [];

  trades
    .sort((a, b) => a.time - b.time) // 시간 순 정렬
    .forEach((trade: any) => {
      const realizedPnl = parseFloat(trade.realizedPnl);
      const quoteQty = parseFloat(trade.quoteQty);

      cumulativePnl += realizedPnl;
      const plPercent = (cumulativePnl / initialCapital) * 100;

      chartData.push({
        time: new Date(trade.time).toLocaleString("ko-KR", {
          year: "2-digit",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
        }),
        value: parseFloat(plPercent.toFixed(2)),
      });
    });

  return json(chartData);
};
/*
export default function PLChartPage() {
  const chartData = useLoaderData<typeof loader>();

  return (
    <div style={{ padding: 20 }}>
      <h2>📈 손익률 차트</h2>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="colorPl" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
          <XAxis dataKey="time" />
          <YAxis domain={['auto', 'auto']} tickFormatter={(v) => `${v}%`} />
          <Tooltip formatter={(value: number) => `${value}%`} />
          <Area type="monotone" dataKey="value" stroke="#3B82F6" fillOpacity={1} fill="url(#colorPl)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}*/
