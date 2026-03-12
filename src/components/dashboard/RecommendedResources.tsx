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
    { id: 'ts1', title: 'Google IT Support Professional Certificate', description: 'Certificado profesional de Google para soporte técnico.', type: 'course', url: 'https://www.coursera.org/professional-certificates/google-it-support', duration: '6 meses', platform: 'Coursera', price: 'Pago', language: 'Ambos', level: 'Principiante' },
    { id: 'ts2', title: 'Customer Service Fundamentals', description: 'Aprende habilidades esenciales de atención al cliente.', type: 'course', url: 'https://www.coursera.org/learn/customer-service', duration: '4 semanas', platform: 'Coursera', price: 'Freemium', language: 'Inglés', level: 'Principiante' },
    { id: 'ts3', title: 'Zendesk Training & Certification', description: 'Formación oficial de Zendesk.', type: 'tool', url: 'https://training.zendesk.com/', platform: 'Zendesk Academy', price: 'Gratis', language: 'Inglés', level: 'Intermedio' },
    { id: 'ts4', title: 'CompTIA A+ Certification Course', description: 'Preparación para la certificación A+ de CompTIA.', type: 'video', url: 'https://www.youtube.com/watch?v=2eLe7uz-7CM', duration: '14 horas', platform: 'Professor Messer', price: 'Gratis', language: 'Inglés', level: 'Principiante' },
  ],
  ux_designer: [
    { id: 'ux1', title: 'Google UX Design Certificate', description: 'Certificado oficial de Google en UX Design.', type: 'course', url: 'https://www.coursera.org/professional-certificates/google-ux-design', duration: '6 meses', platform: 'Coursera', price: 'Pago', language: 'Ambos', level: 'Principiante' },
    { id: 'ux2', title: 'Figma Tutorial Completo', description: 'Tutorial completo de Figma desde cero.', type: 'video', url: 'https://www.youtube.com/watch?v=FTFaQWZBqQ8', duration: '3 horas', platform: 'YouTube', price: 'Gratis', language: 'Inglés', level: 'Principiante' },
    { id: 'ux3', title: 'Interaction Design Foundation', description: 'Cursos de diseño UX/UI acreditados.', type: 'course', url: 'https://www.interaction-design.org/', platform: 'IDF', price: 'Pago', language: 'Inglés', level: 'Intermedio' },
    { id: 'ux4', title: 'Laws of UX', description: 'Principios psicológicos para diseñadores.', type: 'article', url: 'https://lawsofux.com/', platform: 'Laws of UX', price: 'Gratis', language: 'Inglés', level: 'Intermedio' },
  ],
  developer_frontend: [
    { id: 'fe1', title: 'React - The Complete Guide', description: 'Curso más vendido de React.', type: 'course', url: 'https://www.udemy.com/course/react-the-complete-guide-incl-redux/', duration: '68 horas', platform: 'Udemy', price: 'Pago', language: 'Inglés', level: 'Principiante' },
    { id: 'fe2', title: 'JavaScript.info', description: 'Tutorial completo de JavaScript moderno.', type: 'article', url: 'https://javascript.info/', platform: 'JavaScript.info', price: 'Gratis', language: 'Ambos', level: 'Principiante' },
    { id: 'fe3', title: 'freeCodeCamp Front End', description: 'Certificación gratuita de desarrollo frontend.', type: 'course', url: 'https://www.freecodecamp.org/learn/front-end-development-libraries/', duration: '300 horas', platform: 'freeCodeCamp', price: 'Gratis', language: 'Ambos', level: 'Principiante' },
    { id: 'fe4', title: 'Web.dev by Google', description: 'Guías oficiales de Google sobre performance web.', type: 'article', url: 'https://web.dev/learn', platform: 'Google', price: 'Gratis', language: 'Inglés', level: 'Intermedio' },
  ],
  developer_backend: [
    { id: 'be1', title: 'Node.js Complete Guide', description: 'Domina Node.js, Express y MongoDB.', type: 'course', url: 'https://www.udemy.com/course/nodejs-the-complete-guide/', duration: '40 horas', platform: 'Udemy', price: 'Pago', language: 'Inglés', level: 'Intermedio' },
    { id: 'be2', title: 'PostgreSQL Tutorial', description: 'Aprende PostgreSQL desde cero.', type: 'video', url: 'https://www.youtube.com/watch?v=qw--VYLpxG4', duration: '4 horas', platform: 'freeCodeCamp', price: 'Gratis', language: 'Inglés', level: 'Principiante' },
    { id: 'be3', title: 'System Design Primer', description: 'Guía completa de diseño de sistemas.', type: 'article', url: 'https://github.com/donnemartin/system-design-primer', platform: 'GitHub', price: 'Gratis', language: 'Inglés', level: 'Avanzado' },
    { id: 'be4', title: 'Docker Mastery', description: 'Docker, Docker Compose y Kubernetes.', type: 'course', url: 'https://www.udemy.com/course/docker-mastery/', duration: '20 horas', platform: 'Udemy', price: 'Pago', language: 'Inglés', level: 'Intermedio' },
  ],
  product_manager: [
    { id: 'pm1', title: 'Digital Product Management', description: 'Especialización en gestión de productos digitales.', type: 'course', url: 'https://www.coursera.org/specializations/uva-darden-digital-product-management', duration: '4 meses', platform: 'Coursera', price: 'Pago', language: 'Inglés', level: 'Intermedio' },
    { id: 'pm2', title: 'Product School Resources', description: 'Webinars y guías gratuitas de Product School.', type: 'article', url: 'https://productschool.com/resources', platform: 'Product School', price: 'Gratis', language: 'Inglés', level: 'Intermedio' },
    { id: 'pm3', title: 'Atlassian Agile Coach', description: 'Guías de metodologías ágiles.', type: 'article', url: 'https://www.atlassian.com/agile', platform: 'Atlassian', price: 'Gratis', language: 'Ambos', level: 'Principiante' },
    { id: 'pm4', title: 'Reforge Growth Series', description: 'Programas avanzados de growth.', type: 'course', url: 'https://www.reforge.com/', platform: 'Reforge', price: 'Pago', language: 'Inglés', level: 'Avanzado' },
  ],
  data_analyst: [
    { id: 'da1', title: 'Google Data Analytics Certificate', description: 'Certificado oficial de Google en analytics.', type: 'course', url: 'https://www.coursera.org/professional-certificates/google-data-analytics', duration: '6 meses', platform: 'Coursera', price: 'Pago', language: 'Ambos', level: 'Principiante' },
    { id: 'da2', title: 'SQL for Data Science', description: 'SQL con enfoque en análisis de datos.', type: 'course', url: 'https://www.coursera.org/learn/sql-for-data-science', duration: '4 semanas', platform: 'Coursera', price: 'Freemium', language: 'Inglés', level: 'Principiante' },
    { id: 'da3', title: 'Kaggle Learn', description: 'Cursos gratuitos de Python y ML.', type: 'course', url: 'https://www.kaggle.com/learn', platform: 'Kaggle', price: 'Gratis', language: 'Inglés', level: 'Principiante' },
    { id: 'da4', title: 'Tableau Free Training', description: 'Videos oficiales de Tableau.', type: 'video', url: 'https://www.tableau.com/learn/training/20244', platform: 'Tableau', price: 'Gratis', language: 'Inglés', level: 'Principiante' },
  ],
  marketing: [
    { id: 'mk1', title: 'Google Digital Marketing', description: 'Certificado de Google en marketing digital.', type: 'course', url: 'https://www.coursera.org/professional-certificates/google-digital-marketing-ecommerce', duration: '6 meses', platform: 'Coursera', price: 'Pago', language: 'Ambos', level: 'Principiante' },
    { id: 'mk2', title: 'HubSpot Inbound Marketing', description: 'Certificación gratuita en inbound marketing.', type: 'course', url: 'https://academy.hubspot.com/courses/inbound-marketing', platform: 'HubSpot Academy', price: 'Gratis', language: 'Ambos', level: 'Principiante' },
    { id: 'mk3', title: 'Meta Blueprint', description: 'Cursos oficiales de Meta para ads.', type: 'course', url: 'https://www.facebookblueprint.com/', platform: 'Meta Blueprint', price: 'Gratis', language: 'Ambos', level: 'Intermedio' },
    { id: 'mk4', title: 'Moz SEO Guide', description: 'Guías completas y gratuitas de SEO.', type: 'article', url: 'https://moz.com/learn/seo', platform: 'Moz', price: 'Gratis', language: 'Inglés', level: 'Principiante' },
  ],
  hr: [
    { id: 'hr1', title: 'SHRM Learning System', description: 'Preparación para certificaciones SHRM.', type: 'course', url: 'https://www.shrm.org/learning-and-career', platform: 'SHRM', price: 'Pago', language: 'Inglés', level: 'Intermedio' },
    { id: 'hr2', title: 'HR Management and Analytics', description: 'People analytics y gestión del talento.', type: 'course', url: 'https://www.coursera.org/specializations/human-resource-management', duration: '5 meses', platform: 'Coursera', price: 'Pago', language: 'Inglés', level: 'Intermedio' },
    { id: 'hr3', title: 'LinkedIn Learning HR', description: 'Biblioteca de cursos de RRHH.', type: 'course', url: 'https://www.linkedin.com/learning/topics/human-resources', platform: 'LinkedIn Learning', price: 'Pago', language: 'Ambos', level: 'Principiante' },
    { id: 'hr4', title: 'AIHR Academy', description: 'HR Analytics y transformación digital.', type: 'course', url: 'https://www.aihr.com/', platform: 'AIHR', price: 'Pago', language: 'Inglés', level: 'Avanzado' },
  ],
  sales: [
    { id: 'sl1', title: 'HubSpot Sales Certification', description: 'Certificación gratuita en ventas.', type: 'course', url: 'https://academy.hubspot.com/courses/hubspot-sales-software', platform: 'HubSpot Academy', price: 'Gratis', language: 'Ambos', level: 'Principiante' },
    { id: 'sl2', title: 'Salesforce Trailhead', description: 'Aprende Salesforce gratis.', type: 'course', url: 'https://trailhead.salesforce.com/', platform: 'Salesforce', price: 'Gratis', language: 'Ambos', level: 'Principiante' },
    { id: 'sl3', title: 'Sandler Training', description: 'Metodología Sandler de ventas consultivas.', type: 'article', url: 'https://www.sandler.com/resources/', platform: 'Sandler Training', price: 'Gratis', language: 'Inglés', level: 'Intermedio' },
    { id: 'sl4', title: 'SPIN Selling Summary', description: 'Metodología clásica de ventas B2B.', type: 'article', url: 'https://www.hubspot.com/sales/spin-selling', platform: 'HubSpot', price: 'Gratis', language: 'Inglés', level: 'Intermedio' },
  ],
  default: [
    { id: 'def1', title: 'LinkedIn Learning', description: 'Miles de cursos profesionales.', type: 'course', url: 'https://www.linkedin.com/learning/', platform: 'LinkedIn Learning', price: 'Pago', language: 'Ambos', level: 'Principiante' },
    { id: 'def2', title: 'Coursera Certificates', description: 'Certificados de Google, IBM, Meta.', type: 'course', url: 'https://www.coursera.org/professional-certificates', platform: 'Coursera', price: 'Pago', language: 'Ambos', level: 'Principiante' },
    { id: 'def3', title: 'edX Skills for the Future', description: 'Cursos de Harvard, MIT y más.', type: 'course', url: 'https://www.edx.org/', platform: 'edX', price: 'Freemium', language: 'Ambos', level: 'Intermedio' },
    { id: 'def4', title: 'Harvard ManageMentor', description: 'Habilidades blandas y liderazgo.', type: 'article', url: 'https://www.harvardbusiness.org/', platform: 'Harvard Business', price: 'Pago', language: 'Inglés', level: 'Intermedio' },
  ],
};

const ROLE_MAPPING: Record<string, string> = {
  'technical_support': 'technical_support', 'Technical Support': 'technical_support',
  'ux_designer': 'ux_designer', 'ui_designer': 'ux_designer',
  'developer_frontend': 'developer_frontend', 'frontend_developer': 'developer_frontend',
  'developer_backend': 'developer_backend', 'backend_developer': 'developer_backend',
  'developer_fullstack': 'developer_frontend', 'fullstack_developer': 'developer_frontend',
  'product_manager': 'product_manager', 'project_manager': 'product_manager',
  'data_analyst': 'data_analyst', 'data_scientist': 'data_analyst',
  'marketing': 'marketing', 'marketing_digital': 'marketing',
  'hr': 'hr', 'human_resources': 'hr',
  'sales': 'sales', 'business_development': 'sales',
};

const getResourceIcon = (type: Resource['type']) => {
  switch (type) {
    case 'course': return Award;
    case 'video': return Video;
    case 'article': return BookOpen;
    case 'tool': return ExternalLink;
  }
};

interface RecommendedResourcesProps {
  role?: ProfessionalRole;
}

export function RecommendedResources({ role }: RecommendedResourcesProps) {
  const [expanded, setExpanded] = useState(false);
  
  const resourceKey = role ? (ROLE_MAPPING[role] || ROLE_MAPPING[role as string]) : null;
  const resources = resourceKey && RESOURCES_BY_ROLE[resourceKey] 
    ? RESOURCES_BY_ROLE[resourceKey] 
    : RESOURCES_BY_ROLE.default;

  const displayedResources = expanded ? resources : resources.slice(0, 3);
  const hasMore = resources.length > 3;

  return (
    <Card className="p-5 border-border/50">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-sm mb-0.5">Recursos Recomendados</h3>
            <p className="text-xs text-muted-foreground">Cursos y herramientas para tu perfil</p>
          </div>
          <BookOpen className="h-4 w-4 text-muted-foreground" />
        </div>

        <div className="space-y-2">
          {displayedResources.map((resource) => {
            const Icon = getResourceIcon(resource.type);
            return (
              <div
                key={resource.id}
                className="p-3 rounded-lg border border-border/50 hover:border-primary/20 transition-colors duration-200"
              >
                <div className="flex items-start gap-2.5">
                  <div className="p-1.5 bg-primary/8 rounded-md shrink-0 mt-0.5">
                    <Icon className="h-3.5 w-3.5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0 space-y-1">
                    <h4 className="font-medium text-xs leading-tight">{resource.title}</h4>
                    <div className="flex items-center gap-1.5 flex-wrap text-[10px] text-muted-foreground">
                      <span className="font-medium text-foreground">{resource.platform}</span>
                      {resource.duration && (<><span>·</span><span>{resource.duration}</span></>)}
                      <span>·</span>
                      <span className={resource.price === 'Gratis' ? 'text-primary font-medium' : ''}>
                        {resource.price}
                      </span>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-7 text-xs px-2 text-primary hover:text-primary hover:bg-primary/8 -ml-2"
                      onClick={() => window.open(resource.url, '_blank')}
                    >
                      Ver Recurso <ExternalLink className="h-3 w-3 ml-1" />
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {hasMore && (
          <Button
            variant="ghost"
            className="w-full text-xs h-8 text-muted-foreground hover:text-foreground"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? (<>Ver menos <ChevronUp className="h-3 w-3 ml-1" /></>) 
              : (<>Ver más <ChevronDown className="h-3 w-3 ml-1" /></>)}
          </Button>
        )}
      </div>
    </Card>
  );
}
