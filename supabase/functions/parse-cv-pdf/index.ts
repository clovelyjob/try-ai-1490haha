import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
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

    const { pdfBase64, fileName } = await req.json();
    
    if (!pdfBase64) {
      return new Response(
        JSON.stringify({ error: 'No PDF provided' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
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

    console.log(`[${user.id}] Processing PDF: ${fileName || 'cv.pdf'}`);

    const systemPrompt = `Eres un extractor de CVs profesional. Tu tarea es extraer TODA la información relevante del CV proporcionado y devolverla en formato de texto estructurado.

Extrae la siguiente información si está disponible:
- Nombre completo
- Título profesional
- Resumen/Perfil profesional
- Experiencia laboral (empresa, cargo, fechas, responsabilidades y logros)
- Educación (institución, título, campo de estudio, fechas)
- Habilidades técnicas y blandas
- Certificaciones
- Idiomas
- Proyectos destacados

Presenta la información de forma clara y estructurada. Si alguna sección no está en el CV, simplemente omítela.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: 'Extrae toda la información de este CV de forma estructurada:'
              },
              {
                type: 'image_url',
                image_url: {
                  url: `data:application/pdf;base64,${pdfBase64}`,
                  detail: 'high'
                }
              }
            ]
          }
        ],
        max_tokens: 4000
      }),
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
      
      // Fallback response
      console.log(`[${user.id}] PDF processing failed, returning fallback`);
      return new Response(
        JSON.stringify({ 
          cvContent: 'No se pudo procesar el PDF. Por favor, copia y pega el contenido de tu CV manualmente.',
          error: 'Error al procesar el documento' 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const result = await response.json();
    const extractedText = result.choices?.[0]?.message?.content || '';

    console.log(`[${user.id}] Successfully extracted CV content`);

    return new Response(
      JSON.stringify({ cvContent: extractedText }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (err) {
    console.error('[Internal] Error parsing PDF:', err);
    return new Response(
      JSON.stringify({ error: 'Error en el servicio. Por favor intenta de nuevo.' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
