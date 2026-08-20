import { useState } from 'react';
import { ExternalThemeProvider } from '../../../contexts/ExternalThemeContext';
import { ExternalLayout } from './ExternalLayout';
import { WelcomeScreen } from './WelcomeScreen';
import { OTPAuthScreen } from './OTPAuthScreen';
import { ESignParticipantsList } from './ESignParticipantsList';
import { ConsentModal } from './ConsentModal';
import { ESignSigningView } from './ESignSigningView';
import { ThankYouScreen } from './ThankYouScreen';

interface SignatureField {
  id: string;
  type: 'signature' | 'initials' | 'date';
  page: number;
  x: number;
  y: number;
  width: number;
  height: number;
  required: boolean;
  completed: boolean;
}

interface Document {
  id: string;
  name: string;
  pageCount: number;
  status: 'pending' | 'in-progress' | 'completed';
  fields: SignatureField[];
}

interface Participant {
  id: string;
  name: string;
  email: string;
  status: 'pending' | 'signed';
  signedAt?: string;
}

interface ESignFlowProps {
  mode: 'on-device' | 'remote';
  organizationName: string;
  organizationLogo?: string;
  exchangeId: string;
  exchangeTitle: string;
  signingOrder?: 'parallel' | 'in-order';
  participants: Participant[];
  documents: Document[];
  onComplete?: () => void;
}

export function ESignFlow({
  mode,
  organizationName,
  organizationLogo,
  exchangeId,
  exchangeTitle,
  signingOrder = 'parallel',
  participants: initialParticipants,
  documents: initialDocuments,
  onComplete,
}: ESignFlowProps) {
  const [step, setStep] = useState<
    'welcome' | 'otp' | 'participants' | 'consent' | 'signing' | 'thank-you'
  >(mode === 'on-device' ? 'welcome' : 'welcome');
  const [participants, setParticipants] = useState(initialParticipants);
  const [documents, setDocuments] = useState(initialDocuments);
  const [currentParticipantIndex, setCurrentParticipantIndex] = useState(0);
  const [showConsentModal, setShowConsentModal] = useState(false);

  const currentParticipant = participants[currentParticipantIndex];
  const hasNextParticipant = currentParticipantIndex < participants.length - 1;

  const handleLogout = () => {
    setStep('welcome');
    setCurrentParticipantIndex(0);
  };

  const handleStartSigning = (participantId: string) => {
    setShowConsentModal(true);
  };

  const handleConsentAgree = () => {
    setShowConsentModal(false);
    setStep('signing');
  };

  const handleSigningComplete = () => {
    // Mark current participant as signed
    const updatedParticipants = [...participants];
    updatedParticipants[currentParticipantIndex] = {
      ...updatedParticipants[currentParticipantIndex],
      status: 'signed',
      signedAt: new Date().toLocaleDateString('en-US', {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      }),
    };
    setParticipants(updatedParticipants);

    // Reset document fields for next participant if needed
    if (hasNextParticipant && mode === 'on-device') {
      const resetDocs = documents.map((doc) => ({
        ...doc,
        status: 'pending' as const,
        fields: doc.fields.map((field) => ({ ...field, completed: false })),
      }));
      setDocuments(resetDocs);
    }

    setStep('thank-you');
  };

  const handleStartNextParticipant = () => {
    if (hasNextParticipant) {
      setCurrentParticipantIndex(currentParticipantIndex + 1);
      setStep('participants');
    }
  };

  const handleClose = () => {
    onComplete?.();
  };

  // Remote mode: check if waiting for previous signer
  const isWaitingForPreviousSigner =
    mode === 'remote' &&
    signingOrder === 'in-order' &&
    currentParticipantIndex > 0 &&
    participants[currentParticipantIndex - 1].status !== 'signed';

  return (
    <ExternalThemeProvider>
      {step === 'signing' ? (
        // Full-screen signing view without layout
        <ESignSigningView
          participantName={currentParticipant.name}
          documents={documents}
          onComplete={handleSigningComplete}
        />
      ) : (
        <ExternalLayout
          organizationName={organizationName}
          organizationLogo={organizationLogo}
          onLogout={handleLogout}
          showLogout={step !== 'welcome'}
        >
          {step === 'welcome' && (
            <WelcomeScreen
              organizationName={organizationName}
              organizationLogo={organizationLogo}
              exchangeTitle={exchangeTitle}
              flowType="e-sign"
              onContinue={() => {
                if (mode === 'on-device') {
                  setStep('participants');
                } else {
                  setStep('otp');
                }
              }}
            />
          )}

          {step === 'otp' && mode === 'remote' && (
            <>
              {isWaitingForPreviousSigner ? (
                // Waiting screen
                <div className="text-center py-12">
                  <div className="space-y-4">
                    <div className="h-16 w-16 rounded-full mx-auto bg-yellow-500/20 flex items-center justify-center">
                      <svg
                        className="h-8 w-8 text-yellow-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-white">Waiting for Previous Signer</h2>
                    <p className="text-slate-300">
                      The previous participant must complete their signature before you can proceed.
                    </p>
                  </div>
                </div>
              ) : (
                <OTPAuthScreen
                  mode="email"
                  recipientEmail={currentParticipant.email}
                  onVerified={() => setShowConsentModal(true)}
                  onBack={() => setStep('welcome')}
                />
              )}
            </>
          )}

          {step === 'participants' && mode === 'on-device' && (
            <ESignParticipantsList
              participants={participants}
              currentParticipantId={currentParticipant.id}
              onStartSigning={handleStartSigning}
            />
          )}

          {step === 'thank-you' && (
            <ThankYouScreen
              title={hasNextParticipant ? 'Signature Complete!' : 'All Signatures Complete!'}
              message={
                hasNextParticipant
                  ? 'Your signature has been recorded. The next participant can now sign.'
                  : 'All participants have successfully signed the documents.'
              }
              showDownloadAll={true}
              showNextParticipant={hasNextParticipant && mode === 'on-device'}
              onStartNext={handleStartNextParticipant}
              onClose={handleClose}
            />
          )}
        </ExternalLayout>
      )}

      {/* Consent Modal */}
      <ConsentModal
        isOpen={showConsentModal}
        onClose={() => setShowConsentModal(false)}
        onAgree={handleConsentAgree}
      />
    </ExternalThemeProvider>
  );
}
