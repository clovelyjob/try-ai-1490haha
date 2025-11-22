import { useState, useMemo, useCallback, useEffect } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';
import { ClovelyHeaderLogo } from '@/components/ClovelyHeaderLogo';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ThemeToggle } from '@/components/ThemeToggle';
import { UpgradeModal } from '@/components/UpgradeModal';
import { GuestBanner } from '@/components/GuestBanner';
import { useAuthStore } from '@/store/useAuthStore';
import { useUIStore } from '@/store/useUIStore';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import {
  Home, FileText, Briefcase, Settings, ChevronLeft, ChevronRight, Pin, Mic, Shield,
} from 'lucide-react';

// Debounce utility
function debounce<T extends (...args: any[]) => void>(fn: T, delay: number): T {
  let timeoutId: NodeJS.Timeout;
  return ((...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  }) as T;
}

export default function DashboardLayout() {
  const { user, startPremiumTrial } = useAuthStore();
  const { sidebarCollapsed, sidebarPinned, setSidebarCollapsed, toggleSidebarPinned } = useUIStore();
  const location = useLocation();
  const isMobile = useIsMobile();
  const [upgradeModalOpen, setUpgradeModalOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  
  useEffect(() => {
    checkAdminStatus();
  }, [user]);

  const checkAdminStatus = async () => {
    if (!user) {
      setIsAdmin(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .single();

      if (!error && data?.role === 'admin') {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }
    } catch (error) {
      setIsAdmin(false);
    }
  };
  
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

  const navItems = useMemo(() => {
    const items = [
      { icon: Home, label: 'Inicio', path: '/dashboard' },
      { icon: FileText, label: 'CV Builder', path: '/dashboard/cvs' },
      { icon: Mic, label: 'Entrevistas', path: '/dashboard/interviews' },
      { icon: Briefcase, label: 'Oportunidades', path: '/dashboard/opportunities' },
      { icon: Settings, label: 'Configuración', path: '/dashboard/settings' },
    ];

    if (isAdmin) {
      items.splice(4, 0, { 
        icon: Shield, 
        label: 'Admin', 
        path: '/dashboard/admin' 
      });
    }

    return items;
  }, [isAdmin]);

  

  // Hover handlers with debounce (only for desktop)
  const handleMouseEnter = useCallback(
    debounce(() => {
      if (!isMobile && !sidebarPinned) {
        setSidebarCollapsed(false);
      }
    }, 120),
    [isMobile, sidebarPinned]
  );

  const handleMouseLeave = useCallback(
    debounce(() => {
      if (!isMobile && !sidebarPinned) {
        setSidebarCollapsed(true);
      }
    }, 120),
    [isMobile, sidebarPinned]
  );

  const handleFocus = () => {
    if (!isMobile && !sidebarPinned) {
      setSidebarCollapsed(false);
    }
  };

  return (
    <TooltipProvider delayDuration={200}>
      <div className="min-h-screen flex max-w-full overflow-x-hidden">
        {/* Sidebar */}
        <aside
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          className={cn(
            'border-r bg-card/80 backdrop-blur-sm transition-[width] duration-200 ease-out flex flex-col fixed h-screen z-50',
            sidebarCollapsed && !sidebarPinned ? 'w-[72px]' : 'w-[260px]'
          )}
          aria-label="Navegación principal"
        >
          {/* Logo */}
          <div className="flex items-center px-4 pt-4 pb-2 border-b">
            <Link to="/dashboard">
              <motion.img
                src="/clovely-logo-transparent.svg"
                alt="Clovely"
                className="h-9 w-auto opacity-95 drop-shadow-[0_0_6px_rgba(255,122,0,0.25)] dark:drop-shadow-[0_0_8px_rgba(255,122,0,0.35)]"
                whileHover={{ scale: 1.04 }}
                transition={{ duration: 0.2 }}
              />
            </Link>
          </div>

          {/* User Profile */}
          <div className={cn('p-4 border-b', (sidebarCollapsed && !sidebarPinned) && 'px-2')}>
            <div className="flex items-center gap-3 mb-3">
              <Avatar className="h-10 w-10 shrink-0">
                <AvatarImage src={user?.avatar} />
                <AvatarFallback>{user?.name?.[0]}</AvatarFallback>
              </Avatar>
              {!(sidebarCollapsed && !sidebarPinned) && (
                <motion.div
                  className="flex-1 min-w-0"
                  initial={{ opacity: 0, x: -4 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <p className="font-semibold text-sm truncate">{user?.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                </motion.div>
              )}
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-3 space-y-1" aria-label="Main navigation">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path || 
                             (item.path !== '/dashboard' && location.pathname.startsWith(item.path));
              const Icon = item.icon;
              const isCollapsed = sidebarCollapsed && !sidebarPinned;
              
              const navLink = (
                <Link
                  key={item.path}
                  to={item.path}
                  onFocus={handleFocus}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2 rounded-lg transition-all',
                    'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
                    isActive
                      ? 'bg-primary text-primary-foreground font-medium'
                      : 'hover:bg-accent text-muted-foreground hover:text-foreground'
                  )}
                >
                  <Icon className="h-5 w-5 flex-shrink-0" />
                  {!isCollapsed && (
                    <motion.div
                      className="flex items-center gap-2 flex-1 min-w-0"
                      initial={{ opacity: 0, x: -4 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <span className="flex-1 truncate">{item.label}</span>
                    </motion.div>
                  )}
                </Link>
              );

              return isCollapsed ? (
                <Tooltip key={item.path}>
                  <TooltipTrigger asChild>
                    {navLink}
                  </TooltipTrigger>
                  <TooltipContent side="right" className="flex items-center gap-2">
                    {item.label}
                  </TooltipContent>
                </Tooltip>
              ) : navLink;
            })}
          </nav>

          {/* Footer Actions */}
          <div className={cn('p-3 border-t space-y-2', (sidebarCollapsed && !sidebarPinned) && 'px-2')}>
            {/* Pin Button */}
            {!isMobile && (
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleSidebarPinned}
                className={cn(
                  'w-full justify-start gap-2',
                  sidebarPinned && 'text-primary'
                )}
                aria-pressed={sidebarPinned}
                aria-label={sidebarPinned ? "Desfijar sidebar" : "Fijar sidebar"}
              >
                <Pin className={cn('h-4 w-4', sidebarPinned && 'rotate-45')} />
                {!(sidebarCollapsed && !sidebarPinned) && (
                  <motion.span
                    initial={{ opacity: 0, x: -4 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2 }}
                    className="text-sm"
                  >
                    {sidebarPinned ? 'Fijado' : 'Fijar'}
                  </motion.span>
                )}
              </Button>
            )}

            {!(sidebarCollapsed && !sidebarPinned) ? (
              <>
                <ThemeToggle />
                {!isPremium && (
                  <Button 
                    className="w-full bg-gradient-to-r from-primary to-orange-500 hover:opacity-90"
                    size="sm"
                    onClick={() => setUpgradeModalOpen(true)}
                  >
                    Upgrade Premium
                  </Button>
                )}
              </>
            ) : (
              <>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div>
                      <ThemeToggle />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    Cambiar tema
                  </TooltipContent>
                </Tooltip>
                  {!isPremium && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          size="icon"
                          className="w-full bg-gradient-to-r from-primary to-orange-500 hover:opacity-90"
                          onClick={() => setUpgradeModalOpen(true)}
                        >
                          P
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="right">
                        Upgrade Premium
                      </TooltipContent>
                    </Tooltip>
                  )}
              </>
            )}
          </div>
        </aside>

        {/* Main Content */}
        <main className={cn(
          'flex-1 transition-[margin] duration-200 ease-out',
          sidebarCollapsed && !sidebarPinned ? 'ml-[72px]' : 'ml-[260px]'
        )}>
          <GuestBanner />
          <Outlet />
        </main>
        
        {/* Upgrade Modal */}
        <UpgradeModal 
          open={upgradeModalOpen}
          onClose={() => setUpgradeModalOpen(false)}
          onStartTrial={handleStartTrial}
        />
      </div>
    </TooltipProvider>
  );
}
