import { KERAWANAN_CATEGORIES } from '../../constants/kerawananCategories'

const VARIANT_MAP = {
  default:    'hud-badge-gray',
  danger:     'hud-badge-danger',
  warning:    'hud-badge-warning',
  ok:         'hud-badge-ok',
  info:       'hud-badge-info',
  adat:       'hud-badge-warning',
  masyarakat: 'hud-badge-info',
  agama:      'hud-badge-purple',
}

export function Badge({ variant = 'default', children }) {
  const cls = VARIANT_MAP[variant] || 'hud-badge-gray'
  return <span className={`hud-badge ${cls}`}>{children}</span>
}

export function KerawananBadge({ kategori }) {
  const cat = KERAWANAN_CATEGORIES.find(c => c.id === kategori)
  const label = cat?.label || kategori || '?'
  const color = cat?.color || '#888'

  return (
    <span
      className="hud-badge"
      style={{
        color,
        background: `${color}12`,
        borderColor: `${color}35`,
      }}
    >
      {label.split(' ')[0]}
    </span>
  )
}
