import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { Mic, Target, TrendingUp, History, Sparkles } from 'lucide-react';
import { useInterviewStore } from '@/store/useInterviewStore';

export default function InterviewLanding() {
  const navigate = useNavigate();
  const metrics = useInterviewStore((state) => state.metrics);

  const features = [
    {
      icon: Mic,
      title: 'Práctica realista',
      description: 'Simula entrevistas reales con preguntas adaptadas a tu perfil y puesto objetivo',
    },
    {
      icon: Target,
      title: 'Feedback inmediato',
      description: 'Recibe evaluación detallada después de cada respuesta con puntos de mejora',
    },
    {
      icon: TrendingUp,
      title: 'Sigue tu progreso',
      description: 'Mide tu evolución con métricas claras y recomendaciones personalizadas',
    },
    {
      icon: Sparkles,
      title: 'Coach con IA',
      description: 'Entrenador inteligente que se adapta a tu nivel y te ayuda a brillar',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-6xl mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            Tu coach de entrevistas personal
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Practica entrevistas con
            <span className="text-primary"> confianza</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Prepárate para tu próxima entrevista con simulaciones realistas, feedback instantáneo y un plan personalizado para mejorar
          </p>
          <div className="flex gap-4 justify-center">
            <Button
              size="lg"
              onClick={() => navigate('/dashboard/interviews/setup')}
              className="gap-2"
            >
              <Mic className="w-5 h-5" />
              Iniciar práctica
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate('/dashboard/interviews/history')}
              className="gap-2"
            >
              <History className="w-5 h-5" />
              Ver historial
            </Button>
          </div>
        </div>

        {/* Stats */}
        {metrics.interviewCount > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            <Card className="p-6 text-center">
              <div className="text-3xl font-bold text-primary mb-2">
                {metrics.interviewCount}
              </div>
              <div className="text-sm text-muted-foreground">
                Entrevistas practicadas
              </div>
            </Card>
            <Card className="p-6 text-center">
              <div className="text-3xl font-bold text-primary mb-2">
                {metrics.bestScore}
              </div>
              <div className="text-sm text-muted-foreground">
                Mejor puntuación
              </div>
            </Card>
            <Card className="p-6 text-center">
              <div className="text-3xl font-bold text-primary mb-2">
                {Math.round(metrics.averageScore)}
              </div>
              <div className="text-sm text-muted-foreground">
                Promedio general
              </div>
            </Card>
          </div>
        )}

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* How it works */}
        <div className="bg-muted/50 rounded-lg p-8">
          <h2 className="text-2xl font-bold text-foreground mb-6 text-center">
            ¿Cómo funciona?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="font-semibold text-foreground mb-2">
                Configura tu sesión
              </h3>
              <p className="text-sm text-muted-foreground">
                Elige el rol, nivel y tipo de entrevista que quieres practicar
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="font-semibold text-foreground mb-2">
                Responde preguntas
              </h3>
              <p className="text-sm text-muted-foreground">
                Practica con preguntas realistas y recibe feedback inmediato
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="font-semibold text-foreground mb-2">
                Mejora continua
              </h3>
              <p className="text-sm text-muted-foreground">
                Aplica las recomendaciones y ve tu progreso sesión tras sesión
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
