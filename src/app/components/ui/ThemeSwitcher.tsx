import { useTheme } from '../../../contexts/ThemeContext';
import { Moon, Sun } from 'lucide-react';

export function ThemeSwitcher() {
  const { theme, tokens, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors cursor-pointer"
      style={{
        backgroundColor: tokens.surface.card,
        borderColor: tokens.border.default,
        color: tokens.text.primary,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = tokens.interaction.hover.bg;
        e.currentTarget.style.borderColor = tokens.interaction.hover.border;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = tokens.surface.card;
        e.currentTarget.style.borderColor = tokens.border.default;
      }}
      title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
    >
      {theme === 'dark' ? (
        <Moon className="w-4 h-4" />
      ) : (
        <Sun className="w-4 h-4" />
      )}
      <span className="text-sm font-medium">
        {theme === 'dark' ? 'Dark' : 'Light'}
      </span>
    </button>
  );
}