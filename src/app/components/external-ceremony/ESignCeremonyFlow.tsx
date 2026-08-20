import { useState } from 'react';
import { ExternalThemeProvider } from '../../../contexts/ExternalThemeContext';
import { ExternalCeremonyLayout } from './ExternalCeremonyLayout';
import { CeremonyWelcomeScreen } from './CeremonyWelcomeScreen';
import { CeremonyOTPAuth } from './CeremonyOTPAuth';
import { CeremonySigningView } from './CeremonySigningView';
import { CeremonyThankYou } from './CeremonyThankYou';

type FlowStep = 'welcome' | 'auth' | 'signing' | 'complete';

interface ESignCeremonyFlowProps {
  exchangeId: string;
  participantToken: string;
}

export function ESignCeremonyFlow({ exchangeId, participantToken }: ESignCeremonyFlowProps) {
  const [currentStep, setCurrentStep] = useState<FlowStep>('welcome');

  // Mock data - in real app, fetch from API using exchangeId and participantToken
  const mockData = {
    organizationName: 'Acme Corporation',
    organizationLogo: undefined,
    exchangeName: 'EX-2024-001 - Q1 2024 Service Agreement',
    participantName: 'John Smith',
    participantEmail: 'john.smith@example.com',
    authMethod: 'email' as const,
    documents: [
      {
        id: 'doc-1',
        name: 'Master Service Agreement',
        pageCount: 3,
        status: 'pending' as const,
        fields: [
          {
            id: 'field-1',
            type: 'signature' as const,
            page: 1,
            x: 10,
            y: 70,
            width: 25,
            height: 8,
            required: true,
            completed: false,
          },
          {
            id: 'field-2',
            type: 'date' as const,
            page: 1,
            x: 10,
            y: 82,
            width: 15,
            height: 6,
            required: true,
            completed: false,
          },
          {
            id: 'field-3',
            type: 'initials' as const,
            page: 2,
            x: 75,
            y: 90,
            width: 10,
            height: 6,
            required: true,
            completed: false,
          },
        ],
      },
      {
        id: 'doc-2',
        name: 'Non-Disclosure Agreement',
        pageCount: 2,
        status: 'pending' as const,
        fields: [
          {
            id: 'field-4',
            type: 'signature' as const,
            page: 2,
            x: 10,
            y: 75,
            width: 25,
            height: 8,
            required: true,
            completed: false,
          },
          {
            id: 'field-5',
            type: 'date' as const,
            page: 2,
            x: 10,
            y: 85,
            width: 15,
            height: 6,
            required: true,
            completed: false,
          },
        ],
      },
    ],
    isMultiParticipant: true,
  };

  const handleLogout = () => {
    // End session and redirect
    window.location.href = '/';
  };

  const handleStart = () => {
    setCurrentStep('auth');
  };

  const handleVerify = (code: string) => {
    // Verify OTP
    if (code === '123456') {
      setCurrentStep('signing');
    }
  };

  const handleComplete = () => {
    setCurrentStep('complete');
  };

  const handleClose = () => {
    // Close window or redirect
    window.close();
  };

  const renderStep = () => {
    switch (currentStep) {
      case 'welcome':
        return (
          <CeremonyWelcomeScreen
            exchangeName={mockData.exchangeName}
            participantName={mockData.participantName}
            documents={mockData.documents.map((doc) => ({
              id: doc.id,
              name: doc.name,
              pageCount: doc.pageCount,
            }))}
            onStart={handleStart}
          />
        );

      case 'auth':
        return (
          <CeremonyOTPAuth
            method={mockData.authMethod}
            recipient={mockData.participantEmail}
            onVerify={handleVerify}
            onBack={() => setCurrentStep('welcome')}
          />
        );

      case 'signing':
        return (
          <CeremonySigningView
            participantName={mockData.participantName}
            documents={mockData.documents}
            onComplete={handleComplete}
          />
        );

      case 'complete':
        const completionDate = new Date().toLocaleString('en-US', {
          month: '2-digit',
          day: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        });
        
        return (
          <CeremonyThankYou
            participantName={mockData.participantName}
            documentsCount={mockData.documents.length}
            completionDate={completionDate}
            onClose={handleClose}
            isMultiParticipant={mockData.isMultiParticipant}
          />
        );
    }
  };

  return (
    <ExternalThemeProvider>
      <ExternalCeremonyLayout
        organizationName={mockData.organizationName}
        organizationLogo={mockData.organizationLogo}
        onLogout={handleLogout}
        showLogout={currentStep !== 'complete'}
      >
        {renderStep()}
      </ExternalCeremonyLayout>
    </ExternalThemeProvider>
  );
}
