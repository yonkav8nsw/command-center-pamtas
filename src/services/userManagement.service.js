import { supabase } from '../lib/supabase'

const FUNCTION_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/manage-users`

async function callFunction(action, payload = {}) {
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) throw new Error('Tidak terautentikasi')

  const res = await fetch(FUNCTION_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${session.access_token}`,
      'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
    },
    body: JSON.stringify({ action, ...payload }),
  })

  const json = await res.json()
  if (!res.ok) throw new Error(json.error || `HTTP ${res.status}`)
  return json
}

export const userManagementService = {
  /** List semua user (admin only) */
  listUsers() {
    return callFunction('list')
  },

  /** Buat user baru */
  createUser({ email, password, nama, role, pos_id }) {
    return callFunction('create', { email, password, nama, role, pos_id })
  },

  /** Update profil user (nama, role, pos_id, password opsional) */
  updateUser({ user_id, nama, role, pos_id, password }) {
    return callFunction('update', { user_id, nama, role, pos_id, password })
  },

  /** Hapus user */
  deleteUser(user_id) {
    return callFunction('delete', { user_id })
  },
}
