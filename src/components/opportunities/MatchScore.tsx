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
    if (score >= 80) return 'text-green-700';
    if (score >= 60) return 'text-yellow-700';
    return 'text-red-700';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return 'bg-green-50 border-green-300 shadow-green-200/50';
    if (score >= 60) return 'bg-yellow-50 border-yellow-300 shadow-yellow-200/50';
    return 'bg-red-50 border-red-300 shadow-red-200/50';
  };

  const getProgressColor = (score: number) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <Card className="p-6 rounded-2xl shadow-clovely-lg border-2 border-primary/10">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">Compatibilidad</h3>
        <Badge className={`text-2xl font-bold px-4 py-2 rounded-xl border-2 shadow-lg ${getScoreBgColor(matchResult.overall)}`}>
          <span className={getScoreColor(matchResult.overall)}>{matchResult.overall}%</span>
        </Badge>
      </div>

      <div className="space-y-4 mb-6">
        <div className="space-y-2 animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <div className="flex justify-between text-sm">
            <span className="font-medium">Habilidades</span>
            <span className="font-semibold">{matchResult.breakdown.skillsMatch}%</span>
          </div>
          <Progress value={matchResult.breakdown.skillsMatch} className={`h-2.5 ${getProgressColor(matchResult.breakdown.skillsMatch)}`} />
        </div>

        <div className="space-y-2 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <div className="flex justify-between text-sm">
            <span className="font-medium">Experiencia</span>
            <span className="font-semibold">{matchResult.breakdown.experienceMatch}%</span>
          </div>
          <Progress value={matchResult.breakdown.experienceMatch} className={`h-2.5 ${getProgressColor(matchResult.breakdown.experienceMatch)}`} />
        </div>

        <div className="space-y-2 animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <div className="flex justify-between text-sm">
            <span className="font-medium">Educación</span>
            <span className="font-semibold">{matchResult.breakdown.educationMatch}%</span>
          </div>
          <Progress value={matchResult.breakdown.educationMatch} className={`h-2.5 ${getProgressColor(matchResult.breakdown.educationMatch)}`} />
        </div>

        <div className="space-y-2 animate-fade-in" style={{ animationDelay: '0.4s' }}>
          <div className="flex justify-between text-sm">
            <span className="font-medium">Estilo de vida</span>
            <span className="font-semibold">{matchResult.breakdown.lifestyleMatch}%</span>
          </div>
          <Progress value={matchResult.breakdown.lifestyleMatch} className={`h-2.5 ${getProgressColor(matchResult.breakdown.lifestyleMatch)}`} />
        </div>

        <div className="space-y-2 animate-fade-in" style={{ animationDelay: '0.5s' }}>
          <div className="flex justify-between text-sm">
            <span className="font-medium">Palabras clave</span>
            <span className="font-semibold">{matchResult.breakdown.keywordsMatch}%</span>
          </div>
          <Progress value={matchResult.breakdown.keywordsMatch} className={`h-2.5 ${getProgressColor(matchResult.breakdown.keywordsMatch)}`} />
        </div>
      </div>

      <div className="space-y-3 p-4 rounded-xl bg-blue-50/50">
        <div className="flex items-center gap-2 text-sm font-semibold">
          <TrendingUp className="h-4 w-4 text-primary" />
          <span>Recomendaciones</span>
        </div>
        {matchResult.recommendations.map((rec, index) => (
          <div key={index} className="flex gap-2 text-sm text-muted-foreground">
            <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0 text-blue-500" />
            <p>{rec}</p>
          </div>
        ))}
      </div>

      {matchResult.missingSkills.length > 0 && (
        <div className="mt-4 p-4 rounded-xl border-2 border-orange-200 bg-orange-50/50">
          <p className="text-sm font-semibold mb-3 text-orange-900">Habilidades faltantes:</p>
          <div className="flex flex-wrap gap-2">
            {matchResult.missingSkills.slice(0, 5).map((skill, index) => (
              <Badge key={index} className="bg-orange-100 text-orange-800 border-orange-300 shadow-sm">
                {skill}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
}
