import { useState, useEffect, useRef } from 'react';
import { redirect } from "@remix-run/node";
import { useNavigate } from '@remix-run/react';
import { 
  User, 
  Bell,
  LogOut,
  Menu,
  Search,
  Settings,
  Moon,
  Sun,
  Shield,
  UserCog,
  HelpCircle,
  Crown,
  ChevronDown
} from 'lucide-react';

interface DashHeaderProps {
  theme: string;
  toggleTheme: () => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  title?: string;
}

const DashHeader = ({ 
  theme, 
  toggleTheme, 
  sidebarOpen, 
  setSidebarOpen, 
  title = "대시보드",
}: DashHeaderProps) => {
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const [email, setemail] = useState("");
  const [nickName, setnickName] = useState("");

  const navigate = useNavigate();
{/*
  const emailSet = String(sessionStorage.getItem("email"));

  if(emailSet == "") {
    //alert("로그인 해주세요.");
    //redirect("/login");
    //return;
  }

  console.log(sessionStorage.getItem("email"));
  console.log(sessionStorage.getItem("nickName"));      

  setemail(String(sessionStorage.getItem("email")));
  setnickName(String(sessionStorage.getItem("nickName")));   
*/}
  useEffect(() => {
    //console.log(sessionStorage.getItem("nickName"));
    if(typeof sessionStorage === undefined || sessionStorage.getItem("nickName") == null) {
      //alert("로그인 해주세요.");
      navigate('/login');
      //redirect("/login");
      return;
    }
  }, []);

  // 외부 클릭 시 메뉴 닫기
  useEffect(() => {
    

    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      } 
      
    };
    


    setemail(String(sessionStorage.getItem("email")));
    setnickName(String(sessionStorage.getItem("nickName"))); 

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 사용자 드롭다운 메뉴 컴포넌트
  const UserDropdownMenu = () => (
    <div className={`absolute right-0 top-full mt-2 w-80 rounded-xl shadow-lg border z-50 ${
      theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
    }`}>
      {/* 계정 플랜 섹션 */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center">
            <Crown className="w-5 h-5 text-blue-500 mr-2" />
            <span className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              Pro Plan
            </span>
          </div>
        </div>
        <button className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors">
          Upgrade
        </button>
      </div>

      {/* 메뉴 항목들 */}
      <div className="py-2">
        <button className="w-full flex items-center px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
          <UserCog className={`w-4 h-4 mr-3 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`} />
          <span className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>설정</span>
        </button>

        <button className="w-full flex items-center px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
          <Shield className={`w-4 h-4 mr-3 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`} />
          <span className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>보안</span>
        </button>

        <button className="w-full flex items-center px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
          <HelpCircle className={`w-4 h-4 mr-3 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`} />
          <span className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>도움말</span>
        </button>
      </div>

      {/* 하단 설정 섹션 */}
      <div className="border-t border-gray-200 dark:border-gray-700 py-2">
        {/* Dark mode toggle */}
        <div className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer">
          <div className="flex items-center">
            {theme === 'dark' ? (
              <Moon className="w-4 h-4 mr-3 text-gray-400" />
            ) : (
              <Sun className="w-4 h-4 mr-3 text-gray-600" />
            )}
            <span className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              {theme === 'dark' ? 'Dark mode' : 'Light mode'}
            </span>
          </div>
          <button 
            onClick={toggleTheme}
            className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
              theme === 'dark' ? 'bg-blue-500' : 'bg-gray-300'
            }`}
          >
            <span className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
              theme === 'dark' ? 'translate-x-5' : 'translate-x-1'
            }`} />
          </button>
        </div>

        {/* Log out */}
        <a href="/logout">
          <button className="w-full flex items-center px-4 py-3 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-red-600 dark:text-red-400">
            <LogOut className="w-4 h-4 mr-3" />
            <span className="text-sm">Log out</span>
          </button>
        </a>
      </div>

      {/* Terms and Conditions */}
      <div className="border-t border-gray-200 dark:border-gray-700 px-4 py-3">
        <button className={`text-xs ${theme === 'dark' ? 'text-gray-500 hover:text-gray-400' : 'text-gray-400 hover:text-gray-600'} transition-colors`}>
          Terms and Conditions
        </button>
      </div>
    </div>
  );

  return (
    <header className={`${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} shadow-sm border-b`}>
      <div className="px-4 lg:px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className={`mr-3 lg:mr-4 ${theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}
            >
              <Menu className="w-6 h-6" />
            </button>
            <h2 className={`text-lg lg:text-xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
              {title}
            </h2>
          </div>
          
          <div className="flex items-center space-x-2 lg:space-x-4">
            {/* 검색바 - 데스크톱에만 표시 */}
            <div className="relative hidden lg:block">
              <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
              <input
                type="text"
                placeholder="검색..."
                className={`pl-10 pr-4 py-2 rounded-lg border focus:ring-2 focus:ring-cyan-500 focus:border-transparent ${
                  theme === 'dark' 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                    : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500'
                }`}
              />
            </div>

            {/* 모바일 검색 아이콘 */}
            <button className={`lg:hidden p-2 rounded-lg transition-colors ${
              theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
            }`}>
              <Search className="w-5 h-5" />
            </button>
            
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-lg transition-colors ${
                theme === 'dark' 
                  ? 'bg-gray-700 text-yellow-400 hover:bg-gray-600' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            
            <button className={`p-2 rounded-lg transition-colors ${
              theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
            }`}>
              <Bell className="w-5 h-5" />
            </button>
            
            <div className="flex items-center space-x-2 lg:space-x-3 relative" ref={userMenuRef}>
              {/* 프로필 텍스트 - 데스크톱에만 표시 */}              
              <div className={`text-right hidden lg:block ${theme === 'dark' ? 'text-white' : 'text-gray-700'}`}>
                <div className="text-sm font-medium">{nickName}님</div>
                <div className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>환영합니다!</div>
              </div>
              
              {/* 프로필 아바타 - 클릭 가능 */}
              <button 
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center hover:from-cyan-600 hover:to-blue-600 transition-colors"
              >
                <User className="w-4 h-4 text-white" />
              </button>

              {/* 사용자 드롭다운 메뉴 */}
              {userMenuOpen && <UserDropdownMenu />}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashHeader;