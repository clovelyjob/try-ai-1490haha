import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Link } from 'react-router-dom';
import { Sparkles, Target, FileText, MessageSquare, Users, Trophy, Brain, Map, CheckCircle2, ArrowRight, Star, Zap, Clock, Wand2, ListChecks, Briefcase } from 'lucide-react';
import heroImage from '@/assets/hero-professional-growth.jpg';
import collaborationImage from '@/assets/collaboration-story.jpg';
import careerDiscoveryImage from '@/assets/career-discovery-moment.jpg';
import planningImage from '@/assets/planning-workspace.jpg';
import clovelyLogo from '@/assets/clovely-logo.jpg';
import { useThemeLogo } from '@/hooks/useThemeLogo';
import { OfficialLogo } from '@/components/OfficialLogo';
import { IntegrationsSection } from '@/components/integrations/IntegrationsSection';
const Landing = () => {
  const {
    isDark
  } = useThemeLogo();
  const features = [{
    icon: Brain,
    title: 'Diagnóstico IA en 10 minutos',
    description: 'Descubre tu perfil profesional completo con inteligencia artificial'
  }, {
    icon: Map,
    title: 'Ruta personalizada',
    description: 'Plan paso a paso diseñado específicamente para ti'
  }, {
    icon: FileText,
    title: 'CV optimizado automáticamente',
    description: 'Tu CV perfecto sin esfuerzo, listo para competir'
  }, {
    icon: MessageSquare,
    title: 'Simulador de entrevistas con IA',
    description: 'Practica y recibe feedback real antes de la entrevista'
  }, {
    icon: Target,
    title: 'Match con empleos alineados a tu perfil',
    description: 'Oportunidades que realmente encajan contigo'
  }];
  const steps = [{
    icon: Clock,
    title: 'Diagnóstico 10 min',
    description: 'Descubre tus fortalezas únicas',
    time: 'Instantáneo'
  }, {
    icon: Wand2,
    title: 'IA diseña tu ruta',
    description: 'Plan personalizado a tu medida',
    time: 'Instantáneo'
  }, {
    icon: ListChecks,
    title: 'Microacciones diarias',
    description: 'Progreso constante y medible',
    time: '30 min/día'
  }, {
    icon: Briefcase,
    title: 'Match con empleos',
    description: 'Oportunidades alineadas a ti',
    time: '2-4 semanas'
  }];
  const testimonials = [{
    name: 'Ana M., 24',
    role: 'Contadora → UX Designer',
    text: 'Cambió mi vida, en 3 meses conseguí mi primer trabajo en UX',
    rating: 5
  }, {
    name: 'Carlos R., 28',
    role: 'Promoción en 6 meses',
    text: 'Aumento del 40% en salario, solo seguí el plan',
    rating: 5
  }, {
    name: 'María F., 22',
    role: 'Primer empleo tech',
    text: 'Recibí 3 ofertas, el simulador me dio la confianza que necesitaba',
    rating: 5
  }];
  const problems = [{
    icon: '❓',
    title: 'No sabes qué quieres',
    description: 'Te sientes perdido sin una dirección clara en tu carrera'
  }, {
    icon: '🌀',
    title: 'El mercado laboral parece un caos',
    description: 'Miles de opciones pero ninguna parece la correcta'
  }, {
    icon: '📧',
    title: 'Envíes lo que envíes, nadie responde',
    description: 'Tus aplicaciones desaparecen en el vacío sin explicación'
  }];
  
  const benefits = [{
    icon: '🎯',
    title: 'Claridad total sobre tu camino',
    description: 'Sabrás exactamente qué hacer y por qué'
  }, {
    icon: '📄',
    title: 'Un CV y perfil listos para competir',
    description: 'Destaca entre cientos con herramientas profesionales'
  }, {
    icon: '💼',
    title: 'Oportunidades reales en tu bandeja',
    description: 'Empleos que encajan con tu perfil y objetivos'
  }, {
    icon: '🚀',
    title: 'Seguridad, enfoque y avance constante',
    description: 'Progreso medible cada día hacia tu meta'
  }];
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  };
  return <div className="min-h-screen max-w-full overflow-x-hidden">
      {/* Navbar - Mobile First Responsive */}
      <nav className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-3 sm:px-4 lg:px-6 h-16 sm:h-18 lg:h-20 flex items-center justify-between max-w-7xl">
          <OfficialLogo size="lg" to="/" />
          
          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-4 xl:gap-6 text-sm">
            <button onClick={() => scrollToSection('features')} className="hover:text-primary transition-colors min-h-[44px] px-3">
              Funcionalidades
            </button>
            <button onClick={() => scrollToSection('how')} className="hover:text-primary transition-colors min-h-[44px] px-3">
              Cómo funciona
            </button>
            <button onClick={() => scrollToSection('testimonials')} className="hover:text-primary transition-colors min-h-[44px] px-3">
              Testimonios
            </button>
            <button onClick={() => scrollToSection('pricing')} className="hover:text-primary transition-colors min-h-[44px] px-3">
              Precios
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-1.5 sm:gap-2 lg:gap-3">
            <ThemeToggle />
            <Link to="/login" className="hidden sm:block">
              <Button variant="ghost" size="sm" className="min-h-[44px]">
                Iniciar sesión
              </Button>
            </Link>
            <Link to="/registro">
              <div className="relative">
                <Button size="sm" className="gradient-orange text-white text-xs sm:text-sm min-h-[44px] px-3 sm:px-4">
                  <span className="hidden sm:inline">Empieza gratis</span>
                  <span className="sm:hidden">Gratis</span>
                </Button>
                <span className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 inline-flex items-center px-1.5 sm:px-2 py-0.5 text-[9px] sm:text-[10px] font-medium rounded-full bg-[#FFE7D6] text-[#C2410C] dark:bg-[#2A190F] dark:text-[#FBBF24] whitespace-nowrap">
                  7 días
                </span>
              </div>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero - Optimized for all devices */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-24 lg:py-32 max-w-7xl">
        <motion.div initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 0.6
      }} className="max-w-4xl mx-auto text-center space-y-6 sm:space-y-8">
          
          <Badge variant="secondary" className="mb-3 sm:mb-4 bg-primary/10 text-primary border-primary/20 text-xs sm:text-sm px-3 py-1.5 sm:px-4 sm:py-2">
            ⭐ Más de 10,000 profesionales ya transformaron su carrera
          </Badge>
          
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-heading font-bold leading-tight px-2">
            Encuentra el trabajo que{' '}
            <span className="text-primary">realmente mereces</span> con IA que te guía paso a paso
          </h1>
          
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto px-4">
            Tu carrera no debería sentirse como un misterio. Con Clovely, tu potencial deja de ser invisible: 
            la IA analiza quién eres, te muestra tu camino ideal y te conecta con oportunidades que encajan contigo.
          </p>
          
          {/* Hero Video */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="relative max-w-4xl mx-auto px-4 sm:px-6 mt-8 sm:mt-10 mb-8 sm:mb-10"
          >
            <div className="relative rounded-2xl overflow-hidden border-2 border-primary/30 shadow-2xl shadow-primary/20 hover:shadow-primary/40 hover:border-primary/50 transition-all duration-500 group">
              {/* Glow effect */}
              <div className="absolute -inset-0.5 bg-gradient-to-r from-primary via-primary/50 to-primary opacity-30 blur-xl group-hover:opacity-50 transition-opacity duration-500" />
              
              {/* Video container */}
              <div className="relative bg-background/50 backdrop-blur-sm">
                <video 
                  autoPlay 
                  muted 
                  loop 
                  playsInline
                  className="w-full h-auto rounded-xl"
                  poster="/clovely-logo.png"
                >
                  <source src="/clovely-hero-video.mp4" type="video/mp4" />
                  Tu navegador no soporta el video.
                </video>
              </div>

              {/* Decorative gradient overlay */}
              <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-background/30 via-transparent to-transparent" />
              
              {/* Animated border gradient */}
              <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-primary/20 to-transparent animate-pulse" />
              </div>
            </div>
          </motion.div>
          
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-stretch sm:items-center px-4 sm:px-0">
            <Link to="/guest-start" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto text-base sm:text-lg px-6 sm:px-8 min-h-[48px] sm:min-h-[52px] gradient-orange text-white hover-lift hover-glow hover:shadow-2xl transition-all duration-300">
                Sube tu CV y accede a oportunidades diseñadas para ti
              </Button>
            </Link>
          </div>
          
          <div className="bg-primary/10 border border-primary/20 rounded-lg p-3 sm:p-4 max-w-md mx-auto">
            <p className="text-primary font-semibold text-center text-sm sm:text-base">✨ 7 días gratis, sin tarjeta</p>
          </div>

          <motion.div initial={{
          opacity: 0,
          scale: 0.95
        }} animate={{
          opacity: 1,
          scale: 1
        }} transition={{
          delay: 0.3,
          duration: 0.6
        }} className="mt-8 sm:mt-12 glass rounded-xl sm:rounded-2xl overflow-hidden animate-float">
            <img src={heroImage} alt="Profesional joven trabajando con confianza en su desarrollo de carrera" className="w-full h-auto object-cover" loading="eager" />
          </motion.div>
        </motion.div>
      </section>

      {/* Integrations */}
      <IntegrationsSection />

      {/* Por qué miles aman Clovely */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20 max-w-7xl">
        <motion.div initial={{
        opacity: 0
      }} whileInView={{
        opacity: 1
      }} viewport={{
        once: true
      }} transition={{
        duration: 0.5
      }} className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-heading font-bold mb-6 sm:mb-8 px-4">
            Por qué miles aman Clovely
          </h2>
          <div className="space-y-3 sm:space-y-4 text-lg sm:text-xl md:text-2xl font-medium text-muted-foreground">
            <p className="hover:text-primary transition-colors">Porque sienten claridad.</p>
            <p className="hover:text-primary transition-colors">Porque dejan de adivinar.</p>
            <p className="hover:text-primary transition-colors">Porque dejan de enviar CVs al vacío.</p>
            <p className="hover:text-primary transition-colors">Porque finalmente ven un plan que pueden seguir.</p>
            <p className="text-primary font-bold text-xl sm:text-2xl md:text-3xl">Porque funciona.</p>
          </div>
        </motion.div>
      </section>

      {/* Problems - ¿Te suena familiar? */}
      <section className="bg-muted/30 py-12 sm:py-16 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <motion.div initial={{
          opacity: 0
        }} whileInView={{
          opacity: 1
        }} viewport={{
          once: true
        }} transition={{
          duration: 0.5
        }} className="max-w-5xl mx-auto">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-heading font-bold text-center mb-4 sm:mb-6 px-4">
              ¿Te suena familiar?
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8">
              {problems.map((problem, i) => <motion.div key={i} initial={{
              opacity: 0,
              y: 20
            }} whileInView={{
              opacity: 1,
              y: 0
            }} viewport={{
              once: true
            }} transition={{
              delay: i * 0.1
            }}>
                  <Card className="p-5 sm:p-6 hover-lift h-full">
                    <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">{problem.icon}</div>
                    <h3 className="font-heading font-bold text-base sm:text-lg mb-2">{problem.title}</h3>
                    <p className="text-sm sm:text-base text-muted-foreground">{problem.description}</p>
                  </Card>
                </motion.div>)}
            </div>
            <p className="text-center text-xl sm:text-2xl lg:text-3xl font-heading font-bold text-primary">
              Eso termina hoy.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Features - Todo lo que necesitas */}
      <section id="features" className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20 max-w-7xl">
        <motion.div initial={{
        opacity: 0
      }} whileInView={{
        opacity: 1
      }} viewport={{
        once: true
      }} transition={{
        duration: 0.5
      }} className="max-w-6xl mx-auto">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-heading font-bold text-center mb-4 sm:mb-6 px-4">
            Todo lo que necesitas para avanzar está aquí
          </h2>
          <p className="text-center text-muted-foreground mb-8 sm:mb-12 text-base sm:text-lg max-w-2xl mx-auto px-4">
            Cinco herramientas poderosas trabajando juntas para transformar tu carrera
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {features.map((feature, i) => <motion.div key={i} initial={{
            opacity: 0,
            y: 20
          }} whileInView={{
            opacity: 1,
            y: 0
          }} viewport={{
            once: true
          }} transition={{
            delay: i * 0.1
          }}>
                <Card className="p-5 sm:p-6 hover-lift cursor-pointer group h-full">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl gradient-orange flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <feature.icon className="h-6 w-6 sm:h-7 sm:w-7 text-white" />
                  </div>
                  <h3 className="font-heading font-bold text-base sm:text-lg mb-2 group-hover:text-primary transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground text-xs sm:text-sm">
                    {feature.description}
                  </p>
                </Card>
              </motion.div>)}
          </div>
        </motion.div>
      </section>

      {/* How it works - Fully Responsive */}
      <section id="how" className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20 max-w-7xl">
        <motion.div initial={{
        opacity: 0
      }} whileInView={{
        opacity: 1
      }} viewport={{
        once: true
      }} transition={{
        duration: 0.5
      }} className="max-w-6xl mx-auto">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-heading font-bold text-center mb-8 sm:mb-12 px-4">
            Cómo funciona
          </h2>
          
          <div className="relative">
            {/* Responsive steps grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8 sm:mb-12">
              {steps.map((step, i) => <motion.div key={i} initial={{
              opacity: 0,
              y: 20
            }} whileInView={{
              opacity: 1,
              y: 0
            }} viewport={{
              once: true
            }} transition={{
              delay: i * 0.1
            }} className="relative">
                  <Card className="p-5 sm:p-6 h-full hover-lift hover:border-primary/50 transition-all duration-300 group cursor-pointer">
                    <div className="flex flex-col items-center text-center space-y-3 sm:space-y-4">
                      {/* Icon with number badge */}
                      <div className="relative">
                        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl gradient-orange flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
                          <step.icon className="h-7 w-7 sm:h-8 sm:w-8 text-white" />
                        </div>
                        <div className="absolute -top-2 -right-2 w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-primary text-primary-foreground font-bold flex items-center justify-center text-xs sm:text-sm shadow-md group-hover:scale-110 transition-transform">
                          {i + 1}
                        </div>
                      </div>
                      
                      {/* Content */}
                      <div className="space-y-2">
                        <h3 className="font-heading font-bold text-base sm:text-lg">{step.title}</h3>
                        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                          {step.description}
                        </p>
                        <Badge className="gradient-blue text-white text-xs mt-2">
                          <Clock className="h-3 w-3 mr-1" />
                          {step.time}
                        </Badge>
                      </div>
                    </div>
                  </Card>
                  
                  {/* Connecting arrow - hidden on mobile and last item */}
                  {i < steps.length - 1 && <div className="hidden lg:block absolute top-1/2 -right-3 z-10 -translate-y-1/2">
                      <ArrowRight className="h-5 w-5 xl:h-6 xl:w-6 text-primary animate-pulse" />
                    </div>}
                </motion.div>)}
            </div>

            {/* Image below */}
            <motion.div initial={{
            opacity: 0,
            scale: 0.95
          }} whileInView={{
            opacity: 1,
            scale: 1
          }} viewport={{
            once: true
          }} transition={{
            delay: 0.4
          }} className="glass rounded-xl sm:rounded-2xl overflow-hidden animate-float max-w-3xl mx-auto">
              <img src={careerDiscoveryImage} alt="Momento de descubrimiento profesional con análisis de carrera" className="w-full h-auto object-cover" loading="lazy" />
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="bg-muted/30 py-20">
        <div className="container mx-auto px-4 max-w-7xl">
          <motion.div initial={{
          opacity: 0
        }} whileInView={{
          opacity: 1
        }} viewport={{
          once: true
        }} transition={{
          duration: 0.5
        }} className="max-w-5xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-center mb-12">
              Historias de éxito
            </h2>
            
            <div className="grid md:grid-cols-3 gap-6">
              {testimonials.map((testimonial, i) => <motion.div key={i} initial={{
              opacity: 0,
              y: 20
            }} whileInView={{
              opacity: 1,
              y: 0
            }} viewport={{
              once: true
            }} transition={{
              delay: i * 0.1
            }}>
                  <Card className="p-6 h-full hover-lift">
                    <div className="flex gap-1 mb-3">
                      {Array.from({
                    length: testimonial.rating
                  }).map((_, j) => <Star key={j} className="h-4 w-4 fill-primary text-primary" />)}
                    </div>
                    <p className="text-sm mb-4">&ldquo;{testimonial.text}&rdquo;</p>
                    <div>
                      <p className="font-semibold text-sm">{testimonial.name}</p>
                      <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </Card>
                </motion.div>)}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Imagina tu vida profesional en 90 días */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20 max-w-7xl">
        <motion.div initial={{
        opacity: 0
      }} whileInView={{
        opacity: 1
      }} viewport={{
        once: true
      }} transition={{
        duration: 0.5
      }} className="max-w-5xl mx-auto">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-heading font-bold text-center mb-4 sm:mb-6 px-4">
            Imagina tu vida profesional en 90 días
          </h2>
          <p className="text-center text-muted-foreground mb-8 sm:mb-12 text-base sm:text-lg max-w-2xl mx-auto px-4">
            Esto es lo que lograrás con Clovely
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {benefits.map((benefit, i) => <motion.div key={i} initial={{
            opacity: 0,
            y: 20
          }} whileInView={{
            opacity: 1,
            y: 0
          }} viewport={{
            once: true
          }} transition={{
            delay: i * 0.1
          }}>
                <Card className="p-5 sm:p-6 hover-lift h-full group cursor-pointer hover:border-primary/50 transition-all">
                  <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">{benefit.icon}</div>
                  <h3 className="font-heading font-bold text-base sm:text-lg mb-2 group-hover:text-primary transition-colors">{benefit.title}</h3>
                  <p className="text-sm sm:text-base text-muted-foreground">{benefit.description}</p>
                </Card>
              </motion.div>)}
          </div>
        </motion.div>
      </section>

      {/* Pricing - Mobile First */}
      <section id="pricing" className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20 max-w-7xl">
        <motion.div initial={{
        opacity: 0
      }} whileInView={{
        opacity: 1
      }} viewport={{
        once: true
      }} transition={{
        duration: 0.5
      }} className="max-w-5xl mx-auto">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-heading font-bold text-center mb-8 sm:mb-12 px-4">
            Elige tu plan
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-4xl mx-auto">
            {/* Free */}
            <motion.div initial={{
            opacity: 0,
            x: -20
          }} whileInView={{
            opacity: 1,
            x: 0
          }} viewport={{
            once: true
          }} transition={{
            delay: 0.1
          }}>
              <Card className="p-8 h-full hover-lift">
              <h3 className="font-heading font-bold text-2xl mb-2">Free</h3>
              <p className="text-4xl font-heading font-bold mb-6">
                $0<span className="text-lg text-muted-foreground">/mes</span>
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-2 text-sm">
                  <CheckCircle2 className="h-5 w-5 text-success shrink-0" />
                  <span>Diagnóstico básico</span>
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <CheckCircle2 className="h-5 w-5 text-success shrink-0" />
                  <span>1 objetivo activo</span>
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <CheckCircle2 className="h-5 w-5 text-success shrink-0" />
                  <span>5 microacciones/semana</span>
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <CheckCircle2 className="h-5 w-5 text-success shrink-0" />
                  <span>5 mensajes IA/mes</span>
                </li>
              </ul>
                <Link to="/registro">
                  <Button variant="outline" className="w-full hover-lift">
                    Empezar gratis
                  </Button>
                </Link>
              </Card>
            </motion.div>

            {/* Premium */}
            <motion.div initial={{
            opacity: 0,
            x: 20
          }} whileInView={{
            opacity: 1,
            x: 0
          }} viewport={{
            once: true
          }} transition={{
            delay: 0.2
          }}>
              <Card className="p-8 border-2 border-primary relative h-full hover-lift hover:border-primary hover:shadow-2xl transition-all">
              <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 gradient-premium text-white">
                Más popular
              </Badge>
              <h3 className="font-heading font-bold text-2xl mb-2">Premium</h3>
              <p className="text-4xl font-heading font-bold mb-6 text-primary">
                $20<span className="text-lg text-muted-foreground">/mes</span>
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-2 text-sm">
                  <CheckCircle2 className="h-5 w-5 text-success shrink-0" />
                  <span className="font-semibold">Todo de Free +</span>
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <CheckCircle2 className="h-5 w-5 text-success shrink-0" />
                  <span>Objetivos ilimitados</span>
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <CheckCircle2 className="h-5 w-5 text-success shrink-0" />
                  <span>IA 24/7 ilimitado</span>
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <CheckCircle2 className="h-5 w-5 text-success shrink-0" />
                  <span>CV optimizado IA</span>
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <CheckCircle2 className="h-5 w-5 text-success shrink-0" />
                  <span>Simulador ilimitado</span>
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <CheckCircle2 className="h-5 w-5 text-success shrink-0" />
                  <span>Match inteligente empleos</span>
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <CheckCircle2 className="h-5 w-5 text-success shrink-0" />
                  <span>2 mentorías/mes</span>
                </li>
              </ul>
                <Link to="/registro">
                  <Button className="w-full gradient-orange text-white hover-glow hover:scale-105 transition-all duration-300">
                    Prueba 7 días gratis
                  </Button>
                </Link>
              </Card>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Final CTA */}
      <section className="gradient-orange text-white py-12 sm:py-16 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-7xl">
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} whileInView={{
          opacity: 1,
          y: 0
        }} viewport={{
          once: true
        }} transition={{
          duration: 0.5
        }} className="max-w-3xl mx-auto">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-heading font-bold mb-4 sm:mb-6 px-4">
              Todo empieza subiendo tu CV hoy
            </h2>
            <p className="text-base sm:text-lg lg:text-xl mb-6 sm:mb-8 opacity-95 px-4">
              Únete a los miles de profesionales que ya transformaron su carrera
            </p>
            <motion.div whileHover={{
            scale: 1.05
          }} whileTap={{
            scale: 0.95
          }} className="mb-4">
              <Link to="/guest-start">
                <Button size="lg" className="bg-white text-primary hover:bg-white/90 text-base sm:text-lg lg:text-xl px-8 sm:px-10 lg:px-12 min-h-[52px] sm:min-h-[56px] hover:shadow-2xl transition-all duration-300 font-bold">
                  Empieza tu transformación <ArrowRight className="ml-2 h-5 w-5 sm:h-6 sm:w-6" />
                </Button>
              </Link>
            </motion.div>
            <p className="text-sm sm:text-base opacity-90 px-4">
              7 días gratis • Sin compromiso • Cancela cuando quieras
            </p>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12 bg-muted/30">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="mb-8 pt-6 flex justify-center">
            <OfficialLogo size="lg" animated={false} fullVersion={true} />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
            <div>
              <h4 className="font-heading font-bold mb-4">Producto</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <button onClick={() => scrollToSection('features')} className="hover:text-foreground transition-colors">
                    Funcionalidades
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollToSection('pricing')} className="hover:text-foreground transition-colors">
                    Precios
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollToSection('testimonials')} className="hover:text-foreground transition-colors">
                    Testimonios
                  </button>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-heading font-bold mb-4">Recursos</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground">Blog</a></li>
                <li><a href="#" className="hover:text-foreground">Guías</a></li>
                <li><a href="#" className="hover:text-foreground">Ayuda</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-heading font-bold mb-4">Empresa</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground">Nosotros</a></li>
                <li><a href="#" className="hover:text-foreground">Carreras</a></li>
                <li><a href="#" className="hover:text-foreground">Contacto</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-heading font-bold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground">Privacidad</a></li>
                <li><a href="#" className="hover:text-foreground">Términos</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-heading font-bold mb-4">Social</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground">Twitter</a></li>
                <li><a href="#" className="hover:text-foreground">LinkedIn</a></li>
                <li><a href="#" className="hover:text-foreground">Instagram</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t text-center text-sm text-muted-foreground">
            <p>&copy; 2024 Clovely. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>;
};
export default Landing;