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
  Briefcase, FileText, ArrowRight, Target, Video,
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
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Hola, {user?.name?.split(' ')[0] || 'Usuario'} 👋
            </h1>
            <p className="text-muted-foreground">
              Construye tu futuro profesional con Clovely
            </p>
          </div>
          <NotificationsBell />
        </div>

        {/* User Stats */}
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

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link to="/dashboard/cvs" className="block">
            <Card className="p-6 hover-lift hover:border-primary/50 transition-all cursor-pointer group gradient-card">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">CV Builder</h3>
                  <p className="text-sm text-muted-foreground">Crea tu CV profesional</p>
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </Card>
          </Link>

          <Link to="/dashboard/opportunities" className="block">
            <Card className="p-6 hover-lift hover:border-primary/50 transition-all cursor-pointer group gradient-card">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                  <Briefcase className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">Oportunidades</h3>
                  <p className="text-sm text-muted-foreground">Encuentra trabajos</p>
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </Card>
          </Link>

          <Card className="p-6 border-dashed gradient-soft">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-muted rounded-lg">
                <Target className="h-6 w-6 text-muted-foreground" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">Próximamente</h3>
                <p className="text-sm text-muted-foreground">Más funciones pronto</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Recommended Resources */}
        <RecommendedResources role={profile?.rolActual} />

        {/* Getting Started Card */}
        <Card className="p-8 gradient-orange-gray text-white shadow-clovely-xl">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="flex-1 space-y-3">
              <div className="flex items-center gap-2">
                <Target className="h-5 w-5 text-white" />
                <h2 className="text-xl font-bold">Comienza tu viaje profesional</h2>
              </div>
              <p className="text-white/90">
                Clovely te ayuda a conseguir oportunidades mediante un CV profesional optimizado 
                y preparación efectiva para entrevistas.
              </p>
            </div>
            <div className="flex gap-3">
              <Link to="/dashboard/cvs">
                <Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-white/90 shadow-clovely">
                  Crear CV
                  <ArrowRight className="ml-2 h-4 w-4" />
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
