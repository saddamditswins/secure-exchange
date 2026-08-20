import { useExternalTheme } from '../../../contexts/ExternalThemeContext';
import { ExternalCard } from './ExternalCard';
import { Building2, FileText } from 'lucide-react';

interface WelcomeScreenProps {
  organizationName: string;
  organizationLogo?: string;
  exchangeTitle: string;
  flowType: 'secure-share' | 'e-sign';
  onContinue: () => void;
}

export function WelcomeScreen({
  organizationName,
  organizationLogo,
  exchangeTitle,
  flowType,
  onContinue,
}: WelcomeScreenProps) {
  const { tokens } = useExternalTheme();

  return (
    <ExternalCard className="text-center">
      <div className="flex flex-col items-center gap-6">
        {/* Organization Logo */}
        <div className="flex flex-col items-center gap-3">
          {organizationLogo ? (
            <img src={organizationLogo} alt={organizationName} className="h-16 w-16 rounded-lg" />
          ) : (
            <div
              className="h-16 w-16 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: tokens.brand.primary }}
            >
              <Building2 className="h-8 w-8" style={{ color: tokens.text.primary }} />
            </div>
          )}
          <h2 className="text-xl font-semibold" style={{ color: tokens.text.primary }}>
            {organizationName}
          </h2>
        </div>

        {/* Exchange Icon */}
        <div
          className="h-20 w-20 rounded-full flex items-center justify-center"
          style={{
            backgroundColor: `${tokens.brand.primary}20`,
          }}
        >
          <FileText className="h-10 w-10" style={{ color: tokens.brand.primary }} />
        </div>

        {/* Exchange Title */}
        <div className="space-y-2">
          <h1 className="text-2xl md:text-3xl font-bold" style={{ color: tokens.text.primary }}>
            {exchangeTitle}
          </h1>
          <p className="text-base md:text-lg" style={{ color: tokens.text.secondary }}>
            {flowType === 'secure-share'
              ? "You've been invited to securely review and access documents."
              : "You've been invited to securely review and sign documents."}
          </p>
        </div>

        {/* Description */}
        <p className="text-sm max-w-md" style={{ color: tokens.text.muted }}>
          This is a secure document exchange powered by Secure Exchange. All documents are
          encrypted and access is monitored for compliance.
        </p>

        {/* Continue Button */}
        <button
          onClick={onContinue}
          className="mt-4 px-8 py-3 rounded-lg font-medium text-base transition-all cursor-pointer"
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
          Continue
        </button>
      </div>
    </ExternalCard>
  );
}
