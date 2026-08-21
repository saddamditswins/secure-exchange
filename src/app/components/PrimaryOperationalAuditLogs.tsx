import { useState, useMemo, useEffect } from 'react';
import { toast } from 'sonner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { MultiSelectFilter } from "./ui/multi-select-filter";

interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  userEmail: string;
  role: string;
  workspace: string;
  action: string;
  resource: string;
  details: string;
  ipAddress: string;
  status: 'Success' | 'Failed';
  userAgent?: string;
  deviceType?: string;
  eventId?: string;
}

// Mock data - audit logs for Primary Operations User
const MOCK_AUDIT_LOGS: AuditLog[] = [
  { id: 'AL-5001', timestamp: '01/07/2026 10:45 AM', user: 'John Mitchell', userEmail: 'john.mitchell@acmefinancial.com', role: 'Primary Operations User', workspace: 'Acme Financial', action: 'Document Uploaded', resource: 'DOC-4025', details: 'Uploaded Q4 Financial Statement.pdf', ipAddress: '192.168.1.100', status: 'Success', userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', deviceType: 'Desktop', eventId: 'EVT-2001' },
  { id: 'AL-5002', timestamp: '01/07/2026 10:30 AM', user: 'John Mitchell', userEmail: 'john.mitchell@acmefinancial.com', role: 'Primary Operations User', workspace: 'Acme Financial', action: 'Exchange Sent', resource: 'EX-2027', details: 'Sent exchange to 3 participants', ipAddress: '192.168.1.100', status: 'Success', userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', deviceType: 'Desktop', eventId: 'EVT-2002' },
  { id: 'AL-5003', timestamp: '01/07/2026 09:15 AM', user: 'John Mitchell', userEmail: 'john.mitchell@acmefinancial.com', role: 'Primary Operations User', workspace: 'Sterling Investments', action: 'E-Sign Created', resource: 'EX-2028', details: 'Created new E-Sign packet with 5 fields', ipAddress: '192.168.1.100', status: 'Success', userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', deviceType: 'Desktop', eventId: 'EVT-2003' },
  { id: 'AL-5004', timestamp: '01/07/2026 08:30 AM', user: 'John Mitchell', userEmail: 'john.mitchell@acmefinancial.com', role: 'Primary Operations User', workspace: 'Meridian Capital', action: 'Document Viewed', resource: 'DOC-4020', details: 'Viewed Contract Amendment.pdf', ipAddress: '192.168.1.100', status: 'Success', userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', deviceType: 'Desktop', eventId: 'EVT-2004' },
  { id: 'AL-5005', timestamp: '01/07/2026 07:00 AM', user: 'John Mitchell', userEmail: 'john.mitchell@acmefinancial.com', role: 'Primary Operations User', workspace: 'Apex Financial Group', action: 'Login Success', resource: 'Authentication', details: 'Successfully logged in', ipAddress: '192.168.1.100', status: 'Success', userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', deviceType: 'Desktop', eventId: 'EVT-2005' },
  { id: 'AL-5006', timestamp: '01/06/2026 05:45 PM', user: 'John Mitchell', userEmail: 'john.mitchell@acmefinancial.com', role: 'Primary Operations User', workspace: 'Acme Financial', action: 'Exchange Updated', resource: 'EX-2029', details: 'Updated exchange expiration date', ipAddress: '192.168.1.100', status: 'Success', userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', deviceType: 'Desktop', eventId: 'EVT-2006' },
  { id: 'AL-5007', timestamp: '01/06/2026 04:30 PM', user: 'John Mitchell', userEmail: 'john.mitchell@acmefinancial.com', role: 'Primary Operations User', workspace: 'Nova Holdings', action: 'Document Downloaded', resource: 'DOC-4018', details: 'Downloaded signed Partnership Agreement.pdf', ipAddress: '192.168.1.100', status: 'Success', userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', deviceType: 'Desktop', eventId: 'EVT-2007' },
  { id: 'AL-5008', timestamp: '01/06/2026 03:15 PM', user: 'John Mitchell', userEmail: 'john.mitchell@acmefinancial.com', role: 'Primary Operations User', workspace: 'Sterling Investments', action: 'Document Upload Failed', resource: 'DOC-4026', details: 'File size exceeds limit (25MB)', ipAddress: '192.168.1.100', status: 'Failed', userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', deviceType: 'Desktop', eventId: 'EVT-2008' },
  { id: 'AL-5009', timestamp: '01/06/2026 02:00 PM', user: 'John Mitchell', userEmail: 'john.mitchell@acmefinancial.com', role: 'Primary Operations User', workspace: 'Meridian Capital', action: 'Participant Added', resource: 'EX-2032', details: 'Added jennifer.lee@partner.com to exchange', ipAddress: '192.168.1.100', status: 'Success', userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', deviceType: 'Desktop', eventId: 'EVT-2009' },
  { id: 'AL-5010', timestamp: '01/06/2026 01:30 PM', user: 'John Mitchell', userEmail: 'john.mitchell@acmefinancial.com', role: 'Primary Operations User', workspace: 'Apex Financial Group', action: 'E-Sign Sent', resource: 'EX-2030', details: 'Sent E-Sign packet to 2 signers', ipAddress: '192.168.1.100', status: 'Success', userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', deviceType: 'Desktop', eventId: 'EVT-2010' },
  { id: 'AL-5011', timestamp: '01/06/2026 12:45 PM', user: 'John Mitchell', userEmail: 'john.mitchell@acmefinancial.com', role: 'Primary Operations User', workspace: 'Acme Financial', action: 'Document Uploaded', resource: 'DOC-4027', details: 'Uploaded Tax Document.pdf', ipAddress: '192.168.1.100', status: 'Success', userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', deviceType: 'Desktop', eventId: 'EVT-2011' },
  { id: 'AL-5012', timestamp: '01/06/2026 11:30 AM', user: 'John Mitchell', userEmail: 'john.mitchell@acmefinancial.com', role: 'Primary Operations User', workspace: 'Nova Holdings', action: 'Exchange Created', resource: 'EX-2037', details: 'Created new exchange "Employee Benefits Enrollment"', ipAddress: '192.168.1.100', status: 'Success', userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', deviceType: 'Desktop', eventId: 'EVT-2012' },
  { id: 'AL-5013', timestamp: '01/06/2026 10:15 AM', user: 'John Mitchell', userEmail: 'john.mitchell@acmefinancial.com', role: 'Primary Operations User', workspace: 'Sterling Investments', action: 'Document Viewed', resource: 'DOC-4015', details: 'Viewed Client Onboarding.pdf', ipAddress: '192.168.1.100', status: 'Success', userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', deviceType: 'Desktop', eventId: 'EVT-2013' },
  { id: 'AL-5014', timestamp: '01/06/2026 09:00 AM', user: 'John Mitchell', userEmail: 'john.mitchell@acmefinancial.com', role: 'Primary Operations User', workspace: 'Meridian Capital', action: 'E-Sign Field Added', resource: 'EX-2029', details: 'Added signature field to document', ipAddress: '192.168.1.100', status: 'Success', userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', deviceType: 'Desktop', eventId: 'EVT-2014' },
  { id: 'AL-5015', timestamp: '01/06/2026 08:00 AM', user: 'John Mitchell', userEmail: 'john.mitchell@acmefinancial.com', role: 'Primary Operations User', workspace: 'Acme Financial', action: 'Login Success', resource: 'Authentication', details: 'Successfully logged in', ipAddress: '192.168.1.100', status: 'Success', userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', deviceType: 'Desktop', eventId: 'EVT-2015' },
  { id: 'AL-5016', timestamp: '01/05/2026 05:30 PM', user: 'John Mitchell', userEmail: 'john.mitchell@acmefinancial.com', role: 'Primary Operations User', workspace: 'Apex Financial Group', action: 'Exchange Sent', resource: 'EX-2035', details: 'Sent exchange to 4 participants', ipAddress: '192.168.1.100', status: 'Success', userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', deviceType: 'Desktop', eventId: 'EVT-2016' },
  { id: 'AL-5017', timestamp: '01/05/2026 04:15 PM', user: 'John Mitchell', userEmail: 'john.mitchell@acmefinancial.com', role: 'Primary Operations User', workspace: 'Nova Holdings', action: 'Document Uploaded', resource: 'DOC-4028', details: 'Uploaded Policy Update.pdf', ipAddress: '192.168.1.100', status: 'Success', userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', deviceType: 'Desktop', eventId: 'EVT-2017' },
  { id: 'AL-5018', timestamp: '01/05/2026 03:00 PM', user: 'John Mitchell', userEmail: 'john.mitchell@acmefinancial.com', role: 'Primary Operations User', workspace: 'Sterling Investments', action: 'Participant Removed', resource: 'EX-2033', details: 'Removed alex.turner@partner.com from exchange', ipAddress: '192.168.1.100', status: 'Success', userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', deviceType: 'Desktop', eventId: 'EVT-2018' },
  { id: 'AL-5019', timestamp: '01/05/2026 02:30 PM', user: 'John Mitchell', userEmail: 'john.mitchell@acmefinancial.com', role: 'Primary Operations User', workspace: 'Meridian Capital', action: 'E-Sign Completed', resource: 'EX-2034', details: 'All signatures collected', ipAddress: '192.168.1.100', status: 'Success', userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', deviceType: 'Desktop', eventId: 'EVT-2019' },
  { id: 'AL-5020', timestamp: '01/05/2026 01:15 PM', user: 'John Mitchell', userEmail: 'john.mitchell@acmefinancial.com', role: 'Primary Operations User', workspace: 'Acme Financial', action: 'Document Downloaded', resource: 'DOC-4029', details: 'Downloaded Compliance Report.pdf', ipAddress: '192.168.1.100', status: 'Success', userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', deviceType: 'Desktop', eventId: 'EVT-2020' },
  { id: 'AL-5021', timestamp: '01/05/2026 12:00 PM', user: 'John Mitchell', userEmail: 'john.mitchell@acmefinancial.com', role: 'Primary Operations User', workspace: 'Apex Financial Group', action: 'Login Failed', resource: 'Authentication', details: 'Invalid MFA code', ipAddress: '192.168.1.100', status: 'Failed', userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', deviceType: 'Desktop', eventId: 'EVT-2021' },
  { id: 'AL-5022', timestamp: '01/05/2026 11:00 AM', user: 'John Mitchell', userEmail: 'john.mitchell@acmefinancial.com', role: 'Primary Operations User', workspace: 'Nova Holdings', action: 'Exchange Updated', resource: 'EX-2036', details: 'Updated exchange description', ipAddress: '192.168.1.100', status: 'Success', userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', deviceType: 'Desktop', eventId: 'EVT-2022' },
  { id: 'AL-5023', timestamp: '01/05/2026 10:30 AM', user: 'John Mitchell', userEmail: 'john.mitchell@acmefinancial.com', role: 'Primary Operations User', workspace: 'Sterling Investments', action: 'E-Sign Created', resource: 'EX-2038', details: 'Created new E-Sign packet with 3 fields', ipAddress: '192.168.1.100', status: 'Success', userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', deviceType: 'Desktop', eventId: 'EVT-2023' },
  { id: 'AL-5024', timestamp: '01/05/2026 09:15 AM', user: 'John Mitchell', userEmail: 'john.mitchell@acmefinancial.com', role: 'Primary Operations User', workspace: 'Meridian Capital', action: 'Document Viewed', resource: 'DOC-4030', details: 'Viewed Lease Agreement.pdf', ipAddress: '192.168.1.100', status: 'Success', userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', deviceType: 'Desktop', eventId: 'EVT-2024' },
  { id: 'AL-5025', timestamp: '01/05/2026 08:00 AM', user: 'John Mitchell', userEmail: 'john.mitchell@acmefinancial.com', role: 'Primary Operations User', workspace: 'Acme Financial', action: 'Login Success', resource: 'Authentication', details: 'Successfully logged in', ipAddress: '192.168.1.100', status: 'Success', userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', deviceType: 'Desktop', eventId: 'EVT-2025' },
];

const WORKSPACES = Array.from(new Set(MOCK_AUDIT_LOGS.map(log => log.workspace))).sort();
const ACTIONS = Array.from(new Set(MOCK_AUDIT_LOGS.map(log => log.action))).sort();

// Security-related actions
const SECURITY_ACTIONS = ['Login Failed', 'Document Upload Failed', 'Login Success'];

export function PrimaryOperationalAuditLogs() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedWorkspaces, setSelectedWorkspaces] = useState<string[]>([]);
  const [selectedActions, setSelectedActions] = useState<string[]>([]);
  const [timeRange, setTimeRange] = useState('Last 24 Hours');
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [showActionFilter, setShowActionFilter] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [activeKPI, setActiveKPI] = useState<string | null>(null);
  
  const pageSize = 10;

  // Debounced search
  const [debouncedSearch, setDebouncedSearch] = useState('');
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setCurrentPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Filtered and searched logs
  const filteredLogs = useMemo(() => {
    let logs = [...MOCK_AUDIT_LOGS];

    // Apply search
    if (debouncedSearch.trim()) {
      const query = debouncedSearch.toLowerCase();
      logs = logs.filter(log => 
        log.user.toLowerCase().includes(query) ||
        log.userEmail.toLowerCase().includes(query) ||
        log.action.toLowerCase().includes(query) ||
        log.resource.toLowerCase().includes(query) ||
        log.ipAddress.toLowerCase().includes(query) ||
        log.details.toLowerCase().includes(query)
      );
    }

    // Apply workspace filter
    if (selectedWorkspaces.length > 0) {
      logs = logs.filter(log => selectedWorkspaces.includes(log.workspace));
    }

    // Apply action filter
    if (selectedActions.length > 0) {
      logs = logs.filter(log => selectedActions.includes(log.action));
    }

    return logs;
  }, [debouncedSearch, selectedWorkspaces, selectedActions]);

  // Paginated logs
  const paginatedLogs = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return filteredLogs.slice(startIndex, endIndex);
  }, [filteredLogs, currentPage]);

  const totalPages = Math.ceil(filteredLogs.length / pageSize);

  // Calculate KPIs
  const totalEventsToday = MOCK_AUDIT_LOGS.filter(log => log.timestamp.startsWith('01/07/2026')).length;
  const failedActions = MOCK_AUDIT_LOGS.filter(log => log.status === 'Failed').length;
  const documentsUploaded = MOCK_AUDIT_LOGS.filter(log => log.action === 'Document Uploaded').length;
  const exchangesSent = MOCK_AUDIT_LOGS.filter(log => log.action === 'Exchange Sent' || log.action === 'E-Sign Sent').length;

  // Export functionality
  const handleExport = () => {
    setIsExporting(true);
    
    // Prepare CSV data
    const headers = ['Timestamp', 'User', 'Email', 'Workspace', 'Action', 'Resource', 'IP Address', 'Status'];
    const csvRows = [headers.join(',')];
    
    filteredLogs.forEach(log => {
      const row = [
        log.timestamp,
        log.user,
        log.userEmail,
        log.workspace,
        log.action,
        log.resource,
        log.ipAddress,
        log.status
      ];
      csvRows.push(row.map(field => `"${field}"`).join(','));
    });
    
    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `my-audit-logs-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    setTimeout(() => {
      setIsExporting(false);
      toast.success('Audit logs exported successfully');
    }, 500);
  };

  const toggleRow = (logId: string) => {
    if (expandedRows.has(logId)) {
      setExpandedRows(new Set());
    } else {
      setExpandedRows(new Set([logId]));
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setDebouncedSearch('');
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setDebouncedSearch('');
    setSelectedWorkspaces([]);
    setSelectedActions([]);
    setTimeRange('Last 24 Hours');
    setCurrentPage(1);
    setActiveKPI(null);
  };

  // KPI Click Handlers
  const handleKPIClick = (kpiType: string) => {
    if (activeKPI === kpiType) {
      clearFilters();
      return;
    }

    // Clear existing filters first
    setSearchQuery('');
    setDebouncedSearch('');
    setSelectedWorkspaces([]);
    setSelectedActions([]);
    setCurrentPage(1);

    // Apply KPI-specific filter
    switch (kpiType) {
      case 'total-events':
        setTimeRange('Last 24 Hours');
        setActiveKPI('total-events');
        break;
      case 'failed-actions':
        setSelectedActions(['Login Failed', 'Document Upload Failed']);
        setActiveKPI('failed-actions');
        break;
      case 'documents-uploaded':
        setSelectedActions(['Document Uploaded']);
        setActiveKPI('documents-uploaded');
        break;
      case 'exchanges-sent':
        setSelectedActions(['Exchange Sent', 'E-Sign Sent']);
        setActiveKPI('exchanges-sent');
        break;
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const hasActiveFilters = debouncedSearch || selectedWorkspaces.length > 0 || selectedActions.length > 0;

  return (
    <div className="mx-auto w-full max-w-[1600px] p-4 sm:p-6 space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[#ffffff] mb-1">Audit Logs</h1>
          <p className="text-sm text-neutral-400">Your activity history and security events</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowActionFilter(!showActionFilter)}
            className="px-4 py-2 border border-[#243F4D] text-neutral-300 rounded-lg hover:bg-[#132E3B] transition-colors flex items-center gap-2 cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            Action Filters
            {selectedActions.length > 0 && (
              <span className="inline-flex items-center justify-center w-5 h-5 bg-emerald-500 text-[#0B2530] text-xs rounded-full">
                {selectedActions.length}
              </span>
            )}
          </button>
          <button
            onClick={handleExport}
            disabled={isExporting || filteredLogs.length === 0}
            className="px-4 py-2 border border-[#243F4D] text-neutral-300 rounded-lg hover:bg-[#132E3B] transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            {isExporting ? 'Exporting...' : 'Export Logs'}
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <button
          onClick={() => handleKPIClick('total-events')}
          className={`bg-[#132E3B] border-2 rounded-lg p-4 text-left transition-all cursor-pointer hover:border-emerald-400 hover:shadow-lg ${
            activeKPI === 'total-events' ? 'border-emerald-500 ring-2 ring-emerald-500 ring-opacity-20' : 'border-[#243F4D]'
          }`}
        >
          <div className="text-sm text-neutral-400 mb-1">Events Today</div>
          <div className="text-2xl text-emerald-500 mb-2">{totalEventsToday}</div>
          <div className="text-xs text-neutral-500">Actions performed today</div>
        </button>
        <button
          onClick={() => handleKPIClick('failed-actions')}
          className={`bg-[#132E3B] border-2 rounded-lg p-4 text-left transition-all cursor-pointer hover:border-red-400 hover:shadow-lg ${
            activeKPI === 'failed-actions' ? 'border-red-600 ring-2 ring-red-600 ring-opacity-20' : 'border-[#243F4D]'
          }`}
        >
          <div className="text-sm text-neutral-400 mb-1">Failed Actions</div>
          <div className="text-2xl text-red-500 mb-2">{failedActions}</div>
          <div className="text-xs text-neutral-500">Review failed attempts</div>
        </button>
        <button
          onClick={() => handleKPIClick('documents-uploaded')}
          className={`bg-[#132E3B] border-2 rounded-lg p-4 text-left transition-all cursor-pointer hover:border-blue-400 hover:shadow-lg ${
            activeKPI === 'documents-uploaded' ? 'border-blue-600 ring-2 ring-blue-600 ring-opacity-20' : 'border-[#243F4D]'
          }`}
        >
          <div className="text-sm text-neutral-400 mb-1">Documents Uploaded</div>
          <div className="text-2xl text-blue-500 mb-2">{documentsUploaded}</div>
          <div className="text-xs text-neutral-500">Total uploads</div>
        </button>
        <button
          onClick={() => handleKPIClick('exchanges-sent')}
          className={`bg-[#132E3B] border-2 rounded-lg p-4 text-left transition-all cursor-pointer hover:border-amber-400 hover:shadow-lg ${
            activeKPI === 'exchanges-sent' ? 'border-amber-600 ring-2 ring-amber-600 ring-opacity-20' : 'border-[#243F4D]'
          }`}
        >
          <div className="text-sm text-neutral-400 mb-1">Exchanges Sent</div>
          <div className="text-2xl text-amber-500 mb-2">{exchangesSent}</div>
          <div className="text-xs text-neutral-500">Sent to participants</div>
        </button>
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
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search logs by action, resource, or IP address..."
              className="w-full pl-10 pr-10 py-2 bg-[#0B2530] border border-[#243F4D] text-[#ffffff] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            {searchQuery && (
              <button
                onClick={clearSearch}
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
            <Select value={timeRange} onValueChange={(value) => { setTimeRange(value); setCurrentPage(1); }}>
              <SelectTrigger className="bg-[#0B2530] border-[#243F4D] text-[#ffffff]">
                <SelectValue placeholder="Last 24 Hours" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Last 24 Hours">Last 24 Hours</SelectItem>
                <SelectItem value="Last 7 Days">Last 7 Days</SelectItem>
                <SelectItem value="Last 30 Days">Last 30 Days</SelectItem>
                <SelectItem value="Custom Range">Custom Range</SelectItem>
              </SelectContent>
            </Select>
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

        {/* Action Filter Dropdown */}
        {showActionFilter && (
          <div className="mt-4 pt-4 border-t border-[#243F4D]">
            <div className="text-sm font-medium text-neutral-300 mb-3">Filter by Action Type</div>
            <MultiSelectFilter
              label="Actions"
              options={ACTIONS}
              selectedValues={selectedActions}
              onChange={(values) => {
                setSelectedActions(values);
                setCurrentPage(1);
              }}
              placeholder="Select actions..."
            />
          </div>
        )}
      </div>

      {/* Trust Signal */}
      <div className="flex items-center justify-between">
        <div className="text-xs text-neutral-500 italic">
          Audit logs are append-only and immutable.
        </div>
        {filteredLogs.length > 0 && (
          <div className="text-sm text-neutral-400">
            Showing {((currentPage - 1) * pageSize) + 1}-{Math.min(currentPage * pageSize, filteredLogs.length)} of {filteredLogs.length} log entries
          </div>
        )}
      </div>

      {/* Audit Logs Table */}
      <div className="bg-[#132E3B] border border-[#243F4D] rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full whitespace-nowrap">
            <thead className="bg-[#0B2530] border-b border-[#243F4D]">
              <tr>
                <th className="px-6 py-3 text-left text-xs text-neutral-400 uppercase tracking-wider w-10"></th>
                <th className="px-6 py-3 text-left text-xs text-neutral-400 uppercase tracking-wider">Timestamp</th>
                <th className="px-6 py-3 text-left text-xs text-neutral-400 uppercase tracking-wider">Workspace</th>
                <th className="px-6 py-3 text-left text-xs text-neutral-400 uppercase tracking-wider">Action</th>
                <th className="px-6 py-3 text-left text-xs text-neutral-400 uppercase tracking-wider">Resource</th>
                <th className="px-6 py-3 text-left text-xs text-neutral-400 uppercase tracking-wider">IP Address</th>
                <th className="px-6 py-3 text-left text-xs text-neutral-400 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#243F4D]">
              {paginatedLogs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <div className="text-neutral-500">
                      {hasActiveFilters ? 'No audit events match your filters.' : 'No audit events found.'}
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedLogs.flatMap((log) => {
                  const isExpanded = expandedRows.has(log.id);
                  const shouldHighlight = debouncedSearch.trim().length > 0;
                  
                  const rows = [
                    <tr key={log.id} className="hover:bg-[#0B2530] transition-colors">
                      <td className="px-6 py-4">
                        <button
                          onClick={() => toggleRow(log.id)}
                          className="text-neutral-400 hover:text-neutral-300 cursor-pointer"
                        >
                          <svg 
                            className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-neutral-300">{log.timestamp}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-neutral-300">{log.workspace}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <div className={`text-sm ${shouldHighlight && (log.action.toLowerCase().includes(debouncedSearch.toLowerCase())) ? 'bg-amber-500/20 text-amber-400' : 'text-neutral-300'}`}>{log.action}</div>
                          <div className="text-sm text-neutral-500">{log.details}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className={`text-sm font-mono ${shouldHighlight && (log.resource.toLowerCase().includes(debouncedSearch.toLowerCase())) ? 'bg-amber-500/20 text-amber-400' : 'text-neutral-300'}`}>{log.resource}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className={`text-sm font-mono ${shouldHighlight && (log.ipAddress.toLowerCase().includes(debouncedSearch.toLowerCase())) ? 'bg-amber-500/20 text-amber-400' : 'text-neutral-300'}`}>{log.ipAddress}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-full ${
                          log.status === 'Success' ? 'bg-emerald-500/10' : 'bg-red-500/10'
                        }`}>
                          <div className={`w-1.5 h-1.5 rounded-full ${
                            log.status === 'Success' ? 'bg-emerald-500' : 'bg-red-500'
                          }`}></div>
                          <span className={`text-xs ${
                            log.status === 'Success' ? 'text-emerald-400' : 'text-red-400'
                          }`}>{log.status}</span>
                        </div>
                      </td>
                    </tr>
                  ];
                  
                  // Add expanded row if needed
                  if (isExpanded) {
                    rows.push(
                      <tr key={`${log.id}-expanded`}>
                        <td colSpan={7} className="px-6 py-4 bg-[#0B2530] border-t border-[#243F4D]">
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                            <div>
                              <div className="text-xs text-neutral-500 uppercase tracking-wider mb-1">Event ID</div>
                              <div className="text-neutral-300 font-mono">{log.eventId}</div>
                            </div>
                            <div>
                              <div className="text-xs text-neutral-500 uppercase tracking-wider mb-1">Role</div>
                              <div className="text-neutral-300">{log.role}</div>
                            </div>
                            <div>
                              <div className="text-xs text-neutral-500 uppercase tracking-wider mb-1">Device Type</div>
                              <div className="text-neutral-300">{log.deviceType}</div>
                            </div>
                            <div className="col-span-2">
                              <div className="text-xs text-neutral-500 uppercase tracking-wider mb-1">User Agent</div>
                              <div className="text-neutral-300 break-words">{log.userAgent}</div>
                            </div>
                            <div>
                              <div className="text-xs text-neutral-500 uppercase tracking-wider mb-1">Result</div>
                              <div className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-full ${
                                log.status === 'Success' ? 'bg-emerald-500/10' : 'bg-red-500/10'
                              }`}>
                                <div className={`w-1.5 h-1.5 rounded-full ${
                                  log.status === 'Success' ? 'bg-emerald-500' : 'bg-red-500'
                                }`}></div>
                                <span className={`text-xs ${
                                  log.status === 'Success' ? 'text-emerald-400' : 'text-red-400'
                                }`}>{log.status}</span>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    );
                  }
                  
                  return rows;
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {filteredLogs.length > 0 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-neutral-400">
            Showing {filteredLogs.length === 0 ? 0 : ((currentPage - 1) * pageSize) + 1}-{Math.min(currentPage * pageSize, filteredLogs.length)} of {filteredLogs.length} logs
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
  );
}
