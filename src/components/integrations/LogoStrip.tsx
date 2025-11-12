import { motion, useAnimationControls } from 'framer-motion';
import { useEffect, useState } from 'react';
import type { Integration } from '@/data/integrations';
import { IntegrationBadge } from './IntegrationBadge';

interface LogoStripProps {
  logos: Integration[];
  direction?: 'normal' | 'reverse';
  speed?: number;
}

export const LogoStrip = ({ logos, direction = 'normal', speed = 40 }: LogoStripProps) => {
  const [isPaused, setIsPaused] = useState(false);
  const controls = useAnimationControls();

  // Duplicate logos for seamless loop
  const duplicatedLogos = [...logos, ...logos];

  useEffect(() => {
    if (isPaused) {
      controls.stop();
    } else {
      controls.start({
        x: direction === 'normal' ? ['0%', '-50%'] : ['-50%', '0%'],
        transition: {
          duration: speed,
          ease: 'linear',
          repeat: Infinity,
        },
      });
    }
  }, [isPaused, controls, direction, speed]);

  return (
    <div className="relative w-full overflow-hidden">
      {/* Fade masks */}
      <div className="absolute left-0 top-0 bottom-0 w-20 md:w-32 bg-gradient-to-r from-[#0B1220] to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-20 md:w-32 bg-gradient-to-l from-[#0B1220] to-transparent z-10 pointer-events-none" />

      <motion.div
        className="flex gap-8 md:gap-10 items-center"
        animate={controls}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {duplicatedLogos.map((logo, index) => (
          <IntegrationBadge
            key={`${logo.name}-${index}`}
            integration={logo}
          />
        ))}
      </motion.div>
    </div>
  );
};
