import { useState } from 'react';
import { useExternalTheme } from '../../../contexts/ExternalThemeContext';
import {
  Download,
  Eye,
  Calendar,
  ArrowRight,
  Upload as UploadIcon,
  AlertCircle,
  PanelLeft,
} from 'lucide-react';
import { DocumentSidebar } from '../external-ceremony/DocumentSidebar';
import { DummyPDFDocument } from '../external-ceremony/DummyPDFDocument';

interface Document {
  id: string;
  name: string;
  size?: string;
  pageCount?: number;
}

interface SecureShareDocumentsViewProps {
  exchangeTitle: string;
  exchangeDescription?: string;
  expiresAt?: string;
  allowDownload: boolean;
  allowUpload: boolean;
  uploadRequired?: boolean;
  documents: Document[];
  onSubmit: (uploadedFiles: File[]) => void;
}

export function SecureShareDocumentsView({
  exchangeTitle,
  exchangeDescription,
  expiresAt,
  allowDownload,
  allowUpload,
  uploadRequired = false,
  documents,
  onSubmit,
}: SecureShareDocumentsViewProps) {
  const { tokens } = useExternalTheme();
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [selectedDocIndex, setSelectedDocIndex] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  // The document list is an off-canvas drawer below lg.
  const [showDocList, setShowDocList] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const selectedDoc = documents[selectedDocIndex];

  const handleFileSelect = (files: FileList) => {
    const newFiles = Array.from(files);
    setUploadedFiles((prev) => [...prev, ...newFiles]);
  };

  const handleRemoveFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleDownload = (doc: Document) => {
    // Create dummy PDF
    const link = document.createElement('a');
    link.href = 'data:application/pdf;base64,JVBERi0xLjQKJeLjz9MKMSAwIG9iago8PC9UeXBlL0NhdGFsb2cvUGFnZXMgMiAwIFI+PgplbmRvYmoKMiAwIG9iago8PC9UeXBlL1BhZ2VzL0NvdW50IDEvS2lkc1szIDAgUl0+PgplbmRvYmoKMyAwIG9iago8PC9UeXBlL1BhZ2UvTWVkaWFCb3hbMCAwIDYxMiA3OTJdL1BhcmVudCAyIDAgUi9SZXNvdXJjZXM8PD4+Pj4KZW5kb2JqCnhyZWYKMCA0CjAwMDAwMDAwMDAgNjU1MzUgZiAKMDAwMDAwMDAxNSAwMDAwMCBuIAowMDAwMDAwMDY0IDAwMDAwIG4gCjAwMDAwMDAxMjEgMDAwMDAgbiAKdHJhaWxlcgo8PC9TaXplIDQvUm9vdCAxIDAgUj4+CnN0YXJ0eHJlZgoyMDIKJSVFT0Y=';
    link.download = doc.name;
    link.click();
  };

  const handleSubmit = () => {
    if (uploadRequired && uploadedFiles.length === 0) {
      alert('Please upload at least one document before submitting.');
      return;
    }
    onSubmit(uploadedFiles);
  };

  const handleDocumentSelect = (documentId: string) => {
    const docIndex = documents.findIndex((d) => d.id === documentId);
    if (docIndex !== -1) {
      setSelectedDocIndex(docIndex);
      setCurrentPage(1);
      setShowDocList(false);
    }
  };

  // Prepare sidebar documents
  const sidebarDocuments = documents.map((doc) => ({
    id: doc.id,
    name: doc.name,
    pageCount: doc.pageCount || 1,
    status: 'pending' as const,
  }));

  // Prepare uploaded files for sidebar
  const sidebarUploadedFiles = uploadedFiles.map((file) => ({
    name: file.name,
    size: file.size,
  }));

  return (
    <div className="flex flex-col flex-1" style={{ backgroundColor: tokens.surface.app }}>
      {/* Exchange Info Bar */}
      <div
        className="border-b px-6 py-4"
        style={{
          backgroundColor: tokens.surface.card,
          borderColor: tokens.border.soft,
        }}
      >
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h1 className="text-xl font-bold mb-1" style={{ color: tokens.text.primary }}>
              {exchangeTitle}
            </h1>
            {exchangeDescription && (
              <p className="text-sm" style={{ color: tokens.text.secondary }}>
                {exchangeDescription}
              </p>
            )}
          </div>

          {/* Info Pills */}
          <div className="flex items-center gap-4 text-sm" style={{ color: tokens.text.muted }}>
            {expiresAt && (
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>Expires: {expiresAt}</span>
              </div>
            )}
            <div className="flex items-center gap-1">
              <Eye className="h-4 w-4" />
              <span>View</span>
            </div>
            {allowDownload && (
              <div className="flex items-center gap-1">
                <Download className="h-4 w-4" />
                <span>Download</span>
              </div>
            )}
            {allowUpload && (
              <div className="flex items-center gap-1">
                <UploadIcon className="h-4 w-4" />
                <span>Upload {uploadRequired ? 'Required' : 'Allowed'}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content - Sidebar + Preview */}
      <div className="relative flex flex-1 overflow-hidden">
        {/* Left Sidebar - Document List + Uploads */}
        <DocumentSidebar
          documents={sidebarDocuments}
          activeDocumentId={selectedDoc.id}
          onDocumentSelect={handleDocumentSelect}
          showFieldCounts={false}
          allowUpload={allowUpload}
          uploadRequired={uploadRequired}
          uploadedFiles={sidebarUploadedFiles}
          onFileSelect={handleFileSelect}
          onFileRemove={handleRemoveFile}
          isDragging={isDragging}
          onDragStateChange={setIsDragging}
          open={showDocList}
          onClose={() => setShowDocList(false)}
        />

        {/* Main Preview Area - Full Width, Clean */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4 sm:p-6 lg:p-8">
            <button
              onClick={() => setShowDocList(true)}
              className="mb-4 inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium lg:hidden"
              style={{ borderColor: tokens.border.soft, color: tokens.text.primary }}
            >
              <PanelLeft className="h-4 w-4" />
              All documents
            </button>
            {/* Document Header */}
            <div className="mb-6 flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-xl sm:text-2xl font-bold" style={{ color: tokens.text.primary }}>
                {selectedDoc.name}
              </h2>
              <div className="flex items-center gap-2">
                {allowDownload && (
                  <button
                    onClick={() => handleDownload(selectedDoc)}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all cursor-pointer"
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
                  >
                    <Download className="h-4 w-4" />
                    <span className="text-sm font-medium">Download</span>
                  </button>
                )}
              </div>
            </div>

            {/* Document Preview - Clean, centered */}
            <div
              className="rounded-2xl overflow-hidden relative max-w-5xl mx-auto"
              style={{
                backgroundColor: tokens.surface.card,
                boxShadow: tokens.shadow.md,
              }}
            >
              <DummyPDFDocument pageNumber={currentPage} documentName={selectedDoc.name} />
            </div>
          </div>
        </div>
      </div>

      {/* Footer - Actions - Sticky */}
      <div
        className="border-t"
        style={{
          backgroundColor: tokens.surface.card,
          borderColor: tokens.border.soft,
          boxShadow: '0 -4px 6px -1px rgba(0, 0, 0, 0.05)',
        }}
      >
        <div className="px-8 py-5 flex items-center justify-between">
          {/* Left - Document Count & Upload Status */}
          <div className="flex items-center gap-4">
            <div className="text-sm" style={{ color: tokens.text.muted }}>
              {documents.length} {documents.length === 1 ? 'document' : 'documents'} available
            </div>
            
            {allowUpload && (
              <>
                <div className="h-4 w-px" style={{ backgroundColor: tokens.border.soft }} />
                <div className="text-sm" style={{ color: tokens.text.muted }}>
                  {uploadedFiles.length > 0 ? (
                    <span style={{ color: tokens.text.primary }}>
                      {uploadedFiles.length} uploaded
                    </span>
                  ) : (
                    <span>No uploads yet</span>
                  )}
                </div>
              </>
            )}

            {/* Upload Required Warning */}
            {uploadRequired && uploadedFiles.length === 0 && (
              <>
                <div className="h-4 w-px" style={{ backgroundColor: tokens.border.soft }} />
                <div className="flex items-center gap-2 text-sm" style={{ color: tokens.status.warning }}>
                  <AlertCircle className="h-4 w-4" />
                  <span>Upload required to continue</span>
                </div>
              </>
            )}
          </div>

          {/* Right - Primary CTA */}
          <button
            onClick={handleSubmit}
            disabled={uploadRequired && uploadedFiles.length === 0}
            className="flex items-center gap-2 px-8 py-3 rounded-xl font-semibold transition-all cursor-pointer"
            style={{
              backgroundColor: uploadRequired && uploadedFiles.length === 0 
                ? tokens.surface.app 
                : tokens.brand.primary,
              color: uploadRequired && uploadedFiles.length === 0 
                ? tokens.text.muted 
                : tokens.text.inverse,
              opacity: uploadRequired && uploadedFiles.length === 0 
                ? tokens.interaction.disabled.opacity 
                : '1',
            }}
            onMouseEnter={(e) => {
              if (!(uploadRequired && uploadedFiles.length === 0)) {
                e.currentTarget.style.transform = 'translateY(-1px)';
                e.currentTarget.style.boxShadow = '0 10px 20px -10px rgba(16, 185, 129, 0.5)';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <span>Submit</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}