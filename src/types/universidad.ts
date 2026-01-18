export interface University {
  id: string;
  name: string;
  logo_url: string | null;
  domain: string | null;
  created_at: string;
  updated_at: string;
}

export interface UniversityAdmin {
  id: string;
  university_id: string;
  user_id: string;
  role: 'owner' | 'admin' | 'viewer';
  name: string;
  email: string;
  created_at: string;
}

export interface UniversityStudent {
  id: string;
  university_id: string;
  student_user_id: string;
  career: string | null;
  cohort: string | null;
  enrolled_at: string;
  // Joined data from profiles
  profile?: {
    full_name: string | null;
    avatar_url: string | null;
  };
  // Aggregated metrics
  cv_score?: number;
  interview_score?: number;
  improvement?: number;
  main_interest?: string;
  last_activity?: string;
}

export interface UniversityStats {
  totalStudents: number;
  averageCVScore: number;
  averageInterviewScore: number;
  improvementTrend: number;
  scoreByCareer: { career: string; cvScore: number; interviewScore: number }[];
  performanceTrend: { month: string; cvScore: number; interviewScore: number }[];
  topStudents: { name: string; career: string; score: number }[];
  softSkillsAverage: {
    communication: number;
    structure: number;
    confidence: number;
    clarity: number;
    technicalDepth: number;
  };
  commonWeaknesses: { area: string; count: number }[];
  interviewFailures: { pattern: string; count: number }[];
  professionalInterests: { interest: string; count: number; percentage: number }[];
}
