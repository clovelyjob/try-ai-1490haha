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

    // Input validation
    if (!body.messages || !Array.isArray(body.messages)) {
      return errorResponse("messages array is required", req, 400);
    }
    
    if (body.messages.length > 50) {
      return errorResponse("Too many messages. Maximum 50 messages allowed.", req, 400);
    }
    
    // Validate each message
    for (const msg of body.messages) {
      if (!msg.role || !msg.content) {
        return errorResponse("Each message must have role and content", req, 400);
      }
      if (typeof msg.content !== 'string' || msg.content.length > 10000) {
        return errorResponse("Message content must be a string with max 10000 characters", req, 400);
      }
    }
    
    const { messages } = body;
    const OPENAI_API_KEY = Deno.env.get("API_KEY_CHATGPT");
    
    if (!OPENAI_API_KEY) {
      console.error("[Internal] API key not configured");
      return errorResponse("Error de configuración del servicio.", req, 500);
    }

    const systemPrompt = `Eres un Career Coach experto de Clovely, una plataforma de desarrollo profesional cálida y humana. Tu misión es ayudar a profesionales a crecer en sus carreras con empatía, motivación y consejos prácticos.

Características de tu personalidad:
- Cálido y motivador, pero profesional
- Das consejos específicos y accionables
- Usas ejemplos concretos
- Celebras los logros del usuario
- Eres honesto pero constructivo con el feedback

Áreas en las que ayudas:
1. Optimización de CV: análisis, keywords, formato, logros cuantificables
2. Preparación para entrevistas: respuestas STAR, preguntas comunes, confianza
3. Desarrollo de carrera: objetivos, skills a desarrollar, próximos pasos
4. Búsqueda de oportunidades: estrategias, networking, aplicaciones efectivas
5. Cursos y formación: recomendaciones basadas en gaps de habilidades

Siempre:
- Haz preguntas de seguimiento cuando necesites más contexto
- Sé específico y da ejemplos
- Mantén respuestas concisas (máximo 3-4 párrafos)
- Usa emojis ocasionalmente para calidez (máximo 2 por mensaje)
- Termina con una pregunta o call-to-action cuando sea relevante

Contexto del ecosistema Clovely:
El usuario tiene acceso a:
- Dashboard con metas y progreso
- Sistema de recompensas y logros
- Biblioteca de CVs
- Simulador de entrevistas
- Red de oportunidades laborales
- Comunidad y mentorías`;

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
          ...messages,
        ],
        temperature: 0.8,
        max_tokens: 800,
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
      
      return errorResponse("Error en el servicio. Por favor intenta de nuevo.", req, 500);
    }

    const data = await response.json();
    const assistantMessage = data.choices?.[0]?.message?.content;

    if (!assistantMessage) {
      console.error("[Internal] No response content from AI");
      return errorResponse("Error en el servicio. Por favor intenta de nuevo.", req, 500);
    }

    console.log(`[${user.id}] Career coach chat successful`);

    return jsonResponse({ message: assistantMessage }, req);
  } catch (error) {
    console.error("[Internal] Career coach error:", error);
    return errorResponse("Error en el servicio. Por favor intenta de nuevo.", req, 500);
  }
});
