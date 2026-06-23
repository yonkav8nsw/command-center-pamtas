import { divIcon } from 'leaflet'
import { KERAWANAN_COLOR_MAP } from '../../constants/kerawananCategories'

/**
 * Pos marker — HUD style dengan pulse ring effect
 */
export function createPosIcon(posId, isSelected = false, isKotis = false) {
  const color = isSelected ? '#00ff88' : isKotis ? '#ffd700' : '#00cc6a'
  const size = isSelected ? 36 : 30

  // Label: bintang untuk KOTIS, angka untuk pos biasa
  const label = isKotis
    ? `<span style="transform:rotate(45deg); color:#ffd700; font-weight:900; font-size:14px; line-height:1; text-shadow:0 0 8px rgba(255,215,0,0.9);">★</span>`
    : `<span style="
        transform:rotate(45deg);
        color:${color};
        font-weight:700;
        font-size:${String(posId).length > 3 ? '7px' : String(posId).length > 2 ? '8px' : '10px'};
        line-height:1;
        font-family:'JetBrains Mono','Courier New',monospace;
        text-shadow: 0 0 6px rgba(0,255,136,0.8);
      ">${String(posId ?? '?')}</span>`

  const html = `
    <div style="position:relative; width:${size}px; height:${size}px;">
      ${isSelected ? `
        <div style="
          position:absolute; inset:-8px;
          border-radius:50%;
          border: 1px solid ${color}80;
          animation: posRing1 2s ease-out infinite;
        "></div>
        <div style="
          position:absolute; inset:-16px;
          border-radius:50%;
          border: 1px solid ${color}40;
          animation: posRing2 2s ease-out infinite 0.5s;
        "></div>
      ` : `
        <div style="
          position:absolute; inset:-6px;
          border-radius:50%;
          border: 1px solid ${color}4d;
          animation: posRing1 3s ease-out infinite;
        "></div>
      `}
      <div style="
        width:${size}px; height:${size}px;
        background: radial-gradient(circle at 35% 35%, ${isKotis ? 'rgba(255,215,0,0.25)' : 'rgba(0,255,136,0.25)'}, ${isKotis ? 'rgba(60,40,0,0.95)' : 'rgba(0,60,30,0.95)'});
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        border: 1.5px solid ${color};
        box-shadow: 0 0 ${isSelected ? 16 : 8}px ${color}${isSelected ? '99' : '4d'},
                    inset 0 0 8px ${color}1a;
        display:flex; align-items:center; justify-content:center;
      ">
        ${label}
      </div>
    </div>
    <style>
      @keyframes posRing1 {
        0%   { transform: scale(1); opacity: 0.8; }
        100% { transform: scale(1.8); opacity: 0; }
      }
      @keyframes posRing2 {
        0%   { transform: scale(1); opacity: 0.5; }
        100% { transform: scale(2.2); opacity: 0; }
      }
    </style>
  `

  return divIcon({
    html,
    className: '',
    iconSize: [size + 32, size + 32],
    iconAnchor: [size / 2 + 16, size + 16],
    popupAnchor: [0, -(size + 16)],
  })
}

/**
 * Kerawanan marker — circle shape, warna per kategori baru
 */
export function createKerawananIcon(kategori, isActive = true) {
  // Warna per kategori — seragam dengan filter bar di OverviewPage
  // Warna per kategori — alias nama lama di sheet juga dipetakan
  const colorMap = {
    // kategori resmi baru
    'Narkoba':    '#dc2626',
    'Kriminal':   '#ef4444',
    'Logging':    '#d97706',
    'Trading':    '#f59e0b',
    'Trafficking':'#db2777',
    'Border':     '#0ea5e9',
    'PMI NP':     '#ea580c',
    // alias nama lama dari sheet
    'Human Trafficking': '#db2777',
    'Illegal Logging':   '#d97706',
    'Ilegal Logging':    '#d97706',
    'Penyelundupan':     '#f59e0b',
    'Imigran Gelap':     '#ea580c',
    'Penjarahan Laut':   '#ef4444',
    'Ketergantungan':    '#f59e0b',
    'Isolasi Wilayah':   '#f59e0b',
  }
  const color = colorMap[kategori] || '#ff3333'
  const size  = 26

  // Icon per kategori — alias nama lama ikut kategori yang sama
  const iconChar = {
    // kategori resmi baru
    'Narkoba':    '💊',
    'Kriminal':   '⚠',
    'Logging':    '🌲',
    'Trading':    '📦',
    'Trafficking':'👤',
    'Border':     '🚧',
    'PMI NP':     '🚶',
    // alias nama lama
    'Human Trafficking': '👤',
    'Illegal Logging':   '🌲',
    'Ilegal Logging':    '🌲',
    'Penyelundupan':     '📦',
    'Imigran Gelap':     '🚶',
    'Penjarahan Laut':   '⚠',
    'Ketergantungan':    '📦',
    'Isolasi Wilayah':   '📦',
  }
  const icon = iconChar[kategori] || '⚠'

  const html = `
    <div style="position:relative; width:${size}px; height:${size}px;">
      ${isActive ? `
        <div style="
          position:absolute; inset:-6px;
          border-radius:50%;
          border: 1px solid ${color}88;
          animation: krawRing 1.8s ease-out infinite;
        "></div>
        <div style="
          position:absolute; inset:-12px;
          border-radius:50%;
          border: 1px solid ${color}44;
          animation: krawRing 1.8s ease-out infinite 0.6s;
        "></div>
      ` : ''}
      <div style="
        width:${size}px; height:${size}px;
        background: radial-gradient(circle at 35% 35%, ${color}33, rgba(10,5,5,0.92));
        border-radius: 50%;
        border: 1.5px solid ${color};
        box-shadow: 0 0 10px ${color}66, inset 0 0 6px ${color}1a;
        display:flex; align-items:center; justify-content:center;
      ">
        <span style="
          color:${color};
          font-weight:900;
          font-size:11px;
          line-height:1;
          text-shadow: 0 0 6px ${color}cc;
        ">${icon}</span>
      </div>
    </div>
    <style>
      @keyframes krawRing {
        0%   { transform: scale(1); opacity: 0.7; }
        100% { transform: scale(2.2); opacity: 0; }
      }
    </style>
  `

  return divIcon({
    html,
    className: '',
    iconSize:    [size + 24, size + 24],
    iconAnchor:  [size / 2 + 12, size / 2 + 12],
    popupAnchor: [0, -(size / 2 + 14)],
  })
}

/**
 * Binter marker
 */
export function createBinterIcon() {
  const html = `
    <div style="
      width:20px; height:20px;
      background: radial-gradient(circle at 35% 35%, rgba(68,136,255,0.3), rgba(20,40,120,0.9));
      border-radius:50%;
      border: 1.5px solid #4488ff;
      box-shadow: 0 0 8px rgba(68,136,255,0.5);
      display:flex; align-items:center; justify-content:center;
    ">
      <span style="color:#4488ff; font-weight:700; font-size:10px; line-height:1;">★</span>
    </div>
  `
  return divIcon({
    html,
    className: '',
    iconSize: [20, 20],
    iconAnchor: [10, 10],
    popupAnchor: [0, -12],
  })
}
