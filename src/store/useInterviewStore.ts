import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  InterviewSession,
  InterviewQuestion,
  InterviewResponse,
  InterviewRecommendation,
  InterviewLevel,
  ResponseScore,
  InterviewMetrics,
} from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface InterviewState {
  sessions: InterviewSession[];
  currentSession: InterviewSession | null;
  questionBank: InterviewQuestion[];
  currentQuestionIndex: number;
  isAnalyzing: boolean;
  metrics: InterviewMetrics;

  // Session management
  startSession: (config: {
    userId: string;
    role: string;
    level: InterviewLevel;
    jobDescription?: string;
    cvVersionId?: string;
  }) => void;
  endSession: () => void;
  saveSession: () => void;
  deleteSession: (id: string) => void;

  // Questions and responses
  getNextQuestion: () => InterviewQuestion | null;
  submitResponse: (answerText: string) => Promise<void>;
  analyzeResponse: (questionText: string, answerText: string, role?: string) => Promise<{
    scores: ResponseScore;
    feedbackText: string;
    suggestions?: string[];
  }>;

  // Evaluation
  calculateFinalScore: () => void;
  generateRecommendations: () => InterviewRecommendation[];

  // Utilities
  seedQuestions: (role?: string, level?: string, jobDescription?: string) => Promise<void>;
}

// Mock question bank
const MOCK_QUESTIONS: InterviewQuestion[] = [
  {
    id: 'q1',
    text: '¿Podrías presentarte brevemente y contarme sobre tu experiencia?',
    type: 'apertura',
    difficulty: 'facil',
    roles: ['all'],
    tags: ['introduccion', 'experiencia'],
    sampleAnswer: 'Soy [nombre], [profesión] con X años de experiencia en [área]...',
  },
  {
    id: 'q2',
    text: 'Cuéntame sobre un proyecto del que te sientas especialmente orgulloso/a.',
    type: 'comportamiento',
    difficulty: 'medio',
    roles: ['all'],
    tags: ['logros', 'proyectos'],
  },
  {
    id: 'q3',
    text: '¿Cómo manejas situaciones de alta presión o deadlines ajustados?',
    type: 'comportamiento',
    difficulty: 'medio',
    roles: ['all'],
    tags: ['resiliencia', 'gestion'],
  },
  {
    id: 'q4',
    text: 'Describe una situación en la que tuviste que trabajar con un equipo difícil. ¿Cómo lo resolviste?',
    type: 'comportamiento',
    difficulty: 'medio',
    roles: ['all'],
    tags: ['trabajo en equipo', 'conflictos'],
  },
  {
    id: 'q5',
    text: '¿Por qué te interesa esta posición y nuestra empresa?',
    type: 'cultura',
    difficulty: 'medio',
    roles: ['all'],
    tags: ['motivacion', 'cultura'],
  },
  {
    id: 'q6',
    text: '¿Cuáles son tus principales fortalezas y áreas de mejora?',
    type: 'apertura',
    difficulty: 'facil',
    roles: ['all'],
    tags: ['autoconocimiento'],
  },
  {
    id: 'q7',
    text: '¿Tienes alguna pregunta para mí sobre el rol o la empresa?',
    type: 'cierre',
    difficulty: 'facil',
    roles: ['all'],
    tags: ['cierre', 'preguntas'],
  },
];

