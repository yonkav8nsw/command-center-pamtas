/**
 * Toast — notifikasi non-blocking dengan auto-dismiss.
 * Digunakan sebagai pengganti window.alert() di seluruh project.
 *
 * Cara pakai:
 *   const { showToast } = useToast()
 *   showToast('Data berhasil disimpan', 'success')
 *   showToast('Gagal menghapus data', 'error')
 *   showToast('Perhatian: ...', 'warning')
 *   showToast('Info', 'info')
 */

import { createContext, useCallback, useContext, useRef, useState } from 'react'

// ─── Context ──────────────────────────────────────────────────────────────────

const ToastContext = createContext(null)

let _idCounter = 0

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])
  const timersRef = useRef({})

  const dismiss = useCallback((id) => {
    clearTimeout(timersRef.current[id])
    delete timersRef.current[id]
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  const showToast = useCallback((message, type = 'info', duration = 3500) => {
    const id = ++_idCounter
    setToasts(prev => [...prev, { id, message, type }])
    timersRef.current[id] = setTimeout(() => dismiss(id), duration)
    return id
  }, [dismiss])

  return (
    <ToastContext.Provider value={{ showToast, dismiss }}>
      {children}
      <ToastContainer toasts={toasts} onDismiss={dismiss} />
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast harus dipakai di dalam ToastProvider')
  return ctx
}

// ─── Styles per tipe ─────────────────────────────────────────────────────────

const TOAST_STYLES = {
  success: {
    border: 'rgba(0,255,136,0.4)',
    bg: 'rgba(0,255,136,0.08)',
    icon: '✓',
    color: '#00ff88',
  },
  error: {
    border: 'rgba(255,60,60,0.5)',
    bg: 'rgba(255,60,60,0.1)',
    icon: '✕',
    color: '#ff4444',
  },
  warning: {
    border: 'rgba(255,170,0,0.4)',
    bg: 'rgba(255,170,0,0.08)',
    icon: '⚠',
    color: '#ffaa00',
  },
  info: {
    border: 'rgba(68,136,255,0.4)',
    bg: 'rgba(68,136,255,0.08)',
    icon: 'ℹ',
    color: '#4488ff',
  },
}

// ─── Container (fixed pojok kanan bawah) ─────────────────────────────────────

function ToastContainer({ toasts, onDismiss }) {
  if (toasts.length === 0) return null
  return (
    <div
      style={{
        position: 'fixed',
        bottom: '2.5rem',
        right: '1rem',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
        pointerEvents: 'none',
      }}
    >
      {toasts.map(t => (
        <ToastItem key={t.id} toast={t} onDismiss={onDismiss} />
      ))}
    </div>
  )
}

// ─── Single Toast Item ────────────────────────────────────────────────────────

function ToastItem({ toast, onDismiss }) {
  const s = TOAST_STYLES[toast.type] || TOAST_STYLES.info

  return (
    <div
      role="alert"
      aria-live="assertive"
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: '0.5rem',
        padding: '0.6rem 0.85rem',
        borderRadius: '3px',
        background: s.bg,
        border: `1px solid ${s.border}`,
        backdropFilter: 'blur(8px)',
        maxWidth: '320px',
        pointerEvents: 'auto',
        animation: 'toast-in 0.2s ease-out',
        boxShadow: `0 4px 20px rgba(0,0,0,0.4), 0 0 0 1px ${s.border}`,
      }}
    >
      {/* Icon */}
      <span
        style={{
          color: s.color,
          fontWeight: 'bold',
          fontSize: '11px',
          lineHeight: '16px',
          flexShrink: 0,
          marginTop: '1px',
        }}
      >
        {s.icon}
      </span>

      {/* Message */}
      <span
        style={{
          color: 'rgba(200,214,229,0.9)',
          fontSize: '10px',
          lineHeight: '1.4',
          letterSpacing: '0.03em',
          flex: 1,
        }}
      >
        {toast.message}
      </span>

      {/* Close button */}
      <button
        onClick={() => onDismiss(toast.id)}
        style={{
          background: 'none',
          border: 'none',
          color: 'rgba(200,214,229,0.35)',
          cursor: 'pointer',
          fontSize: '10px',
          lineHeight: '14px',
          padding: '0 2px',
          flexShrink: 0,
        }}
        aria-label="Tutup notifikasi"
      >
        ✕
      </button>

      {/* Keyframe animation — injected once */}
      <style>{`
        @keyframes toast-in {
          from { opacity: 0; transform: translateX(20px); }
          to   { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </div>
  )
}
