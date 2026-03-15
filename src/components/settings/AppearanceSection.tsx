import { Palette, Sun, Moon, Type, Eye } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';
import { useSettingsStore, ThemeMode, FontSize } from '@/store/useSettingsStore';
import { toast } from '@/hooks/use-toast';

export function AppearanceSection() {
  const { theme, fontSize, highContrast, setTheme, setFontSize, toggleHighContrast } = useSettingsStore();

  const handleThemeChange = (newTheme: ThemeMode) => {
    setTheme(newTheme);
    toast({
      title: 'Tema actualizado',
      description: `Has cambiado al modo ${newTheme === 'light' ? 'claro' : 'oscuro'}.`,
    });
  };

  const handleFontSizeChange = (newSize: FontSize) => {
    setFontSize(newSize);
    toast({
      title: 'Tamaño de fuente actualizado',
      description: `Fuente configurada a tamaño ${newSize === 'small' ? 'pequeño' : newSize === 'normal' ? 'normal' : 'grande'}.`,
    });
  };

  return (
    <div className="space-y-6">
      <Card className="bg-primary/5 border-primary/20">
        <CardHeader>
          <CardTitle>
            <Palette className="h-5 w-5 inline mr-2" />
            Apariencia
          </CardTitle>
          <CardDescription>
            Personaliza cómo se ve MoonJab para ti
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Theme Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Tema</CardTitle>
          <CardDescription>
            Selecciona tu tema preferido (claro u oscuro)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup value={theme} onValueChange={(value) => handleThemeChange(value as ThemeMode)}>
            <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-accent transition-colors min-h-[44px]">
              <RadioGroupItem value="light" id="light" className="min-h-[24px] min-w-[24px]" />
              <Label htmlFor="light" className="flex items-center gap-2 flex-1 cursor-pointer">
                <Sun className="h-4 w-4" />
                <div>
                  <p className="text-sm font-medium">Claro</p>
                  <p className="text-xs text-muted-foreground">Modo claro siempre activo</p>
                </div>
              </Label>
            </div>

            <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-accent transition-colors min-h-[44px]">
              <RadioGroupItem value="dark" id="dark" className="min-h-[24px] min-w-[24px]" />
              <Label htmlFor="dark" className="flex items-center gap-2 flex-1 cursor-pointer">
                <Moon className="h-4 w-4" />
                <div>
                  <p className="text-sm font-medium">Oscuro</p>
                  <p className="text-xs text-muted-foreground">Modo oscuro siempre activo</p>
                </div>
              </Label>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Font Size */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            <Type className="h-4 w-4 inline mr-2" />
            Tamaño de Fuente
          </CardTitle>
          <CardDescription>
            Ajusta el tamaño del texto para mejor legibilidad
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup value={fontSize} onValueChange={(value) => handleFontSizeChange(value as FontSize)}>
            <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-accent transition-colors min-h-[44px]">
              <RadioGroupItem value="small" id="small" className="min-h-[24px] min-w-[24px]" />
              <Label htmlFor="small" className="flex-1 cursor-pointer">
                <p className="text-sm font-medium">Pequeño</p>
                <p className="text-xs text-muted-foreground">Más contenido visible</p>
              </Label>
            </div>

            <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-accent transition-colors min-h-[44px]">
              <RadioGroupItem value="normal" id="normal" className="min-h-[24px] min-w-[24px]" />
              <Label htmlFor="normal" className="flex-1 cursor-pointer">
                <p className="text-sm font-medium">Normal</p>
                <p className="text-xs text-muted-foreground">Tamaño predeterminado</p>
              </Label>
            </div>

            <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-accent transition-colors min-h-[44px]">
              <RadioGroupItem value="large" id="large" className="min-h-[24px] min-w-[24px]" />
              <Label htmlFor="large" className="flex-1 cursor-pointer">
                <p className="text-sm font-medium">Grande</p>
                <p className="text-xs text-muted-foreground">Más fácil de leer</p>
              </Label>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Accessibility */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            <Eye className="h-4 w-4 inline mr-2" />
            Accesibilidad
          </CardTitle>
          <CardDescription>
            Opciones para mejorar la accesibilidad visual
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between min-h-[44px]">
            <div className="space-y-0.5">
              <Label className="text-sm font-medium">Contraste Alto</Label>
              <p className="text-xs text-muted-foreground">
                Aumenta el contraste de colores para mejor visibilidad
              </p>
            </div>
            <Switch
              checked={highContrast}
              onCheckedChange={() => {
                toggleHighContrast();
                toast({
                  title: highContrast ? 'Contraste normal' : 'Contraste alto activado',
                  description: highContrast 
                    ? 'Has desactivado el modo de contraste alto.'
                    : 'Has activado el modo de contraste alto.',
                });
              }}
              className="min-h-[24px] min-w-[44px]"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
