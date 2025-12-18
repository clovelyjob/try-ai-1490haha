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

    const { previousAnswers, currentStep } = await req.json();
    
    if (!previousAnswers) {
      return new Response(
        JSON.stringify({ error: 'previousAnswers is required' }),
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

    // Construir el contexto de las respuestas previas
    let context = '';
    if (previousAnswers.intereses && previousAnswers.intereses.length > 0) {
      context += `Intereses: ${previousAnswers.intereses.join(', ')}\n`;
    }
    if (previousAnswers.objetivos && previousAnswers.objetivos.length > 0) {
      context += `Objetivos: ${previousAnswers.objetivos.join(', ')}\n`;
    }
    if (previousAnswers.herramientas && previousAnswers.herramientas.length > 0) {
      context += `Herramientas: ${previousAnswers.herramientas.join(', ')}\n`;
    }

    const systemPrompt = `Eres un experto en orientación profesional y diagnóstico de carreras. Tu tarea es generar una pregunta relevante y personalizada para el usuario basándote en sus respuestas previas.

La pregunta debe ser:
- Específica y relevante al contexto del usuario
- Diseñada para obtener información más profunda sobre sus habilidades o preferencias
- Clara y directa
- En español

Genera también 6 sugerencias de respuestas rápidas que sean relevantes a la pregunta.`;

    const userPrompt = currentStep === 0 
      ? "Genera la primera pregunta para conocer las áreas de interés profesional del usuario. Debe ser abierta pero guiada."
      : currentStep === 1
      ? `Basándote en estos intereses del usuario: ${previousAnswers.intereses?.join(', ') || 'no especificados'}, genera una pregunta para entender mejor sus objetivos profesionales.`
      : `Basándote en esta información del usuario:\n${context}\nGenera una pregunta final para entender qué herramientas, tecnologías o metodologías le interesan o domina.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        tools: [
          {
            type: 'function',
            function: {
              name: 'generate_question',
              description: 'Generate a professional diagnostic question with suggestions',
              parameters: {
                type: 'object',
                properties: {
                  question: {
                    type: 'string',
                    description: 'The main question to ask the user'
                  },
                  description: {
                    type: 'string',
                    description: 'A brief description or context for the question'
                  },
                  suggestions: {
                    type: 'array',
                    items: { type: 'string' },
                    description: 'Array of 6 suggested answers',
                    minItems: 6,
                    maxItems: 6
                  }
                },
                required: ['question', 'description', 'suggestions'],
                additionalProperties: false
              }
            }
          }
        ],
        tool_choice: { type: 'function', function: { name: 'generate_question' } }
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

      return new Response(
        JSON.stringify({ error: 'Error al generar preguntas. Por favor intenta de nuevo.' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();

    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall) {
      console.error('[Internal] No tool call in AI response');
      return new Response(
        JSON.stringify({ error: 'Error al generar preguntas. Por favor intenta de nuevo.' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const result = JSON.parse(toolCall.function.arguments);

    console.log(`[${user.id}] Diagnostic question generated successfully`);

    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('[Internal] Error in diagnostic-generate-questions:', error);
    return new Response(
      JSON.stringify({ error: 'Error en el servicio. Por favor intenta de nuevo.' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
