import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Mail, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { DecoratedLogo } from '@/components/DecoratedLogo';
import { supabase } from '@/integrations/supabase/client';
import { z } from 'zod';

const emailSchema = z.object({
  email: z.string().email('Email inválido'),
});

const ForgotPassword = () => {
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [email, setEmail] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      emailSchema.parse({ email });
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast.error(error.errors[0].message);
        return;
      }
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;

      setEmailSent(true);
      toast.success('Correo de recuperación enviado');
    } catch (error: any) {
      console.error('Password reset error:', error);
      toast.error('Error al enviar correo de recuperación');
    } finally {
      setLoading(false);
    }
  };

  if (emailSent) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-background to-primary/5">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md"
        >
          <Card className="p-8 rounded-2xl shadow-clovely-lg border-2 border-green-200 bg-gradient-to-br from-green-50/50 to-emerald-50/30">
            <div className="text-center space-y-4">
              <div className="mx-auto w-20 h-20 bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl flex items-center justify-center shadow-clovely-md">
                <CheckCircle className="h-10 w-10 text-green-600" />
              </div>
              <h2 className="text-2xl font-heading font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">Correo Enviado</h2>
              <p className="text-muted-foreground">
                Hemos enviado un enlace de recuperación a <strong className="text-foreground">{email}</strong>
              </p>
              <p className="text-sm text-muted-foreground">
                Revisa tu bandeja de entrada y sigue las instrucciones para restablecer tu contraseña.
              </p>
              <Link to="/login">
                <Button variant="outline" className="w-full mt-4 shadow-clovely-sm hover:shadow-clovely-md hover:-translate-y-0.5 transition-all duration-300">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Volver al inicio de sesión
                </Button>
              </Link>
            </div>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-background to-primary/5">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="mb-8">
          <Link to="/">
            <DecoratedLogo className="mx-auto" />
          </Link>
        </div>

        <Card className="p-8 rounded-2xl shadow-clovely-lg border-2">
          <div className="space-y-6">
            <div className="space-y-2 text-center">
              <div className="mx-auto w-16 h-16 bg-gradient-to-br from-primary/10 to-primary-warm/20 rounded-2xl flex items-center justify-center mb-4 shadow-clovely-sm">
                <Mail className="h-8 w-8 text-primary" />
              </div>
              <h2 className="text-2xl font-heading font-bold bg-gradient-to-r from-primary to-primary-warm bg-clip-text text-transparent">Recuperar Contraseña</h2>
              <p className="text-muted-foreground">
                Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Correo Electrónico</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="tu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  className="shadow-clovely-sm focus-visible:shadow-clovely-md transition-all duration-300"
                />
              </div>

              <Button
                type="submit"
                variant="premium"
                className="w-full shadow-clovely-glow"
                disabled={loading}
              >
                {loading ? 'Enviando...' : 'Enviar Enlace de Recuperación'}
              </Button>
            </form>

            <div className="text-center">
              <Link to="/login">
                <Button variant="ghost" size="sm" className="hover:shadow-clovely-sm transition-all duration-300">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Volver al inicio de sesión
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;