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
  Plus,
  Save,
  List,
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
// eslint-disable-next-line import/no-unresolved
import { Switch } from "@/components/ui/switch";

import { useSidebarStore } from "@/stores/adminStore";
import Sidebar from "@/components/Admin/AdminSidebar";
import Header from "@/components/Admin/AdminHeader";
import { useNavigate } from "react-router-dom";
import { platform } from "node:os";

const StrategyRegister = () => {
  const { isSidebarOpen, isMobile, setIsMobile, closeSidebarOnMobile } =
    useSidebarStore();
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

  // 전략 등록 폼 상태
  const [formData, setFormData] = useState({
    strategyName: "",
    description: "",
    tradingSymbol: "",
    strategyType: "",
    timeFrame: "",
    candleType: "",
    isActive: true,
    buySignal: "",
    apiKey: "",
    executionTime: "",
    executionTime1: "",
    executionTime2: "",    
    maxTrades: "",
    profitAlert: false,
    platformSet: "",
  });

  // 등록된 전략 리스트 상태
  const [strategies, setStrategies] = useState([
    {
      id: 1001,
      strategyName: "추세추종전략",
      description: "이동평균선을 이용한 추세추종 전략",
      tradingSymbol: "삼성전자",
      strategyType: "단타",
      timeFrame: "1분",
      candleType: "활성",
      status: "활성",
      createdAt: "2024-01-15",
      platformSet: "바이낸스",
    },
    {
      id: 1002,
      strategyName: "볼린저밴드전략",
      description: "볼린저밴드 돌파 전략",
      tradingSymbol: "SOLUSDT",
      strategyType: "스윙",
      timeFrame: "5분",
      candleType: "활성",
      status: "비활성",
      createdAt: "2024-01-14",
      platformSet: "바이낸스",
    },
  ]);

  // 검색 및 정렬 상태
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });

  // 모바일에서 오버레이 클릭 시 사이드바 닫기
  const handleOverlayClick = () => {
    closeSidebarOnMobile();
  };

  // 폼 입력 핸들러
  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // 전략 등록 핸들러
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newStrategy = {
      id: Date.now(),
      strategyName: formData.strategyName,
      description: formData.description,
      tradingSymbol: formData.tradingSymbol,
      strategyType: formData.strategyType,
      timeFrame: formData.timeFrame,
      candleType: formData.candleType,
      status: formData.isActive ? "활성" : "비활성",
      createdAt: new Date().toISOString().split('T')[0],
    };

    setStrategies(prev => [newStrategy, ...prev]);
    
    // 폼 초기화
    setFormData({
      strategyName: "",
      description: "",
      tradingSymbol: "",
      strategyType: "",
      timeFrame: "",
      candleType: "",
      isActive: true,
      buySignal: "",
      apiKey: "",
      executionTime: "",
      executionTime1: "",
      executionTime2: "",       
      maxTrades: "",
      profitAlert: false,
      platformSet: ""      
    });

    alert("전략이 성공적으로 등록되었습니다!");
  };

  // 검색 기능
  const filteredStrategies = strategies.filter((strategy) => {
    if (!searchTerm) return true;
    return (
      strategy.strategyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      strategy.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      strategy.tradingSymbol.toLowerCase().includes(searchTerm.toLowerCase())
    );
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
        <Header title="전략등록" />

        {/* 메인 콘텐츠 영역 */}
        <main className="p-6">
          {/* 페이지 헤더 */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">전략 등록</h2>
              <p className="text-gray-400">
                새로운 트레이딩 전략을 등록하고 관리하세요.
              </p>
            </div>
          </div>

          {/* 전략 등록 폼 */}
          <div className="bg-gray-800 border-gray-700 rounded-lg p-6 mb-8">
            <h3 className="text-xl font-bold text-white mb-6">관리자 등록페이지</h3>
            
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* 1. 전략정보 */}
              <div>
                <h4 className="text-lg font-semibold text-white mb-4">1. 전략정보</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label className="block text-sm font-medium text-gray-300 mb-2">
                      전략이름
                    </Label>
                    <Input
                      type="text"
                      placeholder="추세추종"
                      value={formData.strategyName}
                      onChange={(e) => handleInputChange('strategyName', e.target.value)}
                      className="w-full h-10 px-3 py-2 bg-gray-700 border-gray-600 text-white placeholder-gray-400 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <Label className="block text-sm font-medium text-gray-300 mb-2">
                      전략설명
                    </Label>
                    <Input
                      type="text"
                      placeholder="전략개요"
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      className="w-full h-10 px-3 py-2 bg-gray-700 border-gray-600 text-white placeholder-gray-400 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <Label className="block text-sm font-medium text-gray-300 mb-2">
                      거래종목
                    </Label>
                    <Input
                      type="text"
                      placeholder="삼성전자"
                      value={formData.tradingSymbol}
                      onChange={(e) => handleInputChange('tradingSymbol', e.target.value)}
                      className="w-full h-10 px-3 py-2 bg-gray-700 border-gray-600 text-white placeholder-gray-400 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="block text-sm font-medium text-gray-300 mb-2">
                        전략유형
                      </Label>
                      <Select value={formData.strategyType} onValueChange={(value) => handleInputChange('strategyType', value)}>
                        <SelectTrigger className="w-full h-10 px-3 py-2 bg-gray-700 border-gray-600 text-white placeholder-gray-400 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                          <SelectValue placeholder="단타" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectItem value="단타">단타</SelectItem>
                            <SelectItem value="스윙">스윙</SelectItem>
                            <SelectItem value="장기">장기</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="block text-sm font-medium text-gray-300 mb-2">
                        시간간격
                      </Label>                  
                      <Select value={formData.timeFrame} onValueChange={(value) => handleInputChange('timeFrame', value)}>
                        <SelectTrigger className="w-full h-10 px-3 py-2 bg-gray-700 border-gray-600 text-white placeholder-gray-400 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                          <SelectValue placeholder="1분/5분/1시간" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectItem value="1분">1분</SelectItem>
                            <SelectItem value="5분">5분</SelectItem>
                            <SelectItem value="15분">15분</SelectItem>
                            <SelectItem value="30분">30분</SelectItem>
                            <SelectItem value="1시간">1시간</SelectItem>
                            <SelectItem value="4시간">4시간</SelectItem>
                            <SelectItem value="1일">1일</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="block text-sm font-medium text-gray-300 mb-2">
                        타임프레임
                      </Label>
                      <Select value={formData.candleType} onValueChange={(value) => handleInputChange('candleType', value)}>
                        <SelectTrigger className="w-full h-10 px-3 py-2 bg-gray-700 border-gray-600 text-white placeholder-gray-400 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                          <SelectValue placeholder="1분" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectItem value="1분">1분</SelectItem>
                            <SelectItem value="5분">5분</SelectItem>
                            <SelectItem value="15분">15분</SelectItem>
                            <SelectItem value="30분">30분</SelectItem>
                            <SelectItem value="1시간">1시간</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="block text-sm font-medium text-gray-300 mb-2">
                        활성상태
                      </Label>
                      <Select value={formData.isActive ? "활성" : "비활성"} onValueChange={(value) => handleInputChange('isActive', value === "활성")}>
                        <SelectTrigger className="w-full h-10 px-3 py-2 bg-gray-700 border-gray-600 text-white placeholder-gray-400 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                          <SelectValue placeholder="활성" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectItem value="활성">활성</SelectItem>
                            <SelectItem value="비활성">비활성</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>

              {/* 2. 전략실행설정 */}
              <div>
                <h4 className="text-lg font-semibold text-white mb-4">2. 전략실행설정</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label className="block text-sm font-medium text-gray-300 mb-2">
                      매매플래폼
                    </Label>
                    <Select value={formData.platformSet} onValueChange={(value) => handleInputChange('platformSet', value)}>
                      <SelectTrigger className="w-full h-10 px-3 py-2 bg-gray-700 border-gray-600 text-white placeholder-gray-400 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                        <SelectValue placeholder="바이낸스" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="binance">바이낸스</SelectItem>
                          <SelectItem value="kium">키움증권</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>                    
                    {/*
                    <Input
                      type="text"
                      placeholder="키움증권"
                      value={formData.buySignal}
                      onChange={(e) => handleInputChange('buySignal', e.target.value)}
                      className="w-full h-10 px-3 py-2 bg-gray-700 border-gray-600 text-white placeholder-gray-400 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    */}
                  </div>
                  <div>
                    <Label className="block text-sm font-medium text-gray-300 mb-2">
                      API 키 등록 여부
                    </Label>
                    <Label className="block text-sm font-medium text-gray-300 mb-2" style={{marginTop:'15px'}}>
                    연결된 계정
                    </Label>
                    {/*
                    <Input
                      type="text"
                      placeholder="연결된 계정"
                      value={formData.apiKey}
                      onChange={(e) => handleInputChange('apiKey', e.target.value)}
                      className="w-full h-10 px-3 py-2 bg-gray-700 border-gray-600 text-white placeholder-gray-400 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    */}
                  </div>
                  <div>
                    <Label className="block text-sm font-medium text-gray-300 mb-2">
                      전략실행시간대 제한
                    </Label>
                    <div className="flex items-center space-x-2">
                      <Select
                        value={formData.executionTime1}
                        onValueChange={(value) => handleInputChange('executionTime1', value)}
                      >
                        <SelectTrigger className="w-32 h-10 px-3 py-2 bg-gray-700 border-gray-600 text-white placeholder-gray-400 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                          <SelectValue placeholder="9시" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {Array.from({ length: 24 }, (_, i) => (
                              <SelectItem key={i + 1} value={(i + 1).toString()}>
                                {i + 1}시
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>

                      <Label className="text-sm font-medium text-gray-300">~</Label>

                      <Select
                        value={formData.executionTime2}
                        onValueChange={(value) => handleInputChange('executionTime2', value)}
                      >
                        <SelectTrigger className="w-32 h-10 px-3 py-2 bg-gray-700 border-gray-600 text-white placeholder-gray-400 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                          <SelectValue placeholder="12시" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {Array.from({ length: 24 }, (_, i) => (
                              <SelectItem key={i + 1} value={(i + 1).toString()}>
                                {i + 1}시
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>                  

                  </div>
                    {/*
                    <Input
                      type="text"
                      placeholder="예: 9시 - 15시"
                      value={formData.executionTime}
                      onChange={(e) => handleInputChange('executionTime', e.target.value)}
                      className="w-full h-10 px-3 py-2 bg-gray-700 border-gray-600 text-white placeholder-gray-400 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    */}                  
                  <div>
                    <Label className="block text-sm font-medium text-gray-300 mb-2">
                      1일 최대 진입 횟수
                    </Label>
                    <Input
                      type="number"
                      placeholder=""
                      value={formData.maxTrades}
                      onChange={(e) => handleInputChange('maxTrades', e.target.value)}
                      className="w-full h-10 px-3 py-2 bg-gray-700 border-gray-600 text-white placeholder-gray-400 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-sm font-medium text-gray-300">
                          알림 수신 여부
                        </Label>
                        <p className="text-sm text-gray-400">진입, 청산시</p>
                      </div>
                      <Switch
                        checked={formData.profitAlert}
                        onCheckedChange={(checked) => handleInputChange('profitAlert', checked)}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* 등록 버튼 */}
              <div className="flex justify-center gap-2">
              <Button
                  type="button" onClick={() => navigate('/admin/strategy')}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
                >
                  <List className="w-4 h-4 mr-2" />
                  목록
                </Button>
                <Button
                  type="submit"
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
                >
                  <Save className="w-4 h-4 mr-2" />
                  전략 등록
                </Button>
              </div>
            </form>
          </div>


        </main>
      </div>
    </div>
  );
};

export default StrategyRegister;