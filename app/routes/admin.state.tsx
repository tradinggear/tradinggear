import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  Users,
  DollarSign,
  Calendar,
  Activity,
  BarChart3,
  PieChart,
  Filter,
  Download
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart as RechartsPieChart,
  Cell,
  Pie,
} from "recharts";

import { useSidebarStore } from "@/stores/adminStore";
import Sidebar from "@/components/Admin/AdminSidebar";
import Header from "@/components/Admin/AdminHeader";
import { useNavigate } from "react-router-dom";

const StrategyStatistics = () => {
  const { isSidebarOpen, isMobile, setIsMobile, closeSidebarOnMobile } =
    useSidebarStore();
  const navigate = useNavigate();
  const [selectedPeriod, setSelectedPeriod] = useState("6개월");
  const [selectedStrategy, setSelectedStrategy] = useState("전체");

  // 화면 크기 감지
    useEffect(() => {
      const checkScreenSize = () => {
        const mobile = window.innerWidth < 768;
        setIsMobile(mobile);
      };
  
      checkScreenSize();
      window.addEventListener("resize", checkScreenSize);
      return () => window.removeEventListener("resize", checkScreenSize);
    }, [setIsMobile]);
  
    // 모바일에서 오버레이 클릭 시 사이드바 닫기
    const handleOverlayClick = () => {
      closeSidebarOnMobile();
    };

  // 전략별 수익률 데이터
  const profitData = [
    { name: "1월", profit: 17 },
    { name: "2월", profit: 12 },
    { name: "3월", profit: 9 },
    { name: "4월", profit: 6 },
    { name: "5월", profit: 4 },
    { name: "6월", profit: 3 },
  ];

  // 사용자 수 데이터
  const userCountData = [
    { name: "1", count: 350 },
    { name: "2", count: 250 },
    { name: "3", count: 180 },
    { name: "4", count: 100 },
    { name: "5", count: 50 },
  ];

  // 진입 횟수 데이터
  const entryData = [
    { name: "첫째", value: 200 },
    { name: "둘째", value: 250 },
    { name: "셋째", value: 220 },
    { name: "넷째", value: 240 },
    { name: "다섯째", value: 250 },
    { name: "여섯째", value: 260 },
  ];

  // 실패율 데이터
  const failureData = [
    { name: "시세반등", value: 55, color: "#3B82F6" },
    { name: "벽 전치", value: 25, color: "#06B6D4" },
    { name: "API 오류 등", value: 20, color: "#10B981" },
  ];

  // 전략별 슬리피지 체결가 데이터
  const slippageData = [
    { name: "1월", value: 0.3 },
    { name: "2월", value: 0.35 },
    { name: "3월", value: 0.32 },
    { name: "4월", value: 0.4 },
    { name: "5월", value: 0.45 },
    { name: "6월", value: 0.43 },
  ];

  // 전략별 슬리피지 시그널가 데이터
  const signalSlippageData = [
    { name: "1월", value: 0.48 },
    { name: "2월", value: 0.45 },
    { name: "3월", value: 0.5 },
    { name: "4월", value: 0.52 },
    { name: "5월", value: 0.48 },
    { name: "6월", value: 0.5 },
  ];

  // 요약 카드 데이터
  const summaryCards = [
    {
      title: "전략 개수",
      value: "24",
      change: "+3",
      changeType: "increase",
      icon: Activity,
      color: "blue"
    },
    {
      title: "사용 중 전략",
      value: "18",
      change: "+2",
      changeType: "increase", 
      icon: TrendingUp,
      color: "green"
    },
    {
      title: "승인 대기",
      value: "6",
      change: "0",
      changeType: "neutral",
      icon: Calendar,
      color: "yellow"
    },
    {
      title: "실패율",
      value: "8.5%",
      change: "-1.2%",
      changeType: "increase",
      icon: DollarSign,
      color: "purple"
    }
  ];

  const getCardColors = (color) => {
    const colors = {
      blue: "bg-blue-500/20 text-blue-300 border-blue-500/30",
      green: "bg-green-500/20 text-green-300 border-green-500/30",
      yellow: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
      purple: "bg-purple-500/20 text-purple-300 border-purple-500/30"
    };
    return colors[color] || colors.blue;
  };

  const getChangeColor = (changeType) => {
    const colors = {
      increase: "text-green-400",
      decrease: "text-red-400", 
      neutral: "text-gray-400"
    };
    return colors[changeType];
  };

  return (
    <div className="min-h-screen bg-gray-900">
      {/* 모바일 오버레이 */}
      {isMobile && isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-60 z-40"
          onClick={handleOverlayClick}
        />
      )}

      {/* 사이드바 */}
      <Sidebar />
      {/* 메인 콘텐츠 */}
            <div
              className={`
              transition-all duration-300 ease-in-out
              ${!isMobile && isSidebarOpen ? "ml-64" : "ml-0"}
            `}
            >
              {/* 헤더 */}
              <Header title="전략 통계" />
      {/* 헤더 */}
      <div className="bg-gray-800 border-b border-gray-700">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-white">전략 통계</h1>
              <div className="text-sm text-gray-400">
                전략 성능 모니터링 (통계 대시보드)
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <select 
                value={selectedStrategy}
                onChange={(e) => setSelectedStrategy(e.target.value)}
                className="bg-gray-700 text-white border border-gray-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
              >
                <option value="전체">전체 전략</option>
                <option value="단타">단타 전략</option>
                <option value="스윙">스윙 전략</option>
              </select>
              <select 
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="bg-gray-700 text-white border border-gray-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
              >
                <option value="1개월">1개월</option>
                <option value="3개월">3개월</option>
                <option value="6개월">6개월</option>
                <option value="1년">1년</option>
              </select>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition-colors flex items-center space-x-2">
                <Download className="w-4 h-4" />
                <span>내보내기</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 메인 콘텐츠 */}
      <main className="p-6">
        {/* 요약 카드들 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {summaryCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <div key={index} className={`bg-gray-800 rounded-lg p-6 border ${getCardColors(card.color)}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm mb-2">{card.title}</p>
                    <p className="text-2xl font-bold text-white mb-1">{card.value}</p>
                    <p className={`text-sm ${getChangeColor(card.changeType)}`}>
                      {card.change} (전월 대비)
                    </p>
                  </div>
                  <div className="p-3 rounded-full bg-gray-700">
                    <Icon className="w-6 h-6 text-gray-300" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* 차트 그리드 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* 전략별 수익률 */}
          <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">전략별 수익률</h3>
              <div className="text-sm text-gray-400">단위: %</div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={profitData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1F2937",
                    border: "1px solid #374151",
                    borderRadius: "8px",
                    color: "#fff",
                  }}
                />
                <Bar dataKey="profit" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* 사용자 수 */}
          <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">사용자 수</h3>
              <div className="text-sm text-gray-400">전략별 사용자 분포</div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={userCountData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1F2937",
                    border: "1px solid #374151",
                    borderRadius: "8px",
                    color: "#fff",
                  }}
                />
                <Bar dataKey="count" fill="#06B6D4" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* 진입 횟수 */}
          <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">진입 횟수</h3>
              <div className="text-sm text-gray-400">주간별 진입 통계</div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={entryData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1F2937",
                    border: "1px solid #374151",
                    borderRadius: "8px",
                    color: "#fff",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#10B981"
                  strokeWidth={3}
                  dot={{ fill: "#10B981", strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* 실패율 */}
          <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">실패율</h3>
              <div className="text-sm text-gray-400">실패 원인별 분석</div>
            </div>
            <div className="flex items-center justify-center">
              <div className="relative w-64 h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
                    <Pie
                      dataKey="value"
                      data={failureData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={2}
                    >
                      {failureData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1F2937",
                        border: "1px solid #374151",
                        borderRadius: "8px",
                        color: "#fff",
                      }}
                    />
                  </RechartsPieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-white">
                      {failureData[0].value}%
                    </p>
                    <p className="text-gray-400 text-sm">전체</p>
                  </div>
                </div>
              </div>
              <div className="ml-8">
                {failureData.map((item, index) => (
                  <div key={index} className="flex items-center mb-3">
                    <div
                      className="w-3 h-3 rounded-full mr-3"
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <span className="text-gray-300 text-sm mr-2">{item.name}</span>
                    <span className="text-white font-medium">
                      {item.value}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 슬리피지 차트들 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 전략별 슬리피지 체결가 */}
          <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">전략별 슬리피지</h3>
              <div className="text-sm text-gray-400">체결가 기준</div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={slippageData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1F2937",
                    border: "1px solid #374151",
                    borderRadius: "8px",
                    color: "#fff",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#F59E0B"
                  strokeWidth={3}
                  dot={{ fill: "#F59E0B", strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* 전략별 슬리피지 시그널가 */}
          <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">전략별 슬리피지</h3>
              <div className="text-sm text-gray-400">시그널가 기준</div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={signalSlippageData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1F2937",
                    border: "1px solid #374151",
                    borderRadius: "8px",
                    color: "#fff",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#EF4444"
                  strokeWidth={3}
                  dot={{ fill: "#EF4444", strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 하단 정보 */}
        <div className="mt-8 bg-gray-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4">통계 요약 정보</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h4 className="text-md font-medium text-gray-300 mb-3">주요 지표</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>• 전략별 수익률/전략 평균/최대/최소 수익률</li>
                <li>• 사용자 수와 전략 연결 개수</li>
                <li>• 진입 횟수하루/주간/월간 진입 통계</li>
                <li>• 실패율 실패 이유별 분류 (시세반등, 벽 걸치, API 오류 등)</li>
              </ul>
            </div>
            <div>
              <h4 className="text-md font-medium text-gray-300 mb-3">슬리피지 분석</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>• 전략별 슬리피지 평균 체결가 - 시그널가 오차율 분석</li>
                <li>• 시장 상황별 슬리피지 변동 추이 모니터링</li>
                <li>• 거래량과 슬리피지 상관관계 분석</li>
                <li>• 실시간 슬리피지 모니터링 및 알림 시스템</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
    </div>
  );
};

export default StrategyStatistics;