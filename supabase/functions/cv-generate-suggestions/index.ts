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
    if (!validatePayloadSize(bodyText, 100000)) { // 100KB limit
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

    const { cvData, targetRole } = body;

    // Validate cvData
    if (!cvData || typeof cvData !== 'object') {
      return errorResponse("cvData debe ser un objeto válido", req, 400);
    }

    // Validate targetRole if provided
    if (targetRole && (typeof targetRole !== 'string' || targetRole.length > 200)) {
      return errorResponse("targetRole inválido", req, 400);
    }

    // Validate and sanitize cvData structure
    const allowedFields = ['info_personal', 'experiencia', 'educacion', 'habilidades', 'idiomas', 'proyectos', 'certificaciones', 'resumen'];
    const sanitizedCvData: Record<string, unknown> = {};
    
    for (const key of Object.keys(cvData)) {
      if (allowedFields.includes(key)) {
        sanitizedCvData[key] = cvData[key];
      }
    }

    // Validate array sizes
    if (Array.isArray(sanitizedCvData.experiencia) && sanitizedCvData.experiencia.length > 20) {
      return errorResponse("Demasiadas entradas de experiencia (máximo 20)", req, 400);
    }
    if (Array.isArray(sanitizedCvData.educacion) && sanitizedCvData.educacion.length > 20) {
      return errorResponse("Demasiadas entradas de educación (máximo 20)", req, 400);
    }
    if (Array.isArray(sanitizedCvData.habilidades) && sanitizedCvData.habilidades.length > 50) {
      return errorResponse("Demasiadas habilidades (máximo 50)", req, 400);
    }

    // Further sanitize for AI API
    const aiSafeCvData = sanitizeForAI(sanitizedCvData);

    const OPENAI_API_KEY = Deno.env.get("API_KEY_CHATGPT");
    if (!OPENAI_API_KEY) {
      console.error("[Internal] API key not configured");
      return errorResponse("Error de configuración del servicio.", req, 500);
    }

    const systemPrompt = `Eres un experto en recursos humanos y career coaching. Analizas CVs y proporcionas sugerencias específicas y accionables para mejorarlos.`;
    
    const userPrompt = `Analiza este CV y proporciona 5 sugerencias concretas de mejora. Enfócate en:
- Estructura y formato
- Palabras clave importantes
- Logros cuantificables
- Habilidades relevantes
- Áreas que necesitan más detalle

CV Data:
${JSON.stringify(aiSafeCvData, null, 2)}

${targetRole ? `Rol objetivo: ${targetRole}` : ''}

Responde en formato JSON con esta estructura:
{
  "suggestions": [
    {
      "title": "Título breve de la sugerencia",
      "description": "Descripción detallada",
      "priority": "high" | "medium" | "low",
      "category": "structure" | "content" | "keywords" | "achievements"
    }
  ],
  "overallScore": 75,
  "strengths": ["Fortaleza 1", "Fortaleza 2"],
  "improvements": ["Área de mejora 1", "Área de mejora 2"]
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
        temperature: 0.6,
        tools: [
          {
            type: "function",
            function: {
              name: "analyze_cv",
              description: "Analiza un CV y retorna sugerencias estructuradas de mejora",
              parameters: {
                type: "object",
                properties: {
                  suggestions: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        title: { type: "string" },
                        description: { type: "string" },
                        priority: { type: "string", enum: ["high", "medium", "low"] },
                        category: { type: "string", enum: ["structure", "content", "keywords", "achievements"] }
                      },
                      required: ["title", "description", "priority", "category"]
                    }
                  },
                  overallScore: { type: "number" },
                  strengths: { type: "array", items: { type: "string" } },
                  improvements: { type: "array", items: { type: "string" } }
                },
                required: ["suggestions", "overallScore", "strengths", "improvements"]
              }
            }
          }
        ],
        tool_choice: { type: "function", function: { name: "analyze_cv" } }
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
      
      return errorResponse("Error al analizar el CV. Por favor intenta de nuevo.", req, 500);
    }

    const data = await response.json();
    const toolCall = data.choices[0].message.tool_calls?.[0];
    
    if (!toolCall) {
      console.error("[Internal] No tool call in AI response");
      return errorResponse("Error al analizar el CV. Por favor intenta de nuevo.", req, 500);
    }

    const analysis = JSON.parse(toolCall.function.arguments);

    console.log(`[${user.id}] CV analyzed successfully`);

    return jsonResponse(analysis, req);
  } catch (error) {
    console.error("[Internal] Error in cv-generate-suggestions:", error);
    return errorResponse("Error en el servicio. Por favor intenta de nuevo.", req, 500);
  }
});
