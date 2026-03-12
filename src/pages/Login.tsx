import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Chrome, Linkedin, ArrowLeft, FileText, Mic, Briefcase, CheckCircle } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { toast } from 'sonner';
import { OfficialLogo } from '@/components/OfficialLogo';
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
  const [formData, setFormData] = useState({ email: '', password: '', remember: false });

  const handleGoogleLogin = async () => {
    try { await useAuthStore.getState().signInWithGoogle(); } 
    catch { toast.error('Error al conectar con Google'); }
  };

  const handleLinkedInLogin = async () => {
    try { await useAuthStore.getState().signInWithLinkedIn(); } 
    catch { toast.error('Error al conectar con LinkedIn'); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try { loginSchema.parse(formData); } catch (error) {
      if (error instanceof z.ZodError) { toast.error(error.errors[0].message); return; }
    }
    setLoading(true);
    try {
      await login(formData.email, formData.password);
      const { data: profile } = await supabase
        .from('profiles').select('rol_profesional').eq('email', formData.email).single();
      toast.success('Bienvenido de vuelta');
      navigate(profile?.rol_profesional ? '/dashboard' : '/onboarding');
    } catch (error: any) {
      toast.error(error.message || 'Credenciales incorrectas');
    } finally { setLoading(false); }
  };

  const features = [
    { icon: FileText, text: 'CV optimizado con IA en minutos' },
    { icon: Mic, text: 'Simulador de entrevistas inteligente' },
    { icon: Briefcase, text: 'Oportunidades personalizadas para ti' },
  ];

  return (
    <div className="min-h-screen grid lg:grid-cols-2 overflow-x-hidden max-w-full">
      {/* Form */}
      <div className="flex items-center justify-center p-6 sm:p-8">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm">
          <Link to="/" className="inline-flex items-center gap-1.5 mb-8 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-3.5 w-3.5" />
            Volver al inicio
          </Link>

          <div className="mb-8">
            <OfficialLogo size="md" className="mb-6" />
            <h1 className="text-2xl font-bold mb-1.5 tracking-tight">Bienvenido de vuelta</h1>
            <p className="text-sm text-muted-foreground">Continúa tu camino profesional</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-sm">Email</Label>
              <Input id="email" type="email" placeholder="tu@email.com"
                value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required className="h-10" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-sm">Contraseña</Label>
              <Input id="password" type="password" placeholder="••••••••"
                value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required className="h-10" />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox id="remember" checked={formData.remember}
                  onCheckedChange={(checked) => setFormData({ ...formData, remember: checked as boolean })} />
                <label htmlFor="remember" className="text-xs cursor-pointer">Recordarme</label>
              </div>
              <Link to="/forgot-password" className="text-xs text-primary hover:underline">
                Olvidé mi contraseña
              </Link>
            </div>

            <Button type="submit" className="w-full h-10 font-medium" disabled={loading}>
              {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
            </Button>
          </form>

          <div className="mt-5">
            <div className="relative">
              <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-border/60" /></div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">O continúa con</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 mt-5">
              <Button type="button" variant="outline" onClick={handleGoogleLogin} className="h-10 text-sm">
                <Chrome className="mr-1.5 h-4 w-4" /> Google
              </Button>
              <Button type="button" variant="outline" onClick={handleLinkedInLogin} className="h-10 text-sm">
                <Linkedin className="mr-1.5 h-4 w-4" /> LinkedIn
              </Button>
            </div>
          </div>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            ¿No tienes cuenta?{' '}
            <Link to="/registro" className="text-primary hover:underline font-medium">Regístrate gratis</Link>
          </p>
        </motion.div>
      </div>

      {/* Visual Panel */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="hidden lg:flex items-center justify-center p-12 bg-primary relative overflow-hidden"
      >
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)',
            backgroundSize: '32px 32px',
          }} />
        </div>
        
        <div className="relative z-10 max-w-sm text-primary-foreground space-y-8">
          <h2 className="text-3xl font-bold leading-tight tracking-tight">
            Tu éxito profesional comienza aquí
          </h2>
          <p className="text-primary-foreground/80 leading-relaxed">
            Únete a miles de profesionales que han transformado su carrera
          </p>
          <div className="space-y-4 pt-2">
            {features.map((f, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary-foreground/15 flex items-center justify-center flex-shrink-0">
                  <f.icon className="h-4 w-4" />
                </div>
                <p className="text-sm">{f.text}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
