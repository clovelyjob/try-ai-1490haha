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
    <section className="relative py-16 md:py-20 overflow-hidden bg-[#0B0B0B]">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Orange Panel */}
        <div className="rounded-2xl border border-[#E66500] p-6 md:p-8
                        bg-gradient-to-br from-[#FF7A00] to-[#F97316]
                        shadow-[0_10px_30px_rgba(0,0,0,0.35)]">
          {/* Header */}
          <div className="text-center mb-8 md:mb-10 space-y-2">
            <h2 className="text-3xl md:text-4xl font-heading font-semibold text-black">
              No rompas tu flujo de trabajo
            </h2>
            <p className="text-base md:text-lg text-black/80 max-w-2xl mx-auto">
              Conecta tus herramientas favoritas y trabaja donde ya estás.
            </p>
          </div>

          {/* Logo Strips with oval effect */}
          <div className="space-y-6">
            <LogoStrip logos={firstRow} direction="normal" speed={20} scale={1.0} offset="0%" />
            <LogoStrip logos={secondRow} direction="reverse" speed={22} scale={0.98} offset="-25%" />
          </div>

          {/* CTA */}
          <div className="text-center mt-8">
            <Link 
              to="/integrations"
              className="inline-flex items-center gap-2 text-sm md:text-base
                         text-black hover:text-black/80 underline-offset-4 hover:underline
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
