import { useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, LayerGroup, useMap } from 'react-leaflet'
import { useNavigate } from 'react-router-dom'
import { MAP_CONFIG, SATELLITE_TILE } from '../../constants/mapConfig'
import { createPosIcon, createKerawananIcon } from './mapIcons'
import { PosPopup, KerawananPopup } from './PosPopup'
import { useApp } from '../../context/AppContext'

/**
 * Helper: fly to pos saat selectedPosId berubah
 */
function MapController({ selectedPosId, posList }) {
  const map = useMap()
  useEffect(() => {
    if (!selectedPosId || !posList) return
    const pos = posList.find(p => p.pos_id === selectedPosId)
    if (pos && pos.lat && pos.lng) {
      map.flyTo([Number(pos.lat), Number(pos.lng)], 12, { duration: 1.2 })
    }
  }, [selectedPosId, posList, map])
  return null
}

// Kategori kerawanan → key mapLayers
// Mencakup nama baru (7 kategori resmi) + alias nama lama dari Google Sheet
const KATEGORI_TO_LAYER = {
  // ── Kategori resmi baru ──
  'Narkoba':     'narkoba',
  'Kriminal':    'kriminal',
  'Logging':     'logging',
  'Trading':     'trading',
  'Trafficking': 'trafficking',
  'Border':      'border',
  'PMI NP':      'pmInp',

  // ── Alias nama lama di sheet → kategori baru ──
  'Human Trafficking':  'trafficking', // sinonim Trafficking
  'Illegal Logging':    'logging',     // sinonim Logging
  'Ilegal Logging':     'logging',     // typo umum
  'Penyelundupan':      'trading',     // perdagangan lintas batas ilegal
  'Imigran Gelap':      'pmInp',       // PMI non-prosedural
  'Penjarahan Laut':    'kriminal',    // kejahatan oleh warga sekitar
  'Ketergantungan':     'trading',     // dependensi sembako dari Malaysia
  'Isolasi Wilayah':    'trading',     // akses sembako dari Malaysia saat terisolasi
}

/**
 * Komponen peta utama Satgas Pamtas
 */
