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
      logo: 'w-8 h-8',
      glow: 'w-14 h-14 blur-[36px]',
      line: 'w-[22px] h-[2px]',
    },
    md: {
      logo: 'w-10 h-10 md:w-12 md:h-12',
      glow: 'w-16 h-16 md:w-20 md:h-20 blur-[42px]',
      line: 'w-[28px] md:w-[40px] h-[2px]',
    },
    lg: {
      logo: 'w-12 h-12 md:w-14 md:h-14 lg:w-14 lg:h-14',
      glow: 'w-20 h-20 md:w-24 md:h-24 blur-[42px]',
      line: 'w-[32px] md:w-[44px] h-[2px]',
    },
  };

  const LogoContent = (
    <>
      {/* Left decorative line */}
      <span 
        aria-hidden="true"
        className={cn(
          'hidden sm:block rounded-full transition-transform duration-200',
          sizes[size].line,
          'bg-gradient-to-r from-[#FF7A00] to-[#F97316]',
          'group-hover:scale-x-105'
        )}
      />

      {/* Logo with glow */}
      <span className="relative inline-flex items-center justify-center">
        <span
          aria-hidden="true"
          className={cn(
            'pointer-events-none absolute inset-0 rounded-full -z-10 transition-colors duration-300',
            sizes[size].glow,
            'bg-[#FF7A00]/20 dark:bg-[#FF7A00]/30',
            'group-hover:bg-[#FF7A00]/25 dark:group-hover:bg-[#FF7A00]/35'
          )}
        />
        <img
          src="/clovely-logo.png"
          alt="Clovely"
          className={cn(
            'relative object-contain transition-transform duration-200',
            sizes[size].logo,
            'drop-shadow-[0_0_8px_rgba(255,122,0,0.25)] dark:drop-shadow-[0_0_12px_rgba(255,122,0,0.35)]',
            'group-hover:scale-[1.03]'
          )}
        />
      </span>

      {/* Right decorative line */}
      <span 
        aria-hidden="true"
        className={cn(
          'hidden sm:block rounded-full transition-transform duration-200',
          sizes[size].line,
          'bg-gradient-to-l from-[#FF7A00] to-[#F97316]',
          'group-hover:scale-x-105'
        )}
      />
    </>
  );

  const containerClasses = cn(
    'relative inline-flex items-center justify-center gap-3 select-none group',
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
