/**
 * APP_CONFIG — satu sumber kebenaran untuk semua magic numbers.
 * Import dari sini, jangan hardcode di komponen.
 */
export const APP_CONFIG = {
  // Jumlah pos resmi dalam AO Satgas
  TOTAL_POS: 17,

  // Durasi cache in-memory sebelum re-fetch (ms)
  CACHE_TTL_MS: 5 * 60 * 1000,

  // Interval auto-refresh data (ms)
  AUTO_REFRESH_MS: 5 * 60 * 1000,

  // Timeout request ke GAS sebelum AbortController men-cancel (ms)
  REQUEST_TIMEOUT_MS: 30_000,

  // Maks jumlah entry cache sebelum LRU eviction
  CACHE_MAX_ENTRIES: 100,

  // Maks referensi pos yang ditampilkan di PosPopup
  MAX_REF_POS: 26,

  // Identitas satgas
  SATGAS_NAME: 'SATGAS PAMTAS RI-MLY',
  BATALYON:    'NARASINGA - 35',
  YONKAV:      'YONKAV 8/NSW',
  TAHUN_ANGGARAN: 'TA 2026',
  WILAYAH:     'KALIMANTAN UTARA',
}

/**
 * POS_TABS — tab navigasi di halaman detail pos.
 * Sebelumnya hardcoded di PosDetailPage.jsx.
 */
export const POS_TABS = [
  { id: 'info',      label: 'Info Pos',        icon: '◆' },
  { id: 'demografi', label: 'Demografi',        icon: '◈' },
  { id: 'geodemo',   label: 'Geo-Demo-Konsos',  icon: '◬' },
  { id: 'tokoh',     label: 'Tokoh',            icon: '◉' },
  { id: 'binter',    label: 'Binter',           icon: '◫' },
  { id: 'kerawanan', label: 'Data Insiden',     icon: '⚠' },
  { id: 'patroli',   label: 'Patroli',          icon: '◎' },
  { id: 'foto',      label: 'Dokumentasi',      icon: '▣' },
]

export const VALID_POS_TABS = POS_TABS.map(t => t.id)

/**
 * JENIS_PATROLI — jenis patroli yang valid.
 */
export const JENIS_PATROLI = [
  'Patroli Patok',
  'Patroli Rutin',
  'Patroli Malam',
  'Patroli Bersama',
  'Patroli Sungai',
  'Patroli Udara',
  'Lainnya',
]

