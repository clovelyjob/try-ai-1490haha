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
      glow: 'w-20 h-20',
    },
    md: {
      logo: 'w-16 h-16',
      line: 'w-16 h-0.5',
      glow: 'w-28 h-28',
    },
    lg: {
      logo: 'w-20 h-20',
      line: 'w-20 h-0.5',
      glow: 'w-36 h-36',
    },
  };

  const LogoElement = (
    <div className={`flex items-center gap-4 ${className}`}>
      <div className={`${sizes[size].line} bg-gradient-to-r from-transparent to-[#FF7A00]`} />
      <div className="relative flex justify-center items-center">
        <div className={`absolute ${sizes[size].glow} blur-3xl bg-[#FF7A00]/15 dark:bg-[#FF7A00]/30 rounded-full scale-125 animate-pulse`} />
        <img
          src="/clovely-logo.png"
          alt="Clovely"
          className={`relative ${sizes[size].logo} object-contain drop-shadow-[0_0_8px_rgba(255,122,0,0.25)] dark:drop-shadow-[0_0_12px_rgba(255,122,0,0.35)]`}
        />
      </div>
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
