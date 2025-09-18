import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { PassThrough } from "node:stream";
import { createReadableStreamFromReadable, json, createCookieSessionStorage, createCookie } from "@remix-run/node";
import { RemixServer, Outlet, Meta, Links, ScrollRestoration, Scripts, useLocation, useNavigate as useNavigate$1 } from "@remix-run/react";
import { isbot } from "isbot";
import { renderToPipeableStream } from "react-dom/server";
import * as React from "react";
import React__default, { useState, useEffect, useRef } from "react";
import { X, Users, BarChart3, UserRoundCheck, BotOff, ChartPie, Settings, Lock, Menu, Bell, User, ArrowUpDown, ChevronUp, ChevronDown, Check, Search, Edit, Trash2, List, Save, ArrowLeft, Activity, Calendar, ChevronRight, Circle, Sun, Moon, Crown, UserCog, Shield, HelpCircle, LogOut, Home, Bot, Target, Play, Pause, AlertCircle, Brain, Grid3X3, Repeat, TrendingDown, Plus, MoreHorizontal, CheckCircle, Wallet, ArrowUpRight, TrendingUp, DollarSign, Zap, Clock, PieChart as PieChart$1, Timer, ArrowRight, Eye, FileText, EyeOff, Download, Star, ArrowDownRight, Globe, RefreshCw, Monitor, Video, Square, Key, AlertTriangle, Award, ChartLine, CircleDollarSign, OctagonAlert, ShoppingCart, BookOpen, Lightbulb, MessageCircle, Heart, Bookmark, Share2 } from "lucide-react";
import { create } from "zustand";
import axios from "axios";
import * as SelectPrimitive from "@radix-ui/react-select";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import * as LabelPrimitive from "@radix-ui/react-label";
import { cva } from "class-variance-authority";
import { useNavigate, Link } from "react-router-dom";
import crypto from "crypto";
import { Slot } from "@radix-ui/react-slot";
import * as SwitchPrimitives from "@radix-ui/react-switch";
import fetch$1 from "node-fetch";
import { ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Bar, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area } from "recharts";
import { persist } from "zustand/middleware";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import { PassThrough as PassThrough$1 } from "stream";
import WebSocket$1 from "ws";
import admin from "firebase-admin";
import fs from "fs";
import path from "path";
import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
const ABORT_DELAY = 5e3;
function handleRequest(request, responseStatusCode, responseHeaders, remixContext, loadContext) {
  return isbot(request.headers.get("user-agent") || "") ? handleBotRequest(
    request,
    responseStatusCode,
    responseHeaders,
    remixContext
  ) : handleBrowserRequest(
    request,
    responseStatusCode,
    responseHeaders,
    remixContext
  );
}
function handleBotRequest(request, responseStatusCode, responseHeaders, remixContext) {
  return new Promise((resolve, reject) => {
    let shellRendered = false;
    const { pipe, abort } = renderToPipeableStream(
      /* @__PURE__ */ jsx(
        RemixServer,
        {
          context: remixContext,
          url: request.url,
          abortDelay: ABORT_DELAY
        }
      ),
      {
        onAllReady() {
          shellRendered = true;
          const body = new PassThrough();
          const stream = createReadableStreamFromReadable(body);
          responseHeaders.set("Content-Type", "text/html");
          resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: responseStatusCode
            })
          );
          pipe(body);
        },
        onShellError(error) {
          reject(error);
        },
        onError(error) {
          responseStatusCode = 500;
          if (shellRendered) {
            console.error(error);
          }
        }
      }
    );
    setTimeout(abort, ABORT_DELAY);
  });
}
function handleBrowserRequest(request, responseStatusCode, responseHeaders, remixContext) {
  return new Promise((resolve, reject) => {
    let shellRendered = false;
    const { pipe, abort } = renderToPipeableStream(
      /* @__PURE__ */ jsx(
        RemixServer,
        {
          context: remixContext,
          url: request.url,
          abortDelay: ABORT_DELAY
        }
      ),
      {
        onShellReady() {
          shellRendered = true;
          const body = new PassThrough();
          const stream = createReadableStreamFromReadable(body);
          responseHeaders.set("Content-Type", "text/html");
          resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: responseStatusCode
            })
          );
          pipe(body);
        },
        onShellError(error) {
          reject(error);
        },
        onError(error) {
          responseStatusCode = 500;
          if (shellRendered) {
            console.error(error);
          }
        }
      }
    );
    setTimeout(abort, ABORT_DELAY);
  });
}
const entryServer = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: handleRequest
}, Symbol.toStringTag, { value: "Module" }));
const links = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous"
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap"
  }
];
function Layout({ children }) {
  return /* @__PURE__ */ jsxs("html", { lang: "en", children: [
    /* @__PURE__ */ jsxs("head", { children: [
      /* @__PURE__ */ jsx("meta", { charSet: "utf-8" }),
      /* @__PURE__ */ jsx("meta", { name: "viewport", content: "width=device-width, initial-scale=1" }),
      /* @__PURE__ */ jsx(Meta, {}),
      /* @__PURE__ */ jsx(Links, {})
    ] }),
    /* @__PURE__ */ jsxs("body", { children: [
      children,
      /* @__PURE__ */ jsx(ScrollRestoration, {}),
      /* @__PURE__ */ jsx(Scripts, {})
    ] })
  ] });
}
function App$1() {
  return /* @__PURE__ */ jsx(Outlet, {});
}
const route0 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Layout,
  default: App$1,
  links
}, Symbol.toStringTag, { value: "Module" }));
const useSidebarStore = create((set, get) => ({
  isSidebarOpen: true,
  isMobile: false,
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  setSidebarOpen: (isOpen) => set({ isSidebarOpen: isOpen }),
  setIsMobile: (isMobile) => {
    set({ isMobile });
    if (!isMobile) {
      set({ isSidebarOpen: true });
    } else {
      set({ isSidebarOpen: false });
    }
  },
  closeSidebarOnMobile: () => {
    const { isMobile } = get();
    if (isMobile) {
      set({ isSidebarOpen: false });
    }
  }
}));
const AdminSidebar = () => {
  const { isSidebarOpen, isMobile, toggleSidebar } = useSidebarStore();
  const location2 = useLocation();
  const menuItems = [
    { icon: Users, label: "회원목록", href: "/admin/member", path: "/admin/member" },
    /*{ icon: Users, label: '바이낸스오더북', href: '/admin/binance_order_book', path: '/admin/binance_order_book' },  
    { icon: Users, label: '전략그래프', href: '/admin/binance_strategy1', active: true }, 
    { icon: Users, label: '실시간전략그래프', href: 'http://210.114.22.48:8050/app/app_ws/', active: true }, 
    { icon: Users, label: '실시간전략그래프2', href: 'http://210.114.22.48:8052/', active: true },*/
    { icon: Users, label: "실시간전략그래프", href: "http://210.114.22.48:8054", active: true },
    { icon: BarChart3, label: "전략 리스트", href: "/admin/strategy", path: "/admin/strategy" },
    { icon: UserRoundCheck, label: "승인 대기", href: "/admin/approval", path: "/admin/approval" },
    { icon: BotOff, label: "차단 전략", href: "/admin/cutOff", path: "/admin/cutOff" },
    { icon: ChartPie, label: "전략 통계", href: "/admin/state", path: "/admin/state" },
    { icon: Settings, label: "설정", href: "/admin/settings", path: "/admin/settings" }
  ];
  const isActiveMenu = (menuPath) => {
    if (menuPath === "/admin") {
      return location2.pathname === "/admin";
    }
    return location2.pathname.startsWith(menuPath);
  };
  const handleLogout = () => {
    localStorage.removeItem("adminLoggedIn");
    localStorage.removeItem("adminEmail");
    alert("로그아웃되었습니다. 로그인 페이지로 이동합니다.");
    window.location.href = "/admin/login";
  };
  return /* @__PURE__ */ jsx("div", { className: `
      fixed top-0 left-0 h-full border-r bg-gray-800 border-gray-700 z-50 transition-transform duration-300 ease-in-out
      ${isMobile ? "w-64" : "w-64"}
      ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
    `, children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col h-full", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between px-[25px] pt-[25px] pb-[15px] border-gray-700", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-xl font-bold md:leading-[1.6] text-white", children: /* @__PURE__ */ jsx("a", { href: "/admin", children: /* @__PURE__ */ jsx("img", { className: "h-[44px]", src: "/logo-white.png", alt: "" }) }) }),
      isMobile && /* @__PURE__ */ jsx(
        "button",
        {
          onClick: toggleSidebar,
          className: "p-1 rounded-md hover:bg-gray-700 text-gray-400",
          children: /* @__PURE__ */ jsx(X, { className: "w-5 h-5" })
        }
      )
    ] }),
    /* @__PURE__ */ jsx("nav", { className: "flex-1 p-4", children: /* @__PURE__ */ jsx("ul", { className: "space-y-2", children: menuItems.map((item, index) => {
      const Icon = item.icon;
      const isActive = isActiveMenu(item.path);
      return /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsxs(
        "a",
        {
          href: item.href,
          className: `
                      flex items-center px-4 py-3 rounded-lg transition-colors duration-200
                      ${isActive ? "bg-blue-600 text-white" : "text-gray-300 hover:bg-gray-700 hover:text-white"}
                    `,
          children: [
            /* @__PURE__ */ jsx(Icon, { className: "w-5 h-5 mr-3" }),
            /* @__PURE__ */ jsx("span", { className: "font-medium", children: item.label })
          ]
        }
      ) }, index);
    }) }) }),
    /* @__PURE__ */ jsx("div", { className: "p-4 border-t border-gray-700", children: /* @__PURE__ */ jsxs(
      "button",
      {
        onClick: handleLogout,
        className: "w-full flex items-center px-4 py-3 rounded-lg transition-colors duration-200 text-gray-300 hover:bg-gray-700 hover:text-white",
        children: [
          /* @__PURE__ */ jsx(Lock, { className: "w-5 h-5 mr-3" }),
          /* @__PURE__ */ jsx("span", { className: "font-medium", children: "로그아웃" })
        ]
      }
    ) })
  ] }) });
};
const Header$1 = ({ title }) => {
  const { toggleSidebar } = useSidebarStore();
  const [email, setemail] = useState("");
  const [nickName, setnickName] = useState("");
  const [membersData, setMembersData] = useState([]);
  useEffect(() => {
    fetch("https://tradinggear.co.kr:8081/tradinggear/members_data.php").then((res) => {
      if (!res.ok) throw new Error("네트워크 오류");
      return res.json();
    }).then((data) => {
      setMembersData(data);
    }).catch((err) => {
      console.error("데이터 가져오기 실패:", err);
    });
    setemail(String(sessionStorage.getItem("adminEmail")));
    setnickName(String(sessionStorage.getItem("adminNickName")));
  }, []);
  return /* @__PURE__ */ jsx("header", { className: "bg-gray-800 border-b border-gray-700", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between px-4 py-4", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center", children: [
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: toggleSidebar,
          className: "p-2 rounded-md transition-colors duration-200 hover:bg-gray-700 text-gray-400",
          children: /* @__PURE__ */ jsx(Menu, { className: "w-5 h-5" })
        }
      ),
      /* @__PURE__ */ jsx("h1", { className: "ml-4 text-xl font-semibold text-white", children: title })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-4", children: [
      /* @__PURE__ */ jsxs("button", { className: "p-2 rounded-md relative transition-colors duration-200 hover:bg-gray-700 text-gray-400", children: [
        /* @__PURE__ */ jsx(Bell, { className: "w-5 h-5" }),
        /* @__PURE__ */ jsx("span", { className: "absolute top-1 right-1 w-2 h-2 bg-blue-500 rounded-full" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-2", children: [
        /* @__PURE__ */ jsx("div", { className: "w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center", children: /* @__PURE__ */ jsx(User, { className: "w-5 h-5 text-white" }) }),
        /* @__PURE__ */ jsxs("span", { className: "hidden md:block text-sm font-medium text-gray-300", children: [
          nickName,
          "님"
        ] })
      ] })
    ] })
  ] }) });
};
const AdminDashboard$3 = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [searchType, setSearchType] = useState("id_email");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "ascending" });
  const [email, setemail] = useState("");
  const [nickName, setnickName] = useState("");
  useRef(false);
  const [bids, setBids] = useState([]);
  const [asks, setAsks] = useState([]);
  const [priceSum, setPriceSum] = useState(0);
  const [priceSum2, setPriceSum2] = useState(0);
  const [cvd, setCvd] = useState(0);
  useEffect(() => {
    const fetchOrderBook = async () => {
      try {
        const res = await fetch("https://api.binance.com/api/v3/depth?symbol=SOLUSDT&limit=10");
        const data = await res.json();
        const sorted = [...data.bids].sort(
          (a, b) => parseFloat(b[1]) - parseFloat(a[1])
        );
        setBids(sorted);
        const qtySum = data.bids.reduce((acc, [, qty]) => acc + parseFloat(qty), 0);
        console.log("qtySum=" + qtySum);
        setPriceSum(qtySum);
      } catch (error) {
        console.error("오더북 가져오기 실패:", error);
      }
    };
    fetchOrderBook();
    const intervalId = setInterval(fetchOrderBook, 6e4);
    return () => clearInterval(intervalId);
  }, []);
  useEffect(() => {
    const fetchOrderBook = async () => {
      try {
        const res = await fetch("https://api.binance.com/api/v3/depth?symbol=SOLUSDT&limit=10");
        const data = await res.json();
        const sorted = [...data.asks].sort(
          (a, b) => parseFloat(b[1]) - parseFloat(a[1])
        );
        setAsks(sorted);
        const qtySum = data.asks.reduce((acc, [, qty]) => acc + parseFloat(qty), 0);
        console.log("qtySum2=" + qtySum);
        setPriceSum2(qtySum);
      } catch (error) {
        console.error("오더북 가져오기 실패:", error);
      }
    };
    fetchOrderBook();
    const intervalId = setInterval(fetchOrderBook, 6e4);
    return () => clearInterval(intervalId);
  }, []);
  useEffect(() => {
    const fetchCVD = async () => {
      try {
        const url = "https://api.binance.com/api/v3/trades?symbol=SOLUSDT&limit=1000";
        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const trades = await res.json();
        let cumulative = 0;
        trades.forEach((trade) => {
          const qty = parseFloat(trade.qty);
          cumulative += trade.isBuyerMaker ? qty : -qty;
        });
        console.log("CVD =", cumulative.toFixed(4));
        setCvd(cumulative);
      } catch (err) {
        console.error("CVD fetch 실패:", err);
      }
    };
    fetchCVD();
    const interval = setInterval(fetchCVD, 6e4);
    return () => clearInterval(interval);
  }, []);
  useEffect(() => {
    if (sessionStorage.getItem("adminEmail") == null) {
      window.location.href = "/admin_login_check";
      return;
    }
    const checkScreenSize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) {
        setIsSidebarOpen(true);
      } else {
        setIsSidebarOpen(false);
      }
    };
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);
  const handleOverlayClick = () => {
    if (isMobile) {
      setIsSidebarOpen(false);
    }
  };
  const [membersData, setMembersData] = useState([]);
  useEffect(() => {
    fetch("https://tradinggear.co.kr:8081/tradinggear/members_data.php").then((res) => {
      if (!res.ok) throw new Error("네트워크 오류");
      return res.json();
    }).then((data) => {
      setMembersData(data);
    }).catch((err) => {
      console.error("데이터 가져오기 실패:", err);
    });
    setemail(String(sessionStorage.getItem("adminEmail")));
    setnickName(String(sessionStorage.getItem("adminNickName")));
  }, []);
  useRef(null);
  useRef(null);
  const filteredMembers = membersData.filter((member) => {
    if (!searchTerm) return true;
    switch (searchType) {
      case "이메일":
        return member.id_email.toLowerCase().includes(searchTerm.toLowerCase());
      case "회원명":
        return member.full_name.toLowerCase().includes(searchTerm.toLowerCase());
      case "닉네임":
        return member.nick_name.includes(searchTerm);
      default:
        return true;
    }
  });
  React__default.useMemo(() => {
    let sortableMembers = [...filteredMembers];
    if (sortConfig.key !== null) {
      sortableMembers.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableMembers;
  }, [filteredMembers, sortConfig]);
  const requestSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };
  const getSortIcon = (columnName) => {
    if (sortConfig.key !== columnName) {
      return /* @__PURE__ */ jsx(ArrowUpDown, { className: "w-4 h-4 ml-1 opacity-50" });
    }
    return sortConfig.direction === "ascending" ? /* @__PURE__ */ jsx(ChevronUp, { className: "w-4 h-4 ml-1" }) : /* @__PURE__ */ jsx(ChevronDown, { className: "w-4 h-4 ml-1" });
  };
  const themeClasses = {
    bg: isDarkMode ? "bg-gray-900" : "bg-gray-50",
    text: isDarkMode ? "text-white" : "text-gray-900",
    textSecondary: isDarkMode ? "text-gray-300" : "text-gray-600",
    tableRow: isDarkMode ? "border-gray-700 hover:bg-gray-750" : "border-gray-200 hover:bg-gray-50",
    tableHeader: isDarkMode ? "bg-gray-750" : "bg-gray-50"
  };
  return /* @__PURE__ */ jsxs("div", { className: `min-h-screen ${themeClasses.bg}`, children: [
    isMobile && isSidebarOpen && /* @__PURE__ */ jsx(
      "div",
      {
        className: "fixed inset-0 bg-black bg-opacity-60 z-40",
        onClick: handleOverlayClick
      }
    ),
    /* @__PURE__ */ jsx(AdminSidebar, {}),
    /* @__PURE__ */ jsxs("div", { className: `
        transition-all duration-300 ease-in-out
        ${!isMobile && isSidebarOpen ? "ml-64" : "ml-0"}
      `, children: [
      /* @__PURE__ */ jsx(Header$1, { title: "바이낸스오더북" }),
      /* @__PURE__ */ jsxs("main", { className: "p-6", children: [
        /* @__PURE__ */ jsx("div", { className: "flex items-center justify-between mb-6", children: /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx("h2", { className: `text-2xl font-bold ${themeClasses.text} mb-2`, children: "바이낸스(SOLUSDT) 오더북 관리" }) }) }),
        /* @__PURE__ */ jsxs("h1", { style: { color: "white" }, children: [
          "CVD: ",
          cvd.toFixed(4)
        ] }),
        priceSum - priceSum2 > 0 ? /* @__PURE__ */ jsxs("div", { className: "flex items-center", style: { color: "white" }, children: [
          "매수세가 강합니다.",
          (priceSum - priceSum2).toFixed(2)
        ] }) : /* @__PURE__ */ jsxs("div", { className: "flex items-center", style: { color: "white" }, children: [
          "매도세가 강합니다.",
          (priceSum - priceSum2).toFixed(2)
        ] }),
        /* @__PURE__ */ jsx("div", { className: `rounded-lg overflow-hidden`, children: /* @__PURE__ */ jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxs("table", { className: "w-auto", children: [
          /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { className: `border-b ${isDarkMode ? "border-gray-700" : "border-gray-200"} ${themeClasses.tableHeader}`, children: [
            /* @__PURE__ */ jsx(
              "th",
              {
                className: `text-left py-4 px-6 font-semibold ${themeClasses.textSecondary} cursor-pointer hover:bg-opacity-80 transition-colors`,
                onClick: () => requestSort("email"),
                children: /* @__PURE__ */ jsxs("div", { className: "flex items-center", style: { color: "blue" }, children: [
                  "PRICE(BIDS)",
                  getSortIcon("email")
                ] })
              }
            ),
            /* @__PURE__ */ jsx(
              "th",
              {
                className: `text-left py-4 px-6 font-semibold text-center ${themeClasses.textSecondary} cursor-pointer hover:bg-opacity-80 transition-colors`,
                onClick: () => requestSort("name"),
                children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center", style: { color: "blue" }, children: [
                  "SIZE",
                  getSortIcon("full_name")
                ] })
              }
            )
          ] }) }),
          /* @__PURE__ */ jsx("tbody", { children: bids.map(([price, qty], index) => /* @__PURE__ */ jsxs("tr", { className: `border-b ${themeClasses.tableRow} transition-colors duration-200`, children: [
            /* @__PURE__ */ jsx("td", { className: `py-4 px-6 ${themeClasses.textSecondary}`, style: { backgroundColor: qty > 100 ? "gray" : "" }, children: price }),
            /* @__PURE__ */ jsx("td", { className: `py-4 px-6 text-center ${themeClasses.text} font-medium`, style: { backgroundColor: qty > 100 ? "gray" : "" }, children: qty })
          ] }, price)) })
        ] }) }) }),
        /* @__PURE__ */ jsx("div", { className: `rounded-lg overflow-hidden`, children: /* @__PURE__ */ jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxs("table", { className: "w-auto", children: [
          /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { className: `border-b ${isDarkMode ? "border-gray-700" : "border-gray-200"} ${themeClasses.tableHeader}`, children: [
            /* @__PURE__ */ jsx(
              "th",
              {
                className: `text-left py-4 px-6 font-semibold ${themeClasses.textSecondary} cursor-pointer hover:bg-opacity-80 transition-colors`,
                onClick: () => requestSort("email"),
                children: /* @__PURE__ */ jsxs("div", { className: "flex items-center", style: { color: "green" }, children: [
                  "PRICE(ASKS)",
                  getSortIcon("email")
                ] })
              }
            ),
            /* @__PURE__ */ jsx(
              "th",
              {
                className: `text-left py-4 px-6 font-semibold text-center ${themeClasses.textSecondary} cursor-pointer hover:bg-opacity-80 transition-colors`,
                onClick: () => requestSort("name"),
                children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center", style: { color: "green" }, children: [
                  "SIZE",
                  getSortIcon("full_name")
                ] })
              }
            )
          ] }) }),
          /* @__PURE__ */ jsx("tbody", { children: asks.map(([price, qty], index) => /* @__PURE__ */ jsxs("tr", { className: `border-b ${themeClasses.tableRow} transition-colors duration-200`, children: [
            /* @__PURE__ */ jsx("td", { className: `py-4 px-6 ${themeClasses.textSecondary}`, style: { backgroundColor: qty > 100 ? "gray" : "" }, children: price }),
            /* @__PURE__ */ jsx("td", { className: `py-4 px-6 text-center ${themeClasses.text} font-medium`, style: { backgroundColor: qty > 100 ? "gray" : "" }, children: qty })
          ] }, price)) })
        ] }) }) })
      ] })
    ] })
  ] });
};
const route1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: AdminDashboard$3
}, Symbol.toStringTag, { value: "Module" }));
async function fn_kt00015(token, data, cont_yn = "N", next_key = "") {
  const host = "https://api.kiwoom.com";
  const endpoint = "/api/dostk/acnt";
  const url = host + endpoint;
  const headers = {
    "Content-Type": "application/json;charset=UTF-8",
    // 컨텐츠 타입
    "authorization": `Bearer ${token}`,
    // 접근 토큰
    "cont-yn": cont_yn,
    // 연속 조회 여부
    "next-key": next_key,
    // 연속 조회 키
    "api-id": "kt00015"
    // TR명
  };
  try {
    const response = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify(data)
    });
    const responseHeaders = {
      "next-key": response.headers.get("next-key"),
      "cont-yn": response.headers.get("cont-yn"),
      "api-id": response.headers.get("api-id")
    };
    console.log("code :", response.status);
    console.log("header :", JSON.stringify(responseHeaders, null, 4));
    const responseBody = await response.json();
    console.log("body :", JSON.stringify(responseBody, null, 4));
    return JSON.stringify(responseBody, null, 4);
  } catch (error) {
    console.error("요청 실패:", error);
    return "요청 실패:" + error;
  }
}
const loader$8 = async () => {
  const email = "lovedisket@naver.com";
  const form = new URLSearchParams();
  form.append("email", email);
  const res = await fetch("https://tradinggear.co.kr:8081/tradinggear/member_inform_get.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: form.toString()
  });
  const userInfo = await res.json();
  const tokenRes = await fetch("https://api.kiwoom.com/oauth2/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      grant_type: "client_credentials",
      appkey: userInfo[0]["decrypted_api_key"],
      secretkey: userInfo[0]["decrypted_api_secret"]
    })
  });
  const tokenJson = await tokenRes.json();
  const accessToken = tokenJson.token;
  const MY_ACCESS_TOKEN = accessToken;
  const params = {
    "strt_dt": "20250101",
    // 시작일자 
    "end_dt": "20250728",
    // 종료일자 
    "tp": "3",
    // 구분 0:전체,1:입출금,2:입출고,3:매매,4:매수,5:매도,6:입금,7:출금,A:예탁담보대출입금,B:매도담보대출입금,C:현금상환(융자,담보상환),F:환전,M:입출금+환전,G:외화매수,H:외화매도,I:환전정산입금,J:환전정산출금
    "stk_cd": "",
    // 종목코드 
    "crnc_cd": "",
    // 통화코드 
    "gds_tp": "0",
    // 상품구분 0:전체, 1:국내주식, 2:수익증권, 3:해외주식, 4:금융상품
    "frgn_stex_code": "",
    // 해외거래소코드 
    "dmst_stex_tp": "%"
    // 국내거래소구분 %:(전체),KRX:한국거래소,NXT:넥스트트레이드
  };
  const returnValue = await fn_kt00015(MY_ACCESS_TOKEN, params);
  return returnValue;
};
const route2 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  loader: loader$8
}, Symbol.toStringTag, { value: "Module" }));
async function fn_kt00005(token, data, cont_yn = "N", next_key = "") {
  const host = "https://api.kiwoom.com";
  const endpoint = "/api/dostk/acnt";
  const url = host + endpoint;
  const headers = {
    "Content-Type": "application/json;charset=UTF-8",
    // 컨텐츠 타입
    "authorization": `Bearer ${token}`,
    // 접근 토큰
    "cont-yn": "N",
    // 연속 조회 여부
    "next-key": "N",
    // 연속 조회 키
    "api-id": "kt00005"
    // TR명
  };
  try {
    const response = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify(data)
    });
    const responseHeaders = {
      "next-key": response.headers.get("next-key"),
      "cont-yn": response.headers.get("cont-yn"),
      "api-id": response.headers.get("api-id")
    };
    console.log("code :", response.status);
    console.log("header :", JSON.stringify(responseHeaders, null, 4));
    const responseBody = await response.json();
    console.log("body :", JSON.stringify(responseBody.stk_cntr_remn, null, 4));
    return JSON.stringify(responseBody.stk_cntr_remn, null, 4);
  } catch (error) {
    console.error("요청 실패:", error);
    return "요청 실패:" + error;
  }
}
const action$h = async ({ request }) => {
  const { email } = await request.json();
  const form = new URLSearchParams();
  form.append("email", email);
  const res = await fetch("https://tradinggear.co.kr:8081/tradinggear/member_inform_get.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: form.toString()
  });
  const userInfo = await res.json();
  const tokenRes = await fetch("https://api.kiwoom.com/oauth2/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      grant_type: "client_credentials",
      appkey: userInfo[0]["decrypted_api_key"],
      secretkey: userInfo[0]["decrypted_api_secret"]
    })
  });
  const tokenJson = await tokenRes.json();
  const accessToken = tokenJson.token;
  const MY_ACCESS_TOKEN = accessToken;
  const params = {
    "dmst_stex_tp": "KRX"
  };
  const returnValue = await fn_kt00005(MY_ACCESS_TOKEN, params);
  return returnValue;
};
const route3 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$h
}, Symbol.toStringTag, { value: "Module" }));
const TradingGearSignalChart = () => {
  const [series, setSeries] = useState([]);
  const [annotations, setAnnotations] = useState({});
  const [Chart2, setChart] = useState(null);
  const handleClick = () => {
    window.location.href = "/admin/member";
  };
  const handleClick2 = () => {
    window.location.href = "/admin/binance_order_book";
  };
  const handleClick3 = () => {
    window.location.href = "http://210.114.22.48:8050/app/app_ws/";
  };
  useEffect(() => {
    if (sessionStorage.getItem("adminEmail") == null) {
      window.location.href = "/admin_login_check";
      return;
    }
    if (typeof window !== "undefined") {
      import("react-apexcharts").then((mod) => {
        setChart(() => mod.default);
      });
    }
  }, []);
  const fetchData = async () => {
    const res = await axios.get("https://tradinggear.co.kr:777/api/visual_signals_full_v2");
    const data = res.data;
    const prices = data.order_blocks.map((ob, idx) => ({
      x: new Date(data.timestamp).getTime() + idx * 1e3 * 60 * 30,
      y: [ob.bottom, ob.top, ob.top, ob.bottom]
    }));
    const currentPriceLine = {
      y: data.current_price,
      borderColor: "#FF0000",
      label: { text: `현재가: ${data.current_price}`, style: { color: "#fff", background: "#FF0000" } }
    };
    const vwapLine = {
      y: data.vwap,
      borderColor: "#008FFB",
      label: { text: `VWAP: ${data.vwap}`, style: { color: "#fff", background: "#008FFB" } }
    };
    const signalMarkers = data.signals.map((sig, idx) => ({
      x: new Date(data.timestamp).getTime() + idx * 1e3 * 60 * 30,
      marker: {
        size: 6,
        fillColor: sig.type === "LONG" ? "#00E396" : "#FF4560",
        strokeColor: "#000",
        shape: "circle"
      },
      label: {
        text: sig.type,
        style: { color: "#fff", background: sig.type === "LONG" ? "#00E396" : "#FF4560" }
      }
    }));
    setSeries([{ name: "OB Box", data: prices }]);
    setAnnotations({
      yaxis: [currentPriceLine, vwapLine],
      points: signalMarkers
    });
  };
  useEffect(() => {
    fetchData();
  }, []);
  const options = {
    chart: {
      id: "ob-signal-chart",
      type: "candlestick",
      height: 500,
      toolbar: { show: true }
    },
    title: { text: "TradingGear 자동매매 시그널 시각화", align: "left" },
    xaxis: { type: "datetime" },
    annotations
  };
  if (!Chart2) return /* @__PURE__ */ jsx("div", { children: "차트 로딩 중..." });
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("button", { onClick: handleClick, className: "\r\n    bg-blue-600 hover:bg-blue-700 text-white font-semibold\r\n    py-2 px-4 rounded-lg shadow-md transition-all\r\n    hover:scale-105 active:scale-95\r\n  ", children: "회원목록이동" }),
    "  ",
    /* @__PURE__ */ jsx("button", { onClick: handleClick2, className: "\r\n    bg-blue-600 hover:bg-blue-700 text-white font-semibold\r\n    py-2 px-4 rounded-lg shadow-md transition-all\r\n    hover:scale-105 active:scale-95\r\n  ", children: "호가창(오더북)이동" }),
    "  ",
    /* @__PURE__ */ jsx("button", { onClick: handleClick3, className: "\r\n    bg-blue-600 hover:bg-blue-700 text-white font-semibold\r\n    py-2 px-4 rounded-lg shadow-md transition-all\r\n    hover:scale-105 active:scale-95\r\n  ", children: "실시간전략그래프" }),
    /* @__PURE__ */ jsx(Chart2, { options, series, type: "candlestick", height: 500 })
  ] });
};
const route4 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: TradingGearSignalChart
}, Symbol.toStringTag, { value: "Module" }));
const loader$7 = async () => {
  const email = "lovedisket@naver.com";
  const form = new URLSearchParams();
  form.append("email", email);
  const res = await fetch("https://tradinggear.co.kr:8081/tradinggear/member_inform_get.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: form.toString()
  });
  const userInfo = await res.json();
  const tokenRes = await fetch("https://api.kiwoom.com/oauth2/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      grant_type: "client_credentials",
      appkey: userInfo[0]["decrypted_api_key"],
      secretkey: userInfo[0]["decrypted_api_secret"]
    })
  });
  const tokenJson = await tokenRes.json();
  const accessToken = tokenJson.token;
  const today = /* @__PURE__ */ new Date();
  const yyyyMMdd = today.toISOString().slice(0, 10).replace(/-/g, "");
  const holdingsRes = await fetch("https://api.kiwoom.com/api/dostk/acnt", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${accessToken}`,
      "api-id": "kt00016",
      "cont_yn": "N",
      "next_key": "",
      "fr_dt": yyyyMMdd,
      "to_dt": yyyyMMdd
    },
    body: JSON.stringify({
      stex_tp: "KRX",
      "fr_dt": yyyyMMdd,
      "to_dt": yyyyMMdd,
      "cont_yn": "N",
      "next_key": ""
    })
  });
  const holdingsJson = await holdingsRes.json();
  const oneWeekLater = new Date(today);
  oneWeekLater.setDate(today.getDate() + 7);
  const oneWeekLater2 = oneWeekLater.toISOString().slice(0, 10).replace(/-/g, "");
  const holdingsRes2 = await fetch("https://api.kiwoom.com/api/dostk/acnt", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${accessToken}`,
      "api-id": "kt00016",
      "cont_yn": "N",
      "next_key": "",
      "fr_dt": oneWeekLater2,
      "to_dt": oneWeekLater2
    },
    body: JSON.stringify({
      stex_tp: "KRX",
      "fr_dt": oneWeekLater2,
      "to_dt": oneWeekLater2,
      "cont_yn": "N",
      "next_key": ""
    })
  });
  const holdingsJson2 = await holdingsRes2.json();
  const oneMonthLater = new Date(today);
  oneMonthLater.setMonth(today.getMonth() + 1);
  const oneMonthLater2 = oneMonthLater.toISOString().slice(0, 10).replace(/-/g, "");
  const holdingsRes3 = await fetch("https://api.kiwoom.com/api/dostk/acnt", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${accessToken}`,
      "api-id": "kt00016",
      "cont_yn": "N",
      "next_key": "",
      "fr_dt": oneMonthLater2,
      "to_dt": oneMonthLater2
    },
    body: JSON.stringify({
      stex_tp: "KRX",
      "fr_dt": oneMonthLater2,
      "to_dt": oneMonthLater2,
      "cont_yn": "N",
      "next_key": ""
    })
  });
  const holdingsJson3 = await holdingsRes3.json();
  return json({ "rateOfReturnToday": holdingsJson, "rateOfReturn7day": holdingsJson2, "rateOfReturn1month": holdingsJson3 });
};
const route5 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  loader: loader$7
}, Symbol.toStringTag, { value: "Module" }));
function cn(...inputs) {
  return twMerge(clsx(inputs));
}
const Select = SelectPrimitive.Root;
const SelectGroup = SelectPrimitive.Group;
const SelectValue = SelectPrimitive.Value;
const SelectTrigger = React.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxs(
  SelectPrimitive.Trigger,
  {
    ref,
    className: cn(
      "flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background data-[placeholder]:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1",
      className
    ),
    ...props,
    children: [
      children,
      /* @__PURE__ */ jsx(SelectPrimitive.Icon, { asChild: true, children: /* @__PURE__ */ jsx(ChevronDown, { className: "h-4 w-4 opacity-50" }) })
    ]
  }
));
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName;
const SelectScrollUpButton = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  SelectPrimitive.ScrollUpButton,
  {
    ref,
    className: cn(
      "flex cursor-default items-center justify-center py-1",
      className
    ),
    ...props,
    children: /* @__PURE__ */ jsx(ChevronUp, { className: "h-4 w-4" })
  }
));
SelectScrollUpButton.displayName = SelectPrimitive.ScrollUpButton.displayName;
const SelectScrollDownButton = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  SelectPrimitive.ScrollDownButton,
  {
    ref,
    className: cn(
      "flex cursor-default items-center justify-center py-1",
      className
    ),
    ...props,
    children: /* @__PURE__ */ jsx(ChevronDown, { className: "h-4 w-4" })
  }
));
SelectScrollDownButton.displayName = SelectPrimitive.ScrollDownButton.displayName;
const SelectContent = React.forwardRef(({ className, children, position = "popper", ...props }, ref) => /* @__PURE__ */ jsx(SelectPrimitive.Portal, { children: /* @__PURE__ */ jsxs(
  SelectPrimitive.Content,
  {
    ref,
    className: cn(
      "relative z-50 max-h-[--radix-select-content-available-height] min-w-[8rem] overflow-y-auto overflow-x-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-[--radix-select-content-transform-origin]",
      position === "popper" && "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
      className
    ),
    position,
    ...props,
    children: [
      /* @__PURE__ */ jsx(SelectScrollUpButton, {}),
      /* @__PURE__ */ jsx(
        SelectPrimitive.Viewport,
        {
          className: cn(
            "p-1",
            position === "popper" && "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]"
          ),
          children
        }
      ),
      /* @__PURE__ */ jsx(SelectScrollDownButton, {})
    ]
  }
) }));
SelectContent.displayName = SelectPrimitive.Content.displayName;
const SelectLabel = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  SelectPrimitive.Label,
  {
    ref,
    className: cn("px-2 py-1.5 text-sm font-semibold", className),
    ...props
  }
));
SelectLabel.displayName = SelectPrimitive.Label.displayName;
const SelectItem = React.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxs(
  SelectPrimitive.Item,
  {
    ref,
    className: cn(
      "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    ),
    ...props,
    children: [
      /* @__PURE__ */ jsx("span", { className: "absolute right-2 flex h-3.5 w-3.5 items-center justify-center", children: /* @__PURE__ */ jsx(SelectPrimitive.ItemIndicator, { children: /* @__PURE__ */ jsx(Check, { className: "h-4 w-4" }) }) }),
      /* @__PURE__ */ jsx(SelectPrimitive.ItemText, { children })
    ]
  }
));
SelectItem.displayName = SelectPrimitive.Item.displayName;
const SelectSeparator = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  SelectPrimitive.Separator,
  {
    ref,
    className: cn("-mx-1 my-1 h-px bg-muted", className),
    ...props
  }
));
SelectSeparator.displayName = SelectPrimitive.Separator.displayName;
const Input = React.forwardRef(
  ({ className, type, ...props }, ref) => {
    return /* @__PURE__ */ jsx(
      "input",
      {
        type,
        className: cn(
          "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className
        ),
        ref,
        ...props
      }
    );
  }
);
Input.displayName = "Input";
const labelVariants = cva(
  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
);
const Label = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  LabelPrimitive.Root,
  {
    ref,
    className: cn(labelVariants(), className),
    ...props
  }
));
Label.displayName = LabelPrimitive.Root.displayName;
const StrategyList$3 = () => {
  const { isSidebarOpen, isMobile, setIsMobile, closeSidebarOnMobile } = useSidebarStore();
  const [searchType, setSearchType] = useState("전략명");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending"
  });
  const navigate = useNavigate();
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
  const handleOverlayClick = () => {
    closeSidebarOnMobile();
  };
  const [strategiesData] = useState([
    {
      id: 1001,
      strategyName: "전략 A",
      userId: "user123",
      strategyType: "단타",
      period: "5분",
      interval: "5분",
      status: "활성",
      detail: "보기"
    },
    {
      id: 1002,
      strategyName: "전략 B",
      userId: "user123",
      strategyType: "스윙",
      period: "1시간",
      interval: "1시간",
      status: "활성",
      detail: "보기"
    },
    {
      id: 1003,
      strategyName: "전략 C",
      userId: "example",
      strategyType: "스윙",
      period: "1일",
      interval: "일봉",
      status: "비활성",
      detail: "보기"
    },
    {
      id: 1004,
      strategyName: "전략 A",
      userId: "email@email",
      strategyType: "SOLUSDT",
      period: "1시간",
      interval: "1-21일",
      status: "활성",
      detail: "보기"
    },
    {
      id: 1005,
      strategyName: "전략 B",
      userId: "user152",
      strategyType: "삼성전자",
      period: "1일봉",
      interval: "1일봉",
      status: "활성",
      detail: "보기"
    },
    {
      id: 1006,
      strategyName: "전략 C",
      userId: "email.com",
      strategyType: "삼성전자",
      period: "1시간",
      interval: "21-45",
      status: "비활성",
      detail: "보기"
    },
    {
      id: 1007,
      strategyName: "전략 D",
      userId: "user123",
      strategyType: "5분",
      period: "1일봉",
      interval: "5-3개",
      status: "비활성",
      detail: "보기"
    },
    {
      id: 1008,
      strategyName: "전략 E",
      userId: "example",
      strategyType: "일봉",
      period: "월캔들",
      interval: "15/25",
      status: "종료대기",
      detail: "보기"
    },
    {
      id: 1009,
      strategyName: "삼성 A",
      userId: "SOLUSDT",
      strategyType: "일봉",
      period: "월캔들",
      interval: "1-1월일",
      status: "종료됨",
      detail: "보기"
    },
    {
      id: 1010,
      strategyName: "삼성 B",
      userId: "user123",
      strategyType: "월봉",
      period: "월캔들",
      interval: "일봉",
      status: "종료됨",
      detail: "보기"
    },
    {
      id: 1011,
      strategyName: "삼성 C",
      userId: "email.com",
      strategyType: "종일외과",
      period: "월캔들",
      interval: "39/65",
      status: "종료됨",
      detail: "단독"
    },
    {
      id: 1012,
      strategyName: "삼성 D",
      userId: "user123",
      strategyType: "물건일",
      period: "월캔들",
      interval: "2월물",
      status: "종료됨",
      detail: "0"
    }
  ]);
  const filteredStrategies = strategiesData.filter((strategy) => {
    if (!searchTerm) return true;
    switch (searchType) {
      case "전략명":
        return strategy.strategyName.toLowerCase().includes(searchTerm.toLowerCase());
      case "사용자ID":
        return strategy.userId.toLowerCase().includes(searchTerm.toLowerCase());
      case "전략유형":
        return strategy.strategyType.toLowerCase().includes(searchTerm.toLowerCase());
      case "상태":
        return strategy.status.includes(searchTerm);
      default:
        return true;
    }
  });
  const sortedStrategies = React__default.useMemo(() => {
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
  const requestSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };
  const getSortIcon = (columnName) => {
    if (sortConfig.key !== columnName) {
      return /* @__PURE__ */ jsx(ArrowUpDown, { className: "w-4 h-4 ml-1 opacity-50" });
    }
    return sortConfig.direction === "ascending" ? /* @__PURE__ */ jsx(ChevronUp, { className: "w-4 h-4 ml-1" }) : /* @__PURE__ */ jsx(ChevronDown, { className: "w-4 h-4 ml-1" });
  };
  const getStatusBadge = (status) => {
    const styles = {
      활성: "bg-green-900/50 text-green-300 border-green-500",
      비활성: "bg-yellow-900/50 text-yellow-300 border-yellow-500",
      종료대기: "bg-orange-900/50 text-orange-300 border-orange-500",
      종료됨: "bg-red-900/50 text-red-300 border-red-500"
    };
    return /* @__PURE__ */ jsx(
      "span",
      {
        className: `px-3 py-1 rounded-full text-xs font-medium border ${styles[status] || "bg-gray-700 text-gray-300 border-gray-600"}`,
        children: status
      }
    );
  };
  const handleViewDetail = (strategyId) => {
    navigate(`/admin/strategy/view?id=${strategyId}`);
  };
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-gray-900", children: [
    isMobile && isSidebarOpen && /* @__PURE__ */ jsx(
      "div",
      {
        className: "fixed inset-0 bg-black bg-opacity-60 z-40",
        onClick: handleOverlayClick
      }
    ),
    /* @__PURE__ */ jsx(AdminSidebar, {}),
    /* @__PURE__ */ jsxs(
      "div",
      {
        className: `
        transition-all duration-300 ease-in-out
        ${!isMobile && isSidebarOpen ? "ml-64" : "ml-0"}
      `,
        children: [
          /* @__PURE__ */ jsx(Header$1, { title: "전략목록" }),
          /* @__PURE__ */ jsxs("main", { className: "p-6", children: [
            /* @__PURE__ */ jsx("div", { className: "flex items-center justify-between mb-6", children: /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold text-white mb-2", children: "전략 관리" }),
              /* @__PURE__ */ jsxs("p", { className: "text-gray-400", children: [
                "총 ",
                strategiesData.length,
                "개의 전략이 있습니다."
              ] })
            ] }) }),
            /* @__PURE__ */ jsx("div", { className: "bg-gray-800 border-gray-700 rounded-lg p-4 mb-6", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col md:flex-row gap-4", children: [
              /* @__PURE__ */ jsxs("div", { className: "md:w-2/12 w-full", children: [
                /* @__PURE__ */ jsx(Label, { className: "block text-sm font-medium text-gray-300 mb-2", children: "검색 항목" }),
                /* @__PURE__ */ jsxs(Select, { value: searchType, onValueChange: setSearchType, children: [
                  /* @__PURE__ */ jsx(SelectTrigger, { className: "w-full h-10 px-3 py-2 bg-gray-700 border-gray-600 text-white placeholder-gray-400 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent", children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "검색 항목" }) }),
                  /* @__PURE__ */ jsx(SelectContent, { children: /* @__PURE__ */ jsx(SelectGroup, { children: searchOptions.map((option) => /* @__PURE__ */ jsx(SelectItem, { value: option, children: option }, option)) }) })
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "md:w-10/12 w-full", children: [
                /* @__PURE__ */ jsx(Label, { className: "block text-sm font-medium text-gray-300 mb-2", children: "검색어" }),
                /* @__PURE__ */ jsxs("div", { className: "relative", children: [
                  /* @__PURE__ */ jsx(
                    Input,
                    {
                      type: "text",
                      placeholder: "검색어",
                      value: searchTerm,
                      onChange: (e) => setSearchTerm(e.target.value),
                      className: "flex-1 h-10 px-3 py-2 bg-gray-700 border-gray-600 text-white placeholder-gray-400 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    }
                  ),
                  /* @__PURE__ */ jsx(Search, { className: "w-4 h-4 absolute right-4 top-1/2 transform -translate-y-1/2 text-white" })
                ] })
              ] })
            ] }) }),
            /* @__PURE__ */ jsx("div", { className: "bg-gray-800 border-gray-700 rounded-lg overflow-hidden", children: /* @__PURE__ */ jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxs("table", { className: "w-full", children: [
              /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { className: "border-b border-gray-700 bg-gray-750", children: [
                /* @__PURE__ */ jsx(
                  "th",
                  {
                    className: "text-left py-4 px-6 font-semibold text-gray-300 cursor-pointer hover:bg-opacity-80 transition-colors",
                    onClick: () => requestSort("id"),
                    children: /* @__PURE__ */ jsxs("div", { className: "flex items-center", children: [
                      "전략 ID",
                      getSortIcon("id")
                    ] })
                  }
                ),
                /* @__PURE__ */ jsx(
                  "th",
                  {
                    className: "text-left py-4 px-6 font-semibold text-center text-gray-300 cursor-pointer hover:bg-opacity-80 transition-colors",
                    onClick: () => requestSort("strategyName"),
                    children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center", children: [
                      "전략명",
                      getSortIcon("strategyName")
                    ] })
                  }
                ),
                /* @__PURE__ */ jsx(
                  "th",
                  {
                    className: "text-left py-4 px-6 font-semibold text-center text-gray-300 cursor-pointer hover:bg-opacity-80 transition-colors",
                    onClick: () => requestSort("userId"),
                    children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center", children: [
                      "사용자 ID",
                      getSortIcon("userId")
                    ] })
                  }
                ),
                /* @__PURE__ */ jsx(
                  "th",
                  {
                    className: "text-left py-4 px-6 font-semibold text-center text-gray-300 cursor-pointer hover:bg-opacity-80 transition-colors",
                    onClick: () => requestSort("strategyType"),
                    children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center", children: [
                      "전략 유형",
                      getSortIcon("strategyType")
                    ] })
                  }
                ),
                /* @__PURE__ */ jsx(
                  "th",
                  {
                    className: "text-left py-4 px-6 font-semibold text-center text-gray-300 cursor-pointer hover:bg-opacity-80 transition-colors",
                    onClick: () => requestSort("period"),
                    children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center", children: [
                      "기간",
                      getSortIcon("period")
                    ] })
                  }
                ),
                /* @__PURE__ */ jsx(
                  "th",
                  {
                    className: "text-left py-4 px-6 font-semibold text-center text-gray-300 cursor-pointer hover:bg-opacity-80 transition-colors",
                    onClick: () => requestSort("interval"),
                    children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center", children: [
                      "시간별",
                      getSortIcon("interval")
                    ] })
                  }
                ),
                /* @__PURE__ */ jsx(
                  "th",
                  {
                    className: "text-left py-4 px-6 font-semibold text-center text-gray-300 cursor-pointer hover:bg-opacity-80 transition-colors",
                    onClick: () => requestSort("status"),
                    children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center", children: [
                      "상태별",
                      getSortIcon("status")
                    ] })
                  }
                ),
                /* @__PURE__ */ jsx("th", { className: "text-left py-4 px-6 font-semibold text-center justify-center text-gray-300", children: "상세" })
              ] }) }),
              /* @__PURE__ */ jsx("tbody", { children: sortedStrategies.map((strategy, index) => /* @__PURE__ */ jsxs(
                "tr",
                {
                  className: "border-b border-gray-700 hover:bg-gray-600 transition-colors duration-200 cursor-pointer",
                  onClick: () => handleViewDetail(strategy.id),
                  children: [
                    /* @__PURE__ */ jsx("td", { className: "py-4 px-6 text-gray-300", children: strategy.id }),
                    /* @__PURE__ */ jsx("td", { className: "py-4 px-6 text-center text-white font-medium", children: strategy.strategyName }),
                    /* @__PURE__ */ jsx("td", { className: "py-4 px-6 text-center text-gray-300", children: strategy.userId }),
                    /* @__PURE__ */ jsx("td", { className: "py-4 px-6 text-center text-gray-300", children: strategy.strategyType }),
                    /* @__PURE__ */ jsx("td", { className: "py-4 px-6 text-center text-gray-300", children: strategy.period }),
                    /* @__PURE__ */ jsx("td", { className: "py-4 px-6 text-center text-gray-300", children: strategy.interval }),
                    /* @__PURE__ */ jsx("td", { className: "py-4 px-6 text-center", children: getStatusBadge(strategy.status) }),
                    /* @__PURE__ */ jsx("td", { className: "py-4 px-6", children: /* @__PURE__ */ jsxs(
                      "div",
                      {
                        className: "flex items-center justify-center space-x-2",
                        onClick: (e) => e.stopPropagation(),
                        children: [
                          /* @__PURE__ */ jsx("button", { className: "p-2 rounded-lg transition-colors duration-200 text-green-400 hover:bg-green-900/20", children: /* @__PURE__ */ jsx(Edit, { className: "w-4 h-4" }) }),
                          /* @__PURE__ */ jsx("button", { className: "p-2 rounded-lg transition-colors duration-200 text-red-400 hover:bg-red-900/20", children: /* @__PURE__ */ jsx(Trash2, { className: "w-4 h-4" }) })
                        ]
                      }
                    ) })
                  ]
                },
                strategy.id
              )) })
            ] }) }) }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mt-6", children: [
              /* @__PURE__ */ jsxs("div", { className: "text-sm text-gray-400", children: [
                "총 ",
                sortedStrategies.length,
                "개 중 1-",
                sortedStrategies.length,
                "개 표시"
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-2", children: [
                /* @__PURE__ */ jsx(
                  "a",
                  {
                    href: "/admin/strategy/write",
                    className: "px-3 py-2 bg-gray-700 text-gray-300 hover:bg-gray-600 rounded-lg transition-colors duration-200 disabled:opacity-50",
                    children: "전략 등록"
                  }
                ),
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    className: "px-3 py-2 bg-gray-700 text-gray-300 hover:bg-gray-600 rounded-lg transition-colors duration-200 disabled:opacity-50",
                    disabled: true,
                    children: "이전"
                  }
                ),
                /* @__PURE__ */ jsx("button", { className: "px-3 py-2 text-white bg-blue-600 rounded-lg", children: "1" }),
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    className: "px-3 py-2 bg-gray-700 text-gray-300 hover:bg-gray-600 rounded-lg transition-colors duration-200 disabled:opacity-50",
                    disabled: true,
                    children: "다음"
                  }
                )
              ] })
            ] })
          ] })
        ]
      }
    )
  ] });
};
const route6 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: StrategyList$3
}, Symbol.toStringTag, { value: "Module" }));
const action$g = async ({ request }) => {
  const { email } = await request.json();
  const value = String(email);
  const form = new URLSearchParams();
  form.append("email", value ?? "");
  const res0 = await fetch("https://tradinggear.co.kr:8081/tradinggear/member_inform_get.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
      // ✅ JSON 형식 명시
    },
    body: form.toString()
  });
  const data1 = await res0.json();
  const API_KEY2 = data1[0]["decrypted_api_key"];
  const API_SECRET2 = data1[0]["decrypted_api_secret"];
  const url = new URL(request.url);
  const limit = url.searchParams.get("limit") || "20";
  const timestamp = Date.now();
  const query = `limit=${limit}&timestamp=${timestamp}`;
  const signature = crypto.createHmac("sha256", API_SECRET2).update(query).digest("hex");
  const apiUrl = `https://fapi.binance.com/fapi/v1/userTrades?${query}&signature=${signature}`;
  const res = await fetch(apiUrl, { headers: { "X-MBX-APIKEY": API_KEY2 } });
  const data = await res.json();
  if (!Array.isArray(data)) {
    throw new Response("Binance API 호출 실패", { status: 500 });
  }
  const trades = data.map((t) => {
    const qty = parseFloat(t.qty);
    const price = parseFloat(t.price);
    const quoteQty = parseFloat(t.quoteQty);
    const realizedPnl = parseFloat(t.realizedPnl);
    const roe = quoteQty > 0 ? realizedPnl / quoteQty * 100 : 0;
    return {
      id: t.id,
      orderId: t.orderId,
      symbol: t.symbol,
      qty,
      price,
      quoteQty,
      realizedPnl,
      roe: roe.toFixed(2),
      side: t.side || (t.buyer ? "BUY" : "SELL"),
      time: new Date(t.time).toLocaleString()
    };
  });
  return json(trades);
};
const route7 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$g
}, Symbol.toStringTag, { value: "Module" }));
let cachedSymbols = null;
let lastSymbolFetch = 0;
const action$f = async ({ request }) => {
  var _a, _b;
  const { email } = await request.json();
  const form = new URLSearchParams();
  form.append("email", email);
  const res0 = await fetch("https://tradinggear.co.kr:8081/tradinggear/member_inform_get.php", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: form.toString()
  });
  const data1 = await res0.json();
  const API_KEY2 = (_a = data1[0]) == null ? void 0 : _a.decrypted_api_key;
  const API_SECRET2 = (_b = data1[0]) == null ? void 0 : _b.decrypted_api_secret;
  if (!API_KEY2 || !API_SECRET2) {
    throw new Response("API 키를 가져오지 못했습니다.", { status: 500 });
  }
  const now = /* @__PURE__ */ new Date();
  const utc0 = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 0, 0, 0));
  const startTime = utc0.getTime();
  if (!cachedSymbols || Date.now() - lastSymbolFetch > 60 * 60 * 1e3) {
    const res = await fetch("https://fapi.binance.com/fapi/v1/exchangeInfo");
    if (res.ok) {
      const jsonData = await res.json();
      cachedSymbols = jsonData.symbols.map((s) => s.symbol).filter((s) => s.endsWith("USDT"));
      lastSymbolFetch = Date.now();
      console.log("✅ 심볼 목록 캐시 갱신:", cachedSymbols.length, "개");
    } else {
      cachedSymbols = ["BTCUSDT", "ETHUSDT"];
      console.warn("⚠️ exchangeInfo 실패 → 기본 심볼 사용");
    }
  }
  const allTrades = [];
  let totalCount = 0;
  for (const symbol of cachedSymbols) {
    const timestamp = Date.now();
    const query = `symbol=${symbol}&startTime=${startTime}&timestamp=${timestamp}`;
    const signature = crypto.createHmac("sha256", API_SECRET2).update(query).digest("hex");
    const url = `https://fapi.binance.com/fapi/v1/userTrades?${query}&signature=${signature}`;
    const res = await fetch(url, { headers: { "X-MBX-APIKEY": API_KEY2 } });
    if (res.status === 200) {
      const trades = await res.json();
      if (Array.isArray(trades) && trades.length > 0) {
        const todayTrades = trades.filter((t) => t.time >= startTime).map((t) => ({
          id: t.id,
          orderId: t.orderId,
          symbol: t.symbol,
          qty: parseFloat(t.qty),
          price: parseFloat(t.price),
          quoteQty: parseFloat(t.quoteQty),
          realizedPnl: parseFloat(t.realizedPnl),
          side: t.side || (t.buyer ? "BUY" : "SELL"),
          time: new Date(t.time).toLocaleString()
        }));
        if (todayTrades.length > 0) {
          allTrades.push(...todayTrades);
          totalCount += todayTrades.length;
        }
      }
    }
    await new Promise((r) => setTimeout(r, 100));
  }
  return json({
    count: totalCount,
    trades: allTrades
  });
};
const route8 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$f
}, Symbol.toStringTag, { value: "Module" }));
const API_KEY$3 = "LIkFuzX0IKLuaMSQ5dEpYj0eW1GuFoYXrzP1VT1hIrFmySBelp7W117FBzT9eDjj";
const API_SECRET$2 = "TlHQfa02MXtonmq4npFeDKkYOjxwLhJc7ZDzr8Q770iwRKNoKyXNk4o3evYRoWW0";
const loader$6 = async () => {
  const timestamp = Date.now();
  const queryString = `timestamp=${timestamp}`;
  const signature = crypto.createHmac("sha256", API_SECRET$2).update(queryString).digest("hex");
  const url = `https://api.binance.com/api/v3/account?${queryString}&signature=${signature}`;
  const res = await fetch(url, {
    headers: { "X-MBX-APIKEY": API_KEY$3 }
  });
  const data = await res.json();
  const balances = data.balances.filter(
    (b) => parseFloat(b.free) + parseFloat(b.locked) > 0
  );
  return json({ balances });
};
const route9 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  loader: loader$6
}, Symbol.toStringTag, { value: "Module" }));
const action$e = async ({ request }) => {
  const { email } = await request.json();
  const value = String(email);
  const form = new URLSearchParams();
  form.append("email", value ?? "");
  const res0 = await fetch("https://tradinggear.co.kr:8081/tradinggear/member_inform_get.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
      // ✅ JSON 형식 명시
    },
    body: form.toString()
  });
  const data1 = await res0.json();
  const API_KEY2 = data1[0]["decrypted_api_key"];
  const API_SECRET2 = data1[0]["decrypted_api_secret"];
  const timestamp = Date.now();
  const query = `timestamp=${timestamp}&omitZeroBalances=true`;
  const signature = crypto.createHmac("sha256", API_SECRET2).update(query).digest("hex");
  const url = `https://fapi.binance.com/fapi/v2/account?${query}&signature=${signature}`;
  const res = await fetch(url, {
    headers: {
      "X-MBX-APIKEY": API_KEY2
    }
  });
  const data = await res.json();
  const totalMarginBalance = data.totalMarginBalance;
  return json({ totalMarginBalance });
};
const route10 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$e
}, Symbol.toStringTag, { value: "Module" }));
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline: "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline"
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);
const Button = React.forwardRef(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return /* @__PURE__ */ jsx(
      Comp,
      {
        className: cn(buttonVariants({ variant, size, className })),
        ref,
        ...props
      }
    );
  }
);
Button.displayName = "Button";
const Switch = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  SwitchPrimitives.Root,
  {
    className: cn(
      "peer inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input",
      className
    ),
    ...props,
    ref,
    children: /* @__PURE__ */ jsx(
      SwitchPrimitives.Thumb,
      {
        className: cn(
          "pointer-events-none block h-4 w-4 rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0"
        )
      }
    )
  }
));
Switch.displayName = SwitchPrimitives.Root.displayName;
const StrategyRegister = () => {
  const { isSidebarOpen, isMobile, setIsMobile, closeSidebarOnMobile } = useSidebarStore();
  const navigate = useNavigate();
  useEffect(() => {
    const checkScreenSize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
    };
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, [setIsMobile]);
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
    platformSet: ""
  });
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
      platformSet: "바이낸스"
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
      platformSet: "바이낸스"
    }
  ]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending"
  });
  const handleOverlayClick = () => {
    closeSidebarOnMobile();
  };
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value
    }));
  };
  const handleSubmit = (e) => {
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
      createdAt: (/* @__PURE__ */ new Date()).toISOString().split("T")[0]
    };
    setStrategies((prev) => [newStrategy, ...prev]);
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
  const filteredStrategies = strategies.filter((strategy) => {
    if (!searchTerm) return true;
    return strategy.strategyName.toLowerCase().includes(searchTerm.toLowerCase()) || strategy.description.toLowerCase().includes(searchTerm.toLowerCase()) || strategy.tradingSymbol.toLowerCase().includes(searchTerm.toLowerCase());
  });
  React__default.useMemo(() => {
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
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-gray-900", children: [
    isMobile && isSidebarOpen && /* @__PURE__ */ jsx(
      "div",
      {
        className: "fixed inset-0 bg-black bg-opacity-60 z-40",
        onClick: handleOverlayClick
      }
    ),
    /* @__PURE__ */ jsx(AdminSidebar, {}),
    /* @__PURE__ */ jsxs(
      "div",
      {
        className: `
        transition-all duration-300 ease-in-out
        ${!isMobile && isSidebarOpen ? "ml-64" : "ml-0"}
      `,
        children: [
          /* @__PURE__ */ jsx(Header$1, { title: "전략등록" }),
          /* @__PURE__ */ jsxs("main", { className: "p-6", children: [
            /* @__PURE__ */ jsx("div", { className: "flex items-center justify-between mb-6", children: /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold text-white mb-2", children: "전략 등록" }),
              /* @__PURE__ */ jsx("p", { className: "text-gray-400", children: "새로운 트레이딩 전략을 등록하고 관리하세요." })
            ] }) }),
            /* @__PURE__ */ jsxs("div", { className: "bg-gray-800 border-gray-700 rounded-lg p-6 mb-8", children: [
              /* @__PURE__ */ jsx("h3", { className: "text-xl font-bold text-white mb-6", children: "관리자 등록페이지" }),
              /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "space-y-8", children: [
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("h4", { className: "text-lg font-semibold text-white mb-4", children: "1. 전략정보" }),
                  /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [
                    /* @__PURE__ */ jsxs("div", { children: [
                      /* @__PURE__ */ jsx(Label, { className: "block text-sm font-medium text-gray-300 mb-2", children: "전략이름" }),
                      /* @__PURE__ */ jsx(
                        Input,
                        {
                          type: "text",
                          placeholder: "추세추종",
                          value: formData.strategyName,
                          onChange: (e) => handleInputChange("strategyName", e.target.value),
                          className: "w-full h-10 px-3 py-2 bg-gray-700 border-gray-600 text-white placeholder-gray-400 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent",
                          required: true
                        }
                      )
                    ] }),
                    /* @__PURE__ */ jsxs("div", { children: [
                      /* @__PURE__ */ jsx(Label, { className: "block text-sm font-medium text-gray-300 mb-2", children: "전략설명" }),
                      /* @__PURE__ */ jsx(
                        Input,
                        {
                          type: "text",
                          placeholder: "전략개요",
                          value: formData.description,
                          onChange: (e) => handleInputChange("description", e.target.value),
                          className: "w-full h-10 px-3 py-2 bg-gray-700 border-gray-600 text-white placeholder-gray-400 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent",
                          required: true
                        }
                      )
                    ] }),
                    /* @__PURE__ */ jsxs("div", { children: [
                      /* @__PURE__ */ jsx(Label, { className: "block text-sm font-medium text-gray-300 mb-2", children: "거래종목" }),
                      /* @__PURE__ */ jsx(
                        Input,
                        {
                          type: "text",
                          placeholder: "삼성전자",
                          value: formData.tradingSymbol,
                          onChange: (e) => handleInputChange("tradingSymbol", e.target.value),
                          className: "w-full h-10 px-3 py-2 bg-gray-700 border-gray-600 text-white placeholder-gray-400 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent",
                          required: true
                        }
                      )
                    ] }),
                    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
                      /* @__PURE__ */ jsxs("div", { children: [
                        /* @__PURE__ */ jsx(Label, { className: "block text-sm font-medium text-gray-300 mb-2", children: "전략유형" }),
                        /* @__PURE__ */ jsxs(Select, { value: formData.strategyType, onValueChange: (value) => handleInputChange("strategyType", value), children: [
                          /* @__PURE__ */ jsx(SelectTrigger, { className: "w-full h-10 px-3 py-2 bg-gray-700 border-gray-600 text-white placeholder-gray-400 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent", children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "단타" }) }),
                          /* @__PURE__ */ jsx(SelectContent, { children: /* @__PURE__ */ jsxs(SelectGroup, { children: [
                            /* @__PURE__ */ jsx(SelectItem, { value: "단타", children: "단타" }),
                            /* @__PURE__ */ jsx(SelectItem, { value: "스윙", children: "스윙" }),
                            /* @__PURE__ */ jsx(SelectItem, { value: "장기", children: "장기" })
                          ] }) })
                        ] })
                      ] }),
                      /* @__PURE__ */ jsxs("div", { children: [
                        /* @__PURE__ */ jsx(Label, { className: "block text-sm font-medium text-gray-300 mb-2", children: "시간간격" }),
                        /* @__PURE__ */ jsxs(Select, { value: formData.timeFrame, onValueChange: (value) => handleInputChange("timeFrame", value), children: [
                          /* @__PURE__ */ jsx(SelectTrigger, { className: "w-full h-10 px-3 py-2 bg-gray-700 border-gray-600 text-white placeholder-gray-400 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent", children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "1분/5분/1시간" }) }),
                          /* @__PURE__ */ jsx(SelectContent, { children: /* @__PURE__ */ jsxs(SelectGroup, { children: [
                            /* @__PURE__ */ jsx(SelectItem, { value: "1분", children: "1분" }),
                            /* @__PURE__ */ jsx(SelectItem, { value: "5분", children: "5분" }),
                            /* @__PURE__ */ jsx(SelectItem, { value: "15분", children: "15분" }),
                            /* @__PURE__ */ jsx(SelectItem, { value: "30분", children: "30분" }),
                            /* @__PURE__ */ jsx(SelectItem, { value: "1시간", children: "1시간" }),
                            /* @__PURE__ */ jsx(SelectItem, { value: "4시간", children: "4시간" }),
                            /* @__PURE__ */ jsx(SelectItem, { value: "1일", children: "1일" })
                          ] }) })
                        ] })
                      ] })
                    ] }),
                    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
                      /* @__PURE__ */ jsxs("div", { children: [
                        /* @__PURE__ */ jsx(Label, { className: "block text-sm font-medium text-gray-300 mb-2", children: "타임프레임" }),
                        /* @__PURE__ */ jsxs(Select, { value: formData.candleType, onValueChange: (value) => handleInputChange("candleType", value), children: [
                          /* @__PURE__ */ jsx(SelectTrigger, { className: "w-full h-10 px-3 py-2 bg-gray-700 border-gray-600 text-white placeholder-gray-400 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent", children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "1분" }) }),
                          /* @__PURE__ */ jsx(SelectContent, { children: /* @__PURE__ */ jsxs(SelectGroup, { children: [
                            /* @__PURE__ */ jsx(SelectItem, { value: "1분", children: "1분" }),
                            /* @__PURE__ */ jsx(SelectItem, { value: "5분", children: "5분" }),
                            /* @__PURE__ */ jsx(SelectItem, { value: "15분", children: "15분" }),
                            /* @__PURE__ */ jsx(SelectItem, { value: "30분", children: "30분" }),
                            /* @__PURE__ */ jsx(SelectItem, { value: "1시간", children: "1시간" })
                          ] }) })
                        ] })
                      ] }),
                      /* @__PURE__ */ jsxs("div", { children: [
                        /* @__PURE__ */ jsx(Label, { className: "block text-sm font-medium text-gray-300 mb-2", children: "활성상태" }),
                        /* @__PURE__ */ jsxs(Select, { value: formData.isActive ? "활성" : "비활성", onValueChange: (value) => handleInputChange("isActive", value === "활성"), children: [
                          /* @__PURE__ */ jsx(SelectTrigger, { className: "w-full h-10 px-3 py-2 bg-gray-700 border-gray-600 text-white placeholder-gray-400 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent", children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "활성" }) }),
                          /* @__PURE__ */ jsx(SelectContent, { children: /* @__PURE__ */ jsxs(SelectGroup, { children: [
                            /* @__PURE__ */ jsx(SelectItem, { value: "활성", children: "활성" }),
                            /* @__PURE__ */ jsx(SelectItem, { value: "비활성", children: "비활성" })
                          ] }) })
                        ] })
                      ] })
                    ] })
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("h4", { className: "text-lg font-semibold text-white mb-4", children: "2. 전략실행설정" }),
                  /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [
                    /* @__PURE__ */ jsxs("div", { children: [
                      /* @__PURE__ */ jsx(Label, { className: "block text-sm font-medium text-gray-300 mb-2", children: "매매플래폼" }),
                      /* @__PURE__ */ jsxs(Select, { value: formData.platformSet, onValueChange: (value) => handleInputChange("platformSet", value), children: [
                        /* @__PURE__ */ jsx(SelectTrigger, { className: "w-full h-10 px-3 py-2 bg-gray-700 border-gray-600 text-white placeholder-gray-400 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent", children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "바이낸스" }) }),
                        /* @__PURE__ */ jsx(SelectContent, { children: /* @__PURE__ */ jsxs(SelectGroup, { children: [
                          /* @__PURE__ */ jsx(SelectItem, { value: "binance", children: "바이낸스" }),
                          /* @__PURE__ */ jsx(SelectItem, { value: "kium", children: "키움증권" })
                        ] }) })
                      ] })
                    ] }),
                    /* @__PURE__ */ jsxs("div", { children: [
                      /* @__PURE__ */ jsx(Label, { className: "block text-sm font-medium text-gray-300 mb-2", children: "API 키 등록 여부" }),
                      /* @__PURE__ */ jsx(Label, { className: "block text-sm font-medium text-gray-300 mb-2", style: { marginTop: "15px" }, children: "연결된 계정" })
                    ] }),
                    /* @__PURE__ */ jsxs("div", { children: [
                      /* @__PURE__ */ jsx(Label, { className: "block text-sm font-medium text-gray-300 mb-2", children: "전략실행시간대 제한" }),
                      /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-2", children: [
                        /* @__PURE__ */ jsxs(
                          Select,
                          {
                            value: formData.executionTime1,
                            onValueChange: (value) => handleInputChange("executionTime1", value),
                            children: [
                              /* @__PURE__ */ jsx(SelectTrigger, { className: "w-32 h-10 px-3 py-2 bg-gray-700 border-gray-600 text-white placeholder-gray-400 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent", children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "9시" }) }),
                              /* @__PURE__ */ jsx(SelectContent, { children: /* @__PURE__ */ jsx(SelectGroup, { children: Array.from({ length: 24 }, (_, i) => /* @__PURE__ */ jsxs(SelectItem, { value: (i + 1).toString(), children: [
                                i + 1,
                                "시"
                              ] }, i + 1)) }) })
                            ]
                          }
                        ),
                        /* @__PURE__ */ jsx(Label, { className: "text-sm font-medium text-gray-300", children: "~" }),
                        /* @__PURE__ */ jsxs(
                          Select,
                          {
                            value: formData.executionTime2,
                            onValueChange: (value) => handleInputChange("executionTime2", value),
                            children: [
                              /* @__PURE__ */ jsx(SelectTrigger, { className: "w-32 h-10 px-3 py-2 bg-gray-700 border-gray-600 text-white placeholder-gray-400 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent", children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "12시" }) }),
                              /* @__PURE__ */ jsx(SelectContent, { children: /* @__PURE__ */ jsx(SelectGroup, { children: Array.from({ length: 24 }, (_, i) => /* @__PURE__ */ jsxs(SelectItem, { value: (i + 1).toString(), children: [
                                i + 1,
                                "시"
                              ] }, i + 1)) }) })
                            ]
                          }
                        )
                      ] })
                    ] }),
                    /* @__PURE__ */ jsxs("div", { children: [
                      /* @__PURE__ */ jsx(Label, { className: "block text-sm font-medium text-gray-300 mb-2", children: "1일 최대 진입 횟수" }),
                      /* @__PURE__ */ jsx(
                        Input,
                        {
                          type: "number",
                          placeholder: "",
                          value: formData.maxTrades,
                          onChange: (e) => handleInputChange("maxTrades", e.target.value),
                          className: "w-full h-10 px-3 py-2 bg-gray-700 border-gray-600 text-white placeholder-gray-400 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        }
                      )
                    ] }),
                    /* @__PURE__ */ jsx("div", { className: "md:col-span-2", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
                      /* @__PURE__ */ jsxs("div", { children: [
                        /* @__PURE__ */ jsx(Label, { className: "text-sm font-medium text-gray-300", children: "알림 수신 여부" }),
                        /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-400", children: "진입, 청산시" })
                      ] }),
                      /* @__PURE__ */ jsx(
                        Switch,
                        {
                          checked: formData.profitAlert,
                          onCheckedChange: (checked) => handleInputChange("profitAlert", checked)
                        }
                      )
                    ] }) })
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "flex justify-center gap-2", children: [
                  /* @__PURE__ */ jsxs(
                    Button,
                    {
                      type: "button",
                      onClick: () => navigate("/admin/strategy"),
                      className: "px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200",
                      children: [
                        /* @__PURE__ */ jsx(List, { className: "w-4 h-4 mr-2" }),
                        "목록"
                      ]
                    }
                  ),
                  /* @__PURE__ */ jsxs(
                    Button,
                    {
                      type: "submit",
                      className: "px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200",
                      children: [
                        /* @__PURE__ */ jsx(Save, { className: "w-4 h-4 mr-2" }),
                        "전략 등록"
                      ]
                    }
                  )
                ] })
              ] })
            ] })
          ] })
        ]
      }
    )
  ] });
};
const route11 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: StrategyRegister
}, Symbol.toStringTag, { value: "Module" }));
const API_KEY$2 = "LIkFuzX0IKLuaMSQ5dEpYj0eW1GuFoYXrzP1VT1hIrFmySBelp7W117FBzT9eDjj";
const API_SECRET$1 = "TlHQfa02MXtonmq4npFeDKkYOjxwLhJc7ZDzr8Q770iwRKNoKyXNk4o3evYRoWW0";
const loader$5 = async () => {
  const baseUrl = "https://fapi.binance.com";
  const endpoint = "/fapi/v2/account";
  const timestamp = Date.now();
  const query = `timestamp=${timestamp}`;
  const signature = crypto.createHmac("sha256", API_SECRET$1).update(query).digest("hex");
  const url = `${baseUrl}${endpoint}?${query}&signature=${signature}`;
  const res = await fetch$1(url, {
    headers: { "X-MBX-APIKEY": API_KEY$2 }
  });
  const data = await res.json();
  const currentBalance = parseFloat(data.totalMarginBalance);
  const yesterdayBalance = 1200;
  const changePercent = (currentBalance - yesterdayBalance) / yesterdayBalance * 100;
  return new Response(
    JSON.stringify({
      currentBalance,
      yesterdayBalance,
      changePercent: parseFloat(changePercent.toFixed(2))
    }),
    { headers: { "Content-Type": "application/json" } }
  );
};
const route12 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  loader: loader$5
}, Symbol.toStringTag, { value: "Module" }));
const action$d = async ({ request }) => {
  const { email } = await request.json();
  const value = String(email);
  const form = new URLSearchParams();
  form.append("email", value ?? "");
  const res0 = await fetch("https://tradinggear.co.kr:8081/tradinggear/member_inform_get.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
      // ✅ JSON 형식 명시
    },
    body: form.toString()
  });
  const data1 = await res0.json();
  const API_KEY2 = data1[0]["decrypted_api_key"];
  const API_SECRET2 = data1[0]["decrypted_api_secret"];
  const timestamp = Date.now();
  const query = `timestamp=${timestamp}`;
  const signature = crypto.createHmac("sha256", API_SECRET2).update(query).digest("hex");
  const accountRes = await fetch(
    `https://fapi.binance.com/fapi/v2/account?${query}&signature=${signature}`,
    { headers: { "X-MBX-APIKEY": API_KEY2 } }
  );
  const accountData = await accountRes.json();
  if (!accountData.assets) {
    throw new Response("Binance Futures API 호출 실패", { status: 500 });
  }
  const balances = accountData.assets.filter(
    (a) => parseFloat(a.walletBalance) > 0 || parseFloat(a.unrealizedProfit) !== 0
  );
  let currentValue = 0;
  let previousValue = 0;
  const detailedBalances = [];
  for (const bal of balances) {
    const qty = parseFloat(bal.walletBalance);
    const unrealized = parseFloat(bal.unrealizedProfit);
    const asset = bal.asset;
    if (asset === "USDT") {
      const current = qty + unrealized;
      currentValue += current;
      previousValue += qty;
      detailedBalances.push({ asset, qty, current, previous: qty });
    } else {
      const symbol = `${asset}USDT`;
      try {
        const priceRes = await fetch(
          `https://api.binance.com/api/v3/ticker/price?symbol=${symbol}`
        );
        const priceData = await priceRes.json();
        const prevRes = await fetch(
          `https://api.binance.com/api/v3/ticker/24hr?symbol=${symbol}`
        );
        const prevData = await prevRes.json();
        if (!priceData.price || !prevData.prevClosePrice) continue;
        const currentPrice = parseFloat(priceData.price);
        const prevPrice = parseFloat(prevData.openPrice);
        const current = qty * currentPrice + unrealized;
        const previous = qty * prevPrice;
        currentValue += current;
        previousValue += previous;
        detailedBalances.push({ asset, qty, current, previous });
      } catch (e) {
        console.error(`시세 조회 실패: ${asset}`);
      }
    }
  }
  const changePercent = previousValue > 0 ? (currentValue - previousValue) / previousValue * 100 : 0;
  return json({
    totalCurrent: currentValue.toFixed(2),
    totalPrevious: previousValue.toFixed(2),
    changePercent: changePercent.toFixed(2),
    balances: detailedBalances
  });
};
const route13 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$d
}, Symbol.toStringTag, { value: "Module" }));
function getTodayStartTimestamp() {
  const now = /* @__PURE__ */ new Date();
  now.setUTCHours(0, 0, 0, 0);
  return now.getTime();
}
const action$c = async ({ request }) => {
  const { apiKey, apiSecret, isFutures = true } = await request.json();
  const timestamp = Date.now();
  const query = `timestamp=${timestamp}`;
  const signature = crypto.createHmac("sha256", apiSecret).update(query).digest("hex");
  const symbol = "BTCUSDT";
  const endpoint = isFutures ? `https://fapi.binance.com/fapi/v1/userTrades?symbol=${symbol}&${query}&signature=${signature}` : `https://api.binance.com/api/v3/myTrades?symbol=${symbol}&${query}&signature=${signature}`;
  const res = await fetch(endpoint, {
    headers: { "X-MBX-APIKEY": apiKey }
  });
  const trades = await res.json();
  if (!Array.isArray(trades)) {
    return json({ error: "거래 내역 조회 실패", trades }, { status: 500 });
  }
  const todayStart = getTodayStartTimestamp();
  const todayTrades = trades.filter((t) => t.time >= todayStart);
  return json({
    symbol,
    todayCount: todayTrades.length,
    todayTrades
  });
};
const route14 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$c
}, Symbol.toStringTag, { value: "Module" }));
const API_KEY$1 = "LIkFuzX0IKLuaMSQ5dEpYj0eW1GuFoYXrzP1VT1hIrFmySBelp7W117FBzT9eDjj";
const API_SECRET = "TlHQfa02MXtonmq4npFeDKkYOjxwLhJc7ZDzr8Q770iwRKNoKyXNk4o3evYRoWW0";
const loader$4 = async () => {
  const timestamp = Date.now();
  const query = `timestamp=${timestamp}&omitZeroBalances=true`;
  const signature = crypto.createHmac("sha256", API_SECRET).update(query).digest("hex");
  const url = `https://api.binance.com/api/v3/account?${query}&signature=${signature}`;
  const res = await fetch(url, {
    headers: {
      "X-MBX-APIKEY": API_KEY$1
    }
  });
  const data = await res.json();
  console.log(data);
  return json({ data });
};
const route15 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  loader: loader$4
}, Symbol.toStringTag, { value: "Module" }));
const sessionStorage$1 = createCookieSessionStorage({
  cookie: {
    name: "__session",
    secrets: ["6jdUh9gVrAHDI"],
    // .env에서 가져와도 좋음
    sameSite: "lax",
    path: "/",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production"
  }
});
const getSession = (request) => {
  return sessionStorage$1.getSession(request.headers.get("Cookie"));
};
const commitSession = (session) => {
  return sessionStorage$1.commitSession(session);
};
const loginIdCookie = createCookie("loginId", {
  path: "/",
  httpOnly: false,
  // ← 폼 자동완성용이면 false
  sameSite: "lax",
  secure: process.env.NODE_ENV === "production",
  maxAge: 60 * 60 * 24 * 30
  // 30일
  // 도메인 통일 필요시: domain: ".tradinggear.co.kr",
});
async function action$b({ request }) {
  const form = await request.formData();
  const email = String(form.get("email") || "").trim();
  const password = String(form.get("password") || "");
  if (!email || !password) return new Response("Invalid", { status: 400 });
  request.headers.get("Cookie");
  const session = await getSession(request);
  session.set("userId", "some-user-id");
  const headers = new Headers();
  headers.append("Set-Cookie", await commitSession(session));
  headers.append("Set-Cookie", await loginIdCookie.serialize(email));
}
const route16 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$b
}, Symbol.toStringTag, { value: "Module" }));
const StrategyDetail = () => {
  const { isSidebarOpen, isMobile, setIsMobile, closeSidebarOnMobile } = useSidebarStore();
  const navigate = useNavigate();
  const [strategyId, setStrategyId] = useState(null);
  const [strategyData, setStrategyData] = useState(null);
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get("id");
    if (id) {
      setStrategyId(parseInt(id));
      loadStrategyData(parseInt(id));
    }
  }, []);
  const loadStrategyData = (id) => {
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
          { name: "6월", profit: 3 }
        ],
        userCountData: [
          { name: "1", count: 350 },
          { name: "2", count: 280 },
          { name: "3", count: 180 },
          { name: "4", count: 80 },
          { name: "5", count: 40 }
        ],
        entryData: [
          { name: "첫째", value: 200 },
          { name: "둘째", value: 230 },
          { name: "셋째", value: 220 },
          { name: "넷째", value: 240 },
          { name: "다섯째", value: 250 },
          { name: "여섯째", value: 260 }
        ],
        failureData: [
          { name: "시세반등", value: 55, color: "#3B82F6" },
          { name: "벽 전치", value: 25, color: "#06B6D4" },
          { name: "API 오류 등", value: 20, color: "#10B981" }
        ]
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
          { name: "6월", profit: 5 }
        ],
        userCountData: [
          { name: "1", count: 420 },
          { name: "2", count: 350 },
          { name: "3", count: 220 },
          { name: "4", count: 120 },
          { name: "5", count: 60 }
        ],
        entryData: [
          { name: "첫째", value: 180 },
          { name: "둘째", value: 200 },
          { name: "셋째", value: 195 },
          { name: "넷째", value: 210 },
          { name: "다섯째", value: 225 },
          { name: "여섯째", value: 240 }
        ],
        failureData: [
          { name: "시세반등", value: 45, color: "#3B82F6" },
          { name: "벽 전치", value: 35, color: "#06B6D4" },
          { name: "API 오류 등", value: 20, color: "#10B981" }
        ]
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
          { name: "6월", profit: 0 }
        ],
        userCountData: [
          { name: "1", count: 150 },
          { name: "2", count: 120 },
          { name: "3", count: 80 },
          { name: "4", count: 40 },
          { name: "5", count: 20 }
        ],
        entryData: [
          { name: "첫째", value: 100 },
          { name: "둘째", value: 110 },
          { name: "셋째", value: 105 },
          { name: "넷째", value: 95 },
          { name: "다섯째", value: 90 },
          { name: "여섯째", value: 85 }
        ],
        failureData: [
          { name: "시세반등", value: 65, color: "#3B82F6" },
          { name: "벽 전치", value: 20, color: "#06B6D4" },
          { name: "API 오류 등", value: 15, color: "#10B981" }
        ]
      }
    };
    const data = allStrategiesData[id] || allStrategiesData[1001];
    setStrategyData(data);
  };
  useEffect(() => {
    const checkScreenSize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
    };
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, [setIsMobile]);
  const handleOverlayClick = () => {
    closeSidebarOnMobile();
  };
  const slippageData = [
    { name: "1월", value: 0.3 },
    { name: "2월", value: 0.35 },
    { name: "3월", value: 0.32 },
    { name: "4월", value: 0.4 },
    { name: "5월", value: 0.45 },
    { name: "6월", value: 0.43 }
  ];
  const entrySlippageData = [
    { name: "1월", value: 0.48 },
    { name: "2월", value: 0.45 },
    { name: "3월", value: 0.5 },
    { name: "4월", value: 0.52 },
    { name: "5월", value: 0.48 },
    { name: "6월", value: 0.5 }
  ];
  const handleGoBack = () => {
    navigate(-1);
  };
  if (!strategyData) {
    return /* @__PURE__ */ jsx("div", { className: "min-h-screen bg-gray-900 flex items-center justify-center", children: /* @__PURE__ */ jsx("div", { className: "text-white text-xl", children: "로딩 중..." }) });
  }
  const getStatusBadge = (status) => {
    const styles = {
      활성: "bg-green-900/50 text-green-300 border-green-500",
      비활성: "bg-yellow-900/50 text-yellow-300 border-yellow-500",
      종료대기: "bg-orange-900/50 text-orange-300 border-orange-500",
      종료됨: "bg-red-900/50 text-red-300 border-red-500"
    };
    return /* @__PURE__ */ jsx(
      "span",
      {
        className: `px-3 py-1 rounded-full text-xs font-medium border ${styles[status] || "bg-gray-700 text-gray-300 border-gray-600"}`,
        children: status
      }
    );
  };
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-gray-900", children: [
    isMobile && isSidebarOpen && /* @__PURE__ */ jsx(
      "div",
      {
        className: "fixed inset-0 bg-black bg-opacity-60 z-40",
        onClick: handleOverlayClick
      }
    ),
    /* @__PURE__ */ jsx(AdminSidebar, {}),
    /* @__PURE__ */ jsxs(
      "div",
      {
        className: `
        transition-all duration-300 ease-in-out
        ${!isMobile && isSidebarOpen ? "ml-64" : "ml-0"}
      `,
        children: [
          /* @__PURE__ */ jsx(Header$1, { title: "전략상세" }),
          /* @__PURE__ */ jsxs("main", { className: "p-6", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-6", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center", children: [
                /* @__PURE__ */ jsx(
                  Button,
                  {
                    onClick: handleGoBack,
                    className: "mr-4 p-2 rounded-lg bg-gray-700 text-gray-300 hover:bg-gray-600 transition-colors duration-200",
                    children: /* @__PURE__ */ jsx(ArrowLeft, { className: "w-5 h-5" })
                  }
                ),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold text-white mb-2", children: "전략 상세보기" }),
                  /* @__PURE__ */ jsxs("p", { className: "text-gray-400", children: [
                    "전략 ID: ",
                    strategyData.id,
                    " | ",
                    strategyData.name
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-4", children: [
                getStatusBadge(strategyData.status),
                /* @__PURE__ */ jsxs("div", { className: "text-right", children: [
                  /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-400", children: "마지막 업데이트" }),
                  /* @__PURE__ */ jsx("p", { className: "text-white font-medium", children: strategyData.createdAt })
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "bg-gray-800 rounded-lg p-6 mb-6", children: [
              /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold text-white mb-4", children: "전략 기본 정보" }),
              /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-4", children: [
                /* @__PURE__ */ jsx("div", { className: "bg-gray-700 rounded-lg p-4", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center", children: [
                  /* @__PURE__ */ jsx(Activity, { className: "w-8 h-8 text-blue-400 mr-3" }),
                  /* @__PURE__ */ jsxs("div", { children: [
                    /* @__PURE__ */ jsx("p", { className: "text-gray-400 text-sm", children: "전략명" }),
                    /* @__PURE__ */ jsx("p", { className: "text-white font-medium", children: strategyData.name })
                  ] })
                ] }) }),
                /* @__PURE__ */ jsx("div", { className: "bg-gray-700 rounded-lg p-4", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center", children: [
                  /* @__PURE__ */ jsx(Users, { className: "w-8 h-8 text-green-400 mr-3" }),
                  /* @__PURE__ */ jsxs("div", { children: [
                    /* @__PURE__ */ jsx("p", { className: "text-gray-400 text-sm", children: "사용자 ID" }),
                    /* @__PURE__ */ jsx("p", { className: "text-white font-medium", children: strategyData.userId })
                  ] })
                ] }) }),
                /* @__PURE__ */ jsx("div", { className: "bg-gray-700 rounded-lg p-4", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center", children: [
                  /* @__PURE__ */ jsx(BarChart3, { className: "w-8 h-8 text-purple-400 mr-3" }),
                  /* @__PURE__ */ jsxs("div", { children: [
                    /* @__PURE__ */ jsx("p", { className: "text-gray-400 text-sm", children: "전략 유형" }),
                    /* @__PURE__ */ jsx("p", { className: "text-white font-medium", children: strategyData.type })
                  ] })
                ] }) }),
                /* @__PURE__ */ jsx("div", { className: "bg-gray-700 rounded-lg p-4", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center", children: [
                  /* @__PURE__ */ jsx(Calendar, { className: "w-8 h-8 text-orange-400 mr-3" }),
                  /* @__PURE__ */ jsxs("div", { children: [
                    /* @__PURE__ */ jsx("p", { className: "text-gray-400 text-sm", children: "기간" }),
                    /* @__PURE__ */ jsx("p", { className: "text-white font-medium", children: strategyData.period })
                  ] })
                ] }) })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6", children: [
              /* @__PURE__ */ jsxs("div", { className: "bg-gray-800 rounded-lg p-6", children: [
                /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold text-white mb-4", children: "전략별 수익률" }),
                /* @__PURE__ */ jsx(ResponsiveContainer, { width: "100%", height: 300, children: /* @__PURE__ */ jsxs(BarChart, { data: strategyData.profitData, children: [
                  /* @__PURE__ */ jsx(CartesianGrid, { strokeDasharray: "3 3", stroke: "#374151" }),
                  /* @__PURE__ */ jsx(XAxis, { dataKey: "name", stroke: "#9CA3AF" }),
                  /* @__PURE__ */ jsx(YAxis, { stroke: "#9CA3AF" }),
                  /* @__PURE__ */ jsx(
                    Tooltip,
                    {
                      contentStyle: {
                        backgroundColor: "#1F2937",
                        border: "1px solid #374151",
                        borderRadius: "8px",
                        color: "#fff"
                      }
                    }
                  ),
                  /* @__PURE__ */ jsx(Bar, { dataKey: "profit", fill: "#3B82F6", radius: [4, 4, 0, 0] })
                ] }) })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "bg-gray-800 rounded-lg p-6", children: [
                /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold text-white mb-4", children: "사용자 수" }),
                /* @__PURE__ */ jsx(ResponsiveContainer, { width: "100%", height: 300, children: /* @__PURE__ */ jsxs(BarChart, { data: strategyData.userCountData, children: [
                  /* @__PURE__ */ jsx(CartesianGrid, { strokeDasharray: "3 3", stroke: "#374151" }),
                  /* @__PURE__ */ jsx(XAxis, { dataKey: "name", stroke: "#9CA3AF" }),
                  /* @__PURE__ */ jsx(YAxis, { stroke: "#9CA3AF" }),
                  /* @__PURE__ */ jsx(
                    Tooltip,
                    {
                      contentStyle: {
                        backgroundColor: "#1F2937",
                        border: "1px solid #374151",
                        borderRadius: "8px",
                        color: "#fff"
                      }
                    }
                  ),
                  /* @__PURE__ */ jsx(Bar, { dataKey: "count", fill: "#06B6D4", radius: [4, 4, 0, 0] })
                ] }) })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "bg-gray-800 rounded-lg p-6", children: [
                /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold text-white mb-4", children: "진입 횟수" }),
                /* @__PURE__ */ jsx(ResponsiveContainer, { width: "100%", height: 300, children: /* @__PURE__ */ jsxs(LineChart, { data: strategyData.entryData, children: [
                  /* @__PURE__ */ jsx(CartesianGrid, { strokeDasharray: "3 3", stroke: "#374151" }),
                  /* @__PURE__ */ jsx(XAxis, { dataKey: "name", stroke: "#9CA3AF" }),
                  /* @__PURE__ */ jsx(YAxis, { stroke: "#9CA3AF" }),
                  /* @__PURE__ */ jsx(
                    Tooltip,
                    {
                      contentStyle: {
                        backgroundColor: "#1F2937",
                        border: "1px solid #374151",
                        borderRadius: "8px",
                        color: "#fff"
                      }
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    Line,
                    {
                      type: "monotone",
                      dataKey: "value",
                      stroke: "#10B981",
                      strokeWidth: 3,
                      dot: { fill: "#10B981", strokeWidth: 2, r: 4 }
                    }
                  )
                ] }) })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "bg-gray-800 rounded-lg p-6", children: [
                /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold text-white mb-4", children: "실패율" }),
                /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center", children: [
                  /* @__PURE__ */ jsxs("div", { className: "relative w-64 h-64", children: [
                    /* @__PURE__ */ jsx(ResponsiveContainer, { width: "100%", height: "100%", children: /* @__PURE__ */ jsxs(PieChart, { children: [
                      /* @__PURE__ */ jsx(
                        Pie,
                        {
                          dataKey: "value",
                          data: strategyData.failureData,
                          cx: "50%",
                          cy: "50%",
                          innerRadius: 60,
                          outerRadius: 100,
                          paddingAngle: 2,
                          children: strategyData.failureData.map((entry2, index) => /* @__PURE__ */ jsx(Cell, { fill: entry2.color }, `cell-${index}`))
                        }
                      ),
                      /* @__PURE__ */ jsx(
                        Tooltip,
                        {
                          contentStyle: {
                            backgroundColor: "#1F2937",
                            border: "1px solid #374151",
                            borderRadius: "8px",
                            color: "#fff"
                          }
                        }
                      )
                    ] }) }),
                    /* @__PURE__ */ jsx("div", { className: "absolute inset-0 flex items-center justify-center", children: /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
                      /* @__PURE__ */ jsxs("p", { className: "text-2xl font-bold text-white", children: [
                        strategyData.failureData[0].value,
                        "%"
                      ] }),
                      /* @__PURE__ */ jsx("p", { className: "text-gray-400 text-sm", children: "전체" })
                    ] }) })
                  ] }),
                  /* @__PURE__ */ jsx("div", { className: "ml-8", children: strategyData.failureData.map((item, index) => /* @__PURE__ */ jsxs("div", { className: "flex items-center mb-2", children: [
                    /* @__PURE__ */ jsx(
                      "div",
                      {
                        className: "w-3 h-3 rounded-full mr-2",
                        style: { backgroundColor: item.color }
                      }
                    ),
                    /* @__PURE__ */ jsx("span", { className: "text-gray-300 text-sm", children: item.name }),
                    /* @__PURE__ */ jsxs("span", { className: "text-white font-medium ml-2", children: [
                      item.value,
                      "%"
                    ] })
                  ] }, index)) })
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6", children: [
              /* @__PURE__ */ jsxs("div", { className: "bg-gray-800 rounded-lg p-6", children: [
                /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold text-white mb-4", children: "전략별 슬리피지 체결가" }),
                /* @__PURE__ */ jsx(ResponsiveContainer, { width: "100%", height: 300, children: /* @__PURE__ */ jsxs(LineChart, { data: slippageData, children: [
                  /* @__PURE__ */ jsx(CartesianGrid, { strokeDasharray: "3 3", stroke: "#374151" }),
                  /* @__PURE__ */ jsx(XAxis, { dataKey: "name", stroke: "#9CA3AF" }),
                  /* @__PURE__ */ jsx(YAxis, { stroke: "#9CA3AF" }),
                  /* @__PURE__ */ jsx(
                    Tooltip,
                    {
                      contentStyle: {
                        backgroundColor: "#1F2937",
                        border: "1px solid #374151",
                        borderRadius: "8px",
                        color: "#fff"
                      }
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    Line,
                    {
                      type: "monotone",
                      dataKey: "value",
                      stroke: "#F59E0B",
                      strokeWidth: 3,
                      dot: { fill: "#F59E0B", strokeWidth: 2, r: 4 }
                    }
                  )
                ] }) })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "bg-gray-800 rounded-lg p-6", children: [
                /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold text-white mb-4", children: "전략별 슬리피지 시그널가" }),
                /* @__PURE__ */ jsx(ResponsiveContainer, { width: "100%", height: 300, children: /* @__PURE__ */ jsxs(LineChart, { data: entrySlippageData, children: [
                  /* @__PURE__ */ jsx(CartesianGrid, { strokeDasharray: "3 3", stroke: "#374151" }),
                  /* @__PURE__ */ jsx(XAxis, { dataKey: "name", stroke: "#9CA3AF" }),
                  /* @__PURE__ */ jsx(YAxis, { stroke: "#9CA3AF" }),
                  /* @__PURE__ */ jsx(
                    Tooltip,
                    {
                      contentStyle: {
                        backgroundColor: "#1F2937",
                        border: "1px solid #374151",
                        borderRadius: "8px",
                        color: "#fff"
                      }
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    Line,
                    {
                      type: "monotone",
                      dataKey: "value",
                      stroke: "#EF4444",
                      strokeWidth: 3,
                      dot: { fill: "#EF4444", strokeWidth: 2, r: 4 }
                    }
                  )
                ] }) })
              ] })
            ] })
          ] })
        ]
      }
    )
  ] });
};
const route17 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: StrategyDetail
}, Symbol.toStringTag, { value: "Module" }));
const loader$3 = async () => {
};
const route18 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  loader: loader$3
}, Symbol.toStringTag, { value: "Module" }));
const useThemeStore = create()(
  persist(
    (set, get) => ({
      theme: "light",
      isClient: false,
      toggleTheme: () => {
        const { theme, isClient } = get();
        const newTheme = theme === "dark" ? "light" : "dark";
        set({ theme: newTheme });
        if (isClient && typeof window !== "undefined") {
          if (newTheme === "light") {
            document.documentElement.classList.add("light");
          } else {
            document.documentElement.classList.remove("light");
          }
        }
      },
      setIsClient: (value) => {
        set({ isClient: value });
      },
      initializeTheme: () => {
        if (typeof window !== "undefined") {
          set({ isClient: true });
          const { theme } = get();
          if (theme === "light") {
            document.documentElement.classList.add("light");
          } else {
            document.documentElement.classList.remove("light");
          }
        }
      }
    }),
    {
      name: "theme-storage",
      // localStorage key
      partialize: (state) => ({ theme: state.theme })
      // Only persist theme, not isClient
    }
  )
);
const Table = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx("div", { className: "relative w-full overflow-auto", children: /* @__PURE__ */ jsx(
  "table",
  {
    ref,
    className: cn("w-full caption-bottom text-sm", className),
    ...props
  }
) }));
Table.displayName = "Table";
const TableHeader = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx("thead", { ref, className: cn("[&_tr]:border-b", className), ...props }));
TableHeader.displayName = "TableHeader";
const TableBody = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  "tbody",
  {
    ref,
    className: cn("[&_tr:last-child]:border-0", className),
    ...props
  }
));
TableBody.displayName = "TableBody";
const TableFooter = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  "tfoot",
  {
    ref,
    className: cn(
      "border-t bg-muted/50 font-medium [&>tr]:last:border-b-0",
      className
    ),
    ...props
  }
));
TableFooter.displayName = "TableFooter";
const TableRow = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  "tr",
  {
    ref,
    className: cn(
      "border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted",
      className
    ),
    ...props
  }
));
TableRow.displayName = "TableRow";
const TableHead = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  "th",
  {
    ref,
    className: cn(
      "h-10 px-2 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
      className
    ),
    ...props
  }
));
TableHead.displayName = "TableHead";
const TableCell = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  "td",
  {
    ref,
    className: cn(
      "p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
      className
    ),
    ...props
  }
));
TableCell.displayName = "TableCell";
const TableCaption = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  "caption",
  {
    ref,
    className: cn("mt-4 text-sm text-muted-foreground", className),
    ...props
  }
));
TableCaption.displayName = "TableCaption";
const DropdownMenu = DropdownMenuPrimitive.Root;
const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger;
const DropdownMenuSubTrigger = React.forwardRef(({ className, inset, children, ...props }, ref) => /* @__PURE__ */ jsxs(
  DropdownMenuPrimitive.SubTrigger,
  {
    ref,
    className: cn(
      "flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent data-[state=open]:bg-accent [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
      inset && "pl-8",
      className
    ),
    ...props,
    children: [
      children,
      /* @__PURE__ */ jsx(ChevronRight, { className: "ml-auto" })
    ]
  }
));
DropdownMenuSubTrigger.displayName = DropdownMenuPrimitive.SubTrigger.displayName;
const DropdownMenuSubContent = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  DropdownMenuPrimitive.SubContent,
  {
    ref,
    className: cn(
      "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-[--radix-dropdown-menu-content-transform-origin]",
      className
    ),
    ...props
  }
));
DropdownMenuSubContent.displayName = DropdownMenuPrimitive.SubContent.displayName;
const DropdownMenuContent = React.forwardRef(({ className, sideOffset = 4, ...props }, ref) => /* @__PURE__ */ jsx(DropdownMenuPrimitive.Portal, { children: /* @__PURE__ */ jsx(
  DropdownMenuPrimitive.Content,
  {
    ref,
    sideOffset,
    className: cn(
      "z-50 max-h-[var(--radix-dropdown-menu-content-available-height)] min-w-[8rem] overflow-y-auto overflow-x-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md",
      "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-[--radix-dropdown-menu-content-transform-origin]",
      className
    ),
    ...props
  }
) }));
DropdownMenuContent.displayName = DropdownMenuPrimitive.Content.displayName;
const DropdownMenuItem = React.forwardRef(({ className, inset, ...props }, ref) => /* @__PURE__ */ jsx(
  DropdownMenuPrimitive.Item,
  {
    ref,
    className: cn(
      "relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&>svg]:size-4 [&>svg]:shrink-0",
      inset && "pl-8",
      className
    ),
    ...props
  }
));
DropdownMenuItem.displayName = DropdownMenuPrimitive.Item.displayName;
const DropdownMenuCheckboxItem = React.forwardRef(({ className, children, checked, ...props }, ref) => /* @__PURE__ */ jsxs(
  DropdownMenuPrimitive.CheckboxItem,
  {
    ref,
    className: cn(
      "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    ),
    checked,
    ...props,
    children: [
      /* @__PURE__ */ jsx("span", { className: "absolute left-2 flex h-3.5 w-3.5 items-center justify-center", children: /* @__PURE__ */ jsx(DropdownMenuPrimitive.ItemIndicator, { children: /* @__PURE__ */ jsx(Check, { className: "h-4 w-4" }) }) }),
      children
    ]
  }
));
DropdownMenuCheckboxItem.displayName = DropdownMenuPrimitive.CheckboxItem.displayName;
const DropdownMenuRadioItem = React.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxs(
  DropdownMenuPrimitive.RadioItem,
  {
    ref,
    className: cn(
      "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    ),
    ...props,
    children: [
      /* @__PURE__ */ jsx("span", { className: "absolute left-2 flex h-3.5 w-3.5 items-center justify-center", children: /* @__PURE__ */ jsx(DropdownMenuPrimitive.ItemIndicator, { children: /* @__PURE__ */ jsx(Circle, { className: "h-2 w-2 fill-current" }) }) }),
      children
    ]
  }
));
DropdownMenuRadioItem.displayName = DropdownMenuPrimitive.RadioItem.displayName;
const DropdownMenuLabel = React.forwardRef(({ className, inset, ...props }, ref) => /* @__PURE__ */ jsx(
  DropdownMenuPrimitive.Label,
  {
    ref,
    className: cn(
      "px-2 py-1.5 text-sm font-semibold",
      inset && "pl-8",
      className
    ),
    ...props
  }
));
DropdownMenuLabel.displayName = DropdownMenuPrimitive.Label.displayName;
const DropdownMenuSeparator = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  DropdownMenuPrimitive.Separator,
  {
    ref,
    className: cn("-mx-1 my-1 h-px bg-muted", className),
    ...props
  }
));
DropdownMenuSeparator.displayName = DropdownMenuPrimitive.Separator.displayName;
const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80",
        secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive: "border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80",
        outline: "text-foreground"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);
function Badge({ className, variant, ...props }) {
  return /* @__PURE__ */ jsx("div", { className: cn(badgeVariants({ variant }), className), ...props });
}
const Card = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  "div",
  {
    ref,
    className: cn(
      "rounded-xl border bg-card text-card-foreground shadow",
      className
    ),
    ...props
  }
));
Card.displayName = "Card";
const CardHeader = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  "div",
  {
    ref,
    className: cn("flex flex-col space-y-1.5 p-6", className),
    ...props
  }
));
CardHeader.displayName = "CardHeader";
const CardTitle = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  "div",
  {
    ref,
    className: cn("font-semibold leading-none tracking-tight", className),
    ...props
  }
));
CardTitle.displayName = "CardTitle";
const CardDescription = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  "div",
  {
    ref,
    className: cn("text-sm text-muted-foreground", className),
    ...props
  }
));
CardDescription.displayName = "CardDescription";
const CardContent = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx("div", { ref, className: cn("p-6 pt-0", className), ...props }));
CardContent.displayName = "CardContent";
const CardFooter = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  "div",
  {
    ref,
    className: cn("flex items-center p-6 pt-0", className),
    ...props
  }
));
CardFooter.displayName = "CardFooter";
const DashHeader = ({
  theme,
  toggleTheme,
  sidebarOpen,
  setSidebarOpen,
  title = "대시보드"
}) => {
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);
  const [email, setemail] = useState("");
  const [nickName, setnickName] = useState("");
  const navigate = useNavigate$1();
  useEffect(() => {
    if (typeof sessionStorage === void 0 || sessionStorage.getItem("nickName") == null) {
      navigate("/login");
      return;
    }
  }, []);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
    };
    setemail(String(sessionStorage.getItem("email")));
    setnickName(String(sessionStorage.getItem("nickName")));
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  const UserDropdownMenu = () => /* @__PURE__ */ jsxs("div", { className: `absolute right-0 top-full mt-2 w-80 rounded-xl shadow-lg border z-50 ${theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`, children: [
    /* @__PURE__ */ jsxs("div", { className: "p-4 border-b border-gray-200 dark:border-gray-700", children: [
      /* @__PURE__ */ jsx("div", { className: "flex items-center justify-between mb-3", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center", children: [
        /* @__PURE__ */ jsx(Crown, { className: "w-5 h-5 text-blue-500 mr-2" }),
        /* @__PURE__ */ jsx("span", { className: `text-sm font-medium ${theme === "dark" ? "text-white" : "text-gray-900"}`, children: "Pro Plan" })
      ] }) }),
      /* @__PURE__ */ jsx("button", { className: "w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors", children: "Upgrade" })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "py-2", children: [
      /* @__PURE__ */ jsxs("button", { className: "w-full flex items-center px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors", children: [
        /* @__PURE__ */ jsx(UserCog, { className: `w-4 h-4 mr-3 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}` }),
        /* @__PURE__ */ jsx("span", { className: `text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`, children: "설정" })
      ] }),
      /* @__PURE__ */ jsxs("button", { className: "w-full flex items-center px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors", children: [
        /* @__PURE__ */ jsx(Shield, { className: `w-4 h-4 mr-3 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}` }),
        /* @__PURE__ */ jsx("span", { className: `text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`, children: "보안" })
      ] }),
      /* @__PURE__ */ jsxs("button", { className: "w-full flex items-center px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors", children: [
        /* @__PURE__ */ jsx(HelpCircle, { className: `w-4 h-4 mr-3 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}` }),
        /* @__PURE__ */ jsx("span", { className: `text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`, children: "도움말" })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "border-t border-gray-200 dark:border-gray-700 py-2", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center", children: [
          theme === "dark" ? /* @__PURE__ */ jsx(Moon, { className: "w-4 h-4 mr-3 text-gray-400" }) : /* @__PURE__ */ jsx(Sun, { className: "w-4 h-4 mr-3 text-gray-600" }),
          /* @__PURE__ */ jsx("span", { className: `text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`, children: theme === "dark" ? "Dark mode" : "Light mode" })
        ] }),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: toggleTheme,
            className: `relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${theme === "dark" ? "bg-blue-500" : "bg-gray-300"}`,
            children: /* @__PURE__ */ jsx("span", { className: `inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${theme === "dark" ? "translate-x-5" : "translate-x-1"}` })
          }
        )
      ] }),
      /* @__PURE__ */ jsx("a", { href: "/logout", children: /* @__PURE__ */ jsxs("button", { className: "w-full flex items-center px-4 py-3 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-red-600 dark:text-red-400", children: [
        /* @__PURE__ */ jsx(LogOut, { className: "w-4 h-4 mr-3" }),
        /* @__PURE__ */ jsx("span", { className: "text-sm", children: "Log out" })
      ] }) })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "border-t border-gray-200 dark:border-gray-700 px-4 py-3", children: /* @__PURE__ */ jsx("button", { className: `text-xs ${theme === "dark" ? "text-gray-500 hover:text-gray-400" : "text-gray-400 hover:text-gray-600"} transition-colors`, children: "Terms and Conditions" }) })
  ] });
  return /* @__PURE__ */ jsx("header", { className: `${theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"} shadow-sm border-b`, children: /* @__PURE__ */ jsx("div", { className: "px-4 lg:px-6 py-4", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center", children: [
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => setSidebarOpen(!sidebarOpen),
          className: `mr-3 lg:mr-4 ${theme === "dark" ? "text-gray-400 hover:text-white" : "text-gray-600 hover:text-gray-900"}`,
          children: /* @__PURE__ */ jsx(Menu, { className: "w-6 h-6" })
        }
      ),
      /* @__PURE__ */ jsx("h2", { className: `text-lg lg:text-xl font-semibold ${theme === "dark" ? "text-white" : "text-gray-800"}`, children: title })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-2 lg:space-x-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "relative hidden lg:block", children: [
        /* @__PURE__ */ jsx(Search, { className: `absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${theme === "dark" ? "text-gray-400" : "text-gray-500"}` }),
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "text",
            placeholder: "검색...",
            className: `pl-10 pr-4 py-2 rounded-lg border focus:ring-2 focus:ring-cyan-500 focus:border-transparent ${theme === "dark" ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400" : "bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500"}`
          }
        )
      ] }),
      /* @__PURE__ */ jsx("button", { className: `lg:hidden p-2 rounded-lg transition-colors ${theme === "dark" ? "text-gray-400 hover:text-white" : "text-gray-600 hover:text-gray-900"}`, children: /* @__PURE__ */ jsx(Search, { className: "w-5 h-5" }) }),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: toggleTheme,
          className: `p-2 rounded-lg transition-colors ${theme === "dark" ? "bg-gray-700 text-yellow-400 hover:bg-gray-600" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`,
          children: theme === "dark" ? /* @__PURE__ */ jsx(Sun, { className: "w-5 h-5" }) : /* @__PURE__ */ jsx(Moon, { className: "w-5 h-5" })
        }
      ),
      /* @__PURE__ */ jsx("button", { className: `p-2 rounded-lg transition-colors ${theme === "dark" ? "text-gray-400 hover:text-white" : "text-gray-600 hover:text-gray-900"}`, children: /* @__PURE__ */ jsx(Bell, { className: "w-5 h-5" }) }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-2 lg:space-x-3 relative", ref: userMenuRef, children: [
        /* @__PURE__ */ jsxs("div", { className: `text-right hidden lg:block ${theme === "dark" ? "text-white" : "text-gray-700"}`, children: [
          /* @__PURE__ */ jsxs("div", { className: "text-sm font-medium", children: [
            nickName,
            "님"
          ] }),
          /* @__PURE__ */ jsx("div", { className: `text-xs ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`, children: "환영합니다!" })
        ] }),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => setUserMenuOpen(!userMenuOpen),
            className: "w-8 h-8 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center hover:from-cyan-600 hover:to-blue-600 transition-colors",
            children: /* @__PURE__ */ jsx(User, { className: "w-4 h-4 text-white" })
          }
        ),
        userMenuOpen && /* @__PURE__ */ jsx(UserDropdownMenu, {})
      ] })
    ] })
  ] }) }) });
};
const DashSidebar = ({ theme, sidebarOpen, setSidebarOpen, activeMenu = "대시보드" }) => {
  const sidebarItems = [
    /*
    { icon: Home, label: '대시보드', active: activeMenu === '대시보드', href: '/dashboard' },
    { icon: User, label: '계정관리', active: activeMenu === '계정관리', href: '/account' },
    { icon: Shield, label: '거래소연동관리', active: activeMenu === '거래소연동관리', href: '/exchange' },
    { icon: Bot, label: '봇설정/자동매매전략', active: activeMenu === '봇설정/자동매매전략', href: '/bot' },
    { icon: BarChart3, label: '백레스트/리포트', active: activeMenu === '백레스트/리포트', href: '/reports' },
    { icon: HelpCircle, label: '고객지원', active: activeMenu === '고객지원', href: '/support' },
    { icon: Settings, label: '환경설정', active: activeMenu === '환경설정', href: '/settings' },
     */
    { icon: Home, label: "대시보드", active: activeMenu === "대시보드", href: "/dashboard" },
    { icon: User, label: "내 전략 관리", active: activeMenu === "내 전략 관리", href: "/mystrategy" },
    /*{ icon: Shield, label: '거래소연동관리', active: activeMenu === '거래소연동관리', href: '/exchange' },*/
    { icon: Bot, label: "추천 전략 둘러보기", active: activeMenu === "추천 전략 둘러보기", href: "/recommend" },
    { icon: BarChart3, label: "실행 중 전략", active: activeMenu === "실행 중 전략", href: "/runningStrategy" },
    { icon: HelpCircle, label: "전략 성과 리포트", active: activeMenu === "전략 성과 리포트", href: "/strategyReport" },
    { icon: User, label: "계정관리", active: activeMenu === "계정관리", href: "/account" }
  ];
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    sidebarOpen && /* @__PURE__ */ jsx(
      "div",
      {
        className: "fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden",
        onClick: () => setSidebarOpen(false)
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: `fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out 
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} 
          ${theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"} border-r`, children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between p-6", children: [
        /* @__PURE__ */ jsx("div", { className: "flex items-center", children: /* @__PURE__ */ jsx("h1", { className: `text-xl font-bold ${theme === "dark" ? "text-white" : "text-gray-800"}`, children: /* @__PURE__ */ jsx("a", { href: "/dashboard", children: theme === "dark" ? /* @__PURE__ */ jsx("img", { className: "h-[44px]", src: "/logo-white.png", alt: "" }) : /* @__PURE__ */ jsx("img", { className: "h-[44px]", src: "/logo.png", alt: "" }) }) }) }),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => setSidebarOpen(false),
            className: `lg:hidden ${theme === "dark" ? "text-gray-400 hover:text-white" : "text-gray-600 hover:text-gray-900"}`,
            children: /* @__PURE__ */ jsx(X, { className: "w-6 h-6" })
          }
        )
      ] }),
      /* @__PURE__ */ jsx("nav", { className: "mt-8", children: sidebarItems.map((item, index) => /* @__PURE__ */ jsxs(
        "a",
        {
          href: item.href || "#",
          className: `flex items-center px-6 py-3 text-sm font-medium transition-colors ${item.active ? theme === "dark" ? "bg-gray-700 text-cyan-400 border-r-2 border-cyan-400" : "bg-blue-50 text-blue-600 border-r-2 border-blue-600" : theme === "dark" ? "text-gray-300 hover:bg-gray-700 hover:text-white" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"}`,
          children: [
            /* @__PURE__ */ jsx(item.icon, { className: "w-5 h-5 mr-3" }),
            item.label
          ]
        },
        index
      )) })
    ] })
  ] });
};
const DashFooter = ({ theme }) => {
  return /* @__PURE__ */ jsx("footer", { className: `${theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"} border-t`, children: /* @__PURE__ */ jsxs("div", { className: "px-6 py-4", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap justify-center space-x-6 text-sm", children: [
      /* @__PURE__ */ jsx("a", { href: "/terms", className: `${theme === "dark" ? "text-gray-400 hover:text-gray-300" : "text-gray-600 hover:text-gray-900"} transition-colors`, children: "이용약관" }),
      /* @__PURE__ */ jsx("a", { href: "/privacy", className: `${theme === "dark" ? "text-gray-400 hover:text-gray-300" : "text-gray-600 hover:text-gray-900"} transition-colors`, children: "개인정보처리방침" }),
      /* @__PURE__ */ jsx("a", { href: "/about", className: `${theme === "dark" ? "text-gray-400 hover:text-gray-300" : "text-gray-600 hover:text-gray-900"} transition-colors`, children: "트레이딩기어 소개" }),
      /* @__PURE__ */ jsx("a", { href: "/support", className: `${theme === "dark" ? "text-gray-400 hover:text-gray-300" : "text-gray-600 hover:text-gray-900"} transition-colors`, children: "고객센터" }),
      /* @__PURE__ */ jsx("a", { href: "javascript:void(0)", className: `${theme === "dark" ? "text-gray-400 hover:text-gray-300" : "text-gray-600 hover:text-gray-900"} transition-colors`, children: "버전정보" })
    ] }),
    /* @__PURE__ */ jsx("div", { className: `text-center mt-2 text-xs ${theme === "dark" ? "text-gray-500" : "text-gray-400"}`, children: "© 2024 트레이딩기어. All rights reserved. v2.1.0" })
  ] }) });
};
const DashNav = ({ activeTab }) => {
  const { theme } = useThemeStore();
  const topTabs = [
    { id: "dashboard", label: "홈", link: "/dashboard" },
    { id: "plan", label: "자동매매설정", link: "#void" },
    { id: "strategy", label: "전략타겟", link: "/dashboard/strategy" },
    { id: "assets", label: "자산현황", link: "/dashboard/assets" },
    { id: "accountOpen", label: "알림", link: "#void" },
    { id: "accountProfit", label: "수익률", link: "#void" }
  ];
  return /* @__PURE__ */ jsx("div", { className: `border-t ${theme === "dark" ? "border-gray-700" : "border-gray-200"}`, children: /* @__PURE__ */ jsx("div", { className: "px-4 lg:px-6", children: /* @__PURE__ */ jsx("div", { className: "flex space-x-8 overflow-x-auto", children: topTabs.map((tab) => /* @__PURE__ */ jsx(
    Link,
    {
      to: tab.link,
      className: `py-3 px-1 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${activeTab === tab.id ? theme === "dark" ? "border-cyan-400 text-cyan-400" : "border-blue-600 text-blue-600" : theme === "dark" ? "border-transparent text-gray-400 hover:text-gray-300" : "border-transparent text-gray-600 hover:text-gray-900"}`,
      children: tab.label
    },
    tab.id
  )) }) }) });
};
const Strategy = () => {
  const { theme, toggleTheme } = useThemeStore();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const strategyData = [
    {
      id: 1,
      name: "RSI 역추세 전략",
      type: "General",
      status: "active",
      profitRate: 12.5,
      winRate: 68.2,
      maxDrawdown: -3.8,
      lastModified: "2024-07-24",
      description: "RSI 지표를 활용한 역추세 매매 전략"
    },
    {
      id: 2,
      name: "스마트 어시스턴트",
      type: "AI Assistant",
      status: "active",
      profitRate: 15.3,
      winRate: 72.1,
      maxDrawdown: -2.5,
      lastModified: "2024-07-23",
      description: "AI 기반 시장 분석 및 자동 매매"
    },
    {
      id: 3,
      name: "그리드 매매 봇",
      type: "GRID Bot",
      status: "paused",
      profitRate: 8.7,
      winRate: 65.4,
      maxDrawdown: -4.2,
      lastModified: "2024-07-22",
      description: "일정 간격으로 매수/매도 주문을 배치"
    },
    {
      id: 4,
      name: "루프 트레이딩",
      type: "LOOP Bot",
      status: "active",
      profitRate: 11.2,
      winRate: 70.3,
      maxDrawdown: -3.1,
      lastModified: "2024-07-24",
      description: "반복적인 매매 패턴으로 수익 창출"
    },
    {
      id: 5,
      name: "DCA 누적투자",
      type: "DCA Bot",
      status: "inactive",
      profitRate: 9.8,
      winRate: 58.9,
      maxDrawdown: -5.6,
      lastModified: "2024-07-21",
      description: "정기적인 분할 매수 전략"
    },
    {
      id: 6,
      name: "볼린저밴드 전략",
      type: "General",
      status: "active",
      profitRate: 13.6,
      winRate: 69.8,
      maxDrawdown: -2.9,
      lastModified: "2024-07-24",
      description: "볼린저밴드 상하한선 돌파 전략"
    }
  ];
  const strategyTypes = [
    { id: "all", label: "전체", icon: Target },
    { id: "General", label: "General", icon: Settings },
    { id: "AI Assistant", label: "AI Assistant", icon: Brain },
    { id: "GRID Bot", label: "GRID Bot", icon: Grid3X3 },
    { id: "LOOP Bot", label: "LOOP Bot", icon: Repeat },
    { id: "DCA Bot", label: "DCA Bot", icon: TrendingDown }
  ];
  const filteredStrategies = activeTab === "all" ? strategyData : strategyData.filter((strategy) => strategy.type === activeTab);
  const strategyStats = {
    total: strategyData.length,
    active: strategyData.filter((s) => s.status === "active").length,
    paused: strategyData.filter((s) => s.status === "paused").length,
    inactive: strategyData.filter((s) => s.status === "inactive").length,
    avgProfit: (strategyData.reduce((sum, s) => sum + s.profitRate, 0) / strategyData.length).toFixed(1)
  };
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
  const getStatusBadge = (status) => {
    switch (status) {
      case "active":
        return /* @__PURE__ */ jsx(Badge, { className: "bg-green-100 text-green-800 hover:bg-green-100", children: "활성" });
      case "paused":
        return /* @__PURE__ */ jsx(Badge, { className: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100", children: "일시정지" });
      case "inactive":
        return /* @__PURE__ */ jsx(Badge, { variant: "secondary", children: "비활성" });
      default:
        return /* @__PURE__ */ jsx(Badge, { variant: "secondary", children: "알 수 없음" });
    }
  };
  const getTypeIcon = (type) => {
    const typeConfig = strategyTypes.find((t) => t.id === type);
    if (typeConfig) {
      const IconComponent = typeConfig.icon;
      return /* @__PURE__ */ jsx(IconComponent, { className: "w-4 h-4" });
    }
    return /* @__PURE__ */ jsx(Settings, { className: "w-4 h-4" });
  };
  return /* @__PURE__ */ jsxs("div", { className: `min-h-screen ${theme === "dark" ? "bg-gray-900" : "bg-gray-50"}`, children: [
    /* @__PURE__ */ jsx(
      DashSidebar,
      {
        theme,
        sidebarOpen,
        setSidebarOpen,
        activeMenu: "대시보드"
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: `transition-all duration-300 ${sidebarOpen ? "lg:ml-64" : "lg:ml-0"}`, children: [
      /* @__PURE__ */ jsx(
        DashHeader,
        {
          theme,
          toggleTheme,
          sidebarOpen,
          setSidebarOpen,
          title: "전략타겟"
        }
      ),
      /* @__PURE__ */ jsx(DashNav, { activeTab: "strategy" }),
      /* @__PURE__ */ jsxs("main", { className: "p-6", children: [
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-5 gap-4 mb-8", children: [
          /* @__PURE__ */ jsxs(Card, { className: theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200", children: [
            /* @__PURE__ */ jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [
              /* @__PURE__ */ jsx(CardTitle, { className: `text-sm font-medium ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`, children: "전체 전략" }),
              /* @__PURE__ */ jsx(Target, { className: "h-4 w-4 text-blue-500" })
            ] }),
            /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsxs("div", { className: `text-2xl font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`, children: [
              strategyStats.total,
              "개"
            ] }) })
          ] }),
          /* @__PURE__ */ jsxs(Card, { className: theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200", children: [
            /* @__PURE__ */ jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [
              /* @__PURE__ */ jsx(CardTitle, { className: `text-sm font-medium ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`, children: "활성 전략" }),
              /* @__PURE__ */ jsx(Play, { className: "h-4 w-4 text-green-500" })
            ] }),
            /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsxs("div", { className: "text-2xl font-bold text-green-500", children: [
              strategyStats.active,
              "개"
            ] }) })
          ] }),
          /* @__PURE__ */ jsxs(Card, { className: theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200", children: [
            /* @__PURE__ */ jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [
              /* @__PURE__ */ jsx(CardTitle, { className: `text-sm font-medium ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`, children: "일시정지" }),
              /* @__PURE__ */ jsx(Pause, { className: "h-4 w-4 text-yellow-500" })
            ] }),
            /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsxs("div", { className: "text-2xl font-bold text-yellow-500", children: [
              strategyStats.paused,
              "개"
            ] }) })
          ] }),
          /* @__PURE__ */ jsxs(Card, { className: theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200", children: [
            /* @__PURE__ */ jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [
              /* @__PURE__ */ jsx(CardTitle, { className: `text-sm font-medium ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`, children: "비활성" }),
              /* @__PURE__ */ jsx(AlertCircle, { className: "h-4 w-4 text-gray-500" })
            ] }),
            /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsxs("div", { className: `text-2xl font-bold ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`, children: [
              strategyStats.inactive,
              "개"
            ] }) })
          ] }),
          /* @__PURE__ */ jsxs(Card, { className: theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200", children: [
            /* @__PURE__ */ jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [
              /* @__PURE__ */ jsx(CardTitle, { className: `text-sm font-medium ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`, children: "평균 수익률" }),
              /* @__PURE__ */ jsx(Activity, { className: "h-4 w-4 text-purple-500" })
            ] }),
            /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsxs("div", { className: "text-2xl font-bold text-purple-500", children: [
              "+",
              strategyStats.avgProfit,
              "%"
            ] }) })
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { className: `border-b mb-6 ${theme === "dark" ? "border-gray-700" : "border-gray-200"}`, children: /* @__PURE__ */ jsx("div", { className: "flex space-x-8 overflow-x-auto", children: strategyTypes.map((type) => {
          const IconComponent = type.icon;
          return /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: () => setActiveTab(type.id),
              className: `py-3 px-1 text-sm font-medium border-b-2 whitespace-nowrap transition-colors flex items-center gap-2 ${activeTab === type.id ? theme === "dark" ? "border-cyan-400 text-cyan-400" : "border-blue-600 text-blue-600" : theme === "dark" ? "border-transparent text-gray-400 hover:text-gray-300" : "border-transparent text-gray-600 hover:text-gray-900"}`,
              children: [
                /* @__PURE__ */ jsx(IconComponent, { className: "w-4 h-4" }),
                type.label
              ]
            },
            type.id
          );
        }) }) }),
        /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center mb-6", children: [
          /* @__PURE__ */ jsxs("h2", { className: `text-xl font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`, children: [
            "전략 목록 (",
            filteredStrategies.length,
            "개)"
          ] }),
          /* @__PURE__ */ jsxs(Button, { className: "bg-blue-600 hover:bg-blue-700 text-white", children: [
            /* @__PURE__ */ jsx(Plus, { className: "w-4 h-4 mr-2" }),
            "새 전략 추가"
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { className: `rounded-xl border ${theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"} mb-8`, children: /* @__PURE__ */ jsx("div", { className: `relative overflow-hidden border-t ${theme === "dark" ? "border-gray-700" : "border-gray-200"}`, children: /* @__PURE__ */ jsxs(Table, { children: [
          /* @__PURE__ */ jsxs("colgroup", { children: [
            /* @__PURE__ */ jsx("col", { className: "w-1/12" }),
            /* @__PURE__ */ jsx("col", { className: "w-3/12" }),
            /* @__PURE__ */ jsx("col", { className: "w-1/12" }),
            /* @__PURE__ */ jsx("col", { className: "w-1/12" }),
            /* @__PURE__ */ jsx("col", { className: "w-1/12" }),
            /* @__PURE__ */ jsx("col", { className: "w-1/12" }),
            /* @__PURE__ */ jsx("col", { className: "w-2/12" }),
            /* @__PURE__ */ jsx("col", { className: "w-2/12" }),
            /* @__PURE__ */ jsx("col", { className: "w-1/12" })
          ] }),
          /* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { className: theme === "dark" ? "border-gray-700" : "border-gray-200", children: [
            /* @__PURE__ */ jsx(TableHead, { className: `text-center ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`, children: "상태" }),
            /* @__PURE__ */ jsx(TableHead, { className: `text-center ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`, children: "전략명" }),
            /* @__PURE__ */ jsx(TableHead, { className: `text-center ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`, children: "타입" }),
            /* @__PURE__ */ jsx(TableHead, { className: `text-center ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`, children: "수익률" }),
            /* @__PURE__ */ jsx(TableHead, { className: `text-center ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`, children: "승률" }),
            /* @__PURE__ */ jsx(TableHead, { className: `text-center ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`, children: "최대낙폭" }),
            /* @__PURE__ */ jsx(TableHead, { className: `text-center ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`, children: "설명" }),
            /* @__PURE__ */ jsx(TableHead, { className: `text-center ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`, children: "최종수정일" }),
            /* @__PURE__ */ jsx(TableHead, { className: "w-12" })
          ] }) }),
          /* @__PURE__ */ jsx(TableBody, { children: filteredStrategies.map((strategy) => /* @__PURE__ */ jsxs(
            TableRow,
            {
              className: `${theme === "dark" ? "border-gray-700 hover:bg-gray-750" : "border-gray-200 hover:bg-gray-50"} transition-colors`,
              children: [
                /* @__PURE__ */ jsx(TableCell, { className: "text-center", children: getStatusBadge(strategy.status) }),
                /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-3 text-left", children: [
                  /* @__PURE__ */ jsx("div", { className: `w-8 h-8 rounded-full flex items-center justify-center ${strategy.type === "General" ? "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300" : strategy.type === "AI Assistant" ? "bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-300" : strategy.type === "GRID Bot" ? "bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300" : strategy.type === "LOOP Bot" ? "bg-orange-100 text-orange-600 dark:bg-orange-900 dark:text-orange-300" : "bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300"}`, children: getTypeIcon(strategy.type) }),
                  /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx("div", { className: `font-medium ${theme === "dark" ? "text-white" : "text-gray-900"}`, children: strategy.name }) })
                ] }) }),
                /* @__PURE__ */ jsx(TableCell, { className: "text-center", children: /* @__PURE__ */ jsx(Badge, { variant: "outline", className: theme === "dark" ? "border-gray-600 text-gray-300" : "border-gray-300 text-gray-700", children: strategy.type }) }),
                /* @__PURE__ */ jsx(TableCell, { className: "text-center", children: /* @__PURE__ */ jsxs(Badge, { variant: strategy.profitRate > 0 ? "default" : "destructive", className: strategy.profitRate > 0 ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-100" : "", children: [
                  strategy.profitRate > 0 ? "+" : "",
                  strategy.profitRate,
                  "%"
                ] }) }),
                /* @__PURE__ */ jsxs(TableCell, { className: `text-center font-medium ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`, children: [
                  strategy.winRate,
                  "%"
                ] }),
                /* @__PURE__ */ jsxs(TableCell, { className: `text-center font-medium text-red-500`, children: [
                  strategy.maxDrawdown,
                  "%"
                ] }),
                /* @__PURE__ */ jsx(TableCell, { className: `text-left ${theme === "dark" ? "text-gray-400" : "text-gray-600"} text-sm`, children: strategy.description }),
                /* @__PURE__ */ jsx(TableCell, { className: `text-center text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`, children: strategy.lastModified }),
                /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsxs(DropdownMenu, { children: [
                  /* @__PURE__ */ jsx(DropdownMenuTrigger, { asChild: true, children: /* @__PURE__ */ jsxs(Button, { variant: "ghost", className: "h-8 w-8 p-0", children: [
                    /* @__PURE__ */ jsx("span", { className: "sr-only", children: "Open menu" }),
                    /* @__PURE__ */ jsx(MoreHorizontal, { className: "h-4 w-4" })
                  ] }) }),
                  /* @__PURE__ */ jsxs(DropdownMenuContent, { align: "end", className: theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200", children: [
                    /* @__PURE__ */ jsxs(
                      DropdownMenuItem,
                      {
                        onClick: () => console.log("전략 수정", strategy.id),
                        className: theme === "dark" ? "text-gray-300 hover:bg-gray-700" : "text-gray-700 hover:bg-gray-100",
                        children: [
                          /* @__PURE__ */ jsx(Edit, { className: "w-4 h-4 mr-2" }),
                          "전략 수정"
                        ]
                      }
                    ),
                    /* @__PURE__ */ jsxs(
                      DropdownMenuItem,
                      {
                        onClick: () => console.log("전략 복사", strategy.id),
                        className: theme === "dark" ? "text-gray-300 hover:bg-gray-700" : "text-gray-700 hover:bg-gray-100",
                        children: [
                          /* @__PURE__ */ jsx(Plus, { className: "w-4 h-4 mr-2" }),
                          "전략 복사"
                        ]
                      }
                    ),
                    strategy.status === "active" ? /* @__PURE__ */ jsxs(
                      DropdownMenuItem,
                      {
                        onClick: () => console.log("전략 일시정지", strategy.id),
                        className: theme === "dark" ? "text-gray-300 hover:bg-gray-700" : "text-gray-700 hover:bg-gray-100",
                        children: [
                          /* @__PURE__ */ jsx(Pause, { className: "w-4 h-4 mr-2" }),
                          "일시정지"
                        ]
                      }
                    ) : /* @__PURE__ */ jsxs(
                      DropdownMenuItem,
                      {
                        onClick: () => console.log("전략 시작", strategy.id),
                        className: theme === "dark" ? "text-gray-300 hover:bg-gray-700" : "text-gray-700 hover:bg-gray-100",
                        children: [
                          /* @__PURE__ */ jsx(Play, { className: "w-4 h-4 mr-2" }),
                          "전략 시작"
                        ]
                      }
                    ),
                    /* @__PURE__ */ jsxs(
                      DropdownMenuItem,
                      {
                        onClick: () => console.log("전략 삭제", strategy.id),
                        className: "text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20",
                        children: [
                          /* @__PURE__ */ jsx(Trash2, { className: "w-4 h-4 mr-2" }),
                          "전략 삭제"
                        ]
                      }
                    )
                  ] })
                ] }) })
              ]
            },
            strategy.id
          )) })
        ] }) }) }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6", children: [
          /* @__PURE__ */ jsxs(Card, { className: theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200", children: [
            /* @__PURE__ */ jsxs(CardHeader, { children: [
              /* @__PURE__ */ jsx(CardTitle, { className: `text-lg font-bold ${theme === "dark" ? "text-white" : "text-gray-800"}`, children: "전략별 성과 비교" }),
              /* @__PURE__ */ jsx(CardDescription, { className: theme === "dark" ? "text-gray-400" : "text-gray-600", children: "활성 전략들의 주요 지표 비교" })
            ] }),
            /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsx("div", { className: "space-y-4", children: filteredStrategies.filter((s) => s.status === "active").slice(0, 3).map((strategy) => /* @__PURE__ */ jsxs("div", { className: `p-4 rounded-lg border ${theme === "dark" ? "bg-gray-700 border-gray-600" : "bg-gray-50 border-gray-200"}`, children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-2", children: [
                /* @__PURE__ */ jsx("span", { className: `font-medium ${theme === "dark" ? "text-white" : "text-gray-900"}`, children: strategy.name }),
                /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1", children: [
                  /* @__PURE__ */ jsx("div", { className: `text-xs font-medium ${theme === "dark" ? "text-gray-400" : "text-gray-900"}`, children: getTypeIcon(strategy.type) }),
                  /* @__PURE__ */ jsx(Badge, { variant: "outline", className: `text-xs font-medium ${theme === "dark" ? "text-gray-400 border-gray-600" : "text-gray-900 border-gray-200"}`, children: strategy.type })
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-3 gap-2 text-xs", children: [
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("div", { className: `${theme === "dark" ? "text-gray-400" : "text-gray-600"}`, children: "수익률" }),
                  /* @__PURE__ */ jsxs("div", { className: "text-green-500 font-medium", children: [
                    "+",
                    strategy.profitRate,
                    "%"
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("div", { className: `${theme === "dark" ? "text-gray-400" : "text-gray-600"}`, children: "승률" }),
                  /* @__PURE__ */ jsxs("div", { className: "text-blue-500 font-medium", children: [
                    strategy.winRate,
                    "%"
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("div", { className: `${theme === "dark" ? "text-gray-400" : "text-gray-600"}`, children: "최대낙폭" }),
                  /* @__PURE__ */ jsxs("div", { className: "text-red-500 font-medium", children: [
                    strategy.maxDrawdown,
                    "%"
                  ] })
                ] })
              ] })
            ] }, strategy.id)) }) })
          ] }),
          /* @__PURE__ */ jsxs(Card, { className: theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200", children: [
            /* @__PURE__ */ jsxs(CardHeader, { children: [
              /* @__PURE__ */ jsx(CardTitle, { className: `text-lg font-bold ${theme === "dark" ? "text-white" : "text-gray-800"}`, children: "전략 운영 가이드" }),
              /* @__PURE__ */ jsx(CardDescription, { className: theme === "dark" ? "text-gray-400" : "text-gray-600", children: "효과적인 전략 관리를 위한 팁" })
            ] }),
            /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
              /* @__PURE__ */ jsxs("div", { className: `p-3 rounded-lg ${theme === "dark" ? "bg-blue-900/20 border border-blue-700" : "bg-blue-50 border border-blue-200"}`, children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mb-2", children: [
                  /* @__PURE__ */ jsx(CheckCircle, { className: "w-4 h-4 text-blue-500" }),
                  /* @__PURE__ */ jsx("span", { className: `text-sm font-medium ${theme === "dark" ? "text-blue-300" : "text-blue-900"}`, children: "다양한 전략 조합" })
                ] }),
                /* @__PURE__ */ jsx("div", { className: `text-xs ${theme === "dark" ? "text-blue-200" : "text-blue-700"}`, children: "여러 유형의 전략을 조합하여 리스크를 분산하세요" })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: `p-3 rounded-lg ${theme === "dark" ? "bg-green-900/20 border border-green-700" : "bg-green-50 border border-green-200"}`, children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mb-2", children: [
                  /* @__PURE__ */ jsx(CheckCircle, { className: "w-4 h-4 text-green-500" }),
                  /* @__PURE__ */ jsx("span", { className: `text-sm font-medium ${theme === "dark" ? "text-green-300" : "text-green-900"}`, children: "정기적인 성과 점검" })
                ] }),
                /* @__PURE__ */ jsx("div", { className: `text-xs ${theme === "dark" ? "text-green-200" : "text-green-700"}`, children: "주기적으로 전략 성과를 검토하고 최적화하세요" })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: `p-3 rounded-lg ${theme === "dark" ? "bg-amber-900/20 border border-amber-700" : "bg-amber-50 border border-amber-200"}`, children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mb-2", children: [
                  /* @__PURE__ */ jsx(AlertCircle, { className: "w-4 h-4 text-amber-500" }),
                  /* @__PURE__ */ jsx("span", { className: `text-sm font-medium ${theme === "dark" ? "text-amber-300" : "text-amber-900"}`, children: "리스크 관리" })
                ] }),
                /* @__PURE__ */ jsx("div", { className: `text-xs ${theme === "dark" ? "text-amber-200" : "text-amber-700"}`, children: "최대낙폭이 큰 전략은 신중하게 운영하세요" })
              ] })
            ] }) })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsx(DashFooter, { theme })
    ] })
  ] });
};
const route19 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Strategy
}, Symbol.toStringTag, { value: "Module" }));
function Logout$1() {
  const navigate = useNavigate$1();
  const hasLoggedOut = useRef(false);
  useEffect(() => {
    if (!hasLoggedOut.current) {
      alert("로그인 해주세요.");
      hasLoggedOut.current = true;
      navigate("/admin/login");
    }
  }, []);
  return null;
}
const route20 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Logout$1
}, Symbol.toStringTag, { value: "Module" }));
const action$a = async ({ request }) => {
  const { email } = await request.json();
  const value = String(email);
  const form = new URLSearchParams();
  form.append("email", value ?? "");
  const res0 = await fetch("https://tradinggear.co.kr:8081/tradinggear/member_inform_get.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
      // ✅ JSON 형식 명시
    },
    body: form.toString()
  });
  const data1 = await res0.json();
  const API_KEY2 = data1[0]["decrypted_api_key"];
  const API_SECRET2 = data1[0]["decrypted_api_secret"];
  const timestamp = Date.now();
  const query = `timestamp=${timestamp}`;
  const signature = crypto.createHmac("sha256", API_SECRET2).update(query).digest("hex");
  const url = `https://fapi.binance.com/fapi/v2/positionRisk?${query}&signature=${signature}`;
  const res = await fetch(url, { headers: { "X-MBX-APIKEY": API_KEY2 } });
  const positions = await res.json();
  if (!Array.isArray(positions)) {
    throw new Response("Binance API 호출 실패", { status: 500 });
  }
  const activePositions = positions.filter(
    (p) => parseFloat(p.positionAmt) !== 0
  );
  const portfolio = activePositions.map((p, idx) => {
    const qty = Math.abs(parseFloat(p.positionAmt));
    const markPrice = parseFloat(p.markPrice);
    const entryPrice = parseFloat(p.entryPrice);
    const evaluationAmount = markPrice * qty;
    const profit = (markPrice - entryPrice) * qty * (parseFloat(p.positionAmt) > 0 ? 1 : -1);
    const profitRate = entryPrice > 0 ? profit / (entryPrice * qty) * 100 : 0;
    return {
      id: idx + 1,
      symbol: p.symbol,
      currentPrice: markPrice,
      averagePrice: entryPrice,
      quantity: qty,
      evaluationAmount,
      profit,
      profitRate,
      state: profit > 0 ? "profit" : profit < 0 ? "loss" : "neutral"
    };
  });
  return json(portfolio);
};
const route21 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$a
}, Symbol.toStringTag, { value: "Module" }));
const action$9 = async ({ request }) => {
  const { email } = await request.json();
  const value = String(email);
  const form = new URLSearchParams();
  form.append("email", value ?? "");
  const res0 = await fetch("https://tradinggear.co.kr:8081/tradinggear/member_inform_get.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
      // ✅ JSON 형식 명시
    },
    body: form.toString()
  });
  const data1 = await res0.json();
  const API_KEY2 = data1[0]["decrypted_api_key"];
  const API_SECRET2 = data1[0]["decrypted_api_secret"];
  const timestamp = Date.now();
  const query = `timestamp=${timestamp}`;
  const signature = crypto.createHmac("sha256", API_SECRET2).update(query).digest("hex");
  const url = `https://fapi.binance.com/fapi/v2/positionRisk?${query}&signature=${signature}`;
  const res = await fetch(url, { headers: { "X-MBX-APIKEY": API_KEY2 } });
  const positions = await res.json();
  if (!Array.isArray(positions)) {
    throw new Response("Binance API 호출 실패", { status: 500 });
  }
  const activePositions = positions.filter(
    (p) => parseFloat(p.positionAmt) !== 0
  );
  let totalUnrealizedProfit = 0;
  let totalInitialMargin = 0;
  for (const p of activePositions) {
    totalUnrealizedProfit += parseFloat(p.unRealizedProfit);
    totalInitialMargin += parseFloat(p.positionInitialMargin);
  }
  const totalROE = totalInitialMargin > 0 ? totalUnrealizedProfit / totalInitialMargin * 100 : 0;
  return json({
    totalUnrealizedProfit: totalUnrealizedProfit.toFixed(2),
    totalInitialMargin: totalInitialMargin.toFixed(2),
    totalROE: totalROE.toFixed(2)
  });
};
const route22 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$9
}, Symbol.toStringTag, { value: "Module" }));
const action$8 = async ({ request }) => {
  const data = await request.json();
  const acct_no = "12345678901";
  const host = "https://api.kiwoom.com";
  const tokenUrl = `${host}/oauth2/token`;
  const tokenHeaders = {
    "Content-Type": "application/json;charset=UTF-8"
  };
  const value = String(data.email);
  const form = new URLSearchParams();
  form.append("email", value ?? "");
  const res = await fetch("https://tradinggear.co.kr:8081/tradinggear/member_inform_get.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
      // ✅ JSON 형식 명시
    },
    body: form.toString()
  });
  const data1 = await res.json();
  const tokenData = {
    "grant_type": "client_credentials",
    "appkey": data1[0]["decrypted_api_key"],
    "secretkey": data1[0]["decrypted_api_secret"]
  };
  const tokenResponse = await fetch(tokenUrl, {
    method: "POST",
    headers: tokenHeaders,
    body: JSON.stringify(tokenData)
  });
  const tokenJson = await tokenResponse.json();
  const accessToken = tokenJson.token;
  const headers2 = {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${accessToken}`,
    "api-id": "kt00018"
    // TR명
  };
  const respEval = await fetch(`${host}/api/dostk/acnt`, {
    method: "POST",
    headers: headers2,
    body: JSON.stringify({ acct_no, dmst_stex_tp: "KRX", qry_tp: "1" })
  });
  const evalJson = await respEval.json();
  const total_evlu_amt = evalJson.tot_evlt_amt ?? 0;
  const headers3 = {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${accessToken}`,
    "api-id": "kt00001"
    // TR명
  };
  const respDeposit = await fetch(`${host}/api/dostk/acnt`, {
    method: "POST",
    headers: headers3,
    body: JSON.stringify({ acct_no, pwd: "", qry_tp: "2" })
  });
  const depositJson = await respDeposit.json();
  const deposit = depositJson.entr ?? 0;
  const headers4 = {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${accessToken}`,
    "api-id": "kt00001"
    // TR명
  };
  const respCredit = await fetch(`${host}/api/dostk/acnt`, {
    method: "POST",
    headers: headers4,
    body: JSON.stringify({ acct_no, dmst_stex_tp: "KRX", qry_tp: "2" })
  });
  const creditJson = await respCredit.json();
  const loan_sum = creditJson.loan_sum ?? 0;
  const totalAsset = Number(total_evlu_amt + deposit - loan_sum);
  return totalAsset;
};
const route23 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$8
}, Symbol.toStringTag, { value: "Module" }));
const action$7 = async ({ request }) => {
  const { email } = await request.json();
  const value = String(email);
  const form = new URLSearchParams();
  form.append("email", value ?? "");
  const res0 = await fetch("https://tradinggear.co.kr:8081/tradinggear/member_inform_get.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
      // ✅ JSON 형식 명시
    },
    body: form.toString()
  });
  const data1 = await res0.json();
  const API_KEY2 = data1[0]["decrypted_api_key"];
  const API_SECRET2 = data1[0]["decrypted_api_secret"];
  const timestamp = Date.now();
  const query = `limit=30&timestamp=${timestamp}`;
  const signature = crypto.createHmac("sha256", API_SECRET2).update(query).digest("hex");
  const apiUrl = `https://fapi.binance.com/fapi/v1/userTrades?${query}&signature=${signature}`;
  const res = await fetch(apiUrl, { headers: { "X-MBX-APIKEY": API_KEY2 } });
  const trades = await res.json();
  if (!Array.isArray(trades)) {
    throw new Response("Binance API 호출 실패", { status: 500 });
  }
  let cumulativePnl = 0;
  let initialCapital = 1e3;
  const chartData = [];
  trades.sort((a, b) => a.time - b.time).forEach((trade) => {
    const realizedPnl = parseFloat(trade.realizedPnl);
    parseFloat(trade.quoteQty);
    cumulativePnl += realizedPnl;
    const plPercent = cumulativePnl / initialCapital * 100;
    chartData.push({
      time: new Date(trade.time).toLocaleString("ko-KR", {
        year: "2-digit",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit"
      }),
      value: parseFloat(plPercent.toFixed(2))
    });
  });
  return json(chartData);
};
const route24 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$7
}, Symbol.toStringTag, { value: "Module" }));
const Assets = () => {
  const { theme, toggleTheme } = useThemeStore();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const positionData = [
    {
      symbol: "BTCUSDT",
      strategy: "전략 A",
      entryPrice: 3e4,
      unrealizedPnL: 200,
      currentPrice: 31e3,
      leverage: "10x"
    },
    {
      symbol: "ETHUSDT",
      strategy: "전략 B",
      entryPrice: 2e3,
      unrealizedPnL: -150,
      currentPrice: 1900,
      leverage: "5x"
    }
  ];
  const executionTimeline = [
    {
      action: "시작",
      details: "전략 A 시작",
      time: "09:00:01"
    },
    {
      action: "주문전송",
      details: "BTCUSDT 매수 주문",
      time: "09:00:02"
    },
    {
      action: "거래소응답",
      details: "주문 접수 완료",
      time: "09:00:02"
    },
    {
      action: "체결/거부/부분체결",
      details: "BTCUSDT 매수 체결 완료",
      time: "09:00:03"
    }
  ];
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
  return /* @__PURE__ */ jsxs("div", { className: `min-h-screen ${theme === "dark" ? "bg-gray-900" : "bg-gray-50"}`, children: [
    /* @__PURE__ */ jsx(
      DashSidebar,
      {
        theme,
        sidebarOpen,
        setSidebarOpen,
        activeMenu: "대시보드"
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: `transition-all duration-300 ${sidebarOpen ? "lg:ml-64" : "lg:ml-0"}`, children: [
      /* @__PURE__ */ jsx(
        DashHeader,
        {
          theme,
          toggleTheme,
          sidebarOpen,
          setSidebarOpen,
          title: "자산현황"
        }
      ),
      /* @__PURE__ */ jsx(DashNav, { activeTab: "assets" }),
      /* @__PURE__ */ jsxs("main", { className: "p-6", children: [
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-4 mb-8", children: [
          /* @__PURE__ */ jsxs(Card, { className: theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200", children: [
            /* @__PURE__ */ jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [
              /* @__PURE__ */ jsx(CardTitle, { className: `text-sm font-medium ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`, children: "총 자산" }),
              /* @__PURE__ */ jsx(Wallet, { className: "h-4 w-4 text-blue-500" })
            ] }),
            /* @__PURE__ */ jsxs(CardContent, { children: [
              /* @__PURE__ */ jsx("div", { className: `text-2xl font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`, children: "$12,450" }),
              /* @__PURE__ */ jsxs("p", { className: "text-xs text-green-500 flex items-center mt-1", children: [
                /* @__PURE__ */ jsx(ArrowUpRight, { className: "h-3 w-3 mr-1" }),
                "+2.5% 오늘"
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxs(Card, { className: theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200", children: [
            /* @__PURE__ */ jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [
              /* @__PURE__ */ jsx(CardTitle, { className: `text-sm font-medium ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`, children: "미실현 손익" }),
              /* @__PURE__ */ jsx(TrendingUp, { className: "h-4 w-4 text-green-500" })
            ] }),
            /* @__PURE__ */ jsxs(CardContent, { children: [
              /* @__PURE__ */ jsx("div", { className: "text-2xl font-bold text-green-500", children: "+$50" }),
              /* @__PURE__ */ jsxs("p", { className: "text-xs text-green-500 flex items-center mt-1", children: [
                /* @__PURE__ */ jsx(ArrowUpRight, { className: "h-3 w-3 mr-1" }),
                "활성 포지션"
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxs(Card, { className: theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200", children: [
            /* @__PURE__ */ jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [
              /* @__PURE__ */ jsx(CardTitle, { className: `text-sm font-medium ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`, children: "실현 손익 (당일)" }),
              /* @__PURE__ */ jsx(DollarSign, { className: "h-4 w-4 text-purple-500" })
            ] }),
            /* @__PURE__ */ jsxs(CardContent, { children: [
              /* @__PURE__ */ jsx("div", { className: "text-2xl font-bold text-purple-500", children: "+$120" }),
              /* @__PURE__ */ jsxs("p", { className: "text-xs text-purple-500 flex items-center mt-1", children: [
                /* @__PURE__ */ jsx(Target, { className: "h-3 w-3 mr-1" }),
                "목표 달성"
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxs(Card, { className: theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200", children: [
            /* @__PURE__ */ jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [
              /* @__PURE__ */ jsx(CardTitle, { className: `text-sm font-medium ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`, children: "활성 전략" }),
              /* @__PURE__ */ jsx(Activity, { className: "h-4 w-4 text-orange-500" })
            ] }),
            /* @__PURE__ */ jsxs(CardContent, { children: [
              /* @__PURE__ */ jsx("div", { className: "text-2xl font-bold text-orange-500", children: "4개" }),
              /* @__PURE__ */ jsxs("p", { className: "text-xs text-orange-500 flex items-center mt-1", children: [
                /* @__PURE__ */ jsx(Zap, { className: "h-3 w-3 mr-1" }),
                "실시간 운영중"
              ] })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "mb-8", children: /* @__PURE__ */ jsxs(Card, { className: theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200", children: [
          /* @__PURE__ */ jsxs(CardHeader, { children: [
            /* @__PURE__ */ jsxs(CardTitle, { className: `text-lg font-bold flex items-center gap-2 ${theme === "dark" ? "text-white" : "text-gray-800"}`, children: [
              /* @__PURE__ */ jsx(BarChart3, { className: "w-5 h-5 text-blue-500" }),
              "실시간 포지션/주문"
            ] }),
            /* @__PURE__ */ jsx(CardDescription, { className: theme === "dark" ? "text-gray-400" : "text-gray-600", children: "현재 활성 포지션 및 주문 현황" })
          ] }),
          /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsxs(Table, { children: [
            /* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { className: theme === "dark" ? "border-gray-700" : "border-gray-200", children: [
              /* @__PURE__ */ jsx(TableHead, { className: `text-center ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`, children: "종목/심볼" }),
              /* @__PURE__ */ jsx(TableHead, { className: `text-center ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`, children: "전략명" }),
              /* @__PURE__ */ jsx(TableHead, { className: `text-center ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`, children: "진입가/수량" }),
              /* @__PURE__ */ jsx(TableHead, { className: `text-center ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`, children: "미실현 PnL" }),
              /* @__PURE__ */ jsx(TableHead, { className: `text-center ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`, children: "현재가(선물)" }),
              /* @__PURE__ */ jsx(TableHead, { className: `text-center ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`, children: "레버리지" })
            ] }) }),
            /* @__PURE__ */ jsx(TableBody, { children: positionData.map((position, index) => /* @__PURE__ */ jsxs(
              TableRow,
              {
                className: `${theme === "dark" ? "border-gray-700 hover:bg-gray-750" : "border-gray-200 hover:bg-gray-50"} transition-colors`,
                children: [
                  /* @__PURE__ */ jsx(TableCell, { className: "text-center font-medium", children: /* @__PURE__ */ jsx("div", { className: `text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-700"} flex items-center justify-center gap-2`, children: position.symbol }) }),
                  /* @__PURE__ */ jsx(TableCell, { className: "text-center", children: /* @__PURE__ */ jsx(Badge, { variant: "outline", className: theme === "dark" ? "border-gray-600 text-gray-300" : "border-gray-300 text-gray-700", children: position.strategy }) }),
                  /* @__PURE__ */ jsx(TableCell, { className: "text-center", children: /* @__PURE__ */ jsxs("div", { className: `text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`, children: [
                    "$",
                    position.entryPrice.toLocaleString()
                  ] }) }),
                  /* @__PURE__ */ jsx(TableCell, { className: "text-center", children: /* @__PURE__ */ jsxs(Badge, { variant: position.unrealizedPnL > 0 ? "default" : "destructive", className: position.unrealizedPnL > 0 ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-100" : "", children: [
                    position.unrealizedPnL > 0 ? "+" : "",
                    "$",
                    position.unrealizedPnL
                  ] }) }),
                  /* @__PURE__ */ jsxs(TableCell, { className: `text-center font-medium ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`, children: [
                    "$",
                    position.currentPrice.toLocaleString()
                  ] }),
                  /* @__PURE__ */ jsx(TableCell, { className: "text-center", children: /* @__PURE__ */ jsx(Badge, { className: "bg-blue-100 text-blue-800 hover:bg-blue-100", children: position.leverage }) })
                ]
              },
              index
            )) })
          ] }) })
        ] }) }),
        /* @__PURE__ */ jsxs("div", { className: "flex gap-8 flex-col lg:flex-row", children: [
          /* @__PURE__ */ jsxs(Card, { className: `w-full lg:w-1/2 ${theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`, children: [
            /* @__PURE__ */ jsxs(CardHeader, { children: [
              /* @__PURE__ */ jsxs(CardTitle, { className: `text-lg font-bold flex items-center gap-2 ${theme === "dark" ? "text-white" : "text-gray-800"}`, children: [
                /* @__PURE__ */ jsx(Clock, { className: "w-5 h-5 text-purple-500" }),
                "체결 타임라인"
              ] }),
              /* @__PURE__ */ jsx(CardDescription, { className: theme === "dark" ? "text-gray-400" : "text-gray-600", children: "실시간 거래 실행 로그" })
            ] }),
            /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsxs(Table, { children: [
              /* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { className: theme === "dark" ? "border-gray-700" : "border-gray-200", children: [
                /* @__PURE__ */ jsx(TableHead, { className: `${theme === "dark" ? "text-gray-300" : "text-gray-700"}`, children: "액션" }),
                /* @__PURE__ */ jsx(TableHead, { className: `${theme === "dark" ? "text-gray-300" : "text-gray-700"}`, children: "세부사항" }),
                /* @__PURE__ */ jsx(TableHead, { className: `text-center ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`, children: "시각" })
              ] }) }),
              /* @__PURE__ */ jsx(TableBody, { children: executionTimeline.map((item, index) => /* @__PURE__ */ jsxs(
                TableRow,
                {
                  className: `${theme === "dark" ? "border-gray-700 hover:bg-gray-750" : "border-gray-200 hover:bg-gray-50"} transition-colors`,
                  children: [
                    /* @__PURE__ */ jsx(TableCell, { className: "", children: /* @__PURE__ */ jsx(Badge, { variant: "outline", className: theme === "dark" ? "border-gray-600 text-gray-300" : "border-gray-300 text-gray-700", children: item.action }) }),
                    /* @__PURE__ */ jsx(TableCell, { className: `${theme === "dark" ? "text-gray-300" : "text-gray-700"}`, children: item.details }),
                    /* @__PURE__ */ jsx(TableCell, { className: "text-center", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center gap-2", children: [
                      /* @__PURE__ */ jsx(Clock, { className: `${theme === "dark" ? "text-gray-300" : "text-blue-500"} w-3 h-3` }),
                      /* @__PURE__ */ jsx("span", { className: `${theme === "dark" ? "text-gray-300" : "text-gray-700"} font-mono text-sm`, children: item.time })
                    ] }) })
                  ]
                },
                index
              )) })
            ] }) })
          ] }),
          /* @__PURE__ */ jsxs(Card, { className: `w-full lg:w-1/2 ${theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`, children: [
            /* @__PURE__ */ jsxs(CardHeader, { children: [
              /* @__PURE__ */ jsxs(CardTitle, { className: `text-lg font-bold flex items-center gap-2 ${theme === "dark" ? "text-white" : "text-gray-800"}`, children: [
                /* @__PURE__ */ jsx(PieChart$1, { className: "w-5 h-5 text-green-500" }),
                "전일/당일 요약"
              ] }),
              /* @__PURE__ */ jsx(CardDescription, { className: theme === "dark" ? "text-gray-400" : "text-gray-600", children: "거래 성과 비교" })
            ] }),
            /* @__PURE__ */ jsxs(CardContent, { className: "space-y-4", children: [
              /* @__PURE__ */ jsxs("div", { className: `p-4 rounded-lg border ${theme === "dark" ? "bg-gray-700 border-gray-600" : "bg-gray-50 border-gray-200"}`, children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mb-3", children: [
                  /* @__PURE__ */ jsx(Calendar, { className: "w-4 h-4 text-blue-500" }),
                  /* @__PURE__ */ jsx("span", { className: `font-medium ${theme === "dark" ? "text-white" : "text-gray-900"}`, children: "어제" })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-3 text-sm", children: [
                  /* @__PURE__ */ jsxs("div", { children: [
                    /* @__PURE__ */ jsx("div", { className: `${theme === "dark" ? "text-gray-400" : "text-gray-600"}`, children: "실현수익" }),
                    /* @__PURE__ */ jsx("div", { className: "text-green-500 font-medium", children: "$350" })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { children: [
                    /* @__PURE__ */ jsx("div", { className: `${theme === "dark" ? "text-gray-400" : "text-gray-600"}`, children: "수수료" }),
                    /* @__PURE__ */ jsx("div", { className: "text-red-500 font-medium", children: "$50" })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { children: [
                    /* @__PURE__ */ jsx("div", { className: `${theme === "dark" ? "text-gray-400" : "text-gray-600"}`, children: "승/패 비율" }),
                    /* @__PURE__ */ jsx("div", { className: "text-blue-500 font-medium", children: "60%" })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { children: [
                    /* @__PURE__ */ jsx("div", { className: `${theme === "dark" ? "text-gray-400" : "text-gray-600"}`, children: "최대/최소" }),
                    /* @__PURE__ */ jsx("div", { className: "text-purple-500 font-medium", children: "120/80" })
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: `p-4 rounded-lg border ${theme === "dark" ? "bg-gray-700 border-gray-600" : "bg-gray-50 border-gray-200"}`, children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mb-3", children: [
                  /* @__PURE__ */ jsx(Timer, { className: "w-4 h-4 text-orange-500" }),
                  /* @__PURE__ */ jsx("span", { className: `font-medium ${theme === "dark" ? "text-white" : "text-gray-900"}`, children: "오늘" })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-3 text-sm", children: [
                  /* @__PURE__ */ jsxs("div", { children: [
                    /* @__PURE__ */ jsx("div", { className: `${theme === "dark" ? "text-gray-400" : "text-gray-600"}`, children: "실현수익" }),
                    /* @__PURE__ */ jsx("div", { className: "text-green-500 font-medium", children: "$120" })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { children: [
                    /* @__PURE__ */ jsx("div", { className: `${theme === "dark" ? "text-gray-400" : "text-gray-600"}`, children: "수수료" }),
                    /* @__PURE__ */ jsx("div", { className: "text-red-500 font-medium", children: "$25" })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { children: [
                    /* @__PURE__ */ jsx("div", { className: `${theme === "dark" ? "text-gray-400" : "text-gray-600"}`, children: "승/패 비율" }),
                    /* @__PURE__ */ jsx("div", { className: "text-blue-500 font-medium", children: "70%" })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { children: [
                    /* @__PURE__ */ jsx("div", { className: `${theme === "dark" ? "text-gray-400" : "text-gray-600"}`, children: "최대/최소" }),
                    /* @__PURE__ */ jsx("div", { className: "text-purple-500 font-medium", children: "110/90" })
                  ] })
                ] })
              ] })
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsx(DashFooter, { theme })
    ] })
  ] });
};
const route25 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Assets
}, Symbol.toStringTag, { value: "Module" }));
const Dashboard$1 = () => {
  const { theme, toggleTheme } = useThemeStore();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("home");
  const [chartPeriod, setChartPeriod] = useState("차트");
  const [chartDataByPeriod, setChartDataByPeriod] = useState({});
  const [portfolioData, setPortfolioData] = useState([]);
  const [autoTradingEnabled, setAutoTradingEnabled] = useState(true);
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [email, setemail] = useState("");
  const [nickName, setnickName] = useState("");
  const [remainAmount, setRemainAmount] = useState("");
  const [tradingCenter, setTradingCenter] = useState("");
  const [pastPred, setPastPred] = useState("");
  const [rateProfit, setrateProfit] = useState("");
  const [rateProfitPercent, setRateProfitPercent] = useState(0);
  const [recentTrades, setRecentTrades] = useState([]);
  const [stockHeld, setStockHeld] = useState(0);
  const [todayTradesCount, setTodayTradesCount] = useState(0);
  useEffect(() => {
    const fetchData = async () => {
      console.log(tradingCenter);
      const value = String(sessionStorage.getItem("email"));
      const form = new URLSearchParams();
      form.append("email", value ?? "");
      const res = await fetch("https://tradinggear.co.kr:8081/tradinggear/member_inform_get.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
          // ✅ JSON 형식 명시
        },
        body: form.toString()
      });
      const data1 = await res.json();
      if (data1[0]["trading_center"] == "kium") {
        document.getElementById("tradeText").textContent = "키움증권";
        const res2 = await fetch("/etc_inform_kium", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            email: String(sessionStorage.getItem("email"))
          })
        });
        const text2 = await res2.text();
        setPastPred(text2);
        const res3 = await fetch("/total_amount_kium", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            email: String(sessionStorage.getItem("email"))
          })
        });
        const text = await res3.text();
        setRemainAmount(text);
        const res32 = await fetch("/etc_inform_kium2", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            email: String(sessionStorage.getItem("email"))
          })
        });
        const text3 = await res32.json();
        setrateProfit(text3.tot_evlt_pl);
        setRateProfitPercent(text3.tot_prft_rt);
        const res4 = await fetch("/etc_inform_kium3", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            email: String(sessionStorage.getItem("email"))
          })
        });
        const text4 = await res4.json();
        setStockHeld(text4.count);
        const res5 = await fetch("/rate_return_inform_kium3", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            email: String(sessionStorage.getItem("email"))
          })
        });
        const text5 = await res5.json();
        let newArray = ["차트"];
        let portfolioArray = [];
        let recentTradesArray = [];
        if (Array.isArray(text5)) {
          newArray = text5.map((item) => ({
            time: "",
            value: item.pl_rt
          }));
          portfolioArray = text5.map((item) => ({
            id: 1,
            symbol: item.stk_nm,
            company: "",
            currentPrice: item.cur_prc,
            averagePrice: item.evltv_prft,
            quantity: item.pur_amt,
            evaluationAmount: item.evlt_amt,
            profitRate: item.pl_r,
            strategyApply: true,
            state: item.pl_r > 0 ? "profit" : "loss"
          }));
          recentTradesArray = text5.map((item) => ({
            id: 1,
            symbol: item.stk_nm,
            type: "SELL",
            price: "",
            time: "",
            amount: item.pur_amt,
            profitRate: item.pl_r
          }));
        }
        setChartDataByPeriod({ 차트: newArray });
        setPortfolioData(portfolioArray);
        setRecentTrades(recentTradesArray);
      } else if (data1[0]["trading_center"] == "binance") {
        document.getElementById("tradeText").textContent = "바이낸스";
        const res2 = await fetch("https://tradinggear.co.kr:777/api/fapi/daily_change", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            email: String(sessionStorage.getItem("email"))
          })
        });
        const text = await res2.json();
        setRemainAmount(text.current_total);
        setPastPred(text.change_pct.toFixed(2));
        const res3 = await fetch("https://tradinggear.co.kr:777/api/fapi/pnl", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            email: String(sessionStorage.getItem("email"))
          })
        });
        const text3 = await res3.json();
        setrateProfit(text3.totals.unRealizedProfit);
        setRateProfitPercent(text3.totals.roi_pct.toFixed(2));
        const res4 = await fetch("https://tradinggear.co.kr:777/api/fapi/holdings/count", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            email: String(sessionStorage.getItem("email"))
          })
        });
        const text4 = await res4.json();
        setStockHeld(text4.positions_count);
        const res5 = await fetch("https://tradinggear.co.kr:777/recent-trades/all/flat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            email: String(sessionStorage.getItem("email"))
          })
        });
        const text5 = await res5.json();
        text5.recentTradesArray;
        const arr = Array.isArray(text5 == null ? void 0 : text5.recentTradesArray) ? text5.recentTradesArray : [];
        const recentTradesArray = arr.map((item) => ({
          id: item.id,
          symbol: item.symbol,
          type: item.type,
          price: item.price,
          time: item.time,
          amount: item.amount,
          // profitRate가 없으면 null, 있으면 숫자
          profitRate: item.profitRate === null || item.profitRate === void 0 || item.profitRate === "" ? null : item.profitRate.toFixed(2)
        }));
        console.log(recentTradesArray);
        setRecentTrades(recentTradesArray);
        const res6 = await fetch("https://tradinggear.co.kr:777/roe/series", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: sessionStorage.getItem("email"), basis: "prev", limit: 30 })
        });
        const js = await res6.json();
        const newArray = js.data.map((d) => ({ time: d.time, value: d.value }));
        console.log(newArray);
        setChartDataByPeriod({ 차트: newArray });
        const res7 = await fetch("https://tradinggear.co.kr:777/fapi/portfolio", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: sessionStorage.getItem("email") })
        });
        const portfolio = await res7.json();
        setPortfolioData(portfolio);
      } else {
        document.getElementById("tradeText").textContent = "미설정";
      }
    };
    fetchData();
  }, []);
  useEffect(() => {
    if (selectedRows.length === portfolioData.length && portfolioData.length > 0) {
      setSelectAll(true);
    } else {
      setSelectAll(false);
    }
  }, [selectedRows, portfolioData]);
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
  const getStatusBadge = (상태, 수익률) => {
    if (상태 === "profit") {
      return /* @__PURE__ */ jsx(Badge, { className: "bg-emerald-100 text-emerald-800 hover:bg-emerald-100", children: "수익" });
    } else if (상태 === "loss") {
      return /* @__PURE__ */ jsx(Badge, { variant: "destructive", children: "손실" });
    } else {
      return /* @__PURE__ */ jsx(Badge, { variant: "secondary", children: "보합" });
    }
  };
  const formatToKoreanUnit = (value) => {
    if (value >= 1e8) {
      return `${(value / 1e8).toFixed(1)}억`;
    } else if (value >= 1e4) {
      return `${(value / 1e4).toFixed(0)}만`;
    } else {
      return value.toLocaleString();
    }
  };
  const strategyPerformance = [
    { strategyName: "RSI 역추세", profitRate: 12.5, winRate: 68.2, maxDrop: -3.8 },
    { strategyName: "볼린저밴드", profitRate: 8.3, winRate: 72.5, maxDrop: -2.1 },
    { strategyName: "이동평균 돌파", profitRate: 15.2, winRate: 65.8, maxDrop: -5.2 }
  ];
  return /* @__PURE__ */ jsxs("div", { className: `min-h-screen ${theme === "dark" ? "bg-gray-900" : "bg-gray-50"}`, children: [
    /* @__PURE__ */ jsx(
      DashSidebar,
      {
        theme,
        sidebarOpen,
        setSidebarOpen,
        activeMenu: "대시보드"
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: `transition-all duration-300 ${sidebarOpen ? "lg:ml-64" : "lg:ml-0"}`, children: [
      /* @__PURE__ */ jsx(
        DashHeader,
        {
          theme,
          toggleTheme,
          sidebarOpen,
          setSidebarOpen,
          title: "대시보드"
        }
      ),
      /* @__PURE__ */ jsx(DashNav, { activeTab: "dashboard" }),
      /* @__PURE__ */ jsxs("main", { className: "p-6", children: [
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6 mb-8", children: [
          /* @__PURE__ */ jsxs("div", { className: `rounded-xl shadow-lg p-6 border ${theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`, children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-4", children: [
              /* @__PURE__ */ jsx("div", { className: `text-sm font-medium ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`, children: "총 자산" }),
              /* @__PURE__ */ jsx(DollarSign, { className: "w-5 h-5 text-green-500" })
            ] }),
            /* @__PURE__ */ jsx("div", { className: `text-2xl font-bold ${theme === "dark" ? "text-white" : "text-gray-900"} mb-2`, children: remainAmount }),
            /* @__PURE__ */ jsxs("div", { className: "text-green-500 text-sm", children: [
              "전일 대비 ",
              pastPred,
              "%"
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: `rounded-xl shadow-lg p-6 border ${theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`, children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-4", children: [
              /* @__PURE__ */ jsx("div", { className: `text-sm font-medium ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`, children: "평가손익" }),
              /* @__PURE__ */ jsx(TrendingUp, { className: "w-5 h-5 text-blue-500" })
            ] }),
            /* @__PURE__ */ jsx("div", { className: `text-2xl font-bold text-blue-500 mb-2`, children: rateProfit }),
            /* @__PURE__ */ jsxs("div", { className: "text-blue-500 text-sm", children: [
              "수익률 ",
              rateProfitPercent,
              "%"
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: `rounded-xl shadow-lg p-6 border ${theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`, children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-4", children: [
              /* @__PURE__ */ jsx("div", { className: `text-sm font-medium ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`, children: "보유품목" }),
              /* @__PURE__ */ jsx(Activity, { className: "w-5 h-5 text-purple-500" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: `text-2xl font-bold text-purple-500 mb-2`, children: [
              stockHeld,
              "종목"
            ] }),
            /* @__PURE__ */ jsx("div", { className: "text-purple-500 text-sm", children: "활성 전략 3개" })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8", children: [
          /* @__PURE__ */ jsxs("div", { className: `rounded-xl shadow-lg p-6 border ${theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`, children: [
            /* @__PURE__ */ jsx("div", { className: "flex items-center justify-between mb-4", children: /* @__PURE__ */ jsx("h3", { className: `text-lg font-bold ${theme === "dark" ? "text-white" : "text-gray-800"}`, children: "자동매매" }) }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxs("div", { className: `flex justify-between items-center border p-4 rounded-lg ${theme === "dark" ? "border-gray-700" : "border-gray-200"}`, children: [
                /* @__PURE__ */ jsx("span", { className: `text-md font-medium ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`, children: "활성화될 전략 수" }),
                /* @__PURE__ */ jsx("span", { className: `font-semibold ${theme === "dark" ? "text-white" : "text-gray-900"}`, children: "3개" })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: `flex justify-between items-center border p-4 rounded-lg ${theme === "dark" ? "border-gray-700" : "border-gray-200"}`, children: [
                /* @__PURE__ */ jsx("span", { className: `text-md font-medium ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`, children: "금일 거래" }),
                /* @__PURE__ */ jsxs("span", { className: `font-semibold text-green-500`, children: [
                  todayTradesCount,
                  "회"
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: `border p-4 rounded-lg ${theme === "dark" ? "border-gray-700" : "border-gray-200"}`, children: [
                /* @__PURE__ */ jsxs("div", { className: `flex justify-between items-center text-md font-medium mb-2 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`, children: [
                  /* @__PURE__ */ jsx("span", { className: "", children: "최근 체결내역" }),
                  /* @__PURE__ */ jsx(
                    "button",
                    {
                      onClick: () => setAutoTradingEnabled(!autoTradingEnabled),
                      className: `relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${autoTradingEnabled ? "bg-green-500" : "bg-gray-300 dark:bg-gray-600"}`,
                      children: /* @__PURE__ */ jsx("span", { className: `inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${autoTradingEnabled ? "translate-x-5" : "translate-x-1"}` })
                    }
                  )
                ] }),
                autoTradingEnabled && /* @__PURE__ */ jsx("div", { className: "pt-2 space-y-2", children: recentTrades.slice(0, 3).map((trade) => /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center text-xs", children: [
                  /* @__PURE__ */ jsxs("span", { className: `${theme === "dark" ? "text-gray-400" : "text-gray-600"}`, children: [
                    trade.symbol,
                    " ",
                    trade.type
                  ] }),
                  /* @__PURE__ */ jsx("span", { className: `text-green-500`, children: trade.profitRate })
                ] }, trade.id)) })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: `rounded-xl shadow-lg p-6 border ${theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`, children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-4", children: [
              /* @__PURE__ */ jsx("h3", { className: `text-lg font-bold ${theme === "dark" ? "text-white" : "text-gray-800"}`, children: "손익률 차트" }),
              /* @__PURE__ */ jsx("div", { className: "flex space-x-2", children: ["차트"].map((period) => /* @__PURE__ */ jsx(
                "button",
                {
                  onClick: () => setChartPeriod(period),
                  className: `px-3 py-1 text-xs rounded transition-colors ${chartPeriod === period ? "bg-blue-500 text-white" : theme === "dark" ? "bg-gray-700 text-gray-300 hover:bg-gray-600" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`,
                  children: period
                },
                period
              )) })
            ] }),
            /* @__PURE__ */ jsx(ResponsiveContainer, { width: "100%", height: 250, children: /* @__PURE__ */ jsxs(AreaChart, { data: chartDataByPeriod[chartPeriod], children: [
              /* @__PURE__ */ jsx("defs", { children: /* @__PURE__ */ jsxs("linearGradient", { id: "colorValue", x1: "0", y1: "0", x2: "0", y2: "1", children: [
                /* @__PURE__ */ jsx("stop", { offset: "5%", stopColor: "#3B82F6", stopOpacity: 0.3 }),
                /* @__PURE__ */ jsx("stop", { offset: "95%", stopColor: "#3B82F6", stopOpacity: 0 })
              ] }) }),
              /* @__PURE__ */ jsx(CartesianGrid, { strokeDasharray: "3 3", stroke: theme === "dark" ? "#374151" : "#e5e7eb" }),
              /* @__PURE__ */ jsx(XAxis, { dataKey: "time", stroke: theme === "dark" ? "#9ca3af" : "#6b7280" }),
              /* @__PURE__ */ jsx(YAxis, { stroke: theme === "dark" ? "#9ca3af" : "#6b7280", tickFormatter: formatToKoreanUnit }),
              /* @__PURE__ */ jsx(
                Tooltip,
                {
                  contentStyle: {
                    backgroundColor: theme === "dark" ? "#1f2937" : "#ffffff",
                    border: `1px solid ${theme === "dark" ? "#374151" : "#e5e7eb"}`,
                    borderRadius: "8px",
                    color: theme === "dark" ? "#ffffff" : "#000000"
                  },
                  formatter: (value) => formatToKoreanUnit(value)
                }
              ),
              /* @__PURE__ */ jsx(Area, { type: "monotone", dataKey: "value", stroke: "#3B82F6", fillOpacity: 1, fill: "url(#colorValue)", strokeWidth: 2 })
            ] }) })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: `rounded-xl border ${theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"} mb-8`, children: [
          /* @__PURE__ */ jsx("div", { className: "flex items-center justify-between p-6", children: /* @__PURE__ */ jsx("h3", { id: "tradeText", className: `text-2xl font-bold tracking-tight ${theme === "dark" ? "text-white" : "text-gray-900"}` }) }),
          /* @__PURE__ */ jsx("div", { className: `relative overflow-hidden border-t text-center ${theme === "dark" ? "border-gray-700" : "border-gray-200"}`, children: /* @__PURE__ */ jsxs(Table, { children: [
            /* @__PURE__ */ jsxs("colgroup", { children: [
              /* @__PURE__ */ jsx("col", { className: "w-1/12" }),
              /* @__PURE__ */ jsx("col", { className: "w-2/12" }),
              /* @__PURE__ */ jsx("col", { className: "w-2/12" }),
              /* @__PURE__ */ jsx("col", { className: "w-2/12" }),
              /* @__PURE__ */ jsx("col", { className: "w-1/12" }),
              /* @__PURE__ */ jsx("col", { className: "w-2/12" }),
              /* @__PURE__ */ jsx("col", { className: "w-1/12" }),
              /* @__PURE__ */ jsx("col", { className: "w-1/12" })
            ] }),
            /* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { className: theme === "dark" ? "border-gray-700" : "border-gray-200", children: [
              /* @__PURE__ */ jsx(TableHead, { className: `text-center ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`, children: "상태" }),
              /* @__PURE__ */ jsx(TableHead, { className: `text-center ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`, children: "종목" }),
              /* @__PURE__ */ jsx(TableHead, { className: `text-center ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`, children: "현재가" }),
              /* @__PURE__ */ jsx(TableHead, { className: `text-center ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`, children: "평가손익" }),
              /* @__PURE__ */ jsx(TableHead, { className: `text-center ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`, children: "매입금액" }),
              /* @__PURE__ */ jsx(TableHead, { className: `text-center ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`, children: "평가금액" }),
              /* @__PURE__ */ jsx(TableHead, { className: `text-center ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`, children: "수익률" }),
              /* @__PURE__ */ jsx(TableHead, { className: "w-12" })
            ] }) }),
            /* @__PURE__ */ jsx(TableBody, { children: portfolioData.slice(0, 10).map((item) => /* @__PURE__ */ jsxs(
              TableRow,
              {
                className: `${theme === "dark" ? "border-gray-700 hover:bg-gray-750" : "border-gray-200 hover:bg-gray-50"} transition-colors`,
                children: [
                  /* @__PURE__ */ jsx(TableCell, { className: "text-center", children: getStatusBadge(item.state, item.profitRate) }),
                  /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-3 text-left", children: [
                    /* @__PURE__ */ jsx("div", { className: `w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${item.symbol === "TSLA" ? "bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300" : item.symbol === "NVDA" ? "bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300" : item.symbol === "AMZN" ? "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300" : "bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-300"}` }),
                    /* @__PURE__ */ jsxs("div", { children: [
                      /* @__PURE__ */ jsx("div", { className: `font-medium ${theme === "dark" ? "text-white" : "text-gray-900"}`, children: item.symbol }),
                      /* @__PURE__ */ jsx("div", { className: `text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-500"}` })
                    ] })
                  ] }) }),
                  /* @__PURE__ */ jsxs(TableCell, { className: theme === "dark" ? "text-gray-300" : "text-gray-700", children: [
                    /* @__PURE__ */ jsxs("div", { className: "font-medium", children: [
                      "₩",
                      item.currentPrice.toLocaleString()
                    ] }),
                    /* @__PURE__ */ jsxs("div", { className: `text-xs ${item.profitRate > 0 ? "text-emerald-600" : "text-red-600"}`, children: [
                      item.profitRate > 0 ? "+" : "",
                      item.profitRate.toFixed(2),
                      "%"
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxs(TableCell, { className: `font-medium ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`, children: [
                    "₩",
                    item.averagePrice.toLocaleString()
                  ] }),
                  /* @__PURE__ */ jsxs(TableCell, { className: `font-medium ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`, children: [
                    item.quantity,
                    "주"
                  ] }),
                  /* @__PURE__ */ jsxs(TableCell, { className: `text-center font-semibold ${theme === "dark" ? "text-white" : "text-gray-900"}`, children: [
                    "₩",
                    item.evaluationAmount.toLocaleString()
                  ] }),
                  /* @__PURE__ */ jsx(TableCell, { className: "text-center", children: /* @__PURE__ */ jsxs(Badge, { variant: item.profitRate > 0 ? "default" : "destructive", className: item.profitRate > 0 ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-100" : "", children: [
                    item.profitRate > 0 ? "+" : "",
                    item.profitRate,
                    "%"
                  ] }) }),
                  /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsxs(DropdownMenu, { children: [
                    /* @__PURE__ */ jsx(DropdownMenuTrigger, { asChild: true, children: /* @__PURE__ */ jsxs(Button, { variant: "ghost", className: "h-8 w-8 p-0", children: [
                      /* @__PURE__ */ jsx("span", { className: "sr-only", children: "Open menu" }),
                      /* @__PURE__ */ jsx(MoreHorizontal, { className: "h-4 w-4" })
                    ] }) }),
                    /* @__PURE__ */ jsxs(DropdownMenuContent, { align: "end", className: theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200", children: [
                      /* @__PURE__ */ jsx(DropdownMenuItem, { onClick: () => console.log("전략 적용/해제"), className: theme === "dark" ? "text-gray-300 hover:bg-gray-700" : "text-gray-700 hover:bg-gray-100", children: item.strategyApply ? "전략 해제" : "전략 적용" }),
                      /* @__PURE__ */ jsx(DropdownMenuItem, { onClick: () => console.log("매도 주문"), className: theme === "dark" ? "text-gray-300 hover:bg-gray-700" : "text-gray-700 hover:bg-gray-100", children: "매도 주문" }),
                      /* @__PURE__ */ jsx(DropdownMenuItem, { onClick: () => console.log("상세 정보"), className: theme === "dark" ? "text-gray-300 hover:bg-gray-700" : "text-gray-700 hover:bg-gray-100", children: "상세 정보" })
                    ] })
                  ] }) })
                ]
              },
              item.id
            )) })
          ] }) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8", children: [
          /* @__PURE__ */ jsxs("div", { className: `rounded-xl shadow-lg p-6 border ${theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`, children: [
            /* @__PURE__ */ jsx("h3", { className: `text-lg font-bold mb-4 ${theme === "dark" ? "text-white" : "text-gray-800"}`, children: "최근 알림" }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
              /* @__PURE__ */ jsxs("div", { className: `p-3 rounded-lg ${theme === "dark" ? "bg-gray-700" : "bg-blue-50"}`, children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-2", children: [
                  /* @__PURE__ */ jsx("span", { className: `text-sm font-medium ${theme === "dark" ? "text-white" : "text-blue-900"}`, children: "전체 체결내역" }),
                  /* @__PURE__ */ jsx(CheckCircle, { className: "w-4 h-4 text-green-500" })
                ] }),
                /* @__PURE__ */ jsx("div", { className: `text-xs ${theme === "dark" ? "text-gray-300" : "text-blue-700"}`, children: "금일 총 12회 거래 완료" })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: `p-3 rounded-lg ${theme === "dark" ? "bg-gray-700" : "bg-green-50"}`, children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-2", children: [
                  /* @__PURE__ */ jsx("span", { className: `text-sm font-medium ${theme === "dark" ? "text-white" : "text-green-900"}`, children: "승률" }),
                  /* @__PURE__ */ jsx(TrendingUp, { className: "w-4 h-4 text-green-500" })
                ] }),
                /* @__PURE__ */ jsx("div", { className: `text-xs ${theme === "dark" ? "text-gray-300" : "text-green-700"}`, children: "현재 승률 68.2% (목표 대비 +3.2%)" })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: `p-3 rounded-lg ${theme === "dark" ? "bg-gray-700" : "bg-orange-50"}`, children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-2", children: [
                  /* @__PURE__ */ jsx("span", { className: `text-sm font-medium ${theme === "dark" ? "text-white" : "text-orange-900"}`, children: "최대낙폭" }),
                  /* @__PURE__ */ jsx(AlertCircle, { className: "w-4 h-4 text-orange-500" })
                ] }),
                /* @__PURE__ */ jsx("div", { className: `text-xs ${theme === "dark" ? "text-gray-300" : "text-orange-700"}`, children: "현재 -2.1% (안전 구간)" })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: `rounded-xl shadow-lg p-6 border ${theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`, children: [
            /* @__PURE__ */ jsx("h3", { className: `text-lg font-bold mb-4 ${theme === "dark" ? "text-white" : "text-gray-800"}`, children: "전략성과요약" }),
            /* @__PURE__ */ jsx("div", { className: "space-y-4", children: strategyPerformance.map((strategy, index) => /* @__PURE__ */ jsxs("div", { className: `p-4 rounded-lg border ${theme === "dark" ? "bg-gray-700 border-gray-600" : "bg-gray-50 border-gray-200"}`, children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-2", children: [
                /* @__PURE__ */ jsx("span", { className: `font-medium ${theme === "dark" ? "text-white" : "text-gray-900"}`, children: strategy.strategyName }),
                /* @__PURE__ */ jsx(Brain, { className: "w-4 h-4 text-purple-500" })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-3 gap-2 text-xs", children: [
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("div", { className: `${theme === "dark" ? "text-gray-400" : "text-gray-600"}`, children: "수익률" }),
                  /* @__PURE__ */ jsxs("div", { className: "text-green-500 font-medium", children: [
                    "+",
                    strategy.profitRate,
                    "%"
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("div", { className: `${theme === "dark" ? "text-gray-400" : "text-gray-600"}`, children: "승률" }),
                  /* @__PURE__ */ jsxs("div", { className: "text-blue-500 font-medium", children: [
                    strategy.winRate,
                    "%"
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("div", { className: `${theme === "dark" ? "text-gray-400" : "text-gray-600"}`, children: "최대낙폭" }),
                  /* @__PURE__ */ jsxs("div", { className: "text-red-500 font-medium", children: [
                    strategy.maxDrop,
                    "%"
                  ] })
                ] })
              ] })
            ] }, index)) })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsx(DashFooter, { theme })
    ] })
  ] });
};
const route26 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Dashboard$1
}, Symbol.toStringTag, { value: "Module" }));
const Dashboard = () => {
  const { theme, toggleTheme } = useThemeStore();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("home");
  const [chartPeriod, setChartPeriod] = useState("차트");
  const [chartDataByPeriod, setChartDataByPeriod] = useState({});
  const [portfolioData, setPortfolioData] = useState([]);
  const [autoTradingEnabled, setAutoTradingEnabled] = useState(true);
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [email, setemail] = useState("");
  const [nickName, setnickName] = useState("");
  const [remainAmount, setRemainAmount] = useState("");
  const [tradingCenter, setTradingCenter] = useState("");
  const [pastPred, setPastPred] = useState("");
  const [rateProfit, setrateProfit] = useState("");
  const [rateProfitPercent, setRateProfitPercent] = useState("");
  const [recentTrades, setRecentTrades] = useState([]);
  const [stockHeld, setStockHeld] = useState("");
  const [todayTradesCount, setTodayTradesCount] = useState(0);
  useEffect(() => {
    const fetchData = async () => {
      console.log(tradingCenter);
      const value = String(sessionStorage.getItem("email"));
      const form = new URLSearchParams();
      form.append("email", value ?? "");
      const res = await fetch("https://tradinggear.co.kr:8081/tradinggear/member_inform_get.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
          // ✅ JSON 형식 명시
        },
        body: form.toString()
      });
      const data1 = await res.json();
      if (data1[0]["trading_center"] == "kium") {
        document.getElementById("tradeText").textContent = "키움증권";
        const res2 = await fetch("/etc_inform_kium", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            email: String(sessionStorage.getItem("email"))
          })
        });
        const text2 = await res2.text();
        setPastPred(text2);
        const res3 = await fetch("/total_amount_kium", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            email: String(sessionStorage.getItem("email"))
          })
        });
        const text = await res3.text();
        setRemainAmount(text);
        const res32 = await fetch("/etc_inform_kium2", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            email: String(sessionStorage.getItem("email"))
          })
        });
        const text3 = await res32.json();
        setrateProfit(text3.tot_evlt_pl);
        setRateProfitPercent(text3.tot_prft_rt);
        const res4 = await fetch("/etc_inform_kium3", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            email: String(sessionStorage.getItem("email"))
          })
        });
        const text4 = await res4.json();
        setStockHeld(text4.count);
        const res5 = await fetch("/rate_return_inform_kium3", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            email: String(sessionStorage.getItem("email"))
          })
        });
        const text5 = await res5.json();
        let newArray = ["차트"];
        let portfolioArray = [];
        let recentTradesArray = [];
        if (Array.isArray(text5)) {
          newArray = text5.map((item) => ({
            time: "",
            value: item.pl_rt
          }));
          portfolioArray = text5.map((item) => ({
            id: 1,
            symbol: item.stk_nm,
            company: "",
            currentPrice: item.cur_prc,
            averagePrice: item.evltv_prft,
            quantity: item.pur_amt,
            evaluationAmount: item.evlt_amt,
            profitRate: item.pl_r,
            strategyApply: true,
            state: item.pl_r > 0 ? "profit" : "loss"
          }));
          recentTradesArray = text5.map((item) => ({
            id: 1,
            symbol: item.stk_nm,
            type: "SELL",
            price: "",
            time: "",
            amount: item.pur_amt,
            profitRate: item.pl_r
          }));
        }
        setChartDataByPeriod({ 차트: newArray });
        setPortfolioData(portfolioArray);
        setRecentTrades(recentTradesArray);
      } else if (data1[0]["trading_center"] == "binance") {
        document.getElementById("tradeText").textContent = "바이낸스";
        const res2 = await fetch("/binance_total_amount3", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            email: String(sessionStorage.getItem("email"))
          })
        });
        const text = await res2.json();
        setRemainAmount(text.totalMarginBalance);
        const res22 = await fetch("/binance_past_percent", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            email: String(sessionStorage.getItem("email"))
          })
        });
        const text2 = await res22.json();
        setPastPred(text2.changePercent);
        const res3 = await fetch("/binance_total_roe", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            email: String(sessionStorage.getItem("email"))
          })
        });
        const text3 = await res3.json();
        setrateProfit(text3.totalUnrealizedProfit);
        setRateProfitPercent(text3.totalROE);
        const res4 = await fetch("/binance_count", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            email: String(sessionStorage.getItem("email"))
          })
        });
        const text4 = await res4.json();
        setStockHeld(text4.totalCount);
        const res5 = await fetch("/binance_recent_trades", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            email: String(sessionStorage.getItem("email"))
          })
        });
        const text5 = await res5.json();
        let newArray = [];
        let recentTradesArray = [];
        if (Array.isArray(text5)) {
          recentTradesArray = text5.map((item) => ({
            id: item.orderId,
            symbol: item.symbol,
            type: item.side,
            price: item.price,
            time: item.time,
            amount: item.qty,
            profitRate: item.roe
          }));
        }
        setRecentTrades(recentTradesArray);
        const res6 = await fetch("/binance_pl_chart", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            email: String(sessionStorage.getItem("email"))
          })
        });
        const text6 = await res6.json();
        if (Array.isArray(text6)) {
          newArray = text6.map((item) => ({
            time: item.time,
            value: item.value
          }));
        }
        setChartDataByPeriod({ 차트: newArray });
        const res7 = await fetch("/binance_today_trades2", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            email: String(sessionStorage.getItem("email"))
          })
        });
        const text7 = await res7.json();
        setTodayTradesCount(text7.count);
      } else {
        document.getElementById("tradeText").textContent = "미설정";
      }
    };
    fetchData();
  }, []);
  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const res = await fetch("/binance_portfolio", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            email: String(sessionStorage.getItem("email"))
          })
        });
        const data = await res.json();
        console.log("원본 데이터:", data);
        let portfolioArray = [];
        if (Array.isArray(data)) {
          portfolioArray = data.map((item, index) => ({
            id: index + 1,
            symbol: item.symbol,
            currentPrice: Number(item.currentPrice || 0),
            averagePrice: Number(item.averagePrice || 0),
            quantity: Number(item.qty || 0),
            evaluationAmount: Number(item.currentPrice || 0) * Number(item.qty || 0),
            profit: Number(item.unrealizedProfit || 0),
            profitRate: Number(item.roe || 0),
            state: Number(item.roe || 0) > 0 ? "profit" : Number(item.roe || 0) < 0 ? "loss" : "neutral"
          }));
        } else if (Array.isArray(data.data)) {
          portfolioArray = data.data.map((item, index) => ({
            id: index + 1,
            symbol: item.symbol,
            currentPrice: Number(item.currentPrice || 0),
            averagePrice: Number(item.averagePrice || 0),
            quantity: Number(item.qty || 0),
            evaluationAmount: Number(item.currentPrice || 0) * Number(item.qty || 0),
            profit: Number(item.unrealizedProfit || 0),
            profitRate: Number(item.roe || 0),
            state: Number(item.roe || 0) > 0 ? "profit" : Number(item.roe || 0) < 0 ? "loss" : "neutral"
          }));
        }
        setPortfolioData(portfolioArray);
      } catch (err) {
        console.error("포트폴리오 로딩 오류:", err);
        setPortfolioData([]);
      }
    };
    fetchPortfolio();
    const interval = setInterval(fetchPortfolio, 6e4);
    return () => clearInterval(interval);
  }, []);
  useEffect(() => {
    if (selectedRows.length === portfolioData.length && portfolioData.length > 0) {
      setSelectAll(true);
    } else {
      setSelectAll(false);
    }
  }, [selectedRows, portfolioData]);
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
  const getStatusBadge = (상태, 수익률) => {
    if (상태 === "profit") {
      return /* @__PURE__ */ jsx(Badge, { className: "bg-emerald-100 text-emerald-800 hover:bg-emerald-100", children: "수익" });
    } else if (상태 === "loss") {
      return /* @__PURE__ */ jsx(Badge, { variant: "destructive", children: "손실" });
    } else {
      return /* @__PURE__ */ jsx(Badge, { variant: "secondary", children: "보합" });
    }
  };
  const formatToKoreanUnit = (value) => {
    if (value >= 1e8) {
      return `${(value / 1e8).toFixed(1)}억`;
    } else if (value >= 1e4) {
      return `${(value / 1e4).toFixed(0)}만`;
    } else {
      return value.toLocaleString();
    }
  };
  const strategyPerformance = [
    { strategyName: "RSI 역추세", profitRate: 12.5, winRate: 68.2, maxDrop: -3.8 },
    { strategyName: "볼린저밴드", profitRate: 8.3, winRate: 72.5, maxDrop: -2.1 },
    { strategyName: "이동평균 돌파", profitRate: 15.2, winRate: 65.8, maxDrop: -5.2 }
  ];
  return /* @__PURE__ */ jsxs("div", { className: `min-h-screen ${theme === "dark" ? "bg-gray-900" : "bg-gray-50"}`, children: [
    /* @__PURE__ */ jsx(
      DashSidebar,
      {
        theme,
        sidebarOpen,
        setSidebarOpen,
        activeMenu: "대시보드"
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: `transition-all duration-300 ${sidebarOpen ? "lg:ml-64" : "lg:ml-0"}`, children: [
      /* @__PURE__ */ jsx(
        DashHeader,
        {
          theme,
          toggleTheme,
          sidebarOpen,
          setSidebarOpen,
          title: "대시보드"
        }
      ),
      /* @__PURE__ */ jsx(DashNav, { activeTab: "dashboard" }),
      /* @__PURE__ */ jsxs("main", { className: "p-6", children: [
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6 mb-8", children: [
          /* @__PURE__ */ jsxs("div", { className: `rounded-xl shadow-lg p-6 border ${theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`, children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-4", children: [
              /* @__PURE__ */ jsx("div", { className: `text-sm font-medium ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`, children: "총 자산" }),
              /* @__PURE__ */ jsx(DollarSign, { className: "w-5 h-5 text-green-500" })
            ] }),
            /* @__PURE__ */ jsx("div", { className: `text-2xl font-bold ${theme === "dark" ? "text-white" : "text-gray-900"} mb-2`, children: remainAmount }),
            /* @__PURE__ */ jsxs("div", { className: "text-green-500 text-sm", children: [
              "전일 대비 ",
              pastPred,
              "%"
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: `rounded-xl shadow-lg p-6 border ${theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`, children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-4", children: [
              /* @__PURE__ */ jsx("div", { className: `text-sm font-medium ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`, children: "평가손익" }),
              /* @__PURE__ */ jsx(TrendingUp, { className: "w-5 h-5 text-blue-500" })
            ] }),
            /* @__PURE__ */ jsx("div", { className: `text-2xl font-bold text-blue-500 mb-2`, children: rateProfit }),
            /* @__PURE__ */ jsxs("div", { className: "text-blue-500 text-sm", children: [
              "수익률 ",
              rateProfitPercent,
              "%"
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: `rounded-xl shadow-lg p-6 border ${theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`, children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-4", children: [
              /* @__PURE__ */ jsx("div", { className: `text-sm font-medium ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`, children: "보유품목" }),
              /* @__PURE__ */ jsx(Activity, { className: "w-5 h-5 text-purple-500" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: `text-2xl font-bold text-purple-500 mb-2`, children: [
              stockHeld,
              "종목"
            ] }),
            /* @__PURE__ */ jsx("div", { className: "text-purple-500 text-sm", children: "활성 전략 3개" })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8", children: [
          /* @__PURE__ */ jsxs("div", { className: `rounded-xl shadow-lg p-6 border ${theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`, children: [
            /* @__PURE__ */ jsx("div", { className: "flex items-center justify-between mb-4", children: /* @__PURE__ */ jsx("h3", { className: `text-lg font-bold ${theme === "dark" ? "text-white" : "text-gray-800"}`, children: "자동매매" }) }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxs("div", { className: `flex justify-between items-center border p-4 rounded-lg ${theme === "dark" ? "border-gray-700" : "border-gray-200"}`, children: [
                /* @__PURE__ */ jsx("span", { className: `text-md font-medium ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`, children: "활성화될 전략 수" }),
                /* @__PURE__ */ jsx("span", { className: `font-semibold ${theme === "dark" ? "text-white" : "text-gray-900"}`, children: "3개" })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: `flex justify-between items-center border p-4 rounded-lg ${theme === "dark" ? "border-gray-700" : "border-gray-200"}`, children: [
                /* @__PURE__ */ jsx("span", { className: `text-md font-medium ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`, children: "금일 거래" }),
                /* @__PURE__ */ jsxs("span", { className: `font-semibold text-green-500`, children: [
                  todayTradesCount,
                  "회"
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: `border p-4 rounded-lg ${theme === "dark" ? "border-gray-700" : "border-gray-200"}`, children: [
                /* @__PURE__ */ jsxs("div", { className: `flex justify-between items-center text-md font-medium mb-2 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`, children: [
                  /* @__PURE__ */ jsx("span", { className: "", children: "최근 체결내역" }),
                  /* @__PURE__ */ jsx(
                    "button",
                    {
                      onClick: () => setAutoTradingEnabled(!autoTradingEnabled),
                      className: `relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${autoTradingEnabled ? "bg-green-500" : "bg-gray-300 dark:bg-gray-600"}`,
                      children: /* @__PURE__ */ jsx("span", { className: `inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${autoTradingEnabled ? "translate-x-5" : "translate-x-1"}` })
                    }
                  )
                ] }),
                autoTradingEnabled && /* @__PURE__ */ jsx("div", { className: "pt-2 space-y-2", children: recentTrades.slice(0, 3).map((trade) => /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center text-xs", children: [
                  /* @__PURE__ */ jsxs("span", { className: `${theme === "dark" ? "text-gray-400" : "text-gray-600"}`, children: [
                    trade.symbol,
                    " ",
                    trade.type
                  ] }),
                  /* @__PURE__ */ jsx("span", { className: `${trade.profitRate.startsWith("+") ? "text-green-500" : "text-red-500"}`, children: trade.profitRate })
                ] }, trade.id)) })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: `rounded-xl shadow-lg p-6 border ${theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`, children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-4", children: [
              /* @__PURE__ */ jsx("h3", { className: `text-lg font-bold ${theme === "dark" ? "text-white" : "text-gray-800"}`, children: "손익률 차트" }),
              /* @__PURE__ */ jsx("div", { className: "flex space-x-2", children: ["차트"].map((period) => /* @__PURE__ */ jsx(
                "button",
                {
                  onClick: () => setChartPeriod(period),
                  className: `px-3 py-1 text-xs rounded transition-colors ${chartPeriod === period ? "bg-blue-500 text-white" : theme === "dark" ? "bg-gray-700 text-gray-300 hover:bg-gray-600" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`,
                  children: period
                },
                period
              )) })
            ] }),
            /* @__PURE__ */ jsx(ResponsiveContainer, { width: "100%", height: 250, children: /* @__PURE__ */ jsxs(AreaChart, { data: chartDataByPeriod[chartPeriod], children: [
              /* @__PURE__ */ jsx("defs", { children: /* @__PURE__ */ jsxs("linearGradient", { id: "colorValue", x1: "0", y1: "0", x2: "0", y2: "1", children: [
                /* @__PURE__ */ jsx("stop", { offset: "5%", stopColor: "#3B82F6", stopOpacity: 0.3 }),
                /* @__PURE__ */ jsx("stop", { offset: "95%", stopColor: "#3B82F6", stopOpacity: 0 })
              ] }) }),
              /* @__PURE__ */ jsx(CartesianGrid, { strokeDasharray: "3 3", stroke: theme === "dark" ? "#374151" : "#e5e7eb" }),
              /* @__PURE__ */ jsx(XAxis, { dataKey: "time", stroke: theme === "dark" ? "#9ca3af" : "#6b7280" }),
              /* @__PURE__ */ jsx(YAxis, { stroke: theme === "dark" ? "#9ca3af" : "#6b7280", tickFormatter: formatToKoreanUnit }),
              /* @__PURE__ */ jsx(
                Tooltip,
                {
                  contentStyle: {
                    backgroundColor: theme === "dark" ? "#1f2937" : "#ffffff",
                    border: `1px solid ${theme === "dark" ? "#374151" : "#e5e7eb"}`,
                    borderRadius: "8px",
                    color: theme === "dark" ? "#ffffff" : "#000000"
                  },
                  formatter: (value) => formatToKoreanUnit(value)
                }
              ),
              /* @__PURE__ */ jsx(Area, { type: "monotone", dataKey: "value", stroke: "#3B82F6", fillOpacity: 1, fill: "url(#colorValue)", strokeWidth: 2 })
            ] }) })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: `rounded-xl border ${theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"} mb-8`, children: [
          /* @__PURE__ */ jsx("div", { className: "flex items-center justify-between p-6", children: /* @__PURE__ */ jsx("h3", { id: "tradeText", className: `text-2xl font-bold tracking-tight ${theme === "dark" ? "text-white" : "text-gray-900"}` }) }),
          /* @__PURE__ */ jsx("div", { className: `relative overflow-hidden border-t text-center ${theme === "dark" ? "border-gray-700" : "border-gray-200"}`, children: /* @__PURE__ */ jsxs(Table, { children: [
            /* @__PURE__ */ jsxs("colgroup", { children: [
              /* @__PURE__ */ jsx("col", { className: "w-1/12" }),
              /* @__PURE__ */ jsx("col", { className: "w-2/12" }),
              /* @__PURE__ */ jsx("col", { className: "w-2/12" }),
              /* @__PURE__ */ jsx("col", { className: "w-2/12" }),
              /* @__PURE__ */ jsx("col", { className: "w-1/12" }),
              /* @__PURE__ */ jsx("col", { className: "w-2/12" }),
              /* @__PURE__ */ jsx("col", { className: "w-1/12" }),
              /* @__PURE__ */ jsx("col", { className: "w-1/12" })
            ] }),
            /* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { className: theme === "dark" ? "border-gray-700" : "border-gray-200", children: [
              /* @__PURE__ */ jsx(TableHead, { className: `text-center ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`, children: "상태" }),
              /* @__PURE__ */ jsx(TableHead, { className: `text-center ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`, children: "종목" }),
              /* @__PURE__ */ jsx(TableHead, { className: `text-center ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`, children: "현재가" }),
              /* @__PURE__ */ jsx(TableHead, { className: `text-center ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`, children: "평가손익" }),
              /* @__PURE__ */ jsx(TableHead, { className: `text-center ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`, children: "매입금액" }),
              /* @__PURE__ */ jsx(TableHead, { className: `text-center ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`, children: "평가금액" }),
              /* @__PURE__ */ jsx(TableHead, { className: `text-center ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`, children: "수익률" }),
              /* @__PURE__ */ jsx(TableHead, { className: "w-12" })
            ] }) }),
            /* @__PURE__ */ jsx(TableBody, { children: portfolioData.slice(0, 10).map((item) => /* @__PURE__ */ jsxs(
              TableRow,
              {
                className: `${theme === "dark" ? "border-gray-700 hover:bg-gray-750" : "border-gray-200 hover:bg-gray-50"} transition-colors`,
                children: [
                  /* @__PURE__ */ jsx(TableCell, { className: "text-center", children: getStatusBadge(item.state, item.profitRate) }),
                  /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-3 text-left", children: [
                    /* @__PURE__ */ jsx("div", { className: `w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${item.symbol === "TSLA" ? "bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300" : item.symbol === "NVDA" ? "bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300" : item.symbol === "AMZN" ? "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300" : "bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-300"}` }),
                    /* @__PURE__ */ jsxs("div", { children: [
                      /* @__PURE__ */ jsx("div", { className: `font-medium ${theme === "dark" ? "text-white" : "text-gray-900"}`, children: item.symbol }),
                      /* @__PURE__ */ jsx("div", { className: `text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-500"}` })
                    ] })
                  ] }) }),
                  /* @__PURE__ */ jsxs(TableCell, { className: theme === "dark" ? "text-gray-300" : "text-gray-700", children: [
                    /* @__PURE__ */ jsxs("div", { className: "font-medium", children: [
                      "₩",
                      item.currentPrice.toLocaleString()
                    ] }),
                    /* @__PURE__ */ jsxs("div", { className: `text-xs ${item.currentPrice > item.averagePrice ? "text-emerald-600" : "text-red-600"}`, children: [
                      item.currentPrice > item.averagePrice ? "+" : "",
                      ((item.currentPrice - item.averagePrice) / item.averagePrice * 100).toFixed(2),
                      "%"
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxs(TableCell, { className: `font-medium ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`, children: [
                    "₩",
                    item.averagePrice.toLocaleString()
                  ] }),
                  /* @__PURE__ */ jsxs(TableCell, { className: `font-medium ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`, children: [
                    item.quantity,
                    "주"
                  ] }),
                  /* @__PURE__ */ jsxs(TableCell, { className: `text-center font-semibold ${theme === "dark" ? "text-white" : "text-gray-900"}`, children: [
                    "₩",
                    item.evaluationAmount.toLocaleString()
                  ] }),
                  /* @__PURE__ */ jsx(TableCell, { className: "text-center", children: /* @__PURE__ */ jsxs(Badge, { variant: item.profitRate > 0 ? "default" : "destructive", className: item.profitRate > 0 ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-100" : "", children: [
                    item.profitRate > 0 ? "+" : "",
                    item.profitRate,
                    "%"
                  ] }) }),
                  /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsxs(DropdownMenu, { children: [
                    /* @__PURE__ */ jsx(DropdownMenuTrigger, { asChild: true, children: /* @__PURE__ */ jsxs(Button, { variant: "ghost", className: "h-8 w-8 p-0", children: [
                      /* @__PURE__ */ jsx("span", { className: "sr-only", children: "Open menu" }),
                      /* @__PURE__ */ jsx(MoreHorizontal, { className: "h-4 w-4" })
                    ] }) }),
                    /* @__PURE__ */ jsxs(DropdownMenuContent, { align: "end", className: theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200", children: [
                      /* @__PURE__ */ jsx(DropdownMenuItem, { onClick: () => console.log("전략 적용/해제"), className: theme === "dark" ? "text-gray-300 hover:bg-gray-700" : "text-gray-700 hover:bg-gray-100", children: item.strategyApply ? "전략 해제" : "전략 적용" }),
                      /* @__PURE__ */ jsx(DropdownMenuItem, { onClick: () => console.log("매도 주문"), className: theme === "dark" ? "text-gray-300 hover:bg-gray-700" : "text-gray-700 hover:bg-gray-100", children: "매도 주문" }),
                      /* @__PURE__ */ jsx(DropdownMenuItem, { onClick: () => console.log("상세 정보"), className: theme === "dark" ? "text-gray-300 hover:bg-gray-700" : "text-gray-700 hover:bg-gray-100", children: "상세 정보" })
                    ] })
                  ] }) })
                ]
              },
              item.id
            )) })
          ] }) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8", children: [
          /* @__PURE__ */ jsxs("div", { className: `rounded-xl shadow-lg p-6 border ${theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`, children: [
            /* @__PURE__ */ jsx("h3", { className: `text-lg font-bold mb-4 ${theme === "dark" ? "text-white" : "text-gray-800"}`, children: "최근 알림" }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
              /* @__PURE__ */ jsxs("div", { className: `p-3 rounded-lg ${theme === "dark" ? "bg-gray-700" : "bg-blue-50"}`, children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-2", children: [
                  /* @__PURE__ */ jsx("span", { className: `text-sm font-medium ${theme === "dark" ? "text-white" : "text-blue-900"}`, children: "전체 체결내역" }),
                  /* @__PURE__ */ jsx(CheckCircle, { className: "w-4 h-4 text-green-500" })
                ] }),
                /* @__PURE__ */ jsx("div", { className: `text-xs ${theme === "dark" ? "text-gray-300" : "text-blue-700"}`, children: "금일 총 12회 거래 완료" })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: `p-3 rounded-lg ${theme === "dark" ? "bg-gray-700" : "bg-green-50"}`, children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-2", children: [
                  /* @__PURE__ */ jsx("span", { className: `text-sm font-medium ${theme === "dark" ? "text-white" : "text-green-900"}`, children: "승률" }),
                  /* @__PURE__ */ jsx(TrendingUp, { className: "w-4 h-4 text-green-500" })
                ] }),
                /* @__PURE__ */ jsx("div", { className: `text-xs ${theme === "dark" ? "text-gray-300" : "text-green-700"}`, children: "현재 승률 68.2% (목표 대비 +3.2%)" })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: `p-3 rounded-lg ${theme === "dark" ? "bg-gray-700" : "bg-orange-50"}`, children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-2", children: [
                  /* @__PURE__ */ jsx("span", { className: `text-sm font-medium ${theme === "dark" ? "text-white" : "text-orange-900"}`, children: "최대낙폭" }),
                  /* @__PURE__ */ jsx(AlertCircle, { className: "w-4 h-4 text-orange-500" })
                ] }),
                /* @__PURE__ */ jsx("div", { className: `text-xs ${theme === "dark" ? "text-gray-300" : "text-orange-700"}`, children: "현재 -2.1% (안전 구간)" })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: `rounded-xl shadow-lg p-6 border ${theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`, children: [
            /* @__PURE__ */ jsx("h3", { className: `text-lg font-bold mb-4 ${theme === "dark" ? "text-white" : "text-gray-800"}`, children: "전략성과요약" }),
            /* @__PURE__ */ jsx("div", { className: "space-y-4", children: strategyPerformance.map((strategy, index) => /* @__PURE__ */ jsxs("div", { className: `p-4 rounded-lg border ${theme === "dark" ? "bg-gray-700 border-gray-600" : "bg-gray-50 border-gray-200"}`, children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-2", children: [
                /* @__PURE__ */ jsx("span", { className: `font-medium ${theme === "dark" ? "text-white" : "text-gray-900"}`, children: strategy.strategyName }),
                /* @__PURE__ */ jsx(Brain, { className: "w-4 h-4 text-purple-500" })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-3 gap-2 text-xs", children: [
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("div", { className: `${theme === "dark" ? "text-gray-400" : "text-gray-600"}`, children: "수익률" }),
                  /* @__PURE__ */ jsxs("div", { className: "text-green-500 font-medium", children: [
                    "+",
                    strategy.profitRate,
                    "%"
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("div", { className: `${theme === "dark" ? "text-gray-400" : "text-gray-600"}`, children: "승률" }),
                  /* @__PURE__ */ jsxs("div", { className: "text-blue-500 font-medium", children: [
                    strategy.winRate,
                    "%"
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("div", { className: `${theme === "dark" ? "text-gray-400" : "text-gray-600"}`, children: "최대낙폭" }),
                  /* @__PURE__ */ jsxs("div", { className: "text-red-500 font-medium", children: [
                    strategy.maxDrop,
                    "%"
                  ] })
                ] })
              ] })
            ] }, index)) })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsx(DashFooter, { theme })
    ] })
  ] });
};
const route27 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Dashboard
}, Symbol.toStringTag, { value: "Module" }));
const action$6 = async ({ request }) => {
  const data = await request.json();
  const acct_no = "12345678901";
  const host = "https://api.kiwoom.com";
  const tokenUrl = `${host}/oauth2/token`;
  const tokenHeaders = {
    "Content-Type": "application/json;charset=UTF-8"
  };
  const value = String(data.email);
  const form = new URLSearchParams();
  form.append("email", value ?? "");
  const res = await fetch("https://tradinggear.co.kr:8081/tradinggear/member_inform_get.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
      // ✅ JSON 형식 명시
    },
    body: form.toString()
  });
  const data1 = await res.json();
  const tokenData = {
    "grant_type": "client_credentials",
    "appkey": data1[0]["decrypted_api_key"],
    "secretkey": data1[0]["decrypted_api_secret"]
  };
  const tokenResponse = await fetch(tokenUrl, {
    method: "POST",
    headers: tokenHeaders,
    body: JSON.stringify(tokenData)
  });
  const tokenJson = await tokenResponse.json();
  const accessToken = tokenJson.token;
  let headers2 = {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${accessToken}`,
    "api-id": "kt00018",
    "cont-yn": "N",
    "next-key": "N"
  };
  let respEval = await fetch(`${host}/api/dostk/acnt`, {
    method: "POST",
    headers: headers2,
    body: JSON.stringify({ acct_no, dmst_stex_tp: "KRX", qry_tp: "1" })
  });
  let evalJson = await respEval.json();
  let tot_evlt_pl = evalJson.tot_evlt_pl ?? 0;
  let tot_prft_rt = evalJson.tot_prft_rt ?? 0;
  let rateUpAndDown = tot_prft_rt >= 0 ? "+" : "-";
  const totalAsset = json({ "tot_evlt_pl": rateUpAndDown + Number(tot_evlt_pl), "tot_prft_rt": rateUpAndDown + parseFloat(Math.abs(tot_prft_rt).toFixed(2)) });
  return totalAsset;
};
const route28 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$6
}, Symbol.toStringTag, { value: "Module" }));
const action$5 = async ({ request }) => {
  var _a;
  const { email } = await request.json();
  const form = new URLSearchParams();
  form.append("email", email);
  const res = await fetch("https://tradinggear.co.kr:8081/tradinggear/member_inform_get.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: form.toString()
  });
  const userInfo = await res.json();
  const tokenRes = await fetch("https://api.kiwoom.com/oauth2/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      grant_type: "client_credentials",
      appkey: userInfo[0]["decrypted_api_key"],
      secretkey: userInfo[0]["decrypted_api_secret"]
    })
  });
  const tokenJson = await tokenRes.json();
  const accessToken = tokenJson.token;
  const holdingsRes = await fetch("https://api.kiwoom.com/api/dostk/acnt", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${accessToken}`,
      "api-id": "kt00004"
    },
    body: JSON.stringify({
      acct_no: "12345678901",
      dmst_stex_tp: "KRX",
      qry_tp: "1"
    })
  });
  const holdingsJson = await holdingsRes.json();
  const count = ((_a = holdingsJson.output) == null ? void 0 : _a.length) ?? 0;
  return json({ "count": count });
};
const route29 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$5
}, Symbol.toStringTag, { value: "Module" }));
const action$4 = async ({ request }) => {
  const host = "https://api.kiwoom.com";
  const tokenUrl = host + "/oauth2/token";
  const tokenRes = await fetch(tokenUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json;charset=UTF-8"
    },
    body: JSON.stringify({
      grant_type: "client_credentials",
      appkey: "89XtCDXIQLbS2wTC7S5dvsQ4WdKK6W-5O9fO0XJzS1w",
      secretkey: "ooGf1ohzSgLaIPGY53ZrKvC54ucu_qm3GV_jL5MSrYQ"
    })
  });
  const tokenData = await tokenRes.json();
  const token = tokenData.token;
  const evalRes = await fetch(host + "/oauth2/acnt/evalBalance", {
    method: "POST",
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
      "Authorization": `Bearer ${token}`,
      "api-id": "kt00001"
      // TR명은 실제 사용 환경에 따라 다를 수 있음
    },
    body: JSON.stringify({
      acct_no: "YOUR_ACCOUNT_NUMBER",
      pwd: "",
      qry_tp: "2"
      // 일반조회
    })
  });
  const evalData = await evalRes.json();
  const todayTotal = Number(evalData.total_evlu_amt);
  const yesterdayTotal = Number(evalData.d2prev_evlu_amt);
  const diff = todayTotal - yesterdayTotal;
  const rate = diff / yesterdayTotal * 100;
  console.log(`금일 총자산: ${todayTotal}원`);
  console.log(`전일 총자산: ${yesterdayTotal}원`);
  console.log(`전일 대비 변화: ${diff >= 0 ? "▲" : "▼"} ${Math.abs(rate).toFixed(2)}%`);
  return rate;
};
const route30 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$4
}, Symbol.toStringTag, { value: "Module" }));
function RealtimeBalance() {
  const [balances, setBalances] = useState([]);
  useEffect(() => {
    const eventSource = new EventSource("/balance-stream");
    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.e === "outboundAccountPosition" && data.B) {
        const filtered = data.B.map((b) => ({
          asset: b.a,
          free: parseFloat(b.f),
          locked: parseFloat(b.l)
        })).filter((b) => b.free + b.locked > 0);
        setBalances(filtered);
      }
    };
    return () => eventSource.close();
  }, []);
  return /* @__PURE__ */ jsxs("div", { style: { padding: 20 }, children: [
    /* @__PURE__ */ jsx("h2", { children: "📡 실시간 Binance 자산 현황" }),
    /* @__PURE__ */ jsxs("table", { border: 1, cellPadding: 5, children: [
      /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { children: [
        /* @__PURE__ */ jsx("th", { children: "자산" }),
        /* @__PURE__ */ jsx("th", { children: "사용 가능" }),
        /* @__PURE__ */ jsx("th", { children: "잠금" })
      ] }) }),
      /* @__PURE__ */ jsx("tbody", { children: balances.map((bal) => /* @__PURE__ */ jsxs("tr", { children: [
        /* @__PURE__ */ jsx("td", { children: bal.asset }),
        /* @__PURE__ */ jsx("td", { children: bal.free.toFixed(4) }),
        /* @__PURE__ */ jsx("td", { children: bal.locked.toFixed(4) })
      ] }, bal.asset)) })
    ] })
  ] });
}
const route31 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: RealtimeBalance
}, Symbol.toStringTag, { value: "Module" }));
const action$3 = async ({ request }) => {
  const data = await request.json();
  const acct_no = "12345678901";
  const host = "https://api.kiwoom.com";
  const tokenUrl = `${host}/oauth2/token`;
  const tokenHeaders = {
    "Content-Type": "application/json;charset=UTF-8"
  };
  const value = String(data.email);
  const form = new URLSearchParams();
  form.append("email", value ?? "");
  const res = await fetch("https://tradinggear.co.kr:8081/tradinggear/member_inform_get.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
      // ✅ JSON 형식 명시
    },
    body: form.toString()
  });
  const data1 = await res.json();
  const tokenData = {
    "grant_type": "client_credentials",
    "appkey": data1[0]["decrypted_api_key"],
    "secretkey": data1[0]["decrypted_api_secret"]
  };
  const tokenResponse = await fetch(tokenUrl, {
    method: "POST",
    headers: tokenHeaders,
    body: JSON.stringify(tokenData)
  });
  const tokenJson = await tokenResponse.json();
  const accessToken = tokenJson.token;
  let headers2 = {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${accessToken}`,
    "api-id": "kt00018",
    "cont-yn": "N",
    "next-key": "2"
  };
  let respEval = await fetch(`${host}/api/dostk/acnt`, {
    method: "POST",
    headers: headers2,
    body: JSON.stringify({ acct_no, dmst_stex_tp: "KRX", qry_tp: "2" })
  });
  let evalJson = await respEval.json();
  let total_evlu_amt = evalJson.tot_evlt_amt ?? 0;
  let headers3 = {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${accessToken}`,
    "api-id": "kt00001",
    // TR명
    "cont-yn": "N",
    "next-key": "2"
  };
  let respDeposit = await fetch(`${host}/api/dostk/acnt`, {
    method: "POST",
    headers: headers3,
    body: JSON.stringify({ acct_no, pwd: "", qry_tp: "2" })
  });
  let depositJson = await respDeposit.json();
  let deposit = depositJson.entr ?? 0;
  let headers4 = {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${accessToken}`,
    "api-id": "kt00001",
    // TR명
    "cont-yn": "N",
    "next-key": "2"
  };
  let respCredit = await fetch(`${host}/api/dostk/acnt`, {
    method: "POST",
    headers: headers4,
    body: JSON.stringify({ acct_no, dmst_stex_tp: "KRX", qry_tp: "2" })
  });
  let creditJson = await respCredit.json();
  let loan_sum = creditJson.loan_sum ?? 0;
  const totalAsset = Number(total_evlu_amt + deposit - loan_sum);
  headers2 = {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${accessToken}`,
    "api-id": "kt00018",
    "cont-yn": "Y",
    "next-key": "2"
  };
  respEval = await fetch(`${host}/api/dostk/acnt`, {
    method: "POST",
    headers: headers2,
    body: JSON.stringify({ acct_no, dmst_stex_tp: "KRX", qry_tp: "2" })
  });
  evalJson = await respEval.json();
  let total_evlu_amt2 = 0;
  if (Array.isArray(evalJson)) {
    for (const item of evalJson) {
      if (item["next-key"] == 2) {
        total_evlu_amt2 = Number(item["tot_evlt_amt"]) ?? 0;
      }
    }
  }
  headers3 = {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${accessToken}`,
    "api-id": "kt00001",
    // TR명
    "cont-yn": "Y",
    "next-key": "2"
  };
  respDeposit = await fetch(`${host}/api/dostk/acnt`, {
    method: "POST",
    headers: headers3,
    body: JSON.stringify({ acct_no, pwd: "", qry_tp: "2" })
  });
  depositJson = await respDeposit.json();
  let deposit2 = 0;
  if (Array.isArray(depositJson)) {
    for (const item of depositJson) {
      if (item["next-key"] == 2) {
        deposit2 = Number(item["entr"]) ?? 0;
      }
    }
  }
  headers4 = {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${accessToken}`,
    "api-id": "kt00001",
    // TR명
    "cont-yn": "Y",
    "next-key": "2"
  };
  respCredit = await fetch(`${host}/api/dostk/acnt`, {
    method: "POST",
    headers: headers4,
    body: JSON.stringify({ acct_no, dmst_stex_tp: "KRX", qry_tp: "2" })
  });
  creditJson = await respCredit.json();
  let loan_sum2 = 0;
  if (Array.isArray(depositJson)) {
    for (const item of creditJson) {
      if (item["next-key"] == 2) {
        loan_sum2 = Number(item["loan_sum"]) ?? 0;
      }
    }
  }
  const totalAsset2 = Number(total_evlu_amt2 + deposit2 - loan_sum2);
  let percent2 = 0;
  if (totalAsset2 !== 0) {
    percent2 = (totalAsset - totalAsset2) / totalAsset2 * 100;
  }
  return percent2;
};
const route32 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$3
}, Symbol.toStringTag, { value: "Module" }));
function Header() {
  const { theme, toggleTheme } = useThemeStore();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };
  const headerClasses = theme === "dark" ? "bg-slate-900/95 border-cyan-400/20" : "bg-white/95 border-blue-600/20";
  const textPrimary = theme === "dark" ? "text-white" : "text-slate-900";
  const primaryColor = theme === "dark" ? "text-cyan-400" : "text-blue-600";
  return /* @__PURE__ */ jsx(Fragment, { children: /* @__PURE__ */ jsxs(
    "header",
    {
      className: `fixed top-0 w-full backdrop-blur-lg z-50 border-b transition-all duration-300 ${headerClasses}`,
      children: [
        /* @__PURE__ */ jsxs("nav", { className: "max-w-7xl mx-auto flex justify-between items-center px-4 lg:px-8 py-4", children: [
          /* @__PURE__ */ jsx(
            "a",
            {
              href: "/",
              className: `flex items-center text-2xl font-bold cursor-pointer transition-colors duration-300 ${primaryColor}`,
              children: theme === "dark" ? /* @__PURE__ */ jsx(
                "img",
                {
                  className: "h-[44px]",
                  src: "/logo-white.png",
                  alt: "Logo",
                  loading: "lazy"
                }
              ) : /* @__PURE__ */ jsx(
                "img",
                {
                  className: "h-[44px]",
                  src: "/logo.png",
                  alt: "Logo",
                  loading: "lazy"
                }
              )
            }
          ),
          /* @__PURE__ */ jsxs("ul", { className: "hidden lg:flex items-center space-x-8", children: [
            /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(
              "a",
              {
                href: "/about",
                className: `${textPrimary} hover:${primaryColor.replace(
                  "text-",
                  "text-"
                )} font-medium cursor-pointer transition-colors duration-300`,
                children: "회사소개"
              }
            ) }),
            /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(
              "a",
              {
                href: "/doc",
                className: `${textPrimary} hover:${primaryColor.replace(
                  "text-",
                  "text-"
                )} font-medium cursor-pointer transition-colors duration-300`,
                children: "API 연동가이드"
              }
            ) }),
            /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(
              "a",
              {
                href: "/feature",
                className: `${textPrimary} hover:${primaryColor.replace(
                  "text-",
                  "text-"
                )} font-medium cursor-pointer transition-colors duration-300`,
                children: "기능소개"
              }
            ) }),
            /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(
              "a",
              {
                href: "/faq",
                className: `${textPrimary} hover:${primaryColor.replace(
                  "text-",
                  "text-"
                )} font-medium cursor-pointer transition-colors duration-300`,
                children: "자주묻는질문(FAQ)"
              }
            ) }),
            /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(
              "a",
              {
                href: "/pricing",
                className: `${textPrimary} hover:${primaryColor.replace(
                  "text-",
                  "text-"
                )} font-medium cursor-pointer transition-colors duration-300`,
                children: "요금제"
              }
            ) }),
            /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(
              "button",
              {
                className: `w-10 h-10 rounded-full border-2 ${theme === "dark" ? "border-cyan-400/20 hover:border-cyan-400 hover:text-cyan-400" : "border-blue-600/20 hover:border-blue-600 text-yellow-400 hover:text-blue-600"} ${textPrimary} transition-all duration-300 hover:rotate-180 flex items-center justify-center`,
                onClick: toggleTheme,
                children: theme === "dark" ? "🌙" : "☀️"
              }
            ) })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "lg:hidden flex items-center", children: /* @__PURE__ */ jsxs(
            "button",
            {
              className: "w-10 h-10 flex flex-col justify-center items-center space-y-1 focus:outline-none",
              onClick: toggleMobileMenu,
              children: [
                /* @__PURE__ */ jsx(
                  "span",
                  {
                    className: `w-6 h-0.5 ${theme === "dark" ? "bg-white" : "bg-slate-700"} transition-all duration-300 ${isMobileMenuOpen ? "rotate-45 translate-y-1.5" : ""}`
                  }
                ),
                /* @__PURE__ */ jsx(
                  "span",
                  {
                    className: `w-6 h-0.5 ${theme === "dark" ? "bg-white" : "bg-slate-700"} transition-all duration-300 ${isMobileMenuOpen ? "opacity-0" : ""}`
                  }
                ),
                /* @__PURE__ */ jsx(
                  "span",
                  {
                    className: `w-6 h-0.5 ${theme === "dark" ? "bg-white" : "bg-slate-700"} transition-all duration-300 ${isMobileMenuOpen ? "-rotate-45 -translate-y-1.5" : ""}`
                  }
                )
              ]
            }
          ) }),
          /* @__PURE__ */ jsxs("div", { className: "hidden lg:flex items-center space-x-4", children: [
            /* @__PURE__ */ jsx(
              "button",
              {
                className: `${theme === "dark" ? "bg-slate-800 text-cyan-400 border border-cyan-400/20 hover:border-cyan-400" : "bg-white text-blue-600 border border-blue-600/20 hover:border-blue-600"} px-6 py-3 rounded-full font-bold hover:transform hover:-translate-y-1 hover:shadow-md transition-all duration-300`,
                onClick: () => navigate("/login"),
                children: "로그인"
              }
            ),
            /* @__PURE__ */ jsx(
              "button",
              {
                className: `${theme === "dark" ? "bg-gradient-to-r from-cyan-400 to-emerald-400 text-slate-900 hover:shadow-cyan-400/30" : "bg-gradient-to-r from-blue-600 to-emerald-600 text-white hover:shadow-blue-600/30"} px-6 py-3 rounded-full font-bold hover:transform hover:-translate-y-1 hover:shadow-lg transition-all duration-300`,
                onClick: () => navigate("/download"),
                children: "다운로드"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsx(
          "div",
          {
            className: `lg:hidden fixed h-screen inset-0 bg-black/50 backdrop-blur-sm z-40 transition-all duration-300 ${isMobileMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"}`,
            onClick: toggleMobileMenu
          }
        ),
        /* @__PURE__ */ jsxs(
          "div",
          {
            className: `lg:hidden fixed top-0 right-0 h-screen w-80 max-w-[80vw] ${theme === "dark" ? "bg-slate-900/95" : "bg-white/95"} backdrop-blur-lg border-l ${theme === "dark" ? "border-cyan-400/20" : "border-blue-600/20"} z-50 transform transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? "translate-x-0" : "translate-x-full"}`,
            children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between p-6 border-b border-gray-200/20", children: [
                /* @__PURE__ */ jsx(
                  "div",
                  {
                    className: `flex items-center text-xl font-bold ${primaryColor}`,
                    children: /* @__PURE__ */ jsx(
                      "a",
                      {
                        href: "/",
                        className: `${textPrimary} hover:${primaryColor.replace(
                          "text-",
                          "text-"
                        )} text-sm font-medium cursor-pointer transition-colors duration-300`,
                        children: "Home"
                      }
                    )
                  }
                ),
                /* @__PURE__ */ jsxs(
                  "button",
                  {
                    className: "w-8 h-8 flex items-center justify-center focus:outline-none",
                    onClick: toggleMobileMenu,
                    children: [
                      /* @__PURE__ */ jsx(
                        "span",
                        {
                          className: `w-6 h-0.5 ${theme === "dark" ? "bg-white" : "bg-slate-700"} transition-all duration-300 rotate-45 absolute`
                        }
                      ),
                      /* @__PURE__ */ jsx(
                        "span",
                        {
                          className: `w-6 h-0.5 ${theme === "dark" ? "bg-white" : "bg-slate-700"} transition-all duration-300 -rotate-45 absolute`
                        }
                      )
                    ]
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs("div", { className: `flex flex-col h-[calc(100vh-80px)]`, children: [
                /* @__PURE__ */ jsxs("ul", { className: "px-6 py-8 space-y-6 flex-1", children: [
                  /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(
                    "a",
                    {
                      href: "/about",
                      className: `block ${textPrimary} hover:${primaryColor.replace(
                        "text-",
                        "text-"
                      )} font-medium cursor-pointer transition-colors duration-300 py-3 text-lg border-b border-gray-200/10`,
                      children: "회사소개"
                    }
                  ) }),
                  /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(
                    "a",
                    {
                      href: "/doc",
                      className: `block ${textPrimary} hover:${primaryColor.replace(
                        "text-",
                        "text-"
                      )} font-medium cursor-pointer transition-colors duration-300 py-3 text-lg border-b border-gray-200/10`,
                      children: "API 연동가이드"
                    }
                  ) }),
                  /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(
                    "a",
                    {
                      href: "/feature",
                      className: `block ${textPrimary} hover:${primaryColor.replace(
                        "text-",
                        "text-"
                      )} font-medium cursor-pointer transition-colors duration-300 py-3 text-lg border-b border-gray-200/10`,
                      children: "기능소개"
                    }
                  ) }),
                  /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(
                    "a",
                    {
                      href: "/faq",
                      className: `block ${textPrimary} hover:${primaryColor.replace(
                        "text-",
                        "text-"
                      )} font-medium cursor-pointer transition-colors duration-300 py-3 text-lg border-b border-gray-200/10`,
                      children: "자주묻는질문(FAQ)"
                    }
                  ) }),
                  /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(
                    "a",
                    {
                      href: "/pricing",
                      className: `block ${textPrimary} hover:${primaryColor.replace(
                        "text-",
                        "text-"
                      )} font-medium cursor-pointer transition-colors duration-300 py-3 text-lg border-b border-gray-200/10`,
                      children: "요금제"
                    }
                  ) })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "px-6 pb-8 space-y-4", children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between py-4 border-t border-gray-200/20", children: [
                    /* @__PURE__ */ jsx("span", { className: `${textPrimary} font-medium`, children: "테마 설정" }),
                    /* @__PURE__ */ jsx(
                      "button",
                      {
                        className: `w-12 h-12 rounded-full border-2 ${theme === "dark" ? "border-cyan-400/20 hover:border-cyan-400 hover:text-cyan-400" : "border-blue-600/20 hover:border-blue-600 hover:text-blue-600"} ${textPrimary} transition-all duration-300 hover:rotate-180 flex items-center justify-center text-xl`,
                        onClick: toggleTheme,
                        children: theme === "dark" ? "🌙" : "☀️"
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsx(
                    "button",
                    {
                      className: `w-full ${theme === "dark" ? "bg-gradient-to-r from-cyan-400 to-emerald-400 text-slate-900 hover:shadow-cyan-400/30" : "bg-gradient-to-r from-blue-600 to-emerald-600 text-white hover:shadow-blue-600/30"} px-6 py-4 rounded-full font-bold text-lg hover:transform hover:-translate-y-1 hover:shadow-lg transition-all duration-300`,
                      onClick: () => navigate("/download"),
                      children: "다운로드"
                    }
                  )
                ] })
              ] })
            ]
          }
        )
      ]
    }
  ) });
}
function Footer({ onLinkClick }) {
  const navigate = useNavigate();
  const { theme } = useThemeStore();
  const textSecondary = theme === "dark" ? "text-slate-300" : "text-slate-600";
  const primaryColor = theme === "dark" ? "text-cyan-400" : "text-blue-600";
  const handleLinkClick = (linkName) => {
    if (onLinkClick) {
      onLinkClick(linkName);
    }
    switch (linkName) {
      case "이용약관":
        navigate("/terms");
        break;
      case "개인정보처리방침":
        navigate("/privacy");
        break;
      case "고객지원":
        navigate("#void");
        break;
    }
  };
  const footerLinks = [
    "이용약관",
    "개인정보처리방침",
    "고객지원"
  ];
  return /* @__PURE__ */ jsx("footer", { className: `${theme === "dark" ? "bg-slate-900/90 border-cyan-400/20" : "bg-white/90 border-blue-600/20"} border-t py-12`, children: /* @__PURE__ */ jsxs("div", { className: "max-w-6xl mx-auto px-4 lg:px-8 text-center", children: [
    /* @__PURE__ */ jsx("div", { className: "flex flex-wrap justify-center gap-8 mb-8", children: footerLinks.map((link) => /* @__PURE__ */ jsx(
      "button",
      {
        className: `${textSecondary} hover:${primaryColor.replace("text-", "text-")} transition-colors duration-300 cursor-pointer`,
        onClick: () => handleLinkClick(link),
        children: link
      },
      link
    )) }),
    /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap justify-center gap-x-8 gap-y-2 mb-8", children: [
      /* @__PURE__ */ jsx("p", { className: `${textSecondary} text-sm`, children: "대구광역시 남구 안지랑로17길 109, 101호 (대명동)" }),
      /* @__PURE__ */ jsx("p", { className: `${textSecondary} text-sm`, children: "대표이사 : 장시영" }),
      /* @__PURE__ */ jsx("p", { className: `${textSecondary} text-sm`, children: "사업자등록번호 : 548-27-01906" }),
      /* @__PURE__ */ jsx("p", { className: `${textSecondary} text-sm`, children: "개인정보보호책임자 : 장시영" }),
      /* @__PURE__ */ jsx("p", { className: `${textSecondary} text-sm`, children: "이메일 : day1222kr@naver.com" }),
      /* @__PURE__ */ jsx("p", { className: `${textSecondary} text-sm`, children: "전화번호 : 1544-5345" })
    ] }),
    /* @__PURE__ */ jsx("div", { className: `pt-8 border-t ${theme === "dark" ? "border-cyan-400/10" : "border-blue-600/10"} ${textSecondary} text-sm`, children: /* @__PURE__ */ jsx("p", { children: "© 2025 Trading Gear. All rights reserved. | 투자에는 원금 손실의 위험이 있습니다." }) })
  ] }) });
}
const meta$b = () => {
  return [
    { title: "Forgot Password - TRADING GEAR" },
    { name: "description", content: "Reset your AI trading account password" }
  ];
};
function ForgotPassword() {
  const navigate = useNavigate$1();
  const { theme, isClient, initializeTheme } = useThemeStore();
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    initializeTheme();
  }, [initializeTheme]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      console.log("Password reset email sent to:", email);
      setIsSubmitted(true);
      setIsLoading(false);
    }, 2e3);
  };
  const handleBackToLogin = () => {
    navigate("/login");
  };
  const handleResendEmail = () => {
    setIsLoading(true);
    setTimeout(() => {
      console.log("Password reset email resent to:", email);
      setIsLoading(false);
    }, 2e3);
  };
  const themeClasses = theme === "dark" ? "bg-gradient-to-br from-slate-900 to-slate-800" : "bg-gradient-to-br from-slate-100 to-slate-200";
  const cardClasses = theme === "dark" ? "bg-slate-800 border-slate-700" : "bg-white border-slate-300";
  const inputClasses = theme === "dark" ? "bg-slate-700 border-slate-600 text-white placeholder-slate-400 focus:border-cyan-400 focus:ring-cyan-400" : "bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-500 focus:border-blue-500 focus:ring-blue-500";
  const textPrimary = theme === "dark" ? "text-white" : "text-slate-900";
  const textSecondary = theme === "dark" ? "text-slate-400" : "text-slate-600";
  const linkColor = theme === "dark" ? "text-cyan-400 hover:text-cyan-300" : "text-blue-600 hover:text-blue-700";
  const buttonPrimary = theme === "dark" ? "bg-gradient-to-r from-cyan-400 to-emerald-400 text-slate-900 hover:from-cyan-500 hover:to-emerald-500" : "bg-gradient-to-r from-blue-600 to-emerald-600 text-white hover:from-blue-700 hover:to-emerald-700";
  const buttonSecondary = theme === "dark" ? "border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-slate-900" : "border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white";
  return /* @__PURE__ */ jsxs("div", { className: `min-h-screen transition-all duration-300 ${themeClasses}`, children: [
    /* @__PURE__ */ jsx(Header, {}),
    /* @__PURE__ */ jsx("div", { className: `min-h-screen flex items-center justify-center px-4 py-12 transition-all duration-300 ${themeClasses}`, children: /* @__PURE__ */ jsx("div", { className: `w-full max-w-md space-y-8 p-8 rounded-2xl shadow-2xl border transition-all duration-300 ${cardClasses}`, children: !isSubmitted ? /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
        /* @__PURE__ */ jsx("div", { className: `mx-auto w-16 h-16 ${theme === "dark" ? "bg-cyan-400/20" : "bg-blue-600/20"} rounded-full flex items-center justify-center mb-4`, children: /* @__PURE__ */ jsx("svg", { className: `w-8 h-8 ${theme === "dark" ? "text-cyan-400" : "text-blue-600"}`, fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M15 7a2 2 0 012 2m0 0a2 2 0 012 2 2 2 0 01-2 2m-2-2H9m6 0V9a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2h6a2 2 0 002-2v-1" }) }) }),
        /* @__PURE__ */ jsx("h2", { className: `text-3xl font-bold ${textPrimary}`, children: "Forgot password?" }),
        /* @__PURE__ */ jsx("p", { className: `mt-4 text-sm ${textSecondary} leading-relaxed`, children: "No worries, we'll send you reset instructions to your email address." })
      ] }),
      /* @__PURE__ */ jsxs("form", { className: "space-y-6", onSubmit: handleSubmit, children: [
        /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(
          "input",
          {
            id: "email",
            name: "email",
            type: "email",
            required: true,
            value: email,
            onChange: (e) => setEmail(e.target.value),
            className: `w-full px-4 py-3 rounded-lg border transition-all duration-200 focus:ring-2 focus:ring-opacity-50 ${inputClasses}`,
            placeholder: "Enter your email"
          }
        ) }),
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "submit",
            disabled: isLoading,
            className: `w-full py-3 px-4 rounded-lg font-semibold text-lg transition-all duration-200 transform hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none ${buttonPrimary}`,
            children: isLoading ? /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center", children: [
              /* @__PURE__ */ jsxs("svg", { className: "animate-spin -ml-1 mr-3 h-5 w-5", fill: "none", viewBox: "0 0 24 24", children: [
                /* @__PURE__ */ jsx("circle", { className: "opacity-25", cx: "12", cy: "12", r: "10", stroke: "currentColor", strokeWidth: "4" }),
                /* @__PURE__ */ jsx("path", { className: "opacity-75", fill: "currentColor", d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" })
              ] }),
              "Sending..."
            ] }) : "Reset password"
          }
        )
      ] }),
      /* @__PURE__ */ jsx("div", { className: "text-center", children: /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: handleBackToLogin,
          className: `inline-flex items-center text-sm ${linkColor} transition-colors`,
          children: [
            /* @__PURE__ */ jsx("svg", { className: "w-4 h-4 mr-2", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M10 19l-7-7m0 0l7-7m-7 7h18" }) }),
            "Back to log in"
          ]
        }
      ) })
    ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
        /* @__PURE__ */ jsx("div", { className: `mx-auto w-16 h-16 ${theme === "dark" ? "bg-emerald-400/20" : "bg-emerald-600/20"} rounded-full flex items-center justify-center mb-4`, children: /* @__PURE__ */ jsx("svg", { className: `w-8 h-8 ${theme === "dark" ? "text-emerald-400" : "text-emerald-600"}`, fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" }) }) }),
        /* @__PURE__ */ jsx("h2", { className: `text-3xl font-bold ${textPrimary}`, children: "Check your email" }),
        /* @__PURE__ */ jsxs("p", { className: `mt-4 text-sm ${textSecondary} leading-relaxed`, children: [
          "We sent a password reset link to",
          " ",
          /* @__PURE__ */ jsx("span", { className: `font-medium ${textPrimary}`, children: email })
        ] }),
        /* @__PURE__ */ jsx("p", { className: `mt-2 text-xs ${textSecondary}`, children: "Didn't receive the email? Check your spam folder or try again." })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => window.open("mailto:", "_blank"),
            className: `w-full py-3 px-4 rounded-lg font-semibold text-lg transition-all duration-200 transform hover:scale-105 hover:shadow-lg ${buttonPrimary}`,
            children: "Open email app"
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: handleResendEmail,
            disabled: isLoading,
            className: `w-full py-3 px-4 rounded-lg border-2 font-semibold text-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none ${buttonSecondary}`,
            children: isLoading ? /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center", children: [
              /* @__PURE__ */ jsxs("svg", { className: "animate-spin -ml-1 mr-3 h-5 w-5", fill: "none", viewBox: "0 0 24 24", children: [
                /* @__PURE__ */ jsx("circle", { className: "opacity-25", cx: "12", cy: "12", r: "10", stroke: "currentColor", strokeWidth: "4" }),
                /* @__PURE__ */ jsx("path", { className: "opacity-75", fill: "currentColor", d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" })
              ] }),
              "Sending..."
            ] }) : "Resend email"
          }
        )
      ] }),
      /* @__PURE__ */ jsx("div", { className: "text-center pt-4", children: /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: handleBackToLogin,
          className: `inline-flex items-center text-sm ${linkColor} transition-colors`,
          children: [
            /* @__PURE__ */ jsx("svg", { className: "w-4 h-4 mr-2", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M10 19l-7-7m0 0l7-7m-7 7h18" }) }),
            "Back to log in"
          ]
        }
      ) })
    ] }) }) }),
    /* @__PURE__ */ jsx(Footer, { onLinkClick: (linkName) => linkName })
  ] });
}
const route33 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: ForgotPassword,
  meta: meta$b
}, Symbol.toStringTag, { value: "Module" }));
const StrategyList$2 = () => {
  const { isSidebarOpen, isMobile, setIsMobile, closeSidebarOnMobile } = useSidebarStore();
  useNavigate();
  useEffect(() => {
    const checkScreenSize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
    };
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, [setIsMobile]);
  const handleOverlayClick = () => {
    closeSidebarOnMobile();
  };
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-gray-900", children: [
    isMobile && isSidebarOpen && /* @__PURE__ */ jsx(
      "div",
      {
        className: "fixed inset-0 bg-black bg-opacity-60 z-40",
        onClick: handleOverlayClick
      }
    ),
    /* @__PURE__ */ jsx(AdminSidebar, {}),
    /* @__PURE__ */ jsxs(
      "div",
      {
        className: `
        transition-all duration-300 ease-in-out
        ${!isMobile && isSidebarOpen ? "ml-64" : "ml-0"}
      `,
        children: [
          /* @__PURE__ */ jsx(Header$1, { title: "승인 대기" }),
          /* @__PURE__ */ jsx("main", { className: "p-6", children: /* @__PURE__ */ jsx("p", { className: "text-white", children: "페이지 준비 중입니다." }) })
        ]
      }
    )
  ] });
};
const route34 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: StrategyList$2
}, Symbol.toStringTag, { value: "Module" }));
const StrategyList$1 = () => {
  const { isSidebarOpen, isMobile, setIsMobile, closeSidebarOnMobile } = useSidebarStore();
  useNavigate();
  useEffect(() => {
    const checkScreenSize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
    };
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, [setIsMobile]);
  const handleOverlayClick = () => {
    closeSidebarOnMobile();
  };
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-gray-900", children: [
    isMobile && isSidebarOpen && /* @__PURE__ */ jsx(
      "div",
      {
        className: "fixed inset-0 bg-black bg-opacity-60 z-40",
        onClick: handleOverlayClick
      }
    ),
    /* @__PURE__ */ jsx(AdminSidebar, {}),
    /* @__PURE__ */ jsxs(
      "div",
      {
        className: `
        transition-all duration-300 ease-in-out
        ${!isMobile && isSidebarOpen ? "ml-64" : "ml-0"}
      `,
        children: [
          /* @__PURE__ */ jsx(Header$1, { title: "설정" }),
          /* @__PURE__ */ jsx("main", { className: "p-6", children: /* @__PURE__ */ jsx("p", { className: "text-white", children: "페이지 준비 중입니다." }) })
        ]
      }
    )
  ] });
};
const route35 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: StrategyList$1
}, Symbol.toStringTag, { value: "Module" }));
const API_KEY = "LIkFuzX0IKLuaMSQ5dEpYj0eW1GuFoYXrzP1VT1hIrFmySBelp7W117FBzT9eDjj";
let ws = null;
const loader$2 = async () => {
  const stream = new PassThrough$1();
  const headers = new Headers({
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive"
  });
  const res = await fetch$1("https://api.binance.com/api/v3/userDataStream", {
    method: "POST",
    headers: { "X-MBX-APIKEY": API_KEY }
  });
  const { listenKey } = await res.json();
  ws = new WebSocket$1(`wss://stream.binance.com:9443/ws/${listenKey}`);
  console.log("WebSocket 연결됨:", listenKey);
  ws.on("message", (msg) => {
    const data = JSON.parse(msg.toString());
    if (data.e === "outboundAccountPosition" || data.e === "balanceUpdate") {
      stream.write(`data: ${JSON.stringify(data)}

`);
    }
  });
  setInterval(() => {
    fetch$1(`https://api.binance.com/api/v3/userDataStream?listenKey=${listenKey}`, {
      method: "PUT",
      headers: { "X-MBX-APIKEY": API_KEY }
    });
  }, 30 * 60 * 1e3);
  return new Response(stream, { headers });
};
const route36 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  loader: loader$2
}, Symbol.toStringTag, { value: "Module" }));
const StrategyReport = () => {
  const { theme, toggleTheme } = useThemeStore();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState("1개월");
  const strategyProfitData = [
    { name: "RSI 역추세", profit: 12.5, color: "#10B981" },
    { name: "볼린저밴드", profit: 8.3, color: "#3B82F6" },
    { name: "이동평균 돌파", profit: 15.2, color: "#8B5CF6" },
    { name: "MACD 전략", profit: 6.8, color: "#F59E0B" },
    { name: "모멘텀 전략", profit: 11.4, color: "#EF4444" }
  ];
  const recentTrades = [
    {
      strategy: "RSI 역추세",
      action: "매수",
      symbol: "TSLA",
      amount: 10,
      price: 250.5,
      profit: "+2.1%",
      time: "14:25:32"
    },
    {
      strategy: "볼린저밴드",
      action: "매도",
      symbol: "NVDA",
      amount: 5,
      price: 890.2,
      profit: "+4.5%",
      time: "14:20:15"
    },
    {
      strategy: "이동평균 돌파",
      action: "매수",
      symbol: "AAPL",
      amount: 25,
      price: 195.3,
      profit: "+1.8%",
      time: "14:15:48"
    },
    {
      strategy: "MACD 전략",
      action: "매도",
      symbol: "AMZN",
      amount: 8,
      price: 3420.8,
      profit: "-0.5%",
      time: "14:10:22"
    },
    {
      strategy: "모멘텀 전략",
      action: "매수",
      symbol: "MSFT",
      amount: 15,
      price: 410.2,
      profit: "+3.2%",
      time: "14:05:11"
    }
  ];
  const strategyAnalysis = [
    {
      name: "RSI 역추세",
      totalProfit: 125e4,
      totalLoss: -18e4,
      netProfit: 107e4,
      winRate: 68.2,
      failures: [
        { reason: "급격한 시장 변동성", count: 3 },
        { reason: "거래량 부족", count: 2 },
        { reason: "뉴스 이벤트 영향", count: 1 }
      ]
    },
    {
      name: "볼린저밴드",
      totalProfit: 95e4,
      totalLoss: -12e4,
      netProfit: 83e4,
      winRate: 72.5,
      failures: [
        { reason: "횡보장에서 잦은 거짓신호", count: 4 },
        { reason: "밴드 수렴 구간 오판", count: 2 }
      ]
    },
    {
      name: "이동평균 돌파",
      totalProfit: 158e4,
      totalLoss: -28e4,
      netProfit: 13e5,
      winRate: 65.8,
      failures: [
        { reason: "가짜 돌파 신호", count: 5 },
        { reason: "지연된 진입 타이밍", count: 3 }
      ]
    }
  ];
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
    if (value >= 1e8) {
      return `${(value / 1e8).toFixed(1)}억`;
    } else if (value >= 1e4) {
      return `${(value / 1e4).toFixed(0)}만`;
    } else {
      return value.toLocaleString();
    }
  };
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: `min-h-screen ${theme === "dark" ? "bg-gray-900" : "bg-gray-50"}`,
      children: [
        /* @__PURE__ */ jsx(
          DashSidebar,
          {
            theme,
            sidebarOpen,
            setSidebarOpen,
            activeMenu: "전략 성과 리포트"
          }
        ),
        /* @__PURE__ */ jsxs(
          "div",
          {
            className: `transition-all duration-300 ${sidebarOpen ? "lg:ml-64" : "lg:ml-0"}`,
            children: [
              /* @__PURE__ */ jsx(
                DashHeader,
                {
                  theme,
                  toggleTheme,
                  sidebarOpen,
                  setSidebarOpen,
                  title: "전략 성과 리포트"
                }
              ),
              /* @__PURE__ */ jsxs("main", { className: "p-6", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between space-x-4 mb-4", children: [
                  /* @__PURE__ */ jsx("h3", { className: `text-lg font-bold ${theme === "dark" ? "text-white" : "text-gray-800"}`, children: "전략성과 리포트 기간 설정" }),
                  /* @__PURE__ */ jsx("div", { className: "flex space-x-2", children: ["1주일", "1개월", "3개월", "1년"].map((period) => /* @__PURE__ */ jsx(
                    "button",
                    {
                      onClick: () => setSelectedPeriod(period),
                      className: `px-3 py-1 text-sm rounded transition-colors ${selectedPeriod === period ? "bg-blue-500 text-white" : theme === "dark" ? "bg-gray-700 text-gray-300 hover:bg-gray-600" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`,
                      children: period
                    },
                    period
                  )) })
                ] }),
                /* @__PURE__ */ jsxs(
                  "div",
                  {
                    className: `rounded-xl shadow-lg p-6 border mb-8 ${theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`,
                    children: [
                      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-6", children: [
                        /* @__PURE__ */ jsx(
                          "h3",
                          {
                            className: `text-lg font-bold ${theme === "dark" ? "text-white" : "text-gray-800"}`,
                            children: "전략별 수익률 그래프"
                          }
                        ),
                        /* @__PURE__ */ jsx(BarChart3, { className: "w-5 h-5 text-blue-500" })
                      ] }),
                      /* @__PURE__ */ jsx(ResponsiveContainer, { width: "100%", height: 300, children: /* @__PURE__ */ jsxs(BarChart, { data: strategyProfitData, children: [
                        /* @__PURE__ */ jsx(
                          CartesianGrid,
                          {
                            strokeDasharray: "3 3",
                            stroke: theme === "dark" ? "#374151" : "#e5e7eb"
                          }
                        ),
                        /* @__PURE__ */ jsx(
                          XAxis,
                          {
                            dataKey: "name",
                            stroke: theme === "dark" ? "#9ca3af" : "#6b7280",
                            fontSize: 12
                          }
                        ),
                        /* @__PURE__ */ jsx(
                          YAxis,
                          {
                            stroke: theme === "dark" ? "#9ca3af" : "#6b7280",
                            tickFormatter: (value) => `${value}%`
                          }
                        ),
                        /* @__PURE__ */ jsx(
                          Tooltip,
                          {
                            contentStyle: {
                              backgroundColor: theme === "dark" ? "#1f2937" : "#ffffff",
                              border: `1px solid ${theme === "dark" ? "#374151" : "#e5e7eb"}`,
                              borderRadius: "8px",
                              color: theme === "dark" ? "#ffffff" : "#000000"
                            },
                            formatter: (value) => [`${value}%`, "수익률"]
                          }
                        ),
                        /* @__PURE__ */ jsx(Bar, { dataKey: "profit", fill: "#3B82F6", radius: [4, 4, 0, 0] })
                      ] }) })
                    ]
                  }
                ),
                /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8", children: [
                  /* @__PURE__ */ jsxs(
                    "div",
                    {
                      className: `rounded-xl shadow-lg p-6 border ${theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`,
                      children: [
                        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-4", children: [
                          /* @__PURE__ */ jsx(
                            "h3",
                            {
                              className: `text-lg font-bold ${theme === "dark" ? "text-white" : "text-gray-800"}`,
                              children: "최근 거래 내역"
                            }
                          ),
                          /* @__PURE__ */ jsx(Activity, { className: "w-5 h-5 text-green-500" })
                        ] }),
                        /* @__PURE__ */ jsx("div", { className: "space-y-3", children: recentTrades.slice(0, 5).map((trade, index) => /* @__PURE__ */ jsx(
                          "div",
                          {
                            className: `p-3 rounded-lg border ${theme === "dark" ? "bg-gray-700 border-gray-600" : "bg-gray-50 border-gray-200"}`,
                            children: /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-start mb-2", children: [
                              /* @__PURE__ */ jsxs("div", { children: [
                                /* @__PURE__ */ jsx(
                                  "div",
                                  {
                                    className: `font-medium text-sm ${theme === "dark" ? "text-white" : "text-gray-900"}`,
                                    children: trade.strategy
                                  }
                                ),
                                /* @__PURE__ */ jsxs(
                                  "div",
                                  {
                                    className: `text-xs ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`,
                                    children: [
                                      trade.symbol,
                                      " • ",
                                      trade.action,
                                      " ",
                                      trade.amount,
                                      "주"
                                    ]
                                  }
                                )
                              ] }),
                              /* @__PURE__ */ jsxs("div", { className: "text-right", children: [
                                /* @__PURE__ */ jsx(
                                  "div",
                                  {
                                    className: `text-sm font-medium ${trade.profit.startsWith("+") ? "text-green-500" : "text-red-500"}`,
                                    children: trade.profit
                                  }
                                ),
                                /* @__PURE__ */ jsx(
                                  "div",
                                  {
                                    className: `text-xs ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`,
                                    children: trade.time
                                  }
                                )
                              ] })
                            ] })
                          },
                          index
                        )) })
                      ]
                    }
                  ),
                  /* @__PURE__ */ jsxs(
                    "div",
                    {
                      className: `rounded-xl shadow-lg p-6 border ${theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`,
                      children: [
                        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-4", children: [
                          /* @__PURE__ */ jsx(
                            "h3",
                            {
                              className: `text-lg font-bold ${theme === "dark" ? "text-white" : "text-gray-800"}`,
                              children: "실현 손익"
                            }
                          ),
                          /* @__PURE__ */ jsx(DollarSign, { className: "w-5 h-5 text-blue-500" })
                        ] }),
                        /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
                          /* @__PURE__ */ jsx(
                            "div",
                            {
                              className: `p-4 rounded-lg ${theme === "dark" ? "bg-green-900/20 border border-green-500/30" : "bg-green-50 border border-green-200"}`,
                              children: /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center", children: [
                                /* @__PURE__ */ jsx(
                                  "span",
                                  {
                                    className: `text-sm font-medium ${theme === "dark" ? "text-green-400" : "text-green-800"}`,
                                    children: "총 수익"
                                  }
                                ),
                                /* @__PURE__ */ jsx(
                                  "span",
                                  {
                                    className: `text-lg font-bold ${theme === "dark" ? "text-green-400" : "text-green-600"}`,
                                    children: "+₩3,780,000"
                                  }
                                )
                              ] })
                            }
                          ),
                          /* @__PURE__ */ jsx(
                            "div",
                            {
                              className: `p-4 rounded-lg ${theme === "dark" ? "bg-red-900/20 border border-red-500/30" : "bg-red-50 border border-red-200"}`,
                              children: /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center", children: [
                                /* @__PURE__ */ jsx(
                                  "span",
                                  {
                                    className: `text-sm font-medium ${theme === "dark" ? "text-red-400" : "text-red-800"}`,
                                    children: "총 손실"
                                  }
                                ),
                                /* @__PURE__ */ jsx(
                                  "span",
                                  {
                                    className: `text-lg font-bold ${theme === "dark" ? "text-red-400" : "text-red-600"}`,
                                    children: "-₩580,000"
                                  }
                                )
                              ] })
                            }
                          ),
                          /* @__PURE__ */ jsx(
                            "div",
                            {
                              className: `p-4 rounded-lg ${theme === "dark" ? "bg-blue-900/20 border border-blue-500/30" : "bg-blue-50 border border-blue-200"}`,
                              children: /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center", children: [
                                /* @__PURE__ */ jsx(
                                  "span",
                                  {
                                    className: `text-sm font-medium ${theme === "dark" ? "text-blue-400" : "text-blue-800"}`,
                                    children: "순 손익"
                                  }
                                ),
                                /* @__PURE__ */ jsx(
                                  "span",
                                  {
                                    className: `text-lg font-bold ${theme === "dark" ? "text-blue-400" : "text-blue-600"}`,
                                    children: "+₩3,200,000"
                                  }
                                )
                              ] })
                            }
                          )
                        ] })
                      ]
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxs(
                  "div",
                  {
                    className: `rounded-xl shadow-lg p-6 border mb-8 ${theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`,
                    children: [
                      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-6", children: [
                        /* @__PURE__ */ jsx(
                          "h3",
                          {
                            className: `text-lg font-bold ${theme === "dark" ? "text-white" : "text-gray-800"}`,
                            children: "전략별 누적 수익 / 손실 / 실패 원인 분석"
                          }
                        ),
                        /* @__PURE__ */ jsx(Target, { className: "w-5 h-5 text-purple-500" })
                      ] }),
                      /* @__PURE__ */ jsx("div", { className: "space-y-6", children: strategyAnalysis.map((strategy, index) => /* @__PURE__ */ jsxs(
                        "div",
                        {
                          className: `p-6 rounded-lg border ${theme === "dark" ? "bg-gray-700 border-gray-600" : "bg-gray-50 border-gray-200"}`,
                          children: [
                            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-4", children: [
                              /* @__PURE__ */ jsx(
                                "h4",
                                {
                                  className: `text-lg font-semibold ${theme === "dark" ? "text-white" : "text-gray-900"}`,
                                  children: strategy.name
                                }
                              ),
                              /* @__PURE__ */ jsxs(
                                Badge,
                                {
                                  className: `${strategy.winRate >= 70 ? "bg-green-100 text-green-800" : strategy.winRate >= 60 ? "bg-yellow-100 text-yellow-800" : "bg-red-100 text-red-800"}`,
                                  children: [
                                    "승률 ",
                                    strategy.winRate,
                                    "%"
                                  ]
                                }
                              )
                            ] }),
                            /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4 mb-4", children: [
                              /* @__PURE__ */ jsxs(
                                "div",
                                {
                                  className: `p-3 rounded ${theme === "dark" ? "bg-green-900/30" : "bg-green-50"}`,
                                  children: [
                                    /* @__PURE__ */ jsx(
                                      "div",
                                      {
                                        className: `text-xs ${theme === "dark" ? "text-green-400" : "text-green-600"} mb-1`,
                                        children: "누적 수익"
                                      }
                                    ),
                                    /* @__PURE__ */ jsxs("div", { className: "text-green-600 font-bold", children: [
                                      "+₩",
                                      formatCurrency(strategy.totalProfit)
                                    ] })
                                  ]
                                }
                              ),
                              /* @__PURE__ */ jsxs(
                                "div",
                                {
                                  className: `p-3 rounded ${theme === "dark" ? "bg-red-900/30" : "bg-red-50"}`,
                                  children: [
                                    /* @__PURE__ */ jsx(
                                      "div",
                                      {
                                        className: `text-xs ${theme === "dark" ? "text-red-400" : "text-red-600"} mb-1`,
                                        children: "누적 손실"
                                      }
                                    ),
                                    /* @__PURE__ */ jsxs("div", { className: "text-red-600 font-bold", children: [
                                      "₩",
                                      formatCurrency(strategy.totalLoss)
                                    ] })
                                  ]
                                }
                              ),
                              /* @__PURE__ */ jsxs(
                                "div",
                                {
                                  className: `p-3 rounded ${theme === "dark" ? "bg-blue-900/30" : "bg-blue-50"}`,
                                  children: [
                                    /* @__PURE__ */ jsx(
                                      "div",
                                      {
                                        className: `text-xs ${theme === "dark" ? "text-blue-400" : "text-blue-600"} mb-1`,
                                        children: "순 손익"
                                      }
                                    ),
                                    /* @__PURE__ */ jsxs("div", { className: "text-blue-600 font-bold", children: [
                                      "+₩",
                                      formatCurrency(strategy.netProfit)
                                    ] })
                                  ]
                                }
                              )
                            ] }),
                            /* @__PURE__ */ jsxs("div", { children: [
                              /* @__PURE__ */ jsx(
                                "div",
                                {
                                  className: `text-sm font-medium mb-2 ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`,
                                  children: "주요 실패 원인"
                                }
                              ),
                              /* @__PURE__ */ jsx("div", { className: "space-y-2", children: strategy.failures.map((failure, idx) => /* @__PURE__ */ jsxs(
                                "div",
                                {
                                  className: "flex justify-between items-center",
                                  children: [
                                    /* @__PURE__ */ jsx(
                                      "span",
                                      {
                                        className: `text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`,
                                        children: failure.reason
                                      }
                                    ),
                                    /* @__PURE__ */ jsxs(Badge, { variant: "outline", className: `text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`, children: [
                                      failure.count,
                                      "회"
                                    ] })
                                  ]
                                },
                                idx
                              )) })
                            ] })
                          ]
                        },
                        index
                      )) })
                    ]
                  }
                ),
                /* @__PURE__ */ jsxs(
                  "div",
                  {
                    className: `rounded-xl shadow-lg p-6 border ${theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`,
                    children: [
                      /* @__PURE__ */ jsxs("div", { className: "flex items-center mb-4", children: [
                        /* @__PURE__ */ jsx(CheckCircle, { className: "w-5 h-5 text-green-500 mr-2" }),
                        /* @__PURE__ */ jsx(
                          "h3",
                          {
                            className: `text-lg font-bold ${theme === "dark" ? "text-white" : "text-gray-800"}`,
                            children: "요약"
                          }
                        )
                      ] }),
                      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [
                        /* @__PURE__ */ jsxs("div", { children: [
                          /* @__PURE__ */ jsx(
                            "h4",
                            {
                              className: `font-semibold mb-3 ${theme === "dark" ? "text-white" : "text-gray-900"}`,
                              children: "구역 설명"
                            }
                          ),
                          /* @__PURE__ */ jsxs("div", { className: "space-y-2 text-sm", children: [
                            /* @__PURE__ */ jsx(
                              "div",
                              {
                                className: `${theme === "dark" ? "text-gray-300" : "text-gray-700"}`,
                                children: "• 전략 목록: 사용자 등록 전략 상태 + 실행 제어"
                              }
                            ),
                            /* @__PURE__ */ jsx(
                              "div",
                              {
                                className: `${theme === "dark" ? "text-gray-300" : "text-gray-700"}`,
                                children: "• 전략 등록: 기본정보 + 조건 + 실행설정"
                              }
                            ),
                            /* @__PURE__ */ jsx(
                              "div",
                              {
                                className: `${theme === "dark" ? "text-gray-300" : "text-gray-700"}`,
                                children: "• 수전 전략: 플래폼 프리셋 전략 목록 (복사 또는 구독)"
                              }
                            ),
                            /* @__PURE__ */ jsx(
                              "div",
                              {
                                className: `${theme === "dark" ? "text-gray-300" : "text-gray-700"}`,
                                children: "• 성과 리포트: 전략별 손익 추이 및 실행 이력"
                              }
                            )
                          ] })
                        ] }),
                        /* @__PURE__ */ jsxs("div", { children: [
                          /* @__PURE__ */ jsx(
                            "h4",
                            {
                              className: `font-semibold mb-3 ${theme === "dark" ? "text-white" : "text-gray-900"}`,
                              children: "전체 성과 요약"
                            }
                          ),
                          /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                            /* @__PURE__ */ jsxs("div", { className: "flex justify-between", children: [
                              /* @__PURE__ */ jsx(
                                "span",
                                {
                                  className: `text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`,
                                  children: "활성 전략 수"
                                }
                              ),
                              /* @__PURE__ */ jsx(
                                "span",
                                {
                                  className: `text-sm font-medium ${theme === "dark" ? "text-white" : "text-gray-900"}`,
                                  children: "5개"
                                }
                              )
                            ] }),
                            /* @__PURE__ */ jsxs("div", { className: "flex justify-between", children: [
                              /* @__PURE__ */ jsx(
                                "span",
                                {
                                  className: `text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`,
                                  children: "평균 승률"
                                }
                              ),
                              /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-green-600", children: "68.8%" })
                            ] }),
                            /* @__PURE__ */ jsxs("div", { className: "flex justify-between", children: [
                              /* @__PURE__ */ jsx(
                                "span",
                                {
                                  className: `text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`,
                                  children: "총 거래 횟수"
                                }
                              ),
                              /* @__PURE__ */ jsx(
                                "span",
                                {
                                  className: `text-sm font-medium ${theme === "dark" ? "text-white" : "text-gray-900"}`,
                                  children: "142회"
                                }
                              )
                            ] }),
                            /* @__PURE__ */ jsxs("div", { className: "flex justify-between", children: [
                              /* @__PURE__ */ jsx(
                                "span",
                                {
                                  className: `text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`,
                                  children: "최고 수익률"
                                }
                              ),
                              /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-green-600", children: "+15.2%" })
                            ] })
                          ] })
                        ] })
                      ] })
                    ]
                  }
                )
              ] }),
              /* @__PURE__ */ jsx(DashFooter, { theme })
            ]
          }
        )
      ]
    }
  );
};
const route37 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: StrategyReport
}, Symbol.toStringTag, { value: "Module" }));
const action$2 = async ({ request }) => {
  const { email } = await request.json();
  const value = String(email);
  const form = new URLSearchParams();
  form.append("email", value ?? "");
  const res0 = await fetch("https://tradinggear.co.kr:8081/tradinggear/member_inform_get.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
      // ✅ JSON 형식 명시
    },
    body: form.toString()
  });
  const data1 = await res0.json();
  const API_KEY2 = data1[0]["decrypted_api_key"];
  const API_SECRET2 = data1[0]["decrypted_api_secret"];
  const timestamp = Date.now();
  const query = `timestamp=${timestamp}`;
  const signature = crypto.createHmac("sha256", API_SECRET2).update(query).digest("hex");
  const spotRes = await fetch(
    `https://api.binance.com/api/v3/account?${query}&signature=${signature}`,
    { headers: { "X-MBX-APIKEY": API_KEY2 } }
  );
  const spotData = await spotRes.json();
  const ownedSpotSymbols = spotData.balances.filter((b) => parseFloat(b.free) + parseFloat(b.locked) > 0).map((b) => b.asset);
  const futureRes = await fetch(
    `https://fapi.binance.com/fapi/v2/positionRisk?${query}&signature=${signature}`,
    { headers: { "X-MBX-APIKEY": API_KEY2 } }
  );
  const futuresData = await futureRes.json();
  const ownedFutureSymbols = futuresData.filter((p) => parseFloat(p.positionAmt) !== 0).map((p) => p.symbol);
  const spotCount = ownedSpotSymbols.length;
  const futuresCount = ownedFutureSymbols.length;
  const totalCount = spotCount + futuresCount;
  return json({
    spotCount,
    futuresCount,
    totalCount,
    ownedSpotSymbols,
    ownedFutureSymbols
  });
};
const route38 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$2
}, Symbol.toStringTag, { value: "Module" }));
const NewStrategyRegistration = () => {
  const { theme, toggleTheme } = useThemeStore();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentStep, setCurrentStep] = useState(1);
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
    entryAmountType: "dollar",
    // 'dollar' or 'percent'
    stopLoss: "",
    stopLossType: "atr",
    // 'atr', 'percent', 'ob'
    takeProfit: "",
    takeProfitType: "atr",
    // 'atr', 'percent'
    trailingStop: false,
    // Step 4: 실행 조건
    autoTrading: "",
    tradingHours: { start: "09:00", end: "23:30" },
    maxEntriesPerDay: "",
    cooldownTime: ""
  });
  const steps = [
    {
      number: 1,
      title: "전략 기본 정보 입력",
      description: "전략의 기본적인 정보를 설정합니다"
    },
    {
      number: 2,
      title: "진입 조건 구성",
      description: "매매 신호 조건을 구성합니다"
    },
    {
      number: 3,
      title: "리스크 관리 설정",
      description: "손절과 익절 조건을 설정합니다"
    },
    {
      number: 4,
      title: "실행 조건",
      description: "자동매매 실행 조건을 설정합니다"
    }
  ];
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
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value
    }));
  };
  const handleArrayInputChange = (field, value, checked) => {
    setFormData((prev) => ({
      ...prev,
      [field]: checked ? [...prev[field], value] : prev[field].filter((item) => item !== value)
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
        return /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
          /* @__PURE__ */ jsx(
            "h3",
            {
              className: `text-lg font-semibold ${theme === "dark" ? "text-white" : "text-gray-900"}`,
              children: "1. 전략 기본 정보 입력"
            }
          ),
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx(
                "label",
                {
                  htmlFor: "strategyName",
                  className: `block text-sm font-medium mb-2 ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`,
                  children: "전략 이름"
                }
              ),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "text",
                  value: formData.strategyName,
                  onChange: (e) => handleInputChange("strategyName", e.target.value),
                  placeholder: "전략 이름을 입력하세요",
                  className: `w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${theme === "dark" ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400" : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"}`
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx(
                "label",
                {
                  htmlFor: "strategyType",
                  className: `block text-sm font-medium mb-2 ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`,
                  children: "전략 유형"
                }
              ),
              /* @__PURE__ */ jsxs(
                "select",
                {
                  value: formData.strategyType,
                  onChange: (e) => handleInputChange("strategyType", e.target.value),
                  className: `w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${theme === "dark" ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-gray-900"}`,
                  children: [
                    /* @__PURE__ */ jsx("option", { value: "", children: "전략 유형 선택" }),
                    /* @__PURE__ */ jsx("option", { value: "단타", children: "단타" }),
                    /* @__PURE__ */ jsx("option", { value: "스윙", children: "스윙" }),
                    /* @__PURE__ */ jsx("option", { value: "중장기", children: "중장기" })
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx(
                "label",
                {
                  htmlFor: "timeFrame",
                  className: `block text-sm font-medium mb-2 ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`,
                  children: "타임프레임"
                }
              ),
              /* @__PURE__ */ jsxs(
                "select",
                {
                  value: formData.timeFrame,
                  onChange: (e) => handleInputChange("timeFrame", e.target.value),
                  className: `w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${theme === "dark" ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-gray-900"}`,
                  children: [
                    /* @__PURE__ */ jsx("option", { value: "", children: "타임프레임 선택" }),
                    /* @__PURE__ */ jsx("option", { value: "5분", children: "5분" }),
                    /* @__PURE__ */ jsx("option", { value: "15분", children: "15분" }),
                    /* @__PURE__ */ jsx("option", { value: "1시간", children: "1시간" }),
                    /* @__PURE__ */ jsx("option", { value: "일봉", children: "일봉" })
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx(
                "label",
                {
                  htmlFor: "assetSelection",
                  className: `block text-sm font-medium mb-2 ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`,
                  children: "자산 선택"
                }
              ),
              /* @__PURE__ */ jsxs(
                "select",
                {
                  value: formData.assetSelection,
                  onChange: (e) => handleInputChange("assetSelection", e.target.value),
                  className: `w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${theme === "dark" ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-gray-900"}`,
                  children: [
                    /* @__PURE__ */ jsx("option", { value: "", children: "자산 선택" }),
                    /* @__PURE__ */ jsx("option", { value: "드롭다운", children: "드롭다운" }),
                    /* @__PURE__ */ jsx("option", { value: "검색", children: "검색" })
                  ]
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx(
              "label",
              {
                htmlFor: "description",
                className: `block text-sm font-medium mb-2 ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`,
                children: "설명"
              }
            ),
            /* @__PURE__ */ jsx(
              "textarea",
              {
                value: formData.description,
                onChange: (e) => handleInputChange("description", e.target.value),
                placeholder: "전략에 대한 설명을 입력하세요",
                rows: 3,
                className: `w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${theme === "dark" ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400" : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"}`
              }
            )
          ] })
        ] });
      case 2:
        return /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
          /* @__PURE__ */ jsx(
            "h3",
            {
              className: `text-lg font-semibold ${theme === "dark" ? "text-white" : "text-gray-900"}`,
              children: "2. 진입 조건 구성"
            }
          ),
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx(
                "label",
                {
                  htmlFor: "baseline",
                  className: `block text-sm font-medium mb-2 ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`,
                  children: "기준선"
                }
              ),
              /* @__PURE__ */ jsxs(
                "select",
                {
                  value: formData.baseline,
                  onChange: (e) => handleInputChange("baseline", e.target.value),
                  className: `w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${theme === "dark" ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-gray-900"}`,
                  children: [
                    /* @__PURE__ */ jsx("option", { value: "", children: "기준선 선택" }),
                    /* @__PURE__ */ jsx("option", { value: "VWAP", children: "VWAP" }),
                    /* @__PURE__ */ jsx("option", { value: "POC", children: "POC" }),
                    /* @__PURE__ */ jsx("option", { value: "TEMA", children: "TEMA" })
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx(
                "label",
                {
                  htmlFor: "entryMethod",
                  className: `block text-sm font-medium mb-2 ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`,
                  children: "진입 방식"
                }
              ),
              /* @__PURE__ */ jsxs(
                "select",
                {
                  value: formData.entryMethod,
                  onChange: (e) => handleInputChange("entryMethod", e.target.value),
                  className: `w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${theme === "dark" ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-gray-900"}`,
                  children: [
                    /* @__PURE__ */ jsx("option", { value: "", children: "진입 방식 선택" }),
                    /* @__PURE__ */ jsx("option", { value: "기준선 돌파", children: "기준선 돌파" }),
                    /* @__PURE__ */ jsx("option", { value: "OB 박스", children: "OB 박스" }),
                    /* @__PURE__ */ jsx("option", { value: "거래량 급등", children: "거래량 급등" })
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx(
                "label",
                {
                  htmlFor: "direction",
                  className: `block text-sm font-medium mb-2 ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`,
                  children: "방향"
                }
              ),
              /* @__PURE__ */ jsxs(
                "select",
                {
                  value: formData.direction,
                  onChange: (e) => handleInputChange("direction", e.target.value),
                  className: `w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${theme === "dark" ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-gray-900"}`,
                  children: [
                    /* @__PURE__ */ jsx("option", { value: "", children: "방향 선택" }),
                    /* @__PURE__ */ jsx("option", { value: "롱", children: "롱" }),
                    /* @__PURE__ */ jsx("option", { value: "숏", children: "숏" }),
                    /* @__PURE__ */ jsx("option", { value: "양방향", children: "양방향" })
                  ]
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx(
              "label",
              {
                htmlFor: "auxiliaryFilters",
                className: `block text-sm font-medium mb-3 ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`,
                children: "보조 필터 (체크박스)"
              }
            ),
            /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-3", children: ["CVD", "OB 필터", "RSI", "히트맵"].map((filter) => /* @__PURE__ */ jsxs(
              "label",
              {
                className: "flex items-center space-x-2 cursor-pointer",
                children: [
                  /* @__PURE__ */ jsx(
                    "input",
                    {
                      type: "checkbox",
                      checked: formData.auxiliaryFilters.includes(filter),
                      onChange: (e) => handleArrayInputChange(
                        "auxiliaryFilters",
                        filter,
                        e.target.checked
                      ),
                      className: "rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "span",
                    {
                      className: `text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`,
                      children: filter
                    }
                  )
                ]
              },
              filter
            )) })
          ] })
        ] });
      case 3:
        return /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
          /* @__PURE__ */ jsx(
            "h3",
            {
              className: `text-lg font-semibold ${theme === "dark" ? "text-white" : "text-gray-900"}`,
              children: "3. 리스크 관리 설정"
            }
          ),
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx(
                "label",
                {
                  htmlFor: "entryAmount",
                  className: `block text-sm font-medium mb-2 ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`,
                  children: "진입 금액"
                }
              ),
              /* @__PURE__ */ jsxs("div", { className: "flex space-x-2", children: [
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "number",
                    value: formData.entryAmount,
                    onChange: (e) => handleInputChange("entryAmount", e.target.value),
                    placeholder: "금액 입력",
                    className: `flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${theme === "dark" ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400" : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"}`
                  }
                ),
                /* @__PURE__ */ jsxs(
                  "select",
                  {
                    value: formData.entryAmountType,
                    onChange: (e) => handleInputChange("entryAmountType", e.target.value),
                    className: `px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${theme === "dark" ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-gray-900"}`,
                    children: [
                      /* @__PURE__ */ jsx("option", { value: "dollar", children: "$" }),
                      /* @__PURE__ */ jsx("option", { value: "percent", children: "%" })
                    ]
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx(
                "label",
                {
                  htmlFor: "stopLoss",
                  className: `block text-sm font-medium mb-2 ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`,
                  children: "SL (손절)"
                }
              ),
              /* @__PURE__ */ jsxs("div", { className: "flex space-x-2", children: [
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "text",
                    value: formData.stopLoss,
                    onChange: (e) => handleInputChange("stopLoss", e.target.value),
                    placeholder: "1.2 또는 -3 또는 OB",
                    className: `flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${theme === "dark" ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400" : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"}`
                  }
                ),
                /* @__PURE__ */ jsxs(
                  "select",
                  {
                    value: formData.stopLossType,
                    onChange: (e) => handleInputChange("stopLossType", e.target.value),
                    className: `px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${theme === "dark" ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-gray-900"}`,
                    children: [
                      /* @__PURE__ */ jsx("option", { value: "atr", children: "ATR" }),
                      /* @__PURE__ */ jsx("option", { value: "percent", children: "%" }),
                      /* @__PURE__ */ jsx("option", { value: "ob", children: "OB 하단" })
                    ]
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx(
                "label",
                {
                  htmlFor: "takeProfit",
                  className: `block text-sm font-medium mb-2 ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`,
                  children: "TP (익절)"
                }
              ),
              /* @__PURE__ */ jsxs("div", { className: "flex space-x-2", children: [
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "text",
                    value: formData.takeProfit,
                    onChange: (e) => handleInputChange("takeProfit", e.target.value),
                    placeholder: "1.5 또는 +5",
                    className: `flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${theme === "dark" ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400" : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"}`
                  }
                ),
                /* @__PURE__ */ jsxs(
                  "select",
                  {
                    value: formData.takeProfitType,
                    onChange: (e) => handleInputChange("takeProfitType", e.target.value),
                    className: `px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${theme === "dark" ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-gray-900"}`,
                    children: [
                      /* @__PURE__ */ jsx("option", { value: "atr", children: "ATR" }),
                      /* @__PURE__ */ jsx("option", { value: "percent", children: "%" })
                    ]
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx(
                "label",
                {
                  htmlFor: "trailingStop",
                  className: `block text-sm font-medium mb-2 ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`,
                  children: "트레일링 스탑"
                }
              ),
              /* @__PURE__ */ jsxs(
                "select",
                {
                  value: formData.trailingStop ? "ON" : "OFF",
                  onChange: (e) => handleInputChange("trailingStop", e.target.value === "ON"),
                  className: `w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${theme === "dark" ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-gray-900"}`,
                  children: [
                    /* @__PURE__ */ jsx("option", { value: "ON", children: "ON" }),
                    /* @__PURE__ */ jsx("option", { value: "OFF", children: "OFF" })
                  ]
                }
              )
            ] })
          ] })
        ] });
      case 4:
        return /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
          /* @__PURE__ */ jsx(
            "h3",
            {
              className: `text-lg font-semibold ${theme === "dark" ? "text-white" : "text-gray-900"}`,
              children: "4. 실행 조건"
            }
          ),
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx(
                "label",
                {
                  htmlFor: "autoTrading",
                  className: `block text-sm font-medium mb-2 ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`,
                  children: "자동매매 계정"
                }
              ),
              /* @__PURE__ */ jsxs(
                "select",
                {
                  value: formData.autoTrading,
                  onChange: (e) => handleInputChange("autoTrading", e.target.value),
                  className: `w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${theme === "dark" ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-gray-900"}`,
                  children: [
                    /* @__PURE__ */ jsx("option", { value: "", children: "계정 선택" }),
                    /* @__PURE__ */ jsx("option", { value: "binance", children: "[연동된] Binance" }),
                    /* @__PURE__ */ jsx("option", { value: "3commas", children: "[연동된] 3Commas" })
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx(
                "label",
                {
                  htmlFor: "tradingHours",
                  className: `block text-sm font-medium mb-2 ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`,
                  children: "진입 가능 시간대"
                }
              ),
              /* @__PURE__ */ jsxs("div", { className: "flex space-x-2 items-center", children: [
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "time",
                    value: formData.tradingHours.start,
                    onChange: (e) => handleInputChange("tradingHours", {
                      ...formData.tradingHours,
                      start: e.target.value
                    }),
                    className: `px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${theme === "dark" ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-gray-900"}`
                  }
                ),
                /* @__PURE__ */ jsx(
                  "span",
                  {
                    className: theme === "dark" ? "text-gray-300" : "text-gray-700",
                    children: "~"
                  }
                ),
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "time",
                    value: formData.tradingHours.end,
                    onChange: (e) => handleInputChange("tradingHours", {
                      ...formData.tradingHours,
                      end: e.target.value
                    }),
                    className: `px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${theme === "dark" ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-gray-900"}`
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx(
                "label",
                {
                  htmlFor: "maxEntriesPerDay",
                  className: `block text-sm font-medium mb-2 ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`,
                  children: "1일 최대 진입 횟수"
                }
              ),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "number",
                  value: formData.maxEntriesPerDay,
                  onChange: (e) => handleInputChange("maxEntriesPerDay", e.target.value),
                  placeholder: "횟수 입력",
                  className: `w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${theme === "dark" ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400" : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"}`
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx(
                "label",
                {
                  htmlFor: "cooldownTime",
                  className: `block text-sm font-medium mb-2 ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`,
                  children: "쿨다운 시간"
                }
              ),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "number",
                  value: formData.cooldownTime,
                  onChange: (e) => handleInputChange("cooldownTime", e.target.value),
                  placeholder: "분 단위로 입력",
                  className: `w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${theme === "dark" ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400" : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"}`
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxs(
            "div",
            {
              className: `p-4 rounded-lg border ${theme === "dark" ? "bg-gray-700 border-gray-600" : "bg-gray-50 border-gray-200"}`,
              children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-4", children: [
                  /* @__PURE__ */ jsx(
                    "h4",
                    {
                      className: `text-md font-semibold ${theme === "dark" ? "text-white" : "text-gray-900"}`,
                      children: "전략 미리보기"
                    }
                  ),
                  /* @__PURE__ */ jsxs("div", { className: "flex space-x-2", children: [
                    /* @__PURE__ */ jsxs("button", { className: "flex items-center px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200 dark:bg-blue-900/20 dark:text-blue-300", children: [
                      /* @__PURE__ */ jsx(Eye, { className: "w-4 h-4 mr-1" }),
                      "미리보기"
                    ] }),
                    /* @__PURE__ */ jsxs("button", { className: "flex items-center px-3 py-1 text-sm bg-green-100 text-green-700 rounded hover:bg-green-200 dark:bg-green-900/20 dark:text-green-300", children: [
                      /* @__PURE__ */ jsx(FileText, { className: "w-4 h-4 mr-1" }),
                      "저장 및 등록"
                    ] })
                  ] })
                ] }),
                /* @__PURE__ */ jsxs(
                  "div",
                  {
                    className: `text-sm space-y-2 ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`,
                    children: [
                      /* @__PURE__ */ jsxs("div", { children: [
                        /* @__PURE__ */ jsx("strong", { children: "전략명:" }),
                        " ",
                        formData.strategyName || "미입력"
                      ] }),
                      /* @__PURE__ */ jsxs("div", { children: [
                        /* @__PURE__ */ jsx("strong", { children: "유형:" }),
                        " ",
                        formData.strategyType || "미선택",
                        " |",
                        " ",
                        /* @__PURE__ */ jsx("strong", { children: "시간봉:" }),
                        " ",
                        formData.timeFrame || "미선택"
                      ] }),
                      /* @__PURE__ */ jsxs("div", { children: [
                        /* @__PURE__ */ jsx("strong", { children: "자산:" }),
                        " ",
                        formData.assetSelection || "미선택"
                      ] }),
                      /* @__PURE__ */ jsxs("div", { children: [
                        /* @__PURE__ */ jsx("strong", { children: "진입조건:" }),
                        " ",
                        formData.baseline || "미설정",
                        " +",
                        " ",
                        formData.entryMethod || "미설정"
                      ] }),
                      /* @__PURE__ */ jsxs("div", { children: [
                        /* @__PURE__ */ jsx("strong", { children: "리스크:" }),
                        " SL ",
                        formData.stopLoss || "미설정",
                        " | TP ",
                        formData.takeProfit || "미설정"
                      ] })
                    ]
                  }
                )
              ]
            }
          )
        ] });
      default:
        return null;
    }
  };
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: `min-h-screen ${theme === "dark" ? "bg-gray-900" : "bg-gray-50"}`,
      children: [
        /* @__PURE__ */ jsx(
          DashSidebar,
          {
            theme,
            sidebarOpen,
            setSidebarOpen,
            activeMenu: "내 전략 관리"
          }
        ),
        /* @__PURE__ */ jsxs(
          "div",
          {
            className: `transition-all duration-300 ${sidebarOpen ? "lg:ml-64" : "lg:ml-0"}`,
            children: [
              /* @__PURE__ */ jsx(
                DashHeader,
                {
                  theme,
                  toggleTheme,
                  sidebarOpen,
                  setSidebarOpen,
                  title: "내 전략 관리"
                }
              ),
              /* @__PURE__ */ jsxs("main", { className: "p-6", children: [
                /* @__PURE__ */ jsxs(
                  "div",
                  {
                    className: `mb-8 p-6 rounded-lg border ${theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`,
                    children: [
                      /* @__PURE__ */ jsxs("div", { className: "text-center mb-6", children: [
                        /* @__PURE__ */ jsx(
                          "h2",
                          {
                            className: `text-2xl font-bold mb-2 ${theme === "dark" ? "text-white" : "text-gray-900"}`,
                            children: "새 전략 등록 폼"
                          }
                        ),
                        /* @__PURE__ */ jsx(
                          "p",
                          {
                            className: `${theme === "dark" ? "text-gray-400" : "text-gray-600"}`,
                            children: "단계별로 전략을 구성하거나 전체 폼을 한번에 작성할 수 있습니다"
                          }
                        )
                      ] }),
                      /* @__PURE__ */ jsx("div", { className: "flex items-center justify-between max-w-4xl mx-auto mb-6", children: steps.map((step, index) => /* @__PURE__ */ jsxs("div", { className: "flex items-center", children: [
                        /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center", children: [
                          /* @__PURE__ */ jsx(
                            "div",
                            {
                              className: `w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium border-2 transition-colors ${currentStep >= step.number ? theme === "dark" ? "bg-cyan-600 border-cyan-600 text-white" : "bg-blue-600 border-blue-600 text-white" : theme === "dark" ? "border-gray-600 text-gray-400" : "border-gray-300 text-gray-500"}`,
                              children: currentStep > step.number ? /* @__PURE__ */ jsx(CheckCircle, { className: "w-5 h-5" }) : step.number
                            }
                          ),
                          /* @__PURE__ */ jsxs("div", { className: "mt-2 text-center", children: [
                            /* @__PURE__ */ jsx(
                              "div",
                              {
                                className: `text-xs font-medium ${currentStep >= step.number ? theme === "dark" ? "text-cyan-400" : "text-blue-600" : theme === "dark" ? "text-gray-400" : "text-gray-500"}`,
                                children: step.title
                              }
                            ),
                            /* @__PURE__ */ jsx(
                              "div",
                              {
                                className: `text-xs mt-1 ${theme === "dark" ? "text-gray-500" : "text-gray-400"}`,
                                children: step.description
                              }
                            )
                          ] })
                        ] }),
                        index < steps.length - 1 && /* @__PURE__ */ jsx(
                          "div",
                          {
                            className: `w-16 h-0.5 mx-4 ${currentStep > step.number ? theme === "dark" ? "bg-cyan-600" : "bg-blue-600" : theme === "dark" ? "bg-gray-600" : "bg-gray-300"}`
                          }
                        )
                      ] }, step.number)) })
                    ]
                  }
                ),
                /* @__PURE__ */ jsx(
                  "div",
                  {
                    className: `mb-8 p-6 rounded-lg border ${theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`,
                    children: renderStepContent()
                  }
                ),
                /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center", children: [
                  /* @__PURE__ */ jsxs(
                    "button",
                    {
                      onClick: prevStep,
                      disabled: currentStep === 1,
                      className: `flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${currentStep === 1 ? "bg-gray-300 text-gray-500 cursor-not-allowed dark:bg-gray-600 dark:text-gray-400" : "bg-gray-500 text-white hover:bg-gray-600 dark:bg-gray-600 dark:hover:bg-gray-500"}`,
                      children: [
                        /* @__PURE__ */ jsx(ArrowLeft, { className: "w-4 h-4 mr-2" }),
                        "이전 단계"
                      ]
                    }
                  ),
                  /* @__PURE__ */ jsx("div", { className: "flex space-x-3", children: currentStep < 4 ? /* @__PURE__ */ jsxs(
                    "button",
                    {
                      onClick: nextStep,
                      className: `flex items-center px-6 py-2 rounded-lg font-medium transition-colors ${theme === "dark" ? "bg-cyan-600 text-white hover:bg-cyan-700" : "bg-blue-600 text-white hover:bg-blue-700"}`,
                      children: [
                        "다음 단계",
                        /* @__PURE__ */ jsx(ArrowRight, { className: "w-4 h-4 ml-2" })
                      ]
                    }
                  ) : /* @__PURE__ */ jsxs(
                    "button",
                    {
                      onClick: handleSubmit,
                      className: "flex items-center px-6 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors",
                      children: [
                        /* @__PURE__ */ jsx(Save, { className: "w-4 h-4 mr-2" }),
                        "전략 등록 완료"
                      ]
                    }
                  ) })
                ] })
              ] }),
              /* @__PURE__ */ jsx(DashFooter, { theme })
            ]
          }
        )
      ]
    }
  );
};
const route39 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: NewStrategyRegistration
}, Symbol.toStringTag, { value: "Module" }));
const StrategyList = () => {
  const { isSidebarOpen, isMobile, setIsMobile, closeSidebarOnMobile } = useSidebarStore();
  useNavigate();
  useEffect(() => {
    const checkScreenSize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
    };
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, [setIsMobile]);
  const handleOverlayClick = () => {
    closeSidebarOnMobile();
  };
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-gray-900", children: [
    isMobile && isSidebarOpen && /* @__PURE__ */ jsx(
      "div",
      {
        className: "fixed inset-0 bg-black bg-opacity-60 z-40",
        onClick: handleOverlayClick
      }
    ),
    /* @__PURE__ */ jsx(AdminSidebar, {}),
    /* @__PURE__ */ jsxs(
      "div",
      {
        className: `
        transition-all duration-300 ease-in-out
        ${!isMobile && isSidebarOpen ? "ml-64" : "ml-0"}
      `,
        children: [
          /* @__PURE__ */ jsx(Header$1, { title: "차단 전략" }),
          /* @__PURE__ */ jsx("main", { className: "p-6", children: /* @__PURE__ */ jsx("p", { className: "text-white", children: "페이지 준비 중입니다." }) })
        ]
      }
    )
  ] });
};
const route40 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: StrategyList
}, Symbol.toStringTag, { value: "Module" }));
const AdminDashboard$2 = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [searchType, setSearchType] = useState("id_email");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "ascending" });
  const [email, setemail] = useState("");
  const [nickName, setnickName] = useState("");
  useRef(false);
  useEffect(() => {
    if (sessionStorage.getItem("adminEmail") == null) {
      window.location.href = "/admin_login_check";
      return;
    }
    const checkScreenSize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) {
        setIsSidebarOpen(true);
      } else {
        setIsSidebarOpen(false);
      }
    };
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);
  const searchOptions = ["이메일", "회원명", "닉네임"];
  const searchOptionsKey = ["id_email", "full_name", "nick_name"];
  const handleOverlayClick = () => {
    if (isMobile) {
      setIsSidebarOpen(false);
    }
  };
  const [membersData, setMembersData] = useState([]);
  useEffect(() => {
    fetch("https://tradinggear.co.kr:8081/tradinggear/members_data.php").then((res) => {
      if (!res.ok) throw new Error("네트워크 오류");
      return res.json();
    }).then((data) => {
      setMembersData(data);
    }).catch((err) => {
      console.error("데이터 가져오기 실패:", err);
    });
    setemail(String(sessionStorage.getItem("adminEmail")));
    setnickName(String(sessionStorage.getItem("adminNickName")));
  }, []);
  const searchTypeSet = useRef(null);
  const searchValue = useRef(null);
  const handleSubmit = async (e) => {
    var _a;
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    console.log("Login form submitted:", formData);
    const searchType_value = String(searchType);
    const searchValue_value = String((_a = searchValue.current) == null ? void 0 : _a.value);
    const form = new URLSearchParams();
    form.append("searchType", searchType_value ?? "");
    form.append("searchValue", searchValue_value ?? "");
    const res = await fetch("https://tradinggear.co.kr:8081/tradinggear/members_data.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: form
    });
    const data1 = await res.json();
    setMembersData(data1);
  };
  const filteredMembers = membersData.filter((member) => {
    if (!searchTerm) return true;
    switch (searchType) {
      case "이메일":
        return member.id_email.toLowerCase().includes(searchTerm.toLowerCase());
      case "회원명":
        return member.full_name.toLowerCase().includes(searchTerm.toLowerCase());
      case "닉네임":
        return member.nick_name.includes(searchTerm);
      default:
        return true;
    }
  });
  const sortedMembers = React__default.useMemo(() => {
    let sortableMembers = [...filteredMembers];
    if (sortConfig.key !== null) {
      sortableMembers.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableMembers;
  }, [filteredMembers, sortConfig]);
  const requestSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };
  const getSortIcon = (columnName) => {
    if (sortConfig.key !== columnName) {
      return /* @__PURE__ */ jsx(ArrowUpDown, { className: "w-4 h-4 ml-1 opacity-50" });
    }
    return sortConfig.direction === "ascending" ? /* @__PURE__ */ jsx(ChevronUp, { className: "w-4 h-4 ml-1" }) : /* @__PURE__ */ jsx(ChevronDown, { className: "w-4 h-4 ml-1" });
  };
  const getGradeBadge = (grade) => {
    const darkStyles = {
      /*
      basic: 'bg-gray-700 text-gray-300 border-gray-600',
      plus: 'bg-blue-900/50 text-blue-300 border-blue-500',
      pro: 'bg-purple-900/50 text-purple-300 border-purple-500',
      max: 'bg-gradient-to-r from-yellow-900/50 to-orange-900/50 text-yellow-300 border-yellow-500'
       */
      1: "bg-gray-700 text-gray-300 border-gray-600",
      2: "bg-blue-900/50 text-blue-300 border-blue-500",
      3: "bg-purple-900/50 text-purple-300 border-purple-500",
      4: "bg-gradient-to-r from-yellow-900/50 to-orange-900/50 text-yellow-300 border-yellow-500",
      5: "bg-gradient-to-r from-yellow-900/50 to-orange-900/50 text-yellow-300 border-yellow-500"
    };
    const lightStyles = {
      /*
      basic: 'bg-gray-100 text-gray-700 border-gray-300',
      plus: 'bg-blue-100 text-blue-700 border-blue-400',
      pro: 'bg-purple-100 text-purple-700 border-purple-400',
      max: 'bg-gradient-to-r from-yellow-100 to-orange-100 text-orange-700 border-orange-400'
      */
      1: "bg-gray-100 text-gray-700 border-gray-300",
      2: "bg-blue-100 text-blue-700 border-blue-400",
      3: "bg-purple-100 text-purple-700 border-purple-400",
      4: "bg-gradient-to-r from-yellow-100 to-orange-100 text-orange-700 border-orange-400",
      5: "bg-gradient-to-r from-yellow-100 to-orange-100 text-orange-700 border-orange-400"
    };
    const styles = isDarkMode ? darkStyles : lightStyles;
    let grade_text = "";
    if (grade == 1) {
      grade_text = "normal";
    } else if (grade == 2) {
      grade_text = "basic";
    } else if (grade == 2) {
      grade_text = "plus";
    } else if (grade == 3) {
      grade_text = "pro";
    } else if (grade == 4) {
      grade_text = "max";
    }
    return /* @__PURE__ */ jsx("span", { className: `px-3 py-1 rounded-full text-xs font-medium border ${styles[grade]}`, children: grade_text.toUpperCase() });
  };
  const themeClasses = {
    bg: isDarkMode ? "bg-gray-900" : "bg-gray-50",
    card: isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200",
    text: isDarkMode ? "text-white" : "text-gray-900",
    textSecondary: isDarkMode ? "text-gray-300" : "text-gray-600",
    textMuted: isDarkMode ? "text-gray-400" : "text-gray-500",
    input: isDarkMode ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400" : "bg-white border-gray-300 text-gray-900 placeholder-gray-500",
    tableRow: isDarkMode ? "border-gray-700 hover:bg-gray-750" : "border-gray-200 hover:bg-gray-50",
    tableHeader: isDarkMode ? "bg-gray-750" : "bg-gray-50"
  };
  return /* @__PURE__ */ jsxs("div", { className: `min-h-screen ${themeClasses.bg}`, children: [
    isMobile && isSidebarOpen && /* @__PURE__ */ jsx(
      "div",
      {
        className: "fixed inset-0 bg-black bg-opacity-60 z-40",
        onClick: handleOverlayClick
      }
    ),
    /* @__PURE__ */ jsx(AdminSidebar, {}),
    /* @__PURE__ */ jsxs("div", { className: `
        transition-all duration-300 ease-in-out
        ${!isMobile && isSidebarOpen ? "ml-64" : "ml-0"}
      `, children: [
      /* @__PURE__ */ jsx(Header$1, { title: "회원목록" }),
      /* @__PURE__ */ jsxs("main", { className: "p-6", children: [
        /* @__PURE__ */ jsx("div", { className: "flex items-center justify-between mb-6", children: /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h2", { className: `text-2xl font-bold ${themeClasses.text} mb-2`, children: "회원 관리" }),
          /* @__PURE__ */ jsxs("p", { className: themeClasses.textMuted, children: [
            "총 ",
            membersData.length,
            "명의 회원이 있습니다."
          ] })
        ] }) }),
        /* @__PURE__ */ jsx("form", { className: "space-y-6", onSubmit: handleSubmit, children: /* @__PURE__ */ jsx("div", { className: `${themeClasses.card} rounded-lg p-4 mb-6`, children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col md:flex-row gap-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "md:w-2/12 w-full", children: [
            /* @__PURE__ */ jsx(Label, { className: `block text-sm font-medium ${themeClasses.textSecondary} mb-2`, children: "검색 항목" }),
            /* @__PURE__ */ jsxs(Select, { value: searchType, onValueChange: setSearchType, children: [
              /* @__PURE__ */ jsx(SelectTrigger, { id: "searchType", name: "searchType", ref: searchTypeSet, className: `w-full px-3 py-2 ${themeClasses.input} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`, children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "검색 항목" }) }),
              /* @__PURE__ */ jsx(SelectContent, { children: /* @__PURE__ */ jsx(SelectGroup, { children: searchOptions.map((option, i) => /* @__PURE__ */ jsx(SelectItem, { value: searchOptionsKey[i], children: option }, searchOptionsKey[i])) }) })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "md:w-10/12 w-full", children: [
            /* @__PURE__ */ jsx(Label, { className: `block text-sm font-medium ${themeClasses.textSecondary} mb-2`, children: "검색어" }),
            /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
              /* @__PURE__ */ jsx(Input, { type: "text", id: "searchValue", name: "searchValue", ref: searchValue, placeholder: "검색어", value: searchTerm, onChange: (e) => setSearchTerm(e.target.value), className: `flex-1 px-3 py-2 ${themeClasses.input} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent` }),
              /* @__PURE__ */ jsxs(Button, { type: "submit", className: "px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200", children: [
                /* @__PURE__ */ jsx(Search, { className: "w-4 h-4" }),
                "검색"
              ] })
            ] })
          ] })
        ] }) }) }),
        /* @__PURE__ */ jsx("div", { className: `${themeClasses.card} rounded-lg overflow-hidden`, children: /* @__PURE__ */ jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxs("table", { className: "w-full", children: [
          /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { className: `border-b ${isDarkMode ? "border-gray-700" : "border-gray-200"} ${themeClasses.tableHeader}`, children: [
            /* @__PURE__ */ jsx(
              "th",
              {
                className: `text-left py-4 px-6 font-semibold ${themeClasses.textSecondary} cursor-pointer hover:bg-opacity-80 transition-colors`,
                onClick: () => requestSort("email"),
                children: /* @__PURE__ */ jsxs("div", { className: "flex items-center", children: [
                  "이메일",
                  getSortIcon("email")
                ] })
              }
            ),
            /* @__PURE__ */ jsx(
              "th",
              {
                className: `text-left py-4 px-6 font-semibold text-center ${themeClasses.textSecondary} cursor-pointer hover:bg-opacity-80 transition-colors`,
                onClick: () => requestSort("name"),
                children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center", children: [
                  "회원명",
                  getSortIcon("full_name")
                ] })
              }
            ),
            /* @__PURE__ */ jsx(
              "th",
              {
                className: `text-left py-4 px-6 font-semibold text-center ${themeClasses.textSecondary} cursor-pointer hover:bg-opacity-80 transition-colors`,
                onClick: () => requestSort("grade"),
                children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center", children: [
                  "회원등급",
                  getSortIcon("grade")
                ] })
              }
            ),
            /* @__PURE__ */ jsx(
              "th",
              {
                className: `text-left py-4 px-6 font-semibold text-center ${themeClasses.textSecondary} cursor-pointer hover:bg-opacity-80 transition-colors`,
                onClick: () => requestSort("phone"),
                children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center", children: [
                  "닉네임",
                  getSortIcon("nick_name")
                ] })
              }
            ),
            /* @__PURE__ */ jsx("th", { className: `text-left py-4 px-6 font-semibold text-center justify-center ${themeClasses.textSecondary}`, children: "비고" })
          ] }) }),
          /* @__PURE__ */ jsx("tbody", { children: sortedMembers.map((member, index) => /* @__PURE__ */ jsxs("tr", { className: `border-b ${themeClasses.tableRow} transition-colors duration-200`, children: [
            /* @__PURE__ */ jsx("td", { className: `py-4 px-6 ${themeClasses.textSecondary}`, children: member.id_email }),
            /* @__PURE__ */ jsx("td", { className: `py-4 px-6 text-center ${themeClasses.text} font-medium`, children: member.full_name }),
            /* @__PURE__ */ jsx("td", { className: "py-4 px-6 text-center", children: getGradeBadge(member.grade) }),
            /* @__PURE__ */ jsx("td", { className: `py-4 px-6 text-center ${themeClasses.textSecondary}`, children: member.nick_name }),
            /* @__PURE__ */ jsx("td", { className: "py-4 px-6", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center space-x-2", children: [
              /* @__PURE__ */ jsx("button", { className: `p-2 rounded-lg transition-colors duration-200 ${isDarkMode ? "text-blue-400 hover:bg-blue-900/20" : "text-blue-600 hover:bg-blue-100"}`, children: /* @__PURE__ */ jsx(Edit, { className: "w-4 h-4" }) }),
              /* @__PURE__ */ jsx("button", { className: `p-2 rounded-lg transition-colors duration-200 ${isDarkMode ? "text-red-400 hover:bg-red-900/20" : "text-red-600 hover:bg-red-100"}`, children: /* @__PURE__ */ jsx(Trash2, { className: "w-4 h-4" }) })
            ] }) })
          ] }, member.id)) })
        ] }) }) })
      ] })
    ] })
  ] });
};
const route41 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: AdminDashboard$2
}, Symbol.toStringTag, { value: "Module" }));
const AdminDashboard$1 = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [searchType, setSearchType] = useState("이메일");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "ascending" });
  useEffect(() => {
    const checkScreenSize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) {
        setIsSidebarOpen(true);
      } else {
        setIsSidebarOpen(false);
      }
    };
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);
  const menuItems = [
    { icon: Users, label: "회원목록", href: "#", active: true }
  ];
  const searchOptions = ["이메일", "회원명", "연락처"];
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };
  const handleLogout = () => {
    localStorage.removeItem("adminLoggedIn");
    localStorage.removeItem("adminEmail");
    alert("로그아웃되었습니다. 로그인 페이지로 이동합니다.");
    window.location.href = "/admin/login";
  };
  const handleOverlayClick = () => {
    if (isMobile) {
      setIsSidebarOpen(false);
    }
  };
  const [membersData] = useState([
    {
      id: 1,
      email: "john.doe@example.com",
      name: "김철수",
      grade: "plus",
      phone: "010-1234-5678"
    },
    {
      id: 2,
      email: "jane.smith@example.com",
      name: "이영희",
      grade: "basic",
      phone: "010-2345-6789"
    },
    {
      id: 3,
      email: "bob.wilson@example.com",
      name: "박민수",
      grade: "pro",
      phone: "010-3456-7890"
    },
    {
      id: 4,
      email: "alice.brown@example.com",
      name: "최지영",
      grade: "max",
      phone: "010-4567-8901"
    },
    {
      id: 5,
      email: "charlie.davis@example.com",
      name: "정하늘",
      grade: "basic",
      phone: "010-5678-9012"
    },
    {
      id: 6,
      email: "diana.miller@example.com",
      name: "한소라",
      grade: "plus",
      phone: "010-6789-0123"
    }
  ]);
  const filteredMembers = membersData.filter((member) => {
    if (!searchTerm) return true;
    switch (searchType) {
      case "이메일":
        return member.email.toLowerCase().includes(searchTerm.toLowerCase());
      case "회원명":
        return member.name.toLowerCase().includes(searchTerm.toLowerCase());
      case "연락처":
        return member.phone.includes(searchTerm);
      default:
        return true;
    }
  });
  const sortedMembers = React__default.useMemo(() => {
    let sortableMembers = [...filteredMembers];
    if (sortConfig.key !== null) {
      sortableMembers.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableMembers;
  }, [filteredMembers, sortConfig]);
  const requestSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };
  const getSortIcon = (columnName) => {
    if (sortConfig.key !== columnName) {
      return /* @__PURE__ */ jsx(ArrowUpDown, { className: "w-4 h-4 ml-1 opacity-50" });
    }
    return sortConfig.direction === "ascending" ? /* @__PURE__ */ jsx(ChevronUp, { className: "w-4 h-4 ml-1" }) : /* @__PURE__ */ jsx(ChevronDown, { className: "w-4 h-4 ml-1" });
  };
  const getGradeBadge = (grade) => {
    const darkStyles = {
      basic: "bg-gray-700 text-gray-300 border-gray-600",
      plus: "bg-blue-900/50 text-blue-300 border-blue-500",
      pro: "bg-purple-900/50 text-purple-300 border-purple-500",
      max: "bg-gradient-to-r from-yellow-900/50 to-orange-900/50 text-yellow-300 border-yellow-500"
    };
    const lightStyles = {
      basic: "bg-gray-100 text-gray-700 border-gray-300",
      plus: "bg-blue-100 text-blue-700 border-blue-400",
      pro: "bg-purple-100 text-purple-700 border-purple-400",
      max: "bg-gradient-to-r from-yellow-100 to-orange-100 text-orange-700 border-orange-400"
    };
    const styles = isDarkMode ? darkStyles : lightStyles;
    return /* @__PURE__ */ jsx("span", { className: `px-3 py-1 rounded-full text-xs font-medium border ${styles[grade]}`, children: grade.toUpperCase() });
  };
  const themeClasses = {
    bg: isDarkMode ? "bg-gray-900" : "bg-gray-50",
    sidebar: isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200",
    header: isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200",
    card: isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200",
    text: isDarkMode ? "text-white" : "text-gray-900",
    textSecondary: isDarkMode ? "text-gray-300" : "text-gray-600",
    textMuted: isDarkMode ? "text-gray-400" : "text-gray-500",
    input: isDarkMode ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400" : "bg-white border-gray-300 text-gray-900 placeholder-gray-500",
    button: isDarkMode ? "bg-gray-700 text-gray-300 hover:bg-gray-600" : "bg-gray-100 text-gray-700 hover:bg-gray-200",
    tableRow: isDarkMode ? "border-gray-700 hover:bg-gray-750" : "border-gray-200 hover:bg-gray-50",
    tableHeader: isDarkMode ? "bg-gray-750" : "bg-gray-50"
  };
  return /* @__PURE__ */ jsxs("div", { className: `min-h-screen ${themeClasses.bg}`, children: [
    isMobile && isSidebarOpen && /* @__PURE__ */ jsx(
      "div",
      {
        className: "fixed inset-0 bg-black bg-opacity-60 z-40",
        onClick: handleOverlayClick
      }
    ),
    /* @__PURE__ */ jsx("div", { className: `
        fixed top-0 left-0 h-full  border-r ${themeClasses.sidebar} z-50 transition-transform duration-300 ease-in-out
        ${isMobile ? "w-64" : "w-64"}
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
      `, children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col h-full", children: [
      /* @__PURE__ */ jsxs("div", { className: `flex items-center justify-between px-[25px] pt-[25px] pb-[15px] ${isDarkMode ? "border-gray-700" : "border-gray-200"}`, children: [
        /* @__PURE__ */ jsx("h2", { className: `text-xl font-bold md:leading-[1.6] ${themeClasses.text}`, children: /* @__PURE__ */ jsx("a", { href: "/admin", children: /* @__PURE__ */ jsx("img", { className: "h-[44px]", src: isDarkMode ? "/logo-white.png" : "/logo.png", alt: "" }) }) }),
        isMobile && /* @__PURE__ */ jsx(
          "button",
          {
            onClick: toggleSidebar,
            className: `p-1 rounded-md ${isDarkMode ? "hover:bg-gray-700 text-gray-400" : "hover:bg-gray-100 text-gray-600"}`,
            children: /* @__PURE__ */ jsx(X, { className: "w-5 h-5" })
          }
        )
      ] }),
      /* @__PURE__ */ jsx("nav", { className: "flex-1 p-4", children: /* @__PURE__ */ jsx("ul", { className: "space-y-2", children: menuItems.map((item, index) => {
        const Icon = item.icon;
        return /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsxs(
          "a",
          {
            href: item.href,
            className: `
                        flex items-center px-4 py-3 rounded-lg transition-colors duration-200
                        ${item.active ? "bg-blue-600 text-white" : `${themeClasses.textSecondary} ${isDarkMode ? "hover:bg-gray-700 hover:text-white" : "hover:bg-gray-100 hover:text-gray-900"}`}
                      `,
            children: [
              /* @__PURE__ */ jsx(Icon, { className: "w-5 h-5 mr-3" }),
              /* @__PURE__ */ jsx("span", { className: "font-medium", children: item.label })
            ]
          }
        ) }, index);
      }) }) }),
      /* @__PURE__ */ jsx("div", { className: `p-4 border-t ${isDarkMode ? "border-gray-700" : "border-gray-200"}`, children: /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: handleLogout,
          className: `w-full flex items-center px-4 py-3 rounded-lg transition-colors duration-200 ${isDarkMode ? "text-gray-300 hover:bg-gray-700 hover:text-white" : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"}`,
          children: [
            /* @__PURE__ */ jsx(Lock, { className: "w-5 h-5 mr-3" }),
            /* @__PURE__ */ jsx("span", { className: "font-medium", children: "로그아웃" })
          ]
        }
      ) })
    ] }) }),
    /* @__PURE__ */ jsxs("div", { className: `
        transition-all duration-300 ease-in-out
        ${!isMobile && isSidebarOpen ? "ml-64" : "ml-0"}
      `, children: [
      /* @__PURE__ */ jsx("header", { className: `${themeClasses.header} border-b`, children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between px-4 py-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center", children: [
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: toggleSidebar,
              className: `p-2 rounded-md transition-colors duration-200 ${isDarkMode ? "hover:bg-gray-700 text-gray-400" : "hover:bg-gray-100 text-gray-600"}`,
              children: /* @__PURE__ */ jsx(Menu, { className: "w-5 h-5" })
            }
          ),
          /* @__PURE__ */ jsx("h1", { className: `ml-4 text-xl font-semibold ${themeClasses.text}`, children: "회원목록" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-4", children: [
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: toggleDarkMode,
              className: `p-2 rounded-md transition-colors duration-200 ${isDarkMode ? "hover:bg-gray-700 text-gray-400" : "hover:bg-gray-100 text-gray-600"}`,
              children: isDarkMode ? /* @__PURE__ */ jsx(Sun, { className: "w-5 h-5" }) : /* @__PURE__ */ jsx(Moon, { className: "w-5 h-5" })
            }
          ),
          /* @__PURE__ */ jsxs("button", { className: `p-2 rounded-md relative transition-colors duration-200 ${isDarkMode ? "hover:bg-gray-700 text-gray-400" : "hover:bg-gray-100 text-gray-600"}`, children: [
            /* @__PURE__ */ jsx(Bell, { className: "w-5 h-5" }),
            /* @__PURE__ */ jsx("span", { className: "absolute top-1 right-1 w-2 h-2 bg-blue-500 rounded-full" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-2", children: [
            /* @__PURE__ */ jsx("div", { className: "w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center", children: /* @__PURE__ */ jsx(User, { className: "w-5 h-5 text-white" }) }),
            /* @__PURE__ */ jsx("span", { className: `hidden md:block text-sm font-medium ${themeClasses.textSecondary}`, children: "관리자" })
          ] })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxs("main", { className: "p-6", children: [
        /* @__PURE__ */ jsx("div", { className: "flex items-center justify-between mb-6", children: /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h2", { className: `text-2xl font-bold ${themeClasses.text} mb-2`, children: "회원 관리" }),
          /* @__PURE__ */ jsxs("p", { className: themeClasses.textMuted, children: [
            "총 ",
            membersData.length,
            "명의 회원이 있습니다."
          ] })
        ] }) }),
        /* @__PURE__ */ jsx("div", { className: `${themeClasses.card} rounded-lg p-4 mb-6`, children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col md:flex-row gap-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "md:w-2/12 w-full", children: [
            /* @__PURE__ */ jsx(Label, { className: `block text-sm font-medium ${themeClasses.textSecondary} mb-2`, children: "검색 항목" }),
            /* @__PURE__ */ jsxs(Select, { value: searchType, onValueChange: setSearchType, children: [
              /* @__PURE__ */ jsx(SelectTrigger, { className: `w-full h-10 px-3 py-2 ${themeClasses.input} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`, children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "검색 항목" }) }),
              /* @__PURE__ */ jsx(SelectContent, { children: /* @__PURE__ */ jsx(SelectGroup, { children: searchOptions.map((option) => /* @__PURE__ */ jsx(SelectItem, { value: option, children: option }, option)) }) })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "md:w-10/12 w-full", children: [
            /* @__PURE__ */ jsx(Label, { className: `block text-sm font-medium ${themeClasses.textSecondary} mb-2`, children: "검색어" }),
            /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
              /* @__PURE__ */ jsx(Input, { type: searchType, placeholder: "검색어", value: searchTerm, onChange: (e) => setSearchTerm(e.target.value), className: `flex-1 h-10 px-3 py-2 ${themeClasses.input} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent` }),
              /* @__PURE__ */ jsxs(Button, { className: "px-4 py-2 h-10 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200", children: [
                /* @__PURE__ */ jsx(Search, { className: "w-4 h-4" }),
                "검색"
              ] })
            ] })
          ] })
        ] }) }),
        /* @__PURE__ */ jsx("div", { className: `${themeClasses.card} rounded-lg overflow-hidden`, children: /* @__PURE__ */ jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxs("table", { className: "w-full", children: [
          /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { className: `border-b ${isDarkMode ? "border-gray-700" : "border-gray-200"} ${themeClasses.tableHeader}`, children: [
            /* @__PURE__ */ jsx(
              "th",
              {
                className: `text-left py-4 px-6 font-semibold ${themeClasses.textSecondary} cursor-pointer hover:bg-opacity-80 transition-colors`,
                onClick: () => requestSort("email"),
                children: /* @__PURE__ */ jsxs("div", { className: "flex items-center", children: [
                  "이메일",
                  getSortIcon("email")
                ] })
              }
            ),
            /* @__PURE__ */ jsx(
              "th",
              {
                className: `text-left py-4 px-6 font-semibold text-center ${themeClasses.textSecondary} cursor-pointer hover:bg-opacity-80 transition-colors`,
                onClick: () => requestSort("name"),
                children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center", children: [
                  "회원명",
                  getSortIcon("name")
                ] })
              }
            ),
            /* @__PURE__ */ jsx(
              "th",
              {
                className: `text-left py-4 px-6 font-semibold text-center ${themeClasses.textSecondary} cursor-pointer hover:bg-opacity-80 transition-colors`,
                onClick: () => requestSort("grade"),
                children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center", children: [
                  "회원등급",
                  getSortIcon("grade")
                ] })
              }
            ),
            /* @__PURE__ */ jsx(
              "th",
              {
                className: `text-left py-4 px-6 font-semibold text-center ${themeClasses.textSecondary} cursor-pointer hover:bg-opacity-80 transition-colors`,
                onClick: () => requestSort("phone"),
                children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center", children: [
                  "회원연락처",
                  getSortIcon("phone")
                ] })
              }
            ),
            /* @__PURE__ */ jsx("th", { className: `text-left py-4 px-6 font-semibold text-center justify-center ${themeClasses.textSecondary}`, children: "비고" })
          ] }) }),
          /* @__PURE__ */ jsx("tbody", { children: sortedMembers.map((member, index) => /* @__PURE__ */ jsxs("tr", { className: `border-b ${themeClasses.tableRow} transition-colors duration-200`, children: [
            /* @__PURE__ */ jsx("td", { className: `py-4 px-6 ${themeClasses.textSecondary}`, children: member.email }),
            /* @__PURE__ */ jsx("td", { className: `py-4 px-6 text-center ${themeClasses.text} font-medium`, children: member.name }),
            /* @__PURE__ */ jsx("td", { className: "py-4 px-6 text-center", children: getGradeBadge(member.grade) }),
            /* @__PURE__ */ jsx("td", { className: `py-4 px-6 text-center ${themeClasses.textSecondary}`, children: member.phone }),
            /* @__PURE__ */ jsx("td", { className: "py-4 px-6", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center space-x-2", children: [
              /* @__PURE__ */ jsx("button", { className: `p-2 rounded-lg transition-colors duration-200 ${isDarkMode ? "text-blue-400 hover:bg-blue-900/20" : "text-blue-600 hover:bg-blue-100"}`, children: /* @__PURE__ */ jsx(Edit, { className: "w-4 h-4" }) }),
              /* @__PURE__ */ jsx("button", { className: `p-2 rounded-lg transition-colors duration-200 ${isDarkMode ? "text-red-400 hover:bg-red-900/20" : "text-red-600 hover:bg-red-100"}`, children: /* @__PURE__ */ jsx(Trash2, { className: "w-4 h-4" }) })
            ] }) })
          ] }, member.id)) })
        ] }) }) }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mt-6", children: [
          /* @__PURE__ */ jsxs("div", { className: `text-sm ${themeClasses.textMuted}`, children: [
            "총 ",
            sortedMembers.length,
            "개 중 1-",
            sortedMembers.length,
            "개 표시"
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-2", children: [
            /* @__PURE__ */ jsx("button", { className: `px-3 py-2 ${themeClasses.button} rounded-lg transition-colors duration-200 disabled:opacity-50`, disabled: true, children: "이전" }),
            /* @__PURE__ */ jsx("button", { className: "px-3 py-2 text-white bg-blue-600 rounded-lg", children: "1" }),
            /* @__PURE__ */ jsx("button", { className: `px-3 py-2 ${themeClasses.button} rounded-lg transition-colors duration-200 disabled:opacity-50`, disabled: true, children: "다음" })
          ] })
        ] })
      ] })
    ] })
  ] });
};
const route42 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: AdminDashboard$1
}, Symbol.toStringTag, { value: "Module" }));
const AdminLoginPage = () => {
  var _a;
  const idRef = useRef(null);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [loginForm, setLoginForm] = useState({
    userId: (_a = idRef.current) == null ? void 0 : _a.value,
    password: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  function setLoginIdCookie(email) {
    const maxAge = 60 * 60 * 24 * 30;
    const sameSite = "Lax";
    const secure = location.protocol === "https:" ? "; Secure" : "";
    document.cookie = `loginId=${encodeURIComponent(email)}; Max-Age=${maxAge}; Path=/; SameSite=${sameSite}${secure}`;
  }
  function getLoginIdCookie() {
    const m = document.cookie.match(/(?:^|;\s*)loginId=([^;]+)/);
    return m ? decodeURIComponent(m[1]) : null;
  }
  useEffect(() => {
    const saved = getLoginIdCookie();
    const el = document.getElementById("userId") || null;
    if (saved == null) {
      el.value = "";
    } else {
      if (el) el.value = String(saved);
    }
  }, []);
  const handleLogin = async () => {
    setIsLoading(true);
    setLoginError("");
    setTimeout(async () => {
      var _a2;
      const email_value = String((_a2 = idRef.current) == null ? void 0 : _a2.value);
      const pwd_value = String(loginForm.password);
      const form1 = new URLSearchParams();
      form1.append("email", email_value ?? "");
      form1.append("pwd", pwd_value ?? "");
      console.log(form1);
      const res = await fetch("https://tradinggear.co.kr:8081/tradinggear/admin_pass_check.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: form1
      });
      const data1 = await res.text();
      console.log(data1);
      const data2 = data1.split("|@|");
      if (data2[0] == "wrong") {
        setIsLoading(false);
        setLoginError("이메일 또는 비밀번호가 올바르지 않습니다.");
        return;
      }
      setLoginIdCookie(email_value);
      sessionStorage.setItem("adminEmail", String(email_value));
      sessionStorage.setItem("adminNickName", String(data2[1]));
      setLoginError("");
      setIsLoading(false);
      window.location.href = "/admin/member";
    }, 1e3);
  };
  const themeClasses = {
    bg: isDarkMode ? "bg-gray-900" : "bg-gray-50",
    card: isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200",
    text: isDarkMode ? "text-white" : "text-gray-900",
    textSecondary: isDarkMode ? "text-gray-300" : "text-gray-600",
    textMuted: isDarkMode ? "text-gray-400" : "text-gray-500",
    input: isDarkMode ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400" : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
  };
  return /* @__PURE__ */ jsx("div", { className: `px-10 min-h-screen flex items-center justify-center ${themeClasses.bg}`, children: /* @__PURE__ */ jsxs("div", { className: `w-full max-w-md ${themeClasses.card} border rounded-lg shadow-lg p-8`, children: [
    /* @__PURE__ */ jsxs("div", { className: "text-center mb-8", children: [
      /* @__PURE__ */ jsx("div", { className: "w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4", children: /* @__PURE__ */ jsx(Lock, { className: "w-8 h-8 text-white" }) }),
      /* @__PURE__ */ jsx("h1", { className: `text-2xl font-bold ${themeClasses.text} mb-2`, children: "관리자 로그인" })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { htmlFor: "userId", className: `block text-sm font-medium ${themeClasses.textSecondary} mb-2`, children: "아이디" }),
        /* @__PURE__ */ jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ jsx(User, { className: `absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${themeClasses.textMuted}` }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "id",
              id: "userId",
              value: loginForm.userId,
              onChange: (e) => setLoginForm({ ...loginForm, userId: e.target.value }),
              onKeyDown: (e) => e.key === "Enter" && handleLogin(),
              className: `w-full pl-10 pr-4 py-3 ${themeClasses.input} border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`,
              placeholder: "아이디를 입력하세요",
              ref: idRef
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { htmlFor: "password", className: `block text-sm font-medium ${themeClasses.textSecondary} mb-2`, children: "비밀번호" }),
        /* @__PURE__ */ jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ jsx(Lock, { className: `absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${themeClasses.textMuted}` }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: showPassword ? "text" : "password",
              value: loginForm.password,
              onChange: (e) => setLoginForm({ ...loginForm, password: e.target.value }),
              onKeyDown: (e) => e.key === "Enter" && handleLogin(),
              className: `w-full pl-10 pr-12 py-3 ${themeClasses.input} border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`,
              placeholder: "비밀번호를 입력하세요"
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              onClick: () => setShowPassword(!showPassword),
              className: `absolute right-3 top-1/2 transform -translate-y-1/2 ${themeClasses.textMuted} hover:${themeClasses.textSecondary}`,
              children: showPassword ? /* @__PURE__ */ jsx(EyeOff, { className: "w-5 h-5" }) : /* @__PURE__ */ jsx(Eye, { className: "w-5 h-5" })
            }
          )
        ] })
      ] }),
      loginError && /* @__PURE__ */ jsx("div", { className: "bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm", children: loginError }),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: handleLogin,
          disabled: isLoading,
          className: `w-full py-3 px-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${isDarkMode ? "focus:ring-offset-gray-800" : "focus:ring-offset-white"}`,
          children: isLoading ? "로그인 중..." : "로그인"
        }
      )
    ] })
  ] }) });
};
const route43 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: AdminLoginPage
}, Symbol.toStringTag, { value: "Module" }));
const StrategyStatistics = () => {
  const { isSidebarOpen, isMobile, setIsMobile, closeSidebarOnMobile } = useSidebarStore();
  useNavigate();
  const [selectedPeriod, setSelectedPeriod] = useState("6개월");
  const [selectedStrategy, setSelectedStrategy] = useState("전체");
  useEffect(() => {
    const checkScreenSize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
    };
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, [setIsMobile]);
  const handleOverlayClick = () => {
    closeSidebarOnMobile();
  };
  const profitData = [
    { name: "1월", profit: 17 },
    { name: "2월", profit: 12 },
    { name: "3월", profit: 9 },
    { name: "4월", profit: 6 },
    { name: "5월", profit: 4 },
    { name: "6월", profit: 3 }
  ];
  const userCountData = [
    { name: "1", count: 350 },
    { name: "2", count: 250 },
    { name: "3", count: 180 },
    { name: "4", count: 100 },
    { name: "5", count: 50 }
  ];
  const entryData = [
    { name: "첫째", value: 200 },
    { name: "둘째", value: 250 },
    { name: "셋째", value: 220 },
    { name: "넷째", value: 240 },
    { name: "다섯째", value: 250 },
    { name: "여섯째", value: 260 }
  ];
  const failureData = [
    { name: "시세반등", value: 55, color: "#3B82F6" },
    { name: "벽 전치", value: 25, color: "#06B6D4" },
    { name: "API 오류 등", value: 20, color: "#10B981" }
  ];
  const slippageData = [
    { name: "1월", value: 0.3 },
    { name: "2월", value: 0.35 },
    { name: "3월", value: 0.32 },
    { name: "4월", value: 0.4 },
    { name: "5월", value: 0.45 },
    { name: "6월", value: 0.43 }
  ];
  const signalSlippageData = [
    { name: "1월", value: 0.48 },
    { name: "2월", value: 0.45 },
    { name: "3월", value: 0.5 },
    { name: "4월", value: 0.52 },
    { name: "5월", value: 0.48 },
    { name: "6월", value: 0.5 }
  ];
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
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-gray-900", children: [
    isMobile && isSidebarOpen && /* @__PURE__ */ jsx(
      "div",
      {
        className: "fixed inset-0 bg-black bg-opacity-60 z-40",
        onClick: handleOverlayClick
      }
    ),
    /* @__PURE__ */ jsx(AdminSidebar, {}),
    /* @__PURE__ */ jsxs(
      "div",
      {
        className: `
              transition-all duration-300 ease-in-out
              ${!isMobile && isSidebarOpen ? "ml-64" : "ml-0"}
            `,
        children: [
          /* @__PURE__ */ jsx(Header$1, { title: "전략 통계" }),
          /* @__PURE__ */ jsx("div", { className: "bg-gray-800 border-b border-gray-700", children: /* @__PURE__ */ jsx("div", { className: "px-6 py-4", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-4", children: [
              /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold text-white", children: "전략 통계" }),
              /* @__PURE__ */ jsx("div", { className: "text-sm text-gray-400", children: "전략 성능 모니터링 (통계 대시보드)" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-4", children: [
              /* @__PURE__ */ jsxs(
                "select",
                {
                  value: selectedStrategy,
                  onChange: (e) => setSelectedStrategy(e.target.value),
                  className: "bg-gray-700 text-white border border-gray-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500",
                  children: [
                    /* @__PURE__ */ jsx("option", { value: "전체", children: "전체 전략" }),
                    /* @__PURE__ */ jsx("option", { value: "단타", children: "단타 전략" }),
                    /* @__PURE__ */ jsx("option", { value: "스윙", children: "스윙 전략" })
                  ]
                }
              ),
              /* @__PURE__ */ jsxs(
                "select",
                {
                  value: selectedPeriod,
                  onChange: (e) => setSelectedPeriod(e.target.value),
                  className: "bg-gray-700 text-white border border-gray-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500",
                  children: [
                    /* @__PURE__ */ jsx("option", { value: "1개월", children: "1개월" }),
                    /* @__PURE__ */ jsx("option", { value: "3개월", children: "3개월" }),
                    /* @__PURE__ */ jsx("option", { value: "6개월", children: "6개월" }),
                    /* @__PURE__ */ jsx("option", { value: "1년", children: "1년" })
                  ]
                }
              ),
              /* @__PURE__ */ jsxs("button", { className: "bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition-colors flex items-center space-x-2", children: [
                /* @__PURE__ */ jsx(Download, { className: "w-4 h-4" }),
                /* @__PURE__ */ jsx("span", { children: "내보내기" })
              ] })
            ] })
          ] }) }) }),
          /* @__PURE__ */ jsxs("main", { className: "p-6", children: [
            /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8", children: summaryCards.map((card, index) => {
              const Icon = card.icon;
              return /* @__PURE__ */ jsx("div", { className: `bg-gray-800 rounded-lg p-6 border ${getCardColors(card.color)}`, children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("p", { className: "text-gray-400 text-sm mb-2", children: card.title }),
                  /* @__PURE__ */ jsx("p", { className: "text-2xl font-bold text-white mb-1", children: card.value }),
                  /* @__PURE__ */ jsxs("p", { className: `text-sm ${getChangeColor(card.changeType)}`, children: [
                    card.change,
                    " (전월 대비)"
                  ] })
                ] }),
                /* @__PURE__ */ jsx("div", { className: "p-3 rounded-full bg-gray-700", children: /* @__PURE__ */ jsx(Icon, { className: "w-6 h-6 text-gray-300" }) })
              ] }) }, index);
            }) }),
            /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6", children: [
              /* @__PURE__ */ jsxs("div", { className: "bg-gray-800 rounded-lg p-6", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-4", children: [
                  /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold text-white", children: "전략별 수익률" }),
                  /* @__PURE__ */ jsx("div", { className: "text-sm text-gray-400", children: "단위: %" })
                ] }),
                /* @__PURE__ */ jsx(ResponsiveContainer, { width: "100%", height: 300, children: /* @__PURE__ */ jsxs(BarChart, { data: profitData, children: [
                  /* @__PURE__ */ jsx(CartesianGrid, { strokeDasharray: "3 3", stroke: "#374151" }),
                  /* @__PURE__ */ jsx(XAxis, { dataKey: "name", stroke: "#9CA3AF" }),
                  /* @__PURE__ */ jsx(YAxis, { stroke: "#9CA3AF" }),
                  /* @__PURE__ */ jsx(
                    Tooltip,
                    {
                      contentStyle: {
                        backgroundColor: "#1F2937",
                        border: "1px solid #374151",
                        borderRadius: "8px",
                        color: "#fff"
                      }
                    }
                  ),
                  /* @__PURE__ */ jsx(Bar, { dataKey: "profit", fill: "#3B82F6", radius: [4, 4, 0, 0] })
                ] }) })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "bg-gray-800 rounded-lg p-6", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-4", children: [
                  /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold text-white", children: "사용자 수" }),
                  /* @__PURE__ */ jsx("div", { className: "text-sm text-gray-400", children: "전략별 사용자 분포" })
                ] }),
                /* @__PURE__ */ jsx(ResponsiveContainer, { width: "100%", height: 300, children: /* @__PURE__ */ jsxs(BarChart, { data: userCountData, children: [
                  /* @__PURE__ */ jsx(CartesianGrid, { strokeDasharray: "3 3", stroke: "#374151" }),
                  /* @__PURE__ */ jsx(XAxis, { dataKey: "name", stroke: "#9CA3AF" }),
                  /* @__PURE__ */ jsx(YAxis, { stroke: "#9CA3AF" }),
                  /* @__PURE__ */ jsx(
                    Tooltip,
                    {
                      contentStyle: {
                        backgroundColor: "#1F2937",
                        border: "1px solid #374151",
                        borderRadius: "8px",
                        color: "#fff"
                      }
                    }
                  ),
                  /* @__PURE__ */ jsx(Bar, { dataKey: "count", fill: "#06B6D4", radius: [4, 4, 0, 0] })
                ] }) })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "bg-gray-800 rounded-lg p-6", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-4", children: [
                  /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold text-white", children: "진입 횟수" }),
                  /* @__PURE__ */ jsx("div", { className: "text-sm text-gray-400", children: "주간별 진입 통계" })
                ] }),
                /* @__PURE__ */ jsx(ResponsiveContainer, { width: "100%", height: 300, children: /* @__PURE__ */ jsxs(LineChart, { data: entryData, children: [
                  /* @__PURE__ */ jsx(CartesianGrid, { strokeDasharray: "3 3", stroke: "#374151" }),
                  /* @__PURE__ */ jsx(XAxis, { dataKey: "name", stroke: "#9CA3AF" }),
                  /* @__PURE__ */ jsx(YAxis, { stroke: "#9CA3AF" }),
                  /* @__PURE__ */ jsx(
                    Tooltip,
                    {
                      contentStyle: {
                        backgroundColor: "#1F2937",
                        border: "1px solid #374151",
                        borderRadius: "8px",
                        color: "#fff"
                      }
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    Line,
                    {
                      type: "monotone",
                      dataKey: "value",
                      stroke: "#10B981",
                      strokeWidth: 3,
                      dot: { fill: "#10B981", strokeWidth: 2, r: 4 }
                    }
                  )
                ] }) })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "bg-gray-800 rounded-lg p-6", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-4", children: [
                  /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold text-white", children: "실패율" }),
                  /* @__PURE__ */ jsx("div", { className: "text-sm text-gray-400", children: "실패 원인별 분석" })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center", children: [
                  /* @__PURE__ */ jsxs("div", { className: "relative w-64 h-64", children: [
                    /* @__PURE__ */ jsx(ResponsiveContainer, { width: "100%", height: "100%", children: /* @__PURE__ */ jsxs(PieChart, { children: [
                      /* @__PURE__ */ jsx(
                        Pie,
                        {
                          dataKey: "value",
                          data: failureData,
                          cx: "50%",
                          cy: "50%",
                          innerRadius: 60,
                          outerRadius: 100,
                          paddingAngle: 2,
                          children: failureData.map((entry2, index) => /* @__PURE__ */ jsx(Cell, { fill: entry2.color }, `cell-${index}`))
                        }
                      ),
                      /* @__PURE__ */ jsx(
                        Tooltip,
                        {
                          contentStyle: {
                            backgroundColor: "#1F2937",
                            border: "1px solid #374151",
                            borderRadius: "8px",
                            color: "#fff"
                          }
                        }
                      )
                    ] }) }),
                    /* @__PURE__ */ jsx("div", { className: "absolute inset-0 flex items-center justify-center", children: /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
                      /* @__PURE__ */ jsxs("p", { className: "text-2xl font-bold text-white", children: [
                        failureData[0].value,
                        "%"
                      ] }),
                      /* @__PURE__ */ jsx("p", { className: "text-gray-400 text-sm", children: "전체" })
                    ] }) })
                  ] }),
                  /* @__PURE__ */ jsx("div", { className: "ml-8", children: failureData.map((item, index) => /* @__PURE__ */ jsxs("div", { className: "flex items-center mb-3", children: [
                    /* @__PURE__ */ jsx(
                      "div",
                      {
                        className: "w-3 h-3 rounded-full mr-3",
                        style: { backgroundColor: item.color }
                      }
                    ),
                    /* @__PURE__ */ jsx("span", { className: "text-gray-300 text-sm mr-2", children: item.name }),
                    /* @__PURE__ */ jsxs("span", { className: "text-white font-medium", children: [
                      item.value,
                      "%"
                    ] })
                  ] }, index)) })
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6", children: [
              /* @__PURE__ */ jsxs("div", { className: "bg-gray-800 rounded-lg p-6", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-4", children: [
                  /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold text-white", children: "전략별 슬리피지" }),
                  /* @__PURE__ */ jsx("div", { className: "text-sm text-gray-400", children: "체결가 기준" })
                ] }),
                /* @__PURE__ */ jsx(ResponsiveContainer, { width: "100%", height: 300, children: /* @__PURE__ */ jsxs(LineChart, { data: slippageData, children: [
                  /* @__PURE__ */ jsx(CartesianGrid, { strokeDasharray: "3 3", stroke: "#374151" }),
                  /* @__PURE__ */ jsx(XAxis, { dataKey: "name", stroke: "#9CA3AF" }),
                  /* @__PURE__ */ jsx(YAxis, { stroke: "#9CA3AF" }),
                  /* @__PURE__ */ jsx(
                    Tooltip,
                    {
                      contentStyle: {
                        backgroundColor: "#1F2937",
                        border: "1px solid #374151",
                        borderRadius: "8px",
                        color: "#fff"
                      }
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    Line,
                    {
                      type: "monotone",
                      dataKey: "value",
                      stroke: "#F59E0B",
                      strokeWidth: 3,
                      dot: { fill: "#F59E0B", strokeWidth: 2, r: 4 }
                    }
                  )
                ] }) })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "bg-gray-800 rounded-lg p-6", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-4", children: [
                  /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold text-white", children: "전략별 슬리피지" }),
                  /* @__PURE__ */ jsx("div", { className: "text-sm text-gray-400", children: "시그널가 기준" })
                ] }),
                /* @__PURE__ */ jsx(ResponsiveContainer, { width: "100%", height: 300, children: /* @__PURE__ */ jsxs(LineChart, { data: signalSlippageData, children: [
                  /* @__PURE__ */ jsx(CartesianGrid, { strokeDasharray: "3 3", stroke: "#374151" }),
                  /* @__PURE__ */ jsx(XAxis, { dataKey: "name", stroke: "#9CA3AF" }),
                  /* @__PURE__ */ jsx(YAxis, { stroke: "#9CA3AF" }),
                  /* @__PURE__ */ jsx(
                    Tooltip,
                    {
                      contentStyle: {
                        backgroundColor: "#1F2937",
                        border: "1px solid #374151",
                        borderRadius: "8px",
                        color: "#fff"
                      }
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    Line,
                    {
                      type: "monotone",
                      dataKey: "value",
                      stroke: "#EF4444",
                      strokeWidth: 3,
                      dot: { fill: "#EF4444", strokeWidth: 2, r: 4 }
                    }
                  )
                ] }) })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "mt-8 bg-gray-800 rounded-lg p-6", children: [
              /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold text-white mb-4", children: "통계 요약 정보" }),
              /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-8", children: [
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("h4", { className: "text-md font-medium text-gray-300 mb-3", children: "주요 지표" }),
                  /* @__PURE__ */ jsxs("ul", { className: "space-y-2 text-sm text-gray-400", children: [
                    /* @__PURE__ */ jsx("li", { children: "• 전략별 수익률/전략 평균/최대/최소 수익률" }),
                    /* @__PURE__ */ jsx("li", { children: "• 사용자 수와 전략 연결 개수" }),
                    /* @__PURE__ */ jsx("li", { children: "• 진입 횟수하루/주간/월간 진입 통계" }),
                    /* @__PURE__ */ jsx("li", { children: "• 실패율 실패 이유별 분류 (시세반등, 벽 걸치, API 오류 등)" })
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("h4", { className: "text-md font-medium text-gray-300 mb-3", children: "슬리피지 분석" }),
                  /* @__PURE__ */ jsxs("ul", { className: "space-y-2 text-sm text-gray-400", children: [
                    /* @__PURE__ */ jsx("li", { children: "• 전략별 슬리피지 평균 체결가 - 시그널가 오차율 분석" }),
                    /* @__PURE__ */ jsx("li", { children: "• 시장 상황별 슬리피지 변동 추이 모니터링" }),
                    /* @__PURE__ */ jsx("li", { children: "• 거래량과 슬리피지 상관관계 분석" }),
                    /* @__PURE__ */ jsx("li", { children: "• 실시간 슬리피지 모니터링 및 알림 시스템" })
                  ] })
                ] })
              ] })
            ] })
          ] })
        ]
      }
    )
  ] });
};
const route44 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: StrategyStatistics
}, Symbol.toStringTag, { value: "Module" }));
const getFcmToken = void 0;
const listenForMessages = void 0;
function Index$2() {
  useEffect(() => {
    getFcmToken().then(async (token) => {
      if (token) {
        await fetch("/api/register-token", {
          method: "POST",
          body: JSON.stringify({ token }),
          headers: { "Content-Type": "application/json" }
        });
      }
    });
    listenForMessages();
  }, []);
  return /* @__PURE__ */ jsx("h1", { children: "📡 Firebase Push 활성화됨" });
}
const route45 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Index$2
}, Symbol.toStringTag, { value: "Module" }));
function CVDChart() {
  const [data, setData] = useState([]);
  useEffect(() => {
    const fetchCVD = async () => {
      try {
        const url = "https://api.binance.com/api/v3/trades?symbol=SOLUSDT&limit=1000";
        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const trades = await res.json();
        let cvd = 0;
        trades.forEach((trade) => {
          const qty = parseFloat(trade.qty);
          cvd += trade.isBuyerMaker ? qty : -qty;
        });
        const now = /* @__PURE__ */ new Date();
        const timeLabel = now.toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" });
        setData((prev) => [
          ...prev.slice(-59),
          // 최근 60개만 유지
          { time: timeLabel, cvd: parseFloat(cvd.toFixed(4)) }
        ]);
      } catch (err) {
        console.error("CVD fetch 실패:", err);
      }
    };
    fetchCVD();
    const interval = setInterval(fetchCVD, 6e4);
    return () => clearInterval(interval);
  }, []);
  return /* @__PURE__ */ jsxs("div", { style: { width: "100%", height: 300 }, children: [
    /* @__PURE__ */ jsx("h2", { children: "1분 단위 CVD (SOLUSDT)" }),
    /* @__PURE__ */ jsx(ResponsiveContainer, { children: /* @__PURE__ */ jsxs(LineChart, { data, children: [
      /* @__PURE__ */ jsx(CartesianGrid, { strokeDasharray: "3 3" }),
      /* @__PURE__ */ jsx(XAxis, { dataKey: "time" }),
      /* @__PURE__ */ jsx(YAxis, {}),
      /* @__PURE__ */ jsx(Tooltip, {}),
      /* @__PURE__ */ jsx(Line, { type: "monotone", dataKey: "cvd", stroke: "#8884d8", dot: false })
    ] }) })
  ] });
}
const route46 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: CVDChart
}, Symbol.toStringTag, { value: "Module" }));
const MyStrategyManagement = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useThemeStore();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("전체");
  const strategyData = [
    {
      id: 1,
      name: "전략A",
      asset: "BTCUSDT",
      type: "스윙",
      time: "1시간",
      status: "active",
      lastModified: "2024-07-24 19:00"
    },
    {
      id: 2,
      name: "전략B",
      asset: "BTCUSDT",
      type: "단타",
      time: "30분",
      status: "active",
      lastModified: "2024-07-27 18:00"
    },
    {
      id: 3,
      name: "전략C",
      asset: "BTCUSDT",
      type: "스윙",
      time: "일봉",
      status: "paused",
      lastModified: "2024-07-22 10:00"
    },
    {
      id: 4,
      name: "전략D",
      asset: "TIGER 배당",
      type: "중장기",
      time: "주봉",
      status: "active",
      lastModified: "2024-07-21 09:00"
    }
  ];
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
  const getStatusBadge = (status) => {
    switch (status) {
      case "active":
        return /* @__PURE__ */ jsx("span", { className: "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300", children: "실행 중" });
      case "paused":
        return /* @__PURE__ */ jsx("span", { className: "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300", children: "중지" });
      case "inactive":
        return /* @__PURE__ */ jsx("span", { className: "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300", children: "비활성" });
      default:
        return /* @__PURE__ */ jsx("span", { className: "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300", children: "알 수 없음" });
    }
  };
  const strategyTypes = [
    { id: "전체", label: "전체", icon: Target },
    { id: "전략A", label: "전략A", icon: Settings },
    { id: "전략B", label: "전략B", icon: Brain },
    { id: "전략C", label: "전략C", icon: Grid3X3 },
    { id: "전략D", label: "전략D", icon: Repeat }
  ];
  const filteredStrategies = activeTab === "전체" ? strategyData : strategyData.filter((strategy) => strategy.type === activeTab);
  const strategyStats = {
    total: strategyData.length,
    active: strategyData.filter((s) => s.status === "active").length,
    paused: strategyData.filter((s) => s.status === "paused").length,
    inactive: strategyData.filter((s) => s.status === "inactive").length,
    avgProfit: "8.7"
  };
  const getTypeIcon = (name) => {
    const typeConfig = strategyTypes.find((t) => t.id === name);
    if (typeConfig) {
      const IconComponent = typeConfig.icon;
      return /* @__PURE__ */ jsx(IconComponent, { className: "w-4 h-4" });
    }
    return /* @__PURE__ */ jsx(Settings, { className: "w-4 h-4" });
  };
  return /* @__PURE__ */ jsxs("div", { className: `min-h-screen ${theme === "dark" ? "bg-gray-900" : "bg-gray-50"}`, children: [
    /* @__PURE__ */ jsx(
      DashSidebar,
      {
        theme,
        sidebarOpen,
        setSidebarOpen,
        activeMenu: "내 전략 관리"
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: `transition-all duration-300 ${sidebarOpen ? "lg:ml-64" : "lg:ml-0"}`, children: [
      /* @__PURE__ */ jsx(
        DashHeader,
        {
          theme,
          toggleTheme,
          sidebarOpen,
          setSidebarOpen,
          title: "내 전략 관리"
        }
      ),
      /* @__PURE__ */ jsxs("main", { className: "p-6", children: [
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-4 mb-8", children: [
          /* @__PURE__ */ jsxs(Card, { className: theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200", children: [
            /* @__PURE__ */ jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [
              /* @__PURE__ */ jsx(CardTitle, { className: `text-sm font-medium ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`, children: "전체 전략" }),
              /* @__PURE__ */ jsx(Target, { className: "h-4 w-4 text-blue-500" })
            ] }),
            /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsxs("div", { className: `text-2xl font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`, children: [
              strategyStats.total,
              "개"
            ] }) })
          ] }),
          /* @__PURE__ */ jsxs(Card, { className: theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200", children: [
            /* @__PURE__ */ jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [
              /* @__PURE__ */ jsx(CardTitle, { className: `text-sm font-medium ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`, children: "활성 전략" }),
              /* @__PURE__ */ jsx(Play, { className: "h-4 w-4 text-green-500" })
            ] }),
            /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsxs("div", { className: "text-2xl font-bold text-green-500", children: [
              strategyStats.active,
              "개"
            ] }) })
          ] }),
          /* @__PURE__ */ jsxs(Card, { className: theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200", children: [
            /* @__PURE__ */ jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [
              /* @__PURE__ */ jsx(CardTitle, { className: `text-sm font-medium ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`, children: "비활성" }),
              /* @__PURE__ */ jsx(Pause, { className: "h-4 w-4 text-yellow-500" })
            ] }),
            /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsxs("div", { className: "text-2xl font-bold text-yellow-500", children: [
              strategyStats.paused,
              "개"
            ] }) })
          ] }),
          /* @__PURE__ */ jsxs(Card, { className: theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200", children: [
            /* @__PURE__ */ jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [
              /* @__PURE__ */ jsx(CardTitle, { className: `text-sm font-medium ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`, children: "평균 수익률" }),
              /* @__PURE__ */ jsx(Activity, { className: "h-4 w-4 text-purple-500" })
            ] }),
            /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsxs("div", { className: "text-2xl font-bold text-purple-500", children: [
              "+",
              strategyStats.avgProfit,
              "%"
            ] }) })
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { className: `border-b mb-6 ${theme === "dark" ? "border-gray-700" : "border-gray-200"}`, children: /* @__PURE__ */ jsx("div", { className: "flex space-x-8 overflow-x-auto", children: strategyTypes.map((type) => {
          const IconComponent = type.icon;
          return /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: () => setActiveTab(type.id),
              className: `py-3 px-1 text-sm font-medium border-b-2 whitespace-nowrap transition-colors flex items-center gap-2 ${activeTab === type.id ? theme === "dark" ? "border-cyan-400 text-cyan-400" : "border-blue-600 text-blue-600" : theme === "dark" ? "border-transparent text-gray-400 hover:text-gray-300" : "border-transparent text-gray-600 hover:text-gray-900"}`,
              children: [
                /* @__PURE__ */ jsx(IconComponent, { className: "w-4 h-4" }),
                type.label
              ]
            },
            type.id
          );
        }) }) }),
        /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center mb-6", children: [
          /* @__PURE__ */ jsxs("h2", { className: `text-xl font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`, children: [
            "전략 목록 (",
            filteredStrategies.length,
            "개)"
          ] }),
          /* @__PURE__ */ jsxs(Button, { onClick: () => navigate("/mystrategyAdd"), className: "bg-blue-600 hover:bg-blue-700 text-white", children: [
            /* @__PURE__ */ jsx(Plus, { className: "w-4 h-4 mr-2" }),
            "새 전략 등록"
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { className: `rounded-xl border ${theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"} mb-8`, children: /* @__PURE__ */ jsx("div", { className: `relative overflow-hidden border-t ${theme === "dark" ? "border-gray-700" : "border-gray-200"}`, children: /* @__PURE__ */ jsxs(Table, { children: [
          /* @__PURE__ */ jsxs("colgroup", { children: [
            /* @__PURE__ */ jsx("col", { className: "w-4/12" }),
            /* @__PURE__ */ jsx("col", { className: "w-2/12" }),
            /* @__PURE__ */ jsx("col", { className: "w-1/12" }),
            /* @__PURE__ */ jsx("col", { className: "w-1/12" }),
            /* @__PURE__ */ jsx("col", { className: "w-1/12" }),
            /* @__PURE__ */ jsx("col", { className: "w-2/12" }),
            /* @__PURE__ */ jsx("col", { className: "w-1/12" })
          ] }),
          /* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { className: theme === "dark" ? "border-gray-700" : "border-gray-200", children: [
            /* @__PURE__ */ jsx(TableHead, { className: `text-center ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`, children: "전략명" }),
            /* @__PURE__ */ jsx(TableHead, { className: `text-center ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`, children: "자산" }),
            /* @__PURE__ */ jsx(TableHead, { className: `text-center ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`, children: "유형" }),
            /* @__PURE__ */ jsx(TableHead, { className: `text-center ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`, children: "시간봉" }),
            /* @__PURE__ */ jsx(TableHead, { className: `text-center ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`, children: "상태" }),
            /* @__PURE__ */ jsx(TableHead, { className: `text-center ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`, children: "최근진입" }),
            /* @__PURE__ */ jsx(TableHead, { className: "w-12" })
          ] }) }),
          /* @__PURE__ */ jsx(TableBody, { children: filteredStrategies.map((strategy) => /* @__PURE__ */ jsxs(
            TableRow,
            {
              className: `${theme === "dark" ? "border-gray-700 " : "border-gray-200 "}`,
              children: [
                /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-3 text-left", children: [
                  /* @__PURE__ */ jsx("div", { className: `w-8 h-8 rounded-full flex items-center justify-center ${strategy.name === "전략A" ? "bg-blue-100 text-blue-600 " : strategy.name === "전략B" ? "bg-purple-100 text-purple-600 " : strategy.name === "전략C" ? "bg-green-100 text-green-600 " : strategy.name === "전략D" ? "bg-orange-100 text-orange-600 " : "bg-red-100 text-red-600 "}`, children: getTypeIcon(strategy.name) }),
                  /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx("div", { className: `font-medium ${theme === "dark" ? "text-white" : "text-gray-900"}`, children: strategy.name }) })
                ] }) }),
                /* @__PURE__ */ jsx(TableCell, { className: `text-center ${theme === "dark" ? "text-white" : "text-gray-900"}`, children: strategy.asset }),
                /* @__PURE__ */ jsx(TableCell, { className: "text-center", children: /* @__PURE__ */ jsx(Badge, { variant: "outline", className: theme === "dark" ? "border-gray-600 text-gray-300" : "border-gray-300 text-gray-700", children: strategy.type }) }),
                /* @__PURE__ */ jsx(TableCell, { className: `text-center ${theme === "dark" ? "text-white" : "text-gray-900"}`, children: strategy.time }),
                /* @__PURE__ */ jsx(TableCell, { className: "text-center", children: getStatusBadge(strategy.status) }),
                /* @__PURE__ */ jsx(TableCell, { className: `text-center text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`, children: strategy.lastModified }),
                /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsxs(DropdownMenu, { children: [
                  /* @__PURE__ */ jsx(DropdownMenuTrigger, { asChild: true, children: /* @__PURE__ */ jsxs(Button, { variant: "ghost", className: "h-8 w-8 p-0", children: [
                    /* @__PURE__ */ jsx("span", { className: "sr-only", children: "Open menu" }),
                    /* @__PURE__ */ jsx(MoreHorizontal, { className: `h-4 w-4 text-center  ${theme === "dark" ? "text-gray-400" : "text-gray-600"}` })
                  ] }) }),
                  /* @__PURE__ */ jsxs(DropdownMenuContent, { align: "end", className: theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200", children: [
                    /* @__PURE__ */ jsxs(
                      DropdownMenuItem,
                      {
                        onClick: () => console.log("전략 수정", strategy.id),
                        className: theme === "dark" ? "text-gray-300 hover:bg-gray-700" : "text-gray-700 hover:bg-gray-100",
                        children: [
                          /* @__PURE__ */ jsx(Edit, { className: "w-4 h-4 mr-2" }),
                          "전략 수정"
                        ]
                      }
                    ),
                    strategy.status === "active" ? /* @__PURE__ */ jsxs(
                      DropdownMenuItem,
                      {
                        onClick: () => console.log("전략 일시정지", strategy.id),
                        className: theme === "dark" ? "text-gray-300 hover:bg-gray-700" : "text-gray-700 hover:bg-gray-100",
                        children: [
                          /* @__PURE__ */ jsx(Pause, { className: "w-4 h-4 mr-2" }),
                          "일시정지"
                        ]
                      }
                    ) : /* @__PURE__ */ jsxs(
                      DropdownMenuItem,
                      {
                        onClick: () => console.log("전략 시작", strategy.id),
                        className: theme === "dark" ? "text-gray-300 hover:bg-gray-700" : "text-gray-700 hover:bg-gray-100",
                        children: [
                          /* @__PURE__ */ jsx(Play, { className: "w-4 h-4 mr-2" }),
                          "전략 시작"
                        ]
                      }
                    ),
                    /* @__PURE__ */ jsxs(
                      DropdownMenuItem,
                      {
                        onClick: () => console.log("전략 삭제", strategy.id),
                        className: "text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20",
                        children: [
                          /* @__PURE__ */ jsx(Trash2, { className: "w-4 h-4 mr-2" }),
                          "전략 삭제"
                        ]
                      }
                    )
                  ] })
                ] }) })
              ]
            },
            strategy.id
          )) })
        ] }) }) })
      ] }),
      /* @__PURE__ */ jsx(DashFooter, { theme })
    ] })
  ] });
};
const route47 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: MyStrategyManagement
}, Symbol.toStringTag, { value: "Module" }));
const serviceAccountPath$1 = path.resolve("tradinggearsub-firebase-adminsdk-fbsvc-2d84c4aee6.json");
const serviceAccount$1 = JSON.parse(fs.readFileSync(serviceAccountPath$1, "utf8"));
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount$1)
  });
}
const action$1 = async ({ request }) => {
  try {
    const { token, title, body } = await request.json();
    const message = {
      token,
      notification: {
        title,
        body
      }
    };
    const response = await admin.messaging().send(message);
    console.log("✅ FCM 전송 성공:", response);
    return json({ success: true });
  } catch (error) {
    console.error("❌ FCM 전송 실패:", error);
    return json({ success: false, error: error.message }, { status: 500 });
  }
};
const route48 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$1
}, Symbol.toStringTag, { value: "Module" }));
const loader$1 = async () => {
  const host = "https://api.kiwoom.com";
  const tokenEndpoint = "/oauth2/token";
  const tokenUrl = host + tokenEndpoint;
  const tokenHeaders = {
    "Content-Type": "application/json;charset=UTF-8"
  };
  const tokenData = {
    "grant_type": "client_credentials",
    "appkey": "89XtCDXIQLbS2wTC7S5dvsQ4WdKK6W-5O9fO0XJzS1w",
    "secretkey": "ooGf1ohzSgLaIPGY53ZrKvC54ucu_qm3GV_jL5MSrYQ"
  };
  const tokenResponse = await fetch(tokenUrl, {
    method: "POST",
    headers: tokenHeaders,
    body: JSON.stringify(tokenData)
  });
  const tokenJson = await tokenResponse.json();
  const accessToken = tokenJson.token;
  const headers2 = {
    "Content-Type": "application/json;charset=UTF-8",
    "authorization": `Bearer ${accessToken}`,
    "api-id": "kt00001"
  };
  const accountParams = {
    "dmst_stex_tp": "KRX"
  };
  const acntResponse = await fetch(`${host}/api/dostk/acnt`, {
    method: "POST",
    headers: headers2,
    body: JSON.stringify(accountParams)
  });
  const acntJson = await acntResponse.json();
  const headers3 = {
    "Content-Type": "application/json;charset=UTF-8",
    "authorization": `Bearer ${accessToken}`,
    "api-id": "kt00018"
  };
  const acnt2Params = {
    "qry_tp": "3"
  };
  const acnt2Response = await fetch(`${host}/api/dostk/acnt`, {
    method: "POST",
    headers: headers3,
    body: JSON.stringify(acnt2Params)
  });
  const acnt2Json = await acnt2Response.json();
  const result = Number(acnt2Json["total_evlu_amt"] + acntJson["entr"] - acnt2Json["loan_sum"]);
  return result;
};
const route49 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  loader: loader$1
}, Symbol.toStringTag, { value: "Module" }));
const serviceAccountPath = path.resolve("tradinggearsub-firebase-adminsdk-fbsvc-2d84c4aee6.json");
const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, "utf8"));
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}
const action = async ({ request }) => {
  const { token, title, body } = await request.json();
  try {
    const message = {
      token,
      notification: { title, body }
    };
    const response = await admin.messaging().send(message);
    console.log("✅ 메시지 전송 성공:", response);
    return json({ success: true });
  } catch (error) {
    console.error("❌ 푸시 전송 실패:", error);
    return json({ success: false, error: error.message }, { status: 500 });
  }
};
const firebaseConfig = {
  apiKey: "AIzaSyC-oRTijXPXQCCnbK4MIMCl3saCLNUtGmA",
  authDomain: "tradinggearsub.firebaseapp.com",
  projectId: "tradinggearsub",
  storageBucket: "tradinggearsub.firebasestorage.app",
  messagingSenderId: "801432625850",
  appId: "1:801432625850:web:732d870f6fb6c015c61883",
  measurementId: "G-56L7LG4HM3"
};
const vapidKey = "BCztRMfcZp5hh6qTyUIv51SJ1MvSCxJh9s8AORVdJqdWAYxjmAq-OH3uGwGMjNvDSNSnD1kxp_UnaQCgBCpmy5M";
function Index$1() {
  useEffect(() => {
    const app = initializeApp(firebaseConfig);
    const messaging = getMessaging(app);
    getToken(messaging, { vapidKey }).then(async (token) => {
      if (!token) return;
      const socket = new WebSocket("wss://stream.binance.com:9443/ws/btcusdt@trade");
      socket.onmessage = async (event) => {
        const data = JSON.parse(event.data);
        const qty = parseFloat(data.q);
        const isSell = data.m;
        const price = parseFloat(data.p);
        await fetch("/api/alert", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            token,
            title: isSell ? "📉 매도 감지" : "📈 매수 감지",
            body: `수량: ${qty}, 가격: ${price}`
          })
        });
      };
    });
    onMessage(messaging, (payload) => {
      console.log("📥 푸시 수신:", payload);
    });
  }, []);
  return /* @__PURE__ */ jsx("h1", { children: "🔔 바이낸스 감지 중..." });
}
const route50 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action,
  default: Index$1
}, Symbol.toStringTag, { value: "Module" }));
const StrategyRecommendations = () => {
  const { theme, toggleTheme } = useThemeStore();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedStrategy, setSelectedStrategy] = useState(null);
  const recommendedStrategies = [
    {
      id: 1,
      name: "전략명 자산 유형 수익률 구독 버튼",
      type: "SOL1H 추세추종",
      asset: "SOLUSDT",
      returnRate: 18.4,
      period: "구독 후 실행",
      risk: "medium",
      description: "솔라나 1시간 차트 기반 추세추종 전략",
      icon: /* @__PURE__ */ jsx(TrendingUp, { className: "w-5 h-5" }),
      color: "emerald",
      performance: [
        { time: "1월", value: 1e3 },
        { time: "2월", value: 1050 },
        { time: "3월", value: 1120 },
        { time: "4월", value: 1080 },
        { time: "5월", value: 1150 },
        { time: "6월", value: 1184 }
      ]
    },
    {
      id: 2,
      name: "코스피 매집 돌파",
      type: "단타 전략",
      asset: "005930",
      returnRate: 6.2,
      period: "전략 복사",
      risk: "low",
      description: "코스피 대형주 매집 구간 돌파 전략",
      icon: /* @__PURE__ */ jsx(BarChart3, { className: "w-5 h-5" }),
      color: "blue",
      performance: [
        { time: "1월", value: 1e3 },
        { time: "2월", value: 1015 },
        { time: "3월", value: 1025 },
        { time: "4월", value: 1040 },
        { time: "5월", value: 1055 },
        { time: "6월", value: 1062 }
      ]
    }
  ];
  const popularStrategies = [
    {
      id: 3,
      name: "RSI 역추세 전략",
      type: "스윙 트레이딩",
      asset: "Multiple",
      returnRate: 12.8,
      subscribers: 1247,
      winRate: 68.5,
      maxDrawdown: -3.2,
      risk: "medium",
      icon: /* @__PURE__ */ jsx(Activity, { className: "w-5 h-5" }),
      color: "purple"
    },
    {
      id: 4,
      name: "볼린저밴드 돌파",
      type: "데이 트레이딩",
      asset: "NASDAQ",
      returnRate: 15.3,
      subscribers: 892,
      winRate: 72.1,
      maxDrawdown: -2.8,
      risk: "high",
      icon: /* @__PURE__ */ jsx(Target, { className: "w-5 h-5" }),
      color: "orange"
    },
    {
      id: 5,
      name: "이동평균 교차",
      type: "장기 투자",
      asset: "S&P 500",
      returnRate: 9.7,
      subscribers: 2156,
      winRate: 75.4,
      maxDrawdown: -1.9,
      risk: "low",
      icon: /* @__PURE__ */ jsx(TrendingUp, { className: "w-5 h-5" }),
      color: "green"
    },
    {
      id: 6,
      name: "MACD 다이버전스",
      type: "스캘핑",
      asset: "FOREX",
      returnRate: 22.1,
      subscribers: 634,
      winRate: 64.2,
      maxDrawdown: -5.1,
      risk: "high",
      icon: /* @__PURE__ */ jsx(Zap, { className: "w-5 h-5" }),
      color: "red"
    }
  ];
  const getRiskBadge = (risk) => {
    switch (risk) {
      case "low":
        return /* @__PURE__ */ jsx(Badge, { className: "bg-green-100 text-green-800 hover:bg-green-100", children: "안전" });
      case "medium":
        return /* @__PURE__ */ jsx(Badge, { className: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100", children: "보통" });
      case "high":
        return /* @__PURE__ */ jsx(Badge, { variant: "destructive", children: "위험" });
      default:
        return /* @__PURE__ */ jsx(Badge, { variant: "secondary", children: "-" });
    }
  };
  const getColorClasses = (color) => {
    const colorMap = {
      emerald: "bg-emerald-100 text-emerald-600 dark:bg-emerald-900 dark:text-emerald-300",
      blue: "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300",
      purple: "bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-300",
      orange: "bg-orange-100 text-orange-600 dark:bg-orange-900 dark:text-orange-300",
      green: "bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300",
      red: "bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300"
    };
    return colorMap[color] || "bg-gray-100 text-gray-600 dark:bg-gray-900 dark:text-gray-300";
  };
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: `min-h-screen ${theme === "dark" ? "bg-gray-900" : "bg-gray-50"}`,
      children: [
        /* @__PURE__ */ jsx(
          DashSidebar,
          {
            theme,
            sidebarOpen,
            setSidebarOpen,
            activeMenu: "추천 전략 둘러보기"
          }
        ),
        /* @__PURE__ */ jsxs(
          "div",
          {
            className: `transition-all duration-300 ${sidebarOpen ? "lg:ml-64" : "lg:ml-0"}`,
            children: [
              /* @__PURE__ */ jsx(
                DashHeader,
                {
                  theme,
                  toggleTheme,
                  sidebarOpen,
                  setSidebarOpen,
                  title: "추천 전략 둘러보기"
                }
              ),
              /* @__PURE__ */ jsxs("main", { className: "p-6", children: [
                /* @__PURE__ */ jsxs("div", { className: `rounded-xl shadow-lg p-6 border mb-8 ${theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`, children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-4", children: [
                    /* @__PURE__ */ jsx("h2", { className: `text-lg font-bold ${theme === "dark" ? "text-white" : "text-gray-800"}`, children: "클릭 시 전략 상세 설명 및 백테스트 결과 팝업 표시" }),
                    /* @__PURE__ */ jsx(Brain, { className: "w-6 h-6 text-purple-500" })
                  ] }),
                  /* @__PURE__ */ jsx("p", { className: `text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`, children: "각 전략을 클릭하면 상세한 백테스트 결과와 성과 분석을 확인할 수 있습니다." })
                ] }),
                /* @__PURE__ */ jsx("div", { className: "mb-8", children: /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6", children: recommendedStrategies.map((strategy) => /* @__PURE__ */ jsxs(
                  "div",
                  {
                    onClick: () => setSelectedStrategy(strategy),
                    className: `rounded-xl shadow-lg p-6 border cursor-pointer transition-all hover:shadow-xl ${theme === "dark" ? "bg-gray-800 border-gray-700 hover:border-gray-600" : "bg-white border-gray-200 hover:border-gray-300"}`,
                    children: [
                      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-4", children: [
                        /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-3", children: [
                          /* @__PURE__ */ jsx("div", { className: `w-10 h-10 rounded-full flex items-center justify-center ${getColorClasses(strategy.color)}`, children: strategy.icon }),
                          /* @__PURE__ */ jsxs("div", { children: [
                            /* @__PURE__ */ jsx("h3", { className: `font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`, children: strategy.name }),
                            /* @__PURE__ */ jsxs("p", { className: `text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`, children: [
                              strategy.type,
                              " • ",
                              strategy.asset
                            ] })
                          ] })
                        ] }),
                        /* @__PURE__ */ jsxs("div", { className: "text-right", children: [
                          /* @__PURE__ */ jsxs("div", { className: `text-lg font-bold ${strategy.returnRate > 0 ? "text-emerald-500" : "text-red-500"}`, children: [
                            "+",
                            strategy.returnRate,
                            "%"
                          ] }),
                          /* @__PURE__ */ jsx("div", { className: `text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`, children: strategy.period })
                        ] })
                      ] }),
                      /* @__PURE__ */ jsx("div", { className: "mb-4", children: /* @__PURE__ */ jsx("p", { className: `text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`, children: strategy.description }) }),
                      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
                        getRiskBadge(strategy.risk),
                        /* @__PURE__ */ jsx(
                          Button,
                          {
                            size: "sm",
                            className: `${strategy.color === "emerald" ? "bg-emerald-500 hover:bg-emerald-600" : "bg-blue-500 hover:bg-blue-600"} text-white`,
                            children: strategy.period === "구독 후 실행" ? "구독하기" : "전략 복사"
                          }
                        )
                      ] }),
                      /* @__PURE__ */ jsx("div", { className: "mt-4 h-32", children: /* @__PURE__ */ jsx(ResponsiveContainer, { width: "100%", height: "100%", children: /* @__PURE__ */ jsxs(AreaChart, { data: strategy.performance, children: [
                        /* @__PURE__ */ jsx("defs", { children: /* @__PURE__ */ jsxs("linearGradient", { id: `colorValue${strategy.id}`, x1: "0", y1: "0", x2: "0", y2: "1", children: [
                          /* @__PURE__ */ jsx("stop", { offset: "5%", stopColor: strategy.color === "emerald" ? "#10b981" : "#3b82f6", stopOpacity: 0.3 }),
                          /* @__PURE__ */ jsx("stop", { offset: "95%", stopColor: strategy.color === "emerald" ? "#10b981" : "#3b82f6", stopOpacity: 0 })
                        ] }) }),
                        /* @__PURE__ */ jsx(CartesianGrid, { strokeDasharray: "3 3", stroke: theme === "dark" ? "#374151" : "#e5e7eb" }),
                        /* @__PURE__ */ jsx(XAxis, { dataKey: "time", stroke: theme === "dark" ? "#9ca3af" : "#6b7280", fontSize: 12 }),
                        /* @__PURE__ */ jsx(YAxis, { stroke: theme === "dark" ? "#9ca3af" : "#6b7280", fontSize: 12 }),
                        /* @__PURE__ */ jsx(
                          Tooltip,
                          {
                            contentStyle: {
                              backgroundColor: theme === "dark" ? "#1f2937" : "#ffffff",
                              border: `1px solid ${theme === "dark" ? "#374151" : "#e5e7eb"}`,
                              borderRadius: "8px",
                              fontSize: "12px"
                            }
                          }
                        ),
                        /* @__PURE__ */ jsx(
                          Area,
                          {
                            type: "monotone",
                            dataKey: "value",
                            stroke: strategy.color === "emerald" ? "#10b981" : "#3b82f6",
                            fillOpacity: 1,
                            fill: `url(#colorValue${strategy.id})`,
                            strokeWidth: 2
                          }
                        )
                      ] }) }) })
                    ]
                  },
                  strategy.id
                )) }) }),
                /* @__PURE__ */ jsxs("div", { className: "mb-8", children: [
                  /* @__PURE__ */ jsx("h2", { className: `text-xl font-bold mb-6 ${theme === "dark" ? "text-white" : "text-gray-800"}`, children: "🔥 인기 전략" }),
                  /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6", children: popularStrategies.map((strategy) => /* @__PURE__ */ jsxs(
                    "div",
                    {
                      onClick: () => setSelectedStrategy(strategy),
                      className: `rounded-xl shadow-lg p-6 border cursor-pointer transition-all hover:shadow-xl ${theme === "dark" ? "bg-gray-800 border-gray-700 hover:border-gray-600" : "bg-white border-gray-200 hover:border-gray-300"}`,
                      children: [
                        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-4", children: [
                          /* @__PURE__ */ jsx("div", { className: `w-10 h-10 rounded-full flex items-center justify-center ${getColorClasses(strategy.color)}`, children: strategy.icon }),
                          /* @__PURE__ */ jsx(Star, { className: "w-5 h-5 text-yellow-500" })
                        ] }),
                        /* @__PURE__ */ jsx("h3", { className: `font-bold mb-2 ${theme === "dark" ? "text-white" : "text-gray-900"}`, children: strategy.name }),
                        /* @__PURE__ */ jsxs("p", { className: `text-sm mb-3 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`, children: [
                          strategy.type,
                          " • ",
                          strategy.asset
                        ] }),
                        /* @__PURE__ */ jsxs("div", { className: "space-y-2 mb-4", children: [
                          /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center", children: [
                            /* @__PURE__ */ jsx("span", { className: `text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`, children: "수익률" }),
                            /* @__PURE__ */ jsxs("span", { className: "text-emerald-500 font-semibold", children: [
                              "+",
                              strategy.returnRate,
                              "%"
                            ] })
                          ] }),
                          /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center", children: [
                            /* @__PURE__ */ jsx("span", { className: `text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`, children: "승률" }),
                            /* @__PURE__ */ jsxs("span", { className: `font-medium ${theme === "dark" ? "text-white" : "text-gray-900"}`, children: [
                              strategy.winRate,
                              "%"
                            ] })
                          ] }),
                          /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center", children: [
                            /* @__PURE__ */ jsx("span", { className: `text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`, children: "최대낙폭" }),
                            /* @__PURE__ */ jsxs("span", { className: "text-red-500 font-medium", children: [
                              strategy.maxDrawdown,
                              "%"
                            ] })
                          ] })
                        ] }),
                        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
                          getRiskBadge(strategy.risk),
                          /* @__PURE__ */ jsxs("div", { className: `text-xs ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`, children: [
                            "구독자 ",
                            strategy.subscribers.toLocaleString(),
                            "명"
                          ] })
                        ] })
                      ]
                    },
                    strategy.id
                  )) })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: `rounded-xl shadow-lg p-6 border ${theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`, children: [
                  /* @__PURE__ */ jsx("h2", { className: `text-xl font-bold mb-6 ${theme === "dark" ? "text-white" : "text-gray-800"}`, children: "📊 전체 전략 성과 요약" }),
                  /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-6", children: [
                    /* @__PURE__ */ jsxs("div", { className: `text-center p-4 rounded-lg ${theme === "dark" ? "bg-gray-700" : "bg-gray-50"}`, children: [
                      /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center mb-2", children: /* @__PURE__ */ jsx(TrendingUp, { className: "w-8 h-8 text-emerald-500" }) }),
                      /* @__PURE__ */ jsx("div", { className: `text-2xl font-bold text-emerald-500 mb-1`, children: "14.1%" }),
                      /* @__PURE__ */ jsx("div", { className: `text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`, children: "평균 수익률" })
                    ] }),
                    /* @__PURE__ */ jsxs("div", { className: `text-center p-4 rounded-lg ${theme === "dark" ? "bg-gray-700" : "bg-gray-50"}`, children: [
                      /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center mb-2", children: /* @__PURE__ */ jsx(Target, { className: "w-8 h-8 text-blue-500" }) }),
                      /* @__PURE__ */ jsx("div", { className: `text-2xl font-bold text-blue-500 mb-1`, children: "70.2%" }),
                      /* @__PURE__ */ jsx("div", { className: `text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`, children: "평균 승률" })
                    ] }),
                    /* @__PURE__ */ jsxs("div", { className: `text-center p-4 rounded-lg ${theme === "dark" ? "bg-gray-700" : "bg-gray-50"}`, children: [
                      /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center mb-2", children: /* @__PURE__ */ jsx(Shield, { className: "w-8 h-8 text-purple-500" }) }),
                      /* @__PURE__ */ jsx("div", { className: `text-2xl font-bold text-red-500 mb-1`, children: "-3.2%" }),
                      /* @__PURE__ */ jsx("div", { className: `text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`, children: "평균 최대낙폭" })
                    ] }),
                    /* @__PURE__ */ jsxs("div", { className: `text-center p-4 rounded-lg ${theme === "dark" ? "bg-gray-700" : "bg-gray-50"}`, children: [
                      /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center mb-2", children: /* @__PURE__ */ jsx(Activity, { className: "w-8 h-8 text-orange-500" }) }),
                      /* @__PURE__ */ jsx("div", { className: `text-2xl font-bold text-orange-500 mb-1`, children: "24" }),
                      /* @__PURE__ */ jsx("div", { className: `text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`, children: "전체 전략 수" })
                    ] })
                  ] })
                ] })
              ] }),
              selectedStrategy && /* @__PURE__ */ jsx("div", { className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50", children: /* @__PURE__ */ jsxs("div", { className: `rounded-xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto ${theme === "dark" ? "bg-gray-800" : "bg-white"}`, children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-6", children: [
                  /* @__PURE__ */ jsxs("h3", { className: `text-xl font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`, children: [
                    selectedStrategy.name,
                    " - 상세 정보"
                  ] }),
                  /* @__PURE__ */ jsx(
                    Button,
                    {
                      variant: "outline",
                      size: "sm",
                      onClick: () => setSelectedStrategy(null),
                      children: "닫기"
                    }
                  )
                ] }),
                /* @__PURE__ */ jsx("div", { className: `p-4 rounded-lg mb-4 ${theme === "dark" ? "bg-gray-700" : "bg-gray-50"}`, children: /* @__PURE__ */ jsx("p", { className: `text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`, children: "상세한 백테스트 결과와 전략 분석 내용이 여기에 표시됩니다. 실제 구현에서는 차트, 통계, 위험도 분석 등의 상세 정보가 포함될 것입니다." }) }),
                /* @__PURE__ */ jsxs("div", { className: "flex space-x-4", children: [
                  /* @__PURE__ */ jsx(Button, { className: "flex-1 bg-blue-500 hover:bg-blue-600 text-white", children: "전략 구독하기" }),
                  /* @__PURE__ */ jsx(Button, { variant: "outline", className: "flex-1", children: "더 자세히 보기" })
                ] })
              ] }) }),
              /* @__PURE__ */ jsx(DashFooter, { theme })
            ]
          }
        )
      ]
    }
  );
};
const route51 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: StrategyRecommendations
}, Symbol.toStringTag, { value: "Module" }));
function AdminDashboard() {
  const [data, setData] = useState(null);
  useEffect(() => {
    axios.get("/api/admin/signals/latest").then((res) => {
      setData(res.data);
    });
  }, []);
  if (!data) return /* @__PURE__ */ jsx("div", { children: "Loading signals..." });
  const signalColor = (type) => type === "LONG" ? "text-green-600" : "text-red-600";
  return /* @__PURE__ */ jsxs("div", { className: "grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 p-4", children: [
    /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsxs(CardContent, { className: "p-4", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-lg font-semibold", children: "Current Price" }),
      /* @__PURE__ */ jsxs("p", { className: "text-2xl", children: [
        "$",
        data.current_price
      ] })
    ] }) }),
    /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsxs(CardContent, { className: "p-4", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-lg font-semibold", children: "VWAP" }),
      /* @__PURE__ */ jsx("p", { className: "text-2xl", children: data.vwap })
    ] }) }),
    /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsxs(CardContent, { className: "p-4", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-lg font-semibold", children: "CVD" }),
      /* @__PURE__ */ jsx("p", { className: "text-2xl", children: data.cvd })
    ] }) }),
    /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsxs(CardContent, { className: "p-4", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-lg font-semibold", children: "RSI" }),
      /* @__PURE__ */ jsx("p", { className: "text-2xl", children: data.rsi })
    ] }) }),
    /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsxs(CardContent, { className: "p-4", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-lg font-semibold", children: "Stochastic" }),
      /* @__PURE__ */ jsx("p", { className: "text-2xl", children: data.stochastic })
    ] }) }),
    /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsxs(CardContent, { className: "p-4", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-lg font-semibold", children: "Volume Spike" }),
      /* @__PURE__ */ jsx("p", { className: "text-2xl", children: data.volume_spike ? "Yes" : "No" })
    ] }) }),
    /* @__PURE__ */ jsx(Card, { className: "col-span-1 md:col-span-2 lg:col-span-3", children: /* @__PURE__ */ jsxs(CardContent, { className: "p-4", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-xl font-bold mb-2", children: "Signals" }),
      data.signals.length > 0 ? /* @__PURE__ */ jsx("ul", { className: "space-y-2", children: data.signals.map((sig, i) => /* @__PURE__ */ jsxs("li", { className: "flex items-center gap-3", children: [
        sig.type === "LONG" ? /* @__PURE__ */ jsx(ArrowUpRight, { className: "text-green-500" }) : /* @__PURE__ */ jsx(ArrowDownRight, { className: "text-red-500" }),
        /* @__PURE__ */ jsxs("span", { className: `font-semibold ${signalColor(sig.type)}`, children: [
          sig.type,
          " at $",
          sig.price.toFixed(2),
          " (CVD: ",
          sig.cvd,
          ")"
        ] })
      ] }, i)) }) : /* @__PURE__ */ jsx("p", { children: "No active signals." })
    ] }) })
  ] });
}
const route52 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: AdminDashboard
}, Symbol.toStringTag, { value: "Module" }));
const loader = async ({ request }) => {
  return json({ message: "This is /api_test response!" });
};
function ApiTest() {
  useEffect(() => {
    const fetchData = async () => {
      let host = "https://api.kiwoom.com";
      let endpoint = "/oauth2/token";
      let url = host + endpoint;
      let headers = {
        "Content-Type": "application/json;charset=UTF-8"
      };
      let data = {
        "grant_type": "client_credentials",
        "appkey": "89XtCDXIQLbS2wTC7S5dvsQ4WdKK6W-5O9fO0XJzS1w",
        "secretkey": "ooGf1ohzSgLaIPGY53ZrKvC54ucu_qm3GV_jL5MSrYQ"
      };
      let response = await fetch(url, {
        method: "POST",
        headers,
        body: JSON.stringify(data)
      });
      let responseHeaders = {
        "next-key": response.headers.get("next-key"),
        "cont-yn": response.headers.get("cont-yn"),
        "api-id": response.headers.get("api-id")
      };
      console.log("code :", response.status);
      console.log("header :", JSON.stringify(responseHeaders, null, 4));
      let responseBody = await response.json();
      console.log("body :", JSON.stringify(responseBody, null, 4));
      host = "https://api.kiwoom.com";
      endpoint = "/api/dostk/acnt";
      url = host + endpoint;
      let headers2 = {
        "Content-Type": "application/json;charset=UTF-8",
        // 컨텐츠 타입
        "authorization": `Bearer ` + responseBody["token"],
        // 접근 토큰
        //'cont-yn': cont_yn, // 연속 조회 여부
        //'next-key': next_key, // 연속 조회 키
        "api-id": "kt00005"
        // TR명
      };
      const params = {
        "dmst_stex_tp": "KRX"
        // 국내거래소구분 KRX:한국거래소,NXT:넥스트트레이드
      };
      response = await fetch(url, {
        method: "POST",
        headers: headers2,
        body: JSON.stringify(params)
      });
      responseHeaders = {
        "next-key": response.headers.get("next-key"),
        "cont-yn": response.headers.get("cont-yn"),
        "api-id": response.headers.get("api-id")
      };
      console.log("code :", response.status);
      console.log("header :", JSON.stringify(responseHeaders, null, 4));
      let responseBody2 = await response.json();
      console.log("body :", JSON.stringify(responseBody2, null, 4));
      console.log(responseBody2["entr"]);
      host = "https://api.kiwoom.com";
      endpoint = "/api/dostk/acnt";
      url = host + endpoint;
      const headers3 = {
        "Content-Type": "application/json;charset=UTF-8",
        // 컨텐츠 타입
        "authorization": `Bearer ` + responseBody["token"],
        // 접근 토큰
        //'cont-yn': cont_yn, // 연속 조회 여부
        //'next-key': next_key, // 연속 조회 키
        "api-id": "kt00001"
        // TR명
      };
      const params2 = {
        "qry_tp": "3"
        // 조회구분 3:추정조회, 2:일반조회
      };
      const response3 = await fetch(url, {
        method: "POST",
        headers: headers3,
        body: JSON.stringify(params2)
      });
      const responseHeaders3 = {
        "next-key": response.headers.get("next-key"),
        "cont-yn": response.headers.get("cont-yn"),
        "api-id": response.headers.get("api-id")
      };
      console.log("code :", response3.status);
      console.log("header :", JSON.stringify(responseHeaders3, null, 4));
      const responseBody3 = await response3.json();
      console.log("body :", JSON.stringify(responseBody3, null, 4));
      return Number(responseBody3["loan_remn_evlt_amt"] + responseBody2["entr"] - responseBody3["loan_sum"]);
    };
    fetchData();
  }, []);
}
const route53 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: ApiTest,
  loader
}, Symbol.toStringTag, { value: "Module" }));
function DownloadPage() {
  const navigate = useNavigate();
  const { theme } = useThemeStore();
  const themeClasses = theme === "dark" ? "bg-gradient-to-br from-slate-900 to-slate-800 text-white" : "bg-gradient-to-br from-white to-slate-50 text-slate-900";
  const textPrimary = theme === "dark" ? "text-white" : "text-slate-900";
  const textSecondary = theme === "dark" ? "text-slate-300" : "text-slate-600";
  return /* @__PURE__ */ jsxs("div", { className: `min-h-screen transition-all duration-300 ${themeClasses}`, children: [
    /* @__PURE__ */ jsx(Header, {}),
    /* @__PURE__ */ jsx(
      "div",
      {
        className: `min-h-screen transition-all duration-300 ${theme === "dark" ? "bg-gradient-to-br from-slate-900 to-slate-800" : "bg-gradient-to-br from-white to-slate-50"}`,
        children: /* @__PURE__ */ jsxs("section", { className: "max-w-6xl mx-auto px-4 lg:px-8 py-20 text-center pt-40", children: [
          /* @__PURE__ */ jsx(
            "h1",
            {
              className: `text-4xl lg:text-6xl font-bold mb-6 bg-clip-text text-transparent ${theme === "dark" ? "bg-gradient-to-r from-white to-cyan-400" : "bg-gradient-to-r from-slate-900 to-blue-600"}`,
              children: "트레이딩 차트 프로그램 다운로드"
            }
          ),
          /* @__PURE__ */ jsxs(
            "p",
            {
              className: `text-xl lg:text-2xl ${textSecondary} mb-8 leading-relaxed`,
              children: [
                "실시간 시세와 강력한 분석 기능을 갖춘 ",
                /* @__PURE__ */ jsx("br", {}),
                "올인원 트레이딩 차트 프로그램을 지금 경험해보세요."
              ]
            }
          ),
          /* @__PURE__ */ jsx("div", { className: "relative max-w-4xl mx-auto rounded-2xl overflow-hidden shadow-2xl border border-slate-200/20 mb-20", children: /* @__PURE__ */ jsx(
            "img",
            {
              src: "/chart.png",
              alt: "트레이딩 차트 미리보기",
              className: "w-full h-auto"
            }
          ) }),
          /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-8 mb-20", children: [
            {
              icon: "📊",
              title: "실시간 차트",
              desc: "거래소 API 연결로 초단위로 갱신되는 시세와 호가를 제공합니다."
            },
            {
              icon: "📈",
              title: "다양한 지표",
              desc: "이동평균선, 볼린저 밴드, RSI 등 주요 기술적 지표를 지원합니다."
            },
            {
              icon: "⚡",
              title: "빠른 실행",
              desc: "다운로드 후 즉시 실행 가능하며, 복잡한 설치 과정이 없습니다."
            }
          ].map((f, i) => /* @__PURE__ */ jsxs(
            "div",
            {
              className: `rounded-2xl p-6 backdrop-blur-lg shadow-lg border text-center transition-all duration-300 hover:-translate-y-1 ${theme === "dark" ? "bg-slate-900/70 border-slate-700/60 text-slate-100" : "bg-white/90 border-blue-200/30 text-slate-900"}`,
              children: [
                /* @__PURE__ */ jsx("div", { className: "text-4xl mb-4", children: f.icon }),
                /* @__PURE__ */ jsx("h3", { className: `font-bold text-xl mb-2 ${textPrimary}`, children: f.title }),
                /* @__PURE__ */ jsx("p", { className: textSecondary, children: f.desc })
              ]
            },
            i
          )) }),
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl mx-auto mb-20", children: [
            /* @__PURE__ */ jsx(
              "button",
              {
                className: `w-full py-6 rounded-2xl font-bold text-xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 ${theme === "dark" ? "bg-gradient-to-r from-cyan-400 to-emerald-400 text-slate-900 hover:shadow-cyan-400/30" : "bg-gradient-to-r from-blue-600 to-emerald-600 text-white hover:shadow-blue-600/30"}`,
                onClick: () => window.open("/downloads/tradinggear-win.exe", "_blank"),
                children: "🖥 Windows 다운로드"
              }
            ),
            /* @__PURE__ */ jsx(
              "button",
              {
                className: `w-full py-6 rounded-2xl font-bold text-xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 ${theme === "dark" ? "bg-gradient-to-r from-cyan-400 to-emerald-400 text-slate-900 hover:shadow-cyan-400/30" : "bg-gradient-to-r from-blue-600 to-emerald-600 text-white hover:shadow-blue-600/30"}`,
                onClick: () => window.open("/downloads/tradinggear-mac.dmg", "_blank"),
                children: "🍎 macOS 다운로드"
              }
            )
          ] }),
          /* @__PURE__ */ jsxs(
            "div",
            {
              className: `rounded-2xl p-8 backdrop-blur-lg max-w-3xl mx-auto shadow-lg border text-center ${theme === "dark" ? "bg-slate-900/80 border-slate-700/60 text-slate-100" : "bg-white/90 border-blue-200/30 text-slate-900"}`,
              children: [
                /* @__PURE__ */ jsx("h2", { className: `text-2xl font-bold mb-4 ${textPrimary}`, children: "설치 & 사용 가이드" }),
                /* @__PURE__ */ jsx("p", { className: `mb-6 ${textSecondary}`, children: "프로그램 설치부터 기본 사용법까지 단계별로 확인해보세요." }),
                /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row justify-center gap-4", children: [
                  /* @__PURE__ */ jsx(
                    "a",
                    {
                      href: "/guides/tradinggear-guide.pdf",
                      target: "_blank",
                      rel: "noopener noreferrer",
                      className: `px-6 py-3 rounded-full font-semibold border-2 transition-all duration-300 ${theme === "dark" ? "border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-slate-900" : "border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white"}`,
                      children: "📄 PDF 가이드 보기"
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "a",
                    {
                      href: "/download",
                      rel: "noopener noreferrer",
                      className: `px-6 py-3 rounded-full font-semibold border-2 transition-all duration-300 ${theme === "dark" ? "border-emerald-400 text-emerald-400 hover:bg-emerald-400 hover:text-slate-900" : "border-emerald-600 text-emerald-600 hover:bg-emerald-600 hover:text-white"}`,
                      children: "🎥 동영상 튜토리얼 보기"
                    }
                  )
                ] })
              ]
            }
          ),
          /* @__PURE__ */ jsx("div", { className: "mt-12", children: /* @__PURE__ */ jsx(
            "button",
            {
              className: `px-6 py-3 rounded-full font-semibold transition-all duration-300 ${theme === "dark" ? "text-slate-300 hover:text-white" : "text-slate-600 hover:text-slate-900"}`,
              onClick: () => navigate("/"),
              children: "← 메인 페이지로 돌아가기"
            }
          ) })
        ] })
      }
    )
  ] });
}
const route54 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: DownloadPage
}, Symbol.toStringTag, { value: "Module" }));
const ExchangeConnection = () => {
  const { theme, toggleTheme } = useThemeStore();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [sandboxMode, setSandboxMode] = useState(false);
  const [connections, setConnections] = useState([
    {
      id: 1,
      name: "Kiwoom",
      logo: "🥝",
      type: "domestic",
      status: "connected",
      latency: 31,
      lastUpdate: 31,
      isActive: true,
      apiKey: "kw_***************",
      description: "국내 주식 거래소"
    },
    {
      id: 2,
      name: "Binance Spot/Futures",
      logo: "⚡",
      type: "international",
      status: "connected",
      latency: 31,
      lastUpdate: 194,
      isActive: true,
      apiKey: "bn_***************",
      description: "글로벌 암호화폐 거래소"
    }
  ]);
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
  const getStatusBadge = (status) => {
    switch (status) {
      case "connected":
        return /* @__PURE__ */ jsx(Badge, { className: "bg-emerald-100 text-emerald-800 hover:bg-emerald-100", children: "연결됨" });
      case "disconnected":
        return /* @__PURE__ */ jsx(Badge, { variant: "destructive", children: "연결 끊김" });
      case "connecting":
        return /* @__PURE__ */ jsx(Badge, { variant: "secondary", children: "연결 중" });
      default:
        return /* @__PURE__ */ jsx(Badge, { variant: "outline", children: "알 수 없음" });
    }
  };
  const getLatencyColor = (latency) => {
    if (latency <= 50) return "text-green-500";
    if (latency <= 100) return "text-yellow-500";
    return "text-red-500";
  };
  const toggleConnection = (id) => {
    setConnections(
      (prev) => prev.map(
        (conn) => conn.id === id ? { ...conn, isActive: !conn.isActive, status: conn.isActive ? "disconnected" : "connected" } : conn
      )
    );
  };
  return /* @__PURE__ */ jsxs("div", { className: `min-h-screen ${theme === "dark" ? "bg-gray-900" : "bg-gray-50"}`, children: [
    /* @__PURE__ */ jsx(
      DashSidebar,
      {
        theme,
        sidebarOpen,
        setSidebarOpen,
        activeMenu: "거래소연동관리"
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: `transition-all duration-300 ${sidebarOpen ? "lg:ml-64" : "lg:ml-0"}`, children: [
      /* @__PURE__ */ jsx(
        DashHeader,
        {
          theme,
          toggleTheme,
          sidebarOpen,
          setSidebarOpen,
          title: "거래소연동관리"
        }
      ),
      /* @__PURE__ */ jsxs("main", { className: "p-6", children: [
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-6 mb-8", children: [
          /* @__PURE__ */ jsxs("div", { className: `rounded-xl shadow-lg p-6 border ${theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`, children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-4", children: [
              /* @__PURE__ */ jsx("div", { className: `text-sm font-medium ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`, children: "총 연결" }),
              /* @__PURE__ */ jsx(Globe, { className: "w-5 h-5 text-blue-500" })
            ] }),
            /* @__PURE__ */ jsx("div", { className: `text-2xl font-bold ${theme === "dark" ? "text-white" : "text-gray-900"} mb-2`, children: "2개" }),
            /* @__PURE__ */ jsx("div", { className: "text-green-500 text-sm", children: "모두 활성화" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: `rounded-xl shadow-lg p-6 border ${theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`, children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-4", children: [
              /* @__PURE__ */ jsx("div", { className: `text-sm font-medium ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`, children: "평균 지연시간" }),
              /* @__PURE__ */ jsx(Activity, { className: "w-5 h-5 text-green-500" })
            ] }),
            /* @__PURE__ */ jsx("div", { className: `text-2xl font-bold text-green-500 mb-2`, children: "31ms" }),
            /* @__PURE__ */ jsx("div", { className: "text-green-500 text-sm", children: "양호" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: `rounded-xl shadow-lg p-6 border ${theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`, children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-4", children: [
              /* @__PURE__ */ jsx("div", { className: `text-sm font-medium ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`, children: "최대 지연시간" }),
              /* @__PURE__ */ jsx(TrendingUp, { className: "w-5 h-5 text-yellow-500" })
            ] }),
            /* @__PURE__ */ jsx("div", { className: `text-2xl font-bold text-yellow-500 mb-2`, children: "194ms" }),
            /* @__PURE__ */ jsx("div", { className: "text-yellow-500 text-sm", children: "주의" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: `rounded-xl shadow-lg p-6 border ${theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`, children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-4", children: [
              /* @__PURE__ */ jsx("div", { className: `text-sm font-medium ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`, children: "상태" }),
              /* @__PURE__ */ jsx(CheckCircle, { className: "w-5 h-5 text-green-500" })
            ] }),
            /* @__PURE__ */ jsx("div", { className: `text-2xl font-bold text-green-500 mb-2`, children: "정상" }),
            /* @__PURE__ */ jsx("div", { className: "text-green-500 text-sm", children: "모든 연결 활성" })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: `rounded-xl shadow-lg border mb-8 ${theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`, children: [
          /* @__PURE__ */ jsxs("div", { className: `flex items-center justify-between p-6 border-b ${theme === "dark" ? "border-gray-700" : "border-gray-200 "}`, children: [
            /* @__PURE__ */ jsx("h3", { className: `text-2xl font-bold tracking-tight ${theme === "dark" ? "text-white" : "text-gray-900"}`, children: "연결" }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-4", children: [
              /* @__PURE__ */ jsxs(
                Button,
                {
                  variant: "outline",
                  size: "sm",
                  onClick: () => window.location.reload(),
                  className: ``,
                  children: [
                    /* @__PURE__ */ jsx(RefreshCw, { className: "w-4 h-4 mr-2" }),
                    "새로고침"
                  ]
                }
              ),
              /* @__PURE__ */ jsxs(
                Button,
                {
                  size: "sm",
                  className: "bg-blue-600 hover:bg-blue-700 text-white",
                  children: [
                    /* @__PURE__ */ jsx(Settings, { className: "w-4 h-4 mr-2" }),
                    "연결 추가"
                  ]
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "p-6 space-y-4", children: connections.map((connection) => /* @__PURE__ */ jsx("div", { className: `rounded-lg border p-6 ${theme === "dark" ? "border-gray-600 bg-gray-750" : "border-gray-200 bg-gray-50"}`, children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-4", children: [
              /* @__PURE__ */ jsx("div", { className: "text-3xl", children: connection.logo }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-2", children: [
                  /* @__PURE__ */ jsx("h4", { className: `text-lg font-semibold ${theme === "dark" ? "text-white" : "text-gray-900"}`, children: connection.name }),
                  getStatusBadge(connection.status)
                ] }),
                /* @__PURE__ */ jsx("p", { className: `text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`, children: connection.description }),
                /* @__PURE__ */ jsxs("p", { className: `text-xs ${theme === "dark" ? "text-gray-500" : "text-gray-500"} mt-1`, children: [
                  "API Key: ",
                  connection.apiKey
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-6", children: [
              /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
                /* @__PURE__ */ jsx("div", { className: `text-xs font-medium ${theme === "dark" ? "text-gray-400" : "text-gray-600"} mb-1`, children: "연결신호" }),
                /* @__PURE__ */ jsxs("div", { className: `text-sm font-semibold ${getLatencyColor(connection.latency)}`, children: [
                  connection.latency,
                  "ms"
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-2", children: [
                /* @__PURE__ */ jsx(
                  Switch,
                  {
                    checked: connection.isActive,
                    onCheckedChange: () => toggleConnection(connection.id),
                    className: `bg-blue-600 hover:bg-blue-700 text-white`
                  }
                ),
                /* @__PURE__ */ jsx("span", { className: `text-xs ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`, children: connection.isActive ? "활성" : "비활성" })
              ] }),
              /* @__PURE__ */ jsx(Button, { variant: "ghost", size: "sm", children: /* @__PURE__ */ jsx(Settings, { className: `w-4 h-4 ${theme === "dark" ? "text-gray-400 hover:text-gray-900" : "text-gray-600"} mb-1` }) })
            ] })
          ] }) }, connection.id)) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8", children: [
          /* @__PURE__ */ jsxs("div", { className: `rounded-xl shadow-lg p-6 border ${theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`, children: [
            /* @__PURE__ */ jsx("h3", { className: `text-lg font-bold mb-6 ${theme === "dark" ? "text-white" : "text-gray-800"}`, children: "연결 가이드" }),
            /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-3 gap-4", children: [
              /* @__PURE__ */ jsxs(
                "button",
                {
                  onClick: () => console.log("스크린샷 가이드 클릭"),
                  className: `group flex flex-col items-center p-4 rounded-lg border transition-all duration-200 hover:shadow-md ${theme === "dark" ? "bg-gray-700 border-gray-600 hover:bg-gray-650 hover:border-gray-500" : "bg-gray-50 border-gray-200 hover:bg-gray-100 hover:border-gray-300"} transform hover:scale-105 active:scale-95`,
                  children: [
                    /* @__PURE__ */ jsx("div", { className: `w-12 h-12 rounded-lg flex items-center justify-center mb-3 transition-colors ${theme === "dark" ? "bg-gray-600 group-hover:bg-blue-600" : "bg-white group-hover:bg-blue-50"}`, children: /* @__PURE__ */ jsx(Monitor, { className: `w-6 h-6 group-hover:text-blue-500 transition-colors ${theme === "dark" ? "text-gray-300" : "text-gray-600"}` }) }),
                    /* @__PURE__ */ jsx("div", { className: `text-sm font-medium text-center ${theme === "dark" ? "text-gray-200" : "text-gray-700"} group-hover:text-blue-600 transition-colors`, children: "스크린샷" })
                  ]
                }
              ),
              /* @__PURE__ */ jsxs(
                "button",
                {
                  onClick: () => console.log("영상 가이드 클릭"),
                  className: `group flex flex-col items-center p-4 rounded-lg border transition-all duration-200 hover:shadow-md ${theme === "dark" ? "bg-gray-700 border-gray-600 hover:bg-gray-650 hover:border-gray-500" : "bg-gray-50 border-gray-200 hover:bg-gray-100 hover:border-gray-300"} transform hover:scale-105 active:scale-95`,
                  children: [
                    /* @__PURE__ */ jsx("div", { className: `w-12 h-12 rounded-lg flex items-center justify-center mb-3 transition-colors ${theme === "dark" ? "bg-gray-600 group-hover:bg-green-600" : "bg-white group-hover:bg-green-50"}`, children: /* @__PURE__ */ jsx(Video, { className: `w-6 h-6 group-hover:text-green-500 transition-colors ${theme === "dark" ? "text-gray-300" : "text-gray-600"}` }) }),
                    /* @__PURE__ */ jsx("div", { className: `text-sm font-medium text-center ${theme === "dark" ? "text-gray-200" : "text-gray-700"} group-hover:text-green-600 transition-colors`, children: "영상 (30초)" })
                  ]
                }
              ),
              /* @__PURE__ */ jsxs(
                "button",
                {
                  onClick: () => console.log("체크리스트 가이드 클릭"),
                  className: `group flex flex-col items-center p-4 rounded-lg border transition-all duration-200 hover:shadow-md ${theme === "dark" ? "bg-gray-700 border-gray-600 hover:bg-gray-650 hover:border-gray-500" : "bg-gray-50 border-gray-200 hover:bg-gray-100 hover:border-gray-300"} transform hover:scale-105 active:scale-95`,
                  children: [
                    /* @__PURE__ */ jsx("div", { className: `w-12 h-12 rounded-lg flex items-center justify-center mb-3 transition-colors ${theme === "dark" ? "bg-gray-600 group-hover:bg-purple-600" : "bg-white group-hover:bg-purple-50"}`, children: /* @__PURE__ */ jsx(List, { className: `w-6 h-6 group-hover:text-purple-500 transition-colors ${theme === "dark" ? "text-gray-300" : "text-gray-600"}` }) }),
                    /* @__PURE__ */ jsx("div", { className: `text-sm font-medium text-center ${theme === "dark" ? "text-gray-200" : "text-gray-700"} group-hover:text-purple-600 transition-colors`, children: "체크리스트" })
                  ]
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: `rounded-xl shadow-lg p-6 border ${theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`, children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-4", children: [
              /* @__PURE__ */ jsx("h3", { className: `text-lg font-bold ${theme === "dark" ? "text-white" : "text-gray-800"}`, children: "샌드박스/페이퍼 모드" }),
              /* @__PURE__ */ jsx(
                Switch,
                {
                  checked: sandboxMode,
                  onCheckedChange: setSandboxMode
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { className: `p-4 rounded-lg mb-4 ${sandboxMode ? theme === "dark" ? "bg-yellow-900/20 border border-yellow-700" : "bg-yellow-50 border border-yellow-200" : theme === "dark" ? "bg-gray-700" : "bg-gray-50"}`, children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center mb-2", children: [
                sandboxMode ? /* @__PURE__ */ jsx(Play, { className: "w-4 h-4 text-yellow-500 mr-2" }) : /* @__PURE__ */ jsx(Square, { className: "w-4 h-4 text-gray-500 mr-2" }),
                /* @__PURE__ */ jsx("span", { className: `text-sm font-medium ${sandboxMode ? "text-yellow-600 dark:text-yellow-400" : theme === "dark" ? "text-gray-300" : "text-gray-700"}`, children: sandboxMode ? "테스트 모드 활성" : "실거래 모드" })
              ] }),
              /* @__PURE__ */ jsx("div", { className: `text-xs ${sandboxMode ? "text-yellow-700 dark:text-yellow-300" : theme === "dark" ? "text-gray-400" : "text-gray-600"}`, children: sandboxMode ? "실시간 전 시뮬레이션으로 동작합니다. 실제 거래는 1~2일 '그런치 싱행'" : "실제 자금으로 거래가 실행됩니다." })
            ] }),
            sandboxMode && /* @__PURE__ */ jsx("div", { className: `p-3 rounded-lg ${theme === "dark" ? "bg-blue-900/20 border border-blue-700" : "bg-blue-50 border border-blue-200"}`, children: /* @__PURE__ */ jsxs("div", { className: "flex items-center", children: [
              /* @__PURE__ */ jsx(AlertCircle, { className: "w-4 h-4 text-blue-500 mr-2" }),
              /* @__PURE__ */ jsx("span", { className: `text-xs ${theme === "dark" ? "text-blue-300" : "text-blue-700"}`, children: "테스트 모드에서는 실제 자금이 사용되지 않습니다." })
            ] }) })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: `rounded-xl shadow-lg p-6 border ${theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`, children: [
          /* @__PURE__ */ jsx("h3", { className: `text-lg font-bold mb-4 ${theme === "dark" ? "text-white" : "text-gray-800"}`, children: "연결 통계" }),
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: [
            /* @__PURE__ */ jsxs("div", { className: `p-4 rounded-lg border ${theme === "dark" ? "border-gray-600 bg-gray-700" : "border-gray-200 bg-gray-50"}`, children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-2", children: [
                /* @__PURE__ */ jsx("span", { className: `text-sm font-medium ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`, children: "오늘 총 거래량" }),
                /* @__PURE__ */ jsx(BarChart3, { className: "w-4 h-4 text-blue-500" })
              ] }),
              /* @__PURE__ */ jsx("div", { className: `text-xl font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`, children: "247건" }),
              /* @__PURE__ */ jsx("div", { className: "text-green-500 text-xs", children: "전일 대비 +12%" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: `p-4 rounded-lg border ${theme === "dark" ? "border-gray-600 bg-gray-700" : "border-gray-200 bg-gray-50"}`, children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-2", children: [
                /* @__PURE__ */ jsx("span", { className: `text-sm font-medium ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`, children: "평균 응답시간" }),
                /* @__PURE__ */ jsx(Activity, { className: "w-4 h-4 text-green-500" })
              ] }),
              /* @__PURE__ */ jsx("div", { className: `text-xl font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`, children: "112ms" }),
              /* @__PURE__ */ jsx("div", { className: "text-green-500 text-xs", children: "목표치 내" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: `p-4 rounded-lg border ${theme === "dark" ? "border-gray-600 bg-gray-700" : "border-gray-200 bg-gray-50"}`, children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-2", children: [
                /* @__PURE__ */ jsx("span", { className: `text-sm font-medium ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`, children: "연결 안정성" }),
                /* @__PURE__ */ jsx(CheckCircle, { className: "w-4 h-4 text-green-500" })
              ] }),
              /* @__PURE__ */ jsx("div", { className: `text-xl font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`, children: "99.8%" }),
              /* @__PURE__ */ jsx("div", { className: "text-green-500 text-xs", children: "매우 안정적" })
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsx(DashFooter, { theme })
    ] })
  ] });
};
const route55 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: ExchangeConnection
}, Symbol.toStringTag, { value: "Module" }));
const AccountSettings = () => {
  var _a;
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("account");
  const [showPassword, setShowPassword] = useState(false);
  const [editingPassword, setEditingPassword] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);
  const [editingApiKey, setEditingApiKey] = useState(false);
  const [showApiSecret, setShowApiSecret] = useState(false);
  const [editingApiSecret, setEditingApiSecret] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const { theme, toggleTheme } = useThemeStore();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [newApiKey, setNewApiKey] = useState("");
  const [apiSecret, setApiSecret] = useState("");
  const [newApiSecret, setNewApiSecret] = useState("");
  const [idEmail, setIdEmail] = useState("");
  const [nickName, setNickName] = useState("");
  const [userName, setUserName] = useState("");
  const [tradingCenter, setTradingCenter] = useState("");
  const [selected, setSelected] = useState("");
  useEffect(() => {
    const initSetting = async () => {
      const value = String(sessionStorage.getItem("email"));
      const form = new URLSearchParams();
      form.append("email", value ?? "");
      const res = await fetch("https://tradinggear.co.kr:8081/tradinggear/member_inform_get.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
          // ✅ JSON 형식 명시
        },
        body: form.toString()
      });
      const data1 = await res.json();
      setIdEmail(data1[0]["id_email"]);
      setNickName(data1[0]["nick_name"]);
      setUserName(data1[0]["full_name"]);
      setApiKey(data1[0]["decrypted_api_key"]);
      setApiSecret(data1[0]["decrypted_api_secret"]);
      setTradingCenter(data1[0]["trading_center"]);
      setSelected(data1[0]["trading_center"]);
    };
    initSetting();
  }, []);
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
  const topTabs = [
    { id: "account", label: "계정 정보" },
    { id: "plan", label: "요금제" },
    { id: "security", label: "보안" }
  ];
  const handleApiChangeAccount = async () => {
    var _a2, _b, _c;
    console.log("Account deleted");
    setShowDeleteModal(false);
    const email_set = String(sessionStorage.getItem("email"));
    const email_value = String(email_set);
    const api_key_value = String((_a2 = document.getElementById("apiKey")) == null ? void 0 : _a2.value);
    const api_secret_value = String((_b = document.getElementById("apiSecret")) == null ? void 0 : _b.value);
    const trading_center_value = String((_c = document.getElementById("tradingCenter")) == null ? void 0 : _c.value);
    const form2 = new URLSearchParams();
    form2.append("email", email_value ?? "");
    form2.append("apiKey", api_key_value ?? "");
    form2.append("apiSecret", api_secret_value ?? "");
    form2.append("tradingCenter", trading_center_value ?? "");
    await fetch("https://tradinggear.co.kr:8081/tradinggear/api_change.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: form2.toString()
    });
    alert("API KEY / API SECRET / Trading Center가 수정되었습니다.");
  };
  return /* @__PURE__ */ jsxs("div", { className: `min-h-screen ${theme === "dark" ? "bg-gray-900" : "bg-gray-50"}`, children: [
    /* @__PURE__ */ jsx(
      DashSidebar,
      {
        theme,
        sidebarOpen,
        setSidebarOpen,
        activeMenu: "계정관리"
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: `transition-all duration-300 ${sidebarOpen ? "lg:ml-64" : "lg:ml-0"}`, children: [
      /* @__PURE__ */ jsx(
        DashHeader,
        {
          theme,
          toggleTheme,
          sidebarOpen,
          setSidebarOpen,
          title: "계정관리"
        }
      ),
      /* @__PURE__ */ jsx("div", { className: `border-t ${theme === "dark" ? "border-gray-700" : "border-gray-200"}`, children: /* @__PURE__ */ jsx("div", { className: "px-4 lg:px-6", children: /* @__PURE__ */ jsx("div", { className: "flex space-x-8 overflow-x-auto", children: topTabs.map((tab) => /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => setActiveTab && setActiveTab(tab.id),
          className: `py-3 px-1 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${activeTab === tab.id ? theme === "dark" ? "border-cyan-400 text-cyan-400" : "border-blue-600 text-blue-600" : theme === "dark" ? "border-transparent text-gray-400 hover:text-gray-300" : "border-transparent text-gray-600 hover:text-gray-900"}`,
          children: tab.label
        },
        tab.id
      )) }) }) }),
      /* @__PURE__ */ jsxs("div", { className: "p-6", children: [
        activeTab === "account" && /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6", children: [
            /* @__PURE__ */ jsxs("div", { className: `rounded-lg p-6 border ${theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`, children: [
              /* @__PURE__ */ jsx("label", { className: `block text-sm font-medium mb-2 ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`, children: "Username" }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center", children: [
                /* @__PURE__ */ jsx(User, { className: `w-4 h-4 mr-3 ${theme === "dark" ? "text-gray-400" : "text-gray-400"}` }),
                /* @__PURE__ */ jsx("span", { className: `${theme === "dark" ? "text-gray-300" : "text-gray-700"}`, children: userName })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: `rounded-lg p-6 border ${theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`, children: [
              /* @__PURE__ */ jsx("label", { className: `block text-sm font-medium mb-2 ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`, children: "Nickname" }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center", children: [
                /* @__PURE__ */ jsx(User, { className: `w-4 h-4 mr-3 ${theme === "dark" ? "text-gray-400" : "text-gray-400"}` }),
                /* @__PURE__ */ jsx("span", { className: `${theme === "dark" ? "text-gray-300" : "text-gray-700"}`, children: nickName })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: `rounded-lg p-6 border ${theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`, children: [
              /* @__PURE__ */ jsx("label", { className: `block text-sm font-medium mb-2 ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`, children: "User ID" }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center", children: [
                /* @__PURE__ */ jsx(User, { className: `w-4 h-4 mr-3 ${theme === "dark" ? "text-gray-400" : "text-gray-400"}` }),
                /* @__PURE__ */ jsx("span", { className: `${theme === "dark" ? "text-gray-300" : "text-gray-700"}`, children: idEmail })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: `rounded-lg p-6 border ${theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`, children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-4", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center", children: [
                /* @__PURE__ */ jsx(Lock, { className: `w-5 h-5 mr-3 ${theme === "dark" ? "text-gray-400" : "text-gray-400"}` }),
                /* @__PURE__ */ jsx("h3", { className: `text-lg font-medium ${theme === "dark" ? "text-white" : "text-gray-900"}`, children: "Password" })
              ] }),
              /* @__PURE__ */ jsx(
                "button",
                {
                  onClick: () => setEditingPassword(!editingPassword),
                  className: `px-4 py-2 text-sm font-medium transition-colors ${theme === "dark" ? "text-cyan-400 hover:text-cyan-300" : "text-blue-600 hover:text-blue-700"}`
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("label", { className: `block text-sm font-medium mb-2 ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`, children: "현재 비밀번호" }),
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "password",
                    id: "nowPassword",
                    name: "nowPassword",
                    value: currentPassword,
                    onChange: (e) => setCurrentPassword(e.target.value),
                    className: `w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${theme === "dark" ? "border-gray-600 bg-gray-700 text-gray-100" : "border-gray-300 bg-white text-gray-900"}`,
                    placeholder: "현재 비밀번호"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("label", { className: `block text-sm font-medium mb-2 ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`, children: "새 비밀번호" }),
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "password",
                    id: "newPassword",
                    name: "newPassword",
                    value: newPassword,
                    onChange: (e) => setNewPassword(e.target.value),
                    className: `w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${theme === "dark" ? "border-gray-600 bg-gray-700 text-gray-100" : "border-gray-300 bg-white text-gray-900"}`,
                    placeholder: "새 비밀번호"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("label", { className: `block text-sm font-medium mb-2 ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`, children: "새 비밀번호 확인" }),
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "password",
                    id: "newPasswordConfirm",
                    name: "newPasswordConfirm",
                    value: confirmPassword,
                    onChange: (e) => setConfirmPassword(e.target.value),
                    className: `w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${theme === "dark" ? "border-gray-600 bg-gray-700 text-gray-100" : "border-gray-300 bg-white text-gray-900"}`,
                    placeholder: "새 비밀번호 확인"
                  }
                )
              ] }),
              /* @__PURE__ */ jsx("div", { className: "flex justify-end space-x-3", children: /* @__PURE__ */ jsx(
                "button",
                {
                  className: "px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors",
                  children: "비밀번호 변경"
                }
              ) })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: `rounded-lg p-6 border ${theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`, children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-4", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center", children: [
                /* @__PURE__ */ jsx(Key, { className: `w-5 h-5 mr-3 ${theme === "dark" ? "text-gray-400" : "text-gray-400"}` }),
                /* @__PURE__ */ jsx("h3", { className: `text-lg font-medium ${theme === "dark" ? "text-white" : "text-gray-900"}`, children: "API Key" })
              ] }),
              /* @__PURE__ */ jsx("div", { className: "flex space-x-2" })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "space-y-4", children: /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { className: `block text-sm font-medium mb-2 ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`, children: "API Key" }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "text",
                  id: "apiKey",
                  name: "apiKey",
                  value: apiKey,
                  onChange: (e) => setApiKey(e.target.value),
                  className: `w-full border rounded-lg px-3 py-2 font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent ${theme === "dark" ? "border-gray-600 bg-gray-700 text-gray-100" : "border-gray-300 bg-white text-gray-900"}`,
                  placeholder: "API KEY"
                }
              )
            ] }) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: `rounded-lg p-6 border ${theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`, children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-4", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center", children: [
                /* @__PURE__ */ jsx(Key, { className: `w-5 h-5 mr-3 ${theme === "dark" ? "text-gray-400" : "text-gray-400"}` }),
                /* @__PURE__ */ jsx("h3", { className: `text-lg font-medium ${theme === "dark" ? "text-white" : "text-gray-900"}`, children: "API Secret" })
              ] }),
              /* @__PURE__ */ jsx("div", { className: "flex space-x-2" })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "space-y-4", children: /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { className: `block text-sm font-medium mb-2 ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`, children: "API Secret" }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "text",
                  id: "apiSecret",
                  name: "apiSecret",
                  value: apiSecret,
                  onChange: (e) => setApiSecret(e.target.value),
                  className: `w-full border rounded-lg px-3 py-2 font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent ${theme === "dark" ? "border-gray-600 bg-gray-700 text-gray-100" : "border-gray-300 bg-white text-gray-900"}`,
                  placeholder: "API SECRET"
                }
              )
            ] }) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: `rounded-lg p-6 border ${theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`, children: [
            /* @__PURE__ */ jsx("label", { className: `block text-sm font-medium mb-2 ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`, children: "Trading Center" }),
            /* @__PURE__ */ jsxs(
              "select",
              {
                id: "tradingCenter",
                name: "tradingCenter",
                className: `w-full px-4 py-3 pr-12 rounded-lg border transition-all duration-200 focus:ring-2 focus:ring-opacity-50 bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-500 focus:border-blue-500 focus:ring-blue-500 `,
                required: true,
                value: selected,
                onChange: (e) => setSelected(e.target.value),
                children: [
                  /* @__PURE__ */ jsx("option", { value: "", children: "Trading Center" }),
                  /* @__PURE__ */ jsx("option", { value: "binance", children: "바이낸스" }),
                  /* @__PURE__ */ jsx("option", { value: "kium", children: "키움증권" })
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => setShowDeleteModal(true),
              className: "px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors flex items-center",
              children: "계정 수정"
            }
          )
        ] }),
        activeTab !== "account" && /* @__PURE__ */ jsxs("div", { className: `rounded-lg p-8 border text-center ${theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`, children: [
          /* @__PURE__ */ jsx("h3", { className: `text-lg font-medium mb-2 ${theme === "dark" ? "text-white" : "text-gray-900"}`, children: (_a = topTabs.find((tab) => tab.id === activeTab)) == null ? void 0 : _a.label }),
          /* @__PURE__ */ jsx("p", { className: `${theme === "dark" ? "text-gray-400" : "text-gray-600"}`, children: "이 섹션은 준비 중입니다." })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx(DashFooter, { theme }),
    showDeleteModal && /* @__PURE__ */ jsx("div", { className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50", children: /* @__PURE__ */ jsxs("div", { className: `rounded-lg p-6 max-w-md w-full mx-4 ${theme === "dark" ? "bg-gray-800" : "bg-white"}`, children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center mb-4", children: [
        /* @__PURE__ */ jsx(AlertTriangle, { className: "w-6 h-6 text-red-500 mr-3" }),
        /* @__PURE__ */ jsx("h3", { className: `text-lg font-medium ${theme === "dark" ? "text-white" : "text-gray-900"}`, children: "API KEY / API SECRET 수정" })
      ] }),
      /* @__PURE__ */ jsx("p", { className: `mb-6 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`, children: "API KEY / API SECRET을 수정합니다. 잘못 수정할 시 시스템이 오작동 될 수 있습니다. 계속하시겠습니까?" }),
      /* @__PURE__ */ jsxs("div", { className: "flex justify-end space-x-3", children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => setShowDeleteModal(false),
            className: `px-4 py-2 text-sm font-medium ${theme === "dark" ? "text-gray-300 hover:text-gray-100" : "text-gray-700 hover:text-gray-900"}`,
            children: "취소"
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: handleApiChangeAccount,
            className: "px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors",
            children: "정보수정"
          }
        )
      ] })
    ] }) })
  ] });
};
const route56 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: AccountSettings
}, Symbol.toStringTag, { value: "Module" }));
function FeaturesPage() {
  const navigate = useNavigate();
  const { theme } = useThemeStore();
  const [modalImg, setModalImg] = useState(null);
  const themeClasses = theme === "dark" ? "bg-gradient-to-br from-slate-900 to-slate-800 text-white" : "bg-gradient-to-br from-white to-slate-50 text-slate-900";
  const textPrimary = theme === "dark" ? "text-white" : "text-slate-900";
  const textSecondary = theme === "dark" ? "text-slate-300" : "text-slate-600";
  return /* @__PURE__ */ jsxs("div", { className: `min-h-screen transition-all duration-300 ${themeClasses}`, children: [
    /* @__PURE__ */ jsx(Header, {}),
    /* @__PURE__ */ jsxs(
      "div",
      {
        className: `${theme === "dark" ? "bg-slate-900 text-white" : "bg-slate-50 text-slate-900"}`,
        children: [
          /* @__PURE__ */ jsxs("section", { className: "py-10 text-center pt-40", children: [
            /* @__PURE__ */ jsx(
              "h1",
              {
                className: `text-4xl lg:text-6xl font-bold mb-3 bg-clip-text text-transparent ${theme === "dark" ? "bg-gradient-to-r from-white to-cyan-400" : "bg-gradient-to-r from-slate-900 to-blue-600"} leading-snug lg:leading-snug`,
                children: "TradingGear 차트 기능 소개"
              }
            ),
            /* @__PURE__ */ jsxs(
              "p",
              {
                className: `text-lg lg:text-xl mx-auto max-w-3xl leading-relaxed ${textSecondary}`,
                children: [
                  "TradingGear는 실시간 호가창, 체결창, 사용자 맞춤 지표, 다중 거래 모니터링, ",
                  /* @__PURE__ */ jsx("br", {}),
                  "알림 기능 등 강력한 기능을 제공합니다."
                ]
              }
            ),
            /* @__PURE__ */ jsx(
              "video",
              {
                src: "/chart_video.mp4",
                controls: true,
                autoPlay: true,
                loop: true,
                muted: true,
                playsInline: true,
                className: "w-full max-w-4xl mx-auto rounded-2xl aspect-video"
              }
            ),
            /* @__PURE__ */ jsxs("ul", { className: "mt-6 flex flex-wrap justify-center gap-4 text-sm lg:text-base font-medium", children: [
              /* @__PURE__ */ jsx("li", { className: "px-4 py-2 rounded-full bg-slate-200/40 dark:bg-slate-700/50", children: "실시간 데이터 반영" }),
              /* @__PURE__ */ jsx("li", { className: "px-4 py-2 rounded-full bg-slate-200/40 dark:bg-slate-700/50", children: "친숙한 UI" }),
              /* @__PURE__ */ jsx("li", { className: "px-4 py-2 rounded-full bg-slate-200/40 dark:bg-slate-700/50", children: "전문가급 분석 도구" })
            ] })
          ] }),
          /* @__PURE__ */ jsx(
            "section",
            {
              className: `py-5 ${theme === "dark" ? "bg-gradient-to-b from-transparent to-slate-800/30" : "bg-gradient-to-b from-transparent to-slate-100/50"}`,
              children: /* @__PURE__ */ jsx("div", { className: "max-w-6xl mx-auto px-4 lg:px-8 mb-16", children: /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8", children: [
                {
                  icon: "📈",
                  title: "실시간 호가/체결",
                  desc: "호가창과 체결 데이터를 실시간으로 확인 가능"
                },
                {
                  icon: "⚙️",
                  title: "사용자 맞춤 지표",
                  desc: "OB 존, VWAP, ATR 등 다양한 지표 구성 가능"
                },
                {
                  icon: "📊",
                  title: "다중 거래 모니터링",
                  desc: "여러 종목과 거래소 동시에 모니터링 가능"
                },
                {
                  icon: "🔔",
                  title: "알림 기능",
                  desc: "가격 도달, 거래량 급등락 시 실시간 알림"
                }
              ].map((feature, idx) => /* @__PURE__ */ jsxs(
                "div",
                {
                  className: `rounded-2xl p-6 text-center backdrop-blur-lg shadow-lg transition-all duration-300 border ${theme === "dark" ? "bg-slate-800/60 border-cyan-400/20 hover:border-cyan-400 hover:shadow-cyan-400/20" : "bg-white/90 border-blue-200/20 hover:border-blue-600 hover:shadow-blue-200/30"}`,
                  children: [
                    /* @__PURE__ */ jsx("div", { className: "text-5xl mb-4", children: feature.icon }),
                    /* @__PURE__ */ jsx("h3", { className: "text-xl font-semibold mb-2", children: feature.title }),
                    /* @__PURE__ */ jsx("p", { className: "text-sm leading-relaxed", children: feature.desc })
                  ]
                },
                idx
              )) }) })
            }
          ),
          /* @__PURE__ */ jsxs(
            "section",
            {
              className: `py-20 ${theme === "dark" ? "bg-gradient-to-b from-transparent to-slate-800/30" : "bg-gradient-to-b from-transparent to-slate-100/50"}`,
              id: "advanced-features",
              children: [
                /* @__PURE__ */ jsxs("div", { className: "max-w-6xl mx-auto px-4 lg:px-8", children: [
                  /* @__PURE__ */ jsx(
                    "h2",
                    {
                      className: `text-3xl lg:text-5xl font-bold text-center mb-12 ${textPrimary}`,
                      children: "전문 기능 & 실전 예시"
                    }
                  ),
                  [
                    {
                      title: "📈 실시간 호가/체결",
                      story: "시세 변동을 놓치면 빠른 거래 판단이 어렵습니다. TradingGear는 실시간 API 연동으로 호가창과 체결 데이터를 즉시 갱신하여, 빠른 주문과 포지션 관리가 가능하게 합니다.",
                      img: "/chart-3.png"
                    },
                    {
                      title: "⚙️ 사용자 맞춤 지표 및 레이아웃",
                      story: "표준 차트만으로는 자신만의 전략을 구현하기 어렵습니다. TradingGear는 내장/커스텀 지표와 레이아웃을 자유롭게 구성할 수 있어 OB 존, VWAP, ATR 등 다양한 지표로 전략을 최적화할 수 있습니다.",
                      img: "/graph2.png"
                    },
                    {
                      title: "🖥️ 다중 거래 모니터링",
                      story: "여러 종목을 동시에 체크하기 어렵지만, TradingGear는 멀티 모니터와 다중 거래소 동시 모니터링 기능을 제공하여 빠른 판단과 대응으로 투자 효율을 극대화할 수 있습니다.",
                      img: "/chart-2.png"
                    },
                    {
                      title: "🔔 알림 기능",
                      story: "중요 시그널을 놓치면 손해가 발생할 수 있습니다. TradingGear는 가격 도달, 거래량 급등락 등 조건 충족 시 실시간 알림을 제공하여 모바일/웹에서 즉시 확인할 수 있습니다.",
                      img: "/chart.png"
                    }
                  ].map((feature, idx) => /* @__PURE__ */ jsxs(
                    "div",
                    {
                      className: `flex flex-col lg:flex-row items-center gap-12 mb-20 ${idx % 2 === 1 ? "lg:flex-row-reverse" : ""}`,
                      children: [
                        /* @__PURE__ */ jsx("div", { className: "lg:w-1/2 rounded-2xl overflow-hidden border border-slate-200/20", children: /* @__PURE__ */ jsx(
                          "button",
                          {
                            onClick: () => setModalImg(feature.img),
                            className: "w-full p-0 border-0 bg-transparent cursor-zoom-in",
                            children: /* @__PURE__ */ jsx(
                              "img",
                              {
                                src: feature.img,
                                alt: feature.title,
                                className: "w-full h-auto block"
                              }
                            )
                          }
                        ) }),
                        /* @__PURE__ */ jsxs("div", { className: "lg:w-1/2 text-center lg:text-left", children: [
                          /* @__PURE__ */ jsx(
                            "h3",
                            {
                              className: `text-3xl lg:text-4xl font-bold mb-4 ${textPrimary}`,
                              children: feature.title
                            }
                          ),
                          /* @__PURE__ */ jsx("p", { className: `text-lg ${textSecondary} leading-relaxed`, children: feature.story })
                        ] })
                      ]
                    },
                    idx
                  ))
                ] }),
                modalImg && /* @__PURE__ */ jsx(
                  "button",
                  {
                    className: "fixed inset-0 bg-black/70 flex justify-center items-center z-50 p-4 cursor-zoom-out",
                    onClick: () => setModalImg(null),
                    "aria-label": "이미지 닫기",
                    children: /* @__PURE__ */ jsx(
                      "img",
                      {
                        src: modalImg,
                        alt: "확대 이미지",
                        className: "max-w-[90vw] max-h-[90vh] rounded-xl shadow-2xl"
                      }
                    )
                  }
                )
              ]
            }
          ),
          /* @__PURE__ */ jsxs("section", { className: "py-20 text-center", children: [
            /* @__PURE__ */ jsx("h2", { className: `text-3xl lg:text-5xl font-bold mb-12 ${textPrimary}`, children: "📊 고급 분석 도구" }),
            /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto px-4 lg:px-8", children: [
              {
                icon: "📝",
                title: "거래 로그",
                desc: "엔트리/TP/SL 발생 로그, Score, RR 기록"
              },
              {
                icon: "📈",
                title: "백테스트",
                desc: "기간별 수익률, 승률, MDD, 거래별 손익 기록"
              },
              {
                icon: "⚙️",
                title: "설정",
                desc: "차트 환경, 전략 파라미터, 데이터 연동 설정"
              },
              {
                icon: "🔔",
                title: "사용자 지정 알림",
                desc: "지정 가격, 전략 신호 등 맞춤 알림 설정"
              }
            ].map((panel, idx) => /* @__PURE__ */ jsxs(
              "div",
              {
                className: `rounded-2xl p-6 text-center backdrop-blur-lg shadow-lg transition-all duration-300 border ${theme === "dark" ? "bg-slate-800/60 border-cyan-400/20 hover:border-cyan-400 hover:shadow-cyan-400/20" : "bg-white/90 border-blue-200/20 hover:border-blue-600 hover:shadow-blue-200/30"}`,
                children: [
                  /* @__PURE__ */ jsx("div", { className: "text-5xl mb-4", children: panel.icon }),
                  /* @__PURE__ */ jsx("h3", { className: "text-xl font-semibold mb-2", children: panel.title }),
                  /* @__PURE__ */ jsx("p", { className: "text-sm leading-relaxed", children: panel.desc })
                ]
              },
              idx
            )) }),
            /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row justify-center gap-4 mt-16", children: [
              /* @__PURE__ */ jsx(
                "button",
                {
                  className: `px-8 py-4 rounded-full font-bold text-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${theme === "dark" ? "bg-gradient-to-r from-cyan-400 to-emerald-400 text-slate-900 hover:shadow-cyan-400/40" : "bg-gradient-to-r from-blue-600 to-emerald-600 text-white hover:shadow-blue-600/40"}`,
                  onClick: () => navigate("/doc"),
                  children: "상세 매뉴얼 pdf"
                }
              ),
              /* @__PURE__ */ jsx(
                "button",
                {
                  className: `border-2 px-8 py-4 rounded-full font-bold text-lg transition-all duration-300 ${theme === "dark" ? "border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-slate-900" : "border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white"}`,
                  onClick: () => navigate("/download"),
                  children: "다운로드"
                }
              )
            ] })
          ] })
        ]
      }
    )
  ] });
}
const route57 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: FeaturesPage
}, Symbol.toStringTag, { value: "Module" }));
const meta$a = () => {
  return [
    { title: "요금제 - TRADING GEAR" },
    { name: "pricing", content: "AI 트레이딩의 새로운 시대" }
  ];
};
function PricingPage() {
  const { theme, initializeTheme } = useThemeStore();
  const [billingCycle, setBillingCycle] = useState("monthly");
  useEffect(() => {
    initializeTheme();
  }, [initializeTheme]);
  const themeClasses = theme === "dark" ? "bg-gradient-to-br from-slate-900 to-slate-800 text-white" : "bg-gradient-to-br from-white to-slate-50 text-slate-900";
  const textPrimary = theme === "dark" ? "text-white" : "text-slate-900";
  const textSecondary = theme === "dark" ? "text-slate-300" : "text-slate-600";
  const accentColor = theme === "dark" ? "text-emerald-400" : "text-emerald-600";
  const plans = [
    {
      id: "basic",
      name: "Basic",
      price: { monthly: 29e3, yearly: 29e4 },
      popular: false,
      description: "초보 투자자, 기본 자동매매 사용자",
      features: [
        "자동매매 기본 기능 : 1개 전략 구독 가능",
        "실시간 시세 조회 : 국내 주식/코인 통합",
        "기본 알림 서비스 : 매수·매도 알림 (앱·카톡·이메일)",
        "기본 리스크 관리 : 손절/익절 설정",
        "기본 고객지원 : FAQ + 이메일 문의"
      ],
      buttonText: "시작하기",
      buttonStyle: "secondary"
    },
    {
      id: "pro",
      name: "Pro",
      price: { monthly: 59e3, yearly: 59e4 },
      popular: true,
      description: "중급 트레이더, 다전략 사용자",
      features: [
        "자동매매 확장 기능 : 최대 3개 전략 구독",
        "백테스트 제공 (기본) : 최근 6개월 데이터 분석",
        "전략 커스터마이징 : 파라미터 조정 가능",
        "고급 알림 서비스 : 푸시 알림 + 실시간 체결 정보",
        "리스크 관리 강화: 트레일링 스탑, 포지션 제한",
        "API 연동 : 키움증권·업비트·바이낸스 등",
        "멀티 브로커 연결"
      ],
      buttonText: "가장 인기",
      buttonStyle: "primary"
    },
    {
      id: "premium",
      name: "Premium",
      price: { monthly: 99e3, yearly: 99e4 },
      popular: false,
      description: "전문가, 퀸트 지향 사용자",
      features: [
        "무제한 전략 구독",
        "고급 백테스트 : 최대 5년치 데이터 + 심층 성능 분석",
        "AI 기반 전략 추천 (머신러닝 분석으로 종목·전략 추천)",
        "실시간 체결 리포트 + 손익 분석 대시보드",
        "리스크 자동화 : 변동성 기반 DCA, 포트폴리오 리밸런싱",
        "프리미엄 고객지원 : 실시간 채팅 + 전담 매니저",
        "전략 마켓 입점 기회 (전략가 수익 쉐어 가능)"
      ],
      buttonText: "문의하기",
      buttonStyle: "premium"
    }
  ];
  const formatPrice = (price) => {
    if (price === 0) return "무료";
    return new Intl.NumberFormat("ko-KR").format(price);
  };
  const getYearlyDiscount = (monthly, yearly) => {
    if (monthly === 0) return 0;
    const yearlyMonthly = yearly / 12;
    const discount = (monthly - yearlyMonthly) / monthly * 100;
    return Math.round(discount);
  };
  return /* @__PURE__ */ jsxs("div", { className: `min-h-screen transition-all duration-300 ${themeClasses}`, children: [
    /* @__PURE__ */ jsx(Header, {}),
    /* @__PURE__ */ jsxs("section", { className: "pt-32 lg:pt-40 pb-16 lg:pb-20 text-center relative overflow-hidden", children: [
      /* @__PURE__ */ jsx("div", { className: `absolute inset-0 ${theme === "dark" ? "bg-gradient-radial from-cyan-400/10" : "bg-gradient-radial from-blue-600/10"} to-transparent` }),
      /* @__PURE__ */ jsxs("div", { className: "max-w-4xl mx-auto px-4 lg:px-8 relative z-10", children: [
        /* @__PURE__ */ jsx("h1", { className: `text-4xl lg:text-6xl font-bold mb-6 ${theme === "dark" ? "bg-gradient-to-r from-white to-cyan-400" : "bg-gradient-to-r from-slate-900 to-blue-600"} bg-clip-text text-transparent`, children: "투명한 가격, 확실한 가치" }),
        /* @__PURE__ */ jsxs("p", { className: `text-xl lg:text-2xl ${textSecondary} mb-8 leading-relaxed`, children: [
          "모든 플랜에 7일 무료 체험이 포함되어 있습니다.",
          /* @__PURE__ */ jsx("br", {}),
          "신용카드 등록 없이 바로 시작하세요."
        ] }),
        /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center md-8 lg:mb-12", children: /* @__PURE__ */ jsxs("div", { className: `${theme === "dark" ? "bg-slate-800/60" : "bg-white/60"} backdrop-blur-lg rounded-full p-1 border ${theme === "dark" ? "border-cyan-400/20" : "border-blue-600/20"}`, children: [
          /* @__PURE__ */ jsx(
            "button",
            {
              className: `px-6 py-2 rounded-full font-medium transition-all duration-300 ${billingCycle === "monthly" ? `${theme === "dark" ? "bg-cyan-400 text-slate-900" : "bg-blue-600 text-white"} shadow-lg` : `${textPrimary} hover:text-cyan-400`}`,
              onClick: () => setBillingCycle("monthly"),
              children: "월간 결제"
            }
          ),
          /* @__PURE__ */ jsxs(
            "button",
            {
              className: `px-6 py-2 rounded-full font-medium transition-all duration-300 relative ${billingCycle === "yearly" ? `${theme === "dark" ? "bg-cyan-400 text-slate-900" : "bg-blue-600 text-white"} shadow-lg` : `${textPrimary} hover:text-cyan-400`}`,
              onClick: () => setBillingCycle("yearly"),
              children: [
                "연간 결제",
                /* @__PURE__ */ jsx("span", { className: `ml-2 px-2 py-1 text-xs ${accentColor} ${theme === "dark" ? "bg-slate-800/60" : "bg-white/90"} rounded-full`, children: "2개월 무료" })
              ]
            }
          )
        ] }) })
      ] })
    ] }),
    /* @__PURE__ */ jsx("section", { className: "pb-20", children: /* @__PURE__ */ jsx("div", { className: "max-w-7xl mx-auto px-4 lg:px-8", children: /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8", children: plans.map((plan) => /* @__PURE__ */ jsxs(
      "div",
      {
        className: `relative ${theme === "dark" ? "bg-slate-800/60" : "bg-white/90"} backdrop-blur-lg rounded-2xl border transition-all duration-300 hover:transform hover:-translate-y-2 ${plan.popular ? `${theme === "dark" ? "border-cyan-400 shadow-cyan-400/20" : "border-blue-600 shadow-blue-600/20"} shadow-xl` : `${theme === "dark" ? "border-cyan-400/20 hover:border-cyan-400/40" : "border-blue-600/20 hover:border-blue-600/40"} hover:shadow-lg`}`,
        children: [
          plan.popular && /* @__PURE__ */ jsx("div", { className: `absolute -top-4 left-1/2 transform -translate-x-1/2 ${theme === "dark" ? "bg-gradient-to-r from-cyan-400 to-emerald-400 text-slate-900" : "bg-gradient-to-r from-blue-600 to-emerald-600 text-white"} px-4 py-2 rounded-full text-sm font-bold`, children: "가장 인기" }),
          /* @__PURE__ */ jsxs("div", { className: "p-8", children: [
            /* @__PURE__ */ jsxs("div", { className: "text-center mb-8", children: [
              /* @__PURE__ */ jsx("h3", { className: `text-2xl font-bold ${textPrimary} mb-2`, children: plan.name }),
              /* @__PURE__ */ jsx("p", { className: `${textSecondary} text-sm mb-6`, children: plan.description }),
              /* @__PURE__ */ jsx("div", { className: "mb-6", children: /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsxs("div", { className: `text-4xl font-bold ${textPrimary}`, children: [
                  "₩",
                  formatPrice(plan.price[billingCycle]),
                  /* @__PURE__ */ jsxs("span", { className: `text-lg ${textSecondary} font-normal`, children: [
                    "/",
                    billingCycle === "monthly" ? "월" : "년"
                  ] })
                ] }),
                billingCycle === "yearly" && plan.price.monthly > 0 && /* @__PURE__ */ jsxs("div", { className: `text-sm ${accentColor} mt-2`, children: [
                  "월 ₩",
                  formatPrice(plan.price.yearly / 12),
                  " (",
                  getYearlyDiscount(plan.price.monthly, plan.price.yearly),
                  "% 할인)"
                ] })
              ] }) }),
              /* @__PURE__ */ jsx(
                "button",
                {
                  className: `w-full py-3 px-6 rounded-full font-bold transition-all duration-300 ${plan.buttonStyle === "primary" ? `${theme === "dark" ? "bg-gradient-to-r from-cyan-400 to-emerald-400 text-slate-900 hover:shadow-cyan-400/30" : "bg-gradient-to-r from-blue-600 to-emerald-600 text-white hover:shadow-blue-600/30"} hover:transform hover:-translate-y-1 hover:shadow-lg` : plan.buttonStyle === "premium" ? `${theme === "dark" ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:shadow-purple-500/30" : "bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-purple-600/30"} hover:transform hover:-translate-y-1 hover:shadow-lg` : `border-2 ${theme === "dark" ? "border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-slate-900" : "border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white"}`}`,
                  children: plan.buttonText
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
              /* @__PURE__ */ jsx("h4", { className: `font-semibold ${textPrimary} mb-3`, children: "포함된 기능:" }),
              /* @__PURE__ */ jsx("ul", { className: "space-y-3", children: plan.features.map((feature, index) => /* @__PURE__ */ jsxs("li", { className: "flex items-start", children: [
                /* @__PURE__ */ jsx("span", { className: `${accentColor} mr-3 leading-none`, children: "✓" }),
                /* @__PURE__ */ jsx("span", { className: `${textSecondary} text-sm`, children: feature })
              ] }, index)) })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "pt-4", children: [
              plan.id === "basic" && /* @__PURE__ */ jsxs("p", { children: [
                /* @__PURE__ */ jsx("span", { className: `${theme === "dark" ? "text-cyan-400" : "text-blue-600"}`, children: "제한 : " }),
                " 백테스트 불가, 고급 지표 사용 제한"
              ] }),
              plan.id === "pro" && /* @__PURE__ */ jsxs("p", { children: [
                /* @__PURE__ */ jsx("span", { className: `${theme === "dark" ? "text-cyan-400" : "text-blue-600"}`, children: "보너스 : " }),
                "전략 마켓 플레이스에서 전략 할인 혜택"
              ] })
            ] })
          ] })
        ]
      },
      plan.id
    )) }) }) }),
    /* @__PURE__ */ jsx("section", { className: `py-20 ${theme === "dark" ? "bg-slate-800/30" : "bg-slate-100/50"}`, children: /* @__PURE__ */ jsx("div", { className: "max-w-6xl mx-auto px-4 lg:px-8", children: /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-8", children: [
      /* @__PURE__ */ jsxs("div", { className: `${theme === "dark" ? "bg-slate-800/60" : "bg-white/90"} backdrop-blur-lg rounded-2xl p-8 border ${theme === "dark" ? "border-cyan-400/20" : "border-blue-600/20"}`, children: [
        /* @__PURE__ */ jsxs("h3", { className: `text-xl font-bold ${textPrimary} mb-6 flex items-center`, children: [
          /* @__PURE__ */ jsx("span", { className: "mr-3", children: "💳" }),
          "결제 방식"
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between py-2", children: [
            /* @__PURE__ */ jsx("span", { className: `${textSecondary}`, children: "신용카드" }),
            /* @__PURE__ */ jsx("span", { className: `${accentColor}`, children: "✓" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between py-2", children: [
            /* @__PURE__ */ jsx("span", { className: `${textSecondary}`, children: "카카오페이" }),
            /* @__PURE__ */ jsx("span", { className: `${accentColor}`, children: "✓" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between py-2", children: [
            /* @__PURE__ */ jsx("span", { className: `${textSecondary}`, children: "계좌이체" }),
            /* @__PURE__ */ jsx("span", { className: `${accentColor}`, children: "✓" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: `${theme === "dark" ? "bg-slate-800/60" : "bg-white/90"} backdrop-blur-lg rounded-2xl p-8 border ${theme === "dark" ? "border-cyan-400/20" : "border-blue-600/20"}`, children: [
        /* @__PURE__ */ jsxs("h3", { className: `text-xl font-bold ${textPrimary} mb-6 flex items-center`, children: [
          /* @__PURE__ */ jsx("span", { className: "mr-3", children: "🔄" }),
          "환불 정책"
        ] }),
        /* @__PURE__ */ jsx("div", { className: "space-y-4", children: /* @__PURE__ */ jsxs("div", { className: `${textSecondary} text-sm`, children: [
          /* @__PURE__ */ jsx("p", { className: "mb-3", children: "• 7일 무료 체험 기간 중 언제든 구독취소 가능" }),
          /* @__PURE__ */ jsx("p", { className: "mb-3", children: "• 멤버십 결제 후 7일 이내이고, 트레이딩 이력이 전혀 없는 경우에만 전액 환불이 가능합니다." }),
          /* @__PURE__ */ jsx("p", { className: "mb-3", children: "• 결제 후 7일이 지났거나, 트레이딩 이력이 있다면 환불이 불가능합니다. " }),
          /* @__PURE__ */ jsx("p", { children: "• 악용 방지를 위한 검토 과정 있음" })
        ] }) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: `${theme === "dark" ? "bg-slate-800/60" : "bg-white/90"} backdrop-blur-lg rounded-2xl p-8 border ${theme === "dark" ? "border-cyan-400/20" : "border-blue-600/20"}`, children: [
        /* @__PURE__ */ jsxs("h3", { className: `text-xl font-bold ${textPrimary} mb-6 flex items-center`, children: [
          /* @__PURE__ */ jsx("span", { className: "mr-3", children: "📋" }),
          "자동 결제 취소"
        ] }),
        /* @__PURE__ */ jsx("div", { className: "space-y-4", children: /* @__PURE__ */ jsxs("div", { className: `${textSecondary} text-sm`, children: [
          /* @__PURE__ */ jsx("p", { className: "mb-3", children: "• 멤버십은 자동 결제되므로, 해지하지 않으면 매달 요금이 청구됩니다. " }),
          /* @__PURE__ */ jsx("p", { className: "mb-3", children: "• 자동 결제 취소 후에도 남은 결제 주기 동안은 멤버십을 유지할 수 있습니다." })
        ] }) })
      ] })
    ] }) }) }),
    /* @__PURE__ */ jsxs("section", { className: "py-20 text-center relative overflow-hidden", children: [
      /* @__PURE__ */ jsx("div", { className: `absolute inset-0 ${theme === "dark" ? "bg-gradient-radial from-emerald-400/10" : "bg-gradient-radial from-emerald-600/10"} to-transparent` }),
      /* @__PURE__ */ jsxs("div", { className: "max-w-4xl mx-auto px-4 lg:px-8 relative z-10", children: [
        /* @__PURE__ */ jsx("h2", { className: `text-3xl lg:text-5xl font-bold mb-6 ${textPrimary}`, children: "지금 바로 시작하세요!" }),
        /* @__PURE__ */ jsxs("p", { className: `text-xl ${textSecondary} mb-8`, children: [
          "7일 무료 체험으로 Trading Gear의 모든 기능을 경험해보세요.",
          /* @__PURE__ */ jsx("br", {}),
          "신용카드 등록 없이 바로 시작 가능합니다."
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row justify-center gap-4 mb-8", children: [
          /* @__PURE__ */ jsx("button", { className: `${theme === "dark" ? "bg-gradient-to-r from-cyan-400 to-emerald-400 text-slate-900 hover:shadow-cyan-400/40" : "bg-gradient-to-r from-blue-600 to-emerald-600 text-white hover:shadow-blue-600/40"} px-8 py-4 rounded-full font-bold text-lg hover:transform hover:-translate-y-1 hover:shadow-xl transition-all duration-300`, children: "무료 체험 시작하기" }),
          /* @__PURE__ */ jsx("button", { className: `border-2 ${theme === "dark" ? "border-cyan-400 text-cyan-400 hover:bg-cyan-400" : "border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white"} hover:text-slate-900 px-8 py-4 rounded-full font-bold text-lg transition-all duration-300`, children: "영업팀과 상담하기" })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx(Footer, { onLinkClick: (linkName) => linkName })
  ] });
}
const route58 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: PricingPage,
  meta: meta$a
}, Symbol.toStringTag, { value: "Module" }));
const meta$9 = () => {
  return [
    { title: "개인정보처리방침 - TRADING GEAR" },
    { name: "privacy", content: "AI 트레이딩의 새로운 시대" }
  ];
};
function PrivacyPolicyPage() {
  const { theme, initializeTheme } = useThemeStore();
  const [expandedSection, setExpandedSection] = useState(null);
  useEffect(() => {
    initializeTheme();
  }, [initializeTheme]);
  const toggleSection = (sectionId) => {
    setExpandedSection(expandedSection === sectionId ? null : sectionId);
  };
  const themeClasses = theme === "dark" ? "bg-gradient-to-br from-slate-900 to-slate-800 text-white" : "bg-gradient-to-br from-white to-slate-50 text-slate-900";
  const textPrimary = theme === "dark" ? "text-white" : "text-slate-900";
  const textSecondary = theme === "dark" ? "text-slate-300" : "text-slate-600";
  const privacySections = [
    {
      id: "overview",
      title: "개인정보처리방침 개요",
      icon: "🛡️",
      color: "purple",
      content: {
        description: "개인정보보호법에 따라 Trading Gear를 이용하는 이용자의 개인정보 보호 및 권익을 보호하고자 다음과 같이 개인정보처리방침을 명시합니다.",
        details: [
          "개인정보의 처리 목적과 항목",
          "개인정보의 보유 및 이용기간",
          "개인정보의 제3자 제공 및 처리위탁",
          "정보주체의 권리와 행사방법",
          "개인정보의 안전성 확보조치"
        ]
      }
    },
    {
      id: "collection",
      title: "개인정보 수집 및 이용",
      icon: "📊",
      color: "blue",
      content: {
        description: "Trading Gear는 서비스 제공을 위해 필요한 최소한의 개인정보만을 수집합니다.",
        details: [
          "필수 정보: 이메일, 비밀번호, 닉네임",
          "선택 정보: 전화번호, 거주지역, 투자 경험",
          "서비스 이용 정보: 접속 로그, 거래 기록, 설정값",
          "기기 정보: IP 주소, 브라우저 정보, OS 정보",
          "API 연결 정보: 거래소 API 키 (암호화 저장)"
        ]
      }
    },
    {
      id: "purpose",
      title: "개인정보 처리 목적",
      icon: "🎯",
      color: "green",
      content: {
        description: "수집된 개인정보는 다음의 목적을 위해서만 처리되며, 목적이 변경될 경우 사전 동의를 받겠습니다.",
        details: [
          "회원 가입 및 계정 관리",
          "서비스 제공 및 운영",
          "고객 지원 및 상담",
          "서비스 개선 및 개발",
          "마케팅 및 이벤트 정보 제공 (동의 시)",
          "법정 의무 이행 및 분쟁 해결"
        ]
      }
    },
    {
      id: "retention",
      title: "개인정보 보유 및 이용기간",
      icon: "⏰",
      color: "orange",
      content: {
        description: "개인정보는 수집 및 이용목적이 달성된 후에는 해당 정보를 지체없이 파기합니다.",
        details: [
          "회원 탈퇴 시: 즉시 삭제 (법령 보관 의무 제외)",
          "거래 기록: 전자상거래법에 따라 5년 보관",
          "접속 로그: 통신비밀보호법에 따라 3개월 보관",
          "쿠키 정보: 브라우저 설정에 따라 관리",
          "마케팅 정보: 동의 철회 시 즉시 삭제"
        ]
      }
    },
    {
      id: "security",
      title: "개인정보 보안조치",
      icon: "🔒",
      color: "red",
      content: {
        description: "Trading Gear는 개인정보의 안전성 확보를 위해 다음과 같은 기술적, 관리적 조치를 취하고 있습니다.",
        details: [
          "개인정보 암호화: AES-256 암호화 적용",
          "접근 통제: 역할 기반 접근 제어 시스템",
          "접속 기록 보관: 접근 로그 실시간 모니터링",
          "보안 서버 구축: SSL/TLS 인증서 적용",
          "정기 보안 점검: 월 1회 보안 취약점 점검",
          "직원 교육: 개인정보보호 교육 정기 실시"
        ]
      }
    },
    {
      id: "rights",
      title: "정보주체의 권리",
      icon: "⚖️",
      color: "indigo",
      content: {
        description: "이용자는 개인정보 처리에 관하여 다음과 같은 권리를 행사할 수 있습니다.",
        details: [
          "개인정보 처리현황 통지 요구",
          "개인정보 열람 및 처리정지 요구",
          "개인정보 정정·삭제 요구",
          "개인정보 손해배상 요구",
          "개인정보보호위원회 신고",
          "법정대리인의 권리 행사 (만 14세 미만)"
        ]
      }
    },
    {
      id: "cookies",
      title: "쿠키 운영 정책",
      icon: "🍪",
      color: "pink",
      content: {
        description: "Trading Gear는 개인화된 서비스 제공을 위해 쿠키를 사용합니다.",
        details: [
          "필수 쿠키: 로그인 상태 유지, 보안 토큰",
          "기능 쿠키: 언어 설정, 테마 설정",
          "분석 쿠키: 서비스 이용 패턴 분석 (동의 시)",
          "광고 쿠키: 맞춤형 광고 제공 (동의 시)",
          "쿠키 거부: 브라우저 설정에서 차단 가능",
          "필수 쿠키 거부 시 일부 기능 제한"
        ]
      }
    },
    {
      id: "contact",
      title: "개인정보보호 담당자",
      icon: "👥",
      color: "cyan",
      content: {
        description: "개인정보 처리에 관한 업무를 총괄해서 책임지고, 개인정보 처리와 관련한 정보주체의 불만처리 및 피해구제를 담당합니다.",
        details: [
          "개인정보보호책임자: 김데이터 (privacy@tradinggear.co.kr)",
          "개인정보보호담당자: 이보안 (security@tradinggear.co.kr)",
          "고객센터: 1588-0000 (평일 09:00-18:00)",
          "팩스: 02-0000-0000",
          "주소: 서울특별시 강남구 테헤란로 123",
          "개인정보보호위원회 (privacy.go.kr, 국번없이 182)"
        ]
      }
    }
  ];
  const getColorClasses = (color) => {
    const colors = {
      purple: { border: "border-purple-400/30", bg: "bg-purple-400/10", text: "text-purple-400", icon: "bg-purple-400/20" },
      blue: { border: "border-blue-400/30", bg: "bg-blue-400/10", text: "text-blue-400", icon: "bg-blue-400/20" },
      green: { border: "border-green-400/30", bg: "bg-green-400/10", text: "text-green-400", icon: "bg-green-400/20" },
      orange: { border: "border-orange-400/30", bg: "bg-orange-400/10", text: "text-orange-400", icon: "bg-orange-400/20" },
      red: { border: "border-red-400/30", bg: "bg-red-400/10", text: "text-red-400", icon: "bg-red-400/20" },
      indigo: { border: "border-indigo-400/30", bg: "bg-indigo-400/10", text: "text-indigo-400", icon: "bg-indigo-400/20" },
      pink: { border: "border-pink-400/30", bg: "bg-pink-400/10", text: "text-pink-400", icon: "bg-pink-400/20" },
      cyan: { border: "border-cyan-400/30", bg: "bg-cyan-400/10", text: "text-cyan-400", icon: "bg-cyan-400/20" }
    };
    return colors[color] || colors.blue;
  };
  return /* @__PURE__ */ jsxs("div", { className: `min-h-screen transition-all duration-300 ${themeClasses}`, children: [
    /* @__PURE__ */ jsx(Header, {}),
    /* @__PURE__ */ jsxs("section", { className: "pt-32 pb-16 text-center relative overflow-hidden", children: [
      /* @__PURE__ */ jsx("div", { className: `absolute inset-0 ${theme === "dark" ? "bg-gradient-radial from-purple-400/10" : "bg-gradient-radial from-purple-600/10"} to-transparent` }),
      /* @__PURE__ */ jsxs("div", { className: "max-w-4xl mx-auto px-4 lg:px-8 relative z-10", children: [
        /* @__PURE__ */ jsx("div", { className: "flex justify-center mb-6", children: /* @__PURE__ */ jsx("div", { className: `w-20 h-20 ${theme === "dark" ? "bg-purple-400/20" : "bg-purple-600/20"} rounded-full flex items-center justify-center text-4xl`, children: "🛡️" }) }),
        /* @__PURE__ */ jsx("h1", { className: `text-4xl lg:text-5xl font-bold mb-6 ${theme === "dark" ? "bg-gradient-to-r from-white to-purple-400" : "bg-gradient-to-r from-slate-900 to-purple-600"} bg-clip-text text-transparent`, children: "개인정보처리방침" }),
        /* @__PURE__ */ jsxs("p", { className: `text-lg lg:text-xl ${textSecondary} mb-8 leading-relaxed`, children: [
          "Trading Gear는 이용자의 개인정보를 소중히 여기며",
          /* @__PURE__ */ jsx("br", {}),
          "개인정보보호법에 따라 투명하게 관리합니다."
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row justify-center gap-4", children: [
          /* @__PURE__ */ jsx("div", { className: `inline-flex items-center px-4 py-2 ${theme === "dark" ? "bg-slate-800/60" : "bg-white/80"} backdrop-blur-lg rounded-full border ${theme === "dark" ? "border-purple-400/20" : "border-purple-600/20"}`, children: /* @__PURE__ */ jsx("span", { className: `text-sm ${textSecondary}`, children: "최종 업데이트: 2025년 7월 3일" }) }),
          /* @__PURE__ */ jsx("div", { className: `inline-flex items-center px-4 py-2 ${theme === "dark" ? "bg-purple-400/20" : "bg-purple-600/20"} backdrop-blur-lg rounded-full border ${theme === "dark" ? "border-purple-400/30" : "border-purple-600/30"}`, children: /* @__PURE__ */ jsx("span", { className: `text-sm ${theme === "dark" ? "text-purple-400" : "text-purple-600"} font-medium`, children: "개인정보보호법 준수" }) })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx("section", { className: "pb-20", children: /* @__PURE__ */ jsxs("div", { className: "max-w-6xl mx-auto px-4 lg:px-8", children: [
      /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6", children: privacySections.map((section, index) => {
        const colorClasses = getColorClasses(section.color);
        const isExpanded = expandedSection === section.id;
        return /* @__PURE__ */ jsxs(
          "div",
          {
            className: `${theme === "dark" ? "bg-slate-800/40" : "bg-white/70"} backdrop-blur-lg rounded-2xl border ${colorClasses.border} transition-all duration-300 hover:transform hover:-translate-y-1 hover:shadow-lg overflow-hidden`,
            children: [
              /* @__PURE__ */ jsxs(
                "div",
                {
                  className: "p-6 cursor-pointer",
                  onClick: () => toggleSection(section.id),
                  children: [
                    /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between mb-4", children: [
                      /* @__PURE__ */ jsxs("div", { className: "flex items-center", children: [
                        /* @__PURE__ */ jsx("div", { className: `w-12 h-12 ${colorClasses.icon} rounded-lg flex items-center justify-center text-xl mr-4`, children: section.icon }),
                        /* @__PURE__ */ jsxs("div", { children: [
                          /* @__PURE__ */ jsx("h3", { className: `text-lg font-bold ${textPrimary} mb-2`, children: section.title }),
                          /* @__PURE__ */ jsx("div", { className: `inline-flex items-center px-2 py-1 ${colorClasses.bg} rounded-full`, children: /* @__PURE__ */ jsxs("span", { className: `text-xs font-medium ${colorClasses.text}`, children: [
                            "섹션 ",
                            index + 1
                          ] }) })
                        ] })
                      ] }),
                      /* @__PURE__ */ jsx("button", { className: `w-8 h-8 flex items-center justify-center ${colorClasses.text} transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`, children: /* @__PURE__ */ jsx("svg", { className: "w-5 h-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M19 9l-7 7-7-7" }) }) })
                    ] }),
                    /* @__PURE__ */ jsx("p", { className: `${textSecondary} text-sm leading-relaxed mb-4`, children: section.content.description }),
                    /* @__PURE__ */ jsx("div", { className: `text-xs ${colorClasses.text} font-medium`, children: "클릭하여 자세히 보기" })
                  ]
                }
              ),
              /* @__PURE__ */ jsx("div", { className: `transition-all duration-300 overflow-hidden ${isExpanded ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`, children: /* @__PURE__ */ jsxs("div", { className: `p-6 pt-0 border-t ${colorClasses.border}`, children: [
                /* @__PURE__ */ jsxs("h4", { className: `font-semibold ${textPrimary} mb-3 flex items-center`, children: [
                  /* @__PURE__ */ jsx("span", { className: `w-2 h-2 ${colorClasses.bg} rounded-full mr-2` }),
                  "세부 사항"
                ] }),
                /* @__PURE__ */ jsx("ul", { className: "space-y-2", children: section.content.details.map((detail, idx) => /* @__PURE__ */ jsxs("li", { className: `flex items-start ${textSecondary} text-sm`, children: [
                  /* @__PURE__ */ jsx("span", { className: `${colorClasses.text} mr-2 mt-1`, children: "•" }),
                  /* @__PURE__ */ jsx("span", { children: detail })
                ] }, idx)) })
              ] }) })
            ]
          },
          section.id
        );
      }) }),
      /* @__PURE__ */ jsx("div", { className: `mt-12 ${theme === "dark" ? "bg-gradient-to-r from-purple-900/40 to-blue-900/40" : "bg-gradient-to-r from-purple-100/60 to-blue-100/60"} backdrop-blur-lg rounded-2xl p-8 border ${theme === "dark" ? "border-purple-400/20" : "border-purple-600/20"}`, children: /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
        /* @__PURE__ */ jsx("div", { className: `w-16 h-16 ${theme === "dark" ? "bg-purple-400/20" : "bg-purple-600/20"} rounded-full flex items-center justify-center text-2xl mx-auto mb-4`, children: "📞" }),
        /* @__PURE__ */ jsx("h3", { className: `text-xl font-bold ${textPrimary} mb-4`, children: "개인정보 문의" }),
        /* @__PURE__ */ jsxs("p", { className: `${textSecondary} mb-6 leading-relaxed`, children: [
          "개인정보 처리와 관련하여 궁금한 사항이나 불편사항이 있으시면",
          /* @__PURE__ */ jsx("br", {}),
          "언제든지 개인정보보호담당자에게 연락주시기 바랍니다."
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row justify-center gap-4", children: [
          /* @__PURE__ */ jsx("div", { className: `px-6 py-3 ${theme === "dark" ? "bg-slate-800/60" : "bg-white/80"} backdrop-blur-lg rounded-full border ${theme === "dark" ? "border-purple-400/20" : "border-purple-600/20"}`, children: /* @__PURE__ */ jsx("span", { className: `text-sm ${textSecondary}`, children: "📧 privacy@tradinggear.co.kr" }) }),
          /* @__PURE__ */ jsx("div", { className: `px-6 py-3 ${theme === "dark" ? "bg-slate-800/60" : "bg-white/80"} backdrop-blur-lg rounded-full border ${theme === "dark" ? "border-purple-400/20" : "border-purple-600/20"}`, children: /* @__PURE__ */ jsx("span", { className: `text-sm ${textSecondary}`, children: "📞 1588-0000" }) })
        ] })
      ] }) })
    ] }) }),
    /* @__PURE__ */ jsx(Footer, { onLinkClick: (linkName) => linkName })
  ] });
}
const route59 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: PrivacyPolicyPage,
  meta: meta$9
}, Symbol.toStringTag, { value: "Module" }));
function TermsWarningPopup() {
  const [isPopupOpen, setIsPopupOpen] = useState(true);
  const closePopup = () => setIsPopupOpen(false);
  const buttonPrimary = "bg-gradient-to-r from-blue-600 to-emerald-600 text-white hover:from-blue-700 hover:to-emerald-700";
  return /* @__PURE__ */ jsx(Fragment, { children: isPopupOpen && /* @__PURE__ */ jsx("div", { className: "min-h-screen flex items-center justify-center p-4 fixed w-full z-[999]", children: /* @__PURE__ */ jsx("div", { className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4", children: /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 transform transition-all duration-300 scale-100", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between p-6 border-b border-gray-200", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-3", children: [
        /* @__PURE__ */ jsx("span", { className: "text-2xl mr-2", children: "📢" }),
        /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold text-gray-900", children: "회원가입 전 꼭 확인해주세요!" })
      ] }),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: closePopup,
          className: "text-gray-400 hover:text-gray-600 transition-colors",
          children: /* @__PURE__ */ jsx(X, { className: "w-5 h-5" })
        }
      )
    ] }),
    /* @__PURE__ */ jsx("div", { className: "p-8", children: /* @__PURE__ */ jsx("div", { className: "text-center", children: /* @__PURE__ */ jsx("div", { className: "bg-white mb-4 shadow-sm", children: /* @__PURE__ */ jsxs("div", { className: "text-left space-y-4 text-md text-gray-900 leading-relaxed", children: [
      /* @__PURE__ */ jsxs("p", { className: "font-medium", children: [
        "고객님의 소중한 정보를 안전하게 보호하고, 원활한 서비스 이용을 위해 ",
        /* @__PURE__ */ jsx("strong", { className: "text-blue-700 font-bold", children: "이용약관" }),
        "과 ",
        /* @__PURE__ */ jsx("strong", { className: "text-blue-700 font-bold", children: "개인정보처리방침" }),
        "을 반드시 확인해주시기 바랍니다."
      ] }),
      /* @__PURE__ */ jsx("p", { children: "회원가입을 진행하시면 관련 약관에 동의한 것으로 간주됩니다." }),
      /* @__PURE__ */ jsx("p", { className: "font-bold text-red-700 bg-red-50 border border-red-200 px-3 py-2 rounded-md", children: "내용을 충분히 읽고 동의 여부를 신중히 결정해 주세요." })
    ] }) }) }) }),
    /* @__PURE__ */ jsx("div", { className: "px-8 pb-6", children: /* @__PURE__ */ jsx("div", { className: "flex space-x-3", children: /* @__PURE__ */ jsx(
      "button",
      {
        onClick: closePopup,
        className: `w-full py-3 px-4 rounded-lg font-semibold text-lg transition-all duration-200 transform hover:scale-105 hover:shadow-lg ${buttonPrimary}`,
        children: /* @__PURE__ */ jsx("span", { children: "확인" })
      }
    ) }) })
  ] }) }) }) });
}
const meta$8 = () => {
  return [
    { title: "Sign up - TRADING GEAR" },
    { name: "description", content: "Join the new era of AI trading" }
  ];
};
function SignUp() {
  const navigate = useNavigate$1();
  const [result, setResult] = useState(null);
  const { theme, isClient, initializeTheme } = useThemeStore();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false
  });
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [readOnly, setreadOnly] = useState(false);
  const [result2, setResult2] = useState(0);
  const idCountRef = useRef(null);
  const inputRef = useRef(null);
  const tradingCenterRef = useRef(null);
  useEffect(() => {
    initializeTheme();
  }, [initializeTheme]);
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };
  const handleSubmit = async (e) => {
    var _a;
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }
    const formData2 = new FormData(e.currentTarget);
    const value2 = (_a = idCountRef.current) == null ? void 0 : _a.value;
    const numeric = Number(value2);
    if (numeric >= 1) {
      alert("이미 가입된 아이디입니다.");
      return;
    }
    await fetch("https://tradinggear.co.kr:8081/tradinggear/member_action.php", {
      method: "POST",
      body: formData2
    });
    const email = String(formData2.get("email"));
    const fullName = String(formData2.get("fullName"));
    const nickName = String(formData2.get("nickName"));
    sessionStorage.setItem("email", email);
    sessionStorage.setItem("fullName", fullName);
    sessionStorage.setItem("nickName", nickName);
    navigate("/dashboard");
  };
  const idCheck = async () => {
    var _a, _b, _c, _d;
    const value = (_a = inputRef.current) == null ? void 0 : _a.value;
    if (value == "") {
      alert("아이디를 입력해주세요.");
      (_b = inputRef.current) == null ? void 0 : _b.focus();
      return;
    }
    const form = new URLSearchParams();
    form.append("email", value ?? "");
    const res = await fetch("https://tradinggear.co.kr:8081/tradinggear/id_check.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: form.toString()
    });
    const data1 = await res.text();
    const data3 = Number(data1);
    setResult2(data3);
    const value2 = data3;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (typeof value !== "string" || !emailRegex.test(value)) {
      setreadOnly(false);
      alert("유효한 이메일 형식이 아닙니다.");
      (_c = inputRef.current) == null ? void 0 : _c.focus();
      return;
    }
    const numeric = Number(value2);
    if (numeric == 0) {
      setreadOnly(true);
      alert("가입가능한 아이디입니다. 입력란은 읽기전용 처리됩니다.");
      return;
    } else {
      setreadOnly(false);
      alert("이미 가입된 아이디입니다.");
      (_d = inputRef.current) == null ? void 0 : _d.focus();
      return;
    }
  };
  const handleSocialSignup = (provider) => {
    console.log(`Signup with ${provider}`);
  };
  const themeClasses = theme === "dark" ? "bg-gradient-to-br from-slate-900 to-slate-800" : "bg-gradient-to-br from-slate-100 to-slate-200";
  const cardClasses = theme === "dark" ? "bg-slate-800 border-slate-700" : "bg-white border-slate-300";
  const inputClasses = theme === "dark" ? "bg-slate-700 border-slate-600 text-white placeholder-slate-400 focus:border-cyan-400 focus:ring-cyan-400" : "bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-500 focus:border-blue-500 focus:ring-blue-500";
  const textPrimary = theme === "dark" ? "text-white" : "text-slate-900";
  const textSecondary = theme === "dark" ? "text-slate-400" : "text-slate-600";
  const linkColor = theme === "dark" ? "text-cyan-400 hover:text-cyan-300" : "text-blue-600 hover:text-blue-700";
  const buttonPrimary = theme === "dark" ? "bg-gradient-to-r from-cyan-400 to-emerald-400 text-slate-900 hover:from-cyan-500 hover:to-emerald-500" : "bg-gradient-to-r from-blue-600 to-emerald-600 text-white hover:from-blue-700 hover:to-emerald-700";
  return /* @__PURE__ */ jsxs("div", { className: `min-h-screen transition-all duration-300 ${themeClasses}`, children: [
    /* @__PURE__ */ jsx(TermsWarningPopup, {}),
    /* @__PURE__ */ jsx(Header, {}),
    /* @__PURE__ */ jsx("div", { className: "h-[80px]" }),
    /* @__PURE__ */ jsx("div", { className: `min-h-screen flex items-center justify-center px-4 py-12 transition-all duration-300 ${themeClasses}`, children: /* @__PURE__ */ jsxs("div", { className: `w-full max-w-md space-y-8 p-8 rounded-2xl shadow-2xl border transition-all duration-300 ${cardClasses}`, children: [
      /* @__PURE__ */ jsx("div", { className: "text-center", children: /* @__PURE__ */ jsx("h2", { className: `text-3xl font-bold ${textPrimary}`, children: "Sign up" }) }),
      /* @__PURE__ */ jsxs("form", { className: "space-y-6", onSubmit: handleSubmit, children: [
        /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(
          "input",
          {
            id: "fullName",
            name: "fullName",
            type: "text",
            required: true,
            value: formData.fullName,
            onChange: handleInputChange,
            className: `w-full px-4 py-3 rounded-lg border transition-all duration-200 focus:ring-2 focus:ring-opacity-50 ${inputClasses}`,
            placeholder: "Full name"
          }
        ) }),
        /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(
          "input",
          {
            id: "nickName",
            name: "nickName",
            type: "text",
            required: true,
            onChange: handleInputChange,
            className: `w-full px-4 py-3 rounded-lg border transition-all duration-200 focus:ring-2 focus:ring-opacity-50 ${inputClasses}`,
            placeholder: "Nick name"
          }
        ) }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsx(
            "input",
            {
              id: "email",
              name: "email",
              type: "email",
              required: true,
              value: formData.email,
              onChange: handleInputChange,
              className: `w-[200px] px-4 py-3 rounded-lg border transition-all duration-200 focus:ring-2 focus:ring-opacity-50 ${inputClasses}`,
              placeholder: "Email",
              ref: inputRef,
              readOnly
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              className: "w-full bg-blue-600 text-white px-6 py-3 rounded",
              onClick: idCheck,
              children: "중복확인"
            }
          ),
          /* @__PURE__ */ jsx(
            "input",
            {
              id: "idCount",
              name: "idCount",
              type: "hidden",
              className: `w-full px-4 py-3 rounded-lg border transition-all duration-200 focus:ring-2 focus:ring-opacity-50 ${inputClasses}`,
              value: result2,
              ref: idCountRef
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ jsx(
            "input",
            {
              id: "password",
              name: "password",
              type: showPassword ? "text" : "password",
              required: true,
              value: password,
              onChange: (e) => setPassword(e.target.value),
              className: `w-full px-4 py-3 pr-12 rounded-lg border transition-all duration-200 focus:ring-2 focus:ring-opacity-50 ${inputClasses}`,
              placeholder: "Password"
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              className: `absolute right-3 top-1/2 transform -translate-y-1/2 ${textSecondary} hover:${textPrimary} transition-colors`,
              onClick: () => setShowPassword(!showPassword),
              children: showPassword ? /* @__PURE__ */ jsx("svg", { className: "w-5 h-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" }) }) : /* @__PURE__ */ jsxs("svg", { className: "w-5 h-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: [
                /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M15 12a3 3 0 11-6 0 3 3 0 016 0z" }),
                /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" })
              ] })
            }
          ),
          error && /* @__PURE__ */ jsx("p", { style: { color: "red" }, children: error })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ jsx(
            "input",
            {
              id: "confirmPassword",
              name: "confirmPassword",
              type: showConfirmPassword ? "text" : "password",
              required: true,
              value: confirmPassword,
              onChange: (e) => setConfirmPassword(e.target.value),
              className: `w-full px-4 py-3 pr-12 rounded-lg border transition-all duration-200 focus:ring-2 focus:ring-opacity-50 ${inputClasses}`,
              placeholder: "Confirm password"
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              className: `absolute right-3 top-1/2 transform -translate-y-1/2 ${textSecondary} hover:${textPrimary} transition-colors`,
              onClick: () => setShowConfirmPassword(!showConfirmPassword),
              children: showConfirmPassword ? /* @__PURE__ */ jsx("svg", { className: "w-5 h-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" }) }) : /* @__PURE__ */ jsxs("svg", { className: "w-5 h-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: [
                /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M15 12a3 3 0 11-6 0 3 3 0 016 0z" }),
                /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" })
              ] })
            }
          ),
          error && /* @__PURE__ */ jsx("p", { style: { color: "red" }, children: error })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("input", { type: "hidden", id: "tradingCenterSet", name: "tradingCenterSet" }),
          /* @__PURE__ */ jsxs(
            "select",
            {
              id: "tradingCenter",
              name: "tradingCenter",
              className: `w-full px-4 py-3 pr-12 rounded-lg border transition-all duration-200 focus:ring-2 focus:ring-opacity-50 ${inputClasses}`,
              required: true,
              ref: tradingCenterRef,
              children: [
                /* @__PURE__ */ jsx("option", { value: "", selected: true, children: "Trading Center" }),
                /* @__PURE__ */ jsx("option", { value: "binance", children: "바이낸스" }),
                /* @__PURE__ */ jsx("option", { value: "kium", children: "키움증권" })
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center", children: [
          /* @__PURE__ */ jsx(
            "input",
            {
              id: "agreeToTerms",
              name: "agreeToTerms",
              type: "checkbox",
              required: true,
              checked: formData.agreeToTerms,
              onChange: handleInputChange,
              className: `h-4 w-4 rounded border-2 ${theme === "dark" ? "border-slate-600 bg-slate-700 text-cyan-400 focus:ring-cyan-400" : "border-slate-300 bg-white text-blue-600 focus:ring-blue-500"} focus:ring-2 focus:ring-opacity-50`
            }
          ),
          /* @__PURE__ */ jsxs("label", { htmlFor: "agreeToTerms", className: `ml-3 text-sm ${textSecondary}`, children: [
            /* @__PURE__ */ jsx("a", { href: "/terms", className: `${linkColor} underline`, children: "이용약관" }),
            "과",
            " ",
            /* @__PURE__ */ jsx("a", { href: "/privacy", className: `${linkColor} underline`, children: "개인정보처리방침" }),
            "에 동의합니다."
          ] })
        ] }),
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "submit",
            className: `w-full py-3 px-4 rounded-lg font-semibold text-lg transition-all duration-200 transform hover:scale-105 hover:shadow-lg ${buttonPrimary}`,
            children: "Sign up"
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "relative", children: [
        /* @__PURE__ */ jsx("div", { className: "absolute inset-0 flex items-center", children: /* @__PURE__ */ jsx("div", { className: `w-full border-t ${theme === "dark" ? "border-slate-600" : "border-slate-300"}` }) }),
        /* @__PURE__ */ jsx("div", { className: "relative flex justify-center text-sm", children: /* @__PURE__ */ jsx("span", { className: `px-4 ${theme === "dark" ? "bg-slate-800" : "bg-white"} ${textSecondary}`, children: "Or" }) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-4 gap-3", children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => handleSocialSignup("google"),
            className: `flex justify-center items-center p-3 rounded-lg border transition-all duration-200 hover:scale-105 ${theme === "dark" ? "border-slate-600 bg-slate-700 hover:bg-slate-600" : "border-slate-300 bg-white hover:bg-slate-50"}`,
            children: /* @__PURE__ */ jsxs("svg", { className: "w-5 h-5", viewBox: "0 0 24 24", children: [
              /* @__PURE__ */ jsx("path", { fill: "#4285F4", d: "M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" }),
              /* @__PURE__ */ jsx("path", { fill: "#34A853", d: "M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" }),
              /* @__PURE__ */ jsx("path", { fill: "#FBBC05", d: "M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" }),
              /* @__PURE__ */ jsx("path", { fill: "#EA4335", d: "M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" })
            ] })
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => handleSocialSignup("apple"),
            className: `flex justify-center items-center p-3 rounded-lg border transition-all duration-200 hover:scale-105 ${theme === "dark" ? "border-slate-600 bg-slate-700 hover:bg-slate-600" : "border-slate-300 bg-white hover:bg-slate-50"}`,
            children: /* @__PURE__ */ jsx("svg", { className: "w-5 h-5", fill: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { d: "M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" }) })
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => handleSocialSignup("facebook"),
            className: `flex justify-center items-center p-3 rounded-lg border transition-all duration-200 hover:scale-105 ${theme === "dark" ? "border-slate-600 bg-slate-700 hover:bg-slate-600" : "border-slate-300 bg-white hover:bg-slate-50"}`,
            children: /* @__PURE__ */ jsx("svg", { className: "w-5 h-5", fill: "#1877F2", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { d: "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" }) })
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => handleSocialSignup("github"),
            className: `flex justify-center items-center p-3 rounded-lg border transition-all duration-200 hover:scale-105 ${theme === "dark" ? "border-slate-600 bg-slate-700 hover:bg-slate-600" : "border-slate-300 bg-white hover:bg-slate-50"}`,
            children: /* @__PURE__ */ jsx("svg", { className: "w-5 h-5", fill: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { d: "M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" }) })
          }
        )
      ] }),
      /* @__PURE__ */ jsx("div", { className: "text-center", children: /* @__PURE__ */ jsxs("span", { className: `text-sm ${textSecondary}`, children: [
        "Already have an account?",
        " ",
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => navigate("/login"),
            className: `font-medium ${linkColor} transition-colors`,
            children: "Log in"
          }
        )
      ] }) })
    ] }) }),
    /* @__PURE__ */ jsx(Footer, { onLinkClick: (linkName) => linkName })
  ] });
}
const route60 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: SignUp,
  meta: meta$8
}, Symbol.toStringTag, { value: "Module" }));
const meta$7 = () => {
  return [
    { title: "회사소개 - TRADING GEAR" },
    { name: "description", content: "Trading Gear 회사소개" }
  ];
};
function About$1() {
  const { theme, initializeTheme } = useThemeStore();
  useEffect(() => {
    initializeTheme();
  }, [initializeTheme]);
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };
  const themeClasses = theme === "dark" ? "bg-gradient-to-br from-slate-900 to-slate-800 text-white" : "bg-gradient-to-br from-white to-slate-50 text-slate-900";
  const textPrimary = theme === "dark" ? "text-white" : "text-slate-900";
  const textSecondary = theme === "dark" ? "text-slate-300" : "text-slate-600";
  const primaryColor = theme === "dark" ? "text-cyan-400" : "text-blue-600";
  return /* @__PURE__ */ jsxs("div", { className: `min-h-screen transition-all duration-300 ${themeClasses}`, children: [
    /* @__PURE__ */ jsx(Header, { scrollToSection }),
    /* @__PURE__ */ jsxs("section", { className: "min-h-screen flex items-center justify-center text-center relative overflow-hidden pt-20", id: "home", children: [
      /* @__PURE__ */ jsx("div", { className: `absolute inset-0 ${theme === "dark" ? "bg-gradient-radial from-cyan-400/10" : "bg-gradient-radial from-blue-600/10"} to-transparent` }),
      /* @__PURE__ */ jsxs("div", { className: "max-w-4xl mx-auto px-4 lg:px-8", children: [
        /* @__PURE__ */ jsx("h1", { className: `text-4xl lg:text-6xl font-bold mb-6 ${theme === "dark" ? "bg-gradient-to-r from-white to-cyan-400" : "bg-gradient-to-r from-slate-900 to-blue-600"} bg-clip-text text-transparent`, children: "Trading Gear 회사소개" }),
        /* @__PURE__ */ jsxs("p", { className: `text-xl lg:text-2xl ${textSecondary} mb-8 leading-relaxed`, children: [
          "혁신적인 AI 트레이딩 솔루션으로 금융의 미래를 만들어갑니다.",
          /* @__PURE__ */ jsx("br", {}),
          "2019년부터 시작된 우리의 여정을 소개합니다."
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx("section", { className: `py-20 ${theme === "dark" ? "bg-gradient-to-b from-transparent to-slate-800/30" : "bg-gradient-to-b from-transparent to-slate-100/50"}`, children: /* @__PURE__ */ jsxs("div", { className: "max-w-6xl mx-auto px-4 lg:px-8", children: [
      /* @__PURE__ */ jsx("h2", { className: `text-3xl lg:text-5xl font-bold text-center mb-16 ${textPrimary}`, children: "우리의 이야기" }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-12 items-center", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h3", { className: `text-2xl font-bold mb-6 ${primaryColor}`, children: "미션" }),
          /* @__PURE__ */ jsx("p", { className: `${textSecondary} text-lg leading-relaxed mb-8`, children: "모든 투자자가 전문가 수준의 트레이딩 도구를 쉽게 사용할 수 있도록 하여, 금융 시장의 민주화를 실현하는 것입니다." }),
          /* @__PURE__ */ jsx("h3", { className: `text-2xl font-bold mb-6 ${primaryColor}`, children: "비전" }),
          /* @__PURE__ */ jsx("p", { className: `${textSecondary} text-lg leading-relaxed`, children: "AI와 머신러닝 기술을 활용하여 투자의 패러다임을 바꾸고, 누구나 스마트한 투자 결정을 내릴 수 있는 세상을 만들어 나가겠습니다." })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: `${theme === "dark" ? "bg-slate-800/60 border-cyan-400/20" : "bg-white/90 border-blue-600/20"} border rounded-2xl p-8`, children: [
          /* @__PURE__ */ jsx("h3", { className: `text-2xl font-bold mb-6 ${primaryColor}`, children: "핵심 가치" }),
          /* @__PURE__ */ jsxs("ul", { className: `${textSecondary} space-y-4`, children: [
            /* @__PURE__ */ jsxs("li", { className: "flex items-start", children: [
              /* @__PURE__ */ jsx("span", { className: "text-2xl mr-3", children: "🚀" }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("strong", { className: textPrimary, children: "혁신" }),
                /* @__PURE__ */ jsx("br", {}),
                "끊임없는 기술 혁신으로 최고의 서비스를 제공합니다."
              ] })
            ] }),
            /* @__PURE__ */ jsxs("li", { className: "flex items-start", children: [
              /* @__PURE__ */ jsx("span", { className: "text-2xl mr-3", children: "🔒" }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("strong", { className: textPrimary, children: "신뢰" }),
                /* @__PURE__ */ jsx("br", {}),
                "투명하고 안전한 거래 환경을 조성합니다."
              ] })
            ] }),
            /* @__PURE__ */ jsxs("li", { className: "flex items-start", children: [
              /* @__PURE__ */ jsx("span", { className: "text-2xl mr-3", children: "🤝" }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("strong", { className: textPrimary, children: "고객 중심" }),
                /* @__PURE__ */ jsx("br", {}),
                "고객의 성공이 우리의 성공입니다."
              ] })
            ] })
          ] })
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsx(Footer, { onLinkClick: (linkName) => console.log(`About 페이지 Footer 링크 클릭: ${linkName}`) })
  ] });
}
const route61 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: About$1,
  meta: meta$7
}, Symbol.toStringTag, { value: "Module" }));
function Logout() {
  const navigate = useNavigate$1();
  const hasLoggedOut = useRef(false);
  useEffect(() => {
    if (!hasLoggedOut.current) {
      sessionStorage.clear();
      sessionStorage.removeItem("email");
      sessionStorage.removeItem("fullName");
      sessionStorage.removeItem("nickName");
      alert("로그아웃 되었습니다.");
      hasLoggedOut.current = true;
      navigate("/login");
    }
  }, []);
  return null;
}
const route62 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Logout
}, Symbol.toStringTag, { value: "Module" }));
const meta$6 = () => {
  return [
    { title: "리뷰 - TRADING GEAR" },
    { name: "review", content: "AI 트레이딩의 새로운 시대" }
  ];
};
function CaseStudies() {
  const { theme, initializeTheme } = useThemeStore();
  const [activeTab, setActiveTab] = useState("all");
  useEffect(() => {
    initializeTheme();
  }, [initializeTheme]);
  const bgPrimary = theme === "dark" ? "bg-[#1a1f36]" : "bg-[#f8fafc]";
  const bgSecondary = theme === "dark" ? "bg-gray-800/50" : "bg-white/80";
  const textPrimary = theme === "dark" ? "text-white" : "text-slate-900";
  const textSecondary = theme === "dark" ? "text-gray-300" : "text-slate-600";
  const textTertiary = theme === "dark" ? "text-gray-400" : "text-slate-500";
  const primaryColor = theme === "dark" ? "#00d4ff" : "#0066cc";
  const accentColor = theme === "dark" ? "#00ff88" : "#00b894";
  const borderColor = theme === "dark" ? "border-gray-700" : "border-slate-200";
  const hoverBorder = theme === "dark" ? "hover:border-[#00d4ff]/50" : "hover:border-[#0066cc]/50";
  const caseStudies = [
    {
      id: 1,
      category: "institutional",
      title: "대형 헤지펀드 A사",
      subtitle: "자산 규모: 500억원",
      period: "2024.01 - 2024.12",
      strategy: "다중 전략 포트폴리오",
      results: {
        return: "+34.7%",
        sharpe: "2.31",
        mdd: "-4.2%",
        winRate: "73.8%"
      },
      highlights: [
        "연간 수익률 34.7% 달성",
        "최대 손실 4.2%로 안정적 운용",
        "샤프 비율 2.31 기록",
        "전략 다각화로 리스크 분산"
      ],
      description: "기존 수동 거래에서 AI 자동화 시스템으로 전환하여 운용 효율성을 크게 개선했습니다. 특히 변동성이 큰 시장에서도 안정적인 수익을 창출할 수 있었습니다.",
      image: "/api/placeholder/400/300"
    },
    {
      id: 2,
      category: "retail",
      title: "개인투자자 김○○님",
      subtitle: "자산 규모: 1억원",
      period: "2024.03 - 2024.12",
      strategy: "그리드 트레이딩 + DCA",
      results: {
        return: "+28.5%",
        sharpe: "1.87",
        mdd: "-7.1%",
        winRate: "68.2%"
      },
      highlights: [
        "직장인 투자자 최적화된 전략",
        "감정적 거래 완전 차단",
        "월 평균 2.4% 안정적 수익",
        "시간 투자 최소화 (일 10분)"
      ],
      description: "직장 업무로 인해 시장 모니터링이 어려웠던 개인투자자가 자동화 시스템을 통해 안정적인 수익을 달성한 사례입니다.",
      image: "/api/placeholder/400/300"
    },
    {
      id: 3,
      category: "corporate",
      title: "중소기업 B사 자금운용",
      subtitle: "자산 규모: 50억원",
      period: "2024.02 - 2024.12",
      strategy: "안전자산 중심 운용",
      results: {
        return: "+18.9%",
        sharpe: "2.05",
        mdd: "-2.8%",
        winRate: "81.3%"
      },
      highlights: [
        "기업 유휴자금 효율적 운용",
        "극도로 안전한 포트폴리오",
        "예금 대비 15배 수익률",
        "실시간 리스크 관리"
      ],
      description: "보수적인 투자 성향의 기업 자금을 안전하게 운용하면서도 예금 대비 높은 수익률을 달성했습니다.",
      image: "/api/placeholder/400/300"
    }
  ];
  const testimonials = [
    {
      id: 1,
      name: "이○○",
      role: "헤지펀드 포트폴리오 매니저",
      company: "○○○ 자산운용",
      rating: 5,
      content: "Trading Gear의 AI 알고리즘은 정말 놀라웠습니다. 기존 수동 거래 대비 수익률이 40% 이상 향상되었고, 특히 변동성 관리 능력이 뛰어납니다. 이제 더 이상 밤새 차트를 보지 않아도 됩니다.",
      results: "+42.3% 수익률 달성",
      image: "/api/placeholder/100/100"
    },
    {
      id: 2,
      name: "박○○",
      role: "개인투자자",
      company: "직장인 투자자",
      rating: 5,
      content: "직장 다니면서 투자하기 정말 어려웠는데, 자동화 시스템 덕분에 스트레스 없이 투자할 수 있게 되었습니다. 감정적 거래가 완전히 사라지니 수익이 더 안정적이에요.",
      results: "+31.7% 수익률 달성",
      image: "/api/placeholder/100/100"
    },
    {
      id: 3,
      name: "정○○",
      role: "재무이사",
      company: "중소기업 C사",
      rating: 5,
      content: "회사 유휴자금을 안전하게 운용하면서도 높은 수익을 얻을 수 있어서 매우 만족합니다. 실시간 모니터링과 리스크 관리 기능이 특히 인상적입니다.",
      results: "+23.8% 수익률 달성",
      image: "/api/placeholder/100/100"
    }
  ];
  const performanceData = [
    { metric: "평균 연간 수익률", value: "27.4%", benchmark: "코스피: 8.2%" },
    { metric: "평균 샤프 비율", value: "2.08", benchmark: "일반 펀드: 0.85" },
    { metric: "평균 최대 손실률", value: "4.7%", benchmark: "코스피: 18.3%" },
    { metric: "승률", value: "74.1%", benchmark: "일반 투자자: 35%" },
    { metric: "월 평균 수익률", value: "2.2%", benchmark: "은행 예금: 0.3%" }
  ];
  const filteredCaseStudies = activeTab === "all" ? caseStudies : caseStudies.filter((study) => study.category === activeTab);
  return /* @__PURE__ */ jsxs("div", { className: `min-h-screen ${bgPrimary} ${textPrimary}`, children: [
    /* @__PURE__ */ jsx(Header, {}),
    /* @__PURE__ */ jsxs("div", { className: "pt-20", children: [
      /* @__PURE__ */ jsxs("div", { className: "relative overflow-hidden", children: [
        /* @__PURE__ */ jsx("div", { className: `absolute inset-0 ${theme === "dark" ? "bg-gradient-to-br from-cyan-500/10 via-blue-500/10 to-emerald-500/10" : "bg-gradient-to-br from-blue-100/50 via-cyan-50/50 to-emerald-50/50"}` }),
        /* @__PURE__ */ jsx("div", { className: "relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20", children: /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
          /* @__PURE__ */ jsx("h1", { className: `text-4xl md:text-6xl font-bold mb-6 ${theme === "dark" ? "bg-gradient-to-r from-[#00d4ff] via-cyan-400 to-[#00ff88]" : "bg-gradient-to-r from-[#0066cc] via-blue-500 to-[#00b894]"} bg-clip-text text-transparent`, children: "고객 성공 사례" }),
          /* @__PURE__ */ jsx("p", { className: `text-xl md:text-2xl ${textSecondary} mb-8 max-w-3xl mx-auto`, children: "실제 운용 데이터와 고객 경험을 통해 확인하는 Trading Gear의 성과" }),
          /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap justify-center gap-8 text-center", children: [
            /* @__PURE__ */ jsxs("div", { className: `${bgSecondary} backdrop-blur-sm rounded-lg p-6 border ${borderColor}`, children: [
              /* @__PURE__ */ jsx("div", { className: "text-3xl font-bold mb-2", style: { color: primaryColor }, children: "500+" }),
              /* @__PURE__ */ jsx("div", { className: textTertiary, children: "성공적인 고객사" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: `${bgSecondary} backdrop-blur-sm rounded-lg p-6 border ${borderColor}`, children: [
              /* @__PURE__ */ jsx("div", { className: "text-3xl font-bold mb-2", style: { color: accentColor }, children: "27.4%" }),
              /* @__PURE__ */ jsx("div", { className: textTertiary, children: "평균 연간 수익률" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: `${bgSecondary} backdrop-blur-sm rounded-lg p-6 border ${borderColor}`, children: [
              /* @__PURE__ */ jsx("div", { className: "text-3xl font-bold mb-2", style: { color: primaryColor }, children: "2.08" }),
              /* @__PURE__ */ jsx("div", { className: textTertiary, children: "평균 샤프 비율" })
            ] })
          ] })
        ] }) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16", children: [
        /* @__PURE__ */ jsxs("div", { className: "text-center mb-12", children: [
          /* @__PURE__ */ jsx("h2", { className: `text-3xl font-bold mb-4 ${textPrimary}`, children: "전체 성과 요약" }),
          /* @__PURE__ */ jsx("p", { className: `${textSecondary} text-lg`, children: "벤치마크 대비 우수한 성과를 확인하세요" })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6", children: performanceData.map((data, index) => /* @__PURE__ */ jsxs("div", { className: `${bgSecondary} backdrop-blur-sm rounded-lg p-6 border ${borderColor} ${hoverBorder} transition-all duration-300`, children: [
          /* @__PURE__ */ jsx("div", { className: "text-2xl font-bold mb-2", style: { color: primaryColor }, children: data.value }),
          /* @__PURE__ */ jsx("div", { className: `${textSecondary} font-medium mb-2`, children: data.metric }),
          /* @__PURE__ */ jsx("div", { className: `text-sm ${textTertiary}`, children: data.benchmark })
        ] }, index)) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16", children: [
        /* @__PURE__ */ jsxs("div", { className: "text-center mb-12", children: [
          /* @__PURE__ */ jsx("h2", { className: `text-3xl font-bold mb-4 ${textPrimary}`, children: "실제 운용 사례" }),
          /* @__PURE__ */ jsx("p", { className: `${textSecondary} text-lg`, children: "다양한 고객층의 성공 스토리" })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "flex flex-wrap justify-center gap-4 mb-12", children: [
          { key: "all", label: "전체" },
          { key: "institutional", label: "기관투자자" },
          { key: "retail", label: "개인투자자" },
          { key: "corporate", label: "기업" }
        ].map((tab) => /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => setActiveTab(tab.key),
            className: `px-6 py-3 rounded-lg font-medium transition-all duration-300 ${activeTab === tab.key ? theme === "dark" ? "bg-[#00d4ff] text-black shadow-lg shadow-[#00d4ff]/25" : "bg-[#0066cc] text-white shadow-lg shadow-[#0066cc]/25" : theme === "dark" ? "bg-gray-800 text-gray-300 hover:bg-gray-700" : "bg-white text-slate-600 hover:bg-slate-50 border border-slate-200"}`,
            children: tab.label
          },
          tab.key
        )) }),
        /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8", children: filteredCaseStudies.map((study) => /* @__PURE__ */ jsx("div", { className: `${bgSecondary} backdrop-blur-sm rounded-lg border ${borderColor} ${hoverBorder} transition-all duration-300 overflow-hidden`, children: /* @__PURE__ */ jsxs("div", { className: "p-6", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-4", children: [
            /* @__PURE__ */ jsx("h3", { className: "text-xl font-bold", style: { color: primaryColor }, children: study.title }),
            /* @__PURE__ */ jsx(Award, { className: "w-6 h-6", style: { color: accentColor } })
          ] }),
          /* @__PURE__ */ jsx("p", { className: `${textSecondary} mb-2`, children: study.subtitle }),
          /* @__PURE__ */ jsx("p", { className: `text-sm ${textTertiary} mb-4`, children: study.period }),
          /* @__PURE__ */ jsx("div", { className: `${theme === "dark" ? "bg-gray-900/50" : "bg-slate-100/50"} rounded-lg p-4 mb-4`, children: /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
            /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
              /* @__PURE__ */ jsx("div", { className: "text-2xl font-bold", style: { color: accentColor }, children: study.results.return }),
              /* @__PURE__ */ jsx("div", { className: `text-sm ${textTertiary}`, children: "수익률" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
              /* @__PURE__ */ jsx("div", { className: "text-2xl font-bold", style: { color: primaryColor }, children: study.results.sharpe }),
              /* @__PURE__ */ jsx("div", { className: `text-sm ${textTertiary}`, children: "샤프 비율" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
              /* @__PURE__ */ jsx("div", { className: "text-2xl font-bold text-yellow-400", children: study.results.mdd }),
              /* @__PURE__ */ jsx("div", { className: `text-sm ${textTertiary}`, children: "최대 손실" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
              /* @__PURE__ */ jsx("div", { className: "text-2xl font-bold text-purple-400", children: study.results.winRate }),
              /* @__PURE__ */ jsx("div", { className: `text-sm ${textTertiary}`, children: "승률" })
            ] })
          ] }) }),
          /* @__PURE__ */ jsxs("div", { className: "mb-4", children: [
            /* @__PURE__ */ jsx("h4", { className: `font-semibold ${textSecondary} mb-2`, children: "주요 성과" }),
            /* @__PURE__ */ jsx("ul", { className: `text-sm ${textTertiary} space-y-1`, children: study.highlights.map((highlight, index) => /* @__PURE__ */ jsxs("li", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsx(ChevronRight, { className: "w-4 h-4", style: { color: primaryColor } }),
              highlight
            ] }, index)) })
          ] }),
          /* @__PURE__ */ jsx("p", { className: `text-sm ${textTertiary} mb-4`, children: study.description }),
          /* @__PURE__ */ jsxs("div", { className: `rounded-lg p-3 border ${theme === "dark" ? "bg-[#00d4ff]/20 border-[#00d4ff]/30" : "bg-[#0066cc]/20 border-[#0066cc]/30"}`, children: [
            /* @__PURE__ */ jsx("div", { className: "text-sm font-medium", style: { color: primaryColor }, children: "사용 전략" }),
            /* @__PURE__ */ jsx("div", { className: `text-sm ${textSecondary}`, children: study.strategy })
          ] })
        ] }) }, study.id)) })
      ] }),
      /* @__PURE__ */ jsx("div", { className: `${theme === "dark" ? "bg-gray-800/50" : "bg-slate-50"} backdrop-blur-sm py-16`, children: /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", children: [
        /* @__PURE__ */ jsxs("div", { className: "text-center mb-12", children: [
          /* @__PURE__ */ jsx("h2", { className: `text-3xl font-bold mb-4 ${textPrimary}`, children: "고객 후기" }),
          /* @__PURE__ */ jsx("p", { className: `${textSecondary} text-lg`, children: "실제 고객들의 생생한 경험담" })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8", children: testimonials.map((testimonial) => /* @__PURE__ */ jsxs("div", { className: `${bgSecondary} backdrop-blur-sm rounded-lg p-6 border ${borderColor} ${hoverBorder} transition-all duration-300`, children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center mb-4", children: [
            /* @__PURE__ */ jsx(
              "img",
              {
                src: testimonial.image,
                alt: testimonial.name,
                className: "w-12 h-12 rounded-full mr-4"
              }
            ),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("h4", { className: `font-semibold ${textSecondary}`, children: testimonial.name }),
              /* @__PURE__ */ jsx("p", { className: `text-sm ${textTertiary}`, children: testimonial.role }),
              /* @__PURE__ */ jsx("p", { className: `text-sm ${textTertiary}`, children: testimonial.company })
            ] })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "flex mb-4", children: [...Array(testimonial.rating)].map((_, i) => /* @__PURE__ */ jsx(Star, { className: "w-5 h-5 text-yellow-400 fill-current" }, i)) }),
          /* @__PURE__ */ jsxs("p", { className: `${textSecondary} mb-4 italic`, children: [
            '"',
            testimonial.content,
            '"'
          ] }),
          /* @__PURE__ */ jsxs("div", { className: `rounded-lg p-3 border ${theme === "dark" ? "bg-green-600/20 border-green-500/30" : "bg-emerald-50 border-emerald-200"}`, children: [
            /* @__PURE__ */ jsx("div", { className: `text-sm font-medium ${theme === "dark" ? "text-green-400" : "text-emerald-600"}`, children: "달성 성과" }),
            /* @__PURE__ */ jsx("div", { className: `text-sm ${textSecondary}`, children: testimonial.results })
          ] })
        ] }, testimonial.id)) })
      ] }) }),
      /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16", children: [
        /* @__PURE__ */ jsxs("div", { className: "text-center mb-12", children: [
          /* @__PURE__ */ jsx("h2", { className: `text-3xl font-bold mb-4 ${textPrimary}`, children: "숫자로 보는 성과" }),
          /* @__PURE__ */ jsx("p", { className: `${textSecondary} text-lg`, children: "데이터가 증명하는 Trading Gear의 우수성" })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8", children: [
          {
            icon: /* @__PURE__ */ jsx(TrendingUp, { className: "w-8 h-8", style: { color: accentColor } }),
            value: "98.7%",
            label: "고객 만족도",
            description: "500+ 고객 설문조사 결과"
          },
          {
            icon: /* @__PURE__ */ jsx(BarChart3, { className: "w-8 h-8", style: { color: primaryColor } }),
            value: "74.1%",
            label: "평균 승률",
            description: "전체 거래 중 수익 거래 비중"
          },
          {
            icon: /* @__PURE__ */ jsx(Shield, { className: "w-8 h-8 text-purple-400" }),
            value: "4.7%",
            label: "평균 최대 손실률",
            description: "안정적인 리스크 관리"
          },
          {
            icon: /* @__PURE__ */ jsx(Target, { className: "w-8 h-8 text-pink-400" }),
            value: "36개월",
            label: "평균 고객 유지",
            description: "높은 고객 충성도"
          }
        ].map((stat, index) => /* @__PURE__ */ jsxs("div", { className: `${bgSecondary} backdrop-blur-sm rounded-lg p-6 border ${borderColor} text-center ${hoverBorder} transition-all duration-300`, children: [
          /* @__PURE__ */ jsx("div", { className: "flex justify-center mb-4", children: stat.icon }),
          /* @__PURE__ */ jsx("div", { className: "text-3xl font-bold mb-2", style: { color: primaryColor }, children: stat.value }),
          /* @__PURE__ */ jsx("div", { className: `text-lg font-semibold ${textSecondary} mb-2`, children: stat.label }),
          /* @__PURE__ */ jsx("div", { className: `text-sm ${textTertiary}`, children: stat.description })
        ] }, index)) })
      ] }),
      /* @__PURE__ */ jsx("div", { className: `py-16 bg-gradient-to-r from-[#0066cc] to-[#00b894]`, children: /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center", children: [
        /* @__PURE__ */ jsx("h2", { className: `text-3xl font-bold mb-4 text-white`, children: "당신도 성공 사례의 주인공이 되세요" }),
        /* @__PURE__ */ jsx("p", { className: `text-xl mb-8 text-blue-100`, children: "7일 무료 체험으로 Trading Gear의 성과를 직접 경험해보세요" }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row justify-center gap-4", children: [
          /* @__PURE__ */ jsx("button", { className: `px-8 py-3 rounded-lg font-semibold transition-colors duration-300 bg-white text-[#0066cc] hover:bg-gray-100`, children: "무료 체험 시작" }),
          /* @__PURE__ */ jsx("button", { className: `border-2 border-white text-white px-8 py-3 rounded-lg font-semibold transition-colors duration-300 bg-transparent hover:bg-white hover:text-[#0066cc]`, children: "상담 신청" })
        ] })
      ] }) })
    ] }),
    " ",
    /* @__PURE__ */ jsx(Footer, { onLinkClick: (linkName) => linkName })
  ] });
}
const route63 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: CaseStudies,
  meta: meta$6
}, Symbol.toStringTag, { value: "Module" }));
const meta$5 = () => {
  return [
    { title: "TRADING GEAR" },
    { name: "description", content: "AI 트레이딩의 새로운 시대" }
  ];
};
function Index() {
  const navigate = useNavigate();
  const { theme, isClient, initializeTheme } = useThemeStore();
  const [modalImg, setModalImg] = useState(null);
  const images = ["/chart.png"];
  useEffect(() => {
    initializeTheme();
  }, [initializeTheme]);
  const Particle = ({ index }) => /* @__PURE__ */ jsx(
    "div",
    {
      className: `absolute w-1 h-1 rounded-full opacity-10 pointer-events-none animate-pulse
        ${theme === "dark" ? "bg-cyan-400" : "bg-blue-600"}`,
      style: {
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        animationDelay: `${Math.random() * 6}s`,
        animationDuration: `${Math.random() * 4 + 4}s`
      }
    }
  );
  const themeClasses = theme === "dark" ? "bg-gradient-to-br from-slate-900 to-slate-800 text-white" : "bg-gradient-to-br from-white to-slate-50 text-slate-900";
  const textPrimary = theme === "dark" ? "text-white" : "text-slate-900";
  const textSecondary = theme === "dark" ? "text-slate-300" : "text-slate-600";
  const accentColor = theme === "dark" ? "text-emerald-400" : "text-emerald-600";
  return /* @__PURE__ */ jsxs("div", { className: `min-h-screen transition-all duration-300 ${themeClasses}`, children: [
    isClient && Array.from({ length: 5 }, (_, i) => /* @__PURE__ */ jsx(Particle, { index: i }, i)),
    /* @__PURE__ */ jsx(Header, {}),
    /* @__PURE__ */ jsxs(
      "section",
      {
        className: "min-h-screen flex items-center justify-center text-center relative overflow-hidden pt-20",
        id: "home",
        children: [
          /* @__PURE__ */ jsx(
            "div",
            {
              className: `absolute inset-0 ${theme === "dark" ? "bg-gradient-to-b from-transparent to-slate-800/30" : "bg-gradient-to-b from-transparent to-slate-200/50"} to-transparent`
            }
          ),
          /* @__PURE__ */ jsxs("div", { className: "max-w-4xl mx-auto px-4 lg:px-8 animate-pulse", children: [
            /* @__PURE__ */ jsxs(
              "h1",
              {
                className: `text-4xl lg:text-6xl font-bold mb-6 ${theme === "dark" ? "bg-gradient-to-r from-white to-cyan-400" : "bg-gradient-to-r from-slate-900 to-blue-600"} bg-clip-text text-transparent`,
                children: [
                  "실시간 거래소 데이터를 ",
                  /* @__PURE__ */ jsx("br", {}),
                  "나만의 트레이딩 차트로"
                ]
              }
            ),
            /* @__PURE__ */ jsxs(
              "p",
              {
                className: `text-xl lg:text-2xl ${textSecondary} mb-8 leading-relaxed`,
                children: [
                  "TradingGear 차트 프로그램은 사용자의 거래소 API 연결만으로",
                  /* @__PURE__ */ jsx("br", {}),
                  " 실시간 시세·호가 데이터를 분석 가능한 차트로 제공합니다.",
                  /* @__PURE__ */ jsx("br", {}),
                  /* @__PURE__ */ jsx("span", { className: "text-sm lg:text-base", children: "투자 판단은 사용자의 몫이며, 트레이딩기어는 최적의 시각화만 제공합니다." }),
                  /* @__PURE__ */ jsx("br", {})
                ]
              }
            ),
            /* @__PURE__ */ jsx("div", { className: "mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto px-4 lg:px-4", children: [
              {
                icon: "⚡",
                title: "실시간 데이터 반영",
                desc: "거래소와 직접 연동되어 즉시 반영됩니다."
              },
              {
                icon: "🔒",
                title: "안전한 API 관리",
                desc: "API Key는 로컬에서만 사용하여 안전하게 보호합니다."
              },
              {
                icon: "📊",
                title: "강력한 차트 기능",
                desc: "다양한 지표와 사용자 맞춤 레이아웃을 제공합니다."
              },
              {
                icon: "💻",
                title: "간단한 설치",
                desc: "다운로드 후 즉시 실행 가능하여 빠르게 시작할 수 있습니다."
              }
            ].map((item, idx) => /* @__PURE__ */ jsxs(
              "div",
              {
                className: `rounded-2xl p-3 text-center backdrop-blur-lg transition-all duration-300 hover:-translate-y-1
        ${theme === "dark" ? "bg-slate-950/80 border border-slate-700/60 shadow-lg shadow-cyan-400/5 hover:shadow-cyan-400/10 text-slate-100" : "bg-white/90 border border-blue-200/30 shadow-md hover:shadow-xl text-slate-900"}`,
                children: [
                  /* @__PURE__ */ jsx("div", { className: "text-4xl mb-4 opacity-90", children: item.icon }),
                  /* @__PURE__ */ jsx("h3", { className: "font-semibold text-lg mb-2", children: item.title }),
                  /* @__PURE__ */ jsx(
                    "p",
                    {
                      className: theme === "dark" ? "text-slate-300" : "text-slate-700",
                      children: item.desc
                    }
                  )
                ]
              },
              idx
            )) }),
            /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row justify-center gap-4 pt-10", children: [
              /* @__PURE__ */ jsx(
                "button",
                {
                  className: `${theme === "dark" ? "bg-gradient-to-r from-cyan-400 to-emerald-400 text-slate-900 hover:shadow-cyan-400/30" : "bg-gradient-to-r from-blue-600 to-emerald-600 text-white hover:shadow-blue-600/30"} px-8 py-4 rounded-full font-bold text-lg hover:transform hover:-translate-y-1 hover:shadow-xl transition-all duration-300`,
                  onClick: () => navigate("/login"),
                  children: "다운로드"
                }
              ),
              /* @__PURE__ */ jsx(
                "button",
                {
                  className: `border-2 ${theme === "dark" ? "border-cyan-400 text-cyan-400 hover:bg-cyan-400" : "border-blue-600 text-blue-600 hover:bg-blue-600"} hover:text-slate-900 px-8 py-4 rounded-full font-bold text-lg transition-all duration-300`,
                  onClick: () => navigate("/login"),
                  children: "차트 보기"
                }
              )
            ] })
          ] })
        ]
      }
    ),
    /* @__PURE__ */ jsxs(
      "section",
      {
        className: `py-20 ${theme === "dark" ? "bg-gradient-to-b from-slate-900/20 via-transparent to-slate-800/30" : "bg-gradient-to-b from-slate-200/20 via-transparent to-slate-100/40"}`,
        id: "preview",
        children: [
          /* @__PURE__ */ jsxs("div", { className: "max-w-6xl mx-auto px-4 lg:px-8 text-center", children: [
            /* @__PURE__ */ jsx(
              "h2",
              {
                className: `text-4xl lg:text-6xl font-bold mb-4 bg-clip-text text-transparent ${theme === "dark" ? "bg-gradient-to-r from-white to-cyan-400" : "bg-gradient-to-r from-slate-900 to-blue-600"}`,
                children: "⚡ 종합 실시간 트레이딩 차트"
              }
            ),
            /* @__PURE__ */ jsxs(
              "p",
              {
                className: `mt-10 mb-12 text-lg ${textSecondary} mx-auto max-w-2xl`,
                children: [
                  "거래 데이터를 기반으로 초단위로 갱신되는 ",
                  /* @__PURE__ */ jsx("br", {}),
                  "주식 실시간 트레이딩 차트를 직접 경험해보세요."
                ]
              }
            ),
            /* @__PURE__ */ jsx("div", { className: "relative max-w-4xl mx-auto rounded-2xl overflow-hidden shadow-2xl border border-slate-200/20 mb-28", children: /* @__PURE__ */ jsx(
              "video",
              {
                src: "/chart_video.mp4",
                controls: true,
                autoPlay: true,
                loop: true,
                muted: true,
                playsInline: true,
                className: "w-full h-auto rounded-2xl"
              }
            ) }),
            /* @__PURE__ */ jsxs("div", { className: "flex flex-col lg:flex-row items-center gap-12", children: [
              /* @__PURE__ */ jsxs("div", { className: "lg:w-1/2 text-center lg:text-left", children: [
                /* @__PURE__ */ jsx(
                  "h3",
                  {
                    className: `text-3xl lg:text-4xl font-bold mb-4 ${textPrimary}`,
                    children: "고급 트레이딩 기능"
                  }
                ),
                /* @__PURE__ */ jsxs("p", { className: `mb-6 text-lg ${textSecondary} leading-relaxed`, children: [
                  "실시간 차트와 호가, 다양한 기술적 지표를 한눈에 확인하고 분석할 수 있습니다.",
                  /* @__PURE__ */ jsx("br", {}),
                  /* @__PURE__ */ jsx("br", {}),
                  "포트폴리오 관리부터 전략 시뮬레이션까지, 모든 기능이 직관적인 UI로 제공됩니다."
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row gap-4 mt-6 justify-center lg:justify-start", children: [
                  /* @__PURE__ */ jsx(
                    "button",
                    {
                      className: `${theme === "dark" ? "bg-gradient-to-r from-cyan-400 to-emerald-400 text-slate-900 hover:shadow-cyan-400/40" : "bg-gradient-to-r from-blue-600 to-emerald-600 text-white hover:shadow-blue-600/40"} px-8 py-4 rounded-full font-bold text-lg hover:-translate-y-1 hover:shadow-xl transition-all duration-300`,
                      children: "API 연동 가이드"
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "button",
                    {
                      className: `border-2 px-8 py-4 rounded-full font-bold text-lg transition-all duration-300 ${theme === "dark" ? "border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-slate-900" : "border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white"}`,
                      onClick: () => navigate("/feature"),
                      children: "차트 기능 자세히"
                    }
                  )
                ] })
              ] }),
              /* @__PURE__ */ jsx("div", { className: "lg:w-1/2 relative rounded-2xl overflow-hidden shadow-2xl border border-slate-200/20", children: /* @__PURE__ */ jsx(
                "button",
                {
                  className: "p-0 border-none bg-transparent cursor-zoom-in",
                  onClick: () => setModalImg(images[0]),
                  children: /* @__PURE__ */ jsx(
                    "img",
                    {
                      src: images[0],
                      alt: "실시간 트레이딩 차트 미리보기",
                      className: "w-full h-auto rounded-xl"
                    }
                  )
                }
              ) })
            ] })
          ] }),
          modalImg && /* @__PURE__ */ jsx(
            "button",
            {
              className: "fixed inset-0 bg-black/70 flex justify-center items-center z-50 p-4 cursor-zoom-out",
              onClick: () => setModalImg(null),
              "aria-label": "이미지 닫기",
              children: /* @__PURE__ */ jsx(
                "img",
                {
                  src: modalImg,
                  alt: "확대 이미지",
                  className: "max-w-[90vw] max-h-[90vh] rounded-xl shadow-2xl"
                }
              )
            }
          )
        ]
      }
    ),
    /* @__PURE__ */ jsx(
      "section",
      {
        className: `py-20 ${theme === "dark" ? "bg-gradient-to-b from-transparent to-slate-800/30" : "bg-gradient-to-b from-transparent to-slate-100/50"}`,
        id: "features",
        children: /* @__PURE__ */ jsxs("div", { className: "max-w-6xl mx-auto px-4 lg:px-8", children: [
          /* @__PURE__ */ jsx(
            "h2",
            {
              className: `text-3xl lg:text-5xl font-bold text-center mb-16 ${textPrimary}`,
              children: "왜 Trading Gear를 선택해야 할까요?"
            }
          ),
          /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8", children: [
            {
              icon: "🤖",
              title: "AI 기반 자동 거래",
              desc: "머신러닝 알고리즘이 시장 패턴을 분석하여 최적의 거래 타이밍을 찾아드립니다. 24시간 지속적인 모니터링으로 기회를 놓치지 않습니다."
            },
            {
              icon: "📊",
              title: "고급 분석 도구",
              desc: "실시간 차트, 기술적 지표, 백테스팅 기능으로 전문적인 분석을 제공합니다. 데이터 기반의 합리적인 투자 결정을 도와드립니다."
            },
            {
              icon: "🔒",
              title: "안전한 자금 관리",
              desc: "은행급 보안 시스템과 2단계 인증으로 고객의 자산을 안전하게 보호합니다. API 키를 통한 안전한 거래소 연결을 제공합니다."
            },
            {
              icon: "⚡",
              title: "초고속 실행",
              desc: "전 세계 주요 거래소와 직접 연결된 고성능 서버로 밀리초 단위의 빠른 주문 실행을 보장합니다."
            },
            {
              icon: "🎯",
              title: "맞춤형 전략",
              desc: "개인의 투자 성향과 리스크 허용도에 맞는 맞춤형 거래 전략을 제공합니다. 다양한 자산 클래스에 대한 포트폴리오 최적화를 지원합니다."
            },
            {
              icon: "📱",
              title: "모바일 지원",
              desc: "언제 어디서나 모바일 앱으로 포트폴리오를 모니터링하고 거래 설정을 조정할 수 있습니다. 직관적인 UI/UX 설계로 쉽게 사용가능합니다."
            }
          ].map((feature, index) => /* @__PURE__ */ jsxs(
            "div",
            {
              className: `${theme === "dark" ? "bg-slate-800/60 border-cyan-400/20 hover:border-cyan-400 hover:shadow-cyan-400/20" : "bg-white/90 border-blue-600/20 hover:border-blue-600 hover:shadow-blue-600/20"} border rounded-2xl p-8 text-center backdrop-blur-lg hover:transform hover:-translate-y-2 hover:shadow-xl transition-all duration-300`,
              children: [
                /* @__PURE__ */ jsx("div", { className: "text-5xl mb-4", children: feature.icon }),
                /* @__PURE__ */ jsx("h3", { className: `text-xl font-semibold mb-4 ${textPrimary}`, children: feature.title }),
                /* @__PURE__ */ jsx("p", { className: `${textSecondary} leading-relaxed`, children: feature.desc })
              ]
            },
            index
          )) })
        ] })
      }
    ),
    /* @__PURE__ */ jsx("section", { className: "py-20", id: "bots", children: /* @__PURE__ */ jsxs("div", { className: "max-w-6xl mx-auto px-4 lg:px-8", children: [
      /* @__PURE__ */ jsx(
        "h2",
        {
          className: `text-3xl lg:text-5xl font-bold text-center mb-16 ${textPrimary}`,
          children: "다양한 트레이딩 봇 전략"
        }
      ),
      /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6", children: [
        {
          title: "그리드 트레이딩 봇",
          desc: "횡보 시장에서 작은 가격 변동으로도 수익을 창출하는 전략입니다. 자동으로 매수/매도 주문을 반복 실행합니다."
        },
        {
          title: "DCA 봇 (평균 단가 전략)",
          desc: "정기적으로 일정 금액을 투자하여 평균 매수 단가를 낮추는 안정적인 장기 투자 전략입니다."
        },
        {
          title: "스캘핑 봇",
          desc: "초단기 거래로 작은 가격 차이에서 빠르게 수익을 얻는 전략입니다. 높은 빈도의 거래로 수익을 극대화합니다."
        },
        {
          title: "추세 추종 봇",
          desc: "시장의 상승/하락 추세를 파악하여 트렌드를 따라가는 전략입니다. 기술적 지표를 활용한 신호 기반 거래를 수행합니다."
        },
        {
          title: "차익거래 봇",
          desc: "서로 다른 거래소 간의 가격 차이를 이용하여 무위험 수익을 창출하는 전략입니다."
        },
        {
          title: "옵션 전략 봇",
          desc: "복잡한 옵션 거래 전략을 자동화하여 프리미엄 수익과 헤지 기능을 동시에 제공합니다."
        }
      ].map((bot, index) => /* @__PURE__ */ jsxs(
        "div",
        {
          className: `${theme === "dark" ? "bg-gradient-to-br from-cyan-400/10 to-emerald-400/10 border-cyan-400/20 hover:border-emerald-400 hover:from-cyan-400/20 hover:to-emerald-400/20" : "bg-gradient-to-br from-blue-600/10 to-emerald-600/10 border-blue-600/20 hover:border-emerald-600 hover:from-blue-600/20 hover:to-emerald-600/20"} border rounded-xl p-6 hover:bg-gradient-to-br transition-all duration-300`,
          children: [
            /* @__PURE__ */ jsx("h4", { className: `${accentColor} font-semibold text-lg mb-3`, children: bot.title }),
            /* @__PURE__ */ jsx("p", { className: `${textSecondary} text-sm leading-relaxed`, children: bot.desc })
          ]
        },
        index
      )) })
    ] }) }),
    /* @__PURE__ */ jsx(
      "section",
      {
        className: `py-20 text-center ${theme === "dark" ? "bg-gradient-radial from-emerald-400/10" : "bg-gradient-radial from-emerald-600/10"} to-transparent`,
        id: "signup",
        children: /* @__PURE__ */ jsxs("div", { className: "max-w-6xl mx-auto px-4 lg:px-8", children: [
          /* @__PURE__ */ jsx("h2", { className: `text-3xl lg:text-5xl font-bold mb-4 ${textPrimary}`, children: "지금 시작하세요!" }),
          /* @__PURE__ */ jsx("p", { className: `text-xl ${textSecondary} mb-8`, children: "7일 무료 체험으로 Trading Gear의 모든 기능을 경험해보세요. 신용카드 등록 없이 바로 시작 가능합니다." }),
          /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row justify-center gap-4", children: [
            /* @__PURE__ */ jsx(
              "button",
              {
                className: `${theme === "dark" ? "bg-gradient-to-r from-cyan-400 to-emerald-400 text-slate-900 hover:shadow-cyan-400/40" : "bg-gradient-to-r from-blue-600 to-emerald-600 text-white hover:shadow-blue-600/40"} px-8 py-4 rounded-full font-bold text-lg hover:transform hover:-translate-y-1 hover:shadow-xl transition-all duration-300`,
                onClick: () => navigate("/login"),
                children: "무료 체험 시작하기"
              }
            ),
            /* @__PURE__ */ jsx(
              "button",
              {
                className: `border-2 ${theme === "dark" ? "border-cyan-400 text-cyan-400 hover:bg-cyan-400" : "border-blue-600 text-blue-600 hover:bg-blue-600"} hover:text-slate-900 px-8 py-4 rounded-full font-bold text-lg transition-all duration-300`,
                children: "전문가와 상담하기"
              }
            )
          ] })
        ] })
      }
    ),
    /* @__PURE__ */ jsx(Footer, { onLinkClick: (linkName) => linkName })
  ] });
}
const route64 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Index,
  meta: meta$5
}, Symbol.toStringTag, { value: "Module" }));
const meta$4 = () => {
  return [
    { title: "회사소개 - TRADING GEAR" },
    {
      name: "description",
      content: "대구 소재 AI 트레이딩뷰 기반 핀테크 기업, 트레이딩기어입니다."
    }
  ];
};
function About() {
  const { theme, isClient, initializeTheme } = useThemeStore();
  useEffect(() => {
    initializeTheme();
  }, [initializeTheme]);
  const Particle = () => /* @__PURE__ */ jsx(
    "div",
    {
      className: `absolute w-1 h-1 rounded-full opacity-10 pointer-events-none animate-pulse
        ${theme === "dark" ? "bg-cyan-400" : "bg-blue-600"}`,
      style: {
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        animationDelay: `${Math.random() * 6}s`,
        animationDuration: `${Math.random() * 4 + 4}s`
      }
    }
  );
  const themeClasses = theme === "dark" ? "bg-gradient-to-br from-slate-900 to-slate-800 text-white" : "bg-gradient-to-br from-white to-slate-50 text-slate-900";
  const textPrimary = theme === "dark" ? "text-white" : "text-slate-900";
  const textSecondary = theme === "dark" ? "text-slate-300" : "text-slate-600";
  const primaryColor = theme === "dark" ? "text-cyan-400" : "text-blue-600";
  const accentColor = theme === "dark" ? "text-emerald-400" : "text-emerald-600";
  const cardBg = theme === "dark" ? "bg-slate-800/40" : "bg-white/70";
  const sectionBg = theme === "dark" ? "bg-gradient-to-b from-transparent to-slate-800/20" : "bg-gradient-to-b from-transparent to-slate-100/30";
  return /* @__PURE__ */ jsxs("div", { className: `min-h-screen transition-all duration-300 ${themeClasses}`, children: [
    isClient && Array.from({ length: 8 }, (_, i) => /* @__PURE__ */ jsx(Particle, { index: i }, i)),
    /* @__PURE__ */ jsx(Header, {}),
    /* @__PURE__ */ jsxs("section", { className: "min-h-screen flex items-center justify-center text-center relative overflow-hidden pt-20", children: [
      /* @__PURE__ */ jsx(
        "div",
        {
          className: `absolute inset-0 ${theme === "dark" ? "bg-gradient-radial from-cyan-400/5" : "bg-gradient-radial from-blue-600/5"} to-transparent`
        }
      ),
      /* @__PURE__ */ jsxs("div", { className: "max-w-6xl mx-auto px-4 lg:px-8", children: [
        /* @__PURE__ */ jsx("div", { className: "mb-6", children: /* @__PURE__ */ jsx(
          "span",
          {
            className: `inline-block px-4 py-2 rounded-full text-sm font-semibold ${theme === "dark" ? "bg-cyan-400/20 text-cyan-400" : "bg-blue-600/20 text-blue-600"}`,
            children: "대구 소재 핀테크 기업"
          }
        ) }),
        /* @__PURE__ */ jsxs(
          "h1",
          {
            className: `text-5xl/[3.5rem] lg:text-7xl/[5.5rem] font-bold mb-8 ${theme === "dark" ? "bg-gradient-to-r from-white to-cyan-400" : "bg-gradient-to-r from-slate-900 to-blue-600"} bg-clip-text text-transparent`,
            children: [
              "국내 최초",
              " ",
              /* @__PURE__ */ jsx("span", { className: `pt-2 text-3xl lg:text-5xl block`, children: "국내 · 외 통합 자동매매 플랫폼" })
            ]
          }
        ),
        /* @__PURE__ */ jsxs(
          "p",
          {
            className: `text-xl lg:text-2xl/[2.5rem] ${textSecondary} mb-8 leading-relaxed max-w-4xl mx-auto`,
            children: [
              /* @__PURE__ */ jsx("span", { className: "text-yellow-400", children: "AI 트레이딩뷰" }),
              " 기반으로",
              " ",
              /* @__PURE__ */ jsx("span", { className: primaryColor, children: "금융" }),
              "과",
              " ",
              /* @__PURE__ */ jsx("span", { className: primaryColor, children: "IT" }),
              "가 결합된 ",
              /* @__PURE__ */ jsx("br", {}),
              "혁신적인 핀테크 솔루션으로",
              /* @__PURE__ */ jsx("br", {}),
              /* @__PURE__ */ jsx("span", { className: accentColor, children: "1:1 맞춤 전략" }),
              "과",
              " ",
              /* @__PURE__ */ jsx("span", { className: accentColor, children: "거래소 API 연동" }),
              "을 통해 서비스를 제공하는 ",
              /* @__PURE__ */ jsx("br", {}),
              "자동매매 SaaS 플랫폼입니다."
            ]
          }
        ),
        /* @__PURE__ */ jsx(
          "div",
          {
            className: `inline-block ${cardBg} backdrop-blur-sm rounded-2xl p-6 border ${theme === "dark" ? "border-cyan-400/20" : "border-blue-600/20"}`,
            children: /* @__PURE__ */ jsx("p", { className: `text-lg ${textPrimary} font-semibold`, children: '"멀티에셋 자동매매를 가장 안전하게, 가장 쉽게"' })
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsx("section", { className: `py-20 ${sectionBg}`, children: /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto px-4 lg:px-8", children: [
      /* @__PURE__ */ jsxs("div", { className: "text-center mb-16", children: [
        /* @__PURE__ */ jsx(
          "h2",
          {
            className: `text-4xl lg:text-5xl font-bold mb-6 ${textPrimary}`,
            children: "트레이딩기어 핵심 기능"
          }
        ),
        /* @__PURE__ */ jsx(
          "p",
          {
            className: `text-xl ${textSecondary} max-w-3xl mx-auto leading-relaxed`,
            children: "AI 기반 자동매매부터 리스크 관리까지, 트레이딩에 필요한 모든 기능을 제공합니다"
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12", children: [
        /* @__PURE__ */ jsxs(
          "div",
          {
            className: `${cardBg} backdrop-blur-sm rounded-3xl p-8 relative overflow-hidden hover:transform hover:-translate-y-2 transition-all duration-300`,
            children: [
              /* @__PURE__ */ jsx(
                "div",
                {
                  className: `w-16 h-16 bg-teal-500/20 rounded-2xl flex items-center justify-center mb-6`,
                  children: /* @__PURE__ */ jsx("span", { className: "text-2xl", children: /* @__PURE__ */ jsx(ChartLine, {}) })
                }
              ),
              /* @__PURE__ */ jsx("h3", { className: `text-2xl font-bold mb-4 text-teal-500`, children: "1. 데이터 & 차트" }),
              /* @__PURE__ */ jsxs("div", { className: `space-y-3 ${textSecondary}`, children: [
                /* @__PURE__ */ jsx("p", { children: "• TradingView 차트 및 전략신호 겸층" }),
                /* @__PURE__ */ jsx("p", { children: "• 온체인·옵션 지표 제공" }),
                /* @__PURE__ */ jsx("p", { children: "• 전략별 예측 리포트 제공(AI기반)" })
              ] })
            ]
          }
        ),
        /* @__PURE__ */ jsxs(
          "div",
          {
            className: `${cardBg} backdrop-blur-sm rounded-3xl p-8 relative overflow-hidden hover:transform hover:-translate-y-2 transition-all duration-300`,
            children: [
              /* @__PURE__ */ jsx(
                "div",
                {
                  className: `w-16 h-16 bg-green-600/20 rounded-2xl flex items-center justify-center mb-6`,
                  children: /* @__PURE__ */ jsx("span", { className: "text-2xl", children: /* @__PURE__ */ jsx(Bot, {}) })
                }
              ),
              /* @__PURE__ */ jsx("h3", { className: `text-2xl font-bold mb-4 text-green-600`, children: "2. 전략 제작" }),
              /* @__PURE__ */ jsxs("div", { className: `space-y-3 ${textSecondary}`, children: [
                /* @__PURE__ */ jsx("p", { children: "• 노코드 워크플로 제공" }),
                /* @__PURE__ */ jsx("p", { children: "• AI 백테스터 내장" }),
                /* @__PURE__ */ jsx("p", { children: "• 초보도 30분내 자동매매 가능" })
              ] })
            ]
          }
        ),
        /* @__PURE__ */ jsxs(
          "div",
          {
            className: `${cardBg} backdrop-blur-sm rounded-3xl p-8 relative overflow-hidden hover:transform hover:-translate-y-2 transition-all duration-300`,
            children: [
              /* @__PURE__ */ jsx(
                "div",
                {
                  className: `w-16 h-16 bg-red-500/20 rounded-2xl flex items-center justify-center mb-6`,
                  children: /* @__PURE__ */ jsx("span", { className: "text-2xl", children: /* @__PURE__ */ jsx(CircleDollarSign, {}) })
                }
              ),
              /* @__PURE__ */ jsx("h3", { className: `text-2xl font-bold mb-4 text-red-500`, children: "3. 주문 실행" }),
              /* @__PURE__ */ jsxs("div", { className: `space-y-3 ${textSecondary}`, children: [
                /* @__PURE__ */ jsx("p", { children: "• TG-Bridge BYO-Key 방식" }),
                /* @__PURE__ */ jsx("p", { children: "• 멀티브로커 지원" }),
                /* @__PURE__ */ jsx("p", { children: "• 보안·규제 안심 설계" })
              ] })
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-8", children: [
        /* @__PURE__ */ jsxs(
          "div",
          {
            className: `${cardBg} backdrop-blur-sm rounded-3xl p-8 relative overflow-hidden hover:transform hover:-translate-y-2 transition-all duration-300`,
            children: [
              /* @__PURE__ */ jsx(
                "div",
                {
                  className: `w-16 h-16 bg-orange-500/20 rounded-2xl flex items-center justify-center mb-6`,
                  children: /* @__PURE__ */ jsx("span", { className: "text-2xl", children: /* @__PURE__ */ jsx(OctagonAlert, {}) })
                }
              ),
              /* @__PURE__ */ jsx("h3", { className: `text-2xl font-bold mb-4 text-orange-500`, children: "4. 리스크 관리" }),
              /* @__PURE__ */ jsxs("div", { className: `space-y-3 ${textSecondary}`, children: [
                /* @__PURE__ */ jsx("p", { children: "• 손실 알림 및 리스크 제한 설정으로 과도한 손실 방지" }),
                /* @__PURE__ */ jsx("p", { children: "• 슬리피지 감지 및 차단 기능 탑재" }),
                /* @__PURE__ */ jsx("p", { children: "• AI기반 실시간 거래내역, 손익 리포트 제공" })
              ] })
            ]
          }
        ),
        /* @__PURE__ */ jsxs(
          "div",
          {
            className: `${cardBg} backdrop-blur-sm rounded-3xl p-8 relative overflow-hidden hover:transform hover:-translate-y-2 transition-all duration-300`,
            children: [
              /* @__PURE__ */ jsx(
                "div",
                {
                  className: `w-16 h-16 bg-teal-600/20 rounded-2xl flex items-center justify-center mb-6`,
                  children: /* @__PURE__ */ jsx("span", { className: "text-2xl", children: /* @__PURE__ */ jsx(ShoppingCart, {}) })
                }
              ),
              /* @__PURE__ */ jsx("h3", { className: `text-2xl font-bold mb-4 text-teal-600`, children: "5. 마켓플레이스" }),
              /* @__PURE__ */ jsxs("div", { className: `space-y-3 ${textSecondary}`, children: [
                /* @__PURE__ */ jsx("p", { children: "• 검증된 전략 템플릿 마켓플레이스 운영" }),
                /* @__PURE__ */ jsx("p", { children: "• 저자에게 수익의 80% 지급으로 양질의 콘텐츠 확보" }),
                /* @__PURE__ */ jsx("p", { children: "• 네트워크 효과로 플랫폼 가치 지속 상승" })
              ] })
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsx("div", { className: "mt-16", children: /* @__PURE__ */ jsxs(
        "div",
        {
          className: `${cardBg} backdrop-blur-sm rounded-3xl p-12 text-center`,
          children: [
            /* @__PURE__ */ jsx("h3", { className: `text-2xl font-bold ${textPrimary} mb-8`, children: "간단한 3단계 프로세스" }),
            /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-8", children: [
              /* @__PURE__ */ jsxs("div", { className: "relative", children: [
                /* @__PURE__ */ jsx(
                  "div",
                  {
                    className: `w-20 h-20 bg-gradient-to-r ${theme === "dark" ? "from-teal-400 to-green-400" : "from-teal-500 to-green-500"} rounded-full flex items-center justify-center mx-auto mb-4`,
                    children: /* @__PURE__ */ jsx("span", { className: "text-white text-2xl font-bold", children: "1" })
                  }
                ),
                /* @__PURE__ */ jsx("h4", { className: `font-bold ${textPrimary} mb-2`, children: "데이터 분석" }),
                /* @__PURE__ */ jsx("p", { className: `text-sm ${textSecondary}`, children: "TradingView 차트와 AI 예측 리포트로 시장 분석" }),
                /* @__PURE__ */ jsx("div", { className: "hidden md:block absolute top-10 -right-8 text-2xl text-gray-400", children: "→" })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "relative", children: [
                /* @__PURE__ */ jsx(
                  "div",
                  {
                    className: `w-20 h-20 bg-gradient-to-r ${theme === "dark" ? "from-green-400 to-red-400" : "from-green-500 to-red-500"} rounded-full flex items-center justify-center mx-auto mb-4`,
                    children: /* @__PURE__ */ jsx("span", { className: "text-white text-2xl font-bold", children: "2" })
                  }
                ),
                /* @__PURE__ */ jsx("h4", { className: `font-bold ${textPrimary} mb-2`, children: "전략 실행" }),
                /* @__PURE__ */ jsx("p", { className: `text-sm ${textSecondary}`, children: "노코드 워크플로로 전략 제작 및 자동 주문 실행" }),
                /* @__PURE__ */ jsx("div", { className: "hidden md:block absolute top-10 -right-8 text-2xl text-gray-400", children: "→" })
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx(
                  "div",
                  {
                    className: `w-20 h-20 bg-gradient-to-r ${theme === "dark" ? "from-red-400 to-orange-400" : "from-red-500 to-orange-500"} rounded-full flex items-center justify-center mx-auto mb-4`,
                    children: /* @__PURE__ */ jsx("span", { className: "text-white text-2xl font-bold", children: "3" })
                  }
                ),
                /* @__PURE__ */ jsx("h4", { className: `font-bold ${textPrimary} mb-2`, children: "리스크 관리" }),
                /* @__PURE__ */ jsx("p", { className: `text-sm ${textSecondary}`, children: "실시간 손익 모니터링과 자동 리스크 제어" })
              ] })
            ] })
          ]
        }
      ) })
    ] }) }),
    /* @__PURE__ */ jsx("section", { className: "py-20", children: /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto px-4 lg:px-8", children: [
      /* @__PURE__ */ jsxs("div", { className: "text-center mb-16", children: [
        /* @__PURE__ */ jsx(
          "h2",
          {
            className: `text-4xl lg:text-5xl font-bold mb-6 ${textPrimary}`,
            children: "트레이딩기어의 경쟁사 대비 차별점"
          }
        ),
        /* @__PURE__ */ jsx(
          "p",
          {
            className: `text-xl ${textSecondary} max-w-3xl mx-auto leading-relaxed`,
            children: "시장의 기존 솔루션들과 차별화된 트레이딩기어만의 고유한 경쟁 우위를 소개합니다"
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-8", children: [
        /* @__PURE__ */ jsx(
          "div",
          {
            className: `${cardBg} backdrop-blur-sm rounded-3xl p-8 border-l-4 ${theme === "dark" ? "border-red-500" : "border-red-600"}`,
            children: /* @__PURE__ */ jsxs("div", { className: "flex items-start space-x-4", children: [
              /* @__PURE__ */ jsx(
                "div",
                {
                  className: `w-16 h-16 ${theme === "dark" ? "bg-red-500/20" : "bg-red-50"} rounded-2xl flex items-center justify-center flex-shrink-0`,
                  children: /* @__PURE__ */ jsx("span", { className: "text-2xl", children: "📈" })
                }
              ),
              /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
                /* @__PURE__ */ jsx(
                  "h3",
                  {
                    className: `text-2xl font-bold mb-4 ${theme === "dark" ? "text-red-400" : "text-red-600"}`,
                    children: "지원 자산 및 자동집행"
                  }
                ),
                /* @__PURE__ */ jsxs("div", { className: `space-y-3 ${textSecondary}`, children: [
                  /* @__PURE__ */ jsx("p", { children: "• 국내외 주식+선물 통합 플랫폼으로 중류 구분없이 매매 가능" }),
                  /* @__PURE__ */ jsx("p", { children: "• 경쟁사들은 대부분 단일 자산군에 집중 (코인 전용 및 등)" }),
                  /* @__PURE__ */ jsx("p", { children: "• 합법적 SaaS 구조를 갖춘 자동매매 플랫폼" })
                ] })
              ] })
            ] })
          }
        ),
        /* @__PURE__ */ jsx(
          "div",
          {
            className: `${cardBg} backdrop-blur-sm rounded-3xl p-8 border-l-4 ${theme === "dark" ? "border-emerald-500" : "border-emerald-600"}`,
            children: /* @__PURE__ */ jsxs("div", { className: "flex items-start space-x-4", children: [
              /* @__PURE__ */ jsx(
                "div",
                {
                  className: `w-16 h-16 ${theme === "dark" ? "bg-emerald-500/20" : "bg-emerald-50"} rounded-2xl flex items-center justify-center flex-shrink-0`,
                  children: /* @__PURE__ */ jsx("span", { className: "text-2xl", children: "🛡️" })
                }
              ),
              /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
                /* @__PURE__ */ jsx(
                  "h3",
                  {
                    className: `text-2xl font-bold mb-4 ${theme === "dark" ? "text-emerald-400" : "text-emerald-600"}`,
                    children: "보안 및 규제 적합성"
                  }
                ),
                /* @__PURE__ */ jsxs("div", { className: `space-y-3 ${textSecondary}`, children: [
                  /* @__PURE__ */ jsx("p", { children: "• API키 마스킹 보안처리로 해킹내부 유출 위험 차단" }),
                  /* @__PURE__ */ jsx("p", { children: "• 중앙 서버에 비밀번호 암호화 보관으로 내부 유출 위험 차단" }),
                  /* @__PURE__ */ jsx("p", { children: "• 업종코드 KSIC 66199 핀테크 예외 적용 정책자금 지원 대상" })
                ] })
              ] })
            ] })
          }
        ),
        /* @__PURE__ */ jsx(
          "div",
          {
            className: `${cardBg} backdrop-blur-sm rounded-3xl p-8 border-l-4 ${theme === "dark" ? "border-orange-500" : "border-orange-600"}`,
            children: /* @__PURE__ */ jsxs("div", { className: "flex items-start space-x-4", children: [
              /* @__PURE__ */ jsx(
                "div",
                {
                  className: `w-16 h-16 ${theme === "dark" ? "bg-orange-500/20" : "bg-orange-50"} rounded-2xl flex items-center justify-center flex-shrink-0`,
                  children: /* @__PURE__ */ jsx("span", { className: "text-2xl", children: "⚡" })
                }
              ),
              /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
                /* @__PURE__ */ jsx(
                  "h3",
                  {
                    className: `text-2xl font-bold mb-4 ${theme === "dark" ? "text-orange-400" : "text-orange-600"}`,
                    children: "리스크 제어 및 요금 체계"
                  }
                ),
                /* @__PURE__ */ jsxs("div", { className: `space-y-3 ${textSecondary}`, children: [
                  /* @__PURE__ */ jsx("p", { children: "• AI 기반 수익률 예측보고서 제공" }),
                  /* @__PURE__ */ jsx("p", { children: "• 이용자 대시보드에서 실시간 손실률 확인 가능" }),
                  /* @__PURE__ */ jsx("p", { children: "• 정액 구독료 + 0% 성과수수료의 투명한 요금 체계" })
                ] })
              ] })
            ] })
          }
        ),
        /* @__PURE__ */ jsx(
          "div",
          {
            className: `${cardBg} backdrop-blur-sm rounded-3xl p-8 border-l-4 ${theme === "dark" ? "border-cyan-500" : "border-cyan-600"}`,
            children: /* @__PURE__ */ jsxs("div", { className: "flex items-start space-x-4", children: [
              /* @__PURE__ */ jsx(
                "div",
                {
                  className: `w-16 h-16 ${theme === "dark" ? "bg-cyan-500/20" : "bg-cyan-50"} rounded-2xl flex items-center justify-center flex-shrink-0`,
                  children: /* @__PURE__ */ jsx("span", { className: "text-2xl", children: "🎯" })
                }
              ),
              /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
                /* @__PURE__ */ jsx(
                  "h3",
                  {
                    className: `text-2xl font-bold mb-4 ${theme === "dark" ? "text-cyan-400" : "text-cyan-600"}`,
                    children: "유사업종 대비 핵심 차별점"
                  }
                ),
                /* @__PURE__ */ jsxs("div", { className: `space-y-3 ${textSecondary}`, children: [
                  /* @__PURE__ */ jsx("p", { children: "• 트레이딩뷰 차트만 제공하는 카카오페이증권과 달리 AI기반 전략 및 수익률 예측보고서 제공" }),
                  /* @__PURE__ */ jsx("p", { children: "• 리딩방과 달리 투명한 로그 기록으로 성과 과장·삭제 불가능" })
                ] })
              ] })
            ] })
          }
        )
      ] })
    ] }) }),
    /* @__PURE__ */ jsx("section", { className: `py-20 ${sectionBg}`, children: /* @__PURE__ */ jsxs("div", { className: "max-w-6xl mx-auto px-4 lg:px-8", children: [
      /* @__PURE__ */ jsx(
        "h2",
        {
          className: `text-4xl lg:text-5xl font-bold mb-8 text-center ${textPrimary}`,
          children: "인증 및 등록증"
        }
      ),
      /* @__PURE__ */ jsx("div", { className: "w-1/2 mx-auto", children: /* @__PURE__ */ jsxs("div", { className: `flex${cardBg} backdrop-blur-sm rounded-2xl p-8`, children: [
        /* @__PURE__ */ jsx(
          "div",
          {
            className: `${theme === "dark" ? "bg-slate-700/50" : "bg-gray-100"} rounded-xl p-6 flex items-center justify-center`,
            children: /* @__PURE__ */ jsx("div", { className: "text-center", children: /* @__PURE__ */ jsx("div", { className: "img", children: /* @__PURE__ */ jsx("img", { src: "/docImg.jpg", alt: "" }) }) })
          }
        ),
        /* @__PURE__ */ jsxs(
          "h3",
          {
            className: `text-2xl font-bold mt-4 text-center ${primaryColor}`,
            children: [
              /* @__PURE__ */ jsx("span", { className: "text-yellow-400 pr-2", children: "✓" }),
              "저작권 등록 완료"
            ]
          }
        )
      ] }) })
    ] }) }),
    /* @__PURE__ */ jsx("section", { className: `py-20 ${sectionBg}`, children: /* @__PURE__ */ jsxs("div", { className: "max-w-6xl mx-auto px-4 lg:px-8", children: [
      /* @__PURE__ */ jsx(
        "h2",
        {
          className: `text-4xl lg:text-5xl font-bold mb-16 text-center ${textPrimary}`,
          children: "기술 스택"
        }
      ),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-8", children: [
        /* @__PURE__ */ jsxs(
          "div",
          {
            className: `${cardBg} backdrop-blur-sm rounded-2xl p-8 text-center`,
            children: [
              /* @__PURE__ */ jsx("div", { className: "text-5xl mb-4", children: "🤖" }),
              /* @__PURE__ */ jsx("h3", { className: `text-xl font-bold mb-4 ${primaryColor}`, children: "AI & 머신러닝" }),
              /* @__PURE__ */ jsxs("ul", { className: `${textSecondary} text-sm space-y-2`, children: [
                /* @__PURE__ */ jsx("li", { children: "딥러닝 기반 시장 분석" }),
                /* @__PURE__ */ jsx("li", { children: "패턴 인식 알고리즘" }),
                /* @__PURE__ */ jsx("li", { children: "리스크 관리 시스템" }),
                /* @__PURE__ */ jsx("li", { children: "실시간 데이터 처리" })
              ] })
            ]
          }
        ),
        /* @__PURE__ */ jsxs(
          "div",
          {
            className: `${cardBg} backdrop-blur-sm rounded-2xl p-8 text-center`,
            children: [
              /* @__PURE__ */ jsx("div", { className: "text-5xl mb-4", children: "🔗" }),
              /* @__PURE__ */ jsx("h3", { className: `text-xl font-bold mb-4 ${accentColor}`, children: "API 연동" }),
              /* @__PURE__ */ jsxs("ul", { className: `${textSecondary} text-sm space-y-2`, children: [
                /* @__PURE__ */ jsx("li", { children: "다중 거래소 연결" }),
                /* @__PURE__ */ jsx("li", { children: "실시간 시세 수신" }),
                /* @__PURE__ */ jsx("li", { children: "자동 주문 실행" }),
                /* @__PURE__ */ jsx("li", { children: "포트폴리오 관리" })
              ] })
            ]
          }
        ),
        /* @__PURE__ */ jsxs(
          "div",
          {
            className: `${cardBg} backdrop-blur-sm rounded-2xl p-8 text-center`,
            children: [
              /* @__PURE__ */ jsx("div", { className: "text-5xl mb-4", children: "📱" }),
              /* @__PURE__ */ jsx("h3", { className: `text-xl font-bold mb-4 ${primaryColor}`, children: "플랫폼" }),
              /* @__PURE__ */ jsxs("ul", { className: `${textSecondary} text-sm space-y-2`, children: [
                /* @__PURE__ */ jsx("li", { children: "웹 기반 SaaS" }),
                /* @__PURE__ */ jsx("li", { children: "모바일 최적화" }),
                /* @__PURE__ */ jsx("li", { children: "클라우드 인프라" }),
                /* @__PURE__ */ jsx("li", { children: "24/7 모니터링" })
              ] })
            ]
          }
        )
      ] })
    ] }) }),
    /* @__PURE__ */ jsx("section", { className: `py-20 ${sectionBg}`, children: /* @__PURE__ */ jsxs("div", { className: "max-w-6xl mx-auto px-4 lg:px-8", children: [
      /* @__PURE__ */ jsx(
        "h2",
        {
          className: `text-4xl lg:text-5xl font-bold mb-12 text-center ${textPrimary}`,
          children: "연락처 및 고객지원"
        }
      ),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-12", children: [
        /* @__PURE__ */ jsxs("div", { className: `${cardBg} backdrop-blur-sm rounded-2xl p-8`, children: [
          /* @__PURE__ */ jsx("h3", { className: `text-2xl font-bold mb-6 ${primaryColor}`, children: "문의하기" }),
          /* @__PURE__ */ jsxs("form", { className: "space-y-4", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx(
                "label",
                {
                  className: `block mb-1 text-sm font-semibold ${textPrimary}`,
                  children: "이름"
                }
              ),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "text",
                  placeholder: "이름을 입력하세요",
                  className: "w-full rounded-xl border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx(
                "label",
                {
                  className: `block mb-1 text-sm font-semibold ${textPrimary}`,
                  children: "이메일"
                }
              ),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "email",
                  placeholder: "example@email.com",
                  className: "w-full rounded-xl border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx(
                "label",
                {
                  className: `block mb-1 text-sm font-semibold ${textPrimary}`,
                  children: "메시지"
                }
              ),
              /* @__PURE__ */ jsx(
                "textarea",
                {
                  rows: 5,
                  placeholder: "문의 내용을 작성해주세요",
                  className: "w-full rounded-xl border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                }
              )
            ] }),
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "submit",
                className: "w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white py-3 rounded-xl font-semibold shadow-md hover:opacity-90 transition",
                children: "문의 보내기"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxs(
          "div",
          {
            className: `${cardBg} backdrop-blur-sm rounded-2xl p-8 flex flex-col justify-center`,
            children: [
              /* @__PURE__ */ jsx("h3", { className: `text-2xl font-bold mb-6 ${accentColor}`, children: "고객지원 채널" }),
              /* @__PURE__ */ jsx("p", { className: `mb-6 ${textSecondary}`, children: "아래 채널을 통해 빠르게 문의하실 수 있습니다." }),
              /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
                /* @__PURE__ */ jsx(
                  "a",
                  {
                    href: "https://pf.kakao.com/_YOUR_KAKAO_LINK",
                    target: "_blank",
                    rel: "noopener noreferrer",
                    className: "flex items-center justify-center gap-2 bg-yellow-400 text-black font-semibold py-3 rounded-xl shadow hover:bg-yellow-500 transition",
                    children: "💬 카카오톡 문의하기"
                  }
                ),
                /* @__PURE__ */ jsx(
                  "a",
                  {
                    href: "mailto:support@tradinggear.com",
                    className: "flex items-center justify-center gap-2 bg-blue-600 text-white font-semibold py-3 rounded-xl shadow hover:bg-blue-700 transition",
                    children: "📧 이메일: support@tradinggear.com"
                  }
                ),
                /* @__PURE__ */ jsx(
                  "a",
                  {
                    href: "tel:053-000-0000",
                    className: "flex items-center justify-center gap-2 bg-emerald-500 text-white font-semibold py-3 rounded-xl shadow hover:bg-emerald-600 transition",
                    children: "☎ 전화: 053-000-0000"
                  }
                )
              ] })
            ]
          }
        )
      ] })
    ] }) }),
    /* @__PURE__ */ jsx(
      Footer,
      {
        onLinkClick: (linkName) => console.log(`About 페이지 Footer 링크 클릭: ${linkName}`)
      }
    )
  ] });
}
const route65 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: About,
  meta: meta$4
}, Symbol.toStringTag, { value: "Module" }));
const meta$3 = () => {
  return [
    { title: "Log in - TRADING GEAR" },
    { name: "description", content: "Sign in to your AI trading account" }
  ];
};
function Login() {
  const navigate = useNavigate$1();
  const { theme, isClient, initializeTheme } = useThemeStore();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false
  });
  const emailRef = useRef(null);
  const passRef = useRef(null);
  const [array, setArray] = useState([]);
  function setLoginIdCookie(email) {
    const maxAge = 60 * 60 * 24 * 30;
    const sameSite = "Lax";
    const secure = location.protocol === "https:" ? "; Secure" : "";
    document.cookie = `loginFrontId=${encodeURIComponent(email)}; Max-Age=${maxAge}; Path=/; SameSite=${sameSite}${secure}`;
  }
  function getLoginIdCookie() {
    const m = document.cookie.match(/(?:^|;\s*)loginFrontId=([^;]+)/);
    return m ? decodeURIComponent(m[1]) : null;
  }
  function removeLoginIdCookie() {
    document.cookie = `loginFrontId=; Max-Age=0; Path=/`;
  }
  useEffect(() => {
    var _a;
    const saved = getLoginIdCookie();
    const el = document.getElementById("email") || null;
    const el2 = document.getElementById("rememberMe") || null;
    if (saved == null) {
      el.value = "";
      el2.checked = false;
    } else {
      if (emailRef.current) {
        (_a = emailRef.current) == null ? void 0 : _a.focus();
        emailRef.current.value = String(saved);
        el2.checked = true;
      }
    }
  }, []);
  useEffect(() => {
    initializeTheme();
  }, [initializeTheme]);
  const handleInputChangeId = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };
  const handleInputChangeRememberMe = (e) => {
    const { name, value, type, checked } = e.target;
    if (checked == true) {
      const el = document.getElementById("email");
      setLoginIdCookie(el.value);
    } else if (checked == false) {
      removeLoginIdCookie();
    }
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };
  const handleSubmit = async (e) => {
    var _a, _b;
    e.preventDefault();
    const formData2 = new FormData(e.currentTarget);
    console.log("Login form submitted:", formData2);
    const email_value = String((_a = emailRef.current) == null ? void 0 : _a.value);
    const pwd_value = String((_b = passRef.current) == null ? void 0 : _b.value);
    const form = new URLSearchParams();
    form.append("email", email_value ?? "");
    form.append("pwd", pwd_value ?? "");
    console.log(form.toString());
    const res = await fetch("https://tradinggear.co.kr:8081/tradinggear/pass_check.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: form.toString()
    });
    const data1 = await res.text();
    const data2 = data1.split("|@|");
    if (data2[0] == "wrong") {
      alert("로그인 정보가 잘못되었습니다.");
      return;
    }
    sessionStorage.setItem("email", String(email_value));
    sessionStorage.setItem("nickName", String(data2[1]));
    navigate("/dashboard");
  };
  const handleForgotPassword = () => {
    navigate("/forgot-password");
  };
  const themeClasses = theme === "dark" ? "bg-gradient-to-br from-slate-900 to-slate-800" : "bg-gradient-to-br from-slate-100 to-slate-200";
  const cardClasses = theme === "dark" ? "bg-slate-800 border-slate-700" : "bg-white border-slate-300";
  const inputClasses = theme === "dark" ? "bg-slate-700 border-slate-600 text-white placeholder-slate-400 focus:border-cyan-400 focus:ring-cyan-400" : "bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-500 focus:border-blue-500 focus:ring-blue-500";
  const textPrimary = theme === "dark" ? "text-white" : "text-slate-900";
  const textSecondary = theme === "dark" ? "text-slate-400" : "text-slate-600";
  const linkColor = theme === "dark" ? "text-cyan-400 hover:text-cyan-300" : "text-blue-600 hover:text-blue-700";
  const buttonPrimary = theme === "dark" ? "bg-gradient-to-r from-cyan-400 to-emerald-400 text-slate-900 hover:from-cyan-500 hover:to-emerald-500" : "bg-gradient-to-r from-blue-600 to-emerald-600 text-white hover:from-blue-700 hover:to-emerald-700";
  return /* @__PURE__ */ jsxs("div", { className: `min-h-screen transition-all duration-300 ${themeClasses}`, children: [
    /* @__PURE__ */ jsxs("div", { className: `min-h-screen flex items-center justify-center px-4 py-12 transition-all duration-300 ${themeClasses}`, children: [
      /* @__PURE__ */ jsx(Header, {}),
      /* @__PURE__ */ jsxs("div", { className: `w-full max-w-md space-y-8 p-8 rounded-2xl shadow-2xl border transition-all duration-300 ${cardClasses}`, children: [
        /* @__PURE__ */ jsx("div", { className: "text-center", children: /* @__PURE__ */ jsx("h2", { className: `text-3xl font-bold ${textPrimary}`, children: "Log in" }) }),
        /* @__PURE__ */ jsxs("form", { className: "space-y-6", onSubmit: handleSubmit, children: [
          /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(
            "input",
            {
              id: "email",
              name: "email",
              type: "email",
              required: true,
              onChange: handleInputChangeId,
              className: `w-full px-4 py-3 rounded-lg border transition-all duration-200 focus:ring-2 focus:ring-opacity-50  ${inputClasses}`,
              placeholder: "Email",
              ref: emailRef
            }
          ) }),
          /* @__PURE__ */ jsxs("div", { className: "relative", children: [
            /* @__PURE__ */ jsx(
              "input",
              {
                id: "password",
                name: "password",
                type: showPassword ? "text" : "password",
                required: true,
                value: formData.password,
                onChange: handleInputChange,
                className: `w-full px-4 py-3 pr-12 rounded-lg border transition-all duration-200 focus:ring-2 focus:ring-opacity-50 ${inputClasses}`,
                placeholder: "Password",
                ref: passRef
              }
            ),
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                className: `absolute right-3 top-1/2 transform -translate-y-1/2 ${textSecondary} hover:${textPrimary} transition-colors`,
                onClick: () => setShowPassword(!showPassword),
                children: showPassword ? /* @__PURE__ */ jsx("svg", { className: "w-5 h-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" }) }) : /* @__PURE__ */ jsxs("svg", { className: "w-5 h-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: [
                  /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M15 12a3 3 0 11-6 0 3 3 0 016 0z" }),
                  /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" })
                ] })
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center", children: [
              /* @__PURE__ */ jsx(
                "input",
                {
                  id: "rememberMe",
                  name: "rememberMe",
                  type: "checkbox",
                  onChange: handleInputChangeRememberMe,
                  className: `h-4 w-4 rounded border-2 ${theme === "dark" ? "border-slate-600 bg-slate-700 text-cyan-400 focus:ring-cyan-400" : "border-slate-300 bg-white text-blue-600 focus:ring-blue-500"} focus:ring-2 focus:ring-opacity-50`
                }
              ),
              /* @__PURE__ */ jsx("label", { htmlFor: "rememberMe", className: `ml-2 text-sm ${textSecondary}`, children: "Remember me" })
            ] }),
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                onClick: handleForgotPassword,
                className: `text-sm ${linkColor} transition-colors`,
                children: "Forgot password?"
              }
            )
          ] }),
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "submit",
              className: `w-full py-3 px-4 rounded-lg font-semibold text-lg transition-all duration-200 transform hover:scale-105 hover:shadow-lg ${buttonPrimary}`,
              children: "Log in"
            }
          )
        ] }),
        /* @__PURE__ */ jsx("div", { className: "text-center", children: /* @__PURE__ */ jsxs("span", { className: `text-sm ${textSecondary}`, children: [
          "Don't have an account?",
          " ",
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => navigate("/sign-up"),
              className: `font-medium ${linkColor} transition-colors`,
              children: "Sign up"
            }
          )
        ] }) })
      ] })
    ] }),
    /* @__PURE__ */ jsx(Footer, { onLinkClick: (linkName) => linkName })
  ] });
}
const route66 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Login,
  meta: meta$3
}, Symbol.toStringTag, { value: "Module" }));
const meta$2 = () => {
  return [
    { title: "이용약관 - TRADING GEAR" },
    { name: "terms", content: "AI 트레이딩의 새로운 시대" }
  ];
};
function TermsOfServicePage() {
  const { theme, initializeTheme } = useThemeStore();
  const [activeSection, setActiveSection] = useState("definitions");
  useEffect(() => {
    initializeTheme();
  }, [initializeTheme]);
  const themeClasses = theme === "dark" ? "bg-gradient-to-br from-slate-900 to-slate-800 text-white" : "bg-gradient-to-br from-white to-slate-50 text-slate-900";
  const textPrimary = theme === "dark" ? "text-white" : "text-slate-900";
  const textSecondary = theme === "dark" ? "text-slate-300" : "text-slate-600";
  const accentColor = theme === "dark" ? "text-emerald-400" : "text-emerald-600";
  const sections = [
    { id: "definitions", title: "정의 및 용어", icon: "📖" },
    { id: "agreement", title: "서비스 이용계약", icon: "📝" },
    { id: "account", title: "계정 관리", icon: "👤" },
    { id: "usage", title: "서비스 이용", icon: "⚙️" },
    { id: "restrictions", title: "이용 제한", icon: "🚫" },
    { id: "liability", title: "책임의 제한", icon: "⚖️" },
    { id: "payment", title: "결제 및 환불", icon: "💳" },
    { id: "termination", title: "계약 해지", icon: "🔚" },
    { id: "changes", title: "약관 변경", icon: "📋" },
    { id: "governing", title: "준거법 및 관할", icon: "🏛️" }
  ];
  const scrollToSection = (sectionId) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };
  return /* @__PURE__ */ jsxs("div", { className: `min-h-screen transition-all duration-300 ${themeClasses}`, children: [
    /* @__PURE__ */ jsx(Header, {}),
    /* @__PURE__ */ jsxs("section", { className: "pt-32 lg:pt-40 pb-12 text-center relative overflow-hidden", children: [
      /* @__PURE__ */ jsx("div", { className: `absolute inset-0 ${theme === "dark" ? "bg-gradient-radial from-cyan-400/10" : "bg-gradient-radial from-blue-600/10"} to-transparent` }),
      /* @__PURE__ */ jsxs("div", { className: "max-w-4xl mx-auto px-4 lg:px-8 relative z-10", children: [
        /* @__PURE__ */ jsx("h1", { className: `text-4xl/[3rem] lg:text-5xl/[3.5rem] font-bold mb-6 ${theme === "dark" ? "bg-gradient-to-r from-white to-cyan-400" : "bg-gradient-to-r from-slate-900 to-blue-600"} bg-clip-text text-transparent`, children: "Trading Gear 이용약관" }),
        /* @__PURE__ */ jsx("p", { className: `text-lg lg:text-xl ${textSecondary} mb-6 leading-relaxed`, children: "서비스 이용 전 반드시 확인해주시기 바랍니다" }),
        /* @__PURE__ */ jsx("div", { className: `inline-flex items-center px-4 py-2 ${theme === "dark" ? "bg-slate-800/60" : "bg-white/80"} backdrop-blur-lg rounded-full border ${theme === "dark" ? "border-cyan-400/20" : "border-blue-600/20"}`, children: /* @__PURE__ */ jsx("span", { className: `text-sm ${textSecondary}`, children: "최종 업데이트: 2025년 7월 3일" }) })
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "max-w-7xl mx-auto px-4 lg:px-8 pb-20", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col lg:flex-row gap-8", children: [
      /* @__PURE__ */ jsx("div", { className: "lg:w-1/4", children: /* @__PURE__ */ jsxs("div", { className: `sticky top-24 ${theme === "dark" ? "bg-slate-800/60" : "bg-white/90"} backdrop-blur-lg rounded-2xl p-6 border ${theme === "dark" ? "border-cyan-400/20" : "border-blue-600/20"}`, children: [
        /* @__PURE__ */ jsxs("h3", { className: `text-lg font-bold ${textPrimary} mb-4 flex items-center`, children: [
          /* @__PURE__ */ jsx("span", { className: "mr-2", children: "📋" }),
          "목차"
        ] }),
        /* @__PURE__ */ jsx("nav", { className: "space-y-2", children: sections.map((section) => /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: () => scrollToSection(section.id),
            className: `w-full text-left p-3 rounded-lg transition-all duration-300 ${activeSection === section.id ? `${theme === "dark" ? "bg-cyan-400/20 text-cyan-400" : "bg-blue-600/20 text-blue-600"}` : `${textSecondary} hover:text-cyan-400 hover:bg-slate-700/20`}`,
            children: [
              /* @__PURE__ */ jsx("span", { className: "mr-2", children: section.icon }),
              /* @__PURE__ */ jsx("span", { className: "text-sm font-medium", children: section.title })
            ]
          },
          section.id
        )) })
      ] }) }),
      /* @__PURE__ */ jsx("div", { className: "lg:w-3/4", children: /* @__PURE__ */ jsxs("div", { className: `${theme === "dark" ? "bg-slate-800/40" : "bg-white/70"} backdrop-blur-lg rounded-2xl border ${theme === "dark" ? "border-cyan-400/20" : "border-blue-600/20"} overflow-hidden`, children: [
        /* @__PURE__ */ jsxs("section", { id: "definitions", className: "p-8 border-b border-gray-200/10", children: [
          /* @__PURE__ */ jsxs("h2", { className: `text-2xl font-bold ${textPrimary} mb-6 flex items-center`, children: [
            /* @__PURE__ */ jsx("span", { className: "mr-3", children: "📖" }),
            "제1조 (정의 및 용어)"
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
            /* @__PURE__ */ jsxs("div", { className: `p-4 ${theme === "dark" ? "bg-slate-700/40" : "bg-slate-100/60"} rounded-lg`, children: [
              /* @__PURE__ */ jsx("h4", { className: `font-semibold ${textPrimary} mb-2`, children: '1. "서비스"' }),
              /* @__PURE__ */ jsx("p", { className: `${textSecondary} text-sm`, children: "Trading Gear가 제공하는 자동 거래 봇, 포트폴리오 관리, 백테스팅 및 관련 모든 기능을 의미합니다." })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: `p-4 ${theme === "dark" ? "bg-slate-700/40" : "bg-slate-100/60"} rounded-lg`, children: [
              /* @__PURE__ */ jsx("h4", { className: `font-semibold ${textPrimary} mb-2`, children: '2. "이용자"' }),
              /* @__PURE__ */ jsx("p", { className: `${textSecondary} text-sm`, children: "서비스에 접속하여 이 약관에 따라 서비스를 이용하는 회원 및 비회원을 의미합니다." })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: `p-4 ${theme === "dark" ? "bg-slate-700/40" : "bg-slate-100/60"} rounded-lg`, children: [
              /* @__PURE__ */ jsx("h4", { className: `font-semibold ${textPrimary} mb-2`, children: '3. "회원"' }),
              /* @__PURE__ */ jsx("p", { className: `${textSecondary} text-sm`, children: "Trading Gear에 개인정보를 제공하여 회원등록을 한 개인 또는 법인으로서, 서비스를 지속적으로 이용할 수 있는 자를 의미합니다." })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: `p-4 ${theme === "dark" ? "bg-slate-700/40" : "bg-slate-100/60"} rounded-lg`, children: [
              /* @__PURE__ */ jsx("h4", { className: `font-semibold ${textPrimary} mb-2`, children: '4. "거래소 API"' }),
              /* @__PURE__ */ jsx("p", { className: `${textSecondary} text-sm`, children: "이용자가 연결한 암호화폐 거래소의 응용 프로그래밍 인터페이스를 의미합니다." })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("section", { id: "agreement", className: "p-8 border-b border-gray-200/10", children: [
          /* @__PURE__ */ jsxs("h2", { className: `text-2xl font-bold ${textPrimary} mb-6 flex items-center`, children: [
            /* @__PURE__ */ jsx("span", { className: "mr-3", children: "📝" }),
            "제2조 (서비스 이용계약)"
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
            /* @__PURE__ */ jsxs("p", { className: `${textSecondary} leading-relaxed`, children: [
              /* @__PURE__ */ jsx("strong", { className: `${textPrimary}`, children: "1. 계약의 성립" }),
              /* @__PURE__ */ jsx("br", {}),
              "이용계약은 이용자가 본 약관에 동의하고 회원가입을 완료한 시점에 성립됩니다."
            ] }),
            /* @__PURE__ */ jsxs("p", { className: `${textSecondary} leading-relaxed`, children: [
              /* @__PURE__ */ jsx("strong", { className: `${textPrimary}`, children: "2. 계약의 효력" }),
              /* @__PURE__ */ jsx("br", {}),
              "이 약관은 Trading Gear와 이용자 간에 체결되는 서비스 이용에 관한 기본적인 사항을 규정하며, 세부 내용은 개별 서비스 이용약관이 적용됩니다."
            ] }),
            /* @__PURE__ */ jsxs("p", { className: `${textSecondary} leading-relaxed`, children: [
              /* @__PURE__ */ jsx("strong", { className: `${textPrimary}`, children: "3. 약관의 우선순위" }),
              /* @__PURE__ */ jsx("br", {}),
              "개별 서비스 이용약관이 본 약관과 상충할 경우, 개별 서비스 이용약관이 우선 적용됩니다."
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("section", { id: "account", className: "p-8 border-b border-gray-200/10", children: [
          /* @__PURE__ */ jsxs("h2", { className: `text-2xl font-bold ${textPrimary} mb-6 flex items-center`, children: [
            /* @__PURE__ */ jsx("span", { className: "mr-3", children: "👤" }),
            "제3조 (계정 관리)"
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
            /* @__PURE__ */ jsx("div", { className: `p-4 border-l-4 ${theme === "dark" ? "border-emerald-400 bg-emerald-400/10" : "border-emerald-600 bg-emerald-600/10"} rounded`, children: /* @__PURE__ */ jsxs("p", { className: `${textSecondary} text-sm`, children: [
              /* @__PURE__ */ jsx("strong", { className: `${accentColor}`, children: "이용자의 의무" }),
              /* @__PURE__ */ jsx("br", {}),
              "• 정확하고 최신의 정보 제공",
              /* @__PURE__ */ jsx("br", {}),
              "• 계정 정보의 안전한 관리",
              /* @__PURE__ */ jsx("br", {}),
              "• 제3자에게 계정 양도 또는 대여 금지",
              /* @__PURE__ */ jsx("br", {}),
              "• 부정 사용 발견 시 즉시 신고"
            ] }) }),
            /* @__PURE__ */ jsxs("p", { className: `${textSecondary} leading-relaxed`, children: [
              /* @__PURE__ */ jsx("strong", { className: `${textPrimary}`, children: "1. 회원 가입" }),
              /* @__PURE__ */ jsx("br", {}),
              "이용자는 Trading Gear가 정한 가입 양식에 따라 회원정보를 기입한 후 본 약관에 동의한다는 의사표시를 함으로써 회원가입을 신청합니다."
            ] }),
            /* @__PURE__ */ jsxs("p", { className: `${textSecondary} leading-relaxed`, children: [
              /* @__PURE__ */ jsx("strong", { className: `${textPrimary}`, children: "2. 계정 보안" }),
              /* @__PURE__ */ jsx("br", {}),
              "회원은 자신의 ID와 비밀번호를 선량한 관리자의 주의 의무로 관리해야 하며, 회원의 ID나 비밀번호에 의하여 발생하는 모든 결과에 대한 책임은 회원에게 있습니다."
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("section", { id: "usage", className: "p-8 border-b border-gray-200/10", children: [
          /* @__PURE__ */ jsxs("h2", { className: `text-2xl font-bold ${textPrimary} mb-6 flex items-center`, children: [
            /* @__PURE__ */ jsx("span", { className: "mr-3", children: "⚙️" }),
            "제4조 (서비스 이용)"
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
            /* @__PURE__ */ jsxs("p", { className: `${textSecondary} leading-relaxed`, children: [
              /* @__PURE__ */ jsx("strong", { className: `${textPrimary}`, children: "1. 서비스 제공" }),
              /* @__PURE__ */ jsx("br", {}),
              "Trading Gear는 연중무휴 24시간 서비스를 제공함을 원칙으로 합니다. 다만, 시스템 점검, 업그레이드, 장애 복구 등의 경우에는 서비스가 일시 중단될 수 있습니다."
            ] }),
            /* @__PURE__ */ jsxs("p", { className: `${textSecondary} leading-relaxed`, children: [
              /* @__PURE__ */ jsx("strong", { className: `${textPrimary}`, children: "2. 투자 리스크" }),
              /* @__PURE__ */ jsx("br", {}),
              "암호화폐 거래는 높은 투자 위험을 수반하며, 모든 투자 결정과 그 결과에 대한 책임은 전적으로 이용자에게 있습니다."
            ] }),
            /* @__PURE__ */ jsxs("p", { className: `${textSecondary} leading-relaxed`, children: [
              /* @__PURE__ */ jsx("strong", { className: `${textPrimary}`, children: "3. API 연결" }),
              /* @__PURE__ */ jsx("br", {}),
              "이용자는 자신의 책임 하에 거래소 API를 연결하며, API 키의 보안과 권한 관리에 대한 책임을 집니다."
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("section", { id: "restrictions", className: "p-8 border-b border-gray-200/10", children: [
          /* @__PURE__ */ jsxs("h2", { className: `text-2xl font-bold ${textPrimary} mb-6 flex items-center`, children: [
            /* @__PURE__ */ jsx("span", { className: "mr-3", children: "🚫" }),
            "제5조 (이용 제한)"
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
            /* @__PURE__ */ jsxs("div", { className: `p-4 border-l-4 ${theme === "dark" ? "border-red-400 bg-red-400/10" : "border-red-600 bg-red-600/10"} rounded`, children: [
              /* @__PURE__ */ jsx("p", { className: `text-red-400 text-sm font-medium mb-2`, children: "금지 행위" }),
              /* @__PURE__ */ jsxs("ul", { className: `${textSecondary} text-sm space-y-1`, children: [
                /* @__PURE__ */ jsx("li", { children: "• 서비스의 안정성을 해치는 행위" }),
                /* @__PURE__ */ jsx("li", { children: "• 다른 이용자의 개인정보 수집, 저장, 공개" }),
                /* @__PURE__ */ jsx("li", { children: "• 허위 정보 입력 및 타인 정보 도용" }),
                /* @__PURE__ */ jsx("li", { children: "• 시스템 해킹 및 무단 접근 시도" }),
                /* @__PURE__ */ jsx("li", { children: "• 불법 자금 세탁 및 투자 사기" })
              ] })
            ] }),
            /* @__PURE__ */ jsx("p", { className: `${textSecondary} leading-relaxed`, children: "위 금지 행위를 하거나 이에 준하는 행위를 한 회원에 대해서는 서비스 이용 제한, 회원 자격 정지 또는 상실 등의 조치를 취할 수 있습니다." })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("section", { id: "liability", className: "p-8 border-b border-gray-200/10", children: [
          /* @__PURE__ */ jsxs("h2", { className: `text-2xl font-bold ${textPrimary} mb-6 flex items-center`, children: [
            /* @__PURE__ */ jsx("span", { className: "mr-3", children: "⚖️" }),
            "제6조 (책임의 제한)"
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
            /* @__PURE__ */ jsxs("p", { className: `${textSecondary} leading-relaxed`, children: [
              /* @__PURE__ */ jsx("strong", { className: `${textPrimary}`, children: "1. 면책사항" }),
              /* @__PURE__ */ jsx("br", {}),
              "Trading Gear는 천재지변, 정전, 네트워크 장애, 거래소 서비스 중단 등 불가항력적 사유로 인한 서비스 중단에 대해 책임을 지지 않습니다."
            ] }),
            /* @__PURE__ */ jsxs("p", { className: `${textSecondary} leading-relaxed`, children: [
              /* @__PURE__ */ jsx("strong", { className: `${textPrimary}`, children: "2. 투자 손실" }),
              /* @__PURE__ */ jsx("br", {}),
              "암호화폐 거래로 인한 투자 손실에 대해 Trading Gear는 어떠한 책임도 지지 않으며, 모든 투자 결정은 이용자의 판단과 책임 하에 이루어집니다."
            ] }),
            /* @__PURE__ */ jsxs("p", { className: `${textSecondary} leading-relaxed`, children: [
              /* @__PURE__ */ jsx("strong", { className: `${textPrimary}`, children: "3. 손해배상의 범위" }),
              /* @__PURE__ */ jsx("br", {}),
              "Trading Gear의 귀책사유로 인한 손해배상 책임은 이용자가 지불한 서비스 이용료를 초과하지 않습니다."
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("section", { id: "payment", className: "p-8 border-b border-gray-200/10", children: [
          /* @__PURE__ */ jsxs("h2", { className: `text-2xl font-bold ${textPrimary} mb-6 flex items-center`, children: [
            /* @__PURE__ */ jsx("span", { className: "mr-3", children: "💳" }),
            "제7조 (결제 및 환불)"
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
            /* @__PURE__ */ jsxs("p", { className: `${textSecondary} leading-relaxed`, children: [
              /* @__PURE__ */ jsx("strong", { className: `${textPrimary}`, children: "1. 요금 결제" }),
              /* @__PURE__ */ jsx("br", {}),
              "유료 서비스 이용 시 이용자는 선택한 요금제에 따라 정해진 이용료를 결제해야 합니다."
            ] }),
            /* @__PURE__ */ jsxs("p", { className: `${textSecondary} leading-relaxed`, children: [
              /* @__PURE__ */ jsx("strong", { className: `${textPrimary}`, children: "2. 환불 정책" }),
              /* @__PURE__ */ jsx("br", {}),
              /* @__PURE__ */ jsxs("ul", { children: [
                /* @__PURE__ */ jsx("li", { children: "• 멤버십 결제 후 7일 이내이고, 트레이딩 이력이 전혀 없는 경우에만 전액 환불이 가능합니다." }),
                /* @__PURE__ */ jsx("li", { children: "• 결제 후 7일이 지났거나, 트레이딩 이력이 있다면 환불이 불가능합니다." }),
                /* @__PURE__ */ jsx("li", { children: "• 악용 방지를 위한 검토 과정 있습니다." })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("p", { className: `${textSecondary} leading-relaxed`, children: [
              /* @__PURE__ */ jsx("strong", { className: `${textPrimary}`, children: "3. 자동 갱신" }),
              /* @__PURE__ */ jsx("br", {}),
              "구독 서비스는 별도의 해지 의사표시가 없는 한 자동으로 갱신됩니다."
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("section", { id: "termination", className: "p-8 border-b border-gray-200/10", children: [
          /* @__PURE__ */ jsxs("h2", { className: `text-2xl font-bold ${textPrimary} mb-6 flex items-center`, children: [
            /* @__PURE__ */ jsx("span", { className: "mr-3", children: "🔚" }),
            "제8조 (계약 해지)"
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
            /* @__PURE__ */ jsxs("p", { className: `${textSecondary} leading-relaxed`, children: [
              /* @__PURE__ */ jsx("strong", { className: `${textPrimary}`, children: "1. 이용자의 해지" }),
              /* @__PURE__ */ jsx("br", {}),
              "이용자는 언제든지 서비스 해지를 요청할 수 있으며, Trading Gear는 즉시 해지 처리를 완료합니다."
            ] }),
            /* @__PURE__ */ jsxs("p", { className: `${textSecondary} leading-relaxed`, children: [
              /* @__PURE__ */ jsx("strong", { className: `${textPrimary}`, children: "2. Trading Gear의 해지" }),
              /* @__PURE__ */ jsx("br", {}),
              "이용자가 본 약관을 위반하거나 서비스 운영을 방해하는 경우, 사전 통지 후 계약을 해지할 수 있습니다."
            ] }),
            /* @__PURE__ */ jsxs("p", { className: `${textSecondary} leading-relaxed`, children: [
              /* @__PURE__ */ jsx("strong", { className: `${textPrimary}`, children: "3. 데이터 보관" }),
              /* @__PURE__ */ jsx("br", {}),
              "계약 해지 후에도 법령에 따라 일정 기간 동안 회원 정보가 보관될 수 있습니다."
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("section", { id: "changes", className: "p-8 border-b border-gray-200/10", children: [
          /* @__PURE__ */ jsxs("h2", { className: `text-2xl font-bold ${textPrimary} mb-6 flex items-center`, children: [
            /* @__PURE__ */ jsx("span", { className: "mr-3", children: "📋" }),
            "제9조 (약관의 변경)"
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
            /* @__PURE__ */ jsxs("p", { className: `${textSecondary} leading-relaxed`, children: [
              /* @__PURE__ */ jsx("strong", { className: `${textPrimary}`, children: "1. 변경 권한" }),
              /* @__PURE__ */ jsx("br", {}),
              "Trading Gear는 필요에 따라 본 약관을 변경할 수 있으며, 변경된 약관은 웹사이트 공지를 통해 공개됩니다."
            ] }),
            /* @__PURE__ */ jsxs("p", { className: `${textSecondary} leading-relaxed`, children: [
              /* @__PURE__ */ jsx("strong", { className: `${textPrimary}`, children: "2. 변경 효력" }),
              /* @__PURE__ */ jsx("br", {}),
              "변경된 약관은 공지일로부터 7일 후에 효력을 발생하며, 이용자가 변경 후에도 서비스를 계속 이용하는 경우 약관 변경에 동의한 것으로 간주됩니다."
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("section", { id: "governing", className: "p-8", children: [
          /* @__PURE__ */ jsxs("h2", { className: `text-2xl font-bold ${textPrimary} mb-6 flex items-center`, children: [
            /* @__PURE__ */ jsx("span", { className: "mr-3", children: "🏛️" }),
            "제10조 (준거법 및 관할)"
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
            /* @__PURE__ */ jsxs("p", { className: `${textSecondary} leading-relaxed`, children: [
              /* @__PURE__ */ jsx("strong", { className: `${textPrimary}`, children: "1. 준거법" }),
              /* @__PURE__ */ jsx("br", {}),
              "본 약관과 서비스 이용에 관한 모든 사항은 대한민국 법률에 따라 규율됩니다."
            ] }),
            /* @__PURE__ */ jsxs("p", { className: `${textSecondary} leading-relaxed`, children: [
              /* @__PURE__ */ jsx("strong", { className: `${textPrimary}`, children: "2. 관할법원" }),
              /* @__PURE__ */ jsx("br", {}),
              "본 약관과 관련하여 발생하는 모든 분쟁은 대한민국 서울중앙지방법원을 전속관할법원으로 합니다."
            ] }),
            /* @__PURE__ */ jsxs("p", { className: `${textSecondary} leading-relaxed`, children: [
              /* @__PURE__ */ jsx("strong", { className: `${textPrimary}`, children: "3. 분쟁조정" }),
              /* @__PURE__ */ jsx("br", {}),
              "법적 분쟁에 앞서 개인정보보호위원회 등 관련 기관의 조정을 통한 해결을 우선적으로 시도합니다."
            ] })
          ] })
        ] })
      ] }) })
    ] }) }),
    /* @__PURE__ */ jsx(Footer, { onLinkClick: (linkName) => linkName })
  ] });
}
const route67 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: TermsOfServicePage,
  meta: meta$2
}, Symbol.toStringTag, { value: "Module" }));
const route68 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null
}, Symbol.toStringTag, { value: "Module" }));
const meta$1 = () => {
  return [
    { title: "블로그 - TRADING GEAR" },
    { name: "blog", content: "AI 트레이딩의 새로운 시대" }
  ];
};
function BlogInsights() {
  const { theme, initializeTheme } = useThemeStore();
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  useEffect(() => {
    initializeTheme();
  }, [initializeTheme]);
  const bgPrimary = theme === "dark" ? "bg-[#1a1f36]" : "bg-[#f8fafc]";
  const bgSecondary = theme === "dark" ? "bg-gray-800/50" : "bg-white/80";
  const textPrimary = theme === "dark" ? "text-white" : "text-slate-900";
  const textSecondary = theme === "dark" ? "text-gray-300" : "text-slate-600";
  const textTertiary = theme === "dark" ? "text-gray-400" : "text-slate-500";
  const primaryColor = theme === "dark" ? "#00d4ff" : "#0066cc";
  const accentColor = theme === "dark" ? "#00ff88" : "#00b894";
  const borderColor = theme === "dark" ? "border-gray-700" : "border-slate-200";
  const hoverBorder = theme === "dark" ? "hover:border-[#00d4ff]/50" : "hover:border-[#0066cc]/50";
  const blogPosts = [
    {
      id: 1,
      category: "market-analysis",
      title: "2025년 1분기 암호화폐 시장 전망: AI 기반 분석",
      excerpt: "최신 머신러닝 모델을 활용한 비트코인, 이더리움 가격 예측과 주요 알트코인 동향 분석",
      author: "Trading Gear 리서치팀",
      date: "2025-01-15",
      readTime: "8분",
      views: 15420,
      likes: 342,
      tags: ["비트코인", "이더리움", "시장분석", "AI예측"],
      featured: true,
      image: "/blog/newsImg_01.jpg",
      content: `
        <h2>주요 시장 동향</h2>
        <p>2025년 1분기, 암호화폐 시장은 제도적 채택 증가와 규제 명확화로 새로운 전환점을 맞이하고 있습니다...</p>
        
        <h3>비트코인 분석</h3>
        <p>현재 비트코인은 $95,000 - $105,000 구간에서 강한 저항과 지지를 보이고 있으며...</p>
        
        <h3>AI 모델 예측</h3>
        <p>우리의 앙상블 모델은 다음과 같은 시나리오를 제시합니다:</p>
        <ul>
          <li>낙관적 시나리오: BTC $120,000 도달 (확률 35%)</li>
          <li>중립적 시나리오: BTC $100,000 - $110,000 횡보 (확률 45%)</li>
          <li>비관적 시나리오: BTC $80,000 하락 (확률 20%)</li>
        </ul>
      `
    },
    {
      id: 2,
      category: "strategy",
      title: "그리드 트레이딩 전략 완벽 가이드: 횡보장에서 수익 극대화",
      excerpt: "변동성 시장에서 안정적 수익을 창출하는 그리드 트레이딩 전략의 핵심 원리와 최적화 방법",
      author: "김알고리즘",
      date: "2025-01-12",
      readTime: "12분",
      views: 8930,
      likes: 189,
      tags: ["그리드트레이딩", "자동화", "전략", "리스크관리"],
      featured: false,
      image: "/blog/newsImg_02.jpg",
      content: `
        <h2>그리드 트레이딩이란?</h2>
        <p>그리드 트레이딩은 일정한 간격으로 매수/매도 주문을 배치하여 가격 변동성을 이용해 수익을 창출하는 전략입니다...</p>
      `
    },
    {
      id: 3,
      category: "update",
      title: "Trading Gear v3.2 업데이트: 새로운 DeFi 전략 추가",
      excerpt: "유동성 채굴 최적화, 이자 농사 자동화, 새로운 리스크 관리 기능이 추가되었습니다",
      author: "개발팀",
      date: "2025-01-10",
      readTime: "5분",
      views: 12450,
      likes: 278,
      tags: ["업데이트", "DeFi", "새기능", "유동성채굴"],
      featured: false,
      image: "/blog/newsImg_03.jpg",
      content: `
        <h2>주요 업데이트 내용</h2>
        <p>이번 v3.2 업데이트에서는 DeFi 시장의 급성장에 맞춰 새로운 전략들을 추가했습니다...</p>
      `
    },
    {
      id: 4,
      category: "market-analysis",
      title: "글로벌 중앙은행 정책이 암호화폐에 미치는 영향",
      excerpt: "미국 Fed, 유럽 ECB, 일본 BOJ의 통화정책 변화와 디지털 자산 시장 상관관계 분석",
      author: "매크로 애널리스트",
      date: "2025-01-08",
      readTime: "10분",
      views: 6780,
      likes: 145,
      tags: ["중앙은행", "통화정책", "매크로", "상관관계"],
      featured: false,
      image: "/blog/newsImg_04.jpg",
      content: `
        <h2>중앙은행 정책의 영향</h2>
        <p>전통 금융시장과 암호화폐 시장의 상관관계가 점차 높아지고 있습니다...</p>
      `
    },
    {
      id: 5,
      category: "strategy",
      title: "RSI 다이버전스를 활용한 진입 타이밍 최적화",
      excerpt: "기술적 분석의 핵심 도구인 RSI 다이버전스 패턴을 AI로 자동 감지하고 활용하는 방법",
      author: "테크니컬 분석가",
      date: "2025-01-05",
      readTime: "7분",
      views: 9340,
      likes: 203,
      tags: ["RSI", "다이버전스", "기술적분석", "진입타이밍"],
      featured: false,
      image: "/blog/newsImg_05.jpg",
      content: `
        <h2>RSI 다이버전스란?</h2>
        <p>RSI 다이버전스는 가격과 RSI 지표 간의 방향성 차이를 의미합니다...</p>
      `
    },
    {
      id: 6,
      category: "update",
      title: "모바일 앱 UI/UX 개선 업데이트 완료",
      excerpt: "사용자 피드백을 반영한 직관적인 인터페이스와 향상된 성능으로 업데이트되었습니다",
      author: "UX팀",
      date: "2025-01-03",
      readTime: "3분",
      views: 4560,
      likes: 89,
      tags: ["모바일", "UI/UX", "업데이트", "사용성"],
      featured: false,
      image: "/blog/newsImg_06.jpg",
      content: `
        <h2>주요 개선사항</h2>
        <p>이번 업데이트에서는 사용자 경험을 대폭 개선했습니다...</p>
      `
    }
  ];
  const categories = [
    { key: "all", label: "전체", icon: /* @__PURE__ */ jsx(BookOpen, { className: "w-5 h-5" }), count: blogPosts.length },
    { key: "market-analysis", label: "시장 분석", icon: /* @__PURE__ */ jsx(TrendingUp, { className: "w-5 h-5" }), count: blogPosts.filter((p) => p.category === "market-analysis").length },
    { key: "strategy", label: "전략 개발", icon: /* @__PURE__ */ jsx(Lightbulb, { className: "w-5 h-5" }), count: blogPosts.filter((p) => p.category === "strategy").length },
    { key: "update", label: "업데이트", icon: /* @__PURE__ */ jsx(Bell, { className: "w-5 h-5" }), count: blogPosts.filter((p) => p.category === "update").length }
  ];
  const featuredPosts = blogPosts.filter((post) => post.featured);
  const filteredPosts = activeCategory === "all" ? blogPosts.filter((post) => !post.featured) : blogPosts.filter((post) => post.category === activeCategory && !post.featured);
  const searchedPosts = filteredPosts.filter(
    (post) => post.title.toLowerCase().includes(searchTerm.toLowerCase()) || post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) || post.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  };
  const PostCard = ({ post, featured = false }) => {
    var _a;
    return /* @__PURE__ */ jsxs("article", { className: `${bgSecondary} backdrop-blur-sm rounded-lg border ${borderColor} ${hoverBorder} transition-all duration-300 overflow-hidden ${featured ? "col-span-full lg:col-span-2" : ""}`, children: [
      /* @__PURE__ */ jsxs("div", { className: `aspect-video ${theme === "dark" ? "bg-gray-700" : "bg-slate-200"} relative overflow-hidden`, children: [
        /* @__PURE__ */ jsx("img", { src: post.image, alt: post.title, className: "w-full h-full object-cover" }),
        /* @__PURE__ */ jsx("div", { className: "absolute top-4 left-4", children: /* @__PURE__ */ jsx("span", { className: `px-3 py-1 rounded-full text-sm font-medium ${theme === "dark" ? "bg-[#00d4ff] text-black" : "bg-[#0066cc] text-white"}`, children: ((_a = categories.find((cat) => cat.key === post.category)) == null ? void 0 : _a.label) || "기타" }) }),
        featured && /* @__PURE__ */ jsx("div", { className: "absolute top-4 right-4", children: /* @__PURE__ */ jsx("span", { className: `px-3 py-1 rounded-full text-sm font-bold ${theme === "dark" ? "bg-gradient-to-r from-[#00ff88] to-emerald-400 text-black" : "bg-gradient-to-r from-[#00b894] to-emerald-500 text-white"}`, children: "특집" }) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "p-6", children: [
        /* @__PURE__ */ jsxs("div", { className: `flex items-center gap-4 text-sm ${textTertiary} mb-3`, children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1", children: [
            /* @__PURE__ */ jsx(User, { className: "w-4 h-4" }),
            post.author
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1", children: [
            /* @__PURE__ */ jsx(Calendar, { className: "w-4 h-4" }),
            formatDate(post.date)
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1", children: [
            /* @__PURE__ */ jsx(Clock, { className: "w-4 h-4" }),
            post.readTime
          ] })
        ] }),
        /* @__PURE__ */ jsx("h3", { className: `font-bold ${textPrimary} mb-3 cursor-pointer transition-colors ${featured ? "text-2xl" : "text-xl"} ${theme === "dark" ? "hover:text-[#00d4ff]" : "hover:text-[#0066cc]"}`, children: post.title }),
        /* @__PURE__ */ jsx("p", { className: `${textSecondary} mb-4 line-clamp-3`, children: post.excerpt }),
        /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-2 mb-4", children: post.tags.map((tag, index) => /* @__PURE__ */ jsxs("span", { className: `${theme === "dark" ? "bg-gray-700 text-gray-300" : "bg-slate-100 text-slate-600"} px-2 py-1 rounded text-sm`, children: [
          "#",
          tag
        ] }, index)) }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxs("div", { className: `flex items-center gap-4 text-sm ${textTertiary}`, children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1", children: [
              /* @__PURE__ */ jsx(Eye, { className: "w-4 h-4" }),
              post.views.toLocaleString()
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1", children: [
              /* @__PURE__ */ jsx(Heart, { className: "w-4 h-4" }),
              post.likes
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsx("button", { className: `p-2 rounded-lg ${theme === "dark" ? "bg-gray-700 hover:bg-gray-600" : "bg-slate-200 hover:bg-slate-300"} transition-colors`, children: /* @__PURE__ */ jsx(Bookmark, { className: "w-4 h-4" }) }),
            /* @__PURE__ */ jsx("button", { className: `p-2 rounded-lg ${theme === "dark" ? "bg-gray-700 hover:bg-gray-600" : "bg-slate-200 hover:bg-slate-300"} transition-colors`, children: /* @__PURE__ */ jsx(Share2, { className: "w-4 h-4" }) }),
            /* @__PURE__ */ jsxs("button", { className: `flex items-center gap-2 px-4 py-2 rounded-lg transition-colors font-semibold ${theme === "dark" ? "bg-[#00d4ff] hover:bg-cyan-400 text-black" : "bg-[#0066cc] hover:bg-blue-700 text-white"}`, children: [
              "읽기",
              /* @__PURE__ */ jsx(ArrowRight, { className: "w-4 h-4" })
            ] })
          ] })
        ] })
      ] })
    ] });
  };
  return /* @__PURE__ */ jsxs("div", { className: `min-h-screen ${bgPrimary} ${textPrimary}`, children: [
    /* @__PURE__ */ jsx(Header, {}),
    /* @__PURE__ */ jsxs("div", { className: "pt-20", children: [
      /* @__PURE__ */ jsxs("div", { className: "relative overflow-hidden", children: [
        /* @__PURE__ */ jsx("div", { className: `absolute inset-0 ${theme === "dark" ? "bg-gradient-to-br from-cyan-500/10 via-blue-500/10 to-emerald-500/10" : "bg-gradient-to-br from-blue-100/50 via-cyan-50/50 to-emerald-50/50"}` }),
        /* @__PURE__ */ jsx("div", { className: "relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20", children: /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
          /* @__PURE__ */ jsx("h1", { className: `text-4xl md:text-6xl font-bold mb-6 ${theme === "dark" ? "bg-gradient-to-r from-[#00d4ff] via-cyan-400 to-[#00ff88]" : "bg-gradient-to-r from-[#0066cc] via-blue-500 to-[#00b894]"} bg-clip-text text-transparent`, children: "인사이트 & 블로그" }),
          /* @__PURE__ */ jsx("p", { className: `text-xl md:text-2xl ${textSecondary} mb-8 max-w-3xl mx-auto`, children: "최신 시장 동향부터 전략 개발 팁까지, 트레이딩 성공을 위한 모든 정보" }),
          /* @__PURE__ */ jsx("div", { className: "max-w-2xl mx-auto relative", children: /* @__PURE__ */ jsxs("div", { className: "relative", children: [
            /* @__PURE__ */ jsx(Search, { className: `absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 ${textTertiary}` }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "text",
                placeholder: "검색어를 입력하세요...",
                value: searchTerm,
                onChange: (e) => setSearchTerm(e.target.value),
                className: `w-full pl-12 pr-4 py-3 ${bgSecondary} backdrop-blur-sm border ${borderColor} rounded-lg focus:outline-none ${theme === "dark" ? "focus:border-[#00d4ff]" : "focus:border-[#0066cc]"} ${textPrimary} ${theme === "dark" ? "placeholder-gray-400" : "placeholder-slate-400"}`
              }
            )
          ] }) })
        ] }) })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12", children: /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-6", children: [
        /* @__PURE__ */ jsxs("div", { className: `${bgSecondary} backdrop-blur-sm rounded-lg p-6 border ${borderColor} text-center`, children: [
          /* @__PURE__ */ jsx(BookOpen, { className: `w-8 h-8 mx-auto mb-2`, style: { color: primaryColor } }),
          /* @__PURE__ */ jsx("div", { className: "text-2xl font-bold mb-1", style: { color: primaryColor }, children: "150+" }),
          /* @__PURE__ */ jsx("div", { className: textTertiary, children: "게시글" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: `${bgSecondary} backdrop-blur-sm rounded-lg p-6 border ${borderColor} text-center`, children: [
          /* @__PURE__ */ jsx(Eye, { className: `w-8 h-8 mx-auto mb-2`, style: { color: accentColor } }),
          /* @__PURE__ */ jsx("div", { className: "text-2xl font-bold mb-1", style: { color: accentColor }, children: "500K+" }),
          /* @__PURE__ */ jsx("div", { className: textTertiary, children: "월간 조회수" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: `${bgSecondary} backdrop-blur-sm rounded-lg p-6 border ${borderColor} text-center`, children: [
          /* @__PURE__ */ jsx(MessageCircle, { className: `w-8 h-8 mx-auto mb-2`, style: { color: theme === "dark" ? "#00d4ff" : "#0066cc" } }),
          /* @__PURE__ */ jsx("div", { className: "text-2xl font-bold mb-1", style: { color: theme === "dark" ? "#00d4ff" : "#0066cc" }, children: "25K+" }),
          /* @__PURE__ */ jsx("div", { className: textTertiary, children: "커뮤니티 멤버" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: `${bgSecondary} backdrop-blur-sm rounded-lg p-6 border ${borderColor} text-center`, children: [
          /* @__PURE__ */ jsx(TrendingUp, { className: `w-8 h-8 mx-auto mb-2`, style: { color: accentColor } }),
          /* @__PURE__ */ jsx("div", { className: "text-2xl font-bold mb-1", style: { color: accentColor }, children: "92%" }),
          /* @__PURE__ */ jsx("div", { className: textTertiary, children: "콘텐츠 만족도" })
        ] })
      ] }) }),
      featuredPosts.length > 0 && /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 mb-8", children: [
          /* @__PURE__ */ jsx(Zap, { className: "w-6 h-6", style: { color: accentColor } }),
          /* @__PURE__ */ jsx("h2", { className: `text-2xl font-bold ${textPrimary}`, children: "특집 기사" })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-8", children: featuredPosts.map((post) => /* @__PURE__ */ jsx(PostCard, { post, featured: true }, post.id)) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12", children: [
        /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-4 mb-8", children: categories.map((category) => /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: () => setActiveCategory(category.key),
            className: `flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-300 ${activeCategory === category.key ? theme === "dark" ? "bg-[#00d4ff] text-black shadow-lg shadow-[#00d4ff]/25" : "bg-[#0066cc] text-white shadow-lg shadow-[#0066cc]/25" : theme === "dark" ? "bg-gray-800 text-gray-300 hover:bg-gray-700" : "bg-white text-slate-600 hover:bg-slate-50 border border-slate-200"}`,
            children: [
              category.icon,
              category.label,
              /* @__PURE__ */ jsx("span", { className: `px-2 py-1 rounded-full text-sm ${theme === "dark" ? "bg-gray-700 text-gray-300" : "bg-slate-100 text-slate-600"}`, children: category.count })
            ]
          },
          category.key
        )) }),
        /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8", children: searchedPosts.map((post) => /* @__PURE__ */ jsx(PostCard, { post }, post.id)) }),
        /* @__PURE__ */ jsx("div", { className: "text-center mt-12", children: /* @__PURE__ */ jsx("button", { className: `px-8 py-3 rounded-lg font-semibold transition-colors duration-300 ${theme === "dark" ? "bg-[#00d4ff] hover:bg-cyan-400 text-black" : "bg-[#0066cc] hover:bg-blue-700 text-white"}`, children: "더 많은 글 보기" }) })
      ] }),
      /* @__PURE__ */ jsx("div", { className: `${theme === "dark" ? "bg-gray-800/50" : "bg-slate-50"} backdrop-blur-sm py-16`, children: /* @__PURE__ */ jsxs("div", { className: "max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center", children: [
        /* @__PURE__ */ jsx("h2", { className: `text-3xl font-bold mb-4 ${textPrimary}`, children: "주간 인사이트 뉴스레터" }),
        /* @__PURE__ */ jsx("p", { className: `${textSecondary} mb-8`, children: "매주 화요일, 시장 분석과 전략 인사이트를 이메일로 받아보세요" }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row gap-4 max-w-md mx-auto", children: [
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "email",
              placeholder: "이메일 주소",
              className: `flex-1 px-4 py-3 border rounded-lg focus:outline-none ${textPrimary} ${theme === "dark" ? "bg-gray-800 border-gray-700 focus:border-[#00d4ff] placeholder-gray-400" : "bg-white border-slate-300 focus:border-[#0066cc] placeholder-slate-400"}`
            }
          ),
          /* @__PURE__ */ jsx("button", { className: `px-6 py-3 rounded-lg font-semibold transition-colors duration-300 ${theme === "dark" ? "bg-[#00d4ff] hover:bg-cyan-400 text-black" : "bg-[#0066cc] hover:bg-blue-700 text-white"}`, children: "구독하기" })
        ] }),
        /* @__PURE__ */ jsx("p", { className: `text-sm ${textTertiary} mt-4`, children: "언제든지 구독 취소 가능 · 스팸 없음 · 개인정보 보호" })
      ] }) }),
      /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16", children: [
        /* @__PURE__ */ jsx("h2", { className: `text-3xl font-bold mb-8 text-center ${textPrimary}`, children: "인기 리소스" }),
        /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8", children: [
          {
            title: "트레이딩 기초 가이드",
            description: "초보자를 위한 완벽한 시작 가이드",
            icon: /* @__PURE__ */ jsx(BookOpen, { className: "w-8 h-8", style: { color: primaryColor } }),
            downloads: "15.2K",
            type: "PDF"
          },
          {
            title: "리스크 관리 체크리스트",
            description: "손실을 최소화하는 핵심 원칙들",
            icon: /* @__PURE__ */ jsx(Shield, { className: "w-8 h-8", style: { color: accentColor } }),
            downloads: "8.7K",
            type: "PDF"
          },
          {
            title: "시장 분석 템플릿",
            description: "체계적인 시장 분석을 위한 도구",
            icon: /* @__PURE__ */ jsx(BarChart3, { className: "w-8 h-8", style: { color: theme === "dark" ? "#00d4ff" : "#0066cc" } }),
            downloads: "12.1K",
            type: "Excel"
          }
        ].map((resource, index) => /* @__PURE__ */ jsxs("div", { className: `${bgSecondary} backdrop-blur-sm rounded-lg p-6 border ${borderColor} ${hoverBorder} transition-all duration-300`, children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4 mb-4", children: [
            resource.icon,
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("h3", { className: `text-xl font-semibold ${textPrimary}`, children: resource.title }),
              /* @__PURE__ */ jsx("p", { className: textSecondary, children: resource.description })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsxs("div", { className: `flex items-center gap-4 text-sm ${textTertiary}`, children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1", children: [
                /* @__PURE__ */ jsx(Download, { className: "w-4 h-4" }),
                resource.downloads
              ] }),
              /* @__PURE__ */ jsx("span", { className: `px-2 py-1 rounded text-xs ${theme === "dark" ? "bg-gray-700" : "bg-slate-100"}`, children: resource.type })
            ] }),
            /* @__PURE__ */ jsx("button", { className: `px-4 py-2 rounded-lg font-medium transition-colors duration-300 ${theme === "dark" ? "bg-[#00d4ff] hover:bg-cyan-400 text-black" : "bg-[#0066cc] hover:bg-blue-700 text-white"}`, children: "다운로드" })
          ] })
        ] }, index)) })
      ] }),
      /* @__PURE__ */ jsx("div", { className: `py-16 bg-gradient-to-r from-[#0066cc] to-[#00b894]`, children: /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center", children: [
        /* @__PURE__ */ jsx("h2", { className: `text-3xl font-bold mb-4 text-white`, children: "지금 시작하세요" }),
        /* @__PURE__ */ jsx("p", { className: `text-xl mb-8 text-blue-100`, children: "인사이트를 실제 수익으로 바꿔보세요" }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row justify-center gap-4", children: [
          /* @__PURE__ */ jsx("button", { className: `px-8 py-3 rounded-lg font-semibold transition-colors duration-300 bg-white text-[#0066cc] hover:bg-gray-100`, children: "무료 체험 시작" }),
          /* @__PURE__ */ jsx("button", { className: `border-2 border-white text-white px-8 py-3 rounded-lg font-semibold transition-colors duration-300 bg-transparent hover:bg-white hover:text-[#0066cc]`, children: "전문가 상담" })
        ] })
      ] }) })
    ] }),
    " ",
    /* @__PURE__ */ jsx(Footer, { onLinkClick: (linkName) => linkName })
  ] });
}
const route69 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: BlogInsights,
  meta: meta$1
}, Symbol.toStringTag, { value: "Module" }));
const route70 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null
}, Symbol.toStringTag, { value: "Module" }));
function createWS(onData) {
  const WS_URL = "ws://localhost:8000/ws";
  const ws2 = new WebSocket(WS_URL);
  ws2.onopen = () => console.log("[WS] connected:", WS_URL);
  ws2.onmessage = (ev) => {
    try {
      onData(JSON.parse(ev.data));
    } catch (e) {
      console.warn("[WS] bad message", e);
    }
  };
  ws2.onerror = (e) => console.error("[WS] error", e);
  ws2.onclose = () => console.log("[WS] closed");
  return ws2;
}
const bg = (s) => s === "LONG" ? "#16a34a" : s === "SHORT" ? "#dc2626" : "#2563eb";
function Hud({ signal, cvd, vwap, price }) {
  const htfText = signal === "LONG" ? "▲ 상승" : signal === "SHORT" ? "▼ 하락" : "■ 중립";
  const band = (p, v) => p && v ? (Math.abs((p - v) / v) * 100).toFixed(3) + "%" : "-";
  const cell = (label, value) => /* @__PURE__ */ jsxs("div", { style: { background: bg(signal), padding: 8, borderRadius: 8, textAlign: "center" }, children: [
    /* @__PURE__ */ jsx("div", { style: { opacity: 0.8, fontSize: 12 }, children: label }),
    /* @__PURE__ */ jsx("div", { style: { fontWeight: 700 }, children: value })
  ] });
  return /* @__PURE__ */ jsxs("div", { style: {
    display: "grid",
    gridTemplateColumns: "repeat(5,minmax(0,1fr))",
    gap: 8,
    padding: 8,
    background: "#0b1220",
    border: "1px solid #1f2937",
    borderRadius: 12
  }, children: [
    cell("HTF", htfText),
    cell("VWAP", band(price, vwap)),
    cell("CVD", Number.isFinite(cvd) ? cvd.toFixed(0) : "-"),
    cell("현재가", price ? price.toString() : "-"),
    cell("신호", signal === "NEUTRAL" ? "대기" : signal === "LONG" ? "롱 진입" : "숏 진입")
  ] });
}
function PricePanel({ price, vwap }) {
  return /* @__PURE__ */ jsxs("div", { style: { display: "flex", gap: 12, alignItems: "baseline", padding: "8px 0" }, children: [
    /* @__PURE__ */ jsx("div", { style: { fontSize: 28, fontWeight: 700, color: "#e5e7eb" }, children: "현재가" }),
    /* @__PURE__ */ jsx("div", { style: { fontSize: 28, color: "#e5e7eb" }, children: price ? price.toFixed(3) : "-" }),
    /* @__PURE__ */ jsx("div", { style: { marginLeft: 24, color: "#94a3b8" }, children: "VWAP" }),
    /* @__PURE__ */ jsx("div", { style: { color: "#facc15" }, children: vwap ? vwap.toFixed(3) : "-" })
  ] });
}
function SignalBadge({ signal }) {
  const color = signal === "LONG" ? "#16a34a" : signal === "SHORT" ? "#dc2626" : "#2563eb";
  const text = signal === "NEUTRAL" ? "대기" : signal === "LONG" ? "롱 진입" : "숏 진입";
  return /* @__PURE__ */ jsx("div", { style: {
    display: "inline-block",
    padding: "6px 10px",
    borderRadius: 9999,
    background: color,
    color: "white",
    fontWeight: 700
  }, children: text });
}
const API_BASE = "http://localhost:8000";
function App() {
  const [data, setData] = useState({
    cvd: 0,
    last_price: null,
    vwap: null,
    signal: "NEUTRAL"
  });
  const [initialCandles, setInitialCandles] = useState([]);
  const wsRef = useRef(null);
  useEffect(() => {
    fetch(`${API_BASE}/api/klines`).then((r) => r.json()).then((arr) => setInitialCandles(arr)).catch((e) => console.error("load klines error:", e));
    wsRef.current = createWS(
      (d) => setData((prev) => ({ ...prev, ...d }))
    );
    return () => {
      var _a;
      return (_a = wsRef.current) == null ? void 0 : _a.close();
    };
  }, []);
  return /* @__PURE__ */ jsxs(
    "div",
    {
      style: {
        maxWidth: 1200,
        margin: "24px auto",
        padding: "0 16px",
        fontFamily: "system-ui, -apple-system, Segoe UI, Roboto"
      },
      children: [
        /* @__PURE__ */ jsx("h2", { style: { margin: "8px 0" }, children: "TradingGear – SOL 30m 실시간 (HUD + 차트)" }),
        /* @__PURE__ */ jsx(PricePanel, { price: data.last_price ?? null, vwap: data.vwap ?? null }),
        /* @__PURE__ */ jsx(SignalBadge, { signal: data.signal ?? "NEUTRAL" }),
        /* @__PURE__ */ jsx("div", { style: { height: 12 } }),
        /* @__PURE__ */ jsx(
          Hud,
          {
            signal: data.signal ?? "NEUTRAL",
            cvd: data.cvd ?? 0,
            vwap: data.vwap ?? null,
            price: data.last_price ?? null
          }
        ),
        /* @__PURE__ */ jsx("div", { style: { height: 24 } }),
        initialCandles.length > 0 && /* @__PURE__ */ jsx(
          Chart,
          {
            initial: initialCandles,
            lastPrice: data.last_price ?? null,
            vwap: data.vwap ?? null,
            signal: data.signal ?? "NEUTRAL"
          }
        ),
        /* @__PURE__ */ jsxs("div", { style: { marginTop: 24, fontSize: 12, color: "#94a3b8" }, children: [
          "WS:",
          " ",
          /* @__PURE__ */ jsx("code", { children: "ws://localhost:8000/ws" }),
          " · API: ",
          /* @__PURE__ */ jsx("code", { children: API_BASE })
        ] })
      ]
    }
  );
}
const route72 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: App
}, Symbol.toStringTag, { value: "Module" }));
function MainRoute() {
  return /* @__PURE__ */ jsx(App, {});
}
const route71 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: MainRoute
}, Symbol.toStringTag, { value: "Module" }));
function CVDTracker() {
  const [cvd, setCvd] = useState(0);
  useEffect(() => {
    const fetchCVD = async () => {
      try {
        const url = "https://api.binance.com/api/v3/trades?symbol=SOLUSDT&limit=1000";
        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const trades = await res.json();
        let cumulative = 0;
        trades.forEach((trade) => {
          const qty = parseFloat(trade.qty);
          cumulative += trade.isBuyerMaker ? qty : -qty;
        });
        console.log("CVD =", cumulative.toFixed(4));
        setCvd(cumulative);
      } catch (err) {
        console.error("CVD fetch 실패:", err);
      }
    };
    fetchCVD();
    const interval = setInterval(fetchCVD, 6e4);
    return () => clearInterval(interval);
  }, []);
  return /* @__PURE__ */ jsxs("h1", { children: [
    "CVD: ",
    cvd.toFixed(4)
  ] });
}
const route73 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: CVDTracker
}, Symbol.toStringTag, { value: "Module" }));
function BinanceGuidePage() {
  const { theme, initializeTheme } = useThemeStore();
  const [modalImg, setModalImg] = useState(null);
  useEffect(() => {
    initializeTheme();
  }, [initializeTheme]);
  const textPrimary = theme === "dark" ? "text-slate-100" : "text-slate-900";
  const textSecondary = theme === "dark" ? "text-slate-300" : "text-slate-600";
  const steps = [
    {
      img: "/doc/binance/image1.png",
      title: "1. binance.com 접속 및 로그인",
      desc: "브라우저에서 binance.com에 접속합니다. 우측 상단 [Log In] 버튼을 클릭 후 계정에 로그인합니다."
    },
    {
      img: "/doc/binance/image2.png",
      title: "2. API Management 이동",
      desc: "메인 메뉴에서 [Account] → [API Management]를 클릭합니다."
    },
    {
      img: "/doc/binance/image3.png",
      title: "3. Create API",
      desc: "[Create API] 버튼을 클릭합니다."
    },
    {
      img: "/doc/binance/image4.png",
      title: "4. System generated",
      desc: "[System generated] 옵션을 선택합니다."
    },
    {
      img: "/doc/binance/image5.png",
      title: "5. Next 선택",
      desc: "Next 버튼을 클릭합니다."
    },
    {
      img: "/doc/binance/image6.png",
      title: "6. Label API Key to proceed에서 Label 입력",
      desc: "Label API Key to proceed 단계에서 라벨을 입력합니다."
    },
    {
      img: "/doc/binance/image7.png",
      title: "7. Additional Verification Method Required",
      desc: "Additional Verification 단계에서 Passkeys 선택 후 Enable를 클릭합니다."
    },
    {
      img: "/doc/binance/image8.png",
      title: "8. PassKey 추가",
      desc: "[Add PassKey] 버튼을 클릭하세요."
    },
    {
      img: "/doc/binance/image9.png",
      title: "9. 이메일 코드 입력",
      desc: "가입 시 등록한 이메일로 전송된 인증 코드를 입력합니다."
    },
    {
      img: "/doc/binance/image10.png",
      title: "10. 휴대폰 인증",
      desc: "등록된 휴대폰 번호로 전송된 인증 코드를 입력합니다."
    },
    {
      img: "/doc/binance/image11.png",
      title: "11. PassKeys 생성 확인",
      desc: "PassKeys 정상 생성 여부를 확인합니다."
    },
    {
      img: "/doc/binance/image12.png",
      title: "12. 다시 [Account] 이동",
      desc: "메인메뉴로 이동 후 [Account] 로 이동해주세요."
    },
    {
      img: "/doc/binance/image13.png",
      title: "13. API Management",
      desc: "API Management 를 클릭하세요."
    },
    {
      img: "/doc/binance/image14.png",
      title: "14. 항목 동의",
      desc: "By checking this box, all existing API Key(s) on your master account and sub-accounts will be subject to Default Security Controls 항목의 체크박스를 클릭하여 체크합니다."
    },
    {
      img: "/doc/binance/image15.png",
      title: "15. Create API",
      desc: "Create API를 선택하세요."
    },
    {
      img: "/doc/binance/image16.png",
      title: "16. System generated",
      desc: "System generated를 클릭한 후 Next를 클릭합니다."
    },
    {
      img: "/doc/binance/image17.png",
      title: "17. Label 입력",
      desc: "Label을 입력해주세요."
    },
    {
      img: "/doc/binance/image18.png",
      title: "18. 키 생성 확인",
      desc: "키생성을 확인한 후, API Key / Secret Key를 복사해놓고 트레이딩기어 사이트로 이동 후 로그인합니다."
    },
    {
      img: "/doc/binance/image19.png",
      title: "19. 계정관리",
      desc: "트레이딩기어의 계정관리로 이동해주세요."
    },
    {
      img: "/doc/binance/image19.png",
      title: "20. API Key 입력",
      desc: "사진과 같이, 표시한 부분을 입력한 뒤 [계정 수정] 버튼을 클릭합니다."
    }
  ];
  return /* @__PURE__ */ jsx("div", { className: `min-h-screen transition-all duration-300 `, children: /* @__PURE__ */ jsxs("main", { className: "max-w-5xl mx-auto px-4 lg:px-8 py-20 space-y-16", children: [
    steps.map((step, idx) => /* @__PURE__ */ jsxs(
      "section",
      {
        className: "flex flex-col items-center gap-6 text-center",
        children: [
          /* @__PURE__ */ jsx(
            "img",
            {
              src: step.img,
              alt: step.title,
              onClick: () => setModalImg(step.img),
              className: `w-full max-w-3xl rounded-xl border cursor-zoom-in transition-all duration-300
                dark:shadow-lg dark:shadow-cyan-400/10 dark:border-slate-700
                shadow-lg border-slate-200`
            }
          ),
          /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsx("h2", { className: `text-2xl font-bold ${textPrimary}`, children: step.title }),
            /* @__PURE__ */ jsx("p", { className: `text-lg leading-relaxed ${textSecondary}`, children: step.desc })
          ] })
        ]
      },
      idx
    )),
    modalImg && /* @__PURE__ */ jsx(
      "button",
      {
        className: "fixed inset-0 bg-black/70 flex justify-center items-center z-50 p-4 cursor-zoom-out",
        onClick: () => setModalImg(null),
        "aria-label": "이미지 닫기",
        children: /* @__PURE__ */ jsx(
          "img",
          {
            src: modalImg,
            alt: "확대 이미지",
            className: "max-w-[90vw] max-h-[90vh] rounded-xl shadow-2xl"
          }
        )
      }
    )
  ] }) });
}
const meta = () => {
  return [
    { title: "문서 - TRADING GEAR" },
    { name: "doc", content: "AI 트레이딩의 새로운 시대" }
  ];
};
function DocsPage() {
  const { theme, initializeTheme } = useThemeStore();
  const [activeSidebarItem, setActiveSidebarItem] = useState("api-guide");
  const [isCodeCopied, setIsCodeCopied] = useState("");
  const [modalImg, setModalImg] = useState(null);
  useEffect(() => {
    initializeTheme();
  }, [initializeTheme]);
  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setIsCodeCopied(id);
    setTimeout(() => setIsCodeCopied(""), 2e3);
  };
  const themeClasses = theme === "dark" ? "bg-gradient-to-br from-slate-900 to-slate-800 text-white" : "bg-gradient-to-br from-white to-slate-50 text-slate-900";
  const textPrimary = theme === "dark" ? "text-white" : "text-slate-900";
  const textSecondary = theme === "dark" ? "text-slate-300" : "text-slate-600";
  const primaryColor = theme === "dark" ? "text-cyan-400" : "text-blue-600";
  const sidebarItems = [
    {
      id: "api-guide",
      title: "API 연동 가이드",
      icon: "🔗",
      children: [
        { id: "binance", title: "바이낸스" },
        { id: "upbit", title: "업비트" },
        { id: "bithumb", title: "빗썸" }
      ]
    },
    { id: "security", title: "보안 안내", icon: "🔒" },
    { id: "examples", title: "응용 예시", icon: "💻" },
    { id: "faq", title: "FAQ", icon: "❓" }
  ];
  const CodeBlock = ({ children, language = "javascript", id, title }) => /* @__PURE__ */ jsxs(
    "div",
    {
      className: `${theme === "dark" ? "bg-slate-800" : "bg-slate-100"} rounded-lg border ${theme === "dark" ? "border-slate-700" : "border-slate-300"} overflow-hidden my-4`,
      children: [
        title && /* @__PURE__ */ jsxs(
          "div",
          {
            className: `px-4 py-2 ${theme === "dark" ? "bg-slate-700 text-slate-300" : "bg-slate-200 text-slate-700"} text-sm font-medium border-b ${theme === "dark" ? "border-slate-600" : "border-slate-300"} flex justify-between items-center`,
            children: [
              /* @__PURE__ */ jsx("span", { children: title }),
              /* @__PURE__ */ jsx(
                "button",
                {
                  onClick: () => copyToClipboard(children, id),
                  className: `px-2 py-1 text-xs rounded ${theme === "dark" ? "bg-slate-600 hover:bg-slate-500 text-white" : "bg-slate-300 hover:bg-slate-400 text-slate-800"} transition-colors duration-200`,
                  children: isCodeCopied === id ? "복사됨!" : "복사"
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ jsx("pre", { className: "p-4 overflow-x-auto", children: /* @__PURE__ */ jsx(
          "code",
          {
            className: `text-sm ${theme === "dark" ? "text-slate-300" : "text-slate-700"}`,
            children
          }
        ) })
      ]
    }
  );
  const renderContent = () => {
    switch (activeSidebarItem) {
      case "api-guide":
        return /* @__PURE__ */ jsxs("div", { className: "space-y-10", children: [
          /* @__PURE__ */ jsxs("section", { className: "py-16 text-center relative overflow-hidden", children: [
            /* @__PURE__ */ jsxs("div", { className: "absolute inset-0 -z-10", children: [
              /* @__PURE__ */ jsx("div", { className: "w-96 h-96 bg-blue-400/20 rounded-full blur-3xl top-0 left-1/3 absolute animate-pulse" }),
              /* @__PURE__ */ jsx("div", { className: "w-72 h-72 bg-emerald-400/20 rounded-full blur-2xl bottom-0 right-1/4 absolute animate-pulse" })
            ] }),
            /* @__PURE__ */ jsxs(
              "h1",
              {
                className: `text-4xl lg:text-6xl font-bold mb-6 bg-clip-text text-transparent ${theme === "dark" ? "bg-gradient-to-r from-white to-cyan-400" : "bg-gradient-to-r from-slate-900 to-blue-600"}`,
                children: [
                  "거래소 API Key 하나로 ",
                  /* @__PURE__ */ jsx("br", {}),
                  "전략 설계와 차트 분석을"
                ]
              }
            ),
            /* @__PURE__ */ jsxs("p", { className: `text-lg ${textSecondary} max-w-3xl mx-auto mb-10`, children: [
              "어떤 거래소든 API Key만 입력하면 데이터를 가져와,",
              /* @__PURE__ */ jsx("span", { className: "font-semibold", children: " 차트와 지표로 즉시 변환" }),
              "합니다.",
              /* @__PURE__ */ jsx("br", {}),
              "사용자는 복잡한 설정 없이",
              " ",
              /* @__PURE__ */ jsx("span", { className: "font-semibold", children: "전략 설계 → 분석 → 알림 설정" }),
              " ",
              "전 과정을 ",
              /* @__PURE__ */ jsx("br", {}),
              "UI로 손쉽게 진행할 수 있습니다."
            ] }),
            /* @__PURE__ */ jsx("div", { className: "flex flex-col sm:flex-row justify-center gap-8 max-w-4xl mx-auto", children: [
              {
                icon: "🗝️",
                title: "API Key 입력",
                desc: "거래소에서 발급받은 Key를 안전하게 입력합니다."
              },
              {
                icon: "📊",
                title: "데이터 변환",
                desc: "원시 데이터를 차트와 지표로 즉시 변환합니다."
              },
              {
                icon: "⚡",
                title: "전략 설계 시각화",
                desc: "쉬운 UI를 이용해 전략을 시각화하고, 커스텀 지표를 표시합니다."
              }
            ].map((step, idx) => /* @__PURE__ */ jsxs(
              "div",
              {
                className: `
        rounded-2xl p-6 flex-1 flex flex-col items-center gap-3 text-center transition-all duration-300 hover:-translate-y-1
        ${theme === "dark" ? "bg-slate-950/80 border border-slate-700/60 shadow-lg shadow-cyan-400/5 hover:shadow-cyan-400/10 text-slate-100" : "bg-white/90 border border-blue-200/30 shadow-md hover:shadow-xl text-slate-900"}
      `,
                children: [
                  /* @__PURE__ */ jsx("div", { className: "text-4xl", children: step.icon }),
                  /* @__PURE__ */ jsx(
                    "h3",
                    {
                      className: `text-xl font-bold ${theme === "dark" ? "text-slate-200" : "text-slate-800"}`,
                      children: step.title
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "p",
                    {
                      className: `text-sm ${theme === "dark" ? "text-slate-400" : "text-slate-600"}`,
                      children: step.desc
                    }
                  )
                ]
              },
              idx
            )) }),
            /* @__PURE__ */ jsxs(
              "section",
              {
                className: `
    mt-10 mb-0 rounded-xl p-6 transition-all duration-300
    ${theme === "dark" ? "bg-slate-950/70 border border-yellow-400/40 shadow-md shadow-yellow-400/5 text-slate-200" : "bg-yellow-50 border-l-4 border-yellow-500 text-slate-900"}
  `,
                children: [
                  /* @__PURE__ */ jsx("p", { className: "font-semibold text-lg", children: "🔒 보안 안내" }),
                  /* @__PURE__ */ jsx("p", { className: "mt-2", children: "API Key는 절대 서버에 저장되지 않으며, 반드시 로컬 환경(.env) 또는 안전한 비밀 저장소에 보관하세요." })
                ]
              }
            )
          ] }),
          [
            {
              img: "/doc/main/key.png",
              title: "① API Key 입력",
              desc: "바이낸스, 업비트, 빗썸 등 다양한 거래소 API를 지원합니다. 키만 입력하면 즉시 연동됩니다."
            },
            {
              img: "/chart.png",
              title: "② 데이터 변환",
              desc: "복잡한 원시 데이터를 TradingGear가 자동 변환하여, 직관적인 차트와 지표로 제공합니다."
            },
            {
              img: "/doc/main/zonryak.png",
              title: "③ 전략 설계",
              desc: "UI에서 매매 전략을 손쉽게 추가하고, 백테스트 및 시뮬레이션으로 검증할 수 있습니다."
            },
            {
              img: "/doc/main/meme.png",
              title: "④ 성과 분석과 알림",
              desc: "성과 분석 대시보드와 실시간 신호 제공으로, 빠르고 정확한 의사결정을 지원합니다."
            },
            {
              img: "chart.png",
              title: "⑤ 다중 거래 모니터링",
              desc: "여러 종목과 거래소를 동시에 모니터링하여, 빠른 판단과 대응으로 투자 효율을 극대화합니다."
            },
            {
              img: "/doc/main/vwap.png",
              title: "⑥ 사용자 맞춤 지표",
              desc: "VWAP, OB Zone, ATR 등 다양한 지표를 조합해 자신만의 전략을 최적화할 수 있습니다."
            },
            {
              img: "/doc/main/alram.png",
              title: "⑦ 알림 기능",
              desc: "가격 도달, 거래량 급등락 등 중요 이벤트 발생 시 실시간 알림으로 즉시 대응 가능합니다."
            }
          ].map((step, idx) => /* @__PURE__ */ jsxs(
            "section",
            {
              className: `flex flex-col lg:flex-row items-center gap-12 ${idx % 2 ? "lg:flex-row-reverse" : ""}`,
              children: [
                /* @__PURE__ */ jsx(
                  "img",
                  {
                    src: step.img,
                    alt: step.title,
                    onClick: () => setModalImg(step.img),
                    className: `w-full lg:w-1/2 rounded-xl border cursor-zoom-in transition-all duration-300
        ${theme === "dark" ? "shadow-lg shadow-cyan-400/10 border-slate-700" : "shadow-lg border-slate-200"}`
                  }
                ),
                /* @__PURE__ */ jsxs("div", { className: "lg:w-1/2 space-y-4 text-center lg:text-left", children: [
                  /* @__PURE__ */ jsx(
                    "h2",
                    {
                      className: `text-3xl font-bold transition-colors ${theme === "dark" ? "text-slate-100" : "text-slate-900"}`,
                      children: step.title
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "p",
                    {
                      className: `text-lg leading-relaxed ${theme === "dark" ? "text-slate-300" : "text-slate-600"}`,
                      children: step.desc
                    }
                  )
                ] })
              ]
            },
            idx
          )),
          modalImg && /* @__PURE__ */ jsx(
            "button",
            {
              className: "fixed inset-0 bg-black/70 flex justify-center items-center z-50 p-4 cursor-zoom-out",
              onClick: () => setModalImg(null),
              "aria-label": "이미지 닫기",
              children: /* @__PURE__ */ jsx(
                "img",
                {
                  src: modalImg,
                  alt: "확대 이미지",
                  className: "max-w-[90vw] max-h-[90vh] rounded-xl shadow-2xl"
                }
              )
            }
          ),
          /* @__PURE__ */ jsx("section", { className: "bg-slate-100 dark:bg-slate-900 text-center p-8 rounded-lg", children: /* @__PURE__ */ jsxs("p", { className: "text-sm font-medium text-slate-700 dark:text-slate-300", children: [
            "⚠️ 당사는 투자 자문이나 매매 지시를 제공하지 않습니다.",
            /* @__PURE__ */ jsx("br", {}),
            "오직 차트 및 데이터 가공·시각화 프로그램만 제공합니다."
          ] }) })
        ] });
      case "binance":
        return /* @__PURE__ */ jsxs("div", { className: "space-y-6 relative", children: [
          /* @__PURE__ */ jsxs("div", { className: "absolute inset-0 -z-10", children: [
            /* @__PURE__ */ jsx("div", { className: "w-72 h-72 bg-blue-400/10 rounded-full blur-3xl top-0 left-1/3 absolute animate-pulse" }),
            /* @__PURE__ */ jsx("div", { className: "w-56 h-56 bg-emerald-400/10 rounded-full blur-2xl bottom-0 right-1/4 absolute animate-pulse" })
          ] }),
          /* @__PURE__ */ jsx(
            "h1",
            {
              className: `text-3xl lg:text-4xl font-bold transition-colors ${textPrimary}`,
              children: "바이낸스 API 연동"
            }
          ),
          /* @__PURE__ */ jsx("ol", { className: "space-y-4", children: [
            "바이낸스 계정 로그인 후 API 관리 페이지 접속",
            "새 API 키 생성, IP 제한 설정",
            "TradingGear 차트에서 API 입력란에 Key와 Secret 입력",
            "테스트용 샌드박스 연결 확인"
          ].map((step, idx) => /* @__PURE__ */ jsxs(
            "li",
            {
              className: `p-4 rounded-2xl border transition-all duration-300 flex items-center gap-3
          ${theme === "dark" ? "bg-slate-950/80 border-slate-700/50 shadow-sm hover:shadow-cyan-400/20 text-slate-200 hover:-translate-y-1" : "bg-white border-blue-200/40 shadow-sm hover:shadow-blue-400/20 text-slate-900 hover:-translate-y-1"}`,
              children: [
                /* @__PURE__ */ jsxs("span", { className: "text-xl", children: [
                  idx + 1,
                  "."
                ] }),
                /* @__PURE__ */ jsx("p", { className: "text-sm lg:text-base", children: step })
              ]
            },
            idx
          )) }),
          /* @__PURE__ */ jsxs(
            "div",
            {
              className: `mb-6 rounded-xl p-6 border-l-4 flex items-start gap-4 transition-all duration-300
      ${theme === "dark" ? "bg-gradient-to-r from-slate-950/80 to-slate-900/80 border-cyan-400/50 shadow-md text-slate-200" : "bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-400 shadow-md text-slate-900"}`,
              children: [
                /* @__PURE__ */ jsx("div", { className: "text-2xl mt-1", children: "🔒" }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("p", { className: "font-semibold text-lg", children: "보안 안내" }),
                  /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm leading-relaxed", children: "API Key는 절대 서버에 저장하지 마세요. 반드시 로컬 환경(.env) 또는 안전한 비밀 저장소에 보관하세요." })
                ] })
              ]
            }
          ),
          /* @__PURE__ */ jsx(BinanceGuidePage, {})
        ] });
      case "upbit":
        return /* @__PURE__ */ jsxs("div", { className: "space-y-6 relative", children: [
          /* @__PURE__ */ jsxs("div", { className: "absolute inset-0 -z-10", children: [
            /* @__PURE__ */ jsx("div", { className: "w-72 h-72 bg-blue-400/10 rounded-full blur-3xl top-0 left-1/3 absolute animate-pulse" }),
            /* @__PURE__ */ jsx("div", { className: "w-56 h-56 bg-emerald-400/10 rounded-full blur-2xl bottom-0 right-1/4 absolute animate-pulse" })
          ] }),
          /* @__PURE__ */ jsx(
            "h1",
            {
              className: `text-3xl lg:text-4xl font-bold transition-colors ${textPrimary}`,
              children: "업비트 API 연동"
            }
          ),
          /* @__PURE__ */ jsx("ol", { className: "space-y-4", children: [
            "바이낸스 계정 로그인 후 API 관리 페이지 접속",
            "새 API 키 생성, IP 제한 설정",
            "TradingGear 차트에서 API 입력란에 Key와 Secret 입력",
            "테스트용 샌드박스 연결 확인"
          ].map((step, idx) => /* @__PURE__ */ jsxs(
            "li",
            {
              className: `p-4 rounded-2xl border transition-all duration-300 flex items-center gap-3
          ${theme === "dark" ? "bg-slate-950/80 border-slate-700/50 shadow-sm hover:shadow-cyan-400/20 text-slate-200 hover:-translate-y-1" : "bg-white border-blue-200/40 shadow-sm hover:shadow-blue-400/20 text-slate-900 hover:-translate-y-1"}`,
              children: [
                /* @__PURE__ */ jsxs("span", { className: "text-xl", children: [
                  idx + 1,
                  "."
                ] }),
                /* @__PURE__ */ jsx("p", { className: "text-sm lg:text-base", children: step })
              ]
            },
            idx
          )) }),
          /* @__PURE__ */ jsxs(
            "div",
            {
              className: `mb-6 rounded-xl p-6 border-l-4 flex items-start gap-4 transition-all duration-300
      ${theme === "dark" ? "bg-gradient-to-r from-slate-950/80 to-slate-900/80 border-cyan-400/50 shadow-md text-slate-200" : "bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-400 shadow-md text-slate-900"}`,
              children: [
                /* @__PURE__ */ jsx("div", { className: "text-2xl mt-1", children: "🔒" }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("p", { className: "font-semibold text-lg", children: "보안 안내" }),
                  /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm leading-relaxed", children: "API Key는 절대 서버에 저장하지 마세요. 반드시 로컬 환경(.env) 또는 안전한 비밀 저장소에 보관하세요." })
                ] })
              ]
            }
          ),
          /* @__PURE__ */ jsx(BinanceGuidePage, {})
        ] });
      case "bithumb":
        return /* @__PURE__ */ jsxs("div", { className: "space-y-6 relative", children: [
          /* @__PURE__ */ jsxs("div", { className: "absolute inset-0 -z-10", children: [
            /* @__PURE__ */ jsx("div", { className: "w-72 h-72 bg-blue-400/10 rounded-full blur-3xl top-0 left-1/3 absolute animate-pulse" }),
            /* @__PURE__ */ jsx("div", { className: "w-56 h-56 bg-emerald-400/10 rounded-full blur-2xl bottom-0 right-1/4 absolute animate-pulse" })
          ] }),
          /* @__PURE__ */ jsx(
            "h1",
            {
              className: `text-3xl lg:text-4xl font-bold transition-colors ${textPrimary}`,
              children: "빗썸 API 연동"
            }
          ),
          /* @__PURE__ */ jsx("ol", { className: "space-y-4", children: [
            "바이낸스 계정 로그인 후 API 관리 페이지 접속",
            "새 API 키 생성, IP 제한 설정",
            "TradingGear 차트에서 API 입력란에 Key와 Secret 입력",
            "테스트용 샌드박스 연결 확인"
          ].map((step, idx) => /* @__PURE__ */ jsxs(
            "li",
            {
              className: `p-4 rounded-2xl border transition-all duration-300 flex items-center gap-3
          ${theme === "dark" ? "bg-slate-950/80 border-slate-700/50 shadow-sm hover:shadow-cyan-400/20 text-slate-200 hover:-translate-y-1" : "bg-white border-blue-200/40 shadow-sm hover:shadow-blue-400/20 text-slate-900 hover:-translate-y-1"}`,
              children: [
                /* @__PURE__ */ jsxs("span", { className: "text-xl", children: [
                  idx + 1,
                  "."
                ] }),
                /* @__PURE__ */ jsx("p", { className: "text-sm lg:text-base", children: step })
              ]
            },
            idx
          )) }),
          /* @__PURE__ */ jsxs(
            "div",
            {
              className: `mb-6 rounded-xl p-6 border-l-4 flex items-start gap-4 transition-all duration-300
      ${theme === "dark" ? "bg-gradient-to-r from-slate-950/80 to-slate-900/80 border-cyan-400/50 shadow-md text-slate-200" : "bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-400 shadow-md text-slate-900"}`,
              children: [
                /* @__PURE__ */ jsx("div", { className: "text-2xl mt-1", children: "🔒" }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("p", { className: "font-semibold text-lg", children: "보안 안내" }),
                  /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm leading-relaxed", children: "API Key는 절대 서버에 저장하지 마세요. 반드시 로컬 환경(.env) 또는 안전한 비밀 저장소에 보관하세요." })
                ] })
              ]
            }
          ),
          /* @__PURE__ */ jsx(BinanceGuidePage, {})
        ] });
      case "security":
        return /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
          /* @__PURE__ */ jsx("h1", { className: `text-3xl font-bold ${textPrimary}`, children: "보안 안내" }),
          /* @__PURE__ */ jsx("p", { className: `${textSecondary}`, children: "API Key는 절대 서버에 저장하지 않고, 로컬 환경에만 저장하세요. 환경 변수나 안전한 파일을 사용하여 관리합니다." }),
          /* @__PURE__ */ jsx(CodeBlock, { id: "security-note", title: "보안 권장 사항", children: `// API Key를 .env에 저장
TRADING_GEAR_API_KEY=your-api-key
TRADING_GEAR_API_SECRET=your-api-secret

// 서버에 Key 저장 금지` })
        ] });
      case "examples":
        return /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
          /* @__PURE__ */ jsx("h1", { className: `text-3xl font-bold ${textPrimary}`, children: "응용 예시" }),
          /* @__PURE__ */ jsx("p", { className: `${textSecondary}`, children: "TradingGear SDK를 활용한 간단한 봇 예제입니다." }),
          /* @__PURE__ */ jsx(CodeBlock, { id: "example-bot", title: "app.js", children: `const TradingGear = require('trading-gear-sdk');

const client = new TradingGear({ apiKey: '...', apiSecret: '...' });

async function createBot() {
  const bot = await client.bots.createGrid({ symbol: 'BTC/USDT', gridSize: 10 });
  await client.bots.start(bot.id);
  console.log('봇 시작 완료');
}

createBot();` })
        ] });
      case "faq":
        return /* @__PURE__ */ jsxs("div", { className: "space-y-8 relative", children: [
          /* @__PURE__ */ jsx(
            "h1",
            {
              className: `text-3xl font-bold transition-colors ${textPrimary}`,
              children: "FAQ"
            }
          ),
          /* @__PURE__ */ jsx("p", { className: `${textSecondary}`, children: "자주 묻는 질문을 찾아보세요." }),
          /* @__PURE__ */ jsx("div", { className: "space-y-4", children: [
            {
              q: "API 키는 어떻게 생성하나요?",
              a: "대시보드에서 새 API 키를 생성하고 필요한 권한과 IP 제한을 설정하세요."
            },
            {
              q: "API Key를 서버에 저장해도 되나요?",
              a: "권장하지 않습니다. 반드시 로컬 환경이나 안전한 파일에만 저장하세요."
            }
          ].map((item, idx) => /* @__PURE__ */ jsxs(
            "div",
            {
              className: `p-4 rounded-xl transition-all duration-300 border flex flex-col gap-2
          ${theme === "dark" ? "bg-slate-950/80 border-slate-700/50 shadow-sm hover:shadow-cyan-400/20 hover:-translate-y-1 text-slate-200" : "bg-white border-blue-200/40 shadow-sm hover:shadow-blue-400/20 hover:-translate-y-1 text-slate-900"}`,
              children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ jsxs("span", { className: "text-cyan-400 dark:text-emerald-400 font-bold", children: [
                    "Q",
                    idx + 1,
                    "."
                  ] }),
                  /* @__PURE__ */ jsx("h3", { className: "font-semibold text-lg", children: item.q })
                ] }),
                /* @__PURE__ */ jsx("p", { className: "text-sm leading-relaxed text-slate-500 dark:text-slate-300", children: item.a })
              ]
            },
            idx
          )) })
        ] });
      default:
        return /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center h-64", children: /* @__PURE__ */ jsx("p", { className: `${textSecondary} text-lg`, children: "준비 중입니다..." }) });
    }
  };
  const renderSidebar = () => /* @__PURE__ */ jsx(
    "aside",
    {
      className: `hidden lg:block w-60 h-screen sticky top-20 ${theme === "dark" ? "bg-slate-800/60" : "bg-white/90"} backdrop-blur-lg border-r ${theme === "dark" ? "border-cyan-400/20" : "border-blue-600/20"} overflow-y-auto`,
      children: /* @__PURE__ */ jsxs("div", { className: "p-4", children: [
        /* @__PURE__ */ jsx("h2", { className: `text-md font-bold ${textPrimary} mb-4`, children: "문서 목차" }),
        /* @__PURE__ */ jsx("nav", { className: "space-y-2", children: sidebarItems.map((item) => /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: () => {
                if (item.children) {
                  setActiveSidebarItem(
                    (prev) => prev === item.id ? "" : item.id
                  );
                } else {
                  setActiveSidebarItem(item.id);
                }
              },
              className: `w-full text-left text-sm px-3 py-2 rounded-lg transition-all duration-200 flex items-center ${activeSidebarItem === item.id ? `${theme === "dark" ? "bg-cyan-400/20 text-cyan-400" : "bg-blue-600/20 text-blue-600"} font-medium` : `${textSecondary} hover:${primaryColor.replace(
                "text-",
                "text-"
              )} hover:bg-opacity-10`}`,
              children: [
                /* @__PURE__ */ jsx("span", { className: "mr-2", children: item.icon }),
                item.title
              ]
            }
          ),
          item.children && /* @__PURE__ */ jsx("div", { className: "pl-6 mt-1 space-y-1", children: item.children.map((child) => /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => setActiveSidebarItem(child.id),
              className: `w-full text-left text-sm px-2 py-1 rounded-lg transition-all duration-200 ${activeSidebarItem === child.id ? `${theme === "dark" ? "bg-cyan-400/20 text-cyan-400" : "bg-blue-600/20 text-blue-600"} font-medium` : `${textSecondary} hover:${primaryColor.replace(
                "text-",
                "text-"
              )} hover:bg-opacity-10`}`,
              children: child.title
            },
            child.id
          )) })
        ] }, item.id)) })
      ] })
    }
  );
  return /* @__PURE__ */ jsxs("div", { className: `min-h-screen transition-all duration-300 ${themeClasses}`, children: [
    /* @__PURE__ */ jsx(Header, {}),
    /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto px-4 lg:px-8 flex pt-20", children: [
      renderSidebar(),
      /* @__PURE__ */ jsx("main", { className: "flex-1 p-6 lg:p-12 max-w-full", children: renderContent() })
    ] }),
    /* @__PURE__ */ jsx(Footer, { onLinkClick: (linkName) => linkName })
  ] });
}
const route74 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: DocsPage,
  meta
}, Symbol.toStringTag, { value: "Module" }));
function FAQPage() {
  const [search, setSearch] = useState("");
  const [openIndexes, setOpenIndexes] = useState([]);
  const [activeTab, setActiveTab] = useState("all");
  const { theme } = useThemeStore();
  const themeClasses = theme === "dark" ? "bg-gradient-to-br from-slate-900 to-slate-800 text-white" : "bg-gradient-to-br from-white to-slate-50 text-slate-900";
  const textPrimary = theme === "dark" ? "text-white" : "text-slate-900";
  const textSecondary = theme === "dark" ? "text-slate-300" : "text-slate-600";
  const faqs = [
    {
      q: "API Key는 안전하게 보관되나요?",
      a: "네, API Key는 로컬 환경에만 저장되며 서버로 전송되지 않습니다. 또한 AES256 방식으로 암호화되어 저장됩니다.",
      category: "security"
    },
    {
      q: "설치 중 오류가 발생하면?",
      a: "최신 설치 파일을 다시 다운로드해주세요. 그래도 문제가 지속된다면 FAQ의 설치 오류 해결 가이드를 확인하시거나 고객 지원에 문의하세요.",
      category: "general"
    },
    {
      q: "Windows와 macOS 모두 지원되나요?",
      a: "Windows 10 이상, macOS 12 이상을 공식 지원합니다.",
      category: "general"
    },
    {
      q: "무료로 사용할 수 있나요?",
      a: "기본 차트 기능은 무료, 일부 고급 기능은 유료 라이선스로 사용 가능합니다.",
      category: "general"
    },
    {
      q: "라이선스 정책은 어떻게 되나요?",
      a: "1 PC 당 1 라이선스가 원칙이며, 계정 연동과 클라우드 동기화를 지원합니다.",
      category: "license"
    },
    {
      q: "업데이트는 자동으로 되나요?",
      a: "인터넷 연결 시 자동 업데이트 진행. 기업 환경에서는 수동 업데이트도 지원합니다.",
      category: "license"
    },
    {
      q: "모바일 앱도 지원하나요?",
      a: "모바일 뷰어 앱을 제공하며, PC 레이아웃과 연동됩니다. 차트 프로그램은 pc 전용입니다.",
      category: "general"
    },
    {
      q: "차트 레이아웃을 저장할 수 있나요?",
      a: "사용자는 차트 레이아웃, 지표 설정, 색상 테마 등을 무제한 저장/불러오기 가능합니다.",
      category: "general"
    },
    {
      q: "여러 개 거래소 계정을 동시에 연결할 수 있나요?",
      a: "멀티 계정 연결 가능, 포트폴리오를 통합 모드 또는 개별 모드로 확인 가능합니다.",
      category: "general"
    },
    {
      q: "백테스팅 기능도 있나요?",
      a: "전문가용 플랜에서는 전략 백테스팅과 성과 리포트 기능 제공.",
      category: "general"
    },
    {
      q: "다크 모드를 지원하나요?",
      a: "시스템 설정 자동 감지 및 수동 라이트/다크 모드 전환 가능.",
      category: "general"
    },
    {
      q: "기술 지원은 어디서 받을 수 있나요?",
      a: "공식 홈페이지 지원센터 또는 이메일 support@tradinggear.com으로 문의 가능합니다.",
      category: "general"
    }
  ];
  const filteredFaqs = faqs.filter((f) => activeTab === "all" || f.category === activeTab).filter((f) => f.q.toLowerCase().includes(search.toLowerCase()));
  const tabs = [
    { key: "all", label: "전체" },
    { key: "general", label: "일반" },
    { key: "security", label: "보안" },
    { key: "license", label: "라이선스" }
  ];
  const toggleIndex = (idx) => {
    setOpenIndexes(
      (prev) => prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
    );
  };
  return /* @__PURE__ */ jsxs("div", { className: `min-h-screen transition-all duration-300 ${themeClasses}`, children: [
    /* @__PURE__ */ jsx(Header, {}),
    /* @__PURE__ */ jsx(
      "div",
      {
        className: `min-h-screen transition-all duration-300 px-4 lg:px-8 py-20 pt-40 ${theme === "dark" ? "bg-gradient-to-br from-slate-900 to-slate-800" : "bg-gradient-to-br from-white to-slate-50"}`,
        children: /* @__PURE__ */ jsxs("div", { className: "max-w-4xl mx-auto", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center text-center relative z-10", children: [
            /* @__PURE__ */ jsx(
              "h1",
              {
                className: `text-4xl lg:text-6xl font-bold mb-6 bg-clip-text text-transparent ${theme === "dark" ? "bg-gradient-to-r from-white to-cyan-400" : "bg-gradient-to-r from-slate-900 to-blue-600"}`,
                children: "FAQ"
              }
            ),
            /* @__PURE__ */ jsxs("p", { className: `mb-6 ${textSecondary}`, children: [
              "자주 묻는 질문을 빠르게 찾아보세요. ",
              /* @__PURE__ */ jsx("br", {}),
              "검색창을 이용하면 원하는 답변을 쉽게 찾을 수 있습니다."
            ] })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "flex justify-center gap-4 mb-6 flex-wrap", children: tabs.map((tab) => /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => {
                setActiveTab(tab.key);
                setOpenIndexes([]);
              },
              className: `px-4 py-2 rounded-full font-semibold transition-colors border ${activeTab === tab.key ? theme === "dark" ? "bg-cyan-400 text-slate-900 border-cyan-400/50" : "bg-blue-600 text-white border-blue-600/50" : theme === "dark" ? "bg-slate-700 text-slate-300 border-slate-600/50 hover:bg-slate-600" : "bg-white text-slate-700 border-slate-300/50 hover:bg-slate-100"}`,
              children: tab.label
            },
            tab.key
          )) }),
          /* @__PURE__ */ jsxs("div", { className: "relative w-full mb-10", children: [
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "text",
                placeholder: "검색어를 입력하세요...",
                value: search,
                onChange: (e) => setSearch(e.target.value),
                className: `w-full p-3 pr-10 rounded-xl border focus:outline-none ${theme === "dark" ? "bg-slate-800 border-slate-700 text-white" : "bg-white border-slate-300 text-slate-900"}`
              }
            ),
            /* @__PURE__ */ jsx(
              "svg",
              {
                className: "w-5 h-5 absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 pointer-events-none",
                xmlns: "http://www.w3.org/2000/svg",
                fill: "none",
                viewBox: "0 0 24 24",
                stroke: "currentColor",
                children: /* @__PURE__ */ jsx(
                  "path",
                  {
                    strokeLinecap: "round",
                    strokeLinejoin: "round",
                    strokeWidth: 2,
                    d: "M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z"
                  }
                )
              }
            )
          ] }),
          /* @__PURE__ */ jsx("div", { className: "space-y-4", children: filteredFaqs.length > 0 ? filteredFaqs.map((faq, idx) => /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: () => {
                toggleIndex(idx);
              },
              className: `w-full text-left rounded-2xl p-6 transition-all duration-300 ${theme === "dark" ? "bg-slate-800/80 border border-slate-700 hover:shadow-cyan-400/10" : "bg-white border border-slate-200 hover:shadow-blue-600/10"}`,
              children: [
                /* @__PURE__ */ jsxs(
                  "h3",
                  {
                    className: `text-lg font-semibold ${textPrimary} flex justify-between items-center`,
                    children: [
                      faq.q,
                      /* @__PURE__ */ jsx("span", { children: openIndexes.includes(idx) ? "−" : "+" })
                    ]
                  }
                ),
                openIndexes.includes(idx) && /* @__PURE__ */ jsx(
                  "p",
                  {
                    className: `mt-3 text-base leading-relaxed ${textSecondary}`,
                    children: faq.a
                  }
                )
              ]
            },
            idx
          )) : /* @__PURE__ */ jsx("p", { className: `${textSecondary} text-center`, children: "검색 결과가 없습니다." }) })
        ] })
      }
    )
  ] });
}
const route75 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: FAQPage
}, Symbol.toStringTag, { value: "Module" }));
const SLASummaryPage = () => {
  const [theme, setTheme] = useState("dark");
  const [isClient, setIsClient] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeMetric, setActiveMetric] = useState("uptime");
  useEffect(() => {
    setIsClient(true);
    const savedTheme = "dark";
    setTheme(savedTheme);
  }, []);
  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
  };
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };
  const themeClasses = theme === "dark" ? "bg-gradient-to-br from-slate-900 to-slate-800 text-white" : "bg-gradient-to-br from-white to-slate-50 text-slate-900";
  const headerClasses = theme === "dark" ? "bg-slate-900/95 border-cyan-400/20" : "bg-white/95 border-blue-600/20";
  const textPrimary = theme === "dark" ? "text-white" : "text-slate-900";
  const textSecondary = theme === "dark" ? "text-slate-300" : "text-slate-600";
  const primaryColor = theme === "dark" ? "text-cyan-400" : "text-blue-600";
  const accentColor = theme === "dark" ? "text-emerald-400" : "text-emerald-600";
  const slaMetrics = [
    {
      id: "uptime",
      title: "서비스 가용성",
      value: "99.9%",
      target: "연간 8.76시간 이하 다운타임",
      icon: "🔄",
      description: "연중무휴 24시간 서비스 제공을 보장합니다.",
      details: [
        "월간 가용성: 99.9% 이상",
        "계획된 점검: 월 1회, 새벽 2-4시",
        "긴급 점검: 사전 통지 후 진행",
        "모니터링: 실시간 서비스 상태 확인"
      ]
    },
    {
      id: "response",
      title: "응답 시간",
      value: "<100ms",
      target: "API 응답 시간 평균",
      icon: "⚡",
      description: "빠른 거래 실행을 위한 최적화된 응답 시간을 제공합니다.",
      details: [
        "API 응답: 평균 100ms 이하",
        "거래 실행: 평균 200ms 이하",
        "데이터 조회: 평균 50ms 이하",
        "백테스팅: 대용량 데이터 30초 이내"
      ]
    },
    {
      id: "support",
      title: "기술 지원",
      value: "24/7",
      target: "연중무휴 지원 체계",
      icon: "🎧",
      description: "언제든지 도움이 필요할 때 신속한 지원을 제공합니다.",
      details: [
        "채팅 지원: 연중무휴 24시간",
        "이메일 지원: 4시간 이내 응답",
        "전화 지원: 평일 9-18시",
        "긴급 지원: 즉시 대응 (Pro/Ultimate)"
      ]
    },
    {
      id: "security",
      title: "보안 수준",
      value: "99.99%",
      target: "보안 사고 방지율",
      icon: "🛡️",
      description: "엔터프라이즈급 보안으로 자산과 데이터를 보호합니다.",
      details: [
        "SSL/TLS 암호화: 모든 통신",
        "API 키 암호화: AES-256",
        "침입 탐지: 실시간 모니터링",
        "보안 감사: 월간 취약점 점검"
      ]
    },
    {
      id: "backup",
      title: "데이터 백업",
      value: "3중화",
      target: "데이터 손실 방지",
      icon: "💾",
      description: "중요한 데이터의 안전한 보관과 복구를 보장합니다.",
      details: [
        "실시간 백업: 자동 동기화",
        "지리적 분산: 3개 지역 저장",
        "복구 시간: 15분 이내",
        "보관 기간: 무제한 (유료 플랜)"
      ]
    },
    {
      id: "performance",
      title: "성능 보장",
      value: "99.5%",
      target: "거래 성공률",
      icon: "📊",
      description: "안정적인 거래 실행과 높은 성능을 보장합니다.",
      details: [
        "거래 성공률: 99.5% 이상",
        "슬리피지: 0.1% 이하",
        "동시 접속: 무제한",
        "처리량: 초당 10,000건"
      ]
    }
  ];
  const compensationTiers = [
    { range: "99.0% - 99.8%", credit: "10%", description: "월 이용료의 10% 크레딧" },
    { range: "98.0% - 98.9%", credit: "25%", description: "월 이용료의 25% 크레딧" },
    { range: "95.0% - 97.9%", credit: "50%", description: "월 이용료의 50% 크레딧" },
    { range: "< 95.0%", credit: "100%", description: "월 이용료의 100% 크레딧" }
  ];
  const supportChannels = [
    {
      channel: "실시간 채팅",
      availability: "24/7",
      response: "즉시",
      plans: ["모든 플랜"],
      icon: "💬"
    },
    {
      channel: "이메일 지원",
      availability: "24/7",
      response: "4시간",
      plans: ["모든 플랜"],
      icon: "📧"
    },
    {
      channel: "전화 지원",
      availability: "평일 9-18시",
      response: "즉시",
      plans: ["Pro", "Ultimate"],
      icon: "📞"
    },
    {
      channel: "전담 매니저",
      availability: "평일 9-18시",
      response: "1시간",
      plans: ["Ultimate"],
      icon: "👨‍💼"
    }
  ];
  return /* @__PURE__ */ jsxs("div", { className: `min-h-screen transition-all duration-300 ${themeClasses}`, children: [
    /* @__PURE__ */ jsxs("header", { className: `fixed top-0 w-full backdrop-blur-lg z-50 border-b transition-all duration-300 ${headerClasses}`, children: [
      /* @__PURE__ */ jsxs("nav", { className: "max-w-6xl mx-auto flex justify-between items-center px-4 lg:px-8 py-4", children: [
        /* @__PURE__ */ jsxs("div", { className: `flex items-center text-2xl font-bold cursor-pointer transition-colors duration-300 ${primaryColor}`, children: [
          /* @__PURE__ */ jsx("span", { className: "text-3xl mr-2", children: "⚙️" }),
          "Trading Gear"
        ] }),
        /* @__PURE__ */ jsxs("ul", { className: "hidden lg:flex items-center space-x-8", children: [
          /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("a", { className: `${textPrimary} hover:text-cyan-400 font-medium cursor-pointer transition-colors duration-300`, children: "홈" }) }),
          /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("a", { className: `${textPrimary} hover:text-cyan-400 font-medium cursor-pointer transition-colors duration-300`, children: "기능" }) }),
          /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("a", { className: `${textPrimary} hover:text-cyan-400 font-medium cursor-pointer transition-colors duration-300`, children: "요금제" }) }),
          /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("a", { className: `${textPrimary} hover:text-cyan-400 font-medium cursor-pointer transition-colors duration-300`, children: "문의" }) }),
          /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(
            "button",
            {
              className: `w-10 h-10 rounded-full border-2 ${theme === "dark" ? "border-cyan-400/20 hover:border-cyan-400 hover:text-cyan-400" : "border-blue-600/20 hover:border-blue-600 hover:text-blue-600"} ${textPrimary} transition-all duration-300 hover:rotate-180 flex items-center justify-center`,
              onClick: toggleTheme,
              children: theme === "dark" ? "🌙" : "☀️"
            }
          ) })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "lg:hidden flex items-center", children: /* @__PURE__ */ jsxs(
          "button",
          {
            className: "w-10 h-10 flex flex-col justify-center items-center space-y-1 focus:outline-none",
            onClick: toggleMobileMenu,
            children: [
              /* @__PURE__ */ jsx("span", { className: `w-6 h-0.5 ${theme === "dark" ? "bg-white" : "bg-slate-700"} transition-all duration-300 ${isMobileMenuOpen ? "rotate-45 translate-y-1.5" : ""}` }),
              /* @__PURE__ */ jsx("span", { className: `w-6 h-0.5 ${theme === "dark" ? "bg-white" : "bg-slate-700"} transition-all duration-300 ${isMobileMenuOpen ? "opacity-0" : ""}` }),
              /* @__PURE__ */ jsx("span", { className: `w-6 h-0.5 ${theme === "dark" ? "bg-white" : "bg-slate-700"} transition-all duration-300 ${isMobileMenuOpen ? "-rotate-45 -translate-y-1.5" : ""}` })
            ]
          }
        ) }),
        /* @__PURE__ */ jsx("button", { className: `hidden lg:block ${theme === "dark" ? "bg-gradient-to-r from-cyan-400 to-emerald-400 text-slate-900 hover:shadow-cyan-400/30" : "bg-gradient-to-r from-blue-600 to-emerald-600 text-white hover:shadow-blue-600/30"} px-6 py-3 rounded-full font-bold hover:transform hover:-translate-y-1 hover:shadow-lg transition-all duration-300`, children: "무료 체험 시작" })
      ] }),
      /* @__PURE__ */ jsx("div", { className: `lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-all duration-300 ${isMobileMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"}`, onClick: toggleMobileMenu }),
      /* @__PURE__ */ jsxs("div", { className: `lg:hidden fixed top-0 right-0 h-full w-80 max-w-[80vw] ${theme === "dark" ? "bg-slate-900/98" : "bg-white/98"} backdrop-blur-lg border-l ${theme === "dark" ? "border-cyan-400/20" : "border-blue-600/20"} z-50 transform transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? "translate-x-0" : "translate-x-full"}`, children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between p-6 border-b border-gray-200/20", children: [
          /* @__PURE__ */ jsxs("div", { className: `flex items-center text-xl font-bold ${primaryColor}`, children: [
            /* @__PURE__ */ jsx("span", { className: "text-2xl mr-2", children: "⚙️" }),
            "Trading Gear"
          ] }),
          /* @__PURE__ */ jsxs("button", { className: "w-8 h-8 flex items-center justify-center focus:outline-none", onClick: toggleMobileMenu, children: [
            /* @__PURE__ */ jsx("span", { className: `w-6 h-0.5 ${theme === "dark" ? "bg-white" : "bg-slate-700"} transition-all duration-300 rotate-45 absolute` }),
            /* @__PURE__ */ jsx("span", { className: `w-6 h-0.5 ${theme === "dark" ? "bg-white" : "bg-slate-700"} transition-all duration-300 -rotate-45 absolute` })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col h-full", children: [
          /* @__PURE__ */ jsxs("ul", { className: "px-6 py-8 space-y-6 flex-1", children: [
            /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("a", { className: `block ${textPrimary} hover:text-cyan-400 font-medium cursor-pointer transition-colors duration-300 py-3 text-lg border-b border-gray-200/10`, children: "홈" }) }),
            /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("a", { className: `block ${textPrimary} hover:text-cyan-400 font-medium cursor-pointer transition-colors duration-300 py-3 text-lg border-b border-gray-200/10`, children: "기능" }) }),
            /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("a", { className: `block ${textPrimary} hover:text-cyan-400 font-medium cursor-pointer transition-colors duration-300 py-3 text-lg border-b border-gray-200/10`, children: "요금제" }) }),
            /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("a", { className: `block ${textPrimary} hover:text-cyan-400 font-medium cursor-pointer transition-colors duration-300 py-3 text-lg border-b border-gray-200/10`, children: "문의" }) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "px-6 pb-8 space-y-4", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between py-4 border-t border-gray-200/20", children: [
              /* @__PURE__ */ jsx("span", { className: `${textPrimary} font-medium`, children: "테마 설정" }),
              /* @__PURE__ */ jsx("button", { className: `w-12 h-12 rounded-full border-2 ${theme === "dark" ? "border-cyan-400/20 hover:border-cyan-400 hover:text-cyan-400" : "border-blue-600/20 hover:border-blue-600 hover:text-blue-600"} ${textPrimary} transition-all duration-300 hover:rotate-180 flex items-center justify-center text-xl`, onClick: toggleTheme, children: theme === "dark" ? "🌙" : "☀️" })
            ] }),
            /* @__PURE__ */ jsx("button", { className: `w-full ${theme === "dark" ? "bg-gradient-to-r from-cyan-400 to-emerald-400 text-slate-900 hover:shadow-cyan-400/30" : "bg-gradient-to-r from-blue-600 to-emerald-600 text-white hover:shadow-blue-600/30"} px-6 py-4 rounded-full font-bold text-lg hover:transform hover:-translate-y-1 hover:shadow-lg transition-all duration-300`, children: "무료 체험 시작" })
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("section", { className: "pt-32 pb-16 text-center relative overflow-hidden", children: [
      /* @__PURE__ */ jsx("div", { className: `absolute inset-0 ${theme === "dark" ? "bg-gradient-radial from-emerald-400/10" : "bg-gradient-radial from-emerald-600/10"} to-transparent` }),
      /* @__PURE__ */ jsxs("div", { className: "max-w-4xl mx-auto px-4 lg:px-8 relative z-10", children: [
        /* @__PURE__ */ jsx("div", { className: "flex justify-center mb-6", children: /* @__PURE__ */ jsx("div", { className: `w-20 h-20 ${theme === "dark" ? "bg-emerald-400/20" : "bg-emerald-600/20"} rounded-full flex items-center justify-center text-4xl`, children: "📊" }) }),
        /* @__PURE__ */ jsx("h1", { className: `text-4xl lg:text-5xl font-bold mb-6 ${theme === "dark" ? "bg-gradient-to-r from-white to-emerald-400" : "bg-gradient-to-r from-slate-900 to-emerald-600"} bg-clip-text text-transparent`, children: "서비스 수준 계약서 요약" }),
        /* @__PURE__ */ jsxs("p", { className: `text-lg lg:text-xl ${textSecondary} mb-8 leading-relaxed`, children: [
          "Trading Gear는 명확한 서비스 품질 기준과",
          /* @__PURE__ */ jsx("br", {}),
          "보상 정책을 통해 신뢰할 수 있는 서비스를 제공합니다."
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row justify-center gap-4", children: [
          /* @__PURE__ */ jsx("div", { className: `inline-flex items-center px-4 py-2 ${theme === "dark" ? "bg-emerald-400/20" : "bg-emerald-600/20"} backdrop-blur-lg rounded-full border ${theme === "dark" ? "border-emerald-400/30" : "border-emerald-600/30"}`, children: /* @__PURE__ */ jsx("span", { className: `text-sm ${accentColor} font-medium`, children: "99.9% 서비스 가용성 보장" }) }),
          /* @__PURE__ */ jsx("div", { className: `inline-flex items-center px-4 py-2 ${theme === "dark" ? "bg-slate-800/60" : "bg-white/80"} backdrop-blur-lg rounded-full border ${theme === "dark" ? "border-emerald-400/20" : "border-emerald-600/20"}`, children: /* @__PURE__ */ jsx("span", { className: `text-sm ${textSecondary}`, children: "효력 발생일: 2025년 7월 3일" }) })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx("section", { className: "pb-16", children: /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto px-4 lg:px-8", children: [
      /* @__PURE__ */ jsxs("div", { className: "text-center mb-12", children: [
        /* @__PURE__ */ jsx("h2", { className: `text-3xl font-bold ${textPrimary} mb-4`, children: "서비스 품질 지표" }),
        /* @__PURE__ */ jsx("p", { className: `${textSecondary} text-lg`, children: "Trading Gear가 약속하는 서비스 수준을 확인하세요" })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12", children: slaMetrics.map((metric) => /* @__PURE__ */ jsxs(
        "div",
        {
          className: `${theme === "dark" ? "bg-slate-800/60" : "bg-white/90"} backdrop-blur-lg rounded-2xl p-6 border transition-all duration-300 hover:transform hover:-translate-y-2 cursor-pointer ${activeMetric === metric.id ? `${theme === "dark" ? "border-emerald-400 shadow-emerald-400/20" : "border-emerald-600 shadow-emerald-600/20"} shadow-xl` : `${theme === "dark" ? "border-emerald-400/20 hover:border-emerald-400/40" : "border-emerald-600/20 hover:border-emerald-600/40"} hover:shadow-lg`}`,
          onClick: () => setActiveMetric(metric.id),
          children: [
            /* @__PURE__ */ jsxs("div", { className: "text-center mb-4", children: [
              /* @__PURE__ */ jsx("div", { className: `w-16 h-16 ${theme === "dark" ? "bg-emerald-400/20" : "bg-emerald-600/20"} rounded-full flex items-center justify-center text-2xl mx-auto mb-4`, children: metric.icon }),
              /* @__PURE__ */ jsx("h3", { className: `text-lg font-bold ${textPrimary} mb-2`, children: metric.title }),
              /* @__PURE__ */ jsx("div", { className: `text-3xl font-bold ${accentColor} mb-1`, children: metric.value }),
              /* @__PURE__ */ jsx("p", { className: `text-sm ${textSecondary} mb-4`, children: metric.target }),
              /* @__PURE__ */ jsx("p", { className: `text-sm ${textSecondary} leading-relaxed`, children: metric.description })
            ] }),
            activeMetric === metric.id && /* @__PURE__ */ jsxs("div", { className: `mt-6 pt-6 border-t ${theme === "dark" ? "border-emerald-400/20" : "border-emerald-600/20"}`, children: [
              /* @__PURE__ */ jsx("h4", { className: `font-semibold ${textPrimary} mb-3 text-sm`, children: "세부 사양" }),
              /* @__PURE__ */ jsx("ul", { className: "space-y-2", children: metric.details.map((detail, idx) => /* @__PURE__ */ jsxs("li", { className: `flex items-start ${textSecondary} text-xs`, children: [
                /* @__PURE__ */ jsx("span", { className: `${accentColor} mr-2 mt-0.5`, children: "•" }),
                /* @__PURE__ */ jsx("span", { children: detail })
              ] }, idx)) })
            ] })
          ]
        },
        metric.id
      )) })
    ] }) }),
    /* @__PURE__ */ jsx("section", { className: `py-16 ${theme === "dark" ? "bg-slate-800/30" : "bg-slate-100/50"}`, children: /* @__PURE__ */ jsxs("div", { className: "max-w-6xl mx-auto px-4 lg:px-8", children: [
      /* @__PURE__ */ jsxs("div", { className: "text-center mb-12", children: [
        /* @__PURE__ */ jsx("h2", { className: `text-3xl font-bold ${textPrimary} mb-4`, children: "서비스 보상 정책" }),
        /* @__PURE__ */ jsx("p", { className: `${textSecondary} text-lg`, children: "서비스 가용성이 약속된 수준에 미달할 경우 제공되는 보상" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: `${theme === "dark" ? "bg-slate-800/60" : "bg-white/90"} backdrop-blur-lg rounded-2xl border ${theme === "dark" ? "border-emerald-400/20" : "border-emerald-600/20"} overflow-hidden`, children: [
        /* @__PURE__ */ jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxs("table", { className: "w-full", children: [
          /* @__PURE__ */ jsx("thead", { className: `${theme === "dark" ? "bg-emerald-400/10" : "bg-emerald-600/10"}`, children: /* @__PURE__ */ jsxs("tr", { children: [
            /* @__PURE__ */ jsx("th", { className: `px-6 py-4 text-left text-sm font-bold ${textPrimary}`, children: "가용성 범위" }),
            /* @__PURE__ */ jsx("th", { className: `px-6 py-4 text-left text-sm font-bold ${textPrimary}`, children: "서비스 크레딧" }),
            /* @__PURE__ */ jsx("th", { className: `px-6 py-4 text-left text-sm font-bold ${textPrimary}`, children: "보상 내용" })
          ] }) }),
          /* @__PURE__ */ jsx("tbody", { children: compensationTiers.map((tier, index) => /* @__PURE__ */ jsxs("tr", { className: `border-t ${theme === "dark" ? "border-slate-700/50" : "border-slate-200/50"}`, children: [
            /* @__PURE__ */ jsx("td", { className: `px-6 py-4 font-medium ${textPrimary}`, children: tier.range }),
            /* @__PURE__ */ jsx("td", { className: `px-6 py-4 text-lg font-bold ${accentColor}`, children: tier.credit }),
            /* @__PURE__ */ jsx("td", { className: `px-6 py-4 ${textSecondary} text-sm`, children: tier.description })
          ] }, index)) })
        ] }) }),
        /* @__PURE__ */ jsxs("div", { className: `p-6 ${theme === "dark" ? "bg-emerald-400/5" : "bg-emerald-600/5"} border-t ${theme === "dark" ? "border-emerald-400/20" : "border-emerald-600/20"}`, children: [
          /* @__PURE__ */ jsxs("h4", { className: `font-semibold ${textPrimary} mb-2 flex items-center`, children: [
            /* @__PURE__ */ jsx("span", { className: "mr-2", children: "💡" }),
            "보상 신청 방법"
          ] }),
          /* @__PURE__ */ jsx("p", { className: `${textSecondary} text-sm leading-relaxed`, children: "서비스 크레딧 신청은 해당 월의 다음 달 말일까지 고객센터를 통해 신청하실 수 있습니다. 자동으로 지급되지 않으므로 반드시 신청해주시기 바랍니다." })
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsx("section", { className: "py-16", children: /* @__PURE__ */ jsxs("div", { className: "max-w-6xl mx-auto px-4 lg:px-8", children: [
      /* @__PURE__ */ jsxs("div", { className: "text-center mb-12", children: [
        /* @__PURE__ */ jsx("h2", { className: `text-3xl font-bold ${textPrimary} mb-4`, children: "고객 지원 체계" }),
        /* @__PURE__ */ jsx("p", { className: `${textSecondary} text-lg`, children: "다양한 채널을 통해 신속하고 정확한 지원을 제공합니다" })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: supportChannels.map((support, index) => /* @__PURE__ */ jsx(
        "div",
        {
          className: `${theme === "dark" ? "bg-slate-800/60" : "bg-white/90"} backdrop-blur-lg rounded-2xl p-6 border ${theme === "dark" ? "border-emerald-400/20" : "border-emerald-600/20"} transition-all duration-300 hover:transform hover:-translate-y-1 hover:shadow-lg`,
          children: /* @__PURE__ */ jsxs("div", { className: "flex items-start", children: [
            /* @__PURE__ */ jsx("div", { className: `w-12 h-12 ${theme === "dark" ? "bg-emerald-400/20" : "bg-emerald-600/20"} rounded-lg flex items-center justify-center text-xl mr-4 flex-shrink-0`, children: support.icon }),
            /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
              /* @__PURE__ */ jsx("h3", { className: `text-lg font-bold ${textPrimary} mb-2`, children: support.channel }),
              /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex justify-between", children: [
                  /* @__PURE__ */ jsx("span", { className: `text-sm ${textSecondary}`, children: "운영시간" }),
                  /* @__PURE__ */ jsx("span", { className: `text-sm font-medium ${accentColor}`, children: support.availability })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "flex justify-between", children: [
                  /* @__PURE__ */ jsx("span", { className: `text-sm ${textSecondary}`, children: "응답시간" }),
                  /* @__PURE__ */ jsx("span", { className: `text-sm font-medium ${accentColor}`, children: support.response })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-end", children: [
                  /* @__PURE__ */ jsx("span", { className: `text-sm ${textSecondary}`, children: "이용 가능 플랜" }),
                  /* @__PURE__ */ jsx("div", { className: "flex gap-1", children: support.plans.map((plan) => /* @__PURE__ */ jsx("span", { className: `px-2 py-1 text-xs ${theme === "dark" ? "bg-emerald-400/20 text-emerald-400" : "bg-emerald-600/20 text-emerald-600"} rounded`, children: plan }, plan)) })
                ] })
              ] })
            ] })
          ] })
        },
        index
      )) })
    ] }) }),
    /* @__PURE__ */ jsx("section", { className: `py-16 ${theme === "dark" ? "bg-slate-800/30" : "bg-slate-100/50"}`, children: /* @__PURE__ */ jsx("div", { className: "max-w-6xl mx-auto px-4 lg:px-8", children: /* @__PURE__ */ jsxs("div", { className: `${theme === "dark" ? "bg-gradient-to-r from-orange-900/40 to-red-900/40" : "bg-gradient-to-r from-orange-100/60 to-red-100/60"} backdrop-blur-lg rounded-2xl p-8 border ${theme === "dark" ? "border-orange-400/20" : "border-orange-600/20"}`, children: [
      /* @__PURE__ */ jsxs("div", { className: "text-center mb-8", children: [
        /* @__PURE__ */ jsx("div", { className: `w-16 h-16 ${theme === "dark" ? "bg-orange-400/20" : "bg-orange-600/20"} rounded-full flex items-center justify-center text-2xl mx-auto mb-4`, children: "⚠️" }),
        /* @__PURE__ */ jsx("h3", { className: `text-xl font-bold ${textPrimary} mb-4`, children: "중요 사항" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [
        /* @__PURE__ */ jsxs("div", { className: `p-4 ${theme === "dark" ? "bg-slate-800/40" : "bg-white/60"} rounded-lg`, children: [
          /* @__PURE__ */ jsxs("h4", { className: `font-semibold ${textPrimary} mb-2 flex items-center`, children: [
            /* @__PURE__ */ jsx("span", { className: "mr-2", children: "🔍" }),
            "SLA 적용 범위"
          ] }),
          /* @__PURE__ */ jsxs("ul", { className: `${textSecondary} text-sm space-y-1`, children: [
            /* @__PURE__ */ jsx("li", { children: "• 유료 플랜 이용자에게만 적용" }),
            /* @__PURE__ */ jsx("li", { children: "• 계획된 점검 시간 제외" }),
            /* @__PURE__ */ jsx("li", { children: "• 제3자 서비스 장애 제외" }),
            /* @__PURE__ */ jsx("li", { children: "• 불가항력적 사유 제외" })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: `p-4 ${theme === "dark" ? "bg-slate-800/40" : "bg-white/60"} rounded-lg`, children: [
          /* @__PURE__ */ jsxs("h4", { className: `font-semibold ${textPrimary} mb-2 flex items-center`, children: [
            /* @__PURE__ */ jsx("span", { className: "mr-2", children: "📋" }),
            "측정 기준"
          ] }),
          /* @__PURE__ */ jsxs("ul", { className: `${textSecondary} text-sm space-y-1`, children: [
            /* @__PURE__ */ jsx("li", { children: "• 가용성: 월간 기준 계산" }),
            /* @__PURE__ */ jsx("li", { children: "• 응답시간: 95% 분위수 기준" }),
            /* @__PURE__ */ jsx("li", { children: "• 모니터링: 5분 간격 체크" }),
            /* @__PURE__ */ jsx("li", { children: "• 보고서: 월간 SLA 리포트 제공" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: `mt-6 p-4 border-t ${theme === "dark" ? "border-orange-400/20" : "border-orange-600/20"} text-center`, children: /* @__PURE__ */ jsx("p", { className: `${textSecondary} text-sm`, children: "본 SLA는 Trading Gear 이용약관의 일부이며, 서비스 품질 개선을 위해 지속적으로 업데이트될 수 있습니다." }) })
    ] }) }) }),
    /* @__PURE__ */ jsx("footer", { className: `${theme === "dark" ? "bg-slate-900/90 border-cyan-400/20" : "bg-white/90 border-blue-600/20"} border-t py-12`, children: /* @__PURE__ */ jsxs("div", { className: "max-w-6xl mx-auto px-4 lg:px-8 text-center", children: [
      /* @__PURE__ */ jsx("div", { className: "flex flex-wrap justify-center gap-8 mb-8", children: ["회사소개", "이용약관", "개인정보처리방침", "고객지원", "블로그", "채용정보"].map((link) => /* @__PURE__ */ jsx("a", { className: `${textSecondary} hover:text-cyan-400 transition-colors duration-300 cursor-pointer`, children: link }, link)) }),
      /* @__PURE__ */ jsxs("div", { className: `pt-8 border-t ${theme === "dark" ? "border-cyan-400/10" : "border-blue-600/10"} ${textSecondary} text-sm space-y-2`, children: [
        /* @__PURE__ */ jsx("p", { children: "© 2025 Trading Gear. All rights reserved." }),
        /* @__PURE__ */ jsx("p", { children: "투자에는 원금 손실의 위험이 있습니다. 신중한 투자 결정을 내리시기 바랍니다." }),
        /* @__PURE__ */ jsx("p", { children: "본 서비스는 투자 도구를 제공하며, 투자 수익을 보장하지 않습니다." })
      ] })
    ] }) })
  ] });
};
const route76 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: SLASummaryPage
}, Symbol.toStringTag, { value: "Module" }));
const serverManifest = { "entry": { "module": "/assets/entry.client-DVS4fqim.js", "imports": ["/assets/jsx-runtime-Ds-gkUgj.js", "/assets/index-CtvPRVHf.js", "/assets/index-WEdp_TFg.js", "/assets/index-kH-wUL5G.js", "/assets/index-D4s4T6i4.js", "/assets/components-DueK1IyD.js"], "css": [] }, "routes": { "root": { "id": "root", "parentId": void 0, "path": "", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/root-D1-zR8jE.js", "imports": ["/assets/jsx-runtime-Ds-gkUgj.js", "/assets/index-CtvPRVHf.js", "/assets/index-WEdp_TFg.js", "/assets/index-kH-wUL5G.js", "/assets/index-D4s4T6i4.js", "/assets/components-DueK1IyD.js"], "css": ["/assets/root-CPJwuptq.css"] }, "routes/admin.binance_order_book": { "id": "routes/admin.binance_order_book", "parentId": "root", "path": "admin/binance_order_book", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/admin.binance_order_book-sLGGKrNI.js", "imports": ["/assets/jsx-runtime-Ds-gkUgj.js", "/assets/index-CtvPRVHf.js", "/assets/AdminHeader-6gj_EaxH.js", "/assets/arrow-up-down-BJ6pyxex.js", "/assets/chevron-up-CIAgqRkB.js", "/assets/index-kH-wUL5G.js", "/assets/x-Dl0kjJT1.js", "/assets/createLucideIcon-DTOVJ0NK.js", "/assets/users-QYDbYJz9.js", "/assets/chart-column-CHgDE-e-.js", "/assets/chart-pie-EKbEO8wF.js", "/assets/settings-CzflHvlS.js", "/assets/lock-BelZz0VX.js", "/assets/react-ChfR-Nl8.js", "/assets/menu-DhrnXeUA.js", "/assets/bell-CyqwHFfu.js", "/assets/user-DUABGHUk.js"], "css": [] }, "routes/rate_return_inform_kium2": { "id": "routes/rate_return_inform_kium2", "parentId": "root", "path": "rate_return_inform_kium2", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/rate_return_inform_kium2-l0sNRNKZ.js", "imports": [], "css": [] }, "routes/rate_return_inform_kium3": { "id": "routes/rate_return_inform_kium3", "parentId": "root", "path": "rate_return_inform_kium3", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/rate_return_inform_kium3-l0sNRNKZ.js", "imports": [], "css": [] }, "routes/admin.binance_strategy1": { "id": "routes/admin.binance_strategy1", "parentId": "root", "path": "admin/binance_strategy1", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/admin.binance_strategy1-BCIP6Jq-.js", "imports": ["/assets/jsx-runtime-Ds-gkUgj.js", "/assets/index-CtvPRVHf.js", "/assets/index-NIGUFBhG.js"], "css": [] }, "routes/rate_return_inform_kium": { "id": "routes/rate_return_inform_kium", "parentId": "root", "path": "rate_return_inform_kium", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/rate_return_inform_kium-l0sNRNKZ.js", "imports": [], "css": [] }, "routes/admin.strategy._index": { "id": "routes/admin.strategy._index", "parentId": "root", "path": "admin/strategy", "index": true, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/admin.strategy._index-CfOLdK-T.js", "imports": ["/assets/jsx-runtime-Ds-gkUgj.js", "/assets/index-CtvPRVHf.js", "/assets/label-BA2VzfXQ.js", "/assets/AdminHeader-6gj_EaxH.js", "/assets/index-kH-wUL5G.js", "/assets/search-BQCrw2dg.js", "/assets/trash-2-BfGpPKNr.js", "/assets/arrow-up-down-BJ6pyxex.js", "/assets/chevron-up-CIAgqRkB.js", "/assets/index-WEdp_TFg.js", "/assets/index-DV4WIAmd.js", "/assets/index-C_aiUDWW.js", "/assets/Combination-DwsYlqPy.js", "/assets/createLucideIcon-DTOVJ0NK.js", "/assets/index-Bxt6ZhY0.js", "/assets/utils-CIsb_jhR.js", "/assets/clsx-B-dksMZM.js", "/assets/index-Dp3B9jqt.js", "/assets/x-Dl0kjJT1.js", "/assets/users-QYDbYJz9.js", "/assets/chart-column-CHgDE-e-.js", "/assets/chart-pie-EKbEO8wF.js", "/assets/settings-CzflHvlS.js", "/assets/lock-BelZz0VX.js", "/assets/react-ChfR-Nl8.js", "/assets/menu-DhrnXeUA.js", "/assets/bell-CyqwHFfu.js", "/assets/user-DUABGHUk.js"], "css": [] }, "routes/binance_recent_trades": { "id": "routes/binance_recent_trades", "parentId": "root", "path": "binance_recent_trades", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/binance_recent_trades-l0sNRNKZ.js", "imports": [], "css": [] }, "routes/binance_today_trades2": { "id": "routes/binance_today_trades2", "parentId": "root", "path": "binance_today_trades2", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/binance_today_trades2-l0sNRNKZ.js", "imports": [], "css": [] }, "routes/binance_total_amount2": { "id": "routes/binance_total_amount2", "parentId": "root", "path": "binance_total_amount2", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/binance_total_amount2-l0sNRNKZ.js", "imports": [], "css": [] }, "routes/binance_total_amount3": { "id": "routes/binance_total_amount3", "parentId": "root", "path": "binance_total_amount3", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/binance_total_amount3-l0sNRNKZ.js", "imports": [], "css": [] }, "routes/admin.strategy.write": { "id": "routes/admin.strategy.write", "parentId": "root", "path": "admin/strategy/write", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/admin.strategy.write-D8szMGJQ.js", "imports": ["/assets/jsx-runtime-Ds-gkUgj.js", "/assets/index-CtvPRVHf.js", "/assets/label-BA2VzfXQ.js", "/assets/button-DQPZWwFm.js", "/assets/switch-BM4slqr5.js", "/assets/AdminHeader-6gj_EaxH.js", "/assets/index-kH-wUL5G.js", "/assets/save-2s9wE1My.js", "/assets/index-WEdp_TFg.js", "/assets/index-DV4WIAmd.js", "/assets/index-C_aiUDWW.js", "/assets/Combination-DwsYlqPy.js", "/assets/createLucideIcon-DTOVJ0NK.js", "/assets/index-Bxt6ZhY0.js", "/assets/utils-CIsb_jhR.js", "/assets/clsx-B-dksMZM.js", "/assets/chevron-up-CIAgqRkB.js", "/assets/index-Dp3B9jqt.js", "/assets/x-Dl0kjJT1.js", "/assets/users-QYDbYJz9.js", "/assets/chart-column-CHgDE-e-.js", "/assets/chart-pie-EKbEO8wF.js", "/assets/settings-CzflHvlS.js", "/assets/lock-BelZz0VX.js", "/assets/react-ChfR-Nl8.js", "/assets/menu-DhrnXeUA.js", "/assets/bell-CyqwHFfu.js", "/assets/user-DUABGHUk.js"], "css": [] }, "routes/binance_daily_change": { "id": "routes/binance_daily_change", "parentId": "root", "path": "binance_daily_change", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/binance_daily_change-l0sNRNKZ.js", "imports": [], "css": [] }, "routes/binance_past_percent": { "id": "routes/binance_past_percent", "parentId": "root", "path": "binance_past_percent", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/binance_past_percent-l0sNRNKZ.js", "imports": [], "css": [] }, "routes/binance_today_trades": { "id": "routes/binance_today_trades", "parentId": "root", "path": "binance_today_trades", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/binance_today_trades-l0sNRNKZ.js", "imports": [], "css": [] }, "routes/binance_total_amount": { "id": "routes/binance_total_amount", "parentId": "root", "path": "binance_total_amount", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/binance_total_amount-l0sNRNKZ.js", "imports": [], "css": [] }, "routes/admin.id.reg.action": { "id": "routes/admin.id.reg.action", "parentId": "root", "path": "admin/id/reg/action", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/admin.id.reg.action-l0sNRNKZ.js", "imports": [], "css": [] }, "routes/admin.strategy.view": { "id": "routes/admin.strategy.view", "parentId": "root", "path": "admin/strategy/view", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/admin.strategy.view-1BeYz1Z1.js", "imports": ["/assets/jsx-runtime-Ds-gkUgj.js", "/assets/index-CtvPRVHf.js", "/assets/button-DQPZWwFm.js", "/assets/AdminHeader-6gj_EaxH.js", "/assets/index-kH-wUL5G.js", "/assets/arrow-left-DW3uYy0L.js", "/assets/activity-CFnPMEEn.js", "/assets/users-QYDbYJz9.js", "/assets/chart-column-CHgDE-e-.js", "/assets/calendar-C2oO8jzR.js", "/assets/CartesianChart-D2JHakCf.js", "/assets/BarChart-BEDZCLgg.js", "/assets/LineChart-CHjl_PZZ.js", "/assets/PieChart-C03Qd7om.js", "/assets/index-C_aiUDWW.js", "/assets/index-Dp3B9jqt.js", "/assets/clsx-B-dksMZM.js", "/assets/utils-CIsb_jhR.js", "/assets/x-Dl0kjJT1.js", "/assets/createLucideIcon-DTOVJ0NK.js", "/assets/chart-pie-EKbEO8wF.js", "/assets/settings-CzflHvlS.js", "/assets/lock-BelZz0VX.js", "/assets/react-ChfR-Nl8.js", "/assets/menu-DhrnXeUA.js", "/assets/bell-CyqwHFfu.js", "/assets/user-DUABGHUk.js", "/assets/index-WEdp_TFg.js", "/assets/ErrorBar-CN30AKuy.js", "/assets/ActivePoints-wXE89lo8.js"], "css": [] }, "routes/binance_order_book": { "id": "routes/binance_order_book", "parentId": "root", "path": "binance_order_book", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/binance_order_book-l0sNRNKZ.js", "imports": [], "css": [] }, "routes/dashboard.strategy": { "id": "routes/dashboard.strategy", "parentId": "root", "path": "dashboard/strategy", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/dashboard.strategy-BBQjPcRl.js", "imports": ["/assets/jsx-runtime-Ds-gkUgj.js", "/assets/index-CtvPRVHf.js", "/assets/themeStore--iS_I_6G.js", "/assets/table-BphraAqz.js", "/assets/button-DQPZWwFm.js", "/assets/dropdown-menu-Ctb7a59k.js", "/assets/badge-dwcV8iib.js", "/assets/card--auC-4Ul.js", "/assets/DashFooter-BCWqjM1c.js", "/assets/DashNav-BdE-Tyhe.js", "/assets/target-Duyd35Tn.js", "/assets/play-B-2AR-XO.js", "/assets/repeat-ukfbD090.js", "/assets/circle-alert-DjMReW2r.js", "/assets/activity-CFnPMEEn.js", "/assets/settings-CzflHvlS.js", "/assets/brain-JEEL3n3X.js", "/assets/createLucideIcon-DTOVJ0NK.js", "/assets/trash-2-BfGpPKNr.js", "/assets/circle-check-big-CIMmSoOe.js", "/assets/react-ChfR-Nl8.js", "/assets/utils-CIsb_jhR.js", "/assets/clsx-B-dksMZM.js", "/assets/index-C_aiUDWW.js", "/assets/index-Dp3B9jqt.js", "/assets/index-DV4WIAmd.js", "/assets/index-WEdp_TFg.js", "/assets/Combination-DwsYlqPy.js", "/assets/chevron-right-B9r4bq0U.js", "/assets/index-kH-wUL5G.js", "/assets/menu-DhrnXeUA.js", "/assets/search-BQCrw2dg.js", "/assets/sun-SUTbMEtb.js", "/assets/bell-CyqwHFfu.js", "/assets/user-DUABGHUk.js", "/assets/shield-CPBa5LI-.js", "/assets/x-Dl0kjJT1.js", "/assets/bot-RaXNf0d9.js", "/assets/chart-column-CHgDE-e-.js", "/assets/index-D4s4T6i4.js"], "css": [] }, "routes/admin_login_check": { "id": "routes/admin_login_check", "parentId": "root", "path": "admin_login_check", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/admin_login_check-B6DR5Icr.js", "imports": ["/assets/index-CtvPRVHf.js", "/assets/index-kH-wUL5G.js"], "css": [] }, "routes/binance_portfolio": { "id": "routes/binance_portfolio", "parentId": "root", "path": "binance_portfolio", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/binance_portfolio-l0sNRNKZ.js", "imports": [], "css": [] }, "routes/binance_total_roe": { "id": "routes/binance_total_roe", "parentId": "root", "path": "binance_total_roe", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/binance_total_roe-l0sNRNKZ.js", "imports": [], "css": [] }, "routes/total_amount_kium": { "id": "routes/total_amount_kium", "parentId": "root", "path": "total_amount_kium", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/total_amount_kium-l0sNRNKZ.js", "imports": [], "css": [] }, "routes/binance_pl_chart": { "id": "routes/binance_pl_chart", "parentId": "root", "path": "binance_pl_chart", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/binance_pl_chart-l0sNRNKZ.js", "imports": [], "css": [] }, "routes/dashboard.assets": { "id": "routes/dashboard.assets", "parentId": "root", "path": "dashboard/assets", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/dashboard.assets-CpGuk6QN.js", "imports": ["/assets/jsx-runtime-Ds-gkUgj.js", "/assets/index-CtvPRVHf.js", "/assets/themeStore--iS_I_6G.js", "/assets/table-BphraAqz.js", "/assets/badge-dwcV8iib.js", "/assets/card--auC-4Ul.js", "/assets/DashFooter-BCWqjM1c.js", "/assets/DashNav-BdE-Tyhe.js", "/assets/createLucideIcon-DTOVJ0NK.js", "/assets/arrow-up-right-toYN2TNu.js", "/assets/trending-up-Dpl82U3m.js", "/assets/dollar-sign-Ei8Nncuo.js", "/assets/target-Duyd35Tn.js", "/assets/activity-CFnPMEEn.js", "/assets/zap-CMYlLuDU.js", "/assets/chart-column-CHgDE-e-.js", "/assets/clock-B56EHORu.js", "/assets/chart-pie-EKbEO8wF.js", "/assets/calendar-C2oO8jzR.js", "/assets/react-ChfR-Nl8.js", "/assets/utils-CIsb_jhR.js", "/assets/clsx-B-dksMZM.js", "/assets/index-Dp3B9jqt.js", "/assets/index-kH-wUL5G.js", "/assets/menu-DhrnXeUA.js", "/assets/search-BQCrw2dg.js", "/assets/sun-SUTbMEtb.js", "/assets/bell-CyqwHFfu.js", "/assets/user-DUABGHUk.js", "/assets/shield-CPBa5LI-.js", "/assets/x-Dl0kjJT1.js", "/assets/bot-RaXNf0d9.js", "/assets/index-D4s4T6i4.js", "/assets/index-WEdp_TFg.js"], "css": [] }, "routes/dashboard._index": { "id": "routes/dashboard._index", "parentId": "root", "path": "dashboard", "index": true, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/dashboard._index-BSfHbMy2.js", "imports": ["/assets/jsx-runtime-Ds-gkUgj.js", "/assets/index-CtvPRVHf.js", "/assets/themeStore--iS_I_6G.js", "/assets/table-BphraAqz.js", "/assets/button-DQPZWwFm.js", "/assets/dropdown-menu-Ctb7a59k.js", "/assets/badge-dwcV8iib.js", "/assets/DashFooter-BCWqjM1c.js", "/assets/DashNav-BdE-Tyhe.js", "/assets/dollar-sign-Ei8Nncuo.js", "/assets/trending-up-Dpl82U3m.js", "/assets/activity-CFnPMEEn.js", "/assets/CartesianChart-D2JHakCf.js", "/assets/AreaChart-D8JN570T.js", "/assets/circle-check-big-CIMmSoOe.js", "/assets/circle-alert-DjMReW2r.js", "/assets/brain-JEEL3n3X.js", "/assets/react-ChfR-Nl8.js", "/assets/utils-CIsb_jhR.js", "/assets/clsx-B-dksMZM.js", "/assets/index-C_aiUDWW.js", "/assets/index-Dp3B9jqt.js", "/assets/createLucideIcon-DTOVJ0NK.js", "/assets/index-DV4WIAmd.js", "/assets/index-WEdp_TFg.js", "/assets/Combination-DwsYlqPy.js", "/assets/chevron-right-B9r4bq0U.js", "/assets/index-kH-wUL5G.js", "/assets/menu-DhrnXeUA.js", "/assets/search-BQCrw2dg.js", "/assets/sun-SUTbMEtb.js", "/assets/bell-CyqwHFfu.js", "/assets/user-DUABGHUk.js", "/assets/shield-CPBa5LI-.js", "/assets/x-Dl0kjJT1.js", "/assets/bot-RaXNf0d9.js", "/assets/chart-column-CHgDE-e-.js", "/assets/index-D4s4T6i4.js", "/assets/ActivePoints-wXE89lo8.js"], "css": [] }, "routes/dashboard_backup": { "id": "routes/dashboard_backup", "parentId": "root", "path": "dashboard_backup", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/dashboard_backup-wHqsCf2A.js", "imports": ["/assets/jsx-runtime-Ds-gkUgj.js", "/assets/index-CtvPRVHf.js", "/assets/themeStore--iS_I_6G.js", "/assets/table-BphraAqz.js", "/assets/button-DQPZWwFm.js", "/assets/dropdown-menu-Ctb7a59k.js", "/assets/badge-dwcV8iib.js", "/assets/DashFooter-BCWqjM1c.js", "/assets/DashNav-BdE-Tyhe.js", "/assets/dollar-sign-Ei8Nncuo.js", "/assets/trending-up-Dpl82U3m.js", "/assets/activity-CFnPMEEn.js", "/assets/CartesianChart-D2JHakCf.js", "/assets/AreaChart-D8JN570T.js", "/assets/circle-check-big-CIMmSoOe.js", "/assets/circle-alert-DjMReW2r.js", "/assets/brain-JEEL3n3X.js", "/assets/react-ChfR-Nl8.js", "/assets/utils-CIsb_jhR.js", "/assets/clsx-B-dksMZM.js", "/assets/index-C_aiUDWW.js", "/assets/index-Dp3B9jqt.js", "/assets/createLucideIcon-DTOVJ0NK.js", "/assets/index-DV4WIAmd.js", "/assets/index-WEdp_TFg.js", "/assets/Combination-DwsYlqPy.js", "/assets/chevron-right-B9r4bq0U.js", "/assets/index-kH-wUL5G.js", "/assets/menu-DhrnXeUA.js", "/assets/search-BQCrw2dg.js", "/assets/sun-SUTbMEtb.js", "/assets/bell-CyqwHFfu.js", "/assets/user-DUABGHUk.js", "/assets/shield-CPBa5LI-.js", "/assets/x-Dl0kjJT1.js", "/assets/bot-RaXNf0d9.js", "/assets/chart-column-CHgDE-e-.js", "/assets/index-D4s4T6i4.js", "/assets/ActivePoints-wXE89lo8.js"], "css": [] }, "routes/etc_inform_kium2": { "id": "routes/etc_inform_kium2", "parentId": "root", "path": "etc_inform_kium2", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/etc_inform_kium2-l0sNRNKZ.js", "imports": [], "css": [] }, "routes/etc_inform_kium3": { "id": "routes/etc_inform_kium3", "parentId": "root", "path": "etc_inform_kium3", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/etc_inform_kium3-l0sNRNKZ.js", "imports": [], "css": [] }, "routes/past_inform_kium": { "id": "routes/past_inform_kium", "parentId": "root", "path": "past_inform_kium", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/past_inform_kium-l0sNRNKZ.js", "imports": [], "css": [] }, "routes/realtime-balance": { "id": "routes/realtime-balance", "parentId": "root", "path": "realtime-balance", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/realtime-balance-z7PtY8vw.js", "imports": ["/assets/jsx-runtime-Ds-gkUgj.js", "/assets/index-CtvPRVHf.js"], "css": [] }, "routes/etc_inform_kium": { "id": "routes/etc_inform_kium", "parentId": "root", "path": "etc_inform_kium", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/etc_inform_kium-l0sNRNKZ.js", "imports": [], "css": [] }, "routes/forgot-password": { "id": "routes/forgot-password", "parentId": "root", "path": "forgot-password", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/forgot-password-wK_-o7hn.js", "imports": ["/assets/jsx-runtime-Ds-gkUgj.js", "/assets/index-CtvPRVHf.js", "/assets/themeStore--iS_I_6G.js", "/assets/Header-D30Bhkjv.js", "/assets/Footer-CIqkhuHr.js", "/assets/index-kH-wUL5G.js", "/assets/react-ChfR-Nl8.js"], "css": [] }, "routes/admin.approval": { "id": "routes/admin.approval", "parentId": "root", "path": "admin/approval", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/admin.approval-DwwzgLOu.js", "imports": ["/assets/jsx-runtime-Ds-gkUgj.js", "/assets/index-CtvPRVHf.js", "/assets/AdminHeader-6gj_EaxH.js", "/assets/index-kH-wUL5G.js", "/assets/x-Dl0kjJT1.js", "/assets/createLucideIcon-DTOVJ0NK.js", "/assets/users-QYDbYJz9.js", "/assets/chart-column-CHgDE-e-.js", "/assets/chart-pie-EKbEO8wF.js", "/assets/settings-CzflHvlS.js", "/assets/lock-BelZz0VX.js", "/assets/react-ChfR-Nl8.js", "/assets/menu-DhrnXeUA.js", "/assets/bell-CyqwHFfu.js", "/assets/user-DUABGHUk.js"], "css": [] }, "routes/admin.settings": { "id": "routes/admin.settings", "parentId": "root", "path": "admin/settings", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/admin.settings-DyS4B694.js", "imports": ["/assets/jsx-runtime-Ds-gkUgj.js", "/assets/index-CtvPRVHf.js", "/assets/AdminHeader-6gj_EaxH.js", "/assets/index-kH-wUL5G.js", "/assets/x-Dl0kjJT1.js", "/assets/createLucideIcon-DTOVJ0NK.js", "/assets/users-QYDbYJz9.js", "/assets/chart-column-CHgDE-e-.js", "/assets/chart-pie-EKbEO8wF.js", "/assets/settings-CzflHvlS.js", "/assets/lock-BelZz0VX.js", "/assets/react-ChfR-Nl8.js", "/assets/menu-DhrnXeUA.js", "/assets/bell-CyqwHFfu.js", "/assets/user-DUABGHUk.js"], "css": [] }, "routes/balance-stream": { "id": "routes/balance-stream", "parentId": "root", "path": "balance-stream", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/balance-stream-l0sNRNKZ.js", "imports": [], "css": [] }, "routes/strategyReport": { "id": "routes/strategyReport", "parentId": "root", "path": "strategyReport", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/strategyReport-JtbuJDag.js", "imports": ["/assets/jsx-runtime-Ds-gkUgj.js", "/assets/themeStore--iS_I_6G.js", "/assets/index-CtvPRVHf.js", "/assets/badge-dwcV8iib.js", "/assets/DashFooter-BCWqjM1c.js", "/assets/chart-column-CHgDE-e-.js", "/assets/CartesianChart-D2JHakCf.js", "/assets/BarChart-BEDZCLgg.js", "/assets/activity-CFnPMEEn.js", "/assets/dollar-sign-Ei8Nncuo.js", "/assets/target-Duyd35Tn.js", "/assets/circle-check-big-CIMmSoOe.js", "/assets/react-ChfR-Nl8.js", "/assets/index-Dp3B9jqt.js", "/assets/clsx-B-dksMZM.js", "/assets/utils-CIsb_jhR.js", "/assets/index-kH-wUL5G.js", "/assets/menu-DhrnXeUA.js", "/assets/createLucideIcon-DTOVJ0NK.js", "/assets/search-BQCrw2dg.js", "/assets/sun-SUTbMEtb.js", "/assets/bell-CyqwHFfu.js", "/assets/user-DUABGHUk.js", "/assets/shield-CPBa5LI-.js", "/assets/x-Dl0kjJT1.js", "/assets/bot-RaXNf0d9.js", "/assets/index-WEdp_TFg.js", "/assets/ErrorBar-CN30AKuy.js"], "css": [] }, "routes/binance_count": { "id": "routes/binance_count", "parentId": "root", "path": "binance_count", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/binance_count-l0sNRNKZ.js", "imports": [], "css": [] }, "routes/mystrategyAdd": { "id": "routes/mystrategyAdd", "parentId": "root", "path": "mystrategyAdd", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/mystrategyAdd-D85gT106.js", "imports": ["/assets/jsx-runtime-Ds-gkUgj.js", "/assets/themeStore--iS_I_6G.js", "/assets/index-CtvPRVHf.js", "/assets/DashFooter-BCWqjM1c.js", "/assets/circle-check-big-CIMmSoOe.js", "/assets/arrow-left-DW3uYy0L.js", "/assets/arrow-right-Dgdr3KdE.js", "/assets/save-2s9wE1My.js", "/assets/eye-CyZqdGIS.js", "/assets/createLucideIcon-DTOVJ0NK.js", "/assets/react-ChfR-Nl8.js", "/assets/index-kH-wUL5G.js", "/assets/menu-DhrnXeUA.js", "/assets/search-BQCrw2dg.js", "/assets/sun-SUTbMEtb.js", "/assets/bell-CyqwHFfu.js", "/assets/user-DUABGHUk.js", "/assets/shield-CPBa5LI-.js", "/assets/x-Dl0kjJT1.js", "/assets/bot-RaXNf0d9.js", "/assets/chart-column-CHgDE-e-.js"], "css": [] }, "routes/admin.cutOff": { "id": "routes/admin.cutOff", "parentId": "root", "path": "admin/cutOff", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/admin.cutOff-BFASMVtK.js", "imports": ["/assets/jsx-runtime-Ds-gkUgj.js", "/assets/index-CtvPRVHf.js", "/assets/AdminHeader-6gj_EaxH.js", "/assets/index-kH-wUL5G.js", "/assets/x-Dl0kjJT1.js", "/assets/createLucideIcon-DTOVJ0NK.js", "/assets/users-QYDbYJz9.js", "/assets/chart-column-CHgDE-e-.js", "/assets/chart-pie-EKbEO8wF.js", "/assets/settings-CzflHvlS.js", "/assets/lock-BelZz0VX.js", "/assets/react-ChfR-Nl8.js", "/assets/menu-DhrnXeUA.js", "/assets/bell-CyqwHFfu.js", "/assets/user-DUABGHUk.js"], "css": [] }, "routes/admin.member": { "id": "routes/admin.member", "parentId": "root", "path": "admin/member", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/admin.member-Dsbid53e.js", "imports": ["/assets/jsx-runtime-Ds-gkUgj.js", "/assets/index-CtvPRVHf.js", "/assets/label-BA2VzfXQ.js", "/assets/button-DQPZWwFm.js", "/assets/AdminHeader-6gj_EaxH.js", "/assets/search-BQCrw2dg.js", "/assets/trash-2-BfGpPKNr.js", "/assets/arrow-up-down-BJ6pyxex.js", "/assets/chevron-up-CIAgqRkB.js", "/assets/index-WEdp_TFg.js", "/assets/index-DV4WIAmd.js", "/assets/index-C_aiUDWW.js", "/assets/Combination-DwsYlqPy.js", "/assets/createLucideIcon-DTOVJ0NK.js", "/assets/index-Bxt6ZhY0.js", "/assets/utils-CIsb_jhR.js", "/assets/clsx-B-dksMZM.js", "/assets/index-Dp3B9jqt.js", "/assets/index-kH-wUL5G.js", "/assets/x-Dl0kjJT1.js", "/assets/users-QYDbYJz9.js", "/assets/chart-column-CHgDE-e-.js", "/assets/chart-pie-EKbEO8wF.js", "/assets/settings-CzflHvlS.js", "/assets/lock-BelZz0VX.js", "/assets/react-ChfR-Nl8.js", "/assets/menu-DhrnXeUA.js", "/assets/bell-CyqwHFfu.js", "/assets/user-DUABGHUk.js"], "css": [] }, "routes/admin._index": { "id": "routes/admin._index", "parentId": "root", "path": "admin", "index": true, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/admin._index-PANppOiJ.js", "imports": ["/assets/jsx-runtime-Ds-gkUgj.js", "/assets/index-CtvPRVHf.js", "/assets/label-BA2VzfXQ.js", "/assets/button-DQPZWwFm.js", "/assets/x-Dl0kjJT1.js", "/assets/users-QYDbYJz9.js", "/assets/lock-BelZz0VX.js", "/assets/menu-DhrnXeUA.js", "/assets/sun-SUTbMEtb.js", "/assets/bell-CyqwHFfu.js", "/assets/user-DUABGHUk.js", "/assets/search-BQCrw2dg.js", "/assets/trash-2-BfGpPKNr.js", "/assets/arrow-up-down-BJ6pyxex.js", "/assets/chevron-up-CIAgqRkB.js", "/assets/index-WEdp_TFg.js", "/assets/index-DV4WIAmd.js", "/assets/index-C_aiUDWW.js", "/assets/Combination-DwsYlqPy.js", "/assets/createLucideIcon-DTOVJ0NK.js", "/assets/index-Bxt6ZhY0.js", "/assets/utils-CIsb_jhR.js", "/assets/clsx-B-dksMZM.js", "/assets/index-Dp3B9jqt.js"], "css": [] }, "routes/admin.login": { "id": "routes/admin.login", "parentId": "root", "path": "admin/login", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/admin.login-DtblWb0h.js", "imports": ["/assets/jsx-runtime-Ds-gkUgj.js", "/assets/index-CtvPRVHf.js", "/assets/lock-BelZz0VX.js", "/assets/user-DUABGHUk.js", "/assets/createLucideIcon-DTOVJ0NK.js", "/assets/eye-CyZqdGIS.js"], "css": [] }, "routes/admin.state": { "id": "routes/admin.state", "parentId": "root", "path": "admin/state", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/admin.state-KVHtbGkx.js", "imports": ["/assets/jsx-runtime-Ds-gkUgj.js", "/assets/index-CtvPRVHf.js", "/assets/AdminHeader-6gj_EaxH.js", "/assets/index-kH-wUL5G.js", "/assets/download-bFerL3Gd.js", "/assets/activity-CFnPMEEn.js", "/assets/trending-up-Dpl82U3m.js", "/assets/calendar-C2oO8jzR.js", "/assets/dollar-sign-Ei8Nncuo.js", "/assets/CartesianChart-D2JHakCf.js", "/assets/BarChart-BEDZCLgg.js", "/assets/LineChart-CHjl_PZZ.js", "/assets/PieChart-C03Qd7om.js", "/assets/x-Dl0kjJT1.js", "/assets/createLucideIcon-DTOVJ0NK.js", "/assets/users-QYDbYJz9.js", "/assets/chart-column-CHgDE-e-.js", "/assets/chart-pie-EKbEO8wF.js", "/assets/settings-CzflHvlS.js", "/assets/lock-BelZz0VX.js", "/assets/react-ChfR-Nl8.js", "/assets/menu-DhrnXeUA.js", "/assets/bell-CyqwHFfu.js", "/assets/user-DUABGHUk.js", "/assets/index-WEdp_TFg.js", "/assets/clsx-B-dksMZM.js", "/assets/ErrorBar-CN30AKuy.js", "/assets/ActivePoints-wXE89lo8.js"], "css": [] }, "routes/push_enable": { "id": "routes/push_enable", "parentId": "root", "path": "push_enable", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/push_enable-CRJNOGHf.js", "imports": ["/assets/jsx-runtime-Ds-gkUgj.js", "/assets/index-CtvPRVHf.js", "/assets/index.esm-jAaSeA46.js"], "css": [] }, "routes/cvd_charts": { "id": "routes/cvd_charts", "parentId": "root", "path": "cvd_charts", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/cvd_charts-BW1GaILr.js", "imports": ["/assets/jsx-runtime-Ds-gkUgj.js", "/assets/index-CtvPRVHf.js", "/assets/CartesianChart-D2JHakCf.js", "/assets/LineChart-CHjl_PZZ.js", "/assets/index-WEdp_TFg.js", "/assets/clsx-B-dksMZM.js", "/assets/ActivePoints-wXE89lo8.js", "/assets/ErrorBar-CN30AKuy.js"], "css": [] }, "routes/mystrategy": { "id": "routes/mystrategy", "parentId": "root", "path": "mystrategy", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/mystrategy-DyH7N0zB.js", "imports": ["/assets/jsx-runtime-Ds-gkUgj.js", "/assets/index-CtvPRVHf.js", "/assets/themeStore--iS_I_6G.js", "/assets/button-DQPZWwFm.js", "/assets/badge-dwcV8iib.js", "/assets/table-BphraAqz.js", "/assets/DashFooter-BCWqjM1c.js", "/assets/card--auC-4Ul.js", "/assets/dropdown-menu-Ctb7a59k.js", "/assets/index-kH-wUL5G.js", "/assets/target-Duyd35Tn.js", "/assets/play-B-2AR-XO.js", "/assets/repeat-ukfbD090.js", "/assets/activity-CFnPMEEn.js", "/assets/settings-CzflHvlS.js", "/assets/brain-JEEL3n3X.js", "/assets/trash-2-BfGpPKNr.js", "/assets/react-ChfR-Nl8.js", "/assets/index-C_aiUDWW.js", "/assets/index-Dp3B9jqt.js", "/assets/clsx-B-dksMZM.js", "/assets/utils-CIsb_jhR.js", "/assets/menu-DhrnXeUA.js", "/assets/createLucideIcon-DTOVJ0NK.js", "/assets/search-BQCrw2dg.js", "/assets/sun-SUTbMEtb.js", "/assets/bell-CyqwHFfu.js", "/assets/user-DUABGHUk.js", "/assets/shield-CPBa5LI-.js", "/assets/x-Dl0kjJT1.js", "/assets/bot-RaXNf0d9.js", "/assets/chart-column-CHgDE-e-.js", "/assets/index-DV4WIAmd.js", "/assets/index-WEdp_TFg.js", "/assets/Combination-DwsYlqPy.js", "/assets/chevron-right-B9r4bq0U.js"], "css": [] }, "routes/api.alert": { "id": "routes/api.alert", "parentId": "root", "path": "api/alert", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/api.alert-l0sNRNKZ.js", "imports": [], "css": [] }, "routes/api_test2": { "id": "routes/api_test2", "parentId": "root", "path": "api_test2", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/api_test2-l0sNRNKZ.js", "imports": [], "css": [] }, "routes/push_send": { "id": "routes/push_send", "parentId": "root", "path": "push_send", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/push_send-BPBJoiAJ.js", "imports": ["/assets/jsx-runtime-Ds-gkUgj.js", "/assets/index-CtvPRVHf.js", "/assets/index.esm-jAaSeA46.js"], "css": [] }, "routes/recommend": { "id": "routes/recommend", "parentId": "root", "path": "recommend", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/recommend-DiCsCoBu.js", "imports": ["/assets/jsx-runtime-Ds-gkUgj.js", "/assets/themeStore--iS_I_6G.js", "/assets/index-CtvPRVHf.js", "/assets/badge-dwcV8iib.js", "/assets/button-DQPZWwFm.js", "/assets/DashFooter-BCWqjM1c.js", "/assets/brain-JEEL3n3X.js", "/assets/CartesianChart-D2JHakCf.js", "/assets/AreaChart-D8JN570T.js", "/assets/star-DsBeGOeS.js", "/assets/trending-up-Dpl82U3m.js", "/assets/target-Duyd35Tn.js", "/assets/shield-CPBa5LI-.js", "/assets/activity-CFnPMEEn.js", "/assets/chart-column-CHgDE-e-.js", "/assets/zap-CMYlLuDU.js", "/assets/react-ChfR-Nl8.js", "/assets/index-Dp3B9jqt.js", "/assets/clsx-B-dksMZM.js", "/assets/utils-CIsb_jhR.js", "/assets/index-C_aiUDWW.js", "/assets/index-kH-wUL5G.js", "/assets/menu-DhrnXeUA.js", "/assets/createLucideIcon-DTOVJ0NK.js", "/assets/search-BQCrw2dg.js", "/assets/sun-SUTbMEtb.js", "/assets/bell-CyqwHFfu.js", "/assets/user-DUABGHUk.js", "/assets/x-Dl0kjJT1.js", "/assets/bot-RaXNf0d9.js", "/assets/index-WEdp_TFg.js", "/assets/ActivePoints-wXE89lo8.js"], "css": [] }, "routes/admin.ui": { "id": "routes/admin.ui", "parentId": "root", "path": "admin/ui", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/admin.ui-CNz1C1Q-.js", "imports": ["/assets/jsx-runtime-Ds-gkUgj.js", "/assets/index-CtvPRVHf.js", "/assets/index-NIGUFBhG.js", "/assets/card--auC-4Ul.js", "/assets/arrow-up-right-toYN2TNu.js", "/assets/createLucideIcon-DTOVJ0NK.js", "/assets/utils-CIsb_jhR.js", "/assets/clsx-B-dksMZM.js"], "css": [] }, "routes/api_test": { "id": "routes/api_test", "parentId": "root", "path": "api_test", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/api_test-CdfyFgkS.js", "imports": ["/assets/index-CtvPRVHf.js"], "css": [] }, "routes/download": { "id": "routes/download", "parentId": "root", "path": "download", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/download-G94q18zO.js", "imports": ["/assets/jsx-runtime-Ds-gkUgj.js", "/assets/Header-D30Bhkjv.js", "/assets/themeStore--iS_I_6G.js", "/assets/index-kH-wUL5G.js", "/assets/index-CtvPRVHf.js", "/assets/react-ChfR-Nl8.js"], "css": [] }, "routes/exchange": { "id": "routes/exchange", "parentId": "root", "path": "exchange", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/exchange-Bsr58kAK.js", "imports": ["/assets/jsx-runtime-Ds-gkUgj.js", "/assets/index-CtvPRVHf.js", "/assets/themeStore--iS_I_6G.js", "/assets/button-DQPZWwFm.js", "/assets/badge-dwcV8iib.js", "/assets/switch-BM4slqr5.js", "/assets/DashFooter-BCWqjM1c.js", "/assets/createLucideIcon-DTOVJ0NK.js", "/assets/activity-CFnPMEEn.js", "/assets/trending-up-Dpl82U3m.js", "/assets/circle-check-big-CIMmSoOe.js", "/assets/settings-CzflHvlS.js", "/assets/play-B-2AR-XO.js", "/assets/circle-alert-DjMReW2r.js", "/assets/chart-column-CHgDE-e-.js", "/assets/react-ChfR-Nl8.js", "/assets/index-C_aiUDWW.js", "/assets/index-Dp3B9jqt.js", "/assets/clsx-B-dksMZM.js", "/assets/utils-CIsb_jhR.js", "/assets/index-DV4WIAmd.js", "/assets/index-WEdp_TFg.js", "/assets/index-Bxt6ZhY0.js", "/assets/index-kH-wUL5G.js", "/assets/menu-DhrnXeUA.js", "/assets/search-BQCrw2dg.js", "/assets/sun-SUTbMEtb.js", "/assets/bell-CyqwHFfu.js", "/assets/user-DUABGHUk.js", "/assets/shield-CPBa5LI-.js", "/assets/x-Dl0kjJT1.js", "/assets/bot-RaXNf0d9.js"], "css": [] }, "routes/account": { "id": "routes/account", "parentId": "root", "path": "account", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/account-CiEpeBV_.js", "imports": ["/assets/jsx-runtime-Ds-gkUgj.js", "/assets/index-CtvPRVHf.js", "/assets/themeStore--iS_I_6G.js", "/assets/DashFooter-BCWqjM1c.js", "/assets/user-DUABGHUk.js", "/assets/lock-BelZz0VX.js", "/assets/createLucideIcon-DTOVJ0NK.js", "/assets/react-ChfR-Nl8.js", "/assets/index-kH-wUL5G.js", "/assets/menu-DhrnXeUA.js", "/assets/search-BQCrw2dg.js", "/assets/sun-SUTbMEtb.js", "/assets/bell-CyqwHFfu.js", "/assets/shield-CPBa5LI-.js", "/assets/x-Dl0kjJT1.js", "/assets/bot-RaXNf0d9.js", "/assets/chart-column-CHgDE-e-.js"], "css": [] }, "routes/feature": { "id": "routes/feature", "parentId": "root", "path": "feature", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/feature-CZB3jzLc.js", "imports": ["/assets/jsx-runtime-Ds-gkUgj.js", "/assets/Header-D30Bhkjv.js", "/assets/themeStore--iS_I_6G.js", "/assets/index-CtvPRVHf.js", "/assets/index-kH-wUL5G.js", "/assets/react-ChfR-Nl8.js"], "css": [] }, "routes/pricing": { "id": "routes/pricing", "parentId": "root", "path": "pricing", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/pricing-CdUuIRbU.js", "imports": ["/assets/jsx-runtime-Ds-gkUgj.js", "/assets/index-CtvPRVHf.js", "/assets/themeStore--iS_I_6G.js", "/assets/Header-D30Bhkjv.js", "/assets/Footer-CIqkhuHr.js", "/assets/react-ChfR-Nl8.js", "/assets/index-kH-wUL5G.js"], "css": [] }, "routes/privacy": { "id": "routes/privacy", "parentId": "root", "path": "privacy", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/privacy-yr9ydxAs.js", "imports": ["/assets/jsx-runtime-Ds-gkUgj.js", "/assets/index-CtvPRVHf.js", "/assets/themeStore--iS_I_6G.js", "/assets/Header-D30Bhkjv.js", "/assets/Footer-CIqkhuHr.js", "/assets/react-ChfR-Nl8.js", "/assets/index-kH-wUL5G.js"], "css": [] }, "routes/sign-up": { "id": "routes/sign-up", "parentId": "root", "path": "sign-up", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/sign-up-N2681kF2.js", "imports": ["/assets/jsx-runtime-Ds-gkUgj.js", "/assets/index-CtvPRVHf.js", "/assets/themeStore--iS_I_6G.js", "/assets/Header-D30Bhkjv.js", "/assets/Footer-CIqkhuHr.js", "/assets/x-Dl0kjJT1.js", "/assets/index-kH-wUL5G.js", "/assets/react-ChfR-Nl8.js", "/assets/createLucideIcon-DTOVJ0NK.js"], "css": [] }, "routes/about2": { "id": "routes/about2", "parentId": "root", "path": "about2", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/about2-5L5l_dXV.js", "imports": ["/assets/jsx-runtime-Ds-gkUgj.js", "/assets/index-CtvPRVHf.js", "/assets/Header-D30Bhkjv.js", "/assets/Footer-CIqkhuHr.js", "/assets/themeStore--iS_I_6G.js", "/assets/index-kH-wUL5G.js", "/assets/react-ChfR-Nl8.js"], "css": [] }, "routes/logout": { "id": "routes/logout", "parentId": "root", "path": "logout", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/logout-CVRBIha3.js", "imports": ["/assets/index-CtvPRVHf.js", "/assets/index-kH-wUL5G.js"], "css": [] }, "routes/review": { "id": "routes/review", "parentId": "root", "path": "review", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/review-DPck4nwT.js", "imports": ["/assets/jsx-runtime-Ds-gkUgj.js", "/assets/index-CtvPRVHf.js", "/assets/themeStore--iS_I_6G.js", "/assets/Header-D30Bhkjv.js", "/assets/Footer-CIqkhuHr.js", "/assets/createLucideIcon-DTOVJ0NK.js", "/assets/chevron-right-B9r4bq0U.js", "/assets/star-DsBeGOeS.js", "/assets/trending-up-Dpl82U3m.js", "/assets/chart-column-CHgDE-e-.js", "/assets/shield-CPBa5LI-.js", "/assets/target-Duyd35Tn.js", "/assets/react-ChfR-Nl8.js", "/assets/index-kH-wUL5G.js"], "css": [] }, "routes/_index": { "id": "routes/_index", "parentId": "root", "path": void 0, "index": true, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/_index-ATNHtDF1.js", "imports": ["/assets/jsx-runtime-Ds-gkUgj.js", "/assets/index-CtvPRVHf.js", "/assets/Header-D30Bhkjv.js", "/assets/Footer-CIqkhuHr.js", "/assets/themeStore--iS_I_6G.js", "/assets/index-kH-wUL5G.js", "/assets/react-ChfR-Nl8.js"], "css": [] }, "routes/about": { "id": "routes/about", "parentId": "root", "path": "about", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/about-CDcRRpCV.js", "imports": ["/assets/jsx-runtime-Ds-gkUgj.js", "/assets/index-CtvPRVHf.js", "/assets/Header-D30Bhkjv.js", "/assets/Footer-CIqkhuHr.js", "/assets/themeStore--iS_I_6G.js", "/assets/createLucideIcon-DTOVJ0NK.js", "/assets/bot-RaXNf0d9.js", "/assets/index-kH-wUL5G.js", "/assets/react-ChfR-Nl8.js"], "css": [] }, "routes/login": { "id": "routes/login", "parentId": "root", "path": "login", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/login-Ci5OjM2l.js", "imports": ["/assets/jsx-runtime-Ds-gkUgj.js", "/assets/index-CtvPRVHf.js", "/assets/themeStore--iS_I_6G.js", "/assets/Header-D30Bhkjv.js", "/assets/Footer-CIqkhuHr.js", "/assets/index-kH-wUL5G.js", "/assets/react-ChfR-Nl8.js"], "css": [] }, "routes/terms": { "id": "routes/terms", "parentId": "root", "path": "terms", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/terms-D1zLnLhJ.js", "imports": ["/assets/jsx-runtime-Ds-gkUgj.js", "/assets/index-CtvPRVHf.js", "/assets/themeStore--iS_I_6G.js", "/assets/Header-D30Bhkjv.js", "/assets/Footer-CIqkhuHr.js", "/assets/react-ChfR-Nl8.js", "/assets/index-kH-wUL5G.js"], "css": [] }, "routes/types": { "id": "routes/types", "parentId": "root", "path": "types", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/types-l0sNRNKZ.js", "imports": [], "css": [] }, "routes/blog": { "id": "routes/blog", "parentId": "root", "path": "blog", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/blog-O2N1jdDp.js", "imports": ["/assets/jsx-runtime-Ds-gkUgj.js", "/assets/index-CtvPRVHf.js", "/assets/themeStore--iS_I_6G.js", "/assets/Header-D30Bhkjv.js", "/assets/Footer-CIqkhuHr.js", "/assets/createLucideIcon-DTOVJ0NK.js", "/assets/trending-up-Dpl82U3m.js", "/assets/bell-CyqwHFfu.js", "/assets/search-BQCrw2dg.js", "/assets/eye-CyZqdGIS.js", "/assets/zap-CMYlLuDU.js", "/assets/shield-CPBa5LI-.js", "/assets/chart-column-CHgDE-e-.js", "/assets/download-bFerL3Gd.js", "/assets/user-DUABGHUk.js", "/assets/calendar-C2oO8jzR.js", "/assets/clock-B56EHORu.js", "/assets/arrow-right-Dgdr3KdE.js", "/assets/react-ChfR-Nl8.js", "/assets/index-kH-wUL5G.js"], "css": [] }, "routes/docu": { "id": "routes/docu", "parentId": "root", "path": "docu", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/docu-l0sNRNKZ.js", "imports": [], "css": [] }, "routes/main": { "id": "routes/main", "parentId": "root", "path": "main", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/main-DnRzYPuT.js", "imports": ["/assets/jsx-runtime-Ds-gkUgj.js", "/assets/App-xwAeDZ-h.js", "/assets/index-CtvPRVHf.js"], "css": [] }, "routes/App": { "id": "routes/App", "parentId": "root", "path": "App", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/App-xwAeDZ-h.js", "imports": ["/assets/jsx-runtime-Ds-gkUgj.js", "/assets/index-CtvPRVHf.js"], "css": [] }, "routes/cvd": { "id": "routes/cvd", "parentId": "root", "path": "cvd", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/cvd-CtwxpaUb.js", "imports": ["/assets/jsx-runtime-Ds-gkUgj.js", "/assets/index-CtvPRVHf.js"], "css": [] }, "routes/doc": { "id": "routes/doc", "parentId": "root", "path": "doc", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/doc-DWwsggg0.js", "imports": ["/assets/jsx-runtime-Ds-gkUgj.js", "/assets/index-CtvPRVHf.js", "/assets/themeStore--iS_I_6G.js", "/assets/Header-D30Bhkjv.js", "/assets/Footer-CIqkhuHr.js", "/assets/react-ChfR-Nl8.js", "/assets/index-kH-wUL5G.js"], "css": [] }, "routes/faq": { "id": "routes/faq", "parentId": "root", "path": "faq", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/faq-Bd9A1UfZ.js", "imports": ["/assets/jsx-runtime-Ds-gkUgj.js", "/assets/Header-D30Bhkjv.js", "/assets/themeStore--iS_I_6G.js", "/assets/index-CtvPRVHf.js", "/assets/index-kH-wUL5G.js", "/assets/react-ChfR-Nl8.js"], "css": [] }, "routes/sla": { "id": "routes/sla", "parentId": "root", "path": "sla", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/sla-ChJgL8aT.js", "imports": ["/assets/jsx-runtime-Ds-gkUgj.js", "/assets/index-CtvPRVHf.js"], "css": [] } }, "url": "/assets/manifest-c01490b7.js", "version": "c01490b7" };
const mode = "production";
const assetsBuildDirectory = "build\\client";
const basename = "/";
const future = { "v3_fetcherPersist": true, "v3_relativeSplatPath": true, "v3_throwAbortReason": true, "v3_routeConfig": false, "v3_singleFetch": true, "v3_lazyRouteDiscovery": true, "unstable_optimizeDeps": false };
const isSpaMode = false;
const publicPath = "/";
const entry = { module: entryServer };
const routes = {
  "root": {
    id: "root",
    parentId: void 0,
    path: "",
    index: void 0,
    caseSensitive: void 0,
    module: route0
  },
  "routes/admin.binance_order_book": {
    id: "routes/admin.binance_order_book",
    parentId: "root",
    path: "admin/binance_order_book",
    index: void 0,
    caseSensitive: void 0,
    module: route1
  },
  "routes/rate_return_inform_kium2": {
    id: "routes/rate_return_inform_kium2",
    parentId: "root",
    path: "rate_return_inform_kium2",
    index: void 0,
    caseSensitive: void 0,
    module: route2
  },
  "routes/rate_return_inform_kium3": {
    id: "routes/rate_return_inform_kium3",
    parentId: "root",
    path: "rate_return_inform_kium3",
    index: void 0,
    caseSensitive: void 0,
    module: route3
  },
  "routes/admin.binance_strategy1": {
    id: "routes/admin.binance_strategy1",
    parentId: "root",
    path: "admin/binance_strategy1",
    index: void 0,
    caseSensitive: void 0,
    module: route4
  },
  "routes/rate_return_inform_kium": {
    id: "routes/rate_return_inform_kium",
    parentId: "root",
    path: "rate_return_inform_kium",
    index: void 0,
    caseSensitive: void 0,
    module: route5
  },
  "routes/admin.strategy._index": {
    id: "routes/admin.strategy._index",
    parentId: "root",
    path: "admin/strategy",
    index: true,
    caseSensitive: void 0,
    module: route6
  },
  "routes/binance_recent_trades": {
    id: "routes/binance_recent_trades",
    parentId: "root",
    path: "binance_recent_trades",
    index: void 0,
    caseSensitive: void 0,
    module: route7
  },
  "routes/binance_today_trades2": {
    id: "routes/binance_today_trades2",
    parentId: "root",
    path: "binance_today_trades2",
    index: void 0,
    caseSensitive: void 0,
    module: route8
  },
  "routes/binance_total_amount2": {
    id: "routes/binance_total_amount2",
    parentId: "root",
    path: "binance_total_amount2",
    index: void 0,
    caseSensitive: void 0,
    module: route9
  },
  "routes/binance_total_amount3": {
    id: "routes/binance_total_amount3",
    parentId: "root",
    path: "binance_total_amount3",
    index: void 0,
    caseSensitive: void 0,
    module: route10
  },
  "routes/admin.strategy.write": {
    id: "routes/admin.strategy.write",
    parentId: "root",
    path: "admin/strategy/write",
    index: void 0,
    caseSensitive: void 0,
    module: route11
  },
  "routes/binance_daily_change": {
    id: "routes/binance_daily_change",
    parentId: "root",
    path: "binance_daily_change",
    index: void 0,
    caseSensitive: void 0,
    module: route12
  },
  "routes/binance_past_percent": {
    id: "routes/binance_past_percent",
    parentId: "root",
    path: "binance_past_percent",
    index: void 0,
    caseSensitive: void 0,
    module: route13
  },
  "routes/binance_today_trades": {
    id: "routes/binance_today_trades",
    parentId: "root",
    path: "binance_today_trades",
    index: void 0,
    caseSensitive: void 0,
    module: route14
  },
  "routes/binance_total_amount": {
    id: "routes/binance_total_amount",
    parentId: "root",
    path: "binance_total_amount",
    index: void 0,
    caseSensitive: void 0,
    module: route15
  },
  "routes/admin.id.reg.action": {
    id: "routes/admin.id.reg.action",
    parentId: "root",
    path: "admin/id/reg/action",
    index: void 0,
    caseSensitive: void 0,
    module: route16
  },
  "routes/admin.strategy.view": {
    id: "routes/admin.strategy.view",
    parentId: "root",
    path: "admin/strategy/view",
    index: void 0,
    caseSensitive: void 0,
    module: route17
  },
  "routes/binance_order_book": {
    id: "routes/binance_order_book",
    parentId: "root",
    path: "binance_order_book",
    index: void 0,
    caseSensitive: void 0,
    module: route18
  },
  "routes/dashboard.strategy": {
    id: "routes/dashboard.strategy",
    parentId: "root",
    path: "dashboard/strategy",
    index: void 0,
    caseSensitive: void 0,
    module: route19
  },
  "routes/admin_login_check": {
    id: "routes/admin_login_check",
    parentId: "root",
    path: "admin_login_check",
    index: void 0,
    caseSensitive: void 0,
    module: route20
  },
  "routes/binance_portfolio": {
    id: "routes/binance_portfolio",
    parentId: "root",
    path: "binance_portfolio",
    index: void 0,
    caseSensitive: void 0,
    module: route21
  },
  "routes/binance_total_roe": {
    id: "routes/binance_total_roe",
    parentId: "root",
    path: "binance_total_roe",
    index: void 0,
    caseSensitive: void 0,
    module: route22
  },
  "routes/total_amount_kium": {
    id: "routes/total_amount_kium",
    parentId: "root",
    path: "total_amount_kium",
    index: void 0,
    caseSensitive: void 0,
    module: route23
  },
  "routes/binance_pl_chart": {
    id: "routes/binance_pl_chart",
    parentId: "root",
    path: "binance_pl_chart",
    index: void 0,
    caseSensitive: void 0,
    module: route24
  },
  "routes/dashboard.assets": {
    id: "routes/dashboard.assets",
    parentId: "root",
    path: "dashboard/assets",
    index: void 0,
    caseSensitive: void 0,
    module: route25
  },
  "routes/dashboard._index": {
    id: "routes/dashboard._index",
    parentId: "root",
    path: "dashboard",
    index: true,
    caseSensitive: void 0,
    module: route26
  },
  "routes/dashboard_backup": {
    id: "routes/dashboard_backup",
    parentId: "root",
    path: "dashboard_backup",
    index: void 0,
    caseSensitive: void 0,
    module: route27
  },
  "routes/etc_inform_kium2": {
    id: "routes/etc_inform_kium2",
    parentId: "root",
    path: "etc_inform_kium2",
    index: void 0,
    caseSensitive: void 0,
    module: route28
  },
  "routes/etc_inform_kium3": {
    id: "routes/etc_inform_kium3",
    parentId: "root",
    path: "etc_inform_kium3",
    index: void 0,
    caseSensitive: void 0,
    module: route29
  },
  "routes/past_inform_kium": {
    id: "routes/past_inform_kium",
    parentId: "root",
    path: "past_inform_kium",
    index: void 0,
    caseSensitive: void 0,
    module: route30
  },
  "routes/realtime-balance": {
    id: "routes/realtime-balance",
    parentId: "root",
    path: "realtime-balance",
    index: void 0,
    caseSensitive: void 0,
    module: route31
  },
  "routes/etc_inform_kium": {
    id: "routes/etc_inform_kium",
    parentId: "root",
    path: "etc_inform_kium",
    index: void 0,
    caseSensitive: void 0,
    module: route32
  },
  "routes/forgot-password": {
    id: "routes/forgot-password",
    parentId: "root",
    path: "forgot-password",
    index: void 0,
    caseSensitive: void 0,
    module: route33
  },
  "routes/admin.approval": {
    id: "routes/admin.approval",
    parentId: "root",
    path: "admin/approval",
    index: void 0,
    caseSensitive: void 0,
    module: route34
  },
  "routes/admin.settings": {
    id: "routes/admin.settings",
    parentId: "root",
    path: "admin/settings",
    index: void 0,
    caseSensitive: void 0,
    module: route35
  },
  "routes/balance-stream": {
    id: "routes/balance-stream",
    parentId: "root",
    path: "balance-stream",
    index: void 0,
    caseSensitive: void 0,
    module: route36
  },
  "routes/strategyReport": {
    id: "routes/strategyReport",
    parentId: "root",
    path: "strategyReport",
    index: void 0,
    caseSensitive: void 0,
    module: route37
  },
  "routes/binance_count": {
    id: "routes/binance_count",
    parentId: "root",
    path: "binance_count",
    index: void 0,
    caseSensitive: void 0,
    module: route38
  },
  "routes/mystrategyAdd": {
    id: "routes/mystrategyAdd",
    parentId: "root",
    path: "mystrategyAdd",
    index: void 0,
    caseSensitive: void 0,
    module: route39
  },
  "routes/admin.cutOff": {
    id: "routes/admin.cutOff",
    parentId: "root",
    path: "admin/cutOff",
    index: void 0,
    caseSensitive: void 0,
    module: route40
  },
  "routes/admin.member": {
    id: "routes/admin.member",
    parentId: "root",
    path: "admin/member",
    index: void 0,
    caseSensitive: void 0,
    module: route41
  },
  "routes/admin._index": {
    id: "routes/admin._index",
    parentId: "root",
    path: "admin",
    index: true,
    caseSensitive: void 0,
    module: route42
  },
  "routes/admin.login": {
    id: "routes/admin.login",
    parentId: "root",
    path: "admin/login",
    index: void 0,
    caseSensitive: void 0,
    module: route43
  },
  "routes/admin.state": {
    id: "routes/admin.state",
    parentId: "root",
    path: "admin/state",
    index: void 0,
    caseSensitive: void 0,
    module: route44
  },
  "routes/push_enable": {
    id: "routes/push_enable",
    parentId: "root",
    path: "push_enable",
    index: void 0,
    caseSensitive: void 0,
    module: route45
  },
  "routes/cvd_charts": {
    id: "routes/cvd_charts",
    parentId: "root",
    path: "cvd_charts",
    index: void 0,
    caseSensitive: void 0,
    module: route46
  },
  "routes/mystrategy": {
    id: "routes/mystrategy",
    parentId: "root",
    path: "mystrategy",
    index: void 0,
    caseSensitive: void 0,
    module: route47
  },
  "routes/api.alert": {
    id: "routes/api.alert",
    parentId: "root",
    path: "api/alert",
    index: void 0,
    caseSensitive: void 0,
    module: route48
  },
  "routes/api_test2": {
    id: "routes/api_test2",
    parentId: "root",
    path: "api_test2",
    index: void 0,
    caseSensitive: void 0,
    module: route49
  },
  "routes/push_send": {
    id: "routes/push_send",
    parentId: "root",
    path: "push_send",
    index: void 0,
    caseSensitive: void 0,
    module: route50
  },
  "routes/recommend": {
    id: "routes/recommend",
    parentId: "root",
    path: "recommend",
    index: void 0,
    caseSensitive: void 0,
    module: route51
  },
  "routes/admin.ui": {
    id: "routes/admin.ui",
    parentId: "root",
    path: "admin/ui",
    index: void 0,
    caseSensitive: void 0,
    module: route52
  },
  "routes/api_test": {
    id: "routes/api_test",
    parentId: "root",
    path: "api_test",
    index: void 0,
    caseSensitive: void 0,
    module: route53
  },
  "routes/download": {
    id: "routes/download",
    parentId: "root",
    path: "download",
    index: void 0,
    caseSensitive: void 0,
    module: route54
  },
  "routes/exchange": {
    id: "routes/exchange",
    parentId: "root",
    path: "exchange",
    index: void 0,
    caseSensitive: void 0,
    module: route55
  },
  "routes/account": {
    id: "routes/account",
    parentId: "root",
    path: "account",
    index: void 0,
    caseSensitive: void 0,
    module: route56
  },
  "routes/feature": {
    id: "routes/feature",
    parentId: "root",
    path: "feature",
    index: void 0,
    caseSensitive: void 0,
    module: route57
  },
  "routes/pricing": {
    id: "routes/pricing",
    parentId: "root",
    path: "pricing",
    index: void 0,
    caseSensitive: void 0,
    module: route58
  },
  "routes/privacy": {
    id: "routes/privacy",
    parentId: "root",
    path: "privacy",
    index: void 0,
    caseSensitive: void 0,
    module: route59
  },
  "routes/sign-up": {
    id: "routes/sign-up",
    parentId: "root",
    path: "sign-up",
    index: void 0,
    caseSensitive: void 0,
    module: route60
  },
  "routes/about2": {
    id: "routes/about2",
    parentId: "root",
    path: "about2",
    index: void 0,
    caseSensitive: void 0,
    module: route61
  },
  "routes/logout": {
    id: "routes/logout",
    parentId: "root",
    path: "logout",
    index: void 0,
    caseSensitive: void 0,
    module: route62
  },
  "routes/review": {
    id: "routes/review",
    parentId: "root",
    path: "review",
    index: void 0,
    caseSensitive: void 0,
    module: route63
  },
  "routes/_index": {
    id: "routes/_index",
    parentId: "root",
    path: void 0,
    index: true,
    caseSensitive: void 0,
    module: route64
  },
  "routes/about": {
    id: "routes/about",
    parentId: "root",
    path: "about",
    index: void 0,
    caseSensitive: void 0,
    module: route65
  },
  "routes/login": {
    id: "routes/login",
    parentId: "root",
    path: "login",
    index: void 0,
    caseSensitive: void 0,
    module: route66
  },
  "routes/terms": {
    id: "routes/terms",
    parentId: "root",
    path: "terms",
    index: void 0,
    caseSensitive: void 0,
    module: route67
  },
  "routes/types": {
    id: "routes/types",
    parentId: "root",
    path: "types",
    index: void 0,
    caseSensitive: void 0,
    module: route68
  },
  "routes/blog": {
    id: "routes/blog",
    parentId: "root",
    path: "blog",
    index: void 0,
    caseSensitive: void 0,
    module: route69
  },
  "routes/docu": {
    id: "routes/docu",
    parentId: "root",
    path: "docu",
    index: void 0,
    caseSensitive: void 0,
    module: route70
  },
  "routes/main": {
    id: "routes/main",
    parentId: "root",
    path: "main",
    index: void 0,
    caseSensitive: void 0,
    module: route71
  },
  "routes/App": {
    id: "routes/App",
    parentId: "root",
    path: "App",
    index: void 0,
    caseSensitive: void 0,
    module: route72
  },
  "routes/cvd": {
    id: "routes/cvd",
    parentId: "root",
    path: "cvd",
    index: void 0,
    caseSensitive: void 0,
    module: route73
  },
  "routes/doc": {
    id: "routes/doc",
    parentId: "root",
    path: "doc",
    index: void 0,
    caseSensitive: void 0,
    module: route74
  },
  "routes/faq": {
    id: "routes/faq",
    parentId: "root",
    path: "faq",
    index: void 0,
    caseSensitive: void 0,
    module: route75
  },
  "routes/sla": {
    id: "routes/sla",
    parentId: "root",
    path: "sla",
    index: void 0,
    caseSensitive: void 0,
    module: route76
  }
};
export {
  serverManifest as assets,
  assetsBuildDirectory,
  basename,
  entry,
  future,
  isSpaMode,
  mode,
  publicPath,
  routes
};
