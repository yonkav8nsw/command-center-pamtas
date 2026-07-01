import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useAllKerawanan, usePos, useSummary } from '../hooks/useSupabase'

/**
 * HomePage — Premium Tactical Command Center Hero (v2)
 *
 * New Design:
 * - No hero figure (removed)
 * - 2-row indicator panel:
 *   Row 1: Personel - Pos Aktif - Insiden
 *   Row 2: Overview - Insiden - Laporan
 * - Panel positioned at: left:166.27px, bottom:275.42px
 * - Logo positioned at: left:313.16px, top:109.56px, width:309.05px, height:293.51px
 */

export default function HomePage() {
  const navigate = useNavigate()
  const { profile } = useAuth()
  const { data: kerawanan } = useAllKerawanan()
  const { data: posList } = usePos()
  const { data: summary } = useSummary()

  const [loaded, setLoaded] = useState(false)

  const aktifCount = (kerawanan || []).filter(k => k.status?.toLowerCase() === 'aktif').length
  const totalPos = (posList || []).length || 17
  const totalPersonel = (posList || []).reduce((s, p) => s + (Number(p.jumlah_personel) || 0), 0)

  // Entrance animation
  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 100)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div
      className="h-full overflow-hidden relative"
      style={{ background: '#050810' }}
    >
      {/* HERO BANNER (HD, No Blur) - Without hero figure */}
      <div
        className="absolute inset-0 transition-all duration-[800ms]"
        style={{
          opacity: loaded ? 1 : 0,
          transform: loaded ? 'scale(1)' : 'scale(1.02)',
        }}
      >
        {/* Banner Background - HD Quality */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${import.meta.env.BASE_URL}banner1.png)`,
            filter: 'brightness(0.85) contrast(1.05) saturate(1.1)',
          }}
        />

        {/* Gradient Overlays for Text Contrast */}
        <div
          className="absolute inset-0"
          style={{
            background: `
              linear-gradient(135deg, rgba(5,8,16,0.6) 0%, transparent 50%),
              linear-gradient(180deg, rgba(5,8,16,0.3) 0%, rgba(5,8,16,0.7) 100%),
              linear-gradient(90deg, rgba(5,8,16,0.8) 0%, transparent 40%)
            `,
          }}
        />

        {/* HUD Grid Overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0,255,136,0.5) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0,255,136,0.5) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      {/* GLOW BORDER */}
      <div className="glow-border" aria-hidden="true" />

      {/* MAIN CONTENT */}
      <div className="relative z-10 h-full">
        {/* Space for hamburger menu only */}
        <div className="h-12 flex-shrink-0" />

        {/* Logo - Positioned at left:313.16px, top:109.56px, width:309.05px, height:293.51px */}
        <img
          src={`${import.meta.env.BASE_URL}logo.png?v=${Date.now()}`}
          alt="Logo"
          className="absolute"
          style={{
            left: '313.16px',
            top: '109.56px',
            width: '309.05px',
            height: '293.51px',
            objectFit: 'contain',
            zIndex: 10,
            opacity: loaded ? 1 : 0,
            transition: 'opacity 0.8s ease-out',
          }}
        />

        {/* INDICATOR PANEL - 2 rows layout */}
        {/* Position: left:166.27px, bottom:275.42px, width:602.82px */}
        <div
          className="absolute flex flex-col gap-3 transition-all duration-[800ms]"
          style={{
            left: '166.27px',
            bottom: '275.42px',
            width: '602.82px',
            zIndex: 15,
            opacity: loaded ? 1 : 0,
            transform: loaded ? 'translateY(0)' : 'translateY(20px)',
            transitionDelay: '300ms',
          }}
        >
          {/* Row 1: Personel - Pos Aktif - Insiden */}
          <div className="flex gap-3">
            <StatCard
              label="PERSONEL"
              value={totalPersonel}
              color="var(--accent-primary)"
              icon={<PersonIcon />}
            />
            <StatCard
              label="POS AKTIF"
              value={totalPos}
              color="var(--color-info)"
              icon={<PosIcon />}
            />
            <StatCard
              label="INSIDEN"
              value={aktifCount}
              color={aktifCount > 0 ? 'var(--color-danger)' : 'var(--accent-primary)'}
              pulse={aktifCount > 0}
              icon={<InsidenIcon />}
            />
          </div>

          {/* Row 2: Overview - Insiden - Laporan */}
          <div className="flex gap-3">
            <ActionCard
              label="OVERVIEW"
              icon={<MapIcon />}
              color="var(--accent-primary)"
              onClick={() => navigate('/overview')}
            />
            <ActionCard
              label="INSIDEN"
              icon={<AlertIcon />}
              color={aktifCount > 0 ? 'var(--color-danger)' : 'var(--accent-primary)'}
              onClick={() => navigate('/insiden')}
              badge={aktifCount > 0 ? aktifCount : null}
            />
            <ActionCard
              label="LAPORAN"
              icon={<ChartIcon />}
              color="var(--color-purple)"
              onClick={() => navigate('/laporan/kerawanan')}
            />
          </div>
        </div>
      </div>

      {/* CSS ANIMATIONS */}
      <style>{`
        .glow-border {
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 6;
          border: 1px solid rgba(0,255,136,0.1);
          animation: glow-pulse 3s ease-in-out infinite;
        }
        @keyframes glow-pulse {
          0%, 100% {
            box-shadow: inset 0 0 40px rgba(0,255,136,0.03), 0 0 15px rgba(0,255,136,0.05);
            border-color: rgba(0,255,136,0.1);
          }
          50% {
            box-shadow: inset 0 0 80px rgba(0,255,136,0.06), 0 0 25px rgba(0,255,136,0.1);
            border-color: rgba(0,255,136,0.15);
          }
        }
      `}</style>
    </div>
  )
}

/* Stat Card Component */
function StatCard({ label, value, color, pulse, icon }) {
  return (
    <div
      className="flex-1 flex flex-col items-center justify-center px-4 py-4 rounded-sm"
      style={{
        background: 'rgba(5,8,16,0.7)',
        backdropFilter: 'blur(12px)',
        border: `1px solid ${color}40`,
        boxShadow: `0 0 20px ${color}15, inset 0 0 15px ${color}08`,
        minHeight: '100px',
      }}
    >
      {/* Icon */}
      <div
        className="w-8 h-8 mb-2"
        style={{ color, filter: `drop-shadow(0 0 6px ${color}60)` }}
      >
        {icon}
      </div>

      {/* Value */}
      <div className="flex items-center gap-2">
        {pulse && (
          <span
            className="w-2 h-2 rounded-full animate-pulse"
            style={{ background: color, boxShadow: `0 0 8px ${color}` }}
          />
        )}
        <span
          className="text-2xl font-bold font-mono"
          style={{ color, textShadow: `0 0 15px ${color}80` }}
        >
          {value.toLocaleString('id-ID')}
        </span>
      </div>

      {/* Label */}
      <span
        className="text-[10px] tracking-[0.2em] uppercase mt-2 font-semibold"
        style={{ color: 'rgba(200,214,229,0.7)' }}
      >
        {label}
      </span>
    </div>
  )
}

/* Action Card Component */
function ActionCard({ label, icon, color, onClick, badge }) {
  const [hovered, setHovered] = useState(false)

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="flex-1 relative flex flex-col items-center justify-center px-4 py-4 rounded-sm transition-all duration-150"
      style={{
        background: hovered ? `${color}20` : 'rgba(5,8,16,0.7)',
        backdropFilter: 'blur(12px)',
        border: `1px solid ${hovered ? color : `${color}30`}`,
        boxShadow: hovered ? `0 0 20px ${color}30` : `0 0 10px ${color}10`,
        minHeight: '100px',
        transform: hovered ? 'scale(1.03)' : 'scale(1)',
      }}
    >
      {/* Icon */}
      <div
        className="w-8 h-8 mb-2"
        style={{ color, filter: hovered ? `drop-shadow(0 0 8px ${color})` : `drop-shadow(0 0 4px ${color}40)` }}
      >
        {icon}
      </div>

      {/* Label */}
      <span
        className="text-[10px] tracking-[0.2em] font-bold uppercase"
        style={{ color }}
      >
        {label}
      </span>

      {/* Badge */}
      {badge && (
        <span
          className="absolute -top-1 -right-1 w-5 h-5 rounded-full text-[8px] font-bold flex items-center justify-center animate-pulse"
          style={{
            background: 'var(--color-danger)',
            color: '#fff',
            boxShadow: '0 0 10px var(--color-danger)',
          }}
        >
          {badge}
        </span>
      )}
    </button>
  )
}

/* Icons */
function PersonIcon() {
  return (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
    </svg>
  )
}

function PosIcon() {
  return (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
    </svg>
  )
}

function InsidenIcon() {
  return (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
    </svg>
  )
}

function MapIcon() {
  return (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6-10l6 3m0 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
    </svg>
  )
}

function AlertIcon() {
  return (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
    </svg>
  )
}

function ChartIcon() {
  return (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
    </svg>
  )
}
