import { Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

/**
 * Bungkus route yang membutuhkan login.
 * - requireAdmin=true  → hanya admin/komandan yang boleh masuk
 * - requireAdmin=false → semua user yang sudah login boleh masuk
 */
export function ProtectedRoute({ children, requireAdmin = false }) {
  const { user, loading, isAdmin } = useAuth()

  // Masih cek sesi — tampilkan loading screen HUD-style
  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: '#050810',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '12px',
        fontFamily: 'monospace',
      }}>
        <div style={{
          width: '32px',
          height: '32px',
          border: '2px solid rgba(0,255,136,0.2)',
          borderTop: '2px solid #00ff88',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
        }} />
        <p style={{
          color: 'rgba(0,255,136,0.6)',
          fontSize: '11px',
          letterSpacing: '0.15em',
        }}>
          MEMUAT SESI...
        </p>
        <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
      </div>
    )
  }

  // Belum login → redirect ke /login
  if (!user) {
    return <Navigate to="/login" replace />
  }

  // Butuh admin tapi bukan admin → redirect ke halaman utama
  if (requireAdmin && !isAdmin) {
    return <Navigate to="/" replace />
  }

  return children
}
