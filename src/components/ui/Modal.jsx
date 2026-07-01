import { useEffect, useRef, useState, useCallback } from 'react'

/**
 * Modal Component - Feedback Component
 *
 * Design System Foundation v2.0
 * Motion Bible Compliance:
 * - Overlay: fade-in 200ms ease-out
 * - Content: scale-in 150ms ease-out
 * - Close: fade-out 150ms ease-sharp
 *
 * Features:
 * - Focus trap (WCAG 2.1 criterion 2.1.2)
 * - ESC to close
 * - Click outside to close
 * - Multiple sizes
 * - Full ARIA support
 * - Flexbox layout for proper scroll
 */

const SIZE_MAP = {
  sm: 'max-w-sm',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
  full: 'max-w-[calc(100vw-2rem)]',
}

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  closeOnOverlay = true,
  closeOnEscape = true,
  showClose = true,
  footer,
  className = '',
}) {
  // isOpen is the SINGLE source of truth for rendering
  // Exit animation is triggered when isOpen becomes false
  const [isExiting, setIsExiting] = useState(false)
  const overlayRef = useRef(null)
  const contentRef = useRef(null)
  const previousFocusRef = useRef(null)

  // Handle open/close transitions
  useEffect(() => {
    if (isOpen) {
      // Modal is opening
      previousFocusRef.current = document.activeElement
      document.body.style.overflow = 'hidden'
      setIsExiting(false)
    } else {
      // Modal is closing - trigger exit animation
      if (isExiting) {
        // Already in exit animation, wait for it to complete
      } else {
        // Start exit animation
        setIsExiting(true)
      }
    }
  }, [isOpen])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  // Handle escape key and focus trap
  useEffect(() => {
    if (!isOpen || isExiting) return

    const handleKeyDown = (e) => {
      // ESC to close
      if (e.key === 'Escape' && closeOnEscape) {
        onClose?.()
        return
      }

      // Focus trap
      if (e.key !== 'Tab' || !contentRef.current) return

      const focusable = contentRef.current.querySelectorAll(
        'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
      )
      if (focusable.length === 0) return

      const first = focusable[0]
      const last = focusable[focusable.length - 1]

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    // Focus first focusable element
    const timer = setTimeout(() => {
      const focusable = contentRef.current?.querySelector(
        'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])'
      )
      focusable?.focus()
    }, 50)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      clearTimeout(timer)
      previousFocusRef.current?.focus?.()
    }
  }, [isOpen, isExiting, closeOnEscape, onClose])

  // Cleanup when animation completes
  useEffect(() => {
    if (isExiting && !isOpen) {
      // Exit animation complete, unmount
      const timer = setTimeout(() => {
        document.body.style.overflow = ''
        previousFocusRef.current?.focus?.()
      }, 150)
      return () => clearTimeout(timer)
    }
  }, [isExiting, isOpen])

  const handleOverlayClick = (e) => {
    if (closeOnOverlay && e.target === overlayRef.current) {
      onClose?.()
    }
  }

  // Don't render if not open and not in exit animation
  if (!isOpen && !isExiting) return null

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      className={`
        fixed inset-0 z-[var(--z-modal)] flex items-center justify-center p-4
        transition-opacity duration-200
        ${isExiting ? 'opacity-0' : 'opacity-100'}
      `}
      style={{
        backgroundColor: 'var(--overlay-scrim)',
        backdropFilter: 'blur(4px)',
        transitionTimingFunction: isExiting ? 'var(--ease-sharp)' : 'var(--ease-out)',
      }}
      aria-modal="true"
      role="dialog"
      aria-labelledby={title ? 'modal-title' : undefined}
    >
      {/* Flex container for proper scroll layout */}
      <div
        ref={contentRef}
        tabIndex={-1}
        className={`
          ${SIZE_MAP[size] || SIZE_MAP.md}
          w-full
          h-full max-h-[calc(100vh-2rem)]
          rounded-sm
          flex flex-col
          transition-all duration-150
          ${isExiting ? 'scale-95 opacity-0' : 'scale-100 opacity-100'}
          ${className}
        `}
        style={{
          backgroundColor: 'var(--surface-tertiary)',
          border: '1px solid var(--border-default)',
          boxShadow: 'var(--shadow-xl)',
          transitionTimingFunction: isExiting ? 'var(--ease-sharp)' : 'var(--ease-out)',
        }}
      >
        {/* Header - Fixed height, won't shrink */}
        <div
          className="flex-shrink-0 flex items-center justify-between px-4 py-3"
          style={{
            borderBottom: '1px solid var(--border-subtle)',
            backgroundColor: 'var(--accent-muted)',
          }}
        >
          <h2
            id="modal-title"
            className="text-label-sm font-bold tracking-wider uppercase"
            style={{ color: 'var(--accent-primary)' }}
          >
            {title}
          </h2>
          {showClose && (
            <button
              onClick={onClose}
              aria-label="Tutup modal"
              className="p-1.5 rounded-sm transition-colors duration-100"
              style={{ color: 'var(--text-tertiary)' }}
              onMouseEnter={(e) => e.currentTarget.style.color = 'var(--accent-primary)'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-tertiary)'}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Content - Flexible height, scrollable */}
        <div
          className="flex-1 min-h-0 overflow-y-auto px-4 py-4"
        >
          {children}
        </div>

        {/* Footer - Fixed height, won't shrink */}
        {footer && (
          <div
            className="flex-shrink-0 flex items-center justify-end gap-2 px-4 py-3"
            style={{ borderTop: '1px solid var(--border-subtle)' }}
          >
            {footer}
          </div>
        )}
      </div>
    </div>
  )
}

/**
 * ModalFooter - Helper component for modal footer actions
 */
export function ModalFooter({ children, className = '' }) {
  return (
    <div className={`flex items-center justify-end gap-2 ${className}`}>
      {children}
    </div>
  )
}

export default Modal
