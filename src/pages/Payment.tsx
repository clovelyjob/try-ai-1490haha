import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { OfficialLogo } from '@/components/OfficialLogo';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Check, ArrowLeft, ArrowRight, Crown, Loader2, Shield, CreditCard, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useSubscription, MOONJAB_PRO } from '@/hooks/useSubscription';
import { Badge } from '@/components/ui/badge';

const PRO_FEATURES = [
  'Todas las plantillas de CV',
  'Entrevistas ilimitadas con IA',
  'Oportunidades personalizadas con match score',
  'Coach IA personalizado 24/7',
  'Diagnóstico completo RIASEC',
  'Exportación PDF ilimitada',
  'Soporte prioritario',
];

const Payment = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { subscribed, productId, openCheckout, checkSubscription } = useSubscription();

  const isProActive = subscribed && productId === MOONJAB_PRO.product_id;
  const status = searchParams.get('status');

  // Handle return from Stripe
  useEffect(() => {
    if (status === 'success') {
      void checkSubscription();
      toast.success('¡Pago completado! Tu plan Pro está activo.');
      // Redirect to dashboard after brief delay
      const timer = setTimeout(() => navigate('/dashboard?subscription=success'), 2000);
      return () => clearTimeout(timer);
    }
    if (status === 'cancelled') {
      toast.error('El pago no se completó. Puedes intentarlo de nuevo.');
    }
  }, [status, checkSubscription, navigate]);

  // Redirect if already Pro (and not coming from a status callback)
  useEffect(() => {
    if (isProActive && !status) {
      toast.info('Ya tienes el plan Pro activo');
      navigate('/dashboard');
    }
  }, [isProActive, status, navigate]);

  const handleCheckout = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      toast.info('Inicia sesión para continuar con el pago');
      navigate('/login');
      return;
    }

    setLoading(true);
    try {
      await openCheckout();
    } catch (err: any) {
      toast.error('Error al iniciar el pago: ' + (err.message || 'Intenta de nuevo'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="sticky top-0 z-50 backdrop-blur-xl bg-background/80 border-b border-border/40">
        <div className="container mx-auto px-6 h-14 flex items-center justify-between max-w-5xl">
          <OfficialLogo size="md" to="/" />
          <ThemeToggle />
        </div>
      </nav>

      <div className="container mx-auto px-6 max-w-xl py-12 sm:py-20">
        {/* Cancelled state */}
        {status === 'cancelled' && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 p-4 rounded-xl border border-destructive/30 bg-destructive/5"
          >
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-foreground">Pago no completado</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Tu suscripción no fue procesada. Puedes intentarlo de nuevo cuando quieras.
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Success state */}
        {status === 'success' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16"
          >
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <Crown className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight mb-2">¡Bienvenido a Pro!</h1>
            <p className="text-muted-foreground mb-6">Tu suscripción está activa. Redirigiendo al dashboard...</p>
            <Loader2 className="h-5 w-5 animate-spin text-primary mx-auto" />
          </motion.div>
        )}

        {/* Main payment review */}
        {status !== 'success' && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2">
                Completa tu suscripción
              </h1>
              <p className="text-muted-foreground text-sm">
                Revisa los detalles de tu plan antes de continuar
              </p>
            </div>

            {/* Plan card */}
            <div className="rounded-xl border border-primary/20 bg-primary/[0.02] p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Crown className="h-5 w-5 text-primary" />
                  <h2 className="font-semibold text-lg">Plan Pro</h2>
                </div>
                <Badge className="bg-primary/10 text-primary border-primary/20 text-xs">
                  Mensual
                </Badge>
              </div>

              <div className="flex items-baseline gap-1 mb-5">
                <span className="text-4xl font-bold">$15</span>
                <span className="text-muted-foreground">/mes</span>
              </div>

              <div className="border-t border-border/40 pt-4">
                <p className="text-xs font-medium text-muted-foreground mb-3 uppercase tracking-wider">
                  Incluye
                </p>
                <ul className="space-y-2.5">
                  {PRO_FEATURES.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-foreground/80">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Payment info */}
            <div className="rounded-xl border border-border/40 p-4 mb-6">
              <div className="flex items-center gap-2 mb-3">
                <CreditCard className="h-4 w-4 text-muted-foreground" />
                <p className="text-sm font-medium">Resumen del pago</p>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Plan Pro (mensual)</span>
                  <span className="font-medium">$15.00</span>
                </div>
                <div className="flex justify-between border-t border-border/30 pt-2">
                  <span className="font-medium">Total hoy</span>
                  <span className="font-bold text-primary">$15.00</span>
                </div>
              </div>
            </div>

            {/* CTA */}
            <Button
              className="w-full h-12 text-sm font-medium gap-2"
              onClick={handleCheckout}
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  Continuar al pago
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>

            {/* Trust signals */}
            <div className="flex items-center justify-center gap-4 mt-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Shield className="h-3 w-3" />
                <span>Pago seguro con Stripe</span>
              </div>
              <span>•</span>
              <span>Cancela cuando quieras</span>
            </div>

            {/* Back link */}
            <div className="text-center mt-8">
              <Link
                to="/pricing"
                className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="h-3 w-3" /> Volver a planes
              </Link>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Payment;
