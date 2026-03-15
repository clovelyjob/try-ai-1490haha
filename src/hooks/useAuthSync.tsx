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
          // Limpiar modo invitado si hay sesión real de Supabase
          const state = useAuthStore.getState();
          if (state.isGuestMode) {
            useAuthStore.setState({ isGuestMode: false, guestData: null });
          }
          // Defer profile fetch to avoid deadlock
          setTimeout(() => {
            fetchUserProfile(session.user.id);
          }, 0);
        } else {
          // Don't clear guest mode data when there's no Supabase session
          const state = useAuthStore.getState();
          if (!state.isGuestMode) {
            setUser(null);
            setProfile(null);
          }
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

      if (error) {
        // Profile might not exist yet (trigger may be processing)
        // Retry once after a short delay
        if (error.code === 'PGRST116') {
          console.log('Profile not found yet, retrying in 1s...');
          await new Promise(r => setTimeout(r, 1000));
          const { data: retryProfile, error: retryError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single();
          if (retryError) {
            console.warn('Profile still not found after retry:', retryError.message);
            // Create a minimal user from session data
            const { data: { session } } = await supabase.auth.getSession();
            if (session?.user) {
              const meta = session.user.user_metadata;
              setUser({
                id: session.user.id,
                name: meta?.nombre || meta?.name || 'Usuario',
                email: session.user.email || '',
                avatar: meta?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${session.user.id}`,
                plan: 'free',
                createdAt: new Date(session.user.created_at),
                lastLogin: new Date(),
                lastActiveDate: new Date(),
                onboardingCompleted: false,
                streak: 1,
                applicationsSubmitted: 0,
              });
            }
            return;
          }
          if (retryProfile) {
            applyProfile(retryProfile);
          }
          return;
        }
        throw error;
      }

      if (profile) {
        applyProfile(profile);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  }

  function applyProfile(profile: any) {
    const user: User = {
      id: profile.id,
      name: profile.nombre,
      email: profile.email,
      avatar: profile.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.nombre}`,
      plan: 'free',
      createdAt: new Date(profile.created_at),
      lastLogin: new Date(),
      lastActiveDate: new Date(),
      onboardingCompleted: !!(profile.progreso as any)?.onboarding_completado || !!profile.rol_profesional,
      streak: 1,
      applicationsSubmitted: 0,
    };

    setUser(user);

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
}
