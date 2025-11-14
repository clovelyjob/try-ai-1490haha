import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuthStore } from '@/store/useAuthStore';
import { useProfileStore } from '@/store/useProfileStore';
import { useDataPersistence } from './useDataPersistence';
import type { User } from '@/types';

export function useAuthSync() {
  const { setUser, setSession } = useAuthStore();
  const { setProfile } = useProfileStore();
  
  // Initialize data persistence
  useDataPersistence();

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        
        if (session?.user) {
          // Defer profile fetch to avoid deadlock
          setTimeout(() => {
            fetchUserProfile(session.user.id);
          }, 0);
        } else {
          setUser(null);
          setProfile(null);
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      
      if (session?.user) {
        fetchUserProfile(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, [setUser, setSession, setProfile]);

  async function fetchUserProfile(userId: string) {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;

      if (profile) {
        // Transform Supabase profile to User type
        const user: User = {
          id: profile.id,
          name: profile.nombre,
          email: profile.email,
          avatar: profile.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.nombre}`,
          plan: 'free', // TODO: Add plan logic
          createdAt: new Date(profile.created_at),
          lastLogin: new Date(),
          onboardingCompleted: !!profile.rol_profesional,
        };

        setUser(user);

        // Also update profile store
        setProfile({
          userId: profile.id,
          interests: [],
          values: [],
          workStyle: { modality: '', schedule: '', companySize: '' },
          skills: { technical: [], soft: [], languages: [], tools: [] },
          experience: 'student',
          situation: '',
          challenge: '',
          diagnosticResults: { topCareers: [], profileType: '', insights: [], radarData: [] },
          rolActual: (profile.rol_profesional || 'other') as any,
          rolesSugeridos: [],
          preferencias: { intereses: [], objetivos: [], herramientas: [], nivelExperiencia: 'junior' },
          historialRol: [],
        });
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  }
}
