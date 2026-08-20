import { useState } from 'react';
import { Exchange } from '../App';
import { toast } from 'sonner';
import { getExchangeStatusColor } from '../utils/exchangeStatus';
import { useTranslation } from 'react-i18next';
import { MoreHorizontal, Eye, Copy, Trash2, Clock, Shield, Search, Filter, Calendar } from 'lucide-react';
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
import { copyToClipboard } from '../utils/clipboard';

interface ExchangesViewProps {
  onExchangeSelect: (exchange: Exchange) => void;
}

// Extended Exchange interface for internal view use
interface ExchangeInternal extends Exchange {
  recipient?: string;
  recipientType?: 'Customer' | 'Provider';
  sentCount?: number;
  receivedCount?: number;
  recipientCount?: number;
}

export function ExchangesView({ onExchangeSelect }: ExchangesViewProps) {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [filterRecipientType, setFilterRecipientType] = useState<string>('All');
  const [filterExpiry, setFilterExpiry] = useState<string>('All');
  const [revokeExchange, setRevokeExchange] = useState<Exchange | null>(null);

  const [mockExchanges, setMockExchanges] = useState<ExchangeInternal[]>([
    {
      id: 'EX-2024-0145',
      title: 'Exchanges #1',
      status: 'Sent',
      createdBy: 'Sarah Mitchell',
      createdDate: '2024-12-15T10:30:00',
      lastModified: '12/29/2024 02:15 PM',
      participants: 4,
      documentsCount: 3,
      sentCount: 3,
      receivedCount: 1,
      requiresSignature: true,
      riskLevel: 'Medium',
      expiresAt: '01/15/2025 05:00 PM',
      recipient: 'acme.corp@example.com',
      recipientType: 'Customer',
      recipientCount: 4
    },
    {
      id: 'EX-2024-0144',
      title: 'Exchanges #2',
      status: 'Viewed',
      createdBy: 'Sarah Mitchell',
      createdDate: '2024-12-28T09:00:00',
      lastModified: '12/30/2024 11:20 AM',
      participants: 2,
      documentsCount: 1,
      sentCount: 1,
      receivedCount: 0,
      requiresSignature: true,
      riskLevel: 'Low',
      recipient: 'legal@partners.com',
      recipientType: 'Provider',
      recipientCount: 1
    },
    {
      id: 'EX-2024-0143',
      title: 'Exchanges #3',
      status: 'Expired',
      createdBy: 'James Rodriguez',
      createdDate: '2024-12-10T15:45:00',
      lastModified: '12/12/2024 10:00 AM',
      participants: 2,
      documentsCount: 1,
      sentCount: 1,
      receivedCount: 1,
      requiresSignature: true,
      riskLevel: 'Low',
      recipient: 'new.hire@example.com',
      recipientType: 'Customer',
      recipientCount: 2
    },
    {
      id: 'EX-2024-0142',
      title: 'Exchanges #4',
      status: 'Sent',
      createdBy: 'Sarah Mitchell',
      createdDate: '2024-12-05T08:30:00',
      lastModified: '12/20/2024 04:45 PM',
      participants: 6,
      documentsCount: 8,
      sentCount: 5,
      receivedCount: 3,
      requiresSignature: false,
      riskLevel: 'High',
      expiresAt: '01/05/2025 12:00 PM',
      recipient: 'auditor@external.com',
      recipientType: 'Provider',
      recipientCount: 10
    },
    {
      id: 'EX-2024-0141',
      title: 'Exchanges #5',
      status: 'Revoked',
      createdBy: 'James Rodriguez',
      createdDate: '2024-11-28T13:20:00',
      lastModified: '12/18/2024 09:15 AM',
      participants: 3,
      documentsCount: 2,
      sentCount: 2,
      receivedCount: 0,
      requiresSignature: true,
      riskLevel: 'Medium',
      recipient: 'partner@global.com',
      recipientType: 'Customer',
      recipientCount: 3
    },
  ]);

  const getExpiryStatus = (ex: ExchangeInternal) => {
    if (ex.status === 'Revoked') return 'Revoked';
    if (ex.status === 'Expired') return 'Expired';
    if (ex.expiresAt) {
      const expiryDate = new Date(ex.expiresAt);
      const now = new Date();
      if (expiryDate < now) return 'Expired';
      return 'Active';
    }
    return 'Active';
  };

  const filteredExchanges = mockExchanges.filter(ex => {
    // Search
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = 
      ex.title.toLowerCase().includes(searchLower) ||
      ex.recipient?.toLowerCase().includes(searchLower) ||
      ex.status.toLowerCase().includes(searchLower);

    // Status Filter
    const matchesStatus = filterStatus === 'All' || ex.status === filterStatus;

    // Recipient Type Filter
    const matchesRecipientType = filterRecipientType === 'All' || ex.recipientType === filterRecipientType;

    // Expiry Filter
    const expiryStatus = getExpiryStatus(ex);
    const matchesExpiry = filterExpiry === 'All' || expiryStatus === filterExpiry;

    return matchesSearch && matchesStatus && matchesRecipientType && matchesExpiry;
  });

  const handleRevoke = (exchange: Exchange) => {
    setMockExchanges(prev => prev.map(ex => 
      ex.id === exchange.id ? { ...ex, status: 'Revoked' } : ex
    ));
    toast.success(`Exchange ${exchange.id} has been revoked`);
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'Low': return 'text-green-600';
      case 'Medium': return 'text-yellow-600';
      case 'High': return 'text-red-600';
      default: return 'text-neutral-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="bg-white border border-neutral-200 rounded-lg p-4">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex-1 relative min-w-[300px]">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              placeholder="Search by Exchange Name, Recipient, or Status..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900"
            />
          </div>
          
          <div className="w-[180px]">
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Status</SelectItem>
                <SelectItem value="Sent">Sent</SelectItem>
                <SelectItem value="Viewed">Viewed</SelectItem>
                <SelectItem value="Expired">Expired</SelectItem>
                <SelectItem value="Revoked">Revoked</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="w-[180px]">
            <Select value={filterRecipientType} onValueChange={setFilterRecipientType}>
              <SelectTrigger>
                <SelectValue placeholder="Recipient Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Types</SelectItem>
                <SelectItem value="Customer">Customer</SelectItem>
                <SelectItem value="Provider">Provider</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="w-[180px]">
            <Select value={filterExpiry} onValueChange={setFilterExpiry}>
              <SelectTrigger>
                <SelectValue placeholder="Expiry Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Expired">Expired</SelectItem>
                <SelectItem value="Revoked">Revoked</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Exchanges Table */}
      <div className="bg-white border border-neutral-200 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-neutral-50 border-b border-neutral-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider">Exchange</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider">Recipient</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider">Documents</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider">Expiry</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider">Last Activity</th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-neutral-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200">
            {filteredExchanges.map((exchange) => (
              <tr 
                key={exchange.id} 
                className="hover:bg-neutral-50 transition-colors cursor-pointer"
                onClick={() => onExchangeSelect(exchange)}
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex-1">
                      <div className="text-sm font-medium text-neutral-900">{exchange.title}</div>
                      <div className="text-xs text-neutral-500">{exchange.id}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-neutral-900">{exchange.recipient}</div>
                  <div className="text-xs text-neutral-500">
                    <span className={`inline-flex px-1.5 py-0.5 rounded text-[10px] font-medium ${
                      exchange.recipientType === 'Customer' ? 'bg-blue-50 text-blue-700' : 'bg-purple-50 text-purple-700'
                    }`}>
                      {exchange.recipientType}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${getExchangeStatusColor(exchange.status)}`}>
                    {exchange.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-neutral-900">{exchange.sentCount || 0} sent</div>
                  <div className="text-xs text-neutral-500">{exchange.receivedCount || 0} received</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-neutral-900">{exchange.expiresAt || 'N/A'}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-neutral-500">{exchange.lastModified}</div>
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
                          onExchangeSelect(exchange);
                        }}
                        className="cursor-pointer"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={async (e) => {
                          e.stopPropagation();
                          try {
                            await copyToClipboard(`${window.location.origin}/exchange/${exchange.id}`);
                            toast.success('Link copied to clipboard');
                          } catch (error) {
                            toast.error('Failed to copy link');
                          }
                        }}
                        className="cursor-pointer"
                      >
                        <Copy className="w-4 h-4 mr-2" />
                        Copy Link
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      {exchange.status !== 'Revoked' && (
                        <DropdownMenuItem 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRevoke(exchange);
                          }}
                          className="cursor-pointer text-red-600 focus:text-red-700 focus:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Revoke Access
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredExchanges.length === 0 && (
          <div className="p-12 text-center">
            <div className="max-w-md mx-auto">
              <div className="text-neutral-700 font-medium mb-2">
                No external document access has been approved yet.
              </div>
              <div className="text-sm text-neutral-500">
                When governed access is granted, Secure Exchange will retain a complete decision record.
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}