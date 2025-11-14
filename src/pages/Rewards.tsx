import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CoinsSummary } from '@/components/rewards/CoinsSummary';
import { RewardsShop } from '@/components/rewards/RewardsShop';
import { AchievementsPanel } from '@/components/rewards/AchievementsPanel';
import { Leaderboard } from '@/components/rewards/Leaderboard';
import { Gift, Award, Trophy } from 'lucide-react';

export default function Rewards() {
  return (
    <div className="container mx-auto p-6 space-y-8">
      <div>
        <h1 className="text-4xl font-bold mb-2">Recompensas</h1>
        <p className="text-muted-foreground">
          Gana coins completando acciones y canjéalos por beneficios exclusivos
        </p>
      </div>

      <CoinsSummary />

      <Tabs defaultValue="shop" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="shop" className="flex items-center gap-2">
            <Gift className="h-4 w-4" />
            Tienda
          </TabsTrigger>
          <TabsTrigger value="achievements" className="flex items-center gap-2">
            <Award className="h-4 w-4" />
            Mis Logros
          </TabsTrigger>
          <TabsTrigger value="leaderboard" className="flex items-center gap-2">
            <Trophy className="h-4 w-4" />
            Ranking
          </TabsTrigger>
        </TabsList>

        <TabsContent value="shop" className="mt-6">
          <RewardsShop />
        </TabsContent>

        <TabsContent value="achievements" className="mt-6">
          <AchievementsPanel />
        </TabsContent>

        <TabsContent value="leaderboard" className="mt-6">
          <Leaderboard />
        </TabsContent>
      </Tabs>
    </div>
  );
}
