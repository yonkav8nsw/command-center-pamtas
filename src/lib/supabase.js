/**
 * Supabase client singleton
 * Dibuat sekali, dipakai di seluruh aplikasi
 */
import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const key = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!url || !key) {
  throw new Error(
    'VITE_SUPABASE_URL dan VITE_SUPABASE_ANON_KEY harus dikonfigurasi di file .env'
  )
}

export const supabase = createClient(url, key, {
  auth: {
    persistSession: true,       // simpan sesi di localStorage
    autoRefreshToken: true,     // refresh JWT otomatis sebelum kadaluarsa
  },
  realtime: {
    params: {
      eventsPerSecond: 10,      // batasi event realtime agar tidak flood
    },
  },
})
