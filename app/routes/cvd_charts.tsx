import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer
} from "recharts";

interface CVDPoint {
  time: string;
  cvd: number;
}

export default function CVDChart() {
  const [data, setData] = useState<CVDPoint[]>([]);

  useEffect(() => {
    const fetchCVD = async () => {
      try {
        const url =
          "https://api.binance.com/api/v3/trades?symbol=SOLUSDT&limit=1000";
        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const trades = await res.json();

        // CVD 계산
        let cvd = 0;
        trades.forEach((trade: any) => {
          const qty = parseFloat(trade.qty);
          cvd += trade.isBuyerMaker ? qty : -qty;
        });

        // 새로운 데이터 포인트
        const now = new Date();
        const timeLabel = now.toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" });

        setData((prev) => [
          ...prev.slice(-59), // 최근 60개만 유지
          { time: timeLabel, cvd: parseFloat(cvd.toFixed(4)) },
        ]);
      } catch (err) {
        console.error("CVD fetch 실패:", err);
      }
    };

    fetchCVD(); // 초기 실행
    const interval = setInterval(fetchCVD, 60000); // 1분마다
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ width: "100%", height: 300 }}>
      <h2>1분 단위 CVD (SOLUSDT)</h2>
      <ResponsiveContainer>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="cvd" stroke="#8884d8" dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
