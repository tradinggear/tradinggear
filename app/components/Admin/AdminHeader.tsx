import React, { useState, useEffect } from "react";
import { Menu, Bell, User } from 'lucide-react';
import { useSidebarStore } from '@/stores/adminStore';

interface HeaderProps {
  title: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
  const { toggleSidebar } = useSidebarStore();
  const [email, setemail] = useState("");
  const [nickName, setnickName] = useState("");

  const [membersData, setMembersData] = useState([]);

  useEffect(() => {

    fetch("https://tradinggear.co.kr:8081/tradinggear/members_data.php")  // 실제 API 주소로 변경
      .then((res) => {
        if (!res.ok) throw new Error("네트워크 오류");
        return res.json();  // 👈 JSON 배열로 파싱
      })
      .then((data) => {
        setMembersData(data); // 👈 배열로 상태 업데이트
      })
      .catch((err) => {
        console.error("데이터 가져오기 실패:", err);
      });

      setemail(String(sessionStorage.getItem("adminEmail")));
      setnickName(String(sessionStorage.getItem("adminNickName"))); 

  }, []);

  return (
    <header className="bg-gray-800 border-b border-gray-700">
      <div className="flex items-center justify-between px-4 py-4">
        <div className="flex items-center">
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-md transition-colors duration-200 hover:bg-gray-700 text-gray-400"
          >
            <Menu className="w-5 h-5" />
          </button>
          <h1 className="ml-4 text-xl font-semibold text-white">{title}</h1>
        </div>

        <div className="flex items-center space-x-4">
          {/* 알림 */}
          <button className="p-2 rounded-md relative transition-colors duration-200 hover:bg-gray-700 text-gray-400">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-blue-500 rounded-full"></span>
          </button>

          {/* 프로필 */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
            <span className="hidden md:block text-sm font-medium text-gray-300">{nickName}님</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;