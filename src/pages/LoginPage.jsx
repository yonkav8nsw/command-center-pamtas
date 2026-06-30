import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

// ── Glitch + scan keyframes ──────────────────────────────────────────────────
const GLITCH_CSS = `
@keyframes glitch-clip-1 {
  0%   { clip-path: inset(0 0 95% 0); transform: translate(-2px, 0); }
  20%  { clip-path: inset(30% 0 50% 0); transform: translate(2px, 0); }
  40%  { clip-path: inset(70% 0 5% 0); transform: translate(-1px, 0); }
  60%  { clip-path: inset(10% 0 80% 0); transform: translate(3px, 0); }
  80%  { clip-path: inset(55% 0 20% 0); transform: translate(-2px, 0); }
  100% { clip-path: inset(0 0 95% 0); transform: translate(0, 0); }
}
@keyframes glitch-clip-2 {
  0%   { clip-path: inset(50% 0 30% 0); transform: translate(2px, 0);  color: #ff3366; }
  25%  { clip-path: inset(15% 0 70% 0); transform: translate(-3px, 0); color: #00ffff; }
  50%  { clip-path: inset(80% 0 5% 0);  transform: translate(1px, 0);  color: #ff3366; }
  75%  { clip-path: inset(5% 0 85% 0);  transform: translate(-1px, 0); color: #00ffff; }
  100% { clip-path: inset(50% 0 30% 0); transform: translate(0, 0);    color: #ff3366; }
}
@keyframes glitch-flicker {
  0%, 100% { opacity: 1; }
  92%  { opacity: 1; }
  93%  { opacity: 0.4; }
  94%  { opacity: 1; }
  96%  { opacity: 0.6; }
  97%  { opacity: 1; }
}
@keyframes login-scan {
  0%   { top: -10%; }
  100% { top: 110%; }
}
@keyframes badge-pulse {
  0%, 100% { box-shadow: 0 0 0px rgba(0,255,136,0); }
  50%       { box-shadow: 0 0 14px rgba(0,255,136,0.4); }
}
@keyframes card-appear {
  from { opacity: 0; transform: translateY(12px) scale(0.98); }
  to   { opacity: 1; transform: translateY(0) scale(1); }
}
@keyframes cursor-blink {
  0%, 100% { opacity: 1; }
  50%       { opacity: 0; }
}
@keyframes terminal-in {
  from { opacity: 0; transform: translateX(-4px); }
  to   { opacity: 1; transform: translateX(0); }
}
`

function injectGlitchStyles() {
  if (document.getElementById('glitch-styles')) return
  const style = document.createElement('style')
  style.id = 'glitch-styles'
  style.textContent = GLITCH_CSS
  document.head.appendChild(style)
}

// ── Matrix code-rain canvas ──────────────────────────────────────────────────
function MatrixCanvas() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    const resize = () => {
      canvas.width  = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    // Karakter: kombinasi katakana + hex + latin
    const CHARS = 'アイウエオカキクケコサシスセソタチツテトナニヌネノ0123456789ABCDEF<>/{}[]='
    const FONT_SIZE = 13
    const cols = Math.floor(canvas.width / FONT_SIZE)
    const drops = Array.from({ length: cols }, () => Math.random() * -50)

    let frame = 0
    const interval = setInterval(() => {
      frame++
      // Fade trail — sangat transparan supaya tidak dominan
      ctx.fillStyle = 'rgba(5,8,16,0.08)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      for (let i = 0; i < drops.length; i++) {
        const char = CHARS[Math.floor(Math.random() * CHARS.length)]
        const x = i * FONT_SIZE
        const y = drops[i] * FONT_SIZE

        // Karakter head (paling terang)
        if (drops[i] > 0) {
          ctx.font = `${FONT_SIZE}px 'JetBrains Mono', monospace`
          // Head char — putih/cyan terang
          ctx.fillStyle = drops[i] > 1 ? 'rgba(180,255,220,0.85)' : 'rgba(0,255,136,0.9)'
          ctx.fillText(char, x, y)
        }

        // Reset ke atas setelah melewati bawah
        if (y > canvas.height && Math.random() > 0.975) {
          drops[i] = 0
        }
        drops[i] += 0.5
      }
    }, 50)

    return () => {
      clearInterval(interval)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0, left: 0,
        width: '100%', height: '100%',
        opacity: 0.18,
        pointerEvents: 'none',
        zIndex: 0,
      }}
    />
  )
}

