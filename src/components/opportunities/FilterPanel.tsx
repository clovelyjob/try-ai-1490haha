import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { X } from 'lucide-react';

interface FilterPanelProps {
  filters: {
    search: string;
    category: string[];
    modality: string[];
    contractType: string[];
    location: string;
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
  { value: 'internship', label: 'Práctica' },
  { value: 'part-time', label: 'Medio tiempo' },
  { value: 'full-time', label: 'Tiempo completo' },
  { value: 'contract', label: 'Contrato' },
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
    filters.location;

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

        {/* Contract Type */}
        <div className="space-y-3">
          <Label>Tipo de contrato</Label>
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
