import { Bell, Mail, Smartphone, MessageSquare, Send } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useSettingsStore, NotificationChannel } from '@/store/useSettingsStore';
import { toast } from '@/hooks/use-toast';

export function NotificationsSection() {
  const { notifications, updateNotificationChannel } = useSettingsStore();

  const handleSendTestEmail = async () => {
    toast({
      title: 'Email de prueba enviado',
      description: 'Revisa tu bandeja de entrada en unos momentos.',
    });
  };

  const renderChannelSection = (
    icon: React.ReactNode,
    title: string,
    description: string,
    channel: keyof typeof notifications
  ) => {
    const channelData = notifications[channel];
    
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {icon}
            {title}
          </CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {(Object.keys(channelData) as Array<keyof NotificationChannel>).map((category) => {
            const labels: Record<keyof NotificationChannel, { title: string; description: string }> = {
              microactions: {
                title: 'Microacciones',
                description: 'Recordatorios de tareas pendientes y próximas',
              },
              recommendations: {
                title: 'Recomendaciones',
                description: 'Sugerencias personalizadas del coach IA',
              },
              coachMessages: {
                title: 'Mensajes del Coach',
                description: 'Notificaciones y consejos del Career Coach',
              },
              marketing: {
                title: 'Marketing y promociones',
                description: 'Novedades, ofertas y contenido educativo',
              },
            };

            return (
              <div key={category} className="flex items-start justify-between">
                <div className="space-y-0.5 flex-1">
                  <Label className="text-sm font-medium cursor-pointer">
                    {labels[category].title}
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    {labels[category].description}
                  </p>
                </div>
                <Switch
                  checked={channelData[category]}
                  onCheckedChange={(checked) => {
                    updateNotificationChannel(channel, category, checked);
                    toast({
                      title: checked ? 'Notificación activada' : 'Notificación desactivada',
                      description: `${labels[category].title} - ${title}`,
                    });
                  }}
                />
              </div>
            );
          })}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      <Card className="bg-primary/5 border-primary/20">
        <CardHeader>
          <CardTitle>
            <Bell className="h-5 w-5 inline mr-2" />
            Preferencias de Notificaciones
          </CardTitle>
          <CardDescription>
            Controla cómo y cuándo quieres recibir notificaciones
          </CardDescription>
        </CardHeader>
      </Card>

      {renderChannelSection(
        <Mail className="h-5 w-5" />,
        'Notificaciones por Email',
        'Recibe actualizaciones en tu correo electrónico',
        'email'
      )}

      {renderChannelSection(
        <Smartphone className="h-5 w-5" />,
        'Notificaciones Push (Próximamente)',
        'Notificaciones instantáneas en tu dispositivo',
        'push'
      )}

      {renderChannelSection(
        <MessageSquare className="h-5 w-5" />,
        'Notificaciones por SMS (Próximamente)',
        'Recibe alertas importantes por mensaje de texto',
        'sms'
      )}

      <Card>
        <CardHeader>
          <CardTitle>Prueba tus notificaciones</CardTitle>
          <CardDescription>
            Envía un email de prueba para verificar tu configuración
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={handleSendTestEmail}>
            <Send className="h-4 w-4 mr-2" />
            Enviar email de prueba
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
