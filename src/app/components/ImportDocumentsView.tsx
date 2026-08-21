import { useState } from 'react';

interface ImportedDocument {
  id: string;
  name: string;
  source: string;
  status: 'Ready' | 'Error';
  size: string;
  importedAt: string;
  errorMessage?: string;
}

interface ImportDocumentsViewProps {
  workspaceId: string;
  dealId: string;
  onBack: () => void;
  onContinue: () => void;
}

export function ImportDocumentsView({ workspaceId, dealId, onBack, onContinue }: ImportDocumentsViewProps) {
  const [isImporting, setIsImporting] = useState(false);

  const mockDocuments: ImportedDocument[] = [
    {
      id: 'doc-1',
      name: 'Credit_Application_Final.pdf',
      source: 'Dealertrack',
      status: 'Ready',
      size: '1.2 MB',
      importedAt: '2024-12-30 14:22',
    },
    {
      id: 'doc-2',
      name: 'Vehicle_Purchase_Agreement.pdf',
      source: 'Dealertrack',
      status: 'Ready',
      size: '845 KB',
      importedAt: '2024-12-30 14:22',
    },
    {
      id: 'doc-3',
      name: 'Insurance_Verification.pdf',
      source: 'Dealertrack',
      status: 'Ready',
      size: '512 KB',
      importedAt: '2024-12-30 14:22',
    },
    {
      id: 'doc-4',
      name: 'Trade_In_Appraisal.pdf',
      source: 'Dealertrack',
      status: 'Ready',
      size: '2.1 MB',
      importedAt: '2024-12-30 14:22',
    },
    {
      id: 'doc-5',
      name: 'Finance_Terms_Sheet.pdf',
      source: 'Dealertrack',
      status: 'Error',
      size: '—',
      importedAt: '2024-12-30 14:22',
      errorMessage: 'File corrupted or unreadable',
    },
  ];

  const handleRefreshImport = () => {
    setIsImporting(true);
    setTimeout(() => {
      setIsImporting(false);
    }, 2000);
  };

  const readyCount = mockDocuments.filter(d => d.status === 'Ready').length;
  const errorCount = mockDocuments.filter(d => d.status === 'Error').length;

  return (
    <div className="max-w-[1200px] mx-auto p-4 sm:p-6 lg:p-8">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-neutral-600 hover:text-neutral-900 mb-6 transition-colors"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to Workspaces
      </button>

      <div className="mb-8">
        <h2 className="text-neutral-900 mb-3">Import Documents</h2>
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

      {/* Source Information */}
      <div className="bg-white border border-neutral-200 rounded-lg p-6 mb-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-neutral-900 mb-2">Document Source</h3>
            <p className="text-sm text-neutral-600">Documents are imported from Dealertrack DMS</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="px-3 py-1.5 bg-blue-50 border border-blue-200 rounded text-sm text-blue-700">
              <svg className="w-4 h-4 inline mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Dealertrack Connected
            </div>
            <button
              onClick={handleRefreshImport}
              disabled={isImporting}
              className="px-4 py-2 bg-white border border-neutral-200 text-neutral-700 rounded-lg hover:bg-neutral-50 transition-colors disabled:opacity-50"
            >
              {isImporting ? 'Importing...' : 'Refresh Import'}
            </button>
          </div>
        </div>
      </div>

      {/* Import Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
        <div className="bg-white border border-neutral-200 rounded-lg p-6">
          <div className="text-sm text-neutral-600 mb-1">Total Documents</div>
          <div className="text-2xl text-neutral-900">{mockDocuments.length}</div>
        </div>
        <div className="bg-white border border-neutral-200 rounded-lg p-6">
          <div className="text-sm text-neutral-600 mb-1">Ready</div>
          <div className="text-2xl text-green-700">{readyCount}</div>
        </div>
        <div className="bg-white border border-neutral-200 rounded-lg p-6">
          <div className="text-sm text-neutral-600 mb-1">Errors</div>
          <div className="text-2xl text-red-700">{errorCount}</div>
        </div>
      </div>

      {/* Imported Documents List */}
      <div className="bg-white border border-neutral-200 rounded-lg overflow-hidden mb-6">
        <div className="px-6 py-4 border-b border-neutral-200 bg-neutral-50">
          <h3 className="text-neutral-900">Imported Documents</h3>
        </div>
        
        <div className="overflow-x-auto">
        <table className="w-full min-w-[640px]">
          <thead className="bg-neutral-50 border-b border-neutral-200">
            <tr>
              <th className="text-left px-6 py-3 text-sm text-neutral-600">Document Name</th>
              <th className="text-left px-6 py-3 text-sm text-neutral-600">Source</th>
              <th className="text-left px-6 py-3 text-sm text-neutral-600">Status</th>
              <th className="text-left px-6 py-3 text-sm text-neutral-600">Size</th>
              <th className="text-left px-6 py-3 text-sm text-neutral-600">Imported At</th>
            </tr>
          </thead>
          <tbody>
            {mockDocuments.map((doc) => (
              <tr key={doc.id} className="border-b border-neutral-100">
                <td className="px-6 py-4">
                  <div className="text-sm text-neutral-900">{doc.name}</div>
                  {doc.errorMessage && (
                    <div className="text-xs text-red-600 mt-1">{doc.errorMessage}</div>
                  )}
                </td>
                <td className="px-6 py-4 text-sm text-neutral-700">{doc.source}</td>
                <td className="px-6 py-4">
                  <StatusBadge status={doc.status} />
                </td>
                <td className="px-6 py-4 text-sm text-neutral-700">{doc.size}</td>
                <td className="px-6 py-4 text-sm text-neutral-700">{doc.importedAt}</td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>

      {errorCount > 0 && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg mb-6">
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
              <div className="text-sm text-amber-900">Import Errors Detected</div>
              <p className="text-sm text-amber-700 mt-1">
                Some documents failed to import. You can continue with the available documents or retry the import.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-end gap-3">
        <button
          onClick={onBack}
          className="px-6 py-2.5 bg-white border border-neutral-200 text-neutral-700 rounded-lg hover:bg-neutral-50 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={onContinue}
          disabled={readyCount === 0}
          className="px-6 py-2.5 bg-emerald-500 text-neutral-900 rounded-lg hover:bg-emerald-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Continue to Prepare Sharing
        </button>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: 'Ready' | 'Error' }) {
  const styles = {
    Ready: 'bg-green-50 text-green-700',
    Error: 'bg-red-50 text-red-700',
  };

  return (
    <span className={`inline-flex px-2.5 py-1 rounded text-xs ${styles[status]}`}>
      {status}
    </span>
  );
}
