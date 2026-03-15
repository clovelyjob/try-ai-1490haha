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
import { useAuthStore } from '@/store/useAuthStore';

interface SearchParams {
  query: string;
  location: string;
  page: number;
  employment_types?: string;
  remote_only?: boolean;
  date_posted?: string;
  experience_level?: string;
}

interface CacheEntry {
  data: Opportunity[];
  timestamp: number;
  hasMore: boolean;
}

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

interface OpportunitiesState {
  opportunities: Opportunity[];
  applications: Application[];
  savedOpportunities: SavedOpportunity[];
  isLoading: boolean;
  error: string | null;
  hasMore: boolean;
  currentPage: number;
  searchParams: SearchParams;
  cache: Record<string, CacheEntry>;
  filters: {
    search: string;
    category: string[];
    modality: string[];
    contractType: string[];
    location: string;
    remoteOnly?: boolean;
    datePosted?: string;
    experienceLevel?: string;
  };
  
  // Actions
  loadOpportunities: (params?: Partial<SearchParams>) => Promise<void>;
  loadMoreOpportunities: () => Promise<void>;
  setFilters: (filters: Partial<OpportunitiesState['filters']>) => void;
  clearFilters: () => void;
  
  // Saved opportunities
  saveOpportunity: (userId: string, opportunityId: string, listName?: string) => Promise<void>;
  unsaveOpportunity: (userId: string, opportunityId: string) => Promise<void>;
  isSaved: (userId: string, opportunityId: string) => boolean;
  loadSavedOpportunities: (userId: string) => Promise<void>;
  
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

// Mock data fallback - uses well-known companies for guest mode preview
const generateMockOpportunities = (): Opportunity[] => [
  {
    id: 'mock-1',
    title: 'Software Engineer Intern',
    company: 'Google',
    location: 'Mountain View, CA (Remoto disponible)',
    modality: 'hybrid',
    contractType: 'internship',
    description: 'Únete al equipo de ingeniería de Google y trabaja en productos que impactan a miles de millones de usuarios.',
    requirements: ['Python', 'Java', 'Algoritmos', 'Estructuras de datos'],
    benefits: ['Comidas gratuitas', 'Transporte', 'Mentoría'],
    tags: ['Python', 'Java', 'Cloud', 'AI'],
    category: 'technology',
    publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    salaryRange: { min: 4000, max: 6500, currency: 'USD' },
    source: 'MoonJab',
    views: 1240,
    applicantsCount: 87,
  },
  {
    id: 'mock-2',
    title: 'Product Designer Junior',
    company: 'Apple',
    location: 'Cupertino, CA',
    modality: 'onsite',
    contractType: 'full-time',
    description: 'Diseña experiencias que definen el futuro de la tecnología en Apple.',
    requirements: ['Figma', 'Sketch', 'Prototipos', 'Design Systems'],
    benefits: ['Descuento en productos', 'Seguro médico premium', 'Stock options'],
    tags: ['UX', 'UI', 'Figma', 'Design Systems'],
    category: 'design',
    publishedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    expiresAt: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000).toISOString(),
    salaryRange: { min: 5000, max: 7500, currency: 'USD' },
    source: 'MoonJab',
    views: 890,
    applicantsCount: 62,
  },
  {
    id: 'mock-3',
    title: 'Data Analyst',
    company: 'IBM',
    location: 'Remoto - LATAM',
    modality: 'remote',
    contractType: 'full-time',
    description: 'Analiza datos empresariales y genera insights para clientes Fortune 500.',
    requirements: ['SQL', 'Python', 'Tableau', 'Excel avanzado'],
    benefits: ['100% remoto', 'Capacitación continua', 'Certificaciones'],
    tags: ['SQL', 'Python', 'Tableau', 'Data'],
    category: 'technology',
    publishedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    expiresAt: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString(),
    salaryRange: { min: 3000, max: 5000, currency: 'USD' },
    source: 'MoonJab',
    views: 567,
    applicantsCount: 41,
  },
  {
    id: 'mock-4',
    title: 'Marketing Coordinator',
    company: 'Microsoft',
    location: 'Ciudad de México, México',
    modality: 'hybrid',
    contractType: 'full-time',
    description: 'Coordina campañas de marketing digital para productos Microsoft en LATAM.',
    requirements: ['Marketing Digital', 'Google Ads', 'Redes Sociales', 'Copywriting'],
    benefits: ['Horario flexible', 'Home office parcial', 'Desarrollo profesional'],
    tags: ['Marketing', 'Digital', 'Social Media'],
    category: 'marketing',
    publishedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    expiresAt: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
    salaryRange: { min: 2500, max: 4000, currency: 'USD' },
    source: 'MoonJab',
    views: 430,
    applicantsCount: 29,
  },
  {
    id: 'mock-5',
    title: 'Frontend Developer',
    company: 'Amazon',
    location: 'Seattle, WA (Remoto disponible)',
    modality: 'remote',
    contractType: 'full-time',
    description: 'Construye interfaces de usuario escalables para millones de clientes de Amazon.',
    requirements: ['React', 'TypeScript', 'Node.js', 'AWS'],
    benefits: ['Stock options', 'Relocation bonus', 'Seguro dental'],
    tags: ['React', 'TypeScript', 'AWS', 'Frontend'],
    category: 'technology',
    publishedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    expiresAt: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000).toISOString(),
    salaryRange: { min: 5500, max: 8000, currency: 'USD' },
    source: 'MoonJab',
    views: 1100,
    applicantsCount: 73,
  },
];

