import { formatNumber } from '../../utils/formatDate'

export function SummaryCards({ summary, loading }) {
  const cards = [
    {
      label: 'Total Pos Aktif',
      value: loading ? '—' : (summary?.total_pos ?? 17),
      unit:  'POS',
      color: 'green',
    },
    {
      label: 'Jumlah Penduduk',
      value: loading ? '—' : formatNumber(summary?.total_penduduk ?? 0),
      unit:  'JIWA',
      color: 'blue',
    },
    {
      label: 'Kepala Keluarga',
      value: loading ? '—' : formatNumber(summary?.total_kk ?? 0),
      unit:  'KK',
      color: 'purple',
    },
    {
      label: 'Kerawanan Aktif',
      value: loading ? '—' : (summary?.kerawanan_aktif ?? 0),
      unit:  'KASUS',
      color: (summary?.kerawanan_aktif ?? 0) > 0 ? 'danger' : 'green',
      pulse: (summary?.kerawanan_aktif ?? 0) > 0,
    },
  ]

  const PALETTE = {
    green:  { metric: '#00ff88', glow: 'rgba(0,255,136,0.45)', border: 'rgba(0,255,136,0.2)',  bg: 'rgba(0,255,136,0.04)'  },
    blue:   { metric: '#4488ff', glow: 'rgba(68,136,255,0.45)', border: 'rgba(68,136,255,0.2)', bg: 'rgba(68,136,255,0.04)' },
    purple: { metric: '#bb88ff', glow: 'rgba(187,136,255,0.4)', border: 'rgba(187,136,255,0.2)',bg: 'rgba(187,136,255,0.04)'},
    danger: { metric: '#ff3333', glow: 'rgba(255,51,51,0.5)',   border: 'rgba(255,51,51,0.25)', bg: 'rgba(255,51,51,0.06)'  },
  }

  return (
    <div className="grid grid-cols-2 xl:grid-cols-4 gap-2">
      {cards.map((card) => {
        const p = PALETTE[card.color]
        return (
          <div
            key={card.label}
            className={`relative overflow-hidden rounded-sm ${card.pulse ? 'danger-pulse' : ''}`}
            style={{ background: p.bg, border: `1px solid ${p.border}` }}
          >
            {/* Corner accent top-left */}
            <div className="absolute top-0 left-0 w-3 h-3 pointer-events-none"
              style={{
                borderTop: `1px solid ${p.metric}`,
                borderLeft: `1px solid ${p.metric}`,
                opacity: 0.6,
              }} />
            {/* Corner accent bottom-right */}
            <div className="absolute bottom-0 right-0 w-3 h-3 pointer-events-none"
              style={{
                borderBottom: `1px solid ${p.metric}`,
                borderRight: `1px solid ${p.metric}`,
                opacity: 0.6,
              }} />

            <div className="px-4 py-3">
              <div className="flex items-end justify-between mb-1">
                <span className="text-[8px] font-bold tracking-[0.2em] uppercase"
                  style={{ color: `${p.metric}80` }}>
                  {card.unit}
                </span>
                {card.pulse && (
                  <div className="w-1.5 h-1.5 rounded-full animate-pulse"
                    style={{ background: p.metric, boxShadow: `0 0 6px ${p.glow}` }} />
                )}
              </div>
              <div className="font-mono text-2xl font-bold leading-none mb-2"
                style={{ color: p.metric, textShadow: `0 0 16px ${p.glow}` }}>
                {card.value}
              </div>
              <div className="text-[10px] tracking-wide uppercase"
                style={{ color: 'rgba(200,214,229,0.4)' }}>
                {card.label}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
