import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '@/types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: async (email: string, password: string) => {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        const mockUser: User = {
          id: '1',
          name: 'Ana García',
          email,
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ana',
          plan: 'free',
          createdAt: new Date(),
          lastLogin: new Date(),
          onboardingCompleted: true,
        };
        set({ user: mockUser, isAuthenticated: true });
      },
      register: async (name: string, email: string, password: string) => {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        const mockUser: User = {
          id: '1',
          name,
          email,
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`,
          plan: 'free',
          createdAt: new Date(),
          lastLogin: new Date(),
          onboardingCompleted: false,
        };
        set({ user: mockUser, isAuthenticated: true });
      },
      logout: () => {
        set({ user: null, isAuthenticated: false });
      },
      updateUser: (updates) => {
        set((state) => ({
          user: state.user ? { ...state.user, ...updates } : null,
        }));
      },
    }),
    {
      name: 'clovely-auth',
    }
  )
);
