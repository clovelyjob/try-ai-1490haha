import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useNotificationsStore } from '@/store/useNotificationsStore';
import { Bell, Briefcase, Trophy, Calendar, Mail, Volume2 } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

export const NotificationsSettings = () => {
  const { preferences, updatePreferences } = useNotificationsStore();

  const settings = [
    {
      id: 'enabled',
      icon: Bell,
      label: 'Notificaciones activadas',
      description: 'Activa o desactiva todas las notificaciones',
      checked: preferences.enabled,
    },
    {
      id: 'opportunities',
      icon: Briefcase,
      label: 'Nuevas oportunidades',
      description: 'Recibe alertas de trabajos que coincidan con tu perfil',
      checked: preferences.opportunities,
      disabled: !preferences.enabled,
    },
    {
      id: 'interviews',
      icon: Calendar,
      label: 'Entrevistas y preparación',
      description: 'Recordatorios para practicar entrevistas',
      checked: preferences.interviews,
      disabled: !preferences.enabled,
    },
    {
      id: 'achievements',
      icon: Trophy,
      label: 'Logros y recompensas',
      description: 'Notificaciones cuando desbloqueas logros',
      checked: preferences.achievements,
      disabled: !preferences.enabled,
    },
    {
      id: 'reminders',
      icon: Bell,
      label: 'Recordatorios inteligentes',
      description: 'Sugerencias personalizadas para mejorar tu perfil',
      checked: preferences.reminders,
      disabled: !preferences.enabled,
    },
    {
      id: 'sound',
      icon: Volume2,
      label: 'Sonido de notificaciones',
      description: 'Reproducir sonido al recibir notificaciones',
      checked: preferences.sound,
      disabled: !preferences.enabled,
    },
  ];

  const handleToggle = (id: string, value: boolean) => {
    updatePreferences({ [id]: value });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Notificaciones
        </CardTitle>
        <CardDescription>
          Configura cómo y cuándo quieres recibir notificaciones
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {settings.map((setting, index) => (
          <div key={setting.id}>
            <div className="flex items-start justify-between gap-4 min-h-[44px]">
              <div className="flex gap-3 flex-1">
                <div className="mt-1">
                  <setting.icon className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="space-y-1 flex-1">
                  <Label
                    htmlFor={setting.id}
                    className={setting.disabled ? 'text-muted-foreground' : ''}
                  >
                    {setting.label}
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    {setting.description}
                  </p>
                </div>
              </div>
              <Switch
                id={setting.id}
                checked={setting.checked}
                onCheckedChange={(checked) => handleToggle(setting.id, checked)}
                disabled={setting.disabled}
                className="min-h-[24px] min-w-[44px]"
              />
            </div>
            {index < settings.length - 1 && <Separator className="mt-6" />}
          </div>
        ))}

        <Separator />

        <div className="bg-muted/50 p-4 rounded-lg space-y-2">
          <div className="flex items-center gap-2 text-sm font-medium">
            <Mail className="h-4 w-4" />
            Notificaciones por email
          </div>
          <p className="text-sm text-muted-foreground">
            Las notificaciones por email estarán disponibles próximamente. Por ahora, recibirás todas las alertas dentro de la aplicación.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
