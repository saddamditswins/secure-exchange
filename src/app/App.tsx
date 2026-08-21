import { LandingPage } from './components/LandingPage';
import { RoleSwitcherEnhanced } from './components/RoleSwitcherEnhanced';
import { LoginView } from './components/LoginView';
import { TopBar } from './components/TopBar';
import { Sidebar } from './components/Sidebar';
import { DashboardView } from './components/DashboardView';
import { OrgAdminDashboard } from './components/OrgAdminDashboard';
import { WorkspaceListView } from './components/WorkspaceListView';
import { WorkspaceDetailsView } from './components/WorkspaceDetailsView';
import { CreateWorkspaceView } from './components/CreateWorkspaceView';
import { ImportFromDealertrackView } from './components/ImportFromDealertrackView';
import { ImportDocumentsView } from './components/ImportDocumentsView';
import { PrepareForSharingView } from './components/PrepareForSharingView';
import { ExchangesView } from './components/ExchangesView';
import { ExchangeDetailView } from './components/ExchangeDetailView';
import { AuditLogView } from './components/AuditLogView';
import { DocumentsView } from './components/DocumentsView';
import { ClientsView } from './components/ClientsView';
import { SettingsView } from './components/SettingsView';
import { DecisionReviewView } from './components/DecisionReviewView';
import { DecisionReviewScreen } from './components/DecisionReviewScreen';
import { ProfileView } from './components/ProfileView';
import { SuperAdminSidebar } from './components/SuperAdminSidebar';
import { SuperAdminDashboard } from './components/SuperAdminDashboard';
import { SuperAdminTenantList } from './components/SuperAdminTenantList';
import { SuperAdminTenantDetail } from './components/SuperAdminTenantDetail';
import { SuperAdminOrganizations } from './components/SuperAdminOrganizations';
import { ESignEditorView } from './components/ESignEditorView';
import { generateDummyNotifications, Notification } from './components/NotificationPanel';
import { Sheet, SheetContent } from './components/ui/sheet';
import { Toaster } from './components/ui/sonner';
import { SuperAdminAuditLogs } from './components/SuperAdminAuditLogs';
import { CreateOrganizationView } from './components/CreateOrganizationView';
import { AccessRestrictedView } from './components/AccessRestrictedView';
import { PrimaryOperationalDashboard } from './components/PrimaryOperationalDashboard';
import { PrimaryOperationalAuditLogs } from './components/PrimaryOperationalAuditLogs';
import { TenantAdminAuditLogs } from './components/TenantAdminAuditLogs';
import { SuperAdminUsers } from './components/SuperAdminUsers';
import { useState } from 'react';
import { ThemeProvider } from '../contexts/ThemeContext';
import { SecureShareFlow } from './components/external-v2/SecureShareFlow';
import { ESignCeremonyFlow } from './components/external-ceremony/ESignCeremonyFlow';

export type ViewType = 
  | 'dashboard' 
  | 'workspaces' 
  | 'workspace-details'
  | 'create-workspace' 
  | 'import-documents' 
  | 'prepare-sharing'
  | 'exchanges' 
  | 'exchange-detail'
  | 'documents'
  | 'audit-log' 
  | 'settings' // Keep for backward compatibility or default
  | 'settings-org'
  | 'settings-roles'
  | 'settings-users'
  | 'settings-integrations'
  | 'clients'
  | 'decision-review'
  | 'decision-review-detail'
  | 'profile';

export type SuperAdminViewType =
  | 'dashboard'
  | 'organizations'
  | 'create-organization'
  | 'organization-detail'
  | 'users'
  | 'user-profile'
  | 'audit-logs'
  // 'tenants' / 'tenant-detail' are the tenant-management screens; they were in use
  // but missing from this union, so nothing type-checked them.
  | 'tenants'
  | 'tenant-detail';

import type { ExchangeStatus } from './utils/exchangeStatus';
import type { Organization, Tenant, Workspace } from './types';
export type { ExchangeStatus };

