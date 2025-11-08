import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  InterviewSession,
  InterviewQuestion,
  InterviewResponse,
  InterviewRecommendation,
  InterviewLevel,
  InterviewTone,
  InterviewType,
  ResponseScore,
  QuestionType,
  InterviewMetrics,
} from '@/types';

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
    interviewType: InterviewType;
    tone: InterviewTone;
    jobDescription?: string;
    cvVersionId?: string;
  }) => void;
  endSession: () => void;
  saveSession: () => void;
  deleteSession: (id: string) => void;

  // Questions and responses
  getNextQuestion: () => InterviewQuestion | null;
  submitResponse: (answerText: string) => Promise<void>;
  analyzeResponse: (questionText: string, answerText: string) => Promise<{
    scores: ResponseScore;
    feedbackText: string;
  }>;

  // Evaluation
  calculateFinalScore: () => void;
  generateRecommendations: () => InterviewRecommendation[];

  // Utilities
  seedQuestions: () => void;
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
          interviewType: config.interviewType,
          jobDescription: config.jobDescription,
          cvVersionId: config.cvVersionId,
          tone: config.tone,
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

        // Mock AI analysis with delay
        const analysis = await get().analyzeResponse(question.text, answerText);

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
      },

      analyzeResponse: async (questionText, answerText) => {
        // Mock AI analysis with realistic delay
        await new Promise((resolve) => setTimeout(resolve, 1500));

        const wordCount = answerText.split(' ').length;
        const hasNumbers = /\d/.test(answerText);
        const hasSTAR = /situaci[oó]n|tarea|acci[oó]n|resultado/i.test(answerText);

        // Calculate scores based on heuristics
        const clarity = Math.min(20, Math.floor((wordCount / 50) * 15) + (answerText.length > 100 ? 5 : 0));
        const structure = hasSTAR ? Math.floor(Math.random() * 10) + 20 : Math.floor(Math.random() * 15) + 10;
        const evidence = hasNumbers ? Math.floor(Math.random() * 10) + 15 : Math.floor(Math.random() * 10) + 5;
        const language = Math.min(15, Math.floor((wordCount / 100) * 12) + 3);
        const culture = Math.floor(Math.random() * 5) + 5;

        const scores: ResponseScore = {
          clarity,
          structure,
          evidence,
          language,
          culture,
        };

        const total = clarity + structure + evidence + language + culture;

        let feedbackText = '';
        if (total >= 75) {
          feedbackText = '¡Excelente respuesta! Muy clara y estructurada. ';
        } else if (total >= 50) {
          feedbackText = 'Buena respuesta. ';
        } else {
          feedbackText = 'Tu respuesta tiene potencial. ';
        }

        if (!hasSTAR && questionText.includes('situación')) {
          feedbackText += 'Intenta usar el método STAR (Situación, Tarea, Acción, Resultado). ';
        }

        if (!hasNumbers) {
          feedbackText += 'Añade métricas cuantificables para mayor impacto. ';
        }

        if (wordCount < 30) {
          feedbackText += 'Desarrolla más tu respuesta con ejemplos concretos. ';
        }

        return { scores, feedbackText };
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

      seedQuestions: () => {
        set({ questionBank: MOCK_QUESTIONS });
      },
    }),
    {
      name: 'clovely-interviews',
    }
  )
);
