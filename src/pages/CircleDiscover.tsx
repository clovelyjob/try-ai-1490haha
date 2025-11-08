import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useCircleStore } from '@/store/useCircleStore';
import { useAuthStore } from '@/store/useAuthStore';
import { Search, Users, TrendingUp, Calendar, ArrowRight, Sparkles } from 'lucide-react';

export default function CircleDiscover() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const circles = useCircleStore((state) => state.circles);
  const userCircles = useCircleStore((state) => state.userCircles);
  const events = useCircleStore((state) => state.events);
  const getRecommendedCircles = useCircleStore((state) => state.getRecommendedCircles);
  const seedData = useCircleStore((state) => state.seedData);

  useEffect(() => {
    if (user) {
      seedData(user.id);
    }
  }, [user, seedData]);

  const myCircles = circles.filter((c) => userCircles.includes(c.id));
  const recommendedCircles = user ? getRecommendedCircles(user.id) : [];
  const upcomingEvents = events
    .filter((e) => new Date(e.date) > new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 3);

  const getActivityColor = (level: string) => {
    switch (level) {
      case 'high':
        return 'text-green-600 bg-green-50';
      case 'medium':
        return 'text-yellow-600 bg-yellow-50';
      case 'low':
        return 'text-gray-600 bg-gray-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getActivityLabel = (level: string) => {
    switch (level) {
      case 'high':
        return 'Muy activo';
      case 'medium':
        return 'Activo';
      case 'low':
        return 'Poco activo';
      default:
        return 'Activo';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-7xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="mb-12 text-center animate-fade-in">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4" />
            Círculos de Talento
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-3">
            Conecta, aprende y crece con tu comunidad
          </h1>
          <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
            Únete a círculos de profesionales que comparten tus intereses y objetivos
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Buscar círculos por nombre, categoría o tema..."
              className="pl-12 h-12"
            />
          </div>
        </div>

        {/* My Circles */}
        {myCircles.length > 0 && (
          <section className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-foreground">
                Mis círculos
              </h2>
              <Button variant="ghost" size="sm">
                Ver todos
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myCircles.map((circle) => (
                <Card
                  key={circle.id}
                  className="p-6 hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => navigate(`/dashboard/circles/${circle.id}`)}
                >
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-foreground mb-2">
                          {circle.name}
                        </h3>
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                          {circle.description}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      {circle.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t">
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Users className="w-4 h-4" />
                        <span>{circle.memberCount}</span>
                      </div>
                      <Badge className={`text-xs ${getActivityColor(circle.activityLevel)}`}>
                        {getActivityLabel(circle.activityLevel)}
                      </Badge>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* Recommended Circles */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-foreground">
              Recomendados para ti
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendedCircles.map((circle) => (
              <Card
                key={circle.id}
                className="p-6 hover:shadow-lg transition-shadow"
              >
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      {circle.name}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-3 mb-3">
                      {circle.description}
                    </p>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {circle.tags.slice(0, 4).map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t">
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Users className="w-4 h-4" />
                      <span>{circle.memberCount} miembros</span>
                    </div>
                    <Badge className={`text-xs ${getActivityColor(circle.activityLevel)}`}>
                      {getActivityLabel(circle.activityLevel)}
                    </Badge>
                  </div>

                  <Button
                    className="w-full"
                    onClick={() => navigate(`/dashboard/circles/${circle.id}`)}
                  >
                    Ver círculo
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* Upcoming Events */}
        {upcomingEvents.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-foreground">
                Próximos eventos
              </h2>
              <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard/circles/events')}>
                Ver todos
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {upcomingEvents.map((event) => (
                <Card key={event.id} className="p-6 hover:shadow-lg transition-shadow">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {new Date(event.date).toLocaleDateString('es', {
                          day: 'numeric',
                          month: 'short',
                        })}
                      </span>
                      <span>•</span>
                      <span>{event.duration} min</span>
                    </div>
                    
                    <h3 className="text-lg font-semibold text-foreground">
                      {event.title}
                    </h3>
                    
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {event.description}
                    </p>

                    <div className="flex items-center justify-between pt-3 border-t">
                      <div className="text-sm text-muted-foreground">
                        Por {event.hostName}
                      </div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Users className="w-4 h-4" />
                        <span>{event.attendees.length}</span>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
