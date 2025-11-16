import { forwardRef } from 'react';
import { CVData } from '@/types';
import { Mail, Phone, MapPin, Linkedin, Github, Globe } from 'lucide-react';

interface CVPreviewPanelProps {
  cv: CVData;
}

const CVPreviewPanel = forwardRef<HTMLDivElement, CVPreviewPanelProps>(({ cv }, ref) => {
  const lang = cv.language || 'es';
  
  const translations = {
    es: {
      education: 'EDUCACIÓN',
      experience: 'EXPERIENCIA',
      leadership: 'LIDERAZGO Y ACTIVIDADES',
      skills: 'HABILIDADES E INTERESES',
      technicalSkills: 'Habilidades Técnicas',
      languages: 'Idiomas',
      certifications: 'CERTIFICACIONES Y PREMIOS',
      technologies: 'Tecnologías'
    },
    en: {
      education: 'EDUCATION',
      experience: 'EXPERIENCE',
      leadership: 'LEADERSHIP & ACTIVITIES',
      skills: 'SKILLS & INTERESTS',
      technicalSkills: 'Technical Skills',
      languages: 'Languages',
      certifications: 'CERTIFICATIONS & AWARDS',
      technologies: 'Technologies'
    }
  };

  const t = translations[lang];

  return (
    <div 
      ref={ref} 
      className="harvard-cv harvard-cv-page"
    >
      {/* Header: Name centered, contact below */}
      <div className="text-center mb-6">
        <h1 className="mb-2">
          {cv.personal.fullName || 'YOUR NAME'}
        </h1>
        
        {/* Contact Information: Single line, centered, no icons */}
        <div className="flex flex-wrap justify-center gap-x-2 text-[10pt] leading-tight">
          {cv.personal.email && <span>{cv.personal.email}</span>}
          {cv.personal.email && cv.personal.phone && <span>•</span>}
          {cv.personal.phone && <span>{cv.personal.phone}</span>}
          {cv.personal.phone && cv.personal.location && <span>•</span>}
          {cv.personal.location && <span>{cv.personal.location}</span>}
          {cv.personal.location && cv.personal.linkedin && <span>•</span>}
          {cv.personal.linkedin && <span>{cv.personal.linkedin}</span>}
          {cv.personal.linkedin && cv.personal.github && <span>•</span>}
          {cv.personal.github && <span>{cv.personal.github}</span>}
          {cv.personal.github && cv.personal.website && <span>•</span>}
          {cv.personal.website && <span>{cv.personal.website}</span>}
        </div>
      </div>

      {/* Education comes FIRST after header */}
      {cv.education.length > 0 && (
        <div className="mb-5">
          <h2 className="mb-3">{t.education}</h2>
          {cv.education.map((edu, index) => (
            <div key={edu.id} className={`section-item ${index > 0 ? 'mt-3' : ''}`}>
              {/* Format: Institution name bold on left, dates on right */}
              <div className="flex justify-between items-baseline mb-0.5">
                <h3>{edu.institution}</h3>
                <span className="text-[10pt]">
                  {edu.endDate ? new Date(edu.endDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'Expected ' + (edu.startDate ? new Date(edu.startDate).getFullYear() : '')}
                </span>
              </div>
              {/* Degree in italics */}
              <p className="italic mb-0">
                {edu.degree}{edu.field ? ` in ${edu.field}` : ''}
                {edu.gpa && parseFloat(edu.gpa) >= 3.5 && `, GPA: ${edu.gpa}`}
              </p>
              {edu.description && (
                <p className="mt-1 text-[10pt]">{edu.description}</p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Experience with strong action verbs */}
      {cv.experience.length > 0 && (
        <div className="mb-5">
          <h2 className="mb-3">{t.experience}</h2>
          {cv.experience.map((exp, index) => (
            <div key={exp.id} className={`section-item ${index > 0 ? 'mt-3' : ''}`}>
              <div className="flex justify-between items-baseline mb-1">
                <h3>{exp.company}</h3>
                <span className="text-[10pt]">
                  {exp.startDate && new Date(exp.startDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                  {exp.current ? ' – Present' : exp.endDate ? ` – ${new Date(exp.endDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}` : ''}
                </span>
              </div>
              <p className="italic mb-2">{exp.role}</p>
              {exp.bullets.length > 0 && (
                <ul className="list-none pl-0 space-y-1">
                  {exp.bullets.map((bullet, idx) => (
                    <li key={idx} className="text-[10.5pt] leading-relaxed">
                      <span className="inline-block mr-2">•</span>
                      {bullet.text}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Leadership & Activities */}
      {cv.projects.length > 0 && (
        <div className="mb-5">
          <h2 className="mb-3">{t.leadership}</h2>
          {cv.projects.map((project, index) => (
            <div key={project.id} className={`section-item ${index > 0 ? 'mt-3' : ''}`}>
              <h3 className="mb-1">{project.title}</h3>
              {project.role && <p className="italic mb-1">{project.role}</p>}
              {project.description && (
                <p className="text-[10.5pt] leading-relaxed">{project.description}</p>
              )}
              {project.technologies && project.technologies.length > 0 && (
                <p className="text-[10pt] mt-1 text-secondary">
                  <span className="italic">{t.technologies}:</span> {project.technologies.join(', ')}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Skills & Interests combined section */}
      {(cv.skills.length > 0 || cv.languages.length > 0) && (
        <div className="mb-5">
          <h2 className="mb-3">{t.skills}</h2>
          {cv.skills.length > 0 && (
            <div className="mb-2">
              <span className="font-semibold">{t.technicalSkills}: </span>
              <span className="text-[10.5pt]">
                {cv.skills.map(skill => skill.name).join(', ')}
              </span>
            </div>
          )}
          {cv.languages.length > 0 && (
            <div className="mb-2">
              <span className="font-semibold">{t.languages}: </span>
              <span className="text-[10.5pt]">
                {cv.languages.map(lang => `${lang.name} (${lang.level})`).join(', ')}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Certifications - Optional section */}
      {cv.certifications.length > 0 && (
        <div className="mb-5">
          <h2 className="mb-3">{t.certifications}</h2>
          <ul className="list-none pl-0 space-y-1">
            {cv.certifications.map((cert) => (
              <li key={cert.id} className="text-[10.5pt] leading-relaxed">
                <span className="inline-block mr-2">•</span>
                <span className="font-semibold">{cert.name}</span>
                {cert.institution && `, ${cert.institution}`}
                {cert.date && ` (${new Date(cert.date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })})`}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
});

CVPreviewPanel.displayName = 'CVPreviewPanel';

export default CVPreviewPanel;
