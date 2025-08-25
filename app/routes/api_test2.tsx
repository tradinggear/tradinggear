import { json, LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

export const loader: LoaderFunction = async () => {
  const host = 'https://api.kiwoom.com';
  const tokenEndpoint = '/oauth2/token';
  const tokenUrl = host + tokenEndpoint;

  const tokenHeaders = {
    'Content-Type': 'application/json;charset=UTF-8',
  };

  const tokenData = {
    'grant_type': 'client_credentials',
    'appkey': '89XtCDXIQLbS2wTC7S5dvsQ4WdKK6W-5O9fO0XJzS1w',
    'secretkey': 'ooGf1ohzSgLaIPGY53ZrKvC54ucu_qm3GV_jL5MSrYQ',
  };

  const tokenResponse = await fetch(tokenUrl, {
    method: 'POST',
    headers: tokenHeaders,
    body: JSON.stringify(tokenData),
  });

  const tokenJson = await tokenResponse.json();
  const accessToken = tokenJson.token;

  const headers2 = {
    'Content-Type': 'application/json;charset=UTF-8',
    'authorization': `Bearer ${accessToken}`,
    'api-id': 'kt00001',
  };

  const accountParams = {
    'dmst_stex_tp': 'KRX',
  };

  const acntResponse = await fetch(`${host}/api/dostk/acnt`, {
    method: 'POST',
    headers: headers2,
    body: JSON.stringify(accountParams),
  });

  const acntJson = await acntResponse.json();

  const headers3 = {
    'Content-Type': 'application/json;charset=UTF-8',
    'authorization': `Bearer ${accessToken}`,
    'api-id': 'kt00018',
  };

  const acnt2Params = {
    'qry_tp': '3',
  };

  const acnt2Response = await fetch(`${host}/api/dostk/acnt`, {
    method: 'POST',
    headers: headers3,
    body: JSON.stringify(acnt2Params),
  });

  const acnt2Json = await acnt2Response.json();

  const result = Number(acnt2Json['total_evlu_amt'] + acntJson['entr'] - acnt2Json['loan_sum']);

  //return json({
  //  result,
    //acntJson,
    //acnt2Json,
  //});
  return result;
};

//export default function ApiTest() {
//  const data = useLoaderData<typeof loader>();

//  return json(data.result);
/*
  return (
    <div>
      <h2>API 테스트 결과</h2>
      <p>잔여 평가 금액 - 대출 합계 + entr: <strong>{data.result}</strong></p>
      <pre>{JSON.stringify(data.acntJson, null, 2)}</pre>
      <pre>{JSON.stringify(data.acnt2Json, null, 2)}</pre>
    </div>
  );
*/  
//}
