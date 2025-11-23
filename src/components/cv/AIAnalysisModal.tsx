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

  const getPriorityBadgeColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-gradient-to-r from-red-50 to-rose-100 border-red-300 text-red-700';
      case 'medium':
        return 'bg-gradient-to-r from-yellow-50 to-amber-100 border-yellow-300 text-yellow-700';
      case 'low':
        return 'bg-gradient-to-r from-green-50 to-emerald-100 border-green-300 text-green-700';
      default:
        return '';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[85vh] rounded-3xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5">
              <Sparkles className="h-5 w-5 text-primary" />
            </div>
            Análisis IA del CV
          </DialogTitle>
          <DialogDescription>
            Análisis completo y sugerencias personalizadas generadas por IA
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="h-[calc(85vh-180px)] pr-4">
          <div className="space-y-6">
            {/* Score Overview */}
            <Card className="p-6 rounded-2xl shadow-clovely-lg border-2 border-primary/10 bg-gradient-to-br from-primary/10 to-primary-warm/20">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-lg bg-gradient-to-r from-primary to-primary-warm bg-clip-text text-transparent">Score General</h3>
                <div className="text-4xl font-bold text-primary">{analysisData.overallScore}/100</div>
              </div>
              <Progress value={analysisData.overallScore} className="h-3 [&>div]:bg-gradient-to-r [&>div]:from-primary [&>div]:to-primary-warm" />
            </Card>

            {/* Strengths */}
            {analysisData.strengths.length > 0 && (
              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2 text-green-600 dark:text-green-400">
                  <div className="p-2 rounded-xl bg-gradient-to-br from-green-500/10 to-emerald-500/10">
                    <CheckCircle2 className="h-5 w-5" />
                  </div>
                  Fortalezas ({analysisData.strengths.length})
                </h3>
                <div className="space-y-2">
                  {analysisData.strengths.map((strength, idx) => (
                    <Card key={idx} className="p-4 rounded-xl border-2 border-green-300 bg-gradient-to-br from-green-50 to-emerald-50/50 dark:border-green-700 dark:from-green-950/30 dark:to-emerald-950/20 shadow-clovely-sm hover:shadow-clovely-md hover:-translate-y-0.5 transition-all duration-300">
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
                  <div className="p-2 rounded-xl bg-gradient-to-br from-amber-500/10 to-yellow-500/10">
                    <AlertCircle className="h-5 w-5" />
                  </div>
                  Áreas de Mejora ({analysisData.improvements.length})
                </h3>
                <div className="space-y-2">
                  {analysisData.improvements.map((improvement, idx) => (
                    <Card key={idx} className="p-4 rounded-xl border-2 border-amber-300 bg-gradient-to-br from-amber-50 to-yellow-50/50 dark:border-amber-700 dark:from-amber-950/30 dark:to-yellow-950/20 shadow-clovely-sm hover:shadow-clovely-md hover:-translate-y-0.5 transition-all duration-300">
                      <p className="text-sm">{improvement}</p>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Suggestions */}
            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <div className="p-2 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5">
                  <TrendingUp className="h-5 w-5 text-primary" />
                </div>
                Sugerencias Específicas ({analysisData.suggestions.length})
              </h3>
              <div className="space-y-3">
                {analysisData.suggestions.map((suggestion, idx) => (
                  <Card key={idx} className="p-4 rounded-xl shadow-clovely-sm hover:shadow-clovely-md hover:-translate-y-0.5 transition-all duration-300 border-2">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="p-1.5 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5">
                            {getCategoryIcon(suggestion.category)}
                          </div>
                          <h4 className="font-medium">{suggestion.title}</h4>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">{suggestion.description}</p>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {suggestion.category === 'structure' ? 'Estructura' : 
                             suggestion.category === 'content' ? 'Contenido' : 
                             suggestion.category === 'keywords' ? 'Keywords' : 'Logros'}
                          </Badge>
                          <Badge className={`text-xs border-2 ${getPriorityBadgeColor(suggestion.priority)}`}>
                            {suggestion.priority === 'high' ? 'Alta' : suggestion.priority === 'medium' ? 'Media' : 'Baja'} prioridad
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
          <Button variant="outline" onClick={onClose} className="shadow-clovely-sm">
            Cerrar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
