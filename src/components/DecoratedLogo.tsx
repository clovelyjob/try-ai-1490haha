import { motion } from 'framer-motion';

interface DecoratedLogoProps {
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
  className?: string;
}

export const DecoratedLogo = ({ size = 'md', animated = false, className = '' }: DecoratedLogoProps) => {
  const sizes = {
    sm: {
      logo: 'h-10',
    },
    md: {
      logo: 'h-12',
    },
    lg: {
      logo: 'h-16',
    },
  };

  const LogoElement = (
    <div className={`flex items-center justify-center ${className}`}>
      <img
        src="/clovely-logo-full.svg"
        alt="Clovely"
        className={`${sizes[size].logo} w-auto object-contain drop-shadow-[0_0_8px_rgba(255,122,0,0.15)] dark:drop-shadow-[0_0_12px_rgba(255,122,0,0.25)]`}
      />
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
