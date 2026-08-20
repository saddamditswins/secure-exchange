import { ThemeProvider } from '../contexts/ThemeContext';
import { LanguageProvider } from '../i18n/LanguageContext';
import App from './App';

export default function Root() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <App />
      </LanguageProvider>
    </ThemeProvider>
  );
}
