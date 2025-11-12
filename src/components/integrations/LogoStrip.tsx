import { motion } from 'framer-motion';
import type { Integration } from '@/data/integrations';
import { IntegrationBadge } from './IntegrationBadge';

interface LogoStripProps {
  logos: Integration[];
  direction?: 'normal' | 'reverse';
  speed?: number;
}

export const LogoStrip = ({ 
  logos, 
  direction = 'normal', 
  speed = 40
}: LogoStripProps) => {
  // Double track for seamless infinite loop
  const doubleTrack = [...logos, ...logos];
  
  const animation = direction === 'normal' 
    ? { x: ['0%', '-50%'] } 
    : { x: ['-50%', '0%'] };

  return (
    <div 
      className="relative overflow-hidden"
      style={{
        WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)',
        maskImage: 'linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)',
      }}
    >
      <motion.div
        animate={animation}
        transition={{
          duration: speed,
          ease: 'linear',
          repeat: Infinity,
        }}
        className="flex gap-8 md:gap-10 items-center will-change-transform"
      >
        {doubleTrack.map((logo, index) => (
          <IntegrationBadge
            key={`${logo.name}-${index}`}
            integration={logo}
          />
        ))}
      </motion.div>
    </div>
  );
};
