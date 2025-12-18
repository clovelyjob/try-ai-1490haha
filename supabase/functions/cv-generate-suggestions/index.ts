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

    const { cvData, targetRole } = await req.json();

    const OPENAI_API_KEY = Deno.env.get("API_KEY_CHATGPT");
    if (!OPENAI_API_KEY) {
      console.error("[Internal] API key not configured");
      return new Response(
        JSON.stringify({ error: "Error de configuración del servicio." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const systemPrompt = `Eres un experto en recursos humanos y career coaching. Analizas CVs y proporcionas sugerencias específicas y accionables para mejorarlos.`;
    
    const userPrompt = `Analiza este CV y proporciona 5 sugerencias concretas de mejora. Enfócate en:
- Estructura y formato
- Palabras clave importantes
- Logros cuantificables
- Habilidades relevantes
- Áreas que necesitan más detalle

CV Data:
${JSON.stringify(cvData, null, 2)}

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
        JSON.stringify({ error: "Error al analizar el CV. Por favor intenta de nuevo." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();
    const toolCall = data.choices[0].message.tool_calls?.[0];
    
    if (!toolCall) {
      console.error("[Internal] No tool call in AI response");
      return new Response(
        JSON.stringify({ error: "Error al analizar el CV. Por favor intenta de nuevo." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const analysis = JSON.parse(toolCall.function.arguments);

    console.log(`[${user.id}] CV analyzed successfully`);

    return new Response(
      JSON.stringify(analysis),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("[Internal] Error in cv-generate-suggestions:", error);
    return new Response(
      JSON.stringify({ error: "Error en el servicio. Por favor intenta de nuevo." }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
