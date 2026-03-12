import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/useAuthStore';
import { useProfileStore } from '@/store/useProfileStore';
import { useCVStore } from '@/store/useCVStore';
import { DailyJob } from '@/components/dashboard/DailyJob';
import { ProgressBar } from '@/components/dashboard/ProgressBar';
import { NotificationsBell } from '@/components/dashboard/NotificationsBell';
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
      'ux_designer': 'UX Designer', 'ui_designer': 'UI Designer',
      'product_designer': 'Product Designer', 'developer_frontend': 'Frontend Developer',
      'developer_backend': 'Backend Developer', 'developer_fullstack': 'Fullstack Developer',
      'product_manager': 'Product Manager', 'data_analyst': 'Data Analyst', 'other': 'Sin definir'
    };
    return roleNames[role] || role;
  };

  const firstName = user?.name?.split(' ')[0] || 'Usuario';
  const hasRole = !!profile?.rolActual;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
        
        {/* Header — no welcome splash, direct to action */}
        <motion.div 
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <h1 className="text-xl font-semibold tracking-tight">
              {firstName}
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              {hasRole ? getRoleDisplayName(profile.rolActual!) : 'Completa tu diagnóstico para comenzar'}
            </p>
          </div>
          <NotificationsBell />
        </motion.div>

        {/* Diagnostic or Profile CTA — only show if no role */}
        {!hasRole && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.05 }}
            className="mb-8"
          >
            <div className="rounded-xl border border-primary/20 bg-primary/[0.04] p-5">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Compass className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1 space-y-2">
                  <h2 className="font-semibold text-sm">Descubre tu perfil profesional</h2>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Completa un diagnóstico rápido con IA para recibir recomendaciones personalizadas de carrera.
                  </p>
                  <Link to="/onboarding">
                    <Button size="sm" className="h-8 text-xs mt-1 gap-1.5">
                      <Sparkles className="h-3 w-3" />
                      Iniciar diagnóstico
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Quick actions */}
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="grid sm:grid-cols-3 gap-3 mb-8"
        >
          {[
            { icon: FileText, label: 'CV Builder', desc: 'Crea tu CV', path: '/dashboard/cvs' },
            { icon: Mic, label: 'Entrevistas', desc: 'Practica con IA', path: '/dashboard/interviews' },
            { icon: Briefcase, label: 'Oportunidades', desc: 'Encuentra trabajos', path: '/dashboard/opportunities' },
          ].map((action) => (
            <Link key={action.path} to={action.path} className="group">
              <div className="flex items-center gap-3 p-4 rounded-xl border border-border/50 hover:border-primary/20 hover:bg-primary/[0.02] transition-all duration-200">
                <div className="w-9 h-9 rounded-lg bg-primary/8 flex items-center justify-center group-hover:bg-primary/12 transition-colors">
                  <action.icon className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium group-hover:text-primary transition-colors">{action.label}</p>
                  <p className="text-[11px] text-muted-foreground">{action.desc}</p>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground/30 group-hover:text-primary/50 transition-colors" />
              </div>
            </Link>
          ))}
        </motion.div>

        {/* Two-column layout */}
        <div className="grid lg:grid-cols-[1fr_300px] gap-6">
          {/* Main */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.15 }}
            >
              <DailyJob />
            </motion.div>

            {hasRole && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                <div className="rounded-xl border border-border/50 p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-primary/8 flex items-center justify-center">
                        <RotateCcw className="h-3.5 w-3.5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Actualizar diagnóstico</p>
                        <p className="text-[11px] text-muted-foreground">
                          Rol actual: {getRoleDisplayName(profile?.rolActual!)}
                        </p>
                      </div>
                    </div>
                    <Link to="/onboarding">
                      <Button variant="ghost" size="sm" className="h-8 text-xs gap-1 text-primary hover:text-primary">
                        Rehacer <ArrowRight className="h-3 w-3" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <ProgressBar 
                cvCompleted={cvCompletionScore}
                interviewsPracticed={interviewsPracticed}
                opportunitiesSaved={opportunitiesSaved}
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.25 }}
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
