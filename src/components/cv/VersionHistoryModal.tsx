import { useState } from 'react';
import { CVData, CVVersion } from '@/types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
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
import { Clock, RotateCcw, Trash2, FileText } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

interface VersionHistoryModalProps {
  open: boolean;
  onClose: () => void;
  versions: CVVersion[];
  onRestore: (versionId: string) => void;
  onDelete?: (versionId: string) => void;
}

export default function VersionHistoryModal({
  open,
  onClose,
  versions,
  onRestore,
  onDelete,
}: VersionHistoryModalProps) {
  const [restoreConfirm, setRestoreConfirm] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const handleRestore = (versionId: string) => {
    onRestore(versionId);
    setRestoreConfirm(null);
    onClose();
  };

  const handleDelete = (versionId: string) => {
    if (onDelete) {
      onDelete(versionId);
      setDeleteConfirm(null);
    }
  };

  const sortedVersions = [...versions].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl max-h-[80vh] rounded-3xl">
          <DialogHeader>
            <DialogTitle>Historial de Versiones</DialogTitle>
            <DialogDescription>
              Gestiona las versiones guardadas de tu CV. Puedes restaurar cualquier versión anterior.
            </DialogDescription>
          </DialogHeader>

          <ScrollArea className="h-[500px] pr-4">
            {sortedVersions.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                <div className="p-4 rounded-2xl bg-primary/5 mb-4">
                  <FileText className="h-16 w-16 opacity-50" />
                </div>
                <p className="font-medium text-lg">No hay versiones guardadas aún</p>
                <p className="text-sm mt-2">Haz clic en "Guardar versión" para crear una</p>
              </div>
            ) : (
              <div className="space-y-3">
                {sortedVersions.map((version, index) => (
                  <div
                    key={version.versionId}
                    className="border-2 rounded-xl p-4 hover:bg-accent/50 hover:shadow-clovely-md hover:-translate-y-0.5 transition-all duration-300"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">
                            {new Date(version.createdAt).toLocaleDateString('es-ES', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                          {index === 0 && (
                            <Badge className="text-xs bg-primary text-primary-foreground border-primary/30">
                              Más reciente
                            </Badge>
                          )}
                        </div>
                        
                        <p className="text-sm text-muted-foreground">
                          {formatDistanceToNow(new Date(version.createdAt), {
                            addSuffix: true,
                            locale: es,
                          })}
                        </p>

                        {version.note && (
                          <p className="text-sm mt-2 text-foreground/80 p-2 rounded-lg bg-muted/50">
                            📝 {version.note}
                          </p>
                        )}
                      </div>

                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setRestoreConfirm(version.versionId)}
                          className="shadow-clovely-sm hover:shadow-clovely-md"
                        >
                          <RotateCcw className="h-4 w-4 mr-1" />
                          Restaurar
                        </Button>
                        
                        {onDelete && sortedVersions.length > 1 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setDeleteConfirm(version.versionId)}
                            className="hover:bg-destructive/10"
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* Restore Confirmation Dialog */}
      <AlertDialog open={!!restoreConfirm} onOpenChange={() => setRestoreConfirm(null)}>
        <AlertDialogContent className="rounded-3xl backdrop-blur-md">
          <AlertDialogHeader>
            <AlertDialogTitle>¿Restaurar esta versión?</AlertDialogTitle>
            <AlertDialogDescription>
              Se creará una copia de seguridad automática de tu CV actual antes de restaurar.
              Los cambios no guardados se perderán.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl">Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={() => restoreConfirm && handleRestore(restoreConfirm)} className="rounded-xl shadow-clovely-sm">
              Restaurar versión
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <AlertDialogContent className="rounded-3xl backdrop-blur-md">
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar esta versión?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. La versión será eliminada permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl">Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteConfirm && handleDelete(deleteConfirm)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-xl shadow-clovely-sm"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
