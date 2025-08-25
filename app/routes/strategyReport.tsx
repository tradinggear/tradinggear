// eslint-disable-next-line import/no-unresolved
import { useThemeStore } from "@/stores/themeStore";
import { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { 
  DollarSign,
  CreditCard,
  TrendingUp,
  Activity,
  ArrowUpRight,
  CheckCircle,
  AlertCircle,
  Brain,
  MoreHorizontal,
  Plus,
  Copyleft,
  Target,
  TrendingDown,
  Calendar,
  BarChart3
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';

// eslint-disable-next-line import/no-unresolved
import DashHeader from "@/components/DashHeader";
// eslint-disable-next-line import/no-unresolved
import DashSidebar from "@/components/DashSidebar";
// eslint-disable-next-line import/no-unresolved
import DashFooter from "@/components/DashFooter";

const StrategyReport = () => {
  const { theme, toggleTheme } = useThemeStore();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState("1개월");

  // 전략별 수익률 그래프 데이터
  const strategyProfitData = [
    { name: "RSI 역추세", profit: 12.5, color: "#10B981" },
    { name: "볼린저밴드", profit: 8.3, color: "#3B82F6" },
    { name: "이동평균 돌파", profit: 15.2, color: "#8B5CF6" },
    { name: "MACD 전략", profit: 6.8, color: "#F59E0B" },
    { name: "모멘텀 전략", profit: 11.4, color: "#EF4444" },
  ];

  // 전략 목록 데이터
  const strategyList = [
    {
      name: "RSI 역추세",
      description: "사용자 등록 전략 상태 + 실행 제어",
      basicInfo: "기본정보 + 조건 + 실행설정",
      type: "수전 전략",
      platform: "플래폼 프리셋 전략 목록",
      performance: "전략별 손익 추이 및 실행 이력",
    },
    {
      name: "볼린저밴드",
      description: "사용자 등록 전략 상태 + 실행 제어",
      basicInfo: "기본정보 + 조건 + 실행설정",
      type: "수전 전략",
      platform: "플래폼 프리셋 전략 목록",
      performance: "전략별 손익 추이 및 실행 이력",
    },
    {
      name: "이동평균 돌파",
      description: "사용자 등록 전략 상태 + 실행 제어",
      basicInfo: "기본정보 + 조건 + 실행설정",
      type: "수전 전략",
      platform: "플래폼 프리셋 전략 목록",
      performance: "전략별 손익 추이 및 실행 이력",
    },
    {
      name: "MACD 전략",
      description: "사용자 등록 전략 상태 + 실행 제어",
      basicInfo: "기본정보 + 조건 + 실행설정",
      type: "수전 전략",
      platform: "플래폼 프리셋 전략 목록",
      performance: "전략별 손익 추이 및 실행 이력",
    },
    {
      name: "모멘텀 전략",
      description: "사용자 등록 전략 상태 + 실행 제어",
      basicInfo: "기본정보 + 조건 + 실행설정",
      type: "수전 전략",
      platform: "플래폼 프리셋 전략 목록",
      performance: "전략별 손익 추이 및 실행 이력",
    },
  ];

  // 최근 거래 내역 데이터
  const recentTrades = [
    {
      strategy: "RSI 역추세",
      action: "매수",
      symbol: "TSLA",
      amount: 10,
      price: 250.5,
      profit: "+2.1%",
      time: "14:25:32",
    },
    {
      strategy: "볼린저밴드",
      action: "매도",
      symbol: "NVDA",
      amount: 5,
      price: 890.2,
      profit: "+4.5%",
      time: "14:20:15",
    },
    {
      strategy: "이동평균 돌파",
      action: "매수",
      symbol: "AAPL",
      amount: 25,
      price: 195.3,
      profit: "+1.8%",
      time: "14:15:48",
    },
    {
      strategy: "MACD 전략",
      action: "매도",
      symbol: "AMZN",
      amount: 8,
      price: 3420.8,
      profit: "-0.5%",
      time: "14:10:22",
    },
    {
      strategy: "모멘텀 전략",
      action: "매수",
      symbol: "MSFT",
      amount: 15,
      price: 410.2,
      profit: "+3.2%",
      time: "14:05:11",
    },
  ];

  // 전략별 누적 수익/손실/실패 원인 분석 데이터
  const strategyAnalysis = [
    {
      name: "RSI 역추세",
      totalProfit: 1250000,
      totalLoss: -180000,
      netProfit: 1070000,
      winRate: 68.2,
      failures: [
        { reason: "급격한 시장 변동성", count: 3 },
        { reason: "거래량 부족", count: 2 },
        { reason: "뉴스 이벤트 영향", count: 1 },
      ],
    },
    {
      name: "볼린저밴드",
      totalProfit: 950000,
      totalLoss: -120000,
      netProfit: 830000,
      winRate: 72.5,
      failures: [
        { reason: "횡보장에서 잦은 거짓신호", count: 4 },
        { reason: "밴드 수렴 구간 오판", count: 2 },
      ],
    },
    {
      name: "이동평균 돌파",
      totalProfit: 1580000,
      totalLoss: -280000,
      netProfit: 1300000,
      winRate: 65.8,
      failures: [
        { reason: "가짜 돌파 신호", count: 5 },
        { reason: "지연된 진입 타이밍", count: 3 },
      ],
    },
  ];

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
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const formatCurrency = (value) => {
    if (value >= 100000000) {
      return `${(value / 100000000).toFixed(1)}억`;
    } else if (value >= 10000) {
      return `${(value / 10000).toFixed(0)}만`;
    } else {
      return value.toLocaleString();
    }
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
        activeMenu="전략 성과 리포트"
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
          title="전략 성과 리포트"
        />

        {/* Dashboard Content */}
        <main className="p-6">
          <div className="flex items-center justify-between space-x-4 mb-4">
            <h3 className={`text-lg font-bold ${
              theme === "dark"
                ? "text-white"
                : "text-gray-800"
            }`}>전략성과 리포트 기간 설정</h3>
            <div className="flex space-x-2">
              {["1주일", "1개월", "3개월", "1년"].map((period) => (
                <button
                  key={period}
                  onClick={() => setSelectedPeriod(period)}
                  className={`px-3 py-1 text-sm rounded transition-colors ${
                    selectedPeriod === period
                      ? "bg-blue-500 text-white"
                      : theme === "dark"
                      ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {period}
                </button>
              ))}
            </div>
          </div>
          {/* 전략별 수익률 그래프 */}
          <div
            className={`rounded-xl shadow-lg p-6 border mb-8 ${
              theme === "dark"
                ? "bg-gray-800 border-gray-700"
                : "bg-white border-gray-200"
            }`}
          >
            <div className="flex items-center justify-between mb-6">
              <h3
                className={`text-lg font-bold ${
                  theme === "dark" ? "text-white" : "text-gray-800"
                }`}
              >
                전략별 수익률 그래프
              </h3>
              <BarChart3 className="w-5 h-5 text-blue-500" />
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={strategyProfitData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke={theme === "dark" ? "#374151" : "#e5e7eb"}
                />
                <XAxis
                  dataKey="name"
                  stroke={theme === "dark" ? "#9ca3af" : "#6b7280"}
                  fontSize={12}
                />
                <YAxis
                  stroke={theme === "dark" ? "#9ca3af" : "#6b7280"}
                  tickFormatter={(value) => `${value}%`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: theme === "dark" ? "#1f2937" : "#ffffff",
                    border: `1px solid ${
                      theme === "dark" ? "#374151" : "#e5e7eb"
                    }`,
                    borderRadius: "8px",
                    color: theme === "dark" ? "#ffffff" : "#000000",
                  }}
                  formatter={(value) => [`${value}%`, "수익률"]}
                />
                <Bar dataKey="profit" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* 최근 거래 내역, 실현 손익 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* 최근 거래 내역 */}
            <div
              className={`rounded-xl shadow-lg p-6 border ${
                theme === "dark"
                  ? "bg-gray-800 border-gray-700"
                  : "bg-white border-gray-200"
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <h3
                  className={`text-lg font-bold ${
                    theme === "dark" ? "text-white" : "text-gray-800"
                  }`}
                >
                  최근 거래 내역
                </h3>
                <Activity className="w-5 h-5 text-green-500" />
              </div>
              <div className="space-y-3">
                {recentTrades.slice(0, 5).map((trade, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-lg border ${
                      theme === "dark"
                        ? "bg-gray-700 border-gray-600"
                        : "bg-gray-50 border-gray-200"
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div
                          className={`font-medium text-sm ${
                            theme === "dark" ? "text-white" : "text-gray-900"
                          }`}
                        >
                          {trade.strategy}
                        </div>
                        <div
                          className={`text-xs ${
                            theme === "dark" ? "text-gray-400" : "text-gray-600"
                          }`}
                        >
                          {trade.symbol} • {trade.action} {trade.amount}주
                        </div>
                      </div>
                      <div className="text-right">
                        <div
                          className={`text-sm font-medium ${
                            trade.profit.startsWith("+")
                              ? "text-green-500"
                              : "text-red-500"
                          }`}
                        >
                          {trade.profit}
                        </div>
                        <div
                          className={`text-xs ${
                            theme === "dark" ? "text-gray-400" : "text-gray-500"
                          }`}
                        >
                          {trade.time}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 실현 손익 */}
            <div
              className={`rounded-xl shadow-lg p-6 border ${
                theme === "dark"
                  ? "bg-gray-800 border-gray-700"
                  : "bg-white border-gray-200"
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <h3
                  className={`text-lg font-bold ${
                    theme === "dark" ? "text-white" : "text-gray-800"
                  }`}
                >
                  실현 손익
                </h3>
                <DollarSign className="w-5 h-5 text-blue-500" />
              </div>
              <div className="space-y-4">
                <div
                  className={`p-4 rounded-lg ${
                    theme === "dark"
                      ? "bg-green-900/20 border border-green-500/30"
                      : "bg-green-50 border border-green-200"
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span
                      className={`text-sm font-medium ${
                        theme === "dark" ? "text-green-400" : "text-green-800"
                      }`}
                    >
                      총 수익
                    </span>
                    <span
                      className={`text-lg font-bold ${
                        theme === "dark" ? "text-green-400" : "text-green-600"
                      }`}
                    >
                      +₩3,780,000
                    </span>
                  </div>
                </div>
                <div
                  className={`p-4 rounded-lg ${
                    theme === "dark"
                      ? "bg-red-900/20 border border-red-500/30"
                      : "bg-red-50 border border-red-200"
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span
                      className={`text-sm font-medium ${
                        theme === "dark" ? "text-red-400" : "text-red-800"
                      }`}
                    >
                      총 손실
                    </span>
                    <span
                      className={`text-lg font-bold ${
                        theme === "dark" ? "text-red-400" : "text-red-600"
                      }`}
                    >
                      -₩580,000
                    </span>
                  </div>
                </div>
                <div
                  className={`p-4 rounded-lg ${
                    theme === "dark"
                      ? "bg-blue-900/20 border border-blue-500/30"
                      : "bg-blue-50 border border-blue-200"
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span
                      className={`text-sm font-medium ${
                        theme === "dark" ? "text-blue-400" : "text-blue-800"
                      }`}
                    >
                      순 손익
                    </span>
                    <span
                      className={`text-lg font-bold ${
                        theme === "dark" ? "text-blue-400" : "text-blue-600"
                      }`}
                    >
                      +₩3,200,000
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 전략별 누적 수익/손실/실패 원인 분석 */}
          <div
            className={`rounded-xl shadow-lg p-6 border mb-8 ${
              theme === "dark"
                ? "bg-gray-800 border-gray-700"
                : "bg-white border-gray-200"
            }`}
          >
            <div className="flex items-center justify-between mb-6">
              <h3
                className={`text-lg font-bold ${
                  theme === "dark" ? "text-white" : "text-gray-800"
                }`}
              >
                전략별 누적 수익 / 손실 / 실패 원인 분석
              </h3>
              <Target className="w-5 h-5 text-purple-500" />
            </div>

            <div className="space-y-6">
              {strategyAnalysis.map((strategy, index) => (
                <div
                  key={index}
                  className={`p-6 rounded-lg border ${
                    theme === "dark"
                      ? "bg-gray-700 border-gray-600"
                      : "bg-gray-50 border-gray-200"
                  }`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h4
                      className={`text-lg font-semibold ${
                        theme === "dark" ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {strategy.name}
                    </h4>
                    <Badge
                      className={`${
                        strategy.winRate >= 70
                          ? "bg-green-100 text-green-800"
                          : strategy.winRate >= 60
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      승률 {strategy.winRate}%
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div
                      className={`p-3 rounded ${
                        theme === "dark" ? "bg-green-900/30" : "bg-green-50"
                      }`}
                    >
                      <div
                        className={`text-xs ${
                          theme === "dark" ? "text-green-400" : "text-green-600"
                        } mb-1`}
                      >
                        누적 수익
                      </div>
                      <div className="text-green-600 font-bold">
                        +₩{formatCurrency(strategy.totalProfit)}
                      </div>
                    </div>
                    <div
                      className={`p-3 rounded ${
                        theme === "dark" ? "bg-red-900/30" : "bg-red-50"
                      }`}
                    >
                      <div
                        className={`text-xs ${
                          theme === "dark" ? "text-red-400" : "text-red-600"
                        } mb-1`}
                      >
                        누적 손실
                      </div>
                      <div className="text-red-600 font-bold">
                        ₩{formatCurrency(strategy.totalLoss)}
                      </div>
                    </div>
                    <div
                      className={`p-3 rounded ${
                        theme === "dark" ? "bg-blue-900/30" : "bg-blue-50"
                      }`}
                    >
                      <div
                        className={`text-xs ${
                          theme === "dark" ? "text-blue-400" : "text-blue-600"
                        } mb-1`}
                      >
                        순 손익
                      </div>
                      <div className="text-blue-600 font-bold">
                        +₩{formatCurrency(strategy.netProfit)}
                      </div>
                    </div>
                  </div>

                  <div>
                    <div
                      className={`text-sm font-medium mb-2 ${
                        theme === "dark" ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      주요 실패 원인
                    </div>
                    <div className="space-y-2">
                      {strategy.failures.map((failure, idx) => (
                        <div
                          key={idx}
                          className="flex justify-between items-center"
                        >
                          <span
                            className={`text-sm ${
                              theme === "dark"
                                ? "text-gray-400"
                                : "text-gray-600"
                            }`}
                          >
                            {failure.reason}
                          </span>
                          <Badge variant="outline" className={`text-sm ${
                              theme === "dark"
                                ? "text-gray-400"
                                : "text-gray-600"
                            }`}>
                            {failure.count}회
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 요약 구역 설명 */}
          <div
            className={`rounded-xl shadow-lg p-6 border ${
              theme === "dark"
                ? "bg-gray-800 border-gray-700"
                : "bg-white border-gray-200"
            }`}
          >
            <div className="flex items-center mb-4">
              <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
              <h3
                className={`text-lg font-bold ${
                  theme === "dark" ? "text-white" : "text-gray-800"
                }`}
              >
                요약
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4
                  className={`font-semibold mb-3 ${
                    theme === "dark" ? "text-white" : "text-gray-900"
                  }`}
                >
                  구역 설명
                </h4>
                <div className="space-y-2 text-sm">
                  <div
                    className={`${
                      theme === "dark" ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    • 전략 목록: 사용자 등록 전략 상태 + 실행 제어
                  </div>
                  <div
                    className={`${
                      theme === "dark" ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    • 전략 등록: 기본정보 + 조건 + 실행설정
                  </div>
                  <div
                    className={`${
                      theme === "dark" ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    • 수전 전략: 플래폼 프리셋 전략 목록 (복사 또는 구독)
                  </div>
                  <div
                    className={`${
                      theme === "dark" ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    • 성과 리포트: 전략별 손익 추이 및 실행 이력
                  </div>
                </div>
              </div>

              <div>
                <h4
                  className={`font-semibold mb-3 ${
                    theme === "dark" ? "text-white" : "text-gray-900"
                  }`}
                >
                  전체 성과 요약
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span
                      className={`text-sm ${
                        theme === "dark" ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      활성 전략 수
                    </span>
                    <span
                      className={`text-sm font-medium ${
                        theme === "dark" ? "text-white" : "text-gray-900"
                      }`}
                    >
                      5개
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span
                      className={`text-sm ${
                        theme === "dark" ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      평균 승률
                    </span>
                    <span className="text-sm font-medium text-green-600">
                      68.8%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span
                      className={`text-sm ${
                        theme === "dark" ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      총 거래 횟수
                    </span>
                    <span
                      className={`text-sm font-medium ${
                        theme === "dark" ? "text-white" : "text-gray-900"
                      }`}
                    >
                      142회
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span
                      className={`text-sm ${
                        theme === "dark" ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      최고 수익률
                    </span>
                    <span className="text-sm font-medium text-green-600">
                      +15.2%
                    </span>
                  </div>
                </div>
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

export default StrategyReport;
