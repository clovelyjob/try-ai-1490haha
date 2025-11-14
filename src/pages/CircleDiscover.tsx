import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useCircleStore } from '@/store/useCircleStore';
import { Users, Search, Plus, TrendingUp, MessageSquare, Bot } from 'lucide-react';
import { toast } from 'sonner';

export default function CircleDiscover() {
  const navigate = useNavigate();
  const { circles, joinCircle } = useCircleStore();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCircles = circles.filter(circle =>
    circle.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    circle.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleJoinCircle = (circleId: string) => {
    joinCircle(circleId);
    toast.success('¡Te has unido al círculo!');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-heading font-bold mb-2">Círculos Sociales</h1>
            <p className="text-muted-foreground">
              Conecta con profesionales y empresas que comparten tus intereses
            </p>
          </div>
        </div>

        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar círculos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-primary/10 rounded-lg">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{circles.length}</p>
                <p className="text-sm text-muted-foreground">Círculos Activos</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-secondary/10 rounded-lg">
                <TrendingUp className="h-6 w-6 text-secondary" />
              </div>
              <div>
                <p className="text-2xl font-bold">142</p>
                <p className="text-sm text-muted-foreground">Miembros Totales</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-accent/10 rounded-lg">
                <MessageSquare className="h-6 w-6 text-accent" />
              </div>
              <div>
                <p className="text-2xl font-bold">28</p>
                <p className="text-sm text-muted-foreground">Conversaciones Hoy</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Circles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCircles.map((circle) => (
          <Card key={circle.id} className="hover-lift">
            <CardHeader>
              <div className="flex items-start gap-3 mb-2">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={circle.logo} alt={circle.name} />
                  <AvatarFallback>{circle.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <CardTitle className="text-lg">{circle.name}</CardTitle>
                  <Badge variant="secondary" className="mt-1">
                    {circle.category}
                  </Badge>
                </div>
              </div>
              <CardDescription>{circle.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  <span>{circle.memberCount} miembros</span>
                </div>
                {circle.hasBot && (
                  <div className="flex items-center gap-1 text-primary">
                    <Bot className="h-4 w-4" />
                    <span>IA Bot</span>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex gap-2">
              <Button
                variant="default"
                className="flex-1"
                onClick={() => handleJoinCircle(circle.id)}
              >
                Unirme
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate(`/dashboard/circles/${circle.id}`)}
              >
                Ver más
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {filteredCircles.length === 0 && (
        <Card className="p-12">
          <div className="text-center">
            <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-bold mb-2">No se encontraron círculos</h3>
            <p className="text-muted-foreground mb-6">
              Intenta con otros términos de búsqueda
            </p>
          </div>
        </Card>
      )}
    </div>
  );
}
