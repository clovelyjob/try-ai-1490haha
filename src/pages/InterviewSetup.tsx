import { useState } from "react";
import { useTranslation } from 'react-i18next';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "react-router-dom";
import { useInterviewStore } from "@/store/useInterviewStore";
import { useAuthStore } from "@/store/useAuthStore";
import { useCVStore } from "@/store/useCVStore";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Briefcase, FileText, Check } from "lucide-react";
import { ResponseModeSelector, type ResponseMode } from "@/components/interview/ResponseModeSelector";
import type { InterviewLevel, CVData } from "@/types";

// Helper to convert CV data to text for AI context
const cvToText = (cv: CVData): string => {
  let text = '';
  
  // Personal info
  if (cv.personal?.fullName) text += `Nombre: ${cv.personal.fullName}\n`;
  if (cv.personal?.title) text += `Título: ${cv.personal.title}\n`;
  
  // Summary
  if (cv.summary) text += `\nResumen: ${cv.summary}\n`;
  
  // Experience
  if (cv.experience && cv.experience.length > 0) {
    text += '\nExperiencia Laboral:\n';
    cv.experience.forEach(exp => {
      text += `- ${exp.role} en ${exp.company} (${exp.startDate} - ${exp.endDate || 'Presente'})\n`;
      if (exp.bullets && exp.bullets.length > 0) {
        exp.bullets.forEach(b => {
          text += `  • ${b.text}${b.metric ? ` (${b.metric})` : ''}\n`;
        });
      }
    });
  }
  
  // Skills
  if (cv.skills && cv.skills.length > 0) {
    text += `\nHabilidades: ${cv.skills.map(s => s.name).join(', ')}\n`;
  }
  
  // Education
  if (cv.education && cv.education.length > 0) {
    text += '\nEducación:\n';
    cv.education.forEach(edu => {
      text += `- ${edu.degree} en ${edu.field}, ${edu.institution}\n`;
    });
  }
  
  // Certifications
  if (cv.certifications && cv.certifications.length > 0) {
    text += '\nCertificaciones:\n';
    cv.certifications.forEach(cert => {
      text += `- ${cert.name} (${cert.institution})\n`;
    });
  }
  
  // Projects
  if (cv.projects && cv.projects.length > 0) {
    text += '\nProyectos:\n';
    cv.projects.forEach(proj => {
      text += `- ${proj.title}: ${proj.description}\n`;
    });
  }
  
  // Languages
  if (cv.languages && cv.languages.length > 0) {
    text += `\nIdiomas: ${cv.languages.map(l => `${l.name} (${l.level})`).join(', ')}\n`;
  }
  
  return text;
};

export default function InterviewSetup() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { startSession, seedQuestions } = useInterviewStore();
  const { user } = useAuthStore();
  const { cvs } = useCVStore();
  const { toast } = useToast();
  
  const [role, setRole] = useState("");
  const [level, setLevel] = useState<InterviewLevel>("junior");
  const [jobDescription, setJobDescription] = useState("");
  const [responseMode, setResponseMode] = useState<ResponseMode>("text");
  const [selectedCVId, setSelectedCVId] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleStart = async () => {
    if (!role || !user) return;
    
    setIsGenerating(true);
    
    try {
      // Extract CV content if a CV is selected
      let cvContent: string | undefined;
      if (selectedCVId) {
        const selectedCV = cvs.find(cv => cv.id === selectedCVId);
        if (selectedCV) {
          cvContent = cvToText(selectedCV);
        }
      }
      
      // Generate questions with AI based on role, level, description and CV
      await seedQuestions(role, level, jobDescription || undefined, cvContent);
      
      // Store response mode in localStorage
      localStorage.setItem('clovely_interview_response_mode', responseMode);
      
      startSession({
        userId: user.id,
        role,
        level,
        jobDescription: jobDescription || undefined,
        cvVersionId: selectedCVId || undefined,
      });
      
      navigate('/dashboard/interviews/session');
    } catch (error) {
      console.error('Error starting interview:', error);
      toast({
        title: t('common.error'),
        description: t('errors.generic'),
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
            {t('interviews.setup.title')}
          </h1>
          <p className="text-muted-foreground">
            {t('interviews.setup.subtitle')}
          </p>
        </div>

        <div className="space-y-5">
          {/* Puesto o Rol */}
          <div className="space-y-2">
            <Label htmlFor="role">{t('interviews.setup.role')} *</Label>
            <Input
              id="role"
              placeholder={t('interviews.setup.rolePlaceholder')}
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="min-h-[48px] rounded-xl"
            />
          </div>

          {/* Nivel de Experiencia */}
          <div className="space-y-2">
            <Label htmlFor="level">{t('interviews.setup.experience')}</Label>
            <Select value={level} onValueChange={(v) => setLevel(v as InterviewLevel)}>
              <SelectTrigger id="level" className="min-h-[48px] rounded-xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="junior">{t('interviews.setup.experienceLevels.junior')}</SelectItem>
                <SelectItem value="mid">{t('interviews.setup.experienceLevels.mid')}</SelectItem>
                <SelectItem value="senior">{t('interviews.setup.experienceLevels.senior')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Descripción del Puesto */}
          <div className="space-y-2">
            <Label htmlFor="jobDescription">{t('interviews.setup.jobDescription')} ({t('common.optional')})</Label>
            <Textarea
              id="jobDescription"
              placeholder={t('interviews.setup.jobDescriptionPlaceholder')}
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              rows={5}
              className="min-h-[120px] rounded-xl resize-none"
            />
            <p className="text-xs text-muted-foreground">
              {t('interviews.setup.jobDescriptionHint')}
            </p>
          </div>

          {/* Selección de CV */}
          <div className="space-y-2">
            <Label htmlFor="cv">{t('interviews.setup.selectCV')} ({t('common.optional')})</Label>
            <Select 
              value={selectedCVId || "none"} 
              onValueChange={(v) => setSelectedCVId(v === "none" ? null : v)}
            >
              <SelectTrigger id="cv" className="min-h-[48px] rounded-xl">
                <SelectValue placeholder={t('interviews.setup.selectCVPlaceholder')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">{t('interviews.setup.noCV')}</SelectItem>
                {cvs.map((cv) => (
                  <SelectItem key={cv.id} value={cv.id}>
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-muted-foreground" />
                      <span>{cv.title}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedCVId && (
              <div className="flex items-center gap-2 text-xs text-primary">
                <Check className="w-3 h-3" />
                <span>{t('interviews.setup.cvSelected')}</span>
              </div>
            )}
            <p className="text-xs text-muted-foreground">
              {t('interviews.setup.cvHint')}
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
              {t('interviews.setup.generating')}
            </>
          ) : (
            t('interviews.setup.generateQuestions')
          )}
        </Button>

        <p className="text-xs text-center text-muted-foreground">
          {t('interviews.setup.questionsNote')}
        </p>
      </Card>
    </div>
  );
}