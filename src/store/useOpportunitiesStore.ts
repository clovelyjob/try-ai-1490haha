import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  Opportunity,
  Application,
  SavedOpportunity,
  MatchResult,
  Profile,
  CVData,
} from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface SearchParams {
  query: string;
  location: string;
  page: number;
  employment_types?: string;
  remote_only?: boolean;
  date_posted?: string;
}

interface OpportunitiesState {
  opportunities: Opportunity[];
  applications: Application[];
  savedOpportunities: SavedOpportunity[];
  isLoading: boolean;
  error: string | null;
  hasMore: boolean;
  currentPage: number;
  searchParams: SearchParams;
  filters: {
    search: string;
    category: string[];
    modality: string[];
    contractType: string[];
    location: string;
  };
  
  // Actions
  loadOpportunities: (params?: Partial<SearchParams>) => Promise<void>;
  loadMoreOpportunities: () => Promise<void>;
  setFilters: (filters: Partial<OpportunitiesState['filters']>) => void;
  clearFilters: () => void;
  
  // Saved opportunities
  saveOpportunity: (userId: string, opportunityId: string, listName?: string) => void;
  unsaveOpportunity: (userId: string, opportunityId: string) => void;
  isSaved: (userId: string, opportunityId: string) => boolean;
  
  // Applications
  createApplication: (application: Omit<Application, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateApplicationStatus: (applicationId: string, status: Application['status']) => void;
  getUserApplications: (userId: string) => Application[];
  hasApplied: (userId: string, opportunityId: string) => boolean;
  
  // Matching
  calculateMatch: (opportunity: Opportunity, profile: Profile, cv?: CVData) => MatchResult;
  
  // B2B
  publishOpportunity: (opportunity: Omit<Opportunity, 'id' | 'views' | 'applicantsCount'>) => void;
}

// Mock data fallback
const generateMockOpportunities = (): Opportunity[] => [
  {
    id: 'mock-1',
    title: 'Desarrollador Frontend React - Práctica',
    company: 'TechCorp',
    location: 'Lima, Perú',
    modality: 'hybrid',
    contractType: 'internship',
    description: 'Buscamos un desarrollador frontend apasionado para unirse a nuestro equipo.',
    requirements: ['React', 'TypeScript', 'HTML/CSS', 'Git'],
    benefits: ['Horario flexible', 'Ambiente colaborativo'],
    tags: ['React', 'Frontend', 'TypeScript'],
    category: 'technology',
    publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    salaryRange: { min: 1000, max: 1500, currency: 'USD' },
    source: 'Clovely',
    views: 245,
    applicantsCount: 18,
  },
  {
    id: 'mock-2',
    title: 'Diseñador UX/UI Junior',
    company: 'DesignStudio',
    location: 'Remoto',
    modality: 'remote',
    contractType: 'full-time',
    description: 'Estamos buscando un diseñador UX/UI creativo para crear experiencias digitales.',
    requirements: ['Figma', 'Adobe Creative Suite', 'Prototipos'],
    benefits: ['100% remoto', 'Capacitaciones'],
    tags: ['UX', 'UI', 'Figma', 'Design'],
    category: 'design',
    publishedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    expiresAt: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString(),
    salaryRange: { min: 2000, max: 3000, currency: 'USD' },
    source: 'Employer',
    views: 412,
    applicantsCount: 34,
  },
];

export const useOpportunitiesStore = create<OpportunitiesState>()(
  persist(
    (set, get) => ({
      opportunities: [],
      applications: [],
      savedOpportunities: [],
      isLoading: false,
      error: null,
      hasMore: true,
      currentPage: 1,
      searchParams: {
        query: 'developer',
        location: '',
        page: 1,
      },
      filters: {
        search: '',
        category: [],
        modality: [],
        contractType: [],
        location: '',
      },

      loadOpportunities: async (params?: Partial<SearchParams>) => {
        set({ isLoading: true, error: null });
        
        const currentParams = get().searchParams;
        const newParams = { ...currentParams, ...params, page: params?.page || 1 };
        set({ searchParams: newParams, currentPage: newParams.page });

        try {
          const searchParams = new URLSearchParams({
            query: newParams.query || 'developer',
            page: newParams.page.toString(),
          });

          if (newParams.location) {
            searchParams.set('location', newParams.location);
          }
          if (newParams.employment_types) {
            searchParams.set('employment_types', newParams.employment_types);
          }
          if (newParams.remote_only) {
            searchParams.set('remote_only', 'true');
          }
          if (newParams.date_posted) {
            searchParams.set('date_posted', newParams.date_posted);
          }

          const { data, error } = await supabase.functions.invoke('search-jobs', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
            body: null,
          });

          // Since we can't use GET params with invoke, use POST
          const response = await fetch(
            `https://otjnaalbstgxoodczqak.supabase.co/functions/v1/search-jobs?${searchParams.toString()}`,
            {
              method: 'GET',
              headers: {
                'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
                'Content-Type': 'application/json',
              },
            }
          );

          if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
          }

          const result = await response.json();

          if (result.error) {
            console.warn('API returned error, using mock data:', result.error);
            set({ 
              opportunities: generateMockOpportunities(),
              isLoading: false,
              error: result.error,
              hasMore: false,
            });
            return;
          }

          if (result.data && result.data.length > 0) {
            set({ 
              opportunities: newParams.page === 1 ? result.data : [...get().opportunities, ...result.data],
              isLoading: false,
              hasMore: result.hasMore || false,
            });
          } else {
            // No results from API, show mock data as fallback
            if (newParams.page === 1) {
              set({ 
                opportunities: generateMockOpportunities(),
                isLoading: false,
                hasMore: false,
              });
            } else {
              set({ isLoading: false, hasMore: false });
            }
          }
        } catch (error) {
          console.error('Error loading opportunities:', error);
          // Use mock data as fallback
          set({ 
            opportunities: generateMockOpportunities(),
            isLoading: false,
            error: error instanceof Error ? error.message : 'Error loading opportunities',
            hasMore: false,
          });
        }
      },

      loadMoreOpportunities: async () => {
        const { currentPage, hasMore, isLoading } = get();
        if (!hasMore || isLoading) return;
        
        await get().loadOpportunities({ page: currentPage + 1 });
      },

      setFilters: (newFilters) => {
        set((state) => ({
          filters: { ...state.filters, ...newFilters },
        }));
      },

      clearFilters: () => {
        set({
          filters: {
            search: '',
            category: [],
            modality: [],
            contractType: [],
            location: '',
          },
        });
      },

      saveOpportunity: (userId, opportunityId, listName = 'Guardadas') => {
        set((state) => ({
          savedOpportunities: [
            ...state.savedOpportunities,
            {
              userId,
              opportunityId,
              savedAt: new Date().toISOString(),
              listName,
            },
          ],
        }));
      },

      unsaveOpportunity: (userId, opportunityId) => {
        set((state) => ({
          savedOpportunities: state.savedOpportunities.filter(
            (saved) => !(saved.userId === userId && saved.opportunityId === opportunityId)
          ),
        }));
        
        supabase
          .from('saved_opportunities')
          .delete()
          .eq('user_id', userId)
          .then(({ error }) => {
            if (error) {
              console.error('Error deleting saved opportunity from Supabase:', error);
              toast.error('Error al eliminar la oportunidad guardada');
            }
          });
      },

      isSaved: (userId, opportunityId) => {
        return get().savedOpportunities.some(
          (saved) => saved.userId === userId && saved.opportunityId === opportunityId
        );
      },

      createApplication: (application) => {
        const newApplication: Application = {
          ...application,
          id: `app-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          status: 'sent',
        };

        set((state) => ({
          applications: [...state.applications, newApplication],
          opportunities: state.opportunities.map((opp) =>
            opp.id === application.opportunityId
              ? { ...opp, applicantsCount: opp.applicantsCount + 1 }
              : opp
          ),
        }));
      },

      updateApplicationStatus: (applicationId, status) => {
        set((state) => ({
          applications: state.applications.map((app) =>
            app.id === applicationId
              ? { ...app, status, updatedAt: new Date().toISOString() }
              : app
          ),
        }));
      },

      getUserApplications: (userId) => {
        return get().applications.filter((app) => app.userId === userId);
      },

      hasApplied: (userId, opportunityId) => {
        return get().applications.some(
          (app) => app.userId === userId && app.opportunityId === opportunityId
        );
      },

      calculateMatch: (opportunity, profile, cv) => {
        const userSkills = [
          ...profile.skills.technical.map((s) => s.name.toLowerCase()),
          ...profile.skills.tools.map((t) => t.toLowerCase()),
        ];
        const requiredSkills = opportunity.requirements.map((r) => r.toLowerCase());

        const matchingSkills = requiredSkills.filter((req) =>
          userSkills.some((skill) => skill.includes(req) || req.includes(skill))
        );
        const skillsMatch = requiredSkills.length > 0 
          ? Math.round((matchingSkills.length / requiredSkills.length) * 100)
          : 50;

        const experienceLevels: Record<string, number> = {
          student: 0,
          graduate: 1,
          junior: 2,
          mid: 3,
          senior: 4,
        };
        const userLevel = experienceLevels[profile.experience] || 0;
        const requiredLevel = opportunity.contractType === 'internship' ? 0 : 2;
        const experienceMatch = Math.max(0, 100 - Math.abs(userLevel - requiredLevel) * 20);

        const educationMatch = cv?.education.length ? 85 : 60;

        const lifestyleMatch = profile.workStyle.modality === opportunity.modality ? 100 : 70;

        const cvText = cv
          ? `${cv.summary} ${cv.experience.map((e) => e.bullets.map((b) => b.text).join(' ')).join(' ')}`
          : '';
        const keywordMatches = opportunity.tags.filter((tag) =>
          cvText.toLowerCase().includes(tag.toLowerCase())
        ).length;
        const keywordsMatch = opportunity.tags.length
          ? Math.round((keywordMatches / opportunity.tags.length) * 100)
          : 50;

        const overall = Math.round(
          skillsMatch * 0.4 +
            experienceMatch * 0.25 +
            educationMatch * 0.15 +
            lifestyleMatch * 0.1 +
            keywordsMatch * 0.1
        );

        const missingSkills = requiredSkills.filter(
          (req) => !userSkills.some((skill) => skill.includes(req) || req.includes(skill))
        );

        const recommendations: string[] = [];
        if (skillsMatch < 70) {
          recommendations.push(
            `Añade las siguientes habilidades a tu perfil o CV: ${missingSkills.slice(0, 3).join(', ')}`
          );
        }
        if (keywordsMatch < 60) {
          recommendations.push(
            `Incluye estas palabras clave en tu CV: ${opportunity.tags.slice(0, 3).join(', ')}`
          );
        }
        if (experienceMatch < 70 && opportunity.contractType !== 'internship') {
          recommendations.push(
            'Agrega más proyectos o experiencias relevantes a tu CV'
          );
        }
        if (recommendations.length === 0) {
          recommendations.push('¡Excelente match! Tu perfil está bien alineado.');
        }

        return {
          overall,
          breakdown: {
            skillsMatch,
            experienceMatch,
            educationMatch,
            lifestyleMatch,
            keywordsMatch,
          },
          recommendations,
          missingSkills,
        };
      },

      publishOpportunity: (opportunity) => {
        const newOpportunity: Opportunity = {
          ...opportunity,
          id: `opp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          publishedAt: new Date().toISOString(),
          views: 0,
          applicantsCount: 0,
        };

        set((state) => ({
          opportunities: [newOpportunity, ...state.opportunities],
        }));
      },
    }),
    {
      name: 'clovely-opportunities-storage',
      partialize: (state) => ({
        applications: state.applications,
        savedOpportunities: state.savedOpportunities,
      }),
    }
  )
);
