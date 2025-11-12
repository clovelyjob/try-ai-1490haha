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
  
  const LogoElement = (
    <div className={`inline-flex items-baseline font-poppins tracking-tight ${sizes[size]} ${className}`}>
      <span className="text-[1.3em] bg-gradient-to-r from-[#FF7A00] to-[#F97316] bg-clip-text text-transparent font-semibold">
        C
      </span>
      <span className="text-foreground font-semibold">
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
