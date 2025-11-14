import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { GoalCard } from '@/components/goals/GoalCard';
import { NewGoalModal } from '@/components/goals/NewGoalModal';
import { useGoalsStore } from '@/store/useGoalsStore';
import { useAuthStore } from '@/store/useAuthStore';
import { useProgressStore } from '@/store/useProgressStore';
import { Goal, GoalStatus, GoalCategory, GoalPriority } from '@/types';
import { Plus, Search, Filter, Sparkles, Target } from 'lucide-react';
import { toast } from 'sonner';

const QUOTES = [
  'Convierte tus metas en logros medibles',
  'Un paso cada día te acerca a tu propósito',
  'Los objetivos claros son el primer paso al éxito',
];

export default function Goals() {
  const { user } = useAuthStore();
  const { addXP, addCoins } = useProgressStore();
  const { goals, addGoal, updateGoal, deleteGoal, duplicateGoal } = useGoalsStore();
  
  const [showNewModal, setShowNewModal] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('recent');

  const quote = QUOTES[Math.floor(Math.random() * QUOTES.length)];

  const handleCreateGoal = (goal: Goal) => {
    addGoal(goal);
    addXP(20);
    addCoins(10);
  };

  const handleEdit = (goal: Goal) => {
    setEditingGoal(goal);
    setShowNewModal(true);
  };

  const handleDuplicate = (goalId: string) => {
    duplicateGoal(goalId);
    toast.success('Objetivo duplicado');
  };

  const handleDelete = (goalId: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar este objetivo?')) {
      deleteGoal(goalId);
      toast.success('Objetivo eliminado');
    }
  };

  // Filter and sort goals
  let filteredGoals = goals.filter((goal) => {
    if (searchQuery && !goal.title.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    if (statusFilter !== 'all' && goal.status !== statusFilter) {
      return false;
    }
    if (categoryFilter !== 'all' && goal.category !== categoryFilter) {
      return false;
    }
    if (priorityFilter !== 'all' && goal.priority !== priorityFilter) {
      return false;
    }
    return true;
  });

  // Sort
  filteredGoals = [...filteredGoals].sort((a, b) => {
    switch (sortBy) {
      case 'recent':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case 'dueDate':
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      case 'progress':
        return b.progress - a.progress;
      case 'priority':
        const priorityOrder = { alta: 3, media: 2, baja: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      default:
        return 0;
    }
  });

  const activeGoals = goals.filter((g) => g.status === 'in_progress').length;
  const canCreateGoal = user?.plan === 'premium' || activeGoals < 1;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-2">
            <h1 className="font-heading text-4xl font-bold">Tus objetivos</h1>
            <Button onClick={() => setShowNewModal(true)} disabled={!canCreateGoal}>
              <Plus className="h-4 w-4 mr-2" />
              Nuevo objetivo
            </Button>
          </div>
          <p className="text-muted-foreground">{quote}</p>
        </motion.div>

        {/* Free Plan Warning */}
        {!canCreateGoal && (
          <Alert className="mb-6 border-orange-500/50 bg-orange-500/10">
            <AlertDescription>
              ⚠️ Límite de objetivos activos en plan Free. Actualiza a Premium para objetivos
              ilimitados.{' '}
              <Button variant="link" className="h-auto p-0 text-orange-500">
                Probar 7 días gratis →
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-card rounded-lg border p-4 mb-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar objetivos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="in_progress">Activos</SelectItem>
                <SelectItem value="completed">Completados</SelectItem>
                <SelectItem value="paused">Pausados</SelectItem>
                <SelectItem value="pending">Pendientes</SelectItem>
              </SelectContent>
            </Select>

            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Categoría" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                <SelectItem value="career">Carrera</SelectItem>
                <SelectItem value="learning">Aprendizaje</SelectItem>
                <SelectItem value="wellbeing">Bienestar</SelectItem>
                <SelectItem value="networking">Networking</SelectItem>
                <SelectItem value="other">Otro</SelectItem>
              </SelectContent>
            </Select>

            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Prioridad" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                <SelectItem value="alta">Alta</SelectItem>
                <SelectItem value="media">Media</SelectItem>
                <SelectItem value="baja">Baja</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="Ordenar" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Más recientes</SelectItem>
                <SelectItem value="dueDate">Próxima fecha</SelectItem>
                <SelectItem value="progress">Mayor progreso</SelectItem>
                <SelectItem value="priority">Prioridad</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </motion.div>

        {/* Goals Grid */}
        {filteredGoals.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <Target className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">
              {searchQuery || statusFilter !== 'all' || categoryFilter !== 'all'
                ? 'No se encontraron objetivos'
                : 'Aún no tienes objetivos'}
            </h3>
            <p className="text-muted-foreground mb-6">
              {searchQuery || statusFilter !== 'all' || categoryFilter !== 'all'
                ? 'Intenta ajustar los filtros'
                : 'Crea tu primer objetivo y comencemos'}
            </p>
            {!searchQuery && statusFilter === 'all' && categoryFilter === 'all' && (
              <Button onClick={() => setShowNewModal(true)} disabled={!canCreateGoal}>
                <Sparkles className="h-4 w-4 mr-2" />
                Crear objetivo con IA
              </Button>
            )}
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGoals.map((goal, index) => (
              <motion.div
                key={goal.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <GoalCard
                  goal={goal}
                  onEdit={handleEdit}
                  onDuplicate={handleDuplicate}
                  onDelete={handleDelete}
                />
              </motion.div>
            ))}
          </div>
        )}

        {/* New Goal Modal */}
        <NewGoalModal
          open={showNewModal}
          onClose={() => {
            setShowNewModal(false);
            setEditingGoal(null);
          }}
          onSave={handleCreateGoal}
        />
      </div>
    </div>
  );
}
