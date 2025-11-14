import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useAuthStore } from '@/store/useAuthStore';
import { useProfileStore } from '@/store/useProfileStore';
import {
  Briefcase, FileText, TrendingUp, ArrowRight,
} from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuthStore();
  const { profile } = useProfileStore();

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold">
            Hola, {user?.name?.split(' ')[0] || 'Usuario'} 👋
          </h1>
          <p className="text-muted-foreground text-lg">
            Bienvenido a Clovely. Construye tu futuro profesional.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link to="/dashboard/cvs">
            <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">CV Builder</h3>
                  <p className="text-sm text-muted-foreground">Crea tu CV profesional</p>
                </div>
              </div>
            </Card>
          </Link>

          <Link to="/dashboard/opportunities">
            <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Briefcase className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">Oportunidades</h3>
                  <p className="text-sm text-muted-foreground">Encuentra tu próximo trabajo</p>
                </div>
              </div>
            </Card>
          </Link>

          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">Tu Progreso</h3>
                <p className="text-sm text-muted-foreground">Sigue mejorando</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Featured Section */}
        <Card className="p-8">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Comienza tu viaje profesional</h2>
            <p className="text-muted-foreground">
              Clovely te ayuda a conseguir oportunidades mediante un CV profesional y
              preparación para entrevistas.
            </p>
            <div className="flex gap-4">
              <Link to="/dashboard/cvs">
                <Button>
                  Crear CV <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link to="/dashboard/opportunities">
                <Button variant="outline">
                  Ver Oportunidades
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
