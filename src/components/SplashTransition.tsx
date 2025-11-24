import { motion } from 'framer-motion';
import { useEffect } from 'react';
import { useThemeLogo } from '@/hooks/useThemeLogo';
import clovelyLogo from '@/assets/clovely-logo.jpg';

interface SplashTransitionProps {
  title?: string;
  subtitle?: string;
  timeoutMs?: number;
  onComplete?: () => void;
}

export const SplashTransition = ({ 
  title = "¡Bienvenido(a) a Clovely!",
  subtitle = "Estamos preparando tu experiencia…",
  timeoutMs = 1500,
  onComplete 
}: SplashTransitionProps) => {
  const { isDark } = useThemeLogo();

  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete?.();
    }, timeoutMs);

    return () => clearTimeout(timer);
  }, [timeoutMs, onComplete]);

  // Detect reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
      className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden"
      style={{
        background: isDark
          ? 'radial-gradient(ellipse 1400px 900px at 50% 20%, rgba(249,115,22,0.18), transparent 65%)'
          : 'radial-gradient(ellipse 1400px 900px at 50% 20%, rgba(255,122,0,0.12), transparent 65%)',
        backgroundColor: isDark ? '#0E0E0E' : '#FFFFFF'
      }}
      role="status"
      aria-live="polite"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.35, delay: 0.1 }}
        className="flex flex-col items-center gap-6 p-8 rounded-2xl shadow-lg"
        style={{
          backgroundColor: isDark ? '#111315' : '#FFFFFF',
          border: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}`
        }}
      >
        {/* Logo with breathing animation */}
        <motion.div
          animate={prefersReducedMotion ? {} : {
            scale: [1, 1.06, 1],
            filter: [
              'drop-shadow(0 0 0px rgba(255, 122, 0, 0))',
              'drop-shadow(0 0 24px rgba(255, 122, 0, 0.5)) drop-shadow(0 0 48px rgba(255, 122, 0, 0.3))',
              'drop-shadow(0 0 0px rgba(255, 122, 0, 0))'
            ]
          }}
          transition={{
            duration: 1.6,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        >
          <img
            src={clovelyLogo}
            alt="Clovely – cargando"
            className={`h-24 w-auto ${isDark ? 'rounded-xl border-2 border-primary p-2' : 'rounded-xl'}`}
            loading="eager"
            decoding="async"
          />
        </motion.div>

        {/* Title and subtitle */}
        <div className="text-center space-y-2">
          <h1 
            className="text-xl font-semibold"
            style={{ color: isDark ? '#E2E8F0' : '#1E293B' }}
          >
            {title}
          </h1>
          <p 
            className="text-sm"
            style={{ color: isDark ? '#CBD5E1' : '#475569' }}
          >
            {subtitle}
          </p>
        </div>

        {/* Animated dots */}
        <div className="flex items-center gap-2">
          {[0, 1, 2].map((index) => (
            <motion.div
              key={index}
              animate={prefersReducedMotion ? { opacity: 1 } : {
                opacity: [0.4, 1, 0.4],
              }}
              transition={{
                duration: 1.2,
                repeat: Infinity,
                delay: index * 0.15,
                ease: 'easeInOut'
              }}
              className="w-2 h-2 rounded-full"
              style={{
                background: index === 1 
                  ? 'linear-gradient(135deg, #FF7A00, #F97316)' 
                  : 'linear-gradient(135deg, #F97316, #FB923C)',
                opacity: index === 1 ? 1 : 0.7
              }}
            />
          ))}
        </div>
      </motion.div>

      <span className="sr-only">Cargando tu experiencia personalizada</span>
    </motion.div>
  );
};