// ── Typewriter hook ──────────────────────────────────────────────────────────
function useTypewriter(text, speed = 75, startDelay = 500) {
  const [displayed, setDisplayed] = useState('')
  const [done, setDone]           = useState(false)

  useEffect(() => {
    setDisplayed('')
    setDone(false)
    let i = 0
    const timeout = setTimeout(() => {
      const interval = setInterval(() => {
        i++
        setDisplayed(text.slice(0, i))
        if (i >= text.length) { clearInterval(interval); setDone(true) }
      }, speed)
      return () => clearInterval(interval)
    }, startDelay)
    return () => clearTimeout(timeout)
  }, [text, speed, startDelay])

  return { displayed, done }
}

// ── GlitchText ───────────────────────────────────────────────────────────────
function GlitchText({ text, style: outerStyle }) {
  const active = useRef(false)
  const [glitching, setGlitching] = useState(false)

  useEffect(() => {
    active.current = true
    function scheduleNext() {
      if (!active.current) return
      const delay = 2500 + Math.random() * 4000
      setTimeout(() => {
        if (!active.current) return
        setGlitching(true)
        setTimeout(() => {
          if (!active.current) return
          setGlitching(false)
          scheduleNext()
        }, 180 + Math.random() * 120)
      }, delay)
    }
    scheduleNext()
    return () => { active.current = false }
  }, [])

  const base = {
    position: 'relative',
    display: 'inline-block',
    animation: 'glitch-flicker 6s infinite',
    ...outerStyle,
  }
  const pseudo = { position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }

  return (
    <span style={base}>
      {text}
      {glitching && (
        <>
          <span aria-hidden style={{ ...pseudo, animation: 'glitch-clip-1 0.18s steps(1) infinite', color: '#00ffff', mixBlendMode: 'screen' }}>{text}</span>
          <span aria-hidden style={{ ...pseudo, animation: 'glitch-clip-2 0.18s steps(1) infinite', mixBlendMode: 'screen' }}>{text}</span>
        </>
      )}
    </span>
  )
}

// ── Terminal log lines ───────────────────────────────────────────────────────
const BOOT_LINES = [
  { delay: 200,  text: 'NARASINGA-OPS v2.6 :: BOOT SEQUENCE INITIATED', color: 'rgba(0,255,136,0.7)' },
  { delay: 600,  text: 'Loading tactical modules...', color: 'rgba(200,214,229,0.35)' },
  { delay: 1000, text: '[OK] Map engine loaded', color: 'rgba(0,255,136,0.45)' },
  { delay: 1300, text: '[OK] Supabase realtime connected', color: 'rgba(0,255,136,0.45)' },
  { delay: 1600, text: '[OK] RLS policies active', color: 'rgba(0,255,136,0.45)' },
  { delay: 2000, text: 'NARASINGA OPERATION CENTER :: READY', color: 'rgba(0,255,136,0.6)' },
  { delay: 2300, text: 'Awaiting operator authentication...', color: 'rgba(255,170,0,0.6)' },
]

