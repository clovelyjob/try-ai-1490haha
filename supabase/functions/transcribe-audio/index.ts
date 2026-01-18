import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { getCorsHeaders, handleCorsPreflightRequest, jsonResponse, errorResponse } from "../_shared/cors.ts";

serve(async (req) => {
  const preflightResponse = handleCorsPreflightRequest(req);
  if (preflightResponse) return preflightResponse;

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      { global: { headers: { Authorization: req.headers.get("Authorization")! } } }
    );

    const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
    if (authError || !user) {
      return errorResponse("No autorizado. Por favor inicia sesión.", req, 401);
    }

    const { audio, mimeType = 'audio/webm' } = await req.json();

    if (!audio || typeof audio !== 'string') {
      return errorResponse('No audio data provided', req, 400);
    }

    // Validate audio size (max 10MB)
    if (audio.length > 10 * 1024 * 1024 * 1.37) {
      return errorResponse('Audio file too large. Maximum size is 10MB.', req, 413);
    }

    const OPENAI_API_KEY = Deno.env.get('API_KEY_CHATGPT');
    if (!OPENAI_API_KEY) {
      return errorResponse('Error de configuración del servicio.', req, 500);
    }

    const binaryAudio = Uint8Array.from(atob(audio), c => c.charCodeAt(0));
    let fileExtension = 'webm';
    if (mimeType.includes('mp4')) fileExtension = 'mp4';
    else if (mimeType.includes('mp3')) fileExtension = 'mp3';
    else if (mimeType.includes('wav')) fileExtension = 'wav';

    const formData = new FormData();
    formData.append('file', new Blob([binaryAudio], { type: mimeType }), `audio.${fileExtension}`);
    formData.append('model', 'whisper-1');
    formData.append('language', 'es');
    formData.append('response_format', 'text');

    const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${OPENAI_API_KEY}` },
      body: formData,
    });

    if (!response.ok) {
      const statusCode = response.status;
      if (statusCode === 429) return errorResponse('Demasiadas solicitudes.', req, 429);
      if (statusCode === 402) return errorResponse('Límite de uso alcanzado.', req, 402);
      return jsonResponse({ text: '', message: 'No se pudo transcribir el audio.' }, req);
    }

    return jsonResponse({ text: (await response.text()).trim() }, req);
  } catch (err) {
    console.error('[Internal] Transcription error:', err);
    return errorResponse('Error en el servicio.', req, 500);
  }
});
