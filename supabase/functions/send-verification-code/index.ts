import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Generate 8-digit numeric code
function generateCode(): string {
  return Math.floor(10000000 + Math.random() * 90000000).toString();
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, role = 'user' } = await req.json();

    if (!email) {
      return new Response(
        JSON.stringify({ error: 'Email is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new Response(
        JSON.stringify({ error: 'Invalid email format' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate role
    const validRoles = ['user', 'university_admin', 'admin'];
    if (!validRoles.includes(role)) {
      return new Response(
        JSON.stringify({ error: 'Invalid role' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Generate verification code
    const code = generateCode();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Mark any existing unused codes for this email as used
    await supabase
      .from('verification_codes')
      .update({ used: true })
      .eq('email', email.toLowerCase())
      .eq('used', false);

    // Insert new verification code
    const { error: insertError } = await supabase
      .from('verification_codes')
      .insert({
        email: email.toLowerCase(),
        code,
        expires_at: expiresAt.toISOString(),
        used: false,
      });

    if (insertError) {
      console.error('Error inserting verification code:', insertError);
      return new Response(
        JSON.stringify({ error: 'Failed to generate verification code' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check if RESEND_API_KEY is available
    const resendApiKey = Deno.env.get('RESEND_API_KEY');
    
    if (resendApiKey) {
      // Send email via Resend
      try {
        const emailResponse = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${resendApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: 'Clovely <noreply@clovely.app>',
            to: [email],
            subject: 'Tu código de verificación - Clovely',
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <h1 style="color: #FF6B35; text-align: center;">Clovely</h1>
                <h2 style="text-align: center; color: #333;">Tu código de verificación</h2>
                <div style="background: linear-gradient(135deg, #FF6B35, #FF8F5E); padding: 30px; border-radius: 12px; text-align: center; margin: 20px 0;">
                  <p style="color: white; font-size: 36px; font-weight: bold; letter-spacing: 8px; margin: 0;">${code}</p>
                </div>
                <p style="color: #666; text-align: center;">Este código expira en 10 minutos.</p>
                <p style="color: #999; font-size: 12px; text-align: center; margin-top: 30px;">
                  Si no solicitaste este código, puedes ignorar este mensaje.
                </p>
              </div>
            `,
          }),
        });

        if (!emailResponse.ok) {
          console.error('Failed to send email:', await emailResponse.text());
        }
      } catch (emailError) {
        console.error('Email sending error:', emailError);
        // Continue - code is still valid, just not sent via email
      }
    }

    // Return response - in dev mode, include the code for testing
    const isDev = !resendApiKey;
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: isDev 
          ? 'Verification code generated (DEV MODE - check response)' 
          : 'Verification code sent to your email',
        expiresAt: expiresAt.toISOString(),
        // Only include code in dev mode (no email service)
        ...(isDev && { devCode: code }),
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in send-verification-code:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
