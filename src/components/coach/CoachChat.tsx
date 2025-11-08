import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useCoachStore } from '@/store/useCoachStore';
import { useAuthStore } from '@/store/useAuthStore';
import { Bot, Send, Sparkles, Loader2, User } from 'lucide-react';
import { toast } from 'sonner';

export function CoachChat() {
  const user = useAuthStore((state) => state.user);
  const { messages, isProcessing, sendMessage } = useCoachStore();
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  const userId = user?.id || 'demo_user';
  const userMessages = messages[userId] || [];

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

  const quickActions = [
    { label: 'Optimizar CV', emoji: '📄' },
    { label: 'Practicar entrevista', emoji: '🎤' },
    { label: 'Buscar cursos', emoji: '📚' },
    { label: 'Ver oportunidades', emoji: '💼' },
  ];

  return (
    <Card className="flex flex-col h-[600px]">
      {/* Header */}
      <div className="p-4 border-b bg-gradient-to-r from-primary/5 to-secondary/5">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Avatar className="h-10 w-10 bg-primary/10">
              <AvatarFallback>
                <Bot className="h-5 w-5 text-primary" />
              </AvatarFallback>
            </Avatar>
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-background rounded-full animate-pulse" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-foreground flex items-center gap-2">
              Career Coach
              <Sparkles className="h-4 w-4 text-primary" />
            </h3>
            <p className="text-xs text-muted-foreground">En línea • Listo para ayudarte</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {userMessages.map((message, index) => (
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
                        : 'bg-muted'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    {message.metadata?.score && (
                      <Badge variant="secondary" className="mt-2">
                        Score: {message.metadata.score}/100
                      </Badge>
                    )}
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
                <div className="bg-muted rounded-2xl p-3">
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

      {/* Quick Actions */}
      {userMessages.length <= 1 && (
        <div className="px-4 py-2 border-t">
          <p className="text-xs text-muted-foreground mb-2">Acciones rápidas:</p>
          <div className="flex flex-wrap gap-2">
            {quickActions.map((action) => (
              <Button
                key={action.label}
                size="sm"
                variant="outline"
                onClick={() => setInput(action.label)}
                disabled={isProcessing}
              >
                <span className="mr-1">{action.emoji}</span>
                {action.label}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="p-4 border-t">
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
          Pregunta lo que necesites: CV, entrevistas, cursos, estrategia
        </p>
      </div>
    </Card>
  );
}
