import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAllKerawanan, usePos } from '../hooks/useSupabase'
import { KERAWANAN_CATEGORIES } from '../constants/kerawananCategories'
import { KerawananBadge, LoadingSpinner, EmptyState } from '../components/ui'
import { formatDate } from '../utils/formatDate'
import { downloadKerawananPDF, downloadKerawananListPDF } from '../utils/generatePDF'

/* ── Timeline filter options ──────────────────────────────── */
const TIMELINE_OPTIONS = [
  { id: 'all',   label: 'Semua' },
  { id: 'today', label: 'Hari Ini' },
  { id: '7d',   label: '7 Hari' },
  { id: '30d',   label: '30 Hari' },
  { id: '90d',   label: '3 Bulan' },
  { id: '180d',  label: '6 Bulan' },
  { id: '365d',  label: '1 Tahun' },
]

function filterByTimeline(items, timelineId) {
  if (timelineId === 'all') return items
  const now = new Date()
  const cutoff = new Date()
  if (timelineId === 'today') {
    cutoff.setHours(0, 0, 0, 0)
  } else {
    cutoff.setDate(now.getDate() - parseInt(timelineId))
  }
  return items.filter(k => k.tanggal && new Date(k.tanggal) >= cutoff)
}

/* ── Animation stagger helper ───────────────────────────── */
const getStaggerDelay = (index) => Math.min(index * 50, 300)

