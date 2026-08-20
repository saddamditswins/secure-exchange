import { ReactNode } from 'react';
import { useExternalTheme } from '../../../contexts/ExternalThemeContext';
import { Building2, HelpCircle, LogOut } from 'lucide-react';

interface ExternalCeremonyLayoutProps {
  children: ReactNode;
  organizationName: string;
  organizationLogo?: string;
  onLogout?: () => void;
  showLogout?: boolean;
}

export function ExternalCeremonyLayout({
  children,
  organizationName,
  organizationLogo,
  onLogout,
  showLogout = true,
}: ExternalCeremonyLayoutProps) {
  const { tokens } = useExternalTheme();

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        backgroundColor: tokens.surface.app,
      }}
    >
      {/* Header - Minimal */}
      <header
        className="sticky top-0 z-50 border-b"
        style={{
          backgroundColor: tokens.surface.card,
          borderColor: tokens.border.soft,
          boxShadow: tokens.shadow.sm,
        }}
      >
        <div className="px-8 py-4 flex items-center justify-between">
          {/* Left - Organization */}
          <div className="flex items-center gap-3">
            {organizationLogo ? (
              <img
                src={organizationLogo}
                alt={organizationName}
                className="h-10 w-10 rounded-lg"
              />
            ) : (
              <div
                className="h-10 w-10 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: tokens.brand.primary }}
              >
                <Building2 className="h-6 w-6" style={{ color: tokens.text.inverse }} />
              </div>
            )}
            <span
              className="text-xl font-semibold"
              style={{ color: tokens.text.primary }}
            >
              {organizationName}
            </span>
          </div>

          {/* Right - Help & Logout */}
          <div className="flex items-center gap-2">
            <button
              className="p-2 rounded-lg transition-colors cursor-pointer"
              style={{ color: tokens.text.muted }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = tokens.interaction.hover.bg;
                e.currentTarget.style.color = tokens.text.primary;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = tokens.text.muted;
              }}
              title="Help & Support"
            >
              <HelpCircle className="h-5 w-5" />
            </button>

            {showLogout && onLogout && (
              <button
                onClick={onLogout}
                className="flex items-center gap-2 px-4 py-2 rounded-lg transition-colors cursor-pointer"
                style={{
                  color: tokens.text.muted,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = tokens.interaction.hover.bg;
                  e.currentTarget.style.color = tokens.text.primary;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = tokens.text.muted;
                }}
              >
                <LogOut className="h-4 w-4" />
                <span className="text-sm font-medium">Logout</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content - Full Width */}
      <main className="flex-1">{children}</main>

      {/* Footer - Trust Focused */}
      <footer
        className="border-t py-6"
        style={{
          backgroundColor: tokens.surface.card,
          borderColor: tokens.border.soft,
        }}
      >
        <div className="px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <p
                className="text-sm font-medium flex items-center gap-2"
                style={{ color: tokens.text.muted }}
              >
                <span>🔒</span>
                <span>Secured by Secure Exchange</span>
              </p>
              <div className="flex items-center gap-4 text-xs" style={{ color: tokens.text.muted }}>
                <a
                  href="#privacy"
                  className="hover:underline cursor-pointer"
                  style={{ color: tokens.text.muted }}
                >
                  Privacy Policy
                </a>
                <a
                  href="#terms"
                  className="hover:underline cursor-pointer"
                  style={{ color: tokens.text.muted }}
                >
                  Terms of Service
                </a>
              </div>
            </div>
            <p className="text-xs" style={{ color: tokens.text.muted }}>
              Need help? <a href="mailto:support@secureexchange.com" className="underline cursor-pointer">support@secureexchange.com</a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
