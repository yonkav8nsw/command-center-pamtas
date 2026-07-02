import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import { usePos, useAllKerawanan } from '../../hooks/useSupabase'

/**
 * Sidebar Component - Navigation Component
 *
 * Design System Foundation v2.0
 * Motion Bible Compliance:
 * - Width transition: 200ms ease-out
 * - Hover: 100ms ease-out
 * - Active indicator: 100ms ease-out
 *
 * Features:
 * - Collapsible sidebar
 * - Section grouping
 * - POS navigation with status indicators
 * - Badge counts
 */

export function Sidebar({ id }) {
  const { sidebarOpen } = useApp()
  const { data: posList, loading } = usePos()
  const { data: kerawanan } = useAllKerawanan()

  const activeKraw = (kerawanan || []).filter(k => k.status?.toLowerCase() === 'aktif').length

  return (
    <aside
      id={id}
      className="flex-shrink-0 overflow-hidden"
      role="navigation"
      aria-label="Navigasi utama"
      style={{
        width: sidebarOpen ? '180px' : '0px',
        transition: 'width var(--duration-smooth) var(--ease-out)',
      }}
    >
      <div
        className="w-[180px] flex flex-col h-full overflow-hidden"
        style={{
          backgroundColor: 'var(--surface-base)',
          borderRight: sidebarOpen ? '1px solid var(--border-subtle)' : 'none',
          transition: 'border-color var(--duration-smooth) var(--ease-out)',
        }}
      >
        {/* ── Main Navigation ───────────────────────────────── */}
        <nav
          className="px-2 pt-2 pb-1"
          style={{ borderBottom: '1px solid var(--border-subtle)' }}
        >
          <SidebarSectionLabel>NAVIGASI</SidebarSectionLabel>
          <NavItem
            to="/"
            icon={<IconHome />}
            label="Home"
            end
          />
          <NavItem
            to="/overview"
            icon={<IconMap />}
            label="Overview"
            end
          />
          <NavItem
            to="/insiden"
            icon={<IconAlert />}
            label="Data Insiden"
            badge={activeKraw > 0 ? activeKraw : null}
            badgeVariant="danger"
          />
          <NavItem
            to="/binter"
            icon={<IconHandshake />}
            label="Program Binter"
          />
        </nav>

        {/* ── Reports & Analytics ──────────────────────────── */}
        <nav
          className="px-2 pt-2 pb-1"
          style={{ borderBottom: '1px solid var(--border-subtle)' }}
        >
          <SidebarSectionLabel>LAPORAN</SidebarSectionLabel>
          <NavItem
            to="/laporan/kerawanan"
            icon={<IconChart />}
            label="Grafik Insiden"
          />
          <NavItem
            to="/laporan/binter"
            icon={<IconTimeline />}
            label="Timeline Binter"
          />
          <NavItem
            to="/laporan/demografi"
            icon={<IconPeople />}
            label="Data Demografi"
          />
          <NavItem
            to="/laporan/tokoh"
            icon={<IconPerson />}
            label="Tokoh Wilayah"
          />
        </nav>

        {/* ── 17 POS Regiment ──────────────────────────── */}
        <div className="flex-1 overflow-y-auto min-h-0">
          <div
            className="px-3 py-2 sticky top-0 z-10"
            style={{
              backgroundColor: 'var(--surface-base)',
              borderBottom: '1px solid var(--border-subtle)',
            }}
          >
            <div className="flex items-center justify-between">
              <SidebarSectionLabel noMargin>17 POS SATGAS</SidebarSectionLabel>
              {!loading && (
                <span
                  className="font-mono text-micro"
                  style={{ color: 'var(--text-tertiary)' }}
                >
                  {(posList || []).length}/17
                </span>
              )}
            </div>
          </div>

          {loading ? (
            <div className="px-2 pt-2 space-y-1">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="h-9 rounded-sm animate-pulse"
                  style={{ backgroundColor: 'var(--accent-muted)' }}
                />
              ))}
            </div>
          ) : (
            <div className="px-2 pb-3 pt-1 space-y-px">
              {/* KOTIS/KT always at top */}
              {[(posList || []).filter(p => p.pos_id === 'KOTIS' || p.pos_id === 'KT'),
                (posList || []).filter(p => p.pos_id !== 'KOTIS' && p.pos_id !== 'KT')
              ].flat().map((pos) => (
                <PosNavItem key={pos.pos_id} pos={pos} kerawanan={kerawanan || []} />
              ))}
            </div>
          )}
        </div>

        {/* ── Bottom nav ────────────────────────────── */}
        <nav
          className="px-2 pt-1 pb-1"
          style={{ borderTop: '1px solid var(--border-subtle)' }}
        >
          <NavItem
            to="/panduan"
            icon={<IconBook />}
            label="Panduan Input"
          />
          <NavItem
            to="/admin"
            icon={<IconSettings />}
            label="Pengaturan"
          />
        </nav>
      </div>
    </aside>
  )
}

/* ── Section Label ──────────────────────────────────────────── */
function SidebarSectionLabel({ children, noMargin }) {
  return (
    <div className={`px-2 mb-0.5 ${noMargin ? 'mb-0' : ''}`}>
      <span
        className="text-[7px] font-semibold uppercase"
        style={{
          color: 'rgba(200,214,229,0.3)',
          fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
          letterSpacing: '0.12em',
          fontWeight: 600,
        }}
      >
        {children}
      </span>
    </div>
  )
}

