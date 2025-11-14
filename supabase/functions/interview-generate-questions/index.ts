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
    const { role, industry, level, count = 5 } = await req.json();

    if (!role) {
      return new Response(
        JSON.stringify({ error: "Role is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const systemPrompt = `Eres un experto reclutador con años de experiencia haciendo entrevistas. Generas preguntas relevantes, realistas y desafiantes para diferentes roles profesionales.`;
    
    const levelText = level === 'junior' ? 'junior' : level === 'senior' ? 'senior' : 'intermedio';
    
    const userPrompt = `Genera ${count} preguntas de entrevista para un puesto de ${role} nivel ${levelText}${industry ? ` en la industria ${industry}` : ''}.

Las preguntas deben:
- Ser realistas y comunes en entrevistas reales
- Mezclar preguntas conductuales, técnicas y situacionales
- Estar adaptadas al nivel de experiencia
- Ser específicas para el rol

Responde en formato JSON:
{
  "questions": [
    {
      "text": "Pregunta completa",
      "type": "behavioral" | "technical" | "situational" | "opening",
      "difficulty": "easy" | "medium" | "hard",
      "tip": "Consejo breve para responder bien esta pregunta"
    }
  ]
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
        temperature: 0.8,
        tools: [
          {
            type: "function",
            function: {
              name: "generate_interview_questions",
              description: "Genera preguntas de entrevista relevantes",
              parameters: {
                type: "object",
                properties: {
                  questions: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        text: { type: "string" },
                        type: { 
                          type: "string", 
                          enum: ["behavioral", "technical", "situational", "opening"] 
                        },
                        difficulty: { 
                          type: "string", 
                          enum: ["easy", "medium", "hard"] 
                        },
                        tip: { type: "string" }
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
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Límite de solicitudes alcanzado." }),
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
        JSON.stringify({ error: "Error al generar preguntas" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();
    const toolCall = data.choices[0].message.tool_calls?.[0];
    
    if (!toolCall) {
      throw new Error("No se generaron preguntas");
    }

    const result = JSON.parse(toolCall.function.arguments);

    console.log("Questions generated successfully");

    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in interview-generate-questions:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Error desconocido" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
