import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { OfficialLogo } from '@/components/OfficialLogo';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Link, useNavigate } from 'react-router-dom';
import { Check, ArrowRight, ArrowLeft, Zap, Sparkles, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const MOONJAB_PRO = {
  price_id: "price_1TBPv4E84vzDx9ysTSlmjd2j",
  product_id: "prod_U9jNmi5ibVDe1c",
};

const Pricing = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubscribe = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      toast.info('Inicia sesión o crea una cuenta para suscribirte');
      navigate('/auth');
      return;
    }
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-checkout');
      if (error) throw error;
      if (data?.url) {
        window.open(data.url, '_blank');
      }
    } catch (err: any) {
      toast.error('Error al iniciar el pago: ' + (err.message || 'Intenta de nuevo'));
    } finally {
      setLoading(false);
    }
  };

  const plans = [
    {
      name: 'Modo invitado',
      icon: Zap,
      price: '$0',
      period: '',
      description: 'Explora las funciones básicas',
      features: [
        '1 plantilla de CV',
        'Oportunidades genéricas',
        'Diagnóstico básico',
        'Funciones limitadas',
      ],
      cta: 'Probar gratis',
      action: () => { window.location.href = '/guest-start'; },
      popular: false,
    },
    {
      name: 'Pro',
      icon: Sparkles,
      price: '$15',
      period: '/mes',
      description: 'Todo lo que necesitas para crecer',
      features: [
        'Todas las plantillas de CV',
        'Entrevistas ilimitadas con IA',
        'Oportunidades personalizadas',
        'Match score inteligente',
        'Coach IA personalizado 24/7',
        'Diagnóstico completo RIASEC',
        'Exportación PDF ilimitada',
        'Soporte prioritario',
      ],
      cta: 'Suscribirse por $15/mes',
      action: handleSubscribe,
      popular: true,
    },
  ];

  const faqs = [
    { q: '¿Puedo cancelar en cualquier momento?', a: 'Sí. Puedes cancelar tu suscripción cuando quieras desde tu configuración. No hay penalizaciones ni compromisos de permanencia.' },
    { q: '¿Qué métodos de pago aceptan?', a: 'Procesamos los pagos de forma segura a través de Stripe. Aceptamos Visa, Mastercard y las principales tarjetas de crédito y débito.' },
    { q: '¿Qué puedo hacer en modo invitado?', a: 'Puedes explorar la plataforma con funciones limitadas: 1 plantilla de CV, oportunidades genéricas y un diagnóstico básico. Es ideal para conocer MoonJab antes de suscribirte.' },
    { q: '¿Qué se desbloquea con el plan Pro?', a: 'Acceso a todas las plantillas de CV, entrevistas ilimitadas con IA, oportunidades personalizadas con match score, diagnóstico completo RIASEC, coach IA 24/7 y exportación PDF ilimitada.' },
    { q: '¿Se renueva automáticamente?', a: 'Sí, la suscripción se renueva cada mes. Puedes cancelar antes de la siguiente fecha de cobro para evitar cargos futuros.' },
    { q: '¿Mis datos están seguros?', a: 'Absolutamente. Tus datos personales y CVs están protegidos con encriptación. Nunca compartimos tu información con terceros.' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <nav className="sticky top-0 z-50 backdrop-blur-xl bg-background/80 border-b border-border/40">
        <div className="container mx-auto px-6 h-14 flex items-center justify-between max-w-5xl">
          <OfficialLogo size="md" to="/" />
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button size="sm" className="h-8 text-sm" onClick={handleSubscribe} disabled={loading}>
              {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : 'Suscribirse'}
            </Button>
          </div>
        </div>
      </nav>

      <section className="py-16 sm:py-24">
        <div className="container mx-auto px-6 max-w-4xl text-center">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3">
              Planes simples, sin sorpresas
            </h1>
            <p className="text-muted-foreground max-w-lg mx-auto">
              Elige el plan que se adapte a tus metas. Cambia o cancela cuando quieras.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="pb-20">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="grid sm:grid-cols-2 gap-5 max-w-2xl mx-auto">
            {plans.map((plan, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                className={plan.popular ? 'lg:-mt-3' : ''}
              >
                <div className={`p-6 h-full rounded-xl border transition-all duration-200 flex flex-col ${
                  plan.popular
                    ? 'border-primary/30 bg-primary/[0.02] shadow-clovely-md'
                    : 'border-border/50 hover:border-primary/15'
                }`}>
                  {plan.popular && (
                    <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-medium mb-4 w-fit">
                      <Sparkles className="h-2.5 w-2.5" />
                      Recomendado
                    </div>
                  )}

                  <div className="w-9 h-9 rounded-lg bg-primary/8 flex items-center justify-center mb-4">
                    <plan.icon className="h-4 w-4 text-primary" />
                  </div>

                  <h3 className="font-semibold text-lg mb-0.5">{plan.name}</h3>
                  <p className="text-xs text-muted-foreground mb-4">{plan.description}</p>

                  <div className="flex items-baseline gap-0.5 mb-5">
                    <span className="text-3xl font-bold">{plan.price}</span>
                    <span className="text-sm text-muted-foreground">{plan.period}</span>
                  </div>

                  <ul className="space-y-2 mb-6 flex-1">
                    {plan.features.map((f, j) => (
                      <li key={j} className="flex items-start gap-2">
                        <Check className="h-3.5 w-3.5 text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-foreground/80">{f}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    className="w-full h-9 text-sm"
                    variant={plan.popular ? 'default' : 'outline'}
                    onClick={plan.action}
                    disabled={plan.popular && loading}
                  >
                    {plan.popular && loading ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin mr-2" />
                    ) : null}
                    {plan.cta}
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 border-y border-border/40">
        <div className="container mx-auto px-6 max-w-3xl">
          <h2 className="text-xl font-semibold text-center mb-8">Preguntas frecuentes</h2>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div key={i} className="p-4 rounded-lg border border-border/40 hover:border-primary/10 transition-colors">
                <h3 className="font-medium text-sm mb-1">{faq.q}</h3>
                <p className="text-sm text-muted-foreground">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-6 text-center max-w-lg">
          <h2 className="text-2xl font-bold mb-3 tracking-tight">Empieza hoy</h2>
          <p className="text-muted-foreground mb-5">Únete a miles de profesionales que ya dieron el primer paso.</p>
          <Button className="h-10 px-6 text-sm gap-2" onClick={handleSubscribe} disabled={loading}>
            {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <>Suscribirse <ArrowRight className="h-3.5 w-3.5" /></>}
          </Button>
        </div>
      </section>

      <footer className="py-6 border-t border-border/40">
        <div className="container mx-auto px-6 text-center">
          <Link to="/" className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-3 w-3" /> Volver al inicio
          </Link>
        </div>
      </footer>
    </div>
  );
};

export default Pricing;
