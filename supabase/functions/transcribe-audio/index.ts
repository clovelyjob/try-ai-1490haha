import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

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
    const { audio, mimeType = 'audio/webm' } = await req.json();

    if (!audio) {
      console.error('No audio data provided');
      return new Response(
        JSON.stringify({ error: 'No audio data provided' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const OPENAI_API_KEY = Deno.env.get('API_KEY_CHATGPT');
    if (!OPENAI_API_KEY) {
      console.error('API_KEY_CHATGPT not configured');
      return new Response(
        JSON.stringify({ error: 'API key not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Sending audio to OpenAI Whisper for transcription, mimeType:', mimeType);

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
      const errorText = await response.text();
      console.error('OpenAI Whisper API error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Límite de solicitudes excedido. Intenta de nuevo en unos segundos.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'Créditos insuficientes. Por favor contacta al administrador.' }),
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

    console.log('Transcription successful, text length:', transcribedText.length);

    return new Response(
      JSON.stringify({ text: transcribedText.trim() }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Transcription failed';
    console.error('Transcription error:', errorMessage);
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
