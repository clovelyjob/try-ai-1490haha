import { motion } from 'framer-motion';

interface ClovelyTextLogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  animated?: boolean;
}

export const ClovelyTextLogo = ({ size = 'md', className = '', animated = true }: ClovelyTextLogoProps) => {
  const sizes = {
    sm: 'text-2xl',
    md: 'text-3xl',
    lg: 'text-4xl'
  };
  
  const logoSizes = {
    sm: 'w-6 h-6',
    md: 'w-7 h-7',
    lg: 'w-9 h-9'
  };

  const LogoElement = (
    <div className={`inline-flex items-center gap-1 ${className}`}>
      <img
        src="/clovely-logo.png"
        alt="Clovely"
        className={`${logoSizes[size]} object-contain drop-shadow-sm`}
      />
      <span className={`${sizes[size]} font-poppins font-semibold tracking-tight text-foreground`}>
        lovely
      </span>
    </div>
  );

  if (!animated) {
    return LogoElement;
  }

  return (
    <motion.div
      className="inline-block"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      {LogoElement}
    </motion.div>
  );
};
