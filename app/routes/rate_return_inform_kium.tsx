// app/routes/kiwoom.tsx
import { json, LoaderFunction, ActionFunction } from "@remix-run/node";

//export const action: ActionFunction = async ({ request }) => {
//  const { email } = await request.json();
export const loader: LoaderFunction = async () => {
  const email = "lovedisket@naver.com";
  const form = new URLSearchParams();
  form.append("email", email);

  const res = await fetch('https://tradinggear.co.kr:8081/tradinggear/member_inform_get.php', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: form.toString(),
  });

  const userInfo = await res.json();

  const tokenRes = await fetch("https://api.kiwoom.com/oauth2/token", {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      grant_type: 'client_credentials',
      appkey: userInfo[0]["decrypted_api_key"],
      secretkey: userInfo[0]["decrypted_api_secret"],
    }),
  });

  const tokenJson = await tokenRes.json();
  const accessToken = tokenJson.token;

  const today = new Date();
  const yyyyMMdd = today.toISOString().slice(0, 10).replace(/-/g, ''); // 예: '20250724'  

  const holdingsRes = await fetch("https://api.kiwoom.com/api/dostk/acnt", {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
      'api-id': 'kt00016',     
      "cont_yn": "N",               
      "next_key": "",
      "fr_dt": yyyyMMdd,     
      "to_dt": yyyyMMdd,             
    },
    body: JSON.stringify({
      stex_tp : "KRX",
      "fr_dt": yyyyMMdd,     
      "to_dt": yyyyMMdd,
      "cont_yn": "N",               
      "next_key": ""               
    }),
  });

  const holdingsJson = await holdingsRes.json();
  //const count = holdingsJson.output?.length ?? 0;

  const oneWeekLater = new Date(today);
  oneWeekLater.setDate(today.getDate() + 7);  
  const oneWeekLater2 = oneWeekLater.toISOString().slice(0, 10).replace(/-/g, '');

  const holdingsRes2 = await fetch("https://api.kiwoom.com/api/dostk/acnt", {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
      'api-id': 'kt00016',     
      "cont_yn": "N",               
      "next_key": "",
      "fr_dt": oneWeekLater2,     
      "to_dt": oneWeekLater2,             
    },
    body: JSON.stringify({
      stex_tp : "KRX",
      "fr_dt": oneWeekLater2,     
      "to_dt": oneWeekLater2,
      "cont_yn": "N",               
      "next_key": ""               
    }),
  });

  const holdingsJson2 = await holdingsRes2.json();
  //const count = holdingsJson.output?.length ?? 0;

  const oneMonthLater = new Date(today);
  oneMonthLater.setMonth(today.getMonth() + 1);
  const oneMonthLater2 = oneMonthLater.toISOString().slice(0, 10).replace(/-/g, '');   

  const holdingsRes3 = await fetch("https://api.kiwoom.com/api/dostk/acnt", {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
      'api-id': 'kt00016',     
      "cont_yn": "N",               
      "next_key": "",
      "fr_dt": oneMonthLater2,     
      "to_dt": oneMonthLater2,             
    },
    body: JSON.stringify({
      stex_tp : "KRX",
      "fr_dt": oneMonthLater2,     
      "to_dt": oneMonthLater2,
      "cont_yn": "N",               
      "next_key": ""               
    }),
  });

  const holdingsJson3 = await holdingsRes3.json();
  //const count = holdingsJson.output?.length ?? 0;

  return json({ "rateOfReturnToday" : holdingsJson, "rateOfReturn7day" : holdingsJson2, "rateOfReturn1month" : holdingsJson3 });
};
