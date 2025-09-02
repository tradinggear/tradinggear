import React, { useEffect, useRef } from "react"
import { createChart, ColorType, LineStyle, IChartApi, ISeriesApi, CandlestickData, LineData } from "lightweight-charts"
import type { Candle } from "../routes/types"

type Props = {
  initial: Candle[]
  lastPrice?: number | null
  vwap?: number | null
  signal?: "LONG" | "SHORT" | "NEUTRAL"
}

export default function Chart({ initial, lastPrice, vwap, signal }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const chartRef = useRef<IChartApi | null>(null)
  const candleRef = useRef<ISeriesApi<"Candlestick"> | null>(null)
  const vwapRef = useRef<ISeriesApi<"Line"> | null>(null)
  const lastTimeRef = useRef<number | null>(null)
  const markersRef = useRef<any[]>([])

  useEffect(() => {
    if (!containerRef.current) return
    const chart = createChart(containerRef.current, {
      layout: { background: { type: ColorType.Solid, color: "#0f172a" }, textColor: "#cbd5e1" },
      width: containerRef.current.clientWidth, height: 420,
      grid: { vertLines: { color: "#1f2937" }, horzLines: { color: "#1f2937" } },
      crosshair: { vertLine: { color:"#6b7280" }, horzLine:{ color:"#6b7280" } }
    })
    const candle = chart.addCandlestickSeries({
      upColor: "#16a34a", downColor: "#dc2626",
      borderUpColor: "#16a34a", borderDownColor: "#dc2626",
      wickUpColor: "#16a34a", wickDownColor: "#dc2626"
    })
    const vwapLine = chart.addLineSeries({ color:"#facc15", lineWidth:2, lineStyle:LineStyle.Solid })

    const cdata: CandlestickData[] = initial.map(c => ({
      time: c.t/1000, open:c.o, high:c.h, low:c.l, close:c.c
    }))
    candle.setData(cdata)
    lastTimeRef.current = cdata[cdata.length-1]?.time as number

    if (vwap) {
      const vdata: LineData[] = initial.map(c => ({ time:c.t/1000, value:vwap }))
      vwapLine.setData(vdata)
    }

    chartRef.current = chart
    candleRef.current = candle
    vwapRef.current = vwapLine

    const handleResize = () => chart.applyOptions({ width: containerRef.current!.clientWidth })
    window.addEventListener("resize", handleResize)
    return () => { window.removeEventListener("resize", handleResize); chart.remove() }
  }, [initial])

  useEffect(() => {
    if (!candleRef.current || !lastTimeRef.current || !lastPrice) return
    const t = lastTimeRef.current
    candleRef.current.update({ time:t, open:lastPrice, high:lastPrice, low:lastPrice, close:lastPrice })
    if (vwap && vwapRef.current) vwapRef.current.update({ time:t, value:vwap })
    if (signal && signal !== "NEUTRAL") {
      markersRef.current.push({
        time: t,
        position: signal==="LONG"?"belowBar":"aboveBar",
        color: signal==="LONG"?"#16a34a":"#dc2626",
        shape: signal==="LONG"?"arrowUp":"arrowDown",
        text: signal
      })
      candleRef.current.setMarkers(markersRef.current)
    }
  }, [lastPrice, vwap, signal])

  return <div ref={containerRef} style={{width:"100%", height: 420}} />
}