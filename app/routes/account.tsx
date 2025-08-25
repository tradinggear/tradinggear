import React, { useState, useEffect } from 'react';
import { useThemeStore } from '@/stores/themeStore';
import { 
  User, 
  Lock, 
  Key, 
  Eye, 
  EyeOff, 
  Edit, 
  Copy, 
  Save, 
  X, 
  Trash2,
  AlertTriangle,
  ArrowLeft,
  Check
} from 'lucide-react';

import DashHeader from '@/components/DashHeader';
import DashSidebar from '@/components/DashSidebar';
import DashFooter from '@/components/DashFooter';

const AccountSettings = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('account');
  const [showPassword, setShowPassword] = useState(false);
  
  const [editingPassword, setEditingPassword] = useState(false);
  
  const [showApiKey, setShowApiKey] = useState(false); 
  const [editingApiKey, setEditingApiKey] = useState(false);

  const [showApiSecret, setShowApiSecret] = useState(false);
  const [editingApiSecret, setEditingApiSecret] = useState(false);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const { theme, toggleTheme } = useThemeStore();
  
  // 상태 데이터
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [apiKey, setApiKey] = useState('');
  const [newApiKey, setNewApiKey] = useState('');

  const [apiSecret, setApiSecret] = useState("");
  const [newApiSecret, setNewApiSecret] = useState("");

  const [idEmail, setIdEmail] = useState("");  
  const [nickName, setNickName] = useState("");
  const [userName, setUserName] = useState("");
  const [tradingCenter, setTradingCenter] = useState("");  

  const [selected, setSelected] = useState("");

  useEffect(() => {
    const initSetting = async () => {

      const value = String(sessionStorage.getItem("email"));

      const form = new URLSearchParams();
      form.append("email", value ?? "");  

      const res = await fetch('https://tradinggear.co.kr:8081/tradinggear/member_inform_get.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded', // ✅ JSON 형식 명시
        },
        body: form.toString(),
      });    

      const data1 = await res.json(); 
      
      setIdEmail(data1[0]["id_email"]);
      setNickName(data1[0]["nick_name"]);
      setUserName(data1[0]["full_name"]);
      setApiKey(data1[0]["decrypted_api_key"]);
      setApiSecret(data1[0]["decrypted_api_secret"]);
      setTradingCenter(data1[0]["trading_center"]);
      setSelected(data1[0]["trading_center"]);
      //console.log(data1);
    };

    initSetting();
  }, []);

  // 화면 크기에 따른 사이드바 초기 상태 설정
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const topTabs = [
    { id: 'account', label: '계정 정보' },
    { id: 'plan', label: '요금제' },
    { id: 'security', label: '보안' }
  ];

  const handleCopyApiKey = () => {
    navigator.clipboard.writeText(apiKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyApiSecret = () => {
    navigator.clipboard.writeText(apiSecret);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };  

  const handlePasswordUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // 비밀번호 업데이트 로직
    console.log('Password updated');
    //setEditingPassword(false);
    //setCurrentPassword('');
    //setNewPassword('');
    //setConfirmPassword('');

    //const formData = new FormData(e.currentTarget);

    // Handle login logic here
    //console.log('Login form submitted:', formData);
    // Redirect to dashboard after successful login

    const email_set = String(sessionStorage.getItem("email"));


    const email_value = String(email_set);
    const pwd_value = String(currentPassword);
    
    const form = new URLSearchParams();
    form.append("email", email_value ?? "");
    form.append("pwd", pwd_value ?? "");     

    //console.log(form.toString());

    const res = await fetch("https://tradinggear.co.kr:8081/tradinggear/pass_check.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },      
      body: form.toString(),
    });

    const data1 = await res.text();    
    //setArray(data1);
    //console.log(data1);
    const data2 = data1.split("|@|");
    //console.log(data2[1]);
    //console.log(data2[0]);    
    //return;

    if(data2[0] == "wrong") {
      alert("현재비밀번호가 잘못되었습니다.");
      return;
    }
  
    const newPasswordSet = (document.getElementById("newPassword") as HTMLInputElement)?.value;
    const newPasswordConfirmSet = (document.getElementById("newPasswordConfirm") as HTMLInputElement)?.value;
    
    //console.log(newPasswordSet);
    //console.log(newPasswordConfirmSet);    

    if(newPasswordSet != newPasswordConfirmSet) {
      alert("새 비밀번호와 새 비밀번호 확인이 일치하지 않습니다.");
      return;
    }

    const form2 = new URLSearchParams();
    form2.append("email", email_value ?? "");
    form2.append("pwd", newPasswordConfirmSet ?? "");     

    //console.log(form.toString());

    const res2 = await fetch("https://tradinggear.co.kr:8081/tradinggear/pass_change.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },      
      body: form2.toString(),
    });    

    alert("비밀번호가 수정되었습니다.");

  };

  const handleApiKeyUpdate = () => {
    // API 키 업데이트 로직
    setApiKey(newApiKey);
    setEditingApiKey(false);
    setNewApiKey('');
  };

  const handleApiSecretUpdate = () => {
    // API 키 업데이트 로직
    setApiSecret(newApiSecret);
    setEditingApiSecret(false);
    setNewApiSecret('');
  };  

  const handleApiChangeAccount = async () => {
    // 계정 삭제 로직
    console.log('Account deleted');
    setShowDeleteModal(false);
  
    const email_set = String(sessionStorage.getItem("email"));

    const email_value = String(email_set);
    const api_key_value = String((document.getElementById("apiKey") as HTMLInputElement)?.value);
    const api_secret_value = String((document.getElementById("apiSecret") as HTMLInputElement)?.value);
    const trading_center_value = String((document.getElementById("tradingCenter") as HTMLInputElement)?.value); 

    const form2 = new URLSearchParams();
    form2.append("email", email_value ?? "");
    form2.append("apiKey", api_key_value ?? "");
    form2.append("apiSecret", api_secret_value ?? "");
    form2.append("tradingCenter", trading_center_value ?? "");     

    //console.log(form.toString());

    const res2 = await fetch("https://tradinggear.co.kr:8081/tradinggear/api_change.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },      
      body: form2.toString(),
    });    

    alert("API KEY / API SECRET / Trading Center가 수정되었습니다.");  
  
  };

  const handleGoBack = () => {
    window.history.back();
  };

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Sidebar */}
      <DashSidebar
        theme={theme}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        activeMenu="계정관리"
      />

      {/* Main Content */}
      <div className={`transition-all duration-300 ${sidebarOpen ? 'lg:ml-64' : 'lg:ml-0'}`}>
        {/* Header */}
        <DashHeader
          theme={theme}
          toggleTheme={toggleTheme}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          title="계정관리"
        />

        {/* 상단 탭 네비게이션 */}
        <div className={`border-t ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className="px-4 lg:px-6">
            <div className="flex space-x-8 overflow-x-auto">
              {topTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab && setActiveTab(tab.id)}
                  className={`py-3 px-1 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
                    activeTab === tab.id 
                      ? theme === 'dark'
                        ? 'border-cyan-400 text-cyan-400'
                        : 'border-blue-600 text-blue-600'
                      : theme === 'dark'
                        ? 'border-transparent text-gray-400 hover:text-gray-300'
                        : 'border-transparent text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="p-6">
          {/* Account Details Tab */}
          {activeTab === 'account' && (
            <div className="space-y-6">
              {/* User ID and Username */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Username */}
                <div className={`rounded-lg p-6 border ${
                  theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                }`}>
                  <label className={`block text-sm font-medium mb-2 ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                   Username
                  </label>
                  <div className="flex items-center">
                    <User className={`w-4 h-4 mr-3 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-400'}`} />
                    <span className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>{userName}</span>
                  </div>
                </div>

                {/* NickName */}
                <div className={`rounded-lg p-6 border ${
                  theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                }`}>
                  <label className={`block text-sm font-medium mb-2 ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                   Nickname
                  </label>
                  <div className="flex items-center">
                    <User className={`w-4 h-4 mr-3 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-400'}`} />
                    <span className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>{nickName}</span>
                  </div>
                </div>

                {/* User ID */}
                <div className={`rounded-lg p-6 border ${
                  theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                }`}>
                  <label className={`block text-sm font-medium mb-2 ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    User ID
                  </label>
                  <div className="flex items-center">
                    <User className={`w-4 h-4 mr-3 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-400'}`} />
                    <span className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>{idEmail}</span>
                  </div>
                </div>
              </div>

              {/* Password Section */}
              <div className={`rounded-lg p-6 border ${
                theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
              }`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <Lock className={`w-5 h-5 mr-3 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-400'}`} />
                    <h3 className={`text-lg font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Password</h3>
                  </div>
                  <button
                    onClick={() => setEditingPassword(!editingPassword)}
                    className={`px-4 py-2 text-sm font-medium transition-colors ${
                      theme === 'dark' 
                        ? 'text-cyan-400 hover:text-cyan-300'
                        : 'text-blue-600 hover:text-blue-700'
                    }`}
                  >
                    {/*{editingPassword ? '취소' : '비밀번호 변경'}*/}
                  </button>
                </div>

                {/*{!editingPassword ? (*/}
                  {/*<div className="flex items-center">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value="••••••••••••"
                      readOnly
                      className={`flex-1 border rounded-lg px-3 py-2 ${
                        theme === 'dark' 
                          ? 'bg-gray-700 border-gray-600 text-gray-300'
                          : 'bg-gray-50 border-gray-300 text-gray-700'
                      }`}
                    />
                    <button
                      onClick={() => setShowPassword(!showPassword)}
                      className={`ml-3 p-2 ${
                        theme === 'dark' ? 'text-gray-400 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'
                      }`}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>*/}
                {/*) : (*/}
                  <div className="space-y-4">
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        현재 비밀번호
                      </label>
                      <input
                        type="password"
                        id="nowPassword"
                        name="nowPassword"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          theme === 'dark' 
                            ? 'border-gray-600 bg-gray-700 text-gray-100'
                            : 'border-gray-300 bg-white text-gray-900'
                        }`}
                        placeholder="현재 비밀번호"
                      />
                    </div>
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        새 비밀번호
                      </label>
                      <input
                        type="password"
                        id="newPassword"
                        name="newPassword"                        
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          theme === 'dark' 
                            ? 'border-gray-600 bg-gray-700 text-gray-100'
                            : 'border-gray-300 bg-white text-gray-900'
                        }`}
                        placeholder="새 비밀번호"
                      />
                    </div>
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        새 비밀번호 확인
                      </label>
                      <input
                        type="password"
                        id="newPasswordConfirm"
                        name="newPasswordConfirm"                           
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          theme === 'dark' 
                            ? 'border-gray-600 bg-gray-700 text-gray-100'
                            : 'border-gray-300 bg-white text-gray-900'
                        }`}
                        placeholder="새 비밀번호 확인"
                      />
                    </div>
                    <div className="flex justify-end space-x-3">
                      {/*<button
                        onClick={() => setEditingPassword(false)}
                        className={`px-4 py-2 text-sm font-medium ${
                          theme === 'dark' ? 'text-gray-300 hover:text-gray-100' : 'text-gray-700 hover:text-gray-900'
                        }`}
                      >
                        취소
                      </button>
                      */}
                      {/* onClick=handlePasswordUpdate */}
                      <button
                        
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
                      >
                        비밀번호 변경
                      </button>
                    </div>
                  </div>
                {/*)}*/}
              </div>

              {/* API Key Section */}
              <div className={`rounded-lg p-6 border ${
                theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
              }`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <Key className={`w-5 h-5 mr-3 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-400'}`} />
                    <h3 className={`text-lg font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>API Key</h3>
                  </div>
                  <div className="flex space-x-2">
                    {/*<button
                      onClick={handleCopyApiKey}
                      className={`px-3 py-1 text-sm font-medium transition-colors flex items-center ${
                        theme === 'dark' 
                          ? 'text-gray-400 hover:text-gray-200'
                          : 'text-gray-600 hover:text-gray-800'
                      }`}
                    >
                      {copied ? <Check className="w-4 h-4 mr-1" /> : <Copy className="w-4 h-4 mr-1" />}
                      {copied ? '복사됨' : '복사'}
                    </button>
                    
                    <button
                      onClick={() => setEditingApiKey(!editingApiKey)}
                      className={`px-4 py-2 text-sm font-medium transition-colors flex items-center ${
                        theme === 'dark' 
                          ? 'text-cyan-400 hover:text-cyan-300'
                          : 'text-blue-600 hover:text-blue-700'
                      }`}
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      {editingApiKey ? '취소' : '수정'}
                    </button>
                    */}
                  </div>
                </div>
                {/*
                {!editingApiKey ? (
                  <div className="flex items-center">
                    <input
                      type={showApiKey ? 'text' : 'password'}
                      value={showApiKey ? apiKey : '••••••••••••••••••••••••••••••••'}
                      readOnly
                      className={`flex-1 border rounded-lg px-3 py-2 font-mono text-sm ${
                        theme === 'dark' 
                          ? 'bg-gray-700 border-gray-600 text-gray-300'
                          : 'bg-gray-50 border-gray-300 text-gray-700'
                      }`}
                    />
                    <button
                      onClick={() => setShowApiKey(!showApiKey)}
                      className={`ml-3 p-2 ${
                        theme === 'dark' ? 'text-gray-400 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'
                      }`}
                    >
                      {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                ) : (
                 */}
                  <div className="space-y-4">
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        API Key
                      </label>
                      <input
                        type="text"
                        id="apiKey"
                        name="apiKey"
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                        className={`w-full border rounded-lg px-3 py-2 font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          theme === 'dark' 
                            ? 'border-gray-600 bg-gray-700 text-gray-100'
                            : 'border-gray-300 bg-white text-gray-900'
                        }`}
                        placeholder="API KEY"
                      />
                    </div>
                    {/*
                    <div className="flex justify-end space-x-3">
                      <button
                        onClick={() => setEditingApiKey(false)}
                        className={`px-4 py-2 text-sm font-medium ${
                          theme === 'dark' ? 'text-gray-300 hover:text-gray-100' : 'text-gray-700 hover:text-gray-900'
                        }`}
                      >
                        취소
                      </button>
                      <button
                        onClick={handleApiKeyUpdate}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
                      >
                        API 키 변경
                      </button>
                    </div>
                    */}
                  </div>
                {/* )} */}
              </div>

              {/* API Secret Section */}
              <div className={`rounded-lg p-6 border ${
                theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
              }`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <Key className={`w-5 h-5 mr-3 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-400'}`} />
                    <h3 className={`text-lg font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>API Secret</h3>
                  </div>
                  <div className="flex space-x-2">
                    {/*<button
                      onClick={handleCopyApiSecret}
                      className={`px-3 py-1 text-sm font-medium transition-colors flex items-center ${
                        theme === 'dark' 
                          ? 'text-gray-400 hover:text-gray-200'
                          : 'text-gray-600 hover:text-gray-800'
                      }`}
                    >
                      {copied ? <Check className="w-4 h-4 mr-1" /> : <Copy className="w-4 h-4 mr-1" />}
                      {copied ? '복사됨' : '복사'}
                    </button>
                    
                    <button
                      onClick={() => setEditingApiSecret(!editingApiSecret)}
                      className={`px-4 py-2 text-sm font-medium transition-colors flex items-center ${
                        theme === 'dark' 
                          ? 'text-cyan-400 hover:text-cyan-300'
                          : 'text-blue-600 hover:text-blue-700'
                      }`}
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      {editingApiSecret ? '취소' : '수정'}
                    </button>
                    */}
                  </div>
                </div>
                {/*
                {!editingApiSecret ? (
                  <div className="flex items-center">
                    <input
                      type={showApiSecret ? 'text' : 'password'}
                      value={showApiSecret ? apiSecret : '••••••••••••••••••••••••••••••••'}
                      readOnly
                      className={`flex-1 border rounded-lg px-3 py-2 font-mono text-sm ${
                        theme === 'dark' 
                          ? 'bg-gray-700 border-gray-600 text-gray-300'
                          : 'bg-gray-50 border-gray-300 text-gray-700'
                      }`}
                    />
                    <button
                      onClick={() => setShowApiSecret(!showApiSecret)}
                      className={`ml-3 p-2 ${
                        theme === 'dark' ? 'text-gray-400 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'
                      }`}
                    >
                      {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                ) : (
                 */}
                  <div className="space-y-4">
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        API Secret
                      </label>
                      <input
                        type="text"
                        id="apiSecret"
                        name="apiSecret"
                        value={apiSecret}
                        onChange={(e) => setApiSecret(e.target.value)}
                        className={`w-full border rounded-lg px-3 py-2 font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          theme === 'dark' 
                            ? 'border-gray-600 bg-gray-700 text-gray-100'
                            : 'border-gray-300 bg-white text-gray-900'
                        }`}
                        placeholder="API SECRET"
                      />
                    </div>
                    {/*
                    <div className="flex justify-end space-x-3">
                      <button
                        onClick={() => setEditingApiSecret(false)}
                        className={`px-4 py-2 text-sm font-medium ${
                          theme === 'dark' ? 'text-gray-300 hover:text-gray-100' : 'text-gray-700 hover:text-gray-900'
                        }`}
                      >
                        취소
                      </button>
                      <button
                        onClick={handleApiSecretUpdate}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
                      >
                        API Secret 변경
                      </button>
                    </div>
                    */}
                  </div>
                {/* )} */}
              </div>
              {/* Trading Center */}
              <div className={`rounded-lg p-6 border ${
                theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
              }`}>
                <label className={`block text-sm font-medium mb-2 ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>
                 Trading Center
                </label>
                <select
                  id="tradingCenter"            
                  name="tradingCenter"
                  className={`w-full px-4 py-3 pr-12 rounded-lg border transition-all duration-200 focus:ring-2 focus:ring-opacity-50 bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-500 focus:border-blue-500 focus:ring-blue-500 `} 
                  required 
                  value={selected} onChange={(e) => setSelected(e.target.value)}
                >
                  <option value="" >Trading Center</option>
                  <option value="binance" >바이낸스</option>                  
                  <option value="kium" >키움증권</option>                                  
                </select>
              </div>              

              {/* Danger Zone */}
              {/* 
              <div className={`rounded-lg p-6 border ${
                theme === 'dark' ? 'bg-gray-800 border-red-700' : 'bg-white border-red-200'
              }`}>
                <div className="flex items-center mb-4">
                  <AlertTriangle className="w-5 h-5 text-red-500 mr-3" />
                  <h3 className={`text-lg font-medium ${theme === 'dark' ? 'text-red-400' : 'text-red-600'}`}>주의</h3>
                </div>
                <p className={`text-sm mb-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  계정을 삭제하면 되돌릴 수 없습니다. 신중하게 결정해주세요.
                </p>
                */}
                <button
                  onClick={() => setShowDeleteModal(true)}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors flex items-center"
                >
                  {/*
                  <Trash2 className="w-4 h-4 mr-2" />
                  */}
                  계정 수정
                </button>
                {/* 
              </div>
              */}
            </div>
          )}

          {/* Other tabs content */}
          {activeTab !== 'account' && (
            <div className={`rounded-lg p-8 border text-center ${
              theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            }`}>
              <h3 className={`text-lg font-medium mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {topTabs.find(tab => tab.id === activeTab)?.label}
              </h3>
              <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                이 섹션은 준비 중입니다.
              </p>
            </div>
          )}
        </div>
        </div>

        {/* Footer */}
        <DashFooter theme={theme} />
        
        {/* Delete Account Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className={`rounded-lg p-6 max-w-md w-full mx-4 ${
              theme === 'dark' ? 'bg-gray-800' : 'bg-white'
            }`}>
              <div className="flex items-center mb-4">
                <AlertTriangle className="w-6 h-6 text-red-500 mr-3" />
                <h3 className={`text-lg font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>API KEY / API SECRET 수정</h3>
              </div>
              <p className={`mb-6 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                API KEY / API SECRET을 수정합니다. 잘못 수정할 시 시스템이 오작동 될 수 있습니다. 계속하시겠습니까?
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className={`px-4 py-2 text-sm font-medium ${
                    theme === 'dark' ? 'text-gray-300 hover:text-gray-100' : 'text-gray-700 hover:text-gray-900'
                  }`}
                >
                  취소
                </button>
                <button
                  onClick={handleApiChangeAccount}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors"
                >
                  정보수정
                </button>
              </div>
            </div>
          </div>
        )}
    </div>
  );
};

export default AccountSettings;