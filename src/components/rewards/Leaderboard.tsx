import { Trophy, Medal, Award, Coins } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useRewardsStore } from '@/store/useRewardsStore';
import { motion } from 'framer-motion';

const RANK_ICONS = [Trophy, Medal, Award];
const RANK_COLORS = [
  'text-yellow-500',
  'text-gray-400',
  'text-orange-600',
];

export function Leaderboard() {
  const { getLeaderboard } = useRewardsStore();
  const leaderboard = getLeaderboard();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Ranking Global</h2>
        <p className="text-muted-foreground mt-1">
          Compite con otros usuarios y alcanza la cima
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Top 10 Usuarios</CardTitle>
          <CardDescription>
            Usuarios con más coins acumulados
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {leaderboard.map((entry, index) => {
              const Icon = RANK_ICONS[index] || Award;
              const iconColor = RANK_COLORS[index] || 'text-muted-foreground';
              const isCurrentUser = entry.userId === 'current_user';

              return (
                <motion.div
                  key={entry.userId}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`flex items-center gap-4 p-4 rounded-lg border ${
                    isCurrentUser 
                      ? 'bg-primary/5 border-primary' 
                      : 'bg-card'
                  }`}
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="flex items-center gap-2 w-12">
                      <span className="text-lg font-bold text-muted-foreground">
                        {index + 1}
                      </span>
                      {index < 3 && (
                        <Icon className={`h-5 w-5 ${iconColor}`} />
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold truncate">
                          {entry.name}
                        </p>
                        {isCurrentUser && (
                          <Badge variant="default" className="text-xs">
                            Tú
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {entry.achievementsCount} logros
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <Badge variant="outline" className="font-medium">
                      {entry.level}
                    </Badge>
                    
                    <div className="flex items-center gap-1.5 min-w-[80px] justify-end">
                      <Coins className="h-4 w-4 text-primary" />
                      <span className="font-bold text-lg">{entry.coins}</span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
