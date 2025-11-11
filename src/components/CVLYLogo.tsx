import { motion } from 'framer-motion';
import { useThemeLogo } from '@/hooks/useThemeLogo';

interface CVLYLogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  animated?: boolean;
}

export const CVLYLogo = ({ size = 'md', className = '', animated = true }: CVLYLogoProps) => {
  const { isDark } = useThemeLogo();
  
  const sizes = {
    sm: { width: 90, height: 32, fontSize: 28 },
    md: { width: 120, height: 40, fontSize: 36 },
    lg: { width: 140, height: 48, fontSize: 42 }
  };
  
  const currentSize = sizes[size];
  
  const LogoSVG = (
    <svg
      width={currentSize.width}
      height={currentSize.height}
      viewBox={`0 0 ${currentSize.width} ${currentSize.height}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="cvly-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FF7A00" />
          <stop offset="100%" stopColor="#F97316" />
        </linearGradient>
        {isDark && (
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        )}
      </defs>
      
      {/* Background for dark mode */}
      {isDark && (
        <rect
          x="2"
          y="2"
          width={currentSize.width - 4}
          height={currentSize.height - 4}
          rx="8"
          fill="#0E0E0E"
          stroke="url(#cvly-gradient)"
          strokeWidth="1.5"
        />
      )}
      
      {/* Text */}
      <text
        x="50%"
        y="50%"
        dominantBaseline="middle"
        textAnchor="middle"
        fontFamily="Poppins, sans-serif"
        fontWeight="600"
        fontSize={currentSize.fontSize}
        letterSpacing="-0.02em"
        fill={isDark ? "url(#cvly-gradient)" : "url(#cvly-gradient)"}
        filter={isDark ? "url(#glow)" : undefined}
      >
        CVLY
      </text>
    </svg>
  );

  if (!animated) {
    return LogoSVG;
  }

  return (
    <motion.div
      className="inline-block cursor-pointer"
      whileHover={{ 
        scale: 1.05,
        filter: 'drop-shadow(0 0 10px rgba(255, 122, 0, 0.4))'
      }}
      initial={{
        filter: 'drop-shadow(0 0 0px rgba(255, 122, 0, 0))'
      }}
      transition={{ duration: 0.3 }}
    >
      {LogoSVG}
    </motion.div>
  );
};
