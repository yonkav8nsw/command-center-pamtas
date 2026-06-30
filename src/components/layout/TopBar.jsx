import { useState, useEffect } from 'react'
import { useApp } from '../../context/AppContext'
import { useAuth } from '../../context/AuthContext'
import { exportToPDF } from '../../utils/exportPDF'

/**
 * TopBar Component - Navigation Component
 *
 * Design System Foundation v2.0
 * Motion Bible Compliance:
 * - Button hover: 100ms ease-out
 * - Active state: instant
 * - Focus ring: 100ms ease-out
 *
 * Features:
 * - Clock display with live time
 * - Sidebar toggle
 * - User info with role badge
 * - Action buttons (presentation, fullscreen, print, logout)
 */

export function TopBar({ minimal = false }) {
  const { toggleSidebar, togglePresentation, presentationMode, sidebarOpen } = useApp()
  const { profile, signOut } = useAuth()
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const id = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  const hh = currentTime.toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  })
  const hari = currentTime.toLocaleDateString('id-ID', { weekday: 'short' }).toUpperCase()
  const tgl = currentTime.toLocaleDateString('id-ID', { day: '2-digit' })
  const bulan = currentTime.toLocaleDateString('id-ID', { month: 'long' }).toUpperCase()
  const tahun = currentTime.getFullYear()

  // Minimal mode: only hamburger, transparent background
  if (minimal) {
    return (
      <header
        className="relative flex items-center h-12 px-3 flex-shrink-0 z-20"
        style={{
          background: 'transparent',
        }}
      >
        {/* Sidebar toggle only */}
        <TopBarButton
          onClick={toggleSidebar}
          title={sidebarOpen ? 'Tutup Sidebar' : 'Buka Sidebar'}
          variant="ghost"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </TopBarButton>
      </header>
    )
  }

  return (
    <header
      className="relative flex items-center justify-between h-12 px-3 flex-shrink-0 z-20"
      style={{
        backgroundColor: 'var(--surface-base)',
        borderBottom: '1px solid var(--border-subtle)',
        boxShadow: '0 1px 0 rgba(0,255,136,0.08), 0 2px 12px rgba(0,0,0,0.6)',
        transition: 'box-shadow var(--duration-normal) var(--ease-out)',
      }}
    >
      {/* Glow line top */}
      <div
        className="absolute top-0 left-0 right-0 h-px pointer-events-none"
        style={{
          background: 'linear-gradient(90deg, transparent, var(--accent-primary), transparent)',
          opacity: 0.3,
        }}
      />

      {/* ── LEFT: hamburger + badge + clock ─────────────────── */}
      <div className="flex items-center gap-2 min-w-0">
        {/* Sidebar toggle */}
        <TopBarButton
          onClick={toggleSidebar}
          title={sidebarOpen ? 'Tutup Sidebar' : 'Buka Sidebar'}
          variant="ghost"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </TopBarButton>

        {/* Badge icon — Logo with glitch effect */}
        <div className="w-7 h-7 flex-shrink-0 relative flex items-center justify-center">
          <img
            src={`${import.meta.env.BASE_URL}logo-satgas.png`}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 w-full h-full object-contain logo-glitch-cyan"
          />
          <img
            src={`${import.meta.env.BASE_URL}logo-satgas.png`}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 w-full h-full object-contain logo-glitch-magenta"
          />
          <img
            src={`${import.meta.env.BASE_URL}logo-satgas.png`}
            alt="Logo Batam"
            className="w-full h-full object-contain relative"
            style={{ zIndex: 1 }}
          />
          <div
            className="absolute inset-0 logo-glitch-scanline"
            style={{ zIndex: 2, pointerEvents: 'none' }}
          />
        </div>

        {/* Clock + Date */}
        <div className="flex flex-col select-none">
          <span
            className="font-mono font-bold tracking-[0.15em] leading-none"
            style={{
              fontSize: '12px',
              color: 'var(--accent-primary)',
              textShadow: '0 0 10px rgba(0,255,136,0.5)',
              whiteSpace: 'nowrap',
            }}
          >
            {hh}
          </span>
          <div
            className="font-mono leading-tight mt-0.5 text-center w-full"
            style={{
              fontSize: '8px',
              color: 'var(--text-tertiary)',
              whiteSpace: 'nowrap',
            }}
          >
            {hari}, {tgl} {bulan} {tahun}
          </div>
        </div>
      </div>

      {/* ── CENTER: title ─────────────────────────────────── */}
      <div
        className="hidden md:flex flex-col items-center absolute left-1/2 -translate-x-1/2 select-none pointer-events-none"
      >
        <h1
          className="font-bold leading-tight tracking-[0.2em] uppercase"
          style={{
            fontSize: '12px',
            color: 'var(--accent-primary)',
            textShadow: '0 0 12px rgba(0,255,136,0.5)',
          }}
        >
          COMMAND CENTER SATGAS PAMTAS RI-MLY
        </h1>
        <p
          className="tracking-[0.18em] uppercase mt-0.5"
          style={{
            fontSize: '8px',
            color: 'var(--text-tertiary)',
          }}
        >
          YONKAV 8/NSW · TA 2026 · KALIMANTAN UTARA
        </p>
      </div>

      {/* ── RIGHT: actions ────────────────────────────────── */}
      <div className="flex items-center gap-1 flex-shrink-0">
        {/* User info pill */}
        {profile && (
          <div
            className="hidden sm:flex items-center gap-1.5 px-2 py-1 rounded-sm mr-1"
            style={{
              background: 'var(--accent-muted)',
              border: '1px solid var(--accent-muted)',
            }}
          >
            <div
              className="w-1.5 h-1.5 rounded-full"
              style={{
                backgroundColor: 'var(--accent-primary)',
                boxShadow: '0 0 4px rgba(0,255,136,0.8)',
              }}
            />
            <span
              className="font-mono tracking-wider uppercase truncate max-w-[80px]"
              style={{
                fontSize: '9px',
                color: 'rgba(0,255,136,0.7)',
              }}
            >
              {profile.nama || profile.role}
            </span>
            <span
              className="text-micro-xs px-1 py-0.5 rounded-sm uppercase tracking-wider flex-shrink-0"
              style={
                profile.role === 'admin'
                  ? {
                      color: 'var(--color-warning)',
                      background: 'var(--color-warning-subtle)',
                      border: '1px solid var(--color-warning-subtle)',
                    }
                  : profile.role === 'operator'
                    ? {
                        color: 'var(--color-info)',
                        background: 'var(--color-info-subtle)',
                        border: '1px solid var(--color-info-subtle)',
                      }
                    : {
                        color: 'var(--text-tertiary)',
                        background: 'var(--surface-muted)',
                        border: '1px solid var(--surface-muted)',
                      }
              }
            >
              {profile.role}
            </span>
          </div>
        )}

        {/* Presentation mode */}
        <TopBarButton
          onClick={togglePresentation}
          title={presentationMode ? 'Exit Presentasi' : 'Mode Presentasi'}
          variant={presentationMode ? 'active' : 'ghost'}
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
        </TopBarButton>

        {/* Fullscreen */}
        <TopBarButton
          onClick={() => {
            try {
              if (!document.fullscreenElement) {
                document.documentElement.requestFullscreen().catch(() => {})
              } else {
                document.exitFullscreen().catch(() => {})
              }
            } catch {
              // requestFullscreen tidak didukung browser ini
            }
          }}
          title="Fullscreen"
          variant="ghost"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
            />
          </svg>
        </TopBarButton>

        {/* Print */}
        <TopBarButton
          onClick={() => exportToPDF('Command Center Batam Satgat RI-MLY TA 2026')}
          title="Print / Export PDF"
          variant="ghost"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
            />
          </svg>
        </TopBarButton>

        {/* Logout */}
        <TopBarButton
          onClick={signOut}
          title="Logout"
          variant="danger"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
        </TopBarButton>
      </div>
    </header>
  )
}

