import { motion } from 'framer-motion';
import { useEffect } from 'react';
import { useThemeLogo } from '@/hooks/useThemeLogo';
import moonjabEmerald from '@/assets/moonjab-logo-emerald.png';

interface SplashTransitionProps {
  title?: string;
  subtitle?: string;
  timeoutMs?: number;
  onComplete?: () => void;
}

export const SplashTransition = ({ 
  title = "¡Bienvenido(a) a MoonJab!",
  subtitle = "Estamos preparando tu experiencia…",
  timeoutMs = 1500,
  onComplete 
}: SplashTransitionProps) => {
  const { isDark } = useThemeLogo();

  useEffect(() => {
    const timer = setTimeout(() => { onComplete?.(); }, timeoutMs);
    return () => clearTimeout(timer);
  }, [timeoutMs, onComplete]);

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
          ? 'radial-gradient(ellipse 1400px 900px at 50% 20%, rgba(16,185,129,0.18), transparent 65%)'
          : 'radial-gradient(ellipse 1400px 900px at 50% 20%, rgba(16,185,129,0.12), transparent 65%)',
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
        <motion.div
          animate={prefersReducedMotion ? {} : {
            scale: [1, 1.06, 1],
            filter: [
              'drop-shadow(0 0 0px rgba(16, 185, 129, 0))',
              'drop-shadow(0 0 24px rgba(16, 185, 129, 0.5)) drop-shadow(0 0 48px rgba(16, 185, 129, 0.3))',
              'drop-shadow(0 0 0px rgba(16, 185, 129, 0))'
            ]
          }}
          transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
        >
          <img
            src={moonjabEmerald}
            alt="MoonJab – cargando"
            className="h-24 w-auto rounded-xl"
            loading="eager"
            decoding="async"
          />
        </motion.div>

        <div className="text-center space-y-2">
          <h1 className="text-xl font-semibold" style={{ color: isDark ? '#E2E8F0' : '#1E293B' }}>
            {title}
          </h1>
          <p className="text-sm" style={{ color: isDark ? '#CBD5E1' : '#475569' }}>
            {subtitle}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {[0, 1, 2].map((index) => (
            <motion.div
              key={index}
              animate={prefersReducedMotion ? { opacity: 1 } : { opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 1.2, repeat: Infinity, delay: index * 0.15, ease: 'easeInOut' }}
              className="w-2 h-2 rounded-full bg-primary"
              style={{ opacity: index === 1 ? 1 : 0.7 }}
            />
          ))}
        </div>
      </motion.div>

      <span className="sr-only">Cargando tu experiencia personalizada</span>
    </motion.div>
  );
};
