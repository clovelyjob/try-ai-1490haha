import { motion, useScroll, useTransform } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Link, Navigate } from 'react-router-dom';
import {
  ArrowRight, Star, Instagram, CheckCircle, Compass, BarChart3,
  FileText, MessageSquare, Target, TrendingUp, Shield,
  Users, ChevronRight, Zap, ArrowUpRight, Layers, Award,
  GraduationCap, Briefcase, Sparkles, LineChart, Rocket,
  Eye, BookOpen, Check, Mic } from
'lucide-react';
import { OfficialLogo } from '@/components/OfficialLogo';
import { useRef } from 'react';
import { useAuthStore } from '@/store/useAuthStore';

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease }
  })
};

const Landing = () => {
  const { isAuthenticated, isGuestMode } = useAuthStore();

  // Redirect authenticated users to dashboard
  if (isAuthenticated && !isGuestMode) {
    return <Navigate to="/dashboard" replace />;
  }

  return <LandingContent />;
};

const LandingContent = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start']
  });
  const heroOpacity = useTransform(scrollYProgress, [0, 1], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 0.96]);

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* ── Navbar ── */}
      <nav className="fixed top-0 inset-x-0 z-50 backdrop-blur-xl bg-background/70 border-b border-border/30">
        <div className="mx-auto max-w-6xl px-6 h-14 flex items-center justify-between">
          <OfficialLogo size="md" to="/" />
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-[13px] text-muted-foreground hover:text-foreground transition-colors">Funciones</a>
            <a href="#how" className="text-[13px] text-muted-foreground hover:text-foreground transition-colors">Cómo funciona</a>
            <a href="#pricing" className="text-[13px] text-muted-foreground hover:text-foreground transition-colors">Precios</a>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link to="/login">
              <Button variant="ghost" size="sm" className="text-[13px] h-8">Iniciar sesión</Button>
            </Link>
            <Link to="/registro">
              <Button size="sm" className="text-[13px] h-8 px-4">Comenzar</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <motion.section
        ref={heroRef}
        style={{ opacity: heroOpacity, scale: heroScale }}
        className="relative pt-28 pb-20 sm:pt-36 sm:pb-28 overflow-hidden">
        
        {/* Subtle gradient orbs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-primary/[0.04] blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-[400px] h-[400px] rounded-full bg-primary/[0.03] blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-3xl px-6 text-center">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={0}>
            
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-primary/20 bg-primary/[0.06] text-xs font-medium text-primary mb-8">
              <Sparkles className="h-3 w-3" />
              Plataforma de empleabilidad con IA
            </div>
          </motion.div>

          <motion.h1
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={1}
            className="text-[clamp(2rem,5.5vw,3.5rem)] font-bold leading-[1.08] tracking-tight mb-6">
            
            Construye la carrera que{' '}
            <span className="relative">
              <span className="gradient-text">mereces</span>
              <svg className="absolute -bottom-1 left-0 w-full" viewBox="0 0 200 8" fill="none">
                <path d="M2 6C50 2 150 2 198 6" stroke="hsl(var(--primary))" strokeWidth="2.5" strokeLinecap="round" opacity="0.4" />
              </svg>
            </span>
          </motion.h1>

          <motion.p
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={2}
            className="text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed mb-10">
            
            Mejora tu CV, practica entrevistas con IA y encuentra las oportunidades
            que se alinean con tu perfil. Todo en un solo lugar.
          </motion.p>

          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={3}
            className="flex flex-col sm:flex-row gap-3 justify-center">
            
            <Link to="/registro">
              <Button size="lg" className="h-12 px-7 text-sm font-semibold gap-2 shadow-clovely-md">
                Comenzar ahora
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link to="/guest-start">
              <Button variant="outline" size="lg" className="h-12 px-7 text-sm font-medium gap-2">
                <Eye className="h-4 w-4" />
                Pruébalo primero y decide
              </Button>
            </Link>
          </motion.div>

          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={4}
            className="flex items-center justify-center gap-5 text-xs text-muted-foreground mt-8">
            
            <span className="flex items-center gap-1.5">
              <Check className="h-3.5 w-3.5 text-primary" /> Modo invitado gratuito
            </span>
            <span className="flex items-center gap-1.5">
              <Check className="h-3.5 w-3.5 text-primary" /> Cancela cuando quieras
            </span>
          </motion.div>
        </div>
      </motion.section>

      {/* ── Product Preview ── */}
      <section className="pb-24 sm:pb-32">
        <div className="mx-auto max-w-5xl px-6">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease }}
            className="relative">
            
            <div className="absolute -inset-4 rounded-2xl bg-gradient-to-b from-primary/10 to-transparent blur-2xl opacity-60 pointer-events-none" />
            <div className="relative rounded-xl overflow-hidden border border-border/50 shadow-clovely-xl bg-card">
              <div className="bg-muted/40 px-4 py-2.5 border-b border-border/30 flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-destructive/40" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/40" />
                  <div className="w-2.5 h-2.5 rounded-full bg-primary/40" />
                </div>
                <div className="flex-1 flex justify-center">
                  <div className="px-4 py-0.5 rounded-md bg-muted/60 text-[10px] text-muted-foreground font-mono">
                    moonjab.com
                  </div>
                </div>
              </div>
              <video autoPlay loop muted playsInline className="w-full h-auto">
                <source src="/moonjab-hero-video.mp4" type="video/mp4" />
              </video>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Social Proof Strip ── */}
      <section className="py-12 border-y border-border/30">
        <div className="mx-auto max-w-4xl px-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 text-center">
            {[
            { value: '10K+', label: 'Profesionales activos', icon: Users },
            { value: '87%', label: 'Consiguen empleo', icon: TrendingUp },
            { value: '4.9', label: 'Satisfacción', icon: Star },
            { value: '15+', label: 'Países', icon: Compass }].
            map((stat, i) =>
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
              className="flex flex-col items-center gap-1">
              
                <stat.icon className="h-4 w-4 text-primary/60 mb-1" />
                <p className="text-2xl sm:text-3xl font-bold tracking-tight">{stat.value}</p>
                <p className="text-[11px] text-muted-foreground">{stat.label}</p>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* ── Features Bento ── */}
      <section id="features" className="py-24 sm:py-32">
        <div className="mx-auto max-w-6xl px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-center mb-16">
            
            <p className="text-xs font-semibold text-primary uppercase tracking-[0.2em] mb-3">Funciones</p>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
              Todo lo que necesitas para<br className="hidden sm:block" /> destacar profesionalmente
            </h2>
            <p className="text-muted-foreground max-w-lg mx-auto">
              Herramientas inteligentes que se adaptan a tu perfil y te guían paso a paso.
            </p>
          </motion.div>

          {/* Bento grid */}
          <div className="grid md:grid-cols-3 gap-4">
            {/* Large card — CV */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              custom={0}
              className="md:col-span-2 group relative overflow-hidden rounded-2xl border border-border/40 bg-card p-8 hover:shadow-clovely-lg transition-all duration-500">
              
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/[0.03] rounded-full blur-3xl pointer-events-none" />
              <div className="relative">
                <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary/15 transition-colors">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">CV inteligente con IA</h3>
                <p className="text-sm text-muted-foreground leading-relaxed max-w-md mb-6">
                  Crea un currículum optimizado para ATS que resalte tus logros y se adapte a cada industria.
                  Nuestro motor analiza y mejora cada sección automáticamente.
                </p>
                <div className="flex flex-wrap gap-2">
                  {['Plantillas profesionales', 'Optimización ATS', 'Exportar PDF'].map((tag) =>
                  <span key={tag} className="px-2.5 py-1 text-[11px] rounded-md bg-primary/[0.06] text-primary font-medium">{tag}</span>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Small card — Diagnostic */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              custom={1}
              className="group relative overflow-hidden rounded-2xl border border-border/40 bg-card p-8 hover:shadow-clovely-lg transition-all duration-500">
              
              <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary/15 transition-colors">
                <Compass className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-lg font-bold mb-2">Diagnóstico vocacional</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Descubre tu perfil profesional con análisis RIASEC y recibe recomendaciones personalizadas.
              </p>
            </motion.div>

            {/* Small card — Interview */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              custom={2}
              className="group relative overflow-hidden rounded-2xl border border-border/40 bg-card p-8 hover:shadow-clovely-lg transition-all duration-500">
              
              <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary/15 transition-colors">
                <Mic className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-lg font-bold mb-2">Simulador de entrevistas</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Practica con un entrevistador IA que adapta preguntas a tu industria y da feedback en tiempo real.
              </p>
            </motion.div>

            {/* Large card — Opportunities */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              custom={3}
              className="md:col-span-2 group relative overflow-hidden rounded-2xl border border-border/40 bg-card p-8 hover:shadow-clovely-lg transition-all duration-500">
              
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/[0.03] rounded-full blur-3xl pointer-events-none" />
              <div className="relative">
                <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary/15 transition-colors">
                  <Briefcase className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Oportunidades que encajan contigo</h3>
                <p className="text-sm text-muted-foreground leading-relaxed max-w-md mb-6">
                  Nuestro algoritmo cruza tu perfil con miles de ofertas para mostrarte solo las que
                  realmente coinciden con tus habilidades y objetivos.
                </p>
                <div className="flex flex-wrap gap-2">
                  {['Match inteligente', 'Filtros avanzados', 'Alertas personalizadas'].map((tag) =>
                  <span key={tag} className="px-2.5 py-1 text-[11px] rounded-md bg-primary/[0.06] text-primary font-medium">{tag}</span>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section id="how" className="py-24 sm:py-32 bg-muted/30 border-y border-border/30">
        <div className="mx-auto max-w-5xl px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-center mb-16">
            
            <p className="text-xs font-semibold text-primary uppercase tracking-[0.2em] mb-3">Cómo funciona</p>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
              De la preparación a la oferta,<br className="hidden sm:block" /> en tres pasos
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connecting line */}
            <div className="hidden md:block absolute top-14 left-[16.66%] right-[16.66%] h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

            {[
            {
              num: '01',
              icon: Compass,
              title: 'Descubre tu perfil',
              desc: 'Completa un diagnóstico inteligente que identifica tus fortalezas, intereses y el tipo de roles donde más puedes destacar.'
            },
            {
              num: '02',
              icon: FileText,
              title: 'Prepárate con IA',
              desc: 'Construye un CV optimizado y practica entrevistas con retroalimentación personalizada en tiempo real.'
            },
            {
              num: '03',
              icon: Target,
              title: 'Conecta con oportunidades',
              desc: 'Recibe ofertas laborales alineadas a tu perfil y postula con un CV adaptado a cada posición.'
            }].
            map((step, i) =>
            <motion.div
              key={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              custom={i}
              className="relative text-center">
              
                <div className="relative z-10 w-14 h-14 rounded-2xl bg-card border border-border/50 shadow-clovely-sm flex items-center justify-center mx-auto mb-5">
                  <step.icon className="h-6 w-6 text-primary" />
                </div>
                <span className="text-[10px] font-mono text-primary/60 uppercase tracking-[0.2em]">{step.num}</span>
                <h3 className="font-bold text-lg mt-1.5 mb-2.5">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed max-w-xs mx-auto">{step.desc}</p>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* ── Feature Deep Dives (alternating split) ── */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-5xl px-6 space-y-28">
          {[
          {
            icon: FileText,
            label: 'CV Builder',
            title: 'Tu mejor versión profesional, en minutos',
            desc: 'No más horas luchando con el formato. Nuestro editor inteligente analiza tu experiencia y genera un CV que pasa los filtros ATS y captura la atención de reclutadores.',
            points: ['Sugerencias de mejora con IA', 'Adaptación por industria', 'Exportación en PDF profesional'],
            visual:
            <div className="aspect-[4/3] rounded-xl bg-gradient-to-br from-card to-muted/50 border border-border/40 p-6 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="h-3 w-32 rounded bg-primary/15" />
                    <div className="h-2.5 w-full rounded bg-muted" />
                    <div className="h-2.5 w-4/5 rounded bg-muted" />
                  </div>
                  <div className="space-y-2">
                    <div className="h-2 w-20 rounded bg-primary/20" />
                    <div className="h-2 w-full rounded bg-muted/80" />
                    <div className="h-2 w-3/4 rounded bg-muted/80" />
                  </div>
                  <div className="flex gap-2">
                    <div className="px-3 py-1.5 rounded-md bg-primary/10 text-[10px] text-primary font-medium">ATS Score: 92%</div>
                    <div className="px-3 py-1.5 rounded-md bg-muted text-[10px] text-muted-foreground">PDF Ready</div>
                  </div>
                </div>,

            reverse: false
          },
          {
            icon: MessageSquare,
            label: 'Entrevistas IA',
            title: 'Practica hasta sentir confianza total',
            desc: 'Nuestro simulador reproduce escenarios reales de entrevista adaptados a tu rol e industria. Recibe retroalimentación inmediata sobre tus respuestas.',
            points: ['Preguntas contextuales por rol', 'Análisis de respuestas en tiempo real', 'Historial de sesiones y progreso'],
            visual:
            <div className="aspect-[4/3] rounded-xl bg-gradient-to-br from-card to-muted/50 border border-border/40 p-6 flex flex-col gap-3">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-7 h-7 rounded-full bg-primary/15 flex items-center justify-center">
                      <Mic className="h-3.5 w-3.5 text-primary" />
                    </div>
                    <div className="text-[11px] font-medium text-foreground/70">Entrevistador IA</div>
                  </div>
                  <div className="flex-1 space-y-3">
                    <div className="bg-muted/60 rounded-lg p-3 max-w-[80%]">
                      <div className="h-2 w-full rounded bg-foreground/10" />
                      <div className="h-2 w-3/4 rounded bg-foreground/10 mt-1.5" />
                    </div>
                    <div className="bg-primary/[0.08] rounded-lg p-3 max-w-[75%] ml-auto">
                      <div className="h-2 w-full rounded bg-primary/20" />
                      <div className="h-2 w-2/3 rounded bg-primary/20 mt-1.5" />
                    </div>
                  </div>
                  <div className="flex gap-2 items-center">
                    <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
                      <div className="h-full w-3/4 rounded-full bg-primary/40" />
                    </div>
                    <span className="text-[10px] text-primary font-medium">75%</span>
                  </div>
                </div>,

            reverse: true
          }].
          map((feature, i) =>
          <motion.div
            key={i}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className={`grid md:grid-cols-2 gap-12 lg:gap-16 items-center`}>
            
              <div className={`space-y-5 ${feature.reverse ? 'md:order-2' : ''}`}>
                <div className="inline-flex items-center gap-2 text-xs font-semibold text-primary uppercase tracking-[0.15em]">
                  <feature.icon className="h-3.5 w-3.5" />
                  {feature.label}
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold tracking-tight leading-tight">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.desc}</p>
                <ul className="space-y-3 pt-1">
                  {feature.points.map((point, j) =>
                <li key={j} className="flex items-center gap-3 text-sm">
                      <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Check className="h-3 w-3 text-primary" />
                      </div>
                      {point}
                    </li>
                )}
                </ul>
              </div>
              <div className={feature.reverse ? 'md:order-1' : ''}>
                {feature.visual}
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="py-24 sm:py-32 bg-muted/30 border-y border-border/30">
        <div className="mx-auto max-w-5xl px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-center mb-14">
            
            <p className="text-xs font-semibold text-primary uppercase tracking-[0.2em] mb-3">Testimonios</p>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
              Historias reales de transformación
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-5">
            {[
            { name: 'Valentina S.', role: 'Estudiante de Ingeniería', text: 'No sabía cómo armar mi CV sin experiencia. MoonJab me guió paso a paso y el diagnóstico RIASEC me ayudó a entender en qué roles encajaba mejor.' },
            { name: 'Diego L.', role: 'Desarrollador Junior', text: 'Practiqué entrevistas con la IA hasta sentirme seguro. En mi primera entrevista real respondí con una confianza que nunca había tenido.' },
            { name: 'Camila R.', role: 'Analista de Marketing', text: 'Usé el modo invitado primero para probar. En una semana me suscribí porque el match de oportunidades me mostró vacantes que realmente se alineaban con mi perfil.' }].
            map((t, i) =>
            <motion.div
              key={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              custom={i}
              className="p-6 rounded-2xl border border-border/40 bg-card hover:shadow-clovely-md transition-all duration-300 group">
              
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: 5 }).map((_, j) =>
                <Star key={j} className="h-3.5 w-3.5 fill-primary text-primary" />
                )}
                </div>
                <p className="text-sm leading-relaxed text-foreground/80 mb-6">
                  &ldquo;{t.text}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                    {t.name[0]}
                  </div>
                  <div>
                    <p className="font-medium text-sm">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* ── Pricing ── */}
      <section id="pricing" className="py-24 sm:py-32">
        <div className="mx-auto max-w-4xl px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-center mb-14">
            
            <p className="text-xs font-semibold text-primary uppercase tracking-[0.2em] mb-3">Precios</p>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
              Un plan simple, sin sorpresas
            </h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              Accede a todas las herramientas por un precio accesible. Prueba gratis en modo invitado antes de decidir.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 gap-5 max-w-2xl mx-auto">
            {/* Free / Guest */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              custom={0}
              className="rounded-2xl border border-border/40 bg-card p-7">
              
              <p className="text-sm font-semibold mb-1">Modo invitado</p>
              <p className="text-xs text-muted-foreground mb-5">Explora las funciones básicas</p>
              <p className="text-3xl font-bold mb-1">$0</p>
              <p className="text-xs text-muted-foreground mb-6">Para siempre</p>
              <ul className="space-y-2.5 mb-7">
                {[
                '1 plantilla de CV',
                'Oportunidades genéricas',
                'Diagnóstico básico',
                'Funciones limitadas'].
                map((f) =>
                <li key={f} className="flex items-center gap-2.5 text-sm text-muted-foreground">
                    <Check className="h-3.5 w-3.5 text-muted-foreground/60 flex-shrink-0" />
                    {f}
                  </li>
                )}
              </ul>
              <Link to="/guest-start" className="block">
                <Button variant="outline" className="w-full h-10 text-sm">
                  Probar gratis
                </Button>
              </Link>
            </motion.div>

            {/* Pro */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              custom={1}
              className="rounded-2xl border-2 border-primary/30 bg-card p-7 relative shadow-clovely-md">
              
              <div className="absolute -top-3 left-7 px-3 py-0.5 rounded-full bg-primary text-primary-foreground text-[10px] font-semibold">
                Recomendado
              </div>
              <p className="text-sm font-semibold mb-1">Pro</p>
              <p className="text-xs text-muted-foreground mb-5">Todo lo que necesitas</p>
              <div className="flex items-baseline gap-1 mb-1">
                <p className="text-3xl font-bold">$15</p>
                <span className="text-sm text-muted-foreground">/mes</span>
              </div>
              <p className="text-xs text-muted-foreground mb-6">Facturado mensualmente</p>
              <ul className="space-y-2.5 mb-7">
                {[
                'Todas las plantillas de CV',
                'Entrevistas ilimitadas con IA',
                'Oportunidades personalizadas',
                'Match score inteligente',
                'Diagnóstico completo RIASEC',
                'Exportación PDF ilimitada'].
                map((f) =>
                <li key={f} className="flex items-center gap-2.5 text-sm">
                    <Check className="h-3.5 w-3.5 text-primary flex-shrink-0" />
                    {f}
                  </li>
                )}
              </ul>
              <Link to="/registro" className="block">
                <Button className="w-full h-10 text-sm font-semibold gap-2 shadow-clovely-sm">
                  Comenzar ahora
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="py-24 sm:py-32 bg-muted/30 border-t border-border/30">
        <div className="mx-auto max-w-2xl px-6 text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="space-y-6">
            
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto">
              <Rocket className="h-6 w-6 text-primary" />
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
              Tu próximo paso profesional<br className="hidden sm:block" /> empieza aquí
            </h2>
            <p className="text-muted-foreground text-lg max-w-md mx-auto">
              Únete a miles de profesionales que ya transformaron su carrera con MoonJab.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
              <Link to="/registro">
                <Button size="lg" className="h-12 px-8 text-sm font-semibold gap-2 shadow-clovely-md">
                  Crear cuenta
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link to="/guest-start">
                <Button variant="outline" size="lg" className="h-12 px-8 text-sm gap-2">
                  Pruébalo y pasa los filtros
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="py-12 border-t border-border/30">
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="space-y-2">
              <OfficialLogo size="md" animated={false} />
              <p className="text-xs text-muted-foreground">Empleabilidad impulsada por IA.</p>
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
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-border/20">
            <p className="text-[11px] text-muted-foreground">© 2025 MoonJab. Todos los derechos reservados.</p>
            <a href="https://www.instagram.com/trymoonjab" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors" aria-label="Instagram">
              <Instagram className="h-4 w-4" />
            </a>
          </div>
        </div>
      </footer>
    </div>);

};

export default Landing;