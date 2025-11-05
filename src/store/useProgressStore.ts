import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Progress } from '@/types';

interface ProgressState {
  progress: Progress | null;
  setProgress: (progress: Progress) => void;
  addXP: (amount: number) => void;
  incrementStreak: () => void;
  completeTask: () => void;
  addCoins: (amount: number) => void;
  spendCoins: (amount: number) => void;
}

const LEVEL_XP_MAP: Record<number, number> = {
  1: 500,
  2: 1500,
  3: 3000,
  4: 6000,
  5: 10000,
  6: 25000,
  7: 50000,
};

export const useProgressStore = create<ProgressState>()(
  persist(
    (set) => ({
      progress: {
        userId: '1',
        level: 3,
        currentXP: 750,
        nextLevelXP: 1500,
        streak: 12,
        longestStreak: 28,
        tasksCompleted: 142,
        achievements: ['first_day', 'diagnostic_complete', 'cv_80'],
        coins: 450,
        totalXP: 3750,
        weeklyProgress: 73,
        applications: 23,
        interviews: 8,
      },
      setProgress: (progress) => set({ progress }),
      addXP: (amount) =>
        set((state) => {
          if (!state.progress) return state;
          const newXP = state.progress.currentXP + amount;
          const newTotalXP = state.progress.totalXP + amount;
          let newLevel = state.progress.level;
          let remainingXP = newXP;

          // Check if leveled up
          while (remainingXP >= LEVEL_XP_MAP[newLevel]) {
            remainingXP -= LEVEL_XP_MAP[newLevel];
            newLevel++;
          }

          return {
            progress: {
              ...state.progress,
              currentXP: remainingXP,
              totalXP: newTotalXP,
              level: newLevel,
              nextLevelXP: LEVEL_XP_MAP[newLevel],
            },
          };
        }),
      incrementStreak: () =>
        set((state) => {
          if (!state.progress) return state;
          const newStreak = state.progress.streak + 1;
          return {
            progress: {
              ...state.progress,
              streak: newStreak,
              longestStreak: Math.max(newStreak, state.progress.longestStreak),
            },
          };
        }),
      completeTask: () =>
        set((state) => {
          if (!state.progress) return state;
          return {
            progress: {
              ...state.progress,
              tasksCompleted: state.progress.tasksCompleted + 1,
            },
          };
        }),
      addCoins: (amount) =>
        set((state) => {
          if (!state.progress) return state;
          return {
            progress: {
              ...state.progress,
              coins: state.progress.coins + amount,
            },
          };
        }),
      spendCoins: (amount) =>
        set((state) => {
          if (!state.progress) return state;
          if (state.progress.coins < amount) return state;
          return {
            progress: {
              ...state.progress,
              coins: state.progress.coins - amount,
            },
          };
        }),
    }),
    {
      name: 'clovely-progress',
    }
  )
);
