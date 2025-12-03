// Holland RIASEC Scoring Algorithm
import { RIASECType, RIASEC_TYPE_INFO } from './riasecQuestions';

export interface RIASECScores {
  R: number;
  I: number;
  A: number;
  S: number;
  E: number;
  C: number;
}

export interface RIASECResult {
  scores: RIASECScores;
  percentages: RIASECScores;
  hollandCode: string;
  topTypes: { type: RIASECType; score: number; percentage: number }[];
  compatibleRoles: { role: string; compatibility: number; description: string }[];
}

// Answer values: 2 = Like, 1 = Neutral, 0 = Dislike
export type AnswerValue = 0 | 1 | 2;

// Calculate raw scores by summing answers for each type
export function calculateRIASECScores(
  answers: Record<string, AnswerValue>
): RIASECScores {
  const scores: RIASECScores = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };
  
  Object.entries(answers).forEach(([questionId, value]) => {
    const type = questionId.charAt(0) as RIASECType;
    if (scores.hasOwnProperty(type)) {
      scores[type] += value;
    }
  });
  
  return scores;
}

// Convert raw scores to percentages (max possible per type = 14)
export function scoresToPercentages(scores: RIASECScores): RIASECScores {
  const maxScore = 14; // 7 questions × 2 points max
  return {
    R: Math.round((scores.R / maxScore) * 100),
    I: Math.round((scores.I / maxScore) * 100),
    A: Math.round((scores.A / maxScore) * 100),
    S: Math.round((scores.S / maxScore) * 100),
    E: Math.round((scores.E / maxScore) * 100),
    C: Math.round((scores.C / maxScore) * 100),
  };
}

// Get Holland Code (top 3 types sorted by score)
export function getHollandCode(scores: RIASECScores): string {
  const sortedTypes = (Object.entries(scores) as [RIASECType, number][])
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([type]) => type);
  
  return sortedTypes.join('');
}

// Role to RIASEC mapping with descriptions
export const ROLE_RIASEC_MAP: Record<string, { codes: string[]; description: string }> = {
  // Tech roles
  'Software Engineer': { codes: ['IRC', 'IRA', 'ICR'], description: 'Desarrolla software y aplicaciones' },
  'Data Scientist': { codes: ['IAS', 'IAC', 'IRC'], description: 'Analiza datos para generar insights' },
  'Product Designer': { codes: ['AIE', 'AIS', 'ASE'], description: 'Diseña experiencias de usuario' },
  'UX Researcher': { codes: ['ISA', 'IAS', 'SAI'], description: 'Investiga necesidades de usuarios' },
  'DevOps Engineer': { codes: ['IRC', 'RIC', 'ICR'], description: 'Gestiona infraestructura y despliegues' },
  'Frontend Developer': { codes: ['IAR', 'AIR', 'ARI'], description: 'Construye interfaces de usuario' },
  'Backend Developer': { codes: ['IRC', 'ICR', 'RIC'], description: 'Desarrolla servidores y APIs' },
  'Mobile Developer': { codes: ['IRA', 'AIR', 'RAI'], description: 'Crea aplicaciones móviles' },
  'QA Engineer': { codes: ['CIR', 'ICR', 'RCI'], description: 'Asegura calidad del software' },
  'Data Engineer': { codes: ['IRC', 'ICR', 'CIR'], description: 'Construye pipelines de datos' },
  'Machine Learning Engineer': { codes: ['IRA', 'IAR', 'RIA'], description: 'Desarrolla modelos de IA' },
  'Cybersecurity Analyst': { codes: ['IRC', 'ICR', 'CIR'], description: 'Protege sistemas e información' },
  
  // Business roles
  'Product Manager': { codes: ['EIS', 'ESI', 'SEI'], description: 'Lidera desarrollo de productos' },
  'Project Manager': { codes: ['ESC', 'SEC', 'CES'], description: 'Gestiona proyectos y equipos' },
  'Business Analyst': { codes: ['ICE', 'EIC', 'CEI'], description: 'Analiza procesos de negocio' },
  'Marketing Manager': { codes: ['ESA', 'EAS', 'AES'], description: 'Lidera estrategias de marketing' },
  'Sales Manager': { codes: ['ESC', 'ECS', 'SEC'], description: 'Dirige equipos de ventas' },
  'Account Manager': { codes: ['ESC', 'SEC', 'CES'], description: 'Gestiona relaciones con clientes' },
  'Operations Manager': { codes: ['ECS', 'CES', 'SEC'], description: 'Optimiza operaciones empresariales' },
  'Financial Analyst': { codes: ['CIE', 'ICE', 'ECI'], description: 'Analiza datos financieros' },
  'HR Manager': { codes: ['SEC', 'ESC', 'CSE'], description: 'Gestiona talento humano' },
  'Strategy Consultant': { codes: ['EIA', 'IEA', 'AEI'], description: 'Asesora en estrategia empresarial' },
  
  // Creative roles
  'Graphic Designer': { codes: ['AIR', 'ARI', 'RAI'], description: 'Crea diseños visuales' },
  'Content Creator': { codes: ['AES', 'ASE', 'SAE'], description: 'Produce contenido multimedia' },
  'Copywriter': { codes: ['AIS', 'ASI', 'SAI'], description: 'Escribe textos persuasivos' },
  'Video Producer': { codes: ['AER', 'ARE', 'EAR'], description: 'Produce contenido audiovisual' },
  'Brand Manager': { codes: ['AES', 'EAS', 'SAE'], description: 'Gestiona identidad de marca' },
  'Art Director': { codes: ['AES', 'ASE', 'EAS'], description: 'Dirige proyectos creativos' },
  'UI Designer': { codes: ['AIC', 'AIR', 'IAC'], description: 'Diseña interfaces visuales' },
  
  // Social/Service roles
  'Customer Success Manager': { codes: ['SEC', 'ESC', 'CSE'], description: 'Asegura éxito del cliente' },
  'Community Manager': { codes: ['SAE', 'ASE', 'ESA'], description: 'Gestiona comunidades online' },
  'Technical Support': { codes: ['SRC', 'RSC', 'CRS'], description: 'Brinda soporte técnico' },
  'Training Specialist': { codes: ['SAI', 'SIA', 'ASI'], description: 'Capacita y entrena equipos' },
  'Recruiter': { codes: ['ESC', 'SEC', 'CES'], description: 'Atrae y selecciona talento' },
  
  // Research/Academic
  'Research Scientist': { codes: ['IAR', 'IRA', 'AIR'], description: 'Investiga y publica hallazgos' },
  'Market Researcher': { codes: ['IEC', 'ICE', 'EIC'], description: 'Investiga mercados y consumidores' },
  'Policy Analyst': { codes: ['IES', 'ISE', 'EIS'], description: 'Analiza políticas públicas' },
  
  // Entrepreneurship
  'Startup Founder': { codes: ['EIA', 'EAI', 'IEA'], description: 'Funda y lidera startups' },
  'Growth Hacker': { codes: ['EIA', 'IEA', 'AEI'], description: 'Acelera crecimiento empresarial' },
  'Venture Capitalist': { codes: ['EIC', 'ICE', 'CEI'], description: 'Invierte en startups' },
};

