import { createCookie } from "@remix-run/node";

// JS에서 읽어 폼에 채울 거면 httpOnly:false
export const loginIdCookie = createCookie("loginId", {
  path: "/",
  httpOnly: false, // ← 폼 자동완성용이면 false
  sameSite: "lax",
  secure: process.env.NODE_ENV === "production",
  maxAge: 60 * 60 * 24 * 30, // 30일
  // 도메인 통일 필요시: domain: ".tradinggear.co.kr",
});
