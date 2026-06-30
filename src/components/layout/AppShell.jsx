import { useApp } from '../../context/AppContext'
import { TopBar } from './TopBar'
import { Sidebar } from './Sidebar'
import { StatusBar } from './StatusBar'

export function AppShell({ children, hideStatusBar = false }) {
  const { presentationMode, togglePresentation } = useApp()

  return (
    <div className={`flex flex-col h-screen overflow-hidden ${presentationMode ? 'presentation-mode' : ''}`}
      style={{ backgroundColor: 'var(--surface-base)' }}>

      {/* Subtle grid texture overlay */}
      <div
        className="fixed inset-0 pointer-events-none z-0 opacity-[0.025]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0,255,136,0.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,255,136,0.5) 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px',
        }}
      />

      {/* Top bar — hidden during presentation */}
      {!presentationMode && <TopBar />}

      {/* Main: sidebar + content */}
      <div className="flex flex-1 overflow-hidden relative z-10">
        {!presentationMode && <Sidebar id="sidebar-nav" />}
        <main
          id="main-content"
          className="flex-1 min-w-0 overflow-hidden"
          style={{ backgroundColor: 'var(--surface-base)' }}
          role="main"
          aria-label="Konten utama"
        >
          {children}
        </main>
      </div>

      {/* Status bar — hidden during presentation and when hideStatusBar is true */}
      {!presentationMode && !hideStatusBar && <StatusBar />}

      {/* ── Floating exit button during presentation mode ── */}
      {presentationMode && (
        <button
          onClick={togglePresentation}
          className="fixed top-3 right-3 z-[9999] flex items-center gap-2 px-3 py-2 rounded-sm
            text-[10px] font-bold uppercase tracking-widest transition-all duration-150 cursor-pointer"
          style={{
            background: 'rgba(3,3,5,0.92)',
            border: '1px solid rgba(255,59,59,0.5)',
            color: 'var(--color-danger)',
            backdropFilter: 'blur(8px)',
            boxShadow: '0 0 12px rgba(255,59,59,0.2)',
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