/* ── TopBar Button ──────────────────────────────────────────── */
function TopBarButton({
  onClick,
  title,
  variant = 'ghost',
  children,
}) {
  const [isHovered, setIsHovered] = useState(false)

  const getStyles = () => {
    switch (variant) {
      case 'danger':
        return {
          base: {
            border: '1px solid transparent',
            color: 'rgba(255,59,59,0.4)',
          },
          hover: {
            border: '1px solid rgba(255,59,59,0.3)',
            color: 'var(--color-danger)',
            background: 'var(--color-danger-subtle)',
          },
        }
      case 'active':
        return {
          base: {
            border: '1px solid var(--accent-primary)',
            color: 'var(--accent-primary)',
            background: 'var(--accent-muted)',
          },
          hover: {
            border: '1px solid var(--accent-primary)',
            color: 'var(--accent-primary)',
            background: 'var(--accent-muted)',
          },
        }
      case 'ghost':
      default:
        return {
          base: {
            border: '1px solid transparent',
            color: 'var(--text-tertiary)',
          },
          hover: {
            border: '1px solid var(--accent-muted)',
            color: 'var(--accent-primary)',
            background: 'var(--accent-muted)',
          },
        }
    }
  }

  const styles = getStyles()
  const currentStyles = isHovered ? styles.hover : styles.base

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      title={title}
      className="p-1.5 rounded-sm"
      style={{
        ...currentStyles,
        transition: 'all var(--duration-fast) var(--ease-out)',
        cursor: 'pointer',
      }}
    >
      {children}
    </button>
  )
}