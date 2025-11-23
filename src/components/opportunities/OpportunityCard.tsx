import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Opportunity } from '@/types';
import {
  MapPin,
  Briefcase,
  Clock,
  DollarSign,
  Bookmark,
  BookmarkCheck,
  Eye,
  Users,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { cn } from '@/lib/utils';

interface OpportunityCardProps {
  opportunity: Opportunity;
  matchScore?: number;
  isSaved?: boolean;
  onSave?: () => void;
  compact?: boolean;
}

export default function OpportunityCard({
  opportunity,
  matchScore,
  isSaved,
  onSave,
  compact = false,
}: OpportunityCardProps) {
  const modalityLabels = {
    remote: 'Remoto',
    hybrid: 'Híbrido',
    onsite: 'Presencial',
  };

  const contractLabels = {
    internship: 'Práctica',
    'part-time': 'Medio tiempo',
    'full-time': 'Tiempo completo',
    contract: 'Contrato',
  };

  return (
    <Card className="p-6 rounded-2xl border-2 shadow-clovely-md hover:shadow-clovely-xl hover:-translate-y-1 transition-all duration-300">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-start gap-3">
            {opportunity.companyLogo && (
              <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center text-muted-foreground font-semibold">
                {opportunity.company.charAt(0)}
              </div>
            )}
            <div className="flex-1">
              <Link to={`/dashboard/opportunities/${opportunity.id}`}>
                <h3 className="text-lg font-semibold hover:text-primary transition-colors">
                  {opportunity.title}
                </h3>
              </Link>
              <p className="text-sm text-muted-foreground">{opportunity.company}</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {matchScore !== undefined && (
            <Badge
              variant="outline"
              className={cn(
                'font-semibold shadow-sm',
                matchScore >= 80 && 'bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 border-green-300',
                matchScore >= 60 && matchScore < 80 && 'bg-gradient-to-r from-yellow-50 to-amber-50 text-yellow-700 border-yellow-300',
                matchScore < 60 && 'bg-gradient-to-r from-red-50 to-rose-50 text-red-700 border-red-300'
              )}
            >
              {matchScore}% match
            </Badge>
          )}
          {onSave && (
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.preventDefault();
                onSave();
              }}
            >
              {isSaved ? (
                <BookmarkCheck className="h-4 w-4 text-primary" />
              ) : (
                <Bookmark className="h-4 w-4" />
              )}
            </Button>
          )}
        </div>
      </div>

      {!compact && (
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
          {opportunity.description}
        </p>
      )}

      <div className="flex flex-wrap gap-2 mb-4">
        <Badge variant="secondary" className="gap-1">
          <MapPin className="h-3 w-3" />
          {opportunity.location}
        </Badge>
        <Badge variant="secondary" className="gap-1">
          <Briefcase className="h-3 w-3" />
          {modalityLabels[opportunity.modality]}
        </Badge>
        <Badge variant="secondary">{contractLabels[opportunity.contractType]}</Badge>
        {opportunity.salaryRange && (
          <Badge variant="secondary" className="gap-1">
            <DollarSign className="h-3 w-3" />
            {opportunity.salaryRange.min}-{opportunity.salaryRange.max}{' '}
            {opportunity.salaryRange.currency}
          </Badge>
        )}
      </div>

      {!compact && (
        <div className="flex flex-wrap gap-1.5 mb-4">
          {opportunity.tags.slice(0, 5).map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
          {opportunity.tags.length > 5 && (
            <Badge variant="outline" className="text-xs">
              +{opportunity.tags.length - 5}
            </Badge>
          )}
        </div>
      )}

      <div className="flex items-center justify-between pt-4 border-t">
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {formatDistanceToNow(new Date(opportunity.publishedAt), {
              addSuffix: true,
              locale: es,
            })}
          </span>
          <span className="flex items-center gap-1">
            <Eye className="h-3 w-3" />
            {opportunity.views}
          </span>
          <span className="flex items-center gap-1">
            <Users className="h-3 w-3" />
            {opportunity.applicantsCount} postulantes
          </span>
        </div>

        <Link to={`/dashboard/opportunities/${opportunity.id}`}>
          <Button size="sm">Ver detalles</Button>
        </Link>
      </div>
    </Card>
  );
}
