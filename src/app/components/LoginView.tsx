import { useState } from 'react';

interface LoginViewProps {
  onLogin: () => void;
  onBack: () => void;
}

type LoginState = 'login' | 'verify-otp';

export function LoginView({ onLogin, onBack }: LoginViewProps) {
  const [loginState, setLoginState] = useState<LoginState>('login');
  const [email, setEmail] = useState('demo@example.com');
  const [password, setPassword] = useState('demo1234');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate login - move to OTP verification
    setLoginState('verify-otp');
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate OTP verification - complete login
    onLogin();
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;
    if (value && !/^\d$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  return (
    <div className="min-h-screen bg-[#153240] flex flex-col text-[#FFFFFF]">
      {/* Back Button */}
      <div className="absolute top-6 left-6">
        <button
          onClick={() => {
            if (loginState === 'verify-otp') {
              setLoginState('login');
            } else {
              // In production, this would navigate back to role selector or previous page
              onBack();
            }
          }}
          className="flex items-center gap-2 px-3 py-1.5 bg-[#1E3A4A] border border-[#243F4D] rounded text-sm text-neutral-300 hover:text-[#FFFFFF] hover:border-emerald-500/30 transition-colors cursor-pointer"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          <span>Back</span>
        </button>
      </div>

      {/* Environment Badge */}
      <div className="absolute top-6 right-6">
        <div className="px-3 py-1.5 bg-emerald-900/30 border border-emerald-500/30 rounded text-xs text-emerald-400">
          Production Environment
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          {/* Logo and Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-500 rounded-lg mb-6 shadow-lg shadow-emerald-900/20">
              <svg
                className="w-9 h-9 text-neutral-900"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-semibold text-[#FFFFFF] mb-2">Secure Exchange</h1>
            <p className="text-neutral-400">
              {loginState === 'login' 
                ? 'Sign in to your account' 
                : 'Verify your identity'}
            </p>
          </div>

          {/* Login Form */}
          {loginState === 'login' && (
            <div className="bg-[#1E3A4A] border border-[#243F4D] rounded-lg p-8 shadow-xl">
              <form onSubmit={handleSignIn} className="space-y-6">
                <div>
                  <label htmlFor="email" className="block text-sm text-neutral-300 mb-2">
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                    className="w-full px-4 py-2.5 bg-[#0F2936] border border-[#243F4D] rounded-lg text-[#FFFFFF] placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent [color-scheme:dark]"
                    placeholder="you@company.com"
                  />
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm text-neutral-300 mb-2">
                    Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                    className="w-full px-4 py-2.5 bg-[#0F2936] border border-[#243F4D] rounded-lg text-[#FFFFFF] placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent [color-scheme:dark]"
                    placeholder="••••••••"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full px-4 py-2.5 bg-emerald-500 text-neutral-900 font-medium rounded-lg hover:bg-emerald-600 transition-colors cursor-pointer shadow-lg shadow-emerald-900/20"
                >
                  Sign In
                </button>
              </form>

              <div className="mt-6 pt-6 border-t border-[#243F4D]">
                <div className="flex items-start gap-3 text-sm text-neutral-400">
                  <svg
                    className="w-5 h-5 text-neutral-500 flex-shrink-0 mt-0.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                  <p>
                    Two-factor authentication is required for all accounts. You'll receive a verification code after signing in.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* OTP Verification Form */}
          {loginState === 'verify-otp' && (
            <div className="bg-[#1E3A4A] border border-[#243F4D] rounded-lg p-8 shadow-xl">
              <form onSubmit={handleVerifyOtp} className="space-y-6">
                <div>
                  <label className="block text-sm text-neutral-300 mb-4 text-center">
                    Enter Verification Code
                  </label>
                  <div className="flex gap-2 md:gap-3 justify-center mb-3">
                    {otp.map((digit, index) => (
                      <input
                        key={index}
                        id={`otp-${index}`}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(index, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(index, e)}
                        className="w-10 h-10 md:w-12 md:h-12 text-center bg-[#0F2936] border border-[#243F4D] rounded-lg text-[#FFFFFF] focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-lg font-medium"
                      />
                    ))}
                  </div>
                  <p className="text-sm text-neutral-400 text-center">
                    We sent a verification code to your email
                  </p>
                </div>

                <button
                  type="submit"
                  className="w-full px-4 py-2.5 bg-emerald-500 text-neutral-900 font-medium rounded-lg hover:bg-emerald-600 transition-colors cursor-pointer shadow-lg shadow-emerald-900/20"
                >
                  Verify & Continue
                </button>

                <button
                  type="button"
                  onClick={() => setLoginState('login')}
                  className="w-full px-4 py-2.5 text-neutral-400 hover:text-[#FFFFFF] transition-colors cursor-pointer"
                >
                  Back to Sign In
                </button>
              </form>

              <div className="mt-6 pt-6 border-t border-[#243F4D]">
                <div className="text-center">
                  <button className="text-sm text-neutral-400 hover:text-[#FFFFFF] transition-colors cursor-pointer">
                    Didn't receive a code? Resend
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}