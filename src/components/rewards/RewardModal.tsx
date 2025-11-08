import { useState } from 'react';
import { Gift, Coins, Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useRewardsStore, type Reward } from '@/store/useRewardsStore';
import { toast } from '@/hooks/use-toast';
import confetti from 'canvas-confetti';

interface RewardModalProps {
  reward: Reward;
  open: boolean;
  onClose: () => void;
}

export function RewardModal({ reward, open, onClose }: RewardModalProps) {
  const { coins, redeemReward } = useRewardsStore();
  const [isRedeeming, setIsRedeeming] = useState(false);

  const canAfford = coins >= reward.cost;

  const handleRedeem = async () => {
    if (!canAfford) {
      toast({
        title: 'Coins insuficientes',
        description: `Necesitas ${reward.cost - coins} coins más para canjear esta recompensa.`,
        variant: 'destructive',
      });
      return;
    }

    setIsRedeeming(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const success = redeemReward(reward.id, reward.cost);
    
    if (success) {
      // Fire confetti
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });

      toast({
        title: '¡Recompensa canjeada!',
        description: `Has canjeado ${reward.title}. Recibirás más información por email.`,
      });
      
      onClose();
    } else {
      toast({
        title: 'Error al canjear',
        description: 'Hubo un problema al procesar tu solicitud. Intenta de nuevo.',
        variant: 'destructive',
      });
    }
    
    setIsRedeeming(false);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Gift className="h-5 w-5 text-primary" />
            Canjear Recompensa
          </DialogTitle>
          <DialogDescription>
            Confirma que deseas canjear esta recompensa
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="p-4 bg-muted rounded-lg">
            <h3 className="font-semibold text-lg mb-2">{reward.title}</h3>
            <p className="text-sm text-muted-foreground">{reward.description}</p>
          </div>

          <div className="flex items-center justify-between p-4 bg-primary/5 rounded-lg border border-primary/20">
            <div>
              <p className="text-sm text-muted-foreground">Costo</p>
              <div className="flex items-center gap-1.5 mt-1">
                <Coins className="h-5 w-5 text-primary" />
                <span className="text-xl font-bold">{reward.cost}</span>
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Tu balance</p>
              <div className="flex items-center gap-1.5 mt-1">
                <Coins className="h-5 w-5 text-primary" />
                <span className="text-xl font-bold">{coins}</span>
              </div>
            </div>
          </div>

          {!canAfford && (
            <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
              <p className="text-sm text-destructive font-medium">
                No tienes suficientes coins. Te faltan {reward.cost - coins} coins.
              </p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isRedeeming}>
            Cancelar
          </Button>
          <Button 
            onClick={handleRedeem} 
            disabled={!canAfford || isRedeeming}
          >
            {isRedeeming && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isRedeeming ? 'Procesando...' : 'Confirmar Canje'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
