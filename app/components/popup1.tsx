import { useState } from 'react';
import { X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function MainEventPopup() {
  const [isPopupOpen, setIsPopupOpen] = useState(true);

  const closePopup = () => setIsPopupOpen(false);
  const navigate = useNavigate();

  return (
    <>
      {/* 팝업 오버레이 */}
      {isPopupOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-[99]">
        {/* 팝업 컨테이너 */}
        <div className="bg-gradient-to-b from-slate-800 to-slate-900 rounded-2xl shadow-2xl max-w-full w-[500px] mx-4 transform transition-all duration-300 scale-100 border-2 border-cyan-400 relative overflow-hidden">
          
          {/* 닫기 버튼 */}
          <button
            onClick={closePopup}
            className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors z-50"
          >
            <X className="w-6 h-6" />
          </button>
          {/*<div style={{ overflowY : "scroll", height : "400px" }}>*/}
          <div className="h-80 overflow-y-scroll scrollbar scrollbar-thumb-gray-400 scrollbar-track-gray-100">
            {/* 헤더 */}
            <div className="text-center pt-8 pb-1 px-6 relative z-10">
              <h1 className="text-xl font-bold text-cyan-400">
                8월 중순 정식 오픈 기념
              </h1>
              <div className="flex items-start justify-center space-x-2 mt-2">
                  <span className="text-2xl">🎉</span>
                  <h2 className="text-3xl font-bold text-yellow-300 mb-3">특별 이벤트</h2>
                  <span className="text-2xl">🎉</span>
              </div>
              <p className="text-gray-300 text-md leading-relaxed">
                [8월 18일 무료체험 알림 메일 발송!]
              </p>              
              <p className="text-gray-300 text-md leading-relaxed">
                8월 18일 정식서비스! 사전예약 파격적인 혜택!
              </p>
              <p className="text-gray-300 text-md leading-relaxed">
                무료체험기간중 취소시 전액환불!
              </p>            
            </div>

            {/* 사전 결제 혜택 */}
            <div className="px-8 my-1 text-xl">
              <div className="px-6 py-3 border-[2px] border-gray-500 rounded-lg">
                <div className="mx-6 mb-3 relative z-10">
                  <div className="flex items-center justify-center mb-3">
                    <span className="text-xl mr-2">🔥</span>
                    <span className="text-orange-300 font-bold text-xl">사전 결제 혜택</span>
                  </div>
                  <div className="space-y-2 text-gray-300 text-xl">
                    <div className="text-center">
                      <span className="text-cyan-300 font-bold">Basic :</span>
                      <span className="text-yellow-300 ml-2 font-medium">10일 무료 체험</span>
                    </div>
                    <div className="text-center">
                      <span className="text-purple-300 font-bold">Pro :</span>
                      <span className="text-yellow-300 ml-2 font-medium">20일 무료 체험</span>
                    </div>
                  </div>
                </div>

                {/* 환불 안내 */}
                {/*
                <div className="mx-6 relative z-10">
                  <div className="flex items-start justify-center">
                    <p className="text-gray-300 text-md leading-relaxed text-center">
                      무료 체험 종료일 이전<br/><strong className="text-green-300">전액 환불 가능!</strong>
                    </p>
                  </div>
                </div>
                */}
              </div>
            </div>

            {/* 마케팅 메시지 */}
            <div className="mx-6 mb-6 text-center relative z-10">
              {/*
              <p className="text-gray-300 font-bold text-md mb-1">
                정식 오픈 전, 혜택을 놓치지 마세요!
              </p>
              <p className="text-gray-300 text-md">
                지금 바로 사전 결제하고 더 많은 체험을 즐기세요!
              </p>
              */}
              <p className="text-gray-300 text-md pt-6">
                <strong className="text-green-300">* </strong>정식 오픈 후 이메일로 알림 발송예정
              </p>
              <br/>
              <p className="text-gray-300 text-md">
                정식 서비스 개시 이전에는 자사 계좌로 입금 받고 있습니다.
              </p>
              <p className="text-gray-300 text-md">
                회원가입 후 입금해주시면 알림 메일 발송해드립니다.
              </p>
              <p className="text-gray-300 text-md">
                기업은행 : 163-119679-04-016
              </p>

            </div>
          </div>
          {/* 참여 버튼 */}
          <div className="px-6 pt-6 pb-8 relative z-10">
            <button
                onClick={() => navigate('/sign-up')}
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-bold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg flex items-center justify-center space-x-2"
            >
              <span className="text-lg">👉</span>
              <span>지금 바로 회원가입 고고씽!</span>
            </button>
          </div>
        </div>
      </div>
      )}
    </>
  );
}