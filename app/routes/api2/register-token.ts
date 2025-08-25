import type { ActionFunction } from "@remix-run/node";
import { json } from "@remix-run/node";

export const action: ActionFunction = async ({ request }) => {
  const { token } = await request.json();
  // DB 또는 메모리에 저장 (여기선 console.log)
  console.log("🔐 Received FCM token:", token);
  return json({ success: true });
};
