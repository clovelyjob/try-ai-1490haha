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
    stat: 'Al instante',
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
  return <div className="min-h-screen bg-gradient-to-br from-orange-50/30 via-white to-blue-50/20 dark:from-gray-900 dark:via-gray-800 dark:to-background">
      {/* Navbar - Ultra limpio */}
      <nav className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 dark:bg-background/80 border-b border-border/30">
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
        <div className="container mx-auto px-6 py-40 md:py-48 max-w-5xl relative">
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
            <h1 className="text-6xl sm:text-7xl lg:text-8xl font-heading font-semibold leading-[1.1] tracking-tight text-foreground">
              Encuentra el trabajo que{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-orange-600 to-orange-500">
                realmente mereces
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-2xl sm:text-3xl text-muted-foreground/80 max-w-3xl mx-auto font-light leading-relaxed">
              La IA te analiza, te muestra tu camino ideal y te conecta con oportunidades que realmente encajan contigo
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
          }} className="max-w-5xl mx-auto px-4">
              <div className="relative rounded-2xl overflow-hidden shadow-[0_25px_80px_-20px_rgba(255,122,0,0.25)] dark:shadow-[0_25px_80px_-20px_rgba(255,122,0,0.4)]">
                <video autoPlay loop muted playsInline className="w-full h-auto rounded-2xl">
                  <source src="/clovely-hero-video.mp4" type="video/mp4" />
                  Tu navegador no soporta el elemento de video.
                </video>
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
          }} className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
              <Link to="/guest-start" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto text-lg px-12 py-8 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200">
                  Sube tu CV y encuentra trabajo
                </Button>
              </Link>
            </motion.div>

            {/* Trust indicator */}
            <p className="text-base text-muted-foreground/70 pt-6">
              7 días gratis • Sin tarjeta • Cancela cuando quieras
            </p>
          </motion.div>
        </div>
      </section>

      {/* Integrations */}
      <IntegrationsSection />

      {/* Por qué Clovely - Minimalista */}
      <section className="py-40 bg-white dark:bg-background">
        <div className="container mx-auto px-6 max-w-5xl">
          <motion.div initial={{
          opacity: 0
        }} whileInView={{
          opacity: 1
        }} viewport={{
          once: true
        }} transition={{
          duration: 0.8
        }} className="space-y-12 text-center">
            <h2 className="text-5xl sm:text-6xl font-heading font-semibold tracking-tight leading-tight">
              Por qué miles aman Clovely
            </h2>
            
            <div className="space-y-8 text-3xl sm:text-4xl font-light text-muted-foreground/70 leading-snug">
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
      <section className="py-40 bg-white dark:bg-background">
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
            <h2 className="text-5xl sm:text-6xl font-heading font-semibold text-center mb-8 tracking-tight leading-tight">
              Todo lo que necesitas
            </h2>
            <p className="text-center text-2xl text-muted-foreground/70 mb-20 max-w-3xl mx-auto font-light">
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
                  <Card className="p-12 hover:shadow-lg transition-all duration-200 bg-white dark:bg-gray-800/50 border border-border/50 group cursor-pointer h-full">
                    <div className="w-14 h-14 rounded-xl bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center mb-6">
                      <benefit.icon className="h-7 w-7 text-orange-500" />
                    </div>
                    <h3 className="font-heading font-semibold text-2xl mb-4">
                      {benefit.title}
                    </h3>
                    <p className="text-muted-foreground/70 text-lg font-light leading-relaxed">
                      {benefit.description}
                    </p>
                  </Card>
                </motion.div>)}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Transformación - Timeline style */}
      <section className="py-40 bg-gradient-to-b from-orange-50/20 to-white dark:from-gray-900/30 dark:to-background">
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
            <h2 className="text-5xl sm:text-6xl font-heading font-semibold text-center mb-8 tracking-tight leading-tight">
              Tu transformación en 30 días
            </h2>
            <p className="text-center text-2xl text-muted-foreground/70 mb-24 max-w-3xl mx-auto font-light">
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
            }} className="text-center space-y-6">
                  <div className="relative inline-block">
                    <div className="text-7xl font-heading font-semibold text-orange-500">
                      {item.stat}
                    </div>
                  </div>
                  <h3 className="text-3xl font-heading font-medium">
                    {item.label}
                  </h3>
                  <p className="text-muted-foreground/70 text-xl font-light leading-relaxed">
                    {item.description}
                  </p>
                </motion.div>)}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-40 bg-white dark:bg-background">
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
            <h2 className="text-5xl sm:text-6xl font-heading font-semibold text-center mb-24 tracking-tight leading-tight">
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
                  <Card className="p-10 h-full bg-white dark:bg-gray-800/50 border border-border/50 hover:shadow-lg transition-all duration-200">
                    <div className="flex gap-1 mb-6">
                      {Array.from({
                    length: testimonial.rating
                  }).map((_, j) => <Star key={j} className="h-5 w-5 fill-orange-500 text-orange-500" />)}
                    </div>
                    <p className="text-xl mb-8 leading-relaxed font-light">&ldquo;{testimonial.text}&rdquo;</p>
                    <div className="border-t pt-6">
                      <p className="font-semibold text-lg">{testimonial.name}</p>
                      <p className="text-base text-muted-foreground/70">{testimonial.role}</p>
                    </div>
                  </Card>
                </motion.div>)}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Pricing - Minimalista */}
      

      {/* Final CTA - Impactante */}
      <section className="py-40 bg-gradient-to-br from-orange-500 to-orange-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent_50%)]" />
        </div>
        
        <div className="container mx-auto px-6 text-center max-w-5xl relative">
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
        }} className="space-y-10">
            <h2 className="text-5xl sm:text-6xl lg:text-7xl font-heading font-semibold leading-tight tracking-tight">
              Todo empieza subiendo<br />tu CV hoy
            </h2>
            
            <p className="text-2xl sm:text-3xl font-light opacity-90 max-w-3xl mx-auto leading-relaxed">
              Únete a los miles de profesionales que ya transformaron su carrera
            </p>
            
            <div className="pt-6">
              <Link to="/guest-start">
                <Button size="lg" className="bg-white text-orange-600 hover:bg-gray-50 text-lg px-14 py-8 font-medium rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-200">
                  Empieza tu cambio
                </Button>
              </Link>
            </div>

            <p className="text-base opacity-85 pt-2">
              7 días gratis • Sin compromiso • Cancela cuando quieras
            </p>
          </motion.div>
        </div>
      </section>

      {/* Footer - Simple y elegante */}
      <footer className="py-20 bg-white dark:bg-background border-t border-border/30">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="flex flex-col items-center justify-center space-y-10">
            <OfficialLogo size="lg" animated={false} fullVersion={true} />
            
            <div className="flex flex-wrap justify-center gap-10 text-base text-muted-foreground/70">
              <Link to="/pricing" className="hover:text-foreground transition-colors">Precios</Link>
              <Link to="/about" className="hover:text-foreground transition-colors">Nosotros</Link>
              <Link to="/blog" className="hover:text-foreground transition-colors">Blog</Link>
              <Link to="/help" className="hover:text-foreground transition-colors">Ayuda</Link>
              <Link to="/privacy" className="hover:text-foreground transition-colors">Privacidad</Link>
              <Link to="/terms" className="hover:text-foreground transition-colors">Términos</Link>
            </div>

            <p className="text-sm text-muted-foreground/70">
              © 2025 Clovely. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>;
};
export default Landing;