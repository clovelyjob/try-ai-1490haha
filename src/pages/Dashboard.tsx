import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

import { ThemeToggle } from '@/components/ThemeToggle';
import { GuestBanner } from '@/components/GuestBanner';
import { useAuthStore } from '@/store/useAuthStore';
import { useProgressStore } from '@/store/useProgressStore';
import { useProfileStore } from '@/store/useProfileStore';
import { QUOTES } from '@/lib/constants';
import WeeklyPlanWidget from '@/components/WeeklyPlanWidget';
import CareerCopilot from '@/components/CareerCopilot';
import { getDashboardConfig } from '@/lib/dashboardContent';
import {
  Home, Target, FileText, Briefcase, Mic, Users, BarChart3,
  Bot, Gift, Settings, Bell, Search, TrendingUp, Flame,
  Sparkles, ArrowRight, CheckCircle2, Circle, Clock,
  ChevronLeft, ChevronRight, RefreshCw, Zap, Trophy,
} from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuthStore();
  const { progress, addXP, completeTask } = useProgressStore();
  const { profile } = useProfileStore();
  const [quote, setQuote] = useState(QUOTES[0]);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  
  const roleConfig = profile?.rolActual ? getDashboardConfig(profile.rolActual) : getDashboardConfig('other');

  useEffect(() => {
    setQuote(QUOTES[Math.floor(Math.random() * QUOTES.length)]);
  }, []);

  const refreshQuote = () => {
    setQuote(QUOTES[Math.floor(Math.random() * QUOTES.length)]);
  };

  const navItems = [
    { icon: Home, label: 'Inicio', path: '/dashboard', active: true },
    { icon: Target, label: 'Objetivos', path: '/dashboard/goals', badge: 3 },
    { icon: FileText, label: 'CV Builder', path: '/dashboard/cvs' },
    { icon: Briefcase, label: 'Oportunidades', path: '/dashboard/opportunities', badge: 12 },
    { icon: Mic, label: 'Entrevistas', path: '/dashboard/interviews' },
    { icon: Users, label: 'Círculo', path: '/dashboard/circles', badge: 5 },
    { icon: BarChart3, label: 'Progreso', path: '/progress' },
    { icon: Bot, label: 'Coach', path: '/dashboard/coach', glow: true },
    { icon: Trophy, label: 'Recompensas', path: '/dashboard/rewards' },
    { icon: Settings, label: 'Configuración', path: '/dashboard/settings' },
  ];

  const todayTasks = [
    { id: 1, time: '9:00', title: 'Check-in diario', xp: 10, completed: true },
    { id: 2, time: '10:00', title: 'Actualizar sección de experiencia en CV', xp: 50, completed: false },
    { id: 3, time: '2:00 PM', title: 'Leer artículo sobre tendencias UX', xp: 25, completed: false },
    { id: 4, time: '4:00 PM', title: 'Conectar con 3 profesionales en LinkedIn', xp: 30, completed: false },
    { id: 5, time: '6:00 PM', title: 'Aplicar a Product Designer en Rappi', xp: 100, completed: false, featured: true, match: 89 },
  ];

  const opportunities = [
    {
      id: 1,
      company: 'Mercado Libre',
      position: 'Product Designer',
      match: 94,
      salary: '$3-4.5K',
      location: 'Remoto',
      logo: 'ML',
    },
    {
      id: 2,
      company: 'Globant',
      position: 'UX Designer Jr',
      match: 89,
      salary: '$2.5-3.5K',
      location: 'Híbrido - Bogotá',
      logo: 'GL',
    },
    {
      id: 3,
      company: 'Rappi',
      position: 'Product Designer',
      match: 87,
      salary: 'Competitivo',
      location: 'Presencial',
      logo: 'RP',
    },
  ];

  const circleFeed = [
    { user: 'Carlos R.', action: 'Completó React Advanced', time: '2h', icon: '🎉' },
    { user: 'María G.', action: 'Alcanzó Nivel 5', time: '5h', icon: '🏆' },
    { user: 'Grupo', action: 'Completó reto semanal +200 XP', time: 'ayer', icon: '✅' },
  ];

  const resources = [
    { type: 'Curso', title: 'Fundamentos de UX Design', duration: '2h', icon: '📚' },
    { type: 'Artículo', title: 'Cómo crear portfolio sin experiencia', duration: '10min', icon: '📄' },
    { type: 'Video', title: 'Mock interview: Product Designer', duration: '15min', icon: '🎥' },
  ];

  const handleTaskComplete = (taskId: number, xp: number) => {
    addXP(xp);
    completeTask();
  };

  if (!progress) return null;

  const xpPercentage = (progress.currentXP / progress.nextLevelXP) * 100;

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarCollapsed ? 'w-20' : 'w-64'
        } border-r bg-card transition-all duration-300 flex flex-col`}
      >
        {/* Logo & Collapse */}
        <div className="h-16 border-b flex items-center justify-between px-4">
          {!sidebarCollapsed && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg gradient-orange flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <span className="font-heading font-bold">Clovely</span>
            </div>
          )}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="p-2 hover:bg-accent rounded-lg"
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
                    🥉 Nivel {progress.level}
                  </Badge>
                </div>
              </div>
            )}
          </div>
          {!sidebarCollapsed && (
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Próximo nivel</span>
                <span className="font-medium">
                  {progress.currentXP}/{progress.nextLevelXP} XP
                </span>
              </div>
              <div className="flex gap-1">
                {Array.from({ length: 10 }).map((_, i) => (
                  <div
                    key={i}
                    className={`h-1.5 flex-1 rounded-full ${
                      i < Math.floor((progress.currentXP / progress.nextLevelXP) * 10)
                        ? 'bg-primary'
                        : 'bg-muted'
                    }`}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <Link
              key={item.label}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                item.active
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-accent'
              } ${item.glow ? 'relative' : ''}`}
            >
              {item.glow && (
                <div className="absolute inset-0 bg-primary/20 blur-xl rounded-lg" />
              )}
              <item.icon className={`h-5 w-5 ${sidebarCollapsed ? 'mx-auto' : ''}`} />
              {!sidebarCollapsed && (
                <>
                  <span className="flex-1 text-sm font-medium">{item.label}</span>
                  {item.badge && (
                    <Badge variant="secondary" className="text-xs">
                      {item.badge}
                    </Badge>
                  )}
                </>
              )}
            </Link>
          ))}
        </nav>

        {/* Theme Toggle & Upgrade */}
        <div className={`p-4 border-t space-y-2 ${sidebarCollapsed ? 'px-2' : ''}`}>
          <ThemeToggle />
          {!sidebarCollapsed && (
            <Button className="w-full gradient-premium text-white text-sm">
              <Sparkles className="mr-2 h-4 w-4" />
              Upgrade
            </Button>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {/* Guest Banner */}
        <GuestBanner />
        
        {/* Header */}
        <header className="h-16 border-b bg-background/95 backdrop-blur sticky top-0 z-10">
          <div className="h-full px-6 flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div>
                <h1 className="text-xl font-heading font-bold">
                  Buenos días, {user?.name?.split(' ')[0]} ✨
                </h1>
                <p className="text-sm text-muted-foreground">
                  {roleConfig.welcomeMessage}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Buscar..."
                  className="pl-10 pr-4 py-2 border rounded-lg bg-background w-64 text-sm"
                />
              </div>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-destructive text-white text-xs rounded-full flex items-center justify-center">
                  3
                </span>
              </Button>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Quote */}
          <Card className="p-4 bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/20">
            <div className="flex items-start justify-between gap-3">
              <p className="text-sm italic">&ldquo;{quote}&rdquo;</p>
              <button
                onClick={refreshQuote}
                className="text-muted-foreground hover:text-foreground"
              >
                <RefreshCw className="h-4 w-4" />
              </button>
            </div>
          </Card>

          {/* Role-Specific Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {roleConfig.metrics.map((metric, index) => {
              const MetricIcon = metric.icon;
              const isNew = progress.level === 1 && progress.currentXP === 0;
              
              return (
                <motion.div
                  key={metric.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground">{metric.label}</span>
                      <MetricIcon className="h-4 w-4 text-primary" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-end gap-2">
                        <span className="text-3xl font-heading font-bold">
                          {isNew ? '0' : Math.floor(Math.random() * 20)}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {isNew 
                          ? '¡Comienza tu viaje profesional!' 
                          : metric.description
                        }
                      </p>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          {/* Main Grid */}
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Left Column - Tasks & Coach */}
            <div className="lg:col-span-2 space-y-6">
              {/* Tareas Recomendadas según Rol */}
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-lg font-heading font-bold">Tus primeros pasos</h2>
                    <p className="text-sm text-muted-foreground mt-1">
                      Tareas personalizadas para {profile?.rolActual ? roleConfig.metrics[0].label.toLowerCase() : 'ti'}
                    </p>
                  </div>
                  <Badge variant="secondary">{roleConfig.suggestedTasks.length} tareas</Badge>
                </div>
                
                {progress.level === 1 && progress.currentXP === 0 ? (
                  <div className="text-center py-8 space-y-3">
                    <div className="w-16 h-16 rounded-full gradient-orange/10 flex items-center justify-center mx-auto">
                      <Sparkles className="h-8 w-8 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">¡Bienvenido a tu viaje profesional!</h3>
                      <p className="text-sm text-muted-foreground">
                        Aún no tienes tareas, pero ya puedes comenzar a construir tu experiencia
                      </p>
                    </div>
                  </div>
                ) : null}
                
                <div className="space-y-2">
                  {roleConfig.suggestedTasks.slice(0, 4).map((task, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-4 rounded-lg border hover:shadow-md transition-all hover:border-primary/50"
                    >
                      <div className="flex items-start gap-3">
                        <button className="mt-0.5 text-muted-foreground hover:text-primary">
                          <Circle className="h-5 w-5" />
                        </button>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="outline" className="text-xs">
                              {task.category}
                            </Badge>
                          </div>
                          <p className="font-medium">{task.title}</p>
                        </div>
                        <div className="text-right">
                          <Badge className="gradient-orange text-white">
                            +{task.xp} XP
                          </Badge>
                          <Button size="sm" variant="outline" className="mt-2">
                            Empezar
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </Card>

              {/* Coach IA */}
              <Card className="p-6 gradient-blue text-white">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                    <Bot className="h-6 w-6" />
                  </div>
                  <div className="flex-1 space-y-3">
                    <div>
                      <h3 className="font-heading font-bold mb-1">Clovy - Tu Coach IA</h3>
                      <p className="text-sm text-white/90">
                        ¡Hola {user?.name?.split(' ')[0]}! Llevas {progress.streak} días de racha increíble. 
                        Noté que mejoraste tu CV al 80%. ¿Practicamos una entrevista para la posición 
                        de Rappi? O podemos trabajar en tu portfolio.
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Button size="sm" variant="secondary">
                        🎤 Practicar entrevista
                      </Button>
                      <Button size="sm" variant="secondary">
                        💡 Dame un consejo
                      </Button>
                      <Button size="sm" variant="secondary">
                        📊 Analizar progreso
                      </Button>
                      <Button size="sm" variant="secondary">
                        💬 Chat abierto
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Right Column - Opportunities, Circle, Resources */}
            <div className="space-y-6">
              {/* Oportunidades */}
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-heading font-bold">Oportunidades</h2>
                  <Button variant="ghost" size="sm">
                    Ver todas <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                </div>
                <div className="space-y-3">
                  {opportunities.map((opp) => (
                    <div
                      key={opp.id}
                      className="p-4 rounded-lg border hover:shadow-md transition-shadow cursor-pointer"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center font-bold text-primary">
                          {opp.logo}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="secondary" className="text-xs">
                              {opp.match}% match
                            </Badge>
                          </div>
                          <p className="font-semibold text-sm mb-1">{opp.position}</p>
                          <p className="text-xs text-muted-foreground mb-1">{opp.company}</p>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span>{opp.salary}</span>
                            <span>•</span>
                            <span>{opp.location}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Círculo Feed */}
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-heading font-bold">Actividad del círculo</h2>
                </div>
                <div className="space-y-3">
                  {circleFeed.map((item, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="text-2xl">{item.icon}</div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm">
                          <span className="font-semibold">{item.user}</span>{' '}
                          {item.action}
                        </p>
                        <p className="text-xs text-muted-foreground">{item.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Recursos Personalizados */}
              <Card className="p-6">
                <div className="mb-4">
                  <h2 className="text-lg font-heading font-bold">Recursos recomendados</h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    Contenido curado para tu crecimiento profesional
                  </p>
                </div>
                <div className="space-y-3">
                  {roleConfig.resources.map((resource, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="flex items-start gap-3 p-3 rounded-lg hover:bg-accent transition-colors cursor-pointer group"
                    >
                      <span className="text-2xl">{resource.icon}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="secondary" className="text-xs">{resource.type}</Badge>
                          <span className="text-xs text-muted-foreground">{resource.duration}</span>
                        </div>
                        <p className="text-sm font-medium group-hover:text-primary transition-colors">
                          {resource.title}
                        </p>
                      </div>
                      <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0 group-hover:translate-x-1 transition-transform" />
                    </motion.div>
                  ))}
                </div>
                <Button variant="outline" className="w-full mt-4">
                  Explorar más recursos
                </Button>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
