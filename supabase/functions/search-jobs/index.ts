import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const RAPIDAPI_KEY = Deno.env.get('RAPIDAPI_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface JSearchJob {
  job_id: string;
  employer_name: string;
  employer_logo: string | null;
  job_title: string;
  job_description: string;
  job_city: string;
  job_state: string;
  job_country: string;
  job_is_remote: boolean;
  job_employment_type: string;
  job_posted_at_timestamp: number;
  job_offer_expiration_datetime_utc: string | null;
  job_min_salary: number | null;
  job_max_salary: number | null;
  job_salary_currency: string | null;
  job_highlights?: {
    Qualifications?: string[];
    Benefits?: string[];
    Responsibilities?: string[];
  };
  job_required_skills: string[] | null;
  job_apply_link: string;
  job_google_link: string;
}

interface TransformedOpportunity {
  id: string;
  title: string;
  company: string;
  location: string;
  modality: 'remote' | 'hybrid' | 'onsite';
  contractType: 'internship' | 'part-time' | 'full-time' | 'contract';
  description: string;
  requirements: string[];
  benefits: string[];
  tags: string[];
  category: string;
  publishedAt: string;
  expiresAt: string | null;
  salaryRange?: { min: number; max: number; currency: string };
  source: string;
  companyLogo?: string;
  views: number;
  applicantsCount: number;
  applyUrl?: string;
}

// Input sanitization function
function sanitizeSearchInput(input: string): string {
  if (!input || typeof input !== 'string') return '';
  // Remove special characters, keep only alphanumeric, spaces, hyphens, and common punctuation
  return input
    .trim()
    .slice(0, 100) // Maximum 100 characters
    .replace(/[^a-zA-Z0-9\s\-.,áéíóúñÁÉÍÓÚÑüÜ]/g, '');
}

function mapEmploymentType(type: string): 'internship' | 'part-time' | 'full-time' | 'contract' {
  const normalized = type?.toUpperCase() || '';
  if (normalized.includes('INTERN')) return 'internship';
  if (normalized.includes('PART') || normalized.includes('PARTTIME')) return 'part-time';
  if (normalized.includes('CONTRACT') || normalized.includes('CONTRACTOR')) return 'contract';
  return 'full-time';
}

function detectCategory(title: string, description: string): string {
  const text = `${title} ${description}`.toLowerCase();
  if (text.match(/developer|engineer|software|backend|frontend|fullstack|devops|data|cloud|aws|python|javascript|react/)) return 'technology';
  if (text.match(/marketing|seo|content|social media|growth|brand/)) return 'marketing';
  if (text.match(/design|ux|ui|graphic|product design|figma/)) return 'design';
  if (text.match(/business|sales|account|finance|consulting/)) return 'business';
  if (text.match(/teacher|education|training|instructor/)) return 'education';
  if (text.match(/health|medical|nurse|doctor|healthcare/)) return 'health';
  return 'other';
}

function extractSkillsFromText(text: string): string[] {
  const skillPatterns = [
    'react', 'javascript', 'typescript', 'python', 'java', 'node.js', 'nodejs',
    'sql', 'aws', 'docker', 'kubernetes', 'git', 'html', 'css', 'figma',
    'excel', 'photoshop', 'illustrator', 'salesforce', 'tableau', 'power bi',
    'angular', 'vue', 'next.js', 'express', 'mongodb', 'postgresql', 'mysql',
    'agile', 'scrum', 'jira', 'confluence', 'slack', 'teams', 'zoom'
  ];
  
  const foundSkills: string[] = [];
  const lowerText = text.toLowerCase();
  
  for (const skill of skillPatterns) {
    if (lowerText.includes(skill)) {
      foundSkills.push(skill.charAt(0).toUpperCase() + skill.slice(1));
    }
  }
  
  return [...new Set(foundSkills)].slice(0, 10);
}

