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
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
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
          ...messages,
        ],
        temperature: 0.8,
        max_tokens: 800,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit alcanzado. Por favor intenta en unos momentos." }),
          {
            status: 429,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Límite de créditos alcanzado. Por favor contacta al administrador." }),
          {
            status: 402,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error("Error en la IA. Por favor intenta de nuevo.");
    }

    const data = await response.json();
    const assistantMessage = data.choices?.[0]?.message?.content;

    if (!assistantMessage) {
      throw new Error("No se recibió respuesta de la IA");
    }

    return new Response(
      JSON.stringify({ message: assistantMessage }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Career coach error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Error desconocido" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
