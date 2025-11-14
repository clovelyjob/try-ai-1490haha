import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuthStore } from '@/store/useAuthStore';

/**
 * Hook para sincronizar datos del usuario con Supabase
 * Por ahora solo carga los datos - la escritura se hará más adelante
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
      // Load CVs
      const { data: cvs } = await supabase
        .from('cvs')
        .select('*')
        .eq('user_id', session.user.id);
      
      // Load interview sessions
      const { data: sessions } = await supabase
        .from('interview_sessions')
        .select('*')
        .eq('user_id', session.user.id);
      
      // Load saved opportunities
      const { data: opportunities } = await supabase
        .from('saved_opportunities')
        .select('*')
        .eq('user_id', session.user.id);

      console.log('Data loaded:', { cvs, sessions, opportunities });
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  }

  return { loadUserData };
}
