import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Mic, TrendingUp, Target, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useInterviewStore } from "@/store/useInterviewStore";

export default function InterviewLanding() {
  const navigate = useNavigate();
  const { sessions, metrics } = useInterviewStore();

  const recentSessions = sessions.slice(-3).reverse();

  return (
    <div className="container max-w-6xl py-8 space-y-8">
      {/* Hero Section */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
          <Mic className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-4xl font-bold">Practica Entrevistas con IA</h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Mejora tus habilidades de entrevista con retroalimentación instantánea y personalizada
        </p>
        <Button size="lg" onClick={() => navigate('/dashboard/interviews/setup')} className="mt-4">
          Comenzar Nueva Práctica
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 space-y-2">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Target className="w-4 h-4" />
            <span className="text-sm">Entrevistas</span>
          </div>
          <p className="text-3xl font-bold">{metrics.interviewCount}</p>
        </Card>
        <Card className="p-4 space-y-2">
          <div className="flex items-center gap-2 text-muted-foreground">
            <TrendingUp className="w-4 h-4" />
            <span className="text-sm">Mejor Puntuación</span>
          </div>
          <p className="text-3xl font-bold">{metrics.bestScore}</p>
        </Card>
        <Card className="p-4 space-y-2">
          <div className="flex items-center gap-2 text-muted-foreground">
            <TrendingUp className="w-4 h-4" />
            <span className="text-sm">Promedio</span>
          </div>
          <p className="text-3xl font-bold">{Math.round(metrics.averageScore)}</p>
        </Card>
        <Card className="p-4 space-y-2">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span className="text-sm">Racha</span>
          </div>
          <p className="text-3xl font-bold">{metrics.streaks} días</p>
        </Card>
      </div>

      {/* Recent Sessions */}
      {recentSessions.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Prácticas Recientes</h2>
          <div className="grid gap-4">
            {recentSessions.map((session) => (
              <Card key={session.id} className="p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <h3 className="font-medium">{session.role}</h3>
                    <p className="text-sm text-muted-foreground">
                      {new Date(session.startedAt).toLocaleDateString('es-ES', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                  <div className="text-right space-y-1">
                    <p className="text-2xl font-bold">{session.finalScore}</p>
                    <p className="text-sm text-muted-foreground">Puntuación</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Benefits */}
      <div className="grid md:grid-cols-3 gap-6 mt-12">
        <Card className="p-6 space-y-3">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <Mic className="w-6 h-6 text-primary" />
          </div>
          <h3 className="text-lg font-semibold">Práctica Realista</h3>
          <p className="text-muted-foreground">
            Preguntas adaptadas a tu industria y nivel de experiencia
          </p>
        </Card>
        <Card className="p-6 space-y-3">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <TrendingUp className="w-6 h-6 text-primary" />
          </div>
          <h3 className="text-lg font-semibold">Retroalimentación Instantánea</h3>
          <p className="text-muted-foreground">
            Análisis detallado de tus respuestas con sugerencias de mejora
          </p>
        </Card>
        <Card className="p-6 space-y-3">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <Target className="w-6 h-6 text-primary" />
          </div>
          <h3 className="text-lg font-semibold">Mejora Continua</h3>
          <p className="text-muted-foreground">
            Rastrea tu progreso y identifica áreas de oportunidad
          </p>
        </Card>
      </div>
    </div>
  );
}
