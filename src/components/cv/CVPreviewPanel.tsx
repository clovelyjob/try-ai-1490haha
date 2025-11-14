import { forwardRef } from 'react';
import { CVData } from '@/types';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Mail, Phone, MapPin, Linkedin, Github, Globe } from 'lucide-react';

interface CVPreviewPanelProps {
  cv: CVData;
}

const CVPreviewPanel = forwardRef<HTMLDivElement, CVPreviewPanelProps>(({ cv }, ref) => {
  const templateStyles = {
    harvard: 'bg-white text-gray-900',
    modern: 'bg-gradient-to-br from-blue-50 to-white text-gray-900',
    minimal: 'bg-white text-gray-900',
    creative: 'bg-gradient-to-br from-purple-50 to-white text-gray-900',
  };

  return (
    <Card ref={ref} className={`p-8 shadow-xl ${templateStyles[cv.template]} min-h-[297mm]`}>
      {/* Header */}
      <div className="border-b-2 border-gray-800 pb-4 mb-6">
        <h1 className="text-3xl font-bold mb-1">{cv.personal.fullName || 'Tu Nombre'}</h1>
        {cv.personal.title && (
          <h2 className="text-xl text-gray-600 mb-3">{cv.personal.title}</h2>
        )}
        
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-700">
          {cv.personal.email && (
            <div className="flex items-center gap-1">
              <Mail className="h-3 w-3" />
              {cv.personal.email}
            </div>
          )}
          {cv.personal.phone && (
            <div className="flex items-center gap-1">
              <Phone className="h-3 w-3" />
              {cv.personal.phone}
            </div>
          )}
          {cv.personal.location && (
            <div className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {cv.personal.location}
            </div>
          )}
        </div>
        
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-700 mt-1">
          {cv.personal.linkedin && (
            <div className="flex items-center gap-1">
              <Linkedin className="h-3 w-3" />
              {cv.personal.linkedin}
            </div>
          )}
          {cv.personal.github && (
            <div className="flex items-center gap-1">
              <Github className="h-3 w-3" />
              {cv.personal.github}
            </div>
          )}
          {cv.personal.website && (
            <div className="flex items-center gap-1">
              <Globe className="h-3 w-3" />
              {cv.personal.website}
            </div>
          )}
        </div>
      </div>

      {/* Summary */}
      {cv.summary && (
        <div className="mb-6">
          <h3 className="text-lg font-bold mb-2 text-gray-800">RESUMEN PROFESIONAL</h3>
          <p className="text-sm text-gray-700 leading-relaxed">{cv.summary}</p>
        </div>
      )}

      {/* Education */}
      {cv.education.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-bold mb-3 text-gray-800">FORMACIÓN ACADÉMICA</h3>
          {cv.education.map((edu) => (
            <div key={edu.id} className="mb-3">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-semibold text-gray-900">{edu.degree} en {edu.field}</h4>
                  <p className="text-sm text-gray-700">{edu.institution}</p>
                </div>
                <div className="text-sm text-gray-600 text-right">
                  {edu.startDate && new Date(edu.startDate).getFullYear()}
                  {edu.endDate && ` - ${new Date(edu.endDate).getFullYear()}`}
                </div>
              </div>
              {edu.gpa && <p className="text-sm text-gray-600">GPA: {edu.gpa}</p>}
              {edu.description && (
                <p className="text-sm text-gray-700 mt-1">{edu.description}</p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Experience */}
      {cv.experience.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-bold mb-3 text-gray-800">EXPERIENCIA LABORAL</h3>
          {cv.experience.map((exp) => (
            <div key={exp.id} className="mb-4">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-semibold text-gray-900">{exp.role}</h4>
                  <p className="text-sm text-gray-700">{exp.company}</p>
                  {exp.location && <p className="text-xs text-gray-600">{exp.location}</p>}
                </div>
                <div className="text-sm text-gray-600 text-right">
                  {exp.startDate && new Date(exp.startDate).getFullYear()}
                  {exp.current ? ' - Presente' : exp.endDate ? ` - ${new Date(exp.endDate).getFullYear()}` : ''}
                </div>
              </div>
              {exp.bullets.length > 0 && (
                <ul className="list-disc list-inside mt-2 space-y-1">
                  {exp.bullets.map((bullet, idx) => (
                    <li key={idx} className="text-sm text-gray-700">
                      {bullet.text}
                      {bullet.metric && (
                        <span className="font-semibold text-gray-900"> ({bullet.metric})</span>
                      )}
                    </li>
                  ))}
                </ul>
              )}
              {exp.technologies && exp.technologies.length > 0 && (
                <div className="flex gap-1 mt-2 flex-wrap">
                  {exp.technologies.map((tech, idx) => (
                    <Badge key={idx} variant="secondary" className="text-xs">
                      {tech}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Projects */}
      {cv.projects.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-bold mb-3 text-gray-800">PROYECTOS DESTACADOS</h3>
          {cv.projects.map((proj) => (
            <div key={proj.id} className="mb-3">
              <h4 className="font-semibold text-gray-900">{proj.title}</h4>
              {proj.role && <p className="text-sm text-gray-600">{proj.role}</p>}
              <p className="text-sm text-gray-700 mt-1">{proj.description}</p>
              {proj.technologies.length > 0 && (
                <div className="flex gap-1 mt-1 flex-wrap">
                  {proj.technologies.map((tech, idx) => (
                    <Badge key={idx} variant="outline" className="text-xs">
                      {tech}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Skills */}
      {cv.skills.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-bold mb-3 text-gray-800">HABILIDADES</h3>
          <div className="grid grid-cols-2 gap-2">
            {cv.skills.map((skill, idx) => (
              <div key={idx} className="flex justify-between text-sm">
                <span className="text-gray-700">{skill.name}</span>
                <span className="text-gray-600 capitalize">{skill.level}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Languages */}
      {cv.languages.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-bold mb-3 text-gray-800">IDIOMAS</h3>
          <div className="flex gap-4 flex-wrap">
            {cv.languages.map((lang, idx) => (
              <div key={idx} className="text-sm text-gray-700">
                <span className="font-medium">{lang.name}</span> - {lang.level}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Certifications */}
      {cv.certifications.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-bold mb-3 text-gray-800">CERTIFICACIONES</h3>
          {cv.certifications.map((cert) => (
            <div key={cert.id} className="mb-2">
              <h4 className="font-semibold text-sm text-gray-900">{cert.name}</h4>
              <p className="text-sm text-gray-700">
                {cert.institution} • {new Date(cert.date).getFullYear()}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Score Badge */}
      <div className="mt-8 pt-4 border-t border-gray-300">
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500">CV Score</span>
          <Badge variant={cv.score.overall >= 75 ? 'default' : 'secondary'}>
            {cv.score.overall}%
          </Badge>
        </div>
      </div>
    </Card>
  );
});

CVPreviewPanel.displayName = 'CVPreviewPanel';

export default CVPreviewPanel;
