import type { Integration } from '@/data/integrations';

interface IntegrationBadgeProps {
  integration: Integration;
}

export const IntegrationBadge = ({ integration }: IntegrationBadgeProps) => {
  return (
    <div
      className="inline-flex items-center gap-3 pr-3 md:pr-4
                 opacity-80 hover:opacity-100
                 transition-all duration-300 ease-out
                 hover:-translate-y-[1px]
                 hover:drop-shadow-[0_0_10px_rgba(255,122,0,0.35)]
                 group cursor-pointer flex-shrink-0"
      aria-label={integration.name}
    >
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
          src={integration.src}
          alt={`${integration.name} logo`}
          className="h-6 md:h-7 w-auto object-contain"
          loading="lazy"
        />
      </div>

      {/* Nombre a la derecha */}
      <span className="whitespace-nowrap font-semibold text-sm md:text-base
                       text-slate-800 dark:text-slate-200">
        {integration.name}
      </span>
    </div>
  );
};
