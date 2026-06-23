import { useState, useEffect, useCallback } from 'react'
import { usePos } from '../hooks/useSupabase'
import { useAuth } from '../context/AuthContext'
import { LoadingSpinner } from '../components/ui/LoadingSpinner'
import { Modal } from '../components/ui/Modal'
import { useToast } from '../components/ui/Toast'
import { useConfirm } from '../components/ui/ConfirmDialog'
import { exportToCSV } from '../utils/exportPDF'
import { supabase } from '../lib/supabase'
import { userManagementService } from '../services/userManagement.service'

const POS_OPTIONS = [
  'KT','AJ','TA','BB','BK','GSG','KD','SU','SK','TB','SL','SMB','SML','LB','GSL','ML','LMS'
]

const ROLE_COLOR = {
  admin:    { color: '#ffaa00', bg: 'rgba(255,170,0,0.1)',    border: 'rgba(255,170,0,0.25)'    },
  operator: { color: '#4488ff', bg: 'rgba(68,136,255,0.1)',   border: 'rgba(68,136,255,0.25)'   },
  viewer:   { color: 'rgba(200,214,229,0.4)', bg: 'rgba(200,214,229,0.05)', border: 'rgba(200,214,229,0.1)' },
}

function RoleBadge({ role }) {
  const c = ROLE_COLOR[role] || ROLE_COLOR.viewer
  return (
    <span className="text-[8px] px-1.5 py-0.5 rounded-sm uppercase tracking-wider font-bold flex-shrink-0"
      style={{ color: c.color, background: c.bg, border: `1px solid ${c.border}` }}>
      {role}
    </span>
  )
}

