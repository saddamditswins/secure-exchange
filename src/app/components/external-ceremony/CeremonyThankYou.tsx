import { useExternalTheme } from '../../../contexts/ExternalThemeContext';
import { CheckCircle2, Download, FileText, Calendar } from 'lucide-react';

interface CeremonyThankYouProps {
  participantName: string;
  documentsCount: number;
  completionDate: string;
  onClose: () => void;
  isMultiParticipant?: boolean;
}

export function CeremonyThankYou({
  participantName,
  documentsCount,
  completionDate,
  onClose,
  isMultiParticipant = false,
}: CeremonyThankYouProps) {
  const { tokens } = useExternalTheme();

  const handleDownloadAll = () => {
    // Simulate download
    const link = document.createElement('a');
    link.href = 'data:application/pdf;base64,JVBERi0xLjQKJeLjz9MKMSAwIG9iago8PC9UeXBlL0NhdGFsb2cvUGFnZXMgMiAwIFI+PgplbmRvYmoKMiAwIG9iago8PC9UeXBlL1BhZ2VzL0NvdW50IDEvS2lkc1szIDAgUl0+PgplbmRvYmoKMyAwIG9iago8PC9UeXBlL1BhZ2UvTWVkaWFCb3hbMCAwIDYxMiA3OTJdL1BhcmVudCAyIDAgUi9SZXNvdXJjZXM8PD4+Pj4KZW5kb2JqCnhyZWYKMCA0CjAwMDAwMDAwMDAgNjU1MzUgZiAKMDAwMDAwMDAxNSAwMDAwMCBuIAowMDAwMDAwMDY0IDAwMDAwIG4gCjAwMDAwMDAxMjEgMDAwMDAgbiAKdHJhaWxlcgo8PC9TaXplIDQvUm9vdCAxIDAgUj4+CnN0YXJ0eHJlZgoyMDIKJSVFT0Y=';
    link.download = 'signed-documents.pdf';
    link.click();
  };

  return (
    <div className="flex items-center justify-center px-6 py-12">
      <div
        className="w-full max-w-2xl rounded-3xl p-12"
        style={{
          backgroundColor: tokens.surface.card,
          boxShadow: tokens.shadow.md,
        }}
      >
        <div className="space-y-8 text-center">
          {/* Success Icon */}
          <div className="flex justify-center">
            <div
              className="inline-flex items-center justify-center h-20 w-20 rounded-full"
              style={{ backgroundColor: `${tokens.status.success}15` }}
            >
              <CheckCircle2 className="h-12 w-12" style={{ color: tokens.status.success }} />
            </div>
          </div>

          {/* Header */}
          <div className="space-y-3">
            <h1 className="text-2xl sm:text-4xl font-bold" style={{ color: tokens.text.primary }}>
              You're All Set!
            </h1>
            <p className="text-lg" style={{ color: tokens.text.secondary }}>
              Thank you, {participantName}. Your signatures have been successfully recorded.
            </p>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div
              className="rounded-xl p-6 text-center"
              style={{ backgroundColor: tokens.surface.app }}
            >
              <FileText className="h-8 w-8 mx-auto mb-2" style={{ color: tokens.brand.primary }} />
              <p className="text-2xl font-bold mb-1" style={{ color: tokens.text.primary }}>
                {documentsCount}
              </p>
              <p className="text-sm" style={{ color: tokens.text.muted }}>
                {documentsCount === 1 ? 'Document' : 'Documents'} Signed
              </p>
            </div>

            <div
              className="rounded-xl p-6 text-center"
              style={{ backgroundColor: tokens.surface.app }}
            >
              <Calendar className="h-8 w-8 mx-auto mb-2" style={{ color: tokens.brand.primary }} />
              <p className="text-sm font-bold mb-1" style={{ color: tokens.text.primary }}>
                {completionDate}
              </p>
              <p className="text-sm" style={{ color: tokens.text.muted }}>
                Completion Date
              </p>
            </div>
          </div>

          {/* Multi-Participant Message */}
          {isMultiParticipant && (
            <div
              className="rounded-xl p-4"
              style={{ backgroundColor: `${tokens.brand.accent}10` }}
            >
              <p className="text-sm font-medium" style={{ color: tokens.text.primary }}>
                ℹ️ Waiting for other participants
              </p>
              <p className="text-xs mt-1" style={{ color: tokens.text.secondary }}>
                The document will be finalized once all parties have signed. You'll receive a copy via email when complete.
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col gap-3">
            <button
              onClick={handleDownloadAll}
              className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-semibold transition-all cursor-pointer"
              style={{
                backgroundColor: tokens.brand.primary,
                color: tokens.text.inverse,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 10px 20px -10px rgba(16, 185, 129, 0.5)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <Download className="h-5 w-5" />
              <span>Download All Documents</span>
            </button>

            <button
              onClick={onClose}
              className="w-full px-6 py-4 rounded-xl font-semibold transition-colors cursor-pointer"
              style={{
                color: tokens.text.primary,
                backgroundColor: tokens.surface.app,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = tokens.interaction.hover.bg;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = tokens.surface.app;
              }}
            >
              Close
            </button>
          </div>

          {/* Trust Footer */}
          <div className="pt-6 border-t" style={{ borderColor: tokens.border.soft }}>
            <p className="text-xs" style={{ color: tokens.text.muted }}>
              A copy of the signed documents has been sent to your email. These documents are legally binding and securely stored with end-to-end encryption.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
