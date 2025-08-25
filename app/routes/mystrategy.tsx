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
  CheckCircle,
  Moon,
  Sun,
  Menu,
  X,
  BarChart3,
  TrendingUp,
  Clock,
  Users
} from 'lucide-react';
// eslint-disable-next-line import/no-unresolved
import { Button } from '@/components/ui/button';
// eslint-disable-next-line import/no-unresolved
import { Badge } from '@/components/ui/badge';
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
import DashHeader from '@/components/DashHeader';
// eslint-disable-next-line import/no-unresolved
import DashSidebar from '@/components/DashSidebar';
// eslint-disable-next-line import/no-unresolved
import DashFooter from '@/components/DashFooter';
// eslint-disable-next-line import/no-unresolved
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
// eslint-disable-next-line import/no-unresolved
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

import { useNavigate } from 'react-router-dom';

const MyStrategyManagement = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useThemeStore();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('전체');

  const strategyData = [
    {
      id: 1,
      name: '전략A',
      asset: 'BTCUSDT',
      type: '스윙',
      time:'1시간',
      status: 'active',
      lastModified: '2024-07-24 19:00',
    },
    {
      id: 2,
      name: '전략B',
      asset: 'BTCUSDT',
      type: '단타',
      time:'30분',
      status: 'active',
      lastModified: '2024-07-27 18:00',
    },
    {
      id: 3,
      name: '전략C',
      asset: 'BTCUSDT',
      type: '스윙',
      time:'일봉',
      status: 'paused',
      lastModified: '2024-07-22 10:00',
    },
    {
      id: 4,
      name: '전략D',
      asset: 'TIGER 배당',
      type: '중장기',
      time:'주봉',
      status: 'active',
      lastModified: '2024-07-21 09:00',
    }
  ];

  // 전략 통계
  // const strategyStats = {
  //   total: 5,
  //   active: 2,
  //   totalProfit: 8.7
  // };

  // 상단 요약 카드 데이터
  // const summaryCard = {
  //   totalStrategies: strategyStats.total,
  //   activeStrategies: strategyStats.active,
  //   totalProfit: strategyStats.totalProfit
  // };

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
        return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300">실행 중</span>;
      case 'paused':
        return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300">중지</span>;
      case 'inactive':
        return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">비활성</span>;
      default:
        return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">알 수 없음</span>;
    }
  };

  // 수익률 색상 결정
  const getProfitColor = (profit: number) => {
    if (profit > 0) return 'text-green-500';
    if (profit < 0) return 'text-red-500';
    return theme === 'dark' ? 'text-gray-300' : 'text-gray-600';
  };

  // 전략 타입별 필터링
  const strategyTypes = [
    { id: '전체', label: '전체', icon: Target },
    { id: '전략A', label: '전략A', icon: Settings },
    { id: '전략B', label: '전략B', icon: Brain },
    { id: '전략C', label: '전략C', icon: Grid3X3 },
    { id: '전략D', label: '전략D', icon: Repeat }
  ];
  // 필터링된 전략 데이터
  const filteredStrategies = activeTab === '전체' 
    ? strategyData 
    : strategyData.filter(strategy => strategy.type === activeTab);

    // 전략 통계
  const strategyStats = {
    total: strategyData.length,
    active: strategyData.filter(s => s.status === 'active').length,
    paused: strategyData.filter(s => s.status === 'paused').length,
    inactive: strategyData.filter(s => s.status === 'inactive').length,
    avgProfit: "8.7"
  };
  
  // 전략 타입 아이콘 렌더링
  const getTypeIcon = (name: string) => {
    const typeConfig = strategyTypes.find(t => t.id === name);
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
        activeMenu="내 전략 관리"
      />
      {/* Main Content */}
      <div className={`transition-all duration-300 ${sidebarOpen ? 'lg:ml-64' : 'lg:ml-0'}`}>
        {/* Header */}
        <DashHeader
          theme={theme}
          toggleTheme={toggleTheme}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          title="내 전략 관리"
        />

        {/* Dashboard Content */}
        <main className="p-6">
          {/* 전략 통계 카드 */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
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
                  비활성
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
            <Button onClick={() => navigate('/mystrategyAdd')} className="bg-blue-600 hover:bg-blue-700 text-white">
              <Plus className="w-4 h-4 mr-2" />
              새 전략 등록
            </Button>
          </div>

          {/* 전략 테이블 */}
          <div className={`rounded-xl border ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} mb-8`}>
            <div className={`relative overflow-hidden border-t ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
              <Table>
                <colgroup>
                  <col className="w-4/12" />
                  <col className="w-2/12" />
                  <col className="w-1/12" />
                  <col className="w-1/12" />
                  <col className="w-1/12" />
                  <col className="w-2/12" />
                  <col className="w-1/12" />
                </colgroup>
                <TableHeader>
                  <TableRow className={theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}>
                    <TableHead className={`text-center ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>전략명</TableHead>
                    <TableHead className={`text-center ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>자산</TableHead>
                    <TableHead className={`text-center ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>유형</TableHead>
                    <TableHead className={`text-center ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>시간봉</TableHead>
                    <TableHead className={`text-center ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>상태</TableHead>
                    <TableHead className={`text-center ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>최근진입</TableHead>
                    <TableHead className="w-12"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStrategies.map((strategy) => (
                    <TableRow 
                      key={strategy.id} 
                      className={`${theme === 'dark' ? 'border-gray-700 ' : 'border-gray-200 '}`}
                    >
                      
                      <TableCell>
                        <div className="flex items-center space-x-3 text-left">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            strategy.name === '전략A' ? 'bg-blue-100 text-blue-600 ' :
                            strategy.name === '전략B' ? 'bg-purple-100 text-purple-600 ' :
                            strategy.name === '전략C' ? 'bg-green-100 text-green-600 ' :
                            strategy.name === '전략D' ? 'bg-orange-100 text-orange-600 ' :
                            'bg-red-100 text-red-600 '
                          }`}>
                            {getTypeIcon(strategy.name)}
                          </div>
                          <div>
                            <div className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                              {strategy.name}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className={`text-center ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                          {strategy.asset}
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant="outline" className={theme === 'dark' ? 'border-gray-600 text-gray-300' : 'border-gray-300 text-gray-700'}>
                          {strategy.type}
                        </Badge>
                      </TableCell>
                      <TableCell className={`text-center ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                        {strategy.time}
                      </TableCell>
                      <TableCell className="text-center">
                        {getStatusBadge(strategy.status)}
                      </TableCell>
                      <TableCell className={`text-center text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                        {strategy.lastModified}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal className={`h-4 w-4 text-center  ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`} />
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

          {/* 전략 리스트 테이블 */}
          {/* <div className={`rounded-lg border ${
            theme === 'dark' 
              ? 'bg-gray-800 border-gray-700' 
              : 'bg-white border-gray-200'
          }`}>
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                전략 리스트 테이블
              </h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className={`border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
                    <th className={`px-4 py-3 text-left text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                      전략명
                    </th>
                    <th className={`px-4 py-3 text-left text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                      자산
                    </th>
                    <th className={`px-4 py-3 text-left text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                      유형
                    </th>
                    <th className={`px-4 py-3 text-left text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                      시간봉
                    </th>
                    <th className={`px-4 py-3 text-left text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                      상태
                    </th>
                    <th className={`px-4 py-3 text-left text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                      최근 진입
                    </th>
                    <th className={`px-4 py-3 text-left text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                      버튼
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {myStrategies.map((strategy) => (
                    <tr 
                      key={strategy.id}
                      className={`border-b ${
                        theme === 'dark' 
                          ? 'border-gray-700 hover:bg-gray-750' 
                          : 'border-gray-200 hover:bg-gray-50'
                      } transition-colors`}
                    >
                      <td className="px-4 py-4">
                        <div className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                          {strategy.name}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                          {strategy.asset}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                          {strategy.type === 'BTCUSDT' ? '스윙' : strategy.type === '005930' ? '단타' : strategy.type}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                          {strategy.period}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex flex-col space-y-1">
                          {getStatusBadge(strategy.status)}
                          <div className={`text-xs ${getProfitColor(strategy.profitRate)}`}>
                            {strategy.profitRate > 0 ? '+' : ''}{strategy.profitRate}%
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                          {strategy.lastModified}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex space-x-2">
                          {strategy.status === 'active' ? (
                            <>
                              <button className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:hover:bg-blue-800/30">
                                수정
                              </button>
                              <button className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200 dark:bg-red-900/20 dark:text-red-300 dark:hover:bg-red-800/30">
                                삭제
                              </button>
                              <button className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600">
                                OFF
                              </button>
                            </>
                          ) : strategy.status === 'inactive' ? (
                            <>
                              <button className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:hover:bg-blue-800/30">
                                수정
                              </button>
                              <button className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200 dark:bg-green-900/20 dark:text-green-300 dark:hover:bg-green-800/30">
                                실행
                              </button>
                            </>
                          ) : (
                            <>
                              <button className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:hover:bg-blue-800/30">
                                수정
                              </button>
                              <button className="px-2 py-1 text-xs bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-300 dark:hover:bg-yellow-800/30">
                                중지
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div> */}


        </main>
        {/* Footer */}
        <DashFooter theme={theme} />
        
      </div>
    </div>
  );
};

export default MyStrategyManagement;