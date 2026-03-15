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
  ExternalLink,
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
    <Card className="p-4 sm:p-6 rounded-2xl border-2 shadow-clovely-md hover:shadow-clovely-xl hover:-translate-y-1 transition-all duration-300">
      <div className="flex flex-col sm:flex-row sm:items-start gap-4 mb-4">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          {opportunity.companyLogo ? (
            <img 
              src={opportunity.companyLogo} 
              alt={`${opportunity.company} logo`}
              className="w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0 rounded-lg object-contain bg-white p-1"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          ) : (
            <div className="w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0 rounded-lg bg-muted flex items-center justify-center text-muted-foreground font-semibold">
              {opportunity.company.charAt(0)}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <Link to={`/dashboard/opportunities/${opportunity.id}`}>
              <h3 className="text-base sm:text-lg font-semibold hover:text-primary transition-colors line-clamp-2">
                {opportunity.title}
              </h3>
            </Link>
            <div className="flex items-center gap-2">
              <p className="text-sm text-muted-foreground truncate">{opportunity.company}</p>
              {opportunity.source && opportunity.source !== 'MoonJab' && (
                <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                  {opportunity.source}
                </Badge>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          {matchScore !== undefined && (
            <Badge
              variant="outline"
              className={cn(
                'font-semibold shadow-sm text-xs sm:text-sm whitespace-nowrap',
                matchScore >= 80 && 'bg-green-50 text-green-700 border-green-300',
                matchScore >= 60 && matchScore < 80 && 'bg-yellow-50 text-yellow-700 border-yellow-300',
                matchScore < 60 && 'bg-red-50 text-red-700 border-red-300'
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
              className="min-h-[44px] min-w-[44px]"
            >
              {isSaved ? (
                <BookmarkCheck className="h-5 w-5 text-primary" />
              ) : (
                <Bookmark className="h-5 w-5" />
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

      <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-4">
        <Badge variant="secondary" className="gap-1 text-xs">
          <MapPin className="h-3 w-3 flex-shrink-0" />
          <span className="truncate max-w-[150px]">{opportunity.location}</span>
        </Badge>
        <Badge variant="secondary" className="gap-1 text-xs">
          <Briefcase className="h-3 w-3 flex-shrink-0" />
          {modalityLabels[opportunity.modality]}
        </Badge>
        <Badge variant="secondary" className="text-xs">{contractLabels[opportunity.contractType]}</Badge>
        {opportunity.salaryRange && (
          <Badge variant="secondary" className="gap-1 text-xs">
            <DollarSign className="h-3 w-3 flex-shrink-0" />
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

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-4 border-t">
        <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1 whitespace-nowrap">
            <Clock className="h-3 w-3 flex-shrink-0" />
            <span className="hidden sm:inline">
              {formatDistanceToNow(new Date(opportunity.publishedAt), {
                addSuffix: true,
                locale: es,
              })}
            </span>
            <span className="sm:hidden">
              {formatDistanceToNow(new Date(opportunity.publishedAt), {
                addSuffix: true,
                locale: es,
              }).replace('hace ', '')}
            </span>
          </span>
          <span className="flex items-center gap-1">
            <Eye className="h-3 w-3 flex-shrink-0" />
            {opportunity.views}
          </span>
          <span className="flex items-center gap-1">
            <Users className="h-3 w-3 flex-shrink-0" />
            <span className="hidden sm:inline">{opportunity.applicantsCount} postulantes</span>
            <span className="sm:hidden">{opportunity.applicantsCount}</span>
          </span>
        </div>

        <div className="flex gap-2 w-full sm:w-auto">
          {opportunity.applyUrl && (
            <a 
              href={opportunity.applyUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex-1 sm:flex-initial"
            >
              <Button size="sm" variant="default" className="w-full min-h-[44px] gap-1">
                Aplicar
                <ExternalLink className="h-3 w-3" />
              </Button>
            </a>
          )}
          <Link to={`/dashboard/opportunities/${opportunity.id}`} className="flex-1 sm:flex-initial">
            <Button size="sm" variant={opportunity.applyUrl ? "outline" : "default"} className="w-full min-h-[44px]">
              Ver detalles
            </Button>
          </Link>
        </div>
      </div>
    </Card>
  );
}
