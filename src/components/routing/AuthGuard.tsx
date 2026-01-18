import { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuthStore } from '@/store/useAuthStore';
import { SkeletonDashboard } from '@/components/ui/skeleton-loader';

export type UserRole = 'user' | 'university_admin' | 'admin';

export interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  userId: string | null;
  role: UserRole;
  hasCompletedDiagnostic: boolean;
  isUniversityAdmin: boolean;
}

/**
 * Central hook for checking authentication state from the database
 * This is the single source of truth for routing decisions
 */
export function useAuthState(): AuthState {
  const { isGuestMode } = useAuthStore();
  const [state, setState] = useState<AuthState>({
    isAuthenticated: false,
    isLoading: true,
    userId: null,
    role: 'user',
    hasCompletedDiagnostic: false,
    isUniversityAdmin: false,
  });

  useEffect(() => {
    let isMounted = true;

    const checkAuthState = async () => {
      // Guest mode - treat as authenticated with diagnostic completed
      if (isGuestMode) {
        if (isMounted) {
          setState({
            isAuthenticated: true,
            isLoading: false,
            userId: 'guest',
            role: 'user',
            hasCompletedDiagnostic: true,
            isUniversityAdmin: false,
          });
        }
        return;
      }

      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          if (isMounted) {
            setState({
              isAuthenticated: false,
              isLoading: false,
              userId: null,
              role: 'user',
              hasCompletedDiagnostic: false,
              isUniversityAdmin: false,
            });
          }
          return;
        }

        // Fetch profile to determine role and diagnostic status
        const { data: profile } = await supabase
          .from('profiles')
          .select('user_role, rol_profesional')
          .eq('id', session.user.id)
          .single();

        // Check if user is a university admin
        const { data: universityAdmin } = await supabase
          .from('university_admins')
          .select('id')
          .eq('user_id', session.user.id)
          .maybeSingle();

        const userRole = profile?.user_role as UserRole || 'user';
        const isUniversityAdmin = !!universityAdmin || userRole === 'university_admin';
        const hasCompletedDiagnostic = !!profile?.rol_profesional;

        if (isMounted) {
          setState({
            isAuthenticated: true,
            isLoading: false,
            userId: session.user.id,
            role: isUniversityAdmin ? 'university_admin' : userRole,
            hasCompletedDiagnostic,
            isUniversityAdmin,
          });
        }
      } catch (error) {
        console.error('Error checking auth state:', error);
        if (isMounted) {
          setState({
            isAuthenticated: false,
            isLoading: false,
            userId: null,
            role: 'user',
            hasCompletedDiagnostic: false,
            isUniversityAdmin: false,
          });
        }
      }
    };

    checkAuthState();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      checkAuthState();
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [isGuestMode]);

  return state;
}

interface StudentRouteProps {
  children: React.ReactNode;
  requireDiagnostic?: boolean;
}

/**
 * Route guard for student/normal user routes
 * - Unauthenticated → redirect to /code-auth
 * - Authenticated but no diagnostic → redirect to /onboarding
 * - Authenticated with diagnostic → allow access
 * - University admins → redirect to /universidad/dashboard
 */
export function StudentRoute({ children, requireDiagnostic = false }: StudentRouteProps) {
  const authState = useAuthState();
  const location = useLocation();

  if (authState.isLoading) {
    return <SkeletonDashboard />;
  }

  // Not authenticated → login
  if (!authState.isAuthenticated) {
    return <Navigate to="/code-auth" state={{ from: location }} replace />;
  }

  // University admin → their dashboard
  if (authState.isUniversityAdmin) {
    return <Navigate to="/universidad/dashboard" replace />;
  }

  // Requires diagnostic completion but not completed → onboarding
  if (requireDiagnostic && !authState.hasCompletedDiagnostic) {
    return <Navigate to="/onboarding" replace />;
  }

  return <>{children}</>;
}

interface DiagnosticRouteProps {
  children: React.ReactNode;
}

/**
 * Route guard for the diagnostic/onboarding page
 * - Unauthenticated → redirect to /code-auth
 * - Already completed diagnostic → redirect to /dashboard
 * - University admins → redirect to /universidad/dashboard
 */
export function DiagnosticRoute({ children }: DiagnosticRouteProps) {
  const authState = useAuthState();
  const location = useLocation();

  if (authState.isLoading) {
    return <SkeletonDashboard />;
  }

  // Not authenticated → login
  if (!authState.isAuthenticated) {
    return <Navigate to="/code-auth" state={{ from: location }} replace />;
  }

  // University admin → their dashboard
  if (authState.isUniversityAdmin) {
    return <Navigate to="/universidad/dashboard" replace />;
  }

  // Already completed diagnostic → dashboard
  if (authState.hasCompletedDiagnostic) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}

interface UniversityRouteProps {
  children: React.ReactNode;
}

/**
 * Route guard for university admin routes
 * - Unauthenticated → redirect to /universidad/login
 * - Not a university admin → redirect to /universidades
 * - University admin → allow access
 */
export function UniversityAdminRoute({ children }: UniversityRouteProps) {
  const authState = useAuthState();
  const location = useLocation();

  if (authState.isLoading) {
    return <SkeletonDashboard />;
  }

  // Not authenticated → university login
  if (!authState.isAuthenticated) {
    return <Navigate to="/code-auth?role=university_admin" state={{ from: location }} replace />;
  }

  // Not a university admin → university landing
  if (!authState.isUniversityAdmin) {
    return <Navigate to="/universidades" replace />;
  }

  return <>{children}</>;
}

interface PublicOnlyRouteProps {
  children: React.ReactNode;
  universityFlow?: boolean;
}

/**
 * Route guard for public-only routes (login, register)
 * Redirects authenticated users to their appropriate dashboard
 */
export function PublicOnlyRoute({ children, universityFlow = false }: PublicOnlyRouteProps) {
  const authState = useAuthState();

  if (authState.isLoading) {
    return <SkeletonDashboard />;
  }

  // Not authenticated → show the public page
  if (!authState.isAuthenticated) {
    return <>{children}</>;
  }

  // Authenticated university admin → university dashboard
  if (authState.isUniversityAdmin) {
    return <Navigate to="/universidad/dashboard" replace />;
  }

  // Authenticated normal user
  if (universityFlow) {
    // Trying to access university auth pages but not a university admin
    return <Navigate to="/universidades" replace />;
  }

  // Redirect based on diagnostic completion
  if (authState.hasCompletedDiagnostic) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Navigate to="/onboarding" replace />;
}
