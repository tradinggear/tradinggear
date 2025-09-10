import { useState, useEffect } from "react";
import Header from "@/components/Header";
import type { MetaFunction } from "@remix-run/node";
import { useThemeStore } from "@/stores/themeStore";

export const meta: MetaFunction = () => {
  return [
    { title: "바이낸스 API 가이드 - TRADING GEAR" },
    { name: "doc", content: "바이낸스 API 발급 및 연동 가이드" },
  ];
};

export default function BinanceGuidePage() {
  const { theme, initializeTheme } = useThemeStore();
  const [modalImg, setModalImg] = useState<string | null>(null);

  useEffect(() => {
    initializeTheme();
  }, [initializeTheme]);

  const textPrimary = theme === "dark" ? "text-slate-100" : "text-slate-900";
  const textSecondary = theme === "dark" ? "text-slate-300" : "text-slate-600";

  const steps = [
    {
      img: "/doc/binance/image1.png",
      title: "1. binance.com 접속 및 로그인",
      desc: "브라우저에서 binance.com에 접속합니다. 우측 상단 [Log In] 버튼을 클릭 후 계정에 로그인합니다.",
    },
    {
      img: "/doc/binance/image2.png",

      title: "2. API Management 이동",
      desc: "메인 메뉴에서 [Account] → [API Management]를 클릭합니다.",
    },
    {
      img: "/doc/binance/image3.png",

      title: "3. Create API",
      desc: "[Create API] 버튼을 클릭합니다.",
    },
    {
      img: "/doc/binance/image4.png",

      title: "4. System generated",
      desc: "[System generated] 옵션을 선택합니다.",
    },
    {
      img: "/doc/binance/image5.png",

      title: "5. Next 선택",
      desc: "Next 버튼을 클릭합니다.",
    },
    {
      img: "/doc/binance/image6.png",

      title: "6. Label API Key to proceed에서 Label 입력",
      desc: "Label API Key to proceed 단계에서 라벨을 입력합니다.",
    },
    {
      img: "/doc/binance/image7.png",

      title: "7. Additional Verification Method Required",
      desc: "Additional Verification 단계에서 Passkeys 선택 후 Enable를 클릭합니다.",
    },
    {
      img: "/doc/binance/image8.png",

      title: "8. PassKey 추가",
      desc: "[Add PassKey] 버튼을 클릭하세요.",
    },
    {
      img: "/doc/binance/image9.png",

      title: "9. 이메일 코드 입력",
      desc: "가입 시 등록한 이메일로 전송된 인증 코드를 입력합니다.",
    },
    {
      img: "/doc/binance/image10.png",

      title: "10. 휴대폰 인증",
      desc: "등록된 휴대폰 번호로 전송된 인증 코드를 입력합니다.",
    },
    {
      img: "/doc/binance/image11.png",

      title: "11. PassKeys 생성 확인",
      desc: "PassKeys 정상 생성 여부를 확인합니다.",
    },
    {
      img: "/doc/binance/image12.png",

      title: "12. 다시 [Account] 이동",
      desc: "메인메뉴로 이동 후 [Account] 로 이동해주세요.",
    },
    {
      img: "/doc/binance/image13.png",

      title: "13. API Management",
      desc: "API Management 를 클릭하세요.",
    },
    {
      img: "/doc/binance/image14.png",

      title: "14. 항목 동의",
      desc: "By checking this box, all existing API Key(s) on your master account and sub-accounts will be subject to Default Security Controls 항목의 체크박스를 클릭하여 체크합니다.",
    },
    {
      img: "/doc/binance/image15.png",

      title: "15. Create API",
      desc: "Create API를 선택하세요.",
    },
    {
      img: "/doc/binance/image16.png",

      title: "16. System generated",
      desc: "System generated를 클릭한 후 Next를 클릭합니다.",
    },
    {
      img: "/doc/binance/image17.png",

      title: "17. Label 입력",
      desc: "Label을 입력해주세요.",
    },
    {
      img: "/doc/binance/image18.png",

      title: "18. 키 생성 확인",
      desc: "키생성을 확인한 후, API Key / Secret Key를 복사해놓고 트레이딩기어 사이트로 이동 후 로그인합니다.",
    },
    {
      img: "/doc/binance/image19.png",

      title: "19. 계정관리",
      desc: "트레이딩기어의 계정관리로 이동해주세요.",
    },
    {
      img: "/doc/binance/image19.png",

      title: "20. API Key 입력",
      desc: "사진과 같이, 표시한 부분을 입력한 뒤 [계정 수정] 버튼을 클릭합니다.",
    },
  ];

  return (
    <div className={`min-h-screen transition-all duration-300 `}>
      <main className="max-w-5xl mx-auto px-4 lg:px-8 py-20 space-y-16">
        {steps.map((step, idx) => (
          <section
            key={idx}
            className="flex flex-col items-center gap-6 text-center"
          >
            {/* 이미지 */}
            <img
              src={step.img}
              alt={step.title}
              onClick={() => setModalImg(step.img)}
              className={`w-full max-w-3xl rounded-xl border cursor-zoom-in transition-all duration-300
                dark:shadow-lg dark:shadow-cyan-400/10 dark:border-slate-700
                shadow-lg border-slate-200`}
            />

            {/* 설명 */}
            <div className="space-y-2">
              <h2 className={`text-2xl font-bold ${textPrimary}`}>
                {step.title}
              </h2>
              <p className={`text-lg leading-relaxed ${textSecondary}`}>
                {step.desc}
              </p>
            </div>
          </section>
        ))}

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
      </main>
    </div>
  );
}
