import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, X, Sparkles } from 'lucide-react';

interface UpgradeModalProps {
  open: boolean;
  onClose: () => void;
  feature?: string;
  onStartTrial?: () => void;
}

export const UpgradeModal = ({ open, onClose, feature, onStartTrial }: UpgradeModalProps) => {
  const handleStartTrial = () => {
    if (onStartTrial) {
      onStartTrial();
    }
    onClose();
  };
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Sparkles className="h-6 w-6 text-primary" />
            Desbloquea todo el potencial de Clovely
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {feature && (
            <div className="rounded-lg bg-primary/10 p-4 border border-primary/20">
              <p className="text-sm">
                Has alcanzado el límite de <strong>{feature}</strong> en el plan gratuito.
                Actualiza a Premium para acceso ilimitado.
              </p>
            </div>
          )}
          {!feature && (
            <div className="text-center space-y-2">
              <p className="text-lg font-semibold">Empieza con <span className="text-primary">7 días gratis</span></p>
              <p className="text-sm text-muted-foreground">Cancela cuando quieras. Sin permanencia.</p>
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-4">
            <div className="border rounded-lg p-6 space-y-4">
              <div>
                <h3 className="font-heading font-bold text-lg mb-1">Free</h3>
                <p className="text-3xl font-heading font-bold">$0<span className="text-sm text-muted-foreground">/mes</span></p>
              </div>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-success shrink-0 mt-0.5" />
                  <span>Diagnóstico básico</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-success shrink-0 mt-0.5" />
                  <span>1 objetivo activo</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-success shrink-0 mt-0.5" />
                  <span>10 microacciones/semana</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-success shrink-0 mt-0.5" />
                  <span>5 mensajes IA/mes</span>
                </li>
                <li className="flex items-start gap-2">
                  <X className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">CV optimizado IA</span>
                </li>
                <li className="flex items-start gap-2">
                  <X className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">Simulador ilimitado</span>
                </li>
                <li className="flex items-start gap-2">
                  <X className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">Match inteligente empleos</span>
                </li>
              </ul>
            </div>

            <div className="border-2 border-primary rounded-lg p-6 space-y-4 relative overflow-hidden">
              <Badge className="absolute top-3 right-3 gradient-premium text-white">
                Recomendado
              </Badge>
              <div>
                <h3 className="font-heading font-bold text-lg mb-1">Premium</h3>
                <p className="text-3xl font-heading font-bold text-primary">
                  $20<span className="text-sm text-muted-foreground">/mes</span>
                </p>
              </div>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-success shrink-0 mt-0.5" />
                  <span>Todo de Free +</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-success shrink-0 mt-0.5" />
                  <span className="font-semibold">Objetivos ilimitados</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-success shrink-0 mt-0.5" />
                  <span className="font-semibold">Coach IA 24/7 ilimitado</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-success shrink-0 mt-0.5" />
                  <span className="font-semibold">CV optimizado con IA</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-success shrink-0 mt-0.5" />
                  <span className="font-semibold">Simulador entrevistas ilimitado</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-success shrink-0 mt-0.5" />
                  <span className="font-semibold">Match inteligente empleos</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-success shrink-0 mt-0.5" />
                  <span>2 mentorías grupales/mes</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-success shrink-0 mt-0.5" />
                  <span>Certificados de logros</span>
                </li>
              </ul>
              <Button 
                className="w-full gradient-orange text-white font-semibold"
                onClick={handleStartTrial}
              >
                Iniciar prueba de 7 días gratis
              </Button>
              <p className="text-xs text-center text-muted-foreground">
                Después de la prueba, $20/mes. Sin permanencia.
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
