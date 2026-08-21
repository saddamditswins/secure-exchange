import type { Exchange } from '../App';
import { useState, useEffect } from 'react';
import { 
  ArrowLeft, Upload, Share2, Search, Filter, MoreHorizontal, 
  Eye, Download, Trash2, FileText, X, CheckCircle, Clock, ChevronDown, Archive, Users, Hash, CloudDownload,
  Library, FileSignature, EllipsisVertical, History, User
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
} from './ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { SecureShareModal } from './SecureShareModal';
import { ESignPreparationModal } from './ESignPreparationModal';
import { ESignEditorView } from './ESignEditorView';
import { ExchangeDetailView } from './ExchangeDetailView';
import { ESignPacketDetailView } from './ESignPacketDetailView';
import { ExchangesView } from './ExchangesView';
import { DocumentUploadModal } from './DocumentUploadModal';
import { DocumentLibrarySelectorModal } from './DocumentLibrarySelectorModal';
import { PDFPreviewModal } from './PDFPreviewModal';
import { downloadDummyPDF, inferDocumentType } from '../utils/pdfUtils';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { Document as LibraryDocument } from './DocumentsView';

interface Document {
  id: string;
  name: string;
  type: string;
  size: number;
  status: 'Ready' | 'Processing' | 'Error';
  updatedAt: string;
  updatedBy: string;
  downloadable: boolean;
  documentType: 'Uploaded' | 'Received';
}

interface SigningPacket {
  id: string;
  name: string;
  status: 'Draft' | 'Pending' | 'In Progress' | 'Completed';
  participants: Array<{ name: string; email: string; status: 'Pending' | 'Completed' }>;
  updatedAt: string;
  documentNames: string[];
  createdBy: string;
}

interface AuditEvent {
  id: string;
  timestamp: string;
  actor: string;
  action: string;
  target: string;
  details: string;
}

interface WorkspaceDetailsViewProps {
  workspaceId: string;
  workspaceName: string;
  description: string;
  initialDocuments?: File[];
  dealId?: string | null;
  onBack: () => void;
  initialTab?: 'documents' | 'exchanges' | 'esign' | 'audit';
  userRole?: 'Tenant Admin' | 'Primary Operations User';
  onESignEditorStateChange?: (isOpen: boolean) => void;
}

const AVAILABLE_STAFF = ['John Doe', 'Jane Smith', 'Alice Johnson', 'Bob Brown', 'Charlie Davis', 'David Wilson', 'Eve Anderson', 'System'];

