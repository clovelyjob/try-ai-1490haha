import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { LogoStrip } from './LogoStrip';
import { INTEGRATIONS } from '@/data/integrations';

export const IntegrationsSection = () => {
  // Split logos into two rows
  const midPoint = Math.ceil(INTEGRATIONS.length / 2);
  const firstRow = INTEGRATIONS.slice(0, midPoint);
  const secondRow = INTEGRATIONS.slice(midPoint);

  return (
    <section className="relative py-16 md:py-20 overflow-hidden">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Orange Panel */}
        <div className="rounded-3xl border-2 border-white p-8 md:p-10
                        bg-gradient-to-r from-[#FF7A00] to-[#F97316]
                        shadow-[0_0_25px_rgba(255,122,0,0.25)]">
          {/* Header */}
          <div className="text-center mb-8 md:mb-10 space-y-2">
            <h2 className="text-2xl md:text-3xl font-semibold text-[#0B0B0B]">
              No rompas tu flujo de trabajo
            </h2>
            <p className="text-base md:text-lg text-[#0B0B0B]/80 max-w-2xl mx-auto">
              Conecta tus herramientas favoritas y trabaja donde ya estás.
            </p>
          </div>

          {/* Logo Strips with oval effect */}
          <div className="space-y-6">
            <LogoStrip logos={firstRow} direction="normal" speed={40} />
            <LogoStrip logos={secondRow} direction="reverse" speed={40} />
          </div>

          {/* CTA */}
          <div className="text-center mt-8">
            <Link 
              to="/integrations"
              className="inline-flex items-center gap-2 text-sm md:text-base
                         text-[#0B0B0B] hover:text-[#0B0B0B]/80 underline-offset-4 hover:underline
                         transition-colors duration-200"
            >
              Explorar integraciones
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
