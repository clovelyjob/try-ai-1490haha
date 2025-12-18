import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
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
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const body = await req.json();
    
    // Input validation
    if (!body.role || typeof body.role !== 'string') {
      return new Response(
        JSON.stringify({ error: "role (string) is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (body.role.length > 100) {
      return new Response(
        JSON.stringify({ error: "Role too long. Maximum 100 characters allowed." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (body.level && (typeof body.level !== 'string' || body.level.length > 50)) {
      return new Response(
        JSON.stringify({ error: "level must be a string with max 50 characters" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (body.jobDescription && (typeof body.jobDescription !== 'string' || body.jobDescription.length > 5000)) {
      return new Response(
        JSON.stringify({ error: "jobDescription must be a string with max 5000 characters" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (body.cvContent && (typeof body.cvContent !== 'string' || body.cvContent.length > 10000)) {
      return new Response(
        JSON.stringify({ error: "cvContent must be a string with max 10000 characters" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const count = body.count || 10;
    if (typeof count !== 'number' || count < 1 || count > 20) {
      return new Response(
        JSON.stringify({ error: "count must be a number between 1 and 20" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { role, level, jobDescription, cvContent } = body;

    const OPENAI_API_KEY = Deno.env.get("API_KEY_CHATGPT");
    if (!OPENAI_API_KEY) {
      console.error("[Internal] API key not configured");
      return new Response(
        JSON.stringify({ error: "Error de configuración del servicio." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
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
      userPrompt += `

DESCRIPCIÓN DEL PUESTO (usa esto para personalizar las preguntas):
${jobDescription}

Asegúrate de que las preguntas sean MUY específicas para esta descripción del puesto. Incluye preguntas sobre las responsabilidades, habilidades y requisitos mencionados.`;
    }

    if (cvContent) {
      userPrompt += `

INFORMACIÓN DEL CV DEL CANDIDATO:
${cvContent}

Usa esta información para hacer preguntas MÁS PERSONALIZADAS sobre:
- Su experiencia laboral específica mencionada en el CV
- Los proyectos que ha realizado
- Las habilidades técnicas que domina
- Logros cuantificables que menciona
- Cómo su experiencia previa se relaciona con el puesto

Haz preguntas que profundicen en detalles de su experiencia real.`;
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
        return new Response(
          JSON.stringify({ error: "Demasiadas solicitudes. Por favor espera unos momentos." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (statusCode === 402) {
        return new Response(
          JSON.stringify({ error: "Límite de uso alcanzado." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      return new Response(
        JSON.stringify({ error: "Error al generar preguntas. Por favor intenta de nuevo." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();
    const toolCall = data.choices[0].message.tool_calls?.[0];
    
    if (!toolCall) {
      console.error("[Internal] No tool call in AI response");
      return new Response(
        JSON.stringify({ error: "Error al generar preguntas. Por favor intenta de nuevo." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const result = JSON.parse(toolCall.function.arguments);

    console.log(`[${user.id}] Generated ${result.questions?.length || 0} interview questions for role: ${role}`);

    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("[Internal] Error in interview-generate-questions:", error);
    return new Response(
      JSON.stringify({ error: "Error en el servicio. Por favor intenta de nuevo." }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
