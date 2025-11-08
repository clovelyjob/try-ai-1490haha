import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type MessageRole = 'user' | 'assistant' | 'system';
export type MessageType = 'chat' | 'cv_analysis' | 'interview_feedback' | 'action_suggestion' | 'course_recommendation';
export type NotificationFrequency = 'none' | 'daily' | 'weekly';

export interface CoachMessage {
  id: string;
  role: MessageRole;
  content: string;
  type: MessageType;
  timestamp: string;
  metadata?: {
    cvId?: string;
    score?: number;
    suggestions?: any[];
    actionIds?: string[];
  };
}

export interface CoachContext {
  userId: string;
  lastInteractions: {
    id: string;
    type: MessageType;
    summary: string;
    createdAt: string;
  }[];
  preferences: {
    notifications: boolean;
    preferredTime: string;
    frequency: NotificationFrequency;
  };
}

export interface CVAnalysisResult {
  score: number;
  keywords: { word: string; present: boolean; importance: 'high' | 'medium' | 'low' }[];
  suggestions: {
    id: string;
    category: 'content' | 'format' | 'keywords' | 'structure';
    text: string;
    priority: 'high' | 'medium' | 'low';
    example?: string;
  }[];
  strengths: string[];
  weaknesses: string[];
  recommendedTemplate?: string;
}

export interface FitScore {
  overall: number;
  breakdown: {
    skills: number;
    experience: number;
    keywords: number;
    education: number;
    location: number;
  };
}

export interface CourseRecommendation {
  id: string;
  title: string;
  provider: string;
  duration: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  url: string;
  reason: string;
  skillsCovered: string[];
  priority: 'high' | 'medium' | 'low';
}

interface CoachState {
  contexts: Record<string, CoachContext>;
  messages: Record<string, CoachMessage[]>;
  isProcessing: boolean;
  currentAnalysis: CVAnalysisResult | null;
  currentFitScore: FitScore | null;
  courseRecommendations: CourseRecommendation[];

  // Context management
  initContext: (userId: string) => void;
  updatePreferences: (userId: string, preferences: Partial<CoachContext['preferences']>) => void;
  
  // Chat
  sendMessage: (userId: string, content: string, type?: MessageType) => Promise<void>;
  clearChat: (userId: string) => void;
  
  // CV Analysis
  analyzeCV: (userId: string, cvId: string, cvText: string, jobDescription?: string) => Promise<CVAnalysisResult>;
  calculateFitScore: (cvText: string, jobDescription: string) => Promise<FitScore>;
  
  // Course recommendations
  generateCourseRecommendations: (userId: string, gaps: string[]) => Promise<CourseRecommendation[]>;
  
  // Utilities
  addInteraction: (userId: string, type: MessageType, summary: string) => void;
}

// Mock AI functions
const mockAnalyzeCV = async (cvText: string, jobDescription?: string): Promise<CVAnalysisResult> => {
  await new Promise(resolve => setTimeout(resolve, 2000));

  const hasMetrics = /\d+%|\d+\s*(años|meses|proyectos|clientes)/i.test(cvText);
  const hasAction = /(desarrollé|implementé|lideré|optimicé|creé)/i.test(cvText);
  const wordCount = cvText.split(/\s+/).length;

  const baseScore = Math.min(100, Math.floor(
    (hasMetrics ? 25 : 10) +
    (hasAction ? 25 : 10) +
    (wordCount > 200 ? 25 : (wordCount / 200) * 25) +
    (jobDescription ? 15 : 0) +
    Math.random() * 20
  ));

  const keywords = [
    { word: 'Python', present: /python/i.test(cvText), importance: 'high' as const },
    { word: 'SQL', present: /sql/i.test(cvText), importance: 'high' as const },
    { word: 'Análisis de datos', present: /análisis|data/i.test(cvText), importance: 'high' as const },
    { word: 'Power BI', present: /power\s*bi|tableau/i.test(cvText), importance: 'medium' as const },
    { word: 'Excel', present: /excel/i.test(cvText), importance: 'medium' as const },
  ];

  const suggestions: CVAnalysisResult['suggestions'] = [];

  if (!hasMetrics) {
    suggestions.push({
      id: 'sug_1',
      category: 'content',
      text: 'Añade métricas cuantificables a tus logros',
      priority: 'high',
      example: 'Ej: "Aumenté las ventas en un 25%" en lugar de "Mejoré las ventas"',
    });
  }

  if (!hasAction) {
    suggestions.push({
      id: 'sug_2',
      category: 'content',
      text: 'Usa verbos de acción al inicio de cada bullet',
      priority: 'high',
      example: 'Implementé, Desarrollé, Lideré, Optimicé',
    });
  }

  if (wordCount < 150) {
    suggestions.push({
      id: 'sug_3',
      category: 'structure',
      text: 'Expande la descripción de tu experiencia con más detalles',
      priority: 'medium',
    });
  }

  const missingKeywords = keywords.filter(k => !k.present && k.importance === 'high');
  if (missingKeywords.length > 0 && jobDescription) {
    suggestions.push({
      id: 'sug_4',
      category: 'keywords',
      text: `Considera añadir: ${missingKeywords.map(k => k.word).join(', ')}`,
      priority: 'high',
    });
  }

  return {
    score: baseScore,
    keywords,
    suggestions,
    strengths: hasMetrics ? ['Uso de métricas cuantificables'] : [],
    weaknesses: suggestions.map(s => s.text),
    recommendedTemplate: baseScore < 60 ? 'Harvard' : 'Modern',
  };
};

