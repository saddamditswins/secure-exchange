/**
 * GLOBAL UI RULE: LISTING ACTIONS STANDARDIZATION
 * 
 * This rule ensures consistent, clean, and scalable action handling across
 * all listing views (tables, cards, grids) by preventing icon clutter and
 * maintaining clear visual hierarchy.
 * 
 * ========================================================================
 * RULE: ACTION BUTTON PATTERN
 * ========================================================================
 * 
 * IF a listing row has 1-2 actions:
 *   → Show actions as inline icons
 * 
 * IF a listing row has 3+ actions:
 *   → Collapse ALL actions into a single ellipsis (⋯) dropdown
 * 
 * ========================================================================
 * INLINE ACTIONS (≤ 2 actions)
 * ========================================================================
 * 
 * - Show actions directly as icon buttons
 * - Icons must:
 *   • Be consistent in size and style (w-4 h-4)
 *   • Have tooltips on hover (title attribute)
 *   • Use cursor-pointer
 *   • Use hover states (hover:text-neutral-900, hover:bg-neutral-100)
 * - No ellipsis shown in this case
 * 
 * Example (UsersSettings.tsx):
 * ```tsx
 * <div className="flex justify-end gap-2">
 *   <button
 *     onClick={(e) => handleEdit(user, e)}
 *     className="p-1.5 text-neutral-400 hover:text-neutral-900 rounded hover:bg-neutral-100 transition-colors cursor-pointer"
 *     title="Edit"
 *   >
 *     <Edit2 className="w-4 h-4" />
 *   </button>
 *   <button
 *     onClick={(e) => handleDelete(user, e)}
 *     className="p-1.5 text-neutral-400 hover:text-rose-600 rounded hover:bg-rose-50 transition-colors cursor-pointer"
 *     title="Delete"
 *   >
 *     <Trash2 className="w-4 h-4" />
 *   </button>
 * </div>
 * ```
 * 
 * ========================================================================
 * ELLIPSIS DROPDOWN (> 2 actions)
 * ========================================================================
 * 
 * When triggered:
 * - Replace ALL inline icons with a single ellipsis (⋯) icon
 * 
 * Ellipsis Behavior:
 * - On click: Open a compact dropdown menu
 * - List all available actions in a vertical list
 * - Each action must:
 *   • Have an icon + label
 *   • Follow consistent order: View → Edit → Download → Mark Complete → Delete/Revoke
 *   • Use cursor-pointer
 * - Destructive actions (e.g. Delete, Revoke):
 *   • Must be visually separated with DropdownMenuSeparator
 *   • Styled cautiously (text-rose-600 focus:text-rose-700 focus:bg-rose-50)
 * 
 * Example (DocumentsView.tsx):
 * ```tsx
 * <DropdownMenu>
 *   <DropdownMenuTrigger asChild>
 *     <button
 *       onClick={(e) => e.stopPropagation()}
 *       className="p-1.5 text-neutral-400 hover:text-neutral-900 rounded-lg hover:bg-neutral-100 transition-colors cursor-pointer"
 *     >
 *       <MoreHorizontal className="w-4 h-4" />
 *     </button>
 *   </DropdownMenuTrigger>
 *   <DropdownMenuContent align="end" className="w-48">
 *     <DropdownMenuItem onClick={handleView} className="cursor-pointer">
 *       <Eye className="w-4 h-4 mr-2" />
 *       Preview
 *     </DropdownMenuItem>
 *     <DropdownMenuItem onClick={handleDownload} className="cursor-pointer">
 *       <Download className="w-4 h-4 mr-2" />
 *       Download
 *     </DropdownMenuItem>
 *     <DropdownMenuItem onClick={handleEdit} className="cursor-pointer">
 *       <Edit2 className="w-4 h-4 mr-2" />
 *       Edit Metadata
 *     </DropdownMenuItem>
 *     <DropdownMenuSeparator />
 *     <DropdownMenuItem 
 *       onClick={handleDelete}
 *       className="cursor-pointer text-rose-600 focus:text-rose-700 focus:bg-rose-50"
 *     >
 *       <Trash2 className="w-4 h-4 mr-2" />
 *       Delete
 *     </DropdownMenuItem>
 *   </DropdownMenuContent>
 * </DropdownMenu>
 * ```
 * 
 * ========================================================================
 * WHERE THIS RULE APPLIES
 * ========================================================================
 * 
 * This rule must be enforced in:
 * ✅ Workspaces listing (WorkspaceListView.tsx) - Uses ellipsis (4 actions)
 * ✅ Exchanges listing (ExchangesView.tsx) - Uses ellipsis (3 actions)
 * ✅ Documents listing (DocumentsView.tsx) - Uses ellipsis (3-4 actions)
 * ✅ Participants listing (ExchangeDetailView.tsx) - Uses ellipsis (3 actions)
 * ✅ Users listing (UsersSettings.tsx) - Uses inline icons (2 actions)
 * ✅ Audit logs (AuditLogView.tsx) - Read-only, no actions
 * 
 * Future listings must follow this pattern.
 * 
 * ========================================================================
 * DESIGN & UX RULES
 * ========================================================================
 * 
 * ❌ NEVER mix inline icons and ellipsis together
 * ❌ Do not partially collapse actions
 * ❌ No disabled action icons (hide instead using conditional rendering)
 * ✅ Ellipsis icon should be subtle, not dominant
 * ✅ Dropdown must respect theme styling (light or dark)
 * ✅ Always include e.stopPropagation() in dropdown triggers to prevent row clicks
 * 
 * ========================================================================
 * ACCESSIBILITY
 * ========================================================================
 * 
 * ✅ Keyboard navigable (DropdownMenu handles this)
 * ✅ Focus states visible
 * ✅ Tooltips readable (title attribute for inline icons)
 * ✅ Semantic action order
 * 
 * ========================================================================
 * CONDITIONAL ACTIONS (Role-Based)
 * ========================================================================
 * 
 * When hiding actions based on user role (e.g., Primary Operations User):
 * - Use conditional rendering, not disabled states
 * - Keep destructive actions hidden when appropriate
 * 
 * Example:
 * ```tsx
 * {userRole !== 'Primary Operations User' && (
 *   <>
 *     <DropdownMenuSeparator />
 *     <DropdownMenuItem 
 *       onClick={handleDelete}
 *       className="cursor-pointer text-rose-600 focus:text-rose-700 focus:bg-rose-50"
 *     >
 *       <Trash2 className="w-4 h-4 mr-2" />
 *       Delete
 *     </DropdownMenuItem>
 *   </>
 * )}
 * ```
 * 
 * ========================================================================
 * FINAL OUTCOME
 * ========================================================================
 * 
 * ✅ Cleaner listings
 * ✅ Scalable action patterns
 * ✅ No visual noise
 * ✅ Consistent behavior across the platform
 * ✅ Enterprise-grade appearance
 */

