import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Clock, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

interface DailyPracticeProps {
  completed?: boolean;
  onComplete?: () => void;
}

export function DailyPractice({ completed = false, onComplete }: DailyPracticeProps) {
  const practice = {
    title: 'Mejora tu respuesta STAR',
    description: 'Practica responder preguntas usando el método Situación-Tarea-Acción-Resultado',
    duration: '10 min',
    type: 'Entrevista',
  };

  return (
    <Card className="p-6 border-primary/20 bg-gradient-to-br from-primary/5 to-background">
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              <h3 className="font-semibold text-lg">Práctica del Día</h3>
            </div>
            <Badge variant="secondary" className="text-xs">
              {practice.type}
            </Badge>
          </div>
          {completed && (
            <CheckCircle2 className="h-6 w-6 text-green-600" />
          )}
        </div>

        <div>
          <h4 className="font-medium mb-1">{practice.title}</h4>
          <p className="text-sm text-muted-foreground">{practice.description}</p>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>{practice.duration}</span>
          </div>
          
          {completed ? (
            <Button variant="outline" size="sm" disabled>
              Completado ✓
            </Button>
          ) : (
            <Link to="/dashboard/cvs">
              <Button size="sm" className="bg-primary hover:bg-primary/90">
                Comenzar
              </Button>
            </Link>
          )}
        </div>
      </div>
    </Card>
  );
}
