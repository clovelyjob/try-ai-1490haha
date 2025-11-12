import { motion, useAnimationControls } from 'framer-motion';
import { useEffect, useState } from 'react';
import type { Integration } from '@/data/integrations';

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
        className="flex gap-12 md:gap-16 items-center"
        animate={controls}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {duplicatedLogos.map((logo, index) => (
          <div
            key={`${logo.name}-${index}`}
            className="flex-shrink-0 group cursor-pointer"
          >
            <img
              src={logo.src}
              alt={`${logo.name} logo`}
              className="h-10 md:h-12 w-auto opacity-70 hover:opacity-100 transition-all duration-300 
                         filter grayscale hover:grayscale-0
                         group-hover:scale-110 group-hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]"
              loading="lazy"
            />
          </div>
        ))}
      </motion.div>
    </div>
  );
};
