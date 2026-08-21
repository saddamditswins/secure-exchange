import { useState, useMemo, useEffect } from 'react';
import { toast } from 'sonner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Checkbox } from "./ui/checkbox";
import { MultiSelectFilter } from "./ui/multi-select-filter";

interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  userEmail: string;
  role: string;
  organization: string;
  action: string;
  resource: string;
  details: string;
  ipAddress: string;
  status: 'Success' | 'Failed';
  userAgent?: string;
  deviceType?: string;
  eventId?: string;
}

// Mock data - expanded dataset
const MOCK_AUDIT_LOGS: AuditLog[] = [
  { id: 'AL-9801', timestamp: '01/07/2026 10:45 AM', user: 'Sarah Mitchell', userEmail: 'sarah.mitchell@acmefinancial.com', role: 'Super Admin', organization: 'Acme Financial Services', action: 'User Created', resource: 'james.rodriguez@acmefinancial.com', details: 'Created new operational user', ipAddress: '192.168.1.100', status: 'Success', userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', deviceType: 'Desktop', eventId: 'EVT-1001' },
  { id: 'AL-9802', timestamp: '01/07/2026 10:30 AM', user: 'Emily Chen', userEmail: 'emily.chen@apexfinancial.com', role: 'Org Admin', organization: 'Apex Financial Group', action: 'Settings Updated', resource: 'Organization Settings', details: 'Updated security policy', ipAddress: '192.168.1.101', status: 'Success', userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X)', deviceType: 'Desktop', eventId: 'EVT-1002' },
  { id: 'AL-9803', timestamp: '01/07/2026 09:15 AM', user: 'Michael Torres', userEmail: 'michael.torres@meridiancap.com', role: 'Workspace Admin', organization: 'Meridian Capital', action: 'Login Failed', resource: 'Authentication', details: 'Invalid credentials', ipAddress: '192.168.1.102', status: 'Failed', userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', deviceType: 'Desktop', eventId: 'EVT-1003' },
  { id: 'AL-9804', timestamp: '01/07/2026 08:30 AM', user: 'Lisa Anderson', userEmail: 'lisa.anderson@sterlinginv.com', role: 'Org Admin', organization: 'Sterling Investments', action: 'User Suspended', resource: 'david.kim@sterlinginv.com', details: 'Account suspended by admin', ipAddress: '192.168.1.103', status: 'Success', userAgent: 'Mozilla/5.0 (iPad; CPU OS)', deviceType: 'Mobile', eventId: 'EVT-1004' },
  { id: 'AL-9805', timestamp: '01/07/2026 07:00 AM', user: 'Platform Admin', userEmail: 'admin@secureexchange.com', role: 'Super Admin', organization: 'Platform', action: 'Organization Created', resource: 'Quantum Securities', details: 'New organization provisioned', ipAddress: '192.168.1.1', status: 'Success', userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X)', deviceType: 'Desktop', eventId: 'EVT-1005' },
  { id: 'AL-9806', timestamp: '01/06/2026 05:45 PM', user: 'Sarah Mitchell', userEmail: 'sarah.mitchell@acmefinancial.com', role: 'Super Admin', organization: 'Acme Financial Services', action: 'Settings Updated', resource: 'API Keys', details: 'Rotated API key', ipAddress: '192.168.1.100', status: 'Success', userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', deviceType: 'Desktop', eventId: 'EVT-1006' },
  { id: 'AL-9807', timestamp: '01/06/2026 04:30 PM', user: 'Robert Garcia', userEmail: 'robert.garcia@novaholdings.com', role: 'Workspace Admin', organization: 'Nova Holdings', action: 'Exchange Approved', resource: 'EX-2021', details: 'Approved external access', ipAddress: '192.168.1.104', status: 'Success', userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', deviceType: 'Desktop', eventId: 'EVT-1007' },
  { id: 'AL-9808', timestamp: '01/06/2026 03:15 PM', user: 'Jennifer Lee', userEmail: 'jennifer.lee@quantumsec.com', role: 'Org Admin', organization: 'Quantum Securities', action: 'Login Failed', resource: 'Authentication', details: 'Account locked after 3 attempts', ipAddress: '192.168.1.105', status: 'Failed', userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS)', deviceType: 'Mobile', eventId: 'EVT-1008' },
  { id: 'AL-9809', timestamp: '01/06/2026 02:00 PM', user: 'Platform Admin', userEmail: 'admin@secureexchange.com', role: 'Super Admin', organization: 'Platform', action: 'Access Revoked', resource: 'EX-2009', details: 'Emergency access revocation', ipAddress: '192.168.1.1', status: 'Success', userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X)', deviceType: 'Desktop', eventId: 'EVT-1009' },
  { id: 'AL-9810', timestamp: '01/06/2026 01:30 PM', user: 'David Kim', userEmail: 'david.kim@sterlinginv.com', role: 'Operational', organization: 'Sterling Investments', action: 'Document Uploaded', resource: 'DOC-4021', details: 'Uploaded compliance document', ipAddress: '192.168.1.106', status: 'Success', userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', deviceType: 'Desktop', eventId: 'EVT-1010' },
  { id: 'AL-9811', timestamp: '01/06/2026 12:45 PM', user: 'Emily Chen', userEmail: 'emily.chen@apexfinancial.com', role: 'Org Admin', organization: 'Apex Financial Group', action: 'User Created', resource: 'alice.johnson@apexfinancial.com', details: 'Created workspace admin user', ipAddress: '192.168.1.101', status: 'Success', userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X)', deviceType: 'Desktop', eventId: 'EVT-1011' },
  { id: 'AL-9812', timestamp: '01/06/2026 11:30 AM', user: 'Michael Torres', userEmail: 'michael.torres@meridiancap.com', role: 'Workspace Admin', organization: 'Meridian Capital', action: 'Settings Updated', resource: 'Workspace Settings', details: 'Updated notification preferences', ipAddress: '192.168.1.102', status: 'Success', userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', deviceType: 'Desktop', eventId: 'EVT-1012' },
  { id: 'AL-9813', timestamp: '01/06/2026 10:15 AM', user: 'Sarah Mitchell', userEmail: 'sarah.mitchell@acmefinancial.com', role: 'Super Admin', organization: 'Acme Financial Services', action: 'Exchange Approved', resource: 'EX-2012', details: 'Approved client document access', ipAddress: '192.168.1.100', status: 'Success', userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', deviceType: 'Desktop', eventId: 'EVT-1013' },
  { id: 'AL-9814', timestamp: '01/06/2026 09:00 AM', user: 'Platform Admin', userEmail: 'admin@secureexchange.com', role: 'Super Admin', organization: 'Platform', action: 'Settings Updated', resource: 'Platform Configuration', details: 'Updated global security settings', ipAddress: '192.168.1.1', status: 'Success', userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X)', deviceType: 'Desktop', eventId: 'EVT-1014' },
  { id: 'AL-9815', timestamp: '01/06/2026 08:00 AM', user: 'Robert Garcia', userEmail: 'robert.garcia@novaholdings.com', role: 'Workspace Admin', organization: 'Nova Holdings', action: 'Login Failed', resource: 'Authentication', details: 'Incorrect password', ipAddress: '192.168.1.104', status: 'Failed', userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', deviceType: 'Desktop', eventId: 'EVT-1015' },
  { id: 'AL-9816', timestamp: '01/05/2026 05:30 PM', user: 'Lisa Anderson', userEmail: 'lisa.anderson@sterlinginv.com', role: 'Org Admin', organization: 'Sterling Investments', action: 'Settings Updated', resource: 'Email Templates', details: 'Customized notification templates', ipAddress: '192.168.1.103', status: 'Success', userAgent: 'Mozilla/5.0 (iPad; CPU OS)', deviceType: 'Mobile', eventId: 'EVT-1016' },
  { id: 'AL-9817', timestamp: '01/05/2026 04:15 PM', user: 'Jennifer Lee', userEmail: 'jennifer.lee@quantumsec.com', role: 'Org Admin', organization: 'Quantum Securities', action: 'User Created', resource: 'peter.wu@quantumsec.com', details: 'Created operational user', ipAddress: '192.168.1.105', status: 'Success', userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X)', deviceType: 'Desktop', eventId: 'EVT-1017' },
  { id: 'AL-9818', timestamp: '01/05/2026 03:00 PM', user: 'Platform Admin', userEmail: 'admin@secureexchange.com', role: 'Super Admin', organization: 'Platform', action: 'Organization Created', resource: 'Horizon Financial', details: 'New organization provisioned', ipAddress: '192.168.1.1', status: 'Success', userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X)', deviceType: 'Desktop', eventId: 'EVT-1018' },
  { id: 'AL-9819', timestamp: '01/05/2026 02:30 PM', user: 'Emily Chen', userEmail: 'emily.chen@apexfinancial.com', role: 'Org Admin', organization: 'Apex Financial Group', action: 'Access Revoked', resource: 'EX-2015', details: 'Revoked expired access', ipAddress: '192.168.1.101', status: 'Success', userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X)', deviceType: 'Desktop', eventId: 'EVT-1019' },
  { id: 'AL-9820', timestamp: '01/05/2026 01:15 PM', user: 'Michael Torres', userEmail: 'michael.torres@meridiancap.com', role: 'Workspace Admin', organization: 'Meridian Capital', action: 'Document Uploaded', resource: 'DOC-4022', details: 'Uploaded financial statement', ipAddress: '192.168.1.102', status: 'Success', userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', deviceType: 'Desktop', eventId: 'EVT-1020' },
  { id: 'AL-9821', timestamp: '01/05/2026 12:00 PM', user: 'Sarah Mitchell', userEmail: 'sarah.mitchell@acmefinancial.com', role: 'Super Admin', organization: 'Acme Financial Services', action: 'Login Failed', resource: 'Authentication', details: 'MFA verification failed', ipAddress: '192.168.1.100', status: 'Failed', userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', deviceType: 'Desktop', eventId: 'EVT-1021' },
  { id: 'AL-9822', timestamp: '01/05/2026 11:00 AM', user: 'David Kim', userEmail: 'david.kim@sterlinginv.com', role: 'Operational', organization: 'Sterling Investments', action: 'Settings Updated', resource: 'Profile Settings', details: 'Updated contact information', ipAddress: '192.168.1.106', status: 'Success', userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', deviceType: 'Desktop', eventId: 'EVT-1022' },
  { id: 'AL-9823', timestamp: '01/05/2026 10:30 AM', user: 'Robert Garcia', userEmail: 'robert.garcia@novaholdings.com', role: 'Workspace Admin', organization: 'Nova Holdings', action: 'Exchange Approved', resource: 'EX-2023', details: 'Approved partner document access', ipAddress: '192.168.1.104', status: 'Success', userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', deviceType: 'Desktop', eventId: 'EVT-1023' },
  { id: 'AL-9824', timestamp: '01/05/2026 09:15 AM', user: 'Platform Admin', userEmail: 'admin@secureexchange.com', role: 'Super Admin', organization: 'Platform', action: 'User Suspended', resource: 'john.doe@suspendedorg.com', details: 'Account suspended for policy violation', ipAddress: '192.168.1.1', status: 'Success', userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X)', deviceType: 'Desktop', eventId: 'EVT-1024' },
  { id: 'AL-9825', timestamp: '01/05/2026 08:00 AM', user: 'Lisa Anderson', userEmail: 'lisa.anderson@sterlinginv.com', role: 'Org Admin', organization: 'Sterling Investments', action: 'User Created', resource: 'maria.gonzalez@sterlinginv.com', details: 'Created workspace admin user', ipAddress: '192.168.1.103', status: 'Success', userAgent: 'Mozilla/5.0 (iPad; CPU OS)', deviceType: 'Mobile', eventId: 'EVT-1025' },
];

const ORGANIZATIONS = Array.from(new Set(MOCK_AUDIT_LOGS.map(log => log.organization))).sort();
const ACTIONS = Array.from(new Set(MOCK_AUDIT_LOGS.map(log => log.action))).sort();

// Security-related actions
const SECURITY_ACTIONS = ['Login Failed', 'Access Revoked', 'User Suspended', 'Settings Updated'];

export function SuperAdminAuditLogs() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrganizations, setSelectedOrganizations] = useState<string[]>([]);
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
      setCurrentPage(1); // Reset to first page on search
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

    // Apply organization filter
    if (selectedOrganizations.length > 0) {
      logs = logs.filter(log => selectedOrganizations.includes(log.organization));
    }

    // Apply action filter
    if (selectedActions.length > 0) {
      logs = logs.filter(log => selectedActions.includes(log.action));
    }

    // Apply time range filter (mock implementation - in real app would filter by date)
    // For now, we'll just use the data as-is

    return logs;
  }, [debouncedSearch, selectedOrganizations, selectedActions]);

  // Paginated logs
  const paginatedLogs = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return filteredLogs.slice(startIndex, endIndex);
  }, [filteredLogs, currentPage]);

  const totalPages = Math.ceil(filteredLogs.length / pageSize);

  // Export functionality
  const handleExport = () => {
    setIsExporting(true);
    
    // Prepare CSV data
    const headers = ['Timestamp', 'User', 'Email', 'Role', 'Organization', 'Action', 'Resource', 'IP Address', 'Status'];
    const csvRows = [headers.join(',')];
    
    filteredLogs.forEach(log => {
      const row = [
        log.timestamp,
        log.user,
        log.userEmail,
        log.role,
        log.organization,
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
    link.setAttribute('download', `audit-logs-${new Date().toISOString().split('T')[0]}.csv`);
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
    // Only allow one row expanded at a time
    if (expandedRows.has(logId)) {
      setExpandedRows(new Set());
    } else {
      setExpandedRows(new Set([logId]));
    }
  };

  const toggleActionFilter = (action: string) => {
    setSelectedActions(prev => {
      if (prev.includes(action)) {
        return prev.filter(a => a !== action);
      } else {
        return [...prev, action];
      }
    });
    setCurrentPage(1);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setDebouncedSearch('');
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setDebouncedSearch('');
    setSelectedOrganizations([]);
    setSelectedActions([]);
    setTimeRange('Last 24 Hours');
    setCurrentPage(1);
    setActiveKPI(null);
  };

  // KPI Click Handlers
  const handleKPIClick = (kpiType: string) => {
    // If clicking the active KPI, clear it
    if (activeKPI === kpiType) {
      clearFilters();
      return;
    }

    // Clear existing filters first
    setSearchQuery('');
    setDebouncedSearch('');
    setSelectedOrganizations([]);
    setSelectedActions([]);
    setCurrentPage(1);

    // Apply KPI-specific filter
    switch (kpiType) {
      case 'total-events':
        setTimeRange('Last 24 Hours');
        setActiveKPI('total-events');
        break;
      case 'failed-logins':
        setTimeRange('Last 24 Hours');
        setSelectedActions(['Login Failed']);
        setActiveKPI('failed-logins');
        break;
      case 'security-events':
        setSelectedActions(SECURITY_ACTIONS);
        setActiveKPI('security-events');
        break;
      case 'active-sessions':
        // For active sessions, we could filter by successful logins or session-related actions
        setSelectedActions(['User Created', 'Organization Created', 'Exchange Approved']);
        setActiveKPI('active-sessions');
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

  const hasActiveFilters = debouncedSearch || selectedOrganizations.length > 0 || selectedActions.length > 0;

  return (
    <div className="mx-auto w-full max-w-[1600px] p-4 sm:p-6 space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-neutral-900 mb-1">Audit Logs</h1>
          <p className="text-sm text-neutral-600">Platform-wide activity and security events</p>
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
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <button
          onClick={() => handleKPIClick('total-events')}
          className={`bg-white border-2 rounded-lg p-4 text-left transition-all cursor-pointer hover:border-neutral-300 hover:shadow-sm ${
            activeKPI === 'total-events' ? 'border-neutral-900 ring-2 ring-neutral-900 ring-opacity-20' : 'border-neutral-200'
          }`}
        >
          <div className="text-sm text-neutral-600 mb-1">Total Events (24h)</div>
          <div className="text-2xl text-neutral-900 mb-2">1,247</div>
          <div className="text-xs text-neutral-500">View events from last 24 hours</div>
        </button>
        <button
          onClick={() => handleKPIClick('failed-logins')}
          className={`bg-white border-2 rounded-lg p-4 text-left transition-all cursor-pointer hover:border-red-200 hover:shadow-sm ${
            activeKPI === 'failed-logins' ? 'border-red-600 ring-2 ring-red-600 ring-opacity-20' : 'border-neutral-200'
          }`}
        >
          <div className="text-sm text-neutral-600 mb-1">Failed Logins (24h)</div>
          <div className="text-2xl text-red-600 mb-2">23</div>
          <div className="text-xs text-neutral-500">Review failed authentication attempts</div>
        </button>
        <button
          onClick={() => handleKPIClick('security-events')}
          className={`bg-white border-2 rounded-lg p-4 text-left transition-all cursor-pointer hover:border-amber-200 hover:shadow-sm ${
            activeKPI === 'security-events' ? 'border-amber-600 ring-2 ring-amber-600 ring-opacity-20' : 'border-neutral-200'
          }`}
        >
          <div className="text-sm text-neutral-600 mb-1">Security Events</div>
          <div className="text-2xl text-amber-600 mb-2">12</div>
          <div className="text-xs text-neutral-500">Inspect security-related activity</div>
        </button>
        <button
          onClick={() => handleKPIClick('active-sessions')}
          className={`bg-white border-2 rounded-lg p-4 text-left transition-all cursor-pointer hover:border-green-200 hover:shadow-sm ${
            activeKPI === 'active-sessions' ? 'border-green-600 ring-2 ring-green-600 ring-opacity-20' : 'border-neutral-200'
          }`}
        >
          <div className="text-sm text-neutral-600 mb-1">Active Sessions</div>
          <div className="text-2xl text-green-600 mb-2">847</div>
          <div className="text-xs text-neutral-500">Monitor active user sessions</div>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white border border-neutral-200 rounded-lg p-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
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
          <div className="w-full sm:w-[200px]">
            <MultiSelectFilter
              label="Organizations"
              options={ORGANIZATIONS}
              selectedValues={selectedOrganizations}
              onChange={(values) => {
                setSelectedOrganizations(values);
                setCurrentPage(1);
              }}
              placeholder="All Organizations"
            />
          </div>
          <div className="w-full sm:w-[200px]">
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
                <th className="px-6 py-3 text-left text-xs text-neutral-600 uppercase tracking-wider">Organization</th>
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
                        <div className="text-sm text-neutral-900">{log.organization}</div>
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
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
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
            Showing {filteredLogs.length === 0 ? 0 : ((currentPage - 1) * pageSize) + 1}-{Math.min(currentPage * pageSize, filteredLogs.length)} of {filteredLogs.length} log entries
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className={`px-3 py-1.5 border border-neutral-200 rounded-lg text-sm transition-colors ${
                currentPage === 1 
                  ? 'text-neutral-400 cursor-not-allowed' 
                  : 'text-neutral-600 hover:bg-neutral-50 cursor-pointer'
              }`}
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-1.5 rounded-lg text-sm transition-colors cursor-pointer ${
                  currentPage === page 
                    ? 'bg-neutral-900 text-neutral-50' 
                    : 'border border-neutral-200 text-neutral-600 hover:bg-neutral-50'
                }`}
              >
                {page}
              </button>
            ))}
            <button 
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages || totalPages === 0}
              className={`px-3 py-1.5 border border-neutral-200 rounded-lg text-sm transition-colors ${
                currentPage === totalPages || totalPages === 0
                  ? 'text-neutral-400 cursor-not-allowed' 
                  : 'text-neutral-600 hover:bg-neutral-50 cursor-pointer'
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