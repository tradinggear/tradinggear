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

  // 모바일에서 오버레이 클릭 시 사이드바 닫기
  const handleOverlayClick = () => {
    closeSidebarOnMobile();
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
        <Header title="차단 전략" />

        {/* 메인 콘텐츠 영역 */}
        <main className="p-6">
          <p className="text-white">페이지 준비 중입니다.</p>
        </main>
      </div>
    </div>
  );
};

export default StrategyList;
