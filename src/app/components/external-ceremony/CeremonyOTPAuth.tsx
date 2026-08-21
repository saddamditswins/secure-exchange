import { useState, useEffect } from 'react';
import { useExternalTheme } from '../../../contexts/ExternalThemeContext';
import { OtpInput } from '../OtpInput';
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
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [resendTimer, setResendTimer] = useState(60);
  const [isResending, setIsResending] = useState(false);

  useEffect(() => {
    // Start countdown timer
    const timer = setInterval(() => {
      setResendTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleVerify = (fullCode: string) => {
    // ponytail: demo stub -- only the fixed code 123456 is accepted. Replace
    // with a server call that validates the code and returns a session.
    if (fullCode === '123456') {
      onVerify(fullCode);
    } else {
      setError('Invalid verification code. Please try again.');
      setCode('');
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
      setCode('');
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
            <h1 className="text-2xl sm:text-3xl font-bold" style={{ color: tokens.text.primary }}>
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
            <OtpInput
              value={code}
              onChange={(next) => { setCode(next); setError(''); }}
              onComplete={handleVerify}
              hasError={Boolean(error)}
              boxClassName="w-10 h-12 text-xl sm:w-12 sm:h-14 sm:text-2xl rounded-xl"
            />

            {/* Error Message */}
            {error && (
              <div
                className="rounded-lg p-3 flex items-center gap-2"
                style={{ backgroundColor: `${tokens.status.warning}15` }}
              >
                <AlertCircle className="h-4 w-4" style={{ color: tokens.status.warning }} />
                <p className="text-sm" role="alert" style={{ color: tokens.status.warning }}>
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
