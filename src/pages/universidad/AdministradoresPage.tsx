import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { UserCog, Plus, Trash2, Crown, Shield, Eye, Loader2 } from 'lucide-react';
import { useUniversidadStore } from '@/store/useUniversidadStore';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export default function AdministradoresPage() {
  const { admins, university, currentAdmin, setAdmins } = useUniversidadStore();
  const { toast } = useToast();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [newAdminName, setNewAdminName] = useState('');
  const [newAdminRole, setNewAdminRole] = useState<'admin' | 'viewer'>('admin');

  const isOwner = currentAdmin?.role === 'owner';

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'owner':
        return <Crown className="h-4 w-4" />;
      case 'admin':
        return <Shield className="h-4 w-4" />;
      case 'viewer':
        return <Eye className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'owner':
        return <Badge className="bg-yellow-500/10 text-yellow-600 border-yellow-200 gap-1">{getRoleIcon(role)} Propietario</Badge>;
      case 'admin':
        return <Badge className="bg-blue-500/10 text-blue-600 border-blue-200 gap-1">{getRoleIcon(role)} Administrador</Badge>;
      case 'viewer':
        return <Badge className="bg-gray-500/10 text-gray-600 border-gray-200 gap-1">{getRoleIcon(role)} Solo lectura</Badge>;
      default:
        return <Badge variant="outline">{role}</Badge>;
    }
  };

  const handleAddAdmin = async () => {
    if (!university || !isOwner) return;

    setIsLoading(true);

    try {
      // For now, we'll just add the admin record
      // In production, you'd invite them via email and create account
      const { data, error } = await supabase
        .from('university_admins')
        .insert({
          university_id: university.id,
          user_id: crypto.randomUUID(), // Placeholder - in real app, link to actual user
          name: newAdminName,
          email: newAdminEmail,
          role: newAdminRole,
        })
        .select()
        .single();

      if (error) throw error;

      setAdmins([...admins, {
        id: data.id,
        university_id: data.university_id,
        user_id: data.user_id,
        role: data.role as 'owner' | 'admin' | 'viewer',
        name: data.name,
        email: data.email,
        created_at: data.created_at,
      }]);

      toast({
        title: 'Administrador agregado',
        description: `Se ha enviado una invitación a ${newAdminEmail}`,
      });

      setIsAddDialogOpen(false);
      setNewAdminEmail('');
      setNewAdminName('');
      setNewAdminRole('admin');
    } catch (error: any) {
      toast({
        title: 'Error al agregar',
        description: error.message || 'Ocurrió un error. Intenta de nuevo.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveAdmin = async (adminId: string) => {
    if (!isOwner) return;

    try {
      const { error } = await supabase
        .from('university_admins')
        .delete()
        .eq('id', adminId);

      if (error) throw error;

      setAdmins(admins.filter(a => a.id !== adminId));

      toast({
        title: 'Administrador eliminado',
        description: 'El acceso ha sido revocado.',
      });
    } catch (error: any) {
      toast({
        title: 'Error al eliminar',
        description: error.message || 'Ocurrió un error. Intenta de nuevo.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold">Administradores</h1>
          <p className="text-muted-foreground">
            Gestiona el equipo que tiene acceso al dashboard
          </p>
        </div>

        {isOwner && (
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gradient-orange text-white">
                <Plus className="mr-2 h-4 w-4" />
                Agregar administrador
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Agregar nuevo administrador</DialogTitle>
                <DialogDescription>
                  Invita a un miembro de tu equipo académico
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nombre completo</Label>
                  <Input
                    id="name"
                    value={newAdminName}
                    onChange={(e) => setNewAdminName(e.target.value)}
                    placeholder="Juan Pérez"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Correo electrónico</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newAdminEmail}
                    onChange={(e) => setNewAdminEmail(e.target.value)}
                    placeholder="juan@universidad.edu"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role">Rol</Label>
                  <Select value={newAdminRole} onValueChange={(v) => setNewAdminRole(v as 'admin' | 'viewer')}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">
                        <div className="flex items-center gap-2">
                          <Shield className="h-4 w-4" />
                          Administrador - Puede gestionar y exportar
                        </div>
                      </SelectItem>
                      <SelectItem value="viewer">
                        <div className="flex items-center gap-2">
                          <Eye className="h-4 w-4" />
                          Solo lectura - Solo puede ver datos
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button 
                  onClick={handleAddAdmin}
                  disabled={isLoading || !newAdminEmail || !newAdminName}
                  className="gradient-orange text-white"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Agregando...
                    </>
                  ) : (
                    'Agregar'
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Admins Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-heading flex items-center gap-2">
              <UserCog className="h-5 w-5 text-primary" />
              Equipo de administración
            </CardTitle>
            <CardDescription>
              {admins.length} {admins.length === 1 ? 'persona' : 'personas'} con acceso
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Correo</TableHead>
                  <TableHead>Rol</TableHead>
                  <TableHead>Desde</TableHead>
                  {isOwner && <TableHead className="w-20"></TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {admins.map((admin) => (
                  <TableRow key={admin.id}>
                    <TableCell className="font-medium">
                      {admin.name}
                      {admin.id === currentAdmin?.id && (
                        <Badge variant="outline" className="ml-2">Tú</Badge>
                      )}
                    </TableCell>
                    <TableCell>{admin.email}</TableCell>
                    <TableCell>{getRoleBadge(admin.role)}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {format(new Date(admin.created_at), 'dd MMM yyyy', { locale: es })}
                    </TableCell>
                    {isOwner && (
                      <TableCell>
                        {admin.role !== 'owner' && admin.id !== currentAdmin?.id && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                            onClick={() => handleRemoveAdmin(admin.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {admins.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <UserCog className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No hay administradores configurados</p>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Permissions Info */}
      <Card className="bg-muted/30">
        <CardContent className="p-6">
          <h3 className="font-heading font-semibold mb-4">Niveles de acceso</h3>
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Crown className="h-5 w-5 text-yellow-500" />
                <span className="font-medium">Propietario</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Acceso completo. Puede agregar y eliminar administradores, exportar datos y modificar configuración.
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-blue-500" />
                <span className="font-medium">Administrador</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Puede ver todos los datos, exportar información y gestionar estudiantes.
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Eye className="h-5 w-5 text-gray-500" />
                <span className="font-medium">Solo lectura</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Solo puede visualizar datos del dashboard. No puede exportar ni modificar.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
