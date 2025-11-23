import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
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
      color: 'bg-primary',
    },
    {
      icon: Mic,
      label: 'Entrevistas Practicadas',
      value: interviewsPracticed,
      max: 10,
      color: 'bg-primary',
    },
    {
      icon: Bookmark,
      label: 'Oportunidades Guardadas',
      value: opportunitiesSaved,
      max: 20,
      color: 'bg-primary',
    },
  ];

  return (
    <Card className="p-8">
      <h3 className="font-heading font-semibold text-xl mb-6">Tu Progreso</h3>
      <div className="space-y-6">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          const percentage = Math.min((metric.value / metric.max) * 100, 100);
          
          return (
            <div key={metric.label} className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-primary/10">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <span className="text-sm font-medium">{metric.label}</span>
                </div>
                <span className="text-sm font-semibold text-muted-foreground">
                  {metric.value}/{metric.max}
                </span>
              </div>
              <Progress value={percentage} className="h-2.5" />
            </div>
          );
        })}
      </div>
    </Card>
  );
}
