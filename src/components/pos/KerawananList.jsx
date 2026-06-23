import { useState } from 'react'
import { LoadingSpinner } from '../ui/LoadingSpinner'
import { EmptyState } from '../ui/EmptyState'
import { Modal } from '../ui/Modal'
import { KerawananForm } from '../forms/KerawananForm'
import { formatDate } from '../../utils/formatDate'
import { useToast } from '../ui/Toast'
import { useConfirm } from '../ui/ConfirmDialog'
import { kerawananService } from '../../services/kerawanan.service'
import { clearCache } from '../../hooks/useSupabase'
import { KERAWANAN_CATEGORIES } from '../../constants/kerawananCategories'

function getCatColor(kategori) {
  const cat = KERAWANAN_CATEGORIES.find(c => c.id === kategori)
  return cat?.color || '#888'
}

function getCatLabel(kategori) {
  const cat = KERAWANAN_CATEGORIES.find(c => c.id === kategori)
  return cat?.label || kategori
}

export function KerawananList({ kerawananList, loading, posId, onRefresh }) {
  const { showToast } = useToast()
  const { confirm } = useConfirm()
  const [showForm, setShowForm] = useState(false)
  const [deleting, setDeleting] = useState(null)
  const [updatingId, setUpdatingId] = useState(null)

  const handleSave = async (data) => {
    try {
      await kerawananService.add({ ...data, pos_id: posId })
      clearCache()
      onRefresh && onRefresh()
      setShowForm(false)
      showToast('Laporan kerawanan berhasil disimpan', 'success')
    } catch (err) {
      showToast('Gagal menyimpan: ' + err.message, 'error')
    }
  }

  const handleToggleStatus = async (item) => {
    const newStatus = item.status?.toLowerCase() === 'aktif' ? 'selesai' : 'aktif'
    setUpdatingId(item.id)
    try {
      await kerawananService.update(item.id, { status: newStatus })
      clearCache()
      onRefresh && onRefresh()
      showToast(`Status diubah ke "${newStatus}"`, 'success')
    } catch (err) {
      showToast('Gagal update: ' + err.message, 'error')
    } finally {
      setUpdatingId(null)
    }
  }

  const handleDelete = async (item) => {
    const ok = await confirm('Hapus laporan kerawanan ini? Tindakan ini tidak dapat dibatalkan.', {
      title: 'Hapus Laporan',
      type: 'danger',
    })
    if (!ok) return
    setDeleting(item.id)
    try {
      await kerawananService.remove(item.id)
      clearCache()
      onRefresh && onRefresh()
      showToast('Laporan berhasil dihapus', 'success')
    } catch (err) {
      showToast('Gagal menghapus: ' + err.message, 'error')
    } finally {
      setDeleting(null)
    }
  }

  if (loading) return <LoadingSpinner text="Memuat data kerawanan..." />

  const sorted = [...(kerawananList || [])].sort((a, b) => {
    if (a.status?.toLowerCase() === 'aktif' && b.status?.toLowerCase() !== 'aktif') return -1
    if (a.status?.toLowerCase() !== 'aktif' && b.status?.toLowerCase() === 'aktif') return 1
    return new Date(b.tanggal) - new Date(a.tanggal)
  })

  const aktif = sorted.filter(k => k.status?.toLowerCase() === 'aktif').length

  return (
    <div className="space-y-3 fade-in">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <span className="hud-label">{sorted.length} laporan</span>
          {aktif > 0 && (
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-[#ff3333] animate-pulse"
                style={{ boxShadow: '0 0 4px rgba(255,51,51,0.8)' }} />
              <span className="text-[10px] text-[#ff3333] font-bold tracking-wider">{aktif} AKTIF</span>
            </div>
          )}
        </div>
        <button className="hud-btn" onClick={() => setShowForm(true)}>
          + Laporan Baru
        </button>
      </div>

      {sorted.length === 0 ? (
        <EmptyState
          icon="◉"
          title="Tidak ada laporan kerawanan"
          description="Tambahkan laporan insiden kerawanan untuk pos ini."
          action={
            <button className="hud-btn" onClick={() => setShowForm(true)}>
              + Laporan Baru
            </button>
          }
        />
      ) : (
        <div className="space-y-2">
          {sorted.map((item, i) => (
            <KerawananCard
              key={item.id || i}
              item={item}
              color={getCatColor(item.kategori)}
              label={getCatLabel(item.kategori)}
              onToggleStatus={() => handleToggleStatus(item)}
              onDelete={() => handleDelete(item)}
              updating={updatingId === item.id}
              deleting={deleting === item.id}
            />
          ))}
        </div>
      )}

      <Modal
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        title="Laporan Kerawanan Baru"
      >
        <KerawananForm
          posId={posId}
          onSave={handleSave}
          onCancel={() => setShowForm(false)}
        />
      </Modal>
    </div>
  )
}

function KerawananCard({ item, color, label, onToggleStatus, onDelete, updating, deleting }) {
  const [expanded, setExpanded] = useState(false)
  const isAktif = item.status?.toLowerCase() === 'aktif'

  return (
    <div
      className={`hud-panel transition-all ${isAktif ? 'danger-pulse' : ''}`}
      style={{
        borderLeftColor: isAktif ? '#ff3333' : 'rgba(0,255,136,0.2)',
        borderLeftWidth: '2px',
      }}
    >
      <div
        className="px-3 py-2.5 flex items-start justify-between gap-2 cursor-pointer"
        onClick={() => setExpanded(e => !e)}
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            {/* Status */}
            <div className={`flex items-center gap-1 px-1.5 py-0.5 rounded-sm border text-[9px] font-bold tracking-wider uppercase ${
              isAktif
                ? 'text-[#ff3333] border-[rgba(255,51,51,0.3)] bg-[rgba(255,51,51,0.08)]'
                : 'text-[rgba(0,255,136,0.6)] border-[rgba(0,255,136,0.2)] bg-[rgba(0,255,136,0.05)]'
            }`}>
              {isAktif && (
                <span className="w-1 h-1 rounded-full bg-[#ff3333] animate-pulse inline-block"
                  style={{ boxShadow: '0 0 3px rgba(255,51,51,0.8)' }} />
              )}
              {isAktif ? 'AKTIF' : 'DITANGANI'}
            </div>
            {/* Kategori */}
            <span
              className="text-[9px] font-bold tracking-[0.1em] uppercase px-1.5 py-0.5 rounded-sm border"
              style={{ color, background: `${color}10`, borderColor: `${color}30` }}
            >
              {label}
            </span>
            <span className="font-mono text-[10px] text-[rgba(200,214,229,0.4)]">
              {formatDate(item.tanggal)}
            </span>
          </div>
          <p className="text-[rgba(200,214,229,0.65)] text-xs truncate">{item.deskripsi}</p>
        </div>

        <div className="flex items-center gap-1 flex-shrink-0" onClick={e => e.stopPropagation()}>
          <button
            onClick={onToggleStatus}
            disabled={updating}
            title={isAktif ? 'Tandai Selesai' : 'Aktifkan Kembali'}
            className={`p-1.5 rounded-sm text-[10px] border transition-all disabled:opacity-30 ${
              isAktif
                ? 'text-[rgba(0,255,136,0.5)] border-[rgba(0,255,136,0.2)] hover:bg-[rgba(0,255,136,0.08)]'
                : 'text-[rgba(255,170,0,0.5)] border-[rgba(255,170,0,0.2)] hover:bg-[rgba(255,170,0,0.08)]'
            }`}
          >
            {updating ? '…' : (isAktif ? '✓' : '↺')}
          </button>
          <button
            onClick={onDelete}
            disabled={deleting}
            className="p-1.5 rounded-sm text-[rgba(255,51,51,0.35)] hover:text-[#ff3333] hover:bg-[rgba(255,51,51,0.08)] transition-colors disabled:opacity-30"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
          <span className="text-[rgba(0,255,136,0.3)] text-xs">{expanded ? '▲' : '▼'}</span>
        </div>
      </div>

      {expanded && (
        <div className="px-3 pb-3 border-t border-[rgba(0,255,136,0.08)] pt-2 space-y-1.5">
          {item.pelaku && <InfoRow label="Pelaku" value={item.pelaku} />}
          {item.tindak_lanjut && <InfoRow label="Tindak Lanjut" value={item.tindak_lanjut} />}
          {(item.lat && item.lng) && (
            <InfoRow label="Koordinat" value={`${item.lat}, ${item.lng}`} mono />
          )}
        </div>
      )}
    </div>
  )
}

function InfoRow({ label, value, mono }) {
  return (
    <div className="flex gap-3">
      <span className="hud-label w-24 flex-shrink-0">{label}</span>
      <span className={`text-xs flex-1 ${mono ? 'font-mono text-[rgba(0,255,136,0.6)]' : 'text-[rgba(200,214,229,0.65)]'}`}>
        {value}
      </span>
    </div>
  )
}
