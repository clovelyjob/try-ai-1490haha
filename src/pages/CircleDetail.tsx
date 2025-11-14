import { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useCircleStore } from '@/store/useCircleStore';
import { useAuthStore } from '@/store/useAuthStore';
import { ArrowLeft, Send, Users, Bot, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

export default function CircleDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { getCircle, sendMessage, leaveCircle } = useCircleStore();
  const [message, setMessage] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  const circle = getCircle(id || '');

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [circle?.messages]);

  if (!circle) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="p-12">
          <div className="text-center">
            <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-bold mb-2">Círculo no encontrado</h3>
            <Button onClick={() => navigate('/dashboard/circles')}>Explorar Círculos</Button>
          </div>
        </Card>
      </div>
    );
  }

  const handleSendMessage = () => {
    if (!message.trim() || !user) return;

    sendMessage(circle.id, {
      userId: user.id,
      userName: user.name,
      content: message,
    });

    setMessage('');

    // Simulate bot response if bot is enabled
    if (circle.hasBot) {
      setTimeout(() => {
        sendMessage(circle.id, {
          userId: 'bot',
          userName: 'Clovely Bot',
          content: `Entiendo tu mensaje. Como ${circle.botContext}, puedo ayudarte con más detalles sobre este tema.`,
          isBot: true,
        });
      }, 1500);
    }
  };

  const handleLeaveCircle = () => {
    leaveCircle(circle.id);
    toast.success('Has salido del círculo');
    navigate('/dashboard/circles');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Button
        variant="ghost"
        onClick={() => navigate('/dashboard/circles')}
        className="mb-4"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Volver a Círculos
      </Button>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Chat Area */}
        <Card className="lg:col-span-2">
          <CardHeader className="border-b">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={circle.logo} alt={circle.name} />
                  <AvatarFallback>{circle.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-lg">{circle.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {circle.memberCount} miembros
                  </p>
                </div>
              </div>
              {circle.hasBot && (
                <Badge variant="secondary" className="gap-1">
                  <Bot className="h-3 w-3" />
                  Bot Activo
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[500px] p-4" ref={scrollRef}>
              <div className="space-y-4">
                {circle.messages.length === 0 ? (
                  <div className="text-center py-12">
                    <Sparkles className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">
                      Sé el primero en iniciar la conversación
                    </p>
                  </div>
                ) : (
                  circle.messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex gap-3 ${
                        msg.userId === user?.id ? 'flex-row-reverse' : ''
                      }`}
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>
                          {msg.isBot ? '🤖' : msg.userName.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div
                        className={`flex-1 max-w-md ${
                          msg.userId === user?.id ? 'text-right' : ''
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <p className="text-sm font-semibold">{msg.userName}</p>
                          {msg.isBot && (
                            <Badge variant="secondary" className="text-xs">
                              Bot
                            </Badge>
                          )}
                        </div>
                        <div
                          className={`p-3 rounded-lg ${
                            msg.userId === user?.id
                              ? 'bg-primary text-primary-foreground'
                              : msg.isBot
                              ? 'bg-secondary/50'
                              : 'bg-muted'
                          }`}
                        >
                          <p className="text-sm">{msg.content}</p>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(msg.timestamp).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>
            <div className="border-t p-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Escribe un mensaje..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                />
                <Button onClick={handleSendMessage} disabled={!message.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Sobre este círculo</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                {circle.description}
              </p>
              <div className="flex items-center gap-2">
                <Badge>{circle.category}</Badge>
                <Badge variant="secondary">
                  {circle.memberCount} miembros
                </Badge>
              </div>
              {circle.hasBot && (
                <div className="p-3 bg-primary/10 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Bot className="h-4 w-4 text-primary" />
                    <p className="text-sm font-semibold">Bot Inteligente</p>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {circle.botContext}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Acciones</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full" onClick={handleLeaveCircle}>
                Salir del Círculo
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
