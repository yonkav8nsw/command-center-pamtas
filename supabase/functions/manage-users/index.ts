// Edge Function: manage-users
// Runs server-side with service role key — NEVER expose service role key to browser
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Verify caller is authenticated and is admin
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Create anon client to verify the caller's JWT and check their role
    const supabaseAnon = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    )

    // Get caller's profile to verify admin role
    const { data: callerProfile, error: profileError } = await supabaseAnon
      .from('profiles')
      .select('role')
      .single()

    if (profileError || !callerProfile) {
      return new Response(JSON.stringify({ error: 'Forbidden: tidak dapat verifikasi profil' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    if (callerProfile.role !== 'admin') {
      return new Response(JSON.stringify({ error: 'Forbidden: hanya admin yang dapat mengelola user' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Admin verified — now use service role client for user management
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { auth: { autoRefreshToken: false, persistSession: false } }
    )

    const body = await req.json()
    const { action } = body

    // ── CREATE USER ────────────────────────────────────────────────
    if (action === 'create') {
      const { email, password, nama, role, pos_id } = body

      if (!email || !password || !nama || !role) {
        return new Response(JSON.stringify({ error: 'email, password, nama, dan role wajib diisi' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
      }

      const validRoles = ['admin', 'operator', 'viewer']
      if (!validRoles.includes(role)) {
        return new Response(JSON.stringify({ error: 'Role tidak valid. Gunakan: admin, operator, viewer' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
      }

      // Operator wajib punya pos_id
      if (role === 'operator' && !pos_id) {
        return new Response(JSON.stringify({ error: 'Operator harus memiliki pos_id' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
      }

      // Create auth user
      const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true, // skip email verification
      })

      if (authError) {
        return new Response(JSON.stringify({ error: authError.message }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
      }

      const userId = authData.user.id

      // Upsert profile (trigger handle_new_user may have already created it)
      const { error: profileUpsertError } = await supabaseAdmin
        .from('profiles')
        .upsert({
          id: userId,
          nama,
          role,
          pos_id: pos_id || null,
        }, { onConflict: 'id' })

      if (profileUpsertError) {
        // Rollback: delete auth user if profile upsert fails
        await supabaseAdmin.auth.admin.deleteUser(userId)
        return new Response(JSON.stringify({ error: 'Gagal membuat profil: ' + profileUpsertError.message }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
      }

      return new Response(JSON.stringify({ success: true, user_id: userId }), {
        status: 201,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // ── UPDATE USER ────────────────────────────────────────────────
    if (action === 'update') {
      const { user_id, nama, role, pos_id, password } = body

      if (!user_id) {
        return new Response(JSON.stringify({ error: 'user_id wajib diisi' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
      }

      if (role) {
        const validRoles = ['admin', 'operator', 'viewer']
        if (!validRoles.includes(role)) {
          return new Response(JSON.stringify({ error: 'Role tidak valid' }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          })
        }
        if (role === 'operator' && !pos_id) {
          return new Response(JSON.stringify({ error: 'Operator harus memiliki pos_id' }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          })
        }
      }

      // Update password if provided
      if (password) {
        const { error: pwError } = await supabaseAdmin.auth.admin.updateUserById(user_id, { password })
        if (pwError) {
          return new Response(JSON.stringify({ error: 'Gagal update password: ' + pwError.message }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          })
        }
      }

      // Build profile update object (only include provided fields)
      const profileUpdate: Record<string, unknown> = {}
      if (nama !== undefined) profileUpdate.nama = nama
      if (role !== undefined) profileUpdate.role = role
      if (pos_id !== undefined) profileUpdate.pos_id = pos_id || null

      if (Object.keys(profileUpdate).length > 0) {
        const { error: updateError } = await supabaseAdmin
          .from('profiles')
          .update(profileUpdate)
          .eq('id', user_id)

        if (updateError) {
          return new Response(JSON.stringify({ error: 'Gagal update profil: ' + updateError.message }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          })
        }
      }

      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // ── DELETE USER ────────────────────────────────────────────────
    if (action === 'delete') {
      const { user_id } = body

      if (!user_id) {
        return new Response(JSON.stringify({ error: 'user_id wajib diisi' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
      }

      // Prevent admin from deleting themselves
      const { data: { user: callerUser } } = await supabaseAnon.auth.getUser()
      if (callerUser?.id === user_id) {
        return new Response(JSON.stringify({ error: 'Tidak dapat menghapus akun sendiri' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
      }

      // Delete profile first (FK constraint), then auth user
      await supabaseAdmin.from('profiles').delete().eq('id', user_id)

      const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(user_id)
      if (deleteError) {
        return new Response(JSON.stringify({ error: 'Gagal menghapus user: ' + deleteError.message }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
      }

      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // ── LIST USERS ─────────────────────────────────────────────────
    if (action === 'list') {
      // Get all auth users
      const { data: { users }, error: listError } = await supabaseAdmin.auth.admin.listUsers({
        perPage: 1000,
      })

      if (listError) {
        return new Response(JSON.stringify({ error: 'Gagal mengambil daftar user: ' + listError.message }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
      }

      // Get all profiles
      const { data: profiles } = await supabaseAdmin
        .from('profiles')
        .select('id, nama, role, pos_id')

      const profileMap = new Map((profiles || []).map((p: { id: string; nama: string; role: string; pos_id: string }) => [p.id, p]))

      const result = users.map((u) => {
        const profile = profileMap.get(u.id)
        return {
          id: u.id,
          email: u.email,
          nama: profile?.nama || '',
          role: profile?.role || 'viewer',
          pos_id: profile?.pos_id || null,
          created_at: u.created_at,
          last_sign_in_at: u.last_sign_in_at,
        }
      })

      return new Response(JSON.stringify({ users: result }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    return new Response(JSON.stringify({ error: 'Action tidak dikenal: ' + action }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })

  } catch (err) {
    return new Response(JSON.stringify({ error: 'Internal server error: ' + (err as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
