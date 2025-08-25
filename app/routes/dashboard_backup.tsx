import { useState, useEffect } from 'react';
import { redirect } from "@remix-run/node";
import { useThemeStore } from '../stores/themeStore';
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
  Copyleft
} from 'lucide-react';
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
import { Button } from '@/components/ui/button';
import { DropdownMenu,DropdownMenuContent,DropdownMenuItem,DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';

import DashHeader from '@/components/DashHeader';
import DashSidebar from '@/components/DashSidebar';
import DashNav from '@/components/DashNav';
import DashFooter from '@/components/DashFooter';

type PortfolioItem = {
  id: number;
  symbol: string;
  currentPrice: number;
  averagePrice: number;
  quantity: number;
  evaluationAmount: number;
  profit: number;
  profitRate: number;
  state: "profit" | "loss" | "neutral";
};

const Dashboard = () => {
  const { theme, toggleTheme } = useThemeStore();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('home');

  const [chartPeriod, setChartPeriod] = useState('차트');
  const [chartDataByPeriod, setChartDataByPeriod] = useState<{ [key: string]: any[] }>({});  
  
  //const [portfolioData, setPortfolioData] = useState<any[]>([]);    
  const [portfolioData, setPortfolioData] = useState<PortfolioItem[]>([]);
  
  const [autoTradingEnabled, setAutoTradingEnabled] = useState(true);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [selectAll, setSelectAll] = useState(false); 

  const [email, setemail] = useState("");
  const [nickName, setnickName] = useState("");

  const [remainAmount, setRemainAmount] = useState("");

  const [tradingCenter, setTradingCenter] = useState("");
  const [pastPred, setPastPred] = useState("");

  const [rateProfit, setrateProfit] = useState("");
  const [rateProfitPercent, setRateProfitPercent] = useState("");
  const [recentTrades, setRecentTrades] = useState<any[]>([]);  
  
  const [stockHeld, setStockHeld] = useState("");

  const [todayTradesCount, setTodayTradesCount] = useState(0);  
/*
  useEffect(() => {
    fetch("/total_amount")
      .then((res) => res.text())
      .then(setRemainAmount)
      .catch((err) => console.error("파일 로딩 오류:", err));
  }, []);
*/
/*
  useEffect(() => {
    const initSetting = async () => {

      const value = String(sessionStorage.getItem("email"));

      const form = new URLSearchParams();
      form.append("email", value ?? "");  

      const res = await fetch('https://tradinggear.co.kr:8081/tradinggear/member_inform_get.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded', // ✅ JSON 형식 명시
        },
        body: form.toString(),
      });    

      const data1 = await res.json(); 
      
      setTradingCenter(data1[0]["trading_center"]);
      //console.log(data1);
    };

    initSetting();
  }, []);
*/


  useEffect(() => {
    const fetchData = async () => {
      console.log(tradingCenter);

      const value = String(sessionStorage.getItem("email"));

      const form = new URLSearchParams();
      form.append("email", value ?? "");  

      const res = await fetch('https://tradinggear.co.kr:8081/tradinggear/member_inform_get.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded', // ✅ JSON 형식 명시
        },
        body: form.toString(),
      });    

      const data1 = await res.json();

      if(data1[0]["trading_center"] == "kium") {

          (document.getElementById("tradeText") as HTMLInputElement).textContent = "키움증권";

          const res2 = await fetch("/etc_inform_kium", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: String(sessionStorage.getItem("email")),
            }),
          });

          const text2 = await res2.text();
          setPastPred(text2);
        //try {
          const res = await fetch("/total_amount_kium", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: String(sessionStorage.getItem("email")),
            }),
          });

          const text = await res.text();
          setRemainAmount(text);
        //} catch (err) {
        //  console.error("POST 요청 오류:", err);
        //}
        const res3 = await fetch("/etc_inform_kium2", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: String(sessionStorage.getItem("email")),
          }),
        });
     
        const text3 = await res3.json();
        setrateProfit(text3.tot_evlt_pl);
        setRateProfitPercent(text3.tot_prft_rt);

        const res4 = await fetch("/etc_inform_kium3", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: String(sessionStorage.getItem("email")),
          }),
        });
     
        const text4 = await res4.json();
        //console.log(text4.count)
        setStockHeld(text4.count);

        const res5 = await fetch("/rate_return_inform_kium3", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: String(sessionStorage.getItem("email")),
          }),
        });
        
        const text5 = await res5.json();
        /*
        type ReturnItem = {
          time: string;
          value: number;
        };
        */
        let newArray: any = ["차트"];
        let portfolioArray: any = [];
        let recentTradesArray: any = [];

        //const newArray: string[] = [];

        //newArray.push("차트");         
        if (Array.isArray(text5)) {           
          /*newArray.push(text5.map((item: any) => {
            return {
              time: '',
              value: item.pl_rt
            };
          }));
          */
          newArray = text5.map(item => ({
            time: '',
            value: item.pl_rt, 
          }));

          portfolioArray = text5.map(item => ({
            id: 1,
            symbol: item.stk_nm,
            company: '',
            currentPrice: item.cur_prc, 
            averagePrice: item.evltv_prft, 
            quantity: item.pur_amt, 
            evaluationAmount: item.evlt_amt, 
            profitRate: item.pl_r, 
            strategyApply: true,
            state: (item.pl_r > 0) ? "profit" : "loss"
          }));          
          
          recentTradesArray = text5.map(item => ({
            id: 1,
            symbol: item.stk_nm,
            type: "SELL",
            price: "", 
            time: "", 
            amount: item.pur_amt, 
            profitRate: item.pl_r, 
          })); 

        }
        //console.log(newArray)
        setChartDataByPeriod({ 차트: newArray });
        setPortfolioData(portfolioArray);
        setRecentTrades(recentTradesArray);
        /*{ id: 1, symbol: 'TSLA', type: 'SELL', amount: 10, price: 250.5, time: '14:25:32', profit: '+2.1%' },*/

      } else if(data1[0]["trading_center"] == "binance") {

        (document.getElementById("tradeText") as HTMLInputElement).textContent = "바이낸스";

        //try {
          const res = await fetch("/binance_total_amount3", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: String(sessionStorage.getItem("email")),
            }),
          });

          const text = await res.json();
          setRemainAmount(text.totalMarginBalance);
        //} catch (err) {
        //  console.error("POST 요청 오류:", err);
        //}        


        const res2 = await fetch("/binance_past_percent", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: String(sessionStorage.getItem("email")),
          }),
        });

        const text2 = await res2.json();
        setPastPred(text2.changePercent);        

        const res3 = await fetch("/binance_total_roe", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: String(sessionStorage.getItem("email")),
          }),
        });
        
        const text3 = await res3.json();
        setrateProfit(text3.totalUnrealizedProfit);
        setRateProfitPercent(text3.totalROE);
        
        const res4 = await fetch("/binance_count", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: String(sessionStorage.getItem("email")),
          }),
        });
     
        const text4 = await res4.json();
        //console.log(text4.count)
        setStockHeld(text4.totalCount);        

        const res5 = await fetch("/binance_recent_trades", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: String(sessionStorage.getItem("email")),
          }),
        });
        
        const text5 = await res5.json();
        /*
        type ReturnItem = {
          time: string;
          value: number;
        };
        */
        let newArray: any = [];
        let portfolioArray: any = [];
        let recentTradesArray: any = [];        

        if (Array.isArray(text5)) {
          recentTradesArray = text5.map(item => ({
            id: item.orderId,
            symbol: item.symbol,
            type: item.side,
            price: item.price, 
            time: item.time, 
            amount: item.qty, 
            profitRate: item.roe, 
          })); 
        }
        //console.log(recentTradesArray);
        setRecentTrades(recentTradesArray);        

        const res6 = await fetch("/binance_pl_chart", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: String(sessionStorage.getItem("email")),
          }),
        });
        
        const text6 = await res6.json();

        if (Array.isArray(text6)) {
          //newArray.push("차트");
          newArray = text6.map(item => ({
            time: item.time,
            value: item.value, 
          }));
        }

        setChartDataByPeriod({ 차트: newArray });

        const res7 = await fetch("/binance_today_trades2", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: String(sessionStorage.getItem("email")),
          }),
        });
        
        const text7 = await res7.json();

        setTodayTradesCount(text7.count);

      } else {
        (document.getElementById("tradeText") as HTMLInputElement).textContent = "미설정";
      }
    };

    fetchData();
  }, []);

