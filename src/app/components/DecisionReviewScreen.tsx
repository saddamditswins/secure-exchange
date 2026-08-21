import { useState } from 'react';

type DecisionState = 'Proposed' | 'Approved' | 'Finalized';
type DecisionAction = 'approve' | 'approve-conditions' | 'deny' | null;

interface Document {
  id: string;
  name: string;
  version: string;
  sensitivity: 'Public' | 'Internal' | 'Confidential' | 'Highly Confidential';
}

interface Recipient {
  id: string;
  identity: string;
  role: string;
  authMethod: 'Email OTP' | 'SSO' | 'Password + 2FA';
}

interface AccessConfig {
  permissions: ('View' | 'Download' | 'Sign')[];
  expiryDate: string;
  policyConstraints: string[];
}

interface DecisionReviewData {
  workspaceId: string;
  dealId: string;
  decisionState: DecisionState;
  documents: Document[];
  recipients: Recipient[];
  accessConfig: AccessConfig;
  aiAdvisory?: {
    riskLevel: 'Low' | 'Medium' | 'High';
    explanation: string;
  };
}

interface DecisionReviewScreenProps {
  data: DecisionReviewData;
  onBack: () => void;
  onDecisionComplete: () => void;
}

export function DecisionReviewScreen({ data, onBack, onDecisionComplete }: DecisionReviewScreenProps) {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [pendingAction, setPendingAction] = useState<DecisionAction>(null);
  const [conditions, setConditions] = useState('');

  const handleDecisionClick = (action: DecisionAction) => {
    setPendingAction(action);
    setShowConfirmModal(true);
  };

  const handleConfirmDecision = () => {
    // Simulate decision commit
    setShowConfirmModal(false);
    setPendingAction(null);
    setConditions('');
    onDecisionComplete();
  };

  const handleCancelDecision = () => {
    setShowConfirmModal(false);
    setPendingAction(null);
    setConditions('');
  };

  return (
    <>
      <div className="max-w-[1200px] mx-auto p-4 sm:p-6 lg:p-8 pb-32">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-neutral-600 hover:text-neutral-900 mb-6 transition-colors cursor-pointer"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Dashboard
        </button>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-neutral-900 mb-3">Decision Review</h2>
              <div className="flex items-center gap-4 text-sm text-neutral-600">
                <span className="flex items-center gap-2">
                  <span className="text-neutral-500">Workspace ID:</span>
                  <span className="text-neutral-900">{data.workspaceId}</span>
                </span>
                <span>•</span>
                <span className="flex items-center gap-2">
                  <span className="text-neutral-500">Deal ID:</span>
                  <span className="text-neutral-900">{data.dealId}</span>
                </span>
              </div>
            </div>
            <DecisionStateBadge state={data.decisionState} />
          </div>
        </div>

        {/* Section 1: Documents Included */}
        <div className="bg-white border border-neutral-200 rounded-lg p-6 mb-6">
          <h3 className="text-neutral-900 mb-4">Documents Included</h3>
          
          <div className="overflow-hidden border border-neutral-200 rounded-lg">
            <div className="overflow-x-auto">
            <table className="w-full min-w-[480px]">
              <thead className="bg-neutral-50 border-b border-neutral-200">
                <tr>
                  <th className="text-left px-4 py-3 text-sm text-neutral-600">Document Name</th>
                  <th className="text-left px-4 py-3 text-sm text-neutral-600">Version</th>
                  <th className="text-left px-4 py-3 text-sm text-neutral-600">Sensitivity</th>
                </tr>
              </thead>
              <tbody>
                {data.documents.map((doc) => (
                  <tr key={doc.id} className="border-b border-neutral-100 last:border-0">
                    <td className="px-4 py-3 text-sm text-neutral-900">{doc.name}</td>
                    <td className="px-4 py-3 text-sm text-neutral-700">{doc.version}</td>
                    <td className="px-4 py-3">
                      <SensitivityBadge level={doc.sensitivity} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
          </div>
        </div>

        {/* Section 2: External Recipients */}
        <div className="bg-white border border-neutral-200 rounded-lg p-6 mb-6">
          <h3 className="text-neutral-900 mb-4">External Recipients</h3>
          
          <div className="overflow-hidden border border-neutral-200 rounded-lg">
            <div className="overflow-x-auto">
            <table className="w-full min-w-[480px]">
              <thead className="bg-neutral-50 border-b border-neutral-200">
                <tr>
                  <th className="text-left px-4 py-3 text-sm text-neutral-600">Identity</th>
                  <th className="text-left px-4 py-3 text-sm text-neutral-600">Role</th>
                  <th className="text-left px-4 py-3 text-sm text-neutral-600">Authentication Method</th>
                </tr>
              </thead>
              <tbody>
                {data.recipients.map((recipient) => (
                  <tr key={recipient.id} className="border-b border-neutral-100 last:border-0">
                    <td className="px-4 py-3 text-sm text-neutral-900">{recipient.identity}</td>
                    <td className="px-4 py-3 text-sm text-neutral-700">{recipient.role}</td>
                    <td className="px-4 py-3">
                      <AuthMethodBadge method={recipient.authMethod} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
          </div>
        </div>

        {/* Section 3: Access Configuration */}
        <div className="bg-white border border-neutral-200 rounded-lg p-6 mb-6">
          <h3 className="text-neutral-900 mb-4">Access Configuration</h3>
          
          <div className="space-y-4">
            <div className="flex items-start justify-between py-3 border-b border-neutral-100">
              <div>
                <div className="text-sm text-neutral-600 mb-2">Permissions</div>
                <div className="flex items-center gap-2">
                  {data.accessConfig.permissions.map((permission) => (
                    <PermissionBadge key={permission} permission={permission} />
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-start justify-between py-3 border-b border-neutral-100">
              <div className="text-sm text-neutral-600">Expiry Date</div>
              <div className="text-sm text-neutral-900">{data.accessConfig.expiryDate}</div>
            </div>

            <div className="py-3">
              <div className="text-sm text-neutral-600 mb-2">Policy Constraints</div>
              <div className="space-y-2">
                {data.accessConfig.policyConstraints.map((constraint, index) => (
                  <div key={index} className="flex items-start gap-2 text-sm text-neutral-700">
                    <svg className="w-4 h-4 text-neutral-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{constraint}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Section 4: AI Advisory Panel */}
        {data.aiAdvisory && (
          <div className="bg-white border border-neutral-200 rounded-lg p-6 mb-6">
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-neutral-900">AI Advisory</h3>
              <span className="text-xs text-neutral-500 px-2.5 py-1 bg-neutral-100 rounded">
                Advisory – Not Enforced
              </span>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <AIRiskBadge level={data.aiAdvisory.riskLevel} />
              </div>
              <div>
                <p className="text-sm text-neutral-700 leading-relaxed">
                  {data.aiAdvisory.explanation}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Sticky Footer with Decision Actions */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-200 shadow-lg">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-sm text-neutral-600">
              Review decision to proceed with document exchange
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => handleDecisionClick('deny')}
                className="px-5 py-2.5 bg-white border border-red-200 text-red-700 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
              >
                Deny
              </button>
              <button
                onClick={() => handleDecisionClick('approve-conditions')}
                className="px-5 py-2.5 bg-white border border-neutral-200 text-neutral-700 rounded-lg hover:bg-neutral-50 transition-colors cursor-pointer"
              >
                Approve with Conditions
              </button>
              <button
                onClick={() => handleDecisionClick('approve')}
                className="px-5 py-2.5 bg-emerald-500 text-neutral-900 rounded-lg hover:bg-emerald-600 transition-colors cursor-pointer"
              >
                Approve
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <ConfirmationModal
          action={pendingAction}
          conditions={conditions}
          onConditionsChange={setConditions}
          onConfirm={handleConfirmDecision}
          onCancel={handleCancelDecision}
        />
      )}
    </>
  );
}

function DecisionStateBadge({ state }: { state: DecisionState }) {
  const styles: Record<DecisionState, string> = {
    Proposed: 'bg-blue-50 text-blue-700 border border-blue-200',
    Approved: 'bg-green-50 text-green-700 border border-green-200',
    Finalized: 'bg-neutral-100 text-neutral-700 border border-neutral-200',
  };

  return (
    <span className={`inline-flex px-3 py-1.5 rounded text-sm ${styles[state]}`}>
      Decision State: {state}
    </span>
  );
}

function SensitivityBadge({ level }: { level: string }) {
  const styles: Record<string, string> = {
    'Public': 'bg-neutral-100 text-neutral-700',
    'Internal': 'bg-blue-50 text-blue-700',
    'Confidential': 'bg-amber-50 text-amber-700',
    'Highly Confidential': 'bg-orange-50 text-orange-700',
  };

  return (
    <span className={`inline-flex px-2.5 py-1 rounded text-xs ${styles[level] || 'bg-neutral-100 text-neutral-700'}`}>
      {level}
    </span>
  );
}

function AuthMethodBadge({ method }: { method: string }) {
  const styles: Record<string, string> = {
    'Email OTP': 'bg-blue-50 text-blue-700',
    'SSO': 'bg-green-50 text-green-700',
    'Password + 2FA': 'bg-purple-50 text-purple-700',
  };

  return (
    <span className={`inline-flex px-2.5 py-1 rounded text-xs ${styles[method] || 'bg-neutral-100 text-neutral-700'}`}>
      {method}
    </span>
  );
}

function PermissionBadge({ permission }: { permission: string }) {
  const styles: Record<string, string> = {
    'View': 'bg-blue-50 text-blue-700',
    'Download': 'bg-purple-50 text-purple-700',
    'Sign': 'bg-green-50 text-green-700',
  };

  return (
    <span className={`inline-flex px-2.5 py-1 rounded text-xs ${styles[permission] || 'bg-neutral-100 text-neutral-700'}`}>
      {permission}
    </span>
  );
}

function AIRiskBadge({ level }: { level: 'Low' | 'Medium' | 'High' }) {
  const styles = {
    Low: 'bg-green-50 text-green-700 border border-green-200',
    Medium: 'bg-amber-50 text-amber-700 border border-amber-200',
    High: 'bg-orange-50 text-orange-700 border border-orange-200',
  };

  return (
    <div className={`px-3 py-2 rounded ${styles[level]}`}>
      <div className="text-xs mb-1">Risk Level</div>
      <div className="text-sm">{level}</div>
    </div>
  );
}

interface ConfirmationModalProps {
  action: DecisionAction;
  conditions: string;
  onConditionsChange: (value: string) => void;
  onConfirm: () => void;
  onCancel: () => void;
}

function ConfirmationModal({ action, conditions, onConditionsChange, onConfirm, onCancel }: ConfirmationModalProps) {
  const getModalConfig = () => {
    switch (action) {
      case 'approve':
        return {
          title: 'Confirm Approval',
          message: 'You are about to approve this document exchange. The external recipients will be granted access according to the configured permissions.',
          confirmText: 'Confirm Approval',
          confirmStyle: 'bg-emerald-500 text-neutral-900 hover:bg-emerald-600',
          showConditions: false,
        };
      case 'approve-conditions':
        return {
          title: 'Approve with Conditions',
          message: 'You are about to approve this document exchange with conditions. Specify the conditions that must be met.',
          confirmText: 'Confirm Approval',
          confirmStyle: 'bg-emerald-500 text-neutral-900 hover:bg-emerald-600',
          showConditions: true,
        };
      case 'deny':
        return {
          title: 'Confirm Denial',
          message: 'You are about to deny this document exchange. The request will be rejected and external recipients will not receive access.',
          confirmText: 'Confirm Denial',
          confirmStyle: 'bg-red-600 text-white hover:bg-red-700',
          showConditions: false,
        };
      default:
        return {
          title: 'Confirm Action',
          message: '',
          confirmText: 'Confirm',
          confirmStyle: 'bg-emerald-500 text-neutral-900 hover:bg-emerald-600',
          showConditions: false,
        };
    }
  };

  const config = getModalConfig();

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="p-6 border-b border-neutral-200">
          <h3 className="text-neutral-900">{config.title}</h3>
        </div>

        <div className="p-6">
          <p className="text-sm text-neutral-700 mb-4">{config.message}</p>

          {config.showConditions && (
            <div className="mb-4">
              <label htmlFor="conditions" className="block text-sm text-neutral-700 mb-2">
                Conditions *
              </label>
              <textarea
                id="conditions"
                value={conditions}
                onChange={(e) => onConditionsChange(e.target.value)}
                placeholder="Specify conditions that must be met..."
                rows={4}
                className="w-full px-4 py-2.5 border border-neutral-200 rounded-lg text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900 resize-none"
                required
              />
            </div>
          )}

          <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <div className="flex items-start gap-3">
              <svg
                className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <div>
                <div className="text-sm text-amber-900">This action is irreversible</div>
                <p className="text-sm text-amber-700 mt-1">
                  All decisions are logged to the audit trail and cannot be undone. The document owner will be notified.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-neutral-200 flex items-center justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-5 py-2.5 bg-white border border-neutral-200 text-neutral-700 rounded-lg hover:bg-neutral-50 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={config.showConditions && !conditions.trim()}
            className={`px-5 py-2.5 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer ${config.confirmStyle}`}
          >
            {config.confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