export interface Exchange {
  id: string;
  title: string;
  status: ExchangeStatus;
  createdBy: string;
  createdDate: string;
  lastModified: string;
  participants: number;
  documentsCount: number;
  requiresSignature: boolean;
  riskLevel?: 'Low' | 'Medium' | 'High';
  expiresAt?: string;
}

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

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
      {/* Mounted once here: without it every toast() call in the app is a no-op. */}
      <Toaster />
    </ThemeProvider>
  );
}

function AppContent() {
  const [showRoleSwitcher, setShowRoleSwitcher] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isOnLandingPage, setIsOnLandingPage] = useState(true);
  const [userRole, setUserRole] = useState<'Super Admin' | 'Tenant Admin' | 'Primary Operations User' | 'External Participant - Secure Share' | 'External Participant - E-Sign' | 'External Participant - E-Sign On Device'>('Tenant Admin');
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');
  const [superAdminView, setSuperAdminView] = useState<SuperAdminViewType>('dashboard');
  const [selectedExchange, setSelectedExchange] = useState<Exchange | null>(null);
  const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);
  const [selectedOrganization, setSelectedOrganization] = useState<Organization | null>(null);
  const [selectedDocument, setSelectedDocument] = useState<DocumentExchange | null>(null);
  const [selectedWorkspace, setSelectedWorkspace] = useState<Workspace | null>(null);
  const [newWorkspaceId, setNewWorkspaceId] = useState<string>('');
  const [showCreateWorkspaceModal, setShowCreateWorkspaceModal] = useState(false);
  const [showImportDealertrackModal, setShowImportDealertrackModal] = useState(false);
  const [newWorkspaceName, setNewWorkspaceName] = useState('');
  const [newWorkspaceDescription, setNewWorkspaceDescription] = useState('');
  const [newWorkspaceDocuments, setNewWorkspaceDocuments] = useState<File[]>([]);
  const [newWorkspaceDealId, setNewWorkspaceDealId] = useState<string | null>(null);
  const [initialWorkspaceTab, setInitialWorkspaceTab] = useState<'documents' | 'exchanges' | 'esign' | 'audit'>('documents');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isESignEditorOpen, setIsESignEditorOpen] = useState(false);

  // Notifications state
  const [notifications, setNotifications] = useState<Notification[]>(generateDummyNotifications());

  // Sheet Create Org
  const [showCreateOrgSheet, setShowCreateOrgSheet] = useState(false);

  const handleMarkAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const handleNotificationClick = (notification: Notification) => {
    // Mark as read
    setNotifications(prev => 
      prev.map(n => n.id === notification.id ? { ...n, isRead: true } : n)
    );

    // Navigate to the appropriate context
    if (notification.workspaceId && notification.exchangeId) {
      // Set workspace context
      const mockWorkspace: Workspace = {
        id: notification.workspaceId,
        dealId: null,
        name: `Workspace ${notification.workspaceId}`,
        status: 'Active',
        lastUpdated: '01/07/2026',
        documentsCount: 12,
        createdBy: 'Sarah Mitchell'
      };
      setSelectedWorkspace(mockWorkspace);
      setNewWorkspaceId(notification.workspaceId);
      setNewWorkspaceName(mockWorkspace.name);
      
      // Set exchange context
      const mockExchange: Exchange = {
        id: notification.exchangeId,
        title: notification.description,
        status: 'Active',
        createdBy: 'Sarah Mitchell',
        createdDate: '01/07/2026',
        lastModified: '01/07/2026',
        participants: 3,
        documentsCount: 5,
        requiresSignature: true,
        riskLevel: 'Medium'
      };
      setSelectedExchange(mockExchange);
      
      // Navigate to exchange detail
      setCurrentView('exchange-detail');
      
      // In a real app, would also set the active tab based on notification.targetTab
      console.log(`Navigate to ${notification.exchangeId}, tab: ${notification.targetTab}`);
    }
  };

  const handleExchangeSelect = (exchange: Exchange) => {
    setSelectedExchange(exchange);
    setCurrentView('exchange-detail');
  };

  const handleBackToExchanges = () => {
    setCurrentView('exchanges');
    setSelectedExchange(null);
  };

  const handleReviewDocument = (doc: DocumentExchange) => {
    setSelectedDocument(doc);
    setCurrentView('decision-review');
  };

  const handleViewWorkspaceFromDashboard = (workspaceId: string) => {
    setNewWorkspaceId(workspaceId);
    setNewWorkspaceName(`Workspace ${workspaceId}`);
    setNewWorkspaceDescription('Accessed via Dashboard');
    setNewWorkspaceDealId(null);
    setNewWorkspaceDocuments([]);
    setInitialWorkspaceTab('exchanges');
    setCurrentView('workspace-details');
  };

  const handleBackToDashboard = () => {
    setCurrentView('dashboard');
    setSelectedDocument(null);
  };

  const handleDecisionComplete = () => {
    setCurrentView('dashboard');
    setSelectedDocument(null);
  };

  const handleOpenWorkspace = (workspace: Workspace) => {
    setSelectedWorkspace(workspace);
    setNewWorkspaceId(workspace.id);
    setNewWorkspaceName(workspace.name);
    setNewWorkspaceDescription(''); // Can be populated from workspace data if needed
    setNewWorkspaceDealId(workspace.dealId);
    setNewWorkspaceDocuments([]); // Existing workspace, documents already uploaded
    setInitialWorkspaceTab('documents');
    setCurrentView('workspace-details');
  };

  const handleCreateWorkspace = (type: 'new' | 'import') => {
    if (type === 'import') {
      // In a real app, this would open an import flow from Dealertrack
      console.log('Import from Dealertrack initiated');
      // For now, show the create workspace modal
      setShowImportDealertrackModal(true);
    } else {
      setShowCreateWorkspaceModal(true);
    }
  };

  const handleWorkspaceCreated = (workspaceId: string, documents: File[], name: string, description: string) => {
    setNewWorkspaceId(workspaceId);
    setNewWorkspaceName(name);
    setNewWorkspaceDescription(description);
    setNewWorkspaceDocuments(documents);
    setNewWorkspaceDealId(null);
    setShowCreateWorkspaceModal(false);
    setCurrentView('workspace-details');
  };

  const handleWorkspaceImported = (workspaceId: string, dealId: string, name: string, description: string, documents: File[]) => {
    setNewWorkspaceId(workspaceId);
    setNewWorkspaceName(name);
    setNewWorkspaceDescription(description);
    setNewWorkspaceDocuments(documents);
    setNewWorkspaceDealId(dealId);
    setShowImportDealertrackModal(false);
    setCurrentView('workspace-details');
  };

  const handleCloseCreateWorkspaceModal = () => {
    setShowCreateWorkspaceModal(false);
    setNewWorkspaceName('');
    setNewWorkspaceDescription('');
  };

  const handleBackToWorkspaces = () => {
    setCurrentView('workspaces');
    setSelectedWorkspace(null);
    setNewWorkspaceId('');
  };

  const handleContinueToPrepare = () => {
    setCurrentView('prepare-sharing');
  };

  const handleSubmitForApproval = () => {
    // Navigate back to workspaces after successful submission
    setCurrentView('workspaces');
    setSelectedWorkspace(null);
    setNewWorkspaceId('');
  };

  const handleLogin = () => {
    setIsAuthenticated(true);
    setIsOnLandingPage(false);
  };

  const handleSelectRole = (role: 'Super Admin' | 'Tenant Admin' | 'Primary Operations User' | 'External Participant - Secure Share' | 'External Participant - E-Sign' | 'External Participant - E-Sign On Device') => {
    // External Participant - Secure Share: Show the OTP/Document flow
    if (role === 'External Participant - Secure Share') {
      setUserRole(role);
      setShowRoleSwitcher(false);
      setIsAuthenticated(true); // Mark as "authenticated" to show the external flow
      return;
    }
    
    // External Participant - E-Sign: Keep on role switcher for now
    if (role === 'External Participant - E-Sign' || role === 'External Participant - E-Sign On Device') {
      // Show the E-Sign flow
      setUserRole(role);
      setShowRoleSwitcher(false);
      setIsAuthenticated(true); // Mark as "authenticated" to show the external flow
      return;
    }
    
    setUserRole(role);
    setShowRoleSwitcher(false);
    
    // Reset states when switching roles
    setIsAuthenticated(false);
    setCurrentView('dashboard');
    setSuperAdminView('tenants');
    setSelectedExchange(null);
    setSelectedTenant(null);
    setSelectedDocument(null);
    setSelectedWorkspace(null);
    setNewWorkspaceId('');
    setIsMobileMenuOpen(false);
  };

  const handleLogout = () => {
    setShowRoleSwitcher(true);
    setIsAuthenticated(false);
    setIsOnLandingPage(true);
    setCurrentView('dashboard');
    setSuperAdminView('tenants');
    setSelectedExchange(null);
    setSelectedTenant(null);
    setSelectedDocument(null);
    setSelectedWorkspace(null);
    setNewWorkspaceId('');
    setIsMobileMenuOpen(false);
  };

  const handleViewProfile = () => {
    setCurrentView('profile');
    setIsMobileMenuOpen(false);
  };

  const handleViewTenant = (tenant: Tenant) => {
    setSelectedTenant(tenant);
    setSuperAdminView('tenant-detail');
  };

  const handleCreateTenant = () => {
    setSuperAdminView('create-organization');
  };

  const handleViewOrganization = (org: Organization) => {
    setSelectedOrganization(org);
    setSuperAdminView('organization-detail');
  };

  const handleCreateOrganization = () => {
    setSuperAdminView('create-organization');
  };

  const handleBackToTenants = () => {
    setSuperAdminView('tenants');
    setSuperAdminView('organizations');
    setSelectedTenant(null);
    setSelectedOrganization(null);
  };

  const handleTenantCreated = () => {
    setSuperAdminView('tenants');
    setSuperAdminView('organizations');
  };

  // Show Landing Page first
  if (isOnLandingPage && !isAuthenticated) {
    return <LandingPage onLoginClick={() => setIsOnLandingPage(false)} />;
  }

  // Show Role Switcher (for demo purposes)
  if (showRoleSwitcher) {
    return <RoleSwitcherEnhanced onSelectRole={handleSelectRole} />;
  }

  if (!isAuthenticated) {
    return <LoginView onLogin={handleLogin} onBack={() => setShowRoleSwitcher(true)} />;
  }

  // Super Admin Portal
  if (userRole === 'Super Admin') {
    return (
      <div className="flex h-screen bg-neutral-50">
        <SuperAdminSidebar 
          currentView={superAdminView} 
          onNavigate={(v) => {
            setSuperAdminView(v);
          }}
          className="hidden md:flex" 
        />
        
        <div className="flex-1 flex flex-col overflow-hidden">
          <TopBar 
            orgName="Secure Exchange Platform"
            userRole="Super Admin"
            userName="Platform Admin"
            onLogout={handleLogout}
            onViewProfile={handleViewProfile}
            onMenuClick={() => setIsMobileMenuOpen(true)}
            notifications={notifications}
            onMarkAllNotificationsRead={handleMarkAllNotificationsRead}
            onNotificationClick={handleNotificationClick}
          />
          
          <main className="flex-1 overflow-y-auto">
            {superAdminView === 'tenants' && (
              <SuperAdminTenantList 
                onViewTenant={handleViewTenant}
                onCreateTenant={handleCreateTenant}
              />
            )}
            
            {/* create-tenant view removed in favor of sheet */}
            
            {superAdminView === 'tenant-detail' && selectedTenant && (
              <SuperAdminTenantDetail
                tenant={selectedTenant}
                onBack={handleBackToTenants}
              />
            )}
            {superAdminView === 'dashboard' && <SuperAdminDashboard />}
            
            {superAdminView === 'organizations' && (
              <SuperAdminOrganizations 
                onViewOrganization={handleViewOrganization}
                onCreateOrganization={handleCreateOrganization}
              />
            )}
            
            {superAdminView === 'create-organization' && (
              <CreateOrganizationView
                onBack={handleBackToTenants}
                onCreate={handleTenantCreated}
              />
            )}
            
            {superAdminView === 'organization-detail' && selectedOrganization && (
              <SuperAdminTenantDetail
                tenant={selectedOrganization}
                onBack={handleBackToTenants}
              />
            )}
            
            {superAdminView === 'users' && <SuperAdminUsers />}
            
            {superAdminView === 'user-profile' && <ProfileView
              userName="Platform Admin"
              userRole="Super Admin"
              userEmail="admin@secureexchange.com"
              orgName="Secure Exchange Platform"
            />}
            
            {superAdminView === 'audit-logs' && <SuperAdminAuditLogs />}
          </main>
        </div>

        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
          <SheetContent side="left" className="p-0 w-64 border-r-[#243F4D] bg-[#153240]">
            <SuperAdminSidebar 
              currentView={superAdminView} 
              onNavigate={(v) => {
                setSuperAdminView(v);
                setIsMobileMenuOpen(false);
              }}
              className="w-full h-full"
            />
          </SheetContent>
        </Sheet>
      </div>
    );
  }

  // External Participant - Secure Share Flow
  if (userRole === 'External Participant - Secure Share') {
    return (
      <SecureShareFlow
        organizationName="Acme Financial Services"
        exchangeId="EX-2042"
        exchangeTitle="Vehicle Purchase Documents"
        exchangeDescription="Review and upload required documents for vehicle purchase"
        expiresAt="01/15/2026"
        recipientEmail="michael.thompson@example.com"
        allowDownload={true}
        allowUpload={true}
        uploadRequired={false}
        documents={[
          { id: 'doc-1', name: 'Purchase Agreement.pdf', pageCount: 5 },
          { id: 'doc-2', name: 'Vehicle Inspection Report.pdf', pageCount: 3 },
          { id: 'doc-3', name: 'Insurance Verification.pdf', pageCount: 2 },
        ]}
        onComplete={() => setShowRoleSwitcher(true)}
      />
    );
  }

  // External Participant - E-Sign Flow
  if (userRole === 'External Participant - E-Sign' || userRole === 'External Participant - E-Sign On Device') {
    return (
      <ESignCeremonyFlow
        exchangeId="EX-2042"
        participantToken="demo-token-12345"
      />
    );
  }

  // Tenant Admin Portal
  return (
    <div className="flex h-screen bg-neutral-50">
      {!isESignEditorOpen && (
        <Sidebar 
          currentView={currentView} 
          onNavigate={(v) => {
            setCurrentView(v);
          }}
          className="flex"
          userRole={userRole}
        />
      )}
      
      <div className="flex-1 flex flex-col overflow-hidden">
        {!isESignEditorOpen && (
          <TopBar 
            orgName="Acme Financial Services"
            userRole={userRole === 'Primary Operations User' ? 'Primary Operations User' : 'Tenant Admin'}
            userName={userRole === 'Primary Operations User' ? 'James Rodriguez' : 'Sarah Mitchell'}
            onLogout={handleLogout}
            onViewProfile={handleViewProfile}
            onMenuClick={() => setIsMobileMenuOpen(true)}
            notifications={notifications}
            onMarkAllNotificationsRead={handleMarkAllNotificationsRead}
            onNotificationClick={handleNotificationClick}
          />
        )}
        
        <main className={isESignEditorOpen ? 'flex-1 overflow-hidden' : 'flex-1 overflow-y-auto'}>
          {currentView === 'dashboard' && userRole === 'Tenant Admin' && (
            <OrgAdminDashboard 
              onNavigateToWorkspaceWithFilter={(workspaceId, filter) => {
                // Navigate to workspace with filter applied
                // In a real app, fetch workspace details from API using workspaceId
                const mockWorkspace: Workspace = {
                  id: workspaceId,
                  dealId: null,
                  name: 'Compliance & Audit Workspace',
                  status: 'Active',
                  lastUpdated: '01/07/2026',
                  documentsCount: 12,
                  createdBy: 'Sarah Mitchell'
                };
                setSelectedWorkspace(mockWorkspace);
                setNewWorkspaceId(workspaceId);
                setNewWorkspaceName(mockWorkspace.name);
                setNewWorkspaceDescription('');
                setNewWorkspaceDealId(null);
                setNewWorkspaceDocuments([]);
                setInitialWorkspaceTab('exchanges'); // Navigate to exchanges tab
                setCurrentView('workspace-details');
                // Store filter to apply in workspace exchanges view
                console.log(`Navigate to workspace ${workspaceId} with filter: ${filter}`);
              }}
              onNavigateToExchangeDetail={(workspaceId, exchangeId) => {
                // Navigate to exchange detail within workspace context
                // First set the workspace context
                const mockWorkspace: Workspace = {
                  id: workspaceId,
                  dealId: null,
                  name: 'Compliance & Audit Workspace',
                  status: 'Active',
                  lastUpdated: '01/07/2026',
                  documentsCount: 12,
                  createdBy: 'Sarah Mitchell'
                };
                setSelectedWorkspace(mockWorkspace);
                setNewWorkspaceId(workspaceId);
                setNewWorkspaceName(mockWorkspace.name);
                
                // Then set the exchange and navigate
                const mockExchange: Exchange = {
                  id: exchangeId,
                  title: 'Q4 Financial Review - Board Approval',
                  status: 'Active',
                  createdBy: 'Sarah Mitchell',
                  createdDate: '01/07/2026',
                  lastModified: '01/07/2026',
                  participants: 3,
                  documentsCount: 5,
                  requiresSignature: true,
                  riskLevel: 'Medium'
                };
                setSelectedExchange(mockExchange);
                setCurrentView('exchange-detail');
              }}
            />
          )}
          {currentView === 'dashboard' && userRole === 'Primary Operations User' && (
            <PrimaryOperationalDashboard />
          )}
          {currentView === 'workspaces' && (
            <>
              <WorkspaceListView 
                onOpenWorkspace={handleOpenWorkspace}
                onCreateWorkspace={handleCreateWorkspace}
                userRole={userRole}
              />
              <CreateWorkspaceView 
                open={showCreateWorkspaceModal}
                onClose={handleCloseCreateWorkspaceModal}
                onCreate={handleWorkspaceCreated}
              />
              <ImportFromDealertrackView
                open={showImportDealertrackModal}
                onClose={() => setShowImportDealertrackModal(false)}
                onImport={handleWorkspaceImported}
              />
            </>
          )}
          {currentView === 'workspace-details' && (
            <WorkspaceDetailsView
              workspaceId={newWorkspaceId}
              workspaceName={newWorkspaceName}
              description={newWorkspaceDescription}
              initialDocuments={newWorkspaceDocuments}
              dealId={newWorkspaceDealId}
              onBack={() => setCurrentView('workspaces')}
              initialTab={initialWorkspaceTab}
              userRole={userRole}
              onESignEditorStateChange={setIsESignEditorOpen}
            />
          )}
          {currentView === 'import-documents' && (
            <ImportDocumentsView
              workspaceId={newWorkspaceId || 'WS-2003'}
              dealId={newWorkspaceDealId ?? ''}
              onBack={handleBackToWorkspaces}
              onContinue={handleContinueToPrepare}
            />
          )}
          {currentView === 'prepare-sharing' && (
            <PrepareForSharingView
              workspaceId={newWorkspaceId}
              dealId={newWorkspaceDealId ?? ''}
              onBack={handleBackToWorkspaces}
              onSubmit={handleSubmitForApproval}
            />
          )}
          {/* 
            REMOVED: Standalone Exchanges view (violates workspace-centric model)
            All exchanges must be accessed through workspace context
            If this view is accessed, redirect to workspaces listing
          */}
          {currentView === 'exchanges' && (
            <div className="flex-1 flex items-center justify-center bg-neutral-50 p-8">
              <div className="max-w-md text-center">
                <h2 className="text-2xl font-bold text-neutral-900 mb-2">No Direct Exchange Access</h2>
                <p className="text-neutral-600 mb-6">
                  Exchanges must be accessed through their workspace context. Please select a workspace first.
                </p>
                <button
                  onClick={() => setCurrentView('workspaces')}
                  className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors cursor-pointer"
                >
                  View Workspaces
                </button>
              </div>
            </div>
          )}
          {currentView === 'exchange-detail' && selectedExchange && (
            <ExchangeDetailView exchange={selectedExchange} onBack={handleBackToExchanges} userRole={userRole} />
          )}
          {currentView === 'audit-log' && (
            userRole === 'Primary Operations User' 
              ? <PrimaryOperationalAuditLogs />
              : <TenantAdminAuditLogs />
          )}
          {currentView === 'documents' && <DocumentsView userRole={userRole} />}
          {currentView === 'clients' && <ClientsView />}
          {currentView === 'settings' && (userRole === 'Primary Operations User' ? <AccessRestrictedView /> : <SettingsView activeTab="org" />)}
          {currentView === 'settings-org' && (userRole === 'Primary Operations User' ? <AccessRestrictedView /> : <SettingsView activeTab="org" />)}
          {currentView === 'settings-roles' && (userRole === 'Primary Operations User' ? <AccessRestrictedView /> : <SettingsView activeTab="roles" />)}
          {currentView === 'settings-users' && (userRole === 'Primary Operations User' ? <AccessRestrictedView /> : <SettingsView activeTab="users" />)}
          {currentView === 'settings-integrations' && (userRole === 'Primary Operations User' ? <AccessRestrictedView /> : <SettingsView activeTab="integrations" />)}
          {currentView === 'decision-review' && selectedDocument && (
            <DecisionReviewView
              document={selectedDocument}
              onBack={handleBackToDashboard}
            />
          )}
          {/*
            'decision-review-detail' has no render branch: DecisionReviewScreen
            requires a DecisionReviewData (workspaceId, dealId, decisionState,
            documents, recipients, accessConfig) that nothing in App builds. It
            was previously rendered with `exchange`/`onBack`, which are not its
            props, so `data` was undefined. Wire it up once a source exists.
          */}
          {currentView === 'profile' && (
            <ProfileView
              userName={userRole === 'Primary Operations User' ? 'James Rodriguez' : 'Sarah Mitchell'}
              userRole={userRole === 'Primary Operations User' ? 'Primary Operations User' : 'Tenant Admin'}
              userEmail={userRole === 'Primary Operations User' ? 'james.rodriguez@acmefinancial.com' : 'sarah.mitchell@acmefinancial.com'}
              orgName="Acme Financial Services"
            />
          )}
        </main>
      </div>

      <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
        <SheetContent side="left" className="p-0 w-64 border-r-[#243F4D] bg-[#153240]">
          <Sidebar 
            currentView={currentView} 
            onNavigate={(v) => {
              setCurrentView(v);
              setIsMobileMenuOpen(false);
            }}
            className="w-full h-full"
            userRole={userRole}
          />
        </SheetContent>
      </Sheet>
    </div>
  );
}