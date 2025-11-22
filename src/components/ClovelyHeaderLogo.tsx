import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ClovelyHeaderLogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  animated?: boolean;
  to?: string;
  asMotion?: boolean;
}

export const ClovelyHeaderLogo = ({ 
  size = 'md', 
  className = '', 
  animated = true,
  to = '/',
  asMotion = false
}: ClovelyHeaderLogoProps) => {
  const sizes = {
    sm: {
      logo: 'h-8 w-auto',
    },
    md: {
      logo: 'h-9 w-auto',
    },
    lg: {
      logo: 'h-10 w-auto',
    },
  };

  const LogoContent = (
    <img
      src="/clovely-logo-transparent.svg"
      alt="Clovely"
      className={cn(
        'object-contain transition-transform duration-200',
        sizes[size].logo,
        'opacity-95',
        'drop-shadow-[0_0_4px_rgba(255,122,0,0.15)] dark:drop-shadow-[0_0_6px_rgba(255,122,0,0.2)]',
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
