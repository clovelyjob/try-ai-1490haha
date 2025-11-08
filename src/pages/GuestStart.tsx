import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/store/useAuthStore';
import { Card } from '@/components/ui/card';
import { Sparkles } from 'lucide-react';

export default function GuestStart() {
  const navigate = useNavigate();
  const startGuestMode = useAuthStore((state) => state.startGuestMode);

  useEffect(() => {
    // Iniciar modo invitado automáticamente
    startGuestMode();
    
    // Esperar un momento para la animación y luego redirigir
    const timer = setTimeout(() => {
      navigate('/dashboard');
    }, 2000);

    return () => clearTimeout(timer);
  }, [startGuestMode, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-secondary/5 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="p-8 max-w-md text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center"
          >
            <Sparkles className="h-8 w-8 text-primary" />
          </motion.div>
          
          <h2 className="text-2xl font-heading font-bold mb-2">
            ¡Bienvenido a Clovely!
          </h2>
          <p className="text-muted-foreground">
            Estamos preparando tu experiencia de demostración...
          </p>
          
          <div className="mt-6 flex gap-2 justify-center">
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="w-2 h-2 bg-primary rounded-full"
            />
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
              className="w-2 h-2 bg-primary rounded-full"
            />
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
              className="w-2 h-2 bg-primary rounded-full"
            />
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
