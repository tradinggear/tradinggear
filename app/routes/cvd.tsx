import { useState, useEffect } from "react";

export default function CVDTracker() {
  const [cvd, setCvd] = useState(0);

  useEffect(() => {
    const fetchCVD = async () => {
      try {
        const url =
          "https://api.binance.com/api/v3/trades?symbol=SOLUSDT&limit=1000";

        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const trades = await res.json();

        let cumulative = 0;
        trades.forEach((trade: any) => {
          const qty = parseFloat(trade.qty);
          cumulative += trade.isBuyerMaker ? qty : -qty;
        });

        console.log("CVD =", cumulative.toFixed(4));
        setCvd(cumulative);
      } catch (err) {
        console.error("CVD fetch 실패:", err);
      }
    };

    fetchCVD();
    const interval = setInterval(fetchCVD, 60000); // 1분마다
    return () => clearInterval(interval);
  }, []);

  return <h1>CVD: {cvd.toFixed(4)}</h1>;
}
