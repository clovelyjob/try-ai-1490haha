import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  Circle,
  CircleMember,
  Post,
  Comment,
  UserConnection,
  CircleEvent,
  Message,
  Conversation,
  NetworkSuggestion,
  CircleMemberRole,
  PostReactionType,
  ConnectionStatus,
} from '@/types';

interface CircleState {
  circles: Circle[];
  userCircles: string[]; // IDs of circles user joined
  members: CircleMember[];
  posts: Post[];
  comments: Comment[];
  connections: UserConnection[];
  events: CircleEvent[];
  messages: Message[];
  conversations: Conversation[];
  suggestions: NetworkSuggestion[];

  // Circles
  getCircleById: (id: string) => Circle | undefined;
  getRecommendedCircles: (userId: string) => Circle[];
  joinCircle: (userId: string, circleId: string) => void;
  leaveCircle: (userId: string, circleId: string) => void;
  createCircle: (circle: Omit<Circle, 'id' | 'memberCount' | 'createdAt'>) => Circle;

  // Posts
  createPost: (post: Omit<Post, 'id' | 'createdAt' | 'updatedAt' | 'reactions' | 'commentCount' | 'saved'>) => void;
  reactToPost: (postId: string, reaction: PostReactionType) => void;
  savePost: (postId: string, saved: boolean) => void;
  getPostsByCircle: (circleId: string) => Post[];

  // Comments
  addComment: (comment: Omit<Comment, 'id' | 'createdAt' | 'reactions'>) => void;
  reactToComment: (commentId: string, reaction: PostReactionType) => void;
  getCommentsByPost: (postId: string) => Comment[];

  // Connections
  sendConnectionRequest: (userId: string, connectedUserId: string, message?: string) => void;
  acceptConnection: (connectionId: string) => void;
  declineConnection: (connectionId: string) => void;
  getUserConnections: (userId: string) => UserConnection[];
  getNetworkSuggestions: (userId: string) => NetworkSuggestion[];

  // Events
  createEvent: (event: Omit<CircleEvent, 'id' | 'attendees'>) => void;
  joinEvent: (eventId: string, userId: string) => void;
  leaveEvent: (eventId: string, userId: string) => void;
  getEventsByCircle: (circleId: string) => CircleEvent[];

  // Messages
  sendMessage: (message: Omit<Message, 'id' | 'timestamp' | 'read'>) => void;
  markAsRead: (messageId: string) => void;
  getConversation: (userId: string, otherUserId: string) => Message[];

  // Seed
  seedData: (userId: string) => void;
}

const MOCK_CIRCLES: Circle[] = [
  {
    id: 'circle_1',
    name: 'UX/UI Designers',
    description: 'Comunidad de diseñadores enfocados en experiencia de usuario e interfaces',
    tags: ['diseño', 'ux', 'ui', 'figma'],
    category: 'Diseño',
    memberCount: 342,
    activityLevel: 'high',
    createdAt: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString(),
    createdBy: 'user_1',
  },
  {
    id: 'circle_2',
    name: 'Data Science LATAM',
    description: 'Aprende y comparte sobre ciencia de datos, machine learning y analytics',
    tags: ['data', 'python', 'ml', 'analytics'],
    category: 'Tecnología',
    memberCount: 567,
    activityLevel: 'high',
    createdAt: new Date(Date.now() - 240 * 24 * 60 * 60 * 1000).toISOString(),
    createdBy: 'user_2',
  },
  {
    id: 'circle_3',
    name: 'Product Management',
    description: 'Para Product Managers que buscan crecer y compartir experiencias',
    tags: ['product', 'management', 'agile', 'scrum'],
    category: 'Producto',
    memberCount: 289,
    activityLevel: 'medium',
    createdAt: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000).toISOString(),
    createdBy: 'user_3',
  },
  {
    id: 'circle_4',
    name: 'Marketing Digital',
    description: 'Estrategias, tendencias y casos de éxito en marketing digital',
    tags: ['marketing', 'seo', 'social media', 'ads'],
    category: 'Marketing',
    memberCount: 412,
    activityLevel: 'medium',
    createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
    createdBy: 'user_4',
  },
];

