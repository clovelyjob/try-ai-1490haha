import { ProfessionalRole, RolePreferences } from '@/types';

export interface RoleDefinition {
  id: ProfessionalRole;
  label: string;
  icon: string;
  description: string;
  keywords: string[];
  toolKeywords: string[];
  skillKeywords: string[];
  category: 'design' | 'development' | 'management' | 'business' | 'data' | 'finance' | 'marketing' | 'other';
}

export const PROFESSIONAL_ROLES: RoleDefinition[] = [
  {
    id: 'ux_designer',
    label: 'Diseñador UX',
    icon: '🎨',
    description: 'Especializado en experiencia de usuario, investigación y usabilidad',
    keywords: ['ux', 'experiencia', 'usuario', 'usabilidad', 'research', 'investigación', 'wireframes', 'prototipos'],
    toolKeywords: ['figma', 'sketch', 'adobe xd', 'miro', 'optimal workshop', 'useberry'],
    skillKeywords: ['user research', 'usability testing', 'wireframing', 'prototyping', 'user flows'],
    category: 'design'
  },
  {
    id: 'ui_designer',
    label: 'Diseñador UI',
    icon: '🎭',
    description: 'Enfocado en diseño visual, interfaces y sistemas de diseño',
    keywords: ['ui', 'visual', 'interfaz', 'diseño gráfico', 'branding', 'componentes', 'design system'],
    toolKeywords: ['figma', 'sketch', 'adobe illustrator', 'photoshop', 'principle'],
    skillKeywords: ['visual design', 'typography', 'color theory', 'design systems', 'iconography'],
    category: 'design'
  },
  {
    id: 'product_designer',
    label: 'Product Designer',
    icon: '🚀',
    description: 'Combina UX, UI y visión de producto para diseñar experiencias completas',
    keywords: ['product design', 'producto', 'end-to-end', 'estrategia', 'mvp', 'iteración'],
    toolKeywords: ['figma', 'sketch', 'framer', 'principle', 'notion', 'jira'],
    skillKeywords: ['product thinking', 'user research', 'visual design', 'prototyping', 'a/b testing'],
    category: 'design'
  },
  {
    id: 'developer_frontend',
    label: 'Desarrollador Frontend',
    icon: '💻',
    description: 'Especializado en desarrollo de interfaces web y mobile',
    keywords: ['frontend', 'web', 'desarrollo', 'código', 'interfaces', 'responsive', 'componentes'],
    toolKeywords: ['react', 'vue', 'angular', 'javascript', 'typescript', 'html', 'css', 'tailwind'],
    skillKeywords: ['javascript', 'react', 'css', 'html', 'responsive design', 'web performance'],
    category: 'development'
  },
  {
    id: 'developer_backend',
    label: 'Desarrollador Backend',
    icon: '⚙️',
    description: 'Enfocado en APIs, bases de datos y lógica del servidor',
    keywords: ['backend', 'servidor', 'api', 'base de datos', 'arquitectura', 'microservicios'],
    toolKeywords: ['node', 'python', 'java', 'postgresql', 'mongodb', 'redis', 'docker', 'kubernetes'],
    skillKeywords: ['api design', 'databases', 'system design', 'security', 'scalability'],
    category: 'development'
  },
  {
    id: 'developer_fullstack',
    label: 'Desarrollador Fullstack',
    icon: '🔧',
    description: 'Maneja tanto frontend como backend',
    keywords: ['fullstack', 'full stack', 'completo', 'frontend', 'backend', 'end-to-end'],
    toolKeywords: ['react', 'node', 'typescript', 'postgresql', 'mongodb', 'docker'],
    skillKeywords: ['javascript', 'databases', 'api design', 'react', 'system design'],
    category: 'development'
  },
  {
    id: 'project_manager',
    label: 'Project Manager',
    icon: '📊',
    description: 'Gestiona proyectos, equipos y entregables',
    keywords: ['gestión', 'proyectos', 'coordinación', 'planificación', 'stakeholders', 'deadlines'],
    toolKeywords: ['jira', 'asana', 'trello', 'microsoft project', 'notion', 'slack'],
    skillKeywords: ['project management', 'agile', 'scrum', 'stakeholder management', 'risk management'],
    category: 'management'
  },
  {
    id: 'product_manager',
    label: 'Product Manager',
    icon: '🎯',
    description: 'Define la visión y estrategia del producto',
    keywords: ['producto', 'estrategia', 'roadmap', 'priorización', 'métricas', 'kpis', 'mvp'],
    toolKeywords: ['jira', 'productboard', 'amplitude', 'mixpanel', 'figma', 'miro'],
    skillKeywords: ['product strategy', 'roadmap', 'prioritization', 'analytics', 'user stories'],
    category: 'management'
  },
  {
    id: 'data_analyst',
    label: 'Analista de Datos',
    icon: '📈',
    description: 'Analiza datos y genera insights para decisiones de negocio',
    keywords: ['datos', 'análisis', 'métricas', 'insights', 'reportes', 'visualización', 'bi'],
    toolKeywords: ['excel', 'sql', 'tableau', 'power bi', 'python', 'r', 'google analytics'],
    skillKeywords: ['sql', 'data visualization', 'statistics', 'excel', 'business intelligence'],
    category: 'data'
  },
  {
    id: 'data_scientist',
    label: 'Data Scientist',
    icon: '🔬',
    description: 'Especializado en machine learning, modelado predictivo y análisis avanzado',
    keywords: ['ciencia de datos', 'machine learning', 'ml', 'ai', 'modelos', 'predicción', 'algoritmos'],
    toolKeywords: ['python', 'r', 'tensorflow', 'pytorch', 'jupyter', 'spark', 'scikit-learn'],
    skillKeywords: ['machine learning', 'python', 'statistics', 'data modeling', 'deep learning'],
    category: 'data'
  },
  {
    id: 'investor',
    label: 'Inversionista',
    icon: '💰',
    description: 'Gestiona inversiones y análisis financiero',
    keywords: ['inversión', 'finanzas', 'portafolio', 'análisis financiero', 'mercados', 'activos'],
    toolKeywords: ['bloomberg', 'excel', 'python', 'tableau', 'powerpoint'],
    skillKeywords: ['financial analysis', 'portfolio management', 'valuation', 'market research'],
    category: 'finance'
  },
  {
    id: 'hedge_fund',
    label: 'Hedge Fund Manager',
    icon: '📉',
    description: 'Gestiona fondos de inversión con estrategias avanzadas',
    keywords: ['hedge fund', 'trading', 'derivados', 'riesgo', 'estrategias', 'arbitraje'],
    toolKeywords: ['bloomberg', 'python', 'matlab', 'excel', 'risk systems'],
    skillKeywords: ['quantitative analysis', 'risk management', 'trading strategies', 'derivatives'],
    category: 'finance'
  },
  {
    id: 'marketing_manager',
    label: 'Marketing Manager',
    icon: '📣',
    description: 'Gestiona estrategias de marketing y campañas',
    keywords: ['marketing', 'campañas', 'branding', 'digital', 'contenido', 'redes sociales', 'seo'],
    toolKeywords: ['google analytics', 'hubspot', 'mailchimp', 'canva', 'hootsuite', 'semrush'],
    skillKeywords: ['digital marketing', 'content strategy', 'seo', 'social media', 'analytics'],
    category: 'marketing'
  },
  {
    id: 'content_creator',
    label: 'Creador de Contenido',
    icon: '✍️',
    description: 'Crea contenido para múltiples plataformas',
    keywords: ['contenido', 'escritura', 'creación', 'storytelling', 'copywriting', 'social media'],
    toolKeywords: ['notion', 'canva', 'adobe premiere', 'final cut', 'wordpress', 'medium'],
    skillKeywords: ['copywriting', 'storytelling', 'content strategy', 'seo writing', 'social media'],
    category: 'marketing'
  },
  {
    id: 'business_analyst',
    label: 'Business Analyst',
    icon: '📋',
    description: 'Analiza procesos y requisitos de negocio',
    keywords: ['análisis', 'negocio', 'procesos', 'requisitos', 'optimización', 'stakeholders'],
    toolKeywords: ['excel', 'visio', 'jira', 'confluence', 'tableau', 'sql'],
    skillKeywords: ['business analysis', 'requirements gathering', 'process mapping', 'stakeholder management'],
    category: 'business'
  },
  {
    id: 'scrum_master',
    label: 'Scrum Master',
    icon: '🏃',
    description: 'Facilita procesos ágiles y mejora continua del equipo',
    keywords: ['scrum', 'agile', 'facilitación', 'retrospectivas', 'sprints', 'ceremonies'],
    toolKeywords: ['jira', 'miro', 'confluence', 'slack', 'zoom'],
    skillKeywords: ['scrum', 'agile methodologies', 'facilitation', 'team coaching', 'impediment removal'],
    category: 'management'
  },
  {
    id: 'devops',
    label: 'DevOps Engineer',
    icon: '🔄',
    description: 'Gestiona infraestructura, CI/CD y automatización',
    keywords: ['devops', 'infraestructura', 'deployment', 'automatización', 'cloud', 'containers'],
    toolKeywords: ['docker', 'kubernetes', 'jenkins', 'terraform', 'aws', 'azure', 'github actions'],
    skillKeywords: ['ci/cd', 'docker', 'kubernetes', 'cloud platforms', 'infrastructure as code'],
    category: 'development'
  },
  {
    id: 'qa_engineer',
    label: 'QA Engineer',
    icon: '🔍',
    description: 'Asegura la calidad mediante testing y automatización',
    keywords: ['qa', 'testing', 'calidad', 'automatización', 'bugs', 'pruebas'],
    toolKeywords: ['selenium', 'cypress', 'jira', 'postman', 'jest', 'pytest'],
    skillKeywords: ['test automation', 'manual testing', 'bug tracking', 'test planning', 'qa methodologies'],
    category: 'development'
  },
  {
    id: 'other',
    label: 'Otro',
    icon: '🎓',
    description: 'Rol profesional no especificado',
    keywords: [],
    toolKeywords: [],
    skillKeywords: [],
    category: 'other'
  }
];

