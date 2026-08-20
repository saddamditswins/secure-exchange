import { useTranslation, Language } from '../../i18n/LanguageContext';
import { useTheme } from '../../contexts/ThemeContext';
import { Globe } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

const languages: { code: Language; name: string; flag: string }[] = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
];

export function LanguageSwitcher() {
  const { language, setLanguage } = useTranslation();
  const { tokens } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentLang = languages.find(l => l.code === language);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
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
      >
        <Globe className="w-4 h-4" />
        <span className="text-sm font-medium">{currentLang?.flag} {currentLang?.code.toUpperCase()}</span>
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div
          className="absolute right-0 mt-2 w-48 rounded-lg shadow-lg border overflow-hidden z-50"
          style={{
            backgroundColor: tokens.surface.card,
            borderColor: tokens.border.default,
            boxShadow: tokens.shadow.lg,
          }}
        >
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => {
                setLanguage(lang.code);
                setIsOpen(false);
              }}
              className="w-full text-left px-4 py-3 flex items-center gap-3 transition-colors cursor-pointer"
              style={{
                color: language === lang.code ? tokens.brand.primary : tokens.text.primary,
                backgroundColor: language === lang.code ? tokens.interaction.hover.bg : 'transparent',
              }}
              onMouseEnter={(e) => {
                if (language !== lang.code) {
                  e.currentTarget.style.backgroundColor = tokens.interaction.hover.bg;
                }
              }}
              onMouseLeave={(e) => {
                if (language !== lang.code) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }
              }}
            >
              <span className="text-2xl">{lang.flag}</span>
              <div className="flex-1">
                <div className="text-sm font-medium">{lang.name}</div>
                <div
                  className="text-xs"
                  style={{ color: tokens.text.muted }}
                >
                  {lang.code.toUpperCase()}
                </div>
              </div>
              {language === lang.code && (
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  style={{ color: tokens.brand.primary }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}