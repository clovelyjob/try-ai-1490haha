import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuthStore } from '@/store/useAuthStore';
import { Sparkles, X } from 'lucide-react';
import { GuestConversionModal } from './GuestConversionModal';

export function GuestBanner() {
  const { isGuestMode, session } = useAuthStore();
  const [showModal, setShowModal] = useState(false);
  const [showBanner, setShowBanner] = useState(true);

  // No mostrar banner si hay sesión real de Supabase o no estamos en modo invitado
  if (!isGuestMode || !showBanner || session?.user) return null;

  return (
    <>
      <AnimatePresence>
        {showBanner && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="sticky top-0 z-40"
          >
            <Alert className="rounded-none border-x-0 bg-primary/5 border-2 border-primary/20 shadow-clovely-md">
              <Sparkles className="h-4 w-4 text-primary animate-pulse" />
              <AlertDescription className="flex items-center justify-between gap-4">
                <span className="text-sm">
                  <strong>Estás en modo de prueba.</strong> Explora la plataforma — tus datos son temporales.
                </span>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    onClick={() => setShowModal(true)}
                    variant="premium"
                    className="shrink-0 shadow-clovely-glow"
                  >
                    Crear mi cuenta
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setShowBanner(false)}
                    className="shrink-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </AlertDescription>
            </Alert>
          </motion.div>
        )}
      </AnimatePresence>

      <GuestConversionModal 
        open={showModal} 
        onClose={() => setShowModal(false)} 
      />
    </>
  );
}
