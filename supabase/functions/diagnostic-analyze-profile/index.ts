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

    const { preferences } = body;
    
    if (!preferences || typeof preferences !== 'object') {
      return errorResponse('preferences object is required', req, 400);
    }

    // Validate and sanitize preferences
    const validateArray = (arr: unknown, maxLength: number): string[] => {
      if (!Array.isArray(arr)) return [];
      return arr
        .filter((item): item is string => typeof item === 'string')
        .slice(0, maxLength)
        .map(s => s.slice(0, 200));
    };

    const safePreferences = {
      intereses: validateArray(preferences.intereses, 20),
      objetivos: validateArray(preferences.objetivos, 20),
      herramientas: validateArray(preferences.herramientas, 20),
      experiencia: typeof preferences.experiencia === 'string' ? preferences.experiencia.slice(0, 50) : undefined,
    };

    const OPENAI_API_KEY = Deno.env.get('API_KEY_CHATGPT');
    if (!OPENAI_API_KEY) {
      console.error('[Internal] API key not configured');
      return errorResponse('Error de configuración del servicio.', req, 500);
    }

    const systemPrompt = `Eres un experto en orientación profesional con años de experiencia ayudando a personas a identificar sus roles ideales en tecnología y negocios.

Tu tarea es analizar el perfil del usuario y recomendar los 3 roles profesionales más adecuados.

Roles disponibles:
- ui_ux_designer: Diseñador UI/UX
- frontend_developer: Desarrollador Frontend
- backend_developer: Desarrollador Backend
- fullstack_developer: Desarrollador Fullstack
- mobile_developer: Desarrollador Mobile
- data_analyst: Analista de Datos
- data_scientist: Científico de Datos
- product_manager: Product Manager
- project_manager: Project Manager
- devops_engineer: Ingeniero DevOps
- qa_engineer: Ingeniero QA
- business_analyst: Analista de Negocios
- digital_marketer: Marketing Digital
- content_creator: Creador de Contenido
- scrum_master: Scrum Master

Analiza cuidadosamente:
1. Los intereses declarados
2. Los objetivos profesionales
3. Las herramientas que domina o le interesan
4. La experiencia profesional si está disponible

Para cada rol recomendado, proporciona:
- Un nivel de confianza (0-100) basado en qué tan bien se alinea el perfil
- 2-3 razones específicas y personalizadas del por qué es una buena opción`;

    const userPrompt = `Analiza este perfil profesional:

Intereses: ${safePreferences.intereses.join(', ') || 'No especificados'}
Objetivos: ${safePreferences.objetivos.join(', ') || 'No especificados'}
Herramientas: ${safePreferences.herramientas.join(', ') || 'No especificadas'}
Nivel de experiencia: ${safePreferences.experiencia || 'No especificado'}

Recomienda los 3 roles más adecuados con confianza y razones específicas.`;

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
              name: 'analyze_profile',
              description: 'Analyze user profile and recommend professional roles',
              parameters: {
                type: 'object',
                properties: {
                  recommendations: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        role: {
                          type: 'string',
                          enum: [
                            'ui_ux_designer', 'frontend_developer', 'backend_developer',
                            'fullstack_developer', 'mobile_developer', 'data_analyst',
                            'data_scientist', 'product_manager', 'project_manager',
                            'devops_engineer', 'qa_engineer', 'business_analyst',
                            'digital_marketer', 'content_creator', 'scrum_master'
                          ]
                        },
                        confidence: {
                          type: 'number',
                          minimum: 0,
                          maximum: 100
                        },
                        reasons: {
                          type: 'array',
                          items: { type: 'string' },
                          minItems: 2,
                          maxItems: 3
                        }
                      },
                      required: ['role', 'confidence', 'reasons']
                    },
                    minItems: 3,
                    maxItems: 3
                  }
                },
                required: ['recommendations'],
                additionalProperties: false
              }
            }
          }
        ],
        tool_choice: { type: 'function', function: { name: 'analyze_profile' } }
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

      return errorResponse('Error al analizar el perfil. Por favor intenta de nuevo.', req, 500);
    }

    const data = await response.json();

    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall) {
      console.error('[Internal] No tool call in AI response');
      return errorResponse('Error al analizar el perfil. Por favor intenta de nuevo.', req, 500);
    }

    const result = JSON.parse(toolCall.function.arguments);

    console.log(`[${user.id}] Profile analyzed successfully`);

    return jsonResponse(result, req);

  } catch (error) {
    console.error('[Internal] Error in diagnostic-analyze-profile:', error);
    return errorResponse('Error en el servicio. Por favor intenta de nuevo.', req, 500);
  }
});
