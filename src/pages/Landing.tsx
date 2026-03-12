import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Link } from 'react-router-dom';
import { Target, FileText, MessageSquare, ArrowRight, Star, Instagram, CheckCircle, Compass, BarChart3, Sparkles, Shield, TrendingUp, Users, ChevronRight } from 'lucide-react';
import { OfficialLogo } from '@/components/OfficialLogo';
import { IntegrationsSection } from '@/components/integrations/IntegrationsSection';

const Landing = () => {
  const easeOut = [0.22, 1, 0.36, 1] as [number, number, number, number];

  const benefits = [
    {
      icon: Compass,
      title: 'Diagnóstico IA',
      description: 'Descubre tu perfil profesional único con un análisis inteligente de tus fortalezas.',
      accent: 'from-primary/10 to-accent/50',
    },
    {
      icon: Target,
      title: 'Ruta personalizada',
      description: 'Un plan diseñado para ti basado en tus objetivos, habilidades y mercado actual.',
      accent: 'from-primary/10 to-primary/5',
    },
    {
      icon: FileText,
      title: 'CV optimizado con IA',
      description: 'Tu mejor versión profesional, lista para competir en el mercado laboral.',
      accent: 'from-accent/60 to-primary/10',
    },
    {
      icon: MessageSquare,
      title: 'Simulador de entrevistas',
      description: 'Practica con IA conversacional y llega preparado a cualquier entrevista.',
      accent: 'from-primary/5 to-accent/40',
    },
  ];

  const steps = [
    {
      number: '01',
      title: 'Sube tu CV o crea uno nuevo',
      description: 'Nuestro motor de IA analiza tu experiencia y habilidades en segundos.',
      icon: FileText,
    },
    {
      number: '02',
      title: 'Recibe tu ruta personalizada',
      description: 'Un plan de acción claro con microacciones diarias para avanzar.',
      icon: TrendingUp,
    },
    {
      number: '03',
      title: 'Conecta con oportunidades',
      description: 'Encuentra ofertas que realmente encajan con tu perfil y objetivos.',
      icon: Sparkles,
    },
  ];

  const testimonials = [
    {
      name: 'Ana M.',
      role: 'Contadora → UX Designer',
      text: 'En 3 meses conseguí mi primer trabajo en UX. Clovely me dio la claridad que necesitaba.',
      rating: 5,
    },
    {
      name: 'Carlos R.',
      role: 'Aumento salarial 40%',
      text: 'Solo seguí el plan paso a paso. Los resultados fueron increíbles.',
      rating: 5,
    },
    {
      name: 'María F.',
      role: 'Recién graduada',
      text: 'Recibí 3 ofertas laborales. El simulador de entrevistas me dio mucha confianza.',
      rating: 5,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 backdrop-blur-xl bg-background/80 border-b border-border/40">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between max-w-6xl">
          <OfficialLogo size="md" to="/" />
          <div className="hidden md:flex items-center gap-8">
            <Link to="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Nosotros</Link>
            <Link to="/pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Precios</Link>
            <Link to="/blog" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Blog</Link>
            <Link to="/help" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Ayuda</Link>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link to="/login" className="hidden sm:block">
              <Button variant="ghost" size="sm" className="text-sm">
                Iniciar sesión
              </Button>
            </Link>
            <Link to="/registro">
              <Button size="sm" className="text-sm font-medium px-5">
                Empieza gratis
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero — asymmetric, editorial layout */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{
          background: 'radial-gradient(ellipse 80% 50% at 50% -20%, hsl(var(--primary) / 0.06), transparent)'
        }} />
        
        <div className="container mx-auto px-6 pt-20 pb-12 sm:pt-28 sm:pb-20 max-w-6xl relative">
          <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-16 items-center">
            {/* Left: Copy */}
            <div className="space-y-8">
              <motion.div 
                initial={{ opacity: 0, y: 12 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ delay: 0.1, duration: 0.5, ease: easeOut }}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-sm text-primary font-medium"
              >
                <Sparkles className="h-3.5 w-3.5" />
                <span>Más de 10,000 profesionales activos</span>
              </motion.div>

              <motion.h1 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ delay: 0.2, duration: 0.7, ease: easeOut }}
                className="text-4xl sm:text-5xl lg:text-[3.5rem] font-bold leading-[1.08] tracking-tight"
              >
                Encuentra el trabajo
                <br />
                <span className="text-primary">que realmente mereces</span>
              </motion.h1>

              <motion.p 
                initial={{ opacity: 0, y: 12 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ delay: 0.35, duration: 0.6, ease: easeOut }}
                className="text-lg text-muted-foreground max-w-lg leading-relaxed"
              >
                Clovely analiza tu perfil, diseña tu ruta ideal y te conecta con oportunidades que realmente encajan contigo.
              </motion.p>

              <motion.div 
                initial={{ opacity: 0, y: 12 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ delay: 0.5, duration: 0.5, ease: easeOut }}
                className="flex flex-col sm:flex-row gap-3 pt-1"
              >
                <Link to="/guest-start">
                  <Button size="lg" className="text-base px-8 h-12 font-semibold group">
                    Sube tu CV y encuentra trabajo
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                  </Button>
                </Link>
                <Link to="/login">
                  <Button variant="outline" size="lg" className="text-base px-8 h-12">
                    Iniciar sesión
                  </Button>
                </Link>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                transition={{ delay: 0.7, duration: 0.5 }}
                className="flex items-center gap-5 text-sm text-muted-foreground"
              >
                <span className="flex items-center gap-1.5">
                  <CheckCircle className="h-3.5 w-3.5 text-primary" />
                  7 días gratis
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle className="h-3.5 w-3.5 text-primary" />
                  Sin tarjeta
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle className="h-3.5 w-3.5 text-primary" />
                  Cancela cuando quieras
                </span>
              </motion.div>
            </div>

            {/* Right: Video Demo */}
            <motion.div 
              initial={{ opacity: 0, y: 24, scale: 0.98 }} 
              animate={{ opacity: 1, y: 0, scale: 1 }} 
              transition={{ delay: 0.4, duration: 0.8, ease: easeOut }}
            >
              <div className="rounded-2xl overflow-hidden border border-border/60 shadow-clovely-lg bg-card">
                <video autoPlay loop muted playsInline className="w-full h-auto">
                  <source src="/clovely-hero-video.mp4" type="video/mp4" />
                </video>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Integrations */}
      <IntegrationsSection />

      {/* Benefits — bento-style grid */}
      <section className="py-24 sm:py-32">
        <div className="container mx-auto px-6 max-w-6xl">
          <motion.div 
            initial={{ opacity: 0 }} 
            whileInView={{ opacity: 1 }} 
            viewport={{ once: true }} 
            transition={{ duration: 0.6 }}
            className="max-w-2xl mb-16"
          >
            <p className="text-sm font-medium text-primary mb-3 uppercase tracking-wider">Herramientas</p>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
              Todo lo que necesitas para avanzar
            </h2>
            <p className="text-lg text-muted-foreground">
              Cuatro herramientas inteligentes trabajando juntas para tu éxito profesional.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 gap-4">
            {benefits.map((benefit, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, y: 16 }} 
                whileInView={{ opacity: 1, y: 0 }} 
                viewport={{ once: true }} 
                transition={{ delay: i * 0.06, duration: 0.5 }}
              >
                <Card className={`p-8 h-full border-border/40 hover:border-primary/25 hover:shadow-clovely-md transition-all duration-300 group bg-gradient-to-br ${benefit.accent}`}>
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary/15 transition-colors">
                    <benefit.icon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
                    {benefit.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {benefit.description}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works — timeline-inspired */}
      <section className="py-24 sm:py-32 border-y border-border/40 bg-muted/20">
        <div className="container mx-auto px-6 max-w-6xl">
          <motion.div 
            initial={{ opacity: 0 }} 
            whileInView={{ opacity: 1 }} 
            viewport={{ once: true }}
            className="max-w-2xl mb-16"
          >
            <p className="text-sm font-medium text-primary mb-3 uppercase tracking-wider">Proceso</p>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
              Cómo funciona
            </h2>
            <p className="text-lg text-muted-foreground">
              Tres pasos simples para transformar tu carrera.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 16 }} 
                whileInView={{ opacity: 1, y: 0 }} 
                viewport={{ once: true }} 
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="relative group"
              >
                <div className="flex items-start gap-5">
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                      <step.icon className="h-5 w-5 text-primary group-hover:text-primary-foreground transition-colors" />
                    </div>
                    {i < steps.length - 1 && (
                      <div className="hidden md:block w-px h-full bg-border/60 mt-3" />
                    )}
                  </div>
                  <div className="flex-1 pb-8">
                    <span className="text-xs font-mono text-primary/60 mb-1 block">{step.number}</span>
                    <h3 className="font-semibold text-lg mb-2">{step.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{step.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Social proof — metrics strip */}
      <section className="py-16 sm:py-20">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 text-center">
            {[
              { value: '10K+', label: 'Usuarios activos' },
              { value: '87%', label: 'Consiguen empleo' },
              { value: '4.9', label: 'Rating promedio' },
              { value: '15', label: 'Países' },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
              >
                <p className="text-3xl sm:text-4xl font-bold text-primary mb-1">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 sm:py-32 border-y border-border/40 bg-muted/20">
        <div className="container mx-auto px-6 max-w-6xl">
          <motion.div 
            initial={{ opacity: 0 }} 
            whileInView={{ opacity: 1 }} 
            viewport={{ once: true }}
            className="max-w-2xl mb-16"
          >
            <p className="text-sm font-medium text-primary mb-3 uppercase tracking-wider">Testimonios</p>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
              Historias de éxito
            </h2>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, y: 16 }} 
                whileInView={{ opacity: 1, y: 0 }} 
                viewport={{ once: true }} 
                transition={{ delay: i * 0.08, duration: 0.5 }}
              >
                <Card className="p-7 h-full border-border/40 hover:border-primary/20 hover:shadow-clovely-md transition-all duration-300">
                  <div className="flex gap-0.5 mb-5">
                    {Array.from({ length: testimonial.rating }).map((_, j) => (
                      <Star key={j} className="h-4 w-4 fill-primary text-primary" />
                    ))}
                  </div>
                  <p className="text-sm mb-6 leading-relaxed text-foreground/90">
                    &ldquo;{testimonial.text}&rdquo;
                  </p>
                  <div className="border-t border-border/40 pt-4">
                    <p className="font-semibold text-sm">{testimonial.name}</p>
                    <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 sm:py-32 bg-primary text-primary-foreground relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.07]">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)',
            backgroundSize: '32px 32px',
          }} />
        </div>
        
        <div className="container mx-auto px-6 text-center max-w-3xl relative">
          <motion.div 
            initial={{ opacity: 0, y: 24 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            viewport={{ once: true }} 
            transition={{ duration: 0.7 }}
            className="space-y-6"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight tracking-tight">
              Empieza hoy y transforma tu carrera
            </h2>
            <p className="text-lg opacity-90 max-w-xl mx-auto">
              Únete a miles de profesionales que ya encontraron su camino ideal.
            </p>
            <div className="pt-2">
              <Link to="/guest-start">
                <Button 
                  size="lg" 
                  className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 text-base px-10 h-12 font-semibold"
                >
                  Empieza gratis
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
            <p className="text-sm opacity-70 pt-2">
              7 días gratis · Sin compromiso · Cancela cuando quieras
            </p>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-border/40">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="grid sm:grid-cols-[1fr_auto] gap-8 items-start">
            <div className="space-y-4">
              <OfficialLogo size="md" animated={false} />
              <p className="text-sm text-muted-foreground max-w-xs">
                La plataforma de carrera profesional impulsada por IA.
              </p>
            </div>
            <div className="flex flex-wrap gap-x-8 gap-y-3 text-sm text-muted-foreground">
              <Link to="/pricing" className="hover:text-foreground transition-colors">Precios</Link>
              <Link to="/about" className="hover:text-foreground transition-colors">Nosotros</Link>
              <Link to="/blog" className="hover:text-foreground transition-colors">Blog</Link>
              <Link to="/help" className="hover:text-foreground transition-colors">Ayuda</Link>
              <Link to="/privacy" className="hover:text-foreground transition-colors">Privacidad</Link>
              <Link to="/terms" className="hover:text-foreground transition-colors">Términos</Link>
            </div>
          </div>
          <div className="flex items-center justify-between mt-10 pt-6 border-t border-border/30">
            <p className="text-xs text-muted-foreground">
              © 2025 Clovely. Todos los derechos reservados.
            </p>
            <a 
              href="https://www.instagram.com/clovelyia" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Instagram"
            >
              <Instagram className="h-4 w-4" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
