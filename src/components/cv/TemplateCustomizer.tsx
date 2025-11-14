import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Palette, RotateCcw } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export interface TemplateColors {
  primary: string;
  secondary: string;
  accent: string;
  text: string;
  background: string;
}

interface TemplateCustomizerProps {
  open: boolean;
  onClose: () => void;
  currentColors: TemplateColors;
  onApply: (colors: TemplateColors) => void;
  template: string;
}

const defaultColorSchemes: Record<string, TemplateColors> = {
  harvard: {
    primary: '#1e3a8a',
    secondary: '#1e40af',
    accent: '#3b82f6',
    text: '#1f2937',
    background: '#ffffff',
  },
  modern: {
    primary: '#0891b2',
    secondary: '#06b6d4',
    accent: '#22d3ee',
    text: '#0f172a',
    background: '#f0f9ff',
  },
  minimal: {
    primary: '#374151',
    secondary: '#6b7280',
    accent: '#9ca3af',
    text: '#111827',
    background: '#ffffff',
  },
  creative: {
    primary: '#7c3aed',
    secondary: '#8b5cf6',
    accent: '#a78bfa',
    text: '#1f2937',
    background: '#faf5ff',
  },
};

const presetSchemes = [
  { name: 'Profesional Azul', colors: { primary: '#1e40af', secondary: '#3b82f6', accent: '#60a5fa', text: '#1f2937', background: '#ffffff' } },
  { name: 'Tech Verde', colors: { primary: '#059669', secondary: '#10b981', accent: '#34d399', text: '#1f2937', background: '#f0fdf4' } },
  { name: 'Creativo Púrpura', colors: { primary: '#7c3aed', secondary: '#8b5cf6', accent: '#a78bfa', text: '#1f2937', background: '#faf5ff' } },
  { name: 'Ejecutivo Gris', colors: { primary: '#374151', secondary: '#4b5563', accent: '#6b7280', text: '#111827', background: '#ffffff' } },
  { name: 'Marketing Rosa', colors: { primary: '#db2777', secondary: '#ec4899', accent: '#f472b6', text: '#1f2937', background: '#fdf2f8' } },
  { name: 'Finanzas Oro', colors: { primary: '#d97706', secondary: '#f59e0b', accent: '#fbbf24', text: '#1f2937', background: '#fffbeb' } },
];

