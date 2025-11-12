import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LogoStrip } from './LogoStrip';
import { INTEGRATIONS } from '@/data/integrations';

export const IntegrationsSection = () => {
  // Split logos into two rows
  const midPoint = Math.ceil(INTEGRATIONS.length / 2);
  const firstRow = INTEGRATIONS.slice(0, midPoint);
  const secondRow = INTEGRATIONS.slice(midPoint);

  return (
    <section className="relative py-20 md:py-24 overflow-hidden bg-[#0B1220]">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12 space-y-4">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-white">
            No rompas tu flujo de trabajo
          </h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Conecta tus herramientas favoritas y trabaja donde ya estás.
          </p>
        </div>

        {/* Logo Strips */}
        <div className="space-y-8 mb-12">
          <LogoStrip logos={firstRow} direction="normal" speed={38} />
          <LogoStrip logos={secondRow} direction="reverse" speed={42} />
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link to="/integrations">
            <Button
              variant="outline"
              size="lg"
              className="gap-2 bg-white/10 hover:bg-white/20 text-white border-white/20 hover:border-white/40 backdrop-blur-sm"
              aria-label="Explorar todas las integraciones disponibles"
            >
              Explorar integraciones
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};
