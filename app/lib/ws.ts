export function createWS(onData: (d: any) => void) {
  const WS_URL = import.meta.env.VITE_WS_URL || "ws://localhost:8000/ws"
  const ws = new WebSocket(WS_URL)

  ws.onopen = () => console.log("[WS] connected:", WS_URL)
  ws.onmessage = (ev) => {
    try { onData(JSON.parse(ev.data)) } catch (e) { console.warn("[WS] bad message", e) }
  }
  ws.onerror = (e) => console.error("[WS] error", e)
  ws.onclose = () => console.log("[WS] closed")

  return ws
}