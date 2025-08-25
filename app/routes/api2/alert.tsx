import { json, type ActionFunction } from "@remix-run/node";
import admin from "firebase-admin";
import fs from "fs";
import path from "path";

// Firebase Admin SDK 인증 키 파일 경로 (필요 시 경로 조정)
const serviceAccountPath = path.resolve("tradinggearsub-firebase-adminsdk-fbsvc-2d84c4aee6.json");

// 인증 정보 로드
const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, "utf8"));

// Firebase 초기화 (중복 방지)
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

// POST 요청 처리: 푸시 알림 전송
export const action: ActionFunction = async ({ request }) => {
  try {
    const { token, title, body } = await request.json();

    const message = {
      token,
      notification: {
        title,
        body,
      },
    };

    const response = await admin.messaging().send(message);
    console.log("✅ FCM 전송 성공:", response);
    return json({ success: true });
  } catch (error: any) {
    console.error("❌ FCM 전송 실패:", error);
    return json({ success: false, error: error.message }, { status: 500 });
  }
};
