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
const KATEGORI_TO_LAYER = {
  'Kriminal':          'kriminal',
  'Ilegal Logging':    'logging',
  'Illegal Mining':    'mining',
  'Human Trafficking': 'trafficking',
  'Lintas Batas':      'kerawanan',
  'Lainnya':           'kerawanan',
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

  const tileConfig = mapLayer === 'satellite' ? SATELLITE_TILE : {
    url: MAP_CONFIG.tileUrl,
    attribution: MAP_CONFIG.tileAttribution,
  }

  // Filter pos yang punya koordinat valid
  const validPos = posList.filter(p => p.lat && p.lng && !isNaN(Number(p.lat)))

  // Filter kerawanan berdasarkan mapLayers
  const visibleKerawanan = kerawananList.filter(k => {
    if (!k.lat || !k.lng || isNaN(Number(k.lat))) return false
    if (!showKerawanan) return false
    // cek layer global kerawanan
    if (!mapLayers.kerawanan) return false
    // cek sub-layer berdasarkan kategori
    const layerKey = KATEGORI_TO_LAYER[k.kategori] || 'kerawanan'
    if (layerKey !== 'kerawanan' && !mapLayers[layerKey]) return false
    return true
  })

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
        {/* Tile layer */}
        <TileLayer
          url={tileConfig.url}
          attribution={tileConfig.attribution}
        />

        {/* Controller: fly to selected pos */}
        <MapController selectedPosId={selectedPosId} posList={validPos} />

        {/* ── Pos markers ──────────────────────────────── */}
        {mapLayers.pos && (
          <LayerGroup>
            {validPos.map((pos) => {
              const posNum = parseInt(pos.pos_id.replace('POS-', ''), 10)
              const isSelected = pos.pos_id === selectedPosId
              const isKotis = pos.pos_id === 'KOTIS'
              return (
                <Marker
                  key={pos.pos_id}
                  position={[Number(pos.lat), Number(pos.lng)]}
                  icon={createPosIcon(posNum, isSelected, isKotis)}
                  eventHandlers={{
                    click: () => setSelectedPosId(pos.pos_id),
                  }}
                  zIndexOffset={isKotis ? 2000 : isSelected ? 1000 : 0}
                >
                  <Popup maxWidth={220} className="military-popup">
                    <PosPopup pos={pos} onDetailClick={(id) => navigate(`/pos/${id}`)} />
                  </Popup>
                </Marker>
              )
            })}
          </LayerGroup>
        )}

        {/* ── Kerawanan markers ────────────────────────── */}
        {showKerawanan && mapLayers.kerawanan && (
          <LayerGroup>
            {visibleKerawanan.map((item) => (
              <Marker
                key={item.id}
                position={[Number(item.lat), Number(item.lng)]}
                icon={createKerawananIcon(item.kategori, item.status === 'aktif')}
              >
                <Popup maxWidth={220} className="military-popup">
                  <KerawananPopup item={item} />
                </Popup>
              </Marker>
            ))}
          </LayerGroup>
        )}
      </MapContainer>

      {/* Layer toggle controls — di dalam div relative tapi z-index tinggi */}
      <div className="absolute bottom-4 left-2 z-[1000] pointer-events-auto">
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
