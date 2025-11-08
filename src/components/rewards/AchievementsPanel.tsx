import { 
  Trophy, FileText, Video, Target, Award, Crown, 
  Star, Send, Zap, Users, Lock 
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useRewardsStore } from '@/store/useRewardsStore';
import { motion } from 'framer-motion';

const ICON_MAP = {
  Trophy,
  FileText,
  Video,
  Target,
  Award,
  Crown,
  Star,
  Send,
  Zap,
  Users,
};

export function AchievementsPanel() {
  const { achievements } = useRewardsStore();

  const unlockedAchievements = achievements.filter(a => a.unlocked);
  const lockedAchievements = achievements.filter(a => !a.unlocked);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Mis Logros</h2>
        <p className="text-muted-foreground mt-1">
          Desbloquea logros completando acciones y gana coins
        </p>
      </div>

      {unlockedAchievements.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Desbloqueados ({unlockedAchievements.length})</h3>
          <div className="grid gap-4 md:grid-cols-2">
            {unlockedAchievements.map((achievement, index) => {
              const Icon = ICON_MAP[achievement.icon as keyof typeof ICON_MAP];
              
              return (
                <motion.div
                  key={achievement.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="p-2 bg-primary rounded-lg">
                          <Icon className="h-6 w-6 text-primary-foreground" />
                        </div>
                        <Badge variant="default">
                          +{achievement.coinsReward} coins
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <CardTitle className="text-lg mb-1">{achievement.title}</CardTitle>
                      <CardDescription>{achievement.description}</CardDescription>
                      {achievement.unlockedAt && (
                        <p className="text-xs text-muted-foreground mt-2">
                          Desbloqueado: {new Date(achievement.unlockedAt).toLocaleDateString('es-ES')}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {lockedAchievements.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Bloqueados ({lockedAchievements.length})</h3>
          <div className="grid gap-4 md:grid-cols-2">
            {lockedAchievements.map((achievement, index) => {
              const Icon = ICON_MAP[achievement.icon as keyof typeof ICON_MAP];
              const hasProgress = achievement.progress !== undefined && achievement.target;
              const progressPercentage = hasProgress 
                ? (achievement.progress! / achievement.target!) * 100 
                : 0;

              return (
                <motion.div
                  key={achievement.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="opacity-75">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="p-2 bg-muted rounded-lg">
                          <Lock className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <Badge variant="secondary">
                          +{achievement.coinsReward} coins
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <CardTitle className="text-lg mb-1 text-muted-foreground">
                        {achievement.title}
                      </CardTitle>
                      <CardDescription>{achievement.description}</CardDescription>
                      
                      {hasProgress && (
                        <div className="mt-3 space-y-2">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-muted-foreground">Progreso</span>
                            <span className="font-medium">
                              {achievement.progress}/{achievement.target}
                            </span>
                          </div>
                          <Progress value={progressPercentage} className="h-2" />
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
