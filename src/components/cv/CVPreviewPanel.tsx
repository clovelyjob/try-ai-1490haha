import { forwardRef } from 'react';
import { CVData } from '@/types';
import { Mail, Phone, MapPin, Linkedin, Github, Globe } from 'lucide-react';

interface CVPreviewPanelProps {
  cv: CVData;
}

const CVPreviewPanel = forwardRef<HTMLDivElement, CVPreviewPanelProps>(({ cv }, ref) => {
  return (
    <div 
      ref={ref} 
      className="harvard-cv harvard-cv-page"
    >
      {/* Header - Name centered, contact info below */}
      <div className="text-center mb-6">
        <h1 className="mb-3">
          {cv.personal.fullName || 'YOUR NAME'}
        </h1>
        
        {/* Contact Information - Single line, centered */}
        <div className="flex flex-wrap justify-center gap-x-3 gap-y-1 text-[10pt]">
          {cv.personal.email && (
            <span className="flex items-center gap-1">
              <Mail className="h-3 w-3 inline" />
              {cv.personal.email}
            </span>
          )}
          {cv.personal.phone && (
            <span className="flex items-center gap-1">
              <Phone className="h-3 w-3 inline" />
              {cv.personal.phone}
            </span>
          )}
          {cv.personal.location && (
            <span className="flex items-center gap-1">
              <MapPin className="h-3 w-3 inline" />
              {cv.personal.location}
            </span>
          )}
          {cv.personal.linkedin && (
            <span className="flex items-center gap-1">
              <Linkedin className="h-3 w-3 inline" />
              {cv.personal.linkedin}
            </span>
          )}
          {cv.personal.github && (
            <span className="flex items-center gap-1">
              <Github className="h-3 w-3 inline" />
              {cv.personal.github}
            </span>
          )}
          {cv.personal.website && (
            <span className="flex items-center gap-1">
              <Globe className="h-3 w-3 inline" />
              {cv.personal.website}
            </span>
          )}
        </div>
      </div>

      {/* Education - Harvard style: comes FIRST */}
      {cv.education.length > 0 && (
        <div className="mb-5">
          <h2 className="mb-3">EDUCATION</h2>
          {cv.education.map((edu, index) => (
            <div key={edu.id} className={`section-item ${index > 0 ? 'mt-3' : ''}`}>
              <div className="flex justify-between items-baseline mb-1">
                <h3>{edu.institution}</h3>
                <span className="text-[10pt]">
                  {edu.startDate && new Date(edu.startDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                  {edu.endDate && ` – ${new Date(edu.endDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`}
                </span>
              </div>
              <p className="italic mb-0">
                {edu.degree} in {edu.field}
                {edu.gpa && `, GPA: ${edu.gpa}`}
              </p>
              {edu.description && (
                <p className="mt-1 text-[10pt]">{edu.description}</p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Experience - Harvard style with strong action verbs */}
      {cv.experience.length > 0 && (
        <div className="mb-5">
          <h2 className="mb-3">EXPERIENCE</h2>
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
          <h2 className="mb-3">LEADERSHIP & ACTIVITIES</h2>
          {cv.projects.map((project, index) => (
            <div key={project.id} className={`section-item ${index > 0 ? 'mt-3' : ''}`}>
              <h3 className="mb-1">{project.title}</h3>
              {project.role && <p className="italic mb-1">{project.role}</p>}
              {project.description && (
                <p className="text-[10.5pt] leading-relaxed">{project.description}</p>
              )}
              {project.technologies && project.technologies.length > 0 && (
                <p className="text-[10pt] mt-1 text-secondary">
                  <span className="italic">Technologies:</span> {project.technologies.join(', ')}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Skills & Interests - Harvard style: combined section */}
      {(cv.skills.length > 0 || cv.languages.length > 0) && (
        <div className="mb-5">
          <h2 className="mb-3">SKILLS & INTERESTS</h2>
          {cv.skills.length > 0 && (
            <div className="mb-2">
              <span className="font-semibold">Technical Skills: </span>
              <span className="text-[10.5pt]">
                {cv.skills.map(skill => skill.name).join(', ')}
              </span>
            </div>
          )}
          {cv.languages.length > 0 && (
            <div className="mb-2">
              <span className="font-semibold">Languages: </span>
              <span className="text-[10.5pt]">
                {cv.languages.map(lang => `${lang.name} (${lang.level})`).join(', ')}
              </span>
            </div>
          )}
          {cv.summary && (
            <div>
              <span className="font-semibold">Interests: </span>
              <span className="text-[10.5pt]">{cv.summary}</span>
            </div>
          )}
        </div>
      )}

      {/* Certifications - Optional section */}
      {cv.certifications.length > 0 && (
        <div className="mb-5">
          <h2 className="mb-3">CERTIFICATIONS & AWARDS</h2>
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
