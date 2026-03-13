import { useState } from 'react';
import { Linkedin, BookOpen, Calendar, ExternalLink, Link as LinkIcon, CheckCircle2, XCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useSettingsStore, Integrations } from '@/store/useSettingsStore';
import { toast } from '@/hooks/use-toast';

export function IntegrationsSection() {
  const { integrations, connectIntegration, disconnectIntegration } = useSettingsStore();
  const [disconnecting, setDisconnecting] = useState<keyof Integrations | null>(null);

  const handleConnect = async (service: keyof Integrations) => {
    toast({
      title: 'Conectando...',
      description: `Redirigiendo a ${service} para autorización. (Mock)`,
    });

    // Simulate OAuth flow
    await new Promise((resolve) => setTimeout(resolve, 1500));

    connectIntegration(service);
    
    toast({
      title: 'Conectado exitosamente',
      description: `${service} ha sido conectado a tu cuenta.`,
    });
  };

  const handleDisconnect = (service: keyof Integrations) => {
    setDisconnecting(service);
  };

  const confirmDisconnect = () => {
    if (disconnecting) {
      disconnectIntegration(disconnecting);
      toast({
        title: 'Desconectado',
        description: `${disconnecting} ha sido desconectado de tu cuenta.`,
      });
      setDisconnecting(null);
    }
  };

  const integrationsList = [
    {
      id: 'linkedin' as keyof Integrations,
      name: 'LinkedIn',
      description: 'Importa tu experiencia y educación automáticamente',
      icon: Linkedin,
      color: 'text-blue-600',
      benefits: [
        'Importación automática de experiencia',
        'Sincronización de habilidades',
        'Compartir logros en tu perfil',
      ],
    },
    {
      id: 'coursera' as keyof Integrations,
      name: 'Coursera',
      description: 'Agrega certificaciones y cursos completados',
      icon: BookOpen,
      color: 'text-blue-500',
      benefits: [
        'Importar certificaciones automáticamente',
        'Recomendaciones de cursos personalizadas',
        'Seguimiento de progreso educativo',
      ],
    },
    {
      id: 'calendar' as keyof Integrations,
      name: 'Google Calendar',
      description: 'Sincroniza entrevistas y recordatorios de microacciones',
      icon: Calendar,
      color: 'text-red-500',
      benefits: [
        'Recordatorios automáticos de tareas',
        'Sincronización de entrevistas programadas',
        'Alertas de deadlines de postulaciones',
      ],
    },
  ];

  return (
    <div className="space-y-6">
      <Card className="bg-primary/5 border-primary/20">
        <CardHeader>
          <CardTitle>
            <LinkIcon className="h-5 w-5 inline mr-2" />
            Integraciones
          </CardTitle>
          <CardDescription>
            Conecta tus herramientas favoritas para una experiencia más completa
          </CardDescription>
        </CardHeader>
      </Card>

      {integrationsList.map((integration) => {
        const Icon = integration.icon;
        const status = integrations[integration.id];
        const isConnected = status.connected;

        return (
          <Card key={integration.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className={`p-2 bg-muted rounded-lg ${integration.color}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{integration.name}</CardTitle>
                    <CardDescription>{integration.description}</CardDescription>
                  </div>
                </div>
                {isConnected ? (
                  <Badge variant="default" className="gap-1">
                    <CheckCircle2 className="h-3 w-3" />
                    Conectado
                  </Badge>
                ) : (
                  <Badge variant="secondary" className="gap-1">
                    <XCircle className="h-3 w-3" />
                    No conectado
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Benefits */}
              <div>
                <p className="text-sm font-medium mb-2">Beneficios:</p>
                <ul className="space-y-1">
                  {integration.benefits.map((benefit, index) => (
                    <li key={index} className="text-sm text-muted-foreground flex items-center gap-2">
                      <span className="text-primary font-semibold">·</span>
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Last Sync */}
              {isConnected && status.lastSync && (
                <div className="text-xs text-muted-foreground">
                  Última sincronización: {new Date(status.lastSync).toLocaleString('es-ES')}
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                {isConnected ? (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleConnect(integration.id)}
                    >
                      Sincronizar ahora
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDisconnect(integration.id)}
                    >
                      Desconectar
                    </Button>
                  </>
                ) : (
                  <Button onClick={() => handleConnect(integration.id)}>
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Conectar {integration.name}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}

      {/* Disconnect Confirmation Dialog */}
      <AlertDialog open={!!disconnecting} onOpenChange={() => setDisconnecting(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Desconectar integración?</AlertDialogTitle>
            <AlertDialogDescription>
              Esto desconectará {disconnecting} de tu cuenta. Puedes volver a conectarlo en
              cualquier momento.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDisconnect}>
              Desconectar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
