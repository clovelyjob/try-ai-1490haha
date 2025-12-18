import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Sparkles, ClipboardList, Brain, Rocket } from 'lucide-react';
import Confetti from 'react-confetti';
import { useEffect, useState } from 'react';
interface WelcomeStepProps {
  onStart: () => void;
  userName: string;
}
export const WelcomeStep = ({
  onStart,
  userName
}: WelcomeStepProps) => {
  const [showConfetti, setShowConfetti] = useState(true);
  const [dimensions, setDimensions] = useState({
    width: 0,
    height: 0
  });
  useEffect(() => {
    setDimensions({
      width: window.innerWidth,
      height: window.innerHeight
    });
    setTimeout(() => setShowConfetti(false), 5000);
  }, []);
  return <>
      {showConfetti && <Confetti width={dimensions.width} height={dimensions.height} recycle={false} numberOfPieces={500} gravity={0.3} />}
      
      <motion.div initial={{
      scale: 0.9,
      opacity: 0
    }} animate={{
      scale: 1,
      opacity: 1
    }} transition={{
      duration: 0.6,
      ease: "easeOut"
    }} className="text-center space-y-8">
        <motion.div initial={{
        scale: 0
      }} animate={{
        scale: 1
      }} transition={{
        delay: 0.2,
        type: "spring",
        stiffness: 200
      }} className="w-20 h-20 mx-auto rounded-full gradient-orange flex items-center justify-center shadow-2xl">
          <Sparkles className="h-10 w-10 text-white animate-pulse" />
        </motion.div>

        <motion.div initial={{
        y: 20,
        opacity: 0
      }} animate={{
        y: 0,
        opacity: 1
      }} transition={{
        delay: 0.3
      }} className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-heading font-bold bg-gradient-primary bg-clip-text text-transparent">
            ¡Bienvenido, {userName}! 🎉
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Estás a solo <span className="font-semibold text-primary">minutos</span> de descubrir tu camino profesional ideal
          </p>
        </motion.div>

        <motion.div initial={{
        y: 40,
        opacity: 0
      }} animate={{
        y: 0,
        opacity: 1
      }} transition={{
        delay: 0.5
      }}>
          <Card className="max-w-md mx-auto p-8 space-y-6 shadow-clovely-xl">
            <div className="space-y-5 text-left">
              <motion.div initial={{
              x: -20,
              opacity: 0
            }} animate={{
              x: 0,
              opacity: 1
            }} transition={{
              delay: 0.6
            }} className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0 shadow-md ring-2 ring-primary/20">
                  <ClipboardList className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-lg">Diagnóstico personalizado</p>
                  <p className="text-sm text-muted-foreground">
                    Responde preguntas sobre tus intereses y valores profesionales
                  </p>
                </div>
              </motion.div>

              <motion.div initial={{
              x: -20,
              opacity: 0
            }} animate={{
              x: 0,
              opacity: 1
            }} transition={{
              delay: 0.7
            }} className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0 shadow-md ring-2 ring-primary/20">
                  <Brain className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-lg">Análisis con IA</p>
                  <p className="text-sm text-muted-foreground">
                    Nuestro sistema identifica tus fortalezas únicas y potencial
                  </p>
                </div>
              </motion.div>

              <motion.div initial={{
              x: -20,
              opacity: 0
            }} animate={{
              x: 0,
              opacity: 1
            }} transition={{
              delay: 0.8
            }} className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0 shadow-md ring-2 ring-primary/20">
                  <Rocket className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-lg">Tu ruta personalizada</p>
                  <p className="text-sm text-muted-foreground">
                    Recibe un plan de acción adaptado a tu perfil profesional
                  </p>
                </div>
              </motion.div>
            </div>

            <motion.div initial={{
            scale: 0.9,
            opacity: 0
          }} animate={{
            scale: 1,
            opacity: 1
          }} transition={{
            delay: 0.9
          }}>
              <Button size="lg" className="w-full gradient-orange text-white text-lg font-semibold h-14 hover-glow" onClick={onStart}>
                Empezar diagnóstico →
              </Button>
            </motion.div>
          </Card>
        </motion.div>

        <motion.p initial={{
        opacity: 0
      }} animate={{
        opacity: 1
      }} transition={{
        delay: 1
      }} className="text-sm text-muted-foreground flex items-center justify-center gap-2">
          <span className="text-xl">⏱️</span>
          <span>Tiempo estimado: <span className="font-semibold text-primary">10 minutos</span></span>
        </motion.p>
      </motion.div>
    </>;
};