import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';

export function LanguageToggle() {
  const { i18n } = useTranslation();
  const isEs = i18n.language?.startsWith('es');

  // Sync <html lang> attribute with current language
  useEffect(() => {
    document.documentElement.lang = i18n.language?.startsWith('es') ? 'es' : 'en';
  }, [i18n.language]);

  const toggle = () => {
    const newLang = isEs ? 'en' : 'es';
    i18n.changeLanguage(newLang);
    localStorage.setItem('moonjab_language', newLang);
  };

  return (
    <button
      onClick={toggle}
      className="h-8 px-2.5 rounded-lg text-[11px] font-bold tracking-wider border border-border/50 bg-muted/50 hover:bg-muted text-foreground transition-colors"
      aria-label={isEs ? 'Switch to English' : 'Cambiar a Español'}
    >
      {isEs ? 'EN' : 'ES'}
    </button>
  );
}