// RIASEC to job category mapping
const riasecToCategories: Record<string, string[]> = {
  R: ['technology', 'engineering', 'construction'],
  I: ['technology', 'science', 'health', 'research'],
  A: ['design', 'marketing', 'media', 'arts'],
  S: ['education', 'health', 'social', 'customer_service'],
  E: ['business', 'sales', 'marketing', 'management'],
  C: ['business', 'finance', 'administration', 'legal'],
};

function getCacheKey(params: SearchParams): string {
  return JSON.stringify({
    query: params.query,
    location: params.location,
    page: params.page,
    employment_types: params.employment_types,
    remote_only: params.remote_only,
    date_posted: params.date_posted,
  });
}

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
      cache: {},
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
        remoteOnly: false,
        datePosted: 'all',
        experienceLevel: '',
      },

      loadOpportunities: async (params?: Partial<SearchParams>) => {
        set({ isLoading: true, error: null });

        const authState = useAuthStore.getState();
        const isGuest = authState.isGuestMode;
        const userPlan = authState.user?.plan || 'free';

        // Guest mode: show 5 generic mock jobs, no API call
        if (isGuest) {
          set({
            opportunities: generateMockOpportunities().slice(0, 5),
            isLoading: false,
            hasMore: false,
          });
          return;
        }

        // Check session for authenticated users
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          set({
            opportunities: generateMockOpportunities().slice(0, 5),
            isLoading: false,
            hasMore: false,
          });
          return;
        }

        // Free users: check daily limit (5 jobs per day)
        const FREE_DAILY_LIMIT = 5;
        const isPremium = userPlan === 'premium' || userPlan === 'pro';
        
        const currentParams = get().searchParams;
        const filters = get().filters;
        const newParams: SearchParams = { 
          ...currentParams, 
          ...params, 
          page: params?.page || 1,
          employment_types: filters.contractType.length > 0 ? filters.contractType.join(',') : undefined,
          remote_only: filters.remoteOnly,
          date_posted: filters.datePosted !== 'all' ? filters.datePosted : undefined,
          experience_level: filters.experienceLevel || undefined,
        };
        set({ searchParams: newParams, currentPage: newParams.page });

        const cacheKey = getCacheKey(newParams);
        const cachedEntry = get().cache[cacheKey];
        
        // Check cache
        if (cachedEntry && Date.now() - cachedEntry.timestamp < CACHE_DURATION) {
          console.log('Using cached data for:', cacheKey);
          set({ 
            opportunities: newParams.page === 1 ? cachedEntry.data : [...get().opportunities, ...cachedEntry.data],
            isLoading: false,
            hasMore: cachedEntry.hasMore,
          });
          return;
        }

        try {
          const searchParams = new URLSearchParams({
            query: newParams.query || 'developer',
            page: newParams.page.toString(),
          });

          if (newParams.location || filters.location) {
            searchParams.set('location', newParams.location || filters.location);
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

          const response = await fetch(
            `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/search-jobs?${searchParams.toString()}`,
            {
              method: 'GET',
              headers: {
                'Authorization': `Bearer ${session.access_token}`,
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
            // Store in cache
            set((state) => ({
              cache: {
                ...state.cache,
                [cacheKey]: {
                  data: result.data,
                  timestamp: Date.now(),
                  hasMore: result.hasMore || false,
                },
              },
              opportunities: newParams.page === 1 ? result.data : [...get().opportunities, ...result.data],
              isLoading: false,
              hasMore: result.hasMore || false,
            }));
          } else {
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
            remoteOnly: false,
            datePosted: 'all',
            experienceLevel: '',
          },
        });
      },

      saveOpportunity: async (userId, opportunityId, listName = 'Guardadas') => {
        const opportunity = get().opportunities.find(o => o.id === opportunityId);
        if (!opportunity) return;

        // Add to local state immediately
        set((state) => ({
          savedOpportunities: [
            ...state.savedOpportunities,
            {
              opportunityId,
              savedAt: new Date().toISOString(),
              listName,
              userId,
            },
          ],
        }));

        // Persist to Supabase
        try {
          const { error } = await supabase
            .from('saved_opportunities')
            .insert({
              user_id: userId,
              opportunity_data: opportunity as any,
              status: 'saved',
              notes: '',
            });

          if (error) {
            console.error('Error saving opportunity to Supabase:', error);
            toast.error('Error al guardar la oportunidad');
          }
        } catch (err) {
          console.error('Error persisting saved opportunity:', err);
        }
      },

      unsaveOpportunity: async (userId, opportunityId) => {
        // Remove from local state
        set((state) => ({
          savedOpportunities: state.savedOpportunities.filter(
            (saved) => !(saved.userId === userId && saved.opportunityId === opportunityId)
          ),
        }));
        
        // Remove from Supabase
        try {
          const { error } = await supabase
            .from('saved_opportunities')
            .delete()
            .eq('user_id', userId)
            .contains('opportunity_data', { id: opportunityId });

          if (error) {
            console.error('Error deleting saved opportunity from Supabase:', error);
            toast.error('Error al eliminar la oportunidad guardada');
          }
        } catch (err) {
          console.error('Error removing saved opportunity:', err);
        }
      },

      loadSavedOpportunities: async (userId: string) => {
        try {
          const { data, error } = await supabase
            .from('saved_opportunities')
            .select('*')
            .eq('user_id', userId);

          if (error) {
            console.error('Error loading saved opportunities:', error);
            return;
          }

          if (data) {
            const savedOpps: SavedOpportunity[] = data.map((item) => ({
              opportunityId: (item.opportunity_data as any)?.id || item.id,
              savedAt: item.created_at,
              listName: item.status || 'Guardadas',
              userId: item.user_id,
            }));

            set({ savedOpportunities: savedOpps });
          }
        } catch (err) {
          console.error('Error loading saved opportunities:', err);
        }
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
        if (!profile?.skills) {
          return { overall: 50, breakdown: { skillsMatch: 50, experienceMatch: 50, educationMatch: 50, lifestyleMatch: 50, keywordsMatch: 50 }, recommendations: [], missingSkills: opportunity.requirements || [] };
        }
        // Base skill matching
        const userSkills = [
          ...(profile.skills.technical || []).map((s: any) => (s.name || s).toString().toLowerCase()),
          ...(profile.skills.tools || []).map((t: any) => t.toString().toLowerCase()),
        ];
        const requiredSkills = opportunity.requirements.map((r) => r.toLowerCase());

        const matchingSkills = requiredSkills.filter((req) =>
          userSkills.some((skill) => skill.includes(req) || req.includes(skill))
        );
        let skillsMatch = requiredSkills.length > 0 
          ? Math.round((matchingSkills.length / requiredSkills.length) * 100)
          : 50;

        // RIASEC-based category matching
        let riasecBonus = 0;
        if (profile.riasecCode) {
          const topTypes = profile.riasecCode.split('').slice(0, 2);
          const preferredCategories = topTypes.flatMap(type => riasecToCategories[type] || []);
          
          if (preferredCategories.includes(opportunity.category)) {
            riasecBonus = 15; // Boost match for RIASEC-aligned jobs
          }
        }

        // Experience matching with RIASEC consideration
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

        // Education matching
        const educationMatch = cv?.education.length ? 85 : 60;

        // Lifestyle/modality matching
        const lifestyleMatch = profile.workStyle.modality === opportunity.modality ? 100 : 70;

        // Keyword matching from CV
        const cvText = cv
          ? `${cv.summary} ${cv.experience.map((e) => e.bullets.map((b) => b.text).join(' ')).join(' ')}`
          : '';
        const keywordMatches = opportunity.tags.filter((tag) =>
          cvText.toLowerCase().includes(tag.toLowerCase())
        ).length;
        const keywordsMatch = opportunity.tags.length
          ? Math.round((keywordMatches / opportunity.tags.length) * 100)
          : 50;

        // Interest alignment (from RIASEC)
        let interestMatch = 50;
        if (profile.riasecScores) {
          // Map job category to RIASEC types
          const categoryToRiasec: Record<string, string[]> = {
            technology: ['R', 'I'],
            design: ['A'],
            marketing: ['E', 'A'],
            business: ['E', 'C'],
            education: ['S'],
            health: ['S', 'I'],
          };
          
          const relevantTypes = categoryToRiasec[opportunity.category] || [];
          if (relevantTypes.length > 0 && profile.riasecScores) {
            const scores = relevantTypes.map(type => profile.riasecScores?.[type] || 0);
            const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length;
            interestMatch = Math.min(100, avgScore + 20);
          }
        }

        // Calculate overall with RIASEC bonus
        const overall = Math.min(100, Math.round(
          skillsMatch * 0.30 +
          experienceMatch * 0.20 +
          educationMatch * 0.10 +
          lifestyleMatch * 0.10 +
          keywordsMatch * 0.10 +
          interestMatch * 0.20 +
          riasecBonus
        ));

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
        if (interestMatch < 60 && profile.riasecCode) {
          recommendations.push(
            `Esta oferta no está muy alineada con tu perfil RIASEC (${profile.riasecCode})`
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
            interestMatch,
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
      name: 'moonjab-opportunities-storage',
      partialize: (state) => ({
        applications: state.applications,
        savedOpportunities: state.savedOpportunities,
        cache: state.cache,
      }),
    }
  )
);
