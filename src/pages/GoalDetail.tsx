import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ProgressWidget } from '@/components/goals/ProgressWidget';
import { useGoalsStore } from '@/store/useGoalsStore';
import { useProgressStore } from '@/store/useProgressStore';
import {
  ArrowLeft,
  MoreVertical,
  Edit,
  Copy,
  Trash2,
  CheckCircle2,
  Plus,
  Sparkles,
  Calendar,
  Tag,
  Eye,
  Circle,
  Clock,
} from 'lucide-react';
import { toast } from 'sonner';
import Confetti from 'react-confetti';

export default function GoalDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { goals, updateGoal, toggleMicroaction, addMicroaction, updateGoalStatus, calculateProgress } = useGoalsStore();
  const { addXP, addCoins } = useProgressStore();
  
  const [showConfetti, setShowConfetti] = useState(false);
  const [newMicroactionTitle, setNewMicroactionTitle] = useState('');
  const [editingDescription, setEditingDescription] = useState(false);

  const goal = goals.find((g) => g.id === id);

  if (!goal) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Objetivo no encontrado</h2>
          <Button onClick={() => navigate('/dashboard/goals')}>
                <ArrowLeft className="h-4 w-4 mr-2" />
            Volver a objetivos
          </Button>
        </div>
      </div>
    );
  }

  const completedMicroactions = goal.microactions.filter((m) => m.completed).length;
  const totalMicroactions = goal.microactions.length;

  const handleToggleMicroaction = (microactionId: string) => {
    const microaction = goal.microactions.find((m) => m.id === microactionId);
    if (!microaction) return;

    toggleMicroaction(goal.id, microactionId);
    
    if (!microaction.completed) {
      addXP(microaction.xp || 5);
      addCoins(2);
      toast.success(`✅ Microacción completada (+${microaction.xp || 5} XP)`);
    }

    // Check if goal is now complete
    const newProgress = calculateProgress(goal.id);
    if (newProgress === 100 && goal.status !== 'completed') {
      setTimeout(() => {
        updateGoalStatus(goal.id, 'completed');
        addXP(100);
        addCoins(40);
        setShowConfetti(true);
        toast.success('🏆 ¡Objetivo alcanzado! +100 XP +40 Coins');
        setTimeout(() => setShowConfetti(false), 5000);
      }, 500);
    }
  };

  const handleAddMicroaction = () => {
    if (!newMicroactionTitle.trim() || newMicroactionTitle.length < 3) {
      toast.error('La microacción debe tener al menos 3 caracteres');
      return;
    }

    const newMicroaction = {
      id: `${Date.now()}`,
      title: newMicroactionTitle,
      completed: false,
      createdAt: new Date().toISOString(),
      xp: 5,
    };

    addMicroaction(goal.id, newMicroaction);
    setNewMicroactionTitle('');
    toast.success('Microacción agregada');
  };

  const handleMarkAsCompleted = () => {
    if (confirm('¿Marcar este objetivo como completado?')) {
      updateGoalStatus(goal.id, 'completed');
      updateGoal(goal.id, { progress: 100 });
      addXP(100);
      addCoins(40);
      setShowConfetti(true);
      toast.success('🏆 ¡Objetivo alcanzado! +100 XP +40 Coins');
      setTimeout(() => setShowConfetti(false), 5000);
    }
  };

  const categoryColors = {
    career: 'bg-orange-500/10 text-orange-500',
    learning: 'bg-blue-500/10 text-blue-500',
    wellbeing: 'bg-green-500/10 text-green-500',
    networking: 'bg-purple-500/10 text-purple-500',
    other: 'bg-gray-500/10 text-gray-500',
  };

  const statusColors = {
    pending: 'bg-gray-500/10 text-gray-600',
    in_progress: 'bg-blue-500/10 text-blue-600',
    paused: 'bg-yellow-500/10 text-yellow-600',
    completed: 'bg-green-500/10 text-green-600',
    abandoned: 'bg-red-500/10 text-red-600',
  };

  return (
    <>
      {showConfetti && <Confetti recycle={false} numberOfPieces={500} />}
      
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          {/* Breadcrumb */}
          <Breadcrumb className="mb-6">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to="/dashboard/goals">Objetivos</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{goal.title}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <Badge variant="outline" className={categoryColors[goal.category]}>
                    {goal.category}
                  </Badge>
                  <Badge variant="outline" className={statusColors[goal.status]}>
                    {goal.status.replace('_', ' ')}
                  </Badge>
                  <Badge variant="outline">
                    Prioridad: {goal.priority}
                  </Badge>
                </div>
                <h1 className="font-heading text-4xl font-bold mb-2">{goal.title}</h1>
              </div>
              <div className="flex gap-2">
                <Button variant="outline">
                  <Edit className="h-4 w-4 mr-2" />
                  Editar
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Copy className="h-4 w-4 mr-2" />
                      Duplicar
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Trash2 className="h-4 w-4 mr-2" />
                      Eliminar
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Info */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="space-y-6"
            >
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Información</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {goal.dueDate && (
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <div className="text-sm font-medium">Fecha objetivo</div>
                        <div className="text-sm text-muted-foreground">
                          {new Date(goal.dueDate).toLocaleDateString('es-ES', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-2">
                    <Eye className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="text-sm font-medium">Visibilidad</div>
                      <div className="text-sm text-muted-foreground">{goal.visibility}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="text-sm font-medium">Creado</div>
                      <div className="text-sm text-muted-foreground">
                        {new Date(goal.createdAt).toLocaleDateString('es-ES')}
                      </div>
                    </div>
                  </div>

                  {goal.tags && goal.tags.length > 0 && (
                    <div>
                      <div className="text-sm font-medium mb-2 flex items-center gap-2">
                        <Tag className="h-4 w-4 text-muted-foreground" />
                        Etiquetas
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {goal.tags.map((tag) => (
                          <Badge key={tag} variant="secondary">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Historial</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {goal.history.slice(-5).reverse().map((entry, i) => (
                      <div key={i} className="flex gap-2 text-sm">
                        <Circle className="h-4 w-4 text-muted-foreground mt-0.5" />
                        <div>
                          <div className="font-medium">{entry.action}</div>
                          <div className="text-xs text-muted-foreground">
                            {new Date(entry.at).toLocaleString('es-ES')}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Center Column - Work */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-1 space-y-6"
            >
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Descripción</CardTitle>
                </CardHeader>
                <CardContent>
                  {editingDescription ? (
                    <div className="space-y-2">
                      <Textarea
                        value={goal.description || ''}
                        onChange={(e) => updateGoal(goal.id, { description: e.target.value })}
                        rows={4}
                      />
                      <Button size="sm" onClick={() => setEditingDescription(false)}>
                        Guardar
                      </Button>
                    </div>
                  ) : (
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {goal.description || 'Sin descripción'}
                      </p>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setEditingDescription(true)}
                      >
                        <Edit className="h-3 w-3 mr-2" />
                        Editar
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">
                      Microacciones ({completedMicroactions}/{totalMicroactions})
                    </CardTitle>
                    <Button size="sm" variant="outline">
                      <Sparkles className="h-4 w-4 mr-2" />
                      Generar con IA
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 mb-4">
                    {goal.microactions.map((microaction) => (
                      <div
                        key={microaction.id}
                        className={`flex items-start gap-3 p-3 rounded-lg border ${
                          microaction.completed ? 'opacity-60' : ''
                        }`}
                      >
                        <Checkbox
                          checked={microaction.completed}
                          onCheckedChange={() => handleToggleMicroaction(microaction.id)}
                          className="mt-1"
                        />
                        <div className="flex-1">
                          <div
                            className={`font-medium ${
                              microaction.completed ? 'line-through' : ''
                            }`}
                          >
                            {microaction.title}
                          </div>
                          {microaction.dueDate && (
                            <div className="text-xs text-muted-foreground mt-1">
                              {new Date(microaction.dueDate).toLocaleDateString('es-ES')}
                            </div>
                          )}
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          +{microaction.xp || 5} XP
                        </Badge>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <Input
                      placeholder="Nueva microacción..."
                      value={newMicroactionTitle}
                      onChange={(e) => setNewMicroactionTitle(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleAddMicroaction()}
                    />
                    <Button onClick={handleAddMicroaction}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Right Column - Progress & AI */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-6"
            >
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Progreso</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center">
                  <ProgressWidget
                    progress={goal.progress}
                    completedMicroactions={completedMicroactions}
                    totalMicroactions={totalMicroactions}
                  />
                  {goal.status !== 'completed' && (
                    <Button
                      onClick={handleMarkAsCompleted}
                      className="w-full mt-6"
                      disabled={goal.progress < 80}
                    >
                      <CheckCircle2 className="h-4 w-4 mr-2" />
                      Marcar como completado
                    </Button>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-primary" />
                    Recomendaciones IA
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="p-3 rounded-lg bg-muted/50 border">
                    <div className="font-medium text-sm mb-1">Agrega detalles visuales</div>
                    <div className="text-xs text-muted-foreground mb-2">
                      Incluye capturas o mockups de tus proyectos
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      +15 XP · 30 min
                    </Badge>
                  </div>

                  <div className="p-3 rounded-lg bg-muted/50 border">
                    <div className="font-medium text-sm mb-1">Optimiza para SEO</div>
                    <div className="text-xs text-muted-foreground mb-2">
                      Mejora meta tags y performance del sitio
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      +10 XP · 20 min
                    </Badge>
                  </div>

                  <Button variant="outline" className="w-full" size="sm">
                    Aplicar sugerencias
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
}
