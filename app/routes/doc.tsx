import { useState, useEffect } from 'react';
import { useThemeStore } from '../stores/themeStore';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import type { MetaFunction } from "@remix-run/node";
export const meta: MetaFunction = () => {
  return [
    { title: "문서 - TRADING GEAR" },
    { name: "doc", content: "AI 트레이딩의 새로운 시대" },
  ];
};

export default function DocsPage() {
  const { theme, initializeTheme } = useThemeStore();
  const [activeSidebarItem, setActiveSidebarItem] = useState('getting-started');
  const [isCodeCopied, setIsCodeCopied] = useState('');

  useEffect(() => {
    initializeTheme();
  }, [initializeTheme]);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setIsCodeCopied(id);
    setTimeout(() => setIsCodeCopied(''), 2000);
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

  const sidebarItems = [
    { id: 'getting-started', title: '빠른 시작', icon: '🚀' },
    { id: 'authentication', title: '인증', icon: '🔐' },
    { id: 'rest-api', title: 'REST API', icon: '📡' },
    { id: 'websocket', title: 'WebSocket', icon: '⚡' },
    { id: 'sdk-libraries', title: 'SDK & 라이브러리', icon: '📚' },
    { id: 'tutorials', title: '튜토리얼', icon: '📖' },
    { id: 'examples', title: '코드 예제', icon: '💻' },
    { id: 'faq', title: 'FAQ', icon: '❓' },
    { id: 'support', title: '지원', icon: '🆘' }
  ];

  const CodeBlock = ({ children, language = 'javascript', id, title }) => (
    <div className={`${theme === 'dark' ? 'bg-slate-800' : 'bg-slate-100'} rounded-lg border ${theme === 'dark' ? 'border-slate-700' : 'border-slate-300'} overflow-hidden my-4`}>
      {title && (
        <div className={`px-4 py-2 ${theme === 'dark' ? 'bg-slate-700 text-slate-300' : 'bg-slate-200 text-slate-700'} text-sm font-medium border-b ${theme === 'dark' ? 'border-slate-600' : 'border-slate-300'} flex justify-between items-center`}>
          <span>{title}</span>
          <button
            onClick={() => copyToClipboard(children, id)}
            className={`px-2 py-1 text-xs rounded ${theme === 'dark' ? 'bg-slate-600 hover:bg-slate-500 text-white' : 'bg-slate-300 hover:bg-slate-400 text-slate-800'} transition-colors duration-200`}
          >
            {isCodeCopied === id ? '복사됨!' : '복사'}
          </button>
        </div>
      )}
      <pre className="p-4 overflow-x-auto">
        <code className={`text-sm ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
          {children}
        </code>
      </pre>
    </div>
  );

  const renderContent = () => {
    switch (activeSidebarItem) {
      case 'getting-started':
        return (
          <div className="space-y-8">
            <div>
              <h1 className={`text-4xl font-bold ${textPrimary} mb-4`}>빠른 시작 가이드</h1>
              <p className={`text-lg ${textSecondary} mb-8`}>
                Trading Gear API를 사용하여 첫 번째 트레이딩 봇을 만들어보세요. 
                몇 분 안에 실제 거래를 시작할 수 있습니다.
              </p>
            </div>

            <div className={`${theme === 'dark' ? 'bg-slate-800/60' : 'bg-white/90'} backdrop-blur-lg rounded-xl p-6 border ${theme === 'dark' ? 'border-cyan-400/20' : 'border-blue-600/20'}`}>
              <h2 className={`text-2xl font-semibold ${textPrimary} mb-4 flex items-center`}>
                <span className="mr-3">⚡</span>
                5분 만에 시작하기
              </h2>
              <div className="space-y-4">
                <div className="flex items-start">
                  <span className={`${accentColor} mr-3 mt-1`}>1.</span>
                  <div>
                    <h3 className={`font-semibold ${textPrimary}`}>API 키 발급</h3>
                    <p className={`${textSecondary} text-sm`}>대시보드에서 API 키를 생성하고 권한을 설정합니다.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <span className={`${accentColor} mr-3 mt-1`}>2.</span>
                  <div>
                    <h3 className={`font-semibold ${textPrimary}`}>SDK 설치</h3>
                    <p className={`${textSecondary} text-sm`}>선호하는 언어의 SDK를 설치합니다.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <span className={`${accentColor} mr-3 mt-1`}>3.</span>
                  <div>
                    <h3 className={`font-semibold ${textPrimary}`}>첫 번째 봇 생성</h3>
                    <p className={`${textSecondary} text-sm`}>간단한 예제 코드로 트레이딩 봇을 만들어보세요.</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h2 className={`text-2xl font-semibold ${textPrimary} mb-4`}>SDK 설치</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className={`text-lg font-medium ${textPrimary} mb-2`}>Node.js</h3>
                  <CodeBlock id="install-nodejs" title="npm install">
{`npm install trading-gear-sdk

# 또는 yarn 사용
yarn add trading-gear-sdk`}
                  </CodeBlock>
                </div>
                <div>
                  <h3 className={`text-lg font-medium ${textPrimary} mb-2`}>Python</h3>
                  <CodeBlock id="install-python" title="pip install">
{`pip install trading-gear-sdk

# 또는 conda 사용
conda install trading-gear-sdk`}
                  </CodeBlock>
                </div>
              </div>
            </div>

            <div>
              <h2 className={`text-2xl font-semibold ${textPrimary} mb-4`}>첫 번째 봇 만들기</h2>
              <CodeBlock id="first-bot" title="app.js" language="javascript">
{`// Trading Gear SDK 사용 예제
const TradingGear = require('trading-gear-sdk');

// API 클라이언트 초기화
const client = new TradingGear({
  apiKey: 'your-api-key',
  apiSecret: 'your-api-secret',
  sandbox: true // 테스트용
});

// 간단한 그리드 트레이딩 봇 생성
async function createGridBot() {
  try {
    const bot = await client.bots.create({
      type: 'grid',
      symbol: 'BTC/USDT',
      exchange: 'binance',
      config: {
        gridSpacing: 0.5, // 0.5% 간격
        gridSize: 10,     // 10개 그리드
        baseAmount: 100   // 100 USDT
      }
    });
    
    console.log('봇이 생성되었습니다:', bot.id);
    
    // 봇 시작
    await client.bots.start(bot.id);
    console.log('봇이 시작되었습니다!');
    
    return bot;
  } catch (error) {
    console.error('오류 발생:', error.message);
  }
}

// 봇 생성 실행
createGridBot();`}
              </CodeBlock>
            </div>
          </div>
        );

      case 'rest-api':
        return (
          <div className="space-y-8">
            <div>
              <h1 className={`text-4xl font-bold ${textPrimary} mb-4`}>REST API 명세</h1>
              <p className={`text-lg ${textSecondary} mb-8`}>
                Trading Gear의 모든 기능에 접근할 수 있는 RESTful API입니다. 
                실시간 데이터, 거래 실행, 봇 관리 등 모든 기능을 제공합니다.
              </p>
            </div>

            <div className={`${theme === 'dark' ? 'bg-slate-800/60' : 'bg-white/90'} backdrop-blur-lg rounded-xl p-6 border ${theme === 'dark' ? 'border-cyan-400/20' : 'border-blue-600/20'}`}>
              <h2 className={`text-2xl font-semibold ${textPrimary} mb-4`}>기본 정보</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className={`font-semibold ${textPrimary} mb-2`}>Base URL</h3>
                  <code className={`${theme === 'dark' ? 'bg-slate-700 text-cyan-300' : 'bg-slate-200 text-blue-700'} px-2 py-1 rounded text-sm`}>
                    https://api.trading-gear.com/v1
                  </code>
                </div>
                <div>
                  <h3 className={`font-semibold ${textPrimary} mb-2`}>Rate Limit</h3>
                  <code className={`${theme === 'dark' ? 'bg-slate-700 text-cyan-300' : 'bg-slate-200 text-blue-700'} px-2 py-1 rounded text-sm`}>
                    1000 requests/minute
                  </code>
                </div>
              </div>
            </div>

            <div>
              <h2 className={`text-2xl font-semibold ${textPrimary} mb-4`}>인증</h2>
              <p className={`${textSecondary} mb-4`}>모든 API 요청은 API 키와 서명이 필요합니다.</p>
              <CodeBlock id="auth-headers" title="Request Headers">
              </CodeBlock>
            </div>

            <div>
              <h2 className={`text-2xl font-semibold ${textPrimary} mb-4`}>주요 엔드포인트</h2>
              
              <div className="space-y-6">
                <div className={`${theme === 'dark' ? 'bg-slate-800/40' : 'bg-white/60'} rounded-lg p-4 border ${theme === 'dark' ? 'border-slate-700' : 'border-slate-300'}`}>
                  <h3 className={`text-lg font-medium ${textPrimary} mb-2 flex items-center`}>
                    <span className={`px-2 py-1 text-xs rounded mr-3 ${theme === 'dark' ? 'bg-green-600' : 'bg-green-500'} text-white`}>GET</span>
                    봇 목록 조회
                  </h3>
                  <code className={`${textSecondary} text-sm`}>/bots</code>
                  <p className={`${textSecondary} text-sm mt-2`}>사용자의 모든 트레이딩 봇 목록을 반환합니다.</p>
                  
                  <CodeBlock id="get-bots" title="Example Response" language="json">
                  </CodeBlock>
                </div>

                <div className={`${theme === 'dark' ? 'bg-slate-800/40' : 'bg-white/60'} rounded-lg p-4 border ${theme === 'dark' ? 'border-slate-700' : 'border-slate-300'}`}>
                  <h3 className={`text-lg font-medium ${textPrimary} mb-2 flex items-center`}>
                    <span className={`px-2 py-1 text-xs rounded mr-3 ${theme === 'dark' ? 'bg-blue-600' : 'bg-blue-500'} text-white`}>POST</span>
                    봇 생성
                  </h3>
                  <code className={`${textSecondary} text-sm`}>/bots</code>
                  <p className={`${textSecondary} text-sm mt-2`}>새로운 트레이딩 봇을 생성합니다.</p>
                  
                  <CodeBlock id="create-bot" title="Example Request" language="json">
                  </CodeBlock>
                </div>

                <div className={`${theme === 'dark' ? 'bg-slate-800/40' : 'bg-white/60'} rounded-lg p-4 border ${theme === 'dark' ? 'border-slate-700' : 'border-slate-300'}`}>
                  <h3 className={`text-lg font-medium ${textPrimary} mb-2 flex items-center`}>
                    <span className={`px-2 py-1 text-xs rounded mr-3 ${theme === 'dark' ? 'bg-yellow-600' : 'bg-yellow-500'} text-white`}>PUT</span>
                    봇 시작/중지
                  </h3>
                  <code className={`${textSecondary} text-sm`}>/bots/:id/status</code>
                  <p className={`${textSecondary} text-sm mt-2`}>봇의 상태를 변경합니다.</p>
                  
                  <CodeBlock id="bot-status" title="Example Request" language="json">
                  </CodeBlock>
                </div>
              </div>
            </div>
          </div>
        );

      case 'sdk-libraries':
        return (
          <div className="space-y-8">
            <div>
              <h1 className={`text-4xl font-bold ${textPrimary} mb-4`}>SDK & 라이브러리</h1>
              <p className={`text-lg ${textSecondary} mb-8`}>
                다양한 프로그래밍 언어로 제공되는 Trading Gear SDK를 사용하여 
                빠르고 쉽게 트레이딩 애플리케이션을 개발하세요.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className={`${theme === 'dark' ? 'bg-slate-800/60' : 'bg-white/90'} backdrop-blur-lg rounded-xl p-6 border ${theme === 'dark' ? 'border-cyan-400/20' : 'border-blue-600/20'}`}>
                <h2 className={`text-2xl font-semibold ${textPrimary} mb-4 flex items-center`}>
                  <span className="mr-3">🟨</span>
                  JavaScript SDK
                </h2>
                <p className={`${textSecondary} mb-4`}>Node.js와 브라우저 환경을 모두 지원합니다.</p>
                
                <h3 className={`font-medium ${textPrimary} mb-2`}>설치</h3>
                <CodeBlock id="js-install" title="npm">
{`npm install trading-gear-sdk`}
                </CodeBlock>

                <h3 className={`font-medium ${textPrimary} mb-2 mt-4`}>기본 사용법</h3>
                <CodeBlock id="js-usage" title="index.js" language="javascript">
{`const TradingGear = require('trading-gear-sdk');

const client = new TradingGear({
  apiKey: process.env.TRADING_GEAR_API_KEY,
  apiSecret: process.env.TRADING_GEAR_API_SECRET
});

// 계정 정보 조회
async function getAccount() {
  try {
    const account = await client.account.getInfo();
    console.log('계정 정보:', account);
    return account;
  } catch (error) {
    console.error('오류:', error.message);
  }
}

// 그리드 봇 생성
async function createGridBot() {
  const bot = await client.bots.createGrid({
    symbol: 'BTC/USDT',
    exchange: 'binance',
    gridSpacing: 0.5,
    gridSize: 10,
    baseAmount: 100
  });
  
  console.log('봇 생성됨:', bot.id);
  return bot;
}`}
                </CodeBlock>
              </div>

              <div className={`${theme === 'dark' ? 'bg-slate-800/60' : 'bg-white/90'} backdrop-blur-lg rounded-xl p-6 border ${theme === 'dark' ? 'border-cyan-400/20' : 'border-blue-600/20'}`}>
                <h2 className={`text-2xl font-semibold ${textPrimary} mb-4 flex items-center`}>
                  <span className="mr-3">🐍</span>
                  Python SDK
                </h2>
                <p className={`${textSecondary} mb-4`}>데이터 분석과 백테스팅에 최적화되어 있습니다.</p>
                
                <h3 className={`font-medium ${textPrimary} mb-2`}>설치</h3>
                <CodeBlock id="py-install" title="pip">
{`pip install trading-gear-sdk`}
                </CodeBlock>

                <h3 className={`font-medium ${textPrimary} mb-2 mt-4`}>기본 사용법</h3>
                <CodeBlock id="py-usage" title="main.py" language="python">
{`from trading_gear import TradingGear
import os

# 클라이언트 초기화
client = TradingGear(
    api_key=os.getenv('TRADING_GEAR_API_KEY'),
    api_secret=os.getenv('TRADING_GEAR_API_SECRET')
)

# 계정 정보 조회
def get_account():
    try:
        account = client.account.get_info()
        print('계정 정보:', account)
        return account
    except Exception as error:
        print('오류:', str(error))

# DCA 봇 생성
def create_dca_bot():
    bot = client.bots.create_dca(
        symbol='ETH/USDT',
        exchange='binance',
        investment_amount=500,
        dca_interval='1h',
        take_profit=20
    )
    
    print('DCA 봇 생성됨:', bot.id)
    return bot`}
                </CodeBlock>
              </div>
            </div>
          </div>
        );

      case 'faq':
        return (
          <div className="space-y-8">
            <div>
              <h1 className={`text-4xl font-bold ${textPrimary} mb-4`}>자주 묻는 질문 (FAQ)</h1>
              <p className={`text-lg ${textSecondary} mb-8`}>
                개발자들이 자주 묻는 질문들과 상세한 답변을 모았습니다. 
                문제 해결과 개발에 도움이 되는 정보를 제공합니다.
              </p>
            </div>

            <div className="space-y-6">
              {[
                {
                  category: '🔐 인증 & 보안',
                  questions: [
                    {
                      q: 'API 키는 어떻게 생성하나요?',
                      a: '대시보드의 "설정 > API 관리" 페이지에서 새 API 키를 생성할 수 있습니다. 키 생성 시 필요한 권한을 선택하고, IP 주소 제한을 설정하는 것을 권장합니다.'
                    },
                    {
                      q: 'API 서명은 어떻게 생성하나요?',
                      a: 'HMAC-SHA256을 사용하여 서명을 생성합니다. 요청 메소드, URL 경로, 타임스탬프, 요청 본문을 연결한 문자열을 API Secret으로 서명합니다.'
                    },
                    {
                      q: 'Rate Limit에 걸렸을 때는 어떻게 하나요?',
                      a: 'HTTP 429 응답을 받으면 잠시 기다린 후 재시도하세요. Retry-After 헤더의 값만큼 대기하는 것을 권장합니다.'
                    }
                  ]
                },
                {
                  category: '🤖 봇 관리',
                  questions: [
                    {
                      q: '하나의 계정에서 몇 개의 봇을 실행할 수 있나요?',
                      a: '플랜에 따라 다릅니다. Basic: 20개, Pro: 95개, Ultimate: 무제한입니다. 각 봇은 독립적으로 실행되며 서로 영향을 주지 않습니다.'
                    },
                    {
                      q: '봇이 예상과 다르게 작동할 때는 어떻게 하나요?',
                      a: '먼저 봇의 로그를 확인하세요. API의 /bots/:id/logs 엔드포인트로 상세한 실행 로그를 조회할 수 있습니다.'
                    }
                  ]
                },
                {
                  category: '📊 데이터 & 분석',
                  questions: [
                    {
                      q: '실시간 데이터의 지연시간은 얼마나 되나요?',
                      a: 'WebSocket을 통한 실시간 데이터는 평균 10-50ms의 지연시간을 가집니다. 거래소별로 차이가 있습니다.'
                    },
                    {
                      q: '과거 데이터는 얼마나 오래 보관되나요?',
                      a: '가격 데이터는 5년간 보관되며, 거래 내역은 무제한 보관됩니다. 플랜에 따라 백테스팅 가능한 기간이 다릅니다.'
                    }
                  ]
                }
              ].map((category, categoryIndex) => (
                <div key={categoryIndex} className={`${theme === 'dark' ? 'bg-slate-800/60' : 'bg-white/90'} backdrop-blur-lg rounded-xl p-6 border ${theme === 'dark' ? 'border-cyan-400/20' : 'border-blue-600/20'}`}>
                  <h2 className={`text-xl font-bold ${textPrimary} mb-6`}>
                    {category.category}
                  </h2>
                  <div className="space-y-4">
                    {category.questions.map((faq, index) => (
                      <div key={index} className={`border-l-4 ${theme === 'dark' ? 'border-cyan-400' : 'border-blue-600'} pl-4`}>
                        <h3 className={`font-semibold ${textPrimary} mb-2`}>
                          Q. {faq.q}
                        </h3>
                        <p className={`${textSecondary} text-sm leading-relaxed`}>
                          A. {faq.a}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return (
          <div className="flex items-center justify-center h-64">
            <p className={`${textSecondary} text-lg`}>준비 중입니다...</p>
          </div>
        );
    }
  };

  return (
    <div className={`min-h-screen transition-all duration-300 ${themeClasses}`}>
      
      {/* Header */}
      <Header/>
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 lg:px-8 flex pt-20">
        
        {/* Sidebar */}
        <aside className={`hidden lg:block w-52 h-screen sticky top-20 ${theme === 'dark' ? 'bg-slate-800/60' : 'bg-white/90'} backdrop-blur-lg border-r ${theme === 'dark' ? 'border-cyan-400/20' : 'border-blue-600/20'} overflow-y-auto`}>
          <div className="p-4">
            <h2 className={`text-md font-bold ${textPrimary} mb-4`}>문서 목차</h2>
            <nav className="space-y-2">
              {sidebarItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveSidebarItem(item.id)}
                  className={`w-full text-left text-sm px-3 py-2 rounded-lg transition-all duration-200 flex items-center ${
                    activeSidebarItem === item.id
                      ? `${theme === 'dark' ? 'bg-cyan-400/20 text-cyan-400' : 'bg-blue-600/20 text-blue-600'} font-medium`
                      : `${textSecondary} hover:${primaryColor.replace('text-', 'text-')} hover:bg-opacity-10`
                  }`}
                >
                  <span className="mr-2">{item.icon}</span>
                  {item.title}
                </button>
              ))}
            </nav>
          </div>
        </aside>

        {/* Content */}
        <main className="flex-1 p-6 lg:p-12 max-w-full">
          {renderContent()}
        </main>
      </div>
      {/* Footer */}
      <Footer onLinkClick={(linkName) => linkName} />
    </div>
  );
};
