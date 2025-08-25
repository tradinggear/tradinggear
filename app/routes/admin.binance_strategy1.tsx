import React, { useState, useEffect, useRef } from 'react';
import axios from "axios";
import { 
  Menu, 
  X, 
  Users, 
  Bell,
  Search,
  User,
  Plus,
  Edit,
  Trash2,
  Filter,
  Moon,
  Sun,
  ChevronDown,
  ChevronUp,
  ArrowUpDown
} from 'lucide-react';

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
import {Button} from "@/components/ui/button";
// eslint-disable-next-line import/no-unresolved
import {Label} from "@/components/ui/label";

const TradingGearSignalChart = () => {
  const [series, setSeries] = useState<any[]>([]);
  const [annotations, setAnnotations] = useState<any>({});
  const [Chart, setChart] = useState<any>(null);

  const handleClick = () => {
    window.location.href = "/admin/member"; // 페이지 이동 예시
  };

  const handleClick2 = () => {
    window.location.href = "/admin/binance_order_book"; // 페이지 이동 예시
  };

  const handleClick3 = () => {
    window.location.href = "http://210.114.22.48:8050/app/app_ws/"; // 페이지 이동 예시
  };

  useEffect(() => {

    if(sessionStorage.getItem("adminEmail") == null) {
      //if (!hasLoggedOut.current) {
        //alert("로그인해주세요!");
        window.location.href = "/admin_login_check";
        return;
      //}
    }    

    // 브라우저 환경에서만 Chart import
    if (typeof window !== "undefined") {
      import("react-apexcharts").then((mod) => {
        setChart(() => mod.default);
      });
    }
  }, []);

  const fetchData = async () => {
    //try {
      const res = await axios.get("https://tradinggear.co.kr:777/api/visual_signals_full_v2");
      const data = res.data;

      const prices = data.order_blocks.map((ob: any, idx: number) => ({
        x: new Date(data.timestamp).getTime() + idx * 1000 * 60 * 30,
        y: [ob.bottom, ob.top, ob.top, ob.bottom],
      }));

      const currentPriceLine = {
        y: data.current_price,
        borderColor: "#FF0000",
        label: { text: `현재가: ${data.current_price}`, style: { color: "#fff", background: "#FF0000" } },
      };

      const vwapLine = {
        y: data.vwap,
        borderColor: "#008FFB",
        label: { text: `VWAP: ${data.vwap}`, style: { color: "#fff", background: "#008FFB" } },
      };

      const signalMarkers = data.signals.map((sig: any, idx: number) => ({
        x: new Date(data.timestamp).getTime() + idx * 1000 * 60 * 30,
        marker: {
          size: 6,
          fillColor: sig.type === "LONG" ? "#00E396" : "#FF4560",
          strokeColor: "#000",
          shape: "circle",
        },
        label: {
          text: sig.type,
          style: { color: "#fff", background: sig.type === "LONG" ? "#00E396" : "#FF4560" },
        },
      }));

      setSeries([{ name: "OB Box", data: prices }]);
      setAnnotations({
        yaxis: [currentPriceLine, vwapLine],
        points: signalMarkers,
      });
    //} catch (e) {
    //  console.error("시그널 API 호출 실패", e);
    //}
  };

  useEffect(() => {
    fetchData();
    //const interval = setInterval(fetchData, 60000);
    //return () => clearInterval(interval);
  }, []);

  const options = {
    chart: {
      id: "ob-signal-chart",
      type: "candlestick",
      height: 500,
      toolbar: { show: true },
    },
    title: { text: "TradingGear 자동매매 시그널 시각화", align: "left" },
    xaxis: { type: "datetime" },
    annotations,
  };

  if (!Chart) return <div>차트 로딩 중...</div>;

  return <><button onClick={handleClick} className="
    bg-blue-600 hover:bg-blue-700 text-white font-semibold
    py-2 px-4 rounded-lg shadow-md transition-all
    hover:scale-105 active:scale-95
  ">회원목록이동</button>&nbsp;&nbsp;<button onClick={handleClick2} className="
    bg-blue-600 hover:bg-blue-700 text-white font-semibold
    py-2 px-4 rounded-lg shadow-md transition-all
    hover:scale-105 active:scale-95
  ">호가창(오더북)이동</button>&nbsp;&nbsp;
  <button onClick={handleClick3} className="
    bg-blue-600 hover:bg-blue-700 text-white font-semibold
    py-2 px-4 rounded-lg shadow-md transition-all
    hover:scale-105 active:scale-95
  ">실시간전략그래프</button>
  <Chart options={options} series={series} type="candlestick" height={500} /></>;
};

export default TradingGearSignalChart;
