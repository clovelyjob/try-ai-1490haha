import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Briefcase, MapPin, Clock, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';

export function DailyJob() {
  const job = {
    id: 'opp_1',
    title: 'Product Designer',
    company: 'Mercado Libre',
    location: 'Remoto',
    matchScore: 94,
    postedAgo: 'Hace 2h',
    tags: ['UI/UX', 'Figma', 'Design Systems'],
  };

  return (
    <Card className="p-6 border-primary/20 bg-gradient-to-br from-primary/5 to-background">
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              <h3 className="font-semibold text-lg">Trabajo del Día</h3>
            </div>
            <Badge variant="secondary" className="text-xs bg-primary/10 text-primary">
              {job.matchScore}% Match
            </Badge>
          </div>
          <Briefcase className="h-6 w-6 text-primary" />
        </div>

        <div>
          <h4 className="font-medium text-lg mb-1">{job.title}</h4>
          <p className="text-muted-foreground font-medium">{job.company}</p>
          <div className="flex items-center gap-3 mt-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" />
              <span>{job.location}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              <span>{job.postedAgo}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {job.tags.map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>

        <Link to={`/dashboard/opportunities/${job.id}`}>
          <Button className="w-full bg-primary hover:bg-primary/90">
            Ver Detalles
          </Button>
        </Link>
      </div>
    </Card>
  );
}
