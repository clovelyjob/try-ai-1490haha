import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { getCorsHeaders, handleCorsPreflightRequest, jsonResponse, errorResponse, validatePayloadSize } from "../_shared/cors.ts";

// Function to clean quotes from AI response
function cleanQuotes(text: string): string {
  let cleaned = text.trim();
  if (cleaned.startsWith('"') && cleaned.endsWith('"')) {
    cleaned = cleaned.slice(1, -1);
  }
  if (cleaned.startsWith("'") && cleaned.endsWith("'")) {
    cleaned = cleaned.slice(1, -1);
  }
  if (cleaned.startsWith('`') && cleaned.endsWith('`')) {
    cleaned = cleaned.slice(1, -1);
  }
  return cleaned.trim();
}

serve(async (req) => {
  // Handle CORS preflight
  const preflightResponse = handleCorsPreflightRequest(req);
  if (preflightResponse) return preflightResponse;

  try {
    // Check payload size before parsing
    const bodyText = await req.text();
    if (!validatePayloadSize(bodyText, 50000)) { // 50KB limit
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
    if (!body.text || typeof body.text !== 'string') {
      return errorResponse("text (string) is required", req, 400);
    }
    
    if (body.text.length > 10000) {
      return errorResponse("Text too long. Maximum 10000 characters allowed.", req, 400);
    }
    
    if (body.type && !['summary', 'experience', 'education', 'general'].includes(body.type)) {
      return errorResponse("type must be one of: summary, experience, education, general", req, 400);
    }
    
    if (body.context && (typeof body.context !== 'string' || body.context.length > 500)) {
      return errorResponse("context must be a string with max 500 characters", req, 400);
    }
    
    const { text, type, context, language = 'es' } = body;

    const OPENAI_API_KEY = Deno.env.get("API_KEY_CHATGPT");
    if (!OPENAI_API_KEY) {
      console.error("[Internal] API key not configured");
      return errorResponse("Error de configuración del servicio.", req, 500);
    }

    // Construir prompt según el tipo de texto
    let systemPrompt = "";
    let userPrompt = "";

    switch (type) {
      case "summary":
        systemPrompt = language === 'es' 
          ? `Eres un asesor profesional especializado en resúmenes profesionales. Creas resúmenes convincentes de 2-3 oraciones que destacan logros y propuesta de valor.

FORMATO PROFESIONAL:
1. Comienza con tu identidad profesional más fuerte
2. Destaca 2-3 logros clave con métricas
3. Muestra tu propuesta de valor
4. Manténlo conciso: máximo 2-3 oraciones
5. Usa lenguaje profesional y confiado

EJEMPLO:
Product Manager orientado a resultados con más de 5 años impulsando crecimiento en startups SaaS. Lideré lanzamientos de productos que generaron $3M en ARR y mejoré la retención de usuarios en 40% mediante optimización basada en datos. Apasionado por construir productos que resuelven problemas reales de clientes a escala.

IMPORTANTE: Devuelve SOLO el texto mejorado, sin comillas, sin caracteres especiales alrededor.`
          : `You are a professional advisor specializing in professional summaries. You craft compelling 2-3 sentence summaries that highlight achievements and value proposition.

PROFESSIONAL FORMAT:
1. Lead with your strongest professional identity
2. Highlight 2-3 key achievements with metrics
3. Show your value proposition
4. Keep it concise: 2-3 sentences maximum
5. Use confident, professional language

EXAMPLE:
Results-driven Product Manager with 5+ years driving growth in SaaS startups. Led product launches generating $3M in ARR and improved user retention by 40% through data-driven feature optimization. Passionate about building products that solve real customer problems at scale.

IMPORTANT: Return ONLY the improved text, without quotes or special characters around it.`;

        userPrompt = language === 'es'
          ? `Transforma este resumen profesional en un resumen de estilo profesional (máximo 2-3 oraciones).

TEXTO ORIGINAL:
---
${text}
---

CONTEXTO: ${context || 'CV Profesional'}

Enfócalo en logros, incluye métricas si es posible, y muestra una propuesta de valor clara. Devuelve SOLO el resumen mejorado EN ESPAÑOL, sin comillas ni caracteres especiales alrededor del resultado.`
          : `Transform this professional summary into a professional-style summary (2-3 sentences max).

ORIGINAL TEXT:
---
${text}
---

CONTEXT: ${context || 'Professional CV'}

Make it achievement-focused, include metrics if possible, and show clear value proposition. Return ONLY the improved summary IN ENGLISH, without quotes or special characters around the result.`;
        break;
      
      case "experience":
        systemPrompt = language === 'es'
          ? `Eres un asesor de carreras profesional. Transforma descripciones de experiencia en bullets de logros siguiendo directrices profesionales oficiales.

DIRECTRICES PROFESIONALES OFICIALES:

El Lenguaje del CV Debe Ser:
- Específico en lugar de general
- Activo en lugar de pasivo
- Escrito para expresar no para impresionar
- Articulado en lugar de "florido"
- Basado en hechos (cuantificar y calificar)
- Escrito para personas/sistemas que escanean rápidamente

REGLAS CRÍTICAS:
- SIN pronombres personales (yo, mi, me)
- SIN abreviaturas
- Basado en hechos (cuantificar y calificar)
- Comenzar con verbo de acción fuerte
- Incluir métricas específicas e impacto
- Máximo 2 líneas por bullet

FORMATO: "Verbo de Acción + Tarea + Resultado Cuantificable"

IMPORTANTE: Devuelve SOLO el texto mejorado, sin comillas, sin caracteres especiales alrededor.`
          : `You are a professional career advisor. Transform experience descriptions into professional achievement bullets following official guidelines.

OFFICIAL PROFESSIONAL GUIDELINES:

Resume Language Must Be:
- Specific rather than general
- Active rather than passive  
- Written to express not impress
- Articulate rather than "flowery"
- Fact-based (quantify and qualify)
- Written for people/systems that scan quickly

CRITICAL RULES:
- NO personal pronouns (I, We, My)
- NO abbreviations
- NO narrative style
- Start with action verb (past tense for completed roles)
- Quantify results when possible
- Focus on ACHIEVEMENTS not responsibilities
- 1-2 lines maximum

IMPORTANT: Return ONLY the improved text, without quotes or special characters around it.`;

        userPrompt = language === 'es'
          ? `Transforma este bullet de experiencia en un bullet de logro de estilo profesional oficial.

TEXTO ORIGINAL:
---
${text}
---

CONTEXTO: ${context || 'Experiencia Profesional'}

Devuelve SOLO el bullet point mejorado EN ESPAÑOL, sin comillas ni caracteres especiales alrededor del resultado.`
          : `Transform this experience bullet into an official professional-style achievement bullet.

ORIGINAL TEXT:
---
${text}
---

CONTEXT: ${context || 'Professional Experience'}

Return ONLY the improved bullet point IN ENGLISH, without quotes or special characters around the result.`;
        break;
      
      case "education":
      case "general":
      default:
        systemPrompt = language === 'es'
          ? `Eres un experto profesional en redacción de CVs. Mejora el texto para que sea claro, conciso y profesional manteniendo la precisión.

IMPORTANTE: Devuelve SOLO el texto mejorado, sin comillas, sin caracteres especiales alrededor.`
          : `You are a professional CV writing expert. Improve the text to be clear, concise, and professional while maintaining accuracy.

IMPORTANT: Return ONLY the improved text, without quotes or special characters around it.`;
        userPrompt = language === 'es'
          ? `Mejora este texto para un CV profesional:

TEXTO ORIGINAL:
---
${text}
---

Devuelve SOLO el texto mejorado EN ESPAÑOL, sin comillas ni caracteres especiales alrededor del resultado.`
          : `Improve this text for a professional CV:

ORIGINAL TEXT:
---
${text}
---

Return ONLY the improved text IN ENGLISH, without quotes or special characters around the result.`;
    }

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
      
      return errorResponse("Error al mejorar el texto. Por favor intenta de nuevo.", req, 500);
    }

    const data = await response.json();
    const improvedText = cleanQuotes(data.choices[0].message.content);

    console.log(`[${user.id}] Text improved successfully`);

    return jsonResponse({ improvedText }, req);
  } catch (error) {
    console.error("[Internal] Error in cv-improve-text:", error);
    return errorResponse("Error en el servicio. Por favor intenta de nuevo.", req, 500);
  }
});