const mockCalculateFitScore = async (cvText: string, jobDescription: string): Promise<FitScore> => {
  await new Promise(resolve => setTimeout(resolve, 1500));

  const jdLower = jobDescription.toLowerCase();
  const cvLower = cvText.toLowerCase();

  const extractKeywords = (text: string) => text.match(/\b\w{4,}\b/g) || [];
  const jdKeywords = new Set(extractKeywords(jdLower));
  const cvKeywords = new Set(extractKeywords(cvLower));

  const matchedKeywords = [...jdKeywords].filter(k => cvKeywords.has(k));
  const keywordsScore = Math.min(100, (matchedKeywords.length / jdKeywords.size) * 100);

  const skills = Math.floor(keywordsScore * 0.8 + Math.random() * 20);
  const experience = Math.floor(60 + Math.random() * 30);
  const education = Math.floor(70 + Math.random() * 25);
  const location = Math.floor(80 + Math.random() * 20);

  const overall = Math.floor((skills + experience + keywordsScore + education + location) / 5);

  return {
    overall,
    breakdown: {
      skills,
      experience,
      keywords: Math.floor(keywordsScore),
      education,
      location,
    },
  };
};

const mockGenerateCourses = async (gaps: string[]): Promise<CourseRecommendation[]> => {
  await new Promise(resolve => setTimeout(resolve, 1000));

  const courseDatabase: CourseRecommendation[] = [
    {
      id: 'course_1',
      title: 'SQL para Análisis de Datos',
      provider: 'Coursera',
      duration: '4 semanas',
      level: 'beginner',
      url: '#',
      reason: 'Desarrolla habilidades fundamentales en SQL',
      skillsCovered: ['SQL', 'Consultas', 'Bases de datos'],
      priority: 'high',
    },
    {
      id: 'course_2',
      title: 'Python para Data Science',
      provider: 'edX',
      duration: '6 semanas',
      level: 'intermediate',
      url: '#',
      reason: 'Aprende análisis de datos con Python',
      skillsCovered: ['Python', 'Pandas', 'NumPy', 'Visualización'],
      priority: 'high',
    },
    {
      id: 'course_3',
      title: 'Power BI Completo',
      provider: 'Udemy',
      duration: '12 horas',
      level: 'beginner',
      url: '#',
      reason: 'Domina visualización de datos empresariales',
      skillsCovered: ['Power BI', 'DAX', 'Dashboards'],
      priority: 'medium',
    },
    {
      id: 'course_4',
      title: 'Comunicación Efectiva en Entrevistas',
      provider: 'LinkedIn Learning',
      duration: '2 horas',
      level: 'beginner',
      url: '#',
      reason: 'Mejora tu desempeño en entrevistas',
      skillsCovered: ['Comunicación', 'STAR', 'Confianza'],
      priority: 'high',
    },
  ];

  return courseDatabase.filter((_, i) => i < 3);
};

