import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCVStore } from '@/store/useCVStore';
import { useAuthStore } from '@/store/useAuthStore';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Save, Sparkles, Download, Eye, EyeOff } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import CVEditorPanel from '@/components/cv/CVEditorPanel';
import CVPreviewPanel from '@/components/cv/CVPreviewPanel';
import TemplateSelector from '@/components/cv/TemplateSelector';
import AIAnalysisModal from '@/components/cv/AIAnalysisModal';
import { cn } from '@/lib/utils';

export default function CVBuilder() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { cvs, currentCV, loadCV, setCurrentCV, createCV, updateCV, saveVersion, analyzeCV, isAnalyzing } = useCVStore();
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [activeView, setActiveView] = useState<'editor' | 'preview'>('editor');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (id === 'new') {
      if (user) {
        const newCV = createCV(user.id, 'Nuevo CV');
        navigate(`/dashboard/cvs/${newCV.id}`, { replace: true });
      }
    } else if (id) {
      loadCV(id);
    }

    return () => {
      setCurrentCV(null);
    };
  }, [id, user, loadCV, createCV, setCurrentCV, navigate]);

  const handleSave = async () => {
    if (!currentCV) return;
    
    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    updateCV(currentCV.id, { updatedAt: new Date().toISOString() });
    
    toast({
      title: '💾 CV guardado',
      description: 'Los cambios se han guardado correctamente',
    });
    
    setIsSaving(false);
  };

  const handleSaveVersion = () => {
    if (!currentCV) return;
    
    const note = prompt('Nota para esta versión (opcional):');
    saveVersion(currentCV.id, note || undefined);
    
    toast({
      title: '📦 Versión guardada',
      description: 'Se ha creado una nueva versión del CV',
    });
  };

  const handleAnalyze = async () => {
    if (!currentCV) return;
    
    await analyzeCV(currentCV.id);
    setShowAnalysis(true);
  };

  const handleExportPDF = () => {
    toast({
      title: '📄 Exportar PDF',
      description: 'Esta funcionalidad estará disponible próximamente',
    });
  };

  if (!currentCV) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-pulse text-muted-foreground">Cargando CV...</div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard/cvs')}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <input
                type="text"
                value={currentCV.title}
                onChange={(e) => updateCV(currentCV.id, { title: e.target.value })}
                className="text-xl font-semibold bg-transparent border-none outline-none focus:ring-2 focus:ring-primary rounded px-2 py-1"
              />
              <p className="text-sm text-muted-foreground">
                {currentCV.personal.fullName || 'Sin nombre'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <TemplateSelector
              value={currentCV.template}
              onChange={(template) => updateCV(currentCV.id, { template })}
            />
            
            <Button variant="outline" onClick={handleSaveVersion}>
              Guardar versión
            </Button>
            
            <Button variant="outline" onClick={handleAnalyze} disabled={isAnalyzing}>
              <Sparkles className="mr-2 h-4 w-4" />
              {isAnalyzing ? 'Analizando...' : 'Analizar'}
            </Button>
            
            <Button variant="outline" onClick={handleExportPDF}>
              <Download className="mr-2 h-4 w-4" />
              PDF
            </Button>
            
            <Button onClick={handleSave} disabled={isSaving}>
              <Save className="mr-2 h-4 w-4" />
              {isSaving ? 'Guardando...' : 'Guardar'}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile View Switcher */}
      <div className="md:hidden border-b bg-card px-4 py-2">
        <Tabs value={activeView} onValueChange={(v) => setActiveView(v as any)}>
          <TabsList className="w-full">
            <TabsTrigger value="editor" className="flex-1">
              Editor
            </TabsTrigger>
            <TabsTrigger value="preview" className="flex-1">
              Vista previa
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
          {/* Editor Panel */}
          <div className={cn(
            "overflow-auto",
            activeView === 'preview' && "hidden md:block"
          )}>
            <CVEditorPanel cv={currentCV} onUpdate={(updates) => updateCV(currentCV.id, updates)} />
          </div>

          {/* Preview Panel */}
          <div className={cn(
            "overflow-auto",
            activeView === 'editor' && "hidden md:block"
          )}>
            <CVPreviewPanel cv={currentCV} />
          </div>
        </div>
      </div>

      {/* AI Analysis Modal */}
      <AIAnalysisModal
        open={showAnalysis}
        onClose={() => setShowAnalysis(false)}
        cv={currentCV}
        onApplySuggestion={(suggestion) => {
          toast({ title: 'Sugerencia aplicada', description: suggestion });
          setShowAnalysis(false);
        }}
      />
    </div>
  );
}
