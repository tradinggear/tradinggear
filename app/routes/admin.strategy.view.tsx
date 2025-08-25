"use client";

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

// eslint-disable-next-line import/no-unresolved
import { Button } from "@/components/ui/button";

import { useSidebarStore } from "@/stores/adminStore";
import Sidebar from "@/components/Admin/AdminSidebar";
import Header from "@/components/Admin/AdminHeader";
import { useNavigate } from "react-router-dom";

const StrategyDetail = () => {
  const { isSidebarOpen, isMobile, setIsMobile, closeSidebarOnMobile } =
    useSidebarStore();
  const navigate = useNavigate();
  const [strategyId, setStrategyId] = useState(null);
  const [strategyData, setStrategyData] = useState(null);

  // URL에서 전략 ID 가져오기
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get("id");
    if (id) {
      setStrategyId(parseInt(id));
      loadStrategyData(parseInt(id));
    }
  }, []);

  // 전략 데이터 로드 (실제로는 API 호출)
  const loadStrategyData = (id) => {
    // 샘플 전략 데이터 (실제로는 API에서 가져올 데이터)
    const allStrategiesData = {
      1001: {
        id: 1001,
        name: "전략 A",
        userId: "user123",
        type: "단타",
        period: "5분",
        createdAt: "2024-01-15 09:30:00",
        status: "활성",
        profitData: [
          { name: "1월", profit: 17 },
          { name: "2월", profit: 12 },
          { name: "3월", profit: 9 },
          { name: "4월", profit: 6 },
          { name: "5월", profit: 4 },
          { name: "6월", profit: 3 },
        ],
        userCountData: [
          { name: "1", count: 350 },
          { name: "2", count: 280 },
          { name: "3", count: 180 },
          { name: "4", count: 80 },
          { name: "5", count: 40 },
        ],
        entryData: [
          { name: "첫째", value: 200 },
          { name: "둘째", value: 230 },
          { name: "셋째", value: 220 },
          { name: "넷째", value: 240 },
          { name: "다섯째", value: 250 },
          { name: "여섯째", value: 260 },
        ],
        failureData: [
          { name: "시세반등", value: 55, color: "#3B82F6" },
          { name: "벽 전치", value: 25, color: "#06B6D4" },
          { name: "API 오류 등", value: 20, color: "#10B981" },
        ],
      },
      1002: {
        id: 1002,
        name: "전략 B",
        userId: "user123",
        type: "스윙",
        period: "1시간",
        createdAt: "2024-01-14 14:20:00",
        status: "활성",
        profitData: [
          { name: "1월", profit: 22 },
          { name: "2월", profit: 18 },
          { name: "3월", profit: 15 },
          { name: "4월", profit: 12 },
          { name: "5월", profit: 8 },
          { name: "6월", profit: 5 },
        ],
        userCountData: [
          { name: "1", count: 420 },
          { name: "2", count: 350 },
          { name: "3", count: 220 },
          { name: "4", count: 120 },
          { name: "5", count: 60 },
        ],
        entryData: [
          { name: "첫째", value: 180 },
          { name: "둘째", value: 200 },
          { name: "셋째", value: 195 },
          { name: "넷째", value: 210 },
          { name: "다섯째", value: 225 },
          { name: "여섯째", value: 240 },
        ],
        failureData: [
          { name: "시세반등", value: 45, color: "#3B82F6" },
          { name: "벽 전치", value: 35, color: "#06B6D4" },
          { name: "API 오류 등", value: 20, color: "#10B981" },
        ],
      },
      1003: {
        id: 1003,
        name: "전략 C",
        userId: "example",
        type: "스윙",
        period: "1일",
        createdAt: "2024-01-13 11:45:00",
        status: "비활성",
        profitData: [
          { name: "1월", profit: 8 },
          { name: "2월", profit: 6 },
          { name: "3월", profit: 4 },
          { name: "4월", profit: 2 },
          { name: "5월", profit: 1 },
          { name: "6월", profit: 0 },
        ],
        userCountData: [
          { name: "1", count: 150 },
          { name: "2", count: 120 },
          { name: "3", count: 80 },
          { name: "4", count: 40 },
          { name: "5", count: 20 },
        ],
        entryData: [
          { name: "첫째", value: 100 },
          { name: "둘째", value: 110 },
          { name: "셋째", value: 105 },
          { name: "넷째", value: 95 },
          { name: "다섯째", value: 90 },
          { name: "여섯째", value: 85 },
        ],
        failureData: [
          { name: "시세반등", value: 65, color: "#3B82F6" },
          { name: "벽 전치", value: 20, color: "#06B6D4" },
          { name: "API 오류 등", value: 15, color: "#10B981" },
        ],
      },
    };

    const data = allStrategiesData[id] || allStrategiesData[1001]; // 기본값
    setStrategyData(data);
  };

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

  // 샘플 슬리피지 데이터
  const slippageData = [
    { name: "1월", value: 0.3 },
    { name: "2월", value: 0.35 },
    { name: "3월", value: 0.32 },
    { name: "4월", value: 0.4 },
    { name: "5월", value: 0.45 },
    { name: "6월", value: 0.43 },
  ];

  const entrySlippageData = [
    { name: "1월", value: 0.48 },
    { name: "2월", value: 0.45 },
    { name: "3월", value: 0.5 },
    { name: "4월", value: 0.52 },
    { name: "5월", value: 0.48 },
    { name: "6월", value: 0.5 },
  ];

  const handleGoBack = () => {
    // 전략 목록으로 돌아가기
    navigate(-1);
  };

  // 데이터가 로드되지 않았으면 로딩 표시
  if (!strategyData) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">로딩 중...</div>
      </div>
    );
  }

  const getStatusBadge = (status) => {
    const styles = {
      활성: "bg-green-900/50 text-green-300 border-green-500",
      비활성: "bg-yellow-900/50 text-yellow-300 border-yellow-500",
      종료대기: "bg-orange-900/50 text-orange-300 border-orange-500",
      종료됨: "bg-red-900/50 text-red-300 border-red-500",
    };

    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-medium border ${
          styles[status] || "bg-gray-700 text-gray-300 border-gray-600"
        }`}
      >
        {status}
      </span>
    );
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
        <Header title="전략상세" />

        {/* 메인 콘텐츠 영역 */}
        <main className="p-6">
          {/* 페이지 헤더 */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <Button
                onClick={handleGoBack}
                className="mr-4 p-2 rounded-lg bg-gray-700 text-gray-300 hover:bg-gray-600 transition-colors duration-200"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">
                  전략 상세보기
                </h2>
                <p className="text-gray-400">
                  전략 ID: {strategyData.id} | {strategyData.name}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {getStatusBadge(strategyData.status)}
              <div className="text-right">
                <p className="text-sm text-gray-400">마지막 업데이트</p>
                <p className="text-white font-medium">
                  {strategyData.createdAt}
                </p>
              </div>
            </div>
          </div>

          {/* 전략 정보 카드 */}
          <div className="bg-gray-800 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-white mb-4">
              전략 기본 정보
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-gray-700 rounded-lg p-4">
                <div className="flex items-center">
                  <Activity className="w-8 h-8 text-blue-400 mr-3" />
                  <div>
                    <p className="text-gray-400 text-sm">전략명</p>
                    <p className="text-white font-medium">
                      {strategyData.name}
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-gray-700 rounded-lg p-4">
                <div className="flex items-center">
                  <Users className="w-8 h-8 text-green-400 mr-3" />
                  <div>
                    <p className="text-gray-400 text-sm">사용자 ID</p>
                    <p className="text-white font-medium">
                      {strategyData.userId}
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-gray-700 rounded-lg p-4">
                <div className="flex items-center">
                  <BarChart3 className="w-8 h-8 text-purple-400 mr-3" />
                  <div>
                    <p className="text-gray-400 text-sm">전략 유형</p>
                    <p className="text-white font-medium">
                      {strategyData.type}
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-gray-700 rounded-lg p-4">
                <div className="flex items-center">
                  <Calendar className="w-8 h-8 text-orange-400 mr-3" />
                  <div>
                    <p className="text-gray-400 text-sm">기간</p>
                    <p className="text-white font-medium">
                      {strategyData.period}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 차트 그리드 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* 전략별 수익률 */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">
                전략별 수익률
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={strategyData.profitData}>
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
              <h3 className="text-lg font-semibold text-white mb-4">
                사용자 수
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={strategyData.userCountData}>
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
              <h3 className="text-lg font-semibold text-white mb-4">
                진입 횟수
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={strategyData.entryData}>
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
              <h3 className="text-lg font-semibold text-white mb-4">실패율</h3>
              <div className="flex items-center justify-center">
                <div className="relative w-64 h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        dataKey="value"
                        data={strategyData.failureData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={2}
                      >
                        {strategyData.failureData.map((entry, index) => (
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
                        {strategyData.failureData[0].value}%
                      </p>
                      <p className="text-gray-400 text-sm">전체</p>
                    </div>
                  </div>
                </div>
                <div className="ml-8">
                  {strategyData.failureData.map((item, index) => (
                    <div key={index} className="flex items-center mb-2">
                      <div
                        className="w-3 h-3 rounded-full mr-2"
                        style={{ backgroundColor: item.color }}
                      ></div>
                      <span className="text-gray-300 text-sm">{item.name}</span>
                      <span className="text-white font-medium ml-2">
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
            {/* 전략별 슬리피지 */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">
                전략별 슬리피지 체결가
              </h3>
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

            {/* 진입별 슬리피지 */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">
                전략별 슬리피지 시그널가
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={entrySlippageData}>
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
        </main>
      </div>
    </div>
  );
};

export default StrategyDetail;
