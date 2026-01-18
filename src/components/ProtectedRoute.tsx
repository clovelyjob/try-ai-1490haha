import { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';
import { supabase } from '@/integrations/supabase/client';
import { SkeletonDashboard } from './ui/skeleton-loader';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireOnboarding?: boolean;
}

export const ProtectedRoute = ({ children, requireOnboarding = false }: ProtectedRouteProps) => {
  const { user, isAuthenticated, isGuestMode } = useAuthStore();
  const location = useLocation();
  const [checking, setChecking] = useState(true);
  const [hasSession, setHasSession] = useState(false);
  const [needsOnboarding, setNeedsOnboarding] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      // Guest mode always has access
      if (isGuestMode) {
        setHasSession(true);
        setChecking(false);
        return;
      }

      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          setHasSession(false);
          setChecking(false);
          return;
        }

        setHasSession(true);

        // Check if onboarding is required
        if (requireOnboarding) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('rol_profesional')
            .eq('id', session.user.id)
            .single();

          if (!profile?.rol_profesional) {
            setNeedsOnboarding(true);
          }
        }
      } catch (error) {
        console.error('Error checking auth:', error);
        setHasSession(false);
      } finally {
        setChecking(false);
      }
    };
    
    checkAuth();
  }, [isAuthenticated, isGuestMode, requireOnboarding]);

  // Mostrar loading mientras verifica la sesión
  if (checking) {
    return <SkeletonDashboard />;
  }

  // Si necesita onboarding, redirigir
  if (needsOnboarding) {
    return <Navigate to="/onboarding" replace />;
  }

  // Si no está autenticado y no es modo invitado, redirigir a code-auth
  if (!hasSession && !isGuestMode) {
    return <Navigate to="/code-auth" state={{ from: location }} replace />;
  }

  // Si requiere onboarding completado y no lo tiene, redirigir a onboarding
  if (requireOnboarding && user && !user.onboardingCompleted && !isGuestMode) {
    return <Navigate to="/onboarding" replace />;
  }

  return <>{children}</>;
};
