import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { RefreshCw, History, Sparkles, CheckCircle2, RotateCcw } from 'lucide-react';
import { useProfileStore } from '@/store/useProfileStore';
import { useAuthStore } from '@/store/useAuthStore';
import { PROFESSIONAL_ROLES, getRoleDefinition, detectRole } from '@/lib/roleDetection';
import { ProfessionalRole } from '@/types';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

export const RoleSection = () => {
  const navigate = useNavigate();
  const { updateUser } = useAuthStore();
  const { profile, updateRole } = useProfileStore();
  const [isReanalyzing, setIsReanalyzing] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  if (!profile) return null;

  const currentRoleInfo = getRoleDefinition(profile.rolActual);

  const handleReanalyze = () => {
    setIsReanalyzing(true);
    setTimeout(() => {
      if (profile.preferencias) {
        const suggestions = detectRole(profile.preferencias);
        if (suggestions.length > 0) {
          updateRole(suggestions[0].role, suggestions[0].confidence);
          toast.success('Tu perfil ha sido actualizado según tus actividades recientes');
        }
      }
      setIsReanalyzing(false);
    }, 1500);
  };

  const handleSelectRole = (role: ProfessionalRole) => {
    updateRole(role, 100);
    toast.success('Rol actualizado correctamente');
  };

  const handleRecalibrate = () => {
    updateUser({ onboardingCompleted: false });
    toast.info('Redirigiendo al diagnóstico completo...');
    setTimeout(() => {
      navigate('/onboarding');
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-heading font-bold">Rol Profesional</h2>
        <p className="text-muted-foreground mt-1">
          Personaliza tu experiencia según tu perfil profesional
        </p>
      </div>

      <Separator />

      {/* Rol Actual */}
      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <Label className="text-sm text-muted-foreground">Rol actual</Label>
              <div className="flex items-center gap-3 mt-2">
                <span className="text-4xl">{currentRoleInfo?.icon}</span>
                <div>
                  <h3 className="text-xl font-heading font-bold">{currentRoleInfo?.label}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{currentRoleInfo?.description}</p>
                </div>
              </div>
            </div>
            <Badge className="gradient-orange text-white">
              Activo
            </Badge>
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={handleReanalyze}
              disabled={isReanalyzing}
              className="flex-1"
            >
              {isReanalyzing ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Revaluando...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Reevaluar perfil
                </>
              )}
            </Button>
            <Button
              variant="default"
              onClick={handleRecalibrate}
              className="flex-1 gradient-orange text-white"
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              Diagnóstico completo
            </Button>
          </div>
        </div>
      </Card>

      {/* Historial */}
      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-heading font-bold">Historial de Roles</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowHistory(!showHistory)}
            >
              <History className="h-4 w-4 mr-2" />
              {showHistory ? 'Ocultar' : 'Ver historial'}
            </Button>
          </div>

          {showHistory && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-2"
            >
              {profile.historialRol?.map((entry, index) => {
                const roleInfo = getRoleDefinition(entry.rol);
                return (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 rounded-lg border bg-muted/30"
                  >
                    <span className="text-2xl">{roleInfo?.icon}</span>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{roleInfo?.label}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(entry.fecha).toLocaleDateString('es-ES', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {entry.confidence}% match
                    </Badge>
                  </div>
                );
              })}
            </motion.div>
          )}
        </div>
      </Card>

      {/* Cambiar Rol Manualmente */}
      <Card className="p-6">
        <div className="space-y-4">
          <div>
            <h3 className="font-heading font-bold mb-1">Cambiar rol manualmente</h3>
            <p className="text-sm text-muted-foreground">
              Selecciona un rol diferente si lo prefieres
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-96 overflow-y-auto">
            {PROFESSIONAL_ROLES.filter(r => r.id !== 'other').map((role) => (
              <button
                key={role.id}
                onClick={() => handleSelectRole(role.id)}
                className={`p-4 rounded-lg border-2 transition-all text-left hover:shadow-md ${
                  profile.rolActual === role.id
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="text-3xl">{role.icon}</span>
                    {profile.rolActual === role.id && (
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-sm">{role.label}</p>
                    <Badge variant="secondary" className="text-xs mt-1">
                      {role.category}
                    </Badge>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
};
