import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card } from '@/components/ui/card';
import { Chrome, Linkedin, ArrowLeft } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { toast } from 'sonner';
import { VALIDATIONS } from '@/lib/constants';
import clovelyLogo from '@/assets/clovely-logo.jpg';

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false,
    newsletter: true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!VALIDATIONS.name.test(formData.name)) {
      newErrors.name = 'El nombre debe tener al menos 2 caracteres';
    }

    if (!VALIDATIONS.email.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    if (!VALIDATIONS.password.test(formData.password)) {
      newErrors.password = 'Mínimo 8 caracteres, 1 mayúscula y 1 número';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }

    if (!formData.acceptTerms) {
      newErrors.acceptTerms = 'Debes aceptar los términos';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const getPasswordStrength = () => {
    const password = formData.password;
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^a-zA-Z\d]/.test(password)) strength++;
    return strength;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      await register(formData.name, formData.email, formData.password);
      toast.success('¡Cuenta creada exitosamente!');
      navigate('/onboarding');
    } catch (error) {
      toast.error('Error al crear la cuenta');
    } finally {
      setLoading(false);
    }
  };

  const strength = getPasswordStrength();
  const strengthColors = ['bg-destructive', 'bg-destructive', 'bg-accent', 'bg-success'];
  const strengthLabels = ['Débil', 'Regular', 'Buena', 'Fuerte'];

  return (
    <div className="min-h-screen grid md:grid-cols-2 overflow-x-hidden max-w-full">
      {/* Form Column */}
      <div className="flex items-center justify-center p-8 max-w-full">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full max-w-md"
        >
          <Link to="/" className="inline-flex items-center gap-2 mb-8 text-sm hover:text-primary transition-all duration-300 hover-lift">
            <ArrowLeft className="h-4 w-4" />
            Volver al inicio
          </Link>

          <div className="mb-8">
            <motion.div 
              className="flex items-center mb-4"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <img src={clovelyLogo} alt="Clovely" className="h-12 w-auto" />
            </motion.div>
            <h1 className="text-3xl font-heading font-bold mb-2">
              Crea tu cuenta gratis
            </h1>
            <div className="bg-primary/10 border border-primary/20 rounded-lg p-3 mb-3">
              <p className="text-primary font-semibold text-lg">✨ 7 días de prueba gratuita</p>
              <p className="text-sm text-muted-foreground">Sin compromiso. Cancela cuando quieras.</p>
            </div>
            <p className="text-muted-foreground">
              Comienza tu transformación profesional hoy
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Nombre completo *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ana García"
                className={errors.name ? 'border-destructive' : ''}
              />
              {errors.name && <p className="text-xs text-destructive mt-1">{errors.name}</p>}
            </div>

            <div>
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="ana@ejemplo.com"
                className={errors.email ? 'border-destructive' : ''}
              />
              {errors.email && <p className="text-xs text-destructive mt-1">{errors.email}</p>}
            </div>

            <div>
              <Label htmlFor="password">Contraseña *</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="••••••••"
                className={errors.password ? 'border-destructive' : ''}
              />
              {formData.password && (
                <div className="mt-2 space-y-1">
                  <div className="flex gap-1">
                    {[0, 1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className={`h-1 flex-1 rounded ${
                          i < strength ? strengthColors[strength - 1] : 'bg-muted'
                        }`}
                      />
                    ))}
                  </div>
                  {strength > 0 && (
                    <p className="text-xs text-muted-foreground">
                      Seguridad: {strengthLabels[strength - 1]}
                    </p>
                  )}
                </div>
              )}
              {errors.password && <p className="text-xs text-destructive mt-1">{errors.password}</p>}
            </div>

            <div>
              <Label htmlFor="confirmPassword">Confirmar contraseña *</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                placeholder="••••••••"
                className={errors.confirmPassword ? 'border-destructive' : ''}
              />
              {errors.confirmPassword && (
                <p className="text-xs text-destructive mt-1">{errors.confirmPassword}</p>
              )}
            </div>

            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <Checkbox
                  id="terms"
                  checked={formData.acceptTerms}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, acceptTerms: checked as boolean })
                  }
                  className={errors.acceptTerms ? 'border-destructive' : ''}
                />
                <label htmlFor="terms" className="text-sm leading-tight">
                  Acepto los{' '}
                  <a href="#" className="text-primary hover:underline">
                    términos y condiciones
                  </a>{' '}
                  y la{' '}
                  <a href="#" className="text-primary hover:underline">
                    política de privacidad
                  </a>
                </label>
              </div>

              <div className="flex items-start gap-2">
                <Checkbox
                  id="newsletter"
                  checked={formData.newsletter}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, newsletter: checked as boolean })
                  }
                />
                <label htmlFor="newsletter" className="text-sm">
                  Quiero recibir tips semanales para impulsar mi carrera
                </label>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full gradient-orange text-white hover-glow hover:scale-105 transition-all duration-300"
              disabled={loading}
            >
              {loading ? 'Creando cuenta...' : 'Crear cuenta gratis →'}
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
              <Button type="button" variant="outline" className="hover-lift">
                <Chrome className="mr-2 h-4 w-4" />
                Google
              </Button>
              <Button type="button" variant="outline" className="hover-lift">
                <Linkedin className="mr-2 h-4 w-4" />
                LinkedIn
              </Button>
            </div>

            <p className="text-center text-sm text-muted-foreground">
              ¿Ya tienes cuenta?{' '}
              <Link to="/login" className="text-primary hover:underline font-medium">
                Inicia sesión
              </Link>
            </p>
          </form>

          <p className="mt-8 text-xs text-center text-muted-foreground">
            Al crear una cuenta, aceptas nuestros Términos de Servicio y reconoces
            haber leído nuestra Política de Privacidad.
          </p>
        </motion.div>
      </div>

      {/* Testimonial Column */}
      <div className="hidden md:flex gradient-orange text-white p-12 items-center justify-center">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="max-w-md"
        >
          <div className="space-y-6">
            <div className="text-6xl">✨</div>
            <blockquote className="text-2xl font-heading font-semibold leading-relaxed">
              "Clovely me ayudó a descubrir mi verdadera pasión. En 3 meses pasé
              de sentirme perdida a tener mi trabajo soñado."
            </blockquote>
            <div>
              <p className="font-semibold">Ana María Torres</p>
              <p className="text-white/80">Product Designer en Rappi</p>
            </div>

            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-white/20">
              <div>
                <p className="text-3xl font-heading font-bold">87%</p>
                <p className="text-sm text-white/80">Consigue empleo</p>
              </div>
              <div>
                <p className="text-3xl font-heading font-bold">4.9</p>
                <p className="text-sm text-white/80">Rating promedio</p>
              </div>
              <div>
                <p className="text-3xl font-heading font-bold">10K+</p>
                <p className="text-sm text-white/80">Usuarios activos</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;
