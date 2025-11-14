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
    const { text, type, context } = await req.json();
    
    if (!text) {
      return new Response(
        JSON.stringify({ error: "Text is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Construir prompt según el tipo de texto
    let systemPrompt = "";
    let userPrompt = "";

    switch (type) {
      case "summary":
        systemPrompt = "Eres un experto en redacción de CVs profesionales. Tu tarea es mejorar resúmenes profesionales haciéndolos más impactantes, concisos y orientados a resultados.";
        userPrompt = `Mejora este resumen profesional. Hazlo más impactante y orientado a logros. Mantén el mismo tono profesional pero hazlo más atractivo para reclutadores.\n\nTexto original:\n${text}\n\nContexto adicional: ${context || 'CV profesional general'}`;
        break;
      
      case "experience":
        systemPrompt = "Eres un experto en redacción de experiencias laborales para CVs. Mejoras descripciones usando verbos de acción, métricas y resultados cuantificables.";
        userPrompt = `Mejora esta descripción de experiencia laboral. Usa verbos de acción fuertes, añade estructura con bullets y enfócate en logros medibles cuando sea posible.\n\nTexto original:\n${text}\n\nContexto: ${context || 'Experiencia profesional general'}`;
        break;
      
      case "education":
        systemPrompt = "Eres un experto en redacción de secciones educativas para CVs. Mejoras descripciones haciendo énfasis en logros académicos relevantes.";
        userPrompt = `Mejora esta descripción educativa. Hazla más profesional y destaca logros académicos relevantes.\n\nTexto original:\n${text}`;
        break;
      
      default:
        systemPrompt = "Eres un experto en redacción profesional. Mejoras textos haciéndolos más claros, concisos y profesionales.";
        userPrompt = `Mejora este texto profesional:\n\n${text}`;
    }

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
        temperature: 0.7,
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
          JSON.stringify({ error: "Créditos insuficientes. Por favor agrega créditos en tu workspace." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(
        JSON.stringify({ error: "Error al procesar la solicitud" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();
    const improvedText = data.choices[0].message.content;

    console.log("Text improved successfully");

    return new Response(
      JSON.stringify({ improvedText }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in cv-improve-text:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Error desconocido" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
