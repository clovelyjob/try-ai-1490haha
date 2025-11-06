import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Goal, GoalCategory, GoalPriority, GoalVisibility } from '@/types';
import { Sparkles, X } from 'lucide-react';
import { toast } from 'sonner';

const goalSchema = z.object({
  title: z.string().min(5, 'El título debe tener al menos 5 caracteres').max(120),
  description: z.string().max(1000).optional(),
  category: z.enum(['career', 'learning', 'wellbeing', 'networking', 'other']),
  priority: z.enum(['alta', 'media', 'baja']),
  dueDate: z.string().optional(),
  visibility: z.enum(['private', 'circle', 'public']),
  progressTarget: z.number().min(0).max(100).optional(),
});

type GoalFormData = z.infer<typeof goalSchema>;

interface NewGoalModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (goal: Goal) => void;
}

const templates = [
  {
    id: 1,
    title: 'Preparar portfolio UX en 30 días',
    category: 'career' as GoalCategory,
    description: 'Crear un portfolio profesional que destaque tus mejores proyectos',
  },
  {
    id: 2,
    title: 'Completar curso SQL básico en 4 semanas',
    category: 'learning' as GoalCategory,
    description: 'Dominar fundamentos de SQL y bases de datos relacionales',
  },
  {
    id: 3,
    title: 'Conseguir primera entrevista tech en 14 días',
    category: 'career' as GoalCategory,
    description: 'Aplicar a posiciones y conseguir al menos una entrevista',
  },
  {
    id: 4,
    title: 'Mejorar LinkedIn y networking en 10 días',
    category: 'networking' as GoalCategory,
    description: 'Optimizar perfil y conectar con profesionales del sector',
  },
];

export const NewGoalModal = ({ open, onClose, onSave }: NewGoalModalProps) => {
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [useTemplate, setUseTemplate] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    setValue,
    watch,
    reset,
  } = useForm<GoalFormData>({
    resolver: zodResolver(goalSchema),
    defaultValues: {
      category: 'career',
      priority: 'media',
      visibility: 'private',
      progressTarget: 100,
    },
  });

  const category = watch('category');
  const priority = watch('priority');
  const visibility = watch('visibility');

  const handleClose = () => {
    reset();
    setTags([]);
    setTagInput('');
    setUseTemplate(false);
    onClose();
  };

  const onSubmit = (data: GoalFormData) => {
    const newGoal: Goal = {
      id: Date.now().toString(),
      title: data.title,
      description: data.description,
      category: data.category,
      priority: data.priority,
      createdAt: new Date().toISOString(),
      dueDate: data.dueDate,
      visibility: data.visibility,
      status: 'pending',
      progress: 0,
      progressTarget: data.progressTarget,
      microactions: [],
      tags,
      relatedSkills: [],
      repeat: 'none',
      ownerId: '1',
      history: [
        {
          action: 'created',
          by: 'user',
          at: new Date().toISOString(),
        },
      ],
    };

    onSave(newGoal);
    toast.success('🎯 Objetivo creado (+20 XP)');
    handleClose();
  };

  const applyTemplate = (template: typeof templates[0]) => {
    setValue('title', template.title);
    setValue('description', template.description);
    setValue('category', template.category);
    setUseTemplate(false);
  };

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Nuevo objetivo</DialogTitle>
          <DialogDescription>
            Define tu objetivo y te ayudaremos a alcanzarlo paso a paso
          </DialogDescription>
        </DialogHeader>

        {/* AI Templates */}
        {!useTemplate ? (
          <Button
            type="button"
            variant="outline"
            onClick={() => setUseTemplate(true)}
            className="w-full"
          >
            <Sparkles className="h-4 w-4 mr-2" />
            Usar plantilla IA
          </Button>
        ) : (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Plantillas sugeridas</Label>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setUseTemplate(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {templates.map((template) => (
                <Button
                  key={template.id}
                  type="button"
                  variant="outline"
                  className="h-auto p-3 justify-start text-left"
                  onClick={() => applyTemplate(template)}
                >
                  <div>
                    <div className="font-semibold text-sm mb-1">{template.title}</div>
                    <div className="text-xs text-muted-foreground line-clamp-2">
                      {template.description}
                    </div>
                  </div>
                </Button>
              ))}
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="title">
              Título <span className="text-destructive">*</span>
            </Label>
            <Input
              id="title"
              {...register('title')}
              placeholder="Ej: Preparar portfolio profesional"
            />
            {errors.title && (
              <p className="text-sm text-destructive mt-1">{errors.title.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="description">Descripción</Label>
            <Textarea
              id="description"
              {...register('description')}
              placeholder="Describe tu objetivo..."
              rows={3}
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="category">
                Categoría <span className="text-destructive">*</span>
              </Label>
              <Select value={category} onValueChange={(v) => setValue('category', v as GoalCategory)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="career">Carrera</SelectItem>
                  <SelectItem value="learning">Aprendizaje</SelectItem>
                  <SelectItem value="wellbeing">Bienestar</SelectItem>
                  <SelectItem value="networking">Networking</SelectItem>
                  <SelectItem value="other">Otro</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="priority">
                Prioridad <span className="text-destructive">*</span>
              </Label>
              <Select value={priority} onValueChange={(v) => setValue('priority', v as GoalPriority)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="alta">Alta</SelectItem>
                  <SelectItem value="media">Media</SelectItem>
                  <SelectItem value="baja">Baja</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="visibility">Visibilidad</Label>
              <Select value={visibility} onValueChange={(v) => setValue('visibility', v as GoalVisibility)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="private">Privado</SelectItem>
                  <SelectItem value="circle">Círculo</SelectItem>
                  <SelectItem value="public">Público</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="dueDate">Fecha objetivo</Label>
              <Input id="dueDate" type="date" {...register('dueDate')} />
            </div>

            <div>
              <Label htmlFor="progressTarget">Meta de progreso (%)</Label>
              <Input
                id="progressTarget"
                type="number"
                min="0"
                max="100"
                {...register('progressTarget', { valueAsNumber: true })}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="tags">Etiquetas</Label>
            <div className="flex gap-2">
              <Input
                id="tags"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                placeholder="Agregar etiqueta..."
              />
              <Button type="button" variant="secondary" onClick={addTag}>
                Agregar
              </Button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="gap-1">
                    {tag}
                    <button type="button" onClick={() => removeTag(tag)}>
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={!isValid}>
              Guardar objetivo
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
