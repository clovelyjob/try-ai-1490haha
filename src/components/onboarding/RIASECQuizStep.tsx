import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ThumbsUp, Minus, ThumbsDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { RIASEC_QUESTIONS, getShuffledQuestions, RIASECQuestion } from '@/lib/riasecQuestions';
import { AnswerValue } from '@/lib/riasecScoring';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface RIASECQuizStepProps {
  onComplete: (answers: Record<string, AnswerValue>) => void;
  initialAnswers?: Record<string, AnswerValue>;
}

const answerOptions = [
  { value: 2 as AnswerValue, label: 'Me gusta', icon: ThumbsUp, color: 'text-green-500 bg-green-500/10 border-green-500/30 hover:bg-green-500/20' },
  { value: 1 as AnswerValue, label: 'Neutro', icon: Minus, color: 'text-muted-foreground bg-muted/50 border-border hover:bg-muted' },
  { value: 0 as AnswerValue, label: 'No me gusta', icon: ThumbsDown, color: 'text-red-500 bg-red-500/10 border-red-500/30 hover:bg-red-500/20' },
];

export function RIASECQuizStep({ onComplete, initialAnswers = {} }: RIASECQuizStepProps) {
  const [questions] = useState<RIASECQuestion[]>(() => getShuffledQuestions());
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, AnswerValue>>(initialAnswers);
  const [direction, setDirection] = useState(0);

  const currentQuestion = questions[currentIndex] || questions[0];
  const progress = (Object.keys(answers).length / questions.length) * 100;
  const isComplete = Object.keys(answers).length === questions.length;
  
  // Safety check - ensure currentIndex is within bounds
  useEffect(() => {
    if (currentIndex >= questions.length) {
      setCurrentIndex(questions.length - 1);
    }
  }, [currentIndex, questions.length]);

  // Find first unanswered question index
  const findFirstUnanswered = (): number => {
    for (let i = 0; i < questions.length; i++) {
      if (answers[questions[i].id] === undefined) {
        return i;
      }
    }
    return -1;
  };

  const handleAnswer = (value: AnswerValue) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: value,
    }));

    // Auto-advance after a short delay
    setTimeout(() => {
      if (currentIndex < questions.length - 1) {
        setDirection(1);
        setCurrentIndex(prev => prev + 1);
      }
    }, 200);
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setDirection(-1);
      setCurrentIndex(prev => prev - 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setDirection(1);
      setCurrentIndex(prev => prev + 1);
    }
  };

  const handleTryComplete = () => {
    if (isComplete) {
      onComplete(answers);
    } else {
      const firstUnanswered = findFirstUnanswered();
      const missing = questions.length - Object.keys(answers).length;
      
      toast.error(`Te faltan ${missing} preguntas`, {
        description: 'Responde todas las preguntas para ver tus resultados'
      });
      
      if (firstUnanswered !== -1) {
        setDirection(firstUnanswered > currentIndex ? 1 : -1);
        setCurrentIndex(firstUnanswered);
      }
    }
  };

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 300 : -300,
      opacity: 0,
    }),
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">Descubre tu perfil vocacional</h2>
        <p className="text-muted-foreground">
          Indica qué tanto te gustaría hacer cada actividad
        </p>
      </div>

      {/* Progress */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>Pregunta {currentIndex + 1} de {questions.length}</span>
          <span>{Math.round(progress)}% completado</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Question Card */}
      <div className="relative min-h-[280px] flex items-center justify-center">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentQuestion.id}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="w-full"
          >
            <div className="bg-card border border-border rounded-2xl p-8 shadow-sm">
              <p className="text-xl font-medium text-center mb-8">
                {currentQuestion.text}
              </p>

              {/* Answer Options */}
              <div className="flex justify-center gap-4">
                {answerOptions.map((option) => {
                  const Icon = option.icon;
                  const isSelected = answers[currentQuestion.id] === option.value;
                  
                  return (
                    <button
                      key={option.value}
                      onClick={() => handleAnswer(option.value)}
                      className={cn(
                        'flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-200 min-w-[100px]',
                        option.color,
                        isSelected && 'ring-2 ring-primary ring-offset-2 ring-offset-background scale-105'
                      )}
                    >
                      <Icon className="w-8 h-8" />
                      <span className="text-sm font-medium">{option.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={handlePrevious}
          disabled={currentIndex === 0}
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Anterior
        </Button>

        <div className="flex gap-1">
          {questions.map((_, idx) => (
            <button
              key={idx}
              onClick={() => {
                setDirection(idx > currentIndex ? 1 : -1);
                setCurrentIndex(idx);
              }}
              className={cn(
                'w-2 h-2 rounded-full transition-all',
                idx === currentIndex 
                  ? 'bg-primary w-6' 
                  : answers[questions[idx].id] !== undefined 
                    ? 'bg-primary/50' 
                    : 'bg-muted'
              )}
            />
          ))}
        </div>

{currentIndex === questions.length - 1 ? (
          <Button
            onClick={handleTryComplete}
            className={!isComplete ? 'opacity-70' : ''}
          >
            Ver Resultados {!isComplete && `(${Object.keys(answers).length}/${questions.length})`}
          </Button>
        ) : (
          <Button
            variant="ghost"
            onClick={handleNext}
            disabled={answers[currentQuestion.id] === undefined}
          >
            Siguiente
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        )}
      </div>

      {/* Quick Stats */}
      <div className="flex justify-center gap-8 text-sm text-muted-foreground">
        <span className="flex items-center gap-1">
          <ThumbsUp className="w-4 h-4 text-green-500" />
          {Object.values(answers).filter(v => v === 2).length}
        </span>
        <span className="flex items-center gap-1">
          <Minus className="w-4 h-4" />
          {Object.values(answers).filter(v => v === 1).length}
        </span>
        <span className="flex items-center gap-1">
          <ThumbsDown className="w-4 h-4 text-red-500" />
          {Object.values(answers).filter(v => v === 0).length}
        </span>
      </div>
    </div>
  );
}
