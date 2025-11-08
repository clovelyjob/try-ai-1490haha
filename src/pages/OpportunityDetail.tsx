import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useOpportunitiesStore } from '@/store/useOpportunitiesStore';
import { useAuthStore } from '@/store/useAuthStore';
import { useProfileStore } from '@/store/useProfileStore';
import { useCVStore } from '@/store/useCVStore';
import { useProgressStore } from '@/store/useProgressStore';
import MatchScore from '@/components/opportunities/MatchScore';
import PostularModal from '@/components/opportunities/PostularModal';
import OpportunityCard from '@/components/opportunities/OpportunityCard';
import {
  ArrowLeft,
  MapPin,
  Briefcase,
  Clock,
  DollarSign,
  Bookmark,
  BookmarkCheck,
  Send,
  Building2,
  Calendar,
  Eye,
  Users,
  CheckCircle2,
} from 'lucide-react';
import { formatDistanceToNow, format } from 'date-fns';
import { es } from 'date-fns/locale';
import { toast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import Confetti from 'react-confetti';

export default function OpportunityDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { profile } = useProfileStore();
  const { cvs } = useCVStore();
  const { addXP, addCoins } = useProgressStore();

  const {
    opportunities,
    saveOpportunity,
    unsaveOpportunity,
    isSaved,
    createApplication,
    hasApplied,
    calculateMatch,
  } = useOpportunitiesStore();

  const [showPostularModal, setShowPostularModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showMatch, setShowMatch] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const opportunity = opportunities.find((opp) => opp.id === id);
  const applied = user ? hasApplied(user.id, id!) : false;
  const saved = user ? isSaved(user.id, id!) : false;

  const userCV = user ? cvs.find((cv) => cv.userId === user.id) : undefined;
  const matchResult = opportunity && profile ? calculateMatch(opportunity, profile, userCV) : null;

  useEffect(() => {
    if (!opportunity) {
      toast({
        title: 'Oportunidad no encontrada',
        variant: 'destructive',
      });
      navigate('/dashboard/opportunities');
    }
  }, [opportunity, navigate]);

  if (!opportunity) return null;

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

  const handleSaveToggle = () => {
    if (!user) return;

    if (saved) {
      unsaveOpportunity(user.id, opportunity.id);
      toast({
        title: 'Oferta eliminada',
        description: 'Se ha eliminado de tus guardados',
      });
    } else {
      saveOpportunity(user.id, opportunity.id);
      addXP(5);
      toast({
        title: '✅ Oferta guardada',
        description: 'Puedes verla en tu lista de guardadas',
      });
    }
  };

  const handlePostular = async (data: { cvVersionId: string; coverLetter?: string }) => {
    if (!user) return;

    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));

    createApplication({
      userId: user.id,
      opportunityId: opportunity.id,
      cvVersionId: data.cvVersionId,
      coverLetter: data.coverLetter,
      status: 'sent',
      matchScore: matchResult?.overall,
    });

    addXP(50);
    addCoins(10);

    setIsSubmitting(false);
    setShowPostularModal(false);
    setShowConfetti(true);

    toast({
      title: '🎉 ¡Postulación enviada!',
      description: 'Has ganado 50 XP y 10 Clovely Coins',
    });

    setTimeout(() => {
      setShowConfetti(false);
    }, 5000);
  };

  // Related opportunities (same category)
  const relatedOpportunities = opportunities
    .filter((opp) => opp.id !== opportunity.id && opp.category === opportunity.category)
    .slice(0, 3);

  return (
    <>
      {showConfetti && <Confetti recycle={false} numberOfPieces={500} />}

      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="border-b bg-card">
          <div className="container mx-auto px-4 py-6">
            <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Button>

            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h1 className="text-3xl font-bold mb-2">{opportunity.title}</h1>
                <div className="flex items-center gap-4 text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Building2 className="h-4 w-4" />
                    {opportunity.company}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {opportunity.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {formatDistanceToNow(new Date(opportunity.publishedAt), {
                      addSuffix: true,
                      locale: es,
                    })}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button variant="outline" onClick={handleSaveToggle}>
                  {saved ? (
                    <>
                      <BookmarkCheck className="h-4 w-4 mr-2" />
                      Guardado
                    </>
                  ) : (
                    <>
                      <Bookmark className="h-4 w-4 mr-2" />
                      Guardar
                    </>
                  )}
                </Button>
                {applied ? (
                  <Button disabled>
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    Ya postulaste
                  </Button>
                ) : (
                  <Button onClick={() => setShowPostularModal(true)}>
                    <Send className="h-4 w-4 mr-2" />
                    Postular
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Quick info */}
              <Card className="p-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Modalidad</p>
                    <Badge variant="secondary" className="gap-1">
                      <Briefcase className="h-3 w-3" />
                      {modalityLabels[opportunity.modality]}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Tipo</p>
                    <Badge variant="secondary">{contractLabels[opportunity.contractType]}</Badge>
                  </div>
                  {opportunity.salaryRange && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Salario</p>
                      <Badge variant="secondary" className="gap-1">
                        <DollarSign className="h-3 w-3" />
                        {opportunity.salaryRange.min}-{opportunity.salaryRange.max}{' '}
                        {opportunity.salaryRange.currency}
                      </Badge>
                    </div>
                  )}
                  {opportunity.expiresAt && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Cierra</p>
                      <Badge variant="secondary" className="gap-1">
                        <Clock className="h-3 w-3" />
                        {format(new Date(opportunity.expiresAt), 'dd MMM', { locale: es })}
                      </Badge>
                    </div>
                  )}
                </div>

                <Separator className="my-4" />

                <div className="flex items-center gap-6 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Eye className="h-4 w-4" />
                    {opportunity.views} vistas
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    {opportunity.applicantsCount} postulantes
                  </span>
                </div>
              </Card>

              {/* Description */}
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">Descripción</h2>
                <p className="text-muted-foreground whitespace-pre-line">
                  {opportunity.description}
                </p>
              </Card>

              {/* Requirements */}
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">Requisitos</h2>
                <ul className="space-y-2">
                  {opportunity.requirements.map((req, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </Card>

              {/* Benefits */}
              {opportunity.benefits && opportunity.benefits.length > 0 && (
                <Card className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Beneficios</h2>
                  <ul className="space-y-2">
                    {opportunity.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              )}

              {/* Tags */}
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">Tecnologías y habilidades</h2>
                <div className="flex flex-wrap gap-2">
                  {opportunity.tags.map((tag) => (
                    <Badge key={tag} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Match Score */}
              {matchResult && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <MatchScore matchResult={matchResult} />
                </motion.div>
              )}

              {/* Actions */}
              <Card className="p-6">
                <h3 className="font-semibold mb-4">Acciones rápidas</h3>
                <div className="space-y-2">
                  {!applied && (
                    <Button className="w-full" onClick={() => setShowPostularModal(true)}>
                      <Send className="h-4 w-4 mr-2" />
                      Postular ahora
                    </Button>
                  )}
                  {cvs.length > 0 && (
                    <Link to={`/dashboard/cvs/${cvs[0].id}`}>
                      <Button variant="outline" className="w-full">
                        Optimizar CV para esta oferta
                      </Button>
                    </Link>
                  )}
                  <Button variant="outline" className="w-full">
                    Simular entrevista
                  </Button>
                </div>
              </Card>

              {/* Related opportunities */}
              {relatedOpportunities.length > 0 && (
                <Card className="p-6">
                  <h3 className="font-semibold mb-4">Ofertas similares</h3>
                  <div className="space-y-3">
                    {relatedOpportunities.map((opp) => (
                      <Link key={opp.id} to={`/dashboard/opportunities/${opp.id}`}>
                        <div className="p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                          <h4 className="font-medium text-sm mb-1">{opp.title}</h4>
                          <p className="text-xs text-muted-foreground">{opp.company}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Postular Modal */}
      <PostularModal
        open={showPostularModal}
        onClose={() => setShowPostularModal(false)}
        opportunity={opportunity}
        cvs={cvs.filter((cv) => user && cv.userId === user.id)}
        onSubmit={handlePostular}
        isSubmitting={isSubmitting}
      />
    </>
  );
}
