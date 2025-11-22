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
                   shadow-[0_2px_8px_rgba(0,0,0,0.04)]
                   transition-all duration-300
                   group-hover:border-[#FF7A00]/40
                   group-hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)]"
      >
        <img
          src={integration.src}
          alt={`${integration.name} logo`}
          className="h-10 md:h-12 w-auto object-contain"
          loading="lazy"
        />
      </div>

      {/* Nombre a la derecha */}
      <span className="whitespace-nowrap font-semibold text-sm md:text-base text-[#0B0B0B]">
        {integration.name}
      </span>
    </div>
  );
};
