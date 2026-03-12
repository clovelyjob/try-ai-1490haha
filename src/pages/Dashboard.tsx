import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useAuthStore } from '@/store/useAuthStore';
import { useProfileStore } from '@/store/useProfileStore';
import { useCVStore } from '@/store/useCVStore';
import { DailyJob } from '@/components/dashboard/DailyJob';
import { ProgressBar } from '@/components/dashboard/ProgressBar';
import { NotificationsBell } from '@/components/dashboard/NotificationsBell';
import { UserStats } from '@/components/dashboard/UserStats';
import { RecommendedResources } from '@/components/dashboard/RecommendedResources';
import {
  Briefcase, FileText, ArrowRight, Target, Sparkles, RotateCcw, Compass,
} from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuthStore();
  const { profile } = useProfileStore();
  const { cvs } = useCVStore();

  const userCV = cvs.find(cv => cv.userId === user?.id);
  const cvCompletionScore = userCV?.score?.overall || 0;
  const interviewsPracticed = 0;
  const opportunitiesSaved = 0;
  
  const getRoleDisplayName = (role: string) => {
    const roleNames: Record<string, string> = {
      'ux_designer': 'UX Designer',
      'ui_designer': 'UI Designer',
      'product_designer': 'Product Designer',
      'developer_frontend': 'Frontend Developer',
      'developer_backend': 'Backend Developer',
      'developer_fullstack': 'Fullstack Developer',
      'product_manager': 'Product Manager',
      'data_analyst': 'Data Analyst',
      'other': 'Sin definir'
    };
    return roleNames[role] || role;
  };

  const firstName = user?.name?.split(' ')[0] || 'Usuario';

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
        
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              Hola, {firstName}
            </h1>
            <p className="text-sm text-muted-foreground">
              Construye tu futuro profesional con Clovely
            </p>
          </div>
          <NotificationsBell />
        </div>

        {/* Stats */}
        <UserStats 
          streak={user?.streak || 0}
          applicationsSubmitted={user?.applicationsSubmitted || 0}
          role={profile?.rolActual ? getRoleDisplayName(profile.rolActual) : undefined}
        />

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-5 gap-6">
          {/* Left column */}
          <div className="lg:col-span-3 space-y-6">
            {/* Daily Job */}
            <DailyJob />

            {/* Quick Actions */}
            <div className="space-y-3">
              <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                Acciones rápidas
              </h2>
              <div className="grid sm:grid-cols-2 gap-3">
                <Link to="/dashboard/cvs" className="block group">
                  <Card className="p-5 h-full border-border/50 hover:border-primary/25 transition-all duration-300">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 bg-primary/8 rounded-xl group-hover:bg-primary/12 transition-colors">
                        <FileText className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-sm group-hover:text-primary transition-colors">CV Builder</h3>
                        <p className="text-xs text-muted-foreground">Crea tu CV profesional</p>
                      </div>
                      <ArrowRight className="h-4 w-4 text-muted-foreground/50 group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                    </div>
                  </Card>
                </Link>

                <Link to="/dashboard/opportunities" className="block group">
                  <Card className="p-5 h-full border-border/50 hover:border-primary/25 transition-all duration-300">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 bg-primary/8 rounded-xl group-hover:bg-primary/12 transition-colors">
                        <Briefcase className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-sm group-hover:text-primary transition-colors">Oportunidades</h3>
                        <p className="text-xs text-muted-foreground">Encuentra trabajos</p>
                      </div>
                      <ArrowRight className="h-4 w-4 text-muted-foreground/50 group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                    </div>
                  </Card>
                </Link>
              </div>
            </div>

            {/* Getting Started / Diagnostic CTA */}
            <Card className="p-6 bg-primary text-primary-foreground relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-primary-foreground/5 rounded-full -mr-24 -mt-24" />
              <div className="relative space-y-3">
                <div className="flex items-center gap-2">
                  <Compass className="h-5 w-5" />
                  <h2 className="font-semibold text-lg">
                    {profile?.rolActual ? 'Refina tu perfil' : 'Descubre tu camino ideal'}
                  </h2>
                </div>
                <p className="text-primary-foreground/85 text-sm leading-relaxed max-w-lg">
                  {profile?.rolActual 
                    ? 'Actualiza tu perfil profesional para obtener recomendaciones más precisas.'
                    : 'Completa tu diagnóstico con IA para recibir oportunidades personalizadas.'
                  }
                </p>
                <div className="flex items-center gap-3 pt-1">
                  <Link to="/onboarding">
                    <Button 
                      size="sm"
                      className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 font-medium"
                    >
                      {profile?.rolActual ? (
                        <>
                          <RotateCcw className="mr-1.5 h-3.5 w-3.5" />
                          Rehacer diagnóstico
                        </>
                      ) : (
                        <>
                          <Sparkles className="mr-1.5 h-3.5 w-3.5" />
                          Iniciar diagnóstico
                        </>
                      )}
                    </Button>
                  </Link>
                  {profile?.rolActual && (
                    <span className="text-xs text-primary-foreground/60">
                      Rol: {getRoleDisplayName(profile.rolActual)}
                    </span>
                  )}
                </div>
              </div>
            </Card>
          </div>

          {/* Right column */}
          <div className="lg:col-span-2 space-y-6">
            <ProgressBar 
              cvCompleted={cvCompletionScore}
              interviewsPracticed={interviewsPracticed}
              opportunitiesSaved={opportunitiesSaved}
            />
            <RecommendedResources role={profile?.rolActual} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
