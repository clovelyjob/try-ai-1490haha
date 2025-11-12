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
                 transition-transform duration-200 ease-out
                 hover:-translate-y-[1px]
                 group cursor-pointer flex-shrink-0"
      aria-label={integration.name}
    >
      {/* Halo naranja solo en hover, detrás del badge */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -inset-2 rounded-2xl -z-10
                   bg-[#FF7A00]/0 blur-[22px]
                   transition-colors duration-200
                   group-hover:bg-[#FF7A00]/30 hidden md:block"
      />

      {/* Marco blanco para el icono */}
      <div
        className="grid place-items-center
                   w-11 h-11 md:w-12 md:h-12
                   rounded-xl
                   bg-white
                   border border-slate-200
                   dark:border-slate-700/70
                   shadow-[0_2px_10px_rgba(0,0,0,0.06)]
                   dark:shadow-[0_2px_12px_rgba(0,0,0,0.35)]
                   transition-all duration-300
                   group-hover:border-[#FF7A00]/40"
      >
        <img
          src={error ? '/integrations/_fallback.svg' : integration.src}
          alt={`${integration.name} logo`}
          className="h-6 md:h-7 w-auto object-contain
                     opacity-95 drop-shadow-[0_0_8px_rgba(255,255,255,0.12)]"
          loading="lazy"
          onError={() => setError(true)}
        />
      </div>

      {/* Nombre a la derecha */}
      <span className="whitespace-nowrap font-semibold text-sm md:text-base
                       text-slate-800 dark:text-white/92">
        {integration.name}
      </span>
    </div>
  );
};
