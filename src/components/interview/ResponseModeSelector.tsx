import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { PenLine, Video } from 'lucide-react';

export type ResponseMode = 'text' | 'video';

interface ResponseModeSelectorProps {
  value: ResponseMode;
  onChange: (mode: ResponseMode) => void;
}

export function ResponseModeSelector({ value, onChange }: ResponseModeSelectorProps) {
  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium">Modo de Respuesta</Label>
      <RadioGroup
        value={value}
        onValueChange={(v) => onChange(v as ResponseMode)}
        className="grid grid-cols-2 gap-3"
      >
        <Label htmlFor="mode-text" className="cursor-pointer">
          <Card className={`p-4 flex flex-col items-center gap-2 transition-all hover:border-primary/50 ${
            value === 'text' ? 'border-primary bg-primary/5 shadow-clovely-md' : 'border-border'
          }`}>
            <RadioGroupItem value="text" id="mode-text" className="sr-only" />
            <div className={`p-3 rounded-xl ${value === 'text' ? 'bg-primary/10' : 'bg-muted'}`}>
              <PenLine className={`w-6 h-6 ${value === 'text' ? 'text-primary' : 'text-muted-foreground'}`} />
            </div>
            <div className="text-center">
              <p className="font-medium text-sm">Escribir</p>
              <p className="text-xs text-muted-foreground">Responde por escrito</p>
            </div>
          </Card>
        </Label>

        <Label htmlFor="mode-video" className="cursor-pointer">
          <Card className={`p-4 flex flex-col items-center gap-2 transition-all hover:border-primary/50 ${
            value === 'video' ? 'border-primary bg-primary/5 shadow-clovely-md' : 'border-border'
          }`}>
            <RadioGroupItem value="video" id="mode-video" className="sr-only" />
            <div className={`p-3 rounded-xl ${value === 'video' ? 'bg-primary/10' : 'bg-muted'}`}>
              <Video className={`w-6 h-6 ${value === 'video' ? 'text-primary' : 'text-muted-foreground'}`} />
            </div>
            <div className="text-center">
              <p className="font-medium text-sm">Grabarme</p>
              <p className="text-xs text-muted-foreground">Practica hablando</p>
            </div>
          </Card>
        </Label>
      </RadioGroup>
      <p className="text-xs text-muted-foreground mt-2">
        {value === 'text' 
          ? 'Escribe tu respuesta como lo harías en un mensaje profesional'
          : 'Grábate respondiendo para perder el miedo y practicar tu expresión'}
      </p>
    </div>
  );
}
