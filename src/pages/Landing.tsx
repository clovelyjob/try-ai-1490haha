import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Link } from 'react-router-dom';
import { 
  Sparkles, 
  Heart, 
  Target, 
  Send, 
  CheckCircle2, 
  Brain,
  Map,
  FileText,
  MessageSquare,
  Briefcase,
  ArrowRight,
  Circle
} from 'lucide-react';
import { ClovelyHeaderLogo } from '@/components/ClovelyHeaderLogo';

const Landing = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between max-w-7xl">
          <Link to="/" className="flex items-center gap-2">
            <ClovelyHeaderLogo />
          </Link>
          
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link to="/login">
              <Button variant="ghost" size="sm" className="hidden sm:inline-flex">
                Iniciar sesión
              </Button>
            </Link>
            <Link to="/register">
              <Button size="sm" className="bg-primary hover:bg-primary/90">
                Comenzar gratis
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-16 sm:py-20 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto space-y-6"
          >
            {/* Title */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-bold leading-tight">
              <span className="block mb-2">⭐ Más de 10,000 profesionales</span>
              <span className="block mb-2">ya transformaron su carrera</span>
              <span className="block bg-gradient-to-r from-primary via-coral to-peach bg-clip-text text-transparent">
                Encuentra el trabajo que realmente mereces con IA que te guía paso a paso
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Tu carrera no debería sentirse como un misterio. Con Clovely, tu potencial deja de ser invisible: 
              la IA analiza quién eres, te muestra tu camino ideal y te conecta con oportunidades que encajan contigo.
            </p>

            {/* Video */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="relative max-w-4xl mx-auto mt-10 mb-8"
            >
              <div className="relative rounded-2xl overflow-hidden border-2 border-primary/30 shadow-2xl shadow-primary/20 hover:shadow-primary/40 hover:border-primary/50 transition-all duration-500 group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-primary via-coral to-peach opacity-30 blur-xl group-hover:opacity-50 transition-opacity duration-500" />
                
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

                <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-background/30 via-transparent to-transparent" />
                
                <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-primary/20 to-transparent animate-pulse" />
                </div>
              </div>
            </motion.div>

            {/* CTA */}
            <div className="flex flex-col items-center gap-4 pt-6">
              <Link to="/guest-start" className="w-full sm:w-auto">
                <Button 
                  size="lg" 
                  className="w-full sm:w-auto text-lg px-8 py-6 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 transition-all duration-300"
                >
                  <ArrowRight className="w-5 h-5 mr-2" />
                  Sube tu CV y encuentra trabajo
                </Button>
              </Link>
              <p className="text-sm text-muted-foreground flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" />
                7 días gratis, sin tarjeta
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Why Section */}
      <section className="py-16 sm:py-20 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto mb-12"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold mb-6">
              Por qué miles aman Clovely
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              { icon: Heart, text: 'Porque sienten claridad', color: 'text-primary' },
              { icon: Target, text: 'Porque dejan de adivinar', color: 'text-coral' },
              { icon: Send, text: 'Porque dejan de enviar CVs al vacío', color: 'text-peach' },
              { icon: Map, text: 'Porque finalmente ven un plan que pueden seguir', color: 'text-blue-premium' },
              { icon: CheckCircle2, text: 'Porque funciona', color: 'text-primary' },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="p-6 h-full hover:shadow-lg hover:shadow-primary/10 transition-all duration-300 border-border/50 hover:border-primary/30">
                  <div className="flex flex-col items-center text-center space-y-3">
                    <item.icon className={`w-10 h-10 ${item.color}`} />
                    <p className="text-lg font-medium">{item.text}</p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 sm:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto mb-12"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold mb-6">
              Todo lo que necesitas para avanzar está aquí
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {[
              { 
                icon: Brain, 
                title: 'Diagnóstico IA en 10 minutos',
                description: 'Descubre tus fortalezas ocultas y tu perfil único',
                gradient: 'from-primary to-coral'
              },
              { 
                icon: Map, 
                title: 'Ruta personalizada',
                description: 'Plan paso a paso diseñado para tu objetivo',
                gradient: 'from-coral to-peach'
              },
              { 
                icon: FileText, 
                title: 'CV optimizado automáticamente',
                description: 'IA mejora tu CV para pasar cualquier filtro ATS',
                gradient: 'from-peach to-primary'
              },
              { 
                icon: MessageSquare, 
                title: 'Simulador de entrevistas con IA',
                description: 'Practica y recibe feedback instantáneo',
                gradient: 'from-blue-premium to-primary'
              },
              { 
                icon: Briefcase, 
                title: 'Match con empleos alineados a tu perfil',
                description: 'Oportunidades que encajan contigo, no al azar',
                gradient: 'from-primary to-blue-premium'
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="p-6 h-full hover:shadow-xl hover:shadow-primary/20 transition-all duration-300 border-border/50 hover:border-primary/50 hover:-translate-y-1 group">
                  <div className="space-y-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                      <feature.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-heading font-semibold">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Problems Section */}
      <section className="py-16 sm:py-20 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto mb-12"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold mb-8">
              ¿Te suena familiar?
            </h2>
            
            <div className="space-y-6 text-left">
              {[
                'No sabes qué quieres.',
                'El mercado laboral parece un caos.',
                'Envíes lo que envíes, nadie responde.',
              ].map((problem, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex items-start gap-3"
                >
                  <Circle className="w-2 h-2 mt-2 fill-primary text-primary flex-shrink-0" />
                  <p className="text-lg text-foreground">{problem}</p>
                </motion.div>
              ))}
            </div>

            <motion.p
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-2xl sm:text-3xl font-heading font-bold text-primary mt-10"
            >
              Eso termina hoy.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="py-16 sm:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto mb-12"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold mb-8">
              Imagina tu vida profesional en 90 días
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {[
              { 
                icon: Target, 
                title: 'Claridad total sobre tu camino',
                color: 'text-primary'
              },
              { 
                icon: FileText, 
                title: 'Un CV y perfil listos para competir',
                color: 'text-coral'
              },
              { 
                icon: Briefcase, 
                title: 'Oportunidades reales en tu bandeja',
                color: 'text-peach'
              },
              { 
                icon: Sparkles, 
                title: 'Seguridad, enfoque y avance constante',
                color: 'text-blue-premium'
              },
            ].map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="p-6 h-full hover:shadow-lg hover:shadow-primary/10 transition-all duration-300 border-border/50 hover:border-primary/30">
                  <div className="flex items-start gap-4">
                    <benefit.icon className={`w-8 h-8 ${benefit.color} flex-shrink-0 mt-1`} />
                    <p className="text-lg font-medium">{benefit.title}</p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 sm:py-20 bg-gradient-to-br from-primary/10 via-coral/5 to-peach/10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto space-y-8"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold">
              Todo empieza subiendo tu CV hoy
            </h2>

            <div className="flex flex-col items-center gap-4 pt-4">
              <Link to="/guest-start" className="w-full sm:w-auto">
                <Button 
                  size="lg" 
                  className="w-full sm:w-auto text-lg px-10 py-7 bg-primary hover:bg-primary/90 shadow-2xl shadow-primary/30 hover:shadow-primary/50 transition-all duration-300 hover:scale-105"
                >
                  <Sparkles className="w-5 h-5 mr-2" />
                  Empieza tu transformación
                </Button>
              </Link>
              <p className="text-sm text-muted-foreground">
                7 días gratis • Sin compromiso • Cancela cuando quieras
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 bg-muted/20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              © 2025 Clovely. Todos los derechos reservados.
            </p>
            <div className="flex gap-6">
              <Link to="/terms" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Términos
              </Link>
              <Link to="/privacy" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Privacidad
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;