import { OfficialLogo } from '@/components/OfficialLogo';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Search, MessageCircle, Mail } from 'lucide-react';

const Help = () => {
  const faqs = [
    {
      question: '¿Cómo funciona el diagnóstico de carrera?',
      answer: 'Nuestro diagnóstico utiliza el modelo RIASEC, un framework científico reconocido mundialmente. Responderás 42 preguntas sobre tus intereses y preferencias, y recibirás un perfil personalizado con recomendaciones de carreras compatibles.'
    },
    {
      question: '¿Puedo cancelar mi suscripción en cualquier momento?',
      answer: 'Sí, puedes cancelar tu suscripción cuando quieras sin penalizaciones. Tu acceso continuará hasta el final del período de facturación actual.'
    },
    {
      question: '¿Cómo exporto mi CV?',
      answer: 'Una vez que hayas creado tu CV, simplemente haz clic en el botón "Exportar" y se descargará automáticamente en formato PDF listo para enviar a empleadores.'
    },
    {
      question: '¿Las oportunidades de trabajo son reales?',
      answer: 'Sí, todas las oportunidades provienen de fuentes verificadas como LinkedIn, Indeed y otras plataformas de empleo reconocidas. Actualizamos las ofertas constantemente.'
    },
    {
      question: '¿Cómo funciona el simulador de entrevistas?',
      answer: 'Nuestro simulador genera preguntas realistas basadas en el puesto que selecciones. Puedes responder por texto o video, y recibirás feedback detallado sobre tu desempeño.'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <nav className="sticky top-0 z-50 backdrop-blur-xl bg-background/70 border-b border-border/50">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between max-w-7xl">
          <OfficialLogo size="lg" to="/" />
          <ThemeToggle />
        </div>
      </nav>

      <div className="container mx-auto px-6 py-20 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-heading font-bold mb-4">
            Centro de Ayuda
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            ¿Cómo podemos ayudarte hoy?
          </p>
          <div className="relative max-w-xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input 
              placeholder="Buscar en la ayuda..." 
              className="pl-12 h-12"
            />
          </div>
        </div>

        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-6">Preguntas Frecuentes</h2>
          <Accordion type="single" collapsible className="space-y-2">
            {faqs.map((faq, i) => (
              <AccordionItem key={i} value={`item-${i}`} className="border rounded-lg px-4">
                <AccordionTrigger className="text-left font-medium">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="p-6">
            <MessageCircle className="h-8 w-8 text-primary mb-4" />
            <h3 className="text-xl font-bold mb-2">Chat en vivo</h3>
            <p className="text-muted-foreground mb-4">
              Habla con nuestro equipo de soporte en tiempo real.
            </p>
            <Button>Iniciar chat</Button>
          </Card>
          <Card className="p-6">
            <Mail className="h-8 w-8 text-primary mb-4" />
            <h3 className="text-xl font-bold mb-2">Envíanos un email</h3>
            <p className="text-muted-foreground mb-4">
              Te responderemos en menos de 24 horas.
            </p>
            <Button variant="outline">soporte@clovely.com</Button>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Help;
