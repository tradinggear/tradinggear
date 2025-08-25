import type { MetaFunction } from "@remix-run/node";
import { useState, useEffect } from 'react';
import { useNavigate } from '@remix-run/react';
import { useThemeStore } from '../stores/themeStore';
import Header from  '@/components/Header'
import Footer from  '@/components/Footer'

export const meta: MetaFunction = () => {
  return [
    { title: "Forgot Password - TRADING GEAR" },
    { name: "description", content: "Reset your AI trading account password" },
  ];
};

export default function ForgotPassword() {
  const navigate = useNavigate();
  const { theme, isClient, initializeTheme } = useThemeStore();
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    initializeTheme();
  }, [initializeTheme]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      console.log('Password reset email sent to:', email);
      setIsSubmitted(true);
      setIsLoading(false);
    }, 2000);
  };

  const handleBackToLogin = () => {
    navigate('/login');
  };

  const handleResendEmail = () => {
    setIsLoading(true);
    // Simulate resend API call
    setTimeout(() => {
      console.log('Password reset email resent to:', email);
      setIsLoading(false);
    }, 2000);
  };

  const themeClasses = theme === 'dark' 
    ? 'bg-gradient-to-br from-slate-900 to-slate-800'
    : 'bg-gradient-to-br from-slate-100 to-slate-200';

  const cardClasses = theme === 'dark'
    ? 'bg-slate-800 border-slate-700'
    : 'bg-white border-slate-300';

  const inputClasses = theme === 'dark'
    ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400 focus:border-cyan-400 focus:ring-cyan-400'
    : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-500 focus:border-blue-500 focus:ring-blue-500';

  const textPrimary = theme === 'dark' ? 'text-white' : 'text-slate-900';
  const textSecondary = theme === 'dark' ? 'text-slate-400' : 'text-slate-600';
  const linkColor = theme === 'dark' ? 'text-cyan-400 hover:text-cyan-300' : 'text-blue-600 hover:text-blue-700';
  const buttonPrimary = theme === 'dark' 
    ? 'bg-gradient-to-r from-cyan-400 to-emerald-400 text-slate-900 hover:from-cyan-500 hover:to-emerald-500' 
    : 'bg-gradient-to-r from-blue-600 to-emerald-600 text-white hover:from-blue-700 hover:to-emerald-700';
  
  const buttonSecondary = theme === 'dark'
    ? 'border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-slate-900'
    : 'border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white';

  return (
    <div className={`min-h-screen transition-all duration-300 ${themeClasses}`}>
        {/* Header */}
        <Header/>
    <div className={`min-h-screen flex items-center justify-center px-4 py-12 transition-all duration-300 ${themeClasses}`}>
      <div className={`w-full max-w-md space-y-8 p-8 rounded-2xl shadow-2xl border transition-all duration-300 ${cardClasses}`}>
        
        {!isSubmitted ? (
          <>
            {/* Header */}
            <div className="text-center">
              <div className={`mx-auto w-16 h-16 ${theme === 'dark' ? 'bg-cyan-400/20' : 'bg-blue-600/20'} rounded-full flex items-center justify-center mb-4`}>
                <svg className={`w-8 h-8 ${theme === 'dark' ? 'text-cyan-400' : 'text-blue-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m0 0a2 2 0 012 2 2 2 0 01-2 2m-2-2H9m6 0V9a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2h6a2 2 0 002-2v-1" />
                </svg>
              </div>
              <h2 className={`text-3xl font-bold ${textPrimary}`}>Forgot password?</h2>
              <p className={`mt-4 text-sm ${textSecondary} leading-relaxed`}>
                No worries, we'll send you reset instructions to your email address.
              </p>
            </div>

            {/* Form */}
            <form className="space-y-6" onSubmit={handleSubmit}>
              {/* Email */}
              <div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full px-4 py-3 rounded-lg border transition-all duration-200 focus:ring-2 focus:ring-opacity-50 ${inputClasses}`}
                  placeholder="Enter your email"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-3 px-4 rounded-lg font-semibold text-lg transition-all duration-200 transform hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none ${buttonPrimary}`}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending...
                  </div>
                ) : (
                  'Reset password'
                )}
              </button>
            </form>

            {/* Back to Login */}
            <div className="text-center">
              <button
                onClick={handleBackToLogin}
                className={`inline-flex items-center text-sm ${linkColor} transition-colors`}
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to log in
              </button>
            </div>
          </>
        ) : (
          <>
            {/* Success State */}
            <div className="text-center">
              <div className={`mx-auto w-16 h-16 ${theme === 'dark' ? 'bg-emerald-400/20' : 'bg-emerald-600/20'} rounded-full flex items-center justify-center mb-4`}>
                <svg className={`w-8 h-8 ${theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h2 className={`text-3xl font-bold ${textPrimary}`}>Check your email</h2>
              <p className={`mt-4 text-sm ${textSecondary} leading-relaxed`}>
                We sent a password reset link to{' '}
                <span className={`font-medium ${textPrimary}`}>{email}</span>
              </p>
              <p className={`mt-2 text-xs ${textSecondary}`}>
                Didn't receive the email? Check your spam folder or try again.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              <button
                onClick={() => window.open('mailto:', '_blank')}
                className={`w-full py-3 px-4 rounded-lg font-semibold text-lg transition-all duration-200 transform hover:scale-105 hover:shadow-lg ${buttonPrimary}`}
              >
                Open email app
              </button>
              
              <button
                onClick={handleResendEmail}
                disabled={isLoading}
                className={`w-full py-3 px-4 rounded-lg border-2 font-semibold text-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none ${buttonSecondary}`}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending...
                  </div>
                ) : (
                  'Resend email'
                )}
              </button>
            </div>

            {/* Back to Login */}
            <div className="text-center pt-4">
              <button
                onClick={handleBackToLogin}
                className={`inline-flex items-center text-sm ${linkColor} transition-colors`}
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to log in
              </button>
            </div>
          </>
        )}
      </div>
    </div>
    {/* Footer */}
          <Footer onLinkClick={(linkName) => linkName} />
        </div>
  );
}