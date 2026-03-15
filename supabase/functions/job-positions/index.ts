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

    const APYHUB_API_KEY = Deno.env.get("APYHUB_JOB_POSITIONS_KEY");
    if (!APYHUB_API_KEY) {
      console.error("[Internal] APYHUB_JOB_POSITIONS_KEY not configured");
      return new Response(
        JSON.stringify({ error: "Error de configuración del servicio." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { name, perPage, includeRelated } = await req.json();

    // Build query params
    const params = new URLSearchParams();
    if (name) params.set("name", name);
    if (perPage) params.set("per_page", String(perPage));
    if (includeRelated !== undefined) params.set("include_related", String(includeRelated));

    const url = `${APYHUB_BASE}/utilities/job_positions_list?${params.toString()}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "apy-token": APYHUB_API_KEY,
      },
    });

    if (!response.ok) {
      const status = response.status;
      const errorBody = await response.text();
      console.error(`[Internal] APYHub job-positions error [${status}]:`, errorBody);

      if (status === 401) {
        return new Response(
          JSON.stringify({ error: "Error de autenticación con el servicio externo." }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      return new Response(
        JSON.stringify({ error: "Error al buscar posiciones de trabajo." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();
    console.log(`[${user.id}] Job positions fetched: ${data.data?.length || 0} results`);

    return new Response(
      JSON.stringify(data),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("[Internal] Error in job-positions:", error);
    return new Response(
      JSON.stringify({ error: "Error en el servicio. Por favor intenta de nuevo." }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
