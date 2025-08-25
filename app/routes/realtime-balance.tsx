import { useEffect, useState } from "react";

interface BalanceEvent {
  e: string;
  B?: { a: string; f: string; l: string }[]; // asset, free, locked
}

export default function RealtimeBalance() {
  const [balances, setBalances] = useState<{ asset: string; free: number; locked: number }[]>([]);

  useEffect(() => {
    const eventSource = new EventSource("/balance-stream");

    eventSource.onmessage = (event) => {
      const data: BalanceEvent = JSON.parse(event.data);

      // outboundAccountPosition → 전체 잔고
      if (data.e === "outboundAccountPosition" && data.B) {
        const filtered = data.B
          .map((b) => ({
            asset: b.a,
            free: parseFloat(b.f),
            locked: parseFloat(b.l),
          }))
          .filter((b) => b.free + b.locked > 0);

        setBalances(filtered);
      }
    };

    return () => eventSource.close();
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h2>📡 실시간 Binance 자산 현황</h2>
      <table border={1} cellPadding={5}>
        <thead>
          <tr>
            <th>자산</th>
            <th>사용 가능</th>
            <th>잠금</th>
          </tr>
        </thead>
        <tbody>
          {balances.map((bal) => (
            <tr key={bal.asset}>
              <td>{bal.asset}</td>
              <td>{bal.free.toFixed(4)}</td>
              <td>{bal.locked.toFixed(4)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