export const useCircleStore = create<CircleState>()(
  persist(
    (set, get) => ({
      circles: [],
      userCircles: [],
      members: [],
      posts: [],
      comments: [],
      connections: [],
      events: [],
      messages: [],
      conversations: [],
      suggestions: [],

      getCircleById: (id) => {
        return get().circles.find((c) => c.id === id);
      },

      getRecommendedCircles: (userId) => {
        const { circles, userCircles } = get();
        return circles
          .filter((c) => !userCircles.includes(c.id))
          .slice(0, 6);
      },

      joinCircle: (userId, circleId) => {
        set((state) => {
          const circle = state.circles.find((c) => c.id === circleId);
          if (!circle) return state;

          const member: CircleMember = {
            userId,
            circleId,
            role: 'member',
            joinedAt: new Date().toISOString(),
            reputation: 0,
          };

          return {
            userCircles: [...state.userCircles, circleId],
            members: [...state.members, member],
            circles: state.circles.map((c) =>
              c.id === circleId
                ? { ...c, memberCount: c.memberCount + 1 }
                : c
            ),
          };
        });
      },

      leaveCircle: (userId, circleId) => {
        set((state) => ({
          userCircles: state.userCircles.filter((id) => id !== circleId),
          members: state.members.filter(
            (m) => !(m.userId === userId && m.circleId === circleId)
          ),
          circles: state.circles.map((c) =>
            c.id === circleId
              ? { ...c, memberCount: Math.max(0, c.memberCount - 1) }
              : c
          ),
        }));
      },

      createCircle: (circleData) => {
        const newCircle: Circle = {
          ...circleData,
          id: `circle_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          memberCount: 1,
          createdAt: new Date().toISOString(),
        };

        set((state) => ({
          circles: [...state.circles, newCircle],
        }));

        return newCircle;
      },

      createPost: (postData) => {
        const newPost: Post = {
          ...postData,
          id: `post_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          reactions: { like: 0, clap: 0, insight: 0 },
          commentCount: 0,
          saved: false,
        };

        set((state) => ({
          posts: [newPost, ...state.posts],
        }));
      },

      reactToPost: (postId, reaction) => {
        set((state) => ({
          posts: state.posts.map((p) =>
            p.id === postId
              ? {
                  ...p,
                  reactions: {
                    ...p.reactions,
                    [reaction]: p.reactions[reaction] + 1,
                  },
                }
              : p
          ),
        }));
      },

      savePost: (postId, saved) => {
        set((state) => ({
          posts: state.posts.map((p) =>
            p.id === postId ? { ...p, saved } : p
          ),
        }));
      },

      getPostsByCircle: (circleId) => {
        return get().posts.filter((p) => p.circleId === circleId);
      },

      addComment: (commentData) => {
        const newComment: Comment = {
          ...commentData,
          id: `comment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          createdAt: new Date().toISOString(),
          reactions: { like: 0, clap: 0, insight: 0 },
        };

        set((state) => ({
          comments: [...state.comments, newComment],
          posts: state.posts.map((p) =>
            p.id === commentData.postId
              ? { ...p, commentCount: p.commentCount + 1 }
              : p
          ),
        }));
      },

      reactToComment: (commentId, reaction) => {
        set((state) => ({
          comments: state.comments.map((c) =>
            c.id === commentId
              ? {
                  ...c,
                  reactions: {
                    ...c.reactions,
                    [reaction]: c.reactions[reaction] + 1,
                  },
                }
              : c
          ),
        }));
      },

      getCommentsByPost: (postId) => {
        return get().comments.filter((c) => c.postId === postId);
      },

      sendConnectionRequest: (userId, connectedUserId, message) => {
        const newConnection: UserConnection = {
          id: `conn_${Date.now()}`,
          userId,
          connectedUserId,
          status: 'pending',
          requestedAt: new Date().toISOString(),
          message,
        };

        set((state) => ({
          connections: [...state.connections, newConnection],
        }));
      },

      acceptConnection: (connectionId) => {
        set((state) => ({
          connections: state.connections.map((c) =>
            c.id === connectionId
              ? {
                  ...c,
                  status: 'connected' as ConnectionStatus,
                  connectedAt: new Date().toISOString(),
                }
              : c
          ),
        }));
      },

      declineConnection: (connectionId) => {
        set((state) => ({
          connections: state.connections.map((c) =>
            c.id === connectionId
              ? { ...c, status: 'declined' as ConnectionStatus }
              : c
          ),
        }));
      },

      getUserConnections: (userId) => {
        return get().connections.filter(
          (c) =>
            (c.userId === userId || c.connectedUserId === userId) &&
            c.status === 'connected'
        );
      },

      getNetworkSuggestions: (userId) => {
        return get().suggestions.filter((s) => s.userId !== userId).slice(0, 5);
      },

      createEvent: (eventData) => {
        const newEvent: CircleEvent = {
          ...eventData,
          id: `event_${Date.now()}`,
          attendees: [eventData.hostId],
        };

        set((state) => ({
          events: [...state.events, newEvent],
        }));
      },

      joinEvent: (eventId, userId) => {
        set((state) => ({
          events: state.events.map((e) =>
            e.id === eventId && (!e.maxAttendees || e.attendees.length < e.maxAttendees)
              ? { ...e, attendees: [...e.attendees, userId] }
              : e
          ),
        }));
      },

      leaveEvent: (eventId, userId) => {
        set((state) => ({
          events: state.events.map((e) =>
            e.id === eventId
              ? { ...e, attendees: e.attendees.filter((id) => id !== userId) }
              : e
          ),
        }));
      },

      getEventsByCircle: (circleId) => {
        return get().events.filter((e) => e.circleId === circleId);
      },

      sendMessage: (messageData) => {
        const newMessage: Message = {
          ...messageData,
          id: `msg_${Date.now()}`,
          timestamp: new Date().toISOString(),
          read: false,
        };

        set((state) => ({
          messages: [...state.messages, newMessage],
        }));
      },

      markAsRead: (messageId) => {
        set((state) => ({
          messages: state.messages.map((m) =>
            m.id === messageId ? { ...m, read: true } : m
          ),
        }));
      },

      getConversation: (userId, otherUserId) => {
        return get().messages.filter(
          (m) =>
            (m.senderId === userId && m.receiverId === otherUserId) ||
            (m.senderId === otherUserId && m.receiverId === userId)
        );
      },

      seedData: (userId) => {
        const seeded = localStorage.getItem('clovely_circles_seeded');
        if (seeded) return;

        const samplePosts: Post[] = [
          {
            id: 'post_1',
            circleId: 'circle_1',
            authorId: 'user_2',
            authorName: 'Ana Martínez',
            content: '¿Cuáles son las mejores herramientas para wireframing en 2024? Actualmente uso Figma pero quiero explorar alternativas.',
            createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
            updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
            reactions: { like: 12, clap: 5, insight: 3 },
            commentCount: 8,
            saved: false,
          },
          {
            id: 'post_2',
            circleId: 'circle_2',
            authorId: 'user_3',
            authorName: 'Carlos Ruiz',
            content: 'Compartiendo mi proyecto de ML para predicción de churn. ¡Feedback bienvenido! 🚀',
            createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
            updatedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
            reactions: { like: 24, clap: 15, insight: 7 },
            commentCount: 12,
            saved: false,
          },
        ];

        const sampleEvents: CircleEvent[] = [
          {
            id: 'event_1',
            circleId: 'circle_1',
            title: 'Workshop: Diseño de sistemas',
            description: 'Aprende a crear design systems escalables y mantenibles',
            type: 'workshop',
            date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
            duration: 120,
            hostId: 'user_mentor',
            hostName: 'Laura Gómez',
            attendees: ['user_mentor', userId],
            maxAttendees: 30,
          },
        ];

        const sampleSuggestions: NetworkSuggestion[] = [
          {
            userId: 'user_5',
            name: 'Patricia Sánchez',
            headline: 'Product Designer en Rappi',
            commonInterests: ['diseño', 'ux', 'producto'],
            mutualConnections: 3,
            score: 92,
          },
          {
            userId: 'user_6',
            name: 'Miguel Torres',
            headline: 'Data Scientist en Mercado Libre',
            commonInterests: ['data', 'ml', 'python'],
            mutualConnections: 2,
            score: 85,
          },
        ];

        set({
          circles: MOCK_CIRCLES,
          userCircles: ['circle_1'],
          posts: samplePosts,
          events: sampleEvents,
          suggestions: sampleSuggestions,
        });

        localStorage.setItem('clovely_circles_seeded', 'true');
      },
    }),
    {
      name: 'clovely-circles',
    }
  )
);
