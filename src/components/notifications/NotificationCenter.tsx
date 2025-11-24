import { Bell, Check, CheckCheck, Trash2, Settings, X } from 'lucide-react';
import { useNotificationsStore } from '@/store/useNotificationsStore';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface NotificationCenterProps {
  onClose: () => void;
}

const notificationIcons = {
  info: '💡',
  success: '✅',
  warning: '⚠️',
  achievement: '🏆',
  reminder: '⏰',
  opportunity: '💼',
};

const notificationColors = {
  info: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
  success: 'bg-green-500/10 text-green-600 dark:text-green-400',
  warning: 'bg-yellow-500/10 text-amber-600 dark:text-amber-400',
  achievement: 'bg-purple-500/10 text-purple-600 dark:text-purple-400',
  reminder: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400',
  opportunity: 'bg-primary/10 text-primary',
};

export const NotificationCenter = ({ onClose }: NotificationCenterProps) => {
  const navigate = useNavigate();
  const { 
    notifications, 
    markAsRead, 
    markAllAsRead, 
    deleteNotification, 
    clearAll 
  } = useNotificationsStore();

  const handleNotificationClick = (notification: any) => {
    markAsRead(notification.id);
    if (notification.actionUrl) {
      navigate(notification.actionUrl);
      onClose();
    }
  };

  const handleSettings = () => {
    navigate('/settings');
    onClose();
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="w-full h-full flex flex-col bg-background">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          <h2 className="font-semibold">Notificaciones</h2>
          {unreadCount > 0 && (
            <Badge variant="secondary" className="ml-2">
              {unreadCount}
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleSettings}
            title="Configuración"
          >
            <Settings className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Actions */}
      {notifications.length > 0 && (
        <div className="flex items-center gap-2 p-3 border-b bg-muted/30">
          <Button
            variant="outline"
            size="sm"
            onClick={markAllAsRead}
            disabled={unreadCount === 0}
            className="text-xs shadow-clovely-sm hover:shadow-clovely-md transition-all"
          >
            <CheckCheck className="h-3 w-3 mr-1" />
            Marcar todas leídas
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAll}
            className="text-xs text-destructive hover:text-destructive hover:bg-destructive/10"
          >
            <Trash2 className="h-3 w-3 mr-1" />
            Limpiar todo
          </Button>
        </div>
      )}

      {/* Notifications List */}
      <ScrollArea className="flex-1">
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full p-8 text-center">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/10 to-primary-warm/20 flex items-center justify-center mb-4 shadow-clovely-md">
              <Bell className="h-10 w-10 text-primary" />
            </div>
            <h3 className="font-semibold text-lg mb-2">No hay notificaciones</h3>
            <p className="text-sm text-muted-foreground max-w-[200px]">
              Te avisaremos cuando haya algo nuevo para ti
            </p>
          </div>
        ) : (
          <div className="divide-y">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={cn(
                  "p-4 hover:bg-accent/50 transition-all duration-200 cursor-pointer relative rounded-xl border-2 border-transparent hover:border-primary/30 hover:shadow-clovely-sm mx-2 my-1",
                  !notification.read && "bg-primary/5 dark:bg-primary/10"
                )}
                onClick={() => handleNotificationClick(notification)}
              >
                {!notification.read && (
                  <div className="absolute left-2 top-6 w-2 h-2 rounded-full bg-primary" />
                )}

                <div className="flex gap-3 ml-4">
                  <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 text-xl",
                    notificationColors[notification.type]
                  )}>
                    {notificationIcons[notification.type]}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h4 className="font-medium text-sm">{notification.title}</h4>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 flex-shrink-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteNotification(notification.id);
                        }}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>

                    <p className="text-sm text-muted-foreground mb-2">
                      {notification.message}
                    </p>

                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(notification.timestamp), {
                          addSuffix: true,
                          locale: es,
                        })}
                      </span>

                      {notification.actionLabel && (
                        <Button
                          variant="link"
                          size="sm"
                          className="h-auto p-0 text-xs"
                        >
                          {notification.actionLabel} →
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
};
