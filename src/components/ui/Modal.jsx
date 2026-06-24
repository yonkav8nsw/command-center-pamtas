import { useEffect, useRef } from 'react'

/**
 * Modal dengan focus trap (WCAG 2.1 criterion 2.1.2).
 * Tab cycling terbatas di dalam elemen modal saat terbuka.
 */
export function Modal({ isOpen, onClose, title, children, size = 'md' }) {
  const overlayRef  = useRef(null)
  const contentRef  = useRef(null)

  useEffect(() => {
    if (!isOpen) return

    // Simpan elemen yang sedang aktif sebelum modal dibuka
    const previouslyFocused = document.activeElement

    // Focus ke container modal segera
    const focusTimer = setTimeout(() => {
      contentRef.current?.focus()
    }, 50)

    // ESC untuk tutup
    const onKey = (e) => {
      if (e.key === 'Escape') { onClose(); return }

      // Focus trap: Tab cycling di dalam modal
      if (e.key !== 'Tab') return
      if (!contentRef.current) return

      const focusable = contentRef.current.querySelectorAll(
        'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
      )
      if (focusable.length === 0) { e.preventDefault(); return }

      const first = focusable[0]
      const last  = focusable[focusable.length - 1]

      if (e.shiftKey) {
        // Shift+Tab: dari elemen pertama → loncat ke elemen terakhir
        if (document.activeElement === first) {
          e.preventDefault()
          last.focus()
        }
      } else {
        // Tab: dari elemen terakhir → loncat ke elemen pertama
        if (document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }

    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'

    return () => {
      clearTimeout(focusTimer)
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
      // Kembalikan focus ke elemen sebelum modal dibuka
      previouslyFocused?.focus?.()
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  const maxW = { sm: 'max-w-md', md: 'max-w-lg', lg: 'max-w-2xl', xl: 'max-w-4xl' }

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(2px)' }}
      onClick={(e) => { if (e.target === overlayRef.current) onClose() }}
      aria-modal="true"
      role="dialog"
      aria-labelledby="modal-title"
    >
      <div
        ref={contentRef}
        tabIndex={-1}
        className={`${maxW[size]} w-full fade-in outline-none`}
        style={{
          background: 'rgba(4,11,6,0.98)',
          border: '1px solid rgba(0,255,136,0.22)',
          borderRadius: '2px',
          boxShadow: '0 0 40px rgba(0,0,0,0.8), 0 0 20px rgba(0,255,136,0.07)',
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3"
          style={{ borderBottom: '1px solid rgba(0,255,136,0.12)', background: 'rgba(0,255,136,0.03)' }}>
          <h2 id="modal-title" className="text-[11px] font-bold tracking-[0.15em] uppercase text-[rgba(0,255,136,0.85)]">
            {title}
          </h2>
          <button
            onClick={onClose}
            aria-label="Tutup modal"
            className="text-[rgba(200,214,229,0.3)] hover:text-[rgba(0,255,136,0.7)] transition-colors p-1 rounded-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="px-4 py-4 max-h-[80vh] overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  )
}
