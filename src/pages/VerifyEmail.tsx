import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Mail, RefreshCw } from 'lucide-react';
import { OfficialLogo } from '@/components/OfficialLogo';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const VerifyEmail = () => {
  const location = useLocation();
  const email = (location.state as { email?: string })?.email || '';
  const [resending, setResending] = useState(false);

  const handleResend = async () => {
    if (!email) {
      toast.error('No se encontró el email. Regístrate de nuevo.');
      return;
    }
    setResending(true);
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email,
        options: { emailRedirectTo: `${window.location.origin}/onboarding` },
      });
      if (error) throw error;
      toast.success('Correo de verificación reenviado');
    } catch {
      toast.error('Error al reenviar el correo');
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-sm text-center"
      >
        <OfficialLogo size="md" className="mb-8 mx-auto" />

        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
          <Mail className="h-8 w-8 text-primary" />
        </div>

        <h1 className="text-xl font-bold mb-2 tracking-tight">Revisa tu correo</h1>
        <p className="text-sm text-muted-foreground mb-1">
          Hemos enviado un link de confirmación a:
        </p>
        {email && (
          <p className="text-sm font-medium text-foreground mb-6">{email}</p>
        )}
        {!email && (
          <p className="text-sm text-muted-foreground mb-6">tu correo electrónico</p>
        )}

        <p className="text-xs text-muted-foreground mb-6">
          Haz clic en el enlace del correo para verificar tu cuenta y comenzar tu diagnóstico profesional.
        </p>

        <Button
          variant="outline"
          className="w-full h-10 text-sm mb-3"
          onClick={handleResend}
          disabled={resending}
        >
          {resending ? (
            <>
              <RefreshCw className="mr-2 h-3.5 w-3.5 animate-spin" />
              Reenviando...
            </>
          ) : (
            <>
              <RefreshCw className="mr-2 h-3.5 w-3.5" />
              Reenviar correo
            </>
          )}
        </Button>

        <div className="space-y-2 mt-6">
          <p className="text-xs text-muted-foreground">
            ¿No lo encuentras? Revisa tu carpeta de spam.
          </p>
          <Link
            to="/login"
            className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline"
          >
            <ArrowLeft className="h-3 w-3" /> Volver a iniciar sesión
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default VerifyEmail;
