import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Profile, ProfessionalRole, RoleHistory } from '@/types';

interface ProfileState {
  profile: Profile | null;
  setProfile: (profile: Profile) => void;
  updateProfile: (updates: Partial<Profile>) => void;
  updateRole: (newRole: ProfessionalRole, confidence: number) => void;
}

export const useProfileStore = create<ProfileState>()(
  persist(
    (set) => ({
      profile: null,
      setProfile: (profile) => set({ profile }),
      updateProfile: (updates) =>
        set((state) => ({
          profile: state.profile ? { ...state.profile, ...updates } : null,
        })),
      updateRole: (newRole: ProfessionalRole, confidence: number) =>
        set((state) => {
          if (!state.profile) return state;
          
          const historyEntry: RoleHistory = {
            rol: newRole,
            fecha: new Date().toISOString(),
            confidence
          };

          return {
            profile: {
              ...state.profile,
              rolActual: newRole,
              historialRol: [...(state.profile.historialRol || []), historyEntry]
            }
          };
        }),
    }),
    {
      name: 'clovely-profile',
    }
  )
);
