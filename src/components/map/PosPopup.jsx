import { useNavigate } from 'react-router-dom'
import { formatDate } from '../../utils/formatDate'
import { KerawananBadge } from '../ui/Badge'

/**
 * Popup konten untuk marker Pos
 */
export function PosPopup({ pos, onDetailClick }) {
  return (
    <div className="min-w-[180px]">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-7 h-7 rounded-full bg-military-accent/20 text-military-accent text-xs font-bold flex items-center justify-center flex-shrink-0">
          {pos.pos_id.replace('POS-', '')}
        </div>
        <div>
          <p className="font-semibold text-military-text text-sm leading-tight">{pos.nama_pos}</p>
          <p className="text-military-subtext text-xs">{pos.lokasi_desa}, {pos.kabupaten}</p>
        </div>
      </div>

      <div className="space-y-1 text-xs border-t border-military-border pt-2 mb-3">
        <div className="flex justify-between">
          <span className="text-military-subtext">Komandan</span>
          <span className="text-military-text font-medium">{pos.komandan_pos || '-'}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-military-subtext">Personel</span>
          <span className="text-military-text font-medium">{pos.jumlah_personel || '-'} pax</span>
        </div>
        {pos.lat && pos.lng && (
          <div className="flex justify-between">
            <span className="text-military-subtext">Koordinat</span>
            <span className="text-military-text font-mono text-xs">{Number(pos.lat).toFixed(4)}, {Number(pos.lng).toFixed(4)}</span>
          </div>
        )}
      </div>

      <button
        onClick={() => onDetailClick && onDetailClick(pos.pos_id)}
        className="w-full military-btn-primary text-xs py-1.5"
      >
        Lihat Detail →
      </button>
    </div>
  )
}

/**
 * Popup konten untuk marker Kerawanan
 */
export function KerawananPopup({ item }) {
  return (
    <div className="min-w-[180px]">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-2 h-2 rounded-full bg-military-danger flex-shrink-0" />
        <KerawananBadge kategori={item.kategori} />
      </div>

      <p className="text-military-text text-xs mb-2 leading-relaxed">{item.deskripsi}</p>

      <div className="space-y-1 text-xs border-t border-military-border pt-2">
        <div className="flex justify-between">
          <span className="text-military-subtext">Tanggal</span>
          <span className="text-military-text">{formatDate(item.tanggal)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-military-subtext">Status</span>
          <span className={item.status === 'aktif' ? 'text-red-400' : 'text-green-400'}>
            {item.status === 'aktif' ? '● Aktif' : '✓ Selesai'}
          </span>
        </div>
        {item.pos_id && (
          <div className="flex justify-between">
            <span className="text-military-subtext">Pos</span>
            <span className="text-military-text">{item.pos_id}</span>
          </div>
        )}
      </div>
    </div>
  )
}
