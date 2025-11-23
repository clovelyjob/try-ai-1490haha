import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BookOpen, Video, ExternalLink, Award } from 'lucide-react';
import type { ProfessionalRole } from '@/types';

interface Resource {
  id: string;
  title: string;
  description: string;
  type: 'course' | 'video' | 'article' | 'tool';
  url: string;
  duration?: string;
  platform: string;
}

const RESOURCES_BY_ROLE: Record<string, Resource[]> = {
  ux_designer: [
    {
      id: 'ux1',
      title: 'Fundamentos de UX Design',
      description: 'Aprende los principios básicos del diseño de experiencia de usuario',
      type: 'course',
      url: 'https://www.coursera.org/learn/user-experience-design',
      duration: '4 semanas',
      platform: 'Coursera'
    },
    {
      id: 'ux2',
      title: 'Figma para UX Designers',
      description: 'Domina Figma para crear prototipos interactivos',
      type: 'video',
      url: 'https://www.youtube.com/watch?v=FTFaQWZBqQ8',
      duration: '2 horas',
      platform: 'YouTube'
    },
  ],
  developer_frontend: [
    {
      id: 'fe1',
      title: 'React - The Complete Guide',
      description: 'Conviértete en un experto en React y sus ecosistemas',
      type: 'course',
      url: 'https://www.udemy.com/course/react-the-complete-guide-incl-redux/',
      duration: '48 horas',
      platform: 'Udemy'
    },
    {
      id: 'fe2',
      title: 'Modern CSS & Tailwind',
      description: 'Aprende CSS moderno y frameworks como Tailwind',
      type: 'article',
      url: 'https://css-tricks.com/',
      platform: 'CSS-Tricks'
    },
  ],
  product_manager: [
    {
      id: 'pm1',
      title: 'Product Management Essentials',
      description: 'Los fundamentos de la gestión de productos',
      type: 'course',
      url: 'https://www.coursera.org/learn/uva-darden-digital-product-management',
      duration: '4 semanas',
      platform: 'Coursera'
    },
    {
      id: 'pm2',
      title: 'Roadmapping y Priorización',
      description: 'Técnicas para crear roadmaps efectivos',
      type: 'video',
      url: 'https://www.youtube.com/watch?v=example',
      duration: '1 hora',
      platform: 'Product School'
    },
  ],
  default: [
    {
      id: 'def1',
      title: 'Desarrollo Profesional',
      description: 'Guía completa para avanzar en tu carrera',
      type: 'course',
      url: 'https://www.linkedin.com/learning/',
      duration: '3 semanas',
      platform: 'LinkedIn Learning'
    },
    {
      id: 'def2',
      title: 'Soft Skills para el Éxito',
      description: 'Mejora tus habilidades de comunicación y liderazgo',
      type: 'article',
      url: 'https://www.linkedin.com/learning/',
      platform: 'LinkedIn'
    },
  ]
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
  const resources = role && RESOURCES_BY_ROLE[role] 
    ? RESOURCES_BY_ROLE[role] 
    : RESOURCES_BY_ROLE.default;

  return (
    <Card className="p-6 rounded-2xl shadow-clovely-md">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold mb-1 bg-gradient-to-r from-primary to-primary-warm bg-clip-text text-transparent">
              Recursos Recomendados
            </h3>
            <p className="text-sm text-muted-foreground">
              Contenido seleccionado para tu perfil profesional
            </p>
          </div>
          <div className="p-2 rounded-xl bg-gradient-to-br from-primary/10 to-primary-warm/10">
            <BookOpen className="h-6 w-6 text-primary" />
          </div>
        </div>

        <div className="space-y-3">
          {resources.map((resource) => {
            const Icon = getResourceIcon(resource.type);
            const badgeColors = {
              course: 'bg-gradient-to-r from-primary to-primary-warm text-white',
              video: 'bg-gradient-to-r from-blue-500 to-blue-600 text-white',
              article: 'bg-gradient-to-r from-green-500 to-green-600 text-white',
              tool: 'bg-gradient-to-r from-purple-500 to-purple-600 text-white'
            };
            return (
              <div
                key={resource.id}
                className="p-4 rounded-xl border-2 border-border hover:border-primary/30 hover:shadow-clovely-sm hover:-translate-y-0.5 transition-all duration-300"
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-gradient-to-br from-primary/10 to-primary-warm/10 rounded-lg">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-medium text-sm">{resource.title}</h4>
                      <Badge className={`text-xs capitalize shadow-clovely-sm ${badgeColors[resource.type]}`}>
                        {resource.type === 'course' ? 'Curso' :
                         resource.type === 'video' ? 'Video' :
                         resource.type === 'article' ? 'Artículo' : 'Herramienta'}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {resource.description}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="font-medium">{resource.platform}</span>
                      {resource.duration && (
                        <>
                          <span>•</span>
                          <span>{resource.duration}</span>
                        </>
                      )}
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
      </div>
    </Card>
  );
}
