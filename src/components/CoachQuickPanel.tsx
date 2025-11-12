import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Bot, Send, Sparkles, Loader2, User } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useCoachStore } from '@/store/useCoachStore';
import { useAuthStore } from '@/store/useAuthStore';
import { toast } from 'sonner';

interface CoachQuickPanelProps {
  open: boolean;
  onClose: () => void;
  topic: 'entrevista' | 'consejo' | 'progreso' | 'general' | null;
}

const TOPIC_PROMPTS = {
  entrevista: '🎤 Me gustaría practicar una entrevista. ¿Puedes hacerme pregunas comunes y darme feedback?',
  consejo: '💡 ¿Qué consejo me darías para impulsar mi carrera profesional esta semana?',
  progreso: '📊 ¿Puedes analizar mi progreso actual y darme recomendaciones sobre qué enfocarme?',
  general: '👋 Hola! ¿En qué puedes ayudarme hoy?',
};

export function CoachQuickPanel({ open, onClose, topic }: CoachQuickPanelProps) {
  const user = useAuthStore((state) => state.user);
  const { messages, isProcessing, sendMessage, initContext } = useCoachStore();
  const [input, setInput] = useState('');
  const [hasAutoSent, setHasAutoSent] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const userId = user?.id || 'demo_user';
  const userMessages = messages[userId] || [];

  useEffect(() => {
    if (open && topic && !hasAutoSent) {
      initContext(userId);
      const prompt = TOPIC_PROMPTS[topic];
      if (prompt) {
        setHasAutoSent(true);
        sendMessage(userId, prompt).catch(() => {
          toast.error('Error al iniciar conversación');
        });
      }
    }
  }, [open, topic, hasAutoSent, userId, sendMessage, initContext]);

  useEffect(() => {
    if (!open) {
      setHasAutoSent(false);
    }
  }, [open]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [userMessages]);

  const handleSend = async () => {
    if (!input.trim() || isProcessing) return;

    const message = input;
    setInput('');

    try {
      await sendMessage(userId, message);
    } catch (error) {
      toast.error('Error al enviar mensaje');
    }
  };

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent 
        side="right" 
        className="w-full sm:w-[540px] p-0 flex flex-col bg-[#FFF7ED] dark:bg-[#0F1115] border-l-2 border-slate-900 dark:border-[#F97316]"
      >
        {/* Header */}
        <SheetHeader className="p-6 border-b bg-gradient-to-r from-primary/5 to-secondary/5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Avatar className="h-10 w-10 bg-primary/10">
                  <AvatarFallback>
                    <Bot className="h-5 w-5 text-primary" />
                  </AvatarFallback>
                </Avatar>
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-background rounded-full animate-pulse" />
              </div>
              <div>
                <SheetTitle className="flex items-center gap-2 text-foreground">
                  Clovy – Tu Coach IA
                  <Sparkles className="h-4 w-4 text-primary" />
                </SheetTitle>
                <p className="text-xs text-muted-foreground">Disponible 24/7 para ayudarte</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>
        </SheetHeader>

        {/* Messages */}
        <ScrollArea className="flex-1 p-6" ref={scrollRef}>
          <div className="space-y-4">
            <AnimatePresence mode="popLayout">
              {userMessages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`flex gap-2 max-w-[85%] ${
                      message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                    }`}
                  >
                    <Avatar className="h-8 w-8 shrink-0">
                      <AvatarFallback className={message.role === 'user' ? 'bg-primary/10' : 'bg-secondary/10'}>
                        {message.role === 'user' ? (
                          <User className="h-4 w-4" />
                        ) : (
                          <Bot className="h-4 w-4 text-primary" />
                        )}
                      </AvatarFallback>
                    </Avatar>
                    <div
                      className={`rounded-2xl p-3 ${
                        message.role === 'user'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-background border border-border'
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {isProcessing && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-start"
              >
                <div className="flex gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-secondary/10">
                      <Bot className="h-4 w-4 text-primary" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="bg-background border border-border rounded-2xl p-3">
                    <div className="flex gap-1">
                      <motion.div
                        className="w-2 h-2 rounded-full bg-muted-foreground"
                        animate={{ y: [0, -8, 0] }}
                        transition={{ duration: 0.6, repeat: Infinity, ease: 'easeInOut' }}
                      />
                      <motion.div
                        className="w-2 h-2 rounded-full bg-muted-foreground"
                        animate={{ y: [0, -8, 0] }}
                        transition={{ duration: 0.6, repeat: Infinity, ease: 'easeInOut', delay: 0.2 }}
                      />
                      <motion.div
                        className="w-2 h-2 rounded-full bg-muted-foreground"
                        animate={{ y: [0, -8, 0] }}
                        transition={{ duration: 0.6, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }}
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </ScrollArea>

        {/* Input */}
        <div className="p-6 border-t bg-background/50">
          <div className="flex gap-2">
            <Input
              placeholder="Escribe tu mensaje..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              disabled={isProcessing}
              className="flex-1"
            />
            <Button
              onClick={handleSend}
              disabled={!input.trim() || isProcessing}
              size="icon"
            >
              {isProcessing ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
            <Sparkles className="h-3 w-3" />
            Continúa la conversación o cierra para volver al dashboard
          </p>
        </div>
      </SheetContent>
    </Sheet>
  );
}
