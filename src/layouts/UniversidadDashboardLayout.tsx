import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  Users, 
  Download, 
  Settings, 
  UserCog, 
  LogOut,
  GraduationCap,
  Menu,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useAuthStore } from '@/store/useAuthStore';
import { useUniversidadStore } from '@/store/useUniversidadStore';
import { useState } from 'react';
import { cn } from '@/lib/utils';

const navItems = [
  { to: '/universidad/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/universidad/dashboard/estudiantes', icon: Users, label: 'Estudiantes' },
  { to: '/universidad/dashboard/exportar', icon: Download, label: 'Exportar' },
  { to: '/universidad/dashboard/configuracion', icon: Settings, label: 'Configuración' },
  { to: '/universidad/dashboard/administradores', icon: UserCog, label: 'Administradores' },
];

export default function UniversidadDashboardLayout() {
  const { logout } = useAuthStore();
  const { university, currentAdmin, reset } = useUniversidadStore();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    reset();
    await logout();
    navigate('/universidades');
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-72 border-r border-border flex-col bg-card">
        {/* Logo & University Name */}
        <div className="p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl gradient-orange flex items-center justify-center">
              <GraduationCap className="h-5 w-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="font-heading font-bold text-lg truncate">
                {university?.name || 'Universidad'}
              </h2>
              <p className="text-xs text-muted-foreground truncate">
                {currentAdmin?.name || 'Administrador'}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/universidad/dashboard'}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all',
                  isActive
                    ? 'bg-primary text-primary-foreground shadow-md'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                )
              }
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-border space-y-2">
          <div className="flex items-center justify-between px-4 py-2">
            <span className="text-sm text-muted-foreground">Tema</span>
            <ThemeToggle />
          </div>
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-muted-foreground hover:text-destructive"
            onClick={handleLogout}
          >
            <LogOut className="h-5 w-5" />
            Cerrar sesión
          </Button>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-background border-b border-border">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg gradient-orange flex items-center justify-center">
              <GraduationCap className="h-4 w-4 text-white" />
            </div>
            <span className="font-heading font-bold">
              {university?.name || 'Universidad'}
            </span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-background border-b border-border p-4 space-y-1"
          >
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/universidad/dashboard'}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all',
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-muted'
                  )
                }
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </NavLink>
            ))}
            <div className="pt-2 border-t border-border mt-2">
              <Button
                variant="ghost"
                className="w-full justify-start gap-3 text-muted-foreground hover:text-destructive"
                onClick={handleLogout}
              >
                <LogOut className="h-5 w-5" />
                Cerrar sesión
              </Button>
            </div>
          </motion.div>
        )}
      </div>

      {/* Main Content */}
      <main className="flex-1 lg:overflow-auto">
        <div className="lg:p-8 p-4 pt-20 lg:pt-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
