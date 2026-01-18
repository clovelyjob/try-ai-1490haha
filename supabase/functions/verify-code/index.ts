import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, code, role = 'user', name } = await req.json();

    if (!email || !code) {
      return new Response(
        JSON.stringify({ error: 'Email and code are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Find valid verification code
    const { data: verificationCode, error: fetchError } = await supabase
      .from('verification_codes')
      .select('*')
      .eq('email', email.toLowerCase())
      .eq('code', code)
      .eq('used', false)
      .gt('expires_at', new Date().toISOString())
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (fetchError || !verificationCode) {
      return new Response(
        JSON.stringify({ error: 'Invalid or expired verification code' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Mark code as used
    await supabase
      .from('verification_codes')
      .update({ used: true })
      .eq('id', verificationCode.id);

    // Check if user already exists
    const { data: existingUsers } = await supabase.auth.admin.listUsers();
    const existingUser = existingUsers?.users?.find(
      (u) => u.email?.toLowerCase() === email.toLowerCase()
    );

    let userId: string;
    let isNewUser = false;

    if (existingUser) {
      // User exists - sign them in
      userId = existingUser.id;
    } else {
      // Create new user
      isNewUser = true;
      const tempPassword = crypto.randomUUID();
      
      const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
        email: email.toLowerCase(),
        password: tempPassword,
        email_confirm: true,
        user_metadata: {
          nombre: name || email.split('@')[0],
        },
      });

      if (createError || !newUser.user) {
        console.error('Error creating user:', createError);
        return new Response(
          JSON.stringify({ error: 'Failed to create user account' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      userId = newUser.user.id;

      // Create profile for new user
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: userId,
          email: email.toLowerCase(),
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

    // Generate a magic link for authentication (we'll use it to get a session)
    const { data: linkData, error: linkError } = await supabase.auth.admin.generateLink({
      type: 'magiclink',
      email: email.toLowerCase(),
      options: {
        redirectTo: `${req.headers.get('origin') || 'https://clovely.lovable.app'}/dashboard`,
      },
    });

    if (linkError) {
      console.error('Error generating link:', linkError);
      return new Response(
        JSON.stringify({ error: 'Failed to generate authentication' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Extract the token from the magic link
    const url = new URL(linkData.properties.action_link);
    const token = url.searchParams.get('token');
    const type = url.searchParams.get('type');

    return new Response(
      JSON.stringify({ 
        success: true,
        isNewUser,
        userId,
        token,
        type,
        email: email.toLowerCase(),
        role,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in verify-code:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
