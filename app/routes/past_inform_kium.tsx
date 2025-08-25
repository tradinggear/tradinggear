// app/routes/past_inform_kium.tsx
import { json, ActionFunction } from "@remix-run/node";

//async function getAssetChangeRate() {
export const action: ActionFunction = async ({ request }) => {
  const host = "https://api.kiwoom.com";
  const tokenUrl = host + "/oauth2/token";

  // 1. 토큰 요청
  const tokenRes = await fetch(tokenUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
    },
    body: JSON.stringify({
      grant_type: "client_credentials",
      appkey: "89XtCDXIQLbS2wTC7S5dvsQ4WdKK6W-5O9fO0XJzS1w",
      secretkey: "ooGf1ohzSgLaIPGY53ZrKvC54ucu_qm3GV_jL5MSrYQ",
    }),
  });

  const tokenData = await tokenRes.json();
  const token = tokenData.token;

  // 2. 평가금액 API 요청
  const evalRes = await fetch(host + "/oauth2/acnt/evalBalance", {
    method: "POST",
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
      "Authorization": `Bearer ${token}`,
      "api-id": "kt00001"  // TR명은 실제 사용 환경에 따라 다를 수 있음
    },
    body: JSON.stringify({
      acct_no: "YOUR_ACCOUNT_NUMBER",
      pwd: "",
      qry_tp: "2",  // 일반조회
    }),
  });

  const evalData = await evalRes.json();

  const todayTotal = Number(evalData.total_evlu_amt);     // 금일 총자산
  const yesterdayTotal = Number(evalData.d2prev_evlu_amt); // 전일 총자산

  // 3. 상승률 계산
  const diff = todayTotal - yesterdayTotal;
  const rate = ((diff) / yesterdayTotal) * 100;

  console.log(`금일 총자산: ${todayTotal}원`);
  console.log(`전일 총자산: ${yesterdayTotal}원`);
  console.log(`전일 대비 변화: ${diff >= 0 ? "▲" : "▼"} ${Math.abs(rate).toFixed(2)}%`);

  // 상승률 (%) = ((금일 총자산 - 전일 총자산) / 전일 총자산) × 100

  return rate;
}
