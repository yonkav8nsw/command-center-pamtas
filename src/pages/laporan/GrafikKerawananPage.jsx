import { useState } from 'react'
import { useAllKerawanan } from '../../hooks/useSupabase'
import { formatDate } from '../../utils/formatDate'
import { KERAWANAN_CATEGORIES, getKategoriPoin } from '../../constants/kerawananCategories'

// Mapping alias nama lama → nama kategori baru (konsisten dengan PamtasMap)
const KATEGORI_ALIAS = {
  'Human Trafficking': 'Trafficking',
  'Illegal Logging':   'Logging',
  'Ilegal Logging':    'Logging',
  'Penyelundupan':     'Trading',
  'Imigran Gelap':     'PMI NP',
  'Penjarahan Laut':   'Kriminal',
  'Ketergantungan':    'Trading',
  'Isolasi Wilayah':   'Trading',
}

function resolveKategori(k) {
  return KATEGORI_ALIAS[k] || k || 'Lainnya'
}

const KATEGORI_COLOR = KERAWANAN_CATEGORIES.reduce((acc, c) => {
  acc[c.id] = c.color
  return acc
}, { 'Lainnya': '#8899aa' })

// Mode ranking DAFTAR POS
const RANK_OPTIONS = [
  { value: 'skor',   label: 'Skor Ancaman' },
  { value: 'jumlah', label: 'Jumlah Insiden' },
]

// Skor legend items
const SKOR_LEGEND = [
  { label: 'Narkoba',     poin: 6, color: '#dc2626' },
  { label: 'Trafficking', poin: 5, color: '#db2777' },
  { label: 'PMI NP',      poin: 4, color: '#ea580c' },
  { label: 'Trading',     poin: 3, color: '#f59e0b' },
  { label: 'Kriminal',    poin: 2, color: '#ef4444' },
  { label: 'Logging',     poin: 2, color: '#d97706' },
  { label: 'Border',      poin: 1, color: '#0ea5e9' },
]

