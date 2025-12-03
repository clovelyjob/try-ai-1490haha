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
}

export default function TemplateSelector({ value, onChange }: TemplateSelectorProps) {
  const templates: { value: CVTemplate; label: string; description: string }[] = [
    { value: 'harvard', label: 'Harvard', description: 'Académico y formal' },
    { value: 'modern', label: 'Moderno', description: 'Corporate y profesional' },
    { value: 'minimal', label: 'Minimal', description: 'Limpio y elegante' },
    { value: 'creative', label: 'Creativo', description: 'Diseño e innovación' },
    { value: 'executive', label: 'Ejecutivo', description: 'C-Level y directivos' },
    { value: 'tech', label: 'Tech', description: 'Desarrolladores y IT' },
    { value: 'elegant', label: 'Elegante', description: 'Serif sofisticado' },
    { value: 'simple', label: 'Simple', description: 'Básico y directo' },
    { value: 'cascade', label: 'Cascade', description: 'Dos columnas dinámico' },
    { value: 'ats', label: 'ATS-Friendly', description: 'Optimizado para ATS' },
    { value: 'professional', label: 'Professional', description: 'Corporativo clásico' },
    { value: 'bold', label: 'Bold', description: 'Destacado y llamativo' },
    { value: 'classic', label: 'Classic', description: 'Tradicional cronológico' },
  ];

  return (
    <Select value={value} onValueChange={(v) => onChange(v as CVTemplate)}>
      <SelectTrigger className="w-[220px]">
        <Layout className="h-4 w-4 mr-2" />
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {templates.map((template) => (
          <SelectItem key={template.value} value={template.value}>
            <div className="py-1">
              <div className="font-semibold">{template.label}</div>
              <div className="text-xs text-muted-foreground">{template.description}</div>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
