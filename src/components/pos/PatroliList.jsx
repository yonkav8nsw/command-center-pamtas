import { useState } from 'react'
import { LoadingSpinner } from '../ui/LoadingSpinner'
import { EmptyState } from '../ui/EmptyState'
import { Modal } from '../ui/Modal'
import { PatroliForm } from '../forms/PatroliForm'
import { formatDate } from '../../utils/formatDate'
import { useToast } from '../ui/Toast'
import { useConfirm } from '../ui/ConfirmDialog'
import { patroliService } from '../../services/patroli.service'
import { clearCache } from '../../hooks/useGasApi'

const JENIS_COLOR = {
  'Patroli Patok':   '#00ff88',
  'Patroli Rutin':   '#4488ff',
  'Patroli Malam':   '#bb88ff',
  'Patroli Bersama': '#ffaa00',
  'Patroli Sungai':  '#00ccff',
  'Patroli Udara':   '#ff88cc',
  'Lainnya':         '#c8d6e5',
}

function getColor(jenis) {
  return JENIS_COLOR[jenis] || '#c8d6e5'
}

export function PatroliList({ patroliList, loading, posId, onRefresh }) {
  const { showToast } = useToast()
  const { confirm }   = useConfirm()
  const [showForm, setShowForm] = useState(false)
  const [deleting, setDeleting] = useState(null)

  const handleSave = async (data) => {
    try {
      await patroliService.add({ ...data, pos_id: posId })
      clearCache()
      onRefresh && onRefresh()
      setShowForm(false)
      showToast('Laporan patroli berhasil disimpan', 'success')
    } catch (err) {
      showToast('Gagal menyimpan: ' + err.message, 'error')
    }
  }

  const handleDelete = async (item) => {
    const ok = await confirm(
      `Hapus laporan patroli tanggal ${formatDate(item.tanggal)}? Tindakan ini tidak dapat dibatalkan.`,
      { title: 'Hapus Laporan Patroli', type: 'danger' }
    )
    if (!ok) return
    setDeleting(item.id)
    try {
      await patroliService.remove(item.id)
      clearCache()
      onRefresh && onRefresh()
      showToast('Laporan patroli berhasil dihapus', 'success')
    } catch (err) {
      showToast('Gagal menghapus: ' + err.message, 'error')
    } finally {
      setDeleting(null)
    }
  }

  if (loading) return <LoadingSpinner text="Memuat data patroli..." />

  const sorted = [...(patroliList || [])].sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal))

  return (
    <div className="space-y-3 fade-in">
      <div className="flex justify-between items-center">
        <span className="hud-label">{sorted.length} laporan patroli</span>
        <button className="hud-btn" onClick={() => setShowForm(true)}>
          + Laporan Patroli
        </button>
      </div>

      {sorted.length === 0 ? (
        <EmptyState
          icon="◎"
          title="Belum ada laporan patroli"
          description="Tambahkan laporan kegiatan patroli untuk pos ini."
          action={
            <button className="hud-btn" onClick={() => setShowForm(true)}>
              + Laporan Patroli
            </button>
          }
        />
      ) : (
        <div className="space-y-2">
          {sorted.map((item, i) => (
            <PatroliCard
              key={item.id || i}
              item={item}
              color={getColor(item.jenis_patroli)}
              onDelete={() => handleDelete(item)}
              deleting={deleting === item.id}
            />
          ))}
        </div>
      )}

      <Modal
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        title="Laporan Patroli Baru"
      >
        <PatroliForm
          posId={posId}
          onSave={handleSave}
          onCancel={() => setShowForm(false)}
        />
      </Modal>
    </div>
  )
}

function PatroliCard({ item, color, onDelete, deleting }) {
  const [expanded, setExpanded] = useState(false)

  // Deteksi apakah temuan nihil / ada temuan
  const isNihil = item.hasil_patroli?.toLowerCase().includes('nihil') ||
                  item.hasil_patroli?.toLowerCase().includes('aman')
  const borderColor = isNihil ? 'rgba(0,255,136,0.2)' : '#ffaa00'

  return (
    <div
      className="hud-panel transition-colors hover:border-[rgba(0,255,136,0.25)]"
      style={{ borderLeftColor: borderColor, borderLeftWidth: '2px' }}
    >
      <div
        className="px-3 py-2.5 flex items-start justify-between gap-2 cursor-pointer"
        onClick={() => setExpanded(e => !e)}
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5 flex-wrap">
            {/* Jenis patroli badge */}
            <span
              className="text-[9px] font-bold tracking-[0.1em] uppercase px-1.5 py-0.5 rounded-sm border"
              style={{ color, background: `${color}10`, borderColor: `${color}30` }}
            >
              {item.jenis_patroli}
            </span>
            <span className="font-mono text-[10px] text-[rgba(200,214,229,0.4)]">
              {formatDate(item.tanggal)}
            </span>
            {item.jumlah_personel && (
              <span className="text-[9px] text-[rgba(200,214,229,0.35)]">
                {item.jumlah_personel} personel
              </span>
            )}
            {/* Temuan indicator */}
            {!isNihil && (
              <span className="text-[8px] font-bold px-1 py-0.5 rounded-sm"
                style={{ background: 'rgba(255,170,0,0.1)', color: 'rgba(255,170,0,0.8)', border: '1px solid rgba(255,170,0,0.2)' }}>
                ADA TEMUAN
              </span>
            )}
          </div>
          {item.rute && (
            <p className="text-[rgba(200,214,229,0.45)] text-[10px] truncate">
              {item.rute}
            </p>
          )}
          <p className="text-[rgba(200,214,229,0.6)] text-xs truncate mt-0.5">
            {item.hasil_patroli}
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
          {item.rute && <InfoRow label="Rute" value={item.rute} />}
          <InfoRow label="Hasil Patroli" value={item.hasil_patroli} />
          {item.catatan && <InfoRow label="Catatan" value={item.catatan} />}
          {item.jumlah_personel && (
            <InfoRow label="Personel" value={`${item.jumlah_personel} orang`} />
          )}
          {item.foto_url && (
            <div className="flex gap-3 items-start">
              <span className="hud-label w-20 flex-shrink-0">Dokumentasi</span>
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
    <div className="flex gap-3 items-start">
      <span className="hud-label w-24 flex-shrink-0 pt-0.5">{label}</span>
      <span className="text-[rgba(200,214,229,0.65)] text-xs flex-1 leading-relaxed">{value}</span>
    </div>
  )
}
