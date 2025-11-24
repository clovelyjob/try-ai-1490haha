import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Loader2, ChevronRight, CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useInterviewStore } from "@/store/useInterviewStore";
import { useToast } from "@/hooks/use-toast";

export default function InterviewSession() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { currentSession, getNextQuestion, submitResponse, isAnalyzing, endSession } = useInterviewStore();
  
  const [answer, setAnswer] = useState("");
  const [currentQuestion, setCurrentQuestion] = useState(getNextQuestion());

  useEffect(() => {
    if (!currentSession) {
      navigate('/dashboard/interviews');
      return;
    }
  }, [currentSession, navigate]);

  if (!currentSession) return null;

  const totalQuestions = 7;
  const answeredCount = currentSession.responses.length;
  const progress = (answeredCount / totalQuestions) * 100;

  const handleSubmit = async () => {
    if (!answer.trim()) {
      toast({
        title: "Respuesta vacía",
        description: "Por favor escribe una respuesta antes de continuar",
        variant: "destructive",
      });
      return;
    }

    await submitResponse(answer);
    setAnswer("");
    
    const nextQ = getNextQuestion();
    if (nextQ) {
      setCurrentQuestion(nextQ);
    } else {
      endSession();
      navigate('/dashboard/interviews/results');
    }
  };

  return (
    <div className="container max-w-4xl py-8 space-y-6">
      {/* Progress */}
      <Card className="p-6 space-y-3 rounded-2xl shadow-clovely-lg border-2 border-primary/10">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Progreso</span>
          <span className="font-medium">{answeredCount} / {totalQuestions} preguntas</span>
        </div>
        <Progress value={progress} className="h-4 sm:h-5 [&>div]:bg-gradient-to-r [&>div]:from-primary [&>div]:to-primary-warm" />
      </Card>

      {/* Question */}
      <Card className="p-8 space-y-6 rounded-xl bg-gradient-to-br from-card to-primary/[0.02] shadow-clovely-md border-2">
        <div className="space-y-3">
          <div className="inline-block px-4 py-2 rounded-full bg-gradient-to-r from-primary/10 to-primary-warm/10 border-2 border-primary/20 text-primary text-sm font-medium">
            Pregunta {answeredCount + 1}
          </div>
          <h2 className="text-2xl font-semibold leading-relaxed">
            {currentQuestion?.text}
          </h2>
          {currentQuestion?.sampleAnswer && (
            <details className="text-sm text-muted-foreground">
              <summary className="cursor-pointer hover:text-foreground transition-colors">Ver ejemplo de respuesta</summary>
              <p className="mt-2 pl-4 border-l-2 border-primary/30 bg-muted/50 p-3 rounded-r-lg">{currentQuestion.sampleAnswer}</p>
            </details>
          )}
        </div>

        <div className="space-y-3">
          <Textarea
            placeholder="Escribe tu respuesta aquí..."
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            rows={10}
            disabled={isAnalyzing}
            className="resize-none min-h-[240px] sm:min-h-[200px] rounded-xl shadow-clovely-sm focus-visible:shadow-clovely-md focus-visible:ring-primary/20 transition-all duration-300"
          />
          <p className="text-sm text-muted-foreground bg-blue-50/50 dark:bg-blue-950/20 p-3 rounded-lg border border-blue-200/50 dark:border-blue-800/50">
            💡 Tip: Usa el método STAR (Situación, Tarea, Acción, Resultado) para respuestas de comportamiento
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            variant="outline"
            onClick={() => {
              if (confirm("¿Seguro que quieres salir? Se perderá tu progreso.")) {
                navigate('/dashboard/interviews');
              }
            }}
            disabled={isAnalyzing}
            className="min-h-[44px] w-full sm:w-auto shadow-clovely-sm"
          >
            Salir
          </Button>
          <Button onClick={handleSubmit} disabled={isAnalyzing || !answer.trim()} variant="premium" className="min-h-[44px] flex-1 shadow-clovely-glow">
            {isAnalyzing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Analizando...
              </>
            ) : answeredCount === totalQuestions - 1 ? (
              <>
                Finalizar <CheckCircle2 className="w-4 h-4 ml-2" />
              </>
            ) : (
              <>
                Siguiente <ChevronRight className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        </div>
      </Card>

      {/* Recent feedback */}
      {currentSession.responses.length > 0 && (
        <Card className="p-6 space-y-4 rounded-xl border-2 shadow-clovely-md">
          <h3 className="font-semibold flex items-center gap-2">
            <div className="p-2 rounded-lg bg-gradient-to-br from-green-500/10 to-emerald-500/10">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
            </div>
            Última retroalimentación
          </h3>
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground p-4 rounded-lg bg-muted/50">
              {currentSession.responses[currentSession.responses.length - 1].feedbackText}
            </p>
            
            {/* Mostrar puntuación detallada */}
            {currentSession.responses[currentSession.responses.length - 1].scores && (
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3 pt-3 border-t">
                {Object.entries(currentSession.responses[currentSession.responses.length - 1].scores).map(([key, value]) => (
                  <div key={key} className="text-center p-3 rounded-xl bg-gradient-to-br from-primary/5 to-primary-warm/5 border border-primary/10">
                    <p className="text-xs text-muted-foreground capitalize mb-1">{key}</p>
                    <p className="text-lg font-semibold text-primary">{value}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Card>
      )}
    </div>
  );
}
