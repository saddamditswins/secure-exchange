import { createContext, useContext, ReactNode } from 'react';

export interface ExternalThemeTokens {
  brand: {
    primary: string;
    secondary: string;
    accent: string;
  };
  surface: {
    app: string; // soft gradient background
    card: string; // main container
    elevated: string; // dialogs, signature modal
    overlay: string; // modal backdrop overlay
  };
  text: {
    primary: string; // #ffffff ONLY for external
    secondary: string;
    muted: string;
    inverse: string;
  };
  border: {
    soft: string;
    focus: string;
  };
  shadow: {
    sm: string;
    md: string;
  };
  status: {
    success: string;
    warning: string;
    pending: string;
  };
  interaction: {
    hover: {
      bg: string;
    };
    focus: {
      ring: string;
    };
    disabled: {
      opacity: string;
    };
  };
}

// External Theme Preset - Clean, modern, trustworthy
const externalTheme: ExternalThemeTokens = {
  brand: {
    primary: '#10b981', // emerald-500
    secondary: '#153240', // dark teal
    accent: '#06b6d4', // cyan-500
  },
  surface: {
    app: '#f7f9fb', // soft light blue-gray background
    card: '#ffffff', // pure white
    elevated: '#ffffff', // pure white for modals
    overlay: 'rgba(0, 0, 0, 0.4)', // modal backdrop overlay
  },
  text: {
    primary: '#0f172a', // slate-900
    secondary: '#475569', // slate-600
    muted: '#64748b', // slate-500
    inverse: '#ffffff', // white for buttons
  },
  border: {
    soft: '#e5e7eb', // gray-200
    focus: '#10b981', // emerald-500
  },
  shadow: {
    sm: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
  },
  status: {
    success: '#10b981', // emerald-500
    warning: '#f59e0b', // amber-500
    pending: '#6b7280', // gray-500
  },
  interaction: {
    hover: {
      bg: '#f1f5f9', // slate-100
    },
    focus: {
      ring: '#10b981', // emerald-500
    },
    disabled: {
      opacity: '0.5',
    },
  },
};

interface ExternalThemeContextType {
  tokens: ExternalThemeTokens;
}

const ExternalThemeContext = createContext<ExternalThemeContextType | undefined>(undefined);

export function ExternalThemeProvider({ children }: { children: ReactNode }) {
  return (
    <ExternalThemeContext.Provider value={{ tokens: externalTheme }}>
      {children}
    </ExternalThemeContext.Provider>
  );
}

export function useExternalTheme() {
  const context = useContext(ExternalThemeContext);
  if (!context) {
    throw new Error('useExternalTheme must be used within ExternalThemeProvider');
  }
  return context;
}