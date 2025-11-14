import { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';
import { supabase } from '@/integrations/supabase/client';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireOnboarding?: boolean;
}

export const ProtectedRoute = ({ children, requireOnboarding = false }: ProtectedRouteProps) => {
  const { user, isAuthenticated, isGuestMode } = useAuthStore();
  const location = useLocation();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setChecking(false);
    };
    
    checkAuth();
  }, []);

  // Mostrar loading mientras verifica la sesión
  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Si no está autenticado y no es modo invitado, redirigir a login
  if (!isAuthenticated && !isGuestMode) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Si requiere onboarding completado y no lo tiene, redirigir a onboarding
  if (requireOnboarding && user && !user.onboardingCompleted && !isGuestMode) {
    return <Navigate to="/onboarding" replace />;
  }

  return <>{children}</>;
};
