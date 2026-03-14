import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import moonjabEmerald from '@/assets/moonjab-full-emerald.png';
import moonjabLight from '@/assets/moonjab-full-light.png';

interface DecoratedLogoProps {
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
  className?: string;
}

export const DecoratedLogo = ({ size = 'md', animated = false, className = '' }: DecoratedLogoProps) => {
  const { theme, systemTheme } = useTheme();
  const currentTheme = theme === 'system' ? systemTheme : theme;
  const isDark = currentTheme === 'dark';

  const sizes = {
    sm: 'h-10',
    md: 'h-12',
    lg: 'h-16',
  };

  const LogoElement = (
    <div className={`flex items-center justify-center ${className}`}>
      <img
        src={isDark ? moonjabLight : moonjabEmerald}
        alt="MoonJab"
        className={`${sizes[size]} w-auto object-contain`}
      />
    </div>
  );

  if (!animated) return LogoElement;

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
