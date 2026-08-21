import { useTranslation } from "react-i18next";
import { Languages, Check } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

interface Language {
  code: string;
  name: string;
  countryCode: string;
}

// Only languages with a bundle registered in src/i18n.ts belong here -- listing
// one without translations silently falls back to English.
const languages: Language[] = [
  { code: "en", name: "English", countryCode: "US" },
  { code: "fr", name: "Français", countryCode: "FR" },
];

interface LanguageDropdownProps {
  variant?: "topbar" | "default";
}

export function LanguageDropdown({
  variant = "default",
}: LanguageDropdownProps) {
  const { i18n } = useTranslation();

  const currentLanguage =
    languages.find((lang) => lang.code === i18n.language) ||
    languages[0];

  const handleLanguageChange = (languageCode: string) => {
    if (i18n && typeof i18n.changeLanguage === 'function') {
      i18n.changeLanguage(languageCode);
    }
  };

  if (variant === "topbar") {
    return (
      <Select
        value={i18n.language}
        onValueChange={handleLanguageChange}
      >
        <SelectTrigger className="w-[80px] h-9 bg-[#1E3A4A] border-[#2A4A5A] text-neutral-200 hover:text-white hover:bg-[#243F4D] hover:border-[#3A5A6A] transition-colors focus:ring-1 focus:ring-emerald-500/50">
          <div className="flex items-center gap-2">
            <Languages className="w-4 h-4 text-neutral-600" />
            <SelectValue>
              <span className="text-sm font-medium text-neutral-600">
                {currentLanguage.countryCode}
              </span>
            </SelectValue>
          </div>
        </SelectTrigger>
        <SelectContent className="bg-[#1A3240] border-[#2A4A5A] min-w-[160px]">
          {languages.map((language) => (
            <SelectItem
              key={language.code}
              value={language.code}
              className="text-neutral-600 hover:text-white hover:bg-[#243F4D] cursor-pointer focus:bg-[#243F4D] focus:text-white data-[state=checked]:bg-[#243F4D]"
            >
              <div className="flex items-center justify-between w-full gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-neutral-600 w-6">
                    {language.countryCode}
                  </span>
                  <span className="text-sm text-neutral-600">
                    {language.name}
                  </span>
                </div>
                {i18n.language === language.code && (
                  <Check className="w-4 h-4 text-emerald-500" />
                )}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  }

  // Default variant for light backgrounds
  return (
    <Select
      value={i18n.language}
      onValueChange={handleLanguageChange}
    >
      <SelectTrigger className="w-[92px] sm:w-[110px] h-9 bg-white border-neutral-200 text-neutral-700 hover:bg-neutral-50 transition-colors focus:ring-1 focus:ring-neutral-900/10">
        <div className="flex items-center gap-2">
          <Languages className="w-4 h-4 text-neutral-500" />
          <SelectValue>
            <span className="text-sm font-medium">
              {currentLanguage.countryCode}
            </span>
          </SelectValue>
        </div>
      </SelectTrigger>
      <SelectContent className="min-w-[160px]">
        {languages.map((language) => (
          <SelectItem
            key={language.code}
            value={language.code}
            className="cursor-pointer"
          >
            <div className="flex items-center justify-between w-full gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-neutral-500 w-6">
                  {language.countryCode}
                </span>
                <span className="text-sm">{language.name}</span>
              </div>
              {i18n.language === language.code && (
                <Check className="w-4 h-4 text-emerald-600" />
              )}
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}