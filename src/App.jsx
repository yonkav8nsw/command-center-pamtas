import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Component } from 'react'
import { AppProvider } from './context/AppContext'
import { AppShell } from './components/layout/AppShell'
import OverviewPage         from './pages/OverviewPage'
import PosDetailPage        from './pages/PosDetailPage'
import KerawananPage        from './pages/KerawananPage'
import BinterPage           from './pages/BinterPage'
import AdminPage            from './pages/AdminPage'
import PanduanPage          from './pages/PanduanPage'
import GrafikKerawananPage  from './pages/laporan/GrafikKerawananPage'
import TimelineBinterPage   from './pages/laporan/TimelineBinterPage'
import DataDemografiPage    from './pages/laporan/DataDemografiPage'
import TokohWilayahPage     from './pages/laporan/TokohWilayahPage'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          background: '#050810',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '16px',
          fontFamily: 'monospace',
          padding: '32px',
        }}>
          <div style={{ color: '#ff3333', fontSize: '24px' }}>⚠</div>
          <p style={{ color: 'rgba(200,214,229,0.7)', fontSize: '13px', letterSpacing: '0.1em' }}>
            TERJADI KESALAHAN SISTEM
          </p>
          <p style={{
            color: 'rgba(255,51,51,0.6)',
            fontSize: '11px',
            maxWidth: '480px',
            textAlign: 'center',
            lineHeight: 1.6,
          }}>
            {this.state.error?.message || 'Unknown error'}
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{
              padding: '8px 24px',
              background: 'rgba(0,255,136,0.1)',
              border: '1px solid rgba(0,255,136,0.3)',
              color: '#00ff88',
              fontSize: '11px',
              letterSpacing: '0.12em',
              cursor: 'pointer',
              borderRadius: '3px',
            }}
          >
            RELOAD
          </button>
        </div>
      )
    }
    return this.props.children
  }
}

export default function App() {
  return (
    <ErrorBoundary>
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
              <Route path="/panduan"                 element={<PanduanPage />} />
              <Route path="/laporan/kerawanan"       element={<GrafikKerawananPage />} />
              <Route path="/laporan/binter"          element={<TimelineBinterPage />} />
              <Route path="/laporan/demografi"       element={<DataDemografiPage />} />
              <Route path="/laporan/tokoh"           element={<TokohWilayahPage />} />
              <Route path="*"                        element={<Navigate to="/" replace />} />
            </Routes>
          </AppShell>
        </BrowserRouter>
      </AppProvider>
    </ErrorBoundary>
  )
}
