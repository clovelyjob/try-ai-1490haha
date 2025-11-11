import { useState } from 'react';
import { Gift, MessageCircle, FileText, BookOpen, Coins } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useRewardsStore, type RewardCategory } from '@/store/useRewardsStore';
import { RewardModal } from './RewardModal';

const ICON_MAP = {
  Gift,
  MessageCircle,
  FileText,
  BookOpen,
};

const CATEGORY_LABELS: Record<RewardCategory, string> = {
  gift_card: 'Beneficios',
  mentorship: 'Mentorías',
  template: 'Plantillas',
  course: 'Cursos',
};

export function RewardsShop() {
  const { coins, getRewards } = useRewardsStore();
  const rewards = getRewards();
  const [selectedReward, setSelectedReward] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<'all' | RewardCategory>('all');

  const filteredRewards = selectedCategory === 'all' 
    ? rewards 
    : rewards.filter(r => r.category === selectedCategory);

  const selectedRewardData = rewards.find(r => r.id === selectedReward);

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Tienda de Recompensas</h2>
            <p className="text-muted-foreground mt-1">Canjea tus coins por beneficios exclusivos</p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-lg">
            <Coins className="h-5 w-5 text-primary" />
            <span className="font-semibold">{coins} coins</span>
          </div>
        </div>

        <Tabs value={selectedCategory} onValueChange={(v) => setSelectedCategory(v as any)}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="all">Todas</TabsTrigger>
            <TabsTrigger value="gift_card">Beneficios</TabsTrigger>
            <TabsTrigger value="mentorship">Mentorías</TabsTrigger>
            <TabsTrigger value="template">Plantillas</TabsTrigger>
            <TabsTrigger value="course">Cursos</TabsTrigger>
          </TabsList>

          <TabsContent value={selectedCategory} className="mt-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredRewards.map((reward) => {
                const Icon = ICON_MAP[reward.icon as keyof typeof ICON_MAP];
                const canAfford = coins >= reward.cost;

                return (
                  <Card key={reward.id} className={!canAfford ? 'opacity-60' : ''}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <Icon className="h-6 w-6 text-primary" />
                        </div>
                        <Badge variant="secondary">
                          {CATEGORY_LABELS[reward.category]}
                        </Badge>
                      </div>
                      <CardTitle className="mt-4">{reward.title}</CardTitle>
                      <CardDescription>{reward.description}</CardDescription>
                    </CardHeader>
                    <CardFooter className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <Coins className="h-4 w-4 text-primary" />
                        <span className="font-semibold">{reward.cost}</span>
                      </div>
                      <Button
                        onClick={() => setSelectedReward(reward.id)}
                        disabled={!canAfford}
                        variant={canAfford ? 'default' : 'outline'}
                      >
                        {canAfford ? 'Canjear' : 'Insuficiente'}
                      </Button>
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {selectedRewardData && (
        <RewardModal
          reward={selectedRewardData}
          open={!!selectedReward}
          onClose={() => setSelectedReward(null)}
        />
      )}
    </>
  );
}
