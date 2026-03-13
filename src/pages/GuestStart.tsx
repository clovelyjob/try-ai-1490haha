import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';

export default function GuestStart() {
  const navigate = useNavigate();
  const startGuestMode = useAuthStore((state) => state.startGuestMode);

  useEffect(() => {
    startGuestMode();
    // Navigate directly — no splash screen
    navigate('/dashboard', { replace: true });
  }, [startGuestMode, navigate]);

  return null;
}
