export type Candle = { t:number; o:number; h:number; l:number; c:number; v:number }
export type WsPayload = {
  cvd: number
  last_price: number | null
  vwap: number | null
  signal?: "LONG" | "SHORT" | "NEUTRAL"
  hud?: string
  color?: "green" | "red" | "blue"
}