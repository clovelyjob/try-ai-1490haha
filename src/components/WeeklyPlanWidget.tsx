import { useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import { useActionPlanStore } from '@/store/useActionPlanStore';
import { useAuthStore } from '@/store/useAuthStore';
import { useProgressStore } from '@/store/useProgressStore';
import { useToast } from '@/hooks/use-toast';
import {
  CheckCircle2,
  Circle,
  Clock,
  Target,
  TrendingUp,
  Sparkles,
  Calendar,
} from 'lucide-react';
import type { ActionPriority, ActionStatus } from '@/store/useActionPlanStore';

export default function WeeklyPlanWidget() {
  const { toast } = useToast();
  const user = useAuthStore((state) => state.user);
  const addXP = useProgressStore((state) => state.addXP);
  const completeTask = useProgressStore((state) => state.completeTask);
  
  const getCurrentWeekActions = useActionPlanStore((state) => state.getCurrentWeekActions);
  const completeAction = useActionPlanStore((state) => state.completeAction);
  const skipAction = useActionPlanStore((state) => state.skipAction);
  const getCompletionRate = useActionPlanStore((state) => state.getCompletionRate);
  const generateWeeklyPlan = useActionPlanStore((state) => state.generateWeeklyPlan);

  useEffect(() => {
    if (user) {
      const actions = getCurrentWeekActions(user.id);
      if (actions.length === 0) {
        generateWeeklyPlan(user.id);
      }
    }
  }, [user, getCurrentWeekActions, generateWeeklyPlan]);

  if (!user) return null;

  const weekActions = getCurrentWeekActions(user.id);
  const completionRate = getCompletionRate(user.id);

  const handleComplete = (actionId: string, xpReward: number) => {
    completeAction(actionId);
    addXP(xpReward);
    completeTask();
    
    toast({
      title: '¡Microacción completada!',
      description: `Has ganado ${xpReward} XP`,
    });
  };

  const getPriorityColor = (priority: ActionPriority) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-700';
      case 'medium':
        return 'bg-yellow-100 text-yellow-700';
      case 'low':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getPriorityLabel = (priority: ActionPriority) => {
    switch (priority) {
      case 'high':
        return 'Alta';
      case 'medium':
        return 'Media';
      case 'low':
        return 'Baja';
      default:
        return priority;
    }
  };

  const getStatusIcon = (status: ActionStatus) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="w-5 h-5 text-green-600" />;
      case 'in_progress':
        return <Clock className="w-5 h-5 text-yellow-600" />;
      default:
        return <Circle className="w-5 h-5 text-gray-400" />;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es', { 
      weekday: 'short',
      day: 'numeric',
      month: 'short' 
    });
  };

  const isPastDue = (dueDate: string) => {
    return new Date(dueDate) < new Date();
  };

  return (
    <Card className="p-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Target className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">
                Plan semanal
              </h3>
              <p className="text-sm text-muted-foreground">
                {weekActions.length} microacciones
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => generateWeeklyPlan(user.id)}
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Generar nuevo
          </Button>
        </div>

        {/* Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Progreso semanal</span>
            <span className="font-semibold text-foreground">
              {completionRate}%
            </span>
          </div>
          <Progress value={completionRate} className="h-2" />
        </div>

        {/* Actions List */}
        <div className="space-y-3">
          {weekActions.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-sm text-muted-foreground mb-4">
                No hay microacciones para esta semana
              </p>
              <Button onClick={() => generateWeeklyPlan(user.id)}>
                <Sparkles className="w-4 h-4 mr-2" />
                Generar plan semanal
              </Button>
            </div>
          ) : (
            weekActions
              .sort((a, b) => {
                // Sort by status (pending first), then by priority
                if (a.status !== b.status) {
                  const statusOrder = { pending: 0, in_progress: 1, completed: 2, skipped: 3 };
                  return statusOrder[a.status] - statusOrder[b.status];
                }
                const priorityOrder = { high: 0, medium: 1, low: 2 };
                return priorityOrder[a.priority] - priorityOrder[b.priority];
              })
              .map((action) => (
                <Card
                  key={action.id}
                  className={`p-4 ${
                    action.status === 'completed'
                      ? 'opacity-60 bg-muted/50'
                      : ''
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <Checkbox
                      checked={action.status === 'completed'}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          handleComplete(action.id, action.xpReward);
                        }
                      }}
                      disabled={action.status === 'completed'}
                      className="mt-1"
                    />
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h4
                          className={`text-sm font-medium ${
                            action.status === 'completed'
                              ? 'line-through text-muted-foreground'
                              : 'text-foreground'
                          }`}
                        >
                          {action.title}
                        </h4>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant="outline"
                            className={`text-xs ${getPriorityColor(action.priority)}`}
                          >
                            {getPriorityLabel(action.priority)}
                          </Badge>
                        </div>
                      </div>
                      
                      <p className="text-xs text-muted-foreground mb-2">
                        {action.description}
                      </p>

                      <div className="flex items-center gap-4 text-xs">
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Calendar className="w-3 h-3" />
                          <span
                            className={
                              isPastDue(action.dueDate) && action.status !== 'completed'
                                ? 'text-red-600 font-medium'
                                : ''
                            }
                          >
                            {formatDate(action.dueDate)}
                          </span>
                        </div>
                        {action.status !== 'completed' && (
                          <div className="flex items-center gap-1 text-primary">
                            <TrendingUp className="w-3 h-3" />
                            <span>{action.xpReward} XP</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              ))
          )}
        </div>

        {/* Completion message */}
        {completionRate === 100 && weekActions.length > 0 && (
          <Card className="p-4 bg-green-50 border-green-200">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-6 h-6 text-green-600" />
              <div>
                <h4 className="text-sm font-semibold text-green-900">
                  ¡Semana completada!
                </h4>
                <p className="text-xs text-green-700">
                  Has completado todas tus microacciones. ¡Sigue así! 🎉
                </p>
              </div>
            </div>
          </Card>
        )}
      </div>
    </Card>
  );
}
