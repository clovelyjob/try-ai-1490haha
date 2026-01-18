import { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { OfficialLogo } from '@/components/OfficialLogo';
import { Loader2, Mail, KeyRound, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react';
import { z } from 'zod';

const emailSchema = z.string().email('Email inválido');

type AuthStep = 'email' | 'code' | 'success';

export default function CodeAuth() {
  const [step, setStep] = useState<AuthStep>('email');
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [code, setCode] = useState(['', '', '', '', '', '', '', '']);
  const [devCode, setDevCode] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(0);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const codeInputRefs = useRef<(HTMLInputElement | null)[]>([]);
  
  const role = searchParams.get('role') || 'user';
  const isUniversityAdmin = role === 'university_admin';

  // Countdown timer for resend
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const redirectBasedOnRole = async (userId: string, isNewUser: boolean = false) => {
    try {
      // For new users, always go to onboarding (unless university admin)
      if (isNewUser && !isUniversityAdmin) {
        navigate('/onboarding');
        return;
      }

      // Check if university admin
      const { data: universityAdmin } = await supabase
        .from('university_admins')
        .select('id')
        .eq('user_id', userId)
        .maybeSingle();

      if (universityAdmin) {
        navigate('/universidad/dashboard');
        return;
      }

      // Check profile for role and diagnostic completion
      const { data: profile } = await supabase
        .from('profiles')
        .select('user_role, rol_profesional')
        .eq('id', userId)
        .single();

      if (profile?.user_role === 'university_admin') {
        navigate('/universidad/dashboard');
      } else if (profile?.user_role === 'admin') {
        navigate('/dashboard/admin');
      } else if (profile?.rol_profesional) {
        // Diagnostic completed → dashboard
        navigate('/dashboard');
      } else {
        // Diagnostic not completed → onboarding
        navigate('/onboarding');
      }
    } catch {
      // Safe default: students go to onboarding, university admins to their dashboard
      if (isUniversityAdmin) {
        navigate('/universidad/dashboard');
      } else {
        navigate('/onboarding');
      }
    }
  };

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      emailSchema.parse(email);
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast.error(error.errors[0].message);
        return;
      }
    }

    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('send-verification-code', {
        body: { email, role },
      });

      if (error) throw error;

      if (data.devCode) {
        // Dev mode - show the code
        setDevCode(data.devCode);
        toast.info(`Código de desarrollo: ${data.devCode}`, { duration: 30000 });
      } else {
        toast.success('Código enviado a tu correo');
      }

      setStep('code');
      setCountdown(60);
    } catch (error: any) {
      console.error('Error sending code:', error);
      toast.error(error.message || 'Error al enviar código');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCodeChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return; // Only allow digits

    const newCode = [...code];
    newCode[index] = value.slice(-1); // Only take last digit
    setCode(newCode);

    // Auto-focus next input
    if (value && index < 7) {
      codeInputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all digits entered
    if (newCode.every(d => d !== '') && newCode.join('').length === 8) {
      handleVerifyCode(newCode.join(''));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      codeInputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 8);
    const newCode = [...code];
    
    for (let i = 0; i < 8; i++) {
      newCode[i] = pasted[i] || '';
    }
    
    setCode(newCode);
    
    if (pasted.length === 8) {
      handleVerifyCode(pasted);
    }
  };

  const handleVerifyCode = async (codeString?: string) => {
    const verificationCode = codeString || code.join('');
    
    if (verificationCode.length !== 8) {
      toast.error('Ingresa el código completo de 8 dígitos');
      return;
    }

    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('verify-code', {
        body: { 
          email, 
          code: verificationCode, 
          role,
          name: name || undefined,
        },
      });

      if (error) throw error;

      if (!data.success) {
        throw new Error(data.error || 'Verification failed');
      }

      // Use the token to verify OTP
      const { data: authData, error: authError } = await supabase.auth.verifyOtp({
        email: data.email,
        token: data.token,
        type: 'magiclink',
      });

      if (authError) throw authError;

      setStep('success');
      toast.success(data.isNewUser ? '¡Cuenta creada exitosamente!' : '¡Bienvenido de vuelta!');
      
      // Redirect after brief delay
      setTimeout(() => {
        redirectBasedOnRole(authData.user!.id, data.isNewUser);
      }, 1500);
    } catch (error: any) {
      console.error('Error verifying code:', error);
      toast.error(error.message || 'Código inválido o expirado');
      setCode(['', '', '', '', '', '', '', '']);
      codeInputRefs.current[0]?.focus();
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (countdown > 0) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('send-verification-code', {
        body: { email, role },
      });

      if (error) throw error;

      if (data.devCode) {
        setDevCode(data.devCode);
        toast.info(`Nuevo código: ${data.devCode}`, { duration: 30000 });
      } else {
        toast.success('Nuevo código enviado');
      }
      
      setCountdown(60);
      setCode(['', '', '', '', '', '', '', '']);
    } catch (error: any) {
      toast.error(error.message || 'Error al reenviar código');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen gradient-soft flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <Link to="/">
            <OfficialLogo size="lg" className="mx-auto mb-6" />
          </Link>
          <h1 className="text-3xl font-heading font-bold mb-2">
            {isUniversityAdmin ? 'Portal Universidades' : 'Iniciar Sesión'}
          </h1>
          <p className="text-muted-foreground">
            Sin contraseñas, solo tu correo
          </p>
        </div>

        <Card className="p-8 backdrop-blur-xl bg-card/95 shadow-clovely-xl border-border/50">
          <AnimatePresence mode="wait">
            {step === 'email' && (
              <motion.form
                key="email-step"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                onSubmit={handleSendCode}
                className="space-y-5"
              >
                <div className="w-16 h-16 mx-auto bg-primary/10 rounded-2xl flex items-center justify-center mb-6">
                  <Mail className="w-8 h-8 text-primary" />
                </div>

                {isUniversityAdmin && (
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-base">Nombre</Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="Tu nombre completo"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      disabled={isLoading}
                      className="h-11"
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-base">Correo electrónico</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="tu@correo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                    required
                    autoComplete="email"
                    className="h-11"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full gradient-orange text-white h-12 text-base font-semibold hover-glow"
                  disabled={isLoading || !email}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Enviando código...
                    </>
                  ) : (
                    'Enviar código de acceso'
                  )}
                </Button>

                <p className="text-sm text-center text-muted-foreground">
                  Te enviaremos un código de 8 dígitos para verificar tu identidad
                </p>
              </motion.form>
            )}

            {step === 'code' && (
              <motion.div
                key="code-step"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <button
                  onClick={() => setStep('email')}
                  className="flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <ArrowLeft className="w-4 h-4 mr-1" />
                  Cambiar correo
                </button>

                <div className="w-16 h-16 mx-auto bg-primary/10 rounded-2xl flex items-center justify-center">
                  <KeyRound className="w-8 h-8 text-primary" />
                </div>

                <div className="text-center">
                  <h2 className="text-xl font-semibold mb-1">Ingresa tu código</h2>
                  <p className="text-sm text-muted-foreground">
                    Enviado a <span className="font-medium text-foreground">{email}</span>
                  </p>
                </div>

                {devCode && (
                  <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg p-3">
                    <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400">
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />
                      <span className="text-sm font-medium">Modo desarrollo</span>
                    </div>
                    <p className="text-2xl font-mono font-bold text-center mt-2 tracking-widest">
                      {devCode}
                    </p>
                  </div>
                )}

                <div 
                  className="flex justify-center gap-2"
                  onPaste={handlePaste}
                >
                  {code.map((digit, index) => (
                    <Input
                      key={index}
                      ref={(el) => (codeInputRefs.current[index] = el)}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleCodeChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      disabled={isLoading}
                      className="w-10 h-12 text-center text-xl font-mono font-bold p-0"
                      autoFocus={index === 0}
                    />
                  ))}
                </div>

                <Button
                  onClick={() => handleVerifyCode()}
                  className="w-full gradient-orange text-white h-12 text-base font-semibold hover-glow"
                  disabled={isLoading || code.some(d => d === '')}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Verificando...
                    </>
                  ) : (
                    'Verificar código'
                  )}
                </Button>

                <div className="text-center">
                  <button
                    onClick={handleResend}
                    disabled={countdown > 0 || isLoading}
                    className="text-sm text-primary hover:underline disabled:text-muted-foreground disabled:no-underline"
                  >
                    {countdown > 0 
                      ? `Reenviar código en ${countdown}s` 
                      : 'Reenviar código'}
                  </button>
                </div>
              </motion.div>
            )}

            {step === 'success' && (
              <motion.div
                key="success-step"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-8"
              >
                <div className="w-20 h-20 mx-auto bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-6">
                  <CheckCircle className="w-10 h-10 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-green-600 mb-2">
                  ¡Verificación exitosa!
                </h2>
                <p className="text-muted-foreground">
                  Redirigiendo...
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </Card>

        <p className="text-center text-sm text-muted-foreground mt-6">
          {isUniversityAdmin ? (
            <Link to="/universidades" className="text-primary hover:underline">
              ← Volver a Universidades
            </Link>
          ) : (
            <>
              ¿Primera vez aquí?{' '}
              <span className="text-foreground">Ingresa tu correo y te crearemos una cuenta automáticamente</span>
            </>
          )}
        </p>
      </motion.div>
    </div>
  );
}
