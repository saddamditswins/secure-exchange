import { useState } from 'react';
import { 
  Shield, 
  FileText, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Package, 
  PenTool,
  Key,
  XCircle,
  Download,
  Upload,
  Pause
} from 'lucide-react';

export type NotificationType = 'governance' | 'signing' | 'security' | 'documents';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  description: string;
  timestamp: string;
  isRead: boolean;
  workspaceId?: string;
  exchangeId?: string;
  targetTab?: 'activity' | 'evidence' | 'participants' | 'documents';
}

interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: Notification[];
  onMarkAllAsRead: () => void;
  onNotificationClick: (notification: Notification) => void;
  unreadCount: number;
}

export function NotificationPanel({
  isOpen,
  onClose,
  notifications,
  onMarkAllAsRead,
  onNotificationClick,
  unreadCount
}: NotificationPanelProps) {
  const [activeTab, setActiveTab] = useState<'all' | NotificationType>('all');

  if (!isOpen) return null;

  const filteredNotifications = activeTab === 'all' 
    ? notifications 
    : notifications.filter(n => n.type === activeTab);

  const getIcon = (type: NotificationType) => {
    switch (type) {
      case 'governance':
        return <Shield className="w-4 h-4" />;
      case 'signing':
        return <PenTool className="w-4 h-4" />;
      case 'security':
        return <Key className="w-4 h-4" />;
      case 'documents':
        return <FileText className="w-4 h-4" />;
    }
  };

  const getIconColor = (notification: Notification) => {
    // Check for warning/error states
    if (notification.title.toLowerCase().includes('expir') || 
        notification.title.toLowerCase().includes('stalled') ||
        notification.title.toLowerCase().includes('approaching')) {
      return 'text-amber-400';
    }
    if (notification.title.toLowerCase().includes('failed') || 
        notification.title.toLowerCase().includes('revoked')) {
      return 'text-rose-400';
    }
    if (notification.title.toLowerCase().includes('completed') || 
        notification.title.toLowerCase().includes('approved') ||
        notification.title.toLowerCase().includes('verified') ||
        notification.title.toLowerCase().includes('generated')) {
      return 'text-emerald-400';
    }
    return 'text-blue-400';
  };

  const tabs = [
    { id: 'all' as const, label: 'All' },
    { id: 'governance' as const, label: 'Governance' },
    { id: 'signing' as const, label: 'Signing' },
    { id: 'security' as const, label: 'Security' },
  ];

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 z-40"
        onClick={onClose}
      />
      
      {/* Panel */}
      <div className="fixed left-4 right-4 top-16 mt-2 max-h-[70vh] sm:left-auto sm:w-[420px] sm:max-h-[600px] bg-[#153240] border border-[#243F4D] rounded-lg shadow-2xl shadow-black/40 z-50 flex flex-col">
        {/* Header */}
        <div className="px-4 py-3 border-b border-[#243F4D]">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-[#ffffff]">Notifications</h3>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={onMarkAllAsRead}
                  className="text-xs text-emerald-400 hover:text-emerald-300 font-medium transition-colors cursor-pointer"
                >
                  Mark all as read
                </button>
              )}
              <button
                onClick={onClose}
                className="p-1 text-neutral-400 hover:text-[#ffffff] transition-colors cursor-pointer"
              >
                <XCircle className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1">
            {tabs.map(tab => {
              const tabCount = tab.id === 'all' 
                ? notifications.length 
                : notifications.filter(n => n.type === tab.id).length;
              
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all cursor-pointer ${
                    activeTab === tab.id
                      ? 'bg-[#1E3A4A] text-[#ffffff] border border-[#243F4D]'
                      : 'text-neutral-400 hover:text-[#ffffff] hover:bg-[#1E3A4A]/50'
                  }`}
                >
                  {tab.label}
                  {tabCount > 0 && (
                    <span className="ml-1.5 text-[10px] opacity-70">({tabCount})</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto">
          {filteredNotifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 px-4">
              <div className="w-12 h-12 bg-[#1E3A4A] rounded-full flex items-center justify-center mb-3">
                <Shield className="w-6 h-6 text-neutral-500" />
              </div>
              <p className="text-sm text-neutral-400">No notifications yet</p>
              <p className="text-xs text-neutral-500 mt-1">You're all caught up!</p>
            </div>
          ) : (
            <div className="divide-y divide-[#243F4D]">
              {filteredNotifications.map(notification => (
                <div
                  key={notification.id}
                  onClick={() => onNotificationClick(notification)}
                  className={`px-4 py-3 cursor-pointer transition-colors hover:bg-[#1E3A4A] ${
                    !notification.isRead ? 'bg-[#1A2F3D]' : ''
                  }`}
                >
                  <div className="flex gap-3">
                    {/* Status Dot */}
                    {!notification.isRead && (
                      <div className="flex-shrink-0 pt-1">
                        <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                      </div>
                    )}
                    {notification.isRead && (
                      <div className="flex-shrink-0 pt-1">
                        <div className="w-2 h-2 bg-transparent"></div>
                      </div>
                    )}

                    {/* Icon */}
                    <div className={`flex-shrink-0 pt-0.5 ${getIconColor(notification)}`}>
                      {getIcon(notification.type)}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className={`text-sm font-medium mb-0.5 ${
                        !notification.isRead ? 'text-[#ffffff]' : 'text-neutral-300'
                      }`}>
                        {notification.title}
                      </div>
                      <div className="text-xs text-neutral-400 mb-1.5 line-clamp-2">
                        {notification.description}
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="text-[10px] text-neutral-500">
                          {notification.timestamp}
                        </div>
                        {notification.exchangeId && (
                          <div className="text-[10px] text-emerald-500 font-medium">
                            Open Exchange →
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {filteredNotifications.length > 0 && (
          <div className="px-4 py-3 border-t border-[#243F4D] text-center">
            <button className="text-xs text-neutral-400 hover:text-[#ffffff] font-medium transition-colors cursor-pointer">
              Load older notifications
            </button>
          </div>
        )}
      </div>
    </>
  );
}

// Dummy notification data generator
export function generateDummyNotifications(): Notification[] {
  return [
    {
      id: 'N-001',
      type: 'governance',
      title: 'Access Approved',
      description: 'External access committed for Workspace WS-1004 / Exchange EX-2012',
      timestamp: '01/07/2026 10:45 AM',
      isRead: false,
      workspaceId: 'WS-1004',
      exchangeId: 'EX-2012',
      targetTab: 'activity'
    },
    {
      id: 'N-002',
      type: 'signing',
      title: 'Signing Completed',
      description: 'All required fields completed for Exchange EX-2012 by legal@partners.com',
      timestamp: '01/07/2026 09:32 AM',
      isRead: false,
      workspaceId: 'WS-1004',
      exchangeId: 'EX-2012',
      targetTab: 'activity'
    },
    {
      id: 'N-003',
      type: 'security',
      title: 'OTP Verified',
      description: 'OTP successfully verified for legal@partners.com on Exchange EX-2012',
      timestamp: '01/07/2026 08:15 AM',
      isRead: false,
      workspaceId: 'WS-1004',
      exchangeId: 'EX-2012',
      targetTab: 'participants'
    },
    {
      id: 'N-004',
      type: 'governance',
      title: 'Expiry Approaching',
      description: 'Exchange EX-2014 expires in 24 hours - review for renewal or extension',
      timestamp: '01/07/2026 07:00 AM',
      isRead: true,
      workspaceId: 'WS-1006',
      exchangeId: 'EX-2014',
      targetTab: 'activity'
    },
    {
      id: 'N-005',
      type: 'governance',
      title: 'Evidence Package Generated',
      description: 'Immutable evidence package created for Exchange EX-2012 (8 documents, 3 signatures)',
      timestamp: '01/06/2026 05:45 PM',
      isRead: true,
      workspaceId: 'WS-1004',
      exchangeId: 'EX-2012',
      targetTab: 'evidence'
    },
    {
      id: 'N-006',
      type: 'signing',
      title: 'Signing Started',
      description: 'Participant opened signing link for Exchange EX-2012 from IP 192.168.1.45',
      timestamp: '01/06/2026 03:20 PM',
      isRead: true,
      workspaceId: 'WS-1004',
      exchangeId: 'EX-2012',
      targetTab: 'activity'
    },
    {
      id: 'N-007',
      type: 'governance',
      title: 'Access Revoked',
      description: 'Access revoked for auditor@external.com on Exchange EX-2009 per governance policy',
      timestamp: '01/06/2026 02:10 PM',
      isRead: true,
      workspaceId: 'WS-1003',
      exchangeId: 'EX-2009',
      targetTab: 'participants'
    },
    {
      id: 'N-008',
      type: 'security',
      title: 'Failed OTP Attempts',
      description: '3 failed OTP attempts detected for new.hire@example.com - access temporarily blocked',
      timestamp: '01/06/2026 01:15 PM',
      isRead: true,
      workspaceId: 'WS-1005',
      exchangeId: 'EX-2015',
      targetTab: 'activity'
    },
    {
      id: 'N-009',
      type: 'documents',
      title: 'Document Uploaded',
      description: 'New document "Compliance-Audit-Q4-2025.pdf" uploaded to Exchange EX-2012',
      timestamp: '01/06/2026 11:30 AM',
      isRead: true,
      workspaceId: 'WS-1004',
      exchangeId: 'EX-2012',
      targetTab: 'documents'
    },
    {
      id: 'N-010',
      type: 'signing',
      title: 'Signing Stalled',
      description: 'No signature activity for 3 days on Exchange EX-2018 - consider follow-up',
      timestamp: '01/05/2026 09:00 AM',
      isRead: true,
      workspaceId: 'WS-1007',
      exchangeId: 'EX-2018',
      targetTab: 'activity'
    },
    {
      id: 'N-011',
      type: 'security',
      title: 'Non-OTP Access Granted',
      description: 'Access granted without OTP for Exchange EX-2021 (policy allows trusted partner)',
      timestamp: '01/05/2026 08:30 AM',
      isRead: true,
      workspaceId: 'WS-1008',
      exchangeId: 'EX-2021',
      targetTab: 'participants'
    },
    {
      id: 'N-012',
      type: 'documents',
      title: 'Document Downloaded',
      description: 'Document "Contract-Amendment.pdf" downloaded by external participant per permissions',
      timestamp: '01/04/2026 04:15 PM',
      isRead: true,
      workspaceId: 'WS-1004',
      exchangeId: 'EX-2012',
      targetTab: 'activity'
    }
  ];
}