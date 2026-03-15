import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface JobPosition {
  id: string;
  name: string;
  slug: string;
  related_job_positions?: {
    id: string;
    name: string;
    slug: string;
    weight: number;
  }[];
}

interface JobPositionsResponse {
  data: JobPosition[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

interface MatchScores {
  overall_match: number;
  skills_match: number;
  experience_match: number;
  education_match: number;
  certifications_match: number;
  job_title_relevance: number;
  industry_experience_match: number;
  project_experience_match: number;
  technical_stack_match: number;
  methodologies_match: number;
  soft_skills_match: number;
  language_proficiency_match: number;
  location_preference_match: number;
  remote_work_flexibility: number;
  certifications_training_relevance: number;
  years_experience_weighting: number;
  recent_role_relevance: number;
  management_experience_match: number;
  cultural_fit_potential: number;
  stability_score: number;
}

interface MatchResult {
  match_scores: MatchScores;
  explanations: Record<string, string>;
}

export function useAPYHub() {
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Submit a CV/Resume for job match scoring (async job).
   * Returns jobId to poll for results.
   */
  const submitJobMatch = useCallback(async (
    file: File,
    jobDescription: string,
    language: string = 'Spanish'
  ): Promise<{ jobId: string; statusUrl: string } | null> => {
    setIsLoading(true);
    try {
      // Convert file to base64
      const arrayBuffer = await file.arrayBuffer();
      const bytes = new Uint8Array(arrayBuffer);
      let binary = '';
      for (let i = 0; i < bytes.length; i++) {
        binary += String.fromCharCode(bytes[i]);
      }
      const base64 = btoa(binary);

      const { data, error } = await supabase.functions.invoke('cv-job-match', {
        body: {
          action: 'submit',
          resumeBase64: base64,
          resumeFileName: file.name,
          jobDescription,
          language,
        },
      });

      if (error) {
        toast.error('Error al enviar el CV para análisis');
        throw error;
      }

      toast.success('CV enviado para análisis. Procesando...');
      return data;
    } catch (error) {
      console.error('Error submitting job match:', error);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Poll for job match results. Returns null if still processing.
   */
  const getJobMatchStatus = useCallback(async (
    jobId: string
  ): Promise<{ status: string; result?: MatchResult } | null> => {
    try {
      const { data, error } = await supabase.functions.invoke('cv-job-match', {
        body: { action: 'status', jobId },
      });

      if (error) {
        throw error;
      }

      const attributes = data?.data?.attributes;
      if (attributes?.status === 'success') {
        return { status: 'success', result: attributes.result };
      }

      return { status: attributes?.status || 'pending' };
    } catch (error) {
      console.error('Error checking job match status:', error);
      return null;
    }
  }, []);

  /**
   * Submit and wait for job match results with automatic polling.
   */
  const matchCVToJob = useCallback(async (
    file: File,
    jobDescription: string,
    language: string = 'Spanish',
    maxAttempts: number = 30,
    intervalMs: number = 3000
  ): Promise<MatchResult | null> => {
    const submission = await submitJobMatch(file, jobDescription, language);
    if (!submission) return null;

    setIsLoading(true);
    try {
      for (let attempt = 0; attempt < maxAttempts; attempt++) {
        await new Promise((resolve) => setTimeout(resolve, intervalMs));
        const result = await getJobMatchStatus(submission.jobId);

        if (result?.status === 'success' && result.result) {
          toast.success('¡Análisis de compatibilidad completado!');
          return result.result;
        }

        if (result?.status === 'failed') {
          toast.error('El análisis falló. Intenta de nuevo.');
          return null;
        }
      }

      toast.error('El análisis tardó demasiado. Intenta de nuevo.');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [submitJobMatch, getJobMatchStatus]);

  /**
   * Search job positions by name with optional related positions.
   */
  const searchJobPositions = useCallback(async (
    name?: string,
    perPage?: number,
    includeRelated: boolean = true
  ): Promise<JobPositionsResponse | null> => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('job-positions', {
        body: { name, perPage, includeRelated },
      });

      if (error) {
        toast.error('Error al buscar posiciones de trabajo');
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error searching job positions:', error);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    isLoading,
    submitJobMatch,
    getJobMatchStatus,
    matchCVToJob,
    searchJobPositions,
  };
}
