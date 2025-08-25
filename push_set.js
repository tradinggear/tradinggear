// ✅ Firebase Cloud Messaging + Binance WebSocket 예제
// 조건: 특정 코인 (BTCUSDT), 매도/매수 수량 10 이상일 때 푸시 알림 전송

// 서버: Node.js + Firebase Admin SDK

// 1. firebase-admin 설치 필요
// npm install firebase-admin ws

import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

const WebSocket = require('ws');
const admin = require('firebase-admin');
//const serviceAccount = require('./firebase-adminsdk.json'); // Firebase Admin SDK Key
const serviceAccount = require('./tradinggearsub-firebase-adminsdk-fbsvc-2d84c4aee6.json'); // Firebase Admin SDK Key

const firebaseConfig = {
  apiKey: "YOUR_FIREBASE_API_KEY",
  authDomain: "xxx.firebaseapp.com",
  projectId: "xxx",
  messagingSenderId: "xxxxxx",
  appId: "xxxxxxx"
};

const firebaseApp = initializeApp(firebaseConfig);
const messaging = getMessaging(firebaseApp);

// 사용자 브라우저에서 권한 요청 + 토큰 발급
export const requestFcmToken = async () => {
  try {
    const token = await getToken(messaging, {
      vapidKey: 'YOUR_PUBLIC_VAPID_KEY', // Firebase 콘솔에서 확인
    });
    console.log('✅ FCM Token:', token);
    return token;
  } catch (err) {
    console.error('❌ FCM Token 발급 실패:', err);
    return null;
  }
};

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// ✅ FCM으로 푸시 보내는 함수
async function sendPush(fcmToken, title, body) {
  const message = {
    notification: { title, body },
    token: fcmToken,
  };
  try {
    const response = await admin.messaging().send(message);
    console.log('✅ 푸시 발송 성공:', response);
  } catch (error) {
    console.error('❌ 푸시 발송 실패:', error);
  }
}

// ✅ Binance WebSocket 연결
const ws = new WebSocket('wss://stream.binance.com:9443/ws/btcusdt@trade');

// ✅ 기준 수량 및 사용자 토큰
const thresholdQty = 10;
//const userFcmToken = '사용자의_FCM_디바이스_토큰'; // React에서 받아 저장해둔 값
const userFcmToken = '사용자의_FCM_디바이스_토큰'; // React에서 받아 저장해둔 값

ws.on('open', () => {
  console.log('✅ Binance WebSocket 연결됨');
});

ws.on('message', async (data) => {
  const trade = JSON.parse(data);
  const qty = parseFloat(trade.q);
  const price = parseFloat(trade.p);
  const isBuyerMaker = trade.m; // true: 매수 체결, false: 매도 체결

  if (qty >= thresholdQty) {
    const side = isBuyerMaker ? '매수' : '매도';
    const msg = `[${side}] ${qty}개 체결 (${price} USDT)`;
    console.log('🔔 알림 조건 만족:', msg);
    await sendPush(userFcmToken, 'Binance 체결 알림', msg);
  }
});

ws.on('error', console.error);
ws.on('close', () => console.log('WebSocket 연결 종료됨'));

// 🔔 FCM 토큰은 React 클라이언트에서 수집해 DB에 저장하고 여기서 읽어 사용해야 함
