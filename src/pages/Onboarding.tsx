import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { WelcomeStep } from '@/components/onboarding/WelcomeStep';
import { RIASECQuizStep } from '@/components/onboarding/RIASECQuizStep';
import { ResultsStep } from '@/components/onboarding/ResultsStep';
import { useAuthStore } from '@/store/useAuthStore';
import { useAnalytics } from '@/hooks/useAnalytics';
import { AnswerValue, analyzeRIASECResults, RIASECResult } from '@/lib/riasecScoring';
import { toast } from 'sonner';

const Onboarding = () => {
  const navigate = useNavigate();
  const { user, updateUser, isGuestMode } = useAuthStore();
  const { trackEvent } = useAnalytics();
  const [currentStep, setCurrentStep] = useState(0);
  const [riasecAnswers, setRiasecAnswers] = useState<Record<string, AnswerValue>>({});
  const [riasecResult, setRiasecResult] = useState<RIASECResult | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [supabaseUserId, setSupabaseUserId] = useState<string | null>(null);

  // Get the real Supabase user ID on mount
  useEffect(() => {
    const getSupabaseUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user?.id) {
        setSupabaseUserId(session.user.id);
      }
    };
    getSupabaseUser();
  }, []);

  const handleNext = () => {
    setCurrentStep((prev) => prev + 1);
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
    
    // Go directly to results
    setCurrentStep(2);
  };

  const handleComplete = async () => {
    // Guest mode - just navigate
    if (isGuestMode) {
      updateUser({ onboardingCompleted: true });
      navigate('/dashboard');
      return;
    }

    // Must have a valid user ID and result
    const userId = supabaseUserId;
    if (!userId || !riasecResult) {
      toast.error('Error: No se pudo guardar. Por favor intenta de nuevo.');
      console.error('Missing userId or riasecResult', { userId, riasecResult });
      return;
    }

    setIsSaving(true);

    try {
      // Save to Supabase FIRST - this is critical for routing
      const { error } = await supabase
        .from('profiles')
        .update({
          rol_profesional: riasecResult.compatibleRoles[0]?.role || 'other',
          preferencias_laborales: {
            riasecScores: { ...riasecResult.percentages },
            hollandCode: riasecResult.hollandCode,
          },
          progreso: {
            cv_completado: false,
            entrevistas_realizadas: 0,
            oportunidades_guardadas: 0,
            onboarding_completado: true,
          }
        })
        .eq('id', userId);

      if (error) {
        console.error('Error saving profile:', error);
        toast.error('Error al guardar el perfil. Intenta de nuevo.');
        setIsSaving(false);
        return;
      }

      // Track completion
      await trackEvent('onboarding_completed', {
        hollandCode: riasecResult.hollandCode,
        topRole: riasecResult.compatibleRoles[0]?.role,
        completedAt: new Date().toISOString()
      });

      // Update local state
      updateUser({ onboardingCompleted: true });
      
      // Navigate to dashboard
      toast.success('¡Diagnóstico completado!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Error in handleComplete:', error);
      toast.error('Error inesperado. Intenta de nuevo.');
      setIsSaving(false);
    }
  };

  const steps = [
    <WelcomeStep key="welcome" onStart={handleNext} userName={user?.name || 'Usuario'} />,
    <RIASECQuizStep
      key="riasec"
      onComplete={handleRIASECComplete}
      initialAnswers={riasecAnswers}
    />,
    <ResultsStep 
      key="results" 
      onComplete={handleComplete}
      riasecResult={riasecResult}
      isLoading={isSaving}
    />,
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
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
    </div>
  );
};

export default Onboarding;
