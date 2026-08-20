import { useState, useRef } from 'react';
import { useExternalTheme } from '../../../contexts/ExternalThemeContext';
import { ExternalCard } from './ExternalCard';
import {
  FileText,
  Download,
  CheckCircle2,
  Clock,
  ChevronUp,
  ChevronDown,
  PenLine,
} from 'lucide-react';
import { SignatureCreationModal } from './SignatureCreationModal';

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

interface ESignSigningViewProps {
  participantName: string;
  documents: Document[];
  onComplete: () => void;
  showCreateSignature?: boolean;
}

export function ESignSigningView({
  participantName,
  documents: initialDocuments,
  onComplete,
  showCreateSignature = true,
}: ESignSigningViewProps) {
  const { tokens } = useExternalTheme();
  const [documents, setDocuments] = useState(initialDocuments);
  const [selectedDocIndex, setSelectedDocIndex] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [showSignatureModal, setShowSignatureModal] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);
  const [signatureData, setSignatureData] = useState('');
  const [initialsData, setInitialsData] = useState('');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const selectedDoc = documents[selectedDocIndex];
  const allFields = documents.flatMap((doc) => doc.fields);
  const completedFields = allFields.filter((f) => f.completed).length;
  const totalFields = allFields.length;
  const currentPageFields = selectedDoc.fields.filter((f) => f.page === currentPage);

  const handleSaveSignature = (sig: string, init: string) => {
    setSignatureData(sig);
    setInitialsData(init);
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
      }))
    );

    // Move to next incomplete field
    const nextField = findNextIncompleteField();
    if (nextField) {
      const docIndex = documents.findIndex((doc) =>
        doc.fields.some((f) => f.id === nextField.id)
      );
      setSelectedDocIndex(docIndex);
      setCurrentPage(nextField.page);
    }
  };

  const findNextIncompleteField = (): SignatureField | null => {
    for (const doc of documents) {
      const incompleteField = doc.fields.find((f) => !f.completed);
      if (incompleteField) return incompleteField;
    }
    return null;
  };

  const handleNavigateField = (direction: 'up' | 'down') => {
    const allFieldsSorted = documents.flatMap((doc, docIdx) =>
      doc.fields.map((field) => ({ ...field, docIdx }))
    );

    const currentFieldIndex = allFieldsSorted.findIndex(
      (f) => f.docIdx === selectedDocIndex && f.page === currentPage
    );

    if (direction === 'down' && currentFieldIndex < allFieldsSorted.length - 1) {
      const nextField = allFieldsSorted[currentFieldIndex + 1];
      setSelectedDocIndex(nextField.docIdx);
      setCurrentPage(nextField.page);
    } else if (direction === 'up' && currentFieldIndex > 0) {
      const prevField = allFieldsSorted[currentFieldIndex - 1];
      setSelectedDocIndex(prevField.docIdx);
      setCurrentPage(prevField.page);
    }
  };

  const handleSubmit = () => {
    const allCompleted = allFields.every((f) => f.completed);
    if (!allCompleted) {
      alert('Please complete all required signature fields before submitting.');
      return;
    }
    onComplete();
  };

  const handleDownloadAll = () => {
    // Create dummy PDF
    const link = document.createElement('a');
    link.href = 'data:application/pdf;base64,JVBERi0xLjQKJeLjz9MKMSAwIG9iago8PC9UeXBlL0NhdGFsb2cvUGFnZXMgMiAwIFI+PgplbmRvYmoKMiAwIG9iago8PC9UeXBlL1BhZ2VzL0NvdW50IDEvS2lkc1szIDAgUl0+PgplbmRvYmoKMyAwIG9iago8PC9UeXBlL1BhZ2UvTWVkaWFCb3hbMCAwIDYxMiA3OTJdL1BhcmVudCAyIDAgUi9SZXNvdXJjZXM8PD4+Pj4KZW5kb2JqCnhyZWYKMCA0CjAwMDAwMDAwMDAgNjU1MzUgZiAKMDAwMDAwMDAxNSAwMDAwMCBuIAowMDAwMDAwMDY0IDAwMDAwIG4gCjAwMDAwMDAxMjEgMDAwMDAgbiAKdHJhaWxlcgo8PC9TaXplIDQvUm9vdCAxIDAgUj4+CnN0YXJ0eHJlZgoyMDIKJSVFT0Y=';
    link.download = 'all-documents.pdf';
    link.click();
  };

  return (
    <>
      <div className="h-screen flex flex-col" style={{ backgroundColor: tokens.surface.app }}>
        {/* Header */}
        <div
          className="border-b px-6 py-4"
          style={{
            backgroundColor: tokens.surface.card,
            borderColor: tokens.border.soft,
          }}
        >
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
              {showCreateSignature && (
                <button
                  onClick={() => setShowSignatureModal(true)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all cursor-pointer"
                  style={{
                    backgroundColor: hasSignature ? `${tokens.status.success}20` : tokens.brand.primary,
                    color: hasSignature ? tokens.status.success : tokens.text.primary,
                    borderWidth: hasSignature ? '1px' : '0',
                    borderColor: hasSignature ? tokens.status.success : 'transparent',
                  }}
                  onMouseEnter={(e) => {
                    if (!hasSignature) {
                      e.currentTarget.style.transform = 'translateY(-1px)';
                      e.currentTarget.style.boxShadow = tokens.shadow.sm;
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <PenLine className="h-4 w-4" />
                  <span>{hasSignature ? 'Update Signature' : 'Create Signature'}</span>
                </button>
              )}

              <div>
                <p className="text-sm font-medium" style={{ color: tokens.text.primary }}>
                  Signing as: {participantName}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Sidebar - Documents List */}
          <div
            className="w-80 border-r overflow-y-auto"
            style={{
              backgroundColor: tokens.surface.card,
              borderColor: tokens.border.soft,
            }}
          >
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold" style={{ color: tokens.text.primary }}>
                  Documents
                </h2>
                <button
                  onClick={handleDownloadAll}
                  className="p-2 rounded-lg transition-colors cursor-pointer"
                  style={{ color: tokens.text.secondary }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = tokens.interaction.hover.bg;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                  title="Download All"
                >
                  <Download className="h-4 w-4" />
                </button>
              </div>

              <div className="space-y-2">
                {documents.map((doc, index) => {
                  const docCompletedFields = doc.fields.filter((f) => f.completed).length;
                  const docTotalFields = doc.fields.length;
                  const isCompleted = docCompletedFields === docTotalFields;
                  const isActive = index === selectedDocIndex;

                  return (
                    <button
                      key={doc.id}
                      onClick={() => setSelectedDocIndex(index)}
                      className="w-full p-3 rounded-lg text-left transition-colors cursor-pointer"
                      style={{
                        backgroundColor: isActive ? tokens.surface.elevated : 'transparent',
                        borderWidth: '1px',
                        borderColor: isActive ? tokens.brand.primary : 'transparent',
                      }}
                      onMouseEnter={(e) => {
                        if (!isActive) {
                          e.currentTarget.style.backgroundColor = tokens.interaction.hover.bg;
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isActive) {
                          e.currentTarget.style.backgroundColor = 'transparent';
                        }
                      }}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className="mt-1"
                          style={{
                            color: isCompleted ? tokens.status.success : tokens.text.muted,
                          }}
                        >
                          {isCompleted ? (
                            <CheckCircle2 className="h-5 w-5" />
                          ) : (
                            <Clock className="h-5 w-5" />
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate" style={{ color: tokens.text.primary }}>
                            {doc.name}
                          </p>
                          <p className="text-sm" style={{ color: tokens.text.muted }}>
                            {docCompletedFields} / {docTotalFields} fields
                          </p>
                          <p className="text-xs" style={{ color: tokens.text.muted }}>
                            {doc.pageCount} pages
                          </p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Center - Document Canvas */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="max-w-4xl mx-auto">
              <ExternalCard>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold" style={{ color: tokens.text.primary }}>
                      {selectedDoc.name}
                    </h3>
                    <span className="text-sm" style={{ color: tokens.text.muted }}>
                      Page {currentPage} of {selectedDoc.pageCount}
                    </span>
                  </div>

                  {/* Document Preview Area */}
                  <div
                    className="relative rounded-lg overflow-hidden"
                    style={{
                      backgroundColor: tokens.surface.elevated,
                      minHeight: '600px',
                    }}
                  >
                    {/* Dummy PDF Page */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <FileText
                        className="h-32 w-32"
                        style={{ color: tokens.text.muted, opacity: '0.2' }}
                      />
                    </div>

                    {/* Signature Fields */}
                    {currentPageFields.map((field) => (
                      <div
                        key={field.id}
                        className="absolute border-2 border-dashed cursor-pointer transition-all"
                        style={{
                          left: `${field.x}%`,
                          top: `${field.y}%`,
                          width: `${field.width}%`,
                          height: `${field.height}%`,
                          borderColor: field.completed ? tokens.status.success : tokens.brand.primary,
                          backgroundColor: field.completed
                            ? `${tokens.status.success}10`
                            : `${tokens.brand.primary}10`,
                        }}
                        onClick={() => handleFieldClick(field.id)}
                        onMouseEnter={(e) => {
                          if (!field.completed) {
                            e.currentTarget.style.backgroundColor = `${tokens.brand.primary}20`;
                          }
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = field.completed
                            ? `${tokens.status.success}10`
                            : `${tokens.brand.primary}10`;
                        }}
                      >
                        <div className="h-full flex items-center justify-center p-2">
                          {field.completed ? (
                            <CheckCircle2 className="h-5 w-5" style={{ color: tokens.status.success }} />
                          ) : (
                            <span className="text-xs font-medium" style={{ color: tokens.brand.primary }}>
                              Click to {field.type === 'signature' ? 'Sign' : field.type === 'initials' ? 'Initial' : 'Date'}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Page Navigation */}
                  {selectedDoc.pageCount > 1 && (
                    <div className="flex items-center justify-center gap-4">
                      <button
                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                        className="px-4 py-2 rounded-lg font-medium border transition-colors cursor-pointer"
                        style={{
                          borderColor: tokens.border.soft,
                          color: tokens.text.primary,
                          opacity: currentPage === 1 ? tokens.interaction.disabled.opacity : '1',
                        }}
                      >
                        Previous
                      </button>
                      <span className="text-sm" style={{ color: tokens.text.secondary }}>
                        Page {currentPage} of {selectedDoc.pageCount}
                      </span>
                      <button
                        onClick={() => setCurrentPage(Math.min(selectedDoc.pageCount, currentPage + 1))}
                        disabled={currentPage === selectedDoc.pageCount}
                        className="px-4 py-2 rounded-lg font-medium border transition-colors cursor-pointer"
                        style={{
                          borderColor: tokens.border.soft,
                          color: tokens.text.primary,
                          opacity: currentPage === selectedDoc.pageCount ? tokens.interaction.disabled.opacity : '1',
                        }}
                      >
                        Next
                      </button>
                    </div>
                  )}
                </div>
              </ExternalCard>
            </div>
          </div>
        </div>

        {/* Footer - Field Navigation */}
        <div
          className="border-t px-6 py-4"
          style={{
            backgroundColor: tokens.surface.card,
            borderColor: tokens.border.soft,
          }}
        >
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium" style={{ color: tokens.text.primary }}>
                Fields: {completedFields} / {totalFields} completed
              </span>

              {/* Field Navigation Arrows */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleNavigateField('up')}
                  className="p-2 rounded-lg transition-colors cursor-pointer"
                  style={{
                    backgroundColor: tokens.surface.elevated,
                    color: tokens.text.primary,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = tokens.interaction.hover.bg;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = tokens.surface.elevated;
                  }}
                  title="Previous Field"
                >
                  <ChevronUp className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleNavigateField('down')}
                  className="p-2 rounded-lg transition-colors cursor-pointer"
                  style={{
                    backgroundColor: tokens.surface.elevated,
                    color: tokens.text.primary,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = tokens.interaction.hover.bg;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = tokens.surface.elevated;
                  }}
                  title="Next Field"
                >
                  <ChevronDown className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={completedFields < totalFields}
              className="px-6 py-2 rounded-lg font-medium transition-all cursor-pointer"
              style={{
                backgroundColor: tokens.brand.primary,
                color: tokens.text.primary,
                opacity: completedFields < totalFields ? tokens.interaction.disabled.opacity : '1',
              }}
              onMouseEnter={(e) => {
                if (completedFields >= totalFields) {
                  e.currentTarget.style.transform = 'translateY(-1px)';
                  e.currentTarget.style.boxShadow = tokens.shadow.md;
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              {completedFields < totalFields ? 'Complete All Fields' : 'Submit Signatures'}
            </button>
          </div>
        </div>
      </div>

      {/* Signature Creation Modal */}
      <SignatureCreationModal
        isOpen={showSignatureModal}
        onClose={() => setShowSignatureModal(false)}
        onSave={handleSaveSignature}
        participantName={participantName}
      />
    </>
  );
}
