import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { getCorsHeaders, handleCorsPreflightRequest, jsonResponse, errorResponse } from '../_shared/cors.ts';

// Rate limiting for failed verification attempts
const MAX_FAILED_ATTEMPTS = 10;
const LOCKOUT_PERIOD_MS = 60 * 60 * 1000; // 1 hour

Deno.serve(async (req) => {
  // Handle CORS preflight
  const preflightResponse = handleCorsPreflightRequest(req);
  if (preflightResponse) return preflightResponse;

  try {
    const { email, code, role = 'user', name } = await req.json();

    if (!email || !code) {
      return errorResponse('Email and code are required', req, 400);
    }

    // Validate inputs
    if (typeof email !== 'string' || email.length > 254) {
      return errorResponse('Invalid email', req, 400);
    }

    if (typeof code !== 'string' || code.length !== 8 || !/^\d{8}$/.test(code)) {
      return errorResponse('Invalid verification code format', req, 400);
    }

    if (name && (typeof name !== 'string' || name.length > 100)) {
      return errorResponse('Invalid name', req, 400);
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const normalizedEmail = email.toLowerCase().trim();

    // Rate limiting: Check for too many failed attempts
    // We count codes that are used OR expired for this email in the last hour
    const oneHourAgo = new Date(Date.now() - LOCKOUT_PERIOD_MS).toISOString();
    const { count: failedAttempts, error: countError } = await supabase
      .from('verification_codes')
      .select('*', { count: 'exact', head: true })
      .eq('email', normalizedEmail)
      .eq('used', true)
      .gte('created_at', oneHourAgo);

    if (!countError && failedAttempts && failedAttempts >= MAX_FAILED_ATTEMPTS) {
      return errorResponse('Too many verification attempts. Please try again in 1 hour.', req, 429);
    }

    // Find valid verification code
    const { data: verificationCode, error: fetchError } = await supabase
      .from('verification_codes')
      .select('*')
      .eq('email', normalizedEmail)
      .eq('code', code)
      .eq('used', false)
      .gt('expires_at', new Date().toISOString())
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (fetchError || !verificationCode) {
      return errorResponse('Invalid or expired verification code', req, 400);
    }

    // Mark code as used immediately to prevent reuse
    const { error: updateError } = await supabase
      .from('verification_codes')
      .update({ used: true })
      .eq('id', verificationCode.id);

    if (updateError) {
      console.error('Error marking code as used:', updateError);
    }

    // Check if user already exists
    const { data: existingUsers } = await supabase.auth.admin.listUsers();
    const existingUser = existingUsers?.users?.find(
      (u) => u.email?.toLowerCase() === normalizedEmail
    );

    let userId: string;
    let isNewUser = false;

    if (existingUser) {
      // User exists - use their existing ID
      userId = existingUser.id;
    } else {
      // Create new user with secure random password
      isNewUser = true;
      const tempPassword = crypto.randomUUID();
      
      const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
        email: normalizedEmail,
        password: tempPassword,
        email_confirm: true,
        user_metadata: {
          nombre: name || email.split('@')[0],
        },
      });

      if (createError || !newUser.user) {
        console.error('Error creating user:', createError);
        return errorResponse('Failed to create user account', req, 500);
      }

      userId = newUser.user.id;

      // Create profile for new user
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: userId,
          email: normalizedEmail,
          nombre: name || email.split('@')[0],
          user_role: role,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });

      if (profileError) {
        console.error('Error creating profile:', profileError);
      }

      // Add user role
      const validRoles = ['user', 'university_admin', 'admin'];
      const appRole = validRoles.includes(role) ? role : 'user';
      
      const { error: roleError } = await supabase
        .from('user_roles')
        .upsert({
          user_id: userId,
          role: appRole,
        });

      if (roleError) {
        console.error('Error setting user role:', roleError);
      }
    }

    // Generate a magic link for authentication
    const origin = req.headers.get('origin') || 'https://clovely.lovable.app';
    const { data: linkData, error: linkError } = await supabase.auth.admin.generateLink({
      type: 'magiclink',
      email: normalizedEmail,
      options: {
        redirectTo: `${origin}/dashboard`,
      },
    });

    if (linkError) {
      console.error('Error generating link:', linkError);
      return errorResponse('Failed to generate authentication', req, 500);
    }

    // Extract the token from the magic link
    const url = new URL(linkData.properties.action_link);
    const token = url.searchParams.get('token');
    const type = url.searchParams.get('type');

    return jsonResponse({
      success: true,
      isNewUser,
      userId,
      token,
      type,
      email: normalizedEmail,
      role,
    }, req);

  } catch (error) {
    console.error('Error in verify-code:', error);
    return errorResponse('Internal server error', req, 500);
  }
});
