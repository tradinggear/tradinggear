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
        'next-key': '2'      
    };

    let respEval = await fetch(`${host}/api/dostk/acnt`, {
        method: 'POST',
        headers: headers2,
        body: JSON.stringify({ acct_no, dmst_stex_tp: 'KRX', qry_tp: '2' }),
    });
    let evalJson = await respEval.json();
    let total_evlu_amt = evalJson.tot_evlt_amt ?? 0;

    // 예수금
    let headers3 = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
        'api-id': 'kt00001', // TR명
        'cont-yn': 'N', 
        'next-key': '2'            
    };

    let respDeposit = await fetch(`${host}/api/dostk/acnt`, {
        method: 'POST',
        headers: headers3,
        body: JSON.stringify({ acct_no, pwd: '', qry_tp: '2' }),
    });
    let depositJson = await respDeposit.json();
    let deposit = depositJson.entr ?? 0;

    // 대출
    let headers4 = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
        'api-id': 'kt00001', // TR명
        'cont-yn': 'N', 
        'next-key': '2'            
    };

    let respCredit = await fetch(`${host}/api/dostk/acnt`, {
        method: 'POST',
        headers: headers4,
        body: JSON.stringify({ acct_no, dmst_stex_tp: 'KRX', qry_tp: '2' }),
    });
    let creditJson = await respCredit.json();
    let loan_sum = creditJson.loan_sum ?? 0;

    const totalAsset = Number(total_evlu_amt + deposit - loan_sum);










    // 평가금액
    headers2 = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
        'api-id': 'kt00018',
        'cont-yn': 'Y', 
        'next-key': '2'      
    };

    respEval = await fetch(`${host}/api/dostk/acnt`, {
        method: 'POST',
        headers: headers2,
        body: JSON.stringify({ acct_no, dmst_stex_tp: 'KRX', qry_tp: '2' }),
    });
    evalJson = await respEval.json();
    //const total_evlu_amt2 = evalJson.tot_evlt_amt ?? 0;

    let total_evlu_amt2 = 0;
    // 상세 내역 반복
    if (Array.isArray(evalJson)) {
        for (const item of evalJson) {
            //const stockName = item.itnm;        // 종목명
            //const quantity = item.qty;          // 수량
            //const evalAmt = item.evlt_amt;      // 평가금액
            //const profitRate = item.evlt_erng_rt; // 수익률 등

            if(item['next-key'] == 2) {
                total_evlu_amt2 = Number(item['tot_evlt_amt']) ?? 0;
            }

            //console.log(`종목: ${stockName}, 수량: ${quantity}, 평가금액: ${evalAmt}, 수익률: ${profitRate}`);
        }
    }
    //} else {
    //    console.warn("반복 가능한 details 배열이 없습니다.");
    //}

    // 예수금
    headers3 = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
        'api-id': 'kt00001', // TR명
        'cont-yn': 'Y', 
        'next-key': '2'            
    };

    respDeposit = await fetch(`${host}/api/dostk/acnt`, {
        method: 'POST',
        headers: headers3,
        body: JSON.stringify({ acct_no, pwd: '', qry_tp: '2' }),
    });
    depositJson = await respDeposit.json();
    //let deposit2 = depositJson.entr ?? 0;

    let deposit2 = 0;
    // 상세 내역 반복
    if (Array.isArray(depositJson)) {
        for (const item of depositJson) {
            //const stockName = item.itnm;        // 종목명
            //const quantity = item.qty;          // 수량
            //const evalAmt = item.evlt_amt;      // 평가금액
            //const profitRate = item.evlt_erng_rt; // 수익률 등

            if(item['next-key'] == 2) {
                deposit2 = Number(item['entr']) ?? 0;
            }

            //console.log(`종목: ${stockName}, 수량: ${quantity}, 평가금액: ${evalAmt}, 수익률: ${profitRate}`);
        }
    }
    //} else {
    //    console.warn("반복 가능한 details 배열이 없습니다.");
    //}

    // 대출
    headers4 = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
        'api-id': 'kt00001', // TR명
        'cont-yn': 'Y', 
        'next-key': '2'            
    };

    respCredit = await fetch(`${host}/api/dostk/acnt`, {
        method: 'POST',
        headers: headers4,
        body: JSON.stringify({ acct_no, dmst_stex_tp: 'KRX', qry_tp: '2' }),
    });
    creditJson = await respCredit.json();
    //const loan_sum2 = creditJson.loan_sum ?? 0;


    let loan_sum2 = 0;
    // 상세 내역 반복
    if (Array.isArray(depositJson)) {
        for (const item of creditJson) {
            //const stockName = item.itnm;        // 종목명
            //const quantity = item.qty;          // 수량
            //const evalAmt = item.evlt_amt;      // 평가금액
            //const profitRate = item.evlt_erng_rt; // 수익률 등

            if(item['next-key'] == 2) {
                loan_sum2 = Number(item['loan_sum']) ?? 0;
            }

            //console.log(`종목: ${stockName}, 수량: ${quantity}, 평가금액: ${evalAmt}, 수익률: ${profitRate}`);
        }
    }
    //} else {
    //    console.warn("반복 가능한 details 배열이 없습니다.");
    //}    

    const totalAsset2 = Number(total_evlu_amt2 + deposit2 - loan_sum2);

    // 상승률 (%) = ((금일 총자산 - 전일 총자산) / 전일 총자산) × 100
    const percent = Number(((totalAsset - totalAsset2) / totalAsset2) * 100);

    let percent2 = 0;
    if (totalAsset2 !== 0) {
      percent2 = ((totalAsset - totalAsset2) / totalAsset2) * 100;
    }

    return percent2;
}

// 호출 예
//fetchAccountSummary("12345678901").then(asset => {
//  console.log("총 자산:", asset);
//});
