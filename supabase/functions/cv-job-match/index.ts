import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const APYHUB_BASE = "https://api.apyhub.com/sharpapi/api/v1";

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

    const APYHUB_API_KEY = Deno.env.get("APYHUB_API_KEY");
    if (!APYHUB_API_KEY) {
      console.error("[Internal] APYHUB_API_KEY not configured");
      return new Response(
        JSON.stringify({ error: "Error de configuración del servicio." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { action, jobId, resumeBase64, resumeFileName, jobDescription, language } = await req.json();

    // Action: "submit" - Submit a new match job
    // Action: "status" - Check job status
    if (action === "submit") {
      if (!resumeBase64 || !jobDescription) {
        return new Response(
          JSON.stringify({ error: "Se requiere el CV y la descripción del puesto." }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Decode base64 to binary
      const binaryString = atob(resumeBase64);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      const formData = new FormData();
      const blob = new Blob([bytes], { type: "application/pdf" });
      formData.append("file", blob, resumeFileName || "resume.pdf");
      formData.append("content", jobDescription);
      formData.append("language", language || "Spanish");

      const response = await fetch(`${APYHUB_BASE}/hr/resume_job_match_score`, {
        method: "POST",
        headers: {
          "Accept": "application/json",
          "apy-token": APYHUB_API_KEY,
        },
        body: formData,
      });

      if (!response.ok) {
        const status = response.status;
        const errorBody = await response.text();
        console.error(`[Internal] APYHub submit error [${status}]:`, errorBody);

        if (status === 401) {
          return new Response(
            JSON.stringify({ error: "Error de autenticación con el servicio externo." }),
            { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
        return new Response(
          JSON.stringify({ error: "Error al enviar el CV para análisis." }),
          { status: status >= 500 ? 500 : status, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const data = await response.json();
      console.log(`[${user.id}] CV job match submitted: ${data.job_id}`);

      return new Response(
        JSON.stringify({ jobId: data.job_id, statusUrl: data.status_url }),
        { status: 202, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (action === "status") {
      if (!jobId) {
        return new Response(
          JSON.stringify({ error: "Se requiere el ID del trabajo." }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const response = await fetch(
        `${APYHUB_BASE}/hr/resume_job_match_score/job/status/${jobId}`,
        {
          method: "GET",
          headers: {
            "Accept": "application/json",
            "apy-token": APYHUB_API_KEY,
          },
        }
      );

      if (!response.ok) {
        const status = response.status;
        const errorBody = await response.text();
        console.error(`[Internal] APYHub status error [${status}]:`, errorBody);
        return new Response(
          JSON.stringify({ error: "Error al consultar el estado del análisis." }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const data = await response.json();
      return new Response(
        JSON.stringify(data),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ error: "Acción no válida. Use 'submit' o 'status'." }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("[Internal] Error in cv-job-match:", error);
    return new Response(
      JSON.stringify({ error: "Error en el servicio. Por favor intenta de nuevo." }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
