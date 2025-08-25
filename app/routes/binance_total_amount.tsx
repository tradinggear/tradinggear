import { json, LoaderFunction, ActionFunction } from "@remix-run/node";
import crypto from "crypto";

const API_KEY = "LIkFuzX0IKLuaMSQ5dEpYj0eW1GuFoYXrzP1VT1hIrFmySBelp7W117FBzT9eDjj";
const API_SECRET = "TlHQfa02MXtonmq4npFeDKkYOjxwLhJc7ZDzr8Q770iwRKNoKyXNk4o3evYRoWW0";

//async function getAccountInfo() {
//export const action: ActionFunction = async ({ request }) => {
//  const { email } = await request.json();
export const loader: LoaderFunction = async () => {
  const timestamp = Date.now();
  const query = `timestamp=${timestamp}&omitZeroBalances=true`;
  const signature = crypto
    .createHmac("sha256", API_SECRET)
    .update(query)
    .digest("hex");

  const url = `https://api.binance.com/api/v3/account?${query}&signature=${signature}`;

  const res = await fetch(url, {
    headers: {
      "X-MBX-APIKEY": API_KEY
    }
  });

  const data = await res.json();
  console.log(data);
  return json({data})
};

//getAccountInfo();