useEffect(() => {
  const fetchPortfolio = async () => {
    try {
      //const res = await fetch("/binance_portfolio");
      const res = await fetch("/binance_portfolio", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: String(sessionStorage.getItem("email")),
        }),
      });      
      const data = await res.json();
      console.log("원본 데이터:", data);

      // 1. 데이터 배열인지 확인
      let portfolioArray: PortfolioItem[] = [];
      if (Array.isArray(data)) {
        portfolioArray = data.map((item: any, index: number) => ({
          id: index + 1,
          symbol: item.symbol,
          currentPrice: Number(item.currentPrice || 0),
          averagePrice: Number(item.averagePrice || 0),
          quantity: Number(item.qty || 0),
          evaluationAmount: Number(item.currentPrice || 0) * Number(item.qty || 0),
          profit: Number(item.unrealizedProfit || 0),
          profitRate: Number(item.roe || 0),
          state: Number(item.roe || 0) > 0 ? "profit" : Number(item.roe || 0) < 0 ? "loss" : "neutral",
        }));
      } else if (Array.isArray(data.data)) {
        // 서버 응답이 { data: [] } 형태인 경우
        portfolioArray = data.data.map((item: any, index: number) => ({
          id: index + 1,
          symbol: item.symbol,
          currentPrice: Number(item.currentPrice || 0),
          averagePrice: Number(item.averagePrice || 0),
          quantity: Number(item.qty || 0),
          evaluationAmount: Number(item.currentPrice || 0) * Number(item.qty || 0),
          profit: Number(item.unrealizedProfit || 0),
          profitRate: Number(item.roe || 0),
          state: Number(item.roe || 0) > 0 ? "profit" : Number(item.roe || 0) < 0 ? "loss" : "neutral",
        }));
      }

      setPortfolioData(portfolioArray);
    } catch (err) {
      console.error("포트폴리오 로딩 오류:", err);
      setPortfolioData([]); // 안전 처리
    }
  };

  fetchPortfolio();
  const interval = setInterval(fetchPortfolio, 60000);
  return () => clearInterval(interval);
}, []);

  // 포트폴리오 데이터
  /*
  const portfolioData = [
    { 
      id: 1,
      symbol: 'TSLA',
      company: 'Tesla Inc.',
      currentPrice: 250.5, 
      averagePrice: 240.2, 
      quantity: 50, 
      evaluationAmount: 12525000, 
      profitRate: 4.3, 
      strategyApply: true,
      state: 'profit'
    },
    { 
      id: 2,
      symbol: 'NVDA',
      company: 'NVIDIA Corp.',
      currentPrice: 890.2, 
      averagePrice: 850.1, 
      quantity: 25, 
      evaluationAmount: 22255000, 
      profitRate: 4.7, 
      strategyApply: false,
      state: 'profit' 
    },
    { 
      id: 3,
      symbol: 'AMZN',
      company: 'Amazon.com Inc.',
      currentPrice: 3420.8, 
      averagePrice: 3500.2, 
      quantity: 10, 
      evaluationAmount: 34208000, 
      profitRate: -2.3, 
      strategyApply: true,
      state: 'loss'
    },
    { 
      id: 4,
      symbol: 'AAPL',
      company: 'Apple Inc.',
      currentPrice: 195.3, 
      averagePrice: 180.5, 
      quantity: 75, 
      evaluationAmount: 14647500, 
      profitRate: 8.2, 
      strategyApply: true,
      state: 'profit'
    },
  ];
  */

  // 상단 탭 메뉴
  const topTabs = [
    { id: 'home', label: '홈' },
    { id: 'plan', label: '자동매매설정' },
    { id: 'security', label: '전략타겟' },
    { id: 'accountState', label: '자산현황' },
    { id: 'accountOpen', label: '열림' },
    { id: 'accountProfit', label: '수익률' }
  ];

  // Handle row selection
  const handleSelectRow = (id: number, checked: boolean) => {
    if (checked) {
      setSelectedRows(prev => [...prev, id]);
    } else {
      setSelectedRows(prev => prev.filter(rowId => rowId !== id));
      setSelectAll(false);
    }
  };

  // Handle select all rows
  const handleSelectAll = (checked: boolean) => {
    setSelectAll(checked);
    if (checked) {
      setSelectedRows(portfolioData.map(item => item.id));
    } else {
      setSelectedRows([]);
    }
  };

  // Update select all state based on selected rows
  useEffect(() => {
    if (selectedRows.length === portfolioData.length && portfolioData.length > 0) {
      setSelectAll(true);
    } else {
      setSelectAll(false);
    }
  }, [selectedRows, portfolioData]);

  // 화면 크기에 따른 사이드바 초기 상태 설정
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
      }
    };
    
    //console.log(sessionStorage.getItem("email"));
    //sessionStorage.removeItem("email");

    //setemail(String(sessionStorage.getItem("email")));
    //setnickName(String(sessionStorage.getItem("nickName")));    
    



    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);



  // 상태 배지 렌더링
  const getStatusBadge = (상태: string, 수익률: number) => {
    if (상태 === 'profit') {
      return <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100">수익</Badge>;
    } else if (상태 === 'loss') {
      return <Badge variant="destructive">손실</Badge>;
    } else {
      return <Badge variant="secondary">보합</Badge>;
    }
  };
  // 차트 데이터 (기간별)
  /*
  const chartDataByPeriod = {
    차트: [
      { time: '월', value: 980000 },
      { time: '화', value: 1510000 },
      { time: '수', value: 1495000 },
      { time: '목', value: 1530000 },
      { time: '금', value: 2043000 },
    ]
  };
  */
  /*
  const chartDataByPeriod = {
    일: [
      { time: '09:00', value: 1100000 },
      { time: '10:00', value: 1512000 },
      { time: '11:00', value: 1498000 },
      { time: '12:00', value: 1520000 },
      { time: '13:00', value: 1935000 },
      { time: '14:00', value: 1543000 },
    ],
    주간: [
      { time: '월', value: 980000 },
      { time: '화', value: 1510000 },
      { time: '수', value: 1495000 },
      { time: '목', value: 1530000 },
      { time: '금', value: 2043000 },
    ],
    월: [
      { time: '1월', value: 300000 },
      { time: '2월', value: 1450000 },
      { time: '3월', value: 1420000 },
      { time: '4월', value: 1500000 },
      { time: '5월', value: 1520000 },
      { time: '6월', value: 1543000 },
    ]
  };
  */
  const formatToKoreanUnit = (value) => {
    if (value >= 100000000) {
      return `${(value / 100000000).toFixed(1)}억`;
    } else if (value >= 10000) {
      return `${(value / 10000).toFixed(0)}만`;
    } else {
      return value.toLocaleString();
    }
  };
  // 최근 체결 내역
  /*
  const recentTrades = [
    { id: 1, symbol: 'TSLA', type: 'SELL', amount: 10, price: 250.5, time: '14:25:32', profit: '+2.1%' },
    { id: 2, symbol: 'NVDA', type: 'SELL', amount: 5, price: 890.2, time: '14:20:15', profit: '+4.5%' },
    { id: 3, symbol: 'AAPL', type: 'SELL', amount: 25, price: 195.3, time: '14:15:48', profit: '+1.8%' },
  ];
  */

  // 전략 성과 데이터
  const strategyPerformance = [
    { strategyName: 'RSI 역추세', profitRate: 12.5, winRate: 68.2, maxDrop: -3.8 },
    { strategyName: '볼린저밴드', profitRate: 8.3, winRate: 72.5, maxDrop: -2.1 },
    { strategyName: '이동평균 돌파', profitRate: 15.2, winRate: 65.8, maxDrop: -5.2 },
  ];

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
          title="대시보드"
        />
        {/* 상단 탭 네비게이션 */}
        <DashNav activeTab="dashboard" />
        {/*
        <div className={`border-t ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className="px-4 lg:px-6">
            <div className="flex space-x-8 overflow-x-auto">
              {topTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab && setActiveTab(tab.id)}
                  className={`py-3 px-1 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
                    activeTab === tab.id 
                      ? theme === 'dark'
                        ? 'border-cyan-400 text-cyan-400'
                        : 'border-blue-600 text-blue-600'
                      : theme === 'dark'
                        ? 'border-transparent text-gray-400 hover:text-gray-300'
                        : 'border-transparent text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>
        */}
        {/* Dashboard Content */}
        <main className="p-6">
          {/* 내 계좌 섹션 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className={`rounded-xl shadow-lg p-6 border ${
              theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            }`}>
              <div className="flex items-center justify-between mb-4">
                <div className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  총 자산
                </div>
                <DollarSign className="w-5 h-5 text-green-500" />
              </div>
              <div className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mb-2`}>
                {remainAmount}
              </div>
              <div className="text-green-500 text-sm">전일 대비 {pastPred}%</div>
            </div>

            <div className={`rounded-xl shadow-lg p-6 border ${
              theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            }`}>
              <div className="flex items-center justify-between mb-4">
                <div className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  평가손익
                </div>
                <TrendingUp className="w-5 h-5 text-blue-500" />
              </div>
              <div className={`text-2xl font-bold text-blue-500 mb-2`}>
                {rateProfit}
              </div>
              <div className="text-blue-500 text-sm">수익률 {rateProfitPercent}%</div>
            </div>

            <div className={`rounded-xl shadow-lg p-6 border ${
              theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            }`}>
              <div className="flex items-center justify-between mb-4">
                <div className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  보유품목
                </div>
                <Activity className="w-5 h-5 text-purple-500" />
              </div>
              <div className={`text-2xl font-bold text-purple-500 mb-2`}>
                {stockHeld}종목
              </div>
              <div className="text-purple-500 text-sm">활성 전략 3개</div>
            </div>
          </div>

          {/* 자동매매 & 포트폴리오 섹션 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* 자동매매 */}
            <div className={`rounded-xl shadow-lg p-6 border ${
              theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            }`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
                  자동매매
                </h3>
              </div>
              
              <div className="space-y-2">
                <div className={`flex justify-between items-center border p-4 rounded-lg ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
                  <span className={`text-md font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>활성화될 전략 수</span>
                  <span className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>3개</span>
                </div>
                <div className={`flex justify-between items-center border p-4 rounded-lg ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
                  <span className={`text-md font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>금일 거래</span>
                  <span className={`font-semibold text-green-500`}>{todayTradesCount}회</span>
                </div>
                <div className={`border p-4 rounded-lg ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
                  <div className={`flex justify-between items-center text-md font-medium mb-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    <span className="">최근 체결내역</span>
                    <button
                      onClick={() => setAutoTradingEnabled(!autoTradingEnabled)}
                      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                        autoTradingEnabled ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'
                      }`}
                    >
                      <span className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                        autoTradingEnabled ? 'translate-x-5' : 'translate-x-1'
                      }`} />
                    </button>
                  </div>
                  {autoTradingEnabled && (
                  <div className="pt-2 space-y-2">
                    {recentTrades.slice(0, 3).map((trade) => (
                      <div key={trade.id} className="flex justify-between items-center text-xs">
                        <span className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                          {trade.symbol} {trade.type}
                        </span>
                        <span className={`${trade.profitRate.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                          {trade.profitRate}
                        </span>
                      </div>
                    ))}
                  </div>
                  )}
                </div>
              </div>
            </div>

            {/* 수익률 차트 */}
            <div className={`rounded-xl shadow-lg p-6 border ${
              theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            }`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
                  손익률 차트
                </h3>
                <div className="flex space-x-2">
                  {['차트'].map((period) => (
                    <button
                      key={period}
                      onClick={() => setChartPeriod(period)}
                      className={`px-3 py-1 text-xs rounded transition-colors ${
                        chartPeriod === period
                          ? 'bg-blue-500 text-white'
                          : theme === 'dark'
                            ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {period}
                    </button>
                  ))}
                </div>
              </div>
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={chartDataByPeriod[chartPeriod as keyof typeof chartDataByPeriod]}>
                  
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  
                  <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? "#374151" : "#e5e7eb"} />
                  <XAxis dataKey="time" stroke={theme === 'dark' ? "#9ca3af" : "#6b7280"} />
                  <YAxis stroke={theme === 'dark' ? "#9ca3af" : "#6b7280"} tickFormatter={formatToKoreanUnit} />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: theme === 'dark' ? "#1f2937" : "#ffffff",
                      border: `1px solid ${theme === 'dark' ? "#374151" : "#e5e7eb"}`,
                      borderRadius: "8px",
                      color: theme === 'dark' ? "#ffffff" : "#000000"
                    }}
                    formatter={(value) => formatToKoreanUnit(value)}
                  />
                  <Area type="monotone" dataKey="value" stroke="#3B82F6" fillOpacity={1} fill="url(#colorValue)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* 포트폴리오 테이블 */}
          <div className={`rounded-xl border ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} mb-8`}>
            {/* Header */}
            <div className="flex items-center justify-between p-6">
              <h3 id="tradeText" className={`text-2xl font-bold tracking-tight ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                
              </h3>
            </div>

            {/* Table */}
            <div className={`relative overflow-hidden border-t text-center ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
              <Table>
                <colgroup>
                  <col className="w-1/12" />
                  <col className="w-2/12" />
                  <col className="w-2/12" />
                  <col className="w-2/12" />
                  <col className="w-1/12" />
                  <col className="w-2/12" />
                  <col className="w-1/12" />
                  <col className="w-1/12" />
                </colgroup>
                <TableHeader>
                  <TableRow className={theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}>
                    {/*
                    <TableHead className={`text-center ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>상태</TableHead>
                    <TableHead className={`text-center ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>종목</TableHead>
                    <TableHead className={`text-center ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>현재가</TableHead>
                    <TableHead className={`text-center ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>평균가</TableHead>
                    <TableHead className={`text-center ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>수량</TableHead>
                    <TableHead className={`text-center ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>평가금액</TableHead>
                    <TableHead className={`text-center ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>수익률</TableHead>
                    <TableHead className="w-12"></TableHead>
                    */}
                    <TableHead className={`text-center ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>상태</TableHead>
                    <TableHead className={`text-center ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>종목</TableHead>
                    <TableHead className={`text-center ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>현재가</TableHead>
                    <TableHead className={`text-center ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>평가손익</TableHead>
                    <TableHead className={`text-center ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>매입금액</TableHead>
                    <TableHead className={`text-center ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>평가금액</TableHead>
                    <TableHead className={`text-center ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>수익률</TableHead>
                    <TableHead className="w-12"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {portfolioData.slice(0,10).map((item) => (
                    <TableRow 
                      key={item.id} 
                      className={`${theme === 'dark' ? 'border-gray-700 hover:bg-gray-750' : 'border-gray-200 hover:bg-gray-50'} transition-colors`}
                    >
                      <TableCell className="text-center">
                        {getStatusBadge(item.state, item.profitRate)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-3 text-left">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                            item.symbol === 'TSLA' ? 'bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300' :
                            item.symbol === 'NVDA' ? 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300' :
                            item.symbol === 'AMZN' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300' :
                            'bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-300'
                          }`}>
                            {/*{item.symbol.slice(0, 2)}*/}
                          </div>
                          <div>
                            <div className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                              {item.symbol}
                            </div>
                            <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                              {/*{item.company}*/}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
                        <div className="font-medium">₩{item.currentPrice.toLocaleString()}</div>
                        <div className={`text-xs ${
                          item.currentPrice > item.averagePrice ? 'text-emerald-600' : 'text-red-600'
                        }`}>
                          {item.currentPrice > item.averagePrice ? '+' : ''}{((item.currentPrice - item.averagePrice) / item.averagePrice * 100).toFixed(2)}%
                        </div>
                      </TableCell>
                      <TableCell className={`font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                        ₩{item.averagePrice.toLocaleString()}
                      </TableCell>
                      <TableCell className={`font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                        {item.quantity}주
                      </TableCell>
                      <TableCell className={`text-center font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                        ₩{item.evaluationAmount.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant={item.profitRate > 0 ? "default" : "destructive"} className={
                          item.profitRate > 0 
                            ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-100"
                            : ""
                        }>
                          {item.profitRate > 0 ? '+' : ''}{item.profitRate}%
                        </Badge>
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
                            <DropdownMenuItem onClick={() => console.log('전략 적용/해제')} className={theme === 'dark' ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'}>
                              {item.strategyApply ? '전략 해제' : '전략 적용'}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => console.log('매도 주문')} className={theme === 'dark' ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'}>
                              매도 주문
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => console.log('상세 정보')} className={theme === 'dark' ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'}>
                              상세 정보
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          {/* <div className={`rounded-xl shadow-lg p-6 border mb-8 ${
            theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          }`}>
            <h3 className={`text-lg font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
              포트폴리오
            </h3>
            <Table>
              <TableCaption className='hidden'>포트폴리오</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead className={`text-left py-3 text-sm font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>종목명</TableHead>
                  <TableHead className={`text-left py-3 text-sm font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>현재가</TableHead>
                  <TableHead className={`text-left py-3 text-sm font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>평균가</TableHead>
                  <TableHead className={`text-left py-3 text-sm font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>수량</TableHead>
                  <TableHead className={`text-left py-3 text-sm font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>평가금액</TableHead>
                  <TableHead className={`text-left py-3 text-sm font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>수익률</TableHead>
                  <TableHead className={`text-left py-3 text-sm font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>전략적용여부</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
              {portfolioData.map((item, index) => (
                <TableRow key={index}>
                  <TableCell className={`py-3 font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{item.종목명}</TableCell>
                  <TableCell className={`py-3 font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{item.현재가}</TableCell>
                  <TableCell className={`py-3 font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{item.평균가}</TableCell>
                  <TableCell className={`py-3 font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{item.수량}</TableCell>
                  <TableCell className={`py-3 font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{item.평가금액}</TableCell>
                  <TableCell className={`py-3 font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{item.수익률}</TableCell>
                  <TableCell>
                    <button 
                      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                        item.전략적용여부 ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'
                      }`}
                    >
                      <span className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                        item.전략적용여부 ? 'translate-x-5' : 'translate-x-1'
                      }`} />
                    </button>
                  </TableCell>
                </TableRow>
              ))}
              </TableBody>
            </Table> */}

            {/* <div className="overflow-x-auto">
              
              <table className="w-full">
                <thead>
                  <tr className={`border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
                    <th className={`text-left py-3 text-sm font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>종목명</th>
                    <th className={`text-left py-3 text-sm font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>현재가</th>
                    <th className={`text-left py-3 text-sm font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>평균가</th>
                    <th className={`text-left py-3 text-sm font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>수량</th>
                    <th className={`text-left py-3 text-sm font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>평가금액</th>
                    <th className={`text-left py-3 text-sm font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>수익률</th>
                    <th className={`text-left py-3 text-sm font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>전략적용여부</th>
                  </tr>
                </thead>
                <tbody>
                  {portfolioData.map((item, index) => (
                    <tr key={index} className={`border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
                      <td className={`py-3 font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{item.종목명}</td>
                      <td className={`py-3 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>₩{item.현재가.toLocaleString()}</td>
                      <td className={`py-3 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>₩{item.평균가.toLocaleString()}</td>
                      <td className={`py-3 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>{item.수량}</td>
                      <td className={`py-3 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>₩{item.평가금액.toLocaleString()}</td>
                      <td className={`py-3 font-medium ${item.수익률 > 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {item.수익률 > 0 ? '+' : ''}{item.수익률}%
                      </td>
                      <td className="py-3">
                        <button 
                          className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                            item.전략적용여부 ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'
                          }`}
                        >
                          <span className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                            item.전략적용여부 ? 'translate-x-5' : 'translate-x-1'
                          }`} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div> */}
          </div>

          {/* 하단 섹션 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* 최근 알림 */}
            <div className={`rounded-xl shadow-lg p-6 border ${
              theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            }`}>
              <h3 className={`text-lg font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
                최근 알림
              </h3>
              <div className="space-y-4">
                <div className={`p-3 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-blue-50'}`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-blue-900'}`}>전체 체결내역</span>
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  </div>
                  <div className={`text-xs ${theme === 'dark' ? 'text-gray-300' : 'text-blue-700'}`}>
                    금일 총 12회 거래 완료
                  </div>
                </div>
                
                <div className={`p-3 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-green-50'}`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-green-900'}`}>승률</span>
                    <TrendingUp className="w-4 h-4 text-green-500" />
                  </div>
                  <div className={`text-xs ${theme === 'dark' ? 'text-gray-300' : 'text-green-700'}`}>
                    현재 승률 68.2% (목표 대비 +3.2%)
                  </div>
                </div>
                
                <div className={`p-3 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-orange-50'}`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-orange-900'}`}>최대낙폭</span>
                    <AlertCircle className="w-4 h-4 text-orange-500" />
                  </div>
                  <div className={`text-xs ${theme === 'dark' ? 'text-gray-300' : 'text-orange-700'}`}>
                    현재 -2.1% (안전 구간)
                  </div>
                </div>
              </div>
            </div>

            {/* 전략성과요약 */}
            <div className={`rounded-xl shadow-lg p-6 border ${
              theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            }`}>
              <h3 className={`text-lg font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
                전략성과요약
              </h3>
              <div className="space-y-4">
                {strategyPerformance.map((strategy, index) => (
                  <div key={index} className={`p-4 rounded-lg border ${
                    theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'
                  }`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                        {strategy.strategyName}
                      </span>
                      <Brain className="w-4 h-4 text-purple-500" />
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
                        <div className="text-red-500 font-medium">{strategy.maxDrop}%</div>
                      </div>
                    </div>
                  </div>
                ))}
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

export default Dashboard;