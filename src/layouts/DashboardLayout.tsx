import { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useThemeLogo } from '@/hooks/useThemeLogo';
import clovelyLogo from '@/assets/clovely-logo.jpg';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ThemeToggle } from '@/components/ThemeToggle';
import { UpgradeModal } from '@/components/UpgradeModal';
import { useAuthStore } from '@/store/useAuthStore';
import { useProgressStore } from '@/store/useProgressStore';
import { toast } from 'sonner';
import {
  Home, Target, FileText, Briefcase, Mic, Users, BarChart3,
  Bot, Gift, Settings, Trophy, ChevronLeft, ChevronRight, Zap,
} from 'lucide-react';

export default function DashboardLayout() {
  const { user, startPremiumTrial } = useAuthStore();
  const { progress } = useProgressStore();
  const location = useLocation();
  const { isDark } = useThemeLogo();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [upgradeModalOpen, setUpgradeModalOpen] = useState(false);
  
  const handleStartTrial = async () => {
    try {
      await startPremiumTrial();
      toast.success('¡Bienvenido a Premium! 🎉', {
        description: 'Disfruta 7 días gratis. Cancela cuando quieras.',
      });
    } catch (error) {
      toast.error('Error al iniciar prueba. Intenta de nuevo.');
    }
  };
  
  const isPremium = user?.plan === 'premium';

  const navItems = [
    { icon: Home, label: 'Inicio', path: '/dashboard' },
    { icon: Target, label: 'Objetivos', path: '/dashboard/goals', badge: 3 },
    { icon: FileText, label: 'CV Builder', path: '/dashboard/cvs' },
    { icon: Briefcase, label: 'Oportunidades', path: '/dashboard/opportunities', badge: 12 },
    { icon: Mic, label: 'Entrevistas', path: '/dashboard/interviews' },
    { icon: Users, label: 'Círculo', path: '/dashboard/circles', badge: 5 },
    { icon: Bot, label: 'Coach', path: '/dashboard/coach', glow: true },
    { icon: Trophy, label: 'Recompensas', path: '/dashboard/rewards' },
    { icon: Settings, label: 'Configuración', path: '/dashboard/settings' },
  ];

  const xpPercentage = progress ? (progress.currentXP / progress.nextLevelXP) * 100 : 0;

  return (
    <div className="min-h-screen flex max-w-full overflow-x-hidden">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarCollapsed ? 'w-20' : 'w-64'
        } border-r bg-card transition-all duration-300 flex flex-col fixed h-screen z-50`}
      >
        {/* Logo & Collapse */}
        <div className="h-16 border-b flex items-center justify-between px-4">
          {!sidebarCollapsed ? (
            <motion.img
              src={clovelyLogo}
              alt="Clovely"
              className={`h-10 w-auto transition-all duration-300 ${
                isDark 
                  ? 'rounded-lg border-2 border-primary p-1' 
                  : 'rounded-lg'
              }`}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            />
          ) : (
            <motion.img
              src={clovelyLogo}
              alt="Clovely"
              className={`h-8 w-8 object-cover transition-all duration-300 ${
                isDark 
                  ? 'rounded-lg border-2 border-primary p-0.5' 
                  : 'rounded-lg'
              }`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            />
          )}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="p-2 hover:bg-accent rounded-lg transition-colors"
          >
            {sidebarCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </button>
        </div>

        {/* User Profile */}
        <div className={`p-4 border-b ${sidebarCollapsed ? 'px-2' : ''}`}>
          <div className="flex items-center gap-3 mb-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={user?.avatar} />
              <AvatarFallback>{user?.name?.[0]}</AvatarFallback>
            </Avatar>
            {!sidebarCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm truncate">{user?.name}</p>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Badge variant="secondary" className="text-xs">
                    🥉 Nivel {progress?.level || 1}
                  </Badge>
                </div>
              </div>
            )}
          </div>
          {!sidebarCollapsed && progress && (
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Progreso</span>
                <span className="font-medium">{progress.currentXP}/{progress.nextLevelXP} XP</span>
              </div>
              <div className="h-2 bg-secondary rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-primary to-orange-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${xpPercentage}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || 
                           (item.path !== '/dashboard' && location.pathname.startsWith(item.path));
            const Icon = item.icon;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all ${
                  isActive
                    ? 'bg-primary text-primary-foreground font-medium'
                    : 'hover:bg-accent text-muted-foreground hover:text-foreground'
                } ${item.glow && !isActive ? 'hover:shadow-[0_0_20px_rgba(255,122,0,0.3)]' : ''}`}
              >
                <Icon className={`h-5 w-5 flex-shrink-0 ${item.glow && !isActive ? 'text-primary' : ''}`} />
                {!sidebarCollapsed && (
                  <>
                    <span className="flex-1">{item.label}</span>
                    {item.badge && (
                      <Badge variant={isActive ? "secondary" : "outline"} className="text-xs">
                        {item.badge}
                      </Badge>
                    )}
                  </>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer Actions */}
        <div className={`p-3 border-t space-y-2 ${sidebarCollapsed ? 'px-2' : ''}`}>
          {!sidebarCollapsed ? (
            <>
              <ThemeToggle />
              {!isPremium && (
                <Button 
                  className="w-full bg-gradient-to-r from-primary to-orange-500 hover:opacity-90"
                  size="sm"
                  onClick={() => setUpgradeModalOpen(true)}
                >
                  <Zap className="h-4 w-4 mr-2" />
                  Upgrade Premium
                </Button>
              )}
            </>
          ) : (
            <>
              <ThemeToggle />
              {!isPremium && (
                <Button 
                  size="icon"
                  className="w-full bg-gradient-to-r from-primary to-orange-500 hover:opacity-90"
                  onClick={() => setUpgradeModalOpen(true)}
                >
                  <Zap className="h-4 w-4" />
                </Button>
              )}
            </>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <main className={`flex-1 transition-all duration-300 ${sidebarCollapsed ? 'ml-20' : 'ml-64'}`}>
        <Outlet />
      </main>
      
      {/* Upgrade Modal */}
      <UpgradeModal 
        open={upgradeModalOpen}
        onClose={() => setUpgradeModalOpen(false)}
        onStartTrial={handleStartTrial}
      />
    </div>
  );
}
