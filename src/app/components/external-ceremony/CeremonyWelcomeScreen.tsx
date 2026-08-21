import { useExternalTheme } from '../../../contexts/ExternalThemeContext';
import { FileText, User, Shield } from 'lucide-react';

interface CeremonyDocument {
  id: string;
  name: string;
  pageCount: number;
}

interface CeremonyWelcomeScreenProps {
  exchangeName: string;
  participantName: string;
  documents: CeremonyDocument[];
  onStart: () => void;
}

export function CeremonyWelcomeScreen({
  exchangeName,
  participantName,
  documents,
  onStart,
}: CeremonyWelcomeScreenProps) {
  const { tokens } = useExternalTheme();

  return (
    <div className="flex items-center justify-center px-6 py-12">
      <div
        className="w-full max-w-2xl rounded-3xl p-12"
        style={{
          backgroundColor: tokens.surface.card,
          boxShadow: tokens.shadow.md,
        }}
      >
        <div className="space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <div
              className="inline-flex items-center justify-center h-16 w-16 rounded-2xl"
              style={{ backgroundColor: `${tokens.brand.primary}15` }}
            >
              <FileText className="h-8 w-8" style={{ color: tokens.brand.primary }} />
            </div>
            <h1
              className="text-2xl sm:text-3xl font-bold"
              style={{ color: tokens.text.primary }}
            >
              You're invited to sign documents
            </h1>
            <p className="text-lg" style={{ color: tokens.text.secondary }}>
              {exchangeName}
            </p>
          </div>

          {/* Trust Message */}
          <div
            className="rounded-xl p-4 flex items-start gap-3"
            style={{ backgroundColor: `${tokens.brand.primary}10` }}
          >
            <Shield className="h-5 w-5 mt-0.5" style={{ color: tokens.brand.primary }} />
            <div>
              <p className="text-sm font-medium" style={{ color: tokens.text.primary }}>
                Secure Electronic Signature
              </p>
              <p className="text-xs mt-1" style={{ color: tokens.text.secondary }}>
                Your signature will be encrypted and legally binding. This process is safe and compliant with electronic signature laws.
              </p>
            </div>
          </div>

          {/* Participant Info */}
          <div
            className="rounded-xl p-4 flex items-center gap-3"
            style={{ backgroundColor: tokens.surface.app }}
          >
            <div
              className="h-10 w-10 rounded-full flex items-center justify-center"
              style={{ backgroundColor: tokens.brand.secondary }}
            >
              <User className="h-5 w-5" style={{ color: tokens.text.inverse }} />
            </div>
            <div>
              <p className="text-xs font-medium" style={{ color: tokens.text.muted }}>
                Signing as
              </p>
              <p className="text-base font-semibold" style={{ color: tokens.text.primary }}>
                {participantName}
              </p>
            </div>
          </div>

          {/* Documents List */}
          <div className="space-y-3">
            <h2 className="text-sm font-semibold" style={{ color: tokens.text.primary }}>
              Documents to Sign ({documents.length})
            </h2>
            <div className="space-y-2">
              {documents.map((doc) => (
                <div
                  key={doc.id}
                  className="rounded-lg p-4 flex items-center gap-3 border"
                  style={{
                    backgroundColor: tokens.surface.app,
                    borderColor: tokens.border.soft,
                  }}
                >
                  <FileText className="h-5 w-5" style={{ color: tokens.text.muted }} />
                  <div className="flex-1">
                    <p className="text-sm font-medium" style={{ color: tokens.text.primary }}>
                      {doc.name}
                    </p>
                    <p className="text-xs" style={{ color: tokens.text.muted }}>
                      {doc.pageCount} {doc.pageCount === 1 ? 'page' : 'pages'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Start Button */}
          <button
            onClick={onStart}
            className="w-full py-4 rounded-xl font-semibold text-lg transition-all cursor-pointer"
            style={{
              backgroundColor: tokens.brand.primary,
              color: tokens.text.inverse,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 10px 20px -10px rgba(16, 185, 129, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            Start Signing
          </button>

          {/* Help Text */}
          <p className="text-center text-xs" style={{ color: tokens.text.muted }}>
            By clicking "Start Signing", you agree to use electronic signatures for this transaction.
          </p>
        </div>
      </div>
    </div>
  );
}
