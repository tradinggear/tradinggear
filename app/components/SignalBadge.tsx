import React from "react"

export default function SignalBadge({ signal }:{signal:"LONG"|"SHORT"|"NEUTRAL"}) {
  const color = signal==="LONG"?"#16a34a":signal==="SHORT"?"#dc2626":"#2563eb"
  const text  = signal==="NEUTRAL"?"대기":(signal==="LONG"?"롱 진입":"숏 진입")
  return (
    <div style={{
      display:"inline-block",padding:"6px 10px",borderRadius:9999,
      background:color,color:"white",fontWeight:700
    }}>{text}</div>
  )
}