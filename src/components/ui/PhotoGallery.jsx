import { driveToThumbnail, driveToDirectUrl, isDriveUrl } from '../../utils/driveUrl'

/**
 * Galeri foto dari Google Drive — mendukung array URL string atau array {url, caption}
 */
export function PhotoGallery({ urls = [], photos = [] }) {
  // Normalise: terima baik array string (urls) maupun array objek (photos)
  const items = [
    ...urls.map(u => (typeof u === 'string' ? { url: u, caption: '' } : u)),
    ...photos.map(p => (typeof p === 'string' ? { url: p, caption: '' } : p)),
  ].filter(p => p?.url)

  if (items.length === 0) return null

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
      {items.map((item, i) => (
        <PhotoItem key={i} item={item} />
      ))}
    </div>
  )
}

function PhotoItem({ item }) {
  const thumbUrl = isDriveUrl(item.url) ? driveToThumbnail(item.url, 400) : item.url
  const fullUrl  = isDriveUrl(item.url) ? driveToDirectUrl(item.url)      : item.url

  return (
    <a
      href={fullUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="block relative overflow-hidden rounded-sm group transition-all"
      style={{
        background: 'rgba(0,255,136,0.03)',
        border: '1px solid rgba(0,255,136,0.15)',
        aspectRatio: '16/9',
      }}
    >
      {/* Corner brackets */}
      <span className="absolute top-0 left-0 w-3 h-3 z-10 pointer-events-none"
        style={{ borderTop: '1px solid rgba(0,255,136,0.5)', borderLeft: '1px solid rgba(0,255,136,0.5)' }} />
      <span className="absolute bottom-0 right-0 w-3 h-3 z-10 pointer-events-none"
        style={{ borderBottom: '1px solid rgba(0,255,136,0.5)', borderRight: '1px solid rgba(0,255,136,0.5)' }} />

      <img
        src={thumbUrl}
        alt={item.caption || 'Foto dokumentasi'}
        className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
        onError={e => { e.target.parentElement.style.display = 'none' }}
      />

      {/* Hover overlay */}
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
        style={{ background: 'rgba(0,255,136,0.08)' }}>
        <span className="text-[rgba(0,255,136,0.8)] text-xs tracking-widest uppercase font-bold">
          Buka →
        </span>
      </div>

      {item.caption && (
        <div className="absolute bottom-0 left-0 right-0 px-2 py-1 text-[9px] truncate"
          style={{ background: 'rgba(4,11,6,0.85)', color: 'rgba(200,214,229,0.6)' }}>
          {item.caption}
        </div>
      )}
    </a>
  )
}
