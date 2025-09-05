import Header from "@/components/Header";
import { useThemeStore } from "@/stores/themeStore";
import { useState } from "react";

export default function FAQPage() {
  const [search, setSearch] = useState("");
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState("all");

  const { theme } = useThemeStore();

  const themeClasses =
    theme === "dark"
      ? "bg-gradient-to-br from-slate-900 to-slate-800 text-white"
      : "bg-gradient-to-br from-white to-slate-50 text-slate-900";

  const textPrimary = theme === "dark" ? "text-white" : "text-slate-900";
  const textSecondary = theme === "dark" ? "text-slate-300" : "text-slate-600";

  // FAQ 데이터 + 카테고리
  const faqs = [
    {
      q: "API Key는 안전하게 보관되나요?",
      a: "네, API Key는 로컬 환경에만 저장되며 서버로 전송되지 않습니다. 또한 AES256 방식으로 암호화되어 저장됩니다.",
      category: "security",
    },
    {
      q: "설치 중 오류가 발생하면?",
      a: "최신 설치 파일을 다시 다운로드해주세요. 그래도 문제가 지속된다면 FAQ의 설치 오류 해결 가이드를 확인하시거나 고객 지원에 문의하세요.",
      category: "general",
    },
    {
      q: "Windows와 macOS 모두 지원되나요?",
      a: "Windows 10 이상, macOS 12 이상을 공식 지원합니다.",
      category: "general",
    },
    {
      q: "무료로 사용할 수 있나요?",
      a: "기본 차트 기능은 무료, 일부 고급 기능은 유료 라이선스로 사용 가능합니다.",
      category: "general",
    },
    {
      q: "라이선스 정책은 어떻게 되나요?",
      a: "1 PC 당 1 라이선스가 원칙이며, 계정 연동과 클라우드 동기화를 지원합니다.",
      category: "license",
    },
    {
      q: "업데이트는 자동으로 되나요?",
      a: "인터넷 연결 시 자동 업데이트 진행. 기업 환경에서는 수동 업데이트도 지원합니다.",
      category: "license",
    },
    {
      q: "모바일 앱도 지원하나요?",
      a: "모바일 뷰어 앱을 제공하며, PC 레이아웃과 연동됩니다.",
      category: "general",
    },
    {
      q: "차트 레이아웃을 저장할 수 있나요?",
      a: "사용자는 차트 레이아웃, 지표 설정, 색상 테마 등을 무제한 저장/불러오기 가능합니다.",
      category: "general",
    },
    {
      q: "여러 개 거래소 계정을 동시에 연결할 수 있나요?",
      a: "멀티 계정 연결 가능, 포트폴리오를 통합 모드 또는 개별 모드로 확인 가능합니다.",
      category: "general",
    },
    {
      q: "백테스팅 기능도 있나요?",
      a: "전문가용 플랜에서는 전략 백테스팅과 성과 리포트 기능 제공.",
      category: "general",
    },
    {
      q: "다크 모드를 지원하나요?",
      a: "시스템 설정 자동 감지 및 수동 라이트/다크 모드 전환 가능.",
      category: "general",
    },
    {
      q: "기술 지원은 어디서 받을 수 있나요?",
      a: "공식 홈페이지 지원센터 또는 이메일 support@tradinggear.com으로 문의 가능합니다.",
      category: "general",
    },
  ];

  // 탭 + 검색 필터 적용
  const filteredFaqs = faqs
    .filter((f) => activeTab === "all" || f.category === activeTab)
    .filter((f) => f.q.toLowerCase().includes(search.toLowerCase()));

  const tabs = [
    { key: "all", label: "전체" },
    { key: "general", label: "일반" },
    { key: "security", label: "보안" },
    { key: "license", label: "라이선스" },
  ];

  return (
    <div className={`min-h-screen transition-all duration-300 ${themeClasses}`}>
      <Header />
      <div
        className={`min-h-screen transition-all duration-300 px-4 lg:px-8 py-20 pt-40 ${
          theme === "dark"
            ? "bg-gradient-to-br from-slate-900 to-slate-800"
            : "bg-gradient-to-br from-white to-slate-50"
        }`}
      >
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col items-center text-center relative z-10">
            <h1
              className={`text-4xl lg:text-6xl font-bold mb-6 bg-clip-text text-transparent ${
                theme === "dark"
                  ? "bg-gradient-to-r from-white to-cyan-400"
                  : "bg-gradient-to-r from-slate-900 to-blue-600"
              }`}
            >
              FAQ
            </h1>
            <p className={`mb-6 ${textSecondary}`}>
              자주 묻는 질문을 빠르게 찾아보세요. <br />
              검색창을 이용하면 원하는 답변을 쉽게 찾을 수 있습니다.
            </p>
          </div>

          {/* 탭 메뉴 */}
          <div className="flex justify-center gap-4 mb-6 flex-wrap">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-4 py-2 rounded-full font-semibold transition-colors border ${
                  activeTab === tab.key
                    ? theme === "dark"
                      ? "bg-cyan-400 text-slate-900 border-cyan-400/50"
                      : "bg-blue-600 text-white border-blue-600/50"
                    : theme === "dark"
                    ? "bg-slate-700 text-slate-300 border-slate-600/50 hover:bg-slate-600"
                    : "bg-white text-slate-700 border-slate-300/50 hover:bg-slate-100"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* 검색창 */}
          <div className="relative w-full mb-10">
            <input
              type="text"
              placeholder="검색어를 입력하세요..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={`w-full p-3 pr-10 rounded-xl border focus:outline-none ${
                theme === "dark"
                  ? "bg-slate-800 border-slate-700 text-white"
                  : "bg-white border-slate-300 text-slate-900"
              }`}
            />
            <svg
              className="w-5 h-5 absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 pointer-events-none"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z"
              />
            </svg>
          </div>

          {/* FAQ 리스트 */}
          <div className="space-y-4">
            {filteredFaqs.length > 0 ? (
              filteredFaqs.map((faq, idx) => (
                <button
                  key={idx}
                  onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                  className={`w-full text-left rounded-2xl p-6 transition-all duration-300 ${
                    theme === "dark"
                      ? "bg-slate-800/80 border border-slate-700 hover:shadow-cyan-400/10"
                      : "bg-white border border-slate-200 hover:shadow-blue-600/10"
                  }`}
                >
                  <h3
                    className={`text-lg font-semibold ${textPrimary} flex justify-between items-center`}
                  >
                    {faq.q}
                    <span>{openIndex === idx ? "−" : "+"}</span>
                  </h3>
                  {openIndex === idx && (
                    <p
                      className={`mt-3 text-base leading-relaxed ${textSecondary}`}
                    >
                      {faq.a}
                    </p>
                  )}
                </button>
              ))
            ) : (
              <p className={`${textSecondary} text-center`}>
                검색 결과가 없습니다.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
