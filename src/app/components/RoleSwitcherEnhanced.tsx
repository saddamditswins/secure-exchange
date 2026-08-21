import { useState } from 'react';
import { ChevronRight, FileText, PenLine, Users } from 'lucide-react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';

interface RoleSwitcherEnhancedProps {
  onSelectRole: (
    role:
      | 'Super Admin'
      | 'Tenant Admin'
      | 'Primary Operations User'
      | 'External Participant - Secure Share'
      | 'External Participant - E-Sign'
      | 'External Participant - E-Sign On Device'
  ) => void;
}

export function RoleSwitcherEnhanced({ onSelectRole }: RoleSwitcherEnhancedProps) {
  const [showESignOptions, setShowESignOptions] = useState(false);

  const roles = [
    {
      id: 'Super Admin' as const,
      title: 'Super Admin',
      description: 'Platform-level tenant management',
      capabilities: 'Manage tenants, view platform metrics',
      icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4',
      color: 'bg-purple-50 border-purple-200 text-purple-900',
      badgeColor: 'bg-purple-100 text-purple-700',
      dotColor: 'bg-purple-500',
    },
    {
      id: 'Tenant Admin' as const,
      title: 'Tenant Admin',
      description: 'Governance oversight and decision management',
      capabilities: 'Review decisions, approve/deny access',
      icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
      color: 'bg-blue-50 border-blue-200 text-blue-900',
      badgeColor: 'bg-blue-100 text-blue-700',
      dotColor: 'bg-blue-500',
    },
    {
      id: 'Primary Operations User' as const,
      title: 'Primary Operations User',
      description: 'Create workspaces and prepare documents for sharing',
      capabilities: 'Create workspaces, import documents',
      icon: 'M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z',
      color: 'bg-green-50 border-green-200 text-green-900',
      badgeColor: 'bg-green-100 text-green-700',
      dotColor: 'bg-green-500',
    },
    {
      id: 'External Participant - Secure Share' as const,
      title: 'External Participant - Secure Share',
      description: 'No login • Link-based access only • View & upload',
      capabilities: 'View/download/upload documents',
      icon: 'M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z',
      color: 'bg-amber-50 border-amber-200 text-amber-900',
      badgeColor: 'bg-amber-100 text-amber-700',
      dotColor: 'bg-amber-500',
    },
  ];

  const handleESignClick = () => {
    setShowESignOptions(true);
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col">
      {/* Header */}
      <header className="p-6 bg-white border-b border-neutral-200">
        <div className="max-w-full md:mx-20">
          <div className="flex items-center gap-3">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-emerald-500 rounded-lg">
              <svg
                className="w-7 h-7 text-white"
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
              <h1 className="text-neutral-900">Secure Exchange</h1>
              <p className="text-sm text-neutral-600">Role Selection</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-6 max-w-[1400px] mx-auto">
        <div className="w-full md:mx-20">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-neutral-100 rounded-full mb-4">
              <svg
                className="w-8 h-8 text-neutral-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <h2 className="text-neutral-900 mb-2">Select Your Role</h2>
            <p className="text-neutral-600">
              Choose a role to explore different features and workflows
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {/* First 3 roles */}
            {roles.slice(0, 3).map((role) => (
              <button
                key={role.id}
                onClick={() => onSelectRole(role.id)}
                className={`p-6 border-2 rounded-lg text-left transition-all hover:shadow-lg cursor-pointer ${role.color}`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${role.badgeColor}`}>
                      <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d={role.icon}
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-medium">{role.title}</h3>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 opacity-50" />
                </div>
                <p className="text-sm opacity-75 mb-3">{role.description}</p>
                <div className="pt-3 border-t border-current opacity-70">
                  <div className="flex items-start gap-2">
                    <div className={`w-2 h-2 ${role.dotColor} rounded-full mt-1.5`}></div>
                    <div className="text-xs opacity-85">{role.capabilities}</div>
                  </div>
                </div>
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Secure Share */}
            {roles.slice(3, 4).map((role) => (
              <button
                key={role.id}
                onClick={() => onSelectRole(role.id)}
                className={`p-6 border-2 rounded-lg text-left transition-all hover:shadow-lg cursor-pointer ${role.color}`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${role.badgeColor}`}>
                      <FileText className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-medium">{role.title}</h3>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 opacity-50" />
                </div>
                <p className="text-sm opacity-75 mb-3">{role.description}</p>
                <div className="pt-3 border-t border-current opacity-70">
                  <div className="flex items-start gap-2">
                    <div className={`w-2 h-2 ${role.dotColor} rounded-full mt-1.5`}></div>
                    <div className="text-xs opacity-85">{role.capabilities}</div>
                  </div>
                </div>
              </button>
            ))}

            {/* E-Sign with Options */}
            <button
              onClick={handleESignClick}
              className="p-6 border-2 rounded-lg text-left transition-all hover:shadow-lg cursor-pointer bg-orange-50 border-orange-200 text-orange-900"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-orange-100 text-orange-700">
                    <PenLine className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-medium">External Participant - E-Sign</h3>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 opacity-50" />
              </div>
              <p className="text-sm opacity-75 mb-3">
                No login • Link-based access only • Electronic signing
              </p>
              <div className="pt-3 border-t border-current opacity-70">
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-1.5"></div>
                  <div className="text-xs opacity-85">View and sign assigned documents</div>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* E-Sign Options Modal */}
      <Dialog open={showESignOptions} onOpenChange={setShowESignOptions}>
        <DialogContent className="max-w-2xl bg-white border-neutral-200">
          <DialogHeader>
            <DialogTitle>Select E-Sign Mode</DialogTitle>
            <DialogDescription>
              Choose how participants will sign the documents:
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Remote Signing */}
              <button
                onClick={() => {
                  onSelectRole('External Participant - E-Sign');
                  setShowESignOptions(false);
                }}
                className="p-6 border-2 border-neutral-200 rounded-lg text-left transition-all hover:shadow-lg hover:border-emerald-300 cursor-pointer bg-neutral-50 hover:bg-emerald-50"
              >
                <div className="flex items-start gap-3 mb-3">
                  <div className="p-2 rounded-lg bg-emerald-100">
                    <FileText className="w-6 h-6 text-emerald-700" />
                  </div>
                  <div>
                    <h3 className="font-medium text-neutral-900 mb-1">Remote</h3>
                    <p className="text-xs text-neutral-600">
                      Each participant signs via their own secure link
                    </p>
                  </div>
                </div>
                <div className="space-y-2 text-xs text-neutral-600">
                  <div className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-1"></div>
                    <span>Individual email/SMS authentication</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-1"></div>
                    <span>Sign from any device, anywhere</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-1"></div>
                    <span>Signing order enforcement</span>
                  </div>
                </div>
              </button>

              {/* On This Device */}
              <button
                onClick={() => {
                  onSelectRole('External Participant - E-Sign On Device');
                  setShowESignOptions(false);
                }}
                className="p-6 border-2 border-neutral-200 rounded-lg text-left transition-all hover:shadow-lg hover:border-blue-300 cursor-pointer bg-neutral-50 hover:bg-blue-50"
              >
                <div className="flex items-start gap-3 mb-3">
                  <div className="p-2 rounded-lg bg-blue-100">
                    <Users className="w-6 h-6 text-blue-700" />
                  </div>
                  <div>
                    <h3 className="font-medium text-neutral-900 mb-1">On This Device</h3>
                    <p className="text-xs text-neutral-600">
                      Multiple participants sign sequentially on same device
                    </p>
                  </div>
                </div>
                <div className="space-y-2 text-xs text-neutral-600">
                  <div className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1"></div>
                    <span>In-person signing ceremony</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1"></div>
                    <span>One device, multiple signers</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1"></div>
                    <span>Sequential signing flow</span>
                  </div>
                </div>
              </button>
            </div>

            <div className="flex justify-end pt-4">
              <Button
                onClick={() => setShowESignOptions(false)}
                variant="ghost"
                className="text-neutral-600"
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}