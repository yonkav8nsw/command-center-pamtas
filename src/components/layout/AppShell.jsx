import { useApp } from '../../context/AppContext'
import { TopBar } from './TopBar'
import { Sidebar } from './Sidebar'
import { StatusBar } from './StatusBar'

export function AppShell({ children }) {
  const { presentationMode } = useApp()

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

      {/* Top bar */}
      <TopBar />

      {/* Main: sidebar + content */}
      <div className="flex flex-1 overflow-hidden relative z-10">
        <Sidebar />
        <main className="flex-1 overflow-hidden bg-[#050810]">
          {children}
        </main>
      </div>

      {/* Status bar */}
      <StatusBar />
    </div>
  )
}
