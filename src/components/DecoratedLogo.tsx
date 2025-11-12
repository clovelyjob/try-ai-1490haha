import { motion } from 'framer-motion';

interface DecoratedLogoProps {
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
  className?: string;
}

export const DecoratedLogo = ({ size = 'md', animated = false, className = '' }: DecoratedLogoProps) => {
  const sizes = {
    sm: {
      logo: 'w-12 h-12',
      line: 'w-12 h-0.5',
    },
    md: {
      logo: 'w-16 h-16',
      line: 'w-16 h-0.5',
    },
    lg: {
      logo: 'w-20 h-20',
      line: 'w-20 h-0.5',
    },
  };

  const LogoElement = (
    <div className={`flex items-center gap-4 ${className}`}>
      <div className={`${sizes[size].line} bg-gradient-to-r from-transparent to-[#FF7A00]`} />
      <img
        src="/clovely-logo.png"
        alt="Clovely"
        className={`${sizes[size].logo} object-contain drop-shadow-[0_0_8px_rgba(255,122,0,0.25)] dark:drop-shadow-[0_0_12px_rgba(255,122,0,0.35)]`}
      />
      <div className={`${sizes[size].line} bg-gradient-to-l from-transparent to-[#FF7A00]`} />
    </div>
  );

  if (!animated) {
    return LogoElement;
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
    >
      {LogoElement}
    </motion.div>
  );
};
