import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { FileDown, Eye } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export type ExportFormat = 'A4' | 'Letter' | 'Legal';

export interface ExportSettings {
  format: ExportFormat;
  marginTop: number;
  marginRight: number;
  marginBottom: number;
  marginLeft: number;
  highQuality: boolean;
  includeColors: boolean;
}

interface ExportSettingsModalProps {
  open: boolean;
  onClose: () => void;
  onExport: (settings: ExportSettings) => void;
  onPreview?: () => void;
}

const defaultSettings: ExportSettings = {
  format: 'A4',
  marginTop: 10,
  marginRight: 10,
  marginBottom: 10,
  marginLeft: 10,
  highQuality: true,
  includeColors: true,
};

export default function ExportSettingsModal({
  open,
  onClose,
  onExport,
  onPreview,
}: ExportSettingsModalProps) {
  const [settings, setSettings] = useState<ExportSettings>(defaultSettings);

  const handleExport = () => {
    onExport(settings);
    onClose();
  };

  const formatInfo = {
    A4: { width: '210mm', height: '297mm', region: '🌍 Internacional' },
    Letter: { width: '8.5"', height: '11"', region: '🇺🇸 EEUU/Canadá' },
    Legal: { width: '8.5"', height: '14"', region: '⚖️ Legal' },
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Configuración de Exportación</DialogTitle>
          <DialogDescription>
            Personaliza cómo se exportará tu CV en formato PDF
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Format Selection */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">Formato de Página</Label>
            <RadioGroup
              value={settings.format}
              onValueChange={(value) => setSettings({ ...settings, format: value as ExportFormat })}
              className="space-y-2"
            >
              {Object.entries(formatInfo).map(([format, info]) => (
                <div key={format} className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-accent transition-colors">
                  <RadioGroupItem value={format} id={format} />
                  <Label htmlFor={format} className="flex-1 cursor-pointer">
                    <div className="font-medium">{format}</div>
                    <div className="text-xs text-muted-foreground">
                      {info.width} × {info.height} {info.region}
                    </div>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Margins */}
          <div className="space-y-4">
            <Label className="text-base font-semibold">Márgenes (mm)</Label>
            
            <div className="space-y-3">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label className="text-sm">Superior</Label>
                  <Badge variant="secondary">{settings.marginTop}mm</Badge>
                </div>
                <Slider
                  value={[settings.marginTop]}
                  onValueChange={([value]) => setSettings({ ...settings, marginTop: value })}
                  min={0}
                  max={30}
                  step={1}
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label className="text-sm">Inferior</Label>
                  <Badge variant="secondary">{settings.marginBottom}mm</Badge>
                </div>
                <Slider
                  value={[settings.marginBottom]}
                  onValueChange={([value]) => setSettings({ ...settings, marginBottom: value })}
                  min={0}
                  max={30}
                  step={1}
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label className="text-sm">Izquierdo</Label>
                  <Badge variant="secondary">{settings.marginLeft}mm</Badge>
                </div>
                <Slider
                  value={[settings.marginLeft]}
                  onValueChange={([value]) => setSettings({ ...settings, marginLeft: value })}
                  min={0}
                  max={30}
                  step={1}
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label className="text-sm">Derecho</Label>
                  <Badge variant="secondary">{settings.marginRight}mm</Badge>
                </div>
                <Slider
                  value={[settings.marginRight]}
                  onValueChange={([value]) => setSettings({ ...settings, marginRight: value })}
                  min={0}
                  max={30}
                  step={1}
                />
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() => setSettings({
                ...settings,
                marginTop: 10,
                marginRight: 10,
                marginBottom: 10,
                marginLeft: 10,
              })}
            >
              Restablecer márgenes predeterminados
            </Button>
          </div>

          {/* Quality Options */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">Opciones de Calidad</Label>
            
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="space-y-0.5">
                <Label>Alta calidad</Label>
                <p className="text-xs text-muted-foreground">
                  Exportar con máxima resolución (2x)
                </p>
              </div>
              <Switch
                checked={settings.highQuality}
                onCheckedChange={(checked) => setSettings({ ...settings, highQuality: checked })}
              />
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="space-y-0.5">
                <Label>Incluir colores</Label>
                <p className="text-xs text-muted-foreground">
                  Mantener el esquema de colores del template
                </p>
              </div>
              <Switch
                checked={settings.includeColors}
                onCheckedChange={(checked) => setSettings({ ...settings, includeColors: checked })}
              />
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2">
          {onPreview && (
            <Button variant="outline" onClick={onPreview}>
              <Eye className="mr-2 h-4 w-4" />
              Vista previa
            </Button>
          )}
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleExport}>
            <FileDown className="mr-2 h-4 w-4" />
            Exportar PDF
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
