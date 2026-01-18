import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { University, UniversityAdmin, UniversityStudent } from '@/types/universidad';

interface UniversidadState {
  university: University | null;
  admins: UniversityAdmin[];
  students: UniversityStudent[];
  currentAdmin: UniversityAdmin | null;
  isLoading: boolean;
  setUniversity: (university: University | null) => void;
  setAdmins: (admins: UniversityAdmin[]) => void;
  setStudents: (students: UniversityStudent[]) => void;
  setCurrentAdmin: (admin: UniversityAdmin | null) => void;
  setIsLoading: (loading: boolean) => void;
  reset: () => void;
}

export const useUniversidadStore = create<UniversidadState>()(
  persist(
    (set) => ({
      university: null,
      admins: [],
      students: [],
      currentAdmin: null,
      isLoading: false,
      setUniversity: (university) => set({ university }),
      setAdmins: (admins) => set({ admins }),
      setStudents: (students) => set({ students }),
      setCurrentAdmin: (admin) => set({ currentAdmin: admin }),
      setIsLoading: (isLoading) => set({ isLoading }),
      reset: () => set({ 
        university: null, 
        admins: [], 
        students: [], 
        currentAdmin: null, 
        isLoading: false 
      }),
    }),
    {
      name: 'clovely-universidad',
    }
  )
);
