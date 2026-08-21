import { useExternalTheme } from '../../../contexts/ExternalThemeContext';
import { FileText, CheckCircle2, Clock, Upload, X, Eye, Download } from 'lucide-react';

interface Document {
  id: string;
  name: string;
  pageCount: number;
  status: 'pending' | 'in-progress' | 'completed';
  fieldCount?: number; // For E-Sign: total fields
  completedFieldCount?: number; // For E-Sign: completed fields
}

interface UploadedFile {
  name: string;
  size: number;
  uploadedAt?: string;
}

interface DocumentSidebarProps {
  documents: Document[];
  activeDocumentId: string;
  onDocumentSelect: (documentId: string) => void;
  showFieldCounts?: boolean; // Show field counts for E-Sign
  
  // Upload functionality (Secure Share)
  allowUpload?: boolean;
  uploadRequired?: boolean;
  uploadedFiles?: UploadedFile[];
  onFileSelect?: (files: FileList) => void;
  onFileRemove?: (index: number) => void;
  isDragging?: boolean;
  onDragStateChange?: (isDragging: boolean) => void;

  /** Below lg the sidebar is off-canvas; these drive the drawer. */
  open?: boolean;
  onClose?: () => void;
}

export function DocumentSidebar({
  documents,
  activeDocumentId,
  onDocumentSelect,
  showFieldCounts = false,
  allowUpload = false,
  uploadRequired = false,
  uploadedFiles = [],
  onFileSelect,
  onFileRemove,
  isDragging = false,
  onDragStateChange,
  open = false,
  onClose,
}: DocumentSidebarProps) {
  const { tokens } = useExternalTheme();

  const getStatusColor = (status: Document['status']) => {
    switch (status) {
      case 'completed':
        return tokens.status.success;
      case 'in-progress':
        return tokens.brand.primary;
      case 'pending':
      default:
        return tokens.text.muted;
    }
  };

  const getStatusLabel = (status: Document['status']) => {
    switch (status) {
      case 'completed':
        return 'Completed';
      case 'in-progress':
        return 'In Progress';
      case 'pending':
      default:
        return 'Pending';
    }
  };

  const getStatusIcon = (status: Document['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="h-3.5 w-3.5" />;
      case 'in-progress':
        return <Clock className="h-3.5 w-3.5" />;
      case 'pending':
      default:
        return <Clock className="h-3.5 w-3.5" />;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && onFileSelect) {
      onFileSelect(e.target.files);
    }
  };

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}
      <div
        className={`absolute inset-y-0 left-0 z-40 w-80 max-w-[85vw] border-r flex-shrink-0 overflow-y-auto flex flex-col transition-transform duration-200 lg:static lg:max-w-none lg:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{
          backgroundColor: tokens.surface.card,
          borderColor: tokens.border.soft,
        }}
      >
      {/* Sent Documents Section */}
      <div className="flex-shrink-0">
        <div className="p-4 border-b" style={{ borderColor: tokens.border.soft }}>
          <h3 className="text-sm font-semibold" style={{ color: tokens.text.primary }}>
            {allowUpload ? 'Sent Documents' : 'Documents'} ({documents.length})
          </h3>
        </div>

        {/* Document List */}
        <div className="p-3 space-y-2">
          {documents.map((doc) => {
            const isActive = doc.id === activeDocumentId;

            return (
              <button
                key={doc.id}
                onClick={() => onDocumentSelect(doc.id)}
                className="w-full text-left p-3 rounded-lg transition-all cursor-pointer"
                style={{
                  backgroundColor: isActive ? `${tokens.brand.primary}15` : 'transparent',
                  borderWidth: isActive ? '2px' : '1px',
                  borderStyle: 'solid',
                  borderColor: isActive ? tokens.brand.primary : tokens.border.soft,
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
                {/* Document Icon & Name */}
                <div className="flex items-start gap-2 mb-2">
                  <FileText
                    className="h-4 w-4 flex-shrink-0 mt-0.5"
                    style={{ color: isActive ? tokens.brand.primary : tokens.text.muted }}
                  />
                  <p
                    className="text-sm font-medium leading-tight flex-1"
                    style={{ color: tokens.text.primary }}
                  >
                    {doc.name}
                  </p>
                </div>

                {/* Metadata Row */}
                <div className="flex items-center justify-between gap-2 text-xs">
                  {/* Pages */}
                  <span style={{ color: tokens.text.muted }}>
                    {doc.pageCount} {doc.pageCount === 1 ? 'page' : 'pages'}
                  </span>

                  {/* Status Badge */}
                  <div
                    className="flex items-center gap-1 px-2 py-0.5 rounded-full"
                    style={{
                      backgroundColor: `${getStatusColor(doc.status)}20`,
                      color: getStatusColor(doc.status),
                    }}
                  >
                    {getStatusIcon(doc.status)}
                    <span className="font-medium">{getStatusLabel(doc.status)}</span>
                  </div>
                </div>

                {/* Field Count (E-Sign only) */}
                {showFieldCounts && doc.fieldCount !== undefined && (
                  <div className="mt-2 pt-2 border-t" style={{ borderColor: tokens.border.soft }}>
                    <div className="flex items-center justify-between text-xs">
                      <span style={{ color: tokens.text.muted }}>Fields:</span>
                      <span
                        className="font-semibold"
                        style={{
                          color:
                            doc.completedFieldCount === doc.fieldCount
                              ? tokens.status.success
                              : tokens.text.primary,
                        }}
                      >
                        {doc.completedFieldCount || 0} / {doc.fieldCount}
                      </span>
                    </div>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Your Uploaded Documents Section (Secure Share only) */}
      {allowUpload && (
        <div className="flex-1 flex flex-col border-t" style={{ borderColor: tokens.border.soft }}>
          {/* Section Header */}
          <div className="p-4 border-b flex-shrink-0" style={{ borderColor: tokens.border.soft }}>
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold" style={{ color: tokens.text.primary }}>
                Your Uploaded Documents {uploadRequired && <span style={{ color: tokens.status.warning }}>*</span>}
              </h3>
              {uploadedFiles.length > 0 && (
                <span className="text-xs font-medium" style={{ color: tokens.text.muted }}>
                  {uploadedFiles.length}
                </span>
              )}
            </div>
          </div>

          {/* Uploaded Files List */}
          {uploadedFiles.length > 0 && (
            <div className="p-3 space-y-2 flex-shrink-0">
              {uploadedFiles.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 rounded-lg"
                  style={{
                    backgroundColor: tokens.surface.elevated,
                    borderWidth: '1px',
                    borderStyle: 'solid',
                    borderColor: tokens.border.soft,
                  }}
                >
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <CheckCircle2 className="h-4 w-4 flex-shrink-0" style={{ color: tokens.status.success }} />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium truncate" style={{ color: tokens.text.primary }}>
                        {file.name}
                      </p>
                      <p className="text-xs" style={{ color: tokens.text.muted }}>
                        {formatFileSize(file.size)}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => onFileRemove?.(index)}
                    className="p-1 rounded transition-colors cursor-pointer flex-shrink-0 ml-2"
                    style={{ color: tokens.text.muted }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = tokens.status.warning;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = tokens.text.muted;
                    }}
                    title="Remove"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Upload Area */}
          <div className="p-3 flex-shrink-0">
            <div
              className="border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer"
              style={{
                borderColor: isDragging ? tokens.brand.primary : tokens.border.soft,
                backgroundColor: isDragging ? `${tokens.brand.primary}10` : 'transparent',
              }}
              onDragOver={(e) => {
                e.preventDefault();
                onDragStateChange?.(true);
              }}
              onDragLeave={() => onDragStateChange?.(false)}
              onDrop={(e) => {
                e.preventDefault();
                onDragStateChange?.(false);
                if (e.dataTransfer.files && onFileSelect) {
                  onFileSelect(e.dataTransfer.files);
                }
              }}
              onClick={() => document.getElementById('sidebar-file-upload')?.click()}
            >
              <Upload className="h-6 w-6 mx-auto mb-2" style={{ color: tokens.text.muted }} />
              <p className="text-xs font-medium mb-1" style={{ color: tokens.text.primary }}>
                Drop files or click
              </p>
              <p className="text-xs" style={{ color: tokens.text.muted }}>
                PDF, DOCX, JPG, PNG
              </p>
              <input
                id="sidebar-file-upload"
                type="file"
                multiple
                accept=".pdf,.docx,.jpg,.jpeg,.png"
                onChange={handleFileInputChange}
                className="hidden"
              />
            </div>
          </div>
        </div>
      )}
      </div>
    </>
  );
}
