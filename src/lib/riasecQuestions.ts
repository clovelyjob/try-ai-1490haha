// Holland RIASEC Vocational Assessment Questions
// 42 questions total - 7 per personality type

export type RIASECType = 'R' | 'I' | 'A' | 'S' | 'E' | 'C';

export interface RIASECQuestion {
  id: string;
  text: string;
  type: RIASECType;
}

export const RIASEC_TYPE_INFO: Record<RIASECType, { name: string; description: string; icon: string }> = {
  R: {
    name: 'Realista',
    description: 'Práctico, trabaja con herramientas, máquinas y cosas físicas',
    icon: '🔧'
  },
  I: {
    name: 'Investigador',
    description: 'Analítico, científico, disfruta resolver problemas complejos',
    icon: '🔬'
  },
  A: {
    name: 'Artístico',
    description: 'Creativo, expresivo, trabaja con ideas y formas de expresión',
    icon: '🎨'
  },
  S: {
    name: 'Social',
    description: 'Ayuda a otros, enseña, comunica y trabaja en equipo',
    icon: '🤝'
  },
  E: {
    name: 'Emprendedor',
    description: 'Líder, persuasivo, orientado a negocios y resultados',
    icon: '💼'
  },
  C: {
    name: 'Convencional',
    description: 'Organizado, detallista, trabaja con datos y sistemas',
    icon: '📊'
  }
};

export const RIASEC_QUESTIONS: RIASECQuestion[] = [
  // Realistic (R) - 7 questions
  { id: 'R1', text: 'Reparar electrodomésticos o aparatos electrónicos', type: 'R' },
  { id: 'R2', text: 'Construir o armar cosas con mis manos', type: 'R' },
  { id: 'R3', text: 'Trabajar con herramientas mecánicas', type: 'R' },
  { id: 'R4', text: 'Operar maquinaria o equipos técnicos', type: 'R' },
  { id: 'R5', text: 'Realizar trabajo físico al aire libre', type: 'R' },
  { id: 'R6', text: 'Instalar o configurar sistemas tecnológicos', type: 'R' },
  { id: 'R7', text: 'Resolver problemas prácticos del día a día', type: 'R' },

  // Investigative (I) - 7 questions
  { id: 'I1', text: 'Investigar y analizar datos para encontrar patrones', type: 'I' },
  { id: 'I2', text: 'Leer artículos científicos o técnicos', type: 'I' },
  { id: 'I3', text: 'Resolver problemas matemáticos o lógicos', type: 'I' },
  { id: 'I4', text: 'Experimentar para probar nuevas teorías', type: 'I' },
  { id: 'I5', text: 'Aprender sobre nuevas tecnologías o descubrimientos', type: 'I' },
  { id: 'I6', text: 'Analizar información compleja para tomar decisiones', type: 'I' },
  { id: 'I7', text: 'Buscar el "por qué" detrás de las cosas', type: 'I' },

  // Artistic (A) - 7 questions
  { id: 'A1', text: 'Diseñar o crear contenido visual', type: 'A' },
  { id: 'A2', text: 'Escribir historias, artículos o contenido creativo', type: 'A' },
  { id: 'A3', text: 'Expresarme a través del arte, música o actuación', type: 'A' },
  { id: 'A4', text: 'Pensar en soluciones originales e innovadoras', type: 'A' },
  { id: 'A5', text: 'Decorar o diseñar espacios', type: 'A' },
  { id: 'A6', text: 'Trabajar en proyectos que permitan libertad creativa', type: 'A' },
  { id: 'A7', text: 'Apreciar y analizar obras de arte o diseño', type: 'A' },

  // Social (S) - 7 questions
  { id: 'S1', text: 'Ayudar a otros a resolver sus problemas personales', type: 'S' },
  { id: 'S2', text: 'Enseñar o capacitar a otras personas', type: 'S' },
  { id: 'S3', text: 'Trabajar en equipo colaborativo', type: 'S' },
  { id: 'S4', text: 'Organizar eventos o actividades grupales', type: 'S' },
  { id: 'S5', text: 'Escuchar y dar consejos a quienes lo necesitan', type: 'S' },
  { id: 'S6', text: 'Participar en voluntariado o causas sociales', type: 'S' },
  { id: 'S7', text: 'Mediar conflictos entre personas', type: 'S' },

  // Enterprising (E) - 7 questions
  { id: 'E1', text: 'Liderar equipos o proyectos', type: 'E' },
  { id: 'E2', text: 'Convencer o persuadir a otros', type: 'E' },
  { id: 'E3', text: 'Tomar decisiones de negocio importantes', type: 'E' },
  { id: 'E4', text: 'Negociar acuerdos o contratos', type: 'E' },
  { id: 'E5', text: 'Iniciar nuevos proyectos o emprendimientos', type: 'E' },
  { id: 'E6', text: 'Hablar en público o hacer presentaciones', type: 'E' },
  { id: 'E7', text: 'Competir para alcanzar metas ambiciosas', type: 'E' },

  // Conventional (C) - 7 questions
  { id: 'C1', text: 'Organizar archivos, datos o información', type: 'C' },
  { id: 'C2', text: 'Seguir procedimientos y reglas establecidas', type: 'C' },
  { id: 'C3', text: 'Trabajar con hojas de cálculo y bases de datos', type: 'C' },
  { id: 'C4', text: 'Revisar documentos en busca de errores', type: 'C' },
  { id: 'C5', text: 'Planificar y crear cronogramas detallados', type: 'C' },
  { id: 'C6', text: 'Mantener registros precisos y actualizados', type: 'C' },
  { id: 'C7', text: 'Trabajar con números y cálculos financieros', type: 'C' },
];

// Shuffle questions for a more natural flow (mixing types)
export function getShuffledQuestions(): RIASECQuestion[] {
  const shuffled = [...RIASEC_QUESTIONS];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}
