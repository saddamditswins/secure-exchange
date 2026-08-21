import { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';

interface AuditLog {
  id: string;
  timestamp: string;
  exchangeId: string;
  exchangeTitle: string;
  actor: string;
  actorRole: string;
  action: string;
  details: string;
  ipAddress: string;
}

export function AuditLogView() {
  const [filterAction, setFilterAction] = useState<string>('All');

  const mockAuditLogs: AuditLog[] = [
    {
      id: 'AL-2024-1145',
      timestamp: '2024-12-30 09:15:23',
      exchangeId: 'EX-2024-0145',
      exchangeTitle: 'Q4 Financial Review - Board Approval',
      actor: 'Sarah Mitchell',
      actorRole: 'Tenant Admin',
      action: 'Access Granted',
      details: 'Granted view access to external participant: Lisa Anderson',
      ipAddress: '192.168.1.45',
    },
    {
      id: 'AL-2024-1144',
      timestamp: '2024-12-29 16:42:11',
      exchangeId: 'EX-2024-0145',
      exchangeTitle: 'Q4 Financial Review - Board Approval',
      actor: 'System',
      actorRole: 'System',
      action: 'Reminder Sent',
      details: 'Automatic reminder sent to 2 pending participants',
      ipAddress: 'System',
    },
    {
      id: 'AL-2024-1143',
      timestamp: '2024-12-29 14:30:05',
      exchangeId: 'EX-2024-0144',
      exchangeTitle: 'Vendor Contract - Legal Review',
      actor: 'Sarah Mitchell',
      actorRole: 'Tenant Admin',
      action: 'Exchange Created',
      details: 'New exchange created in Draft status',
      ipAddress: '192.168.1.45',
    },
    {
      id: 'AL-2024-1142',
      timestamp: '2024-12-28 16:45:33',
      exchangeId: 'EX-2024-0145',
      exchangeTitle: 'Q4 Financial Review - Board Approval',
      actor: 'John Smith',
      actorRole: 'External Participant',
      action: 'Document Signed',
      details: 'Signed document: Board_Resolution_Draft.pdf',
      ipAddress: '203.45.67.89',
    },
    {
      id: 'AL-2024-1141',
      timestamp: '2024-12-27 09:20:18',
      exchangeId: 'EX-2024-0145',
      exchangeTitle: 'Q4 Financial Review - Board Approval',
      actor: 'Maria Garcia',
      actorRole: 'External Participant',
      action: 'Documents Signed',
      details: 'Signed 2 documents: Q4_Financial_Report_2024.pdf, Board_Resolution_Draft.pdf',
      ipAddress: '198.51.100.42',
    },
    {
      id: 'AL-2024-1140',
      timestamp: '2024-12-26 11:30:55',
      exchangeId: 'EX-2024-0145',
      exchangeTitle: 'Q4 Financial Review - Board Approval',
      actor: 'Robert Chen',
      actorRole: 'External Participant',
      action: 'Document Viewed',
      details: 'Viewed document: Q4_Financial_Report_2024.pdf',
      ipAddress: '172.16.0.99',
    },
    {
      id: 'AL-2024-1139',
      timestamp: '2024-12-20 14:15:42',
      exchangeId: 'EX-2024-0145',
      exchangeTitle: 'Q4 Financial Review - Board Approval',
      actor: 'James Rodriguez',
      actorRole: 'Primary Operations User',
      action: 'Document Added',
      details: 'Uploaded document: Supporting_Documents.zip (12.1 MB)',
      ipAddress: '192.168.1.67',
    },
    {
      id: 'AL-2024-1138',
      timestamp: '2024-12-18 13:22:10',
      exchangeId: 'EX-2024-0141',
      exchangeTitle: 'Partnership Agreement - Review',
      actor: 'James Rodriguez',
      actorRole: 'Primary Operations User',
      action: 'Status Changed',
      details: 'Changed exchange status from Active to Approved',
      ipAddress: '192.168.1.67',
    },
    {
      id: 'AL-2024-1137',
      timestamp: '2024-12-15 10:30:00',
      exchangeId: 'EX-2024-0145',
      exchangeTitle: 'Q4 Financial Review - Board Approval',
      actor: 'Sarah Mitchell',
      actorRole: 'Tenant Admin',
      action: 'Exchange Created',
      details: 'New exchange created and set to Active status',
      ipAddress: '192.168.1.45',
    },
  ];

  const actions = [
    'All',
    'Exchange Created',
    'Document Added',
    'Document Viewed',
    'Document Signed',
    'Access Granted',
    'Status Changed',
    'Reminder Sent',
  ];

  const filteredLogs = filterAction === 'All' 
    ? mockAuditLogs 
    : mockAuditLogs.filter(log => log.action === filterAction);

  return (
    <div className="mx-auto w-full max-w-[1600px] p-4 sm:p-6 lg:p-8">
      <div className="mb-8">
        <h2 className="text-neutral-900 mb-2">Audit Log</h2>
        <p className="text-sm text-neutral-600">Complete audit trail for compliance and security oversight</p>
      </div>

      <div className="mb-6">
        <div className="bg-white border border-neutral-200 rounded-lg p-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <label className="text-sm font-medium text-neutral-700 whitespace-nowrap">
              Filter by Action:
            </label>
            <div className="w-full sm:w-[240px]">
              <Select
                value={filterAction}
                onValueChange={(value) => setFilterAction(value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {actions.map((action) => (
                    <SelectItem key={action} value={action}>
                      {action}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {filterAction !== 'All' && (
              <button
                onClick={() => setFilterAction('All')}
                className="text-sm text-neutral-600 hover:text-neutral-900 underline cursor-pointer"
              >
                Clear filter
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white border border-neutral-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
        <table className="w-full min-w-[820px]">
          <thead className="bg-neutral-50 border-b border-neutral-200">
            <tr>
              <th className="text-left px-6 py-3 text-sm text-neutral-600">Timestamp</th>
              <th className="text-left px-6 py-3 text-sm text-neutral-600">Exchange</th>
              <th className="text-left px-6 py-3 text-sm text-neutral-600">Actor</th>
              <th className="text-left px-6 py-3 text-sm text-neutral-600">Action</th>
              <th className="text-left px-6 py-3 text-sm text-neutral-600">Details</th>
              <th className="text-left px-6 py-3 text-sm text-neutral-600">IP Address</th>
            </tr>
          </thead>
          <tbody>
            {filteredLogs.map((log) => (
              <tr key={log.id} className="border-b border-neutral-100">
                <td className="px-6 py-4 text-sm text-neutral-700">{log.timestamp}</td>
                <td className="px-6 py-4">
                  <div className="text-sm text-neutral-900">{log.exchangeId}</div>
                  <div className="text-xs text-neutral-500">{log.exchangeTitle}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-neutral-900">{log.actor}</div>
                  <div className="text-xs text-neutral-500">{log.actorRole}</div>
                </td>
                <td className="px-6 py-4">
                  <ActionBadge action={log.action} />
                </td>
                <td className="px-6 py-4 text-sm text-neutral-700 max-w-md">{log.details}</td>
                <td className="px-6 py-4 text-sm text-neutral-600">{log.ipAddress}</td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>
    </div>
  );
}

function ActionBadge({ action }: { action: string }) {
  const styles: Record<string, string> = {
    'Exchange Created': 'bg-blue-50 text-blue-700',
    'Document Added': 'bg-green-50 text-green-700',
    'Document Viewed': 'bg-neutral-100 text-neutral-700',
    'Document Signed': 'bg-green-50 text-green-700',
    'Access Granted': 'bg-amber-50 text-amber-700',
    'Status Changed': 'bg-blue-50 text-blue-700',
    'Reminder Sent': 'bg-neutral-100 text-neutral-700',
  };

  return (
    <span className={`inline-flex px-2.5 py-1 rounded text-xs whitespace-nowrap ${styles[action] || 'bg-neutral-100 text-neutral-700'}`}>
      {action}
    </span>
  );
}