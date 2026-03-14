import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Briefcase, MapPin, Clock, TrendingUp, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useOpportunitiesStore } from '@/store/useOpportunitiesStore';
import { useProfileStore } from '@/store/useProfileStore';
import type { Opportunity } from '@/types';

const DAILY_JOB_CACHE_KEY = 'moonjab_daily_job';
const CACHE_DURATION = 24 * 60 * 60 * 1000;

interface CachedDailyJob {
  job: Opportunity & { matchScore?: number };
  timestamp: number;
}

export function DailyJob() {
  const [dailyJob, setDailyJob] = useState<(Opportunity & { matchScore?: number }) | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { loadOpportunities, opportunities, calculateMatch } = useOpportunitiesStore();
  const { profile } = useProfileStore();

  useEffect(() => {
    const fetchDailyJob = async () => {
      try {
        if (opportunities.length === 0) {
          await loadOpportunities({ query: 'software developer', page: 1 });
        }
        const currentOpportunities = useOpportunitiesStore.getState().opportunities;
        const cached = localStorage.getItem(DAILY_JOB_CACHE_KEY);
        if (cached) {
          const parsedCache: CachedDailyJob = JSON.parse(cached);
          const isValid = Date.now() - parsedCache.timestamp < CACHE_DURATION;
          const cachedJobExists = currentOpportunities.some(opp => opp.id === parsedCache.job.id);
          if (isValid && parsedCache.job && cachedJobExists) {
            setDailyJob(parsedCache.job);
            setIsLoading(false);
            return;
          } else {
            localStorage.removeItem(DAILY_JOB_CACHE_KEY);
          }
        }
        if (currentOpportunities.length > 0) {
          let bestJob: Opportunity & { matchScore?: number } = currentOpportunities[0];
          let highestMatch = 0;
          for (const opp of currentOpportunities) {
            const matchResult = calculateMatch(opp, profile, null);
            const matchScore = matchResult.overall;
            if (matchScore > highestMatch) {
              highestMatch = matchScore;
              bestJob = { ...opp, matchScore };
            }
          }
          localStorage.setItem(DAILY_JOB_CACHE_KEY, JSON.stringify({ job: bestJob, timestamp: Date.now() }));
          setDailyJob(bestJob);
        } else {
          setDailyJob(null);
        }
      } catch (error) {
        console.error('Error fetching daily job:', error);
        setDailyJob(null);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDailyJob();
  }, [loadOpportunities, opportunities.length, calculateMatch, profile]);

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    if (diffHours < 1) return 'Hace unos minutos';
    if (diffHours < 24) return `Hace ${diffHours}h`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays === 1) return 'Hace 1 día';
    return `Hace ${diffDays} días`;
  };

  if (isLoading) {
    return (
      <Card className="p-5 border-border/50">
        <div className="space-y-3">
          <Skeleton className="h-5 w-28" />
          <Skeleton className="h-5 w-48" />
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-9 w-full rounded-lg" />
        </div>
      </Card>
    );
  }

  if (!dailyJob) {
    return (
      <Card className="p-5 border-border/50">
        <div className="text-center py-4">
          <Briefcase className="h-8 w-8 mx-auto text-muted-foreground/50 mb-2" />
          <p className="text-sm text-muted-foreground mb-3">No hay oportunidades disponibles</p>
          <Link to="/dashboard/opportunities">
            <Button variant="outline" size="sm">Ver todas las oportunidades</Button>
          </Link>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-5 border-border/50 hover:border-primary/20 transition-all duration-200">
      <div className="space-y-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Trabajo del Día</span>
            </div>
            <h4 className="font-semibold text-base">{dailyJob.title}</h4>
            <p className="text-sm text-muted-foreground">{dailyJob.company}</p>
          </div>
          <Badge className="bg-primary/10 text-primary border-0 text-xs font-medium">
            {dailyJob.matchScore || 85}% Match
          </Badge>
        </div>

        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <MapPin className="h-3 w-3" /> {dailyJob.location}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" /> {getTimeAgo(dailyJob.publishedAt)}
          </span>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {dailyJob.tags?.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs rounded-md font-normal px-2 py-0.5">
              {tag}
            </Badge>
          ))}
          {dailyJob.modality && (
            <Badge variant="secondary" className="text-xs rounded-md capitalize px-2 py-0.5">
              {dailyJob.modality}
            </Badge>
          )}
        </div>

        <Link to={`/dashboard/opportunities/${dailyJob.id}`}>
          <Button className="w-full h-9 text-sm font-medium group" size="sm">
            Ver Detalles
            <ArrowRight className="w-3.5 h-3.5 ml-1.5 group-hover:translate-x-0.5 transition-transform" />
          </Button>
        </Link>
      </div>
    </Card>
  );
}
