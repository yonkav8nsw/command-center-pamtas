import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, useReducedMotion } from 'motion/react'
import { useAuth } from '../context/AuthContext'
import { useAllKerawanan, usePos, useSummary } from '../hooks/useSupabase'
import { StatChip, StatusDot } from '../components/ui'

/**
 * HomePage — Premium Tactical Command Center Hero
 *
 * Design System Foundation v2.0
 * Motion Bible Compliance:
 * - Banner entrance: 800ms ease-out
 * - Stagger animations: 100ms increments
 * - Scanline: 4s linear infinite
 * - Glow pulse: 2s ease-in-out infinite
 * - Particles: slow float animation
 *
 * Features:
 * - Full-screen hero banner (HD, no blur)
 * - NARASINGA SIAGA / PERBATASAN TERJAGA motto with motion animations
 * - Logo with cinematic entrance and floating idle animation
 * - Minimal UI - only hamburger menu visible
 * - Bottom-left panel row with dark backdrop
 * - Animated HUD effects
 */

export default function HomePage() {
  const navigate = useNavigate()
  const { profile } = useAuth()
  const { data: kerawanan } = useAllKerawanan()
  const { data: posList } = usePos()
  const { data: summary } = useSummary()
  const prefersReducedMotion = useReducedMotion()

  const [loaded, setLoaded] = useState(false)

  const aktifCount = (kerawanan || []).filter(k => k.status?.toLowerCase() === 'aktif').length
  const totalPos = (posList || []).length || 17
  const totalPersonel = (posList || []).reduce((s, p) => s + (Number(p.jumlah_personel) || 0), 0)

  // Entrance animation
  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 100)
    return () => clearTimeout(timer)
  }, [])

  // Motion animation variants
  const shouldAnimate = !prefersReducedMotion

  const textVariants = {
    line1: {
      hidden: { opacity: 0, x: 60, filter: 'blur(8px)' },
      visible: { opacity: 1, x: 0, filter: 'blur(0px)', transition: { duration: 0.9, delay: 0.3, ease: [0.16, 1, 0.3, 1] } }
    },
    line2: {
      hidden: { opacity: 0, x: 60, filter: 'blur(8px)' },
      visible: { opacity: 1, x: 0, filter: 'blur(0px)', transition: { duration: 0.9, delay: 0.5, ease: [0.16, 1, 0.3, 1] } }
    },
    line3: {
      hidden: { opacity: 0, x: 60, filter: 'blur(8px)' },
      visible: { opacity: 1, x: 0, filter: 'blur(0px)', transition: { duration: 0.9, delay: 0.7, ease: [0.16, 1, 0.3, 1] } }
    },
    subtitle: {
      hidden: { opacity: 0, y: 12 },
      visible: { opacity: 1, y: 0, transition: { duration: 0.8, delay: 1.0, ease: 'easeOut' } }
    }
  }

  const logoVariants = {
    hidden: { opacity: 0, scale: 0.7, rotate: -8 },
    visible: { opacity: 1, scale: 1, rotate: 0, transition: { duration: 1.2, delay: 0.8, ease: [0.16, 1, 0.3, 1] } },
    float: {
      y: [0, -8, 0],
      filter: [
        'drop-shadow(0 0 8px rgba(0,255,136,0.3)',
        'drop-shadow(0 0 18px rgba(0,255,136,0.6)',
        'drop-shadow(0 0 8px rgba(0,255,136,0.3)'
      ],
      transition: { duration: 4, repeat: Infinity, ease: 'easeInOut' }
    }
  }

  return (
    <div
      className="h-full overflow-hidden relative"
      style={{ background: '#050810' }}
    >
      {/* HERO BANNER (HD, No Blur) */}
      <div
        className="absolute inset-0 transition-all duration-[800ms]"
        style={{
          opacity: prefersReducedMotion ? 1 : (loaded ? 1 : 0),
          transform: prefersReducedMotion ? 'scale(1)' : (loaded ? 'scale(1)' : 'scale(1.02)'),
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

        {/* HERO FIGURE - Removed per user request */}
      </div>

      {/* SCANLINE EFFECT */}
      <div className="scanline-overlay" aria-hidden="true" />

      {/* FLOATING PARTICLES */}
      <Particles count={15} />

      {/* GLOW BORDER */}
      <div className="glow-border" aria-hidden="true" />

      {/* MAIN CONTENT (NO HEADER, NO FOOTER) */}
      <div className="relative z-10 h-full">
        {/* Space for hamburger menu only */}
        <div className="h-12 flex-shrink-0" />

        {/* Motto Text - Positioned absolutely */}
        <div
          className="absolute text-right"
          style={{
            left: '45.72%',
            bottom: '17.43%',
            zIndex: 10,
          }}
        >
          {/* Motto Line 1 - NARASINGA SIAGA */}
          {shouldAnimate ? (
            <motion.h1
              variants={textVariants.line1}
              initial="hidden"
              animate="visible"
              className="glitch-text text-4xl md:text-6xl tracking-[0.1em] uppercase leading-none"
              style={{
                fontFamily: "'Russo One', sans-serif",
                color: 'var(--accent-primary)',
                textShadow: '0 0 35px rgba(0,255,136,0.6), 0 0 70px rgba(0,255,136,0.3)',
              }}
            >
              NARASINGA SIAGA
            </motion.h1>
          ) : (
            <h1
              className="glitch-text text-4xl md:text-6xl tracking-[0.1em] uppercase leading-none"
              style={{
                fontFamily: "'Russo One', sans-serif",
                color: 'var(--accent-primary)',
                textShadow: '0 0 35px rgba(0,255,136,0.6), 0 0 70px rgba(0,255,136,0.3)',
              }}
            >
              NARASINGA SIAGA
            </h1>
          )}

          {/* Motto Line 2 - PERBATASAN TERJAGA */}
          {shouldAnimate ? (
            <motion.h1
              variants={textVariants.line2}
              initial="hidden"
              animate="visible"
              className="glitch-text text-3xl md:text-5xl tracking-[0.1em] uppercase leading-none"
              style={{
                fontFamily: "'Russo One', sans-serif",
                color: 'var(--accent-primary)',
                textShadow: '0 0 30px rgba(0,255,136,0.5), 0 0 60px rgba(0,255,136,0.25)',
              }}
            >
              PERBATASAN TERJAGA
            </motion.h1>
          ) : (
            <h1
              className="glitch-text text-3xl md:text-5xl tracking-[0.1em] uppercase leading-none"
              style={{
                fontFamily: "'Russo One', sans-serif",
                color: 'var(--accent-primary)',
                textShadow: '0 0 30px rgba(0,255,136,0.5), 0 0 60px rgba(0,255,136,0.25)',
              }}
            >
              PERBATASAN TERJAGA
            </h1>
          )}

          {/* Subtitle */}
          {shouldAnimate ? (
            <motion.p
              variants={textVariants.subtitle}
              initial="hidden"
              animate="visible"
              className="text-sm md:text-base tracking-[0.25em] uppercase mt-4"
              style={{ fontFamily: "'Russo One', sans-serif", color: 'var(--text-tertiary)' }}
            >
              SATGAS PAMTAS RI-MLY YONKAV 8/NSW TA 2026
            </motion.p>
          ) : (
            <p
              className="text-sm md:text-base tracking-[0.25em] uppercase mt-4"
              style={{ fontFamily: "'Russo One', sans-serif", color: 'var(--text-tertiary)' }}
            >
              SATGAS PAMTAS RI-MLY YONKAV 8/NSW TA 2026
            </p>
          )}
        </div>

        {/* Logo - Centered above HUD Panel with motion */}
        {shouldAnimate ? (
          <motion.img
            src={`${import.meta.env.BASE_URL}logo-satgas.png`}
            alt="Logo"
            className="absolute"
            style={{
              left: '16.31%',
              top: '10.14%',
              width: '16.10%',
              height: '27.18%',
              objectFit: 'contain',
              zIndex: 10,
            }}
            variants={logoVariants}
            initial="hidden"
            animate={loaded ? ['visible', 'float'] : 'hidden'}
          />
        ) : (
          <img
            src={`${import.meta.env.BASE_URL}logo-satgas.png`}
            alt="Logo"
            className="absolute"
            style={{
              left: '16.31%',
              top: '10.14%',
              width: '16.10%',
              height: '27.18%',
              objectFit: 'contain',
              zIndex: 10,
            }}
          />
        )}

        {/* HUD Panel - Tactical Military Design */}
        <div
          className="absolute"
          style={{
            left: '8.66%',
            top: '39.95%',
            width: '31.40%',
            height: '34.54%',
          }}
        >
          <TacticalHUD
            totalPersonel={totalPersonel}
            totalPos={totalPos}
            aktifCount={aktifCount}
            navigate={navigate}
            prefersReducedMotion={prefersReducedMotion}
          />
        </div>
      </div>

      {/* CSS ANIMATIONS */}
      <style>{`
        /* Scanline Effect */
        .scanline-overlay {
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 5;
          overflow: hidden;
        }
        .scanline-overlay::before {
          content: '';
          position: absolute;
          top: -100%;
          left: 0;
          right: 0;
          height: 200%;
          background: linear-gradient(
            180deg,
            transparent 0%,
            rgba(0,255,136,0.02) 50%,
            transparent 100%
          );
          animation: scanline 5s linear infinite;
        }
        @keyframes scanline {
          0% { transform: translateY(0); }
          100% { transform: translateY(50%); }
        }

        /* HUD Panel Animations */
        @keyframes tacticalIn {
          0% {
            opacity: 0;
            transform: translateY(8px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes tacticalPulse {
          0%, 100% {
            opacity: 1;
            box-shadow: 0 0 4px currentColor;
          }
          50% {
            opacity: 0.5;
            box-shadow: 0 0 2px currentColor;
          }
        }

        /* Glitch Text Effect */
        .glitch-text {
          position: relative;
          animation: glitch-skew 6s infinite linear alternate-reverse;
        }
        .glitch-text::before,
        .glitch-text::after {
          content: attr(data-text);
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
        }
        .glitch-text::before {
          color: #ff0088;
          animation: glitch-1 0.4s infinite linear alternate-reverse;
          clip-path: polygon(0 0, 100% 0, 100% 35%, 0 35%);
          transform: translate(-2px);
          opacity: 0.7;
        }
        .glitch-text::after {
          color: #00ffff;
          animation: glitch-2 0.4s infinite linear alternate-reverse;
          clip-path: polygon(0 65%, 100% 65%, 100% 100%, 0 100%);
          transform: translate(2px);
          opacity: 0.7;
        }
        @keyframes glitch-1 {
          0% { transform: translate(-2px); }
          100% { transform: translate(2px); }
        }
        @keyframes glitch-2 {
          0% { transform: translate(2px); }
          100% { transform: translate(-2px); }
        }
        @keyframes glitch-skew {
          0% { transform: skew(0deg); }
          20% { transform: skew(0deg); }
          21% { transform: skew(1deg); }
          22% { transform: skew(0deg); }
          80% { transform: skew(0deg); }
          81% { transform: skew(-0.5deg); }
          82% { transform: skew(0deg); }
          100% { transform: skew(0deg); }
        }

        /* Glow Border */
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

        /* Particle Float */
        .particle {
          position: absolute;
          width: 2px;
          height: 2px;
          background: var(--accent-primary);
          border-radius: 50%;
          opacity: 0.3;
          animation: float-particle linear infinite;
        }
        @keyframes float-particle {
          0% {
            transform: translateY(0) translateX(0);
            opacity: 0;
          }
          10% { opacity: 0.4; }
          90% { opacity: 0.4; }
          100% {
            transform: translateY(-100vh) translateX(20px);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  )
}

/* Tactical HUD Component - Military Grade Design */
function TacticalHUD({ totalPersonel, totalPos, aktifCount, navigate, prefersReducedMotion }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 100)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div
      className="relative w-full h-full"
      style={{
        opacity: mounted ? 1 : 0,
        transform: mounted ? 'translateX(0)' : 'translateX(-20px)',
        transition: 'all 400ms cubic-bezier(0.23, 1, 0.32, 1)',
      }}
    >
      {/* Main Frame - Angular Border */}
      <div className="absolute inset-0">
        {/* Outer Border */}
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(135deg, rgba(0,255,136,0.3) 0%, rgba(0,255,136,0.1) 50%, rgba(0,255,136,0.05) 100%)',
            clipPath: 'polygon(0 8px, 8px 0, calc(100% - 8px) 0, 100% 8px, 100% calc(100% - 8px), calc(100% - 8px) 100%, 8px 100%, 0 calc(100% - 8px))',
          }}
        />

        {/* Inner Frame */}
        <div
          className="absolute inset-[2px]"
          style={{
            background: 'rgba(5,8,15,0.95)',
            clipPath: 'polygon(0 8px, 8px 0, calc(100% - 8px) 0, 100% 8px, 100% calc(100% - 8px), calc(100% - 8px) 100%, 8px 100%, 0 calc(100% - 8px))',
          }}
        />

        {/* Corner Accents */}
        <CornerAccent position="top-left" />
        <CornerAccent position="top-right" />
        <CornerAccent position="bottom-left" />
        <CornerAccent position="bottom-right" />
      </div>

      {/* Header Bar */}
      <div className="absolute top-0 left-0 right-0 h-7 flex items-center px-3"
        style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 12px 100%, 0 calc(100% - 12px))' }}>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#00ff88]" style={{ boxShadow: '0 0 8px #00ff88' }} />
          <span className="font-mono text-[8px] tracking-[0.2em] text-[rgba(0,255,136,0.7)]">
            SYSTEM STATUS
          </span>
        </div>
        <div className="flex-1 h-px mx-3" style={{ background: 'linear-gradient(90deg, rgba(0,255,136,0.4), transparent)' }} />
      </div>

      {/* Content Area */}
      <div className="absolute inset-0 pt-8 pb-1 px-1">
        {/* Row 1: Stats - Seamless flex */}
        <div className="h-[calc(50%-2px)] flex mb-0.5">
          <TacticalStat
            icon={<CrosshairIcon />}
            label="PERSONEL"
            value={totalPersonel}
            color="var(--accent-primary)"
            index={0}
            prefersReducedMotion={prefersReducedMotion}
          />
          <TacticalStat
            icon={<TargetIcon />}
            label="POS AKTIF"
            value={totalPos}
            color="var(--color-info)"
            index={1}
            prefersReducedMotion={prefersReducedMotion}
          />
          <TacticalStat
            icon={<AlertIcon />}
            label="INSIDEN"
            value={aktifCount}
            color={aktifCount > 0 ? 'var(--color-danger)' : 'var(--accent-primary)'}
            index={2}
            pulse={aktifCount > 0}
            prefersReducedMotion={prefersReducedMotion}
          />
        </div>

        {/* Divider */}
        <div className="h-px mx-1 my-0.5" style={{ background: 'linear-gradient(90deg, transparent, rgba(0,255,136,0.25), transparent)' }} />

        {/* Row 2: Actions - Seamless joined panels */}
        <div className="h-[calc(50%-4px)] flex">
          <TacticalAction
            icon={<MapIcon />}
            label="OVERVIEW"
            onClick={() => navigate('/overview')}
            color="var(--accent-primary)"
            index={3}
            prefersReducedMotion={prefersReducedMotion}
          />
          <TacticalAction
            icon={<AlertIcon />}
            label="INSIDEN"
            onClick={() => navigate('/insiden')}
            color={aktifCount > 0 ? 'var(--color-danger)' : 'var(--accent-primary)'}
            badge={aktifCount > 0 ? aktifCount : null}
            index={4}
            prefersReducedMotion={prefersReducedMotion}
          />
          <TacticalAction
            icon={<ChartIcon />}
            label="LAPORAN"
            onClick={() => navigate('/laporan/kerawanan')}
            color="var(--color-purple)"
            index={5}
            prefersReducedMotion={prefersReducedMotion}
            isLast
          />
        </div>
      </div>
    </div>
  )
}

/* Corner Accent Component */
function CornerAccent({ position }) {
  const positions = {
    'top-left': { top: 0, left: 0, rotate: '0deg' },
    'top-right': { top: 0, right: 0, rotate: '90deg' },
    'bottom-right': { bottom: 0, right: 0, rotate: '180deg' },
    'bottom-left': { bottom: 0, left: 0, rotate: '270deg' },
  }

  return (
    <div
      className="absolute w-4 h-4"
      style={{
        ...positions[position],
        background: 'linear-gradient(135deg, #00ff88 0%, transparent 60%)',
        clipPath: 'polygon(0 0, 100% 0, 0 100%)',
      }}
    />
  )
}

/* Tactical Stat Display with Bracket Frame & Heartbeat */
function TacticalStat({ icon, label, value, color, index, pulse, prefersReducedMotion }) {
  return (
    <div
      className="relative flex-1 flex flex-col items-center justify-center px-2 py-1 border-r"
      style={{
        borderColor: 'rgba(0,255,136,0.12)',
        animation: prefersReducedMotion ? 'none' : `tacticalIn 300ms ${index * 80}ms ease-out forwards`,
        opacity: 0,
      }}
    >
      {/* Status Dot - top right */}
      <div
        className={`absolute top-1 right-2 w-1.5 h-1.5 rounded-full ${pulse ? 'animate-pulse' : ''}`}
        style={{ background: color, boxShadow: `0 0 8px ${color}` }}
      />

      {/* Icon Badge with Chamfer Frame */}
      <div
        className="mb-1"
        style={{
          background: `${color}10`,
          border: `1px solid ${color}35`,
          clipPath: 'polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% 100%, 4px 100%, 0 calc(100% - 4px))',
          padding: '4px',
        }}
      >
        <span style={{ color, fontSize: '10px', display: 'block' }}>{icon}</span>
      </div>

      {/* Value with Bracket Corners */}
      <div className="relative">
        {/* Corner brackets */}
        <span className="absolute -left-1 -top-1 w-2 h-2" style={{ borderTop: `1.5px solid ${color}`, borderLeft: `1.5px solid ${color}`, opacity: 0.6 }} />
        <span className="absolute -right-1 -top-1 w-2 h-2" style={{ borderTop: `1.5px solid ${color}`, borderRight: `1.5px solid ${color}`, opacity: 0.6 }} />
        <span className="absolute -left-1 -bottom-1 w-2 h-2" style={{ borderBottom: `1.5px solid ${color}`, borderLeft: `1.5px solid ${color}`, opacity: 0.6 }} />
        <span className="absolute -right-1 -bottom-1 w-2 h-2" style={{ borderBottom: `1.5px solid ${color}`, borderRight: `1.5px solid ${color}`, opacity: 0.6 }} />

        {/* Value */}
        <span
          className="font-mono font-bold text-base leading-none px-1"
          style={{
            color,
            textShadow: `0 0 12px ${color}80`,
            fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
          }}
        >
          {value.toLocaleString('id-ID')}
        </span>
      </div>

      {/* Label */}
      <span
        className="text-[6px] uppercase tracking-[0.15em] mt-1 font-medium"
        style={{ color: 'rgba(200,214,229,0.45)', letterSpacing: '0.1em' }}
      >
        {label}
      </span>

      {/* Heartbeat/ECG Line */}
      <div className="w-full mt-1 px-2">
        <svg width="100%" height="4" viewBox="0 0 80 4" preserveAspectRatio="none">
          <path
            d="M0 2 L15 2 L20 0 L25 4 L30 1.5 L35 2.5 L45 2 L80 2"
            fill="none"
            stroke={color}
            strokeWidth="0.75"
            opacity="0.5"
          />
        </svg>
      </div>
    </div>
  )
}

/* Tactical Action - Seamless Panel with Hazard Stripe */
function TacticalAction({ icon, label, onClick, color, badge, index, prefersReducedMotion, isLast }) {
  const [hovered, setHovered] = useState(false)

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`relative flex-1 flex flex-col items-center justify-center px-2 py-1 ${!isLast ? 'border-r' : ''}`}
      style={{
        background: hovered ? `${color}12` : 'rgba(0,0,0,0.25)',
        borderColor: hovered ? color : 'rgba(0,255,136,0.12)',
        borderWidth: '0px',
        borderRightWidth: '1px',
        boxShadow: hovered ? `0 0 15px ${color}30, inset 0 0 12px ${color}08` : 'none',
        transform: hovered ? 'scale(1.01)' : 'scale(1)',
        transition: 'all 150ms ease',
        animation: prefersReducedMotion ? 'none' : `tacticalIn 300ms ${index * 80}ms ease-out forwards`,
        opacity: 0,
      }}
    >
      {/* Hazard Stripe - bottom right on hover */}
      {hovered && (
        <div
          className="absolute bottom-0 right-0 w-10 h-2.5"
          style={{
            background: `repeating-linear-gradient(
              -45deg,
              ${color}25 0px,
              ${color}25 2px,
              transparent 2px,
              transparent 4px
            )`,
          }}
        />
      )}

      {/* Icon with Bracket Corner Frame */}
      <div className="relative mb-0.5">
        {/* Corner brackets */}
        <span className="absolute -left-0.5 -top-0.5 w-1.5 h-1.5" style={{ borderTop: `1px solid ${hovered ? color : 'rgba(200,214,229,0.2)'}`, borderLeft: `1px solid ${hovered ? color : 'rgba(200,214,229,0.2)'}`, transition: 'border-color 150ms' }} />
        <span className="absolute -right-0.5 -top-0.5 w-1.5 h-1.5" style={{ borderTop: `1px solid ${hovered ? color : 'rgba(200,214,229,0.2)'}`, borderRight: `1px solid ${hovered ? color : 'rgba(200,214,229,0.2)'}`, transition: 'border-color 150ms' }} />
        <span className="absolute -left-0.5 -bottom-0.5 w-1.5 h-1.5" style={{ borderBottom: `1px solid ${hovered ? color : 'rgba(200,214,229,0.2)'}`, borderLeft: `1px solid ${hovered ? color : 'rgba(200,214,229,0.2)'}`, transition: 'border-color 150ms' }} />
        <span className="absolute -right-0.5 -bottom-0.5 w-1.5 h-1.5" style={{ borderBottom: `1px solid ${hovered ? color : 'rgba(200,214,229,0.2)'}`, borderRight: `1px solid ${hovered ? color : 'rgba(200,214,229,0.2)'}`, transition: 'border-color 150ms' }} />

        {/* Icon */}
        <div style={{ color: hovered ? color : 'rgba(200,214,229,0.45)', transition: 'color 150ms' }} className="w-5 h-5">
          {icon}
        </div>

        {/* Badge */}
        {badge && (
          <span
            className="absolute -top-1.5 -right-1.5 font-mono text-[7px] font-bold px-1 py-0.5 rounded animate-pulse"
            style={{ background: color, color: '#000', boxShadow: `0 0 8px ${color}` }}
          >
            {badge}
          </span>
        )}
      </div>

      {/* Label */}
      <span
        className="text-[7px] uppercase tracking-[0.12em] font-semibold"
        style={{
          color: hovered ? color : 'rgba(200,214,229,0.55)',
          textShadow: hovered ? `0 0 8px ${color}50` : 'none',
          transition: 'all 150ms',
          letterSpacing: '0.08em',
        }}
      >
        {label}
      </span>

      {/* Arrow indicator */}
      <span
        className="absolute bottom-0.5 right-1 text-[8px]"
        style={{
          color,
          opacity: hovered ? 0.9 : 0,
          transform: hovered ? 'translateX(0)' : 'translateX(-4px)',
          transition: 'all 150ms',
        }}
      >
        →
      </span>
    </button>
  )
}

/* Particles */
function Particles({ count = 15 }) {
  const particles = useRef(
    Array.from({ length: count }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 8,
      duration: 12 + Math.random() * 8,
      size: 1 + Math.random() * 2,
    }))
  ).current

  return (
    <div className="absolute inset-0 pointer-events-none z-[4]" aria-hidden="true">
      {particles.map((p) => (
        <div
          key={p.id}
          className="particle"
          style={{
            left: `${p.left}%`,
            bottom: '-10px',
            width: `${p.size}px`,
            height: `${p.size}px`,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
          }}
        />
      ))}
    </div>
  )
}

/* Icons */
function CrosshairIcon() {
  return (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
      <circle cx="12" cy="12" r="3" strokeWidth="1.5" />
    </svg>
  )
}

function TargetIcon() {
  return (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  )
}

function MapIcon() {
  return (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6-10l6 3m0 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4" />
    </svg>
  )
}

function AlertIcon() {
  return (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
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