export const useInterviewStore = create<InterviewState>()(
  persist(
    (set, get) => ({
      sessions: [],
      currentSession: null,
      questionBank: [],
      currentQuestionIndex: 0,
      isAnalyzing: false,
      metrics: {
        interviewCount: 0,
        bestScore: 0,
        averageScore: 0,
        streaks: 0,
        xpAwarded: 0,
      },

      startSession: (config) => {
        const newSession: InterviewSession = {
          id: `interview_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          userId: config.userId,
          role: config.role,
          level: config.level,
          interviewType: 'screening',
          jobDescription: config.jobDescription,
          cvVersionId: config.cvVersionId,
          tone: 'empatico',
          startedAt: new Date().toISOString(),
          responses: [],
          finalScore: 0,
          breakdown: {
            clarity: 0,
            structure: 0,
            evidence: 0,
            language: 0,
            culture: 0,
          },
          recommendations: [],
          saved: false,
          privacy: {
            saveTranscription: true,
            anonymize: false,
          },
        };

        set({
          currentSession: newSession,
          currentQuestionIndex: 0,
        });
      },

      endSession: () => {
        const { currentSession } = get();
        if (!currentSession) return;

        get().calculateFinalScore();
        
        const updatedSession = {
          ...currentSession,
          endedAt: new Date().toISOString(),
        };

        set({
          currentSession: updatedSession,
        });
      },

      saveSession: () => {
        const { currentSession, sessions } = get();
        if (!currentSession) return;

        const updatedSession = { ...currentSession, saved: true };
        
        set({
          sessions: [...sessions, updatedSession],
          currentSession: null,
          currentQuestionIndex: 0,
          metrics: {
            ...get().metrics,
            interviewCount: get().metrics.interviewCount + 1,
            bestScore: Math.max(get().metrics.bestScore, updatedSession.finalScore),
            averageScore:
              (get().metrics.averageScore * get().metrics.interviewCount + updatedSession.finalScore) /
              (get().metrics.interviewCount + 1),
          },
        });
      },

      deleteSession: (id) => {
        set((state) => ({
          sessions: state.sessions.filter((s) => s.id !== id),
        }));
        
        // Eliminar de Supabase
        supabase.from('interview_sessions').delete().eq('id', id).then(({ error }) => {
          if (error) {
            console.error('Error deleting interview session from Supabase:', error);
            toast.error('Error al eliminar la sesión de entrevista');
          }
        });
      },

      getNextQuestion: () => {
        const { questionBank, currentQuestionIndex } = get();
        if (currentQuestionIndex >= questionBank.length) return null;
        return questionBank[currentQuestionIndex];
      },

      submitResponse: async (answerText) => {
        const { currentSession, currentQuestionIndex, questionBank } = get();
        if (!currentSession || currentQuestionIndex >= questionBank.length) return;

        const question = questionBank[currentQuestionIndex];
        
        set({ isAnalyzing: true });

        try {
          // Usar IA real para analizar la respuesta
          const analysis = await get().analyzeResponse(
            question.text, 
            answerText, 
            currentSession.role
          );

          const response: InterviewResponse = {
            id: `resp_${Date.now()}`,
            questionId: question.id,
            questionText: question.text,
            answerText,
            timestamp: new Date().toISOString(),
            scores: analysis.scores,
            feedbackText: analysis.feedbackText,
          };

          set((state) => ({
            currentSession: state.currentSession
              ? {
                  ...state.currentSession,
                  responses: [...state.currentSession.responses, response],
                }
              : null,
            currentQuestionIndex: state.currentQuestionIndex + 1,
            isAnalyzing: false,
          }));
        } catch (error) {
          console.error('Error analyzing response:', error);
          toast.error('Error al analizar la respuesta. Intenta de nuevo.');
          set({ isAnalyzing: false });
        }
      },

      analyzeResponse: async (questionText, answerText, role = '') => {
        try {
          // Llamar a la edge function de análisis de respuestas
          const { data, error } = await supabase.functions.invoke('interview-analyze-response', {
            body: { 
              question: questionText, 
              answer: answerText, 
              role,
              context: `Evaluando respuesta para rol: ${role}`
            },
          });

          if (error) {
            console.error('Error calling analyze function:', error);
            throw error;
          }

          // Parsear la respuesta de la IA
          const analysis = data.analysis;
          
          return {
            scores: {
              clarity: analysis.score.clarity || 0,
              structure: analysis.score.structure || 0,
              evidence: analysis.score.evidence || 0,
              language: analysis.score.language || 0,
              culture: analysis.score.culture || 0,
            },
            feedbackText: analysis.feedback,
            suggestions: analysis.improvements || [],
          };
        } catch (error) {
          console.error('Error analyzing response:', error);
          // Fallback a análisis básico si la IA falla
          const wordCount = answerText.split(' ').length;
          const clarity = Math.min(20, Math.floor((wordCount / 50) * 15));
          const structure = Math.floor(Math.random() * 15) + 10;
          const evidence = Math.floor(Math.random() * 10) + 5;
          const language = Math.min(15, Math.floor((wordCount / 100) * 12));
          const culture = Math.floor(Math.random() * 5) + 5;

          return {
            scores: { clarity, structure, evidence, language, culture },
            feedbackText: 'Hubo un error al analizar tu respuesta. Por favor intenta de nuevo.',
          };
        }
      },

      calculateFinalScore: () => {
        const { currentSession } = get();
        if (!currentSession || currentSession.responses.length === 0) return;

        const totalResponses = currentSession.responses.length;
        const sumScores = currentSession.responses.reduce(
          (acc, resp) => ({
            clarity: acc.clarity + resp.scores.clarity,
            structure: acc.structure + resp.scores.structure,
            evidence: acc.evidence + resp.scores.evidence,
            language: acc.language + resp.scores.language,
            culture: acc.culture + resp.scores.culture,
          }),
          { clarity: 0, structure: 0, evidence: 0, language: 0, culture: 0 }
        );

        const breakdown: ResponseScore = {
          clarity: Math.round(sumScores.clarity / totalResponses),
          structure: Math.round(sumScores.structure / totalResponses),
          evidence: Math.round(sumScores.evidence / totalResponses),
          language: Math.round(sumScores.language / totalResponses),
          culture: Math.round(sumScores.culture / totalResponses),
        };

        const finalScore = breakdown.clarity + breakdown.structure + breakdown.evidence + breakdown.language + breakdown.culture;

        const recommendations = get().generateRecommendations();

        set((state) => ({
          currentSession: state.currentSession
            ? {
                ...state.currentSession,
                finalScore,
                breakdown,
                recommendations,
              }
            : null,
        }));
      },

      generateRecommendations: () => {
        const { currentSession } = get();
        if (!currentSession) return [];

        const recommendations: InterviewRecommendation[] = [];
        const avgScores = currentSession.responses.reduce(
          (acc, resp) => ({
            clarity: acc.clarity + resp.scores.clarity,
            structure: acc.structure + resp.scores.structure,
            evidence: acc.evidence + resp.scores.evidence,
          }),
          { clarity: 0, structure: 0, evidence: 0 }
        );

        const responseCount = currentSession.responses.length || 1;

        if (avgScores.structure / responseCount < 20) {
          recommendations.push({
            type: 'practice',
            text: 'Practica usar el método STAR en tus respuestas (Situación, Tarea, Acción, Resultado)',
          });
        }

        if (avgScores.evidence / responseCount < 15) {
          recommendations.push({
            type: 'cv',
            text: 'Añade métricas cuantificables a tu CV y úsalas en tus respuestas',
          });
        }

        if (avgScores.clarity / responseCount < 15) {
          recommendations.push({
            type: 'microaction',
            text: 'Practica respuestas concisas de 1-2 minutos grabándote y revisando',
          });
        }

        recommendations.push({
          type: 'course',
          text: 'Curso recomendado: "Comunicación efectiva en entrevistas técnicas"',
        });

        return recommendations;
      },

      seedQuestions: async (role = 'general', level = 'junior', jobDescription?: string) => {
        try {
          // Generar preguntas con IA
          const { data, error } = await supabase.functions.invoke('interview-generate-questions', {
            body: { 
              role, 
              level,
              jobDescription,
              count: 10
            },
          });

          if (error) {
            console.error('Error generating questions:', error);
            set({ questionBank: MOCK_QUESTIONS });
            return;
          }

          const aiQuestions: InterviewQuestion[] = data.questions.map((q: any, index: number) => ({
            id: `q_ai_${index + 1}`,
            text: q.text || q.question,
            type: q.type || 'comportamiento',
            difficulty: q.difficulty || 'medio',
            roles: [role],
            tags: q.tags || [],
            sampleAnswer: q.tip,
          }));

          set({ questionBank: aiQuestions.length > 0 ? aiQuestions : MOCK_QUESTIONS });
        } catch (error) {
          console.error('Error seeding questions:', error);
          set({ questionBank: MOCK_QUESTIONS });
        }
      },
    }),
    {
      name: 'clovely-interviews',
    }
  )
);
