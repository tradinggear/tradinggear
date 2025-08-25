import { json, LoaderFunction } from "@remix-run/node";
import { useEffect } from "react";

export const loader: LoaderFunction = async ({ request }) => {
  return json({ message: "This is /api_test response!" });
};

export default function ApiTest() {
  useEffect(() => {
    const fetchData = async () => {
      let host = 'https://api.kiwoom.com'; // 실전투자
      let endpoint = '/oauth2/token';
      let url = host + endpoint;

      let headers = {
        'Content-Type': 'application/json;charset=UTF-8',
      };

      let data = {
        'grant_type': 'client_credentials',
        'appkey': '89XtCDXIQLbS2wTC7S5dvsQ4WdKK6W-5O9fO0XJzS1w',
        'secretkey': 'ooGf1ohzSgLaIPGY53ZrKvC54ucu_qm3GV_jL5MSrYQ',
      };

      //try {
        let response = await fetch(url, {
          method: 'POST',
          headers: headers,
          body: JSON.stringify(data),
        });

        let responseHeaders = {
          'next-key': response.headers.get('next-key'),
          'cont-yn': response.headers.get('cont-yn'),
          'api-id': response.headers.get('api-id'),
        };
        console.log('code :', response.status);
        console.log('header :', JSON.stringify(responseHeaders, null, 4));

        let responseBody = await response.json();

        //console.log(responseBody['expires_dt']);
        //console.log(responseBody['token']);

        console.log('body :', JSON.stringify(responseBody, null, 4));
      //} catch (error) {
      //  console.error('요청 실패:', error);
      //}

        // 1. 요청할 API URL
        // const host = 'https://mockapi.kiwoom.com'; // 모의투자
        host = 'https://api.kiwoom.com'; // 실전투자
        endpoint = '/api/dostk/acnt';
        url = host + endpoint;

        // 2. header 데이터
        let headers2 = {
            'Content-Type': 'application/json;charset=UTF-8', // 컨텐츠 타입
            'authorization': `Bearer ` + responseBody['token'], // 접근 토큰
            //'cont-yn': cont_yn, // 연속 조회 여부
            //'next-key': next_key, // 연속 조회 키
            'api-id': 'kt00005' // TR명
        };

        // 2. 요청 데이터
        const params = {
            'dmst_stex_tp': 'KRX', // 국내거래소구분 KRX:한국거래소,NXT:넥스트트레이드
        };
        
        //try {
            // 3. HTTP POST 요청
            response = await fetch(url, {
                method: 'POST',
                headers: headers2,
                body: JSON.stringify(params)
            });

            // 응답 헤더 출력
            responseHeaders = {
                'next-key': response.headers.get('next-key'),
                'cont-yn': response.headers.get('cont-yn'),
                'api-id': response.headers.get('api-id')
            };
            console.log('code :', response.status);
            console.log('header :', JSON.stringify(responseHeaders, null, 4));

            // 응답 본문 출력
            let responseBody2 = await response.json();

            console.log('body :', JSON.stringify(responseBody2, null, 4));

            console.log(responseBody2['entr']);

        //} catch (error) {
        //    console.error('요청 실패:', error);
        //}      

        // 1. 요청할 API URL
        // const host = 'https://mockapi.kiwoom.com'; // 모의투자
        host = 'https://api.kiwoom.com'; // 실전투자
        endpoint = '/api/dostk/acnt';
        url = host + endpoint;

        // 2. header 데이터
        const headers3 = {
            'Content-Type': 'application/json;charset=UTF-8', // 컨텐츠 타입
            'authorization': `Bearer ` + responseBody['token'], // 접근 토큰
            //'cont-yn': cont_yn, // 연속 조회 여부
            //'next-key': next_key, // 연속 조회 키
            'api-id': 'kt00001' // TR명
        };

        // 2. 요청 데이터
        const params2 = {
            'qry_tp': '3', // 조회구분 3:추정조회, 2:일반조회
        };        

		// 3. HTTP POST 요청
		const response3 = await fetch(url, {
			method: 'POST',
			headers: headers3,
			body: JSON.stringify(params2)
		});

		// 응답 헤더 출력
		const responseHeaders3 = {
			'next-key': response.headers.get('next-key'),
			'cont-yn': response.headers.get('cont-yn'),
			'api-id': response.headers.get('api-id')
		};
		console.log('code :', response3.status);
		console.log('header :', JSON.stringify(responseHeaders3, null, 4));

		// 응답 본문 출력
		const responseBody3 = await response3.json();
		console.log('body :', JSON.stringify(responseBody3, null, 4));

        return Number(responseBody3['loan_remn_evlt_amt'] + responseBody2['entr'] - responseBody3['loan_sum']);
    };

    fetchData(); // 호출
  }, []); // 빈 deps → 컴포넌트 마운트 시 1회 실행

  //return <p>API 테스트 페이지입니다.</p>;
}
