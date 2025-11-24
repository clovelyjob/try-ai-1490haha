import { useState } from 'react';
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
  Briefcase, FileText, ArrowRight, Target, Video, Sparkles, RotateCcw,
} from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuthStore();
  const { profile } = useProfileStore();
  const { cvs } = useCVStore();

  // Calculate progress metrics
  const userCV = cvs.find(cv => cv.userId === user?.id);
  const cvCompletionScore = userCV?.score?.overall || 0;
  const interviewsPracticed = 0; // Will be implemented later
  const opportunitiesSaved = 0; // Will be implemented later
  
  // Get role display name
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-muted/20 to-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-6 sm:py-8 md:py-12 space-y-6 md:space-y-8">
        {/* Header Premium */}
        <div className="flex items-center justify-between gap-4 mb-2">
          <div className="space-y-1 sm:space-y-2 min-w-0 flex-1">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-heading font-bold bg-gradient-to-r from-primary via-primary-warm to-primary bg-clip-text text-transparent animate-gradient-x truncate">
              Hola, {user?.name?.split(' ')[0] || 'Usuario'} 👋
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-muted-foreground">
              Construye tu futuro profesional con Clovely
            </p>
          </div>
          <div className="shrink-0">
            <NotificationsBell />
          </div>
        </div>

        {/* User Stats con gradientes */}
        <UserStats 
          streak={user?.streak || 0}
          applicationsSubmitted={user?.applicationsSubmitted || 0}
          role={profile?.rolActual ? getRoleDisplayName(profile.rolActual) : undefined}
        />

        {/* Daily Job */}
        <DailyJob />

        {/* Progress Section */}
        <ProgressBar 
          cvCompleted={cvCompletionScore}
          interviewsPracticed={interviewsPracticed}
          opportunitiesSaved={opportunitiesSaved}
        />

        {/* Quick Actions con premium hover */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <Link to="/dashboard/cvs" className="block group">
            <Card className="p-6 sm:p-8 cursor-pointer h-full bg-gradient-to-br from-card to-card/50 backdrop-blur-sm border-border/50 group-hover:border-primary/30 transition-all duration-300 min-h-[100px]">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="p-3 sm:p-4 bg-primary/10 rounded-2xl group-hover:scale-110 transition-transform shadow-clovely-md shrink-0">
                  <FileText className="h-6 w-6 sm:h-7 sm:w-7 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-heading font-semibold text-base sm:text-lg group-hover:text-primary transition-colors truncate">CV Builder</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground">Crea tu CV profesional</p>
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all shrink-0 hidden sm:block" />
              </div>
            </Card>
          </Link>

          <Link to="/dashboard/opportunities" className="block group">
            <Card className="p-6 sm:p-8 cursor-pointer h-full bg-gradient-to-br from-card to-card/50 backdrop-blur-sm border-border/50 group-hover:border-primary/30 transition-all duration-300 min-h-[100px]">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="p-3 sm:p-4 bg-primary/10 rounded-2xl group-hover:scale-110 transition-transform shadow-clovely-md shrink-0">
                  <Briefcase className="h-6 w-6 sm:h-7 sm:w-7 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-heading font-semibold text-base sm:text-lg group-hover:text-primary transition-colors truncate">Oportunidades</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground">Encuentra trabajos</p>
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all shrink-0 hidden sm:block" />
              </div>
            </Card>
          </Link>

          <Card className="p-6 sm:p-8 border-dashed bg-gradient-to-br from-muted/50 to-muted/20 min-h-[100px]">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="p-3 sm:p-4 bg-muted rounded-2xl shrink-0">
                <Target className="h-6 w-6 sm:h-7 sm:w-7 text-muted-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-heading font-semibold text-base sm:text-lg truncate">Próximamente</h3>
                <p className="text-xs sm:text-sm text-muted-foreground">Más funciones pronto</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Recommended Resources */}
        <RecommendedResources role={profile?.rolActual} />

        {/* Getting Started Card */}
        <Card className="p-6 sm:p-8 gradient-orange-gray text-white shadow-clovely-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32"></div>
          <div className="relative flex flex-col md:flex-row items-start md:items-center gap-4 sm:gap-6">
            <div className="flex-1 space-y-2 sm:space-y-3 min-w-0">
              <div className="flex items-center gap-2">
                <Target className="h-5 w-5 sm:h-6 sm:w-6 shrink-0" />
                <h2 className="text-xl sm:text-2xl font-heading font-bold">
                  {profile?.rolActual ? 'Refina tu perfil profesional' : 'Descubre tu camino ideal'}
                </h2>
              </div>
              <p className="text-white/90 text-sm sm:text-base md:text-lg">
                {profile?.rolActual 
                  ? 'Tu diagnóstico profesional puede evolucionar. Actualiza tu perfil para obtener recomendaciones más precisas.'
                  : 'Completa tu diagnóstico profesional con IA para recibir oportunidades personalizadas.'
                }
              </p>
              <div className="flex items-center gap-2 text-xs sm:text-sm text-white/75">
                <Sparkles className="h-3 w-3 sm:h-4 sm:w-4 shrink-0" />
                <span>Tiempo estimado: 10 minutos</span>
              </div>
            </div>
            <div className="flex flex-col gap-3 w-full md:w-auto shrink-0">
              <Link to="/onboarding" className="w-full">
                <Button 
                  size="lg" 
                  className="bg-white text-primary hover:bg-white/90 font-semibold shadow-lg hover:scale-105 transition-all w-full min-h-[44px]"
                >
                  {profile?.rolActual ? (
                    <>
                      <RotateCcw className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                      Rehacer diagnóstico
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                      Iniciar diagnóstico
                    </>
                  )}
                </Button>
              </Link>
              {profile?.rolActual && (
                <p className="text-xs text-white/60 text-center">
                  Rol actual: {getRoleDisplayName(profile.rolActual)}
                </p>
              )}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