export function WorkspaceDetailsView({
  workspaceId,
  workspaceName,
  description,
  initialDocuments = [],
  dealId,
  onBack,
  initialTab = 'documents',
  userRole,
  onESignEditorStateChange,
}: WorkspaceDetailsViewProps) {
  const { t } = useTranslation();
  
  // -- State --
  const [activeTab, setActiveTab] = useState<'documents' | 'exchanges' | 'esign' | 'audit'>(initialTab);
  const [documents, setDocuments] = useState<Document[]>(() => {
    if (initialDocuments.length > 0) {
      return initialDocuments.map((file, index) => ({
        id: `DOC-${Date.now()}-${index}`,
        name: file.name,
        type: file.name.split('.').pop()?.toUpperCase() || 'UNKNOWN',
        size: file.size,
        status: 'Ready' as const,
        updatedAt: new Date().toISOString(),
        updatedBy: 'James Rodriguez',
        downloadable: true,
        documentType: 'Uploaded'
      }));
    }
    return [
      { id: 'DOC-2024-001', name: 'Credit Application.pdf', type: 'PDF', size: 245680, status: 'Ready', updatedAt: '2024-12-28T10:30:00Z', updatedBy: 'John Doe', downloadable: true, documentType: 'Uploaded' },
      { id: 'DOC-2024-002', name: 'Purchase Agreement.pdf', type: 'PDF', size: 512000, status: 'Ready', updatedAt: '2024-12-28T11:15:00Z', updatedBy: 'John Doe', downloadable: true, documentType: 'Uploaded' },
      { id: 'DOC-2024-003', name: 'Vehicle Inspection Report.pdf', type: 'PDF', size: 189440, status: 'Ready', updatedAt: '2024-12-28T14:20:00Z', updatedBy: 'Jane Smith', downloadable: true, documentType: 'Received' },
      { id: 'DOC-2024-004', name: 'Insurance Verification.docx', type: 'DOCX', size: 45120, status: 'Ready', updatedAt: '2024-12-29T09:00:00Z', updatedBy: 'John Doe', downloadable: true, documentType: 'Uploaded' },
      { id: 'DOC-2024-005', name: 'Trade-In Appraisal.pdf', type: 'PDF', size: 327680, status: 'Ready', updatedAt: '2024-12-29T15:45:00Z', updatedBy: 'Alice Johnson', downloadable: true, documentType: 'Uploaded' },
      { id: 'DOC-2024-006', name: 'Credit Report.pdf', type: 'PDF', size: 156000, status: 'Ready', updatedAt: '2024-12-29T16:30:00Z', updatedBy: 'System', downloadable: true, documentType: 'Received' },
    ];
  });

  const [selectedDocuments, setSelectedDocuments] = useState<Set<string>>(new Set());
  const [workspaceStatus] = useState<'Draft' | 'Active' | 'Completed'>('Draft');
  const [staffPerson, setStaffPerson] = useState('John Doe'); // Default staff
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modals
  const [isSecureShareModalOpen, setIsSecureShareModalOpen] = useState(false);
  const [isESignPreparationModalOpen, setIsESignPreparationModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isLibrarySelectorOpen, setIsLibrarySelectorOpen] = useState(false);
  const [isPDFPreviewOpen, setIsPDFPreviewOpen] = useState(false);
  const [previewDocument, setPreviewDocument] = useState<Document | null>(null);
  
  // eSign Editor State
  const [showESignEditor, setShowESignEditor] = useState(false);
  const [eSignParticipants, setESignParticipants] = useState<any[]>([]);
  const [eSignDocumentName, setESignDocumentName] = useState('');
  const [eSignInitialFields, setESignInitialFields] = useState<any[] | undefined>(undefined);
  
  // Selection State for Detail Views
  const [selectedExchange, setSelectedExchange] = useState<Exchange | null>(null);
  const [selectedPacket, setSelectedPacket] = useState<SigningPacket | null>(null);

  // Mock Data for Tabs
  const [signingPackets] = useState<SigningPacket[]>([
    {
      id: 'SSC-2024-001',
      name: 'Purchase Agreement Packet',
      status: 'Draft',
      participants: [
        { name: 'John Doe', email: 'john@example.com', status: 'Pending' },
        { name: 'Jane Smith', email: 'jane@example.com', status: 'Pending' }
      ],
      updatedAt: '2025-01-05T09:15:00Z',
      documentNames: ['Purchase Agreement.pdf'],
      createdBy: 'James Rodriguez'
    },
    {
      id: 'SSC-2024-002',
      name: 'Credit Application Forms',
      status: 'Pending',
      participants: [
        { name: 'Alice Johnson', email: 'alice@example.com', status: 'Pending' }
      ],
      updatedAt: '2025-01-06T14:22:00Z',
      documentNames: ['Credit Application.pdf', 'Income Verification.pdf'],
      createdBy: 'James Rodriguez'
    },
    {
      id: 'SSC-2024-003',
      name: 'Vehicle Sale Contract',
      status: 'In Progress',
      participants: [
        { name: 'Bob Brown', email: 'bob@example.com', status: 'Completed' },
        { name: 'Charlie Davis', email: 'charlie@example.com', status: 'Pending' }
      ],
      updatedAt: '2025-01-07T10:30:00Z',
      documentNames: ['Purchase Agreement.pdf', 'Trade-In Appraisal.pdf'],
      createdBy: 'James Rodriguez'
    },
    {
      id: 'SSC-2024-004',
      name: 'Lease Agreement Bundle',
      status: 'Completed',
      participants: [
        { name: 'David Wilson', email: 'david@example.com', status: 'Completed' },
        { name: 'Eve Anderson', email: 'eve@example.com', status: 'Completed' }
      ],
      updatedAt: '2025-01-03T16:45:00Z',
      documentNames: ['Lease Agreement.pdf'],
      createdBy: 'James Rodriguez'
    }
  ]);

  const [auditEvents] = useState<AuditEvent[]>([
    { id: 'EVT-001', timestamp: '2024-12-29T15:45:00Z', actor: 'Alice Johnson', action: 'Uploaded Document', target: 'Trade-In Appraisal.pdf', details: 'Manual upload to workspace' },
    { id: 'EVT-002', timestamp: '2024-12-29T14:30:00Z', actor: 'James Rodriguez', action: 'Created eSign Packet', target: 'PKT-2024-001', details: 'Sent to 2 participants' },
    { id: 'EVT-003', timestamp: '2024-12-28T10:30:00Z', actor: 'John Doe', action: 'Created Workspace', target: 'Deal #12345', details: 'Initial setup' },
  ]);

  // -- Handlers --

  const toggleDocumentSelection = (id: string) => {
    const newSelected = new Set(selectedDocuments);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedDocuments(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedDocuments.size === filteredDocuments.length) {
      setSelectedDocuments(new Set());
    } else {
      setSelectedDocuments(new Set(filteredDocuments.map(d => d.id)));
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(undefined, { // Use browser locale
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Draft': return 'bg-neutral-100 text-neutral-700';
      case 'Active': return 'bg-blue-100 text-blue-700';
      case 'Completed': return 'bg-green-100 text-green-700';
      default: return 'bg-neutral-100 text-neutral-700';
    }
  };

  const [filterType, setFilterType] = useState<string>('All');

  // Filter Documents
  const filteredDocuments = documents.filter(doc => {
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = 
      doc.name.toLowerCase().includes(searchLower) ||
      doc.updatedBy.toLowerCase().includes(searchLower);
      
    const matchesType = filterType === 'All' || doc.type === filterType;
    
    return matchesSearch && matchesType;
  });

  // eSign Handlers
  const handleShareAndESignSuccess = (recipients: any[], settings: any) => {
    // Extract document names from selected documents
    const selectedDocNames = Array.from(selectedDocuments)
      .map(id => documents.find(d => d.id === id)?.name)
      .filter(Boolean);
    
    setESignDocumentName(selectedDocNames.join(', '));
    setESignParticipants(recipients);
    setShowESignEditor(true);
    setIsESignPreparationModalOpen(false);
    onESignEditorStateChange?.(true);
  };

  const handleBackFromEditor = () => {
    setShowESignEditor(false);
    onESignEditorStateChange?.(false);
  };
  
  const handleSaveDraft = () => {
    toast.success('Saved (Draft)');
    setShowESignEditor(false);
    onESignEditorStateChange?.(false);
  };

  const handleSendForSignature = () => {
    toast.success('eSign request sent to all participants');
    setShowESignEditor(false);
    onESignEditorStateChange?.(false);
    setSelectedDocuments(new Set());
  };

  const handleOpenDraftInEditor = (packet: SigningPacket) => {
    // In a real app, we would load the actual saved field data from the backend
    // For now, we'll simulate some mock draft fields
    const mockDraftFields = [
      {
        id: 'field-draft-1',
        type: 'signature' as const,
        participantId: 'participant-1',
        x: 50,
        y: 650,
        width: 200,
        height: 50,
        page: 1,
        required: true,
      },
      {
        id: 'field-draft-2',
        type: 'date' as const,
        participantId: 'participant-1',
        x: 270,
        y: 650,
        width: 150,
        height: 50,
        page: 1,
        required: false,
      },
    ];

    setESignDocumentName(packet.documentNames.join(', '));
    setESignParticipants(packet.participants.map((p, i) => ({
      ...p,
      id: `participant-${i + 1}`,
    })));
    setESignInitialFields(mockDraftFields);
    setShowESignEditor(true);
    onESignEditorStateChange?.(true);
  };

  const handleSecureShareSuccess = (recipients: any[], settings: any, exchangeInfo: { id: string; name: string }) => {
    toast.success(`Shared ${selectedDocuments.size} documents. Created ${exchangeInfo.name} (${exchangeInfo.id})`);
    setIsSecureShareModalOpen(false);
    setSelectedDocuments(new Set());
  };

  const handleDownloadDocument = (doc: Document) => {
    downloadDummyPDF(inferDocumentType(doc.name), doc.name, {
      workspaceId,
      documentId: doc.id,
      participantName: doc.updatedBy,
    });
    toast.success(`Downloading ${doc.name}`);
  };

  const handleDeleteDocument = (doc: Document) => {
    setDocuments(prev => prev.filter(d => d.id !== doc.id));
    setSelectedDocuments(prev => {
      const next = new Set(prev);
      next.delete(doc.id);
      return next;
    });
    toast.success(`${doc.name} removed from this workspace`);
  };

  const handleViewPacketHistory = (packet: SigningPacket) => {
    setActiveTab('audit');
    toast.info(`Showing activity for ${packet.name}`);
  };

  const handleDownloadSignedDocuments = (packet: SigningPacket) => {
    packet.documentNames.forEach(name =>
      downloadDummyPDF(inferDocumentType(name), name, {
        workspaceId,
        participantName: packet.createdBy,
      }),
    );
    toast.success(
      `Downloading ${packet.documentNames.length} signed document${packet.documentNames.length === 1 ? '' : 's'}`,
    );
  };

  const handleBulkUpload = (files: File[]) => {
      const newDocs: Document[] = files.map((file, index) => ({
        id: `DOC-2024-${Date.now()}-${index}`,
        name: file.name,
        type: file.name.split('.').pop()?.toUpperCase() || 'UNKNOWN',
        size: file.size,
        status: 'Ready' as const,
        updatedAt: new Date().toISOString(),
        updatedBy: 'James Rodriguez', // Current user
        downloadable: true,
        documentType: 'Uploaded'
      }));
      
      setDocuments(prev => [...prev, ...newDocs]);
      toast.success(`${files.length} document(s) uploaded successfully`);
  };

  const handleLibrarySelect = (selectedLibraryDocs: LibraryDocument[]) => {
      const newDocs: Document[] = selectedLibraryDocs.map(doc => ({
          id: doc.id,
          name: doc.name,
          type: doc.type,
          size: parseSizeToBytes(doc.size), // Need helper or just string
          status: 'Ready',
          updatedAt: doc.uploadedDate || new Date().toISOString(),
          updatedBy: doc.uploadedBy,
          downloadable: true,
          documentType: 'Received'
      }));

      // In real app, we might check for duplicates
      setDocuments(prev => [...prev, ...newDocs]);
      toast.success(`${newDocs.length} document(s) added from library`);
  };

  // Helper to approximate bytes from string like "2.4 MB" for consistency
  const parseSizeToBytes = (sizeStr: string) => {
      // Mock implementation
      return 1024 * 1024; 
  };

  // Get icon based on file type
  const getFileIcon = (type: string) => {
    const iconClass = "w-8 h-8";
    
    switch (type.toUpperCase()) {
      case 'PDF':
        return (
          <svg className={iconClass} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M30 4H10C8.89543 4 8 4.89543 8 6V42C8 43.1046 8.89543 44 10 44H38C39.1046 44 40 43.1046 40 42V14L30 4Z" fill="#E8E8E8"/>
            <path d="M30 4V12C30 13.1046 30.8954 14 32 14H40L30 4Z" fill="#C4C4C4"/>
            <rect x="12" y="8" width="16" height="1.5" rx="0.75" fill="#9E9E9E"/>
            <rect x="12" y="12" width="16" height="1.5" rx="0.75" fill="#9E9E9E"/>
            <rect x="12" y="16" width="12" height="1.5" rx="0.75" fill="#9E9E9E"/>
            <rect x="12" y="32" width="16" height="1.5" rx="0.75" fill="#9E9E9E"/>
            <rect x="12" y="36" width="12" height="1.5" rx="0.75" fill="#9E9E9E"/>
            <rect x="8" y="22" width="32" height="8" rx="1" fill="#DC2626"/>
            <text x="24" y="27.5" fontSize="7" fontWeight="600" fill="white" textAnchor="middle">PDF</text>
          </svg>
        );
      case 'DOCX':
      case 'DOC':
        return (
          <svg className={iconClass} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
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
        );
      case 'XLSX':
      case 'XLS':
        return (
          <svg className={iconClass} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M30 4H10C8.89543 4 8 4.89543 8 6V42C8 43.1046 8.89543 44 10 44H38C39.1046 44 40 43.1046 40 42V14L30 4Z" fill="#E8E8E8"/>
            <path d="M30 4V12C30 13.1046 30.8954 14 32 14H40L30 4Z" fill="#C4C4C4"/>
            <rect x="12" y="8" width="16" height="1.5" rx="0.75" fill="#9E9E9E"/>
            <rect x="12" y="12" width="16" height="1.5" rx="0.75" fill="#9E9E9E"/>
            <rect x="12" y="16" width="12" height="1.5" rx="0.75" fill="#9E9E9E"/>
            <rect x="12" y="32" width="16" height="1.5" rx="0.75" fill="#9E9E9E"/>
            <rect x="12" y="36" width="12" height="1.5" rx="0.75" fill="#9E9E9E"/>
            <rect x="8" y="22" width="32" height="8" rx="1" fill="#16A34A"/>
            <text x="24" y="27.5" fontSize="7" fontWeight="600" fill="white" textAnchor="middle">XLS</text>
          </svg>
        );
      case 'CSV':
        return (
          <svg className={iconClass} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M30 4H10C8.89543 4 8 4.89543 8 6V42C8 43.1046 8.89543 44 10 44H38C39.1046 44 40 43.1046 40 42V14L30 4Z" fill="#E8E8E8"/>
            <path d="M30 4V12C30 13.1046 30.8954 14 32 14H40L30 4Z" fill="#C4C4C4"/>
            <rect x="12" y="8" width="16" height="1.5" rx="0.75" fill="#9E9E9E"/>
            <rect x="12" y="12" width="16" height="1.5" rx="0.75" fill="#9E9E9E"/>
            <rect x="12" y="16" width="12" height="1.5" rx="0.75" fill="#9E9E9E"/>
            <rect x="12" y="32" width="16" height="1.5" rx="0.75" fill="#9E9E9E"/>
            <rect x="12" y="36" width="12" height="1.5" rx="0.75" fill="#9E9E9E"/>
            <rect x="8" y="22" width="32" height="8" rx="1" fill="#16A34A"/>
            <text x="24" y="27.5" fontSize="7" fontWeight="600" fill="white" textAnchor="middle">CSV</text>
          </svg>
        );
      default:
        return (
          <svg className={iconClass} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M30 4H10C8.89543 4 8 4.89543 8 6V42C8 43.1046 8.89543 44 10 44H38C39.1046 44 40 43.1046 40 42V14L30 4Z" fill="#E8E8E8"/>
            <path d="M30 4V12C30 13.1046 30.8954 14 32 14H40L30 4Z" fill="#C4C4C4"/>
            <rect x="12" y="8" width="16" height="1.5" rx="0.75" fill="#9E9E9E"/>
            <rect x="12" y="12" width="16" height="1.5" rx="0.75" fill="#9E9E9E"/>
            <rect x="12" y="16" width="12" height="1.5" rx="0.75" fill="#9E9E9E"/>
            <rect x="12" y="32" width="16" height="1.5" rx="0.75" fill="#9E9E9E"/>
            <rect x="12" y="36" width="12" height="1.5" rx="0.75" fill="#9E9E9E"/>
            <rect x="8" y="22" width="32" height="8" rx="1" fill="#6B7280"/>
            <text x="24" y="27.5" fontSize="6.5" fontWeight="600" fill="white" textAnchor="middle">FILE</text>
          </svg>
        );
    }
  };

  if (showESignEditor) {
    return (
      <ESignEditorView
        documentName={eSignDocumentName}
        participants={eSignParticipants}
        onBack={handleBackFromEditor}
        onSaveDraft={handleSaveDraft}
        onSendForSignature={handleSendForSignature}
        initialFields={eSignInitialFields}
      />
    );
  }

  if (selectedExchange) {
    return (
      <ExchangeDetailView 
        exchange={selectedExchange} 
        onBack={() => setSelectedExchange(null)} 
      />
    );
  }

  if (selectedPacket) {
    return (
      <ESignPacketDetailView 
        packet={selectedPacket} 
        onBack={() => setSelectedPacket(null)} 
      />
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-neutral-600 hover:text-neutral-900 mb-4 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Workspaces
        </button>

        <div className="flex items-start justify-between mb-6">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h1 className="text-2xl font-semibold text-neutral-900">{workspaceName}</h1>
              {dealId && (
                <div className="text-blue-500" title="Imported from Dealertrack">
                  <CloudDownload className="w-6 h-6" />
                </div>
              )}
            </div>
            <div className="flex items-center gap-3 text-sm">
              <span className="text-neutral-600">{workspaceId}</span>
              {dealId && (
                <>
                  <span className="text-neutral-400">•</span>
                  <span className="text-neutral-600">Deal ID: {dealId}</span>
                </>
              )}
              <span className="text-neutral-400">•</span>
              <span className={`inline-flex px-2.5 py-1 rounded text-xs font-medium ${getStatusColor(workspaceStatus)}`}>
                {workspaceStatus}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Staff Person Reassignment */}
            <div className="w-[200px]">
                <Select value={staffPerson} onValueChange={setStaffPerson}>
                    <SelectTrigger className="bg-white border-neutral-200">
                        <div className="flex items-center gap-2 text-neutral-700">
                             <User className="w-4 h-4" />
                             <SelectValue />
                        </div>
                    </SelectTrigger>
                    <SelectContent>
                        {AVAILABLE_STAFF.map(staff => (
                            <SelectItem key={staff} value={staff}>{staff}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button 
                  className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500 text-neutral-900 rounded-lg hover:bg-emerald-600 transition-colors cursor-pointer font-medium shadow-sm"
                >
                  <Upload className="w-4 h-4" />
                  Upload Document
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setIsUploadModalOpen(true)}>
                  <Upload className="w-4 h-4 mr-2" />
                  Upload from Computer
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setIsLibrarySelectorOpen(true)}>
                  <Library className="w-4 h-4 mr-2" />
                  Add from Library
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="inline-flex items-center justify-center w-10 h-10 bg-white border border-neutral-200 text-neutral-700 rounded-lg hover:bg-neutral-50 transition-colors">
                  <EllipsisVertical className="w-4 h-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={() => setIsSecureShareModalOpen(true)}>
                  <Share2 className="w-4 h-4 mr-2" />
                  Secure Share
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-rose-600 focus:text-rose-700 focus:bg-rose-50">
                  <Archive className="w-4 h-4 mr-2" />
                  Archive
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-neutral-200">
        <div className="flex gap-8">
          {[
            { id: 'documents', label: 'Documents' },
            { id: 'exchanges', label: 'Exchanges' },
            { id: 'esign', label: 'Prepare E-Sign' },
            { id: 'audit', label: 'Audit Log' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`pb-3 px-1 border-b-2 transition-colors cursor-pointer font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-emerald-500 text-emerald-700'
                  : 'border-transparent text-neutral-600 hover:text-neutral-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="min-h-[400px]">
        
        {/* DOCUMENTS TAB */}
        {activeTab === 'documents' && (
          <div className="space-y-4">
            {/* Filters & Actions Bar */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                 <div className="relative">
                   <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                   <input 
                     type="text" 
                     placeholder="Search..."
                     value={searchQuery}
                     onChange={(e) => setSearchQuery(e.target.value)}
                     className="pl-9 pr-4 py-2 bg-white border border-neutral-200 rounded-lg text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 w-64"
                   />
                 </div>
                 <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-2 px-3 py-2 bg-white border border-neutral-200 rounded-lg text-sm text-neutral-600 hover:bg-neutral-50 transition-colors cursor-pointer">
                        <Filter className="w-4 h-4" />
                        <span>{filterType === 'All' ? 'Filter' : filterType}</span>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setFilterType('All')} className="cursor-pointer">
                      All Types
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setFilterType('PDF')} className="cursor-pointer">
                      PDF
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setFilterType('DOCX')} className="cursor-pointer">
                      DOCX
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                 </DropdownMenu>
                 <button className="flex items-center gap-2 px-3 py-2 bg-white border border-neutral-200 rounded-lg text-sm text-neutral-600 hover:bg-neutral-50 transition-colors cursor-pointer">
                    <Archive className="w-4 h-4" />
                    <span>Archived</span>
                 </button>
              </div>

              {selectedDocuments.size > 0 && (
                <div className="flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2 duration-200">
                  <span className="text-sm text-neutral-600 mr-2">{selectedDocuments.size} selected</span>
                  <button 
                    onClick={() => setIsSecureShareModalOpen(true)}
                    className="flex items-center gap-2 px-3 py-2 bg-white border border-neutral-200 rounded-lg text-sm text-neutral-700 hover:bg-neutral-50 transition-colors"
                  >
                    <Share2 className="w-4 h-4" />
                    Secure Share
                  </button>
                  <button 
                    onClick={() => {
                      // Validate only PDF files are selected for e-signing
                      const selectedDocs = Array.from(selectedDocuments).map(id => documents.find(d => d.id === id)).filter(Boolean);
                      const nonPdfDocs = selectedDocs.filter(doc => doc!.type !== 'PDF');
                      
                      if (nonPdfDocs.length > 0) {
                        toast.error(`E-signing is only allowed for PDF files. Please remove ${nonPdfDocs.map(d => d!.name).join(', ')} from your selection.`);
                        return;
                      }
                      
                      setIsESignPreparationModalOpen(true);
                    }}
                    className="flex items-center gap-2 px-3 py-2 bg-white border border-neutral-200 rounded-lg text-sm text-neutral-700 hover:bg-neutral-50 transition-colors"
                  >
                    <FileSignature className="w-4 h-4" />
                    Prepare E-Sign
                  </button>
                </div>
              )}
            </div>

            {/* Documents Table */}
            <div className="bg-white border border-neutral-200 rounded-lg overflow-hidden shadow-sm">
              <table className="w-full">
                <thead className="bg-neutral-50 border-b border-neutral-200">
                  <tr>
                    <th className="w-12 px-6 py-3">
                      <input
                        type="checkbox"
                        checked={selectedDocuments.size === filteredDocuments.length && filteredDocuments.length > 0}
                        onChange={handleSelectAll}
                        className="w-4 h-4 rounded border-neutral-300 text-emerald-600 focus:ring-emerald-500"
                      />
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider">Name</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider">Document Type</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider">Uploaded By</th>
                    <th className="text-right px-6 py-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {filteredDocuments.map((doc) => (
                    <tr key={doc.id} className={`hover:bg-neutral-50 transition-colors ${selectedDocuments.has(doc.id) ? 'bg-emerald-50/30' : ''}`}>
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={selectedDocuments.has(doc.id)}
                          onChange={() => toggleDocumentSelection(doc.id)}
                          className="w-4 h-4 rounded border-neutral-300 text-emerald-600 focus:ring-emerald-500"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded bg-neutral-100 flex items-center justify-center text-neutral-500">
                            {getFileIcon(doc.type)}
                          </div>
                          <div className="text-sm font-medium text-neutral-900">{doc.name}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-neutral-600">
                        <span className="inline-flex px-2 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
                          {doc.documentType}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-neutral-900">{doc.updatedBy}</div>
                        <div className="text-xs text-neutral-500">{formatDate(doc.updatedAt)}</div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button
                              onClick={(e) => e.stopPropagation()}
                              className="p-1.5 text-neutral-400 hover:text-neutral-900 rounded-lg hover:bg-neutral-100 transition-colors cursor-pointer"
                            >
                              <MoreHorizontal className="w-4 h-4" />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuItem
                              onClick={() => {
                                setPreviewDocument(doc);
                                setIsPDFPreviewOpen(true);
                              }}
                              className="cursor-pointer"
                            >
                              <Eye className="w-4 h-4 mr-2" />
                              Preview
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDownloadDocument(doc)}
                              className="cursor-pointer"
                            >
                              <Download className="w-4 h-4 mr-2" />
                              Download
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => handleDeleteDocument(doc)}
                              className="cursor-pointer text-rose-600 focus:text-rose-700 focus:bg-rose-50"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* EXCHANGES TAB */}
        {activeTab === 'exchanges' && (
          <div>
            <ExchangesView onExchangeSelect={(ex) => setSelectedExchange(ex)} />
          </div>
        )}

        {/* ESIGN TAB */}
        {activeTab === 'esign' && (
          <div className="space-y-4">
             {signingPackets.length === 0 ? (
               <div className="bg-white border border-neutral-200 rounded-lg overflow-hidden shadow-sm">
                 <div className="px-6 py-16 text-center">
                   <FileSignature className="w-12 h-12 text-neutral-300 mx-auto mb-4" />
                   <p className="text-sm text-neutral-500">No signing ceremonies available.</p>
                 </div>
               </div>
             ) : (
               <div className="bg-white border border-neutral-200 rounded-lg overflow-hidden shadow-sm">
                <table className="w-full">
                  <thead className="bg-neutral-50 border-b border-neutral-200">
                    <tr>
                      <th className="text-left px-6 py-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider">Ceremony Name</th>
                      <th className="text-left px-6 py-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider">Participants</th>
                      <th className="text-left px-6 py-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider">Progress</th>
                      <th className="text-left px-6 py-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider">Status</th>
                      <th className="text-right px-6 py-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100">
                    {signingPackets.map((packet) => {
                      const isDraft = packet.status === 'Draft';
                      const isPending = packet.status === 'Pending';
                      const isInProgress = packet.status === 'In Progress';
                      const isCompleted = packet.status === 'Completed';
                      
                      const completedCount = packet.participants.filter(p => p.status === 'Completed').length;
                      const totalCount = packet.participants.length;
                      
                      // Status badge styling
                      const getStatusBadgeClass = () => {
                        switch (packet.status) {
                          case 'Draft':
                            return 'bg-neutral-100 text-neutral-600 border border-neutral-200';
                          case 'Pending':
                            return 'bg-amber-50 text-amber-700 border border-amber-200';
                          case 'In Progress':
                            return 'bg-blue-50 text-blue-700 border border-blue-200';
                          case 'Completed':
                            return 'bg-emerald-50 text-emerald-700 border border-emerald-200';
                          default:
                            return 'bg-neutral-100 text-neutral-600';
                        }
                      };
                      
                      return (
                        <tr 
                          key={packet.id} 
                          className={isDraft ? '' : 'hover:bg-neutral-50 transition-colors'}
                        >
                          <td className="px-6 py-4">
                            <div>
                              <div className="text-sm font-medium text-neutral-900">{packet.name}</div>
                              <div className="text-xs text-neutral-500 mt-0.5">{packet.id}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex -space-x-2">
                              {packet.participants.slice(0, 3).map((p, i) => (
                                <div 
                                  key={i} 
                                  className={`w-7 h-7 rounded-full border-2 border-white flex items-center justify-center text-[10px] font-bold ${
                                    p.status === 'Completed' 
                                      ? 'bg-emerald-100 text-emerald-700' 
                                      : 'bg-neutral-100 text-neutral-600'
                                  }`}
                                  title={`${p.name} - ${p.status}`}
                                >
                                  {p.name.charAt(0).toUpperCase()}
                                </div>
                              ))}
                              {packet.participants.length > 3 && (
                                <div className="w-7 h-7 rounded-full bg-neutral-100 border-2 border-white flex items-center justify-center text-[10px] font-bold text-neutral-600">
                                  +{packet.participants.length - 3}
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-neutral-600">
                              {completedCount} of {totalCount} completed
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex px-2.5 py-1 rounded text-xs font-medium ${getStatusBadgeClass()}`}>
                              {packet.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            {isDraft ? (
                              <button
                                onClick={() => handleOpenDraftInEditor(packet)}
                                className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors cursor-pointer text-sm font-medium"
                              >
                                <FileSignature className="w-4 h-4" />
                                Go to Editor
                              </button>
                            ) : (
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <button
                                    onClick={(e) => e.stopPropagation()}
                                    className="p-1.5 text-neutral-400 hover:text-neutral-900 rounded-lg hover:bg-neutral-100 transition-colors cursor-pointer"
                                  >
                                    <MoreHorizontal className="w-4 h-4" />
                                  </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-48">
                                  <DropdownMenuItem
                                    onClick={() => setSelectedPacket(packet)}
                                    className="cursor-pointer"
                                  >
                                    <Eye className="w-4 h-4 mr-2" />
                                    View Details
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => handleViewPacketHistory(packet)}
                                    className="cursor-pointer"
                                  >
                                    <History className="w-4 h-4 mr-2" />
                                    View History
                                  </DropdownMenuItem>
                                  {isCompleted && (
                                    <DropdownMenuItem
                                      onClick={() => handleDownloadSignedDocuments(packet)}
                                      className="cursor-pointer"
                                    >
                                      <Download className="w-4 h-4 mr-2" />
                                      Download Signed Documents
                                    </DropdownMenuItem>
                                  )}
                                </DropdownMenuContent>
                              </DropdownMenu>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
               </div>
             )}
          </div>
        )}

        {/* AUDIT TAB */}
        {activeTab === 'audit' && (
          <div className="bg-white border border-neutral-200 rounded-lg overflow-hidden shadow-sm">
            <div className="p-6 space-y-4">
              {auditEvents.map((event, index) => (
                <div key={event.id} className="flex gap-4">
                   <div className="flex flex-col items-center">
                      <div className="w-2 h-2 bg-neutral-400 rounded-full mt-1.5"></div>
                      {index < auditEvents.length - 1 && (
                        <div className="w-px h-full bg-neutral-200 my-1"></div>
                      )}
                   </div>
                   <div className="flex-1 pb-4">
                      <div className="flex items-center justify-between mb-1">
                          <div className="text-sm font-medium text-neutral-900">{event.action}</div>
                          <div className="text-xs text-neutral-500">{formatDate(event.timestamp)}</div>
                      </div>
                      <div className="text-sm text-neutral-600 mb-1">{event.details}</div>
                      <div className="text-xs text-neutral-500">by {event.actor} - {event.target}</div>
                   </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Modals */}
      <SecureShareModal
        isOpen={isSecureShareModalOpen}
        onClose={() => setIsSecureShareModalOpen(false)}
        selectedDocuments={Array.from(selectedDocuments).map(id => ({
          id,
          name: documents.find(d => d.id === id)?.name || ''
        }))}
        onSuccess={handleSecureShareSuccess}
      />

      <ESignPreparationModal
        isOpen={isESignPreparationModalOpen}
        onClose={() => setIsESignPreparationModalOpen(false)}
        selectedDocuments={Array.from(selectedDocuments).map(id => ({
          id,
          name: documents.find(d => d.id === id)?.name || ''
        }))}
        onContinueToEditor={handleShareAndESignSuccess}
      />
      
      <DocumentUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        initialData={null}
        isWorkspaceUpload={true}
        bulkOnly={true}
        onSave={() => {}} // Not used in bulk mode
        onBulkUpload={handleBulkUpload}
      />

      <DocumentLibrarySelectorModal
          isOpen={isLibrarySelectorOpen}
          onClose={() => setIsLibrarySelectorOpen(false)}
          onSelect={handleLibrarySelect}
      />

      <PDFPreviewModal
        isOpen={isPDFPreviewOpen}
        onClose={() => setIsPDFPreviewOpen(false)}
        document={previewDocument}
      />
    </div>
  );
}