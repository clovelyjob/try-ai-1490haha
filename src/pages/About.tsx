import { motion } from 'framer-motion';
import { OfficialLogo } from '@/components/OfficialLogo';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Target, Heart, Zap, Users, Globe, Award, ArrowRight } from 'lucide-react';
const About = () => {
  const values = [{
    icon: Target,
    title: 'Claridad',
    description: 'Creemos que cada persona merece entender exactamente cuál es su camino ideal. Sin confusión, sin ruido.'
  }, {
    icon: Heart,
    title: 'Empatía',
    description: 'Construimos para personas reales con miedos y aspiraciones reales. Cada feature nace de escuchar.'
  }, {
    icon: Zap,
    title: 'Acción',
    description: 'No basta con soñar. Te damos las herramientas para pasar de la idea al resultado, rápido.'
  }, {
    icon: Users,
    title: 'Comunidad',
    description: 'El éxito se multiplica cuando se comparte. Creamos conexiones que transforman carreras.'
  }];
  const stats = [{
    number: '10,000+',
    label: 'Profesionales transformados'
  }, {
    number: '50,000+',
    label: 'CVs creados'
  }, {
    number: '95%',
    label: 'Tasa de satisfacción'
  }, {
    number: '15',
    label: 'Países alcanzados'
  }];
  const team = [{
    name: 'María González',
    role: 'CEO & Co-founder',
    bio: 'Ex-McKinsey. 10 años transformando carreras.',
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&h=200&fit=crop&crop=face'
  }, {
    name: 'Carlos Rodríguez',
    role: 'CTO & Co-founder',
    bio: 'Ex-Google. Ingeniero obsesionado con la IA.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face'
  }, {
    name: 'Ana Martínez',
    role: 'Head of Product',
    bio: 'Ex-Spotify. Diseña experiencias que enamoran.',
    image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=200&h=200&fit=crop&crop=face'
  }];
  return <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 backdrop-blur-xl bg-background/70 border-b border-border/50">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between max-w-7xl">
          <OfficialLogo size="lg" to="/" />
          <ThemeToggle />
        </div>
      </nav>

      {/* Hero */}
      <section className="py-24 md:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent" />
        <div className="container mx-auto px-6 max-w-5xl relative">
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.6
        }} className="text-center">
            <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              Nuestra historia
            </span>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-heading font-bold mb-8 tracking-tight leading-tight">
              Construimos el puente entre{' '}
              <span className="text-primary">quién eres</span> y{' '}
              <span className="text-primary">quién puedes ser</span>
            </h1>
            <p className="text-xl sm:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              MoonJab nació de una frustración universal: encontrar el trabajo ideal no debería ser un proceso tan confuso. Decidimos cambiarlo.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-6 max-w-4xl">
          <motion.div initial={{
          opacity: 0
        }} whileInView={{
          opacity: 1
        }} viewport={{
          once: true
        }} className="text-center">
            <Globe className="h-12 w-12 text-primary mx-auto mb-6" />
            <h2 className="text-3xl sm:text-4xl font-heading font-bold mb-6">
              Nuestra misión
            </h2>
            <p className="text-2xl sm:text-3xl text-muted-foreground leading-relaxed font-light">
              "Democratizar el acceso a herramientas de desarrollo profesional de clase mundial, para que cada persona pueda descubrir y alcanzar su máximo potencial."
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-24">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, i) => <motion.div key={i} initial={{
            opacity: 0,
            y: 20
          }} whileInView={{
            opacity: 1,
            y: 0
          }} viewport={{
            once: true
          }} transition={{
            delay: i * 0.1
          }} className="text-center">
                <p className="text-5xl font-bold text-primary mb-2">{stat.number}</p>
                <p className="text-muted-foreground">{stat.label}</p>
              </motion.div>)}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-heading font-bold mb-4">
              Lo que nos define
            </h2>
            <p className="text-xl text-muted-foreground">
              Cuatro principios que guían cada decisión
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {values.map((value, i) => <motion.div key={i} initial={{
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
                <Card className="p-8 h-full hover:shadow-lg transition-all duration-300 group">
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                    <value.icon className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3">{value.title}</h3>
                  <p className="text-muted-foreground text-lg leading-relaxed">{value.description}</p>
                </Card>
              </motion.div>)}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-24">
        
      </section>

      {/* Awards/Recognition */}
      

      {/* CTA */}
      <section className="py-24 bg-primary text-primary-foreground">
        <div className="container mx-auto px-6 max-w-4xl text-center">
          <h2 className="text-3xl sm:text-4xl font-heading font-bold mb-6">
            ¿Quieres ser parte de esta historia?
          </h2>
          <p className="text-xl opacity-90 mb-8">
            Empieza hoy y transforma tu carrera con Clovely.
          </p>
          <Link to="/registro">
            <Button size="lg" variant="secondary" className="text-lg px-8 py-6 font-semibold">
              Comienza gratis
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t">
        <div className="container mx-auto px-6 text-center">
          <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
            ← Volver al inicio
          </Link>
        </div>
      </footer>
    </div>;
};
export default About;