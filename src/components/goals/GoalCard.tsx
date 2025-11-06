import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Goal } from '@/types';
import { MoreVertical, Eye, Edit, Copy, Download, Trash2, Calendar, Target } from 'lucide-react';

interface GoalCardProps {
  goal: Goal;
  onEdit: (goal: Goal) => void;
  onDuplicate: (goalId: string) => void;
  onDelete: (goalId: string) => void;
}

const categoryColors = {
  career: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
  learning: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  wellbeing: 'bg-green-500/10 text-green-500 border-green-500/20',
  networking: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
  other: 'bg-gray-500/10 text-gray-500 border-gray-500/20',
};

const statusColors = {
  pending: 'bg-gray-500/10 text-gray-600 dark:text-gray-400',
  in_progress: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
  paused: 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400',
  completed: 'bg-green-500/10 text-green-600 dark:text-green-400',
  abandoned: 'bg-red-500/10 text-red-600 dark:text-red-400',
};

const priorityDots = {
  alta: 'bg-red-500',
  media: 'bg-yellow-500',
  baja: 'bg-green-500',
};

export const GoalCard = ({ goal, onEdit, onDuplicate, onDelete }: GoalCardProps) => {
  const completedMicroactions = goal.microactions.filter((m) => m.completed).length;
  const totalMicroactions = goal.microactions.length;
  
  const daysUntilDue = goal.dueDate
    ? Math.ceil((new Date(goal.dueDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline" className={categoryColors[goal.category]}>
                  {goal.category}
                </Badge>
                <Badge variant="outline" className={statusColors[goal.status]}>
                  {goal.status.replace('_', ' ')}
                </Badge>
                <div className={`w-2 h-2 rounded-full ${priorityDots[goal.priority]}`} />
              </div>
              <Link to={`/dashboard/goals/${goal.id}`}>
                <h3 className="font-heading font-semibold text-lg hover:text-primary transition-colors">
                  {goal.title}
                </h3>
              </Link>
              {goal.description && (
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                  {goal.description}
                </p>
              )}
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link to={`/dashboard/goals/${goal.id}`}>
                    <Eye className="h-4 w-4 mr-2" />
                    Ver
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onEdit(goal)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Editar
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onDuplicate(goal.id)}>
                  <Copy className="h-4 w-4 mr-2" />
                  Duplicar
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Download className="h-4 w-4 mr-2" />
                  Exportar
                </DropdownMenuItem>
                {!goal.assignedByAdmin && (
                  <DropdownMenuItem
                    onClick={() => onDelete(goal.id)}
                    className="text-destructive focus:text-destructive"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Eliminar
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {/* Progress */}
            <div>
              <div className="flex items-center justify-between mb-1 text-sm">
                <span className="text-muted-foreground">Progreso</span>
                <span className="font-semibold">{goal.progress}%</span>
              </div>
              <Progress value={goal.progress} className="h-2" />
            </div>

            {/* Stats */}
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-1 text-muted-foreground">
                <Target className="h-4 w-4" />
                <span>
                  {completedMicroactions}/{totalMicroactions} microacciones
                </span>
              </div>
              {daysUntilDue !== null && (
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span
                    className={
                      daysUntilDue < 0
                        ? 'text-destructive'
                        : daysUntilDue < 7
                        ? 'text-yellow-600 dark:text-yellow-400'
                        : ''
                    }
                  >
                    {daysUntilDue < 0
                      ? `Vencido hace ${Math.abs(daysUntilDue)}d`
                      : daysUntilDue === 0
                      ? 'Vence hoy'
                      : `${daysUntilDue}d restantes`}
                  </span>
                </div>
              )}
            </div>

            {/* Tags */}
            {goal.tags && goal.tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {goal.tags.slice(0, 3).map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
                {goal.tags.length > 3 && (
                  <Badge variant="secondary" className="text-xs">
                    +{goal.tags.length - 3}
                  </Badge>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
