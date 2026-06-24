import { useAllBinter } from '../../hooks/useGasApi'
import { formatDate } from '../../utils/formatDate'
import { BINTER_COLOR_MAP } from '../../constants/kerawananCategories'

export default function TimelineBinterPage() {
  const { data: binter, loading } = useAllBinter()

  // Gunakan perbandingan string ISO (YYYY-MM-DD) — aman dari ambiguitas timezone
  const all = (binter || []).sort((a, b) => {
    const ta = a.tanggal || ''
    const tb = b.tanggal || ''
    return tb.localeCompare(ta)
  })

  // Hitung per jenis
  const byJenis = all.reduce((acc, b) => {
    const key = b.jenis_kegiatan || 'Lainnya'
    acc[key] = (acc[key] || 0) + 1
    return acc
  }, {})

  // Hitung per pos
  const byPos = all.reduce((acc, b) => {
    acc[b.pos_id] = (acc[b.pos_id] || 0) + 1
    return acc
  }, {})

  const sortedByPos = Object.entries(byPos).sort((a, b) => b[1] - a[1]).slice(0, 8)
  const maxByPos    = sortedByPos[0]?.[1] || 1

  return (
    <div className="h-full overflow-y-auto bg-[#050810] p-4">
      {/* Header */}
      <div className="mb-4">
        <h2 className="font-bold text-sm tracking-[0.15em] uppercase text-[#00ff88]"
          style={{ textShadow: '0 0 10px rgba(0,255,136,0.4)' }}>
          ◈ TIMELINE BINTER
        </h2>
        <p className="text-[10px] text-[rgba(200,214,229,0.35)] tracking-wider mt-0.5 uppercase">
          Riwayat kegiatan bina teritorial semua pos satgas
        </p>
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-16 rounded-sm bg-[rgba(0,255,136,0.04)] animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="space-y-4">

          {/* Summary */}
          <div className="grid grid-cols-2 gap-3">
            <StatCard label="Total Kegiatan" value={all.length}   color="#4488ff" icon="◈" />
            <StatCard label="Jenis Kegiatan" value={Object.keys(byJenis).length} color="#bb88ff" icon="◆" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Distribusi per jenis */}
            <Panel title="DISTRIBUSI PER JENIS">
              <div className="space-y-2 mt-1">
                {Object.entries(byJenis).sort((a,b) => b[1]-a[1]).map(([jenis, count]) => {
                  const color = BINTER_COLOR_MAP[jenis] || '#8899aa'
                  const pct   = Math.round((count / all.length) * 100)
                  return (
                    <div key={jenis}>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-[9px] uppercase tracking-wide"
                          style={{ color: 'rgba(200,214,229,0.5)' }}>{jenis}</span>
                        <span className="font-mono text-[10px] font-bold" style={{ color }}>
                          {count} <span className="text-[8px] opacity-50">({pct}%)</span>
                        </span>
                      </div>
                      <div className="h-1.5 rounded-full overflow-hidden"
                        style={{ background: 'rgba(255,255,255,0.06)' }}>
                        <div className="h-full rounded-full"
                          style={{ width: `${pct}%`, background: color, boxShadow: `0 0 6px ${color}66` }} />
                      </div>
                    </div>
                  )
                })}
              </div>
            </Panel>

            {/* Aktifitas per pos */}
            <Panel title="AKTIFITAS PER POS">
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
                          style={{ width: `${pct}%`, background: '#4488ff' }} />
                      </div>
                      <span className="font-mono text-[9px] font-bold flex-shrink-0"
                        style={{ color: 'rgba(200,214,229,0.5)' }}>{count}</span>
                    </div>
                  )
                })}
              </div>
            </Panel>
          </div>

          {/* Timeline */}
          <Panel title="RIWAYAT KEGIATAN">
            {all.length === 0 ? (
              <p className="text-[9px] text-[rgba(200,214,229,0.3)] py-3 text-center tracking-widest uppercase">
                Belum ada data kegiatan binter
              </p>
            ) : (
              <div className="space-y-0 mt-1">
                {all.map((item, i) => {
                  const color = BINTER_COLOR_MAP[item.jenis_kegiatan] || '#8899aa'
                  return (
                    <div key={item.id || i} className="flex gap-3 relative">
                      {/* Timeline line */}
                      {i < all.length - 1 && (
                        <div className="absolute left-[7px] top-5 bottom-0 w-px"
                          style={{ background: 'rgba(68,136,255,0.15)' }} />
                      )}
                      {/* Dot */}
                      <div className="w-3.5 h-3.5 rounded-full flex-shrink-0 mt-1.5 relative z-10 flex items-center justify-center"
                        style={{ background: `${color}22`, border: `1px solid ${color}66` }}>
                        <div className="w-1.5 h-1.5 rounded-full"
                          style={{ background: color, boxShadow: `0 0 4px ${color}` }} />
                      </div>
                      {/* Content */}
                      <div className="flex-1 pb-3 min-w-0">
                        <div className="flex items-start justify-between gap-2 flex-wrap">
                          <div>
                            <span className="text-[10px] font-bold"
                              style={{ color: 'rgba(200,214,229,0.8)' }}>
                              {item.jenis_kegiatan || 'Kegiatan'}
                            </span>
                            {item.lokasi && (
                              <span className="text-[9px] ml-1.5" style={{ color: 'rgba(200,214,229,0.35)' }}>
                                · {item.lokasi}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <span className="font-mono text-[8px] px-1.5 py-0.5 rounded-sm"
                              style={{ color: 'rgba(0,255,136,0.6)', background: 'rgba(0,255,136,0.06)',
                                       border: '1px solid rgba(0,255,136,0.15)' }}>
                              {item.pos_id}
                            </span>
                            <span className="text-[8px]" style={{ color: 'rgba(200,214,229,0.3)' }}>
                              {item.tanggal ? formatDate(item.tanggal) : '—'}
                            </span>
                          </div>
                        </div>
                        {item.keterangan && (
                          <p className="text-[9px] mt-0.5 line-clamp-2"
                            style={{ color: 'rgba(200,214,229,0.35)' }}>
                            {item.keterangan}
                          </p>
                        )}
                        {item.jumlah_peserta && (
                          <p className="text-[8px] mt-0.5"
                            style={{ color: 'rgba(200,214,229,0.25)' }}>
                            {item.jumlah_peserta} peserta
                            {item.sasaran ? ` · ${item.sasaran}` : ''}
                          </p>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </Panel>
        </div>
      )}
    </div>
  )
}

function StatCard({ label, value, color, icon }) {
  return (
    <div className="px-3 py-2.5 rounded-sm"
      style={{ background: 'rgba(5,8,10,0.8)', border: '1px solid rgba(0,255,136,0.12)' }}>
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
