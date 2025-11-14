import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { cvData, targetRole } = await req.json();

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
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

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
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
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Límite de solicitudes alcanzado. Intenta de nuevo en unos minutos." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Créditos insuficientes." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(
        JSON.stringify({ error: "Error al analizar el CV" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();
    const toolCall = data.choices[0].message.tool_calls?.[0];
    
    if (!toolCall) {
      throw new Error("No se recibió análisis estructurado");
    }

    const analysis = JSON.parse(toolCall.function.arguments);

    console.log("CV analyzed successfully");

    return new Response(
      JSON.stringify(analysis),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in cv-generate-suggestions:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Error desconocido" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