export function PamtasMap({
  posList = [],
  kerawananList = [],
  showKerawanan = true,
  height = '100%',
}) {
  const navigate = useNavigate()
  const { selectedPosId, setSelectedPosId, mapLayer, mapLayers } = useApp()

  // Filter pos yang punya koordinat valid
  const validPos = posList.filter(p => p.lat && p.lng && !isNaN(Number(p.lat)))

  // Buat lookup pos_id → koordinat untuk fallback marker
  const posCoordMap = posList.reduce((acc, p) => {
    if (p.lat && p.lng && !isNaN(Number(p.lat)) && Number(p.lat) !== 0) {
      acc[p.pos_id] = { lat: Number(p.lat), lng: Number(p.lng) }
    }
    return acc
  }, {})

  // Resolusi koordinat kerawanan: pakai lat/lng item, fallback ke koordinat pos
  const resolveCoord = (k) => {
    const lat = Number(k.lat)
    const lng = Number(k.lng)
    if (k.lat && k.lng && !isNaN(lat) && !isNaN(lng) && lat !== 0 && lng !== 0) {
      return { lat, lng }
    }
    // Fallback: koordinat pos
    return posCoordMap[k.pos_id] || null
  }

  // Filter kerawanan berdasarkan mapLayers (per sub-layer kategori)
  const visibleKerawanan = kerawananList
    .filter(k => {
      if (!showKerawanan) return false
      // cek sub-layer berdasarkan kategori
      const layerKey = KATEGORI_TO_LAYER[k.kategori]
      if (!layerKey || !mapLayers[layerKey]) return false
      // harus punya koordinat (sendiri atau dari pos)
      return resolveCoord(k) !== null
    })
    .map(k => ({ ...k, _coord: resolveCoord(k) }))

  return (
    <div style={{ height, width: '100%' }} className="relative">
      <MapContainer
        center={MAP_CONFIG.center}
        zoom={MAP_CONFIG.zoom}
        minZoom={MAP_CONFIG.minZoom}
        maxZoom={MAP_CONFIG.maxZoom}
        style={{ height: '100%', width: '100%' }}
        zoomControl={false}
      >
        {/* Tile layer — conditional rendering forces proper swap */}
        {mapLayer === 'satellite' ? (
          <TileLayer
            url={SATELLITE_TILE.url}
            attribution={SATELLITE_TILE.attribution}
          />
        ) : (
          <TileLayer
            url={MAP_CONFIG.tileUrl}
            attribution={MAP_CONFIG.tileAttribution}
          />
        )}

        {/* Controller: fly to selected pos */}
        <MapController selectedPosId={selectedPosId} posList={validPos} />

        {/* ── Pos markers ──────────────────────────────── */}
        {mapLayers.pos && (
          <LayerGroup>
            {validPos.map((pos) => {
              const isSelected = pos.pos_id === selectedPosId
              const isKotis = pos.pos_id === 'KT'
              // Hitung kerawanan aktif untuk pos ini
              const posActiveKerawanan = kerawananList.filter(
                k => k.pos_id === pos.pos_id && k.status?.toLowerCase() === 'aktif'
              ).length
              return (
                <Marker
                  key={pos.pos_id}
                  position={[Number(pos.lat), Number(pos.lng)]}
                  icon={createPosIcon(pos.pos_id, isSelected, isKotis)}
                  eventHandlers={{
                    click: () => setSelectedPosId(pos.pos_id),
                  }}
                  zIndexOffset={isKotis ? 2000 : isSelected ? 1000 : 0}
                >
                  <Popup maxWidth={300} className="military-popup">
                    <PosPopup
                      pos={pos}
                      onDetailClick={(id) => navigate(`/pos/${id}`)}
                      activeKerawanan={posActiveKerawanan}
                    />
                  </Popup>
                </Marker>
              )
            })}
          </LayerGroup>
        )}

        {/* ── Kerawanan markers ────────────────────────── */}
        {showKerawanan && (
          <LayerGroup>
            {visibleKerawanan.map((item, i) => (
              <Marker
                key={item.id || i}
                position={[item._coord.lat, item._coord.lng]}
                icon={createKerawananIcon(item.kategori, item.status?.toLowerCase() === 'aktif')}
                zIndexOffset={500}
              >
                <Popup maxWidth={220} className="military-popup">
                  <KerawananPopup item={item} />
                </Popup>
              </Marker>
            ))}
          </LayerGroup>
        )}
      </MapContainer>

      {/* Layer toggle controls */}
      <div className="absolute bottom-4 left-2 z-[2000] pointer-events-auto"
        style={{ isolation: 'isolate' }}>
        <MapLayerControls />
      </div>
    </div>
  )
}

/**
 * Kontrol tile layer — bisa dipakai standalone maupun di dalam PamtasMap
 */
export function MapLayerControls() {
  const { mapLayer, setMapLayer } = useApp()

  return (
    <div className="flex flex-col gap-1">
      {[
        { key: 'street',    label: '◫ PETA' },
        { key: 'satellite', label: '◉ SATELIT' },
      ].map(({ key, label }) => (
        <button
          key={key}
          onClick={(e) => { e.stopPropagation(); setMapLayer(key) }}
          className="px-3 py-1.5 text-[9px] font-bold tracking-widest uppercase rounded-sm transition-all"
          style={mapLayer === key ? {
            background: 'rgba(0,255,136,0.15)',
            border: '1px solid rgba(0,255,136,0.5)',
            color: '#00ff88',
            backdropFilter: 'blur(8px)',
            boxShadow: '0 0 8px rgba(0,255,136,0.2)',
          } : {
            background: 'rgba(5,8,10,0.85)',
            border: '1px solid rgba(0,255,136,0.15)',
            color: 'rgba(200,214,229,0.45)',
            backdropFilter: 'blur(8px)',
          }}
        >
          {label}
        </button>
      ))}
    </div>
  )
}
