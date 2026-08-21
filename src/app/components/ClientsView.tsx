import { useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "./ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Search, Plus, Filter } from 'lucide-react';
import { Switch } from "./ui/switch";
import { MoreHorizontal, Edit2, Trash2 } from 'lucide-react';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from "./ui/dropdown-menu";

interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  type: 'Customer' | 'Provider';
  isActive: boolean;
  updatedBy: string;
  updatedDate: string;
}

export function ClientsView() {
  const [showSheet, setShowSheet] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [clientToDelete, setClientToDelete] = useState<Client | null>(null);
  
  // Search and Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('All');

  const [clients, setClients] = useState<Client[]>([
    { id: 'CL-001', name: 'Acme Corp', email: 'contact@acmecorp.com', phone: '(555) 123-4567', type: 'Customer', isActive: true, updatedBy: 'John Doe', updatedDate: '01/04/2026 02:30 PM' },
    { id: 'CL-002', name: 'Legal Partners LLP', email: 'info@legalpartners.com', phone: '(555) 987-6543', type: 'Provider', isActive: true, updatedBy: 'Jane Smith', updatedDate: '01/02/2026 09:15 AM' },
    { id: 'CL-003', name: 'Global Tech', email: 'admin@globaltech.com', phone: '(555) 246-8135', type: 'Customer', isActive: false, updatedBy: 'Alice Johnson', updatedDate: '12/15/2025 04:45 PM' },
  ]);

  const handleEditClick = (client: Client, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingClient(client);
    setShowSheet(true);
  };

  const handleDeleteClick = (client: Client, e: React.MouseEvent) => {
    e.stopPropagation();
    setClientToDelete(client);
    setShowDeleteConfirm(true);
  };

  const handleCreateClick = () => {
    setEditingClient(null);
    setShowSheet(true);
  };

  const handleFormSubmit = (data: Omit<Client, 'id' | 'isActive' | 'updatedBy' | 'updatedDate'>) => {
    if (editingClient) {
      setClients(clients.map(c => c.id === editingClient.id ? { ...c, ...data } : c));
    } else {
      const newClient: Client = {
        id: `CL-00${clients.length + 1}`,
        ...data,
        isActive: true,
        updatedBy: 'System',
        updatedDate: new Date().toLocaleString('en-US', { 
          month: '2-digit', day: '2-digit', year: 'numeric', 
          hour: '2-digit', minute: '2-digit', hour12: true 
        }).replace(',', '')
      };
      setClients([...clients, newClient]);
    }
    setShowSheet(false);
    setEditingClient(null);
  };

  const confirmDelete = () => {
    if (clientToDelete) {
      setClients(clients.filter(c => c.id !== clientToDelete.id));
      setClientToDelete(null);
      setShowDeleteConfirm(false);
    }
  };

  const toggleClientStatus = (clientId: string) => {
    setClients(clients.map(c => c.id === clientId ? { ...c, isActive: !c.isActive } : c));
  };

  // Filtering Logic
  const filteredClients = clients.filter(client => {
    const matchesSearch = 
      client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.phone.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = filterType === 'All' || client.type === filterType;

    return matchesSearch && matchesType;
  });

  return (
    <div className="mx-auto w-full max-w-[1600px] p-4 sm:p-6 space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-neutral-900 mb-1">Clients</h1>
          <p className="text-sm text-neutral-600">Manage your customer and provider network</p>
        </div>
        <button
          onClick={() => {
            setEditingClient(null);
            setShowSheet(true);
          }}
          className="px-4 py-2 bg-emerald-500 text-neutral-900 rounded-lg hover:bg-emerald-600 transition-colors font-medium cursor-pointer"
        >
          New Client
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
          <div className="w-full sm:w-[180px]">
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Types</SelectItem>
                <SelectItem value="Customer">Customer</SelectItem>
                <SelectItem value="Provider">Provider</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="bg-white border border-neutral-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
        <table className="w-full min-w-[820px]">
          <thead className="bg-neutral-50 border-b border-neutral-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider w-24">Active</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider">Phone</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider">Type</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider">Updated By</th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-neutral-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200">
            {filteredClients.map((client) => (
              <tr key={client.id} className="hover:bg-neutral-50 transition-colors">
                <td className="px-6 py-4">
                  <Switch 
                    checked={client.isActive}
                    onCheckedChange={() => toggleClientStatus(client.id)}
                  />
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-neutral-900">{client.name}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-neutral-600">{client.email}</div>
                </td>
                <td className="px-6 py-4 text-sm text-neutral-600">
                  {client.phone}
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
                    client.type === 'Customer' ? 'bg-blue-50 text-blue-700' : 'bg-purple-50 text-purple-700'
                  }`}>
                    {client.type}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-neutral-900">{client.updatedBy}</div>
                  <div className="text-xs text-neutral-500">{client.updatedDate}</div>
                </td>
                <td className="px-6 py-4 text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="p-1.5 text-neutral-400 hover:text-neutral-900 rounded-lg hover:bg-neutral-100 transition-colors cursor-pointer">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuItem
                        onClick={(e) => handleEditClick(client, e)}
                        className="cursor-pointer"
                      >
                        <Edit2 className="w-4 h-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={(e) => handleDeleteClick(client, e)}
                        className="cursor-pointer text-rose-600 focus:text-rose-700 focus:bg-rose-50"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>

      <Sheet open={showSheet} onOpenChange={setShowSheet}>
        <SheetContent className="w-full sm:max-w-[540px] overflow-y-auto">
          <SheetHeader className="mb-6">
            <SheetTitle>{editingClient ? 'Edit Client' : 'Add New Client'}</SheetTitle>
            <SheetDescription>
              {editingClient ? 'Update client details.' : 'Add a new customer or provider to your network.'}
            </SheetDescription>
          </SheetHeader>
          <ClientForm
            initialData={editingClient}
            onSubmit={handleFormSubmit}
            onCancel={() => setShowSheet(false)}
          />
        </SheetContent>
      </Sheet>

      {showDeleteConfirm && clientToDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full mx-4 shadow-xl">
            <h3 className="text-lg font-medium text-neutral-900 mb-2">Delete Client</h3>
            <p className="text-sm text-neutral-600 mb-6">
              Are you sure you want to delete <span className="font-medium text-neutral-900">{clientToDelete.name}</span>? This action cannot be undone.
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

function ClientForm({ initialData, onSubmit, onCancel }: { 
  initialData: Client | null; 
  onSubmit: (data: Omit<Client, 'id' | 'isActive' | 'updatedBy' | 'updatedDate'>) => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    email: initialData?.email || '',
    phone: initialData?.phone || '',
    type: initialData?.type || 'Customer'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData as any);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        {/* Customer Type First */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-neutral-700">Type <span className="text-rose-500">*</span></label>
          <Select
            value={formData.type}
            onValueChange={(val) => setFormData({ ...formData, type: val as 'Customer' | 'Provider' })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Customer">Customer</SelectItem>
              <SelectItem value="Provider">Provider</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-neutral-700">Name <span className="text-rose-500">*</span></label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={e => setFormData({ ...formData, name: e.target.value })}
            placeholder="John Doe"
            className="w-full px-3 py-2 border border-neutral-200 rounded-md focus:outline-none focus:ring-2 focus:ring-neutral-900"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-neutral-700">Email <span className="text-rose-500">*</span></label>
          <input
            type="email"
            required
            value={formData.email}
            onChange={e => setFormData({ ...formData, email: e.target.value })}
            placeholder="john@example.com"
            className="w-full px-3 py-2 border border-neutral-200 rounded-md focus:outline-none focus:ring-2 focus:ring-neutral-900"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-neutral-700">Phone</label>
          <input
            type="text"
            value={formData.phone}
            onChange={e => setFormData({ ...formData, phone: e.target.value })}
            placeholder="(555) 123-4567"
            className="w-full px-3 py-2 border border-neutral-200 rounded-md focus:outline-none focus:ring-2 focus:ring-neutral-900"
          />
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-neutral-200 rounded-md text-neutral-700 hover:bg-neutral-50 transition-colors cursor-pointer"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-neutral-900 text-white rounded-md hover:bg-neutral-800 transition-colors cursor-pointer"
        >
          {initialData ? 'Update' : 'Save'}
        </button>
      </div>
    </form>
  );
}