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
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/10 to-primary-warm/20 mb-4 shadow-clovely-md">
          <Mic className="w-10 h-10 text-primary" />
        </div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary-warm bg-clip-text text-transparent">Practica Entrevistas con IA</h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Mejora tus habilidades de entrevista con retroalimentación instantánea y personalizada
        </p>
        <Button size="lg" onClick={() => navigate('/dashboard/interviews/setup')} variant="premium" className="mt-4 shadow-clovely-glow">
          Comenzar Nueva Práctica
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 space-y-2 rounded-2xl shadow-clovely-md hover:shadow-clovely-lg hover:-translate-y-1 transition-all duration-300">
          <div className="flex items-center gap-2 text-muted-foreground">
            <div className="p-2 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5">
              <Target className="w-4 h-4 text-primary" />
            </div>
            <span className="text-sm">Entrevistas</span>
          </div>
          <p className="text-3xl font-bold bg-gradient-to-r from-primary to-primary-warm bg-clip-text text-transparent">{metrics.interviewCount}</p>
        </Card>
        <Card className="p-4 space-y-2 rounded-2xl shadow-clovely-md hover:shadow-clovely-lg hover:-translate-y-1 transition-all duration-300">
          <div className="flex items-center gap-2 text-muted-foreground">
            <div className="p-2 rounded-xl bg-gradient-to-br from-green-500/10 to-emerald-500/10">
              <TrendingUp className="w-4 h-4 text-green-600" />
            </div>
            <span className="text-sm">Mejor Puntuación</span>
          </div>
          <p className="text-3xl font-bold text-green-600">{metrics.bestScore}</p>
        </Card>
        <Card className="p-4 space-y-2 rounded-2xl shadow-clovely-md hover:shadow-clovely-lg hover:-translate-y-1 transition-all duration-300">
          <div className="flex items-center gap-2 text-muted-foreground">
            <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500/10 to-cyan-500/10">
              <TrendingUp className="w-4 h-4 text-blue-600" />
            </div>
            <span className="text-sm">Promedio</span>
          </div>
          <p className="text-3xl font-bold text-blue-600">{Math.round(metrics.averageScore)}</p>
        </Card>
        <Card className="p-4 space-y-2 rounded-2xl shadow-clovely-md hover:shadow-clovely-lg hover:-translate-y-1 transition-all duration-300">
          <div className="flex items-center gap-2 text-muted-foreground">
            <div className="p-2 rounded-xl bg-gradient-to-br from-amber-500/10 to-yellow-500/10">
              <Clock className="w-4 h-4 text-amber-600" />
            </div>
            <span className="text-sm">Racha</span>
          </div>
          <p className="text-3xl font-bold text-amber-600">{metrics.streaks} días</p>
        </Card>
      </div>

      {/* Recent Sessions */}
      {recentSessions.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Prácticas Recientes</h2>
          <div className="grid gap-4">
            {recentSessions.map((session) => (
              <Card key={session.id} className="p-4 rounded-xl border-2 hover:shadow-clovely-md hover:-translate-y-0.5 transition-all duration-300">
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
                    <p className="text-2xl font-bold text-primary">{session.finalScore}</p>
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
        <Card className="p-6 space-y-3 rounded-2xl shadow-clovely-md hover:shadow-clovely-lg hover:-translate-y-1 transition-all duration-300">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/10 to-primary-warm/20 flex items-center justify-center shadow-clovely-sm">
            <Mic className="w-7 h-7 text-primary" />
          </div>
          <h3 className="text-lg font-semibold">Práctica Realista</h3>
          <p className="text-muted-foreground">
            Preguntas adaptadas a tu industria y nivel de experiencia
          </p>
        </Card>
        <Card className="p-6 space-y-3 rounded-2xl shadow-clovely-md hover:shadow-clovely-lg hover:-translate-y-1 transition-all duration-300">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-500/10 to-emerald-500/20 flex items-center justify-center shadow-clovely-sm">
            <TrendingUp className="w-7 h-7 text-green-600" />
          </div>
          <h3 className="text-lg font-semibold">Retroalimentación Instantánea</h3>
          <p className="text-muted-foreground">
            Análisis detallado de tus respuestas con sugerencias de mejora
          </p>
        </Card>
        <Card className="p-6 space-y-3 rounded-2xl shadow-clovely-md hover:shadow-clovely-lg hover:-translate-y-1 transition-all duration-300">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500/10 to-cyan-500/20 flex items-center justify-center shadow-clovely-sm">
            <Target className="w-7 h-7 text-blue-600" />
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
