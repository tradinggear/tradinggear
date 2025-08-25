import React, { useState } from 'react';
import { X } from 'lucide-react';

export default function TermsWarningPopup() {
  const [isPopupOpen, setIsPopupOpen] = useState(true);

  const closePopup = () => setIsPopupOpen(false);

  const buttonPrimary = 'bg-gradient-to-r from-blue-600 to-emerald-600 text-white hover:from-blue-700 hover:to-emerald-700';


  return (
    <>
    {/* 팝업 오버레이 */}
    {isPopupOpen && (
    <div className="min-h-screen flex items-center justify-center p-4 fixed w-full z-[999]">
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          {/* 팝업 컨테이너 */}
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 transform transition-all duration-300 scale-100">
            {/* 헤더 */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <span className="text-2xl mr-2">📢</span>
                <h3 className="text-lg font-semibold text-gray-900">
                회원가입 전 꼭 확인해주세요!
                </h3>
              </div>
              <button
                onClick={closePopup}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

             {/* 내용 */}
            <div className="p-8">
              <div className="text-center">
                <div className="bg-white mb-4 shadow-sm">
                  
                  <div className="text-left space-y-4 text-md text-gray-900 leading-relaxed">
                    <p className="font-medium">
                      고객님의 소중한 정보를 안전하게 보호하고, 원활한 서비스 이용을 위해 <strong className="text-blue-700 font-bold">이용약관</strong>과 <strong className="text-blue-700 font-bold">개인정보처리방침</strong>을 반드시 확인해주시기 바랍니다.
                    </p>
                    <p>
                      회원가입을 진행하시면 관련 약관에 동의한 것으로 간주됩니다.
                    </p>
                    <p className="font-bold text-red-700 bg-red-50 border border-red-200 px-3 py-2 rounded-md">
                      내용을 충분히 읽고 동의 여부를 신중히 결정해 주세요.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* 버튼 영역 */}
            <div className="px-8 pb-6">
              <div className="flex space-x-3">
                <button
                  onClick={closePopup}
                  className={`w-full py-3 px-4 rounded-lg font-semibold text-lg transition-all duration-200 transform hover:scale-105 hover:shadow-lg ${buttonPrimary}`}
                >
                  <span>확인</span>
                </button>
              </div>
            </div>
          </div>
        </div>
        </div>
        )}
    </>
  );
}