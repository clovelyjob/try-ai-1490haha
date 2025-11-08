import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { MatchResult } from '@/types';
import { TrendingUp, AlertCircle } from 'lucide-react';

interface MatchScoreProps {
  matchResult: MatchResult;
}

export default function MatchScore({ matchResult }: MatchScoreProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return 'bg-green-50 border-green-200';
    if (score >= 60) return 'bg-yellow-50 border-yellow-200';
    return 'bg-red-50 border-red-200';
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">Compatibilidad</h3>
        <Badge className={`text-2xl font-bold px-4 py-2 ${getScoreBgColor(matchResult.overall)}`}>
          <span className={getScoreColor(matchResult.overall)}>{matchResult.overall}%</span>
        </Badge>
      </div>

      <div className="space-y-4 mb-6">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Habilidades</span>
            <span className="font-medium">{matchResult.breakdown.skillsMatch}%</span>
          </div>
          <Progress value={matchResult.breakdown.skillsMatch} className="h-2" />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Experiencia</span>
            <span className="font-medium">{matchResult.breakdown.experienceMatch}%</span>
          </div>
          <Progress value={matchResult.breakdown.experienceMatch} className="h-2" />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Educación</span>
            <span className="font-medium">{matchResult.breakdown.educationMatch}%</span>
          </div>
          <Progress value={matchResult.breakdown.educationMatch} className="h-2" />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Estilo de vida</span>
            <span className="font-medium">{matchResult.breakdown.lifestyleMatch}%</span>
          </div>
          <Progress value={matchResult.breakdown.lifestyleMatch} className="h-2" />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Palabras clave</span>
            <span className="font-medium">{matchResult.breakdown.keywordsMatch}%</span>
          </div>
          <Progress value={matchResult.breakdown.keywordsMatch} className="h-2" />
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm font-medium">
          <TrendingUp className="h-4 w-4" />
          <span>Recomendaciones</span>
        </div>
        {matchResult.recommendations.map((rec, index) => (
          <div key={index} className="flex gap-2 text-sm text-muted-foreground">
            <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <p>{rec}</p>
          </div>
        ))}
      </div>

      {matchResult.missingSkills.length > 0 && (
        <div className="mt-4 p-3 bg-muted rounded-lg">
          <p className="text-sm font-medium mb-2">Habilidades faltantes:</p>
          <div className="flex flex-wrap gap-2">
            {matchResult.missingSkills.slice(0, 5).map((skill, index) => (
              <Badge key={index} variant="secondary">
                {skill}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
}
