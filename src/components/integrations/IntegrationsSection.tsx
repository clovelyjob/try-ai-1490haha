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
    <section className="relative py-20 md:py-28 overflow-hidden">
      {/* Subtle gradient background */}
      <div className="absolute inset-0 bg-background/90 dark:bg-background/90 pointer-events-none" />
      
      <div className="container mx-auto px-6 max-w-6xl relative">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16 space-y-4">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground">
            Conecta con las mejores empresas
          </h2>
          <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
            Tu próximo trabajo está en empresas que contratan activamente
          </p>
        </div>

        {/* Logo Strips Container - Premium white card */}
        <div className="bg-white/80 dark:bg-card/50 backdrop-blur-sm rounded-3xl 
                        border border-border/50 p-8 md:p-12
                        shadow-clovely-lg hover:shadow-clovely-xl
                        transition-all duration-300">
          <div className="space-y-8">
            <LogoStrip logos={firstRow} direction="normal" speed={40} />
            <LogoStrip logos={secondRow} direction="reverse" speed={40} />
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-10">
          <Link 
            to="/registro"
            className="inline-flex items-center gap-2 text-sm md:text-base font-medium
                       text-primary hover:text-primary/80 
                       transition-colors duration-200 group"
          >
            Descubre oportunidades
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
};
