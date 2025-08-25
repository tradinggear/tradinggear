// eslint-disable-next-line import/no-unresolved
import { useThemeStore } from "@/stores/themeStore";
import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { 
  TrendingUp,
  TrendingDown,
  Activity,
  Brain,
  CheckCircle,
  AlertTriangle,
  Star,
  ArrowUpRight,
  ArrowDownRight,
  BarChart3,
  Target,
  Zap,
  Shield
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

// eslint-disable-next-line import/no-unresolved
import DashHeader from "@/components/DashHeader";
// eslint-disable-next-line import/no-unresolved
import DashSidebar from "@/components/DashSidebar";
// eslint-disable-next-line import/no-unresolved
import DashFooter from "@/components/DashFooter";

import { useNavigate } from "react-router-dom";

const StrategyRecommendations = () => {
  const { theme, toggleTheme } = useThemeStore();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedStrategy, setSelectedStrategy] = useState(null);

  // 추천 전략 데이터
  const recommendedStrategies = [
    {
      id: 1,
      name: '전략명 자산 유형 수익률 구독 버튼',
      type: 'SOL1H 추세추종',
      asset: 'SOLUSDT',
      returnRate: 18.4,
      period: '구독 후 실행',
      risk: 'medium',
      description: '솔라나 1시간 차트 기반 추세추종 전략',
      icon: <TrendingUp className="w-5 h-5" />,
      color: 'emerald',
      performance: [
        { time: '1월', value: 1000 },
        { time: '2월', value: 1050 },
        { time: '3월', value: 1120 },
        { time: '4월', value: 1080 },
        { time: '5월', value: 1150 },
        { time: '6월', value: 1184 },
      ]
    },
    {
      id: 2,
      name: '코스피 매집 돌파',
      type: '단타 전략',
      asset: '005930',
      returnRate: 6.2,
      period: '전략 복사',
      risk: 'low',
      description: '코스피 대형주 매집 구간 돌파 전략',
      icon: <BarChart3 className="w-5 h-5" />,
      color: 'blue',
      performance: [
        { time: '1월', value: 1000 },
        { time: '2월', value: 1015 },
        { time: '3월', value: 1025 },
        { time: '4월', value: 1040 },
        { time: '5월', value: 1055 },
        { time: '6월', value: 1062 },
      ]
    }
  ];

  // 인기 전략 데이터
  const popularStrategies = [
    {
      id: 3,
      name: 'RSI 역추세 전략',
      type: '스윙 트레이딩',
      asset: 'Multiple',
      returnRate: 12.8,
      subscribers: 1247,
      winRate: 68.5,
      maxDrawdown: -3.2,
      risk: 'medium',
      icon: <Activity className="w-5 h-5" />,
      color: 'purple'
    },
    {
      id: 4,
      name: '볼린저밴드 돌파',
      type: '데이 트레이딩',
      asset: 'NASDAQ',
      returnRate: 15.3,
      subscribers: 892,
      winRate: 72.1,
      maxDrawdown: -2.8,
      risk: 'high',
      icon: <Target className="w-5 h-5" />,
      color: 'orange'
    },
    {
      id: 5,
      name: '이동평균 교차',
      type: '장기 투자',
      asset: 'S&P 500',
      returnRate: 9.7,
      subscribers: 2156,
      winRate: 75.4,
      maxDrawdown: -1.9,
      risk: 'low',
      icon: <TrendingUp className="w-5 h-5" />,
      color: 'green'
    },
    {
      id: 6,
      name: 'MACD 다이버전스',
      type: '스캘핑',
      asset: 'FOREX',
      returnRate: 22.1,
      subscribers: 634,
      winRate: 64.2,
      maxDrawdown: -5.1,
      risk: 'high',
      icon: <Zap className="w-5 h-5" />,
      color: 'red'
    }
  ];

  const getRiskBadge = (risk) => {
    switch (risk) {
      case 'low':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">안전</Badge>;
      case 'medium':
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">보통</Badge>;
      case 'high':
        return <Badge variant="destructive">위험</Badge>;
      default:
        return <Badge variant="secondary">-</Badge>;
    }
  };

  const getColorClasses = (color) => {
    const colorMap = {
      emerald: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900 dark:text-emerald-300',
      blue: 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300',
      purple: 'bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-300',
      orange: 'bg-orange-100 text-orange-600 dark:bg-orange-900 dark:text-orange-300',
      green: 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300',
      red: 'bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300'
    };
    return colorMap[color] || 'bg-gray-100 text-gray-600 dark:bg-gray-900 dark:text-gray-300';
  };


  return (
    <div
      className={`min-h-screen ${
        theme === "dark" ? "bg-gray-900" : "bg-gray-50"
      }`}
    >
      {/* Sidebar */}
      <DashSidebar
        theme={theme}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        activeMenu="추천 전략 둘러보기"
      />
      {/* Main Content */}
      <div
        className={`transition-all duration-300 ${
          sidebarOpen ? "lg:ml-64" : "lg:ml-0"
        }`}
      >
        {/* Header */}
        <DashHeader
          theme={theme}
          toggleTheme={toggleTheme}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          title="추천 전략 둘러보기"
        />

        {/* Dashboard Content */}
        <main className="p-6">
          {/* 검색 및 필터 섹션 */}
        <div className={`rounded-xl shadow-lg p-6 border mb-8 ${
          theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <h2 className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
              클릭 시 전략 상세 설명 및 백테스트 결과 팝업 표시
            </h2>
            <Brain className="w-6 h-6 text-purple-500" />
          </div>
          <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            각 전략을 클릭하면 상세한 백테스트 결과와 성과 분석을 확인할 수 있습니다.
          </p>
        </div>

        {/* 추천 전략 섹션 */}
        <div className="mb-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {recommendedStrategies.map((strategy) => (
              <div
                key={strategy.id}
                onClick={() => setSelectedStrategy(strategy)}
                className={`rounded-xl shadow-lg p-6 border cursor-pointer transition-all hover:shadow-xl ${
                  theme === 'dark' ? 'bg-gray-800 border-gray-700 hover:border-gray-600' : 'bg-white border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getColorClasses(strategy.color)}`}>
                      {strategy.icon}
                    </div>
                    <div>
                      <h3 className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                        {strategy.name}
                      </h3>
                      <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                        {strategy.type} • {strategy.asset}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-lg font-bold ${strategy.returnRate > 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                      +{strategy.returnRate}%
                    </div>
                    <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                      {strategy.period}
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    {strategy.description}
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  {getRiskBadge(strategy.risk)}
                  <Button 
                    size="sm" 
                    className={`${strategy.color === 'emerald' ? 'bg-emerald-500 hover:bg-emerald-600' : 'bg-blue-500 hover:bg-blue-600'} text-white`}
                  >
                    {strategy.period === '구독 후 실행' ? '구독하기' : '전략 복사'}
                  </Button>
                </div>

                {/* 성과 차트 */}
                <div className="mt-4 h-32">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={strategy.performance}>
                      <defs>
                        <linearGradient id={`colorValue${strategy.id}`} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={strategy.color === 'emerald' ? "#10b981" : "#3b82f6"} stopOpacity={0.3}/>
                          <stop offset="95%" stopColor={strategy.color === 'emerald' ? "#10b981" : "#3b82f6"} stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? "#374151" : "#e5e7eb"} />
                      <XAxis dataKey="time" stroke={theme === 'dark' ? "#9ca3af" : "#6b7280"} fontSize={12} />
                      <YAxis stroke={theme === 'dark' ? "#9ca3af" : "#6b7280"} fontSize={12} />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: theme === 'dark' ? "#1f2937" : "#ffffff",
                          border: `1px solid ${theme === 'dark' ? "#374151" : "#e5e7eb"}`,
                          borderRadius: "8px",
                          fontSize: "12px"
                        }}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="value" 
                        stroke={strategy.color === 'emerald' ? "#10b981" : "#3b82f6"} 
                        fillOpacity={1} 
                        fill={`url(#colorValue${strategy.id})`} 
                        strokeWidth={2} 
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 인기 전략 섹션 */}
        <div className="mb-8">
          <h2 className={`text-xl font-bold mb-6 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
            🔥 인기 전략
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {popularStrategies.map((strategy) => (
              <div
                key={strategy.id}
                onClick={() => setSelectedStrategy(strategy)}
                className={`rounded-xl shadow-lg p-6 border cursor-pointer transition-all hover:shadow-xl ${
                  theme === 'dark' ? 'bg-gray-800 border-gray-700 hover:border-gray-600' : 'bg-white border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getColorClasses(strategy.color)}`}>
                    {strategy.icon}
                  </div>
                  <Star className="w-5 h-5 text-yellow-500" />
                </div>

                <h3 className={`font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  {strategy.name}
                </h3>
                
                <p className={`text-sm mb-3 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  {strategy.type} • {strategy.asset}
                </p>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between items-center">
                    <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>수익률</span>
                    <span className="text-emerald-500 font-semibold">+{strategy.returnRate}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>승률</span>
                    <span className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{strategy.winRate}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>최대낙폭</span>
                    <span className="text-red-500 font-medium">{strategy.maxDrawdown}%</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  {getRiskBadge(strategy.risk)}
                  <div className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    구독자 {strategy.subscribers.toLocaleString()}명
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 전략 성과 요약 */}
        <div className={`rounded-xl shadow-lg p-6 border ${
          theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}>
          <h2 className={`text-xl font-bold mb-6 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
            📊 전체 전략 성과 요약
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className={`text-center p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <div className="flex items-center justify-center mb-2">
                <TrendingUp className="w-8 h-8 text-emerald-500" />
              </div>
              <div className={`text-2xl font-bold text-emerald-500 mb-1`}>14.1%</div>
              <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>평균 수익률</div>
            </div>

            <div className={`text-center p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <div className="flex items-center justify-center mb-2">
                <Target className="w-8 h-8 text-blue-500" />
              </div>
              <div className={`text-2xl font-bold text-blue-500 mb-1`}>70.2%</div>
              <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>평균 승률</div>
            </div>

            <div className={`text-center p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <div className="flex items-center justify-center mb-2">
                <Shield className="w-8 h-8 text-purple-500" />
              </div>
              <div className={`text-2xl font-bold text-red-500 mb-1`}>-3.2%</div>
              <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>평균 최대낙폭</div>
            </div>

            <div className={`text-center p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <div className="flex items-center justify-center mb-2">
                <Activity className="w-8 h-8 text-orange-500" />
              </div>
              <div className={`text-2xl font-bold text-orange-500 mb-1`}>24</div>
              <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>전체 전략 수</div>
            </div>
          </div>
        </div>
        </main>

        {/* 전략 상세 모달 (예시) */}
      {selectedStrategy && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className={`rounded-xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto ${
            theme === 'dark' ? 'bg-gray-800' : 'bg-white'
          }`}>
            <div className="flex items-center justify-between mb-6">
              <h3 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {selectedStrategy.name} - 상세 정보
              </h3>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setSelectedStrategy(null)}
              >
                닫기
              </Button>
            </div>
            
            <div className={`p-4 rounded-lg mb-4 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                상세한 백테스트 결과와 전략 분석 내용이 여기에 표시됩니다. 
                실제 구현에서는 차트, 통계, 위험도 분석 등의 상세 정보가 포함될 것입니다.
              </p>
            </div>

            <div className="flex space-x-4">
              <Button className="flex-1 bg-blue-500 hover:bg-blue-600 text-white">
                전략 구독하기
              </Button>
              <Button variant="outline" className="flex-1">
                더 자세히 보기
              </Button>
            </div>
          </div>
        </div>
      )}

        {/* Footer */}
        <DashFooter theme={theme} />
      </div>
    </div>
  );
};

export default StrategyRecommendations;