// ── User Form ──────────────────────────────────────────────────────────────
function UserForm({ initialData, posList, onSave, onCancel }) {
  const isEdit = !!initialData
  const [form, setForm] = useState({
    email:    initialData?.email    || '',
    password: '',
    nama:     initialData?.nama     || '',
    role:     initialData?.role     || 'viewer',
    pos_id:   initialData?.pos_id   || '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)

    if (!isEdit && (!form.email || !form.password)) {
      setError('Email dan password wajib diisi'); return
    }
    if (!form.nama) { setError('Nama wajib diisi'); return }
    if (form.role === 'operator' && !form.pos_id) {
      setError('Operator harus memiliki Pos'); return
    }

    setSubmitting(true)
    try {
      await onSave(form)
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  const inputCls = `w-full font-mono text-[10px] px-2 py-1.5 rounded-sm outline-none transition-colors
    bg-[rgba(0,255,136,0.04)] border border-[rgba(0,255,136,0.15)] text-[rgba(200,214,229,0.85)]
    focus:border-[rgba(0,255,136,0.4)] focus:bg-[rgba(0,255,136,0.06)]`
  const labelCls = 'hud-label block mb-1'

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {!isEdit && (
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelCls}>Email</label>
            <input type="email" className={inputCls} value={form.email}
              onChange={e => set('email', e.target.value)} placeholder="user@satgas.mil" required />
          </div>
          <div>
            <label className={labelCls}>Password</label>
            <input type="password" className={inputCls} value={form.password}
              onChange={e => set('password', e.target.value)} placeholder="Min. 8 karakter" required minLength={8} />
          </div>
        </div>
      )}

      {isEdit && (
        <div>
          <label className={labelCls}>Password Baru <span className="text-[rgba(200,214,229,0.3)]">(kosongkan jika tidak diubah)</span></label>
          <input type="password" className={inputCls} value={form.password}
            onChange={e => set('password', e.target.value)} placeholder="Kosongkan jika tidak diubah" minLength={8} />
        </div>
      )}

      <div>
        <label className={labelCls}>Nama Lengkap</label>
        <input type="text" className={inputCls} value={form.nama}
          onChange={e => set('nama', e.target.value)} placeholder="Nama operator / admin" required />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelCls}>Role</label>
          <select className={inputCls} value={form.role} onChange={e => set('role', e.target.value)}>
            <option value="viewer">Viewer — baca saja</option>
            <option value="operator">Operator — kelola pos sendiri</option>
            <option value="admin">Admin — akses penuh</option>
          </select>
        </div>
        <div>
          <label className={labelCls}>
            Pos <span className="text-[rgba(200,214,229,0.3)]">{form.role === 'operator' ? '(wajib)' : '(opsional)'}</span>
          </label>
          <select className={inputCls} value={form.pos_id} onChange={e => set('pos_id', e.target.value)}>
            <option value="">— Tidak ada —</option>
            {POS_OPTIONS.map(p => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>
      </div>

      {error && (
        <div className="px-3 py-2 rounded-sm text-[10px]"
          style={{ background: 'rgba(255,51,51,0.08)', border: '1px solid rgba(255,51,51,0.25)', color: '#ff3333' }}>
          ⚠ {error}
        </div>
      )}

      <div className="flex gap-2 justify-end pt-1">
        <button type="button" className="hud-btn-ghost" onClick={onCancel} disabled={submitting}>
          Batal
        </button>
        <button type="submit" className="hud-btn" disabled={submitting}>
          {submitting ? 'Menyimpan...' : (isEdit ? 'Simpan Perubahan' : 'Buat User')}
        </button>
      </div>
    </form>
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
    try {
      await userManagementService.deleteUser(user.id)
      showToast(`User "${user.nama || user.email}" berhasil dihapus`, 'success')
      loadUsers()
    } catch (err) {
      showToast('Gagal menghapus: ' + err.message, 'error')
    }
  }

  const formatDate = (iso) => {
    if (!iso) return '—'
    return new Date(iso).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })
  }

  return (
    <div className="p-4 space-y-4 fade-in max-w-4xl">

      {/* ── Header ─────────────────────────────────────────── */}
      <div>
        <h2 className="text-[rgba(200,214,229,0.85)] font-bold text-sm uppercase tracking-widest mb-1">
          ⚙ Pengaturan Sistem
        </h2>
        <p className="text-[rgba(200,214,229,0.3)] text-[10px]">
          Konfigurasi koneksi, manajemen user, dan informasi sistem
        </p>
      </div>

      {/* ── Manajemen User (admin only) ─────────────────────── */}
      {isAdmin && (
        <div className="hud-panel">
          <div className="hud-header">
            <span className="hud-title">◈ Manajemen User</span>
            <div className="flex items-center gap-2">
              {usersLoading && <span className="hud-label animate-pulse">Memuat...</span>}
              {!usersLoading && <span className="hud-label">{users.length} user</span>}
              <button className="hud-btn text-[9px] px-2" onClick={() => { setEditUser(null); setShowForm(true) }}>
                + Tambah User
              </button>
            </div>
          </div>

          {usersError ? (
            <div className="p-4">
              <div className="px-3 py-2.5 rounded-sm text-[10px]"
                style={{ background: 'rgba(255,51,51,0.06)', border: '1px solid rgba(255,51,51,0.2)', color: '#ff5555' }}>
                ⚠ Gagal memuat users: {usersError}
                <button className="ml-3 underline opacity-70 hover:opacity-100" onClick={loadUsers}>Coba lagi</button>
              </div>
            </div>
          ) : usersLoading ? (
            <LoadingSpinner text="Memuat daftar user..." />
          ) : users.length === 0 ? (
            <div className="p-6 text-center text-[rgba(200,214,229,0.3)] text-[10px]">
              Belum ada user terdaftar
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-[10px]">
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(0,255,136,0.1)' }}>
                    {['Nama', 'Email', 'Role', 'Pos', 'Dibuat', 'Login Terakhir', ''].map(h => (
                      <th key={h} className="px-3 py-2 text-left hud-label whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {users.map((user, i) => (
                    <tr key={user.id}
                      className="transition-colors hover:bg-[rgba(0,255,136,0.02)]"
                      style={{
                        borderBottom: '1px solid rgba(0,255,136,0.05)',
                        background: i % 2 === 0 ? 'transparent' : 'rgba(0,255,136,0.01)',
                      }}
                    >
                      <td className="px-3 py-2 text-[rgba(200,214,229,0.8)] font-semibold whitespace-nowrap">
                        {user.nama || '—'}
                      </td>
                      <td className="px-3 py-2 font-mono text-[rgba(200,214,229,0.5)] max-w-[160px] truncate">
                        {user.email}
                      </td>
                      <td className="px-3 py-2">
                        <RoleBadge role={user.role} />
                      </td>
                      <td className="px-3 py-2 font-mono text-[rgba(0,255,136,0.6)] font-bold">
                        {user.pos_id || '—'}
                      </td>
                      <td className="px-3 py-2 text-[rgba(200,214,229,0.35)] whitespace-nowrap">
                        {formatDate(user.created_at)}
                      </td>
                      <td className="px-3 py-2 text-[rgba(200,214,229,0.35)] whitespace-nowrap">
                        {formatDate(user.last_sign_in_at)}
                      </td>
                      <td className="px-3 py-2">
                        <div className="flex gap-1">
                          <button
                            onClick={() => { setEditUser(user); setShowForm(false) }}
                            className="p-1 rounded-sm text-[rgba(0,255,136,0.35)] hover:text-[#00ff88] hover:bg-[rgba(0,255,136,0.08)] transition-colors"
                            title="Edit user"
                          >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDeleteUser(user)}
                            className="p-1 rounded-sm text-[rgba(255,51,51,0.35)] hover:text-[#ff3333] hover:bg-[rgba(255,51,51,0.08)] transition-colors"
                            title="Hapus user"
                          >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
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
      )}

      {/* ── Status koneksi Supabase ──────────────────────────── */}
      <div className="hud-panel">
        <div className="hud-header">
          <span className="hud-title">◉ Koneksi Supabase</span>
          <span className={`hud-badge ${isConfigured ? 'hud-badge-ok' : 'hud-badge-warning'}`}>
            {isConfigured ? 'CONNECTED' : 'TIDAK DIKONFIGURASI'}
          </span>
        </div>
        <div className="p-4 space-y-3">
          <div className="flex items-start gap-3">
            <div className="flex-1">
              <p className="hud-label mb-1">Supabase Project URL</p>
              <div className="flex items-center gap-2">
                <code className="flex-1 font-mono text-[10px] px-2 py-1.5 rounded-sm truncate"
                  style={{
                    background: 'rgba(0,255,136,0.04)',
                    border: '1px solid rgba(0,255,136,0.15)',
                    color: isConfigured ? 'rgba(0,255,136,0.6)' : 'rgba(255,170,0,0.6)',
                  }}>
                  {supabaseUrl || 'VITE_SUPABASE_URL belum diset di .env'}
                </code>
                <button
                  className="hud-btn text-[9px] px-2 flex-shrink-0"
                  onClick={handleCopyUrl}
                  disabled={!isConfigured}
                >
                  {copied ? '✓ Copied' : 'Copy'}
                </button>
              </div>
            </div>
          </div>

          {!isConfigured && (
            <div className="px-3 py-2.5 rounded-sm"
              style={{ background: 'rgba(255,170,0,0.06)', border: '1px solid rgba(255,170,0,0.2)' }}>
              <p className="text-[#ffaa00] text-[10px] font-bold mb-1">⚠ Supabase Belum Dikonfigurasi</p>
              <p className="text-[rgba(255,170,0,0.65)] text-[10px] leading-relaxed">
                Tambahkan file <code className="font-mono">.env</code> di folder project dengan:
              </p>
              <code className="block mt-2 font-mono text-[10px] px-2 py-1.5 rounded-sm"
                style={{ background: 'rgba(0,0,0,0.3)', color: 'rgba(0,255,136,0.6)' }}>
                VITE_SUPABASE_URL=https://xxx.supabase.co{'\n'}
                VITE_SUPABASE_ANON_KEY=eyJ...
              </code>
            </div>
          )}
        </div>
      </div>

      {/* ── Koordinat 17 Pos ────────────────────────────────── */}
      <div className="hud-panel">
        <div className="hud-header">
          <span className="hud-title">◬ Koordinat 17 Pos Satgas</span>
          <button className="hud-btn text-[9px] px-2" onClick={handleExportPos} disabled={!posList?.length}>
            Export CSV
          </button>
        </div>
        <div className="overflow-x-auto">
          {posLoading ? (
            <LoadingSpinner text="Memuat data pos..." />
          ) : (
            <table className="w-full text-[10px]">
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(0,255,136,0.1)' }}>
                  {['Pos ID', 'Nama Pos', 'Desa', 'Kabupaten', 'Lat', 'Lng', 'Komandan', 'Personel'].map(h => (
                    <th key={h} className="px-3 py-2 text-left hud-label">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {(posList || []).map((pos, i) => (
                  <tr key={pos.pos_id} className="transition-colors"
                    style={{
                      borderBottom: '1px solid rgba(0,255,136,0.05)',
                      background: i % 2 === 0 ? 'transparent' : 'rgba(0,255,136,0.015)',
                    }}
                  >
                    <td className="px-3 py-2 font-mono text-[rgba(0,255,136,0.7)] font-bold">{pos.pos_id}</td>
                    <td className="px-3 py-2 text-[rgba(200,214,229,0.7)]">{pos.nama_pos}</td>
                    <td className="px-3 py-2 text-[rgba(200,214,229,0.45)]">{pos.lokasi_desa || '—'}</td>
                    <td className="px-3 py-2 text-[rgba(200,214,229,0.45)]">{pos.kabupaten || '—'}</td>
                    <td className="px-3 py-2 font-mono text-[rgba(200,214,229,0.5)]">{pos.lat || '—'}</td>
                    <td className="px-3 py-2 font-mono text-[rgba(200,214,229,0.5)]">{pos.lng || '—'}</td>
                    <td className="px-3 py-2 text-[rgba(200,214,229,0.45)]">{pos.komandan_pos || '—'}</td>
                    <td className="px-3 py-2 font-mono text-[rgba(200,214,229,0.5)]">{pos.jumlah_personel || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* ── Info sistem ─────────────────────────────────────── */}
      <div className="hud-panel">
        <div className="hud-header">
          <span className="hud-title">◈ Informasi Sistem</span>
        </div>
        <div className="p-4 grid grid-cols-2 gap-x-8 gap-y-2">
          {[
            ['Aplikasi',       'Command Center Satgas Pamtas RI-MAL'],
            ['Satuan',         'YONKAV 8/NSW'],
            ['Tahun Anggaran', 'TA 2026'],
            ['Wilayah',        'Kalimantan Utara'],
            ['Frontend',       'React + Vite + Tailwind CSS'],
            ['Map Engine',     'Leaflet.js + OpenStreetMap'],
            ['Backend',        'Supabase (PostgreSQL + Auth + Realtime)'],
            ['Edge Functions', 'Supabase Edge Functions (Deno)'],
            ['Hosting',        'GitHub Pages'],
            ['Mode',           isConfigured ? 'Produksi (Supabase)' : 'Belum dikonfigurasi'],
          ].map(([k, v]) => (
            <div key={k} className="flex gap-3 py-1" style={{ borderBottom: '1px solid rgba(0,255,136,0.04)' }}>
              <span className="hud-label w-36 flex-shrink-0">{k}</span>
              <span className="text-[rgba(200,214,229,0.6)] text-[10px]">{v}</span>
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
