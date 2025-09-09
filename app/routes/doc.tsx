import { useState, useEffect } from "react";
import { useThemeStore } from "../stores/themeStore";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [
    { title: "문서 - TRADING GEAR" },
    { name: "doc", content: "AI 트레이딩의 새로운 시대" },
  ];
};

export default function DocsPage() {
  const { theme, initializeTheme } = useThemeStore();
  const [activeSidebarItem, setActiveSidebarItem] = useState("api-guide");
  const [isCodeCopied, setIsCodeCopied] = useState("");

  useEffect(() => {
    initializeTheme();
  }, [initializeTheme]);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setIsCodeCopied(id);
    setTimeout(() => setIsCodeCopied(""), 2000);
  };

  const themeClasses =
    theme === "dark"
      ? "bg-gradient-to-br from-slate-900 to-slate-800 text-white"
      : "bg-gradient-to-br from-white to-slate-50 text-slate-900";

  const textPrimary = theme === "dark" ? "text-white" : "text-slate-900";
  const textSecondary = theme === "dark" ? "text-slate-300" : "text-slate-600";
  const primaryColor = theme === "dark" ? "text-cyan-400" : "text-blue-600";
  const accentColor =
    theme === "dark" ? "text-emerald-400" : "text-emerald-600";

  // Sidebar items (계층 구조)
  const sidebarItems = [
    {
      id: "api-guide",
      title: "API 연동 가이드",
      icon: "🔗",
      children: [
        { id: "binance", title: "바이낸스" },
        { id: "upbit", title: "업비트" },
        { id: "bithumb", title: "빗썸" },
      ],
    },
    { id: "security", title: "보안 안내", icon: "🔒" },
    { id: "examples", title: "응용 예시", icon: "💻" },
    { id: "faq", title: "FAQ", icon: "❓" },
  ];

  // 코드 블록 컴포넌트
  const CodeBlock = ({ children, language = "javascript", id, title }) => (
    <div
      className={`${
        theme === "dark" ? "bg-slate-800" : "bg-slate-100"
      } rounded-lg border ${
        theme === "dark" ? "border-slate-700" : "border-slate-300"
      } overflow-hidden my-4`}
    >
      {title && (
        <div
          className={`px-4 py-2 ${
            theme === "dark"
              ? "bg-slate-700 text-slate-300"
              : "bg-slate-200 text-slate-700"
          } text-sm font-medium border-b ${
            theme === "dark" ? "border-slate-600" : "border-slate-300"
          } flex justify-between items-center`}
        >
          <span>{title}</span>
          <button
            onClick={() => copyToClipboard(children, id)}
            className={`px-2 py-1 text-xs rounded ${
              theme === "dark"
                ? "bg-slate-600 hover:bg-slate-500 text-white"
                : "bg-slate-300 hover:bg-slate-400 text-slate-800"
            } transition-colors duration-200`}
          >
            {isCodeCopied === id ? "복사됨!" : "복사"}
          </button>
        </div>
      )}
      <pre className="p-4 overflow-x-auto">
        <code
          className={`text-sm ${
            theme === "dark" ? "text-slate-300" : "text-slate-700"
          }`}
        >
          {children}
        </code>
      </pre>
    </div>
  );

  // Content 렌더링
  const renderContent = () => {
    switch (activeSidebarItem) {
      case "api-guide":
        return (
          <div className="space-y-24">
            {/* 인트로 섹션 */}
            <section className="py-16 text-center relative overflow-hidden">
              {/* 배경 장식 */}
              <div className="absolute inset-0 -z-10">
                <div className="w-96 h-96 bg-blue-400/20 rounded-full blur-3xl top-0 left-1/3 absolute animate-pulse"></div>
                <div className="w-72 h-72 bg-emerald-400/20 rounded-full blur-2xl bottom-0 right-1/4 absolute animate-pulse"></div>
              </div>

              {/* 메인 타이틀 */}
              <h1 className="text-5xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-emerald-600 leading-snug">
                거래소 API Key 하나로 <br />
                전략부터 매매까지
              </h1>

              {/* 서브 설명 */}
              <p className="text-lg text-slate-600 dark:text-slate-300 max-w-3xl mx-auto mb-10">
                어떤 거래소든 API Key만 입력하면 데이터를 가져와,
                <span className="font-semibold"> 차트와 지표로 즉시 변환</span>
                합니다.
                <br />
                사용자는 복잡한 설정 없이{" "}
                <span className="font-semibold">
                  전략 설계 → 분석 → 매매
                </span>{" "}
                전 과정을 UI로 손쉽게 진행할 수 있습니다.
              </p>

              {/* 3단계 핵심 흐름 */}
              <div className="flex flex-col sm:flex-row justify-center gap-8 max-w-4xl mx-auto">
                {[
                  { icon: "🗝️", title: "API Key 입력" },
                  { icon: "📊", title: "데이터 변환" },
                  { icon: "⚡", title: "전략 설계 & 매매" },
                ].map((step, idx) => (
                  <div
                    key={idx}
                    className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 flex-1 flex flex-col items-center gap-4"
                  >
                    <div className="text-4xl">{step.icon}</div>
                    <h3 className="text-xl font-bold">{step.title}</h3>
                  </div>
                ))}
              </div>
              {/* 보안 안내 배너 */}
              <section className="my-16 rounded-xl border-l-4 border-yellow-500 bg-yellow-50 dark:bg-slate-800 dark:border-yellow-400 p-6">
                <p className="font-semibold text-lg">🔒 보안 안내</p>
                <p className="mt-2">
                  API Key는 절대 서버에 저장되지 않으며, 반드시 로컬 환경(.env)
                  또는 안전한 비밀 저장소에 보관하세요.
                </p>
              </section>
            </section>

            {/* 핵심 프로세스 섹션 */}
            {[
              {
                img: "/doc/main/key.png",
                title: "① API Key 입력",
                desc: "바이낸스, 업비트, 빗썸 등 다양한 거래소 API를 지원합니다. 키만 입력하면 즉시 연동됩니다.",
              },
              {
                img: "/chart.png",
                title: "② 데이터 변환",
                desc: "복잡한 원시 데이터를 TradingGear가 자동 변환하여, 직관적인 차트와 지표로 제공합니다.",
              },
              {
                img: "/doc/main/zonryak.png",
                title: "③ 전략 설계",
                desc: "UI에서 매매 전략을 손쉽게 추가하고, 백테스트 및 시뮬레이션으로 검증할 수 있습니다.",
              },
              {
                img: "/doc/main/meme.png",
                title: "④ 분석 & 매매",
                desc: "성과 분석 대시보드와 실시간 매매 신호 제공으로, 빠르고 정확한 의사결정을 지원합니다.",
              },
              {
                img: "chart.png",
                title: "⑤ 다중 거래 모니터링",
                desc: "여러 종목과 거래소를 동시에 모니터링하여, 빠른 판단과 대응으로 투자 효율을 극대화합니다.",
              },
              {
                img: "chart.png",
                title: "⑥ 사용자 맞춤 지표",
                desc: "VWAP, OB Zone, ATR 등 다양한 지표를 조합해 자신만의 전략을 최적화할 수 있습니다.",
              },
              {
                img: "chart.png",
                title: "⑦ 알림 기능",
                desc: "가격 도달, 거래량 급등락 등 중요 이벤트 발생 시 실시간 알림으로 즉시 대응 가능합니다.",
              },
              {
                img: "chart.png",
                title: "⑧ 자동매매 연동",
                desc: "웹훅과 FastAPI 백엔드 연동으로, 전략 신호를 자동매매 시스템과 연결할 수 있습니다.",
              },
            ].map((step, idx) => (
              <section
                key={idx}
                className={`flex flex-col lg:flex-row items-center gap-12 ${
                  idx % 2 ? "lg:flex-row-reverse" : ""
                }`}
              >
                <img
                  src={step.img}
                  alt={step.title}
                  className="w-full lg:w-1/2 rounded-xl shadow-lg"
                />
                <div className="lg:w-1/2 space-y-4 text-center lg:text-left">
                  <h2 className="text-3xl font-bold">{step.title}</h2>
                  <p className="text-lg text-slate-600 dark:text-slate-300">
                    {step.desc}
                  </p>
                </div>
              </section>
            ))}

            {/* 법적 안내 */}
            <section className="bg-slate-100 dark:bg-slate-900 text-center p-8 rounded-lg">
              <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                ⚠️ 당사는 투자 자문이나 매매 지시를 제공하지 않습니다.
                <br />
                오직 차트 및 데이터 가공·시각화 프로그램만 제공합니다.
              </p>
            </section>
          </div>
        );

      case "binance":
        return (
          <div className="space-y-6">
            {/* 항상 보여줄 공통 보안 배너 */}
            <div
              className={`mb-6 rounded-lg border-l-4 p-4 ${
                theme === "dark"
                  ? "bg-slate-800 border-cyan-400/50 text-slate-200"
                  : "bg-yellow-50 border-yellow-400 text-slate-800"
              }`}
            >
              <p className="font-semibold">🔒 보안 안내</p>
              <p className="text-sm mt-1">
                API Key는 절대 서버에 저장하지 마세요. 반드시 로컬 환경(.env)
                또는 안전한 비밀 저장소를 사용하세요.
              </p>
            </div>
            <h1 className={`text-3xl font-bold ${textPrimary}`}>
              바이낸스 API 연동
            </h1>
            <ol className={`${textSecondary} list-decimal ml-6 space-y-3`}>
              <li>바이낸스 계정 로그인 후 API 관리 페이지 접속</li>
              <li>새 API 키 생성, IP 제한 설정</li>
              <li>TradingGear 차트에서 API 입력란에 Key와 Secret 입력</li>
              <li>테스트용 샌드박스 연결 확인</li>
            </ol>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <img
                src="/docs/binance1.png"
                alt="바이낸스 API 1"
                className="rounded-lg border"
              />
              <img
                src="/docs/binance2.png"
                alt="바이낸스 API 2"
                className="rounded-lg border"
              />
            </div>
          </div>
        );

      case "upbit":
        return (
          <div className="space-y-6">
            {/* 항상 보여줄 공통 보안 배너 */}
            <div
              className={`mb-6 rounded-lg border-l-4 p-4 ${
                theme === "dark"
                  ? "bg-slate-800 border-cyan-400/50 text-slate-200"
                  : "bg-yellow-50 border-yellow-400 text-slate-800"
              }`}
            >
              <p className="font-semibold">🔒 보안 안내</p>
              <p className="text-sm mt-1">
                API Key는 절대 서버에 저장하지 마세요. 반드시 로컬 환경(.env)
                또는 안전한 비밀 저장소를 사용하세요.
              </p>
            </div>
            <h1 className={`text-3xl font-bold ${textPrimary}`}>
              업비트 API 연동
            </h1>
            <ol className={`${textSecondary} list-decimal ml-6 space-y-3`}>
              <li>업비트 계정 로그인 후 API 관리 페이지 접속</li>
              <li>API Key 생성, 권한 및 IP 제한 설정</li>
              <li>TradingGear 차트에 Key 입력</li>
            </ol>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <img
                src="/docs/upbit1.png"
                alt="업비트 API 1"
                className="rounded-lg border"
              />
            </div>
          </div>
        );

      case "bithumb":
        return (
          <div className="space-y-6">
            {/* 항상 보여줄 공통 보안 배너 */}
            <div
              className={`mb-6 rounded-lg border-l-4 p-4 ${
                theme === "dark"
                  ? "bg-slate-800 border-cyan-400/50 text-slate-200"
                  : "bg-yellow-50 border-yellow-400 text-slate-800"
              }`}
            >
              <p className="font-semibold">🔒 보안 안내</p>
              <p className="text-sm mt-1">
                API Key는 절대 서버에 저장하지 마세요. 반드시 로컬 환경(.env)
                또는 안전한 비밀 저장소를 사용하세요.
              </p>
            </div>
            <h1 className={`text-3xl font-bold ${textPrimary}`}>
              빗썸 API 연동
            </h1>
            <ol className={`${textSecondary} list-decimal ml-6 space-y-3`}>
              <li>빗썸 계정 로그인 후 API 관리 페이지 접속</li>
              <li>API Key 생성, 권한 및 IP 제한 설정</li>
              <li>TradingGear 차트에 Key 입력</li>
            </ol>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <img
                src="/docs/bithumb1.png"
                alt="빗썸 API 1"
                className="rounded-lg border"
              />
            </div>
          </div>
        );

      case "security":
        return (
          <div className="space-y-6">
            <h1 className={`text-3xl font-bold ${textPrimary}`}>보안 안내</h1>
            <p className={`${textSecondary}`}>
              API Key는 절대 서버에 저장하지 않고, 로컬 환경에만 저장하세요.
              환경 변수나 안전한 파일을 사용하여 관리합니다.
            </p>
            <CodeBlock id="security-note" title="보안 권장 사항">
              {`// API Key를 .env에 저장
TRADING_GEAR_API_KEY=your-api-key
TRADING_GEAR_API_SECRET=your-api-secret

// 서버에 Key 저장 금지`}
            </CodeBlock>
          </div>
        );

      case "examples":
        return (
          <div className="space-y-6">
            <h1 className={`text-3xl font-bold ${textPrimary}`}>응용 예시</h1>
            <p className={`${textSecondary}`}>
              TradingGear SDK를 활용한 간단한 봇 예제입니다.
            </p>
            <CodeBlock id="example-bot" title="app.js">
              {`const TradingGear = require('trading-gear-sdk');

const client = new TradingGear({ apiKey: '...', apiSecret: '...' });

async function createBot() {
  const bot = await client.bots.createGrid({ symbol: 'BTC/USDT', gridSize: 10 });
  await client.bots.start(bot.id);
  console.log('봇 시작 완료');
}

createBot();`}
            </CodeBlock>
          </div>
        );

      case "faq":
        return (
          <div className="space-y-8">
            <h1 className={`text-3xl font-bold ${textPrimary}`}>FAQ</h1>
            <div className="space-y-4">
              <div
                className={`border-l-4 ${
                  theme === "dark" ? "border-cyan-400" : "border-blue-600"
                } pl-4`}
              >
                <h3 className={`font-semibold ${textPrimary}`}>
                  Q. API 키는 어떻게 생성하나요?
                </h3>
                <p className={`${textSecondary} text-sm`}>
                  대시보드에서 새 API 키를 생성하고 필요한 권한과 IP 제한을
                  설정하세요.
                </p>
              </div>
              <div
                className={`border-l-4 ${
                  theme === "dark" ? "border-cyan-400" : "border-blue-600"
                } pl-4`}
              >
                <h3 className={`font-semibold ${textPrimary}`}>
                  Q. API Key를 서버에 저장해도 되나요?
                </h3>
                <p className={`${textSecondary} text-sm`}>
                  권장하지 않습니다. 반드시 로컬 환경이나 안전한 파일에만
                  저장하세요.
                </p>
              </div>
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

  // Sidebar 버튼 렌더링 (children 있는 경우 하위 메뉴 표시)
  const renderSidebar = () => (
    <aside
      className={`hidden lg:block w-60 h-screen sticky top-20 ${
        theme === "dark" ? "bg-slate-800/60" : "bg-white/90"
      } backdrop-blur-lg border-r ${
        theme === "dark" ? "border-cyan-400/20" : "border-blue-600/20"
      } overflow-y-auto`}
    >
      <div className="p-4">
        <h2 className={`text-md font-bold ${textPrimary} mb-4`}>문서 목차</h2>
        <nav className="space-y-2">
          {sidebarItems.map((item) => (
            <div key={item.id}>
              <button
                onClick={() => {
                  // 상위 메뉴 클릭 시에만 toggle
                  if (item.children) {
                    setActiveSidebarItem((prev) =>
                      prev === item.id ? "" : item.id
                    );
                  } else {
                    setActiveSidebarItem(item.id);
                  }
                }}
                className={`w-full text-left text-sm px-3 py-2 rounded-lg transition-all duration-200 flex items-center ${
                  activeSidebarItem === item.id
                    ? `${
                        theme === "dark"
                          ? "bg-cyan-400/20 text-cyan-400"
                          : "bg-blue-600/20 text-blue-600"
                      } font-medium`
                    : `${textSecondary} hover:${primaryColor.replace(
                        "text-",
                        "text-"
                      )} hover:bg-opacity-10`
                }`}
              >
                <span className="mr-2">{item.icon}</span>
                {item.title}
              </button>

              {item.children && (
                <div className="pl-6 mt-1 space-y-1">
                  {item.children.map((child) => (
                    <button
                      key={child.id}
                      onClick={() => setActiveSidebarItem(child.id)}
                      className={`w-full text-left text-sm px-2 py-1 rounded-lg transition-all duration-200 ${
                        activeSidebarItem === child.id
                          ? `${
                              theme === "dark"
                                ? "bg-cyan-400/20 text-cyan-400"
                                : "bg-blue-600/20 text-blue-600"
                            } font-medium`
                          : `${textSecondary} hover:${primaryColor.replace(
                              "text-",
                              "text-"
                            )} hover:bg-opacity-10`
                      }`}
                    >
                      {child.title}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
      </div>
    </aside>
  );

  return (
    <div className={`min-h-screen transition-all duration-300 ${themeClasses}`}>
      <Header />
      <div className="max-w-7xl mx-auto px-4 lg:px-8 flex pt-20">
        {renderSidebar()}
        <main className="flex-1 p-6 lg:p-12 max-w-full">{renderContent()}</main>
      </div>
      <Footer onLinkClick={(linkName) => linkName} />
    </div>
  );
}
