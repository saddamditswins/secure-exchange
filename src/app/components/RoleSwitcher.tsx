interface RoleSwitcherProps {
  onSelectRole: (
    role:
      | "Super Admin"
      | "Tenant Admin"
      | "Primary Operations User"
      | "External Participant - Secure Share"
      | "External Participant - E-Sign",
  ) => void;
}

export function RoleSwitcher({
  onSelectRole,
}: RoleSwitcherProps) {
  const roles = [
    {
      id: "Super Admin" as const,
      title: "Super Admin",
      description: "Platform-level tenant management",
      capabilities: "Manage tenants, view platform metrics",
      icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4",
      color: "bg-purple-50 border-purple-200 text-purple-900",
      badgeColor: "bg-purple-100 text-purple-700",
      dotColor: "bg-purple-500",
    },
    {
      id: "Tenant Admin" as const,
      title: "Tenant Admin",
      description:
        "Governance oversight and decision management",
      capabilities: "Review decisions, approve/deny access",
      icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
      color: "bg-blue-50 border-blue-200 text-blue-900",
      badgeColor: "bg-blue-100 text-blue-700",
      dotColor: "bg-blue-500",
    },
    {
      id: "Primary Operations User" as const,
      title: "Primary Operations User",
      description:
        "Create workspaces and prepare documents for sharing",
      capabilities: "Create workspaces, import documents",
      icon: "M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z",
      color: "bg-green-50 border-green-200 text-green-900",
      badgeColor: "bg-green-100 text-green-700",
      dotColor: "bg-green-500",
    },
    {
      id: "External Participant - Secure Share" as const,
      title: "External Participant - Secure Share",
      description:
        "No login • Link-based access only • Time-bound & revocable",
      capabilities: "View/sign assigned documents only",
      icon: "M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z",
      color: "bg-amber-50 border-amber-200 text-amber-900",
      badgeColor: "bg-amber-100 text-amber-700",
      dotColor: "bg-amber-500",
    },
    {
      id: "External Participant - E-Sign" as const,
      title: "External Participant - E-Sign",
      description:
        "No login • Link-based access only • Time-bound & revocable",
      capabilities: "View/sign assigned documents only",
      icon: "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z",
      color: "bg-orange-50 border-orange-200 text-orange-900",
      badgeColor: "bg-orange-100 text-orange-700",
      dotColor: "bg-orange-500",
    },
  ];

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col">
      {/* Header */}
      <header className="p-6 bg-white border-b border-neutral-200">
        <div className="max-w-full mx-20">
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
              <h1 className="text-neutral-900">
                Secure Exchange
              </h1>
              <p className="text-sm text-neutral-600">
                Role Selection
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-6 max-w-[1400px] mx-auto">
        <div className="w-full mx-20">
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
            <h2 className="text-neutral-900 mb-2">
              Select Your Role
            </h2>
            <p className="text-neutral-600">
              Choose a role to explore different features and
              workflows
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
                    <div
                      className={`p-2 rounded-lg ${role.badgeColor}`}
                    >
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
                      <h3 className="font-medium">
                        {role.title}
                      </h3>
                    </div>
                  </div>
                  <svg
                    className="w-5 h-5 opacity-50"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
                <p className="text-sm opacity-75 mb-3">
                  {role.description}
                </p>

                {/* Capabilities */}
                <div className="pt-3 border-t border-current opacity-70">
                  <div className="flex items-start gap-2">
                    <div
                      className={`w-2 h-2 ${role.dotColor} rounded-full mt-1.5`}
                    ></div>
                    <div className="text-xs opacity-85">
                      {role.capabilities}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Last 2 roles - External Participants */}
            {roles.slice(3).map((role) => (
              <button
                key={role.id}
                onClick={() => onSelectRole(role.id)}
                className={`p-6 border-2 rounded-lg text-left transition-all hover:shadow-lg cursor-pointer ${role.color}`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-lg ${role.badgeColor}`}
                    >
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
                      <h3 className="font-medium">
                        {role.title}
                      </h3>
                    </div>
                  </div>
                  <svg
                    className="w-5 h-5 opacity-50"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
                <p className="text-sm opacity-75 mb-3">
                  {role.description}
                </p>

                {/* Capabilities */}
                <div className="pt-3 border-t border-current opacity-70">
                  <div className="flex items-start gap-2">
                    <div
                      className={`w-2 h-2 ${role.dotColor} rounded-full mt-1.5`}
                    ></div>
                    <div className="text-xs opacity-85">
                      {role.capabilities}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>

          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start gap-3">
              <svg
                className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <div>
                <div className="text-sm text-blue-900">
                  Demo Mode
                </div>
                <p className="text-sm text-blue-700 mt-1">
                  This role selector is for demonstration
                  purposes. In production, roles are determined
                  by authentication and cannot be switched.
                </p>
              </div>
            </div>
          </div>

          {/* Demo Credentials */}
          <div className="mt-6 bg-neutral-100 border border-neutral-200 rounded-lg p-4">
            <div className="text-sm text-neutral-600 mb-3">
              Demo Login Credentials (Internal Users Only):
            </div>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-white rounded p-3 border border-neutral-200">
                <div className="text-neutral-900 font-medium mb-1">
                  Super Admin
                </div>
                <div className="text-neutral-600">
                  admin@secureexchange.com
                </div>
                <div className="text-neutral-600">
                  Password: demo1234
                </div>
              </div>
              <div className="bg-white rounded p-3 border border-neutral-200">
                <div className="text-neutral-900 font-medium mb-1">
                  Tenant Admin
                </div>
                <div className="text-neutral-600">
                  sarah.mitchell@acmefinancial.com
                </div>
                <div className="text-neutral-600">
                  Password: demo1234
                </div>
              </div>
              <div className="bg-white rounded p-3 border border-neutral-200">
                <div className="text-neutral-900 font-medium mb-1">
                  Operational User
                </div>
                <div className="text-neutral-600">
                  james.rodriguez@acmefinancial.com
                </div>
                <div className="text-neutral-600">
                  Password: demo1234
                </div>
              </div>
              <div className="bg-white rounded p-3 border border-amber-200 bg-amber-50">
                <div className="text-amber-900 font-medium mb-1">
                  External Participant (Demo)
                </div>
                <div className="text-amber-700 text-[10px] mb-1">
                  ⚠️ No login in production
                </div>
                <div className="text-amber-700">
                  Demo email verification:
                </div>
                <div className="text-amber-700">
                  OTP: 123456
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="p-6 text-center text-sm text-neutral-500 bg-white border-t border-neutral-200">
        <p>
          Secure Exchange © 2024 · Decision-first governance
          platform
        </p>
      </footer>
    </div>
  );
}