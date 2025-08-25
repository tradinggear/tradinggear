import  { useState, useEffect } from 'react';
import { useThemeStore } from '../stores/themeStore';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import {Shield , Search, Calendar, User, Eye, Heart, Share2, TrendingUp, BookOpen, Bell, Filter, ChevronRight, Download, Play, Clock, Tag, MessageCircle, Bookmark, ArrowRight, BarChart3, Lightbulb, Zap } from 'lucide-react';
import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [
    { title: "블로그 - TRADING GEAR" },
    { name: "blog", content: "AI 트레이딩의 새로운 시대" },
  ];
};


export default function BlogInsights() {
  const { theme, initializeTheme } = useThemeStore();
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    initializeTheme();
  }, [initializeTheme]);

  const themeClasses = theme === 'dark' 
    ? 'bg-gradient-to-br from-slate-900 to-slate-800 text-white'
    : 'bg-gradient-to-br from-white to-slate-50 text-slate-900';

  const headerClasses = theme === 'dark'
    ? 'bg-[#1a1f36]/95 border-[#00d4ff]/20'
    : 'bg-[#f8fafc]/95 border-[#0066cc]/20';

  const bgPrimary = theme === 'dark' ? 'bg-[#1a1f36]' : 'bg-[#f8fafc]';
  const bgSecondary = theme === 'dark' ? 'bg-gray-800/50' : 'bg-white/80';
  const textPrimary = theme === 'dark' ? 'text-white' : 'text-slate-900';
  const textSecondary = theme === 'dark' ? 'text-gray-300' : 'text-slate-600';
  const textTertiary = theme === 'dark' ? 'text-gray-400' : 'text-slate-500';
  const primaryColor = theme === 'dark' ? '#00d4ff' : '#0066cc';
  const accentColor = theme === 'dark' ? '#00ff88' : '#00b894';
  const borderColor = theme === 'dark' ? 'border-gray-700' : 'border-slate-200';
  const hoverBorder = theme === 'dark' ? 'hover:border-[#00d4ff]/50' : 'hover:border-[#0066cc]/50';

  const blogPosts = [
    {
      id: 1,
      category: 'market-analysis',
      title: '2025년 1분기 암호화폐 시장 전망: AI 기반 분석',
      excerpt: '최신 머신러닝 모델을 활용한 비트코인, 이더리움 가격 예측과 주요 알트코인 동향 분석',
      author: 'Trading Gear 리서치팀',
      date: '2025-01-15',
      readTime: '8분',
      views: 15420,
      likes: 342,
      tags: ['비트코인', '이더리움', '시장분석', 'AI예측'],
      featured: true,
      image: '/blog/newsImg_01.jpg',
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
      category: 'strategy',
      title: '그리드 트레이딩 전략 완벽 가이드: 횡보장에서 수익 극대화',
      excerpt: '변동성 시장에서 안정적 수익을 창출하는 그리드 트레이딩 전략의 핵심 원리와 최적화 방법',
      author: '김알고리즘',
      date: '2025-01-12',
      readTime: '12분',
      views: 8930,
      likes: 189,
      tags: ['그리드트레이딩', '자동화', '전략', '리스크관리'],
      featured: false,
      image: '/blog/newsImg_02.jpg',
      content: `
        <h2>그리드 트레이딩이란?</h2>
        <p>그리드 트레이딩은 일정한 간격으로 매수/매도 주문을 배치하여 가격 변동성을 이용해 수익을 창출하는 전략입니다...</p>
      `
    },
    {
      id: 3,
      category: 'update',
      title: 'Trading Gear v3.2 업데이트: 새로운 DeFi 전략 추가',
      excerpt: '유동성 채굴 최적화, 이자 농사 자동화, 새로운 리스크 관리 기능이 추가되었습니다',
      author: '개발팀',
      date: '2025-01-10',
      readTime: '5분',
      views: 12450,
      likes: 278,
      tags: ['업데이트', 'DeFi', '새기능', '유동성채굴'],
      featured: false,
      image: '/blog/newsImg_03.jpg',
      content: `
        <h2>주요 업데이트 내용</h2>
        <p>이번 v3.2 업데이트에서는 DeFi 시장의 급성장에 맞춰 새로운 전략들을 추가했습니다...</p>
      `
    },
    {
      id: 4,
      category: 'market-analysis',
      title: '글로벌 중앙은행 정책이 암호화폐에 미치는 영향',
      excerpt: '미국 Fed, 유럽 ECB, 일본 BOJ의 통화정책 변화와 디지털 자산 시장 상관관계 분석',
      author: '매크로 애널리스트',
      date: '2025-01-08',
      readTime: '10분',
      views: 6780,
      likes: 145,
      tags: ['중앙은행', '통화정책', '매크로', '상관관계'],
      featured: false,
      image: '/blog/newsImg_04.jpg',
      content: `
        <h2>중앙은행 정책의 영향</h2>
        <p>전통 금융시장과 암호화폐 시장의 상관관계가 점차 높아지고 있습니다...</p>
      `
    },
    {
      id: 5,
      category: 'strategy',
      title: 'RSI 다이버전스를 활용한 진입 타이밍 최적화',
      excerpt: '기술적 분석의 핵심 도구인 RSI 다이버전스 패턴을 AI로 자동 감지하고 활용하는 방법',
      author: '테크니컬 분석가',
      date: '2025-01-05',
      readTime: '7분',
      views: 9340,
      likes: 203,
      tags: ['RSI', '다이버전스', '기술적분석', '진입타이밍'],
      featured: false,
      image: '/blog/newsImg_05.jpg',
      content: `
        <h2>RSI 다이버전스란?</h2>
        <p>RSI 다이버전스는 가격과 RSI 지표 간의 방향성 차이를 의미합니다...</p>
      `
    },
    {
      id: 6,
      category: 'update',
      title: '모바일 앱 UI/UX 개선 업데이트 완료',
      excerpt: '사용자 피드백을 반영한 직관적인 인터페이스와 향상된 성능으로 업데이트되었습니다',
      author: 'UX팀',
      date: '2025-01-03',
      readTime: '3분',
      views: 4560,
      likes: 89,
      tags: ['모바일', 'UI/UX', '업데이트', '사용성'],
      featured: false,
      image: '/blog/newsImg_06.jpg',
      content: `
        <h2>주요 개선사항</h2>
        <p>이번 업데이트에서는 사용자 경험을 대폭 개선했습니다...</p>
      `
    }
  ];

  const categories = [
    { key: 'all', label: '전체', icon: <BookOpen className="w-5 h-5" />, count: blogPosts.length },
    { key: 'market-analysis', label: '시장 분석', icon: <TrendingUp className="w-5 h-5" />, count: blogPosts.filter(p => p.category === 'market-analysis').length },
    { key: 'strategy', label: '전략 개발', icon: <Lightbulb className="w-5 h-5" />, count: blogPosts.filter(p => p.category === 'strategy').length },
    { key: 'update', label: '업데이트', icon: <Bell className="w-5 h-5" />, count: blogPosts.filter(p => p.category === 'update').length }
  ];

  const featuredPosts = blogPosts.filter(post => post.featured);
  const filteredPosts = activeCategory === 'all' 
    ? blogPosts.filter(post => !post.featured)
    : blogPosts.filter(post => post.category === activeCategory && !post.featured);

  const searchedPosts = filteredPosts.filter(post => 
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const PostCard = ({ post, featured = false }) => (
    <article className={`${bgSecondary} backdrop-blur-sm rounded-lg border ${borderColor} ${hoverBorder} transition-all duration-300 overflow-hidden ${featured ? 'col-span-full lg:col-span-2' : ''}`}>
      <div className={`aspect-video ${theme === 'dark' ? 'bg-gray-700' : 'bg-slate-200'} relative overflow-hidden`}>
        <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
        <div className="absolute top-4 left-4">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${theme === 'dark' ? 'bg-[#00d4ff] text-black' : 'bg-[#0066cc] text-white'}`}>
            {categories.find(cat => cat.key === post.category)?.label || '기타'}
          </span>
        </div>
        {featured && (
          <div className="absolute top-4 right-4">
            <span className={`px-3 py-1 rounded-full text-sm font-bold ${theme === 'dark' ? 'bg-gradient-to-r from-[#00ff88] to-emerald-400 text-black' : 'bg-gradient-to-r from-[#00b894] to-emerald-500 text-white'}`}>
              특집
            </span>
          </div>
        )}
      </div>
      
      <div className="p-6">
        <div className={`flex items-center gap-4 text-sm ${textTertiary} mb-3`}>
          <div className="flex items-center gap-1">
            <User className="w-4 h-4" />
            {post.author}
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            {formatDate(post.date)}
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            {post.readTime}
          </div>
        </div>
        
        <h3 className={`font-bold ${textPrimary} mb-3 cursor-pointer transition-colors ${featured ? 'text-2xl' : 'text-xl'} ${theme === 'dark' ? 'hover:text-[#00d4ff]' : 'hover:text-[#0066cc]'}`}>
          {post.title}
        </h3>
        
        <p className={`${textSecondary} mb-4 line-clamp-3`}>
          {post.excerpt}
        </p>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {post.tags.map((tag, index) => (
            <span key={index} className={`${theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-slate-100 text-slate-600'} px-2 py-1 rounded text-sm`}>
              #{tag}
            </span>
          ))}
        </div>
        
        <div className="flex items-center justify-between">
          <div className={`flex items-center gap-4 text-sm ${textTertiary}`}>
            <div className="flex items-center gap-1">
              <Eye className="w-4 h-4" />
              {post.views.toLocaleString()}
            </div>
            <div className="flex items-center gap-1">
              <Heart className="w-4 h-4" />
              {post.likes}
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button className={`p-2 rounded-lg ${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-slate-200 hover:bg-slate-300'} transition-colors`}>
              <Bookmark className="w-4 h-4" />
            </button>
            <button className={`p-2 rounded-lg ${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-slate-200 hover:bg-slate-300'} transition-colors`}>
              <Share2 className="w-4 h-4" />
            </button>
            <button className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors font-semibold ${theme === 'dark' ? 'bg-[#00d4ff] hover:bg-cyan-400 text-black' : 'bg-[#0066cc] hover:bg-blue-700 text-white'}`}>
              읽기
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </article>
  );

  return (
    <div className={`min-h-screen ${bgPrimary} ${textPrimary}`}>
      <Header />
      
      {/* Main Content with top padding for fixed header */}
      <div className="pt-20">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className={`absolute inset-0 ${theme === 'dark' ? 'bg-gradient-to-br from-cyan-500/10 via-blue-500/10 to-emerald-500/10' : 'bg-gradient-to-br from-blue-100/50 via-cyan-50/50 to-emerald-50/50'}`}></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className={`text-4xl md:text-6xl font-bold mb-6 ${theme === 'dark' ? 'bg-gradient-to-r from-[#00d4ff] via-cyan-400 to-[#00ff88]' : 'bg-gradient-to-r from-[#0066cc] via-blue-500 to-[#00b894]'} bg-clip-text text-transparent`}>
              인사이트 & 블로그
            </h1>
            <p className={`text-xl md:text-2xl ${textSecondary} mb-8 max-w-3xl mx-auto`}>
              최신 시장 동향부터 전략 개발 팁까지, 트레이딩 성공을 위한 모든 정보
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto relative">
              <div className="relative">
                <Search className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 ${textTertiary}`} />
                <input
                  type="text"
                  placeholder="검색어를 입력하세요..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`w-full pl-12 pr-4 py-3 ${bgSecondary} backdrop-blur-sm border ${borderColor} rounded-lg focus:outline-none ${theme === 'dark' ? 'focus:border-[#00d4ff]' : 'focus:border-[#0066cc]'} ${textPrimary} ${theme === 'dark' ? 'placeholder-gray-400' : 'placeholder-slate-400'}`}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className={`${bgSecondary} backdrop-blur-sm rounded-lg p-6 border ${borderColor} text-center`}>
            <BookOpen className={`w-8 h-8 mx-auto mb-2`} style={{ color: primaryColor }} />
            <div className="text-2xl font-bold mb-1" style={{ color: primaryColor }}>150+</div>
            <div className={textTertiary}>게시글</div>
          </div>
          <div className={`${bgSecondary} backdrop-blur-sm rounded-lg p-6 border ${borderColor} text-center`}>
            <Eye className={`w-8 h-8 mx-auto mb-2`} style={{ color: accentColor }} />
            <div className="text-2xl font-bold mb-1" style={{ color: accentColor }}>500K+</div>
            <div className={textTertiary}>월간 조회수</div>
          </div>
          <div className={`${bgSecondary} backdrop-blur-sm rounded-lg p-6 border ${borderColor} text-center`}>
            <MessageCircle className={`w-8 h-8 mx-auto mb-2`} style={{ color: theme === 'dark' ? '#00d4ff' : '#0066cc' }} />
            <div className="text-2xl font-bold mb-1" style={{ color: theme === 'dark' ? '#00d4ff' : '#0066cc' }}>25K+</div>
            <div className={textTertiary}>커뮤니티 멤버</div>
          </div>
          <div className={`${bgSecondary} backdrop-blur-sm rounded-lg p-6 border ${borderColor} text-center`}>
            <TrendingUp className={`w-8 h-8 mx-auto mb-2`} style={{ color: accentColor }} />
            <div className="text-2xl font-bold mb-1" style={{ color: accentColor }}>92%</div>
            <div className={textTertiary}>콘텐츠 만족도</div>
          </div>
        </div>
      </div>

      {/* Featured Posts */}
      {featuredPosts.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center gap-3 mb-8">
            <Zap className="w-6 h-6" style={{ color: accentColor }} />
            <h2 className={`text-2xl font-bold ${textPrimary}`}>특집 기사</h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {featuredPosts.map((post) => (
              <PostCard key={post.id} post={post} featured={true} />
            ))}
          </div>
        </div>
      )}

      {/* Categories and Posts */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Category Tabs */}
        <div className="flex flex-wrap gap-4 mb-8">
          {categories.map((category) => (
            <button
              key={category.key}
              onClick={() => setActiveCategory(category.key)}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                activeCategory === category.key
                  ? (theme === 'dark' ? 'bg-[#00d4ff] text-black shadow-lg shadow-[#00d4ff]/25' : 'bg-[#0066cc] text-white shadow-lg shadow-[#0066cc]/25')
                  : (theme === 'dark' ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200')
              }`}
            >
              {category.icon}
              {category.label}
              <span className={`px-2 py-1 rounded-full text-sm ${theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-slate-100 text-slate-600'}`}>
                {category.count}
              </span>
            </button>
          ))}
        </div>

        {/* Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {searchedPosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>

        {/* Load More Button */}
        <div className="text-center mt-12">
          <button className={`px-8 py-3 rounded-lg font-semibold transition-colors duration-300 ${theme === 'dark' ? 'bg-[#00d4ff] hover:bg-cyan-400 text-black' : 'bg-[#0066cc] hover:bg-blue-700 text-white'}`}>
            더 많은 글 보기
          </button>
        </div>
      </div>

      {/* Newsletter Signup */}
      <div className={`${theme === 'dark' ? 'bg-gray-800/50' : 'bg-slate-50'} backdrop-blur-sm py-16`}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className={`text-3xl font-bold mb-4 ${textPrimary}`}>주간 인사이트 뉴스레터</h2>
          <p className={`${textSecondary} mb-8`}>
            매주 화요일, 시장 분석과 전략 인사이트를 이메일로 받아보세요
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="이메일 주소"
              className={`flex-1 px-4 py-3 border rounded-lg focus:outline-none ${textPrimary} ${
                theme === 'dark' 
                ? 'bg-gray-800 border-gray-700 focus:border-[#00d4ff] placeholder-gray-400' 
                : 'bg-white border-slate-300 focus:border-[#0066cc] placeholder-slate-400'
              }`}
            />
            <button className={`px-6 py-3 rounded-lg font-semibold transition-colors duration-300 ${theme === 'dark' ? 'bg-[#00d4ff] hover:bg-cyan-400 text-black' : 'bg-[#0066cc] hover:bg-blue-700 text-white'}`}>
              구독하기
            </button>
          </div>
          <p className={`text-sm ${textTertiary} mt-4`}>
            언제든지 구독 취소 가능 · 스팸 없음 · 개인정보 보호
          </p>
        </div>
      </div>

      {/* Popular Resources */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className={`text-3xl font-bold mb-8 text-center ${textPrimary}`}>인기 리소스</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              title: '트레이딩 기초 가이드',
              description: '초보자를 위한 완벽한 시작 가이드',
              icon: <BookOpen className="w-8 h-8" style={{ color: primaryColor }} />,
              downloads: '15.2K',
              type: 'PDF'
            },
            {
              title: '리스크 관리 체크리스트',
              description: '손실을 최소화하는 핵심 원칙들',
              icon: <Shield className="w-8 h-8" style={{ color: accentColor }} />,
              downloads: '8.7K',
              type: 'PDF'
            },
            {
              title: '시장 분석 템플릿',
              description: '체계적인 시장 분석을 위한 도구',
              icon: <BarChart3 className="w-8 h-8" style={{ color: theme === 'dark' ? '#00d4ff' : '#0066cc' }} />,
              downloads: '12.1K',
              type: 'Excel'
            }
          ].map((resource, index) => (
            <div key={index} className={`${bgSecondary} backdrop-blur-sm rounded-lg p-6 border ${borderColor} ${hoverBorder} transition-all duration-300`}>
              <div className="flex items-center gap-4 mb-4">
                {resource.icon}
                <div>
                  <h3 className={`text-xl font-semibold ${textPrimary}`}>{resource.title}</h3>
                  <p className={textSecondary}>{resource.description}</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className={`flex items-center gap-4 text-sm ${textTertiary}`}>
                  <div className="flex items-center gap-1">
                    <Download className="w-4 h-4" />
                    {resource.downloads}
                  </div>
                  <span className={`px-2 py-1 rounded text-xs ${theme === 'dark' ? 'bg-gray-700' : 'bg-slate-100'}`}>
                    {resource.type}
                  </span>
                </div>
                <button className={`px-4 py-2 rounded-lg font-medium transition-colors duration-300 ${theme === 'dark' ? 'bg-[#00d4ff] hover:bg-cyan-400 text-black' : 'bg-[#0066cc] hover:bg-blue-700 text-white'}`}>
                  다운로드
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className={`py-16 bg-gradient-to-r from-[#0066cc] to-[#00b894]`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className={`text-3xl font-bold mb-4 text-white`}>지금 시작하세요</h2>
          <p className={`text-xl mb-8 text-blue-100`}>
            인사이트를 실제 수익으로 바꿔보세요
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button className={`px-8 py-3 rounded-lg font-semibold transition-colors duration-300 bg-white text-[#0066cc] hover:bg-gray-100`}>
              무료 체험 시작
            </button>
            <button className={`border-2 border-white text-white px-8 py-3 rounded-lg font-semibold transition-colors duration-300 bg-transparent hover:bg-white hover:text-[#0066cc]`}>
              전문가 상담
            </button>
          </div>
        </div>
      </div>
      
      </div> {/* Main Content Close */}
      
      {/* Footer */}
      <Footer onLinkClick={(linkName) => linkName} />
    </div>
  );
}