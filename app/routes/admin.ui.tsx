import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

export default function AdminDashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    axios.get("/api/admin/signals/latest").then((res) => {
      setData(res.data);
    });
  }, []);

  if (!data) return <div>Loading signals...</div>;

  const signalColor = (type) => (type === "LONG" ? "text-green-600" : "text-red-600");

  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 p-4">
      <Card>
        <CardContent className="p-4">
          <h2 className="text-lg font-semibold">Current Price</h2>
          <p className="text-2xl">${data.current_price}</p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <h2 className="text-lg font-semibold">VWAP</h2>
          <p className="text-2xl">{data.vwap}</p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <h2 className="text-lg font-semibold">CVD</h2>
          <p className="text-2xl">{data.cvd}</p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <h2 className="text-lg font-semibold">RSI</h2>
          <p className="text-2xl">{data.rsi}</p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <h2 className="text-lg font-semibold">Stochastic</h2>
          <p className="text-2xl">{data.stochastic}</p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <h2 className="text-lg font-semibold">Volume Spike</h2>
          <p className="text-2xl">{data.volume_spike ? "Yes" : "No"}</p>
        </CardContent>
      </Card>

      <Card className="col-span-1 md:col-span-2 lg:col-span-3">
        <CardContent className="p-4">
          <h2 className="text-xl font-bold mb-2">Signals</h2>
          {data.signals.length > 0 ? (
            <ul className="space-y-2">
              {data.signals.map((sig, i) => (
                <li key={i} className="flex items-center gap-3">
                  {sig.type === "LONG" ? (
                    <ArrowUpRight className="text-green-500" />
                  ) : (
                    <ArrowDownRight className="text-red-500" />
                  )}
                  <span className={`font-semibold ${signalColor(sig.type)}`}>
                    {sig.type} at ${sig.price.toFixed(2)} (CVD: {sig.cvd})
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p>No active signals.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}