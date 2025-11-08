export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  plan: 'free' | 'premium';
  createdAt: Date;
  lastLogin: Date;
  onboardingCompleted: boolean;
}

export interface Profile {
  userId: string;
  interests: string[];
  values: string[];
  workStyle: {
    modality: string;
    schedule: string;
    companySize: string;
  };
  skills: {
    technical: { name: string; level: number }[];
    soft: string[];
    languages: { name: string; level: string }[];
    tools: string[];
  };
  experience: 'student' | 'graduate' | 'junior' | 'mid' | 'senior' | 'transition';
  situation: string;
  challenge: string;
  diagnosticResults: {
    topCareers: { title: string; match: number }[];
    profileType: string;
    insights: string[];
    radarData: { skill: string; value: number }[];
  };
}

export interface CV {
  userId: string;
  personalInfo: {
    fullName: string;
    title: string;
    email: string;
    phone: string;
    linkedin?: string;
    portfolio?: string;
    location: string;
    availability: string;
  };
  summary: string;
  experience: {
    id: string;
    position: string;
    company: string;
    type: string;
    startDate: string;
    endDate?: string;
    current: boolean;
    description: string;
    achievements: string[];
  }[];
  education: {
    id: string;
    degree: string;
    institution: string;
    startDate: string;
    endDate?: string;
    gpa?: string;
    honors?: string[];
  }[];
  skills: Profile['skills'];
  projects: {
    id: string;
    name: string;
    link?: string;
    description: string;
    technologies: string[];
    results: string;
  }[];
  optimizationScore: number;
}

export interface Task {
  id: string;
  userId: string;
  title: string;
  description: string;
  xpReward: number;
  duration: number;
  completed: boolean;
  dueDate: Date;
  category: 'daily' | 'weekly' | 'objective';
  time?: string;
}

export interface Progress {
  userId: string;
  level: number;
  currentXP: number;
  nextLevelXP: number;
  streak: number;
  longestStreak: number;
  tasksCompleted: number;
  achievements: string[];
  coins: number;
  totalXP: number;
  weeklyProgress: number;
  applications: number;
  interviews: number;
}

export interface Circle {
  id: string;
  name: string;
  description: string;
  code: string;
  members: {
    userId: string;
    name: string;
    avatar?: string;
    level: number;
    progress: number;
    streak: number;
  }[];
  maxMembers: number;
  weeklyChallenge?: {
    goal: string;
    reward: number;
    progress: number;
    contributions: { userId: string; amount: number }[];
  };
  isAdmin: boolean;
}

export interface JobOpportunity {
  id: string;
  company: string;
  position: string;
  match: number;
  salary?: string;
  location: string;
  type: 'remote' | 'hybrid' | 'onsite';
  logo?: string;
}

export type GoalCategory = 'career' | 'learning' | 'wellbeing' | 'networking' | 'other';
export type GoalPriority = 'alta' | 'media' | 'baja';
export type GoalStatus = 'pending' | 'in_progress' | 'paused' | 'completed' | 'abandoned';
export type GoalVisibility = 'private' | 'circle' | 'public';

export interface Microaction {
  id: string;
  title: string;
  description?: string;
  dueDate?: string;
  priority?: GoalPriority;
  xp?: number;
  completed: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface HistoryEntry {
  action: string;
  by: string;
  at: string;
  payload?: any;
}

export interface Goal {
  id: string;
  title: string;
  description?: string;
  category: GoalCategory;
  priority: GoalPriority;
  createdAt: string;
  dueDate?: string;
  visibility: GoalVisibility;
  status: GoalStatus;
  progress: number;
  progressTarget?: number;
  microactions: Microaction[];
  tags?: string[];
  relatedSkills?: string[];
  repeat?: 'none' | 'daily' | 'weekly' | 'monthly';
  ownerId: string;
  assignedByAdmin?: boolean;
  history: HistoryEntry[];
}

export type CVTemplate = 'harvard' | 'modern' | 'minimal' | 'creative';

export interface CVPersonalInfo {
  fullName: string;
  title?: string;
  email: string;
  phone?: string;
  location?: string;
  linkedin?: string;
  github?: string;
  website?: string;
  avatarUrl?: string;
}

export interface CVEducation {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate?: string;
  gpa?: string;
  description?: string;
  thesis?: string;
}

export interface CVExperienceBullet {
  text: string;
  metric?: string;
}

export interface CVExperience {
  id: string;
  company: string;
  role: string;
  startDate: string;
  endDate?: string;
  current?: boolean;
  location?: string;
  bullets: CVExperienceBullet[];
  technologies?: string[];
}

export interface CVResearch {
  id: string;
  title: string;
  venue: string;
  year: string;
  link?: string;
  summary?: string;
  coauthors?: string;
}

export interface CVProject {
  id: string;
  title: string;
  role?: string;
  description: string;
  technologies: string[];
  link?: string;
}

export interface CVTeaching {
  id: string;
  course: string;
  institution: string;
  role: string;
  startDate: string;
  endDate?: string;
  description?: string;
}

export interface CVSkill {
  name: string;
  level: 'básico' | 'intermedio' | 'avanzado';
  category?: 'técnica' | 'blanda';
}

export interface CVCertification {
  id: string;
  name: string;
  institution: string;
  date: string;
  link?: string;
}

export interface CVLanguage {
  name: string;
  level: string; // A1-C2
}

export interface CVAward {
  id: string;
  title: string;
  institution: string;
  date: string;
  description?: string;
}

export interface CVReference {
  id: string;
  name: string;
  position: string;
  contact?: string;
}

export interface CVScore {
  overall: number;
  clarity: number;
  impact: number;
  keywords: number;
  format: number;
}

export interface CVVersion {
  versionId: string;
  snapshot: Partial<CVData>;
  createdAt: string;
  note?: string;
}

export interface CVData {
  id: string;
  userId: string;
  title: string;
  template: CVTemplate;
  personal: CVPersonalInfo;
  summary: string;
  education: CVEducation[];
  experience: CVExperience[];
  research: CVResearch[];
  projects: CVProject[];
  teaching: CVTeaching[];
  skills: CVSkill[];
  certifications: CVCertification[];
  languages: CVLanguage[];
  awards: CVAward[];
  references: CVReference[];
  createdAt: string;
  updatedAt: string;
  versions: CVVersion[];
  score: CVScore;
  metadata: {
    industryTags: string[];
    targetKeywords: string[];
  };
}
