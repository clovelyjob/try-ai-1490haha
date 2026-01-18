import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Link } from 'react-router-dom';
import { 
  GraduationCap, 
  BarChart3, 
  Users, 
  FileSpreadsheet, 
  Zap, 
  ArrowRight,
  CheckCircle2,
  LineChart,
  Brain,
  Target
} from 'lucide-react';
import { OfficialLogo } from '@/components/OfficialLogo';

export default function UniversidadesLanding() {
  const features = [
    {
      icon: BarChart3,
      title: 'Dashboard centralizado',
      description: 'Visualiza el rendimiento de todos tus estudiantes en un solo lugar',
    },
    {
      icon: LineChart,
      title: 'Métricas en tiempo real',
      description: 'Datos actualizados automáticamente conforme tus estudiantes practican',
    },
    {
      icon: Brain,
      title: 'Insights de entrevistas',
      description: 'Identifica patrones de mejora y áreas de oportunidad',
    },
    {
      icon: FileSpreadsheet,
      title: 'Exportación de datos',
      description: 'Descarga reportes en Excel para compartir con tu equipo académico',
    },
  ];

  const steps = [
    {
      number: '01',
      title: 'Estudiantes usan Clovely',
      description: 'Crean CVs y practican entrevistas con IA',
    },
    {
      number: '02',
      title: 'Datos se recopilan',
      description: 'Automáticamente, sin intervención manual',
    },
    {
      number: '03',
      title: 'Universidad visualiza',
      description: 'Todo en un dashboard claro y profesional',
    },
  ];

  const benefits = [
    'Sin tracking manual',
    'Datos actualizados automáticamente',
    'Métricas de empleabilidad reales',
    'Reportes exportables',
    'Visibilidad por carrera y cohorte',
    'Identificación de patrones de mejora',
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50/50 via-orange-50/30 to-white dark:from-gray-900 dark:via-gray-800 dark:to-background">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 backdrop-blur-xl bg-white/70 dark:bg-background/70 border-b border-border/50">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between max-w-7xl">
          <OfficialLogo size="lg" to="/" />
          
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Link to="/universidad/login">
              <Button variant="ghost" size="sm" className="text-sm font-medium">
                Iniciar sesión
              </Button>
            </Link>
            <Link to="/universidad/registro">
              <Button size="sm" className="gradient-orange text-white text-sm font-semibold px-6 hover:shadow-lg transition-all">
                Registrar universidad
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-100/40 via-orange-100/30 to-transparent dark:from-blue-950/20 dark:via-orange-950/10 pointer-events-none" />
        
        <div className="container mx-auto px-6 py-32 md:py-40 max-w-6xl relative">
          <div className="text-center space-y-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: 0.2, duration: 0.6 }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white dark:bg-gray-800 border border-primary/20 text-sm font-medium shadow-clovely-md"
            >
              <GraduationCap className="h-4 w-4 text-primary" />
              <span>Para instituciones educativas</span>
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 30 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-5xl sm:text-6xl lg:text-7xl font-heading font-bold leading-[1.1] tracking-tight"
            >
              Clovely para{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-primary-warm to-primary">
                Universidades
              </span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: 0.6, duration: 0.7 }}
              className="text-xl sm:text-2xl text-muted-foreground max-w-3xl mx-auto font-light leading-relaxed"
            >
              Métricas reales de empleabilidad, CVs e entrevistas en tiempo real. 
              Un centro de comando para el éxito profesional de tus estudiantes.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: 0.8, duration: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4"
            >
              <Link to="/universidad/registro">
                <Button 
                  size="lg" 
                  variant="premium"
                  className="text-lg px-10 py-7 font-bold group"
                >
                  Registrar mi universidad
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/universidad/login">
                <Button 
                  size="lg" 
                  variant="outline"
                  className="text-lg px-10 py-7 font-semibold"
                >
                  Iniciar sesión
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Value Proposition */}
      <section className="py-24 bg-white dark:bg-background">
        <div className="container mx-auto px-6 max-w-6xl">
          <motion.div 
            initial={{ opacity: 0 }} 
            whileInView={{ opacity: 1 }} 
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl sm:text-5xl font-heading font-bold mb-4">
              Todo lo que necesitas para medir empleabilidad
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Herramientas diseñadas para equipos académicos que buscan resultados
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="p-8 hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-800/50 dark:to-gray-900/50 h-full group">
                  <div className="w-14 h-14 rounded-2xl gradient-orange flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <feature.icon className="h-7 w-7 text-white" />
                  </div>
                  <h3 className="font-heading font-bold text-xl mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-gradient-to-b from-gray-50/50 to-white dark:from-gray-900/50 dark:to-background">
        <div className="container mx-auto px-6 max-w-6xl">
          <motion.div 
            initial={{ opacity: 0 }} 
            whileInView={{ opacity: 1 }} 
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl sm:text-5xl font-heading font-bold mb-4">
              Cómo funciona
            </h2>
            <p className="text-xl text-muted-foreground">
              Tres pasos simples para transformar tu visibilidad
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-12">
            {steps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="text-center space-y-4"
              >
                <div className="text-6xl font-heading font-bold text-primary/20">{step.number}</div>
                <h3 className="text-xl font-heading font-semibold">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits List */}
      <section className="py-24 bg-white dark:bg-background">
        <div className="container mx-auto px-6 max-w-4xl">
          <motion.div 
            initial={{ opacity: 0 }} 
            whileInView={{ opacity: 1 }} 
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-heading font-bold mb-4">
              Por qué universidades eligen Clovely
            </h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 gap-4">
            {benefits.map((benefit, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center gap-3 p-4 rounded-xl bg-muted/50"
              >
                <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                <span className="font-medium">{benefit}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 gradient-orange text-white relative overflow-hidden">
        <div className="container mx-auto px-6 text-center max-w-4xl relative">
          <motion.div 
            initial={{ opacity: 0, y: 30 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            viewport={{ once: true }}
            className="space-y-8"
          >
            <h2 className="text-4xl sm:text-5xl font-heading font-bold leading-tight">
              Comienza a medir el éxito de tus estudiantes hoy
            </h2>
            <p className="text-xl font-light opacity-95">
              Registra tu universidad y obtén acceso inmediato al dashboard
            </p>
            <div className="pt-4">
              <Link to="/universidad/registro">
                <Button 
                  size="lg" 
                  className="bg-white text-orange-600 hover:bg-gray-50 text-lg px-12 py-7 font-bold rounded-xl hover:shadow-2xl hover:scale-105 transition-all"
                >
                  Registrar universidad
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-border bg-background">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <OfficialLogo size="md" to="/" />
            <p className="text-sm text-muted-foreground">
              © 2024 Clovely. Todos los derechos reservados.
            </p>
            <div className="flex gap-6 text-sm text-muted-foreground">
              <Link to="/privacy" className="hover:text-foreground transition-colors">Privacidad</Link>
              <Link to="/terms" className="hover:text-foreground transition-colors">Términos</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
