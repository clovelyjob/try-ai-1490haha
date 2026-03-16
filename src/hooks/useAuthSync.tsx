import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuthStore } from '@/store/useAuthStore';
import { useProfileStore } from '@/store/useProfileStore';
import { useDataPersistence } from './useDataPersistence';
import type { User, AccessRole } from '@/types';

const accessRoleToPlan = (accessRole: AccessRole): User['plan'] => {
  switch (accessRole) {
    case 'premium_user':
      return 'premium';
    case 'trial_user':
      return 'trial';
    default:
      return 'free';
  }
};

export function useAuthSync() {
  const { setUser, setSession } = useAuthStore();
  const { setProfile } = useProfileStore();

  useDataPersistence();

  useEffect(() => {
    let isMounted = true;

    const syncAuthState = async (session: Awaited<ReturnType<typeof supabase.auth.getSession>>['data']['session']) => {
      if (!isMounted) return;

      setSession(session);

      if (session?.user) {
        const state = useAuthStore.getState();
        if (state.isGuestMode) {
          useAuthStore.setState({ isGuestMode: false, guestData: null });
        }

        await fetchUserProfile(session.user.id);
        return;
      }

      const state = useAuthStore.getState();
      if (!state.isGuestMode) {
        setUser(null);
        setProfile(null);
      }
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      void syncAuthState(session);
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      void syncAuthState(session);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [setUser, setSession, setProfile]);

  async function fetchUserProfile(userId: string) {
    try {
      const [{ data: profile, error: profileError }, { data: accessLevel, error: accessError }] = await Promise.all([
        supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .maybeSingle(),
        supabase
          .from('user_access_levels')
          .select('access_level')
          .eq('user_id', userId)
          .maybeSingle(),
      ]);

      let accessRole = (accessLevel?.access_level || 'free_user') as AccessRole;

      if (!accessLevel) {
        const { data: insertedAccess, error: insertAccessError } = await supabase
          .from('user_access_levels')
          .insert({ user_id: userId, access_level: 'free_user' })
          .select('access_level')
          .single();

        if (!insertAccessError && insertedAccess?.access_level) {
          accessRole = insertedAccess.access_level as AccessRole;
        }
      }

      if (accessError && accessError.code !== 'PGRST116') {
        console.warn('Error fetching user access level:', accessError.message);
      }

      if (profileError) {
        if (profileError.code === 'PGRST116') {
          await new Promise((resolve) => setTimeout(resolve, 1000));

          const { data: retryProfile, error: retryError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .maybeSingle();

          if (retryError || !retryProfile) {
            console.warn('Profile not found after retry, building user from session');
            await applySessionFallbackUser(accessRole);
            return;
          }

          applyProfile(retryProfile, accessRole);
          return;
        }

        throw profileError;
      }

      if (profile) {
        applyProfile(profile, accessRole);
        return;
      }

      await applySessionFallbackUser(accessRole);
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  }

  async function applySessionFallbackUser(accessRole: AccessRole) {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return;

    const meta = session.user.user_metadata;
    setUser({
      id: session.user.id,
      name: meta?.nombre || meta?.name || 'Usuario',
      email: session.user.email || '',
      avatar: meta?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${session.user.id}`,
      plan: accessRoleToPlan(accessRole),
      accessRole,
      createdAt: new Date(session.user.created_at),
      lastLogin: new Date(),
      lastActiveDate: new Date(),
      onboardingCompleted: false,
      streak: 1,
      applicationsSubmitted: 0,
    });
    setProfile(null);
  }

  function applyProfile(profile: any, accessRole: AccessRole) {
    const user: User = {
      id: profile.id,
      name: profile.nombre,
      email: profile.email,
      avatar: profile.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.nombre}`,
      plan: accessRoleToPlan(accessRole),
      accessRole,
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
