import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft } from 'lucide-react';
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <motion.div 
        initial={{ opacity: 0, y: 10 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.3 }}
        className="w-full max-w-sm"
      >
        <Link to="/" className="inline-flex items-center gap-1.5 mb-8 text-xs text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-3 w-3" /> Volver
        </Link>

        <OfficialLogo size="md" className="mb-6" />
        <h1 className="text-xl font-bold mb-1 tracking-tight">Iniciar sesión</h1>
        <p className="text-sm text-muted-foreground mb-6">Continúa tu camino profesional</p>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-xs">Email</Label>
            <Input id="email" type="email" placeholder="tu@email.com"
              value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required className="h-10" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="password" className="text-xs">Contraseña</Label>
            <Input id="password" type="password" placeholder="••••••••"
              value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required className="h-10" />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Checkbox id="remember" checked={formData.remember}
                onCheckedChange={(checked) => setFormData({ ...formData, remember: checked as boolean })} />
              <label htmlFor="remember" className="text-xs text-muted-foreground cursor-pointer">Recordarme</label>
            </div>
            <Link to="/forgot-password" className="text-xs text-primary hover:underline">
              Olvidé mi contraseña
            </Link>
          </div>

          <Button type="submit" className="w-full h-10 text-sm" disabled={loading}>
            {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
          </Button>
        </form>

        <div className="my-5">
          <div className="relative">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border/50" /></div>
            <div className="relative flex justify-center text-[10px] uppercase">
              <span className="bg-background px-3 text-muted-foreground">O continúa con</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2.5 mt-4">
            <Button type="button" variant="outline" onClick={handleGoogleLogin} className="h-10 text-xs">
              <Chrome className="mr-1.5 h-3.5 w-3.5" /> Google
            </Button>
            <Button type="button" variant="outline" onClick={handleLinkedInLogin} className="h-10 text-xs">
              <Linkedin className="mr-1.5 h-3.5 w-3.5" /> LinkedIn
            </Button>
          </div>
        </div>

        <p className="text-center text-xs text-muted-foreground">
          ¿No tienes cuenta?{' '}
          <Link to="/registro" className="text-primary hover:underline font-medium">Regístrate</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
