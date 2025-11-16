import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuthStore } from '@/store/useAuthStore';
import { useCVStore } from '@/store/useCVStore';
import { useInterviewStore } from '@/store/useInterviewStore';
import { useOpportunitiesStore } from '@/store/useOpportunitiesStore';
import type { CVData, InterviewSession, SavedOpportunity } from '@/types';

/**
 * Hook para sincronizar datos del usuario con Supabase
 * Carga datos de Supabase y sincroniza con los stores locales
 */
export function useDataPersistence() {
  const { session } = useAuthStore();

  useEffect(() => {
    if (session?.user) {
      loadUserData();
    }
  }, [session?.user?.id]);

  async function loadUserData() {
    if (!session?.user) return;

    try {
      // Load CVs from Supabase
      const { data: cvs, error: cvsError } = await supabase
        .from('cvs')
        .select('*')
        .eq('user_id', session.user.id);
      
      if (!cvsError && cvs) {
        // Transform Supabase data to CVData format and sync with store
        const transformedCVs: CVData[] = cvs.map((cv) => ({
          id: cv.id,
          userId: cv.user_id,
          title: cv.nombre_cv,
          template: cv.template as any || 'harvard',
          language: 'es',
          personal: cv.info_personal as any || {},
          summary: cv.resumen || '',
          education: cv.educacion as any || [],
          experience: cv.experiencia as any || [],
          research: [],
          projects: cv.proyectos as any || [],
          teaching: [],
          skills: cv.habilidades as any || [],
          certifications: cv.certificaciones as any || [],
          languages: cv.idiomas as any || [],
          awards: [],
          references: [],
          createdAt: cv.created_at,
          updatedAt: cv.updated_at,
          versions: [],
          score: { overall: 0, clarity: 0, impact: 0, keywords: 0, format: 0 },
          metadata: { industryTags: [], targetKeywords: [] },
        }));
        
        // Update the CV store with loaded data
        useCVStore.setState({ cvs: transformedCVs });
      }
      
      // Load interview sessions from Supabase
      const { data: sessions, error: sessionsError } = await supabase
        .from('interview_sessions')
        .select('*')
        .eq('user_id', session.user.id);
      
      if (!sessionsError && sessions) {
        // Transform and sync with store
        const transformedSessions: InterviewSession[] = sessions.map((s) => ({
          id: s.id,
          userId: s.user_id,
          role: s.rol,
          level: 'junior' as any,
          interviewType: 'behavioral' as any,
          tone: 'balanced' as any,
          jobDescription: s.industria || undefined,
          responses: s.respuestas as any || [],
          feedback: s.feedback as any || {},
          finalScore: s.puntuacion || 0,
          breakdown: { clarity: 0, structure: 0, evidence: 0, language: 0, culture: 0 },
          recommendations: [],
          startedAt: s.created_at,
          completedAt: s.created_at,
          saved: true,
          privacy: 'private' as any,
        }));
        
        useInterviewStore.setState({ sessions: transformedSessions });
      }
      
      // Load saved opportunities from Supabase
      const { data: opportunities, error: oppsError } = await supabase
        .from('saved_opportunities')
        .select('*')
        .eq('user_id', session.user.id);
      
      if (!oppsError && opportunities) {
        // Transform and sync with store
        const transformedOpps: SavedOpportunity[] = opportunities.map((o) => ({
          userId: o.user_id,
          opportunityId: (o.opportunity_data as any)?.id || o.id,
          listName: o.status || 'Guardadas',
          savedAt: o.created_at,
        }));
        
        useOpportunitiesStore.setState({ savedOpportunities: transformedOpps });
      }

      console.log('Data loaded from Supabase:', { cvs: cvs?.length, sessions: sessions?.length, opportunities: opportunities?.length });
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  }

  return { loadUserData };
}
