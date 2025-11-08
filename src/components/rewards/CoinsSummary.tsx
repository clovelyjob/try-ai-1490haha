import { Coins, TrendingUp, Award } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useRewardsStore } from '@/store/useRewardsStore';

const LEVEL_THRESHOLDS = {
  'Novato': 0,
  'Junior': 100,
  'Pro': 500,
  'Master': 1500,
  'Líder': 3000,
};

const LEVEL_COLORS = {
  'Novato': 'text-muted-foreground',
  'Junior': 'text-blue-500',
  'Pro': 'text-purple-500',
  'Master': 'text-orange-500',
  'Líder': 'text-yellow-500',
};

export function CoinsSummary() {
  const { coins, level, totalCoins, achievements } = useRewardsStore();
  
  const unlockedCount = achievements.filter(a => a.unlocked).length;
  
  // Calculate progress to next level
  const levels = Object.entries(LEVEL_THRESHOLDS);
  const currentLevelIndex = levels.findIndex(([l]) => l === level);
  const nextLevel = levels[currentLevelIndex + 1];
  
  let progressPercentage = 100;
  let coinsToNext = 0;
  
  if (nextLevel) {
    const currentThreshold = LEVEL_THRESHOLDS[level];
    const nextThreshold = nextLevel[1];
    const progress = totalCoins - currentThreshold;
    const total = nextThreshold - currentThreshold;
    progressPercentage = (progress / total) * 100;
    coinsToNext = nextThreshold - totalCoins;
  }

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Coins Disponibles</p>
              <h3 className="text-3xl font-bold mt-2 flex items-center gap-2">
                <Coins className="h-8 w-8 text-primary" />
                {coins}
              </h3>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-muted-foreground">Nivel Actual</p>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </div>
            <div>
              <h3 className={`text-2xl font-bold ${LEVEL_COLORS[level]}`}>
                {level}
              </h3>
              {nextLevel && (
                <p className="text-xs text-muted-foreground mt-1">
                  {coinsToNext} coins para {nextLevel[0]}
                </p>
              )}
            </div>
            {nextLevel && (
              <div className="space-y-1">
                <Progress value={progressPercentage} className="h-2" />
                <p className="text-xs text-muted-foreground text-right">
                  {Math.round(progressPercentage)}%
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Logros Desbloqueados</p>
              <h3 className="text-3xl font-bold mt-2 flex items-center gap-2">
                <Award className="h-8 w-8 text-primary" />
                {unlockedCount}/{achievements.length}
              </h3>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
