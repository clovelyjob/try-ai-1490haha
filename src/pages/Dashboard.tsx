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
  Briefcase, FileText, ArrowRight, Sparkles, RotateCcw, Compass, Mic, ChevronRight,
} from 'lucide-react';
import { motion } from 'framer-motion';

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

  const quickActions = [
    { icon: FileText, label: 'CV Builder', desc: 'Crea tu CV profesional', path: '/dashboard/cvs' },
    { icon: Mic, label: 'Entrevistas', desc: 'Practica con IA', path: '/dashboard/interviews' },
    { icon: Briefcase, label: 'Oportunidades', desc: 'Encuentra trabajos', path: '/dashboard/opportunities' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex items-start justify-between gap-4 mb-8"
        >
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              Hola, {firstName}
            </h1>
            <p className="text-sm text-muted-foreground">
              Construye tu futuro profesional con Clovely
            </p>
          </div>
          <NotificationsBell />
        </motion.div>

        {/* Stats Row */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.05 }}
          className="mb-8"
        >
          <UserStats 
            streak={user?.streak || 0}
            applicationsSubmitted={user?.applicationsSubmitted || 0}
            role={profile?.rolActual ? getRoleDisplayName(profile.rolActual) : undefined}
          />
        </motion.div>

        {/* Two-column layout */}
        <div className="grid lg:grid-cols-[1fr_340px] gap-6">
          {/* Main content */}
          <div className="space-y-6">
            {/* Diagnostic CTA */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <Card className="p-6 bg-primary text-primary-foreground relative overflow-hidden border-0">
                <div className="absolute -top-12 -right-12 w-40 h-40 rounded-full bg-primary-foreground/5" />
                <div className="absolute -bottom-8 -left-8 w-24 h-24 rounded-full bg-primary-foreground/5" />
                <div className="relative space-y-3">
                  <div className="flex items-center gap-2">
                    <Compass className="h-5 w-5" />
                    <h2 className="font-semibold text-lg">
                      {profile?.rolActual ? 'Refina tu perfil' : 'Descubre tu camino ideal'}
                    </h2>
                  </div>
                  <p className="text-primary-foreground/80 text-sm leading-relaxed max-w-lg">
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
            </motion.div>

            {/* Daily Job */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.15 }}
            >
              <DailyJob />
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="space-y-3"
            >
              <h2 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Acciones rápidas
              </h2>
              <div className="grid sm:grid-cols-3 gap-3">
                {quickActions.map((action) => (
                  <Link key={action.path} to={action.path} className="block group">
                    <Card className="p-4 h-full border-border/40 hover:border-primary/25 hover:shadow-clovely-md transition-all duration-300">
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-primary/8 rounded-xl group-hover:bg-primary/12 transition-colors">
                          <action.icon className="h-4.5 w-4.5 text-primary" style={{ width: 18, height: 18 }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-sm group-hover:text-primary transition-colors">{action.label}</h3>
                          <p className="text-xs text-muted-foreground">{action.desc}</p>
                        </div>
                        <ChevronRight className="h-4 w-4 text-muted-foreground/40 group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.25 }}
            >
              <ProgressBar 
                cvCompleted={cvCompletionScore}
                interviewsPracticed={interviewsPracticed}
                opportunitiesSaved={opportunitiesSaved}
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              <RecommendedResources role={profile?.rolActual} />
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
