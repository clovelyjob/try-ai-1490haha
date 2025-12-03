import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { WelcomeStep } from '@/components/onboarding/WelcomeStep';
import { RIASECQuizStep } from '@/components/onboarding/RIASECQuizStep';
import { ValuesStep } from '@/components/onboarding/ValuesStep';
import { StyleStep } from '@/components/onboarding/StyleStep';
import { ExperienceStep } from '@/components/onboarding/ExperienceStep';
import { ResultsStep } from '@/components/onboarding/ResultsStep';
import { useAuthStore } from '@/store/useAuthStore';
import { useProfileStore } from '@/store/useProfileStore';
import { useAnalytics } from '@/hooks/useAnalytics';
import { toast } from 'sonner';
import { ProfessionalRole, RolePreferences } from '@/types';
import { AnswerValue, analyzeRIASECResults, RIASECResult } from '@/lib/riasecScoring';

const Onboarding = () => {
  const navigate = useNavigate();
  const { user, updateUser } = useAuthStore();
  const { setProfile } = useProfileStore();
  const { trackEvent } = useAnalytics();
  const [currentStep, setCurrentStep] = useState(0);
  const [riasecAnswers, setRiasecAnswers] = useState<Record<string, AnswerValue>>({});
  const [riasecResult, setRiasecResult] = useState<RIASECResult | null>(null);
  const [onboardingData, setOnboardingData] = useState({
    values: [] as string[],
    workStyle: {
      modality: '',
      schedule: '',
      companySize: '',
    },
    experience: '' as string,
    situation: '',
    challenge: '',
    rolePreferences: {
      intereses: [] as string[],
      objetivos: [] as string[],
      herramientas: [] as string[],
      nivelExperiencia: 'junior' as 'junior' | 'mid' | 'senior'
    } as RolePreferences
  });

  const totalSteps = 6; // Welcome, RIASEC Quiz, Values, Style, Experience, Results
  const progress = (currentStep / (totalSteps - 1)) * 100;

  const updateData = (key: string, value: any) => {
    setOnboardingData((prev) => ({ ...prev, [key]: value }));
  };

  const handleNext = () => {
    if (currentStep === 2 && onboardingData.values.length < 3) {
      toast.error('Selecciona al menos 3 valores');
      return;
    }
    if (currentStep < totalSteps - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleRIASECComplete = async (answers: Record<string, AnswerValue>) => {
    setRiasecAnswers(answers);
    const result = analyzeRIASECResults(answers);
    setRiasecResult(result);
    
    // Track RIASEC completion
    await trackEvent('role_detected', {
      hollandCode: result.hollandCode,
      topTypes: result.topTypes.slice(0, 3).map(t => t.type),
    });
    
    handleNext();
  };

  const handleComplete = () => {
    if (!user?.id) {
      navigate('/dashboard');
      return;
    }

    const topRole = riasecResult?.compatibleRoles[0]?.role || 'other';

    // Actualizar stores locales
    updateUser({ onboardingCompleted: true });
    
    // Navegar al dashboard inmediatamente
    navigate('/dashboard');

    // Guardar en Supabase en background
    (async () => {
      try {
        await trackEvent('onboarding_completed', {
          hollandCode: riasecResult?.hollandCode,
          topRole,
          completedAt: new Date().toISOString()
        });

        await supabase
          .from('profiles')
          .update({
            rol_profesional: topRole,
            preferencias_laborales: {
              intereses: onboardingData.rolePreferences.intereses,
              objetivos: onboardingData.rolePreferences.objetivos,
              herramientas: onboardingData.rolePreferences.herramientas,
              nivelExperiencia: onboardingData.rolePreferences.nivelExperiencia,
              riasecScores: riasecResult?.percentages ? { ...riasecResult.percentages } : null,
              hollandCode: riasecResult?.hollandCode || null,
              values: onboardingData.values,
              workStyle: onboardingData.workStyle,
              experience: onboardingData.experience,
              situation: onboardingData.situation,
              challenge: onboardingData.challenge,
            },
            progreso: {
              cv_completado: false,
              entrevistas_realizadas: 0,
              oportunidades_guardadas: 0,
              onboarding_completado: true,
            }
          })
          .eq('id', user.id);
      } catch (error: any) {
        console.error('Error guardando perfil en background:', error);
      }
    })();
  };

  const steps = [
    <WelcomeStep key="welcome" onStart={handleNext} userName={user?.name || 'Usuario'} />,
    <RIASECQuizStep
      key="riasec"
      onComplete={handleRIASECComplete}
      initialAnswers={riasecAnswers}
    />,
    <ValuesStep
      key="values"
      selected={onboardingData.values}
      onChange={(values) => updateData('values', values)}
    />,
    <StyleStep
      key="style"
      workStyle={onboardingData.workStyle}
      onChange={(workStyle) => updateData('workStyle', workStyle)}
    />,
    <ExperienceStep
      key="experience"
      data={{
        experience: onboardingData.experience,
        situation: onboardingData.situation,
        challenge: onboardingData.challenge,
      }}
      onChange={(data) => {
        updateData('experience', data.experience);
        updateData('situation', data.situation);
        updateData('challenge', data.challenge);
        updateData('rolePreferences', {
          ...onboardingData.rolePreferences,
          nivelExperiencia: data.experience === 'senior' ? 'senior' : 
                          data.experience === 'mid' ? 'mid' : 'junior'
        });
      }}
    />,
    <ResultsStep 
      key="results" 
      onComplete={handleComplete}
      riasecResult={riasecResult}
      values={onboardingData.values}
      experience={onboardingData.experience}
    />,
  ];

  // Don't show navigation on Welcome (0), RIASEC Quiz (1), and Results (last)
  const showNavigation = currentStep > 1 && currentStep < totalSteps - 1;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {showNavigation && (
        <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b shadow-clovely-sm">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center gap-4 max-w-3xl mx-auto">
              <span className="text-sm font-medium whitespace-nowrap">
                Paso {currentStep} de {totalSteps - 2}
              </span>
              <div className="flex-1 relative">
                <Progress value={progress} className="h-2" />
              </div>
              <span className="text-sm font-medium whitespace-nowrap">
                {Math.round(progress)}%
              </span>
            </div>
          </div>
        </div>
      )}

      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-3xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {steps[currentStep]}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {showNavigation && (
        <div className="sticky bottom-0 border-t bg-background/80 backdrop-blur-md shadow-clovely-lg">
          <div className="container mx-auto px-4 py-6">
            <div className="flex gap-4 max-w-3xl mx-auto">
              <Button
                variant="outline"
                size="lg"
                onClick={handleBack}
                className="shadow-clovely-sm"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Atrás
              </Button>
              <Button
                variant="premium"
                size="lg"
                className="flex-1 shadow-clovely-glow"
                onClick={handleNext}
              >
                {currentStep === totalSteps - 2 ? 'Ver resultados' : 'Continuar'}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Onboarding;
