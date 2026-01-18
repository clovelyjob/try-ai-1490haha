import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { getCorsHeaders, handleCorsPreflightRequest, jsonResponse, errorResponse } from "../_shared/cors.ts";

serve(async (req) => {
  const preflightResponse = handleCorsPreflightRequest(req);
  if (preflightResponse) return preflightResponse;

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      { global: { headers: { Authorization: req.headers.get("Authorization")! } } }
    );

    const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
    if (authError || !user) {
      return errorResponse("No autorizado. Por favor inicia sesión.", req, 401);
    }

    const { pdfBase64, fileName } = await req.json();
    
    if (!pdfBase64 || typeof pdfBase64 !== 'string') {
      return errorResponse('No PDF provided', req, 400);
    }

    // Validate base64 size (max 5MB)
    if (pdfBase64.length > 5 * 1024 * 1024 * 1.37) {
      return errorResponse('PDF file too large. Maximum size is 5MB.', req, 413);
    }

    const OPENAI_API_KEY = Deno.env.get('API_KEY_CHATGPT');
    if (!OPENAI_API_KEY) {
      console.error('[Internal] API key not configured');
      return errorResponse('Error de configuración del servicio.', req, 500);
    }

    console.log(`[${user.id}] Processing PDF: ${fileName || 'cv.pdf'}`);

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${OPENAI_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'Eres un extractor de CVs profesional. Extrae TODA la información relevante del CV.' },
          { role: 'user', content: [
            { type: 'text', text: 'Extrae toda la información de este CV de forma estructurada:' },
            { type: 'image_url', image_url: { url: `data:application/pdf;base64,${pdfBase64}`, detail: 'high' } }
          ]}
        ],
        max_tokens: 4000
      }),
    });

    if (!response.ok) {
      const statusCode = response.status;
      if (statusCode === 429) return errorResponse('Demasiadas solicitudes.', req, 429);
      if (statusCode === 402) return errorResponse('Límite de uso alcanzado.', req, 402);
      return jsonResponse({ cvContent: 'No se pudo procesar el PDF.', error: 'Error al procesar' }, req);
    }

    const result = await response.json();
    return jsonResponse({ cvContent: result.choices?.[0]?.message?.content || '' }, req);
  } catch (err) {
    console.error('[Internal] Error parsing PDF:', err);
    return errorResponse('Error en el servicio.', req, 500);
  }
});
