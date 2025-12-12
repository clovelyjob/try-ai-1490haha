import { useState, useRef, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Video, Square, Play, RotateCcw, Pause, Camera, CameraOff, Loader2 } from 'lucide-react';

interface VideoRecorderProps {
  onRecordingComplete: (blob: Blob) => void;
  disabled?: boolean;
}

export function VideoRecorder({ onRecordingComplete, disabled }: VideoRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [hasRecording, setHasRecording] = useState(false);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [cameraEnabled, setCameraEnabled] = useState(false);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);

  const videoRef = useRef<HTMLVideoElement>(null);
  const previewRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const enableCamera = useCallback(async () => {
    try {
      setError(null);
      setIsCameraReady(false);
      
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: true
      });
      
      streamRef.current = stream;
      setCameraEnabled(true);
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play().then(() => {
            setIsCameraReady(true);
          }).catch((err) => {
            console.error('Video play error:', err);
            setIsCameraReady(true);
          });
        };
      }
    } catch (err) {
      console.error('Camera access error:', err);
      setError('No se pudo acceder a la cámara. Verifica los permisos.');
    }
  }, []);

  const disableCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setCameraEnabled(false);
    setIsCameraReady(false);
    setIsRecording(false);
    setIsPaused(false);
  }, []);

  const startRecording = useCallback(() => {
    if (!streamRef.current) return;

    chunksRef.current = [];
    setRecordingTime(0);
    
    const mediaRecorder = new MediaRecorder(streamRef.current, {
      mimeType: 'video/webm;codecs=vp9,opus'
    });

    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        chunksRef.current.push(event.data);
      }
    };

    mediaRecorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: 'video/webm' });
      setRecordedBlob(blob);
      setHasRecording(true);
      
      // Create preview URL
      if (previewRef.current) {
        previewRef.current.src = URL.createObjectURL(blob);
      }
    };

    mediaRecorderRef.current = mediaRecorder;
    mediaRecorder.start(1000); // Collect data every second
    setIsRecording(true);

    // Start timer
    timerRef.current = setInterval(() => {
      setRecordingTime(prev => prev + 1);
    }, 1000);
  }, []);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
    setIsPaused(false);
    
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  }, []);

  const pauseRecording = useCallback(() => {
    if (mediaRecorderRef.current) {
      if (isPaused) {
        mediaRecorderRef.current.resume();
        timerRef.current = setInterval(() => {
          setRecordingTime(prev => prev + 1);
        }, 1000);
      } else {
        mediaRecorderRef.current.pause();
        if (timerRef.current) {
          clearInterval(timerRef.current);
        }
      }
      setIsPaused(!isPaused);
    }
  }, [isPaused]);

  const resetRecording = useCallback(() => {
    setHasRecording(false);
    setRecordedBlob(null);
    setRecordingTime(0);
    if (previewRef.current) {
      previewRef.current.src = '';
    }
  }, []);

  const submitRecording = useCallback(() => {
    if (recordedBlob) {
      onRecordingComplete(recordedBlob);
    }
  }, [recordedBlob, onRecordingComplete]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      disableCamera();
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [disableCamera]);

  return (
    <Card className="p-4 space-y-4 rounded-xl border-2 border-primary/10">
      {/* Camera view / Preview */}
      <div className="relative aspect-video bg-muted rounded-xl overflow-hidden">
        {!cameraEnabled && !hasRecording && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
            <div className="p-4 rounded-full bg-primary/10">
              <Camera className="w-8 h-8 text-primary" />
            </div>
            <p className="text-sm text-muted-foreground text-center px-4">
              Activa tu cámara para grabar tu respuesta
            </p>
            <Button onClick={enableCamera} variant="outline" disabled={disabled}>
              <Camera className="w-4 h-4 mr-2" />
              Activar Cámara
            </Button>
          </div>
        )}

        {cameraEnabled && !hasRecording && (
          <>
            {/* Loading overlay while camera initializes */}
            {!isCameraReady && (
              <div className="absolute inset-0 flex items-center justify-center bg-muted z-10">
                <div className="flex flex-col items-center gap-3">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                  <p className="text-sm text-muted-foreground">Iniciando cámara...</p>
                </div>
              </div>
            )}
            <video
              ref={videoRef}
              autoPlay
              muted
              playsInline
              className="w-full h-full object-cover"
              style={{ transform: 'scaleX(-1)' }}
            />
          </>
        )}

        {hasRecording && (
          <video
            ref={previewRef}
            controls
            playsInline
            className="w-full h-full object-cover"
          />
        )}

        {/* Recording indicator */}
        {isRecording && (
          <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-500 text-white text-sm font-medium">
            <span className={`w-2 h-2 rounded-full bg-white ${isPaused ? '' : 'animate-pulse'}`} />
            {isPaused ? 'Pausado' : 'Grabando'} • {formatTime(recordingTime)}
          </div>
        )}
      </div>

      {/* Error message */}
      {error && (
        <p className="text-sm text-destructive text-center">{error}</p>
      )}

      {/* Controls */}
      <div className="flex flex-wrap gap-2 justify-center">
        {cameraEnabled && !hasRecording && (
          <>
            {!isRecording ? (
              <Button onClick={startRecording} variant="premium" disabled={disabled || !isCameraReady}>
                <Video className="w-4 h-4 mr-2" />
                Iniciar Grabación
              </Button>
            ) : (
              <>
                <Button onClick={pauseRecording} variant="outline" size="icon">
                  {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
                </Button>
                <Button onClick={stopRecording} variant="destructive">
                  <Square className="w-4 h-4 mr-2" />
                  Detener
                </Button>
              </>
            )}
            <Button onClick={disableCamera} variant="ghost" size="icon">
              <CameraOff className="w-4 h-4" />
            </Button>
          </>
        )}

        {hasRecording && (
          <>
            <Button onClick={resetRecording} variant="outline" disabled={disabled}>
              <RotateCcw className="w-4 h-4 mr-2" />
              Grabar de nuevo
            </Button>
            <Button onClick={submitRecording} variant="premium" disabled={disabled}>
              Usar esta grabación
            </Button>
          </>
        )}
      </div>

      {/* Tips */}
      <p className="text-xs text-muted-foreground text-center">
        💡 Tip: Mira directamente a la cámara, habla claro y con confianza
      </p>
    </Card>
  );
}
