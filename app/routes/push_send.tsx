// app/routes/api/alert.ts (서버 측 푸시 전송 라우트)
import { json, type ActionFunction } from "@remix-run/node";
import admin from "firebase-admin";
//import serviceAccount from "@/tradinggearsub-firebase-adminsdk-fbsvc-2d84c4aee6.json";
import fs from "fs";
import path from "path";

// JSON 파일 경로 지정 (프로젝트 루트 기준)
const serviceAccountPath = path.resolve("tradinggearsub-firebase-adminsdk-fbsvc-2d84c4aee6.json");
const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, "utf8"));

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

export const action: ActionFunction = async ({ request }) => {
  const { token, title, body } = await request.json();

  try {
    const message = {
      token,
      notification: { title, body },
    };
    const response = await admin.messaging().send(message);
    console.log("✅ 메시지 전송 성공:", response);
    return json({ success: true });
  } catch (error) {
    console.error("❌ 푸시 전송 실패:", error);
    return json({ success: false, error: error.message }, { status: 500 });
  }
};

// app/routes/_index.tsx (클라이언트 측 FCM 등록 및 바이낸스 감지)
import { useEffect } from "react";
import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyC-oRTijXPXQCCnbK4MIMCl3saCLNUtGmA",
  authDomain: "tradinggearsub.firebaseapp.com",
  projectId: "tradinggearsub",
  storageBucket: "tradinggearsub.firebasestorage.app",
  messagingSenderId: "801432625850",
  appId: "1:801432625850:web:732d870f6fb6c015c61883",
  measurementId: "G-56L7LG4HM3"
};

//const vapidKey = "YOUR_PUBLIC_VAPID_KEY";
const vapidKey = "BCztRMfcZp5hh6qTyUIv51SJ1MvSCxJh9s8AORVdJqdWAYxjmAq-OH3uGwGMjNvDSNSnD1kxp_UnaQCgBCpmy5M";

export default function Index() {
  useEffect(() => {
    const app = initializeApp(firebaseConfig);
    const messaging = getMessaging(app);

    getToken(messaging, { vapidKey }).then(async (token) => {
      if (!token) return;

      const socket = new WebSocket("wss://stream.binance.com:9443/ws/btcusdt@trade");
      const threshold = 1000; // 수량 기준

      socket.onmessage = async (event) => {
        const data = JSON.parse(event.data);
        const qty = parseFloat(data.q);
        const isSell = data.m;
        const price = parseFloat(data.p);

        //if (qty > threshold) {
          await fetch("/api/alert", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              token,
              title: isSell ? "📉 매도 감지" : "📈 매수 감지",
              body: `수량: ${qty}, 가격: ${price}`,
            }),
          });
        //}
      };
    });

    onMessage(messaging, (payload) => {
      console.log("📥 푸시 수신:", payload);
    });
  }, []);

  return <h1>🔔 바이낸스 감지 중...</h1>;
}
