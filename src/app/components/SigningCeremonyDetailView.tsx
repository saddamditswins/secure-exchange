import { useState } from 'react';
import { 
  ArrowLeft, 
  FileText, 
  Download, 
  History,
  CheckCircle,
  Clock,
  User,
  Mail,
  Calendar
} from 'lucide-react';

interface Document {
  id: string;
  name: string;
  size: string;
  signedBy: string[];
  totalSigners: number;
  status: 'Pending' | 'Partially Signed' | 'Completed';
}

interface Participant {
  id: string;
  name: string;
  email: string;
  status: 'Pending' | 'Completed';
  lastUpdated: string;
  order?: number;
}

interface AuditEntry {
  id: string;
  timestamp: string;
  actor: string;
  action: string;
  details: string;
}

interface SigningCeremony {
  id: string;
  name: string;
  status: 'New' | 'In Progress' | 'Completed';
  createdDate: string;
  lastUpdated: string;
  signingOrder: 'Any Order' | 'In Order';
}

interface SigningCeremonyDetailViewProps {
  ceremony: SigningCeremony;
  onBack: () => void;
}

export function SigningCeremonyDetailView({ ceremony: initialCeremony, onBack }: SigningCeremonyDetailViewProps) {
  const [ceremony] = useState(initialCeremony);

  const [documents] = useState<Document[]>([
    {
      id: 'DOC-001',
      name: 'Service_Agreement.pdf',
      size: '2.4 MB',
      signedBy: ['John Smith'],
      totalSigners: 2,
      status: 'Partially Signed'
    },
    {
      id: 'DOC-002',
      name: 'Terms_and_Conditions.pdf',
      size: '845 KB',
      signedBy: [],
      totalSigners: 2,
      status: 'Pending'
    },
  ]);

  const [participants] = useState<Participant[]>([
    {
      id: 'P-001',
      name: 'John Smith',
      email: 'john.smith@example.com',
      status: 'Completed',
      lastUpdated: '01/07/2026 10:30 AM',
      order: 1
    },
    {
      id: 'P-002',
      name: 'Sarah Johnson',
      email: 'sarah.j@example.com',
      status: 'Pending',
      lastUpdated: '01/07/2026 09:15 AM',
      order: 2
    },
  ]);

  const [auditLog] = useState<AuditEntry[]>([
    {
      id: 'A-005',
      timestamp: '01/07/2026 10:30 AM',
      actor: 'John Smith',
      action: 'Document Signed',
      details: 'Signed Service_Agreement.pdf'
    },
    {
      id: 'A-004',
      timestamp: '01/07/2026 10:15 AM',
      actor: 'John Smith',
      action: 'Ceremony Viewed',
      details: 'Accessed signing ceremony via secure link'
    },
    {
      id: 'A-003',
      timestamp: '01/07/2026 09:45 AM',
      actor: 'System',
      action: 'Notification Sent',
      details: 'Email notification sent to John Smith'
    },
    {
      id: 'A-002',
      timestamp: '01/07/2026 09:30 AM',
      actor: 'Current User',
      action: 'Ceremony Sent',
      details: 'Signing ceremony sent to all participants'
    },
    {
      id: 'A-001',
      timestamp: '01/07/2026 09:15 AM',
      actor: 'Current User',
      action: 'Ceremony Created',
      details: `Signing ceremony ${ceremony.id} created`
    },
  ]);

  const getStatusBadge = (status: string) => {
    const styles = {
      'New': 'bg-blue-100 text-blue-700',
      'In Progress': 'bg-yellow-100 text-yellow-700',
      'Completed': 'bg-emerald-100 text-emerald-700',
      'Pending': 'bg-yellow-100 text-yellow-700',
      'Partially Signed': 'bg-blue-100 text-blue-700',
    };
    return styles[status as keyof typeof styles] || 'bg-neutral-100 text-neutral-600';
  };

  const handleDownloadSigned = () => {
    console.log('Download signed files');
  };

  const handleViewHistory = () => {
    console.log('View history');
  };

  return (
    <div className="max-w-[1400px] mx-auto p-8">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-neutral-600 hover:text-neutral-900 mb-6 transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-5 h-5" />
        Back to Signing Ceremonies
      </button>

      {/* Header */}
      <div className="bg-white border border-neutral-200 rounded-xl p-6 mb-6 shadow-sm">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-2xl font-semibold text-neutral-900">{ceremony.name}</h2>
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${getStatusBadge(ceremony.status)}`}>
                {ceremony.status}
              </span>
            </div>
            <div className="text-sm text-neutral-500">Ceremony ID: {ceremony.id}</div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleViewHistory}
              className="px-4 py-2 bg-white border border-neutral-200 text-neutral-700 rounded-lg hover:bg-neutral-50 transition-colors font-medium cursor-pointer flex items-center gap-2"
            >
              <History className="w-4 h-4" />
              View History
            </button>
            {ceremony.status === 'Completed' && (
              <button
                onClick={handleDownloadSigned}
                className="px-4 py-2 bg-emerald-500 text-neutral-900 rounded-lg hover:bg-emerald-600 transition-colors font-medium cursor-pointer flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Download Signed Files
              </button>
            )}
          </div>
        </div>

        {/* Summary Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-neutral-100">
          <div>
            <div className="text-xs font-medium text-neutral-500 uppercase tracking-wide mb-2">Signing Order</div>
            <div className="text-sm text-neutral-900">{ceremony.signingOrder}</div>
          </div>
          <div>
            <div className="text-xs font-medium text-neutral-500 uppercase tracking-wide mb-2">Created</div>
            <div className="text-sm text-neutral-900">{ceremony.createdDate}</div>
          </div>
          <div>
            <div className="text-xs font-medium text-neutral-500 uppercase tracking-wide mb-2">Last Updated</div>
            <div className="text-sm text-neutral-900">{ceremony.lastUpdated}</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Participants Section */}
        <div className="bg-white border border-neutral-200 rounded-lg overflow-hidden">
          <div className="px-6 py-4 bg-neutral-50 border-b border-neutral-200">
            <h3 className="font-medium text-neutral-900">Participants ({participants.length})</h3>
          </div>
          <div className="divide-y divide-neutral-100">
            {participants.map((participant) => (
              <div key={participant.id} className="px-6 py-4">
                <div className="flex items-start gap-3">
                  {participant.order && (
                    <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center font-medium text-sm flex-shrink-0">
                      {participant.order}
                    </div>
                  )}
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-medium text-neutral-900">{participant.name}</div>
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${getStatusBadge(participant.status)}`}>
                        {participant.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-sm text-neutral-500 mb-1">
                      <Mail className="w-3.5 h-3.5" />
                      <span>{participant.email}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-neutral-400">
                      <Clock className="w-3.5 h-3.5" />
                      <span>Last updated: {participant.lastUpdated}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Documents Section */}
        <div className="bg-white border border-neutral-200 rounded-lg overflow-hidden">
          <div className="px-6 py-4 bg-neutral-50 border-b border-neutral-200">
            <h3 className="font-medium text-neutral-900">Documents ({documents.length})</h3>
          </div>
          <div className="divide-y divide-neutral-100">
            {documents.map((doc) => (
              <div key={doc.id} className="px-6 py-4">
                <div className="flex items-start gap-3">
                  <FileText className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-medium text-neutral-900">{doc.name}</div>
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${getStatusBadge(doc.status)}`}>
                        {doc.status}
                      </span>
                    </div>
                    <div className="text-sm text-neutral-500 mb-2">{doc.size}</div>
                    <div className="flex items-center gap-2">
                      <div className="text-xs text-neutral-600">
                        Signed: {doc.signedBy.length} of {doc.totalSigners}
                      </div>
                      {doc.signedBy.length > 0 && (
                        <div className="flex -space-x-2">
                          {doc.signedBy.map((signer, idx) => (
                            <div
                              key={idx}
                              className="w-6 h-6 rounded-full bg-emerald-100 border-2 border-white flex items-center justify-center text-emerald-700 text-xs font-medium"
                              title={signer}
                            >
                              {signer.charAt(0)}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Activity / Audit Section */}
      <div className="mt-6 bg-white border border-neutral-200 rounded-lg overflow-hidden">
        <div className="px-6 py-4 bg-neutral-50 border-b border-neutral-200">
          <h3 className="font-medium text-neutral-900">Activity Timeline</h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {auditLog.map((entry, index) => (
              <div key={entry.id} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className={`w-2 h-2 rounded-full mt-1.5 ${
                    entry.action.includes('Signed') || entry.action.includes('Completed') 
                      ? 'bg-emerald-500' 
                      : 'bg-blue-500'
                  }`}></div>
                  {index < auditLog.length - 1 && (
                    <div className="w-px h-full bg-neutral-200 mt-1"></div>
                  )}
                </div>
                <div className="flex-1 pb-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-medium text-neutral-900">{entry.action}</div>
                      <div className="text-sm text-neutral-600 mt-0.5">{entry.details}</div>
                      <div className="flex items-center gap-2 text-xs text-neutral-500 mt-1">
                        <User className="w-3 h-3" />
                        <span>{entry.actor}</span>
                        <span>•</span>
                        <Calendar className="w-3 h-3" />
                        <span>{entry.timestamp}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
