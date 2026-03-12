import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Chrome, Linkedin, ArrowLeft, Sparkles, Shield } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { toast } from 'sonner';
import { OfficialLogo } from '@/components/OfficialLogo';
import { z } from 'zod';

const registerSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string()
    .min(8, 'Mínimo 8 caracteres')
    .regex(/[A-Z]/, 'Debe contener al menos una mayúscula')
    .regex(/[0-9]/, 'Debe contener al menos un número'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Las contraseñas no coinciden",
  path: ["confirmPassword"],
});

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', confirmPassword: '', acceptTerms: false, newsletter: true,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleGoogleSignup = async () => {
    try { await useAuthStore.getState().signInWithGoogle(); } 
    catch { toast.error('Error al conectar con Google'); }
  };

  const handleLinkedInSignup = async () => {
    try { await useAuthStore.getState().signInWithLinkedIn(); } 
    catch { toast.error('Error al conectar con LinkedIn'); }
  };

  const getPasswordStrength = () => {
    const p = formData.password;
    let s = 0;
    if (p.length >= 8) s++;
    if (/[a-z]/.test(p) && /[A-Z]/.test(p)) s++;
    if (/\d/.test(p)) s++;
    if (/[^a-zA-Z\d]/.test(p)) s++;
    return s;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    if (!formData.acceptTerms) { setErrors({ acceptTerms: 'Debes aceptar los términos' }); toast.error('Debes aceptar los términos'); return; }
    try { registerSchema.parse(formData); } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach((err) => { if (err.path[0]) newErrors[err.path[0].toString()] = err.message; });
        setErrors(newErrors); toast.error(error.errors[0].message); return;
      }
    }
    setLoading(true);
    try {
      await register(formData.name, formData.email, formData.password);
      toast.success('Cuenta creada exitosamente');
      setTimeout(() => navigate('/onboarding'), 1500);
    } catch (error: any) {
      if (error.message?.includes('already registered')) toast.error('Este email ya está registrado.');
      else toast.error(error.message || 'Error al crear la cuenta');
    } finally { setLoading(false); }
  };

  const strength = getPasswordStrength();
  const strengthColors = ['bg-destructive', 'bg-destructive', 'bg-primary/50', 'bg-primary'];
  const strengthLabels = ['Débil', 'Regular', 'Buena', 'Fuerte'];

  return (
    <div className="min-h-screen grid md:grid-cols-2 overflow-x-hidden max-w-full">
      {/* Form */}
      <div className="flex items-center justify-center p-6 sm:p-10 bg-background">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="w-full max-w-sm">
          <Link to="/" className="inline-flex items-center gap-1.5 mb-10 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-3.5 w-3.5" /> Volver al inicio
          </Link>

          <div className="mb-6">
            <OfficialLogo size="md" className="mb-5" />
            <h1 className="text-2xl font-bold mb-3 tracking-tight">Crea tu cuenta gratis</h1>
            <div className="bg-primary/6 border border-primary/12 rounded-lg p-3">
              <p className="text-primary font-medium text-sm flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5" />
                7 días de prueba gratuita
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">Sin compromiso. Cancela cuando quieras.</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div className="space-y-1.5">
              <Label htmlFor="name" className="text-sm font-medium">Nombre completo</Label>
              <Input id="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ana García" className={`h-11 ${errors.name ? 'border-destructive' : ''}`} />
              {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-sm font-medium">Email</Label>
              <Input id="email" type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="ana@ejemplo.com" className={`h-11 ${errors.email ? 'border-destructive' : ''}`} />
              {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-sm font-medium">Contraseña</Label>
              <Input id="password" type="password" value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="••••••••" className={`h-11 ${errors.password ? 'border-destructive' : ''}`} />
              {formData.password && (
                <div className="mt-1.5 space-y-1">
                  <div className="flex gap-1">
                    {[0, 1, 2, 3].map((i) => (
                      <div key={i} className={`h-1 flex-1 rounded-full transition-colors ${i < strength ? strengthColors[strength - 1] : 'bg-muted'}`} />
                    ))}
                  </div>
                  {strength > 0 && <p className="text-xs text-muted-foreground">Seguridad: {strengthLabels[strength - 1]}</p>}
                </div>
              )}
              {errors.password && <p className="text-xs text-destructive">{errors.password}</p>}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="confirmPassword" className="text-sm font-medium">Confirmar contraseña</Label>
              <Input id="confirmPassword" type="password" value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                placeholder="••••••••" className={`h-11 ${errors.confirmPassword ? 'border-destructive' : ''}`} />
              {errors.confirmPassword && <p className="text-xs text-destructive">{errors.confirmPassword}</p>}
            </div>

            <div className="space-y-2.5 pt-1">
              <div className="flex items-start gap-2">
                <Checkbox id="terms" checked={formData.acceptTerms}
                  onCheckedChange={(checked) => setFormData({ ...formData, acceptTerms: checked as boolean })} />
                <label htmlFor="terms" className="text-xs leading-tight text-muted-foreground">
                  Acepto los <Link to="/terms" className="text-primary hover:underline">términos</Link> y la <Link to="/privacy" className="text-primary hover:underline">política de privacidad</Link>
                </label>
              </div>
              <div className="flex items-start gap-2">
                <Checkbox id="newsletter" checked={formData.newsletter}
                  onCheckedChange={(checked) => setFormData({ ...formData, newsletter: checked as boolean })} />
                <label htmlFor="newsletter" className="text-xs text-muted-foreground">Tips semanales para impulsar mi carrera</label>
              </div>
            </div>

            <Button type="submit" className="w-full h-11 font-medium" disabled={loading}>
              {loading ? 'Creando cuenta...' : 'Crear cuenta gratis'}
            </Button>

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border/60" /></div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-3 text-muted-foreground">O continúa con</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Button type="button" variant="outline" className="h-11 text-sm" onClick={handleGoogleSignup}>
                <Chrome className="mr-1.5 h-4 w-4" /> Google
              </Button>
              <Button type="button" variant="outline" className="h-11 text-sm" onClick={handleLinkedInSignup}>
                <Linkedin className="mr-1.5 h-4 w-4" /> LinkedIn
              </Button>
            </div>

            <p className="text-center text-sm text-muted-foreground pt-2">
              ¿Ya tienes cuenta? <Link to="/login" className="text-primary hover:underline font-medium">Inicia sesión</Link>
            </p>
          </form>
        </motion.div>
      </div>

      {/* Testimonial Panel */}
      <div className="hidden md:flex bg-primary text-primary-foreground p-12 items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.06]">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)',
            backgroundSize: '32px 32px',
          }} />
        </div>
        <motion.div initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2, duration: 0.5 }} className="max-w-sm relative">
          <div className="space-y-6">
            <blockquote className="text-xl font-semibold leading-relaxed">
              "Clovely me ayudó a descubrir mi verdadera pasión. En 3 meses pasé
              de sentirme perdida a tener mi trabajo soñado."
            </blockquote>
            <div>
              <p className="font-semibold">Ana María Torres</p>
              <p className="text-primary-foreground/65 text-sm">Product Designer en Rappi</p>
            </div>
            <div className="grid grid-cols-3 gap-6 pt-6 border-t border-primary-foreground/12">
              <div>
                <p className="text-2xl font-bold">87%</p>
                <p className="text-xs text-primary-foreground/60">Consigue empleo</p>
              </div>
              <div>
                <p className="text-2xl font-bold">4.9</p>
                <p className="text-xs text-primary-foreground/60">Rating promedio</p>
              </div>
              <div>
                <p className="text-2xl font-bold">10K+</p>
                <p className="text-xs text-primary-foreground/60">Usuarios activos</p>
              </div>
            </div>
            <div className="flex items-center gap-2 pt-2">
              <Shield className="h-4 w-4 text-primary-foreground/40" />
              <p className="text-xs text-primary-foreground/40">Datos encriptados y seguros</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;
