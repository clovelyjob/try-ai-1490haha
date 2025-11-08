import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCVStore } from '@/store/useCVStore';
import { useAuthStore } from '@/store/useAuthStore';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { FileText, Plus, MoreVertical, Download, Copy, Trash2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export default function CVList() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { cvs, seedInitialData, deleteCV, duplicateCV } = useCVStore();
  const [userCVs, setUserCVs] = useState(cvs.filter((cv) => cv.userId === user?.id));

  useEffect(() => {
    if (user) {
      seedInitialData(user.id);
    }
  }, [user, seedInitialData]);

  useEffect(() => {
    setUserCVs(cvs.filter((cv) => cv.userId === user?.id));
  }, [cvs, user]);

  const handleDelete = (id: string) => {
    deleteCV(id);
    toast({
      title: '🗑️ CV eliminado',
      description: 'El CV ha sido eliminado correctamente',
    });
  };

  const handleDuplicate = (id: string) => {
    const newCV = duplicateCV(id);
    toast({
      title: '📋 CV duplicado',
      description: 'Se ha creado una copia del CV',
    });
    navigate(`/dashboard/cvs/${newCV.id}`);
  };

  const getTemplateLabel = (template: string) => {
    const labels: Record<string, string> = {
      harvard: 'Harvard',
      modern: 'Moderno',
      minimal: 'Minimal',
      creative: 'Creativo',
    };
    return labels[template] || template;
  };

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Tus CVs</h1>
          <p className="text-muted-foreground mt-1">
            Crea y gestiona tus currículums profesionales
          </p>
        </div>
        <Button onClick={() => navigate('/dashboard/cvs/new')}>
          <Plus className="mr-2 h-4 w-4" />
          Nuevo CV
        </Button>
      </div>

      {userCVs.length === 0 ? (
        <Card className="p-12 text-center">
          <FileText className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold mb-2">Aún no tienes CVs</h3>
          <p className="text-muted-foreground mb-6">
            Crea tu primer CV profesional y comienza a destacar
          </p>
          <Button onClick={() => navigate('/dashboard/cvs/new')}>
            <Plus className="mr-2 h-4 w-4" />
            Crear mi primer CV
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {userCVs.map((cv) => (
            <Card
              key={cv.id}
              className="p-6 hover:shadow-lg transition-all cursor-pointer group"
              onClick={() => navigate(`/dashboard/cvs/${cv.id}`)}
            >
              <div className="flex items-start justify-between mb-4">
                <FileText className="h-8 w-8 text-primary" />
                <DropdownMenu>
                  <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/dashboard/cvs/${cv.id}`);
                    }}>
                      <FileText className="mr-2 h-4 w-4" />
                      Editar
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={(e) => {
                      e.stopPropagation();
                      handleDuplicate(cv.id);
                    }}>
                      <Copy className="mr-2 h-4 w-4" />
                      Duplicar
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={(e) => {
                      e.stopPropagation();
                      toast({ title: 'Exportar PDF', description: 'Próximamente' });
                    }}>
                      <Download className="mr-2 h-4 w-4" />
                      Descargar PDF
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(cv.id);
                      }}
                      className="text-destructive"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Eliminar
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <h3 className="font-semibold text-lg mb-2 line-clamp-1">{cv.title}</h3>
              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                {cv.personal.fullName || 'Sin nombre'} • {cv.personal.title || 'Sin título'}
              </p>

              <div className="flex items-center gap-2 mb-4">
                <Badge variant="outline">{getTemplateLabel(cv.template)}</Badge>
                <Badge
                  variant={cv.score.overall >= 75 ? 'default' : 'secondary'}
                  className="ml-auto"
                >
                  {cv.score.overall}% Score
                </Badge>
              </div>

              <div className="text-xs text-muted-foreground">
                Actualizado {new Date(cv.updatedAt).toLocaleDateString('es-ES')}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
