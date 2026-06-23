import { useState } from 'react'
import { usePos, useAllTokoh } from '../../hooks/useSupabase'

// Normalisasi kategori dari sheet (TOMAS/TODAT/TOGA) ke display label
const KATEGORI_NORMALIZE = {
  'TOMAS': 'Masyarakat', 'tomas': 'Masyarakat',
  'TODAT': 'Adat',       'todat': 'Adat',
  'TOGA':  'Agama',      'toga':  'Agama',
  'Adat':       'Adat',
  'Masyarakat': 'Masyarakat',
  'Agama':      'Agama',
}
function normalizeKategori(raw) {
  return KATEGORI_NORMALIZE[raw] || KATEGORI_NORMALIZE[raw?.trim()] || raw || 'Lainnya'
}

const KATEGORI_COLOR = {
  'Adat':        '#ffaa00',
  'Masyarakat':  '#4488ff',
  'Agama':       '#bb88ff',
  'Pemuda':      '#00ff88',
  'Lainnya':     '#8899aa',
}

export default function TokohWilayahPage() {
  const { data: posList, loading: posLoading } = usePos()
  const { data: tokohData, loading: tokohLoading } = useAllTokoh()
  const [filterPos,      setFilterPos]      = useState('all')
  const [filterKategori, setFilterKategori] = useState('all')
  const [search,         setSearch]         = useState('')

  const loading = posLoading || tokohLoading
  // Normalisasi kategori dari sheet
  const allTokoh = (tokohData || []).map(t => ({
    ...t,
    _kategori: normalizeKategori(t.kategori),
  }))

  const posNameMap = (posList || []).reduce((acc, p) => {
    acc[p.pos_id] = p.nama_pos || p.pos_id
    return acc
  }, {})

  const tokoh = allTokoh.filter(t => {
    if (filterPos !== 'all' && t.pos_id !== filterPos) return false
    if (filterKategori !== 'all' && t._kategori !== filterKategori) return false
    if (search && !t.nama?.toLowerCase().includes(search.toLowerCase()) &&
        !t.jabatan?.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  const byKategori = allTokoh.reduce((acc, t) => {
    const k = t._kategori || 'Lainnya'
    acc[k] = (acc[k] || 0) + 1
    return acc
  }, {})

  return (
    <div className="h-full overflow-y-auto bg-[#050810] p-4">
      {/* Header */}
      <div className="mb-4">
        <h2 className="font-bold text-sm tracking-[0.15em] uppercase text-[#00ff88]"
          style={{ textShadow: '0 0 10px rgba(0,255,136,0.4)' }}>
          ◈ TOKOH WILAYAH
        </h2>
        <p className="text-[10px] text-[rgba(200,214,229,0.35)] tracking-wider mt-0.5 uppercase">
          Data tokoh masyarakat, adat, dan agama wilayah tugas
        </p>
      </div>

      <div className="space-y-4">

        {/* Summary + distribusi */}
        <div className="grid grid-cols-4 gap-3">
          <StatCard label="Total Tokoh" value={allTokoh.length} color="#bb88ff" icon="◉" />
          {Object.entries(byKategori).map(([kat, count]) => (
            <StatCard key={kat} label={kat} value={count} color={KATEGORI_COLOR[kat] || '#8899aa'} icon="◆" />
          ))}
        </div>

        {/* Filter bar */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Search */}
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-sm flex-1 min-w-[150px]"
            style={{ background: 'rgba(5,8,10,0.8)', border: '1px solid rgba(0,255,136,0.15)' }}>
            <svg className="w-3 h-3 flex-shrink-0" fill="none" stroke="rgba(0,255,136,0.4)" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Cari nama / jabatan..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="flex-1 bg-transparent outline-none text-[9px] tracking-wide placeholder:text-[rgba(200,214,229,0.2)]"
              style={{ color: 'rgba(200,214,229,0.7)' }}
            />
          </div>

          {/* Filter pos */}
          <select
            value={filterPos}
            onChange={e => setFilterPos(e.target.value)}
            className="px-2 py-1 rounded-sm text-[9px] tracking-wide outline-none cursor-pointer"
            style={{ background: 'rgba(5,8,10,0.8)', border: '1px solid rgba(0,255,136,0.15)',
                     color: 'rgba(200,214,229,0.6)' }}
          >
            <option value="all">Semua Pos</option>
            {(posList || []).map(p => (
              <option key={p.pos_id} value={p.pos_id}>{p.pos_id}</option>
            ))}
          </select>

          {/* Filter kategori */}
          <select
            value={filterKategori}
            onChange={e => setFilterKategori(e.target.value)}
            className="px-2 py-1 rounded-sm text-[9px] tracking-wide outline-none cursor-pointer"
            style={{ background: 'rgba(5,8,10,0.8)', border: '1px solid rgba(0,255,136,0.15)',
                     color: 'rgba(200,214,229,0.6)' }}
          >
            <option value="all">Semua Kategori</option>
            {Object.keys(KATEGORI_COLOR).map(k => (
              <option key={k} value={k}>{k}</option>
            ))}
          </select>
        </div>

        {/* Kartu tokoh */}
        {loading ? (
          <div className="grid grid-cols-2 gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-24 rounded-sm bg-[rgba(0,255,136,0.04)] animate-pulse" />
            ))}
          </div>
        ) : tokoh.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-[10px] text-[rgba(200,214,229,0.3)] tracking-widest uppercase">
              Tidak ada tokoh ditemukan
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {tokoh.map((t, i) => {
              const color = KATEGORI_COLOR[t._kategori] || '#8899aa'
              return (
                <div key={t.id || `${t.pos_id}-${t.nama}-${i}`} className="rounded-sm overflow-hidden transition-all"
                  style={{ background: 'rgba(5,8,10,0.8)', border: `1px solid ${color}22` }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = `${color}44`}
                  onMouseLeave={e => e.currentTarget.style.borderColor = `${color}22`}
                >
                  <div className="flex items-start gap-3 p-3">
                    {/* Avatar */}
                    <div className="w-9 h-9 rounded-sm flex-shrink-0 flex items-center justify-center"
                      style={{ background: `${color}15`, border: `1px solid ${color}33` }}>
                      <svg className="w-4 h-4" fill="none" stroke={color} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    {/* Info */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-1 flex-wrap">
                        <p className="text-[11px] font-bold leading-tight"
                          style={{ color: 'rgba(200,214,229,0.85)' }}>{t.nama}</p>
                        <span className="text-[8px] px-1.5 py-0.5 rounded-sm font-bold flex-shrink-0"
                          style={{ color, background: `${color}15`, border: `1px solid ${color}33` }}>
                          {t._kategori}
                        </span>
                      </div>
                      <p className="text-[9px] mt-0.5" style={{ color: 'rgba(200,214,229,0.45)' }}>
                        {t.jabatan}
                      </p>
                      <div className="flex items-center gap-1.5 mt-1">
                        <span className="font-mono text-[8px] px-1 py-0.5 rounded-sm"
                          style={{ color: 'rgba(0,255,136,0.55)', background: 'rgba(0,255,136,0.06)',
                                   border: '1px solid rgba(0,255,136,0.15)' }}>
                          {posNameMap[t.pos_id]
                            ? posNameMap[t.pos_id].replace(/^Pos /i, 'POS ').toUpperCase()
                            : t.pos_id}
                        </span>
                        {t.catatan && (
                          <p className="text-[8px] truncate" style={{ color: 'rgba(200,214,229,0.3)' }}>
                            {t.catatan}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Info placeholder */}
        <div className="px-3 py-2 rounded-sm flex items-center gap-2"
          style={{ background: 'rgba(68,136,255,0.06)', border: '1px solid rgba(68,136,255,0.15)' }}>
          <svg className="w-3 h-3 flex-shrink-0" fill="none" stroke="#4488ff" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-[9px]" style={{ color: 'rgba(68,136,255,0.7)' }}>
            Data tokoh ditampilkan dari Google Sheets tab <span className="font-mono font-bold">tokoh</span>.
            Input data tokoh melalui halaman detail masing-masing pos.
          </p>
        </div>
      </div>
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
