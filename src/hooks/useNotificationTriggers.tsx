import { useEffect } from 'react';
import { useNotificationsStore } from '@/store/useNotificationsStore';
import { useOpportunitiesStore } from '@/store/useOpportunitiesStore';
import { useInterviewStore } from '@/store/useInterviewStore';

export const useNotificationTriggers = () => {
  const { addNotification } = useNotificationsStore();
  const opportunities = useOpportunitiesStore((state) => state.opportunities);
  const sessions = useInterviewStore((state) => state.sessions);

  // New opportunities notification
  useEffect(() => {
    const checkNewOpportunities = () => {
      const lastCheck = localStorage.getItem('lastOpportunityCheck');
      const now = Date.now();
      
      if (lastCheck) {
        const timeSinceLastCheck = now - parseInt(lastCheck);
        const hoursElapsed = timeSinceLastCheck / (1000 * 60 * 60);
        
        // Check every 24 hours
        if (hoursElapsed >= 24) {
          const newOpps = opportunities.filter(opp => {
            const publishedTime = new Date(opp.publishedAt).getTime();
            return publishedTime > parseInt(lastCheck);
          });

          if (newOpps.length > 0) {
          addNotification({
            type: 'opportunity',
            title: `🎯 ${newOpps.length} nuevas oportunidades`,
            message: `Hay ${newOpps.length} ofertas que coinciden con tu perfil. ¡Échales un vistazo!`,
            actionUrl: '/dashboard/opportunities',
            actionLabel: 'Ver oportunidades',
          });
          }
          
          localStorage.setItem('lastOpportunityCheck', now.toString());
        }
      } else {
        localStorage.setItem('lastOpportunityCheck', now.toString());
      }
    };

    checkNewOpportunities();
  }, [opportunities.length]);

  // Level up notification (disabled for now - will be implemented with rewards system)
  // useEffect(() => {
  //   const lastLevel = localStorage.getItem('lastUserLevel');
  //   if (lastLevel && parseInt(lastLevel) < level) {
  //     const levelNames = ['Novato', 'Junior', 'Intermedio', 'Avanzado', 'Experto', 'Maestro'];
  //     addNotification({
  //       type: 'achievement',
  //       title: '🎉 ¡Subiste de nivel!',
  //       message: `¡Felicidades! Ahora eres ${levelNames[level - 1] || 'nivel ' + level}`,
  //       actionUrl: '/dashboard',
  //       actionLabel: 'Ver progreso',
  //     });
  //   }
  //   localStorage.setItem('lastUserLevel', level.toString());
  // }, [level]);

  // Interview completed notification
  useEffect(() => {
    const lastSessionCount = parseInt(localStorage.getItem('lastSessionCount') || '0');
    if (sessions.length > lastSessionCount) {
      const latestSession = sessions[sessions.length - 1];
      if (latestSession.endedAt) {
        const score = latestSession.finalScore || 0;
        let message = '';
        
        if (score >= 80) {
          message = '¡Excelente trabajo! Tus respuestas fueron impresionantes 🌟';
        } else if (score >= 60) {
          message = 'Buen trabajo. Sigue practicando para mejorar 💪';
        } else {
          message = 'La práctica hace al maestro. ¡Sigue adelante! 🎯';
        }

        addNotification({
          type: 'success',
          title: '✅ Entrevista completada',
          message,
          actionUrl: `/dashboard/interviews/results`,
          actionLabel: 'Ver resultados',
        });
      }
    }
    localStorage.setItem('lastSessionCount', sessions.length.toString());
  }, [sessions.length]);

  return null;
};
