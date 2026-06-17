import { NavLink } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import { usePos, useAllKerawanan } from '../../hooks/useGasApi'

export function Sidebar() {
  const { sidebarOpen } = useApp()
  const { data: posList, loading } = usePos()
  const { data: kerawanan } = useAllKerawanan()

  const activeKraw = (kerawanan || []).filter(k => k.status === 'aktif').length

  return (
    <aside
      className="sidebar flex-shrink-0 transition-all duration-300 overflow-hidden
        bg-[#040b06] border-r border-[rgba(0,255,136,0.14)]"
      style={{ width: sidebarOpen ? '220px' : '0px' }}
    >
      <div className="w-[220px] flex flex-col h-full overflow-hidden">

        {/* ── Nav Utama ───────────────────────────────── */}
        <nav className="px-2 pt-2 pb-1.5 border-b border-[rgba(0,255,136,0.1)] space-y-px">
          <SectionLabel>NAVIGASI</SectionLabel>
          <NavItem to="/"           icon={<IconMap />}       label="Overview"        end />
          <NavItem to="/kerawanan"  icon={<IconAlert />}     label="Kerawanan"       badge={activeKraw > 0 ? activeKraw : null} badgeDanger />
          <NavItem to="/binter"     icon={<IconHandshake />} label="Program Binter" />
        </nav>

        {/* ── Laporan & Analitik ───────────────────────── */}
        <nav className="px-2 pt-2 pb-1.5 border-b border-[rgba(0,255,136,0.1)] space-y-px">
          <SectionLabel>LAPORAN</SectionLabel>
          <NavItem to="/laporan/kerawanan" icon={<IconChart />}    label="Grafik Kerawanan" />
          <NavItem to="/laporan/binter"    icon={<IconTimeline />} label="Timeline Binter"  />
          <NavItem to="/laporan/demografi" icon={<IconPeople />}   label="Data Demografi"   />
          <NavItem to="/laporan/tokoh"     icon={<IconPerson />}   label="Tokoh Wilayah"    />
        </nav>

        {/* ── 17 Pos Satgas ───────────────────────────── */}
        <div className="flex-1 overflow-y-auto min-h-0">
          <div className="px-3 py-2 sticky top-0 z-10 bg-[#040b06] border-b border-[rgba(0,255,136,0.08)]">
            <div className="flex items-center justify-between">
              <SectionLabel noMargin>17 POS SATGAS</SectionLabel>
              {!loading && (
                <span className="font-mono text-[9px] text-[rgba(0,255,136,0.5)]">
                  {(posList || []).length}/17
                </span>
              )}
            </div>
          </div>

          {loading ? (
            <div className="px-2 pt-2 space-y-1">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="h-9 rounded-sm bg-[rgba(0,255,136,0.04)] animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="px-2 pb-3 pt-1 space-y-px">
              {(posList || []).map((pos) => (
                <PosNavItem key={pos.pos_id} pos={pos} kerawanan={kerawanan || []} />
              ))}
            </div>
          )}
        </div>

        {/* ── Bottom nav ──────────────────────────────── */}
        <nav className="px-2 pt-1 pb-1 border-t border-[rgba(0,255,136,0.1)] space-y-px">
          <NavItem to="/panduan" icon={<IconBook />}     label="Panduan Input" />
          <NavItem to="/admin"   icon={<IconSettings />} label="Pengaturan" />
        </nav>

      </div>
    </aside>
  )
}

/* ── Nav Items ──────────────────────────────────────────── */
function SectionLabel({ children, noMargin }) {
  return (
    <div className={`px-2 ${noMargin ? '' : 'mb-0.5'}`}>
      <span className="text-[8px] font-bold tracking-[0.2em] uppercase text-[rgba(0,255,136,0.35)]">
        {children}
      </span>
    </div>
  )
}

function NavItem({ to, icon, label, end, badge, badgeDanger }) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        `flex items-center gap-2.5 px-2.5 py-1 rounded-sm text-xs font-semibold tracking-wide transition-all ${
          isActive
            ? 'bg-[rgba(0,255,136,0.1)] text-[#00ff88] border-l-2 border-[#00ff88]'
            : 'text-[rgba(200,214,229,0.4)] border-l-2 border-transparent hover:text-[rgba(200,214,229,0.8)] hover:bg-[rgba(0,255,136,0.05)]'
        }`
      }
    >
      <span className="w-4 flex-shrink-0 opacity-80">{icon}</span>
      <span className="uppercase tracking-[0.08em] flex-1 truncate">{label}</span>
      {badge !== null && badge !== undefined && (
        <span className="font-mono text-[9px] font-bold px-1 py-0.5 rounded-sm flex-shrink-0"
          style={badgeDanger ? {
            color: '#ff3333',
            background: 'rgba(255,51,51,0.15)',
            border: '1px solid rgba(255,51,51,0.3)',
          } : {
            color: 'rgba(0,255,136,0.7)',
            background: 'rgba(0,255,136,0.08)',
            border: '1px solid rgba(0,255,136,0.2)',
          }}>
          {badge}
        </span>
      )}
    </NavLink>
  )
}

function PosNavItem({ pos, kerawanan }) {
  const posNum   = pos.pos_id.replace('POS-', '')
  const hasRawan = kerawanan.some(k => k.pos_id === pos.pos_id && k.status === 'aktif')
  return (
    <NavLink
      to={`/pos/${pos.pos_id}`}
      className={({ isActive }) =>
        `flex items-center gap-2 px-2 py-1.5 rounded-sm text-xs transition-all group ${
          isActive
            ? 'bg-[rgba(0,255,136,0.1)] text-[#00ff88]'
            : 'text-[rgba(200,214,229,0.38)] hover:text-[rgba(200,214,229,0.75)] hover:bg-[rgba(0,255,136,0.04)]'
        }`
      }
    >
      <span className="relative w-5 h-5 rounded-sm flex items-center justify-center flex-shrink-0
        text-[10px] font-bold font-mono"
        style={hasRawan ? {
          background: 'rgba(255,51,51,0.15)',
          border: '1px solid rgba(255,51,51,0.4)',
          color: '#ff5555',
        } : {
          background: 'rgba(0,255,136,0.06)',
          border: '1px solid rgba(0,255,136,0.25)',
          color: 'rgba(0,255,136,0.7)',
        }}>
        {posNum}
        {hasRawan && (
          <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-[#ff3333] rounded-full animate-pulse"
            style={{ boxShadow: '0 0 4px rgba(255,51,51,0.9)' }} />
        )}
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate font-medium leading-tight">{pos.nama_pos}</p>
        <p className="truncate text-[10px] opacity-50 leading-tight">{pos.lokasi_desa || pos.kabupaten}</p>
      </div>
    </NavLink>
  )
}

/* ── SVG Icons ──────────────────────────────────────────── */
function IconMap() {
  return <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6-10l6 3m0 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4" />
  </svg>
}
function IconAlert() {
  return <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
  </svg>
}
function IconHandshake() {
  return <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
}
function IconSettings() {
  return <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
}
function IconBook() {
  return <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
  </svg>
}
function IconChart() {
  return <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
}
function IconTimeline() {
  return <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
}
function IconPeople() {
  return <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
  </svg>
}
function IconPerson() {
  return <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
}
