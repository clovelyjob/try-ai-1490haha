import { CVData } from '@/types';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Plus, Trash2, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { useState } from 'react';

interface CVEditorPanelProps {
  cv: CVData;
  onUpdate: (updates: Partial<CVData>) => void;
  onImproveText: (text: string, type: 'summary' | 'experience' | 'education' | 'general', context?: string, language?: 'es' | 'en') => Promise<string>;
  isAILoading: boolean;
}

export default function CVEditorPanel({ cv, onUpdate, onImproveText, isAILoading }: CVEditorPanelProps) {
  const [improvingField, setImprovingField] = useState<string | null>(null);

  const handleImproveSummary = async () => {
    if (!cv.summary || cv.summary.length < 10) {
      toast.error('Escribe al menos 10 caracteres para mejorar el resumen');
      return;
    }

    setImprovingField('summary');
    try {
      const improved = await onImproveText(cv.summary, 'summary', cv.personal.title, cv.language || 'es');
      onUpdate({ summary: improved });
      toast.success('Resumen mejorado con IA');
    } catch (error) {
      // Error already handled in useAI hook
    } finally {
      setImprovingField(null);
    }
  };

  const handleImproveBullet = async (expId: string, bulletIndex: number, bulletText: string) => {
    if (!bulletText || bulletText.length < 5) {
      toast.error('Escribe al menos 5 caracteres para mejorar');
      return;
    }

    const fieldKey = `exp-${expId}-${bulletIndex}`;
    setImprovingField(fieldKey);
    
    try {
      const exp = cv.experience.find(e => e.id === expId);
      const context = exp ? `${exp.role} en ${exp.company}` : '';
      const improved = await onImproveText(bulletText, 'experience', context, cv.language || 'es');
      
      const updatedExp = cv.experience.map((ex) =>
        ex.id === expId
          ? {
              ...ex,
              bullets: ex.bullets.map((b, i) =>
                i === bulletIndex ? { ...b, text: improved } : b
              ),
            }
          : ex
      );
      onUpdate({ experience: updatedExp });
      toast.success('Texto mejorado con IA');
    } catch (error) {
      // Error already handled in useAI hook
    } finally {
      setImprovingField(null);
    }
  };

  return (
    <div className="space-y-4">
      {/* Language Selector */}
      <Card className="p-4 rounded-2xl shadow-clovely-md bg-blue-50 dark:bg-blue-950/30 border-2 border-blue-200 dark:border-blue-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-2xl"><Globe className="w-6 h-6 text-primary" /></div>
            <div>
              <h3 className="font-bold text-foreground">Idioma del CV</h3>
              <p className="text-xs text-muted-foreground">
                Cambia el idioma de las secciones del CV
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant={cv.language === 'es' ? 'default' : 'outline'}
              size="sm"
              onClick={() => onUpdate({ language: 'es' })}
              className="gap-2 hover:shadow-clovely-sm transition-all"
            >
              ES Español
            </Button>
            <Button
              variant={cv.language === 'en' ? 'default' : 'outline'}
              size="sm"
              onClick={() => onUpdate({ language: 'en' })}
              className="gap-2 hover:shadow-clovely-sm transition-all"
            >
              EN English
            </Button>
          </div>
        </div>
      </Card>

      {/* Guías Profesionales para CV */}
      <Card className="p-4 rounded-2xl shadow-clovely-sm bg-primary/5 border-2 border-primary/20">
        <div className="flex items-start gap-3">
          <div className="text-2xl"><FileText className="w-6 h-6 text-primary" /></div>
          <div className="flex-1">
            <h3 className="font-bold text-foreground mb-1">Guías Profesionales para tu CV</h3>
            <p className="text-xs text-muted-foreground mb-3">
              Este constructor sigue las mejores prácticas profesionales para CVs efectivos
            </p>
            <div className="grid grid-cols-2 gap-2 text-[10px]">
              <div className="bg-background/70 p-2 rounded-lg border border-border/50">
                <span className="font-semibold text-foreground">✓ Específico</span>
                <span className="text-muted-foreground"> no general</span>
              </div>
              <div className="bg-background/70 p-2 rounded-lg border border-border/50">
                <span className="font-semibold text-foreground">✓ Activo</span>
                <span className="text-muted-foreground"> no pasivo</span>
              </div>
              <div className="bg-background/70 p-2 rounded-lg border border-border/50">
                <span className="font-semibold text-foreground">✓ Basado en hechos</span>
                <span className="text-muted-foreground"> (¡cuantifica!)</span>
              </div>
              <div className="bg-background/70 p-2 rounded-lg border border-border/50">
                <span className="font-semibold text-foreground">✓ Fácil de escanear</span>
                <span className="text-muted-foreground"> rápidamente</span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <Accordion type="multiple" defaultValue={['personal']} className="space-y-4">
        {/* Información Personal */}
        <AccordionItem value="personal">
          <Card className="rounded-2xl shadow-clovely-md">
            <AccordionTrigger className="px-6 py-4 hover:no-underline">
              <span className="font-semibold">Información Personal</span>
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-6">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Nombre completo *</Label>
                    <Input
                      value={cv.personal.fullName}
                      onChange={(e) =>
                        onUpdate({
                          personal: { ...cv.personal, fullName: e.target.value },
                        })
                      }
                      placeholder="María González"
                    />
                  </div>
                  <div>
                    <Label>Título profesional</Label>
                    <Input
                      value={cv.personal.title || ''}
                      onChange={(e) =>
                        onUpdate({
                          personal: { ...cv.personal, title: e.target.value },
                        })
                      }
                      placeholder="Analista de Datos"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Email *</Label>
                    <Input
                      type="email"
                      value={cv.personal.email}
                      onChange={(e) =>
                        onUpdate({
                          personal: { ...cv.personal, email: e.target.value },
                        })
                      }
                      placeholder="maria@email.com"
                    />
                  </div>
                  <div>
                    <Label>Teléfono</Label>
                    <Input
                      value={cv.personal.phone || ''}
                      onChange={(e) =>
                        onUpdate({
                          personal: { ...cv.personal, phone: e.target.value },
                        })
                      }
                      placeholder="+34 600 123 456"
                    />
                  </div>
                </div>

                <div>
                  <Label>Ubicación</Label>
                  <Input
                    value={cv.personal.location || ''}
                    onChange={(e) =>
                      onUpdate({
                        personal: { ...cv.personal, location: e.target.value },
                      })
                    }
                    placeholder="Madrid, España"
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label>LinkedIn</Label>
                    <Input
                      value={cv.personal.linkedin || ''}
                      onChange={(e) =>
                        onUpdate({
                          personal: { ...cv.personal, linkedin: e.target.value },
                        })
                      }
                      placeholder="linkedin.com/in/usuario"
                    />
                  </div>
                  <div>
                    <Label>GitHub</Label>
                    <Input
                      value={cv.personal.github || ''}
                      onChange={(e) =>
                        onUpdate({
                          personal: { ...cv.personal, github: e.target.value },
                        })
                      }
                      placeholder="github.com/usuario"
                    />
                  </div>
                  <div>
                    <Label>Website</Label>
                    <Input
                      value={cv.personal.website || ''}
                      onChange={(e) =>
                        onUpdate({
                          personal: { ...cv.personal, website: e.target.value },
                        })
                      }
                      placeholder="miportfolio.com"
                    />
                  </div>
                </div>
              </div>
            </AccordionContent>
          </Card>
        </AccordionItem>


        {/* Experiencia Laboral */}
        <AccordionItem value="experience">
          <Card className="rounded-2xl shadow-clovely-md">
            <AccordionTrigger className="px-6 py-4 hover:no-underline">
              <span className="font-semibold">Experiencia Laboral ({cv.experience.length})</span>
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-6">
              {/* Guías para Experiencia */}
              <div className="mb-4 p-3 rounded-xl bg-purple-50 dark:bg-purple-950/30 border-2 border-purple-200 dark:border-purple-800 text-xs shadow-clovely-sm">
                <p className="font-bold text-purple-900 dark:text-purple-100 mb-1">Top 5 Errores de CV a Evitar:</p>
                <ol className="list-decimal list-inside text-[10px] text-purple-800 dark:text-purple-200 space-y-0.5 ml-2">
                  <li>Errores ortográficos y gramaticales</li>
                  <li>Falta de email y teléfono</li>
                  <li>Usar lenguaje pasivo en lugar de verbos de acción</li>
                  <li>Mala organización, poco conciso o difícil de leer</li>
                  <li>No demostrar resultados (sin cuantificación)</li>
                </ol>
              </div>
              
              <div className="space-y-4">
                {cv.experience.map((exp, index) => (
                  <Card key={exp.id} className="p-4 bg-muted/50">
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <h4 className="font-medium">Experiencia #{index + 1}</h4>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            onUpdate({
                              experience: cv.experience.filter((e) => e.id !== exp.id),
                            });
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label>Empresa *</Label>
                          <Input
                            value={exp.company}
                            onChange={(e) => {
                              const updated = cv.experience.map((ex) =>
                                ex.id === exp.id ? { ...ex, company: e.target.value } : ex
                              );
                              onUpdate({ experience: updated });
                            }}
                          />
                        </div>
                        <div>
                          <Label>Puesto *</Label>
                          <Input
                            value={exp.role}
                            onChange={(e) => {
                              const updated = cv.experience.map((ex) =>
                                ex.id === exp.id ? { ...ex, role: e.target.value } : ex
                              );
                              onUpdate({ experience: updated });
                            }}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-3">
                        <div>
                          <Label>Desde</Label>
                          <Input
                            type="month"
                            value={exp.startDate}
                            onChange={(e) => {
                              const updated = cv.experience.map((ex) =>
                                ex.id === exp.id ? { ...ex, startDate: e.target.value } : ex
                              );
                              onUpdate({ experience: updated });
                            }}
                          />
                        </div>
                        <div>
                          <Label>Hasta</Label>
                          <Input
                            type="month"
                            value={exp.endDate || ''}
                            onChange={(e) => {
                              const updated = cv.experience.map((ex) =>
                                ex.id === exp.id ? { ...ex, endDate: e.target.value } : ex
                              );
                              onUpdate({ experience: updated });
                            }}
                            disabled={exp.current}
                          />
                        </div>
                        <div className="flex items-end">
                          <label className="flex items-center gap-2 text-sm">
                            <input
                              type="checkbox"
                              checked={exp.current || false}
                              onChange={(e) => {
                                const updated = cv.experience.map((ex) =>
                                  ex.id === exp.id
                                    ? { ...ex, current: e.target.checked, endDate: e.target.checked ? undefined : ex.endDate }
                                    : ex
                                );
                                onUpdate({ experience: updated });
                              }}
                              className="rounded border-input"
                            />
                            Actual
                          </label>
                        </div>
                      </div>

                      <div>
                        <Label>Ubicación</Label>
                        <Input
                          value={exp.location || ''}
                          onChange={(e) => {
                            const updated = cv.experience.map((ex) =>
                              ex.id === exp.id ? { ...ex, location: e.target.value } : ex
                            );
                            onUpdate({ experience: updated });
                          }}
                        />
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <Label>Logros y responsabilidades</Label>
                          <div className="text-xs text-muted-foreground bg-muted/50 px-3 py-1.5 rounded-md border border-border">
                            <span className="font-semibold">Consejo:</span> Empieza con verbos de acción (Lideré, Gestioné, Desarrollé) + Métricas
                          </div>
                        </div>
                        
                        {/* Guías Oficiales */}
                        <div className="mb-3 p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border-2 border-amber-200 dark:border-amber-800 text-xs space-y-2 shadow-clovely-sm">
                          <p className="font-bold text-amber-900 dark:text-amber-100">📋 Formato Profesional:</p>
                          <div className="space-y-1">
                            <p className="text-amber-800 dark:text-amber-200">
                              <span className="font-semibold">Verbo de Acción</span> + Logro específico + <span className="font-semibold">Impacto cuantificado</span>
                            </p>
                            <p className="text-amber-700 dark:text-amber-300 italic text-[10px]">
                              "Supervisé equipo de 8 para completar proyecto 3 semanas antes de lo programado"
                            </p>
                          </div>
                          <div className="border-t border-amber-300 dark:border-amber-700 pt-2">
                            <p className="font-semibold text-amber-900 dark:text-amber-100 mb-1">Verbos de Acción por Categoría:</p>
                            <div className="grid grid-cols-2 gap-x-4 gap-y-0.5 text-[10px] text-amber-700 dark:text-amber-300">
                              <div><span className="font-semibold">Liderazgo:</span> Lideré, Dirigí, Gestioné</div>
                              <div><span className="font-semibold">Técnico:</span> Diseñé, Construí, Desarrollé</div>
                              <div><span className="font-semibold">Comunicación:</span> Presenté, Redacté</div>
                              <div><span className="font-semibold">Cuantitativo:</span> Analicé, Pronostiqué</div>
                            </div>
                          </div>
                          <p className="text-[10px] text-amber-600 dark:text-amber-400 mt-1 font-medium">
                            ⚠️ SIN pronombres (Yo, Nosotros) • SIN abreviaturas • Sé específico no general
                          </p>
                        </div>

                        {exp.bullets.map((bullet, bIndex) => (
                          <div key={bIndex} className="flex gap-2 mb-2">
                            <Input
                              value={bullet.text}
                              onChange={(e) => {
                                const updatedExp = cv.experience.map((ex) =>
                                  ex.id === exp.id
                                    ? {
                                        ...ex,
                                        bullets: ex.bullets.map((b, i) =>
                                          i === bIndex ? { ...b, text: e.target.value } : b
                                        ),
                                      }
                                    : ex
                                );
                                onUpdate({ experience: updatedExp });
                              }}
                              placeholder="Supervised team of 8 to complete project 3 weeks ahead of schedule"
                              className="text-sm"
                            />
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => handleImproveBullet(exp.id, bIndex, bullet.text)}
                              disabled={isAILoading || improvingField === `exp-${exp.id}-${bIndex}`}
                              title="Transformar a bullet profesional con IA"
                              className="shrink-0 shadow-clovely-sm hover:shadow-clovely-md transition-all"
                            >
                              {improvingField === `exp-${exp.id}-${bIndex}` ? (
                                <span className="h-4 w-4 animate-spin">⏳</span>
                              ) : (
                                <Sparkles className="h-4 w-4 text-amber-500 animate-pulse" />
                              )}
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                const updatedExp = cv.experience.map((ex) =>
                                  ex.id === exp.id
                                    ? { ...ex, bullets: ex.bullets.filter((_, i) => i !== bIndex) }
                                    : ex
                                );
                                onUpdate({ experience: updatedExp });
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const updatedExp = cv.experience.map((ex) =>
                              ex.id === exp.id
                                ? { ...ex, bullets: [...ex.bullets, { text: '' }] }
                                : ex
                            );
                            onUpdate({ experience: updatedExp });
                          }}
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Añadir logro
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}

                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    onUpdate({
                      experience: [
                        ...cv.experience,
                        {
                          id: `exp_${Date.now()}`,
                          company: '',
                          role: '',
                          startDate: '',
                          bullets: [],
                        },
                      ],
                    });
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Añadir experiencia
                </Button>
              </div>
            </AccordionContent>
          </Card>
        </AccordionItem>

        {/* Formación */}
        <AccordionItem value="education">
          <Card className="rounded-2xl shadow-clovely-md">
            <AccordionTrigger className="px-6 py-4 hover:no-underline">
              <span className="font-semibold">Formación Académica ({cv.education.length})</span>
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-6">
              {/* Guías de Educación */}
              <div className="mb-4 p-3 rounded-xl bg-green-50 dark:bg-green-950/30 border-2 border-green-200 dark:border-green-800 text-xs shadow-clovely-sm">
                <p className="font-bold text-green-900 dark:text-green-100 mb-1">🎓 Guías - Sección de Educación:</p>
                <ul className="list-disc list-inside text-[10px] text-green-800 dark:text-green-200 space-y-0.5">
                  <li>Lista en orden cronológico inverso (más reciente primero)</li>
                  <li>Incluye: Institución, Título, Campo, Fecha de Graduación</li>
                  <li>GPA: Solo incluye si es ≥ 3.5/4.0 o lo requiere el empleador</li>
                  <li>Puedes incluir: Cursos relevantes, honores, título de tesis</li>
                  <li>Experiencias de intercambio se pueden listar aquí</li>
                </ul>
              </div>
              
              <div className="space-y-4">
                {cv.education.map((edu, index) => (
                  <Card key={edu.id} className="p-4 bg-muted/50">
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <h4 className="font-medium">Formación #{index + 1}</h4>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            onUpdate({
                              education: cv.education.filter((e) => e.id !== edu.id),
                            });
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label>Institución *</Label>
                          <Input
                            value={edu.institution}
                            onChange={(e) => {
                              const updated = cv.education.map((ed) =>
                                ed.id === edu.id ? { ...ed, institution: e.target.value } : ed
                              );
                              onUpdate({ education: updated });
                            }}
                          />
                        </div>
                        <div>
                          <Label>Título *</Label>
                          <Input
                            value={edu.degree}
                            onChange={(e) => {
                              const updated = cv.education.map((ed) =>
                                ed.id === edu.id ? { ...ed, degree: e.target.value } : ed
                              );
                              onUpdate({ education: updated });
                            }}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label>Campo de estudio</Label>
                          <Input
                            value={edu.field}
                            onChange={(e) => {
                              const updated = cv.education.map((ed) =>
                                ed.id === edu.id ? { ...ed, field: e.target.value } : ed
                              );
                              onUpdate({ education: updated });
                            }}
                          />
                        </div>
                        <div>
                          <Label>GPA / Nota</Label>
                          <Input
                            value={edu.gpa || ''}
                            onChange={(e) => {
                              const updated = cv.education.map((ed) =>
                                ed.id === edu.id ? { ...ed, gpa: e.target.value } : ed
                              );
                              onUpdate({ education: updated });
                            }}
                            placeholder="3.8/4.0"
                          />
                          <p className="text-xs text-muted-foreground mt-1">
                            💡 Consejo: Solo incluye si es ≥ 3.5/4.0
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label>Desde</Label>
                          <Input
                            type="month"
                            value={edu.startDate}
                            onChange={(e) => {
                              const updated = cv.education.map((ed) =>
                                ed.id === edu.id ? { ...ed, startDate: e.target.value } : ed
                              );
                              onUpdate({ education: updated });
                            }}
                          />
                        </div>
                        <div>
                          <Label>Hasta</Label>
                          <Input
                            type="month"
                            value={edu.endDate || ''}
                            onChange={(e) => {
                              const updated = cv.education.map((ed) =>
                                ed.id === edu.id ? { ...ed, endDate: e.target.value } : ed
                              );
                              onUpdate({ education: updated });
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}

                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    onUpdate({
                      education: [
                        ...cv.education,
                        {
                          id: `edu_${Date.now()}`,
                          institution: '',
                          degree: '',
                          field: '',
                          startDate: '',
                        },
                      ],
                    });
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Añadir formación
                </Button>
              </div>
            </AccordionContent>
          </Card>
        </AccordionItem>

        {/* Skills */}
        <AccordionItem value="skills">
          <Card className="rounded-2xl shadow-clovely-md">
            <AccordionTrigger className="px-6 py-4 hover:no-underline">
              <span className="font-semibold">Habilidades ({cv.skills.length})</span>
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-6">
              <div className="space-y-4">
                {cv.skills.map((skill, index) => (
                  <div key={index} className="flex gap-2 items-center">
                    <Input
                      value={skill.name}
                      onChange={(e) => {
                        const updated = cv.skills.map((s, i) =>
                          i === index ? { ...s, name: e.target.value } : s
                        );
                        onUpdate({ skills: updated });
                      }}
                      placeholder="Python"
                      className="focus-visible:shadow-clovely-md focus-visible:ring-2 focus-visible:ring-primary/20 transition-all"
                    />
                    <select
                      value={skill.level}
                      onChange={(e) => {
                        const updated = cv.skills.map((s, i) =>
                          i === index ? { ...s, level: e.target.value as any } : s
                        );
                        onUpdate({ skills: updated });
                      }}
                      className="border rounded-lg px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:shadow-clovely-sm transition-all"
                    >
                      <option value="básico">Básico</option>
                      <option value="intermedio">Intermedio</option>
                      <option value="avanzado">Avanzado</option>
                    </select>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        onUpdate({ skills: cv.skills.filter((_, i) => i !== index) });
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}

                <Button
                  variant="outline"
                  className="w-full shadow-clovely-sm hover:shadow-clovely-md transition-all"
                  onClick={() => {
                    onUpdate({
                      skills: [...cv.skills, { name: '', level: 'intermedio' }],
                    });
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Añadir habilidad
                </Button>
              </div>
            </AccordionContent>
          </Card>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
