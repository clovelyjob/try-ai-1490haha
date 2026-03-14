import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useTheme } from 'next-themes';
import moonjabEmerald from '@/assets/moonjab-full-emerald.png';
import moonjabLight from '@/assets/moonjab-full-light.png';

interface ClovelyLogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  animated?: boolean;
  to?: string;
  asMotion?: boolean;
}

export const ClovelyLogo = ({ 
  size = 'md', 
  className = '', 
  animated = false,
  to = '/',
  asMotion = false
}: ClovelyLogoProps) => {
  const { theme, systemTheme } = useTheme();
  const currentTheme = theme === 'system' ? systemTheme : theme;
  const isDark = currentTheme === 'dark';

  const sizes = {
    sm: 'h-7 w-auto',
    md: 'h-8 w-auto',
    lg: 'h-9 w-auto',
  };

  const LogoContent = (
    <img
      src={isDark ? moonjabLight : moonjabEmerald}
      alt="MoonJab"
      className={cn(
        'object-contain transition-all duration-200',
        sizes[size],
        'opacity-95',
        'hover:scale-[1.04]'
      )}
    />
  );

  const containerClasses = cn(
    'relative inline-flex items-center justify-center select-none',
    'transition-transform duration-200',
    className
  );

  if (asMotion) {
    return (
      <motion.div
        className={containerClasses}
        initial={animated ? { opacity: 0, scale: 0.95 } : false}
        animate={animated ? { opacity: 1, scale: 1 } : false}
        transition={{ duration: 0.3 }}
      >
        {LogoContent}
      </motion.div>
    );
  }

  return (
    <Link to={to} className={containerClasses}>
      {LogoContent}
    </Link>
  );
};
