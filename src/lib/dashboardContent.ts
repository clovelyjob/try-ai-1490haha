import { ProfessionalRole } from '@/types';
import { 
  Palette, Code, Briefcase, BarChart3, TrendingUp, 
  Users, Megaphone, FileText, Shield, GitBranch, 
  Bug, DollarSign
} from 'lucide-react';

export interface RoleDashboardConfig {
  welcomeMessage: string;
  metrics: {
    id: string;
    label: string;
    icon: any;
    description: string;
  }[];
  suggestedTasks: {
    title: string;
    xp: number;
    category: string;
  }[];
  resources: {
    type: string;
    title: string;
    duration: string;
    icon: string;
  }[];
}

export function getDashboardConfig(role: ProfessionalRole): RoleDashboardConfig {
  const configs: Record<ProfessionalRole, RoleDashboardConfig> = {
    ux_designer: {
      welcomeMessage: 'Diseña experiencias que impacten',
      metrics: [
        { id: 'research', label: 'User Research', icon: Users, description: 'Entrevistas y tests de usabilidad completados' },
        { id: 'prototypes', label: 'Prototipos', icon: Palette, description: 'Wireframes y prototipos creados' },
        { id: 'feedback', label: 'Feedback', icon: TrendingUp, description: 'Sesiones de feedback y validación' },
        { id: 'portfolio', label: 'Portfolio', icon: Briefcase, description: 'Proyectos documentados en portfolio' },
      ],
      suggestedTasks: [
        { title: 'Realizar entrevista de usuario', xp: 100, category: 'research' },
        { title: 'Crear wireframes de nueva funcionalidad', xp: 80, category: 'design' },
        { title: 'Documentar caso de estudio en portfolio', xp: 120, category: 'portfolio' },
        { title: 'Test de usabilidad con 5 usuarios', xp: 150, category: 'testing' },
      ],
      resources: [
        { type: 'Curso', title: 'Advanced User Research Methods', duration: '3h', icon: '🔍' },
        { type: 'Artículo', title: 'Mejores prácticas en diseño de interfaces', duration: '15min', icon: '📚' },
        { type: 'Video', title: 'Cómo crear un portfolio que destaque', duration: '25min', icon: '🎥' },
      ]
    },
    ui_designer: {
      welcomeMessage: 'Crea interfaces visuales impactantes',
      metrics: [
        { id: 'designs', label: 'Diseños', icon: Palette, description: 'Interfaces y componentes diseñados' },
        { id: 'system', label: 'Design System', icon: GitBranch, description: 'Componentes en sistema de diseño' },
        { id: 'mockups', label: 'Mockups', icon: FileText, description: 'Mockups de alta fidelidad' },
        { id: 'icons', label: 'Iconografía', icon: Palette, description: 'Sets de iconos creados' },
      ],
      suggestedTasks: [
        { title: 'Diseñar componentes de UI para landing', xp: 90, category: 'design' },
        { title: 'Crear guía de estilos visual', xp: 110, category: 'system' },
        { title: 'Actualizar tokens de diseño', xp: 70, category: 'system' },
        { title: 'Diseñar set de iconos personalizado', xp: 100, category: 'icons' },
      ],
      resources: [
        { type: 'Curso', title: 'Design Systems Fundamentals', duration: '4h', icon: '🎨' },
        { type: 'Artículo', title: 'Teoría del color aplicada a UI', duration: '12min', icon: '🎨' },
        { type: 'Herramienta', title: 'Plugins esenciales de Figma', duration: '10min', icon: '🔧' },
      ]
    },
    product_designer: {
      welcomeMessage: 'Diseña productos de extremo a extremo',
      metrics: [
        { id: 'features', label: 'Features', icon: Briefcase, description: 'Features diseñadas end-to-end' },
        { id: 'mvp', label: 'MVP', icon: TrendingUp, description: 'Validaciones de producto' },
        { id: 'metrics', label: 'Métricas', icon: BarChart3, description: 'A/B tests y análisis' },
        { id: 'strategy', label: 'Estrategia', icon: Briefcase, description: 'Documentos de estrategia' },
      ],
      suggestedTasks: [
        { title: 'Definir MVP de nueva funcionalidad', xp: 130, category: 'strategy' },
        { title: 'Diseñar flujo completo de onboarding', xp: 140, category: 'design' },
        { title: 'Analizar métricas de conversión', xp: 90, category: 'analytics' },
        { title: 'Crear propuesta de mejora de producto', xp: 120, category: 'strategy' },
      ],
      resources: [
        { type: 'Curso', title: 'Product Thinking para Diseñadores', duration: '5h', icon: '🚀' },
        { type: 'Artículo', title: 'Cómo priorizar features con RICE', duration: '20min', icon: '📊' },
        { type: 'Video', title: 'Product Design Portfolio Review', duration: '30min', icon: '🎥' },
      ]
    },
    developer_frontend: {
      welcomeMessage: 'Construye interfaces web increíbles',
      metrics: [
        { id: 'components', label: 'Componentes', icon: Code, description: 'Componentes reutilizables creados' },
        { id: 'features', label: 'Features', icon: GitBranch, description: 'Features implementadas' },
        { id: 'performance', label: 'Performance', icon: TrendingUp, description: 'Score de optimización' },
        { id: 'tests', label: 'Tests', icon: Bug, description: 'Cobertura de testing' },
      ],
      suggestedTasks: [
        { title: 'Implementar nuevo componente reutilizable', xp: 100, category: 'development' },
        { title: 'Optimizar rendimiento de aplicación', xp: 120, category: 'performance' },
        { title: 'Agregar tests unitarios', xp: 80, category: 'testing' },
        { title: 'Refactorizar código legacy', xp: 110, category: 'refactor' },
      ],
      resources: [
        { type: 'Curso', title: 'React Performance Optimization', duration: '4h', icon: '⚡' },
        { type: 'Artículo', title: 'Clean Code en JavaScript', duration: '18min', icon: '💻' },
        { type: 'Video', title: 'Modern CSS Techniques', duration: '35min', icon: '🎨' },
      ]
    },
    developer_backend: {
      welcomeMessage: 'Construye APIs robustas y escalables',
      metrics: [
        { id: 'apis', label: 'APIs', icon: Code, description: 'Endpoints creados' },
        { id: 'database', label: 'Database', icon: BarChart3, description: 'Optimizaciones de BD' },
        { id: 'security', label: 'Seguridad', icon: Shield, description: 'Vulnerabilidades resueltas' },
        { id: 'scale', label: 'Escalabilidad', icon: TrendingUp, description: 'Mejoras de performance' },
      ],
      suggestedTasks: [
        { title: 'Diseñar API RESTful para nueva feature', xp: 120, category: 'api' },
        { title: 'Optimizar queries de base de datos', xp: 100, category: 'database' },
        { title: 'Implementar autenticación JWT', xp: 130, category: 'security' },
        { title: 'Configurar cache con Redis', xp: 110, category: 'performance' },
      ],
      resources: [
        { type: 'Curso', title: 'Microservices Architecture', duration: '6h', icon: '🏗️' },
        { type: 'Artículo', title: 'Database Indexing Best Practices', duration: '25min', icon: '📊' },
        { type: 'Video', title: 'API Security Fundamentals', duration: '40min', icon: '🔒' },
      ]
    },
    developer_fullstack: {
      welcomeMessage: 'Domina el desarrollo completo',
      metrics: [
        { id: 'frontend', label: 'Frontend', icon: Code, description: 'Features de interfaz' },
        { id: 'backend', label: 'Backend', icon: GitBranch, description: 'Servicios y APIs' },
        { id: 'integration', label: 'Integración', icon: TrendingUp, description: 'Integraciones completas' },
        { id: 'deployment', label: 'Deployment', icon: Shield, description: 'Deploys exitosos' },
      ],
      suggestedTasks: [
        { title: 'Implementar feature end-to-end', xp: 150, category: 'fullstack' },
        { title: 'Configurar CI/CD pipeline', xp: 120, category: 'devops' },
        { title: 'Crear API y consumirla en frontend', xp: 130, category: 'integration' },
        { title: 'Optimizar aplicación completa', xp: 140, category: 'performance' },
      ],
      resources: [
        { type: 'Curso', title: 'Full-Stack Development Masterclass', duration: '8h', icon: '🔧' },
        { type: 'Artículo', title: 'Modern Full-Stack Architecture', duration: '30min', icon: '🏗️' },
        { type: 'Video', title: 'DevOps for Developers', duration: '45min', icon: '⚙️' },
      ]
    },
    project_manager: {
      welcomeMessage: 'Lidera proyectos al éxito',
      metrics: [
        { id: 'projects', label: 'Proyectos', icon: Briefcase, description: 'Proyectos completados' },
        { id: 'teams', label: 'Equipos', icon: Users, description: 'Miembros gestionados' },
        { id: 'deadlines', label: 'Entregas', icon: TrendingUp, description: 'On-time delivery rate' },
        { id: 'stakeholders', label: 'Stakeholders', icon: Users, description: 'Reuniones efectivas' },
      ],
      suggestedTasks: [
        { title: 'Crear roadmap trimestral', xp: 120, category: 'planning' },
        { title: 'Facilitar retrospectiva de equipo', xp: 80, category: 'team' },
        { title: 'Presentación a stakeholders', xp: 100, category: 'communication' },
        { title: 'Gestión de riesgos del proyecto', xp: 110, category: 'risk' },
      ],
      resources: [
        { type: 'Curso', title: 'Agile Project Management', duration: '5h', icon: '📊' },
        { type: 'Artículo', title: 'Stakeholder Management Best Practices', duration: '20min', icon: '👥' },
        { type: 'Herramienta', title: 'Jira para PMs efectivos', duration: '25min', icon: '🔧' },
      ]
    },
    product_manager: {
      welcomeMessage: 'Define la visión del producto',
      metrics: [
        { id: 'roadmap', label: 'Roadmap', icon: Briefcase, description: 'Features planeadas' },
        { id: 'metrics', label: 'Métricas', icon: BarChart3, description: 'KPIs monitoreados' },
        { id: 'mvp', label: 'MVP', icon: TrendingUp, description: 'Validaciones lanzadas' },
        { id: 'insights', label: 'Insights', icon: Users, description: 'User research completado' },
      ],
      suggestedTasks: [
        { title: 'Definir OKRs del trimestre', xp: 140, category: 'strategy' },
        { title: 'Priorizar backlog con RICE', xp: 100, category: 'prioritization' },
        { title: 'Análisis de competencia', xp: 90, category: 'research' },
        { title: 'Presentar roadmap a liderazgo', xp: 120, category: 'communication' },
      ],
      resources: [
        { type: 'Curso', title: 'Product Management Fundamentals', duration: '6h', icon: '🎯' },
        { type: 'Artículo', title: 'Frameworks de priorización', duration: '22min', icon: '📊' },
        { type: 'Video', title: 'How to Run User Research', duration: '35min', icon: '🔍' },
      ]
    },
    data_analyst: {
      welcomeMessage: 'Transforma datos en insights',
      metrics: [
        { id: 'reports', label: 'Reportes', icon: BarChart3, description: 'Reportes generados' },
        { id: 'dashboards', label: 'Dashboards', icon: TrendingUp, description: 'Dashboards activos' },
        { id: 'insights', label: 'Insights', icon: Briefcase, description: 'Insights accionables' },
        { id: 'queries', label: 'Queries', icon: Code, description: 'Queries optimizadas' },
      ],
      suggestedTasks: [
        { title: 'Crear dashboard ejecutivo', xp: 120, category: 'visualization' },
        { title: 'Análisis de tendencias mensuales', xp: 100, category: 'analysis' },
        { title: 'Optimizar queries SQL', xp: 90, category: 'technical' },
        { title: 'Presentar insights al equipo', xp: 110, category: 'communication' },
      ],
      resources: [
        { type: 'Curso', title: 'Data Analysis with SQL', duration: '4h', icon: '📊' },
        { type: 'Artículo', title: 'Effective Data Visualization', duration: '18min', icon: '📈' },
        { type: 'Video', title: 'Tableau Basics', duration: '30min', icon: '🎨' },
      ]
    },
    data_scientist: {
      welcomeMessage: 'Construye modelos que predicen el futuro',
      metrics: [
        { id: 'models', label: 'Modelos', icon: BarChart3, description: 'Modelos en producción' },
        { id: 'accuracy', label: 'Precisión', icon: TrendingUp, description: 'Accuracy promedio' },
        { id: 'experiments', label: 'Experimentos', icon: Code, description: 'Experimentos completados' },
        { id: 'pipelines', label: 'Pipelines', icon: GitBranch, description: 'Data pipelines activos' },
      ],
      suggestedTasks: [
        { title: 'Entrenar modelo de ML', xp: 150, category: 'modeling' },
        { title: 'Feature engineering para dataset', xp: 120, category: 'preprocessing' },
        { title: 'Optimizar hiperparámetros', xp: 110, category: 'optimization' },
        { title: 'Deploy modelo a producción', xp: 140, category: 'deployment' },
      ],
      resources: [
        { type: 'Curso', title: 'Machine Learning Fundamentals', duration: '8h', icon: '🤖' },
        { type: 'Artículo', title: 'Feature Engineering Best Practices', duration: '25min', icon: '⚙️' },
        { type: 'Video', title: 'MLOps Introduction', duration: '40min', icon: '🔧' },
      ]
    },
    investor: {
      welcomeMessage: 'Gestiona inversiones inteligentes',
      metrics: [
        { id: 'portfolio', label: 'Portfolio', icon: BarChart3, description: 'Activos en portafolio' },
        { id: 'returns', label: 'Retornos', icon: TrendingUp, description: 'ROI promedio' },
        { id: 'analysis', label: 'Análisis', icon: Briefcase, description: 'Análisis completados' },
        { id: 'diversification', label: 'Diversificación', icon: BarChart3, description: 'Score de diversificación' },
      ],
      suggestedTasks: [
        { title: 'Análisis fundamental de empresa', xp: 130, category: 'analysis' },
        { title: 'Rebalancear portafolio', xp: 100, category: 'portfolio' },
        { title: 'Research de nuevas oportunidades', xp: 120, category: 'research' },
        { title: 'Presentar estrategia de inversión', xp: 140, category: 'strategy' },
      ],
      resources: [
        { type: 'Curso', title: 'Investment Analysis', duration: '6h', icon: '💼' },
        { type: 'Artículo', title: 'Portfolio Diversification Strategies', duration: '20min', icon: '📊' },
        { type: 'Video', title: 'Financial Modeling Basics', duration: '35min', icon: '💰' },
      ]
    },
    hedge_fund: {
      welcomeMessage: 'Estrategias de inversión avanzadas',
      metrics: [
        { id: 'strategies', label: 'Estrategias', icon: Briefcase, description: 'Estrategias activas' },
        { id: 'returns', label: 'Alpha', icon: TrendingUp, description: 'Alpha generado' },
        { id: 'risk', label: 'Riesgo', icon: Shield, description: 'Sharpe ratio' },
        { id: 'trades', label: 'Trades', icon: DollarSign, description: 'Trades ejecutados' },
      ],
      suggestedTasks: [
        { title: 'Backtesting de estrategia', xp: 150, category: 'strategy' },
        { title: 'Análisis de riesgo de portafolio', xp: 140, category: 'risk' },
        { title: 'Implementar trading algorithm', xp: 160, category: 'quantitative' },
        { title: 'Reporte mensual de performance', xp: 120, category: 'reporting' },
      ],
      resources: [
        { type: 'Curso', title: 'Quantitative Trading Strategies', duration: '10h', icon: '📈' },
        { type: 'Artículo', title: 'Risk Management in Hedge Funds', duration: '30min', icon: '🛡️' },
        { type: 'Video', title: 'Algorithmic Trading Basics', duration: '45min', icon: '🤖' },
      ]
    },
    marketing_manager: {
      welcomeMessage: 'Impulsa el crecimiento con marketing',
      metrics: [
        { id: 'campaigns', label: 'Campañas', icon: Megaphone, description: 'Campañas lanzadas' },
        { id: 'reach', label: 'Alcance', icon: Users, description: 'Personas alcanzadas' },
        { id: 'conversion', label: 'Conversión', icon: TrendingUp, description: 'Tasa de conversión' },
        { id: 'roi', label: 'ROI', icon: DollarSign, description: 'Retorno de inversión' },
      ],
      suggestedTasks: [
        { title: 'Planificar campaña trimestral', xp: 120, category: 'strategy' },
        { title: 'Analizar métricas de campañas', xp: 90, category: 'analytics' },
        { title: 'Crear contenido para redes sociales', xp: 80, category: 'content' },
        { title: 'A/B testing de anuncios', xp: 100, category: 'optimization' },
      ],
      resources: [
        { type: 'Curso', title: 'Digital Marketing Strategy', duration: '5h', icon: '📣' },
        { type: 'Artículo', title: 'Growth Marketing Techniques', duration: '22min', icon: '🚀' },
        { type: 'Video', title: 'Social Media Marketing', duration: '30min', icon: '📱' },
      ]
    },
    content_creator: {
      welcomeMessage: 'Crea contenido que inspira',
      metrics: [
        { id: 'content', label: 'Contenido', icon: FileText, description: 'Piezas publicadas' },
        { id: 'engagement', label: 'Engagement', icon: Users, description: 'Interacciones' },
        { id: 'reach', label: 'Alcance', icon: Megaphone, description: 'Impresiones' },
        { id: 'quality', label: 'Calidad', icon: TrendingUp, description: 'Score de calidad' },
      ],
      suggestedTasks: [
        { title: 'Escribir artículo de blog', xp: 100, category: 'writing' },
        { title: 'Grabar video tutorial', xp: 120, category: 'video' },
        { title: 'Diseñar infografía', xp: 90, category: 'design' },
        { title: 'Crear calendario de contenido', xp: 80, category: 'planning' },
      ],
      resources: [
        { type: 'Curso', title: 'Content Marketing Mastery', duration: '4h', icon: '✍️' },
        { type: 'Artículo', title: 'Storytelling Techniques', duration: '15min', icon: '📖' },
        { type: 'Video', title: 'Video Production Basics', duration: '35min', icon: '🎬' },
      ]
    },
    business_analyst: {
      welcomeMessage: 'Optimiza procesos de negocio',
      metrics: [
        { id: 'analysis', label: 'Análisis', icon: BarChart3, description: 'Análisis completados' },
        { id: 'requirements', label: 'Requisitos', icon: FileText, description: 'Documentos de requisitos' },
        { id: 'processes', label: 'Procesos', icon: GitBranch, description: 'Procesos mapeados' },
        { id: 'improvements', label: 'Mejoras', icon: TrendingUp, description: 'Mejoras implementadas' },
      ],
      suggestedTasks: [
        { title: 'Análisis de proceso actual', xp: 110, category: 'analysis' },
        { title: 'Documentar requisitos de negocio', xp: 100, category: 'documentation' },
        { title: 'Crear diagrama de flujo', xp: 80, category: 'mapping' },
        { title: 'Presentar propuesta de mejora', xp: 120, category: 'presentation' },
      ],
      resources: [
        { type: 'Curso', title: 'Business Analysis Fundamentals', duration: '5h', icon: '📊' },
        { type: 'Artículo', title: 'Requirements Gathering Best Practices', duration: '18min', icon: '📝' },
        { type: 'Herramienta', title: 'BPMN Modeling Tools', duration: '20min', icon: '🔧' },
      ]
    },
    scrum_master: {
      welcomeMessage: 'Facilita la agilidad del equipo',
      metrics: [
        { id: 'sprints', label: 'Sprints', icon: Briefcase, description: 'Sprints completados' },
        { id: 'velocity', label: 'Velocity', icon: TrendingUp, description: 'Velocidad del equipo' },
        { id: 'ceremonies', label: 'Ceremonias', icon: Users, description: 'Ceremonias facilitadas' },
        { id: 'impediments', label: 'Impedimentos', icon: Shield, description: 'Impedimentos resueltos' },
      ],
      suggestedTasks: [
        { title: 'Facilitar sprint planning', xp: 90, category: 'facilitation' },
        { title: 'Realizar retrospectiva', xp: 80, category: 'improvement' },
        { title: 'Resolver impedimento del equipo', xp: 100, category: 'problem-solving' },
        { title: 'Coaching de prácticas ágiles', xp: 110, category: 'coaching' },
      ],
      resources: [
        { type: 'Curso', title: 'Scrum Master Certification', duration: '6h', icon: '🏃' },
        { type: 'Artículo', title: 'Facilitation Techniques', duration: '20min', icon: '👥' },
        { type: 'Video', title: 'Agile Coaching Skills', duration: '30min', icon: '🎯' },
      ]
    },
    devops: {
      welcomeMessage: 'Automatiza y escala la infraestructura',
      metrics: [
        { id: 'deployments', label: 'Deploys', icon: GitBranch, description: 'Deploys exitosos' },
        { id: 'uptime', label: 'Uptime', icon: TrendingUp, description: 'Disponibilidad del sistema' },
        { id: 'automation', label: 'Automatización', icon: Code, description: 'Procesos automatizados' },
        { id: 'monitoring', label: 'Monitoring', icon: BarChart3, description: 'Alertas configuradas' },
      ],
      suggestedTasks: [
        { title: 'Configurar CI/CD pipeline', xp: 140, category: 'automation' },
        { title: 'Implementar monitoring con Prometheus', xp: 120, category: 'monitoring' },
        { title: 'Migrar a Kubernetes', xp: 150, category: 'infrastructure' },
        { title: 'Automatizar backups', xp: 100, category: 'reliability' },
      ],
      resources: [
        { type: 'Curso', title: 'DevOps Engineering', duration: '8h', icon: '⚙️' },
        { type: 'Artículo', title: 'Infrastructure as Code Best Practices', duration: '25min', icon: '🏗️' },
        { type: 'Video', title: 'Kubernetes Fundamentals', duration: '50min', icon: '☸️' },
      ]
    },
    qa_engineer: {
      welcomeMessage: 'Asegura la calidad del software',
      metrics: [
        { id: 'tests', label: 'Tests', icon: Bug, description: 'Tests automatizados' },
        { id: 'coverage', label: 'Cobertura', icon: TrendingUp, description: 'Cobertura de testing' },
        { id: 'bugs', label: 'Bugs', icon: Shield, description: 'Bugs encontrados' },
        { id: 'quality', label: 'Calidad', icon: BarChart3, description: 'Score de calidad' },
      ],
      suggestedTasks: [
        { title: 'Crear suite de tests E2E', xp: 130, category: 'automation' },
        { title: 'Realizar testing exploratorio', xp: 90, category: 'manual' },
        { title: 'Documentar casos de prueba', xp: 80, category: 'documentation' },
        { title: 'Performance testing', xp: 120, category: 'performance' },
      ],
      resources: [
        { type: 'Curso', title: 'Test Automation Fundamentals', duration: '5h', icon: '🔍' },
        { type: 'Artículo', title: 'QA Best Practices', duration: '18min', icon: '✅' },
        { type: 'Herramienta', title: 'Selenium WebDriver Guide', duration: '30min', icon: '🔧' },
      ]
    },
    other: {
      welcomeMessage: 'Descubre tu camino profesional',
      metrics: [
        { id: 'learning', label: 'Aprendizaje', icon: Briefcase, description: 'Cursos completados' },
        { id: 'networking', label: 'Networking', icon: Users, description: 'Conexiones realizadas' },
        { id: 'projects', label: 'Proyectos', icon: GitBranch, description: 'Proyectos personales' },
        { id: 'goals', label: 'Objetivos', icon: TrendingUp, description: 'Metas alcanzadas' },
      ],
      suggestedTasks: [
        { title: 'Completar curso introductorio', xp: 100, category: 'learning' },
        { title: 'Conectar con 3 profesionales', xp: 80, category: 'networking' },
        { title: 'Iniciar proyecto personal', xp: 120, category: 'portfolio' },
        { title: 'Actualizar CV y LinkedIn', xp: 90, category: 'career' },
      ],
      resources: [
        { type: 'Guía', title: 'Descubre tu rol profesional', duration: '30min', icon: '🧭' },
        { type: 'Artículo', title: 'Cómo elegir tu carrera profesional', duration: '15min', icon: '💡' },
        { type: 'Video', title: 'Construyendo tu marca personal', duration: '25min', icon: '🎯' },
      ]
    }
  };

  return configs[role] || configs.other;
}
