import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Chrome, Linkedin, ArrowLeft } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { toast } from 'sonner';
import { DecoratedLogo } from '@/components/DecoratedLogo';
import { supabase } from '@/integrations/supabase/client';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
});

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    remember: false,
  });

  const handleGoogleLogin = async () => {
    try {
      await useAuthStore.getState().signInWithGoogle();
      toast.success('Redirigiendo a Google...');
    } catch (error: any) {
      console.error('Google login error:', error);
      toast.error('Error al conectar con Google');
    }
  };

  const handleLinkedInLogin = async () => {
    try {
      await useAuthStore.getState().signInWithLinkedIn();
      toast.success('Redirigiendo a LinkedIn...');
    } catch (error: any) {
      console.error('LinkedIn login error:', error);
      toast.error('Error al conectar con LinkedIn');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      loginSchema.parse(formData);
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast.error(error.errors[0].message);
        return;
      }
    }

    setLoading(true);
    try {
      await login(formData.email, formData.password);
      
      // Verificar si completó onboarding
      const { data: profile } = await supabase
        .from('profiles')
        .select('rol_profesional')
        .eq('email', formData.email)
        .single();
      
      toast.success('¡Bienvenido de vuelta!');
      
      // Redirigir según estado del onboarding
      if (profile?.rol_profesional) {
        navigate('/dashboard');
      } else {
        navigate('/onboarding');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error(error.message || 'Credenciales incorrectas');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 overflow-x-hidden max-w-full">
      {/* Form Column - Mobile First */}
      <div className="flex items-center justify-center p-4 sm:p-6 lg:p-8 max-w-full safe-padding-x">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full max-w-md"
        >
          <Link to="/" className="inline-flex items-center gap-2 mb-6 sm:mb-8 text-sm hover:text-primary transition-all duration-300 hover-lift min-h-[44px]">
            <ArrowLeft className="h-4 w-4" />
            Volver al inicio
          </Link>

          <div className="mb-6 sm:mb-8">
            <div className="flex justify-center mb-4 sm:mb-6">
              <DecoratedLogo size="md" animated={true} />
            </div>
            <h1 className="text-2xl sm:text-3xl font-heading font-bold mb-2">
              ¡Bienvenido de vuelta!
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              Continúa tu camino hacia el éxito profesional
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email" className="text-sm">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="tu@email.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                className="min-h-[44px] text-base shadow-clovely-sm focus-visible:shadow-clovely-md transition-all duration-300"
              />
            </div>

            <div>
              <Label htmlFor="password" className="text-sm">Contraseña</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                className="min-h-[44px] text-base shadow-clovely-sm focus-visible:shadow-clovely-md transition-all duration-300"
              />
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember"
                  checked={formData.remember}
                  onCheckedChange={(checked) => 
                    setFormData({ ...formData, remember: checked as boolean })
                  }
                  className="min-w-[20px] min-h-[20px]"
                />
                <label htmlFor="remember" className="text-xs sm:text-sm cursor-pointer">
                  Recordarme
                </label>
              </div>
              <Link
                to="/forgot-password"
                className="text-xs sm:text-sm text-primary hover:underline min-h-[44px] flex items-center"
              >
                ¿Olvidaste tu contraseña?
              </Link>
            </div>

            <Button
              type="submit"
              className="w-full gradient-orange text-white hover-glow min-h-[48px] text-base font-medium"
              disabled={loading}
            >
              {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
            </Button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  O continúa con
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={handleGoogleLogin}
                className="min-h-[48px] text-sm sm:text-base shadow-clovely-sm hover:shadow-clovely-md hover:-translate-y-0.5 transition-all duration-300"
              >
                <Chrome className="mr-2 h-4 w-4" />
                Google
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleLinkedInLogin}
                className="min-h-[48px] text-sm sm:text-base shadow-clovely-sm hover:shadow-clovely-md hover:-translate-y-0.5 transition-all duration-300"
              >
                <Linkedin className="mr-2 h-4 w-4" />
                LinkedIn
              </Button>
            </div>
          </div>

          <p className="mt-6 text-center text-xs sm:text-sm text-muted-foreground">
            ¿No tienes cuenta?{' '}
            <Link to="/registro" className="text-primary hover:underline font-medium">
              Regístrate gratis
            </Link>
          </p>
        </motion.div>
      </div>

      {/* Visual Column - Hidden on mobile */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="hidden lg:flex items-center justify-center p-8 bg-gradient-orange-gray relative overflow-hidden"
      >
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
            backgroundSize: '40px 40px',
          }} />
        </div>
        
        <div className="relative z-10 max-w-md text-white space-y-6 px-4">
          <h2 className="text-3xl xl:text-4xl font-heading font-bold leading-tight">
            Tu éxito profesional comienza aquí
          </h2>
          <p className="text-base xl:text-lg text-white/90">
            Únete a miles de profesionales que han transformado su carrera con Clovely
          </p>
          <div className="space-y-4 pt-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                ✓
              </div>
              <p className="text-sm xl:text-base">CV optimizado con IA en minutos</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                ✓
              </div>
              <p className="text-sm xl:text-base">Simulador de entrevistas inteligente</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                ✓
              </div>
              <p className="text-sm xl:text-base">Oportunidades personalizadas para ti</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
