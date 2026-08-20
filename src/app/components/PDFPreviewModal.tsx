import { X, ZoomIn, ZoomOut, Download, Printer } from 'lucide-react';

/** Only the fields this modal actually renders. */
interface PreviewableDocument {
  name: string;
  type: string;
}

interface PDFPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  document: PreviewableDocument | null;
}

export function PDFPreviewModal({ isOpen, onClose, document }: PDFPreviewModalProps) {
  if (!isOpen || !document) return null;

  const isDocx = document.type.toUpperCase() === 'DOCX' || document.type.toUpperCase() === 'DOC';

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-5xl h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200">
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-neutral-900">{document.name}</h2>
            <p className="text-sm text-neutral-500">Preview</p>
          </div>
          <div className="flex items-center gap-2">
            {!isDocx && (
              <>
                <button className="p-2 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors">
                  <ZoomOut className="w-5 h-5" />
                </button>
                <button className="p-2 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors">
                  <ZoomIn className="w-5 h-5" />
                </button>
                <div className="w-px h-6 bg-neutral-200 mx-2" />
              </>
            )}
            <button className="p-2 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors">
              <Download className="w-5 h-5" />
            </button>
            <button className="p-2 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors">
              <Printer className="w-5 h-5" />
            </button>
            <div className="w-px h-6 bg-neutral-200 mx-2" />
            <button
              onClick={onClose}
              className="p-2 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* PDF/DOCX Preview Area */}
        <div className="flex-1 overflow-auto bg-neutral-100 p-8">
          {isDocx ? (
            <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg p-12">
              <div className="flex flex-col items-center justify-center min-h-[400px] text-center space-y-4">
                <div className="w-20 h-20 rounded-full bg-neutral-100 flex items-center justify-center">
                  <svg className="w-10 h-10" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M30 4H10C8.89543 4 8 4.89543 8 6V42C8 43.1046 8.89543 44 10 44H38C39.1046 44 40 43.1046 40 42V14L30 4Z" fill="#E8E8E8"/>
                    <path d="M30 4V12C30 13.1046 30.8954 14 32 14H40L30 4Z" fill="#C4C4C4"/>
                    <rect x="12" y="8" width="16" height="1.5" rx="0.75" fill="#9E9E9E"/>
                    <rect x="12" y="12" width="16" height="1.5" rx="0.75" fill="#9E9E9E"/>
                    <rect x="12" y="16" width="12" height="1.5" rx="0.75" fill="#9E9E9E"/>
                    <rect x="12" y="32" width="16" height="1.5" rx="0.75" fill="#9E9E9E"/>
                    <rect x="12" y="36" width="12" height="1.5" rx="0.75" fill="#9E9E9E"/>
                    <rect x="8" y="22" width="32" height="8" rx="1" fill="#2563EB"/>
                    <text x="24" y="27.5" fontSize="7" fontWeight="600" fill="white" textAnchor="middle">DOC</text>
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-neutral-900 mb-2">Preview Not Available</h3>
                  <p className="text-neutral-600 mb-1">Preview is currently not available for DOCX files.</p>
                  <p className="text-sm text-neutral-500">Please download the file to view its contents.</p>
                </div>
                <button className="mt-4 px-4 py-2 bg-emerald-500 text-neutral-900 rounded-lg hover:bg-emerald-600 transition-colors inline-flex items-center gap-2 font-medium">
                  <Download className="w-4 h-4" />
                  Download File
                </button>
              </div>
            </div>
          ) : (
            <div className="max-w-3xl mx-auto bg-white shadow-lg">
              {/* Dummy PDF Content */}
              <div className="p-12 space-y-6">
                <div className="text-center mb-8">
                  <h1 className="text-3xl font-bold text-neutral-900 mb-2">Sample Document</h1>
                  <p className="text-neutral-600">This is a placeholder PDF preview</p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <h2 className="text-xl font-semibold text-neutral-900">Section 1: Introduction</h2>
                    <p className="text-neutral-700 leading-relaxed">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                    </p>
                    <p className="text-neutral-700 leading-relaxed">
                      Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h2 className="text-xl font-semibold text-neutral-900">Section 2: Terms and Conditions</h2>
                    <p className="text-neutral-700 leading-relaxed">
                      Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-neutral-700 ml-4">
                      <li>First term and condition statement</li>
                      <li>Second term and condition statement</li>
                      <li>Third term and condition statement</li>
                      <li>Fourth term and condition statement</li>
                    </ul>
                  </div>

                  <div className="space-y-2">
                    <h2 className="text-xl font-semibold text-neutral-900">Section 3: Agreement Details</h2>
                    <p className="text-neutral-700 leading-relaxed">
                      Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.
                    </p>
                    <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-4 my-4">
                      <h3 className="text-sm font-semibold text-neutral-900 mb-2">Important Notice</h3>
                      <p className="text-sm text-neutral-700">
                        This is a placeholder document for preview purposes only. The actual document content will be displayed here in the production environment.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h2 className="text-xl font-semibold text-neutral-900">Section 4: Signatures</h2>
                    <p className="text-neutral-700 leading-relaxed">
                      At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident.
                    </p>
                    <div className="grid grid-cols-2 gap-8 mt-8">
                      <div className="space-y-4">
                        <div className="border-t-2 border-neutral-400 pt-2">
                          <p className="text-sm text-neutral-600">Signature</p>
                        </div>
                        <div className="border-t border-neutral-300 pt-2">
                          <p className="text-sm text-neutral-600">Date</p>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div className="border-t-2 border-neutral-400 pt-2">
                          <p className="text-sm text-neutral-600">Signature</p>
                        </div>
                        <div className="border-t border-neutral-300 pt-2">
                          <p className="text-sm text-neutral-600">Date</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-12 pt-8 border-t border-neutral-200 text-center text-sm text-neutral-500">
                  <p>Page 1 of 1</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}