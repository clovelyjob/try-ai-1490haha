import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { useOpportunitiesStore } from '@/store/useOpportunitiesStore';
import { useAuthStore } from '@/store/useAuthStore';
import { useProfileStore } from '@/store/useProfileStore';
import { useCVStore } from '@/store/useCVStore';
import { useProgressStore } from '@/store/useProgressStore';
import OpportunityCard from '@/components/opportunities/OpportunityCard';
import FilterPanel from '@/components/opportunities/FilterPanel';
import { SkeletonOpportunityCard } from '@/components/ui/skeleton-loader';
import { Search, RefreshCw, Briefcase, SlidersHorizontal, AlertCircle, ExternalLink } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function Opportunities() {
  const { user } = useAuthStore();
  const { profile } = useProfileStore();
  const { cvs } = useCVStore();
  const { addXP } = useProgressStore();
  const {
    opportunities,
    filters,
    isLoading,
    error,
    hasMore,
    loadOpportunities,
    loadMoreOpportunities,
    setFilters,
    clearFilters,
    saveOpportunity,
    unsaveOpportunity,
    isSaved,
    calculateMatch,
  } = useOpportunitiesStore();

  const [localSearch, setLocalSearch] = useState(filters.search);
  const [locationSearch, setLocationSearch] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    loadOpportunities({ query: 'developer', location: '' });
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFilters({ search: localSearch });
    }, 300);
    return () => clearTimeout(timer);
  }, [localSearch, setFilters]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadOpportunities({ 
      query: localSearch || 'developer',
      location: locationSearch 
    });
    setIsRefreshing(false);
    toast({
      title: 'Oportunidades actualizadas',
      description: 'Se han cargado las últimas ofertas disponibles',
    });
  };

  const handleSearch = async () => {
    await loadOpportunities({
      query: localSearch || 'developer',
      location: locationSearch,
    });
  };

  const handleSaveToggle = (opportunityId: string) => {
    if (!user) return;

    const saved = isSaved(user.id, opportunityId);
    if (saved) {
      unsaveOpportunity(user.id, opportunityId);
      toast({
        title: 'Oferta eliminada',
        description: 'Se ha eliminado de tus guardados',
      });
    } else {
      saveOpportunity(user.id, opportunityId);
      addXP(5);
      toast({
        title: 'Oferta guardada',
        description: 'Puedes verla en tu lista de guardadas',
      });
    }
  };

  // Filter opportunities (local filters after API search)
  const filteredOpportunities = opportunities.filter((opp) => {
    if (filters.category.length > 0 && !filters.category.includes(opp.category)) {
      return false;
    }
    if (filters.modality.length > 0 && !filters.modality.includes(opp.modality)) {
      return false;
    }
    if (filters.contractType.length > 0 && !filters.contractType.includes(opp.contractType)) {
      return false;
    }
    if (filters.location && !opp.location.toLowerCase().includes(filters.location.toLowerCase())) {
      return false;
    }
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      return (
        opp.title.toLowerCase().includes(searchLower) ||
        opp.company.toLowerCase().includes(searchLower) ||
        opp.description.toLowerCase().includes(searchLower) ||
        opp.tags.some((tag) => tag.toLowerCase().includes(searchLower))
      );
    }
    return true;
  });

  // Calculate match scores
  const opportunitiesWithMatch = filteredOpportunities.map((opp) => {
    if (!user || !profile) return { ...opp, matchScore: undefined };
    const userCV = cvs.find((cv) => cv.userId === user.id);
    const match = calculateMatch(opp, profile, userCV);
    return { ...opp, matchScore: match.overall };
  });

  // Sort by match score
  const sortedOpportunities = [...opportunitiesWithMatch].sort((a, b) => {
    if (a.matchScore !== undefined && b.matchScore !== undefined) {
      return b.matchScore - a.matchScore;
    }
    if (a.matchScore !== undefined) return -1;
    if (b.matchScore !== undefined) return 1;
    return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
  });

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b bg-card shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <div className="min-w-0 flex-1">
              <h1 className="text-2xl sm:text-3xl font-bold truncate">Oportunidades</h1>
              <p className="text-sm sm:text-base text-muted-foreground">
                Trabajos reales de LinkedIn, Indeed, Glassdoor y más
              </p>
            </div>
            <Button 
              variant="outline" 
              onClick={handleRefresh} 
              disabled={isRefreshing || isLoading}
              className="min-h-[44px] w-full sm:w-auto"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              Actualizar
            </Button>
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por título, empresa..."
                className="pl-10 min-h-[44px]"
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            <Input
              placeholder="Ciudad, país..."
              className="min-h-[44px] sm:w-48"
              value={locationSearch}
              onChange={(e) => setLocationSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
            <Button onClick={handleSearch} disabled={isLoading} className="min-h-[44px]">
              <Search className="h-4 w-4 mr-2" />
              Buscar
            </Button>
            
            {/* Mobile Filter Button */}
            {isMobile && (
              <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon" className="min-h-[44px] min-w-[44px]">
                    <SlidersHorizontal className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[85vw] sm:w-[400px] p-0">
                  <SheetHeader className="p-6 pb-4">
                    <SheetTitle>Filtros</SheetTitle>
                  </SheetHeader>
                  <div className="px-6 pb-6 overflow-y-auto max-h-[calc(100vh-80px)]">
                    <FilterPanel
                      filters={filters}
                      onFilterChange={(newFilters) => setFilters(newFilters)}
                      onClearFilters={clearFilters}
                      inDrawer
                    />
                  </div>
                </SheetContent>
              </Sheet>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {error && (
          <Alert className="mb-6 border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950">
            <AlertCircle className="h-4 w-4 text-amber-600" />
            <AlertDescription className="text-amber-800 dark:text-amber-200">
              {error.includes('Rate limit') 
                ? 'Límite de búsquedas alcanzado. Mostrando datos de ejemplo.'
                : 'No se pudieron cargar trabajos reales. Mostrando datos de ejemplo.'}
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Desktop Filters Sidebar */}
          {!isMobile && (
            <aside className="lg:col-span-1">
              <FilterPanel
                filters={filters}
                onFilterChange={(newFilters) => setFilters(newFilters)}
                onClearFilters={clearFilters}
              />
            </aside>
          )}

          {/* Results */}
          <main className={isMobile ? 'col-span-1' : 'lg:col-span-3'}>
            <div className="mb-6">
              <p className="text-sm text-muted-foreground">
                {isLoading ? 'Buscando...' : `${sortedOpportunities.length} oportunidad(es) encontrada(s)`}
              </p>
            </div>

            {isLoading && opportunities.length === 0 ? (
              <div className="space-y-4">
                {[1, 2, 3, 4].map((i) => (
                  <SkeletonOpportunityCard key={i} />
                ))}
              </div>
            ) : sortedOpportunities.length === 0 ? (
              <div className="text-center py-12">
                <Briefcase className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No se encontraron oportunidades</h3>
                <p className="text-muted-foreground mb-4">
                  Intenta con otros términos de búsqueda o ajusta los filtros
                </p>
                <Button variant="outline" onClick={clearFilters}>
                  Limpiar filtros
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {sortedOpportunities.map((opportunity, index) => (
                  <motion.div
                    key={opportunity.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <OpportunityCard
                      opportunity={opportunity}
                      matchScore={opportunity.matchScore}
                      isSaved={user ? isSaved(user.id, opportunity.id) : false}
                      onSave={() => handleSaveToggle(opportunity.id)}
                    />
                  </motion.div>
                ))}

                {hasMore && !isLoading && (
                  <div className="text-center pt-4">
                    <Button 
                      variant="outline" 
                      onClick={loadMoreOpportunities}
                      className="min-h-[44px]"
                    >
                      Cargar más oportunidades
                    </Button>
                  </div>
                )}

                {isLoading && opportunities.length > 0 && (
                  <div className="space-y-4">
                    <SkeletonOpportunityCard />
                    <SkeletonOpportunityCard />
                  </div>
                )}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
