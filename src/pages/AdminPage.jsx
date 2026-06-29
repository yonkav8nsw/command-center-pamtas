import { useState, useEffect, useCallback, useId } from 'react'
import { usePos } from '../hooks/useSupabase'
import { useAuth } from '../context/AuthContext'
import { LoadingSpinner, Modal, Button, useToast, useConfirm } from '../components/ui'
import { exportToCSV } from '../utils/exportPDF'
import { supabase } from '../lib/supabase'
import { userManagementService } from '../services/userManagement.service'

// POS_OPTIONS will be derived from posList dynamically
const DEFAULT_POS_OPTIONS = [
  'KT','AJ','TA','BB','BK','GSG','KD','SU','SK','TB','SL','SMB','SML','LB','GSL','ML','LMS'
]

// Role color configuration using CSS tokens
const ROLE_STYLES = {
  admin: {
    color: 'var(--color-warning)',
    bg: 'var(--color-warning-subtle)',
    border: 'var(--color-warning)',
  },
  operator: {
    color: 'var(--color-info)',
    bg: 'var(--color-info-subtle)',
    border: 'var(--color-info)',
  },
  viewer: {
    color: 'var(--text-tertiary)',
    bg: 'var(--surface-muted)',
    border: 'var(--border-default)',
  },
}

function RoleBadge({ role }) {
  const style = ROLE_STYLES[role] || ROLE_STYLES.viewer
  return (
    <span
      className="text-[8px] px-1.5 py-0.5 rounded-sm uppercase tracking-wider font-bold flex-shrink-0 transition-all duration-150"
      style={{
        color: style.color,
        background: style.bg,
        border: `1px solid ${style.border}`,
      }}
    >
      {role}
    </span>
  )
}

