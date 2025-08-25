// app/routes/logout.tsx
import { useEffect, useRef } from 'react';
import { useNavigate } from '@remix-run/react';

export default function Logout() {
  const navigate = useNavigate();
  const hasLoggedOut = useRef(false); // ✅ 중복 실행 방지용

  useEffect(() => {
    if (!hasLoggedOut.current) {
      //sessionStorage.clear();
      //sessionStorage.removeItem("email");
      //sessionStorage.removeItem("fullName");
      //sessionStorage.removeItem("nickName");

      alert("로그인 해주세요."); // ✅ 1번만 실행됨
      hasLoggedOut.current = true;
      navigate('/admin/login');
    }
  }, []);

  return null; // 아무것도 렌더링하지 않음
}
