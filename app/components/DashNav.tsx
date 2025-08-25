import { useThemeStore } from "../stores/themeStore";
import { Link } from "react-router-dom";


const DashNav = ({activeTab}: {activeTab: string}) => {
const { theme } = useThemeStore();
const topTabs = [
    { id: 'dashboard', label: '홈', link:'/dashboard' },
    { id: 'plan', label: '자동매매설정', link:'#void' },
    { id: 'strategy', label: '전략타겟', link:'/dashboard/strategy' },
    { id: 'assets', label: '자산현황', link:'/dashboard/assets' },
    { id: 'accountOpen', label: '알림', link:'#void' },
    { id: 'accountProfit', label: '수익률', link:'#void' }
  ];
return (
    <div className={`border-t ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
      <div className="px-4 lg:px-6">
        <div className="flex space-x-8 overflow-x-auto">
          {topTabs.map((tab) => (
            <Link to={tab.link}
              key={tab.id}
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
            </Link>
          ))}
            </div>
        </div>
    </div>
    )
}

export default DashNav