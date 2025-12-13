import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BookOpen, Video, ExternalLink, Award, Globe, DollarSign, ChevronDown, ChevronUp } from 'lucide-react';
import type { ProfessionalRole } from '@/types';

interface Resource {
  id: string;
  title: string;
  description: string;
  type: 'course' | 'video' | 'article' | 'tool';
  url: string;
  duration?: string;
  platform: string;
  price: 'Gratis' | 'Pago' | 'Freemium';
  language: 'Español' | 'Inglés' | 'Ambos';
  level: 'Principiante' | 'Intermedio' | 'Avanzado';
}

const RESOURCES_BY_ROLE: Record<string, Resource[]> = {
  technical_support: [
    {
      id: 'ts1',
      title: 'Google IT Support Professional Certificate',
      description: 'Certificado profesional de Google para soporte técnico. Cubre troubleshooting, redes, sistemas operativos y seguridad.',
      type: 'course',
      url: 'https://www.coursera.org/professional-certificates/google-it-support',
      duration: '6 meses',
      platform: 'Coursera',
      price: 'Pago',
      language: 'Ambos',
      level: 'Principiante'
    },
    {
      id: 'ts2',
      title: 'Customer Service Fundamentals',
      description: 'Aprende habilidades esenciales de atención al cliente: comunicación efectiva, resolución de problemas y manejo de conflictos.',
      type: 'course',
      url: 'https://www.coursera.org/learn/customer-service',
      duration: '4 semanas',
      platform: 'Coursera',
      price: 'Freemium',
      language: 'Inglés',
      level: 'Principiante'
    },
    {
      id: 'ts3',
      title: 'Zendesk Training & Certification',
      description: 'Formación oficial de Zendesk para dominar la plataforma de soporte más usada en empresas.',
      type: 'tool',
      url: 'https://training.zendesk.com/',
      platform: 'Zendesk Academy',
      price: 'Gratis',
      language: 'Inglés',
      level: 'Intermedio'
    },
    {
      id: 'ts4',
      title: 'CompTIA A+ Certification Course',
      description: 'Preparación para la certificación A+ de CompTIA, estándar de la industria para técnicos de soporte.',
      type: 'video',
      url: 'https://www.youtube.com/watch?v=2eLe7uz-7CM',
      duration: '14 horas',
      platform: 'Professor Messer (YouTube)',
      price: 'Gratis',
      language: 'Inglés',
      level: 'Principiante'
    }
  ],
  ux_designer: [
    {
      id: 'ux1',
      title: 'Google UX Design Professional Certificate',
      description: 'Certificado oficial de Google. Aprende investigación de usuarios, wireframing, prototipado y diseño visual.',
      type: 'course',
      url: 'https://www.coursera.org/professional-certificates/google-ux-design',
      duration: '6 meses',
      platform: 'Coursera',
      price: 'Pago',
      language: 'Ambos',
      level: 'Principiante'
    },
    {
      id: 'ux2',
      title: 'Figma Tutorial Completo 2024',
      description: 'Tutorial completo de Figma desde cero: componentes, auto-layout, prototipos interactivos y design systems.',
      type: 'video',
      url: 'https://www.youtube.com/watch?v=FTFaQWZBqQ8',
      duration: '3 horas',
      platform: 'YouTube',
      price: 'Gratis',
      language: 'Inglés',
      level: 'Principiante'
    },
    {
      id: 'ux3',
      title: 'Interaction Design Foundation',
      description: 'Cursos de diseño UX/UI acreditados por la industria. Contenido creado por expertos de Google, Adobe y Meta.',
      type: 'course',
      url: 'https://www.interaction-design.org/',
      platform: 'IDF',
      price: 'Pago',
      language: 'Inglés',
      level: 'Intermedio'
    },
    {
      id: 'ux4',
      title: 'Laws of UX',
      description: 'Colección de principios psicológicos que los diseñadores pueden usar para crear productos más intuitivos.',
      type: 'article',
      url: 'https://lawsofux.com/',
      platform: 'Laws of UX',
      price: 'Gratis',
      language: 'Inglés',
      level: 'Intermedio'
    }
  ],
  developer_frontend: [
    {
      id: 'fe1',
      title: 'React - The Complete Guide 2024',
      description: 'Curso más vendido de React. Incluye hooks, Redux, Next.js, TypeScript y proyectos prácticos.',
      type: 'course',
      url: 'https://www.udemy.com/course/react-the-complete-guide-incl-redux/',
      duration: '68 horas',
      platform: 'Udemy',
      price: 'Pago',
      language: 'Inglés',
      level: 'Principiante'
    },
    {
      id: 'fe2',
      title: 'JavaScript.info - The Modern JavaScript Tutorial',
      description: 'Tutorial completo y gratuito de JavaScript moderno. Desde lo básico hasta temas avanzados.',
      type: 'article',
      url: 'https://javascript.info/',
      platform: 'JavaScript.info',
      price: 'Gratis',
      language: 'Ambos',
      level: 'Principiante'
    },
    {
      id: 'fe3',
      title: 'freeCodeCamp - Front End Development',
      description: 'Certificación gratuita con 300+ horas de contenido: HTML, CSS, JavaScript, React y proyectos reales.',
      type: 'course',
      url: 'https://www.freecodecamp.org/learn/front-end-development-libraries/',
      duration: '300 horas',
      platform: 'freeCodeCamp',
      price: 'Gratis',
      language: 'Ambos',
      level: 'Principiante'
    },
    {
      id: 'fe4',
      title: 'Web.dev by Google',
      description: 'Guías y tutoriales oficiales de Google sobre performance, accesibilidad y mejores prácticas web.',
      type: 'article',
      url: 'https://web.dev/learn',
      platform: 'Google',
      price: 'Gratis',
      language: 'Inglés',
      level: 'Intermedio'
    }
  ],
  developer_backend: [
    {
      id: 'be1',
      title: 'Node.js - The Complete Guide',
      description: 'Domina Node.js, Express, MongoDB, REST APIs, GraphQL y despliegue en producción.',
      type: 'course',
      url: 'https://www.udemy.com/course/nodejs-the-complete-guide/',
      duration: '40 horas',
      platform: 'Udemy',
      price: 'Pago',
      language: 'Inglés',
      level: 'Intermedio'
    },
    {
      id: 'be2',
      title: 'PostgreSQL Tutorial - Full Course',
      description: 'Aprende PostgreSQL desde cero: consultas, joins, índices, optimización y administración.',
      type: 'video',
      url: 'https://www.youtube.com/watch?v=qw--VYLpxG4',
      duration: '4 horas',
      platform: 'freeCodeCamp (YouTube)',
      price: 'Gratis',
      language: 'Inglés',
      level: 'Principiante'
    },
    {
      id: 'be3',
      title: 'System Design Primer',
      description: 'Guía completa de diseño de sistemas. Preparación para entrevistas técnicas en FAANG.',
      type: 'article',
      url: 'https://github.com/donnemartin/system-design-primer',
      platform: 'GitHub',
      price: 'Gratis',
      language: 'Inglés',
      level: 'Avanzado'
    },
    {
      id: 'be4',
      title: 'Docker Mastery',
      description: 'Aprende Docker, Docker Compose y Kubernetes para contenedorización de aplicaciones.',
      type: 'course',
      url: 'https://www.udemy.com/course/docker-mastery/',
      duration: '20 horas',
      platform: 'Udemy',
      price: 'Pago',
      language: 'Inglés',
      level: 'Intermedio'
    }
  ],
  product_manager: [
    {
      id: 'pm1',
      title: 'Digital Product Management - University of Virginia',
      description: 'Especialización completa en gestión de productos digitales. Metodologías ágiles y desarrollo de producto.',
      type: 'course',
      url: 'https://www.coursera.org/specializations/uva-darden-digital-product-management',
      duration: '4 meses',
      platform: 'Coursera',
      price: 'Pago',
      language: 'Inglés',
      level: 'Intermedio'
    },
    {
      id: 'pm2',
      title: 'Product School - Free Resources',
      description: 'Webinars, artículos y guías gratuitas de Product School. Contenido de PMs de Google, Meta y Netflix.',
      type: 'article',
      url: 'https://productschool.com/resources',
      platform: 'Product School',
      price: 'Gratis',
      language: 'Inglés',
      level: 'Intermedio'
    },
    {
      id: 'pm3',
      title: 'Atlassian Agile Coach',
      description: 'Guías gratuitas de metodologías ágiles: Scrum, Kanban, sprints y gestión de equipos.',
      type: 'article',
      url: 'https://www.atlassian.com/agile',
      platform: 'Atlassian',
      price: 'Gratis',
      language: 'Ambos',
      level: 'Principiante'
    },
    {
      id: 'pm4',
      title: 'Reforge - Growth Series',
      description: 'Programas avanzados de growth y product strategy. Usado por PMs de empresas top.',
      type: 'course',
      url: 'https://www.reforge.com/',
      platform: 'Reforge',
      price: 'Pago',
      language: 'Inglés',
      level: 'Avanzado'
    }
  ],
  data_analyst: [
    {
      id: 'da1',
      title: 'Google Data Analytics Professional Certificate',
      description: 'Certificado oficial de Google. SQL, hojas de cálculo, Tableau, R y análisis de datos.',
      type: 'course',
      url: 'https://www.coursera.org/professional-certificates/google-data-analytics',
      duration: '6 meses',
      platform: 'Coursera',
      price: 'Pago',
      language: 'Ambos',
      level: 'Principiante'
    },
    {
      id: 'da2',
      title: 'SQL for Data Science',
      description: 'Aprende SQL desde cero con enfoque en análisis de datos y business intelligence.',
      type: 'course',
      url: 'https://www.coursera.org/learn/sql-for-data-science',
      duration: '4 semanas',
      platform: 'Coursera',
      price: 'Freemium',
      language: 'Inglés',
      level: 'Principiante'
    },
    {
      id: 'da3',
      title: 'Kaggle Learn',
      description: 'Cursos gratuitos de Python, Machine Learning, SQL y visualización con certificados.',
      type: 'course',
      url: 'https://www.kaggle.com/learn',
      platform: 'Kaggle',
      price: 'Gratis',
      language: 'Inglés',
      level: 'Principiante'
    },
    {
      id: 'da4',
      title: 'Tableau Free Training Videos',
      description: 'Videos oficiales de Tableau para aprender visualización de datos desde cero.',
      type: 'video',
      url: 'https://www.tableau.com/learn/training/20244',
      platform: 'Tableau',
      price: 'Gratis',
      language: 'Inglés',
      level: 'Principiante'
    }
  ],
  marketing: [
    {
      id: 'mk1',
      title: 'Google Digital Marketing & E-commerce',
      description: 'Certificado de Google en marketing digital: SEO, SEM, email marketing, analytics y e-commerce.',
      type: 'course',
      url: 'https://www.coursera.org/professional-certificates/google-digital-marketing-ecommerce',
      duration: '6 meses',
      platform: 'Coursera',
      price: 'Pago',
      language: 'Ambos',
      level: 'Principiante'
    },
    {
      id: 'mk2',
      title: 'HubSpot Academy - Inbound Marketing',
      description: 'Certificación gratuita en inbound marketing. Estrategia de contenidos, leads y automatización.',
      type: 'course',
      url: 'https://academy.hubspot.com/courses/inbound-marketing',
      platform: 'HubSpot Academy',
      price: 'Gratis',
      language: 'Ambos',
      level: 'Principiante'
    },
    {
      id: 'mk3',
      title: 'Meta Blueprint - Social Media Marketing',
      description: 'Cursos oficiales de Meta para dominar Facebook e Instagram Ads.',
      type: 'course',
      url: 'https://www.facebookblueprint.com/',
      platform: 'Meta Blueprint',
      price: 'Gratis',
      language: 'Ambos',
      level: 'Intermedio'
    },
    {
      id: 'mk4',
      title: 'Moz - SEO Learning Center',
      description: 'Guías completas y gratuitas de SEO: keywords, link building, technical SEO y más.',
      type: 'article',
      url: 'https://moz.com/learn/seo',
      platform: 'Moz',
      price: 'Gratis',
      language: 'Inglés',
      level: 'Principiante'
    }
  ],
  hr: [
    {
      id: 'hr1',
      title: 'SHRM Learning System',
      description: 'Preparación para certificaciones SHRM-CP y SHRM-SCP, estándares globales en RRHH.',
      type: 'course',
      url: 'https://www.shrm.org/learning-and-career',
      platform: 'SHRM',
      price: 'Pago',
      language: 'Inglés',
      level: 'Intermedio'
    },
    {
      id: 'hr2',
      title: 'HR Management and Analytics - Coursera',
      description: 'People analytics, gestión del talento y estrategia de RRHH basada en datos.',
      type: 'course',
      url: 'https://www.coursera.org/specializations/human-resource-management',
      duration: '5 meses',
      platform: 'Coursera',
      price: 'Pago',
      language: 'Inglés',
      level: 'Intermedio'
    },
    {
      id: 'hr3',
      title: 'LinkedIn Learning - HR Courses',
      description: 'Biblioteca de cursos de RRHH: reclutamiento, desarrollo organizacional, compensaciones.',
      type: 'course',
      url: 'https://www.linkedin.com/learning/topics/human-resources',
      platform: 'LinkedIn Learning',
      price: 'Pago',
      language: 'Ambos',
      level: 'Principiante'
    },
    {
      id: 'hr4',
      title: 'AIHR Academy',
      description: 'Academia especializada en HR Analytics, Digital HR y transformación de RRHH.',
      type: 'course',
      url: 'https://www.aihr.com/',
      platform: 'AIHR',
      price: 'Pago',
      language: 'Inglés',
      level: 'Avanzado'
    }
  ],
  sales: [
    {
      id: 'sl1',
      title: 'HubSpot Sales Software Certification',
      description: 'Certificación gratuita en ventas: prospección, negociación y uso de CRM.',
      type: 'course',
      url: 'https://academy.hubspot.com/courses/hubspot-sales-software',
      platform: 'HubSpot Academy',
      price: 'Gratis',
      language: 'Ambos',
      level: 'Principiante'
    },
    {
      id: 'sl2',
      title: 'Salesforce Trailhead',
      description: 'Aprende Salesforce gratis con módulos interactivos y gana badges reconocidos.',
      type: 'course',
      url: 'https://trailhead.salesforce.com/',
      platform: 'Salesforce',
      price: 'Gratis',
      language: 'Ambos',
      level: 'Principiante'
    },
    {
      id: 'sl3',
      title: 'Sales Training by Sandler',
      description: 'Metodología Sandler de ventas consultivas. Webinars y recursos gratuitos.',
      type: 'article',
      url: 'https://www.sandler.com/resources/',
      platform: 'Sandler Training',
      price: 'Gratis',
      language: 'Inglés',
      level: 'Intermedio'
    },
    {
      id: 'sl4',
      title: 'SPIN Selling - Book Summary',
      description: 'Resumen y aplicación práctica de SPIN Selling, metodología clásica de ventas B2B.',
      type: 'article',
      url: 'https://www.hubspot.com/sales/spin-selling',
      platform: 'HubSpot',
      price: 'Gratis',
      language: 'Inglés',
      level: 'Intermedio'
    }
  ],
  default: [
    {
      id: 'def1',
      title: 'LinkedIn Learning - Desarrollo Profesional',
      description: 'Miles de cursos en habilidades de negocio, tecnología y creatividad.',
      type: 'course',
      url: 'https://www.linkedin.com/learning/',
      platform: 'LinkedIn Learning',
      price: 'Pago',
      language: 'Ambos',
      level: 'Principiante'
    },
    {
      id: 'def2',
      title: 'Coursera - Professional Certificates',
      description: 'Certificados profesionales de Google, IBM, Meta y universidades top.',
      type: 'course',
      url: 'https://www.coursera.org/professional-certificates',
      platform: 'Coursera',
      price: 'Pago',
      language: 'Ambos',
      level: 'Principiante'
    },
    {
      id: 'def3',
      title: 'edX - Skills for the Future',
      description: 'Cursos de Harvard, MIT y universidades líderes en habilidades del futuro.',
      type: 'course',
      url: 'https://www.edx.org/',
      platform: 'edX',
      price: 'Freemium',
      language: 'Ambos',
      level: 'Intermedio'
    },
    {
      id: 'def4',
      title: 'Soft Skills - Harvard ManageMentor',
      description: 'Desarrollo de habilidades blandas: liderazgo, comunicación y trabajo en equipo.',
      type: 'article',
      url: 'https://www.harvardbusiness.org/',
      platform: 'Harvard Business',
      price: 'Pago',
      language: 'Inglés',
      level: 'Intermedio'
    }
  ]
};

// Map role variations to resource keys
const ROLE_MAPPING: Record<string, string> = {
  'technical_support': 'technical_support',
  'Technical Support': 'technical_support',
  'ux_designer': 'ux_designer',
  'ui_designer': 'ux_designer',
  'developer_frontend': 'developer_frontend',
  'frontend_developer': 'developer_frontend',
  'developer_backend': 'developer_backend',
  'backend_developer': 'developer_backend',
  'developer_fullstack': 'developer_frontend',
  'fullstack_developer': 'developer_frontend',
  'product_manager': 'product_manager',
  'project_manager': 'product_manager',
  'data_analyst': 'data_analyst',
  'data_scientist': 'data_analyst',
  'marketing': 'marketing',
  'marketing_digital': 'marketing',
  'hr': 'hr',
  'human_resources': 'hr',
  'sales': 'sales',
  'business_development': 'sales',
};

const getResourceIcon = (type: Resource['type']) => {
  switch (type) {
    case 'course': return Award;
    case 'video': return Video;
    case 'article': return BookOpen;
    case 'tool': return ExternalLink;
  }
};

const getPriceColor = (price: Resource['price']) => {
  switch (price) {
    case 'Gratis': return 'text-green-600 dark:text-green-400';
    case 'Freemium': return 'text-yellow-600 dark:text-yellow-400';
    case 'Pago': return 'text-muted-foreground';
  }
};

interface RecommendedResourcesProps {
  role?: ProfessionalRole;
}

export function RecommendedResources({ role }: RecommendedResourcesProps) {
  const [expanded, setExpanded] = useState(false);
  
  // Find the correct resource key for the role
  const resourceKey = role ? (ROLE_MAPPING[role] || ROLE_MAPPING[role as string]) : null;
  const resources = resourceKey && RESOURCES_BY_ROLE[resourceKey] 
    ? RESOURCES_BY_ROLE[resourceKey] 
    : RESOURCES_BY_ROLE.default;

  const displayedResources = expanded ? resources : resources.slice(0, 3);
  const hasMore = resources.length > 3;
  const remainingCount = resources.length - 3;

  return (
    <Card className="p-6 rounded-2xl shadow-clovely-md">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold mb-1 text-primary">
              Recursos Recomendados
            </h3>
            <p className="text-sm text-muted-foreground">
              Cursos y herramientas verificadas para tu perfil
            </p>
          </div>
          <div className="p-2 rounded-xl bg-primary/10">
            <BookOpen className="h-6 w-6 text-primary" />
          </div>
        </div>

        <div className="space-y-3">
          {displayedResources.map((resource) => {
            const Icon = getResourceIcon(resource.type);
            const badgeColors = {
              course: 'bg-primary text-primary-foreground',
              video: 'bg-blue-500 text-white',
              article: 'bg-green-500 text-white',
              tool: 'bg-purple-500 text-white'
            };
            return (
              <div
                key={resource.id}
                className="p-4 rounded-xl border-2 border-border hover:border-primary/30 hover:shadow-clovely-sm hover:-translate-y-0.5 transition-all duration-300"
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg shrink-0">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 space-y-2 min-w-0">
                    <div className="flex items-start justify-between gap-2 flex-wrap">
                      <h4 className="font-medium text-sm leading-tight">{resource.title}</h4>
                      <Badge className={`text-xs capitalize shadow-clovely-sm shrink-0 ${badgeColors[resource.type]}`}>
                        {resource.type === 'course' ? 'Curso' :
                         resource.type === 'video' ? 'Video' :
                         resource.type === 'article' ? 'Artículo' : 'Herramienta'}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {resource.description}
                    </p>
                    <div className="flex items-center gap-2 flex-wrap text-xs">
                      <span className="font-medium text-foreground">{resource.platform}</span>
                      {resource.duration && (
                        <>
                          <span className="text-muted-foreground">•</span>
                          <span className="text-muted-foreground">{resource.duration}</span>
                        </>
                      )}
                      <span className="text-muted-foreground">•</span>
                      <span className={`font-medium flex items-center gap-1 ${getPriceColor(resource.price)}`}>
                        <DollarSign className="h-3 w-3" />
                        {resource.price}
                      </span>
                      <span className="text-muted-foreground">•</span>
                      <span className="text-muted-foreground flex items-center gap-1">
                        <Globe className="h-3 w-3" />
                        {resource.language}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {resource.level}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="mt-3">
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full text-xs hover:bg-primary/5 hover:border-primary/30 transition-all"
                    onClick={() => window.open(resource.url, '_blank')}
                  >
                    Ver Recurso
                    <ExternalLink className="h-3 w-3 ml-1" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>

        {hasMore && (
          <Button
            variant="ghost"
            className="w-full text-sm hover:bg-primary/5"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? (
              <>
                Ver menos
                <ChevronUp className="h-4 w-4 ml-2" />
              </>
            ) : (
              <>
                Ver más ({remainingCount} recurso{remainingCount > 1 ? 's' : ''} más)
                <ChevronDown className="h-4 w-4 ml-2" />
              </>
            )}
          </Button>
        )}
      </div>
    </Card>
  );
}
