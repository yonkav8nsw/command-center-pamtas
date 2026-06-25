import { useEffect, useState } from 'react'

export function StatusBar() {
  const [lastUpdate, setLastUpdate] = useState(new Date())
  const [isOnline, setIsOnline]     = useState(navigator.onLine)

  useEffect(() => {
    const on  = () => setIsOnline(true)
    const off = () => setIsOnline(false)
    window.addEventListener('online',  on)
    window.addEventListener('offline', off)
    return () => { window.removeEventListener('online', on); window.removeEventListener('offline', off) }
  }, [])

  useEffect(() => {
    const id = setInterval(() => setLastUpdate(new Date()), 5 * 60 * 1000)
    return () => clearInterval(id)
  }, [])

  const hhmm = lastUpdate.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })

  return (
    <footer className="flex items-center justify-between px-4 h-7 flex-shrink-0
      bg-[#030807] border-t border-[rgba(0,255,136,0.1)]">

      {/* ── KIRI: status info ── */}
      <div className="flex items-center gap-4">
        {/* Koneksi */}
        <div className="flex items-center gap-1.5">
          <div className={`w-1.5 h-1.5 rounded-full ${
            isOnline
              ? 'bg-[#00ff88] animate-pulse'
              : 'bg-[#ff3333]'
          }`}
            style={isOnline ? { boxShadow: '0 0 4px rgba(0,255,136,0.8)' } : {}}
          />
          <span className={`text-[9px] font-bold tracking-[0.12em] uppercase ${
            isOnline ? 'text-[rgba(0,255,136,0.7)]' : 'text-[#ff3333]'
          }`}>
            {isOnline ? 'ONLINE' : 'OFFLINE'}
          </span>
        </div>

        <span className="text-[rgba(0,255,136,0.15)] text-xs">|</span>

        <span className="text-[9px] tracking-[0.08em] text-[rgba(200,214,229,0.3)] uppercase">
          SYNC <span className="font-mono text-[rgba(200,214,229,0.5)]">{hhmm}</span>
        </span>

        <span className="text-[rgba(0,255,136,0.15)] text-xs">|</span>

        <span className="text-[9px] tracking-[0.08em] text-[rgba(200,214,229,0.3)] uppercase">
          DATA <span className="font-mono text-[rgba(0,255,136,0.5)]">SUPABASE</span>
        </span>

        <span className="text-[rgba(0,255,136,0.15)] text-xs">|</span>

        {/* Telemetry pills */}
        <div className="flex items-center gap-2">
          <TelePill label="SYS" value={isOnline ? 'ONLINE' : 'OFFLINE'} color={isOnline ? 'green' : 'red'} />
          <TelePill label="SYNC" value="AUTO" color="blue" />
          <TelePill label="LAST" value={hhmm} color="amber" />
        </div>
      </div>

      {/* ── KANAN: unit ── */}
      <div className="text-[8px] tracking-[0.15em] text-[rgba(200,214,229,0.18)] uppercase">
        NARASINGA - 35
      </div>
    </footer>
  )
}

function TelePill({ label, value, color }) {
  const colors = {
    green: 'text-[#00ff88] border-[rgba(0,255,136,0.25)]',
    red:   'text-[#ff3333] border-[rgba(255,51,51,0.25)]',
    blue:  'text-[#4488ff] border-[rgba(68,136,255,0.25)]',
    amber: 'text-[#ffaa00] border-[rgba(255,170,0,0.25)]',
  }
  return (
    <div className={`flex items-center gap-1 px-2 py-0.5 border rounded-sm bg-[rgba(0,0,0,0.3)] ${colors[color]}`}>
      <span className="text-[8px] tracking-[0.1em] text-[rgba(200,214,229,0.35)]">{label}</span>
      <span className="text-[9px] font-mono font-bold tracking-wider">{value}</span>
    </div>
  )
}
