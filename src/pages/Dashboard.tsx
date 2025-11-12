import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { UpgradeModal } from '@/components/UpgradeModal';
import { GuestBanner } from '@/components/GuestBanner';
import { useAuthStore } from '@/store/useAuthStore';
import { useProgressStore } from '@/store/useProgressStore';
import { useProfileStore } from '@/store/useProfileStore';
import { QUOTES } from '@/lib/constants';
import WeeklyPlanWidget from '@/components/WeeklyPlanWidget';
import CareerCopilot from '@/components/CareerCopilot';
import { getDashboardConfig } from '@/lib/dashboardContent';
import { toast } from 'sonner';
import {
  Briefcase, Bell, TrendingUp, Flame,
  ArrowRight, CheckCircle2, Circle, Clock,
  RefreshCw, Zap, Bot,
} from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuthStore();
  const { progress, addXP, completeTask } = useProgressStore();
  const { profile } = useProfileStore();
  const [quote, setQuote] = useState(QUOTES[0]);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [upgradeModalOpen, setUpgradeModalOpen] = useState(false);
  const [tasks, setTasks] = useState([
    { id: 1, time: '9:00', title: 'Check-in diario', xp: 10, completed: true, action: '/dashboard/coach' },
    { id: 2, time: '10:00', title: 'Actualizar sección de experiencia en CV', xp: 50, completed: false, action: '/dashboard/cvs' },
    { id: 3, time: '2:00 PM', title: 'Leer artículo sobre tendencias UX', xp: 25, completed: false, action: '/dashboard/coach' },
    { id: 4, time: '4:00 PM', title: 'Conectar con 3 profesionales en LinkedIn', xp: 30, completed: false, action: '/dashboard/circles' },
    { id: 5, time: '6:00 PM', title: 'Aplicar a Product Designer en Rappi', xp: 100, completed: false, featured: true, match: 89, action: '/dashboard/opportunities' },
  ]);

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'match',
      title: 'Nueva oportunidad perfecta',
      message: 'Product Designer en Mercado Libre - 94% match',
      time: 'Hace 2h',
      read: false,
      icon: '🎯',
    },
    {
      id: 2,
      type: 'achievement',
      title: '¡Nuevo logro desbloqueado!',
      message: 'Completaste 5 días seguidos - Racha de fuego 🔥',
      time: 'Hace 5h',
      read: false,
      icon: '🏆',
    },
    {
      id: 3,
      type: 'reminder',
      title: 'Recordatorio de entrevista',
      message: 'Practica para tu entrevista de mañana',
      time: 'Ayer',
      read: true,
      icon: '📅',
    },
  ]);
  
  const roleConfig = profile?.rolActual ? getDashboardConfig(profile.rolActual) : getDashboardConfig('other');

  useEffect(() => {
    setQuote(QUOTES[Math.floor(Math.random() * QUOTES.length)]);
  }, []);

  const refreshQuote = () => {
    setQuote(QUOTES[Math.floor(Math.random() * QUOTES.length)]);
  };

  const todayTasks = tasks;

  const opportunities = roleConfig.opportunities || [];

  const circleFeed = [
    { user: 'Carlos R.', action: 'Completó React Advanced', time: '2h', icon: '🎉' },
    { user: 'María G.', action: 'Alcanzó Nivel 5', time: '5h', icon: '🏆' },
    { user: 'Grupo', action: 'Completó reto semanal +200 XP', time: 'ayer', icon: '✅' },
  ];

  const resources = roleConfig.resources;

  const handleTaskComplete = (taskId: number, xp: number) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, completed: true } : task
    ));
    addXP(xp);
    completeTask();
    toast.success(`¡Tarea completada! +${xp} XP ganados`, {
      description: `Tu racha continúa: ${progress.streak} días`,
    });
  };

  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map(notification => ({ ...notification, read: true })));
    toast.success('Todas las notificaciones marcadas como leídas');
  };

  if (!progress) return null;

  const xpPercentage = (progress.currentXP / progress.nextLevelXP) * 100;

  return (
    <div className="min-h-screen bg-background max-w-full overflow-x-hidden">
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
              <Popover open={notificationsOpen} onOpenChange={setNotificationsOpen}>
                <PopoverTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="relative hover-lift"
                  >
                    <Bell className="h-5 w-5" />
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-destructive text-white text-xs rounded-full flex items-center justify-center animate-pulse">
                      {notifications.filter(n => !n.read).length}
                    </span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80 p-0" align="end">
                  <div className="border-b p-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-heading font-bold">Notificaciones</h3>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-xs"
                        onClick={handleMarkAllAsRead}
                      >
                        Marcar todo como leído
                      </Button>
                    </div>
                  </div>
                  <div className="max-h-[400px] overflow-y-auto">
                    {notifications.map((notification) => (
                      <motion.div
                        key={notification.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={`p-4 border-b hover:bg-accent cursor-pointer transition-colors ${
                          !notification.read ? 'bg-primary/5' : ''
                        }`}
                        onClick={() => {
                          toast.info('Notificación abierta');
                          setNotificationsOpen(false);
                        }}
                      >
                        <div className="flex gap-3">
                          <div className="text-2xl">{notification.icon}</div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2 mb-1">
                              <p className="font-semibold text-sm">{notification.title}</p>
                              {!notification.read && (
                                <div className="w-2 h-2 rounded-full bg-primary shrink-0 mt-1" />
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {notification.message}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {notification.time}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                  <div className="p-3 border-t">
                    <Button 
                      variant="ghost" 
                      className="w-full text-sm hover-lift"
                      onClick={() => {
                        toast.info('Ver todas las notificaciones');
                        setNotificationsOpen(false);
                      }}
                    >
                      Ver todas las notificaciones
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="p-6 space-y-6 max-w-full overflow-x-hidden">
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

          {/* Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Progreso semanal</span>
                <TrendingUp className="h-4 w-4 text-success" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Badge className="gradient-orange text-white">En marcha</Badge>
                </div>
                <div className="text-xs text-muted-foreground">15 de 20 tareas completadas</div>
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Racha</span>
                <Flame className="h-4 w-4 text-primary" />
              </div>
              <div className="space-y-2">
                <div className="flex items-end gap-2">
                  <span className="text-3xl font-heading font-bold flex items-center gap-1">
                    🔥 {progress.streak}
                  </span>
                  <span className="text-sm text-muted-foreground mb-1">días</span>
                </div>
                <div className="text-xs text-muted-foreground">
                  Mejor racha: {progress.longestStreak} días
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Nivel</span>
                <Zap className="h-4 w-4 text-secondary" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-3xl font-heading font-bold">{progress.level}</span>
                  <Badge variant="secondary" className="text-xs">
                    {progress.level < 5 ? 'Novato' : progress.level < 10 ? 'En crecimiento' : 'Experto'}
                  </Badge>
                </div>
                <div className="text-xs text-muted-foreground">
                  {progress.currentXP} de {progress.nextLevelXP} XP para subir
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Aplicaciones</span>
                <Briefcase className="h-4 w-4 text-accent" />
              </div>
              <div className="space-y-2">
                <div className="flex items-end gap-2">
                  <span className="text-3xl font-heading font-bold">8</span>
                  <span className="text-sm text-muted-foreground mb-1">esta semana</span>
                </div>
                <div className="text-xs text-muted-foreground">
                  {progress.applications} totales
                </div>
              </div>
            </Card>
          </div>

          {/* Main Grid */}
          <div className="grid lg:grid-cols-3 gap-6 max-w-full overflow-hidden">
            {/* Left Column - Tasks & Coach */}
            <div className="lg:col-span-2 space-y-6">
              {/* Tu día */}
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-heading font-bold">Tu día</h2>
                  <Badge variant="secondary">{tasks.filter(t => !t.completed).length} pendientes</Badge>
                </div>
                <div className="space-y-2">
                  {tasks.map((task) => (
                    <motion.div
                      key={task.id}
                      className={`p-4 rounded-lg border transition-all ${
                        task.completed ? 'bg-muted/50 opacity-60' : 'hover:shadow-md'
                      } ${task.featured ? 'border-primary bg-primary/5' : ''}`}
                    >
                      <div className="flex items-start gap-3">
                        <button
                          onClick={() => !task.completed && handleTaskComplete(task.id, task.xp)}
                          disabled={task.completed}
                          className={`mt-0.5 transition-all duration-300 hover:scale-110 active:scale-95 ${
                            task.completed ? 'text-success cursor-default' : 'text-muted-foreground hover:text-primary cursor-pointer'
                          }`}
                        >
                          {task.completed ? (
                            <CheckCircle2 className="h-5 w-5 animate-scale-in" />
                          ) : (
                            <Circle className="h-5 w-5 hover:fill-primary/20" />
                          )}
                        </button>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <Clock className="h-3 w-3 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">{task.time}</span>
                            {task.match && (
                              <Badge variant="secondary" className="text-xs">
                                ⭐ {task.match}% match
                              </Badge>
                            )}
                          </div>
                          <p className={`font-medium ${task.completed ? 'line-through' : ''}`}>
                            {task.title}
                          </p>
                        </div>
                        <div className="text-right">
                          <Badge className="gradient-orange text-white">
                            +{task.xp} XP
                          </Badge>
                          {!task.completed && (
                            <Link to={task.action || '#'}>
                              <Button size="sm" variant="outline" className="mt-2 hover-lift">
                                Empezar
                              </Button>
                            </Link>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </Card>

              {/* Coach IA */}
              <Card className="p-5 md:p-6 bg-white dark:bg-[#0F1115] border border-black/10 dark:border-white/10 shadow-sm transition-colors">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 dark:bg-primary/20 dark:ring-2 dark:ring-[#FF7A00]/60 flex items-center justify-center shrink-0 transition-all">
                    <Bot className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1 space-y-3">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-heading font-bold text-slate-900 dark:text-white">
                          Clovy - Tu Coach IA
                        </h3>
                        <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full bg-[#FFE7D6] text-[#C2410C] dark:bg-[#2A190F] dark:text-[#FBBF24]">
                          En línea
                        </span>
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                        ¡Hola {user?.name?.split(' ')[0]}! Llevas {progress.streak} días de racha increíble. 
                        Noté que mejoraste tu CV al 80%. ¿Practicamos una entrevista para la posición 
                        de Rappi? O podemos trabajar en tu portfolio.
                      </p>
                    </div>
                    <div className="border-t border-black/5 dark:border-white/10 pt-3" />
                    <div className="flex flex-wrap gap-2">
                      <Button 
                        size="sm" 
                        className="bg-[#3B82F6] hover:bg-[#2563EB] text-white dark:bg-[#3B82F6] dark:hover:bg-[#2563EB]"
                        aria-label="Practicar entrevista con IA"
                      >
                        🎤 Practicar entrevista
                      </Button>
                      <Button 
                        size="sm" 
                        variant="ghost"
                        className="text-slate-900 bg-slate-100 hover:bg-slate-200 dark:text-slate-100 dark:bg-[#111827] dark:hover:bg-[#1F2937]"
                        aria-label="Pedir un consejo al coach"
                      >
                        💡 Dame un consejo
                      </Button>
                      <Button 
                        size="sm" 
                        className="bg-[#3B82F6] hover:bg-[#2563EB] text-white dark:bg-[#3B82F6] dark:hover:bg-[#2563EB]"
                        aria-label="Analizar mi progreso semanal"
                      >
                        📊 Analizar progreso
                      </Button>
                      <Button 
                        size="sm" 
                        variant="ghost"
                        className="text-slate-900 hover:bg-slate-100 dark:text-slate-100 dark:hover:bg-white/5"
                        aria-label="Abrir chat del coach"
                      >
                        💬 Chat abierto
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Right Column - Opportunities, Circle, Resources */}
            <div className="space-y-6 min-w-0 overflow-hidden">
              {/* Oportunidades */}
              <Card className="p-6 overflow-hidden">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-heading font-bold">Oportunidades</h2>
                  <Link to="/dashboard/opportunities">
                    <Button variant="ghost" size="sm" className="hover-lift">
                      Ver todas <ArrowRight className="ml-1 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
                <div className="space-y-3">
                  {opportunities.map((opp, index) => (
                    <Link key={index} to="/dashboard/opportunities">
                      <div
                        className="p-4 rounded-lg border hover:shadow-md hover:border-primary/50 transition-all cursor-pointer hover-lift overflow-hidden"
                      >
                        <div className="flex items-start gap-3 min-w-0">
                          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center font-bold text-primary shrink-0">
                            {opp.logo}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <Badge variant="secondary" className="text-xs shrink-0">
                                {opp.match}% match
                              </Badge>
                            </div>
                            <p className="font-semibold text-sm mb-1 truncate">{opp.position}</p>
                            <p className="text-xs text-muted-foreground mb-1 truncate">{opp.company}</p>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground overflow-hidden">
                              <span className="truncate">{opp.salary}</span>
                              <span className="shrink-0">•</span>
                              <span className="truncate">{opp.location}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
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

              {/* Recursos */}
              <Card className="p-6">
                <h2 className="text-lg font-heading font-bold mb-4">Recursos recomendados</h2>
                <div className="space-y-3">
                  {resources.map((resource, i) => (
                    <div
                      key={i}
                      className="p-3 rounded-lg border hover:shadow-md transition-shadow cursor-pointer"
                    >
                      <div className="flex items-start gap-3">
                        <div className="text-2xl">{resource.icon}</div>
                        <div className="flex-1 min-w-0">
                          <Badge variant="secondary" className="text-xs mb-1">
                            {resource.type}
                          </Badge>
                          <p className="text-sm font-medium mb-1">{resource.title}</p>
                          <p className="text-xs text-muted-foreground">{resource.duration}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        </div>

        {/* Upgrade Modal */}
        <UpgradeModal 
          open={upgradeModalOpen} 
          onClose={() => setUpgradeModalOpen(false)}
          feature="acceso completo"
        />
      </div>
    );
  };

  export default Dashboard;
