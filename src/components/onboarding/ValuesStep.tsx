import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { VALUES } from '@/lib/constants';
import { GripVertical } from 'lucide-react';
import { DynamicIcon } from '@/components/DynamicIcon';

interface ValuesStepProps {
  selected: string[];
  onChange: (values: string[]) => void;
}

export const ValuesStep = ({ selected, onChange }: ValuesStepProps) => {
  const [draggedItem, setDraggedItem] = useState<string | null>(null);

  const toggleValue = (id: string) => {
    if (selected.includes(id)) {
      onChange(selected.filter((v) => v !== id));
    } else if (selected.length < 5) {
      onChange([...selected, id]);
    }
  };

  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedItem(id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    if (!draggedItem || draggedItem === targetId) return;

    const newSelected = [...selected];
    const draggedIndex = newSelected.indexOf(draggedItem);
    const targetIndex = newSelected.indexOf(targetId);

    newSelected.splice(draggedIndex, 1);
    newSelected.splice(targetIndex, 0, draggedItem);

    onChange(newSelected);
    setDraggedItem(null);
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-3">
        <h2 className="text-3xl font-heading font-bold">
          ¿Qué es importante para ti en un trabajo?
        </h2>
        <p className="text-muted-foreground">
          Selecciona 3-5 valores y ordénalos por prioridad
        </p>
        <Badge variant={selected.length >= 3 ? 'default' : 'secondary'}>
          {selected.length} de 5 seleccionados
        </Badge>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Available Values */}
        <div className="space-y-3">
          <h3 className="font-semibold text-sm text-muted-foreground">
            Valores disponibles
          </h3>
          <div className="grid gap-2">
            {VALUES.filter((v) => !selected.includes(v.id)).map((value) => (
              <button
                key={value.id}
                onClick={() => toggleValue(value.id)}
                className="p-3 rounded-xl border-2 hover:border-primary transition-all duration-300 text-left hover:shadow-clovely-sm hover:-translate-y-0.5"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{value.icon}</span>
                  <span className="font-medium text-sm">{value.label}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Selected Values (Draggable) */}
        <div className="space-y-3">
          <h3 className="font-semibold text-sm text-muted-foreground">
            Tu priorización (arrastra para ordenar)
          </h3>
          {selected.length === 0 ? (
            <Card className="p-8 text-center border-dashed">
              <p className="text-sm text-muted-foreground">
                Selecciona valores de la izquierda
              </p>
            </Card>
          ) : (
            <div className="space-y-2">
              {selected.map((id, index) => {
                const value = VALUES.find((v) => v.id === id);
                if (!value) return null;
                return (
                  <div
                    key={id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, id)}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, id)}
                    className="p-3 rounded-2xl border-2 bg-card cursor-move hover:shadow-clovely-lg transition-all duration-300 hover:-translate-y-1 border-primary/20"
                  >
                    <div className="flex items-center gap-3">
                      <GripVertical className="h-4 w-4 text-muted-foreground" />
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                        {index + 1}
                      </div>
                      <span className="text-2xl">{value.icon}</span>
                      <span className="font-medium text-sm flex-1">
                        {value.label}
                      </span>
                      <button
                        onClick={() => toggleValue(id)}
                        className="text-muted-foreground hover:text-destructive text-xs"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
