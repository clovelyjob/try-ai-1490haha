import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UIState {
  sidebarCollapsed: boolean;
  sidebarPinned: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
  toggleSidebarPinned: () => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      sidebarCollapsed: false,
      sidebarPinned: false,
      setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
      toggleSidebarPinned: () => set((state) => ({ 
        sidebarPinned: !state.sidebarPinned,
        // Al fijar, expandir automáticamente
        sidebarCollapsed: state.sidebarPinned ? state.sidebarCollapsed : false
      })),
    }),
    {
      name: 'clovely-ui',
      partialize: (state) => ({ sidebarPinned: state.sidebarPinned }),
    }
  )
);
