import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { lovable } from '@/integrations/lovable/index';
import type { Session } from '@supabase/supabase-js';

interface AuthState {
  user: User | null;
  session: Session | null;
  isAuthenticated: boolean;
  isGuestMode: boolean;
  guestData: any | null;
  setUser: (user: User | null) => void;
  setSession: (session: Session | null) => void;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  startGuestMode: () => void;
  logout: () => Promise<void>;
  updateUser: (updates: Partial<User>) => void;
  startPremiumTrial: () => Promise<void>;
  upgradeToPremium: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      session: null,
      isAuthenticated: false,
      isGuestMode: false,
      guestData: null,
      
      setUser: (user) => set({ 
        user, 
        isAuthenticated: !!user,
        // Si es un usuario real (no guest), resetear modo invitado
        isGuestMode: user && !user.id.startsWith('guest_') ? false : get().isGuestMode,
        guestData: user && !user.id.startsWith('guest_') ? null : get().guestData,
      }),
      
      setSession: (session) => set({ session }),
      
      login: async (email: string, password: string) => {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        
        if (error) throw error;
        if (!data.session) throw new Error('No session returned');
      },
      
      register: async (name: string, email: string, password: string) => {
        const redirectUrl = `${window.location.origin}/onboarding`;
        
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: redirectUrl,
            data: {
              nombre: name,
              name: name,
            }
          }
        });
        
        if (error) throw error;
        if (!data.user) throw new Error('No user returned');
      },
      
      resetPassword: async (email: string) => {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/reset-password`,
        });
        
        if (error) throw error;
      },
      
      signInWithGoogle: async () => {
        const { error } = await lovable.auth.signInWithOAuth('google', {
          redirect_uri: window.location.origin,
        });
        
        if (error) throw error;
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
          lastActiveDate: new Date(),
          onboardingCompleted: true,
          streak: 1,
          applicationsSubmitted: 0,
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
      
      logout: async () => {
        await supabase.auth.signOut();
        set({ 
          user: null, 
          session: null,
          isAuthenticated: false, 
          isGuestMode: false, 
          guestData: null 
        });
      },
      
      updateUser: (updates) => {
        set((state) => ({
          user: state.user ? { ...state.user, ...updates } : null,
        }));
      },
      
      startPremiumTrial: async () => {
        // No trial — redirect to subscription flow
        console.log('No trial available. Use Stripe subscription.');
      },
      
      upgradeToPremium: async () => {
        // Will be handled by Stripe checkout
        set((state) => ({
          user: state.user ? {
            ...state.user,
            plan: 'premium',
          } : null,
        }));
      },
    }),
    {
      name: 'clovely-auth',
    }
  )
);
