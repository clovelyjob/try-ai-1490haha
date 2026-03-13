import { useEffect } from 'react';
import { useNotificationsStore } from '@/store/useNotificationsStore';
import { useProfileStore } from '@/store/useProfileStore';
import { useCVStore } from '@/store/useCVStore';
import { useInterviewStore } from '@/store/useInterviewStore';
import { useOpportunitiesStore } from '@/store/useOpportunitiesStore';

export const useSmartReminders = () => {
  const { addNotification } = useNotificationsStore();
  const profile = useProfileStore((state) => state.profile);
  const cvs = useCVStore((state) => state.cvs);
  const sessions = useInterviewStore((state) => state.sessions);
  const savedOpportunities = useOpportunitiesStore((state) => state.savedOpportunities);

  useEffect(() => {
    // Check reminders every hour
    const interval = setInterval(() => {
      checkReminders();
    }, 60 * 60 * 1000); // 1 hour

    // Check immediately on mount
    checkReminders();

    return () => clearInterval(interval);
  }, [cvs, sessions, savedOpportunities, profile]);

  const checkReminders = () => {
    const now = new Date();
    const dayOfWeek = now.getDay();
    const hour = now.getHours();

    // Reminder: Update CV (if not updated in 30 days)
    if (cvs.length > 0) {
      const lastCVUpdate = new Date(Math.max(...cvs.map(cv => new Date(cv.updatedAt).getTime())));
      const daysSinceUpdate = Math.floor((now.getTime() - lastCVUpdate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysSinceUpdate >= 30 && hour === 10 && dayOfWeek === 1) { // Monday at 10am
        addNotification({
          type: 'reminder',
          title: 'Actualiza tu CV',
          message: `Han pasado ${daysSinceUpdate} días desde tu última actualización. Mantén tu CV al día.`,
          actionUrl: '/dashboard/cvs',
          actionLabel: 'Actualizar CV',
        });
      }
    }

    // Reminder: Practice interview (if no practice in 7 days)
    if (sessions.length > 0) {
      const lastSession = new Date(Math.max(...sessions.map(s => new Date(s.startedAt).getTime())));
      const daysSinceSession = Math.floor((now.getTime() - lastSession.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysSinceSession >= 7 && hour === 18 && dayOfWeek === 3) { // Wednesday at 6pm
        addNotification({
          type: 'reminder',
          title: 'Practica una entrevista',
          message: 'Mantén tus habilidades afiladas. Una sesión semanal marca la diferencia.',
          actionUrl: '/dashboard/interviews/setup',
          actionLabel: 'Practicar ahora',
        });
      }
    }

    // Reminder: Check saved opportunities (daily at 9am)
    if (savedOpportunities.length > 0 && hour === 9) {
      const recentOpps = savedOpportunities.filter(opp => {
        const savedDate = new Date(opp.savedAt);
        const daysSaved = Math.floor((now.getTime() - savedDate.getTime()) / (1000 * 60 * 60 * 24));
        return daysSaved <= 3;
      });

      if (recentOpps.length > 0) {
        addNotification({
          type: 'reminder',
          title: 'Revisa tus oportunidades guardadas',
          message: `Tienes ${recentOpps.length} oportunidades recientes. ¡No las dejes pasar!`,
          actionUrl: '/dashboard/opportunities',
          actionLabel: 'Ver oportunidades',
        });
      }
    }

    // Reminder: Complete profile (if incomplete)
    if (profile && (!profile.rolActual || !profile.interests || profile.interests.length === 0)) {
      if (hour === 11 && dayOfWeek === 5) { // Friday at 11am
        addNotification({
          type: 'reminder',
          title: 'Completa tu perfil',
          message: 'Un perfil completo te ayuda a encontrar mejores oportunidades.',
          actionUrl: '/dashboard/settings',
          actionLabel: 'Completar perfil',
        });
      }
    }

    // Motivational reminder (every Monday at 8am)
    if (dayOfWeek === 1 && hour === 8) {
      const motivationalMessages = [
        '¡Nueva semana, nuevas oportunidades! 💪',
        '¡Tu próxima gran oportunidad está esperándote! 🚀',
        '¡Sigue trabajando en tu desarrollo profesional! 🌟',
        '¡Esta semana es perfecta para avanzar en tu carrera! ✨',
      ];
      
      const randomMessage = motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)];
      
      addNotification({
        type: 'info',
        title: '🌅 Buenos días',
        message: randomMessage,
      });
    }
  };

  return null;
};
