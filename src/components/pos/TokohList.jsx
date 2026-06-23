import { useState } from 'react'
import { LoadingSpinner } from '../ui/LoadingSpinner'
import { EmptyState } from '../ui/EmptyState'
import { Modal } from '../ui/Modal'
import { TokohForm } from '../forms/TokohForm'
import { useToast } from '../ui/Toast'
import { useConfirm } from '../ui/ConfirmDialog'
import { tokohService } from '../../services/tokoh.service'
import { clearCache } from '../../hooks/useSupabase'

// Mapping kategori dari Google Sheets ke display label + warna
// Sheet bisa pakai: TOMAS/TODAT/TOGA atau Adat/Masyarakat/Agama
const KATEGORI_NORMALIZE = {
  // Nilai dari sheet (uppercase)
  'TOMAS':      'Masyarakat',
  'TODAT':      'Adat',
  'TOGA':       'Agama',
  // Nilai lama (sudah benar)
  'Adat':       'Adat',
  'Masyarakat': 'Masyarakat',
  'Agama':      'Agama',
  // Variasi case-insensitive fallback
  'tomas':      'Masyarakat',
  'todat':      'Adat',
  'toga':       'Agama',
  'adat':       'Adat',
  'masyarakat': 'Masyarakat',
  'agama':      'Agama',
}

function normalizeKategori(raw) {
  if (!raw) return 'Masyarakat'
  return KATEGORI_NORMALIZE[raw] || KATEGORI_NORMALIZE[raw.trim()] || 'Masyarakat'
}

const KATEGORI_COLOR = {
  Adat:       { color: '#ffaa00', bg: 'rgba(255,170,0,0.08)',   border: 'rgba(255,170,0,0.2)'   },
  Masyarakat: { color: '#4488ff', bg: 'rgba(68,136,255,0.08)',  border: 'rgba(68,136,255,0.2)'  },
  Agama:      { color: '#bb88ff', bg: 'rgba(187,136,255,0.08)', border: 'rgba(187,136,255,0.2)' },
}

export function TokohList({ tokohList, loading, posId, onRefresh }) {
  const { showToast } = useToast()
  const { confirm } = useConfirm()
  const [showForm, setShowForm] = useState(false)
  const [editData, setEditData] = useState(null)
  const [deleting, setDeleting] = useState(null)

  const handleSave = async (data) => {
    try {
      if (editData) {
        await tokohService.update(editData.id, data)
      } else {
        await tokohService.add({ ...data, pos_id: posId })
      }
      clearCache()
      onRefresh && onRefresh()
      setShowForm(false)
      setEditData(null)
      showToast(editData ? 'Data tokoh berhasil diperbarui' : 'Tokoh baru berhasil ditambahkan', 'success')
    } catch (err) {
      showToast('Gagal menyimpan: ' + err.message, 'error')
    }
  }

  const handleDelete = async (tokoh) => {
    const ok = await confirm(`Hapus tokoh "${tokoh.nama}"? Tindakan ini tidak dapat dibatalkan.`, {
      title: 'Hapus Tokoh',
      type: 'danger',
    })
    if (!ok) return
    setDeleting(tokoh.id)
    try {
      await tokohService.remove(tokoh.id)
      clearCache()
      onRefresh && onRefresh()
      showToast(`Tokoh "${tokoh.nama}" berhasil dihapus`, 'success')
    } catch (err) {
      showToast('Gagal menghapus: ' + err.message, 'error')
    } finally {
      setDeleting(null)
    }
  }

  if (loading) return <LoadingSpinner text="Memuat data tokoh..." />

  // Normalisasi kategori dari sheet (TOMAS/TODAT/TOGA) ke display (Masyarakat/Adat/Agama)
  const normalizedList = (tokohList || []).map(t => ({
    ...t,
    _kategoriDisplay: normalizeKategori(t.kategori),
  }))

  const grouped = {
    Adat:       normalizedList.filter(t => t._kategoriDisplay === 'Adat'),
    Masyarakat: normalizedList.filter(t => t._kategoriDisplay === 'Masyarakat'),
    Agama:      normalizedList.filter(t => t._kategoriDisplay === 'Agama'),
  }

  return (
    <div className="space-y-4 fade-in">
      <div className="flex justify-between items-center">
        <span className="hud-label">{normalizedList.length} tokoh terdaftar</span>
        <button
          className="hud-btn"
          onClick={() => { setEditData(null); setShowForm(true) }}
        >
          + Tambah Tokoh
        </button>
      </div>

      {normalizedList.length === 0 ? (
        <EmptyState
          icon="◈"
          title="Belum ada data tokoh"
          description="Tambahkan data Tokoh Adat, Masyarakat, dan Agama untuk pos ini."
          action={
            <button className="hud-btn" onClick={() => { setEditData(null); setShowForm(true) }}>
              + Tambah Tokoh
            </button>
          }
        />
      ) : (
        Object.entries(grouped).map(([kategori, list]) => {
          if (list.length === 0) return null
          const pal = KATEGORI_COLOR[kategori] || KATEGORI_COLOR.Adat
          return (
            <div key={kategori}>
              <div className="flex items-center gap-2 mb-2">
                <span
                  className="text-[9px] font-bold tracking-[0.15em] uppercase px-2 py-0.5 rounded-sm border"
                  style={{ color: pal.color, background: pal.bg, borderColor: pal.border }}
                >
                  {kategori}
                </span>
                <span className="hud-label">{list.length} tokoh</span>
              </div>
              <div className="space-y-1.5">
                {list.map(tokoh => (
                  <TokohCard
                    key={tokoh.id || tokoh.nama}
                    tokoh={tokoh}
                    kategori={tokoh._kategoriDisplay}
                    onEdit={() => { setEditData(tokoh); setShowForm(true) }}
                    onDelete={() => handleDelete(tokoh)}
                    deleting={deleting === tokoh.id}
                  />
                ))}
              </div>
            </div>
          )
        })
      )}

      <Modal
        isOpen={showForm}
        onClose={() => { setShowForm(false); setEditData(null) }}
        title={editData ? 'Edit Tokoh' : 'Tambah Tokoh'}
      >
        <TokohForm
          initialData={editData}
          posId={posId}
          onSave={handleSave}
          onCancel={() => { setShowForm(false); setEditData(null) }}
        />
      </Modal>
    </div>
  )
}

