import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Mic, MicOff, Play, Save, RotateCcw, Sparkles, MessageSquare, CheckCircle, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

interface Question {
  id: string;
  text: string;
  category: 'behavioral' | 'technical' | 'situational';
}

interface Answer {
  questionId: string;
  text: string;
  score: number;
  feedback: string;
  strengths: string[];
  improvements: string[];
}

export function CoachInterviewSimulator() {
  const [sessionActive, setSessionActive] = useState(false);
  const [selectedRole, setSelectedRole] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [sessionComplete, setSessionComplete] = useState(false);

  const mockQuestions: Question[] = [
    {
      id: 'q1',
      text: 'Cuéntame sobre ti y tu experiencia profesional.',
      category: 'behavioral',
    },
    {
      id: 'q2',
      text: '¿Por qué estás interesado/a en esta posición?',
      category: 'behavioral',
    },
    {
      id: 'q3',
      text: 'Describe una situación donde tuviste que resolver un problema complejo. ¿Cómo lo abordaste?',
      category: 'situational',
    },
    {
      id: 'q4',
      text: '¿Cuáles son tus principales fortalezas técnicas?',
      category: 'technical',
    },
    {
      id: 'q5',
      text: '¿Dónde te ves en 3-5 años?',
      category: 'behavioral',
    },
  ];

  const currentQuestion = mockQuestions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / mockQuestions.length) * 100;

  const mockAnalyzeAnswer = async (question: string, answer: string): Promise<Answer> => {
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const hasSTAR = /situación|tarea|acción|resultado/i.test(answer.toLowerCase());
    const hasMetrics = /\d+%|\d+\s*(años|meses|proyectos|personas)/i.test(answer);
    const wordCount = answer.split(/\s+/).length;

    let score = 50;
    const strengths: string[] = [];
    const improvements: string[] = [];

    if (hasSTAR) {
      score += 20;
      strengths.push('Estructura STAR presente');
    } else {
      improvements.push('Considera usar la estructura STAR (Situación, Tarea, Acción, Resultado)');
    }

    if (hasMetrics) {
      score += 15;
      strengths.push('Incluye métricas cuantificables');
    } else {
      improvements.push('Añade números y métricas concretas');
    }

    if (wordCount >= 80 && wordCount <= 200) {
      score += 15;
      strengths.push('Longitud de respuesta apropiada');
    } else if (wordCount < 80) {
      improvements.push('Amplía tu respuesta con más detalles');
    } else {
      improvements.push('Intenta ser más conciso');
    }

    return {
      questionId: currentQuestion.id,
      text: answer,
      score: Math.min(100, score),
      feedback: score >= 80
        ? '¡Excelente respuesta! Muy bien estructurada y completa.'
        : score >= 60
        ? 'Buena respuesta, con algunas áreas de mejora.'
        : 'Tu respuesta puede mejorar significativamente.',
      strengths,
      improvements,
    };
  };

  const handleStartSession = () => {
    if (!selectedRole || !selectedLevel) {
      toast.error('Por favor selecciona un rol y nivel');
      return;
    }
    setSessionActive(true);
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setSessionComplete(false);
    toast.success('Entrevista iniciada', {
      description: 'Responde cada pregunta con calma y estructura',
    });
  };

  const handleSubmitAnswer = async () => {
    if (!currentAnswer.trim()) {
      toast.error('Por favor escribe una respuesta');
      return;
    }

    setIsAnalyzing(true);
    try {
      const analysis = await mockAnalyzeAnswer(currentQuestion.text, currentAnswer);
      setAnswers([...answers, analysis]);
      
      toast.success('Respuesta analizada', {
        description: `Score: ${analysis.score}/100`,
      });

      setCurrentAnswer('');
      
      if (currentQuestionIndex < mockQuestions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else {
        setSessionComplete(true);
      }
    } catch (error) {
      toast.error('Error al analizar respuesta');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSaveSession = () => {
    const avgScore = answers.reduce((acc, a) => acc + a.score, 0) / answers.length;
    toast.success('Sesión guardada', {
      description: `Score promedio: ${Math.round(avgScore)}/100`,
    });
    setSessionActive(false);
    setSessionComplete(false);
  };

  const handleRestartSession = () => {
    setCurrentQuestionIndex(0);
    setCurrentAnswer('');
    setAnswers([]);
    setSessionComplete(false);
  };

  if (!sessionActive) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mic className="h-5 w-5" />
            Simulador de Entrevistas
          </CardTitle>
          <CardDescription>
            Practica entrevistas con IA y recibe feedback inmediato por cada respuesta
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Puesto objetivo</label>
              <Select value={selectedRole} onValueChange={setSelectedRole}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un puesto" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="frontend">Frontend Developer</SelectItem>
                  <SelectItem value="backend">Backend Developer</SelectItem>
                  <SelectItem value="fullstack">Fullstack Developer</SelectItem>
                  <SelectItem value="designer">UX/UI Designer</SelectItem>
                  <SelectItem value="product">Product Manager</SelectItem>
                  <SelectItem value="data">Data Analyst</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Nivel de dificultad</label>
              <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un nivel" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="junior">Junior / Principiante</SelectItem>
                  <SelectItem value="mid">Intermedio</SelectItem>
                  <SelectItem value="senior">Senior / Avanzado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button onClick={handleStartSession} size="lg" className="w-full">
              <Play className="mr-2 h-4 w-4" />
              Iniciar Entrevista
            </Button>
          </div>

          <div className="border-t pt-4">
            <h4 className="font-medium mb-3">¿Qué incluye la simulación?</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-primary mt-0.5" />
                <span>5 preguntas adaptadas al rol y nivel seleccionado</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-primary mt-0.5" />
                <span>Feedback inmediato con score por cada respuesta</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-primary mt-0.5" />
                <span>Análisis de estructura STAR y métricas</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-primary mt-0.5" />
                <span>Recomendaciones personalizadas de mejora</span>
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (sessionComplete) {
    const avgScore = answers.reduce((acc, a) => acc + a.score, 0) / answers.length;
    
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Entrevista Completada
          </CardTitle>
          <CardDescription>Score promedio: {Math.round(avgScore)}/100</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center py-4">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-4xl">
                {avgScore >= 80 ? '🎉' : avgScore >= 60 ? '👍' : '💪'}
              </span>
            </div>
            <h3 className="text-xl font-bold mb-2">
              {avgScore >= 80 ? '¡Excelente!' : avgScore >= 60 ? '¡Buen trabajo!' : '¡Sigue practicando!'}
            </h3>
            <p className="text-sm text-muted-foreground">
              {avgScore >= 80
                ? 'Tus respuestas fueron muy sólidas y bien estructuradas'
                : avgScore >= 60
                ? 'Vas por buen camino, con algunas áreas de mejora'
                : 'Continúa practicando para mejorar tus respuestas'}
            </p>
          </div>

          <div className="space-y-3">
            {answers.map((answer, index) => (
              <Card key={answer.questionId} className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium text-sm">Pregunta {index + 1}</h4>
                  <Badge variant={answer.score >= 80 ? 'default' : answer.score >= 60 ? 'secondary' : 'destructive'}>
                    {answer.score}/100
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mb-3">{mockQuestions[index].text}</p>
                
                {answer.strengths.length > 0 && (
                  <div className="mb-2">
                    <p className="text-xs font-medium text-green-600 dark:text-green-400 mb-1">Fortalezas:</p>
                    <ul className="text-xs space-y-1">
                      {answer.strengths.map((s, i) => (
                        <li key={i} className="flex items-start gap-1">
                          <CheckCircle className="h-3 w-3 text-green-600 dark:text-green-400 mt-0.5" />
                          <span>{s}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {answer.improvements.length > 0 && (
                  <div>
                    <p className="text-xs font-medium text-orange-600 dark:text-orange-400 mb-1">Mejoras sugeridas:</p>
                    <ul className="text-xs space-y-1">
                      {answer.improvements.map((i, idx) => (
                        <li key={idx} className="flex items-start gap-1">
                          <AlertCircle className="h-3 w-3 text-orange-600 dark:text-orange-400 mt-0.5" />
                          <span>{i}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </Card>
            ))}
          </div>

          <div className="flex gap-2">
            <Button onClick={handleRestartSession} variant="outline" className="flex-1">
              <RotateCcw className="mr-2 h-4 w-4" />
              Reintentar
            </Button>
            <Button onClick={handleSaveSession} className="flex-1">
              <Save className="mr-2 h-4 w-4" />
              Guardar Sesión
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Pregunta {currentQuestionIndex + 1} de {mockQuestions.length}
            </CardTitle>
            <CardDescription>
              <Badge variant="outline" className="mt-1">
                {currentQuestion.category}
              </Badge>
            </CardDescription>
          </div>
          <Button variant="ghost" size="sm" onClick={() => setSessionActive(false)}>
            Salir
          </Button>
        </div>
        <Progress value={progress} className="mt-4" />
      </CardHeader>
      <CardContent className="space-y-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestionIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <Card className="p-4 bg-muted/50">
              <p className="font-medium">{currentQuestion.text}</p>
            </Card>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Tu respuesta</label>
                <Button
                  size="sm"
                  variant={isRecording ? 'destructive' : 'outline'}
                  onClick={() => setIsRecording(!isRecording)}
                >
                  {isRecording ? (
                    <>
                      <MicOff className="h-4 w-4 mr-1" />
                      Detener
                    </>
                  ) : (
                    <>
                      <Mic className="h-4 w-4 mr-1" />
                      Grabar
                    </>
                  )}
                </Button>
              </div>
              <Textarea
                placeholder="Escribe tu respuesta aquí... Intenta usar la estructura STAR: Situación, Tarea, Acción, Resultado"
                value={currentAnswer}
                onChange={(e) => setCurrentAnswer(e.target.value)}
                rows={8}
                disabled={isAnalyzing}
              />
              <p className="text-xs text-muted-foreground">
                {currentAnswer.split(/\s+/).filter(Boolean).length} palabras (recomendado: 80-200)
              </p>
            </div>

            <Button
              onClick={handleSubmitAnswer}
              disabled={!currentAnswer.trim() || isAnalyzing}
              className="w-full"
              size="lg"
            >
              {isAnalyzing ? (
                <>
                  <Sparkles className="mr-2 h-4 w-4 animate-spin" />
                  Analizando respuesta...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Analizar Respuesta
                </>
              )}
            </Button>
          </motion.div>
        </AnimatePresence>

        {answers.length > 0 && (
          <div className="border-t pt-4">
            <p className="text-sm font-medium mb-2">Progreso actual:</p>
            <div className="flex gap-2">
              {mockQuestions.map((_, index) => (
                <div
                  key={index}
                  className={`h-2 flex-1 rounded-full ${
                    index < answers.length
                      ? 'bg-primary'
                      : index === currentQuestionIndex
                      ? 'bg-primary/50'
                      : 'bg-muted'
                  }`}
                />
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
