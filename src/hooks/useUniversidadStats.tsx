import { useMemo } from 'react';
import type { UniversityStats, UniversityStudent } from '@/types/universidad';

// Mock data generator for initial development
export function useUniversidadStats(students: UniversityStudent[]): UniversityStats {
  return useMemo(() => {
    // Generate realistic mock data
    const careers = ['Ingeniería de Software', 'Administración', 'Psicología', 'Diseño UX', 'Data Science', 'Marketing'];
    const interests = ['Data Science', 'Project Management', 'UX/Design', 'Software Engineering', 'Business/Finance', 'Consulting'];
    
    const totalStudents = students.length || 156;
    const averageCVScore = 72;
    const averageInterviewScore = 68;
    const improvementTrend = 12.5;

    const scoreByCareer = careers.map(career => ({
      career,
      cvScore: Math.floor(Math.random() * 30) + 60,
      interviewScore: Math.floor(Math.random() * 30) + 55,
    }));

    const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'];
    const performanceTrend = months.map((month, i) => ({
      month,
      cvScore: 60 + (i * 3) + Math.floor(Math.random() * 5),
      interviewScore: 55 + (i * 2.5) + Math.floor(Math.random() * 5),
    }));

    const topStudents = [
      { name: 'María González', career: 'Ingeniería de Software', score: 95 },
      { name: 'Carlos Rodríguez', career: 'Data Science', score: 92 },
      { name: 'Ana Martínez', career: 'Diseño UX', score: 90 },
      { name: 'Luis Hernández', career: 'Administración', score: 88 },
      { name: 'Sofia López', career: 'Marketing', score: 86 },
    ];

    const softSkillsAverage = {
      communication: 72,
      structure: 65,
      confidence: 70,
      clarity: 68,
      technicalDepth: 75,
    };

    const commonWeaknesses = [
      { area: 'Estructura de respuestas', count: 45 },
      { area: 'Claridad en comunicación', count: 38 },
      { area: 'Ejemplos específicos', count: 32 },
      { area: 'Manejo de nervios', count: 28 },
      { area: 'Profundidad técnica', count: 25 },
    ];

    const interviewFailures = [
      { pattern: 'Respuestas muy cortas', count: 42 },
      { pattern: 'Falta de ejemplos STAR', count: 38 },
      { pattern: 'No investigar la empresa', count: 35 },
      { pattern: 'Evitar preguntas difíciles', count: 30 },
      { pattern: 'No hacer preguntas al final', count: 28 },
    ];

    const interestCounts = interests.map(interest => ({
      interest,
      count: Math.floor(Math.random() * 40) + 10,
    }));
    const totalInterests = interestCounts.reduce((sum, i) => sum + i.count, 0);
    const professionalInterests = interestCounts.map(i => ({
      ...i,
      percentage: Math.round((i.count / totalInterests) * 100),
    }));

    return {
      totalStudents,
      averageCVScore,
      averageInterviewScore,
      improvementTrend,
      scoreByCareer,
      performanceTrend,
      topStudents,
      softSkillsAverage,
      commonWeaknesses,
      interviewFailures,
      professionalInterests,
    };
  }, [students]);
}
