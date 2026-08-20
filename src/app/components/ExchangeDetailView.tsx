import { useState } from 'react';
import { Exchange } from '../App';
import { getExchangeStatusColor } from '../utils/exchangeStatus';
import { 
  ArrowLeft, FileText, Download, Eye, CheckCircle, XCircle, 
  FolderInput, MoreHorizontal, Shield, Clock, Send, Calendar, Lock, AlertTriangle, RefreshCcw,
  Copy, Trash2, Bell, Import, User, Mail, Package, History
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from './ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { toast } from 'sonner';
import { Switch } from './ui/switch';
import { copyToClipboard } from '../utils/clipboard';
import { PDFViewerModal } from './PDFViewerModal';
import { downloadDummyPDF, inferDocumentType } from '../utils/pdfUtils';

interface ExchangeDetailViewProps {
  exchange: Exchange;
  onBack: () => void;
  userRole?: 'Super Admin' | 'Tenant Admin' | 'Primary Operations User';
}

interface Document {
  id: string;
  name: string;
  uploadedBy: string;
  uploadedAt: string;
  size: string;
  requiresSignature: boolean;
  signedBy?: string[];
  type: 'Sent' | 'Received';
  status?: 'Pending' | 'Accepted' | 'Rejected';
  source?: 'DealerTrack' | 'Manual';
}

interface Participant {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'Pending' | 'Viewed' | 'Signed' | 'Approved';
  lastActivity?: string;
}

interface AuditEntry {
  id: string;
  timestamp: string;
  actor: string;
  action: string;
  details: string;
}

export function ExchangeDetailView({ exchange: initialExchange, onBack, userRole }: ExchangeDetailViewProps) {
  const { t } = useTranslation();
  const [exchange, setExchange] = useState(initialExchange);
  const [activeTab, setActiveTab] = useState<'documents' | 'participants' | 'activity' | 'evidence' | 'settings'>('documents');
  
  // Modals state
  const [isExtendExpiryOpen, setIsExtendExpiryOpen] = useState(false);
  const [isRevokeOpen, setIsRevokeOpen] = useState(false);
  const [newExpiryDate, setNewExpiryDate] = useState('');
  const [newExpiryTime, setNewExpiryTime] = useState('');
  
  // PDF Viewer state
  const [pdfViewerOpen, setPdfViewerOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<{ filename: string; documentId?: string } | null>(null);

  // Mock permissions
  const [permissions, setPermissions] = useState({
    allowDownload: true,
    allowUpload: true,
    allowForwarding: false,
    passwordProtect: false,
    otpEnabled: true,
  });

  const [documents, setDocuments] = useState<Document[]>([
    {
      id: 'DOC-001',
      name: 'Q4_Financial_Report_2024.pdf',
      uploadedBy: 'Sarah Mitchell',
      uploadedAt: '12/15/2024 10:30 AM',
      size: '2.4 MB',
      requiresSignature: true,
      signedBy: ['John Smith', 'Maria Garcia'],
      type: 'Sent',
      source: 'DealerTrack'
    },
    {
      id: 'DOC-002',
      name: 'Board_Resolution_Draft.pdf',
      uploadedBy: 'Sarah Mitchell',
      uploadedAt: '12/15/2024 10:32 AM',
      size: '845 KB',
      requiresSignature: true,
      signedBy: ['John Smith'],
      type: 'Sent'
    },
    {
      id: 'DOC-003',
      name: 'Signed_Vendor_Agreement.pdf',
      uploadedBy: 'John Smith',
      uploadedAt: '12/20/2024 02:15 PM',
      size: '1.8 MB',
      requiresSignature: false,
      type: 'Received',
      status: 'Pending'
    },
  ]);

  const recipientInfo = {
    name: 'John Smith',
    email: 'john.smith@boardmember.com',
    company: 'Acme Corp'
  };

  const [participants, setParticipants] = useState<Participant[]>([
    {
      id: 'P-001',
      name: 'John Smith',
      email: 'john.smith@boardmember.com',
      role: 'Board Member',
      status: 'Signed',
      lastActivity: '12/28/2024 04:45 PM',
    },
    {
      id: 'P-002',
      name: 'Maria Garcia',
      email: 'maria.garcia@boardmember.com',
      role: 'Board Member',
      status: 'Signed',
      lastActivity: '12/27/2024 09:20 AM',
    },
  ]);

  const [auditLog, setAuditLog] = useState<AuditEntry[]>([
    {
      id: 'A-006',
      timestamp: '12/30/2024 09:15 AM',
      actor: 'System',
      action: 'Expired',
      details: 'Exchange link expired (auto-renewed by admin)',
    },
    {
      id: 'A-005',
      timestamp: '12/29/2024 02:22 PM',
      actor: 'System',
      action: 'Reminder Sent',
      details: 'Automatic reminder sent to pending participants',
    },
    {
      id: 'A-004',
      timestamp: '12/28/2024 04:45 PM',
      actor: 'John Smith',
      action: 'Document Uploaded',
      details: 'Uploaded: Signed_Vendor_Agreement.pdf',
    },
    {
      id: 'A-003',
      timestamp: '12/28/2024 04:40 PM',
      actor: 'John Smith',
      action: 'Document Downloaded',
      details: 'Downloaded: Q4_Financial_Report_2024.pdf',
    },
    {
      id: 'A-002',
      timestamp: '12/28/2024 04:30 PM',
      actor: 'John Smith',
      action: 'Exchange Viewed',
      details: 'Recipient accessed the secure link',
    },
    {
      id: 'A-001',
      timestamp: '12/15/2024 10:30 AM',
      actor: 'Sarah Mitchell',
      action: 'Exchange Created',
      details: 'Exchange EX-2024-0145 created and set to Active',
    },
  ]);

  const sentDocuments = documents.filter(d => d.type === 'Sent');
  const receivedDocuments = documents.filter(d => d.type === 'Received');

  // -- Actions --

  const handleExtendExpiry = () => {
    if (!newExpiryDate || !newExpiryTime) {
      toast.error('Please select both date and time');
      return;
    }
    
    const dateTime = new Date(`${newExpiryDate}T${newExpiryTime}`);
    const now = new Date();
    
    if (dateTime <= now) {
      toast.error('Expiry date must be in the future');
      return;
    }

    const formattedExpiry = dateTime.toLocaleString('en-US', { 
      month: '2-digit', 
      day: '2-digit', 
      year: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit', 
      hour12: true 
    });

    setExchange(prev => ({ 
      ...prev, 
      expiresAt: formattedExpiry,
      status: 'Sent' // Reset to active if was expired
    }));
    
    // Add audit log
    const newLog: AuditEntry = {
      id: `A-${Date.now()}`,
      timestamp: new Date().toLocaleString('en-US', { 
        month: '2-digit', 
        day: '2-digit', 
        year: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit', 
        hour12: true 
      }),
      actor: 'Current User',
      action: 'Expiry Extended',
      details: `Expiry extended to ${formattedExpiry}`
    };
    setAuditLog([newLog, ...auditLog]);
    
    setIsExtendExpiryOpen(false);
    setNewExpiryDate('');
    setNewExpiryTime('');
    toast.success('Expiry date updated successfully');
  };

  const handleRevokeAccess = () => {
    setExchange(prev => ({ ...prev, status: 'Revoked' }));
    
    // Add audit log
    const newLog: AuditEntry = {
      id: `A-${Date.now()}`,
      timestamp: new Date().toLocaleString('en-US', { 
        month: '2-digit', 
        day: '2-digit', 
        year: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit', 
        hour12: true 
      }),
      actor: 'Current User',
      action: 'Access Revoked',
      details: 'Exchange access manually revoked'
    };
    setAuditLog([newLog, ...auditLog]);
    
    setIsRevokeOpen(false);
    toast.success('Access revoked successfully');
  };

  const handleAcceptDocument = (id: string) => {
    setDocuments(prev => prev.map(d => d.id === id ? { ...d, status: 'Accepted' } : d));
    toast.success('Document accepted');
  };

  const handleRejectDocument = (id: string) => {
    setDocuments(prev => prev.map(d => d.id === id ? { ...d, status: 'Rejected' } : d));
    toast.error('Document rejected');
  };

  const handleUpdatePermissions = () => {
    toast.success('Permissions updated');
  };

  const handleCopyLink = async () => {
    try {
      await copyToClipboard(`https://secure-exchange.com/link/${exchange.id}`);
      toast.success('Link copied to clipboard');
    } catch (error) {
      toast.error('Failed to copy link');
    }
  };

  const handleRemindAll = () => {
    toast.success('Reminders sent to all pending participants');
  };

  const handleRemindParticipant = (name: string) => {
    toast.success(`Reminder sent to ${name}`);
  };

  const handleRemoveParticipant = (id: string) => {
    setParticipants(prev => prev.filter(p => p.id !== id));
    toast.success('Participant access removed');
  };

  return (
    <div className="w-full min-w-full p-8">
      <button
        onClick={onBack}
        className="mb-6 flex items-center gap-2 text-neutral-600 hover:text-neutral-900 cursor-pointer transition-colors"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to Exchanges
      </button>

      {/* Overview Summary Section - Outside Tabs */}
      <div className="bg-white border border-neutral-200 rounded-xl shadow-sm mb-6">
        {/* Header: Exchange Name + Actions */}
        <div className="px-6 py-5 border-b border-neutral-100">
          <div className="flex items-start justify-between">
            {/* Left: Exchange Name, ID, Status */}
            <div>
              <h2 className="text-2xl font-semibold text-neutral-900 mb-1">{exchange.title}</h2>
              <div className="flex items-center gap-3">
                <span className="text-sm text-neutral-500">{exchange.id}</span>
                <span className={`px-2 py-0.5 rounded text-xs font-medium ${getExchangeStatusColor(exchange.status)}`}>
                  {exchange.status}
                </span>
              </div>
            </div>

            {/* Right: Primary Action + More Menu */}
            <div className="flex items-center gap-2">
              {exchange.status !== 'Revoked' && exchange.status !== 'Expired' && (
                <button 
                  onClick={handleCopyLink}
                  className="px-4 py-2 bg-emerald-500 text-[#ffffff] rounded-lg hover:bg-emerald-600 transition-colors font-medium cursor-pointer flex items-center gap-2"
                >
                  <Copy className="w-4 h-4" />
                  Copy Link
                </button>
              )}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="p-2 border border-neutral-200 text-neutral-600 rounded-lg hover:bg-neutral-50 transition-colors cursor-pointer">
                    <MoreHorizontal className="w-5 h-5" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={handleRemindAll} className="cursor-pointer">
                    <Bell className="w-4 h-4 mr-2" />
                    Remind All
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setIsExtendExpiryOpen(true)} className="cursor-pointer">
                    <Calendar className="w-4 h-4 mr-2" />
                    Extend Expiry
                  </DropdownMenuItem>
                  {userRole !== 'Primary Operations User' && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        className="cursor-pointer text-rose-600 focus:text-rose-700 focus:bg-rose-50"
                        onClick={() => setIsRevokeOpen(true)}
                      >
                        <AlertTriangle className="w-4 h-4 mr-2" />
                        Revoke Access
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        {/* Metadata Row: System-Level Information Only */}
        <div className="px-6 py-4 bg-neutral-50">
          <div className="flex items-center gap-8 text-sm text-neutral-600">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-neutral-400" />
              <span>Expires · {exchange.expiresAt || 'Never'}</span>
            </div>
            <div className="flex items-center gap-2">
              <History className="w-4 h-4 text-neutral-400" />
              <span>Last activity · {exchange.lastModified}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="border-b border-neutral-200 mb-6">
        <div className="flex gap-8">
          {[
            { id: 'documents', label: 'Documents' },
            { id: 'activity', label: 'Activity' },
            { id: 'participants', label: 'Participants' },
            { id: 'evidence', label: 'Evidence' },
            { id: 'settings', label: 'Settings' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`pb-3 px-1 border-b-2 transition-colors font-medium cursor-pointer ${
                activeTab === tab.id
                  ? 'border-emerald-500 text-emerald-600'
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
        {/* Documents Tab */}
        {activeTab === 'documents' && (
          <div className="space-y-6">
            {/* Sent Documents */}
            <div className="bg-white border border-neutral-200 rounded-lg overflow-hidden">
              <div className="px-6 py-4 bg-neutral-50 border-b border-neutral-200">
                <h3 className="font-medium text-neutral-900">Sent Documents ({sentDocuments.length})</h3>
              </div>
              <div className="divide-y divide-neutral-100">
                {sentDocuments.map((doc) => (
                  <div key={doc.id} className="px-6 py-4 hover:bg-neutral-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 flex-1">
                        <FileText className="w-5 h-5 text-blue-500" />
                        <div className="flex-1">
                          <div className="font-medium text-neutral-900">{doc.name}</div>
                          <div className="text-xs text-neutral-500">
                            Uploaded by {doc.uploadedBy} • {doc.uploadedAt} • {doc.size}
                            {doc.source && <span className="ml-2 px-1.5 py-0.5 bg-purple-50 text-purple-700 rounded text-[10px] font-medium">From {doc.source}</span>}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button className="p-1.5 text-neutral-400 hover:text-neutral-900 rounded hover:bg-neutral-100 transition-colors cursor-pointer">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-1.5 text-neutral-400 hover:text-neutral-900 rounded hover:bg-neutral-100 transition-colors cursor-pointer">
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Received Documents */}
            <div className="bg-white border border-neutral-200 rounded-lg overflow-hidden">
              <div className="px-6 py-4 bg-neutral-50 border-b border-neutral-200">
                <h3 className="font-medium text-neutral-900">Received Documents ({receivedDocuments.length})</h3>
              </div>
              <div className="divide-y divide-neutral-100">
                {receivedDocuments.map((doc) => (
                  <div key={doc.id} className="px-6 py-4 hover:bg-neutral-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 flex-1">
                        <FolderInput className="w-5 h-5 text-emerald-500" />
                        <div className="flex-1">
                          <div className="font-medium text-neutral-900">{doc.name}</div>
                          <div className="text-xs text-neutral-500">
                            Uploaded by {doc.uploadedBy} • {doc.uploadedAt} • {doc.size}
                          </div>
                        </div>
                        {doc.status && (
                          <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                            doc.status === 'Accepted' ? 'bg-emerald-100 text-emerald-700' :
                            doc.status === 'Rejected' ? 'bg-red-100 text-red-700' :
                            'bg-yellow-100 text-yellow-700'
                          }`}>
                            {doc.status}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        {doc.status === 'Pending' && (
                          <>
                            <button 
                              onClick={() => handleAcceptDocument(doc.id)}
                              className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded transition-colors cursor-pointer"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => handleRejectDocument(doc.id)}
                              className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors cursor-pointer"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          </>
                        )}
                        <button className="p-1.5 text-neutral-400 hover:text-neutral-900 rounded hover:bg-neutral-100 transition-colors cursor-pointer">
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                {receivedDocuments.length === 0 && (
                  <div className="px-6 py-8 text-center text-neutral-500">
                    No documents received yet.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Activity Tab */}
        {activeTab === 'activity' && (
          <div className="bg-white border border-neutral-200 rounded-lg overflow-hidden">
            <div className="px-6 py-4 bg-neutral-50 border-b border-neutral-200">
              <h3 className="font-medium text-neutral-900">Activity Timeline</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {auditLog.map((entry, index) => (
                  <div key={entry.id} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full mt-1.5"></div>
                      {index < auditLog.length - 1 && (
                        <div className="w-px h-full bg-neutral-200 mt-1"></div>
                      )}
                    </div>
                    <div className="flex-1 pb-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="font-medium text-neutral-900">{entry.action}</div>
                          <div className="text-sm text-neutral-600 mt-0.5">{entry.details}</div>
                          <div className="text-xs text-neutral-500 mt-1">
                            {entry.actor} • {entry.timestamp}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Participants Tab */}
        {activeTab === 'participants' && (
          <div className="bg-white border border-neutral-200 rounded-lg overflow-hidden">
            <div className="px-6 py-4 bg-neutral-50 border-b border-neutral-200">
              <h3 className="font-medium text-neutral-900">Participants ({participants.length})</h3>
            </div>
            <div className="divide-y divide-neutral-100">
              {participants.map((participant) => (
                <div key={participant.id} className="px-6 py-4 hover:bg-neutral-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold">
                        {participant.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-medium text-neutral-900">{participant.name}</div>
                        <div className="text-sm text-neutral-500">{participant.email}</div>
                        <div className="text-xs text-neutral-400 mt-0.5">
                          {participant.role} • Last activity: {participant.lastActivity}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                        participant.status === 'Signed' ? 'bg-emerald-100 text-emerald-700' :
                        participant.status === 'Viewed' ? 'bg-blue-100 text-blue-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {participant.status}
                      </span>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className="p-1.5 text-neutral-400 hover:text-neutral-900 rounded hover:bg-neutral-100 transition-colors cursor-pointer">
                            <MoreHorizontal className="w-4 h-4" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem 
                            onClick={() => handleRemindParticipant(participant.name)}
                            className="cursor-pointer"
                          >
                            <Bell className="w-4 h-4 mr-2" />
                            Send Reminder
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            onClick={() => handleRemoveParticipant(participant.id)}
                            className="cursor-pointer text-red-600 focus:text-red-700 focus:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Remove Access
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Evidence Package Tab */}
        {activeTab === 'evidence' && (
          <div className="space-y-6">
            {/* Evidence Package Overview */}
            <div className="bg-white border border-neutral-200 rounded-lg p-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-neutral-900 flex items-center gap-2 mb-2">
                    <Package className="w-5 h-5 text-emerald-600" />
                    Evidence Package
                  </h3>
                  <p className="text-sm text-neutral-600">
                    A complete, replayable decision record of this external document exchange.
                  </p>
                </div>
                <button
                  onClick={() => toast.success('Evidence Package generated')}
                  className="px-4 py-2 bg-emerald-500 text-[#FFFFFF] rounded-lg hover:bg-emerald-600 transition-colors font-medium cursor-pointer flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Generate Evidence Package
                </button>
              </div>

              {/* Evidence Package Contents */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Shield className="w-4 h-4 text-emerald-600" />
                    <div className="font-medium text-neutral-900 text-sm">Governed Access Record</div>
                  </div>
                  <ul className="text-sm text-neutral-600 space-y-1.5">
                    <li>• Anchor Decision metadata</li>
                    <li>• Who approved & when</li>
                    <li>• Approved access state</li>
                  </ul>
                </div>

                <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <FileText className="w-4 h-4 text-blue-600" />
                    <div className="font-medium text-neutral-900 text-sm">Document Versions</div>
                  </div>
                  <ul className="text-sm text-neutral-600 space-y-1.5">
                    <li>• Document versions & hashes</li>
                    <li>• Upload timestamps</li>
                    <li>• Modification history</li>
                  </ul>
                </div>

                <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Clock className="w-4 h-4 text-purple-600" />
                    <div className="font-medium text-neutral-900 text-sm">Access Timeline</div>
                  </div>
                  <ul className="text-sm text-neutral-600 space-y-1.5">
                    <li>• External access events</li>
                    <li>• OTP verification records</li>
                    <li>• IP address & device metadata</li>
                  </ul>
                </div>

                <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    <div className="font-medium text-neutral-900 text-sm">Compliance Records</div>
                  </div>
                  <ul className="text-sm text-neutral-600 space-y-1.5">
                    <li>• Consent acceptance logs</li>
                    <li>• Signature completion records</li>
                    <li>• Revocation & expiry actions</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Decision Replay */}
            <div className="bg-white border border-neutral-200 rounded-lg p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-neutral-900 flex items-center gap-2 mb-2">
                    <History className="w-5 h-5 text-purple-600" />
                    Decision Replay
                  </h3>
                  <p className="text-sm text-neutral-600">
                    Reconstruct the exact external access state at any point in time. Read-only evidence reconstruction.
                  </p>
                </div>
              </div>

              <div className="bg-purple-50 border border-purple-100 rounded-lg p-4">
                <div className="flex gap-3">
                  <Lock className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-medium text-purple-900 mb-1 text-sm">Replay Guardrails</div>
                    <ul className="text-sm text-purple-700 space-y-1">
                      <li>• Read-only mode — no mutations</li>
                      <li>• No re-approval capability</li>
                      <li>• Pure evidence reconstruction</li>
                      <li>• Exact state at selected timestamp</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-neutral-700 mb-2">Select Replay Timestamp</label>
                <div className="flex items-center gap-2">
                  <input
                    type="datetime-local"
                    className="flex-1 px-3 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer"
                  />
                  <button className="px-4 py-2 bg-purple-600 text-[#FFFFFF] rounded-lg hover:bg-purple-700 transition-colors font-medium cursor-pointer flex items-center gap-2">
                    <History className="w-4 h-4" />
                    Replay State
                  </button>
                </div>
                <p className="text-xs text-neutral-500 mt-2">
                  Replay the approved external access state as it existed on the selected date.
                </p>
              </div>
            </div>

            {/* Data Retention & Immutability */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-5">
              <div className="flex gap-3">
                <Shield className="w-5 h-5 text-blue-700 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-blue-900 mb-2">Data Retention & Immutability</div>
                  <ul className="text-sm text-blue-800 space-y-1.5">
                    <li>• <strong>Append-only audit logs</strong> — Events cannot be modified or deleted</li>
                    <li>• <strong>Immutable evidence packages</strong> — Once generated, records are permanent</li>
                    <li>• <strong>Policy-driven retention</strong> — Retention periods are set at system level, not user-editable post-fact</li>
                    <li>• <strong>Compliance-ready</strong> — All evidence meets audit and regulatory requirements</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="space-y-6">
            <div className="bg-white border border-neutral-200 rounded-lg p-6">
              <h3 className="font-medium text-neutral-900 mb-4">Permissions</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-neutral-900">Allow Download</div>
                    <div className="text-sm text-neutral-500">Recipients can download documents</div>
                  </div>
                  <Switch 
                    checked={permissions.allowDownload}
                    onCheckedChange={(checked) => setPermissions({...permissions, allowDownload: checked})}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-neutral-900">Allow Upload</div>
                    <div className="text-sm text-neutral-500">Recipients can upload documents</div>
                  </div>
                  <Switch 
                    checked={permissions.allowUpload}
                    onCheckedChange={(checked) => setPermissions({...permissions, allowUpload: checked})}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-neutral-900">OTP Authentication</div>
                    <div className="text-sm text-neutral-500">Require one-time password for access</div>
                  </div>
                  <Switch 
                    checked={permissions.otpEnabled}
                    onCheckedChange={(checked) => setPermissions({...permissions, otpEnabled: checked})}
                  />
                </div>
              </div>
              <div className="mt-6 pt-6 border-t border-neutral-100">
                <button 
                  onClick={handleUpdatePermissions}
                  className="px-4 py-2 bg-emerald-500 text-neutral-900 rounded-lg hover:bg-emerald-600 transition-colors font-medium cursor-pointer"
                >
                  Save Settings
                </button>
              </div>
            </div>

            <div className="bg-white border border-neutral-200 rounded-lg p-6">
              <h3 className="font-medium text-neutral-900 mb-4">Link Controls</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">Secure Link</label>
                  <div className="flex items-center gap-2">
                    <input 
                      type="text" 
                      readOnly 
                      value={`https://secure-exchange.com/link/${exchange.id}`}
                      className="flex-1 px-3 py-2 border border-neutral-200 rounded-lg bg-neutral-50 text-neutral-600 text-sm"
                    />
                    <button 
                      onClick={handleCopyLink}
                      className="px-4 py-2 border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors cursor-pointer"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Extend Expiry Modal */}
      <Dialog open={isExtendExpiryOpen} onOpenChange={setIsExtendExpiryOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Extend Expiry Date</DialogTitle>
            <DialogDescription>
              Set a new expiration date and time for this exchange.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">New Expiry Date *</label>
              <input
                type="date"
                value={newExpiryDate}
                onChange={(e) => setNewExpiryDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">New Expiry Time *</label>
              <input
                type="time"
                value={newExpiryTime}
                onChange={(e) => setNewExpiryTime(e.target.value)}
                className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900"
              />
            </div>
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-3">
              <p className="text-sm text-blue-700">
                Current expiry: {exchange.expiresAt || 'Not set'}
              </p>
            </div>
          </div>

          <DialogFooter>
            <button
              onClick={() => {
                setIsExtendExpiryOpen(false);
                setNewExpiryDate('');
                setNewExpiryTime('');
              }}
              className="px-4 py-2 border border-neutral-200 rounded-lg text-neutral-700 hover:bg-neutral-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleExtendExpiry}
              className="px-4 py-2 bg-emerald-500 text-neutral-900 rounded-lg hover:bg-emerald-600 transition-colors cursor-pointer"
            >
              Update Expiry
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Revoke Access Modal */}
      <Dialog open={isRevokeOpen} onOpenChange={setIsRevokeOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Revoke Access</DialogTitle>
            <DialogDescription>
              Are you sure you want to revoke access to this exchange? This action will immediately disable the secure link and prevent all participants from accessing the documents.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <div className="bg-red-50 border border-red-100 rounded-lg p-4">
              <div className="flex gap-3">
                <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-medium text-red-900 mb-1">This action cannot be undone</div>
                  <ul className="text-sm text-red-700 space-y-1">
                    <li>• The secure link will be immediately disabled</li>
                    <li>• All participants will lose access to documents</li>
                    <li>• This event will be logged in the audit trail</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <button
              onClick={() => setIsRevokeOpen(false)}
              className="px-4 py-2 border border-neutral-200 rounded-lg text-neutral-700 hover:bg-neutral-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleRevokeAccess}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors cursor-pointer"
            >
              Revoke Access
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* PDF Viewer Modal */}
      <PDFViewerModal
        isOpen={pdfViewerOpen}
        onClose={() => setPdfViewerOpen(false)}
        filename={selectedDocument?.filename || ''}
        metadata={{
          exchangeId: exchange.id,
          documentId: selectedDocument?.documentId,
        }}
      />
    </div>
  );
}