export function EmptyState({ icon = '◈', title = 'Tidak ada data', description = '', action }) {
  return (
    <div className="flex flex-col items-center justify-center py-10 text-center">
      <div className="text-2xl mb-3 text-[rgba(0,255,136,0.3)]">{icon}</div>
      <h3 className="text-[rgba(200,214,229,0.5)] text-xs font-medium uppercase tracking-widest mb-1">{title}</h3>
      {description && (
        <p className="text-[rgba(200,214,229,0.3)] text-xs mb-4 max-w-xs leading-relaxed">{description}</p>
      )}
      {action && action}
    </div>
  )
}
