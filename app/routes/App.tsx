import React, { useEffect, useRef, useState } from "react"
import { createWS } from "@/lib/ws"
import type { Candle, WsPayload } from "./types"
import Hud from "@/components/Hud"
import PricePanel from "@/components/PricePanel"
import SignalBadge from "@/components/SignalBadge"
import Chart from "@/components/Chart"

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8000"

export default function App() {
  const [data, setData] = useState<WsPayload>({ cvd: 0, last_price: null, vwap: null, signal:"NEUTRAL" })
  const [initialCandles, setInitialCandles] = useState<Candle[]>([])
  const wsRef = useRef<WebSocket | null>(null)

  useEffect(() => {
    // 초기 캔들 로딩
    fetch(`${API_BASE}/api/klines`)
      .then(r => r.json())
      .then((arr: Candle[]) => setInitialCandles(arr))
      .catch(e => console.error("load klines error:", e))

    // WS 연결
    wsRef.current = createWS((d: WsPayload) => setData(prev => ({...prev, ...d})))
    return () => wsRef.current?.close()
  }, [])

  return (
    <div style={{maxWidth: 1200, margin: "24px auto", padding: "0 16px", fontFamily:"system-ui, -apple-system, Segoe UI, Roboto"}}>
      <h2 style={{margin:"8px 0"}}>TradingGear – SOL 30m 실시간 (HUD + 차트)</h2>

      <PricePanel price={data.last_price ?? null} vwap={data.vwap ?? null} />
      <SignalBadge signal={data.signal ?? "NEUTRAL"} />

      <div style={{height:12}} />
      <Hud signal={data.signal ?? "NEUTRAL"} cvd={data.cvd ?? 0} vwap={data.vwap ?? null} price={data.last_price ?? null} />

      <div style={{height:24}} />
      {initialCandles.length > 0 && (
        <Chart
          initial={initialCandles}
          lastPrice={data.last_price ?? null}
          vwap={data.vwap ?? null}
          signal={data.signal ?? "NEUTRAL"}
        />
      )}

      <div style={{marginTop:24, fontSize:12, color:"#94a3b8"}}>
        WS: <code>{import.meta.env.VITE_WS_URL || "ws://localhost:8000/ws"}</code> · API: <code>{API_BASE}</code>
      </div>
    </div>
  )
}