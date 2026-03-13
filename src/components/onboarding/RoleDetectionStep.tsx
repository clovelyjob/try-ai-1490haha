import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Sparkles, CheckCircle2, Loader2, X } from 'lucide-react';
import { DynamicIcon } from '@/components/DynamicIcon';
import { RolePreferences, ProfessionalRole } from '@/types';
import { getRoleDefinition, PROFESSIONAL_ROLES } from '@/lib/roleDetection';
import { useAI } from '@/hooks/useAI';
import { toast } from 'sonner';

interface RoleDetectionStepProps {
  preferences: RolePreferences;
  onChange: (preferences: RolePreferences) => void;
  onRoleConfirmed: (role: ProfessionalRole, confidence: number) => void;
}

interface DynamicQuestion {
  question: string;
  description: string;
  suggestions: string[];
}

interface RoleSuggestion {
  role: ProfessionalRole;
  confidence: number;
  reasons: string[];
}

export const RoleDetectionStep = ({ preferences, onChange, onRoleConfirmed }: RoleDetectionStepProps) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<RoleSuggestion[]>([]);
  const [dynamicQuestions, setDynamicQuestions] = useState<DynamicQuestion[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoadingQuestion, setIsLoadingQuestion] = useState(true);
  
  const { generateDiagnosticQuestion, analyzeDiagnosticProfile, isLoading } = useAI();

  const questionKeys = ['intereses', 'objetivos', 'herramientas'];
  const currentKey = questionKeys[currentQuestion];
  const currentValue = preferences[currentKey as keyof RolePreferences] as string[];

  // Cargar la primera pregunta al montar el componente
  useEffect(() => {
    loadQuestion(0);
  }, []);

  const loadQuestion = async (stepIndex: number) => {
    setIsLoadingQuestion(true);
    try {
      const questionData = await generateDiagnosticQuestion(preferences, stepIndex);
      const newQuestions = [...dynamicQuestions];
      newQuestions[stepIndex] = questionData;
      setDynamicQuestions(newQuestions);
    } catch (error) {
      console.error('Error loading question:', error);
      // Fallback a pregunta estática si falla
      const fallbackQuestions: DynamicQuestion[] = [
        {
          question: '¿Qué áreas te apasionan?',
          description: 'Selecciona o escribe tus principales intereses profesionales',
          suggestions: ['Diseño UX/UI', 'Desarrollo Web', 'Análisis de Datos', 'Gestión de Productos', 'Marketing Digital', 'Finanzas']
        },
        {
          question: '¿Cuáles son tus objetivos principales?',
          description: 'Qué te gustaría lograr en tu carrera',
          suggestions: ['Mejorar portafolio', 'Buscar empleo', 'Cambiar de industria', 'Freelancing', 'Emprendimiento', 'Especialización']
        },
        {
          question: '¿Qué herramientas usas o te interesan?',
          description: 'Software, lenguajes o plataformas con los que trabajas',
          suggestions: ['Figma', 'React', 'Python', 'Excel', 'Jira', 'SQL', 'Adobe Creative Suite', 'Google Analytics']
        }
      ];
      const newQuestions = [...dynamicQuestions];
      newQuestions[stepIndex] = fallbackQuestions[stepIndex];
      setDynamicQuestions(newQuestions);
      toast.error('No se pudo generar pregunta personalizada, usando pregunta predeterminada');
    } finally {
      setIsLoadingQuestion(false);
    }
  };

  const addItem = (item: string) => {
    if (!currentValue.includes(item) && item.trim()) {
      onChange({
        ...preferences,
        [currentKey]: [...currentValue, item.trim()]
      });
    }
  };

  const removeItem = (item: string) => {
    onChange({
      ...preferences,
      [currentKey]: currentValue.filter(i => i !== item)
    });
  };

  const handleAddFromInput = () => {
    if (inputValue.trim()) {
      addItem(inputValue);
      setInputValue('');
    }
  };

  const handleNext = async () => {
    if (currentValue.length === 0) {
      toast.error('Por favor agrega al menos una respuesta antes de continuar');
      return;
    }

    if (currentQuestion < questionKeys.length - 1) {
      const nextQuestion = currentQuestion + 1;
      setCurrentQuestion(nextQuestion);
      // Cargar la siguiente pregunta basada en las respuestas actuales
      if (!dynamicQuestions[nextQuestion]) {
        await loadQuestion(nextQuestion);
      }
    } else {
      // Analizar con IA
      setIsAnalyzing(true);
      try {
        const result = await analyzeDiagnosticProfile(preferences);
        
        // Mapear las recomendaciones de la IA
        const mappedSuggestions: RoleSuggestion[] = result.recommendations.map((rec: any) => ({
          role: rec.role as ProfessionalRole,
          confidence: rec.confidence,
          reasons: rec.reasons
        }));
        
        setSuggestions(mappedSuggestions);
        setShowSuggestions(true);
      } catch (error) {
        console.error('Error analyzing profile:', error);
        toast.error('Error al analizar tu perfil. Por favor intenta nuevamente.');
      } finally {
        setIsAnalyzing(false);
      }
    }
  };

  const handleSelectRole = (role: ProfessionalRole, confidence: number) => {
    onRoleConfirmed(role, confidence);
  };

  if (isLoadingQuestion && !dynamicQuestions[currentQuestion]) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] space-y-6">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <Sparkles className="h-16 w-16 text-primary" />
        </motion.div>
        <div className="text-center space-y-2">
          <h3 className="text-2xl font-heading font-bold">Preparando tu pregunta...</h3>
          <p className="text-muted-foreground">
            Estamos personalizando las preguntas basándonos en tu perfil
          </p>
        </div>
      </div>
    );
  }

  if (isAnalyzing) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] space-y-6">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <Sparkles className="h-16 w-16 text-primary" />
        </motion.div>
        <div className="text-center space-y-2">
          <h3 className="text-2xl font-heading font-bold">Analizando tu perfil con IA...</h3>
          <p className="text-muted-foreground">
            Nuestro modelo está procesando tu información para encontrar los roles perfectos para ti
          </p>
        </div>
      </div>
    );
  }

  if (showSuggestions) {
    return (
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-heading font-bold">Roles Recomendados para Ti</h2>
          <p className="text-muted-foreground">
            Basado en tu perfil, estos son los roles que mejor se ajustan
          </p>
        </div>

        <div className="grid gap-4">
          {suggestions.map((suggestion) => {
            const roleDef = getRoleDefinition(suggestion.role);
            if (!roleDef) return null;

            return (
              <motion.div
                key={suggestion.role}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="p-6 hover:shadow-lg transition-all cursor-pointer border-2 hover:border-primary/50"
                      onClick={() => handleSelectRole(suggestion.role, suggestion.confidence)}>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="text-4xl"><DynamicIcon name={roleDef.icon} size={36} className="text-primary" /></div>
                      <div>
                        <h3 className="text-xl font-heading font-bold">{roleDef.label}</h3>
                        <p className="text-sm text-muted-foreground">{roleDef.description}</p>
                      </div>
                    </div>
                    <Badge variant="secondary" className="text-lg px-3 py-1">
                      {Math.round(suggestion.confidence)}%
                    </Badge>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm font-semibold text-primary">Por qué es ideal para ti:</p>
                    <ul className="space-y-1">
                      {suggestion.reasons.map((reason, idx) => (
                        <li key={idx} className="flex items-start space-x-2">
                          <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{reason}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>

        <div className="mt-6">
          <Button
            variant="outline"
            className="w-full"
            onClick={() => setShowSuggestions(false)}
          >
            Ver todos los roles disponibles
          </Button>
        </div>

        {!showSuggestions && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-6">
            {PROFESSIONAL_ROLES.map((role) => (
              <Card
                key={role.id}
                className="p-4 hover:shadow-lg transition-all cursor-pointer hover:border-primary/50"
                onClick={() => handleSelectRole(role.id as ProfessionalRole, 75)}
              >
                <div className="text-center space-y-2">
                  <div className="text-3xl">{role.icon}</div>
                  <p className="text-sm font-medium">{role.label}</p>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    );
  }

  const currentQ = dynamicQuestions[currentQuestion];
  if (!currentQ) return null;

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Badge variant="outline">
            Pregunta {currentQuestion + 1} de {questionKeys.length}
          </Badge>
          <span className="text-sm text-muted-foreground">
            {Math.round(((currentQuestion + 1) / questionKeys.length) * 100)}% completado
          </span>
        </div>

        <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-primary"
            initial={{ width: 0 }}
            animate={{ width: `${((currentQuestion + 1) / questionKeys.length) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      <Card className="p-6 space-y-6">
        <div className="space-y-2">
          <h2 className="text-2xl font-heading font-bold">{currentQ.question}</h2>
          <p className="text-muted-foreground">{currentQ.description}</p>
        </div>

        <div className="space-y-4">
          <div className="flex space-x-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddFromInput()}
              placeholder="Escribe y presiona Enter..."
              className="flex-1"
            />
            <Button onClick={handleAddFromInput} disabled={!inputValue.trim()}>
              Agregar
            </Button>
          </div>

          {currentQ.suggestions.length > 0 && (
            <div className="space-y-2">
              <Label className="text-sm text-muted-foreground">Sugerencias rápidas:</Label>
              <div className="flex flex-wrap gap-2">
                {currentQ.suggestions.map((suggestion) => (
                  <Button
                    key={suggestion}
                    variant="outline"
                    size="sm"
                    onClick={() => addItem(suggestion)}
                    disabled={currentValue.includes(suggestion)}
                    className="hover-lift"
                  >
                    {suggestion}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {currentValue.length > 0 && (
            <div className="space-y-2">
              <Label>Seleccionados:</Label>
              <div className="flex flex-wrap gap-2">
                {currentValue.map((item) => (
                  <Badge key={item} variant="secondary" className="px-3 py-1">
                    {item}
                    <button
                      onClick={() => removeItem(item)}
                      className="ml-2 hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </Card>

      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
          disabled={currentQuestion === 0}
        >
          Anterior
        </Button>
        <Button
          onClick={handleNext}
          disabled={currentValue.length === 0 || isLoading}
          className="min-w-[120px]"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : currentQuestion === questionKeys.length - 1 ? (
            'Analizar'
          ) : (
            'Siguiente'
          )}
        </Button>
      </div>
    </div>
  );
};
