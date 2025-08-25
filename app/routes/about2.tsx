import type { MetaFunction } from "@remix-run/node";
import { useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useThemeStore } from '../stores/themeStore';

export const meta: MetaFunction = () => {
  return [
    { title: "회사소개 - TRADING GEAR" },
    { name: "description", content: "Trading Gear 회사소개" },
  ];
};

export default function About() {
  const { theme, initializeTheme } = useThemeStore();

  useEffect(() => {
    initializeTheme();
  }, [initializeTheme]);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const themeClasses = theme === 'dark' 
    ? 'bg-gradient-to-br from-slate-900 to-slate-800 text-white'
    : 'bg-gradient-to-br from-white to-slate-50 text-slate-900';

  const textPrimary = theme === 'dark' ? 'text-white' : 'text-slate-900';
  const textSecondary = theme === 'dark' ? 'text-slate-300' : 'text-slate-600';
  const primaryColor = theme === 'dark' ? 'text-cyan-400' : 'text-blue-600';

  return (
    <div className={`min-h-screen transition-all duration-300 ${themeClasses}`}>
      
      {/* Header Component */}
      <Header scrollToSection={scrollToSection} />

      {/* About Hero Section */}
      <section className="min-h-screen flex items-center justify-center text-center relative overflow-hidden pt-20" id="home">
        <div className={`absolute inset-0 ${theme === 'dark' ? 'bg-gradient-radial from-cyan-400/10' : 'bg-gradient-radial from-blue-600/10'} to-transparent`}></div>
        
        <div className="max-w-4xl mx-auto px-4 lg:px-8">
          <h1 className={`text-4xl lg:text-6xl font-bold mb-6 ${theme === 'dark' ? 'bg-gradient-to-r from-white to-cyan-400' : 'bg-gradient-to-r from-slate-900 to-blue-600'} bg-clip-text text-transparent`}>
            Trading Gear 회사소개
          </h1>
          <p className={`text-xl lg:text-2xl ${textSecondary} mb-8 leading-relaxed`}>
            혁신적인 AI 트레이딩 솔루션으로 금융의 미래를 만들어갑니다.<br />
            2019년부터 시작된 우리의 여정을 소개합니다.
          </p>
        </div>
      </section>

      {/* Company Info Section */}
      <section className={`py-20 ${theme === 'dark' ? 'bg-gradient-to-b from-transparent to-slate-800/30' : 'bg-gradient-to-b from-transparent to-slate-100/50'}`}>
        <div className="max-w-6xl mx-auto px-4 lg:px-8">
          <h2 className={`text-3xl lg:text-5xl font-bold text-center mb-16 ${textPrimary}`}>
            우리의 이야기
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className={`text-2xl font-bold mb-6 ${primaryColor}`}>미션</h3>
              <p className={`${textSecondary} text-lg leading-relaxed mb-8`}>
                모든 투자자가 전문가 수준의 트레이딩 도구를 쉽게 사용할 수 있도록 하여, 
                금융 시장의 민주화를 실현하는 것입니다.
              </p>
              
              <h3 className={`text-2xl font-bold mb-6 ${primaryColor}`}>비전</h3>
              <p className={`${textSecondary} text-lg leading-relaxed`}>
                AI와 머신러닝 기술을 활용하여 투자의 패러다임을 바꾸고, 
                누구나 스마트한 투자 결정을 내릴 수 있는 세상을 만들어 나가겠습니다.
              </p>
            </div>
            
            <div className={`${theme === 'dark' ? 'bg-slate-800/60 border-cyan-400/20' : 'bg-white/90 border-blue-600/20'} border rounded-2xl p-8`}>
              <h3 className={`text-2xl font-bold mb-6 ${primaryColor}`}>핵심 가치</h3>
              <ul className={`${textSecondary} space-y-4`}>
                <li className="flex items-start">
                  <span className="text-2xl mr-3">🚀</span>
                  <div>
                    <strong className={textPrimary}>혁신</strong><br />
                    끊임없는 기술 혁신으로 최고의 서비스를 제공합니다.
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="text-2xl mr-3">🔒</span>
                  <div>
                    <strong className={textPrimary}>신뢰</strong><br />
                    투명하고 안전한 거래 환경을 조성합니다.
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="text-2xl mr-3">🤝</span>
                  <div>
                    <strong className={textPrimary}>고객 중심</strong><br />
                    고객의 성공이 우리의 성공입니다.
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Component */}
      <Footer onLinkClick={(linkName) => console.log(`About 페이지 Footer 링크 클릭: ${linkName}`)} />
    </div>
  );
}