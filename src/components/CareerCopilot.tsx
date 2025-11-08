import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAuthStore } from '@/store/useAuthStore';
import { Bot, Send, Sparkles, TrendingUp, FileText, Target, Briefcase } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  suggestions?: {
    icon: any;
    label: string;
    action: string;
  }[];
}

export default function CareerCopilot() {
  const user = useAuthStore((state) => state.user);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: `¡Hola ${user?.name || 'ahí'}! 👋 Soy tu Career Copilot. Estoy aquí para ayudarte a planificar tu carrera, optimizar tu CV, prepararte para entrevistas y encontrar las mejores oportunidades. ¿En qué puedo ayudarte hoy?`,
      timestamp: new Date().toISOString(),
      suggestions: [
        { icon: FileText, label: 'Optimizar mi CV', action: '/dashboard/cvs' },
        { icon: Target, label: 'Revisar mis objetivos', action: '/dashboard/goals' },
        { icon: Briefcase, label: 'Buscar oportunidades', action: '/dashboard/opportunities' },
        { icon: TrendingUp, label: 'Ver mi progreso', action: '/dashboard' },
      ],
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: `msg_${Date.now()}_user`,
      role: 'user',
      content: input,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Mock AI response
    setTimeout(() => {
      const responses = [
        'Excelente pregunta. Basado en tu perfil actual, te recomiendo enfocarte en fortalecer tus habilidades técnicas en SQL y Python. ¿Te gustaría que te sugiera algunos cursos?',
        'He analizado tu CV y veo algunas áreas de mejora. Podrías añadir más métricas cuantificables en tu experiencia laboral. ¿Quieres que te ayude a reescribir algunas secciones?',
        'Perfecto. Para ese objetivo, sugiero que primero completes tu perfil profesional y luego practiques entrevistas técnicas. ¿Empezamos?',
        'Encontré 3 oportunidades que se alinean perfectamente con tu perfil. Todas tienen un match superior al 85%. ¿Quieres revisarlas?',
      ];

      const aiMessage: Message = {
        id: `msg_${Date.now()}_ai`,
        role: 'assistant',
        content: responses[Math.floor(Math.random() * responses.length)],
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleSuggestionClick = (action: string) => {
    window.location.href = action;
  };

  return (
    <Card className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
          <Bot className="w-5 h-5 text-primary" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-foreground">Career Copilot</h3>
          <p className="text-xs text-muted-foreground">Tu asistente de carrera con IA</p>
        </div>
        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  message.role === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted'
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                
                {message.suggestions && (
                  <div className="grid grid-cols-2 gap-2 mt-3">
                    {message.suggestions.map((suggestion, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        onClick={() => handleSuggestionClick(suggestion.action)}
                        className="justify-start gap-2 bg-background/50"
                      >
                        <suggestion.icon className="w-3 h-3" />
                        <span className="text-xs">{suggestion.label}</span>
                      </Button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-muted rounded-lg p-3">
                <div className="flex gap-1">
                  <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" />
                  <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: '0.2s' }} />
                  <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: '0.4s' }} />
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="p-4 border-t">
        <div className="flex gap-2">
          <Input
            placeholder="Pregúntame cualquier cosa..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            disabled={isTyping}
          />
          <Button
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            size="icon"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          <Sparkles className="w-3 h-3 inline mr-1" />
          Impulsado por IA
        </p>
      </div>
    </Card>
  );
}
