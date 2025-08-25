import { useState, useEffect } from 'react';

const SLASummaryPage = () => {
  const [theme, setTheme] = useState('dark');
  const [isClient, setIsClient] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeMetric, setActiveMetric] = useState('uptime');

  useEffect(() => {
    setIsClient(true);
    const savedTheme = 'dark';
    setTheme(savedTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
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

  const slaMetrics = [
    {
      id: 'uptime',
      title: '서비스 가용성',
      value: '99.9%',
      target: '연간 8.76시간 이하 다운타임',
      icon: '🔄',
      description: '연중무휴 24시간 서비스 제공을 보장합니다.',
      details: [
        '월간 가용성: 99.9% 이상',
        '계획된 점검: 월 1회, 새벽 2-4시',
        '긴급 점검: 사전 통지 후 진행',
        '모니터링: 실시간 서비스 상태 확인'
      ]
    },
    {
      id: 'response',
      title: '응답 시간',
      value: '<100ms',
      target: 'API 응답 시간 평균',
      icon: '⚡',
      description: '빠른 거래 실행을 위한 최적화된 응답 시간을 제공합니다.',
      details: [
        'API 응답: 평균 100ms 이하',
        '거래 실행: 평균 200ms 이하',
        '데이터 조회: 평균 50ms 이하',
        '백테스팅: 대용량 데이터 30초 이내'
      ]
    },
    {
      id: 'support',
      title: '기술 지원',
      value: '24/7',
      target: '연중무휴 지원 체계',
      icon: '🎧',
      description: '언제든지 도움이 필요할 때 신속한 지원을 제공합니다.',
      details: [
        '채팅 지원: 연중무휴 24시간',
        '이메일 지원: 4시간 이내 응답',
        '전화 지원: 평일 9-18시',
        '긴급 지원: 즉시 대응 (Pro/Ultimate)'
      ]
    },
    {
      id: 'security',
      title: '보안 수준',
      value: '99.99%',
      target: '보안 사고 방지율',
      icon: '🛡️',
      description: '엔터프라이즈급 보안으로 자산과 데이터를 보호합니다.',
      details: [
        'SSL/TLS 암호화: 모든 통신',
        'API 키 암호화: AES-256',
        '침입 탐지: 실시간 모니터링',
        '보안 감사: 월간 취약점 점검'
      ]
    },
    {
      id: 'backup',
      title: '데이터 백업',
      value: '3중화',
      target: '데이터 손실 방지',
      icon: '💾',
      description: '중요한 데이터의 안전한 보관과 복구를 보장합니다.',
      details: [
        '실시간 백업: 자동 동기화',
        '지리적 분산: 3개 지역 저장',
        '복구 시간: 15분 이내',
        '보관 기간: 무제한 (유료 플랜)'
      ]
    },
    {
      id: 'performance',
      title: '성능 보장',
      value: '99.5%',
      target: '거래 성공률',
      icon: '📊',
      description: '안정적인 거래 실행과 높은 성능을 보장합니다.',
      details: [
        '거래 성공률: 99.5% 이상',
        '슬리피지: 0.1% 이하',
        '동시 접속: 무제한',
        '처리량: 초당 10,000건'
      ]
    }
  ];

  const compensationTiers = [
    { range: '99.0% - 99.8%', credit: '10%', description: '월 이용료의 10% 크레딧' },
    { range: '98.0% - 98.9%', credit: '25%', description: '월 이용료의 25% 크레딧' },
    { range: '95.0% - 97.9%', credit: '50%', description: '월 이용료의 50% 크레딧' },
    { range: '< 95.0%', credit: '100%', description: '월 이용료의 100% 크레딧' }
  ];

  const supportChannels = [
    {
      channel: '실시간 채팅',
      availability: '24/7',
      response: '즉시',
      plans: ['모든 플랜'],
      icon: '💬'
    },
    {
      channel: '이메일 지원',
      availability: '24/7',
      response: '4시간',
      plans: ['모든 플랜'],
      icon: '📧'
    },
    {
      channel: '전화 지원',
      availability: '평일 9-18시',
      response: '즉시',
      plans: ['Pro', 'Ultimate'],
      icon: '📞'
    },
    {
      channel: '전담 매니저',
      availability: '평일 9-18시',
      response: '1시간',
      plans: ['Ultimate'],
      icon: '👨‍💼'
    }
  ];

  return (
    <div className={`min-h-screen transition-all duration-300 ${themeClasses}`}>
      
      {/* Header - Same as pricing page */}
      <header className={`fixed top-0 w-full backdrop-blur-lg z-50 border-b transition-all duration-300 ${headerClasses}`}>
        <nav className="max-w-6xl mx-auto flex justify-between items-center px-4 lg:px-8 py-4">
          
          {/* Logo */}
          <div className={`flex items-center text-2xl font-bold cursor-pointer transition-colors duration-300 ${primaryColor}`}>
            <span className="text-3xl mr-2">⚙️</span>
            Trading Gear
          </div>

          {/* Desktop Navigation */}
          <ul className="hidden lg:flex items-center space-x-8">
            <li><a className={`${textPrimary} hover:text-cyan-400 font-medium cursor-pointer transition-colors duration-300`}>홈</a></li>
            <li><a className={`${textPrimary} hover:text-cyan-400 font-medium cursor-pointer transition-colors duration-300`}>기능</a></li>
            <li><a className={`${textPrimary} hover:text-cyan-400 font-medium cursor-pointer transition-colors duration-300`}>요금제</a></li>
            <li><a className={`${textPrimary} hover:text-cyan-400 font-medium cursor-pointer transition-colors duration-300`}>문의</a></li>
            
            {/* Theme Toggle */}
            <li>
              <button 
                className={`w-10 h-10 rounded-full border-2 ${theme === 'dark' ? 'border-cyan-400/20 hover:border-cyan-400 hover:text-cyan-400' : 'border-blue-600/20 hover:border-blue-600 hover:text-blue-600'} ${textPrimary} transition-all duration-300 hover:rotate-180 flex items-center justify-center`}
                onClick={toggleTheme}
              >
                {theme === 'dark' ? '🌙' : '☀️'}
              </button>
            </li>
          </ul>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center">
            <button 
              className="w-10 h-10 flex flex-col justify-center items-center space-y-1 focus:outline-none"
              onClick={toggleMobileMenu}
            >
              <span className={`w-6 h-0.5 ${theme === 'dark' ? 'bg-white' : 'bg-slate-700'} transition-all duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></span>
              <span className={`w-6 h-0.5 ${theme === 'dark' ? 'bg-white' : 'bg-slate-700'} transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0' : ''}`}></span>
              <span className={`w-6 h-0.5 ${theme === 'dark' ? 'bg-white' : 'bg-slate-700'} transition-all duration-300 ${isMobileMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></span>
            </button>
          </div>

          {/* CTA Button */}
          <button className={`hidden lg:block ${theme === 'dark' ? 'bg-gradient-to-r from-cyan-400 to-emerald-400 text-slate-900 hover:shadow-cyan-400/30' : 'bg-gradient-to-r from-blue-600 to-emerald-600 text-white hover:shadow-blue-600/30'} px-6 py-3 rounded-full font-bold hover:transform hover:-translate-y-1 hover:shadow-lg transition-all duration-300`}>
            무료 체험 시작
          </button>
        </nav>

        {/* Mobile Menu */}
        <div className={`lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-all duration-300 ${isMobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`} onClick={toggleMobileMenu}></div>

        <div className={`lg:hidden fixed top-0 right-0 h-full w-80 max-w-[80vw] ${theme === 'dark' ? 'bg-slate-900/98' : 'bg-white/98'} backdrop-blur-lg border-l ${theme === 'dark' ? 'border-cyan-400/20' : 'border-blue-600/20'} z-50 transform transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          
          <div className="flex items-center justify-between p-6 border-b border-gray-200/20">
            <div className={`flex items-center text-xl font-bold ${primaryColor}`}>
              <span className="text-2xl mr-2">⚙️</span>
              Trading Gear
            </div>
            <button className="w-8 h-8 flex items-center justify-center focus:outline-none" onClick={toggleMobileMenu}>
              <span className={`w-6 h-0.5 ${theme === 'dark' ? 'bg-white' : 'bg-slate-700'} transition-all duration-300 rotate-45 absolute`}></span>
              <span className={`w-6 h-0.5 ${theme === 'dark' ? 'bg-white' : 'bg-slate-700'} transition-all duration-300 -rotate-45 absolute`}></span>
            </button>
          </div>

          <div className="flex flex-col h-full">
            <ul className="px-6 py-8 space-y-6 flex-1">
              <li><a className={`block ${textPrimary} hover:text-cyan-400 font-medium cursor-pointer transition-colors duration-300 py-3 text-lg border-b border-gray-200/10`}>홈</a></li>
              <li><a className={`block ${textPrimary} hover:text-cyan-400 font-medium cursor-pointer transition-colors duration-300 py-3 text-lg border-b border-gray-200/10`}>기능</a></li>
              <li><a className={`block ${textPrimary} hover:text-cyan-400 font-medium cursor-pointer transition-colors duration-300 py-3 text-lg border-b border-gray-200/10`}>요금제</a></li>
              <li><a className={`block ${textPrimary} hover:text-cyan-400 font-medium cursor-pointer transition-colors duration-300 py-3 text-lg border-b border-gray-200/10`}>문의</a></li>
            </ul>

            <div className="px-6 pb-8 space-y-4">
              <div className="flex items-center justify-between py-4 border-t border-gray-200/20">
                <span className={`${textPrimary} font-medium`}>테마 설정</span>
                <button className={`w-12 h-12 rounded-full border-2 ${theme === 'dark' ? 'border-cyan-400/20 hover:border-cyan-400 hover:text-cyan-400' : 'border-blue-600/20 hover:border-blue-600 hover:text-blue-600'} ${textPrimary} transition-all duration-300 hover:rotate-180 flex items-center justify-center text-xl`} onClick={toggleTheme}>
                  {theme === 'dark' ? '🌙' : '☀️'}
                </button>
              </div>
              
              <button className={`w-full ${theme === 'dark' ? 'bg-gradient-to-r from-cyan-400 to-emerald-400 text-slate-900 hover:shadow-cyan-400/30' : 'bg-gradient-to-r from-blue-600 to-emerald-600 text-white hover:shadow-blue-600/30'} px-6 py-4 rounded-full font-bold text-lg hover:transform hover:-translate-y-1 hover:shadow-lg transition-all duration-300`}>
                무료 체험 시작
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-16 text-center relative overflow-hidden">
        <div className={`absolute inset-0 ${theme === 'dark' ? 'bg-gradient-radial from-emerald-400/10' : 'bg-gradient-radial from-emerald-600/10'} to-transparent`}></div>
        
        <div className="max-w-4xl mx-auto px-4 lg:px-8 relative z-10">
          <div className="flex justify-center mb-6">
            <div className={`w-20 h-20 ${theme === 'dark' ? 'bg-emerald-400/20' : 'bg-emerald-600/20'} rounded-full flex items-center justify-center text-4xl`}>
              📊
            </div>
          </div>
          <h1 className={`text-4xl lg:text-5xl font-bold mb-6 ${theme === 'dark' ? 'bg-gradient-to-r from-white to-emerald-400' : 'bg-gradient-to-r from-slate-900 to-emerald-600'} bg-clip-text text-transparent`}>
            서비스 수준 계약서 요약
          </h1>
          <p className={`text-lg lg:text-xl ${textSecondary} mb-8 leading-relaxed`}>
            Trading Gear는 명확한 서비스 품질 기준과<br />
            보상 정책을 통해 신뢰할 수 있는 서비스를 제공합니다.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <div className={`inline-flex items-center px-4 py-2 ${theme === 'dark' ? 'bg-emerald-400/20' : 'bg-emerald-600/20'} backdrop-blur-lg rounded-full border ${theme === 'dark' ? 'border-emerald-400/30' : 'border-emerald-600/30'}`}>
              <span className={`text-sm ${accentColor} font-medium`}>99.9% 서비스 가용성 보장</span>
            </div>
            <div className={`inline-flex items-center px-4 py-2 ${theme === 'dark' ? 'bg-slate-800/60' : 'bg-white/80'} backdrop-blur-lg rounded-full border ${theme === 'dark' ? 'border-emerald-400/20' : 'border-emerald-600/20'}`}>
              <span className={`text-sm ${textSecondary}`}>효력 발생일: 2025년 7월 3일</span>
            </div>
          </div>
        </div>
      </section>

      {/* SLA Metrics */}
      <section className="pb-16">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="text-center mb-12">
            <h2 className={`text-3xl font-bold ${textPrimary} mb-4`}>서비스 품질 지표</h2>
            <p className={`${textSecondary} text-lg`}>Trading Gear가 약속하는 서비스 수준을 확인하세요</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {slaMetrics.map((metric) => (
              <div
                key={metric.id}
                className={`${theme === 'dark' ? 'bg-slate-800/60' : 'bg-white/90'} backdrop-blur-lg rounded-2xl p-6 border transition-all duration-300 hover:transform hover:-translate-y-2 cursor-pointer ${
                  activeMetric === metric.id 
                    ? `${theme === 'dark' ? 'border-emerald-400 shadow-emerald-400/20' : 'border-emerald-600 shadow-emerald-600/20'} shadow-xl` 
                    : `${theme === 'dark' ? 'border-emerald-400/20 hover:border-emerald-400/40' : 'border-emerald-600/20 hover:border-emerald-600/40'} hover:shadow-lg`
                }`}
                onClick={() => setActiveMetric(metric.id)}
              >
                <div className="text-center mb-4">
                  <div className={`w-16 h-16 ${theme === 'dark' ? 'bg-emerald-400/20' : 'bg-emerald-600/20'} rounded-full flex items-center justify-center text-2xl mx-auto mb-4`}>
                    {metric.icon}
                  </div>
                  <h3 className={`text-lg font-bold ${textPrimary} mb-2`}>{metric.title}</h3>
                  <div className={`text-3xl font-bold ${accentColor} mb-1`}>{metric.value}</div>
                  <p className={`text-sm ${textSecondary} mb-4`}>{metric.target}</p>
                  <p className={`text-sm ${textSecondary} leading-relaxed`}>{metric.description}</p>
                </div>

                {activeMetric === metric.id && (
                  <div className={`mt-6 pt-6 border-t ${theme === 'dark' ? 'border-emerald-400/20' : 'border-emerald-600/20'}`}>
                    <h4 className={`font-semibold ${textPrimary} mb-3 text-sm`}>세부 사양</h4>
                    <ul className="space-y-2">
                      {metric.details.map((detail, idx) => (
                        <li key={idx} className={`flex items-start ${textSecondary} text-xs`}>
                          <span className={`${accentColor} mr-2 mt-0.5`}>•</span>
                          <span>{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SLA Compensation */}
      <section className={`py-16 ${theme === 'dark' ? 'bg-slate-800/30' : 'bg-slate-100/50'}`}>
        <div className="max-w-6xl mx-auto px-4 lg:px-8">
          <div className="text-center mb-12">
            <h2 className={`text-3xl font-bold ${textPrimary} mb-4`}>서비스 보상 정책</h2>
            <p className={`${textSecondary} text-lg`}>서비스 가용성이 약속된 수준에 미달할 경우 제공되는 보상</p>
          </div>

          <div className={`${theme === 'dark' ? 'bg-slate-800/60' : 'bg-white/90'} backdrop-blur-lg rounded-2xl border ${theme === 'dark' ? 'border-emerald-400/20' : 'border-emerald-600/20'} overflow-hidden`}>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className={`${theme === 'dark' ? 'bg-emerald-400/10' : 'bg-emerald-600/10'}`}>
                  <tr>
                    <th className={`px-6 py-4 text-left text-sm font-bold ${textPrimary}`}>가용성 범위</th>
                    <th className={`px-6 py-4 text-left text-sm font-bold ${textPrimary}`}>서비스 크레딧</th>
                    <th className={`px-6 py-4 text-left text-sm font-bold ${textPrimary}`}>보상 내용</th>
                  </tr>
                </thead>
                <tbody>
                  {compensationTiers.map((tier, index) => (
                    <tr key={index} className={`border-t ${theme === 'dark' ? 'border-slate-700/50' : 'border-slate-200/50'}`}>
                      <td className={`px-6 py-4 font-medium ${textPrimary}`}>{tier.range}</td>
                      <td className={`px-6 py-4 text-lg font-bold ${accentColor}`}>{tier.credit}</td>
                      <td className={`px-6 py-4 ${textSecondary} text-sm`}>{tier.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className={`p-6 ${theme === 'dark' ? 'bg-emerald-400/5' : 'bg-emerald-600/5'} border-t ${theme === 'dark' ? 'border-emerald-400/20' : 'border-emerald-600/20'}`}>
              <h4 className={`font-semibold ${textPrimary} mb-2 flex items-center`}>
                <span className="mr-2">💡</span>
                보상 신청 방법
              </h4>
              <p className={`${textSecondary} text-sm leading-relaxed`}>
                서비스 크레딧 신청은 해당 월의 다음 달 말일까지 고객센터를 통해 신청하실 수 있습니다. 
                자동으로 지급되지 않으므로 반드시 신청해주시기 바랍니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Support Channels */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 lg:px-8">
          <div className="text-center mb-12">
            <h2 className={`text-3xl font-bold ${textPrimary} mb-4`}>고객 지원 체계</h2>
            <p className={`${textSecondary} text-lg`}>다양한 채널을 통해 신속하고 정확한 지원을 제공합니다</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {supportChannels.map((support, index) => (
              <div
                key={index}
                className={`${theme === 'dark' ? 'bg-slate-800/60' : 'bg-white/90'} backdrop-blur-lg rounded-2xl p-6 border ${theme === 'dark' ? 'border-emerald-400/20' : 'border-emerald-600/20'} transition-all duration-300 hover:transform hover:-translate-y-1 hover:shadow-lg`}
              >
                <div className="flex items-start">
                  <div className={`w-12 h-12 ${theme === 'dark' ? 'bg-emerald-400/20' : 'bg-emerald-600/20'} rounded-lg flex items-center justify-center text-xl mr-4 flex-shrink-0`}>
                    {support.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className={`text-lg font-bold ${textPrimary} mb-2`}>{support.channel}</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className={`text-sm ${textSecondary}`}>운영시간</span>
                        <span className={`text-sm font-medium ${accentColor}`}>{support.availability}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className={`text-sm ${textSecondary}`}>응답시간</span>
                        <span className={`text-sm font-medium ${accentColor}`}>{support.response}</span>
                      </div>
                      <div className="flex justify-between items-end">
                        <span className={`text-sm ${textSecondary}`}>이용 가능 플랜</span>
                        <div className="flex gap-1">
                          {support.plans.map((plan) => (
                            <span key={plan} className={`px-2 py-1 text-xs ${theme === 'dark' ? 'bg-emerald-400/20 text-emerald-400' : 'bg-emerald-600/20 text-emerald-600'} rounded`}>
                              {plan}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Important Notes */}
      <section className={`py-16 ${theme === 'dark' ? 'bg-slate-800/30' : 'bg-slate-100/50'}`}>
        <div className="max-w-6xl mx-auto px-4 lg:px-8">
          <div className={`${theme === 'dark' ? 'bg-gradient-to-r from-orange-900/40 to-red-900/40' : 'bg-gradient-to-r from-orange-100/60 to-red-100/60'} backdrop-blur-lg rounded-2xl p-8 border ${theme === 'dark' ? 'border-orange-400/20' : 'border-orange-600/20'}`}>
            <div className="text-center mb-8">
              <div className={`w-16 h-16 ${theme === 'dark' ? 'bg-orange-400/20' : 'bg-orange-600/20'} rounded-full flex items-center justify-center text-2xl mx-auto mb-4`}>
                ⚠️
              </div>
              <h3 className={`text-xl font-bold ${textPrimary} mb-4`}>중요 사항</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className={`p-4 ${theme === 'dark' ? 'bg-slate-800/40' : 'bg-white/60'} rounded-lg`}>
                <h4 className={`font-semibold ${textPrimary} mb-2 flex items-center`}>
                  <span className="mr-2">🔍</span>
                  SLA 적용 범위
                </h4>
                <ul className={`${textSecondary} text-sm space-y-1`}>
                  <li>• 유료 플랜 이용자에게만 적용</li>
                  <li>• 계획된 점검 시간 제외</li>
                  <li>• 제3자 서비스 장애 제외</li>
                  <li>• 불가항력적 사유 제외</li>
                </ul>
              </div>

              <div className={`p-4 ${theme === 'dark' ? 'bg-slate-800/40' : 'bg-white/60'} rounded-lg`}>
                <h4 className={`font-semibold ${textPrimary} mb-2 flex items-center`}>
                  <span className="mr-2">📋</span>
                  측정 기준
                </h4>
                <ul className={`${textSecondary} text-sm space-y-1`}>
                  <li>• 가용성: 월간 기준 계산</li>
                  <li>• 응답시간: 95% 분위수 기준</li>
                  <li>• 모니터링: 5분 간격 체크</li>
                  <li>• 보고서: 월간 SLA 리포트 제공</li>
                </ul>
              </div>
            </div>

            <div className={`mt-6 p-4 border-t ${theme === 'dark' ? 'border-orange-400/20' : 'border-orange-600/20'} text-center`}>
              <p className={`${textSecondary} text-sm`}>
                본 SLA는 Trading Gear 이용약관의 일부이며, 서비스 품질 개선을 위해 지속적으로 업데이트될 수 있습니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={`${theme === 'dark' ? 'bg-slate-900/90 border-cyan-400/20' : 'bg-white/90 border-blue-600/20'} border-t py-12`}>
        <div className="max-w-6xl mx-auto px-4 lg:px-8 text-center">
          <div className="flex flex-wrap justify-center gap-8 mb-8">
            {['회사소개', '이용약관', '개인정보처리방침', '고객지원', '블로그', '채용정보'].map((link) => (
              <a key={link} className={`${textSecondary} hover:text-cyan-400 transition-colors duration-300 cursor-pointer`}>
                {link}
              </a>
            ))}
          </div>
          <div className={`pt-8 border-t ${theme === 'dark' ? 'border-cyan-400/10' : 'border-blue-600/10'} ${textSecondary} text-sm space-y-2`}>
            <p>&copy; 2025 Trading Gear. All rights reserved.</p>
            <p>투자에는 원금 손실의 위험이 있습니다. 신중한 투자 결정을 내리시기 바랍니다.</p>
            <p>본 서비스는 투자 도구를 제공하며, 투자 수익을 보장하지 않습니다.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default SLASummaryPage;