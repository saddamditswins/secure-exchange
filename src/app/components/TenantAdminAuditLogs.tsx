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

// Mock data - audit logs for Tenant Admin (Organization-level)
const MOCK_AUDIT_LOGS: AuditLog[] = [
  { id: 'AL-8001', timestamp: '01/07/2026 10:45 AM', user: 'Sarah Mitchell', userEmail: 'sarah.mitchell@acmefinancial.com', role: 'Tenant Admin', workspace: 'Corporate Governance', action: 'User Created', resource: 'james.rodriguez@acmefinancial.com', details: 'Created new operational user', ipAddress: '192.168.1.100', status: 'Success', userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', deviceType: 'Desktop', eventId: 'EVT-3001' },
  { id: 'AL-8002', timestamp: '01/07/2026 10:30 AM', user: 'Sarah Mitchell', userEmail: 'sarah.mitchell@acmefinancial.com', role: 'Tenant Admin', workspace: 'Corporate Governance', action: 'Workspace Created', resource: 'WS-2045', details: 'Created workspace "Q1 2026 Board Review"', ipAddress: '192.168.1.100', status: 'Success', userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', deviceType: 'Desktop', eventId: 'EVT-3002' },
  { id: 'AL-8003', timestamp: '01/07/2026 09:15 AM', user: 'James Rodriguez', userEmail: 'james.rodriguez@acmefinancial.com', role: 'Primary Operations User', workspace: 'M&A Due Diligence', action: 'Exchange Sent', resource: 'EX-2050', details: 'Sent exchange to 5 external participants', ipAddress: '192.168.1.105', status: 'Success', userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', deviceType: 'Desktop', eventId: 'EVT-3003' },
  { id: 'AL-8004', timestamp: '01/07/2026 08:30 AM', user: 'Michael Torres', userEmail: 'michael.torres@acmefinancial.com', role: 'Workspace Admin', workspace: 'Client Onboarding', action: 'Access Revoked', resource: 'EX-2048', details: 'Revoked access for expired external participant', ipAddress: '192.168.1.110', status: 'Success', userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X)', deviceType: 'Desktop', eventId: 'EVT-3004' },
  { id: 'AL-8005', timestamp: '01/07/2026 07:00 AM', user: 'Lisa Anderson', userEmail: 'lisa.anderson@acmefinancial.com', role: 'Workspace Admin', workspace: 'Legal & Compliance', action: 'Settings Updated', resource: 'Organization Settings', details: 'Updated security policy configuration', ipAddress: '192.168.1.115', status: 'Success', userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', deviceType: 'Desktop', eventId: 'EVT-3005' },
  { id: 'AL-8006', timestamp: '01/06/2026 05:45 PM', user: 'Sarah Mitchell', userEmail: 'sarah.mitchell@acmefinancial.com', role: 'Tenant Admin', workspace: 'Corporate Governance', action: 'User Suspended', resource: 'inactive.user@acmefinancial.com', details: 'Suspended user account for policy violation', ipAddress: '192.168.1.100', status: 'Success', userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', deviceType: 'Desktop', eventId: 'EVT-3006' },
  { id: 'AL-8007', timestamp: '01/06/2026 04:30 PM', user: 'James Rodriguez', userEmail: 'james.rodriguez@acmefinancial.com', role: 'Primary Operations User', workspace: 'M&A Due Diligence', action: 'Document Uploaded', resource: 'DOC-5025', details: 'Uploaded Financial_Statements_2025.pdf (8.5MB)', ipAddress: '192.168.1.105', status: 'Success', userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', deviceType: 'Desktop', eventId: 'EVT-3007' },
  { id: 'AL-8008', timestamp: '01/06/2026 03:15 PM', user: 'External User', userEmail: 'partner@external.com', role: 'External Participant', workspace: 'Client Onboarding', action: 'Document Signed', resource: 'DOC-5020', details: 'Signed Client_Agreement.pdf', ipAddress: '203.45.67.89', status: 'Success', userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS)', deviceType: 'Mobile', eventId: 'EVT-3008' },
  { id: 'AL-8009', timestamp: '01/06/2026 02:00 PM', user: 'Michael Torres', userEmail: 'michael.torres@acmefinancial.com', role: 'Workspace Admin', workspace: 'Client Onboarding', action: 'Exchange Approved', resource: 'EX-2049', details: 'Approved exchange for external sharing', ipAddress: '192.168.1.110', status: 'Success', userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X)', deviceType: 'Desktop', eventId: 'EVT-3009' },
  { id: 'AL-8010', timestamp: '01/06/2026 01:30 PM', user: 'Lisa Anderson', userEmail: 'lisa.anderson@acmefinancial.com', role: 'Workspace Admin', workspace: 'Legal & Compliance', action: 'Login Failed', resource: 'Authentication', details: 'Invalid MFA code', ipAddress: '192.168.1.115', status: 'Failed', userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', deviceType: 'Desktop', eventId: 'EVT-3010' },
  { id: 'AL-8011', timestamp: '01/06/2026 12:45 PM', user: 'James Rodriguez', userEmail: 'james.rodriguez@acmefinancial.com', role: 'Primary Operations User', workspace: 'M&A Due Diligence', action: 'E-Sign Created', resource: 'EX-2051', details: 'Created E-Sign packet with 8 signature fields', ipAddress: '192.168.1.105', status: 'Success', userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', deviceType: 'Desktop', eventId: 'EVT-3011' },
  { id: 'AL-8012', timestamp: '01/06/2026 11:30 AM', user: 'Sarah Mitchell', userEmail: 'sarah.mitchell@acmefinancial.com', role: 'Tenant Admin', workspace: 'Corporate Governance', action: 'Role Assigned', resource: 'michael.torres@acmefinancial.com', details: 'Assigned Workspace Admin role', ipAddress: '192.168.1.100', status: 'Success', userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', deviceType: 'Desktop', eventId: 'EVT-3012' },
  { id: 'AL-8013', timestamp: '01/06/2026 10:15 AM', user: 'External User', userEmail: 'client@external.com', role: 'External Participant', workspace: 'Legal & Compliance', action: 'Document Viewed', resource: 'DOC-5018', details: 'Viewed Compliance_Report_2025.pdf', ipAddress: '198.51.100.42', status: 'Success', userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', deviceType: 'Desktop', eventId: 'EVT-3013' },
  { id: 'AL-8014', timestamp: '01/06/2026 09:00 AM', user: 'Michael Torres', userEmail: 'michael.torres@acmefinancial.com', role: 'Workspace Admin', workspace: 'Client Onboarding', action: 'Participant Added', resource: 'EX-2052', details: 'Added external participant: partner@company.com', ipAddress: '192.168.1.110', status: 'Success', userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X)', deviceType: 'Desktop', eventId: 'EVT-3014' },
  { id: 'AL-8015', timestamp: '01/06/2026 08:00 AM', user: 'Sarah Mitchell', userEmail: 'sarah.mitchell@acmefinancial.com', role: 'Tenant Admin', workspace: 'Corporate Governance', action: 'Login Success', resource: 'Authentication', details: 'Successfully logged in', ipAddress: '192.168.1.100', status: 'Success', userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', deviceType: 'Desktop', eventId: 'EVT-3015' },
  { id: 'AL-8016', timestamp: '01/05/2026 05:30 PM', user: 'James Rodriguez', userEmail: 'james.rodriguez@acmefinancial.com', role: 'Primary Operations User', workspace: 'M&A Due Diligence', action: 'Document Downloaded', resource: 'DOC-5015', details: 'Downloaded Due_Diligence_Checklist.pdf', ipAddress: '192.168.1.105', status: 'Success', userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', deviceType: 'Desktop', eventId: 'EVT-3016' },
  { id: 'AL-8017', timestamp: '01/05/2026 04:15 PM', user: 'Lisa Anderson', userEmail: 'lisa.anderson@acmefinancial.com', role: 'Workspace Admin', workspace: 'Legal & Compliance', action: 'Exchange Created', resource: 'EX-2053', details: 'Created new exchange "Contract Review Q1 2026"', ipAddress: '192.168.1.115', status: 'Success', userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', deviceType: 'Desktop', eventId: 'EVT-3017' },
  { id: 'AL-8018', timestamp: '01/05/2026 03:00 PM', user: 'External User', userEmail: 'auditor@external.com', role: 'External Participant', workspace: 'Corporate Governance', action: 'E-Sign Completed', resource: 'EX-2047', details: 'Completed all required signatures', ipAddress: '172.16.0.99', status: 'Success', userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X)', deviceType: 'Desktop', eventId: 'EVT-3018' },
  { id: 'AL-8019', timestamp: '01/05/2026 02:30 PM', user: 'Sarah Mitchell', userEmail: 'sarah.mitchell@acmefinancial.com', role: 'Tenant Admin', workspace: 'Corporate Governance', action: 'Settings Updated', resource: 'Email Templates', details: 'Updated notification email templates', ipAddress: '192.168.1.100', status: 'Success', userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', deviceType: 'Desktop', eventId: 'EVT-3019' },
  { id: 'AL-8020', timestamp: '01/05/2026 01:15 PM', user: 'Michael Torres', userEmail: 'michael.torres@acmefinancial.com', role: 'Workspace Admin', workspace: 'Client Onboarding', action: 'Document Upload Failed', resource: 'DOC-5030', details: 'File format not supported (.exe)', ipAddress: '192.168.1.110', status: 'Failed', userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X)', deviceType: 'Desktop', eventId: 'EVT-3020' },
  { id: 'AL-8021', timestamp: '01/05/2026 12:00 PM', user: 'James Rodriguez', userEmail: 'james.rodriguez@acmefinancial.com', role: 'Primary Operations User', workspace: 'M&A Due Diligence', action: 'Exchange Updated', resource: 'EX-2050', details: 'Updated expiration date to 02/15/2026', ipAddress: '192.168.1.105', status: 'Success', userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', deviceType: 'Desktop', eventId: 'EVT-3021' },
  { id: 'AL-8022', timestamp: '01/05/2026 11:00 AM', user: 'Lisa Anderson', userEmail: 'lisa.anderson@acmefinancial.com', role: 'Workspace Admin', workspace: 'Legal & Compliance', action: 'Participant Removed', resource: 'EX-2053', details: 'Removed external participant: old.partner@company.com', ipAddress: '192.168.1.115', status: 'Success', userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', deviceType: 'Desktop', eventId: 'EVT-3022' },
  { id: 'AL-8023', timestamp: '01/05/2026 10:30 AM', user: 'Sarah Mitchell', userEmail: 'sarah.mitchell@acmefinancial.com', role: 'Tenant Admin', workspace: 'Corporate Governance', action: 'Login Failed', resource: 'Authentication', details: 'Incorrect password', ipAddress: '192.168.1.100', status: 'Failed', userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', deviceType: 'Desktop', eventId: 'EVT-3023' },
  { id: 'AL-8024', timestamp: '01/05/2026 09:15 AM', user: 'External User', userEmail: 'vendor@external.com', role: 'External Participant', workspace: 'Client Onboarding', action: 'Document Signed', resource: 'DOC-5031', details: 'Signed Vendor_Agreement.pdf', ipAddress: '203.45.67.90', status: 'Success', userAgent: 'Mozilla/5.0 (iPad; CPU OS)', deviceType: 'Mobile', eventId: 'EVT-3024' },
  { id: 'AL-8025', timestamp: '01/05/2026 08:00 AM', user: 'Michael Torres', userEmail: 'michael.torres@acmefinancial.com', role: 'Workspace Admin', workspace: 'Client Onboarding', action: 'Login Success', resource: 'Authentication', details: 'Successfully logged in', ipAddress: '192.168.1.110', status: 'Success', userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X)', deviceType: 'Desktop', eventId: 'EVT-3025' },
];

const WORKSPACES = Array.from(new Set(MOCK_AUDIT_LOGS.map(log => log.workspace))).sort();
const ACTIONS = Array.from(new Set(MOCK_AUDIT_LOGS.map(log => log.action))).sort();
const ROLES = Array.from(new Set(MOCK_AUDIT_LOGS.map(log => log.role))).sort();

// Security-related actions
const SECURITY_ACTIONS = ['Login Failed', 'Access Revoked', 'User Suspended', 'Settings Updated'];

export function TenantAdminAuditLogs() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedWorkspaces, setSelectedWorkspaces] = useState<string[]>([]);
  const [selectedActions, setSelectedActions] = useState<string[]>([]);
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
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

    // Apply role filter
    if (selectedRoles.length > 0) {
      logs = logs.filter(log => selectedRoles.includes(log.role));
    }

    return logs;
  }, [debouncedSearch, selectedWorkspaces, selectedActions, selectedRoles]);

  // Paginated logs
  const paginatedLogs = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return filteredLogs.slice(startIndex, endIndex);
  }, [filteredLogs, currentPage]);

  const totalPages = Math.ceil(filteredLogs.length / pageSize);

  // Calculate KPIs
  const totalEventsToday = MOCK_AUDIT_LOGS.filter(log => log.timestamp.startsWith('01/07/2026')).length;
  const failedLogins = MOCK_AUDIT_LOGS.filter(log => log.action === 'Login Failed' || log.status === 'Failed').length;
  const securityEvents = MOCK_AUDIT_LOGS.filter(log => SECURITY_ACTIONS.includes(log.action)).length;
  const externalActivity = MOCK_AUDIT_LOGS.filter(log => log.role === 'External Participant').length;

  // Export functionality
  const handleExport = () => {
    setIsExporting(true);
    
    // Prepare CSV data
    const headers = ['Timestamp', 'User', 'Email', 'Role', 'Workspace', 'Action', 'Resource', 'IP Address', 'Status'];
    const csvRows = [headers.join(',')];
    
    filteredLogs.forEach(log => {
      const row = [
        log.timestamp,
        log.user,
        log.userEmail,
        log.role,
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
    link.setAttribute('download', `organization-audit-logs-${new Date().toISOString().split('T')[0]}.csv`);
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
    setSelectedRoles([]);
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
    setSelectedRoles([]);
    setCurrentPage(1);

    // Apply KPI-specific filter
    switch (kpiType) {
      case 'total-events':
        setTimeRange('Last 24 Hours');
        setActiveKPI('total-events');
        break;
      case 'failed-logins':
        setSelectedActions(['Login Failed', 'Document Upload Failed']);
        setActiveKPI('failed-logins');
        break;
      case 'security-events':
        setSelectedActions(SECURITY_ACTIONS);
        setActiveKPI('security-events');
        break;
      case 'external-activity':
        setSelectedRoles(['External Participant']);
        setActiveKPI('external-activity');
        break;
    }

    // Scroll to table
    setTimeout(() => {
      const table = document.querySelector('[data-table="audit-logs"]');
      if (table) {
        table.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const hasActiveFilters = debouncedSearch || selectedWorkspaces.length > 0 || selectedActions.length > 0 || selectedRoles.length > 0;

  return (
    <div className="p-6 space-y-6 w-full min-w-full">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-neutral-900 mb-1">Audit Logs</h1>
          <p className="text-sm text-neutral-600">Organization-wide activity and security events</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowActionFilter(!showActionFilter)}
            className="px-4 py-2 border border-neutral-200 text-neutral-700 rounded-lg hover:bg-neutral-50 transition-colors flex items-center gap-2 cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            Action Filters
            {selectedActions.length > 0 && (
              <span className="inline-flex items-center justify-center w-5 h-5 bg-neutral-900 text-[#FFFFFF] text-xs rounded-full">
                {selectedActions.length}
              </span>
            )}
          </button>
          <button
            onClick={handleExport}
            disabled={isExporting || filteredLogs.length === 0}
            className="px-4 py-2 border border-neutral-200 text-neutral-700 rounded-lg hover:bg-neutral-50 transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            {isExporting ? 'Exporting...' : 'Export Logs'}
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-4">
        <button
          onClick={() => handleKPIClick('total-events')}
          className={`bg-white border-2 rounded-lg p-4 text-left transition-all cursor-pointer hover:border-neutral-300 hover:shadow-sm ${
            activeKPI === 'total-events' ? 'border-neutral-900 ring-2 ring-neutral-900 ring-opacity-20' : 'border-neutral-200'
          }`}
        >
          <div className="text-sm text-neutral-600 mb-1">Total Events (24h)</div>
          <div className="text-2xl text-neutral-900 mb-2">{totalEventsToday}</div>
          <div className="text-xs text-neutral-500">View events from last 24 hours</div>
        </button>
        <button
          onClick={() => handleKPIClick('failed-logins')}
          className={`bg-white border-2 rounded-lg p-4 text-left transition-all cursor-pointer hover:border-red-200 hover:shadow-sm ${
            activeKPI === 'failed-logins' ? 'border-red-600 ring-2 ring-red-600 ring-opacity-20' : 'border-neutral-200'
          }`}
        >
          <div className="text-sm text-neutral-600 mb-1">Failed Actions</div>
          <div className="text-2xl text-red-600 mb-2">{failedLogins}</div>
          <div className="text-xs text-neutral-500">Review failed attempts</div>
        </button>
        <button
          onClick={() => handleKPIClick('security-events')}
          className={`bg-white border-2 rounded-lg p-4 text-left transition-all cursor-pointer hover:border-amber-200 hover:shadow-sm ${
            activeKPI === 'security-events' ? 'border-amber-600 ring-2 ring-amber-600 ring-opacity-20' : 'border-neutral-200'
          }`}
        >
          <div className="text-sm text-neutral-600 mb-1">Security Events</div>
          <div className="text-2xl text-amber-600 mb-2">{securityEvents}</div>
          <div className="text-xs text-neutral-500">Inspect security-related activity</div>
        </button>
        <button
          onClick={() => handleKPIClick('external-activity')}
          className={`bg-white border-2 rounded-lg p-4 text-left transition-all cursor-pointer hover:border-blue-200 hover:shadow-sm ${
            activeKPI === 'external-activity' ? 'border-blue-600 ring-2 ring-blue-600 ring-opacity-20' : 'border-neutral-200'
          }`}
        >
          <div className="text-sm text-neutral-600 mb-1">External Activity</div>
          <div className="text-2xl text-blue-600 mb-2">{externalActivity}</div>
          <div className="text-xs text-neutral-500">Monitor external participant actions</div>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white border border-neutral-200 rounded-lg p-4">
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <svg className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search logs by user, action, or resource..."
              className="w-full pl-10 pr-10 py-2 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900"
            />
            {searchQuery && (
              <button
                onClick={clearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 cursor-pointer"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
          <div className="w-[200px]">
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
          <div className="w-[200px]">
            <MultiSelectFilter
              label="Roles"
              options={ROLES}
              selectedValues={selectedRoles}
              onChange={(values) => {
                setSelectedRoles(values);
                setCurrentPage(1);
              }}
              placeholder="All Roles"
            />
          </div>
          <div className="w-[200px]">
            <Select value={timeRange} onValueChange={(value) => { setTimeRange(value); setCurrentPage(1); }}>
              <SelectTrigger>
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
              className="px-3 py-2 text-sm text-neutral-600 hover:text-neutral-900 underline cursor-pointer whitespace-nowrap"
            >
              Clear All
            </button>
          )}
        </div>

        {/* Action Filter Dropdown */}
        {showActionFilter && (
          <div className="mt-4 pt-4 border-t border-neutral-200">
            <div className="text-sm font-medium text-neutral-700 mb-3">Filter by Action Type</div>
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
          <div className="text-sm text-neutral-600">
            Showing {((currentPage - 1) * pageSize) + 1}-{Math.min(currentPage * pageSize, filteredLogs.length)} of {filteredLogs.length} log entries
          </div>
        )}
      </div>

      {/* Audit Logs Table */}
      <div className="bg-white border border-neutral-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full whitespace-nowrap" data-table="audit-logs">
            <thead className="bg-neutral-50 border-b border-neutral-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs text-neutral-600 uppercase tracking-wider w-10"></th>
                <th className="px-6 py-3 text-left text-xs text-neutral-600 uppercase tracking-wider">Timestamp</th>
                <th className="px-6 py-3 text-left text-xs text-neutral-600 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs text-neutral-600 uppercase tracking-wider">Workspace</th>
                <th className="px-6 py-3 text-left text-xs text-neutral-600 uppercase tracking-wider">Action</th>
                <th className="px-6 py-3 text-left text-xs text-neutral-600 uppercase tracking-wider">Resource</th>
                <th className="px-6 py-3 text-left text-xs text-neutral-600 uppercase tracking-wider">IP Address</th>
                <th className="px-6 py-3 text-left text-xs text-neutral-600 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {paginatedLogs.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center">
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
                    <tr key={log.id} className="hover:bg-neutral-50 transition-colors">
                      <td className="px-6 py-4">
                        <button
                          onClick={() => toggleRow(log.id)}
                          className="text-neutral-400 hover:text-neutral-600 cursor-pointer"
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
                        <div className="text-sm text-neutral-900">{log.timestamp}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <div className={`text-sm ${shouldHighlight && (log.user.toLowerCase().includes(debouncedSearch.toLowerCase())) ? 'bg-yellow-100 text-neutral-900' : 'text-neutral-900'}`}>{log.user}</div>
                          <div className={`text-sm ${shouldHighlight && (log.userEmail.toLowerCase().includes(debouncedSearch.toLowerCase())) ? 'bg-yellow-100 text-neutral-500' : 'text-neutral-500'}`}>{log.userEmail}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-neutral-900">{log.workspace}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <div className={`text-sm ${shouldHighlight && (log.action.toLowerCase().includes(debouncedSearch.toLowerCase())) ? 'bg-yellow-100 text-neutral-900' : 'text-neutral-900'}`}>{log.action}</div>
                          <div className="text-sm text-neutral-500">{log.details}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className={`text-sm font-mono ${shouldHighlight && (log.resource.toLowerCase().includes(debouncedSearch.toLowerCase())) ? 'bg-yellow-100 text-neutral-900' : 'text-neutral-900'}`}>{log.resource}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className={`text-sm font-mono ${shouldHighlight && (log.ipAddress.toLowerCase().includes(debouncedSearch.toLowerCase())) ? 'bg-yellow-100 text-neutral-900' : 'text-neutral-900'}`}>{log.ipAddress}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-full ${
                          log.status === 'Success' ? 'bg-green-50' : 'bg-red-50'
                        }`}>
                          <div className={`w-1.5 h-1.5 rounded-full ${
                            log.status === 'Success' ? 'bg-green-500' : 'bg-red-500'
                          }`}></div>
                          <span className={`text-xs ${
                            log.status === 'Success' ? 'text-green-700' : 'text-red-700'
                          }`}>{log.status}</span>
                        </div>
                      </td>
                    </tr>
                  ];
                  
                  // Add expanded row if needed
                  if (isExpanded) {
                    rows.push(
                      <tr key={`${log.id}-expanded`}>
                        <td colSpan={8} className="px-6 py-4 bg-neutral-50 border-t border-neutral-100">
                          <div className="grid grid-cols-3 gap-4 text-sm">
                            <div>
                              <div className="text-xs text-neutral-500 uppercase tracking-wider mb-1">Event ID</div>
                              <div className="text-neutral-900 font-mono">{log.eventId}</div>
                            </div>
                            <div>
                              <div className="text-xs text-neutral-500 uppercase tracking-wider mb-1">Role</div>
                              <div className="text-neutral-900">{log.role}</div>
                            </div>
                            <div>
                              <div className="text-xs text-neutral-500 uppercase tracking-wider mb-1">Device Type</div>
                              <div className="text-neutral-900">{log.deviceType}</div>
                            </div>
                            <div className="col-span-2">
                              <div className="text-xs text-neutral-500 uppercase tracking-wider mb-1">User Agent</div>
                              <div className="text-neutral-900 break-words">{log.userAgent}</div>
                            </div>
                            <div>
                              <div className="text-xs text-neutral-500 uppercase tracking-wider mb-1">Result</div>
                              <div className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-full ${
                                log.status === 'Success' ? 'bg-green-50' : 'bg-red-50'
                              }`}>
                                <div className={`w-1.5 h-1.5 rounded-full ${
                                  log.status === 'Success' ? 'bg-green-500' : 'bg-red-500'
                                }`}></div>
                                <span className={`text-xs ${
                                  log.status === 'Success' ? 'text-green-700' : 'text-red-700'
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
          <div className="text-sm text-neutral-600">
            Showing {filteredLogs.length === 0 ? 0 : ((currentPage - 1) * pageSize) + 1}-{Math.min(currentPage * pageSize, filteredLogs.length)} of {filteredLogs.length} logs
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-3 py-1.5 border border-neutral-200 rounded-lg text-sm transition-colors ${
                currentPage === 1 
                  ? 'text-neutral-400 cursor-not-allowed' 
                  : 'text-neutral-700 hover:bg-neutral-50 cursor-pointer'
              }`}
            >
              Previous
            </button>
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              // Show first 2, current, and last 2 pages
              let page;
              if (totalPages <= 5) {
                page = i + 1;
              } else if (currentPage <= 3) {
                page = i + 1;
              } else if (currentPage >= totalPages - 2) {
                page = totalPages - 4 + i;
              } else {
                page = currentPage - 2 + i;
              }
              
              return (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-3 py-1.5 rounded-lg text-sm transition-colors cursor-pointer ${
                    currentPage === page 
                      ? 'bg-neutral-900 text-[#FFFFFF]' 
                      : 'border border-neutral-200 text-neutral-700 hover:bg-neutral-50'
                  }`}
                >
                  {page}
                </button>
              );
            })}
            <button 
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages || totalPages === 0}
              className={`px-3 py-1.5 border border-neutral-200 rounded-lg text-sm transition-colors ${
                currentPage === totalPages || totalPages === 0
                  ? 'text-neutral-400 cursor-not-allowed' 
                  : 'text-neutral-700 hover:bg-neutral-50 cursor-pointer'
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
