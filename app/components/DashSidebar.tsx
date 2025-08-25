import { 
    Home, 
    User, 
    Shield, 
    Bot, 
    BarChart3, 
    HelpCircle, 
    Settings, 
    X 
  } from 'lucide-react';
  
  interface SidebarItem {
    icon: any;
    label: string;
    active: boolean;
    href?: string;
  }
  
  interface DashSidebarProps {
    theme: string;
    sidebarOpen: boolean;
    setSidebarOpen: (open: boolean) => void;
    activeMenu?: string;
  }
  
  const DashSidebar = ({ theme, sidebarOpen, setSidebarOpen, activeMenu = "대시보드" }: DashSidebarProps) => {
    const sidebarItems: SidebarItem[] = [
      /*
      { icon: Home, label: '대시보드', active: activeMenu === '대시보드', href: '/dashboard' },
      { icon: User, label: '계정관리', active: activeMenu === '계정관리', href: '/account' },
      { icon: Shield, label: '거래소연동관리', active: activeMenu === '거래소연동관리', href: '/exchange' },
      { icon: Bot, label: '봇설정/자동매매전략', active: activeMenu === '봇설정/자동매매전략', href: '/bot' },
      { icon: BarChart3, label: '백레스트/리포트', active: activeMenu === '백레스트/리포트', href: '/reports' },
      { icon: HelpCircle, label: '고객지원', active: activeMenu === '고객지원', href: '/support' },
      { icon: Settings, label: '환경설정', active: activeMenu === '환경설정', href: '/settings' },
       */
      { icon: Home, label: '대시보드', active: activeMenu === '대시보드', href: '/dashboard' },
      { icon: User, label: '내 전략 관리', active: activeMenu === '내 전략 관리', href: '/mystrategy' },
      /*{ icon: Shield, label: '거래소연동관리', active: activeMenu === '거래소연동관리', href: '/exchange' },*/
      { icon: Bot, label: '추천 전략 둘러보기', active: activeMenu === '추천 전략 둘러보기', href: '/recommend' },
      { icon: BarChart3, label: '실행 중 전략', active: activeMenu === '실행 중 전략', href: '/runningStrategy' },
      { icon: HelpCircle, label: '전략 성과 리포트', active: activeMenu === '전략 성과 리포트', href: '/strategyReport' },
      { icon: User, label: '계정관리', active: activeMenu === '계정관리', href: '/account' },      
    ];
  
    return (
      <>
        {/* Backdrop for mobile */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
  
        {/* Sidebar */}
        <div className={`fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out 
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
          ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-r`}>
          <div className="flex items-center justify-between p-6">
            <div className="flex items-center">
              <h1 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
                <a href="/dashboard">{theme === 'dark' ? <img className="h-[44px]" src="/logo-white.png" alt="" /> : <img className="h-[44px]" src="/logo.png" alt="" />}</a>
              </h1>
              {/* <h1 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
                트레이딩기어
              </h1> */}
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className={`lg:hidden ${theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}
            >
              <X className="w-6 h-6" />
            </button>
          </div>
  
          <nav className="mt-8">
            {sidebarItems.map((item, index) => (
              <a
                key={index}
                href={item.href || "#"}
                className={`flex items-center px-6 py-3 text-sm font-medium transition-colors ${
                  item.active
                    ? theme === 'dark' 
                      ? 'bg-gray-700 text-cyan-400 border-r-2 border-cyan-400' 
                      : 'bg-blue-50 text-blue-600 border-r-2 border-blue-600'
                    : theme === 'dark' 
                      ? 'text-gray-300 hover:bg-gray-700 hover:text-white' 
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <item.icon className="w-5 h-5 mr-3" />
                {item.label}
              </a>
            ))}
          </nav>
        </div>
      </>
    );
  };
  
  export default DashSidebar;