import type { MetaFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from '@remix-run/react';
import { useThemeStore } from '../stores/themeStore';
import Header from  '@/components/Header'
import Footer from  '@/components/Footer'
import TermsWarningPopup from '@/components/popup2'

import { getSession, commitSession } from "@/utils/session.server";

//import { json, redirect } from "@remix-run/node";
//import { getSession, commitSession } from "~/utils/session.server";

export const meta: MetaFunction = () => {
  return [
    { title: "Sign up - TRADING GEAR" },
    { name: "description", content: "Join the new era of AI trading" },
  ];
};

export default function SignUp() {
  const navigate = useNavigate();
  
  const [result, setResult] = useState(null);

  const { theme, isClient, initializeTheme } = useThemeStore();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false
  });

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");  

  const [readOnly, setreadOnly] = useState(false);

  const [result2, setResult2] = useState(0); 

  const idCountRef = useRef<HTMLInputElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const tradingCenterRef = useRef<HTMLSelectElement>(null);


  useEffect(() => {
    initializeTheme();
  }, [initializeTheme]);

  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  //const handleSubmit = async (e: React.FormEvent) => {
  //const handleSubmit = async (e: React.FormEvent<HTMLFormElement>, { request }: { request: Request }) => {
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    //console.log(password);
    //console.log(confirmPassword);    

    if (password !== confirmPassword) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }    

    // Handle signup logic here
    // console.log('Signup form submitted:', formData);
    const formData = new FormData(e.currentTarget);

    //console.log("선택한 셀렉트:", formData.get("tradingCenter"));

    //return;

    //const tradingCenterRefSet = String(tradingCenterRef.current?.value);
    //formData.append("tradingCenterSet2", tradingCenterRefSet);
    //console.log(formData.toString());
    //console.log(email);
    //return;


    const value2 = idCountRef.current?.value;
    //console.log(value);
    //return;
    const numeric = Number(value2);
    if(numeric >= 1) {
      alert("이미 가입된 아이디입니다.");
      return;
    }

    const res = await fetch("https://tradinggear.co.kr:8081/tradinggear/member_action.php", {
      method: "POST",
      body: formData,
    });

    const email = String(formData.get("email"));
    const fullName = String(formData.get("fullName"));
    const nickName = String(formData.get("nickName"));

    //const session = await getSession(request);
    //session.set("email", email); // 세션에 데이터 저장    

    //const data = await res.json();
    //setResult(data);    
    // Redirect to dashboard or login page after successful signup
    sessionStorage.setItem("email", email); // 👈 브라우저 세션에 저장
    sessionStorage.setItem("fullName", fullName);
    sessionStorage.setItem("nickName", nickName);
    navigate('/dashboard');
    //return redirect("/dashboard", {
    //  headers: {
    //    "Set-Cookie": await commitSession(session),
    //  },
    //});    
  };



  {/*const handleClick = () => {
    const value = inputRef.current?.value;
    console.log("입력값:", value);
  };*/}
  
  const idCheck = async () => {

    const value = inputRef.current?.value;
    //console.log("입력값:", value);

    if(value == "") {
      alert("아이디를 입력해주세요.");
      inputRef.current?.focus();
      return;
    }

    const form = new URLSearchParams();
    form.append("email", value ?? "");  

    const res = await fetch("https://tradinggear.co.kr:8081/tradinggear/id_check.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },      
      body: form.toString(),
    });

    const data1 = await res.text();
    const data3 = Number(data1);
    setResult2(data3);      

    const value2 = data3;
    //console.log(value);
    //return;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (typeof value !== 'string' || !emailRegex.test(value)) {
      //return json({ error: '유효한 이메일 형식이 아닙니다.' }, { status: 400 });
      setreadOnly(false);
      alert("유효한 이메일 형식이 아닙니다.");
      inputRef.current?.focus();  
      return;
    }    

    const numeric = Number(value2);
    //console.log(numeric);
    if(numeric == 0) {
      setreadOnly(true);
      alert("가입가능한 아이디입니다. 입력란은 읽기전용 처리됩니다.");
      return;      
    } else {
      setreadOnly(false);
      alert("이미 가입된 아이디입니다.");
      inputRef.current?.focus();
      return;      
    }

    //console.log("등록아이디숫자:",data1);

    //const data = await res.json();
    //setResult(data);
    // Redirect to dashboard or login page after successful signup
    //navigate('/dashboard');
  };

  const handleSocialSignup = (provider: string) => {
    // Handle social signup logic
    console.log(`Signup with ${provider}`);
  };

  const themeClasses = theme === 'dark' 
    ? 'bg-gradient-to-br from-slate-900 to-slate-800'
    : 'bg-gradient-to-br from-slate-100 to-slate-200';

  const cardClasses = theme === 'dark'
    ? 'bg-slate-800 border-slate-700'
    : 'bg-white border-slate-300';

  const inputClasses = theme === 'dark'
    ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400 focus:border-cyan-400 focus:ring-cyan-400'
    : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-500 focus:border-blue-500 focus:ring-blue-500';

  const textPrimary = theme === 'dark' ? 'text-white' : 'text-slate-900';
  const textSecondary = theme === 'dark' ? 'text-slate-400' : 'text-slate-600';
  const linkColor = theme === 'dark' ? 'text-cyan-400 hover:text-cyan-300' : 'text-blue-600 hover:text-blue-700';
  const buttonPrimary = theme === 'dark' 
    ? 'bg-gradient-to-r from-cyan-400 to-emerald-400 text-slate-900 hover:from-cyan-500 hover:to-emerald-500' 
    : 'bg-gradient-to-r from-blue-600 to-emerald-600 text-white hover:from-blue-700 hover:to-emerald-700';

  return (
    <div className={`min-h-screen transition-all duration-300 ${themeClasses}`}>
    <TermsWarningPopup/>  
    {/* Header */}
    <Header/>
    <div className="h-[80px]"></div>
    <div className={`min-h-screen flex items-center justify-center px-4 py-12 transition-all duration-300 ${themeClasses}`}>
      <div className={`w-full max-w-md space-y-8 p-8 rounded-2xl shadow-2xl border transition-all duration-300 ${cardClasses}`}>
        
        <div className="text-center">
          <h2 className={`text-3xl font-bold ${textPrimary}`}>Sign up</h2>
        </div>

        {/* Form */}
        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Full Name */}
          <div>
            <input
              id="fullName"
              name="fullName"
              type="text"
              required
              value={formData.fullName}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 rounded-lg border transition-all duration-200 focus:ring-2 focus:ring-opacity-50 ${inputClasses}`}
              placeholder="Full name"
            />
          </div>

          {/* Nick Name */}
          <div>
            <input
              id="nickName"
              name="nickName"
              type="text"
              required              
              onChange={handleInputChange}
              className={`w-full px-4 py-3 rounded-lg border transition-all duration-200 focus:ring-2 focus:ring-opacity-50 ${inputClasses}`}
              placeholder="Nick name"
            />
          </div>

          {/* Api Key */}
          {/*
          <div>
            <input
              id="apiKey"
              name="apiKey"
              type="text"
              onChange={handleInputChange}
              className={`w-full px-4 py-3 rounded-lg border transition-all duration-200 focus:ring-2 focus:ring-opacity-50 ${inputClasses}`}
              placeholder="Api key"
            />
          </div>
          */}
          {/* Email */}
          <div className="flex items-center gap-2">
            <input
              id="email"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleInputChange}
              className={`w-[200px] px-4 py-3 rounded-lg border transition-all duration-200 focus:ring-2 focus:ring-opacity-50 ${inputClasses}`}
              placeholder="Email"
              ref={inputRef}
              readOnly={readOnly}
            />
            <button type="button" className="w-full bg-blue-600 text-white px-6 py-3 rounded"
              onClick={idCheck}              
            >
              중복확인
            </button>            
            <input
              id="idCount"
              name="idCount"
              type="hidden"                                          
              className={`w-full px-4 py-3 rounded-lg border transition-all duration-200 focus:ring-2 focus:ring-opacity-50 ${inputClasses}`}
              value={result2}
              ref={idCountRef}
            />            
          </div>

          {/* Password */}
          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full px-4 py-3 pr-12 rounded-lg border transition-all duration-200 focus:ring-2 focus:ring-opacity-50 ${inputClasses}`}
              placeholder="Password"
            /
            >
            <button
              type="button"
              className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${textSecondary} hover:${textPrimary} transition-colors`}
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              )}
            </button>
            {error && <p style={{ color: "red" }}>{error}</p>}
          </div>

          {/* Confirm Password */}
          <div className="relative">
            <input
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={`w-full px-4 py-3 pr-12 rounded-lg border transition-all duration-200 focus:ring-2 focus:ring-opacity-50 ${inputClasses}`}
              placeholder="Confirm password"
            />
            <button
              type="button"
              className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${textSecondary} hover:${textPrimary} transition-colors`}
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              )}
            </button>
            {error && <p style={{ color: "red" }}>{error}</p>}
          </div>

          {/* Trading Center */}
          <div>
            <input type="hidden" id="tradingCenterSet" name="tradingCenterSet" />
            <select
              id="tradingCenter"            
              name="tradingCenter"
              className={`w-full px-4 py-3 pr-12 rounded-lg border transition-all duration-200 focus:ring-2 focus:ring-opacity-50 ${inputClasses}`} 
              required 
              ref={tradingCenterRef}            
            >
              <option value="" selected>Trading Center</option>
              <option value="binance">바이낸스</option>
              <option value="kium">키움증권</option>
            </select>
          </div>

          {/* Terms Agreement */}
          <div className="flex items-center">
            <input
              id="agreeToTerms"
              name="agreeToTerms"
              type="checkbox"
              required
              checked={formData.agreeToTerms}
              onChange={handleInputChange}
              className={`h-4 w-4 rounded border-2 ${theme === 'dark' ? 'border-slate-600 bg-slate-700 text-cyan-400 focus:ring-cyan-400' : 'border-slate-300 bg-white text-blue-600 focus:ring-blue-500'} focus:ring-2 focus:ring-opacity-50`}
            />
            <label htmlFor="agreeToTerms" className={`ml-3 text-sm ${textSecondary}`}>
              <a href="/terms" className={`${linkColor} underline`}>
                이용약관
              </a>
              과{' '}
              <a href="/privacy" className={`${linkColor} underline`}>
                개인정보처리방침
              </a>
              에 동의합니다.
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className={`w-full py-3 px-4 rounded-lg font-semibold text-lg transition-all duration-200 transform hover:scale-105 hover:shadow-lg ${buttonPrimary}`}
          >Sign up</button>
        </form>

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className={`w-full border-t ${theme === 'dark' ? 'border-slate-600' : 'border-slate-300'}`} />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className={`px-4 ${theme === 'dark' ? 'bg-slate-800' : 'bg-white'} ${textSecondary}`}>Or</span>
          </div>
        </div>

        {/* Social Signup Buttons */}
        <div className="grid grid-cols-4 gap-3">
          <button
            onClick={() => handleSocialSignup('google')}
            className={`flex justify-center items-center p-3 rounded-lg border transition-all duration-200 hover:scale-105 ${theme === 'dark' ? 'border-slate-600 bg-slate-700 hover:bg-slate-600' : 'border-slate-300 bg-white hover:bg-slate-50'}`}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
          </button>
          
          <button
            onClick={() => handleSocialSignup('apple')}
            className={`flex justify-center items-center p-3 rounded-lg border transition-all duration-200 hover:scale-105 ${theme === 'dark' ? 'border-slate-600 bg-slate-700 hover:bg-slate-600' : 'border-slate-300 bg-white hover:bg-slate-50'}`}
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
            </svg>
          </button>
          
          <button
            onClick={() => handleSocialSignup('facebook')}
            className={`flex justify-center items-center p-3 rounded-lg border transition-all duration-200 hover:scale-105 ${theme === 'dark' ? 'border-slate-600 bg-slate-700 hover:bg-slate-600' : 'border-slate-300 bg-white hover:bg-slate-50'}`}
          >
            <svg className="w-5 h-5" fill="#1877F2" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
          </button>
          
          <button
            onClick={() => handleSocialSignup('github')}
            className={`flex justify-center items-center p-3 rounded-lg border transition-all duration-200 hover:scale-105 ${theme === 'dark' ? 'border-slate-600 bg-slate-700 hover:bg-slate-600' : 'border-slate-300 bg-white hover:bg-slate-50'}`}
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
          </button>
        </div>

        {/* Login Link */}
        <div className="text-center">
          <span className={`text-sm ${textSecondary}`}>
            Already have an account?{' '}
            <button
              onClick={() => navigate('/login')}
              className={`font-medium ${linkColor} transition-colors`}
            >
              Log in
            </button>
          </span>
        </div>
      </div>
      

     </div>
      {/* Footer */}
      <Footer onLinkClick={(linkName) => linkName} />
    </div>
  );
}