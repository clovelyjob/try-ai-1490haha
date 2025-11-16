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
    const body = await req.json();
    
    // Input validation
    if (!body.text || typeof body.text !== 'string') {
      return new Response(
        JSON.stringify({ error: "text (string) is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    if (body.text.length > 10000) {
      return new Response(
        JSON.stringify({ error: "Text too long. Maximum 10000 characters allowed." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    if (body.type && !['summary', 'experience', 'education', 'general'].includes(body.type)) {
      return new Response(
        JSON.stringify({ error: "type must be one of: summary, experience, education, general" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    if (body.context && (typeof body.context !== 'string' || body.context.length > 500)) {
      return new Response(
        JSON.stringify({ error: "context must be a string with max 500 characters" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    const { text, type, context } = body;

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Construir prompt según el tipo de texto
    let systemPrompt = "";
    let userPrompt = "";

    switch (type) {
      case "summary":
        systemPrompt = `You are a Harvard Business School career advisor specializing in professional summaries. You craft compelling 2-3 sentence summaries that highlight achievements and value proposition.

HARVARD SUMMARY FORMAT:
1. Lead with your strongest professional identity
2. Highlight 2-3 key achievements with metrics
3. Show your value proposition
4. Keep it concise: 2-3 sentences maximum
5. Use confident, professional language

EXAMPLE:
"Results-driven Product Manager with 5+ years driving growth in SaaS startups. Led product launches generating $3M in ARR and improved user retention by 40% through data-driven feature optimization. Passionate about building products that solve real customer problems at scale."`;

        userPrompt = `Transform this professional summary into a Harvard-style summary (2-3 sentences max).

ORIGINAL: "${text}"
CONTEXT: ${context || 'Professional CV'}

Make it achievement-focused, include metrics if possible, and show clear value proposition. Return ONLY the improved summary.`;
        break;
      
      case "experience":
        systemPrompt = `You are a Harvard Business School career advisor specializing in resume bullet points. You transform experience descriptions into powerful, Harvard-style achievement bullets.

CRITICAL HARVARD FORMAT RULES:
1. Start with strong action verbs: Led, Managed, Developed, Implemented, Increased, Reduced, Designed, Established, Transformed, Coordinated, Analyzed, Streamlined, Optimized
2. Structure: ACTION VERB + What you did + Quantifiable IMPACT
3. Include metrics whenever possible: percentages, dollar amounts, time saved, people managed, items produced
4. Be concise: 1-2 lines maximum per bullet
5. Focus on RESULTS and IMPACT, not responsibilities
6. Use past tense for completed roles

EXAMPLES OF HARVARD-STYLE BULLETS:
❌ BAD: "Responsible for managing a team and improving processes"
✅ GOOD: "Led cross-functional team of 12 to streamline operations, reducing processing time by 35% and saving $50K annually"

❌ BAD: "Worked on marketing campaigns"
✅ GOOD: "Designed and executed 5 digital marketing campaigns, increasing customer engagement by 45% and generating 200+ qualified leads"

❌ BAD: "Helped with sales"
✅ GOOD: "Exceeded quarterly sales targets by 28%, generating $2.3M in revenue through strategic client relationship management"`;

        userPrompt = `Transform this experience description into a powerful Harvard-style bullet point. 

ORIGINAL TEXT: "${text}"
CONTEXT: ${context || 'Professional experience'}

INSTRUCTIONS:
- Start with a strong action verb (Led, Managed, Developed, etc.)
- Include specific metrics or quantifiable results (numbers, percentages, dollar amounts)
- Keep it concise (1-2 lines max)
- Focus on IMPACT and ACHIEVEMENTS, not just tasks
- Use professional, confident language
- Return ONLY the improved bullet point, no extra explanation

If the original text lacks metrics, infer reasonable achievements based on the role and context.`;
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
