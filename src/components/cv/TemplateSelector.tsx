import { CVTemplate } from '@/types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Layout } from 'lucide-react';

interface TemplateSelectorProps {
  value: CVTemplate;
  onChange: (template: CVTemplate) => void;
  compact?: boolean;
}

export default function TemplateSelector({ value, onChange, compact = false }: TemplateSelectorProps) {
  const templates: { value: CVTemplate; label: string; description: string }[] = [
    { value: 'harvard', label: 'Harvard', description: 'Académico' },
    { value: 'modern', label: 'Moderno', description: 'Corporate' },
    { value: 'minimal', label: 'Minimal', description: 'Elegante' },
    { value: 'creative', label: 'Creativo', description: 'Innovador' },
    { value: 'executive', label: 'Ejecutivo', description: 'Directivo' },
    { value: 'tech', label: 'Tech', description: 'IT' },
    { value: 'elegant', label: 'Elegante', description: 'Sofisticado' },
    { value: 'simple', label: 'Simple', description: 'Directo' },
    { value: 'cascade', label: 'Cascade', description: '2 columnas' },
    { value: 'ats', label: 'ATS', description: 'Optimizado' },
    { value: 'professional', label: 'Professional', description: 'Clásico' },
    { value: 'bold', label: 'Bold', description: 'Llamativo' },
    { value: 'classic', label: 'Classic', description: 'Tradicional' },
  ];

  return (
    <Select value={value} onValueChange={(v) => onChange(v as CVTemplate)}>
      <SelectTrigger className={compact ? "w-full h-9 text-sm" : "w-[220px]"}>
        {!compact && <Layout className="h-4 w-4 mr-2" />}
        <SelectValue />
      </SelectTrigger>
      <SelectContent className="max-h-[300px]">
        {templates.map((template) => (
          <SelectItem key={template.value} value={template.value}>
            {compact ? (
              <span>{template.label}</span>
            ) : (
              <div className="py-1">
                <div className="font-semibold">{template.label}</div>
                <div className="text-xs text-muted-foreground">{template.description}</div>
              </div>
            )}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
