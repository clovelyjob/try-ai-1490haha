import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Link } from 'react-router-dom';
import {
  Sparkles, Target, FileText, MessageSquare, Users, Trophy,
  Brain, Map, CheckCircle2, ArrowRight, Star, Zap, Clock,
  Wand2, ListChecks, Briefcase,
} from 'lucide-react';
import heroImage from '@/assets/hero-professional-growth.jpg';
import collaborationImage from '@/assets/collaboration-story.jpg';
import careerDiscoveryImage from '@/assets/career-discovery-moment.jpg';
import planningImage from '@/assets/planning-workspace.jpg';
import clovelyLogo from '@/assets/clovely-logo.jpg';
import googleLogo from '@/assets/logos/google-logo.svg';
import metaLogo from '@/assets/logos/meta-logo.svg';
import spotifyLogo from '@/assets/logos/spotify-logo.svg';
import mercadolibreLogo from '@/assets/logos/mercadolibre-logo.png';
import rappiLogo from '@/assets/logos/rappi-logo.png';
import { useThemeLogo } from '@/hooks/useThemeLogo';
import { ClovelyTextLogo } from '@/components/ClovelyTextLogo';

const Landing = () => {
  const { isDark } = useThemeLogo();
  
  const features = [
    {
      icon: Brain,
      title: 'Diagnóstico IA',
      description: 'Descubre tus fortalezas ocultas en 10 minutos',
    },
    {
      icon: Map,
      title: 'Ruta personalizada',
      description: 'Plan paso a paso con microacciones diarias',
    },
    {
      icon: FileText,
      title: 'CV optimizado',
      description: 'Pasa filtros ATS automáticamente',
    },
    {
      icon: MessageSquare,
      title: 'Simulador de entrevistas',
      description: 'Feedback instantáneo con IA',
    },
    {
      icon: Users,
      title: 'Círculos de progreso',
      description: 'Apoyo grupal y motivación constante',
    },
    {
      icon: Trophy,
      title: 'Gamificación total',
      description: 'XP, niveles y logros por cada paso',
    },
  ];

  const steps = [
    { 
      icon: Clock,
      title: 'Diagnóstico 10 min', 
      description: 'Descubre tus fortalezas únicas',
      time: 'Instantáneo' 
    },
    { 
      icon: Wand2,
      title: 'IA diseña tu ruta', 
      description: 'Plan personalizado a tu medida',
      time: 'Instantáneo' 
    },
    { 
      icon: ListChecks,
      title: 'Microacciones diarias', 
      description: 'Progreso constante y medible',
      time: '30 min/día' 
    },
    { 
      icon: Briefcase,
      title: 'Match con empleos', 
      description: 'Oportunidades alineadas a ti',
      time: '2-4 semanas' 
    },
  ];

  const testimonials = [
    {
      name: 'Ana M., 24',
      role: 'Contadora → UX Designer',
      text: 'Cambió mi vida, en 3 meses conseguí mi primer trabajo en UX',
      rating: 5,
    },
    {
      name: 'Carlos R., 28',
      role: 'Promoción en 6 meses',
      text: 'Aumento del 40% en salario, solo seguí el plan',
      rating: 5,
    },
    {
      name: 'María F., 22',
      role: 'Primer empleo tech',
      text: 'Recibí 3 ofertas, el simulador me dio la confianza que necesitaba',
      rating: 5,
    },
  ];

  const problems = [
    {
      icon: '🧠',
      title: 'No sabes qué te apasiona',
      description: 'Falta claridad sobre tus intereses y fortalezas reales',
    },
    {
      icon: '🧭',
      title: 'El mercado es un laberinto',
      description: 'Miles de ofertas, no sabes por dónde empezar',
    },
    {
      icon: '🎯',
      title: 'CVs sin respuestas',
      description: 'Te pierdes entre cientos, no sabes qué está fallando',
    },
  ];

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen max-w-full overflow-x-hidden">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between max-w-7xl">
          <Link to="/" className="flex items-center gap-2">
            <ClovelyTextLogo size="md" animated />
          </Link>
          
          <div className="hidden md:flex items-center gap-6 text-sm">
            <button onClick={() => scrollToSection('features')} className="hover:text-primary transition-colors">
              Funcionalidades
            </button>
            <button onClick={() => scrollToSection('how')} className="hover:text-primary transition-colors">
              Cómo funciona
            </button>
            <button onClick={() => scrollToSection('testimonials')} className="hover:text-primary transition-colors">
              Testimonios
            </button>
            <button onClick={() => scrollToSection('pricing')} className="hover:text-primary transition-colors">
              Precios
            </button>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link to="/login">
              <Button variant="ghost">Iniciar sesión</Button>
            </Link>
            <Link to="/registro">
              <div className="relative">
                <Button className="gradient-orange text-white">
                  Empieza gratis
                </Button>
                <span className="absolute -top-2 -right-2 inline-flex items-center px-2 py-0.5 text-[10px] font-medium rounded-full bg-[#FFE7D6] text-[#C2410C] dark:bg-[#2A190F] dark:text-[#FBBF24] whitespace-nowrap">
                  7 días gratis
                </span>
              </div>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="container mx-auto px-4 py-20 md:py-32 max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto text-center space-y-8"
        >
          {/* Logo Hero */}
          <motion.div 
            className="flex justify-center mb-6 pt-6"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <img 
              src={clovelyLogo} 
              alt="Clovely" 
              className={`h-[100px] md:h-[140px] w-auto transition-all duration-300 ${
                isDark 
                  ? 'rounded-2xl border-2 border-primary p-2 shadow-lg shadow-primary/20' 
                  : 'rounded-2xl shadow-lg shadow-black/5'
              }`}
              style={{
                filter: isDark ? 'drop-shadow(0 4px 12px rgba(255, 122, 0, 0.15))' : 'drop-shadow(0 4px 12px rgba(0, 0, 0, 0.05))'
              }}
            />
          </motion.div>

          <Badge variant="secondary" className="mb-4">
            🚀 +10,000 profesionales transformaron su carrera
          </Badge>
          
          <h1 className="text-4xl md:text-6xl font-heading font-bold leading-tight">
            Encuentra el trabajo que te hace{' '}
            <span className="text-primary">feliz</span> con el poder de la IA
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Nuestro coach con IA analiza tu perfil, diseña tu ruta personalizada
            y te conecta con oportunidades alineadas a tu propósito
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/guest-start">
              <Button size="lg" variant="outline" className="text-lg px-8 hover-lift">
                Probar sin registrarse
              </Button>
            </Link>
            <Link to="/registro">
              <Button size="lg" className="gradient-orange text-white text-lg px-8 hover-glow hover:scale-105 transition-all duration-300">
                Descubre tu camino ideal <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
          
          <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 max-w-md mx-auto">
            <p className="text-primary font-semibold text-center">✨ 7 días de prueba gratuita</p>
            <p className="text-sm text-muted-foreground text-center">Sin compromiso. Cancela cuando quieras.</p>
          </div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="mt-12 glass rounded-2xl overflow-hidden animate-float"
          >
            <img 
              src={heroImage} 
              alt="Profesional joven trabajando con confianza en su desarrollo de carrera"
              className="w-full max-w-full h-auto object-cover"
            />
          </motion.div>
        </motion.div>
      </section>

      {/* Social Proof */}
      <section className="border-y bg-muted/30 py-16 overflow-hidden">
        <div className="container mx-auto px-4 max-w-7xl">
          <p className="text-center text-base text-muted-foreground mb-12">
            Profesionales trabajan en empresas como:
          </p>
          <div className="flex gap-16 items-center justify-center flex-wrap">
            {[
              { name: 'Google', logo: googleLogo },
              { name: 'Meta', logo: metaLogo },
              { name: 'Spotify', logo: spotifyLogo },
              { name: 'Mercado Libre', logo: mercadolibreLogo },
              { name: 'Rappi', logo: rappiLogo }
            ].map((company) => (
              <motion.div
                key={company.name}
                whileHover={{ scale: 1.1, y: -4 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="cursor-pointer"
              >
                <img 
                  src={company.logo} 
                  alt={`${company.name} logo`}
                  className="h-12 w-auto opacity-60 hover:opacity-100 transition-opacity duration-200 grayscale hover:grayscale-0"
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Problems */}
      <section className="container mx-auto px-4 py-20 max-w-7xl">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-5xl mx-auto"
        >
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-center mb-12">
            ¿Te suena familiar?
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {problems.map((problem, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="p-6 hover-lift h-full">
                  <div className="text-4xl mb-4">{problem.icon}</div>
                  <h3 className="font-heading font-bold text-lg mb-2">{problem.title}</h3>
                  <p className="text-muted-foreground">{problem.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Features */}
      <section id="features" className="bg-muted/30 py-20">
        <div className="container mx-auto px-4 max-w-7xl">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="max-w-6xl mx-auto"
          >
            <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
              <div>
                <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
                  Tu coach personal 24/7
                </h2>
                <p className="text-muted-foreground mb-8 text-lg">
                  Todas las herramientas que necesitas para transformar tu carrera, con el apoyo de una comunidad que crece contigo.
                </p>
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                  className="glass rounded-2xl overflow-hidden"
                >
                  <img 
                    src={collaborationImage} 
                    alt="Equipo colaborando en desarrollo profesional"
                    className="w-full max-w-full h-auto object-cover"
                  />
                </motion.div>
              </div>
              
              <div className="grid gap-6">
                {features.map((feature, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <Card className="p-6 hover-lift cursor-pointer group">
                      <div className="flex gap-4">
                        <div className="shrink-0">
                          <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                            <feature.icon className="h-6 w-6 text-primary" />
                          </div>
                        </div>
                        <div>
                          <h3 className="font-heading font-bold text-lg mb-2 group-hover:text-primary transition-colors">
                            {feature.title}
                          </h3>
                          <p className="text-muted-foreground text-sm">
                            {feature.description}
                          </p>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="container mx-auto px-4 py-20 max-w-7xl">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-6xl mx-auto"
        >
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-center mb-12">
            Cómo funciona
          </h2>
          
          <div className="relative">
            {/* Horizontal steps */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
              {steps.map((step, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="relative"
                >
                  <Card className="p-6 h-full hover-lift hover:border-primary/50 transition-all duration-300 group cursor-pointer">
                    <div className="flex flex-col items-center text-center space-y-4">
                      {/* Icon with number badge */}
                      <div className="relative">
                        <div className="w-16 h-16 rounded-2xl gradient-orange flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
                          <step.icon className="h-8 w-8 text-white" />
                        </div>
                        <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-primary text-primary-foreground font-bold flex items-center justify-center text-sm shadow-md group-hover:scale-110 transition-transform">
                          {i + 1}
                        </div>
                      </div>
                      
                      {/* Content */}
                      <div className="space-y-2">
                        <h3 className="font-heading font-bold text-lg">{step.title}</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {step.description}
                        </p>
                        <Badge variant="secondary" className="text-xs mt-2">
                          <Clock className="h-3 w-3 mr-1" />
                          {step.time}
                        </Badge>
                      </div>
                    </div>
                  </Card>
                  
                  {/* Connecting arrow - hidden on last item and mobile */}
                  {i < steps.length - 1 && (
                    <div className="hidden md:block absolute top-1/2 -right-3 z-10 -translate-y-1/2">
                      <ArrowRight className="h-6 w-6 text-primary animate-pulse" />
                    </div>
                  )}
                </motion.div>
              ))}
            </div>

            {/* Image below */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="glass rounded-2xl overflow-hidden animate-float max-w-3xl mx-auto"
            >
              <img 
                src={careerDiscoveryImage} 
                alt="Momento de descubrimiento profesional con análisis de carrera"
                className="w-full max-w-full h-auto object-cover"
              />
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="bg-muted/30 py-20">
        <div className="container mx-auto px-4 max-w-7xl">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="max-w-5xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-center mb-12">
              Historias de éxito
            </h2>
            
            <div className="grid md:grid-cols-3 gap-6">
              {testimonials.map((testimonial, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Card className="p-6 h-full hover-lift">
                    <div className="flex gap-1 mb-3">
                      {Array.from({ length: testimonial.rating }).map((_, j) => (
                        <Star key={j} className="h-4 w-4 fill-primary text-primary" />
                      ))}
                    </div>
                    <p className="text-sm mb-4">&ldquo;{testimonial.text}&rdquo;</p>
                    <div>
                      <p className="font-semibold text-sm">{testimonial.name}</p>
                      <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="container mx-auto px-4 py-20 max-w-7xl">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-5xl mx-auto"
        >
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-center mb-12">
            Elige tu plan
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Free */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
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
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
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
      <section className="gradient-orange text-white py-20">
        <div className="container mx-auto px-4 text-center max-w-7xl">
          <Badge variant="secondary" className="mb-4 bg-white/20 text-white border-white/30">
            ✨ Prueba 7 días gratis
          </Badge>
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
            ¿Listo para dejar de buscar y empezar a encontrar?
          </h2>
          <p className="text-lg mb-8 opacity-90">
            🎯 87% consigue empleo en 3 meses | ⭐ 4.9/5 | 🚀 10,243 carreras transformadas
          </p>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link to="/registro">
              <Button size="lg" variant="secondary" className="text-lg px-8 hover:shadow-2xl transition-all duration-300">
                Empieza tu prueba gratuita ahora <Zap className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </motion.div>
          <p className="text-sm mt-4 opacity-75">
            Sin tarjeta requerida • Cancela cuando quieras
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12 bg-muted/30">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="mb-8 pt-6 flex justify-center">
            <ClovelyTextLogo size="lg" animated={false} />
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
    </div>
  );
};

export default Landing;
