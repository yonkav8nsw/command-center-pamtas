export const KERAWANAN_CATEGORIES = [
  { id: 'Kriminal',          label: 'Kriminal',            color: '#dc2626', icon: '⚠' },
  { id: 'Ilegal Logging',    label: 'Ilegal Logging',      color: '#d97706', icon: '🌲' },
  { id: 'Illegal Mining',    label: 'Illegal Mining',      color: '#7c3aed', icon: '⛏' },
  { id: 'Human Trafficking', label: 'Human Trafficking',   color: '#db2777', icon: '👤' },
  { id: 'Lintas Batas',      label: 'Lintas Batas Negara', color: '#ea580c', icon: '🚧' },
  { id: 'Lainnya',           label: 'Lainnya',             color: '#6b7280', icon: '📌' },
]

export const KERAWANAN_COLOR_MAP = Object.fromEntries(
  KERAWANAN_CATEGORIES.map(k => [k.id, k.color])
)

export const BINTER_TYPES = [
  'Bakti Sosial',
  'Penyuluhan Kesehatan',
  'Penyuluhan Pertanian',
  'Penyuluhan Hukum',
  'Pembangunan Fisik',
  'Olahraga Bersama',
  'Silaturahmi Tokoh',
  'Patroli Bersama',
  'Pengobatan Gratis',
  'Pembagian Sembako',
  'Kegiatan Keagamaan',
  'Lainnya',
]

export const TOKOH_CATEGORIES = ['Adat', 'Masyarakat', 'Agama']

export const AGAMA_LIST = [
  { key: 'islam',     label: 'Islam' },
  { key: 'kristen',   label: 'Kristen' },
  { key: 'katolik',   label: 'Katolik' },
  { key: 'hindu',     label: 'Hindu' },
  { key: 'buddha',    label: 'Buddha' },
  { key: 'konghucu',  label: 'Konghucu' },
  { key: 'lainnya',   label: 'Lainnya' },
]

export const IBADAH_LIST = [
  { key: 'masjid',   label: 'Masjid/Mushola' },
  { key: 'gereja',   label: 'Gereja' },
  { key: 'pura',     label: 'Pura' },
  { key: 'vihara',   label: 'Vihara' },
]
