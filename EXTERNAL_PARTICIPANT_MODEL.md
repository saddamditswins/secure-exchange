# External Participant Access Model

## Overview

External Participants in Secure Exchange operate on a **link-based access model** with **no platform login required**. This document defines the external participant roles, access patterns, and enforcement rules.

---

## A. External Participant Model (No Login)

### Core Principles

* **No Platform Login**: External participants never create accounts or log into the platform
* **Link-Based Access**: All access is granted via secure, unique links
* **OTP/Email Verification**: Identity verification occurs at the link level (if configured)
* **Scoped Access**: External participants can only access what is explicitly granted via their link
* **Time-Bound**: All external links have expiration dates
* **Revocable**: Internal users can revoke access at any time
* **Fully Auditable**: All external participant actions are logged

### Access Restrictions

External participants:
- ✅ Can access specific Secure Share or E-Sign flows
- ❌ Cannot see internal UI, navigation, or listings
- ❌ Cannot access dashboard or settings
- ❌ Cannot see other exchanges or workspaces
- ❌ Cannot view other participants' information (except in same-link E-Sign flows)

### Role Assignment

External roles are **system-defined**, **non-editable**, and **not visible** in internal Roles & Permissions.

Role type is **implicitly assigned** based on:
- Secure Share configuration (upload enabled or not)
- E-Sign configuration (single link vs per-participant link)
- Access settings configured by the internal user

---

## B. External Role Group 1 — Secure Share

Used when documents are shared without requiring signatures.

### 1.1 Secure Share — Without Upload

**Capabilities:**
- View shared documents
- Download documents (only if allowed in access settings)

**Restrictions:**
- ❌ No document upload
- ❌ No signing
- ❌ No access to other exchanges
- ❌ No internal navigation

**Use Cases:**
- Documents shared for **review only**
- Read-only information sharing
- Board member document distribution

---

### 1.2 Secure Share — With Upload

**Capabilities:**
- View shared documents
- Download documents (if allowed)
- Upload documents back to the exchange

**Restrictions:**
- ❌ No signing
- ❌ No document editing or replacement
- ❌ Uploads only apply to the current exchange
- ❌ Cannot upload to other exchanges

**Use Cases:**
- External party must **submit documents** back
- Form collection (applications, proofs, supporting documents)
- Two-way document exchange

---

## C. External Role Group 2 — E-Sign

Used when documents require legally binding signatures.

### 2.1 E-Sign — All Participants (Same Link, One by One)

**Capabilities:**
- Access signing documents via **one shared signing link**
- Participants sign **sequentially** (one after another)
- Only the active signer can interact with fields
- Other participants see a waiting state

**Restrictions:**
- ❌ No access to other participants' personal data
- ❌ No upload beyond signing fields
- ❌ No editing of documents
- ❌ Cannot skip signing order

**Use Cases:**
- Single controlled signing link preferred
- Sequential signing workflow required
- Board resolutions with ordered approval

---

### 2.2 E-Sign — Per Participant Link

**Capabilities:**
- Each participant receives a **unique signing link**
- Participant can sign only their assigned fields
- Signing order enforced by system configuration
- Independent access for each signer

**Restrictions:**
- ❌ No visibility into other participants
- ❌ No document upload beyond signing fields
- ❌ No navigation or dashboard access
- ❌ Cannot see other participants' signatures or data

**Use Cases:**
- Strong separation of signer access required
- Privacy-sensitive signing scenarios
- Individual accountability requirements

---

## D. Assignment & Enforcement Rules

### Role Assignment Logic

External role type is **implicitly assigned** based on configuration:

```
IF exchange_type === "Secure Share"
  IF upload_enabled === true
    ASSIGN: Secure Share — With Upload
  ELSE
    ASSIGN: Secure Share — Without Upload
  END
ELSE IF exchange_type === "E-Sign"
  IF link_type === "single_shared_link"
    ASSIGN: E-Sign — All Participants (Same Link)
  ELSE IF link_type === "per_participant_link"
    ASSIGN: E-Sign — Per Participant Link
  END
END
```

### Enforcement Points

1. **Link Generation**: Role capabilities are encoded in the secure link
2. **OTP Verification**: Identity verification scoped to link access
3. **UI Rendering**: Only permitted actions are displayed
4. **API Validation**: Backend enforces role restrictions
5. **Audit Logging**: All actions logged with role context

### Roles Are NOT:

- ❌ Selectable in user management
- ❌ Editable by internal users
- ❌ Visible in Roles & Permissions matrix
- ❌ Assignable via account creation

