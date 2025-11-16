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
    { value: 'harvard', label: 'Profesional', description: 'Académico y formal' },
    { value: 'modern', label: 'Moderno', description: 'Corporate y profesional' },
    { value: 'minimal', label: 'Minimal', description: 'Limpio y elegante' },
    { value: 'creative', label: 'Creativo', description: 'Diseño e innovación' },
  ];

  return (
    <Select value={value} onValueChange={(v) => onChange(v as CVTemplate)}>
      <SelectTrigger className="w-[200px]">
        <Layout className="h-4 w-4 mr-2" />
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {templates.map((template) => (
          <SelectItem key={template.value} value={template.value}>
            <div>
              <div className="font-medium">{template.label}</div>
              <div className="text-xs text-muted-foreground">{template.description}</div>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
