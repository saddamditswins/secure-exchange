import { useState } from 'react';
import { LayoutGrid, FileText, ShieldAlert, Scale } from 'lucide-react';
import { 
  PieChart, Pie, Cell, 
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';

interface DocumentExchange {
  workspaceId: string;
  documentName: string;
  externalRecipient: string;
  accessType: 'View' | 'Sign';
  expiry: string;
  riskLevel: 'Low' | 'Medium' | 'High';
  status: 'Active' | 'Pending Review' | 'Expiring Soon';
  sharedBy: string;
  sharedDate: string;
}

interface DashboardViewProps {
  onReviewDocument: (doc: DocumentExchange) => void;
  onViewWorkspace: (workspaceId: string) => void;
  userPermissions?: {
    viewBasic?: boolean;
    viewDetailed?: boolean;
  };
}

export function DashboardView({ onReviewDocument, onViewWorkspace, userPermissions = { viewDetailed: true } }: DashboardViewProps) {
  const [filterRisk, setFilterRisk] = useState<string>('All');
  
  // Determine access level - if viewDetailed, show full dashboard; otherwise show basic
  const hasDetailedAccess = userPermissions.viewDetailed === true;
  const hasBasicAccess = userPermissions.viewBasic === true || hasDetailedAccess;

  const mockDocumentExchanges: DocumentExchange[] = [
    {
      workspaceId: 'EX-2024-0145',
      documentName: 'Q4_Financial_Report_2024.pdf',
      externalRecipient: 'john.smith@boardmember.com',
      accessType: 'Sign',
      expiry: '2025-01-15',
      riskLevel: 'Medium',
      status: 'Active',
      sharedBy: 'Sarah Mitchell',
      sharedDate: '2024-12-15',
    },
    {
      workspaceId: 'EX-2024-0142',
      documentName: 'Compliance_Report_2024.pdf',
      externalRecipient: 'auditor@externalfirm.com',
      accessType: 'View',
      expiry: '2025-01-05',
      riskLevel: 'High',
      status: 'Expiring Soon',
      sharedBy: 'Sarah Mitchell',
      sharedDate: '2024-12-05',
    },
    {
      workspaceId: 'EX-2024-0144',
      documentName: 'Vendor_Contract_Draft.pdf',
      externalRecipient: 'legal@vendorcorp.com',
      accessType: 'Sign',
      expiry: '2025-02-01',
      riskLevel: 'Low',
      status: 'Pending Review',
      sharedBy: 'James Rodriguez',
      sharedDate: '2024-12-28',
    },
    {
      workspaceId: 'EX-2024-0145',
      documentName: 'Board_Resolution_Draft.pdf',
      externalRecipient: 'maria.garcia@boardmember.com',
      accessType: 'Sign',
      expiry: '2025-01-15',
      riskLevel: 'Medium',
      status: 'Active',
      sharedBy: 'Sarah Mitchell',
      sharedDate: '2024-12-15',
    },
    {
      workspaceId: 'EX-2024-0141',
      documentName: 'Partnership_Agreement.pdf',
      externalRecipient: 'partner@techfirm.com',
      accessType: 'Sign',
      expiry: '2025-01-20',
      riskLevel: 'Medium',
      status: 'Active',
      sharedBy: 'James Rodriguez',
      sharedDate: '2024-11-28',
    },
    {
      workspaceId: 'EX-2024-0142',
      documentName: 'Tax_Documentation.zip',
      externalRecipient: 'auditor@externalfirm.com',
      accessType: 'View',
      expiry: '2025-01-05',
      riskLevel: 'High',
      status: 'Expiring Soon',
      sharedBy: 'Sarah Mitchell',
      sharedDate: '2024-12-05',
    },
    // Duplicates for scrolling demonstration
    {
      workspaceId: 'EX-2024-0146',
      documentName: 'Merger_Proposal_v2.pdf',
      externalRecipient: 'legal@mergercorp.com',
      accessType: 'View',
      expiry: '2025-03-01',
      riskLevel: 'High',
      status: 'Active',
      sharedBy: 'Sarah Mitchell',
      sharedDate: '2025-01-02',
    },
    {
      workspaceId: 'EX-2024-0147',
      documentName: 'Employee_Handbook_2025.pdf',
      externalRecipient: 'hr@partnerfirm.com',
      accessType: 'View',
      expiry: '2025-12-31',
      riskLevel: 'Low',
      status: 'Active',
      sharedBy: 'James Rodriguez',
      sharedDate: '2025-01-03',
    },
    {
      workspaceId: 'EX-2024-0148',
      documentName: 'Audit_Findings_Q4.xlsx',
      externalRecipient: 'auditor@externalfirm.com',
      accessType: 'View',
      expiry: '2025-02-15',
      riskLevel: 'Medium',
      status: 'Pending Review',
      sharedBy: 'Sarah Mitchell',
      sharedDate: '2025-01-04',
    },
    {
      workspaceId: 'EX-2024-0149',
      documentName: 'Investigator_Report.pdf',
      externalRecipient: 'investigator@agency.gov',
      accessType: 'View',
      expiry: '2025-01-30',
      riskLevel: 'High',
      status: 'Active',
      sharedBy: 'James Rodriguez',
      sharedDate: '2025-01-05',
    },
  ];

  const riskFilters = ['All', 'Low', 'Medium', 'High'];

  const filteredExchanges = filterRisk === 'All' 
    ? mockDocumentExchanges 
    : mockDocumentExchanges.filter(doc => doc.riskLevel === filterRisk);

  // Calculate metrics
  const activeWorkspaces = new Set(mockDocumentExchanges.map(d => d.workspaceId)).size;
  const documentsShared = mockDocumentExchanges.length;
  const riskCounts = {
    Low: mockDocumentExchanges.filter(d => d.riskLevel === 'Low').length,
    Medium: mockDocumentExchanges.filter(d => d.riskLevel === 'Medium').length,
    High: mockDocumentExchanges.filter(d => d.riskLevel === 'High').length,
  };
  const pendingDecisions = mockDocumentExchanges.filter(d => d.status === 'Pending Review').length;

  // Chart Data
  const riskData = [
    { name: 'Low', value: riskCounts.Low, color: '#34d399' },
    { name: 'Medium', value: riskCounts.Medium, color: '#fbbf24' },
    { name: 'High', value: riskCounts.High, color: '#fb923c' },
  ].filter(d => d.value > 0);

  const statusCounts = mockDocumentExchanges.reduce((acc, doc) => {
    acc[doc.status] = (acc[doc.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const statusData = Object.entries(statusCounts).map(([name, value]) => ({
    name,
    value,
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#153240] border border-[#243F4D] p-3 rounded-lg shadow-lg">
          <p className="text-neutral-900 font-medium mb-1">{label || payload[0].name}</p>
          <p className="text-emerald-500 text-sm">
            {payload[0].value} {payload[0].name === 'value' ? 'Documents' : ''}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full min-w-full p-4 md:p-8">
      <div className="mb-8">
        <h2 className="text-neutral-900 mb-2">Dashboard</h2>
        <p className="text-sm text-neutral-600">Key metrics and activity overview</p>
      </div>

      {/* Metrics Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
        <div className="bg-white border border-neutral-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-neutral-500">Active Workspaces</span>
            <div className="p-2 bg-[#153240] rounded-lg">
              <LayoutGrid className="w-5 h-5 text-blue-600" />
            </div>
          </div>
          <div className="text-3xl font-semibold text-neutral-900">{activeWorkspaces}</div>
        </div>

        <div className="bg-white border border-neutral-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-neutral-500">Documents Shared</span>
            <div className="p-2 bg-[#153240] rounded-lg">
              <FileText className="w-5 h-5 text-purple-600" />
            </div>
          </div>
          <div className="text-3xl font-semibold text-neutral-900">{documentsShared}</div>
        </div>

        <div className="bg-white border border-neutral-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-neutral-500">Documents at Risk</span>
            <div className="p-2 bg-[#153240] rounded-lg">
              <ShieldAlert className="w-5 h-5 text-amber-600" />
            </div>
          </div>
          <div className="flex items-center justify-between gap-2">
            <div 
              className={`flex flex-col items-center flex-1 ${hasDetailedAccess ? 'cursor-pointer hover:opacity-80' : ''} transition-opacity ${filterRisk === 'High' && hasDetailedAccess ? 'ring-2 ring-orange-200 rounded-lg' : ''}`}
              onClick={() => hasDetailedAccess && setFilterRisk('High')}
            >
              <span className="text-xs text-neutral-500 mb-1">High</span>
              <span className="text-lg font-bold text-orange-700 bg-orange-50 px-2 py-0.5 rounded">{riskCounts.High}</span>
            </div>
            <div className="w-px h-8 bg-neutral-200"></div>
            <div 
              className={`flex flex-col items-center flex-1 ${hasDetailedAccess ? 'cursor-pointer hover:opacity-80' : ''} transition-opacity ${filterRisk === 'Medium' && hasDetailedAccess ? 'ring-2 ring-amber-200 rounded-lg' : ''}`}
              onClick={() => hasDetailedAccess && setFilterRisk('Medium')}
            >
              <span className="text-xs text-neutral-500 mb-1">Med</span>
              <span className="text-lg font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">{riskCounts.Medium}</span>
            </div>
            <div className="w-px h-8 bg-neutral-200"></div>
            <div 
              className={`flex flex-col items-center flex-1 ${hasDetailedAccess ? 'cursor-pointer hover:opacity-80' : ''} transition-opacity ${filterRisk === 'Low' && hasDetailedAccess ? 'ring-2 ring-green-200 rounded-lg' : ''}`}
              onClick={() => hasDetailedAccess && setFilterRisk('Low')}
            >
              <span className="text-xs text-neutral-500 mb-1">Low</span>
              <span className="text-lg font-bold text-green-700 bg-green-50 px-2 py-0.5 rounded">{riskCounts.Low}</span>
            </div>
          </div>
        </div>

        <div className="bg-white border border-neutral-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-neutral-500">Pending Decisions</span>
            <div className="p-2 bg-[#153240] rounded-lg">
              <Scale className="w-5 h-5 text-rose-600" />
            </div>
          </div>
          <div className="flex items-end justify-between">
            <div className="text-3xl font-semibold text-neutral-900">{pendingDecisions}</div>
            {pendingDecisions > 0 && (
              <span className="text-xs font-medium text-rose-600 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-100">
                Requires review
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Analytics Charts - Only visible with Detailed access */}
      {hasDetailedAccess && (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Risk Distribution Chart */}
        <div className="bg-white border border-neutral-200 rounded-xl p-6 shadow-sm">
          <h3 className="text-neutral-900 font-medium mb-4">Risk Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={riskData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {riskData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.color} 
                      className="cursor-pointer hover:opacity-80 transition-opacity"
                      onClick={() => setFilterRisk(entry.name)}
                      strokeWidth={0}
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="text-center text-sm text-neutral-500 mt-2">
            Click segments to filter documents
          </div>
        </div>

        {/* Document Status Chart */}
        <div className="bg-white border border-neutral-200 rounded-xl p-6 shadow-sm">
          <h3 className="text-neutral-900 font-medium mb-4">Document Status Overview</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={statusData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#243F4D" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#94A3B8', fontSize: 12 }} 
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#94A3B8', fontSize: 12 }} 
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="value" fill="#e2e8f0" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      )}

      {/* Active Document Exchanges Table */}
      <div className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-4">
          <h3 className="text-neutral-900">Active Document Exchanges</h3>
          {hasDetailedAccess && (
          <div className="bg-white border border-neutral-200 rounded-lg p-3">
            <div className="flex items-center gap-3">
              <label className="text-sm font-medium text-neutral-700 whitespace-nowrap">
                Filter by Risk:
              </label>
              <div className="w-[180px]">
                <Select
                  value={filterRisk}
                  onValueChange={(value) => setFilterRisk(value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {riskFilters.map((risk) => (
                      <SelectItem key={risk} value={risk}>
                        {risk}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {filterRisk !== 'All' && (
                <button
                  onClick={() => setFilterRisk('All')}
                  className="text-sm text-neutral-600 hover:text-neutral-900 underline cursor-pointer"
                >
                  Clear filter
                </button>
              )}
            </div>
          </div>
          )}
        </div>

        <div className="bg-white border border-neutral-200 rounded-lg h-[500px] overflow-auto relative shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead className="bg-neutral-50 border-b border-neutral-200 sticky top-0 z-10 shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
              <tr>
                <th className="px-6 py-3 text-sm font-medium text-neutral-600 bg-neutral-50 whitespace-nowrap">Workspace ID</th>
                <th className="px-6 py-3 text-sm font-medium text-neutral-600 bg-neutral-50">Document Name</th>
                <th className="px-6 py-3 text-sm font-medium text-neutral-600 bg-neutral-50">External Recipient</th>
                <th className="px-6 py-3 text-sm font-medium text-neutral-600 bg-neutral-50 whitespace-nowrap">Access Type</th>
                <th className="px-6 py-3 text-sm font-medium text-neutral-600 bg-neutral-50 whitespace-nowrap">Expiry</th>
                <th className="px-6 py-3 text-sm font-medium text-neutral-600 bg-neutral-50">Risk Level</th>
                <th className="px-6 py-3 text-sm font-medium text-neutral-600 bg-neutral-50">Status</th>
                <th className="px-6 py-3 text-sm font-medium text-neutral-600 bg-neutral-50">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredExchanges.map((doc, index) => (
                <tr
                  key={`${doc.workspaceId}-${index}`}
                  onClick={() => onReviewDocument(doc)}
                  className="border-b border-neutral-100 hover:bg-neutral-50 cursor-pointer transition-colors"
                >
                  <td className="px-6 py-4 text-sm text-neutral-900 whitespace-nowrap">{doc.workspaceId}</td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-neutral-900">{doc.documentName}</div>
                    <div className="text-xs text-neutral-500">Shared by {doc.sharedBy}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-neutral-700">{doc.externalRecipient}</td>
                  <td className="px-6 py-4">
                    <AccessTypeBadge type={doc.accessType} />
                  </td>
                  <td className="px-6 py-4 text-sm text-neutral-700 whitespace-nowrap">{doc.expiry}</td>
                  <td className="px-6 py-4">
                    <RiskBadge level={doc.riskLevel} />
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={doc.status} />
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onViewWorkspace(doc.workspaceId);
                      }}
                      className="text-sm text-neutral-600 hover:text-neutral-900 transition-colors cursor-pointer"
                    >
                      Review
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function RiskBadge({ level }: { level: 'Low' | 'Medium' | 'High' }) {
  const styles = {
    Low: 'bg-green-50 text-green-700',
    Medium: 'bg-amber-50 text-amber-700',
    High: 'bg-orange-50 text-orange-700',
  };

  return (
    <span className={`inline-flex px-2.5 py-1 rounded text-xs ${styles[level]}`}>
      {level}
    </span>
  );
}

function AccessTypeBadge({ type }: { type: 'View' | 'Sign' }) {
  const styles = {
    View: 'bg-blue-50 text-blue-700',
    Sign: 'bg-purple-50 text-purple-700',
  };

  return (
    <span className={`inline-flex px-2.5 py-1 rounded text-xs ${styles[type]}`}>
      {type}
    </span>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    Active: 'bg-green-50 text-green-700',
    'Pending Review': 'bg-amber-50 text-amber-700',
    'Expiring Soon': 'bg-orange-50 text-orange-700',
  };

  return (
    <span className={`inline-flex px-2.5 py-1 rounded text-xs whitespace-nowrap ${styles[status] || 'bg-neutral-100 text-neutral-700'}`}>
      {status}
    </span>
  );
}