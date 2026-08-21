interface DocumentExchange {
  workspaceId: string;
  documentName: string;
  externalRecipient: string;
  accessType: 'View' | 'Sign';
  expiry: string;
  riskLevel: 'Low' | 'Medium' | 'High';
  status: 'Active' | 'Pending Review' | 'Expiring Soon';
  sharedBy: string;
  sharedDate: string;
}

interface DecisionReviewViewProps {
  document: DocumentExchange;
  onBack: () => void;
}

export function DecisionReviewView({ document, onBack }: DecisionReviewViewProps) {
  return (
    <div className="max-w-[1000px] mx-auto p-4 sm:p-6 lg:p-8">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-neutral-600 hover:text-neutral-900 mb-6 transition-colors cursor-pointer"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to Dashboard
      </button>

      <div className="mb-8">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-neutral-900 mb-2">Decision Review</h2>
            <p className="text-neutral-600">Review document access and make governance decision</p>
          </div>
          <RiskBadge level={document.riskLevel} />
        </div>
      </div>

      {/* Document Information */}
      <div className="bg-white border border-neutral-200 rounded-lg p-6 mb-6">
        <h3 className="text-neutral-900 mb-4">Document Details</h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <div className="text-sm text-neutral-600 mb-1">Workspace ID</div>
            <div className="text-sm text-neutral-900">{document.workspaceId}</div>
          </div>

          <div>
            <div className="text-sm text-neutral-600 mb-1">Document Name</div>
            <div className="text-sm text-neutral-900">{document.documentName}</div>
          </div>

          <div>
            <div className="text-sm text-neutral-600 mb-1">Shared By</div>
            <div className="text-sm text-neutral-900">{document.sharedBy}</div>
          </div>

          <div>
            <div className="text-sm text-neutral-600 mb-1">Shared Date</div>
            <div className="text-sm text-neutral-900">{document.sharedDate}</div>
          </div>

          <div>
            <div className="text-sm text-neutral-600 mb-1">External Recipient</div>
            <div className="text-sm text-neutral-900">{document.externalRecipient}</div>
          </div>

          <div>
            <div className="text-sm text-neutral-600 mb-1">Access Type</div>
            <AccessTypeBadge type={document.accessType} />
          </div>

          <div>
            <div className="text-sm text-neutral-600 mb-1">Expiry Date</div>
            <div className="text-sm text-neutral-900">{document.expiry}</div>
          </div>

          <div>
            <div className="text-sm text-neutral-600 mb-1">Current Status</div>
            <StatusBadge status={document.status} />
          </div>
        </div>
      </div>

      {/* Risk Assessment */}
      <div className="bg-white border border-neutral-200 rounded-lg p-6 mb-6">
        <h3 className="text-neutral-900 mb-4">Risk Assessment</h3>
        
        <div className="space-y-4">
          <div className="flex items-start justify-between py-3 border-b border-neutral-100">
            <div>
              <div className="text-sm text-neutral-900 mb-1">Data Sensitivity</div>
              <div className="text-xs text-neutral-600">Contains financial information</div>
            </div>
            <RiskBadge level={document.riskLevel} />
          </div>

          <div className="flex items-start justify-between py-3 border-b border-neutral-100">
            <div>
              <div className="text-sm text-neutral-900 mb-1">External Access</div>
              <div className="text-xs text-neutral-600">Shared with external party</div>
            </div>
            <span className="inline-flex px-2.5 py-1 rounded text-xs bg-amber-50 text-amber-700">
              Medium
            </span>
          </div>

          <div className="flex items-start justify-between py-3">
            <div>
              <div className="text-sm text-neutral-900 mb-1">Compliance Requirement</div>
              <div className="text-xs text-neutral-600">Audit trail required</div>
            </div>
            <span className="inline-flex px-2.5 py-1 rounded text-xs bg-green-50 text-green-700">
              Met
            </span>
          </div>
        </div>

        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start gap-3">
            <svg
              className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
              />
            </svg>
            <div>
              <div className="text-sm text-blue-900">AI Advisory</div>
              <p className="text-sm text-blue-700 mt-1">
                This document contains sensitive financial data. Consider requiring signature confirmation and limiting expiry to 7 days.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Access Activity */}
      <div className="bg-white border border-neutral-200 rounded-lg p-6 mb-6">
        <h3 className="text-neutral-900 mb-4">Access Activity</h3>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between py-2 border-b border-neutral-100">
            <div>
              <div className="text-sm text-neutral-900">Document shared</div>
              <div className="text-xs text-neutral-500">{document.sharedDate} · by {document.sharedBy}</div>
            </div>
          </div>

          <div className="flex items-center justify-between py-2 border-b border-neutral-100">
            <div>
              <div className="text-sm text-neutral-900">Access link sent to recipient</div>
              <div className="text-xs text-neutral-500">{document.sharedDate} · Email delivered</div>
            </div>
          </div>

          <div className="flex items-center justify-between py-2">
            <div>
              <div className="text-sm text-neutral-900">Awaiting recipient action</div>
              <div className="text-xs text-neutral-500">No views recorded yet</div>
            </div>
          </div>
        </div>
      </div>

      {/* Decision Actions */}
      <div className="bg-white border border-neutral-200 rounded-lg p-6">
        <h3 className="text-neutral-900 mb-4">Governance Decision</h3>
        
        <div className="space-y-3 mb-6">
          <button className="w-full px-4 py-3 bg-green-50 border border-green-200 text-green-900 rounded-lg hover:bg-green-100 transition-colors text-left flex items-center justify-between cursor-pointer">
            <div>
              <div className="text-sm font-medium">Approve Access</div>
              <div className="text-xs text-green-700">Allow document exchange to proceed</div>
            </div>
            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </button>

          <button className="w-full px-4 py-3 bg-white border border-neutral-200 text-neutral-700 rounded-lg hover:bg-neutral-50 transition-colors text-left flex items-center justify-between cursor-pointer">
            <div>
              <div className="text-sm font-medium">Modify & Approve</div>
              <div className="text-xs text-neutral-600">Change expiry date or access permissions</div>
            </div>
            <svg className="w-5 h-5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>

          <button className="w-full px-4 py-3 bg-white border border-neutral-200 text-neutral-700 rounded-lg hover:bg-neutral-50 transition-colors text-left flex items-center justify-between cursor-pointer">
            <div>
              <div className="text-sm font-medium">Request More Information</div>
              <div className="text-xs text-neutral-600">Ask document owner for additional context</div>
            </div>
            <svg className="w-5 h-5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </button>

          <button className="w-full px-4 py-3 bg-red-50 border border-red-200 text-red-900 rounded-lg hover:bg-red-100 transition-colors text-left flex items-center justify-between cursor-pointer">
            <div>
              <div className="text-sm font-medium">Revoke Access</div>
              <div className="text-xs text-red-700">Immediately block access (requires confirmation)</div>
            </div>
            <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
            </svg>
          </button>
        </div>

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
              <div className="text-sm text-amber-900">Governance Requirement</div>
              <p className="text-sm text-amber-700 mt-1">
                All decisions are audited and cannot be undone. Revoking access will notify the document owner and external recipient.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function RiskBadge({ level }: { level: 'Low' | 'Medium' | 'High' }) {
  const styles = {
    Low: 'bg-green-50 text-green-700 border border-green-200',
    Medium: 'bg-amber-50 text-amber-700 border border-amber-200',
    High: 'bg-orange-50 text-orange-700 border border-orange-200',
  };

  return (
    <span className={`inline-flex px-3 py-1.5 rounded text-sm ${styles[level]}`}>
      Risk: {level}
    </span>
  );
}

function AccessTypeBadge({ type }: { type: 'View' | 'Sign' }) {
  const styles = {
    View: 'bg-blue-50 text-blue-700',
    Sign: 'bg-purple-50 text-purple-700',
  };

  return (
    <span className={`inline-flex px-2.5 py-1 rounded text-xs ${styles[type]}`}>
      {type}
    </span>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    Active: 'bg-green-50 text-green-700',
    'Pending Review': 'bg-amber-50 text-amber-700',
    'Expiring Soon': 'bg-orange-50 text-orange-700',
  };

  return (
    <span className={`inline-flex px-2.5 py-1 rounded text-xs ${styles[status] || 'bg-neutral-100 text-neutral-700'}`}>
      {status}
    </span>
  );
}
