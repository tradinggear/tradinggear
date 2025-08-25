// eslint-disable-next-line import/no-unresolved
import { useThemeStore } from "@/stores/themeStore";
import { useState, useEffect } from "react";
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
  Users,
  ArrowRight,
  ArrowLeft,
  Save,
  Eye,
  FileText,
} from "lucide-react";

// eslint-disable-next-line import/no-unresolved
import { Button } from "@/components/ui/button";
// eslint-disable-next-line import/no-unresolved
import { Badge } from "@/components/ui/badge";
// eslint-disable-next-line import/no-unresolved
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
// eslint-disable-next-line import/no-unresolved
import DashHeader from "@/components/DashHeader";
// eslint-disable-next-line import/no-unresolved
import DashSidebar from "@/components/DashSidebar";
// eslint-disable-next-line import/no-unresolved
import DashFooter from "@/components/DashFooter";
// eslint-disable-next-line import/no-unresolved
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
// eslint-disable-next-line import/no-unresolved
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useNavigate } from "react-router-dom";

const NewStrategyRegistration = () => {
  const { theme, toggleTheme } = useThemeStore();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentStep, setCurrentStep] = useState(1);

  // Form data state
  const [formData, setFormData] = useState({
    // Step 1: 전략 기본 정보
    strategyName: "",
    description: "",
    strategyType: "",
    timeFrame: "",
    assetSelection: "",

    // Step 2: 진입 조건 구성
    baseline: "",
    entryMethod: "",
    direction: "",
    auxiliaryFilters: [],

    // Step 3: 리스크 관리 설정
    entryAmount: "",
    entryAmountType: "dollar", // 'dollar' or 'percent'
    stopLoss: "",
    stopLossType: "atr", // 'atr', 'percent', 'ob'
    takeProfit: "",
    takeProfitType: "atr", // 'atr', 'percent'
    trailingStop: false,

    // Step 4: 실행 조건
    autoTrading: "",
    tradingHours: { start: "09:00", end: "23:30" },
    maxEntriesPerDay: "",
    cooldownTime: "",
  });

  const steps = [
    {
      number: 1,
      title: "전략 기본 정보 입력",
      description: "전략의 기본적인 정보를 설정합니다",
    },
    {
      number: 2,
      title: "진입 조건 구성",
      description: "매매 신호 조건을 구성합니다",
    },
    {
      number: 3,
      title: "리스크 관리 설정",
      description: "손절과 익절 조건을 설정합니다",
    },
    {
      number: 4,
      title: "실행 조건",
      description: "자동매매 실행 조건을 설정합니다",
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

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleArrayInputChange = (
    field: string,
    value: string,
    checked: boolean
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: checked
        ? [...prev[field as keyof typeof formData], value]
        : prev[field as keyof typeof formData].filter((item) => item !== value),
    }));
  };

  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    console.log("전략 등록:", formData);
    alert("전략이 성공적으로 등록되었습니다!");
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h3
              className={`text-lg font-semibold ${
                theme === "dark" ? "text-white" : "text-gray-900"
              }`}
            >
              1. 전략 기본 정보 입력
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="strategyName"
                  className={`block text-sm font-medium mb-2 ${
                    theme === "dark" ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  전략 이름
                </label>
                <input
                  type="text"
                  value={formData.strategyName}
                  onChange={(e) =>
                    handleInputChange("strategyName", e.target.value)
                  }
                  placeholder="전략 이름을 입력하세요"
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    theme === "dark"
                      ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                      : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                  }`}
                />
              </div>

              <div>
                <label
                  htmlFor="strategyType"
                  className={`block text-sm font-medium mb-2 ${
                    theme === "dark" ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  전략 유형
                </label>
                <select
                  value={formData.strategyType}
                  onChange={(e) =>
                    handleInputChange("strategyType", e.target.value)
                  }
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    theme === "dark"
                      ? "bg-gray-700 border-gray-600 text-white"
                      : "bg-white border-gray-300 text-gray-900"
                  }`}
                >
                  <option value="">전략 유형 선택</option>
                  <option value="단타">단타</option>
                  <option value="스윙">스윙</option>
                  <option value="중장기">중장기</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="timeFrame"
                  className={`block text-sm font-medium mb-2 ${
                    theme === "dark" ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  타임프레임
                </label>
                <select
                  value={formData.timeFrame}
                  onChange={(e) =>
                    handleInputChange("timeFrame", e.target.value)
                  }
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    theme === "dark"
                      ? "bg-gray-700 border-gray-600 text-white"
                      : "bg-white border-gray-300 text-gray-900"
                  }`}
                >
                  <option value="">타임프레임 선택</option>
                  <option value="5분">5분</option>
                  <option value="15분">15분</option>
                  <option value="1시간">1시간</option>
                  <option value="일봉">일봉</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="assetSelection"
                  className={`block text-sm font-medium mb-2 ${
                    theme === "dark" ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  자산 선택
                </label>
                <select
                  value={formData.assetSelection}
                  onChange={(e) =>
                    handleInputChange("assetSelection", e.target.value)
                  }
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    theme === "dark"
                      ? "bg-gray-700 border-gray-600 text-white"
                      : "bg-white border-gray-300 text-gray-900"
                  }`}
                >
                  <option value="">자산 선택</option>
                  <option value="드롭다운">드롭다운</option>
                  <option value="검색">검색</option>
                </select>
              </div>
            </div>

            <div>
              <label
                htmlFor="description"
                className={`block text-sm font-medium mb-2 ${
                  theme === "dark" ? "text-gray-300" : "text-gray-700"
                }`}
              >
                설명
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
                placeholder="전략에 대한 설명을 입력하세요"
                rows={3}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  theme === "dark"
                    ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                    : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                }`}
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h3
              className={`text-lg font-semibold ${
                theme === "dark" ? "text-white" : "text-gray-900"
              }`}
            >
              2. 진입 조건 구성
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="baseline"
                  className={`block text-sm font-medium mb-2 ${
                    theme === "dark" ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  기준선
                </label>
                <select
                  value={formData.baseline}
                  onChange={(e) =>
                    handleInputChange("baseline", e.target.value)
                  }
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    theme === "dark"
                      ? "bg-gray-700 border-gray-600 text-white"
                      : "bg-white border-gray-300 text-gray-900"
                  }`}
                >
                  <option value="">기준선 선택</option>
                  <option value="VWAP">VWAP</option>
                  <option value="POC">POC</option>
                  <option value="TEMA">TEMA</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="entryMethod"
                  className={`block text-sm font-medium mb-2 ${
                    theme === "dark" ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  진입 방식
                </label>
                <select
                  value={formData.entryMethod}
                  onChange={(e) =>
                    handleInputChange("entryMethod", e.target.value)
                  }
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    theme === "dark"
                      ? "bg-gray-700 border-gray-600 text-white"
                      : "bg-white border-gray-300 text-gray-900"
                  }`}
                >
                  <option value="">진입 방식 선택</option>
                  <option value="기준선 돌파">기준선 돌파</option>
                  <option value="OB 박스">OB 박스</option>
                  <option value="거래량 급등">거래량 급등</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="direction"
                  className={`block text-sm font-medium mb-2 ${
                    theme === "dark" ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  방향
                </label>
                <select
                  value={formData.direction}
                  onChange={(e) =>
                    handleInputChange("direction", e.target.value)
                  }
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    theme === "dark"
                      ? "bg-gray-700 border-gray-600 text-white"
                      : "bg-white border-gray-300 text-gray-900"
                  }`}
                >
                  <option value="">방향 선택</option>
                  <option value="롱">롱</option>
                  <option value="숏">숏</option>
                  <option value="양방향">양방향</option>
                </select>
              </div>
            </div>

            <div>
              <label
                htmlFor="auxiliaryFilters"
                className={`block text-sm font-medium mb-3 ${
                  theme === "dark" ? "text-gray-300" : "text-gray-700"
                }`}
              >
                보조 필터 (체크박스)
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {["CVD", "OB 필터", "RSI", "히트맵"].map((filter) => (
                  <label
                    key={filter}
                    className="flex items-center space-x-2 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={formData.auxiliaryFilters.includes(filter)}
                      onChange={(e) =>
                        handleArrayInputChange(
                          "auxiliaryFilters",
                          filter,
                          e.target.checked
                        )
                      }
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span
                      className={`text-sm ${
                        theme === "dark" ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      {filter}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h3
              className={`text-lg font-semibold ${
                theme === "dark" ? "text-white" : "text-gray-900"
              }`}
            >
              3. 리스크 관리 설정
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="entryAmount"
                  className={`block text-sm font-medium mb-2 ${
                    theme === "dark" ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  진입 금액
                </label>
                <div className="flex space-x-2">
                  <input
                    type="number"
                    value={formData.entryAmount}
                    onChange={(e) =>
                      handleInputChange("entryAmount", e.target.value)
                    }
                    placeholder="금액 입력"
                    className={`flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      theme === "dark"
                        ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                        : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                    }`}
                  />
                  <select
                    value={formData.entryAmountType}
                    onChange={(e) =>
                      handleInputChange("entryAmountType", e.target.value)
                    }
                    className={`px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      theme === "dark"
                        ? "bg-gray-700 border-gray-600 text-white"
                        : "bg-white border-gray-300 text-gray-900"
                    }`}
                  >
                    <option value="dollar">$</option>
                    <option value="percent">%</option>
                  </select>
                </div>
              </div>

              <div>
                <label
                  htmlFor="stopLoss"
                  className={`block text-sm font-medium mb-2 ${
                    theme === "dark" ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  SL (손절)
                </label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={formData.stopLoss}
                    onChange={(e) =>
                      handleInputChange("stopLoss", e.target.value)
                    }
                    placeholder="1.2 또는 -3 또는 OB"
                    className={`flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      theme === "dark"
                        ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                        : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                    }`}
                  />
                  <select
                    value={formData.stopLossType}
                    onChange={(e) =>
                      handleInputChange("stopLossType", e.target.value)
                    }
                    className={`px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      theme === "dark"
                        ? "bg-gray-700 border-gray-600 text-white"
                        : "bg-white border-gray-300 text-gray-900"
                    }`}
                  >
                    <option value="atr">ATR</option>
                    <option value="percent">%</option>
                    <option value="ob">OB 하단</option>
                  </select>
                </div>
              </div>

              <div>
                <label
                  htmlFor="takeProfit"
                  className={`block text-sm font-medium mb-2 ${
                    theme === "dark" ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  TP (익절)
                </label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={formData.takeProfit}
                    onChange={(e) =>
                      handleInputChange("takeProfit", e.target.value)
                    }
                    placeholder="1.5 또는 +5"
                    className={`flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      theme === "dark"
                        ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                        : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                    }`}
                  />
                  <select
                    value={formData.takeProfitType}
                    onChange={(e) =>
                      handleInputChange("takeProfitType", e.target.value)
                    }
                    className={`px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      theme === "dark"
                        ? "bg-gray-700 border-gray-600 text-white"
                        : "bg-white border-gray-300 text-gray-900"
                    }`}
                  >
                    <option value="atr">ATR</option>
                    <option value="percent">%</option>
                  </select>
                </div>
              </div>

              <div>
                <label
                  htmlFor="trailingStop"
                  className={`block text-sm font-medium mb-2 ${
                    theme === "dark" ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  트레일링 스탑
                </label>
                <select
                  value={formData.trailingStop ? "ON" : "OFF"}
                  onChange={(e) =>
                    handleInputChange("trailingStop", e.target.value === "ON")
                  }
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    theme === "dark"
                      ? "bg-gray-700 border-gray-600 text-white"
                      : "bg-white border-gray-300 text-gray-900"
                  }`}
                >
                  <option value="ON">ON</option>
                  <option value="OFF">OFF</option>
                </select>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <h3
              className={`text-lg font-semibold ${
                theme === "dark" ? "text-white" : "text-gray-900"
              }`}
            >
              4. 실행 조건
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="autoTrading"
                  className={`block text-sm font-medium mb-2 ${
                    theme === "dark" ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  자동매매 계정
                </label>
                <select
                  value={formData.autoTrading}
                  onChange={(e) =>
                    handleInputChange("autoTrading", e.target.value)
                  }
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    theme === "dark"
                      ? "bg-gray-700 border-gray-600 text-white"
                      : "bg-white border-gray-300 text-gray-900"
                  }`}
                >
                  <option value="">계정 선택</option>
                  <option value="binance">[연동된] Binance</option>
                  <option value="3commas">[연동된] 3Commas</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="tradingHours"
                  className={`block text-sm font-medium mb-2 ${
                    theme === "dark" ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  진입 가능 시간대
                </label>
                <div className="flex space-x-2 items-center">
                  <input
                    type="time"
                    value={formData.tradingHours.start}
                    onChange={(e) =>
                      handleInputChange("tradingHours", {
                        ...formData.tradingHours,
                        start: e.target.value,
                      })
                    }
                    className={`px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      theme === "dark"
                        ? "bg-gray-700 border-gray-600 text-white"
                        : "bg-white border-gray-300 text-gray-900"
                    }`}
                  />
                  <span
                    className={
                      theme === "dark" ? "text-gray-300" : "text-gray-700"
                    }
                  >
                    ~
                  </span>
                  <input
                    type="time"
                    value={formData.tradingHours.end}
                    onChange={(e) =>
                      handleInputChange("tradingHours", {
                        ...formData.tradingHours,
                        end: e.target.value,
                      })
                    }
                    className={`px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      theme === "dark"
                        ? "bg-gray-700 border-gray-600 text-white"
                        : "bg-white border-gray-300 text-gray-900"
                    }`}
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="maxEntriesPerDay"
                  className={`block text-sm font-medium mb-2 ${
                    theme === "dark" ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  1일 최대 진입 횟수
                </label>
                <input
                  type="number"
                  value={formData.maxEntriesPerDay}
                  onChange={(e) =>
                    handleInputChange("maxEntriesPerDay", e.target.value)
                  }
                  placeholder="횟수 입력"
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    theme === "dark"
                      ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                      : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                  }`}
                />
              </div>

              <div>
                <label
                  htmlFor="cooldownTime"
                  className={`block text-sm font-medium mb-2 ${
                    theme === "dark" ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  쿨다운 시간
                </label>
                <input
                  type="number"
                  value={formData.cooldownTime}
                  onChange={(e) =>
                    handleInputChange("cooldownTime", e.target.value)
                  }
                  placeholder="분 단위로 입력"
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    theme === "dark"
                      ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                      : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                  }`}
                />
              </div>
            </div>

            {/* 전략 미리보기 및 저장 */}
            <div
              className={`p-4 rounded-lg border ${
                theme === "dark"
                  ? "bg-gray-700 border-gray-600"
                  : "bg-gray-50 border-gray-200"
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <h4
                  className={`text-md font-semibold ${
                    theme === "dark" ? "text-white" : "text-gray-900"
                  }`}
                >
                  전략 미리보기
                </h4>
                <div className="flex space-x-2">
                  <button className="flex items-center px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200 dark:bg-blue-900/20 dark:text-blue-300">
                    <Eye className="w-4 h-4 mr-1" />
                    미리보기
                  </button>
                  <button className="flex items-center px-3 py-1 text-sm bg-green-100 text-green-700 rounded hover:bg-green-200 dark:bg-green-900/20 dark:text-green-300">
                    <FileText className="w-4 h-4 mr-1" />
                    저장 및 등록
                  </button>
                </div>
              </div>

              <div
                className={`text-sm space-y-2 ${
                  theme === "dark" ? "text-gray-300" : "text-gray-600"
                }`}
              >
                <div>
                  <strong>전략명:</strong> {formData.strategyName || "미입력"}
                </div>
                <div>
                  <strong>유형:</strong> {formData.strategyType || "미선택"} |{" "}
                  <strong>시간봉:</strong> {formData.timeFrame || "미선택"}
                </div>
                <div>
                  <strong>자산:</strong> {formData.assetSelection || "미선택"}
                </div>
                <div>
                  <strong>진입조건:</strong> {formData.baseline || "미설정"} +{" "}
                  {formData.entryMethod || "미설정"}
                </div>
                <div>
                  <strong>리스크:</strong> SL {formData.stopLoss || "미설정"} |
                  TP {formData.takeProfit || "미설정"}
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
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
        activeMenu="내 전략 관리"
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
          title="내 전략 관리"
        />

        {/* Dashboard Content */}
        <main className="p-6">
          {/* Step-by-step Header */}
          <div
            className={`mb-8 p-6 rounded-lg border ${
              theme === "dark"
                ? "bg-gray-800 border-gray-700"
                : "bg-white border-gray-200"
            }`}
          >
            <div className="text-center mb-6">
              <h2
                className={`text-2xl font-bold mb-2 ${
                  theme === "dark" ? "text-white" : "text-gray-900"
                }`}
              >
                새 전략 등록 폼
              </h2>
              <p
                className={`${
                  theme === "dark" ? "text-gray-400" : "text-gray-600"
                }`}
              >
                단계별로 전략을 구성하거나 전체 폼을 한번에 작성할 수 있습니다
              </p>
            </div>

            {/* Progress Steps */}
            <div className="flex items-center justify-between max-w-4xl mx-auto mb-6">
              {steps.map((step, index) => (
                <div key={step.number} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium border-2 transition-colors ${
                        currentStep >= step.number
                          ? theme === "dark"
                            ? "bg-cyan-600 border-cyan-600 text-white"
                            : "bg-blue-600 border-blue-600 text-white"
                          : theme === "dark"
                          ? "border-gray-600 text-gray-400"
                          : "border-gray-300 text-gray-500"
                      }`}
                    >
                      {currentStep > step.number ? (
                        <CheckCircle className="w-5 h-5" />
                      ) : (
                        step.number
                      )}
                    </div>
                    <div className="mt-2 text-center">
                      <div
                        className={`text-xs font-medium ${
                          currentStep >= step.number
                            ? theme === "dark"
                              ? "text-cyan-400"
                              : "text-blue-600"
                            : theme === "dark"
                            ? "text-gray-400"
                            : "text-gray-500"
                        }`}
                      >
                        {step.title}
                      </div>
                      <div
                        className={`text-xs mt-1 ${
                          theme === "dark" ? "text-gray-500" : "text-gray-400"
                        }`}
                      >
                        {step.description}
                      </div>
                    </div>
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`w-16 h-0.5 mx-4 ${
                        currentStep > step.number
                          ? theme === "dark"
                            ? "bg-cyan-600"
                            : "bg-blue-600"
                          : theme === "dark"
                          ? "bg-gray-600"
                          : "bg-gray-300"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Step Content */}
          <div
            className={`mb-8 p-6 rounded-lg border ${
              theme === "dark"
                ? "bg-gray-800 border-gray-700"
                : "bg-white border-gray-200"
            }`}
          >
            {renderStepContent()}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center">
            <button
              onClick={prevStep}
              disabled={currentStep === 1}
              className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${
                currentStep === 1
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed dark:bg-gray-600 dark:text-gray-400"
                  : "bg-gray-500 text-white hover:bg-gray-600 dark:bg-gray-600 dark:hover:bg-gray-500"
              }`}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              이전 단계
            </button>

            <div className="flex space-x-3">
              {currentStep < 4 ? (
                <button
                  onClick={nextStep}
                  className={`flex items-center px-6 py-2 rounded-lg font-medium transition-colors ${
                    theme === "dark"
                      ? "bg-cyan-600 text-white hover:bg-cyan-700"
                      : "bg-blue-600 text-white hover:bg-blue-700"
                  }`}
                >
                  다음 단계
                  <ArrowRight className="w-4 h-4 ml-2" />
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  className="flex items-center px-6 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
                >
                  <Save className="w-4 h-4 mr-2" />
                  전략 등록 완료
                </button>
              )}
            </div>
          </div>
        </main>
        {/* Footer */}
        <DashFooter theme={theme} />
      </div>
    </div>
  );
};

export default NewStrategyRegistration;
