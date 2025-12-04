import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "react-router-dom";
import { useInterviewStore } from "@/store/useInterviewStore";
import { useAuthStore } from "@/store/useAuthStore";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Briefcase } from "lucide-react";
import { ResponseModeSelector, type ResponseMode } from "@/components/interview/ResponseModeSelector";
import type { InterviewLevel } from "@/types";

export default function InterviewSetup() {
  const navigate = useNavigate();
  const { startSession, seedQuestions } = useInterviewStore();
  const { user } = useAuthStore();
  const { toast } = useToast();
  
  const [role, setRole] = useState("");
  const [level, setLevel] = useState<InterviewLevel>("junior");
  const [jobDescription, setJobDescription] = useState("");
  const [responseMode, setResponseMode] = useState<ResponseMode>("text");
  const [isGenerating, setIsGenerating] = useState(false);

  const handleStart = async () => {
    if (!role || !user) return;
    
    setIsGenerating(true);
    
    try {
      // Generar preguntas con IA basadas en el rol, nivel y descripción
      await seedQuestions(role, level, jobDescription || undefined);
      
      // Store response mode in localStorage
      localStorage.setItem('clovely_interview_response_mode', responseMode);
      
      startSession({
        userId: user.id,
        role,
        level,
        jobDescription: jobDescription || undefined,
      });
      
      navigate('/dashboard/interviews/session');
    } catch (error) {
      console.error('Error starting interview:', error);
      toast({
        title: "Error",
        description: "No se pudieron generar las preguntas. Intenta de nuevo.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="container max-w-2xl py-8">
      <Card className="p-6 sm:p-8 space-y-6 rounded-2xl shadow-clovely-lg border-2">
        <div className="space-y-2 text-center">
          <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Briefcase className="w-7 h-7 text-primary" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold">
            Práctica de Entrevista con IA
          </h1>
          <p className="text-muted-foreground">
            Simula una entrevista real y recibe feedback para mejorar
          </p>
        </div>

        <div className="space-y-5">
          {/* Puesto o Rol */}
          <div className="space-y-2">
            <Label htmlFor="role">Tu Puesto *</Label>
            <Input
              id="role"
              placeholder="Ej: Marketing Digital, Product Manager, Desarrollador Frontend"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="min-h-[48px] rounded-xl"
            />
          </div>

          {/* Nivel de Experiencia */}
          <div className="space-y-2">
            <Label htmlFor="level">Nivel de Experiencia</Label>
            <Select value={level} onValueChange={(v) => setLevel(v as InterviewLevel)}>
              <SelectTrigger id="level" className="min-h-[48px] rounded-xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="junior">Poca/Ninguna experiencia (0-2 años)</SelectItem>
                <SelectItem value="mid">Algo de experiencia (3-5 años)</SelectItem>
                <SelectItem value="senior">Mucha experiencia (6+ años)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Descripción del Puesto */}
          <div className="space-y-2">
            <Label htmlFor="jobDescription">Descripción del Puesto (Opcional)</Label>
            <Textarea
              id="jobDescription"
              placeholder="Pega la descripción del trabajo aquí para personalizar las preguntas..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              rows={5}
              className="min-h-[120px] rounded-xl resize-none"
            />
            <p className="text-xs text-muted-foreground">
              Incluir la descripción del puesto genera preguntas más relevantes y específicas
            </p>
          </div>

          {/* Modo de Respuesta */}
          <ResponseModeSelector value={responseMode} onChange={setResponseMode} />
        </div>

        <Button 
          onClick={handleStart} 
          disabled={!role || isGenerating} 
          size="lg"
          className="w-full min-h-[52px] text-base font-semibold rounded-xl"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Generando Preguntas de Entrevista...
            </>
          ) : (
            'Generar Preguntas de Entrevista'
          )}
        </Button>

        <p className="text-xs text-center text-muted-foreground">
          Se generarán 10 preguntas personalizadas basadas en tu perfil
        </p>
      </Card>
    </div>
  );
}