export const UI_STANDARDS = {
  LISTING_ACTIONS: {
    INLINE_THRESHOLD: 2,
    ELLIPSIS_REQUIRED_ABOVE: 2,
    ICON_SIZE: 'w-4 h-4',
    BUTTON_PADDING: 'p-1.5',
    DROPDOWN_WIDTH: 'w-48'
  }
} as const;

/**
 * ========================================================================
 * WORKSPACE-CENTRIC NAVIGATION MODEL (NON-NEGOTIABLE)
 * ========================================================================
 * 
 * CRITICAL PRINCIPLE: Exchanges NEVER exist as a standalone page
 * 
 * ========================================================================
 * CANONICAL HIERARCHY
 * ========================================================================
 * 
 * Workspace
 *  └── Exchanges (listing within workspace)
 *       └── Exchange Detail
 *            ├── Documents
 *            ├── Participants
 *            ├── Activity
 *            ├── Evidence
 *            └── Settings
 * 
 * Every exchange is ALWAYS accessed via a workspace context.
 * 
 * ========================================================================
 * NAVIGATION RULES (STRICT)
 * ========================================================================
 * 
 * ❌ PROHIBITED:
 * - Standalone /exchanges route
 * - Global exchange listing page
 * - Any exchange access without workspaceId
 * - Direct navigation to exchange detail without workspace context
 * 
 * ✅ REQUIRED:
 * - All exchanges accessed via: /workspaces/{workspaceId}?tab=exchanges
 * - Exchange detail route: /workspaces/{workspaceId}/exchanges/{exchangeId}
 * - Workspace context must be set before viewing any exchange
 * - Breadcrumbs must show: Workspaces > {Workspace Name} > Exchanges > {Exchange Name}
 * 
 * ========================================================================
 * DASHBOARD WIDGET NAVIGATION (MANDATORY)
 * ========================================================================
 * 
 * All clickable elements in dashboards must navigate through workspaces:
 * 
 * A. KPI Cards
 * ```tsx
 * // ✅ Correct: Navigate to workspace with filter
 * <KPICard
 *   onClick={() => onNavigateToWorkspaceWithFilter(workspaceId, 'active')}
 * />
 * 
 * // ❌ Incorrect: Navigate to global exchanges page
 * <KPICard
 *   onClick={() => onNavigate('exchanges')}
 * />
 * ```
 * 
 * B. Table Rows (Recent Actions, Governance Events)
 * ```tsx
 * // ✅ Correct: Navigate to exchange detail with workspace context
 * <tr 
 *   onClick={() => onNavigateToExchangeDetail(workspaceId, exchangeId)}
 *   className="hover:bg-neutral-50 transition-colors cursor-pointer"
 * >
 *   <td>{exchangeId}</td>
 *   <td>{exchangeTitle}</td>
 * </tr>
 * 
 * // ❌ Incorrect: Navigate without workspace context
 * <tr onClick={() => onViewExchange(exchangeId)}>
 * ```
 * 
 * C. Chart Elements & AI Advisory Links
 * ```tsx
 * // ✅ Correct: Always route through workspace
 * <button onClick={() => handleKPIClick('flagged-items')}>
 *   Review flagged items →
 * </button>
 * 
 * // Where handleKPIClick does:
 * const handleKPIClick = (filter: string) => {
 *   onNavigateToWorkspaceWithFilter(DEFAULT_WORKSPACE_ID, filter);
 * };
 * ```
 * 
 * ========================================================================
 * CALLBACK SIGNATURES (STANDARD)
 * ========================================================================
 * 
 * interface DashboardProps {
 *   // Navigate to workspace exchanges with filter applied
 *   onNavigateToWorkspaceWithFilter?: (workspaceId: string, filter: string) => void;
 *   
 *   // Navigate to specific exchange within workspace
 *   onNavigateToExchangeDetail?: (workspaceId: string, exchangeId: string) => void;
 * }
 * 
 * ❌ DO NOT use these patterns:
 * - onNavigate?: (view: 'exchanges') => void  // No workspace context
 * - onViewExchange?: (exchangeId: string) => void  // Missing workspace
 * 
 * ========================================================================
 * IMPLEMENTATION EXAMPLE (App.tsx)
 * ========================================================================
 * 
 * ```tsx
 * <OrgAdminDashboard 
 *   onNavigateToWorkspaceWithFilter={(workspaceId, filter) => {
 *     // 1. Fetch or create workspace context
 *     const workspace = getWorkspace(workspaceId);
 *     setSelectedWorkspace(workspace);
 *     setNewWorkspaceId(workspaceId);
 *     setNewWorkspaceName(workspace.name);
 *     
 *     // 2. Navigate to workspace with exchanges tab active
 *     setInitialWorkspaceTab('exchanges');
 *     setCurrentView('workspace-details');
 *     
 *     // 3. Store filter for exchanges view
 *     console.log(`Filter: ${filter}`);
 *   }}
 *   onNavigateToExchangeDetail={(workspaceId, exchangeId) => {
 *     // 1. Set workspace context
 *     const workspace = getWorkspace(workspaceId);
 *     setSelectedWorkspace(workspace);
 *     setNewWorkspaceId(workspaceId);
 *     
 *     // 2. Set exchange
 *     const exchange = getExchange(exchangeId);
 *     setSelectedExchange(exchange);
 *     
 *     // 3. Navigate to exchange detail
 *     setCurrentView('exchange-detail');
 *   }}
 * />
 * ```
 * 
 * ========================================================================
 * FILTER PERSISTENCE
 * ========================================================================
 * 
 * When filters are applied in workspace exchanges view:
 * - Store in URL query params: ?status=active&risk=high
 * - DO NOT navigate away from workspace
 * - Filters apply within workspace scope only
 * 
 * Example URL structure:
 * ✅ /workspaces/WS-001?tab=exchanges&status=active&expiring=7days
 * ❌ /exchanges?status=active  // No workspace context
 * 
 * ========================================================================
 * 404 HANDLING
 * ========================================================================
 * 
 * If user attempts to access /exchanges directly:
 * - Show 404 page OR
 * - Redirect to /workspaces (workspace listing)
 * - Never allow standalone exchange viewing
 * 
 * ========================================================================
 * RATIONALE
 * ========================================================================
 * 
 * 1. **Single Source of Truth**: Workspaces are the organizational boundary
 * 2. **Context Preservation**: Every exchange exists within business context
 * 3. **Audit Trail**: Workspace context is critical for compliance
 * 4. **Governance**: Exchanges cannot "float" outside workspace control
 * 5. **User Experience**: Clear hierarchy prevents disorientation
 * 
 * ========================================================================
 * ACCEPTANCE CRITERIA
 * ========================================================================
 * 
 * ✔ Clicking any KPI lands inside a workspace
 * ✔ Clicking any chart element applies filters in workspace
 * ✔ Clicking any exchange row opens Exchange Detail with workspace context
 * ✔ No standalone Exchanges page exists anywhere
 * ✔ No broken or dead clicks
 * ✔ Workspace context is never lost
 * ✔ Breadcrumbs always show workspace hierarchy
 * ✔ URL always includes workspaceId when viewing exchanges
 * 
 * @accessibility
 * - Ensure clickable rows have proper cursor and hover states
 * - Breadcrumbs are keyboard navigable
 * - Screen readers announce workspace context changes
 */

// Export for TypeScript type checking
export {};