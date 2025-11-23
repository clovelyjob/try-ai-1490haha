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
import { Loader2 } from "lucide-react";
import type { InterviewLevel, InterviewTone, InterviewType } from "@/types";

export default function InterviewSetup() {
  const navigate = useNavigate();
  const { startSession, seedQuestions } = useInterviewStore();
  const { user } = useAuthStore();
  const { toast } = useToast();
  
  const [role, setRole] = useState("");
  const [level, setLevel] = useState<InterviewLevel>("junior");
  const [interviewType, setInterviewType] = useState<InterviewType>("screening");
  const [tone, setTone] = useState<InterviewTone>("empatico");
  const [jobDescription, setJobDescription] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const handleStart = async () => {
    if (!role || !user) return;
    
    setIsGenerating(true);
    
    try {
      // Generar preguntas con IA basadas en el rol y nivel
      await seedQuestions(role, level);
      
      startSession({
        userId: user.id,
        role,
        level,
        interviewType,
        tone,
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
    <div className="container max-w-3xl py-8">
      <Card className="p-8 space-y-6 rounded-2xl shadow-clovely-lg border-2">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary-warm bg-clip-text text-transparent">Configura tu Entrevista</h1>
          <p className="text-muted-foreground">
            Personaliza la práctica según el puesto al que aplicas
          </p>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="role">Puesto o Rol *</Label>
            <Input
              id="role"
              placeholder="Ej: Analista de Datos, Product Manager, Desarrollador Frontend"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="rounded-xl shadow-clovely-sm focus-visible:shadow-clovely-md"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="level">Nivel de Experiencia</Label>
              <Select value={level} onValueChange={(v) => setLevel(v as InterviewLevel)}>
                <SelectTrigger id="level" className="rounded-xl shadow-clovely-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="junior">Junior (0-2 años)</SelectItem>
                  <SelectItem value="mid">Mid (3-5 años)</SelectItem>
                  <SelectItem value="senior">Senior (6+ años)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Tipo de Entrevista</Label>
              <Select value={interviewType} onValueChange={(v) => setInterviewType(v as InterviewType)}>
                <SelectTrigger id="type" className="rounded-xl shadow-clovely-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="screening">Screening Inicial</SelectItem>
                  <SelectItem value="tecnica">Técnica</SelectItem>
                  <SelectItem value="cultural">Fit Cultural</SelectItem>
                  <SelectItem value="caso">Caso de Negocio</SelectItem>
                  <SelectItem value="roleplay">Roleplay</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tone">Tono del Entrevistador</Label>
            <Select value={tone} onValueChange={(v) => setTone(v as InterviewTone)}>
              <SelectTrigger id="tone" className="rounded-xl shadow-clovely-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="empatico">Empático y colaborativo</SelectItem>
                <SelectItem value="directo">Directo y profesional</SelectItem>
                <SelectItem value="exigente">Exigente y desafiante</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="jobDescription">Descripción del Trabajo (Opcional)</Label>
            <Textarea
              id="jobDescription"
              placeholder="Pega aquí la descripción del puesto para personalizar las preguntas..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              rows={4}
              className="rounded-xl shadow-clovely-sm focus-visible:shadow-clovely-md"
            />
          </div>
        </div>

        <div className="flex gap-3">
          <Button 
            variant="outline" 
            onClick={() => navigate('/dashboard/interviews')} 
            className="flex-1 shadow-clovely-sm"
            disabled={isGenerating}
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleStart} 
            disabled={!role || isGenerating} 
            variant="premium"
            className="flex-1 shadow-clovely-glow"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Generando preguntas...
              </>
            ) : (
              'Comenzar Entrevista'
            )}
          </Button>
        </div>
      </Card>
    </div>
  );
}
