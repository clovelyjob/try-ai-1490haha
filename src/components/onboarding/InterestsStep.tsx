import { Badge } from '@/components/ui/badge';
import { INTERESTS } from '@/lib/constants';

interface InterestsStepProps {
  selected: string[];
  onChange: (interests: string[]) => void;
}

export const InterestsStep = ({ selected, onChange }: InterestsStepProps) => {
  const toggleInterest = (id: string) => {
    if (selected.includes(id)) {
      onChange(selected.filter((i) => i !== id));
    } else if (selected.length < 5) {
      onChange([...selected, id]);
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-3">
        <h2 className="text-3xl font-heading font-bold">
          ¿Qué áreas te interesan?
        </h2>
        <p className="text-muted-foreground">
          Selecciona entre 3 y 5 áreas que más te apasionen
        </p>
        <Badge variant={selected.length >= 3 ? 'default' : 'secondary'}>
          {selected.length} de 5 seleccionados
        </Badge>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {INTERESTS.map((interest) => {
          const isSelected = selected.includes(interest.id);
          return (
            <button
              key={interest.id}
              onClick={() => toggleInterest(interest.id)}
              className={`p-4 rounded-2xl border-2 transition-all duration-300 text-left ${
                isSelected
                  ? 'border-primary bg-gradient-to-br from-primary/10 to-primary/5 shadow-clovely-md hover:shadow-clovely-lg hover:-translate-y-1'
                  : 'border-border hover:border-primary/50 hover:shadow-clovely-sm hover:-translate-y-0.5'
              }`}
            >
              <div className="text-3xl mb-2">{interest.icon}</div>
              <p className="font-medium text-sm">{interest.label}</p>
            </button>
          );
        })}
      </div>

      {selected.length > 0 && selected.length < 3 && (
        <p className="text-center text-sm text-muted-foreground">
          Selecciona al menos {3 - selected.length} más
        </p>
      )}
    </div>
  );
};
