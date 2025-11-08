import { CVData } from '@/types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Sparkles, TrendingUp, CheckCircle2 } from 'lucide-react';

interface AIAnalysisModalProps {
  open: boolean;
  onClose: () => void;
  cv: CVData;
  onApplySuggestion: (suggestion: string) => void;
}

export default function AIAnalysisModal({
  open,
  onClose,
  cv,
  onApplySuggestion,
}: AIAnalysisModalProps) {
  const suggestions = [
    {
      title: 'Añade métricas cuantificables',
      description: 'Incluye números específicos en tus logros (%, €, usuarios)',
      impact: 'Alto',
    },
    {
      title: 'Usa verbos de acción',
      description: 'Comienza cada punto con verbos fuertes: "Lideré", "Implementé", "Optimicé"',
      impact: 'Medio',
    },
    {
      title: 'Prioriza logros sobre responsabilidades',
      description: 'Enfócate en el impacto que generaste, no solo en lo que hacías',
      impact: 'Alto',
    },
    {
      title: 'Personaliza tu resumen',
      description: 'Adapta tu resumen profesional al tipo de puesto que buscas',
      impact: 'Medio',
    },
  ];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Análisis y Optimización IA
          </DialogTitle>
          <DialogDescription>
            Recomendaciones personalizadas para mejorar tu CV
          </DialogDescription>
        </DialogHeader>

        {/* Score Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card className="p-4">
            <div className="text-sm text-muted-foreground mb-1">Score General</div>
            <div className="text-2xl font-bold">{cv.score.overall}%</div>
            <Progress value={cv.score.overall} className="mt-2" />
          </Card>
          <Card className="p-4">
            <div className="text-sm text-muted-foreground mb-1">Claridad</div>
            <div className="text-2xl font-bold">{cv.score.clarity}</div>
            <Progress value={(cv.score.clarity / 25) * 100} className="mt-2" />
          </Card>
          <Card className="p-4">
            <div className="text-sm text-muted-foreground mb-1">Impacto</div>
            <div className="text-2xl font-bold">{cv.score.impact}</div>
            <Progress value={(cv.score.impact / 25) * 100} className="mt-2" />
          </Card>
          <Card className="p-4">
            <div className="text-sm text-muted-foreground mb-1">Keywords</div>
            <div className="text-2xl font-bold">{cv.score.keywords}</div>
            <Progress value={(cv.score.keywords / 25) * 100} className="mt-2" />
          </Card>
        </div>

        {/* Suggestions */}
        <div>
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Recomendaciones para mejorar
          </h3>
          <div className="space-y-3">
            {suggestions.map((suggestion, idx) => (
              <Card key={idx} className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                      <h4 className="font-medium">{suggestion.title}</h4>
                      <Badge
                        variant={suggestion.impact === 'Alto' ? 'default' : 'secondary'}
                        className="ml-auto"
                      >
                        {suggestion.impact} impacto
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{suggestion.description}</p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onApplySuggestion(suggestion.title)}
                  >
                    Aplicar
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Action */}
        <div className="flex justify-end gap-2 mt-6">
          <Button variant="outline" onClick={onClose}>
            Cerrar
          </Button>
          <Button onClick={onClose}>
            <Sparkles className="mr-2 h-4 w-4" />
            Aplicar todas las sugerencias
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
