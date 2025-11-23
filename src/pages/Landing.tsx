import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Link } from 'react-router-dom';
import { Sparkles, Target, FileText, MessageSquare, Zap, CheckCircle2, ArrowRight, Star } from 'lucide-react';
import { OfficialLogo } from '@/components/OfficialLogo';
import { IntegrationsSection } from '@/components/integrations/IntegrationsSection';

const Landing = () => {
  const benefits = [
    {
      icon: Sparkles,
      title: 'Diagnóstico IA en 10 minutos',
      description: 'Descubre tu perfil profesional único'
    },
    {
      icon: Target,
      title: 'Ruta personalizada',
      description: 'Un plan diseñado específicamente para ti'
    },
    {
      icon: FileText,
      title: 'CV optimizado con IA',
      description: 'Tu mejor versión, lista para competir'
    },
    {
      icon: MessageSquare,
      title: 'Simulador de entrevistas',
      description: 'Practica con IA, llega preparado'
    }
  ];

  const transformations = [
    {
      stat: '10 min',
      label: 'Descubre tu potencial',
      description: 'Diagnóstico completo'
    },
    {
      stat: 'Tu plan',
      label: 'IA diseña tu ruta',
      description: 'Personalizado a tu medida'
    },
    {
      stat: '30 días',
      label: 'Primeros resultados',
      description: 'Progreso constante'
    }
  ];

  const testimonials = [
    {
      name: 'Ana M., 24',
      role: 'Contadora → UX Designer',
      text: 'Me cambió la vida. En 3 meses conseguí mi primer trabajo en UX y nunca me sentí tan segura en una entrevista.',
      rating: 5
    },
    {
      name: 'Carlos R., 28',
      role: 'Aumento salarial 40%',
      text: 'Es la primera vez que entiendo mi carrera. Solo seguí el plan y funcionó. Es el producto que siempre necesité.',
      rating: 5
    },
    {
      name: 'María F., 22',
      role: 'Recién graduada',
      text: 'Clovely es increíble. Recibí 3 ofertas y el simulador me dio la confianza que me faltaba. No puedo creerlo.',
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50/50 via-orange-50/30 to-white dark:from-gray-900 dark:via-gray-800 dark:to-background">
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
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="text-center space-y-8"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-gray-800 border border-primary/20 text-sm font-medium text-foreground shadow-sm"
            >
              <Star className="h-4 w-4 text-primary fill-primary" />
              <span>Más de 10,000 profesionales</span>
            </motion.div>

            {/* Hero Title */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-heading font-bold leading-tight tracking-tight">
              Tu mejor versión profesional{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-orange-600">
                comienza aquí
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-xl sm:text-2xl text-muted-foreground max-w-3xl mx-auto font-light leading-relaxed">
              Deja de adivinar. Empieza a avanzar. La IA analiza tu CV, crea tu ruta personalizada y te conecta con las oportunidades que realmente importan.
            </p>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4"
            >
              <Link to="/guest-start" className="w-full sm:w-auto">
                <Button 
                  size="lg" 
                  className="w-full sm:w-auto text-lg px-10 py-7 gradient-orange text-white font-semibold rounded-xl hover:shadow-2xl hover:scale-105 transition-all duration-300"
                >
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

      {/* CV Builder Explanation - Cómo funciona */}
      <section className="py-32 bg-white dark:bg-background relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-50/30 via-transparent to-blue-50/30 pointer-events-none" />
        
        <div className="container mx-auto px-6 max-w-6xl relative">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-20"
          >
            {/* Header */}
            <div className="text-center space-y-4">
              <h2 className="text-4xl sm:text-5xl font-heading font-bold tracking-tight">
                Cómo funciona el <span className="text-primary">CV Builder</span>
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Tu transformación profesional en 5 pasos automáticos
              </p>
            </div>

            {/* Steps Grid */}
            <div className="grid md:grid-cols-2 gap-12 lg:gap-16">
              {/* Step 1 */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="space-y-4"
              >
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 text-white font-bold text-xl shadow-lg">
                  1
                </div>
                <h3 className="text-2xl font-heading font-bold">Analiza tu CV completo</h3>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  La IA lee cada línea de tu experiencia, identifica tus fortalezas únicas y detecta oportunidades de mejora instantáneamente.
                </p>
              </motion.div>

              {/* Step 2 */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="space-y-4"
              >
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 text-white font-bold text-xl shadow-lg">
                  2
                </div>
                <h3 className="text-2xl font-heading font-bold">Optimiza automáticamente</h3>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Reescribe secciones clave, ajusta formato y añade keywords que los reclutadores buscan. Tu CV compite al máximo nivel.
                </p>
              </motion.div>

              {/* Step 3 */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="space-y-4"
              >
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 text-white font-bold text-xl shadow-lg">
                  3
                </div>
                <h3 className="text-2xl font-heading font-bold">Crea tu ruta personalizada</h3>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Diseña un plan específico para ti: objetivos claros, timeline realista y microacciones diarias que te acercan a tu meta.
                </p>
              </motion.div>

              {/* Step 4 */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                className="space-y-4"
              >
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 text-white font-bold text-xl shadow-lg">
                  4
                </div>
                <h3 className="text-2xl font-heading font-bold">Genera microacciones</h3>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Cada día, tareas concretas de 15-30 minutos que construyen tu futuro paso a paso. Sin agobios, solo progreso real.
                </p>
              </motion.div>

              {/* Step 5 */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 }}
                className="space-y-4 md:col-span-2 max-w-2xl mx-auto text-center"
              >
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 text-white font-bold text-xl shadow-lg">
                  5
                </div>
                <h3 className="text-2xl font-heading font-bold">Acelera tu búsqueda laboral</h3>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Match inteligente con empleos alineados a tu perfil. El simulador de entrevistas te prepara. Llegas a cada oportunidad listo para ganar.
                </p>
              </motion.div>
            </div>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 }}
              className="text-center pt-8"
            >
              <Link to="/guest-start">
                <Button 
                  size="lg" 
                  className="text-lg px-10 py-7 gradient-orange text-white font-semibold rounded-xl hover:shadow-2xl hover:scale-105 transition-all duration-300"
                >
                  <FileText className="mr-2 h-6 w-6" />
                  Prueba el CV Builder ahora
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Por qué Clovely - Minimalista */}
      <section className="py-32 bg-white dark:bg-background">
        <div className="container mx-auto px-6 max-w-4xl">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-12 text-center"
          >
            <h2 className="text-4xl sm:text-5xl font-heading font-bold tracking-tight">
              Por qué miles aman Clovely
            </h2>
            
            <div className="space-y-8 text-2xl sm:text-3xl font-light text-muted-foreground">
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="hover:text-foreground transition-colors cursor-default leading-relaxed"
              >
                Porque <span className="font-semibold text-foreground">sienten claridad</span> por primera vez.
              </motion.p>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="hover:text-foreground transition-colors cursor-default leading-relaxed"
              >
                Porque <span className="font-semibold text-foreground">dejan de adivinar</span> qué hacer.
              </motion.p>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="hover:text-foreground transition-colors cursor-default leading-relaxed"
              >
                Porque <span className="font-semibold text-foreground">dejan de enviar CVs al vacío</span>.
              </motion.p>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                className="hover:text-foreground transition-colors cursor-default leading-relaxed"
              >
                Porque finalmente <span className="font-semibold text-foreground">ven un plan que pueden seguir</span>.
              </motion.p>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 }}
                className="text-primary font-bold text-4xl sm:text-5xl mt-12"
              >
                Porque funciona.
              </motion.p>
            </div>

            {/* Urgency line */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 }}
              className="pt-8"
            >
              <p className="text-xl text-foreground font-medium">
                Tu potencial merece una guía real. Deja de adivinar. <span className="text-primary font-bold">Empieza a avanzar.</span>
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Benefits - Cards premium */}
      <section className="py-32 bg-gradient-to-b from-gray-50/50 to-white dark:from-gray-900/50 dark:to-background">
        <div className="container mx-auto px-6 max-w-6xl">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl sm:text-5xl font-heading font-bold text-center mb-6 tracking-tight">
              Todo lo que necesitas
            </h2>
            <p className="text-center text-xl text-muted-foreground mb-16 max-w-2xl mx-auto">
              Cuatro herramientas poderosas trabajando juntas
            </p>
            
            <div className="grid md:grid-cols-2 gap-8">
              {benefits.map((benefit, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.6 }}
                >
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
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Transformación - Timeline style */}
      <section className="py-32 bg-white dark:bg-background">
        <div className="container mx-auto px-6 max-w-6xl">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl sm:text-5xl font-heading font-bold text-center mb-6 tracking-tight">
              Tu transformación en 30 días
            </h2>
            <p className="text-center text-xl text-muted-foreground mb-20 max-w-2xl mx-auto">
              Así es como Clovely te lleva de donde estás a donde quieres estar
            </p>
            
            <div className="grid md:grid-cols-3 gap-12">
              {transformations.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15, duration: 0.5 }}
                  className="text-center space-y-4"
                >
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
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Testimonials - Ultra emocionales */}
      <section className="py-32 bg-gradient-to-b from-gray-50/50 to-white dark:from-gray-900/50 dark:to-background">
        <div className="container mx-auto px-6 max-w-6xl">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-center mb-20 space-y-4">
              <h2 className="text-4xl sm:text-5xl font-heading font-bold tracking-tight">
                Historias que inspiran
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Profesionales como tú que transformaron sus carreras con Clovely
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.6 }}
                >
                  <Card className="p-8 h-full hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 bg-white dark:bg-gray-800/50 border-2 border-transparent hover:border-primary/20 group">
                    <div className="space-y-6">
                      {/* Stars */}
                      <div className="flex gap-1">
                        {Array.from({ length: testimonial.rating }).map((_, j) => (
                          <Star key={j} className="h-5 w-5 fill-orange-500 text-orange-500" />
                        ))}
                      </div>
                      
                      {/* Quote */}
                      <p className="text-lg leading-relaxed text-foreground">
                        &ldquo;{testimonial.text}&rdquo;
                      </p>
                      
                      {/* Author */}
                      <div className="border-t pt-6 space-y-1">
                        <p className="font-bold text-lg group-hover:text-primary transition-colors">
                          {testimonial.name}
                        </p>
                        <p className="text-sm text-primary font-medium">
                          {testimonial.role}
                        </p>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Social proof line */}
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="text-center text-muted-foreground mt-16 text-lg"
            >
              Más de <span className="font-bold text-primary">10,000 profesionales</span> ya están transformando sus carreras
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Pricing - Ultra Premium con copy exacto */}
      <section className="py-32 bg-gradient-to-b from-white via-gray-50/50 to-white dark:from-background dark:via-gray-900/50 dark:to-background">
        <div className="container mx-auto px-6 max-w-6xl">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl sm:text-5xl font-heading font-bold text-center mb-6 tracking-tight">
              Elige tu plan
            </h2>
            <p className="text-center text-xl text-muted-foreground mb-20 max-w-2xl mx-auto">
              Empieza gratis o desbloquea todo tu potencial
            </p>
            
            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {/* Free Plan */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1, duration: 0.6 }}
              >
                <Card className="p-10 h-full hover:shadow-xl transition-all duration-300 bg-white dark:bg-gray-800/50 border-2 border-gray-200 dark:border-gray-700">
                  <div className="space-y-8">
                    <div>
                      <h3 className="text-3xl font-heading font-bold mb-2">Free</h3>
                      <div className="flex items-baseline gap-2 mb-6">
                        <span className="text-5xl font-heading font-bold">$0</span>
                        <span className="text-xl text-muted-foreground">/mes</span>
                      </div>
                    </div>

                    <ul className="space-y-4">
                      {[
                        'Diagnóstico básico',
                        '1 objetivo activo',
                        '5 microacciones/semana',
                        '5 mensajes IA/mes'
                      ].map((feature, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <CheckCircle2 className="h-5 w-5 text-gray-400 shrink-0 mt-0.5" />
                          <span className="text-base text-muted-foreground">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <Link to="/registro" className="block mt-auto">
                      <Button 
                        variant="outline"
                        size="lg" 
                        className="w-full text-base py-6 font-semibold rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300"
                      >
                        Empezar gratis
                      </Button>
                    </Link>
                  </div>
                </Card>
              </motion.div>

              {/* Premium Plan - Destacado */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="relative"
              >
                {/* Glow effect */}
                <div className="absolute -inset-1 bg-gradient-to-r from-orange-500 via-orange-400 to-orange-500 rounded-2xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-300 animate-pulse" />
                
                <Card className="relative p-10 h-full border-2 border-primary hover:border-primary bg-white dark:bg-gray-800 hover:shadow-2xl transition-all duration-300 group overflow-hidden">
                  {/* Badge Más Popular */}
                  <div className="absolute -top-1 -right-1 px-6 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm font-bold rounded-bl-2xl rounded-tr-2xl shadow-lg">
                    ⭐ Más popular
                  </div>

                  {/* Shimmer effect */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-orange-500/5 to-transparent animate-shimmer" />
                  </div>

                  <div className="space-y-8 relative z-10">
                    <div>
                      <h3 className="text-3xl font-heading font-bold mb-2 text-primary">Premium</h3>
                      <div className="flex items-baseline gap-2 mb-6">
                        <span className="text-5xl font-heading font-bold text-primary">$20</span>
                        <span className="text-xl text-muted-foreground">/mes</span>
                      </div>
                    </div>

                    <ul className="space-y-4">
                      <li className="flex items-start gap-3">
                        <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                        <span className="text-base font-semibold">Todo de Free +</span>
                      </li>
                      {[
                        'Objetivos ilimitados',
                        'IA 24/7 ilimitado',
                        'CV optimizado IA',
                        'Simulador ilimitado',
                        'Match inteligente empleos',
                        '2 mentorías/mes'
                      ].map((feature, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                          <span className="text-base">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <Link to="/registro" className="block mt-auto">
                      <Button 
                        size="lg" 
                        className="w-full text-base py-6 gradient-orange text-white font-bold rounded-xl hover:shadow-2xl hover:scale-105 transition-all duration-300"
                      >
                        Prueba 7 días gratis
                        <Zap className="ml-2 h-5 w-5" />
                      </Button>
                    </Link>

                    <p className="text-center text-sm text-muted-foreground">
                      Sin compromiso • Cancela cuando quieras
                    </p>
                  </div>
                </Card>
              </motion.div>
            </div>

            {/* Trust line */}
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="text-center text-muted-foreground mt-12 text-lg"
            >
              El 85% de nuestros usuarios eligen Premium para acelerar su transformación
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Final CTA - Ultra emocional */}
      <section className="py-32 gradient-orange text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjA1IiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30" />
        
        <div className="container mx-auto px-6 text-center max-w-5xl relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-10"
          >
            {/* Emotional headline */}
            <div className="space-y-4">
              <h2 className="text-5xl sm:text-6xl lg:text-7xl font-heading font-bold leading-tight tracking-tight">
                Tu mejor versión comienza<br className="hidden sm:block" /> con un solo clic
              </h2>
              
              <p className="text-2xl sm:text-3xl font-light opacity-95 max-w-3xl mx-auto leading-relaxed">
                Miles de profesionales ya transformaron sus carreras.<br className="hidden sm:block" />
                <span className="font-semibold">Es tu turno.</span>
              </p>
            </div>

            {/* Main CTA */}
            <div className="pt-8">
              <Link to="/guest-start">
                <Button 
                  size="lg" 
                  className="bg-white text-orange-600 hover:bg-gray-50 text-xl px-14 py-8 font-bold rounded-2xl hover:shadow-2xl hover:scale-110 transition-all duration-300 group"
                >
                  <Sparkles className="mr-3 h-6 w-6 group-hover:rotate-12 transition-transform" />
                  Empieza tu transformación
                  <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>

            {/* Trust indicators */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-6 text-base opacity-95">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5" />
                <span>7 días gratis</span>
              </div>
              <div className="hidden sm:block w-1 h-1 bg-white/50 rounded-full" />
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5" />
                <span>Sin tarjeta</span>
              </div>
              <div className="hidden sm:block w-1 h-1 bg-white/50 rounded-full" />
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5" />
                <span>Cancela cuando quieras</span>
              </div>
            </div>
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
    </div>
  );
};

export default Landing;
