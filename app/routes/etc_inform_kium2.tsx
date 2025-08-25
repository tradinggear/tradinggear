import { json, LoaderFunction, ActionFunction  } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

export const action: ActionFunction = async ({ request }) => {
//export const loader: LoaderFunction = async () => {
//async function fetchAccountSummary(acct_no) {
  const data = await request.json();
  //console.log("React에서 받은 값:", data);
  //return data.email;

  const acct_no = "12345678901";

  const host = 'https://api.kiwoom.com';
  const tokenUrl = `${host}/oauth2/token`;

  const tokenHeaders = {
    'Content-Type': 'application/json;charset=UTF-8',
  };
/*
  const tokenData = {
    'grant_type': 'client_credentials',
    'appkey': '89XtCDXIQLbS2wTC7S5dvsQ4WdKK6W-5O9fO0XJzS1w',
    'secretkey': 'ooGf1ohzSgLaIPGY53ZrKvC54ucu_qm3GV_jL5MSrYQ',
  };
*/

    const value = String(data.email);

    const form = new URLSearchParams();
    form.append("email", value ?? "");  

    const res = await fetch('https://tradinggear.co.kr:8081/tradinggear/member_inform_get.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded', // ✅ JSON 형식 명시
        },
        body: form.toString(),
    });    
    
    const data1 = await res.json(); 
    
    const tokenData = {
        'grant_type': 'client_credentials',
        'appkey': data1[0]["decrypted_api_key"],
        'secretkey': data1[0]["decrypted_api_secret"],
    };


    const tokenResponse = await fetch(tokenUrl, {
        method: 'POST',
        headers: tokenHeaders,
        body: JSON.stringify(tokenData),
    });

    const tokenJson = await tokenResponse.json();
    const accessToken = tokenJson.token;

    const base = `${host}/oauth2/acnt`;
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
    };






    // 평가금액
    let headers2 = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
        'api-id': 'kt00018',
        'cont-yn': 'N', 
        'next-key': 'N'      
    };

    let respEval = await fetch(`${host}/api/dostk/acnt`, {
        method: 'POST',
        headers: headers2,
        body: JSON.stringify({ acct_no, dmst_stex_tp: 'KRX', qry_tp: '1' }),
    });
    let evalJson = await respEval.json();
    let tot_evlt_pl = evalJson.tot_evlt_pl ?? 0;
    let tot_prft_rt = evalJson.tot_prft_rt ?? 0;

    let rateUpAndDown = tot_prft_rt >= 0 ? "+" : "-";

    const totalAsset = json({"tot_evlt_pl" : rateUpAndDown + Number(tot_evlt_pl), "tot_prft_rt" : rateUpAndDown + parseFloat(Math.abs(tot_prft_rt).toFixed(2))});

    return totalAsset;
}

// 호출 예
//fetchAccountSummary("12345678901").then(asset => {
//  console.log("총 자산:", asset);
//});
