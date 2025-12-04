import { useState } from 'react';
import { 
  User, Lock, Bell, Palette, CreditCard, Shield, 
  Link as LinkIcon, Bot, Download, Trash2, Briefcase, Globe 
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useIsMobile } from '@/hooks/use-mobile';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { ProfileSection } from '@/components/settings/ProfileSection';
import { SecuritySection } from '@/components/settings/SecuritySection';
import { NotificationsSection } from '@/components/settings/NotificationsSection';
import { NotificationsSettings } from '@/components/settings/NotificationsSettings';
import { AppearanceSection } from '@/components/settings/AppearanceSection';
import { SubscriptionSection } from '@/components/settings/SubscriptionSection';
import { PrivacySection } from '@/components/settings/PrivacySection';
import { IntegrationsSection } from '@/components/settings/IntegrationsSection';
import { LanguageSection } from '@/components/settings/LanguageSection';
import { AccountSection } from '@/components/settings/AccountSection';
import { RoleSection } from '@/components/settings/RoleSection';

type SettingSection = 
  | 'profile' 
  | 'role'
  | 'security' 
  | 'notifications' 
  | 'appearance' 
  | 'language'
  | 'subscription' 
  | 'privacy' 
  | 'integrations' 
  | 'account';

const navigation = [
  { id: 'profile', label: 'Perfil', icon: User },
  { id: 'role', label: 'Rol Profesional', icon: Briefcase },
  { id: 'security', label: 'Seguridad', icon: Lock },
  { id: 'notifications', label: 'Notificaciones', icon: Bell },
  { id: 'appearance', label: 'Apariencia', icon: Palette },
  { id: 'language', label: 'Idioma', icon: Globe },
  { id: 'subscription', label: 'Suscripción', icon: CreditCard },
  { id: 'privacy', label: 'Privacidad', icon: Shield },
  { id: 'integrations', label: 'Integraciones', icon: LinkIcon },
] as const;

export default function Settings() {
  const [activeSection, setActiveSection] = useState<SettingSection>('profile');
  const isMobile = useIsMobile();

  const renderContent = () => {
    switch (activeSection) {
      case 'profile':
        return <ProfileSection />;
      case 'role':
        return <RoleSection />;
      case 'security':
        return <SecuritySection />;
      case 'notifications':
        return (
          <>
            <NotificationsSettings />
            <NotificationsSection />
          </>
        );
      case 'appearance':
        return <AppearanceSection />;
      case 'language':
        return <LanguageSection />;
      case 'subscription':
        return <SubscriptionSection />;
      case 'privacy':
        return <PrivacySection />;
      case 'integrations':
        return <IntegrationsSection />;
      case 'account':
        return <AccountSection />;
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 py-6 max-w-7xl">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">Configuración</h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Administra tu cuenta y personaliza tu experiencia en Clovely
        </p>
      </div>

      {isMobile ? (
        /* Mobile: Horizontal Tabs */
        <div className="space-y-6">
          <ScrollArea className="w-full whitespace-nowrap">
            <Tabs value={activeSection} onValueChange={(value) => setActiveSection(value as SettingSection)}>
              <TabsList className="inline-flex h-auto w-auto p-1 bg-muted/50">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  return (
                    <TabsTrigger
                      key={item.id}
                      value={item.id}
                      className="min-h-[44px] px-3 sm:px-4 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                    >
                      <Icon className="h-4 w-4 mr-2" />
                      <span className="text-xs sm:text-sm">{item.label}</span>
                    </TabsTrigger>
                  );
                })}
                <TabsTrigger
                  value="account"
                  className="min-h-[44px] px-3 sm:px-4 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  <Download className="h-4 w-4 mr-2" />
                  <span className="text-xs sm:text-sm">Cuenta</span>
                </TabsTrigger>
              </TabsList>
            </Tabs>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>

          <main className="min-w-0">
            {renderContent()}
          </main>
        </div>
      ) : (
        /* Desktop: Sidebar Navigation */
        <div className="flex flex-col md:flex-row gap-8">
          <aside className="w-full md:w-64 space-y-1">
            <nav className="sticky top-6">
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = activeSection === item.id;

                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveSection(item.id as SettingSection)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-300 min-h-[44px] ${
                      isActive
                        ? 'bg-primary text-primary-foreground shadow-clovely-md'
                        : 'hover:bg-accent/50 text-muted-foreground hover:text-foreground hover:shadow-clovely-sm'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="font-medium">{item.label}</span>
                  </button>
                );
              })}

              <Separator className="my-4" />

              <button
                onClick={() => setActiveSection('account' as SettingSection)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-300 min-h-[44px] ${
                  activeSection === 'account'
                    ? 'bg-accent text-foreground shadow-clovely-sm'
                    : 'hover:bg-accent/50 text-muted-foreground hover:text-foreground'
                }`}
              >
                <Download className="h-5 w-5" />
                <span className="font-medium">Cuenta</span>
              </button>
            </nav>
          </aside>

          <main className="flex-1 min-w-0">
            {renderContent()}
          </main>
        </div>
      )}
    </div>
  );
}
