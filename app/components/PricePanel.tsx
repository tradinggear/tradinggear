import React from "react"

export default function PricePanel({ price, vwap }:{price:number|null; vwap:number|null}) {
  return (
    <div style={{display:"flex",gap:12,alignItems:"baseline",padding:"8px 0"}}>
      <div style={{fontSize:28,fontWeight:700,color:"#e5e7eb"}}>현재가</div>
      <div style={{fontSize:28,color:"#e5e7eb"}}>{price ? price.toFixed(3) : "-"}</div>
      <div style={{marginLeft:24,color:"#94a3b8"}}>VWAP</div>
      <div style={{color:"#facc15"}}>{vwap ? vwap.toFixed(3) : "-"}</div>
    </div>
  )
}