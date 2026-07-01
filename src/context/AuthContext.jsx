import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Timeout fallback - if getSession hangs, proceed without auth
    const timeoutId = setTimeout(() => {
      console.warn('[AuthContext] getSession timeout - proceeding without auth')
      setLoading(false)
    }, 10000) // 10 second timeout

    // Ambil sesi yang sudah ada (jika user sudah login sebelumnya)
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      clearTimeout(timeoutId) // Clear timeout on success
      if (error) {
        console.error('[AuthContext] getSession error:', error.message)
        setLoading(false)
        return
      }
      setUser(session?.user ?? null)
      if (session?.user) {
        fetchProfile(session.user.id)
      } else {
        setLoading(false)
      }
    }).catch(err => {
      clearTimeout(timeoutId)
      console.error('[AuthContext] getSession exception:', err)
      setLoading(false)
    })

    // Dengarkan perubahan auth state (login, logout, token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null)
        if (session?.user) {
          await fetchProfile(session.user.id)
        } else {
          setProfile(null)
          setLoading(false)
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  async function fetchProfile(userId) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) throw error
      setProfile(data)
    } catch (err) {
      console.error('[AuthContext] Gagal ambil profile:', err.message)
      setProfile(null)
    } finally {
      setLoading(false)
    }
  }

  const signIn = (email, password) =>
    supabase.auth.signInWithPassword({ email, password })

  const signOut = () => supabase.auth.signOut()

  // Shortcut role checks
  const isAdmin    = profile?.role === 'admin'
  const isOperator = profile?.role === 'operator' || isAdmin
  const isViewer   = profile?.role === 'viewer'
  const userPosId  = profile?.pos_id   // null untuk admin, 'AJ' untuk operator Pos AJ

  return (
    <AuthContext.Provider value={{
      user,
      profile,
      loading,
      signIn,
      signOut,
      isAdmin,
      isOperator,
      isViewer,
      userPosId,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth harus dipakai di dalam AuthProvider')
  return ctx
}
