import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';
import { useUniversidadStore } from '@/store/useUniversidadStore';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { SkeletonDashboard } from '@/components/ui/skeleton-loader';

interface UniversidadRouteProps {
  children: React.ReactNode;
}

export function UniversidadRoute({ children }: UniversidadRouteProps) {
  const { isAuthenticated, user } = useAuthStore();
  const { setUniversity, setCurrentAdmin, setAdmins, setStudents, setIsLoading } = useUniversidadStore();
  const location = useLocation();
  const [isChecking, setIsChecking] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);

  useEffect(() => {
    async function checkUniversityAccess() {
      if (!isAuthenticated || !user) {
        setIsChecking(false);
        return;
      }

      setIsLoading(true);

      try {
        // Check if user is a university admin
        const { data: adminData, error: adminError } = await supabase
          .from('university_admins')
          .select('*, universities(*)')
          .eq('user_id', user.id)
          .single();

        if (adminError || !adminData) {
          setHasAccess(false);
          setIsChecking(false);
          setIsLoading(false);
          return;
        }

        // User is a university admin
        setCurrentAdmin({
          id: adminData.id,
          university_id: adminData.university_id,
          user_id: adminData.user_id,
          role: adminData.role as 'owner' | 'admin' | 'viewer',
          name: adminData.name,
          email: adminData.email,
          created_at: adminData.created_at,
        });

        if (adminData.universities) {
          const uni = adminData.universities as any;
          setUniversity({
            id: uni.id,
            name: uni.name,
            logo_url: uni.logo_url,
            domain: uni.domain,
            created_at: uni.created_at,
            updated_at: uni.updated_at,
          });
        }

        // Fetch all admins for this university
        const { data: adminsData } = await supabase
          .from('university_admins')
          .select('*')
          .eq('university_id', adminData.university_id);

        if (adminsData) {
          setAdmins(adminsData.map(a => ({
            id: a.id,
            university_id: a.university_id,
            user_id: a.user_id,
            role: a.role as 'owner' | 'admin' | 'viewer',
            name: a.name,
            email: a.email,
            created_at: a.created_at,
          })));
        }

        // Fetch students for this university
        const { data: studentsData } = await supabase
          .from('university_students')
          .select('*')
          .eq('university_id', adminData.university_id);

        if (studentsData) {
          setStudents(studentsData.map(s => ({
            id: s.id,
            university_id: s.university_id,
            student_user_id: s.student_user_id,
            career: s.career,
            cohort: s.cohort,
            enrolled_at: s.enrolled_at,
          })));
        }

        setHasAccess(true);
      } catch (error) {
        console.error('Error checking university access:', error);
        setHasAccess(false);
      } finally {
        setIsChecking(false);
        setIsLoading(false);
      }
    }

    checkUniversityAccess();
  }, [isAuthenticated, user, setUniversity, setCurrentAdmin, setAdmins, setStudents, setIsLoading]);

  if (isChecking) {
    return <SkeletonDashboard />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/universidad/login" state={{ from: location }} replace />;
  }

  if (!hasAccess) {
    return <Navigate to="/universidades" replace />;
  }

  return <>{children}</>;
}
