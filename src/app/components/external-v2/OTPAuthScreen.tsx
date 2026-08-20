import { useState, useEffect } from 'react';
import { useExternalTheme } from '../../../contexts/ExternalThemeContext';
import { ExternalCard } from './ExternalCard';
import { OtpInput } from '../OtpInput';
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
  const [otp, setOtp] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [error, setError] = useState('');
  const [isResending, setIsResending] = useState(false);

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

  const isComplete = otp.length === 6;

  const handleVerify = (code: string) => {
    if (timeLeft <= 0) {
      setError('This code has expired. Request a new one.');
      setOtp('');
      return;
    }
    if (code.length !== 6) {
      setError('Enter all 6 digits.');
      return;
    }
    setError('');
    setIsVerifying(true);
    // ponytail: demo stub -- accepts any 6-digit code. Replace with a server
    // call that validates the code and returns a session before onVerified().
    setTimeout(() => {
      setIsVerifying(false);
      onVerified();
    }, 500);
  };

  const handleResend = () => {
    setIsResending(true);
    setTimeout(() => {
      setTimeLeft(60);
      setIsResending(false);
      setOtp('');
      setError('');
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
        <OtpInput
          value={otp}
          onChange={(code) => { setOtp(code); setError(''); }}
          onComplete={handleVerify}
          disabled={isVerifying || timeLeft <= 0}
          hasError={Boolean(error)}
        />

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
            <span className="text-sm" role="alert">{error}</span>
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
          type="button"
          onClick={() => handleVerify(otp)}
          disabled={!isComplete || isVerifying}
          className="w-full py-3 rounded-lg font-medium transition-all cursor-pointer"
          style={{
            backgroundColor: tokens.brand.primary,
            color: tokens.text.primary,
            opacity: !isComplete || isVerifying ? tokens.interaction.disabled.opacity : '1',
          }}
          onMouseEnter={(e) => {
            if (isComplete && !isVerifying) {
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
