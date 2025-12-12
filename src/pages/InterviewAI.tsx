import { useState, useEffect, useRef } from "react";
import { useTranslation } from 'react-i18next';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/useAuthStore";
import { Mic, Send, Bot, User, Briefcase, GraduationCap, FileText, Video, MessageSquare, Loader2, Phone, PhoneOff } from "lucide-react";
import { cn } from "@/lib/utils";

// ElevenLabs ConvAI widget declaration
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'elevenlabs-convai': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & { 'agent-id': string },
        HTMLElement
      >;
    }
  }
}

const INTERVIEWER_AGENT_ID = 'agent_0401kc7ye4zyeecsx8v92kg4cv46';

type ChatMessage = {
  id: string;
  role: 'assistant' | 'user';
  content: string;
  timestamp: Date;
};

type InterviewData = {
  position: string;
  experienceLevel: string;
  jobDescription: string;
  cvHighlights: string;
  responseMode: 'text' | 'video';
};

type Step = 'position' | 'experience' | 'jobDescription' | 'cv' | 'responseMode' | 'confirm' | 'interview' | 'complete';

const stepOrder: Step[] = ['position', 'experience', 'jobDescription', 'cv', 'responseMode', 'confirm', 'interview', 'complete'];

export default function InterviewAI() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [currentStep, setCurrentStep] = useState<Step>('position');
  const [isTyping, setIsTyping] = useState(false);
  const [interviewData, setInterviewData] = useState<InterviewData>({
    position: '',
    experienceLevel: '',
    jobDescription: '',
    cvHighlights: '',
    responseMode: 'text'
  });
  const [interviewActive, setInterviewActive] = useState(false);

  // Initial greeting
  useEffect(() => {
    const greeting: ChatMessage = {
      id: '1',
      role: 'assistant',
      content: `¡Hola${user?.name ? ` ${user.name}` : ''}! 👋 Soy tu asistente de Clovely y estoy aquí para preparar tu entrevista de práctica.\n\nPrimero, cuéntame: **¿A qué puesto estás aplicando?**`,
      timestamp: new Date()
    };
    setMessages([greeting]);
  }, [user]);

  // Auto-scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const addMessage = (role: 'assistant' | 'user', content: string) => {
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      role,
      content,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const simulateTyping = async (message: string, delay = 1000) => {
    setIsTyping(true);
    await new Promise(resolve => setTimeout(resolve, delay));
    setIsTyping(false);
    addMessage('assistant', message);
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() && currentStep !== 'jobDescription' && currentStep !== 'cv') return;
    
    const userInput = inputValue.trim();
    if (userInput) {
      addMessage('user', userInput);
    }
    setInputValue("");

    // Process based on current step
    switch (currentStep) {
      case 'position':
        setInterviewData(prev => ({ ...prev, position: userInput }));
        setCurrentStep('experience');
        await simulateTyping(`Perfecto, **${userInput}**. Excelente elección. 🎯\n\nAhora dime: **¿Cuál es tu nivel de experiencia?**\n\n• Junior (0-2 años)\n• Mid-level (2-5 años)\n• Senior (5+ años)`);
        break;

      case 'experience':
        const level = userInput.toLowerCase();
        let normalizedLevel = 'mid';
        if (level.includes('junior') || level.includes('0') || level.includes('1') || level.includes('2')) {
          normalizedLevel = 'junior';
        } else if (level.includes('senior') || level.includes('5') || level.includes('experto')) {
          normalizedLevel = 'senior';
        }
        setInterviewData(prev => ({ ...prev, experienceLevel: normalizedLevel }));
        setCurrentStep('jobDescription');
        await simulateTyping(`Entendido, nivel **${normalizedLevel}**. ✅\n\n¿Tienes una **descripción del puesto** que quieras compartir? Esto ayudará a personalizar las preguntas.\n\n_Puedes pegarla aquí o escribir "omitir" si prefieres continuar sin ella._`);
        break;

      case 'jobDescription':
        const skipJD = userInput.toLowerCase() === 'omitir' || userInput.toLowerCase() === 'skip' || !userInput;
        setInterviewData(prev => ({ ...prev, jobDescription: skipJD ? '' : userInput }));
        setCurrentStep('cv');
        await simulateTyping(skipJD 
          ? `Sin problema. Continuamos sin descripción. 👍\n\n¿Hay algún **logro clave o experiencia relevante** que quieras que el entrevistador conozca?\n\n_Puedes escribir "omitir" si prefieres continuar._`
          : `Excelente, he guardado la descripción del puesto. 📋\n\n¿Hay algún **logro clave o experiencia relevante** que quieras que el entrevistador conozca?\n\n_Puedes escribir "omitir" si prefieres continuar._`
        );
        break;

      case 'cv':
        const skipCV = userInput.toLowerCase() === 'omitir' || userInput.toLowerCase() === 'skip' || !userInput;
        setInterviewData(prev => ({ ...prev, cvHighlights: skipCV ? '' : userInput }));
        setCurrentStep('responseMode');
        await simulateTyping(`${skipCV ? 'Perfecto' : 'Anotado'}. ✨\n\nÚltima pregunta: **¿Cómo prefieres responder en la entrevista?**\n\n🎤 **Voz** - Responderás hablando (recomendado)\n✍️ **Texto** - Responderás escribiendo`);
        break;

      case 'responseMode':
        const isVoice = userInput.toLowerCase().includes('voz') || userInput.toLowerCase().includes('habla') || userInput.toLowerCase().includes('voice');
        setInterviewData(prev => ({ ...prev, responseMode: isVoice ? 'video' : 'text' }));
        setCurrentStep('confirm');
        
        // Show confirmation with all data
        const data = { ...interviewData, responseMode: isVoice ? 'video' as const : 'text' as const };
        await simulateTyping(
          `¡Perfecto! Ya tengo toda la información necesaria. 🎉\n\n**Resumen de tu entrevista:**\n\n` +
          `📌 **Puesto:** ${data.position}\n` +
          `📊 **Nivel:** ${data.experienceLevel}\n` +
          `📝 **Descripción:** ${data.jobDescription || 'No especificada'}\n` +
          `🏆 **Logros:** ${data.cvHighlights || 'No especificados'}\n` +
          `🎤 **Modo:** ${isVoice ? 'Voz' : 'Texto'}\n\n` +
          `**¿Estás listo/a para comenzar la entrevista?** Escribe "sí" o "comenzar".`
        );
        break;

      case 'confirm':
        const confirmed = userInput.toLowerCase().includes('sí') || userInput.toLowerCase().includes('si') || 
                         userInput.toLowerCase().includes('comenzar') || userInput.toLowerCase().includes('start') ||
                         userInput.toLowerCase().includes('yes') || userInput.toLowerCase().includes('listo');
        
        if (confirmed) {
          setCurrentStep('interview');
          await simulateTyping(
            `Genial. Voy a compartir esta información con tu entrevistador. 🎯\n\n` +
            `**[INFORMACIÓN PARA EL ENTREVISTADOR]**\n\n` +
            `Puesto: ${interviewData.position}\n` +
            `Experiencia: ${interviewData.experienceLevel}\n` +
            `Descripción del puesto: ${interviewData.jobDescription || 'No especificada'}\n` +
            `CV / Logros: ${interviewData.cvHighlights || 'No especificados'}\n` +
            `Modo de respuesta: ${interviewData.responseMode === 'video' ? 'voz' : 'texto'}\n\n` +
            `**[FIN]**\n\n` +
            `A partir de este momento, tu entrevistador de Clovely comenzará a hablarte. Él te hará preguntas como si fuera una entrevista real. **Responde con naturalidad.**\n\n` +
            `_Haz clic en el botón de llamada para iniciar la entrevista con voz._`
          );
          setInterviewActive(true);
        } else {
          await simulateTyping(`Entendido. ¿Hay algo que quieras cambiar? Puedo ajustar cualquier dato. O escribe "sí" cuando estés listo/a para comenzar.`);
        }
        break;

      case 'interview':
        // During interview, just acknowledge but don't interrupt
        await simulateTyping(`Tu entrevistador responderá al final de la simulación. Continúa cuando estés listo/a. 🎯`);
        break;

      case 'complete':
        // Post-interview
        break;
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const endInterview = async () => {
    setInterviewActive(false);
    setCurrentStep('complete');
    await simulateTyping(
      `Perfecto. La entrevista ha terminado. Ahora estoy procesando tu feedback… 🔄\n\n` +
      `Listo. ¿Qué te gustaría hacer ahora?\n\n` +
      `• **Evaluación profunda** - Análisis detallado de tus respuestas\n` +
      `• **Repetir entrevista** - Practicar de nuevo\n` +
      `• **Revisar CV** - Ir al constructor de CV`,
      1500
    );
  };

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'evaluation':
        navigate('/dashboard/interviews/results');
        break;
      case 'repeat':
        setCurrentStep('position');
        setInterviewData({
          position: '',
          experienceLevel: '',
          jobDescription: '',
          cvHighlights: '',
          responseMode: 'text'
        });
        setMessages([]);
        const greeting: ChatMessage = {
          id: '1',
          role: 'assistant',
          content: `¡Perfecto! Empecemos de nuevo. 🔄\n\n**¿A qué puesto estás aplicando?**`,
          timestamp: new Date()
        };
        setMessages([greeting]);
        break;
      case 'cv':
        navigate('/dashboard/cvs');
        break;
    }
  };

  return (
    <div className="container max-w-4xl py-4 sm:py-8 h-[calc(100vh-8rem)] flex flex-col">
      {/* Header */}
      <Card className="p-4 mb-4 rounded-2xl shadow-clovely-lg border-2 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <Bot className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="font-bold text-lg">Entrevista con IA</h1>
            <p className="text-sm text-muted-foreground">
              {interviewActive ? '🎙️ Entrevista en curso' : 'Preparación de entrevista'}
            </p>
          </div>
        </div>
        
        {interviewActive && (
          <Button 
            variant="destructive" 
            size="sm"
            onClick={endInterview}
            className="gap-2"
          >
            <PhoneOff className="w-4 h-4" />
            Finalizar
          </Button>
        )}
      </Card>

      {/* Chat Area */}
      <Card className="flex-1 p-4 rounded-2xl shadow-clovely-lg border-2 overflow-hidden flex flex-col">
        <div className="flex-1 overflow-y-auto space-y-4 pr-2">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex gap-3",
                message.role === 'user' ? "flex-row-reverse" : ""
              )}
            >
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                message.role === 'assistant' 
                  ? "bg-primary/10" 
                  : "bg-secondary"
              )}>
                {message.role === 'assistant' 
                  ? <Bot className="w-4 h-4 text-primary" />
                  : <User className="w-4 h-4" />
                }
              </div>
              <div className={cn(
                "max-w-[80%] rounded-2xl px-4 py-3",
                message.role === 'assistant' 
                  ? "bg-muted/50" 
                  : "bg-primary text-primary-foreground"
              )}>
                <p className="text-sm whitespace-pre-wrap leading-relaxed">
                  {message.content.split(/(\*\*.*?\*\*)/g).map((part, i) => 
                    part.startsWith('**') && part.endsWith('**') 
                      ? <strong key={i}>{part.slice(2, -2)}</strong>
                      : part.split(/(_.*?_)/g).map((subpart, j) =>
                          subpart.startsWith('_') && subpart.endsWith('_')
                            ? <em key={j} className="opacity-80">{subpart.slice(1, -1)}</em>
                            : subpart
                        )
                  )}
                </p>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <Bot className="w-4 h-4 text-primary" />
              </div>
              <div className="bg-muted/50 rounded-2xl px-4 py-3">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-primary/40 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 bg-primary/40 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 bg-primary/40 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
          
          <div ref={chatEndRef} />
        </div>

        {/* ElevenLabs Voice Widget - Only show when interview is active */}
        {interviewActive && (
          <div className="py-4 border-t border-b my-4">
            <div className="flex items-center justify-center gap-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="w-4 h-4 text-green-500" />
                <span>Entrevistador de voz activo</span>
              </div>
              <elevenlabs-convai agent-id={INTERVIEWER_AGENT_ID} />
            </div>
          </div>
        )}

        {/* Quick Actions - Show after interview */}
        {currentStep === 'complete' && (
          <div className="flex flex-wrap gap-2 py-4 border-t">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => handleQuickAction('evaluation')}
              className="gap-2"
            >
              <FileText className="w-4 h-4" />
              Evaluación profunda
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => handleQuickAction('repeat')}
              className="gap-2"
            >
              <Mic className="w-4 h-4" />
              Repetir entrevista
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => handleQuickAction('cv')}
              className="gap-2"
            >
              <Briefcase className="w-4 h-4" />
              Revisar CV
            </Button>
          </div>
        )}

        {/* Input Area */}
        {currentStep !== 'complete' && (
          <div className="pt-4 border-t flex gap-2">
            <Input
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={
                currentStep === 'interview' 
                  ? "Escribe si necesitas ayuda..." 
                  : "Escribe tu respuesta..."
              }
              disabled={isTyping}
              className="flex-1 rounded-xl"
            />
            <Button 
              onClick={handleSendMessage}
              disabled={isTyping || (!inputValue.trim() && currentStep !== 'jobDescription' && currentStep !== 'cv')}
              size="icon"
              className="rounded-xl shrink-0"
            >
              {isTyping ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
}
