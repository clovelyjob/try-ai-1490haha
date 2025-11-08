import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type RewardCategory = 'gift_card' | 'mentorship' | 'template' | 'course';
export type AchievementId = 'cv_created' | 'first_interview' | 'microactions_10' | 'microactions_50' | 'microactions_100' | 'cv_perfect' | 'interview_master' | 'job_applied' | 'level_pro' | 'friend_invited';
export type UserLevel = 'Novato' | 'Junior' | 'Pro' | 'Master' | 'Líder';

export interface CoinHistory {
  id: string;
  type: 'earn' | 'spend';
  amount: number;
  reason: string;
  timestamp: string;
}

export interface Reward {
  id: string;
  title: string;
  description: string;
  cost: number;
  image?: string;
  icon: string;
  category: RewardCategory;
  available: boolean;
}

export interface Achievement {
  id: AchievementId;
  title: string;
  description: string;
  coinsReward: number;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
  progress?: number;
  target?: number;
}

export interface LeaderboardEntry {
  userId: string;
  name: string;
  level: UserLevel;
  coins: number;
  achievementsCount: number;
}

interface RewardsState {
  coins: number;
  level: UserLevel;
  totalCoins: number;
  history: CoinHistory[];
  achievements: Achievement[];
  redeemedRewards: string[];
  
  // Actions
  addCoins: (amount: number, reason: string) => void;
  spendCoins: (amount: number, reason: string) => boolean;
  redeemReward: (rewardId: string, cost: number) => boolean;
  unlockAchievement: (achievementId: AchievementId) => void;
  updateAchievementProgress: (achievementId: AchievementId, progress: number) => void;
  checkLevelUp: () => UserLevel | null;
  
  // Getters
  getRewards: () => Reward[];
  getLeaderboard: () => LeaderboardEntry[];
}

const LEVEL_THRESHOLDS: Record<UserLevel, number> = {
  'Novato': 0,
  'Junior': 100,
  'Pro': 500,
  'Master': 1500,
  'Líder': 3000,
};

const INITIAL_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'cv_created',
    title: 'Primer CV',
    description: 'Creaste tu primer CV en Clovely',
    coinsReward: 20,
    icon: 'FileText',
    unlocked: false,
  },
  {
    id: 'first_interview',
    title: 'Primera Entrevista',
    description: 'Completaste tu primera simulación de entrevista',
    coinsReward: 30,
    icon: 'Video',
    unlocked: false,
  },
  {
    id: 'microactions_10',
    title: '10 Microacciones',
    description: 'Completaste 10 microacciones',
    coinsReward: 15,
    icon: 'Target',
    unlocked: false,
    progress: 0,
    target: 10,
  },
  {
    id: 'microactions_50',
    title: '50 Microacciones',
    description: 'Completaste 50 microacciones',
    coinsReward: 50,
    icon: 'Award',
    unlocked: false,
    progress: 0,
    target: 50,
  },
  {
    id: 'microactions_100',
    title: 'Centenario',
    description: 'Completaste 100 microacciones',
    coinsReward: 100,
    icon: 'Crown',
    unlocked: false,
    progress: 0,
    target: 100,
  },
  {
    id: 'cv_perfect',
    title: 'CV Perfecto',
    description: 'Obtuviste un CV con score mayor a 90',
    coinsReward: 40,
    icon: 'Trophy',
    unlocked: false,
  },
  {
    id: 'interview_master',
    title: 'Maestro de Entrevistas',
    description: 'Completaste 5 simulaciones con score mayor a 80',
    coinsReward: 60,
    icon: 'Star',
    unlocked: false,
    progress: 0,
    target: 5,
  },
  {
    id: 'job_applied',
    title: 'Primera Postulación',
    description: 'Aplicaste a tu primera oferta laboral',
    coinsReward: 25,
    icon: 'Send',
    unlocked: false,
  },
  {
    id: 'level_pro',
    title: 'Nivel Pro',
    description: 'Alcanzaste el nivel Pro',
    coinsReward: 100,
    icon: 'Zap',
    unlocked: false,
  },
  {
    id: 'friend_invited',
    title: 'Embajador',
    description: 'Invitaste a un amigo a Clovely',
    coinsReward: 50,
    icon: 'Users',
    unlocked: false,
  },
];

