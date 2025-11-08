import { useState } from 'react';
import { 
  User, Lock, Bell, Palette, CreditCard, Shield, 
  Link as LinkIcon, Bot, Download, Trash2 
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ProfileSection } from '@/components/settings/ProfileSection';
import { SecuritySection } from '@/components/settings/SecuritySection';
import { NotificationsSection } from '@/components/settings/NotificationsSection';
import { AppearanceSection } from '@/components/settings/AppearanceSection';

type SettingSection = 
  | 'profile' 
  | 'security' 
  | 'notifications' 
  | 'appearance' 
  | 'subscription' 
  | 'privacy' 
  | 'integrations' 
  | 'coach';

const navigation = [
  { id: 'profile', label: 'Perfil', icon: User },
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
      case 'security':
        return <SecuritySection />;
      case 'notifications':
        return <NotificationsSection />;
      case 'appearance':
        return <AppearanceSection />;
      case 'subscription':
        return (
          <Card>
            <CardContent className="p-6">
              <p className="text-muted-foreground">Sección de suscripción en desarrollo...</p>
            </CardContent>
          </Card>
        );
      case 'privacy':
        return (
          <Card>
            <CardContent className="p-6">
              <p className="text-muted-foreground">Sección de privacidad en desarrollo...</p>
            </CardContent>
          </Card>
        );
      case 'integrations':
        return (
          <Card>
            <CardContent className="p-6">
              <p className="text-muted-foreground">Sección de integraciones en desarrollo...</p>
            </CardContent>
          </Card>
        );
      case 'coach':
        return (
          <Card>
            <CardContent className="p-6">
              <p className="text-muted-foreground">Preferencias del coach en desarrollo...</p>
            </CardContent>
          </Card>
        );
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
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors hover:bg-accent text-muted-foreground hover:text-foreground"
            >
              <Download className="h-5 w-5" />
              <span className="font-medium">Exportar datos</span>
            </button>

            <button
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors hover:bg-destructive/10 text-destructive"
            >
              <Trash2 className="h-5 w-5" />
              <span className="font-medium">Eliminar cuenta</span>
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