function TokohCard({ tokoh, kategori, onEdit, onDelete, deleting }) {
  const pal = KATEGORI_COLOR[kategori] || KATEGORI_COLOR.Adat
  return (
    <div
      className="hud-panel px-3 py-2.5 flex items-start justify-between gap-2 hover:border-[rgba(0,255,136,0.3)] transition-colors"
      style={{ borderLeftColor: pal.color, borderLeftWidth: '2px' }}
    >
      <div className="flex-1 min-w-0">
        <p className="text-[rgba(200,214,229,0.85)] font-semibold text-xs leading-tight">{tokoh.nama}</p>
        <p className="text-[10px] mt-0.5" style={{ color: `${pal.color}80` }}>{tokoh.jabatan}</p>
        <div className="flex items-center flex-wrap gap-3 mt-1.5 text-[10px] text-[rgba(200,214,229,0.4)]">
          {tokoh.alamat && <span>📍 {tokoh.alamat}</span>}
          {tokoh.no_hp && (
            <a href={`tel:${tokoh.no_hp}`} className="text-[rgba(0,255,136,0.6)] hover:text-[#00ff88] transition-colors">
              📞 {tokoh.no_hp}
            </a>
          )}
        </div>
        {tokoh.catatan && (
          <p className="text-[10px] mt-1 italic text-[rgba(200,214,229,0.3)]">{tokoh.catatan}</p>
        )}
      </div>
      <div className="flex gap-1 flex-shrink-0">
        <IconBtn onClick={onEdit} title="Edit" color="green">
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </IconBtn>
        <IconBtn onClick={onDelete} disabled={deleting} title="Hapus" color="red">
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </IconBtn>
      </div>
    </div>
  )
}

function IconBtn({ onClick, disabled, title, color, children }) {
  const c = color === 'red'
    ? 'text-[rgba(255,51,51,0.4)] hover:text-[#ff3333] hover:bg-[rgba(255,51,51,0.08)]'
    : 'text-[rgba(0,255,136,0.35)] hover:text-[#00ff88] hover:bg-[rgba(0,255,136,0.08)]'
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`p-1.5 rounded-sm transition-colors disabled:opacity-30 ${c}`}
    >
      {children}
    </button>
  )
}
