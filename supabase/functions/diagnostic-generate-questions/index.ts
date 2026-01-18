import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { getCorsHeaders, handleCorsPreflightRequest, jsonResponse, errorResponse, validatePayloadSize, sanitizeForAI } from "../_shared/cors.ts";

serve(async (req) => {
  // Handle CORS preflight
  const preflightResponse = handleCorsPreflightRequest(req);
  if (preflightResponse) return preflightResponse;

  try {
    // Check payload size before parsing
    const bodyText = await req.text();
    if (!validatePayloadSize(bodyText, 50000)) { // 50KB limit
      return errorResponse("Payload too large", req, 413);
    }

    const body = JSON.parse(bodyText);

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
      return errorResponse("No autorizado. Por favor inicia sesión.", req, 401);
    }

    const { previousAnswers, currentStep } = body;
    
    if (previousAnswers === undefined || previousAnswers === null) {
      return errorResponse('previousAnswers is required', req, 400);
    }

    // Validate previousAnswers is an object
    if (typeof previousAnswers !== 'object') {
      return errorResponse('previousAnswers must be an object', req, 400);
    }

    // Validate currentStep
    if (currentStep !== undefined && (typeof currentStep !== 'number' || currentStep < 0 || currentStep > 10)) {
      return errorResponse('currentStep must be a number between 0 and 10', req, 400);
    }

    // Sanitize previousAnswers for AI
    const sanitizedAnswers = sanitizeForAI(previousAnswers);

    // Validate and limit array properties
    const validateArray = (arr: unknown, maxLength: number): string[] => {
      if (!Array.isArray(arr)) return [];
      return arr
        .filter((item): item is string => typeof item === 'string')
        .slice(0, maxLength)
        .map(s => s.slice(0, 200));
    };

    const safeAnswers = {
      intereses: validateArray((sanitizedAnswers as Record<string, unknown>)?.intereses, 20),
      objetivos: validateArray((sanitizedAnswers as Record<string, unknown>)?.objetivos, 20),
      herramientas: validateArray((sanitizedAnswers as Record<string, unknown>)?.herramientas, 20),
    };

    const OPENAI_API_KEY = Deno.env.get('API_KEY_CHATGPT');
    if (!OPENAI_API_KEY) {
      console.error('[Internal] API key not configured');
      return errorResponse('Error de configuración del servicio.', req, 500);
    }

    // Build context from previous answers
    let context = '';
    if (safeAnswers.intereses.length > 0) {
      context += `Intereses: ${safeAnswers.intereses.join(', ')}\n`;
    }
    if (safeAnswers.objetivos.length > 0) {
      context += `Objetivos: ${safeAnswers.objetivos.join(', ')}\n`;
    }
    if (safeAnswers.herramientas.length > 0) {
      context += `Herramientas: ${safeAnswers.herramientas.join(', ')}\n`;
    }

    const systemPrompt = `Eres un experto en orientación profesional y diagnóstico de carreras. Tu tarea es generar una pregunta relevante y personalizada para el usuario basándote en sus respuestas previas.

La pregunta debe ser:
- Específica y relevante al contexto del usuario
- Diseñada para obtener información más profunda sobre sus habilidades o preferencias
- Clara y directa
- En español

Genera también 6 sugerencias de respuestas rápidas que sean relevantes a la pregunta.`;

    const step = currentStep ?? 0;
    const userPrompt = step === 0 
      ? "Genera la primera pregunta para conocer las áreas de interés profesional del usuario. Debe ser abierta pero guiada."
      : step === 1
      ? `Basándote en estos intereses del usuario: ${safeAnswers.intereses.join(', ') || 'no especificados'}, genera una pregunta para entender mejor sus objetivos profesionales.`
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
        return errorResponse('Demasiadas solicitudes. Por favor espera unos momentos.', req, 429);
      }
      
      if (statusCode === 402) {
        return errorResponse('Límite de uso alcanzado.', req, 402);
      }

      return errorResponse('Error al generar preguntas. Por favor intenta de nuevo.', req, 500);
    }

    const data = await response.json();

    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall) {
      console.error('[Internal] No tool call in AI response');
      return errorResponse('Error al generar preguntas. Por favor intenta de nuevo.', req, 500);
    }

    const result = JSON.parse(toolCall.function.arguments);

    console.log(`[${user.id}] Diagnostic question generated successfully`);

    return jsonResponse(result, req);

  } catch (error) {
    console.error('[Internal] Error in diagnostic-generate-questions:', error);
    return errorResponse('Error en el servicio. Por favor intenta de nuevo.', req, 500);
  }
});
