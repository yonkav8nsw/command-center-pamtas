import { formatNumber, calcPercent } from '../../utils/formatDate'
import { AgamaChart } from '../dashboard/KerawananChart'
import { AGAMA_LIST, IBADAH_LIST } from '../../constants/kerawananCategories'
import { LoadingSpinner } from '../ui/LoadingSpinner'

export function DemografiTable({ demografi, loading }) {
  if (loading) return <LoadingSpinner text="Memuat data demografi..." />

  // Jika GAS tetap mengembalikan array (fallback), aggregate di sini juga
  const demo = Array.isArray(demografi)
    ? demografi.length > 0
      ? demografi.reduce((acc, row) => {
          const NUM = ['total_penduduk','total_kk','islam','kristen','katolik','hindu','buddha','konghucu','lainnya','masjid','gereja','pura','vihara']
          NUM.forEach(f => { acc[f] = (Number(acc[f]||0)) + (Number(row[f]||0)) })
          return acc
        }, { ...demografi[0] })
      : null
    : demografi

  if (!demo) return (
    <p className="text-[rgba(200,214,229,0.3)] text-xs tracking-wider text-center py-6 uppercase">
      Data demografi belum tersedia
    </p>
  )

  // gunakan `demo` sebagai alias agar kode di bawah tetap menggunakan variable yang benar
  // (kita re-assign demografi ke demo)
  // eslint-disable-next-line no-param-reassign
  demografi = demo

  const total = Number(demografi.total_penduduk || 0)

  return (
    <div className="space-y-4 fade-in">

      {/* ── Ringkasan populasi ─────────────────────────── */}
      <div className="grid grid-cols-2 gap-2">
        <MetricCard
          label="Total Penduduk"
          value={formatNumber(total)}
          unit="Jiwa"
          color="#00ff88"
        />
        <MetricCard
          label="Kepala Keluarga"
          value={formatNumber(demografi.total_kk)}
          unit="KK"
          color="#4488ff"
        />
      </div>

      {/* ── Distribusi agama ───────────────────────────── */}
      <div className="hud-panel">
        <div className="hud-header">
          <span className="hud-title">◈ Distribusi Agama</span>
        </div>
        <div className="p-3 grid grid-cols-1 md:grid-cols-2 gap-4">
          <AgamaChart demografi={demografi} />
          <div className="space-y-2">
            {AGAMA_LIST.map(({ key, label }) => {
              const val = Number(demografi[key] || 0)
              const pct = calcPercent(val, total)
              if (val === 0) return null
              return (
                <div key={key}>
                  <div className="flex justify-between text-[10px] mb-1">
                    <span className="text-[rgba(200,214,229,0.6)]">{label}</span>
                    <span className="font-mono text-[rgba(200,214,229,0.5)]">
                      {formatNumber(val)} <span className="text-[rgba(0,255,136,0.6)]">({pct}%)</span>
                    </span>
                  </div>
                  <div className="hud-bar-track">
                    <div className="hud-bar-fill" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* ── Tempat ibadah ──────────────────────────────── */}
      <div className="hud-panel">
        <div className="hud-header">
          <span className="hud-title">◫ Tempat Ibadah</span>
        </div>
        <div className="p-3 grid grid-cols-2 sm:grid-cols-4 gap-2">
          {IBADAH_LIST.map(({ key, label }) => (
            <div
              key={key}
              className="text-center py-3 px-2 rounded-sm"
              style={{
                background: 'rgba(0,255,136,0.03)',
                border: '1px solid rgba(0,255,136,0.12)',
              }}
            >
              <p className="font-mono text-xl font-bold text-[#00ff88]"
                style={{ textShadow: '0 0 10px rgba(0,255,136,0.4)' }}>
                {demografi[key] || 0}
              </p>
              <p className="text-[9px] text-[rgba(200,214,229,0.4)] mt-1 uppercase tracking-wider">{label}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}

function MetricCard({ label, value, unit, color }) {
  return (
    <div
      className="relative rounded-sm px-4 py-3 overflow-hidden"
      style={{ background: `${color}08`, border: `1px solid ${color}22` }}
    >
      <div className="absolute top-0 left-0 w-2 h-2"
        style={{ borderTop: `1px solid ${color}`, borderLeft: `1px solid ${color}`, opacity: 0.5 }} />
      <div className="absolute bottom-0 right-0 w-2 h-2"
        style={{ borderBottom: `1px solid ${color}`, borderRight: `1px solid ${color}`, opacity: 0.5 }} />
      <p className="text-[9px] tracking-[0.12em] uppercase mb-1"
        style={{ color: `${color}66` }}>{unit}</p>
      <p className="font-mono text-2xl font-bold leading-none mb-1"
        style={{ color, textShadow: `0 0 14px ${color}66` }}>{value}</p>
      <p className="text-[10px] uppercase tracking-wider text-[rgba(200,214,229,0.4)]">{label}</p>
    </div>
  )
}
