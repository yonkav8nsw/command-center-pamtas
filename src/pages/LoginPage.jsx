import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function LoginPage() {
  const { signIn } = useAuth()
  const navigate = useNavigate()

  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]       = useState(null)
  const [loading, setLoading]   = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const { error: signInError } = await signIn(email, password)
      if (signInError) throw signInError
      navigate('/', { replace: true })
    } catch (err) {
      setError(err.message || 'Login gagal. Periksa email dan password.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#050810',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'monospace',
      padding: '24px',
    }}>
      {/* Garis dekorasi sudut */}
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, pointerEvents: 'none' }}>
        {['topLeft','topRight','bottomLeft','bottomRight'].map(corner => (
          <div key={corner} style={{
            position: 'absolute',
            width: '32px',
            height: '32px',
            ...(corner.includes('top')    ? { top: '16px' }    : { bottom: '16px' }),
            ...(corner.includes('Left')   ? { left: '16px' }   : { right: '16px' }),
            borderTop:    corner.includes('top')    ? '1px solid rgba(0,255,136,0.3)' : 'none',
            borderBottom: corner.includes('bottom') ? '1px solid rgba(0,255,136,0.3)' : 'none',
            borderLeft:   corner.includes('Left')   ? '1px solid rgba(0,255,136,0.3)' : 'none',
            borderRight:  corner.includes('Right')  ? '1px solid rgba(0,255,136,0.3)' : 'none',
          }} />
        ))}
      </div>

      <div style={{ width: '100%', maxWidth: '380px' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{
            display: 'inline-block',
            padding: '10px 20px',
            border: '1px solid rgba(0,255,136,0.25)',
            marginBottom: '16px',
          }}>
            <span style={{ color: '#00ff88', fontSize: '10px', letterSpacing: '0.25em' }}>
              ◈ COMMAND CENTER
            </span>
          </div>
          <h1 style={{
            color: 'rgba(200,214,229,0.9)',
            fontSize: '18px',
            fontWeight: 400,
            letterSpacing: '0.2em',
            margin: '0 0 4px',
          }}>
            PAMTAS RI-MAL
          </h1>
          <p style={{ color: 'rgba(200,214,229,0.35)', fontSize: '10px', letterSpacing: '0.15em', margin: 0 }}>
            YONKAV 8/NSW • KALIMANTAN UTARA
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Email */}
          <div>
            <label style={{
              display: 'block',
              color: 'rgba(0,255,136,0.6)',
              fontSize: '10px',
              letterSpacing: '0.15em',
              marginBottom: '6px',
            }}>
              EMAIL
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              autoComplete="username"
              placeholder="operator@pamtas.mil.id"
              style={{
                width: '100%',
                background: 'rgba(0,255,136,0.04)',
                border: '1px solid rgba(0,255,136,0.2)',
                borderRadius: '3px',
                padding: '10px 12px',
                color: 'rgba(200,214,229,0.9)',
                fontSize: '12px',
                fontFamily: 'monospace',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>

          {/* Password */}
          <div>
            <label style={{
              display: 'block',
              color: 'rgba(0,255,136,0.6)',
              fontSize: '10px',
              letterSpacing: '0.15em',
              marginBottom: '6px',
            }}>
              PASSWORD
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              placeholder="••••••••"
              style={{
                width: '100%',
                background: 'rgba(0,255,136,0.04)',
                border: '1px solid rgba(0,255,136,0.2)',
                borderRadius: '3px',
                padding: '10px 12px',
                color: 'rgba(200,214,229,0.9)',
                fontSize: '12px',
                fontFamily: 'monospace',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>

          {/* Error message */}
          {error && (
            <div style={{
              background: 'rgba(255,51,51,0.08)',
              border: '1px solid rgba(255,51,51,0.25)',
              borderRadius: '3px',
              padding: '10px 12px',
              color: 'rgba(255,100,100,0.9)',
              fontSize: '11px',
              letterSpacing: '0.05em',
              lineHeight: 1.5,
            }}>
              ⚠ {error}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            style={{
              marginTop: '8px',
              padding: '12px',
              background: loading ? 'rgba(0,255,136,0.05)' : 'rgba(0,255,136,0.1)',
              border: '1px solid rgba(0,255,136,0.3)',
              borderRadius: '3px',
              color: loading ? 'rgba(0,255,136,0.4)' : '#00ff88',
              fontSize: '11px',
              letterSpacing: '0.2em',
              fontFamily: 'monospace',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s',
            }}
          >
            {loading ? 'AUTENTIKASI...' : 'MASUK SISTEM'}
          </button>
        </form>

        {/* Footer */}
        <p style={{
          textAlign: 'center',
          color: 'rgba(200,214,229,0.2)',
          fontSize: '10px',
          letterSpacing: '0.1em',
          marginTop: '32px',
        }}>
          AKSES TERBATAS • PERSONEL BERWENANG
        </p>
      </div>
    </div>
  )
}
