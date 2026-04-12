import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  const supabaseAdmin = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  )

  try {
    // Try to create admin user
    const { data: user, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email: 'tigmoit@gmail.com',
      password: 'yves1%',
      email_confirm: true,
      user_metadata: { first_name: 'Admin', last_name: 'TechStore' }
    })

    if (createError) {
      // User might already exist - find them
      const { data: { users } } = await supabaseAdmin.auth.admin.listUsers()
      const existingUser = users?.find((u: any) => u.email === 'tigmoit@gmail.com')
      
      if (existingUser) {
        // Ensure admin role exists
        const { error: roleError } = await supabaseAdmin.from('user_roles')
          .upsert({ user_id: existingUser.id, role: 'admin' }, { onConflict: 'user_id,role' })
        
        // Also delete customer role if exists
        await supabaseAdmin.from('user_roles')
          .delete()
          .eq('user_id', existingUser.id)
          .eq('role', 'customer')

        return new Response(
          JSON.stringify({ success: true, message: 'Admin role assigned to existing user' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
      
      return new Response(
        JSON.stringify({ error: createError.message }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // User created - update role from customer to admin
    if (user?.user) {
      await supabaseAdmin.from('user_roles')
        .update({ role: 'admin' })
        .eq('user_id', user.user.id)
        .eq('role', 'customer')
    }

    return new Response(
      JSON.stringify({ success: true, message: 'Admin user created' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (err) {
    return new Response(
      JSON.stringify({ error: String(err) }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
