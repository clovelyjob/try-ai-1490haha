import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, Send, Loader2, X } from 'lucide-react';
import { useInterviewStore } from '@/store/useInterviewStore';
import { useProgressStore } from '@/store/useProgressStore';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import Confetti from 'react-confetti';

export default function InterviewSession() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const currentSession = useInterviewStore((state) => state.currentSession);
  const currentQuestionIndex = useInterviewStore((state) => state.currentQuestionIndex);
  const questionBank = useInterviewStore((state) => state.questionBank);
  const isAnalyzing = useInterviewStore((state) => state.isAnalyzing);
  const getNextQuestion = useInterviewStore((state) => state.getNextQuestion);
  const submitResponse = useInterviewStore((state) => state.submitResponse);
  const endSession = useInterviewStore((state) => state.endSession);
  const saveSession = useInterviewStore((state) => state.saveSession);
  const addXP = useProgressStore((state) => state.addXP);
  
  const [answer, setAnswer] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [currentFeedback, setCurrentFeedback] = useState<{
    scores: any;
    feedbackText: string;
  } | null>(null);

  useEffect(() => {
    if (!currentSession) {
      navigate('/dashboard/interviews/setup');
    }
  }, [currentSession, navigate]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentSession?.responses, currentFeedback]);

  if (!currentSession) return null;

  const currentQuestion = getNextQuestion();
  const progress = (currentQuestionIndex / questionBank.length) * 100;
  const isComplete = currentQuestionIndex >= questionBank.length;

  const handleSubmitAnswer = async () => {
    if (!answer.trim()) {
      toast({
        title: 'Error',
        description: 'Por favor escribe una respuesta',
        variant: 'destructive',
      });
      return;
    }

    await submitResponse(answer);
    
    // Show feedback for the last response
    const lastResponse = currentSession.responses[currentSession.responses.length - 1];
    if (lastResponse) {
      setCurrentFeedback({
        scores: lastResponse.scores,
        feedbackText: lastResponse.feedbackText,
      });
    }

    setAnswer('');

    // Check if interview is complete
    if (currentQuestionIndex + 1 >= questionBank.length) {
      handleEndInterview();
    }
  };

  const handleEndInterview = () => {
    endSession();
    const xpEarned = Math.floor(currentSession.responses.length * 15);
    addXP(xpEarned);
    setShowResults(true);
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 5000);
  };

  const handleSaveAndExit = () => {
    saveSession();
    toast({
      title: 'Sesión guardada',
      description: 'Puedes revisar tu práctica en el historial',
    });
    navigate('/dashboard/interviews/history');
  };

  const getTotalScore = (scores: any) => {
    return scores.clarity + scores.structure + scores.evidence + scores.language + scores.culture;
  };

  const getScoreLabel = (score: number) => {
    if (score >= 75) return { label: 'Excelente', color: 'text-green-600' };
    if (score >= 50) return { label: 'Buena', color: 'text-yellow-600' };
    return { label: 'Mejorable', color: 'text-orange-600' };
  };

  return (
    <div className="min-h-screen bg-background">
      {showConfetti && <Confetti recycle={false} numberOfPieces={500} />}
      
      <div className="container max-w-5xl mx-auto px-4 py-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              if (confirm('¿Seguro que quieres salir? Se perderá tu progreso.')) {
                navigate('/dashboard/interviews');
              }
            }}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Salir
          </Button>
          <div className="text-sm text-muted-foreground">
            Pregunta {Math.min(currentQuestionIndex + 1, questionBank.length)} de {questionBank.length}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <Progress value={progress} className="h-2" />
        </div>

        {/* Messages Container */}
        <div className="space-y-4 mb-6 max-h-[60vh] overflow-y-auto">
          {/* Welcome Message */}
          {currentSession.responses.length === 0 && (
            <div className="flex justify-start">
              <Card className="p-4 max-w-md bg-muted">
                <p className="text-sm">
                  Hola, soy tu coach de entrevistas. ¿Listo para practicar? Vamos a simular una entrevista para <strong>{currentSession.role}</strong> nivel <strong>{currentSession.level}</strong>. Tómate tu tiempo para responder cada pregunta.
                </p>
              </Card>
            </div>
          )}

          {/* Previous Q&A */}
          {currentSession.responses.map((response, index) => (
            <div key={response.id} className="space-y-3">
              {/* Question */}
              <div className="flex justify-start">
                <Card className="p-4 max-w-md bg-muted">
                  <p className="text-sm font-medium">{response.questionText}</p>
                </Card>
              </div>
              
              {/* Answer */}
              <div className="flex justify-end">
                <Card className="p-4 max-w-md bg-primary text-primary-foreground">
                  <p className="text-sm">{response.answerText}</p>
                </Card>
              </div>

              {/* Feedback */}
              <div className="flex justify-start">
                <Card className="p-4 max-w-lg border-2 border-primary/20">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold">Evaluación</span>
                      <span className={`text-lg font-bold ${getScoreLabel(getTotalScore(response.scores)).color}`}>
                        {getTotalScore(response.scores)}/100
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <div className="text-muted-foreground">Claridad</div>
                        <div className="font-semibold">{response.scores.clarity}/20</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Estructura</div>
                        <div className="font-semibold">{response.scores.structure}/30</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Evidencia</div>
                        <div className="font-semibold">{response.scores.evidence}/25</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Lenguaje</div>
                        <div className="font-semibold">{response.scores.language}/15</div>
                      </div>
                    </div>

                    <p className="text-sm text-muted-foreground border-t pt-2">
                      {response.feedbackText}
                    </p>
                  </div>
                </Card>
              </div>
            </div>
          ))}

          {/* Current Question */}
          {!isComplete && currentQuestion && !isAnalyzing && (
            <div className="flex justify-start animate-fade-in">
              <Card className="p-4 max-w-md bg-muted">
                <p className="text-sm font-medium">{currentQuestion.text}</p>
              </Card>
            </div>
          )}

          {isAnalyzing && (
            <div className="flex justify-start">
              <Card className="p-4 bg-muted">
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm text-muted-foreground">
                    Analizando tu respuesta...
                  </span>
                </div>
              </Card>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        {!isComplete && (
          <Card className="p-4 sticky bottom-4">
            <div className="flex gap-3">
              <Textarea
                placeholder="Escribe tu respuesta aquí..."
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey && !isAnalyzing) {
                    e.preventDefault();
                    handleSubmitAnswer();
                  }
                }}
                disabled={isAnalyzing}
                rows={3}
                className="flex-1"
              />
              <Button
                onClick={handleSubmitAnswer}
                disabled={isAnalyzing || !answer.trim()}
                size="lg"
              >
                {isAnalyzing ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Send className="w-5 h-5" />
                )}
              </Button>
            </div>
          </Card>
        )}
      </div>

      {/* Results Dialog */}
      <Dialog open={showResults} onOpenChange={setShowResults}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">¡Práctica completada!</DialogTitle>
            <DialogDescription>
              Aquí está tu evaluación final
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Final Score */}
            <Card className="p-6 text-center bg-primary/5">
              <div className="text-sm text-muted-foreground mb-2">
                Puntuación final
              </div>
              <div className="text-5xl font-bold text-primary mb-2">
                {currentSession.finalScore}
              </div>
              <div className="text-sm font-medium">
                {currentSession.finalScore >= 75 && '¡Listo para brillar! 🌟'}
                {currentSession.finalScore >= 50 && currentSession.finalScore < 75 && 'Buen desempeño 👍'}
                {currentSession.finalScore < 50 && 'Sigue practicando 💪'}
              </div>
            </Card>

            {/* Breakdown */}
            <div>
              <h3 className="font-semibold mb-3">Desglose por criterios</h3>
              <div className="grid grid-cols-2 gap-4">
                <Card className="p-4">
                  <div className="text-sm text-muted-foreground mb-1">Claridad</div>
                  <div className="text-2xl font-bold">{currentSession.breakdown.clarity}/20</div>
                </Card>
                <Card className="p-4">
                  <div className="text-sm text-muted-foreground mb-1">Estructura</div>
                  <div className="text-2xl font-bold">{currentSession.breakdown.structure}/30</div>
                </Card>
                <Card className="p-4">
                  <div className="text-sm text-muted-foreground mb-1">Evidencia</div>
                  <div className="text-2xl font-bold">{currentSession.breakdown.evidence}/25</div>
                </Card>
                <Card className="p-4">
                  <div className="text-sm text-muted-foreground mb-1">Lenguaje</div>
                  <div className="text-2xl font-bold">{currentSession.breakdown.language}/15</div>
                </Card>
              </div>
            </div>

            {/* Recommendations */}
            {currentSession.recommendations.length > 0 && (
              <div>
                <h3 className="font-semibold mb-3">Recomendaciones</h3>
                <div className="space-y-2">
                  {currentSession.recommendations.map((rec, index) => (
                    <Card key={index} className="p-3">
                      <p className="text-sm">{rec.text}</p>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <Button
                className="flex-1"
                onClick={handleSaveAndExit}
              >
                Guardar y salir
              </Button>
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => navigate('/dashboard/interviews/setup')}
              >
                Repetir práctica
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
