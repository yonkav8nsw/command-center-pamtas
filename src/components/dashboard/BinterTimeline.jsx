import { formatDate } from '../../utils/formatDate'

export function BinterTimeline({ binterList = [], limit = 5 }) {
  const sorted = [...binterList]
    .sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal))
    .slice(0, limit)

  if (sorted.length === 0) {
    return (
      <div className="flex items-center justify-center py-4 text-[rgba(200,214,229,0.25)] text-xs tracking-wider uppercase">
        Belum ada kegiatan
      </div>
    )
  }

  return (
    <div className="space-y-0">
      {sorted.map((item, i) => (
        <div key={item.id || i} className="hud-timeline-item">
          <div className="flex flex-col items-center flex-shrink-0 mt-1 gap-1">
            <div className="hud-timeline-dot" />
            {i < sorted.length - 1 && (
              <div className="w-px flex-1 min-h-[14px]" style={{ background: 'rgba(0,255,136,0.1)' }} />
            )}
          </div>
          <div className="flex-1 min-w-0 pb-1">
            <div className="flex items-start justify-between gap-2">
              <p className="text-[rgba(200,214,229,0.8)] text-xs font-medium leading-tight truncate">
                {item.jenis_kegiatan}
              </p>
              <span className="font-mono text-[10px] text-[rgba(200,214,229,0.35)] flex-shrink-0">
                {formatDate(item.tanggal)}
              </span>
            </div>
            <p className="text-[10px] text-[rgba(200,214,229,0.35)] mt-0.5 truncate">
              <span className="text-[rgba(0,255,136,0.5)]">{item.pos_id}</span>
              {item.lokasi ? ` · ${item.lokasi}` : ''}
              {item.jumlah_peserta ? ` · ${item.jumlah_peserta} peserta` : ''}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}