export default function GrafikKerawananPage() {
  const { data: kerawanan, loading } = useAllKerawanan()
  const [rankMode, setRankMode] = useState('skor')

  const all       = kerawanan || []
  const aktif     = all.filter(k => k.status?.toLowerCase() === 'aktif')
  const selesai   = all.filter(k => k.status?.toLowerCase() === 'selesai')

  // Hitung per kategori (resolve alias nama lama → baru)
  const byKategori = all.reduce((acc, k) => {
    const key = resolveKategori(k.kategori)
    acc[key] = (acc[key] || 0) + 1
    return acc
  }, {})

  // Hitung per pos — dua metrik: jumlah insiden + skor ancaman
  const byPos = all.reduce((acc, k) => {
    const pid = k.pos_id
    if (!acc[pid]) acc[pid] = { count: 0, skor: 0 }
    acc[pid].count += 1
    // Skor hanya dari insiden aktif
    if (k.status?.toLowerCase() === 'aktif') {
      acc[pid].skor += getKategoriPoin(resolveKategori(k.kategori))
    }
    return acc
  }, {})

  // Sort berdasarkan mode yang dipilih
  const sortedByPos = Object.entries(byPos)
    .sort((a, b) => {
      if (rankMode === 'skor')   return b[1].skor  - a[1].skor
      return b[1].count - a[1].count
    })
    .slice(0, 10)

  const maxVal = sortedByPos[0]
    ? (rankMode === 'skor' ? sortedByPos[0][1].skor : sortedByPos[0][1].count)
    : 1

  return (
    <div className="h-full overflow-y-auto bg-[#050810] p-4">
      {/* Header */}
      <div className="mb-4">
        <h2 className="font-bold text-sm tracking-[0.15em] uppercase text-[#00ff88]"
          style={{ textShadow: '0 0 10px rgba(0,255,136,0.4)' }}>
          ◈ GRAFIK INSIDEN
        </h2>
        <p className="text-[10px] text-[rgba(200,214,229,0.35)] tracking-wider mt-0.5 uppercase">
          Analisis distribusi insiden kerawanan semua pos satgas
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-32 rounded-sm bg-[rgba(0,255,136,0.04)] animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="space-y-4">

          {/* Summary cards */}
          <div className="grid grid-cols-3 gap-3">
            <StatCard label="Total Insiden" value={all.length}     color="#ffaa00" icon="◆" />
            <StatCard label="Aktif"          value={aktif.length}   color="#ff3333" icon="⚠" danger={aktif.length > 0} />
            <StatCard label="Ditangani"      value={selesai.length} color="#00ff88" icon="✓" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Insiden Per Kategori */}
            <Panel title="INSIDEN PER KATEGORI">
              <div className="space-y-2 mt-1">
                {Object.entries(byKategori).sort((a,b) => b[1]-a[1]).map(([kat, count]) => {
                  const color = KATEGORI_COLOR[kat] || '#8899aa'
                  const pct   = Math.round((count / all.length) * 100)
                  return (
                    <div key={kat}>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-[9px] uppercase tracking-wide"
                          style={{ color: 'rgba(200,214,229,0.5)' }}>{kat}</span>
                        <span className="font-mono text-[10px] font-bold" style={{ color }}>
                          {count} <span className="text-[8px] opacity-50">({pct}%)</span>
                        </span>
                      </div>
                      <div className="h-1.5 rounded-full overflow-hidden"
                        style={{ background: 'rgba(255,255,255,0.06)' }}>
                        <div className="h-full rounded-full transition-all duration-700"
                          style={{ width: `${pct}%`, background: color, boxShadow: `0 0 6px ${color}66` }} />
                      </div>
                    </div>
                  )
                })}
              </div>
            </Panel>

            {/* Daftar Pos dengan Kerawanan Tinggi — dengan dropdown mode */}
            <Panel
              title="DAFTAR POS DENGAN KERAWANAN TINGGI"
              action={
                <select
                  className="hud-select text-[8px] py-0.5 px-1.5 h-5"
                  value={rankMode}
                  onChange={e => setRankMode(e.target.value)}
                >
                  {RANK_OPTIONS.map(o => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              }
            >
              <div className="space-y-2 mt-1">
                {sortedByPos.length === 0 ? (
                  <p className="text-[9px] text-[rgba(200,214,229,0.3)] text-center py-4">Tidak ada data</p>
                ) : sortedByPos.map(([posId, stats], i) => {
                  const val = rankMode === 'skor' ? stats.skor : stats.count
                  const pct = maxVal > 0 ? Math.round((val / maxVal) * 100) : 0
                  const isHigh = rankMode === 'skor' ? stats.skor >= 10 : stats.count > 3
                  const isMid  = rankMode === 'skor' ? stats.skor >= 5  : stats.count > 1
                  const barColor = isHigh ? '#ff3333' : isMid ? '#ffaa00' : 'rgba(0,255,136,0.5)'
                  return (
                    <div key={posId} className="flex items-center gap-2">
                      <span className="font-mono text-[8px] w-4 text-right flex-shrink-0"
                        style={{ color: 'rgba(200,214,229,0.3)' }}>{i+1}</span>
                      <span className="font-mono text-[9px] font-bold w-14 flex-shrink-0"
                        style={{ color: 'rgba(0,255,136,0.6)' }}>
                        {posId.replace('POS-', 'POS ')}
                      </span>
                      <div className="flex-1 h-1.5 rounded-full overflow-hidden"
                        style={{ background: 'rgba(255,255,255,0.06)' }}>
                        <div className="h-full rounded-full transition-all duration-500"
                          style={{ width: `${pct}%`, background: barColor }} />
                      </div>
                      <span className="font-mono text-[9px] font-bold flex-shrink-0 w-8 text-right"
                        style={{ color: barColor }}>
                        {val}
                        {rankMode === 'skor' && (
                          <span className="text-[7px] opacity-50 ml-0.5">pt</span>
                        )}
                      </span>
                    </div>
                  )
                })}
              </div>
              {/* Visual score legend */}
              <div className="mt-3 pt-2 border-t border-[rgba(0,255,136,0.06)]">
                {rankMode === 'skor' ? (
                  <div>
                    <p className="text-[8px] uppercase tracking-[0.15em] mb-2"
                      style={{ color: 'rgba(200,214,229,0.3)' }}>
                      Bobot Poin per Kategori
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {SKOR_LEGEND.map(({ label, poin, color }) => (
                        <div key={label} className="flex items-center gap-1 px-1.5 py-0.5 rounded-sm"
                          style={{ background: `${color}12`, border: `1px solid ${color}30` }}>
                          <div className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                            style={{ background: color, boxShadow: `0 0 4px ${color}` }} />
                          <span className="text-[8px] font-medium" style={{ color: 'rgba(200,214,229,0.6)' }}>
                            {label}
                          </span>
                          <span className="font-mono text-[9px] font-bold ml-0.5" style={{ color }}>
                            {poin}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p className="text-[8px] leading-relaxed" style={{ color: 'rgba(200,214,229,0.3)' }}>
                    Jumlah = total insiden (aktif + selesai)
                  </p>
                )}
              </div>
            </Panel>
          </div>

          {/* Tabel detail */}
          <Panel title="DETAIL INSIDEN AKTIF">
            {aktif.length === 0 ? (
              <p className="text-[9px] text-[rgba(200,214,229,0.3)] py-3 text-center tracking-widest uppercase">
                Tidak ada insiden aktif
              </p>
            ) : (
              <div className="overflow-x-auto mt-1">
                <table className="w-full text-[9px]">
                  <thead>
                    <tr style={{ borderBottom: '1px solid rgba(0,255,136,0.1)' }}>
                      {['POS', 'KATEGORI', 'TANGGAL', 'DESKRIPSI', 'STATUS'].map(h => (
                        <th key={h} className="text-left py-1.5 px-2 font-bold tracking-widest uppercase"
                          style={{ color: 'rgba(0,255,136,0.4)' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {aktif.map((k, i) => (
                      <tr key={k.id || i}
                        className="transition-colors"
                        style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,51,51,0.04)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                      >
                        <td className="py-1.5 px-2 font-mono font-bold" style={{ color: 'rgba(0,255,136,0.6)' }}>
                          {k.pos_id}
                        </td>
                        <td className="py-1.5 px-2">
                          {(() => {
                            const resolvedKat = resolveKategori(k.kategori)
                            const color = KATEGORI_COLOR[resolvedKat] || '#8899aa'
                            return (
                              <span className="px-1.5 py-0.5 rounded-sm font-bold"
                                style={{ background: `${color}18`, color, border: `1px solid ${color}33` }}>
                                {resolvedKat}
                              </span>
                            )
                          })()}
                        </td>
                        <td className="py-1.5 px-2" style={{ color: 'rgba(200,214,229,0.4)' }}>
                          {k.tanggal ? formatDate(k.tanggal) : '—'}
                        </td>
                        <td className="py-1.5 px-2 max-w-[200px] truncate" style={{ color: 'rgba(200,214,229,0.55)' }}>
                          {k.deskripsi || '—'}
                        </td>
                        <td className="py-1.5 px-2">
                          <span className="px-1.5 py-0.5 rounded-sm font-bold text-[#ff3333]"
                            style={{ background: 'rgba(255,51,51,0.1)', border: '1px solid rgba(255,51,51,0.25)' }}>
                            AKTIF
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Panel>
        </div>
      )}
    </div>
  )
}

function StatCard({ label, value, color, icon, danger }) {
  return (
    <div className="px-3 py-2.5 rounded-sm"
      style={{
        background: 'rgba(5,8,10,0.8)',
        border: `1px solid ${danger ? 'rgba(255,51,51,0.25)' : 'rgba(0,255,136,0.12)'}`,
        boxShadow: danger ? '0 0 12px rgba(255,51,51,0.08)' : 'none',
      }}>
      <div className="flex items-center gap-1.5 mb-1">
        <span className="text-[10px]" style={{ color }}>{icon}</span>
        <span className="text-[8px] uppercase tracking-widest" style={{ color: 'rgba(200,214,229,0.35)' }}>{label}</span>
      </div>
      <div className="font-mono font-bold text-2xl leading-none"
        style={{ color, textShadow: `0 0 14px ${color}55` }}>
        {value}
      </div>
    </div>
  )
}

function Panel({ title, children, action }) {
  return (
    <div className="rounded-sm overflow-hidden"
      style={{ background: 'rgba(5,8,10,0.8)', border: '1px solid rgba(0,255,136,0.12)' }}>
      <div className="px-3 py-1.5 flex items-center justify-between"
        style={{ borderBottom: '1px solid rgba(0,255,136,0.08)', background: 'rgba(0,255,136,0.03)' }}>
        <span className="text-[8px] font-bold tracking-[0.2em] uppercase" style={{ color: 'rgba(0,255,136,0.7)' }}>
          {title}
        </span>
        {action && <div>{action}</div>}
      </div>
      <div className="p-3">{children}</div>
    </div>
  )
}
