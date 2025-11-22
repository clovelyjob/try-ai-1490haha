import { motion } from 'framer-motion';

interface ClovelyTextLogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  animated?: boolean;
}

export const ClovelyTextLogo = ({ size = 'md', className = '', animated = true }: ClovelyTextLogoProps) => {
  const sizes = {
    sm: 'h-6',
    md: 'h-7',
    lg: 'h-9'
  };

  const LogoElement = (
    <div className={`inline-flex items-center ${className}`}>
      <img
        src="/clovely-logo-light.png"
        alt="Clovely"
        className={`${sizes[size]} w-auto object-contain drop-shadow-sm`}
      />
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