---

## E. UI & Copy Rules (External Experience)

### Display Rules

**DO NOT display role names** to external users. Instead, use task-focused language:

❌ **Wrong**: "Your role is: Secure Share — With Upload"
✅ **Right**: "You can view, download, and upload documents"

### UI Must Be:

- **Minimal**: Show only what the user can do
- **Task-Focused**: Clear actions (View, Download, Upload, Sign)
- **Progress-Oriented**: Show completion status clearly
- **Time-Aware**: Display expiration prominently

### Messaging Examples

**For Secure Share (View Only):**
- "You have been granted access to view these documents"
- "Access expires January 15, 2025"

**For Secure Share (With Upload):**
- "You can view shared documents and upload your own"
- "Upload your supporting documents below"

**For E-Sign:**
- "Please review and sign the documents below"
- "Your signature is required on 3 documents"
- "All participants have signed. Package complete."

### No Internal Concepts

External UI should **never mention**:
- ❌ Workspaces
- ❌ Internal permissions
- ❌ System roles
- ❌ Dashboard or navigation
- ❌ Audit logs
- ❌ Settings

---

## F. Current Implementation

### Components

The following components implement the external participant experience:

1. **ExternalVerificationScreen.tsx**
   - OTP-based identity verification
   - Dark-themed, minimal UI
   - 5-screen verification flow
   - No login credentials required

2. **ExternalDocumentViewer.tsx**
   - Document viewing and interaction
   - Tab-based: Received vs Uploaded documents
   - Task-focused actions (View, Download, Sign, Upload)
   - No navigation chrome or internal UI elements

3. **ExternalLinkLanding.tsx**
   - Initial landing page for secure links
   - Identity verification prompt
   - No account creation

### Access Flow

```
1. External user receives email with secure link
2. User clicks link → ExternalLinkLanding
3. System prompts for identity verification
4. OTP sent to user's email → ExternalVerificationScreen
5. User enters OTP code
6. System validates and grants access → ExternalDocumentViewer
7. User performs allowed actions (view/upload/sign)
8. System logs all actions for audit
9. Access expires or is revoked
```

### Role Switcher (Demo Only)

The `RoleSwitcher.tsx` component includes "External Participant" as a demo option to preview the external experience. **This is for development and demonstration purposes only.**

In production:
- External participants never see the role switcher
- External participants never log in
- Access is granted only via secure links

---

## G. Security Considerations

### Link Security

- **Unique tokens**: Each link contains a cryptographically secure token
- **One-time use**: Links can be configured for single-use
- **Expiration**: All links have expiration timestamps
- **IP restrictions**: Optional IP whitelist can be applied
- **Device binding**: Optional device fingerprinting

### OTP Verification

- **6-digit codes**: Numeric codes sent via email
- **Time-limited**: Codes expire after 10 minutes
- **Rate-limited**: Maximum 3 attempts before lockout
- **Resend throttling**: 60-second cooldown between resends

### Audit Trail

All external participant actions are logged:
- Link accessed (timestamp, IP, device)
- OTP requested/verified
- Documents viewed
- Documents downloaded
- Documents uploaded
- Signatures applied
- Package submitted

---

## H. Acceptance Criteria

✅ External users never log in
✅ Secure Share without Upload cannot upload or sign
✅ Secure Share with Upload can upload but cannot sign
✅ E-Sign flows enforce same-link sequential signing OR per-participant signing links
✅ All actions are scoped, revocable, and auditable
✅ External UI is minimal and task-focused
✅ No role names displayed to external users
✅ No internal navigation or concepts exposed
✅ All external access is time-bound and expirable
✅ OTP verification works correctly
✅ Audit logs capture all external participant actions

---

## I. Future Enhancements

Potential future improvements:

1. **Multi-factor authentication**: SMS or authenticator app support
2. **Biometric signing**: Touch ID / Face ID for signature capture
3. **Notarization integration**: Remote notary services
4. **Legal compliance**: eIDAS, UETA, ESIGN Act compliance certifications
5. **Advanced analytics**: External participant engagement metrics
6. **Automated reminders**: Email notifications for pending signatures
7. **Mobile optimization**: Native mobile apps for external participants

---

## J. Related Documentation

- `README.md` - Overall application architecture
- `ROLES_PERMISSIONS.md` - Internal role and permission system
- `AUDIT_LOG.md` - Audit trail and compliance logging
- `ESIGN_WORKFLOW.md` - E-signature process documentation
