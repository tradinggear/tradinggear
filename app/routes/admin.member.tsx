'use client';

import React, { useState, useEffect, useRef } from 'react';
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

import { useSidebarStore } from "@/stores/adminStore";
import Sidebar from "@/components/Admin/AdminSidebar";
import Header from "@/components/Admin/AdminHeader";
import { useNavigate } from "react-router-dom";


const AdminDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [searchType, setSearchType] = useState('id_email');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  const [email, setemail] = useState("");
  const [nickName, setnickName] = useState("");
  const hasLoggedOut = useRef(false);
  
  // 화면 크기 감지
  useEffect(() => {

    if(sessionStorage.getItem("adminEmail") == null) {
      //if (!hasLoggedOut.current) {
        //alert("로그인해주세요!");
        window.location.href = "/admin_login_check";
        return;
      //}
    }        

    const checkScreenSize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      // PC에서는 사이드바 기본 열림, 모바일에서는 기본 닫힘
      if (!mobile) {
        setIsSidebarOpen(true);
      } else {
        setIsSidebarOpen(false);
      }
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const menuItems = [
    { icon: Users, label: '회원목록', href: '/admin/member', active: true },
    { icon: Users, label: '바이낸스오더북', href: '/admin/binance_order_book', active: false },  
    { icon: Users, label: '전략그래프', href: '/admin/binance_strategy1', active: true }, 
    { icon: Users, label: '실시간전략그래프', href: 'http://210.114.22.48:8050/app/app_ws/', active: true }, 
  ];

  const searchOptions = ['이메일', '회원명', '닉네임'];
  const searchOptionsKey = ['id_email', 'full_name', 'nick_name'];


  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  // 모바일에서 오버레이 클릭 시 사이드바 닫기
  const handleOverlayClick = () => {
    if (isMobile) {
      setIsSidebarOpen(false);
    }
  };

  // 샘플 회원 데이터
  /*
  const [membersData] = useState([
    { 
      id: 1, 
      email: 'john.doe@example.com', 
      name: '김철수', 
      grade: 'plus', 
      phone: '010-1234-5678' 
    },
    { 
      id: 2, 
      email: 'jane.smith@example.com', 
      name: '이영희', 
      grade: 'basic', 
      phone: '010-2345-6789' 
    },
    { 
      id: 3, 
      email: 'bob.wilson@example.com', 
      name: '박민수', 
      grade: 'pro', 
      phone: '010-3456-7890' 
    },
    { 
      id: 4, 
      email: 'alice.brown@example.com', 
      name: '최지영', 
      grade: 'max', 
      phone: '010-4567-8901' 
    },
    { 
      id: 5, 
      email: 'charlie.davis@example.com', 
      name: '정하늘', 
      grade: 'basic', 
      phone: '010-5678-9012' 
    },
    { 
      id: 6, 
      email: 'diana.miller@example.com', 
      name: '한소라', 
      grade: 'plus', 
      phone: '010-6789-0123' 
    },
  ]);
  */

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

  /*
  fetch('https://example.com/api', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      name: '홍길동',
      email: 'hong@example.com'
    })
  })
  .then(response => response.json())
  .then(data => console.log('성공:', data))
  .catch(error => console.error('에러:', error));  
  */

  const searchTypeSet = useRef<HTMLButtonElement>(null);
  const searchValue = useRef<HTMLInputElement>(null);  

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    // Handle login logic here
    console.log('Login form submitted:', formData);
    // Redirect to dashboard after successful login

    //const searchType_value = String(searchTypeSet.current?.value);
    const searchType_value = String(searchType);
    const searchValue_value = String(searchValue.current?.value);
    
    //console.log(searchType_value);
    //console.log(searchValue_value);

    const form = new URLSearchParams();
    form.append("searchType", searchType_value ?? "");
    form.append("searchValue", searchValue_value ?? "");     

    const res = await fetch("https://tradinggear.co.kr:8081/tradinggear/members_data.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },      
      body: form,
    });

    const data1 = await res.json();  
    //console.log(data1);  
    setMembersData(data1); // 👈 배열로 상태 업데이트
  };

  // 검색 기능
  const filteredMembers = membersData.filter(member => {
    if (!searchTerm) return true;
    
    switch (searchType) {
      case '이메일':
        return member.id_email.toLowerCase().includes(searchTerm.toLowerCase());
      case '회원명':
        return member.full_name.toLowerCase().includes(searchTerm.toLowerCase());
      case '닉네임':
        return member.nick_name.includes(searchTerm);
      default:
        return true;
    }
  });

  // 정렬 기능
  const sortedMembers = React.useMemo(() => {
    let sortableMembers = [...filteredMembers];
    if (sortConfig.key !== null) {
      sortableMembers.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableMembers;
  }, [filteredMembers, sortConfig]);

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (columnName) => {
    if (sortConfig.key !== columnName) {
      return <ArrowUpDown className="w-4 h-4 ml-1 opacity-50" />;
    }
    return sortConfig.direction === 'ascending' 
      ? <ChevronUp className="w-4 h-4 ml-1" />
      : <ChevronDown className="w-4 h-4 ml-1" />;
  };

  const getGradeBadge = (grade) => {

    const darkStyles = {
      /*
      basic: 'bg-gray-700 text-gray-300 border-gray-600',
      plus: 'bg-blue-900/50 text-blue-300 border-blue-500',
      pro: 'bg-purple-900/50 text-purple-300 border-purple-500',
      max: 'bg-gradient-to-r from-yellow-900/50 to-orange-900/50 text-yellow-300 border-yellow-500'
       */
      1: 'bg-gray-700 text-gray-300 border-gray-600',
      2: 'bg-blue-900/50 text-blue-300 border-blue-500',
      3: 'bg-purple-900/50 text-purple-300 border-purple-500',
      4: 'bg-gradient-to-r from-yellow-900/50 to-orange-900/50 text-yellow-300 border-yellow-500',
      5: 'bg-gradient-to-r from-yellow-900/50 to-orange-900/50 text-yellow-300 border-yellow-500'     
    };

    const lightStyles = {
      /*
      basic: 'bg-gray-100 text-gray-700 border-gray-300',
      plus: 'bg-blue-100 text-blue-700 border-blue-400',
      pro: 'bg-purple-100 text-purple-700 border-purple-400',
      max: 'bg-gradient-to-r from-yellow-100 to-orange-100 text-orange-700 border-orange-400'
      */
      1: 'bg-gray-100 text-gray-700 border-gray-300',
      2: 'bg-blue-100 text-blue-700 border-blue-400',
      3: 'bg-purple-100 text-purple-700 border-purple-400',
      4: 'bg-gradient-to-r from-yellow-100 to-orange-100 text-orange-700 border-orange-400',
      5: 'bg-gradient-to-r from-yellow-100 to-orange-100 text-orange-700 border-orange-400'     
    };
    
    const styles = isDarkMode ? darkStyles : lightStyles;

    let grade_text = "";
    if(grade == 1) {
      grade_text = "normal";
    } else if(grade == 2) {
      grade_text = "basic";
    } else if(grade == 2) {
      grade_text = "plus";
    } else if(grade == 3) {
      grade_text = "pro";
    } else if(grade == 4) {
      grade_text = "max";
    }

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${styles[grade]}`}>
        {grade_text.toUpperCase()}
      </span>
    );
  };

  // 테마별 색상 클래스
  const themeClasses = {
    bg: isDarkMode ? 'bg-gray-900' : 'bg-gray-50',
    sidebar: isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200',
    header: isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200',
    card: isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200',
    text: isDarkMode ? 'text-white' : 'text-gray-900',
    textSecondary: isDarkMode ? 'text-gray-300' : 'text-gray-600',
    textMuted: isDarkMode ? 'text-gray-400' : 'text-gray-500',
    input: isDarkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500',
    button: isDarkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200',
    tableRow: isDarkMode ? 'border-gray-700 hover:bg-gray-750' : 'border-gray-200 hover:bg-gray-50',
    tableHeader: isDarkMode ? 'bg-gray-750' : 'bg-gray-50',
  };

  return (
    <div className={`min-h-screen ${themeClasses.bg}`}>
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
      <div className={`
        transition-all duration-300 ease-in-out
        ${!isMobile && isSidebarOpen ? 'ml-64' : 'ml-0'}
      `}>
        {/* 헤더 */}
        <Header title="회원목록" />

        {/* 메인 콘텐츠 영역 */}
        <main className="p-6">
          {/* 페이지 헤더 */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className={`text-2xl font-bold ${themeClasses.text} mb-2`}>회원 관리</h2>
              <p className={themeClasses.textMuted}>총 {membersData.length}명의 회원이 있습니다.</p>
            </div>
          </div>

          {/* 검색 영역 */}
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className={`${themeClasses.card} rounded-lg p-4 mb-6`}>
              <div className="flex flex-col md:flex-row gap-4">
                <div className="md:w-2/12 w-full">
                  <Label className={`block text-sm font-medium ${themeClasses.textSecondary} mb-2`}>검색 항목</Label>
                  <Select value={searchType} onValueChange={setSearchType}>
                    <SelectTrigger id="searchType" name="searchType" ref={searchTypeSet} className={`w-full px-3 py-2 ${themeClasses.input} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}>
                      <SelectValue placeholder="검색 항목" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                      {searchOptions.map((option, i) => (
                        <SelectItem key={searchOptionsKey[i]} value={searchOptionsKey[i]}>{option}</SelectItem>
                      ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                <div className="md:w-10/12 w-full">
                  <Label className={`block text-sm font-medium ${themeClasses.textSecondary} mb-2`}>검색어</Label>
                  <div className="flex gap-2">
                    <Input type="text" id="searchValue" name="searchValue" ref={searchValue} placeholder="검색어" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className={`flex-1 px-3 py-2 ${themeClasses.input} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`} />
                    <Button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200">
                      <Search className="w-4 h-4" />검색
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </form>
          {/* 회원 테이블 */}
          <div className={`${themeClasses.card} rounded-lg overflow-hidden`}>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className={`border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} ${themeClasses.tableHeader}`}>
                    <th 
                      className={`text-left py-4 px-6 font-semibold ${themeClasses.textSecondary} cursor-pointer hover:bg-opacity-80 transition-colors`}
                      onClick={() => requestSort('email')}
                    >
                      <div className="flex items-center">
                        이메일
                        {getSortIcon('email')}
                      </div>
                    </th>
                    <th 
                      className={`text-left py-4 px-6 font-semibold text-center ${themeClasses.textSecondary} cursor-pointer hover:bg-opacity-80 transition-colors`}
                      onClick={() => requestSort('name')}
                    >
                      <div className="flex items-center justify-center">
                        회원명
                        {getSortIcon('full_name')}
                      </div>
                    </th>
                    <th 
                      className={`text-left py-4 px-6 font-semibold text-center ${themeClasses.textSecondary} cursor-pointer hover:bg-opacity-80 transition-colors`}
                      onClick={() => requestSort('grade')}
                    >
                      <div className="flex items-center justify-center">
                        회원등급
                        {getSortIcon('grade')}
                      </div>
                    </th>
                    <th 
                      className={`text-left py-4 px-6 font-semibold text-center ${themeClasses.textSecondary} cursor-pointer hover:bg-opacity-80 transition-colors`}
                      onClick={() => requestSort('phone')}
                    >
                      <div className="flex items-center justify-center">
                        닉네임
                        {getSortIcon('nick_name')}
                      </div>
                    </th>
                    <th className={`text-left py-4 px-6 font-semibold text-center justify-center ${themeClasses.textSecondary}`}>비고</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedMembers.map((member, index) => (
                    <tr key={member.id} className={`border-b ${themeClasses.tableRow} transition-colors duration-200`}>
                      <td className={`py-4 px-6 ${themeClasses.textSecondary}`}>{member.id_email}</td>
                      <td className={`py-4 px-6 text-center ${themeClasses.text} font-medium`}>{member.full_name}</td>
                      <td className="py-4 px-6 text-center">
                        {getGradeBadge(member.grade)}
                      </td>
                      <td className={`py-4 px-6 text-center ${themeClasses.textSecondary}`}>{member.nick_name}</td>
                      <td className="py-4 px-6">
                        <div className="flex items-center justify-center space-x-2">
                          <button className={`p-2 rounded-lg transition-colors duration-200 ${isDarkMode ? 'text-blue-400 hover:bg-blue-900/20' : 'text-blue-600 hover:bg-blue-100'}`}>
                            <Edit className="w-4 h-4" />
                          </button>
                          <button className={`p-2 rounded-lg transition-colors duration-200 ${isDarkMode ? 'text-red-400 hover:bg-red-900/20' : 'text-red-600 hover:bg-red-100'}`}>
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
          {/*<div className="flex items-center justify-between mt-6">
            <div className={`text-sm ${themeClasses.textMuted}`}>
              총 {sortedMembers.length}개 중 1-{sortedMembers.length}개 표시
            </div>
            <div className="flex items-center space-x-2">
              <button className={`px-3 py-2 ${themeClasses.button} rounded-lg transition-colors duration-200 disabled:opacity-50`} disabled>
                이전
              </button>
              <button className="px-3 py-2 text-white bg-blue-600 rounded-lg">
                1
              </button>
              <button className={`px-3 py-2 ${themeClasses.button} rounded-lg transition-colors duration-200 disabled:opacity-50`} disabled>
                다음
              </button>
            </div>
          </div>
          */}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;