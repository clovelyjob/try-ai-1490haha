import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Goal, Microaction, GoalStatus } from '@/types';

interface GoalsState {
  goals: Goal[];
  setGoals: (goals: Goal[]) => void;
  addGoal: (goal: Goal) => void;
  updateGoal: (id: string, updates: Partial<Goal>) => void;
  deleteGoal: (id: string) => void;
  duplicateGoal: (id: string) => void;
  toggleMicroaction: (goalId: string, microactionId: string) => void;
  addMicroaction: (goalId: string, microaction: Microaction) => void;
  updateMicroaction: (goalId: string, microactionId: string, updates: Partial<Microaction>) => void;
  deleteMicroaction: (goalId: string, microactionId: string) => void;
  updateGoalStatus: (goalId: string, status: GoalStatus, reason?: string) => void;
  calculateProgress: (goalId: string) => number;
}

const seedGoals: Goal[] = [
  {
    id: '1',
    title: 'Preparar portfolio UX profesional',
    description: 'Crear un portfolio completo que muestre mis mejores proyectos de diseño UX/UI con casos de estudio detallados.',
    category: 'career',
    priority: 'alta',
    createdAt: new Date().toISOString(),
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    visibility: 'private',
    status: 'in_progress',
    progress: 60,
    progressTarget: 100,
    microactions: [
      {
        id: 'm1',
        title: 'Seleccionar 5 mejores proyectos',
        completed: true,
        createdAt: new Date().toISOString(),
        xp: 20,
      },
      {
        id: 'm2',
        title: 'Escribir caso de estudio del proyecto principal',
        completed: true,
        createdAt: new Date().toISOString(),
        xp: 30,
      },
      {
        id: 'm3',
        title: 'Diseñar layout del portfolio en Figma',
        completed: true,
        createdAt: new Date().toISOString(),
        xp: 25,
      },
      {
        id: 'm4',
        title: 'Desarrollar sitio web con React',
        completed: false,
        createdAt: new Date().toISOString(),
        xp: 40,
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 'm5',
        title: 'Optimizar para SEO y performance',
        completed: false,
        createdAt: new Date().toISOString(),
        xp: 15,
      },
    ],
    tags: ['portfolio', 'ux', 'diseño'],
    relatedSkills: ['Figma', 'React', 'UX Research'],
    repeat: 'none',
    ownerId: '1',
    history: [
      {
        action: 'created',
        by: 'user',
        at: new Date().toISOString(),
      },
    ],
  },
  {
    id: '2',
    title: 'Completar curso de SQL avanzado',
    description: 'Dominar consultas complejas, optimización y bases de datos relacionales.',
    category: 'learning',
    priority: 'media',
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
    visibility: 'private',
    status: 'paused',
    progress: 40,
    progressTarget: 100,
    microactions: [
      {
        id: 'm6',
        title: 'Completar módulo 1: Fundamentos',
        completed: true,
        createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
        xp: 15,
      },
      {
        id: 'm7',
        title: 'Completar módulo 2: JOINs y subconsultas',
        completed: true,
        createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        xp: 20,
      },
      {
        id: 'm8',
        title: 'Práctica: Proyecto de análisis de datos',
        completed: false,
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        xp: 30,
      },
      {
        id: 'm9',
        title: 'Completar módulo 3: Optimización',
        completed: false,
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        xp: 25,
      },
      {
        id: 'm10',
        title: 'Examen final',
        completed: false,
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        xp: 10,
      },
    ],
    tags: ['sql', 'databases', 'backend'],
    relatedSkills: ['SQL', 'PostgreSQL', 'Data Analysis'],
    repeat: 'none',
    ownerId: '1',
    history: [
      {
        action: 'created',
        by: 'user',
        at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        action: 'paused',
        by: 'user',
        at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ],
  },
  {
    id: '3',
    title: 'Primera entrevista en empresa tech',
    description: 'Conseguir al menos una entrevista técnica en una empresa de tecnología.',
    category: 'career',
    priority: 'alta',
    createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
    dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    visibility: 'private',
    status: 'completed',
    progress: 100,
    progressTarget: 100,
    microactions: [
      {
        id: 'm11',
        title: 'Actualizar CV y LinkedIn',
        completed: true,
        createdAt: new Date(Date.now() - 44 * 24 * 60 * 60 * 1000).toISOString(),
        xp: 20,
      },
      {
        id: 'm12',
        title: 'Aplicar a 20 posiciones',
        completed: true,
        createdAt: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000).toISOString(),
        xp: 50,
      },
      {
        id: 'm13',
        title: 'Practicar entrevistas con coach',
        completed: true,
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        xp: 30,
      },
      {
        id: 'm14',
        title: 'Conseguir entrevista',
        completed: true,
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        xp: 100,
      },
    ],
    tags: ['entrevistas', 'job-search', 'tech'],
    relatedSkills: ['Communication', 'Technical Interview'],
    repeat: 'none',
    ownerId: '1',
    history: [
      {
        action: 'created',
        by: 'user',
        at: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        action: 'completed',
        by: 'user',
        at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ],
  },
];

export const useGoalsStore = create<GoalsState>()(
  persist(
    (set, get) => ({
      goals: [],
      
      setGoals: (goals) => set({ goals }),
      
      addGoal: (goal) => set((state) => ({ goals: [...state.goals, goal] })),
      
      updateGoal: (id, updates) =>
        set((state) => ({
          goals: state.goals.map((goal) =>
            goal.id === id
              ? {
                  ...goal,
                  ...updates,
                  history: [
                    ...goal.history,
                    {
                      action: 'updated',
                      by: 'user',
                      at: new Date().toISOString(),
                      payload: updates,
                    },
                  ],
                }
              : goal
          ),
        })),
      
      deleteGoal: (id) =>
        set((state) => ({
          goals: state.goals.filter((goal) => goal.id !== id),
        })),
      
      duplicateGoal: (id) =>
        set((state) => {
          const goal = state.goals.find((g) => g.id === id);
          if (!goal) return state;
          
          const newGoal: Goal = {
            ...goal,
            id: `${Date.now()}`,
            title: `${goal.title} (Copia)`,
            status: 'pending',
            progress: 0,
            createdAt: new Date().toISOString(),
            microactions: goal.microactions.map((m) => ({
              ...m,
              id: `${Date.now()}-${m.id}`,
              completed: false,
            })),
            history: [
              {
                action: 'duplicated',
                by: 'user',
                at: new Date().toISOString(),
                payload: { originalId: id },
              },
            ],
          };
          
          return { goals: [...state.goals, newGoal] };
        }),
      
      toggleMicroaction: (goalId, microactionId) =>
        set((state) => {
          const goals = state.goals.map((goal) => {
            if (goal.id !== goalId) return goal;
            
            const microactions = goal.microactions.map((m) =>
              m.id === microactionId
                ? { ...m, completed: !m.completed, updatedAt: new Date().toISOString() }
                : m
            );
            
            const progress = get().calculateProgress(goalId);
            
            return {
              ...goal,
              microactions,
              progress,
              status: progress === 100 ? 'completed' : goal.status === 'pending' ? 'in_progress' : goal.status,
              history: [
                ...goal.history,
                {
                  action: 'microaction_toggled',
                  by: 'user',
                  at: new Date().toISOString(),
                  payload: { microactionId, completed: !microactions.find((m) => m.id === microactionId)?.completed },
                },
              ],
            };
          });
          
          return { goals };
        }),
      
      addMicroaction: (goalId, microaction) =>
        set((state) => ({
          goals: state.goals.map((goal) =>
            goal.id === goalId
              ? {
                  ...goal,
                  microactions: [...goal.microactions, microaction],
                  history: [
                    ...goal.history,
                    {
                      action: 'microaction_added',
                      by: 'user',
                      at: new Date().toISOString(),
                      payload: { microactionId: microaction.id },
                    },
                  ],
                }
              : goal
          ),
        })),
      
      updateMicroaction: (goalId, microactionId, updates) =>
        set((state) => ({
          goals: state.goals.map((goal) =>
            goal.id === goalId
              ? {
                  ...goal,
                  microactions: goal.microactions.map((m) =>
                    m.id === microactionId ? { ...m, ...updates, updatedAt: new Date().toISOString() } : m
                  ),
                }
              : goal
          ),
        })),
      
      deleteMicroaction: (goalId, microactionId) =>
        set((state) => ({
          goals: state.goals.map((goal) =>
            goal.id === goalId
              ? {
                  ...goal,
                  microactions: goal.microactions.filter((m) => m.id !== microactionId),
                  history: [
                    ...goal.history,
                    {
                      action: 'microaction_deleted',
                      by: 'user',
                      at: new Date().toISOString(),
                      payload: { microactionId },
                    },
                  ],
                }
              : goal
          ),
        })),
      
      updateGoalStatus: (goalId, status, reason) =>
        set((state) => ({
          goals: state.goals.map((goal) =>
            goal.id === goalId
              ? {
                  ...goal,
                  status,
                  history: [
                    ...goal.history,
                    {
                      action: `status_changed_to_${status}`,
                      by: 'user',
                      at: new Date().toISOString(),
                      payload: reason ? { reason } : undefined,
                    },
                  ],
                }
              : goal
          ),
        })),
      
      calculateProgress: (goalId) => {
        const goal = get().goals.find((g) => g.id === goalId);
        if (!goal || goal.microactions.length === 0) return 0;
        
        const totalXP = goal.microactions.reduce((sum, m) => sum + (m.xp || 1), 0);
        const completedXP = goal.microactions
          .filter((m) => m.completed)
          .reduce((sum, m) => sum + (m.xp || 1), 0);
        
        return Math.round((completedXP / totalXP) * 100);
      },
    }),
    {
      name: 'clovely-goals',
      onRehydrateStorage: () => (state) => {
        if (state && state.goals.length === 0) {
          state.setGoals(seedGoals);
        }
      },
    }
  )
);
