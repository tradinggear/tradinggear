import { useState, useEffect } from 'react';
import { useThemeStore } from '../stores/themeStore';
import { 
  Wifi,
  WifiOff,
  Settings,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Monitor,
  Video,
  List,
  Play,
  Square,
  BarChart3,
  TrendingUp,
  Activity,
  Globe
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';

import DashHeader from '@/components/DashHeader';
import DashSidebar from '@/components/DashSidebar';
import DashNav from '@/components/DashNav';
import DashFooter from '@/components/DashFooter';

const ExchangeConnection = () => {
  const { theme, toggleTheme } = useThemeStore();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [sandboxMode, setSandboxMode] = useState(false);

  // 연결 상태 데이터
  const [connections, setConnections] = useState([
    {
      id: 1,
      name: 'Kiwoom',
      logo: '🥝',
      type: 'domestic',
      status: 'connected',
      latency: 31,
      lastUpdate: 31,
      isActive: true,
      apiKey: 'kw_***************',
      description: '국내 주식 거래소'
    },
    {
      id: 2,
      name: 'Binance Spot/Futures',
      logo: '⚡',
      type: 'international',
      status: 'connected',
      latency: 31,
      lastUpdate: 194,
      isActive: true,
      apiKey: 'bn_***************',
      description: '글로벌 암호화폐 거래소'
    }
  ]);

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

  // 연결 상태에 따른 스타일
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'connected':
        return <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100">연결됨</Badge>;
      case 'disconnected':
        return <Badge variant="destructive">연결 끊김</Badge>;
      case 'connecting':
        return <Badge variant="secondary">연결 중</Badge>;
      default:
        return <Badge variant="outline">알 수 없음</Badge>;
    }
  };

  // 지연시간에 따른 색상
  const getLatencyColor = (latency: number) => {
    if (latency <= 50) return 'text-green-500';
    if (latency <= 100) return 'text-yellow-500';
    return 'text-red-500';
  };

  // 연결 토글
  const toggleConnection = (id: number) => {
    setConnections(prev => 
      prev.map(conn => 
        conn.id === id 
          ? { ...conn, isActive: !conn.isActive, status: conn.isActive ? 'disconnected' : 'connected' }
          : conn
      )
    );
  };

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Sidebar */}
      <DashSidebar
        theme={theme}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        activeMenu="거래소연동관리"
      />

      {/* Main Content */}
      <div className={`transition-all duration-300 ${sidebarOpen ? 'lg:ml-64' : 'lg:ml-0'}`}>
        {/* Header */}
        <DashHeader
          theme={theme}
          toggleTheme={toggleTheme}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          title="거래소연동관리"
        />

        {/* Main Content */}
        <main className="p-6">
          {/* 상단 요약 */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className={`rounded-xl shadow-lg p-6 border ${
              theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            }`}>
              <div className="flex items-center justify-between mb-4">
                <div className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  총 연결
                </div>
                <Globe className="w-5 h-5 text-blue-500" />
              </div>
              <div className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mb-2`}>
                2개
              </div>
              <div className="text-green-500 text-sm">모두 활성화</div>
            </div>

            <div className={`rounded-xl shadow-lg p-6 border ${
              theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            }`}>
              <div className="flex items-center justify-between mb-4">
                <div className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  평균 지연시간
                </div>
                <Activity className="w-5 h-5 text-green-500" />
              </div>
              <div className={`text-2xl font-bold text-green-500 mb-2`}>
                31ms
              </div>
              <div className="text-green-500 text-sm">양호</div>
            </div>

            <div className={`rounded-xl shadow-lg p-6 border ${
              theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            }`}>
              <div className="flex items-center justify-between mb-4">
                <div className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  최대 지연시간
                </div>
                <TrendingUp className="w-5 h-5 text-yellow-500" />
              </div>
              <div className={`text-2xl font-bold text-yellow-500 mb-2`}>
                194ms
              </div>
              <div className="text-yellow-500 text-sm">주의</div>
            </div>

            <div className={`rounded-xl shadow-lg p-6 border ${
              theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            }`}>
              <div className="flex items-center justify-between mb-4">
                <div className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  상태
                </div>
                <CheckCircle className="w-5 h-5 text-green-500" />
              </div>
              <div className={`text-2xl font-bold text-green-500 mb-2`}>
                정상
              </div>
              <div className="text-green-500 text-sm">모든 연결 활성</div>
            </div>
          </div>

          {/* 연결 관리 섹션 */}
          <div className={`rounded-xl shadow-lg border mb-8 ${
            theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          }`}>
            <div className={`flex items-center justify-between p-6 border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200 '}`}>
              <h3 className={`text-2xl font-bold tracking-tight ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                연결
              </h3>
              <div className="flex items-center space-x-4">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => window.location.reload()}
                  className={``}
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  새로고침
                </Button>
                <Button 
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  연결 추가
                </Button>
              </div>
            </div>

            {/* 연결 카드 */}
            <div className="p-6 space-y-4">
              {connections.map((connection) => (
                <div key={connection.id} className={`rounded-lg border p-6 ${
                  theme === 'dark' ? 'border-gray-600 bg-gray-750' : 'border-gray-200 bg-gray-50'
                }`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="text-3xl">{connection.logo}</div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h4 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                            {connection.name}
                          </h4>
                          {getStatusBadge(connection.status)}
                        </div>
                        <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                          {connection.description}
                        </p>
                        <p className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'} mt-1`}>
                          API Key: {connection.apiKey}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-6">
                      {/* 연결알림 */}
                      <div className="text-center">
                        <div className={`text-xs font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} mb-1`}>
                          연결신호
                        </div>
                        <div className={`text-sm font-semibold ${getLatencyColor(connection.latency)}`}>
                          {connection.latency}ms
                        </div>
                      </div>
                      {/* 활성화 토글 */}
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={connection.isActive}
                          onCheckedChange={() => toggleConnection(connection.id)}
                          className={`bg-blue-600 hover:bg-blue-700 text-white`}
                        />
                        <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                          {connection.isActive ? '활성' : '비활성'}
                        </span>
                      </div>
                      
                      {/* 설정 버튼 */}
                      <Button variant="ghost" size="sm">
                        <Settings className={`w-4 h-4 ${theme === 'dark' ? 'text-gray-400 hover:text-gray-900' : 'text-gray-600'} mb-1`} />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 연결 가이드 섹션 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* 연결 가이드 */}
            <div className={`rounded-xl shadow-lg p-6 border ${
              theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            }`}>
              <h3 className={`text-lg font-bold mb-6 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
                연결 가이드
              </h3>
              <div className="grid grid-cols-3 gap-4">
                {/* 스크린샷 */}
                <button 
                  onClick={() => console.log('스크린샷 가이드 클릭')}
                  className={`group flex flex-col items-center p-4 rounded-lg border transition-all duration-200 hover:shadow-md ${
                    theme === 'dark' 
                      ? 'bg-gray-700 border-gray-600 hover:bg-gray-650 hover:border-gray-500' 
                      : 'bg-gray-50 border-gray-200 hover:bg-gray-100 hover:border-gray-300'
                  } transform hover:scale-105 active:scale-95`}
                >
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-3 transition-colors ${
                    theme === 'dark' ? 'bg-gray-600 group-hover:bg-blue-600' : 'bg-white group-hover:bg-blue-50'
                  }`}>
                    <Monitor className={`w-6 h-6 group-hover:text-blue-500 transition-colors ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`} />
                  </div>
                  <div className={`text-sm font-medium text-center ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'} group-hover:text-blue-600 transition-colors`}>
                    스크린샷
                  </div>
                </button>

                {/* 영상 (30초) */}
                <button 
                  onClick={() => console.log('영상 가이드 클릭')}
                  className={`group flex flex-col items-center p-4 rounded-lg border transition-all duration-200 hover:shadow-md ${
                    theme === 'dark' 
                      ? 'bg-gray-700 border-gray-600 hover:bg-gray-650 hover:border-gray-500' 
                      : 'bg-gray-50 border-gray-200 hover:bg-gray-100 hover:border-gray-300'
                  } transform hover:scale-105 active:scale-95`}
                >
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-3 transition-colors ${
                    theme === 'dark' ? 'bg-gray-600 group-hover:bg-green-600' : 'bg-white group-hover:bg-green-50'
                  }`}>
                    <Video className={`w-6 h-6 group-hover:text-green-500 transition-colors ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`} />
                  </div>
                  <div className={`text-sm font-medium text-center ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'} group-hover:text-green-600 transition-colors`}>
                    영상 (30초)
                  </div>
                </button>

                {/* 체크리스트 */}
                <button 
                  onClick={() => console.log('체크리스트 가이드 클릭')}
                  className={`group flex flex-col items-center p-4 rounded-lg border transition-all duration-200 hover:shadow-md ${
                    theme === 'dark' 
                      ? 'bg-gray-700 border-gray-600 hover:bg-gray-650 hover:border-gray-500' 
                      : 'bg-gray-50 border-gray-200 hover:bg-gray-100 hover:border-gray-300'
                  } transform hover:scale-105 active:scale-95`}
                >
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-3 transition-colors ${
                    theme === 'dark' ? 'bg-gray-600 group-hover:bg-purple-600' : 'bg-white group-hover:bg-purple-50'
                  }`}>
                    <List className={`w-6 h-6 group-hover:text-purple-500 transition-colors ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`} />
                  </div>
                  <div className={`text-sm font-medium text-center ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'} group-hover:text-purple-600 transition-colors`}>
                    체크리스트
                  </div>
                </button>
              </div>
            </div>

            {/* 샌드박스/페이퍼 모드 */}
            <div className={`rounded-xl shadow-lg p-6 border ${
              theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            }`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
                  샌드박스/페이퍼 모드
                </h3>
                <Switch
                  checked={sandboxMode}
                  onCheckedChange={setSandboxMode}
                />
              </div>
              
              <div className={`p-4 rounded-lg mb-4 ${
                sandboxMode 
                  ? theme === 'dark' ? 'bg-yellow-900/20 border border-yellow-700' : 'bg-yellow-50 border border-yellow-200'
                  : theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
              }`}>
                <div className="flex items-center mb-2">
                  {sandboxMode ? (
                    <Play className="w-4 h-4 text-yellow-500 mr-2" />
                  ) : (
                    <Square className="w-4 h-4 text-gray-500 mr-2" />
                  )}
                  <span className={`text-sm font-medium ${
                    sandboxMode 
                      ? 'text-yellow-600 dark:text-yellow-400' 
                      : theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    {sandboxMode ? '테스트 모드 활성' : '실거래 모드'}
                  </span>
                </div>
                <div className={`text-xs ${
                  sandboxMode 
                    ? 'text-yellow-700 dark:text-yellow-300' 
                    : theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {sandboxMode 
                    ? '실시간 전 시뮬레이션으로 동작합니다. 실제 거래는 1~2일 \'그런치 싱행\''
                    : '실제 자금으로 거래가 실행됩니다.'
                  }
                </div>
              </div>

              {sandboxMode && (
                <div className={`p-3 rounded-lg ${theme === 'dark' ? 'bg-blue-900/20 border border-blue-700' : 'bg-blue-50 border border-blue-200'}`}>
                  <div className="flex items-center">
                    <AlertCircle className="w-4 h-4 text-blue-500 mr-2" />
                    <span className={`text-xs ${theme === 'dark' ? 'text-blue-300' : 'text-blue-700'}`}>
                      테스트 모드에서는 실제 자금이 사용되지 않습니다.
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 연결 통계 */}
          <div className={`rounded-xl shadow-lg p-6 border ${
            theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          }`}>
            <h3 className={`text-lg font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
              연결 통계
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className={`p-4 rounded-lg border ${theme === 'dark' ? 'border-gray-600 bg-gray-700' : 'border-gray-200 bg-gray-50'}`}>
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    오늘 총 거래량
                  </span>
                  <BarChart3 className="w-4 h-4 text-blue-500" />
                </div>
                <div className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  247건
                </div>
                <div className="text-green-500 text-xs">전일 대비 +12%</div>
              </div>
              
              <div className={`p-4 rounded-lg border ${theme === 'dark' ? 'border-gray-600 bg-gray-700' : 'border-gray-200 bg-gray-50'}`}>
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    평균 응답시간
                  </span>
                  <Activity className="w-4 h-4 text-green-500" />
                </div>
                <div className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  112ms
                </div>
                <div className="text-green-500 text-xs">목표치 내</div>
              </div>
              
              <div className={`p-4 rounded-lg border ${theme === 'dark' ? 'border-gray-600 bg-gray-700' : 'border-gray-200 bg-gray-50'}`}>
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    연결 안정성
                  </span>
                  <CheckCircle className="w-4 h-4 text-green-500" />
                </div>
                <div className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  99.8%
                </div>
                <div className="text-green-500 text-xs">매우 안정적</div>
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <DashFooter theme={theme} />
      </div>
    </div>
  );
};

export default ExchangeConnection;