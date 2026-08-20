import { createContext, useContext, ReactNode, useState, useEffect } from 'react';

export type ThemeMode = 'dark' | 'light';

export interface ThemeTokens {
  brand: {
    primary: string;
    secondary: string;
    accent: string;
    gradient: {
      start: string;
      end: string;
    };
  };
  surface: {
    app: string;
    panel: string;
    card: string;
    elevated: string;
    overlay: string;
  };
  text: {
    primary: string;
    secondary: string;
    muted: string;
    inverse: string;
  };
  border: {
    default: string;
    strong: string;
  };
  shadow: {
    sm: string;
    md: string;
    lg: string;
  };
  status: {
    success: { bg: string; text: string };
    warning: { bg: string; text: string };
    error: { bg: string; text: string };
    info: { bg: string; text: string };
    neutral: { bg: string; text: string };
  };
  interaction: {
    hover: {
      bg: string;
      border: string;
    };
    focus: {
      ring: string;
    };
  };
}

const darkTheme: ThemeTokens = {
  brand: {
    primary: '#10b981', // emerald-500
    secondary: '#153240', // dark teal
    accent: '#06b6d4', // cyan-500
    gradient: {
      start: '#10b981',
      end: '#06b6d4',
    },
  },
  surface: {
    app: '#153240',
    panel: '#0f2838',
    card: '#1a3544',
    elevated: '#2a4554',
    overlay: 'rgba(0, 0, 0, 0.5)',
  },
  text: {
    primary: '#ffffff',
    secondary: '#d4d4d8', // neutral-300
    muted: '#a1a1aa', // neutral-400
    inverse: '#18181b', // neutral-900
  },
  border: {
    default: '#1a3544',
    strong: '#2a4554',
  },
  shadow: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
  },
  status: {
    success: { bg: '#dcfce7', text: '#166534' }, // green-100/green-800
    warning: { bg: '#fef3c7', text: '#92400e' }, // amber-100/amber-800
    error: { bg: '#fee2e2', text: '#991b1b' }, // red-100/red-800
    info: { bg: '#dbeafe', text: '#1e40af' }, // blue-100/blue-800
    neutral: { bg: '#f5f5f5', text: '#404040' }, // neutral-100/neutral-700
  },
  interaction: {
    hover: {
      bg: '#2a4554',
      border: '#10b981',
    },
    focus: {
      ring: '#10b981',
    },
  },
};

const lightTheme: ThemeTokens = {
  brand: {
    primary: '#10b981', // emerald-500
    secondary: '#0ea5e9', // sky-500
    accent: '#8b5cf6', // violet-500
    gradient: {
      start: '#10b981',
      end: '#0ea5e9',
    },
  },
  surface: {
    app: '#fafafa', // neutral-50
    panel: '#ffffff',
    card: '#ffffff',
    elevated: '#ffffff',
    overlay: 'rgba(0, 0, 0, 0.3)',
  },
  text: {
    primary: '#171717', // neutral-900
    secondary: '#525252', // neutral-600
    muted: '#a3a3a3', // neutral-400
    inverse: '#ffffff',
  },
  border: {
    default: '#e5e5e5', // neutral-200
    strong: '#d4d4d4', // neutral-300
  },
  shadow: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
  },
  status: {
    success: { bg: '#dcfce7', text: '#166534' }, // green-100/green-800
    warning: { bg: '#fef3c7', text: '#92400e' }, // amber-100/amber-800
    error: { bg: '#fee2e2', text: '#991b1b' }, // red-100/red-800
    info: { bg: '#dbeafe', text: '#1e40af' }, // blue-100/blue-800
    neutral: { bg: '#f5f5f5', text: '#404040' }, // neutral-100/neutral-700
  },
  interaction: {
    hover: {
      bg: '#f5f5f5',
      border: '#10b981',
    },
    focus: {
      ring: '#10b981',
    },
  },
};

interface ThemeContextType {
  theme: ThemeMode;
  tokens: ThemeTokens;
  toggleTheme: () => void;
  setTheme: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem('secure-exchange-theme');
    return (saved as ThemeMode) || 'dark';
  });

  const tokens = theme === 'dark' ? darkTheme : lightTheme;

  useEffect(() => {
    localStorage.setItem('secure-exchange-theme', theme);
    
    // Apply theme to CSS custom properties for dynamic theming
    const root = document.documentElement;
    
    root.style.setProperty('--brand-primary', tokens.brand.primary);
    root.style.setProperty('--brand-secondary', tokens.brand.secondary);
    root.style.setProperty('--brand-accent', tokens.brand.accent);
    root.style.setProperty('--surface-app', tokens.surface.app);
    root.style.setProperty('--surface-panel', tokens.surface.panel);
    root.style.setProperty('--surface-card', tokens.surface.card);
    root.style.setProperty('--text-primary', tokens.text.primary);
    root.style.setProperty('--text-secondary', tokens.text.secondary);
    root.style.setProperty('--text-muted', tokens.text.muted);
    root.style.setProperty('--border-default', tokens.border.default);
    root.style.setProperty('--border-strong', tokens.border.strong);
  }, [theme, tokens]);

  const toggleTheme = () => {
    setThemeState(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const setTheme = (mode: ThemeMode) => {
    setThemeState(mode);
  };

  return (
    <ThemeContext.Provider value={{ theme, tokens, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}