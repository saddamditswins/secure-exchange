export const en = {
  // Navigation
  nav: {
    dashboard: 'Dashboard',
    workspaces: 'Workspaces',
    exchanges: 'Exchanges',
    documents: 'Documents',
    clients: 'Clients',
    auditLog: 'Audit Log',
    organizations: 'Organizations',
    users: 'Users',
    capacity: 'Capacity',
    settings: 'Settings',
    profile: 'Profile',
    logout: 'Logout',
  },

  // Common Actions
  action: {
    view: 'View',
    edit: 'Edit',
    delete: 'Delete',
    save: 'Save',
    update: 'Update',
    cancel: 'Cancel',
    close: 'Close',
    search: 'Search',
    filter: 'Filter',
    export: 'Export',
    download: 'Download',
    upload: 'Upload',
    share: 'Share',
    send: 'Send',
    approve: 'Approve',
    reject: 'Reject',
    archive: 'Archive',
    restore: 'Restore',
    selectAll: 'Select All',
    clearAll: 'Clear All',
    apply: 'Apply',
    reset: 'Reset',
    previous: 'Previous',
    next: 'Next',
    create: 'Create',
    add: 'Add',
    remove: 'Remove',
    copy: 'Copy',
    duplicate: 'Duplicate',
  },

  // Dashboard
  dashboard: {
    welcome: 'Welcome back',
    overview: 'Overview',
    activeExchanges: 'Active Exchanges',
    completedExchanges: 'Completed Exchanges',
    pendingReview: 'Pending Review',
    expiringSoon: 'Expiring Soon',
    recentActivity: 'Recent Activity',
    quickActions: 'Quick Actions',
    createExchange: 'Create Exchange',
    viewAll: 'View All',
  },

  // Exchanges
  exchange: {
    title: 'Exchanges',
    createNew: 'Create New Exchange',
    exchangeId: 'Exchange ID',
    exchangeName: 'Exchange Name',
    workspace: 'Workspace',
    status: 'Status',
    participants: 'Participants',
    documents: 'Documents',
    createdBy: 'Created By',
    createdDate: 'Created Date',
    expirationDate: 'Expiration Date',
    lastActivity: 'Last Activity',
    description: 'Description',
    noExchanges: 'No exchanges found',
    details: 'Exchange Details',
  },

  // Status
  status: {
    draft: 'Draft',
    active: 'Active',
    inProgress: 'In Progress',
    completed: 'Completed',
    expired: 'Expired',
    pending: 'Pending',
    approved: 'Approved',
    rejected: 'Rejected',
    cancelled: 'Cancelled',
    success: 'Success',
    failed: 'Failed',
  },

  // Workspaces
  workspace: {
    title: 'Workspaces',
    createNew: 'Create New Workspace',
    workspaceName: 'Workspace Name',
    workspaceType: 'Workspace Type',
    description: 'Description',
    members: 'Members',
    exchanges: 'Exchanges',
    noWorkspaces: 'No workspaces found',
  },

  // Users
  user: {
    title: 'Users',
    name: 'Name',
    email: 'Email',
    role: 'Role',
    status: 'Status',
    lastLogin: 'Last Login',
    actions: 'Actions',
    noUsers: 'No users found',
  },

  // Roles
  role: {
    superAdmin: 'Super Admin',
    tenantAdmin: 'Tenant Admin',
    workspaceAdmin: 'Workspace Admin',
    primaryOperationsUser: 'Primary Operations User',
    externalParticipant: 'External Participant',
  },

  // Audit Log
  audit: {
    title: 'Audit Logs',
    timestamp: 'Timestamp',
    user: 'User',
    action: 'Action',
    resource: 'Resource',
    details: 'Details',
    ipAddress: 'IP Address',
    noLogs: 'No audit logs found',
    exportLogs: 'Export Logs',
  },

  // Settings
  settings: {
    title: 'Settings',
    general: 'General',
    security: 'Security',
    notifications: 'Notifications',
    integrations: 'Integrations',
    branding: 'Branding',
    emailTemplates: 'Email Templates',
    theme: 'Theme',
    language: 'Language',
    darkMode: 'Dark Mode',
    lightMode: 'Light Mode',
  },

  // E-Sign
  esign: {
    title: 'E-Sign',
    reviewAndSign: 'Review & Sign',
    completeSigning: 'Complete Signing',
    fieldsCompleted: 'fields completed',
    nextRequiredField: 'Next Required Field',
    signature: 'Signature',
    initials: 'Initials',
    date: 'Date',
    consentText: 'I agree that my electronic signature is legally binding',
    signingComplete: 'Signing Completed Successfully',
    waitingForTurn: 'Waiting for Your Turn to Sign',
  },

  // Messages
  message: {
    success: 'Operation completed successfully',
    error: 'An error occurred',
    saved: 'Changes saved',
    deleted: 'Item deleted',
    noResults: 'No results found',
    loading: 'Loading...',
    required: 'This field is required',
    invalidEmail: 'Invalid email address',
    invalidDate: 'Invalid date',
  },

  // Filters
  filter: {
    allStatuses: 'All Statuses',
    allWorkspaces: 'All Workspaces',
    allRoles: 'All Roles',
    dateRange: 'Date Range',
    timeRange: 'Time Range',
    clearFilters: 'Clear All Filters',
  },

  // Pagination
  pagination: {
    showing: 'Showing',
    of: 'of',
    results: 'results',
    page: 'Page',
    rowsPerPage: 'Rows per page',
  },
};

export type TranslationKeys = typeof en;
