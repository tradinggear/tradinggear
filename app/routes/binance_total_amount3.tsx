import { json, LoaderFunction, ActionFunction } from "@remix-run/node";
import crypto from "crypto";

//const API_KEY = "LIkFuzX0IKLuaMSQ5dEpYj0eW1GuFoYXrzP1VT1hIrFmySBelp7W117FBzT9eDjj";
//const API_SECRET = "TlHQfa02MXtonmq4npFeDKkYOjxwLhJc7ZDzr8Q770iwRKNoKyXNk4o3evYRoWW0";

//async function getAccountInfo() {
export const action: ActionFunction = async ({ request }) => {
  const { email } = await request.json();
//export const loader: LoaderFunction = async () => {

  const value = String(email);

  const form = new URLSearchParams();
  form.append("email", value ?? "");  

  const res0 = await fetch('https://tradinggear.co.kr:8081/tradinggear/member_inform_get.php', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/x-www-form-urlencoded', // ✅ JSON 형식 명시
      },
      body: form.toString(),
  });    

  const data1 = await res0.json(); 

  const API_KEY = data1[0]["decrypted_api_key"];
  const API_SECRET = data1[0]["decrypted_api_secret"];    

  const timestamp = Date.now();
  const query = `timestamp=${timestamp}&omitZeroBalances=true`;
  const signature = crypto
    .createHmac("sha256", API_SECRET)
    .update(query)
    .digest("hex");

  const url = `https://fapi.binance.com/fapi/v2/account?${query}&signature=${signature}`;

  const res = await fetch(url, {
    headers: {
      "X-MBX-APIKEY": API_KEY
    }
  });

  const data = await res.json();
  const totalMarginBalance = data.totalMarginBalance;
  //console.log(data);
  return json({totalMarginBalance})
};

//getAccountInfo();
