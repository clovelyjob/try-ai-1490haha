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
    if (!body.question || typeof body.question !== 'string') {
      return new Response(
        JSON.stringify({ error: "question (string) is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!body.answer || typeof body.answer !== 'string') {
      return new Response(
        JSON.stringify({ error: "answer (string) is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (body.question.length > 1000) {
      return new Response(
        JSON.stringify({ error: "Question too long. Maximum 1000 characters allowed." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (body.answer.length > 5000) {
      return new Response(
        JSON.stringify({ error: "Answer too long. Maximum 5000 characters allowed." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (body.role && (typeof body.role !== 'string' || body.role.length > 100)) {
      return new Response(
        JSON.stringify({ error: "role must be a string with max 100 characters" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (body.context && (typeof body.context !== 'string' || body.context.length > 500)) {
      return new Response(
        JSON.stringify({ error: "context must be a string with max 500 characters" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { question, answer, role, context } = body;

    const OPENAI_API_KEY = Deno.env.get("API_KEY_CHATGPT");
    if (!OPENAI_API_KEY) {
      console.error("[Internal] API key not configured");
      return new Response(
        JSON.stringify({ error: "Error de configuración del servicio." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
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
        JSON.stringify({ error: "Error al analizar la respuesta. Por favor intenta de nuevo." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();
    const toolCall = data.choices[0].message.tool_calls?.[0];
    
    if (!toolCall) {
      console.error("[Internal] No tool call in AI response");
      return new Response(
        JSON.stringify({ error: "Error al analizar la respuesta. Por favor intenta de nuevo." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const analysis = JSON.parse(toolCall.function.arguments);

    console.log(`[${user.id}] Interview response analyzed successfully`);

    return new Response(
      JSON.stringify(analysis),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("[Internal] Error in interview-analyze-response:", error);
    return new Response(
      JSON.stringify({ error: "Error en el servicio. Por favor intenta de nuevo." }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