const MOCK_REWARDS: Reward[] = [
  {
    id: 'rew_1',
    title: 'Mentoría Premium 30 min',
    description: 'Sesión personalizada con un mentor certificado',
    cost: 200,
    icon: 'MessageCircle',
    category: 'mentorship',
    available: true,
  },
  {
    id: 'rew_2',
    title: 'Gift Card $10',
    description: 'Tarjeta de regalo para Amazon',
    cost: 300,
    icon: 'Gift',
    category: 'gift_card',
    available: true,
  },
  {
    id: 'rew_3',
    title: 'Plantilla CV Premium',
    description: 'Acceso a plantillas exclusivas de CV',
    cost: 150,
    icon: 'FileText',
    category: 'template',
    available: true,
  },
  {
    id: 'rew_4',
    title: 'Curso de Entrevistas',
    description: 'Curso completo sobre técnicas de entrevista',
    cost: 400,
    icon: 'BookOpen',
    category: 'course',
    available: true,
  },
  {
    id: 'rew_5',
    title: 'Gift Card $25',
    description: 'Tarjeta de regalo para Amazon',
    cost: 700,
    icon: 'Gift',
    category: 'gift_card',
    available: true,
  },
  {
    id: 'rew_6',
    title: 'Mentoría Premium 60 min',
    description: 'Sesión extendida con mentor certificado',
    cost: 350,
    icon: 'MessageCircle',
    category: 'mentorship',
    available: true,
  },
  {
    id: 'rew_7',
    title: 'Curso de LinkedIn',
    description: 'Optimiza tu perfil de LinkedIn con IA',
    cost: 250,
    icon: 'BookOpen',
    category: 'course',
    available: true,
  },
  {
    id: 'rew_8',
    title: 'Gift Card $50',
    description: 'Tarjeta de regalo para Amazon',
    cost: 1200,
    icon: 'Gift',
    category: 'gift_card',
    available: true,
  },
];

const MOCK_LEADERBOARD: LeaderboardEntry[] = [
  { userId: 'user_1', name: 'Ana Pérez', level: 'Líder', coins: 3450, achievementsCount: 10 },
  { userId: 'user_2', name: 'Carlos Ruiz', level: 'Master', coins: 2890, achievementsCount: 9 },
  { userId: 'user_3', name: 'María López', level: 'Master', coins: 2120, achievementsCount: 8 },
  { userId: 'user_4', name: 'Juan García', level: 'Pro', coins: 1650, achievementsCount: 7 },
  { userId: 'user_5', name: 'Laura Martín', level: 'Pro', coins: 1420, achievementsCount: 7 },
  { userId: 'user_6', name: 'Pedro Sánchez', level: 'Pro', coins: 980, achievementsCount: 6 },
  { userId: 'user_7', name: 'Sofia Torres', level: 'Junior', coins: 650, achievementsCount: 5 },
  { userId: 'user_8', name: 'Diego Vega', level: 'Junior', coins: 420, achievementsCount: 4 },
  { userId: 'user_9', name: 'Elena Rojas', level: 'Junior', coins: 280, achievementsCount: 3 },
  { userId: 'user_10', name: 'Luis Mendoza', level: 'Novato', coins: 150, achievementsCount: 2 },
];

function calculateLevel(totalCoins: number): UserLevel {
  if (totalCoins >= LEVEL_THRESHOLDS['Líder']) return 'Líder';
  if (totalCoins >= LEVEL_THRESHOLDS['Master']) return 'Master';
  if (totalCoins >= LEVEL_THRESHOLDS['Pro']) return 'Pro';
  if (totalCoins >= LEVEL_THRESHOLDS['Junior']) return 'Junior';
  return 'Novato';
}

