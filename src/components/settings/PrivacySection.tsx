import { Shield, Eye, Users, Download, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { useSettingsStore, ProfileVisibility } from '@/store/useSettingsStore';
import { toast } from '@/hooks/use-toast';

export function PrivacySection() {
  const { privacy, updatePrivacy } = useSettingsStore();

  const handleVisibilityChange = (visibility: ProfileVisibility) => {
    updatePrivacy({ profileVisibility: visibility });
    toast({
      title: 'Visibilidad actualizada',
      description: `Tu perfil ahora es ${
        visibility === 'public' ? 'público' : visibility === 'network' ? 'visible para tu red' : 'privado'
      }.`,
    });
  };

  const handleExportData = async () => {
    toast({
      title: 'Preparando exportación',
      description: 'Recopilando tus datos... Recibirás un email cuando esté listo.',
    });
    
    // Simulate export process
    await new Promise((resolve) => setTimeout(resolve, 2000));
    
    toast({
      title: 'Exportación completada',
      description: 'Tu archivo se ha descargado. (Mock)',
    });
  };

  return (
    <div className="space-y-6">
      <Card className="bg-primary/5 border-primary/20">
        <CardHeader>
          <CardTitle>
            <Shield className="h-5 w-5 inline mr-2" />
            Privacidad y Datos
          </CardTitle>
          <CardDescription>
            Controla quién puede ver tu información y cómo se usan tus datos
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Profile Visibility */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            <Eye className="h-4 w-4 inline mr-2" />
            Visibilidad del Perfil
          </CardTitle>
          <CardDescription>
            Controla quién puede ver tu perfil y actividad en Clovely
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={privacy.profileVisibility}
            onValueChange={(value) => handleVisibilityChange(value as ProfileVisibility)}
          >
            <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-accent transition-colors">
              <RadioGroupItem value="public" id="public" />
              <Label htmlFor="public" className="flex-1 cursor-pointer">
                <p className="text-sm font-medium">Público</p>
                <p className="text-xs text-muted-foreground">
                  Cualquiera puede ver tu perfil y actividad
                </p>
              </Label>
            </div>

            <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-accent transition-colors">
              <RadioGroupItem value="network" id="network" />
              <Label htmlFor="network" className="flex-1 cursor-pointer">
                <p className="text-sm font-medium">Solo mi red</p>
                <p className="text-xs text-muted-foreground">
                  Solo personas en tus círculos pueden ver tu perfil
                </p>
              </Label>
            </div>

            <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-accent transition-colors">
              <RadioGroupItem value="private" id="private" />
              <Label htmlFor="private" className="flex-1 cursor-pointer">
                <p className="text-sm font-medium">Privado</p>
                <p className="text-xs text-muted-foreground">
                  Solo tú puedes ver tu perfil y actividad
                </p>
              </Label>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Data Sharing */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            <Users className="h-4 w-4 inline mr-2" />
            Compartir Datos
          </CardTitle>
          <CardDescription>
            Controla cómo se comparten tus datos con terceros
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start justify-between">
            <div className="space-y-0.5 flex-1">
              <Label className="text-sm font-medium">
                Compartir datos agregados con instituciones
              </Label>
              <p className="text-xs text-muted-foreground">
                Permite que tu institución educativa o empresa vea estadísticas
                agregadas (no individuales) para mejorar programas
              </p>
            </div>
            <Switch
              checked={privacy.shareAggregatedData}
              onCheckedChange={(checked) => {
                updatePrivacy({ shareAggregatedData: checked });
                toast({
                  title: checked ? 'Datos compartidos' : 'Datos no compartidos',
                  description: checked
                    ? 'Tus datos agregados se compartirán con tu institución.'
                    : 'Tus datos no se compartirán con instituciones.',
                });
              }}
            />
          </div>

          <div className="flex items-start justify-between">
            <div className="space-y-0.5 flex-1">
              <Label className="text-sm font-medium">
                Aparecer en ranking institucional
              </Label>
              <p className="text-xs text-muted-foreground">
                Permite que aparezcas en el leaderboard de tu institución (solo visible
                para miembros de la institución)
              </p>
            </div>
            <Switch
              checked={privacy.showInLeaderboard}
              onCheckedChange={(checked) => {
                updatePrivacy({ showInLeaderboard: checked });
                toast({
                  title: checked ? 'Visible en ranking' : 'Oculto de ranking',
                  description: checked
                    ? 'Aparecerás en el ranking institucional.'
                    : 'No aparecerás en rankings institucionales.',
                });
              }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Data Export (GDPR) */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            <Download className="h-4 w-4 inline mr-2" />
            Exportar tus Datos
          </CardTitle>
          <CardDescription>
            Descarga una copia de toda tu información en Clovely (GDPR)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Recibirás un archivo ZIP con:
          </p>
          <ul className="text-sm space-y-1 text-muted-foreground">
            <li>• Perfil y configuración</li>
            <li>• CVs y versiones guardadas</li>
            <li>• Historial de postulaciones</li>
            <li>• Sesiones de entrevista</li>
            <li>• Microacciones y progreso</li>
            <li>• Mensajes y actividad en círculos</li>
          </ul>
          <Button onClick={handleExportData}>
            <Download className="h-4 w-4 mr-2" />
            Solicitar exportación
          </Button>
          <p className="text-xs text-muted-foreground">
            El proceso puede tardar unos minutos. Te notificaremos cuando esté listo.
          </p>
        </CardContent>
      </Card>

      {/* Privacy Notice */}
      <Card className="border-muted-foreground/20">
        <CardContent className="pt-6">
          <div className="flex gap-3">
            <AlertTriangle className="h-5 w-5 text-muted-foreground shrink-0" />
            <div className="space-y-2 text-sm text-muted-foreground">
              <p className="font-medium text-foreground">
                Tu privacidad es importante
              </p>
              <p>
                Clovely nunca venderá tus datos personales. Los datos agregados que
                compartimos con instituciones están anonimizados y solo se usan para
                mejorar programas educativos y de empleabilidad.
              </p>
              <Button variant="link" className="h-auto p-0 text-primary">
                Leer nuestra Política de Privacidad →
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
