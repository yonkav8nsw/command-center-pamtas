import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAllKerawanan, usePos } from '../hooks/useSupabase'
import { KERAWANAN_CATEGORIES, getKategoriPoin } from '../constants/kerawananCategories'
import { KerawananBadge, LoadingSpinner, EmptyState } from '../components/ui'
import { formatDate } from '../utils/formatDate'

// Sort options
const SORT_OPTIONS = [
  { value: 'terbaru',   label: 'Terbaru Dulu' },
  { value: 'terlama',   label: 'Terlama Dulu' },
  { value: 'ancaman_tinggi', label: 'Ancaman Tertinggi' },
  { value: 'ancaman_rendah', label: 'Ancaman Terendah' },
]

/* ── Animation stagger helper ───────────────────────────── */
const getStaggerDelay = (index) => Math.min(index * 50, 300)

export default function KerawananPage() {
  const navigate = useNavigate()
  const { data: kerawanan, loading } = useAllKerawanan()
  const { data: posList } = usePos()

  const [filterStatus,   setFilterStatus]   = useState('all')
  const [filterKategori, setFilterKategori] = useState('all')
  const [filterPos,      setFilterPos]      = useState('all')
  const [search,         setSearch]         = useState('')
  const [sortBy,         setSortBy]         = useState('terbaru')

  // Pilihan rentang waktu (dropdown pengganti tab)
  const [rentang, setRentang] = useState('all')

  const RENTANG_OPTIONS = [
    { value: 'all',  label: 'Semua Waktu' },
    { value: '1',    label: 'Hari Ini' },
    { value: '7',    label: '7 Hari' },
    { value: '30',   label: '30 Hari' },
    { value: '90',   label: '3 Bulan' },
    { value: '180',  label: '6 Bulan' },
    { value: '365',  label: '1 Tahun' },
  ]

  const now = Date.now()

  const filtered = (kerawanan || []).filter(k => {
    if (filterStatus !== 'all' && k.status?.toLowerCase() !== filterStatus) return false
    if (filterKategori !== 'all' && k.kategori !== filterKategori) return false
    if (filterPos !== 'all' && k.pos_id !== filterPos) return false
    if (search && !k.deskripsi?.toLowerCase().includes(search.toLowerCase()) &&
        !k.pos_id?.toLowerCase().includes(search.toLowerCase())) return false
    if (rentang !== 'all') {
      const days = parseInt(rentang, 10)
      const cutoff = now - days * 24 * 60 * 60 * 1000
      const t = k.tanggal ? new Date(k.tanggal).getTime() : 0
      if (t < cutoff) return false
    }
    return true
  }).sort((a, b) => {
    if (sortBy === 'terbaru') return new Date(b.tanggal) - new Date(a.tanggal)
    if (sortBy === 'terlama') return new Date(a.tanggal) - new Date(b.tanggal)
    if (sortBy === 'ancaman_tinggi') return getKategoriPoin(b.kategori) - getKategoriPoin(a.kategori)
    if (sortBy === 'ancaman_rendah') return getKategoriPoin(a.kategori) - getKategoriPoin(b.kategori)
    return 0
  })

  const aktifCount = (kerawanan || []).filter(k => k.status?.toLowerCase() === 'aktif').length

  // Lookup pos_id → nama_pos
  const posMap = (posList || []).reduce((acc, p) => {
    acc[p.pos_id] = p.nama_pos || p.pos_id
    return acc
  }, {})

  const hasFilter = filterStatus !== 'all' || filterKategori !== 'all' || filterPos !== 'all' || search || rentang !== 'all'

  return (
    <div className="flex flex-col h-full animate-fade-in">

      {/* ── Header ─────────────────────────────────────────── */}
      <div className="flex-shrink-0 px-4 py-3"
        style={{ background: 'var(--surface-primary)', borderBottom: '1px solid var(--border-subtle)' }}>
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="font-bold text-sm uppercase tracking-widest" style={{ color: 'var(--color-danger)' }}>
              ⚠ Data Insiden
            </h2>
            <p className="text-[10px] mt-0.5" style={{ color: 'var(--text-tertiary)' }}>
              Agregasi seluruh laporan insiden — semua pos
            </p>
          </div>
          <div className="flex items-center gap-3">
            <StatChip label="Total" value={(kerawanan || []).length} color="var(--accent-primary)" />
            <StatChip label="Aktif" value={aktifCount} color={aktifCount > 0 ? 'var(--color-danger)' : 'var(--accent-primary)'} pulse={aktifCount > 0} />
          </div>
        </div>

        {/* Filters row 1: search + rentang + sort */}
        <div className="flex flex-wrap gap-2 mb-2">
          <input
            className="hud-input text-[10px] w-40"
            placeholder="Cari deskripsi / pos..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          {/* Dropdown rentang waktu — pengganti tab */}
          <select className="hud-select text-[10px] w-36" value={rentang} onChange={e => setRentang(e.target.value)}>
            {RENTANG_OPTIONS.map(o => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
          {/* Sort */}
          <select className="hud-select text-[10px] w-40" value={sortBy} onChange={e => setSortBy(e.target.value)}>
            {SORT_OPTIONS.map(o => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>

        {/* Filters row 2: status + kategori + pos */}
        <div className="flex flex-wrap gap-2">
          <select className="hud-select text-[10px] w-32" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
            <option value="all">Semua Status</option>
            <option value="aktif">Aktif</option>
            <option value="selesai">Selesai</option>
          </select>
          <select className="hud-select text-[10px] w-36" value={filterKategori} onChange={e => setFilterKategori(e.target.value)}>
            <option value="all">Semua Kategori</option>
            {KERAWANAN_CATEGORIES.map(c => (
              <option key={c.id} value={c.id}>{c.label} (poin {c.poin})</option>
            ))}
          </select>
          <select className="hud-select text-[10px] w-36" value={filterPos} onChange={e => setFilterPos(e.target.value)}>
            <option value="all">Semua Pos</option>
            {(posList || []).map(p => (
              <option key={p.pos_id} value={p.pos_id}>{p.nama_pos}</option>
            ))}
          </select>
          {hasFilter && (
            <button
              className="hud-btn text-[9px] px-2"
              onClick={() => { setFilterStatus('all'); setFilterKategori('all'); setFilterPos('all'); setSearch(''); setRentang('all') }}
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* ── List ───────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto p-4">
        {loading ? (
          <LoadingSpinner text="Memuat data insiden..." />
        ) : filtered.length === 0 ? (
          <EmptyState icon="◉" title="Tidak ada data" description="Tidak ada insiden yang sesuai filter." />
        ) : (
          <div className="space-y-2">
            <p className="hud-label mb-2">{filtered.length} laporan ditampilkan</p>
            {filtered.map((item, i) => {
              const cat = KERAWANAN_CATEGORIES.find(c => c.id === item.kategori)
              const color = cat?.color || 'var(--accent-primary)'
              const poin = cat?.poin || 0
              const isAktif = item.status?.toLowerCase() === 'aktif'
              return (
                <div
                  key={item.id || i}
                  className="hud-panel px-3 py-2.5 flex items-start gap-3 cursor-pointer transition-all animate-fade-in"
                  style={{
                    borderLeftColor: isAktif ? 'var(--color-danger)' : 'var(--accent-primary)',
                    borderLeftWidth: '2px',
                    animationDelay: `${getStaggerDelay(i)}ms`,
                  }}
                  onClick={() => navigate(`/pos/${item.pos_id}/kerawanan`)}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = 'var(--surface-secondary)'
                    e.currentTarget.style.borderColor = 'var(--border-default)'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = 'var(--surface-primary)'
                    e.currentTarget.style.borderColor = 'var(--border-subtle)'
                  }}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center flex-wrap gap-2 mb-1">
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-sm border tracking-wider uppercase"
                        style={isAktif
                          ? { color: 'var(--color-danger)', borderColor: 'var(--color-danger-subtle)', backgroundColor: 'var(--color-danger-subtle)' }
                          : { color: 'var(--accent-primary)', borderColor: 'var(--accent-muted)', backgroundColor: 'rgba(0,255,136,0.05)' }}>
                        {isAktif && <span className="inline-block w-1 h-1 rounded-full animate-pulse mr-1" style={{ background: 'var(--color-danger)', boxShadow: '0 0 4px var(--color-danger)' }} />}
                        {item.status}
                      </span>
                      <KerawananBadge kategori={item.kategori} />
                      {/* Threat score badge */}
                      {poin > 0 && (
                        <span className="text-[8px] font-mono font-bold px-1.5 py-0.5 rounded-sm border"
                          style={{
                            color: poin >= 5 ? 'var(--color-danger)' : poin >= 3 ? 'var(--color-warning)' : 'var(--text-tertiary)',
                            borderColor: poin >= 5 ? 'var(--color-danger-subtle)' : poin >= 3 ? 'var(--color-warning-subtle)' : 'var(--border-subtle)',
                            background: poin >= 5 ? 'var(--color-danger-subtle)' : poin >= 3 ? 'var(--color-warning-subtle)' : 'transparent'
                          }}>
                          ▲{poin}
                        </span>
                      )}
                      <span className="text-[10px] font-mono font-bold" style={{ color: 'var(--accent-primary)' }}>{posMap[item.pos_id] || item.pos_id}</span>
                      <span className="text-[10px] font-mono" style={{ color: 'var(--text-tertiary)' }}>{formatDate(item.tanggal)}</span>
                    </div>
                    <p className="text-xs truncate" style={{ color: 'var(--text-secondary)' }}>{item.deskripsi}</p>
                    {item.tindak_lanjut && (
                      <p className="text-[10px] mt-0.5 truncate" style={{ color: 'var(--text-tertiary)' }}>
                        TL: {item.tindak_lanjut}
                      </p>
                    )}
                  </div>
                  <span className="text-[10px] flex-shrink-0" style={{ color: 'var(--accent-primary)' }}>→</span>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

function StatChip({ label, value, color, pulse }) {
  return (
    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-sm"
      style={{ background: `${color}08`, border: `1px solid ${color}22` }}>
      {pulse && (
        <span className="w-1.5 h-1.5 rounded-full animate-pulse"
          style={{ background: color, boxShadow: `0 0 4px ${color}` }} />
      )}
      <span className="text-[9px] uppercase tracking-wider" style={{ color: `${color}60` }}>{label}</span>
      <span className="font-mono font-bold text-sm" style={{ color, textShadow: `0 0 10px ${color}60` }}>
        {value}
      </span>
    </div>
  )
}
