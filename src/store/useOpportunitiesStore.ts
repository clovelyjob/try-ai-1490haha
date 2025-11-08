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

interface OpportunitiesState {
  opportunities: Opportunity[];
  applications: Application[];
  savedOpportunities: SavedOpportunity[];
  filters: {
    search: string;
    category: string[];
    modality: string[];
    contractType: string[];
    location: string;
  };
  
  // Actions
  loadOpportunities: () => void;
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

// Mock data generator
const generateMockOpportunities = (): Opportunity[] => [
  {
    id: '1',
    title: 'Desarrollador Frontend React - Práctica',
    company: 'TechCorp',
    location: 'Lima, Perú',
    modality: 'hybrid',
    contractType: 'internship',
    description: 'Buscamos un desarrollador frontend apasionado para unirse a nuestro equipo. Trabajarás en proyectos reales con React, TypeScript y TailwindCSS.',
    requirements: ['React', 'TypeScript', 'HTML/CSS', 'Git', 'Inglés intermedio'],
    benefits: ['Horario flexible', 'Ambiente colaborativo', 'Mentoría constante'],
    tags: ['React', 'Frontend', 'TypeScript', 'TailwindCSS'],
    category: 'technology',
    publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    salaryRange: { min: 1000, max: 1500, currency: 'PEN' },
    source: 'Clovely',
    views: 245,
    applicantsCount: 18,
  },
  {
    id: '2',
    title: 'Diseñador UX/UI Junior',
    company: 'DesignStudio',
    location: 'Remoto',
    modality: 'remote',
    contractType: 'full-time',
    description: 'Estamos buscando un diseñador UX/UI creativo para crear experiencias digitales increíbles. Trabajarás con Figma, realizarás investigación de usuarios y colaborarás con desarrolladores.',
    requirements: ['Figma', 'Adobe Creative Suite', 'Investigación de usuarios', 'Prototipos', 'Portfolio'],
    benefits: ['100% remoto', 'Equipamiento', 'Capacitaciones', 'Días de salud mental'],
    tags: ['UX', 'UI', 'Figma', 'Design'],
    category: 'design',
    publishedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    expiresAt: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString(),
    salaryRange: { min: 2000, max: 3000, currency: 'USD' },
    source: 'Employer',
    views: 412,
    applicantsCount: 34,
  },
  {
    id: '3',
    title: 'Analista de Marketing Digital - Práctica',
    company: 'Marketing Pro',
    location: 'Buenos Aires, Argentina',
    modality: 'onsite',
    contractType: 'internship',
    description: 'Únete a nuestro equipo de marketing digital y aprende sobre SEO, SEM, redes sociales y analytics. Trabajarás con herramientas como Google Analytics, Meta Ads y más.',
    requirements: ['Google Analytics', 'Redes sociales', 'Excel', 'Redacción', 'Análisis de datos'],
    benefits: ['Certificaciones gratuitas', 'Networking', 'Crecimiento profesional'],
    tags: ['Marketing', 'Digital', 'SEO', 'Analytics'],
    category: 'marketing',
    publishedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    expiresAt: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000).toISOString(),
    salaryRange: { min: 800, max: 1200, currency: 'USD' },
    source: 'Partner',
    views: 189,
    applicantsCount: 12,
  },
  {
    id: '4',
    title: 'Data Analyst Intern',
    company: 'DataCorp',
    location: 'Ciudad de México',
    modality: 'hybrid',
    contractType: 'internship',
    description: 'Aprende análisis de datos con Python, SQL y herramientas de visualización. Trabajarás en proyectos reales analizando datos de clientes y creando dashboards.',
    requirements: ['Python', 'SQL', 'Excel avanzado', 'Estadística básica', 'Visualización de datos'],
    benefits: ['Mentoría 1-on-1', 'Proyectos reales', 'Posibilidad de contratación'],
    tags: ['Data', 'Python', 'SQL', 'Analytics'],
    category: 'technology',
    publishedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    expiresAt: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000).toISOString(),
    salaryRange: { min: 1200, max: 1800, currency: 'USD' },
    source: 'Clovely',
    views: 301,
    applicantsCount: 25,
  },
  {
    id: '5',
    title: 'Desarrollador Full Stack - Node.js & React',
    company: 'StartupTech',
    location: 'Remoto - LATAM',
    modality: 'remote',
    contractType: 'full-time',
    description: 'Buscamos un desarrollador full stack con experiencia en Node.js y React para construir productos innovadores. Stack moderno con PostgreSQL, TypeScript y AWS.',
    requirements: ['Node.js', 'React', 'PostgreSQL', 'TypeScript', 'Docker', '2+ años de experiencia'],
    benefits: ['100% remoto', 'Equipo internacional', 'Stock options', 'Budget para cursos'],
    tags: ['Full Stack', 'Node.js', 'React', 'PostgreSQL'],
    category: 'technology',
    publishedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    expiresAt: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000).toISOString(),
    salaryRange: { min: 3000, max: 5000, currency: 'USD' },
    source: 'Employer',
    views: 567,
    applicantsCount: 45,
  },
];

export const useOpportunitiesStore = create<OpportunitiesState>()(
  persist(
    (set, get) => ({
      opportunities: [],
      applications: [],
      savedOpportunities: [],
      filters: {
        search: '',
        category: [],
        modality: [],
        contractType: [],
        location: '',
      },

      loadOpportunities: () => {
        const stored = localStorage.getItem('clovely_opportunities');
        if (!stored) {
          const mockData = generateMockOpportunities();
          set({ opportunities: mockData });
          localStorage.setItem('clovely_opportunities', JSON.stringify(mockData));
        } else {
          set({ opportunities: JSON.parse(stored) });
        }
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
        // Mock matching algorithm
        const userSkills = [
          ...profile.skills.technical.map((s) => s.name.toLowerCase()),
          ...profile.skills.tools.map((t) => t.toLowerCase()),
        ];
        const requiredSkills = opportunity.requirements.map((r) => r.toLowerCase());

        // Skills match
        const matchingSkills = requiredSkills.filter((req) =>
          userSkills.some((skill) => skill.includes(req) || req.includes(skill))
        );
        const skillsMatch = Math.round((matchingSkills.length / requiredSkills.length) * 100);

        // Experience match (based on profile experience level)
        const experienceLevels = {
          student: 0,
          graduate: 1,
          junior: 2,
          mid: 3,
          senior: 4,
        };
        const userLevel = experienceLevels[profile.experience] || 0;
        const requiredLevel = opportunity.contractType === 'internship' ? 0 : 2;
        const experienceMatch = Math.max(0, 100 - Math.abs(userLevel - requiredLevel) * 20);

        // Education match
        const educationMatch = cv?.education.length ? 85 : 60;

        // Lifestyle match (work modality preference)
        const lifestyleMatch = profile.workStyle.modality === opportunity.modality ? 100 : 70;

        // Keywords match
        const cvText = cv
          ? `${cv.summary} ${cv.experience.map((e) => e.bullets.map((b) => b.text).join(' ')).join(' ')}`
          : '';
        const keywordMatches = opportunity.tags.filter((tag) =>
          cvText.toLowerCase().includes(tag.toLowerCase())
        ).length;
        const keywordsMatch = opportunity.tags.length
          ? Math.round((keywordMatches / opportunity.tags.length) * 100)
          : 50;

        // Overall weighted score
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
            'Agrega más proyectos o experiencias relevantes a tu CV para demostrar experiencia práctica'
          );
        }
        if (recommendations.length === 0) {
          recommendations.push('¡Excelente match! Tu perfil está bien alineado con esta oportunidad.');
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
