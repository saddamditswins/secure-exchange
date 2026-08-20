import { useState } from 'react';
import { 
  Plus, 
  FileText, 
  Users, 
  Clock, 
  MoreHorizontal, 
  Eye, 
  History,
  Download,
  CheckCircle,
  AlertCircle,
  Circle
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from './ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Search } from 'lucide-react';

interface SigningCeremony {
  id: string;
  name: string;
  status: 'New' | 'In Progress' | 'Completed';
  participants: {
    name: string;
    email: string;
    status: 'Pending' | 'Completed';
  }[];
  documentsCount: number;
  lastUpdated: string;
  createdDate: string;
}

interface ESignViewProps {
  onCeremonySelect: (ceremony: SigningCeremony) => void;
  onCreateNew: () => void;
}

export function ESignView({ onCeremonySelect, onCreateNew }: ESignViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('All');

  const [ceremonies, setCeremonies] = useState<SigningCeremony[]>([
    {
      id: 'SC-001',
      name: 'Signing Ceremony #1',
      status: 'Completed',
      participants: [
        { name: 'John Smith', email: 'john.smith@example.com', status: 'Completed' },
        { name: 'Sarah Johnson', email: 'sarah.j@example.com', status: 'Completed' },
      ],
      documentsCount: 3,
      lastUpdated: '01/05/2026 02:30 PM',
      createdDate: '01/02/2026 09:15 AM'
    },
    {
      id: 'SC-002',
      name: 'Signing Ceremony #2',
      status: 'In Progress',
      participants: [
        { name: 'Michael Chen', email: 'm.chen@example.com', status: 'Completed' },
        { name: 'Emily Rodriguez', email: 'emily.r@example.com', status: 'Pending' },
      ],
      documentsCount: 2,
      lastUpdated: '01/07/2026 11:45 AM',
      createdDate: '01/06/2026 03:20 PM'
    },
    {
      id: 'SC-003',
      name: 'Signing Ceremony #3',
      status: 'New',
      participants: [
        { name: 'David Wilson', email: 'david.w@example.com', status: 'Pending' },
      ],
      documentsCount: 1,
      lastUpdated: '01/07/2026 01:15 PM',
      createdDate: '01/07/2026 01:15 PM'
    },
    {
      id: 'SC-004',
      name: 'Signing Ceremony #4',
      status: 'In Progress',
      participants: [
        { name: 'Lisa Martinez', email: 'lisa.m@example.com', status: 'Completed' },
        { name: 'Robert Taylor', email: 'robert.t@example.com', status: 'Pending' },
      ],
      documentsCount: 4,
      lastUpdated: '01/06/2026 04:50 PM',
      createdDate: '01/05/2026 10:30 AM'
    },
  ]);

  const filteredCeremonies = ceremonies.filter(ceremony => {
    const matchesSearch = 
      ceremony.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ceremony.participants.some(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
    
    const matchesStatus = filterStatus === 'All' || ceremony.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    const styles = {
      'New': 'bg-blue-100 text-blue-700',
      'In Progress': 'bg-yellow-100 text-yellow-700',
      'Completed': 'bg-emerald-100 text-emerald-700',
    };
    return styles[status as keyof typeof styles] || 'bg-neutral-100 text-neutral-600';
  };

  const getStatusIcon = (status: string) => {
    const icons = {
      'New': <Circle className="w-3 h-3" />,
      'In Progress': <AlertCircle className="w-3 h-3" />,
      'Completed': <CheckCircle className="w-3 h-3" />,
    };
    return icons[status as keyof typeof icons];
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-neutral-900 mb-1">Signing Ceremonies</h1>
          <p className="text-sm text-neutral-600">Manage document signing workflows</p>
        </div>
        <button
          onClick={onCreateNew}
          className="px-4 py-2 bg-emerald-500 text-neutral-900 rounded-lg hover:bg-emerald-600 transition-colors font-medium cursor-pointer flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          New E-Sign
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white border border-neutral-200 rounded-lg p-4">
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              placeholder="Search by name, participant, or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900"
            />
          </div>
          <div className="w-[180px]">
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Status</SelectItem>
                <SelectItem value="New">New</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Ceremonies List */}
      <div className="bg-white border border-neutral-200 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-neutral-50 border-b border-neutral-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider">Ceremony</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider">Participants</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider">Documents</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider">Last Updated</th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-neutral-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200">
            {filteredCeremonies.map((ceremony) => (
              <tr 
                key={ceremony.id} 
                className="hover:bg-neutral-50 transition-colors cursor-pointer"
                onClick={() => onCeremonySelect(ceremony)}
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-neutral-400" />
                    <div>
                      <div className="text-sm font-medium text-neutral-900">{ceremony.name}</div>
                      <div className="text-xs text-neutral-500">{ceremony.id}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${getStatusBadge(ceremony.status)}`}>
                    {getStatusIcon(ceremony.status)}
                    {ceremony.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="space-y-1">
                    {ceremony.participants.map((participant, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 text-xs font-medium">
                          {participant.name.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm text-neutral-900 truncate">{participant.name}</div>
                        </div>
                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${
                          participant.status === 'Completed' 
                            ? 'bg-emerald-100 text-emerald-700' 
                            : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {participant.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-neutral-900">{ceremony.documentsCount} documents</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-neutral-500">{ceremony.lastUpdated}</div>
                </td>
                <td className="px-6 py-4 text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button 
                        onClick={(e) => e.stopPropagation()}
                        className="p-1.5 text-neutral-400 hover:text-neutral-900 rounded-lg hover:bg-neutral-100 transition-colors cursor-pointer"
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuItem 
                        onClick={(e) => {
                          e.stopPropagation();
                          onCeremonySelect(ceremony);
                        }}
                        className="cursor-pointer"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={(e) => e.stopPropagation()}
                        className="cursor-pointer"
                      >
                        <History className="w-4 h-4 mr-2" />
                        View History
                      </DropdownMenuItem>
                      {ceremony.status === 'Completed' && (
                        <>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            onClick={(e) => e.stopPropagation()}
                            className="cursor-pointer"
                          >
                            <Download className="w-4 h-4 mr-2" />
                            Download Signed Files
                          </DropdownMenuItem>
                        </>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredCeremonies.length === 0 && (
          <div className="p-12 text-center text-neutral-500">
            No signing ceremonies found.
          </div>
        )}
      </div>
    </div>
  );
}
