/*import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)*/
import App from "./App";

export default function MainRoute() {
  // 여기서는 절대 document/window/ReactDOM 사용 X
  return <App />;
}
