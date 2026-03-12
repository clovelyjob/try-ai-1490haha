import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { OfficialLogo } from '@/components/OfficialLogo';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Link } from 'react-router-dom';
import { Check, ArrowRight, ArrowLeft, Sparkles, Zap, Building2 } from 'lucide-react';

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
    }
  ];

  const faqs = [
    { q: '¿Puedo cancelar en cualquier momento?', a: 'Sí, puedes cancelar tu suscripción cuando quieras. Sin preguntas, sin penalizaciones.' },
    { q: '¿Qué métodos de pago aceptan?', a: 'Aceptamos todas las tarjetas principales (Visa, Mastercard, Amex) y PayPal.' },
    { q: '¿Hay descuento para estudiantes?', a: 'Sí, ofrecemos 50% de descuento para estudiantes con email .edu verificado.' },
    { q: '¿Qué incluye la prueba gratuita?', a: 'Acceso completo a todas las funciones Pro durante 7 días. Sin tarjeta requerida.' }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 backdrop-blur-xl bg-background/80 border-b border-border/40">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between max-w-6xl">
          <OfficialLogo size="md" to="/" />
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link to="/registro">
              <Button size="sm">Empieza gratis</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="py-20 sm:py-28">
        <div className="container mx-auto px-6 max-w-5xl text-center">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <p className="text-sm font-medium text-primary mb-4 uppercase tracking-wider">Precios</p>
            <h1 className="text-4xl sm:text-5xl font-bold mb-4 tracking-tight">
              Invierte en tu <span className="text-primary">futuro</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
              Elige el plan que se adapte a tus metas. Cambia o cancela cuando quieras.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="pb-24">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="grid lg:grid-cols-3 gap-6">
            {plans.map((plan, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
                className={plan.popular ? 'lg:-mt-4' : ''}
              >
                <Card className={`p-7 h-full relative border-border/40 transition-all duration-300 ${
                  plan.popular 
                    ? 'border-primary/40 shadow-clovely-lg ring-1 ring-primary/20' 
                    : 'hover:border-primary/20 hover:shadow-clovely-md'
                }`}>
                  {plan.popular && (
                    <div className="absolute -top-3 left-6 bg-primary text-primary-foreground px-3 py-1 text-xs font-medium rounded-full">
                      Más popular
                    </div>
                  )}
                  
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-5">
                    <plan.icon className="h-5 w-5 text-primary" />
                  </div>

                  <h3 className="text-xl font-bold mb-1">{plan.name}</h3>
                  <p className="text-sm text-muted-foreground mb-5">{plan.description}</p>
                  
                  <div className="flex items-baseline gap-1 mb-6">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="text-muted-foreground">{plan.period}</span>
                  </div>

                  <ul className="space-y-3 mb-7">
                    {plan.features.map((feature, j) => (
                      <li key={j} className="flex items-start gap-2.5">
                        <div className="mt-0.5 w-4 h-4 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <Check className="h-2.5 w-2.5 text-primary" />
                        </div>
                        <span className="text-sm text-foreground/80">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Link to={plan.href} className="block">
                    <Button 
                      className="w-full h-11 font-medium"
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

      {/* Trust */}
      <section className="py-16 border-y border-border/40 bg-muted/20">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="grid sm:grid-cols-3 gap-8 text-center">
            <div>
              <p className="text-3xl font-bold text-primary mb-1">10,000+</p>
              <p className="text-sm text-muted-foreground">Profesionales activos</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-primary mb-1">4.9/5</p>
              <p className="text-sm text-muted-foreground">Calificación promedio</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-primary mb-1">30 días</p>
              <p className="text-sm text-muted-foreground">Garantía de devolución</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-24">
        <div className="container mx-auto px-6 max-w-3xl">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-12 tracking-tight">
            Preguntas frecuentes
          </h2>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="p-5 rounded-xl bg-muted/30 border border-border/40 hover:border-primary/15 transition-colors"
              >
                <h3 className="font-semibold text-sm mb-1.5">{faq.q}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-primary text-primary-foreground">
        <div className="container mx-auto px-6 max-w-3xl text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 tracking-tight">
            ¿Listo para transformar tu carrera?
          </h2>
          <p className="text-lg opacity-85 mb-8">
            Únete a miles de profesionales que ya dieron el primer paso.
          </p>
          <Link to="/registro">
            <Button size="lg" className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 h-12 px-8 font-semibold">
              Empieza gratis hoy
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      <footer className="py-8 border-t border-border/40">
        <div className="container mx-auto px-6 text-center">
          <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-3.5 w-3.5" /> Volver al inicio
          </Link>
        </div>
      </footer>
    </div>
  );
};

export default Pricing;
