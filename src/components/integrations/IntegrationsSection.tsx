import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { LogoStrip } from './LogoStrip';
import { INTEGRATIONS } from '@/data/integrations';

export const IntegrationsSection = () => {
  const midPoint = Math.ceil(INTEGRATIONS.length / 2);
  const firstRow = INTEGRATIONS.slice(0, midPoint);
  const secondRow = INTEGRATIONS.slice(midPoint);

  return (
    <section className="relative py-20 sm:py-24 overflow-hidden">
      <div className="container mx-auto px-6 max-w-5xl relative">
        <div className="text-center mb-12 space-y-3">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
            Conecta con las mejores empresas
          </h2>
          <p className="text-sm text-muted-foreground max-w-lg mx-auto">
            Tu próximo trabajo está en empresas que contratan activamente
          </p>
        </div>

        <div className="rounded-2xl border border-border/50 p-8 sm:p-10 bg-card">
          <div className="space-y-6">
            <LogoStrip logos={firstRow} direction="normal" speed={40} />
            <LogoStrip logos={secondRow} direction="reverse" speed={40} />
          </div>
        </div>

        <div className="text-center mt-8">
          <Link 
            to="/registro"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary/80 transition-colors group"
          >
            Descubre oportunidades
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
};
