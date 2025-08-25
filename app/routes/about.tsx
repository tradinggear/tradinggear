import type { MetaFunction } from "@remix-run/node";
import { useEffect } from 'react';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useThemeStore } from '@/stores/themeStore';
import { Bot, ChartLine, CircleDollarSign, OctagonAlert, ShoppingCart } from 'lucide-react';

export const meta: MetaFunction = () => {
  return [
    { title: "회사소개 - TRADING GEAR" },
    { name: "description", content: "대구 소재 AI 트레이딩뷰 기반 핀테크 기업, 트레이딩기어입니다." },
  ];
};

export default function About() {
  const { theme, isClient, initializeTheme } = useThemeStore();

  useEffect(() => {
    initializeTheme();
  }, [initializeTheme]);

  const Particle = () => (
    <div 
      className={`absolute w-1 h-1 rounded-full opacity-10 pointer-events-none animate-pulse
        ${theme === 'dark' ? 'bg-cyan-400' : 'bg-blue-600'}`}
      style={{
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        animationDelay: `${Math.random() * 6}s`,
        animationDuration: `${Math.random() * 4 + 4}s`,
      }}
    />
  );

  const themeClasses = theme === 'dark' 
    ? 'bg-gradient-to-br from-slate-900 to-slate-800 text-white'
    : 'bg-gradient-to-br from-white to-slate-50 text-slate-900';

  const textPrimary = theme === 'dark' ? 'text-white' : 'text-slate-900';
  const textSecondary = theme === 'dark' ? 'text-slate-300' : 'text-slate-600';
  const primaryColor = theme === 'dark' ? 'text-cyan-400' : 'text-blue-600';
  const accentColor = theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600';
  const cardBg = theme === 'dark' ? 'bg-slate-800/40' : 'bg-white/70';
  const sectionBg = theme === 'dark' ? 'bg-gradient-to-b from-transparent to-slate-800/20' : 'bg-gradient-to-b from-transparent to-slate-100/30';

  return (
    <div className={`min-h-screen transition-all duration-300 ${themeClasses}`}>
      
      {/* Floating particles */}
      {isClient && Array.from({ length: 8 }, (_, i) => (
        <Particle key={i} index={i} />
      ))}

      {/* Header */}
      <Header />

      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center text-center relative overflow-hidden pt-20">
        <div className={`absolute inset-0 ${theme === 'dark' ? 'bg-gradient-radial from-cyan-400/5' : 'bg-gradient-radial from-blue-600/5'} to-transparent`}></div>
        
        <div className="max-w-6xl mx-auto px-4 lg:px-8">
          <div className="mb-6">
            <span className={`inline-block px-4 py-2 rounded-full text-sm font-semibold ${theme === 'dark' ? 'bg-cyan-400/20 text-cyan-400' : 'bg-blue-600/20 text-blue-600'}`}>
              대구 소재 핀테크 기업
            </span>
          </div>
          
          <h1 className={`text-5xl/[3.5rem] lg:text-7xl/[5.5rem] font-bold mb-8 ${theme === 'dark' ? 'bg-gradient-to-r from-white to-cyan-400' : 'bg-gradient-to-r from-slate-900 to-blue-600'} bg-clip-text text-transparent`}>
            국내 최초 <span className={`pt-2 text-3xl lg:text-5xl block`}>국내 &middot; 외 통합 자동매매 플랫폼</span>
          </h1>
          
          <p className={`text-xl lg:text-2xl/[2.5rem] ${textSecondary} mb-8 leading-relaxed max-w-4xl mx-auto`}>
            <span className='text-yellow-400'>AI 트레이딩뷰</span> 기반으로 <span className={primaryColor}>금융</span>과 <span className={primaryColor}>IT</span>가 결합된 <br/>혁신적인 핀테크 솔루션으로<br />
            <span className={accentColor}>1:1 맞춤 전략</span>과 <span className={accentColor}>거래소 API 연동</span>을 통해 서비스를 제공하는 <br/>자동매매 SaaS 플랫폼입니다.
          </p>
          
          <div className={`inline-block ${cardBg} backdrop-blur-sm rounded-2xl p-6 border ${theme === 'dark' ? 'border-cyan-400/20' : 'border-blue-600/20'}`}>
            <p className={`text-lg ${textPrimary} font-semibold`}>
              "멀티에셋 자동매매를 가장 안전하게, 가장 쉽게"
            </p>
          </div>
        </div>
      </section>
      
      
      
      <section className={`py-20 ${sectionBg}`}>
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <h2 className={`text-4xl lg:text-5xl font-bold mb-6 ${textPrimary}`}>트레이딩기어 핵심 기능</h2>
            <p className={`text-xl ${textSecondary} max-w-3xl mx-auto leading-relaxed`}>
              AI 기반 자동매매부터 리스크 관리까지, 트레이딩에 필요한 모든 기능을 제공합니다
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            
            {/* 1. 데이터 & 차트 */}
            <div className={`${cardBg} backdrop-blur-sm rounded-3xl p-8 relative overflow-hidden hover:transform hover:-translate-y-2 transition-all duration-300`}>
              <div className={`w-16 h-16 bg-teal-500/20 rounded-2xl flex items-center justify-center mb-6`}>
                <span className="text-2xl"><ChartLine /></span>
              </div>
              <h3 className={`text-2xl font-bold mb-4 text-teal-500`}>1. 데이터 & 차트</h3>
              <div className={`space-y-3 ${textSecondary}`}>
                <p>• TradingView 차트 및 전략신호 겸층</p>
                <p>• 온체인·옵션 지표 제공</p>
                <p>• 전략별 예측 리포트 제공(AI기반)</p>
              </div>
            </div>

            {/* 2. 전략 제작 */}
            <div className={`${cardBg} backdrop-blur-sm rounded-3xl p-8 relative overflow-hidden hover:transform hover:-translate-y-2 transition-all duration-300`}>
              <div className={`w-16 h-16 bg-green-600/20 rounded-2xl flex items-center justify-center mb-6`}>
                <span className="text-2xl"><Bot /></span>
              </div>
              <h3 className={`text-2xl font-bold mb-4 text-green-600`}>2. 전략 제작</h3>
              <div className={`space-y-3 ${textSecondary}`}>
                <p>• 노코드 워크플로 제공</p>
                <p>• AI 백테스터 내장</p>
                <p>• 초보도 30분내 자동매매 가능</p>
              </div>
            </div>

            {/* 3. 주문 실행 */}
            <div className={`${cardBg} backdrop-blur-sm rounded-3xl p-8 relative overflow-hidden hover:transform hover:-translate-y-2 transition-all duration-300`}>
              <div className={`w-16 h-16 bg-red-500/20 rounded-2xl flex items-center justify-center mb-6`}>
                <span className="text-2xl"><CircleDollarSign /></span>
              </div>
              <h3 className={`text-2xl font-bold mb-4 text-red-500`}>3. 주문 실행</h3>
              <div className={`space-y-3 ${textSecondary}`}>
                <p>• TG-Bridge BYO-Key 방식</p>
                <p>• 멀티브로커 지원</p>
                <p>• 보안·규제 안심 설계</p>
              </div>
            </div>
          </div>

          {/* Bottom Row - 2 Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* 4. 리스크 관리 */}
            <div className={`${cardBg} backdrop-blur-sm rounded-3xl p-8 relative overflow-hidden hover:transform hover:-translate-y-2 transition-all duration-300`}>
              <div className={`w-16 h-16 bg-orange-500/20 rounded-2xl flex items-center justify-center mb-6`}>
                <span className="text-2xl"><OctagonAlert /></span>
              </div>
              <h3 className={`text-2xl font-bold mb-4 text-orange-500`}>4. 리스크 관리</h3>
              <div className={`space-y-3 ${textSecondary}`}>
                <p>• 손실 알림 및 리스크 제한 설정으로 과도한 손실 방지</p>
                <p>• 슬리피지 감지 및 차단 기능 탑재</p>
                <p>• AI기반 실시간 거래내역, 손익 리포트 제공</p>
              </div>
            </div>

            {/* 5. 마켓플레이스 */}
            <div className={`${cardBg} backdrop-blur-sm rounded-3xl p-8 relative overflow-hidden hover:transform hover:-translate-y-2 transition-all duration-300`}>
              <div className={`w-16 h-16 bg-teal-600/20 rounded-2xl flex items-center justify-center mb-6`}>
                <span className="text-2xl"><ShoppingCart /></span>
              </div>
              <h3 className={`text-2xl font-bold mb-4 text-teal-600`}>5. 마켓플레이스</h3>
              <div className={`space-y-3 ${textSecondary}`}>
                <p>• 검증된 전략 템플릿 마켓플레이스 운영</p>
                <p>• 저자에게 수익의 80% 지급으로 양질의 콘텐츠 확보</p>
                <p>• 네트워크 효과로 플랫폼 가치 지속 상승</p>
              </div>
            </div>
          </div>

          {/* Process Flow */}
          <div className="mt-16">
            <div className={`${cardBg} backdrop-blur-sm rounded-3xl p-12 text-center`}>
              <h3 className={`text-2xl font-bold ${textPrimary} mb-8`}>간단한 3단계 프로세스</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="relative">
                  <div className={`w-20 h-20 bg-gradient-to-r ${theme === 'dark' ? 'from-teal-400 to-green-400' : 'from-teal-500 to-green-500'} rounded-full flex items-center justify-center mx-auto mb-4`}>
                    <span className="text-white text-2xl font-bold">1</span>
                  </div>
                  <h4 className={`font-bold ${textPrimary} mb-2`}>데이터 분석</h4>
                  <p className={`text-sm ${textSecondary}`}>
                    TradingView 차트와 AI 예측 리포트로 시장 분석
                  </p>
                  {/* Arrow for desktop */}
                  <div className="hidden md:block absolute top-10 -right-8 text-2xl text-gray-400">→</div>
                </div>
                
                <div className="relative">
                  <div className={`w-20 h-20 bg-gradient-to-r ${theme === 'dark' ? 'from-green-400 to-red-400' : 'from-green-500 to-red-500'} rounded-full flex items-center justify-center mx-auto mb-4`}>
                    <span className="text-white text-2xl font-bold">2</span>
                  </div>
                  <h4 className={`font-bold ${textPrimary} mb-2`}>전략 실행</h4>
                  <p className={`text-sm ${textSecondary}`}>
                    노코드 워크플로로 전략 제작 및 자동 주문 실행
                  </p>
                  {/* Arrow for desktop */}
                  <div className="hidden md:block absolute top-10 -right-8 text-2xl text-gray-400">→</div>
                </div>
                
                <div>
                  <div className={`w-20 h-20 bg-gradient-to-r ${theme === 'dark' ? 'from-red-400 to-orange-400' : 'from-red-500 to-orange-500'} rounded-full flex items-center justify-center mx-auto mb-4`}>
                    <span className="text-white text-2xl font-bold">3</span>
                  </div>
                  <h4 className={`font-bold ${textPrimary} mb-2`}>리스크 관리</h4>
                  <p className={`text-sm ${textSecondary}`}>
                    실시간 손익 모니터링과 자동 리스크 제어
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Company Overview */}
      {/* <section className={`py-20 ${sectionBg}`}>
        <div className="max-w-6xl mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <h2 className={`text-4xl lg:text-5xl font-bold mb-6 ${textPrimary}`}>트레이딩기어 소개</h2>
            <p className={`text-xl ${textSecondary} max-w-3xl mx-auto leading-relaxed`}>
              AI 기술과 금융 전문성을 결합하여 누구나 쉽게 사용할 수 있는 자동매매 SaaS 플랫폼을 제공합니다
            </p>
          </div>

          <div className="">
            <div className="space-y-8">
              <div className={`${cardBg} backdrop-blur-sm rounded-2xl p-6`}>
                <h3 className={`text-2xl font-bold mb-4 ${primaryColor}`}>🎯 핵심 서비스</h3>
                <ul className={`space-y-3 ${textSecondary}`}>
                  <li>• AI 트레이딩뷰 기반 분석 시스템</li>
                  <li>• 개인별 맞춤형 자동매매 전략</li>
                  <li>• 다중 거래소 API 연동</li>
                  <li>• 실시간 리스크 관리</li>
                </ul>
              </div>

            </div>

            <div className={`${cardBg} backdrop-blur-sm rounded-2xl p-8 text-center`}>
              <h3 className={`text-2xl font-bold mb-6 ${textPrimary}`}>핵심 가치</h3>
              <div className="space-y-6">
                <div>
                  <div className="text-4xl mb-3">🛡️</div>
                  <h4 className={`font-semibold ${textPrimary} mb-2`}>보안성</h4>
                  <p className={`text-sm ${textSecondary}`}>최고 수준의 보안 시스템</p>
                </div>
                <div>
                  <div className="text-4xl mb-3">👤</div>
                  <h4 className={`font-semibold ${textPrimary} mb-2`}>사용 편의성</h4>
                  <p className={`text-sm ${textSecondary}`}>직관적이고 간편한 인터페이스</p>
                </div>
                <div>
                  <div className="text-4xl mb-3">📊</div>
                  <h4 className={`font-semibold ${textPrimary} mb-2`}>투명성</h4>
                  <p className={`text-sm ${textSecondary}`}>모든 거래 내역 실시간 공개</p>
                </div>
                <div>
                  <div className="text-4xl mb-3">⚖️</div>
                  <h4 className={`font-semibold ${textPrimary} mb-2`}>규제 적합성</h4>
                  <p className={`text-sm ${textSecondary}`}>금융당국 가이드라인 준수</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section> */}
      
      {/* Competitive Advantages */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <h2 className={`text-4xl lg:text-5xl font-bold mb-6 ${textPrimary}`}>트레이딩기어의 경쟁사 대비 차별점</h2>
            <p className={`text-xl ${textSecondary} max-w-3xl mx-auto leading-relaxed`}>
              시장의 기존 솔루션들과 차별화된 트레이딩기어만의 고유한 경쟁 우위를 소개합니다
            </p>
          </div>


          {/* Four Competitive Advantages in Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* 지원 자산 및 자동집행 */}
            <div className={`${cardBg} backdrop-blur-sm rounded-3xl p-8 border-l-4 ${theme === 'dark' ? 'border-red-500' : 'border-red-600'}`}>
              <div className="flex items-start space-x-4">
                <div className={`w-16 h-16 ${theme === 'dark' ? 'bg-red-500/20' : 'bg-red-50'} rounded-2xl flex items-center justify-center flex-shrink-0`}>
                  <span className="text-2xl">📈</span>
                </div>
                <div className="flex-1">
                  <h3 className={`text-2xl font-bold mb-4 ${theme === 'dark' ? 'text-red-400' : 'text-red-600'}`}>
                    지원 자산 및 자동집행
                  </h3>
                  <div className={`space-y-3 ${textSecondary}`}>
                    <p>• 국내외 주식+선물 통합 플랫폼으로 중류 구분없이 매매 가능</p>
                    <p>• 경쟁사들은 대부분 단일 자산군에 집중 (코인 전용 및 등)</p>
                    <p>• 합법적 SaaS 구조를 갖춘 자동매매 플랫폼</p>
                  </div>
                </div>
              </div>
            </div>

            {/* 보안 및 규제 적합성 */}
            <div className={`${cardBg} backdrop-blur-sm rounded-3xl p-8 border-l-4 ${theme === 'dark' ? 'border-emerald-500' : 'border-emerald-600'}`}>
              <div className="flex items-start space-x-4">
                <div className={`w-16 h-16 ${theme === 'dark' ? 'bg-emerald-500/20' : 'bg-emerald-50'} rounded-2xl flex items-center justify-center flex-shrink-0`}>
                  <span className="text-2xl">🛡️</span>
                </div>
                <div className="flex-1">
                  <h3 className={`text-2xl font-bold mb-4 ${theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600'}`}>
                    보안 및 규제 적합성
                  </h3>
                  <div className={`space-y-3 ${textSecondary}`}>
                    <p>• API키 마스킹 보안처리로 해킹내부 유출 위험 차단</p>
                    <p>• 중앙 서버에 비밀번호 암호화 보관으로 내부 유출 위험 차단</p>
                    <p>• 업종코드 KSIC 66199 핀테크 예외 적용 정책자금 지원 대상</p>
                  </div>
                </div>
              </div>
            </div>

            {/* 리스크 제어 및 요금 체계 */}
            <div className={`${cardBg} backdrop-blur-sm rounded-3xl p-8 border-l-4 ${theme === 'dark' ? 'border-orange-500' : 'border-orange-600'}`}>
              <div className="flex items-start space-x-4">
                <div className={`w-16 h-16 ${theme === 'dark' ? 'bg-orange-500/20' : 'bg-orange-50'} rounded-2xl flex items-center justify-center flex-shrink-0`}>
                  <span className="text-2xl">⚡</span>
                </div>
                <div className="flex-1">
                  <h3 className={`text-2xl font-bold mb-4 ${theme === 'dark' ? 'text-orange-400' : 'text-orange-600'}`}>
                    리스크 제어 및 요금 체계
                  </h3>
                  <div className={`space-y-3 ${textSecondary}`}>
                    <p>• AI 기반 수익률 예측보고서 제공</p>
                    <p>• 이용자 대시보드에서 실시간 손실률 확인 가능</p>
                    <p>• 정액 구독료 + 0% 성과수수료의 투명한 요금 체계</p>
                  </div>
                </div>
              </div>
            </div>

            {/* 유사업종 대비 핵심 차별점 */}
            <div className={`${cardBg} backdrop-blur-sm rounded-3xl p-8 border-l-4 ${theme === 'dark' ? 'border-cyan-500' : 'border-cyan-600'}`}>
              <div className="flex items-start space-x-4">
                <div className={`w-16 h-16 ${theme === 'dark' ? 'bg-cyan-500/20' : 'bg-cyan-50'} rounded-2xl flex items-center justify-center flex-shrink-0`}>
                  <span className="text-2xl">🎯</span>
                </div>
                <div className="flex-1">
                  <h3 className={`text-2xl font-bold mb-4 ${theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600'}`}>
                    유사업종 대비 핵심 차별점
                  </h3>
                  <div className={`space-y-3 ${textSecondary}`}>
                    <p>• 트레이딩뷰 차트만 제공하는 카카오페이증권과 달리 AI기반 전략 및 수익률 예측보고서 제공</p>
                    <p>• 리딩방과 달리 투명한 로그 기록으로 성과 과장·삭제 불가능</p>
                  </div>
                </div>
              </div>
            </div>
            
          </div>

          {/* Summary Section */}
          {/* <div className="mt-16 text-center">
            <div className={`${cardBg} backdrop-blur-sm rounded-3xl p-12 max-w-4xl mx-auto`}>
              <div className="mb-6">
                <div className={`w-16 h-16 ${theme === 'dark' ? 'bg-gradient-to-r from-red-500/20 to-cyan-500/20' : 'bg-gradient-to-r from-red-50 to-cyan-50'} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                  <span className="text-3xl">🚀</span>
                </div>
                <h3 className={`text-2xl font-bold ${textPrimary} mb-4`}>트레이딩기어만의 독보적 경쟁력</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
                <div>
                  <h4 className={`font-bold ${primaryColor} mb-3`}>🎯 기술적 우위</h4>
                  <ul className={`space-y-2 ${textSecondary} text-sm`}>
                    <li>• 멀티에셋 통합 플랫폼</li>
                    <li>• AI 기반 예측 시스템</li>
                    <li>• 실시간 리스크 관리</li>
                    <li>• 투명한 성과 기록</li>
                  </ul>
                </div>
                <div>
                  <h4 className={`font-bold ${accentColor} mb-3`}>🛡️ 운영적 우위</h4>
                  <ul className={`space-y-2 ${textSecondary} text-sm`}>
                    <li>• 최고 수준 보안 체계</li>
                    <li>• 합법적 SaaS 구조</li>
                    <li>• 투명한 요금 체계</li>
                    <li>• 규제 적합성 확보</li>
                  </ul>
                </div>
              </div>
            </div>
          </div> */}

        </div>
      </section>

      {/* Certificates Section */}
      <section className={`py-20 ${sectionBg}`}>
        <div className="max-w-6xl mx-auto px-4 lg:px-8">
          <h2 className={`text-4xl lg:text-5xl font-bold mb-8 text-center ${textPrimary}`}>인증 및 등록증</h2>
          
          {/* <div className="grid grid-cols-1 lg:grid-cols-2 gap-12"> */}
          <div className="w-1/2 mx-auto">
            {/* 저작권 등록증 */}
            <div className={`flex${cardBg} backdrop-blur-sm rounded-2xl p-8`}>
              {/* <h3 className={`text-2xl font-bold mb-6 ${primaryColor} text-center flex justify-between`}><span className="text-yellow-400 pr-2">✓</span><span className="flex-1 text-left"> 저작권 등록</span> <span className={`bg-cyan-400 text-[14px] font-semibold text-black rounded-[100px] px-4`}>완료</span></h3> */}
              <div className={`${theme === 'dark' ? 'bg-slate-700/50' : 'bg-gray-100'} rounded-xl p-6 flex items-center justify-center`}>
                <div className="text-center">
                  <div className="img">
                    <img src="/docImg.jpg" alt="" />
                  </div>
                </div>
              </div>
              <h3 className={`text-2xl font-bold mt-4 text-center ${primaryColor}`}><span className="text-yellow-400 pr-2">✓</span>저작권 등록 완료</h3>
            </div>

            {/* 특허 및 실용신안 */}
            {/* <div className={`${cardBg} backdrop-blur-sm rounded-2xl p-8`}>
              <h3 className={`text-2xl font-bold mb-6 ${accentColor} text-center`}>특허 및 실용신안 진행중</h3>
              <div className={`${theme === 'dark' ? 'bg-slate-700/50' : 'bg-gray-100'} rounded-xl p-6 min-h-[200px] flex items-center justify-center`}>
                <div className="text-center">
                  <div className="img">
                    <img src="" alt="" />
                  </div>
                </div>
              </div>
              <div className="h-20"></div>
              <h3 className={`text-2xl font-bold mb-6 ${accentColor} text-center`}>유사투자자문업 신고 진행중</h3>
              <div className={`${theme === 'dark' ? 'bg-slate-700/50' : 'bg-gray-100'} rounded-xl p-6 min-h-[200px] flex items-center justify-center`}>
                <div className="text-center">
                  <div className="img">
                    <img src="" alt="" />
                  </div>
                </div>
              </div>

            </div> */}
            

          </div>

        </div>
      </section>


      {/* Technology Stack */}
      <section className={`py-20 ${sectionBg}`}>
        <div className="max-w-6xl mx-auto px-4 lg:px-8">
          <h2 className={`text-4xl lg:text-5xl font-bold mb-16 text-center ${textPrimary}`}>기술 스택</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className={`${cardBg} backdrop-blur-sm rounded-2xl p-8 text-center`}>
              <div className="text-5xl mb-4">🤖</div>
              <h3 className={`text-xl font-bold mb-4 ${primaryColor}`}>AI & 머신러닝</h3>
              <ul className={`${textSecondary} text-sm space-y-2`}>
                <li>딥러닝 기반 시장 분석</li>
                <li>패턴 인식 알고리즘</li>
                <li>리스크 관리 시스템</li>
                <li>실시간 데이터 처리</li>
              </ul>
            </div>

            <div className={`${cardBg} backdrop-blur-sm rounded-2xl p-8 text-center`}>
              <div className="text-5xl mb-4">🔗</div>
              <h3 className={`text-xl font-bold mb-4 ${accentColor}`}>API 연동</h3>
              <ul className={`${textSecondary} text-sm space-y-2`}>
                <li>다중 거래소 연결</li>
                <li>실시간 시세 수신</li>
                <li>자동 주문 실행</li>
                <li>포트폴리오 관리</li>
              </ul>
            </div>

            <div className={`${cardBg} backdrop-blur-sm rounded-2xl p-8 text-center`}>
              <div className="text-5xl mb-4">📱</div>
              <h3 className={`text-xl font-bold mb-4 ${primaryColor}`}>플랫폼</h3>
              <ul className={`${textSecondary} text-sm space-y-2`}>
                <li>웹 기반 SaaS</li>
                <li>모바일 최적화</li>
                <li>클라우드 인프라</li>
                <li>24/7 모니터링</li>
              </ul>
            </div>
          </div>
        </div>
      </section>


      {/* Footer */}
      <Footer onLinkClick={(linkName) => console.log(`About 페이지 Footer 링크 클릭: ${linkName}`)} />
    </div>
  );
}