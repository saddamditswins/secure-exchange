import { useState, useEffect } from 'react';
import { ViewType } from '../App';
import { useTranslation } from 'react-i18next';
import { 
  LayoutDashboard, 
  FolderKanban, 
  Users, 
  FileText, 
  Settings, 
  ChevronDown, 
  ChevronRight,
  ShieldCheck,
  Link2,
  Building2,
  FolderOpen,
  ScrollText
} from 'lucide-react';
import { cn } from './ui/utils';

interface SidebarProps {
  currentView: ViewType;
  onNavigate: (view: ViewType) => void;
  className?: string;
  userRole?: string;
}

export function Sidebar({ currentView, onNavigate, className = '', userRole }: SidebarProps) {
  const { t } = useTranslation();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  useEffect(() => {
    if (currentView.startsWith('settings')) {
      setIsSettingsOpen(true);
    }
  }, [currentView]);

  const toggleSettings = () => {
    setIsSettingsOpen(!isSettingsOpen);
  };

  const isSettingsActive = currentView.startsWith('settings');

  return (
    <aside className={cn('w-64 shrink-0 bg-[#153240] border-r border-[#243F4D] flex flex-col', className)}>
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
            <div className="text-xs text-neutral-400">Workspace Admin</div>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 overflow-y-auto">
        <ul className="space-y-1">
          <li>
            <button
              onClick={() => onNavigate('dashboard')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors cursor-pointer ${
                currentView === 'dashboard'
                  ? 'bg-emerald-500 text-neutral-900'
                  : 'text-neutral-400 hover:bg-[#243F4D] hover:text-[#FFFFFF]'
              }`}
            >
              <LayoutDashboard className="w-5 h-5" />
              <span>Dashboard</span>
            </button>
          </li>
          <li>
            <button
              onClick={() => onNavigate('workspaces')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors cursor-pointer ${
                currentView === 'workspaces' || currentView === 'workspace-details'
                  ? 'bg-emerald-500 text-neutral-900'
                  : 'text-neutral-400 hover:bg-[#243F4D] hover:text-[#FFFFFF]'
              }`}
            >
              <FolderKanban className="w-5 h-5" />
              <span>Workspaces</span>
            </button>
          </li>
          <li>
            <button
              onClick={() => onNavigate('clients')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors cursor-pointer ${
                currentView === 'clients'
                  ? 'bg-emerald-500 text-neutral-900'
                  : 'text-neutral-400 hover:bg-[#243F4D] hover:text-[#FFFFFF]'
              }`}
            >
              <Users className="w-5 h-5" />
              <span>Clients</span>
            </button>
          </li>
          <li>
            <button
              onClick={() => onNavigate('documents')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors cursor-pointer ${
                currentView === 'documents'
                  ? 'bg-emerald-500 text-neutral-900'
                  : 'text-neutral-400 hover:bg-[#243F4D] hover:text-[#FFFFFF]'
              }`}
            >
              <FolderOpen className="w-5 h-5" />
              <span>Documents</span>
            </button>
          </li>
          <li>
            <button
              onClick={() => onNavigate('audit-log')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors cursor-pointer ${
                currentView === 'audit-log'
                  ? 'bg-emerald-500 text-neutral-900'
                  : 'text-neutral-400 hover:bg-[#243F4D] hover:text-[#FFFFFF]'
              }`}
            >
              <ScrollText className="w-5 h-5" />
              <span>Audit Log</span>
            </button>
          </li>

          {/* Settings Section - Hidden for Primary Operations User */}
          {userRole !== 'Primary Operations User' && (
            <li>
              <button
                onClick={toggleSettings}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-colors cursor-pointer ${
                  isSettingsActive && !isSettingsOpen
                    ? 'bg-emerald-500 text-neutral-900'
                    : 'text-neutral-400 hover:bg-[#243F4D] hover:text-[#FFFFFF]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Settings className="w-5 h-5" />
                  <span>Settings</span>
                </div>
                {isSettingsOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              </button>

              {isSettingsOpen && (
                <ul className="mt-1 ml-4 space-y-1 border-l border-[#243F4D] pl-2">
                  <li>
                    <button
                      onClick={() => onNavigate('settings-org')}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors cursor-pointer text-sm ${
                        currentView === 'settings-org'
                          ? 'bg-[#243F4D] text-[#FFFFFF]'
                          : 'text-neutral-400 hover:bg-[#243F4D] hover:text-[#FFFFFF]'
                      }`}
                    >
                      <Building2 className="w-4 h-4" />
                      <span>Organization</span>
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => onNavigate('settings-users')}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors cursor-pointer text-sm ${
                        currentView === 'settings-users'
                          ? 'bg-[#243F4D] text-[#FFFFFF]'
                          : 'text-neutral-400 hover:bg-[#243F4D] hover:text-[#FFFFFF]'
                      }`}
                    >
                      <Users className="w-4 h-4" />
                      <span>Users</span>
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => onNavigate('settings-roles')}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors cursor-pointer text-sm ${
                        currentView === 'settings-roles'
                          ? 'bg-[#243F4D] text-[#FFFFFF]'
                          : 'text-neutral-400 hover:bg-[#243F4D] hover:text-[#FFFFFF]'
                      }`}
                    >
                      <ShieldCheck className="w-4 h-4" />
                      <span>Roles & Permissions</span>
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => onNavigate('settings-integrations')}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors cursor-pointer text-sm ${
                        currentView === 'settings-integrations'
                          ? 'bg-[#243F4D] text-[#FFFFFF]'
                          : 'text-neutral-400 hover:bg-[#243F4D] hover:text-[#FFFFFF]'
                      }`}
                    >
                      <Link2 className="w-4 h-4" />
                      <span>Integrations</span>
                    </button>
                  </li>
                </ul>
              )}
            </li>
          )}
        </ul>
      </nav>
    </aside>
  );
}