import { OfficialLogo } from '@/components/OfficialLogo';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar } from 'lucide-react';

const Blog = () => {
  const posts = [
    {
      title: 'Cómo prepararte para una entrevista técnica en 2025',
      excerpt: 'Descubre las mejores estrategias para destacar en entrevistas de tecnología con los consejos de expertos de la industria.',
      date: '5 Dic 2024',
      category: 'Entrevistas',
      image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&h=250&fit=crop'
    },
    {
      title: 'El poder del networking en tu búsqueda de empleo',
      excerpt: 'Aprende cómo construir conexiones significativas que impulsen tu carrera profesional.',
      date: '2 Dic 2024',
      category: 'Networking',
      image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&h=250&fit=crop'
    },
    {
      title: '10 errores comunes en tu CV que debes evitar',
      excerpt: 'Optimiza tu currículum evitando estos errores frecuentes que alejan a los reclutadores.',
      date: '28 Nov 2024',
      category: 'CV',
      image: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=400&h=250&fit=crop'
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

      <div className="container mx-auto px-6 py-20 max-w-6xl">
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-heading font-bold mb-4">
            Blog
          </h1>
          <p className="text-xl text-muted-foreground">
            Consejos, tendencias y recursos para impulsar tu carrera
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {posts.map((post, i) => (
            <Card key={i} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group">
              <div className="aspect-video overflow-hidden">
                <img 
                  src={post.image} 
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <Badge variant="secondary">{post.category}</Badge>
                  <span className="text-sm text-muted-foreground flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {post.date}
                  </span>
                </div>
                <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                  {post.title}
                </h3>
                <p className="text-muted-foreground">{post.excerpt}</p>
              </div>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-muted-foreground">
            Más artículos próximamente...
          </p>
        </div>
      </div>
    </div>
  );
};

export default Blog;
