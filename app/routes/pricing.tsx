import  { useState, useEffect } from 'react';
import { useThemeStore } from '@/stores/themeStore';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [
    { title: "요금제 - TRADING GEAR" },
    { name: "pricing", content: "AI 트레이딩의 새로운 시대" },
  ];
};

export default function PricingPage() {
  const { theme, initializeTheme } = useThemeStore();
  const [billingCycle, setBillingCycle] = useState('monthly');

  useEffect(() => {
    initializeTheme();
  }, [initializeTheme]);

  const themeClasses = theme === 'dark' 
    ? 'bg-gradient-to-br from-slate-900 to-slate-800 text-white'
    : 'bg-gradient-to-br from-white to-slate-50 text-slate-900';

  const textPrimary = theme === 'dark' ? 'text-white' : 'text-slate-900';
  const textSecondary = theme === 'dark' ? 'text-slate-300' : 'text-slate-600';
  const accentColor = theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600';

  const plans = [
    {
      id: 'basic',
      name: 'Basic',
      price: { monthly: 29000, yearly: 290000 },
      popular: false,
      description: '초보 투자자, 기본 자동매매 사용자',
      features: [
        '자동매매 기본 기능 : 1개 전략 구독 가능',
        '실시간 시세 조회 : 국내 주식/코인 통합',
        '기본 알림 서비스 : 매수·매도 알림 (앱·카톡·이메일)',
        '기본 리스크 관리 : 손절/익절 설정',
        '기본 고객지원 : FAQ + 이메일 문의',
      ],
      buttonText: '시작하기',
      buttonStyle: 'secondary'
    },
    {
      id: 'pro',
      name: 'Pro',
      price: { monthly: 59000, yearly: 590000 },
      popular: true,
      description: '중급 트레이더, 다전략 사용자',
      features: [
        '자동매매 확장 기능 : 최대 3개 전략 구독',
        '백테스트 제공 (기본) : 최근 6개월 데이터 분석',
        '전략 커스터마이징 : 파라미터 조정 가능',
        '고급 알림 서비스 : 푸시 알림 + 실시간 체결 정보',
        '리스크 관리 강화: 트레일링 스탑, 포지션 제한',
        'API 연동 : 키움증권·업비트·바이낸스 등',
        '멀티 브로커 연결',
        
      ],
      buttonText: '가장 인기',
      buttonStyle: 'primary'
    },
    {
      id: 'premium',
      name: 'Premium',
      price: { monthly: 99000, yearly: 990000 },
      popular: false,
      description: '전문가, 퀸트 지향 사용자',
      features: [
        '무제한 전략 구독',
        '고급 백테스트 : 최대 5년치 데이터 + 심층 성능 분석',
        'AI 기반 전략 추천 (머신러닝 분석으로 종목·전략 추천)',
        '실시간 체결 리포트 + 손익 분석 대시보드',
        '리스크 자동화 : 변동성 기반 DCA, 포트폴리오 리밸런싱',
        '프리미엄 고객지원 : 실시간 채팅 + 전담 매니저',
        '전략 마켓 입점 기회 (전략가 수익 쉐어 가능)'
      ],
      buttonText: '문의하기',
      buttonStyle: 'premium'
    }
  ];

  const formatPrice = (price: number) => {
    if (price === 0) return '무료';
    return new Intl.NumberFormat('ko-KR').format(price);
  };

  const getYearlyDiscount = (monthly: number, yearly: number) => {
    if (monthly === 0) return 0;
    const yearlyMonthly = yearly / 12;
    const discount = ((monthly - yearlyMonthly) / monthly * 100);
    return Math.round(discount);
  };

  return (
    <div className={`min-h-screen transition-all duration-300 ${themeClasses}`}>
      
      {/* Header */}
      <Header/>
      
      {/* Hero Section */}
      <section className="pt-32 lg:pt-40 pb-16 lg:pb-20 text-center relative overflow-hidden">
        <div className={`absolute inset-0 ${theme === 'dark' ? 'bg-gradient-radial from-cyan-400/10' : 'bg-gradient-radial from-blue-600/10'} to-transparent`}></div>
        
        <div className="max-w-4xl mx-auto px-4 lg:px-8 relative z-10">
          <h1 className={`text-4xl lg:text-6xl font-bold mb-6 ${theme === 'dark' ? 'bg-gradient-to-r from-white to-cyan-400' : 'bg-gradient-to-r from-slate-900 to-blue-600'} bg-clip-text text-transparent`}>
            투명한 가격, 확실한 가치
          </h1>
          <p className={`text-xl lg:text-2xl ${textSecondary} mb-8 leading-relaxed`}>
            모든 플랜에 7일 무료 체험이 포함되어 있습니다.<br />
            신용카드 등록 없이 바로 시작하세요.
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center md-8 lg:mb-12">
            <div className={`${theme === 'dark' ? 'bg-slate-800/60' : 'bg-white/60'} backdrop-blur-lg rounded-full p-1 border ${theme === 'dark' ? 'border-cyan-400/20' : 'border-blue-600/20'}`}>
              <button
                className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${
                  billingCycle === 'monthly' 
                    ? `${theme === 'dark' ? 'bg-cyan-400 text-slate-900' : 'bg-blue-600 text-white'} shadow-lg` 
                    : `${textPrimary} hover:text-cyan-400`
                }`}
                onClick={() => setBillingCycle('monthly')}
              >
                월간 결제
              </button>
              <button
                className={`px-6 py-2 rounded-full font-medium transition-all duration-300 relative ${
                  billingCycle === 'yearly' 
                    ? `${theme === 'dark' ? 'bg-cyan-400 text-slate-900' : 'bg-blue-600 text-white'} shadow-lg` 
                    : `${textPrimary} hover:text-cyan-400`
                }`}
                onClick={() => setBillingCycle('yearly')}
              >
                연간 결제
                <span className={`ml-2 px-2 py-1 text-xs ${accentColor} ${theme === 'dark' ? 'bg-slate-800/60' : 'bg-white/90'} rounded-full`}>
                  2개월 무료
                </span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Plans */}
      <section className="pb-20">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
            {plans.map((plan) => (
              <div 
                key={plan.id}
                className={`relative ${theme === 'dark' ? 'bg-slate-800/60' : 'bg-white/90'} backdrop-blur-lg rounded-2xl border transition-all duration-300 hover:transform hover:-translate-y-2 ${
                  plan.popular 
                    ? `${theme === 'dark' ? 'border-cyan-400 shadow-cyan-400/20' : 'border-blue-600 shadow-blue-600/20'} shadow-xl` 
                    : `${theme === 'dark' ? 'border-cyan-400/20 hover:border-cyan-400/40' : 'border-blue-600/20 hover:border-blue-600/40'} hover:shadow-lg`
                }`}
              >
                {plan.popular && (
                  <div className={`absolute -top-4 left-1/2 transform -translate-x-1/2 ${theme === 'dark' ? 'bg-gradient-to-r from-cyan-400 to-emerald-400 text-slate-900' : 'bg-gradient-to-r from-blue-600 to-emerald-600 text-white'} px-4 py-2 rounded-full text-sm font-bold`}>
                    가장 인기
                  </div>
                )}

                <div className="p-8">
                  {/* Plan Header */}
                  <div className="text-center mb-8">
                    <h3 className={`text-2xl font-bold ${textPrimary} mb-2`}>{plan.name}</h3>
                    <p className={`${textSecondary} text-sm mb-6`}>{plan.description}</p>
                    
                    <div className="mb-6">
                      <div>
                        <div className={`text-4xl font-bold ${textPrimary}`}>
                          ₩{formatPrice(plan.price[billingCycle as keyof typeof plan.price])}
                          <span className={`text-lg ${textSecondary} font-normal`}>
                            /{billingCycle === 'monthly' ? '월' : '년'}
                          </span>
                        </div>
                        {billingCycle === 'yearly' && plan.price.monthly > 0 && (
                          <div className={`text-sm ${accentColor} mt-2`}>
                            월 ₩{formatPrice(plan.price.yearly / 12)} ({getYearlyDiscount(plan.price.monthly, plan.price.yearly)}% 할인)
                          </div>
                        )}
                      </div>
                    </div>

                    <button
                      className={`w-full py-3 px-6 rounded-full font-bold transition-all duration-300 ${
                        plan.buttonStyle === 'primary' 
                          ? `${theme === 'dark' ? 'bg-gradient-to-r from-cyan-400 to-emerald-400 text-slate-900 hover:shadow-cyan-400/30' : 'bg-gradient-to-r from-blue-600 to-emerald-600 text-white hover:shadow-blue-600/30'} hover:transform hover:-translate-y-1 hover:shadow-lg`
                          : plan.buttonStyle === 'premium'
                          ? `${theme === 'dark' ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:shadow-purple-500/30' : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-purple-600/30'} hover:transform hover:-translate-y-1 hover:shadow-lg`
                          : `border-2 ${theme === 'dark' ? 'border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-slate-900' : 'border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white'}`
                      }`}
                    >
                      {plan.buttonText}
                    </button>
                  </div>

                  {/* Features */}
                  <div className="space-y-4">
                    <h4 className={`font-semibold ${textPrimary} mb-3`}>포함된 기능:</h4>
                    <ul className="space-y-3">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-start">
                          <span className={`${accentColor} mr-3 leading-none`}>✓</span>
                          <span className={`${textSecondary} text-sm`}>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="pt-4">
                      {plan.id === 'basic' && <p><span className={`${theme === 'dark' ? 'text-cyan-400' : 'text-blue-600'}`}>제한 : </span> 백테스트 불가, 고급 지표 사용 제한</p>}
                      {plan.id === 'pro' && <p><span className={`${theme === 'dark' ? 'text-cyan-400' : 'text-blue-600'}`}>보너스 : </span>전략 마켓 플레이스에서 전략 할인 혜택</p>}
                  </div>

                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Information */}
      <section className={`py-20 ${theme === 'dark' ? 'bg-slate-800/30' : 'bg-slate-100/50'}`}>
        <div className="max-w-6xl mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Payment Methods */}
            <div className={`${theme === 'dark' ? 'bg-slate-800/60' : 'bg-white/90'} backdrop-blur-lg rounded-2xl p-8 border ${theme === 'dark' ? 'border-cyan-400/20' : 'border-blue-600/20'}`}>
              <h3 className={`text-xl font-bold ${textPrimary} mb-6 flex items-center`}>
                <span className="mr-3">💳</span>
                결제 방식
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between py-2">
                  <span className={`${textSecondary}`}>신용카드</span>
                  <span className={`${accentColor}`}>✓</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className={`${textSecondary}`}>카카오페이</span>
                  <span className={`${accentColor}`}>✓</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className={`${textSecondary}`}>계좌이체</span>
                  <span className={`${accentColor}`}>✓</span>
                </div>
              </div>
            </div>

            {/* Refund Policy */}
            <div className={`${theme === 'dark' ? 'bg-slate-800/60' : 'bg-white/90'} backdrop-blur-lg rounded-2xl p-8 border ${theme === 'dark' ? 'border-cyan-400/20' : 'border-blue-600/20'}`}>
              <h3 className={`text-xl font-bold ${textPrimary} mb-6 flex items-center`}>
                <span className="mr-3">🔄</span>
                환불 정책
              </h3>
              <div className="space-y-4">
                <div className={`${textSecondary} text-sm`}>
                  <p className="mb-3">• 7일 무료 체험 기간 중 언제든 구독취소 가능</p>
                  <p className="mb-3">• 멤버십 결제 후 7일 이내이고, 트레이딩 이력이 전혀 없는 경우에만 전액 환불이 가능합니다.</p>
                  <p className="mb-3">• 결제 후 7일이 지났거나, 트레이딩 이력이 있다면 환불이 불가능합니다. </p>
                  <p>• 악용 방지를 위한 검토 과정 있음</p>
                </div>
              </div>
            </div>

            {/* Tax Information */}
            <div className={`${theme === 'dark' ? 'bg-slate-800/60' : 'bg-white/90'} backdrop-blur-lg rounded-2xl p-8 border ${theme === 'dark' ? 'border-cyan-400/20' : 'border-blue-600/20'}`}>
              <h3 className={`text-xl font-bold ${textPrimary} mb-6 flex items-center`}>
                <span className="mr-3">📋</span>
                자동 결제 취소
              </h3>
              <div className="space-y-4">
                <div className={`${textSecondary} text-sm`}>
                  <p className="mb-3">• 멤버십은 자동 결제되므로, 해지하지 않으면 매달 요금이 청구됩니다. </p>
                  <p className="mb-3">• 자동 결제 취소 후에도 남은 결제 주기 동안은 멤버십을 유지할 수 있습니다.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 text-center relative overflow-hidden">
        <div className={`absolute inset-0 ${theme === 'dark' ? 'bg-gradient-radial from-emerald-400/10' : 'bg-gradient-radial from-emerald-600/10'} to-transparent`}></div>
        
        <div className="max-w-4xl mx-auto px-4 lg:px-8 relative z-10">
          <h2 className={`text-3xl lg:text-5xl font-bold mb-6 ${textPrimary}`}>
            지금 바로 시작하세요!
          </h2>
          <p className={`text-xl ${textSecondary} mb-8`}>
            7일 무료 체험으로 Trading Gear의 모든 기능을 경험해보세요.<br />
            신용카드 등록 없이 바로 시작 가능합니다.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8">
            <button className={`${theme === 'dark' ? 'bg-gradient-to-r from-cyan-400 to-emerald-400 text-slate-900 hover:shadow-cyan-400/40' : 'bg-gradient-to-r from-blue-600 to-emerald-600 text-white hover:shadow-blue-600/40'} px-8 py-4 rounded-full font-bold text-lg hover:transform hover:-translate-y-1 hover:shadow-xl transition-all duration-300`}>
              무료 체험 시작하기
            </button>
            <button className={`border-2 ${theme === 'dark' ? 'border-cyan-400 text-cyan-400 hover:bg-cyan-400' : 'border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white'} hover:text-slate-900 px-8 py-4 rounded-full font-bold text-lg transition-all duration-300`}>
              영업팀과 상담하기
            </button>
          </div>

          {/* <div className={`text-sm ${textSecondary} space-y-2`}>
            <p>✓ 신용카드 등록 불필요</p>
            <p>✓ 30일 환불 보장</p>
            <p>✓ 언제든 취소 가능</p>
          </div> */}
        </div>
      </section>

      {/* Footer */}
      <Footer onLinkClick={(linkName) => linkName} />
    </div>
  );
};