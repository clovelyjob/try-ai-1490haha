import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Play } from 'lucide-react';
import { useInterviewStore } from '@/store/useInterviewStore';
import { useAuthStore } from '@/store/useAuthStore';
import { useCVStore } from '@/store/useCVStore';
import { useToast } from '@/hooks/use-toast';
import type { InterviewLevel, InterviewTone, InterviewType } from '@/types';

export default function InterviewSetup() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const user = useAuthStore((state) => state.user);
  const cvs = useCVStore((state) => state.cvs);
  const startSession = useInterviewStore((state) => state.startSession);
  const seedQuestions = useInterviewStore((state) => state.seedQuestions);

  const [role, setRole] = useState('');
  const [level, setLevel] = useState<InterviewLevel>('mid');
  const [interviewType, setInterviewType] = useState<InterviewType>('screening');
  const [tone, setTone] = useState<InterviewTone>('empatico');
  const [jobDescription, setJobDescription] = useState('');
  const [selectedCVId, setSelectedCVId] = useState<string>('none');

  const handleStart = () => {
    if (!role.trim()) {
      toast({
        title: 'Error',
        description: 'Por favor ingresa el rol para el cual practicarás',
        variant: 'destructive',
      });
      return;
    }

    if (!user) {
      toast({
        title: 'Error',
        description: 'Debes iniciar sesión para practicar entrevistas',
        variant: 'destructive',
      });
      return;
    }

    // Seed questions if not already loaded
    seedQuestions();

    startSession({
      userId: user.id,
      role,
      level,
      interviewType,
      tone,
      jobDescription: jobDescription.trim() || undefined,
      cvVersionId: selectedCVId !== 'none' ? selectedCVId : undefined,
    });

    navigate('/dashboard/interviews/session');
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-3xl mx-auto px-4 py-8">
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
            Configurar práctica
          </h1>
          <p className="text-muted-foreground">
            Personaliza tu sesión de entrevista para obtener la mejor experiencia
          </p>
        </div>

        <Card className="p-6 space-y-6">
          {/* Role */}
          <div className="space-y-2">
            <Label htmlFor="role">Puesto objetivo *</Label>
            <Input
              id="role"
              placeholder="Ej: Analista de Datos, Desarrollador Frontend, Product Manager"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            />
          </div>

          {/* Level */}
          <div className="space-y-2">
            <Label htmlFor="level">Nivel de seniority</Label>
            <Select value={level} onValueChange={(v) => setLevel(v as InterviewLevel)}>
              <SelectTrigger id="level">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="junior">Junior (0-2 años)</SelectItem>
                <SelectItem value="mid">Mid (2-5 años)</SelectItem>
                <SelectItem value="senior">Senior (5+ años)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Interview Type */}
          <div className="space-y-2">
            <Label htmlFor="type">Tipo de entrevista</Label>
            <Select value={interviewType} onValueChange={(v) => setInterviewType(v as InterviewType)}>
              <SelectTrigger id="type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="screening">Screening inicial</SelectItem>
                <SelectItem value="tecnica">Entrevista técnica</SelectItem>
                <SelectItem value="cultural">Entrevista cultural</SelectItem>
                <SelectItem value="caso">Caso práctico</SelectItem>
                <SelectItem value="roleplay">Role play</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Tone */}
          <div className="space-y-2">
            <Label htmlFor="tone">Tono del entrevistador</Label>
            <Select value={tone} onValueChange={(v) => setTone(v as InterviewTone)}>
              <SelectTrigger id="tone">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="empatico">Empático y motivador</SelectItem>
                <SelectItem value="directo">Directo y profesional</SelectItem>
                <SelectItem value="exigente">Exigente y desafiante</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* CV Selection */}
          {cvs.length > 0 && (
            <div className="space-y-2">
              <Label htmlFor="cv">CV para esta entrevista (opcional)</Label>
              <Select value={selectedCVId} onValueChange={setSelectedCVId}>
                <SelectTrigger id="cv">
                  <SelectValue placeholder="Selecciona un CV" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Sin CV</SelectItem>
                  {cvs.map((cv) => (
                    <SelectItem key={cv.id} value={cv.id}>
                      {cv.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Job Description */}
          <div className="space-y-2">
            <Label htmlFor="job-desc">Descripción de la vacante (opcional)</Label>
            <Textarea
              id="job-desc"
              placeholder="Pega aquí la descripción de la vacante para personalizar las preguntas..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              rows={4}
            />
            <p className="text-xs text-muted-foreground">
              Esto ayudará a adaptar las preguntas y el feedback a la posición específica
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              className="flex-1"
              size="lg"
              onClick={handleStart}
            >
              <Play className="w-4 h-4 mr-2" />
              Iniciar práctica
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
