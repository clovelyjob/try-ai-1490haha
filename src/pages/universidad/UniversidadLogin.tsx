import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Link, useNavigate } from 'react-router-dom';
import { GraduationCap, ArrowLeft, Loader2 } from 'lucide-react';
import { OfficialLogo } from '@/components/OfficialLogo';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export default function UniversidadLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) throw authError;

      if (authData.user) {
        // Check if user is a university admin
        const { data: adminData, error: adminError } = await supabase
          .from('university_admins')
          .select('*')
          .eq('user_id', authData.user.id)
          .single();

        if (adminError || !adminData) {
          await supabase.auth.signOut();
          toast({
            title: 'Acceso denegado',
            description: 'Esta cuenta no está asociada a ninguna universidad.',
            variant: 'destructive',
          });
          setIsLoading(false);
          return;
        }

        toast({
          title: '¡Bienvenido!',
          description: 'Has iniciado sesión correctamente.',
        });

        navigate('/universidad/dashboard');
      }
    } catch (error: any) {
      toast({
        title: 'Error al iniciar sesión',
        description: error.message || 'Verifica tus credenciales e intenta de nuevo.',
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
                Acceso Universidades
              </CardTitle>
              <CardDescription>
                Ingresa con tu cuenta de administrador
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Correo electrónico</Label>
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
                    disabled={isLoading}
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full gradient-orange text-white font-semibold py-6"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Iniciando sesión...
                    </>
                  ) : (
                    'Iniciar sesión'
                  )}
                </Button>
              </form>

              <div className="mt-6 text-center text-sm text-muted-foreground">
                ¿No tienes cuenta?{' '}
                <Link
                  to="/universidad/registro"
                  className="text-primary font-medium hover:underline"
                >
                  Registra tu universidad
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
