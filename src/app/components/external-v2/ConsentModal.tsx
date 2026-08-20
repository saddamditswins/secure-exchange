import { useState } from 'react';
import { useExternalTheme } from '../../../contexts/ExternalThemeContext';
import { X, AlertCircle } from 'lucide-react';

interface ConsentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAgree: () => void;
}

export function ConsentModal({ isOpen, onClose, onAgree }: ConsentModalProps) {
  const { tokens } = useExternalTheme();
  const [hasAgreed, setHasAgreed] = useState(false);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: tokens.surface.overlay }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl rounded-3xl p-8"
        style={{
          backgroundColor: tokens.surface.elevated,
          boxShadow: tokens.shadow.md,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold" style={{ color: tokens.text.primary }}>
            Electronic Signature Consent
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg transition-colors cursor-pointer"
            style={{ color: tokens.text.secondary }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = tokens.interaction.hover.bg;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div
          className="max-h-96 overflow-y-auto mb-6 p-4 rounded-lg text-sm space-y-4"
          style={{
            backgroundColor: tokens.surface.card,
            color: tokens.text.secondary,
          }}
        >
          <p className="font-semibold" style={{ color: tokens.text.primary }}>
            By clicking "I Agree & Continue" below, you consent to the following:
          </p>

          <div className="space-y-3">
            <div>
              <h3 className="font-medium mb-1" style={{ color: tokens.text.primary }}>
                1. Electronic Signature Consent
              </h3>
              <p>
                You agree that your electronic signature will be legally binding and have the same
                force and effect as a handwritten signature.
              </p>
            </div>

            <div>
              <h3 className="font-medium mb-1" style={{ color: tokens.text.primary }}>
                2. Electronic Delivery
              </h3>
              <p>
                You consent to receive all documents, notices, and disclosures electronically
                instead of in paper form.
              </p>
            </div>

            <div>
              <h3 className="font-medium mb-1" style={{ color: tokens.text.primary }}>
                3. Authentication
              </h3>
              <p>
                You understand that you have been authenticated through secure verification methods
                and that your signature will be associated with your verified identity.
              </p>
            </div>

            <div>
              <h3 className="font-medium mb-1" style={{ color: tokens.text.primary }}>
                4. Audit Trail
              </h3>
              <p>
                You acknowledge that a complete audit trail will be maintained, including your IP
                address, timestamp, and all actions taken during this signing session.
              </p>
            </div>

            <div>
              <h3 className="font-medium mb-1" style={{ color: tokens.text.primary }}>
                5. Right to Withdraw
              </h3>
              <p>
                You have the right to withdraw your consent to use electronic signatures at any
                time by contacting the document sender. However, this withdrawal will not affect the
                legal validity of signatures provided before withdrawal.
              </p>
            </div>

            <div>
              <h3 className="font-medium mb-1" style={{ color: tokens.text.primary }}>
                6. System Requirements
              </h3>
              <p>
                You confirm that you have access to a device with internet connectivity and a
                compatible web browser to access and review the documents.
              </p>
            </div>
          </div>
        </div>

        {/* Consent Checkbox */}
        <div className="mb-6">
          <label className="flex items-start gap-3 cursor-pointer">
            <div className="relative mt-1">
              <input
                type="checkbox"
                checked={hasAgreed}
                onChange={(e) => setHasAgreed(e.target.checked)}
                className="h-5 w-5 rounded border cursor-pointer"
                style={{
                  borderColor: tokens.border.soft,
                  accentColor: tokens.brand.primary,
                }}
              />
              {hasAgreed && (
                <div
                  className="absolute inset-0 rounded flex items-center justify-center pointer-events-none"
                  style={{ backgroundColor: tokens.brand.primary }}
                >
                  <svg
                    className="h-3 w-3"
                    viewBox="0 0 12 12"
                    fill="none"
                    style={{ stroke: tokens.text.primary }}
                  >
                    <path
                      d="M2 6L5 9L10 3"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              )}
            </div>
            <span className="text-sm flex-1" style={{ color: tokens.text.primary }}>
              I have read and agree to the Electronic Signature Consent and understand that my
              electronic signature will be legally binding.
            </span>
          </label>
        </div>

        {/* Warning */}
        {!hasAgreed && (
          <div
            className="flex items-start gap-2 p-3 rounded-lg mb-6"
            style={{
              backgroundColor: `${tokens.status.warning}20`,
              color: tokens.status.warning,
            }}
          >
            <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
            <span className="text-sm">
              You must agree to the consent terms before continuing.
            </span>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 rounded-lg font-medium border transition-colors cursor-pointer"
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
            Cancel
          </button>
          <button
            onClick={onAgree}
            disabled={!hasAgreed}
            className="flex-1 px-6 py-3 rounded-lg font-medium transition-all cursor-pointer"
            style={{
              backgroundColor: tokens.brand.primary,
              color: tokens.text.primary,
              opacity: hasAgreed ? '1' : tokens.interaction.disabled.opacity,
            }}
            onMouseEnter={(e) => {
              if (hasAgreed) {
                e.currentTarget.style.transform = 'translateY(-1px)';
                e.currentTarget.style.boxShadow = tokens.shadow.md;
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            I Agree & Continue
          </button>
        </div>
      </div>
    </div>
  );
}
