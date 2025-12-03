import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X, Wifi } from 'lucide-react';

interface FilterPanelProps {
  filters: {
    search: string;
    category: string[];
    modality: string[];
    contractType: string[];
    location: string;
    remoteOnly?: boolean;
    datePosted?: string;
    experienceLevel?: string;
  };
  onFilterChange: (filters: any) => void;
  onClearFilters: () => void;
  inDrawer?: boolean;
}

const categories = [
  { value: 'technology', label: 'Tecnología' },
  { value: 'marketing', label: 'Marketing' },
  { value: 'design', label: 'Diseño' },
  { value: 'business', label: 'Negocios' },
  { value: 'education', label: 'Educación' },
  { value: 'health', label: 'Salud' },
  { value: 'other', label: 'Otros' },
];

const modalities = [
  { value: 'remote', label: 'Remoto' },
  { value: 'hybrid', label: 'Híbrido' },
  { value: 'onsite', label: 'Presencial' },
];

const contractTypes = [
  { value: 'FULLTIME', label: 'Tiempo completo' },
  { value: 'PARTTIME', label: 'Medio tiempo' },
  { value: 'INTERN', label: 'Práctica' },
  { value: 'CONTRACTOR', label: 'Contrato' },
];

const datePostedOptions = [
  { value: 'today', label: 'Hoy' },
  { value: '3days', label: 'Últimos 3 días' },
  { value: 'week', label: 'Última semana' },
  { value: 'month', label: 'Último mes' },
  { value: 'all', label: 'Cualquier fecha' },
];

const experienceLevels = [
  { value: 'no_experience', label: 'Sin experiencia' },
  { value: 'under_3_years', label: 'Menos de 3 años' },
  { value: 'more_than_3_years', label: 'Más de 3 años' },
];

export default function FilterPanel({
  filters,
  onFilterChange,
  onClearFilters,
  inDrawer = false,
}: FilterPanelProps) {
  const toggleArrayFilter = (key: 'category' | 'modality' | 'contractType', value: string) => {
    const current = filters[key];
    const updated = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    onFilterChange({ [key]: updated });
  };

  const hasActiveFilters =
    filters.search ||
    filters.category.length > 0 ||
    filters.modality.length > 0 ||
    filters.contractType.length > 0 ||
    filters.location ||
    filters.remoteOnly ||
    (filters.datePosted && filters.datePosted !== 'all') ||
    filters.experienceLevel;

  return (
    <Card className={inDrawer ? 'p-0 border-0 shadow-none bg-transparent' : 'p-6 rounded-2xl sticky top-4 shadow-clovely-md backdrop-blur-sm bg-card/95'}>
      {!inDrawer && (
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-semibold">Filtros</h3>
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={onClearFilters} className="min-h-[44px]">
              <X className="h-4 w-4 mr-1" />
              Limpiar
            </Button>
          )}
        </div>
      )}
      
      {inDrawer && hasActiveFilters && (
        <div className="mb-4">
          <Button 
            variant="outline" 
            onClick={onClearFilters} 
            className="w-full min-h-[44px]"
          >
            <X className="h-4 w-4 mr-2" />
            Limpiar filtros
          </Button>
        </div>
      )}

      <div className="space-y-6">
        {/* Search */}
        <div className="space-y-2">
          <Label htmlFor="search">Buscar</Label>
          <Input
            id="search"
            placeholder="Palabra clave..."
            value={filters.search}
            onChange={(e) => onFilterChange({ search: e.target.value })}
            className="min-h-[44px]"
          />
        </div>

        <Separator />

        {/* Remote Only Toggle */}
        <div className="flex items-center justify-between min-h-[44px]">
          <div className="flex items-center gap-2">
            <Wifi className="h-4 w-4 text-primary" />
            <Label htmlFor="remote-only" className="cursor-pointer">Solo remoto</Label>
          </div>
          <Switch
            id="remote-only"
            checked={filters.remoteOnly || false}
            onCheckedChange={(checked) => onFilterChange({ remoteOnly: checked })}
          />
        </div>

        <Separator />

        {/* Date Posted */}
        <div className="space-y-2">
          <Label>Fecha de publicación</Label>
          <Select
            value={filters.datePosted || 'all'}
            onValueChange={(value) => onFilterChange({ datePosted: value })}
          >
            <SelectTrigger className="min-h-[44px]">
              <SelectValue placeholder="Cualquier fecha" />
            </SelectTrigger>
            <SelectContent>
              {datePostedOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Separator />

        {/* Experience Level */}
        <div className="space-y-2">
          <Label>Nivel de experiencia</Label>
        <Select
            value={filters.experienceLevel || 'all'}
            onValueChange={(value) => onFilterChange({ experienceLevel: value === 'all' ? undefined : value })}
          >
            <SelectTrigger className="min-h-[44px]">
              <SelectValue placeholder="Todos los niveles" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los niveles</SelectItem>
              {experienceLevels.map((level) => (
                <SelectItem key={level.value} value={level.value}>
                  {level.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Separator />

        {/* Contract Type (Employment Type) */}
        <div className="space-y-3">
          <Label>Tipo de empleo</Label>
          {contractTypes.map((type) => (
            <div key={type.value} className="flex items-center space-x-2 min-h-[44px]">
              <Checkbox
                id={`contract-${type.value}`}
                checked={filters.contractType.includes(type.value)}
                onCheckedChange={() => toggleArrayFilter('contractType', type.value)}
                className="min-h-[24px] min-w-[24px]"
              />
              <label
                htmlFor={`contract-${type.value}`}
                className="text-sm cursor-pointer flex-1"
              >
                {type.label}
              </label>
            </div>
          ))}
        </div>

        <Separator />

        {/* Category */}
        <div className="space-y-3">
          <Label>Categoría</Label>
          {categories.map((category) => (
            <div key={category.value} className="flex items-center space-x-2 min-h-[44px]">
              <Checkbox
                id={`category-${category.value}`}
                checked={filters.category.includes(category.value)}
                onCheckedChange={() => toggleArrayFilter('category', category.value)}
                className="min-h-[24px] min-w-[24px]"
              />
              <label
                htmlFor={`category-${category.value}`}
                className="text-sm cursor-pointer flex-1"
              >
                {category.label}
              </label>
            </div>
          ))}
        </div>

        <Separator />

        {/* Modality */}
        <div className="space-y-3">
          <Label>Modalidad</Label>
          {modalities.map((modality) => (
            <div key={modality.value} className="flex items-center space-x-2 min-h-[44px]">
              <Checkbox
                id={`modality-${modality.value}`}
                checked={filters.modality.includes(modality.value)}
                onCheckedChange={() => toggleArrayFilter('modality', modality.value)}
                className="min-h-[24px] min-w-[24px]"
              />
              <label
                htmlFor={`modality-${modality.value}`}
                className="text-sm cursor-pointer flex-1"
              >
                {modality.label}
              </label>
            </div>
          ))}
        </div>

        <Separator />

        {/* Location */}
        <div className="space-y-2">
          <Label htmlFor="location">Ubicación</Label>
          <Input
            id="location"
            placeholder="Ciudad, país..."
            value={filters.location}
            onChange={(e) => onFilterChange({ location: e.target.value })}
            className="min-h-[44px]"
          />
        </div>
      </div>
    </Card>
  );
}
