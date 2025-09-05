import type { MetaFunction } from "@remix-run/node";
import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useNavigate } from "react-router-dom";
import { useThemeStore } from "@/stores/themeStore";
// import MainEventPopup from "@/components/popup1";

export const meta: MetaFunction = () => {
  return [
    { title: "TRADING GEAR" },
    { name: "description", content: "AI 트레이딩의 새로운 시대" },
  ];
};

export default function Index() {
  const navigate = useNavigate();
  const { theme, isClient, initializeTheme } = useThemeStore();

  const [modalImg, setModalImg] = useState<string | null>(null);

  const images = ["/chart.png"]; // 필요 시 이미지 배열 추가

  useEffect(() => {
    initializeTheme();
  }, [initializeTheme]);

  const Particle = ({ index }: { index: number }) => (
    <div
      className={`absolute w-1 h-1 rounded-full opacity-10 pointer-events-none animate-pulse
        ${theme === "dark" ? "bg-cyan-400" : "bg-blue-600"}`}
      style={{
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        animationDelay: `${Math.random() * 6}s`,
        animationDuration: `${Math.random() * 4 + 4}s`,
      }}
    />
  );

  const themeClasses =
    theme === "dark"
      ? "bg-gradient-to-br from-slate-900 to-slate-800 text-white"
      : "bg-gradient-to-br from-white to-slate-50 text-slate-900";

  const textPrimary = theme === "dark" ? "text-white" : "text-slate-900";
  const textSecondary = theme === "dark" ? "text-slate-300" : "text-slate-600";
  // const primaryColor = theme === "dark" ? "text-cyan-400" : "text-blue-600";
  const accentColor =
    theme === "dark" ? "text-emerald-400" : "text-emerald-600";

  return (
    <div className={`min-h-screen transition-all duration-300 ${themeClasses}`}>
      {/*<MainEventPopup />*/}
      {/* Floating particles */}
      {isClient &&
        Array.from({ length: 5 }, (_, i) => <Particle key={i} index={i} />)}
      {/* Header Component */}
      <Header />

      {/* Hero Section */}
      <section
        className="min-h-screen flex items-center justify-center text-center relative overflow-hidden pt-20"
        id="home"
      >
        <div
          className={`absolute inset-0 ${
            theme === "dark"
              ? "bg-gradient-to-b from-transparent to-slate-800/30"
              : "bg-gradient-to-b from-transparent to-slate-200/50"
          } to-transparent`}
        ></div>

        <div className="max-w-4xl mx-auto px-4 lg:px-8 animate-pulse">
          <h1
            className={`text-4xl lg:text-6xl font-bold mb-6 ${
              theme === "dark"
                ? "bg-gradient-to-r from-white to-cyan-400"
                : "bg-gradient-to-r from-slate-900 to-blue-600"
            } bg-clip-text text-transparent`}
          >
            실시간 거래소 데이터를 <br />
            나만의 트레이딩 차트로
          </h1>
          <p
            className={`text-xl lg:text-2xl ${textSecondary} mb-8 leading-relaxed`}
          >
            TradingGear 차트 프로그램은 사용자의 거래소 API 연결만으로
            <br /> 실시간 시세·호가 데이터를 분석 가능한 차트로 제공합니다.
            <br />
            <span className="text-sm lg:text-base">
              투자 판단은 사용자의 몫이며, 트레이딩기어는 최적의 시각화만
              제공합니다.
            </span>
            <br />
            {/* 초보자부터 전문가까지, 모든 레벨의 트레이더를 위한 올인원 플랫폼 */}
          </p>

          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto px-4 lg:px-4">
            {[
              {
                icon: "⚡",
                title: "실시간 데이터 반영",
                desc: "거래소와 직접 연동되어 즉시 반영됩니다.",
              },
              {
                icon: "🔒",
                title: "안전한 API 관리",
                desc: "API Key는 로컬에서만 사용하여 안전하게 보호합니다.",
              },
              {
                icon: "📊",
                title: "강력한 차트 기능",
                desc: "다양한 지표와 사용자 맞춤 레이아웃을 제공합니다.",
              },
              {
                icon: "💻",
                title: "간단한 설치",
                desc: "다운로드 후 즉시 실행 가능하여 빠르게 시작할 수 있습니다.",
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className={`rounded-2xl p-3 text-center backdrop-blur-lg transition-all duration-300 hover:-translate-y-1
        ${
          theme === "dark"
            ? "bg-slate-950/80 border border-slate-700/60 shadow-lg shadow-cyan-400/5 hover:shadow-cyan-400/10 text-slate-100"
            : "bg-white/90 border border-blue-200/30 shadow-md hover:shadow-xl text-slate-900"
        }`}
              >
                <div className="text-4xl mb-4 opacity-90">{item.icon}</div>
                <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                <p
                  className={
                    theme === "dark" ? "text-slate-300" : "text-slate-700"
                  }
                >
                  {item.desc}
                </p>
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-4 pt-10">
            <button
              className={`${
                theme === "dark"
                  ? "bg-gradient-to-r from-cyan-400 to-emerald-400 text-slate-900 hover:shadow-cyan-400/30"
                  : "bg-gradient-to-r from-blue-600 to-emerald-600 text-white hover:shadow-blue-600/30"
              } px-8 py-4 rounded-full font-bold text-lg hover:transform hover:-translate-y-1 hover:shadow-xl transition-all duration-300`}
              onClick={() => navigate("/login")}
            >
              다운로드
            </button>
            <button
              className={`border-2 ${
                theme === "dark"
                  ? "border-cyan-400 text-cyan-400 hover:bg-cyan-400"
                  : "border-blue-600 text-blue-600 hover:bg-blue-600"
              } hover:text-slate-900 px-8 py-4 rounded-full font-bold text-lg transition-all duration-300`}
              onClick={() => navigate("/login")}
            >
              차트 보기
            </button>
          </div>
        </div>
      </section>
      <section
        className={`py-20 ${
          theme === "dark"
            ? "bg-gradient-to-b from-slate-900/20 via-transparent to-slate-800/30"
            : "bg-gradient-to-b from-slate-200/20 via-transparent to-slate-100/40"
        }`}
        id="preview"
      >
        <div className="max-w-6xl mx-auto px-4 lg:px-8 text-center">
          <h2
            className={`text-4xl lg:text-6xl font-bold mb-4 bg-clip-text text-transparent ${
              theme === "dark"
                ? "bg-gradient-to-r from-white to-cyan-400"
                : "bg-gradient-to-r from-slate-900 to-blue-600"
            }`}
          >
            ⚡ 종합 실시간 트레이딩 차트
          </h2>
          <p
            className={`mt-10 mb-12 text-lg ${textSecondary} mx-auto max-w-2xl`}
          >
            거래 데이터를 기반으로 초단위로 갱신되는 <br />
            주식 실시간 트레이딩 차트를 직접 경험해보세요.
          </p>

          <div className="relative max-w-4xl mx-auto rounded-2xl overflow-hidden shadow-2xl border border-slate-200/20 mb-28">
            <video
              src="/chart_video.mp4"
              controls
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-auto rounded-2xl"
            />
          </div>

          <div className="flex flex-col lg:flex-row items-center gap-12">
            {/* 왼쪽 텍스트 */}
            <div className="lg:w-1/2 text-center lg:text-left">
              <h3
                className={`text-3xl lg:text-4xl font-bold mb-4 ${textPrimary}`}
              >
                고급 트레이딩 기능
              </h3>
              <p className={`mb-6 text-lg ${textSecondary} leading-relaxed`}>
                실시간 차트와 호가, 다양한 기술적 지표를 한눈에 확인하고 분석할
                수 있습니다.
                <br />
                <br />
                포트폴리오 관리부터 전략 시뮬레이션까지, 모든 기능이 직관적인
                UI로 제공됩니다.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mt-6 justify-center lg:justify-start">
                <button
                  className={`${
                    theme === "dark"
                      ? "bg-gradient-to-r from-cyan-400 to-emerald-400 text-slate-900 hover:shadow-cyan-400/40"
                      : "bg-gradient-to-r from-blue-600 to-emerald-600 text-white hover:shadow-blue-600/40"
                  } px-8 py-4 rounded-full font-bold text-lg hover:-translate-y-1 hover:shadow-xl transition-all duration-300`}
                >
                  API 연동 가이드
                </button>
                <button
                  className={`border-2 px-8 py-4 rounded-full font-bold text-lg transition-all duration-300 ${
                    theme === "dark"
                      ? "border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-slate-900"
                      : "border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white"
                  }`}
                  onClick={() => navigate("/feature")}
                >
                  차트 기능 자세히
                </button>
              </div>
            </div>

            {/* 오른쪽 이미지 */}
            <div className="lg:w-1/2 relative rounded-2xl overflow-hidden shadow-2xl border border-slate-200/20">
              <button
                className="p-0 border-none bg-transparent cursor-zoom-in"
                onClick={() => setModalImg(images[0])}
              >
                <img
                  src={images[0]}
                  alt="실시간 트레이딩 차트 미리보기"
                  className="w-full h-auto rounded-xl"
                />
              </button>
            </div>
          </div>
        </div>

        {/* 이미지 모달 */}
        {modalImg && (
          <button
            className="fixed inset-0 bg-black/70 flex justify-center items-center z-50 p-4 cursor-zoom-out"
            onClick={() => setModalImg(null)}
            aria-label="이미지 닫기"
          >
            <img
              src={modalImg}
              alt="확대 이미지"
              className="max-w-[90vw] max-h-[90vh] rounded-xl shadow-2xl"
            />
          </button>
        )}
      </section>
      {/* Features Section */}
      <section
        className={`py-20 ${
          theme === "dark"
            ? "bg-gradient-to-b from-transparent to-slate-800/30"
            : "bg-gradient-to-b from-transparent to-slate-100/50"
        }`}
        id="features"
      >
        {/* <section className={`py-20 ${theme === 'dark' ? 'bg-gradient-to-b from-transparent to-slate-800/30' : 'bg-slate-100'}`} id="features"> */}
        <div className="max-w-6xl mx-auto px-4 lg:px-8">
          <h2
            className={`text-3xl lg:text-5xl font-bold text-center mb-16 ${textPrimary}`}
          >
            왜 Trading Gear를 선택해야 할까요?
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
            {[
              {
                icon: "🤖",
                title: "AI 기반 자동 거래",
                desc: "머신러닝 알고리즘이 시장 패턴을 분석하여 최적의 거래 타이밍을 찾아드립니다. 24시간 지속적인 모니터링으로 기회를 놓치지 않습니다.",
              },
              {
                icon: "📊",
                title: "고급 분석 도구",
                desc: "실시간 차트, 기술적 지표, 백테스팅 기능으로 전문적인 분석을 제공합니다. 데이터 기반의 합리적인 투자 결정을 도와드립니다.",
              },
              {
                icon: "🔒",
                title: "안전한 자금 관리",
                desc: "은행급 보안 시스템과 2단계 인증으로 고객의 자산을 안전하게 보호합니다. API 키를 통한 안전한 거래소 연결을 제공합니다.",
              },
              {
                icon: "⚡",
                title: "초고속 실행",
                desc: "전 세계 주요 거래소와 직접 연결된 고성능 서버로 밀리초 단위의 빠른 주문 실행을 보장합니다.",
              },
              {
                icon: "🎯",
                title: "맞춤형 전략",
                desc: "개인의 투자 성향과 리스크 허용도에 맞는 맞춤형 거래 전략을 제공합니다. 다양한 자산 클래스에 대한 포트폴리오 최적화를 지원합니다.",
              },
              {
                icon: "📱",
                title: "모바일 지원",
                desc: "언제 어디서나 모바일 앱으로 포트폴리오를 모니터링하고 거래 설정을 조정할 수 있습니다. 직관적인 UI/UX 설계로 쉽게 사용가능합니다.",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className={`${
                  theme === "dark"
                    ? "bg-slate-800/60 border-cyan-400/20 hover:border-cyan-400 hover:shadow-cyan-400/20"
                    : "bg-white/90 border-blue-600/20 hover:border-blue-600 hover:shadow-blue-600/20"
                } border rounded-2xl p-8 text-center backdrop-blur-lg hover:transform hover:-translate-y-2 hover:shadow-xl transition-all duration-300`}
              >
                <div className="text-5xl mb-4">{feature.icon}</div>
                <h3 className={`text-xl font-semibold mb-4 ${textPrimary}`}>
                  {feature.title}
                </h3>
                <p className={`${textSecondary} leading-relaxed`}>
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* Trading Bots Section */}
      <section className="py-20" id="bots">
        <div className="max-w-6xl mx-auto px-4 lg:px-8">
          <h2
            className={`text-3xl lg:text-5xl font-bold text-center mb-16 ${textPrimary}`}
          >
            다양한 트레이딩 봇 전략
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {[
              {
                title: "그리드 트레이딩 봇",
                desc: "횡보 시장에서 작은 가격 변동으로도 수익을 창출하는 전략입니다. 자동으로 매수/매도 주문을 반복 실행합니다.",
              },
              {
                title: "DCA 봇 (평균 단가 전략)",
                desc: "정기적으로 일정 금액을 투자하여 평균 매수 단가를 낮추는 안정적인 장기 투자 전략입니다.",
              },
              {
                title: "스캘핑 봇",
                desc: "초단기 거래로 작은 가격 차이에서 빠르게 수익을 얻는 전략입니다. 높은 빈도의 거래로 수익을 극대화합니다.",
              },
              {
                title: "추세 추종 봇",
                desc: "시장의 상승/하락 추세를 파악하여 트렌드를 따라가는 전략입니다. 기술적 지표를 활용한 신호 기반 거래를 수행합니다.",
              },
              {
                title: "차익거래 봇",
                desc: "서로 다른 거래소 간의 가격 차이를 이용하여 무위험 수익을 창출하는 전략입니다.",
              },
              {
                title: "옵션 전략 봇",
                desc: "복잡한 옵션 거래 전략을 자동화하여 프리미엄 수익과 헤지 기능을 동시에 제공합니다.",
              },
            ].map((bot, index) => (
              <div
                key={index}
                className={`${
                  theme === "dark"
                    ? "bg-gradient-to-br from-cyan-400/10 to-emerald-400/10 border-cyan-400/20 hover:border-emerald-400 hover:from-cyan-400/20 hover:to-emerald-400/20"
                    : "bg-gradient-to-br from-blue-600/10 to-emerald-600/10 border-blue-600/20 hover:border-emerald-600 hover:from-blue-600/20 hover:to-emerald-600/20"
                } border rounded-xl p-6 hover:bg-gradient-to-br transition-all duration-300`}
              >
                <h4 className={`${accentColor} font-semibold text-lg mb-3`}>
                  {bot.title}
                </h4>
                <p className={`${textSecondary} text-sm leading-relaxed`}>
                  {bot.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* CTA Section */}
      <section
        className={`py-20 text-center ${
          theme === "dark"
            ? "bg-gradient-radial from-emerald-400/10"
            : "bg-gradient-radial from-emerald-600/10"
        } to-transparent`}
        id="signup"
      >
        <div className="max-w-6xl mx-auto px-4 lg:px-8">
          <h2 className={`text-3xl lg:text-5xl font-bold mb-4 ${textPrimary}`}>
            지금 시작하세요!
          </h2>
          <p className={`text-xl ${textSecondary} mb-8`}>
            7일 무료 체험으로 Trading Gear의 모든 기능을 경험해보세요. 신용카드
            등록 없이 바로 시작 가능합니다.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button
              className={`${
                theme === "dark"
                  ? "bg-gradient-to-r from-cyan-400 to-emerald-400 text-slate-900 hover:shadow-cyan-400/40"
                  : "bg-gradient-to-r from-blue-600 to-emerald-600 text-white hover:shadow-blue-600/40"
              } px-8 py-4 rounded-full font-bold text-lg hover:transform hover:-translate-y-1 hover:shadow-xl transition-all duration-300`}
              onClick={() => navigate("/login")}
            >
              무료 체험 시작하기
            </button>
            <button
              className={`border-2 ${
                theme === "dark"
                  ? "border-cyan-400 text-cyan-400 hover:bg-cyan-400"
                  : "border-blue-600 text-blue-600 hover:bg-blue-600"
              } hover:text-slate-900 px-8 py-4 rounded-full font-bold text-lg transition-all duration-300`}
            >
              전문가와 상담하기
            </button>
          </div>
        </div>
      </section>
      {/* Footer Component */}
      <Footer onLinkClick={(linkName) => linkName} />
    </div>
  );
}
