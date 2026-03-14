import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useTheme } from 'next-themes';
import moonjabEmerald from '@/assets/moonjab-full-emerald.png';
import moonjabLight from '@/assets/moonjab-full-light.png';

interface OfficialLogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  animated?: boolean;
  to?: string;
  asMotion?: boolean;
  fullVersion?: boolean;
}

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

  const logoSrc = isDark ? moonjabLight : moonjabEmerald;

  const LogoContent = (
    <img
      src={logoSrc}
      alt="MoonJab"
      className={cn(
        'object-contain transition-all duration-200',
        sizes[size],
        'opacity-95',
        'drop-shadow-[0_0_4px_rgba(16,185,129,0.12)] dark:drop-shadow-[0_0_6px_rgba(52,211,153,0.2)]',
        'hover:scale-[1.02]'
      )}
    />
  );

  const containerClasses = cn(
    'relative inline-flex items-center justify-center select-none',
    'transition-transform duration-200',
    className
  );

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

  if (to) {
    return (
      <Link to={to} className={containerClasses}>
        {LogoContent}
      </Link>
    );
  }

  return (
    <div className={containerClasses}>
      {LogoContent}
    </div>
  );
};
