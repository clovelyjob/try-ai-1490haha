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
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {stats.map((stat) => (
        <Card key={stat.label} className="p-8 bg-gradient-to-br from-card to-card/50 backdrop-blur-sm border-border/50 hover:border-primary/20 transition-all duration-300 group cursor-pointer">
          <div className="flex items-center gap-4">
            <div className={`p-4 rounded-2xl ${stat.bgColor} group-hover:scale-110 transition-transform shadow-clovely-md`}>
              <stat.icon className={`h-7 w-7 ${stat.color}`} />
            </div>
            <div className="flex-1">
              <p className="text-sm text-muted-foreground font-medium mb-1">{stat.label}</p>
              {stat.isText ? (
                <p className="text-xl font-heading font-bold">{stat.value}</p>
              ) : (
                <div className="flex items-baseline gap-1">
                  <p className="text-3xl font-heading font-bold">{stat.value}</p>
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
