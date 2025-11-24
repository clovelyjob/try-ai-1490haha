import { Card } from '@/components/ui/card';
import { FileText, Mic, Bookmark } from 'lucide-react';

interface ProgressBarProps {
  cvCompleted: number;
  interviewsPracticed: number;
  opportunitiesSaved: number;
}

export function ProgressBar({ 
  cvCompleted = 0, 
  interviewsPracticed = 0, 
  opportunitiesSaved = 0 
}: ProgressBarProps) {
  const metrics = [
    {
      icon: FileText,
      label: 'CV Completado',
      value: cvCompleted,
      max: 100,
    },
    {
      icon: Mic,
      label: 'Entrevistas Practicadas',
      value: interviewsPracticed,
      max: 10,
    },
    {
      icon: Bookmark,
      label: 'Oportunidades Guardadas',
      value: opportunitiesSaved,
      max: 20,
    },
  ];

  const getProgressGradient = (percentage: number) => {
    if (percentage <= 30) {
      return 'bg-gradient-to-r from-red-500 to-orange-500';
    } else if (percentage <= 70) {
      return 'bg-gradient-to-r from-yellow-500 to-amber-500';
    } else {
      return 'bg-gradient-to-r from-green-500 to-emerald-500';
    }
  };

  return (
    <Card className="p-8 rounded-2xl shadow-clovely-md">
      <h3 className="font-heading font-semibold text-xl mb-6">Tu Progreso</h3>
      <div className="space-y-6">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          const percentage = Math.min((metric.value / metric.max) * 100, 100);
          const gradientClass = getProgressGradient(percentage);
          
          return (
            <div key={metric.label} className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 shadow-sm">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <span className="text-sm font-medium">{metric.label}</span>
                </div>
                <span className="text-sm font-semibold text-muted-foreground">
                  {metric.value}/{metric.max}
                </span>
              </div>
              <div className="relative h-2.5 w-full overflow-hidden rounded-full bg-secondary">
                <div 
                  className={`h-full transition-all duration-500 ${gradientClass}`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
