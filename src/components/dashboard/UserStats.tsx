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
      color: 'text-orange-500',
      bgColor: 'bg-orange-500/10'
    },
    {
      label: 'Aplicaciones',
      value: applicationsSubmitted,
      unit: 'enviadas',
      icon: Send,
      color: 'text-primary',
      bgColor: 'bg-primary/10'
    },
    {
      label: 'Rol',
      value: role || 'Sin definir',
      unit: '',
      icon: Briefcase,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      isText: true
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {stats.map((stat) => (
        <Card key={stat.label} className="p-6 gradient-card">
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-lg ${stat.bgColor}`}>
              <stat.icon className={`h-6 w-6 ${stat.color}`} />
            </div>
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              {stat.isText ? (
                <p className="text-lg font-bold">{stat.value}</p>
              ) : (
                <div className="flex items-baseline gap-1">
                  <p className="text-2xl font-bold">{stat.value}</p>
                  {stat.unit && (
                    <span className="text-sm text-muted-foreground">{stat.unit}</span>
                  )}
                </div>
              )}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
