import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Sparkles, Chrome, Linkedin, ArrowLeft } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { toast } from 'sonner';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    remember: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(formData.email, formData.password);
      toast.success('¡Bienvenido de vuelta!');
      navigate('/dashboard');
    } catch (error) {
      toast.error('Credenciales incorrectas');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid md:grid-cols-2">
      {/* Form Column */}
      <div className="flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full max-w-md"
        >
          <Link to="/" className="inline-flex items-center gap-2 mb-8 text-sm hover:text-primary">
            <ArrowLeft className="h-4 w-4" />
            Volver al inicio
          </Link>

          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-lg gradient-orange flex items-center justify-center">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <span className="font-heading font-bold text-2xl">Clovely</span>
            </div>
            <h1 className="text-3xl font-heading font-bold mb-2">
              ¡Bienvenido de vuelta!
            </h1>
            <p className="text-muted-foreground">
              Continúa tu camino hacia el éxito profesional
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="ana@ejemplo.com"
                required
              />
            </div>

            <div>
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="••••••••"
                required
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="remember"
                  checked={formData.remember}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, remember: checked as boolean })
                  }
                />
                <label htmlFor="remember" className="text-sm">
                  Mantenerme conectado
                </label>
              </div>
              <a href="#" className="text-sm text-primary hover:underline">
                ¿Olvidaste tu contraseña?
              </a>
            </div>

            <Button
              type="submit"
              className="w-full gradient-orange text-white"
              disabled={loading}
            >
              {loading ? 'Iniciando sesión...' : 'Iniciar sesión →'}
            </Button>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  O continúa con
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Button type="button" variant="outline">
                <Chrome className="mr-2 h-4 w-4" />
                Google
              </Button>
              <Button type="button" variant="outline">
                <Linkedin className="mr-2 h-4 w-4" />
                LinkedIn
              </Button>
            </div>

            <p className="text-center text-sm text-muted-foreground">
              ¿No tienes cuenta?{' '}
              <Link to="/registro" className="text-primary hover:underline font-medium">
                Regístrate gratis
              </Link>
            </p>
          </form>
        </motion.div>
      </div>

      {/* Illustration Column */}
      <div className="hidden md:flex gradient-blue text-white p-12 items-center justify-center">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="max-w-md space-y-8"
        >
          <div className="space-y-4">
            <div className="text-6xl">🚀</div>
            <h2 className="text-3xl font-heading font-bold leading-tight">
              Tu siguiente oportunidad te está esperando
            </h2>
            <p className="text-white/90 text-lg">
              Miles de profesionales ya transformaron sus carreras con Clovely.
              Es tu turno.
            </p>
          </div>

          <div className="space-y-4 pt-8">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                ✓
              </div>
              <div>
                <p className="font-semibold">Ruta personalizada con IA</p>
                <p className="text-sm text-white/80">
                  Plan adaptado a tus objetivos y estilo
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                ✓
              </div>
              <div>
                <p className="font-semibold">Coach disponible 24/7</p>
                <p className="text-sm text-white/80">
                  Respuestas y guía cuando las necesites
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                ✓
              </div>
              <div>
                <p className="font-semibold">Progreso medible</p>
                <p className="text-sm text-white/80">
                  Ve tu evolución en tiempo real
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
