import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuthStore } from '@/store/useAuthStore';
import { Sparkles, X } from 'lucide-react';
import { GuestConversionModal } from './GuestConversionModal';

export function GuestBanner() {
  const { isGuestMode } = useAuthStore();
  const [showModal, setShowModal] = useState(false);
  const [showBanner, setShowBanner] = useState(true);

  if (!isGuestMode || !showBanner) return null;

  return (
    <>
      <AnimatePresence>
        {showBanner && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="sticky top-0 z-40"
          >
            <Alert className="rounded-none border-x-0 bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
              <Sparkles className="h-4 w-4 text-primary" />
              <AlertDescription className="flex items-center justify-between gap-4">
                <span className="text-sm">
                  <strong>Estás usando la versión demo.</strong> Tus datos no se guardarán permanentemente.
                </span>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    onClick={() => setShowModal(true)}
                    className="gradient-orange text-white shrink-0"
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
