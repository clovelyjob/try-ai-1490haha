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
    if (!body.question || typeof body.question !== 'string') {
      return errorResponse("question (string) is required", req, 400);
    }

    if (!body.answer || typeof body.answer !== 'string') {
      return errorResponse("answer (string) is required", req, 400);
    }

    if (body.question.length > 1000) {
      return errorResponse("Question too long. Maximum 1000 characters allowed.", req, 400);
    }

    if (body.answer.length > 5000) {
      return errorResponse("Answer too long. Maximum 5000 characters allowed.", req, 400);
    }

    if (body.role && (typeof body.role !== 'string' || body.role.length > 100)) {
      return errorResponse("role must be a string with max 100 characters", req, 400);
    }

    if (body.context && (typeof body.context !== 'string' || body.context.length > 500)) {
      return errorResponse("context must be a string with max 500 characters", req, 400);
    }

    const { question, answer, role, context } = body;

    const OPENAI_API_KEY = Deno.env.get("API_KEY_CHATGPT");
    if (!OPENAI_API_KEY) {
      console.error("[Internal] API key not configured");
      return errorResponse("Error de configuración del servicio.", req, 500);
    }

    const systemPrompt = `Eres un experto en recursos humanos y entrevistas de trabajo. Analizas respuestas de candidatos y proporcionas feedback constructivo, específico y accionable.`;
    
    const userPrompt = `Analiza esta respuesta de entrevista y proporciona feedback detallado.

Pregunta: ${question}
Respuesta del candidato: ${answer}
Rol: ${role || 'General'}
Contexto: ${context || 'Entrevista general'}

Proporciona un análisis en formato JSON con:
{
  "score": 85,
  "strengths": ["Punto fuerte 1", "Punto fuerte 2"],
  "improvements": ["Área de mejora 1", "Área de mejora 2"],
  "feedback": "Feedback detallado en 2-3 párrafos explicando qué hizo bien y qué puede mejorar",
  "suggestedAnswer": "Ejemplo de una respuesta mejorada basada en lo que dijo el candidato"
}`;

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
        temperature: 0.7,
        tools: [
          {
            type: "function",
            function: {
              name: "analyze_interview_response",
              description: "Analiza una respuesta de entrevista y proporciona feedback",
              parameters: {
                type: "object",
                properties: {
                  score: { 
                    type: "number",
                    description: "Puntuación de 0 a 100"
                  },
                  strengths: { 
                    type: "array", 
                    items: { type: "string" },
                    description: "Puntos fuertes de la respuesta"
                  },
                  improvements: { 
                    type: "array", 
                    items: { type: "string" },
                    description: "Áreas de mejora"
                  },
                  feedback: { 
                    type: "string",
                    description: "Feedback detallado y constructivo"
                  },
                  suggestedAnswer: { 
                    type: "string",
                    description: "Ejemplo de respuesta mejorada"
                  }
                },
                required: ["score", "strengths", "improvements", "feedback", "suggestedAnswer"]
              }
            }
          }
        ],
        tool_choice: { type: "function", function: { name: "analyze_interview_response" } }
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
      
      return errorResponse("Error al analizar la respuesta. Por favor intenta de nuevo.", req, 500);
    }

    const data = await response.json();
    const toolCall = data.choices[0].message.tool_calls?.[0];
    
    if (!toolCall) {
      console.error("[Internal] No tool call in AI response");
      return errorResponse("Error al analizar la respuesta. Por favor intenta de nuevo.", req, 500);
    }

    const analysis = JSON.parse(toolCall.function.arguments);

    console.log(`[${user.id}] Interview response analyzed successfully`);

    return jsonResponse(analysis, req);
  } catch (error) {
    console.error("[Internal] Error in interview-analyze-response:", error);
    return errorResponse("Error en el servicio. Por favor intenta de nuevo.", req, 500);
  }
});