// ── User Form ──────────────────────────────────────────────────────────────
function UserForm({ initialData, posList, onSave, onCancel }) {
  const isEdit = !!initialData
  const formId = useId()

  // Derive POS options from posList or fall back to defaults
  const posOptions = posList?.length
    ? [...new Set(posList.map(p => p.pos_id))].sort()
    : DEFAULT_POS_OPTIONS

  const [form, setForm] = useState({
    email:    initialData?.email    || '',
    password: '',
    nama:     initialData?.nama     || '',
    role:     initialData?.role     || 'viewer',
    pos_id:   initialData?.pos_id   || '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})

  // Reset form when initialData changes (modal opens/closes)
  useEffect(() => {
    setForm({
      email:    initialData?.email    || '',
      password: '',
      nama:     initialData?.nama     || '',
      role:     initialData?.role     || 'viewer',
      pos_id:   initialData?.pos_id   || '',
    })
    setErrors({})
    setTouched({})
    setSubmitting(false)
  }, [initialData])

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  // Validation rules
  const validate = () => {
    const newErrors = {}
    if (!isEdit) {
      if (!form.email) newErrors.email = 'Email wajib diisi'
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) newErrors.email = 'Format email tidak valid'
      if (!form.password) newErrors.password = 'Password wajib diisi'
      else if (form.password.length < 8) newErrors.password = 'Minimal 8 karakter'
    } else if (form.password && form.password.length < 8) {
      newErrors.password = 'Minimal 8 karakter'
    }
    if (!form.nama) newErrors.nama = 'Nama wajib diisi'
    if (form.role === 'operator' && !form.pos_id) {
      newErrors.pos_id = 'Operator harus memiliki Pos'
    }
    return newErrors
  }

  const handleBlur = (field) => {
    setTouched(t => ({ ...t, [field]: true }))
    const newErrors = validate()
    setErrors(newErrors)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    // Mark all fields as touched
    setTouched({ email: true, password: true, nama: true, pos_id: true })

    const newErrors = validate()
    setErrors(newErrors)

    if (Object.keys(newErrors).length > 0) return

    setSubmitting(true)
    try {
      await onSave(form)
    } catch (err) {
      setErrors({ submit: err.message })
    } finally {
      setSubmitting(false)
    }
  }

  // CSS token based form styles
  const inputBase = {
    width: '100%',
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '11px',
    padding: '6px 10px',
    borderRadius: 'var(--radius-sm)',
    outline: 'none',
    transition: 'all var(--duration-fast) var(--ease-out)',
  }

  const getBorderColor = (fieldName) => {
    if (touched[fieldName] && errors[fieldName]) {
      return 'var(--border-danger)'
    }
    return 'var(--border-subtle)'
  }

  const labelStyle = {
    display: 'block',
    marginBottom: '4px',
    fontSize: '9px',
    fontWeight: 600,
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    color: 'var(--text-tertiary)',
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 animate-fade-in" aria-labelledby={`${formId}-title`}>
      {/* ARIA Live Region for form errors */}
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {errors.submit && <span role="alert">{errors.submit}</span>}
      </div>

      {/* Email & Password (Create mode only) */}
      {!isEdit && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label htmlFor={`${formId}-email`} style={labelStyle}>Email</label>
            <input
              id={`${formId}-email`}
              type="email"
              style={{
                ...inputBase,
                background: 'var(--surface-interactive)',
                border: `1px solid ${getBorderColor('email')}`,
                color: 'var(--text-primary)',
              }}
              value={form.email}
              name="email"
              onChange={e => set('email', e.target.value)}
              onBlur={() => handleBlur('email')}
              placeholder="user@satgas.mil"
              autoComplete="email"
              aria-required="true"
              aria-invalid={touched.email && !!errors.email}
              aria-describedby={touched.email && errors.email ? `${formId}-email-error` : undefined}
            />
            {touched.email && errors.email && (
              <span id={`${formId}-email-error`} className="text-[10px] mt-1 block" style={{ color: 'var(--color-danger)' }} role="alert">
                {errors.email}
              </span>
            )}
          </div>
          <div>
            <label htmlFor={`${formId}-password`} style={labelStyle}>Password</label>
            <input
              id={`${formId}-password`}
              type="password"
              style={{
                ...inputBase,
                background: 'var(--surface-interactive)',
                border: `1px solid ${getBorderColor('password')}`,
                color: 'var(--text-primary)',
              }}
              value={form.password}
              name="password"
              onChange={e => set('password', e.target.value)}
              onBlur={() => handleBlur('password')}
              placeholder="Min. 8 karakter"
              autoComplete="new-password"
              aria-required="true"
              aria-invalid={touched.password && !!errors.password}
              aria-describedby={touched.password && errors.password ? `${formId}-password-error` : undefined}
            />
            {touched.password && errors.password && (
              <span id={`${formId}-password-error`} className="text-[10px] mt-1 block" style={{ color: 'var(--color-danger)' }} role="alert">
                {errors.password}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Password field (Edit mode) */}
      {isEdit && (
        <div>
          <label htmlFor={`${formId}-password-edit`} style={labelStyle}>
            Password Baru <span style={{ color: 'var(--text-disabled)' }}>(kosongkan jika tidak diubah)</span>
          </label>
          <input
            id={`${formId}-password-edit`}
            type="password"
            style={{
              ...inputBase,
              background: 'var(--surface-interactive)',
              border: `1px solid ${getBorderColor('password')}`,
              color: 'var(--text-primary)',
            }}
            value={form.password}
            name="password"
            onChange={e => set('password', e.target.value)}
            onBlur={() => handleBlur('password')}
            placeholder="Kosongkan jika tidak diubah"
            autoComplete="new-password"
            aria-describedby={touched.password && errors.password ? `${formId}-password-edit-error` : undefined}
          />
          {touched.password && errors.password && (
            <span id={`${formId}-password-edit-error`} className="text-[10px] mt-1 block" style={{ color: 'var(--color-danger)' }} role="alert">
              {errors.password}
            </span>
          )}
        </div>
      )}

      {/* Nama Lengkap */}
      <div>
        <label htmlFor={`${formId}-nama`} style={labelStyle}>Nama Lengkap</label>
        <input
          id={`${formId}-nama`}
          type="text"
          style={{
            ...inputBase,
            background: 'var(--surface-interactive)',
            border: `1px solid ${getBorderColor('nama')}`,
            color: 'var(--text-primary)',
          }}
          value={form.nama}
          name="nama"
          onChange={e => set('nama', e.target.value)}
          onBlur={() => handleBlur('nama')}
          placeholder="Nama operator / admin"
          aria-required="true"
          aria-invalid={touched.nama && !!errors.nama}
          aria-describedby={touched.nama && errors.nama ? `${formId}-nama-error` : undefined}
        />
        {touched.nama && errors.nama && (
          <span id={`${formId}-nama-error`} className="text-[10px] mt-1 block" style={{ color: 'var(--color-danger)' }} role="alert">
            {errors.nama}
          </span>
        )}
      </div>

      {/* Role & Pos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label htmlFor={`${formId}-role`} style={labelStyle}>Role</label>
          <select
            id={`${formId}-role`}
            style={{
              ...inputBase,
              background: 'var(--surface-interactive)',
              border: `1px solid var(--border-subtle)`,
              color: 'var(--text-primary)',
              cursor: 'pointer',
            }}
            value={form.role}
            onChange={e => set('role', e.target.value)}
          >
            <option value="viewer">Viewer — baca saja</option>
            <option value="operator">Operator — kelola pos sendiri</option>
            <option value="admin">Admin — akses penuh</option>
          </select>
        </div>
        <div>
          <label htmlFor={`${formId}-pos`} style={labelStyle}>
            Pos <span style={{ color: 'var(--text-disabled)' }}>{form.role === 'operator' ? '(wajib)' : '(opsional)'}</span>
          </label>
          <select
            id={`${formId}-pos`}
            style={{
              ...inputBase,
              background: 'var(--surface-interactive)',
              border: `1px solid ${getBorderColor('pos_id')}`,
              color: 'var(--text-primary)',
              cursor: 'pointer',
            }}
            value={form.pos_id}
            onChange={e => set('pos_id', e.target.value)}
            onBlur={() => handleBlur('pos_id')}
            aria-required={form.role === 'operator'}
            aria-invalid={touched.pos_id && !!errors.pos_id}
            aria-describedby={touched.pos_id && errors.pos_id ? `${formId}-pos-error` : undefined}
          >
            <option value="">— Tidak ada —</option>
            {posOptions.map(p => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
          {touched.pos_id && errors.pos_id && (
            <span id={`${formId}-pos-error`} className="text-[10px] mt-1 block" style={{ color: 'var(--color-danger)' }} role="alert">
              {errors.pos_id}
            </span>
          )}
        </div>
      </div>

      {/* Submit error */}
      {errors.submit && (
        <div
          role="alert"
          className="px-3 py-2 rounded-sm text-[10px] animate-fade-in"
          style={{
            background: 'var(--color-danger-subtle)',
            border: '1px solid var(--color-danger)',
            color: 'var(--color-danger)',
          }}
        >
          ⚠ {errors.submit}
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2 justify-end pt-2" style={{ borderTop: '1px solid var(--border-subtle)' }}>
        <Button
          type="button"
          variant="ghost"
          size="md"
          onClick={onCancel}
          disabled={submitting}
        >
          Batal
        </Button>
        <Button
          type="submit"
          variant="primary"
          size="md"
          loading={submitting}
        >
          {isEdit ? 'Simpan Perubahan' : 'Buat User'}
        </Button>
      </div>
    </form>
  )
}

// ── Skeleton Loader for Tables ──────────────────────────────────────────────
function TableSkeleton({ rows = 5, cols = 6 }) {
  return (
    <div className="p-4 space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-4 animate-pulse">
          {Array.from({ length: cols }).map((_, j) => (
            <div
              key={j}
              className="h-4 rounded-sm"
              style={{
                width: `${60 + (j * 17) % 80}px`,
                background: 'var(--accent-muted)',
              }}
            />
          ))}
        </div>
      ))}
    </div>
  )
}

// ── Permission Denied State ─────────────────────────────────────────────────
function PermissionDenied() {
  return (
    <div
      className="flex flex-col items-center justify-center py-16 px-8 text-center animate-fade-in"
      style={{
        background: 'var(--surface-primary)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-md)',
      }}
    >
      <div
        className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
        style={{ background: 'var(--color-warning-subtle)' }}
      >
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"
          style={{ color: 'var(--color-warning)' }}>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>
      <h3
        className="text-sm font-bold uppercase tracking-widest mb-2"
        style={{ color: 'var(--color-warning)' }}
      >
        Akses Terbatas
      </h3>
      <p className="text-[11px] max-w-sm leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>
        Fitur manajemen user hanya tersedia untuk pengguna dengan role <strong style={{ color: 'var(--color-warning)' }}>Admin</strong>.
        Hubungi administrator sistem untuk mendapatkan akses.
      </p>
    </div>
  )
}

// ── Main Component ─────────────────────────────────────────────────────────
export default function AdminPage() {
  const { data: posList, loading: posLoading } = usePos()
  const { profile } = useAuth()
  const { showToast } = useToast()
  const { confirm } = useConfirm()

  const [copied, setCopied]       = useState(false)
  const [users, setUsers]         = useState([])
  const [usersLoading, setUsersLoading] = useState(false)
  const [usersError, setUsersError]     = useState(null)
  const [showForm, setShowForm]   = useState(false)
  const [editUser, setEditUser]   = useState(null)
  const [deletingUserId, setDeletingUserId] = useState(null)

  const supabaseUrl  = import.meta.env.VITE_SUPABASE_URL || ''
  const isConfigured = !!supabaseUrl && !supabaseUrl.includes('your-project')
  const isAdmin      = profile?.role === 'admin'

  // Load users (admin only)
  const loadUsers = useCallback(async () => {
    if (!isAdmin) return
    setUsersLoading(true)
    setUsersError(null)
    try {
      const res = await userManagementService.listUsers()
      setUsers(res.users || [])
    } catch (err) {
      setUsersError(err.message)
    } finally {
      setUsersLoading(false)
    }
  }, [isAdmin])

  useEffect(() => { loadUsers() }, [loadUsers])

  const handleCopyUrl = () => {
    if (supabaseUrl && isConfigured) {
      navigator.clipboard.writeText(supabaseUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleExportPos = () => {
    if (!posList?.length) return
    exportToCSV(
      posList,
      ['pos_id', 'nama_pos', 'lokasi_desa', 'kabupaten', 'lat', 'lng', 'komandan_pos', 'jumlah_personel'],
      'data-pos-satgas'
    )
  }

  const handleCreateUser = async (form) => {
    await userManagementService.createUser(form)
    showToast(`User "${form.nama}" berhasil dibuat`, 'success')
    setShowForm(false)
    loadUsers()
  }

  const handleUpdateUser = async (form) => {
    const payload = { user_id: editUser.id, nama: form.nama, role: form.role, pos_id: form.pos_id || null }
    if (form.password) payload.password = form.password
    await userManagementService.updateUser(payload)
    showToast(`User "${form.nama}" berhasil diperbarui`, 'success')
    setEditUser(null)
    loadUsers()
  }

  const handleDeleteUser = async (user) => {
    const ok = await confirm(
      `Hapus user "${user.nama || user.email}"? Akun tidak dapat dipulihkan.`,
      { title: 'Hapus User', type: 'danger' }
    )
    if (!ok) return
    setDeletingUserId(user.id)
    try {
      await userManagementService.deleteUser(user.id)
      showToast(`User "${user.nama || user.email}" berhasil dihapus`, 'success')
      loadUsers()
    } catch (err) {
      showToast('Gagal menghapus: ' + err.message, 'error')
    } finally {
      setDeletingUserId(null)
    }
  }

  const formatDate = (iso) => {
    if (!iso) return '—'
    return new Date(iso).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })
  }

  return (
    <div className="p-4 space-y-4 animate-fade-in max-w-5xl mx-auto">

      {/* ── Header ─────────────────────────────────────────── */}
      <div>
        <h2
          className="font-bold text-sm uppercase tracking-widest mb-1"
          style={{ color: 'var(--text-secondary)' }}
        >
          ⚙ Pengaturan Sistem
        </h2>
        <p className="text-[10px]" style={{ color: 'var(--text-tertiary)' }}>
          Konfigurasi koneksi, manajemen user, dan informasi sistem
        </p>
      </div>

      {/* ── Manajemen User (admin only) ─────────────────────── */}
      {isAdmin ? (
        <div
          className="rounded-sm overflow-hidden animate-scale-in"
          style={{
            background: 'var(--surface-primary)',
            border: '1px solid var(--border-subtle)',
          }}
        >
          {/* Panel Header */}
          <div
            className="flex items-center justify-between px-4 py-2.5 flex-wrap gap-2"
            style={{
              borderBottom: '1px solid var(--border-subtle)',
              background: 'var(--accent-muted)',
            }}
          >
            <span
              className="text-[9px] font-bold tracking-[0.15em] uppercase"
              style={{ color: 'var(--accent-primary)' }}
            >
              ◈ Manajemen User
            </span>
            <div className="flex items-center gap-3">
              {usersLoading && (
                <span className="text-[9px] animate-pulse" style={{ color: 'var(--text-tertiary)' }}>
                  Memuat...
                </span>
              )}
              {!usersLoading && (
                <span className="text-[9px]" style={{ color: 'var(--text-tertiary)' }}>
                  {users.length} user
                </span>
              )}
              <button
                className="px-3 py-1 text-[9px] font-bold tracking-[0.1em] uppercase rounded-sm transition-all duration-150"
                style={{
                  background: 'var(--accent-muted)',
                  border: '1px solid var(--accent-primary)',
                  color: 'var(--accent-primary)',
                  cursor: 'pointer',
                }}
                onClick={() => { setEditUser(null); setShowForm(true) }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(0,255,136,0.2)'
                  e.currentTarget.style.boxShadow = 'var(--accent-glow)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'var(--accent-muted)'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              >
                + Tambah User
              </button>
            </div>
          </div>

          {/* Content */}
          {usersError ? (
            <div className="p-4">
              <div
                className="px-3 py-2.5 rounded-sm text-[10px] flex items-center justify-between flex-wrap gap-2"
                style={{
                  background: 'var(--color-danger-subtle)',
                  border: '1px solid var(--color-danger)',
                  color: 'var(--color-danger)',
                }}
              >
                <span>⚠ Gagal memuat users: {usersError}</span>
                <button
                  onClick={loadUsers}
                  className="underline transition-opacity duration-150"
                  style={{ opacity: 0.7 }}
                  onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
                  onMouseLeave={(e) => e.currentTarget.style.opacity = '0.7'}
                >
                  Coba lagi
                </button>
              </div>
            </div>
          ) : usersLoading ? (
            <TableSkeleton rows={4} cols={6} />
          ) : users.length === 0 ? (
            <div className="p-8 text-center">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3"
                style={{ background: 'var(--surface-secondary)' }}
              >
                <span style={{ color: 'var(--text-disabled)', fontSize: '20px' }}>👤</span>
              </div>
              <p className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>
                Belum ada user terdaftar
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-[10px]">
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    {['Nama', 'Email', 'Role', 'Pos', 'Dibuat', 'Login Terakhir', ''].map(h => (
                      <th
                        key={h}
                        className="px-3 py-2 text-left whitespace-nowrap"
                        style={{
                          fontSize: '9px',
                          fontWeight: 600,
                          letterSpacing: '0.12em',
                          textTransform: 'uppercase',
                          color: 'var(--text-tertiary)',
                        }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {users.map((user, i) => (
                    <tr
                      key={user.id}
                      className="transition-colors duration-150"
                      style={{
                        borderBottom: '1px solid var(--border-subtle)',
                        background: i % 2 === 0 ? 'transparent' : 'var(--accent-muted)',
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = 'var(--surface-secondary)'}
                      onMouseLeave={(e) => e.currentTarget.style.background = i % 2 === 0 ? 'transparent' : 'var(--accent-muted)'}
                    >
                      <td className="px-3 py-2.5 font-medium whitespace-nowrap" style={{ color: 'var(--text-primary)' }}>
                        {user.nama || '—'}
                      </td>
                      <td className="px-3 py-2 font-mono max-w-[160px] truncate" style={{ color: 'var(--text-secondary)' }}>
                        {user.email}
                      </td>
                      <td className="px-3 py-2">
                        <RoleBadge role={user.role} />
                      </td>
                      <td className="px-3 py-2 font-mono font-bold" style={{ color: 'var(--accent-primary)' }}>
                        {user.pos_id || '—'}
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap" style={{ color: 'var(--text-tertiary)' }}>
                        {formatDate(user.created_at)}
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap" style={{ color: 'var(--text-tertiary)' }}>
                        {formatDate(user.last_sign_in_at)}
                      </td>
                      <td className="px-3 py-2">
                        <div className="flex gap-1">
                          <button
                            onClick={() => { setEditUser(user); setShowForm(false) }}
                            className="p-1.5 rounded-sm transition-all duration-150"
                            style={{ color: 'var(--text-tertiary)', background: 'transparent' }}
                            title="Edit user"
                            aria-label={`Edit user ${user.nama || user.email}`}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.color = 'var(--accent-primary)'
                              e.currentTarget.style.background = 'var(--accent-muted)'
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.color = 'var(--text-tertiary)'
                              e.currentTarget.style.background = 'transparent'
                            }}
                          >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDeleteUser(user)}
                            className="p-1.5 rounded-sm transition-all duration-150"
                            disabled={deletingUserId === user.id}
                            style={{
                              color: deletingUserId === user.id ? 'var(--text-disabled)' : 'var(--text-tertiary)',
                              background: 'transparent',
                              cursor: deletingUserId === user.id ? 'not-allowed' : 'pointer',
                              opacity: deletingUserId === user.id ? 'var(--disabled-opacity)' : '1',
                            }}
                            title="Hapus user"
                            aria-label={`Hapus user ${user.nama || user.email}`}
                            onMouseEnter={(e) => {
                              if (deletingUserId !== user.id) {
                                e.currentTarget.style.color = 'var(--color-danger)'
                                e.currentTarget.style.background = 'var(--color-danger-subtle)'
                              }
                            }}
                            onMouseLeave={(e) => {
                              if (deletingUserId !== user.id) {
                                e.currentTarget.style.color = 'var(--text-tertiary)'
                                e.currentTarget.style.background = 'transparent'
                              }
                            }}
                          >
                            {deletingUserId === user.id ? (
                              <span className="w-3.5 h-3.5 border border-current border-t-transparent rounded-full animate-spin inline-block" />
                            ) : (
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ) : (
        <PermissionDenied />
      )}

      {/* ── Status koneksi Supabase ──────────────────────────── */}
      <div
        className="rounded-sm overflow-hidden animate-scale-in"
        style={{
          background: 'var(--surface-primary)',
          border: '1px solid var(--border-subtle)',
          animationDelay: '100ms',
        }}
      >
        <div
          className="flex items-center justify-between px-4 py-2.5 flex-wrap gap-2"
          style={{
            borderBottom: '1px solid var(--border-subtle)',
            background: 'var(--accent-muted)',
          }}
        >
          <span
            className="text-[9px] font-bold tracking-[0.15em] uppercase"
            style={{ color: 'var(--accent-primary)' }}
          >
            ◉ Koneksi Supabase
          </span>
          <span
            className="text-[8px] font-bold px-2 py-0.5 rounded-sm"
            style={{
              color: isConfigured ? 'var(--accent-primary)' : 'var(--color-warning)',
              background: isConfigured ? 'var(--accent-muted)' : 'var(--color-warning-subtle)',
              border: `1px solid ${isConfigured ? 'var(--accent-primary)' : 'var(--color-warning)'}`,
            }}
          >
            {isConfigured ? 'CONNECTED' : 'TIDAK DIKONFIGURASI'}
          </span>
        </div>
        <div className="p-4 space-y-3">
          <div>
            <p
              className="text-[9px] mb-1.5"
              style={{
                fontWeight: 600,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: 'var(--text-tertiary)',
              }}
            >
              Supabase Project URL
            </p>
            <div className="flex items-center gap-2 flex-wrap">
              <code
                className="flex-1 font-mono text-[10px] px-2.5 py-2 rounded-sm truncate min-w-[200px]"
                style={{
                  background: 'var(--accent-muted)',
                  border: '1px solid var(--border-subtle)',
                  color: isConfigured ? 'var(--accent-primary)' : 'var(--color-warning)',
                }}
              >
                {supabaseUrl || 'VITE_SUPABASE_URL belum diset di .env'}
              </code>
              <button
                className="px-3 py-1.5 text-[9px] font-bold tracking-[0.1em] uppercase rounded-sm transition-all duration-150 flex-shrink-0"
                style={{
                  background: copied ? 'var(--accent-muted)' : 'transparent',
                  border: `1px solid ${copied ? 'var(--accent-primary)' : 'var(--border-default)'}`,
                  color: copied ? 'var(--accent-primary)' : 'var(--text-secondary)',
                  cursor: isConfigured ? 'pointer' : 'not-allowed',
                  opacity: isConfigured ? 1 : 0.5,
                }}
                onClick={handleCopyUrl}
                disabled={!isConfigured}
                onMouseEnter={(e) => { if (isConfigured && !copied) { e.currentTarget.style.borderColor = 'var(--accent-primary)'; e.currentTarget.style.color = 'var(--accent-primary)' } }}
                onMouseLeave={(e) => { if (!copied) { e.currentTarget.style.borderColor = 'var(--border-default)'; e.currentTarget.style.color = 'var(--text-secondary)' } }}
              >
                {copied ? '✓ Copied' : 'Copy'}
              </button>
            </div>
          </div>

          {!isConfigured && (
            <div
              className="px-3 py-2.5 rounded-sm animate-fade-in"
              style={{
                background: 'var(--color-warning-subtle)',
                border: '1px solid var(--color-warning)',
              }}
            >
              <p className="text-[10px] font-bold mb-1" style={{ color: 'var(--color-warning)' }}>
                ⚠ Supabase Belum Dikonfigurasi
              </p>
              <p className="text-[10px] leading-relaxed" style={{ color: 'var(--color-warning-text)' }}>
                Tambahkan file <code className="font-mono" style={{ color: 'var(--color-warning)' }}>.env</code> di folder project dengan:
              </p>
              <code
                className="block mt-2 font-mono text-[10px] px-2.5 py-2 rounded-sm"
                style={{
                  background: 'var(--surface-base)',
                  color: 'var(--accent-primary)',
                }}
              >
                VITE_SUPABASE_URL=https://xxx.supabase.co{'\n'}
                VITE_SUPABASE_ANON_KEY=eyJ...
              </code>
            </div>
          )}
        </div>
      </div>

      {/* ── Koordinat 17 Pos ────────────────────────────────── */}
      <div
        className="rounded-sm overflow-hidden animate-scale-in"
        style={{
          background: 'var(--surface-primary)',
          border: '1px solid var(--border-subtle)',
          animationDelay: '200ms',
        }}
      >
        <div
          className="flex items-center justify-between px-4 py-2.5 flex-wrap gap-2"
          style={{
            borderBottom: '1px solid var(--border-subtle)',
            background: 'var(--accent-muted)',
          }}
        >
          <span
            className="text-[9px] font-bold tracking-[0.15em] uppercase"
            style={{ color: 'var(--accent-primary)' }}
          >
            ◬ Koordinat 17 Pos Pamtas
          </span>
          <button
            className="px-3 py-1 text-[9px] font-bold tracking-[0.1em] uppercase rounded-sm transition-all duration-150"
            style={{
              background: 'transparent',
              border: '1px solid var(--border-default)',
              color: 'var(--text-secondary)',
              cursor: posList?.length ? 'pointer' : 'not-allowed',
              opacity: posList?.length ? 1 : 0.5,
            }}
            onClick={handleExportPos}
            disabled={!posList?.length}
            onMouseEnter={(e) => { if (posList?.length) { e.currentTarget.style.borderColor = 'var(--accent-primary)'; e.currentTarget.style.color = 'var(--accent-primary)' } }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border-default)'; e.currentTarget.style.color = 'var(--text-secondary)' }}
          >
            Export CSV
          </button>
        </div>
        <div className="overflow-x-auto">
          {posLoading ? (
            <TableSkeleton rows={5} cols={8} />
          ) : (
            <table className="w-full text-[10px]">
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                  {['Pos ID', 'Nama Pos', 'Desa', 'Kabupaten', 'Lat', 'Lng', 'Komandan', 'Personel'].map(h => (
                    <th
                      key={h}
                      className="px-3 py-2 text-left"
                      style={{
                        fontSize: '9px',
                        fontWeight: 600,
                        letterSpacing: '0.12em',
                        textTransform: 'uppercase',
                        color: 'var(--text-tertiary)',
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {(posList || []).map((pos, i) => (
                  <tr
                    key={pos.pos_id}
                    className="transition-colors duration-150"
                    style={{
                      borderBottom: '1px solid var(--border-subtle)',
                      background: i % 2 === 0 ? 'transparent' : 'var(--accent-muted)',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'var(--surface-secondary)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = i % 2 === 0 ? 'transparent' : 'var(--accent-muted)'}
                  >
                    <td className="px-3 py-2 font-mono font-bold" style={{ color: 'var(--accent-primary)' }}>
                      {pos.pos_id}
                    </td>
                    <td className="px-3 py-2" style={{ color: 'var(--text-primary)' }}>
                      {pos.nama_pos}
                    </td>
                    <td className="px-3 py-2" style={{ color: 'var(--text-tertiary)' }}>
                      {pos.lokasi_desa || '—'}
                    </td>
                    <td className="px-3 py-2" style={{ color: 'var(--text-tertiary)' }}>
                      {pos.kabupaten || '—'}
                    </td>
                    <td className="px-3 py-2 font-mono" style={{ color: 'var(--text-secondary)' }}>
                      {pos.lat || '—'}
                    </td>
                    <td className="px-3 py-2 font-mono" style={{ color: 'var(--text-secondary)' }}>
                      {pos.lng || '—'}
                    </td>
                    <td className="px-3 py-2" style={{ color: 'var(--text-tertiary)' }}>
                      {pos.komandan_pos || '—'}
                    </td>
                    <td className="px-3 py-2 font-mono" style={{ color: 'var(--text-secondary)' }}>
                      {pos.jumlah_personel || '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* ── Info sistem ─────────────────────────────────────── */}
      <div
        className="rounded-sm overflow-hidden animate-scale-in"
        style={{
          background: 'var(--surface-primary)',
          border: '1px solid var(--border-subtle)',
          animationDelay: '300ms',
        }}
      >
        <div
          className="px-4 py-2.5"
          style={{
            borderBottom: '1px solid var(--border-subtle)',
            background: 'var(--accent-muted)',
          }}
        >
          <span
            className="text-[9px] font-bold tracking-[0.15em] uppercase"
            style={{ color: 'var(--accent-primary)' }}
          >
            ◈ Informasi Sistem
          </span>
        </div>
        <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-1">
          {[
            ['Aplikasi',       'Command Center Pamtas RI-MLY'],
            ['Satuan',         'YONKAV 8/NSW Ta'],
            ['Tahun Anggaran', 'TA 2026'],
            ['Wilayah',        'Kalimantan Utara'],
            ['Frontend',       'React + Vite + Tailwind CSS'],
            ['Map Engine',     'Leaflet.js + OpenStreetMap'],
            ['Backend',        'Supabase (PostgreSQL + Auth + Realtime)'],
            ['Edge Functions', 'Supabase Edge Functions (Deno)'],
            ['Hosting',        'GitHub Pages'],
            ['Mode',           isConfigured ? 'Produksi (Supabase)' : 'Belum dikonfigurasi'],
          ].map(([k, v]) => (
            <div
              key={k}
              className="flex gap-3 py-2"
              style={{ borderBottom: '1px solid var(--border-subtle)' }}
            >
              <span
                className="w-36 flex-shrink-0 text-[9px]"
                style={{
                  fontWeight: 600,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: 'var(--text-tertiary)',
                }}
              >
                {k}
              </span>
              <span className="text-[10px]" style={{ color: 'var(--text-secondary)' }}>
                {v}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Modal: Tambah User ───────────────────────────────── */}
      <Modal
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        title="Tambah User Baru"
      >
        <UserForm
          posList={posList}
          onSave={handleCreateUser}
          onCancel={() => setShowForm(false)}
        />
      </Modal>

      {/* ── Modal: Edit User ─────────────────────────────────── */}
      <Modal
        isOpen={!!editUser}
        onClose={() => setEditUser(null)}
        title={`Edit User: ${editUser?.nama || editUser?.email || ''}`}
      >
        <UserForm
          initialData={editUser}
          posList={posList}
          onSave={handleUpdateUser}
          onCancel={() => setEditUser(null)}
        />
      </Modal>

    </div>
  )
}
