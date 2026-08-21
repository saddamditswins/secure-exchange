import { useState } from 'react';

interface Document {
  id: string;
  name: string;
  size: string;
}

interface Recipient {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface PrepareForSharingViewProps {
  workspaceId: string;
  dealId: string;
  onBack: () => void;
  onSubmit: () => void;
}

export function PrepareForSharingView({ workspaceId, dealId, onBack, onSubmit }: PrepareForSharingViewProps) {
  const [selectedDocuments, setSelectedDocuments] = useState<Set<string>>(new Set());
  const [selectedRecipients, setSelectedRecipients] = useState<Set<string>>(new Set());
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const availableDocuments: Document[] = [
    { id: 'doc-1', name: 'Credit_Application_Final.pdf', size: '1.2 MB' },
    { id: 'doc-2', name: 'Vehicle_Purchase_Agreement.pdf', size: '845 KB' },
    { id: 'doc-3', name: 'Insurance_Verification.pdf', size: '512 KB' },
    { id: 'doc-4', name: 'Trade_In_Appraisal.pdf', size: '2.1 MB' },
  ];

  const availableRecipients: Recipient[] = [
    { id: 'rec-1', name: 'John Smith', email: 'john.smith@customer.com', role: 'Customer' },
    { id: 'rec-2', name: 'Sarah Johnson', email: 'sarah.j@lender.com', role: 'Lender' },
    { id: 'rec-3', name: 'Mike Davis', email: 'mike.davis@insurance.com', role: 'Insurance Provider' },
  ];

  const handleDocumentToggle = (docId: string) => {
    const newSelected = new Set(selectedDocuments);
    if (newSelected.has(docId)) {
      newSelected.delete(docId);
    } else {
      newSelected.add(docId);
    }
    setSelectedDocuments(newSelected);
  };

  const handleRecipientToggle = (recipientId: string) => {
    const newSelected = new Set(selectedRecipients);
    if (newSelected.has(recipientId)) {
      newSelected.delete(recipientId);
    } else {
      newSelected.add(recipientId);
    }
    setSelectedRecipients(newSelected);
  };

  const handleSubmitClick = () => {
    setShowConfirmModal(true);
  };

  const handleConfirmSubmit = () => {
    setShowConfirmModal(false);
    onSubmit();
  };

  const canSubmit = selectedDocuments.size > 0 && selectedRecipients.size > 0;

  return (
    <>
      <div className="max-w-[1200px] mx-auto p-4 sm:p-6 lg:p-8">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-neutral-600 hover:text-neutral-900 mb-6 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Import
        </button>

        <div className="mb-8">
          <h2 className="text-neutral-900 mb-3">Prepare for Sharing</h2>
          <div className="flex items-center gap-4 text-sm text-neutral-600">
            <span className="flex items-center gap-2">
              <span className="text-neutral-500">Workspace:</span>
              <span className="text-neutral-900">{workspaceId}</span>
            </span>
            <span>•</span>
            <span className="flex items-center gap-2">
              <span className="text-neutral-500">Deal ID:</span>
              <span className="text-neutral-900">{dealId}</span>
            </span>
          </div>
        </div>

        {/* Selection Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
          <div className="bg-white border border-neutral-200 rounded-lg p-6">
            <div className="text-sm text-neutral-600 mb-1">Documents Selected</div>
            <div className="text-2xl text-neutral-900">{selectedDocuments.size}</div>
          </div>
          <div className="bg-white border border-neutral-200 rounded-lg p-6">
            <div className="text-sm text-neutral-600 mb-1">Recipients Selected</div>
            <div className="text-2xl text-neutral-900">{selectedRecipients.size}</div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
          {/* Select Documents */}
          <div className="bg-white border border-neutral-200 rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-neutral-200 bg-neutral-50">
              <h3 className="text-neutral-900">Select Documents</h3>
              <p className="text-sm text-neutral-600 mt-1">Choose documents to share</p>
            </div>
            
            <div className="p-6 space-y-3">
              {availableDocuments.map((doc) => (
                <label
                  key={doc.id}
                  className="flex items-start gap-3 p-3 border border-neutral-200 rounded-lg cursor-pointer hover:bg-neutral-50 transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={selectedDocuments.has(doc.id)}
                    onChange={() => handleDocumentToggle(doc.id)}
                    className="w-4 h-4 mt-0.5 rounded border-neutral-300"
                  />
                  <div className="flex-1">
                    <div className="text-sm text-neutral-900">{doc.name}</div>
                    <div className="text-xs text-neutral-500">{doc.size}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Select Recipients */}
          <div className="bg-white border border-neutral-200 rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-neutral-200 bg-neutral-50">
              <h3 className="text-neutral-900">Select Recipients</h3>
              <p className="text-sm text-neutral-600 mt-1">Choose who will receive access</p>
            </div>
            
            <div className="p-6 space-y-3">
              {availableRecipients.map((recipient) => (
                <label
                  key={recipient.id}
                  className="flex items-start gap-3 p-3 border border-neutral-200 rounded-lg cursor-pointer hover:bg-neutral-50 transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={selectedRecipients.has(recipient.id)}
                    onChange={() => handleRecipientToggle(recipient.id)}
                    className="w-4 h-4 mt-0.5 rounded border-neutral-300"
                  />
                  <div className="flex-1">
                    <div className="text-sm text-neutral-900">{recipient.name}</div>
                    <div className="text-xs text-neutral-500">{recipient.email}</div>
                    <div className="text-xs text-neutral-600 mt-1">
                      <span className="inline-flex px-2 py-0.5 bg-neutral-100 rounded text-xs">
                        {recipient.role}
                      </span>
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg mb-6">
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
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div>
              <div className="text-sm text-blue-900">Approval Required</div>
              <p className="text-sm text-blue-700 mt-1">
                This sharing request will be submitted to your Tenant Admin for review and approval before recipients receive access.
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <button
            onClick={onBack}
            className="px-6 py-2.5 bg-white border border-neutral-200 text-neutral-700 rounded-lg hover:bg-neutral-50 transition-colors"
          >
            Back
          </button>
          <button
            onClick={handleSubmitClick}
            disabled={!canSubmit}
            className="px-6 py-2.5 bg-emerald-500 text-neutral-900 rounded-lg hover:bg-emerald-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Submit for Approval
          </button>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6 border-b border-neutral-200">
              <h3 className="text-neutral-900">Submit for Approval</h3>
            </div>

            <div className="p-6">
              <p className="text-sm text-neutral-700 mb-4">
                You are about to submit this document sharing request for approval. Your Tenant Admin will review the request before external recipients receive access.
              </p>

              <div className="space-y-3 mb-4">
                <div className="flex justify-between py-2 border-b border-neutral-100">
                  <span className="text-sm text-neutral-600">Documents</span>
                  <span className="text-sm text-neutral-900">{selectedDocuments.size} selected</span>
                </div>
                <div className="flex justify-between py-2 border-b border-neutral-100">
                  <span className="text-sm text-neutral-600">Recipients</span>
                  <span className="text-sm text-neutral-900">{selectedRecipients.size} selected</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-sm text-neutral-600">Status after submission</span>
                  <span className="inline-flex px-2.5 py-1 rounded text-xs bg-amber-50 text-amber-700">
                    Pending Approval
                  </span>
                </div>
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
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <div>
                    <div className="text-sm text-amber-900">Awaiting Review</div>
                    <p className="text-sm text-amber-700 mt-1">
                      Once submitted, you cannot modify this request until it is reviewed.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-neutral-200 flex items-center justify-end gap-3">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="px-5 py-2.5 bg-white border border-neutral-200 text-neutral-700 rounded-lg hover:bg-neutral-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmSubmit}
                className="px-5 py-2.5 bg-emerald-500 text-neutral-900 rounded-lg hover:bg-emerald-600 transition-colors"
              >
                Confirm Submission
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
