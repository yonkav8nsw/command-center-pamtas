import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AppProvider } from './context/AppContext'
import { AppShell } from './components/layout/AppShell'
import OverviewPage         from './pages/OverviewPage'
import PosDetailPage        from './pages/PosDetailPage'
import KerawananPage        from './pages/KerawananPage'
import BinterPage           from './pages/BinterPage'
import AdminPage            from './pages/AdminPage'
import GrafikKerawananPage  from './pages/laporan/GrafikKerawananPage'
import TimelineBinterPage   from './pages/laporan/TimelineBinterPage'
import DataDemografiPage    from './pages/laporan/DataDemografiPage'
import TokohWilayahPage     from './pages/laporan/TokohWilayahPage'

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <AppShell>
          <Routes>
            <Route path="/"                       element={<OverviewPage />} />
            <Route path="/pos/:posId"              element={<PosDetailPage />} />
            <Route path="/pos/:posId/:tab"         element={<PosDetailPage />} />
            <Route path="/kerawanan"               element={<KerawananPage />} />
            <Route path="/binter"                  element={<BinterPage />} />
            <Route path="/admin"                   element={<AdminPage />} />
            <Route path="/laporan/kerawanan"       element={<GrafikKerawananPage />} />
            <Route path="/laporan/binter"          element={<TimelineBinterPage />} />
            <Route path="/laporan/demografi"       element={<DataDemografiPage />} />
            <Route path="/laporan/tokoh"           element={<TokohWilayahPage />} />
            <Route path="*"                        element={<Navigate to="/" replace />} />
          </Routes>
        </AppShell>
      </BrowserRouter>
    </AppProvider>
  )
}
