import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CoachChat } from '@/components/coach/CoachChat';
import { CoachActionPlanner } from '@/components/coach/CoachActionPlanner';
import { CoachInterviewSimulator } from '@/components/coach/CoachInterviewSimulator';
import CareerCopilot from '@/components/CareerCopilot';
import { useAuthStore } from '@/store/useAuthStore';
import { useProgressStore } from '@/store/useProgressStore';
import { useActionPlanStore } from '@/store/useActionPlanStore';
import { Bot, MessageSquare, Target, Mic, BarChart3, BookOpen, Sparkles, TrendingUp, Zap, Flame } from 'lucide-react';

export default function Coach() {
  const user = useAuthStore((state) => state.user);
  const { progress } = useProgressStore();
  const { getCurrentWeekActions, getCompletionRate } = useActionPlanStore();
  const [selectedTab, setSelectedTab] = useState('chat');

  const userId = user?.id || 'demo_user';
  const weekActions = getCurrentWeekActions(userId);
  const completionRate = getCompletionRate(userId);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-gradient-to-r from-primary/5 to-secondary/5">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Bot className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-heading font-bold flex items-center gap-2">
                  Career Coach
                  <Sparkles className="h-5 w-5 text-primary" />
                </h1>
                <p className="text-sm text-muted-foreground">
                  Tu copiloto profesional impulsado por IA • Disponible 24/7
                </p>
              </div>
            </div>
            <Badge className="bg-green-500 text-white">
              <span className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse" />
              En línea
            </Badge>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Card className="p-3">
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="h-4 w-4 text-primary" />
                <span className="text-xs text-muted-foreground">Progreso Semanal</span>
              </div>
              <p className="text-2xl font-bold">{completionRate}%</p>
            </Card>
            <Card className="p-3">
              <div className="flex items-center gap-2 mb-1">
                <Target className="h-4 w-4 text-secondary" />
                <span className="text-xs text-muted-foreground">Microacciones</span>
              </div>
              <p className="text-2xl font-bold">{weekActions.length}</p>
            </Card>
            <Card className="p-3">
              <div className="flex items-center gap-2 mb-1">
                <Flame className="h-4 w-4 text-orange-500" />
                <span className="text-xs text-muted-foreground">Racha</span>
              </div>
              <p className="text-2xl font-bold">{progress?.streak || 0}d</p>
            </Card>
            <Card className="p-3">
              <div className="flex items-center gap-2 mb-1">
                <Zap className="h-4 w-4 text-yellow-500" />
                <span className="text-xs text-muted-foreground">Nivel</span>
              </div>
              <p className="text-2xl font-bold">{progress?.level || 1}</p>
            </Card>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 lg:w-auto">
            <TabsTrigger value="chat" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              <span className="hidden sm:inline">Chat</span>
            </TabsTrigger>
            <TabsTrigger value="planner" className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              <span className="hidden sm:inline">Planificador</span>
            </TabsTrigger>
            <TabsTrigger value="interview" className="flex items-center gap-2">
              <Mic className="h-4 w-4" />
              <span className="hidden sm:inline">Entrevistas</span>
            </TabsTrigger>
            <TabsTrigger value="analysis" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              <span className="hidden sm:inline">Análisis CV</span>
            </TabsTrigger>
            <TabsTrigger value="courses" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              <span className="hidden sm:inline">Cursos</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="chat" className="space-y-4">
            <div className="grid lg:grid-cols-2 gap-6">
              <CoachChat />
              <Card className="p-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  ¿En qué puedo ayudarte hoy?
                </h3>
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start" onClick={() => setSelectedTab('planner')}>
                    <Target className="mr-2 h-4 w-4" />
                    Generar plan semanal de microacciones
                  </Button>
                  <Button variant="outline" className="w-full justify-start" onClick={() => setSelectedTab('analysis')}>
                    <BarChart3 className="mr-2 h-4 w-4" />
                    Analizar y optimizar mi CV
                  </Button>
                  <Button variant="outline" className="w-full justify-start" onClick={() => setSelectedTab('interview')}>
                    <Mic className="mr-2 h-4 w-4" />
                    Simular entrevista con feedback IA
                  </Button>
                  <Button variant="outline" className="w-full justify-start" onClick={() => setSelectedTab('courses')}>
                    <BookOpen className="mr-2 h-4 w-4" />
                    Recomendar cursos y rutas de aprendizaje
                  </Button>
                </div>

                <div className="mt-6 p-4 bg-muted rounded-lg">
                  <h4 className="text-sm font-semibold mb-2">💡 Consejo del Coach</h4>
                  <p className="text-sm text-muted-foreground">
                    Completar microacciones diarias aumenta tu racha y desbloquea recompensas. 
                    ¡Mantén tu momentum de {progress?.streak || 0} días!
                  </p>
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="planner">
            <CoachActionPlanner />
          </TabsContent>

          <TabsContent value="interview">
            <CoachInterviewSimulator />
          </TabsContent>

          <TabsContent value="analysis">
            <div className="max-w-4xl">
              <CareerCopilot />
            </div>
          </TabsContent>

          <TabsContent value="courses">
            <Card className="p-6">
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Cursos Personalizados</h3>
                <p className="text-muted-foreground mb-6">
                  El coach analizará tu perfil y generará recomendaciones de cursos adaptadas a tus objetivos
                </p>
                <Button size="lg">
                  <Sparkles className="mr-2 h-5 w-5" />
                  Generar Recomendaciones
                </Button>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
