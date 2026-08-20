import { useState, useEffect } from 'react';
import { Loader } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from './ui/sheet';

interface ImportFromDealertrackViewProps {
  open: boolean;
  onClose: () => void;
  onImport: (workspaceId: string, dealId: string, name: string, description: string, documents: File[]) => void;
}

export function ImportFromDealertrackView({ open, onClose, onImport }: ImportFromDealertrackViewProps) {
  const [dealId, setDealId] = useState('');
  const [workspaceName, setWorkspaceName] = useState('');
  const [description, setDescription] = useState('');
  const [isImporting, setIsImporting] = useState(false);
  const [importProgress, setImportProgress] = useState(0);
  const [importStatus, setImportStatus] = useState('');

  // Auto-suggest workspace name based on Deal ID
  useEffect(() => {
    if (dealId.trim()) {
      setWorkspaceName(`Dealertrack - ${dealId}`);
    } else {
      setWorkspaceName('');
    }
  }, [dealId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!dealId.trim()) {
      return;
    }

    setIsImporting(true);
    setImportProgress(0);
    setImportStatus('Connecting to Dealertrack...');

    // Simulate import process with progress
    await new Promise(resolve => setTimeout(resolve, 800));
    setImportProgress(25);
    setImportStatus('Retrieving deal information...');

    await new Promise(resolve => setTimeout(resolve, 1000));
    setImportProgress(50);
    setImportStatus('Importing documents...');

    await new Promise(resolve => setTimeout(resolve, 1200));
    setImportProgress(75);
    setImportStatus('Processing documents...');

    await new Promise(resolve => setTimeout(resolve, 800));
    setImportProgress(100);
    setImportStatus('Import complete');

    // Simulate imported documents
    const mockDocuments: File[] = [
      new File([''], 'Credit Application.pdf', { type: 'application/pdf' }),
      new File([''], 'Purchase Agreement.pdf', { type: 'application/pdf' }),
      new File([''], 'Insurance Certificate.pdf', { type: 'application/pdf' }),
      new File([''], 'Trade-In Valuation.pdf', { type: 'application/pdf' }),
    ];

    // Generate workspace ID
    const newWorkspaceId = `WS-2024-${Math.floor(Math.random() * 1000).toString().padStart(4, '0')}`;
    
    // Reset form
    const finalName = workspaceName || `Dealertrack - ${dealId}`;
    const finalDescription = description || `Workspace imported from Dealertrack Deal ID: ${dealId}`;
    
    setDealId('');
    setWorkspaceName('');
    setDescription('');
    setIsImporting(false);
    setImportProgress(0);
    setImportStatus('');
    
    onImport(newWorkspaceId, dealId, finalName, finalDescription, mockDocuments);
  };

  const handleCancel = () => {
    if (isImporting) {
      // Prevent closing during import
      return;
    }
    
    // Reset form
    setDealId('');
    setWorkspaceName('');
    setDescription('');
    setIsImporting(false);
    setImportProgress(0);
    setImportStatus('');
    onClose();
  };

  return (
    <Sheet open={open} onOpenChange={isImporting ? undefined : onClose}>
      <SheetContent side="right" className="sm:max-w-[600px] flex flex-col p-0">
        <SheetHeader className="border-b border-neutral-200 p-6 pb-4">
          <SheetTitle className="text-neutral-900">Import from Dealertrack</SheetTitle>
          <SheetDescription className="text-neutral-600">
            Import a workspace and documents from Dealertrack DMS
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Dealertrack Deal ID */}
            <div>
              <label htmlFor="dealId" className="block text-sm text-neutral-700 mb-2">
                Dealertrack Deal ID / External ID <span className="text-red-600">*</span>
              </label>
              <input
                id="dealId"
                type="text"
                required
                disabled={isImporting}
                value={dealId}
                onChange={(e) => setDealId(e.target.value)}
                placeholder="e.g., DEAL-2024-089"
                className="w-full px-4 py-2.5 border border-neutral-200 rounded-lg text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900 disabled:bg-neutral-50 disabled:text-neutral-500"
              />
              <p className="text-xs text-neutral-500 mt-1">
                Enter the Dealertrack Deal ID to import workspace and documents
              </p>
            </div>

            {/* Workspace Name */}
            <div>
              <label htmlFor="workspaceName" className="block text-sm text-neutral-700 mb-2">
                Workspace Name <span className="text-neutral-500">(Optional)</span>
              </label>
              <input
                id="workspaceName"
                type="text"
                disabled={isImporting}
                value={workspaceName}
                onChange={(e) => setWorkspaceName(e.target.value)}
                placeholder="Auto-suggested from Deal ID"
                className="w-full px-4 py-2.5 border border-neutral-200 rounded-lg text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900 disabled:bg-neutral-50 disabled:text-neutral-500"
              />
              <p className="text-xs text-neutral-500 mt-1">
                Name is auto-suggested but can be customized
              </p>
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm text-neutral-700 mb-2">
                Description <span className="text-neutral-500">(Optional)</span>
              </label>
              <textarea
                id="description"
                disabled={isImporting}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add a description for this workspace..."
                rows={4}
                className="w-full px-4 py-2.5 border border-neutral-200 rounded-lg text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900 resize-none disabled:bg-neutral-50 disabled:text-neutral-500"
              />
            </div>

            {/* Import Progress */}
            {isImporting && (
              <div className="border-t border-neutral-200 pt-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <Loader className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5 animate-spin" />
                    <div className="flex-1">
                      <div className="text-sm text-blue-900 mb-1">
                        {importStatus}
                      </div>
                      {/* Progress Bar */}
                      <div className="w-full bg-blue-100 rounded-full h-2 mt-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${importProgress}%` }}
                        />
                      </div>
                      <div className="text-xs text-blue-700 mt-1">
                        {importProgress}% complete
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Information Panel */}
            {!isImporting && (
              <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <svg
                    className="w-5 h-5 text-neutral-600 flex-shrink-0 mt-0.5"
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
                    <div className="text-sm text-neutral-900 mb-1">What will be imported?</div>
                    <p className="text-sm text-neutral-600">
                      We'll automatically retrieve all documents and deal information associated with this Deal ID from Dealertrack DMS.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="border-t border-neutral-200 p-6 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={handleCancel}
              disabled={isImporting}
              className="px-6 py-2.5 bg-white border border-neutral-200 text-neutral-700 rounded-lg hover:bg-neutral-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!dealId.trim() || isImporting}
              className="px-6 py-2.5 bg-emerald-500 text-neutral-900 rounded-lg hover:bg-emerald-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isImporting && <Loader className="w-4 h-4 animate-spin" />}
              {isImporting ? 'Importing...' : 'Import Workspace'}
            </button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}