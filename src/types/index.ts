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
