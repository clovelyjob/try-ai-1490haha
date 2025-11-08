import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Calendar, TrendingUp, Trash2, Eye } from 'lucide-react';
import { useInterviewStore } from '@/store/useInterviewStore';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import type { InterviewSession } from '@/types';

export default function InterviewHistory() {
  const navigate = useNavigate();
  const sessions = useInterviewStore((state) => state.sessions);
  const deleteSession = useInterviewStore((state) => state.deleteSession);
  
  const [sessionToDelete, setSessionToDelete] = useState<string | null>(null);
  const [selectedSession, setSelectedSession] = useState<InterviewSession | null>(null);

  const getScoreColor = (score: number) => {
    if (score >= 75) return 'text-green-600 bg-green-50';
    if (score >= 50) return 'text-yellow-600 bg-yellow-50';
    return 'text-orange-600 bg-orange-50';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 75) return 'Excelente';
    if (score >= 50) return 'Buena';
    return 'Mejorable';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const handleDelete = (id: string) => {
    deleteSession(id);
    setSessionToDelete(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-5xl mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate('/dashboard/interviews')}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver
        </Button>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Historial de prácticas
          </h1>
          <p className="text-muted-foreground">
            Revisa tus sesiones anteriores y tu progreso
          </p>
        </div>

        {sessions.length === 0 ? (
          <Card className="p-12 text-center">
            <div className="max-w-md mx-auto">
              <TrendingUp className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Sin prácticas aún
              </h3>
              <p className="text-sm text-muted-foreground mb-6">
                Comienza tu primera sesión de práctica para ver tu progreso aquí
              </p>
              <Button onClick={() => navigate('/dashboard/interviews/setup')}>
                Iniciar primera práctica
              </Button>
            </div>
          </Card>
        ) : (
          <div className="space-y-4">
            {sessions
              .sort((a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime())
              .map((session) => (
                <Card key={session.id} className="p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-foreground">
                          {session.role}
                        </h3>
                        <Badge variant="outline">{session.level}</Badge>
                        <Badge variant="secondary">{session.interviewType}</Badge>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {formatDate(session.startedAt)}
                        </div>
                        <div>
                          {session.responses.length} preguntas respondidas
                        </div>
                      </div>

                      <div className="flex items-center gap-6">
                        <div>
                          <div className="text-sm text-muted-foreground mb-1">
                            Puntuación final
                          </div>
                          <div className={`text-2xl font-bold ${getScoreColor(session.finalScore)}`}>
                            {session.finalScore}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          {session.breakdown.clarity > 0 && (
                            <div className="text-center">
                              <div className="text-xs text-muted-foreground">Claridad</div>
                              <div className="text-sm font-semibold">{session.breakdown.clarity}/20</div>
                            </div>
                          )}
                          {session.breakdown.structure > 0 && (
                            <div className="text-center">
                              <div className="text-xs text-muted-foreground">Estructura</div>
                              <div className="text-sm font-semibold">{session.breakdown.structure}/30</div>
                            </div>
                          )}
                          {session.breakdown.evidence > 0 && (
                            <div className="text-center">
                              <div className="text-xs text-muted-foreground">Evidencia</div>
                              <div className="text-sm font-semibold">{session.breakdown.evidence}/25</div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedSession(session)}
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        Ver detalles
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSessionToDelete(session.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation */}
      <AlertDialog open={!!sessionToDelete} onOpenChange={() => setSessionToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar esta sesión?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. La sesión será eliminada permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => sessionToDelete && handleDelete(sessionToDelete)}
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Session Detail Dialog */}
      <Dialog open={!!selectedSession} onOpenChange={() => setSelectedSession(null)}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detalles de la sesión</DialogTitle>
          </DialogHeader>

          {selectedSession && (
            <div className="space-y-6 py-4">
              {/* Session Info */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">{selectedSession.role}</h3>
                  <p className="text-sm text-muted-foreground">
                    {formatDate(selectedSession.startedAt)}
                  </p>
                </div>
                <div className={`text-3xl font-bold ${getScoreColor(selectedSession.finalScore)}`}>
                  {selectedSession.finalScore}
                </div>
              </div>

              {/* Responses */}
              <div className="space-y-4">
                <h4 className="font-semibold">Preguntas y respuestas</h4>
                {selectedSession.responses.map((response, index) => (
                  <Card key={response.id} className="p-4">
                    <div className="space-y-3">
                      <div>
                        <div className="text-xs text-muted-foreground mb-1">
                          Pregunta {index + 1}
                        </div>
                        <p className="text-sm font-medium">{response.questionText}</p>
                      </div>
                      
                      <div>
                        <div className="text-xs text-muted-foreground mb-1">
                          Tu respuesta
                        </div>
                        <p className="text-sm">{response.answerText}</p>
                      </div>

                      <div className="pt-2 border-t">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-semibold">Evaluación</span>
                          <span className="text-sm font-bold">
                            {response.scores.clarity + response.scores.structure + response.scores.evidence + response.scores.language + response.scores.culture}/100
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {response.feedbackText}
                        </p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              {/* Recommendations */}
              {selectedSession.recommendations.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-3">Recomendaciones</h4>
                  <div className="space-y-2">
                    {selectedSession.recommendations.map((rec, index) => (
                      <Card key={index} className="p-3">
                        <p className="text-sm">{rec.text}</p>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
