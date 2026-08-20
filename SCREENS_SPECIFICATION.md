# Secure Exchange - Complete Screens Specification

**Last Updated:** January 1, 2026  
**Application:** Secure Exchange - B2B SaaS for Secure Document Sharing & E-Signing  
**Purpose:** Comprehensive guide to all screens, routes, and user flows

---

## 📋 Table of Contents
1. [Pre-Authentication Screens](#pre-authentication-screens)
2. [Tenant Admin Screens](#tenant-admin-screens)
3. [Primary Operational User Screens](#primary-operational-user-screens)
4. [Super Admin Screens](#super-admin-screens)
5. [External Participant Screens](#external-participant-screens)
6. [Shared Components](#shared-components)
7. [Modal & Overlay Screens](#modal--overlay-screens)

---

## 🔐 Pre-Authentication Screens

### SCREEN 001: Role Switcher
**Component:** `RoleSwitcher.tsx`  
**Route/State:** Initial entry point (`showRoleSwitcher = true`)  
**Access:** Anyone (demo environment only)

**Purpose:**  
Demo-only screen to select which role to experience the application as.

**Layout:**
- Centered card layout on neutral background
- 2x2 grid of role cards
- Each card shows role icon, title, description
- Demo credentials panel at bottom

**Role Options:**
1. **Super Admin** - Purple theme
2. **Tenant Admin** - Blue theme
3. **Primary Operational User** - Green theme
4. **External Participant** - Amber theme

**User Actions:**
- Click any role card → Sets `userRole` → Hides role switcher → Shows LoginView
- No authentication required (demo mode)

**Design Notes:**
- Includes informational banner about demo mode
- Shows demo credentials for each role
- Inspired by Stripe's clean, modern aesthetic

---

### SCREEN 002: Login & Authentication
**Component:** `LoginView.tsx`  
**Route/State:** `isAuthenticated = false`  
**Access:** After role selection

**Purpose:**  
Multi-step authentication flow with email/password + OTP verification.

**Sub-screens:**

#### SCREEN 002A: Email & Password Entry
**State:** `loginState = 'login'`

**Layout:**
- Centered card (max-width 448px)
- Logo and "Secure Exchange" branding
- Two input fields: Email, Password
- Primary CTA: "Sign In" button
- Info section about 2FA requirement

**User Actions:**
- Enter email + password
- Click "Sign In" → Transitions to OTP screen (`loginState = 'verify-otp'`)

#### SCREEN 002B: OTP Verification
**State:** `loginState = 'verify-otp'`

**Layout:**
- Same centered card
- 6-digit OTP input (individual boxes)
- Instructions text
- Primary CTA: "Verify & Continue"
- Secondary CTA: "Back to Sign In"
- "Resend code" link

**User Actions:**
- Enter 6-digit code (auto-advances between inputs)
- Click "Verify & Continue" → Sets `isAuthenticated = true` → Routes to role-specific portal
- Click "Back to Sign In" → Returns to login form

**Demo Credentials:**
- Email: `demo@example.com` or any email
- Password: `demo1234` or any password
- OTP: Any 6 digits

---

## 👤 Tenant Admin Screens

**Access:** `userRole = 'Tenant Admin'` AND `isAuthenticated = true`

**Layout Structure:**
- Left Sidebar (Sidebar.tsx) - Fixed 256px width
- Top Bar (TopBar.tsx) - Full width
- Main Content Area - Scrollable

**Organization Context:** "Acme Financial Services"  
**User:** Sarah Mitchell

---

### SCREEN 101: Dashboard (Tenant)
**Component:** `DashboardView.tsx`  
**Route/State:** `currentView = 'dashboard'`

**Purpose:**  
At-a-glance overview of workspace health, pending decisions, and document exchanges.

**Layout Sections:**

#### 1. Key Metrics (Top)
4-column grid of metric cards:
- **Active Workspaces** - Count with monthly trend
- **Pending Decisions** - Count with urgency indicator
- **External Shares** - Active share count
- **Compliance Score** - Percentage with status color

#### 2. Interactive Charts (Row 1)
**Left:** Risk Distribution (Donut Chart)
- Data: High (12), Medium (23), Low (45)
- Interactive hover tooltips
- Click segments to filter

**Right:** Document Status (Bar Chart)
- X-axis: Status categories (Active, Pending, Completed, etc.)
- Y-axis: Document count
- Interactive hover tooltips
- Horizontal bars with color coding

#### 3. Pending Reviews Table (Row 2)
**Columns:**
- Workspace ID
- Document Name
- Recipient (external email)
- Risk Level (badge with color)
- Expiry Date
- Status
- Actions (Review button)

**Features:**
- Risk level filter dropdown (All, High, Medium, Low)
- Sortable columns
- Clickable rows → Navigate to decision review
- Shows 6+ documents with scroll

**User Actions:**
- Click "Review" → Opens `DecisionReviewScreen.tsx`
- Filter by risk level
- View all pending items requiring attention

---

### SCREEN 102: Workspaces List
**Component:** `WorkspaceListView.tsx`  
**Route/State:** `currentView = 'workspaces'`

**Purpose:**  
Central hub for managing all document workspaces.

**Layout:**

#### Header Section
- Title: "Workspaces"
- Search bar (filter workspaces)
- Two action buttons:
  - "Create New Workspace" (primary)
  - "Import from Dealertrack" (secondary)

#### Status Tabs
- All
- Draft
- Pending Approval
- Active
- Completed

#### Workspace Cards
Grid layout (2-3 columns responsive)

**Each Card Contains:**
- Workspace ID (e.g., "WS-2024-003")
- Workspace Name
- Status badge
- Document count
- Last updated timestamp
- Created by user name
- Deal ID (if imported from Dealertrack)
- Primary CTA: "Open Workspace"

**User Actions:**
- Click "Create New Workspace" → Opens `CreateWorkspaceView` modal
- Click "Import from Dealertrack" → Opens `ImportFromDealertrackView` modal
- Click workspace card or "Open Workspace" → Navigate to `WorkspaceDetailsView`
- Switch tabs to filter by status
- Search workspaces by ID or name

---

### SCREEN 103: Workspace Details (Stabilized)
**Component:** `WorkspaceDetailsView.tsx`  
**Route/State:** `currentView = 'workspace-details'`

**Purpose:**  
Complete workspace management interface with document handling, sharing, and audit trail.

**Layout:**

#### Header Bar
- Back button (← Workspaces)
- Workspace ID + Name
- Deal ID badge (if applicable)
- Status dropdown
- Workspace actions menu (⋮)

#### Tab Navigation
5 tabs with counts:
1. **Documents** (primary) - Shows document count
2. **Exchanges** - Shows active exchanges
3. **eSign Requests** - Shows pending signatures
4. **Activity** - Recent activity count
5. **Audit Trail** - Full audit log

---

#### TAB 1: Documents

**Toolbar:**
- "Upload Documents" button
- Bulk select checkbox
- View mode toggle (list/grid)
- Filter dropdown
- Search documents

**Document Table:**
**Columns:**
- Checkbox (for bulk actions)
- Document Name
- Type (PDF, DOCX, etc.)
- Size
- Status (Ready, Processing, Error)
- Uploaded By
- Uploaded Date
- Actions dropdown (⋮)

**Bulk Actions Bar (when items selected):**
- "X documents selected"
- "Secure Share" button
- "Share & eSign" button
- "Download All" button
- "Delete" button
- "Deselect All" link

**Per-Document Actions:**
- View/Download
- Secure Share
- Share & eSign
- Delete

**User Actions:**
- Upload documents (drag-drop or file picker)
- Select individual or multiple documents
- Click "Secure Share" → Opens `SecureShareModal`
- Click "Share & eSign" → Opens `ShareAndESignModal`
- Download documents
- Delete documents (with confirmation)

---

#### TAB 2: Exchanges

**Layout:**  
List of active document shares

**Each Exchange Card:**
- Document name
- Share type badge ("Secure Share" or "eSign")
- Recipients (email addresses, collapsed if 3+)
- Access level (View Only, Download, Sign Required)
- Status (Active, Expired, Revoked, Completed)
- Expiry date with countdown
- Shared date + by whom
- Actions: View Details, Revoke Access, Extend Expiry

**Filters:**
- Status: All, Active, Expired, Completed
- Share Type: All, Secure Share, eSign
- Date Range

**Empty State:**  
"No documents shared yet. Share documents to create exchanges."

---

#### TAB 3: eSign Requests

**Layout:**  
Cards showing signature packets

**Each Packet Card:**
- Packet ID
- Document name(s)
- Participant list with status icons
  - ✓ Signed (green)
  - ⏳ Pending (amber)
  - ✗ Declined (red)
- Overall status (Draft, In Progress, Completed, Cancelled, Expired)
- Sent date
- Completion date (if applicable)
- Actions: View Details, Send Reminder, Cancel Request

**Status Breakdown:**
- Total participants
- Signed count / Total count
- Progress bar

**Actions:**
- "Create New eSign Request" button (top right)
- Click packet → View detailed signature status
- Send reminders to pending signers

---

#### TAB 4: Activity

**Layout:**  
Timeline of recent workspace activities

**Activity Items:**
- Timestamp (relative: "2 hours ago", "Yesterday")
- Actor (user name + avatar)
- Action type icon
- Action description
- Target (document/exchange name)
- Outcome indicator

**Activity Types:**
- Document uploaded
- Document shared
- eSign request sent
- Document signed
- Access revoked
- Workspace status changed
- Decision approved/denied

**Filters:**
- All Activities
- Document Changes
- Sharing Events
- eSign Events
- Administrative Actions

---

#### TAB 5: Audit Trail

**Layout:**  
Comprehensive audit log table

**Columns:**
- Timestamp (precise datetime)
- Actor (internal user or external participant)
- Actor Type (badge)
- Event Type
- Target (document/exchange ID)
- Outcome (Success, Failed, Pending)
- Details (expandable)
- IP Address (collapsed by default)

**Filters:**
- Date Range picker
- Actor Type: All, Internal, External
- Event Type dropdown
- Outcome: All, Success, Failed
- Search by actor or target

**Features:**
- Export to CSV
- Real-time updates
- Expandable details row
- Immutable record (no edit/delete)

---

### SCREEN 104: Clients Management
**Component:** `ClientsView.tsx`  
**Route/State:** `currentView = 'clients'`

**Purpose:**  
Manage external participants and recurring client relationships.

**Layout:**

#### Header
- Title: "External Clients"
- Search bar
- "Add Client" button

#### Client Table
**Columns:**
- Name
- Email
- Organization
- Status (Active, Inactive)
- Total Exchanges
- Last Activity
- Actions

**Features:**
- Search/filter clients
- Click row → View client detail (all exchanges with this client)
- Add new client (pre-populate for future shares)
- Deactivate client (revokes all active shares)

**Client Detail View:**
- Client info card
- All exchanges with this client
- Activity history
- Quick share button

---

### SCREEN 105: Audit Log (Tenant-Level)
**Component:** `AuditLogView.tsx`  
**Route/State:** `currentView = 'audit-log'`

**Purpose:**  
Organization-wide audit trail across all workspaces.

**Layout:**

#### Filter Panel (Left Sidebar or Top Bar)
- Date Range (preset: Last 7 days, Last 30 days, Custom)
- User Filter (All Users, Specific User)
- Event Type (All, Document, Exchange, eSign, Decision)
- Outcome (All, Success, Failed, Pending)
- Risk Level (All, High, Medium, Low)
- Search box

#### Audit Table
**Columns:**
- Timestamp
- User (avatar + name)
- Event Type (icon + label)
- Description
- Target (workspace/document ID)
- Outcome (badge)
- Risk Level (if applicable)
- Details (expand icon)

**Features:**
- Real-time updates
- Export to CSV
- Expandable detail rows
- Pagination
- Visual timeline view toggle

**Event Types:**
- Workspace created
- Document uploaded
- Document shared
- eSign sent/completed
- Decision approved/denied
- Access revoked
- Settings changed

---

### SCREEN 106: Settings
**Component:** `SettingsView.tsx`  
**Route/State:** `currentView = 'settings'`

**Purpose:**  
Organization and user settings management.

**Tab Sections:**

#### 1. Organization Settings
- Organization name
- Logo upload
- Time zone
- Date format
- Language

#### 2. Security Settings
- Password policy
- Session timeout
- Two-factor authentication requirements
- IP allowlist
- SSO configuration (if available)

#### 3. Notification Settings
- Email notifications
  - Document shared
  - eSign completed
  - Decision required
  - Expiry warnings
- In-app notifications
- Digest frequency

#### 4. Workspace Defaults
- Default expiry period (days)
- Auto-archive after completion
- Document retention policy
- Default risk assessment

#### 5. Integration Settings
- Dealertrack API configuration
- Webhook endpoints
- API keys management

**User Actions:**
- Update settings (with "Save Changes" button)
- Test integrations
- Regenerate API keys

---

### SCREEN 107: User Profile
**Component:** `ProfileView.tsx`  
**Route/State:** `currentView = 'profile'`  
**Access:** Click user avatar/name in TopBar

**Purpose:**  
Personal user profile and account settings.

**Layout:**

#### Profile Header
- Avatar (large, editable)
- Full name
- Role badge (Tenant Admin)
- Email address
- Organization name

#### Profile Sections

**Personal Information:**
- Full name
- Email
- Phone number
- Job title
- Department

**Security:**
- Change password
- Two-factor authentication status
- Active sessions (with "Sign out all other sessions")
- Login history

**Preferences:**
- Email notification preferences
- Dashboard layout preferences
- Default filters

**Activity:**
- Recent actions
- Workspaces created
- Decisions made

**Actions:**
- Save changes
- Sign out

---

## 🛠️ Primary Operational User Screens

**Access:** `userRole = 'Primary Operational User'` AND `isAuthenticated = true`

**Differences from Tenant Admin:**
- Same sidebar navigation
- Same screen access (Dashboard, Workspaces, Clients, Audit, Settings)
- **No access to:** Decision review/approval functions
- **Focus:** Creating workspaces, uploading documents, preparing for sharing
- **User:** James Rodriguez
- **Organization:** Acme Financial Services

**Unique Capabilities:**
- Can create workspaces
- Can upload documents
- Can prepare documents for sharing
- **Cannot:** Approve/deny sharing decisions
- Documents go to "Pending Review" status when submitted

**All screens identical to Tenant Admin except:**
- Decision review UI elements are hidden or disabled
- Dashboard shows "Workspaces Created" instead of "Pending Decisions"
- Some workflow endpoints show "Submitted for approval" instead of immediate share

---

## 👑 Super Admin Screens

**Access:** `userRole = 'Super Admin'` AND `isAuthenticated = true`

**Layout Structure:**
- Left Sidebar (SuperAdminSidebar.tsx) - Fixed 256px
- Top Bar (TopBar.tsx) - Full width
- Main Content Area - Scrollable

**Context:** Platform-level administration (multi-tenant)  
**User:** Administrator

---

### SCREEN 201: Platform Dashboard
**Component:** `SuperAdminDashboard.tsx`  
**Route/State:** `superAdminView = 'dashboard'`

**Purpose:**  
Platform-wide health monitoring and metrics.

**Layout:**

#### Key Metrics Row (4 Cards)
1. **Total Organizations**
   - Count: 142
   - Trend: "+8 this month"
   - Icon: Building

2. **Active Users**
   - Count: 3,847
   - Trend: "+234 this week"
   - Icon: Users

3. **Platform Activity**
   - Uptime: 98.7%
   - Period: "(30d)"
   - Icon: Activity

4. **Storage Usage**
   - Used: 2.4 TB
   - Total: "of 10 TB"
   - Icon: HardDrive

#### Charts Row

**Regional Distribution (Bar Chart):**
- X-axis: Regions (US-East, US-West, EU-West, APAC, Other)
- Y-axis: Organization count
- Interactive tooltips with counts and percentages
- Horizontal bars with color gradient

**User Activity Trend (Line Chart):**
- X-axis: Days of week (Mon-Sun)
- Y-axis: Active users count
- Line: Daily active users
- Hover tooltips showing exact counts
- 7-day view with trend indication

#### Recent Organizations Table
**Columns:**
- Organization name
- Region
- Created (relative time)
- Status badge
- Quick actions (View Details)

**Features:**
- Shows 4 most recent
- "View All" link → Navigate to Organizations

#### Platform Alerts (if any)
- System notifications
- Critical alerts
- Maintenance schedules

---

### SCREEN 202: Organizations Management
**Component:** `SuperAdminOrganizations.tsx`  
**Route/State:** `superAdminView = 'organizations'`

**Purpose:**  
Manage all tenant organizations on the platform.

**Layout:**

#### Header
- Title: "Organizations"
- Search bar (search by name, region, admin email)
- Filter dropdowns: Status, Region
- "Create Organization" button (primary)

#### Organizations Table
**Columns:**
- Organization Name
- Region (badge with flag/icon)
- Status (Active/Inactive badge)
- Admin Email
- Created Date
- User Count
- Exchange Count
- Storage Used
- Actions (View, Edit, Suspend)

**Features:**
- Sortable columns
- Pagination (25 per page)
- Quick filters (Active, Inactive, All)
- Bulk actions (if multiple selected)
- Export to CSV

**User Actions:**
- Click "Create Organization" → Opens `SuperAdminCreateTenant` in side sheet
- Click organization row → Navigate to `SuperAdminTenantDetail`
- Click "Edit" → Open edit sheet
- Click "Suspend" → Confirmation dialog → Suspend organization

---

### SCREEN 203: Create Organization (Sheet)
**Component:** `SuperAdminCreateTenant.tsx`  
**Display:** Right-side sheet overlay (600px wide)  
**Trigger:** "Create Organization" button from Organizations screen

**Purpose:**  
Configure and provision a new tenant organization.

**Layout:**

#### Sheet Header
- Title: "Create Organization"
- Description: "Configure a new organization environment."
- Close button (X)

#### Form Sections (Scrollable)

**1. Organization Details**
- Organization Name (required)
- Region (dropdown: US-East, US-West, EU-West, APAC, etc.)
- Industry Type (dropdown)
- Organization Size (Small, Medium, Large, Enterprise)

**2. Administrator Account**
- Admin First Name
- Admin Last Name
- Admin Email (required)
- Admin Phone

**3. Configuration**
- Subscription Tier (Free, Pro, Enterprise)
- Storage Quota (GB)
- User Limit
- Feature Toggles:
  - Enable eSign Integration (toggle)
  - Enable Dealertrack Integration (toggle)
  - Enable API Access (toggle)
  - Enable SSO (toggle)
  - Enable Audit Export (toggle)
  - Enable Custom Branding (toggle)

**4. Security Settings**
- Enforce 2FA (toggle)
- IP Allowlist (text area)
- Session Timeout (minutes)
- Password Policy (dropdown)

#### Footer Actions
- "Cancel" button (closes sheet)
- "Create Organization" button (primary, validates and creates)

**User Actions:**
- Fill form
- Toggle features
- Click "Create Organization" → Validates → Creates org → Shows success toast → Closes sheet → Returns to Organizations list
- Click "Cancel" → Closes sheet without saving

---

### SCREEN 204: Organization Detail
**Component:** `SuperAdminTenantDetail.tsx`  
**Route/State:** `superAdminView = 'organization-detail'`  
**Trigger:** Click organization from list

**Purpose:**  
Detailed view and management of a specific tenant organization.

**Layout:**

#### Header
- Back button (← Organizations)
- Organization name
- Status badge (Active/Inactive)
- Actions dropdown: Edit, Suspend, Delete, View as Admin

#### Tab Navigation
5 tabs:
1. **Overview**
2. **Users**
3. **Activity**
4. **Settings**
5. **Billing** (if applicable)

---

#### TAB: Overview

**Organization Info Card:**
- Name
- Region
- Created date
- Admin contact
- Status
- Subscription tier

**Metrics Row (4 cards):**
- Total Users
- Active Workspaces
- Total Documents
- Storage Used / Quota

**Recent Activity:**
- Last 10 activities in this organization
- Timestamps
- User actions

**Usage Chart:**
- Monthly active users (line chart)
- Document volume (bar chart)

---

#### TAB: Users

**User Management Table:**
**Columns:**
- User Name
- Email
- Role (Admin, Operational User)
- Status (Active, Inactive)
- Last Login
- Actions (Edit Role, Suspend, Impersonate)

**Actions:**
- "Invite User" button
- Search users
- Filter by role
- Bulk actions

---

#### TAB: Activity

**Organization-wide Audit Log:**
- Same format as tenant audit log
- All activities across this organization
- Export capability

---

#### TAB: Settings

**Editable Organization Settings:**
- Organization info
- Feature toggles (same as creation)
- Security settings
- Integration configurations
- Custom branding (if enabled)

**Actions:**
- Save changes
- Reset to defaults

---

#### TAB: Billing

**Subscription Information:**
- Current plan
- Billing cycle
- Next renewal date
- Payment method
- Invoice history

**Usage Metrics:**
- Users: X / Y limit
- Storage: X GB / Y GB quota
- API calls (if applicable)

**Actions:**
- Upgrade/downgrade plan
- Update payment method
- View invoices

---

### SCREEN 205: Platform Users
**Component:** `SuperAdminUsers.tsx`  
**Route/State:** `superAdminView = 'users'`

**Purpose:**  
Manage all users across all organizations.

**Layout:**

#### Header
- Title: "Platform Users"
- Search bar (name, email, organization)
- Filters: Organization, Role, Status
- Total user count

#### Users Table
**Columns:**
- User Name (avatar + name)
- Email
- Organization
- Role (badge)
- Status (Active, Inactive, Suspended)
- Last Login
- Created Date
- Actions (View, Edit, Suspend, Impersonate)

**Features:**
- Advanced search
- Multi-column sort
- Pagination
- Export to CSV
- Bulk operations

**User Actions:**
- Click user → View user detail (all activities)
- Edit user (change role, status)
- Suspend user (with reason)
- Impersonate user (for support)

---

### SCREEN 206: Platform Audit Logs
**Component:** `SuperAdminAuditLogs.tsx`  
**Route/State:** `superAdminView = 'audit-logs'`

**Purpose:**  
Comprehensive platform-wide audit trail.

**Layout:**

#### Advanced Filters Panel
- Date Range (preset or custom)
- Organization (dropdown, multi-select)
- User (search)
- Event Type (all platform events)
- Event Category (Authentication, Authorization, Data Access, Configuration, etc.)
- Outcome (Success, Failed, Pending)
- Severity (Info, Warning, Critical)

#### Audit Events Table
**Columns:**
- Timestamp (precise)
- Organization
- User (name + email)
- Event Type (icon + label)
- Event Category
- Description
- Outcome (badge)
- Severity (badge)
- IP Address
- Details (expandable)

**Advanced Features:**
- Real-time streaming updates
- Export to CSV/JSON
- Retention policy display
- Compliance report generation
- Anomaly detection highlights

**Event Types:**
- Organization created/modified/suspended
- User created/modified/suspended
- Authentication events (login, logout, failed attempts)
- Authorization changes (role changes, permissions)
- Data access (document views, downloads)
- Configuration changes (settings modified)
- API access
- Integration events

---

## 🔗 External Participant Screens

**Access:** `userRole = 'External Participant'` AND email link click

**Flow:** Email Link → OTP Verification → Document Viewer → Submission

---

### SCREEN 301: OTP Verification (External)
**Component:** `ExternalOTPVerification.tsx`  
**Route/State:** `externalAccessState = 'otp'`  
**Trigger:** Click email link (direct entry point)

**Purpose:**  
Verify external recipient identity before granting document access.

**Layout:**

#### Context Banner (Top)
- Sender information: "Shared by [Sender Name]"
- Organization: "[Organization Name]"
- Purpose: Identity verification

#### Main Content (Centered)
- Logo: Secure Exchange
- Title: "Verify Your Identity"
- Recipient email displayed: "[email]"
- Instructions: "Enter the 6-digit code sent to your email"

#### OTP Input
- 6 individual input boxes
- Auto-focus and auto-advance
- Numeric only
- Backspace navigation

#### Actions
- "Verify & Continue" button (primary)
- "Resend Code" link
- "Cancel" link (rare, closes window)

**User Actions:**
- Enter OTP code
- Click "Verify & Continue" → Validates code → Sets `externalAccessState = 'viewer'` → Shows `ExternalDocumentViewer`
- Click "Resend Code" → Sends new OTP
- Click "Cancel" → Closes window or returns to safe state

**Security Features:**
- Code expires in 10 minutes
- Max 5 attempts
- Rate limiting on resend

**Context Display:**
- Shows sender name and organization throughout
- Helps prevent phishing (user can verify expected sender)

---

### SCREEN 302: Document Viewer & Submission (External)
**Component:** `ExternalDocumentViewer.tsx`  
**Route/State:** `externalAccessState = 'viewer'`  
**Access:** After successful OTP verification

**Purpose:**  
Allow external participants to view, sign, and submit documents.

**Layout:**

#### Header Bar
- Logo: Secure Exchange
- Workspace ID (e.g., "EX-2024-0145")
- Recipient email
- Expiry countdown badge (e.g., "Expires in 14 days")
- Sign Out button

#### Main 2-Column Layout

**Left Sidebar (30%):**
**Document List Panel**
- Section title: "Documents"
- List of documents:
  - Document name
  - Type badge (PDF, DOCX, ZIP)
  - Signature indicator (if required)
    - ✓ Signed (green check)
    - ⚠ Signature Required (amber alert)
    - — View Only (gray)
  - Click to select/preview

**Upload Section:**
- "Upload Counter-Signed Documents" (if applicable)
- Drag-drop zone
- File picker button
- Shows uploaded files with remove option

**Right Content Area (70%):**
**Document Preview Pane**
- Selected document title
- Document type indicator
- File size
- Download button
- Document preview/viewer (PDF renderer)

**Signature Section (if required):**
- "Signature Required" banner
- Signature canvas or text input
- "Add Signature" button → Opens signature modal
- Signature preview once signed

#### Floating Footer Bar
- Progress indicator: "X of Y documents signed"
- "Submit All" button (primary, disabled until requirements met)
- "Save Draft" button (if partial completion allowed)

---

#### Document States

**View-Only Document:**
- Download enabled
- No signature required
- Check mark shown when viewed

**Signature-Required Document:**
- Cannot proceed without signature
- "Add Signature" button prominent
- Shows signature placement indicators

**Already Signed Document:**
- Green check mark
- Shows signature timestamp
- Signature preview visible
- Cannot re-sign (shows "Signed by you on [date]")

---

#### Signature Modal (Overlay)

**3 Signature Methods:**
1. **Draw:** Canvas for drawing signature
2. **Type:** Text input with signature font
3. **Upload:** Upload image file (PNG, JPG)

**Controls:**
- Clear/Redo
- Color picker (if draw mode)
- Font selector (if type mode)
- "Save Signature" button
- "Cancel" button

---

#### Submission Flow

**Pre-Submission Checklist:**
- All required documents signed ✓
- Counter-signed documents uploaded (if required) ✓
- Review checkbox: "I confirm the information is accurate"

**Click "Submit All":**
1. Validation check
2. Confirmation dialog:
   - "Are you sure you want to submit?"
   - "You won't be able to make changes after submission."
   - "Cancel" / "Confirm Submission"
3. If confirmed → Processing state
4. Success screen

---

### SCREEN 303: Submission Success (External)
**State:** `isSubmitted = true` (within ExternalDocumentViewer)

**Layout:**

**Centered Success Card:**
- Large green checkmark icon
- Title: "Submission Complete"
- Message: "Your documents and signatures have been successfully submitted. You can now close this window."
- "Return to Home" button (or "Close Window")

**Features:**
- No further actions available
- Session is terminated
- Documents are locked
- Sender receives notification

**User Actions:**
- Click "Return to Home" → Reloads page to landing state
- Close browser tab

---

## 🔄 Shared Components

### TopBar (All Authenticated Screens)
**Component:** `TopBar.tsx`

**Layout:**
- Left: Organization name (or "Secure Exchange Platform" for Super Admin)
- Right: User menu
  - User name
  - Role badge
  - Avatar
  - Dropdown:
    - Profile
    - Settings (if applicable)
    - Help & Support
    - Sign Out

**Variations:**
- Tenant/Operational User: Shows org name "Acme Financial Services"
- Super Admin: Shows "Secure Exchange Platform"

---

### Sidebar (Tenant/Operational User)
**Component:** `Sidebar.tsx`

**Navigation Items:**
1. Dashboard
2. Workspaces
3. Clients
4. Audit Log
5. Settings

**Active State:**
- Dark background (neutral-900)
- White text

**Inactive State:**
- Transparent background
- Gray text (neutral-700)
- Hover: Light gray background (neutral-100)

---

### SuperAdminSidebar (Super Admin)
**Component:** `SuperAdminSidebar.tsx`

**Logo Section:**
- Secure Exchange logo
- "Platform Admin" subtitle

**Navigation Items:**
1. Dashboard
2. Organizations
3. Users
4. Audit Logs

**Styling:**
- Same active/inactive states as tenant sidebar
- Vertical navigation
- Icons + labels

---

## 📦 Modal & Overlay Screens

### MODAL 401: Create Workspace
**Component:** `CreateWorkspaceView.tsx`  
**Type:** Sheet/Side Panel (right side, 540px)  
**Trigger:** "Create New Workspace" button from Workspaces screen

**Layout:**

**Sheet Header:**
- Title: "Create Workspace"
- Description: "Create a new workspace for document management"
- Close button (X)

**Form Sections:**

1. **Workspace Information**
   - Workspace Name (required)
   - Description (optional, textarea)

2. **Document Upload**
   - Drag-drop zone
   - "Browse files" button
   - File list (uploaded documents)
   - File type/size display
   - Remove buttons per file

**Footer:**
- "Cancel" button
- "Create Workspace" button (primary)

**User Actions:**
- Enter name & description
- Upload documents (optional)
- Click "Create Workspace" → Creates workspace → Navigates to `WorkspaceDetailsView`
- Click "Cancel" → Closes sheet

---

### MODAL 402: Import from Dealertrack
**Component:** `ImportFromDealertrackView.tsx`  
**Type:** Sheet/Side Panel (right side, 540px)  
**Trigger:** "Import from Dealertrack" button from Workspaces screen

**Layout:**

**Sheet Header:**
- Title: "Import from Dealertrack"
- Description: "Import deal data and documents from Dealertrack"
- Close button (X)

**Form:**

1. **Deal Search**
   - Deal ID input
   - "Search" button
   - Or: Customer name search

2. **Deal Selection (after search)**
   - Deal details preview card:
     - Deal ID
     - Customer name
     - Deal date
     - Document count preview
   - "Import Documents" checklist (select which docs to import)

3. **Workspace Options**
   - Workspace name (pre-filled with deal info, editable)
   - Additional notes (optional)

**Footer:**
- "Cancel" button
- "Import Workspace" button (primary)

**User Actions:**
- Enter deal ID → Search
- Select documents to import
- Click "Import Workspace" → Creates workspace with linked deal ID → Imports documents → Navigates to `WorkspaceDetailsView`
- Click "Cancel" → Closes sheet

---

### MODAL 403: Secure Share
**Component:** `SecureShareModal.tsx`  
**Type:** Dialog (centered, 600px max-width)  
**Trigger:** "Secure Share" button from WorkspaceDetailsView or document actions

**Layout:**

**Modal Header:**
- Title: "Secure Share"
- Close button (X)

**Form:**

1. **Recipients**
   - Email input (supports multiple, comma-separated)
   - "Add Recipient" button
   - Recipient chips (with remove X)

2. **Access Settings**
   - Access Level (dropdown):
     - View Only
     - Download Allowed
   - Expiry Date (date picker)
   - Message to recipients (textarea, optional)

3. **Security Options**
   - Require email verification (checkbox)
   - Notify me on access (checkbox)
   - Watermark documents (checkbox, if available)

**Preview:**
- Shows selected documents
- Recipients count
- Expiry summary

**Footer:**
- "Cancel" button
- "Share Documents" button (primary)

**User Actions:**
- Add recipients
- Configure settings
- Click "Share Documents" → Creates exchange → Sends notification emails → Shows success toast → Closes modal
- Click "Cancel" → Closes modal

---

### MODAL 404: Share & eSign
**Component:** `ShareAndESignModal.tsx`  
**Type:** Multi-step wizard dialog (centered, 700px max-width)  
**Trigger:** "Share & eSign" button from WorkspaceDetailsView

**Step 1: Add Participants**
- Participant list (add multiple)
- Each participant:
  - Name
  - Email
  - Signing order (sequential or parallel)
  - Remove button

**Step 2: Configure Signature Fields**
- Opens `ESignEditorView` component
- Document preview with signature field placement
- Add signature, initial, date, text fields
- Assign fields to specific participants

**Step 3: Message & Settings**
- Subject line
- Message to participants
- Expiry date
- Reminder settings (frequency)

**Step 4: Review & Send**
- Summary of participants
- Summary of signature fields
- Summary of settings
- "Send for Signature" button

**User Actions:**
- Add participants → Next
- Place signature fields → Next
- Configure message → Next
- Review → Send for Signature
- Can go back to previous steps
- Cancel at any step

---

### MODAL 405: eSign Editor
**Component:** `ESignEditorView.tsx`  
**Type:** Full-screen overlay or large modal  
**Trigger:** From ShareAndESignModal step 2

**Layout:**

**Toolbar (Top):**
- Document navigation (if multiple)
- Field type buttons:
  - Signature
  - Initials
  - Date
  - Text Input
  - Checkbox
- Participant selector (assign field to participant)
- Zoom controls
- "Done" / "Cancel" buttons

**Main Canvas:**
- Document preview (PDF rendering)
- Drag-and-drop field placement
- Field outlines with participant color-coding
- Resize handles on selected fields

**Right Panel:**
- Field Properties:
  - Field type
  - Assigned participant
  - Required/Optional toggle
  - Field label
  - Validation (if applicable)
- Field List (all placed fields)
  - Click to select/edit
  - Delete button per field

**User Actions:**
- Select field type
- Click or drag on document to place
- Assign to participant
- Adjust size/position
- Set properties
- Delete fields
- Click "Done" → Returns to ShareAndESignModal with field data
- Click "Cancel" → Discards changes

---

### MODAL 406: Decision Review (Approval)
**Component:** `DecisionReviewScreen.tsx`  
**Type:** Full-screen view (not modal)  
**Trigger:** Click "Review" on pending document from Dashboard

**Layout:**

**Header:**
- Back button (← Dashboard)
- Document title
- Workspace ID
- Status badge

**Main Content (3-column layout):**

**Left Column (30%):**
**Decision Summary Card:**
- Workspace ID
- Document name
- External recipient
- Requested by (internal user)
- Request date
- Expiry date
- Risk level (prominent badge)

**Risk Factors List:**
- Bullet points of detected risk factors
- Severity indicators

**Center Column (50%):**
**Document Preview:**
- PDF viewer or document preview
- Download button
- Full screen toggle

**Right Column (20%):**
**Decision Panel:**

**Risk Assessment Section:**
- Automated risk score
- Risk factors (expandable)
- Recommendations

**Decision Actions:**
- "Approve" button (green)
- "Deny" button (red)
- "Request More Info" button (gray)

**Conditional Approval Options (if Approve):**
- Add conditions (textarea)
- Modify expiry date
- Add restrictions

---

**Decision Flow:**

**Click "Approve":**
1. Opens confirmation modal:
   - "Approve this document share?"
   - Optional: Add conditions
   - "Cancel" / "Confirm Approval"
2. If confirmed → Document status → "Approved" → Share created → Email sent to recipient
3. Shows success toast
4. Returns to Dashboard

**Click "Deny":**
1. Opens denial modal:
   - "Deny this document share?"
   - Reason required (textarea)
   - "Cancel" / "Confirm Denial"
2. If confirmed → Document status → "Denied" → Email sent to requester
3. Shows success toast
4. Returns to Dashboard

**Click "Request More Info":**
1. Opens info request modal:
   - "Request additional information"
   - Questions/concerns (textarea)
   - "Cancel" / "Send Request"
2. If confirmed → Status → "Pending Info" → Email sent to requester
3. Returns to Dashboard

---

## 🎯 Navigation & Routing Summary

### Tenant/Operational User Routes
```
/dashboard              → DashboardView
/workspaces             → WorkspaceListView
/workspaces/:id         → WorkspaceDetailsView
/clients                → ClientsView
/audit-log              → AuditLogView
/settings               → SettingsView
/profile                → ProfileView
/decision-review        → DecisionReviewView
/decision-review/:id    → DecisionReviewScreen
```

### Super Admin Routes
```
/admin/dashboard        → SuperAdminDashboard
/admin/organizations    → SuperAdminOrganizations
/admin/organizations/:id → SuperAdminTenantDetail
/admin/users            → SuperAdminUsers
/admin/audit-logs       → SuperAdminAuditLogs
```

### External Participant Routes
```
/external/:token        → ExternalOTPVerification (direct entry)
/external/viewer/:token → ExternalDocumentViewer (after OTP)
```

---

## 📊 Screen Count Summary

- **Pre-Auth:** 2 screens (Role Switcher, Login)
- **Tenant/Operational:** 10+ screens
- **Super Admin:** 6+ screens
- **External Participant:** 3 screens (OTP, Viewer, Success)
- **Modals/Overlays:** 6 major modals
- **Total Unique Screens:** 25+

---

This specification covers all screens in the Secure Exchange application as of January 1, 2026. Use this document to understand user flows, screen layouts, and navigation patterns.
