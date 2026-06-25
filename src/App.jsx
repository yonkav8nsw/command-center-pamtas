import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Component } from 'react'
import { AppProvider } from './context/AppContext'
import { AuthProvider } from './context/AuthContext'
import { ToastProvider } from './components/ui/Toast'
import { ConfirmProvider } from './components/ui/ConfirmDialog'
import PageErrorBoundary from './components/ui/PageErrorBoundary'
import { ProtectedRoute } from './components/auth/ProtectedRoute'
import { AppShell } from './components/layout/AppShell'
import LoginPage            from './pages/LoginPage'
import HomePage             from './pages/HomePage'
import OverviewPage         from './pages/OverviewPage'
import PosDetailPage        from './pages/PosDetailPage'
import InsidenPage          from './pages/InsidenPage'
import BinterPage           from './pages/BinterPage'
import AdminPage            from './pages/AdminPage'
import PanduanPage          from './pages/PanduanPage'
import GrafikKerawananPage  from './pages/laporan/GrafikKerawananPage'
import TimelineBinterPage   from './pages/laporan/TimelineBinterPage'
import DataDemografiPage    from './pages/laporan/DataDemografiPage'
import TokohWilayahPage     from './pages/laporan/TokohWilayahPage'
import LaporanPosPage       from './pages/laporan/LaporanPosPage'

// Error boundary global
class GlobalErrorBoundary extends Component {
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

function Safe({ children }) {
  return <PageErrorBoundary>{children}</PageErrorBoundary>
}

export default function App() {
  return (
    <GlobalErrorBoundary>
      <ToastProvider>
        <ConfirmProvider>
          <AuthProvider>
            <AppProvider>
              <BrowserRouter basename={import.meta.env.BASE_URL}>
                <Routes>
                  <Route path="/login" element={<LoginPage />} />

                  <Route path="/*" element={
                    <ProtectedRoute>
                      <AppShell>
                        <Routes>
                          <Route path="/"                       element={<Safe><HomePage /></Safe>} />
                          <Route path="/overview"               element={<Safe><OverviewPage /></Safe>} />
                          <Route path="/pos/:posId"             element={<Safe><PosDetailPage /></Safe>} />
                          <Route path="/pos/:posId/:tab"        element={<Safe><PosDetailPage /></Safe>} />
                          <Route path="/insiden"                element={<Safe><InsidenPage /></Safe>} />
                          {/* Alias lama supaya bookmark lama tidak 404 */}
                          <Route path="/kerawanan"              element={<Navigate to="/insiden" replace />} />
                          <Route path="/binter"                 element={<Safe><BinterPage /></Safe>} />
                          <Route path="/admin"                  element={<ProtectedRoute requireAdmin><Safe><AdminPage /></Safe></ProtectedRoute>} />
                          <Route path="/panduan"                element={<Safe><PanduanPage /></Safe>} />
                          <Route path="/laporan/kerawanan"      element={<Safe><GrafikKerawananPage /></Safe>} />
                          <Route path="/laporan/binter"         element={<Safe><TimelineBinterPage /></Safe>} />
                          <Route path="/laporan/demografi"      element={<Safe><DataDemografiPage /></Safe>} />
                          <Route path="/laporan/tokoh"          element={<Safe><TokohWilayahPage /></Safe>} />
                          <Route path="/laporan/pos/:posId"     element={<Safe><LaporanPosPage /></Safe>} />
                          <Route path="*"                       element={<Navigate to="/" replace />} />
                        </Routes>
                      </AppShell>
                    </ProtectedRoute>
                  } />
                </Routes>
              </BrowserRouter>
            </AppProvider>
          </AuthProvider>
        </ConfirmProvider>
      </ToastProvider>
    </GlobalErrorBoundary>
  )
}
