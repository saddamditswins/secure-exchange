import { useState, useRef, useEffect } from 'react';
import { useExternalTheme } from '../../../contexts/ExternalThemeContext';
import { Mail, Smartphone, AlertCircle, Shield, ArrowLeft } from 'lucide-react';

interface CeremonyOTPAuthProps {
  method: 'email' | 'sms';
  recipient: string;
  onVerify: (code: string) => void;
  onBack?: () => void;
}

export function CeremonyOTPAuth({
  method,
  recipient,
  onVerify,
  onBack,
}: CeremonyOTPAuthProps) {
  const { tokens } = useExternalTheme();
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [resendTimer, setResendTimer] = useState(60);
  const [isResending, setIsResending] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    // Focus first input on mount
    inputRefs.current[0]?.focus();

    // Start countdown timer
    const timer = setInterval(() => {
      setResendTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value.slice(-1);
    setCode(newCode);
    setError('');

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-verify when all digits entered
    if (newCode.every((digit) => digit !== '') && index === 5) {
      setTimeout(() => {
        handleVerify(newCode.join(''));
      }, 100);
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    const newCode = [...code];

    pastedData.split('').forEach((digit, i) => {
      if (i < 6) newCode[i] = digit;
    });

    setCode(newCode);
    setError('');

    // Focus last filled input or verify
    const lastIndex = Math.min(pastedData.length, 5);
    inputRefs.current[lastIndex]?.focus();

    if (pastedData.length === 6) {
      setTimeout(() => {
        handleVerify(pastedData);
      }, 100);
    }
  };

  const handleVerify = (fullCode: string) => {
    // Simulate verification
    if (fullCode === '123456') {
      onVerify(fullCode);
    } else {
      setError('Invalid verification code. Please try again.');
      setCode(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    }
  };

  const handleResend = () => {
    if (resendTimer > 0 || isResending) return;

    setIsResending(true);
    setError('');

    // Simulate resend
    setTimeout(() => {
      setIsResending(false);
      setResendTimer(60);
      setCode(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    }, 1000);
  };

  return (
    <div className="flex items-center justify-center px-6 py-12">
      <div
        className="w-full max-w-md rounded-3xl p-12"
        style={{
          backgroundColor: tokens.surface.card,
          boxShadow: tokens.shadow.md,
        }}
      >
        <div className="space-y-8">
          {/* Back Button */}
          {onBack && (
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-sm font-medium transition-colors cursor-pointer"
              style={{ color: tokens.text.muted }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = tokens.text.primary;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = tokens.text.muted;
              }}
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </button>
          )}

          {/* Header */}
          <div className="text-center space-y-4">
            <div
              className="inline-flex items-center justify-center h-16 w-16 rounded-2xl"
              style={{ backgroundColor: `${tokens.brand.primary}15` }}
            >
              <Shield className="h-8 w-8" style={{ color: tokens.brand.primary }} />
            </div>
            <h1 className="text-3xl font-bold" style={{ color: tokens.text.primary }}>
              Verify Your Identity
            </h1>
            <div className="space-y-2">
              <p className="text-base" style={{ color: tokens.text.secondary }}>
                We sent a 6-digit code to:
              </p>
              <div className="flex items-center justify-center gap-2">
                {method === 'email' ? (
                  <Mail className="h-4 w-4" style={{ color: tokens.text.muted }} />
                ) : (
                  <Smartphone className="h-4 w-4" style={{ color: tokens.text.muted }} />
                )}
                <p className="font-semibold" style={{ color: tokens.text.primary }}>
                  {recipient}
                </p>
              </div>
            </div>
          </div>

          {/* OTP Input */}
          <div className="space-y-4">
            <div className="flex gap-3 justify-center" onPaste={handlePaste}>
              {code.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-12 h-14 text-center text-2xl font-bold rounded-xl border-2 transition-all"
                  style={{
                    borderColor: error
                      ? tokens.status.warning
                      : digit
                      ? tokens.brand.primary
                      : tokens.border.soft,
                    backgroundColor: tokens.surface.app,
                    color: tokens.text.primary,
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = tokens.brand.primary;
                    e.currentTarget.style.boxShadow = `0 0 0 3px ${tokens.brand.primary}20`;
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = error
                      ? tokens.status.warning
                      : digit
                      ? tokens.brand.primary
                      : tokens.border.soft;
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                />
              ))}
            </div>

            {/* Error Message */}
            {error && (
              <div
                className="rounded-lg p-3 flex items-center gap-2"
                style={{ backgroundColor: `${tokens.status.warning}15` }}
              >
                <AlertCircle className="h-4 w-4" style={{ color: tokens.status.warning }} />
                <p className="text-sm" style={{ color: tokens.status.warning }}>
                  {error}
                </p>
              </div>
            )}
          </div>

          {/* Resend Link */}
          <div className="text-center">
            {resendTimer > 0 ? (
              <p className="text-sm" style={{ color: tokens.text.muted }}>
                Didn't receive the code? Resend in{' '}
                <span className="font-semibold">{resendTimer}s</span>
              </p>
            ) : (
              <button
                onClick={handleResend}
                disabled={isResending}
                className="text-sm font-semibold underline cursor-pointer transition-colors"
                style={{
                  color: isResending ? tokens.text.muted : tokens.brand.primary,
                  opacity: isResending ? tokens.interaction.disabled.opacity : '1',
                }}
              >
                {isResending ? 'Sending...' : 'Resend Code'}
              </button>
            )}
          </div>

          {/* Help Text */}
          <p className="text-center text-xs" style={{ color: tokens.text.muted }}>
            Enter the 6-digit code to continue. Check your spam folder if you don't see it.
          </p>
        </div>
      </div>
    </div>
  );
}
