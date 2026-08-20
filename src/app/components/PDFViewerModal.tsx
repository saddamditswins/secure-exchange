import { useState, useEffect } from 'react';
import { X, Download, ZoomIn, ZoomOut, ChevronLeft, ChevronRight } from 'lucide-react';
import { downloadDummyPDF, inferDocumentType, createPDFPreviewURL, type DocumentType } from '../utils/pdfUtils';

interface PDFViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  filename: string;
  documentType?: DocumentType;
  metadata?: {
    workspaceId?: string;
    exchangeId?: string;
    documentId?: string;
    participantName?: string;
    participantEmail?: string;
    timestamp?: string;
  };
}

export function PDFViewerModal({
  isOpen,
  onClose,
  filename,
  documentType,
  metadata = {}
}: PDFViewerModalProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [zoom, setZoom] = useState(100);
  const [pdfUrl, setPdfUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const totalPages = 3; // Mock total pages
  const inferredDocType = documentType || inferDocumentType(filename);

  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      setError(null);
      
      try {
        // Generate PDF preview URL
        const url = createPDFPreviewURL(inferredDocType, filename, metadata);
        setPdfUrl(url);
        
        // Simulate loading delay for realism
        setTimeout(() => {
          setIsLoading(false);
        }, 500);
      } catch (err) {
        setError('Unable to load document');
        setIsLoading(false);
      }
    } else {
      // Cleanup URL when modal closes
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
        setPdfUrl('');
      }
      setCurrentPage(1);
      setZoom(100);
    }
  }, [isOpen, filename, inferredDocType]);

  const handleDownload = () => {
    downloadDummyPDF(inferredDocType, filename, metadata);
  };

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 25, 200));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 25, 50));
  };

  const handlePrevPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-5xl h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-neutral-200">
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-medium text-neutral-900 truncate">{filename}</h2>
            <p className="text-sm text-neutral-500">PDF Document</p>
          </div>
          <div className="flex items-center gap-2 ml-4">
            <button
              onClick={handleDownload}
              className="px-3 py-2 bg-neutral-900 text-[#FFFFFF] rounded-lg hover:bg-neutral-800 transition-colors flex items-center gap-2 cursor-pointer"
              title="Download"
            >
              <Download className="w-4 h-4" />
              Download
            </button>
            <button
              onClick={onClose}
              className="p-2 text-neutral-400 hover:text-neutral-900 rounded-lg hover:bg-neutral-100 transition-colors cursor-pointer"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-200 bg-neutral-50">
          {/* Page Navigation */}
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className="p-2 text-neutral-600 hover:text-neutral-900 rounded-lg hover:bg-neutral-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              title="Previous Page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="text-sm text-neutral-700">
              Page <span className="font-medium">{currentPage}</span> of <span className="font-medium">{totalPages}</span>
            </div>
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className="p-2 text-neutral-600 hover:text-neutral-900 rounded-lg hover:bg-neutral-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              title="Next Page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Zoom Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleZoomOut}
              disabled={zoom === 50}
              className="p-2 text-neutral-600 hover:text-neutral-900 rounded-lg hover:bg-neutral-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <div className="text-sm text-neutral-700 min-w-[60px] text-center font-medium">
              {zoom}%
            </div>
            <button
              onClick={handleZoomIn}
              disabled={zoom === 200}
              className="p-2 text-neutral-600 hover:text-neutral-900 rounded-lg hover:bg-neutral-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* PDF Content Area */}
        <div className="flex-1 overflow-auto bg-neutral-100 p-4">
          {isLoading && (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="w-12 h-12 border-4 border-neutral-300 border-t-neutral-900 rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-neutral-600">Loading document...</p>
              </div>
            </div>
          )}

          {error && (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <X className="w-6 h-6 text-red-600" />
                </div>
                <p className="text-neutral-900 font-medium mb-2">Unable to load document</p>
                <p className="text-neutral-600 text-sm">{error}</p>
              </div>
            </div>
          )}

          {!isLoading && !error && pdfUrl && (
            <div className="flex justify-center">
              <div 
                className="bg-white shadow-lg"
                style={{ 
                  transform: `scale(${zoom / 100})`,
                  transformOrigin: 'top center',
                  transition: 'transform 0.2s ease-in-out'
                }}
              >
                {/* PDF Preview - Using iframe for simple PDF display */}
                <iframe
                  src={pdfUrl}
                  className="w-[612px] h-[792px] border-0"
                  title={filename}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
