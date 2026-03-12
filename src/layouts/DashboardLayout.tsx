import { useState, useMemo, useEffect } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useIsMobile } from '@/hooks/use-mobile';
import { OfficialLogo } from '@/components/OfficialLogo';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { ThemeToggle } from '@/components/ThemeToggle';
import { UpgradeModal } from '@/components/UpgradeModal';
import { GuestBanner } from '@/components/GuestBanner';
import { useAuthStore } from '@/store/useAuthStore';
import { useUIStore } from '@/store/useUIStore';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import {
  Home, FileText, Briefcase, Settings, Mic, Shield, Menu, ArrowUpRight,
} from 'lucide-react';

export default function DashboardLayout() {
  const { t } = useTranslation();
  const { user, startPremiumTrial } = useAuthStore();
  const { sidebarCollapsed, setSidebarCollapsed } = useUIStore();
  const location = useLocation();
  const isMobile = useIsMobile();
  const [upgradeModalOpen, setUpgradeModalOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  
  useEffect(() => {
    checkAdminStatus();
  }, [user]);

  const checkAdminStatus = async () => {
    if (!user) { setIsAdmin(false); return; }
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .single();
      setIsAdmin(!error && data?.role === 'admin');
    } catch { setIsAdmin(false); }
  };
  
  const handleStartTrial = async () => {
    try {
      await startPremiumTrial();
      toast.success(t('common.success'), {
        description: t('settings.subscription.trialStarted') || 'Disfruta 7 días gratis.',
      });
    } catch { toast.error(t('common.error')); }
  };
  
  const isPremium = user?.plan === 'premium';

  const navItems = useMemo(() => {
    const items = [
      { icon: Home, label: t('nav.dashboard'), path: '/dashboard' },
      { icon: FileText, label: t('nav.cv'), path: '/dashboard/cvs' },
      { icon: Mic, label: t('nav.interviews'), path: '/dashboard/interviews' },
      { icon: Briefcase, label: t('nav.opportunities'), path: '/dashboard/opportunities' },
      { icon: Settings, label: t('nav.settings'), path: '/dashboard/settings' },
    ];
    if (isAdmin) {
      items.splice(4, 0, { icon: Shield, label: 'Admin', path: '/dashboard/admin' });
    }
    return items;
  }, [isAdmin, t]);

  const SidebarContent = () => (
    <>
      {/* Logo */}
      <div className="flex items-center px-5 h-16 border-b border-border/40">
        <OfficialLogo size="md" to="/dashboard" asMotion={true} animated={false} />
      </div>

      {/* User Profile */}
      <div className="p-4 border-b border-border/40">
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9">
            <AvatarImage src={user?.avatar} />
            <AvatarFallback className="bg-primary/10 text-primary text-sm font-medium">
              {user?.name?.[0]}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm truncate">{user?.name}</p>
            <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-0.5" aria-label="Main navigation">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path || 
                         (item.path !== '/dashboard' && location.pathname.startsWith(item.path));
          const Icon = item.icon;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setDrawerOpen(false)}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm',
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                'transition-colors duration-150',
                isActive
                  ? 'bg-primary text-primary-foreground font-medium'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
              )}
            >
              <Icon className="h-4.5 w-4.5 flex-shrink-0" style={{ width: 18, height: 18 }} />
              <span className="flex-1 truncate">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-border/40 space-y-2">
        <ThemeToggle />
        {!isPremium && (
          <Button 
            className="w-full font-medium text-sm"
            size="sm"
            onClick={() => {
              setUpgradeModalOpen(true);
              setDrawerOpen(false);
            }}
          >
            <ArrowUpRight className="mr-1.5 h-3.5 w-3.5" />
            Upgrade
          </Button>
        )}
      </div>
    </>
  );

  const MiniSidebar = () => (
    <aside className="border-r border-border/40 bg-card flex flex-col fixed h-screen z-40 w-[56px]">
      <div className="p-2 h-16 flex items-center justify-center border-b border-border/40">
        <Button 
          variant="ghost" 
          size="icon"
          className="h-9 w-9"
          onClick={() => setDrawerOpen(true)}
          aria-label={t('common.menu') || 'Menu'}
        >
          <Menu className="h-4 w-4" />
        </Button>
      </div>

      <nav className="flex-1 overflow-y-auto p-1.5 space-y-0.5">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path || 
                         (item.path !== '/dashboard' && location.pathname.startsWith(item.path));
          const Icon = item.icon;
          
          return (
            <Tooltip key={item.path}>
              <TooltipTrigger asChild>
                <Link
                  to={item.path}
                  className={cn(
                    'flex items-center justify-center p-2.5 rounded-lg',
                    'focus:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                    'transition-colors duration-150',
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
                  )}
                >
                  <Icon style={{ width: 18, height: 18 }} />
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right" className="text-xs">
                {item.label}
              </TooltipContent>
            </Tooltip>
          );
        })}
      </nav>

      <div className="p-1.5 border-t border-border/40">
        <Tooltip>
          <TooltipTrigger asChild>
            <div><ThemeToggle /></div>
          </TooltipTrigger>
          <TooltipContent side="right" className="text-xs">
            {t('settings.appearance.theme')}
          </TooltipContent>
        </Tooltip>
      </div>
    </aside>
  );

  return (
    <TooltipProvider delayDuration={200}>
      <div className="min-h-screen flex w-full overflow-x-hidden bg-background">
        {isMobile && (
          <Button 
            variant="ghost" 
            size="icon"
            className="fixed top-3 left-3 z-50 h-10 w-10 md:hidden bg-card border border-border/50 shadow-clovely-sm"
            onClick={() => setDrawerOpen(true)}
            aria-label={t('common.menu') || 'Menu'}
          >
            <Menu className="h-4 w-4" />
          </Button>
        )}

        <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
          <SheetContent side="left" className="w-[260px] p-0" showCloseButton={true}>
            <div className="flex flex-col h-full">
              <SidebarContent />
            </div>
          </SheetContent>
        </Sheet>

        {!isMobile && <MiniSidebar />}

        <main className={cn(
          'flex-1 w-full',
          isMobile ? 'ml-0' : 'ml-[56px]'
        )}>
          <GuestBanner />
          <Outlet />
        </main>
        
        <UpgradeModal 
          open={upgradeModalOpen}
          onClose={() => setUpgradeModalOpen(false)}
          onStartTrial={handleStartTrial}
        />
      </div>
    </TooltipProvider>
  );
}