function transformJob(job: JSearchJob): TransformedOpportunity {
  const location = [job.job_city, job.job_state, job.job_country]
    .filter(Boolean)
    .join(', ') || 'Location not specified';

  const requirements = job.job_highlights?.Qualifications || [];
  const benefits = job.job_highlights?.Benefits || [];
  const tags = job.job_required_skills || extractSkillsFromText(job.job_description);

  return {
    id: job.job_id,
    title: job.job_title,
    company: job.employer_name,
    location: job.job_is_remote ? `Remoto - ${location}` : location,
    modality: job.job_is_remote ? 'remote' : 'onsite',
    contractType: mapEmploymentType(job.job_employment_type),
    description: job.job_description?.slice(0, 2000) || 'No description available',
    requirements: requirements.slice(0, 10),
    benefits: benefits.slice(0, 8),
    tags: tags.slice(0, 8),
    category: detectCategory(job.job_title, job.job_description),
    publishedAt: job.job_posted_at_timestamp 
      ? new Date(job.job_posted_at_timestamp * 1000).toISOString()
      : new Date().toISOString(),
    expiresAt: job.job_offer_expiration_datetime_utc || null,
    salaryRange: job.job_min_salary && job.job_max_salary ? {
      min: job.job_min_salary,
      max: job.job_max_salary,
      currency: job.job_salary_currency || 'USD'
    } : undefined,
    source: 'JSearch',
    companyLogo: job.employer_logo || undefined,
    views: Math.floor(Math.random() * 500) + 50,
    applicantsCount: Math.floor(Math.random() * 50) + 5,
    applyUrl: job.job_apply_link || job.job_google_link,
  };
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Authenticate user
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return new Response(
        JSON.stringify({ error: "No autorizado. Por favor inicia sesión.", data: [] }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      {
        global: {
          headers: { Authorization: authHeader },
        },
      }
    );

    const token = authHeader.replace('Bearer ', '');
    const { data: claimsData, error: authError } = await supabaseClient.auth.getClaims(token);
    if (authError || !claimsData?.claims) {
      return new Response(
        JSON.stringify({ error: "No autorizado. Por favor inicia sesión.", data: [] }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const userId = claimsData.claims.sub;

    const url = new URL(req.url);
    
    // Sanitize and validate inputs
    const query = sanitizeSearchInput(url.searchParams.get('query') || 'developer') || 'developer';
    const location = sanitizeSearchInput(url.searchParams.get('location') || '');
    const page = Math.min(Math.max(parseInt(url.searchParams.get('page') || '1') || 1, 1), 10); // Limit pages 1-10
    const employment_types = sanitizeSearchInput(url.searchParams.get('employment_types') || '');
    const remote_only = url.searchParams.get('remote_only') === 'true';
    const date_posted = ['all', 'today', '3days', 'week', 'month'].includes(url.searchParams.get('date_posted') || 'all') 
      ? url.searchParams.get('date_posted') 
      : 'all';

    if (!RAPIDAPI_KEY) {
      console.error('[Internal] API key not configured');
      return new Response(
        JSON.stringify({ error: 'Error de configuración del servicio.', data: [] }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Build JSearch API URL
    const searchParams = new URLSearchParams({
      query: location ? `${query} in ${location}` : query,
      page: page.toString(),
      num_pages: '1',
    });

    if (employment_types) {
      searchParams.set('employment_types', employment_types);
    }
    if (remote_only) {
      searchParams.set('remote_jobs_only', 'true');
    }
    if (date_posted && date_posted !== 'all') {
      searchParams.set('date_posted', date_posted);
    }

    console.log(`[${userId}] Searching jobs: query="${query}", location="${location}", page=${page}`);

    const response = await fetch(
      `https://jsearch.p.rapidapi.com/search?${searchParams.toString()}`,
      {
        method: 'GET',
        headers: {
          'X-RapidAPI-Key': RAPIDAPI_KEY,
          'X-RapidAPI-Host': 'jsearch.p.rapidapi.com',
        },
      }
    );

    if (!response.ok) {
      const statusCode = response.status;
      console.error(`[Internal] External API error: ${statusCode}`);
      
      if (statusCode === 429) {
        return new Response(
          JSON.stringify({ 
            error: 'Demasiadas solicitudes. Por favor espera unos momentos.',
            data: []
          }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      return new Response(
        JSON.stringify({ error: 'Error al buscar oportunidades. Por favor intenta de nuevo.', data: [] }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const result = await response.json();
    
    if (result.status !== 'OK' || !result.data) {
      console.error('[Internal] External API returned invalid response');
      return new Response(
        JSON.stringify({ error: 'Error al procesar resultados.', data: [] }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const transformedJobs = result.data.map(transformJob);
    
    console.log(`[${userId}] Found ${transformedJobs.length} jobs`);

    return new Response(
      JSON.stringify({ 
        data: transformedJobs,
        totalResults: transformedJobs.length,
        page,
        hasMore: result.data.length >= 10
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('[Internal] Error in search-jobs function:', error);
    return new Response(
      JSON.stringify({ error: 'Error en el servicio. Por favor intenta de nuevo.', data: [] }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
