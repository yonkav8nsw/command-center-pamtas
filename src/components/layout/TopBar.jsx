import { useState, useEffect } from 'react'
import { useApp } from '../../context/AppContext'
import { useAuth } from '../../context/AuthContext'
import { exportToPDF } from '../../utils/exportPDF'

export function TopBar() {
  const { toggleSidebar, togglePresentation, presentationMode, sidebarOpen } = useApp()
  const { profile, signOut } = useAuth()
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const id = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  const hh    = currentTime.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })
  const hari  = currentTime.toLocaleDateString('id-ID', { weekday: 'short' }).toUpperCase()
  const tgl   = currentTime.toLocaleDateString('id-ID', { day: '2-digit' })
  const bulan = currentTime.toLocaleDateString('id-ID', { month: 'long' }).toUpperCase()
  const tahun = currentTime.getFullYear()

  return (
    <header className="relative flex items-center justify-between h-12 px-3 flex-shrink-0 z-20
      bg-[#040b06] border-b border-[rgba(0,255,136,0.18)]"
      style={{ boxShadow: '0 1px 0 rgba(0,255,136,0.08), 0 2px 12px rgba(0,0,0,0.6)' }}
    >
      {/* Glow line top */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#00ff88] to-transparent opacity-30 pointer-events-none" />

      {/* ── LEFT: hamburger + badge + clock ─────────────────── */}
      <div className="flex items-center gap-2 min-w-0">
        <button
          onClick={toggleSidebar}
          className="text-[rgba(0,255,136,0.4)] hover:text-[#00ff88] p-1.5 transition-colors flex-shrink-0"
          title={sidebarOpen ? 'Tutup Sidebar' : 'Buka Sidebar'}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* Badge icon — Logo Satgas dengan efek glitch */}
        <div className="w-7 h-7 flex-shrink-0 relative flex items-center justify-center logo-glitch-wrap">
          {/* Layer cyan — geser kiri */}
          <img
            src={`${import.meta.env.BASE_URL}logo-satgas.png`}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 w-full h-full object-contain logo-glitch-cyan"
          />
          {/* Layer magenta — geser kanan */}
          <img
            src={`${import.meta.env.BASE_URL}logo-satgas.png`}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 w-full h-full object-contain logo-glitch-magenta"
          />
          {/* Layer utama */}
          <img
            src={`${import.meta.env.BASE_URL}logo-satgas.png`}
            alt="Logo Satgas"
            className="w-full h-full object-contain relative logo-glitch-main"
            style={{ zIndex: 1 }}
          />
          {/* Scanline overlay */}
          <div className="absolute inset-0 logo-glitch-scanline" style={{ zIndex: 2, pointerEvents: 'none' }} />
        </div>

        {/* Clock + Date — container auto-sizes to clock text width */}
        <div className="flex flex-col select-none" style={{ display: 'inline-flex', width: 'max-content' }}>
          <span className="font-mono font-bold text-[#00ff88] tracking-[0.15em] leading-none text-xs"
            style={{ textShadow: '0 0 10px rgba(0,255,136,0.5)', whiteSpace: 'nowrap' }}>
            {hh}
          </span>
          <div className="font-mono text-[rgba(200,214,229,0.35)] text-[8px] leading-tight mt-0.5
            text-center w-full" style={{ whiteSpace: 'nowrap' }}>
            {hari}, {tgl} {bulan} {tahun}
          </div>
        </div>
      </div>

      {/* ── CENTER: title ─────────────────────────────────── */}
      <div className="hidden md:flex flex-col items-center absolute left-1/2 -translate-x-1/2 select-none pointer-events-none">
        <h1 className="font-bold text-xs leading-tight tracking-[0.2em] uppercase text-[#00ff88]"
          style={{ textShadow: '0 0 12px rgba(0,255,136,0.5)' }}>
          COMMAND CENTER SATGAS PAMTAS RI-MLY
        </h1>
        <p className="text-[8px] tracking-[0.18em] uppercase mt-0.5"
          style={{ color: 'rgba(200,214,229,0.35)' }}>
          YONKAV 8/NSW · TA 2026 · KALIMANTAN UTARA
        </p>
      </div>

      {/* ── RIGHT: actions ────────────────────────────────── */}
      <div className="topbar-nav flex items-center gap-1 flex-shrink-0">

        {/* User info pill */}
        {profile && (
          <div className="hidden sm:flex items-center gap-1.5 px-2 py-1 rounded-sm mr-1"
            style={{
              background: 'rgba(0,255,136,0.05)',
              border: '1px solid rgba(0,255,136,0.15)',
            }}
          >
            <div className="w-1.5 h-1.5 rounded-full bg-[#00ff88] flex-shrink-0"
              style={{ boxShadow: '0 0 4px rgba(0,255,136,0.8)' }} />
            <span className="font-mono text-[9px] text-[rgba(0,255,136,0.7)] tracking-wider uppercase truncate max-w-[80px]">
              {profile.nama || profile.role}
            </span>
            <span className="text-[8px] px-1 py-0.5 rounded-sm uppercase tracking-wider flex-shrink-0"
              style={{
                color: profile.role === 'admin' ? '#ffaa00' : profile.role === 'operator' ? '#4488ff' : 'rgba(200,214,229,0.4)',
                background: profile.role === 'admin' ? 'rgba(255,170,0,0.1)' : profile.role === 'operator' ? 'rgba(68,136,255,0.1)' : 'rgba(200,214,229,0.05)',
                border: `1px solid ${profile.role === 'admin' ? 'rgba(255,170,0,0.25)' : profile.role === 'operator' ? 'rgba(68,136,255,0.25)' : 'rgba(200,214,229,0.1)'}`,
              }}
            >
              {profile.role}
            </span>
          </div>
        )}

        {/* Presentasi */}
        <HudIconBtn
          onClick={togglePresentation}
          title={presentationMode ? 'Exit Presentasi' : 'Mode Presentasi'}
          active={presentationMode}
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </HudIconBtn>

        {/* Fullscreen */}
        <HudIconBtn
          onClick={() => {
            try {
              if (!document.fullscreenElement) {
                document.documentElement.requestFullscreen().catch(() => {})
              } else {
                document.exitFullscreen().catch(() => {})
              }
            } catch {
              // requestFullscreen tidak didukung browser ini — abaikan
            }
          }}
          title="Fullscreen"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
          </svg>
        </HudIconBtn>

        {/* Print */}
        <HudIconBtn
          onClick={() => exportToPDF('Command Center Satgas Pamtas RI-MLY TA 2026')}
          title="Print / Export PDF"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
          </svg>
        </HudIconBtn>

        {/* Logout */}
        <HudIconBtn
          onClick={signOut}
          title="Logout"
          danger
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
        </HudIconBtn>
      </div>
    </header>
  )
}

