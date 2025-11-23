import { Card } from '@/components/ui/card';
import { WORK_MODALITIES, WORK_SCHEDULES, COMPANY_SIZES } from '@/lib/constants';

interface StyleStepProps {
  workStyle: {
    modality: string;
    schedule: string;
    companySize: string;
  };
  onChange: (workStyle: { modality: string; schedule: string; companySize: string }) => void;
}

export const StyleStep = ({ workStyle, onChange }: StyleStepProps) => {
  return (
    <div className="space-y-8">
      <div className="text-center space-y-3">
        <h2 className="text-3xl font-heading font-bold">
          ¿Cuál es tu estilo de trabajo ideal?
        </h2>
        <p className="text-muted-foreground">
          Ayúdanos a entender tu ambiente perfecto
        </p>
      </div>

      <div className="space-y-6">
        {/* Modality */}
        <div className="space-y-3">
          <h3 className="font-semibold">Modalidad de trabajo</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {WORK_MODALITIES.map((option) => (
              <button
                key={option.id}
                onClick={() => onChange({ ...workStyle, modality: option.id })}
                className={`p-4 rounded-2xl border-2 transition-all duration-300 ${
                  workStyle.modality === option.id
                    ? 'border-primary bg-gradient-to-br from-primary/10 to-primary/5 shadow-clovely-md hover:shadow-clovely-lg hover:-translate-y-1'
                    : 'border-border hover:border-primary/50 hover:shadow-clovely-sm hover:-translate-y-0.5'
                }`}
              >
                <div className="text-3xl mb-2">{option.icon}</div>
                <p className="font-medium text-sm">{option.label}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Schedule */}
        <div className="space-y-3">
          <h3 className="font-semibold">Horario preferido</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {WORK_SCHEDULES.map((option) => (
              <button
                key={option.id}
                onClick={() => onChange({ ...workStyle, schedule: option.id })}
                className={`p-4 rounded-lg border-2 transition-all ${
                  workStyle.schedule === option.id
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <div className="text-3xl mb-2">{option.icon}</div>
                <p className="font-medium text-sm">{option.label}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Company Size */}
        <div className="space-y-3">
          <h3 className="font-semibold">Tipo de empresa</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {COMPANY_SIZES.map((option) => (
              <button
                key={option.id}
                onClick={() => onChange({ ...workStyle, companySize: option.id })}
                className={`p-4 rounded-lg border-2 transition-all ${
                  workStyle.companySize === option.id
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <div className="text-3xl mb-2">{option.icon}</div>
                <p className="font-medium text-sm">{option.label}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
