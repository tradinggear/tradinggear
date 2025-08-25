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
    const headers2 = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
        'api-id': 'kt00018' // TR명
    };

    const respEval = await fetch(`${host}/api/dostk/acnt`, {
        method: 'POST',
        headers: headers2,
        body: JSON.stringify({ acct_no, dmst_stex_tp: 'KRX', qry_tp: '1' }),
    });
    const evalJson = await respEval.json();
    const total_evlu_amt = evalJson.tot_evlt_amt ?? 0;

    // 예수금
    const headers3 = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
        'api-id': 'kt00001' // TR명
    };

    const respDeposit = await fetch(`${host}/api/dostk/acnt`, {
        method: 'POST',
        headers: headers3,
        body: JSON.stringify({ acct_no, pwd: '', qry_tp: '2' }),
    });
    const depositJson = await respDeposit.json();
    const deposit = depositJson.entr ?? 0;

    // 대출
    const headers4 = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
        'api-id': 'kt00001' // TR명
    };

    const respCredit = await fetch(`${host}/api/dostk/acnt`, {
        method: 'POST',
        headers: headers4,
        body: JSON.stringify({ acct_no, dmst_stex_tp: 'KRX', qry_tp: '2' }),
    });
    const creditJson = await respCredit.json();
    const loan_sum = creditJson.loan_sum ?? 0;

    const totalAsset = Number(total_evlu_amt + deposit - loan_sum);
    return totalAsset;
}

// 호출 예
//fetchAccountSummary("12345678901").then(asset => {
//  console.log("총 자산:", asset);
//});
