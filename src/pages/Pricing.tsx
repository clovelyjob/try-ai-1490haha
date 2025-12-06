import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { OfficialLogo } from '@/components/OfficialLogo';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Link } from 'react-router-dom';
import { Check, ArrowRight, Sparkles, Zap, Building2 } from 'lucide-react';

const Pricing = () => {
  const plans = [
    {
      name: 'Starter',
      icon: Zap,
      price: '$0',
      period: '/mes',
      description: 'Para explorar tu potencial',
      features: [
        'Diagnóstico RIASEC completo',
        '1 CV profesional',
        '5 simulaciones de entrevista',
        'Acceso a oportunidades básicas',
        'Exportación PDF'
      ],
      cta: 'Empezar gratis',
      href: '/registro',
      popular: false,
      gradient: 'from-gray-500 to-gray-600'
    },
    {
      name: 'Pro',
      icon: Sparkles,
      price: '$19',
      period: '/mes',
      description: 'Para profesionales ambiciosos',
      features: [
        'Todo en Starter',
        'CVs ilimitados',
        'Simulaciones ilimitadas',
        'Coach IA personalizado 24/7',
        'Análisis profundo con IA',
        'Acceso prioritario a oportunidades',
        'Plantillas premium exclusivas',
        'Soporte prioritario'
      ],
      cta: 'Prueba 7 días gratis',
      href: '/registro',
      popular: true,
      gradient: 'from-primary to-primary-warm'
    },
    {
      name: 'Enterprise',
      icon: Building2,
      price: 'Custom',
      period: '',
      description: 'Para equipos y organizaciones',
      features: [
        'Todo en Pro',
        'Usuarios ilimitados',
        'Panel de administración',
        'Integraciones API',
        'SSO & seguridad avanzada',
        'Onboarding dedicado',
        'Account manager personal',
        'SLA garantizado'
      ],
      cta: 'Contactar ventas',
      href: '/help',
      popular: false,
      gradient: 'from-blue-500 to-indigo-600'
    }
  ];

  const faqs = [
    {
      q: '¿Puedo cancelar en cualquier momento?',
      a: 'Sí, puedes cancelar tu suscripción cuando quieras. Sin preguntas, sin penalizaciones.'
    },
    {
      q: '¿Qué métodos de pago aceptan?',
      a: 'Aceptamos todas las tarjetas principales (Visa, Mastercard, Amex) y PayPal.'
    },
    {
      q: '¿Hay descuento para estudiantes?',
      a: 'Sí, ofrecemos 50% de descuento para estudiantes con email .edu verificado.'
    },
    {
      q: '¿Qué incluye la prueba gratuita?',
      a: 'Acceso completo a todas las funciones Pro durante 7 días. Sin tarjeta requerida.'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50/30 via-background to-background dark:from-gray-900/50">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 backdrop-blur-xl bg-background/70 border-b border-border/50">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between max-w-7xl">
          <OfficialLogo size="lg" to="/" />
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Link to="/registro">
              <Button size="sm">Empieza gratis</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="py-24 md:py-32">
        <div className="container mx-auto px-6 max-w-6xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              Precios simples y transparentes
            </span>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-heading font-bold mb-6 tracking-tight">
              Invierte en tu{' '}
              <span className="text-primary">futuro</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Elige el plan que se adapte a tus metas. Cambia o cancela cuando quieras.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="pb-24">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="grid lg:grid-cols-3 gap-8">
            {plans.map((plan, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                className={plan.popular ? 'lg:-mt-8' : ''}
              >
                <Card className={`p-8 h-full relative overflow-hidden transition-all duration-300 hover:shadow-2xl ${
                  plan.popular 
                    ? 'border-primary shadow-xl ring-2 ring-primary/20' 
                    : 'hover:border-primary/50'
                }`}>
                  {plan.popular && (
                    <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-4 py-1 text-sm font-medium rounded-bl-xl">
                      Más popular
                    </div>
                  )}
                  
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${plan.gradient} flex items-center justify-center mb-6`}>
                    <plan.icon className="h-7 w-7 text-white" />
                  </div>

                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <p className="text-muted-foreground mb-6">{plan.description}</p>
                  
                  <div className="flex items-baseline gap-1 mb-8">
                    <span className="text-5xl font-bold">{plan.price}</span>
                    <span className="text-muted-foreground text-lg">{plan.period}</span>
                  </div>

                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature, j) => (
                      <li key={j} className="flex items-start gap-3">
                        <div className="mt-1 w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <Check className="h-3 w-3 text-primary" />
                        </div>
                        <span className="text-foreground/80">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Link to={plan.href} className="block">
                    <Button 
                      className={`w-full h-12 text-base font-semibold ${plan.popular ? '' : ''}`}
                      variant={plan.popular ? 'default' : 'outline'}
                    >
                      {plan.cta}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust badges */}
      <section className="py-16 border-y border-border/50 bg-muted/30">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="grid sm:grid-cols-3 gap-8 text-center">
            <div>
              <p className="text-4xl font-bold text-primary mb-2">10,000+</p>
              <p className="text-muted-foreground">Profesionales activos</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-primary mb-2">4.9/5</p>
              <p className="text-muted-foreground">Calificación promedio</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-primary mb-2">30 días</p>
              <p className="text-muted-foreground">Garantía de devolución</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-24">
        <div className="container mx-auto px-6 max-w-3xl">
          <h2 className="text-3xl sm:text-4xl font-heading font-bold text-center mb-12">
            Preguntas frecuentes
          </h2>
          <div className="space-y-6">
            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-6 rounded-2xl bg-muted/50 hover:bg-muted transition-colors"
              >
                <h3 className="font-semibold text-lg mb-2">{faq.q}</h3>
                <p className="text-muted-foreground">{faq.a}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-primary text-primary-foreground">
        <div className="container mx-auto px-6 max-w-4xl text-center">
          <h2 className="text-3xl sm:text-4xl font-heading font-bold mb-6">
            ¿Listo para transformar tu carrera?
          </h2>
          <p className="text-xl opacity-90 mb-8">
            Únete a miles de profesionales que ya dieron el primer paso.
          </p>
          <Link to="/registro">
            <Button size="lg" variant="secondary" className="text-lg px-8 py-6 font-semibold">
              Empieza gratis hoy
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t">
        <div className="container mx-auto px-6 text-center">
          <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
            ← Volver al inicio
          </Link>
        </div>
      </footer>
    </div>
  );
};

export default Pricing;
