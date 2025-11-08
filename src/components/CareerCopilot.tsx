import { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuthStore } from '@/store/useAuthStore';
import { useCoachStore } from '@/store/useCoachStore';
import { useCVStore } from '@/store/useCVStore';
import { useActionPlanStore } from '@/store/useActionPlanStore';
import { Bot, Send, Sparkles, TrendingUp, FileText, Target, Briefcase, BookOpen, BarChart3, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export default function CareerCopilot() {
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();
  
  const {
    messages,
    isProcessing,
    currentAnalysis,
    currentFitScore,
    courseRecommendations,
    initContext,
    sendMessage,
    analyzeCV,
    generateCourseRecommendations,
  } = useCoachStore();

  const { cvs } = useCVStore();
  const { getCurrentWeekActions, getCompletionRate } = useActionPlanStore();

  const [input, setInput] = useState('');
  const [selectedTab, setSelectedTab] = useState('chat');
  const scrollRef = useRef<HTMLDivElement>(null);

  const userId = user?.id || 'demo_user';
  const userMessages = messages[userId] || [];
  const weekActions = getCurrentWeekActions(userId);
  const completionRate = getCompletionRate(userId);

  useEffect(() => {
    initContext(userId);
  }, [userId, initContext]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [userMessages]);

  const handleSend = async () => {
    if (!input.trim() || isProcessing) return;
    
    const message = input;
    setInput('');
    
    try {
      await sendMessage(userId, message);
    } catch (error) {
      toast.error('Error al enviar mensaje');
    }
  };

  const handleAnalyzeCV = async () => {
    if (cvs.length === 0) {
      toast.error('Primero crea un CV para analizarlo');
      navigate('/dashboard/cvs');
      return;
    }

    const latestCV = cvs[cvs.length - 1];
    const cvText = `
      ${latestCV.personal.fullName}
      ${latestCV.summary}
      ${latestCV.experience.map(exp => `${exp.role} en ${exp.company}: ${exp.bullets.map(b => b.text).join('. ')}`).join('\n')}
      ${latestCV.education.map(edu => `${edu.degree} en ${edu.institution}`).join('\n')}
      ${latestCV.skills.map(s => s.name).join(', ')}
    `;

    try {
      await analyzeCV(userId, latestCV.id, cvText);
      setSelectedTab('analysis');
      toast.success('Análisis completado');
    } catch (error) {
      toast.error('Error al analizar CV');
    }
  };

  const handleGenerateCourses = async () => {
    try {
      await generateCourseRecommendations(userId, ['SQL', 'Python', 'Comunicación']);
      setSelectedTab('courses');
      toast.success('Cursos recomendados generados');
    } catch (error) {
      toast.error('Error al generar recomendaciones');
    }
  };

  return (
    <Card className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <Bot className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-foreground">Career Coach</h3>
            <p className="text-xs text-muted-foreground">Tu copiloto profesional con IA</p>
          </div>
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="bg-muted/50 rounded-lg p-2">
            <div className="text-lg font-bold text-foreground">{completionRate}%</div>
            <div className="text-xs text-muted-foreground">Progreso</div>
          </div>
          <div className="bg-muted/50 rounded-lg p-2">
            <div className="text-lg font-bold text-foreground">{weekActions.length}</div>
            <div className="text-xs text-muted-foreground">Acciones</div>
          </div>
          <div className="bg-muted/50 rounded-lg p-2">
            <div className="text-lg font-bold text-foreground">{cvs.length}</div>
            <div className="text-xs text-muted-foreground">CVs</div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex gap-2 mt-3">
          <Button 
            size="sm" 
            variant="outline" 
            onClick={handleAnalyzeCV}
            disabled={isProcessing}
          >
            <BarChart3 className="w-3 h-3 mr-1" />
            Analizar CV
          </Button>
          <Button 
            size="sm" 
            variant="outline" 
            onClick={handleGenerateCourses}
            disabled={isProcessing}
          >
            <BookOpen className="w-3 h-3 mr-1" />
            Ver Cursos
          </Button>
        </div>
      </div>

      {/* Content Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="flex-1 flex flex-col">
        <TabsList className="mx-4 mt-2">
          <TabsTrigger value="chat">Chat</TabsTrigger>
          <TabsTrigger value="analysis">Análisis</TabsTrigger>
          <TabsTrigger value="courses">Cursos</TabsTrigger>
        </TabsList>

        <TabsContent value="chat" className="flex-1 flex flex-col mt-0">
          <ScrollArea className="flex-1 p-4" ref={scrollRef}>
            <div className="space-y-4">
              {userMessages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-[85%] rounded-lg p-3 ${
                      message.role === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  </div>
                </div>
              ))}

              {isProcessing && (
                <div className="flex justify-start">
                  <div className="bg-muted rounded-lg p-3">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" />
                      <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: '0.2s' }} />
                      <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: '0.4s' }} />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="analysis" className="flex-1 overflow-auto mt-0">
          <div className="p-4 space-y-4">
            {currentAnalysis ? (
              <>
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold">Análisis de CV</h4>
                  <Badge variant={currentAnalysis.score >= 80 ? 'default' : currentAnalysis.score >= 60 ? 'secondary' : 'destructive'}>
                    {currentAnalysis.score}/100
                  </Badge>
                </div>

                <div className="space-y-3">
                  <div>
                    <h5 className="text-sm font-medium mb-2">Keywords</h5>
                    <div className="flex flex-wrap gap-2">
                      {currentAnalysis.keywords.map((kw, i) => (
                        <Badge key={i} variant={kw.present ? 'default' : 'outline'}>
                          {kw.present ? <CheckCircle2 className="w-3 h-3 mr-1" /> : <AlertCircle className="w-3 h-3 mr-1" />}
                          {kw.word}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h5 className="text-sm font-medium mb-2">Sugerencias</h5>
                    <div className="space-y-2">
                      {currentAnalysis.suggestions.map((sug) => (
                        <Card key={sug.id} className="p-3">
                          <div className="flex items-start gap-2">
                            <Badge variant={sug.priority === 'high' ? 'destructive' : sug.priority === 'medium' ? 'secondary' : 'outline'} className="mt-0.5">
                              {sug.priority}
                            </Badge>
                            <div className="flex-1">
                              <p className="text-sm font-medium">{sug.text}</p>
                              {sug.example && (
                                <p className="text-xs text-muted-foreground mt-1">{sug.example}</p>
                              )}
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>

                  <Button onClick={() => navigate('/dashboard/cvs')} className="w-full">
                    <FileText className="w-4 h-4 mr-2" />
                    Editar mi CV
                  </Button>
                </div>
              </>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <BarChart3 className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p className="text-sm">Analiza tu CV para ver sugerencias detalladas</p>
                <Button onClick={handleAnalyzeCV} className="mt-4" disabled={isProcessing}>
                  {isProcessing && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  Analizar ahora
                </Button>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="courses" className="flex-1 overflow-auto mt-0">
          <div className="p-4 space-y-3">
            {courseRecommendations.length > 0 ? (
              <>
                <h4 className="font-semibold mb-3">Cursos Recomendados</h4>
                {courseRecommendations.map((course) => (
                  <Card key={course.id} className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h5 className="font-medium">{course.title}</h5>
                      <Badge variant={course.priority === 'high' ? 'default' : 'secondary'}>
                        {course.priority}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">{course.provider} • {course.duration}</p>
                    <p className="text-sm mb-3">{course.reason}</p>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {course.skillsCovered.map((skill, i) => (
                        <Badge key={i} variant="outline" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                    <Button size="sm" className="w-full" asChild>
                      <a href={course.url} target="_blank" rel="noopener noreferrer">
                        Ver curso
                      </a>
                    </Button>
                  </Card>
                ))}
              </>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p className="text-sm">Genera recomendaciones de cursos personalizados</p>
                <Button onClick={handleGenerateCourses} className="mt-4" disabled={isProcessing}>
                  {isProcessing && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  Generar recomendaciones
                </Button>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Input */}
      <div className="p-4 border-t">
        <div className="flex gap-2">
          <Input
            placeholder="Pregúntame cualquier cosa sobre tu carrera..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            disabled={isProcessing}
          />
          <Button
            onClick={handleSend}
            disabled={!input.trim() || isProcessing}
            size="icon"
          >
            {isProcessing ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
          <Sparkles className="w-3 h-3" />
          Impulsado por IA • Optimiza CV, practica entrevistas y más
        </p>
      </div>
    </Card>
  );
}
