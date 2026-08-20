import { useState } from 'react';
import { 
  ArrowLeft, FileText, Download, Eye, History, Send, MoreHorizontal
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { toast } from 'sonner';

interface SigningPacket {
  id: string;
  name: string;
  status: 'Draft' | 'Pending' | 'In Progress' | 'Completed';
  participants: Array<{ 
    name: string; 
    email: string; 
    status: 'Pending' | 'Completed'; 
  }>;
  updatedAt: string;
  documentNames: string[];
  createdBy: string;
  createdAt?: string;
}

interface ESignPacketDetailViewProps {
  packet: SigningPacket;
  onBack: () => void;
}

interface ParticipantDocument {
  id: string;
  name: string;
  fileType: string;
  signingStatus: 'Not Started' | 'In Progress' | 'Completed';
  lastUpdated: string;
}

interface Participant {
  id: string;
  name: string;
  email: string;
  status: 'Pending' | 'Completed';
  lastUpdated: string;
  documents: ParticipantDocument[];
}

interface ActivityEvent {
  id: string;
  timestamp: string;
  actor: string; // 'System' or participant name
  action: string;
  description: string;
}

export function ESignPacketDetailView({ packet, onBack }: ESignPacketDetailViewProps) {
  const { t } = useTranslation();

  // Mock Data - Participants with their documents
  const [participants] = useState<Participant[]>([
    {
      id: 'P-1',
      name: 'John Doe',
      email: 'john@example.com',
      status: 'Completed',
      lastUpdated: '01/06/2026 02:30 PM',
      documents: [
        { id: 'D-1', name: 'Purchase Agreement.pdf', fileType: 'PDF', signingStatus: 'Completed', lastUpdated: '01/06/2026 02:30 PM' },
        { id: 'D-2', name: 'Credit Application.pdf', fileType: 'PDF', signingStatus: 'Completed', lastUpdated: '01/06/2026 02:32 PM' },
      ]
    },
    {
      id: 'P-2',
      name: 'Jane Smith',
      email: 'jane@example.com',
      status: 'Pending',
      lastUpdated: '01/05/2026 09:15 AM',
      documents: [
        { id: 'D-3', name: 'Purchase Agreement.pdf', fileType: 'PDF', signingStatus: 'In Progress', lastUpdated: '01/05/2026 09:15 AM' },
        { id: 'D-4', name: 'Credit Application.pdf', fileType: 'PDF', signingStatus: 'Not Started', lastUpdated: '01/05/2026 09:00 AM' },
      ]
    },
  ]);

  // Mock Activity/History Timeline
  const [activityLog] = useState<ActivityEvent[]>([
    { id: 'A-1', timestamp: '01/04/2026 10:00 AM', actor: 'System', action: 'Ceremony Created', description: 'Signing ceremony created with 2 participants' },
    { id: 'A-2', timestamp: '01/04/2026 10:05 AM', actor: 'System', action: 'Ceremony Sent', description: 'Invitations sent to all participants' },
    { id: 'A-3', timestamp: '01/05/2026 09:00 AM', actor: 'Jane Smith', action: 'Opened Link', description: 'Participant opened the signing link' },
    { id: 'A-4', timestamp: '01/05/2026 09:15 AM', actor: 'Jane Smith', action: 'Started Signing', description: 'Participant started signing Purchase Agreement.pdf' },
    { id: 'A-5', timestamp: '01/06/2026 02:20 PM', actor: 'John Doe', action: 'Opened Link', description: 'Participant opened the signing link' },
    { id: 'A-6', timestamp: '01/06/2026 02:30 PM', actor: 'John Doe', action: 'Completed Signing', description: 'Participant completed all documents' },
  ]);

  // Format date helper
  const formatDate = (dateString: string) => {
    return dateString; // Already formatted as MM/DD/YYYY hh:mm A
  };

  // SSC Status Badge Classes
  const getSSCStatusClass = () => {
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

  // Participant Status Badge Classes
  const getParticipantStatusClass = (status: 'Pending' | 'Completed') => {
    switch (status) {
      case 'Pending':
        return 'bg-amber-50 text-amber-700 border border-amber-200';
      case 'Completed':
        return 'bg-emerald-50 text-emerald-700 border border-emerald-200';
      default:
        return 'bg-neutral-100 text-neutral-600';
    }
  };

  // Document Signing Status Badge Classes
  const getSigningStatusClass = (status: 'Not Started' | 'In Progress' | 'Completed') => {
    switch (status) {
      case 'Not Started':
        return 'bg-neutral-100 text-neutral-600 border border-neutral-200';
      case 'In Progress':
        return 'bg-blue-50 text-blue-700 border border-blue-200';
      case 'Completed':
        return 'bg-emerald-50 text-emerald-700 border border-emerald-200';
      default:
        return 'bg-neutral-100 text-neutral-600';
    }
  };

  // SSC-level action handlers
  const handleViewHistory = () => {
    // Scroll to activity section
    document.getElementById('activity-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleDownloadSignedDocuments = () => {
    toast.success('Downloading signed documents...');
  };

  // Participant-level action handlers
  const handleResendNotification = (participant: Participant) => {
    toast.success(`Notification resent to ${participant.name}`);
  };

  const handleViewActivity = (participant: Participant) => {
    toast.info(`Viewing activity for ${participant.name}`);
  };

  // Document-level action handlers
  const handleViewDocument = (doc: ParticipantDocument) => {
    toast.info(`Viewing ${doc.name}`);
  };

  const handleViewSignedDocument = (doc: ParticipantDocument) => {
    toast.info(`Viewing signed version of ${doc.name}`);
  };

  const handleDownloadSignedDocument = (doc: ParticipantDocument) => {
    toast.success(`Downloading signed ${doc.name}`);
  };

  const isDraft = packet.status === 'Draft';
  const isPendingOrInProgress = packet.status === 'Pending' || packet.status === 'In Progress';
  const isCompleted = packet.status === 'Completed';

  return (
    <div className="p-6 space-y-6">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-neutral-600 hover:text-neutral-900 transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-5 h-5" />
        Back to Signing Ceremonies
      </button>

      {/* SSC LEVEL - TOP SECTION */}
      <div className="bg-white border border-neutral-200 rounded-lg p-6 shadow-sm">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            {/* Signing Ceremony Name */}
            <div className="flex items-center gap-3 mb-3">
              <h1 className="text-2xl font-semibold text-neutral-900">{packet.name}</h1>
              {/* SSC Status Badge */}
              <span className={`inline-flex px-2.5 py-1 rounded text-xs font-medium ${getSSCStatusClass()}`}>
                {packet.status}
              </span>
            </div>

            {/* Metadata */}
            <div className="flex items-center gap-4 text-sm text-neutral-600">
              <span className="flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-neutral-400" />
                {packet.id}
              </span>
              <span className="text-neutral-400">•</span>
              <span>Created {formatDate(packet.createdAt || packet.updatedAt)}</span>
              <span className="text-neutral-400">•</span>
              <span>Last Updated {formatDate(packet.updatedAt)}</span>
            </div>
          </div>

          {/* SSC-level Actions (conditional) */}
          <div className="flex items-center gap-2">
            {/* Draft → no actions */}
            {isDraft && (
              <div className="text-sm text-neutral-500 italic">No actions available</div>
            )}

            {/* Pending / In Progress → View History */}
            {isPendingOrInProgress && (
              <button
                onClick={handleViewHistory}
                className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-neutral-200 text-neutral-700 rounded-lg hover:bg-neutral-50 transition-colors cursor-pointer font-medium"
              >
                <History className="w-4 h-4" />
                View History
              </button>
            )}

            {/* Completed → Download Signed Documents, View History */}
            {isCompleted && (
              <>
                <button
                  onClick={handleDownloadSignedDocuments}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500 text-neutral-900 rounded-lg hover:bg-emerald-600 transition-colors cursor-pointer font-medium"
                >
                  <Download className="w-4 h-4" />
                  Download Signed Documents
                </button>
                <button
                  onClick={handleViewHistory}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-neutral-200 text-neutral-700 rounded-lg hover:bg-neutral-50 transition-colors cursor-pointer font-medium"
                >
                  <History className="w-4 h-4" />
                  View History
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* PARTICIPANT LEVEL - REPEATED SECTIONS */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-neutral-900">Participants</h2>

        {participants.map((participant) => (
          <div key={participant.id} className="bg-white border border-neutral-200 rounded-lg overflow-hidden shadow-sm">
            {/* Participant Section Header */}
            <div className="bg-neutral-50 border-b border-neutral-200 px-6 py-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  {/* Participant Name & Email */}
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-base font-semibold text-neutral-900">{participant.name}</h3>
                    {/* Participant Status */}
                    <span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${getParticipantStatusClass(participant.status)}`}>
                      {participant.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-neutral-600">
                    <span>{participant.email}</span>
                    <span className="text-neutral-400">•</span>
                    <span>Last Updated {participant.lastUpdated}</span>
                  </div>
                </div>

                {/* Participant-level Actions (conditional) */}
                <div>
                  {/* Draft SSC → no participant actions */}
                  {isDraft && (
                    <div className="text-sm text-neutral-500 italic">No actions</div>
                  )}

                  {/* Pending participant → Resend Notification */}
                  {!isDraft && participant.status === 'Pending' && (
                    <button
                      onClick={() => handleResendNotification(participant)}
                      className="inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-neutral-200 text-neutral-700 rounded-lg hover:bg-neutral-50 transition-colors cursor-pointer text-sm font-medium"
                    >
                      <Send className="w-3.5 h-3.5" />
                      Resend Notification
                    </button>
                  )}

                  {/* Completed participant → View Activity */}
                  {!isDraft && participant.status === 'Completed' && (
                    <button
                      onClick={() => handleViewActivity(participant)}
                      className="inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-neutral-200 text-neutral-700 rounded-lg hover:bg-neutral-50 transition-colors cursor-pointer text-sm font-medium"
                    >
                      <History className="w-3.5 h-3.5" />
                      View Activity
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* DOCUMENTS GRID (inside participant section) */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-white border-b border-neutral-200">
                  <tr>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider">Document Name</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider">File Type</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider">Signing Status</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider">Last Updated</th>
                    <th className="text-right px-6 py-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {participant.documents.map((doc) => (
                    <tr key={doc.id} className="hover:bg-neutral-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-neutral-400" />
                          <span className="text-sm font-medium text-neutral-900">{doc.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-neutral-600">{doc.fileType}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${getSigningStatusClass(doc.signingStatus)}`}>
                          {doc.signingStatus}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-neutral-600">{doc.lastUpdated}</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        {/* Draft SSC → no actions */}
                        {isDraft && (
                          <span className="text-sm text-neutral-400">—</span>
                        )}

                        {/* Pending / In Progress SSC */}
                        {isPendingOrInProgress && (
                          <>
                            {/* Pending participant → View Document (read-only) */}
                            {participant.status === 'Pending' && (
                              <button
                                onClick={() => handleViewDocument(doc)}
                                className="p-1.5 text-neutral-400 hover:text-neutral-900 rounded-lg hover:bg-neutral-100 transition-colors cursor-pointer"
                                title="View Document"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                            )}

                            {/* Completed participant → View Signed Document */}
                            {participant.status === 'Completed' && (
                              <button
                                onClick={() => handleViewSignedDocument(doc)}
                                className="p-1.5 text-neutral-400 hover:text-neutral-900 rounded-lg hover:bg-neutral-100 transition-colors cursor-pointer"
                                title="View Signed Document"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                            )}
                          </>
                        )}

                        {/* Completed SSC → View Signed Document, Download Signed Document */}
                        {isCompleted && (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <button className="p-1.5 text-neutral-400 hover:text-neutral-900 rounded-lg hover:bg-neutral-100 transition-colors cursor-pointer">
                                <MoreHorizontal className="w-4 h-4" />
                              </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleViewSignedDocument(doc)} className="cursor-pointer">
                                <Eye className="w-4 h-4 mr-2" />
                                View Signed Document
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleDownloadSignedDocument(doc)} className="cursor-pointer">
                                <Download className="w-4 h-4 mr-2" />
                                Download Signed Document
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>

      {/* ACTIVITY / HISTORY (SSC LEVEL) */}
      <div id="activity-section" className="bg-white border border-neutral-200 rounded-lg p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-neutral-900 mb-6">Activity / History</h2>
        
        <div className="space-y-4">
          {activityLog.map((event, index) => (
            <div key={event.id} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="w-2 h-2 bg-neutral-400 rounded-full mt-1.5"></div>
                {index < activityLog.length - 1 && (
                  <div className="w-px h-full bg-neutral-200 my-1"></div>
                )}
              </div>
              <div className="flex-1 pb-4">
                <div className="flex items-center justify-between mb-1">
                  <div className="text-sm font-medium text-neutral-900">{event.action}</div>
                  <div className="text-xs text-neutral-500">{event.timestamp}</div>
                </div>
                <div className="text-sm text-neutral-600 mb-1">{event.description}</div>
                <div className="text-xs text-neutral-500">by {event.actor}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
