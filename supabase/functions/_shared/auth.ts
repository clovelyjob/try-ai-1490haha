import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

export const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

export async function authenticateUser(req: Request) {
  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_ANON_KEY") ?? "",
    {
      global: {
        headers: { Authorization: req.headers.get("Authorization")! },
      },
    }
  );

  const { data: { user }, error } = await supabaseClient.auth.getUser();
  
  if (error || !user) {
    return { user: null, error: "Unauthorized" };
  }
  
  return { user, error: null };
}

export function unauthorizedResponse() {
  return new Response(
    JSON.stringify({ error: "No autorizado. Por favor inicia sesión." }),
    { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
  );
}

export function genericErrorResponse(message = "Error en el servicio. Por favor intenta de nuevo.") {
  return new Response(
    JSON.stringify({ error: message }),
    { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
  );
}

export function rateLimitResponse() {
  return new Response(
    JSON.stringify({ error: "Demasiadas solicitudes. Por favor espera unos momentos." }),
    { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
  );
}

export function paymentRequiredResponse() {
  return new Response(
    JSON.stringify({ error: "Límite de uso alcanzado. Por favor contacta soporte." }),
    { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
  );
}

export function validationErrorResponse(message: string) {
  return new Response(
    JSON.stringify({ error: message }),
    { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
  );
}
