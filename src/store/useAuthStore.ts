import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '@/types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isGuestMode: boolean;
  guestData: any | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  startGuestMode: () => void;
  convertGuestToUser: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isGuestMode: false,
      guestData: null,
      
      login: async (email: string, password: string) => {
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
        set({ user: mockUser, isAuthenticated: true, isGuestMode: false });
      },
      
      register: async (name: string, email: string, password: string) => {
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
        set({ user: mockUser, isAuthenticated: true, isGuestMode: false });
      },
      
      startGuestMode: () => {
        const guestUser: User = {
          id: 'guest_' + Date.now(),
          name: 'Usuario Invitado',
          email: '',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Guest',
          plan: 'free',
          createdAt: new Date(),
          lastLogin: new Date(),
          onboardingCompleted: true,
        };
        
        const guestData = {
          skills: [
            { name: 'Comunicación', level: 'En desarrollo' },
            { name: 'Pensamiento crítico', level: 'Fortaleza' },
            { name: 'Gestión del tiempo', level: 'Por explorar' },
          ],
          progress: { cv: false, interview: true, rewards: false },
          startedAt: new Date().toISOString(),
        };
        
        set({ 
          user: guestUser, 
          isAuthenticated: true, 
          isGuestMode: true,
          guestData 
        });
      },
      
      convertGuestToUser: async (name: string, email: string, password: string) => {
        const state = get();
        if (!state.isGuestMode) return;
        
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const newUser: User = {
          id: Date.now().toString(),
          name,
          email,
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`,
          plan: 'free',
          createdAt: new Date(),
          lastLogin: new Date(),
          onboardingCompleted: true,
        };
        
        set({ 
          user: newUser, 
          isAuthenticated: true, 
          isGuestMode: false,
          guestData: null 
        });
      },
      
      logout: () => {
        set({ user: null, isAuthenticated: false, isGuestMode: false, guestData: null });
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
