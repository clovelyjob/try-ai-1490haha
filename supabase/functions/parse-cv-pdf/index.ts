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

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      console.error('LOVABLE_API_KEY not configured');
      return new Response(
        JSON.stringify({ error: 'API key not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Processing PDF: ${fileName || 'cv.pdf'}`);

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          {
            role: 'system',
            content: `Eres un extractor de CVs profesional. Tu tarea es extraer TODA la información relevante del CV proporcionado y devolverla en formato de texto estructurado.

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

Presenta la información de forma clara y estructurada. Si alguna sección no está en el CV, simplemente omítela.`
          },
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: 'Extrae toda la información de este CV de forma estructurada:'
              },
              {
                type: 'file',
                file: {
                  filename: fileName || 'cv.pdf',
                  file_data: `data:application/pdf;base64,${pdfBase64}`
                }
              }
            ]
          }
        ]
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI Gateway error:', response.status, errorText);
      
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
      
      return new Response(
        JSON.stringify({ error: 'Failed to process PDF with AI' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
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
