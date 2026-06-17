export function LoadingSpinner({ size = 'md', text = 'Memuat data...' }) {
  const sz = { sm: 'w-4 h-4', md: 'w-7 h-7', lg: 'w-10 h-10' }
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-8">
      <div
        className={`${sz[size]} rounded-full animate-spin`}
        style={{
          border: '2px solid rgba(0,255,136,0.1)',
          borderTopColor: '#00ff88',
          boxShadow: '0 0 8px rgba(0,255,136,0.3)',
        }}
      />
      {text && (
        <p className="text-[9px] tracking-[0.2em] uppercase text-[rgba(0,255,136,0.4)]">{text}</p>
      )}
    </div>
  )
}

export function SkeletonRow({ cols = 4 }) {
  return (
    <tr className="animate-pulse">
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="px-4 py-3">
          <div className="h-3 rounded-sm bg-[rgba(0,255,136,0.06)] w-full" />
        </td>
      ))}
    </tr>
  )
}

export function SkeletonCard() {
  return (
    <div className="hud-panel p-4 animate-pulse space-y-3">
      <div className="h-3 rounded-sm bg-[rgba(0,255,136,0.06)] w-3/4" />
      <div className="h-7 rounded-sm bg-[rgba(0,255,136,0.06)] w-1/2" />
      <div className="h-2 rounded-sm bg-[rgba(0,255,136,0.04)] w-full" />
    </div>
  )
}
