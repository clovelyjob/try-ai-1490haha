import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Link } from 'react-router-dom';
import { Sparkles, Target, FileText, MessageSquare, Zap, CheckCircle2, ArrowRight, Star } from 'lucide-react';
import { OfficialLogo } from '@/components/OfficialLogo';
import { IntegrationsSection } from '@/components/integrations/IntegrationsSection';
const Landing = () => {
  const benefits = [{
    icon: Sparkles,
    title: 'Diagnóstico IA',
    description: 'Descubre tu perfil profesional único'
  }, {
    icon: Target,
    title: 'Ruta personalizada',
    description: 'Un plan diseñado específicamente para ti'
  }, {
    icon: FileText,
    title: 'CV optimizado con IA',
    description: 'Tu mejor versión, lista para competir'
  }, {
    icon: MessageSquare,
    title: 'Simulador de entrevistas',
    description: 'Practica con IA, llega preparado'
  }];
  const transformations = [{
    stat: '10 min',
    label: 'Descubre tu potencial',
    description: 'Diagnóstico completo'
  }, {
    stat: 'Tu plan',
    label: 'IA diseña tu ruta',
    description: 'Personalizado a tu medida'
  }, {
    stat: '30 días',
    label: 'Primeros resultados',
    description: 'Progreso constante'
  }];
  const testimonials = [{
    name: 'Ana M.',
    role: 'Contadora → UX Designer',
    text: 'En 3 meses conseguí mi primer trabajo en UX',
    rating: 5
  }, {
    name: 'Carlos R.',
    role: 'Aumento salarial 40%',
    text: 'Solo seguí el plan, funcionó perfectamente',
    rating: 5
  }, {
    name: 'María F.',
    role: 'Recién graduada',
    text: 'Recibí 3 ofertas, el simulador me dio confianza',
    rating: 5
  }];
  return <div className="min-h-screen bg-gradient-to-b from-blue-50/50 via-orange-50/30 to-white dark:from-gray-900 dark:via-gray-800 dark:to-background">
      {/* Navbar - Ultra limpio */}
      <nav className="sticky top-0 z-50 backdrop-blur-xl bg-white/70 dark:bg-background/70 border-b border-border/50">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between max-w-7xl">
          <OfficialLogo size="lg" to="/" />
          
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Link to="/login" className="hidden sm:block">
              <Button variant="ghost" size="sm" className="text-sm font-medium">
                Iniciar sesión
              </Button>
            </Link>
            <Link to="/registro">
              <Button size="sm" className="gradient-orange text-white text-sm font-semibold px-6 hover:shadow-lg transition-all">
                Empieza gratis
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero - Impacto inmediato */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-100/40 via-orange-100/30 to-transparent dark:from-blue-950/20 dark:via-orange-950/10 pointer-events-none" />
        
        <div className="container mx-auto px-6 py-32 md:py-40 max-w-6xl relative">
          <motion.div initial={{
          opacity: 0,
          y: 30
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.8,
          ease: 'easeOut'
        }} className="text-center space-y-8">
            {/* Badge */}
            <motion.div initial={{
            opacity: 0,
            scale: 0.9
          }} animate={{
            opacity: 1,
            scale: 1
          }} transition={{
            delay: 0.2,
            duration: 0.5
          }} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-gray-800 border border-primary/20 text-sm font-medium text-foreground shadow-sm">
              <Star className="h-4 w-4 text-primary fill-primary" />
              <span>Más de 10,000 profesionales</span>
            </motion.div>

            {/* Hero Title */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-heading font-bold leading-tight tracking-tight">
              Encuentra el trabajo que{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-orange-600">
                realmente mereces
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-xl sm:text-2xl text-muted-foreground max-w-3xl mx-auto font-light leading-relaxed">
              Con Clovely, tu potencial deja de ser invisible: la IA te analiza, te muestra tu camino ideal y te conecta con oportunidades que realmente encajan contigo.
            </p>

            {/* Video Demo */}
            <motion.div initial={{
            opacity: 0,
            y: 30
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            delay: 0.3,
            duration: 0.8
          }} className="max-w-6xl mx-auto px-4">
              <div className="relative rounded-3xl overflow-hidden bg-white dark:bg-gray-900 p-2 shadow-[0_20px_70px_-15px_rgba(0,0,0,0.3)] dark:shadow-[0_20px_70px_-15px_rgba(0,0,0,0.6)]">
                <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
                  <video autoPlay loop muted playsInline className="w-full h-auto">
                    <source src="/clovely-hero-video.mp4" type="video/mp4" />
                    Tu navegador no soporta el elemento de video.
                  </video>
                </div>
              </div>
            </motion.div>

            {/* CTA */}
            <motion.div initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            delay: 0.4,
            duration: 0.6
          }} className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
              <Link to="/guest-start" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto text-lg px-10 py-7 gradient-orange text-white font-semibold rounded-xl hover:shadow-2xl hover:scale-105 transition-all duration-300">
                  Sube tu CV y encuentra trabajo
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </motion.div>

            {/* Trust indicator */}
            <p className="text-sm text-muted-foreground pt-4">
              ✨ 7 días gratis • Sin tarjeta • Cancela cuando quieras
            </p>
          </motion.div>
        </div>
      </section>

      {/* Integrations */}
      <IntegrationsSection />

      {/* Por qué Clovely - Minimalista */}
      <section className="py-32 bg-white dark:bg-background">
        <div className="container mx-auto px-6 max-w-4xl">
          <motion.div initial={{
          opacity: 0
        }} whileInView={{
          opacity: 1
        }} viewport={{
          once: true
        }} transition={{
          duration: 0.8
        }} className="space-y-12 text-center">
            <h2 className="text-4xl sm:text-5xl font-heading font-bold tracking-tight">
              Por qué miles aman Clovely
            </h2>
            
            <div className="space-y-6 text-2xl sm:text-3xl font-light text-muted-foreground">
              <motion.p initial={{
              opacity: 0,
              y: 20
            }} whileInView={{
              opacity: 1,
              y: 0
            }} viewport={{
              once: true
            }} transition={{
              delay: 0.1
            }} className="hover:text-foreground transition-colors cursor-default">
                Porque sienten claridad.
              </motion.p>
              <motion.p initial={{
              opacity: 0,
              y: 20
            }} whileInView={{
              opacity: 1,
              y: 0
            }} viewport={{
              once: true
            }} transition={{
              delay: 0.2
            }} className="hover:text-foreground transition-colors cursor-default">
                Porque dejan de adivinar.
              </motion.p>
              <motion.p initial={{
              opacity: 0,
              y: 20
            }} whileInView={{
              opacity: 1,
              y: 0
            }} viewport={{
              once: true
            }} transition={{
              delay: 0.3
            }} className="hover:text-foreground transition-colors cursor-default">
                Porque ven resultados reales.
              </motion.p>
              <motion.p initial={{
              opacity: 0,
              y: 20
            }} whileInView={{
              opacity: 1,
              y: 0
            }} viewport={{
              once: true
            }} transition={{
              delay: 0.4
            }} className="text-primary font-semibold text-4xl mt-8">
                Porque funciona.
              </motion.p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Benefits - Cards premium */}
      <section className="py-32 bg-gradient-to-b from-gray-50/50 to-white dark:from-gray-900/50 dark:to-background">
        <div className="container mx-auto px-6 max-w-6xl">
          <motion.div initial={{
          opacity: 0
        }} whileInView={{
          opacity: 1
        }} viewport={{
          once: true
        }} transition={{
          duration: 0.6
        }}>
            <h2 className="text-4xl sm:text-5xl font-heading font-bold text-center mb-6 tracking-tight">
              Todo lo que necesitas
            </h2>
            <p className="text-center text-xl text-muted-foreground mb-16 max-w-2xl mx-auto">
              Cuatro herramientas poderosas trabajando juntas
            </p>
            
            <div className="grid md:grid-cols-2 gap-8">
              {benefits.map((benefit, i) => <motion.div key={i} initial={{
              opacity: 0,
              y: 30
            }} whileInView={{
              opacity: 1,
              y: 0
            }} viewport={{
              once: true
            }} transition={{
              delay: i * 0.1,
              duration: 0.6
            }}>
                  <Card className="p-10 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 bg-white dark:bg-gray-800/50 border-gray-200/50 dark:border-gray-700/50 group cursor-pointer h-full">
                    <div className="w-16 h-16 rounded-2xl gradient-orange flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg">
                      <benefit.icon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="font-heading font-bold text-2xl mb-3 group-hover:text-primary transition-colors">
                      {benefit.title}
                    </h3>
                    <p className="text-muted-foreground text-lg">
                      {benefit.description}
                    </p>
                  </Card>
                </motion.div>)}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Transformación - Timeline style */}
      <section className="py-32 bg-white dark:bg-background">
        <div className="container mx-auto px-6 max-w-6xl">
          <motion.div initial={{
          opacity: 0
        }} whileInView={{
          opacity: 1
        }} viewport={{
          once: true
        }} transition={{
          duration: 0.6
        }}>
            <h2 className="text-4xl sm:text-5xl font-heading font-bold text-center mb-6 tracking-tight">
              Tu transformación en 30 días
            </h2>
            <p className="text-center text-xl text-muted-foreground mb-20 max-w-2xl mx-auto">
              Así es como Clovely te lleva de donde estás a donde quieres estar
            </p>
            
            <div className="grid md:grid-cols-3 gap-12">
              {transformations.map((item, i) => <motion.div key={i} initial={{
              opacity: 0,
              scale: 0.9
            }} whileInView={{
              opacity: 1,
              scale: 1
            }} viewport={{
              once: true
            }} transition={{
              delay: i * 0.15,
              duration: 0.5
            }} className="text-center space-y-4">
                  <div className="relative inline-block">
                    <div className="text-6xl font-heading font-bold text-primary">
                      {item.stat}
                    </div>
                    <div className="absolute -inset-4 bg-gradient-to-r from-orange-500/10 to-orange-600/10 blur-xl -z-10 rounded-full" />
                  </div>
                  <h3 className="text-2xl font-heading font-semibold">
                    {item.label}
                  </h3>
                  <p className="text-muted-foreground text-lg">
                    {item.description}
                  </p>
                </motion.div>)}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-32 bg-gradient-to-b from-gray-50/50 to-white dark:from-gray-900/50 dark:to-background">
        <div className="container mx-auto px-6 max-w-6xl">
          <motion.div initial={{
          opacity: 0
        }} whileInView={{
          opacity: 1
        }} viewport={{
          once: true
        }} transition={{
          duration: 0.6
        }}>
            <h2 className="text-4xl sm:text-5xl font-heading font-bold text-center mb-20 tracking-tight">
              Historias de éxito
            </h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, i) => <motion.div key={i} initial={{
              opacity: 0,
              y: 20
            }} whileInView={{
              opacity: 1,
              y: 0
            }} viewport={{
              once: true
            }} transition={{
              delay: i * 0.1,
              duration: 0.6
            }}>
                  <Card className="p-8 h-full hover:shadow-xl transition-all duration-300 bg-white dark:bg-gray-800/50">
                    <div className="flex gap-1 mb-4">
                      {Array.from({
                    length: testimonial.rating
                  }).map((_, j) => <Star key={j} className="h-5 w-5 fill-orange-500 text-orange-500" />)}
                    </div>
                    <p className="text-lg mb-6 leading-relaxed">&ldquo;{testimonial.text}&rdquo;</p>
                    <div className="border-t pt-4">
                      <p className="font-semibold text-lg">{testimonial.name}</p>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </Card>
                </motion.div>)}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Pricing - Minimalista */}
      

      {/* Final CTA - Impactante */}
      <section className="py-32 gradient-orange text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjA1IiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30" />
        
        <div className="container mx-auto px-6 text-center max-w-4xl relative">
          <motion.div initial={{
          opacity: 0,
          y: 30
        }} whileInView={{
          opacity: 1,
          y: 0
        }} viewport={{
          once: true
        }} transition={{
          duration: 0.8
        }} className="space-y-8">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-bold leading-tight tracking-tight">
              Todo empieza subiendo<br />tu CV hoy
            </h2>
            
            <p className="text-xl sm:text-2xl font-light opacity-95 max-w-2xl mx-auto">
              Únete a los miles de profesionales que ya transformaron su carrera
            </p>
            
            <div className="pt-4">
              <Link to="/guest-start">
                <Button size="lg" className="bg-white text-orange-600 hover:bg-gray-50 text-lg px-12 py-7 font-bold rounded-xl hover:shadow-2xl hover:scale-105 transition-all duration-300">
                  Empieza tu transformación
                  <ArrowRight className="ml-2 h-6 w-6" />
                </Button>
              </Link>
            </div>

            <p className="text-base opacity-90 pt-4">
              7 días gratis • Sin compromiso • Cancela cuando quieras
            </p>
          </motion.div>
        </div>
      </section>

      {/* Footer - Simple y elegante */}
      <footer className="py-16 bg-white dark:bg-background border-t">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="flex flex-col items-center justify-center space-y-8">
            <OfficialLogo size="lg" animated={false} fullVersion={true} />
            
            <div className="flex flex-wrap justify-center gap-8 text-sm text-muted-foreground">
              <Link to="/pricing" className="hover:text-foreground transition-colors">Precios</Link>
              <Link to="/about" className="hover:text-foreground transition-colors">Nosotros</Link>
              <Link to="/blog" className="hover:text-foreground transition-colors">Blog</Link>
              <Link to="/help" className="hover:text-foreground transition-colors">Ayuda</Link>
              <Link to="/privacy" className="hover:text-foreground transition-colors">Privacidad</Link>
              <Link to="/terms" className="hover:text-foreground transition-colors">Términos</Link>
            </div>

            <p className="text-sm text-muted-foreground">
              &copy; 2024 Clovely. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>;
};
export default Landing;