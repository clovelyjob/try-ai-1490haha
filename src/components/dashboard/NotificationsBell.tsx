import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useNotificationsStore } from '@/store/useNotificationsStore';
import { NotificationCenter } from '@/components/notifications/NotificationCenter';
import { useState } from 'react';

export const NotificationsBell = () => {
  const [open, setOpen] = useState(false);
  const { getUnreadCount } = useNotificationsStore();
  const unreadCount = getUnreadCount();

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="relative"
          aria-label="Notificaciones"
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:w-[400px] p-0">
        <NotificationCenter onClose={() => setOpen(false)} />
      </SheetContent>
    </Sheet>
  );
};
