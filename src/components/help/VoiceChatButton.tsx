import { useState, useCallback } from 'react';
import { useConversation } from '@11labs/react';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Phone, PhoneOff, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const AGENT_ID = 'agent_7401kbztejrbf3bv8jandebyk2r8';

interface VoiceChatButtonProps {
  className?: string;
}

export function VoiceChatButton({ className }: VoiceChatButtonProps) {
  const [isConnecting, setIsConnecting] = useState(false);

  const conversation = useConversation({
    onConnect: () => {
      console.log('Voice chat connected');
      setIsConnecting(false);
    },
    onDisconnect: () => {
      console.log('Voice chat disconnected');
      setIsConnecting(false);
    },
    onError: (error) => {
      console.error('Voice chat error:', error);
      setIsConnecting(false);
    },
    onMessage: (message) => {
      console.log('Voice message:', message);
    },
  });

  const handleStartConversation = useCallback(async () => {
    try {
      setIsConnecting(true);
      // Request microphone permission first
      await navigator.mediaDevices.getUserMedia({ audio: true });
      await conversation.startSession({ agentId: AGENT_ID });
    } catch (error) {
      console.error('Failed to start voice chat:', error);
      setIsConnecting(false);
    }
  }, [conversation]);

  const handleEndConversation = useCallback(async () => {
    try {
      await conversation.endSession();
    } catch (error) {
      console.error('Failed to end voice chat:', error);
    }
  }, [conversation]);

  const isConnected = conversation.status === 'connected';
  const isSpeaking = conversation.isSpeaking;

  if (isConnected) {
    return (
      <div className={cn('flex items-center gap-2', className)}>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-sm">
          <span
            className={cn(
              'w-2 h-2 rounded-full',
              isSpeaking ? 'bg-primary animate-pulse' : 'bg-muted-foreground'
            )}
          />
          <span className="text-muted-foreground">
            {isSpeaking ? 'Hablando...' : 'Escuchando...'}
          </span>
        </div>
        <Button
          variant="destructive"
          size="sm"
          onClick={handleEndConversation}
          className="rounded-full"
        >
          <PhoneOff className="h-4 w-4 mr-1" />
          Terminar
        </Button>
      </div>
    );
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleStartConversation}
      disabled={isConnecting}
      className={cn('rounded-full', className)}
    >
      {isConnecting ? (
        <>
          <Loader2 className="h-4 w-4 mr-1 animate-spin" />
          Conectando...
        </>
      ) : (
        <>
          <Mic className="h-4 w-4 mr-1" />
          Hablar con voz
        </>
      )}
    </Button>
  );
}
