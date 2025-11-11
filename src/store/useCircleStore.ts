import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CircleMember {
  id: string;
  name: string;
  role: 'admin' | 'moderator' | 'member';
  avatar?: string;
  joinedAt: string;
}

export interface CircleMessage {
  id: string;
  userId: string;
  userName: string;
  content: string;
  timestamp: string;
  isBot?: boolean;
}

export interface Circle {
  id: string;
  name: string;
  description: string;
  logo?: string;
  category: string;
  memberCount: number;
  members: CircleMember[];
  messages: CircleMessage[];
  hasBot: boolean;
  botContext?: string;
  createdBy: string;
  createdAt: string;
}

interface CircleState {
  circles: Circle[];
  userCircles: string[];
  addCircle: (circle: Omit<Circle, 'id' | 'createdAt'>) => void;
  joinCircle: (circleId: string) => void;
  leaveCircle: (circleId: string) => void;
  sendMessage: (circleId: string, message: Omit<CircleMessage, 'id' | 'timestamp'>) => void;
  getCircle: (circleId: string) => Circle | undefined;
  getUserCircles: () => Circle[];
}

const MOCK_CIRCLES: Circle[] = [
  {
    id: 'circle_1',
    name: 'Diseñadores UX Latinoamérica',
    description: 'Comunidad de diseñadores UX/UI compartiendo experiencias y recursos',
    category: 'Diseño',
    memberCount: 45,
    members: [],
    messages: [],
    hasBot: true,
    botContext: 'Experto en diseño UX/UI que ayuda con feedback y recursos',
    createdBy: 'admin',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'circle_2',
    name: 'Developers Full Stack',
    description: 'Desarrolladores compartiendo código, buenas prácticas y oportunidades',
    category: 'Tecnología',
    memberCount: 78,
    members: [],
    messages: [],
    hasBot: true,
    botContext: 'Asistente técnico que ayuda con debugging y arquitectura',
    createdBy: 'admin',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'circle_3',
    name: 'Product Managers Network',
    description: 'Red de PMs discutiendo estrategias, métricas y casos de éxito',
    category: 'Producto',
    memberCount: 32,
    members: [],
    messages: [],
    hasBot: true,
    botContext: 'Especialista en product management y estrategia',
    createdBy: 'admin',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'circle_4',
    name: 'Marketing Digital & Growth',
    description: 'Profesionales de marketing compartiendo campañas y tendencias',
    category: 'Marketing',
    memberCount: 56,
    members: [],
    messages: [],
    hasBot: false,
    createdBy: 'admin',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'circle_5',
    name: 'Startups y Emprendedores',
    description: 'Founders y emprendedores construyendo el futuro juntos',
    category: 'Emprendimiento',
    memberCount: 89,
    members: [],
    messages: [],
    hasBot: true,
    botContext: 'Mentor de startups con experiencia en fundraising y scaling',
    createdBy: 'admin',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'circle_6',
    name: 'Data Science & ML',
    description: 'Científicos de datos y ML engineers compartiendo modelos y datasets',
    category: 'Data',
    memberCount: 41,
    members: [],
    messages: [],
    hasBot: true,
    botContext: 'Experto en ML/AI que ayuda con modelos y análisis',
    createdBy: 'admin',
    createdAt: new Date().toISOString(),
  },
];

export const useCircleStore = create<CircleState>()(
  persist(
    (set, get) => ({
      circles: MOCK_CIRCLES,
      userCircles: [],

      addCircle: (circle) => {
        const newCircle: Circle = {
          ...circle,
          id: `circle_${Date.now()}`,
          createdAt: new Date().toISOString(),
        };
        set((state) => ({
          circles: [newCircle, ...state.circles],
        }));
      },

      joinCircle: (circleId) => {
        set((state) => {
          if (state.userCircles.includes(circleId)) return state;
          
          return {
            userCircles: [...state.userCircles, circleId],
            circles: state.circles.map((circle) =>
              circle.id === circleId
                ? { ...circle, memberCount: circle.memberCount + 1 }
                : circle
            ),
          };
        });
      },

      leaveCircle: (circleId) => {
        set((state) => ({
          userCircles: state.userCircles.filter((id) => id !== circleId),
          circles: state.circles.map((circle) =>
            circle.id === circleId
              ? { ...circle, memberCount: Math.max(0, circle.memberCount - 1) }
              : circle
          ),
        }));
      },

      sendMessage: (circleId, message) => {
        const newMessage: CircleMessage = {
          ...message,
          id: `msg_${Date.now()}`,
          timestamp: new Date().toISOString(),
        };

        set((state) => ({
          circles: state.circles.map((circle) =>
            circle.id === circleId
              ? { ...circle, messages: [...circle.messages, newMessage] }
              : circle
          ),
        }));
      },

      getCircle: (circleId) => {
        return get().circles.find((c) => c.id === circleId);
      },

      getUserCircles: () => {
        const state = get();
        return state.circles.filter((c) => state.userCircles.includes(c.id));
      },
    }),
    {
      name: 'clovely-circles',
    }
  )
);
