import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';
import { SplashTransition } from '@/components/SplashTransition';

export default function GuestStart() {
  const navigate = useNavigate();
  const startGuestMode = useAuthStore((state) => state.startGuestMode);

  useEffect(() => {
    // Iniciar modo invitado automáticamente
    startGuestMode();
  }, [startGuestMode]);

  return (
    <SplashTransition
      title="¡Bienvenido a Clovely!"
      subtitle="Estamos preparando tu experiencia de demostración..."
      timeoutMs={1800}
      onComplete={() => navigate('/dashboard')}
    />
  );
}
