import { X, Users, Lock, Settings, BarChart3, FileText, BotOff,UserRoundCheck,ChartPie } from 'lucide-react';
import { useLocation } from '@remix-run/react';
import { useSidebarStore } from '../../stores/adminStore';

const AdminSidebar = () => {
  const { isSidebarOpen, isMobile, toggleSidebar } = useSidebarStore();
  const location = useLocation();
  const menuItems = [
    { icon: Users, label: '회원목록', href: '/admin/member', path: '/admin/member' },
    
    { icon: Users, label: '바이낸스오더북', href: '/admin/binance_order_book', path: '/admin/binance_order_book' },  
    { icon: Users, label: '전략그래프', href: '/admin/binance_strategy1', active: true }, 
    { icon: Users, label: '실시간전략그래프', href: 'http://210.114.22.48:8050/app/app_ws/', active: true }, 
    { icon: Users, label: '실시간전략그래프2', href: 'http://210.114.22.48:8052/', active: true }, 
    { icon: BarChart3, label: '전략 리스트', href: '/admin/strategy', path: '/admin/strategy' },
    { icon: UserRoundCheck, label: '승인 대기', href: '/admin/approval', path: '/admin/approval' },
    { icon: BotOff, label: '차단 전략', href: '/admin/cutOff', path: '/admin/cutOff' },
    { icon: ChartPie, label: '전략 통계', href: '/admin/state', path: '/admin/state' },
    { icon: Settings, label: '설정', href: '/admin/settings', path: '/admin/settings' },
  ];

  // 현재 경로와 메뉴 경로가 일치하는지 확인
  const isActiveMenu = (menuPath: string) => {
    if (menuPath === '/admin') {
      return location.pathname === '/admin';
    }
    return location.pathname.startsWith(menuPath);
  };

  const handleLogout = () => {
    localStorage.removeItem('adminLoggedIn');
    localStorage.removeItem('adminEmail');
    alert('로그아웃되었습니다. 로그인 페이지로 이동합니다.');
    window.location.href = '/admin/login';
  };

  return (
    <div className={`
      fixed top-0 left-0 h-full border-r bg-gray-800 border-gray-700 z-50 transition-transform duration-300 ease-in-out
      ${isMobile ? 'w-64' : 'w-64'}
      ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
    `}>
      <div className="flex flex-col h-full">
        {/* 사이드바 헤더 */}
        <div className="flex items-center justify-between px-[25px] pt-[25px] pb-[15px] border-gray-700">
          <h2 className="text-xl font-bold md:leading-[1.6] text-white">
            <a href="/admin">
              <img className="h-[44px]" src="/logo-white.png" alt="" />
            </a>
          </h2>
          {isMobile && (
            <button
              onClick={toggleSidebar}
              className="p-1 rounded-md hover:bg-gray-700 text-gray-400"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* 메뉴 리스트 */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {menuItems.map((item, index) => {
              const Icon = item.icon;
              const isActive = isActiveMenu(item.path);
              return (
                <li key={index}>
                  <a
                    href={item.href}
                    className={`
                      flex items-center px-4 py-3 rounded-lg transition-colors duration-200
                      ${isActive 
                        ? 'bg-blue-600 text-white' 
                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                      }
                    `}
                  >
                    <Icon className="w-5 h-5 mr-3" />
                    <span className="font-medium">{item.label}</span>
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* 로그아웃 버튼 */}
        <div className="p-4 border-t border-gray-700">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center px-4 py-3 rounded-lg transition-colors duration-200 text-gray-300 hover:bg-gray-700 hover:text-white"
          >
            <Lock className="w-5 h-5 mr-3" />
            <span className="font-medium">로그아웃</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminSidebar;