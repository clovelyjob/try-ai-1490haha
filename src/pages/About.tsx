import { OfficialLogo } from '@/components/OfficialLogo';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Card } from '@/components/ui/card';
import { Target, Heart, Zap } from 'lucide-react';

const About = () => {
  const values = [
    {
      icon: Target,
      title: 'Misión',
      description: 'Democratizar el acceso a herramientas de desarrollo profesional de clase mundial, ayudando a cada persona a encontrar su camino ideal.'
    },
    {
      icon: Heart,
      title: 'Valores',
      description: 'Creemos en la transparencia, la inclusión y el poder transformador de la tecnología aplicada al crecimiento personal.'
    },
    {
      icon: Zap,
      title: 'Visión',
      description: 'Ser la plataforma líder en Latinoamérica para el desarrollo de carreras, conectando talento con oportunidades.'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <nav className="sticky top-0 z-50 backdrop-blur-xl bg-background/70 border-b border-border/50">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between max-w-7xl">
          <OfficialLogo size="lg" to="/" />
          <ThemeToggle />
        </div>
      </nav>

      <div className="container mx-auto px-6 py-20 max-w-4xl">
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-heading font-bold mb-4">
            Sobre Clovely
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Somos un equipo apasionado por transformar la manera en que las personas encuentran y desarrollan sus carreras profesionales.
          </p>
        </div>

        <div className="prose prose-lg dark:prose-invert max-w-none mb-16">
          <p>
            Clovely nació de una simple observación: encontrar el trabajo ideal no debería ser un proceso frustrante y confuso. Demasiadas personas talentosas se pierden en el camino porque no tienen acceso a las herramientas y orientación adecuadas.
          </p>
          <p>
            Combinamos inteligencia artificial de vanguardia con metodologías probadas de desarrollo profesional para crear una experiencia única que te guía desde el autodescubrimiento hasta la consecución de tus metas laborales.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {values.map((value, i) => (
            <Card key={i} className="p-6 text-center">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <value.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">{value.title}</h3>
              <p className="text-muted-foreground">{value.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default About;
