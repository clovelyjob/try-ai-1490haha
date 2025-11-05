import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { EXPERIENCE_LEVELS, SITUATIONS } from '@/lib/constants';

interface ExperienceStepProps {
  data: {
    experience: string;
    situation: string;
    challenge: string;
  };
  onChange: (data: { experience: string; situation: string; challenge: string }) => void;
}

export const ExperienceStep = ({ data, onChange }: ExperienceStepProps) => {
  return (
    <div className="space-y-8">
      <div className="text-center space-y-3">
        <h2 className="text-3xl font-heading font-bold">
          Cuéntanos tu experiencia
        </h2>
        <p className="text-muted-foreground">
          Esto nos ayudará a personalizar mejor tu ruta
        </p>
      </div>

      <div className="space-y-6">
        {/* Experience Level */}
        <div className="space-y-3">
          <h3 className="font-semibold">Nivel de experiencia</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {EXPERIENCE_LEVELS.map((level) => (
              <button
                key={level.id}
                onClick={() => onChange({ ...data, experience: level.id })}
                className={`p-4 rounded-lg border-2 transition-all text-left ${
                  data.experience === level.id
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <div className="text-3xl mb-2">{level.icon}</div>
                <p className="font-medium text-sm">{level.label}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Current Situation */}
        <div className="space-y-3">
          <h3 className="font-semibold">Situación actual</h3>
          <RadioGroup
            value={data.situation}
            onValueChange={(value) => onChange({ ...data, situation: value })}
          >
            {SITUATIONS.map((situation) => (
              <div key={situation} className="flex items-center space-x-2 p-3 border rounded-lg">
                <RadioGroupItem value={situation} id={situation} />
                <Label htmlFor={situation} className="flex-1 cursor-pointer">
                  {situation}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        {/* Challenge */}
        <div className="space-y-3">
          <h3 className="font-semibold">
            ¿Cuál es tu mayor reto profesional actual?{' '}
            <span className="text-muted-foreground font-normal">(opcional)</span>
          </h3>
          <Textarea
            placeholder="Ej: No encuentro ofertas que se alineen con mis valores, o no sé cómo destacar mi experiencia en el CV..."
            value={data.challenge}
            onChange={(e) => onChange({ ...data, challenge: e.target.value })}
            rows={4}
            maxLength={500}
          />
          <p className="text-xs text-muted-foreground text-right">
            {data.challenge.length}/500
          </p>
        </div>
      </div>
    </div>
  );
};
