import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAllKerawanan, usePos } from '../hooks/useGasApi'
import { KERAWANAN_CATEGORIES } from '../constants/kerawananCategories'
import { KerawananBadge } from '../components/ui/Badge'
import { LoadingSpinner } from '../components/ui/LoadingSpinner'
import { EmptyState } from '../components/ui/EmptyState'
import { formatDate } from '../utils/formatDate'

export default function KerawananPage() {
  const navigate = useNavigate()
  const { data: kerawanan, loading } = useAllKerawanan()
  const { data: posList } = usePos()

  const [filterStatus,   setFilterStatus]   = useState('all')
  const [filterKategori, setFilterKategori] = useState('all')
  const [filterPos,      setFilterPos]      = useState('all')
  const [search,         setSearch]         = useState('')

  const filtered = (kerawanan || []).filter(k => {
    if (filterStatus !== 'all' && k.status !== filterStatus) return false
    if (filterKategori !== 'all' && k.kategori !== filterKategori) return false
    if (filterPos !== 'all' && k.pos_id !== filterPos) return false
    if (search && !k.deskripsi?.toLowerCase().includes(search.toLowerCase()) &&
        !k.pos_id?.toLowerCase().includes(search.toLowerCase())) return false
    return true
  }).sort((a, b) => {
    if (a.status === 'aktif' && b.status !== 'aktif') return -1
    if (a.status !== 'aktif' && b.status === 'aktif') return 1
    return new Date(b.tanggal) - new Date(a.tanggal)
  })

  const aktifCount = (kerawanan || []).filter(k => k.status === 'aktif').length

  return (
    <div className="flex flex-col h-full fade-in">

      {/* ── Header ─────────────────────────────────────────── */}
      <div className="flex-shrink-0 px-4 py-3"
        style={{ background: 'rgba(4,11,6,0.9)', borderBottom: '1px solid rgba(0,255,136,0.15)' }}>
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-[rgba(200,214,229,0.85)] font-bold text-sm uppercase tracking-widest">
              ⚠ Intel Kerawanan
            </h2>
            <p className="text-[rgba(200,214,229,0.3)] text-[10px] mt-0.5">
              Aggregasi seluruh laporan insiden — semua pos
            </p>
          </div>
          <div className="flex items-center gap-3">
            <StatChip label="Total" value={(kerawanan || []).length} color="#00ff88" />
            <StatChip label="Aktif" value={aktifCount} color={aktifCount > 0 ? '#ff3333' : '#00ff88'} pulse={aktifCount > 0} />
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2">
          <input
            className="hud-input text-[10px] w-40"
            placeholder="Cari deskripsi / pos..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <select className="hud-select text-[10px] w-32" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
            <option value="all">Semua Status</option>
            <option value="aktif">Aktif</option>
            <option value="selesai">Selesai</option>
          </select>
          <select className="hud-select text-[10px] w-36" value={filterKategori} onChange={e => setFilterKategori(e.target.value)}>
            <option value="all">Semua Kategori</option>
            {KERAWANAN_CATEGORIES.map(c => (
              <option key={c.id} value={c.id}>{c.label}</option>
            ))}
          </select>
          <select className="hud-select text-[10px] w-36" value={filterPos} onChange={e => setFilterPos(e.target.value)}>
            <option value="all">Semua Pos</option>
            {(posList || []).map(p => (
              <option key={p.pos_id} value={p.pos_id}>{p.nama_pos}</option>
            ))}
          </select>
          {(filterStatus !== 'all' || filterKategori !== 'all' || filterPos !== 'all' || search) && (
            <button
              className="hud-btn text-[9px] px-2"
              onClick={() => { setFilterStatus('all'); setFilterKategori('all'); setFilterPos('all'); setSearch('') }}
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* ── List ───────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto p-4">
        {loading ? (
          <LoadingSpinner text="Memuat data kerawanan..." />
        ) : filtered.length === 0 ? (
          <EmptyState icon="◉" title="Tidak ada data" description="Tidak ada kerawanan yang sesuai filter." />
        ) : (
          <div className="space-y-2">
            <p className="hud-label mb-2">{filtered.length} laporan ditampilkan</p>
            {filtered.map((item, i) => {
              const cat = KERAWANAN_CATEGORIES.find(c => c.id === item.kategori)
              const color = cat?.color || '#888'
              const isAktif = item.status === 'aktif'
              return (
                <div
                  key={item.id || i}
                  className="hud-panel px-3 py-2.5 flex items-start gap-3 cursor-pointer hover:border-[rgba(0,255,136,0.3)] transition-colors"
                  style={{ borderLeftColor: isAktif ? '#ff3333' : 'rgba(0,255,136,0.2)', borderLeftWidth: '2px' }}
                  onClick={() => navigate(`/pos/${item.pos_id}/kerawanan`)}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center flex-wrap gap-2 mb-1">
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-sm border tracking-wider uppercase ${
                        isAktif
                          ? 'text-[#ff3333] border-[rgba(255,51,51,0.3)] bg-[rgba(255,51,51,0.08)]'
                          : 'text-[rgba(0,255,136,0.5)] border-[rgba(0,255,136,0.2)] bg-[rgba(0,255,136,0.05)]'
                      }`}>
                        {isAktif && <span className="inline-block w-1 h-1 rounded-full bg-[#ff3333] animate-pulse mr-1" />}
                        {item.status}
                      </span>
                      <KerawananBadge kategori={item.kategori} />
                      <span className="text-[rgba(0,255,136,0.6)] text-[10px] font-mono font-bold">{item.pos_id}</span>
                      <span className="text-[rgba(200,214,229,0.3)] text-[10px] font-mono">{formatDate(item.tanggal)}</span>
                    </div>
                    <p className="text-[rgba(200,214,229,0.6)] text-xs truncate">{item.deskripsi}</p>
                    {item.tindak_lanjut && (
                      <p className="text-[rgba(200,214,229,0.3)] text-[10px] mt-0.5 truncate">
                        TL: {item.tindak_lanjut}
                      </p>
                    )}
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
