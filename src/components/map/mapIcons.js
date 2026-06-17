import { divIcon } from 'leaflet'
import { KERAWANAN_COLOR_MAP } from '../../constants/kerawananCategories'

/**
 * Pos marker — HUD style dengan pulse ring effect
 */
export function createPosIcon(posNum, isSelected = false) {
  const color = isSelected ? '#00ff88' : '#00cc6a'
  const size = isSelected ? 36 : 30

  const html = `
    <div style="position:relative; width:${size}px; height:${size}px;">
      ${isSelected ? `
        <div style="
          position:absolute; inset:-8px;
          border-radius:50%;
          border: 1px solid rgba(0,255,136,0.5);
          animation: posRing1 2s ease-out infinite;
        "></div>
        <div style="
          position:absolute; inset:-16px;
          border-radius:50%;
          border: 1px solid rgba(0,255,136,0.25);
          animation: posRing2 2s ease-out infinite 0.5s;
        "></div>
      ` : `
        <div style="
          position:absolute; inset:-6px;
          border-radius:50%;
          border: 1px solid rgba(0,255,136,0.3);
          animation: posRing1 3s ease-out infinite;
        "></div>
      `}
      <div style="
        width:${size}px; height:${size}px;
        background: radial-gradient(circle at 35% 35%, rgba(0,255,136,0.25), rgba(0,60,30,0.95));
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        border: 1.5px solid ${color};
        box-shadow: 0 0 ${isSelected ? 16 : 8}px rgba(0,255,136,${isSelected ? 0.6 : 0.3}),
                    inset 0 0 8px rgba(0,255,136,0.1);
        display:flex; align-items:center; justify-content:center;
      ">
        <span style="
          transform:rotate(45deg);
          color:${color};
          font-weight:700;
          font-size:${posNum > 9 ? '8px' : '10px'};
          line-height:1;
          font-family:'JetBrains Mono','Courier New',monospace;
          text-shadow: 0 0 6px rgba(0,255,136,0.8);
        ">${posNum}</span>
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

  const anchor = isSelected ? size / 2 + 8 : size / 2 + 6
  return divIcon({
    html,
    className: '',
    iconSize: [size + 32, size + 32],
    iconAnchor: [size / 2 + 16, size + 16],
    popupAnchor: [0, -(size + 16)],
  })
}

/**
 * Kerawanan marker — pulse ring merah
 */
export function createKerawananIcon(kategori, isActive = true) {
  const color = KERAWANAN_COLOR_MAP[kategori] || '#6b7280'

  const html = `
    <div style="position:relative; width:24px; height:24px;">
      ${isActive ? `
        <div style="
          position:absolute; inset:-5px;
          border-radius:50%;
          border: 1px solid ${color}88;
          animation: krawRing 1.8s ease-out infinite;
        "></div>
        <div style="
          position:absolute; inset:-10px;
          border-radius:50%;
          border: 1px solid ${color}44;
          animation: krawRing 1.8s ease-out infinite 0.6s;
        "></div>
      ` : ''}
      <div style="
        width:24px; height:24px;
        background: radial-gradient(circle at 35% 35%, ${color}44, ${color}cc);
        border-radius:50%;
        border: 1.5px solid ${color};
        box-shadow: 0 0 10px ${color}66;
        display:flex; align-items:center; justify-content:center;
      ">
        <span style="color:white; font-weight:900; font-size:12px; line-height:1; text-shadow:0 1px 2px rgba(0,0,0,0.5);">!</span>
      </div>
    </div>
    <style>
      @keyframes krawRing {
        0%   { transform: scale(1); opacity: 0.7; }
        100% { transform: scale(2); opacity: 0; }
      }
    </style>
  `

  return divIcon({
    html,
    className: '',
    iconSize: [44, 44],
    iconAnchor: [22, 22],
    popupAnchor: [0, -24],
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