/* ── Navigation Item ──────────────────────────────────────────── */
function NavItem({ to, icon, label, end, badge, badgeVariant = 'accent' }) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <NavLink
      to={to}
      end={end}
      className="flex items-center gap-2 px-2 py-1.5 rounded-sm cursor-pointer"
      style={({ isActive }) => {
        const baseStyle = {
          fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
          fontSize: '11px',
          fontWeight: isActive ? 500 : 400,
          letterSpacing: '0.01em',
          transition: 'all 200ms cubic-bezier(0.23, 1, 0.32, 1)',
        }
        if (isActive) {
          return {
            ...baseStyle,
            backgroundColor: 'rgba(0,255,136,0.12)',
            color: '#00ff88',
            borderLeft: '2px solid #00ff88',
            paddingLeft: '6px',
          }
        }
        if (isHovered) {
          return {
            ...baseStyle,
            fontWeight: 450,
            backgroundColor: 'rgba(255,255,255,0.03)',
            color: 'rgba(200,214,229,0.85)',
            borderLeft: '2px solid rgba(0,255,136,0.25)',
            paddingLeft: '6px',
          }
        }
        return {
          ...baseStyle,
          color: 'rgba(200,214,229,0.5)',
          borderLeft: '2px solid transparent',
          paddingLeft: '8px',
        }
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <span
        className="w-3.5 h-3.5 flex-shrink-0"
        style={{ opacity: 0.6 }}
      >
        {icon}
      </span>
      <span className="flex-1 truncate">{label}</span>
      {badge !== null && badge !== undefined && (
        <span
          className="font-mono text-[8px] font-semibold px-1.5 py-0.5 rounded-sm flex-shrink-0"
          style={
            badgeVariant === 'danger'
              ? {
                  color: '#ff6b6b',
                  background: 'rgba(255,107,107,0.12)',
                  border: '1px solid rgba(255,107,107,0.3)',
                }
              : {
                  color: '#00ff88',
                  background: 'rgba(0,255,136,0.08)',
                  border: '1px solid rgba(0,255,136,0.25)',
                }
          }
        >
          {badge}
        </span>
      )}
    </NavLink>
  )
}

/* ── POS Navigation Item ─────────────────────────────────────── */
function PosNavItem({ pos, kerawanan }) {
  const [isHovered, setIsHovered] = useState(false)
  const posNum = pos.pos_id.replace('POS-', '')
  const hasRawan = kerawanan.some(
    k => k.pos_id === pos.pos_id && k.status?.toLowerCase() === 'aktif'
  )

  return (
    <NavLink
      to={`/pos/${pos.pos_id}`}
      className="flex items-center gap-2 px-2 py-2 rounded-sm cursor-pointer"
      style={({ isActive }) => {
        const baseStyle = {
          fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
          transition: 'all 200ms cubic-bezier(0.23, 1, 0.32, 1)',
        }
        if (isActive) {
          return {
            ...baseStyle,
            backgroundColor: 'rgba(0,255,136,0.1)',
            color: '#00ff88',
          }
        }
        if (isHovered) {
          return {
            ...baseStyle,
            backgroundColor: 'rgba(255,255,255,0.025)',
            color: 'rgba(200,214,229,0.8)',
          }
        }
        return {
          ...baseStyle,
          color: 'rgba(200,214,229,0.45)',
        }
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <span
        className="w-5 h-5 rounded-sm flex items-center justify-center flex-shrink-0 font-mono relative"
        style={{
          fontSize: '9px',
          fontWeight: 600,
          ...(hasRawan
            ? {
                background: 'rgba(255,80,80,0.12)',
                border: '1px solid rgba(255,80,80,0.35)',
                color: '#ff6b6b',
                boxShadow: '0 0 8px rgba(255,80,80,0.15)',
              }
            : {
                background: 'rgba(0,255,136,0.06)',
                border: '1px solid rgba(0,255,136,0.25)',
                color: '#00ff88',
              }),
        }}
      >
        {posNum}
        {hasRawan && (
          <span
            className="absolute -top-1 -right-1 w-1.5 h-1.5 rounded-full"
            style={{
              backgroundColor: '#ff4444',
              boxShadow: '0 0 6px rgba(255,68,68,0.9)',
              animation: 'statusPulse 2s ease-in-out infinite',
            }}
            aria-hidden="true"
          />
        )}
      </span>
      <div className="min-w-0 flex-1">
        <p
          className="font-medium leading-tight truncate"
          style={{
            fontSize: '10px',
            fontFamily: "'Inter', system-ui, sans-serif",
            fontWeight: 450,
            letterSpacing: '0.01em',
          }}
        >
          {pos.nama_pos}
        </p>
        <p
          className="truncate leading-tight"
          style={{
            fontSize: '8px',
            color: 'rgba(200,214,229,0.3)',
            fontFamily: "'Inter', system-ui, sans-serif",
            letterSpacing: '0.02em',
          }}
        >
          {pos.lokasi_desa || pos.kabupaten}
        </p>
      </div>
    </NavLink>
  )
}

/* ── SVG Icons ──────────────────────────────────────────── */
function IconHome() {
  return (
    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
      />
    </svg>
  )
}

function IconMap() {
  return (
    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6-3l6 3m0 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 13V4"
      />
    </svg>
  )
}

function IconAlert() {
  return (
    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
      />
    </svg>
  )
}

function IconHandshake() {
  return (
    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
      />
    </svg>
  )
}

function IconSettings() {
  return (
    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
      />
    </svg>
  )
}

function IconBook() {
  return (
    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
      />
    </svg>
  )
}

function IconChart() {
  return (
    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
      />
    </svg>
  )
}

function IconTimeline() {
  return (
    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
      />
    </svg>
  )
}

function IconPeople() {
  return (
    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
      />
    </svg>
  )
}

function IconPerson() {
  return (
    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
      />
    </svg>
  )
}