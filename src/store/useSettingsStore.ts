import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ThemeMode = 'system' | 'light' | 'dark';
export type FontSize = 'small' | 'normal' | 'large';
export type ProfileVisibility = 'public' | 'network' | 'private';
export type CoachTone = 'empathetic' | 'direct' | 'technical';
export type CheckInFrequency = 'daily' | 'weekly' | 'biweekly';

export interface NotificationChannel {
  microactions: boolean;
  recommendations: boolean;
  coachMessages: boolean;
  marketing: boolean;
}

export interface NotificationPreferences {
  email: NotificationChannel;
  push: NotificationChannel;
  sms: NotificationChannel;
}

export interface PrivacySettings {
  profileVisibility: ProfileVisibility;
  shareAggregatedData: boolean;
  showInLeaderboard: boolean;
}

export interface IntegrationStatus {
  connected: boolean;
  lastSync?: string;
}

export interface Integrations {
  linkedin: IntegrationStatus;
  coursera: IntegrationStatus;
  calendar: IntegrationStatus;
}

export interface CoachPreferences {
  tone: CoachTone;
  checkInFrequency: CheckInFrequency;
}

export interface UserSession {
  id: string;
  device: string;
  location: string;
  lastActive: string;
  current: boolean;
}

export interface Settings {
  theme: ThemeMode;
  fontSize: FontSize;
  highContrast: boolean;
  notifications: NotificationPreferences;
  privacy: PrivacySettings;
  integrations: Integrations;
  coachPreferences: CoachPreferences;
}

interface SettingsState extends Settings {
  sessions: UserSession[];
  
  // Theme
  setTheme: (theme: ThemeMode) => void;
  setFontSize: (size: FontSize) => void;
  toggleHighContrast: () => void;
  
  // Notifications
  updateNotificationChannel: (channel: keyof NotificationPreferences, category: keyof NotificationChannel, value: boolean) => void;
  
  // Privacy
  updatePrivacy: (updates: Partial<PrivacySettings>) => void;
  
  // Integrations
  connectIntegration: (service: keyof Integrations) => void;
  disconnectIntegration: (service: keyof Integrations) => void;
  
  // Coach
  updateCoachPreferences: (updates: Partial<CoachPreferences>) => void;
  
  // Sessions
  setSessions: (sessions: UserSession[]) => void;
  closeOtherSessions: () => void;
  
  // Reset
  resetToDefaults: () => void;
}

const DEFAULT_SETTINGS: Settings = {
  theme: 'system',
  fontSize: 'normal',
  highContrast: false,
  notifications: {
    email: {
      microactions: true,
      recommendations: true,
      coachMessages: true,
      marketing: false,
    },
    push: {
      microactions: true,
      recommendations: false,
      coachMessages: true,
      marketing: false,
    },
    sms: {
      microactions: false,
      recommendations: false,
      coachMessages: false,
      marketing: false,
    },
  },
  privacy: {
    profileVisibility: 'network',
    shareAggregatedData: true,
    showInLeaderboard: true,
  },
  integrations: {
    linkedin: { connected: false },
    coursera: { connected: false },
    calendar: { connected: false },
  },
  coachPreferences: {
    tone: 'empathetic',
    checkInFrequency: 'daily',
  },
};

const MOCK_SESSIONS: UserSession[] = [
  {
    id: 'session_1',
    device: 'Chrome on Windows',
    location: 'Lima, Peru',
    lastActive: new Date().toISOString(),
    current: true,
  },
  {
    id: 'session_2',
    device: 'Safari on iPhone',
    location: 'Lima, Peru',
    lastActive: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    current: false,
  },
];

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      ...DEFAULT_SETTINGS,
      sessions: MOCK_SESSIONS,

      setTheme: (theme) => {
        set({ theme });
        
        // Apply theme to document
        if (theme === 'system') {
          const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
          document.documentElement.classList.toggle('dark', systemTheme === 'dark');
        } else {
          document.documentElement.classList.toggle('dark', theme === 'dark');
        }
      },

      setFontSize: (fontSize) => {
        set({ fontSize });
        
        // Apply font size to document
        const root = document.documentElement;
        root.classList.remove('text-sm', 'text-base', 'text-lg');
        if (fontSize === 'small') root.classList.add('text-sm');
        if (fontSize === 'large') root.classList.add('text-lg');
      },

      toggleHighContrast: () => {
        set((state) => {
          const newValue = !state.highContrast;
          document.documentElement.classList.toggle('high-contrast', newValue);
          return { highContrast: newValue };
        });
      },

      updateNotificationChannel: (channel, category, value) => {
        set((state) => ({
          notifications: {
            ...state.notifications,
            [channel]: {
              ...state.notifications[channel],
              [category]: value,
            },
          },
        }));
      },

      updatePrivacy: (updates) => {
        set((state) => ({
          privacy: {
            ...state.privacy,
            ...updates,
          },
        }));
      },

      connectIntegration: (service) => {
        set((state) => ({
          integrations: {
            ...state.integrations,
            [service]: {
              connected: true,
              lastSync: new Date().toISOString(),
            },
          },
        }));
      },

      disconnectIntegration: (service) => {
        set((state) => ({
          integrations: {
            ...state.integrations,
            [service]: {
              connected: false,
            },
          },
        }));
      },

      updateCoachPreferences: (updates) => {
        set((state) => ({
          coachPreferences: {
            ...state.coachPreferences,
            ...updates,
          },
        }));
      },

      setSessions: (sessions) => set({ sessions }),

      closeOtherSessions: () => {
        set((state) => ({
          sessions: state.sessions.filter((s) => s.current),
        }));
      },

      resetToDefaults: () => set(DEFAULT_SETTINGS),
    }),
    {
      name: 'clovely-settings',
    }
  )
);
