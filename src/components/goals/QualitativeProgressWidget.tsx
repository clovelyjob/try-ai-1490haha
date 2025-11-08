import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Circle, Target } from 'lucide-react';

interface QualitativeProgressWidgetProps {
  completedMicroactions: number;
  totalMicroactions: number;
  size?: 'sm' | 'md' | 'lg';
}

export const QualitativeProgressWidget = ({
  completedMicroactions,
  totalMicroactions,
  size = 'md',
}: QualitativeProgressWidgetProps) => {
  const getProgressLabel = () => {
    const ratio = completedMicroactions / totalMicroactions;
    if (ratio === 0) return { label: 'Por iniciar', color: 'bg-muted/50 text-muted-foreground' };
    if (ratio < 0.3) return { label: 'En exploración', color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400' };
    if (ratio < 0.7) return { label: 'En progreso', color: 'bg-primary/10 text-primary' };
    if (ratio < 1) return { label: 'Casi listo', color: 'bg-secondary/10 text-secondary' };
    return { label: 'Completado', color: 'bg-success/10 text-success' };
  };

  const { label, color } = getProgressLabel();
  const sizeClasses = {
    sm: 'h-16 w-16',
    md: 'h-24 w-24',
    lg: 'h-32 w-32'
  };

  return (
    <div className="space-y-3">
      <motion.div 
        className={`${sizeClasses[size]} rounded-full flex items-center justify-center relative`}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', delay: 0.2 }}
      >
        <div className={`absolute inset-0 rounded-full ${color} opacity-20`} />
        <div className="relative text-center">
          {completedMicroactions === totalMicroactions ? (
            <CheckCircle2 className="h-8 w-8 mx-auto text-success" />
          ) : (
            <Target className="h-8 w-8 mx-auto text-primary" />
          )}
        </div>
      </motion.div>

      <div className="text-center space-y-2">
        <Badge className={`${color} border`} variant="outline">
          {label}
        </Badge>
        <div className="flex items-center justify-center gap-1">
          {Array.from({ length: totalMicroactions }).map((_, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: i * 0.05 }}
            >
              {i < completedMicroactions ? (
                <CheckCircle2 className="h-3 w-3 text-success" />
              ) : (
                <Circle className="h-3 w-3 text-muted-foreground/30" />
              )}
            </motion.div>
          ))}
        </div>
        <p className="text-xs text-muted-foreground">
          {completedMicroactions} de {totalMicroactions} microacciones
        </p>
      </div>
    </div>
  );
};
