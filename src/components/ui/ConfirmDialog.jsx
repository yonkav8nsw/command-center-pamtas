import { createContext, useCallback, useContext, useRef, useState, useEffect } from 'react'

/**
 * ConfirmDialog — Confirmation dialog with promise-based API
 *
 * Design System Foundation v2.0
 * Motion Bible Compliance:
 * - Enter: scale-in 150ms ease-out
 * - Overlay: fade-in 200ms ease-out
 * - Exit: fade-out 150ms ease-sharp
 *
 * Features:
 * - Promise-based API
 * - 3 types: danger, warning, default
 * - ESC to cancel, Enter to confirm
 * - Focus management
 * - Full ARIA support
 */

// Context
const ConfirmContext = createContext(null)

export function ConfirmProvider({ children }) {
  const [dialog, setDialog] = useState(null) // { message, type, title, resolve }
  const resolveRef = useRef(null)

  const confirm = useCallback((message, options = {}) => {
    const { title, type = 'default', cancelLabel = 'Batal', confirmLabel } = options
    return new Promise((resolve) => {
      resolveRef.current = resolve
      setDialog({ message, title, type, cancelLabel, confirmLabel })
    })
  }, [])

  const handleResolve = (value) => {
    resolveRef.current?.(value)
    resolveRef.current = null
    setDialog(null)
  }

  return (
    <ConfirmContext.Provider value={{ confirm }}>
      {children}
      {dialog && (
        <ConfirmDialogUI
          dialog={dialog}
          onConfirm={() => handleResolve(true)}
          onCancel={() => handleResolve(false)}
        />
      )}
    </ConfirmContext.Provider>
  )
}

export function useConfirm() {
  const ctx = useContext(ConfirmContext)
  if (!ctx) throw new Error('useConfirm harus dipakai di dalam ConfirmProvider')
  return ctx
}

// Dialog styles per type
const TYPE_STYLES = {
  danger: {
    accent: 'var(--color-danger)',
    bg: 'var(--color-danger-subtle)',
    confirmLabel: 'Hapus',
    icon: 'danger',
  },
  warning: {
    accent: 'var(--color-warning)',
    bg: 'var(--color-warning-subtle)',
    confirmLabel: 'Lanjutkan',
    icon: 'warning',
  },
  default: {
    accent: 'var(--accent-primary)',
    bg: 'var(--accent-muted)',
    confirmLabel: 'Konfirmasi',
    icon: 'question',
  },
}

// Icons
const Icons = {
  danger: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
  ),
  warning: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
  ),
  question: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 3 1.343-1 3-1.343-1-3-1.343-2.21 0-3.772-2-3.772-2M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2z" />
    </svg>
  ),
}

// Dialog UI
function ConfirmDialogUI({ dialog, onConfirm, onCancel }) {
  const [isExiting, setIsExiting] = useState(false)
  const contentRef = useRef(null)
  const cancelButtonRef = useRef(null)

  const s = TYPE_STYLES[dialog.type] || TYPE_STYLES.default

  // Handle keyboard
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') {
        handleCancel()
      }
      if (e.key === 'Enter' && dialog.type !== 'danger') {
        // Don't auto-confirm on Enter for dangerous actions
        handleConfirm()
      }
    }

    document.addEventListener('keydown', handleKey)
    // Focus cancel button by default for safety
    setTimeout(() => cancelButtonRef.current?.focus(), 50)

    return () => document.removeEventListener('keydown', handleKey)
  }, [])

  const handleCancel = () => {
    setIsExiting(true)
    setTimeout(onCancel, 150)
  }

  const handleConfirm = () => {
    setIsExiting(true)
    setTimeout(onConfirm, 150)
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-title"
      className={`
        fixed inset-0 z-[calc(var(--z-modal)+1)] flex items-center justify-center
        transition-opacity duration-150
        ${isExiting ? 'opacity-0 pointer-events-none' : 'opacity-100'}
      `}
      style={{
        backgroundColor: 'var(--overlay-scrim)',
        backdropFilter: 'blur(4px)',
        transitionTimingFunction: isExiting ? 'var(--ease-sharp)' : 'var(--ease-out)',
      }}
      onClick={(e) => { if (e.target === e.currentTarget) handleCancel() }}
    >
      <div
        ref={contentRef}
        className={`
          w-full max-w-sm mx-4 p-5 rounded-sm
          transition-all duration-150
          ${isExiting ? 'scale-95 opacity-0' : 'scale-100 opacity-100 animate-scale-in'}
        `}
        style={{
          backgroundColor: 'var(--surface-tertiary)',
          border: `1px solid ${s.accent}`,
          boxShadow: 'var(--shadow-xl)',
          transitionTimingFunction: isExiting ? 'var(--ease-sharp)' : 'var(--ease-out)',
        }}
      >
        {/* Header */}
        <div
          className="flex items-center gap-3 mb-4"
          style={{ color: s.accent }}
        >
          <span className="flex-shrink-0">{Icons[s.icon]}</span>
          <h3
            id="confirm-title"
            className="text-label-sm font-bold tracking-wider uppercase"
          >
            {dialog.title || 'Konfirmasi'}
          </h3>
        </div>

        {/* Message */}
        <p
          className="text-body-sm leading-relaxed mb-5"
          style={{ color: 'var(--text-secondary)' }}
        >
          {dialog.message}
        </p>

        {/* Actions */}
        <div className="flex items-center justify-end gap-2">
          <button
            ref={cancelButtonRef}
            onClick={handleCancel}
            className="px-4 py-2 rounded-sm text-label-sm font-semibold uppercase tracking-wider transition-all duration-100"
            style={{
              backgroundColor: 'var(--surface-secondary)',
              border: '1px solid var(--border-default)',
              color: 'var(--text-secondary)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--surface-tertiary)'
              e.currentTarget.style.borderColor = 'var(--border-strong)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--surface-secondary)'
              e.currentTarget.style.borderColor = 'var(--border-default)'
            }}
          >
            {dialog.cancelLabel}
          </button>

          <button
            onClick={handleConfirm}
            className="px-4 py-2 rounded-sm text-label-sm font-semibold uppercase tracking-wider transition-all duration-100"
            style={{
              backgroundColor: s.bg,
              border: `1px solid ${s.accent}`,
              color: s.accent,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = '0.9'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = '1'
            }}
          >
            {dialog.confirmLabel || s.confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmProvider