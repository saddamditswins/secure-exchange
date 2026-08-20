# Secure Exchange - Application Tree Structure

**Last Updated:** January 1, 2026  
**Application:** Secure Exchange - B2B SaaS for Secure Document Sharing & E-Signing

## Overview
This document provides a complete component hierarchy and file structure for the Secure Exchange application, designed for easy sharing with ChatGPT or other AI assistants to understand the application architecture.

---

## 📁 Root File Structure

```
secure-exchange/
├── src/
│   ├── app/
│   │   ├── App.tsx                                    # Main application router & state manager
│   │   └── components/                                # All application components
│   │       ├── RoleSwitcher.tsx                       # Role selection screen
│   │       ├── LoginView.tsx                          # Authentication & OTP verification
│   │       │
│   │       ├── [TENANT/ADMIN PORTAL COMPONENTS]
│   │       ├── Sidebar.tsx                            # Tenant/Admin navigation sidebar
│   │       ├── TopBar.tsx                             # Shared top navigation bar
│   │       ├── DashboardView.tsx                      # Tenant dashboard with interactive charts
│   │       ├── ProfileView.tsx                        # User profile management
│   │       │
│   │       ├── [WORKSPACE MANAGEMENT]
│   │       ├── WorkspaceListView.tsx                  # List of all workspaces
│   │       ├── WorkspaceDetailsView.tsx               # Workspace detail & document management
│   │       ├── CreateWorkspaceView.tsx                # New workspace creation modal
│   │       ├── ImportFromDealertrackView.tsx          # Dealertrack integration import
│   │       ├── ImportDocumentsView.tsx                # Document upload/import screen
│   │       ├── PrepareForSharingView.tsx              # Document preparation workflow
│   │       │
│   │       ├── [EXCHANGE & SHARING]
│   │       ├── ExchangesView.tsx                      # Document exchanges list
│   │       ├── ExchangeDetailView.tsx                 # Exchange detail screen
│   │       ├── SecureShareModal.tsx                   # Secure share dialog
│   │       ├── ShareAndESignModal.tsx                 # E-Sign workflow modal
│   │       ├── ESignEditorView.tsx                    # E-signature editor/placement
│   │       │
│   │       ├── [CLIENT & DECISION MANAGEMENT]
│   │       ├── ClientsView.tsx                        # External client management
│   │       ├── DecisionReviewView.tsx                 # Decision queue list
│   │       ├── DecisionReviewScreen.tsx               # Individual decision review
│   │       │
│   │       ├── [AUDIT & SETTINGS]
│   │       ├── AuditLogView.tsx                       # Tenant audit log with filters
│   │       ├── SettingsView.tsx                       # Application settings
│   │       │
│   │       ├── [SUPER ADMIN PORTAL]
│   │       ├── SuperAdminSidebar.tsx                  # Super Admin navigation
│   │       ├── SuperAdminDashboard.tsx                # Platform-level metrics & charts
│   │       ├── SuperAdminTenantList.tsx               # Multi-tenant list (DEPRECATED - use Organizations)
│   │       ├── SuperAdminOrganizations.tsx            # Organization management list
│   │       ├── SuperAdminTenantDetail.tsx             # Organization detail view
│   │       ├── SuperAdminCreateTenant.tsx             # New organization creation form
│   │       ├── SuperAdminUsers.tsx                    # Platform user management
│   │       ├── SuperAdminAuditLogs.tsx                # Platform-level audit logs
│   │       │
│   │       ├── [EXTERNAL PARTICIPANT FLOW]
│   │       ├── ExternalLinkLanding.tsx                # (DEPRECATED - now direct to OTP)
│   │       ├── ExternalOTPVerification.tsx            # External user OTP entry screen
│   │       ├── ExternalDocumentViewer.tsx             # External document view/sign interface
│   │       │
│   │       ├── [SHARED UTILITIES]
│   │       ├── FeatureToggle.tsx                      # Reusable feature toggle component
│   │       │
│   │       ├── [UI COMPONENTS]
│   │       └── ui/                                    # shadcn/ui component library
│   │           ├── accordion.tsx
│   │           ├── alert-dialog.tsx
│   │           ├── alert.tsx
│   │           ├── aspect-ratio.tsx
│   │           ├── avatar.tsx
│   │           ├── badge.tsx
│   │           ├── breadcrumb.tsx
│   │           ├── button.tsx
│   │           ├── calendar.tsx
│   │           ├── card.tsx
│   │           ├── carousel.tsx
│   │           ├── chart.tsx                          # Recharts wrapper components
│   │           ├── checkbox.tsx
│   │           ├── collapsible.tsx
│   │           ├── command.tsx
│   │           ├── context-menu.tsx
│   │           ├── dialog.tsx
│   │           ├── drawer.tsx
│   │           ├── dropdown-menu.tsx
│   │           ├── form.tsx
│   │           ├── hover-card.tsx
│   │           ├── input-otp.tsx
│   │           ├── input.tsx
│   │           ├── label.tsx
│   │           ├── menubar.tsx
│   │           ├── navigation-menu.tsx
│   │           ├── pagination.tsx
│   │           ├── popover.tsx
│   │           ├── progress.tsx
│   │           ├── radio-group.tsx
│   │           ├── resizable.tsx
│   │           ├── scroll-area.tsx
│   │           ├── select.tsx
│   │           ├── separator.tsx
│   │           ├── sheet.tsx
│   │           ├── sidebar.tsx
│   │           ├── skeleton.tsx
│   │           ├── slider.tsx
│   │           ├── sonner.tsx
│   │           ├── switch.tsx
│   │           ├── table.tsx
│   │           ├── tabs.tsx
│   │           ├── textarea.tsx
│   │           ├── toggle-group.tsx
│   │           ├── toggle.tsx
│   │           ├── tooltip.tsx
│   │           ├── use-mobile.ts
│   │           └── utils.ts
│   │
│   └── styles/
│       ├── fonts.css                                  # Font imports (Google Fonts)
│       ├── index.css                                  # Main CSS entry
│       ├── tailwind.css                               # Tailwind imports
│       └── theme.css                                  # Design tokens & theme variables
│
├── package.json                                       # Dependencies & scripts
├── vite.config.ts                                     # Vite configuration
├── postcss.config.mjs                                 # PostCSS configuration
└── ATTRIBUTIONS.md                                    # Third-party attributions
```

---

## 🎯 Component Hierarchy by User Flow

### 1️⃣ **Application Entry & Authentication**
```
App.tsx (root)
├── RoleSwitcher.tsx                                   # Initial: Role selection
├── LoginView.tsx                                      # After role: Login + OTP
└── [Role-based Portal]
```

### 2️⃣ **Tenant Admin / Primary Operational User Portal**
```
App.tsx
└── [Authenticated Tenant User]
    ├── Sidebar.tsx                                    # Left navigation
    ├── TopBar.tsx                                     # Top bar with user menu
    └── [Main Content Area - ViewType routing]
        ├── DashboardView.tsx                          # view: 'dashboard'
        │   └── [Interactive Charts - Recharts]
        │       ├── Risk Distribution (Donut)
        │       ├── Document Status (Bar Chart)
        │       └── Pending Reviews Table
        │
        ├── WorkspaceListView.tsx                      # view: 'workspaces'
        │   ├── CreateWorkspaceView.tsx (modal)
        │   └── ImportFromDealertrackView.tsx (modal)
        │
        ├── WorkspaceDetailsView.tsx                   # view: 'workspace-details'
        │   ├── [Tabs: Documents | Exchanges | eSign | Activity | Audit]
        │   ├── SecureShareModal.tsx
        │   ├── ShareAndESignModal.tsx
        │   └── ESignEditorView.tsx
        │
        ├── ClientsView.tsx                            # view: 'clients'
        ├── AuditLogView.tsx                           # view: 'audit-log'
        ├── SettingsView.tsx                           # view: 'settings'
        ├── ProfileView.tsx                            # view: 'profile'
        │
        ├── ExchangesView.tsx                          # view: 'exchanges'
        └── ExchangeDetailView.tsx                     # view: 'exchange-detail'
```

### 3️⃣ **Super Admin Portal**
```
App.tsx
└── [Authenticated Super Admin]
    ├── SuperAdminSidebar.tsx                          # Left navigation
    ├── TopBar.tsx                                     # Top bar with user menu
    └── [Main Content Area - SuperAdminViewType routing]
        ├── SuperAdminDashboard.tsx                    # view: 'dashboard'
        │   └── [Interactive Charts]
        │       ├── Regional Distribution (Bar)
        │       ├── User Activity (Line)
        │       └── Platform Metrics
        │
        ├── SuperAdminOrganizations.tsx                # view: 'organizations'
        │   └── SuperAdminCreateTenant.tsx (sheet)
        │
        ├── SuperAdminTenantDetail.tsx                 # view: 'organization-detail'
        │
        ├── SuperAdminUsers.tsx                        # view: 'users'
        │
        └── SuperAdminAuditLogs.tsx                    # view: 'audit-logs'
```

### 4️⃣ **External Participant Flow**
```
App.tsx
└── [External Participant Role]
    ├── ExternalOTPVerification.tsx                    # Step 1: Email link → OTP entry
    │   └── [Shows sender context: name, org]
    │
    └── ExternalDocumentViewer.tsx                     # Step 2: View/sign documents
        ├── Document List Sidebar
        ├── Document Preview Pane
        ├── Upload Section (for counter-signed docs)
        └── Submit Button → Success Screen
```

---

## 🔄 State Management

### Main App State (in App.tsx)
```typescript
// Authentication & Role
- showRoleSwitcher: boolean
- isAuthenticated: boolean
- userRole: 'Super Admin' | 'Tenant Admin' | 'Primary Operational User' | 'External Participant'

// External Flow State
- externalAccessState: 'landing' | 'otp' | 'viewer'

// Tenant Portal Navigation
- currentView: ViewType
  ('dashboard' | 'workspaces' | 'workspace-details' | 'create-workspace' | 
   'import-documents' | 'prepare-sharing' | 'exchanges' | 'exchange-detail' | 
   'audit-log' | 'settings' | 'clients' | 'decision-review' | 
   'decision-review-detail' | 'profile')

// Super Admin Navigation
- superAdminView: SuperAdminViewType
  ('dashboard' | 'organizations' | 'create-organization' | 
   'organization-detail' | 'users' | 'audit-logs')

// Modal States
- showCreateOrgSheet: boolean
- showCreateWorkspaceModal: boolean
- showImportDealertrackModal: boolean

// Selected Items
- selectedExchange: Exchange | null
- selectedTenant: Tenant | null
- selectedOrganization: Organization | null
- selectedDocument: DocumentExchange | null
- selectedWorkspace: Workspace | null

// Workspace Creation State
- newWorkspaceId: string
- newWorkspaceName: string
- newWorkspaceDescription: string
- newWorkspaceDocuments: File[]
- newWorkspaceDealId: string | null
```

---

## 📊 Data Types & Interfaces

### Core Types (from App.tsx)
```typescript
// Views
type ViewType = 'dashboard' | 'workspaces' | 'workspace-details' | ...
type SuperAdminViewType = 'dashboard' | 'organizations' | 'users' | ...

// Document Exchange
type ExchangeStatus = 'Draft' | 'Active' | 'Approved' | 'Revoked' | 'Completed'

interface Exchange {
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

interface Workspace {
  id: string;
  dealId: string | null;
  name: string;
  status: 'Draft' | 'Pending Approval' | 'Active' | 'Completed';
  lastUpdated: string;
  documentsCount?: number;
  createdBy?: string;
}

interface Tenant / Organization {
  id: string;
  orgName: string;
  region: string;
  status: 'Active' | 'Inactive';
  createdDate: string;
  adminEmail: string;
  exchangeCount: number;
  userCount: number;
}
```

---

## 🎨 Design System & Styling

### Technology Stack
- **Framework:** React 18 + TypeScript
- **Styling:** Tailwind CSS v4.0
- **UI Components:** shadcn/ui (customized)
- **Charts:** Recharts (interactive charts with hover tooltips)
- **Icons:** Lucide React
- **Notifications:** Sonner (toast notifications)
- **Design Inspiration:** Stripe + Linear

### Theme & Colors
- **Primary:** Neutral (900 for primary actions, 50-100 for backgrounds)
- **Risk Levels:**
  - High: Red (red-500)
  - Medium: Amber (amber-500)
  - Low: Green (green-500)
- **Status Colors:**
  - Active/Success: Green
  - Warning/Expiring: Amber
  - Error/High Risk: Red
  - Info: Blue
  - Admin: Purple

### Typography
- All typography is defined in `/src/styles/theme.css`
- DO NOT use Tailwind font size/weight classes unless specifically changing from defaults
- Uses system font stack with fallbacks

---

## 🔌 Integration Points

### Current Integrations
1. **Dealertrack:** Document import via `ImportFromDealertrackView.tsx`
   - Simulates fetching deal data and documents
   - Creates workspace with linked deal ID

### Future Integration Points
- Supabase (for backend persistence)
- Identity providers (SSO/SAML)
- E-signature providers (DocuSign, Adobe Sign)
- Document storage (S3, Azure Blob)

---

## 📈 Interactive Features

### Dashboard Charts (Tenant)
1. **Risk Distribution** - Donut chart (PieChart from Recharts)
2. **Document Status** - Bar chart (BarChart from Recharts)
3. **Pending Reviews** - Interactive table with click-to-review

### Dashboard Charts (Super Admin)
1. **Regional Distribution** - Bar chart
2. **User Activity** - Line chart (7-day trend)
3. **Platform Metrics** - Cards with trends

### Interactive Tables
- Sortable columns
- Filterable rows (risk level, status, etc.)
- Clickable rows for navigation
- Hover states and tooltips

---

## 🚨 Recent Changes & Notes

### ✅ Recently Completed
- **External Flow Streamlined:** Users now go directly to `ExternalOTPVerification.tsx` instead of landing page
- **Interactive Charts Added:** Both Tenant and Super Admin dashboards now have Recharts components
- **Audit Log Redesigned:** Enhanced with better filtering and visualization
- **WorkspaceDetailsView Stabilized:** Multi-tab interface with document management
- **Theme Reverted:** Currently using default light theme (after temporary dark theme experiment)

### 🗑️ Deprecated Components
- `ExternalLinkLanding.tsx` - External users now go directly to OTP screen
- `SuperAdminTenantList.tsx` - Superseded by `SuperAdminOrganizations.tsx` (better naming)

### 🔄 Workflow Status
- **Workspace Creation:** ✅ Complete
- **Document Import:** ✅ Complete
- **Secure Sharing:** ✅ Complete
- **E-Sign Workflow:** ✅ Complete
- **External Submission:** ✅ Complete
- **Decision Review:** ✅ Complete
- **Audit Logging:** ✅ Complete (visual redesign done)
- **Super Admin Portal:** ✅ Complete with charts

---

## 📝 File Naming Conventions

- **Views:** `[Name]View.tsx` (e.g., `DashboardView.tsx`)
- **Screens:** `[Name]Screen.tsx` (e.g., `DecisionReviewScreen.tsx`)
- **Modals:** `[Name]Modal.tsx` (e.g., `SecureShareModal.tsx`)
- **Shared Components:** `[Name].tsx` (e.g., `Sidebar.tsx`, `TopBar.tsx`)
- **UI Components:** Lowercase kebab-case in `/ui/` folder (e.g., `button.tsx`, `alert-dialog.tsx`)

---

## 🔐 Protected Files

**DO NOT MODIFY:**
- `/src/app/components/figma/ImageWithFallback.tsx` - System protected component

---

This tree structure represents the complete application state as of January 1, 2026. Use this document to understand the full component architecture, data flow, and file organization of Secure Exchange.
