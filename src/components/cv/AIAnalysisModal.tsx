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
import { Sparkles, TrendingUp, CheckCircle2, AlertCircle, Target } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface AIAnalysisModalProps {
  open: boolean;
  onClose: () => void;
  analysisData: {
    suggestions: Array<{
      title: string;
      description: string;
      priority: 'high' | 'medium' | 'low';
      category: 'structure' | 'content' | 'keywords' | 'achievements';
    }>;
    overallScore: number;
    strengths: string[];
    improvements: string[];
  };
  onApplySuggestion: (suggestion: string) => void;
}

export default function AIAnalysisModal({
  open,
  onClose,
  analysisData,
  onApplySuggestion,
}: AIAnalysisModalProps) {
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'structure':
        return <Target className="h-4 w-4" />;
      case 'content':
        return <CheckCircle2 className="h-4 w-4" />;
      case 'keywords':
        return <Sparkles className="h-4 w-4" />;
      case 'achievements':
        return <TrendingUp className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'destructive';
      case 'medium':
        return 'default';
      case 'low':
        return 'secondary';
      default:
        return 'secondary';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[85vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Análisis IA del CV
          </DialogTitle>
          <DialogDescription>
            Análisis completo y sugerencias personalizadas generadas por IA
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="h-[calc(85vh-180px)] pr-4">
          <div className="space-y-6">
            {/* Score Overview */}
            <Card className="p-6 bg-gradient-to-br from-primary/5 to-primary/10">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-lg">Score General</h3>
                <div className="text-4xl font-bold text-primary">{analysisData.overallScore}/100</div>
              </div>
              <Progress value={analysisData.overallScore} className="h-3" />
            </Card>

            {/* Strengths */}
            {analysisData.strengths.length > 0 && (
              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2 text-green-600 dark:text-green-400">
                  <CheckCircle2 className="h-5 w-5" />
                  Fortalezas ({analysisData.strengths.length})
                </h3>
                <div className="space-y-2">
                  {analysisData.strengths.map((strength, idx) => (
                    <Card key={idx} className="p-3 bg-green-50/50 dark:bg-green-950/20 border-green-200 dark:border-green-800">
                      <p className="text-sm">{strength}</p>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Improvements */}
            {analysisData.improvements.length > 0 && (
              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2 text-amber-600 dark:text-amber-400">
                  <AlertCircle className="h-5 w-5" />
                  Áreas de Mejora ({analysisData.improvements.length})
                </h3>
                <div className="space-y-2">
                  {analysisData.improvements.map((improvement, idx) => (
                    <Card key={idx} className="p-3 bg-amber-50/50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800">
                      <p className="text-sm">{improvement}</p>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Suggestions */}
            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Sugerencias Específicas ({analysisData.suggestions.length})
              </h3>
              <div className="space-y-3">
                {analysisData.suggestions.map((suggestion, idx) => (
                  <Card key={idx} className="p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          {getCategoryIcon(suggestion.category)}
                          <h4 className="font-medium">{suggestion.title}</h4>
                          <Badge variant={getPriorityColor(suggestion.priority)} className="ml-auto">
                            {suggestion.priority === 'high' ? 'Alta' : suggestion.priority === 'medium' ? 'Media' : 'Baja'} prioridad
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{suggestion.description}</p>
                        <div className="mt-2">
                          <Badge variant="outline" className="text-xs">
                            {suggestion.category === 'structure' ? 'Estructura' : 
                             suggestion.category === 'content' ? 'Contenido' : 
                             suggestion.category === 'keywords' ? 'Keywords' : 'Logros'}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </ScrollArea>

        {/* Actions */}
        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Cerrar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
