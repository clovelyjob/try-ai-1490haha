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
  onImproveText: (text: string, type: 'summary' | 'experience' | 'education' | 'general', context?: string) => Promise<string>;
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
      const improved = await onImproveText(cv.summary, 'summary', cv.personal.title);
      onUpdate({ summary: improved });
      toast.success('✨ Resumen mejorado con IA');
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
      const improved = await onImproveText(bulletText, 'experience', context);
      
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
      toast.success('✨ Texto mejorado con IA');
    } catch (error) {
      // Error already handled in useAI hook
    } finally {
      setImprovingField(null);
    }
  };

  return (
    <div className="space-y-4">
      <Accordion type="multiple" defaultValue={['personal', 'summary']} className="space-y-4">
        {/* Información Personal */}
        <AccordionItem value="personal">
          <Card>
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

        {/* Resumen Profesional */}
        <AccordionItem value="summary">
          <Card>
            <AccordionTrigger className="px-6 py-4 hover:no-underline">
              <span className="font-semibold">Resumen Profesional</span>
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Resumen (50-500 caracteres)</Label>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleImproveSummary}
                    disabled={isAILoading || improvingField === 'summary'}
                    className="gap-2"
                  >
                    <Sparkles className="h-3 w-3" />
                    {improvingField === 'summary' ? 'Mejorando...' : 'Mejorar con IA'}
                  </Button>
                </div>
                <Textarea
                  value={cv.summary}
                  onChange={(e) => onUpdate({ summary: e.target.value })}
                  placeholder="Describe tu perfil profesional en 2-4 frases..."
                  rows={4}
                  maxLength={500}
                />
                <div className="text-xs text-muted-foreground text-right">
                  {cv.summary.length}/500 caracteres
                </div>
              </div>
            </AccordionContent>
          </Card>
        </AccordionItem>

        {/* Experiencia Laboral */}
        <AccordionItem value="experience">
          <Card>
            <AccordionTrigger className="px-6 py-4 hover:no-underline">
              <span className="font-semibold">Experiencia Laboral ({cv.experience.length})</span>
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-6">
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
                        <Label>Logros y responsabilidades</Label>
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
                              placeholder="Logro o responsabilidad"
                            />
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleImproveBullet(exp.id, bIndex, bullet.text)}
                              disabled={isAILoading || improvingField === `exp-${exp.id}-${bIndex}`}
                              title="Mejorar con IA"
                            >
                              <Sparkles className="h-4 w-4" />
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
          <Card>
            <AccordionTrigger className="px-6 py-4 hover:no-underline">
              <span className="font-semibold">Formación Académica ({cv.education.length})</span>
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-6">
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
                          />
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
          <Card>
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
                    />
                    <select
                      value={skill.level}
                      onChange={(e) => {
                        const updated = cv.skills.map((s, i) =>
                          i === index ? { ...s, level: e.target.value as any } : s
                        );
                        onUpdate({ skills: updated });
                      }}
                      className="border rounded px-3 py-2 bg-background"
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
                  className="w-full"
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
