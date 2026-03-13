import { useState } from 'react';
import { CVData, CVVersion } from '@/types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import CVPreviewPanel from './CVPreviewPanel';
import { ArrowLeftRight } from 'lucide-react';

interface VersionCompareModalProps {
  open: boolean;
  onClose: () => void;
  currentCV: CVData;
  versions: CVVersion[];
}

export default function VersionCompareModal({
  open,
  onClose,
  currentCV,
  versions,
}: VersionCompareModalProps) {
  const [leftVersionId, setLeftVersionId] = useState<string>('current');
  const [rightVersionId, setRightVersionId] = useState<string>(versions[0]?.versionId || '');

  const getVersionData = (versionId: string): CVData => {
    if (versionId === 'current') return currentCV;
    
    const version = versions.find(v => v.versionId === versionId);
    if (!version) return currentCV;
    
    return {
      ...currentCV,
      ...version.snapshot,
    } as CVData;
  };

  const leftCV = getVersionData(leftVersionId);
  const rightCV = getVersionData(rightVersionId);

  const sortedVersions = [...versions].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const getDifferencesCount = () => {
    let count = 0;
    
    // Compare basic fields
    if (leftCV.title !== rightCV.title) count++;
    if (leftCV.summary !== rightCV.summary) count++;
    if (leftCV.template !== rightCV.template) count++;
    
    // Compare personal info
    const leftPersonal = JSON.stringify(leftCV.personal);
    const rightPersonal = JSON.stringify(rightCV.personal);
    if (leftPersonal !== rightPersonal) count++;
    
    // Compare arrays
    if (leftCV.education.length !== rightCV.education.length) count++;
    if (leftCV.experience.length !== rightCV.experience.length) count++;
    if (leftCV.skills.length !== rightCV.skills.length) count++;
    
    return count;
  };

  const differences = getDifferencesCount();

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] max-h-[90vh] w-full">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ArrowLeftRight className="h-5 w-5" />
            Comparar Versiones
          </DialogTitle>
          <DialogDescription>
            Selecciona dos versiones para comparar lado a lado. 
            {differences > 0 && (
              <Badge variant="secondary" className="ml-2">
                {differences} diferencia{differences !== 1 ? 's' : ''} detectada{differences !== 1 ? 's' : ''}
              </Badge>
            )}
          </DialogDescription>
        </DialogHeader>

        {/* Version Selectors */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Versión Izquierda</label>
            <Select value={leftVersionId} onValueChange={setLeftVersionId}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="current">
                  Versión Actual
                </SelectItem>
                {sortedVersions.map((version) => (
                  <SelectItem key={version.versionId} value={version.versionId}>
                    {new Date(version.createdAt).toLocaleDateString('es-ES', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                    {version.note && ` - ${version.note.substring(0, 30)}`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Versión Derecha</label>
            <Select value={rightVersionId} onValueChange={setRightVersionId}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="current">
                  Versión Actual
                </SelectItem>
                {sortedVersions.map((version) => (
                  <SelectItem key={version.versionId} value={version.versionId}>
                    📅 {new Date(version.createdAt).toLocaleDateString('es-ES', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                    {version.note && ` - ${version.note.substring(0, 30)}`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Side by Side Comparison */}
        <div className="grid grid-cols-2 gap-4 h-[calc(90vh-250px)]">
          <ScrollArea className="h-full border rounded-lg">
            <div className="scale-75 origin-top-left w-[133.33%]">
              <CVPreviewPanel cv={leftCV} />
            </div>
          </ScrollArea>

          <ScrollArea className="h-full border rounded-lg">
            <div className="scale-75 origin-top-left w-[133.33%]">
              <CVPreviewPanel cv={rightCV} />
            </div>
          </ScrollArea>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Cerrar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
