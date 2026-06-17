import { usePos } from '../../hooks/useGasApi'

const AGAMA_COLORS = {
  islam:     '#00ff88',
  kristen:   '#4488ff',
  katolik:   '#bb88ff',
  hindu:     '#ffaa00',
  buddha:    '#ff8844',
  konghucu:  '#00ccff',
  lainnya:   '#8899aa',
}

export default function DataDemografiPage() {
  const { data: posList, loading } = usePos()

  const all = posList || []

  const totalPenduduk = all.reduce((s, p) => s + (Number(p.total_penduduk) || 0), 0)
  const totalKK       = all.reduce((s, p) => s + (Number(p.total_kk) || 0), 0)

  const byKabupaten = all.reduce((acc, p) => {
    const kab = p.kabupaten || 'Lainnya'
    if (!acc[kab]) acc[kab] = { pos: 0, penduduk: 0, kk: 0 }
    acc[kab].pos++
    acc[kab].penduduk += Number(p.total_penduduk) || 0
    acc[kab].kk       += Number(p.total_kk)       || 0
    return acc
  }, {})

  const sortedPos = [...all]
    .sort((a, b) => (Number(b.total_penduduk) || 0) - (Number(a.total_penduduk) || 0))
  const maxPenduduk = Number(sortedPos[0]?.total_penduduk) || 1

  return (
    <div className="h-full overflow-y-auto bg-[#050810] p-4">
      {/* Header */}
      <div className="mb-4">
        <h2 className="font-bold text-sm tracking-[0.15em] uppercase text-[#00ff88]"
          style={{ textShadow: '0 0 10px rgba(0,255,136,0.4)' }}>
          ◈ DATA DEMOGRAFI
        </h2>
        <p className="text-[10px] text-[rgba(200,214,229,0.35)] tracking-wider mt-0.5 uppercase">
          Data kependudukan wilayah tugas satgas pamtas
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
            <StatCard label="Total Penduduk" value={totalPenduduk.toLocaleString('id-ID')} color="#4488ff"  icon="◉" />
            <StatCard label="Kepala Keluarga" value={totalKK.toLocaleString('id-ID')}       color="#ffaa00" icon="◈" />
            <StatCard label="Pos Aktif"       value={all.length}                            color="#00ff88" icon="◫" />
          </div>

          {/* Per kabupaten */}
          <div className="grid grid-cols-2 gap-3">
            {Object.entries(byKabupaten).map(([kab, data]) => (
              <Panel key={kab} title={`KABUPATEN ${kab.toUpperCase()}`}>
                <div className="grid grid-cols-3 gap-2 mt-1">
                  <MiniStat label="Pos"      value={data.pos}                              color="#00ff88" />
                  <MiniStat label="Penduduk" value={data.penduduk.toLocaleString('id-ID')} color="#4488ff" />
                  <MiniStat label="KK"       value={data.kk.toLocaleString('id-ID')}       color="#ffaa00" />
                </div>
              </Panel>
            ))}
          </div>

          {/* Distribusi penduduk per pos */}
          <Panel title="DISTRIBUSI PENDUDUK PER POS">
            <div className="space-y-2 mt-1">
              {sortedPos.map(pos => {
                const jml = Number(pos.total_penduduk) || 0
                const pct = Math.round((jml / maxPenduduk) * 100)
                return (
                  <div key={pos.pos_id} className="flex items-center gap-2">
                    <span className="font-mono text-[9px] font-bold w-14 flex-shrink-0"
                      style={{ color: 'rgba(0,255,136,0.6)' }}>
                      {pos.pos_id}
                    </span>
                    <div className="flex-1 h-1.5 rounded-full overflow-hidden"
                      style={{ background: 'rgba(255,255,255,0.06)' }}>
                      <div className="h-full rounded-full transition-all duration-700"
                        style={{ width: `${pct}%`, background: '#4488ff', boxShadow: '0 0 4px rgba(68,136,255,0.5)' }} />
                    </div>
                    <span className="font-mono text-[9px] w-16 text-right flex-shrink-0"
                      style={{ color: 'rgba(200,214,229,0.5)' }}>
                      {jml.toLocaleString('id-ID')}
                    </span>
                  </div>
                )
              })}
            </div>
          </Panel>

          {/* Tabel lengkap */}
          <Panel title="DATA LENGKAP PER POS">
            <div className="overflow-x-auto mt-1">
              <table className="w-full text-[9px]">
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(0,255,136,0.1)' }}>
                    {['POS', 'NAMA POS', 'KABUPATEN', 'DESA/LOKASI', 'PENDUDUK', 'KK', 'PERSONEL'].map(h => (
                      <th key={h} className="text-left py-1.5 px-2 font-bold tracking-widest uppercase"
                        style={{ color: 'rgba(0,255,136,0.4)' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {sortedPos.map((pos, i) => (
                    <tr key={pos.pos_id}
                      style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,255,136,0.03)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <td className="py-1.5 px-2 font-mono font-bold" style={{ color: 'rgba(0,255,136,0.6)' }}>
                        {pos.pos_id}
                      </td>
                      <td className="py-1.5 px-2" style={{ color: 'rgba(200,214,229,0.7)' }}>
                        {pos.nama_pos || '—'}
                      </td>
                      <td className="py-1.5 px-2" style={{ color: 'rgba(200,214,229,0.45)' }}>
                        {pos.kabupaten || '—'}
                      </td>
                      <td className="py-1.5 px-2 max-w-[140px] truncate" style={{ color: 'rgba(200,214,229,0.35)' }}>
                        {pos.lokasi_desa || '—'}
                      </td>
                      <td className="py-1.5 px-2 font-mono font-bold text-right" style={{ color: '#4488ff' }}>
                        {(Number(pos.total_penduduk) || 0).toLocaleString('id-ID')}
                      </td>
                      <td className="py-1.5 px-2 font-mono font-bold text-right" style={{ color: '#ffaa00' }}>
                        {(Number(pos.total_kk) || 0).toLocaleString('id-ID')}
                      </td>
                      <td className="py-1.5 px-2 font-mono font-bold text-right" style={{ color: '#00ff88' }}>
                        {Number(pos.jumlah_personel) || '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
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
      <div className="font-mono font-bold text-xl leading-none"
        style={{ color, textShadow: `0 0 14px ${color}55` }}>
        {value}
      </div>
    </div>
  )
}

function MiniStat({ label, value, color }) {
  return (
    <div className="text-center p-2 rounded-sm"
      style={{ background: `${color}08`, border: `1px solid ${color}18` }}>
      <p className="font-mono font-bold text-sm" style={{ color }}>{value}</p>
      <p className="text-[8px] uppercase tracking-widest mt-0.5" style={{ color: 'rgba(200,214,229,0.3)' }}>{label}</p>
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
