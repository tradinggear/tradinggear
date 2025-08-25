import { json, LoaderFunction, ActionFunction } from "@remix-run/node";

// 체결잔고요청(kt00005)
async function fn_kt00005(token: String, data: { [key: string]: any }, cont_yn = 'N', next_key = '') {
    // 1. 요청할 API URL
    // const host = 'https://mockapi.kiwoom.com'; // 모의투자
    const host = 'https://api.kiwoom.com'; // 실전투자
    const endpoint = '/api/dostk/acnt';
    const url = host + endpoint;

    // 2. header 데이터
    const headers = {
        'Content-Type': 'application/json;charset=UTF-8', // 컨텐츠 타입
        'authorization': `Bearer ${token}`, // 접근 토큰
        'cont-yn': "N", // 연속 조회 여부
        'next-key': "N", // 연속 조회 키
        'api-id': 'kt00005' // TR명
    };

    try {
        // 3. HTTP POST 요청
        const response = await fetch(url, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(data)
        });

        // 응답 헤더 출력
        
        const responseHeaders = {
            'next-key': response.headers.get('next-key'),
            'cont-yn': response.headers.get('cont-yn'),
            'api-id': response.headers.get('api-id')
        };
        
       /*
        const responseHeaders = {
            'next-key': 'N',
            'cont-yn': 'N',
            'api-id': 'kt00005'
        };
        */

        console.log('code :', response.status);
        console.log('header :', JSON.stringify(responseHeaders, null, 4));

        // 응답 본문 출력
        const responseBody = await response.json();
        console.log('body :', JSON.stringify(responseBody.stk_cntr_remn, null, 4));
        return JSON.stringify(responseBody.stk_cntr_remn, null, 4);
    } catch (error) {
        console.error('요청 실패:', error);
        return ('요청 실패:' + error);
    }
}

// 실행 구간
//(async () => {
export const action: ActionFunction = async ({ request }) => {
  const { email } = await request.json();
//export const loader: LoaderFunction = async () => {

    //const email = "lovedisket@naver.com";
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

    // 1. 토큰 설정
    const MY_ACCESS_TOKEN = accessToken; // 접근 토큰

    // 2. 요청 데이터
    /*
    const params = {
        'strt_dt': '20250101', // 시작일자 
        'end_dt': '20250728', // 종료일자 
        'tp': '3', // 구분 0:전체,1:입출금,2:입출고,3:매매,4:매수,5:매도,6:입금,7:출금,A:예탁담보대출입금,B:매도담보대출입금,C:현금상환(융자,담보상환),F:환전,M:입출금+환전,G:외화매수,H:외화매도,I:환전정산입금,J:환전정산출금
        'stk_cd': '', // 종목코드 
        'crnc_cd': '', // 통화코드 
        'gds_tp': '0', // 상품구분 0:전체, 1:국내주식, 2:수익증권, 3:해외주식, 4:금융상품
        'frgn_stex_code': '', // 해외거래소코드 
        'dmst_stex_tp': '%', // 국내거래소구분 %:(전체),KRX:한국거래소,NXT:넥스트트레이드
    };
    */
    const params = {
        'dmst_stex_tp': 'KRX'
    };

    // 3. API 실행
    const returnValue = await fn_kt00005(MY_ACCESS_TOKEN, params);

    return returnValue;
    // next-key, cont-yn 값이 있을 경우
    // await fn_kt00015(MY_ACCESS_TOKEN, params, 'Y', 'nextkey..');
};
//})();