export interface RoleSuggestion {
  role: ProfessionalRole;
  confidence: number;
  reasons: string[];
}

export function detectRole(preferences: RolePreferences): RoleSuggestion[] {
  const scores: Map<ProfessionalRole, { score: number; reasons: string[] }> = new Map();

  // Inicializar scores
  PROFESSIONAL_ROLES.forEach(role => {
    scores.set(role.id, { score: 0, reasons: [] });
  });

  // Analizar intereses
  preferences.intereses.forEach(interes => {
    const interesLower = interes.toLowerCase();
    PROFESSIONAL_ROLES.forEach(role => {
      const matchingKeywords = role.keywords.filter(keyword => 
        interesLower.includes(keyword.toLowerCase()) || 
        keyword.toLowerCase().includes(interesLower)
      );
      
      if (matchingKeywords.length > 0) {
        const current = scores.get(role.id)!;
        current.score += matchingKeywords.length * 15;
        current.reasons.push(`Interés en ${interes} coincide con ${role.label}`);
      }
    });
  });

  // Analizar objetivos
  preferences.objetivos.forEach(objetivo => {
    const objetivoLower = objetivo.toLowerCase();
    PROFESSIONAL_ROLES.forEach(role => {
      const matchingKeywords = role.keywords.filter(keyword => 
        objetivoLower.includes(keyword.toLowerCase())
      );
      
      if (matchingKeywords.length > 0) {
        const current = scores.get(role.id)!;
        current.score += matchingKeywords.length * 10;
        current.reasons.push(`Objetivo "${objetivo}" alineado con ${role.label}`);
      }
    });
  });

  // Analizar herramientas (muy importante)
  preferences.herramientas.forEach(herramienta => {
    const herramientaLower = herramienta.toLowerCase();
    PROFESSIONAL_ROLES.forEach(role => {
      const matchingTools = role.toolKeywords.filter(tool => 
        herramientaLower.includes(tool.toLowerCase()) || 
        tool.toLowerCase().includes(herramientaLower)
      );
      
      if (matchingTools.length > 0) {
        const current = scores.get(role.id)!;
        current.score += matchingTools.length * 25; // Las herramientas tienen más peso
        current.reasons.push(`Usa ${herramienta}, herramienta clave para ${role.label}`);
      }
    });
  });

  // Convertir a array y ordenar
  const suggestions = Array.from(scores.entries())
    .map(([role, data]) => ({
      role,
      confidence: Math.min(100, Math.round(data.score)),
      reasons: data.reasons.slice(0, 3) // Máximo 3 razones
    }))
    .filter(s => s.confidence > 0)
    .sort((a, b) => b.confidence - a.confidence);

  // Si no hay sugerencias claras, agregar roles genéricos basados en experiencia
  if (suggestions.length === 0 || suggestions[0].confidence < 30) {
    const defaultRoles: ProfessionalRole[] = 
      preferences.nivelExperiencia === 'junior' 
        ? ['ux_designer', 'developer_frontend', 'marketing_manager']
        : preferences.nivelExperiencia === 'mid'
        ? ['product_designer', 'developer_fullstack', 'product_manager']
        : ['product_manager', 'data_scientist', 'project_manager'];

    return defaultRoles.map(role => ({
      role,
      confidence: 50,
      reasons: ['Recomendación basada en tu nivel de experiencia']
    }));
  }

  return suggestions.slice(0, 5);
}

export function getRoleDefinition(role: ProfessionalRole): RoleDefinition | undefined {
  return PROFESSIONAL_ROLES.find(r => r.id === role);
}

export function getRolesByCategory(category: string): RoleDefinition[] {
  return PROFESSIONAL_ROLES.filter(r => r.category === category);
}
