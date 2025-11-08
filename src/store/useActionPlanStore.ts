import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useRewardsStore } from './useRewardsStore';

export type ActionStatus = 'pending' | 'in_progress' | 'completed' | 'skipped';
export type ActionPriority = 'low' | 'medium' | 'high';
export type ActionCategory = 'cv' | 'learning' | 'networking' | 'application' | 'practice';

export interface WeeklyAction {
  id: string;
  userId: string;
  title: string;
  description: string;
  category: ActionCategory;
  priority: ActionPriority;
  status: ActionStatus;
  dueDate: string;
  completedAt?: string;
  xpReward: number;
  relatedGoalId?: string;
  relatedCVId?: string;
  relatedOpportunityId?: string;
}

export interface WeeklyPlan {
  weekStart: string;
  weekEnd: string;
  actions: WeeklyAction[];
  completionRate: number;
}

interface ActionPlanState {
  actions: WeeklyAction[];
  currentWeekPlan: WeeklyPlan | null;

  // CRUD
  createAction: (action: Omit<WeeklyAction, 'id'>) => WeeklyAction;
  updateAction: (id: string, updates: Partial<WeeklyAction>) => void;
  deleteAction: (id: string) => void;
  completeAction: (id: string) => void;
  skipAction: (id: string) => void;

  // Weekly plan
  generateWeeklyPlan: (userId: string) => void;
  getCurrentWeekActions: (userId: string) => WeeklyAction[];
  getCompletionRate: (userId: string) => number;

  // Analytics
  getActionsByCategory: (userId: string) => Record<ActionCategory, number>;
  getWeeklyStreak: (userId: string) => number;
}

const getWeekBounds = (date: Date = new Date()) => {
  const start = new Date(date);
  start.setDate(start.getDate() - start.getDay()); // Start on Sunday
  start.setHours(0, 0, 0, 0);

  const end = new Date(start);
  end.setDate(end.getDate() + 6); // End on Saturday
  end.setHours(23, 59, 59, 999);

  return { start, end };
};

export const useActionPlanStore = create<ActionPlanState>()(
  persist(
    (set, get) => ({
      actions: [],
      currentWeekPlan: null,

      createAction: (actionData) => {
        const newAction: WeeklyAction = {
          ...actionData,
          id: `action_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        };

        set((state) => ({
          actions: [...state.actions, newAction],
        }));

        return newAction;
      },

      updateAction: (id, updates) => {
        set((state) => ({
          actions: state.actions.map((action) =>
            action.id === id
              ? { ...action, ...updates }
              : action
          ),
        }));
      },

      deleteAction: (id) => {
        set((state) => ({
          actions: state.actions.filter((action) => action.id !== id),
        }));
      },

      completeAction: (id) => {
        const action = get().actions.find(a => a.id === id);
        
        set((state) => ({
          actions: state.actions.map((action) =>
            action.id === id
              ? {
                  ...action,
                  status: 'completed' as ActionStatus,
                  completedAt: new Date().toISOString(),
                }
              : action
          ),
        }));

        // Award coins for completing action
        if (action) {
          const coinsReward = 10; // Base coins per microaction
          useRewardsStore.getState().addCoins(coinsReward, `Microacción completada: ${action.title}`);
          
          // Update achievement progress
          const completedCount = get().actions.filter(a => a.status === 'completed').length;
          useRewardsStore.getState().updateAchievementProgress('microactions_10', completedCount);
          useRewardsStore.getState().updateAchievementProgress('microactions_50', completedCount);
          useRewardsStore.getState().updateAchievementProgress('microactions_100', completedCount);
        }
      },

      skipAction: (id) => {
        set((state) => ({
          actions: state.actions.map((action) =>
            action.id === id
              ? { ...action, status: 'skipped' as ActionStatus }
              : action
          ),
        }));
      },

      generateWeeklyPlan: (userId) => {
        const { start, end } = getWeekBounds();
        
        // Sample AI-generated actions based on user profile and progress
        const suggestedActions: Omit<WeeklyAction, 'id'>[] = [
          {
            userId,
            title: 'Actualizar sección de experiencia en CV',
            description: 'Añade métricas cuantificables a tus logros recientes',
            category: 'cv',
            priority: 'high',
            status: 'pending',
            dueDate: new Date(start.getTime() + 2 * 24 * 60 * 60 * 1000).toISOString(),
            xpReward: 50,
          },
          {
            userId,
            title: 'Completar curso de SQL básico',
            description: 'Finaliza las últimas 3 lecciones del curso de SQL',
            category: 'learning',
            priority: 'high',
            status: 'pending',
            dueDate: new Date(start.getTime() + 4 * 24 * 60 * 60 * 1000).toISOString(),
            xpReward: 75,
          },
          {
            userId,
            title: 'Conectar con 5 profesionales en LinkedIn',
            description: 'Expande tu red profesional en el sector tech',
            category: 'networking',
            priority: 'medium',
            status: 'pending',
            dueDate: new Date(start.getTime() + 5 * 24 * 60 * 60 * 1000).toISOString(),
            xpReward: 30,
          },
          {
            userId,
            title: 'Aplicar a 3 ofertas relevantes',
            description: 'Postula a posiciones que coincidan con tu perfil',
            category: 'application',
            priority: 'high',
            status: 'pending',
            dueDate: new Date(start.getTime() + 6 * 24 * 60 * 60 * 1000).toISOString(),
            xpReward: 100,
          },
          {
            userId,
            title: 'Practicar entrevista técnica',
            description: 'Simula una entrevista para Data Analyst',
            category: 'practice',
            priority: 'medium',
            status: 'pending',
            dueDate: end.toISOString(),
            xpReward: 80,
          },
        ];

        const newActions = suggestedActions.map((action) => get().createAction(action));

        const plan: WeeklyPlan = {
          weekStart: start.toISOString(),
          weekEnd: end.toISOString(),
          actions: newActions,
          completionRate: 0,
        };

        set({ currentWeekPlan: plan });
      },

      getCurrentWeekActions: (userId) => {
        const { start, end } = getWeekBounds();
        return get().actions.filter(
          (action) =>
            action.userId === userId &&
            new Date(action.dueDate) >= start &&
            new Date(action.dueDate) <= end
        );
      },

      getCompletionRate: (userId) => {
        const weekActions = get().getCurrentWeekActions(userId);
        if (weekActions.length === 0) return 0;

        const completed = weekActions.filter((a) => a.status === 'completed').length;
        return Math.round((completed / weekActions.length) * 100);
      },

      getActionsByCategory: (userId) => {
        const userActions = get().actions.filter((a) => a.userId === userId);
        const byCategory: Record<ActionCategory, number> = {
          cv: 0,
          learning: 0,
          networking: 0,
          application: 0,
          practice: 0,
        };

        userActions.forEach((action) => {
          if (action.status === 'completed') {
            byCategory[action.category]++;
          }
        });

        return byCategory;
      },

      getWeeklyStreak: (userId) => {
        // Mock: calculate consecutive weeks with at least 3 completed actions
        return 3;
      },
    }),
    {
      name: 'clovely-action-plan',
    }
  )
);
