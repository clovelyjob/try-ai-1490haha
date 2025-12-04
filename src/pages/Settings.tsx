import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  User, Lock, Bell, Palette, CreditCard, Shield, 
  Link as LinkIcon, Download, Briefcase, Globe 
} from 'lucide-react';
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

export default function Settings() {
  const { t } = useTranslation();
  const [activeSection, setActiveSection] = useState<SettingSection>('profile');
  const isMobile = useIsMobile();

  const navigation = [
    { id: 'profile', label: t('settings.profile.title'), icon: User },
    { id: 'role', label: t('settings.role.title'), icon: Briefcase },
    { id: 'security', label: t('settings.security.title'), icon: Lock },
    { id: 'notifications', label: t('settings.notifications.title'), icon: Bell },
    { id: 'appearance', label: t('settings.appearance.title'), icon: Palette },
    { id: 'language', label: t('settings.language.title'), icon: Globe },
    { id: 'subscription', label: t('settings.subscription.title'), icon: CreditCard },
    { id: 'privacy', label: t('settings.privacy.title'), icon: Shield },
    { id: 'integrations', label: t('settings.integrations.title'), icon: LinkIcon },
  ] as const;

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
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">{t('settings.title')}</h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          {t('settings.subtitle')}
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
                  <span className="text-xs sm:text-sm">{t('settings.account.title')}</span>
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
                <span className="font-medium">{t('settings.account.title')}</span>
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
