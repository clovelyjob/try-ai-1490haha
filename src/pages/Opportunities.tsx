import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useOpportunitiesStore } from '@/store/useOpportunitiesStore';
import { useAuthStore } from '@/store/useAuthStore';
import { useProfileStore } from '@/store/useProfileStore';
import { useCVStore } from '@/store/useCVStore';
import { useProgressStore } from '@/store/useProgressStore';
import OpportunityCard from '@/components/opportunities/OpportunityCard';
import FilterPanel from '@/components/opportunities/FilterPanel';
import { Search, RefreshCw, Briefcase } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';

export default function Opportunities() {
  const { user } = useAuthStore();
  const { profile } = useProfileStore();
  const { cvs } = useCVStore();
  const { addXP } = useProgressStore();
  const {
    opportunities,
    filters,
    loadOpportunities,
    setFilters,
    clearFilters,
    saveOpportunity,
    unsaveOpportunity,
    isSaved,
    calculateMatch,
  } = useOpportunitiesStore();

  const [localSearch, setLocalSearch] = useState(filters.search);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    loadOpportunities();
  }, [loadOpportunities]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFilters({ search: localSearch });
    }, 300);
    return () => clearTimeout(timer);
  }, [localSearch, setFilters]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      loadOpportunities();
      setIsRefreshing(false);
      toast({
        title: '✅ Oportunidades actualizadas',
        description: 'Se han cargado las últimas ofertas disponibles',
      });
    }, 1000);
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
        title: '✅ Oferta guardada',
        description: 'Puedes verla en tu lista de guardadas',
      });
    }
  };

  // Filter opportunities
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
      <div className="border-b bg-card shadow-clovely-sm">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold">Oportunidades</h1>
              <p className="text-muted-foreground">
                Encuentra prácticas y empleos que se ajusten a tu perfil
              </p>
            </div>
            <Button variant="outline" onClick={handleRefresh} disabled={isRefreshing}>
              <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              Actualizar
            </Button>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por título, empresa, tecnología..."
              className="pl-10"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          <aside className="lg:col-span-1">
            <FilterPanel
              filters={filters}
              onFilterChange={(newFilters) => setFilters(newFilters)}
              onClearFilters={clearFilters}
            />
          </aside>

          {/* Results */}
          <main className="lg:col-span-3">
            <div className="mb-6">
              <p className="text-sm text-muted-foreground">
                {sortedOpportunities.length} oportunidad(es) encontrada(s)
              </p>
            </div>

            {sortedOpportunities.length === 0 ? (
              <div className="text-center py-12">
                <Briefcase className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No se encontraron oportunidades</h3>
                <p className="text-muted-foreground mb-4">
                  Intenta ajustar los filtros o la búsqueda
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
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
