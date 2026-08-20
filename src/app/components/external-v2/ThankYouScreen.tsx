import { useExternalTheme } from '../../../contexts/ExternalThemeContext';
import { ExternalCard } from './ExternalCard';
import { CheckCircle2, Download } from 'lucide-react';

interface ThankYouScreenProps {
  title?: string;
  message?: string;
  showDownloadAll?: boolean;
  showNextParticipant?: boolean;
  onDownloadAll?: () => void;
  onStartNext?: () => void;
  onClose?: () => void;
}

export function ThankYouScreen({
  title = 'Thank You!',
  message = 'Your submission has been received successfully.',
  showDownloadAll = false,
  showNextParticipant = false,
  onDownloadAll,
  onStartNext,
  onClose,
}: ThankYouScreenProps) {
  const { tokens } = useExternalTheme();

  const handleDownloadAll = () => {
    // Create dummy PDF for all documents
    const link = document.createElement('a');
    link.href = 'data:application/pdf;base64,JVBERi0xLjQKJeLjz9MKMSAwIG9iago8PC9UeXBlL0NhdGFsb2cvUGFnZXMgMiAwIFI+PgplbmRvYmoKMiAwIG9iago8PC9UeXBlL1BhZ2VzL0NvdW50IDEvS2lkc1szIDAgUl0+PgplbmRvYmoKMyAwIG9iago8PC9UeXBlL1BhZ2UvTWVkaWFCb3hbMCAwIDYxMiA3OTJdL1BhcmVudCAyIDAgUi9SZXNvdXJjZXM8PD4+Pj4KZW5kb2JqCnhyZWYKMCA0CjAwMDAwMDAwMDAgNjU1MzUgZiAKMDAwMDAwMDAxNSAwMDAwMCBuIAowMDAwMDAwMDY0IDAwMDAwIG4gCjAwMDAwMDAxMjEgMDAwMDAgbiAKdHJhaWxlcgo8PC9TaXplIDQvUm9vdCAxIDAgUj4+CnN0YXJ0eHJlZgoyMDIKJSVFT0Y=';
    link.download = 'signed-documents.pdf';
    link.click();
    onDownloadAll?.();
  };

  return (
    <ExternalCard className="text-center">
      <div className="flex flex-col items-center gap-6">
        {/* Success Icon */}
        <div
          className="h-20 w-20 rounded-full flex items-center justify-center"
          style={{
            backgroundColor: `${tokens.status.success}20`,
          }}
        >
          <CheckCircle2 className="h-10 w-10" style={{ color: tokens.status.success }} />
        </div>

        {/* Title and Message */}
        <div className="space-y-2">
          <h1 className="text-2xl md:text-3xl font-bold" style={{ color: tokens.text.primary }}>
            {title}
          </h1>
          <p className="text-base max-w-md" style={{ color: tokens.text.secondary }}>
            {message}
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3 w-full max-w-md mt-4">
          {showDownloadAll && (
            <button
              onClick={handleDownloadAll}
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium transition-all cursor-pointer"
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
              <Download className="h-4 w-4" />
              <span>Download All Documents</span>
            </button>
          )}

          {showNextParticipant && onStartNext && (
            <button
              onClick={onStartNext}
              className="px-6 py-3 rounded-lg font-medium transition-all cursor-pointer border"
              style={{
                borderColor: tokens.border.soft,
                color: tokens.text.primary,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = tokens.interaction.hover.bg;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              Start Next Participant
            </button>
          )}

          {onClose && (
            <button
              onClick={onClose}
              className="text-sm font-medium cursor-pointer transition-colors"
              style={{
                color: tokens.text.secondary,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = tokens.text.primary;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = tokens.text.secondary;
              }}
            >
              Close
            </button>
          )}
        </div>
      </div>
    </ExternalCard>
  );
}
