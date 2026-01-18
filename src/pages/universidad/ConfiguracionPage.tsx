import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Settings, Building2, Eye, Bell, Loader2 } from 'lucide-react';
import { useUniversidadStore } from '@/store/useUniversidadStore';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export default function ConfiguracionPage() {
  const { university, setUniversity } = useUniversidadStore();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [universityName, setUniversityName] = useState(university?.name || '');
  const [domain, setDomain] = useState(university?.domain || '');
  
  // Visibility settings (mock for now)
  const [showScores, setShowScores] = useState(true);
  const [showInterests, setShowInterests] = useState(true);
  const [showImprovements, setShowImprovements] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);

  const handleSave = async () => {
    if (!university) return;

    setIsLoading(true);

    try {
      const { data, error } = await supabase
        .from('universities')
        .update({
          name: universityName,
          domain: domain || null,
        })
        .eq('id', university.id)
        .select()
        .single();

      if (error) throw error;

      setUniversity({
        ...university,
        name: data.name,
        domain: data.domain,
        updated_at: data.updated_at,
      });

      toast({
        title: 'Configuración guardada',
        description: 'Los cambios se han aplicado correctamente.',
      });
    } catch (error: any) {
      toast({
        title: 'Error al guardar',
        description: error.message || 'Ocurrió un error. Intenta de nuevo.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-heading font-bold">Configuración</h1>
        <p className="text-muted-foreground">
          Administra la información y preferencias de tu universidad
        </p>
      </div>

      <div className="grid gap-6 max-w-2xl">
        {/* University Profile */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-primary" />
                <CardTitle className="text-lg font-heading">Perfil de Universidad</CardTitle>
              </div>
              <CardDescription>
                Información básica de tu institución
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="universityName">Nombre de la universidad</Label>
                <Input
                  id="universityName"
                  value={universityName}
                  onChange={(e) => setUniversityName(e.target.value)}
                  placeholder="Universidad Ejemplo"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="domain">Dominio de correo (opcional)</Label>
                <Input
                  id="domain"
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                  placeholder="universidad.edu"
                />
                <p className="text-xs text-muted-foreground">
                  Usado para verificar automáticamente estudiantes de tu institución
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Data Visibility */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Eye className="h-5 w-5 text-primary" />
                <CardTitle className="text-lg font-heading">Visibilidad de Datos</CardTitle>
              </div>
              <CardDescription>
                Configura qué datos se muestran en el dashboard
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Mostrar scores individuales</Label>
                  <p className="text-xs text-muted-foreground">
                    CV score e interview score por estudiante
                  </p>
                </div>
                <Switch checked={showScores} onCheckedChange={setShowScores} />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Mostrar intereses profesionales</Label>
                  <p className="text-xs text-muted-foreground">
                    Áreas de interés de cada estudiante
                  </p>
                </div>
                <Switch checked={showInterests} onCheckedChange={setShowInterests} />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Mostrar áreas de mejora</Label>
                  <p className="text-xs text-muted-foreground">
                    Feedback de entrevistas
                  </p>
                </div>
                <Switch checked={showImprovements} onCheckedChange={setShowImprovements} />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Notifications */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-primary" />
                <CardTitle className="text-lg font-heading">Notificaciones</CardTitle>
              </div>
              <CardDescription>
                Configura cómo recibir actualizaciones
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Notificaciones por email</Label>
                  <p className="text-xs text-muted-foreground">
                    Recibe reportes semanales de rendimiento
                  </p>
                </div>
                <Switch checked={emailNotifications} onCheckedChange={setEmailNotifications} />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Save Button */}
        <Button
          onClick={handleSave}
          className="gradient-orange text-white font-semibold"
          size="lg"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Guardando...
            </>
          ) : (
            <>
              <Settings className="mr-2 h-4 w-4" />
              Guardar cambios
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
