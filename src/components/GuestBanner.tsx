import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuthStore } from '@/store/useAuthStore';
import { AlertCircle, Sparkles, X } from 'lucide-react';
import { toast } from 'sonner';
import { z } from 'zod';

const registerSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres'),
});

export function GuestBanner() {
  const { isGuestMode, convertGuestToUser } = useAuthStore();
  const [showModal, setShowModal] = useState(false);
  const [showBanner, setShowBanner] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!isGuestMode || !showBanner) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    
    try {
      const validated = registerSchema.parse(formData);
      setIsLoading(true);
      
      await convertGuestToUser(validated.name, validated.email, validated.password);
      
      toast.success('¡Cuenta creada exitosamente!', {
        description: 'Tu progreso de demostración se ha guardado',
      });
      
      setShowModal(false);
      setShowBanner(false);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            fieldErrors[err.path[0].toString()] = err.message;
          }
        });
        setErrors(fieldErrors);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <AnimatePresence>
        {showBanner && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="sticky top-0 z-40"
          >
            <Alert className="rounded-none border-x-0 bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
              <Sparkles className="h-4 w-4 text-primary" />
              <AlertDescription className="flex items-center justify-between gap-4">
                <span className="text-sm">
                  <strong>Estás usando la versión demo.</strong> Tus datos no se guardarán permanentemente.
                </span>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    onClick={() => setShowModal(true)}
                    className="gradient-orange text-white shrink-0"
                  >
                    Crear mi cuenta
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setShowBanner(false)}
                    className="shrink-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </AlertDescription>
            </Alert>
          </motion.div>
        )}
      </AnimatePresence>

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Guardar mi progreso
            </DialogTitle>
            <DialogDescription>
              Crea tu cuenta para guardar todo lo que hiciste en la demostración
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre completo</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ana García"
                disabled={isLoading}
              />
              {errors.name && (
                <p className="text-xs text-destructive flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.name}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="ana@ejemplo.com"
                disabled={isLoading}
              />
              {errors.email && (
                <p className="text-xs text-destructive flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.email}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="Mínimo 8 caracteres"
                disabled={isLoading}
              />
              {errors.password && (
                <p className="text-xs text-destructive flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.password}
                </p>
              )}
            </div>

            <Alert className="bg-primary/5 border-primary/20">
              <Sparkles className="h-4 w-4 text-primary" />
              <AlertDescription className="text-xs">
                Al crear tu cuenta, guardaremos todo tu progreso de la demostración automáticamente
              </AlertDescription>
            </Alert>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowModal(false)} disabled={isLoading}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isLoading} className="gradient-orange text-white">
                {isLoading ? 'Creando cuenta...' : 'Crear mi cuenta'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
