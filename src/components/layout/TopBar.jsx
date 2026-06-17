import { useState, useEffect } from 'react'
import { useApp } from '../../context/AppContext'
import { exportToPDF } from '../../utils/exportPDF'

export function TopBar() {
  const { toggleSidebar, togglePresentation, presentationMode, sidebarOpen } = useApp()
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

        {/* Badge icon */}
        <div className="w-7 h-7 flex-shrink-0 flex items-center justify-center rounded-sm border border-[rgba(0,255,136,0.2)] bg-[rgba(0,0,0,0.4)]">
          <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="#00ff88">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
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
          COMMAND CENTER SATGAS PAMTAS RI-MAL
        </h1>
        <p className="text-[8px] tracking-[0.18em] uppercase mt-0.5"
          style={{ color: 'rgba(200,214,229,0.35)' }}>
          YONKAV 8/NSW · TA 2026 · KALIMANTAN UTARA
        </p>
      </div>

      {/* ── RIGHT: actions ────────────────────────────────── */}
      <div className="topbar-nav flex items-center gap-1 flex-shrink-0">

        {/* Telemetry pills */}
        <div className="hidden lg:flex items-center gap-2 mr-2">
          <TelePill label="SYS" value="ONLINE" color="green" />
          <TelePill label="SYNC" value="AUTO" color="blue" />
          <TelePill label="LAST" value="--:--" color="amber" />
        </div>

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
            if (!document.fullscreenElement) document.documentElement.requestFullscreen()
            else document.exitFullscreen()
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
          onClick={() => exportToPDF('Command Center Satgas Pamtas RI-MAL TA 2026')}
          title="Print / Export PDF"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
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

function HudIconBtn({ onClick, title, active, children }) {
  return (
    <button
      onClick={onClick}
      title={title}
      className={`p-1.5 rounded-sm border transition-all ${
        active
          ? 'border-[rgba(0,255,136,0.6)] text-[#00ff88] bg-[rgba(0,255,136,0.12)]'
          : 'border-transparent text-[rgba(200,214,229,0.35)] hover:text-[#00ff88] hover:border-[rgba(0,255,136,0.3)] hover:bg-[rgba(0,255,136,0.06)]'
      }`}
    >
      {children}
    </button>
  )
}
