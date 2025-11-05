import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Profile } from '@/types';

interface ProfileState {
  profile: Profile | null;
  setProfile: (profile: Profile) => void;
  updateProfile: (updates: Partial<Profile>) => void;
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
    }),
    {
      name: 'clovely-profile',
    }
  )
);
