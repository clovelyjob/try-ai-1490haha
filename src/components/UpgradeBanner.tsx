import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { X, Sparkles } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { motion, AnimatePresence } from 'framer-motion';

interface UpgradeBannerProps {
  onUpgrade: () => void;
}

export const UpgradeBanner = ({ onUpgrade }: UpgradeBannerProps) => {
  const { user } = useAuthStore();
  const [dismissed, setDismissed] = useState(false);
  
  // Check if banner was already dismissed in this session
  useEffect(() => {
    const wasDismissed = sessionStorage.getItem('upgrade-banner-dismissed');
    if (wasDismissed) {
      setDismissed(true);
    }
  }, []);
  
  const handleDismiss = () => {
    setDismissed(true);
    sessionStorage.setItem('upgrade-banner-dismissed', 'true');
  };
  
  // Don't show if user is premium or has dismissed
  if (user?.plan === 'premium' || dismissed) {
    return null;
  }
  
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="
          rounded-2xl border-2 border-primary/20 
          bg-gradient-to-br from-primary/5 via-primary-warm/8 to-secondary/5
          dark:from-primary/10 dark:via-primary-warm/15 dark:to-secondary/10
          p-4 relative overflow-hidden
          shadow-clovely-md hover:shadow-clovely-lg hover:-translate-y-0.5 transition-all duration-300
        "
      >
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-10 dark:opacity-20">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-primary-warm rounded-full blur-2xl" />
        </div>
        
        {/* Content */}
        <div className="relative flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1">
            <div className="p-2 rounded-full bg-gradient-to-br from-primary/20 to-primary-warm/20 dark:from-primary/30 dark:to-primary-warm/30">
              <Sparkles className="h-5 w-5 text-primary dark:text-primary-warm" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-sm text-foreground mb-0.5">
                Prueba Clovely Premium <span className="px-2 py-0.5 rounded-md bg-gradient-to-r from-primary to-primary-warm text-white text-xs font-bold">7 días gratis</span>
              </p>
              <p className="text-xs text-muted-foreground">
                Desbloquea coach IA ilimitado, simulador de entrevistas y más
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              onClick={onUpgrade}
              variant="premium"
              size="sm"
              className="shadow-clovely-glow hover:shadow-clovely-glow-lg"
            >
              Probar gratis
            </Button>
            <button
              onClick={handleDismiss}
              className="
                p-1.5 rounded-lg hover:bg-accent/50
                transition-colors text-muted-foreground hover:text-foreground
              "
              aria-label="Cerrar banner"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};