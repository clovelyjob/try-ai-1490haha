import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Opportunity, CVData } from '@/types';
import { FileText, Sparkles, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';

interface PostularModalProps {
  open: boolean;
  onClose: () => void;
  opportunity: Opportunity;
  cvs: CVData[];
  onSubmit: (data: { cvVersionId: string; coverLetter?: string }) => void;
  isSubmitting?: boolean;
}

export default function PostularModal({
  open,
  onClose,
  opportunity,
  cvs,
  onSubmit,
  isSubmitting,
}: PostularModalProps) {
  const [selectedCV, setSelectedCV] = useState('');
  const [coverLetter, setCoverLetter] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);

  const handleSubmit = () => {
    if (!selectedCV || !acceptTerms) return;
    onSubmit({
      cvVersionId: selectedCV,
      coverLetter: coverLetter.trim() || undefined,
    });
  };

  const handleClose = () => {
    setSelectedCV('');
    setCoverLetter('');
    setAcceptTerms(false);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Postular a {opportunity.title}</DialogTitle>
          <DialogDescription>
            {opportunity.company} • {opportunity.location}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {cvs.length === 0 ? (
            <Alert className="rounded-xl border-2">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                No tienes CVs guardados. Crea uno antes de postular.{' '}
                <Link to="/dashboard/cvs/new" className="font-medium underline hover:text-primary transition-colors">
                  Crear CV
                </Link>
              </AlertDescription>
            </Alert>
          ) : (
            <>
              {/* CV Selection */}
              <div className="space-y-2">
                <Label htmlFor="cv-select" className="text-sm font-semibold">Selecciona tu CV *</Label>
                <Select value={selectedCV} onValueChange={setSelectedCV}>
                  <SelectTrigger id="cv-select" className="rounded-xl shadow-clovely-sm h-12">
                    <SelectValue placeholder="Elige una versión de tu CV" />
                  </SelectTrigger>
                  <SelectContent>
                    {cvs.map((cv) => (
                      <SelectItem key={cv.id} value={cv.id}>
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4" />
                          <span>{cv.title}</span>
                          <span className="text-xs text-muted-foreground">
                            (Score: {cv.score.overall}/100)
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {selectedCV && (
                  <Button variant="outline" size="sm" className="w-full mt-2 gap-1">
                    <Sparkles className="h-4 w-4 animate-pulse" />
                    Optimizar CV para esta oferta
                  </Button>
                )}
              </div>

              {/* Cover Letter */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="cover-letter" className="text-sm font-semibold">
                    Carta de presentación (opcional)
                  </Label>
                  <Button variant="ghost" size="sm" className="h-8 text-xs gap-1">
                    <Sparkles className="h-3 w-3 animate-pulse" />
                    Generar con IA
                  </Button>
                </div>
                <Textarea
                  id="cover-letter"
                  placeholder="Cuéntanos por qué eres el candidato ideal para esta posición..."
                  rows={6}
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  maxLength={1000}
                  className="rounded-xl shadow-clovely-sm focus-visible:shadow-clovely-md focus-visible:ring-primary/20"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Máximo 1000 caracteres</span>
                  <span>{coverLetter.length}/1000</span>
                </div>
              </div>

              {/* Terms */}
              <div className="flex items-start space-x-3 p-3 rounded-lg bg-muted/30">
                <Checkbox
                  id="terms"
                  checked={acceptTerms}
                  onCheckedChange={(checked) => setAcceptTerms(checked as boolean)}
                  className="mt-0.5"
                />
                <label htmlFor="terms" className="text-sm cursor-pointer leading-relaxed">
                  Acepto que mis datos sean compartidos con {opportunity.company} para
                  fines de reclutamiento y autorizo el procesamiento de mi información.
                </label>
              </div>
            </>
          )}
        </div>

        <DialogFooter className="gap-3">
          <Button variant="outline" onClick={handleClose} disabled={isSubmitting} size="lg">
            Cancelar
          </Button>
          <Button
            variant="premium"
            onClick={handleSubmit}
            disabled={!selectedCV || !acceptTerms || isSubmitting || cvs.length === 0}
            size="lg"
            className="shadow-clovely-glow"
          >
            {isSubmitting ? 'Enviando...' : 'Enviar postulación'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
