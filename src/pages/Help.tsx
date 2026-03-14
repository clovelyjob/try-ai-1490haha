import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { OfficialLogo } from '@/components/OfficialLogo';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Link } from 'react-router-dom';
import { Search, MessageCircle, Mail, FileText, Target, Sparkles, HelpCircle, ArrowRight, BookOpen, Video, Users } from 'lucide-react';
import { ElevenLabsWidget } from '@/components/help/ElevenLabsWidget';

const Help = () => {
  const categories = [{
    icon: Target,
    title: 'Diagnóstico de Carrera',
    description: 'Entiende cómo funciona el test RIASEC',
    articles: 5
  }, {
    icon: FileText,
    title: 'Creación de CV',
    description: 'Guías para optimizar tu currículum',
    articles: 8
  }, {
    icon: Sparkles,
    title: 'Simulador de Entrevistas',
    description: 'Aprovecha al máximo las prácticas',
    articles: 6
  }, {
    icon: Users,
    title: 'Cuenta y Facturación',
    description: 'Planes, pagos y configuración',
    articles: 10
  }];
  const faqs = [{
    question: '¿Cómo funciona el diagnóstico de carrera?',
    answer: 'Nuestro diagnóstico utiliza el modelo RIASEC (Holland Codes), un framework científico reconocido mundialmente y utilizado por el Departamento de Trabajo de EE.UU. Responderás 42 preguntas sobre tus intereses y preferencias, y recibirás un perfil personalizado con tu código Holland (como "AIS" - Artístico, Investigativo, Social) junto con recomendaciones de carreras que mejor se adaptan a tu personalidad profesional.'
  }, {
    question: '¿Puedo cancelar mi suscripción en cualquier momento?',
    answer: 'Sí, puedes cancelar tu suscripción cuando quieras desde la sección de Configuración > Suscripción. No hay penalizaciones ni preguntas. Tu acceso continuará hasta el final del período de facturación actual. Si cancelas dentro de los primeros 7 días, recibirás un reembolso completo.'
  }, {
    question: '¿Cómo exporto mi CV a PDF?',
    answer: 'Una vez que hayas creado tu CV en el editor, simplemente haz clic en el botón "Exportar" en la esquina superior derecha. Tu CV se descargará automáticamente en formato PDF, optimizado para sistemas ATS (Applicant Tracking Systems) y listo para enviar a empleadores.'
  }, {
    question: '¿Las oportunidades de trabajo son reales?',
    answer: 'Sí, todas las oportunidades provienen de fuentes verificadas como LinkedIn, Indeed, Glassdoor y otras plataformas de empleo reconocidas. Utilizamos la API de JSearch para traerte ofertas actualizadas constantemente. Cada oportunidad incluye un enlace directo para aplicar en la fuente original.'
  }, {
    question: '¿Cómo funciona el simulador de entrevistas?',
    answer: 'Nuestro simulador genera 10 preguntas realistas basadas en el puesto, nivel de experiencia y descripción del trabajo que proporciones. Puedes responder por texto o video. Nuestra IA analiza tus respuestas y te da feedback detallado sobre contenido, estructura, y áreas de mejora específicas.'
  }, {
    question: '¿Qué métodos de pago aceptan?',
    answer: 'Aceptamos todas las tarjetas principales (Visa, Mastercard, American Express), PayPal, y en algunos países transferencia bancaria. Todos los pagos son procesados de forma segura a través de Stripe. Ofrecemos facturación mensual y anual (con 2 meses gratis).'
  }, {
    question: '¿Hay descuento para estudiantes?',
    answer: 'Sí, ofrecemos 50% de descuento para estudiantes con email .edu verificado. Contáctanos en moonjab.com@gmail.com con tu correo institucional para obtener tu código de descuento.'
  }, {
    question: '¿Mis datos están seguros?',
    answer: 'Absolutamente. Utilizamos encriptación de nivel bancario (256-bit SSL), almacenamiento seguro en la nube con AWS, y nunca vendemos ni compartimos tu información personal. Cumplimos con GDPR y las mejores prácticas de privacidad de datos.'
  }];
  const resources = [{
    icon: BookOpen,
    title: 'Guías paso a paso',
    description: 'Tutoriales detallados para cada función',
    href: '/blog'
  }, {
    icon: Video,
    title: 'Video tutoriales',
    description: 'Aprende visualmente en minutos',
    href: '#'
  }, {
    icon: Users,
    title: 'Comunidad',
    description: 'Conecta con otros profesionales',
    href: '#'
  }];

  const openElevenLabsWidget = () => {
    // Find and click the Eleven Labs widget button to open it
    const widget = document.querySelector('elevenlabs-convai');
    if (widget?.shadowRoot) {
      const button = widget.shadowRoot.querySelector('button');
      if (button) {
        button.click();
      }
    }
  };

  return <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 backdrop-blur-xl bg-background/70 border-b border-border/50">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between max-w-7xl">
          <OfficialLogo size="lg" to="/" />
          <ThemeToggle />
        </div>
      </nav>

      {/* Hero */}
      <section className="py-20 md:py-28 bg-gradient-to-b from-primary/5 to-transparent">
        <div className="container mx-auto px-6 max-w-4xl text-center">
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }}>
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <HelpCircle className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-bold mb-6 tracking-tight">
              Centro de Ayuda
            </h1>
            <p className="text-xl text-muted-foreground mb-10">
              ¿Cómo podemos ayudarte hoy?
            </p>
            
            {/* Search */}
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input placeholder="Buscar en la ayuda..." className="h-14 pl-14 pr-6 text-lg rounded-2xl border-2 focus:border-primary" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16">
        <div className="container mx-auto px-6 max-w-6xl">
          <h2 className="text-2xl font-bold mb-8 text-center">Explora por categoría</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((cat, i) => <motion.div key={i} initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            delay: i * 0.1
          }}>
                <Card className="p-6 hover:shadow-lg hover:border-primary/50 transition-all cursor-pointer group h-full">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                    <cat.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-bold mb-2 group-hover:text-primary transition-colors">{cat.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{cat.description}</p>
                  <p className="text-xs text-primary font-medium">{cat.articles} artículos</p>
                </Card>
              </motion.div>)}
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-6 max-w-3xl">
          <h2 className="text-3xl font-bold text-center mb-12">Preguntas Frecuentes</h2>
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, i) => <motion.div key={i} initial={{
            opacity: 0,
            y: 10
          }} whileInView={{
            opacity: 1,
            y: 0
          }} viewport={{
            once: true
          }} transition={{
            delay: i * 0.05
          }}>
                <AccordionItem value={`item-${i}`} className="bg-background rounded-xl px-6 border shadow-sm">
                  <AccordionTrigger className="text-left font-medium py-5 hover:no-underline">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground pb-5 leading-relaxed">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              </motion.div>)}
          </Accordion>
        </div>
      </section>

      {/* Resources */}
      <section className="py-16">
        <div className="container mx-auto px-6 max-w-4xl">
          <h2 className="text-2xl font-bold text-center mb-8">Más recursos</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {resources.map((res, i) => <Link key={i} to={res.href}>
                <Card className="p-6 hover:shadow-lg hover:border-primary/50 transition-all group h-full text-center">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                    <res.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-bold mb-2 group-hover:text-primary transition-colors">{res.title}</h3>
                  <p className="text-sm text-muted-foreground">{res.description}</p>
                </Card>
              </Link>)}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">¿No encontraste lo que buscabas?</h2>
            <p className="text-muted-foreground">Nuestro equipo está aquí para ayudarte</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Card className="p-8 hover:shadow-lg transition-all">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
                <MessageCircle className="h-7 w-7 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Chat en vivo</h3>
              <p className="text-muted-foreground mb-6">Habla con nuestro asistente de voz con IA. Disponible 24/7.</p>
              <Button className="w-full" onClick={openElevenLabsWidget}>
                Iniciar chat
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Card>

            <Card className="p-8 hover:shadow-lg transition-all">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
                <Mail className="h-7 w-7 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Envíanos un email</h3>
              <p className="text-muted-foreground mb-6">
                Escríbenos y te responderemos en menos de 24 horas hábiles.
              </p>
              <Button variant="outline" className="w-full" asChild>
                <a href="mailto:moonjab.com@gmail.com">moonjab.com@gmail.com</a>
              </Button>
            </Card>
          </div>
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
      
      {/* ElevenLabs Voice Widget */}
      <ElevenLabsWidget />
    </div>;
};
export default Help;