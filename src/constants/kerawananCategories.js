export const KERAWANAN_CATEGORIES = [
  { id: 'Narkoba',    label: 'Narkoba',    color: '#dc2626', icon: '💊' },
  { id: 'Kriminal',   label: 'Kriminal',   color: '#ef4444', icon: '⚠' },
  { id: 'Logging',    label: 'Logging',    color: '#d97706', icon: '🌲' },
  { id: 'Trading',    label: 'Trading',    color: '#f59e0b', icon: '📦' },
  { id: 'Trafficking',label: 'Trafficking',color: '#db2777', icon: '👤' },
  { id: 'Border',     label: 'Border',     color: '#0ea5e9', icon: '🚧' },
  { id: 'PMI NP',     label: 'PMI NP',     color: '#ea580c', icon: '🚶' },
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

/**
 * BINTER_COLOR_MAP — satu sumber kebenaran untuk warna jenis kegiatan binter.
 * Sebelumnya diduplikasi di BinterList.jsx, BinterPage.jsx, OverviewPage.jsx.
 * Semua consumer sekarang import dari sini.
 */
export const BINTER_COLOR_MAP = {
  'Bakti Sosial':          '#4488ff',
  'Penyuluhan Kesehatan':  '#00ff88',
  'Penyuluhan Pertanian':  '#00dd77',
  'Penyuluhan Hukum':      '#22ccaa',
  'Pembangunan Fisik':     '#bb88ff',
  'Olahraga Bersama':      '#ffaa00',
  'Silaturahmi Tokoh':     '#ff88cc',
  'Patroli Bersama':       '#88ccff',
  'Pengobatan Gratis':     '#00ff88',
  'Pembagian Sembako':     '#4488ff',
  'Kegiatan Keagamaan':    '#bb88ff',
  // Alias untuk kompatibilitas data lama
  'Penyuluhan':            '#00ff88',
  'Baksos':                '#4488ff',
  'Kunjungan':             '#ff88cc',
  'Karya Bhakti':          '#bb88ff',
  'Lainnya':               '#c8d6e5',
}

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

