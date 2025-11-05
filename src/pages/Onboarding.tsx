import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { WelcomeStep } from '@/components/onboarding/WelcomeStep';
import { InterestsStep } from '@/components/onboarding/InterestsStep';
import { ValuesStep } from '@/components/onboarding/ValuesStep';
import { StyleStep } from '@/components/onboarding/StyleStep';
import { SkillsStep } from '@/components/onboarding/SkillsStep';
import { ExperienceStep } from '@/components/onboarding/ExperienceStep';
import { ResultsStep } from '@/components/onboarding/ResultsStep';
import { useAuthStore } from '@/store/useAuthStore';
import { useProfileStore } from '@/store/useProfileStore';
import { toast } from 'sonner';

const Onboarding = () => {
  const navigate = useNavigate();
  const { user, updateUser } = useAuthStore();
  const { setProfile } = useProfileStore();
  const [currentStep, setCurrentStep] = useState(0);
  const [onboardingData, setOnboardingData] = useState({
    interests: [] as string[],
    values: [] as string[],
    workStyle: {
      modality: '',
      schedule: '',
      companySize: '',
    },
    skills: {
      technical: [] as { name: string; level: number }[],
      soft: [] as string[],
      languages: [] as { name: string; level: string }[],
      tools: [] as string[],
    },
    experience: '' as string,
    situation: '',
    challenge: '',
  });

  const totalSteps = 7;
  const progress = (currentStep / (totalSteps - 1)) * 100;

  const updateData = (key: string, value: any) => {
    setOnboardingData((prev) => ({ ...prev, [key]: value }));
  };

  const handleNext = () => {
    if (currentStep === 1 && onboardingData.interests.length < 3) {
      toast.error('Selecciona al menos 3 áreas de interés');
      return;
    }
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

  const handleComplete = () => {
    const profileData = {
      userId: user?.id || '1',
      interests: onboardingData.interests,
      values: onboardingData.values,
      workStyle: onboardingData.workStyle,
      skills: onboardingData.skills,
      experience: (onboardingData.experience || 'student') as 'student' | 'graduate' | 'junior' | 'mid' | 'senior' | 'transition',
      situation: onboardingData.situation,
      challenge: onboardingData.challenge,
      diagnosticResults: {
        topCareers: [
          { title: 'Product Designer', match: 92 },
          { title: 'Product Manager', match: 87 },
          { title: 'Marketing Manager', match: 83 },
        ],
        profileType: 'Innovador Creativo',
        insights: [
          'Tienes un perfil equilibrado entre creatividad y análisis',
          'Tu capacidad de comunicación es una fortaleza clave',
          'Valoras el impacto y la autonomía en tu trabajo',
        ],
        radarData: [
          { skill: 'Creatividad', value: 85 },
          { skill: 'Análisis', value: 72 },
          { skill: 'Liderazgo', value: 68 },
          { skill: 'Comunicación', value: 90 },
          { skill: 'Técnica', value: 65 },
          { skill: 'Estrategia', value: 78 },
        ],
      },
    };

    setProfile(profileData);
    updateUser({ onboardingCompleted: true });
    toast.success('¡Perfil completado!');
    navigate('/dashboard');
  };

  const steps = [
    <WelcomeStep key="welcome" onStart={handleNext} userName={user?.name || 'Usuario'} />,
    <InterestsStep
      key="interests"
      selected={onboardingData.interests}
      onChange={(interests) => updateData('interests', interests)}
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
    <SkillsStep
      key="skills"
      skills={onboardingData.skills}
      onChange={(skills) => updateData('skills', skills)}
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
      }}
    />,
    <ResultsStep key="results" onComplete={handleComplete} />,
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {currentStep > 0 && currentStep < totalSteps - 1 && (
        <div className="sticky top-0 z-10 bg-background border-b">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center gap-4 max-w-3xl mx-auto">
              <span className="text-sm font-medium whitespace-nowrap">
                Paso {currentStep} de {totalSteps - 2}
              </span>
              <Progress value={progress} className="flex-1" />
              <span className="text-sm text-muted-foreground whitespace-nowrap">
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

      {currentStep > 0 && currentStep < totalSteps - 1 && (
        <div className="sticky bottom-0 border-t bg-background">
          <div className="container mx-auto px-4 py-4">
            <div className="flex gap-3 max-w-3xl mx-auto">
              <Button
                variant="outline"
                onClick={handleBack}
                disabled={currentStep === 1}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Atrás
              </Button>
              <Button
                className="flex-1 gradient-orange text-white"
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
