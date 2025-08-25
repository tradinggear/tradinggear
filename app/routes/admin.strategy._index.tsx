"use client";

import React, { useState, useEffect } from "react";
import {
  Search,
  Edit,
  Trash2,
  ChevronDown,
  ChevronUp,
  ArrowUpDown,
  Eye,
} from "lucide-react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
  // eslint-disable-next-line import/no-unresolved
} from "@/components/ui/select";
// eslint-disable-next-line import/no-unresolved
import { Input } from "@/components/ui/input";
// eslint-disable-next-line import/no-unresolved
import { Button } from "@/components/ui/button";
// eslint-disable-next-line import/no-unresolved
import { Label } from "@/components/ui/label";

import { useSidebarStore } from "@/stores/adminStore";
import Sidebar from "@/components/Admin/AdminSidebar";
import Header from "@/components/Admin/AdminHeader";
import { useNavigate } from "react-router-dom";

const StrategyList = () => {
  const { isSidebarOpen, isMobile, setIsMobile, closeSidebarOnMobile } =
    useSidebarStore();
  const [searchType, setSearchType] = useState("전략명");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });
  const navigate = useNavigate();

  


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

  const searchOptions = ["전략명", "사용자ID", "전략유형", "상태"];

  // 모바일에서 오버레이 클릭 시 사이드바 닫기
  const handleOverlayClick = () => {
    closeSidebarOnMobile();
  };

  // 샘플 전략 데이터
  const [strategiesData] = useState([
    {
      id: 1001,
      strategyName: "전략 A",
      userId: "user123",
      strategyType: "단타",
      period: "5분",
      interval: "5분",
      status: "활성",
      detail: "보기",
    },
    {
      id: 1002,
      strategyName: "전략 B",
      userId: "user123",
      strategyType: "스윙",
      period: "1시간",
      interval: "1시간",
      status: "활성",
      detail: "보기",
    },
    {
      id: 1003,
      strategyName: "전략 C",
      userId: "example",
      strategyType: "스윙",
      period: "1일",
      interval: "일봉",
      status: "비활성",
      detail: "보기",
    },
    {
      id: 1004,
      strategyName: "전략 A",
      userId: "email@email",
      strategyType: "SOLUSDT",
      period: "1시간",
      interval: "1-21일",
      status: "활성",
      detail: "보기",
    },
    {
      id: 1005,
      strategyName: "전략 B",
      userId: "user152",
      strategyType: "삼성전자",
      period: "1일봉",
      interval: "1일봉",
      status: "활성",
      detail: "보기",
    },
    {
      id: 1006,
      strategyName: "전략 C",
      userId: "email.com",
      strategyType: "삼성전자",
      period: "1시간",
      interval: "21-45",
      status: "비활성",
      detail: "보기",
    },
    {
      id: 1007,
      strategyName: "전략 D",
      userId: "user123",
      strategyType: "5분",
      period: "1일봉",
      interval: "5-3개",
      status: "비활성",
      detail: "보기",
    },
    {
      id: 1008,
      strategyName: "전략 E",
      userId: "example",
      strategyType: "일봉",
      period: "월캔들",
      interval: "15/25",
      status: "종료대기",
      detail: "보기",
    },
    {
      id: 1009,
      strategyName: "삼성 A",
      userId: "SOLUSDT",
      strategyType: "일봉",
      period: "월캔들",
      interval: "1-1월일",
      status: "종료됨",
      detail: "보기",
    },
    {
      id: 1010,
      strategyName: "삼성 B",
      userId: "user123",
      strategyType: "월봉",
      period: "월캔들",
      interval: "일봉",
      status: "종료됨",
      detail: "보기",
    },
    {
      id: 1011,
      strategyName: "삼성 C",
      userId: "email.com",
      strategyType: "종일외과",
      period: "월캔들",
      interval: "39/65",
      status: "종료됨",
      detail: "단독",
    },
    {
      id: 1012,
      strategyName: "삼성 D",
      userId: "user123",
      strategyType: "물건일",
      period: "월캔들",
      interval: "2월물",
      status: "종료됨",
      detail: "0",
    },
  ]);

  // 검색 기능
  const filteredStrategies = strategiesData.filter((strategy) => {
    if (!searchTerm) return true;

    switch (searchType) {
      case "전략명":
        return strategy.strategyName
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
      case "사용자ID":
        return strategy.userId.toLowerCase().includes(searchTerm.toLowerCase());
      case "전략유형":
        return strategy.strategyType
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
      case "상태":
        return strategy.status.includes(searchTerm);
      default:
        return true;
    }
  });

  // 정렬 기능
  const sortedStrategies = React.useMemo(() => {
    const sortableStrategies = [...filteredStrategies];
    if (sortConfig.key !== null) {
      sortableStrategies.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableStrategies;
  }, [filteredStrategies, sortConfig]);

  const requestSort = (key: string) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (columnName: string) => {
    if (sortConfig.key !== columnName) {
      return <ArrowUpDown className="w-4 h-4 ml-1 opacity-50" />;
    }
    return sortConfig.direction === "ascending" ? (
      <ChevronUp className="w-4 h-4 ml-1" />
    ) : (
      <ChevronDown className="w-4 h-4 ml-1" />
    );
  };

  const getStatusBadge = (status: string) => {
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

  // 상세보기 핸들러
  const handleViewDetail = (strategyId: number) => {
    // TODO: 상세페이지로 라우팅
    navigate(`/admin/strategy/view?id=${strategyId}`);
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
        <Header title="전략목록" />

        {/* 메인 콘텐츠 영역 */}
        <main className="p-6">
          {/* 페이지 헤더 */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">전략 관리</h2>
              <p className="text-gray-400">
                총 {strategiesData.length}개의 전략이 있습니다.
              </p>
            </div>
          </div>

          {/* 검색 영역 */}
          <div className="bg-gray-800 border-gray-700 rounded-lg p-4 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="md:w-2/12 w-full">
                <Label className="block text-sm font-medium text-gray-300 mb-2">
                  검색 항목
                </Label>
                <Select value={searchType} onValueChange={setSearchType}>
                  <SelectTrigger className="w-full h-10 px-3 py-2 bg-gray-700 border-gray-600 text-white placeholder-gray-400 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <SelectValue placeholder="검색 항목" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {searchOptions.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div className="md:w-10/12 w-full">
                <Label className="block text-sm font-medium text-gray-300 mb-2">
                  검색어
                </Label>
                <div className="relative">
                  <Input
                    type="text"
                    placeholder="검색어"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-1 h-10 px-3 py-2 bg-gray-700 border-gray-600 text-white placeholder-gray-400 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <Search className="w-4 h-4 absolute right-4 top-1/2 transform -translate-y-1/2 text-white" />
                </div>
              </div>
            </div>
          </div>

          {/* 전략 테이블 */}
          <div className="bg-gray-800 border-gray-700 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-700 bg-gray-750">
                    <th
                      className="text-left py-4 px-6 font-semibold text-gray-300 cursor-pointer hover:bg-opacity-80 transition-colors"
                      onClick={() => requestSort("id")}
                    >
                      <div className="flex items-center">
                        전략 ID
                        {getSortIcon("id")}
                      </div>
                    </th>
                    <th
                      className="text-left py-4 px-6 font-semibold text-center text-gray-300 cursor-pointer hover:bg-opacity-80 transition-colors"
                      onClick={() => requestSort("strategyName")}
                    >
                      <div className="flex items-center justify-center">
                        전략명
                        {getSortIcon("strategyName")}
                      </div>
                    </th>
                    <th
                      className="text-left py-4 px-6 font-semibold text-center text-gray-300 cursor-pointer hover:bg-opacity-80 transition-colors"
                      onClick={() => requestSort("userId")}
                    >
                      <div className="flex items-center justify-center">
                        사용자 ID
                        {getSortIcon("userId")}
                      </div>
                    </th>
                    <th
                      className="text-left py-4 px-6 font-semibold text-center text-gray-300 cursor-pointer hover:bg-opacity-80 transition-colors"
                      onClick={() => requestSort("strategyType")}
                    >
                      <div className="flex items-center justify-center">
                        전략 유형
                        {getSortIcon("strategyType")}
                      </div>
                    </th>
                    <th
                      className="text-left py-4 px-6 font-semibold text-center text-gray-300 cursor-pointer hover:bg-opacity-80 transition-colors"
                      onClick={() => requestSort("period")}
                    >
                      <div className="flex items-center justify-center">
                        기간
                        {getSortIcon("period")}
                      </div>
                    </th>
                    <th
                      className="text-left py-4 px-6 font-semibold text-center text-gray-300 cursor-pointer hover:bg-opacity-80 transition-colors"
                      onClick={() => requestSort("interval")}
                    >
                      <div className="flex items-center justify-center">
                        시간별
                        {getSortIcon("interval")}
                      </div>
                    </th>
                    <th
                      className="text-left py-4 px-6 font-semibold text-center text-gray-300 cursor-pointer hover:bg-opacity-80 transition-colors"
                      onClick={() => requestSort("status")}
                    >
                      <div className="flex items-center justify-center">
                        상태별
                        {getSortIcon("status")}
                      </div>
                    </th>
                    <th className="text-left py-4 px-6 font-semibold text-center justify-center text-gray-300">
                      상세
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {sortedStrategies.map((strategy, index) => (
                    <tr
                      key={strategy.id}
                      className="border-b border-gray-700 hover:bg-gray-600 transition-colors duration-200 cursor-pointer"
                      onClick={() => handleViewDetail(strategy.id)}
                    >
                      <td className="py-4 px-6 text-gray-300">{strategy.id}</td>
                      <td className="py-4 px-6 text-center text-white font-medium">
                        {strategy.strategyName}
                      </td>
                      <td className="py-4 px-6 text-center text-gray-300">
                        {strategy.userId}
                      </td>
                      <td className="py-4 px-6 text-center text-gray-300">
                        {strategy.strategyType}
                      </td>
                      <td className="py-4 px-6 text-center text-gray-300">
                        {strategy.period}
                      </td>
                      <td className="py-4 px-6 text-center text-gray-300">
                        {strategy.interval}
                      </td>
                      <td className="py-4 px-6 text-center">
                        {getStatusBadge(strategy.status)}
                      </td>
                      <td className="py-4 px-6">
                        <div
                          className="flex items-center justify-center space-x-2"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button className="p-2 rounded-lg transition-colors duration-200 text-green-400 hover:bg-green-900/20">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button className="p-2 rounded-lg transition-colors duration-200 text-red-400 hover:bg-red-900/20">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* 페이지네이션 */}
          <div className="flex items-center justify-between mt-6">
            <div className="text-sm text-gray-400">
              총 {sortedStrategies.length}개 중 1-{sortedStrategies.length}개
              표시
            </div>
            <div className="flex items-center space-x-2">
              <a
                href="/admin/strategy/write"
                className="px-3 py-2 bg-gray-700 text-gray-300 hover:bg-gray-600 rounded-lg transition-colors duration-200 disabled:opacity-50"
              >
                전략 등록
              </a>
              <button
                className="px-3 py-2 bg-gray-700 text-gray-300 hover:bg-gray-600 rounded-lg transition-colors duration-200 disabled:opacity-50"
                disabled
              >
                이전
              </button>
              <button className="px-3 py-2 text-white bg-blue-600 rounded-lg">
                1
              </button>
              <button
                className="px-3 py-2 bg-gray-700 text-gray-300 hover:bg-gray-600 rounded-lg transition-colors duration-200 disabled:opacity-50"
                disabled
              >
                다음
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default StrategyList;
