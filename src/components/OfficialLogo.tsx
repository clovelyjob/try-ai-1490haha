import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useTheme } from 'next-themes';

interface OfficialLogoProps {
  /** Size preset for the logo */
  size?: 'sm' | 'md' | 'lg';
  /** Additional CSS classes */
  className?: string;
  /** Whether to animate on mount */
  animated?: boolean;
  /** Link destination (if clickable) */
  to?: string;
  /** Use motion wrapper for animations */
  asMotion?: boolean;
  /** Show full version with lines and card (for landing/marketing) */
  fullVersion?: boolean;
}

/**
 * Official Clovely Logo Component
 * 
 * Always shows "Clovely" (complete with C) - never just "lovely"
 * 
 * Features:
 * - Light/dark mode adaptive
 * - C with orange gradient + "Clovely" text
 * - Clean version for dashboard (no lines/card)
 * - Full version for landing (with decorative lines and card)
 */
export const OfficialLogo = ({ 
  size = 'md', 
  className = '', 
  animated = false,
  to,
  asMotion = false,
  fullVersion = false
}: OfficialLogoProps) => {
  const { theme, systemTheme } = useTheme();
  const currentTheme = theme === 'system' ? systemTheme : theme;
  const isDark = currentTheme === 'dark';

  const sizes = {
    sm: fullVersion ? 'h-10' : 'h-7 w-auto',
    md: fullVersion ? 'h-12' : 'h-8 w-auto',
    lg: fullVersion ? 'h-16' : 'h-9 w-auto',
  };

  // Choose correct logo variant
  const logoSrc = fullVersion 
    ? (isDark ? '/clovely-logo-dark.png' : '/clovely-logo-light.png')  // Landing version
    : isDark 
      ? '/clovely-logo-dark.png'  // Dashboard dark mode
      : '/clovely-logo-light.png';  // Dashboard light mode

  const LogoContent = (
    <img
      src={logoSrc}
      alt="Clovely"
      className={cn(
        'object-contain transition-all duration-200',
        sizes[size],
        'opacity-95',
        fullVersion 
          ? 'drop-shadow-[0_0_8px_rgba(255,122,0,0.15)] dark:drop-shadow-[0_0_12px_rgba(255,122,0,0.25)]'
          : 'drop-shadow-[0_0_4px_rgba(255,122,0,0.18)] dark:drop-shadow-[0_0_6px_rgba(255,122,0,0.25)]',
        'hover:scale-[1.04]'
      )}
    />
  );

  const containerClasses = cn(
    'relative inline-flex items-center justify-center select-none',
    'transition-transform duration-200',
    className
  );

  // Motion wrapper
  if (asMotion) {
    const content = (
      <motion.div
        className={containerClasses}
        initial={animated ? { opacity: 0, scale: 0.95 } : false}
        animate={animated ? { opacity: 1, scale: 1 } : false}
        transition={{ duration: 0.3 }}
      >
        {LogoContent}
      </motion.div>
    );

    return to ? <Link to={to}>{content}</Link> : content;
  }

  // Link wrapper
  if (to) {
    return (
      <Link to={to} className={containerClasses}>
        {LogoContent}
      </Link>
    );
  }

  // Plain container
  return (
    <div className={containerClasses}>
      {LogoContent}
    </div>
  );
};
