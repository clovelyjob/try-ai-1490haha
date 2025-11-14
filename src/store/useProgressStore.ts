import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ProgressState {
  addXP: (amount: number) => void;
  addCoins: (amount: number) => void;
  completeTask: (taskId: string) => void;
}

export const useProgressStore = create<ProgressState>()(
  persist(
    (set, get) => ({
      addXP: (amount) => {
        // Stub for now
        console.log('XP added:', amount);
      },
      addCoins: (amount) => {
        // Stub for now
        console.log('Coins added:', amount);
      },
      completeTask: (taskId) => {
        // Stub for now
        console.log('Task completed:', taskId);
      },
    }),
    {
      name: 'clovely-progress-stub',
    }
  )
);
