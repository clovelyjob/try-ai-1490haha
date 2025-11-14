import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCVStore } from '@/store/useCVStore';
import { useAuthStore } from '@/store/useAuthStore';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ArrowLeft, Save, Sparkles, Download, History, Palette, GitCompare } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import CVEditorPanel from '@/components/cv/CVEditorPanel';
import CVPreviewPanel from '@/components/cv/CVPreviewPanel';
import TemplateSelector from '@/components/cv/TemplateSelector';
import AIAnalysisModal from '@/components/cv/AIAnalysisModal';
import VersionHistoryModal from '@/components/cv/VersionHistoryModal';
import VersionCompareModal from '@/components/cv/VersionCompareModal';
import ExportSettingsModal, { ExportSettings } from '@/components/cv/ExportSettingsModal';
import TemplateCustomizer, { TemplateColors } from '@/components/cv/TemplateCustomizer';
import { cn } from '@/lib/utils';
import { useAI } from '@/hooks/useAI';
import html2pdf from 'html2pdf.js';

export default function CVBuilder() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { cvs, currentCV, loadCV, setCurrentCV, createCV, updateCV, saveVersion, analyzeCV, isAnalyzing } = useCVStore();
  const { improveText, analyzeCV: analyzeCVintense, isLoading: isAILoading } = useAI();
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [analysisData, setAnalysisData] = useState<any>(null);
  const [activeView, setActiveView] = useState<'editor' | 'preview'>('editor');
  const [isSaving, setIsSaving] = useState(false);
  const [showVersionHistory, setShowVersionHistory] = useState(false);
  const [showVersionCompare, setShowVersionCompare] = useState(false);
  const [showExportSettings, setShowExportSettings] = useState(false);
  const [showTemplateCustomizer, setShowTemplateCustomizer] = useState(false);
  const [templateColors, setTemplateColors] = useState<TemplateColors>({
    primary: '#1e40af',
    secondary: '#3b82f6',
    accent: '#60a5fa',
    text: '#1f2937',
    background: '#ffffff',
  });
  const previewRef = useRef<HTMLDivElement>(null);

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
    
    try {
      const analysis = await analyzeCVintense(currentCV, currentCV.personal.title);
      setAnalysisData(analysis);
      setShowAnalysis(true);
      
      toast({
        title: '✨ Análisis completado',
        description: 'Revisa las sugerencias personalizadas para mejorar tu CV',
      });
    } catch (error) {
      console.error('Error analyzing CV:', error);
    }
  };

  const handleImproveText = async (
    text: string,
    type: 'summary' | 'experience' | 'education' | 'general',
    context?: string
  ) => {
    try {
      const improved = await improveText(text, type, context);
      return improved;
    } catch (error) {
      console.error('Error improving text:', error);
      throw error;
    }
  };

  const handleExportPDF = (settings: ExportSettings) => {
    if (!previewRef.current || !currentCV) return;

    const element = previewRef.current;
    const fileName = `${currentCV.title || 'CV'}_${currentCV.personal.fullName || 'sin-nombre'}.pdf`;

    const formatMap = {
      A4: 'a4',
      Letter: 'letter',
      Legal: 'legal',
    };

    const opt = {
      margin: [settings.marginTop, settings.marginRight, settings.marginBottom, settings.marginLeft] as [number, number, number, number],
      filename: fileName,
      image: { type: 'jpeg' as const, quality: settings.highQuality ? 0.98 : 0.85 },
      html2canvas: { 
        scale: settings.highQuality ? 2 : 1, 
        useCORS: true, 
        letterRendering: true,
        backgroundColor: settings.includeColors ? null : '#ffffff',
      },
      jsPDF: { 
        unit: 'mm', 
        format: formatMap[settings.format], 
        orientation: 'portrait' as const
      },
    };

    toast({
      title: '📄 Generando PDF',
      description: 'Por favor espera un momento...',
    });

    html2pdf()
      .set(opt)
      .from(element)
      .save()
      .then(() => {
        toast({
          title: '✅ PDF exportado',
          description: `Tu CV ha sido descargado como ${fileName}`,
        });
      })
      .catch((error: any) => {
        console.error('Error exporting PDF:', error);
        toast({
          title: '❌ Error al exportar',
          description: 'Hubo un problema al generar el PDF',
          variant: 'destructive',
        });
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
            
            <Button variant="outline" size="icon" onClick={() => setShowTemplateCustomizer(true)} title="Personalizar colores">
              <Palette className="h-4 w-4" />
            </Button>
            
            <Button variant="outline" onClick={() => setShowVersionHistory(true)}>
              <History className="mr-2 h-4 w-4" />
              Historial
            </Button>
            
            {currentCV.versions.length > 0 && (
              <Button variant="outline" onClick={() => setShowVersionCompare(true)}>
                <GitCompare className="mr-2 h-4 w-4" />
                Comparar
              </Button>
            )}
            
            <Button variant="outline" onClick={handleSaveVersion}>
              Guardar versión
            </Button>
            
            <Button variant="outline" onClick={handleAnalyze} disabled={isAILoading}>
              <Sparkles className="mr-2 h-4 w-4" />
              {isAILoading ? 'Analizando...' : 'Analizar'}
            </Button>
            
            <Button variant="outline" onClick={() => setShowExportSettings(true)}>
              <Download className="mr-2 h-4 w-4" />
              Exportar
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
            <CVEditorPanel 
              cv={currentCV} 
              onUpdate={(updates) => updateCV(currentCV.id, updates)}
              onImproveText={handleImproveText}
              isAILoading={isAILoading}
            />
          </div>

          {/* Preview Panel */}
          <div className={cn(
            "overflow-auto",
            activeView === 'editor' && "hidden md:block"
          )}>
            <CVPreviewPanel ref={previewRef} cv={currentCV} />
          </div>
        </div>
      </div>

      {/* AI Analysis Modal */}
      {showAnalysis && analysisData && (
        <AIAnalysisModal
          open={showAnalysis}
          onClose={() => setShowAnalysis(false)}
          analysisData={analysisData}
          onApplySuggestion={(suggestion) => {
            toast({ title: '💡 Sugerencia guardada', description: suggestion });
          }}
        />
      )}

      {/* Version History Modal */}
      {showVersionHistory && currentCV && (
        <VersionHistoryModal
          open={showVersionHistory}
          onClose={() => setShowVersionHistory(false)}
          versions={currentCV.versions}
          onRestore={(versionId) => {
            saveVersion(currentCV.id, 'Backup antes de restaurar');
            useCVStore.getState().restoreVersion(currentCV.id, versionId);
            toast({
              title: '✅ Versión restaurada',
              description: 'Se ha restaurado la versión seleccionada',
            });
          }}
          onDelete={(versionId) => {
            const updatedVersions = currentCV.versions.filter(v => v.versionId !== versionId);
            updateCV(currentCV.id, { versions: updatedVersions });
            toast({
              title: '🗑️ Versión eliminada',
              description: 'La versión ha sido eliminada',
            });
          }}
        />
      )}

      {/* Version Compare Modal */}
      {showVersionCompare && currentCV && (
        <VersionCompareModal
          open={showVersionCompare}
          onClose={() => setShowVersionCompare(false)}
          currentCV={currentCV}
          versions={currentCV.versions}
        />
      )}

      {/* Export Settings Modal */}
      {showExportSettings && (
        <ExportSettingsModal
          open={showExportSettings}
          onClose={() => setShowExportSettings(false)}
          onExport={handleExportPDF}
          onPreview={() => {
            toast({
              title: '👁️ Vista previa',
              description: 'La vista previa actual muestra cómo se verá tu PDF',
            });
          }}
        />
      )}

      {/* Template Customizer Modal */}
      {showTemplateCustomizer && currentCV && (
        <TemplateCustomizer
          open={showTemplateCustomizer}
          onClose={() => setShowTemplateCustomizer(false)}
          currentColors={templateColors}
          onApply={(colors) => {
            setTemplateColors(colors);
            toast({
              title: '🎨 Colores aplicados',
              description: 'El esquema de colores ha sido actualizado',
            });
          }}
          template={currentCV.template}
        />
      )}
    </div>
  );
}
