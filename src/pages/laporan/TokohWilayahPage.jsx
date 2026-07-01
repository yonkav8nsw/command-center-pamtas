import { useState } from 'react'
import { usePos, useAllTokoh } from '../../hooks/useSupabase'
import { LoadingSpinner, EmptyState, Modal } from '../../components/ui'
import { TokohForm } from '../../components/forms/TokohForm'
import { tokohService } from '../../services/tokoh.service'

/* ── Animation stagger helper ───────────────────────────── */
const getStaggerDelay = (index) => Math.min(index * 50, 300)

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
  'Adat':        'var(--color-warning)',
  'Masyarakat':  'var(--color-info)',
  'Agama':       'var(--color-purple)',
  'Pemuda':      'var(--accent-primary)',
  'Lainnya':     'var(--text-tertiary)',
}

export default function TokohWilayahPage() {
  const { data: posList, loading: posLoading } = usePos()
  const { data: tokohData, loading: tokohLoading, refetch: refetchTokoh } = useAllTokoh()
  const [filterPos,      setFilterPos]      = useState('all')
  const [filterKategori, setFilterKategori] = useState('all')
  const [search,         setSearch]         = useState('')
  const [selectedTokoh,  setSelectedTokoh]  = useState(null)
  const [editingTokoh,   setEditingTokoh]   = useState(null)

  const loading = posLoading || tokohLoading
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

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center" style={{ background: 'var(--surface-base)' }}>
        <LoadingSpinner text="Memuat data tokoh wilayah..." />
      </div>
    )
  }

  return (
    <div className="h-full overflow-y-auto p-4 animate-fade-in" style={{ background: 'var(--surface-base)' }}>
      {/* Header */}
      <div className="mb-4">
        <h2 className="font-bold text-sm tracking-widest uppercase" style={{ color: 'var(--color-purple)' }}>
          ◈ TOKOH WILAYAH
        </h2>
        <p className="text-[10px] tracking-wider mt-1 uppercase" style={{ color: 'var(--text-tertiary)' }}>
          Data tokoh masyarakat, adat, dan agama wilayah tugas
        </p>
      </div>

      <div className="space-y-4">

        {/* Summary */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <StatCard
            label="Total Tokoh"
            value={allTokoh.length}
            color="var(--color-purple)"
            icon="◉"
            delay={getStaggerDelay(0)}
          />
          {Object.entries(byKategori).map(([kat, count], i) => (
            <StatCard
              key={kat}
              label={kat}
              value={count}
              color={KATEGORI_COLOR[kat] || 'var(--text-tertiary)'}
              icon="◆"
              delay={getStaggerDelay(i + 1)}
            />
          ))}
        </div>

        {/* Filter bar */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 px-3 py-2 rounded-sm flex-1 min-w-[150px] sm:min-w-[200px]"
            style={{ background: 'var(--surface-primary)', border: '1px solid var(--border-subtle)' }}>
            <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="var(--text-tertiary)" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Cari nama / jabatan..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="flex-1 bg-transparent outline-none text-[10px] tracking-wide"
              style={{ color: 'var(--text-secondary)' }}
            />
          </div>

          <select
            value={filterPos}
            onChange={e => setFilterPos(e.target.value)}
            className="hud-select text-[10px] min-w-[100px]"
          >
            <option value="all">Semua Pos</option>
            {(posList || []).map(p => (
              <option key={p.pos_id} value={p.pos_id}>{p.nama_pos || p.pos_id}</option>
            ))}
          </select>

          <select
            value={filterKategori}
            onChange={e => setFilterKategori(e.target.value)}
            className="hud-select text-[10px] min-w-[120px]"
          >
            <option value="all">Semua Kategori</option>
            {Object.keys(KATEGORI_COLOR).map(k => (
              <option key={k} value={k}>{k}</option>
            ))}
          </select>
        </div>

        {/* Kartu tokoh */}
        {tokoh.length === 0 ? (
          <EmptyState
            icon="◉"
            title="Tidak ada tokoh ditemukan"
            description="Tidak ada tokoh yang sesuai dengan filter."
          />
        ) : (
          <div>
            {/* ARIA live region for filter results */}
            <p className="sr-only" aria-live="polite" role="status">
              Menampilkan {tokoh.length} tokoh dari {allTokoh.length} total
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {tokoh.map((t, i) => {
              const color = KATEGORI_COLOR[t._kategori] || 'var(--text-tertiary)'
              return (
                <TokohCard
                  key={t.id || `${t.pos_id}-${t.nama}-${i}`}
                  tokoh={t}
                  color={color}
                  posName={posNameMap[t.pos_id] || t.pos_id}
                  delay={getStaggerDelay(i + 5)}
                  onClick={() => setSelectedTokoh(t)}
                />
              )
            })}
            </div>
          </div>
        )}

        {/* Info placeholder */}
        <div className="px-3 py-2 rounded-sm flex items-center gap-2"
          style={{ background: 'var(--color-info-subtle)', border: '1px solid var(--color-info-subtle)' }}>
          <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="var(--color-info)" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-[9px]" style={{ color: 'var(--color-info)' }}>
            Klik kartu tokoh untuk melihat biografi lengkap.
            Input data tokoh melalui halaman detail masing-masing pos.
          </p>
        </div>
      </div>

      {/* Modal biografi */}
      {selectedTokoh && (
        <TokohBiografiModal
          tokoh={selectedTokoh}
          posName={posNameMap[selectedTokoh.pos_id] || selectedTokoh.pos_id}
          onClose={() => setSelectedTokoh(null)}
          onEdit={() => {
            setEditingTokoh(selectedTokoh)
            setSelectedTokoh(null)
          }}
        />
      )}

      {/* Modal Edit Tokoh */}
      <Modal
        isOpen={!!editingTokoh}
        onClose={() => setEditingTokoh(null)}
        title={editingTokoh ? 'Edit Tokoh' : 'Tambah Tokoh'}
        size="md"
      >
        {editingTokoh && (
          <TokohForm
            initialData={editingTokoh}
            posId={editingTokoh.pos_id}
            posNama={posNameMap[editingTokoh.pos_id] || editingTokoh.pos_id}
            onSave={async (formData) => {
              await tokohService.update(editingTokoh.id, formData)
              await refetchTokoh()
              setEditingTokoh(null)
            }}
            onCancel={() => setEditingTokoh(null)}
          />
        )}
      </Modal>
    </div>
  )
}

/* ── Tokoh Card Component ─────────────────────────────────── */
function TokohCard({ tokoh, color, posName, delay, onClick }) {
  return (
    <div
      className="rounded-sm overflow-hidden transition-all cursor-pointer animate-scale-in"
      style={{
        background: 'var(--surface-primary)',
        border: '1px solid var(--border-subtle)',
        animationDelay: `${delay}ms`
      }}
      onClick={onClick}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = color
        e.currentTarget.style.background = 'var(--surface-secondary)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = 'var(--border-subtle)'
        e.currentTarget.style.background = 'var(--surface-primary)'
      }}
    >
      <div className="flex items-start gap-3 p-3">
        {/* Avatar / foto */}
        <div className="w-10 h-10 rounded-sm flex-shrink-0 flex items-center justify-center overflow-hidden"
          style={{ background: 'var(--surface-secondary)', border: '1px solid var(--border-subtle)' }}>
          {tokoh.foto_url ? (
            <img src={tokoh.foto_url} alt={tokoh.nama}
              className="w-full h-full object-cover"
              onError={e => { e.target.style.display = 'none' }}
            />
          ) : (
            <svg className="w-5 h-5" fill="none" stroke={color} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          )}
        </div>
        {/* Info */}
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-1 flex-wrap">
            <p className="text-[11px] font-bold leading-tight"
              style={{ color: 'var(--text-primary)' }}>{tokoh.nama}</p>
            <span className="text-[8px] px-1.5 py-0.5 rounded-sm font-bold flex-shrink-0"
              style={{ color, background: 'var(--surface-secondary)', border: '1px solid var(--border-subtle)' }}>
              {tokoh._kategori}
            </span>
          </div>
          <p className="text-[9px] mt-0.5" style={{ color: 'var(--text-tertiary)' }}>
            {tokoh.jabatan}
          </p>
          <div className="flex items-center gap-1.5 mt-1.5">
            <span className="font-mono text-[8px] px-1.5 py-0.5 rounded-sm"
              style={{ color: 'var(--accent-primary)', background: 'var(--accent-muted)', border: '1px solid var(--accent-muted)' }}>
              {posName.replace(/^Pos /i, 'POS ').toUpperCase()}
            </span>
            <span className="text-[8px]" style={{ color: 'var(--text-disabled)' }}>
              → lihat profil
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ── Modal Biografi Tokoh ──────────────────────────────────── */
function TokohBiografiModal({ tokoh, posName, onClose }) {
  const kat   = normalizeKategori(tokoh.kategori)
  const color = KATEGORI_COLOR[kat] || 'var(--text-tertiary)'

  const rows = [
    { label: 'Nama Lengkap', value: tokoh.nama },
    { label: 'Kategori',     value: kat },
    { label: 'Jabatan',      value: tokoh.jabatan },
    { label: 'Alamat',       value: tokoh.alamat },
    { label: 'No. Telp',     value: tokoh.no_telp },
    { label: 'Pos Binaan',   value: posName },
    { label: 'Catatan',      value: tokoh.catatan },
  ].filter(r => r.value && r.value !== '—' && r.value !== '-')

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'var(--overlay-scrim)', backdropFilter: 'blur(4px)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="tokoh-modal-title"
    >
      <div
        className="w-full max-w-md rounded-sm overflow-hidden animate-scale-in"
        style={{
          background: 'var(--surface-primary)',
          border: '1px solid var(--border-subtle)',
          maxHeight: '90vh',
          overflowY: 'auto',
        }}
      >
        {/* Header modal */}
        <div className="flex items-center justify-between px-4 py-3 flex-shrink-0"
          style={{ background: 'var(--surface-secondary)', borderBottom: '1px solid var(--border-subtle)' }}>
          <div className="flex items-center gap-2">
            <span className="text-[9px] font-bold px-2 py-0.5 rounded-sm"
              style={{ color, background: 'var(--surface-tertiary)', border: '1px solid var(--border-subtle)' }}>
              {kat}
            </span>
            <span className="font-mono text-[9px]" style={{ color: 'var(--text-tertiary)' }}>{posName}</span>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={onEdit}
              className="text-xs px-2 py-1 rounded-sm transition-all"
              style={{ color: 'var(--accent-primary)', background: 'var(--accent-muted)', border: '1px solid var(--accent-primary)' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'var(--accent-primary)'; e.currentTarget.style.color = '#000' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'var(--accent-muted)'; e.currentTarget.style.color = 'var(--accent-primary)' }}
              aria-label="Edit tokoh"
            >
              Edit
            </button>
            <button
              onClick={onClose}
              className="text-lg leading-none transition-all p-1 rounded-sm"
              style={{ color: 'var(--text-tertiary)' }}
              onMouseEnter={e => e.currentTarget.style.color = 'var(--text-primary)'}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--text-tertiary)'}
              aria-label="Tutup modal"
            >×</button>
          </div>
        </div>

        {/* Body */}
        <div className="p-4 space-y-4">
          {/* Foto + nama */}
          <div className="flex items-start gap-4">
            <div
              className="w-20 h-20 rounded-sm flex-shrink-0 flex items-center justify-center overflow-hidden"
              style={{ background: 'var(--surface-secondary)', border: '1px solid var(--border-subtle)' }}
            >
              {tokoh.foto_url ? (
                <img
                  src={tokoh.foto_url}
                  alt={tokoh.nama}
                  className="w-full h-full object-cover"
                  onError={e => { e.target.style.display = 'none' }}
                />
              ) : (
                <svg className="w-10 h-10" fill="none" stroke={color} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h3 id="tokoh-modal-title" className="text-base font-bold leading-tight mb-1"
                style={{ color: 'var(--text-primary)' }}>
                {tokoh.nama}
              </h3>
              <p className="text-[11px]" style={{ color: 'var(--text-secondary)' }}>
                {tokoh.jabatan}
              </p>
              {tokoh.alamat && (
                <p className="text-[9px] mt-1" style={{ color: 'var(--text-tertiary)' }}>
                  📍 {tokoh.alamat}
                </p>
              )}
            </div>
          </div>

          {/* Data biodata */}
          <div className="rounded-sm overflow-hidden"
            style={{ border: '1px solid var(--border-subtle)' }}>
            <div className="px-3 py-1.5"
              style={{ background: 'var(--surface-secondary)', borderBottom: '1px solid var(--border-subtle)' }}>
              <span className="text-[8px] font-bold tracking-[0.2em] uppercase"
                style={{ color: 'var(--accent-primary)' }}>BIODATA</span>
            </div>
            <div className="divide-y" style={{ borderColor: 'var(--border-subtle)' }}>
              {rows.map(row => (
                <div key={row.label} className="flex items-start gap-3 px-3 py-2">
                  <span className="text-[9px] uppercase tracking-wider flex-shrink-0 w-24"
                    style={{ color: 'var(--text-tertiary)' }}>{row.label}</span>
                  <span className="text-[11px] flex-1" style={{ color: 'var(--text-secondary)' }}>
                    {row.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ── StatCard Component ────────────────────────────────────── */
function StatCard({ label, value, color, icon, delay = 0 }) {
  return (
    <div
      className="px-3 py-2.5 rounded-sm animate-scale-in"
      style={{
        background: 'var(--surface-primary)',
        border: '1px solid var(--border-subtle)',
        animationDelay: `${delay}ms`
      }}
    >
      <div className="flex items-center gap-1.5 mb-1">
        <span className="text-[10px]" style={{ color }}>{icon}</span>
        <span className="text-[8px] uppercase tracking-widest" style={{ color: 'var(--text-tertiary)' }}>
          {label}
        </span>
      </div>
      <div className="font-mono font-bold text-xl leading-none"
        style={{ color, textShadow: `0 0 14px ${color}55` }}>
        {value}
      </div>
    </div>
  )
}
