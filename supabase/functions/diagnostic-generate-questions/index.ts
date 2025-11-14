import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { previousAnswers, currentStep } = await req.json();
    
    if (!previousAnswers) {
      throw new Error('previousAnswers is required');
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
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

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
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
      const errorText = await response.text();
      console.error('AI Gateway error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again in a few moments.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'Insufficient credits. Please add credits to continue.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const data = await response.json();
    console.log('AI Response:', JSON.stringify(data, null, 2));

    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall) {
      throw new Error('No tool call in AI response');
    }

    const result = JSON.parse(toolCall.function.arguments);

    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    console.error('Error in diagnostic-generate-questions:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});