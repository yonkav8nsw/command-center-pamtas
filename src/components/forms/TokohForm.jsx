import { useState } from 'react'
import { TOKOH_CATEGORIES } from '../../constants/kerawananCategories'

export function TokohForm({ initialData, posId, onSave, onCancel }) {
  const [form, setForm] = useState({
    nama:      initialData?.nama      || '',
    kategori:  initialData?.kategori  || 'Adat',
    jabatan:   initialData?.jabatan   || '',
    alamat:    initialData?.alamat    || '',
    no_telp:   initialData?.no_telp   || '',
    catatan:   initialData?.catatan   || '',
  })
  const [saving, setSaving] = useState(false)

  const set = (key) => (e) => setForm(f => ({ ...f, [key]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.nama.trim()) return alert('Nama tidak boleh kosong')
    setSaving(true)
    try {
      await onSave(form)
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <FormField label="Nama Lengkap *" colSpan={2}>
          <input
            className="hud-input"
            value={form.nama}
            onChange={set('nama')}
            placeholder="Nama tokoh"
            required
          />
        </FormField>

        <FormField label="Kategori">
          <select className="hud-select" value={form.kategori} onChange={set('kategori')}>
            {(TOKOH_CATEGORIES || ['Adat', 'Masyarakat', 'Agama']).map(k => (
              <option key={k} value={k}>{k}</option>
            ))}
          </select>
        </FormField>

        <FormField label="Jabatan">
          <input
            className="hud-input"
            value={form.jabatan}
            onChange={set('jabatan')}
            placeholder="Jabatan / posisi"
          />
        </FormField>

        <FormField label="Alamat" colSpan={2}>
          <input
            className="hud-input"
            value={form.alamat}
            onChange={set('alamat')}
            placeholder="Alamat lengkap"
          />
        </FormField>

        <FormField label="No. Telepon" colSpan={2}>
          <input
            className="hud-input"
            value={form.no_telp}
            onChange={set('no_telp')}
            placeholder="08xx-xxxx-xxxx"
            type="tel"
          />
        </FormField>

        <FormField label="Catatan" colSpan={2}>
          <textarea
            className="hud-input resize-none"
            rows={3}
            value={form.catatan}
            onChange={set('catatan')}
            placeholder="Catatan tambahan (opsional)"
          />
        </FormField>
      </div>

      <FormActions onCancel={onCancel} saving={saving} />
    </form>
  )
}

/* ── Shared helpers ─────────────────────────────────────── */
export function FormField({ label, children, colSpan }) {
  return (
    <div className={colSpan === 2 ? 'col-span-2' : ''}>
      <label className="block hud-label mb-1">{label}</label>
      {children}
    </div>
  )
}

export function FormActions({ onCancel, saving, submitLabel = 'Simpan' }) {
  return (
    <div className="flex gap-2 pt-2 border-t border-[rgba(0,255,136,0.1)]">
      <button
        type="button"
        onClick={onCancel}
        className="hud-btn hud-btn-danger flex-1"
        disabled={saving}
      >
        Batal
      </button>
      <button
        type="submit"
        className="hud-btn flex-1"
        disabled={saving}
      >
        {saving ? 'Menyimpan…' : submitLabel}
      </button>
    </div>
  )
}
