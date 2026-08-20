# Secure Exchange - Role Permissions Matrix

**Last Updated:** January 1, 2026  
**Application:** Secure Exchange - B2B SaaS for Secure Document Sharing & E-Signing  
**Purpose:** Complete role-based access control (RBAC) specification

---

## 📋 Table of Contents
1. [Role Overview](#role-overview)
2. [Permission Definitions](#permission-definitions)
3. [Detailed Role Permissions](#detailed-role-permissions)
4. [Feature Access Matrix](#feature-access-matrix)
5. [Workflow Permissions](#workflow-permissions)
6. [Data Access Patterns](#data-access-patterns)

---

## 🎭 Role Overview

Secure Exchange implements a four-role permission system:

### 1. **Super Admin** (Platform Administrator)
**Scope:** Platform-wide (multi-tenant)  
**Purpose:** Platform management, tenant provisioning, system monitoring  
**User Count:** Very limited (1-5 platform administrators)  
**Example User:** Platform Administrator

**Key Characteristics:**
- Highest privilege level
- Multi-tenant access
- System configuration
- No direct document handling
- Monitoring and compliance focus

---

### 2. **Tenant Admin** (Organization Administrator)
**Scope:** Single organization (tenant)  
**Purpose:** Governance oversight, decision approval, policy management  
**User Count:** Limited (1-10 per organization)  
**Example User:** Sarah Mitchell (Acme Financial Services)

**Key Characteristics:**
- Organization-wide visibility
- Approve/deny sharing decisions
- Security and compliance oversight
- User management (within org)
- Can perform all operational user tasks

---

### 3. **Primary Operational User** (Standard User)
**Scope:** Single organization (tenant)  
**Purpose:** Day-to-day workspace and document management  
**User Count:** Unlimited (primary workforce)  
**Example User:** James Rodriguez (Acme Financial Services)

**Key Characteristics:**
- Create workspaces
- Upload and prepare documents
- Initiate sharing requests
- **Cannot** approve sharing decisions
- Documents require admin approval before sharing

---

### 4. **External Participant** (Guest User)
**Scope:** Document-specific (time-limited)  
**Purpose:** View or sign specific shared documents  
**User Count:** Unlimited external parties  
**Example User:** john.smith@boardmember.com

**Key Characteristics:**
- No login credentials (OTP-based access)
- Time-limited access (expires)
- Document-specific permissions
- No system navigation
- Read-only or sign-only access

---

## 🔐 Permission Definitions

### Permission Categories

#### 1. **System Access**
- `system.login` - Authenticate to the system
- `system.navigate` - Access navigation menus
- `system.view_dashboard` - View dashboard screens
- `system.manage_profile` - Edit own profile

#### 2. **Organization Management**
- `org.create` - Create new organizations
- `org.read` - View organization details
- `org.update` - Modify organization settings
- `org.delete` - Delete/suspend organizations
- `org.list_all` - View all organizations (cross-tenant)

#### 3. **User Management**
- `user.create` - Create new users
- `user.read` - View user details
- `user.update` - Modify user info and roles
- `user.delete` - Deactivate/delete users
- `user.impersonate` - Log in as another user
- `user.list_org` - View users in own organization
- `user.list_all` - View users across all organizations

#### 4. **Workspace Management**
- `workspace.create` - Create new workspaces
- `workspace.read` - View workspace details
- `workspace.update` - Edit workspace info
- `workspace.delete` - Delete workspaces
- `workspace.list_own` - View own workspaces
- `workspace.list_org` - View all org workspaces

#### 5. **Document Management**
- `document.upload` - Upload documents to workspace
- `document.read` - View/download documents
- `document.update` - Modify document metadata
- `document.delete` - Delete documents
- `document.preview` - Preview document content

#### 6. **Sharing & Exchange**
- `share.request` - Request to share documents
- `share.approve` - Approve sharing requests
- `share.deny` - Deny sharing requests
- `share.create_direct` - Share without approval
- `share.revoke` - Revoke active shares
- `share.extend` - Extend expiry dates
- `share.view_own` - View own shares
- `share.view_all` - View all org shares

#### 7. **E-Signature**
- `esign.create_request` - Create eSign requests
- `esign.send` - Send eSign requests
- `esign.sign` - Sign documents
- `esign.view_status` - View signature status
- `esign.cancel` - Cancel eSign requests
- `esign.remind` - Send reminders

#### 8. **Client Management**
- `client.create` - Add external clients
- `client.read` - View client details
- `client.update` - Edit client info
- `client.delete` - Remove clients
- `client.list` - View all clients

#### 9. **Audit & Compliance**
- `audit.view_own` - View own audit logs
- `audit.view_org` - View organization audit logs
- `audit.view_all` - View platform audit logs
- `audit.export` - Export audit logs
- `audit.configure_retention` - Set retention policies

#### 10. **Settings & Configuration**
- `settings.view` - View settings
- `settings.update_org` - Update org settings
- `settings.update_platform` - Update platform settings
- `settings.manage_integrations` - Configure integrations
- `settings.manage_security` - Configure security settings
- `settings.manage_features` - Enable/disable features

#### 11. **Reporting & Analytics**
- `report.view_dashboard` - View dashboard metrics
- `report.export_data` - Export reports
- `report.view_org_analytics` - View org analytics
- `report.view_platform_analytics` - View platform analytics

---

## 👥 Detailed Role Permissions

### 🟣 SUPER ADMIN

**Full Permission Set:**

#### System Access
✅ `system.login`  
✅ `system.navigate`  
✅ `system.view_dashboard` (Platform Dashboard)  
✅ `system.manage_profile`

#### Organization Management
✅ `org.create`  
✅ `org.read` (all organizations)  
✅ `org.update`  
✅ `org.delete`  
✅ `org.list_all`

#### User Management
✅ `user.create` (platform-wide)  
✅ `user.read` (all users)  
✅ `user.update` (all users)  
✅ `user.delete` (all users)  
✅ `user.impersonate`  
✅ `user.list_all`

#### Workspace Management
❌ `workspace.create` (not typical workflow)  
✅ `workspace.read` (view-only access for support)  
❌ `workspace.update`  
❌ `workspace.delete`  
✅ `workspace.list_org` (any org, for support)

#### Document Management
❌ `document.upload`  
✅ `document.read` (for support/audit)  
❌ `document.update`  
❌ `document.delete`  
✅ `document.preview` (for support/audit)

#### Sharing & Exchange
❌ `share.request`  
❌ `share.approve`  
❌ `share.deny`  
❌ `share.create_direct`  
✅ `share.revoke` (emergency/compliance)  
❌ `share.extend`  
✅ `share.view_all` (read-only, for audit)

#### E-Signature
❌ `esign.create_request`  
❌ `esign.send`  
❌ `esign.sign`  
✅ `esign.view_status` (read-only)  
❌ `esign.cancel`  
❌ `esign.remind`

#### Client Management
❌ `client.create`  
✅ `client.read` (view-only)  
❌ `client.update`  
❌ `client.delete`  
✅ `client.list` (read-only)

#### Audit & Compliance
✅ `audit.view_all` (platform-wide)  
✅ `audit.export` (all data)  
✅ `audit.configure_retention` (platform-level)

#### Settings & Configuration
✅ `settings.view` (all levels)  
❌ `settings.update_org` (managed by tenant admins)  
✅ `settings.update_platform`  
✅ `settings.manage_integrations` (platform-level)  
✅ `settings.manage_security` (platform-level)  
✅ `settings.manage_features` (feature toggles for orgs)

#### Reporting & Analytics
✅ `report.view_dashboard` (Platform Dashboard)  
✅ `report.export_data` (all data)  
✅ `report.view_platform_analytics`  
✅ `report.view_org_analytics` (any org)

---

### 🔵 TENANT ADMIN

**Full Permission Set:**

#### System Access
✅ `system.login`  
✅ `system.navigate`  
✅ `system.view_dashboard` (Tenant Dashboard)  
✅ `system.manage_profile`

#### Organization Management
❌ `org.create`  
✅ `org.read` (own organization only)  
✅ `org.update` (own organization only)  
❌ `org.delete`  
❌ `org.list_all`

#### User Management
✅ `user.create` (within own org)  
✅ `user.read` (within own org)  
✅ `user.update` (within own org)  
✅ `user.delete` (within own org)  
❌ `user.impersonate`  
✅ `user.list_org`  
❌ `user.list_all`

#### Workspace Management
✅ `workspace.create`  
✅ `workspace.read` (all in org)  
✅ `workspace.update` (all in org)  
✅ `workspace.delete` (all in org)  
❌ `workspace.list_own` (has broader access)  
✅ `workspace.list_org`

#### Document Management
✅ `document.upload`  
✅ `document.read` (all in org)  
✅ `document.update`  
✅ `document.delete`  
✅ `document.preview`

#### Sharing & Exchange
✅ `share.request` (can also request if needed)  
✅ `share.approve` ⭐ **KEY PERMISSION**  
✅ `share.deny` ⭐ **KEY PERMISSION**  
✅ `share.create_direct` (can bypass approval)  
✅ `share.revoke`  
✅ `share.extend`  
❌ `share.view_own` (has broader access)  
✅ `share.view_all` (all in org)

#### E-Signature
✅ `esign.create_request`  
✅ `esign.send`  
✅ `esign.sign` (can sign own requests)  
✅ `esign.view_status` (all in org)  
✅ `esign.cancel`  
✅ `esign.remind`

#### Client Management
✅ `client.create`  
✅ `client.read`  
✅ `client.update`  
✅ `client.delete`  
✅ `client.list`

#### Audit & Compliance
✅ `audit.view_org` (own org)  
✅ `audit.export` (own org)  
✅ `audit.configure_retention` (own org)

#### Settings & Configuration
✅ `settings.view`  
✅ `settings.update_org`  
❌ `settings.update_platform`  
✅ `settings.manage_integrations` (org-level)  
✅ `settings.manage_security` (org-level)  
❌ `settings.manage_features` (set by Super Admin)

#### Reporting & Analytics
✅ `report.view_dashboard` (Tenant Dashboard)  
✅ `report.export_data` (own org)  
✅ `report.view_org_analytics`  
❌ `report.view_platform_analytics`

---

### 🟢 PRIMARY OPERATIONAL USER

**Full Permission Set:**

#### System Access
✅ `system.login`  
✅ `system.navigate`  
✅ `system.view_dashboard` (Tenant Dashboard - modified view)  
✅ `system.manage_profile`

#### Organization Management
❌ `org.create`  
✅ `org.read` (own organization, basic info)  
❌ `org.update`  
❌ `org.delete`  
❌ `org.list_all`

#### User Management
❌ `user.create`  
✅ `user.read` (own profile + basic info of others)  
❌ `user.update` (except own profile)  
❌ `user.delete`  
❌ `user.impersonate`  
✅ `user.list_org` (view-only, for collaboration)  
❌ `user.list_all`

#### Workspace Management
✅ `workspace.create` ⭐ **KEY PERMISSION**  
✅ `workspace.read` (own + shared)  
✅ `workspace.update` (own only)  
✅ `workspace.delete` (own only, before approval)  
✅ `workspace.list_own`  
✅ `workspace.list_org` (view-only for collaboration)

#### Document Management
✅ `document.upload` ⭐ **KEY PERMISSION**  
✅ `document.read` (own workspaces)  
✅ `document.update` (own workspaces)  
✅ `document.delete` (own workspaces, before sharing)  
✅ `document.preview`

#### Sharing & Exchange
✅ `share.request` ⭐ **KEY PERMISSION**  
❌ `share.approve` ⭐ **MAJOR RESTRICTION**  
❌ `share.deny` ⭐ **MAJOR RESTRICTION**  
❌ `share.create_direct`  
✅ `share.revoke` (own shares only, if approved)  
❌ `share.extend` (must request via admin)  
✅ `share.view_own`  
✅ `share.view_all` (view-only, for awareness)

#### E-Signature
✅ `esign.create_request`  
❌ `esign.send` (requires approval)  
✅ `esign.sign` (if recipient)  
✅ `esign.view_status` (own requests)  
❌ `esign.cancel` (must request admin)  
❌ `esign.remind`

#### Client Management
✅ `client.create` (add new external contacts)  
✅ `client.read`  
✅ `client.update` (basic info)  
❌ `client.delete`  
✅ `client.list`

#### Audit & Compliance
✅ `audit.view_own` (own activities)  
✅ `audit.view_org` (view-only, limited)  
❌ `audit.export`  
❌ `audit.configure_retention`

#### Settings & Configuration
✅ `settings.view` (limited)  
❌ `settings.update_org`  
❌ `settings.update_platform`  
❌ `settings.manage_integrations`  
❌ `settings.manage_security`  
❌ `settings.manage_features`

#### Reporting & Analytics
✅ `report.view_dashboard` (limited metrics)  
❌ `report.export_data`  
❌ `report.view_org_analytics`  
❌ `report.view_platform_analytics`

---

### 🟡 EXTERNAL PARTICIPANT

**Full Permission Set:**

#### System Access
❌ `system.login` (uses OTP instead)  
❌ `system.navigate`  
❌ `system.view_dashboard`  
❌ `system.manage_profile`

**Special Access:**
✅ `system.verify_otp` - One-time password verification  
✅ `system.access_share` - Access specific shared documents

#### Organization Management
❌ All permissions denied

#### User Management
❌ All permissions denied

#### Workspace Management
❌ All permissions denied

#### Document Management
✅ `document.read` ⭐ **GRANTED** (specific documents only)  
✅ `document.preview` ⭐ **GRANTED** (specific documents only)  
❌ `document.upload` (exception: counter-signed documents, see below)  
❌ `document.update`  
❌ `document.delete`

**Special Document Permissions:**
✅ `document.upload_countersign` - Upload counter-signed documents back  
✅ `document.download` - Download shared documents (if allowed)

#### Sharing & Exchange
❌ All permissions denied (recipient only, not creator)

#### E-Signature
✅ `esign.sign` ⭐ **GRANTED** (assigned documents only)  
✅ `esign.view_status` (own signature status only)  
❌ `esign.create_request`  
❌ `esign.send`  
❌ `esign.cancel`  
❌ `esign.remind`

#### Client Management
❌ All permissions denied

#### Audit & Compliance
❌ `audit.view_own` (no audit access)  
❌ `audit.view_org`  
❌ `audit.export`  
❌ `audit.configure_retention`

**Note:** External participant actions ARE audited, but they cannot view audit logs.

#### Settings & Configuration
❌ All permissions denied

#### Reporting & Analytics
❌ All permissions denied

---

## 📊 Feature Access Matrix

| Feature | Super Admin | Tenant Admin | Operational User | External Participant |
|---------|-------------|--------------|------------------|----------------------|
| **Authentication** |
| Email/Password Login | ✅ | ✅ | ✅ | ❌ |
| OTP Verification (Login) | ✅ | ✅ | ✅ | ❌ |
| OTP Verification (External) | ❌ | ❌ | ❌ | ✅ |
| Two-Factor Auth | ✅ | ✅ | ✅ | N/A |
| **Dashboard** |
| View Dashboard | ✅ Platform | ✅ Tenant | ✅ Tenant (Limited) | ❌ |
| Interactive Charts | ✅ | ✅ | ✅ | ❌ |
| Pending Reviews | ❌ | ✅ | ⚠️ View Only | ❌ |
| **Workspaces** |
| Create Workspace | ❌ | ✅ | ✅ | ❌ |
| View Workspaces | ⚠️ Support | ✅ All | ✅ Own | ❌ |
| Edit Workspace | ❌ | ✅ All | ✅ Own | ❌ |
| Delete Workspace | ❌ | ✅ All | ✅ Own (Pre-Approval) | ❌ |
| Import from Dealertrack | ❌ | ✅ | ✅ | ❌ |
| **Documents** |
| Upload Documents | ❌ | ✅ | ✅ | ⚠️ Counter-Sign Only |
| View Documents | ⚠️ Support | ✅ All | ✅ Own Workspaces | ✅ Shared Only |
| Download Documents | ⚠️ Support | ✅ All | ✅ Own Workspaces | ⚠️ If Allowed |
| Delete Documents | ❌ | ✅ All | ✅ Own (Pre-Share) | ❌ |
| **Sharing** |
| Request Share | ❌ | ✅ | ✅ | ❌ |
| Approve Share | ❌ | ✅ | ❌ | ❌ |
| Deny Share | ❌ | ✅ | ❌ | ❌ |
| Direct Share (No Approval) | ❌ | ✅ | ❌ | ❌ |
| Revoke Share | ⚠️ Emergency | ✅ All | ✅ Own | ❌ |
| Extend Expiry | ❌ | ✅ | ❌ | ❌ |
| **E-Signature** |
| Create eSign Request | ❌ | ✅ | ✅ | ❌ |
| Send eSign Request | ❌ | ✅ | ⚠️ Requires Approval | ❌ |
| Sign Documents | ❌ | ✅ If Recipient | ✅ If Recipient | ✅ If Recipient |
| Cancel eSign | ❌ | ✅ All | ❌ | ❌ |
| Send Reminders | ❌ | ✅ | ❌ | ❌ |
| **Clients** |
| Add External Clients | ❌ | ✅ | ✅ | ❌ |
| View Clients | ⚠️ Read Only | ✅ | ✅ | ❌ |
| Edit Clients | ❌ | ✅ | ✅ Basic Info | ❌ |
| Delete Clients | ❌ | ✅ | ❌ | ❌ |
| **Audit Logs** |
| View Own Audit | ❌ | ✅ | ✅ | ❌ |
| View Org Audit | ❌ | ✅ | ⚠️ Limited | ❌ |
| View Platform Audit | ✅ | ❌ | ❌ | ❌ |
| Export Audit Logs | ✅ Platform | ✅ Org | ❌ | ❌ |
| **Settings** |
| View Settings | ✅ All | ✅ Org | ⚠️ Limited | ❌ |
| Edit Org Settings | ❌ | ✅ | ❌ | ❌ |
| Edit Platform Settings | ✅ | ❌ | ❌ | ❌ |
| Manage Integrations | ✅ Platform | ✅ Org | ❌ | ❌ |
| Configure Security | ✅ Platform | ✅ Org | ❌ | ❌ |
| **User Management** |
| Create Users | ✅ Platform | ✅ Org | ❌ | ❌ |
| Edit Users | ✅ All | ✅ Org | ❌ | ❌ |
| Delete Users | ✅ All | ✅ Org | ❌ | ❌ |
| Impersonate Users | ✅ | ❌ | ❌ | ❌ |
| **Organization Management** |
| Create Organizations | ✅ | ❌ | ❌ | ❌ |
| View Organizations | ✅ All | ✅ Own | ⚠️ Basic Info | ❌ |
| Edit Organizations | ✅ All | ✅ Own | ❌ | ❌ |
| Delete Organizations | ✅ | ❌ | ❌ | ❌ |
| **Reporting** |
| Export Data | ✅ Platform | ✅ Org | ❌ | ❌ |
| View Analytics | ✅ Platform | ✅ Org | ⚠️ Limited | ❌ |
| Generate Reports | ✅ Platform | ✅ Org | ❌ | ❌ |

**Legend:**
- ✅ Full Access
- ⚠️ Limited/Conditional Access
- ❌ No Access
- N/A Not Applicable

---

## 🔄 Workflow Permissions

### Workflow 1: Workspace Creation & Document Upload

| Step | Action | Super Admin | Tenant Admin | Operational User | External |
|------|--------|-------------|--------------|------------------|----------|
| 1 | Navigate to Workspaces | ⚠️ | ✅ | ✅ | ❌ |
| 2 | Click "Create Workspace" | ❌ | ✅ | ✅ | ❌ |
| 3 | Enter workspace details | ❌ | ✅ | ✅ | ❌ |
| 4 | Upload documents | ❌ | ✅ | ✅ | ❌ |
| 5 | Save workspace | ❌ | ✅ | ✅ | ❌ |

**Result:**
- **Tenant Admin:** Workspace created, status = "Draft" or "Active"
- **Operational User:** Workspace created, status = "Draft"

---

### Workflow 2: Secure Share Request & Approval

| Step | Action | Super Admin | Tenant Admin | Operational User | External |
|------|--------|-------------|--------------|------------------|----------|
| 1 | Select documents in workspace | ⚠️ | ✅ | ✅ | ❌ |
| 2 | Click "Secure Share" | ❌ | ✅ | ✅ | ❌ |
| 3 | Enter recipients | ❌ | ✅ | ✅ | ❌ |
| 4 | Configure settings (expiry, etc.) | ❌ | ✅ | ✅ | ❌ |
| 5 | Submit share request | ❌ | ✅ | ✅ | ❌ |
| 6 | **Approval Required?** | - | **NO** ✅ | **YES** ⚠️ | - |
| 7 | Review pending share | ❌ | ✅ | ❌ | ❌ |
| 8 | Approve/Deny decision | ❌ | ✅ | ❌ | ❌ |
| 9 | Share activated | ⚠️ | ✅ | ⚠️ After Approval | ❌ |
| 10 | Email sent to recipients | ⚠️ | ✅ | ⚠️ After Approval | ❌ |

**Result:**
- **Tenant Admin:** Direct share, no approval needed, email sent immediately
- **Operational User:** Share goes to "Pending Review," requires Tenant Admin approval

---

### Workflow 3: E-Sign Request Creation & Signing

| Step | Action | Super Admin | Tenant Admin | Operational User | External |
|------|--------|-------------|--------------|------------------|----------|
| 1 | Select documents | ⚠️ | ✅ | ✅ | ❌ |
| 2 | Click "Share & eSign" | ❌ | ✅ | ✅ | ❌ |
| 3 | Add participants | ❌ | ✅ | ✅ | ❌ |
| 4 | Place signature fields | ❌ | ✅ | ✅ | ❌ |
| 5 | Configure message | ❌ | ✅ | ✅ | ❌ |
| 6 | Send eSign request | ❌ | ✅ | ⚠️ Requires Approval | ❌ |
| 7 | **External receives email** | - | - | - | ✅ |
| 8 | External verifies OTP | ❌ | ❌ | ❌ | ✅ |
| 9 | External views document | ❌ | ❌ | ❌ | ✅ |
| 10 | External signs document | ❌ | ⚠️ If Participant | ⚠️ If Participant | ✅ |
| 11 | External submits | ❌ | ❌ | ❌ | ✅ |
| 12 | View completed signatures | ⚠️ | ✅ | ✅ Own Requests | ❌ |

**Result:**
- **Tenant Admin:** Can send immediately
- **Operational User:** Request goes to "Pending Approval" before sending
- **External Participant:** Can sign assigned documents

---

### Workflow 4: External Document Submission (Full Flow)

| Step | Action | Super Admin | Tenant Admin | Operational User | External |
|------|--------|-------------|--------------|------------------|----------|
| 1 | Share request approved/sent | ❌ | ✅ | ⚠️ Via Admin | ❌ |
| 2 | **External clicks email link** | - | - | - | ✅ |
| 3 | **Direct to OTP screen** | ❌ | ❌ | ❌ | ✅ |
| 4 | Enter OTP code | ❌ | ❌ | ❌ | ✅ |
| 5 | View document list | ❌ | ❌ | ❌ | ✅ |
| 6 | Preview documents | ❌ | ❌ | ❌ | ✅ |
| 7 | Download (if allowed) | ❌ | ❌ | ❌ | ⚠️ If Allowed |
| 8 | Sign documents (if required) | ❌ | ❌ | ❌ | ✅ |
| 9 | Upload counter-signed docs | ❌ | ❌ | ❌ | ⚠️ If Required |
| 10 | Submit all | ❌ | ❌ | ❌ | ✅ |
| 11 | View success message | ❌ | ❌ | ❌ | ✅ |
| 12 | Notification to internal user | ⚠️ | ✅ | ✅ If Owner | ❌ |
| 13 | View submission in workspace | ⚠️ | ✅ | ✅ If Owner | ❌ |

**Result:**
- **External Participant:** Successfully submits documents and signatures
- **Internal Users:** Notified of submission, can view completed documents

---

### Workflow 5: Decision Review & Approval

| Step | Action | Super Admin | Tenant Admin | Operational User | External |
|------|--------|-------------|--------------|------------------|----------|
| 1 | Operational User submits share | ❌ | ❌ | ✅ | ❌ |
| 2 | Document status → "Pending Review" | ⚠️ View | ✅ View | ✅ View | ❌ |
| 3 | Admin sees in Dashboard | ❌ | ✅ | ❌ | ❌ |
| 4 | Click "Review" | ❌ | ✅ | ❌ | ❌ |
| 5 | View document details | ❌ | ✅ | ❌ | ❌ |
| 6 | Review risk assessment | ❌ | ✅ | ❌ | ❌ |
| 7 | Make decision: Approve | ❌ | ✅ | ❌ | ❌ |
| 8 | Add conditions (optional) | ❌ | ✅ | ❌ | ❌ |
| 9 | Confirm approval | ❌ | ✅ | ❌ | ❌ |
| 10 | Status → "Approved" | ⚠️ View | ✅ | ✅ View | ❌ |
| 11 | Email sent to external recipient | ⚠️ | ✅ | ✅ Notification | ❌ |
| 12 | OR: Deny with reason | ❌ | ✅ | ❌ | ❌ |
| 13 | Status → "Denied" | ⚠️ View | ✅ | ✅ View | ❌ |
| 14 | Notification to requester | ❌ | ✅ | ✅ Receives | ❌ |

**Result:**
- **Tenant Admin:** Full decision authority
- **Operational User:** Can only request, not approve
- **Denied shares:** Operational User must revise and resubmit

---

## 🔍 Data Access Patterns

### Super Admin Data Scope
```
Platform
└── All Organizations
    └── All Workspaces (read-only)
        └── All Documents (read-only, for support)
            └── All Exchanges (read-only, for audit)
                └── All Users (full access)
```

**Visibility:** Everything (read-only for tenant data, full control for platform)

---

### Tenant Admin Data Scope
```
Own Organization
└── All Workspaces
    └── All Documents
        └── All Exchanges
            └── All Users (within org)
                └── All Audit Logs (within org)
```

**Visibility:** Everything within own organization (full control)

---

### Primary Operational User Data Scope
```
Own Organization
└── Own Workspaces + Shared Workspaces (view)
    └── Own Documents + Shared Documents (limited)
        └── Own Exchanges (+ view others)
            └── Own User Profile + View Others (basic)
                └── Own Audit Trail (+ limited org view)
```

**Visibility:** Own data + limited view of organization data

---

### External Participant Data Scope
```
Specific Share
└── Specific Documents (time-limited)
    └── No system visibility beyond share
```

**Visibility:** Only documents explicitly shared with them, time-limited

---

## 🚨 Permission Inheritance & Escalation

### Inheritance Rules

1. **Super Admin** inherits **NO** Tenant/Operational permissions
   - Operates at different scope (platform vs. tenant)
   - Must have separate tenant account to manage documents

2. **Tenant Admin** inherits **ALL** Primary Operational User permissions
   - Can perform all operational tasks
   - Plus: Approval authority

3. **Primary Operational User** inherits **NO** Tenant Admin permissions
   - Cannot approve own requests
   - Clear separation of duties

4. **External Participant** inherits **NOTHING**
   - Isolated access per share
   - No system context

---

### Permission Escalation (Not Implemented)

**Note:** Currently, there is no permission escalation mechanism. Users cannot temporarily elevate privileges.

**Future Consideration:**
- Operational User could request temporary approval authority
- Tenant Admin could delegate approval for specific documents
- Would require approval workflow and audit trail

---

## 🔒 Security Constraints

### Time-Based Restrictions

| Role | Restriction | Duration |
|------|-------------|----------|
| Super Admin | Session timeout | 30 minutes (configurable) |
| Tenant Admin | Session timeout | 30 minutes (configurable) |
| Operational User | Session timeout | 60 minutes (configurable) |
| External Participant | **Share expiry** | ⚠️ Set per share (e.g., 30 days) |
| External Participant | **OTP validity** | ⚠️ 10 minutes |
| External Participant | **Session timeout** | ⚠️ 2 hours (strict) |

---

### IP & Location Restrictions

| Role | Restriction Type | Configurable By |
|------|------------------|-----------------|
| Super Admin | IP allowlist | Platform Settings |
| Tenant Admin | IP allowlist | Organization Settings |
| Operational User | IP allowlist (inherited) | Organization Settings |
| External Participant | **No IP restriction** | N/A (must be accessible) |

---

### Device & Access Restrictions

| Role | Multi-Device Login | Concurrent Sessions |
|------|--------------------|---------------------|
| Super Admin | ✅ Allowed | Max 3 |
| Tenant Admin | ✅ Allowed | Max 5 |
| Operational User | ✅ Allowed | Unlimited |
| External Participant | ✅ Allowed | ⚠️ 1 per share (OTP-based) |

---

## 📝 Permission Change Log

### Version 1.0 (January 1, 2026)
- Initial role permission matrix
- Four-role system established
- Super Admin: Platform management focus
- Tenant Admin: Governance and approval authority
- Primary Operational User: Document management, requires approval
- External Participant: Time-limited, document-specific access

### Recent Changes
- **External flow streamlined:** Direct to OTP (no landing page)
- **Super Admin:** Read-only access to tenant data (support/audit)
- **Tenant Admin:** Full approval authority for all sharing
- **Operational User:** Must request approval for all external shares
- **External Participant:** OTP-only authentication (no credentials)

---

## 🎯 Permission Summary by Role

### Super Admin: "Platform Operator"
**Can:** Manage organizations, users (platform-wide), monitor health, configure platform  
**Cannot:** Directly handle documents, approve shares (wrong scope)  
**Focus:** Multi-tenant management, compliance, system health

### Tenant Admin: "Decision Maker"
**Can:** Approve/deny shares, manage org users, full workspace access, governance  
**Cannot:** Manage other organizations, platform settings  
**Focus:** Risk management, compliance oversight, decision authority

### Primary Operational User: "Document Worker"
**Can:** Create workspaces, upload docs, request shares, prepare documents  
**Cannot:** Approve shares, manage users, access platform settings  
**Focus:** Day-to-day operations, document preparation, workflow initiation

### External Participant: "Guest Viewer/Signer"
**Can:** View assigned documents, sign if required, upload counter-signed docs  
**Cannot:** Navigate system, access unrelated data, manage anything  
**Focus:** Complete assigned task (view/sign), limited time window

---

This role permission matrix defines all access controls in the Secure Exchange application as of January 1, 2026. Use this document to understand who can do what, and enforce proper security boundaries.
