import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Authenticate user
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      {
        global: {
          headers: { Authorization: req.headers.get("Authorization")! },
        },
      }
    );

    const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: "No autorizado. Por favor inicia sesión." }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { audio, mimeType = 'audio/webm' } = await req.json();

    if (!audio) {
      return new Response(
        JSON.stringify({ error: 'No audio data provided' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate audio size (max 10MB)
    const MAX_AUDIO_SIZE = 10 * 1024 * 1024;
    const audioBytes = new TextEncoder().encode(audio).length;

    if (audioBytes > MAX_AUDIO_SIZE) {
      return new Response(
        JSON.stringify({ error: 'Audio file too large. Maximum size is 10MB.' }),
        { status: 413, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const OPENAI_API_KEY = Deno.env.get('API_KEY_CHATGPT');
    if (!OPENAI_API_KEY) {
      console.error('[Internal] API key not configured');
      return new Response(
        JSON.stringify({ error: 'Error de configuración del servicio.' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`[${user.id}] Transcribing audio, mimeType: ${mimeType}`);

    // Convert base64 to binary for Whisper API
    const binaryAudio = Uint8Array.from(atob(audio), c => c.charCodeAt(0));
    
    // Determine file extension based on mimeType
    let fileExtension = 'webm';
    if (mimeType.includes('mp4')) fileExtension = 'mp4';
    else if (mimeType.includes('mp3')) fileExtension = 'mp3';
    else if (mimeType.includes('wav')) fileExtension = 'wav';
    else if (mimeType.includes('m4a')) fileExtension = 'm4a';

    // Create form data for Whisper API
    const formData = new FormData();
    const blob = new Blob([binaryAudio], { type: mimeType });
    formData.append('file', blob, `audio.${fileExtension}`);
    formData.append('model', 'whisper-1');
    formData.append('language', 'es'); // Spanish language
    formData.append('response_format', 'text');

    const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const statusCode = response.status;
      console.error('[Internal] AI API error:', statusCode);
      
      if (statusCode === 429) {
        return new Response(
          JSON.stringify({ error: 'Demasiadas solicitudes. Por favor espera unos momentos.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      if (statusCode === 402) {
        return new Response(
          JSON.stringify({ error: 'Límite de uso alcanzado.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      return new Response(
        JSON.stringify({ 
          text: '',
          message: 'No se pudo transcribir el audio. Por favor escribe tu respuesta manualmente.'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const transcribedText = await response.text();

    console.log(`[${user.id}] Transcription successful, text length: ${transcribedText.length}`);

    return new Response(
      JSON.stringify({ text: transcribedText.trim() }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (err: unknown) {
    console.error('[Internal] Transcription error:', err);
    return new Response(
      JSON.stringify({ error: 'Error en el servicio. Por favor intenta de nuevo.' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
