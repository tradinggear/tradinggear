import Header from "@/components/Header";
import { useThemeStore } from "@/stores/themeStore";
import { useNavigate } from "react-router-dom";

export default function DownloadPage() {
  const navigate = useNavigate();

  const { theme } = useThemeStore();

  const themeClasses =
    theme === "dark"
      ? "bg-gradient-to-br from-slate-900 to-slate-800 text-white"
      : "bg-gradient-to-br from-white to-slate-50 text-slate-900";

  const textPrimary = theme === "dark" ? "text-white" : "text-slate-900";
  const textSecondary = theme === "dark" ? "text-slate-300" : "text-slate-600";

  return (
    <div className={`min-h-screen transition-all duration-300 ${themeClasses}`}>
      {/* Header Component */}
      <Header />
      <div
        className={`min-h-screen transition-all duration-300 ${
          theme === "dark"
            ? "bg-gradient-to-br from-slate-900 to-slate-800"
            : "bg-gradient-to-br from-white to-slate-50"
        }`}
      >
        <section className="max-w-6xl mx-auto px-4 lg:px-8 py-20 text-center pt-40">
          {/* 소개 */}
          <h1
            className={`text-4xl lg:text-6xl font-bold mb-6 bg-clip-text text-transparent ${
              theme === "dark"
                ? "bg-gradient-to-r from-white to-cyan-400"
                : "bg-gradient-to-r from-slate-900 to-blue-600"
            }`}
          >
            트레이딩 차트 프로그램 다운로드
          </h1>
          <p
            className={`text-xl lg:text-2xl ${textSecondary} mb-8 leading-relaxed`}
          >
            실시간 시세와 강력한 분석 기능을 갖춘 <br />
            올인원 트레이딩 차트 프로그램을 지금 경험해보세요.
          </p>

          {/* 차트 미리보기 */}
          <div className="relative max-w-4xl mx-auto rounded-2xl overflow-hidden shadow-2xl border border-slate-200/20 mb-20">
            <img
              src="/chart.png"
              alt="트레이딩 차트 미리보기"
              className="w-full h-auto"
            />
          </div>

          {/* 기능 소개 */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-20">
            {[
              {
                icon: "📊",
                title: "실시간 차트",
                desc: "거래소 API 연결로 초단위로 갱신되는 시세와 호가를 제공합니다.",
              },
              {
                icon: "📈",
                title: "다양한 지표",
                desc: "이동평균선, 볼린저 밴드, RSI 등 주요 기술적 지표를 지원합니다.",
              },
              {
                icon: "⚡",
                title: "빠른 실행",
                desc: "다운로드 후 즉시 실행 가능하며, 복잡한 설치 과정이 없습니다.",
              },
            ].map((f, i) => (
              <div
                key={i}
                className={`rounded-2xl p-6 backdrop-blur-lg shadow-lg border text-center transition-all duration-300 hover:-translate-y-1 ${
                  theme === "dark"
                    ? "bg-slate-900/70 border-slate-700/60 text-slate-100"
                    : "bg-white/90 border-blue-200/30 text-slate-900"
                }`}
              >
                <div className="text-4xl mb-4">{f.icon}</div>
                <h3 className={`font-bold text-xl mb-2 ${textPrimary}`}>
                  {f.title}
                </h3>
                <p className={textSecondary}>{f.desc}</p>
              </div>
            ))}
          </div>

          {/* 다운로드 버튼 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl mx-auto mb-20">
            <button
              className={`w-full py-6 rounded-2xl font-bold text-xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 ${
                theme === "dark"
                  ? "bg-gradient-to-r from-cyan-400 to-emerald-400 text-slate-900 hover:shadow-cyan-400/30"
                  : "bg-gradient-to-r from-blue-600 to-emerald-600 text-white hover:shadow-blue-600/30"
              }`}
              onClick={() =>
                window.open("/downloads/tradinggear-win.exe", "_blank")
              }
            >
              🖥 Windows 다운로드
            </button>
            <button
              className={`w-full py-6 rounded-2xl font-bold text-xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 ${
                theme === "dark"
                  ? "bg-gradient-to-r from-cyan-400 to-emerald-400 text-slate-900 hover:shadow-cyan-400/30"
                  : "bg-gradient-to-r from-blue-600 to-emerald-600 text-white hover:shadow-blue-600/30"
              }`}
              onClick={() =>
                window.open("/downloads/tradinggear-mac.dmg", "_blank")
              }
            >
              🍎 macOS 다운로드
            </button>
          </div>

          {/* 설치 & 사용 가이드 */}
          <div
            className={`rounded-2xl p-8 backdrop-blur-lg max-w-3xl mx-auto shadow-lg border text-center ${
              theme === "dark"
                ? "bg-slate-900/80 border-slate-700/60 text-slate-100"
                : "bg-white/90 border-blue-200/30 text-slate-900"
            }`}
          >
            <h2 className={`text-2xl font-bold mb-4 ${textPrimary}`}>
              설치 & 사용 가이드
            </h2>
            <p className={`mb-6 ${textSecondary}`}>
              프로그램 설치부터 기본 사용법까지 단계별로 확인해보세요.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <a
                href="/guides/tradinggear-guide.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className={`px-6 py-3 rounded-full font-semibold border-2 transition-all duration-300 ${
                  theme === "dark"
                    ? "border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-slate-900"
                    : "border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white"
                }`}
              >
                📄 PDF 가이드 보기
              </a>
              <a
                href="/download"
                rel="noopener noreferrer"
                className={`px-6 py-3 rounded-full font-semibold border-2 transition-all duration-300 ${
                  theme === "dark"
                    ? "border-emerald-400 text-emerald-400 hover:bg-emerald-400 hover:text-slate-900"
                    : "border-emerald-600 text-emerald-600 hover:bg-emerald-600 hover:text-white"
                }`}
              >
                🎥 동영상 튜토리얼 보기
              </a>
            </div>
          </div>

          {/* 뒤로가기 */}
          <div className="mt-12">
            <button
              className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                theme === "dark"
                  ? "text-slate-300 hover:text-white"
                  : "text-slate-600 hover:text-slate-900"
              }`}
              onClick={() => navigate("/")}
            >
              ← 메인 페이지로 돌아가기
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
