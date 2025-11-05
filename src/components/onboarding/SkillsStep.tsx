import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { Search, Plus, X } from 'lucide-react';

interface SkillsStepProps {
  skills: {
    technical: { name: string; level: number }[];
    soft: string[];
    languages: { name: string; level: string }[];
    tools: string[];
  };
  onChange: (skills: any) => void;
}

const POPULAR_TECHNICAL = [
  'Programación', 'Diseño', 'Análisis de datos', 'Marketing digital',
  'Product Management', 'Ventas', 'Excel', 'SEO/SEM'
];

const POPULAR_SOFT = [
  'Liderazgo', 'Comunicación', 'Trabajo en equipo', 'Creatividad',
  'Resolución de problemas', 'Adaptabilidad', 'Pensamiento crítico'
];

const POPULAR_TOOLS = [
  'Figma', 'Adobe Suite', 'Notion', 'Slack', 'Jira', 'Google Analytics',
  'Tableau', 'Python', 'JavaScript', 'SQL'
];

const LANGUAGE_LEVELS = ['Básico', 'Intermedio', 'Avanzado', 'Nativo'];

export const SkillsStep = ({ skills, onChange }: SkillsStepProps) => {
  const [searchTech, setSearchTech] = useState('');
  const [searchSoft, setSearchSoft] = useState('');
  const [searchTools, setSearchTools] = useState('');
  const [newLanguage, setNewLanguage] = useState({ name: '', level: '' });

  const addTechnicalSkill = (name: string) => {
    if (!skills.technical.find(s => s.name === name)) {
      onChange({
        ...skills,
        technical: [...skills.technical, { name, level: 50 }]
      });
    }
    setSearchTech('');
  };

  const removeTechnicalSkill = (name: string) => {
    onChange({
      ...skills,
      technical: skills.technical.filter(s => s.name !== name)
    });
  };

  const updateTechnicalLevel = (name: string, level: number) => {
    onChange({
      ...skills,
      technical: skills.technical.map(s =>
        s.name === name ? { ...s, level } : s
      )
    });
  };

  const toggleSoftSkill = (name: string) => {
    if (skills.soft.includes(name)) {
      onChange({
        ...skills,
        soft: skills.soft.filter(s => s !== name)
      });
    } else {
      onChange({
        ...skills,
        soft: [...skills.soft, name]
      });
    }
  };

  const toggleTool = (name: string) => {
    if (skills.tools.includes(name)) {
      onChange({
        ...skills,
        tools: skills.tools.filter(t => t !== name)
      });
    } else {
      onChange({
        ...skills,
        tools: [...skills.tools, name]
      });
    }
  };

  const addLanguage = () => {
    if (newLanguage.name && newLanguage.level) {
      onChange({
        ...skills,
        languages: [...skills.languages, { ...newLanguage }]
      });
      setNewLanguage({ name: '', level: '' });
    }
  };

  const removeLanguage = (name: string) => {
    onChange({
      ...skills,
      languages: skills.languages.filter(l => l.name !== name)
    });
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-3">
        <h2 className="text-3xl font-heading font-bold">
          ¿Qué habilidades tienes?
        </h2>
        <p className="text-muted-foreground">
          Añade tus skills técnicas, blandas, idiomas y herramientas
        </p>
      </div>

      <Tabs defaultValue="technical" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="technical">Técnicas</TabsTrigger>
          <TabsTrigger value="soft">Blandas</TabsTrigger>
          <TabsTrigger value="languages">Idiomas</TabsTrigger>
          <TabsTrigger value="tools">Herramientas</TabsTrigger>
        </TabsList>

        <TabsContent value="technical" className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar o añadir skill técnica..."
              value={searchTech}
              onChange={(e) => setSearchTech(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && searchTech) {
                  addTechnicalSkill(searchTech);
                }
              }}
              className="pl-10"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {POPULAR_TECHNICAL.map((skill) => (
              <Badge
                key={skill}
                variant="outline"
                className="cursor-pointer hover:bg-primary/10"
                onClick={() => addTechnicalSkill(skill)}
              >
                <Plus className="h-3 w-3 mr-1" />
                {skill}
              </Badge>
            ))}
          </div>

          <div className="space-y-3">
            {skills.technical.map((skill) => (
              <div key={skill.name} className="p-4 border rounded-lg space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{skill.name}</span>
                  <button
                    onClick={() => removeTechnicalSkill(skill.name)}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Nivel</span>
                    <span>{skill.level}%</span>
                  </div>
                  <Slider
                    value={[skill.level]}
                    onValueChange={([value]) => updateTechnicalLevel(skill.name, value)}
                    min={0}
                    max={100}
                    step={10}
                  />
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="soft" className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar habilidades blandas..."
              value={searchSoft}
              onChange={(e) => setSearchSoft(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            {POPULAR_SOFT.filter(s =>
              s.toLowerCase().includes(searchSoft.toLowerCase())
            ).map((skill) => (
              <button
                key={skill}
                onClick={() => toggleSoftSkill(skill)}
                className={`p-3 rounded-lg border-2 transition-all text-left text-sm ${
                  skills.soft.includes(skill)
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                {skill}
              </button>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="languages" className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Input
              placeholder="Idioma (ej: Inglés)"
              value={newLanguage.name}
              onChange={(e) => setNewLanguage({ ...newLanguage, name: e.target.value })}
            />
            <div className="flex gap-2">
              <select
                className="flex-1 h-10 rounded-md border border-input bg-background px-3 text-sm"
                value={newLanguage.level}
                onChange={(e) => setNewLanguage({ ...newLanguage, level: e.target.value })}
              >
                <option value="">Nivel</option>
                {LANGUAGE_LEVELS.map((level) => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
              <button
                onClick={addLanguage}
                disabled={!newLanguage.name || !newLanguage.level}
                className="px-4 rounded-md bg-primary text-primary-foreground disabled:opacity-50"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="space-y-2">
            {skills.languages.map((lang) => (
              <div
                key={lang.name}
                className="flex items-center justify-between p-3 border rounded-lg"
              >
                <div>
                  <p className="font-medium">{lang.name}</p>
                  <p className="text-sm text-muted-foreground">{lang.level}</p>
                </div>
                <button
                  onClick={() => removeLanguage(lang.name)}
                  className="text-muted-foreground hover:text-destructive"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="tools" className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar herramientas..."
              value={searchTools}
              onChange={(e) => setSearchTools(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {POPULAR_TOOLS.filter(t =>
              t.toLowerCase().includes(searchTools.toLowerCase())
            ).map((tool) => (
              <button
                key={tool}
                onClick={() => toggleTool(tool)}
                className={`p-3 rounded-lg border-2 transition-all text-left text-sm ${
                  skills.tools.includes(tool)
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                {tool}
              </button>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
