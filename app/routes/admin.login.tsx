import React, { useState, useEffect, useRef } from 'react';
import { 
  Eye,
  EyeOff,
  Lock,
  Mail,
  Moon,
  Sun,
  User
} from 'lucide-react';

import type { ActionFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { getSession, commitSession } from "@/utils/session.server";
import { loginIdCookie } from "@/utils/cookies.server";

const AdminLoginPage = () => {
  const idRef = useRef<HTMLInputElement>(null);
  const [isDarkMode, setIsDarkMode] = useState(true);

  // 로그인 폼 상태
  const [loginForm, setLoginForm] = useState({
    userId: idRef.current?.value,
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [isLoading, setIsLoading] = useState(false);


  // 쿠키 저장 (30일)
  function setLoginIdCookie(email: string) {
    const maxAge = 60 * 60 * 24 * 30; // 30일
    const sameSite = "Lax";
    const secure = location.protocol === "https:" ? "; Secure" : "";
    document.cookie =
      `loginId=${encodeURIComponent(email)}; Max-Age=${maxAge}; Path=/; SameSite=${sameSite}${secure}`;
    // 필요 시 도메인 지정: ; Domain=.tradinggear.co.kr
  }

  // 쿠키 읽기
  function getLoginIdCookie(): string | null {
    const m = document.cookie.match(/(?:^|;\s*)loginId=([^;]+)/);
    return m ? decodeURIComponent(m[1]) : null;
  }

  // 쿠키 삭제
  function removeLoginIdCookie() {
    document.cookie = `loginId=; Max-Age=0; Path=/`;
  }

  useEffect(() => {
    const saved = getLoginIdCookie();

    const el = document.getElementById("userId") as HTMLInputElement || null;
    if(saved == null) {
      el.value = "";
    } else {
      if (el) el.value = String(saved);    
    }


  }, []);

  // 로그인 처리
  const handleLogin = async () => {
    setIsLoading(true);
    setLoginError('');

    // 시뮬레이션된 로그인 (실제로는 서버 API 호출)
    setTimeout( async () => {

      //const email_value = String(loginForm.userId);
      const email_value = String(idRef.current?.value);
      const pwd_value = String(loginForm.password);
      
      const form1 = new URLSearchParams();
      form1.append("email", email_value ?? "");
      form1.append("pwd", pwd_value ?? "");     

      console.log(form1);

      const res = await fetch("https://tradinggear.co.kr:8081/tradinggear/admin_pass_check.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },      
        body: form1,
      });

      const data1 = await res.text();    
      //setArray(data1);
      console.log(data1);
      const data2 = data1.split("|@|");
      //console.log(data2[1]);
      //console.log(data2[0]);    
      //return;

      if(data2[0] == "wrong") {
        //alert("로그인 정보가 잘못되었습니다.");
        setIsLoading(false);
        setLoginError('이메일 또는 비밀번호가 올바르지 않습니다.');
        return;
      }

      //alert(data2[1]);

      // 성공 시 아이디 쿠키 저장
      setLoginIdCookie(email_value);



      sessionStorage.setItem("adminEmail", String(email_value)); // 👈 브라우저 세션에 저장
      sessionStorage.setItem("adminNickName", String(data2[1]));      

      setLoginError('');
      setIsLoading(false);
      window.location.href = '/admin/member';
      /*
      if (loginForm.userId === '' && loginForm.password === '') {
        // 로그인 성공
        localStorage.setItem('adminLoggedIn', 'true');
        localStorage.setItem('adminUserId', loginForm.userId);
        
        // 실제 환경에서는 router.push('/admin') 또는 window.location.href = '/admin'
        //alert('로그인 성공! 관리자 페이지로 이동합니다.');
        //window.location.href = '/admin/member'; // 실제 환경에서 사용
        
        setLoginError('');
      } else {
        setLoginError('이메일 또는 비밀번호가 올바르지 않습니다.');
      }
      setIsLoading(false);
      */
    }, 1000);
  };

  // 테마별 색상 클래스
  const themeClasses = {
    bg: isDarkMode ? 'bg-gray-900' : 'bg-gray-50',
    card: isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200',
    text: isDarkMode ? 'text-white' : 'text-gray-900',
    textSecondary: isDarkMode ? 'text-gray-300' : 'text-gray-600',
    textMuted: isDarkMode ? 'text-gray-400' : 'text-gray-500',
    input: isDarkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500',
  };

  return (
    <div className={`px-10 min-h-screen flex items-center justify-center ${themeClasses.bg}`}>
      <div className={`w-full max-w-md ${themeClasses.card} border rounded-lg shadow-lg p-8`}>
        {/* 로고/제목 */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <h1 className={`text-2xl font-bold ${themeClasses.text} mb-2`}>관리자 로그인</h1>
        </div>

        {/* 로그인 폼 */}
        <div className="space-y-6">
          {/* 아이디 입력 */}
          <div>
            <label htmlFor="userId" className={`block text-sm font-medium ${themeClasses.textSecondary} mb-2`}>
              아이디
            </label>
            <div className="relative">
              <User className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${themeClasses.textMuted}`} />
              <input
                type="id"
                id="userId"
                value={loginForm.userId}
                onChange={(e) => setLoginForm({...loginForm, userId: e.target.value})}
                onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                className={`w-full pl-10 pr-4 py-3 ${themeClasses.input} border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                placeholder="아이디를 입력하세요"
                ref={idRef}
              />
            </div>
          </div>

          {/* 비밀번호 입력 */}
          <div>
            <label htmlFor="password" className={`block text-sm font-medium ${themeClasses.textSecondary} mb-2`}>
              비밀번호
            </label>
            <div className="relative">
              <Lock className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${themeClasses.textMuted}`} />
              <input
                type={showPassword ? 'text' : 'password'}
                value={loginForm.password}
                onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
                onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                className={`w-full pl-10 pr-12 py-3 ${themeClasses.input} border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                placeholder="비밀번호를 입력하세요"
                
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${themeClasses.textMuted} hover:${themeClasses.textSecondary}`}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* 에러 메시지 */}
          {loginError && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {loginError}
            </div>
          )}

          {/* 로그인 버튼 */}
          <button
            onClick={handleLogin}
            disabled={isLoading}
            className={`w-full py-3 px-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${isDarkMode ? 'focus:ring-offset-gray-800' : 'focus:ring-offset-white'}`}
          >
            {isLoading ? '로그인 중...' : '로그인'}
          </button>
        </div>

      </div>
    </div>
  );
};

export default AdminLoginPage;