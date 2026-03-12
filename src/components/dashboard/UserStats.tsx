import { Card } from '@/components/ui/card';
import { Flame, Send, Briefcase } from 'lucide-react';

interface UserStatsProps {
  streak: number;
  applicationsSubmitted: number;
  role?: string;
}

export function UserStats({ streak, applicationsSubmitted, role }: UserStatsProps) {
  const stats = [
    {
      label: 'Racha',
      value: streak,
      unit: streak === 1 ? 'día' : 'días',
      icon: Flame,
      isText: false,
    },
    {
      label: 'Aplicaciones',
      value: applicationsSubmitted,
      unit: 'enviadas',
      icon: Send,
      isText: false,
    },
    {
      label: 'Rol',
      value: role || 'Sin definir',
      unit: '',
      icon: Briefcase,
      isText: true,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      {stats.map((stat) => (
        <Card 
          key={stat.label} 
          className="p-5 border-border/50 hover:border-primary/20 transition-all duration-200"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/8">
              <stat.icon className="h-4 w-4 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-muted-foreground mb-0.5">{stat.label}</p>
              {stat.isText ? (
                <p className="text-sm font-semibold text-foreground truncate">{stat.value}</p>
              ) : (
                <div className="flex items-baseline gap-1">
                  <p className="text-lg font-bold text-foreground">{stat.value}</p>
                  {stat.unit && <span className="text-xs text-muted-foreground">{stat.unit}</span>}
                </div>
              )}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
