import { useState, useMemo, useEffect, useRef } from 'react';
import { 
  FileText, 
  Eye, 
  Upload, 
  Send, 
  Edit3, 
  MoreVertical,
  CheckCircle2,
  Clock,
  AlertCircle,
  TrendingUp,
  PenTool,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Download,
  Copy
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { MultiSelectFilter } from './ui/multi-select-filter';
import { toast } from 'sonner';

interface Exchange {
  id: string;
  name: string;
  workspace: string;
  workspaceId: string;
  status: 'Draft' | 'Sent' | 'In Progress' | 'Completed';
  documentsSent: number;
  documentsSigned: number;
  expiry: string;
  lastActivity: string;
  lastActivityTimestamp: number;
  participants?: string[];
  pendingParticipants?: string[];
}

interface Task {
  id: string;
  type: 'prepare' | 'upload' | 'followup' | 'review';
  title: string;
  exchangeId: string;
  exchangeName: string;
}

interface Activity {
  id: string;
  type: 'upload' | 'sent' | 'viewed' | 'signed' | 'completed';
  description: string;
  timestamp: string;
  exchangeName: string;
}

type SortField = 'name' | 'workspace' | 'status' | 'expiry' | 'lastActivity' | null;
type SortDirection = 'asc' | 'desc' | null;

// Mock Data
const MOCK_EXCHANGES: Exchange[] = [
  { id: 'EX-2027', name: 'Q4 2025 Financial Statements', workspace: 'Acme Financial', workspaceId: 'WF-001', status: 'In Progress', documentsSent: 5, documentsSigned: 3, expiry: '01/15/2026', lastActivity: '01/07/2026 09:30 AM', lastActivityTimestamp: 1736247000000, participants: ['John Smith', 'Sarah Lee', 'Mike Chen'], pendingParticipants: ['Sarah Lee', 'Mike Chen'] },
  { id: 'EX-2028', name: 'Client Onboarding - ABC Corp', workspace: 'Sterling Investments', workspaceId: 'WF-002', status: 'Sent', documentsSent: 3, documentsSigned: 0, expiry: '01/20/2026', lastActivity: '01/07/2026 08:15 AM', lastActivityTimestamp: 1736242500000, participants: ['Alice Johnson'], pendingParticipants: ['Alice Johnson'] },
  { id: 'EX-2029', name: 'Contract Amendment - Vendor A', workspace: 'Meridian Capital', workspaceId: 'WF-003', status: 'Draft', documentsSent: 2, documentsSigned: 0, expiry: '01/25/2026', lastActivity: '01/06/2026 05:45 PM', lastActivityTimestamp: 1736182500000, participants: [], pendingParticipants: [] },
  { id: 'EX-2030', name: 'Annual Audit Documents', workspace: 'Apex Financial Group', workspaceId: 'WF-004', status: 'Completed', documentsSent: 8, documentsSigned: 8, expiry: '01/10/2026', lastActivity: '01/07/2026 10:00 AM', lastActivityTimestamp: 1736248800000, participants: ['David Kim', 'Lisa Park'], pendingParticipants: [] },
  { id: 'EX-2031', name: 'Compliance Report Q1 2026', workspace: 'Acme Financial', workspaceId: 'WF-001', status: 'In Progress', documentsSent: 4, documentsSigned: 2, expiry: '01/18/2026', lastActivity: '01/07/2026 07:20 AM', lastActivityTimestamp: 1736239200000, participants: ['Tom Wilson', 'Emily Brown'], pendingParticipants: ['Emily Brown'] },
  { id: 'EX-2032', name: 'Partnership Agreement Review', workspace: 'Nova Holdings', workspaceId: 'WF-005', status: 'Sent', documentsSent: 6, documentsSigned: 1, expiry: '01/22/2026', lastActivity: '01/06/2026 04:30 PM', lastActivityTimestamp: 1736178000000, participants: ['Robert Garcia', 'Jennifer Lee', 'Mark Davis'], pendingParticipants: ['Jennifer Lee', 'Mark Davis'] },
  { id: 'EX-2033', name: 'Tax Document Collection', workspace: 'Sterling Investments', workspaceId: 'WF-002', status: 'Draft', documentsSent: 1, documentsSigned: 0, expiry: '01/30/2026', lastActivity: '01/06/2026 03:15 PM', lastActivityTimestamp: 1736173500000, participants: [], pendingParticipants: [] },
  { id: 'EX-2034', name: 'Policy Update Acknowledgment', workspace: 'Meridian Capital', workspaceId: 'WF-003', status: 'Completed', documentsSent: 3, documentsSigned: 3, expiry: '01/08/2026', lastActivity: '01/07/2026 09:45 AM', lastActivityTimestamp: 1736246700000, participants: ['Susan White'], pendingParticipants: [] },
  { id: 'EX-2035', name: 'Investment Portfolio Review', workspace: 'Apex Financial Group', workspaceId: 'WF-004', status: 'In Progress', documentsSent: 7, documentsSigned: 5, expiry: '01/12/2026', lastActivity: '01/07/2026 08:50 AM', lastActivityTimestamp: 1736244600000, participants: ['Chris Martin', 'Diana Ross', 'Frank Ocean'], pendingParticipants: ['Frank Ocean'] },
  { id: 'EX-2036', name: 'NDA - Strategic Partner', workspace: 'Acme Financial', workspaceId: 'WF-001', status: 'Sent', documentsSent: 1, documentsSigned: 0, expiry: '01/14/2026', lastActivity: '01/07/2026 06:30 AM', lastActivityTimestamp: 1736236200000, participants: ['Alex Turner'], pendingParticipants: ['Alex Turner'] },
  { id: 'EX-2037', name: 'Employee Benefits Enrollment', workspace: 'Nova Holdings', workspaceId: 'WF-005', status: 'In Progress', documentsSent: 10, documentsSigned: 7, expiry: '01/28/2026', lastActivity: '01/06/2026 02:00 PM', lastActivityTimestamp: 1736169000000, participants: ['Multiple Employees'], pendingParticipants: ['3 employees'] },
  { id: 'EX-2038', name: 'Lease Agreement Extension', workspace: 'Sterling Investments', workspaceId: 'WF-002', status: 'Completed', documentsSent: 2, documentsSigned: 2, expiry: '01/05/2026', lastActivity: '01/07/2026 10:15 AM', lastActivityTimestamp: 1736249700000, participants: ['Property Manager'], pendingParticipants: [] },
];

const MOCK_TASKS: Task[] = [
  { id: 'T-001', type: 'prepare', title: 'Prepare exchange for sending', exchangeId: 'EX-2029', exchangeName: 'Contract Amendment - Vendor A' },
  { id: 'T-002', type: 'upload', title: 'Upload missing document', exchangeId: 'EX-2033', exchangeName: 'Tax Document Collection' },
  { id: 'T-003', type: 'followup', title: 'Follow up on pending signature', exchangeId: 'EX-2028', exchangeName: 'Client Onboarding - ABC Corp' },
  { id: 'T-004', type: 'followup', title: 'Follow up on pending signature', exchangeId: 'EX-2031', exchangeName: 'Compliance Report Q1 2026' },
  { id: 'T-005', type: 'review', title: 'Review completed exchange', exchangeId: 'EX-2038', exchangeName: 'Lease Agreement Extension' },
];

const MOCK_ACTIVITIES: Activity[] = [
  { id: 'A-001', type: 'signed', description: 'David Kim signed document in', timestamp: '01/07/2026 10:00 AM', exchangeName: 'Annual Audit Documents' },
  { id: 'A-002', type: 'completed', description: 'All signatures completed for', timestamp: '01/07/2026 10:15 AM', exchangeName: 'Lease Agreement Extension' },
  { id: 'A-003', type: 'viewed', description: 'Alice Johnson viewed document in', timestamp: '01/07/2026 09:45 AM', exchangeName: 'Client Onboarding - ABC Corp' },
  { id: 'A-004', type: 'signed', description: 'Chris Martin signed document in', timestamp: '01/07/2026 09:30 AM', exchangeName: 'Investment Portfolio Review' },
  { id: 'A-005', type: 'upload', description: 'Document uploaded to', timestamp: '01/07/2026 09:15 AM', exchangeName: 'Q4 2025 Financial Statements' },
  { id: 'A-006', type: 'sent', description: 'Exchange sent to participants:', timestamp: '01/07/2026 08:15 AM', exchangeName: 'Client Onboarding - ABC Corp' },
  { id: 'A-007', type: 'signed', description: 'Tom Wilson signed document in', timestamp: '01/07/2026 07:20 AM', exchangeName: 'Compliance Report Q1 2026' },
  { id: 'A-008', type: 'sent', description: 'Exchange sent to participants:', timestamp: '01/07/2026 06:30 AM', exchangeName: 'NDA - Strategic Partner' },
];

const WORKSPACES = Array.from(new Set(MOCK_EXCHANGES.map(e => e.workspace))).sort();
const STATUSES = ['Draft', 'Sent', 'In Progress', 'Completed'];

export function PrimaryOperationalDashboard() {
  const [activeKPI, setActiveKPI] = useState<string | null>(null);
  const [selectedWorkspaces, setSelectedWorkspaces] = useState<string[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const [sortField, setSortField] = useState<SortField>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);
  
  // Calculate number of in-progress signings
  const inProgressExchanges = MOCK_EXCHANGES.filter(e => e.status === 'In Progress');

  // Calculate KPI metrics
  const activeExchanges = MOCK_EXCHANGES.filter(e => e.status !== 'Completed').length;
  const pendingActions = MOCK_EXCHANGES.filter(e => e.status === 'Draft' || e.status === 'Sent').length;
  const inProgressSignings = MOCK_EXCHANGES.filter(e => e.status === 'In Progress').length;
  const completedToday = MOCK_EXCHANGES.filter(e => e.status === 'Completed' && e.lastActivity.startsWith('01/07/2026')).length;
  const uploadsToday = MOCK_ACTIVITIES.filter(a => a.type === 'upload' && a.timestamp.startsWith('01/07/2026')).length;

  // Filter exchanges based on KPI selection and other filters
  const filteredExchanges = useMemo(() => {
    let exchanges = [...MOCK_EXCHANGES];

    // Apply KPI filter
    if (activeKPI === 'active') {
      exchanges = exchanges.filter(e => e.status !== 'Completed');
    } else if (activeKPI === 'pending') {
      exchanges = exchanges.filter(e => e.status === 'Draft' || e.status === 'Sent');
    } else if (activeKPI === 'signing') {
      exchanges = exchanges.filter(e => e.status === 'In Progress');
    } else if (activeKPI === 'completed') {
      exchanges = exchanges.filter(e => e.status === 'Completed' && e.lastActivity.startsWith('01/07/2026'));
    }

    // Apply workspace filter
    if (selectedWorkspaces.length > 0) {
      exchanges = exchanges.filter(e => selectedWorkspaces.includes(e.workspace));
    }

    // Apply status filter
    if (selectedStatuses.length > 0) {
      exchanges = exchanges.filter(e => selectedStatuses.includes(e.status));
    }

    // Apply search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      exchanges = exchanges.filter(e =>
        e.name.toLowerCase().includes(query) ||
        e.id.toLowerCase().includes(query) ||
        e.workspace.toLowerCase().includes(query)
      );
    }

    // Apply sorting
    if (sortField) {
      exchanges.sort((a, b) => {
        if (sortField === 'lastActivity') {
          return sortDirection === 'asc' ? a.lastActivityTimestamp - b.lastActivityTimestamp : b.lastActivityTimestamp - a.lastActivityTimestamp;
        }
        const aValue = a[sortField];
        const bValue = b[sortField];
        if (typeof aValue === 'string' && typeof bValue === 'string') {
          return sortDirection === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
        }
        return 0;
      });
    }

    return exchanges;
  }, [activeKPI, selectedWorkspaces, selectedStatuses, searchQuery, sortField, sortDirection]);

  // Pagination
  const totalPages = Math.ceil(filteredExchanges.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedExchanges = filteredExchanges.slice(startIndex, endIndex);

  const handleKPIClick = (kpi: string) => {
    if (activeKPI === kpi) {
      setActiveKPI(null);
      setCurrentPage(1);
    } else {
      setActiveKPI(kpi);
      setCurrentPage(1);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedWorkspaces([]);
    setSelectedStatuses([]);
    setActiveKPI(null);
    setCurrentPage(1);
    setSortField(null);
    setSortDirection(null);
  };

  const hasActiveFilters = searchQuery || selectedWorkspaces.length > 0 || selectedStatuses.length > 0 || activeKPI;

  const getStatusBadge = (status: string) => {
    const styles = {
      'Draft': 'bg-neutral-100 text-neutral-700',
      'Sent': 'bg-blue-50 text-blue-700',
      'In Progress': 'bg-amber-50 text-amber-700',
      'Completed': 'bg-green-50 text-green-700',
    };
    return styles[status as keyof typeof styles] || 'bg-neutral-100 text-neutral-700';
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'upload': return <Upload className="w-4 h-4 text-blue-500" />;
      case 'sent': return <Send className="w-4 h-4 text-emerald-500" />;
      case 'viewed': return <Eye className="w-4 h-4 text-amber-500" />;
      case 'signed': return <PenTool className="w-4 h-4 text-purple-500" />;
      case 'completed': return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      default: return <Clock className="w-4 h-4 text-neutral-500" />;
    }
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      // Cycle through: asc -> desc -> null
      if (sortDirection === 'asc') {
        setSortDirection('desc');
      } else if (sortDirection === 'desc') {
        setSortField(null);
        setSortDirection(null);
      }
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
    setCurrentPage(1);
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowUpDown className="w-3 h-3 text-neutral-500" />;
    }
    if (sortDirection === 'asc') {
      return <ArrowUp className="w-3 h-3 text-emerald-500" />;
    }
    return <ArrowDown className="w-3 h-3 text-emerald-500" />;
  };

  // Action Handlers
  const handleViewExchange = (exchange: Exchange) => {
    // Validate workspace context
    if (!exchange.workspaceId) {
      toast.error('Workspace context missing. Please open the exchange from a workspace.');
      return;
    }

    // Construct the correct route: /workspaces/{workspaceId}/exchanges/{exchangeId}
    const targetRoute = `/workspaces/${exchange.workspaceId}/exchanges/${exchange.id}`;
    
    // Show navigation feedback
    toast.success(`Opening ${exchange.name}...`, {
      description: `Navigating to ${targetRoute}`
    });
    
    // In production: navigate to exchange detail page
    // window.location.href = targetRoute;
    // OR with React Router: navigate(targetRoute);
  };

  const handleGoToEditor = (exchange: Exchange) => {
    toast.success(`Opening E-Sign Editor for ${exchange.name}...`);
    // In production: navigate to E-Sign editor
  };

  const handleUploadDocument = (exchange: Exchange) => {
    toast.success(`Upload document dialog opened for ${exchange.name}`);
    // In production: open upload modal
  };

  const handleSendExchange = (exchange: Exchange) => {
    toast.success(`${exchange.status === 'Draft' ? 'Sending' : 'Resending'} ${exchange.name}...`);
    // In production: send/resend exchange
  };

  const handleCopyLink = (exchange: Exchange) => {
    const link = `https://secureexchange.app/e/${exchange.id}`;
    navigator.clipboard.writeText(link);
    toast.success('Link copied to clipboard');
  };

  const handleDownloadExchange = (exchange: Exchange) => {
    toast.success(`Downloading documents from ${exchange.name}...`);
    // In production: trigger PDF download
  };

  const handleTaskClick = (task: Task) => {
    const exchange = MOCK_EXCHANGES.find(e => e.id === task.exchangeId);
    if (exchange) {
      if (task.type === 'prepare') {
        handleGoToEditor(exchange);
      } else if (task.type === 'upload') {
        handleUploadDocument(exchange);
      } else if (task.type === 'followup') {
        handleSendExchange(exchange);
      } else {
        handleViewExchange(exchange);
      }
    }
  };

  const handleViewSigning = (exchange: Exchange) => {
    toast.success(`Opening signing view for ${exchange.name}...`);
    // In production: navigate to signing status page
  };

  return (
    <div className="mx-auto w-full max-w-[1600px] p-4 sm:p-6 space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-[#ffffff] mb-1">My Workspace</h1>
        <p className="text-sm text-neutral-400">Track active work and manage your exchanges</p>
      </div>

      {/* Section 1: Operational Snapshot - KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
        <button
          onClick={() => handleKPIClick('active')}
          className={`bg-[#132E3B] border-2 rounded-lg p-5 text-left transition-all cursor-pointer hover:border-emerald-400 hover:shadow-lg ${
            activeKPI === 'active' ? 'border-emerald-500 ring-2 ring-emerald-500 ring-opacity-20' : 'border-[#243F4D]'
          }`}
        >
          <div className="flex items-start justify-between mb-3">
            <div className="text-sm text-neutral-400">Active Exchanges</div>
            <div className="w-10 h-10 bg-emerald-500/10 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-emerald-500" />
            </div>
          </div>
          <div className="text-3xl text-emerald-500 mb-2">{activeExchanges}</div>
          <div className="text-xs text-neutral-500">Live exchanges assigned to you</div>
        </button>

        <button
          onClick={() => handleKPIClick('pending')}
          className={`bg-[#132E3B] border-2 rounded-lg p-5 text-left transition-all cursor-pointer hover:border-amber-400 hover:shadow-lg ${
            activeKPI === 'pending' ? 'border-amber-500 ring-2 ring-amber-500 ring-opacity-20' : 'border-[#243F4D]'
          }`}
        >
          <div className="flex items-start justify-between mb-3">
            <div className="text-sm text-neutral-400">Pending Actions</div>
            <div className="w-10 h-10 bg-amber-500/10 rounded-lg flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-amber-500" />
            </div>
          </div>
          <div className="text-3xl text-amber-500 mb-2">{pendingActions}</div>
          <div className="text-xs text-neutral-500">Requires your attention</div>
        </button>

        <button
          onClick={() => handleKPIClick('signing')}
          className={`bg-[#132E3B] border-2 rounded-lg p-5 text-left transition-all cursor-pointer hover:border-blue-400 hover:shadow-lg ${
            activeKPI === 'signing' ? 'border-blue-500 ring-2 ring-blue-500 ring-opacity-20' : 'border-[#243F4D]'
          }`}
        >
          <div className="flex items-start justify-between mb-3">
            <div className="text-sm text-neutral-400">In-Progress Signings</div>
            <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
              <PenTool className="w-5 h-5 text-blue-500" />
            </div>
          </div>
          <div className="text-3xl text-blue-500 mb-2">{inProgressSignings}</div>
          <div className="text-xs text-neutral-500">Awaiting participant signatures</div>
        </button>

        <button
          onClick={() => handleKPIClick('completed')}
          className={`bg-[#132E3B] border-2 rounded-lg p-5 text-left transition-all cursor-pointer hover:border-green-400 hover:shadow-lg ${
            activeKPI === 'completed' ? 'border-green-500 ring-2 ring-green-500 ring-opacity-20' : 'border-[#243F4D]'
          }`}
        >
          <div className="flex items-start justify-between mb-3">
            <div className="text-sm text-neutral-400">Completed Today</div>
            <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-green-500" />
            </div>
          </div>
          <div className="text-3xl text-green-500 mb-2">{completedToday}</div>
          <div className="text-xs text-neutral-500">Finished today</div>
        </button>

        <div className="bg-[#132E3B] border-2 border-[#243F4D] rounded-lg p-5">
          <div className="flex items-start justify-between mb-3">
            <div className="text-sm text-neutral-400">Uploads Today</div>
            <div className="w-10 h-10 bg-teal-500/10 rounded-lg flex items-center justify-center">
              <Upload className="w-5 h-5 text-teal-500" />
            </div>
          </div>
          <div className="text-3xl text-teal-500 mb-2">{uploadsToday}</div>
          <div className="text-xs text-neutral-500">Documents uploaded today</div>
        </div>
      </div>

      {/* Section 2: My Active Work - Main Exchange Table */}
      <div className="space-y-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-[#ffffff]">My Active Work</h2>
        </div>

        {/* Filters */}
        <div className="bg-[#132E3B] border border-[#243F4D] rounded-lg p-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex-1 relative">
              <svg className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Search exchanges by name or ID..."
                className="w-full pl-10 pr-10 py-2 bg-[#0B2530] border border-[#243F4D] text-[#ffffff] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              {searchQuery && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setCurrentPage(1);
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-300 cursor-pointer"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
            <div className="w-full sm:w-[200px]">
              <MultiSelectFilter
                label="Workspaces"
                options={WORKSPACES}
                selectedValues={selectedWorkspaces}
                onChange={(values) => {
                  setSelectedWorkspaces(values);
                  setCurrentPage(1);
                }}
                placeholder="All Workspaces"
              />
            </div>
            <div className="w-full sm:w-[200px]">
              <MultiSelectFilter
                label="Status"
                options={STATUSES}
                selectedValues={selectedStatuses}
                onChange={(values) => {
                  setSelectedStatuses(values);
                  setCurrentPage(1);
                }}
                placeholder="All Statuses"
              />
            </div>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="px-3 py-2 text-sm text-neutral-400 hover:text-[#ffffff] underline cursor-pointer whitespace-nowrap"
              >
                Clear All
              </button>
            )}
          </div>
        </div>

        {/* Exchange Table */}
        <div className="bg-[#132E3B] border border-[#243F4D] rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px]">
              <thead className="bg-[#0B2530] border-b border-[#243F4D]">
                <tr>
                  <th 
                    className="px-6 py-3 text-left text-xs text-neutral-400 uppercase tracking-wider cursor-pointer hover:text-neutral-300 select-none"
                    onClick={() => handleSort('name')}
                  >
                    <div className="flex items-center gap-1">
                      Exchange
                      {getSortIcon('name')}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs text-neutral-400 uppercase tracking-wider cursor-pointer hover:text-neutral-300 select-none"
                    onClick={() => handleSort('workspace')}
                  >
                    <div className="flex items-center gap-1">
                      Workspace
                      {getSortIcon('workspace')}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs text-neutral-400 uppercase tracking-wider cursor-pointer hover:text-neutral-300 select-none"
                    onClick={() => handleSort('status')}
                  >
                    <div className="flex items-center gap-1">
                      Status
                      {getSortIcon('status')}
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs text-neutral-400 uppercase tracking-wider">Documents</th>
                  <th 
                    className="px-6 py-3 text-left text-xs text-neutral-400 uppercase tracking-wider cursor-pointer hover:text-neutral-300 select-none"
                    onClick={() => handleSort('expiry')}
                  >
                    <div className="flex items-center gap-1">
                      Expiry
                      {getSortIcon('expiry')}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs text-neutral-400 uppercase tracking-wider cursor-pointer hover:text-neutral-300 select-none"
                    onClick={() => handleSort('lastActivity')}
                  >
                    <div className="flex items-center gap-1">
                      Last Activity
                      {getSortIcon('lastActivity')}
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs text-neutral-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#243F4D]">
                {paginatedExchanges.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center">
                      <div className="text-neutral-500">
                        {hasActiveFilters ? 'No exchanges match your filters.' : 'No exchanges found.'}
                      </div>
                    </td>
                  </tr>
                ) : (
                  paginatedExchanges.map((exchange) => (
                    <tr key={exchange.id} className="hover:bg-[#0B2530] transition-colors">
                      <td className="px-6 py-4">
                        <div 
                          onClick={() => handleViewExchange(exchange)}
                          className="cursor-pointer group"
                        >
                          <div className="text-sm text-[#ffffff] group-hover:text-emerald-400 group-hover:underline transition-colors">{exchange.name}</div>
                          <div className="text-sm text-neutral-500">{exchange.id}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-neutral-300">{exchange.workspace}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs ${getStatusBadge(exchange.status)}`}>
                          {exchange.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="text-sm text-neutral-300">
                            {exchange.documentsSigned} / {exchange.documentsSent}
                          </div>
                          {exchange.status === 'In Progress' && (
                            <div className="flex-1 max-w-[80px] h-1.5 bg-[#0B2530] rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-emerald-500 rounded-full transition-all"
                                style={{ width: `${(exchange.documentsSigned / exchange.documentsSent) * 100}%` }}
                              />
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-neutral-300">{exchange.expiry}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-neutral-400">{exchange.lastActivity}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-end">
                          <button
                            onClick={() => handleViewExchange(exchange)}
                            className="inline-flex items-center gap-2 px-3 py-1.5 text-sm text-emerald-500 hover:text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition-colors cursor-pointer"
                          >
                            <Eye className="w-4 h-4" />
                            View
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        {filteredExchanges.length > 0 && (
          <div className="flex items-center justify-between">
            <div className="text-sm text-neutral-400">
              Showing {filteredExchanges.length === 0 ? 0 : startIndex + 1}-{Math.min(endIndex, filteredExchanges.length)} of {filteredExchanges.length} exchanges
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-3 py-1.5 border border-[#243F4D] rounded-lg text-sm transition-colors ${
                  currentPage === 1 
                    ? 'text-neutral-600 cursor-not-allowed' 
                    : 'text-neutral-300 hover:bg-[#132E3B] cursor-pointer'
                }`}
              >
                Previous
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-3 py-1.5 rounded-lg text-sm transition-colors cursor-pointer ${
                    currentPage === page 
                      ? 'bg-emerald-500 text-[#0B2530]' 
                      : 'border border-[#243F4D] text-neutral-300 hover:bg-[#132E3B]'
                  }`}
                >
                  {page}
                </button>
              ))}
              <button 
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages || totalPages === 0}
                className={`px-3 py-1.5 border border-[#243F4D] rounded-lg text-sm transition-colors ${
                  currentPage === totalPages || totalPages === 0
                    ? 'text-neutral-600 cursor-not-allowed' 
                    : 'text-neutral-300 hover:bg-[#132E3B] cursor-pointer'
                }`}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Section 3: E-Sign In Progress - Two Columns */}
      <div className="bg-[#132E3B] border border-[#243F4D] rounded-lg p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[#ffffff]">E-Sign In Progress</h3>
          <span className="text-xs text-neutral-500">{inProgressSignings} active</span>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {MOCK_EXCHANGES.filter(e => e.status === 'In Progress').slice(0, 6).map((exchange) => (
            <div key={exchange.id} className="bg-[#0B2530] border border-[#243F4D] rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="text-sm text-[#ffffff] mb-1">{exchange.name}</div>
                  <div className="text-xs text-neutral-500">{exchange.id}</div>
                </div>
                <span className="text-xs text-amber-500">{exchange.pendingParticipants?.length || 0} pending</span>
              </div>
              {exchange.pendingParticipants && exchange.pendingParticipants.length > 0 && (
                <div className="text-xs text-neutral-400 mb-3">
                  Waiting for: {exchange.pendingParticipants.join(', ')}
                </div>
              )}
              <div className="mb-3">
                <div className="flex items-center justify-between text-xs text-neutral-400 mb-1">
                  <span>Progress</span>
                  <span>{exchange.documentsSigned} / {exchange.documentsSent} signed</span>
                </div>
                <div className="h-2 bg-[#132E3B] rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-emerald-500 rounded-full transition-all"
                    style={{ width: `${(exchange.documentsSigned / exchange.documentsSent) * 100}%` }}
                  />
                </div>
              </div>
              <button className="w-full px-3 py-2 bg-emerald-500 hover:bg-emerald-600 text-[#0B2530] text-sm rounded-lg transition-colors cursor-pointer" onClick={() => handleViewSigning(exchange)}>
                View Signing
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Section 4 & 5: Today's Tasks + Recent Activity - Side by Side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Tasks */}
        <div className="bg-[#132E3B] border border-[#243F4D] rounded-lg p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[#ffffff]">Today's Tasks</h3>
            <span className="text-xs text-neutral-500">{MOCK_TASKS.length} tasks</span>
          </div>
          <div className="space-y-3">
            {MOCK_TASKS.map((task) => (
              <div 
                key={task.id} 
                className="bg-[#0B2530] border border-[#243F4D] rounded-lg p-4 hover:border-emerald-500 transition-colors cursor-pointer"
                onClick={() => handleTaskClick(task)}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    task.type === 'prepare' ? 'bg-blue-500/10' :
                    task.type === 'upload' ? 'bg-teal-500/10' :
                    task.type === 'followup' ? 'bg-amber-500/10' :
                    'bg-green-500/10'
                  }`}>
                    {task.type === 'prepare' && <Edit3 className="w-4 h-4 text-blue-500" />}
                    {task.type === 'upload' && <Upload className="w-4 h-4 text-teal-500" />}
                    {task.type === 'followup' && <AlertCircle className="w-4 h-4 text-amber-500" />}
                    {task.type === 'review' && <CheckCircle2 className="w-4 h-4 text-green-500" />}
                  </div>
                  <div className="flex-1">
                    <div className="text-sm text-[#ffffff] mb-1">{task.title}</div>
                    <div className="text-xs text-neutral-500">{task.exchangeName}</div>
                  </div>
                  <svg className="w-4 h-4 text-neutral-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-[#132E3B] border border-[#243F4D] rounded-lg p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[#ffffff]">Recent Activity</h3>
            <span className="text-xs text-neutral-500">Last 24 hours</span>
          </div>
          <div className="space-y-3">
            {MOCK_ACTIVITIES.map((activity) => (
              <div 
                key={activity.id} 
                className="flex items-start gap-3 py-2 border-b border-[#243F4D] last:border-0"
              >
                <div className="mt-0.5">
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1">
                  <div className="text-sm text-neutral-300">
                    {activity.description} <span className="text-[#ffffff]">{activity.exchangeName}</span>
                  </div>
                  <div className="text-xs text-neutral-500 mt-0.5">{activity.timestamp}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}