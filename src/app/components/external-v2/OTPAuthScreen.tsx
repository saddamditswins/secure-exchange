import { useState, useRef, useEffect } from 'react';
import { useExternalTheme } from '../../../contexts/ExternalThemeContext';
import { ExternalCard } from './ExternalCard';
import { Mail, Smartphone, ArrowLeft, AlertCircle } from 'lucide-react';

interface OTPAuthScreenProps {
  mode: 'email' | 'sms';
  recipientEmail?: string;
  recipientPhone?: string;
  onVerified: () => void;
  onBack?: () => void;
}

export function OTPAuthScreen({
  mode,
  recipientEmail,
  recipientPhone,
  onVerified,
  onBack,
}: OTPAuthScreenProps) {
  const { tokens } = useExternalTheme();
  const [step, setStep] = useState<'request' | 'verify'>('request');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timeLeft, setTimeLeft] = useState(60);
  const [error, setError] = useState('');
  const [isResending, setIsResending] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (step === 'verify' && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [step, timeLeft]);

  const handleRequestOTP = () => {
    // Simulate OTP request
    setStep('verify');
    setTimeLeft(60);
    setError('');
  };

  const handleOTPChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-verify when all digits are entered
    if (newOtp.every((digit) => digit !== '') && index === 5) {
      handleVerify(newOtp.join(''));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = (code: string) => {
    // Simulate verification - accept any 6-digit code
    if (code.length === 6) {
      setTimeout(() => {
        onVerified();
      }, 500);
    } else {
      setError('Invalid code. Please try again.');
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    }
  };

  const handleResend = () => {
    setIsResending(true);
    setTimeout(() => {
      setTimeLeft(60);
      setIsResending(false);
      setOtp(['', '', '', '', '', '']);
      setError('');
      inputRefs.current[0]?.focus();
    }, 1000);
  };

  const maskedContact = mode === 'email'
    ? recipientEmail?.replace(/(.{2})(.*)(@.*)/, '$1***$3')
    : recipientPhone?.replace(/(\d{3})(\d{3})(\d{4})/, '($1) ***-$3');

  if (step === 'request') {
    return (
      <ExternalCard>
        <div className="space-y-6">
          {onBack && (
            <button
              onClick={onBack}
              className="flex items-center gap-2 cursor-pointer transition-colors"
              style={{ color: tokens.text.secondary }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = tokens.text.primary;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = tokens.text.secondary;
              }}
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="text-sm">Back</span>
            </button>
          )}

          <div className="text-center space-y-4">
            <div
              className="h-16 w-16 rounded-full flex items-center justify-center mx-auto"
              style={{ backgroundColor: `${tokens.brand.primary}20` }}
            >
              {mode === 'email' ? (
                <Mail className="h-8 w-8" style={{ color: tokens.brand.primary }} />
              ) : (
                <Smartphone className="h-8 w-8" style={{ color: tokens.brand.primary }} />
              )}
            </div>

            <h2 className="text-2xl font-bold" style={{ color: tokens.text.primary }}>
              Verify Your Identity
            </h2>

            <p className="text-base" style={{ color: tokens.text.secondary }}>
              We'll send a verification code to{' '}
              <span className="font-medium" style={{ color: tokens.text.primary }}>
                {maskedContact}
              </span>
            </p>
          </div>

          <button
            onClick={handleRequestOTP}
            className="w-full py-3 rounded-lg font-medium transition-all cursor-pointer"
            style={{
              backgroundColor: tokens.brand.primary,
              color: tokens.text.primary,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-1px)';
              e.currentTarget.style.boxShadow = tokens.shadow.md;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            Send Verification Code
          </button>
        </div>
      </ExternalCard>
    );
  }

  return (
    <ExternalCard>
      <div className="space-y-6">
        <div className="text-center space-y-4">
          <div
            className="h-16 w-16 rounded-full flex items-center justify-center mx-auto"
            style={{ backgroundColor: `${tokens.brand.primary}20` }}
          >
            {mode === 'email' ? (
              <Mail className="h-8 w-8" style={{ color: tokens.brand.primary }} />
            ) : (
              <Smartphone className="h-8 w-8" style={{ color: tokens.brand.primary }} />
            )}
          </div>

          <h2 className="text-2xl font-bold" style={{ color: tokens.text.primary }}>
            Enter Verification Code
          </h2>

          <p className="text-sm" style={{ color: tokens.text.secondary }}>
            We sent a 6-digit code to {maskedContact}
          </p>
        </div>

        {/* OTP Input */}
        <div className="flex gap-2 justify-center">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleOTPChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className="w-12 h-12 text-center text-xl font-semibold rounded-lg border-2 transition-all"
              style={{
                backgroundColor: tokens.surface.elevated,
                borderColor: digit ? tokens.brand.primary : tokens.border.soft,
                color: tokens.text.primary,
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = tokens.interaction.focus.ring;
                e.currentTarget.style.boxShadow = `0 0 0 3px ${tokens.brand.primary}20`;
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = digit ? tokens.brand.primary : tokens.border.soft;
                e.currentTarget.style.boxShadow = 'none';
              }}
            />
          ))}
        </div>

        {/* Error Message */}
        {error && (
          <div
            className="flex items-center gap-2 p-3 rounded-lg"
            style={{
              backgroundColor: `${tokens.status.warning}20`,
              color: tokens.status.warning,
            }}
          >
            <AlertCircle className="h-4 w-4" />
            <span className="text-sm">{error}</span>
          </div>
        )}

        {/* Timer and Resend */}
        <div className="text-center space-y-2">
          {timeLeft > 0 ? (
            <p className="text-sm" style={{ color: tokens.text.muted }}>
              Code expires in <span className="font-medium">{timeLeft}s</span>
            </p>
          ) : (
            <button
              onClick={handleResend}
              disabled={isResending}
              className="text-sm font-medium cursor-pointer transition-colors"
              style={{
                color: tokens.brand.primary,
                opacity: isResending ? tokens.interaction.disabled.opacity : '1',
              }}
              onMouseEnter={(e) => {
                if (!isResending) {
                  e.currentTarget.style.textDecoration = 'underline';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.textDecoration = 'none';
              }}
            >
              {isResending ? 'Sending...' : 'Resend Code'}
            </button>
          )}
        </div>

        {/* Verify Button */}
        <button
          onClick={() => handleVerify(otp.join(''))}
          disabled={otp.some((digit) => !digit)}
          className="w-full py-3 rounded-lg font-medium transition-all cursor-pointer"
          style={{
            backgroundColor: tokens.brand.primary,
            color: tokens.text.primary,
            opacity: otp.some((digit) => !digit) ? tokens.interaction.disabled.opacity : '1',
          }}
          onMouseEnter={(e) => {
            if (!otp.some((digit) => !digit)) {
              e.currentTarget.style.transform = 'translateY(-1px)';
              e.currentTarget.style.boxShadow = tokens.shadow.md;
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          Verify Code
        </button>
      </div>
    </ExternalCard>
  );
}
