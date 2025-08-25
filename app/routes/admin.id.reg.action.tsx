import { redirect, type ActionFunctionArgs } from "@remix-run/node";
import { getSession, commitSession } from "@/utils/session.server";
import { loginIdCookie } from "@/utils/cookies.server";

export async function action({ request }: ActionFunctionArgs) {
  const form = await request.formData();
  const email = String(form.get("email") || "").trim();
  const password = String(form.get("password") || "");

  // TODO: 실제 인증 로직
  if (!email || !password) return new Response("Invalid", { status: 400 });
  const cookieHeader = request.headers.get("Cookie"); // string | null
  const session = await getSession(request);
  session.set("userId", "some-user-id"); // 인증 세션(별도)

  const headers = new Headers();
  headers.append("Set-Cookie", await commitSession(session));              // 인증 세션 쿠키
  headers.append("Set-Cookie", await loginIdCookie.serialize(email));      // 로그인 아이디 쿠키

  //return redirect("/dashboard", { headers });
}