export default function InsidenPage() {
  const navigate = useNavigate()
  const { data: kerawanan, loading } = useAllKerawanan()
  const { data: posList } = usePos()

  const [filterStatus,   setFilterStatus]   = useState('all')
  const [filterKategori, setFilterKategori] = useState('all')
  const [filterPos,      setFilterPos]      = useState('all')
  const [filterTimeline, setFilterTimeline] = useState('all')
  const [search,         setSearch]         = useState('')
  const [selectedItem,   setSelectedItem]   = useState(null)

  const posMap = useMemo(() => (posList || []).reduce((acc, p) => {
    acc[p.pos_id] = p.nama_pos || p.pos_id
    return acc
  }, {}), [posList])

  const filtered = useMemo(() => {
    let items = kerawanan || []
    items = filterByTimeline(items, filterTimeline)
    return items.filter(k => {
      if (filterStatus !== 'all' && k.status?.toLowerCase() !== filterStatus) return false
      if (filterKategori !== 'all' && k.kategori !== filterKategori) return false
      if (filterPos !== 'all' && k.pos_id !== filterPos) return false
      if (search &&
        !k.deskripsi?.toLowerCase().includes(search.toLowerCase()) &&
        !k.pos_id?.toLowerCase().includes(search.toLowerCase())) return false
      return true
    }).sort((a, b) => {
      const aAktif = a.status?.toLowerCase() === 'aktif'
      const bAktif = b.status?.toLowerCase() === 'aktif'
      if (aAktif && !bAktif) return -1
      if (!aAktif && bAktif) return 1
      return new Date(b.tanggal) - new Date(a.tanggal)
    })
  }, [kerawanan, filterStatus, filterKategori, filterPos, filterTimeline, search])

  const aktifCount = (kerawanan || []).filter(k => k.status?.toLowerCase() === 'aktif').length

  const handleClickItem = (item) => { setSelectedItem(item) }
  const handleNavigateToPos = (item) => {
    navigate(`/pos/${item.pos_id}/kerawanan`, { state: { highlightId: item.id } })
  }

  const hasFilter = filterStatus !== 'all' || filterKategori !== 'all' ||
                    filterPos !== 'all' || filterTimeline !== 'all' || search

  const timelineLabel = TIMELINE_OPTIONS.find(o => o.id === filterTimeline)?.label || 'Semua'
  const statusLabel   = filterStatus === 'all' ? 'Semua Status' : filterStatus.charAt(0).toUpperCase() + filterStatus.slice(1)
  const kategoriLabel = filterKategori === 'all' ? 'Semua Kategori' : filterKategori
  const posLabel     = filterPos === 'all' ? 'Semua Pos' : (posMap[filterPos] || filterPos)

  const selectedPosName = selectedItem
    ? (posMap[selectedItem.pos_id] || selectedItem.pos_id)
    : null

  // PDF filter string for download
  const filterSummary = [timelineLabel, statusLabel, kategoriLabel, posLabel].join(' · ')

  const handleDownloadPDF = () => {
    if (selectedItem) {
      downloadKerawananPDF(selectedItem, selectedPosName)
    } else {
      downloadKerawananListPDF(filtered, filterSummary, posMap)
    }
  }

  return (
    <div className="flex flex-col h-full animate-fade-in">

      {/* ── Header ──────────────────────────────────────── */}
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

        {/* Filters row */}
        <div className="flex flex-wrap items-center gap-2">
          <select
            className="hud-select text-[10px] w-40"
            value={filterTimeline}
            onChange={e => setFilterTimeline(e.target.value)}
          >
            {TIMELINE_OPTIONS.map(opt => (
              <option key={opt.id} value={opt.id}>{opt.label}</option>
            ))}
          </select>

          <select className="hud-select text-[10px] w-40" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
            <option value="all">Semua Status</option>
            <option value="aktif">Aktif</option>
            <option value="selesai">Selesai</option>
          </select>

          <select className="hud-select text-[10px] w-40" value={filterKategori} onChange={e => setFilterKategori(e.target.value)}>
            <option value="all">Semua Kategori</option>
            {KERAWANAN_CATEGORIES.map(c => (
              <option key={c.id} value={c.id}>{c.label}</option>
            ))}
          </select>

          <select className="hud-select text-[10px] w-40" value={filterPos} onChange={e => setFilterPos(e.target.value)}>
            <option value="all">Semua Pos</option>
            {(posList || []).map(p => (
              <option key={p.pos_id} value={p.pos_id}>{p.nama_pos}</option>
            ))}
          </select>

          <input
            className="hud-input text-[10px] w-40"
            placeholder="Cari deskripsi / pos..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />

          {hasFilter && (
            <button
              className="hud-btn text-[9px] px-2"
              onClick={() => {
                setFilterStatus('all'); setFilterKategori('all')
                setFilterPos('all'); setFilterTimeline('all'); setSearch('')
              }}
            >
              Reset
            </button>
          )}

          {/* Download PDF button */}
          <button
            className="hud-btn text-[9px] px-2 ml-auto flex items-center gap-1.5"
            onClick={handleDownloadPDF}
            title={selectedItem ? 'Unduh PDF insiden ini' : 'Unduh PDF daftar insiden'}
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            {selectedItem ? 'Unduh PDF' : 'Unduh Daftar'}
          </button>
        </div>
      </div>

      {/* ── Main content ─────────────────────────────────── */}
      <div className="flex flex-1 overflow-hidden">

        {/* List */}
        <div className={`overflow-y-auto p-4 transition-all ${selectedItem ? 'w-1/2' : 'w-full'}`}>
          {loading ? (
            <LoadingSpinner text="Memuat data insiden..." />
          ) : filtered.length === 0 ? (
            <EmptyState icon="◉" title="Tidak ada data" description="Tidak ada insiden yang sesuai filter." />
          ) : (
            <div className="space-y-2">
              <p className="hud-label mb-2">{filtered.length} insiden ditampilkan</p>
              {filtered.map((item, i) => {
                const cat = KERAWANAN_CATEGORIES.find(c => c.id === item.kategori)
                const color = cat?.color || 'var(--text-tertiary)'
                const isAktif = item.status?.toLowerCase() === 'aktif'
                const isSelected = selectedItem?.id === item.id
                return (
                  <div
                    key={item.id || i}
                    className="hud-panel px-3 py-2.5 flex items-start gap-3 cursor-pointer transition-all animate-fade-in"
                    style={{
                      borderLeftColor: isAktif ? 'var(--color-danger)' : 'var(--accent-primary)',
                      borderLeftWidth: '2px',
                      background: isSelected ? 'var(--accent-muted)' : 'var(--surface-primary)',
                      borderColor: isSelected ? 'var(--accent-primary)' : 'var(--border-subtle)',
                      animationDelay: `${getStaggerDelay(i)}ms`,
                    }}
                    onClick={() => handleClickItem(item)}
                    onMouseEnter={e => {
                      if (!isSelected) {
                        e.currentTarget.style.background = 'var(--surface-secondary)'
                        e.currentTarget.style.borderColor = 'var(--border-default)'
                      }
                    }}
                    onMouseLeave={e => {
                      if (!isSelected) {
                        e.currentTarget.style.background = 'var(--surface-primary)'
                        e.currentTarget.style.borderColor = 'var(--border-subtle)'
                      }
                    }}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center flex-wrap gap-2 mb-1">
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-sm border tracking-wider uppercase ${
                          isAktif
                            ? 'text-[var(--color-danger)] border-[var(--color-danger-subtle)] bg-[var(--color-danger-subtle)]'
                            : 'text-[var(--accent-primary)] border-[var(--accent-muted)] bg-[rgba(0,255,136,0.05)]'
                        }`}
                        style={isAktif ? { color: 'var(--color-danger)', borderColor: 'var(--color-danger-subtle)', backgroundColor: 'var(--color-danger-subtle)' } : { color: 'var(--accent-primary)', borderColor: 'var(--accent-muted)', backgroundColor: 'rgba(0,255,136,0.05)' }}>
                          {isAktif && <span className="inline-block w-1 h-1 rounded-full animate-pulse mr-1" style={{ background: 'var(--color-danger)', boxShadow: '0 0 4px var(--color-danger)' }} />}
                          {item.status}
                        </span>
                        <KerawananBadge kategori={item.kategori} />
                        <span className="text-[10px] font-mono font-bold" style={{ color: 'var(--accent-primary)' }}>
                          {posMap[item.pos_id] || item.pos_id}
                        </span>
                        <span className="text-[10px] font-mono" style={{ color: 'var(--text-tertiary)' }}>
                          {formatDate(item.tanggal)}
                        </span>
                      </div>
                      <p className="text-xs truncate" style={{ color: 'var(--text-secondary)' }}>{item.deskripsi}</p>
                    </div>
                    <span className="text-[10px] flex-shrink-0 transition-all" style={{ color: 'var(--accent-primary)' }}>
                      {isSelected ? '◀' : '▶'}
                    </span>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Detail panel */}
        {selectedItem && (
          <div className="w-1/2 border-l overflow-y-auto animate-slide-in-right"
            style={{ borderColor: 'var(--border-subtle)', background: 'var(--surface-base)' }}>
            <InsidenDetail
              item={selectedItem}
              posName={selectedPosName}
              onClose={() => setSelectedItem(null)}
              onNavigate={() => handleNavigateToPos(selectedItem)}
            />
          </div>
        )}
      </div>
    </div>
  )
}

/* ── Detail Panel ──────────────────────────────────────────── */
function InsidenDetail({ item, posName, onClose, onNavigate }) {
  const cat = KERAWANAN_CATEGORIES.find(c => c.id === item.kategori)
  const color = cat?.color || 'var(--accent-primary)'
  const isAktif = item.status?.toLowerCase() === 'aktif'

  const rows = [
    { label: 'Jenis Insiden',   value: item.kategori },
    { label: 'Status',          value: item.status?.toUpperCase(), highlight: isAktif },
    { label: 'Tanggal',         value: formatDate(item.tanggal) },
    { label: 'Waktu',           value: item.waktu || '—' },
    { label: 'Pos',             value: posName },
    { label: 'Lokasi Insiden',  value: item.lokasi || item.pos_id },
    { label: 'Jumlah Pelaku',   value: item.jumlah_pelaku || item.pelaku || '—' },
    { label: 'Uraian Insiden',  value: item.deskripsi, fullRow: true },
    { label: 'Penanganan',       value: item.tindak_lanjut || '—', fullRow: true },
  ]

  return (
    <div className="flex flex-col h-full animate-fade-in">
      {/* Header */}
      <div className="flex-shrink-0 px-4 py-3 flex items-center justify-between"
        style={{ background: 'var(--accent-muted)', borderBottom: '1px solid var(--border-subtle)' }}>
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-sm border"
              style={{ color: 'var(--accent-primary)', borderColor: 'var(--accent-muted)', background: 'var(--surface-secondary)' }}>
              {item.kategori}
            </span>
            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-sm border"
              style={isAktif
                ? { color: 'var(--color-danger)', borderColor: 'var(--color-danger-subtle)', backgroundColor: 'var(--color-danger-subtle)' }
                : { color: 'var(--accent-primary)', borderColor: 'var(--accent-muted)', backgroundColor: 'rgba(0,255,136,0.05)' }}>
              {isAktif && <span className="inline-block w-1 h-1 rounded-full animate-pulse mr-1" style={{ background: 'var(--color-danger)', boxShadow: '0 0 4px var(--color-danger)' }} />}
              {item.status?.toUpperCase()}
            </span>
          </div>
          <p className="text-[11px] font-bold" style={{ color: 'var(--text-secondary)' }}>Detail Insiden</p>
        </div>
        <button
          onClick={onClose}
          className="text-[10px] leading-none transition-all p-1 hover:bg-[var(--hover-surface)]"
          style={{ color: 'var(--text-tertiary)' }}
          aria-label="Tutup panel"
        >×</button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        <div className="rounded-sm overflow-hidden"
          style={{ border: '1px solid var(--border-subtle)', background: 'var(--surface-primary)' }}>
          <div className="px-3 py-1.5"
            style={{ background: 'var(--surface-secondary)', borderBottom: '1px solid var(--border-subtle)' }}>
            <span className="text-[9px] font-bold tracking-[0.2em] uppercase" style={{ color: 'var(--accent-primary)' }}>
              INFORMASI INSIDEN
            </span>
          </div>
          <div className="divide-y" style={{ borderColor: 'var(--border-subtle)' }}>
            {rows.map(row => (
              <div key={row.label} className={`px-3 py-2 ${row.fullRow ? 'block' : 'flex items-start gap-3'}`}>
                <span className="text-[9px] uppercase tracking-wider flex-shrink-0 w-28"
                  style={{ color: 'var(--text-tertiary)' }}>{row.label}</span>
                <span className={`text-[11px] font-medium ${
                  row.highlight ? 'var(--color-danger)' : 'var(--text-secondary)'
                } ${row.fullRow ? 'block mt-1 leading-relaxed' : 'flex-1'}`}
                style={!row.highlight ? { color: 'var(--text-secondary)' } : { color: 'var(--color-danger)' }}>
                  {row.value || '—'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Koordinat */}
        {(item.lat && item.lng) && (
          <div className="px-3 py-2 rounded-sm"
            style={{ background: 'var(--surface-secondary)', border: '1px solid var(--border-subtle)' }}>
            <span className="hud-label block mb-1">Koordinat TKP</span>
            <span className="font-mono text-[11px]" style={{ color: 'var(--accent-primary)' }}>
              {item.lat}, {item.lng}
            </span>
          </div>
        )}

        {/* Navigate to pos */}
        <button
          onClick={onNavigate}
          className="w-full hud-btn text-[10px] flex items-center justify-center gap-2"
        >
          <span>Buka Tab Kerawanan Pos {posName}</span>
          <span>→</span>
        </button>
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
