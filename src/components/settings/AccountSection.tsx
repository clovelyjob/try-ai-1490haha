import { useState } from 'react';
import { Download, Trash2, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
import { useAuthStore } from '@/store/useAuthStore';
import { toast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

export function AccountSection() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const handleExportData = async () => {
    setIsExporting(true);
    
    toast({
      title: 'Preparando exportación',
      description: 'Recopilando todos tus datos...',
    });

    // Simulate export process
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Create mock JSON data
    const exportData = {
      user: {
        id: user?.id,
        name: user?.name,
        email: user?.email,
        plan: user?.plan,
        createdAt: user?.createdAt,
      },
      profile: {
        // Mock profile data
        completedAt: new Date().toISOString(),
      },
      cvs: [],
      interviews: [],
      applications: [],
      microactions: [],
      circles: [],
    };

    // Create and download file
    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `clovely-data-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setIsExporting(false);
    
    toast({
      title: 'Exportación completada',
      description: 'Tu archivo ha sido descargado exitosamente.',
    });
  };

  const handleDeleteAccount = async () => {
    if (!deletePassword) {
      toast({
        title: 'Contraseña requerida',
        description: 'Debes ingresar tu contraseña para confirmar.',
        variant: 'destructive',
      });
      return;
    }

    setIsDeleting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Clear all localStorage
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith('moonjab-')) {
        localStorage.removeItem(key);
      }
    });

    logout();
    
    toast({
      title: 'Cuenta eliminada',
      description: 'Tu cuenta ha sido eliminada permanentemente.',
    });

    setShowDeleteDialog(false);
    setIsDeleting(false);
    
    // Redirect to landing
    navigate('/');
  };

  return (
    <div className="space-y-6">
      {/* Export Data */}
      <Card>
        <CardHeader>
          <CardTitle>
            <Download className="h-5 w-5 inline mr-2" />
            Exportar tus Datos
          </CardTitle>
          <CardDescription>
            Descarga una copia completa de toda tu información
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-muted rounded-lg space-y-2">
            <div className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-primary mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium">Incluye:</p>
                <ul className="text-xs text-muted-foreground space-y-1 mt-1">
                  <li>• Perfil y configuración</li>
                  <li>• Todos tus CVs y versiones</li>
                  <li>• Historial de postulaciones</li>
                  <li>• Sesiones de entrevista guardadas</li>
                  <li>• Microacciones y progreso</li>
                  <li>• Actividad en círculos</li>
                </ul>
              </div>
            </div>
          </div>

          <Button onClick={handleExportData} disabled={isExporting}>
            <Download className="h-4 w-4 mr-2" />
            {isExporting ? 'Exportando...' : 'Descargar mis datos'}
          </Button>

          <p className="text-xs text-muted-foreground">
            El archivo se descargará en formato JSON. El proceso puede tardar unos
            segundos.
          </p>
        </CardContent>
      </Card>

      {/* Delete Account */}
      <Card className="border-destructive/50">
        <CardHeader>
          <CardTitle className="text-destructive">
            <Trash2 className="h-5 w-5 inline mr-2" />
            Eliminar Cuenta
          </CardTitle>
          <CardDescription>
            Elimina permanentemente tu cuenta y todos tus datos
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg space-y-2">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 text-destructive mt-0.5 shrink-0" />
              <div className="space-y-2 text-sm text-destructive">
                <p className="font-medium">Esta acción es irreversible</p>
                <p>Al eliminar tu cuenta:</p>
                <ul className="space-y-1 text-xs">
                  <li>• Perderás acceso a todos tus CVs y datos</li>
                  <li>• Se eliminarán tus postulaciones y progreso</li>
                  <li>• No podrás recuperar tu cuenta más tarde</li>
                  <li>• Serás removido de todos los círculos</li>
                  <li>• Se cancelará tu suscripción si tienes una activa</li>
                </ul>
              </div>
            </div>
          </div>

          <Button
            variant="destructive"
            onClick={() => setShowDeleteDialog(true)}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Eliminar mi cuenta
          </Button>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-destructive">
              ¿Estás completamente seguro?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Esto eliminará permanentemente tu cuenta
              y removerá todos tus datos de nuestros servidores.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="py-4">
            <Label htmlFor="delete-password" className="text-sm font-medium">
              Ingresa tu contraseña para confirmar
            </Label>
            <Input
              id="delete-password"
              type="password"
              value={deletePassword}
              onChange={(e) => setDeletePassword(e.target.value)}
              placeholder="Tu contraseña"
              className="mt-2"
            />
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeletePassword('')}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteAccount}
              disabled={isDeleting || !deletePassword}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? 'Eliminando...' : 'Eliminar permanentemente'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
