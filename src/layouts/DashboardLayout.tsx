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
  Home, FileText, Briefcase, Settings, Mic, Shield, Menu,
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
      toast.success(t('common.success'), {
        description: t('settings.subscription.trialStarted') || 'Disfruta 7 días gratis.',
      });
    } catch (error) {
      toast.error(t('common.error'));
    }
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
      items.splice(4, 0, { 
        icon: Shield, 
        label: 'Admin', 
        path: '/dashboard/admin' 
      });
    }

    return items;
  }, [isAdmin, t]);

  // Sidebar content component for the drawer
  const SidebarContent = () => (
    <>
      {/* Logo */}
      <div className="flex items-center px-4 pt-4 pb-2 border-b">
        <OfficialLogo 
          size="md"
          to="/dashboard"
          asMotion={true}
          animated={false}
        />
      </div>

      {/* User Profile */}
      <div className="p-4 border-b">
        <div className="flex items-center gap-3 mb-3">
          <Avatar className="h-10 w-10 shrink-0">
            <AvatarImage src={user?.avatar} />
            <AvatarFallback>{user?.name?.[0]}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm truncate">{user?.name}</p>
            <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-1" aria-label="Main navigation">
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
                'flex items-center gap-3 px-3 py-3 rounded-lg',
                'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
                'min-h-[44px]',
                isActive
                  ? 'bg-primary text-primary-foreground font-medium'
                  : 'hover:bg-accent text-muted-foreground hover:text-foreground'
              )}
            >
              <Icon className="h-5 w-5 flex-shrink-0" />
              <span className="flex-1 truncate">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer Actions */}
      <div className="p-3 border-t space-y-2">
        <ThemeToggle />
        {!isPremium && (
          <Button 
            className="w-full bg-primary hover:bg-primary/90 min-h-[44px]"
            size="sm"
            onClick={() => {
              setUpgradeModalOpen(true);
              setDrawerOpen(false);
            }}
          >
            Upgrade Premium
          </Button>
        )}
      </div>
    </>
  );

  // Mini sidebar for desktop - just icons
  const MiniSidebar = () => (
    <aside className="border-r bg-card/80 backdrop-blur-sm flex flex-col fixed h-screen z-40 w-[60px]">
      {/* Menu button */}
      <div className="p-2 border-b">
        <Button 
          variant="ghost" 
          size="icon"
          className="w-full h-10"
          onClick={() => setDrawerOpen(true)}
          aria-label={t('common.menu') || 'Menu'}
        >
          <Menu className="h-5 w-5" />
        </Button>
      </div>

      {/* Navigation icons */}
      <nav className="flex-1 overflow-y-auto p-2 space-y-1">
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
                    'flex items-center justify-center p-2 rounded-lg min-h-[44px]',
                    'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'hover:bg-accent text-muted-foreground hover:text-foreground'
                  )}
                >
                  <Icon className="h-5 w-5" />
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">
                {item.label}
              </TooltipContent>
            </Tooltip>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-2 border-t space-y-1">
        <Tooltip>
          <TooltipTrigger asChild>
            <div>
              <ThemeToggle />
            </div>
          </TooltipTrigger>
          <TooltipContent side="right">
            {t('settings.appearance.theme')}
          </TooltipContent>
        </Tooltip>
      </div>
    </aside>
  );

  return (
    <TooltipProvider delayDuration={200}>
      <div className="min-h-screen flex w-full overflow-x-hidden">
        {/* Mobile Hamburger Button */}
        {isMobile && (
          <Button 
            variant="ghost" 
            size="icon"
            className="fixed top-4 left-4 z-50 h-12 w-12 md:hidden bg-background/80 backdrop-blur-sm border shadow-lg"
            onClick={() => setDrawerOpen(true)}
            aria-label={t('common.menu') || 'Menu'}
          >
            <Menu className="h-6 w-6" />
          </Button>
        )}

        {/* Drawer for both mobile and desktop */}
        <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
          <SheetContent side="left" className="w-[280px] p-0" showCloseButton={true}>
            <div className="flex flex-col h-full">
              <SidebarContent />
            </div>
          </SheetContent>
        </Sheet>

        {/* Desktop Mini Sidebar */}
        {!isMobile && <MiniSidebar />}

        {/* Main Content */}
        <main className={cn(
          'flex-1 w-full',
          isMobile ? 'ml-0' : 'ml-[60px]'
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
