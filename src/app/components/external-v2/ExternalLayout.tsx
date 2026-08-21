import { ReactNode } from 'react';
import { useExternalTheme } from '../../../contexts/ExternalThemeContext';
import { Building2, LogOut } from 'lucide-react';

interface ExternalLayoutProps {
  children: ReactNode;
  organizationName: string;
  organizationLogo?: string;
  onLogout?: () => void;
  showLogout?: boolean;
  variant?: 'centered' | 'fullWidth'; // New prop
}

export function ExternalLayout({
  children,
  organizationName,
  organizationLogo,
  onLogout,
  showLogout = true,
  variant = 'centered',
}: ExternalLayoutProps) {
  const { tokens } = useExternalTheme();

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        background: tokens.surface.app,
      }}
    >
      {/* Header */}
      <header
        className="sticky top-0 z-50 border-b"
        style={{
          backgroundColor: tokens.surface.card,
          borderColor: tokens.border.soft,
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {organizationLogo ? (
              <img src={organizationLogo} alt={organizationName} className="h-8 w-8 rounded" />
            ) : (
              <div
                className="h-8 w-8 rounded flex items-center justify-center"
                style={{ backgroundColor: tokens.brand.primary }}
              >
                <Building2 className="h-5 w-5" style={{ color: tokens.text.primary }} />
              </div>
            )}
            <span className="text-lg font-semibold" style={{ color: tokens.text.primary }}>
              {organizationName}
            </span>
          </div>

          {showLogout && onLogout && (
            <button
              onClick={onLogout}
              className="flex items-center gap-2 px-4 py-2 rounded-lg transition-colors cursor-pointer"
              style={{
                color: tokens.text.secondary,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = tokens.interaction.hover.bg;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <LogOut className="h-4 w-4" />
              <span className="text-sm">Logout</span>
            </button>
          )}
        </div>
      </header>

      {/* Main Content */}
      {variant === 'fullWidth' ? (
        <main className="flex-1">{children}</main>
      ) : (
        <main className="flex-1 flex items-center justify-center px-6 py-12">
          <div className="w-full max-w-4xl">{children}</div>
        </main>
      )}

      {/* Footer - Only show for centered variant */}
      {variant === 'centered' && (
        <footer
          className="border-t py-6"
          style={{
            borderColor: tokens.border.soft,
          }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
            <p className="text-sm" style={{ color: tokens.text.muted }}>
              🔒 This is a secure document exchange. All communications are encrypted and monitored
              for compliance.
            </p>
          </div>
        </footer>
      )}
    </div>
  );
}