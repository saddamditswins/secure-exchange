import type { Workspace } from '../types';
import { useState, useMemo } from 'react';
import { Search, ChevronDown, MoreHorizontal, FileDown, Eye, Edit2, Trash2, CloudDownload, CheckCircle, User, Filter } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from './ui/dropdown-menu';
import { Checkbox } from './ui/checkbox';
import { toast } from 'sonner';

interface WorkspaceListViewProps {
  onOpenWorkspace: (workspace: Workspace) => void;
  onCreateWorkspace: (type: 'new' | 'import') => void;
  userRole?: string;
}

const AVAILABLE_STAFF = ['John Doe', 'Jane Smith', 'Alice Johnson', 'Bob Brown', 'Charlie Davis', 'David Wilson', 'Eve Anderson', 'System'];

export function WorkspaceListView({ onOpenWorkspace, onCreateWorkspace, userRole }: WorkspaceListViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>(['Active', 'Draft']);
  const [selectedStaff, setSelectedStaff] = useState<string[]>([]);
  const [workspaces, setWorkspaces] = useState<Workspace[]>([
    {
      id: 'WS-2024-0234',
      dealId: 'DEAL-2024-089',
      name: 'Customer Finance Package - Smith',
      description: 'Finance package for Smith deal',
      status: 'Active',
      lastUpdated: '2024-12-30T14:22:00',
      createdDate: '2024-12-25T10:00:00',
      documentsCount: 5,
      updatedBy: 'John Doe',
      staffPerson: 'John Doe',
    },
    {
      id: 'WS-2024-0233',
      dealId: 'DEAL-2024-088',
      name: 'Lease Agreement - Johnson Motors',
      description: 'Lease agreement details',
      status: 'Active',
      lastUpdated: '2024-12-29T16:45:00',
      createdDate: '2024-12-24T09:30:00',
      documentsCount: 3,
      updatedBy: 'Jane Smith',
      staffPerson: 'Jane Smith',
    },
    {
      id: 'WS-2024-0232',
      dealId: null,
      name: 'Trade-In Documentation - Miller',
      status: 'Draft',
      lastUpdated: '2024-12-30T09:15:00',
      createdDate: '2024-12-28T14:15:00',
      documentsCount: 2,
      updatedBy: 'Alice Johnson',
      staffPerson: 'Alice Johnson',
    },
    {
      id: 'WS-2024-0231',
      dealId: 'DEAL-2024-086',
      name: 'Insurance Verification - Davis',
      status: 'Completed',
      lastUpdated: '2024-12-28T11:30:00',
      createdDate: '2024-12-20T11:00:00',
      documentsCount: 4,
      updatedBy: 'Bob Brown',
      staffPerson: 'Bob Brown',
    },
    {
      id: 'WS-2024-0230',
      dealId: null,
      name: 'Credit Application - Brown',
      status: 'Active',
      lastUpdated: '2024-12-27T15:20:00',
      createdDate: '2024-12-26T16:20:00',
      documentsCount: 1,
      updatedBy: 'Charlie Davis',
      staffPerson: 'Charlie Davis',
    },
    {
      id: 'WS-2024-0229',
      dealId: 'DEAL-2024-083',
      name: 'Vehicle Purchase Agreement - Wilson',
      status: 'Completed',
      lastUpdated: '2024-12-26T10:00:00',
      createdDate: '2024-12-15T09:00:00',
      documentsCount: 6,
      updatedBy: 'David Wilson',
      staffPerson: 'David Wilson',
    },
    {
      id: 'WS-2024-0228',
      dealId: 'DEAL-2024-082',
      name: 'Extended Warranty Package - Anderson',
      status: 'Draft',
      lastUpdated: '2024-12-31T08:45:00',
      createdDate: '2024-12-30T08:00:00',
      documentsCount: 3,
      updatedBy: 'Eve Anderson',
      staffPerson: 'Eve Anderson',
    },
    {
      id: 'WS-2024-0227',
      dealId: null,
      name: 'Archived Deal - Old',
      status: 'Archived',
      lastUpdated: '2024-11-01T08:00:00',
      createdDate: '2024-10-15T09:00:00',
      documentsCount: 10,
      updatedBy: 'System',
      staffPerson: 'System',
    }
  ]);

  // Edit Dialog State
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingWorkspace, setEditingWorkspace] = useState<Workspace | null>(null);
  const [editForm, setEditForm] = useState({ name: '', description: '' });

  // Delete Dialog State
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deletingWorkspaceId, setDeletingWorkspaceId] = useState<string | null>(null);


  // Filter workspaces based on search query and filters
  const filteredWorkspaces = useMemo(() => {
    return workspaces.filter((ws) => {
      const matchesSearch =
        ws.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ws.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (ws.dealId && ws.dealId.toLowerCase().includes(searchQuery.toLowerCase()));

      let matchesStatus = true;
      if (selectedStatuses.length > 0) {
        matchesStatus = selectedStatuses.includes(ws.status);
      }

      const matchesStaff = selectedStaff.length === 0 || selectedStaff.includes(ws.staffPerson ?? '');

      return matchesSearch && matchesStatus && matchesStaff;
    });
  }, [workspaces, searchQuery, selectedStatuses, selectedStaff]);

  // Actions
  const handleEdit = (workspace: Workspace) => {
    setEditingWorkspace(workspace);
    setEditForm({ name: workspace.name, description: workspace.description || '' });
    setIsEditDialogOpen(true);
  };

  const handleSaveEdit = () => {
    if (editingWorkspace) {
      setWorkspaces(prev => prev.map(ws => 
        ws.id === editingWorkspace.id 
          ? { ...ws, name: editForm.name, description: editForm.description }
          : ws
      ));
      setIsEditDialogOpen(false);
      setEditingWorkspace(null);
      toast.success('Workspace updated successfully');
    }
  };

  const handleMarkCompleted = (id: string) => {
    setWorkspaces(prev => prev.map(ws => 
        ws.id === id ? { ...ws, status: 'Completed' as const } : ws
    ));
    toast.success('Workspace marked as completed');
  };

  const handleDelete = (id: string) => {
      setDeletingWorkspaceId(id);
      setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
      if (deletingWorkspaceId) {
          setWorkspaces(prev => prev.filter(ws => ws.id !== deletingWorkspaceId));
          setIsDeleteDialogOpen(false);
          setDeletingWorkspaceId(null);
          toast.success('Workspace deleted successfully');
      }
  };

  // Multi-select filter helpers
  const toggleStatusFilter = (status: string) => {
    setSelectedStatuses(prev => {
      if (prev.includes(status)) {
        return prev.filter(s => s !== status);
      } else {
        return [...prev, status];
      }
    });
  };

  const toggleStaffFilter = (staff: string) => {
    setSelectedStaff(prev => {
      if (prev.includes(staff)) {
        return prev.filter(s => s !== staff);
      } else {
        return [...prev, staff];
      }
    });
  };

  const clearAllFilters = () => {
    setSelectedStatuses(['Active', 'Draft']);
    setSelectedStaff([]);
  };

  // Format date to MM/DD/YYYY hh:mm A
  const formatDateTime = (isoString: string) => {
    const date = new Date(isoString);
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const year = date.getFullYear();
    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    const formattedHours = String(hours).padStart(2, '0');
    return `${month}/${day}/${year} ${formattedHours}:${minutes} ${ampm}`;
  };

  return (
    <div className="mx-auto w-full max-w-[1600px] p-4 sm:p-6 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-neutral-900 mb-1">Workspaces</h1>
          <p className="text-sm text-neutral-600">Manage your workspaces</p>
        </div>
        {/* Create Workspace Split Button - Moved to top */}
        <div className="inline-flex rounded-lg shadow-sm">
          <button
            onClick={() => onCreateWorkspace('new')}
            className="inline-flex items-center px-4 py-2.5 bg-emerald-500 text-sm font-medium text-neutral-900 rounded-l-lg hover:bg-emerald-600 focus:z-10 focus:ring-2 focus:ring-emerald-500 transition-colors cursor-pointer"
          >
            New Workspace
          </button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="inline-flex items-center px-2.5 py-2.5 bg-emerald-500 text-neutral-900 rounded-r-lg hover:bg-emerald-600 border-l border-emerald-600 focus:z-10 focus:ring-2 focus:ring-emerald-500 transition-colors cursor-pointer">
                <ChevronDown className="w-4 h-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem onClick={() => onCreateWorkspace('new')} className="cursor-pointer">
                New Workspace
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onCreateWorkspace('import')} className="cursor-pointer">
                Import from Dealertrack
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Top Bar Controls */}
      <div className="bg-white border border-neutral-200 rounded-lg p-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900"
            />
          </div>

          {/* Staff Multi-Select Filter */}
          <div className="w-full sm:w-[200px]">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="w-full flex items-center justify-between px-3 py-2 border border-neutral-200 rounded-lg text-sm bg-white hover:bg-neutral-50 transition-colors cursor-pointer">
                  <div className="flex items-center gap-2 text-neutral-600">
                    <User className="w-4 h-4" />
                    <span>
                      {selectedStaff.length === 0 
                        ? 'All Staff' 
                        : selectedStaff.length === 1 
                        ? selectedStaff[0] 
                        : `${selectedStaff.length} selected`}
                    </span>
                  </div>
                  <ChevronDown className="w-4 h-4 text-neutral-400" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56">
                <div className="p-2 space-y-1">
                  {AVAILABLE_STAFF.map((staff) => (
                    <div
                      key={staff}
                      onClick={() => toggleStaffFilter(staff)}
                      className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-neutral-100 cursor-pointer"
                    >
                      <Checkbox
                        checked={selectedStaff.includes(staff)}
                        onCheckedChange={() => toggleStaffFilter(staff)}
                        onClick={(e) => e.stopPropagation()}
                      />
                      <span className="text-sm text-neutral-700">{staff}</span>
                    </div>
                  ))}
                  {selectedStaff.length > 0 && (
                    <>
                      <DropdownMenuSeparator />
                      <button
                        onClick={() => setSelectedStaff([])}
                        className="w-full text-xs text-neutral-600 hover:text-neutral-900 py-1.5 text-left px-2 rounded hover:bg-neutral-100 cursor-pointer"
                      >
                        Clear Selection
                      </button>
                    </>
                  )}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Status Multi-Select Filter */}
          <div className="w-full sm:w-[200px]">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="w-full flex items-center justify-between px-3 py-2 border border-neutral-200 rounded-lg text-sm bg-white hover:bg-neutral-50 transition-colors cursor-pointer">
                  <div className="flex items-center gap-2 text-neutral-600">
                    <Filter className="w-4 h-4" />
                    <span>
                      {selectedStatuses.length === 0 
                        ? 'All Status' 
                        : selectedStatuses.length === 1 
                        ? selectedStatuses[0] 
                        : selectedStatuses.length === 2 && selectedStatuses.includes('Active') && selectedStatuses.includes('Draft')
                        ? 'Active & Draft'
                        : `${selectedStatuses.length} selected`}
                    </span>
                  </div>
                  <ChevronDown className="w-4 h-4 text-neutral-400" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56">
                <div className="p-2 space-y-1">
                  {['Draft', 'Active', 'Completed', 'Archived'].map((status) => (
                    <div
                      key={status}
                      onClick={() => toggleStatusFilter(status)}
                      className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-neutral-100 cursor-pointer"
                    >
                      <Checkbox
                        checked={selectedStatuses.includes(status)}
                        onCheckedChange={() => toggleStatusFilter(status)}
                        onClick={(e) => e.stopPropagation()}
                      />
                      <span className="text-sm text-neutral-700">{status}</span>
                    </div>
                  ))}
                  {selectedStatuses.length > 0 && (
                    <>
                      <DropdownMenuSeparator />
                      <button
                        onClick={() => setSelectedStatuses(['Active', 'Draft'])}
                        className="w-full text-xs text-neutral-600 hover:text-neutral-900 py-1.5 text-left px-2 rounded hover:bg-neutral-100 cursor-pointer"
                      >
                        Reset to Default
                      </button>
                    </>
                  )}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Workspaces Table */}
      <div className="bg-white border border-neutral-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px]">
            <thead className="bg-neutral-50 border-b border-neutral-200 sticky top-0">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                  Deal ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                  Staff Person
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                  Updated By
                </th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {filteredWorkspaces.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-sm text-neutral-500">
                    {searchQuery
                      ? 'No workspaces found matching your search'
                      : 'No workspaces available'}
                  </td>
                </tr>
              ) : (
                filteredWorkspaces.map((workspace) => (
                  <tr
                    key={workspace.id}
                    onClick={() => onOpenWorkspace(workspace)}
                    className="hover:bg-neutral-50 transition-colors cursor-pointer group"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                         <div className="text-sm text-neutral-900 font-medium">{workspace.name}</div>
                         {workspace.dealId && (
                           <div className="text-blue-500" title="Imported from Dealertrack">
                             <CloudDownload className="w-4 h-4" />
                           </div>
                         )}
                      </div>
                      <div className="text-xs text-neutral-500">{workspace.id}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-neutral-700">
                        {workspace.dealId || '—'}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                             <div className="w-6 h-6 rounded-full bg-neutral-200 flex items-center justify-center text-xs font-medium text-neutral-600">
                                {(workspace.staffPerson ?? 'Unassigned').charAt(0)}
                             </div>
                             <span className="text-sm text-neutral-700">{workspace.staffPerson ?? 'Unassigned'}</span>
                        </div>
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={workspace.status} />
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-neutral-900">{workspace.updatedBy}</div>
                      <div className="text-xs text-neutral-500">{formatDateTime(workspace.lastUpdated)}</div>
                    </td>
                    <td className="px-6 py-4 text-right">
                       <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button 
                            className="p-1.5 text-neutral-400 hover:text-neutral-900 rounded-lg hover:bg-neutral-100 transition-colors cursor-pointer"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <MoreHorizontal className="w-4 h-4" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuItem 
                            onClick={(e) => { e.stopPropagation(); onOpenWorkspace(workspace); }}
                            className="cursor-pointer"
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            View
                          </DropdownMenuItem>
                          
                          <DropdownMenuItem 
                            onClick={(e) => { e.stopPropagation(); handleEdit(workspace); }}
                            className="cursor-pointer"
                          >
                            <Edit2 className="w-4 h-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          
                          {workspace.status === 'Active' && (
                              <DropdownMenuItem 
                                onClick={(e) => { e.stopPropagation(); handleMarkCompleted(workspace.id); }}
                                className="cursor-pointer"
                              >
                                <CheckCircle className="w-4 h-4 mr-2" />
                                Mark Completed
                              </DropdownMenuItem>
                          )}

                          <DropdownMenuSeparator />
                          
                          {/* Hide delete for Primary Operations User */}
                          {userRole !== 'Primary Operations User' && (
                            <DropdownMenuItem 
                              onClick={(e) => { e.stopPropagation(); handleDelete(workspace.id); }}
                              className="text-rose-600 focus:text-rose-700 focus:bg-rose-50 cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Results Summary */}
      {filteredWorkspaces.length > 0 && (
        <div className="text-sm text-neutral-600">
          Showing {filteredWorkspaces.length} of {workspaces.length} workspaces
        </div>
      )}

      {/* Edit Dialog */}
      {isEditDialogOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setIsEditDialogOpen(false)}>
              <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
                  <h3 className="text-lg font-semibold text-neutral-900 mb-4">Edit Workspace</h3>
                  <div className="space-y-4">
                      <div>
                          <label className="block text-sm font-medium text-neutral-700 mb-1">Name</label>
                          <input 
                            type="text" 
                            value={editForm.name} 
                            onChange={e => setEditForm({...editForm, name: e.target.value})}
                            className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                          />
                      </div>
                      <div>
                          <label className="block text-sm font-medium text-neutral-700 mb-1">Description</label>
                          <textarea 
                            value={editForm.description} 
                            onChange={e => setEditForm({...editForm, description: e.target.value})}
                            className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none h-24 resize-none"
                          />
                      </div>
                  </div>
                  <div className="flex justify-end gap-3 mt-6">
                      <button 
                        onClick={() => setIsEditDialogOpen(false)}
                        className="px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100 rounded-lg cursor-pointer"
                      >
                          Cancel
                      </button>
                      <button 
                        onClick={handleSaveEdit}
                        className="px-4 py-2 text-sm bg-neutral-900 text-neutral-50 rounded-lg hover:bg-neutral-800 cursor-pointer"
                      >
                          Update
                      </button>
                  </div>
              </div>
          </div>
      )}

      {/* Delete Confirmation Dialog */}
      {isDeleteDialogOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setIsDeleteDialogOpen(false)}>
              <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
                  <h3 className="text-lg font-semibold text-neutral-900 mb-2">Delete Workspace</h3>
                  <p className="text-sm text-neutral-600 mb-6">
                      Are you sure you want to delete this workspace? This action cannot be undone.
                  </p>
                  <div className="flex justify-end gap-3">
                      <button 
                        onClick={() => setIsDeleteDialogOpen(false)}
                        className="px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100 rounded-lg cursor-pointer"
                      >
                          Cancel
                      </button>
                      <button 
                        onClick={confirmDelete}
                        className="px-4 py-2 text-sm bg-rose-600 text-neutral-50 rounded-lg hover:bg-rose-700 cursor-pointer"
                      >
                          Delete
                      </button>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
}

// Status Badge Component
function StatusBadge({ status }: { status: string }) {
  const statusStyles: Record<string, string> = {
    Draft: 'bg-neutral-100 text-neutral-700',
    Active: 'bg-emerald-50 text-emerald-700',
    Completed: 'bg-blue-50 text-blue-700',
    Archived: 'bg-neutral-200 text-neutral-600',
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${statusStyles[status] || 'bg-neutral-100 text-neutral-700'}`}>
      {status}
    </span>
  );
}