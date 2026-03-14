import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Globe } from 'lucide-react';
import { toast } from 'sonner';

type Language = 'es' | 'en' | 'pt' | 'fr';

interface LanguageOption {
  code: Language;
  label: string;
  flag: string;
}

const languages: LanguageOption[] = [
  { code: 'es', label: 'Español', flag: 'ES' },
  { code: 'en', label: 'English', flag: 'EN' },
  { code: 'pt', label: 'Português', flag: 'PT' },
  { code: 'fr', label: 'Français', flag: 'FR' },
];

export function LanguageSection() {
  const { t, i18n } = useTranslation();
  const currentLanguage = i18n.language as Language;

  const handleLanguageChange = (lang: Language) => {
    i18n.changeLanguage(lang);
    localStorage.setItem('moonjab_language', lang);
    
    const langLabel = languages.find(l => l.code === lang)?.label;
    toast.success(t('settings.language.updated'), {
      description: `${t('settings.language.updatedDesc')} ${langLabel}`,
    });
  };

  const currentLang = languages.find(l => l.code === currentLanguage) || languages[0];

  return (
    <div className="space-y-6">
      <Card className="rounded-2xl shadow-clovely-md border-2">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-xl">
              <Globe className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle>{t('settings.language.title')}</CardTitle>
              <CardDescription>
                {t('settings.language.subtitle')}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <Label htmlFor="language">{t('settings.language.appLanguage')}</Label>
            <Select value={currentLanguage} onValueChange={(v) => handleLanguageChange(v as Language)}>
              <SelectTrigger id="language" className="w-full max-w-xs">
                <SelectValue>
                  <span className="flex items-center gap-2">
                    <span>{currentLang.flag}</span>
                    <span>{currentLang.label}</span>
                  </span>
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {languages.map((lang) => (
                  <SelectItem key={lang.code} value={lang.code}>
                    <span className="flex items-center gap-2">
                      <span>{lang.flag}</span>
                      <span>{lang.label}</span>
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              {t('settings.language.comingSoon')}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-2xl shadow-clovely-md border-2">
        <CardHeader>
          <CardTitle className="text-base">{t('settings.language.availableLanguages')}</CardTitle>
          <CardDescription>
            {t('settings.language.expanding')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleLanguageChange(lang.code)}
                className={`p-3 rounded-xl border-2 text-center transition-all ${
                  currentLanguage === lang.code
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <div className="text-2xl mb-1">{lang.flag}</div>
                <div className="text-sm font-medium">{lang.label}</div>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