function TerminalLog() {
  const [visible, setVisible] = useState([])

  useEffect(() => {
    const timers = BOOT_LINES.map((line, i) =>
      setTimeout(() => setVisible(v => [...v, i]), line.delay)
    )
    return () => timers.forEach(clearTimeout)
  }, [])

  return (
    <div style={{
      fontFamily: "'JetBrains Mono', 'Courier New', monospace",
      fontSize: '9px',
      letterSpacing: '0.06em',
      lineHeight: '1.8',
      padding: '12px 14px',
      background: 'rgba(0,0,0,0.35)',
      border: '1px solid rgba(0,255,136,0.1)',
      borderRadius: '2px',
      marginBottom: '20px',
      minHeight: '112px',
    }}>
      {BOOT_LINES.map((line, i) => (
        <div key={i} style={{
          color: visible.includes(i) ? line.color : 'transparent',
          animation: visible.includes(i) ? 'terminal-in 0.2s ease' : 'none',
          transition: 'color 0.1s',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}>
          <span style={{ color: 'rgba(0,255,136,0.3)', marginRight: '6px' }}>$</span>
          {line.text}
        </div>
      ))}
      {visible.length >= BOOT_LINES.length && (
        <div style={{ color: 'rgba(0,255,136,0.5)', marginTop: '2px' }}>
          <span style={{ color: 'rgba(0,255,136,0.3)' }}>$ </span>
          <span style={{ animation: 'cursor-blink 1s step-end infinite', borderRight: '1px solid rgba(0,255,136,0.6)', paddingRight: '2px' }} />
        </div>
      )}
    </div>
  )
}

// ── Main component ───────────────────────────────────────────────────────────
export default function LoginPage() {
  const { signIn } = useAuth()
  const navigate   = useNavigate()

  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [error,    setError]    = useState(null)
  const [loading,  setLoading]  = useState(false)

  const { displayed, done } = useTypewriter('NARASINGA OPERATION CENTER', 70, 800)

  useEffect(() => { injectGlitchStyles() }, [])

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
      background: '#030608',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: "'JetBrains Mono', 'Courier New', monospace",
      padding: '24px',
      overflow: 'hidden',
      position: 'relative',
    }}>

      {/* ── Matrix code rain ── */}
      <MatrixCanvas />

      {/* ── Grid dot overlay ── */}
      <div style={{
        position: 'fixed',
        inset: 0,
        backgroundImage: `radial-gradient(rgba(0,255,136,0.12) 1px, transparent 1px)`,
        backgroundSize: '28px 28px',
        pointerEvents: 'none',
        zIndex: 1,
        opacity: 0.5,
      }} />

      {/* ── Vignette ── */}
      <div style={{
        position: 'fixed',
        inset: 0,
        background: 'radial-gradient(ellipse at center, transparent 40%, rgba(3,6,8,0.85) 100%)',
        pointerEvents: 'none',
        zIndex: 2,
      }} />

      {/* ── Scan line ── */}
      <div style={{
        position: 'fixed',
        left: 0, right: 0,
        height: '2px',
        background: 'linear-gradient(90deg, transparent, rgba(0,255,136,0.15), transparent)',
        animation: 'login-scan 6s linear infinite',
        pointerEvents: 'none',
        zIndex: 3,
      }} />

      {/* ── Corner brackets ── */}
      {[
        { top: '16px',   left: '16px',   borderTop: '1px solid rgba(0,255,136,0.25)', borderLeft:  '1px solid rgba(0,255,136,0.25)' },
        { top: '16px',   right: '16px',  borderTop: '1px solid rgba(0,255,136,0.25)', borderRight: '1px solid rgba(0,255,136,0.25)' },
        { bottom: '16px',left: '16px',   borderBottom: '1px solid rgba(0,255,136,0.25)', borderLeft: '1px solid rgba(0,255,136,0.25)' },
        { bottom: '16px',right: '16px',  borderBottom: '1px solid rgba(0,255,136,0.25)', borderRight: '1px solid rgba(0,255,136,0.25)' },
      ].map((s, i) => (
        <div key={i} style={{ position: 'fixed', width: '28px', height: '28px', pointerEvents: 'none', zIndex: 3, ...s }} />
      ))}

      {/* ── Card glassmorphism ── */}
      <div style={{
        width: '100%',
        maxWidth: '420px',
        position: 'relative',
        zIndex: 10,
        animation: 'card-appear 0.4s ease',
        background: 'rgba(5,10,8,0.78)',
        border: '1px solid rgba(0,255,136,0.18)',
        borderRadius: '4px',
        backdropFilter: 'blur(18px)',
        WebkitBackdropFilter: 'blur(18px)',
        boxShadow: '0 0 60px rgba(0,0,0,0.7), 0 0 30px rgba(0,255,136,0.06), inset 0 1px 0 rgba(0,255,136,0.08)',
        padding: '32px 32px 28px',
      }}>

        {/* Top accent bar */}
        <div style={{
          position: 'absolute',
          top: 0, left: '10%', right: '10%',
          height: '1px',
          background: 'linear-gradient(90deg, transparent, rgba(0,255,136,0.5), transparent)',
        }} />

        {/* ── Header ── */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>

          {/* Badge - Enhanced NARASINGA OPERATION CENTER */}
          <div style={{
            display: 'inline-block',
            padding: '8px 24px',
            marginBottom: '20px',
            background: 'rgba(0,255,136,0.08)',
            border: '1px solid rgba(0,255,136,0.35)',
            borderRadius: '2px',
            position: 'relative',
            animation: 'badge-pulse 3s ease-in-out infinite',
            boxShadow: '0 0 20px rgba(0,255,136,0.15), inset 0 0 20px rgba(0,255,136,0.05)',
          }}>
            {/* Corner accents */}
            <div style={{
              position: 'absolute',
              top: '-1px', left: '-1px',
              width: '8px', height: '8px',
              borderTop: '2px solid #00ff88',
              borderLeft: '2px solid #00ff88',
            }} />
            <div style={{
              position: 'absolute',
              top: '-1px', right: '-1px',
              width: '8px', height: '8px',
              borderTop: '2px solid #00ff88',
              borderRight: '2px solid #00ff88',
            }} />
            <div style={{
              position: 'absolute',
              bottom: '-1px', left: '-1px',
              width: '8px', height: '8px',
              borderBottom: '2px solid #00ff88',
              borderLeft: '2px solid #00ff88',
            }} />
            <div style={{
              position: 'absolute',
              bottom: '-1px', right: '-1px',
              width: '8px', height: '8px',
              borderBottom: '2px solid #00ff88',
              borderRight: '2px solid #00ff88',
            }} />
            <span style={{
              color: '#00ff88',
              fontSize: '11px',
              fontWeight: 600,
              letterSpacing: '0.25em',
              textShadow: '0 0 10px rgba(0,255,136,0.5), 0 0 20px rgba(0,255,136,0.3)',
            }}>
              ◈ NARASINGA OPERATION CENTER
            </span>
          </div>

          {/* Title */}
          <h1 style={{
            fontSize: '17px',
            fontWeight: 400,
            letterSpacing: '0.22em',
            margin: '0 0 6px',
            minHeight: '26px',
          }}>
            {done ? (
              <GlitchText text="NARASINGA OPERATION CENTER" style={{ color: 'rgba(200,214,229,0.92)', fontSize: '14px', letterSpacing: '0.18em' }} />
            ) : (
              <span style={{ color: 'rgba(200,214,229,0.92)' }}>
                {displayed}
                <span style={{
                  display: 'inline-block',
                  width: '2px', height: '1em',
                  background: '#00ff88',
                  marginLeft: '2px',
                  verticalAlign: 'text-bottom',
                  animation: 'cursor-blink 0.8s step-end infinite',
                }} />
              </span>
            )}
          </h1>

          <p style={{ color: 'rgba(200,214,229,0.3)', fontSize: '9px', letterSpacing: '0.15em', margin: 0 }}>
            YONKAV 8/NSW · KALIMANTAN UTARA · TA 2026
          </p>
        </div>

        {/* ── Terminal boot log ── */}
        <TerminalLog />

        {/* ── Form ── */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>

          {/* Email */}
          <div>
            <label style={{
              display: 'block',
              color: 'rgba(0,255,136,0.55)',
              fontSize: '9px',
              letterSpacing: '0.18em',
              marginBottom: '6px',
            }}>
              ── OPERATOR ID
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
                border: '1px solid rgba(0,255,136,0.18)',
                borderRadius: '2px',
                padding: '9px 12px',
                color: 'rgba(200,214,229,0.9)',
                fontSize: '12px',
                fontFamily: "'JetBrains Mono', monospace",
                outline: 'none',
                boxSizing: 'border-box',
                transition: 'border-color 0.15s',
              }}
              onFocus={e => e.target.style.borderColor = 'rgba(0,255,136,0.5)'}
              onBlur={e => e.target.style.borderColor = 'rgba(0,255,136,0.18)'}
            />
          </div>

          {/* Password */}
          <div>
            <label style={{
              display: 'block',
              color: 'rgba(0,255,136,0.55)',
              fontSize: '9px',
              letterSpacing: '0.18em',
              marginBottom: '6px',
            }}>
              ── ACCESS KEY
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              placeholder="••••••••••••"
              style={{
                width: '100%',
                background: 'rgba(0,255,136,0.04)',
                border: '1px solid rgba(0,255,136,0.18)',
                borderRadius: '2px',
                padding: '9px 12px',
                color: 'rgba(200,214,229,0.9)',
                fontSize: '12px',
                fontFamily: "'JetBrains Mono', monospace",
                outline: 'none',
                boxSizing: 'border-box',
                transition: 'border-color 0.15s',
              }}
              onFocus={e => e.target.style.borderColor = 'rgba(0,255,136,0.5)'}
              onBlur={e => e.target.style.borderColor = 'rgba(0,255,136,0.18)'}
            />
          </div>

          {/* Error */}
          {error && (
            <div style={{
              background: 'rgba(255,51,51,0.07)',
              border: '1px solid rgba(255,51,51,0.25)',
              borderRadius: '2px',
              padding: '9px 12px',
              color: 'rgba(255,100,100,0.9)',
              fontSize: '10px',
              letterSpacing: '0.06em',
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
              marginTop: '4px',
              padding: '11px',
              background: loading ? 'rgba(0,255,136,0.04)' : 'rgba(0,255,136,0.09)',
              border: `1px solid ${loading ? 'rgba(0,255,136,0.15)' : 'rgba(0,255,136,0.35)'}`,
              borderRadius: '2px',
              color: loading ? 'rgba(0,255,136,0.35)' : '#00ff88',
              fontSize: '10px',
              letterSpacing: '0.25em',
              fontFamily: "'JetBrains Mono', monospace",
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.15s',
              textTransform: 'uppercase',
            }}
            onMouseEnter={e => { if (!loading) { e.target.style.background = 'rgba(0,255,136,0.15)'; e.target.style.boxShadow = '0 0 14px rgba(0,255,136,0.15)' }}}
            onMouseLeave={e => { e.target.style.background = loading ? 'rgba(0,255,136,0.04)' : 'rgba(0,255,136,0.09)'; e.target.style.boxShadow = 'none' }}
          >
            {loading ? '[ MENGAUTENTIKASI... ]' : '[ MASUK SISTEM ]'}
          </button>
        </form>

        {/* ── Footer ── */}
        <div style={{
          marginTop: '22px',
          paddingTop: '14px',
          borderTop: '1px solid rgba(0,255,136,0.08)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <span style={{ color: 'rgba(200,214,229,0.18)', fontSize: '8px', letterSpacing: '0.12em' }}>
            AKSES TERBATAS
          </span>
          <span style={{ color: 'rgba(0,255,136,0.25)', fontSize: '8px', letterSpacing: '0.1em' }}>
            PERSONEL BERWENANG
          </span>
        </div>

        {/* Bottom accent bar */}
        <div style={{
          position: 'absolute',
          bottom: 0, left: '20%', right: '20%',
          height: '1px',
          background: 'linear-gradient(90deg, transparent, rgba(0,255,136,0.3), transparent)',
        }} />

      </div>
    </div>
  )
}
