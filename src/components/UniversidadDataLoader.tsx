import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useUniversidadStore } from '@/store/useUniversidadStore';
import { useAuthStore } from '@/store/useAuthStore';
import { SkeletonDashboard } from '@/components/ui/skeleton-loader';

interface UniversidadDataLoaderProps {
  children: React.ReactNode;
}

/**
 * Loads university data for authenticated university admins
 * This is separate from route guarding - only handles data fetching
 */
export function UniversidadDataLoader({ children }: UniversidadDataLoaderProps) {
  const { user } = useAuthStore();
  const { 
    setUniversity, 
    setCurrentAdmin, 
    setAdmins, 
    setStudents, 
    setIsLoading,
    currentAdmin 
  } = useUniversidadStore();
  const [isLoading, setLoadingState] = useState(!currentAdmin);

  useEffect(() => {
    // If already have data, don't reload
    if (currentAdmin) {
      setLoadingState(false);
      return;
    }

    async function loadUniversityData() {
      if (!user?.id) {
        setLoadingState(false);
        return;
      }

      setIsLoading(true);

      try {
        // Get admin data with university
        const { data: adminData, error: adminError } = await supabase
          .from('university_admins')
          .select('*, universities(*)')
          .eq('user_id', user.id)
          .single();

        if (adminError || !adminData) {
          console.error('Error loading university admin data:', adminError);
          setLoadingState(false);
          setIsLoading(false);
          return;
        }

        // Set current admin
        setCurrentAdmin({
          id: adminData.id,
          university_id: adminData.university_id,
          user_id: adminData.user_id,
          role: adminData.role as 'owner' | 'admin' | 'viewer',
          name: adminData.name,
          email: adminData.email,
          created_at: adminData.created_at,
        });

        // Set university
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

        // Fetch students
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
      } catch (error) {
        console.error('Error loading university data:', error);
      } finally {
        setLoadingState(false);
        setIsLoading(false);
      }
    }

    loadUniversityData();
  }, [user?.id, currentAdmin, setUniversity, setCurrentAdmin, setAdmins, setStudents, setIsLoading]);

  if (isLoading) {
    return <SkeletonDashboard />;
  }

  return <>{children}</>;
}
