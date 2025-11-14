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
      <Card className="p-6 space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Progreso</span>
          <span className="font-medium">{answeredCount} / {totalQuestions} preguntas</span>
        </div>
        <Progress value={progress} />
      </Card>

      {/* Question */}
      <Card className="p-8 space-y-6">
        <div className="space-y-3">
          <div className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
            Pregunta {answeredCount + 1}
          </div>
          <h2 className="text-2xl font-semibold leading-relaxed">
            {currentQuestion?.text}
          </h2>
          {currentQuestion?.sampleAnswer && (
            <details className="text-sm text-muted-foreground">
              <summary className="cursor-pointer hover:text-foreground">Ver ejemplo de respuesta</summary>
              <p className="mt-2 pl-4 border-l-2 border-border">{currentQuestion.sampleAnswer}</p>
            </details>
          )}
        </div>

        <div className="space-y-3">
          <Textarea
            placeholder="Escribe tu respuesta aquí..."
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            rows={8}
            disabled={isAnalyzing}
            className="resize-none"
          />
          <p className="text-sm text-muted-foreground">
            Tip: Usa el método STAR (Situación, Tarea, Acción, Resultado) para respuestas de comportamiento
          </p>
        </div>

        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => {
              if (confirm("¿Seguro que quieres salir? Se perderá tu progreso.")) {
                navigate('/dashboard/interviews');
              }
            }}
            disabled={isAnalyzing}
          >
            Salir
          </Button>
          <Button onClick={handleSubmit} disabled={isAnalyzing || !answer.trim()} className="flex-1">
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
        <Card className="p-6 space-y-4">
          <h3 className="font-semibold">Última retroalimentación</h3>
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              {currentSession.responses[currentSession.responses.length - 1].feedbackText}
            </p>
            
            {/* Mostrar puntuación detallada */}
            {currentSession.responses[currentSession.responses.length - 1].scores && (
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3 pt-3 border-t">
                {Object.entries(currentSession.responses[currentSession.responses.length - 1].scores).map(([key, value]) => (
                  <div key={key} className="text-center">
                    <p className="text-xs text-muted-foreground capitalize">{key}</p>
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
