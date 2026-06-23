/**
 * ConfirmDialog — pengganti window.confirm() yang proper.
 * Non-blocking, stylish sesuai tema militer, bisa di-test.
 *
 * Cara pakai:
 *   const { confirm } = useConfirm()
 *   const ok = await confirm('Hapus tokoh ini?', { type: 'danger' })
 *   if (ok) { ... lakukan aksi ... }
 */

import { createContext, useCallback, useContext, useRef, useState } from 'react'

// ─── Context ──────────────────────────────────────────────────────────────────

const ConfirmContext = createContext(null)

export function ConfirmProvider({ children }) {
  const [dialog, setDialog] = useState(null) // { message, type, title, resolve }
  const resolveRef = useRef(null)

  const confirm = useCallback((message, { title, type = 'default' } = {}) => {
    return new Promise((resolve) => {
      resolveRef.current = resolve
      setDialog({ message, title, type })
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

// ─── Styles per tipe ─────────────────────────────────────────────────────────

const TYPE_STYLES = {
  danger: {
    accent: '#ff4444',
    confirmLabel: 'Hapus',
    confirmBg: 'rgba(255,60,60,0.15)',
    confirmBorder: 'rgba(255,60,60,0.5)',
    icon: '⚠',
  },
  warning: {
    accent: '#ffaa00',
    confirmLabel: 'Lanjutkan',
    confirmBg: 'rgba(255,170,0,0.12)',
    confirmBorder: 'rgba(255,170,0,0.45)',
    icon: '⚠',
  },
  default: {
    accent: '#00ff88',
    confirmLabel: 'Konfirmasi',
    confirmBg: 'rgba(0,255,136,0.1)',
    confirmBorder: 'rgba(0,255,136,0.4)',
    icon: '?',
  },
}

// ─── Dialog UI ────────────────────────────────────────────────────────────────

function ConfirmDialogUI({ dialog, onConfirm, onCancel }) {
  const s = TYPE_STYLES[dialog.type] || TYPE_STYLES.default

  // Tutup dengan ESC
  const handleKey = (e) => {
    if (e.key === 'Escape') onCancel()
    if (e.key === 'Enter') onConfirm()
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-title"
      onKeyDown={handleKey}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 10000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(5,8,16,0.75)',
        backdropFilter: 'blur(4px)',
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onCancel() }}
    >
      <div
        style={{
          background: 'rgba(10,14,26,0.97)',
          border: `1px solid ${s.accent}44`,
          borderRadius: '4px',
          padding: '1.5rem',
          maxWidth: '340px',
          width: '90%',
          boxShadow: `0 0 40px rgba(0,0,0,0.6), 0 0 0 1px ${s.accent}22`,
          animation: 'confirm-in 0.15s ease-out',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
          <span style={{ color: s.accent, fontSize: '16px' }}>{s.icon}</span>
          <span
            id="confirm-title"
            style={{
              color: s.accent,
              fontSize: '10px',
              fontWeight: 'bold',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              textShadow: `0 0 8px ${s.accent}66`,
            }}
          >
            {dialog.title || 'Konfirmasi'}
          </span>
        </div>

        {/* Message */}
        <p
          style={{
            color: 'rgba(200,214,229,0.8)',
            fontSize: '11px',
            lineHeight: '1.6',
            marginBottom: '1.25rem',
          }}
        >
          {dialog.message}
        </p>

        {/* Buttons */}
        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
          <button
            onClick={onCancel}
            autoFocus
            style={{
              padding: '0.4rem 0.9rem',
              fontSize: '9px',
              fontWeight: 'bold',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '3px',
              color: 'rgba(200,214,229,0.55)',
              cursor: 'pointer',
            }}
          >
            Batal
          </button>
          <button
            onClick={onConfirm}
            style={{
              padding: '0.4rem 0.9rem',
              fontSize: '9px',
              fontWeight: 'bold',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              background: s.confirmBg,
              border: `1px solid ${s.confirmBorder}`,
              borderRadius: '3px',
              color: s.accent,
              cursor: 'pointer',
              textShadow: `0 0 6px ${s.accent}55`,
            }}
          >
            {s.confirmLabel}
          </button>
        </div>
      </div>

      <style>{`
        @keyframes confirm-in {
          from { opacity: 0; transform: scale(0.95); }
          to   { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  )
}
