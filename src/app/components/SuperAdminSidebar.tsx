import { SuperAdminViewType } from '../App';
import { cn } from './ui/utils';

interface SuperAdminSidebarProps {
  currentView: SuperAdminViewType;
  onNavigate: (view: SuperAdminViewType) => void;
  className?: string;
}

export function SuperAdminSidebar({ currentView, onNavigate, className = '' }: SuperAdminSidebarProps) {
  const navItems: { id: SuperAdminViewType; label: string; icon: string }[] = [
    { 
      id: 'dashboard',
      label: 'Dashboard',
      icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6'
    },
    { 
      id: 'organizations',
      label: 'Organizations',
      icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4'
    },
    { 
      id: 'users',
      label: 'Users',
      icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z'
    },
    { 
      id: 'audit-logs',
      label: 'Audit Logs',
      icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
    },
  ];

  return (
    <aside className={cn('w-64 shrink-0 bg-[#153240] border-r border-[#243F4D] flex flex-col', className)}>
      {/* Logo */}
      <div className="h-16 flex items-center px-6 border-b border-[#243F4D]">
        <div className="flex items-center gap-3">
          <div className="inline-flex items-center justify-center w-10 h-10 bg-emerald-500 rounded-lg">
            <svg
              className="w-6 h-6 text-[#153240]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              />
            </svg>
          </div>
          <div>
            <div className="text-[#FFFFFF] font-medium">Secure Exchange</div>
            <div className="text-xs text-neutral-400">Platform Admin</div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-colors cursor-pointer ${
              currentView === item.id
                ? 'bg-emerald-500 text-neutral-900'
                : 'text-neutral-400 hover:bg-[#243F4D] hover:text-[#FFFFFF]'
            }`}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={item.icon}
              />
            </svg>
            {item.label}
          </button>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-[#243F4D]">
        <div className="text-xs text-neutral-400">
          <div>Platform Version</div>
          <div className="text-white mt-0.5">v2.4.1</div>
        </div>
      </div>
    </aside>
  );
}