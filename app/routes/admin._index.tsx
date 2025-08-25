'use client';

import React, { useState, useEffect } from 'react';
import { 
  Menu, 
  X, 
  Users, 
  Bell,
  Search,
  User,
  Edit,
  Trash2,
  Moon,
  Sun,
  ChevronDown,
  ChevronUp,
  ArrowUpDown,
  Lock
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

const AdminDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [searchType, setSearchType] = useState('이메일');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });


  // 화면 크기 감지
  useEffect(() => {
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
    { icon: Users, label: '회원목록', href: '#', active: true },
  ];

  const searchOptions = ['이메일', '회원명', '연락처'];

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleLogout = () => {
    localStorage.removeItem('adminLoggedIn');
    localStorage.removeItem('adminEmail');
    //setIsLoggedIn(false);
    // 실제 환경에서는 router.push('/admin/login') 또는 window.location.href = '/admin/login'
    alert('로그아웃되었습니다. 로그인 페이지로 이동합니다.');
    window.location.href = '/admin/login'; // 실제 환경에서 사용
  };

  // 모바일에서 오버레이 클릭 시 사이드바 닫기
  const handleOverlayClick = () => {
    if (isMobile) {
      setIsSidebarOpen(false);
    }
  };

  // 샘플 회원 데이터
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

  // 검색 기능
  const filteredMembers = membersData.filter(member => {
    if (!searchTerm) return true;
    
    switch (searchType) {
      case '이메일':
        return member.email.toLowerCase().includes(searchTerm.toLowerCase());
      case '회원명':
        return member.name.toLowerCase().includes(searchTerm.toLowerCase());
      case '연락처':
        return member.phone.includes(searchTerm);
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

  const requestSort = (key:string) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (columnName:string) => {
    if (sortConfig.key !== columnName) {
      return <ArrowUpDown className="w-4 h-4 ml-1 opacity-50" />;
    }
    return sortConfig.direction === 'ascending' 
      ? <ChevronUp className="w-4 h-4 ml-1" />
      : <ChevronDown className="w-4 h-4 ml-1" />;
  };

  const getGradeBadge = (grade:string) => {
    const darkStyles = {
      basic: 'bg-gray-700 text-gray-300 border-gray-600',
      plus: 'bg-blue-900/50 text-blue-300 border-blue-500',
      pro: 'bg-purple-900/50 text-purple-300 border-purple-500',
      max: 'bg-gradient-to-r from-yellow-900/50 to-orange-900/50 text-yellow-300 border-yellow-500'
    };

    const lightStyles = {
      basic: 'bg-gray-100 text-gray-700 border-gray-300',
      plus: 'bg-blue-100 text-blue-700 border-blue-400',
      pro: 'bg-purple-100 text-purple-700 border-purple-400',
      max: 'bg-gradient-to-r from-yellow-100 to-orange-100 text-orange-700 border-orange-400'
    };
    
    const styles = isDarkMode ? darkStyles : lightStyles;
    
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${styles[grade]}`}>
        {grade.toUpperCase()}
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
      <div className={`
        fixed top-0 left-0 h-full  border-r ${themeClasses.sidebar} z-50 transition-transform duration-300 ease-in-out
        ${isMobile ? 'w-64' : 'w-64'}
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full">
          {/* 사이드바 헤더 */}
          <div className={`flex items-center justify-between px-[25px] pt-[25px] pb-[15px] ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <h2 className={`text-xl font-bold md:leading-[1.6] ${themeClasses.text}`}>
              <a href="/admin">
              <img className="h-[44px]" src={isDarkMode ? "/logo-white.png" : "/logo.png"} alt="" />
              </a>
            </h2>
            {isMobile && (
              <button
                onClick={toggleSidebar}
                className={`p-1 rounded-md ${isDarkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-600'}`}
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* 메뉴 리스트 */}
          <nav className="flex-1 p-4">
            <ul className="space-y-2">
              {menuItems.map((item, index) => {
                const Icon = item.icon;
                return (
                  <li key={index}>
                    <a
                      href={item.href}
                      className={`
                        flex items-center px-4 py-3 rounded-lg transition-colors duration-200
                        ${item.active 
                          ? 'bg-blue-600 text-white' 
                          : `${themeClasses.textSecondary} ${isDarkMode ? 'hover:bg-gray-700 hover:text-white' : 'hover:bg-gray-100 hover:text-gray-900'}`
                        }
                      `}
                    >
                      <Icon className="w-5 h-5 mr-3" />
                      <span className="font-medium">{item.label}</span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>
          {/* 로그아웃 버튼 */}
          <div className={`p-4 border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <button 
              onClick={handleLogout}
              className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors duration-200 ${isDarkMode ? 'text-gray-300 hover:bg-gray-700 hover:text-white' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`}
            >
              <Lock className="w-5 h-5 mr-3" />
              <span className="font-medium">로그아웃</span>
            </button>
          </div>
        </div>
      </div>

      {/* 메인 콘텐츠 */}
      <div className={`
        transition-all duration-300 ease-in-out
        ${!isMobile && isSidebarOpen ? 'ml-64' : 'ml-0'}
      `}>
        {/* 헤더 */}
        <header className={`${themeClasses.header} border-b`}>
          <div className="flex items-center justify-between px-4 py-4">
            <div className="flex items-center">
              <button
                onClick={toggleSidebar}
                className={`p-2 rounded-md transition-colors duration-200 ${isDarkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-600'}`}
              >
                <Menu className="w-5 h-5" />
              </button>
              <h1 className={`ml-4 text-xl font-semibold ${themeClasses.text}`}>회원목록</h1>
            </div>

            <div className="flex items-center space-x-4">
              {/* 다크모드 토글 */}
              <button 
                onClick={toggleDarkMode}
                className={`p-2 rounded-md transition-colors duration-200 ${isDarkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-600'}`}
              >
                {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>

              {/* 알림 */}
              <button className={`p-2 rounded-md relative transition-colors duration-200 ${isDarkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-600'}`}>
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-blue-500 rounded-full"></span>
              </button>

              {/* 프로필 */}
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <span className={`hidden md:block text-sm font-medium ${themeClasses.textSecondary}`}>관리자</span>
              </div>
            </div>
          </div>
        </header>

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
          <div className={`${themeClasses.card} rounded-lg p-4 mb-6`}>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="md:w-2/12 w-full">
                <Label className={`block text-sm font-medium ${themeClasses.textSecondary} mb-2`}>검색 항목</Label>
                <Select value={searchType} onValueChange={setSearchType}>
                  <SelectTrigger className={`w-full h-10 px-3 py-2 ${themeClasses.input} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}>
                    <SelectValue placeholder="검색 항목" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                    {searchOptions.map(option => (
                      <SelectItem key={option} value={option}>{option}</SelectItem>
                    ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div className="md:w-10/12 w-full">
                <Label className={`block text-sm font-medium ${themeClasses.textSecondary} mb-2`}>검색어</Label>
                <div className="flex gap-2">
                  <Input type={searchType} placeholder="검색어" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className={`flex-1 h-10 px-3 py-2 ${themeClasses.input} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`} />
                  <Button className="px-4 py-2 h-10 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200">
                    <Search className="w-4 h-4" />검색
                  </Button>
                </div>
              </div>
            </div>
          </div>

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
                        {getSortIcon('name')}
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
                        회원연락처
                        {getSortIcon('phone')}
                      </div>
                    </th>
                    <th className={`text-left py-4 px-6 font-semibold text-center justify-center ${themeClasses.textSecondary}`}>비고</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedMembers.map((member, index) => (
                    <tr key={member.id} className={`border-b ${themeClasses.tableRow} transition-colors duration-200`}>
                      <td className={`py-4 px-6 ${themeClasses.textSecondary}`}>{member.email}</td>
                      <td className={`py-4 px-6 text-center ${themeClasses.text} font-medium`}>{member.name}</td>
                      <td className="py-4 px-6 text-center">
                        {getGradeBadge(member.grade)}
                      </td>
                      <td className={`py-4 px-6 text-center ${themeClasses.textSecondary}`}>{member.phone}</td>
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
          <div className="flex items-center justify-between mt-6">
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
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;