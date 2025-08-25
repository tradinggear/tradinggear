
interface DashFooterProps {
    theme: string;
  }
  
  const DashFooter = ({ theme }: DashFooterProps) => {
    return (
      <footer className={`${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-t`}>
        <div className="px-6 py-4">
          <div className="flex flex-wrap justify-center space-x-6 text-sm">
            <a href="/terms" className={`${theme === 'dark' ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-900'} transition-colors`}>
              이용약관
            </a>
            <a href="/privacy" className={`${theme === 'dark' ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-900'} transition-colors`}>
              개인정보처리방침
            </a>
            <a href="/about" className={`${theme === 'dark' ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-900'} transition-colors`}>
              트레이딩기어 소개
            </a>
            <a href="/support" className={`${theme === 'dark' ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-900'} transition-colors`}>
              고객센터
            </a>
            <a href="javascript:void(0)" className={`${theme === 'dark' ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-900'} transition-colors`}>
              버전정보
            </a>
          </div>
          <div className={`text-center mt-2 text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
            © 2024 트레이딩기어. All rights reserved. v2.1.0
          </div>
        </div>
      </footer>
    );
  };
  
  export default DashFooter;