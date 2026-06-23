import { usePos, useAllDemografi } from '../../hooks/useSupabase'

// Helper: ambil nilai numerik dari berbagai kemungkinan nama field
function getNum(obj, ...keys) {
  for (const k of keys) {
    const v = Number(obj[k])
    if (!isNaN(v) && v !== 0) return v
  }
  return 0
}

export default function DataDemografiPage() {
  const { data: posList,    loading: loadingPos  } = usePos()
  const { data: demografiList, loading: loadingDemo } = useAllDemografi()

  const loading = loadingPos || loadingDemo

  // Buat lookup pos untuk nama/lokasi/personel
  const posMap = (posList || []).reduce((acc, p) => {
    acc[p.pos_id] = p
    return acc
  }, {})

  // Gabungkan: satu entry per pos_id (jumlahkan jika multi-baris)
  const demoByPos = (demografiList || []).reduce((acc, d) => {
    const id = d.pos_id
    if (!id) return acc
    if (!acc[id]) {
      acc[id] = {
        pos_id:         id,
        total_penduduk: 0,
        total_kk:       0,
        islam:    0, kristen: 0, katolik: 0, hindu: 0,
        buddha:   0, konghucu: 0, lainnya: 0,
        masjid:   0, gereja:  0, pura:    0, vihara: 0,
      }
    }
    acc[id].total_penduduk += getNum(d, 'total_penduduk', 'jumlah_penduduk', 'penduduk')
    acc[id].total_kk       += getNum(d, 'total_kk', 'jumlah_kk', 'kk')
    acc[id].islam    += getNum(d, 'islam')
    acc[id].kristen  += getNum(d, 'kristen')
    acc[id].katolik  += getNum(d, 'katolik')
    acc[id].hindu    += getNum(d, 'hindu')
    acc[id].buddha   += getNum(d, 'buddha')
    acc[id].konghucu += getNum(d, 'konghucu')
    acc[id].lainnya  += getNum(d, 'lainnya')
    acc[id].masjid   += getNum(d, 'masjid', 'masjid_mushola')
    acc[id].gereja   += getNum(d, 'gereja')
    acc[id].pura     += getNum(d, 'pura')
    acc[id].vihara   += getNum(d, 'vihara')
    return acc
  }, {})

  // Pastikan semua 17 pos muncul (meski belum ada data demografi)
  const allPosIds = (posList || []).map(p => p.pos_id)
  allPosIds.forEach(id => {
    if (!demoByPos[id]) {
      demoByPos[id] = {
        pos_id: id, total_penduduk: 0, total_kk: 0,
        islam: 0, kristen: 0, katolik: 0, hindu: 0,
        buddha: 0, konghucu: 0, lainnya: 0,
        masjid: 0, gereja: 0, pura: 0, vihara: 0,
      }
    }
  })

  const all = Object.values(demoByPos)

  const totalPenduduk = all.reduce((s, d) => s + d.total_penduduk, 0)
  const totalKK       = all.reduce((s, d) => s + d.total_kk, 0)

  const byKabupaten = all.reduce((acc, d) => {
    const pos = posMap[d.pos_id]
    const kab = pos?.kabupaten || 'Lainnya'
    if (!acc[kab]) acc[kab] = { pos: 0, penduduk: 0, kk: 0 }
    acc[kab].pos++
    acc[kab].penduduk += d.total_penduduk
    acc[kab].kk       += d.total_kk
    return acc
  }, {})

  const sortedPos = [...all].sort((a, b) => b.total_penduduk - a.total_penduduk)
  const maxPenduduk = sortedPos[0]?.total_penduduk || 1

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
            <StatCard label="Total Penduduk"  value={totalPenduduk.toLocaleString('id-ID')} color="#4488ff"  icon="◉" />
            <StatCard label="Kepala Keluarga" value={totalKK.toLocaleString('id-ID')}       color="#ffaa00"  icon="◈" />
            <StatCard label="Pos Aktif"       value={allPosIds.length}                      color="#00ff88"  icon="◫" />
          </div>

          {/* Per kabupaten */}
          {Object.keys(byKabupaten).length > 0 && (
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
          )}

          {/* Distribusi penduduk per pos */}
          <Panel title="DISTRIBUSI PENDUDUK PER POS">
            <div className="space-y-2 mt-1">
              {sortedPos.map(d => {
                const pos = posMap[d.pos_id]
                const jml = d.total_penduduk
                const pct = Math.round((jml / maxPenduduk) * 100)
                return (
                  <div key={d.pos_id} className="flex items-center gap-2">
                    <span className="font-mono text-[9px] font-bold w-14 flex-shrink-0"
                      style={{ color: 'rgba(0,255,136,0.6)' }}>
                      {d.pos_id}
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
                      <th key={h}
                        className={`py-1.5 px-2 font-bold tracking-widest uppercase ${['PENDUDUK','KK','PERSONEL'].includes(h) ? 'text-center' : 'text-left'}`}
                        style={{ color: 'rgba(0,255,136,0.4)' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {sortedPos.map(d => {
                    const pos = posMap[d.pos_id]
                    return (
                      <tr key={d.pos_id}
                        style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,255,136,0.03)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                      >
                        <td className="py-1.5 px-2 font-mono font-bold" style={{ color: 'rgba(0,255,136,0.6)' }}>
                          {d.pos_id}
                        </td>
                        <td className="py-1.5 px-2" style={{ color: 'rgba(200,214,229,0.7)' }}>
                          {pos?.nama_pos || '—'}
                        </td>
                        <td className="py-1.5 px-2" style={{ color: 'rgba(200,214,229,0.45)' }}>
                          {pos?.kabupaten || '—'}
                        </td>
                        <td className="py-1.5 px-2 max-w-[140px] truncate" style={{ color: 'rgba(200,214,229,0.35)' }}>
                          {pos?.lokasi_desa || '—'}
                        </td>
                        <td className="py-1.5 px-2 font-mono font-bold text-center" style={{ color: '#4488ff' }}>
                          {d.total_penduduk.toLocaleString('id-ID')}
                        </td>
                        <td className="py-1.5 px-2 font-mono font-bold text-center" style={{ color: '#ffaa00' }}>
                          {d.total_kk.toLocaleString('id-ID')}
                        </td>
                        <td className="py-1.5 px-2 font-mono font-bold text-center" style={{ color: '#00ff88' }}>
                          {Number(pos?.jumlah_personel) || '—'}
                        </td>
                      </tr>
                    )
                  })}
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
