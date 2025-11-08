import { useState } from 'react';
import { Lock, Shield, Smartphone, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
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
import { useSettingsStore, UserSession } from '@/store/useSettingsStore';
import { toast } from '@/hooks/use-toast';
import { z } from 'zod';

const passwordSchema = z.object({
  current: z.string().min(1, 'Contraseña actual requerida'),
  new: z.string()
    .min(8, 'Mínimo 8 caracteres')
    .regex(/[a-zA-Z]/, 'Debe contener al menos una letra')
    .regex(/[0-9]/, 'Debe contener al menos un número'),
  confirm: z.string(),
}).refine((data) => data.new === data.confirm, {
  message: 'Las contraseñas no coinciden',
  path: ['confirm'],
});

export function SecuritySection() {
  const { sessions, closeOtherSessions } = useSettingsStore();
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    current: '',
    new: '',
    confirm: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [showCloseSessionsDialog, setShowCloseSessionsDialog] = useState(false);

  const handlePasswordChange = async () => {
    try {
      passwordSchema.parse(passwordData);
      setErrors({});
      
      setIsSaving(true);
      
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 800));
      
      toast({
        title: 'Contraseña actualizada',
        description: 'Tu contraseña ha sido cambiada exitosamente.',
      });
      
      setIsChangingPassword(false);
      setPasswordData({ current: '', new: '', confirm: '' });
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            newErrors[err.path[0] as string] = err.message;
          }
        });
        setErrors(newErrors);
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleCloseOtherSessions = () => {
    closeOtherSessions();
    setShowCloseSessionsDialog(false);
    toast({
      title: 'Sesiones cerradas',
      description: 'Has cerrado sesión en todos los demás dispositivos.',
    });
  };

  const handleToggle2FA = () => {
    setTwoFactorEnabled(!twoFactorEnabled);
    toast({
      title: twoFactorEnabled ? '2FA desactivado' : '2FA activado',
      description: twoFactorEnabled 
        ? 'La autenticación de dos factores ha sido desactivada.'
        : 'La autenticación de dos factores ha sido activada. (Mock)',
    });
  };

  return (
    <div className="space-y-6">
      {/* Change Password */}
      <Card>
        <CardHeader>
          <CardTitle>
            <Lock className="h-5 w-5 inline mr-2" />
            Cambiar Contraseña
          </CardTitle>
          <CardDescription>
            Actualiza tu contraseña regularmente para mantener tu cuenta segura
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!isChangingPassword ? (
            <Button onClick={() => setIsChangingPassword(true)}>
              Cambiar contraseña
            </Button>
          ) : (
            <div className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="current">Contraseña actual</Label>
                <Input
                  id="current"
                  type="password"
                  value={passwordData.current}
                  onChange={(e) => {
                    setPasswordData({ ...passwordData, current: e.target.value });
                    if (errors.current) {
                      const newErrors = { ...errors };
                      delete newErrors.current;
                      setErrors(newErrors);
                    }
                  }}
                  className={errors.current ? 'border-destructive' : ''}
                />
                {errors.current && (
                  <p className="text-xs text-destructive">{errors.current}</p>
                )}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="new">Nueva contraseña</Label>
                <Input
                  id="new"
                  type="password"
                  value={passwordData.new}
                  onChange={(e) => {
                    setPasswordData({ ...passwordData, new: e.target.value });
                    if (errors.new) {
                      const newErrors = { ...errors };
                      delete newErrors.new;
                      setErrors(newErrors);
                    }
                  }}
                  className={errors.new ? 'border-destructive' : ''}
                />
                {errors.new && (
                  <p className="text-xs text-destructive">{errors.new}</p>
                )}
                <p className="text-xs text-muted-foreground">
                  Mínimo 8 caracteres, incluye letras y números
                </p>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="confirm">Confirmar nueva contraseña</Label>
                <Input
                  id="confirm"
                  type="password"
                  value={passwordData.confirm}
                  onChange={(e) => {
                    setPasswordData({ ...passwordData, confirm: e.target.value });
                    if (errors.confirm) {
                      const newErrors = { ...errors };
                      delete newErrors.confirm;
                      setErrors(newErrors);
                    }
                  }}
                  className={errors.confirm ? 'border-destructive' : ''}
                />
                {errors.confirm && (
                  <p className="text-xs text-destructive">{errors.confirm}</p>
                )}
              </div>

              <div className="flex gap-2">
                <Button onClick={handlePasswordChange} disabled={isSaving}>
                  {isSaving ? 'Guardando...' : 'Actualizar contraseña'}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsChangingPassword(false);
                    setPasswordData({ current: '', new: '', confirm: '' });
                    setErrors({});
                  }}
                  disabled={isSaving}
                >
                  Cancelar
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Two-Factor Authentication */}
      <Card>
        <CardHeader>
          <CardTitle>
            <Shield className="h-5 w-5 inline mr-2" />
            Autenticación de Dos Factores
          </CardTitle>
          <CardDescription>
            Añade una capa extra de seguridad a tu cuenta (Próximamente)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <p className="text-sm font-medium">Activar 2FA</p>
              <p className="text-xs text-muted-foreground">
                Requiere verificación por SMS o app autenticadora
              </p>
            </div>
            <Switch
              checked={twoFactorEnabled}
              onCheckedChange={handleToggle2FA}
            />
          </div>
        </CardContent>
      </Card>

      {/* Active Sessions */}
      <Card>
        <CardHeader>
          <CardTitle>
            <Smartphone className="h-5 w-5 inline mr-2" />
            Sesiones Activas
          </CardTitle>
          <CardDescription>
            Administra dónde has iniciado sesión
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            {sessions.map((session) => (
              <div
                key={session.id}
                className="flex items-start justify-between p-3 border rounded-lg"
              >
                <div className="space-y-1">
                  <p className="text-sm font-medium flex items-center gap-2">
                    {session.device}
                    {session.current && (
                      <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">
                        Actual
                      </span>
                    )}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {session.location} • Última actividad: {new Date(session.lastActive).toLocaleString('es-ES')}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {sessions.filter((s) => !s.current).length > 0 && (
            <Button
              variant="outline"
              onClick={() => setShowCloseSessionsDialog(true)}
            >
              <AlertTriangle className="h-4 w-4 mr-2" />
              Cerrar otras sesiones
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Close Sessions Dialog */}
      <AlertDialog open={showCloseSessionsDialog} onOpenChange={setShowCloseSessionsDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Cerrar otras sesiones?</AlertDialogTitle>
            <AlertDialogDescription>
              Esto cerrará sesión en todos los dispositivos excepto el actual.
              Tendrás que volver a iniciar sesión en esos dispositivos.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleCloseOtherSessions}>
              Cerrar sesiones
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
