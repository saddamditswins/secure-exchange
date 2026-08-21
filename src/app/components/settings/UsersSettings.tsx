import { useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "../ui/sheet";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Search, UserPlus, Edit2, Trash2, Mail, Shield, Phone } from 'lucide-react';
import { Switch } from "../ui/switch";
import { toast } from 'sonner';

interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: string;
  status: 'Active' | 'Inactive';
  updatedBy: string;
  updatedDate: string;
}

const initialUsers: User[] = [
  { id: 1, name: 'Sarah Mitchell', email: 'sarah.mitchell@acmefinancial.com', phone: '(555) 123-4567', role: 'Tenant Admin', status: 'Active', updatedBy: 'System Admin', updatedDate: '01/07/2026 02:15 PM' },
  { id: 2, name: 'James Rodriguez', email: 'james.rodriguez@acmefinancial.com', phone: '(555) 987-6543', role: 'F&I Manager', status: 'Active', updatedBy: 'Sarah Mitchell', updatedDate: '01/06/2026 10:30 AM' },
  { id: 3, name: 'Emily Chen', email: 'emily.chen@acmefinancial.com', phone: '(555) 246-8135', role: 'Staff', status: 'Active', updatedBy: 'James Rodriguez', updatedDate: '01/05/2026 04:45 PM' },
];

