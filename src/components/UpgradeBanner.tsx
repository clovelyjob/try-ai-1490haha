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
        className="
          rounded-xl border-2 border-[#FF7A00]/20 
          bg-gradient-to-r from-[#FFE7D6] to-[#FFF5EB] 
          dark:from-[#2A190F] dark:to-[#1A1107]
          p-4 relative overflow-hidden
          shadow-sm
        "
      >
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#FF7A00] rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-[#FF7A00] rounded-full blur-2xl" />
        </div>
        
        {/* Content */}
        <div className="relative flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1">
            <div className="p-2 rounded-full bg-[#FF7A00]/20 dark:bg-[#FF7A00]/30">
              <Sparkles className="h-5 w-5 text-[#FF7A00] dark:text-[#FBBF24]" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-sm text-[#0F172A] dark:text-white mb-0.5">
                Prueba Clovely Premium <span className="text-[#FF7A00] dark:text-[#FBBF24]">7 días gratis</span>
              </p>
              <p className="text-xs text-[#475569] dark:text-[#CBD5E1]">
                Desbloquea coach IA ilimitado, simulador de entrevistas y más
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              onClick={onUpgrade}
              className="
                gradient-orange text-white font-semibold text-sm
                hover:scale-105 transition-transform
                shadow-md
              "
              size="sm"
            >
              Probar gratis
            </Button>
            <button
              onClick={handleDismiss}
              className="
                p-1.5 rounded-lg hover:bg-black/10 dark:hover:bg-white/10
                transition-colors text-[#64748B] dark:text-[#94A3B8]
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