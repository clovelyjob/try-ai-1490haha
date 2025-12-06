import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { OfficialLogo } from '@/components/OfficialLogo';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Link } from 'react-router-dom';
import { Check, ArrowRight } from 'lucide-react';

const Pricing = () => {
  const plans = [
    {
      name: 'Gratis',
      price: '$0',
      period: '/mes',
      description: 'Perfecto para empezar',
      features: [
        'Diagnóstico de carrera básico',
        '1 CV optimizado',
        '3 simulaciones de entrevista',
        'Acceso a oportunidades limitadas'
      ],
      cta: 'Empezar gratis',
      popular: false
    },
    {
      name: 'Pro',
      price: '$19',
      period: '/mes',
      description: 'Para profesionales serios',
      features: [
        'Diagnóstico completo RIASEC',
        'CVs ilimitados',
        'Simulaciones ilimitadas',
        'Acceso a todas las oportunidades',
        'Coach IA personalizado',
        'Análisis de CV con IA'
      ],
      cta: 'Prueba 7 días gratis',
      popular: true
    },
    {
      name: 'Enterprise',
      price: 'Contacto',
      period: '',
      description: 'Para equipos y empresas',
      features: [
        'Todo en Pro',
        'Usuarios ilimitados',
        'Panel de administración',
        'Integraciones personalizadas',
        'Soporte prioritario',
        'Onboarding dedicado'
      ],
      cta: 'Contactar ventas',
      popular: false
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <nav className="sticky top-0 z-50 backdrop-blur-xl bg-background/70 border-b border-border/50">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between max-w-7xl">
          <OfficialLogo size="lg" to="/" />
          <ThemeToggle />
        </div>
      </nav>

      <div className="container mx-auto px-6 py-20 max-w-6xl">
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-heading font-bold mb-4">
            Planes simples, sin sorpresas
          </h1>
          <p className="text-xl text-muted-foreground">
            Elige el plan que mejor se adapte a tus necesidades
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan, i) => (
            <Card 
              key={i} 
              className={`p-8 relative ${plan.popular ? 'border-primary shadow-lg scale-105' : ''}`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-medium">
                  Más popular
                </div>
              )}
              <div className="mb-6">
                <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground">{plan.period}</span>
                </div>
                <p className="text-muted-foreground mt-2">{plan.description}</p>
              </div>
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, j) => (
                  <li key={j} className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-primary" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Link to="/registro">
                <Button 
                  className="w-full" 
                  variant={plan.popular ? 'default' : 'outline'}
                >
                  {plan.cta}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Pricing;