export function UsersSettings() {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [showSheet, setShowSheet] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  
  // Search and Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState<string>('All');
  const [filterStatus, setFilterStatus] = useState<string>('All');

  // Filtering Logic
  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.phone.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesRole = filterRole === 'All' || user.role === filterRole;
    const matchesStatus = filterStatus === 'All' || user.status === filterStatus;

    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleEditClick = (user: User, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingUser(user);
    setShowSheet(true);
  };

  const handleDeleteClick = (user: User, e: React.MouseEvent) => {
    e.stopPropagation();
    setUserToDelete(user);
    setShowDeleteConfirm(true);
  };

  const handleCreateClick = () => {
    setEditingUser(null);
    setShowSheet(true);
  };

  const handleFormSubmit = (data: Omit<User, 'id' | 'status' | 'updatedBy' | 'updatedDate'>) => {
    if (editingUser) {
      setUsers(users.map(u => u.id === editingUser.id ? { ...u, ...data } : u));
    } else {
      const newUser: User = {
        id: Date.now(),
        ...data,
        status: 'Active',
        updatedBy: 'OrgAdmin',
        updatedDate: new Date().toLocaleString()
      };
      setUsers([...users, newUser]);
    }
    setShowSheet(false);
    setEditingUser(null);
    toast.success(editingUser ? `${data.name} updated` : `${data.name} added`);
  };

  const confirmDelete = () => {
    if (userToDelete) {
      setUsers(users.filter(u => u.id !== userToDelete.id));
      setUserToDelete(null);
      setShowDeleteConfirm(false);
      toast.success(`${userToDelete.name} removed`);
    }
  };

  const toggleUserStatus = (userId: number) => {
    setUsers(users.map(u => u.id === userId ? { ...u, status: u.status === 'Active' ? 'Inactive' : 'Active' } : u));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-neutral-900">Users</h2>
          <p className="text-neutral-500 mt-1">Manage internal access and user accounts.</p>
        </div>
        <button 
          onClick={handleCreateClick}
          className="px-4 py-2 bg-emerald-500 text-neutral-900 rounded-lg hover:bg-emerald-600 transition-colors font-medium cursor-pointer"
        >
          New User
        </button>
      </div>

      <div className="bg-white border border-neutral-200 rounded-lg p-4">
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              placeholder="Search Name, Email, or Phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900"
            />
          </div>
          <div className="w-[180px]">
            <Select value={filterRole} onValueChange={setFilterRole}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Roles</SelectItem>
                <SelectItem value="Tenant Admin">Tenant Admin</SelectItem>
                <SelectItem value="F&I Manager">F&I Manager</SelectItem>
                <SelectItem value="Staff">Staff</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="w-[180px]">
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Status</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="bg-white border border-neutral-200 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-neutral-50 border-b border-neutral-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider w-24">Active</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider">Phone</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider">Role</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider">Updated By</th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-neutral-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200">
            {filteredUsers.map((user) => (
              <tr key={user.id} className="hover:bg-neutral-50 transition-colors">
                <td className="px-6 py-4">
                  <Switch 
                    checked={user.status === 'Active'}
                    onCheckedChange={() => toggleUserStatus(user.id)}
                  />
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-neutral-900">{user.name}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-neutral-600">{user.email}</div>
                </td>
                <td className="px-6 py-4 text-sm text-neutral-600">
                  {user.phone}
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-neutral-900">{user.role}</span>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-neutral-900">{user.updatedBy}</div>
                  <div className="text-xs text-neutral-500">{user.updatedDate}</div>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={(e) => handleEditClick(user, e)}
                      className="p-1.5 text-neutral-400 hover:text-neutral-900 rounded hover:bg-neutral-100 transition-colors cursor-pointer"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => handleDeleteClick(user, e)}
                      className="p-1.5 text-neutral-400 hover:text-rose-600 rounded hover:bg-rose-50 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Sheet open={showSheet} onOpenChange={setShowSheet}>
        <SheetContent className="w-[400px] sm:w-[540px]">
          <SheetHeader className="mb-6">
            <SheetTitle>{editingUser ? 'Edit User' : 'Add New User'}</SheetTitle>
            <SheetDescription>
              {editingUser ? 'Update user details.' : 'Add a new user to your organization.'}
            </SheetDescription>
          </SheetHeader>
          <UserForm
            initialData={editingUser}
            onSubmit={handleFormSubmit}
            onCancel={() => setShowSheet(false)}
          />
        </SheetContent>
      </Sheet>

      {showDeleteConfirm && userToDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
            <h3 className="text-lg font-medium text-neutral-900 mb-2">Delete User</h3>
            <p className="text-sm text-neutral-600 mb-6">
              Are you sure you want to delete <span className="font-medium text-neutral-900">{userToDelete.name}</span>? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 border border-neutral-200 rounded-lg text-neutral-700 hover:bg-neutral-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors cursor-pointer"
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

function UserForm({ initialData, onSubmit, onCancel }: { 
  initialData: User | null; 
  onSubmit: (data: Omit<User, 'id' | 'status' | 'updatedBy' | 'updatedDate'>) => void; 
  onCancel: () => void 
}) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'Staff',
  });

  // Define default and custom roles
  const defaultRoles = ['Tenant Admin', 'F&I Manager', 'Staff'];
  const customRoles = ['Sales Manager']; // This would come from shared state/context in production

  useState(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        email: initialData.email,
        phone: initialData.phone,
        role: initialData.role,
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    toast.success(initialData ? 'User updated successfully!' : 'User created successfully!');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">Full Name *</label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            placeholder="e.g. John Smith"
            className="w-full px-4 py-2.5 border border-neutral-200 rounded-lg text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">Email Address *</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              placeholder="e.g. john@company.com"
              className="w-full pl-10 pr-4 py-2.5 border border-neutral-200 rounded-lg text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">Phone Number</label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
              placeholder="(555) 123-4567"
              className="w-full pl-10 pr-4 py-2.5 border border-neutral-200 rounded-lg text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900"
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">Role *</label>
          <Select 
            value={formData.role}
            onValueChange={(val) => setFormData(prev => ({ ...prev, role: val }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Role" />
            </SelectTrigger>
            <SelectContent>
              {/* Default Roles Group */}
              <SelectGroup>
                <SelectLabel>Default Roles</SelectLabel>
                {defaultRoles.map(role => (
                  <SelectItem key={role} value={role} className="cursor-pointer">
                    {role}
                  </SelectItem>
                ))}
              </SelectGroup>
              
              {/* Custom Roles Group - only show if custom roles exist */}
              {customRoles.length > 0 && (
                <SelectGroup>
                  <SelectLabel>Custom Roles</SelectLabel>
                  {customRoles.map(role => (
                    <SelectItem key={role} value={role} className="cursor-pointer">
                      {role}
                    </SelectItem>
                  ))}
                </SelectGroup>
              )}
            </SelectContent>
          </Select>
          {!initialData && (
            <p className="text-xs text-neutral-500 mt-1">New users are automatically set to Active status.</p>
          )}
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-neutral-200 rounded-lg text-neutral-700 hover:bg-neutral-50 transition-colors cursor-pointer"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-emerald-500 text-neutral-900 rounded-lg hover:bg-emerald-600 transition-colors cursor-pointer"
        >
          {initialData ? 'Update User' : 'Create User'}
        </button>
      </div>
    </form>
  );
}