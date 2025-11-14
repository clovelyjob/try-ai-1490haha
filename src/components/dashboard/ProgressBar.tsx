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
    <Card className="p-6">
      <h3 className="font-semibold text-lg mb-4">Tu Progreso</h3>
      <div className="space-y-4">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          const percentage = Math.min((metric.value / metric.max) * 100, 100);
          
          return (
            <div key={metric.label} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Icon className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">{metric.label}</span>
                </div>
                <span className="text-sm text-muted-foreground">
                  {metric.value}/{metric.max}
                </span>
              </div>
              <Progress value={percentage} className="h-2" />
            </div>
          );
        })}
      </div>
    </Card>
  );
}
