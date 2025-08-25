import { useState, useEffect } from 'react';
import { useThemeStore } from '../stores/themeStore';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [
    { title: "개인정보처리방침 - TRADING GEAR" },
    { name: "privacy", content: "AI 트레이딩의 새로운 시대" },
  ];
};

export default function PrivacyPolicyPage() {
  const { theme, initializeTheme } = useThemeStore();
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  useEffect(() => {
    initializeTheme();
  }, [initializeTheme]);

  const toggleSection = (sectionId: string) => {
    setExpandedSection(expandedSection === sectionId ? null : sectionId);
  };

  const themeClasses = theme === 'dark' 
    ? 'bg-gradient-to-br from-slate-900 to-slate-800 text-white'
    : 'bg-gradient-to-br from-white to-slate-50 text-slate-900';

  const headerClasses = theme === 'dark'
    ? 'bg-slate-900/95 border-cyan-400/20'
    : 'bg-white/95 border-blue-600/20';

  const textPrimary = theme === 'dark' ? 'text-white' : 'text-slate-900';
  const textSecondary = theme === 'dark' ? 'text-slate-300' : 'text-slate-600';
  const primaryColor = theme === 'dark' ? 'text-cyan-400' : 'text-blue-600';
  const accentColor = theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600';

  const privacySections = [
    {
      id: 'overview',
      title: '개인정보처리방침 개요',
      icon: '🛡️',
      color: 'purple',
      content: {
        description: '개인정보보호법에 따라 Trading Gear를 이용하는 이용자의 개인정보 보호 및 권익을 보호하고자 다음과 같이 개인정보처리방침을 명시합니다.',
        details: [
          '개인정보의 처리 목적과 항목',
          '개인정보의 보유 및 이용기간',
          '개인정보의 제3자 제공 및 처리위탁',
          '정보주체의 권리와 행사방법',
          '개인정보의 안전성 확보조치'
        ]
      }
    },
    {
      id: 'collection',
      title: '개인정보 수집 및 이용',
      icon: '📊',
      color: 'blue',
      content: {
        description: 'Trading Gear는 서비스 제공을 위해 필요한 최소한의 개인정보만을 수집합니다.',
        details: [
          '필수 정보: 이메일, 비밀번호, 닉네임',
          '선택 정보: 전화번호, 거주지역, 투자 경험',
          '서비스 이용 정보: 접속 로그, 거래 기록, 설정값',
          '기기 정보: IP 주소, 브라우저 정보, OS 정보',
          'API 연결 정보: 거래소 API 키 (암호화 저장)'
        ]
      }
    },
    {
      id: 'purpose',
      title: '개인정보 처리 목적',
      icon: '🎯',
      color: 'green',
      content: {
        description: '수집된 개인정보는 다음의 목적을 위해서만 처리되며, 목적이 변경될 경우 사전 동의를 받겠습니다.',
        details: [
          '회원 가입 및 계정 관리',
          '서비스 제공 및 운영',
          '고객 지원 및 상담',
          '서비스 개선 및 개발',
          '마케팅 및 이벤트 정보 제공 (동의 시)',
          '법정 의무 이행 및 분쟁 해결'
        ]
      }
    },
    {
      id: 'retention',
      title: '개인정보 보유 및 이용기간',
      icon: '⏰',
      color: 'orange',
      content: {
        description: '개인정보는 수집 및 이용목적이 달성된 후에는 해당 정보를 지체없이 파기합니다.',
        details: [
          '회원 탈퇴 시: 즉시 삭제 (법령 보관 의무 제외)',
          '거래 기록: 전자상거래법에 따라 5년 보관',
          '접속 로그: 통신비밀보호법에 따라 3개월 보관',
          '쿠키 정보: 브라우저 설정에 따라 관리',
          '마케팅 정보: 동의 철회 시 즉시 삭제'
        ]
      }
    },
    {
      id: 'security',
      title: '개인정보 보안조치',
      icon: '🔒',
      color: 'red',
      content: {
        description: 'Trading Gear는 개인정보의 안전성 확보를 위해 다음과 같은 기술적, 관리적 조치를 취하고 있습니다.',
        details: [
          '개인정보 암호화: AES-256 암호화 적용',
          '접근 통제: 역할 기반 접근 제어 시스템',
          '접속 기록 보관: 접근 로그 실시간 모니터링',
          '보안 서버 구축: SSL/TLS 인증서 적용',
          '정기 보안 점검: 월 1회 보안 취약점 점검',
          '직원 교육: 개인정보보호 교육 정기 실시'
        ]
      }
    },
    {
      id: 'rights',
      title: '정보주체의 권리',
      icon: '⚖️',
      color: 'indigo',
      content: {
        description: '이용자는 개인정보 처리에 관하여 다음과 같은 권리를 행사할 수 있습니다.',
        details: [
          '개인정보 처리현황 통지 요구',
          '개인정보 열람 및 처리정지 요구',
          '개인정보 정정·삭제 요구',
          '개인정보 손해배상 요구',
          '개인정보보호위원회 신고',
          '법정대리인의 권리 행사 (만 14세 미만)'
        ]
      }
    },
    {
      id: 'cookies',
      title: '쿠키 운영 정책',
      icon: '🍪',
      color: 'pink',
      content: {
        description: 'Trading Gear는 개인화된 서비스 제공을 위해 쿠키를 사용합니다.',
        details: [
          '필수 쿠키: 로그인 상태 유지, 보안 토큰',
          '기능 쿠키: 언어 설정, 테마 설정',
          '분석 쿠키: 서비스 이용 패턴 분석 (동의 시)',
          '광고 쿠키: 맞춤형 광고 제공 (동의 시)',
          '쿠키 거부: 브라우저 설정에서 차단 가능',
          '필수 쿠키 거부 시 일부 기능 제한'
        ]
      }
    },
    {
      id: 'contact',
      title: '개인정보보호 담당자',
      icon: '👥',
      color: 'cyan',
      content: {
        description: '개인정보 처리에 관한 업무를 총괄해서 책임지고, 개인정보 처리와 관련한 정보주체의 불만처리 및 피해구제를 담당합니다.',
        details: [
          '개인정보보호책임자: 김데이터 (privacy@tradinggear.co.kr)',
          '개인정보보호담당자: 이보안 (security@tradinggear.co.kr)',
          '고객센터: 1588-0000 (평일 09:00-18:00)',
          '팩스: 02-0000-0000',
          '주소: 서울특별시 강남구 테헤란로 123',
          '개인정보보호위원회 (privacy.go.kr, 국번없이 182)'
        ]
      }
    }
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      purple: { border: 'border-purple-400/30', bg: 'bg-purple-400/10', text: 'text-purple-400', icon: 'bg-purple-400/20' },
      blue: { border: 'border-blue-400/30', bg: 'bg-blue-400/10', text: 'text-blue-400', icon: 'bg-blue-400/20' },
      green: { border: 'border-green-400/30', bg: 'bg-green-400/10', text: 'text-green-400', icon: 'bg-green-400/20' },
      orange: { border: 'border-orange-400/30', bg: 'bg-orange-400/10', text: 'text-orange-400', icon: 'bg-orange-400/20' },
      red: { border: 'border-red-400/30', bg: 'bg-red-400/10', text: 'text-red-400', icon: 'bg-red-400/20' },
      indigo: { border: 'border-indigo-400/30', bg: 'bg-indigo-400/10', text: 'text-indigo-400', icon: 'bg-indigo-400/20' },
      pink: { border: 'border-pink-400/30', bg: 'bg-pink-400/10', text: 'text-pink-400', icon: 'bg-pink-400/20' },
      cyan: { border: 'border-cyan-400/30', bg: 'bg-cyan-400/10', text: 'text-cyan-400', icon: 'bg-cyan-400/20' }
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  return (
    <div className={`min-h-screen transition-all duration-300 ${themeClasses}`}>
      
      {/* Header */}
      <Header />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 text-center relative overflow-hidden">
        <div className={`absolute inset-0 ${theme === 'dark' ? 'bg-gradient-radial from-purple-400/10' : 'bg-gradient-radial from-purple-600/10'} to-transparent`}></div>
        
        <div className="max-w-4xl mx-auto px-4 lg:px-8 relative z-10">
          <div className="flex justify-center mb-6">
            <div className={`w-20 h-20 ${theme === 'dark' ? 'bg-purple-400/20' : 'bg-purple-600/20'} rounded-full flex items-center justify-center text-4xl`}>
              🛡️
            </div>
          </div>
          <h1 className={`text-4xl lg:text-5xl font-bold mb-6 ${theme === 'dark' ? 'bg-gradient-to-r from-white to-purple-400' : 'bg-gradient-to-r from-slate-900 to-purple-600'} bg-clip-text text-transparent`}>
            개인정보처리방침
          </h1>
          <p className={`text-lg lg:text-xl ${textSecondary} mb-8 leading-relaxed`}>
            Trading Gear는 이용자의 개인정보를 소중히 여기며<br />
            개인정보보호법에 따라 투명하게 관리합니다.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <div className={`inline-flex items-center px-4 py-2 ${theme === 'dark' ? 'bg-slate-800/60' : 'bg-white/80'} backdrop-blur-lg rounded-full border ${theme === 'dark' ? 'border-purple-400/20' : 'border-purple-600/20'}`}>
              <span className={`text-sm ${textSecondary}`}>최종 업데이트: 2025년 7월 3일</span>
            </div>
            <div className={`inline-flex items-center px-4 py-2 ${theme === 'dark' ? 'bg-purple-400/20' : 'bg-purple-600/20'} backdrop-blur-lg rounded-full border ${theme === 'dark' ? 'border-purple-400/30' : 'border-purple-600/30'}`}>
              <span className={`text-sm ${theme === 'dark' ? 'text-purple-400' : 'text-purple-600'} font-medium`}>개인정보보호법 준수</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="pb-20">
        <div className="max-w-6xl mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {privacySections.map((section, index) => {
              const colorClasses = getColorClasses(section.color);
              const isExpanded = expandedSection === section.id;
              
              return (
                <div
                  key={section.id}
                  className={`${theme === 'dark' ? 'bg-slate-800/40' : 'bg-white/70'} backdrop-blur-lg rounded-2xl border ${colorClasses.border} transition-all duration-300 hover:transform hover:-translate-y-1 hover:shadow-lg overflow-hidden`}
                >
                  <div 
                    className="p-6 cursor-pointer"
                    onClick={() => toggleSection(section.id)}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center">
                        <div className={`w-12 h-12 ${colorClasses.icon} rounded-lg flex items-center justify-center text-xl mr-4`}>
                          {section.icon}
                        </div>
                        <div>
                          <h3 className={`text-lg font-bold ${textPrimary} mb-2`}>
                            {section.title}
                          </h3>
                          <div className={`inline-flex items-center px-2 py-1 ${colorClasses.bg} rounded-full`}>
                            <span className={`text-xs font-medium ${colorClasses.text}`}>
                              섹션 {index + 1}
                            </span>
                          </div>
                        </div>
                      </div>
                      <button className={`w-8 h-8 flex items-center justify-center ${colorClasses.text} transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                    </div>
                    
                    <p className={`${textSecondary} text-sm leading-relaxed mb-4`}>
                      {section.content.description}
                    </p>
                    
                    <div className={`text-xs ${colorClasses.text} font-medium`}>
                      클릭하여 자세히 보기
                    </div>
                  </div>

                  {/* Expanded Content */}
                  <div className={`transition-all duration-300 overflow-hidden ${isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                    <div className={`p-6 pt-0 border-t ${colorClasses.border}`}>
                      <h4 className={`font-semibold ${textPrimary} mb-3 flex items-center`}>
                        <span className={`w-2 h-2 ${colorClasses.bg} rounded-full mr-2`}></span>
                        세부 사항
                      </h4>
                      <ul className="space-y-2">
                        {section.content.details.map((detail, idx) => (
                          <li key={idx} className={`flex items-start ${textSecondary} text-sm`}>
                            <span className={`${colorClasses.text} mr-2 mt-1`}>•</span>
                            <span>{detail}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Important Notice */}
          <div className={`mt-12 ${theme === 'dark' ? 'bg-gradient-to-r from-purple-900/40 to-blue-900/40' : 'bg-gradient-to-r from-purple-100/60 to-blue-100/60'} backdrop-blur-lg rounded-2xl p-8 border ${theme === 'dark' ? 'border-purple-400/20' : 'border-purple-600/20'}`}>
            <div className="text-center">
              <div className={`w-16 h-16 ${theme === 'dark' ? 'bg-purple-400/20' : 'bg-purple-600/20'} rounded-full flex items-center justify-center text-2xl mx-auto mb-4`}>
                📞
              </div>
              <h3 className={`text-xl font-bold ${textPrimary} mb-4`}>개인정보 문의</h3>
              <p className={`${textSecondary} mb-6 leading-relaxed`}>
                개인정보 처리와 관련하여 궁금한 사항이나 불편사항이 있으시면<br />
                언제든지 개인정보보호담당자에게 연락주시기 바랍니다.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <div className={`px-6 py-3 ${theme === 'dark' ? 'bg-slate-800/60' : 'bg-white/80'} backdrop-blur-lg rounded-full border ${theme === 'dark' ? 'border-purple-400/20' : 'border-purple-600/20'}`}>
                  <span className={`text-sm ${textSecondary}`}>📧 privacy@tradinggear.co.kr</span>
                </div>
                <div className={`px-6 py-3 ${theme === 'dark' ? 'bg-slate-800/60' : 'bg-white/80'} backdrop-blur-lg rounded-full border ${theme === 'dark' ? 'border-purple-400/20' : 'border-purple-600/20'}`}>
                  <span className={`text-sm ${textSecondary}`}>📞 1588-0000</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer onLinkClick={(linkName) => linkName} />
    </div>
  );
};
