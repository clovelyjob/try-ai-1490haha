import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { useActionPlanStore } from '@/store/useActionPlanStore';
import { useAuthStore } from '@/store/useAuthStore';
import { Sparkles, Clock, Target, Zap, Calendar, Loader2, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

export function CoachActionPlanner() {
  const user = useAuthStore((state) => state.user);
  const { generateWeeklyPlan, getCurrentWeekActions, completeAction } = useActionPlanStore();
  const [isGenerating, setIsGenerating] = useState(false);

  const userId = user?.id || 'demo_user';
  const weekActions = getCurrentWeekActions(userId);

  const handleGeneratePlan = async () => {
    setIsGenerating(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      generateWeeklyPlan(userId);
      toast.success('Plan semanal generado con éxito', {
        description: 'He creado 5 microacciones personalizadas para ti',
      });
    } catch (error) {
      toast.error('Error al generar el plan');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCompleteAction = (actionId: string) => {
    completeAction(actionId);
    toast.success('¡Microacción completada!', {
      description: 'Has ganado XP y monedas',
    });
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
        return 'outline';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'cv':
        return '📄';
      case 'interview':
        return '🎤';
      case 'networking':
        return '🤝';
      case 'learning':
        return '📚';
      case 'application':
        return '📨';
      default:
        return '🎯';
    }
  };

  if (weekActions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Plan Semanal de Microacciones
          </CardTitle>
          <CardDescription>
            Deja que el coach genere un plan personalizado de acciones para esta semana
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Sparkles className="h-8 w-8 text-primary" />
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Genera tu plan semanal de microacciones optimizadas con IA
            </p>
            <Button onClick={handleGeneratePlan} disabled={isGenerating} size="lg">
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generando plan...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Generar Plan Semanal
                </>
              )}
            </Button>
          </div>

          <div className="border-t pt-4">
            <h4 className="font-medium mb-3">¿Qué incluye el plan?</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary mt-0.5" />
                <span>3-7 microacciones priorizadas según tu perfil</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary mt-0.5" />
                <span>Tiempo estimado y dificultad de cada tarea</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary mt-0.5" />
                <span>Recompensas en XP y monedas por completar</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary mt-0.5" />
                <span>Adaptado a tu mapa de carrera y objetivos</span>
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>
    );
  }

  const completedCount = weekActions.filter((a) => a.status === 'completed').length;
  const completionRate = Math.round((completedCount / weekActions.length) * 100);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Plan Semanal de Microacciones
            </CardTitle>
            <CardDescription>
              {completedCount}/{weekActions.length} completadas • {completionRate}% progreso
            </CardDescription>
          </div>
          <Button onClick={handleGeneratePlan} disabled={isGenerating} variant="outline" size="sm">
            {isGenerating ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="mr-2 h-4 w-4" />
            )}
            Regenerar
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {weekActions.map((action, index) => (
          <motion.div
            key={action.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card
              className={`p-4 ${
                action.status === 'completed' ? 'bg-muted/50 opacity-75' : 'hover:shadow-md'
              } transition-all`}
            >
              <div className="flex items-start gap-3">
                <Checkbox
                  checked={action.status === 'completed'}
                  onCheckedChange={() => handleCompleteAction(action.id)}
                  className="mt-1"
                />
                <div className="flex-1 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-lg">{getCategoryIcon(action.category)}</span>
                        <h4
                          className={`font-medium ${
                            action.status === 'completed' ? 'line-through text-muted-foreground' : ''
                          }`}
                        >
                          {action.title}
                        </h4>
                      </div>
                      <p className="text-sm text-muted-foreground">{action.description}</p>
                    </div>
                    <Badge variant={getPriorityColor(action.priority)}>{action.priority}</Badge>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span>{new Date(action.dueDate).toLocaleDateString('es-ES')}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Zap className="h-3 w-3 text-primary" />
                      <span className="font-medium text-primary">+{action.xpReward} XP</span>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {action.category}
                    </Badge>
                  </div>

                  {action.status !== 'completed' && (
                    <Button size="sm" variant="outline" className="w-full">
                      Empezar ahora
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </CardContent>
    </Card>
  );
}
