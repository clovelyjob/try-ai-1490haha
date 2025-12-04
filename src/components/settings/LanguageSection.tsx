import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Globe, Check } from 'lucide-react';
import { toast } from 'sonner';

type Language = 'es' | 'en' | 'pt' | 'fr';

interface LanguageOption {
  code: Language;
  label: string;
  flag: string;
  nativeName: string;
}

const languages: LanguageOption[] = [
  { code: 'es', label: 'Español', flag: '🇪🇸', nativeName: 'Español' },
  { code: 'en', label: 'English', flag: '🇺🇸', nativeName: 'English' },
  { code: 'pt', label: 'Português', flag: '🇧🇷', nativeName: 'Português' },
  { code: 'fr', label: 'Français', flag: '🇫🇷', nativeName: 'Français' },
];

export function LanguageSection() {
  const [language, setLanguage] = useState<Language>('es');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const savedLanguage = localStorage.getItem('clovely_language') as Language;
    if (savedLanguage && languages.some(l => l.code === savedLanguage)) {
      setLanguage(savedLanguage);
    }
  }, []);

  const handleSave = () => {
    setIsSaving(true);
    localStorage.setItem('clovely_language', language);
    
    setTimeout(() => {
      setIsSaving(false);
      toast.success('Idioma actualizado', {
        description: `El idioma se ha cambiado a ${languages.find(l => l.code === language)?.label}`,
      });
    }, 500);
  };

  const currentLang = languages.find(l => l.code === language);

  return (
    <div className="space-y-6">
      <Card className="rounded-2xl shadow-clovely-md border-2">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-xl">
              <Globe className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle>Idioma</CardTitle>
              <CardDescription>
                Selecciona el idioma de la interfaz
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <Label htmlFor="language">Idioma de la aplicación</Label>
            <Select value={language} onValueChange={(v) => setLanguage(v as Language)}>
              <SelectTrigger id="language" className="w-full max-w-xs">
                <SelectValue>
                  <span className="flex items-center gap-2">
                    <span>{currentLang?.flag}</span>
                    <span>{currentLang?.label}</span>
                  </span>
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {languages.map((lang) => (
                  <SelectItem key={lang.code} value={lang.code}>
                    <span className="flex items-center gap-2">
                      <span>{lang.flag}</span>
                      <span>{lang.label}</span>
                      <span className="text-muted-foreground text-xs">({lang.nativeName})</span>
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Próximamente: Más idiomas disponibles
            </p>
          </div>

          <Button onClick={handleSave} disabled={isSaving} className="min-h-[44px]">
            {isSaving ? (
              'Guardando...'
            ) : (
              <>
                <Check className="mr-2 h-4 w-4" />
                Guardar idioma
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      <Card className="rounded-2xl shadow-clovely-md border-2">
        <CardHeader>
          <CardTitle className="text-base">Idiomas disponibles</CardTitle>
          <CardDescription>
            Estamos trabajando para expandirnos a más regiones
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {languages.map((lang) => (
              <div
                key={lang.code}
                className={`p-3 rounded-xl border-2 text-center transition-all ${
                  language === lang.code
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <div className="text-2xl mb-1">{lang.flag}</div>
                <div className="text-sm font-medium">{lang.label}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
