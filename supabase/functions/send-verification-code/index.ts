import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { getCorsHeaders, handleCorsPreflightRequest, jsonResponse, errorResponse } from '../_shared/cors.ts';

// Generate 8-digit numeric code
function generateCode(): string {
  return Math.floor(10000000 + Math.random() * 90000000).toString();
}

// Rate limiting constants
const MAX_CODES_PER_HOUR = 5;
const LOCKOUT_PERIOD_MS = 60 * 60 * 1000; // 1 hour

Deno.serve(async (req) => {
  // Handle CORS preflight
  const preflightResponse = handleCorsPreflightRequest(req);
  if (preflightResponse) return preflightResponse;

  try {
    const { email, role = 'user' } = await req.json();

    if (!email) {
      return errorResponse('Email is required', req, 400);
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return errorResponse('Invalid email format', req, 400);
    }

    // Validate email length
    if (email.length > 254) {
      return errorResponse('Email too long', req, 400);
    }

    // Validate role
    const validRoles = ['user', 'university_admin', 'admin'];
    if (!validRoles.includes(role)) {
      return errorResponse('Invalid role', req, 400);
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const normalizedEmail = email.toLowerCase().trim();

    // Rate limiting: Check how many codes were generated in the last hour
    const oneHourAgo = new Date(Date.now() - LOCKOUT_PERIOD_MS).toISOString();
    const { count: recentCodeCount, error: countError } = await supabase
      .from('verification_codes')
      .select('*', { count: 'exact', head: true })
      .eq('email', normalizedEmail)
      .gte('created_at', oneHourAgo);

    if (countError) {
      console.error('Error checking rate limit:', countError);
    }

    if (recentCodeCount && recentCodeCount >= MAX_CODES_PER_HOUR) {
      return errorResponse('Too many verification code requests. Please try again in 1 hour.', req, 429);
    }

    // Generate verification code
    const code = generateCode();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Mark any existing unused codes for this email as used
    await supabase
      .from('verification_codes')
      .update({ used: true })
      .eq('email', normalizedEmail)
      .eq('used', false);

    // Insert new verification code
    const { error: insertError } = await supabase
      .from('verification_codes')
      .insert({
        email: normalizedEmail,
        code,
        expires_at: expiresAt.toISOString(),
        used: false,
      });

    if (insertError) {
      console.error('Error inserting verification code:', insertError);
      return errorResponse('Failed to generate verification code', req, 500);
    }

    // Check if RESEND_API_KEY is available for email sending
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
            to: [normalizedEmail],
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

      // Production mode: Email sent, don't expose code
      return jsonResponse({
        success: true,
        message: 'Verification code sent to your email',
        expiresAt: expiresAt.toISOString(),
      }, req);
    }

    // Development mode: Show code in UI since email isn't configured
    // IMPORTANT: Only for development/testing, never expose in production
    return jsonResponse({
      success: true,
      message: 'Verification code generated (Development Mode - Email not configured)',
      expiresAt: expiresAt.toISOString(),
      devCode: code, // Only included when email service is not configured
    }, req);

  } catch (error) {
    console.error('Error in send-verification-code:', error);
    return errorResponse('Internal server error', req, 500);
  }
});
