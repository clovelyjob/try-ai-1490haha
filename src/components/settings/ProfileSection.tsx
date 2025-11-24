import { useState } from 'react';
import { User, Mail, Phone, MapPin, Linkedin, Camera } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuthStore } from '@/store/useAuthStore';
import { toast } from '@/hooks/use-toast';
import { z } from 'zod';

const profileSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido').max(50, 'Máximo 50 caracteres'),
  email: z.string().email('Email inválido'),
  phone: z.string().optional(),
  location: z.string().optional(),
  linkedin: z.string().url('URL inválida').optional().or(z.literal('')),
});

export function ProfileSection() {
  const { user, updateUser } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    location: '',
    linkedin: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleSave = async () => {
    try {
      // Validate
      profileSchema.parse(formData);
      setErrors({});
      
      setIsSaving(true);
      
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 800));
      
      // Update user in store
      updateUser({ name: formData.name, email: formData.email });
      
      toast({
        title: 'Perfil actualizado',
        description: 'Tus cambios han sido guardados exitosamente.',
      });
      
      setIsEditing(false);
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

  const handleAvatarChange = () => {
    toast({
      title: 'Función en desarrollo',
      description: 'La carga de avatar estará disponible pronto.',
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Perfil Personal</CardTitle>
        <CardDescription>
          Administra tu información personal y cómo otros te ven
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Avatar */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
          <Avatar className="h-20 w-20 flex-shrink-0">
            <AvatarImage src={user?.avatar} />
            <AvatarFallback className="text-lg">
              {user?.name?.[0]?.toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleAvatarChange}
              className="min-h-[44px] w-full sm:w-auto"
            >
              <Camera className="h-4 w-4 mr-2" />
              Cambiar foto
            </Button>
            <p className="text-xs text-muted-foreground mt-1">
              JPG, PNG o GIF (máx. 2MB)
            </p>
          </div>
        </div>

        {/* Form */}
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="name">
              <User className="h-4 w-4 inline mr-2" />
              Nombre completo
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              disabled={!isEditing}
              className={`min-h-[44px] ${errors.name ? 'border-destructive' : ''}`}
            />
            {errors.name && (
              <p className="text-xs text-destructive">{errors.name}</p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="email">
              <Mail className="h-4 w-4 inline mr-2" />
              Email
            </Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              disabled={!isEditing}
              className={`min-h-[44px] ${errors.email ? 'border-destructive' : ''}`}
            />
            {errors.email && (
              <p className="text-xs text-destructive">{errors.email}</p>
            )}
            {!isEditing && (
              <p className="text-xs text-muted-foreground">
                El email requiere verificación para cambios
              </p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="phone">
              <Phone className="h-4 w-4 inline mr-2" />
              Teléfono (opcional)
            </Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              disabled={!isEditing}
              placeholder="+51 999 999 999"
              className="min-h-[44px]"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="location">
              <MapPin className="h-4 w-4 inline mr-2" />
              Ubicación (opcional)
            </Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => handleChange('location', e.target.value)}
              disabled={!isEditing}
              placeholder="Lima, Perú"
              className="min-h-[44px]"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="linkedin">
              <Linkedin className="h-4 w-4 inline mr-2" />
              LinkedIn (opcional)
            </Label>
            <Input
              id="linkedin"
              type="url"
              value={formData.linkedin}
              onChange={(e) => handleChange('linkedin', e.target.value)}
              disabled={!isEditing}
              placeholder="https://linkedin.com/in/tu-perfil"
              className={`min-h-[44px] ${errors.linkedin ? 'border-destructive' : ''}`}
            />
            {errors.linkedin && (
              <p className="text-xs text-destructive">{errors.linkedin}</p>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-2">
          {isEditing ? (
            <>
              <Button onClick={handleSave} disabled={isSaving} className="min-h-[44px] w-full sm:w-auto">
                {isSaving ? 'Guardando...' : 'Guardar cambios'}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setIsEditing(false);
                  setErrors({});
                  // Reset form
                  setFormData({
                    name: user?.name || '',
                    email: user?.email || '',
                    phone: '',
                    location: '',
                    linkedin: '',
                  });
                }}
                disabled={isSaving}
                className="min-h-[44px] w-full sm:w-auto"
              >
                Cancelar
              </Button>
            </>
          ) : (
            <Button onClick={() => setIsEditing(true)} className="min-h-[44px] w-full sm:w-auto">
              Editar perfil
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
