import { useState } from 'react';
import { useExternalTheme } from '../../../contexts/ExternalThemeContext';
import { PenLine, CheckCircle2, ChevronLeft, ChevronRight, ArrowRight, ArrowUp, ArrowDown } from 'lucide-react';
import { CeremonySignatureModal } from './CeremonySignatureModal';
import { DummyPDFDocument } from './DummyPDFDocument';
import { DocumentSidebar } from './DocumentSidebar';

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

interface CeremonySigningViewProps {
  participantName: string;
  documents: Document[];
  onComplete: () => void;
}

export function CeremonySigningView({
  participantName,
  documents: initialDocuments,
  onComplete,
}: CeremonySigningViewProps) {
  const { tokens } = useExternalTheme();
  const [documents, setDocuments] = useState(initialDocuments);
  const [selectedDocIndex, setSelectedDocIndex] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [showSignatureModal, setShowSignatureModal] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);
  const [signatureData, setSignatureData] = useState('');

  const selectedDoc = documents[selectedDocIndex];
  const allFields = documents.flatMap((doc) => doc.fields);
  const completedFields = allFields.filter((f) => f.completed).length;
  const totalFields = allFields.length;
  const currentPageFields = selectedDoc.fields.filter((f) => f.page === currentPage);

  const handleSaveSignature = (sig: string, init: string) => {
    setSignatureData(sig);
    setHasSignature(true);
    setShowSignatureModal(false);
  };

  const handleFieldClick = (fieldId: string) => {
    if (!hasSignature) {
      setShowSignatureModal(true);
      return;
    }

    // Mark field as completed
    setDocuments((prevDocs) =>
      prevDocs.map((doc) => ({
        ...doc,
        fields: doc.fields.map((field) =>
          field.id === fieldId ? { ...field, completed: true } : field
        ),
        status: doc.fields.every((f) => f.id === fieldId || f.completed) ? 'completed' : 'in-progress',
      }))
    );
  };

  const handleNextRequiredField = () => {
    // Find next incomplete field across all documents
    for (let docIdx = 0; docIdx < documents.length; docIdx++) {
      const doc = documents[docIdx];
      const incompleteField = doc.fields.find((f) => !f.completed);
      
      if (incompleteField) {
        setSelectedDocIndex(docIdx);
        setCurrentPage(incompleteField.page);
        return;
      }
    }
  };

  const handlePreviousField = () => {
    // Find previous field
    let found = false;
    for (let docIdx = documents.length - 1; docIdx >= 0; docIdx--) {
      const doc = documents[docIdx];
      const fields = [...doc.fields].reverse();
      
      for (const field of fields) {
        if (found && !field.completed) {
          setSelectedDocIndex(docIdx);
          setCurrentPage(field.page);
          return;
        }
        if (field.completed) {
          found = true;
        }
      }
    }
  };

  const handleDocumentSelect = (documentId: string) => {
    const docIndex = documents.findIndex((d) => d.id === documentId);
    if (docIndex !== -1) {
      setSelectedDocIndex(docIndex);
      setCurrentPage(1);
    }
  };

  const handleComplete = () => {
    if (completedFields < totalFields) {
      alert('Please complete all required signature fields before submitting.');
      return;
    }
    onComplete();
  };

  // Prepare sidebar documents
  const sidebarDocuments = documents.map((doc) => ({
    id: doc.id,
    name: doc.name,
    pageCount: doc.pageCount,
    status: doc.status,
    fieldCount: doc.fields.length,
    completedFieldCount: doc.fields.filter((f) => f.completed).length,
  }));

  return (
    <>
      <div className="flex flex-col flex-1" style={{ backgroundColor: tokens.surface.app }}>
        {/* Signature Button Bar - Below Header */}
        <div
          className="border-b px-6 py-3 flex items-center justify-between"
          style={{
            backgroundColor: tokens.surface.card,
            borderColor: tokens.border.soft,
          }}
        >
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowSignatureModal(true)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all cursor-pointer"
              style={{
                backgroundColor: hasSignature ? `${tokens.status.success}15` : tokens.brand.primary,
                color: hasSignature ? tokens.status.success : tokens.text.inverse,
                borderWidth: hasSignature ? '2px' : '0',
                borderColor: hasSignature ? tokens.status.success : 'transparent',
              }}
              onMouseEnter={(e) => {
                if (!hasSignature) {
                  e.currentTarget.style.transform = 'translateY(-1px)';
                  e.currentTarget.style.boxShadow = '0 4px 12px -4px rgba(16, 185, 129, 0.4)';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              {hasSignature ? (
                <>
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Update Signature</span>
                </>
              ) : (
                <>
                  <PenLine className="h-4 w-4" />
                  <span>Create Signature</span>
                </>
              )}
            </button>

            <div className="h-6 w-px" style={{ backgroundColor: tokens.border.soft }} />

            <p className="text-sm font-medium" style={{ color: tokens.text.primary }}>
              Signing as: <span className="font-semibold">{participantName}</span>
            </p>
          </div>
        </div>

        {/* Main Content - Sidebar + Preview */}
        <div className="flex flex-1 overflow-hidden">
          {/* Left Sidebar - Document List */}
          <DocumentSidebar
            documents={sidebarDocuments}
            activeDocumentId={selectedDoc.id}
            onDocumentSelect={handleDocumentSelect}
            showFieldCounts={true}
          />

          {/* Main Preview Area - Full Width */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-8">
              {/* Document Title */}
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-2xl font-bold" style={{ color: tokens.text.primary }}>
                  {selectedDoc.name}
                </h2>
                <span className="text-sm font-medium" style={{ color: tokens.text.muted }}>
                  Page {currentPage} of {selectedDoc.pageCount}
                </span>
              </div>

              {/* Document Container */}
              <div
                className="rounded-2xl overflow-hidden relative max-w-5xl"
                style={{
                  backgroundColor: tokens.surface.card,
                  boxShadow: tokens.shadow.md,
                }}
              >
                {/* PDF Document - Full Width */}
                <div className="relative">
                  <DummyPDFDocument pageNumber={currentPage} documentName={selectedDoc.name} />

                  {/* Signature Fields Overlay */}
                  {currentPageFields.map((field) => (
                    <div
                      key={field.id}
                      className="absolute border-2 cursor-pointer transition-all"
                      style={{
                        left: `${field.x}%`,
                        top: `${field.y}%`,
                        width: `${field.width}%`,
                        height: `${field.height}%`,
                        borderColor: field.completed ? tokens.status.success : tokens.brand.primary,
                        backgroundColor: field.completed
                          ? `${tokens.status.success}15`
                          : `${tokens.brand.primary}15`,
                        borderStyle: field.completed ? 'solid' : 'dashed',
                      }}
                      onClick={() => handleFieldClick(field.id)}
                      onMouseEnter={(e) => {
                        if (!field.completed) {
                          e.currentTarget.style.backgroundColor = `${tokens.brand.primary}25`;
                          e.currentTarget.style.borderWidth = '3px';
                        }
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = field.completed
                          ? `${tokens.status.success}15`
                          : `${tokens.brand.primary}15`;
                        e.currentTarget.style.borderWidth = '2px';
                      }}
                    >
                      <div className="h-full flex items-center justify-center px-2">
                        {field.completed ? (
                          <CheckCircle2 className="h-5 w-5" style={{ color: tokens.status.success }} />
                        ) : (
                          <span className="text-xs font-semibold text-center" style={{ color: tokens.brand.primary }}>
                            {field.type === 'signature' ? 'Sign Here' : field.type === 'initials' ? 'Initial' : 'Date'}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Page Navigation */}
                {selectedDoc.pageCount > 1 && (
                  <div
                    className="px-6 py-4 flex items-center justify-center gap-4 border-t"
                    style={{ borderColor: tokens.border.soft, backgroundColor: tokens.surface.app }}
                  >
                    <button
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className="p-2 rounded-lg transition-colors cursor-pointer flex items-center gap-2"
                      style={{
                        color: currentPage === 1 ? tokens.text.muted : tokens.text.primary,
                        backgroundColor: currentPage === 1 ? 'transparent' : tokens.surface.card,
                        opacity: currentPage === 1 ? tokens.interaction.disabled.opacity : '1',
                      }}
                      onMouseEnter={(e) => {
                        if (currentPage > 1) {
                          e.currentTarget.style.backgroundColor = tokens.interaction.hover.bg;
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (currentPage > 1) {
                          e.currentTarget.style.backgroundColor = tokens.surface.card;
                        }
                      }}
                    >
                      <ChevronLeft className="h-4 w-4" />
                      <span className="text-sm font-medium">Previous</span>
                    </button>

                    <span className="text-sm font-medium" style={{ color: tokens.text.primary }}>
                      {currentPage} / {selectedDoc.pageCount}
                    </span>

                    <button
                      onClick={() => setCurrentPage(Math.min(selectedDoc.pageCount, currentPage + 1))}
                      disabled={currentPage === selectedDoc.pageCount}
                      className="p-2 rounded-lg transition-colors cursor-pointer flex items-center gap-2"
                      style={{
                        color: currentPage === selectedDoc.pageCount ? tokens.text.muted : tokens.text.primary,
                        backgroundColor: currentPage === selectedDoc.pageCount ? 'transparent' : tokens.surface.card,
                        opacity: currentPage === selectedDoc.pageCount ? tokens.interaction.disabled.opacity : '1',
                      }}
                      onMouseEnter={(e) => {
                        if (currentPage < selectedDoc.pageCount) {
                          e.currentTarget.style.backgroundColor = tokens.interaction.hover.bg;
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (currentPage < selectedDoc.pageCount) {
                          e.currentTarget.style.backgroundColor = tokens.surface.card;
                        }
                      }}
                    >
                      <span className="text-sm font-medium">Next</span>
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer - Progress & Actions - Sticky */}
        <div
          className="border-t"
          style={{
            backgroundColor: tokens.surface.card,
            borderColor: tokens.border.soft,
            boxShadow: '0 -4px 6px -1px rgba(0, 0, 0, 0.05)',
          }}
        >
          <div className="px-8 py-5 flex items-center justify-between">
            {/* Left - Progress & Navigation */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium" style={{ color: tokens.text.primary }}>
                  Progress:
                </span>
                <div className="flex items-center gap-2">
                  <div
                    className="h-2 w-48 rounded-full overflow-hidden"
                    style={{ backgroundColor: tokens.surface.app }}
                  >
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${(completedFields / totalFields) * 100}%`,
                        backgroundColor: tokens.brand.primary,
                      }}
                    />
                  </div>
                  <span className="text-sm font-semibold" style={{ color: tokens.text.primary }}>
                    {completedFields} / {totalFields} fields
                  </span>
                </div>
              </div>

              {/* Up/Down arrows to jump fields */}
              <div className="flex items-center gap-1 ml-4">
                <button
                  onClick={handlePreviousField}
                  disabled={completedFields === 0}
                  className="p-1.5 rounded transition-colors cursor-pointer"
                  style={{
                    color: completedFields === 0 ? tokens.text.muted : tokens.text.primary,
                    backgroundColor: tokens.surface.app,
                    opacity: completedFields === 0 ? tokens.interaction.disabled.opacity : '1',
                  }}
                  onMouseEnter={(e) => {
                    if (completedFields > 0) {
                      e.currentTarget.style.backgroundColor = tokens.interaction.hover.bg;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (completedFields > 0) {
                      e.currentTarget.style.backgroundColor = tokens.surface.app;
                    }
                  }}
                  title="Previous field"
                >
                  <ArrowUp className="h-4 w-4" />
                </button>
                <button
                  onClick={handleNextRequiredField}
                  disabled={completedFields >= totalFields}
                  className="p-1.5 rounded transition-colors cursor-pointer"
                  style={{
                    color: completedFields >= totalFields ? tokens.text.muted : tokens.text.primary,
                    backgroundColor: tokens.surface.app,
                    opacity: completedFields >= totalFields ? tokens.interaction.disabled.opacity : '1',
                  }}
                  onMouseEnter={(e) => {
                    if (completedFields < totalFields) {
                      e.currentTarget.style.backgroundColor = tokens.interaction.hover.bg;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (completedFields < totalFields) {
                      e.currentTarget.style.backgroundColor = tokens.surface.app;
                    }
                  }}
                  title="Next required field"
                >
                  <ArrowDown className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Right - Primary CTA */}
            <button
              onClick={completedFields >= totalFields ? handleComplete : handleNextRequiredField}
              className="flex items-center gap-2 px-8 py-3 rounded-xl font-semibold transition-all cursor-pointer"
              style={{
                backgroundColor: completedFields >= totalFields ? tokens.brand.primary : tokens.text.primary,
                color: tokens.text.inverse,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-1px)';
                e.currentTarget.style.boxShadow = '0 10px 20px -10px rgba(16, 185, 129, 0.5)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <span>
                {completedFields >= totalFields ? 'Complete Signing' : 'Next Required Field'}
              </span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Signature Creation Modal */}
      <CeremonySignatureModal
        isOpen={showSignatureModal}
        onClose={() => setShowSignatureModal(false)}
        onSave={handleSaveSignature}
        participantName={participantName}
      />
    </>
  );
}