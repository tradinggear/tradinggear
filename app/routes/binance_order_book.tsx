import { json, LoaderFunction, ActionFunction } from "@remix-run/node";
//async function getOrderBook(symbol = 'BTCUSDT', limit = 5) {
export const loader: LoaderFunction = async () => {
  const symbol = 'SOLUSDT';
  const limit = 25;
/*
  const url = `https://api.binance.com/api/v3/depth?symbol=${symbol}&limit=${limit}`;

  try {
    const res = await fetch(url);
    const data = await res.json();
    console.log('오더북:', data);
    return data;
  } catch (err) {
    console.error('오더북 조회 오류:', err);
  }
*/

}

//getOrderBook();
