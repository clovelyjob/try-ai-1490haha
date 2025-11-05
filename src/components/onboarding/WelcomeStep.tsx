import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Sparkles } from 'lucide-react';
import Confetti from 'react-confetti';
import { useEffect, useState } from 'react';

interface WelcomeStepProps {
  onStart: () => void;
  userName: string;
}

export const WelcomeStep = ({ onStart, userName }: WelcomeStepProps) => {
  const [showConfetti, setShowConfetti] = useState(true);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    setDimensions({
      width: window.innerWidth,
      height: window.innerHeight,
    });
    setTimeout(() => setShowConfetti(false), 5000);
  }, []);

  return (
    <>
      {showConfetti && (
        <Confetti
          width={dimensions.width}
          height={dimensions.height}
          recycle={false}
          numberOfPieces={500}
        />
      )}
      
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="text-center space-y-8"
      >
        <div className="w-20 h-20 mx-auto rounded-full gradient-orange flex items-center justify-center">
          <Sparkles className="h-10 w-10 text-white" />
        </div>

        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-heading font-bold">
            ¡Bienvenido, {userName}! 🎉
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Estás a solo 10 minutos de descubrir tu camino profesional ideal
          </p>
        </div>

        <Card className="max-w-md mx-auto p-8 space-y-6">
          <div className="space-y-4 text-left">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-1">
                <span className="text-primary font-bold">1</span>
              </div>
              <div>
                <p className="font-semibold">Diagnóstico personalizado</p>
                <p className="text-sm text-muted-foreground">
                  Responde preguntas sobre tus intereses y valores
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-1">
                <span className="text-primary font-bold">2</span>
              </div>
              <div>
                <p className="font-semibold">Análisis con IA</p>
                <p className="text-sm text-muted-foreground">
                  Nuestro sistema identifica tus fortalezas únicas
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-1">
                <span className="text-primary font-bold">3</span>
              </div>
              <div>
                <p className="font-semibold">Tu ruta personalizada</p>
                <p className="text-sm text-muted-foreground">
                  Recibe un plan de acción adaptado a tu perfil
                </p>
              </div>
            </div>
          </div>

          <Button
            size="lg"
            className="w-full gradient-orange text-white text-lg"
            onClick={onStart}
          >
            Empezar diagnóstico →
          </Button>
        </Card>

        <p className="text-sm text-muted-foreground">
          ⏱️ Tiempo estimado: 10 minutos
        </p>
      </motion.div>
    </>
  );
};
