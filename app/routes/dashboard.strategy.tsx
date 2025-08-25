import { useState, useEffect } from 'react';
// eslint-disable-next-line import/no-unresolved
import { useThemeStore } from '@/stores/themeStore';
import { 
  Settings,
  Bot,
  Grid3X3,
  Repeat,
  TrendingDown,
  Plus,
  Edit,
  Trash2,
  Play,
  Pause,
  MoreHorizontal,
  Brain,
  Activity,
  Target,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
// eslint-disable-next-line import/no-unresolved
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
// eslint-disable-next-line import/no-unresolved
import { Button } from '@/components/ui/button';
// eslint-disable-next-line import/no-unresolved
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
// eslint-disable-next-line import/no-unresolved
import { Badge } from '@/components/ui/badge';
// eslint-disable-next-line import/no-unresolved
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

// eslint-disable-next-line import/no-unresolved
import DashHeader from '@/components/DashHeader';
// eslint-disable-next-line import/no-unresolved
import DashSidebar from '@/components/DashSidebar';
// eslint-disable-next-line import/no-unresolved
import DashFooter from '@/components/DashFooter';
import DashNav from '../components/DashNav';

const Strategy = () => {
  const { theme, toggleTheme } = useThemeStore();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  // 전략 데이터
  const strategyData = [
    {
      id: 1,
      name: 'RSI 역추세 전략',
      type: 'General',
      status: 'active',
      profitRate: 12.5,
      winRate: 68.2,
      maxDrawdown: -3.8,
      lastModified: '2024-07-24',
      description: 'RSI 지표를 활용한 역추세 매매 전략'
    },
    {
      id: 2,
      name: '스마트 어시스턴트',
      type: 'AI Assistant',
      status: 'active',
      profitRate: 15.3,
      winRate: 72.1,
      maxDrawdown: -2.5,
      lastModified: '2024-07-23',
      description: 'AI 기반 시장 분석 및 자동 매매'
    },
    {
      id: 3,
      name: '그리드 매매 봇',
      type: 'GRID Bot',
      status: 'paused',
      profitRate: 8.7,
      winRate: 65.4,
      maxDrawdown: -4.2,
      lastModified: '2024-07-22',
      description: '일정 간격으로 매수/매도 주문을 배치'
    },
    {
      id: 4,
      name: '루프 트레이딩',
      type: 'LOOP Bot',
      status: 'active',
      profitRate: 11.2,
      winRate: 70.3,
      maxDrawdown: -3.1,
      lastModified: '2024-07-24',
      description: '반복적인 매매 패턴으로 수익 창출'
    },
    {
      id: 5,
      name: 'DCA 누적투자',
      type: 'DCA Bot',
      status: 'inactive',
      profitRate: 9.8,
      winRate: 58.9,
      maxDrawdown: -5.6,
      lastModified: '2024-07-21',
      description: '정기적인 분할 매수 전략'
    },
    {
      id: 6,
      name: '볼린저밴드 전략',
      type: 'General',
      status: 'active',
      profitRate: 13.6,
      winRate: 69.8,
      maxDrawdown: -2.9,
      lastModified: '2024-07-24',
      description: '볼린저밴드 상하한선 돌파 전략'
    }
  ];

  // 전략 타입별 필터링
  const strategyTypes = [
    { id: 'all', label: '전체', icon: Target },
    { id: 'General', label: 'General', icon: Settings },
    { id: 'AI Assistant', label: 'AI Assistant', icon: Brain },
    { id: 'GRID Bot', label: 'GRID Bot', icon: Grid3X3 },
    { id: 'LOOP Bot', label: 'LOOP Bot', icon: Repeat },
    { id: 'DCA Bot', label: 'DCA Bot', icon: TrendingDown }
  ];

  // 필터링된 전략 데이터
  const filteredStrategies = activeTab === 'all' 
    ? strategyData 
    : strategyData.filter(strategy => strategy.type === activeTab);

  // 전략 통계
  const strategyStats = {
    total: strategyData.length,
    active: strategyData.filter(s => s.status === 'active').length,
    paused: strategyData.filter(s => s.status === 'paused').length,
    inactive: strategyData.filter(s => s.status === 'inactive').length,
    avgProfit: (strategyData.reduce((sum, s) => sum + s.profitRate, 0) / strategyData.length).toFixed(1)
  };

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

  // 상태 배지 렌더링
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">활성</Badge>;
      case 'paused':
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">일시정지</Badge>;
      case 'inactive':
        return <Badge variant="secondary">비활성</Badge>;
      default:
        return <Badge variant="secondary">알 수 없음</Badge>;
    }
  };

  // 전략 타입 아이콘 렌더링
  const getTypeIcon = (type: string) => {
    const typeConfig = strategyTypes.find(t => t.id === type);
    if (typeConfig) {
      const IconComponent = typeConfig.icon;
      return <IconComponent className="w-4 h-4" />;
    }
    return <Settings className="w-4 h-4" />;
  };

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Sidebar */}
      <DashSidebar
        theme={theme}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        activeMenu="대시보드"
      />

      {/* Main Content */}
      <div className={`transition-all duration-300 ${sidebarOpen ? 'lg:ml-64' : 'lg:ml-0'}`}>
        {/* Header */}
        <DashHeader
          theme={theme}
          toggleTheme={toggleTheme}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          title="전략타겟"
        />

        <DashNav activeTab="strategy"/>

        {/* Dashboard Content */}
        <main className="p-6">
          {/* 전략 통계 카드 */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
            <Card className={theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  전체 전략
                </CardTitle>
                <Target className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  {strategyStats.total}개
                </div>
              </CardContent>
            </Card>

            <Card className={theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  활성 전략
                </CardTitle>
                <Play className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-500">
                  {strategyStats.active}개
                </div>
              </CardContent>
            </Card>

            <Card className={theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  일시정지
                </CardTitle>
                <Pause className="h-4 w-4 text-yellow-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-500">
                  {strategyStats.paused}개
                </div>
              </CardContent>
            </Card>

            <Card className={theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  비활성
                </CardTitle>
                <AlertCircle className="h-4 w-4 text-gray-500" />
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                  {strategyStats.inactive}개
                </div>
              </CardContent>
            </Card>

            <Card className={theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  평균 수익률
                </CardTitle>
                <Activity className="h-4 w-4 text-purple-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-500">
                  +{strategyStats.avgProfit}%
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 전략 타입 필터 탭 */}
          <div className={`border-b mb-6 ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
            <div className="flex space-x-8 overflow-x-auto">
              {strategyTypes.map((type) => {
                const IconComponent = type.icon;
                return (
                  <button
                    key={type.id}
                    onClick={() => setActiveTab(type.id)}
                    className={`py-3 px-1 text-sm font-medium border-b-2 whitespace-nowrap transition-colors flex items-center gap-2 ${
                      activeTab === type.id 
                        ? theme === 'dark'
                          ? 'border-cyan-400 text-cyan-400'
                          : 'border-blue-600 text-blue-600'
                        : theme === 'dark'
                          ? 'border-transparent text-gray-400 hover:text-gray-300'
                          : 'border-transparent text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <IconComponent className="w-4 h-4" />
                    {type.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 액션 버튼 */}
          <div className="flex justify-between items-center mb-6">
            <h2 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              전략 목록 ({filteredStrategies.length}개)
            </h2>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              <Plus className="w-4 h-4 mr-2" />
              새 전략 추가
            </Button>
          </div>

          {/* 전략 테이블 */}
          <div className={`rounded-xl border ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} mb-8`}>
            <div className={`relative overflow-hidden border-t ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
              <Table>
                <colgroup>
                  <col className="w-1/12" />
                  <col className="w-3/12" />
                  <col className="w-1/12" />
                  <col className="w-1/12" />
                  <col className="w-1/12" />
                  <col className="w-1/12" />
                  <col className="w-2/12" />
                  <col className="w-2/12" />
                  <col className="w-1/12" />
                </colgroup>
                <TableHeader>
                  <TableRow className={theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}>
                    <TableHead className={`text-center ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>상태</TableHead>
                    <TableHead className={`text-center ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>전략명</TableHead>
                    <TableHead className={`text-center ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>타입</TableHead>
                    <TableHead className={`text-center ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>수익률</TableHead>
                    <TableHead className={`text-center ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>승률</TableHead>
                    <TableHead className={`text-center ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>최대낙폭</TableHead>
                    <TableHead className={`text-center ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>설명</TableHead>
                    <TableHead className={`text-center ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>최종수정일</TableHead>
                    <TableHead className="w-12"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStrategies.map((strategy) => (
                    <TableRow 
                      key={strategy.id} 
                      className={`${theme === 'dark' ? 'border-gray-700 hover:bg-gray-750' : 'border-gray-200 hover:bg-gray-50'} transition-colors`}
                    >
                      <TableCell className="text-center">
                        {getStatusBadge(strategy.status)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-3 text-left">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            strategy.type === 'General' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300' :
                            strategy.type === 'AI Assistant' ? 'bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-300' :
                            strategy.type === 'GRID Bot' ? 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300' :
                            strategy.type === 'LOOP Bot' ? 'bg-orange-100 text-orange-600 dark:bg-orange-900 dark:text-orange-300' :
                            'bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300'
                          }`}>
                            {getTypeIcon(strategy.type)}
                          </div>
                          <div>
                            <div className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                              {strategy.name}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant="outline" className={theme === 'dark' ? 'border-gray-600 text-gray-300' : 'border-gray-300 text-gray-700'}>
                          {strategy.type}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant={strategy.profitRate > 0 ? "default" : "destructive"} className={
                          strategy.profitRate > 0 
                            ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-100"
                            : ""
                        }>
                          {strategy.profitRate > 0 ? '+' : ''}{strategy.profitRate}%
                        </Badge>
                      </TableCell>
                      <TableCell className={`text-center font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                        {strategy.winRate}%
                      </TableCell>
                      <TableCell className={`text-center font-medium text-red-500`}>
                        {strategy.maxDrawdown}%
                      </TableCell>
                      <TableCell className={`text-left ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} text-sm`}>
                        {strategy.description}
                      </TableCell>
                      <TableCell className={`text-center text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                        {strategy.lastModified}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className={theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}>
                            <DropdownMenuItem 
                              onClick={() => console.log('전략 수정', strategy.id)} 
                              className={theme === 'dark' ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'}
                            >
                              <Edit className="w-4 h-4 mr-2" />
                              전략 수정
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => console.log('전략 복사', strategy.id)} 
                              className={theme === 'dark' ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'}
                            >
                              <Plus className="w-4 h-4 mr-2" />
                              전략 복사
                            </DropdownMenuItem>
                            {strategy.status === 'active' ? (
                              <DropdownMenuItem 
                                onClick={() => console.log('전략 일시정지', strategy.id)} 
                                className={theme === 'dark' ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'}
                              >
                                <Pause className="w-4 h-4 mr-2" />
                                일시정지
                              </DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem 
                                onClick={() => console.log('전략 시작', strategy.id)} 
                                className={theme === 'dark' ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'}
                              >
                                <Play className="w-4 h-4 mr-2" />
                                전략 시작
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem 
                              onClick={() => console.log('전략 삭제', strategy.id)} 
                              className="text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              전략 삭제
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* 전략 성과 요약 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 전략별 성과 비교 */}
            <Card className={theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}>
              <CardHeader>
                <CardTitle className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
                  전략별 성과 비교
                </CardTitle>
                <CardDescription className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                  활성 전략들의 주요 지표 비교
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredStrategies.filter(s => s.status === 'active').slice(0, 3).map((strategy) => (
                    <div key={strategy.id} className={`p-4 rounded-lg border ${
                      theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'
                    }`}>
                      <div className="flex items-center justify-between mb-2">
                        <span className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                          {strategy.name}
                        </span>
                        <div className="flex items-center gap-1">
                        <div className={`text-xs font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-900'}`}>
                            {getTypeIcon(strategy.type)}
                          </div>
                          <Badge variant="outline" className={`text-xs font-medium ${theme === 'dark' ? 'text-gray-400 border-gray-600' : 'text-gray-900 border-gray-200'}`}>
                            {strategy.type}
                          </Badge>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-xs">
                        <div>
                          <div className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>수익률</div>
                          <div className="text-green-500 font-medium">+{strategy.profitRate}%</div>
                        </div>
                        <div>
                          <div className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>승률</div>
                          <div className="text-blue-500 font-medium">{strategy.winRate}%</div>
                        </div>
                        <div>
                          <div className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>최대낙폭</div>
                          <div className="text-red-500 font-medium">{strategy.maxDrawdown}%</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* 전략 운영 가이드 */}
            <Card className={theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}>
              <CardHeader>
                <CardTitle className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
                  전략 운영 가이드
                </CardTitle>
                <CardDescription className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                  효과적인 전략 관리를 위한 팁
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className={`p-3 rounded-lg ${theme === 'dark' ? 'bg-blue-900/20 border border-blue-700' : 'bg-blue-50 border border-blue-200'}`}>
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="w-4 h-4 text-blue-500" />
                      <span className={`text-sm font-medium ${theme === 'dark' ? 'text-blue-300' : 'text-blue-900'}`}>
                        다양한 전략 조합
                      </span>
                    </div>
                    <div className={`text-xs ${theme === 'dark' ? 'text-blue-200' : 'text-blue-700'}`}>
                      여러 유형의 전략을 조합하여 리스크를 분산하세요
                    </div>
                  </div>
                  
                  <div className={`p-3 rounded-lg ${theme === 'dark' ? 'bg-green-900/20 border border-green-700' : 'bg-green-50 border border-green-200'}`}>
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className={`text-sm font-medium ${theme === 'dark' ? 'text-green-300' : 'text-green-900'}`}>
                        정기적인 성과 점검
                      </span>
                    </div>
                    <div className={`text-xs ${theme === 'dark' ? 'text-green-200' : 'text-green-700'}`}>
                      주기적으로 전략 성과를 검토하고 최적화하세요
                    </div>
                  </div>
                  
                  <div className={`p-3 rounded-lg ${theme === 'dark' ? 'bg-amber-900/20 border border-amber-700' : 'bg-amber-50 border border-amber-200'}`}>
                    <div className="flex items-center gap-2 mb-2">
                      <AlertCircle className="w-4 h-4 text-amber-500" />
                      <span className={`text-sm font-medium ${theme === 'dark' ? 'text-amber-300' : 'text-amber-900'}`}>
                        리스크 관리
                      </span>
                    </div>
                    <div className={`text-xs ${theme === 'dark' ? 'text-amber-200' : 'text-amber-700'}`}>
                      최대낙폭이 큰 전략은 신중하게 운영하세요
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>

        {/* Footer */}
        <DashFooter theme={theme} />
      </div>
    </div>
  );
};

export default Strategy;