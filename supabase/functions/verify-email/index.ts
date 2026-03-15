import { corsHeaders } from "../_shared/auth.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email } = await req.json();

    if (!email || typeof email !== "string") {
      return new Response(
        JSON.stringify({ valid: false, reason: "Email requerido" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Basic format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new Response(
        JSON.stringify({ valid: false, reason: "Formato de email inválido" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const domain = email.split("@")[1];

    // Check common disposable email domains
    const disposableDomains = [
      "mailinator.com", "guerrillamail.com", "tempmail.com", "throwaway.email",
      "yopmail.com", "sharklasers.com", "guerrillamailblock.com", "grr.la",
      "dispostable.com", "trashmail.com", "fakeinbox.com", "mailnesia.com",
      "maildrop.cc", "discard.email", "temp-mail.org", "minutemail.com",
      "tempail.com", "mohmal.com", "getnada.com",
    ];

    if (disposableDomains.includes(domain.toLowerCase())) {
      return new Response(
        JSON.stringify({ valid: false, reason: "No se permiten correos temporales" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Verify domain has MX records using DNS resolution
    try {
      const mxRecords = await Deno.resolveDns(domain, "MX");
      if (!mxRecords || mxRecords.length === 0) {
        return new Response(
          JSON.stringify({ valid: false, reason: "Este dominio no puede recibir correos" }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    } catch {
      // If MX fails, try A record as fallback (some domains use A records for mail)
      try {
        const aRecords = await Deno.resolveDns(domain, "A");
        if (!aRecords || aRecords.length === 0) {
          return new Response(
            JSON.stringify({ valid: false, reason: "El dominio del correo no existe" }),
            { headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
      } catch {
        return new Response(
          JSON.stringify({ valid: false, reason: "El dominio del correo no existe" }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }

    return new Response(
      JSON.stringify({ valid: true }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error verifying email:", error);
    return new Response(
      JSON.stringify({ valid: true }), // Fail open to not block legitimate users
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
