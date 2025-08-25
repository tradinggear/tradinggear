import { useState, useEffect } from 'react';
// eslint-disable-next-line import/no-unresolved
import { useThemeStore } from '@/stores/themeStore';
import { 
  TrendingUp,
  TrendingDown,
  Clock,
  DollarSign,
  BarChart3,
  PieChart,
  Activity,
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  CircleDot,
  Calendar,
  Timer,
  Target,
  Zap
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
import { Badge } from '@/components/ui/badge';
// eslint-disable-next-line import/no-unresolved
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

// eslint-disable-next-line import/no-unresolved
import DashHeader from '@/components/DashHeader';
// eslint-disable-next-line import/no-unresolved
import DashSidebar from '@/components/DashSidebar';
// eslint-disable-next-line import/no-unresolved
import DashFooter from '@/components/DashFooter';
import DashNav from '@/components/DashNav';

const Assets = () => {
  const { theme, toggleTheme } = useThemeStore();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // 실시간 포지션/주문 데이터
  const positionData = [
    {
      symbol: 'BTCUSDT',
      strategy: '전략 A',
      entryPrice: 30000,
      unrealizedPnL: 200,
      currentPrice: 31000,
      leverage: '10x'
    },
    {
      symbol: 'ETHUSDT',
      strategy: '전략 B',
      entryPrice: 2000,
      unrealizedPnL: -150,
      currentPrice: 1900,
      leverage: '5x'
    }
  ];

  // 체결 타임라인 데이터
  const executionTimeline = [
    {
        action: '시작',
        details: '전략 A 시작',
        time: '09:00:01',
    },
    {
        action: '주문전송',
        details: 'BTCUSDT 매수 주문',
        time: '09:00:02',
    },
    {
        action: '거래소응답',
        details: '주문 접수 완료',
        time: '09:00:02',
    },
    {
        action: '체결/거부/부분체결',
        details: 'BTCUSDT 매수 체결 완료',
        time: '09:00:03',
    }
  ];

  // 전일/당일 요약 데이터
  const summaryData = {
    yesterday: {
      realizationProfit: 350,
      commission: 50,
      winLossRatio: '60%',
      maxMinRatio: '120/80'
    },
    today: {
      realizationProfit: 120,
      commission: 25,
      winLossRatio: '70%',
      maxMinRatio: '110/90'
    }
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
          title="자산현황"
        />

        <DashNav activeTab="assets"/>

        {/* Dashboard Content */}
        <main className="p-6">
          {/* 자산 현황 요약 */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card className={theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  총 자산
                </CardTitle>
                <Wallet className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  $12,450
                </div>
                <p className="text-xs text-green-500 flex items-center mt-1">
                  <ArrowUpRight className="h-3 w-3 mr-1" />
                  +2.5% 오늘
                </p>
              </CardContent>
            </Card>

            <Card className={theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  미실현 손익
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-500">
                  +$50
                </div>
                <p className="text-xs text-green-500 flex items-center mt-1">
                  <ArrowUpRight className="h-3 w-3 mr-1" />
                  활성 포지션
                </p>
              </CardContent>
            </Card>

            <Card className={theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  실현 손익 (당일)
                </CardTitle>
                <DollarSign className="h-4 w-4 text-purple-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-500">
                  +$120
                </div>
                <p className="text-xs text-purple-500 flex items-center mt-1">
                  <Target className="h-3 w-3 mr-1" />
                  목표 달성
                </p>
              </CardContent>
            </Card>

            <Card className={theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  활성 전략
                </CardTitle>
                <Activity className="h-4 w-4 text-orange-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-500">
                  4개
                </div>
                <p className="text-xs text-orange-500 flex items-center mt-1">
                  <Zap className="h-3 w-3 mr-1" />
                  실시간 운영중
                </p>
              </CardContent>
            </Card>
          </div>

          <div className='mb-8'>
            {/* 실시간 포지션/주문 */}
            <Card className={theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}>
                <CardHeader>
                  <CardTitle className={`text-lg font-bold flex items-center gap-2 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
                    <BarChart3 className="w-5 h-5 text-blue-500" />
                    실시간 포지션/주문
                  </CardTitle>
                  <CardDescription className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                    현재 활성 포지션 및 주문 현황
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow className={theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}>
                        <TableHead className={`text-center ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>종목/심볼</TableHead>
                        <TableHead className={`text-center ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>전략명</TableHead>
                        <TableHead className={`text-center ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>진입가/수량</TableHead>
                        <TableHead className={`text-center ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>미실현 PnL</TableHead>
                        <TableHead className={`text-center ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>현재가(선물)</TableHead>
                        <TableHead className={`text-center ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>레버리지</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {positionData.map((position, index) => (
                        <TableRow 
                          key={index}
                          className={`${theme === 'dark' ? 'border-gray-700 hover:bg-gray-750' : 'border-gray-200 hover:bg-gray-50'} transition-colors`}
                        >
                          <TableCell className="text-center font-medium">
                            <div className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} flex items-center justify-center gap-2`}>
                              {position.symbol}
                            </div>
                          </TableCell>
                          <TableCell className="text-center">
                            <Badge variant="outline" className={theme === 'dark' ? 'border-gray-600 text-gray-300' : 'border-gray-300 text-gray-700'}>
                              {position.strategy}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-center">
                            <div className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                              ${position.entryPrice.toLocaleString()}
                            </div>
                          </TableCell>
                          <TableCell className="text-center">
                            <Badge variant={position.unrealizedPnL > 0 ? "default" : "destructive"} className={
                              position.unrealizedPnL > 0 
                                ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-100"
                                : ""
                            }>
                              {position.unrealizedPnL > 0 ? '+' : ''}${position.unrealizedPnL}
                            </Badge>
                          </TableCell>
                          <TableCell className={`text-center font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                            ${position.currentPrice.toLocaleString()}
                          </TableCell>
                          <TableCell className="text-center">
                            <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
                              {position.leverage}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
            <div className='flex gap-8 flex-col lg:flex-row'>
            {/* 체결 타임라인 */}
            <Card className={`w-full lg:w-1/2 ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                <CardHeader>
                  <CardTitle className={`text-lg font-bold flex items-center gap-2 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
                    <Clock className="w-5 h-5 text-purple-500" />
                    체결 타임라인
                  </CardTitle>
                  <CardDescription className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                    실시간 거래 실행 로그
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow className={theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}>
                        <TableHead className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>액션</TableHead>
                        <TableHead className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>세부사항</TableHead>
                        <TableHead className={`text-center ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>시각</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {executionTimeline.map((item, index) => (
                        <TableRow 
                          key={index}
                          className={`${theme === 'dark' ? 'border-gray-700 hover:bg-gray-750' : 'border-gray-200 hover:bg-gray-50'} transition-colors`}
                        >
                          <TableCell className="">
                          <Badge variant="outline" className={theme === 'dark' ? 'border-gray-600 text-gray-300' : 'border-gray-300 text-gray-700'}>
                              {item.action}
                            </Badge>
                          </TableCell>
                          <TableCell className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                            {item.details}
                          </TableCell>
                          <TableCell className="text-center">
                            <div className="flex items-center justify-center gap-2">
                              <Clock className={`${theme === 'dark' ? 'text-gray-300' : 'text-blue-500'} w-3 h-3`} />
                              <span className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} font-mono text-sm`}>{item.time}</span>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
            </Card>
            {/* 전일/당일 요약 */}
            <Card className={`w-full lg:w-1/2 ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
              <CardHeader>
                <CardTitle className={`text-lg font-bold flex items-center gap-2 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
                  <PieChart className="w-5 h-5 text-green-500" />
                  전일/당일 요약
                </CardTitle>
                <CardDescription className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                  거래 성과 비교
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* 어제 */}
                <div className={`p-4 rounded-lg border ${theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
                  <div className="flex items-center gap-2 mb-3">
                    <Calendar className="w-4 h-4 text-blue-500" />
                    <span className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>어제</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <div className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>실현수익</div>
                      <div className="text-green-500 font-medium">$350</div>
                    </div>
                    <div>
                      <div className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>수수료</div>
                      <div className="text-red-500 font-medium">$50</div>
                    </div>
                    <div>
                      <div className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>승/패 비율</div>
                      <div className="text-blue-500 font-medium">60%</div>
                    </div>
                    <div>
                      <div className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>최대/최소</div>
                      <div className="text-purple-500 font-medium">120/80</div>
                    </div>
                  </div>
                </div>
                {/* 오늘 */}
                <div className={`p-4 rounded-lg border ${theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
                  <div className="flex items-center gap-2 mb-3">
                    <Timer className="w-4 h-4 text-orange-500" />
                    <span className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>오늘</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <div className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>실현수익</div>
                      <div className="text-green-500 font-medium">$120</div>
                    </div>
                    <div>
                      <div className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>수수료</div>
                      <div className="text-red-500 font-medium">$25</div>
                    </div>
                    <div>
                      <div className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>승/패 비율</div>
                      <div className="text-blue-500 font-medium">70%</div>
                    </div>
                    <div>
                      <div className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>최대/최소</div>
                      <div className="text-purple-500 font-medium">110/90</div>
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

export default Assets;