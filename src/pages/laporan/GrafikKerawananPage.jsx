import { useAllKerawanan } from '../../hooks/useSupabase'
import { formatDate } from '../../utils/formatDate'
import { KERAWANAN_CATEGORIES } from '../../constants/kerawananCategories'

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

export default function GrafikKerawananPage() {
  const { data: kerawanan, loading } = useAllKerawanan()

  const all       = kerawanan || []
  const aktif     = all.filter(k => k.status?.toLowerCase() === 'aktif')
  const selesai   = all.filter(k => k.status?.toLowerCase() === 'selesai')

  // Hitung per kategori (resolve alias nama lama → baru)
  const byKategori = all.reduce((acc, k) => {
    const key = resolveKategori(k.kategori)
    acc[key] = (acc[key] || 0) + 1
    return acc
  }, {})

  // Hitung per pos
  const byPos = all.reduce((acc, k) => {
    acc[k.pos_id] = (acc[k.pos_id] || 0) + 1
    return acc
  }, {})

  const sortedByPos = Object.entries(byPos)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)

  const maxByPos = sortedByPos[0]?.[1] || 1

  return (
    <div className="h-full overflow-y-auto bg-[#050810] p-4">
      {/* Header */}
      <div className="mb-4">
        <h2 className="font-bold text-sm tracking-[0.15em] uppercase text-[#00ff88]"
          style={{ textShadow: '0 0 10px rgba(0,255,136,0.4)' }}>
          ◈ GRAFIK KERAWANAN
        </h2>
        <p className="text-[10px] text-[rgba(200,214,229,0.35)] tracking-wider mt-0.5 uppercase">
          Analisis distribusi kerawanan semua pos satgas
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
            <StatCard label="Total Kerawanan" value={all.length}     color="#ffaa00" icon="◆" />
            <StatCard label="Aktif"           value={aktif.length}   color="#ff3333" icon="⚠" danger={aktif.length > 0} />
            <StatCard label="Ditangani"       value={selesai.length} color="#00ff88" icon="✓" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Distribusi per kategori */}
            <Panel title="DISTRIBUSI PER KATEGORI">
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

            {/* Top pos rawan */}
            <Panel title="TOP POS RAWAN">
              <div className="space-y-2 mt-1">
                {sortedByPos.map(([posId, count], i) => {
                  const pct = Math.round((count / maxByPos) * 100)
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
                        <div className="h-full rounded-full"
                          style={{ width: `${pct}%`, background: count > 3 ? '#ff3333' : '#ffaa00' }} />
                      </div>
                      <span className="font-mono text-[9px] font-bold flex-shrink-0"
                        style={{ color: 'rgba(200,214,229,0.5)' }}>{count}</span>
                    </div>
                  )
                })}
              </div>
            </Panel>
          </div>

          {/* Tabel detail */}
          <Panel title="DETAIL KERAWANAN AKTIF">
            {aktif.length === 0 ? (
              <p className="text-[9px] text-[rgba(200,214,229,0.3)] py-3 text-center tracking-widest uppercase">
                Tidak ada kerawanan aktif
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

function Panel({ title, children }) {
  return (
    <div className="rounded-sm overflow-hidden"
      style={{ background: 'rgba(5,8,10,0.8)', border: '1px solid rgba(0,255,136,0.12)' }}>
      <div className="px-3 py-1.5" style={{ borderBottom: '1px solid rgba(0,255,136,0.08)', background: 'rgba(0,255,136,0.03)' }}>
        <span className="text-[8px] font-bold tracking-[0.2em] uppercase" style={{ color: 'rgba(0,255,136,0.7)' }}>
          {title}
        </span>
      </div>
      <div className="p-3">{children}</div>
    </div>
  )
}
