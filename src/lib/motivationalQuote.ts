import { supabase } from '@/integrations/supabase/client';

interface UserContext {
  name: string;
  level: number;
  streak: number;
  tasksCompleted: number;
  totalGoals: number;
  role?: string;
}

const CACHE_KEY = 'moonjab_last_quote';
const CACHE_DURATION = 6 * 60 * 60 * 1000; // 6 hours

interface CachedQuote {
  text: string;
  timestamp: number;
}

export async function getMotivationalQuote(context: UserContext): Promise<string> {
  // Check cache first
  const cached = localStorage.getItem(CACHE_KEY);
  if (cached) {
    try {
      const { text, timestamp }: CachedQuote = JSON.parse(cached);
      const now = Date.now();
      if (now - timestamp < CACHE_DURATION) {
        return text;
      }
    } catch (e) {
      console.error('Error parsing cached quote:', e);
    }
  }

  // Generate new quote with AI
  try {
    const prompt = buildPrompt(context);
    
    const { data, error } = await supabase.functions.invoke('career-coach-chat', {
      body: { 
        messages: [
          { role: 'system', content: 'Eres Clovy, un coach motivacional profesional. Genera frases cortas (máximo 12 palabras), inspiradoras y naturales.' },
          { role: 'user', content: prompt }
        ]
      }
    });

    if (error) throw error;

    const quote = data?.message || getFallbackQuote(context);

    // Cache the new quote
    const cacheData: CachedQuote = {
      text: quote,
      timestamp: Date.now()
    };
    localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));

    return quote;
  } catch (error) {
    console.error('Error generating motivational quote:', error);
    return getFallbackQuote(context);
  }
}

function buildPrompt(context: UserContext): string {
  const parts: string[] = [];

  // Add personalized context
  parts.push(`Genera una frase motivacional para ${context.name}.`);
  
  if (context.streak > 10) {
    parts.push(`Lleva ${context.streak} días de racha activa.`);
  } else if (context.streak > 0) {
    parts.push(`Tiene una racha de ${context.streak} días.`);
  }

  if (context.level >= 3) {
    parts.push(`Ha alcanzado el nivel ${context.level}.`);
  }

  if (context.tasksCompleted > 15) {
    parts.push(`Completó ${context.tasksCompleted} tareas esta semana.`);
  } else if (context.tasksCompleted < 5) {
    parts.push('Está empezando su semana de tareas.');
  }

  if (context.totalGoals > 0) {
    parts.push(`Tiene ${context.totalGoals} objetivos activos.`);
  }

  if (context.role) {
    parts.push(`Su rol es ${context.role}.`);
  }

  parts.push('Responde SOLO con la frase motivacional, sin comillas ni formato adicional.');

  return parts.join(' ');
}

function getFallbackQuote(context: UserContext): string {
  const quotes = [
    `${context.name}, cada paso cuenta en tu camino profesional`,
    'El progreso es la suma de pequeños esfuerzos diarios',
    'Tu consistencia está construyendo tu futuro',
    'Hoy es un excelente día para avanzar',
    'Pequeñas acciones hoy, grandes resultados mañana',
  ];

  // Use streak as seed for pseudo-random selection
  const index = (context.streak + context.level) % quotes.length;
  return quotes[index];
}

export function clearQuoteCache(): void {
  localStorage.removeItem(CACHE_KEY);
}
