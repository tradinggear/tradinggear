// app/routes/kiwoom.tsx
import { json, ActionFunction } from "@remix-run/node";

export const action: ActionFunction = async ({ request }) => {
  const { email } = await request.json();

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

  const holdingsRes = await fetch("https://api.kiwoom.com/api/dostk/acnt", {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
      'api-id': 'kt00004',
    },
    body: JSON.stringify({
      acct_no: "12345678901",
      dmst_stex_tp: "KRX",
      qry_tp: "1",
    }),
  });

  const holdingsJson = await holdingsRes.json();
  const count = holdingsJson.output?.length ?? 0;

  return json({ "count" : count });
};
