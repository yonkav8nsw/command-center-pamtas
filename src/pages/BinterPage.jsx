import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAllBinter, usePos } from '../hooks/useSupabase'
import { BINTER_TYPES, BINTER_COLOR_MAP } from '../constants/kerawananCategories'
import { LoadingSpinner } from '../components/ui/LoadingSpinner'
import { EmptyState } from '../components/ui/EmptyState'
import { formatDate } from '../utils/formatDate'

function getColor(jenis) {
  if (!jenis) return 'rgba(200,214,229,0.5)'
  for (const [key, val] of Object.entries(BINTER_COLOR_MAP)) {
    if (jenis.toLowerCase().includes(key.toLowerCase())) return val
  }
  return 'rgba(200,214,229,0.5)'
}

export default function BinterPage() {
  const navigate = useNavigate()
  const { data: binter,  loading } = useAllBinter()
  const { data: posList }          = usePos()

  const [filterJenis, setFilterJenis] = useState('all')
  const [filterPos,   setFilterPos]   = useState('all')
  const [search,      setSearch]      = useState('')

  const filtered = (binter || []).filter(b => {
    if (filterJenis !== 'all' && b.jenis_kegiatan !== filterJenis) return false
    if (filterPos !== 'all' && b.pos_id !== filterPos) return false
    if (search && !b.jenis_kegiatan?.toLowerCase().includes(search.toLowerCase()) &&
        !b.lokasi?.toLowerCase().includes(search.toLowerCase()) &&
        !b.pos_id?.toLowerCase().includes(search.toLowerCase())) return false
    return true
  }).sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal))

  // Statistik per jenis
  const statsJenis = Object.entries(
    (binter || []).reduce((acc, b) => {
      const k = b.jenis_kegiatan || 'Lainnya'
      acc[k] = (acc[k] || 0) + 1
      return acc
    }, {})
  ).sort((a, b) => b[1] - a[1]).slice(0, 5)

  return (
    <div className="flex flex-col h-full fade-in">

      {/* ── Header ─────────────────────────────────────────── */}
      <div className="flex-shrink-0 px-4 py-3"
        style={{ background: 'rgba(4,11,6,0.9)', borderBottom: '1px solid rgba(0,255,136,0.15)' }}>
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-[rgba(200,214,229,0.85)] font-bold text-sm uppercase tracking-widest">
              ◫ Program Binter
            </h2>
            <p className="text-[rgba(200,214,229,0.3)] text-[10px] mt-0.5">
              Pembinaan Teritorial — aggregasi semua pos
            </p>
          </div>
          <div className="flex items-center gap-2 flex-wrap justify-end">
            {statsJenis.slice(0, 3).map(([jenis, count]) => (
              <div key={jenis} className="flex items-center gap-1.5 px-2 py-1 rounded-sm"
                style={{
                  background: `${getColor(jenis)}08`,
                  border: `1px solid ${getColor(jenis)}22`,
                }}>
                <span className="text-[8px] uppercase tracking-wider"
                  style={{ color: `${getColor(jenis)}60` }}>{jenis.split(' ')[0]}</span>
                <span className="font-mono text-xs font-bold"
                  style={{ color: getColor(jenis) }}>{count}</span>
              </div>
            ))}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-sm"
              style={{ background: 'rgba(0,255,136,0.06)', border: '1px solid rgba(0,255,136,0.18)' }}>
              <span className="text-[9px] text-[rgba(0,255,136,0.5)] uppercase tracking-wider">Total</span>
              <span className="font-mono font-bold text-sm text-[#00ff88]"
                style={{ textShadow: '0 0 10px rgba(0,255,136,0.5)' }}>
                {(binter || []).length}
              </span>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2">
          <input
            className="hud-input text-[10px] w-44"
            placeholder="Cari kegiatan / lokasi / pos..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <select className="hud-select text-[10px] w-36" value={filterJenis} onChange={e => setFilterJenis(e.target.value)}>
            <option value="all">Semua Jenis</option>
            {(BINTER_TYPES || ['Penyuluhan', 'Baksos', 'Olahraga Bersama', 'Karya Bhakti', 'Kunjungan', 'Lainnya']).map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
          <select className="hud-select text-[10px] w-36" value={filterPos} onChange={e => setFilterPos(e.target.value)}>
            <option value="all">Semua Pos</option>
            {(posList || []).map(p => (
              <option key={p.pos_id} value={p.pos_id}>{p.nama_pos}</option>
            ))}
          </select>
          {(filterJenis !== 'all' || filterPos !== 'all' || search) && (
            <button
              className="hud-btn text-[9px] px-2"
              onClick={() => { setFilterJenis('all'); setFilterPos('all'); setSearch('') }}
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* ── List ───────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto p-4">
        {loading ? (
          <LoadingSpinner text="Memuat data binter..." />
        ) : filtered.length === 0 ? (
          <EmptyState icon="◫" title="Tidak ada kegiatan" description="Tidak ada kegiatan Binter yang sesuai filter." />
        ) : (
          <div className="space-y-2">
            <p className="hud-label mb-2">{filtered.length} kegiatan ditampilkan</p>
            {filtered.map((item, i) => {
              const color = getColor(item.jenis_kegiatan)
              return (
                <div
                  key={item.id || i}
                  className="hud-panel px-3 py-2.5 flex items-start gap-3 cursor-pointer hover:border-[rgba(0,255,136,0.3)] transition-colors"
                  style={{ borderLeftColor: color, borderLeftWidth: '2px' }}
                  onClick={() => navigate(`/pos/${item.pos_id}`)}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center flex-wrap gap-2 mb-0.5">
                      <span
                        className="text-[9px] font-bold px-1.5 py-0.5 rounded-sm border tracking-wider uppercase"
                        style={{ color, background: `${color}10`, borderColor: `${color}30` }}
                      >
                        {item.jenis_kegiatan}
                      </span>
                      <span className="text-[rgba(0,255,136,0.6)] text-[10px] font-mono font-bold">{item.pos_id}</span>
                      <span className="text-[rgba(200,214,229,0.3)] text-[10px] font-mono">{formatDate(item.tanggal)}</span>
                      {item.jumlah_peserta && (
                        <span className="text-[rgba(200,214,229,0.35)] text-[10px]">
                          {item.jumlah_peserta} peserta
                        </span>
                      )}
                    </div>
                    <p className="text-[rgba(200,214,229,0.55)] text-xs truncate">
                      {item.lokasi}{item.sasaran ? ` · ${item.sasaran}` : ''}
                    </p>
                  </div>
                  <span className="text-[rgba(0,255,136,0.3)] text-[10px] flex-shrink-0">→</span>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
