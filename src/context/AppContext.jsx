import { createContext, useContext, useState, useCallback } from 'react'

const AppContext = createContext(null)

export function AppProvider({ children }) {
  const [selectedPosId, setSelectedPosId]     = useState(null)
  const [mapView, setMapView]                 = useState('all')     // 'all' | 'kerawanan' | 'binter'
  const [sidebarOpen, setSidebarOpen]         = useState(true)
  const [presentationMode, setPresentationMode] = useState(false)
  const [mapLayer, setMapLayer]               = useState('street')  // 'street' | 'satellite'

  // Filter marker yang tampil di peta
  const [mapLayers, setMapLayers] = useState({
    pos:        true,   // marker pos satgas
    kerawanan:  true,   // marker kerawanan (master toggle)
    narkoba:    true,   // sub: narkotika
    kriminal:   true,   // sub: tindak kriminal
    logging:    true,   // sub: ilegal logging
    trading:    true,   // sub: penyelundupan barang
    trafficking:true,   // sub: perdagangan orang
    border:     true,   // sub: patok perbatasan
    pmInp:      true,   // sub: PMI Non-Prosedural
    binter:     false,  // marker kegiatan binter
  })

  const toggleMapLayer = useCallback((key) => {
    setMapLayers(prev => ({ ...prev, [key]: !prev[key] }))
  }, [])

  const toggleSidebar = useCallback(() => setSidebarOpen(v => !v), [])
  const togglePresentation = useCallback(() => setPresentationMode(v => !v), [])

  return (
    <AppContext.Provider value={{
      selectedPosId, setSelectedPosId,
      mapView, setMapView,
      sidebarOpen, setSidebarOpen, toggleSidebar,
      presentationMode, setPresentationMode, togglePresentation,
      mapLayer, setMapLayer,
      mapLayers, setMapLayers, toggleMapLayer,
    }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
