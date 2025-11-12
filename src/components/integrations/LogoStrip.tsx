import { motion } from 'framer-motion';
import type { Integration } from '@/data/integrations';
import { IntegrationBadge } from './IntegrationBadge';

interface LogoStripProps {
  logos: Integration[];
  direction?: 'normal' | 'reverse';
  speed?: number;
  scale?: number;
  offset?: string;
}

export const LogoStrip = ({ 
  logos, 
  direction = 'normal', 
  speed = 40,
  scale = 1,
  offset = '0%'
}: LogoStripProps) => {
  // Triple track for seamless infinite loop
  const tripleTrack = [...logos, ...logos, ...logos];
  
  const animation = direction === 'normal' 
    ? { x: [offset, '-66.66%'] } 
    : { x: [offset, '0%'] };

  return (
    <div 
      className="relative overflow-hidden"
      style={{
        WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)',
        maskImage: 'linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)',
      }}
    >
      <motion.div
        style={{ 
          transformOrigin: 'center left',
          scale 
        }}
        initial={{ x: offset }}
        animate={animation}
        transition={{
          duration: speed,
          ease: 'linear',
          repeat: Infinity,
        }}
        className="flex gap-8 md:gap-10 items-center will-change-transform"
      >
        {tripleTrack.map((logo, index) => (
          <IntegrationBadge
            key={`${logo.name}-${index}`}
            integration={logo}
          />
        ))}
      </motion.div>
    </div>
  );
};
