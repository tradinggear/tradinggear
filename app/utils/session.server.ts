// utils/session.server.ts
import { createCookieSessionStorage } from "@remix-run/node";

// 쿠키 세션 스토리지 생성
export const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "__session",
    secrets: ["6jdUh9gVrAHDI"], // .env에서 가져와도 좋음
    sameSite: "lax",
    path: "/",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  },
});

export const getSession = (request: Request) => {
  return sessionStorage.getSession(request.headers.get("Cookie"));
};

export const commitSession = (session: any) => {
  return sessionStorage.commitSession(session);
};

export const destroySession = (session: any) => {
  return sessionStorage.destroySession(session);
};
