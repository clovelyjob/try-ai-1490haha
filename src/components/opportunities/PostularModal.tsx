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
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                No tienes CVs guardados. Crea uno antes de postular.{' '}
                <Link to="/dashboard/cvs/new" className="font-medium underline">
                  Crear CV
                </Link>
              </AlertDescription>
            </Alert>
          ) : (
            <>
              {/* CV Selection */}
              <div className="space-y-2">
                <Label htmlFor="cv-select">Selecciona tu CV *</Label>
                <Select value={selectedCV} onValueChange={setSelectedCV}>
                  <SelectTrigger id="cv-select">
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
                  <Button variant="outline" size="sm" className="w-full mt-2">
                    <Sparkles className="h-4 w-4 mr-2" />
                    Optimizar CV para esta oferta
                  </Button>
                )}
              </div>

              {/* Cover Letter */}
              <div className="space-y-2">
                <Label htmlFor="cover-letter">
                  Carta de presentación (opcional)
                </Label>
                <Textarea
                  id="cover-letter"
                  placeholder="Cuéntanos por qué eres el candidato ideal para esta posición..."
                  rows={6}
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  maxLength={1000}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Máximo 1000 caracteres</span>
                  <span>{coverLetter.length}/1000</span>
                </div>
                <Button variant="ghost" size="sm" className="w-full">
                  <Sparkles className="h-4 w-4 mr-2" />
                  Generar con IA
                </Button>
              </div>

              {/* Terms */}
              <div className="flex items-start space-x-2">
                <Checkbox
                  id="terms"
                  checked={acceptTerms}
                  onCheckedChange={(checked) => setAcceptTerms(checked as boolean)}
                />
                <label htmlFor="terms" className="text-sm cursor-pointer leading-relaxed">
                  Acepto que mis datos sean compartidos con {opportunity.company} para
                  fines de reclutamiento y autorizo el procesamiento de mi información.
                </label>
              </div>
            </>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!selectedCV || !acceptTerms || isSubmitting || cvs.length === 0}
          >
            {isSubmitting ? 'Enviando...' : 'Enviar postulación'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
