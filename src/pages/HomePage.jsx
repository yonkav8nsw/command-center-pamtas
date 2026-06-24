import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useAllKerawanan, usePos, useSummary } from '../hooks/useGasApi'

export default function HomePage() {
  const navigate = useNavigate()
  const { profile } = useAuth()
  const { data: kerawanan } = useAllKerawanan()
  const { data: posList } = usePos()
  const { data: summary } = useSummary()

  const aktifCount = (kerawanan || []).filter(k => k.status?.toLowerCase() === 'aktif').length
  const totalPos = (posList || []).length || 17
  const totalPersonel = (posList || []).reduce((s, p) => s + (Number(p.jumlah_personel) || 0), 0)

  return (
    <div className="h-full overflow-y-auto bg-[#050810]">
      <div className="flex flex-col items-center justify-center min-h-full px-6 py-10">

        {/* Logo / emblem area */}
        <div className="mb-8 flex flex-col items-center">
          <div
            className="w-32 h-32 rounded-full flex items-center justify-center mb-4"
            style={{
              background: 'radial-gradient(circle, rgba(0,255,136,0.12) 0%, rgba(0,255,136,0.04) 60%, transparent 100%)',
              border: '2px solid rgba(0,255,136,0.3)',
              boxShadow: '0 0 40px rgba(0,255,136,0.15), inset 0 0 30px rgba(0,255,136,0.05)',
            }}
          >
            <span style={{ fontSize: '48px', lineHeight: 1 }}>🪖</span>
          </div>
          <h1
            className="text-2xl font-black tracking-[0.3em] uppercase text-center"
            style={{ color: '#00ff88', textShadow: '0 0 20px rgba(0,255,136,0.5)' }}
          >
            COMMAND CENTER
          </h1>
          <p
            className="text-[11px] tracking-[0.25em] uppercase mt-1 text-center"
            style={{ color: 'rgba(200,214,229,0.45)' }}
          >
            PAMTAS RI — MALAYSIA
          </p>
          <p
            className="text-[10px] tracking-widest uppercase mt-0.5"
            style={{ color: 'rgba(0,255,136,0.4)' }}
          >
            YONKAV 8/NSW · TA 2026
          </p>
        </div>

        {/* Stat chips */}
        <div className="flex flex-wrap gap-3 justify-center mb-8">
          <StatChip icon="◫" label="Personel" value={totalPersonel} unit="pax" color="#00ff88" />
          <StatChip icon="◈" label="Pos Aktif" value={totalPos} unit="pos" color="#4488ff" />
          <StatChip icon="👥" label="Penduduk" value={(summary?.total_penduduk || 0).toLocaleString('id-ID')} unit="jiwa" color="#bb88ff" />
          <StatChip
            icon="⚠"
            label="Insiden Aktif"
            value={aktifCount}
            unit="kasus"
            color={aktifCount > 0 ? '#ff3333' : '#00ff88'}
            pulse={aktifCount > 0}
          />
        </div>

        {/* Greeting */}
        {profile?.nama && (
          <p className="text-[rgba(200,214,229,0.4)] text-[11px] tracking-widest uppercase mb-6">
            Selamat datang, <span className="text-[rgba(0,255,136,0.7)] font-bold">{profile.nama}</span>
          </p>
        )}

        {/* Navigation cards */}
        <div className="grid grid-cols-2 gap-3 w-full max-w-sm">
          <NavCard
            icon={<MapIcon />}
            label="Overview"
            desc="Peta & situasi terkini"
            onClick={() => navigate('/overview')}
            color="#00ff88"
          />
          <NavCard
            icon={<AlertIcon />}
            label="Data Insiden"
            desc={aktifCount > 0 ? `${aktifCount} insiden aktif` : 'Semua insiden'}
            onClick={() => navigate('/insiden')}
            color={aktifCount > 0 ? '#ff3333' : '#00ff88'}
            danger={aktifCount > 0}
          />
          <NavCard
            icon={<HandshakeIcon />}
            label="Program Binter"
            desc="Kegiatan teritorial"
            onClick={() => navigate('/binter')}
            color="#4488ff"
          />
          <NavCard
            icon={<ChartIcon />}
            label="Laporan"
            desc="Grafik & analisis"
            onClick={() => navigate('/laporan/kerawanan')}
            color="#bb88ff"
          />
        </div>

        {/* Divider */}
        <div className="w-full max-w-sm my-6"
          style={{ height: '1px', background: 'linear-gradient(90deg, transparent, rgba(0,255,136,0.2), transparent)' }} />

        {/* Pos list shortcut */}
        <div className="w-full max-w-sm">
          <p className="hud-label mb-3 text-center">17 POS SATGAS</p>
          <div className="grid grid-cols-4 gap-1.5">
            {(posList || []).map(pos => {
              const posKey = pos.pos_id.replace('POS-', '')
              const hasRawan = (kerawanan || []).some(
                k => k.pos_id === pos.pos_id && k.status?.toLowerCase() === 'aktif'
              )
              return (
                <button
                  key={pos.pos_id}
                  onClick={() => navigate(`/pos/${pos.pos_id}`)}
                  className="py-2 px-1 rounded-sm text-[10px] font-bold font-mono transition-all"
                  style={hasRawan ? {
                    background: 'rgba(255,51,51,0.1)',
                    border: '1px solid rgba(255,51,51,0.35)',
                    color: '#ff5555',
                  } : {
                    background: 'rgba(0,255,136,0.05)',
                    border: '1px solid rgba(0,255,136,0.18)',
                    color: 'rgba(0,255,136,0.65)',
                  }}
                >
                  {posKey}
                  {hasRawan && (
                    <span className="block w-1 h-1 rounded-full bg-[#ff3333] mx-auto mt-0.5 animate-pulse" />
                  )}
                </button>
              )
            })}
          </div>
        </div>

        {/* Footer */}
        <p className="text-[8px] tracking-[0.2em] uppercase mt-8"
          style={{ color: 'rgba(200,214,229,0.15)' }}>
          SISTEM INFORMASI KOMANDO TAKTIS · SATGAS PAMTAS
        </p>
      </div>
    </div>
  )
}

