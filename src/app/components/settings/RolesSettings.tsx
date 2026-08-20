import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { 
  Users, 
  Plus, 
  Edit2, 
  Trash2,
  Lock,
  CheckCircle2,
  Eye,
  Copy
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { toast } from 'sonner';

// Module-based permission structure
type ModulePermission = {
  [key: string]: boolean;
};

type PermissionModule = {
  id: string;
  name: string;
  permissions: string[];
  enabled: ModulePermission;
};

// Default role permission sets
const defaultRolePermissions = {
  'org-admin': {
    dashboard: { viewBasic: true, viewDetailed: true },
    workspaces: { view: true, update: true, uploadDocuments: true, secureShare: true, revokeAccess: true, prepareESign: true, delete: true },
    documents: { view: true, update: true, upload: true, delete: true, download: true },
    auditLogs: { view: true },
    users: { view: true, update: true, delete: true },
    rolesPermissions: { view: true, update: true, delete: true },
    organizationSettings: { view: true, update: true },
    integrations: { view: true, update: true }
  },
  'fi-manager': {
    dashboard: { viewBasic: true, viewDetailed: true },
    workspaces: { view: true, update: true, uploadDocuments: true, secureShare: true, revokeAccess: true, prepareESign: true, delete: true },
    documents: { view: true, update: true, upload: true, delete: true, download: true },
    auditLogs: {},
    users: {},
    rolesPermissions: {},
    organizationSettings: {},
    integrations: {}
  },
  'staff': {
    dashboard: { viewBasic: true },
    workspaces: { view: true, update: true, secureShare: true, revokeAccess: true, prepareESign: true },
    documents: {}, // Hidden entirely
    auditLogs: {},
    users: {},
    rolesPermissions: {},
    organizationSettings: {},
    integrations: {}
  }
};

// Default roles data
const defaultRoles = [
  {
    id: 'org-admin',
    name: 'Org Admin',
    description: 'Full access to organization settings, users, and roles.',
    isDefault: true,
    permissions: defaultRolePermissions['org-admin']
  },
  {
    id: 'fi-manager',
    name: 'F&I Manager',
    description: 'Can prepare and send documents for signing. Cannot manage organization settings.',
    isDefault: true,
    permissions: defaultRolePermissions['fi-manager']
  },
  {
    id: 'staff',
    name: 'Staff',
    description: 'Can view and manage assigned workspaces. Documents module is hidden.',
    isDefault: true,
    permissions: defaultRolePermissions['staff']
  }
];

interface CustomRole {
  id: number;
  name: string;
  status: 'Active' | 'Inactive';
  users: number;
  description: string;
  permissions: any;
  isDefault?: boolean;
}

const createPermissionModules = (permissions?: any): PermissionModule[] => {
  return [
    {
      id: 'dashboard',
      name: 'Dashboard',
      permissions: ['viewBasic', 'viewDetailed'],
      enabled: permissions?.dashboard || {}
    },
    {
      id: 'workspaces',
      name: 'Workspaces',
      permissions: ['view', 'update', 'uploadDocuments', 'secureShare', 'revokeAccess', 'prepareESign', 'delete'],
      enabled: permissions?.workspaces || {}
    },
    {
      id: 'documents',
      name: 'Documents',
      permissions: ['view', 'update', 'upload', 'delete', 'download'],
      enabled: permissions?.documents || {}
    },
    {
      id: 'auditLogs',
      name: 'Audit Logs',
      permissions: ['view'],
      enabled: permissions?.auditLogs || {}
    },
    {
      id: 'users',
      name: 'Users',
      permissions: ['view', 'update', 'delete'],
      enabled: permissions?.users || {}
    },
    {
      id: 'rolesPermissions',
      name: 'Roles & Permissions',
      permissions: ['view', 'update', 'delete'],
      enabled: permissions?.rolesPermissions || {}
    },
    {
      id: 'organizationSettings',
      name: 'Organization Settings',
      permissions: ['view', 'update'],
      enabled: permissions?.organizationSettings || {}
    },
    {
      id: 'integrations',
      name: 'Integrations',
      permissions: ['view', 'update'],
      enabled: permissions?.integrations || {}
    }
  ];
};

const formatPermissionLabel = (permission: string): string => {
  const labels: { [key: string]: string } = {
    view: 'View',
    update: 'Update',
    delete: 'Delete',
    upload: 'Upload',
    download: 'Download',
    uploadDocuments: 'Upload Documents',
    secureShare: 'Secure Share',
    revokeAccess: 'Revoke Access',
    prepareESign: 'Prepare E-Sign',
    viewBasic: 'View Basic',
    viewDetailed: 'View Detailed'
  };
  return labels[permission] || permission;
};

export function RolesSettings() {
  const [customRoles, setCustomRoles] = useState<CustomRole[]>([
    {
      id: 1,
      name: 'Sales Manager',
      status: 'Active',
      users: 3,
      description: 'Can view all sales documents but cannot send for signing.',
      permissions: defaultRolePermissions['fi-manager']
    }
  ]);

  const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false);
  const [currentRole, setCurrentRole] = useState<CustomRole | typeof defaultRoles[0] | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isReadOnly, setIsReadOnly] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [roleToDelete, setRoleToDelete] = useState<CustomRole | null>(null);
  
  // Role form state
  const [roleName, setRoleName] = useState('');
  const [roleDesc, setRoleDesc] = useState('');
  const [permissionModules, setPermissionModules] = useState<PermissionModule[]>(createPermissionModules());
  const [showValidation, setShowValidation] = useState(false);

  const resetForm = () => {
    setRoleName('');
    setRoleDesc('');
    setPermissionModules(createPermissionModules());
    setShowValidation(false);
    setCurrentRole(null);
    setIsEditMode(false);
    setIsReadOnly(false);
  };

  const openRoleDialog = (role: CustomRole | typeof defaultRoles[0], editMode: boolean = false) => {
    setCurrentRole(role);
    setRoleName(role.name);
    setRoleDesc(role.description);
    setPermissionModules(createPermissionModules(role.permissions));
    setIsReadOnly('isDefault' in role && role.isDefault);
    setIsEditMode(editMode && !('isDefault' in role && role.isDefault));
    setIsRoleDialogOpen(true);
  };

  const openCreateDialog = () => {
    resetForm();
    setIsEditMode(true);
    setIsReadOnly(false);
    setIsRoleDialogOpen(true);
  };

  const handleCloneRole = (role: typeof defaultRoles[0]) => {
    setRoleName(`Copy of ${role.name}`);
    setRoleDesc(role.description);
    setPermissionModules(createPermissionModules(role.permissions));
    setCurrentRole(null);
    setIsEditMode(true);
    setIsReadOnly(false);
    setIsRoleDialogOpen(true);
  };

  const handleSaveRole = () => {
    if (!roleName.trim()) {
      setShowValidation(true);
      return;
    }

    const permissionsObject = permissionModules.reduce((acc, module) => {
      acc[module.id] = module.enabled;
      return acc;
    }, {} as any);

    if (currentRole && !('isDefault' in currentRole && currentRole.isDefault)) {
      // Update existing custom role
      setCustomRoles(customRoles.map(role => 
        role.id === (currentRole as CustomRole).id 
          ? { ...role, name: roleName, description: roleDesc, permissions: permissionsObject }
          : role
      ));
      toast.success('Role updated successfully!');
    } else {
      // Create new custom role
      const newRole: CustomRole = {
        id: Date.now(),
        name: roleName,
        status: 'Active',
        users: 0,
        description: roleDesc,
        permissions: permissionsObject
      };
      setCustomRoles([...customRoles, newRole]);
      toast.success('Role created successfully!');
    }
    
    setIsRoleDialogOpen(false);
    resetForm();
  };

  const handleDeleteRole = () => {
    if (roleToDelete) {
      setCustomRoles(customRoles.filter(role => role.id !== roleToDelete.id));
      setShowDeleteConfirm(false);
      setRoleToDelete(null);
      toast.success('Role deleted successfully!');
    }
  };

  const openDeleteConfirm = (role: CustomRole) => {
    setRoleToDelete(role);
    setShowDeleteConfirm(true);
  };

  const toggleModulePermission = (moduleId: string, permission: string) => {
    if (isReadOnly) return;
    
    setPermissionModules(modules => modules.map(module => {
      if (module.id === moduleId) {
        return {
          ...module,
          enabled: {
            ...module.enabled,
            [permission]: !module.enabled[permission]
          }
        };
      }
      return module;
    }));
  };

  const toggleSelectAllModule = (moduleId: string) => {
    if (isReadOnly) return;
    
    setPermissionModules(modules => modules.map(module => {
      if (module.id === moduleId) {
        const allSelected = module.permissions.every(perm => module.enabled[perm]);
        const newEnabled = module.permissions.reduce((acc, perm) => {
          acc[perm] = !allSelected;
          return acc;
        }, {} as ModulePermission);
        
        return {
          ...module,
          enabled: newEnabled
        };
      }
      return module;
    }));
  };

  const isModuleFullySelected = (module: PermissionModule): boolean => {
    return module.permissions.every(perm => module.enabled[perm]);
  };

  const isModulePartiallySelected = (module: PermissionModule): boolean => {
    const selected = module.permissions.filter(perm => module.enabled[perm]);
    return selected.length > 0 && selected.length < module.permissions.length;
  };

  const hasAnyPermissions = (module: PermissionModule): boolean => {
    return module.permissions.some(perm => module.enabled[perm]);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-neutral-900">Roles & Permissions</h2>
          <p className="text-neutral-500 mt-1">Manage RBAC roles and access levels.</p>
        </div>
        <button 
          onClick={openCreateDialog}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-neutral-900 rounded-lg hover:bg-emerald-600 transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Create Custom Role
        </button>
      </div>

      <Tabs defaultValue="default" className="w-full">
        <TabsList className="mb-6 w-full justify-start bg-neutral-100 p-1 border border-neutral-200">
          <TabsTrigger value="default" className="flex items-center gap-2 px-4">
            <Lock className="w-4 h-4" /> Default Roles
          </TabsTrigger>
          <TabsTrigger value="custom" className="flex items-center gap-2 px-4">
            <Users className="w-4 h-4" /> Custom Roles
          </TabsTrigger>
        </TabsList>

        <TabsContent value="default" className="space-y-6">
          <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 flex items-start gap-3 mb-6">
            <div className="bg-blue-100 p-1 rounded text-blue-600 mt-0.5">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-blue-900">System Roles are Immutable</h4>
              <p className="text-sm text-blue-700 mt-1">
                Default roles adhere to compliance standards and cannot be modified. Clone a default role to create a custom version with your specific permission sets.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {defaultRoles.map((role) => (
              <div 
                key={role.id} 
                className="bg-white border border-neutral-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer" 
                onClick={() => openRoleDialog(role, false)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-neutral-900">{role.name}</h3>
                    <p className="text-sm text-neutral-500 mt-1">{role.description}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="bg-neutral-100 text-neutral-600 text-xs font-medium px-2 py-1 rounded border border-neutral-200">
                      System Default
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCloneRole(role);
                      }}
                      className="p-1.5 text-neutral-400 hover:text-emerald-600 rounded hover:bg-emerald-50 transition-colors cursor-pointer"
                      title="Clone Role"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openRoleDialog(role, false);
                      }}
                      className="p-1.5 text-neutral-400 hover:text-neutral-900 rounded hover:bg-neutral-100 transition-colors cursor-pointer"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="custom" className="space-y-6">
          <div className="bg-white border border-neutral-200 rounded-xl shadow-sm overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-neutral-50 border-b border-neutral-200">
                <tr>
                  <th className="px-6 py-4 text-xs font-semibold text-neutral-500 uppercase tracking-wider">Role Name</th>
                  <th className="px-6 py-4 text-xs font-semibold text-neutral-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-xs font-semibold text-neutral-500 uppercase tracking-wider">Assigned Users</th>
                  <th className="px-6 py-4 text-xs font-semibold text-neutral-500 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {customRoles.map((role) => (
                  <tr 
                    key={role.id} 
                    className="hover:bg-neutral-50 transition-colors cursor-pointer"
                    onClick={() => openRoleDialog(role, false)}
                  >
                    <td className="px-6 py-4">
                      <div className="font-medium text-neutral-900">{role.name}</div>
                      <div className="text-xs text-neutral-500 mt-0.5">{role.description}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        role.status === 'Active' ? 'bg-emerald-100 text-emerald-800' : 'bg-neutral-100 text-neutral-800'
                      }`}>
                        {role.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-neutral-600">
                      {role.users} Users
                    </td>
                    <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => openRoleDialog(role, false)}
                          className="p-1 text-neutral-400 hover:text-neutral-900 transition-colors cursor-pointer"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => openRoleDialog(role, true)}
                          className="p-1 text-neutral-400 hover:text-neutral-900 transition-colors cursor-pointer"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => openDeleteConfirm(role)}
                          className="p-1 text-neutral-400 hover:text-rose-600 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {customRoles.length === 0 && (
              <div className="p-12 text-center text-neutral-500">
                No custom roles defined yet.
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Role Details/Edit Dialog */}
      <Dialog open={isRoleDialogOpen} onOpenChange={(open) => {
        setIsRoleDialogOpen(open);
        if (!open) resetForm();
      }}>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center gap-2">
              <DialogTitle>
                {isReadOnly ? 'View Role' : (currentRole && !isEditMode ? 'View Role' : (currentRole ? 'Edit Role' : 'Create Custom Role'))}
              </DialogTitle>
              {isReadOnly && (
                <span className="bg-blue-100 text-blue-700 text-xs font-medium px-2 py-1 rounded border border-blue-200">
                  Default Role (Read-only)
                </span>
              )}
            </div>
            <DialogDescription>
              {isReadOnly 
                ? 'This is a system default role and cannot be modified.' 
                : (isEditMode ? 'Configure role permissions and settings.' : 'View role details and permissions.')}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            {/* Info banner for read-only default roles */}
            {isReadOnly && (
              <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                <p className="text-sm text-blue-700">
                  This is a system default role with predefined permissions for compliance and security. Click "Clone Role" to create a customizable version.
                </p>
              </div>
            )}

            {/* Info banner for view-only custom roles */}
            {!isReadOnly && currentRole && !isEditMode && (
              <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-4">
                <p className="text-sm text-neutral-700">
                  Viewing role in read-only mode. Click Edit to modify permissions.
                </p>
              </div>
            )}

            {/* Role Name and Description */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className={`text-sm font-medium ${showValidation && !roleName ? 'text-rose-600' : 'text-neutral-700'}`}>
                  Name{showValidation && !roleName && ' *'}
                </label>
                <input 
                  type="text" 
                  placeholder="Role Name"
                  value={roleName}
                  onChange={(e) => {
                    setRoleName(e.target.value);
                    if (e.target.value) setShowValidation(false);
                  }}
                  disabled={isReadOnly || (!isEditMode && !!currentRole)}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                    showValidation && !roleName 
                      ? 'border-rose-500 focus:ring-rose-200' 
                      : 'border-neutral-200 focus:ring-emerald-500'
                  } ${(isReadOnly || (!isEditMode && !!currentRole)) ? 'bg-neutral-50 cursor-not-allowed' : ''}`}
                />
                {showValidation && !roleName && (
                  <p className="text-xs text-rose-500">Required</p>
                )}
              </div>
              
              <div className="space-y-1">
                <label className="text-sm font-medium text-neutral-700">Description</label>
                <input 
                  type="text"
                  placeholder="Role Description"
                  value={roleDesc}
                  onChange={(e) => setRoleDesc(e.target.value)}
                  disabled={isReadOnly || (!isEditMode && !!currentRole)}
                  className={`w-full px-3 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                    (isReadOnly || (!isEditMode && !!currentRole)) ? 'bg-neutral-50 cursor-not-allowed' : ''
                  }`}
                />
              </div>
            </div>

            {/* Permissions Matrix */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-neutral-900">Permissions Matrix</h3>
              
              <div className="border border-neutral-200 rounded-lg overflow-hidden">
                {permissionModules.map((module, index) => {
                  const isFullySelected = isModuleFullySelected(module);
                  const isPartiallySelected = isModulePartiallySelected(module);
                  const moduleHasPermissions = hasAnyPermissions(module);
                  
                  // Hide Documents module for Staff role in view mode
                  if (isReadOnly && currentRole?.id === 'staff' && module.id === 'documents') {
                    return null;
                  }

                  return (
                    <div key={module.id} className={`${index !== 0 ? 'border-t border-neutral-200' : ''}`}>
                      <div className="bg-neutral-50 px-6 py-3 flex items-center justify-between">
                        <h4 className="text-sm font-semibold text-neutral-900">{module.name}</h4>
                        <label className={`flex items-center gap-2 ${isReadOnly || (!isEditMode && !!currentRole) ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
                          <input 
                            type="checkbox" 
                            checked={isFullySelected}
                            ref={(el) => {
                              if (el) {
                                el.indeterminate = isPartiallySelected;
                              }
                            }}
                            onChange={() => toggleSelectAllModule(module.id)}
                            disabled={isReadOnly || (!isEditMode && !!currentRole)}
                            className={`w-4 h-4 rounded border-neutral-300 text-emerald-600 focus:ring-emerald-500 ${
                              isReadOnly || (!isEditMode && !!currentRole) ? 'cursor-not-allowed opacity-60' : ''
                            }`}
                          />
                          <span className="text-xs font-medium text-neutral-600">Select All</span>
                        </label>
                      </div>
                      <div className="px-6 py-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                        {module.permissions.map((permission) => (
                          <label 
                            key={permission} 
                            className={`flex items-center gap-2 ${
                              isReadOnly || (!isEditMode && !!currentRole) 
                                ? 'cursor-not-allowed opacity-60' 
                                : 'cursor-pointer hover:text-neutral-900'
                            }`}
                          >
                            <input 
                              type="checkbox" 
                              checked={!!module.enabled[permission]}
                              onChange={() => toggleModulePermission(module.id, permission)}
                              disabled={isReadOnly || (!isEditMode && !!currentRole)}
                              className={`w-4 h-4 rounded border-neutral-300 text-emerald-600 focus:ring-emerald-500 ${
                                isReadOnly || (!isEditMode && !!currentRole) ? 'cursor-not-allowed' : ''
                              }`}
                            />
                            <span className="text-sm text-neutral-700">{formatPermissionLabel(permission)}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <DialogFooter>
            {isReadOnly ? (
              <>
                <button 
                  onClick={() => {
                    setIsRoleDialogOpen(false);
                    if (currentRole && 'isDefault' in currentRole) {
                      handleCloneRole(currentRole);
                    }
                  }}
                  className="px-4 py-2 border border-neutral-200 rounded-lg text-neutral-700 hover:bg-neutral-50 cursor-pointer"
                >
                  <Copy className="w-4 h-4 inline mr-2" />
                  Clone Role
                </button>
                <button 
                  onClick={() => {
                    setIsRoleDialogOpen(false);
                    resetForm();
                  }}
                  className="px-4 py-2 bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 cursor-pointer"
                >
                  Close
                </button>
              </>
            ) : isEditMode ? (
              <>
                <button 
                  onClick={() => {
                    setIsRoleDialogOpen(false);
                    resetForm();
                  }}
                  className="px-4 py-2 border border-neutral-200 rounded-lg text-neutral-700 hover:bg-neutral-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSaveRole}
                  className="px-4 py-2 bg-emerald-500 text-neutral-900 rounded-lg hover:bg-emerald-600 cursor-pointer"
                >
                  {currentRole ? 'Update Role' : 'Create Role'}
                </button>
              </>
            ) : (
              <>
                <button 
                  onClick={() => {
                    setIsRoleDialogOpen(false);
                    resetForm();
                  }}
                  className="px-4 py-2 border border-neutral-200 rounded-lg text-neutral-700 hover:bg-neutral-50 cursor-pointer"
                >
                  Close
                </button>
                <button 
                  onClick={() => setIsEditMode(true)}
                  className="px-4 py-2 bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 cursor-pointer"
                >
                  <Edit2 className="w-4 h-4 inline mr-2" />
                  Edit Role
                </button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && roleToDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
            <h3 className="text-lg font-medium text-neutral-900 mb-2">Delete Role</h3>
            <p className="text-sm text-neutral-600 mb-6">
              Are you sure you want to delete the role <span className="font-medium text-neutral-900">{roleToDelete.name}</span>? 
              {roleToDelete.users > 0 && <span className="text-rose-600"> This will affect {roleToDelete.users} user(s).</span>}
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setRoleToDelete(null);
                }}
                className="px-4 py-2 border border-neutral-200 rounded-lg text-neutral-700 hover:bg-neutral-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteRole}
                className="px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors cursor-pointer"
              >
                Delete Role
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}