function TelePill({ label, value, color }) {
  const colors = {
    green: 'text-[#00ff88] border-[rgba(0,255,136,0.25)]',
    blue:  'text-[#4488ff] border-[rgba(68,136,255,0.25)]',
    amber: 'text-[#ffaa00] border-[rgba(255,170,0,0.25)]',
  }
  return (
    <div className={`flex items-center gap-1 px-2 py-0.5 border rounded-sm bg-[rgba(0,0,0,0.3)] ${colors[color]}`}>
      <span className="text-[8px] tracking-[0.1em] text-[rgba(200,214,229,0.35)]">{label}</span>
      <span className="text-[9px] font-mono font-bold tracking-wider">{value}</span>
    </div>
  )
}

function HudIconBtn({ onClick, title, active, danger, children }) {
  return (
    <button
      onClick={onClick}
      title={title}
      className={`p-1.5 rounded-sm border transition-all ${
        danger
          ? 'border-transparent text-[rgba(255,51,51,0.4)] hover:text-[#ff3333] hover:border-[rgba(255,51,51,0.3)] hover:bg-[rgba(255,51,51,0.06)]'
          : active
            ? 'border-[rgba(0,255,136,0.6)] text-[#00ff88] bg-[rgba(0,255,136,0.12)]'
            : 'border-transparent text-[rgba(200,214,229,0.35)] hover:text-[#00ff88] hover:border-[rgba(0,255,136,0.3)] hover:bg-[rgba(0,255,136,0.06)]'
      }`}
    >
      {children}
    </button>
  )
}
