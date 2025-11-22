import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { OfficialLogo } from '@/components/OfficialLogo';
import { Loader2 } from 'lucide-react';
import { z } from 'zod';

const signupSchema = z.object({
  nombre: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
});

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
});

export default function Auth() {
  const [isLoading, setIsLoading] = useState(false);
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [signupData, setSignupData] = useState({ nombre: '', email: '', password: '' });
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check if user is already logged in
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        // Check if user completed onboarding
        checkOnboardingStatus(session.user.id);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session && event === 'SIGNED_IN') {
        // Check if user completed onboarding
        checkOnboardingStatus(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const checkOnboardingStatus = async (userId: string) => {
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('rol_profesional')
        .eq('id', userId)
        .single();

      // If user has a role, they completed onboarding
      if (profile?.rol_profesional) {
        navigate('/dashboard');
      } else {
        navigate('/onboarding');
      }
    } catch (error) {
      // If profile doesn't exist yet, go to onboarding
      navigate('/onboarding');
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      loginSchema.parse(loginData);
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({
          title: 'Error de validación',
          description: error.errors[0].message,
          variant: 'destructive',
        });
        return;
      }
    }

    setIsLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: loginData.email,
        password: loginData.password,
      });

      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          toast({
            title: 'Error al iniciar sesión',
            description: 'Email o contraseña incorrectos',
            variant: 'destructive',
          });
        } else {
          toast({
            title: 'Error al iniciar sesión',
            description: error.message,
            variant: 'destructive',
          });
        }
      } else {
        toast({
          title: '¡Bienvenido de vuelta!',
          description: 'Has iniciado sesión exitosamente',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Ocurrió un error inesperado',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      signupSchema.parse(signupData);
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({
          title: 'Error de validación',
          description: error.errors[0].message,
          variant: 'destructive',
        });
        return;
      }
    }

    setIsLoading(true);

    try {
      const redirectUrl = `${window.location.origin}/onboarding`;
      
      const { error } = await supabase.auth.signUp({
        email: signupData.email,
        password: signupData.password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            nombre: signupData.nombre,
          },
        },
      });

      if (error) {
        if (error.message.includes('User already registered')) {
          toast({
            title: 'Error al registrarse',
            description: 'Este email ya está registrado. Intenta iniciar sesión.',
            variant: 'destructive',
          });
        } else {
          toast({
            title: 'Error al registrarse',
            description: error.message,
            variant: 'destructive',
          });
        }
      } else {
        toast({
          title: '¡Cuenta creada!',
          description: 'Iniciando tu diagnóstico profesional...',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Ocurrió un error inesperado',
        variant: 'destructive',
      });
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
          <OfficialLogo size="lg" className="mx-auto mb-6" />
          <h1 className="text-4xl font-heading font-bold mb-3">
            Impulsa tu carrera
          </h1>
          <p className="text-muted-foreground text-lg">
            Descubre tu camino profesional ideal
          </p>
        </div>

        <Card className="p-8 backdrop-blur-xl bg-card/95 shadow-clovely-xl border-border/50">
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="login" className="text-base">Iniciar Sesión</TabsTrigger>
              <TabsTrigger value="signup" className="text-base">Registrarse</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="login-email" className="text-base">Email</Label>
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="tu@email.com"
                    value={loginData.email}
                    onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                    disabled={isLoading}
                    required
                    className="h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="login-password" className="text-base">Contraseña</Label>
                  <Input
                    id="login-password"
                    type="password"
                    placeholder="Mínimo 6 caracteres"
                    value={loginData.password}
                    onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                    disabled={isLoading}
                    required
                    className="h-11"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full gradient-orange text-white h-12 text-base font-semibold hover-glow"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Iniciando sesión...
                    </>
                  ) : (
                    'Iniciar Sesión'
                  )}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signup">
              <form onSubmit={handleSignup} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="signup-nombre" className="text-base">Nombre completo</Label>
                  <Input
                    id="signup-nombre"
                    type="text"
                    placeholder="Tu nombre"
                    value={signupData.nombre}
                    onChange={(e) => setSignupData({ ...signupData, nombre: e.target.value })}
                    disabled={isLoading}
                    required
                    className="h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-email" className="text-base">Email</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="tu@email.com"
                    value={signupData.email}
                    onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                    disabled={isLoading}
                    required
                    className="h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-password" className="text-base">Contraseña</Label>
                  <Input
                    id="signup-password"
                    type="password"
                    placeholder="Mínimo 6 caracteres"
                    value={signupData.password}
                    onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                    disabled={isLoading}
                    required
                    className="h-11"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full gradient-blue text-white h-12 text-base font-semibold hover-glow"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Creando cuenta...
                    </>
                  ) : (
                    'Crear Cuenta →'
                  )}
                </Button>

                <p className="text-sm text-center text-muted-foreground mt-4">
                  Al registrarte, comenzarás tu diagnóstico profesional personalizado
                </p>
              </form>
            </TabsContent>
          </Tabs>

          <div className="mt-6 pt-6 border-t border-border/50">
            <div className="bg-primary/10 rounded-lg p-4 text-center">
              <p className="text-sm font-medium text-primary mb-1">
                🎉 7 días gratis de Premium
              </p>
              <p className="text-xs text-muted-foreground">
                Acceso completo a todas las funcionalidades
              </p>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
