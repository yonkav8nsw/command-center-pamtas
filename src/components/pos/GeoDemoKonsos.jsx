import { LoadingSpinner } from '../ui/LoadingSpinner'
import { EmptyState } from '../ui/EmptyState'

export function GeoDemoKonsos({ demografi, loading }) {
  if (loading) return <LoadingSpinner text="Memuat data..." />
  if (!demografi) return <EmptyState title="Data belum tersedia" />

  const sections = [
    {
      key:   'geografi',
      label: 'Kondisi Geografi',
      icon:  '◬',
      color: 'rgba(0,255,136,0.25)',
      glow:  'rgba(0,255,136,0.15)',
      value: demografi.geografi,
    },
    {
      key:   'demografi_notes',
      label: 'Kondisi Demografi',
      icon:  '◈',
      color: 'rgba(68,136,255,0.25)',
      glow:  'rgba(68,136,255,0.15)',
      value: demografi.demografi_notes,
    },
    {
      key:   'konsos_notes',
      label: 'Kondisi Sosial (Konsos)',
      icon:  '◉',
      color: 'rgba(187,136,255,0.25)',
      glow:  'rgba(187,136,255,0.15)',
      value: demografi.konsos_notes,
    },
  ]

  return (
    <div className="space-y-3 fade-in">
      {sections.map(({ key, label, icon, color, glow, value }) => (
        <div
          key={key}
          className="hud-panel relative overflow-hidden"
          style={{ borderLeftColor: color, borderLeftWidth: '2px' }}
        >
          {/* Glow corner */}
          <div className="absolute top-0 left-0 w-16 h-16 pointer-events-none rounded-sm"
            style={{ background: `radial-gradient(ellipse at top left, ${glow}, transparent)` }} />

          <div className="hud-header">
            <div className="flex items-center gap-2">
              <span className="text-xs" style={{ color }}>{icon}</span>
              <span className="hud-title">{label}</span>
            </div>
          </div>

          <div className="p-3">
            {value ? (
              <p className="text-[rgba(200,214,229,0.7)] text-xs leading-relaxed whitespace-pre-wrap">
                {value}
              </p>
            ) : (
              <p className="text-[rgba(200,214,229,0.25)] text-xs italic tracking-wide">
                Belum ada data. Update via Google Sheets.
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
