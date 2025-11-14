import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type NotificationType = 'info' | 'success' | 'warning' | 'achievement' | 'reminder' | 'opportunity';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
  actionLabel?: string;
  metadata?: Record<string, any>;
}

export interface NotificationPreferences {
  enabled: boolean;
  opportunities: boolean;
  interviews: boolean;
  achievements: boolean;
  reminders: boolean;
  dailyDigest: boolean;
  sound: boolean;
}

interface NotificationsState {
  notifications: Notification[];
  preferences: NotificationPreferences;
  
  // Actions
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (id: string) => void;
  clearAll: () => void;
  updatePreferences: (preferences: Partial<NotificationPreferences>) => void;
  getUnreadCount: () => number;
}

export const useNotificationsStore = create<NotificationsState>()(
  persist(
    (set, get) => ({
      notifications: [],
      preferences: {
        enabled: true,
        opportunities: true,
        interviews: true,
        achievements: true,
        reminders: true,
        dailyDigest: false,
        sound: true,
      },

      addNotification: (notification) => {
        const { preferences } = get();
        
        // Check if notification type is enabled
        const typeEnabled = {
          opportunity: preferences.opportunities,
          reminder: preferences.reminders,
          achievement: preferences.achievements,
          info: true,
          success: true,
          warning: true,
        }[notification.type];

        if (!preferences.enabled || !typeEnabled) return;

        const newNotification: Notification = {
          ...notification,
          id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          timestamp: new Date(),
          read: false,
        };

        set((state) => ({
          notifications: [newNotification, ...state.notifications].slice(0, 50), // Keep last 50
        }));

        // Play sound if enabled
        if (preferences.sound) {
          const audio = new Audio('/notification.mp3');
          audio.volume = 0.3;
          audio.play().catch(() => {}); // Ignore errors
        }
      },

      markAsRead: (id) => {
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.id === id ? { ...n, read: true } : n
          ),
        }));
      },

      markAllAsRead: () => {
        set((state) => ({
          notifications: state.notifications.map((n) => ({ ...n, read: true })),
        }));
      },

      deleteNotification: (id) => {
        set((state) => ({
          notifications: state.notifications.filter((n) => n.id !== id),
        }));
      },

      clearAll: () => {
        set({ notifications: [] });
      },

      updatePreferences: (preferences) => {
        set((state) => ({
          preferences: { ...state.preferences, ...preferences },
        }));
      },

      getUnreadCount: () => {
        return get().notifications.filter((n) => !n.read).length;
      },
    }),
    {
      name: 'notifications-storage',
    }
  )
);
