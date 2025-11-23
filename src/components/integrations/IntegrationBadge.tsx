import { useState } from 'react';
import type { Integration } from '@/data/integrations';

interface IntegrationBadgeProps {
  integration: Integration;
}

export const IntegrationBadge = ({ integration }: IntegrationBadgeProps) => {
  const [error, setError] = useState(false);

  return (
    <div
      className="relative inline-flex items-center gap-3 pr-3 md:pr-4
                 transition-all duration-300 ease-out
                 hover:-translate-y-[2px]
                 group cursor-pointer flex-shrink-0"
      aria-label={integration.name}
    >
      {/* Subtle glow on hover */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -inset-2 rounded-2xl -z-10
                   opacity-0 group-hover:opacity-100
                   bg-gradient-to-r from-primary/10 to-primary/5
                   blur-xl transition-opacity duration-300"
      />

      {/* Icon container with premium styling */}
      <div
        className="grid place-items-center
                   w-11 h-11 md:w-12 md:h-12
                   rounded-xl
                   bg-background dark:bg-card
                   border border-border
                   shadow-sm
                   transition-all duration-300
                   group-hover:border-primary/30
                   group-hover:shadow-md
                   group-hover:scale-105"
      >
        <img
          src={error ? '/integrations/_fallback.svg' : integration.src}
          alt={`${integration.name} logo`}
          className="h-6 md:h-7 w-auto object-contain transition-transform duration-300 group-hover:scale-110"
          loading="lazy"
          onError={() => setError(true)}
        />
      </div>

      {/* Company name */}
      <span className="whitespace-nowrap font-semibold text-sm md:text-base text-foreground
                       transition-colors duration-300 group-hover:text-primary">
        {integration.name}
      </span>
    </div>
  );
};
