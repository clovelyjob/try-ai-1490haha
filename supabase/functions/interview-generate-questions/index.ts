import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { getCorsHeaders, handleCorsPreflightRequest, jsonResponse, errorResponse, validatePayloadSize } from "../_shared/cors.ts";

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

    // Input validation
    if (!body.role || typeof body.role !== 'string') {
      return errorResponse("role (string) is required", req, 400);
    }

    if (body.role.length > 100) {
      return errorResponse("Role too long. Maximum 100 characters allowed.", req, 400);
    }

    if (body.level && (typeof body.level !== 'string' || body.level.length > 50)) {
      return errorResponse("level must be a string with max 50 characters", req, 400);
    }

    if (body.jobDescription && (typeof body.jobDescription !== 'string' || body.jobDescription.length > 5000)) {
      return errorResponse("jobDescription must be a string with max 5000 characters", req, 400);
    }

    if (body.cvContent && (typeof body.cvContent !== 'string' || body.cvContent.length > 10000)) {
      return errorResponse("cvContent must be a string with max 10000 characters", req, 400);
    }

    const count = body.count || 10;
    if (typeof count !== 'number' || count < 1 || count > 20) {
      return errorResponse("count must be a number between 1 and 20", req, 400);
    }

    const { role, level, jobDescription, cvContent } = body;

    const OPENAI_API_KEY = Deno.env.get("API_KEY_CHATGPT");
    if (!OPENAI_API_KEY) {
      console.error("[Internal] API key not configured");
      return errorResponse("Error de configuración del servicio.", req, 500);
    }

    const levelText = level === 'junior' ? 'sin experiencia o junior' : level === 'senior' ? 'senior con mucha experiencia' : 'con algo de experiencia';
    
    const systemPrompt = `Eres un reclutador experto de una empresa Fortune 500 con más de 15 años de experiencia conduciendo entrevistas de trabajo. Conoces las mejores prácticas de entrevistas y las preguntas más efectivas para evaluar candidatos.

Tu objetivo es generar preguntas de entrevista REALISTAS que se hacen en entrevistas reales de trabajo. Las preguntas deben ser:
- Exactamente como las que haría un reclutador real
- Apropiadas para el nivel de experiencia del candidato
- Una mezcla de preguntas conductuales (STAR), técnicas y situacionales
- Específicas para el rol y la industria

IMPORTANTE: Las preguntas deben estar en ESPAÑOL y sonar naturales, como si un entrevistador las estuviera haciendo en persona.`;
    
    let userPrompt = `Genera ${count} preguntas de entrevista para un candidato a un puesto de "${role}" que es ${levelText}.

Las preguntas deben incluir:
1. Preguntas de apertura (ej: "Háblame de ti", "¿Por qué te interesa este puesto?")
2. Preguntas conductuales usando método STAR (ej: "Cuéntame sobre una vez que...", "Dame un ejemplo de cuando...")  
3. Preguntas técnicas específicas del rol
4. Preguntas situacionales (ej: "¿Qué harías si...?", "¿Cómo manejarías...?")
5. Preguntas sobre fortalezas y debilidades
6. Preguntas sobre trabajo en equipo y liderazgo
7. Preguntas sobre resolución de problemas`;

    if (jobDescription) {
      // Truncate job description for safety
      const safeJobDescription = jobDescription.slice(0, 3000);
      userPrompt += `

DESCRIPCIÓN DEL PUESTO (usa esto para personalizar las preguntas):
${safeJobDescription}

Asegúrate de que las preguntas sean MUY específicas para esta descripción del puesto.`;
    }

    if (cvContent) {
      // Truncate CV content for safety
      const safeCvContent = cvContent.slice(0, 5000);
      userPrompt += `

INFORMACIÓN DEL CV DEL CANDIDATO:
${safeCvContent}

Usa esta información para hacer preguntas MÁS PERSONALIZADAS sobre su experiencia.`;
    }

    userPrompt += `

Genera preguntas variadas y progresivamente más desafiantes. Cada pregunta debe tener un consejo útil para que el candidato la responda bien.`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "generate_interview_questions",
              description: "Genera preguntas de entrevista relevantes y realistas",
              parameters: {
                type: "object",
                properties: {
                  questions: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        text: { 
                          type: "string",
                          description: "La pregunta de entrevista completa, tal como la diría un reclutador"
                        },
                        type: { 
                          type: "string", 
                          enum: ["opening", "behavioral", "technical", "situational"],
                          description: "Tipo de pregunta"
                        },
                        difficulty: { 
                          type: "string", 
                          enum: ["easy", "medium", "hard"],
                          description: "Nivel de dificultad"
                        },
                        tip: { 
                          type: "string",
                          description: "Consejo breve y útil para responder bien esta pregunta"
                        }
                      },
                      required: ["text", "type", "difficulty", "tip"]
                    }
                  }
                },
                required: ["questions"]
              }
            }
          }
        ],
        tool_choice: { type: "function", function: { name: "generate_interview_questions" } }
      }),
    });

    if (!response.ok) {
      const statusCode = response.status;
      console.error("[Internal] AI API error:", statusCode);
      
      if (statusCode === 429) {
        return errorResponse("Demasiadas solicitudes. Por favor espera unos momentos.", req, 429);
      }
      if (statusCode === 402) {
        return errorResponse("Límite de uso alcanzado.", req, 402);
      }
      
      return errorResponse("Error al generar preguntas. Por favor intenta de nuevo.", req, 500);
    }

    const data = await response.json();
    const toolCall = data.choices[0].message.tool_calls?.[0];
    
    if (!toolCall) {
      console.error("[Internal] No tool call in AI response");
      return errorResponse("Error al generar preguntas. Por favor intenta de nuevo.", req, 500);
    }

    const result = JSON.parse(toolCall.function.arguments);

    console.log(`[${user.id}] Generated ${result.questions?.length || 0} interview questions for role: ${role}`);

    return jsonResponse(result, req);
  } catch (error) {
    console.error("[Internal] Error in interview-generate-questions:", error);
    return errorResponse("Error en el servicio. Por favor intenta de nuevo.", req, 500);
  }
});
