import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Sparkles, CheckCircle2, Loader2 } from 'lucide-react';
import { RolePreferences, ProfessionalRole } from '@/types';
import { detectRole, getRoleDefinition, PROFESSIONAL_ROLES } from '@/lib/roleDetection';

interface RoleDetectionStepProps {
  preferences: RolePreferences;
  onChange: (preferences: RolePreferences) => void;
  onRoleConfirmed: (role: ProfessionalRole, confidence: number) => void;
}

export const RoleDetectionStep = ({ preferences, onChange, onRoleConfirmed }: RoleDetectionStepProps) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<ReturnType<typeof detectRole>>([]);

  const questions = [
    {
      id: 'intereses',
      title: '¿Qué áreas te apasionan?',
      description: 'Selecciona o escribe tus principales intereses profesionales',
      placeholder: 'Ej: Diseño, Desarrollo, Análisis de datos, Marketing...',
      suggestions: ['Diseño UX/UI', 'Desarrollo Web', 'Análisis de Datos', 'Gestión de Productos', 'Marketing Digital', 'Finanzas']
    },
    {
      id: 'objetivos',
      title: '¿Cuáles son tus objetivos principales?',
      description: 'Qué te gustaría lograr en tu carrera',
      placeholder: 'Ej: Mejorar portafolio, Conseguir trabajo remoto, Especializarme en...',
      suggestions: ['Mejorar portafolio', 'Buscar empleo', 'Cambiar de industria', 'Freelancing', 'Emprendimiento', 'Especialización']
    },
    {
      id: 'herramientas',
      title: '¿Qué herramientas usas o te interesan?',
      description: 'Software, lenguajes o plataformas con los que trabajas',
      placeholder: 'Ej: Figma, React, Python, Excel, Photoshop...',
      suggestions: ['Figma', 'React', 'Python', 'Excel', 'Jira', 'SQL', 'Adobe Creative Suite', 'Google Analytics']
    }
  ];

  const currentQ = questions[currentQuestion];
  const currentValue = preferences[currentQ.id as keyof RolePreferences] as string[];

  const addItem = (item: string) => {
    if (!currentValue.includes(item) && item.trim()) {
      onChange({
        ...preferences,
        [currentQ.id]: [...currentValue, item.trim()]
      });
    }
  };

  const removeItem = (item: string) => {
    onChange({
      ...preferences,
      [currentQ.id]: currentValue.filter(i => i !== item)
    });
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Analizar y mostrar sugerencias
      setIsAnalyzing(true);
      setTimeout(() => {
        const detected = detectRole(preferences);
        setSuggestions(detected);
        setIsAnalyzing(false);
        setShowSuggestions(true);
      }, 1500);
    }
  };

  const handleSelectRole = (role: ProfessionalRole, confidence: number) => {
    onRoleConfirmed(role, confidence);
  };

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
          <h3 className="text-2xl font-heading font-bold">Analizando tu perfil...</h3>
          <p className="text-muted-foreground">
            Estamos procesando tu información para encontrar los roles que mejor se ajustan a ti
          </p>
        </div>
      </div>
    );
  }

  if (showSuggestions) {
    return (
      <div className="space-y-6">
        <div className="text-center space-y-3">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="w-16 h-16 rounded-full gradient-orange flex items-center justify-center mx-auto"
          >
            <Sparkles className="h-8 w-8 text-white" />
          </motion.div>
          <h2 className="text-3xl font-heading font-bold">
            ¡Hemos encontrado tu perfil ideal!
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            Basándonos en tus intereses, objetivos y herramientas, estos son los roles que mejor se ajustan a ti
          </p>
        </div>

        <div className="grid gap-4 max-w-3xl mx-auto">
          {suggestions.map((suggestion, index) => {
            const roleInfo = getRoleDefinition(suggestion.role);
            if (!roleInfo) return null;

            return (
              <motion.div
                key={suggestion.role}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card 
                  className={`p-6 cursor-pointer transition-all hover:shadow-lg hover:-translate-y-1 ${
                    index === 0 ? 'border-primary border-2 bg-primary/5' : ''
                  }`}
                  onClick={() => handleSelectRole(suggestion.role, suggestion.confidence)}
                >
                  <div className="flex items-start gap-4">
                    <div className="text-4xl shrink-0">{roleInfo.icon}</div>
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center justify-between">
                        <h3 className="font-heading font-bold text-lg">{roleInfo.label}</h3>
                        <Badge className={`${
                          suggestion.confidence >= 70 ? 'gradient-orange text-white' : 
                          suggestion.confidence >= 50 ? 'bg-secondary' : 
                          'bg-muted'
                        }`}>
                          {suggestion.confidence}% match
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{roleInfo.description}</p>
                      {suggestion.reasons.length > 0 && (
                        <div className="space-y-1 pt-2">
                          {suggestion.reasons.map((reason, i) => (
                            <div key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                              <CheckCircle2 className="h-3 w-3 text-primary mt-0.5 shrink-0" />
                              <span>{reason}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    {index === 0 && (
                      <Badge className="gradient-premium text-white">
                        Recomendado
                      </Badge>
                    )}
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>

        <div className="text-center">
          <Button
            variant="outline"
            onClick={() => {
              // Mostrar todos los roles
              const allRoles = PROFESSIONAL_ROLES.filter(r => r.id !== 'other').map(r => ({
                role: r.id,
                confidence: 0,
                reasons: []
              }));
              setSuggestions(allRoles);
            }}
          >
            Ver todos los roles disponibles
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Progress */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>Pregunta {currentQuestion + 1} de {questions.length}</span>
          <span>{Math.round(((currentQuestion + 1) / questions.length) * 100)}%</span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <motion.div
            className="h-full gradient-orange"
            initial={{ width: 0 }}
            animate={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Question */}
      <motion.div
        key={currentQuestion}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        className="space-y-6"
      >
        <div className="text-center space-y-3">
          <h2 className="text-3xl font-heading font-bold">{currentQ.title}</h2>
          <p className="text-muted-foreground">{currentQ.description}</p>
        </div>

        {/* Input */}
        <div className="space-y-3 max-w-xl mx-auto">
          <div className="flex gap-2">
            <Input
              placeholder={currentQ.placeholder}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  addItem(e.currentTarget.value);
                  e.currentTarget.value = '';
                }
              }}
            />
            <Button
              type="button"
              onClick={(e) => {
                const input = (e.currentTarget.previousSibling as HTMLInputElement);
                addItem(input.value);
                input.value = '';
              }}
            >
              Agregar
            </Button>
          </div>

          {/* Selected items */}
          {currentValue.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {currentValue.map((item) => (
                <Badge key={item} variant="secondary" className="text-sm px-3 py-1">
                  {item}
                  <button
                    onClick={() => removeItem(item)}
                    className="ml-2 hover:text-destructive"
                  >
                    ×
                  </button>
                </Badge>
              ))}
            </div>
          )}

          {/* Quick suggestions */}
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Sugerencias rápidas:</Label>
            <div className="flex flex-wrap gap-2">
              {currentQ.suggestions.map((suggestion) => (
                <Badge
                  key={suggestion}
                  variant="outline"
                  className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                  onClick={() => addItem(suggestion)}
                >
                  + {suggestion}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Actions */}
      <div className="flex justify-between max-w-xl mx-auto pt-4">
        <Button
          variant="outline"
          onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
          disabled={currentQuestion === 0}
        >
          Anterior
        </Button>
        <Button
          onClick={handleNext}
          disabled={currentValue.length === 0}
          className="gradient-orange text-white"
        >
          {currentQuestion < questions.length - 1 ? 'Siguiente' : 'Analizar mi perfil'}
          {currentQuestion === questions.length - 1 && <Sparkles className="ml-2 h-4 w-4" />}
        </Button>
      </div>
    </div>
  );
};
