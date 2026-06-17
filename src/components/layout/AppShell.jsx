import { useApp } from '../../context/AppContext'
import { TopBar } from './TopBar'
import { Sidebar } from './Sidebar'
import { StatusBar } from './StatusBar'

export function AppShell({ children }) {
  const { presentationMode, togglePresentation } = useApp()

  return (
    <div className={`flex flex-col h-screen overflow-hidden bg-[#050810] ${presentationMode ? 'presentation-mode' : ''}`}>
      {/* Subtle grid texture overlay */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-[0.025]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0,255,136,0.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,255,136,0.5) 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px',
        }}
      />

      {/* Top bar — sembunyikan saat presentasi */}
      {!presentationMode && <TopBar />}

      {/* Main: sidebar + content */}
      <div className="flex flex-1 overflow-hidden relative z-10">
        {!presentationMode && <Sidebar />}
        <main className="flex-1 overflow-hidden bg-[#050810]">
          {children}
        </main>
      </div>

      {/* Status bar — sembunyikan saat presentasi */}
      {!presentationMode && <StatusBar />}

      {/* ── Floating exit button saat mode presentasi ── */}
      {presentationMode && (
        <button
          onClick={togglePresentation}
          className="fixed top-3 right-3 z-[9999] flex items-center gap-2 px-3 py-2 rounded-sm
            text-[10px] font-bold uppercase tracking-widest transition-all"
          style={{
            background: 'rgba(5,8,10,0.92)',
            border: '1px solid rgba(255,51,51,0.5)',
            color: '#ff5555',
            backdropFilter: 'blur(8px)',
            boxShadow: '0 0 12px rgba(255,51,51,0.2)',
          }}
        >
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}
              d="M6 18L18 6M6 6l12 12" />
          </svg>
          Exit Presentasi
        </button>
      )}
    </div>
  )
}
