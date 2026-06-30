/**
 * Supabase client singleton
 * Dibuat sekali, dipakai di seluruh aplikasi
 *
 * Graceful fallback: jika env tidak configured, return mock client
 * yang akan mengembalikan data kosong — app tetap bisa jalan di dev
 * tanpa Supabase connection.
 */
import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const key = import.meta.env.VITE_SUPABASE_ANON_KEY

// Check if Supabase is configured
const isConfigured = url && key &&
  !url.includes('xxxxxx') &&
  !url.includes('your-project') &&
  url.startsWith('https://')

// Create client only if configured
let supabase

if (isConfigured) {
  supabase = createClient(url, key, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
    realtime: {
      params: {
        eventsPerSecond: 10,
      },
    },
  })
} else {
  // Mock client for development without Supabase
  // Provides empty responses so the app doesn't crash
  console.warn('[Supabase] Credentials not configured. Using mock client. App will show empty data.')
  supabase = {
    from: () => ({
      select: () => ({
        eq: () => ({
          single: async () => ({ data: null, error: { message: 'Supabase not configured' } })
        }),
        order: async () => ({ data: [], error: null })
      }),
      insert: async () => ({ data: null, error: { message: 'Supabase not configured' } }),
      update: async () => ({ data: null, error: { message: 'Supabase not configured' } }),
      delete: async () => ({ data: null, error: { message: 'Supabase not configured' } })
    }),
    auth: {
      getUser: async () => ({ data: { user: null }, error: null }),
      signInWithPassword: async () => ({ data: null, error: { message: 'Supabase not configured' } }),
      signOut: async () => ({ error: null })
    }
  }
}

export { isConfigured }
export { supabase }  // Named export for backward compatibility
export default supabase
