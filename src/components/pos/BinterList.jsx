import { useState } from 'react'
import { LoadingSpinner } from '../ui/LoadingSpinner'
import { EmptyState } from '../ui/EmptyState'
import { Modal } from '../ui/Modal'
import { BinterForm } from '../forms/BinterForm'
import { formatDate } from '../../utils/formatDate'
import { useToast } from '../ui/Toast'
import { useConfirm } from '../ui/ConfirmDialog'
import { binterService } from '../../services/binter.service'
import { clearCache } from '../../hooks/useSupabase'
import { BINTER_COLOR_MAP } from '../../constants/kerawananCategories'

function getColor(jenis) {
  if (!jenis) return '#c8d6e5'
  for (const [key, val] of Object.entries(BINTER_COLOR_MAP)) {
    if (jenis.toLowerCase().includes(key.toLowerCase())) return val
  }
  return '#c8d6e5'
}

export function BinterList({ binterList, loading, posId, onRefresh }) {
  const { showToast } = useToast()
  const { confirm } = useConfirm()
  const [showForm, setShowForm] = useState(false)
  const [deleting, setDeleting] = useState(null)

  const handleSave = async (data) => {
    try {
      await binterService.add({ ...data, pos_id: posId })
      clearCache()
      onRefresh && onRefresh()
      setShowForm(false)
      showToast('Kegiatan Binter berhasil disimpan', 'success')
    } catch (err) {
      showToast('Gagal menyimpan: ' + err.message, 'error')
    }
  }

  const handleDelete = async (item) => {
    const ok = await confirm(`Hapus kegiatan "${item.jenis_kegiatan}"? Tindakan ini tidak dapat dibatalkan.`, {
      title: 'Hapus Kegiatan',
      type: 'danger',
    })
    if (!ok) return
    setDeleting(item.id)
    try {
      await binterService.remove(item.id)
      clearCache()
      onRefresh && onRefresh()
      showToast('Kegiatan berhasil dihapus', 'success')
    } catch (err) {
      showToast('Gagal menghapus: ' + err.message, 'error')
    } finally {
      setDeleting(null)
    }
  }

  if (loading) return <LoadingSpinner text="Memuat data binter..." />

  const sorted = [...(binterList || [])].sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal))

  return (
    <div className="space-y-3 fade-in">
      <div className="flex justify-between items-center">
        <span className="hud-label">{sorted.length} kegiatan tercatat</span>
        <button className="hud-btn" onClick={() => setShowForm(true)}>
          + Tambah Kegiatan
        </button>
      </div>

      {sorted.length === 0 ? (
        <EmptyState
          icon="◈"
          title="Belum ada kegiatan Binter"
          description="Tambahkan kegiatan Pembinaan Teritorial untuk pos ini."
          action={
            <button className="hud-btn" onClick={() => setShowForm(true)}>
              + Tambah Kegiatan
            </button>
          }
        />
      ) : (
        <div className="space-y-2">
          {sorted.map((item, i) => (
            <BinterCard
              key={item.id || i}
              item={item}
              color={getColor(item.jenis_kegiatan)}
              onDelete={() => handleDelete(item)}
              deleting={deleting === item.id}
            />
          ))}
        </div>
      )}

      <Modal
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        title="Tambah Kegiatan Binter"
      >
        <BinterForm
          posId={posId}
          onSave={handleSave}
          onCancel={() => setShowForm(false)}
        />
      </Modal>
    </div>
  )
}

function BinterCard({ item, color, onDelete, deleting }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div
      className="hud-panel transition-colors hover:border-[rgba(0,255,136,0.25)]"
      style={{ borderLeftColor: color, borderLeftWidth: '2px' }}
    >
      <div
        className="px-3 py-2.5 flex items-start justify-between gap-2 cursor-pointer"
        onClick={() => setExpanded(e => !e)}
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span
              className="text-[9px] font-bold tracking-[0.12em] uppercase px-1.5 py-0.5 rounded-sm border"
              style={{ color, background: `${color}10`, borderColor: `${color}30` }}
            >
              {item.jenis_kegiatan}
            </span>
            <span className="font-mono text-[10px] text-[rgba(200,214,229,0.4)]">
              {formatDate(item.tanggal)}
            </span>
          </div>
          <p className="text-[rgba(200,214,229,0.6)] text-xs truncate">
            {item.lokasi}
            {item.jumlah_peserta ? ` · ${item.jumlah_peserta} peserta` : ''}
          </p>
        </div>
        <div className="flex items-center gap-1 flex-shrink-0">
          <span className="text-[rgba(0,255,136,0.3)] text-xs">{expanded ? '▲' : '▼'}</span>
          <button
            onClick={(e) => { e.stopPropagation(); onDelete() }}
            disabled={deleting}
            className="p-1.5 rounded-sm text-[rgba(255,51,51,0.35)] hover:text-[#ff3333] hover:bg-[rgba(255,51,51,0.08)] transition-colors disabled:opacity-30"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>

      {expanded && (
        <div className="px-3 pb-3 border-t border-[rgba(0,255,136,0.08)] pt-2 space-y-1.5">
          {item.sasaran && (
            <InfoRow label="Sasaran" value={item.sasaran} />
          )}
          {item.keterangan && (
            <InfoRow label="Keterangan" value={item.keterangan} />
          )}
          {item.foto_url && (
            <div className="mt-2">
              <p className="hud-label mb-1">Dokumentasi</p>
              <a
                href={item.foto_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[10px] text-[rgba(68,136,255,0.7)] hover:text-[#4488ff] underline"
              >
                Lihat foto →
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function InfoRow({ label, value }) {
  return (
    <div className="flex gap-3">
      <span className="hud-label w-20 flex-shrink-0">{label}</span>
      <span className="text-[rgba(200,214,229,0.65)] text-xs flex-1">{value}</span>
    </div>
  )
}
