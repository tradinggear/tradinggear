import Header from "@/components/Header";
import { useThemeStore } from "@/stores/themeStore";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function FeaturesPage() {
  const navigate = useNavigate();
  const { theme } = useThemeStore();

  const [modalImg, setModalImg] = useState<string | null>(null);

  const themeClasses =
    theme === "dark"
      ? "bg-gradient-to-br from-slate-900 to-slate-800 text-white"
      : "bg-gradient-to-br from-white to-slate-50 text-slate-900";

  const textPrimary = theme === "dark" ? "text-white" : "text-slate-900";
  const textSecondary = theme === "dark" ? "text-slate-300" : "text-slate-600";
  const primaryColor = theme === "dark" ? "text-cyan-400" : "text-blue-600";
  const accentColor =
    theme === "dark" ? "text-emerald-400" : "text-emerald-600";
  return (
    <div className={`min-h-screen transition-all duration-300 ${themeClasses}`}>
      <Header />
      <div
        className={`${
          theme === "dark"
            ? "bg-slate-900 text-white"
            : "bg-slate-50 text-slate-900"
        }`}
      >
        {/* Hero Section */}
        <section className="py-10 text-center pt-40">
          <h1
            className={`text-4xl lg:text-6xl font-bold mb-3 bg-clip-text text-transparent ${
              theme === "dark"
                ? "bg-gradient-to-r from-white to-cyan-400"
                : "bg-gradient-to-r from-slate-900 to-blue-600"
            } leading-snug lg:leading-snug`}
          >
            TradingGear 차트 기능 소개
          </h1>

          <p
            className={`text-lg lg:text-xl mx-auto max-w-3xl leading-relaxed ${textSecondary}`}
          >
            TradingGear는 실시간 호가창, 체결창, 사용자 맞춤 지표, 다중 거래
            모니터링, <br />
            알림 기능 등 강력한 기능을 제공합니다.
          </p>
          <video
            src="/chart_video.mp4"
            controls
            autoPlay
            loop
            muted
            playsInline
            className="w-full max-w-4xl mx-auto rounded-2xl aspect-video"
          />
          <ul className="mt-6 flex flex-wrap justify-center gap-4 text-sm lg:text-base font-medium">
            <li className="px-4 py-2 rounded-full bg-slate-200/40 dark:bg-slate-700/50">
              실시간 데이터 반영
            </li>
            <li className="px-4 py-2 rounded-full bg-slate-200/40 dark:bg-slate-700/50">
              친숙한 UI
            </li>
            <li className="px-4 py-2 rounded-full bg-slate-200/40 dark:bg-slate-700/50">
              전문가급 분석 도구
            </li>
          </ul>
        </section>
        {/* 기능 카드 섹션 */}
        <section
          className={`py-5 ${
            theme === "dark"
              ? "bg-gradient-to-b from-transparent to-slate-800/30"
              : "bg-gradient-to-b from-transparent to-slate-100/50"
          }`}
        >
          <div className="max-w-6xl mx-auto px-4 lg:px-8 mb-16">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  icon: "📈",
                  title: "실시간 호가/체결",
                  desc: "호가창과 체결 데이터를 실시간으로 확인 가능",
                },
                {
                  icon: "⚙️",
                  title: "사용자 맞춤 지표",
                  desc: "OB 존, VWAP, ATR 등 다양한 지표 구성 가능",
                },
                {
                  icon: "📊",
                  title: "다중 거래 모니터링",
                  desc: "여러 종목과 거래소 동시에 모니터링 가능",
                },
                {
                  icon: "🔔",
                  title: "알림 기능",
                  desc: "가격 도달, 거래량 급등락 시 실시간 알림",
                },
              ].map((feature, idx) => (
                <div
                  key={idx}
                  className={`rounded-2xl p-6 text-center backdrop-blur-lg shadow-lg transition-all duration-300 border ${
                    theme === "dark"
                      ? "bg-slate-800/60 border-cyan-400/20 hover:border-cyan-400 hover:shadow-cyan-400/20"
                      : "bg-white/90 border-blue-200/20 hover:border-blue-600 hover:shadow-blue-200/30"
                  }`}
                >
                  <div className="text-5xl mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-semibold mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm leading-relaxed">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 전문 기능 섹션 */}
        <section
          className={`py-20 ${
            theme === "dark"
              ? "bg-gradient-to-b from-transparent to-slate-800/30"
              : "bg-gradient-to-b from-transparent to-slate-100/50"
          }`}
          id="advanced-features"
        >
          <div className="max-w-6xl mx-auto px-4 lg:px-8">
            <h2
              className={`text-3xl lg:text-5xl font-bold text-center mb-12 ${textPrimary}`}
            >
              전문 기능 & 실전 예시
            </h2>

            {/* 나머지 기능 카드/내용 */}

            {[
              {
                title: "📈 실시간 호가/체결",
                story:
                  "시세 변동을 놓치면 빠른 거래 판단이 어렵습니다. TradingGear는 실시간 API 연동으로 호가창과 체결 데이터를 즉시 갱신하여, 빠른 주문과 포지션 관리가 가능하게 합니다.",
                img: "/chart-3.png",
              },
              {
                title: "⚙️ 사용자 맞춤 지표 및 레이아웃",
                story:
                  "표준 차트만으로는 자신만의 전략을 구현하기 어렵습니다. TradingGear는 내장/커스텀 지표와 레이아웃을 자유롭게 구성할 수 있어 OB 존, VWAP, ATR 등 다양한 지표로 전략을 최적화할 수 있습니다.",
                img: "/graph2.png",
              },
              {
                title: "🖥️ 다중 거래 모니터링",
                story:
                  "여러 종목을 동시에 체크하기 어렵지만, TradingGear는 멀티 모니터와 다중 거래소 동시 모니터링 기능을 제공하여 빠른 판단과 대응으로 투자 효율을 극대화할 수 있습니다.",
                img: "/chart-2.png",
              },
              {
                title: "🔔 알림 기능",
                story:
                  "중요 시그널을 놓치면 손해가 발생할 수 있습니다. TradingGear는 가격 도달, 거래량 급등락 등 조건 충족 시 실시간 알림을 제공하여 모바일/웹에서 즉시 확인할 수 있습니다.",
                img: "/chart.png",
              },
            ].map((feature, idx) => (
              <div
                key={idx}
                className={`flex flex-col lg:flex-row items-center gap-12 mb-20 ${
                  idx % 2 === 1 ? "lg:flex-row-reverse" : ""
                }`}
              >
                {/* 이미지 */}
                <div className="lg:w-1/2 rounded-2xl overflow-hidden border border-slate-200/20">
                  <button
                    onClick={() => setModalImg(feature.img)}
                    className="w-full p-0 border-0 bg-transparent cursor-zoom-in"
                  >
                    <img
                      src={feature.img}
                      alt={feature.title}
                      className="w-full h-auto block"
                    />
                  </button>
                </div>

                {/* 텍스트 */}
                <div className="lg:w-1/2 text-center lg:text-left">
                  <h3
                    className={`text-3xl lg:text-4xl font-bold mb-4 ${textPrimary}`}
                  >
                    {feature.title}
                  </h3>
                  <p className={`text-lg ${textSecondary} leading-relaxed`}>
                    {feature.story}
                  </p>
                </div>
              </div>
            ))}
          </div>

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

        {/* 하단 패널 / CTA */}
        <section className="py-20 text-center">
          <h2 className={`text-3xl lg:text-5xl font-bold mb-12 ${textPrimary}`}>
            📊 고급 분석 도구
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto px-4 lg:px-8">
            {[
              {
                icon: "📝",
                title: "거래 로그",
                desc: "엔트리/TP/SL 발생 로그, Score, RR 기록",
              },
              {
                icon: "📈",
                title: "백테스트",
                desc: "기간별 수익률, 승률, MDD, 거래별 손익 기록",
              },
              {
                icon: "⚙️",
                title: "설정",
                desc: "차트 환경, 전략 파라미터, 데이터 연동 설정",
              },
              {
                icon: "🔔",
                title: "사용자 지정 알림",
                desc: "지정 가격, 전략 신호 등 맞춤 알림 설정",
              },
            ].map((panel, idx) => (
              <div
                key={idx}
                className={`rounded-2xl p-6 text-center backdrop-blur-lg shadow-lg transition-all duration-300 border ${
                  theme === "dark"
                    ? "bg-slate-800/60 border-cyan-400/20 hover:border-cyan-400 hover:shadow-cyan-400/20"
                    : "bg-white/90 border-blue-200/20 hover:border-blue-600 hover:shadow-blue-200/30"
                }`}
              >
                <div className="text-5xl mb-4">{panel.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{panel.title}</h3>
                <p className="text-sm leading-relaxed">{panel.desc}</p>
              </div>
            ))}
          </div>

          {/* CTA 버튼 */}
          <div className="flex flex-col sm:flex-row justify-center gap-4 mt-16">
            <button
              className={`px-8 py-4 rounded-full font-bold text-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
                theme === "dark"
                  ? "bg-gradient-to-r from-cyan-400 to-emerald-400 text-slate-900 hover:shadow-cyan-400/40"
                  : "bg-gradient-to-r from-blue-600 to-emerald-600 text-white hover:shadow-blue-600/40"
              }`}
              onClick={() => navigate("/doc")}
            >
              상세 매뉴얼 pdf
            </button>
            <button
              className={`border-2 px-8 py-4 rounded-full font-bold text-lg transition-all duration-300 ${
                theme === "dark"
                  ? "border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-slate-900"
                  : "border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white"
              }`}
              onClick={() => navigate("/download")}
            >
              다운로드
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
