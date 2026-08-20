import { useState } from 'react';
import { ExternalThemeProvider } from '../../../contexts/ExternalThemeContext';
import { ExternalLayout } from './ExternalLayout';
import { WelcomeScreen } from './WelcomeScreen';
import { OTPAuthScreen } from './OTPAuthScreen';
import { SecureShareDocumentsView } from './SecureShareDocumentsView';
import { ThankYouScreen } from './ThankYouScreen';

interface Document {
  id: string;
  name: string;
  pageCount?: number;
}

interface SecureShareFlowProps {
  organizationName: string;
  organizationLogo?: string;
  exchangeId: string;
  exchangeTitle: string;
  exchangeDescription?: string;
  expiresAt?: string;
  recipientEmail: string;
  recipientPhone?: string;
  allowDownload: boolean;
  allowUpload: boolean;
  uploadRequired?: boolean;
  documents: Document[];
  onComplete?: () => void;
}

export function SecureShareFlow({
  organizationName,
  organizationLogo,
  exchangeId,
  exchangeTitle,
  exchangeDescription,
  expiresAt,
  recipientEmail,
  recipientPhone,
  allowDownload,
  allowUpload,
  uploadRequired = false,
  documents,
  onComplete,
}: SecureShareFlowProps) {
  const [step, setStep] = useState<'welcome' | 'otp' | 'documents' | 'thank-you'>('welcome');

  const handleLogout = () => {
    setStep('welcome');
  };

  const handleSubmit = (uploadedFiles: File[]) => {
    setStep('thank-you');
  };

  const handleClose = () => {
    onComplete?.();
  };

  return (
    <ExternalThemeProvider>
      <ExternalLayout
        organizationName={organizationName}
        organizationLogo={organizationLogo}
        onLogout={handleLogout}
        showLogout={step !== 'welcome'}
        variant={step === 'documents' ? 'fullWidth' : 'centered'}
      >
        {step === 'welcome' && (
          <WelcomeScreen
            organizationName={organizationName}
            organizationLogo={organizationLogo}
            exchangeTitle={exchangeTitle}
            flowType="secure-share"
            onContinue={() => setStep('otp')}
          />
        )}

        {step === 'otp' && (
          <OTPAuthScreen
            mode="email"
            recipientEmail={recipientEmail}
            recipientPhone={recipientPhone}
            onVerified={() => setStep('documents')}
            onBack={() => setStep('welcome')}
          />
        )}

        {step === 'documents' && (
          <SecureShareDocumentsView
            exchangeTitle={exchangeTitle}
            exchangeDescription={exchangeDescription}
            expiresAt={expiresAt}
            allowDownload={allowDownload}
            allowUpload={allowUpload}
            uploadRequired={uploadRequired}
            documents={documents}
            onSubmit={handleSubmit}
          />
        )}

        {step === 'thank-you' && (
          <ThankYouScreen
            title="Submission Complete!"
            message="Your documents have been successfully submitted and recorded."
            showDownloadAll={allowDownload}
            onClose={handleClose}
          />
        )}
      </ExternalLayout>
    </ExternalThemeProvider>
  );
}