export const useRewardsStore = create<RewardsState>()(
  persist(
    (set, get) => ({
      coins: 150,
      level: 'Novato',
      totalCoins: 150,
      history: [],
      achievements: INITIAL_ACHIEVEMENTS,
      redeemedRewards: [],

      addCoins: (amount: number, reason: string) => {
        set((state) => {
          const newCoins = state.coins + amount;
          const newTotalCoins = state.totalCoins + amount;
          const newHistory: CoinHistory = {
            id: `hist_${Date.now()}`,
            type: 'earn',
            amount,
            reason,
            timestamp: new Date().toISOString(),
          };

          return {
            coins: newCoins,
            totalCoins: newTotalCoins,
            history: [newHistory, ...state.history],
          };
        });

        // Check for level up
        get().checkLevelUp();
      },

      spendCoins: (amount: number, reason: string) => {
        const state = get();
        if (state.coins < amount) return false;

        set((state) => {
          const newCoins = state.coins - amount;
          const newHistory: CoinHistory = {
            id: `hist_${Date.now()}`,
            type: 'spend',
            amount,
            reason,
            timestamp: new Date().toISOString(),
          };

          return {
            coins: newCoins,
            history: [newHistory, ...state.history],
          };
        });

        return true;
      },

      redeemReward: (rewardId: string, cost: number) => {
        const success = get().spendCoins(cost, `Canjeado: ${rewardId}`);
        if (success) {
          set((state) => ({
            redeemedRewards: [...state.redeemedRewards, rewardId],
          }));
        }
        return success;
      },

      unlockAchievement: (achievementId: AchievementId) => {
        set((state) => {
          const achievement = state.achievements.find((a) => a.id === achievementId);
          if (!achievement || achievement.unlocked) return state;

          const updatedAchievements = state.achievements.map((a) =>
            a.id === achievementId
              ? { ...a, unlocked: true, unlockedAt: new Date().toISOString() }
              : a
          );

          // Add coins reward
          const newCoins = state.coins + achievement.coinsReward;
          const newTotalCoins = state.totalCoins + achievement.coinsReward;
          const newHistory: CoinHistory = {
            id: `hist_${Date.now()}`,
            type: 'earn',
            amount: achievement.coinsReward,
            reason: `Logro desbloqueado: ${achievement.title}`,
            timestamp: new Date().toISOString(),
          };

          return {
            achievements: updatedAchievements,
            coins: newCoins,
            totalCoins: newTotalCoins,
            history: [newHistory, ...state.history],
          };
        });

        // Check for level up after unlocking achievement
        get().checkLevelUp();
      },

      updateAchievementProgress: (achievementId: AchievementId, progress: number) => {
        set((state) => {
          const updatedAchievements = state.achievements.map((a) => {
            if (a.id === achievementId && !a.unlocked && a.target) {
              const newProgress = Math.min(progress, a.target);
              return { ...a, progress: newProgress };
            }
            return a;
          });

          return { achievements: updatedAchievements };
        });

        // Auto-unlock if target reached
        const achievement = get().achievements.find((a) => a.id === achievementId);
        if (achievement && !achievement.unlocked && achievement.target && progress >= achievement.target) {
          get().unlockAchievement(achievementId);
        }
      },

      checkLevelUp: () => {
        const state = get();
        const newLevel = calculateLevel(state.totalCoins);
        
        if (newLevel !== state.level) {
          set({ level: newLevel });
          
          // Unlock level achievement if Pro
          if (newLevel === 'Pro') {
            get().unlockAchievement('level_pro');
          }
          
          return newLevel;
        }
        
        return null;
      },

      getRewards: () => MOCK_REWARDS,

      getLeaderboard: () => {
        const state = get();
        const currentUser: LeaderboardEntry = {
          userId: 'current_user',
          name: 'Tú',
          level: state.level,
          coins: state.totalCoins,
          achievementsCount: state.achievements.filter((a) => a.unlocked).length,
        };

        return [currentUser, ...MOCK_LEADERBOARD].sort((a, b) => b.coins - a.coins);
      },
    }),
    {
      name: 'clovely-rewards',
    }
  )
);
