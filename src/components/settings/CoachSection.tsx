import { Bot, MessageCircle, Calendar, Sparkles } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useSettingsStore, CoachTone, CheckInFrequency } from '@/store/useSettingsStore';
import { toast } from '@/hooks/use-toast';

export function CoachSection() {
  const { coachPreferences, updateCoachPreferences } = useSettingsStore();

  const handleToneChange = (tone: CoachTone) => {
    updateCoachPreferences({ tone });
    toast({
      title: 'Preferencia actualizada',
      description: `El coach ahora usará un tono ${
        tone === 'empathetic' ? 'empático' : tone === 'direct' ? 'directo' : 'técnico'
      }.`,
    });
  };

  const handleFrequencyChange = (frequency: CheckInFrequency) => {
    updateCoachPreferences({ checkInFrequency: frequency });
    toast({
      title: 'Frecuencia actualizada',
      description: `Recibirás check-ins ${
        frequency === 'daily' ? 'diarios' : frequency === 'weekly' ? 'semanales' : 'quincenales'
      }.`,
    });
  };

  return (
    <div className="space-y-6">
      <Card className="bg-primary/5 border-primary/20">
        <CardHeader>
          <CardTitle>
            <Bot className="h-5 w-5 inline mr-2" />
            Preferencias del Coach IA
          </CardTitle>
          <CardDescription>
            Personaliza cómo interactúa tu Career Coach contigo
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Tone Preference */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            <MessageCircle className="h-4 w-4 inline mr-2" />
            Tono de Comunicación
          </CardTitle>
          <CardDescription>
            Elige cómo prefieres que el coach se comunique contigo
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={coachPreferences.tone}
            onValueChange={(value) => handleToneChange(value as CoachTone)}
          >
            <div className="flex items-start space-x-2 p-3 border rounded-lg hover:bg-accent transition-colors">
              <RadioGroupItem value="empathetic" id="empathetic" className="mt-1" />
              <Label htmlFor="empathetic" className="flex-1 cursor-pointer">
                <p className="text-sm font-medium">Empático</p>
                <p className="text-xs text-muted-foreground">
                  Cálido, motivador y de apoyo. Ideal para cuando necesitas aliento y
                  comprensión.
                </p>
                <p className="text-xs text-muted-foreground mt-1 italic">
                  "Entiendo que estás trabajando duro. ¿Qué te parece si revisamos juntos
                  tu progreso?"
                </p>
              </Label>
            </div>

            <div className="flex items-start space-x-2 p-3 border rounded-lg hover:bg-accent transition-colors">
              <RadioGroupItem value="direct" id="direct" className="mt-1" />
              <Label htmlFor="direct" className="flex-1 cursor-pointer">
                <p className="text-sm font-medium">Directo</p>
                <p className="text-xs text-muted-foreground">
                  Claro, conciso y enfocado en acciones. Para cuando quieres ir al grano.
                </p>
                <p className="text-xs text-muted-foreground mt-1 italic">
                  "Tienes 3 microacciones pendientes. Comienza por actualizar tu CV."
                </p>
              </Label>
            </div>

            <div className="flex items-start space-x-2 p-3 border rounded-lg hover:bg-accent transition-colors">
              <RadioGroupItem value="technical" id="technical" className="mt-1" />
              <Label htmlFor="technical" className="flex-1 cursor-pointer">
                <p className="text-sm font-medium">Técnico</p>
                <p className="text-xs text-muted-foreground">
                  Detallado, analítico y basado en datos. Perfecto para profesionales
                  técnicos.
                </p>
                <p className="text-xs text-muted-foreground mt-1 italic">
                  "Tus métricas muestran un 23% de mejora en optimización de CV. Analicemos
                  keywords..."
                </p>
              </Label>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Check-in Frequency */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            <Calendar className="h-4 w-4 inline mr-2" />
            Frecuencia de Check-ins
          </CardTitle>
          <CardDescription>
            Con qué frecuencia quieres que el coach revise tu progreso contigo
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={coachPreferences.checkInFrequency}
            onValueChange={(value) => handleFrequencyChange(value as CheckInFrequency)}
          >
            <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-accent transition-colors">
              <RadioGroupItem value="daily" id="daily" />
              <Label htmlFor="daily" className="flex-1 cursor-pointer">
                <p className="text-sm font-medium">Diario</p>
                <p className="text-xs text-muted-foreground">
                  Check-ins diarios para mantener momentum constante
                </p>
              </Label>
            </div>

            <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-accent transition-colors">
              <RadioGroupItem value="weekly" id="weekly" />
              <Label htmlFor="weekly" className="flex-1 cursor-pointer">
                <p className="text-sm font-medium">Semanal</p>
                <p className="text-xs text-muted-foreground">
                  Revisiones semanales para balance entre seguimiento y autonomía
                </p>
              </Label>
            </div>

            <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-accent transition-colors">
              <RadioGroupItem value="biweekly" id="biweekly" />
              <Label htmlFor="biweekly" className="flex-1 cursor-pointer">
                <p className="text-sm font-medium">Quincenal</p>
                <p className="text-xs text-muted-foreground">
                  Check-ins cada dos semanas para mayor autonomía
                </p>
              </Label>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Preview */}
      <Card className="bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20">
        <CardHeader>
          <CardTitle className="text-base">
            <Sparkles className="h-4 w-4 inline mr-2" />
            Vista Previa
          </CardTitle>
          <CardDescription>
            Así se comunicará tu coach con estas preferencias
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-4 bg-background rounded-lg border">
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <Bot className="h-4 w-4 text-primary" />
              </div>
              <div className="space-y-2 flex-1">
                <p className="text-sm font-medium">Career Coach</p>
                <p className="text-sm text-muted-foreground">
                  {coachPreferences.tone === 'empathetic' &&
                    '¡Hola! 👋 Vi que completaste 2 microacciones esta semana. ¡Gran trabajo! ¿Te gustaría que revisemos juntos las siguientes? Estoy aquí para apoyarte.'}
                  {coachPreferences.tone === 'direct' &&
                    'Completaste 2/5 microacciones esta semana. Pendientes: actualizar CV, practicar entrevista, conectar en LinkedIn. Comienza con la de mayor prioridad.'}
                  {coachPreferences.tone === 'technical' &&
                    'Estado actual: 2/5 microacciones completadas (40%). Análisis: tiempo promedio 35min/acción. Sugerencia: optimizar flujo de trabajo para incrementar throughput.'}
                </p>
                <p className="text-xs text-muted-foreground">
                  Check-in{' '}
                  {coachPreferences.checkInFrequency === 'daily'
                    ? 'diario'
                    : coachPreferences.checkInFrequency === 'weekly'
                    ? 'semanal'
                    : 'quincenal'}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