// Calculate compatibility between user's Holland code and a role
function calculateCompatibility(userCode: string, roleCodes: string[]): number {
  let maxCompatibility = 0;
  
  for (const roleCode of roleCodes) {
    let compatibility = 0;
    const userLetters = userCode.split('');
    const roleLetters = roleCode.split('');
    
    // Primary match (first letter) = 50 points
    if (userLetters[0] === roleLetters[0]) compatibility += 50;
    else if (userLetters.includes(roleLetters[0])) compatibility += 30;
    
    // Secondary match (second letter) = 30 points
    if (userLetters[1] === roleLetters[1]) compatibility += 30;
    else if (userLetters.includes(roleLetters[1])) compatibility += 20;
    
    // Tertiary match (third letter) = 20 points
    if (userLetters[2] === roleLetters[2]) compatibility += 20;
    else if (userLetters.includes(roleLetters[2])) compatibility += 10;
    
    maxCompatibility = Math.max(maxCompatibility, compatibility);
  }
  
  return maxCompatibility;
}

// Get compatible roles sorted by compatibility
export function getCompatibleRoles(
  hollandCode: string,
  limit: number = 10
): { role: string; compatibility: number; description: string }[] {
  const rolesWithCompatibility = Object.entries(ROLE_RIASEC_MAP)
    .map(([role, { codes, description }]) => ({
      role,
      compatibility: calculateCompatibility(hollandCode, codes),
      description,
    }))
    .filter(r => r.compatibility > 0)
    .sort((a, b) => b.compatibility - a.compatibility)
    .slice(0, limit);
  
  return rolesWithCompatibility;
}

// Main function to analyze RIASEC results
export function analyzeRIASECResults(
  answers: Record<string, AnswerValue>
): RIASECResult {
  const scores = calculateRIASECScores(answers);
  const percentages = scoresToPercentages(scores);
  const hollandCode = getHollandCode(scores);
  
  const topTypes = (Object.entries(scores) as [RIASECType, number][])
    .sort((a, b) => b[1] - a[1])
    .map(([type, score]) => ({
      type,
      score,
      percentage: percentages[type],
    }));
  
  const compatibleRoles = getCompatibleRoles(hollandCode);
  
  return {
    scores,
    percentages,
    hollandCode,
    topTypes,
    compatibleRoles,
  };
}

// Get interpretation text for Holland code
export function getHollandCodeInterpretation(hollandCode: string): string {
  const types = hollandCode.split('') as RIASECType[];
  const primary = RIASEC_TYPE_INFO[types[0]];
  const secondary = RIASEC_TYPE_INFO[types[1]];
  const tertiary = RIASEC_TYPE_INFO[types[2]];
  
  return `Tu perfil principal es **${primary.name}** (${primary.description}), 
complementado por rasgos **${secondary.name}** (${secondary.description}) 
y **${tertiary.name}** (${tertiary.description}). 
Esta combinación única te hace ideal para roles que combinen estas tres dimensiones.`;
}