function StatChip({ icon, label, value, unit, color, pulse }) {
  return (
    <div className="flex flex-col items-center px-4 py-2.5 rounded-sm"
      style={{ background: `${color}08`, border: `1px solid ${color}22` }}>
      <div className="flex items-center gap-1.5 mb-0.5">
        {pulse && (
          <span className="w-1.5 h-1.5 rounded-full animate-pulse flex-shrink-0"
            style={{ background: color }} />
        )}
        <span className="text-[8px] uppercase tracking-wider" style={{ color: `${color}70` }}>{label}</span>
      </div>
      <span className="font-mono font-bold text-xl leading-none"
        style={{ color, textShadow: `0 0 12px ${color}50` }}>{value}</span>
      <span className="text-[8px] mt-0.5" style={{ color: `${color}50` }}>{unit}</span>
    </div>
  )
}

function NavCard({ icon, label, desc, onClick, color, danger }) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-start p-3 rounded-sm text-left transition-all"
      style={{
        background: danger ? 'rgba(255,51,51,0.06)' : `${color}06`,
        border: `1px solid ${danger ? 'rgba(255,51,51,0.2)' : color + '20'}`,
      }}
      onMouseEnter={e => {
        e.currentTarget.style.background = danger ? 'rgba(255,51,51,0.12)' : `${color}12`
        e.currentTarget.style.borderColor = danger ? 'rgba(255,51,51,0.4)' : `${color}44`
      }}
      onMouseLeave={e => {
        e.currentTarget.style.background = danger ? 'rgba(255,51,51,0.06)' : `${color}06`
        e.currentTarget.style.borderColor = danger ? 'rgba(255,51,51,0.2)' : `${color}20`
      }}
    >
      <div className="w-6 h-6 mb-2 flex items-center justify-center"
        style={{ color: danger ? '#ff3333' : color }}>
        {icon}
      </div>
      <p className="text-[11px] font-bold uppercase tracking-wider"
        style={{ color: danger ? '#ff5555' : color }}>{label}</p>
      <p className="text-[9px] mt-0.5" style={{ color: 'rgba(200,214,229,0.35)' }}>{desc}</p>
    </button>
  )
}

function MapIcon() {
  return <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
      d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6-10l6 3m0 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4" />
  </svg>
}
function AlertIcon() {
  return <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
  </svg>
}
function HandshakeIcon() {
  return <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
}
function ChartIcon() {
  return <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
}
