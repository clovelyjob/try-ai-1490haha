import { forwardRef } from 'react';
import { CVData } from '@/types';
import { Mail, Phone, MapPin, Linkedin, Github, Globe } from 'lucide-react';

interface CVPreviewPanelProps {
  cv: CVData;
}

const CVPreviewPanel = forwardRef<HTMLDivElement, CVPreviewPanelProps>(({ cv }, ref) => {
  const lang = cv.language || 'es';
  const template = cv.template || 'harvard';
  
  const translations = {
    es: {
      education: 'EDUCACIÓN',
      experience: 'EXPERIENCIA',
      leadership: 'LIDERAZGO Y ACTIVIDADES',
      skills: 'HABILIDADES E INTERESES',
      technicalSkills: 'Habilidades Técnicas',
      languages: 'Idiomas',
      certifications: 'CERTIFICACIONES Y PREMIOS',
      technologies: 'Tecnologías',
      contact: 'CONTACTO',
      projects: 'PROYECTOS',
      summary: 'PERFIL PROFESIONAL'
    },
    en: {
      education: 'EDUCATION',
      experience: 'EXPERIENCE',
      leadership: 'LEADERSHIP & ACTIVITIES',
      skills: 'SKILLS & INTERESTS',
      technicalSkills: 'Technical Skills',
      languages: 'Languages',
      certifications: 'CERTIFICATIONS & AWARDS',
      technologies: 'Technologies',
      contact: 'CONTACT',
      projects: 'PROJECTS',
      summary: 'PROFESSIONAL SUMMARY'
    }
  };

  const t = translations[lang];

  // Harvard Template (Default)
  if (template === 'harvard') {
    return (
      <div ref={ref} className="harvard-cv harvard-cv-page">
        <div className="text-center mb-6">
          <h1 className="mb-2">{cv.personal.fullName || 'YOUR NAME'}</h1>
          <div className="flex flex-wrap justify-center gap-x-2 text-[10pt] leading-tight">
            {cv.personal.email && <span>{cv.personal.email}</span>}
            {cv.personal.email && cv.personal.phone && <span>•</span>}
            {cv.personal.phone && <span>{cv.personal.phone}</span>}
            {cv.personal.phone && cv.personal.location && <span>•</span>}
            {cv.personal.location && <span>{cv.personal.location}</span>}
            {cv.personal.location && cv.personal.linkedin && <span>•</span>}
            {cv.personal.linkedin && <span>{cv.personal.linkedin}</span>}
          </div>
        </div>

        {cv.education.length > 0 && (
          <div className="mb-5">
            <h2 className="mb-3">{t.education}</h2>
            {cv.education.map((edu, index) => (
              <div key={edu.id} className={`section-item ${index > 0 ? 'mt-3' : ''}`}>
                <div className="flex justify-between items-baseline mb-0.5">
                  <h3>{edu.institution}</h3>
                  <span className="text-[10pt]">
                    {edu.endDate ? new Date(edu.endDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'Expected ' + (edu.startDate ? new Date(edu.startDate).getFullYear() : '')}
                  </span>
                </div>
                <p className="italic mb-0">
                  {edu.degree}{edu.field ? ` in ${edu.field}` : ''}
                  {edu.gpa && parseFloat(edu.gpa) >= 3.5 && `, GPA: ${edu.gpa}`}
                </p>
                {edu.description && <p className="mt-1 text-[10pt]">{edu.description}</p>}
              </div>
            ))}
          </div>
        )}

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

        {cv.projects.length > 0 && (
          <div className="mb-5">
            <h2 className="mb-3">{t.leadership}</h2>
            {cv.projects.map((project, index) => (
              <div key={project.id} className={`section-item ${index > 0 ? 'mt-3' : ''}`}>
                <h3 className="mb-1">{project.title}</h3>
                {project.role && <p className="italic mb-1">{project.role}</p>}
                {project.description && <p className="text-[10.5pt] leading-relaxed">{project.description}</p>}
                {project.technologies?.length > 0 && (
                  <p className="text-[10pt] mt-1 text-secondary">
                    <span className="italic">{t.technologies}:</span> {project.technologies.join(', ')}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}

        {(cv.skills.length > 0 || cv.languages.length > 0) && (
          <div className="mb-5">
            <h2 className="mb-3">{t.skills}</h2>
            {cv.skills.length > 0 && (
              <div className="mb-2">
                <span className="font-semibold">{t.technicalSkills}: </span>
                <span className="text-[10.5pt]">{cv.skills.map(skill => skill.name).join(', ')}</span>
              </div>
            )}
            {cv.languages.length > 0 && (
              <div className="mb-2">
                <span className="font-semibold">{t.languages}: </span>
                <span className="text-[10.5pt]">{cv.languages.map(lang => `${lang.name} (${lang.level})`).join(', ')}</span>
              </div>
            )}
          </div>
        )}

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
  }

  // Executive Template
  if (template === 'executive') {
    return (
      <div ref={ref} className="cv-executive" style={{ fontFamily: "'Montserrat', sans-serif", color: '#000', padding: '0', fontSize: '10pt', lineHeight: '1.4' }}>
        {/* Header with blue accent */}
        <div style={{ position: 'relative', paddingBottom: '18px', marginBottom: '20px' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: '#0069a5', opacity: 0.15 }} />
          <div style={{ position: 'relative', display: 'flex', justifyContent: 'space-between', padding: '20px' }}>
            <div style={{ width: '60%' }}>
              <h1 style={{ fontSize: '24pt', fontWeight: 700, letterSpacing: '0.91px', textTransform: 'uppercase', margin: 0 }}>
                {cv.personal.fullName || 'YOUR NAME'}
              </h1>
              {cv.personal.title && (
                <p style={{ fontSize: '11pt', marginTop: '4px', opacity: 0.8 }}>{cv.personal.title}</p>
              )}
            </div>
            <div style={{ width: '35%', textAlign: 'right' }}>
              {cv.personal.email && <p style={{ margin: '2px 0' }}>{cv.personal.email}</p>}
              {cv.personal.phone && <p style={{ margin: '2px 0' }}>{cv.personal.phone}</p>}
              {cv.personal.location && <p style={{ margin: '2px 0' }}>{cv.personal.location}</p>}
            </div>
          </div>
        </div>

        {/* Contact bar */}
        <div style={{ background: '#404040', color: '#fff', padding: '12px 20px', marginBottom: '25px' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
            {cv.personal.linkedin && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Linkedin size={14} />
                <span>{cv.personal.linkedin}</span>
              </div>
            )}
            {cv.personal.github && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Github size={14} />
                <span>{cv.personal.github}</span>
              </div>
            )}
            {cv.personal.website && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Globe size={14} />
                <span>{cv.personal.website}</span>
              </div>
            )}
          </div>
        </div>

        <div style={{ padding: '0 20px' }}>
          {/* Summary */}
          {cv.summary && (
            <div style={{ marginBottom: '20px' }}>
              <h2 style={{ fontSize: '11pt', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', borderBottom: '2px solid #0069a5', paddingBottom: '4px', marginBottom: '10px' }}>
                {t.summary}
              </h2>
              <p style={{ textAlign: 'justify' }}>{cv.summary}</p>
            </div>
          )}

          {/* Experience */}
          {cv.experience.length > 0 && (
            <div style={{ marginBottom: '20px' }}>
              <h2 style={{ fontSize: '11pt', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', borderBottom: '2px solid #0069a5', paddingBottom: '4px', marginBottom: '10px' }}>
                {t.experience}
              </h2>
              {cv.experience.map((exp) => (
                <div key={exp.id} style={{ marginBottom: '15px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <h3 style={{ fontWeight: 700, fontSize: '10.5pt' }}>{exp.company}</h3>
                    <span style={{ opacity: 0.6, fontSize: '9pt' }}>
                      {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                    </span>
                  </div>
                  <p style={{ fontStyle: 'italic', marginBottom: '6px' }}>{exp.role}</p>
                  {exp.bullets.length > 0 && (
                    <ul style={{ margin: '4px 0 0 18px', padding: 0 }}>
                      {exp.bullets.map((b, i) => (
                        <li key={i} style={{ marginBottom: '3px' }}>{b.text}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Education */}
          {cv.education.length > 0 && (
            <div style={{ marginBottom: '20px' }}>
              <h2 style={{ fontSize: '11pt', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', borderBottom: '2px solid #0069a5', paddingBottom: '4px', marginBottom: '10px' }}>
                {t.education}
              </h2>
              {cv.education.map((edu) => (
                <div key={edu.id} style={{ marginBottom: '10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <h3 style={{ fontWeight: 700, fontSize: '10.5pt' }}>{edu.institution}</h3>
                    <span style={{ opacity: 0.6, fontSize: '9pt' }}>{edu.endDate || edu.startDate}</span>
                  </div>
                  <p style={{ fontStyle: 'italic' }}>{edu.degree}{edu.field ? ` - ${edu.field}` : ''}</p>
                </div>
              ))}
            </div>
          )}

          {/* Skills with bars */}
          {cv.skills.length > 0 && (
            <div style={{ marginBottom: '20px' }}>
              <h2 style={{ fontSize: '11pt', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', borderBottom: '2px solid #0069a5', paddingBottom: '4px', marginBottom: '10px' }}>
                {t.skills}
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                {cv.skills.map((skill, i) => (
                  <div key={i}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                      <span style={{ fontWeight: 500 }}>{skill.name}</span>
                      <span style={{ opacity: 0.6, fontSize: '9pt' }}>{skill.level}</span>
                    </div>
                    <div style={{ background: '#d5d6d6', height: '4px', width: '100%' }}>
                      <div style={{ 
                        background: '#0069a5', 
                        height: '100%', 
                        width: skill.level === 'avanzado' ? '100%' : skill.level === 'intermedio' ? '66%' : '33%' 
                      }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Languages */}
          {cv.languages.length > 0 && (
            <div style={{ marginBottom: '20px' }}>
              <h2 style={{ fontSize: '11pt', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', borderBottom: '2px solid #0069a5', paddingBottom: '4px', marginBottom: '10px' }}>
                {t.languages}
              </h2>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px' }}>
                {cv.languages.map((lang, i) => (
                  <div key={i} style={{ minWidth: '120px' }}>
                    <span style={{ fontWeight: 500 }}>{lang.name}</span>
                    <span style={{ opacity: 0.6, marginLeft: '6px' }}>({lang.level})</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Tech Template
  if (template === 'tech') {
    return (
      <div ref={ref} className="cv-tech" style={{ fontFamily: "'JetBrains Mono', 'Fira Code', monospace", color: '#1a1a2e', padding: '24px', fontSize: '9.5pt', lineHeight: '1.5', background: '#fafafa' }}>
        {/* Header with gradient accent */}
        <div style={{ borderLeft: '4px solid', borderImage: 'linear-gradient(180deg, #667eea 0%, #764ba2 100%) 1', paddingLeft: '16px', marginBottom: '24px' }}>
          <h1 style={{ fontSize: '22pt', fontWeight: 700, margin: 0, letterSpacing: '-0.5px' }}>
            {cv.personal.fullName || 'YOUR NAME'}
          </h1>
          {cv.personal.title && (
            <p style={{ fontSize: '12pt', color: '#667eea', margin: '4px 0 0 0', fontWeight: 500 }}>{cv.personal.title}</p>
          )}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginTop: '12px', fontSize: '9pt', color: '#666' }}>
            {cv.personal.email && <span>📧 {cv.personal.email}</span>}
            {cv.personal.phone && <span>📱 {cv.personal.phone}</span>}
            {cv.personal.location && <span>📍 {cv.personal.location}</span>}
            {cv.personal.github && <span>⚡ {cv.personal.github}</span>}
            {cv.personal.linkedin && <span>💼 {cv.personal.linkedin}</span>}
          </div>
        </div>

        {/* Summary as code comment */}
        {cv.summary && (
          <div style={{ background: '#f0f0f0', padding: '12px', borderRadius: '4px', marginBottom: '20px', fontFamily: 'inherit' }}>
            <span style={{ color: '#6a737d' }}>/* {cv.summary} */</span>
          </div>
        )}

        {/* Skills as tags */}
        {cv.skills.length > 0 && (
          <div style={{ marginBottom: '20px' }}>
            <h2 style={{ fontSize: '10pt', fontWeight: 700, color: '#667eea', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '1px' }}>
              {'<'}{t.technicalSkills}{' />'}
            </h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {cv.skills.map((skill, i) => (
                <span key={i} style={{ 
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
                  color: '#fff', 
                  padding: '4px 10px', 
                  borderRadius: '12px', 
                  fontSize: '9pt',
                  fontWeight: 500
                }}>
                  {skill.name}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Experience */}
        {cv.experience.length > 0 && (
          <div style={{ marginBottom: '20px' }}>
            <h2 style={{ fontSize: '10pt', fontWeight: 700, color: '#667eea', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '1px' }}>
              {'<'}{t.experience}{' />'}
            </h2>
            {cv.experience.map((exp) => (
              <div key={exp.id} style={{ marginBottom: '16px', paddingLeft: '12px', borderLeft: '2px solid #e1e4e8' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <h3 style={{ fontWeight: 700, fontSize: '10pt', margin: 0 }}>{exp.role}</h3>
                  <code style={{ fontSize: '8pt', color: '#6a737d', background: '#f6f8fa', padding: '2px 6px', borderRadius: '3px' }}>
                    {exp.startDate} → {exp.current ? 'now' : exp.endDate}
                  </code>
                </div>
                <p style={{ color: '#667eea', margin: '2px 0 8px 0', fontWeight: 500 }}>@ {exp.company}</p>
                {exp.bullets.length > 0 && (
                  <ul style={{ margin: 0, paddingLeft: '16px' }}>
                    {exp.bullets.map((b, i) => (
                      <li key={i} style={{ marginBottom: '4px', color: '#444' }}>{b.text}</li>
                    ))}
                  </ul>
                )}
                {exp.technologies && exp.technologies.length > 0 && (
                  <div style={{ marginTop: '8px', display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                    {exp.technologies.map((tech, i) => (
                      <code key={i} style={{ fontSize: '8pt', color: '#764ba2', background: '#f3f0ff', padding: '2px 6px', borderRadius: '3px' }}>
                        {tech}
                      </code>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Education */}
        {cv.education.length > 0 && (
          <div style={{ marginBottom: '20px' }}>
            <h2 style={{ fontSize: '10pt', fontWeight: 700, color: '#667eea', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '1px' }}>
              {'<'}{t.education}{' />'}
            </h2>
            {cv.education.map((edu) => (
              <div key={edu.id} style={{ marginBottom: '10px', paddingLeft: '12px', borderLeft: '2px solid #e1e4e8' }}>
                <h3 style={{ fontWeight: 700, fontSize: '10pt', margin: 0 }}>{edu.degree}</h3>
                <p style={{ color: '#667eea', margin: '2px 0' }}>{edu.institution}</p>
                <code style={{ fontSize: '8pt', color: '#6a737d' }}>{edu.endDate || edu.startDate}</code>
              </div>
            ))}
          </div>
        )}

        {/* Projects */}
        {cv.projects.length > 0 && (
          <div style={{ marginBottom: '20px' }}>
            <h2 style={{ fontSize: '10pt', fontWeight: 700, color: '#667eea', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '1px' }}>
              {'<'}{t.projects}{' />'}
            </h2>
            {cv.projects.map((project) => (
              <div key={project.id} style={{ marginBottom: '12px', paddingLeft: '12px', borderLeft: '2px solid #e1e4e8' }}>
                <h3 style={{ fontWeight: 700, fontSize: '10pt', margin: 0 }}>{project.title}</h3>
                <p style={{ color: '#444', margin: '4px 0', fontSize: '9pt' }}>{project.description}</p>
                {project.technologies?.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '6px' }}>
                    {project.technologies.map((tech, i) => (
                      <code key={i} style={{ fontSize: '8pt', color: '#764ba2', background: '#f3f0ff', padding: '2px 6px', borderRadius: '3px' }}>
                        {tech}
                      </code>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Elegant Template
  if (template === 'elegant') {
    return (
      <div ref={ref} className="cv-elegant" style={{ fontFamily: "'Playfair Display', Georgia, serif", color: '#2c2c2c', padding: '32px', fontSize: '10pt', lineHeight: '1.6' }}>
        {/* Elegant header with decorative line */}
        <div style={{ textAlign: 'center', marginBottom: '28px', paddingBottom: '20px', borderBottom: '1px solid #c9a962' }}>
          <h1 style={{ fontSize: '28pt', fontWeight: 400, margin: 0, letterSpacing: '3px', textTransform: 'uppercase' }}>
            {cv.personal.fullName || 'YOUR NAME'}
          </h1>
          {cv.personal.title && (
            <p style={{ fontSize: '11pt', color: '#666', margin: '8px 0 0 0', fontStyle: 'italic', letterSpacing: '1px' }}>{cv.personal.title}</p>
          )}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '14px', fontSize: '9pt', color: '#666', fontFamily: "'Source Sans Pro', sans-serif" }}>
            {cv.personal.email && <span>{cv.personal.email}</span>}
            {cv.personal.phone && <span>|</span>}
            {cv.personal.phone && <span>{cv.personal.phone}</span>}
            {cv.personal.location && <span>|</span>}
            {cv.personal.location && <span>{cv.personal.location}</span>}
          </div>
        </div>

        {/* Summary */}
        {cv.summary && (
          <div style={{ marginBottom: '24px', textAlign: 'center', padding: '0 40px' }}>
            <p style={{ fontStyle: 'italic', color: '#555', lineHeight: '1.8' }}>{cv.summary}</p>
          </div>
        )}

        {/* Experience */}
        {cv.experience.length > 0 && (
          <div style={{ marginBottom: '24px' }}>
            <h2 style={{ 
              fontSize: '12pt', 
              fontWeight: 400, 
              textTransform: 'uppercase', 
              letterSpacing: '2px', 
              textAlign: 'center',
              margin: '0 0 16px 0',
              color: '#c9a962'
            }}>
              {t.experience}
            </h2>
            {cv.experience.map((exp) => (
              <div key={exp.id} style={{ marginBottom: '18px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <h3 style={{ fontWeight: 600, fontSize: '11pt', margin: 0 }}>{exp.company}</h3>
                  <span style={{ color: '#888', fontSize: '9pt', fontFamily: "'Source Sans Pro', sans-serif" }}>
                    {exp.startDate} — {exp.current ? 'Present' : exp.endDate}
                  </span>
                </div>
                <p style={{ fontStyle: 'italic', margin: '2px 0 8px 0', color: '#555' }}>{exp.role}</p>
                {exp.bullets.length > 0 && (
                  <ul style={{ margin: 0, paddingLeft: '20px', fontFamily: "'Source Sans Pro', sans-serif" }}>
                    {exp.bullets.map((b, i) => (
                      <li key={i} style={{ marginBottom: '4px', color: '#444' }}>{b.text}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Education */}
        {cv.education.length > 0 && (
          <div style={{ marginBottom: '24px' }}>
            <h2 style={{ 
              fontSize: '12pt', 
              fontWeight: 400, 
              textTransform: 'uppercase', 
              letterSpacing: '2px', 
              textAlign: 'center',
              margin: '0 0 16px 0',
              color: '#c9a962'
            }}>
              {t.education}
            </h2>
            {cv.education.map((edu) => (
              <div key={edu.id} style={{ marginBottom: '12px', textAlign: 'center' }}>
                <h3 style={{ fontWeight: 600, fontSize: '11pt', margin: 0 }}>{edu.institution}</h3>
                <p style={{ fontStyle: 'italic', margin: '2px 0', color: '#555' }}>
                  {edu.degree}{edu.field ? ` in ${edu.field}` : ''}
                </p>
                <span style={{ color: '#888', fontSize: '9pt', fontFamily: "'Source Sans Pro', sans-serif" }}>
                  {edu.endDate || edu.startDate}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Skills */}
        {cv.skills.length > 0 && (
          <div style={{ marginBottom: '24px' }}>
            <h2 style={{ 
              fontSize: '12pt', 
              fontWeight: 400, 
              textTransform: 'uppercase', 
              letterSpacing: '2px', 
              textAlign: 'center',
              margin: '0 0 16px 0',
              color: '#c9a962'
            }}>
              {t.technicalSkills}
            </h2>
            <p style={{ textAlign: 'center', fontFamily: "'Source Sans Pro', sans-serif" }}>
              {cv.skills.map(s => s.name).join('  •  ')}
            </p>
          </div>
        )}

        {/* Languages */}
        {cv.languages.length > 0 && (
          <div style={{ marginBottom: '24px' }}>
            <h2 style={{ 
              fontSize: '12pt', 
              fontWeight: 400, 
              textTransform: 'uppercase', 
              letterSpacing: '2px', 
              textAlign: 'center',
              margin: '0 0 16px 0',
              color: '#c9a962'
            }}>
              {t.languages}
            </h2>
            <p style={{ textAlign: 'center', fontFamily: "'Source Sans Pro', sans-serif" }}>
              {cv.languages.map(l => `${l.name} (${l.level})`).join('  •  ')}
            </p>
          </div>
        )}
      </div>
    );
  }

  // Modern Template
  if (template === 'modern') {
    return (
      <div ref={ref} className="cv-modern" style={{ fontFamily: "'Inter', sans-serif", color: '#1f2937', padding: '28px', fontSize: '10pt', lineHeight: '1.5' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '24px' }}>
          {/* Left sidebar */}
          <div style={{ background: '#f3f4f6', padding: '20px', borderRadius: '8px' }}>
            <h1 style={{ fontSize: '18pt', fontWeight: 700, margin: '0 0 4px 0' }}>
              {cv.personal.fullName || 'YOUR NAME'}
            </h1>
            {cv.personal.title && (
              <p style={{ color: '#6366f1', fontWeight: 500, margin: '0 0 16px 0' }}>{cv.personal.title}</p>
            )}

            <div style={{ marginBottom: '20px' }}>
              <h3 style={{ fontSize: '9pt', fontWeight: 700, textTransform: 'uppercase', color: '#6366f1', marginBottom: '8px' }}>{t.contact}</h3>
              <div style={{ fontSize: '9pt', color: '#4b5563' }}>
                {cv.personal.email && <p style={{ margin: '4px 0' }}>{cv.personal.email}</p>}
                {cv.personal.phone && <p style={{ margin: '4px 0' }}>{cv.personal.phone}</p>}
                {cv.personal.location && <p style={{ margin: '4px 0' }}>{cv.personal.location}</p>}
                {cv.personal.linkedin && <p style={{ margin: '4px 0' }}>{cv.personal.linkedin}</p>}
              </div>
            </div>

            {cv.skills.length > 0 && (
              <div style={{ marginBottom: '20px' }}>
                <h3 style={{ fontSize: '9pt', fontWeight: 700, textTransform: 'uppercase', color: '#6366f1', marginBottom: '8px' }}>{t.technicalSkills}</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {cv.skills.map((skill, i) => (
                    <span key={i} style={{ background: '#e0e7ff', color: '#4338ca', padding: '3px 8px', borderRadius: '4px', fontSize: '8pt' }}>
                      {skill.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {cv.languages.length > 0 && (
              <div>
                <h3 style={{ fontSize: '9pt', fontWeight: 700, textTransform: 'uppercase', color: '#6366f1', marginBottom: '8px' }}>{t.languages}</h3>
                {cv.languages.map((lang, i) => (
                  <p key={i} style={{ margin: '4px 0', fontSize: '9pt' }}>{lang.name} - {lang.level}</p>
                ))}
              </div>
            )}
          </div>

          {/* Right content */}
          <div>
            {cv.summary && (
              <div style={{ marginBottom: '20px' }}>
                <p style={{ color: '#4b5563', borderLeft: '3px solid #6366f1', paddingLeft: '12px' }}>{cv.summary}</p>
              </div>
            )}

            {cv.experience.length > 0 && (
              <div style={{ marginBottom: '20px' }}>
                <h2 style={{ fontSize: '11pt', fontWeight: 700, textTransform: 'uppercase', color: '#1f2937', marginBottom: '12px', borderBottom: '2px solid #6366f1', paddingBottom: '4px' }}>
                  {t.experience}
                </h2>
                {cv.experience.map((exp) => (
                  <div key={exp.id} style={{ marginBottom: '14px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <h3 style={{ fontWeight: 600, fontSize: '10pt', margin: 0 }}>{exp.role}</h3>
                      <span style={{ color: '#6b7280', fontSize: '9pt' }}>{exp.startDate} - {exp.current ? 'Present' : exp.endDate}</span>
                    </div>
                    <p style={{ color: '#6366f1', margin: '2px 0 6px 0', fontWeight: 500 }}>{exp.company}</p>
                    {exp.bullets.length > 0 && (
                      <ul style={{ margin: 0, paddingLeft: '16px' }}>
                        {exp.bullets.map((b, i) => <li key={i} style={{ marginBottom: '3px', color: '#4b5563' }}>{b.text}</li>)}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            )}

            {cv.education.length > 0 && (
              <div>
                <h2 style={{ fontSize: '11pt', fontWeight: 700, textTransform: 'uppercase', color: '#1f2937', marginBottom: '12px', borderBottom: '2px solid #6366f1', paddingBottom: '4px' }}>
                  {t.education}
                </h2>
                {cv.education.map((edu) => (
                  <div key={edu.id} style={{ marginBottom: '10px' }}>
                    <h3 style={{ fontWeight: 600, fontSize: '10pt', margin: 0 }}>{edu.degree}</h3>
                    <p style={{ color: '#6366f1', margin: '2px 0' }}>{edu.institution}</p>
                    <span style={{ color: '#6b7280', fontSize: '9pt' }}>{edu.endDate || edu.startDate}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Minimal Template
  if (template === 'minimal') {
    return (
      <div ref={ref} className="cv-minimal" style={{ fontFamily: "'Helvetica Neue', Arial, sans-serif", color: '#333', padding: '32px', fontSize: '10pt', lineHeight: '1.6' }}>
        <div style={{ marginBottom: '24px' }}>
          <h1 style={{ fontSize: '24pt', fontWeight: 300, margin: 0, letterSpacing: '1px' }}>
            {cv.personal.fullName || 'YOUR NAME'}
          </h1>
          <div style={{ color: '#666', marginTop: '8px', fontSize: '9pt' }}>
            {[cv.personal.email, cv.personal.phone, cv.personal.location, cv.personal.linkedin].filter(Boolean).join(' · ')}
          </div>
        </div>

        {cv.summary && (
          <div style={{ marginBottom: '24px', paddingBottom: '24px', borderBottom: '1px solid #eee' }}>
            <p style={{ color: '#555', margin: 0 }}>{cv.summary}</p>
          </div>
        )}

        {cv.experience.length > 0 && (
          <div style={{ marginBottom: '24px' }}>
            <h2 style={{ fontSize: '9pt', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '2px', color: '#999', marginBottom: '16px' }}>{t.experience}</h2>
            {cv.experience.map((exp) => (
              <div key={exp.id} style={{ marginBottom: '18px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontWeight: 500 }}>{exp.role}</span>
                  <span style={{ color: '#999', fontSize: '9pt' }}>{exp.startDate} — {exp.current ? 'Present' : exp.endDate}</span>
                </div>
                <p style={{ color: '#666', margin: '2px 0 8px 0' }}>{exp.company}</p>
                {exp.bullets.length > 0 && (
                  <ul style={{ margin: 0, paddingLeft: '16px', color: '#555' }}>
                    {exp.bullets.map((b, i) => <li key={i} style={{ marginBottom: '4px' }}>{b.text}</li>)}
                  </ul>
                )}
              </div>
            ))}
          </div>
        )}

        {cv.education.length > 0 && (
          <div style={{ marginBottom: '24px' }}>
            <h2 style={{ fontSize: '9pt', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '2px', color: '#999', marginBottom: '16px' }}>{t.education}</h2>
            {cv.education.map((edu) => (
              <div key={edu.id} style={{ marginBottom: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontWeight: 500 }}>{edu.degree}</span>
                  <span style={{ color: '#999', fontSize: '9pt' }}>{edu.endDate || edu.startDate}</span>
                </div>
                <p style={{ color: '#666', margin: '2px 0' }}>{edu.institution}</p>
              </div>
            ))}
          </div>
        )}

        {cv.skills.length > 0 && (
          <div>
            <h2 style={{ fontSize: '9pt', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '2px', color: '#999', marginBottom: '12px' }}>{t.technicalSkills}</h2>
            <p style={{ color: '#555', margin: 0 }}>{cv.skills.map(s => s.name).join(' · ')}</p>
          </div>
        )}
      </div>
    );
  }

  // Creative Template
  if (template === 'creative') {
    return (
      <div ref={ref} className="cv-creative" style={{ fontFamily: "'Poppins', sans-serif", color: '#1a1a1a', padding: '0', fontSize: '9.5pt', lineHeight: '1.5' }}>
        {/* Colorful header */}
        <div style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)', color: '#fff', padding: '32px', marginBottom: '24px' }}>
          <h1 style={{ fontSize: '26pt', fontWeight: 700, margin: 0 }}>
            {cv.personal.fullName || 'YOUR NAME'}
          </h1>
          {cv.personal.title && (
            <p style={{ fontSize: '13pt', opacity: 0.9, margin: '4px 0 0 0' }}>{cv.personal.title}</p>
          )}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', marginTop: '16px', fontSize: '9pt', opacity: 0.9 }}>
            {cv.personal.email && <span>✉ {cv.personal.email}</span>}
            {cv.personal.phone && <span>📞 {cv.personal.phone}</span>}
            {cv.personal.location && <span>📍 {cv.personal.location}</span>}
          </div>
        </div>

        <div style={{ padding: '0 28px 28px 28px' }}>
          {cv.summary && (
            <div style={{ marginBottom: '24px', background: '#f8f9fa', padding: '16px', borderRadius: '12px' }}>
              <p style={{ margin: 0, color: '#555' }}>{cv.summary}</p>
            </div>
          )}

          {cv.skills.length > 0 && (
            <div style={{ marginBottom: '24px' }}>
              <h2 style={{ fontSize: '11pt', fontWeight: 700, color: '#764ba2', marginBottom: '12px' }}>{t.technicalSkills}</h2>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {cv.skills.map((skill, i) => (
                  <span key={i} style={{ 
                    background: `linear-gradient(135deg, ${i % 3 === 0 ? '#667eea' : i % 3 === 1 ? '#764ba2' : '#f093fb'} 0%, ${i % 3 === 0 ? '#764ba2' : i % 3 === 1 ? '#f093fb' : '#667eea'} 100%)`,
                    color: '#fff',
                    padding: '6px 14px',
                    borderRadius: '20px',
                    fontSize: '9pt',
                    fontWeight: 500
                  }}>
                    {skill.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {cv.experience.length > 0 && (
            <div style={{ marginBottom: '24px' }}>
              <h2 style={{ fontSize: '11pt', fontWeight: 700, color: '#764ba2', marginBottom: '12px' }}>{t.experience}</h2>
              {cv.experience.map((exp) => (
                <div key={exp.id} style={{ marginBottom: '16px', paddingLeft: '16px', borderLeft: '3px solid #764ba2' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <h3 style={{ fontWeight: 600, fontSize: '10pt', margin: 0 }}>{exp.role}</h3>
                    <span style={{ color: '#888', fontSize: '8pt', background: '#f0f0f0', padding: '2px 8px', borderRadius: '10px' }}>
                      {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                    </span>
                  </div>
                  <p style={{ color: '#764ba2', margin: '2px 0 8px 0', fontWeight: 500 }}>{exp.company}</p>
                  {exp.bullets.length > 0 && (
                    <ul style={{ margin: 0, paddingLeft: '16px' }}>
                      {exp.bullets.map((b, i) => <li key={i} style={{ marginBottom: '4px', color: '#555' }}>{b.text}</li>)}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          )}

          {cv.education.length > 0 && (
            <div>
              <h2 style={{ fontSize: '11pt', fontWeight: 700, color: '#764ba2', marginBottom: '12px' }}>{t.education}</h2>
              {cv.education.map((edu) => (
                <div key={edu.id} style={{ marginBottom: '12px', paddingLeft: '16px', borderLeft: '3px solid #667eea' }}>
                  <h3 style={{ fontWeight: 600, fontSize: '10pt', margin: 0 }}>{edu.degree}</h3>
                  <p style={{ color: '#667eea', margin: '2px 0' }}>{edu.institution}</p>
                  <span style={{ color: '#888', fontSize: '8pt' }}>{edu.endDate || edu.startDate}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Fallback to harvard
  return (
    <div ref={ref} className="harvard-cv harvard-cv-page">
      <div className="text-center mb-6">
        <h1 className="mb-2">{cv.personal.fullName || 'YOUR NAME'}</h1>
      </div>
    </div>
  );
});

CVPreviewPanel.displayName = 'CVPreviewPanel';

export default CVPreviewPanel;