export const useCoachStore = create<CoachState>()(
  persist(
    (set, get) => ({
      contexts: {},
      messages: {},
      isProcessing: false,
      currentAnalysis: null,
      currentFitScore: null,
      courseRecommendations: [],

      initContext: (userId) => {
        const existing = get().contexts[userId];
        if (existing) return;

        set((state) => ({
          contexts: {
            ...state.contexts,
            [userId]: {
              userId,
              lastInteractions: [],
              preferences: {
                notifications: true,
                preferredTime: '18:00',
                frequency: 'daily',
              },
            },
          },
          messages: {
            ...state.messages,
            [userId]: [
              {
                id: `msg_${Date.now()}`,
                role: 'assistant',
                content: '¡Hola! Soy tu Career Coach. Estoy aquí para ayudarte a optimizar tu CV, practicar entrevistas, encontrar cursos y planificar tu desarrollo profesional. ¿En qué quieres avanzar hoy?',
                type: 'chat',
                timestamp: new Date().toISOString(),
              },
            ],
          },
        }));
      },

      updatePreferences: (userId, preferences) => {
        set((state) => ({
          contexts: {
            ...state.contexts,
            [userId]: {
              ...state.contexts[userId],
              preferences: {
                ...state.contexts[userId].preferences,
                ...preferences,
              },
            },
          },
        }));
      },

      sendMessage: async (userId, content, type = 'chat') => {
        const userMessage: CoachMessage = {
          id: `msg_${Date.now()}_user`,
          role: 'user',
          content,
          type,
          timestamp: new Date().toISOString(),
        };

        set((state) => ({
          messages: {
            ...state.messages,
            [userId]: [...(state.messages[userId] || []), userMessage],
          },
          isProcessing: true,
        }));

        // Mock AI response
        await new Promise(resolve => setTimeout(resolve, 1500));

        const responses = {
          cv: 'Para optimizar tu CV, necesito que selecciones cuál versión quieres analizar. Usa el botón "Analizar CV" arriba y te daré un análisis completo con sugerencias específicas.',
          interview: 'Excelente decisión practicar entrevistas. Ve a la sección de Entrevistas para iniciar una simulación. Puedo ayudarte a prepararte para roles específicos y darte feedback detallado.',
          courses: 'Basado en tu perfil, te recomiendo enfocarte en SQL y Python. ¿Quieres que te sugiera cursos específicos? Presiona el botón "Ver Cursos" arriba.',
          job: 'Para ayudarte mejor con oportunidades, ve a la sección de Oportunidades. Ahí puedo analizar tu compatibilidad con cada oferta y sugerirte cómo optimizar tu CV para cada una.',
          default: 'Entiendo. ¿Podrías ser más específico? Puedo ayudarte con: 1) Optimizar tu CV, 2) Practicar entrevistas, 3) Recomendar cursos, 4) Planificar tu semana.',
        };

        let responseContent = responses.default;
        const lowerContent = content.toLowerCase();
        
        if (lowerContent.includes('cv') || lowerContent.includes('curriculum')) {
          responseContent = responses.cv;
        } else if (lowerContent.includes('entrevista') || lowerContent.includes('interview')) {
          responseContent = responses.interview;
        } else if (lowerContent.includes('curso') || lowerContent.includes('aprender') || lowerContent.includes('estudiar')) {
          responseContent = responses.courses;
        } else if (lowerContent.includes('trabajo') || lowerContent.includes('empleo') || lowerContent.includes('oferta')) {
          responseContent = responses.job;
        }

        const assistantMessage: CoachMessage = {
          id: `msg_${Date.now()}_assistant`,
          role: 'assistant',
          content: responseContent,
          type: 'chat',
          timestamp: new Date().toISOString(),
        };

        set((state) => ({
          messages: {
            ...state.messages,
            [userId]: [...state.messages[userId], assistantMessage],
          },
          isProcessing: false,
        }));

        get().addInteraction(userId, type, content.substring(0, 50));
      },

      clearChat: (userId) => {
        set((state) => ({
          messages: {
            ...state.messages,
            [userId]: [],
          },
        }));
        get().initContext(userId);
      },

      analyzeCV: async (userId, cvId, cvText, jobDescription) => {
        set({ isProcessing: true });
        
        try {
          const analysis = await mockAnalyzeCV(cvText, jobDescription);
          
          const message: CoachMessage = {
            id: `msg_${Date.now()}`,
            role: 'assistant',
            content: `He analizado tu CV y obtuviste un puntaje de ${analysis.score}/100. ${
              analysis.score >= 80 
                ? '¡Excelente! Tu CV está muy bien optimizado.' 
                : analysis.score >= 60 
                ? 'Buen trabajo, pero hay algunas áreas de mejora.' 
                : 'Hay varias oportunidades para mejorar tu CV.'
            }`,
            type: 'cv_analysis',
            timestamp: new Date().toISOString(),
            metadata: {
              cvId,
              score: analysis.score,
              suggestions: analysis.suggestions,
            },
          };

          set((state) => ({
            messages: {
              ...state.messages,
              [userId]: [...(state.messages[userId] || []), message],
            },
            currentAnalysis: analysis,
            isProcessing: false,
          }));

          get().addInteraction(userId, 'cv_analysis', `Análisis CV score: ${analysis.score}`);
          
          return analysis;
        } catch (error) {
          set({ isProcessing: false });
          throw error;
        }
      },

      calculateFitScore: async (cvText, jobDescription) => {
        const fitScore = await mockCalculateFitScore(cvText, jobDescription);
        set({ currentFitScore: fitScore });
        return fitScore;
      },

      generateCourseRecommendations: async (userId, gaps) => {
        const courses = await mockGenerateCourses(gaps);
        
        const message: CoachMessage = {
          id: `msg_${Date.now()}`,
          role: 'assistant',
          content: `Basado en tu perfil y objetivos, he encontrado ${courses.length} cursos recomendados que pueden ayudarte a cerrar brechas de habilidades.`,
          type: 'course_recommendation',
          timestamp: new Date().toISOString(),
        };

        set((state) => ({
          messages: {
            ...state.messages,
            [userId]: [...(state.messages[userId] || []), message],
          },
          courseRecommendations: courses,
        }));

        get().addInteraction(userId, 'course_recommendation', `${courses.length} cursos sugeridos`);
        
        return courses;
      },

      addInteraction: (userId, type, summary) => {
        set((state) => {
          const context = state.contexts[userId];
          if (!context) return state;

          const newInteraction = {
            id: `int_${Date.now()}`,
            type,
            summary,
            createdAt: new Date().toISOString(),
          };

          return {
            contexts: {
              ...state.contexts,
              [userId]: {
                ...context,
                lastInteractions: [
                  newInteraction,
                  ...context.lastInteractions.slice(0, 9),
                ],
              },
            },
          };
        });
      },
    }),
    {
      name: 'clovely-coach',
    }
  )
);
