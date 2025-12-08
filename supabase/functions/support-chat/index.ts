import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const SYSTEM_PROMPT = `Eres el asistente de soporte de Clovely, una plataforma de desarrollo profesional con IA.

Tu rol es ayudar a los usuarios con:
- Preguntas sobre cómo usar la plataforma
- Problemas técnicos o errores
- Información sobre planes y facturación
- Guías de uso de las funciones principales

Conocimiento de la plataforma:
- Diagnóstico de Carrera: Test RIASEC con 42 preguntas que genera un código Holland (ej: "AIS") y sugiere carreras compatibles
- Creador de CV: Editor con múltiples plantillas profesionales (Harvard, Modern, Classic, etc.) y exportación PDF automática
- Simulador de Entrevistas: Genera 10 preguntas realistas según el puesto, con análisis de respuestas por texto o video
- Oportunidades: Ofertas de trabajo reales de LinkedIn, Indeed, Glassdoor via JSearch API
- Planes: Free (funciones básicas) y Premium (acceso completo, sin límites)

Reglas de comportamiento:
- Sé conciso, amable y resuelve dudas rápidamente
- Responde en el mismo idioma que el usuario
- Si no conoces algo específico, sugiere contactar a clovely.job@gmail.com
- No inventes información sobre precios específicos o funciones que no conoces
- Mantén respuestas cortas (2-4 oraciones máximo) a menos que el usuario pida más detalle`;

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    
    if (!messages || !Array.isArray(messages)) {
      return new Response(
        JSON.stringify({ error: 'Messages array is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      console.error('LOVABLE_API_KEY not configured');
      return new Response(
        JSON.stringify({ error: 'AI service not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Processing support chat with', messages.length, 'messages');

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          ...messages
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI Gateway error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Demasiadas solicitudes. Por favor espera un momento.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'Servicio temporalmente no disponible.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      return new Response(
        JSON.stringify({ error: 'Error al procesar tu mensaje' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    const assistantMessage = data.choices?.[0]?.message?.content;

    if (!assistantMessage) {
      console.error('No response from AI:', data);
      return new Response(
        JSON.stringify({ error: 'No se recibió respuesta' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Support chat response generated successfully');

    return new Response(
      JSON.stringify({ message: assistantMessage }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Support chat error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Error desconocido' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
