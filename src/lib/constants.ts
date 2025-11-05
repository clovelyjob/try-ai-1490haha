export const FREE_LIMITS = {
  aiInteractionsPerMonth: 5,
  activeGoals: 1,
  weeklyMicroactions: 10,
  interviewsPerMonth: 3,
  circleMembers: 5,
  circles: 1,
};

export const VALIDATIONS = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  password: /^(?=.*[A-Z])(?=.*\d).{8,}$/,
  name: /^.{2,}$/,
};

export const QUOTES = [
  'El éxito es la suma de pequeños esfuerzos repetidos',
  'Tu único límite es tu mente',
  'El futuro pertenece a quienes creen en sus sueños',
  'No esperes la oportunidad perfecta, créala',
  'El progreso comienza donde termina tu zona de confort',
];

export const INTERESTS = [
  { id: 'tech', label: 'Tecnología', icon: '💻' },
  { id: 'design', label: 'Diseño', icon: '🎨' },
  { id: 'business', label: 'Negocios', icon: '📊' },
  { id: 'science', label: 'Ciencias', icon: '🧬' },
  { id: 'education', label: 'Educación', icon: '📚' },
  { id: 'marketing', label: 'Marketing', icon: '📱' },
  { id: 'engineering', label: 'Ingeniería', icon: '⚙️' },
  { id: 'art', label: 'Arte', icon: '🎭' },
  { id: 'environment', label: 'Ambiente', icon: '🌍' },
  { id: 'social', label: 'Social', icon: '🤝' },
  { id: 'finance', label: 'Finanzas', icon: '💰' },
  { id: 'law', label: 'Derecho', icon: '⚖️' },
  { id: 'architecture', label: 'Arquitectura', icon: '🏗️' },
  { id: 'gastronomy', label: 'Gastronomía', icon: '🍔' },
  { id: 'tourism', label: 'Turismo', icon: '✈️' },
];

export const VALUES = [
  { id: 'stability', label: 'Estabilidad económica', icon: '💰' },
  { id: 'growth', label: 'Crecimiento profesional', icon: '🚀' },
  { id: 'balance', label: 'Balance vida-trabajo', icon: '⚖️' },
  { id: 'impact', label: 'Impacto social', icon: '🌍' },
  { id: 'autonomy', label: 'Autonomía', icon: '🎯' },
  { id: 'team', label: 'Trabajo en equipo', icon: '👥' },
  { id: 'recognition', label: 'Reconocimiento', icon: '🏆' },
  { id: 'innovation', label: 'Innovación', icon: '💡' },
];

export const WORK_MODALITIES = [
  { id: 'office', label: 'Oficina', icon: '🏢' },
  { id: 'remote', label: 'Remoto', icon: '🏠' },
  { id: 'hybrid', label: 'Híbrido', icon: '🔄' },
  { id: 'flexible', label: 'Flexible', icon: '🤷' },
];

export const WORK_SCHEDULES = [
  { id: 'traditional', label: 'Tradicional (9-5)', icon: '⏰' },
  { id: 'flexible', label: 'Flexible', icon: '🕐' },
  { id: 'goals', label: 'Por objetivos', icon: '📅' },
  { id: 'night', label: 'Nocturno', icon: '🌙' },
];

export const COMPANY_SIZES = [
  { id: 'startup', label: 'Startup', icon: '🚀' },
  { id: 'scaleup', label: 'Scale-up', icon: '🏢' },
  { id: 'corporate', label: 'Corporación', icon: '🏛️' },
  { id: 'own', label: 'Propio negocio', icon: '🎯' },
];

export const EXPERIENCE_LEVELS = [
  { id: 'student', label: 'Estudiante', icon: '🎓' },
  { id: 'graduate', label: 'Recién graduado', icon: '🆕' },
  { id: 'junior', label: 'Junior (1-3 años)', icon: '💼' },
  { id: 'mid', label: 'Mid-level (3-5 años)', icon: '📈' },
  { id: 'senior', label: 'Senior (5+ años)', icon: '🎯' },
  { id: 'transition', label: 'En transición', icon: '🔄' },
];

export const SITUATIONS = [
  'Empleado buscando crecimiento',
  'Empleado buscando cambio',
  'Desempleado',
  'Explorando opciones',
];

export const LEVEL_TIERS = [
  { level: 0, name: 'Explorador', icon: '🌱', maxXP: 500 },
  { level: 1, name: 'Aprendiz', icon: '🧭', maxXP: 1500 },
  { level: 2, name: 'Creador', icon: '🚀', maxXP: 3000 },
  { level: 3, name: 'Mentor', icon: '💡', maxXP: 6000 },
  { level: 4, name: 'Profesional', icon: '🌟', maxXP: 10000 },
  { level: 5, name: 'Embajador', icon: '🏆', maxXP: 25000 },
  { level: 6, name: 'Leyenda', icon: '🎯', maxXP: 50000 },
];

export const XP_REWARDS = {
  checkin: 10,
  task_easy: 15,
  task_medium: 30,
  task_hard: 50,
  cv_update: 30,
  interview_practice: 50,
  weekly_goal: 100,
  apply_job: 75,
  get_interview: 200,
  get_job: 1000,
  streak_7: 100,
  streak_30: 500,
};
