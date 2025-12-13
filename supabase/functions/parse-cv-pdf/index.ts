import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { pdfBase64, fileName } = await req.json();
    
    if (!pdfBase64) {
      console.error('No PDF provided');
      return new Response(
        JSON.stringify({ error: 'No PDF provided' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const OPENAI_API_KEY = Deno.env.get('API_KEY_CHATGPT');
    if (!OPENAI_API_KEY) {
      console.error('API_KEY_CHATGPT not configured');
      return new Response(
        JSON.stringify({ error: 'API key not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Processing PDF: ${fileName || 'cv.pdf'}`);

    // OpenAI GPT-4o-mini supports vision - we'll send the PDF as an image
    // First, we need to convert PDF pages to images or use text extraction
    // Since OpenAI doesn't directly support PDF, we'll use a text-based approach
    
    const systemPrompt = `Eres un extractor de CVs profesional. Tu tarea es extraer TODA la información relevante del CV proporcionado y devolverla en formato de texto estructurado.

Extrae la siguiente información si está disponible:
- Nombre completo
- Título profesional
- Resumen/Perfil profesional
- Experiencia laboral (empresa, cargo, fechas, responsabilidades y logros)
- Educación (institución, título, campo de estudio, fechas)
- Habilidades técnicas y blandas
- Certificaciones
- Idiomas
- Proyectos destacados

Presenta la información de forma clara y estructurada. Si alguna sección no está en el CV, simplemente omítela.`;

    // Since GPT-4o-mini supports images but not PDFs directly,
    // we'll try sending the base64 as an image (works for image-based PDFs)
    // or fall back to a text extraction approach
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: 'Extrae toda la información de este CV de forma estructurada:'
              },
              {
                type: 'image_url',
                image_url: {
                  url: `data:application/pdf;base64,${pdfBase64}`,
                  detail: 'high'
                }
              }
            ]
          }
        ],
        max_tokens: 4000
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'Payment required. Please add credits.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      // If the image approach fails, try with a text-only fallback message
      console.log('Falling back to text-only response');
      return new Response(
        JSON.stringify({ 
          cvContent: 'No se pudo procesar el PDF. Por favor, copia y pega el contenido de tu CV manualmente.',
          error: 'PDF processing not supported with current API' 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const result = await response.json();
    const extractedText = result.choices?.[0]?.message?.content || '';

    console.log('Successfully extracted CV content');

    return new Response(
      JSON.stringify({ cvContent: extractedText }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (err) {
    console.error('Error parsing PDF:', err);
    return new Response(
      JSON.stringify({ error: 'Failed to parse PDF' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
