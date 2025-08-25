import React from "react"

type Props = {
  signal: "LONG"|"SHORT"|"NEUTRAL"
  cvd: number
  vwap: number | null
  price: number | null
}

const bg = (s:"LONG"|"SHORT"|"NEUTRAL") => s==="LONG"?"#16a34a":s==="SHORT"?"#dc2626":"#2563eb"

export default function Hud({ signal, cvd, vwap, price }: Props) {
  const htfText = signal==="LONG"?"▲ 상승":signal==="SHORT"?"▼ 하락":"■ 중립"
  const band = (p:number|null, v:number|null) => (p && v) ? (Math.abs((p-v)/v)*100).toFixed(3)+"%" : "-"
  const cell = (label:string, value:string) => (
    <div style={{background:bg(signal),padding:8,borderRadius:8,textAlign:"center"}}>
      <div style={{opacity:.8,fontSize:12}}>{label}</div>
      <div style={{fontWeight:700}}>{value}</div>
    </div>
  )
  return (
    <div style={{
      display:"grid",gridTemplateColumns:"repeat(5,minmax(0,1fr))",gap:8,
      padding:8,background:"#0b1220",border:"1px solid #1f2937",borderRadius:12
    }}>
      {cell("HTF", htfText)}
      {cell("VWAP", band(price, vwap))}
      {cell("CVD", Number.isFinite(cvd)? cvd.toFixed(0):"-")}
      {cell("현재가", price? price.toString():"-")}
      {cell("신호", signal==="NEUTRAL"?"대기":(signal==="LONG"?"롱 진입":"숏 진입"))}
    </div>
  )
}