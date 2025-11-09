import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Link } from 'react-router-dom';
import {
  Sparkles, Target, FileText, MessageSquare, Users, Trophy,
  Brain, Map, CheckCircle2, ArrowRight, Star, Zap,
} from 'lucide-react';
import heroImage from '@/assets/hero-professional-growth.jpg';
import collaborationImage from '@/assets/collaboration-story.jpg';
import careerDiscoveryImage from '@/assets/career-discovery-moment.jpg';
import planningImage from '@/assets/planning-workspace.jpg';

const Landing = () => {
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
    { title: 'Diagnóstico 10 min', time: 'Instantáneo' },
    { title: 'IA diseña tu ruta', time: 'Instantáneo' },
    { title: 'Microacciones diarias', time: '30 min/día' },
    { title: 'Match con empleos', time: '2-4 semanas' },
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

  return (
    <div className="min-h-screen">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg gradient-orange flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <span className="font-heading font-bold text-xl">Clovely</span>
          </Link>
          
          <div className="hidden md:flex items-center gap-6 text-sm">
            <a href="#features" className="hover:text-primary transition-colors">Funcionalidades</a>
            <a href="#how" className="hover:text-primary transition-colors">Cómo funciona</a>
            <a href="#testimonials" className="hover:text-primary transition-colors">Testimonios</a>
            <a href="#pricing" className="hover:text-primary transition-colors">Precios</a>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link to="/login">
              <Button variant="ghost">Iniciar sesión</Button>
            </Link>
            <Link to="/registro">
              <Button className="gradient-orange text-white">
                Empieza gratis
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="container mx-auto px-4 py-20 md:py-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto text-center space-y-8"
        >
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
              <Button size="lg" variant="outline" className="text-lg px-8">
                Probar sin registrarse
              </Button>
            </Link>
            <Link to="/registro">
              <Button size="lg" className="gradient-orange text-white text-lg px-8">
                Descubre tu camino ideal <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
          
          <p className="text-sm text-muted-foreground">
            ✓ Sin tarjeta ✓ Sin compromiso ✓ Explora antes de decidir
          </p>

          <div className="mt-12 glass rounded-2xl overflow-hidden animate-float">
            <img 
              src={heroImage} 
              alt="Profesional joven trabajando con confianza en su desarrollo de carrera"
              className="w-full h-auto object-cover"
            />
          </div>
        </motion.div>
      </section>

      {/* Social Proof */}
      <section className="border-y bg-muted/30 py-12 overflow-hidden">
        <div className="container mx-auto px-4">
          <p className="text-center text-sm text-muted-foreground mb-8">
            Profesionales trabajan en empresas como:
          </p>
          <div className="flex gap-12 items-center justify-center flex-wrap opacity-60">
            {['Google', 'Meta', 'Spotify', 'Mercado Libre', 'Rappi'].map((company) => (
              <span key={company} className="text-2xl font-bold">{company}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Problems */}
      <section className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="max-w-5xl mx-auto"
        >
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-center mb-12">
            ¿Te suena familiar?
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {problems.map((problem, i) => (
              <Card key={i} className="p-6 hover:shadow-lg transition-shadow">
                <div className="text-4xl mb-4">{problem.icon}</div>
                <h3 className="font-heading font-bold text-lg mb-2">{problem.title}</h3>
                <p className="text-muted-foreground">{problem.description}</p>
              </Card>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Features */}
      <section id="features" className="bg-muted/30 py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
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
                <div className="glass rounded-2xl overflow-hidden">
                  <img 
                    src={collaborationImage} 
                    alt="Equipo colaborando en desarrollo profesional"
                    className="w-full h-auto object-cover"
                  />
                </div>
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
                    <Card className="p-6 hover:shadow-lg transition-all hover:-translate-y-1">
                      <div className="flex gap-4">
                        <feature.icon className="h-10 w-10 text-primary shrink-0" />
                        <div>
                          <h3 className="font-heading font-bold text-lg mb-2">
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
      <section id="how" className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="max-w-6xl mx-auto"
        >
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-center mb-12">
            Cómo funciona
          </h2>
          
          <div className="grid md:grid-cols-2 gap-12 items-center mb-12">
            <div className="space-y-6">
              {steps.map((step, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full gradient-orange text-white font-bold flex items-center justify-center text-xl shrink-0">
                    {i + 1}
                  </div>
                  <div>
                    <h3 className="font-heading font-semibold mb-1">{step.title}</h3>
                    <Badge variant="secondary">{step.time}</Badge>
                  </div>
                </div>
              ))}
            </div>
            <div className="glass rounded-2xl overflow-hidden">
              <img 
                src={careerDiscoveryImage} 
                alt="Momento de descubrimiento profesional con análisis de carrera"
                className="w-full h-auto object-cover"
              />
            </div>
          </div>
        </motion.div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="bg-muted/30 py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="max-w-5xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-center mb-12">
              Historias de éxito
            </h2>
            
            <div className="grid md:grid-cols-3 gap-6">
              {testimonials.map((testimonial, i) => (
                <Card key={i} className="p-6">
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
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="max-w-5xl mx-auto"
        >
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-center mb-12">
            Elige tu plan
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Free */}
            <Card className="p-8">
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
                <Button variant="outline" className="w-full">
                  Empezar gratis
                </Button>
              </Link>
            </Card>

            {/* Premium */}
            <Card className="p-8 border-2 border-primary relative">
              <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 gradient-premium text-white">
                Más popular
              </Badge>
              <h3 className="font-heading font-bold text-2xl mb-2">Premium</h3>
              <p className="text-4xl font-heading font-bold mb-6 text-primary">
                $40<span className="text-lg text-muted-foreground">/mes</span>
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
              <Button className="w-full gradient-orange text-white">
                Prueba 7 días gratis
              </Button>
            </Card>
          </div>
        </motion.div>
      </section>

      {/* Final CTA */}
      <section className="gradient-orange text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
            ¿Listo para dejar de buscar y empezar a encontrar?
          </h2>
          <p className="text-lg mb-8 opacity-90">
            🎯 87% consigue empleo en 3 meses | ⭐ 4.9/5 | 🚀 10,243 carreras transformadas
          </p>
          <Link to="/registro">
            <Button size="lg" variant="secondary" className="text-lg px-8">
              Comienza gratis ahora <Zap className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
            <div>
              <h4 className="font-heading font-bold mb-4">Producto</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground">Funcionalidades</a></li>
                <li><a href="#" className="hover:text-foreground">Precios</a></li>
                <li><a href="#" className="hover:text-foreground">Testimonios</a></li>
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
