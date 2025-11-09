import { useState } from 'react';
import { 
  User, Lock, Bell, Palette, CreditCard, Shield, 
  Link as LinkIcon, Bot, Download, Trash2, Briefcase 
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ProfileSection } from '@/components/settings/ProfileSection';
import { SecuritySection } from '@/components/settings/SecuritySection';
import { NotificationsSection } from '@/components/settings/NotificationsSection';
import { AppearanceSection } from '@/components/settings/AppearanceSection';
import { SubscriptionSection } from '@/components/settings/SubscriptionSection';
import { PrivacySection } from '@/components/settings/PrivacySection';
import { IntegrationsSection } from '@/components/settings/IntegrationsSection';
import { CoachSection } from '@/components/settings/CoachSection';
import { AccountSection } from '@/components/settings/AccountSection';
import { RoleSection } from '@/components/settings/RoleSection';

type SettingSection = 
  | 'profile' 
  | 'role'
  | 'security' 
  | 'notifications' 
  | 'appearance' 
  | 'subscription' 
  | 'privacy' 
  | 'integrations' 
  | 'coach'
  | 'account';

const navigation = [
  { id: 'profile', label: 'Perfil', icon: User },
  { id: 'role', label: 'Rol Profesional', icon: Briefcase },
  { id: 'security', label: 'Seguridad', icon: Lock },
  { id: 'notifications', label: 'Notificaciones', icon: Bell },
  { id: 'appearance', label: 'Apariencia', icon: Palette },
  { id: 'subscription', label: 'Suscripción', icon: CreditCard },
  { id: 'privacy', label: 'Privacidad', icon: Shield },
  { id: 'integrations', label: 'Integraciones', icon: LinkIcon },
  { id: 'coach', label: 'Coach IA', icon: Bot },
] as const;

export default function Settings() {
  const [activeSection, setActiveSection] = useState<SettingSection>('profile');

  const renderContent = () => {
    switch (activeSection) {
      case 'profile':
        return <ProfileSection />;
      case 'role':
        return <RoleSection />;
      case 'security':
        return <SecuritySection />;
      case 'notifications':
        return <NotificationsSection />;
      case 'appearance':
        return <AppearanceSection />;
      case 'subscription':
        return <SubscriptionSection />;
      case 'privacy':
        return <PrivacySection />;
      case 'integrations':
        return <IntegrationsSection />;
      case 'coach':
        return <CoachSection />;
      case 'account':
        return <AccountSection />;
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Configuración</h1>
        <p className="text-muted-foreground">
          Administra tu cuenta y personaliza tu experiencia en Clovely
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Navigation */}
        <aside className="w-full md:w-64 space-y-1">
          <nav className="sticky top-6">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id as SettingSection)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'hover:bg-accent text-muted-foreground hover:text-foreground'
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
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                activeSection === 'account'
                  ? 'bg-accent text-foreground'
                  : 'hover:bg-accent text-muted-foreground hover:text-foreground'
              }`}
            >
              <Download className="h-5 w-5" />
              <span className="font-medium">Cuenta</span>
            </button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}
