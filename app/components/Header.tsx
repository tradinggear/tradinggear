import { useState } from "react";
import { useThemeStore } from "@/stores/themeStore";
import { useNavigate } from "react-router-dom";

export default function Header() {
  const { theme, toggleTheme } = useThemeStore();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const headerClasses =
    theme === "dark"
      ? "bg-slate-900/95 border-cyan-400/20"
      : "bg-white/95 border-blue-600/20";

  const textPrimary = theme === "dark" ? "text-white" : "text-slate-900";
  const primaryColor = theme === "dark" ? "text-cyan-400" : "text-blue-600";

  return (
    <>
      <header
        className={`fixed top-0 w-full backdrop-blur-lg z-50 border-b transition-all duration-300 ${headerClasses}`}
      >
        <nav className="max-w-7xl mx-auto flex justify-between items-center px-4 lg:px-8 py-4">
          {/* Logo */}
          <a
            href="/"
            className={`flex items-center text-2xl font-bold cursor-pointer transition-colors duration-300 ${primaryColor}`}
          >
            {theme === "dark" ? (
              <img
                className="h-[44px]"
                src="/logo-white.png"
                alt="Logo"
                loading="lazy"
              />
            ) : (
              <img
                className="h-[44px]"
                src="/logo.png"
                alt="Logo"
                loading="lazy"
              />
            )}
          </a>

          {/* Desktop Navigation */}
          <ul className="hidden lg:flex items-center space-x-8">
            <li>
              <a
                href="/about"
                className={`${textPrimary} hover:${primaryColor.replace(
                  "text-",
                  "text-"
                )} font-medium cursor-pointer transition-colors duration-300`}
              >
                회사소개
              </a>
            </li>
            <li>
              <a
                href="/doc"
                className={`${textPrimary} hover:${primaryColor.replace(
                  "text-",
                  "text-"
                )} font-medium cursor-pointer transition-colors duration-300`}
              >
                API 연동가이드
              </a>
            </li>
            <li>
              <a
                href="/feature"
                className={`${textPrimary} hover:${primaryColor.replace(
                  "text-",
                  "text-"
                )} font-medium cursor-pointer transition-colors duration-300`}
              >
                기능소개
              </a>
            </li>
            <li>
              <a
                href="/faq"
                className={`${textPrimary} hover:${primaryColor.replace(
                  "text-",
                  "text-"
                )} font-medium cursor-pointer transition-colors duration-300`}
              >
                자주묻는질문(FAQ)
              </a>
            </li>
            <li>
              <a
                href="/pricing"
                className={`${textPrimary} hover:${primaryColor.replace(
                  "text-",
                  "text-"
                )} font-medium cursor-pointer transition-colors duration-300`}
              >
                요금제
              </a>
            </li>
            {/*<li><a href="/review" className={`${textPrimary} hover:${primaryColor.replace('text-', 'text-')} font-medium cursor-pointer transition-colors duration-300`}>리뷰</a></li>*/}

            {/* Theme Toggle - Desktop */}
            <li>
              <button
                className={`w-10 h-10 rounded-full border-2 ${
                  theme === "dark"
                    ? "border-cyan-400/20 hover:border-cyan-400 hover:text-cyan-400"
                    : "border-blue-600/20 hover:border-blue-600 text-yellow-400 hover:text-blue-600"
                } ${textPrimary} transition-all duration-300 hover:rotate-180 flex items-center justify-center`}
                onClick={toggleTheme}
              >
                {/* {theme === 'dark' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />} */}
                {theme === "dark" ? "🌙" : "☀️"}
              </button>
            </li>
          </ul>

          {/* Mobile Menu Button only (no theme toggle here) */}
          <div className="lg:hidden flex items-center">
            {/* Hamburger Menu */}
            <button
              className="w-10 h-10 flex flex-col justify-center items-center space-y-1 focus:outline-none"
              onClick={toggleMobileMenu}
            >
              <span
                className={`w-6 h-0.5 ${
                  theme === "dark" ? "bg-white" : "bg-slate-700"
                } transition-all duration-300 ${
                  isMobileMenuOpen ? "rotate-45 translate-y-1.5" : ""
                }`}
              ></span>
              <span
                className={`w-6 h-0.5 ${
                  theme === "dark" ? "bg-white" : "bg-slate-700"
                } transition-all duration-300 ${
                  isMobileMenuOpen ? "opacity-0" : ""
                }`}
              ></span>
              <span
                className={`w-6 h-0.5 ${
                  theme === "dark" ? "bg-white" : "bg-slate-700"
                } transition-all duration-300 ${
                  isMobileMenuOpen ? "-rotate-45 -translate-y-1.5" : ""
                }`}
              ></span>
            </button>
          </div>

          {/* CTA Button - Desktop */}
          <button
            className={`hidden lg:block ${
              theme === "dark"
                ? "bg-gradient-to-r from-cyan-400 to-emerald-400 text-slate-900 hover:shadow-cyan-400/30"
                : "bg-gradient-to-r from-blue-600 to-emerald-600 text-white hover:shadow-blue-600/30"
            } px-6 py-3 rounded-full font-bold hover:transform hover:-translate-y-1 hover:shadow-lg transition-all duration-300`}
            onClick={() => navigate("/download")}
          >
            다운로드
          </button>
        </nav>

        {/* Mobile Menu Overlay */}
        <div
          className={`lg:hidden fixed h-screen inset-0 bg-black/50 backdrop-blur-sm z-40 transition-all duration-300 ${
            isMobileMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"
          }`}
          onClick={toggleMobileMenu}
        ></div>

        {/* Mobile Sidebar Menu */}
        <div
          className={`lg:hidden fixed top-0 right-0 h-screen w-80 max-w-[80vw] ${
            theme === "dark" ? "bg-slate-900/95" : "bg-white/95"
          } backdrop-blur-lg border-l ${
            theme === "dark" ? "border-cyan-400/20" : "border-blue-600/20"
          } z-50 transform transition-transform duration-300 ease-in-out ${
            isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          {/* Mobile Menu Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200/20">
            <div
              className={`flex items-center text-xl font-bold ${primaryColor}`}
            >
              <a
                href="/"
                className={`${textPrimary} hover:${primaryColor.replace(
                  "text-",
                  "text-"
                )} text-sm font-medium cursor-pointer transition-colors duration-300`}
              >
                Home
              </a>
            </div>
            <button
              className="w-8 h-8 flex items-center justify-center focus:outline-none"
              onClick={toggleMobileMenu}
            >
              <span
                className={`w-6 h-0.5 ${
                  theme === "dark" ? "bg-white" : "bg-slate-700"
                } transition-all duration-300 rotate-45 absolute`}
              ></span>
              <span
                className={`w-6 h-0.5 ${
                  theme === "dark" ? "bg-white" : "bg-slate-700"
                } transition-all duration-300 -rotate-45 absolute`}
              ></span>
            </button>
          </div>

          {/* Mobile Menu Content */}
          <div className={`flex flex-col h-[calc(100vh-80px)]`}>
            <ul className="px-6 py-8 space-y-6 flex-1">
              <li>
                <a
                  href="/about"
                  className={`block ${textPrimary} hover:${primaryColor.replace(
                    "text-",
                    "text-"
                  )} font-medium cursor-pointer transition-colors duration-300 py-3 text-lg border-b border-gray-200/10`}
                >
                  회사소개
                </a>
              </li>
              <li>
                <a
                  href="/doc"
                  className={`block ${textPrimary} hover:${primaryColor.replace(
                    "text-",
                    "text-"
                  )} font-medium cursor-pointer transition-colors duration-300 py-3 text-lg border-b border-gray-200/10`}
                >
                  API 연동가이드
                </a>
              </li>
              <li>
                <a
                  href="/doc"
                  className={`block ${textPrimary} hover:${primaryColor.replace(
                    "text-",
                    "text-"
                  )} font-medium cursor-pointer transition-colors duration-300 py-3 text-lg border-b border-gray-200/10`}
                >
                  기능소개
                </a>
              </li>
              <li>
                <a
                  href="/faq"
                  className={`block ${textPrimary} hover:${primaryColor.replace(
                    "text-",
                    "text-"
                  )} font-medium cursor-pointer transition-colors duration-300 py-3 text-lg border-b border-gray-200/10`}
                >
                  자주묻는질문(FAQ)
                </a>
              </li>
              <li>
                <a
                  href="/pricing"
                  className={`block ${textPrimary} hover:${primaryColor.replace(
                    "text-",
                    "text-"
                  )} font-medium cursor-pointer transition-colors duration-300 py-3 text-lg border-b border-gray-200/10`}
                >
                  요금제
                </a>
              </li>
            </ul>

            {/* Mobile Menu Footer */}
            <div className="px-6 pb-8 space-y-4">
              <div className="flex items-center justify-between py-4 border-t border-gray-200/20">
                <span className={`${textPrimary} font-medium`}>테마 설정</span>
                <button
                  className={`w-12 h-12 rounded-full border-2 ${
                    theme === "dark"
                      ? "border-cyan-400/20 hover:border-cyan-400 hover:text-cyan-400"
                      : "border-blue-600/20 hover:border-blue-600 hover:text-blue-600"
                  } ${textPrimary} transition-all duration-300 hover:rotate-180 flex items-center justify-center text-xl`}
                  onClick={toggleTheme}
                >
                  {theme === "dark" ? "🌙" : "☀️"}
                </button>
              </div>

              <button
                className={`w-full ${
                  theme === "dark"
                    ? "bg-gradient-to-r from-cyan-400 to-emerald-400 text-slate-900 hover:shadow-cyan-400/30"
                    : "bg-gradient-to-r from-blue-600 to-emerald-600 text-white hover:shadow-blue-600/30"
                } px-6 py-4 rounded-full font-bold text-lg hover:transform hover:-translate-y-1 hover:shadow-lg transition-all duration-300`}
                onClick={() => navigate("/download")}
              >
                다운로드
              </button>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
