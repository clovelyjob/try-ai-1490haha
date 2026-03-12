import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, Star, Instagram, CheckCircle, Compass, BarChart3, 
  FileText, MessageSquare, Target, Sparkles, TrendingUp, Shield, 
  Users, ChevronRight, Play, Zap, ArrowUpRight
} from 'lucide-react';
import { OfficialLogo } from '@/components/OfficialLogo';

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number];

const Landing = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 backdrop-blur-xl bg-background/80 border-b border-border/40">
        <div className="container mx-auto px-6 h-14 flex items-center justify-between max-w-5xl">
          <OfficialLogo size="md" to="/" />
          <div className="hidden md:flex items-center gap-6">
            <Link to="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Nosotros</Link>
            <Link to="/pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Precios</Link>
            <Link to="/blog" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Blog</Link>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link to="/login" className="hidden sm:block">
              <Button variant="ghost" size="sm" className="text-sm h-8">Iniciar sesión</Button>
            </Link>
            <Link to="/registro">
              <Button size="sm" className="text-sm h-8 px-4">Comenzar</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-20 pb-16 sm:pt-28 sm:pb-24">
        <div className="container mx-auto px-6 max-w-3xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease }}
            className="space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border/60 bg-muted/50 text-xs text-muted-foreground">
              <Zap className="h-3 w-3 text-primary" />
              Plataforma de desarrollo profesional con IA
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.1] tracking-tight">
              Tu carrera profesional,{' '}
              <span className="text-primary">simplificada</span>
            </h1>

            <p className="text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
              Clovely analiza tu perfil, diseña tu ruta profesional y te conecta 
              con las oportunidades que mejor encajan contigo.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
              <Link to="/registro">
                <Button size="lg" className="h-11 px-6 text-sm font-medium gap-2">
                  Comenzar gratis
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link to="/about">
                <Button variant="outline" size="lg" className="h-11 px-6 text-sm gap-2">
                  <Play className="h-3.5 w-3.5" />
                  Ver cómo funciona
                </Button>
              </Link>
            </div>

            <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground pt-2">
              <span className="flex items-center gap-1">
                <CheckCircle className="h-3 w-3 text-primary" /> Gratis 7 días
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle className="h-3 w-3 text-primary" /> Sin tarjeta
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle className="h-3 w-3 text-primary" /> Cancela cuando quieras
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Product Preview */}
      <section className="pb-20 sm:pb-28">
        <div className="container mx-auto px-6 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7, ease }}
            className="rounded-xl overflow-hidden border border-border/60 shadow-clovely-lg bg-card"
          >
            <div className="bg-muted/30 px-4 py-2.5 border-b border-border/40 flex items-center gap-2">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-border" />
                <div className="w-2.5 h-2.5 rounded-full bg-border" />
                <div className="w-2.5 h-2.5 rounded-full bg-border" />
              </div>
              <div className="flex-1 flex justify-center">
                <div className="px-3 py-0.5 rounded bg-muted/60 text-[10px] text-muted-foreground">
                  app.clovely.io/dashboard
                </div>
              </div>
            </div>
            <video autoPlay loop muted playsInline className="w-full h-auto">
              <source src="/clovely-hero-video.mp4" type="video/mp4" />
            </video>
          </motion.div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 sm:py-28 border-t border-border/40">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="text-center mb-16">
            <p className="text-xs font-medium text-primary uppercase tracking-widest mb-3">Cómo funciona</p>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
              Tres pasos hacia tu trabajo ideal
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            {[
              { num: '01', icon: FileText, title: 'Sube tu CV', desc: 'Nuestro motor de IA analiza tu experiencia y detecta tus fortalezas en segundos.' },
              { num: '02', icon: Compass, title: 'Recibe tu ruta', desc: 'Un plan de acción personalizado con pasos claros para alcanzar tu objetivo.' },
              { num: '03', icon: Target, title: 'Conecta', desc: 'Encuentra oportunidades que realmente encajan con tu perfil y metas.' },
            ].map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="text-center"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <step.icon className="h-5 w-5 text-primary" />
                </div>
                <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">{step.num}</span>
                <h3 className="font-semibold text-lg mt-1 mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features — split layout */}
      <section className="py-20 sm:py-28 bg-muted/20 border-y border-border/40">
        <div className="container mx-auto px-6 max-w-5xl space-y-24">
          {[
            {
              icon: Compass,
              label: 'Diagnóstico inteligente',
              title: 'Descubre quién eres profesionalmente',
              desc: 'Un análisis basado en ciencia (RIASEC) que identifica tus fortalezas, intereses y el tipo de rol donde más vas a brillar.',
              points: ['Análisis psicométrico validado', 'Recomendaciones de rol personalizadas', 'Resultados en menos de 10 minutos'],
              reverse: false,
            },
            {
              icon: FileText,
              label: 'CV con IA',
              title: 'Tu mejor versión profesional',
              desc: 'Crea un CV optimizado para ATS que destaque tus logros y se adapte a cada oportunidad.',
              points: ['Plantillas profesionales', 'Optimización automática con IA', 'Exportación en PDF de alta calidad'],
              reverse: true,
            },
            {
              icon: MessageSquare,
              label: 'Simulador de entrevistas',
              title: 'Practica hasta dominar',
              desc: 'Entrena con un entrevistador IA que simula escenarios reales y te da feedback instantáneo.',
              points: ['Preguntas adaptadas a tu industria', 'Retroalimentación en tiempo real', 'Seguimiento de progreso'],
              reverse: false,
            },
          ].map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className={`grid md:grid-cols-2 gap-12 items-center ${feature.reverse ? 'md:direction-rtl' : ''}`}
            >
              <div className={`space-y-5 ${feature.reverse ? 'md:order-2' : ''}`}>
                <div className="inline-flex items-center gap-2 text-xs font-medium text-primary uppercase tracking-widest">
                  <feature.icon className="h-3.5 w-3.5" />
                  {feature.label}
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold tracking-tight">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.desc}</p>
                <ul className="space-y-2.5 pt-1">
                  {feature.points.map((point, j) => (
                    <li key={j} className="flex items-center gap-2.5 text-sm">
                      <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <CheckCircle className="h-3 w-3 text-primary" />
                      </div>
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
              <div className={`${feature.reverse ? 'md:order-1' : ''}`}>
                <div className="aspect-[4/3] rounded-xl bg-gradient-to-br from-primary/5 to-primary/10 border border-border/40 flex items-center justify-center">
                  <feature.icon className="h-16 w-16 text-primary/20" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 sm:py-20">
        <div className="container mx-auto px-6 max-w-3xl">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 text-center">
            {[
              { value: '10K+', label: 'Usuarios activos' },
              { value: '87%', label: 'Consiguen empleo' },
              { value: '4.9', label: 'Rating promedio' },
              { value: '15', label: 'Países' },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
              >
                <p className="text-3xl font-bold text-foreground mb-0.5">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 sm:py-28 border-y border-border/40 bg-muted/20">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
              Lo que dicen nuestros usuarios
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { name: 'Ana M.', role: 'UX Designer', text: 'En 3 meses conseguí mi primer trabajo en UX. Clovely me dio la claridad que necesitaba.' },
              { name: 'Carlos R.', role: 'Aumento salarial 40%', text: 'Solo seguí el plan paso a paso. Los resultados fueron increíbles.' },
              { name: 'María F.', role: 'Recién graduada', text: 'Recibí 3 ofertas laborales. El simulador de entrevistas me dio mucha confianza.' },
            ].map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="p-6 rounded-xl border border-border/40 bg-card hover:shadow-clovely-md transition-shadow duration-300"
              >
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <Star key={j} className="h-3.5 w-3.5 fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-sm leading-relaxed text-foreground/85 mb-5">
                  &ldquo;{t.text}&rdquo;
                </p>
                <div className="border-t border-border/30 pt-3">
                  <p className="font-medium text-sm">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 sm:py-28">
        <div className="container mx-auto px-6 max-w-2xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-5"
          >
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
              Empieza hoy
            </h2>
            <p className="text-muted-foreground text-lg">
              Únete a miles de profesionales que ya encontraron su camino.
            </p>
            <div className="pt-2">
              <Link to="/registro">
                <Button size="lg" className="h-11 px-8 text-sm font-medium gap-2">
                  Crear cuenta gratis
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
            <p className="text-xs text-muted-foreground">
              7 días gratis · Sin compromiso · Cancela cuando quieras
            </p>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 border-t border-border/40">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="space-y-2">
              <OfficialLogo size="md" animated={false} />
              <p className="text-xs text-muted-foreground">Desarrollo profesional impulsado por IA.</p>
            </div>
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-muted-foreground">
              <Link to="/pricing" className="hover:text-foreground transition-colors">Precios</Link>
              <Link to="/about" className="hover:text-foreground transition-colors">Nosotros</Link>
              <Link to="/blog" className="hover:text-foreground transition-colors">Blog</Link>
              <Link to="/help" className="hover:text-foreground transition-colors">Ayuda</Link>
              <Link to="/privacy" className="hover:text-foreground transition-colors">Privacidad</Link>
              <Link to="/terms" className="hover:text-foreground transition-colors">Términos</Link>
            </div>
          </div>
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-border/30">
            <p className="text-[11px] text-muted-foreground">© 2025 Clovely. Todos los derechos reservados.</p>
            <a href="https://www.instagram.com/clovelyia" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors" aria-label="Instagram">
              <Instagram className="h-4 w-4" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
