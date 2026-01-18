import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Link, useNavigate } from 'react-router-dom';
import { GraduationCap, ArrowLeft, Loader2 } from 'lucide-react';
import { OfficialLogo } from '@/components/OfficialLogo';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export default function UniversidadRegistro() {
  const [universityName, setUniversityName] = useState('');
  const [adminName, setAdminName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast({
        title: 'Error',
        description: 'Las contraseñas no coinciden.',
        variant: 'destructive',
      });
      return;
    }

    if (!acceptTerms) {
      toast({
        title: 'Error',
        description: 'Debes aceptar los términos y condiciones.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    try {
      // 1. Create user account
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: adminName,
            is_university_admin: true,
          },
        },
      });

      if (authError) throw authError;

      if (authData.user) {
        // 2. Create university
        const { data: universityData, error: universityError } = await supabase
          .from('universities')
          .insert({
            name: universityName,
          })
          .select()
          .single();

        if (universityError) throw universityError;

        // 3. Create university admin (owner)
        const { error: adminError } = await supabase
          .from('university_admins')
          .insert({
            university_id: universityData.id,
            user_id: authData.user.id,
            role: 'owner',
            name: adminName,
            email: email,
          });

        if (adminError) throw adminError;

        // 4. Add university_admin role
        const { error: roleError } = await supabase
          .from('user_roles')
          .insert({
            user_id: authData.user.id,
            role: 'university_admin',
          });

        if (roleError) {
          console.warn('Could not add role:', roleError);
        }

        toast({
          title: '¡Universidad registrada!',
          description: 'Tu cuenta ha sido creada exitosamente.',
        });

        navigate('/universidad/dashboard');
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      toast({
        title: 'Error en el registro',
        description: error.message || 'Ocurrió un error. Intenta de nuevo.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50/50 via-orange-50/30 to-white dark:from-gray-900 dark:via-gray-800 dark:to-background flex flex-col">
      {/* Header */}
      <nav className="p-6">
        <div className="container mx-auto max-w-7xl flex items-center justify-between">
          <OfficialLogo size="lg" to="/" />
          <Link to="/universidades">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Volver
            </Button>
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <Card className="shadow-clovely-xl border-0">
            <CardHeader className="text-center pb-2">
              <div className="w-16 h-16 rounded-2xl gradient-orange flex items-center justify-center mx-auto mb-4">
                <GraduationCap className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-2xl font-heading">
                Registrar Universidad
              </CardTitle>
              <CardDescription>
                Crea una cuenta para tu institución
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="universityName">Nombre de la universidad</Label>
                  <Input
                    id="universityName"
                    placeholder="Universidad Ejemplo"
                    value={universityName}
                    onChange={(e) => setUniversityName(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="adminName">Nombre del administrador</Label>
                  <Input
                    id="adminName"
                    placeholder="Juan Pérez"
                    value={adminName}
                    onChange={(e) => setAdminName(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Correo electrónico institucional</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@universidad.edu"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Contraseña</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirmar contraseña</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    minLength={6}
                    disabled={isLoading}
                  />
                </div>

                <div className="flex items-start space-x-2 pt-2">
                  <Checkbox
                    id="terms"
                    checked={acceptTerms}
                    onCheckedChange={(checked) => setAcceptTerms(checked as boolean)}
                    disabled={isLoading}
                  />
                  <label
                    htmlFor="terms"
                    className="text-sm text-muted-foreground leading-tight cursor-pointer"
                  >
                    Acepto los{' '}
                    <Link to="/terms" className="text-primary hover:underline">
                      términos y condiciones
                    </Link>{' '}
                    y la{' '}
                    <Link to="/privacy" className="text-primary hover:underline">
                      política de privacidad
                    </Link>
                  </label>
                </div>

                <Button
                  type="submit"
                  className="w-full gradient-orange text-white font-semibold py-6"
                  disabled={isLoading || !acceptTerms}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Registrando...
                    </>
                  ) : (
                    'Registrar universidad'
                  )}
                </Button>
              </form>

              <div className="mt-6 text-center text-sm text-muted-foreground">
                ¿Ya tienes cuenta?{' '}
                <Link
                  to="/universidad/login"
                  className="text-primary font-medium hover:underline"
                >
                  Inicia sesión
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
