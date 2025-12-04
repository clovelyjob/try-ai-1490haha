import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Briefcase, MapPin, Clock, TrendingUp, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useOpportunitiesStore } from '@/store/useOpportunitiesStore';
import { useProfileStore } from '@/store/useProfileStore';
import type { Opportunity } from '@/types';

const DAILY_JOB_CACHE_KEY = 'clovely_daily_job';
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

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
      // Check cache first
      const cached = localStorage.getItem(DAILY_JOB_CACHE_KEY);
      if (cached) {
        const parsedCache: CachedDailyJob = JSON.parse(cached);
        const isValid = Date.now() - parsedCache.timestamp < CACHE_DURATION;
        if (isValid && parsedCache.job) {
          setDailyJob(parsedCache.job);
          setIsLoading(false);
          return;
        }
      }

      try {
        // Load opportunities if not loaded
        if (opportunities.length === 0) {
          await loadOpportunities({ query: 'software developer', page: 1 });
        }

        // Get loaded opportunities
        const currentOpportunities = useOpportunitiesStore.getState().opportunities;
        
        if (currentOpportunities.length > 0) {
          // Calculate match scores and get highest
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

          // Cache the result
          const cacheData: CachedDailyJob = {
            job: bestJob,
            timestamp: Date.now()
          };
          localStorage.setItem(DAILY_JOB_CACHE_KEY, JSON.stringify(cacheData));
          
          setDailyJob(bestJob);
        }
      } catch (error) {
        console.error('Error fetching daily job:', error);
        // Use fallback mock data
        setDailyJob({
          id: 'mock_daily',
          title: 'Software Engineer',
          company: 'Tech Company',
          location: 'Remote',
          matchScore: 85,
          publishedAt: new Date().toISOString(),
          tags: ['React', 'TypeScript', 'Node.js'],
          contractType: 'full-time',
          modality: 'remote',
          category: 'technology',
          description: 'Great opportunity for a software engineer',
          requirements: [],
          benefits: [],
          expiresAt: null,
          source: 'Clovely',
          views: 0,
          applicantsCount: 0
        });
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
      <Card className="p-6 border-2 border-primary/10 rounded-2xl shadow-clovely-lg">
        <div className="space-y-4">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-5 w-20" />
            </div>
            <Skeleton className="h-10 w-10 rounded-xl" />
          </div>
          <div>
            <Skeleton className="h-6 w-48 mb-2" />
            <Skeleton className="h-4 w-32" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-6 w-16 rounded-full" />
            <Skeleton className="h-6 w-20 rounded-full" />
          </div>
          <Skeleton className="h-10 w-full rounded-xl" />
        </div>
      </Card>
    );
  }

  if (!dailyJob) {
    return null;
  }

  return (
    <Card className="p-6 border-2 border-primary/10 rounded-2xl shadow-clovely-lg hover:-translate-y-1 hover:shadow-clovely-xl transition-all duration-300 bg-card">
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-primary/10">
                <TrendingUp className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-semibold text-lg">Trabajo del Día</h3>
            </div>
            <Badge className="text-xs bg-primary text-primary-foreground shadow-clovely-sm">
              {dailyJob.matchScore || 85}% Match
            </Badge>
          </div>
          {dailyJob.companyLogo ? (
            <img 
              src={dailyJob.companyLogo} 
              alt={dailyJob.company}
              className="h-12 w-12 rounded-xl object-contain bg-white p-1"
            />
          ) : (
            <div className="p-2 rounded-xl bg-primary/10">
              <Briefcase className="h-6 w-6 text-primary" />
            </div>
          )}
        </div>

        <div>
          <h4 className="font-medium text-lg mb-1">{dailyJob.title}</h4>
          <p className="text-muted-foreground font-medium">{dailyJob.company}</p>
          <div className="flex items-center gap-3 mt-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" />
              <span>{dailyJob.location}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              <span>{getTimeAgo(dailyJob.publishedAt)}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {dailyJob.tags?.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs rounded-full">
              {tag}
            </Badge>
          ))}
          {dailyJob.modality && (
            <Badge variant="secondary" className="text-xs rounded-full capitalize">
              {dailyJob.modality}
            </Badge>
          )}
        </div>

        <Link to={`/dashboard/opportunities/${dailyJob.id}`}>
          <Button variant="premium" className="w-full shadow-clovely-glow">
            Ver Detalles
            <ExternalLink className="w-4 h-4 ml-2" />
          </Button>
        </Link>
      </div>
    </Card>
  );
}
