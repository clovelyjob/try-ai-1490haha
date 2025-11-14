import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export function useAI() {
  const [isLoading, setIsLoading] = useState(false);

  const improveText = async (
    text: string,
    type: 'summary' | 'experience' | 'education' | 'general',
    context?: string
  ) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('cv-improve-text', {
        body: { text, type, context },
      });

      if (error) {
        if (error.message.includes('429')) {
          toast.error('Límite de solicitudes alcanzado. Intenta en unos minutos.');
        } else if (error.message.includes('402')) {
          toast.error('Créditos insuficientes.');
        } else {
          toast.error('Error al mejorar el texto');
        }
        throw error;
      }

      return data.improvedText;
    } catch (error) {
      console.error('Error improving text:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const analyzeCVintense = async (cvData: any, targetRole?: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('cv-generate-suggestions', {
        body: { cvData, targetRole },
      });

      if (error) {
        if (error.message.includes('429')) {
          toast.error('Límite de solicitudes alcanzado. Intenta en unos minutos.');
        } else if (error.message.includes('402')) {
          toast.error('Créditos insuficientes.');
        } else {
          toast.error('Error al analizar el CV');
        }
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error analyzing CV:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const analyzeInterviewResponse = async (
    question: string,
    answer: string,
    role?: string,
    context?: string
  ) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('interview-analyze-response', {
        body: { question, answer, role, context },
      });

      if (error) {
        if (error.message.includes('429')) {
          toast.error('Límite de solicitudes alcanzado. Intenta en unos minutos.');
        } else if (error.message.includes('402')) {
          toast.error('Créditos insuficientes.');
        } else {
          toast.error('Error al analizar la respuesta');
        }
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error analyzing interview response:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const generateInterviewQuestions = async (
    role: string,
    industry?: string,
    level?: string,
    count?: number
  ) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('interview-generate-questions', {
        body: { role, industry, level, count },
      });

      if (error) {
        if (error.message.includes('429')) {
          toast.error('Límite de solicitudes alcanzado. Intenta en unos minutos.');
        } else if (error.message.includes('402')) {
          toast.error('Créditos insuficientes.');
        } else {
          toast.error('Error al generar preguntas');
        }
        throw error;
      }

      return data.questions;
    } catch (error) {
      console.error('Error generating questions:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    improveText,
    analyzeCV: analyzeCVintense,
    analyzeInterviewResponse,
    generateInterviewQuestions,
  };
}