export default function TemplateCustomizer({
  open,
  onClose,
  currentColors,
  onApply,
  template,
}: TemplateCustomizerProps) {
  const [colors, setColors] = useState<TemplateColors>(currentColors);

  const handleApply = () => {
    onApply(colors);
    onClose();
  };

  const handleReset = () => {
    setColors(defaultColorSchemes[template] || defaultColorSchemes.harvard);
  };

  const applyPreset = (preset: TemplateColors) => {
    setColors(preset);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[85vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Personalizar Colores del Template
          </DialogTitle>
          <DialogDescription>
            Ajusta los colores para crear un diseño único y profesional
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="custom" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="custom">Personalizado</TabsTrigger>
            <TabsTrigger value="presets">Esquemas Predefinidos</TabsTrigger>
          </TabsList>

          <TabsContent value="custom" className="space-y-4">
            <ScrollArea className="h-[400px] pr-4">
              <div className="space-y-4">
                {/* Primary Color */}
                <div className="space-y-2">
                  <Label>Color Principal</Label>
                  <div className="flex gap-2">
                    <Input
                      type="color"
                      value={colors.primary}
                      onChange={(e) => setColors({ ...colors, primary: e.target.value })}
                      className="w-20 h-10 cursor-pointer"
                    />
                    <Input
                      type="text"
                      value={colors.primary}
                      onChange={(e) => setColors({ ...colors, primary: e.target.value })}
                      className="flex-1 font-mono"
                      placeholder="#1e40af"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Usado para encabezados y elementos destacados
                  </p>
                </div>

                {/* Secondary Color */}
                <div className="space-y-2">
                  <Label>Color Secundario</Label>
                  <div className="flex gap-2">
                    <Input
                      type="color"
                      value={colors.secondary}
                      onChange={(e) => setColors({ ...colors, secondary: e.target.value })}
                      className="w-20 h-10 cursor-pointer"
                    />
                    <Input
                      type="text"
                      value={colors.secondary}
                      onChange={(e) => setColors({ ...colors, secondary: e.target.value })}
                      className="flex-1 font-mono"
                      placeholder="#3b82f6"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Para secciones y divisores
                  </p>
                </div>

                {/* Accent Color */}
                <div className="space-y-2">
                  <Label>Color de Acento</Label>
                  <div className="flex gap-2">
                    <Input
                      type="color"
                      value={colors.accent}
                      onChange={(e) => setColors({ ...colors, accent: e.target.value })}
                      className="w-20 h-10 cursor-pointer"
                    />
                    <Input
                      type="text"
                      value={colors.accent}
                      onChange={(e) => setColors({ ...colors, accent: e.target.value })}
                      className="flex-1 font-mono"
                      placeholder="#60a5fa"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Para detalles y elementos interactivos
                  </p>
                </div>

                {/* Text Color */}
                <div className="space-y-2">
                  <Label>Color de Texto</Label>
                  <div className="flex gap-2">
                    <Input
                      type="color"
                      value={colors.text}
                      onChange={(e) => setColors({ ...colors, text: e.target.value })}
                      className="w-20 h-10 cursor-pointer"
                    />
                    <Input
                      type="text"
                      value={colors.text}
                      onChange={(e) => setColors({ ...colors, text: e.target.value })}
                      className="flex-1 font-mono"
                      placeholder="#1f2937"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Color principal del texto
                  </p>
                </div>

                {/* Background Color */}
                <div className="space-y-2">
                  <Label>Color de Fondo</Label>
                  <div className="flex gap-2">
                    <Input
                      type="color"
                      value={colors.background}
                      onChange={(e) => setColors({ ...colors, background: e.target.value })}
                      className="w-20 h-10 cursor-pointer"
                    />
                    <Input
                      type="text"
                      value={colors.background}
                      onChange={(e) => setColors({ ...colors, background: e.target.value })}
                      className="flex-1 font-mono"
                      placeholder="#ffffff"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Color de fondo del documento
                  </p>
                </div>

                {/* Preview */}
                <div className="border rounded-lg p-4 space-y-2" style={{ backgroundColor: colors.background }}>
                  <h3 className="font-bold text-xl" style={{ color: colors.primary }}>
                    Vista Previa
                  </h3>
                  <div className="h-px" style={{ backgroundColor: colors.secondary }} />
                  <p className="text-sm" style={{ color: colors.text }}>
                    Este es un texto de ejemplo con el esquema de colores seleccionado.
                  </p>
                  <div className="flex gap-2">
                    <span className="px-3 py-1 rounded text-xs font-medium" style={{ backgroundColor: colors.accent, color: colors.background }}>
                      Elemento de acento
                    </span>
                  </div>
                </div>
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="presets">
            <ScrollArea className="h-[400px] pr-4">
              <div className="grid grid-cols-2 gap-3">
                {presetSchemes.map((preset, index) => (
                  <button
                    key={index}
                    onClick={() => applyPreset(preset.colors)}
                    className="p-4 border rounded-lg hover:border-primary transition-all text-left group"
                  >
                    <div className="font-medium mb-2 group-hover:text-primary transition-colors">
                      {preset.name}
                    </div>
                    <div className="flex gap-1 h-8">
                      <div className="flex-1 rounded" style={{ backgroundColor: preset.colors.primary }} />
                      <div className="flex-1 rounded" style={{ backgroundColor: preset.colors.secondary }} />
                      <div className="flex-1 rounded" style={{ backgroundColor: preset.colors.accent }} />
                    </div>
                  </button>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>

        <div className="flex justify-between pt-4 border-t">
          <Button variant="outline" onClick={handleReset}>
            <RotateCcw className="mr-2 h-4 w-4" />
            Restablecer
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button onClick={handleApply}>
              Aplicar Cambios
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
